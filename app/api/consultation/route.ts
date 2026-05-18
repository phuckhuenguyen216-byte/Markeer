import { NextRequest, NextResponse } from "next/server";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN_TIEN || "";
const TELEGRAM_CHAT_MKT_SALES_ID = process.env.TELEGRAM_CHAT_MKT_SALES_ID_TIEN || "";
const TELEGRAM_CHAT_MKT_SALES_THREAD_ID = process.env.TELEGRAM_CHAT_MKT_SALES_THREAD_ID_TIEN || "";

function optionalInt(value?: string) {
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export async function POST(req: NextRequest) {
  try {
    const { phone, service } = await req.json();

    if (!phone || typeof phone !== "string" || phone.trim().length < 8) {
      return NextResponse.json(
        { error: "Số điện thoại không hợp lệ" },
        { status: 400 }
      );
    }

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_MKT_SALES_ID) {
      console.warn("[Consultation] Missing Telegram config");
      return NextResponse.json(
        { error: "Cấu hình server chưa sẵn sàng" },
        { status: 500 }
      );
    }

    const now = new Intl.DateTimeFormat("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour12: false,
    }).format(new Date());

    const message = [
      `📞 <b>Yêu cầu tư vấn mới</b>`,
      ``,
      `📱 <b>SĐT:</b> ${phone.trim()}`,
      `🎯 <b>Dịch vụ:</b> ${service || "Chưa chọn"}`,
      `🕐 <b>Thời gian:</b> ${now}`,
    ].join("\n");

    const payload: {
      chat_id: string;
      text: string;
      parse_mode: "HTML";
      disable_web_page_preview: boolean;
      message_thread_id?: number;
    } = {
      chat_id: TELEGRAM_CHAT_MKT_SALES_ID,
      text: message,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    };

    const threadId = optionalInt(TELEGRAM_CHAT_MKT_SALES_THREAD_ID);
    if (threadId) {
      payload.message_thread_id = threadId;
    }

    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("[Consultation] Telegram error:", text);
      return NextResponse.json(
        { error: "Gửi thất bại, vui lòng thử lại" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Consultation] Error:", err);
    return NextResponse.json(
      { error: "Lỗi server" },
      { status: 500 }
    );
  }
}
