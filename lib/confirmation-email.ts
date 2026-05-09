import { google } from "googleapis";
import { GOOGLE_SHEETS_CONFIG } from "./server-config";

type ConfirmationEmailInput = {
  to: string;
  fullName?: string | null;
  position?: string[] | null;
  videoUrl?: string;
};

const GMAIL_SEND_SCOPE = "https://www.googleapis.com/auth/gmail.send";
const MAIL_FROM_EMAIL =
  process.env.MAIL_FROM_EMAIL || process.env.GMAIL_DELEGATED_USER || "";
const GMAIL_DELEGATED_USER =
  process.env.GMAIL_DELEGATED_USER || MAIL_FROM_EMAIL;
const GMAIL_OAUTH_CLIENT_ID = process.env.GMAIL_OAUTH_CLIENT_ID || "";
const GMAIL_OAUTH_CLIENT_SECRET = process.env.GMAIL_OAUTH_CLIENT_SECRET || "";
const GMAIL_OAUTH_REFRESH_TOKEN =
  process.env.GMAIL_OAUTH_REFRESH_TOKEN || "";
const MAIL_FROM_NAME = process.env.MAIL_FROM_NAME || "Markee Recruitment";
const MAIL_SUBJECT_PREFIX = (process.env.MAIL_SUBJECT_PREFIX || "").trim();
const ZALO_COMMUNITY_URL = (process.env.ZALO_COMMUNITY_URL || "").trim();
const ONBOARDING_VIDEO_URL = (process.env.ONBOARDING_VIDEO_URL || "").trim();
const ZALO_DEV_AI_URL = (
  process.env.ZALO_COMMUNITY_DEV_AI_URL ||
  process.env.ZALO_DEV_AI_URL ||
  "https://zalo.me/g/vvll1gmy7hll8ziosken"
).trim();
const ZALO_MKT_SALES_URL = (
  process.env.ZALO_COMMUNITY_MKT_SALES_URL ||
  process.env.ZALO_MKT_SALES_URL ||
  "https://zalo.me/g/vozcso2e8qescpqmstdj"
).trim();
const ZALO_INFRA_URL = (
  process.env.ZALO_COMMUNITY_INFRA_URL ||
  process.env.ZALO_INFRA_URL ||
  "https://zalo.me/g/d3yvdxl6zlrgskcmowvj"
).trim();
const VIDEO_PM_KPI_URL = (
  process.env.ONBOARDING_VIDEO_PM_KPI_URL ||
  "https://drive.google.com/file/d/1xv9UfkDFxBLxLkILoCf5UFB0lwuurb64/view?usp=drive_link"
).trim();
const VIDEO_POLICY_URL = (
  process.env.ONBOARDING_VIDEO_POLICY_URL ||
  "https://drive.google.com/file/d/15KEzLkC1KRE5GNf5Dad89sjJuO4UzPAW/view?usp=drive_link"
).trim();

const DEFAULT_NAME = "b\u1ea1n";
const DEFAULT_POSITION = "v\u1ecb tr\u00ed th\u1ef1c t\u1eadp";

type CandidateBucket = "devAi" | "infra" | "marketingSales";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getFirstName(fullName?: string | null) {
  const parts = (fullName || "").trim().split(/\s+/).filter(Boolean);
  return parts.length ? parts[parts.length - 1] : DEFAULT_NAME;
}

function getSubject() {
  const prefix = MAIL_SUBJECT_PREFIX ? `[${MAIL_SUBJECT_PREFIX}] ` : "";
  return `${prefix}Markee \u0111\u00e3 nh\u1eadn h\u1ed3 s\u01a1 \u1ee9ng tuy\u1ec3n c\u1ee7a b\u1ea1n`;
}

function getCandidateBucket(position: string[] = []): CandidateBucket {
  const text = position.join(" ").toLowerCase();

  if (
    text.includes("marketing") ||
    text.includes("mkt") ||
    text.includes("sales") ||
    text.includes("content") ||
    text.includes("social") ||
    text.includes("performance") ||
    text.includes("acquisition") ||
    text.includes("customer") ||
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
    text.includes("backup")
  ) {
    return "infra";
  }

  return "devAi";
}

function getZaloCommunity(position?: string[] | null) {
  const bucket = getCandidateBucket(position || []);
  const urls: Record<CandidateBucket, string> = {
    devAi: ZALO_DEV_AI_URL,
    infra: ZALO_INFRA_URL,
    marketingSales: ZALO_MKT_SALES_URL,
  };
  const labels: Record<CandidateBucket, string> = {
    devAi: "Dev + AI",
    infra: "Infras",
    marketingSales: "MKT + Sales",
  };

  return {
    bucket,
    label: labels[bucket],
    url: urls[bucket] || ZALO_COMMUNITY_URL,
  };
}

function encodeHeader(value: string) {
  return `=?UTF-8?B?${Buffer.from(value, "utf8").toString("base64")}?=`;
}

function encodeMimePart(value: string) {
  return Buffer.from(value, "utf8")
    .toString("base64")
    .replace(/(.{76})/g, "$1\r\n");
}

function encodeRawMessage(value: string) {
  return Buffer.from(value, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function getGmailClient() {
  if (
    GMAIL_OAUTH_CLIENT_ID &&
    GMAIL_OAUTH_CLIENT_SECRET &&
    GMAIL_OAUTH_REFRESH_TOKEN &&
    MAIL_FROM_EMAIL
  ) {
    const auth = new google.auth.OAuth2(
      GMAIL_OAUTH_CLIENT_ID,
      GMAIL_OAUTH_CLIENT_SECRET,
    );
    auth.setCredentials({ refresh_token: GMAIL_OAUTH_REFRESH_TOKEN });
    return google.gmail({ version: "v1", auth });
  }

  const email = GOOGLE_SHEETS_CONFIG.serviceAccountEmail;
  const key = GOOGLE_SHEETS_CONFIG.privateKey;

  if (!email || !key || !GMAIL_DELEGATED_USER || !MAIL_FROM_EMAIL) return null;

  const auth = new google.auth.JWT({
    email,
    key,
    scopes: [GMAIL_SEND_SCOPE],
    subject: GMAIL_DELEGATED_USER,
  });

  return google.gmail({ version: "v1", auth });
}

function buildText({ fullName, position, videoUrl }: ConfirmationEmailInput) {
  const name = getFirstName(fullName);
  const fallbackVideoUrl = ONBOARDING_VIDEO_URL || videoUrl || "";
  const zaloCommunity = getZaloCommunity(position);
  const positions = position?.length ? position.join(", ") : DEFAULT_POSITION;

  return [
    `Ch\u00e0o ${name},`,
    "",
    `Ch\u00fac m\u1eebng b\u1ea1n \u0111\u00e3 \u0111\u0103ng k\u00fd \u1ee9ng tuy\u1ec3n ${positions} th\u00e0nh c\u00f4ng.`,
    "Markee \u0111\u00e3 nh\u1eadn \u0111\u01b0\u1ee3c th\u00f4ng tin c\u1ee7a b\u1ea1n v\u00e0 s\u1ebd li\u00ean h\u1ec7 s\u1edbm nh\u1ea5t n\u1ebfu h\u1ed3 s\u01a1 ph\u00f9 h\u1ee3p.",
    "",
    zaloCommunity.url
      ? `Tham gia nh\u00f3m Zalo ch\u1edd k\u1ebft qu\u1ea3 (${zaloCommunity.label}): ${zaloCommunity.url}`
      : "",
    "",
    "Video h\u01b0\u1edbng d\u1eabn:",
    VIDEO_PM_KPI_URL
      ? `1. C\u00e1ch s\u1eed d\u1ee5ng PM v\u00e0 file KPI c\u00e1 nh\u00e2n: ${VIDEO_PM_KPI_URL}`
      : "",
    VIDEO_POLICY_URL
      ? `2. Ch\u00ednh S\u00e1ch C\u00f4ng Ty, Quy \u0110\u1ecbnh & Roadmap Ph\u00e1t Tri\u1ec3n Intern: ${VIDEO_POLICY_URL}`
      : fallbackVideoUrl
        ? `2. Th\u01b0 m\u1ee5c video h\u01b0\u1edbng d\u1eabn: ${fallbackVideoUrl}`
        : "",
    "",
    "L\u01b0u \u00fd: quy\u1ec1n xem video ch\u1ec9 \u0111\u01b0\u1ee3c c\u1ea5p \u1edf m\u1ee9c ng\u01b0\u1eddi xem cho \u0111\u00fang email b\u1ea1n d\u00f9ng \u0111\u1ec3 \u1ee9ng tuy\u1ec3n. N\u1ebfu m\u1edf link b\u1eb1ng t\u00e0i kho\u1ea3n Google kh\u00e1c, h\u00e3y \u0111\u1ed5i l\u1ea1i \u0111\u00fang email n\u00e0y.",
    "",
    "H\u1eb9n g\u1eb7p b\u1ea1n,",
    "Markee Recruitment",
  ]
    .filter(Boolean)
    .join("\n");
}

function buildHtml({ fullName, position, videoUrl }: ConfirmationEmailInput) {
  const name = escapeHtml(getFirstName(fullName));
  const positions = escapeHtml(
    position?.length ? position.join(", ") : DEFAULT_POSITION,
  );
  const fallbackVideoUrl = ONBOARDING_VIDEO_URL || videoUrl || "";
  const safeFallbackVideoUrl = escapeHtml(fallbackVideoUrl);
  const zaloCommunity = getZaloCommunity(position);
  const safeZaloUrl = escapeHtml(zaloCommunity.url);
  const safeZaloLabel = escapeHtml(zaloCommunity.label);
  const safePmKpiUrl = escapeHtml(VIDEO_PM_KPI_URL);
  const safePolicyUrl = escapeHtml(VIDEO_POLICY_URL);

  const zaloButton = safeZaloUrl
    ? `<a href="${safeZaloUrl}" style="display:inline-block;min-width:260px;background:#0068ff;color:#ffffff;text-decoration:none;border-radius:12px;padding:15px 24px;font-size:15px;font-weight:900;text-align:center;box-shadow:0 12px 24px rgba(0,104,255,.22);">Tham gia Zalo ${safeZaloLabel}</a>`
    : "";
  const fallbackVideoButton =
    !safePmKpiUrl && !safePolicyUrl && safeFallbackVideoUrl
      ? `<a href="${safeFallbackVideoUrl}" style="display:inline-block;min-width:260px;background:linear-gradient(135deg,#667eea,#764ba2);color:#ffffff;text-decoration:none;border-radius:12px;padding:15px 24px;font-size:15px;font-weight:900;text-align:center;box-shadow:0 12px 24px rgba(102,126,234,.24);">Xem Video H\u01b0\u1edbng D\u1eabn</a>`
      : "";

  return `<!doctype html>
<html lang="vi">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Markee Recruitment</title>
  </head>
  <body style="margin:0;background:#f7f7fb;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;color:#2f2f36;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f7f7fb;background-image:linear-gradient(rgba(15,23,42,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(15,23,42,.035) 1px,transparent 1px);background-size:32px 32px;padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:720px;background:#ffffff;border:1px solid #e1e4ee;border-radius:20px;overflow:hidden;box-shadow:0 22px 60px rgba(17,24,39,.12);">
            <tr>
              <td align="center" style="padding:40px 34px 38px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#ffffff;">
                <div style="display:inline-block;margin:0 0 14px;padding:7px 14px;border-radius:999px;background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.24);font-size:11px;line-height:1;font-weight:900;letter-spacing:.12em;text-transform:uppercase;color:#ffffff;">Markee Recruitment 2026</div>
                <h1 style="margin:0;font-size:31px;line-height:1.25;font-weight:900;color:#ffffff;">Ch\u00fac m\u1eebng b\u1ea1n!</h1>
                <p style="margin:12px 0 0;font-size:16px;line-height:1.6;color:rgba(255,255,255,.92);font-weight:700;">\u0110\u00e3 \u0111\u0103ng k\u00fd \u1ee9ng tuy\u1ec3n th\u00e0nh c\u00f4ng</p>
              </td>
            </tr>

            <tr>
              <td style="padding:34px 36px 38px;background-color:#ffffff;background-image:linear-gradient(rgba(15,23,42,.028) 1px,transparent 1px),linear-gradient(90deg,rgba(15,23,42,.028) 1px,transparent 1px);background-size:30px 30px;">
                <p style="margin:0 0 20px;font-size:17px;line-height:1.65;color:#33343b;">Xin ch\u00e0o ${name},</p>
                <p style="margin:0 0 24px;font-size:17px;line-height:1.75;color:#33343b;">
                  C\u1ea3m \u01a1n b\u1ea1n \u0111\u00e3 quan t\u00e2m v\u00e0 \u0111\u0103ng k\u00fd \u1ee9ng tuy\u1ec3n v\u00e0o <strong style="color:#151827;">${positions}</strong>. Ch\u00fang t\u00f4i \u0111\u00e3 nh\u1eadn \u0111\u01b0\u1ee3c th\u00f4ng tin c\u1ee7a b\u1ea1n v\u00e0 s\u1ebd li\u00ean h\u1ec7 s\u1edbm nh\u1ea5t.
                </p>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 28px;">
                  <tr>
                    <td style="background:#f8f7ff;border-left:5px solid #667eea;border-radius:12px;padding:20px 22px;box-shadow:0 8px 20px rgba(102,126,234,.08);">
                      <div style="font-size:17px;font-weight:900;color:#34303d;margin-bottom:10px;">B\u01b0\u1edbc ti\u1ebfp theo:</div>
                      <p style="margin:0;font-size:16px;line-height:1.75;color:#555466;">
                        \u0110\u1ec3 bu\u1ed5i ph\u1ecfng v\u1ea5n di\u1ec5n ra thu\u1eadn l\u1ee3i, b\u1ea1n h\u00e3y tham gia nh\u00f3m Zalo \u1ee9ng vi\u00ean ph\u00f9 h\u1ee3p v\u00e0 d\u00e0nh th\u1eddi gian xem tr\u01b0\u1edbc <strong style="color:#2f2f36;">2 video</strong> gi\u1edbi thi\u1ec7u v\u1ec1 ch\u00ednh s\u00e1ch c\u00f4ng ty, c\u00f4ng c\u1ee5 l\u00e0m vi\u1ec7c v\u00e0 l\u1ed9 tr\u00ecnh ph\u00e1t tri\u1ec3n d\u00e0nh cho Intern.
                      </p>
                    </td>
                  </tr>
                </table>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 30px;">
                  <tr>
                    <td align="center" style="padding:0 0 14px;">${zaloButton}</td>
                  </tr>
                </table>

                <div style="font-size:18px;font-weight:900;color:#151827;text-align:center;margin:0 0 16px;">Video H\u01b0\u1edbng D\u1eabn</div>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 26px;">
                  <tr>
                    <td align="center" style="padding:0 0 12px;">
                      ${
                        safePmKpiUrl
                          ? `<a href="${safePmKpiUrl}" style="display:inline-block;min-width:320px;background:linear-gradient(135deg,#667eea,#764ba2);color:#ffffff;text-decoration:none;border-radius:12px;padding:15px 24px;font-size:15px;font-weight:900;text-align:center;box-shadow:0 12px 24px rgba(102,126,234,.24);">C\u00e1ch s\u1eed d\u1ee5ng PM v\u00e0 file KPI c\u00e1 nh\u00e2n</a>`
                          : ""
                      }
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding:0 0 12px;">
                      ${
                        safePolicyUrl
                          ? `<a href="${safePolicyUrl}" style="display:inline-block;min-width:320px;background:linear-gradient(135deg,#f472d0,#fb5572);color:#ffffff;text-decoration:none;border-radius:12px;padding:15px 24px;font-size:15px;font-weight:900;text-align:center;box-shadow:0 12px 24px rgba(251,85,114,.22);">Ch\u00ednh S\u00e1ch C\u00f4ng Ty, Quy \u0110\u1ecbnh & Roadmap Ph\u00e1t Tri\u1ec3n Intern</a>`
                          : fallbackVideoButton
                      }
                    </td>
                  </tr>
                </table>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 26px;">
                  <tr>
                    <td style="background:#fffaf0;border:1px solid #fde68a;border-radius:14px;padding:14px 16px;">
                      <p style="margin:0;font-size:13px;line-height:1.65;color:#8a5600;">
                        Quy\u1ec1n xem video ch\u1ec9 \u0111\u01b0\u1ee3c c\u1ea5p \u1edf m\u1ee9c <strong>ng\u01b0\u1eddi xem</strong> cho \u0111\u00fang email b\u1ea1n d\u00f9ng \u0111\u1ec3 \u1ee9ng tuy\u1ec3n. N\u1ebfu m\u1edf link b\u1eb1ng t\u00e0i kho\u1ea3n Google kh\u00e1c, h\u00e3y chuy\u1ec3n l\u1ea1i \u0111\u00fang email n\u00e0y.
                      </p>
                    </td>
                  </tr>
                </table>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:rgba(255,255,255,.86);border:1px solid #e8ecf5;border-radius:14px;box-shadow:0 10px 24px rgba(15,23,42,.04);">
                  <tr>
                    <td style="padding:18px 20px;">
                      <div style="font-size:16px;font-weight:900;color:#151827;margin-bottom:12px;">Ti\u1ebfp theo s\u1ebd nh\u01b0 th\u1ebf n\u00e0o?</div>
                      <p style="margin:0 0 8px;font-size:14px;line-height:1.65;color:#555466;"><strong style="color:#667eea;">1.</strong> Team review h\u1ed3 s\u01a1 v\u00e0 CV b\u1ea1n \u0111\u00e3 chia s\u1ebb.</p>
                      <p style="margin:0 0 8px;font-size:14px;line-height:1.65;color:#555466;"><strong style="color:#667eea;">2.</strong> Markee ph\u1ea3n h\u1ed3i qua email ho\u1eb7c Zalo trong 3-5 ng\u00e0y l\u00e0m vi\u1ec7c n\u1ebfu ph\u00f9 h\u1ee3p.</p>
                      <p style="margin:0;font-size:14px;line-height:1.65;color:#555466;"><strong style="color:#667eea;">3.</strong> Bu\u1ed5i trao \u0111\u1ed5i online gi\u00fap team hi\u1ec3u r\u00f5 h\u01a1n v\u1ec1 \u0111\u1ecbnh h\u01b0\u1edbng c\u1ee7a b\u1ea1n.</p>
                    </td>
                  </tr>
                </table>

                <p style="margin:26px 0 0;font-size:15px;line-height:1.75;color:#555466;">
                  H\u1eb9n g\u1eb7p b\u1ea1n,<br>
                  <strong style="color:#151827;">Markee Recruitment</strong>
                </p>
              </td>
            </tr>

            <tr>
              <td style="background:#f8f9fc;border-top:1px solid #e8ecf5;padding:18px 34px;text-align:center;">
                <p style="margin:0;font-size:12px;line-height:1.6;color:#98a2b3;">Email t\u1ef1 \u0111\u1ed9ng t\u1eeb Markee Recruitment. B\u1ea1n c\u00f3 th\u1ec3 ph\u1ea3n h\u1ed3i l\u1ea1i email n\u00e0y n\u1ebfu c\u1ea7n h\u1ed7 tr\u1ee3.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function buildRawEmail(input: ConfirmationEmailInput, to: string) {
  const boundary = `markee_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const from = `${encodeHeader(MAIL_FROM_NAME)} <${MAIL_FROM_EMAIL}>`;
  const headers = [
    `From: ${from}`,
    `To: ${to}`,
    `Reply-To: ${MAIL_FROM_EMAIL}`,
    `Subject: ${encodeHeader(getSubject())}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
  ];

  const textPart = [
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
    "",
    encodeMimePart(buildText(input)),
  ];

  const htmlPart = [
    `--${boundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
    "",
    encodeMimePart(buildHtml(input)),
  ];

  return encodeRawMessage(
    [...headers, "", ...textPart, "", ...htmlPart, "", `--${boundary}--`, ""].join(
      "\r\n",
    ),
  );
}

export async function sendApplicationConfirmationEmail(
  input: ConfirmationEmailInput,
) {
  const to = input.to.trim().toLowerCase();
  if (!to) return { sent: false, reason: "missing-recipient" as const };

  const gmail = getGmailClient();
  if (!gmail) return { sent: false, reason: "missing-gmail-config" as const };

  await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: buildRawEmail(input, to),
    },
  });

  return { sent: true as const };
}
