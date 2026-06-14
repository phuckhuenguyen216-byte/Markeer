import { NextRequest, NextResponse } from "next/server";
import { validateAdminRequest } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { TEAM_FILTERS, type RecruitmentPosition } from "@/lib/recruitment";
import { logRecruitmentActivity } from "@/lib/recruitment-activity-log";

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
    const updates: Record<string, unknown> = {};

    if (typeof body.is_active === "boolean") {
      updates.is_active = body.is_active;
    }

    if (typeof body.team === "string") {
      if (!VALID_TEAMS.has(body.team)) {
        return NextResponse.json(
          { error: "Team không hợp lệ" },
          { status: 400 },
        );
      }
      updates.team = body.team;
    }

    if (body.sort_order !== undefined) {
      updates.sort_order = Number(body.sort_order) || 0;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "Không có gì để cập nhật" },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdmin();
    const { data: current } = await supabase
      .from("recruitment_positions")
      .select("id,label,team,sort_order,is_active")
      .eq("id", id)
      .single();

    const { data, error } = await supabase
      .from("recruitment_positions")
      .update(updates)
      .eq("id", id)
      .select("id,label,team,sort_order,is_active")
      .single();

    if (error) throw error;
    const position = toPosition(data);
    await logRecruitmentActivity({
      actor: user,
      action: "position.update",
      entityType: "position",
      entityId: position.id,
      entityLabel: position.label,
      details: {
        from: current
          ? {
              team: current.team,
              sort_order: current.sort_order,
              is_active: current.is_active,
            }
          : null,
        to: {
          team: position.team,
          sort_order: position.sort_order,
          is_active: position.is_active,
        },
      },
    });

    return NextResponse.json({ position });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Lỗi cập nhật vị trí tuyển dụng",
      },
      { status: 500 },
    );
  }
}
