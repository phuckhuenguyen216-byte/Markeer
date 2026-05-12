type TelegramBucket = "devAi" | "infra" | "marketingSales";

type TelegramTarget = {
  bucket: TelegramBucket;
  label: string;
  chatId: string;
  threadId?: number;
};

type ApplicationForTelegram = {
  id?: string;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  career_journey?: string[] | null;
  interest_reason?: string[] | null;
  why_apply?: string | null;
  experience?: string | null;
  skills?: string | null;
  work_preference?: Record<string, string[]> | null;
  cv?: string | null;
  created_at?: string | null;
};

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TELEGRAM_MESSAGE_PREFIX = (
  process.env.TELEGRAM_MESSAGE_PREFIX || ""
).trim();

function optionalInt(value?: string) {
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

const TELEGRAM_TARGETS: Record<
  TelegramBucket,
  Omit<TelegramTarget, "bucket">
> = {
  devAi: {
    label: "Dev/DevOps or AI Team",
    chatId: process.env.TELEGRAM_CHAT_DEV_AI_ID || "",
    threadId: optionalInt(process.env.TELEGRAM_CHAT_DEV_AI_THREAD_ID),
  },
  infra: {
    label: "Infrastructure Team",
    chatId: process.env.TELEGRAM_CHAT_INFRA_ID || "",
    threadId: optionalInt(process.env.TELEGRAM_CHAT_INFRA_THREAD_ID),
  },
  marketingSales: {
    label: "Marketing / Sales Team",
    chatId: process.env.TELEGRAM_CHAT_MKT_SALES_ID || "",
    threadId: optionalInt(process.env.TELEGRAM_CHAT_MKT_SALES_THREAD_ID),
  },
};

function getTelegramBucket(careerJourney: string[] = []): TelegramBucket {
  const text = careerJourney.join(" ").toLowerCase();

  if (
    text.includes("marketing") ||
    text.includes("mkt") ||
    text.includes("sales") ||
    text.includes("content") ||
    text.includes("social") ||
    text.includes("performance") ||
    text.includes("acquisition") ||
    text.includes("customer") ||
    text.includes("partnership") ||
    text.includes("business")
  ) {
    return "marketingSales";
  }

  if (
    text.includes("infra") ||
    text.includes("network") ||
    text.includes("system") ||
    text.includes("cloud") ||
    text.includes("security") ||
    text.includes("datacenter") ||
    text.includes("server") ||
    text.includes("storage") ||
    text.includes("backup") ||
    text.includes("hội nghị") ||
    text.includes("tổng đài")
  ) {
    return "infra";
  }

  return "devAi";
}

function getTarget(careerJourney: string[] = []): TelegramTarget | null {
  const bucket = getTelegramBucket(careerJourney);
  const config = TELEGRAM_TARGETS[bucket];
  if (!config.chatId) return null;
  return { bucket, ...config };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function compact(value?: string | null, fallback = "Chưa có") {
  const text = (value || "").trim();
  return escapeHtml(text || fallback);
}

function formatList(values?: string[] | null, fallback = "Chưa chọn") {
  if (!values?.length) return fallback;
  return values.join(" · ");
}

function formatWorkPreference(value?: Record<string, string[]> | null) {
  if (!value) return "Chưa chọn";

  const items = Object.entries(value)
    .filter(([, choices]) => choices?.length)
    .map(([key, choices]) => `${key}: ${choices.join(", ")}`);

  return items.length ? items.join(" · ") : "Chưa chọn";
}

function formatCreatedAt(value?: string | null) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour12: false,
  }).format(date);
}

function buildMessage(
  application: ApplicationForTelegram,
  target: TelegramTarget,
) {
  const careerJourney = application.career_journey || [];
  const prefixLine = TELEGRAM_MESSAGE_PREFIX
    ? [`🧪 <b>${escapeHtml(TELEGRAM_MESSAGE_PREFIX)}</b>`]
    : [];

  const lines = [
    ...prefixLine,
    `📬 � <b>Có người mới điền form tuyển dụng ở Markee</b>`,
    `🛡️ Team: <b>${escapeHtml(target.label)}</b>`,
    "",
    `📝 <b>Họ tên:</b> ${compact(application.full_name)}`,
    `📞 <b>SĐT/Zalo:</b> ${compact(application.phone)}`,
    `🎯 <b>Vị trí:</b> ${escapeHtml(formatList(careerJourney))}`,
    `📍 <b>Location:</b> ${escapeHtml(formatWorkPreference(application.work_preference))}`,
    `🕐 <b>Thời gian:</b> ${escapeHtml(formatCreatedAt(application.created_at))}`,
  ];

  return lines.join("\n");
}

export async function notifyTelegramForApplication(
  application: ApplicationForTelegram,
) {
  if (!TELEGRAM_BOT_TOKEN) {
    return { sent: false, reason: "missing-token" as const };
  }

  const target = getTarget(application.career_journey || []);
  if (!target) {
    return { sent: false, reason: "missing-chat-id" as const };
  }

  const payload: {
    chat_id: string;
    text: string;
    parse_mode: "HTML";
    disable_web_page_preview: boolean;
    message_thread_id?: number;
  } = {
    chat_id: target.chatId,
    text: buildMessage(application, target),
    parse_mode: "HTML",
    disable_web_page_preview: true,
  };

  if (target.threadId) {
    payload.message_thread_id = target.threadId;
  }

  console.log(
    `[Telegram] Sending to bucket=${target.bucket} chat=${target.chatId} thread=${target.threadId}`,
  );

  let lastError: unknown;
  let succeeded = false;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(10000),
        },
      );
      const responseText = await response.text();
      if (!response.ok) {
        throw new Error(
          `Telegram API error: ${response.status} ${responseText}`,
        );
      }
      console.log(`[Telegram] Sent OK to ${target.label} (attempt ${attempt})`);
      succeeded = true;
      break;
    } catch (err) {
      lastError = err;
      console.warn(
        `[Telegram] Attempt ${attempt} failed:`,
        (err as Error)?.message,
      );
      if (attempt < 3) await new Promise((r) => setTimeout(r, 1000 * attempt));
    }
  }
  if (!succeeded) throw lastError;

  return {
    sent: true,
    bucket: target.bucket,
    label: target.label,
  };
}
