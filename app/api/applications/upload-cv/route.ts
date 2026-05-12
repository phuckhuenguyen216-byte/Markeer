import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { validateCsrfToken } from "@/lib/csrf";
import { uploadCvToDrive } from "@/lib/google-drive";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { limited } = rateLimit(`${ip}:cv-upload`, 6, 15 * 60 * 1000);
  if (limited) {
    return NextResponse.json(
      { error: "Bạn upload hơi nhiều lần. Thử lại sau ít phút nhé." },
      { status: 429 },
    );
  }

  const csrfToken = request.headers.get("x-csrf-token");
  if (!csrfToken || !validateCsrfToken(csrfToken)) {
    return NextResponse.json(
      { error: "Phiên làm việc hết hạn. Tải lại trang rồi thử lại nhé." },
      { status: 403 },
    );
  }

  try {
    const form = await request.formData();
    const file = form.get("file");
    const fullName = String(form.get("full_name") || "");
    const email = String(form.get("email") || "");
    const careerCategory = String(form.get("career_category") || "");
    const careerJourneyRaw = String(form.get("career_journey") || "[]");
    let careerJourney: string[] = [];

    try {
      const parsed = JSON.parse(careerJourneyRaw);
      if (Array.isArray(parsed)) {
        careerJourney = parsed.filter((item): item is string => typeof item === "string");
      }
    } catch {
      careerJourney = [];
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Chưa nhận được file CV." },
        { status: 400 },
      );
    }

    const url = await uploadCvToDrive({
      file,
      fullName,
      email,
      careerCategory,
      careerJourney,
    });
    return NextResponse.json({ url });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Upload CV chưa thành công. Bạn thử chọn lại file nhé.",
      },
      { status: 500 },
    );
  }
}
