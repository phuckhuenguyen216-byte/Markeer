import { google } from "googleapis";
import type { Application } from "./application";
import { GOOGLE_SHEETS_CONFIG } from "./server-config";

const SHEET_NAME = process.env.GOOGLE_SHEETS_TAB_NAME || "Sheet1";

function getAuth() {
  const email = GOOGLE_SHEETS_CONFIG.serviceAccountEmail;
  const key = GOOGLE_SHEETS_CONFIG.privateKey;
  if (!email || !key) return null;

  return new google.auth.JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

const HEADERS = [
  "ID",
  "Họ tên",
  "Email",
  "SĐT",
  "Zalo",
  "Ngày sinh",
  "Trường",
  "Nhập học",
  "Ra trường",
  "Vị trí ứng tuyển",
  "Điều hứng thú",
  "Lý do ứng tuyển",
  "Mục tiêu thực tập",
  "Kinh nghiệm",
  "Kỹ năng",
  "Điểm mạnh",
  "Cần cải thiện",
  "Kỳ vọng",
  "Cách xử lý vấn đề",
  "Phản ứng góp ý",
  "Hình thức làm việc",
  "CV",
  "Lời nhắn",
  "Trạng thái",
  "Ngày nộp",
];

function appToRow(app: Application): string[] {
  const isZalo = (app.admin_notes || "").toLowerCase().includes("zalo");
  const linkedIn = (app.admin_notes || "")
    .split("\n")
    .find((line) => line.startsWith("LinkedIn:"))
    ?.trim();
  const profileLinks = [app.cv || "", linkedIn || ""]
    .filter(Boolean)
    .join("\n");
  const workPref = Object.entries(app.work_preference || {})
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
    .join(" | ");

  return [
    app.id,
    app.full_name,
    app.email,
    app.phone,
    isZalo ? "Có" : "Không",
    app.dob || "",
    app.school || "",
    app.enrollment || "",
    app.graduation || "",
    (app.career_journey || []).join(", "),
    (app.interest_reason || []).join(", "),
    app.why_apply || "",
    app.goal || "",
    app.experience || "",
    app.skills || "",
    app.strengths || "",
    app.weaknesses || "",
    app.expectation || "",
    (app.problem_solving || []).join(", "),
    (app.feedback_response || []).join(", "),
    workPref,
    profileLinks,
    app.note || "",
    app.status,
    app.created_at ? new Date(app.created_at).toLocaleString("vi-VN") : "",
  ];
}

export async function appendToSheet(app: Application): Promise<boolean> {
  const sheetId = GOOGLE_SHEETS_CONFIG.sheetId;
  const auth = getAuth();
  if (!sheetId || !auth) {
    console.warn("[Google Sheets] Not configured - skipping sync");
    return false;
  }

  try {
    const sheets = google.sheets({ version: "v4", auth });

    const existing = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${SHEET_NAME}!A1:A1`,
    });

    if (!existing.data.values || existing.data.values.length === 0) {
      await sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: `${SHEET_NAME}!A1`,
        valueInputOption: "RAW",
        requestBody: { values: [HEADERS] },
      });
    }

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: `${SHEET_NAME}!A1`,
      valueInputOption: "RAW",
      requestBody: { values: [appToRow(app)] },
    });

    console.log(`[Google Sheets] Synced: ${app.full_name} (${app.id})`);
    return true;
  } catch (err) {
    console.error("[Google Sheets] Error:", err);
    return false;
  }
}

export async function deleteFromSheet(appId: string): Promise<boolean> {
  const sheetId = GOOGLE_SHEETS_CONFIG.sheetId;
  const auth = getAuth();
  if (!sheetId || !auth) return false;

  try {
    const sheets = google.sheets({ version: "v4", auth });

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${SHEET_NAME}!A:A`,
    });

    const rows = res.data.values || [];
    const rowIndex = rows.findIndex((r) => r[0] === appId);
    if (rowIndex === -1) return false;

    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: sheetId,
    });
    const sheet = spreadsheet.data.sheets?.find(
      (s) => s.properties?.title === SHEET_NAME,
    );
    if (!sheet?.properties?.sheetId && sheet?.properties?.sheetId !== 0) {
      return false;
    }

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: sheetId,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: sheet.properties.sheetId,
                dimension: "ROWS",
                startIndex: rowIndex,
                endIndex: rowIndex + 1,
              },
            },
          },
        ],
      },
    });

    console.log(`[Google Sheets] Deleted row for: ${appId}`);
    return true;
  } catch (err) {
    console.error("[Google Sheets] Delete error:", err);
    return false;
  }
}

export async function updateRowInSheet(app: Application): Promise<boolean> {
  const sheetId = GOOGLE_SHEETS_CONFIG.sheetId;
  const auth = getAuth();
  if (!sheetId || !auth) return false;

  try {
    const sheets = google.sheets({ version: "v4", auth });

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${SHEET_NAME}!A:A`,
    });

    const rows = res.data.values || [];
    const rowIndex = rows.findIndex((r) => r[0] === app.id);
    if (rowIndex === -1) {
      return appendToSheet(app);
    }

    const rowNum = rowIndex + 1;
    const lastCol = String.fromCharCode(64 + HEADERS.length);
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `${SHEET_NAME}!A${rowNum}:${lastCol}${rowNum}`,
      valueInputOption: "RAW",
      requestBody: { values: [appToRow(app)] },
    });

    console.log(`[Google Sheets] Updated row ${rowNum}: ${app.full_name}`);
    return true;
  } catch (err) {
    console.error("[Google Sheets] Update error:", err);
    return false;
  }
}

export async function syncAllToSheet(apps: Application[]): Promise<boolean> {
  const sheetId = GOOGLE_SHEETS_CONFIG.sheetId;
  const auth = getAuth();
  if (!sheetId || !auth) {
    console.warn("[Google Sheets] Not configured - skipping sync");
    return false;
  }

  try {
    const sheets = google.sheets({ version: "v4", auth });
    const rows = [HEADERS, ...apps.map(appToRow)];

    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `${SHEET_NAME}!A1`,
      valueInputOption: "RAW",
      requestBody: { values: rows },
    });

    const clearFrom = rows.length + 1;
    await sheets.spreadsheets.values.clear({
      spreadsheetId: sheetId,
      range: `${SHEET_NAME}!A${clearFrom}:Z10000`,
    });

    console.log(`[Google Sheets] Full sync: ${apps.length} rows`);
    return true;
  } catch (err) {
    console.error("[Google Sheets] Error:", err);
    return false;
  }
}
