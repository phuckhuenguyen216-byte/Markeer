import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { validateCsrfToken } from "@/lib/csrf";
import { validateAdminRequest } from "@/lib/admin-auth";

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim();
}

// GET /api/survey-review/leader-review - List all leader reviews for Admin
export async function GET(request: NextRequest) {
  const user = await validateAdminRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "25");
    const page = parseInt(searchParams.get("page") || "1");
    const offset = (page - 1) * limit;

    const supabase = getSupabaseAdmin();
    let query = supabase
      .from("leader_reviews")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (search) {
      const safeSearch = search.replace(/[(),."'\\]/g, "").trim();
      if (safeSearch) {
        query = query.or(`member_name.ilike.%${safeSearch}%`);
      }
    }

    query = query.range(offset, offset + limit - 1);
    const { data, error, count } = await query;

    if (error) {
      console.error("[GET /api/survey-review/leader-review] Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      reviews: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (err) {
    console.error("[GET /api/survey-review/leader-review] Error:", err);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

// POST /api/survey-review/leader-review - Submit leader review (Public)
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const { limited } = rateLimit(`${ip}:leader-review-submit`, 5, 15 * 60 * 1000);
    if (limited) {
      return NextResponse.json(
        { errors: ["Bạn gửi khảo sát quá nhanh. Vui lòng thử lại sau."] },
        { status: 429 }
      );
    }

    const body = await request.json();

    const csrfToken = request.headers.get("x-csrf-token");
    if (!csrfToken || !validateCsrfToken(csrfToken)) {
      return NextResponse.json(
        { errors: ["Phiên làm việc hết hạn. Vui lòng tải lại trang."] },
        { status: 403 }
      );
    }

    // Validation
    const errors: string[] = [];
    if (!body.member_name?.trim()) errors.push("Tên Member được đánh giá là bắt buộc");
    if (!body.current_level?.trim()) errors.push("Level hiện tại là bắt buộc");
    if (!body.target_level?.trim()) errors.push("Level đề xuất lên là bắt buộc");
    if (!body.review_period?.trim()) errors.push("Kỳ review level là bắt buộc");
    
    if (!body.assigned_mentors_leaders || typeof body.assigned_mentors_leaders !== "object") {
      errors.push("Thông tin Leader / Reviewer phụ trách không hợp lệ");
    }

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const insertData = {
      member_name: stripHtml(body.member_name),
      current_level: body.current_level,
      target_level: body.target_level,
      review_period: stripHtml(body.review_period),
      assigned_mentors_leaders: body.assigned_mentors_leaders,
      management_time: stripHtml(body.management_time || ""),
      answers: body.answers || [],
      status: "Đang xem xét"
    };

    const { data, error } = await supabase
      .from("leader_reviews")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("[POST /api/survey-review/leader-review] Insert error:", error);
      return NextResponse.json(
        { errors: ["Lỗi lưu khảo sát. Vui lòng thử lại."] },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, review: data });
  } catch (err) {
    console.error("[POST /api/survey-review/leader-review] Error:", err);
    return NextResponse.json(
      { errors: ["Lỗi server hệ thống."] },
      { status: 500 }
    );
  }
}
