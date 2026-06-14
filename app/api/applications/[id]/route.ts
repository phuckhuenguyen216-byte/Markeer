/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { deleteFromSheet, updateRowInSheet } from "@/lib/google-sheets";
import { validateAdminRequest } from "@/lib/admin-auth";
import {
  getRecruitmentMeta,
  upsertRecruitmentMeta,
  type LeaderTeam,
  type RecruitmentLeader,
} from "@/lib/recruitment";
import { logRecruitmentActivity } from "@/lib/recruitment-activity-log";

const VALID_STATUSES = [
  "new",
  "reviewing",
  "interviewed",
  "accepted",
  "rejected",
  "resigned",
];

const REVIEWING_STATUSES = new Set(["new", "reviewing", "interviewed"]);

function makeApplicationChanges(
  previous: Record<string, any>,
  next: Record<string, any>,
) {
  const previousMeta = getRecruitmentMeta(previous.admin_notes || "");
  const nextMeta = getRecruitmentMeta(next.admin_notes || "");
  const previousLeader = previousMeta.leader;
  const nextLeader = nextMeta.leader;
  const changes: Record<string, unknown> = {};

  if (previous.status !== next.status) {
    changes.status = { from: previous.status, to: next.status };
  }

  if ((previousLeader?.id || "") !== (nextLeader?.id || "")) {
    changes.leader = {
      from: previousLeader
        ? {
            id: previousLeader.id,
            name: previousLeader.name,
            team: previousLeader.team,
          }
        : null,
      to: nextLeader
        ? { id: nextLeader.id, name: nextLeader.name, team: nextLeader.team }
        : null,
    };
  }

  if (
    previous.admin_notes !== next.admin_notes &&
    changes.leader === undefined
  ) {
    changes.admin_notes = { changed: true };
  }

  return changes;
}

// GET /api/applications/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await validateAdminRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Không tìm thấy hồ sơ" },
        { status: 404 },
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

// PUT /api/applications/[id] - Update status / notes / leader
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
    const supabase = getSupabaseAdmin();

    const { data: current, error: currentError } = await supabase
      .from("applications")
      .select("*")
      .eq("id", id)
      .single();

    if (currentError || !current) {
      return NextResponse.json(
        { error: "Không tìm thấy hồ sơ" },
        { status: 404 },
      );
    }

    const updates: Record<string, any> = {};
    const leaderIdProvided =
      Object.prototype.hasOwnProperty.call(body, "leaderId") ||
      Object.prototype.hasOwnProperty.call(body, "leader_id");

    if (body.status !== undefined) {
      if (!VALID_STATUSES.includes(body.status)) {
        return NextResponse.json(
          { error: "Trạng thái không hợp lệ" },
          { status: 400 },
        );
      }
      updates.status = body.status;
    }

    if (body.admin_notes !== undefined) {
      updates.admin_notes = body.admin_notes;
    }

    if (leaderIdProvided) {
      const requestedStatus = String(updates.status ?? current.status);
      if (current.status === "resigned" || requestedStatus === "resigned") {
        return NextResponse.json(
          { error: "Nhân viên đã nghỉ không thể sửa leader" },
          { status: 400 },
        );
      }

      const rawLeaderId = body.leaderId ?? body.leader_id;
      const leaderId =
        typeof rawLeaderId === "string" ? rawLeaderId.trim() : "";
      let leader: RecruitmentLeader | null = null;

      if (leaderId) {
        const { data: leaderRow, error: leaderError } = await supabase
          .from("recruitment_leaders")
          .select("id,name,team")
          .eq("id", leaderId)
          .eq("is_active", true)
          .single();

        if (leaderError || !leaderRow) {
          return NextResponse.json(
            { error: "Leader không hợp lệ" },
            { status: 400 },
          );
        }

        leader = {
          id: String(leaderRow.id),
          name: String(leaderRow.name),
          team: leaderRow.team as LeaderTeam,
        };
      }

      const sourceNotes = String(updates.admin_notes ?? current.admin_notes ?? "");
      const meta = getRecruitmentMeta(sourceNotes);
      meta.leader = leader;

      if (leader) {
        const currentOrRequestedStatus = String(updates.status ?? current.status);
        if (REVIEWING_STATUSES.has(currentOrRequestedStatus)) {
          updates.status = "accepted";
        }
        if (!meta.startLevelDate) {
          meta.startLevelDate = new Date().toISOString().slice(0, 10);
        }
        if (!meta.levels.lv1.startedAt) {
          meta.levels.lv1.startedAt = meta.startLevelDate;
        }
      }

      updates.admin_notes = upsertRecruitmentMeta(sourceNotes, meta);
    }

    if (updates.status === "accepted") {
      const sourceNotes = String(updates.admin_notes ?? current.admin_notes ?? "");
      const meta = getRecruitmentMeta(sourceNotes);
      if (!meta.startLevelDate) {
        meta.startLevelDate = new Date().toISOString().slice(0, 10);
      }
      if (!meta.levels.lv1.startedAt) {
        meta.levels.lv1.startedAt = meta.startLevelDate;
      }
      updates.admin_notes = upsertRecruitmentMeta(sourceNotes, meta);
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "Không có gì để cập nhật" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("applications")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const changes = makeApplicationChanges(current, data);
    if (Object.keys(changes).length > 0) {
      await logRecruitmentActivity({
        actor: user,
        action: "application.update",
        entityType: "application",
        entityId: id,
        entityLabel: data.full_name || current.full_name || id,
        details: { changes },
      });
    }

    // Sync update to Google Sheets (fire-and-forget)
    updateRowInSheet(data).catch(() => {});

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

// DELETE /api/applications/[id]
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
    const supabase = getSupabaseAdmin();

    const { data: current } = await supabase
      .from("applications")
      .select("id,full_name,email,status")
      .eq("id", id)
      .single();

    const { error } = await supabase.from("applications").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await logRecruitmentActivity({
      actor: user,
      action: "application.delete",
      entityType: "application",
      entityId: id,
      entityLabel: current?.full_name || id,
      details: {
        email: current?.email ?? null,
        status: current?.status ?? null,
      },
    });

    // Sync delete to Google Sheets (fire-and-forget)
    deleteFromSheet(id).catch(() => {});

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
