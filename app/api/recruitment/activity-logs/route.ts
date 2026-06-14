import { NextRequest, NextResponse } from "next/server";
import { validateAdminRequest } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import type { RecruitmentActivityLog } from "@/lib/recruitment-activity-log";

function toLog(row: Record<string, unknown>): RecruitmentActivityLog {
  return {
    id: String(row.id),
    actor_id: row.actor_id ? String(row.actor_id) : null,
    actor_email: row.actor_email ? String(row.actor_email) : null,
    action: String(row.action),
    entity_type: String(row.entity_type),
    entity_id: row.entity_id ? String(row.entity_id) : null,
    entity_label: row.entity_label ? String(row.entity_label) : null,
    details:
      row.details && typeof row.details === "object"
        ? (row.details as Record<string, unknown>)
        : {},
    created_at: String(row.created_at),
  };
}

export async function GET(request: NextRequest) {
  const user = await validateAdminRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const rawLimit = Number(searchParams.get("limit") || 100);
    const limit = Number.isFinite(rawLimit)
      ? Math.min(Math.max(rawLimit, 1), 200)
      : 100;

    const { data, error } = await getSupabaseAdmin()
      .from("recruitment_activity_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    return NextResponse.json({
      logs: (data || []).map((row) => toLog(row)),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Không tải được nhật ký",
      },
      { status: 500 },
    );
  }
}
