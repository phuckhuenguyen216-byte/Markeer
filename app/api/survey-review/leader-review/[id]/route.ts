import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { validateAdminRequest } from "@/lib/admin-auth";

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim();
}

// GET /api/survey-review/leader-review/[id] - Fetch single leader review details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await validateAdminRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("leader_reviews")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Không tìm thấy khảo sát" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("[GET /api/survey-review/leader-review/[id]] Error:", err);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

// PUT /api/survey-review/leader-review/[id] - Admin edit and approve leader review
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await validateAdminRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const supabase = getSupabaseAdmin();

    const updateData = {
      member_name: stripHtml(body.member_name || ""),
      current_level: body.current_level,
      target_level: body.target_level,
      review_period: stripHtml(body.review_period || ""),
      assigned_mentors_leaders: body.assigned_mentors_leaders,
      management_time: stripHtml(body.management_time || ""),
      answers: body.answers || [],
      status: body.status || "Đang xem xét",
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from("leader_reviews")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[PUT /api/survey-review/leader-review/[id]] Error:", error);
      return NextResponse.json({ error: "Lỗi khi cập nhật khảo sát" }, { status: 500 });
    }

    return NextResponse.json({ success: true, review: data });
  } catch (err) {
    console.error("[PUT /api/survey-review/leader-review/[id]] Error:", err);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
