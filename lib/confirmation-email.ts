import nodemailer from "nodemailer";

type ConfirmationEmailInput = {
  to: string;
  fullName?: string | null;
  position?: string[] | null;
  videoUrl?: string;
};

const SMTP_HOST = process.env.SMTP_HOST || "";
const SMTP_PORT = Number.parseInt(process.env.SMTP_PORT || "465", 10);
const SMTP_SECURE =
  process.env.SMTP_SECURE === "false" ? false : SMTP_PORT === 465;
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const MAIL_FROM_EMAIL = process.env.MAIL_FROM_EMAIL || SMTP_USER;
const MAIL_FROM_NAME = process.env.MAIL_FROM_NAME || "Markee Recruitment";
const MAIL_SUBJECT_PREFIX = (process.env.MAIL_SUBJECT_PREFIX || "").trim();
const ZALO_COMMUNITY_URL = (process.env.ZALO_COMMUNITY_URL || "").trim();
const ONBOARDING_VIDEO_URL = (process.env.ONBOARDING_VIDEO_URL || "").trim();

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getFirstName(fullName?: string | null) {
  const parts = (fullName || "").trim().split(/\s+/).filter(Boolean);
  return parts.length ? parts[parts.length - 1] : "bạn";
}

function getSubject() {
  const prefix = MAIL_SUBJECT_PREFIX ? `[${MAIL_SUBJECT_PREFIX}] ` : "";
  return `${prefix}Markee đã nhận hồ sơ ứng tuyển của bạn`;
}

function getTransporter() {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !MAIL_FROM_EMAIL) return null;

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

function buildText({
  fullName,
  position,
  videoUrl,
}: ConfirmationEmailInput) {
  const name = getFirstName(fullName);
  const finalVideoUrl = ONBOARDING_VIDEO_URL || videoUrl || "";
  const positions = position?.length ? position.join(", ") : "vị trí thực tập";

  return [
    `Chào ${name},`,
    "",
    `Markee đã nhận hồ sơ ứng tuyển ${positions} của bạn.`,
    "Cảm ơn bạn đã dành thời gian chia sẻ định hướng, kinh nghiệm và mong muốn thực tập.",
    "",
    ZALO_COMMUNITY_URL ? `Tham gia Zalo ứng viên: ${ZALO_COMMUNITY_URL}` : "",
    finalVideoUrl ? `Xem 2 video giới thiệu dành cho intern: ${finalVideoUrl}` : "",
    "",
    "Lưu ý: quyền xem video đã được cấp cho đúng email bạn dùng để ứng tuyển. Nếu mở link bằng tài khoản Google khác, hãy đổi lại đúng email này.",
    "",
    "Hẹn gặp bạn,",
    "Markee Recruitment",
  ]
    .filter(Boolean)
    .join("\n");
}

function buildHtml({
  fullName,
  position,
  videoUrl,
}: ConfirmationEmailInput) {
  const name = escapeHtml(getFirstName(fullName));
  const positions = escapeHtml(
    position?.length ? position.join(", ") : "vị trí thực tập",
  );
  const finalVideoUrl = ONBOARDING_VIDEO_URL || videoUrl || "";
  const safeVideoUrl = escapeHtml(finalVideoUrl);
  const safeZaloUrl = escapeHtml(ZALO_COMMUNITY_URL);

  return `<!doctype html>
<html lang="vi">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Markee Recruitment</title>
  </head>
  <body style="margin:0;background:#f3f6fb;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;color:#111827;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f6fb;padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;background:#ffffff;border:1px solid #e5edf6;border-radius:22px;overflow:hidden;box-shadow:0 18px 48px rgba(15,23,42,.10);">
            <tr>
              <td style="padding:0;">
                <div style="background:linear-gradient(135deg,#ef4444 0%,#ff6b5f 48%,#7c3aed 100%);padding:34px 34px 30px;text-align:center;color:#ffffff;">
                  <div style="display:inline-block;width:48px;height:48px;line-height:48px;border-radius:15px;background:rgba(255,255,255,.18);font-size:24px;font-weight:800;margin-bottom:14px;">M</div>
                  <h1 style="margin:0;font-size:30px;line-height:1.25;font-weight:800;">Chúc mừng ${name}!</h1>
                  <p style="margin:10px 0 0;font-size:16px;line-height:1.6;color:rgba(255,255,255,.92);">Hồ sơ ứng tuyển Markee Internship 2026 đã được ghi nhận.</p>
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:34px;">
                <p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:#334155;">Chào ${name},</p>
                <p style="margin:0 0 22px;font-size:16px;line-height:1.75;color:#334155;">
                  Cảm ơn bạn đã quan tâm và ứng tuyển vào <strong style="color:#111827;">${positions}</strong>. Team đã nhận được thông tin của bạn và sẽ phản hồi qua email/Zalo nếu hồ sơ phù hợp với vòng tiếp theo.
                </p>

                <div style="border:1px solid #fee2e2;background:#fff7f7;border-radius:18px;padding:18px 20px;margin:0 0 22px;">
                  <div style="font-size:13px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#ef4444;margin-bottom:8px;">Bước tiếp theo</div>
                  <p style="margin:0;font-size:15px;line-height:1.7;color:#475569;">
                    Tham gia kênh Zalo ứng viên để không bỏ lỡ cập nhật, sau đó xem trước 2 video giới thiệu về chính sách công ty và lộ trình phát triển dành cho Intern.
                  </p>
                </div>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 24px;">
                  <tr>
                    <td align="center" style="padding:0 0 12px;">
                      ${
                        safeZaloUrl
                          ? `<a href="${safeZaloUrl}" style="display:inline-block;background:#0068ff;color:#ffffff;text-decoration:none;border-radius:14px;padding:14px 22px;font-size:15px;font-weight:800;box-shadow:0 12px 24px rgba(0,104,255,.22);">Tham gia Zalo ứng viên</a>`
                          : ""
                      }
                    </td>
                  </tr>
                  <tr>
                    <td align="center">
                      ${
                        safeVideoUrl
                          ? `<a href="${safeVideoUrl}" style="display:inline-block;background:#ef4444;color:#ffffff;text-decoration:none;border-radius:14px;padding:14px 22px;font-size:15px;font-weight:800;box-shadow:0 12px 24px rgba(239,68,68,.22);">Xem 2 video hướng dẫn</a>`
                          : ""
                      }
                    </td>
                  </tr>
                </table>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:separate;border-spacing:0 10px;margin:0 0 22px;">
                  <tr>
                    <td style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:14px 16px;">
                      <strong style="display:block;color:#0f172a;font-size:14px;margin-bottom:4px;">Video 1: Cách sử dụng PM và file KPI cá nhân</strong>
                      <span style="font-size:13px;line-height:1.55;color:#64748b;">Giúp bạn hiểu cách team theo dõi công việc, cập nhật tiến độ và phối hợp trong kỳ thực tập.</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:14px 16px;">
                      <strong style="display:block;color:#0f172a;font-size:14px;margin-bottom:4px;">Video 2: Policy và Roadmap cho Intern</strong>
                      <span style="font-size:13px;line-height:1.55;color:#64748b;">Tóm tắt chính sách, kỳ vọng làm việc và lộ trình phát triển khi đồng hành cùng Markee.</span>
                    </td>
                  </tr>
                </table>

                <div style="background:#fffaf0;border:1px solid #fde68a;border-radius:16px;padding:14px 16px;margin:0 0 22px;">
                  <p style="margin:0;font-size:13px;line-height:1.65;color:#92400e;">
                    Lưu ý: quyền xem video đã được cấp cho đúng email bạn dùng để ứng tuyển. Nếu mở link bằng tài khoản Google khác, hãy chuyển lại đúng email này.
                  </p>
                </div>

                <p style="margin:0;font-size:15px;line-height:1.75;color:#475569;">
                  Hẹn gặp bạn,<br>
                  <strong style="color:#111827;">Markee Recruitment</strong>
                </p>
              </td>
            </tr>

            <tr>
              <td style="background:#f8fafc;border-top:1px solid #e5edf6;padding:18px 34px;text-align:center;">
                <p style="margin:0;font-size:12px;line-height:1.6;color:#94a3b8;">Email tự động từ Markee Recruitment. Bạn có thể phản hồi lại email này nếu cần hỗ trợ.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function sendApplicationConfirmationEmail(
  input: ConfirmationEmailInput,
) {
  const to = input.to.trim().toLowerCase();
  if (!to) return { sent: false, reason: "missing-recipient" as const };

  const transporter = getTransporter();
  if (!transporter) return { sent: false, reason: "missing-smtp" as const };

  await transporter.sendMail({
    from: `"${MAIL_FROM_NAME}" <${MAIL_FROM_EMAIL}>`,
    to,
    subject: getSubject(),
    text: buildText(input),
    html: buildHtml(input),
    replyTo: MAIL_FROM_EMAIL,
  });

  return { sent: true as const };
}
