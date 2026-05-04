/* ─────────────────────────────────────────────
   Application types, constants & helpers
   ───────────────────────────────────────────── */

export interface Application {
  id: string;
  email: string;
  career_journey: string[];
  interest_reason: string[];
  why_apply: string;
  experience: string;
  skills: string;
  goal: string;
  work_preference: Record<string, string[]>;
  note: string;
  strengths: string;
  weaknesses: string;
  expectation: string;
  problem_solving: string[];
  feedback_response: string[];
  full_name: string;
  dob: string;
  phone: string;
  school: string;
  enrollment: string;
  graduation: string;
  cv: string;
  status: ApplicationStatus;
  admin_notes: string;
  created_at: string;
  updated_at: string;
}

export type ApplicationStatus =
  | "new"
  | "reviewing"
  | "interviewed"
  | "accepted"
  | "rejected";

export const STATUS_OPTIONS: {
  value: ApplicationStatus;
  label: string;
  color: string;
  bg: string;
}[] = [
  { value: "new", label: "Mới", color: "#3b82f6", bg: "#eff6ff" },
  { value: "reviewing", label: "Đã xem", color: "#f59e0b", bg: "#fffbeb" },
  {
    value: "interviewed",
    label: "Đã phỏng vấn",
    color: "#8b5cf6",
    bg: "#f5f3ff",
  },
  { value: "accepted", label: "Đã nhận", color: "#22c55e", bg: "#f0fdf4" },
  { value: "rejected", label: "Từ chối", color: "#ef4444", bg: "#fef2f2" },
];

export const TEAM_LABELS: Record<string, string> = {
  Infrastructure: "Infrastructure",
  "Dev/DevOps": "Dev/DevOps",
  AI: "AI",
  Marketing: "Marketing",
  Sales: "Sales",
};

export function getStatusInfo(status: ApplicationStatus) {
  return STATUS_OPTIONS.find((s) => s.value === status) ?? STATUS_OPTIONS[0];
}

/** Validate email format */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Validate Vietnamese phone */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-().]/g, "");
  return /^(0|\+84)\d{9,10}$/.test(cleaned);
}

/** Validate URL (only http/https allowed) */
export function isValidUrl(url: string): boolean {
  if (!url) return true; // optional
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}
