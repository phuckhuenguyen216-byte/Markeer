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
const FACEBOOK_PAGE_URL = "https://www.facebook.com/markeeaimarketing/";
const FACEBOOK_LOGO_URL =
  "https://graph.facebook.com/markeeaimarketing/picture?type=large&width=96&height=96";

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
  const safeFacebookPageUrl = escapeHtml(FACEBOOK_PAGE_URL);
  const safeFacebookLogoUrl = escapeHtml(FACEBOOK_LOGO_URL);

  const zaloInlineLink = safeZaloUrl
    ? `<a href="${safeZaloUrl}" style="color:#0068ff;text-decoration:underline;font-weight:900;">t\u1ea1i \u0111\u00e2y</a> <span style="display:inline-block;margin-left:5px;padding:3px 7px;border-radius:999px;background:#0068ff;color:#ffffff;font-size:11px;line-height:1;font-weight:900;vertical-align:1px;">Zalo</span>`
    : `<span style="color:#0068ff;font-weight:900;">k\u00eanh Zalo ph\u00f9 h\u1ee3p</span>`;
  const pmKpiCard = safePmKpiUrl
    ? `<a href="${safePmKpiUrl}" style="display:block;min-height:156px;background:#ffffff;border:1.5px solid #fecaca;border-radius:18px;padding:16px;text-decoration:none;box-shadow:0 10px 26px rgba(239,68,68,.08);">
        <span style="display:block;width:28px;height:28px;line-height:28px;text-align:center;border-radius:999px;background:#fff1f2;color:#ef4444;font-size:13px;font-weight:900;margin-bottom:10px;">1</span>
        <strong style="display:block;color:#0f172a;font-size:14px;line-height:1.4;margin-bottom:6px;">C\u00e1ch s\u1eed d\u1ee5ng PM v\u00e0 file KPI c\u00e1 nh\u00e2n</strong>
        <span style="font-size:13px;line-height:1.55;color:#64748b;">N\u1eafm c\u00e1ch team theo d\u00f5i c\u00f4ng vi\u1ec7c, c\u1eadp nh\u1eadt ti\u1ebfn \u0111\u1ed9 v\u00e0 ph\u1ed1i h\u1ee3p trong k\u1ef3 th\u1ef1c t\u1eadp.</span>
        <span style="display:inline-block;margin-top:14px;background:#ef4444;color:#ffffff;border-radius:999px;padding:9px 13px;font-size:12px;line-height:1;font-weight:900;">B\u1ea5m \u0111\u1ec3 xem video &rarr;</span>
      </a>`
    : "";
  const policyCard = safePolicyUrl
    ? `<a href="${safePolicyUrl}" style="display:block;min-height:156px;background:#ffffff;border:1.5px solid #fecaca;border-radius:18px;padding:16px;text-decoration:none;box-shadow:0 10px 26px rgba(239,68,68,.08);">
        <span style="display:block;width:28px;height:28px;line-height:28px;text-align:center;border-radius:999px;background:#fff1f2;color:#ef4444;font-size:13px;font-weight:900;margin-bottom:10px;">2</span>
        <strong style="display:block;color:#0f172a;font-size:14px;line-height:1.4;margin-bottom:6px;">Ch\u00ednh S\u00e1ch C\u00f4ng Ty, Quy \u0110\u1ecbnh & Roadmap Ph\u00e1t Tri\u1ec3n Intern</strong>
        <span style="font-size:13px;line-height:1.55;color:#64748b;">Hi\u1ec3u k\u1ef3 v\u1ecdng l\u00e0m vi\u1ec7c, ch\u00ednh s\u00e1ch n\u1ed9i b\u1ed9 v\u00e0 l\u1ed9 tr\u00ecnh ph\u00e1t tri\u1ec3n t\u1ea1i Markee.</span>
        <span style="display:inline-block;margin-top:14px;background:#ef4444;color:#ffffff;border-radius:999px;padding:9px 13px;font-size:12px;line-height:1;font-weight:900;">B\u1ea5m \u0111\u1ec3 xem video &rarr;</span>
      </a>`
    : safeFallbackVideoUrl
      ? `<a href="${safeFallbackVideoUrl}" style="display:block;background:#ef4444;color:#ffffff;text-decoration:none;border-radius:15px;padding:15px 20px;font-size:15px;font-weight:900;box-shadow:0 14px 28px rgba(239,68,68,.20);">Xem video h\u01b0\u1edbng d\u1eabn</a>`
      : "";

  return `<!doctype html>
<html lang="vi">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Markee Recruitment</title>
  </head>
  <body style="margin:0;background:#eef2f7;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;color:#111827;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#eef2f7;padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:720px;border-collapse:separate;border-spacing:0;">
            <tr>
              <td style="border-radius:26px;overflow:hidden;border:1px solid #dbe4ef;background:#ffffff;box-shadow:0 24px 60px rgba(15,23,42,.12);">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding:34px 38px 30px;background-color:#fbfdff;background-image:linear-gradient(#edf2f7 1px,transparent 1px),linear-gradient(90deg,#edf2f7 1px,transparent 1px);background-size:28px 28px;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                          <td style="vertical-align:middle;">
                            <table role="presentation" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                              <tr>
                                <td style="vertical-align:middle;">
                                  <a href="${safeFacebookPageUrl}" style="display:block;text-decoration:none;">
                                    <img src="${safeFacebookLogoUrl}" width="44" height="44" alt="Markee AI" style="display:block;width:44px;height:44px;border-radius:14px;border:1px solid #fecaca;object-fit:cover;box-shadow:0 10px 22px rgba(239,68,68,.16);">
                                  </a>
                                </td>
                                <td style="vertical-align:middle;padding-left:10px;">
                                  <a href="${safeFacebookPageUrl}" style="display:inline-block;border:1px solid #fecaca;background:#fff5f5;color:#dc2626;border-radius:999px;padding:8px 14px;font-size:11px;line-height:1;font-weight:800;letter-spacing:.08em;text-transform:uppercase;text-decoration:none;white-space:nowrap;">Markee Recruitment &middot; Internship 2026</a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>

                      <h1 style="margin:26px 0 0;font-size:34px;line-height:1.15;font-weight:900;letter-spacing:0;color:#0f172a;">Ch\u00fac m\u1eebng b\u1ea1n, ${name}!</h1>
                      <p style="margin:12px 0 0;font-size:18px;line-height:1.6;color:#334155;font-weight:800;">\u0110\u00e3 \u0111\u0103ng k\u00fd \u1ee9ng tuy\u1ec3n th\u00e0nh c\u00f4ng</p>
                      <div style="width:74px;height:4px;background:#ef4444;border-radius:999px;margin:18px 0 0;"></div>
                      <p style="margin:18px 0 0;max-width:580px;font-size:16px;line-height:1.75;color:#475569;">
                        C\u1ea3m \u01a1n b\u1ea1n \u0111\u00e3 quan t\u00e2m v\u00e0 \u0111\u0103ng k\u00fd \u1ee9ng tuy\u1ec3n <strong style="color:#0f172a;">${positions}</strong>. Ch\u00fang t\u00f4i \u0111\u00e3 nh\u1eadn \u0111\u01b0\u1ee3c th\u00f4ng tin c\u1ee7a b\u1ea1n v\u00e0 s\u1ebd li\u00ean h\u1ec7 s\u1edbm nh\u1ea5t.
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:30px 38px 34px;background:#ffffff;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 24px;">
                        <tr>
                          <td style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:18px;padding:18px 20px;">
                            <div style="font-size:12px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;color:#ef4444;margin-bottom:9px;">B\u01b0\u1edbc ti\u1ebfp theo</div>
                            <p style="margin:0;font-size:15px;line-height:1.75;color:#475569;">
                              Tham gia k\u00eanh Zalo \u1ee9ng vi\u00ean ${safeZaloLabel} ${zaloInlineLink} \u0111\u1ec3 nh\u1eadn c\u1eadp nh\u1eadt nhanh. Sau \u0111\u00f3, b\u1ea1n c\u00f3 th\u1ec3 xem tr\u01b0\u1edbc 2 video gi\u1edbi thi\u1ec7u v\u1ec1 c\u00e1ch l\u00e0m vi\u1ec7c, ch\u00ednh s\u00e1ch v\u00e0 l\u1ed9 tr\u00ecnh ph\u00e1t tri\u1ec3n d\u00e0nh cho Intern.
                            </p>
                          </td>
                        </tr>
                      </table>

                      <div style="font-size:16px;font-weight:900;color:#0f172a;text-align:center;margin:0 0 6px;">&#127916; Video H\u01b0\u1edbng D\u1eabn</div>
                      <p style="margin:0 0 14px;text-align:center;font-size:13px;line-height:1.6;color:#64748b;">Nh\u1ea5n v\u00e0o t\u1eebng th\u1ebb b\u00ean d\u01b0\u1edbi \u0111\u1ec3 m\u1edf video tr\u00ean Google Drive.</p>
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:separate;border-spacing:0 12px;margin:0 0 24px;">
                        <tr>
                          <td width="50%" style="vertical-align:top;padding-right:6px;">
                            ${pmKpiCard}
                          </td>
                          <td width="50%" style="vertical-align:top;padding-left:6px;">
                            ${policyCard}
                          </td>
                        </tr>
                      </table>

                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 24px;">
                        <tr>
                          <td style="background:#fffaf0;border:1px solid #fde68a;border-radius:16px;padding:14px 16px;">
                            <p style="margin:0;font-size:13px;line-height:1.65;color:#92400e;">
                              Quy\u1ec1n xem video ch\u1ec9 \u0111\u01b0\u1ee3c c\u1ea5p \u1edf m\u1ee9c <strong>ng\u01b0\u1eddi xem</strong> cho \u0111\u00fang email b\u1ea1n d\u00f9ng \u0111\u1ec3 \u1ee9ng tuy\u1ec3n. N\u1ebfu m\u1edf link b\u1eb1ng t\u00e0i kho\u1ea3n Google kh\u00e1c, h\u00e3y chuy\u1ec3n l\u1ea1i \u0111\u00fang email n\u00e0y.
                            </p>
                          </td>
                        </tr>
                      </table>

                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:18px;padding:0;">
                        <tr>
                          <td style="padding:18px 20px;">
                            <div style="font-size:14px;font-weight:900;color:#0f172a;margin-bottom:12px;">Ti\u1ebfp theo s\u1ebd nh\u01b0 th\u1ebf n\u00e0o?</div>
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                              <tr>
                                <td style="font-size:13px;line-height:1.6;color:#475569;padding:0 0 8px;"><strong style="color:#ef4444;">01.</strong> Team review h\u1ed3 s\u01a1 v\u00e0 CV b\u1ea1n \u0111\u00e3 chia s\u1ebb.</td>
                              </tr>
                              <tr>
                                <td style="font-size:13px;line-height:1.6;color:#475569;padding:0 0 8px;"><strong style="color:#ef4444;">02.</strong> Markee ph\u1ea3n h\u1ed3i qua email ho\u1eb7c Zalo trong 3-5 ng\u00e0y l\u00e0m vi\u1ec7c n\u1ebfu ph\u00f9 h\u1ee3p.</td>
                              </tr>
                              <tr>
                                <td style="font-size:13px;line-height:1.6;color:#475569;padding:0;"><strong style="color:#ef4444;">03.</strong> V\u00f2ng trao \u0111\u1ed5i online s\u1ebd gi\u00fap team hi\u1ec3u r\u00f5 h\u01a1n v\u1ec1 \u0111\u1ecbnh h\u01b0\u1edbng c\u1ee7a b\u1ea1n.</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>

                      <p style="margin:24px 0 0;font-size:15px;line-height:1.75;color:#475569;">
                        H\u1eb9n g\u1eb7p b\u1ea1n,<br>
                        <strong style="color:#111827;">Markee Recruitment</strong>
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="background:#f8fafc;border-top:1px solid #e5edf6;padding:18px 38px;text-align:center;">
                      <p style="margin:0;font-size:12px;line-height:1.6;color:#94a3b8;">Email t\u1ef1 \u0111\u1ed9ng t\u1eeb Markee Recruitment. B\u1ea1n c\u00f3 th\u1ec3 ph\u1ea3n h\u1ed3i l\u1ea1i email n\u00e0y n\u1ebfu c\u1ea7n h\u1ed7 tr\u1ee3.</p>
                    </td>
                  </tr>
                </table>
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
