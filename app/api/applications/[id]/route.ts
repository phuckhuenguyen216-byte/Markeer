/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { deleteFromSheet, updateRowInSheet } from "@/lib/google-sheets";
import { validateAdminRequest } from "@/lib/admin-auth";
import { getRecruitmentMeta, upsertRecruitmentMeta } from "@/lib/recruitment";

const VALID_STATUSES = [
  "new",
  "reviewing",
  "interviewed",
  "accepted",
  "rejected",
  "resigned",
];

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

// PUT /api/applications/[id] — Update status / notes
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

    const updates: Record<string, any> = {};
    let currentAdminNotes: string | null = null;

    if (body.status === "accepted" && body.admin_notes === undefined) {
      const { data: current } = await supabase
        .from("applications")
        .select("admin_notes")
        .eq("id", id)
        .single();
      currentAdminNotes = current?.admin_notes || "";
    }
    if (body.status !== undefined) {
      if (!VALID_STATUSES.includes(body.status)) {
        return NextResponse.json(
          { error: "Trạng thái không hợp lệ" },
          { status: 400 },
        );
      }
      updates.status = body.status;
    }
    if (body.admin_notes !== undefined) updates.admin_notes = body.admin_notes;

    if (body.status === "accepted") {
      const sourceNotes = String(updates.admin_notes ?? currentAdminNotes ?? "");
      const meta = getRecruitmentMeta(sourceNotes);
      if (!meta.startLevelDate) {
        meta.startLevelDate = new Date().toISOString().slice(0, 10);
        updates.admin_notes = upsertRecruitmentMeta(sourceNotes, meta);
      }
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

    const { error } = await supabase.from("applications").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Sync delete to Google Sheets (fire-and-forget)
    deleteFromSheet(id).catch(() => {});

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
