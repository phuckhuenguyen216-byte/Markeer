import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { validateCsrfToken } from "@/lib/csrf";
import { validateAdminRequest } from "@/lib/admin-auth";
import { validateEmployeeProfile } from "@/lib/employee-profile";

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim();
}

// GET /api/employee-profiles - List employee profiles for admin
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
      .from("employee_profiles")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (search) {
      const safeSearch = search.replace(/[(),."'\\]/g, "").trim();
      if (safeSearch) {
        query = query.or(
          `full_name.ilike.%${safeSearch}%,personal_email.ilike.%${safeSearch}%,phone.ilike.%${safeSearch}%`
        );
      }
    }

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error("[GET /api/employee-profiles] Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      profiles: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (err) {
    console.error("[GET /api/employee-profiles] Error:", err);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

// POST /api/employee-profiles - Submit public employee profile
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
        }
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

    const validationErrors = validateEmployeeProfile(body);
    if (validationErrors.length > 0) {
      return NextResponse.json({ errors: validationErrors }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    
    // Check if the user already submitted a profile with the same email in the past 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: existing } = await supabase
      .from("employee_profiles")
      .select("id")
      .eq("personal_email", body.personal_email.trim().toLowerCase())
      .gte("created_at", oneDayAgo)
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json(
        {
          errors: [
            "Hồ sơ cá nhân của email này đã được nộp trong 24 giờ qua. Vui lòng đợi hoặc liên hệ admin.",
          ],
        },
        { status: 409 }
      );
    }

    const insertData = {
      full_name: stripHtml(body.full_name || ""),
      dob: body.dob.trim(),
      gender: body.gender,
      phone: body.phone.trim(),
      personal_email: body.personal_email.trim().toLowerCase(),
      national_id: body.national_id.trim(),
      id_issue_date: body.id_issue_date.trim(),
      id_issue_place: stripHtml(body.id_issue_place || ""),
      permanent_address: stripHtml(body.permanent_address || ""),
      temporary_address: stripHtml(body.temporary_address || ""),
      documents_folder: body.documents_folder.trim(),
      tax_code: body.tax_code.trim(),
      insurance_code: body.insurance_code.trim(),
      health_insurance_code: body.health_insurance_code.trim(),
      bank_account: body.bank_account.trim(),
      bank_name_branch: stripHtml(body.bank_name_branch || ""),
    };

    const { data, error } = await supabase
      .from("employee_profiles")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("[POST /api/employee-profiles] Insert error:", error);
      return NextResponse.json(
        { errors: ["Lỗi lưu hồ sơ. Vui lòng thử lại."] },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, profile: data });
  } catch (err) {
    console.error("[POST /api/employee-profiles] Error:", err);
    return NextResponse.json(
      { errors: ["Lỗi server hệ thống."] },
      { status: 500 }
    );
  }
}
