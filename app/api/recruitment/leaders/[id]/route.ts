import { NextRequest, NextResponse } from "next/server";
import { validateAdminRequest } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import {
  LEADER_TEAMS,
  type LeaderTeam,
  type RecruitmentLeader,
} from "@/lib/recruitment";

const VALID_TEAMS = new Set<LeaderTeam>(LEADER_TEAMS.map((team) => team.value));

function sanitizeName(value: unknown) {
  return typeof value === "string" ? value.replace(/<[^>]*>/g, "").trim() : "";
}

function sanitizeTeam(value: unknown): LeaderTeam | null {
  return typeof value === "string" && VALID_TEAMS.has(value as LeaderTeam)
    ? (value as LeaderTeam)
    : null;
}

function toLeader(row: Record<string, unknown>): RecruitmentLeader {
  return {
    id: String(row.id),
    name: String(row.name),
    team: row.team as LeaderTeam,
  };
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await validateAdminRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const name = sanitizeName(body.name);
    const team = sanitizeTeam(body.team);

    if (!id || !name || !team) {
      return NextResponse.json(
        { error: "Tên leader hoặc team không hợp lệ" },
        { status: 400 },
      );
    }

    const { data, error } = await getSupabaseAdmin()
      .from("recruitment_leaders")
      .update({ name, team, is_active: true })
      .eq("id", id)
      .select("id,name,team")
      .single();

    if (error) throw error;
    return NextResponse.json({ leader: toLeader(data) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Lỗi sửa leader" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await validateAdminRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Thiếu leader id" }, { status: 400 });
    }

    const { error } = await getSupabaseAdmin()
      .from("recruitment_leaders")
      .update({ is_active: false })
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Lỗi xóa leader" },
      { status: 500 },
    );
  }
}
