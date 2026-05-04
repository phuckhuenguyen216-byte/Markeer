import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { isValidEmail, isValidPhone, isValidUrl } from "@/lib/application";
import { appendToSheet } from "@/lib/google-sheets";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { validateCsrfToken } from "@/lib/csrf";
import { validateAdminRequest } from "@/lib/admin-auth";

/** Strip HTML tags to prevent stored XSS */
function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim();
}

// ──────────────────────────────────────────────
// GET /api/applications — List (admin)
// ──────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const user = await validateAdminRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const team = searchParams.get("team");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "50");
    const page = parseInt(searchParams.get("page") || "1");
    const offset = (page - 1) * limit;

    const supabase = getSupabaseAdmin();
    let query = supabase
      .from("applications")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    if (team) {
      query = query.contains("career_journey", JSON.stringify([team]));
    }

    if (search) {
      // Sanitize: strip characters that could manipulate PostgREST filter
      const safeSearch = search.replace(/[(),."'\\]/g, "").trim();
      if (safeSearch) {
        query = query.or(
          `full_name.ilike.%${safeSearch}%,email.ilike.%${safeSearch}%,phone.ilike.%${safeSearch}%`,
        );
      }
    }

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error("[GET /api/applications] Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      applications: data,
      total: count,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

// ──────────────────────────────────────────────
// POST /api/applications — Submit application (public)
// ──────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 submissions per IP per 15 minutes
    const ip = getClientIp(request);
    const { limited, remaining, resetAt } = rateLimit(ip, 5, 15 * 60 * 1000);
    if (limited) {
      return NextResponse.json(
        { errors: ["Bạn đã gửi quá nhiều lần. Vui lòng thử lại sau."] },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((resetAt - Date.now()) / 1000)),
            "X-RateLimit-Remaining": "0",
          },
        },
      );
    }

    const body = await request.json();

    // CSRF validation
    const csrfToken = request.headers.get("x-csrf-token");
    if (!csrfToken || !validateCsrfToken(csrfToken)) {
      return NextResponse.json(
        { errors: ["Phiên làm việc hết hạn. Vui lòng tải lại trang."] },
        { status: 403 },
      );
    }

    // ── Validate required fields ──
    const errors: string[] = [];

    if (!body.email?.trim()) errors.push("Email là bắt buộc");
    else if (!isValidEmail(body.email.trim()))
      errors.push("Email không hợp lệ");

    if (!body.career_journey?.length)
      errors.push("Vui lòng chọn ít nhất 1 vị trí");
    if (!body.interest_reason?.length)
      errors.push("Vui lòng chọn điều hứng thú");
    if (!body.why_apply?.trim())
      errors.push("Vui lòng cho biết lý do ứng tuyển");

    if (!body.strengths?.trim()) errors.push("Vui lòng chia sẻ điểm mạnh");
    if (!body.weaknesses?.trim())
      errors.push("Vui lòng chia sẻ điểm cần cải thiện");
    if (!body.problem_solving?.length)
      errors.push("Vui lòng chọn cách xử lý vấn đề");
    if (!body.feedback_response?.length)
      errors.push("Vui lòng chọn cách phản hồi góp ý");

    if (!body.full_name?.trim()) errors.push("Họ tên là bắt buộc");
    if (!body.dob?.trim()) errors.push("Ngày sinh là bắt buộc");
    if (!body.phone?.trim()) errors.push("Số điện thoại là bắt buộc");
    else if (!isValidPhone(body.phone.trim()))
      errors.push("Số điện thoại không hợp lệ");
    if (
      body.has_telegram &&
      !/^@[A-Za-z0-9_]{5,32}$/.test((body.telegram_username || "").trim())
    )
      errors.push("Telegram username không hợp lệ");
    if (!body.school?.trim()) errors.push("Trường học là bắt buộc");

    if (body.cv?.trim() && !isValidUrl(body.cv.trim()))
      errors.push("Link CV không hợp lệ");

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // ── Duplicate check by email (within 24h) ──
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: existing } = await supabase
      .from("applications")
      .select("id")
      .eq("email", body.email.trim().toLowerCase())
      .gte("created_at", oneDayAgo)
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json(
        {
          errors: [
            "Bạn đã nộp hồ sơ trong 24 giờ qua. Vui lòng đợi hoặc liên hệ team.",
          ],
        },
        { status: 409 },
      );
    }

    const contactNotes = [
      body.is_zalo_phone ? "SĐT trên cũng là Zalo." : "",
      body.has_telegram && body.telegram_username
        ? `Telegram: ${body.telegram_username.trim()}`
        : "",
    ]
      .filter(Boolean)
      .join("\n");

    // ── Insert (sanitize text fields to prevent stored XSS) ──
    const insert = {
      email: body.email.trim().toLowerCase(),
      career_journey: body.career_journey || [],
      interest_reason: body.interest_reason || [],
      why_apply: stripHtml(body.why_apply || ""),
      experience: stripHtml(body.experience || ""),
      skills: stripHtml(body.skills || ""),
      goal: stripHtml(body.goal || ""),
      work_preference: body.work_preference || {},
      note: stripHtml(body.note || ""),
      strengths: stripHtml(body.strengths || ""),
      weaknesses: stripHtml(body.weaknesses || ""),
      expectation: stripHtml(body.expectation || ""),
      problem_solving: body.problem_solving || [],
      feedback_response: body.feedback_response || [],
      full_name: stripHtml(body.full_name || ""),
      dob: body.dob || null,
      phone: (body.phone || "").trim(),
      school: stripHtml(body.school || ""),
      enrollment: body.enrollment || null,
      graduation: body.graduation || null,
      cv: (body.cv || "").trim(),
      status: "new",
      admin_notes: contactNotes,
    };

    const { data, error } = await supabase
      .from("applications")
      .insert(insert)
      .select()
      .single();

    if (error) {
      console.error("Insert error:", error);
      return NextResponse.json(
        { errors: ["Lỗi lưu hồ sơ. Vui lòng thử lại."] },
        { status: 500 },
      );
    }

    // Auto-sync to Google Sheets (fire-and-forget)
    appendToSheet(data).catch(() => {});

    return NextResponse.json({ success: true, id: data.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
