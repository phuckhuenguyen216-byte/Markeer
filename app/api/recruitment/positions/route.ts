import { NextRequest, NextResponse } from "next/server";
import { validateAdminRequest } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import {
  DEFAULT_RECRUITMENT_POSITIONS,
  TEAM_FILTERS,
  type RecruitmentPosition,
} from "@/lib/recruitment";

const VALID_TEAMS = new Set(TEAM_FILTERS.filter((team) => team !== "all"));

function toPosition(row: Record<string, unknown>): RecruitmentPosition {
  return {
    id: String(row.id),
    label: String(row.label),
    team: String(row.team),
    sort_order: Number(row.sort_order) || 0,
    is_active: Boolean(row.is_active),
  };
}

async function ensureDefaultPositions() {
  const { error } = await getSupabaseAdmin()
    .from("recruitment_positions")
    .upsert(DEFAULT_RECRUITMENT_POSITIONS, {
      onConflict: "id",
      ignoreDuplicates: true,
    });

  if (error) throw error;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const includeInactive = searchParams.get("includeInactive") === "1";

  if (includeInactive) {
    const user = await validateAdminRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const supabase = getSupabaseAdmin();
    let query = supabase
      .from("recruitment_positions")
      .select("id,label,team,sort_order,is_active")
      .order("sort_order", { ascending: true })
      .order("label", { ascending: true });

    if (!includeInactive) query = query.eq("is_active", true);

    let { data, error } = await query;
    if (error) throw error;

    if (includeInactive && (!data || data.length === 0)) {
      await ensureDefaultPositions();
      const result = await supabase
        .from("recruitment_positions")
        .select("id,label,team,sort_order,is_active")
        .order("sort_order", { ascending: true })
        .order("label", { ascending: true });
      data = result.data;
      error = result.error;
      if (error) throw error;
    }

    return NextResponse.json({
      positions: (data || []).map((row) => toPosition(row)),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Lỗi tải vị trí tuyển dụng",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const user = await validateAdminRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const label =
      typeof body.label === "string" ? body.label.replace(/<[^>]*>/g, "").trim() : "";
    const team = typeof body.team === "string" ? body.team : "";

    if (!label || !VALID_TEAMS.has(team)) {
      return NextResponse.json(
        { error: "Vị trí hoặc team không hợp lệ" },
        { status: 400 },
      );
    }

    const id = label
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const { data, error } = await getSupabaseAdmin()
      .from("recruitment_positions")
      .insert({
        id,
        label,
        team,
        sort_order: Number(body.sort_order) || 999,
        is_active: body.is_active !== false,
      })
      .select("id,label,team,sort_order,is_active")
      .single();

    if (error) throw error;
    return NextResponse.json({ position: toPosition(data) }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Lỗi thêm vị trí tuyển dụng",
      },
      { status: 500 },
    );
  }
}
