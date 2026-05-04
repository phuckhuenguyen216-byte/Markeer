/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { validateAdminRequest } from "@/lib/admin-auth";

// GET /api/blogs/[id] — Lấy chi tiết bài viết (theo id hoặc slug)
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const supabase = getSupabaseAdmin();
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        id,
      );

    let query;
    if (isUUID) {
      query = supabase
        .from("markee_blog_posts")
        .select("*")
        .eq("id", id)
        .single();
    } else {
      query = supabase
        .from("markee_blog_posts")
        .select("*")
        .eq("slug", id)
        .single();
    }

    const { data, error } = await query;

    if (error || !data) {
      return NextResponse.json(
        { error: "Không tìm thấy bài viết" },
        { status: 404 },
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

// PUT /api/blogs/[id] — Cập nhật bài viết
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

    if (body.status === "published" && !body.published_at) {
      body.published_at = new Date().toISOString();
    }

    const supabase = getSupabaseAdmin();
    const { id: _bodyId, created_at: _ca, ...updateData } = body;

    const { data, error } = await supabase
      .from("markee_blog_posts")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, post: data });
  } catch {
    return NextResponse.json({ error: "Cập nhật thất bại" }, { status: 500 });
  }
}

// DELETE /api/blogs/[id] — Xóa bài viết
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
    const { error } = await supabase
      .from("markee_blog_posts")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Xóa thất bại" }, { status: 500 });
  }
}
