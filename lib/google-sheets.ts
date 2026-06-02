import { google } from "googleapis";
import type { sheets_v4 } from "googleapis";
import { getStatusInfo, type Application } from "./application";
import { GOOGLE_SHEETS_CONFIG } from "./server-config";
import { getSupabaseAdmin } from "./supabase-admin";
import { getRecruitmentMeta } from "./recruitment";

const SHEET_NAME = process.env.GOOGLE_SHEETS_TAB_NAME || "Sheet1";
const MAX_SHEET_ROWS = 10000;

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
  "CV / Portfolio",
  "Lời nhắn",
  "Trạng thái",
  "Ngày nộp",
  "Leader",
  "Level hiện tại",
  "Ngày start level",
  "Target LV1",
  "Nhận xét LV1",
  "Target LV2",
  "Nhận xét LV2",
  "Target LV3",
  "Nhận xét LV3",
];

const LEADER_COL_INDEX = HEADERS.indexOf("Leader");

function columnLetter(index: number) {
  let n = index;
  let letter = "";
  while (n > 0) {
    const mod = (n - 1) % 26;
    letter = String.fromCharCode(65 + mod) + letter;
    n = Math.floor((n - mod) / 26);
  }
  return letter;
}

function toLevelLabel(value: string) {
  return value.toUpperCase();
}

function appToRow(app: Application): string[] {
  const meta = getRecruitmentMeta(app.admin_notes || "");
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
    getStatusInfo(app.status).label,
    app.created_at ? new Date(app.created_at).toLocaleString("vi-VN") : "",
    meta.leader?.name || "",
    toLevelLabel(meta.currentLevel),
    meta.startLevelDate || "",
    meta.levels.lv1.target || "",
    meta.levels.lv1.comment || "",
    meta.levels.lv2.target || "",
    meta.levels.lv2.comment || "",
    meta.levels.lv3.target || "",
    meta.levels.lv3.comment || "",
  ];
}

async function getActiveLeaderNames() {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from("recruitment_leaders")
      .select("name")
      .eq("is_active", true)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return (data || [])
      .map((row) => String(row.name || "").trim())
      .filter(Boolean);
  } catch (error) {
    console.warn("[Google Sheets] Cannot load leaders for dropdown:", error);
    return [];
  }
}

function rgb(hex: string) {
  const clean = hex.replace("#", "");
  return {
    red: parseInt(clean.slice(0, 2), 16) / 255,
    green: parseInt(clean.slice(2, 4), 16) / 255,
    blue: parseInt(clean.slice(4, 6), 16) / 255,
  };
}

async function getSheetNumericId(
  sheets: sheets_v4.Sheets,
  spreadsheetId: string,
) {
  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
  const sheet = spreadsheet.data.sheets?.find(
    (item) => item.properties?.title === SHEET_NAME,
  );
  const sheetId = sheet?.properties?.sheetId;
  return typeof sheetId === "number" ? sheetId : null;
}

async function styleRecruitmentSheet(
  sheets: sheets_v4.Sheets,
  spreadsheetId: string,
) {
  const sheetId = await getSheetNumericId(sheets, spreadsheetId);
  if (sheetId === null) return;

  const leaderNames = await getActiveLeaderNames();
  const requests: sheets_v4.Schema$Request[] = [
    {
      updateSheetProperties: {
        properties: {
          sheetId,
          gridProperties: { frozenRowCount: 1 },
        },
        fields: "gridProperties.frozenRowCount",
      },
    },
    {
      repeatCell: {
        range: {
          sheetId,
          startRowIndex: 0,
          endRowIndex: 1,
          startColumnIndex: 0,
          endColumnIndex: HEADERS.length,
        },
        cell: {
          userEnteredFormat: {
            textFormat: { bold: true, foregroundColor: rgb("#ffffff") },
            horizontalAlignment: "CENTER",
            verticalAlignment: "MIDDLE",
            wrapStrategy: "WRAP",
          },
        },
        fields:
          "userEnteredFormat(textFormat,horizontalAlignment,verticalAlignment,wrapStrategy)",
      },
    },
    ...[
      { start: 0, end: 25, color: "#4a2318" },
      { start: 25, end: 28, color: "#5b3f88" },
      { start: 28, end: 30, color: "#f59e0b" },
      { start: 30, end: 32, color: "#eab308" },
      { start: 32, end: 34, color: "#16a34a" },
    ].map<sheets_v4.Schema$Request>((group) => ({
      repeatCell: {
        range: {
          sheetId,
          startRowIndex: 0,
          endRowIndex: 1,
          startColumnIndex: group.start,
          endColumnIndex: group.end,
        },
        cell: {
          userEnteredFormat: {
            backgroundColor: rgb(group.color),
          },
        },
        fields: "userEnteredFormat.backgroundColor",
      },
    })),
    {
      repeatCell: {
        range: {
          sheetId,
          startRowIndex: 1,
          endRowIndex: MAX_SHEET_ROWS,
          startColumnIndex: 0,
          endColumnIndex: HEADERS.length,
        },
        cell: {
          userEnteredFormat: {
            verticalAlignment: "TOP",
            wrapStrategy: "WRAP",
          },
        },
        fields: "userEnteredFormat(verticalAlignment,wrapStrategy)",
      },
    },
    {
      autoResizeDimensions: {
        dimensions: {
          sheetId,
          dimension: "COLUMNS",
          startIndex: 0,
          endIndex: HEADERS.length,
        },
      },
    },
    {
      setBasicFilter: {
        filter: {
          range: {
            sheetId,
            startRowIndex: 0,
            endRowIndex: MAX_SHEET_ROWS,
            startColumnIndex: 0,
            endColumnIndex: HEADERS.length,
          },
        },
      },
    },
  ];

  if (leaderNames.length > 0 && LEADER_COL_INDEX >= 0) {
    requests.push({
      setDataValidation: {
        range: {
          sheetId,
          startRowIndex: 1,
          endRowIndex: MAX_SHEET_ROWS,
          startColumnIndex: LEADER_COL_INDEX,
          endColumnIndex: LEADER_COL_INDEX + 1,
        },
        rule: {
          condition: {
            type: "ONE_OF_LIST",
            values: leaderNames.map((name) => ({ userEnteredValue: name })),
          },
          strict: true,
          showCustomUi: true,
        },
      },
    });
  }

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: { requests },
  });
}

async function ensureHeaderAndStyle(
  sheets: sheets_v4.Sheets,
  spreadsheetId: string,
) {
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${SHEET_NAME}!A1:${columnLetter(HEADERS.length)}1`,
    valueInputOption: "RAW",
    requestBody: { values: [HEADERS] },
  });

  await styleRecruitmentSheet(sheets, spreadsheetId);
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
    await ensureHeaderAndStyle(sheets, sheetId);

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

    const numericSheetId = await getSheetNumericId(sheets, sheetId);
    if (numericSheetId === null) return false;

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: sheetId,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: numericSheetId,
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
    await ensureHeaderAndStyle(sheets, sheetId);

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
    const lastCol = columnLetter(HEADERS.length);
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
    const lastCol = columnLetter(HEADERS.length);

    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `${SHEET_NAME}!A1:${lastCol}${rows.length}`,
      valueInputOption: "RAW",
      requestBody: { values: rows },
    });

    const clearFrom = rows.length + 1;
    await sheets.spreadsheets.values.clear({
      spreadsheetId: sheetId,
      range: `${SHEET_NAME}!A${clearFrom}:${lastCol}${MAX_SHEET_ROWS}`,
    });

    await styleRecruitmentSheet(sheets, sheetId);

    console.log(`[Google Sheets] Full sync: ${apps.length} rows`);
    return true;
  } catch (err) {
    console.error("[Google Sheets] Error:", err);
    return false;
  }
}
