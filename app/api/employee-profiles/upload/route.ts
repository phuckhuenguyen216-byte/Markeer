import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { validateCsrfToken } from "@/lib/csrf";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/jpg",
  "application/pdf"
]);

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { limited } = rateLimit(`${ip}:doc-upload`, 12, 15 * 60 * 1000); // 12 uploads per 15 mins
  if (limited) {
    return NextResponse.json(
      { error: "Bạn tải lên quá nhanh. Vui lòng thử lại sau ít phút." },
      { status: 429 }
    );
  }

  const csrfToken = request.headers.get("x-csrf-token");
  if (!csrfToken || !validateCsrfToken(csrfToken)) {
    return NextResponse.json(
      { error: "Phiên làm việc hết hạn. Vui lòng tải lại trang và thử lại." },
      { status: 403 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Chưa nhận được tệp tin." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Tệp tin quá lớn. Kích thước tối đa là 5MB." },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Định dạng tệp không hợp lệ. Chỉ chấp nhận ảnh JPG, PNG hoặc PDF." },
        { status: 400 }
      );
    }

    // Prepare buffer and secure filename
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = file.name.split(".").pop();
    const sanitizedBase = file.name
      .replace(/\.[^/.]+$/, "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .slice(0, 30);
    const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const filename = `${sanitizedBase}-${uniqueSuffix}.${fileExtension}`;

    // Upload to Supabase Private Storage
    const supabase = getSupabaseAdmin();
    const { data, error: uploadError } = await supabase.storage
      .from("employee-documents")
      .upload(`uploads/cccd/${filename}`, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("[Storage Upload Error]:", uploadError);
      return NextResponse.json(
        { error: "Lỗi tải tệp lên bộ lưu trữ. Hãy chắc chắn rằng bucket 'employee-documents' đã được tạo trên Supabase." },
        { status: 500 }
      );
    }

    // Return the path within the bucket
    return NextResponse.json({
      success: true,
      path: data.path,
      name: file.name
    });

  } catch (err) {
    console.error("[POST /api/employee-profiles/upload] Error:", err);
    return NextResponse.json(
      { error: "Lỗi hệ thống khi xử lý tải tệp." },
      { status: 500 }
    );
  }
}
