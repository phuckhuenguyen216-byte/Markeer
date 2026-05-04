import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  // Rate limit: 10 checks per IP per 5 minutes
  const ip = getClientIp(request);
  const { limited } = rateLimit(ip + ":check", 10, 5 * 60 * 1000);
  if (limited) {
    return NextResponse.json(
      { exists: false, error: "Too many requests" },
      { status: 429 },
    );
  }

  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email")?.trim().toLowerCase();
  const phone = searchParams.get("phone")?.trim();

  if (!email && !phone) {
    return NextResponse.json({ exists: false });
  }

  try {
    const supabase = getSupabaseAdmin();
    let query = supabase
      .from("applications")
      .select("id, status")
      .in("status", ["new", "reviewing", "interviewed", "accepted"])
      .limit(1);

    if (email) {
      query = query.eq("email", email);
    } else if (phone) {
      query = query.eq("phone", phone);
    }

    const { data } = await query;

    if (data && data.length > 0) {
      const field = email ? "email" : "số điện thoại";
      return NextResponse.json({
        exists: true,
        message: `Hồ sơ với ${field} này đã được gửi và đang được xử lý. Vui lòng liên hệ hello@markeeai.com nếu cần hỗ trợ.`,
      });
    }

    return NextResponse.json({ exists: false });
  } catch {
    return NextResponse.json({ exists: false });
  }
}
