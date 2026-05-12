import { Readable } from "stream";
import { google } from "googleapis";
import type { drive_v3 } from "googleapis";
import { GOOGLE_SHEETS_CONFIG } from "./server-config";

const DRIVE_ROOT_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || "";
const MAX_CV_SIZE = 10 * 1024 * 1024;
const ALLOWED_CV_MIME = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const DRIVE_FOLDER_MKT_SALES_ID = process.env.GOOGLE_DRIVE_FOLDER_MKT_SALES_ID || "";
const DRIVE_FOLDER_INFRA_ID = process.env.GOOGLE_DRIVE_FOLDER_INFRA_ID || "";
const DRIVE_FOLDER_DEV_AI_ID = process.env.GOOGLE_DRIVE_FOLDER_DEV_AI_ID || "";
const DRIVE_ONBOARDING_FOLDER_ID =
  process.env.GOOGLE_DRIVE_ONBOARDING_FOLDER_ID || "";
const DEFAULT_ONBOARDING_VIDEO_FILE_IDS = [
  "1xv9UfkDFxBLxLkILoCf5UFB0lwuurb64",
  "15KEzLkC1KRE5GNf5Dad89sjJuO4UzPAW",
];
const DRIVE_ONBOARDING_FILE_IDS = (
  process.env.GOOGLE_DRIVE_ONBOARDING_FILE_IDS ||
  DEFAULT_ONBOARDING_VIDEO_FILE_IDS.join(",")
)
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);
const DRIVE_SEND_NOTIFICATION_EMAIL =
  process.env.GOOGLE_DRIVE_SEND_NOTIFICATION_EMAIL === "true";

const CV_BUCKETS = {
  devAi: {
    envFolderId: DRIVE_FOLDER_DEV_AI_ID,
    folderName: "Dev/Devops or AI",
  },
  infra: {
    envFolderId: DRIVE_FOLDER_INFRA_ID,
    folderName: "Infras",
  },
  marketingSales: {
    envFolderId: DRIVE_FOLDER_MKT_SALES_ID,
    folderName: "MKT or Sales",
  },
} as const;

type CvBucket = keyof typeof CV_BUCKETS;

function getAuth() {
  const email = GOOGLE_SHEETS_CONFIG.serviceAccountEmail;
  const key = GOOGLE_SHEETS_CONFIG.privateKey;
  if (!email || !key) return null;

  return new google.auth.JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/drive"],
  });
}

function safePart(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function getExtension(fileName: string, mimeType: string) {
  const ext = fileName.match(/\.[a-zA-Z0-9]+$/)?.[0]?.toLowerCase();
  if (ext) return ext;
  if (mimeType === "application/pdf") return ".pdf";
  if (mimeType === "application/msword") return ".doc";
  return ".docx";
}

function escapeDriveQueryValue(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

function getCvBucket(careerCategory: string, careerJourney: string[]): CvBucket {
  const text = `${careerCategory} ${careerJourney.join(" ")}`.toLowerCase();

  if (
    text.includes("marketing") ||
    text.includes("sales") ||
    text.includes("content") ||
    text.includes("performance") ||
    text.includes("acquisition") ||
    text.includes("customer success") ||
    text.includes("business development") ||
    text.includes("b2b")
  ) {
    return "marketingSales";
  }

  if (
    text.includes("infrastructure") ||
    text.includes("network") ||
    text.includes("system") ||
    text.includes("security") ||
    text.includes("cloud") ||
    text.includes("datacenter") ||
    text.includes("tổng đài") ||
    text.includes("hoi nghi") ||
    text.includes("hội nghị")
  ) {
    return "infra";
  }

  return "devAi";
}

async function resolveCvFolderId(drive: drive_v3.Drive, bucket: CvBucket) {
  const config = CV_BUCKETS[bucket];
  if (config.envFolderId) return config.envFolderId;

  if (!DRIVE_ROOT_FOLDER_ID) {
    throw new Error(
      "Chưa cấu hình GOOGLE_DRIVE_FOLDER_ID hoặc folder ID theo nhóm CV.",
    );
  }

  const response = await drive.files.list({
    q: [
      `'${escapeDriveQueryValue(DRIVE_ROOT_FOLDER_ID)}' in parents`,
      "mimeType = 'application/vnd.google-apps.folder'",
      "trashed = false",
      `name = '${escapeDriveQueryValue(config.folderName)}'`,
    ].join(" and "),
    fields: "files(id, name)",
    pageSize: 1,
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });

  const folderId = response.data.files?.[0]?.id;
  if (!folderId) {
    throw new Error(
      `Chưa tìm thấy thư mục Drive "${config.folderName}" trong folder CV gốc.`,
    );
  }

  return folderId;
}

function getGoogleErrorInfo(error: unknown) {
  if (!error || typeof error !== "object") {
    return { status: 0, message: "" };
  }

  const err = error as {
    code?: number;
    message?: string;
    response?: {
      status?: number;
      data?: {
        error?: {
          message?: string;
        };
      };
    };
  };

  return {
    status: err.code ?? err.response?.status ?? 0,
    message: err.response?.data?.error?.message ?? err.message ?? "",
  };
}

function isServiceAccountQuotaError(error: unknown) {
  const { message } = getGoogleErrorInfo(error);
  return /service accounts do not have storage quota/i.test(message);
}

async function grantReaderPermission({
  drive,
  fileId,
  email,
  emailMessage,
}: {
  drive: drive_v3.Drive;
  fileId: string;
  email: string;
  emailMessage?: string;
}) {
  try {
    await drive.permissions.create({
      fileId,
      sendNotificationEmail: DRIVE_SEND_NOTIFICATION_EMAIL,
      emailMessage,
      requestBody: {
        type: "user",
        role: "reader",
        emailAddress: email,
      },
      fields: "id",
      supportsAllDrives: true,
    });

    return { shared: true, alreadyHadAccess: false };
  } catch (error) {
    const { status, message } = getGoogleErrorInfo(error);
    if (status === 409 || /already|duplicate|permission/i.test(message)) {
      return { shared: false, alreadyHadAccess: true };
    }

    throw error;
  }
}

export async function shareOnboardingFolderWithApplicant({
  email,
  fullName,
}: {
  email: string;
  fullName: string;
}) {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) {
    return { shared: false, alreadyHadAccess: false, folderUrl: "" };
  }

  if (!DRIVE_ONBOARDING_FOLDER_ID) {
    throw new Error("Chua cau hinh GOOGLE_DRIVE_ONBOARDING_FOLDER_ID.");
  }

  const auth = getAuth();
  if (!auth) {
    throw new Error("Google Drive share chua duoc cau hinh.");
  }

  const drive = google.drive({ version: "v3", auth });
  const folderUrl = `https://drive.google.com/drive/folders/${DRIVE_ONBOARDING_FOLDER_ID}`;
  const candidateName = fullName.trim() || "ban";
  const emailMessage =
    `Chao ${candidateName},\n\n` +
    "Markee da nhan ho so ung tuyen cua ban. Day la thu muc gioi thieu cong ty va tai lieu onboarding danh cho ung vien.\n\n" +
    "Ban co the xem truoc de hieu them ve Markee, quy trinh lam viec va cac thong tin danh cho intern.\n\n" +
    "Hen gap ban,\nMarkee Recruitment";
  const targets = Array.from(
    new Set([DRIVE_ONBOARDING_FOLDER_ID, ...DRIVE_ONBOARDING_FILE_IDS]),
  );
  let sharedAny = false;
  let alreadyHadAnyAccess = false;

  for (const [index, fileId] of targets.entries()) {
    const result = await grantReaderPermission({
      drive,
      fileId,
      email: normalizedEmail,
      emailMessage: index === 0 ? emailMessage : undefined,
    });

    sharedAny = sharedAny || result.shared;
    alreadyHadAnyAccess = alreadyHadAnyAccess || result.alreadyHadAccess;
  }

  return {
    shared: sharedAny,
    alreadyHadAccess: !sharedAny && alreadyHadAnyAccess,
    folderUrl,
  };
}

export async function uploadCvToDrive({
  file,
  fullName,
  email,
  careerCategory,
  careerJourney,
}: {
  file: File;
  fullName: string;
  email: string;
  careerCategory: string;
  careerJourney: string[];
}) {
  if (!file.size || file.size > MAX_CV_SIZE) {
    throw new Error("CV cần nhỏ hơn 10MB.");
  }

  if (!ALLOWED_CV_MIME.has(file.type)) {
    throw new Error("Chỉ hỗ trợ CV dạng PDF, DOC hoặc DOCX.");
  }

  const auth = getAuth();
  if (!auth) {
    throw new Error("Google Drive upload chưa được cấu hình.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const drive = google.drive({ version: "v3", auth });
  const bucket = getCvBucket(careerCategory, careerJourney);
  const targetFolderId = await resolveCvFolderId(drive, bucket);
  const now = new Date().toISOString().replace(/[:.]/g, "-");
  const baseName = [
    "Markee-CV",
    safePart(fullName || "candidate"),
    safePart(email || "no-email"),
    now,
  ]
    .filter(Boolean)
    .join("-");
  const name = `${baseName}${getExtension(file.name, file.type)}`;

  let createdFile: drive_v3.Schema$File;
  try {
    const created = await drive.files.create({
      requestBody: {
        name,
        mimeType: file.type,
        parents: [targetFolderId],
      },
      media: {
        mimeType: file.type,
        body: Readable.from(buffer),
      },
      fields: "id, webViewLink",
      supportsAllDrives: true,
    });
    createdFile = created.data;
  } catch (error) {
    if (isServiceAccountQuotaError(error)) {
      throw new Error(
        "Folder CV đang nằm trong My Drive nên service account không có quota để upload. Hãy chuyển các thư mục CV sang Shared drive, hoặc đổi sang OAuth upload bằng tài khoản Google thật.",
      );
    }

    throw error;
  }

  const fileId = createdFile.id;
  if (!fileId) throw new Error("Không lấy được ID file sau khi upload.");

  await drive.permissions.create({
    fileId,
    requestBody: {
      type: "anyone",
      role: "reader",
    },
    supportsAllDrives: true,
  });

  const shared = await drive.files.get({
    fileId,
    fields: "webViewLink",
    supportsAllDrives: true,
  });

  return shared.data.webViewLink || createdFile.webViewLink || "";
}
