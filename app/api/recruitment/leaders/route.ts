import { NextRequest, NextResponse } from "next/server";
import { validateAdminRequest } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import {
  DEFAULT_LEADERS,
  LEADER_TEAMS,
  type LeaderTeam,
  type RecruitmentLeader,
} from "@/lib/recruitment";
import { logRecruitmentActivity } from "@/lib/recruitment-activity-log";

const VALID_TEAMS = new Set<LeaderTeam>(LEADER_TEAMS.map((team) => team.value));

function sanitizeName(value: unknown) {
  return typeof value === "string" ? value.replace(/<[^>]*>/g, "").trim() : "";
}

function sanitizeTeam(value: unknown): LeaderTeam | null {
  return typeof value === "string" && VALID_TEAMS.has(value as LeaderTeam)
    ? (value as LeaderTeam)
    : null;
}

async function ensureDefaultLeaders() {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("recruitment_leaders")
    .upsert(DEFAULT_LEADERS, { onConflict: "id", ignoreDuplicates: true });
  if (error) throw error;
}

function toLeader(row: Record<string, unknown>): RecruitmentLeader {
  return {
    id: String(row.id),
    name: String(row.name),
    team: row.team as LeaderTeam,
  };
}

export async function GET(request: NextRequest) {
  const user = await validateAdminRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getSupabaseAdmin();
    let { data, error } = await supabase
      .from("recruitment_leaders")
      .select("id,name,team")
      .eq("is_active", true)
      .order("created_at", { ascending: true });

    if (error) throw error;

    if (!data || data.length === 0) {
      await ensureDefaultLeaders();
      const result = await supabase
        .from("recruitment_leaders")
        .select("id,name,team")
        .eq("is_active", true)
        .order("created_at", { ascending: true });
      data = result.data;
      error = result.error;
      if (error) throw error;
    }

    return NextResponse.json({
      leaders: (data || []).map((row) => toLeader(row)),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Lỗi tải leader" },
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
    const name = sanitizeName(body.name);
    const team = sanitizeTeam(body.team);

    if (!name || !team) {
      return NextResponse.json(
        { error: "Tên leader hoặc team không hợp lệ" },
        { status: 400 },
      );
    }

    const { data, error } = await getSupabaseAdmin()
      .from("recruitment_leaders")
      .insert({ name, team })
      .select("id,name,team")
      .single();

    if (error) throw error;
    const leader = toLeader(data);
    await logRecruitmentActivity({
      actor: user,
      action: "leader.create",
      entityType: "leader",
      entityId: leader.id,
      entityLabel: leader.name,
      details: { team: leader.team },
    });

    return NextResponse.json({ leader }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Lỗi thêm leader" },
      { status: 500 },
    );
  }
}
