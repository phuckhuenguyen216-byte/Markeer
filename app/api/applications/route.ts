import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { isValidEmail, isValidPhone, isValidUrl } from "@/lib/application";
import { appendToSheet } from "@/lib/google-sheets";
import { shareOnboardingFolderWithApplicant } from "@/lib/google-drive";
import { notifyTelegramForApplication } from "@/lib/telegram";
import { sendApplicationConfirmationEmail } from "@/lib/confirmation-email";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { validateCsrfToken } from "@/lib/csrf";
import { validateAdminRequest } from "@/lib/admin-auth";

/** Strip HTML tags to prevent stored XSS */
function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim();
}

const SCHOOL_MAJOR_PATTERN =
  /^[^()\n]{3,}\s*\([A-Za-z0-9._-]{2,20}\)\s*[-–—]\s*[^()\n]{2,}$/;

function isValidSchoolMajorFormat(value: string) {
  return SCHOOL_MAJOR_PATTERN.test(value.trim());
}

function normalizeInterestReasons(value: unknown, otherValue: unknown) {
  if (!Array.isArray(value)) return [];
  const other = typeof otherValue === "string" ? stripHtml(otherValue) : "";
  return value
    .map((item) => {
      const text = typeof item === "string" ? stripHtml(item) : "";
      if (text === "Khác" && other) return `Khác: ${other}`;
      return text;
    })
    .filter(Boolean);
}

async function getActiveRecruitmentPositionLabels() {
  const { data, error } = await getSupabaseAdmin()
    .from("recruitment_positions")
    .select("label")
    .eq("is_active", true);

  if (error) throw error;
  return new Set((data || []).map((row) => String(row.label)));
}

// GET /api/applications - List applications for admin
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

// POST /api/applications - Submit public application
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const { limited, resetAt } = rateLimit(ip, 5, 15 * 60 * 1000);
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

    const csrfToken = request.headers.get("x-csrf-token");
    if (!csrfToken || !validateCsrfToken(csrfToken)) {
      return NextResponse.json(
        { errors: ["Phiên làm việc hết hạn. Vui lòng tải lại trang."] },
        { status: 403 },
      );
    }

    const errors: string[] = [];
    const interestReasons = normalizeInterestReasons(
      body.interest_reason,
      body.interest_other,
    );
    const selectedOtherInterest =
      Array.isArray(body.interest_reason) &&
      body.interest_reason.includes("Khác");

    if (!body.email?.trim()) errors.push("Email là bắt buộc");
    else if (!isValidEmail(body.email.trim()))
      errors.push("Email không hợp lệ");

    if (!body.career_journey?.length)
      errors.push("Vui lòng chọn ít nhất 1 vị trí");
    else {
      try {
        const activePositions = await getActiveRecruitmentPositionLabels();
        const requestedPositions = Array.isArray(body.career_journey)
          ? body.career_journey.filter((item: unknown) => typeof item === "string")
          : [];
        const inactivePositions = requestedPositions.filter(
          (position: string) => !activePositions.has(position),
        );

        if (inactivePositions.length > 0) {
          errors.push(
            `Vị trí hiện không còn tuyển: ${inactivePositions.join(", ")}`,
          );
        }
      } catch (positionError) {
        console.error(
          "[POST /api/applications] Recruitment position validation failed:",
          positionError,
        );
        errors.push("Không kiểm tra được vị trí đang tuyển. Vui lòng thử lại.");
      }
    }
    if (!interestReasons.length) errors.push("Vui lòng chọn điều hứng thú");
    if (selectedOtherInterest && !String(body.interest_other || "").trim())
      errors.push("Vui lòng nhập lý do khác");
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
    if (!body.enrollment?.trim()) errors.push("Thời điểm nhập học là bắt buộc");
    if (!body.graduation?.trim()) errors.push("Dự kiến ra trường là bắt buộc");

    if (!body.cv?.trim()) errors.push("Bạn chưa upload file CV");
    else if (!isValidUrl(body.cv.trim()))
      errors.push("File CV chưa upload thành công");

    if (body.school?.trim() && !isValidSchoolMajorFormat(body.school))
      errors.push("Trường học cần theo mẫu: Tên trường (Mã trường) - Ngành");

    if (body.linkedin?.trim() && !isValidUrl(body.linkedin.trim()))
      errors.push("Link LinkedIn không hợp lệ");

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
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
      body.linkedin?.trim() ? `LinkedIn: ${body.linkedin.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const insert = {
      email: body.email.trim().toLowerCase(),
      career_journey: body.career_journey || [],
      interest_reason: interestReasons,
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

    appendToSheet(data).catch((e) =>
      console.error("[Sheets] append failed:", e?.message ?? e),
    );

    let telegramNotified = false;
    let telegramTarget = "";

    try {
      const telegramResult = await notifyTelegramForApplication(data);
      telegramNotified = telegramResult.sent;
      telegramTarget =
        "label" in telegramResult && typeof telegramResult.label === "string"
          ? telegramResult.label
          : "";
    } catch (telegramError) {
      console.error(
        "[POST /api/applications] Telegram notify failed:",
        telegramError,
      );
    }

    let onboardingShared = false;
    let onboardingAlreadyHadAccess = false;
    let onboardingFolderUrl = "";

    try {
      const shareResult = await shareOnboardingFolderWithApplicant({
        email: data.email,
        fullName: data.full_name,
      });
      onboardingShared = shareResult.shared;
      onboardingAlreadyHadAccess = shareResult.alreadyHadAccess;
      onboardingFolderUrl = shareResult.folderUrl;
    } catch (shareError) {
      console.error(
        "[POST /api/applications] Onboarding folder share failed:",
        shareError,
      );
    }

    let confirmationEmailSent = false;
    let confirmationEmailReason = "";

    try {
      const emailResult = await sendApplicationConfirmationEmail({
        to: data.email,
        fullName: data.full_name,
        position: data.career_journey,
        videoUrl: onboardingFolderUrl,
      });
      confirmationEmailSent = emailResult.sent;
      confirmationEmailReason =
        "reason" in emailResult ? (emailResult.reason ?? "") : "";
    } catch (emailError) {
      console.error(
        "[POST /api/applications] Confirmation email failed:",
        emailError,
      );
      confirmationEmailReason = "send-failed";
    }

    return NextResponse.json(
      {
        success: true,
        id: data.id,
        telegramNotified,
        telegramTarget,
        onboardingShared,
        onboardingAlreadyHadAccess,
        confirmationEmailSent,
        confirmationEmailReason,
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
