/* ─────────────────────────────────────────────
   Recruitment admin — shared constants & helpers
   Used by /admin/applications (list) and detail page.
   ───────────────────────────────────────────── */
import type { Application } from "@/lib/application";

export const TEAM_FILTERS = [
  "all",
  "Infrastructure",
  "Dev/DevOps",
  "AI",
  "Marketing",
  "Sales",
];

export const TEAM_POSITIONS: Record<string, string[]> = {
  Infrastructure: [
    "Network Team",
    "System Team",
    "Security Team",
    "Hội nghị & Tổng đài",
    "Cloud & Datacenter",
  ],
  "Dev/DevOps": [
    "BA",
    "Backend Developer",
    "Frontend Developer",
    "Full-stack Developer",
    "DevOps / Platform",
  ],
  AI: ["AI / ML Engineer", "Data Analyst / Engineer", "AI Product / Research"],
  Marketing: ["Content & Social", "Performance & Acquisition", "Marketing Ops"],
  Sales: ["B2B Sales", "Business Development", "Customer Success"],
};

export const TEAM_STYLES: Record<
  string,
  { bg: string; color: string; dot: string }
> = {
  Infrastructure: { bg: "#eff6ff", color: "#2563eb", dot: "#3b82f6" },
  "Dev/DevOps": { bg: "#f5f3ff", color: "#7c3aed", dot: "#8b5cf6" },
  AI: { bg: "#fef2f2", color: "#dc2626", dot: "#ef4444" },
  Marketing: { bg: "#fffbeb", color: "#d97706", dot: "#f59e0b" },
  Sales: { bg: "#ecfdf5", color: "#059669", dot: "#10b981" },
  all: { bg: "#f3f4f6", color: "#4b5563", dot: "#6b7280" },
};

/** Position → color + short code mapping matching the recruitment form */
export const POSITION_COLORS: Record<
  string,
  { bg: string; color: string; abbr: string }
> = {
  "Network Team": { bg: "#dbeafe", color: "#2563eb", abbr: "NET" },
  "System Team": { bg: "#dbeafe", color: "#2563eb", abbr: "SYS" },
  "Security Team": { bg: "#dbeafe", color: "#2563eb", abbr: "SEC" },
  "Hội nghị & Tổng đài": { bg: "#dbeafe", color: "#2563eb", abbr: "COM" },
  "Cloud & Datacenter": { bg: "#dbeafe", color: "#2563eb", abbr: "CLD" },
  BA: { bg: "#ede9fe", color: "#7c3aed", abbr: "BA" },
  "Backend Developer": { bg: "#ede9fe", color: "#7c3aed", abbr: "BE" },
  "Frontend Developer": { bg: "#ede9fe", color: "#7c3aed", abbr: "FE" },
  "Full-stack Developer": { bg: "#ede9fe", color: "#7c3aed", abbr: "FS" },
  "DevOps / Platform": { bg: "#ede9fe", color: "#7c3aed", abbr: "OPS" },
  "AI / ML Engineer": { bg: "#fee2e2", color: "#dc2626", abbr: "ML" },
  "Data Analyst / Engineer": { bg: "#fee2e2", color: "#dc2626", abbr: "DA" },
  "AI Product / Research": { bg: "#fee2e2", color: "#dc2626", abbr: "RES" },
  "Content & Social": { bg: "#fef3c7", color: "#d97706", abbr: "CNT" },
  "Performance & Acquisition": { bg: "#fef3c7", color: "#d97706", abbr: "PRF" },
  "Marketing Ops": { bg: "#fef3c7", color: "#d97706", abbr: "MKT" },
  "B2B Sales": { bg: "#d1fae5", color: "#059669", abbr: "B2B" },
  "Business Development": { bg: "#d1fae5", color: "#059669", abbr: "BD" },
  "Customer Success": { bg: "#d1fae5", color: "#059669", abbr: "CS" },
};

export const DEFAULT_POS_COLOR = { bg: "#f3f4f6", color: "#4b5563", abbr: "" };

const STARRED_TAG = "[STARRED]";
const META_START = "[RECRUITMENT_META]";
const META_END = "[/RECRUITMENT_META]";
const META_RE = /\s*\[RECRUITMENT_META\][\s\S]*?\[\/RECRUITMENT_META\]\s*/g;

export type LeaderTeam =
  | "Marketing"
  | "Dev/DevOps"
  | "AI"
  | "Infrastructure"
  | "Sales"
  | "Other";

export type EmployeeLevel = "lv1" | "lv2" | "lv3";

export type RecruitmentLeader = {
  id: string;
  name: string;
  team: LeaderTeam;
};

export type RecruitmentPosition = {
  id: string;
  label: string;
  team: string;
  sort_order: number;
  is_active: boolean;
};

export const DEFAULT_RECRUITMENT_POSITIONS: RecruitmentPosition[] =
  Object.entries(TEAM_POSITIONS).flatMap(([team, positions], teamIndex) =>
    positions.map((label, index) => ({
      id: label
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
      label,
      team,
      sort_order: teamIndex * 100 + index,
      is_active: true,
    })),
  );

export type LevelRecord = {
  target: string;
  comment: string;
  updatedAt?: string;
};

export type RecruitmentManagement = {
  leader: RecruitmentLeader | null;
  currentLevel: EmployeeLevel;
  startLevelDate: string;
  levels: Record<EmployeeLevel, LevelRecord>;
};

export const LEVEL_OPTIONS: { value: EmployeeLevel; label: string }[] = [
  { value: "lv1", label: "LV1" },
  { value: "lv2", label: "LV2" },
  { value: "lv3", label: "LV3" },
];

export const LEADER_TEAMS: { value: LeaderTeam; label: string; color: string; bg: string }[] = [
  { value: "Marketing", label: "MKT", color: "#d97706", bg: "#fffbeb" },
  { value: "Dev/DevOps", label: "DEV", color: "#7c3aed", bg: "#f5f3ff" },
  { value: "AI", label: "AI", color: "#dc2626", bg: "#fef2f2" },
  { value: "Infrastructure", label: "INF", color: "#2563eb", bg: "#eff6ff" },
  { value: "Sales", label: "SALES", color: "#059669", bg: "#ecfdf5" },
  { value: "Other", label: "OTHER", color: "#4b5563", bg: "#f3f4f6" },
];

export const DEFAULT_LEADERS: RecruitmentLeader[] = [
  { id: "leader-mkt", name: "Thuong", team: "Marketing" },
  { id: "leader-dev", name: "Dev Lead", team: "Dev/DevOps" },
  { id: "leader-ai", name: "AI Lead", team: "AI" },
];

export function createEmptyManagement(): RecruitmentManagement {
  return {
    leader: null,
    currentLevel: "lv1",
    startLevelDate: "",
    levels: {
      lv1: { target: "", comment: "" },
      lv2: { target: "", comment: "" },
      lv3: { target: "", comment: "" },
    },
  };
}

function hasMeta(notes: string) {
  return (notes || "").includes(META_START);
}

export function stripRecruitmentMeta(notes: string) {
  return (notes || "").replace(META_RE, "").trim();
}

export function getRecruitmentMeta(notes: string): RecruitmentManagement {
  const raw = (notes || "").match(
    /\[RECRUITMENT_META\]([\s\S]*?)\[\/RECRUITMENT_META\]/,
  )?.[1];
  if (!raw) return createEmptyManagement();

  try {
    const parsed = JSON.parse(raw) as Partial<RecruitmentManagement>;
    const empty = createEmptyManagement();
    return {
      leader: parsed.leader ?? null,
      currentLevel:
        parsed.currentLevel === "lv2" || parsed.currentLevel === "lv3"
          ? parsed.currentLevel
          : "lv1",
      startLevelDate:
        typeof parsed.startLevelDate === "string" ? parsed.startLevelDate : "",
      levels: {
        lv1: { ...empty.levels.lv1, ...(parsed.levels?.lv1 || {}) },
        lv2: { ...empty.levels.lv2, ...(parsed.levels?.lv2 || {}) },
        lv3: { ...empty.levels.lv3, ...(parsed.levels?.lv3 || {}) },
      },
    };
  } catch {
    return createEmptyManagement();
  }
}

export function upsertRecruitmentMeta(
  notes: string,
  management: RecruitmentManagement,
) {
  const visible = stripRecruitmentMeta(notes);
  const meta = `${META_START}${JSON.stringify(management)}${META_END}`;
  return [visible, meta].filter(Boolean).join("\n");
}

/** Whether an application is marked as starred (highlighted). */
export function isStarred(app: Application) {
  return (app.admin_notes || "").includes(STARRED_TAG);
}

/** Whether the contact phone is registered on Zalo (encoded in admin_notes). */
export function hasZalo(app: Application) {
  return /zalo/i.test(app.admin_notes || "");
}

/**
 * Add or remove the [STARRED] tag from an admin_notes string, preserving
 * the rest of the note. Single source of truth for star persistence.
 */
export function toggleStarredNotes(notes: string, on: boolean) {
  const management = getRecruitmentMeta(notes);
  const shouldKeepMeta = hasMeta(notes);
  const stripped = stripRecruitmentMeta(notes).replace(STARRED_TAG, "").trim();
  const visible = on ? `${STARRED_TAG} ${stripped}`.trim() : stripped;
  return shouldKeepMeta ? upsertRecruitmentMeta(visible, management) : visible;
}

/** Strip the [STARRED] tag for display in a notes textarea. */
export function stripStarredTag(notes: string) {
  return stripRecruitmentMeta(notes).replace(STARRED_TAG, "").trim();
}

/** Two-letter initials from a full name. */
export function getInitials(name: string) {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  return (parts.length ? parts.slice(-2) : ["?"])
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

/** Resolve the primary team grouping for an application from its positions. */
export function getPrimaryTeam(app: Application) {
  const positions = app.career_journey || [];
  return (
    Object.entries(TEAM_POSITIONS).find(([, teamPositions]) =>
      positions.some((pos) => teamPositions.includes(pos)),
    )?.[0] || "all"
  );
}

/** Format a timestamp into separate date + time strings (vi-VN). */
export function formatSubmittedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return { date: "---", time: "" };
  }
  return {
    date: date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
    time: date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

/** Relative day label (Hôm nay / Hôm qua / N ngày trước). */
export function daysAgo(dateStr: string) {
  const d = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (Number.isNaN(d)) return "---";
  if (d <= 0) return "Hôm nay";
  if (d === 1) return "Hôm qua";
  return `${d} ngày trước`;
}

/** Format a date as dd/mm/yyyy. */
export function formatDate(dateStr: string) {
  if (!dateStr) return "---";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
}
