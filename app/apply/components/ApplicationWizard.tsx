"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { isValidEmail, isValidPhone, isValidUrl } from "@/lib/application";
import Mascot from "@/app/components/MascotGuide";
import type { MascotState } from "@/app/components/Mascot";
import { motion } from "framer-motion";
import {
  BrainCircuit,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  CloudCog,
  CodeXml,
  DatabaseZap,
  FileSearch,
  GitBranch,
  Handshake,
  Headphones,
  HeartHandshake,
  Layers,
  Megaphone,
  MessagesSquare,
  Microscope,
  Network,
  PanelTop,
  ServerCog,
  ShieldCheck,
  TrendingUp,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ─── Guide config: key → pose + message ─── */
type GuideKey =
  | "default"
  | "email"
  | "positions"
  | "interests"
  | "why"
  | "experience"
  | "skills"
  | "goals"
  | "availability"
  | "note"
  | "strengths"
  | "weaknesses"
  | "expectation"
  | "problem_solving"
  | "feedback_response"
  | "full_name"
  | "contact"
  | "telegram"
  | "dob"
  | "school"
  | "enrollment"
  | "graduation"
  | "cv"
  | "linkedin"
  | "review"
  | "error";

interface GuideCfg {
  pose: MascotState;
  msg: string;
}

const GUIDE: Record<GuideKey, GuideCfg> = {
  default: {
    pose: "greeting",
    msg: "Mình sẽ đi cùng bạn từng phần, cứ làm từng mục thôi nhé.",
  },
  email: {
    pose: "focused",
    msg: "Dùng email bạn kiểm tra thường xuyên để team liên hệ cho chắc nhé.",
  },
  positions: {
    pose: "presenting",
    msg: "Chọn lĩnh vực bạn hứng thú trước, rồi chọn team phù hợp bên dưới.",
  },
  interests: {
    pose: "presenting",
    msg: "Chọn vài lý do khiến bạn hào hứng với kỳ thực tập này nhé.",
  },
  why: {
    pose: "thinking",
    msg: "Viết ngắn vì sao bạn hợp vị trí này, 2-3 ý là đẹp.",
  },
  experience: {
    pose: "thinking",
    msg: "Kể dự án, CLB, part-time hoặc việc gần với vị trí bạn chọn.",
  },
  skills: {
    pose: "focused",
    msg: "Liệt kê tool, nền tảng hoặc kỹ năng bạn tự tin dùng được.",
  },
  goals: {
    pose: "thinking",
    msg: "Chia sẻ bạn muốn học hoặc đạt gì sau kỳ thực tập này.",
  },
  availability: {
    pose: "presenting",
    msg: "Tick lịch và hình thức làm việc phù hợp nhất với bạn nhé.",
  },
  note: {
    pose: "listening",
    msg: "Có điều gì muốn team biết thêm thì nhắn ở đây, cứ tự nhiên.",
  },
  strengths: {
    pose: "thinking",
    msg: "Ghi vài điểm mạnh giúp bạn làm tốt vai trò này nhé.",
  },
  weaknesses: {
    pose: "thinking",
    msg: "Chọn điểm bạn muốn cải thiện, nói thật một chút là tốt nhất.",
  },
  expectation: {
    pose: "thinking",
    msg: "Trong 3 tháng đầu, bạn mong được học hoặc trải nghiệm gì?",
  },
  problem_solving: {
    pose: "presenting",
    msg: "Khi gặp việc mới, chọn cách bạn thường bắt đầu xử lý nhé.",
  },
  feedback_response: {
    pose: "presenting",
    msg: "Khi được góp ý, bạn thường phản hồi và chỉnh sửa thế nào?",
  },
  full_name: {
    pose: "greeting",
    msg: "Cho mình biết họ tên để mình xưng hô tự nhiên hơn nhé.",
  },
  contact: {
    pose: "contact",
    msg: "Thêm SĐT bạn hay dùng để team liên hệ nhanh khi cần.",
  },
  telegram: {
    pose: "contact",
    msg: "Nếu bạn dùng Telegram, nhập username bắt đầu bằng @ để team nhắn đúng người nhé.",
  },
  dob: {
    pose: "focused",
    msg: "Thêm ngày sinh để hồ sơ của bạn đủ thông tin nhé.",
  },
  school: {
    pose: "focused",
    msg: "Ghi theo mẫu: Tên trường (Mã trường) – Ngành. VD: Đại học Bách Khoa (QSB) – Ngành An toàn thông tin",
  },
  enrollment: {
    pose: "focused",
    msg: "Thêm ngày/tháng/năm nhập học để team hiểu giai đoạn học của bạn.",
  },
  graduation: {
    pose: "focused",
    msg: "Thêm ngày/tháng/năm ra trường dự kiến để team sắp xếp kỳ thực tập.",
  },
  cv: {
    pose: "contact",
    msg: "Upload file CV để team có thể xem hồ sơ của bạn nhé.",
  },
  linkedin: {
    pose: "contact",
    msg: "Nếu có LinkedIn, dán link profile để team xem thêm bối cảnh của bạn.",
  },
  review: {
    pose: "celebrate",
    msg: "Kiểm tra lại một lượt, nếu ổn thì gửi hồ sơ nhé.",
  },
  error: {
    pose: "warning",
    msg: "Mình đánh dấu vài mục còn thiếu, mình làm từng phần nhé.",
  },
};

const STEP_DEFAULT_KEY: Record<number, GuideKey> = {
  0: "positions",
  1: "interests",
  2: "strengths",
  3: "contact",
  4: "review",
};

interface GuideDot {
  key: GuideKey;
  label: string;
  y: number;
}

type MascotCue = "category" | "teamFocus" | "complete" | null;

const GUIDE_LABELS: Partial<Record<GuideKey, string>> = {
  full_name: "Tên",
  email: "Email",
  positions: "Hướng",
  interests: "Hứng thú",
  why: "Lý do",
  experience: "Kinh nghiệm",
  skills: "Kỹ năng",
  goals: "Mục tiêu",
  availability: "Lịch",
  note: "Ghi chú",
  strengths: "Mạnh",
  weaknesses: "Cải thiện",
  expectation: "Kỳ vọng",
  problem_solving: "Xử lý",
  feedback_response: "Feedback",
  contact: "Liên hệ",
  telegram: "Telegram",
  dob: "Ngày sinh",
  school: "Trường",
  enrollment: "Nhập học",
  graduation: "Ra trường",
  cv: "CV",
  linkedin: "LinkedIn",
  review: "Review",
};

const ERROR_GUIDE_KEY: Record<string, GuideKey> = {
  career_journey: "positions",
  interest_reason: "interests",
  interest_other: "interests",
  why_apply: "why",
  work_preference: "availability",
  goal: "goals",
  phone: "contact",
  telegram_username: "telegram",
  linkedin: "linkedin",
};

function isSameGuideDots(a: GuideDot[], b: GuideDot[]) {
  return (
    a.length === b.length &&
    a.every(
      (dot, index) =>
        dot.key === b[index].key &&
        dot.label === b[index].label &&
        Math.abs(dot.y - b[index].y) < 0.5,
    )
  );
}

function toGuideKey(key: string): GuideKey {
  return ERROR_GUIDE_KEY[key] ?? (key as GuideKey);
}

function isTextEntryTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    Boolean(target.closest("input, textarea, select, [contenteditable='true']"))
  );
}

/* ─────────────── types ─────────────── */
interface FormData {
  email: string;
  career_journey: string[];
  interest_reason: string[];
  interest_other: string;
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
  is_zalo_phone: boolean;
  has_telegram: boolean;
  telegram_username: string;
  school: string;
  enrollment: string;
  graduation: string;
  cv: string;
  linkedin: string;
}

const EMPTY: FormData = {
  email: "",
  career_journey: [],
  interest_reason: [],
  interest_other: "",
  why_apply: "",
  experience: "",
  skills: "",
  goal: "",
  work_preference: {},
  note: "",
  strengths: "",
  weaknesses: "",
  expectation: "",
  problem_solving: [],
  feedback_response: [],
  full_name: "",
  dob: "",
  phone: "",
  is_zalo_phone: false,
  has_telegram: false,
  telegram_username: "",
  school: "",
  enrollment: "",
  graduation: "",
  cv: "",
  linkedin: "",
};

const STORAGE_KEY = "markee_application_draft";

type CareerOption = {
  label: string;
  sub: string;
  team: string;
  color: string;
  abbr: string;
  icon: LucideIcon;
};

type CareerCategory = {
  label: string;
  desc: string;
  color: string;
  abbr: string;
  icon: LucideIcon;
};

type PublicRecruitmentPosition = {
  label: string;
  team: string;
  is_active?: boolean;
};

const CAREER_OPTIONS: CareerOption[] = [
  {
    label: "Network Team",
    sub: "Thiết lập mạng, xử lý kết nối và hỗ trợ hệ thống vận hành ổn định.",
    team: "Infrastructure",
    color: "#3b82f6",
    abbr: "NET",
    icon: Network,
  },
  {
    label: "System Team",
    sub: "Quản trị server, tài khoản, máy ảo và các nền tảng nội bộ.",
    team: "Infrastructure",
    color: "#3b82f6",
    abbr: "SYS",
    icon: ServerCog,
  },
  {
    label: "Security Team",
    sub: "Theo dõi cảnh báo, đọc log và học cách bảo vệ hệ thống thực tế.",
    team: "Infrastructure",
    color: "#3b82f6",
    abbr: "SEC",
    icon: ShieldCheck,
  },
  {
    label: "Hội nghị & Tổng đài",
    sub: "Hỗ trợ họp trực tuyến, tổng đài và trải nghiệm liên lạc cho đội ngũ.",
    team: "Infrastructure",
    color: "#3b82f6",
    abbr: "COM",
    icon: Headphones,
  },
  {
    label: "Cloud & Datacenter",
    sub: "Làm quen cloud, datacenter và cách hạ tầng chạy sau sản phẩm.",
    team: "Infrastructure",
    color: "#3b82f6",
    abbr: "CLD",
    icon: CloudCog,
  },
  {
    label: "BA",
    sub: "Tìm hiểu nhu cầu, viết yêu cầu và nối giữa team business với kỹ thuật.",
    team: "Dev/DevOps",
    color: "#8b5cf6",
    abbr: "BA",
    icon: FileSearch,
  },
  {
    label: "Backend Developer",
    sub: "Xây API, xử lý dữ liệu và học cách sản phẩm chạy phía server.",
    team: "Dev/DevOps",
    color: "#8b5cf6",
    abbr: "BE",
    icon: DatabaseZap,
  },
  {
    label: "Frontend Developer",
    sub: "Biến giao diện thành trải nghiệm web mượt, rõ và dễ dùng.",
    team: "Dev/DevOps",
    color: "#8b5cf6",
    abbr: "FE",
    icon: PanelTop,
  },
  {
    label: "Full-stack Developer",
    sub: "Thử sức từ giao diện đến API để hiểu trọn luồng sản phẩm.",
    team: "Dev/DevOps",
    color: "#8b5cf6",
    abbr: "FS",
    icon: Layers,
  },
  {
    label: "DevOps / Platform",
    sub: "Học cách deploy, tự động hóa và giữ môi trường phát triển ổn định.",
    team: "Dev/DevOps",
    color: "#8b5cf6",
    abbr: "OPS",
    icon: GitBranch,
  },
  {
    label: "AI / ML Engineer",
    sub: "Thử nghiệm mô hình, dữ liệu và cách đưa AI vào bài toán thật.",
    team: "AI",
    color: "#ef4444",
    abbr: "ML",
    icon: BrainCircuit,
  },
  {
    label: "Data Analyst / Engineer",
    sub: "Làm sạch dữ liệu, phân tích insight và hỗ trợ quyết định bằng số liệu.",
    team: "AI",
    color: "#ef4444",
    abbr: "DA",
    icon: ChartNoAxesCombined,
  },
  {
    label: "AI Product / Research",
    sub: "Khám phá use case, research và biến ý tưởng AI thành tính năng.",
    team: "AI",
    color: "#ef4444",
    abbr: "RES",
    icon: Microscope,
  },
  {
    label: "Content & Social",
    sub: "Viết nội dung, lên ý tưởng social và kể câu chuyện thương hiệu.",
    team: "Marketing",
    color: "#f59e0b",
    abbr: "CNT",
    icon: MessagesSquare,
  },
  {
    label: "Performance & Acquisition",
    sub: "Chạy thử chiến dịch, đọc chỉ số và tối ưu cách thu hút người dùng.",
    team: "Marketing",
    color: "#f59e0b",
    abbr: "PRF",
    icon: TrendingUp,
  },
  {
    label: "Marketing Ops",
    sub: "Sắp xếp dữ liệu, automation và quy trình để marketing chạy gọn hơn.",
    team: "Marketing",
    color: "#f59e0b",
    abbr: "MKT",
    icon: Workflow,
  },
  {
    label: "B2B Sales",
    sub: "Làm việc với doanh nghiệp, tư vấn giải pháp và phát triển khách hàng mới.",
    team: "Sales",
    color: "#10b981",
    abbr: "B2B",
    icon: BriefcaseBusiness,
  },
  {
    label: "Business Development",
    sub: "Tìm cơ hội hợp tác, mở thị trường và xây quan hệ đối tác.",
    team: "Sales",
    color: "#10b981",
    abbr: "BD",
    icon: Handshake,
  },
  {
    label: "Customer Success",
    sub: "Đồng hành với khách hàng, hỗ trợ onboarding và giữ trải nghiệm tốt.",
    team: "Sales",
    color: "#10b981",
    abbr: "CS",
    icon: HeartHandshake,
  },
];

const CAREER_CATEGORIES: CareerCategory[] = [
  {
    label: "Marketing",
    desc: "Content, performance, social và marketing operations.",
    color: "#f59e0b",
    abbr: "MKT",
    icon: Megaphone,
  },
  {
    label: "Dev/DevOps",
    desc: "Product, frontend, backend, platform và vận hành kỹ thuật.",
    color: "#8b5cf6",
    abbr: "DEV",
    icon: CodeXml,
  },
  {
    label: "AI",
    desc: "Machine learning, data, research và sản phẩm AI.",
    color: "#ef4444",
    abbr: "AI",
    icon: BrainCircuit,
  },
  {
    label: "Infrastructure",
    desc: "Network, system, cloud, security và datacenter operations.",
    color: "#3b82f6",
    abbr: "INF",
    icon: ServerCog,
  },
  {
    label: "Sales",
    desc: "B2B sales, partnership và customer success.",
    color: "#10b981",
    abbr: "SLS",
    icon: Handshake,
  },
];

function getCareerTeam(label: string) {
  return CAREER_OPTIONS.find((opt) => opt.label === label)?.team;
}

function getSelectedCareerTeams(labels: string[]) {
  return Array.from(
    new Set(labels.map(getCareerTeam).filter((team): team is string => !!team)),
  );
}

const INTEREST_OPTIONS = [
  "Học hỏi & phát triển kỹ năng",
  "Có mentor hướng dẫn",
  "Được làm việc thực chiến",
  "Cơ hội thành nhân sự chính thức",
  "Môi trường chuyên nghiệp",
  "Thu nhập phù hợp",
  "Khác",
];
const OTHER_INTEREST_OPTION = "Khác";

const WORK_ROWS = ["Hybrid", "Part-time", "Full-time", "Onsite"];
const WORK_COLS = ["Hồ Chí Minh", "Đà Nẵng", "Online"];

const WORK_ROW_COPY: Record<string, string> = {
  Hybrid: "Kết hợp online và lên văn phòng khi cần.",
  "Part-time": "Phù hợp khi bạn còn lịch học trong tuần.",
  "Full-time": "Có thể dành phần lớn thời gian cho kỳ thực tập.",
  Onsite: "Ưu tiên làm trực tiếp cùng team tại văn phòng.",
};

const WORK_COL_COPY: Record<string, string> = {
  "Hồ Chí Minh": "Làm cùng team tại HCM.",
  "Đà Nẵng": "Làm cùng team tại Đà Nẵng.",
  Online: "Có thể phối hợp từ xa.",
};

const PROBLEM_OPTIONS = [
  "Tự tìm hiểu trước rồi mới hỏi",
  "Hỏi sớm để tránh làm sai",
  "Thử làm trước rồi xin feedback",
  "Chờ rõ hơn rồi mới làm",
  "Tuỳ tình huống",
];

const FEEDBACK_OPTIONS = [
  "Tiếp thu nhanh và sửa",
  "Cần giải thích rõ mới tiếp thu",
  "Lúc đầu áp lực nhưng vẫn sửa",
  "Dễ mất tự tin",
  "Tuỳ người góp ý",
];

const STEPS = [
  { label: "Hướng thực tập", desc: "Career" },
  { label: "Năng lực", desc: "Skills" },
  { label: "Tư duy", desc: "Mindset" },
  { label: "Hồ sơ", desc: "Profile" },
  { label: "Xác nhận", desc: "Review" },
];

const LAST_STEP = STEPS.length - 1;

/* ─────────────── validation ─────────────── */
type StepErrors = Record<string, string>;

function hasText(value: string) {
  return value.trim().length > 0;
}

function isFullDateValue(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function toDateInputValue(value: string) {
  return isFullDateValue(value) ? value : "";
}

function textGuide(
  value: string,
  empty: GuideCfg,
  doneMsg: string,
  donePose: MascotState = "encourage",
): GuideCfg {
  if (!hasText(value)) return empty;
  return { pose: donePose, msg: doneMsg };
}

function isValidTelegramUsername(value: string) {
  return /^@[A-Za-z0-9_]{5,32}$/.test(value.trim());
}

function isValidSchoolMajorFormat(value: string) {
  return /^[^()\n]{3,}\s*\([A-Za-z0-9._-]{2,20}\)\s*[-–—]\s*[^()\n]{2,}$/.test(
    value.trim(),
  );
}

function hasOtherInterest(form: FormData) {
  return form.interest_reason.includes(OTHER_INTEREST_OPTION);
}

function hasInterestReasonReady(form: FormData) {
  return (
    form.interest_reason.length > 0 &&
    (!hasOtherInterest(form) || form.interest_other.trim().length > 0)
  );
}

function getDisplayInterestReasons(form: FormData) {
  return form.interest_reason.map((item) => {
    if (item === OTHER_INTEREST_OPTION && form.interest_other.trim()) {
      return `${OTHER_INTEREST_OPTION}: ${form.interest_other.trim()}`;
    }
    return item;
  });
}

function hasWorkPreference(form: FormData) {
  return Object.values(form.work_preference).some((v) => v.length > 0);
}

function getWorkPreferenceSelection(workPreference: Record<string, string[]>) {
  for (const [mode, locations] of Object.entries(workPreference)) {
    const location = locations[0];
    if (location) return { mode, location };
  }
  return null;
}

function validateIntro(form: FormData): StepErrors {
  const e: StepErrors = {};
  if (!form.full_name.trim()) e.full_name = "Bạn chưa thêm họ tên";
  if (!form.email.trim()) e.email = "Bạn chưa thêm email liên hệ";
  else if (!isValidEmail(form.email.trim()))
    e.email = "Email chưa đúng định dạng";
  if (!form.phone.trim()) e.phone = "Bạn chưa thêm SĐT/Zalo";
  else if (!isValidPhone(form.phone.trim()))
    e.phone = "SĐT/Zalo chưa đúng định dạng";
  return e;
}

function validateStep(step: number, form: FormData): StepErrors {
  const e: StepErrors = {};
  if (step === 0) {
    if (!form.career_journey.length)
      e.career_journey = "Chọn ít nhất 1 team bạn muốn thử sức";
    else if (getSelectedCareerTeams(form.career_journey).length !== 1)
      e.career_journey = "Mỗi hồ sơ chỉ giữ team trong 1 lĩnh vực";
  } else if (step === 1) {
    if (!form.interest_reason.length)
      e.interest_reason = "Chọn vài điều khiến bạn hứng thú nhé";
    if (hasOtherInterest(form) && !form.interest_other.trim())
      e.interest_other = "Bạn chọn Khác rồi, nhập thêm lý do cụ thể nhé";
    if (Object.keys(e).length) return e;

    if (!form.why_apply.trim()) e.why_apply = "Bạn chưa viết lý do ứng tuyển";
    if (Object.keys(e).length) return e;

    if (!form.experience.trim())
      e.experience = "Bạn chưa chia sẻ trải nghiệm liên quan";
    if (Object.keys(e).length) return e;

    if (!form.skills.trim()) e.skills = "Bạn chưa thêm kỹ năng hoặc công cụ";
    if (!form.goal.trim()) e.goal = "Bạn chưa chia sẻ mục tiêu thực tập";
    if (Object.keys(e).length) return e;

    if (!hasWorkPreference(form))
      e.work_preference = "Chọn 1 hình thức và 1 địa điểm phù hợp nhất";
    if (Object.keys(e).length) return e;

    if (!form.note.trim()) e.note = "Bạn chưa nhắn thêm cho team";
  } else if (step === 2) {
    if (!form.strengths.trim()) e.strengths = "Bạn chưa chia sẻ điểm mạnh";
    if (!form.weaknesses.trim())
      e.weaknesses = "Bạn chưa chia sẻ điểm muốn cải thiện";
    if (Object.keys(e).length) return e;

    if (!form.expectation.trim())
      e.expectation = "Bạn chưa chia sẻ mong muốn 3 tháng đầu";
    if (Object.keys(e).length) return e;

    if (!form.problem_solving.length)
      e.problem_solving = "Chọn cách gần với bạn nhất";
    if (!form.feedback_response.length)
      e.feedback_response = "Chọn phản ứng gần với bạn nhất";
  } else if (step === 3) {
    if (form.has_telegram && !form.telegram_username.trim())
      e.telegram_username = "Bạn chưa thêm username Telegram";
    else if (
      form.has_telegram &&
      !isValidTelegramUsername(form.telegram_username)
    )
      e.telegram_username = "Telegram username cần có dạng @username";

    if (!isFullDateValue(form.dob)) e.dob = "Bạn chưa thêm ngày sinh";
    if (!form.school.trim()) e.school = "Bạn chưa thêm trường/ngành";
    else if (!isValidSchoolMajorFormat(form.school))
      e.school = "Nhập đúng mẫu: Tên trường (Mã trường) - Ngành";

    if (!isFullDateValue(form.enrollment))
      e.enrollment = "Bạn chưa thêm ngày nhập học";
    if (!isFullDateValue(form.graduation))
      e.graduation = "Bạn chưa thêm ngày ra trường dự kiến";

    if (!form.cv.trim()) e.cv = "Bạn chưa chọn file CV";
    else if (form.cv !== "pending" && !isValidUrl(form.cv.trim()))
      e.cv = "File CV chưa upload thành công";
    if (form.linkedin.trim() && !isValidUrl(form.linkedin.trim()))
      e.linkedin = "Link LinkedIn chưa đúng định dạng";
  }
  return e;
}

function getCandidateName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return parts.length ? parts[parts.length - 1] : "";
}

function getFirstErrorGuide(
  errors: StepErrors,
  form: FormData,
): GuideCfg | null {
  const first = Object.keys(errors)[0];
  if (!first) return null;
  const name = getCandidateName(form.full_name);
  const hey = name ? `${name}, ` : "";

  const guide: Record<string, GuideCfg> = {
    full_name: {
      pose: "greeting",
      msg: "Mình cần tên để xưng hô với bạn tự nhiên hơn nhé.",
    },
    email: {
      pose: "focused",
      msg: form.email.trim()
        ? `${hey}email có vẻ chưa đúng định dạng, kiểm tra lại giúp mình nhé.`
        : `${hey}thêm email bạn hay dùng để team liên hệ nhé.`,
    },
    phone: {
      pose: "contact",
      msg: form.phone.trim()
        ? `${hey}SĐT đang chưa hợp lệ, bạn kiểm tra lại số giúp mình nhé.`
        : `${hey}thêm SĐT để team có thể liên hệ nhanh khi cần.`,
    },
    telegram_username: {
      pose: "contact",
      msg: form.telegram_username.trim()
        ? `${hey}Telegram nên có dạng @username để team nhắn đúng người nhé.`
        : `${hey}bạn tick có Telegram rồi, nhập thêm username bắt đầu bằng @ nhé.`,
    },
    school: {
      pose: "focused",
      msg: form.school.trim()
        ? `${hey}nhập đúng mẫu Tên trường (Mã trường) - Ngành nhé. Ví dụ: Đại học Bách Khoa (QSB) - An toàn thông tin.`
        : `${hey}thêm tên trường, mã trường và chuyên ngành để hồ sơ rõ hơn nhé.`,
    },
    career_journey: {
      pose: "presenting",
      msg: `${hey}chọn 1 category và ít nhất 1 hướng bên trong category đó nhé.`,
    },
    interest_reason: {
      pose: "presenting",
      msg: `${hey}chọn ít nhất 1 lý do bạn hứng thú với kỳ thực tập này nhé.`,
    },
    interest_other: {
      pose: "thinking",
      msg: `${hey}bạn chọn Khác rồi, nhập thêm lý do cụ thể để team hiểu hơn nhé.`,
    },
    why_apply: {
      pose: "thinking",
      msg: `${hey}viết ngắn vì sao bạn muốn vị trí này, nhập bao nhiêu cũng được.`,
    },
    experience: {
      pose: "thinking",
      msg: form.experience.trim()
        ? `${hey}thêm vai trò, việc bạn làm hoặc kết quả để phần kinh nghiệm rõ hơn nhé.`
        : `${hey}kể một vài dự án, CLB hoặc việc bạn từng làm liên quan nhé.`,
    },
    skills: {
      pose: "focused",
      msg: form.skills.trim()
        ? `${hey}thêm vài tool, kỹ năng hoặc mức độ tự tin để team dễ đánh giá hơn nhé.`
        : `${hey}liệt kê tool, kỹ năng hoặc nền tảng bạn đã dùng nhé.`,
    },
    goal: {
      pose: "thinking",
      msg: `${hey}chia sẻ mục tiêu bạn muốn đạt sau kỳ thực tập này nhé.`,
    },
    work_preference: {
      pose: "presenting",
      msg: `${hey}chọn đúng 1 hình thức và 1 địa điểm phù hợp nhất với bạn nhé.`,
    },
    note: {
      pose: "listening",
      msg: `${hey}nhắn team thêm một câu để hồ sơ có màu riêng hơn nhé.`,
    },
    strengths: {
      pose: "thinking",
      msg: form.strengths.trim()
        ? `${hey}thêm một ví dụ nhỏ để điểm mạnh của bạn đáng tin hơn nhé.`
        : `${hey}chia sẻ vài điểm mạnh giúp bạn làm tốt vai trò này nhé.`,
    },
    weaknesses: {
      pose: "thinking",
      msg: form.weaknesses.trim()
        ? `${hey}thêm cách bạn đang cải thiện điểm này để câu trả lời tròn hơn nhé.`
        : `${hey}thêm một điểm bạn muốn cải thiện, nói thật là điểm cộng đó.`,
    },
    expectation: {
      pose: "thinking",
      msg: `${hey}nói ngắn bạn mong học được gì trong 3 tháng đầu nhé.`,
    },
    problem_solving: {
      pose: "presenting",
      msg: `${hey}chọn cách bạn thường xử lý khi gặp việc chưa biết làm nhé.`,
    },
    feedback_response: {
      pose: "presenting",
      msg: `${hey}chọn cách bạn thường phản hồi khi được góp ý nhé.`,
    },
    dob: {
      pose: "focused",
      msg: `${hey}thêm ngày sinh để hồ sơ cá nhân đầy đủ hơn nhé.`,
    },
    enrollment: {
      pose: "focused",
      msg: `${hey}thêm đủ ngày/tháng/năm nhập học để team hiểu lộ trình học của bạn.`,
    },
    graduation: {
      pose: "focused",
      msg: `${hey}thêm đủ ngày/tháng/năm ra trường dự kiến để team sắp xếp kỳ thực tập.`,
    },
    cv: {
      pose: "contact",
      msg: form.cv.trim()
        ? `${hey}file CV chưa upload thành công, thử chọn lại file giúp mình nhé.`
        : `${hey}upload file CV để team xem hồ sơ của bạn nhé.`,
    },
    linkedin: {
      pose: "contact",
      msg: `${hey}link LinkedIn cần bắt đầu bằng http hoặc https nhé.`,
    },
  };

  return {
    pose: guide[first]?.pose ?? "warning",
    msg:
      guide[first]?.msg ??
      `${hey}mình đánh dấu vài mục còn thiếu, mình làm từng phần nhé.`,
  };
}

function getSmartGuide(
  key: GuideKey,
  step: number,
  form: FormData,
  errors: StepErrors,
): GuideCfg {
  const name = getCandidateName(form.full_name);
  const hey = name ? `${name}, ` : "";
  const errorGuide = getFirstErrorGuide(errors, form);
  if (errorGuide) return errorGuide;
  if (step === LAST_STEP) {
    return {
      pose: "celebrate",
      msg: name
        ? `${name}, kiểm tra lại thông tin rồi gửi hồ sơ nhé.`
        : GUIDE.review.msg,
    };
  }

  const selectedCount = form.career_journey.length;
  const hasDirection =
    selectedCount > 0 &&
    hasInterestReasonReady(form) &&
    hasText(form.why_apply);
  const hasCapability =
    hasInterestReasonReady(form) &&
    hasText(form.why_apply) &&
    hasText(form.experience) &&
    hasText(form.skills) &&
    hasText(form.goal) &&
    hasWorkPreference(form) &&
    hasText(form.note);
  const hasReflection = hasText(form.strengths) && hasText(form.weaknesses);
  const hasBehavior =
    form.problem_solving.length > 0 && form.feedback_response.length > 0;
  const hasProfile =
    (!form.has_telegram || isValidTelegramUsername(form.telegram_username)) &&
    isFullDateValue(form.dob) &&
    isValidSchoolMajorFormat(form.school) &&
    isFullDateValue(form.enrollment) &&
    isFullDateValue(form.graduation) &&
    Boolean(form.cv.trim()) &&
    (!form.linkedin.trim() || isValidUrl(form.linkedin.trim()));

  if (key === "default") {
    if (step === 0) {
      if (hasDirection)
        return {
          pose: "encourage",
          msg: `${hey}hướng ứng tuyển rõ rồi. Tiếp theo mình hỏi kinh nghiệm và kỹ năng nhé.`,
        };
      return {
        pose: "presenting",
        msg: `${hey}chọn lĩnh vực bạn hứng thú trước, team phù hợp sẽ hiện bên dưới.`,
      };
    }
    if (step === 1) {
      if (hasCapability)
        return {
          pose: "encourage",
          msg: `${hey}phần năng lực ổn rồi. Tiếp theo mình hỏi tư duy làm việc nhé.`,
        };
      return {
        pose: "thinking",
        msg: `${hey}mình cần động lực, vài dự án, kỹ năng và lịch làm việc để hiểu bạn hơn.`,
      };
    }
    if (step === 2) {
      if (hasReflection && hasBehavior && hasText(form.expectation))
        return {
          pose: "encourage",
          msg: `${hey}tư duy làm việc rõ rồi. Tiếp theo là thông tin hồ sơ cá nhân.`,
        };
      return {
        pose: "thinking",
        msg: `${hey}team muốn hiểu cách bạn nhìn nhận bản thân và nhận feedback.`,
      };
    }
    if (step === 3) {
      if (hasProfile)
        return {
          pose: "encourage",
          msg: `${hey}hồ sơ đủ rồi. Qua bước cuối mình sẽ giúp bạn kiểm tra lại.`,
        };
      return {
        pose: "contact",
        msg: `${hey}thêm thông tin học tập và CV để hồ sơ đầy đủ.`,
      };
    }
  }

  if (key === "full_name") {
    return name
      ? {
          pose: "greeting",
          msg: `Chào ${name}, mình sẽ dùng tên này để hướng dẫn tự nhiên hơn nhé.`,
        }
      : GUIDE.full_name;
  }

  if (key === "email") {
    return isValidEmail(form.email.trim())
      ? {
          pose: "encourage",
          msg: `${hey}email ổn rồi. Khi cần, team sẽ liên hệ qua địa chỉ này.`,
        }
      : GUIDE.email;
  }

  if (key === "contact") {
    if (form.has_telegram && !form.telegram_username.trim()) {
      return {
        pose: "contact",
        msg: `${hey}bạn tick có Telegram rồi, nhập thêm @username bên dưới nhé.`,
      };
    }
    return {
      pose: "encourage",
      msg: form.is_zalo_phone
        ? `${hey}SĐT/Zalo đã có từ đầu. Bạn có thể thêm Telegram nếu muốn.`
        : `${hey}nếu có Telegram, thêm username để team có thêm kênh dự phòng nhé.`,
    };
  }

  if (key === "telegram") {
    if (!form.has_telegram)
      return {
        pose: "contact",
        msg: `${hey}nếu bạn dùng Telegram, tick vào ô bên trên để thêm username nhé.`,
      };
    return isValidTelegramUsername(form.telegram_username)
      ? {
          pose: "encourage",
          msg: `${hey}Telegram đã rõ rồi. Team sẽ có thêm một kênh liên hệ dự phòng.`,
        }
      : GUIDE.telegram;
  }

  if (key === "dob") {
    return form.dob
      ? {
          pose: "encourage",
          msg: `${hey}ngày sinh đã có rồi. Mình tiếp tục phần trường học nhé.`,
        }
      : GUIDE.dob;
  }

  if (key === "school") {
    if (!form.school.trim()) return GUIDE.school;
    if (!isValidSchoolMajorFormat(form.school)) {
      return {
        pose: "focused",
        msg: `${hey}nhập trường theo mẫu Tên trường (Mã trường) - Ngành nhé. Ví dụ: Đại học Bách Khoa (QSB) - An toàn thông tin.`,
      };
    }
    return {
      pose: "encourage",
      msg: `${hey}thông tin trường đã có. Thêm ngày nhập học nữa nhé.`,
    };
  }

  if (key === "enrollment") {
    return isFullDateValue(form.enrollment)
      ? {
          pose: "encourage",
          msg: `${hey}ngày nhập học đã có rồi. Còn ngày ra trường dự kiến nữa thôi.`,
        }
      : GUIDE.enrollment;
  }

  if (key === "graduation") {
    return isFullDateValue(form.graduation)
      ? {
          pose: "encourage",
          msg: `${hey}ngày ra trường dự kiến đã có. Giờ upload file CV nhé.`,
        }
      : GUIDE.graduation;
  }

  if (key === "linkedin") {
    return form.linkedin.trim() && isValidUrl(form.linkedin.trim())
      ? {
          pose: "encourage",
          msg: `${hey}LinkedIn đã thêm rồi, đây là điểm cộng nếu profile có dự án hoặc kinh nghiệm.`,
        }
      : GUIDE.linkedin;
  }

  if (key === "positions") {
    if (selectedCount === 0)
      return {
        pose: "presenting",
        msg: `${hey}chọn lĩnh vực trước, rồi tick ít nhất 1 team bạn muốn thử sức nhé.`,
      };
    return {
      pose: "encourage",
      msg: `${hey}mình sẽ hỏi theo các hướng bạn đã chọn. Tiếp theo chọn lý do bạn hứng thú nhé.`,
    };
  }

  if (key === "interests") {
    if (hasOtherInterest(form) && !form.interest_other.trim()) {
      return {
        pose: "thinking",
        msg: `${hey}bạn chọn Khác rồi, nhập thêm lý do cụ thể ngay bên dưới nhé.`,
      };
    }
    return hasInterestReasonReady(form)
      ? {
          pose: "encourage",
          msg: `${hey}động lực rõ hơn rồi. Giờ viết ngắn vì sao bạn muốn ứng tuyển.`,
        }
      : GUIDE.interests;
  }

  if (key === "why") {
    return textGuide(
      form.why_apply,
      GUIDE.why,
      `${hey}lý do đã rõ rồi. Sang bước sau mình hỏi kinh nghiệm nhé.`,
    );
  }

  if (key === "experience") {
    return textGuide(
      form.experience,
      GUIDE.experience,
      `${hey}kinh nghiệm đã có. Giờ thêm kỹ năng hoặc công cụ bạn dùng nhé.`,
    );
  }

  if (key === "skills") {
    return textGuide(
      form.skills,
      GUIDE.skills,
      `${hey}kỹ năng rõ hơn rồi. Thêm mục tiêu thực tập để team hiểu hơn.`,
    );
  }

  if (key === "goals") {
    return textGuide(
      form.goal,
      GUIDE.goals,
      `${hey}mục tiêu ổn rồi. Giờ tick lịch và hình thức làm việc phù hợp.`,
    );
  }

  if (key === "availability") {
    return hasWorkPreference(form)
      ? {
          pose: "encourage",
          msg: `${hey}lịch làm việc đã lưu. Còn một lời nhắn ngắn cho team nữa thôi.`,
        }
      : GUIDE.availability;
  }

  if (key === "note") {
    return textGuide(
      form.note,
      GUIDE.note,
      `${hey}xong phần năng lực rồi. Tiếp theo mình hỏi về tư duy làm việc.`,
      "celebrate",
    );
  }

  if (key === "strengths") {
    return textGuide(
      form.strengths,
      GUIDE.strengths,
      `${hey}điểm mạnh ổn rồi. Giờ thêm điểm bạn muốn cải thiện nhé.`,
    );
  }

  if (key === "weaknesses") {
    return textGuide(
      form.weaknesses,
      GUIDE.weaknesses,
      `${hey}tự nhìn nhận ổn rồi. Tiếp theo là kỳ vọng 3 tháng đầu.`,
    );
  }

  if (key === "expectation") {
    return textGuide(
      form.expectation,
      GUIDE.expectation,
      `${hey}mong muốn 3 tháng đã rõ. Tiếp theo chọn cách bạn xử lý việc mới nhé.`,
    );
  }

  if (key === "problem_solving") {
    return form.problem_solving.length
      ? {
          pose: "encourage",
          msg: `${hey}cách xử lý đã rõ. Còn cách bạn nhận feedback nữa thôi.`,
        }
      : GUIDE.problem_solving;
  }

  if (key === "feedback_response") {
    return hasBehavior
      ? {
          pose: "celebrate",
          msg: `${hey}tư duy làm việc ổn rồi. Tiếp theo mình lấy thông tin hồ sơ.`,
        }
      : GUIDE.feedback_response;
  }

  if (key === "review") {
    return {
      pose: "celebrate",
      msg: name
        ? `${name}, kiểm tra lại từng nhóm. Ổn rồi thì gửi hồ sơ nhé.`
        : GUIDE.review.msg,
    };
  }

  return GUIDE[key];
}

/* ═══════════════════════════════════════════════ */
export default function ApplicationWizard({
  onClose,
  startAtSuccess = false,
}: {
  onClose: () => void;
  startAtSuccess?: boolean;
}) {
  const [showIntro, setShowIntro] = useState(!startAtSuccess);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(
    startAtSuccess
      ? {
          ...EMPTY,
          full_name: "Nguyễn Văn Test",
          email: "test@example.com",
          career_journey: ["Frontend Developer", "DevOps / Platform"],
        }
      : EMPTY,
  );
  const [submitted, setSubmitted] = useState(startAtSuccess);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [checking, setChecking] = useState(false);
  const [errors, setErrors] = useState<StepErrors>({});
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [mascotCue, setMascotCue] = useState<MascotCue>(null);
  const [activePositionLabels, setActivePositionLabels] = useState<Set<string>>(
    () => new Set(CAREER_OPTIONS.map((option) => option.label)),
  );
  const csrfTokenRef = useRef<string>("");
  const bodyRef = useRef<HTMLDivElement>(null);
  const guideRailRef = useRef<HTMLDivElement>(null);
  const guideScrollFrameRef = useRef<number | null>(null);
  const guideManualLockUntilRef = useRef(0);
  const pendingCvFileRef = useRef<File | null>(null);
  const guideActiveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  /* ── Mascot guide ── */
  const [activeSection, setActiveSection] = useState<GuideKey>(
    STEP_DEFAULT_KEY[0] ?? "default",
  );
  const [guideDots, setGuideDots] = useState<GuideDot[]>([]);
  const [guideY, setGuideY] = useState(48);
  const activeSectionRef = useRef<GuideKey>(STEP_DEFAULT_KEY[0] ?? "default");
  const guide = getSmartGuide(activeSection, step, form, errors);
  const hasGuideError = Object.keys(errors).length > 0;

  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  // Fetch CSRF token on mount
  useEffect(() => {
    fetch("/api/csrf-token")
      .then((r) => r.json())
      .then((d) => {
        csrfTokenRef.current = d.token;
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch("/api/recruitment/positions")
      .then((response) => {
        if (!response.ok) throw new Error("positions-unavailable");
        return response.json();
      })
      .then((data) => {
        const positions = Array.isArray(data.positions)
          ? (data.positions as PublicRecruitmentPosition[])
          : [];
        const activeLabels = new Set(
          positions
            .filter((position) => position.is_active !== false)
            .map((position) => position.label),
        );

        setActivePositionLabels(activeLabels);
      })
      .catch(() => {
        /* keep local defaults if the public config endpoint is unavailable */
      });
  }, []);

  const getVisibleGuideSections = useCallback(() => {
    const body = bodyRef.current;
    if (!body) return [];
    const seen = new Set<string>();
    return Array.from(
      body.querySelectorAll<HTMLElement>("[data-guide]"),
    ).filter((el, index) => {
      const reveal = el.closest(".wz-reveal");
      if (reveal && !reveal.classList.contains("show")) return false;
      const key = el.dataset.guide;
      if (!key || seen.has(key)) return false;
      seen.add(key);
      if (!el.id) el.id = `wz-section-${step}-${key}-${index}`;
      return true;
    });
  }, [step]);

  const calculateGuideY = useCallback((el: HTMLElement) => {
    const rail = guideRailRef.current;
    if (!rail) return 48;
    const railRect = rail.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const coachHeight = 156;
    const minY = 18;
    const maxY = Math.max(minY, railRect.height - coachHeight - 18);
    const fieldOffset = Math.min(
      Math.max(elRect.height * 0.32, 48),
      Math.max(48, elRect.height - 72),
    );
    const targetY = elRect.top + fieldOffset - railRect.top - coachHeight / 2;
    return Math.min(Math.max(targetY, minY), maxY);
  }, []);

  const syncGuideDots = useCallback(() => {
    const sections = getVisibleGuideSections();
    const dots = sections.map((el) => {
      const key = el.dataset.guide as GuideKey;
      return {
        key,
        label: GUIDE_LABELS[key] ?? key,
        y: calculateGuideY(el),
      };
    });

    setGuideDots((prev) => (isSameGuideDots(prev, dots) ? prev : dots));
  }, [calculateGuideY, getVisibleGuideSections]);

  const activateGuideElement = useCallback(
    (el: HTMLElement | null, shouldSyncDots = true, deferSection = false) => {
      if (!el) return;
      const key = el.dataset.guide as GuideKey | undefined;
      if (!key) return;
      if (deferSection) {
        if (activeSectionRef.current !== key) {
          if (guideActiveTimerRef.current) {
            clearTimeout(guideActiveTimerRef.current);
          }
          guideActiveTimerRef.current = setTimeout(() => {
            setActiveSection((prev) => (prev === key ? prev : key));
            guideActiveTimerRef.current = null;
          }, 130);
        }
      } else {
        if (guideActiveTimerRef.current) {
          clearTimeout(guideActiveTimerRef.current);
          guideActiveTimerRef.current = null;
        }
        setActiveSection((prev) => (prev === key ? prev : key));
      }
      const nextY = calculateGuideY(el);
      setGuideY((prev) => (Math.abs(prev - nextY) < 0.5 ? prev : nextY));
      if (shouldSyncDots) syncGuideDots();
    },
    [calculateGuideY, syncGuideDots],
  );

  const updateActiveSectionFromScroll = useCallback(() => {
    const body = bodyRef.current;
    if (!body) return;
    if (Date.now() < guideManualLockUntilRef.current) return;

    const sections = getVisibleGuideSections();
    if (!sections.length) return;

    const bodyRect = body.getBoundingClientRect();
    const viewportCenter = bodyRect.top + bodyRect.height * 0.45;
    let closest = sections[0];
    let minDistance = Infinity;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const visibleTop = Math.max(rect.top, bodyRect.top);
      const visibleBottom = Math.min(rect.bottom, bodyRect.bottom);
      if (visibleBottom <= bodyRect.top || visibleTop >= bodyRect.bottom) {
        return;
      }
      const sectionCenter = rect.top + rect.height / 2;
      const distance = Math.abs(sectionCenter - viewportCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closest = section;
      }
    });

    activateGuideElement(closest, true, true);
  }, [activateGuideElement, getVisibleGuideSections]);

  const scrollToGuideSection = useCallback(
    (key: GuideKey) => {
      const body = bodyRef.current;
      if (!body) return;
      const el = body.querySelector<HTMLElement>(`[data-guide="${key}"]`);
      if (!el) return;
      activateGuideElement(el);
      body.scrollTo({
        top: Math.max(0, el.offsetTop - 18),
        behavior: "smooth",
      });
    },
    [activateGuideElement],
  );

  const handleBodyScroll = useCallback(() => {
    if (guideScrollFrameRef.current !== null) return;
    guideScrollFrameRef.current = requestAnimationFrame(() => {
      updateActiveSectionFromScroll();
      guideScrollFrameRef.current = null;
    });
  }, [updateActiveSectionFromScroll]);

  useEffect(() => {
    return () => {
      if (guideScrollFrameRef.current !== null) {
        cancelAnimationFrame(guideScrollFrameRef.current);
      }
      if (guideActiveTimerRef.current) {
        clearTimeout(guideActiveTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (showIntro) return;
    const root = bodyRef.current;
    if (!root) return;

    const sections = getVisibleGuideSections();
    const fallbackKey =
      (sections[0]?.dataset.guide as GuideKey | undefined) ??
      STEP_DEFAULT_KEY[step] ??
      "default";

    if (!sections.length) {
      setGuideDots([]);
      setActiveSection(fallbackKey);
      return;
    }

    let frame = requestAnimationFrame(() => {
      syncGuideDots();
      const activeEl =
        sections.find((el) => el.dataset.guide === activeSectionRef.current) ??
        sections.find((el) => el.dataset.guide === fallbackKey) ??
        sections[0];
      activateGuideElement(activeEl, false);
    });

    const observer = new IntersectionObserver(
      () => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          syncGuideDots();
          updateActiveSectionFromScroll();
        });
      },
      {
        root,
        threshold: [0, 0.4, 0.6, 1],
      },
    );

    sections.forEach((el) => observer.observe(el));
    window.addEventListener("resize", syncGuideDots);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", syncGuideDots);
    };
  }, [
    showIntro,
    step,
    form.career_journey.length,
    form.interest_reason.length,
    form.interest_other,
    form.why_apply,
    form.experience,
    form.skills,
    form.goal,
    form.work_preference,
    form.note,
    form.strengths,
    form.weaknesses,
    form.expectation,
    form.problem_solving.length,
    form.feedback_response.length,
    form.phone,
    form.is_zalo_phone,
    form.has_telegram,
    form.telegram_username,
    form.dob,
    form.school,
    form.enrollment,
    form.graduation,
    form.cv,
    form.linkedin,
    activateGuideElement,
    getVisibleGuideSections,
    syncGuideDots,
    updateActiveSectionFromScroll,
  ]);

  useEffect(() => {
    setActiveSection(STEP_DEFAULT_KEY[step] ?? "default");
  }, [step]);

  useEffect(() => {
    const firstError = Object.keys(errors)[0];
    if (!firstError) return;
    const key = toGuideKey(firstError);
    const el = bodyRef.current?.querySelector<HTMLElement>(
      `[data-guide="${key}"]`,
    );
    if (el) activateGuideElement(el);
    else setActiveSection(key);
  }, [activateGuideElement, errors]);

  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    body.querySelectorAll<HTMLElement>("[data-guide]").forEach((el) => {
      el.classList.toggle(
        "wz-guide-active",
        el.dataset.guide === activeSection,
      );
    });
  }, [activeSection, step, guideDots]);

  const handleBodyFocus = useCallback(
    (e: React.FocusEvent) => {
      const isText = isTextEntryTarget(e.target);
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-guide]");
      guideManualLockUntilRef.current = Date.now() + 900;
      activateGuideElement(el, true, isText);
    },
    [activateGuideElement],
  );

  const handleBodyPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (isTextEntryTarget(e.target)) return;
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-guide]");
      guideManualLockUntilRef.current = Date.now() + 650;
      activateGuideElement(el);
    },
    [activateGuideElement],
  );

  const handleBodyInput = useCallback(() => {
    guideManualLockUntilRef.current = Date.now() + 1200;
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const restored = JSON.parse(saved);
        if (restored.cv === "pending") restored.cv = "";
        setForm((p) => ({ ...p, ...restored }));
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const [categoryFromTeams] = getSelectedCareerTeams(form.career_journey);
    if (categoryFromTeams && categoryFromTeams !== selectedCategory) {
      setSelectedCategory(categoryFromTeams);
    }
  }, [form.career_journey, selectedCategory]);

  useEffect(() => {
    setForm((prev) => {
      const nextCareer = prev.career_journey.filter((position) =>
        activePositionLabels.has(position),
      );
      if (nextCareer.length === prev.career_journey.length) return prev;
      return { ...prev, career_journey: nextCareer };
    });

    if (
      selectedCategory &&
      !CAREER_OPTIONS.some(
        (option) =>
          option.team === selectedCategory &&
          activePositionLabels.has(option.label),
      )
    ) {
      setSelectedCategory("");
    }
  }, [activePositionLabels, selectedCategory]);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
      } catch {
        /* ignore */
      }
    }, 500);
    return () => clearTimeout(t);
  }, [form]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const set = useCallback(
    <K extends keyof FormData>(key: K, val: FormData[K]) => {
      setForm((p) => ({ ...p, [key]: val }));
      setErrors((p) => {
        const n = { ...p };
        delete n[key];
        return n;
      });
    },
    [],
  );

  const toggleArr = useCallback((key: keyof FormData, val: string) => {
    setForm((p) => {
      const arr = p[key] as string[];
      const nextArr = arr.includes(val)
        ? arr.filter((v) => v !== val)
        : [...arr, val];
      const next = {
        ...p,
        [key]: nextArr,
      } as FormData;
      if (
        key === "interest_reason" &&
        val === OTHER_INTEREST_OPTION &&
        !nextArr.includes(OTHER_INTEREST_OPTION)
      ) {
        next.interest_other = "";
      }
      return next;
    });
    setErrors((p) => {
      const n = { ...p };
      delete n[key];
      if (key === "interest_reason") delete n.interest_other;
      return n;
    });
  }, []);

  const toggleGrid = useCallback(
    (row: string, col: string) => {
      const shouldScrollToNote =
        step === 1 && !getWorkPreferenceSelection(form.work_preference);
      setForm((p) => {
        const current = getWorkPreferenceSelection(p.work_preference);
        const isSame = current?.mode === row && current?.location === col;
        return { ...p, work_preference: isSame ? {} : { [row]: [col] } };
      });
      setErrors((p) => {
        const n = { ...p };
        delete n.work_preference;
        return n;
      });
      if (shouldScrollToNote) {
        window.setTimeout(() => {
          bodyRef.current
            ?.querySelector<HTMLElement>('[data-guide="note"]')
            ?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 240);
      }
    },
    [form.work_preference, step],
  );

  const goNext = async () => {
    const stepErrors = validateStep(step, form);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      const firstError = Object.keys(stepErrors)[0];
      const guideKey = toGuideKey(firstError);
      setActiveSection(guideKey);
      requestAnimationFrame(() => scrollToGuideSection(guideKey));
      return;
    }
    setErrors({});
    setDirection("next");
    const nextStep = Math.min(step + 1, LAST_STEP);
    setActiveSection(STEP_DEFAULT_KEY[nextStep] ?? "default");
    setStep(nextStep);
  };

  const goPrev = () => {
    setErrors({});
    setDirection("prev");
    const prevStep = Math.max(step - 1, 0);
    setActiveSection(STEP_DEFAULT_KEY[prevStep] ?? "default");
    setStep(prevStep);
  };

  const goTo = (s: number) => {
    setErrors({});
    setDirection(s > step ? "next" : "prev");
    setActiveSection(STEP_DEFAULT_KEY[s] ?? "default");
    setStep(s);
  };

  const handleSubmit = async () => {
    const introErrors = validateIntro(form);
    if (Object.keys(introErrors).length > 0) {
      setShowIntro(true);
      setErrors(introErrors);
      return;
    }

    for (let i = 0; i < LAST_STEP; i++) {
      const stepErrors = validateStep(i, form);
      if (Object.keys(stepErrors).length > 0) {
        setStep(i);
        setErrors(stepErrors);
        setActiveSection(toGuideKey(Object.keys(stepErrors)[0]));
        return;
      }
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      let cvUrl = form.cv;
      if (form.cv === "pending" && pendingCvFileRef.current) {
        const uploadFormData = new window.FormData();
        uploadFormData.append("file", pendingCvFileRef.current);
        uploadFormData.append("full_name", form.full_name);
        uploadFormData.append("email", form.email);
        uploadFormData.append(
          "career_category",
          getSelectedCareerTeams(form.career_journey)[0] || "",
        );
        uploadFormData.append(
          "career_journey",
          JSON.stringify(form.career_journey),
        );
        const uploadRes = await fetch("/api/applications/upload-cv", {
          method: "POST",
          headers: { "x-csrf-token": csrfTokenRef.current },
          body: uploadFormData,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok || !uploadData.url) {
          setSubmitError(
            uploadData.error || "Upload CV thất bại. Vui lòng thử lại.",
          );
          return;
        }
        cvUrl = uploadData.url;
        pendingCvFileRef.current = null;
        setForm((prev) => ({ ...prev, cv: cvUrl }));
      }
      const payload = {
        ...form,
        cv: cvUrl,
        interest_reason: getDisplayInterestReasons(form),
      };
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfTokenRef.current,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(
          data.errors?.join(". ") || data.error || "Lỗi không xác định",
        );
        return;
      }
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
      setSubmitted(true);
    } catch {
      setSubmitError("Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleIntroStart = async () => {
    const introErrors = validateIntro(form);
    if (Object.keys(introErrors).length > 0) {
      setErrors(introErrors);
      return;
    }
    // Check duplicate email
    setChecking(true);
    try {
      const res = await fetch(
        `/api/applications/check?email=${encodeURIComponent(form.email.trim())}`,
      );
      const data = await res.json();
      if (data.exists) {
        setErrors({ email: data.message });
        setChecking(false);
        return;
      }
      const phoneRes = await fetch(
        `/api/applications/check?phone=${encodeURIComponent(form.phone.trim())}`,
      );
      const phoneData = await phoneRes.json();
      if (phoneData.exists) {
        setErrors({ phone: phoneData.message });
        setChecking(false);
        return;
      }
    } catch {
      /* proceed if check fails */
    }
    setChecking(false);
    setErrors({});
    setShowIntro(false);
    setActiveSection(STEP_DEFAULT_KEY[0] ?? "default");
  };

  const pct = Math.round(((step + 1) / STEPS.length) * 100);
  const activeCareerOptions = CAREER_OPTIONS.filter((option) =>
    activePositionLabels.has(option.label),
  );
  const activeCareerCategories = CAREER_CATEGORIES.filter((category) =>
    activeCareerOptions.some((option) => option.team === category.label),
  );
  const selectedCareerCategories = getSelectedCareerTeams(form.career_journey);
  const activeStepCategory =
    selectedCategory || selectedCareerCategories[0] || "";
  const selectedTeamCount = form.career_journey.length;
  const stepOneMascotState: MascotState = hasGuideError
    ? "warning"
    : selectedTeamCount > 0 || mascotCue === "complete"
      ? "celebrate"
      : activeStepCategory ||
          mascotCue === "category" ||
          mascotCue === "teamFocus"
        ? "presenting"
        : "greeting";
  const displayMascotState = step === 0 ? stepOneMascotState : guide.pose;
  const mascotCueClass =
    step === 0
      ? selectedTeamCount > 0 || mascotCue === "complete"
        ? " complete"
        : mascotCue === "teamFocus"
          ? " team-focus"
          : activeStepCategory || mascotCue === "category"
            ? " category-picked"
            : " idle"
      : "";
  const positionSummary = form.career_journey.length
    ? form.career_journey.length > 2
      ? `${form.career_journey.slice(0, 2).join(", ")} +${form.career_journey.length - 2}`
      : form.career_journey.join(", ")
    : "Chưa chọn";
  const primaryPosition = form.career_journey[0]
    ? `${form.career_journey[0]} Intern`
    : activeStepCategory
      ? `${activeStepCategory} Intern`
      : "Chưa chọn hướng";
  const candidateSummary =
    getCandidateName(form.full_name) || form.full_name.trim() || "Chưa nhập";
  const studyProfileDone =
    isFullDateValue(form.dob) &&
    isValidSchoolMajorFormat(form.school) &&
    isFullDateValue(form.enrollment) &&
    isFullDateValue(form.graduation);
  const telegramDone =
    !form.has_telegram || isValidTelegramUsername(form.telegram_username);
  const stepCapabilityDone =
    hasInterestReasonReady(form) &&
    Boolean(form.why_apply.trim()) &&
    Boolean(form.experience.trim()) &&
    Boolean(form.skills.trim()) &&
    Boolean(form.goal.trim()) &&
    hasWorkPreference(form) &&
    Boolean(form.note.trim());
  const stepMindsetDone =
    Boolean(form.strengths.trim()) &&
    Boolean(form.weaknesses.trim()) &&
    Boolean(form.expectation.trim()) &&
    form.problem_solving.length > 0 &&
    form.feedback_response.length > 0;
  const summaryRows =
    step === 0
      ? [
          {
            label: "Lĩnh vực",
            value: activeStepCategory || "Chưa chọn",
            done: Boolean(activeStepCategory),
          },
          {
            label: "Team",
            value: selectedTeamCount
              ? `${selectedTeamCount} team đã chọn`
              : "Chưa chọn",
            done: selectedTeamCount > 0,
          },
          {
            label: "Tiến độ",
            value: `${step + 1}/${STEPS.length}`,
            done: true,
          },
        ]
      : step === 1
        ? [
            {
              label: "Động lực",
              value:
                hasInterestReasonReady(form) && form.why_apply.trim()
                  ? "Đã rõ"
                  : "Còn thiếu",
              done:
                hasInterestReasonReady(form) && Boolean(form.why_apply.trim()),
            },
            {
              label: "Năng lực",
              value:
                form.experience.trim() && form.skills.trim()
                  ? "Đã thêm"
                  : "Còn thiếu",
              done: Boolean(form.experience.trim() && form.skills.trim()),
            },
            {
              label: "Lịch",
              value: hasWorkPreference(form) ? "Đã chọn" : "Chưa chọn",
              done: hasWorkPreference(form),
            },
            {
              label: "Lời nhắn",
              value: form.note.trim() ? "Đã thêm" : "Chưa thêm",
              done: Boolean(form.note.trim()),
            },
          ]
        : step === 2
          ? [
              {
                label: "Bản thân",
                value:
                  form.strengths.trim() && form.weaknesses.trim()
                    ? "Đã chia sẻ"
                    : "Còn thiếu",
                done: Boolean(form.strengths.trim() && form.weaknesses.trim()),
              },
              {
                label: "Kỳ vọng",
                value: form.expectation.trim() ? "Đã thêm" : "Chưa thêm",
                done: Boolean(form.expectation.trim()),
              },
              {
                label: "Tư duy",
                value:
                  form.problem_solving.length && form.feedback_response.length
                    ? "Đã chọn"
                    : "Còn thiếu",
                done:
                  form.problem_solving.length > 0 &&
                  form.feedback_response.length > 0,
              },
            ]
          : step === 3
            ? [
                {
                  label: "Liên hệ",
                  value: form.has_telegram
                    ? telegramDone
                      ? "Telegram đã thêm"
                      : "Cần username"
                    : "SĐT/Zalo đã có",
                  done: telegramDone,
                },
                {
                  label: "Học tập",
                  value: studyProfileDone ? "Đã đủ" : "Còn thiếu",
                  done: studyProfileDone,
                },
                {
                  label: "CV",
                  value:
                    form.cv === "pending"
                      ? "Đã chọn"
                      : form.cv.trim()
                        ? "Đã upload"
                        : "Chưa upload",
                  done: Boolean(form.cv.trim()),
                },
                {
                  label: "LinkedIn",
                  value: form.linkedin.trim() ? "Đã thêm" : "Tùy chọn",
                  done: true,
                  optional: true,
                },
              ]
            : step === 4
              ? [
                  {
                    label: "Liên hệ",
                    value:
                      form.full_name.trim() && isValidEmail(form.email.trim())
                        ? "Đã có"
                        : "Cần kiểm tra",
                    done:
                      Boolean(form.full_name.trim()) &&
                      isValidEmail(form.email.trim()),
                  },
                  {
                    label: "Hướng",
                    value: positionSummary,
                    done: form.career_journey.length > 0,
                  },
                  {
                    label: "CV",
                    value:
                      form.cv === "pending"
                        ? "Chờ gửi"
                        : form.cv.trim()
                          ? "Đã upload"
                          : "Chưa upload",
                    done: Boolean(form.cv.trim()),
                  },
                  {
                    label: "Review",
                    value: "Kiểm tra lần cuối",
                    done: true,
                  },
                ]
              : [
                  {
                    label: "Vị trí",
                    value: positionSummary,
                    done: form.career_journey.length > 0,
                  },
                  {
                    label: "Tên",
                    value: candidateSummary,
                    done: form.full_name.trim().length > 0,
                  },
                  {
                    label: "Email",
                    value: form.email || "Chưa nhập",
                    done: isValidEmail(form.email.trim()),
                  },
                  {
                    label: "Bước",
                    value: STEPS[step]?.label ?? "",
                    done: true,
                  },
                ];
  const missingSummaryItems = (() => {
    const items: string[] = [];

    if (step === 0) {
      if (!activeStepCategory) items.push("Lĩnh vực quan tâm");
      if (selectedTeamCount === 0) items.push("Team ứng tuyển");
      return items;
    }

    if (step === 1) {
      if (!form.interest_reason.length) items.push("Điều khiến bạn hứng thú");
      else if (hasOtherInterest(form) && !form.interest_other.trim())
        items.push("Lý do khác");
      if (!form.why_apply.trim()) items.push("Lý do ứng tuyển");
      if (!form.experience.trim()) items.push("Kinh nghiệm liên quan");
      if (!form.skills.trim()) items.push("Kỹ năng / công cụ");
      if (!form.goal.trim()) items.push("Mục tiêu thực tập");
      if (!hasWorkPreference(form)) items.push("Lịch và hình thức làm việc");
      if (!form.note.trim()) items.push("Lời nhắn cho team");
      return items;
    }

    if (step === 2) {
      if (!form.strengths.trim()) items.push("Điểm mạnh");
      if (!form.weaknesses.trim()) items.push("Điểm cần cải thiện");
      if (!form.expectation.trim()) items.push("Mong muốn 3 tháng đầu");
      if (!form.problem_solving.length) items.push("Cách xử lý việc mới");
      if (!form.feedback_response.length) items.push("Cách nhận feedback");
      return items;
    }

    if (step === 3) {
      if (form.has_telegram && !isValidTelegramUsername(form.telegram_username))
        items.push("Telegram username");
      if (!isFullDateValue(form.dob)) items.push("Ngày sinh");
      if (!form.school.trim()) items.push("Trường học / ngành học");
      else if (!isValidSchoolMajorFormat(form.school))
        items.push("Trường học đúng định dạng");
      if (!isFullDateValue(form.enrollment)) items.push("Ngày nhập học");
      if (!isFullDateValue(form.graduation))
        items.push("Ngày ra trường dự kiến");
      if (
        !form.cv.trim() ||
        (form.cv !== "pending" && !isValidUrl(form.cv.trim()))
      )
        items.push("CV upload");
      if (form.linkedin.trim() && !isValidUrl(form.linkedin.trim()))
        items.push("LinkedIn hợp lệ");
      return items;
    }

    if (step === 4) {
      if (!form.full_name.trim()) items.push("Họ và tên");
      if (!isValidEmail(form.email.trim())) items.push("Email liên hệ");
      if (!isValidPhone(form.phone.trim())) items.push("SĐT/Zalo");
      if (!form.career_journey.length) items.push("Hướng ứng tuyển");
      if (!stepCapabilityDone) items.push("Năng lực và lịch làm việc");
      if (!stepMindsetDone) items.push("Tư duy làm việc");
      if (!telegramDone) items.push("Telegram username");
      if (!studyProfileDone) items.push("Thông tin học tập");
      if (
        !form.cv.trim() ||
        (form.cv !== "pending" && !isValidUrl(form.cv.trim()))
      )
        items.push("CV upload");
      if (form.linkedin.trim() && !isValidUrl(form.linkedin.trim()))
        items.push("LinkedIn hợp lệ");
    }

    return items;
  })();
  const summaryTitle =
    step === 0
      ? "Hướng ứng tuyển"
      : step === 3
        ? "Hồ sơ cần bổ sung"
        : step === 4
          ? "Sẵn sàng gửi"
          : "Tiến độ hồ sơ";
  const baseSummaryRequirement =
    step === 0
      ? "Chọn lĩnh vực và ít nhất 1 team phù hợp."
      : step === 1
        ? "Hoàn tất động lực, kinh nghiệm, kỹ năng, lịch và lời nhắn."
        : step === 2
          ? "Chia sẻ điểm mạnh, kỳ vọng và cách bạn phản hồi khi làm việc."
          : step === 3
            ? "Bổ sung học tập và upload CV để qua bước xác nhận."
            : "Xem lại thông tin trước khi gửi hồ sơ.";
  const summaryStepDone = missingSummaryItems.length === 0;
  const summaryFocusLabel = summaryStepDone
    ? "Đã ổn bước này"
    : step === 4
      ? "Còn vài mục cần rà lại"
      : "Còn vài mục cần bổ sung";
  const summaryRequirement = summaryStepDone
    ? baseSummaryRequirement
    : `Hoàn thiện ${missingSummaryItems.length} mục trong danh sách bên dưới.`;
  const requiredSummaryRows = summaryRows.filter(
    (row) => !("optional" in row && row.optional),
  );
  const summaryDoneCount = requiredSummaryRows.filter((row) => row.done).length;
  const stepOneCommitment = selectedTeamCount
    ? `${selectedTeamCount} hướng trong ${activeStepCategory}`
    : activeStepCategory
      ? `Đang xem ${activeStepCategory}`
      : "Bắt đầu từ lĩnh vực bạn thích nhất";
  const summaryCommitment =
    step === 0
      ? stepOneCommitment
      : form.career_journey.length
        ? primaryPosition
        : "Mỗi bước đang làm hồ sơ rõ hơn";

  return (
    <>
      <style>{wizardCSS}</style>
      <div className="wz-overlay">
        <div className="wz-container">
          {submitted ? (
            <SuccessScreen
              onClose={onClose}
              name={form.full_name}
              email={form.email}
              careerJourney={form.career_journey}
            />
          ) : showIntro ? (
            <IntroScreen
              form={form}
              set={set}
              errors={errors}
              onStart={handleIntroStart}
              onClose={onClose}
              checking={checking}
            />
          ) : (
            <>
              <div className="wz-header">
                <div className="wz-header-left">
                  <div className="wz-avatar">
                    <span className="wz-avatar-text">M</span>
                  </div>
                  <div>
                    <div className="wz-brand">Markee Recruitment</div>
                    <div className="wz-brand-sub">Thực tập sinh 2026</div>
                  </div>
                </div>
                <div className="wz-header-right">
                  <div className="wz-live-badge">
                    <span className="wz-live-dot" />
                    LIVE
                  </div>
                  <button
                    className="wz-close"
                    onClick={onClose}
                    aria-label="Đóng"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="wz-progress-section">
                <div className="wz-steps-row">
                  {STEPS.map((s, i) => (
                    <button
                      key={i}
                      className={`wz-step-btn ${i === step ? "active" : ""} ${i < step ? "done" : ""}`}
                      onClick={() => i <= step && goTo(i)}
                      disabled={i > step}
                    >
                      <span className="wz-step-circle">
                        {i < step ? (
                          "\u2713"
                        ) : (
                          <span className="wz-step-num">{i + 1}</span>
                        )}
                      </span>
                      <span className="wz-step-info">
                        <span className="wz-step-name">{s.label}</span>
                        <span className="wz-step-desc">{s.desc}</span>
                      </span>
                    </button>
                  ))}
                </div>
                <div className="wz-bar-wrap">
                  <div className="wz-bar-track">
                    <div className="wz-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="wz-bar-label">
                    {step + 1} / {STEPS.length}
                  </span>
                </div>
              </div>

              <div className="wz-mobile-summary-bar" aria-live="polite">
                <div className="wz-mobile-summary-mascot">
                  <Mascot state={displayMascotState} size={42} />
                </div>
                <div className="wz-mobile-summary-copy">
                  <span>{STEPS[step]?.label}</span>
                  <strong>
                    {step === 0
                      ? activeStepCategory || "Chọn lĩnh vực"
                      : summaryRows[0]?.value}
                  </strong>
                </div>
                <div className="wz-mobile-summary-step">
                  {step + 1}/{STEPS.length}
                </div>
              </div>

              {/* ── Main form + compact right summary/coach panel ── */}
              <div className="wz-main">
                <div
                  className="wz-micro-rail"
                  ref={guideRailRef}
                  aria-live="polite"
                >
                  <motion.div
                    className={`wz-micro-coach${hasGuideError ? " warn" : ""}${mascotCueClass}`}
                    animate={{ y: guideY }}
                    transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="wz-micro-mascot">
                      <Mascot
                        state={displayMascotState}
                        size={124}
                        className={`wz-guide-mascot-img ${displayMascotState}`}
                        flipX={displayMascotState === "thinking"}
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Form content — full width, clean alignment */}
                <div
                  className="wz-body"
                  ref={bodyRef}
                  key={step}
                  data-dir={direction}
                  onScroll={handleBodyScroll}
                  onFocusCapture={handleBodyFocus}
                  onPointerDownCapture={handleBodyPointerDown}
                  onInputCapture={handleBodyInput}
                >
                  {step === 0 && (
                    <Step1
                      form={form}
                      set={set}
                      toggleArr={toggleArr}
                      selectedCategory={activeStepCategory}
                      setSelectedCategory={setSelectedCategory}
                      setMascotCue={setMascotCue}
                      careerOptions={activeCareerOptions}
                      careerCategories={activeCareerCategories}
                      errors={errors}
                    />
                  )}
                  {step === 1 && (
                    <Step2
                      form={form}
                      set={set}
                      toggleArr={toggleArr}
                      toggleGrid={toggleGrid}
                      errors={errors}
                    />
                  )}
                  {step === 2 && (
                    <Step3
                      form={form}
                      set={set}
                      toggleArr={toggleArr}
                      errors={errors}
                    />
                  )}
                  {step === 3 && (
                    <Step4
                      form={form}
                      set={set}
                      errors={errors}
                      pendingCvRef={pendingCvFileRef}
                    />
                  )}
                  {step === 4 && (
                    <Step5
                      form={form}
                      goTo={goTo}
                      editIntro={() => {
                        setErrors({});
                        setShowIntro(true);
                      }}
                    />
                  )}
                </div>

                {/* ── Right summary panel ── */}
                <div className="wz-side-panel" aria-live="polite">
                  <div className="wz-side-summary">
                    <div className="wz-summary-head">
                      <div>
                        <div className="wz-summary-kicker">Tiến độ hồ sơ</div>
                        <div className="wz-summary-title">{summaryTitle}</div>
                      </div>
                    </div>
                    <div className="wz-summary-track">
                      <div
                        className="wz-summary-fill"
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <div
                      className={`wz-summary-focus${summaryStepDone ? " done" : ""}`}
                    >
                      <span>{summaryFocusLabel}</span>
                      <strong>{summaryRequirement}</strong>
                    </div>

                    {missingSummaryItems.length > 0 && (
                      <div className="wz-summary-missing">
                        <span>Cần hoàn thiện</span>
                        <ul>
                          {missingSummaryItems.slice(0, 6).map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                          {missingSummaryItems.length > 6 && (
                            <li>+{missingSummaryItems.length - 6} mục khác</li>
                          )}
                        </ul>
                      </div>
                    )}

                    <div className="wz-summary-commit">
                      <span>Bạn đang ứng tuyển</span>
                      <strong>{summaryCommitment}</strong>
                    </div>

                    <div className="wz-summary-list-title">
                      <span>Trạng thái bước</span>
                      <strong>
                        {summaryDoneCount}/{requiredSummaryRows.length}
                      </strong>
                    </div>
                    <div className="wz-summary-list">
                      {summaryRows.map((row) => (
                        <div
                          key={row.label}
                          className={`wz-summary-row${row.done ? " done" : " missing"}${"optional" in row && row.optional ? " optional" : ""}`}
                        >
                          <span className="wz-summary-status">
                            {"optional" in row && row.optional
                              ? "•"
                              : row.done
                                ? "✓"
                                : "!"}
                          </span>
                          <span className="wz-summary-label">{row.label}</span>
                          <span className="wz-summary-value">{row.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="wz-footer">
                <button
                  className="wz-btn-back"
                  onClick={() => {
                    if (step === 0) {
                      setErrors({});
                      setShowIntro(true);
                      return;
                    }
                    goPrev();
                  }}
                >
                  {step === 0 ? "Sửa liên hệ" : "Quay lại"}
                </button>
                <div className="wz-footer-center">
                  <span className="wz-footer-save">
                    Tiến trình được lưu tự động
                  </span>
                </div>
                {step < LAST_STEP ? (
                  <button
                    className="wz-btn-next"
                    onClick={goNext}
                    disabled={
                      checking || (step === 0 && form.career_journey.length < 1)
                    }
                  >
                    {checking ? (
                      "Đang kiểm tra..."
                    ) : (
                      <>
                        Tiếp tục <span className="wz-btn-arrow">→</span>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="wz-submit-wrap">
                    <button
                      className="wz-btn-submit"
                      onClick={handleSubmit}
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <span className="wz-spinner" /> Đang gửi...
                        </>
                      ) : (
                        "Hoàn tất hồ sơ"
                      )}
                    </button>
                    {submitError && (
                      <span className="wz-submit-err">{submitError}</span>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════
   INTRO SCREEN
   ══════════════════════════════════════════════════ */
function IntroScreen({
  form,
  set,
  errors,
  onStart,
  onClose,
  checking,
}: {
  form: FormData;
  set: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
  errors: StepErrors;
  onStart: () => void;
  onClose: () => void;
  checking: boolean;
}) {
  type IntroField = "name" | "email" | "phone";
  const [focusedIntroField, setFocusedIntroField] = useState<IntroField | null>(
    null,
  );
  const [isIntroTyping, setIsIntroTyping] = useState(false);
  const introTypingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasName = Boolean(form.full_name.trim());
  const hasEmail = Boolean(form.email.trim());
  const hasEmailReady = isValidEmail(form.email.trim());
  const hasPhone = Boolean(form.phone.trim());
  const hasPhoneReady = isValidPhone(form.phone.trim());
  const canStart = hasName && hasEmailReady && hasPhoneReady;
  const hasAnyIntroInput = hasName || hasEmail || hasPhone;
  const introErrorItems = [
    errors.full_name ? "Họ và tên" : "",
    errors.email ? "Email liên hệ" : "",
    errors.phone ? "SĐT/Zalo" : "",
  ].filter(Boolean);
  const name = getCandidateName(form.full_name);
  const introHelperTone = introErrorItems.length
    ? "warning"
    : canStart
      ? "ready"
      : "idle";
  const introHelperLabel = introErrorItems.length
    ? "Cần bổ sung"
    : canStart
      ? "Sẵn sàng bắt đầu"
      : "Nhập thông tin để bắt đầu";
  const introHelperText = introErrorItems.length
    ? "Kiểm tra lại các mục bên dưới rồi thử tiếp nhé."
    : canStart
      ? name
        ? `Chào ${name}! Thông tin liên hệ đã đủ, bạn có thể qua bước chọn hướng ứng tuyển.`
        : "Thông tin liên hệ đã đủ, bạn có thể qua bước chọn hướng ứng tuyển."
      : hasAnyIntroInput
        ? "Hoàn thiện đủ họ tên, email và SĐT/Zalo để team liên hệ đúng kênh."
        : "Điền 3 thông tin liên hệ trước, phần định hướng và hồ sơ sẽ ở các bước sau.";
  const miniGuideTone = introErrorItems.length
    ? "warning"
    : canStart
      ? "ready"
      : focusedIntroField || isIntroTyping
        ? "focused"
        : "idle";
  const miniGuideText =
    introErrorItems.length > 0
      ? "Mình đã đánh dấu mục cần sửa ngay dưới ô nhập."
      : focusedIntroField === "name"
        ? "Tên giúp team xưng hô đúng khi liên hệ với bạn."
        : focusedIntroField === "email"
          ? "Email này team sẽ dùng để gửi lịch phỏng vấn và cập nhật hồ sơ."
          : focusedIntroField === "phone"
            ? "SĐT/Zalo giúp team liên hệ nhanh khi cần xác nhận lịch."
            : canStart
              ? name
                ? `Chào ${name}! Đủ thông tin rồi, bấm bắt đầu để tiếp tục nhé.`
                : "Đủ thông tin rồi, mình đưa bạn sang bước chọn hướng nhé."
              : "Điền 3 thông tin trước, mình sẽ lưu tiến trình tự động nhé.";
  const introPose: MascotState =
    errors.full_name || errors.email || errors.phone
      ? "warning"
      : canStart
        ? "encourage"
        : focusedIntroField === "phone"
          ? "contact"
          : focusedIntroField === "email"
            ? "presenting"
            : focusedIntroField === "name"
              ? "greeting"
              : isIntroTyping || hasName || hasEmail || hasPhone
                ? "focused"
                : "greeting";
  const markIntroTyping = (field: IntroField) => {
    setFocusedIntroField(field);
    setIsIntroTyping(true);
    if (introTypingTimer.current) clearTimeout(introTypingTimer.current);
    introTypingTimer.current = setTimeout(() => {
      setIsIntroTyping(false);
    }, 800);
  };

  useEffect(() => {
    return () => {
      if (introTypingTimer.current) clearTimeout(introTypingTimer.current);
    };
  }, []);

  return (
    <div className="wz-intro">
      <button className="wz-intro-close" onClick={onClose} aria-label="Đóng">
        ✕
      </button>
      <div className="wz-intro-content">
        <div className="wz-intro-panel">
          <div className="wz-intro-copy">
            <div className="wz-intro-mascot-stage">
              <Mascot
                state={introPose}
                size={236}
                className="wz-intro-mascot"
                interactive
                hoverState={canStart ? "celebrate" : introPose}
              />
              <div className={`wz-intro-mini-guide ${miniGuideTone}`}>
                <span aria-hidden="true">✦</span>
                <p>{miniGuideText}</p>
              </div>
            </div>
            <span className="wz-intro-kicker">
              Markee Recruitment · Internship 2026
            </span>
            <h2 className="wz-intro-title">Ứng tuyển Markee thật gọn</h2>
            <p className="wz-intro-desc">
              Nhập tên, email và số điện thoại/Zalo trước để team liên hệ đúng
              kênh, sau đó mình mới hỏi định hướng, kỹ năng và hồ sơ.
            </p>
            <div className="wz-intro-pills" aria-label="Điểm nổi bật">
              <span>5 bước gọn</span>
              <span>Lưu tự động</span>
              <span>8-12 phút</span>
            </div>
          </div>

          <div className="wz-intro-form">
            <div className="wz-intro-form-head">
              <span className="wz-intro-form-kicker">Bắt đầu hồ sơ</span>
              <strong>Thông tin liên hệ</strong>
            </div>
            {(introErrorItems.length > 0 || canStart) && (
              <div
                className={`wz-intro-helper ${introHelperTone}`}
                role={introErrorItems.length ? "alert" : "status"}
              >
                <span>{introHelperLabel}</span>
                <p>{introHelperText}</p>
                {introErrorItems.length > 0 && (
                  <ul>
                    {introErrorItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            <div className="wz-info-card full" data-guide="full_name">
              <label className="wz-label">
                Họ và tên <span className="wz-req">*</span>
              </label>
              <input
                className={`wz-input ${errors.full_name ? "wz-input-err" : form.full_name ? "wz-input-ok" : ""}`}
                placeholder="Nguyen Van A"
                value={form.full_name}
                onFocus={() => setFocusedIntroField("name")}
                onBlur={() => setFocusedIntroField(null)}
                onChange={(e) => {
                  markIntroTyping("name");
                  set("full_name", e.target.value);
                }}
              />
              <FieldError error={errors.full_name} />
            </div>

            <div className="wz-info-card full" data-guide="email">
              <label className="wz-label">
                Email liên hệ <span className="wz-req">*</span>
              </label>
              <input
                className={`wz-input ${errors.email ? "wz-input-err" : form.email && isValidEmail(form.email) ? "wz-input-ok" : ""}`}
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onFocus={() => setFocusedIntroField("email")}
                onBlur={() => setFocusedIntroField(null)}
                onChange={(e) => {
                  markIntroTyping("email");
                  set("email", e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onStart();
                }}
              />
              <FieldError error={errors.email} />
            </div>

            <div className="wz-info-card full" data-guide="contact">
              <label className="wz-label">
                Số điện thoại / Zalo <span className="wz-req">*</span>
              </label>
              <input
                className={`wz-input ${errors.phone ? "wz-input-err" : form.phone && isValidPhone(form.phone) ? "wz-input-ok" : ""}`}
                placeholder="0912 345 678"
                value={form.phone}
                onFocus={() => setFocusedIntroField("phone")}
                onBlur={() => setFocusedIntroField(null)}
                onChange={(e) => {
                  markIntroTyping("phone");
                  set("phone", e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onStart();
                }}
              />
              <FieldError error={errors.phone} />
              <div className="wz-contact-options">
                <label className="wz-check-pill">
                  <input
                    type="checkbox"
                    checked={form.is_zalo_phone}
                    onChange={(e) => set("is_zalo_phone", e.target.checked)}
                  />
                  <span className="wz-check-ui" />
                  <span>Số này cũng là Zalo</span>
                </label>
              </div>
            </div>

            <button
              className="wz-btn-start"
              onClick={onStart}
              disabled={checking}
            >
              {checking ? "Đang kiểm tra..." : "Bắt đầu ứng tuyển"}
            </button>
            <p className="wz-intro-hint">
              <span aria-hidden="true">✓</span>
              Tiến trình được lưu tự động
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldError({ error }: { error?: string }) {
  if (!error) return null;
  return <div className="wz-field-error">{error}</div>;
}

function TextFieldFooter({ error }: { error?: string }) {
  return <FieldError error={error} />;
}

/* ══════════════════════════════════════════════════
   STEP 1
   ══════════════════════════════════════════════════ */
function Step1({
  form,
  set,
  toggleArr,
  selectedCategory,
  setSelectedCategory,
  setMascotCue,
  careerOptions,
  careerCategories,
  errors,
}: {
  form: FormData;
  set: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
  toggleArr: (k: keyof FormData, v: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  setMascotCue: (cue: MascotCue) => void;
  careerOptions: CareerOption[];
  careerCategories: CareerCategory[];
  errors: StepErrors;
}) {
  const [isChoosingCategory, setIsChoosingCategory] = useState(false);
  const activeCategory =
    selectedCategory || getSelectedCareerTeams(form.career_journey)[0] || "";
  const activeCategoryMeta = careerCategories.find(
    (category) => category.label === activeCategory,
  );
  const ActiveCategoryIcon = activeCategoryMeta?.icon;
  const filtered = activeCategory
    ? careerOptions.filter((o) => o.team === activeCategory)
    : [];
  const selectedCount = form.career_journey.length;
  const filterCount = (filter: string) =>
    careerOptions.filter((o) => o.team === filter).length;
  const shouldShowCategoryPicker = !activeCategory || isChoosingCategory;
  const handleCategorySelect = (category: string) => {
    const isSwitching = activeCategory && activeCategory !== category;
    setSelectedCategory(category);
    if (isSwitching && form.career_journey.length) {
      set("career_journey", []);
    }
    setMascotCue("category");
    setIsChoosingCategory(false);
    window.setTimeout(() => {
      document
        .querySelector(".wz-team-panel")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 140);
  };

  return (
    <div className="wz-step-content">
      <div className="wz-section-hero">
        <span className="wz-hero-badge">BƯỚC 1</span>
        <h2 className="wz-section-title">Bạn muốn thực tập ở lĩnh vực nào?</h2>
        <p className="wz-section-sub">
          Chọn lĩnh vực bạn hứng thú nhất trước. Sau đó, mình sẽ hiển thị các
          team phù hợp bên dưới.
        </p>
      </div>

      <div
        className={`wz-section-card wz-section-main wz-category-main${!shouldShowCategoryPicker ? " locked" : ""}`}
        data-guide="positions"
      >
        <div className="wz-choice-head">
          <div>
            <span className="wz-card-kicker">Step 1A</span>
            <h3 className="wz-zone-title">Lĩnh vực quan tâm</h3>
            <p className="wz-zone-sub">Chọn 1 lĩnh vực chính cho hồ sơ này.</p>
          </div>
          {activeCategory && !shouldShowCategoryPicker && (
            <button
              type="button"
              className="wz-change-category-btn"
              onClick={() => setIsChoosingCategory(true)}
            >
              Chọn lĩnh vực khác
            </button>
          )}
        </div>
        <FieldError error={errors.career_journey} />
        {shouldShowCategoryPicker ? (
          <>
            {careerCategories.length === 0 ? (
              <div className="wz-switch-note">
                Hiện tại team chưa mở vị trí tuyển dụng mới. Bạn quay lại sau
                hoặc theo dõi kênh Markee để nhận thông báo đợt tuyển tiếp theo.
              </div>
            ) : (
              <div className="wz-category-grid">
                {careerCategories.map((category) => {
                  const checked = activeCategory === category.label;
                  const count = filterCount(category.label);
                  const CategoryIcon = category.icon;
                  return (
                    <button
                      key={category.label}
                      type="button"
                      className={`wz-category-card ${checked ? "selected" : ""}`}
                      aria-pressed={checked}
                      onClick={() => handleCategorySelect(category.label)}
                    >
                      <span
                        className="wz-category-icon"
                        style={{ background: category.color }}
                      >
                        <CategoryIcon aria-hidden="true" strokeWidth={2.35} />
                      </span>
                      <span className="wz-category-copy">
                        <span className="wz-category-name">
                          {category.label}
                        </span>
                        <span className="wz-category-desc">
                          {category.desc}
                        </span>
                      </span>
                      <span className="wz-category-meta">{count} team</span>
                      <span className="wz-category-action">
                        {checked ? "Đã chọn" : "Chọn"}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
            {activeCategory && selectedCount > 0 && (
              <div className="wz-switch-note">
                Khi đổi lĩnh vực, {selectedCount} team đã chọn trước đó sẽ được
                đặt lại.
              </div>
            )}
          </>
        ) : (
          <div className="wz-category-picked">
            <span
              className="wz-category-icon"
              style={{ background: activeCategoryMeta?.color ?? "#ef4444" }}
            >
              {ActiveCategoryIcon ? (
                <ActiveCategoryIcon aria-hidden="true" strokeWidth={2.35} />
              ) : (
                activeCategory.slice(0, 3)
              )}
            </span>
            <div>
              <span className="wz-category-picked-label">Đang chọn</span>
              <strong>{activeCategory}</strong>
            </div>
            <span>{filtered.length} team phù hợp</span>
          </div>
        )}
      </div>

      {activeCategory && !shouldShowCategoryPicker && (
        <motion.div
          key={activeCategory}
          className="wz-team-reveal"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="wz-section-card wz-team-panel">
            <div className="wz-career-head">
              <div>
                <span className="wz-card-kicker">Step 1B</span>
                <h3 className="wz-zone-title">
                  Chọn hướng thực tập trong {activeCategory}
                </h3>
                <p className="wz-zone-sub">
                  Bạn có thể chọn nhiều hướng trong cùng một lĩnh vực. Chưa cần
                  quá chắc chắn — hãy chọn team bạn muốn thử sức nhất.
                </p>
              </div>
              <div className="wz-career-head-badge">
                <span>{selectedCount}</span>
                team đã chọn
              </div>
            </div>
            <div className="wz-selected-summary">
              <span className="wz-selected-meter">
                {selectedCount
                  ? `Đã chọn ${selectedCount} team`
                  : "Chưa chọn team"}
              </span>
              <span>Chọn ít nhất 1 team để qua phần tiếp theo.</span>
            </div>
            {filtered.length === 0 ? (
              <div className="wz-switch-note">
                Lĩnh vực này hiện chưa mở vị trí tuyển dụng. Bạn chọn lĩnh vực
                khác nhé.
              </div>
            ) : (
              <div className="wz-career-grid">
                {filtered.map((opt) => {
                  const checked = form.career_journey.includes(opt.label);
                  const OptionIcon = opt.icon;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      className={`wz-career-card ${checked ? "checked" : ""}`}
                      aria-pressed={checked}
                      onClick={() => {
                        toggleArr("career_journey", opt.label);
                        setMascotCue(
                          checked && selectedCount <= 1
                            ? "category"
                            : "complete",
                        );
                      }}
                    >
                      <span
                        className="wz-cc-icon"
                        style={{ background: opt.color }}
                      >
                        <OptionIcon aria-hidden="true" strokeWidth={2.35} />
                      </span>
                      <div className="wz-cc-info">
                        <span className="wz-cc-label">{opt.label}</span>
                        <span className="wz-cc-sub">{opt.sub}</span>
                      </div>
                      <div className="wz-cc-check">
                        {checked ? "\u2713" : ""}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
            {form.career_journey.length > 0 && (
              <>
                <div className="wz-selected-tags">
                  <span className="wz-selected-label">Đã chọn:</span>
                  {form.career_journey.map((c) => (
                    <span key={c} className="wz-selected-tag">
                      {c}
                      <button
                        type="button"
                        aria-label={`Bỏ chọn ${c}`}
                        onClick={() => toggleArr("career_journey", c)}
                      >
                        x
                      </button>
                    </span>
                  ))}
                </div>
                <div className="wz-step-encourage">
                  Ổn rồi, team đã hiểu bạn muốn thử sức ở đâu. Bước tiếp theo
                  mình sẽ hỏi vài điều về động lực và kỹ năng.
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   STEP 2
   ══════════════════════════════════════════════════ */
function Step2({
  form,
  set,
  toggleArr,
  toggleGrid,
  errors,
}: {
  form: FormData;
  set: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
  toggleArr: (k: keyof FormData, v: string) => void;
  toggleGrid: (r: string, c: string) => void;
  errors: StepErrors;
}) {
  const motivationSelected = hasInterestReasonReady(form);
  const otherInterestSelected = hasOtherInterest(form);
  const whyDone = Boolean(form.why_apply.trim());
  const experienceDone = Boolean(form.experience.trim());
  const skillGoalDone =
    Boolean(form.skills.trim()) && Boolean(form.goal.trim());
  const workSelected = hasWorkPreference(form);
  const selectedWork = getWorkPreferenceSelection(form.work_preference);

  return (
    <div className="wz-step-content">
      <div className="wz-section-hero">
        <span className="wz-hero-badge">BƯỚC 2</span>
        <h2 className="wz-section-title">Năng lực & định hướng</h2>
        <p className="wz-section-sub">
          Bắt đầu bằng động lực ứng tuyển, rồi thêm dự án, kỹ năng và cách bạn
          muốn làm việc
        </p>
      </div>

      <div className="wz-section-card" data-guide="interests">
        <label className="wz-label-big">
          Điều gì khiến bạn hứng thú nhất? <span className="wz-req">*</span>
        </label>
        <p className="wz-hint">
          Chọn vài lý do đúng với bạn. Không cần chọn hết.
        </p>
        <FieldError error={errors.interest_reason} />
        <div className="wz-interest-grid">
          {INTEREST_OPTIONS.map((opt) => {
            const checked = form.interest_reason.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                className={`wz-interest-pill ${checked ? "checked" : ""}`}
                onClick={() => toggleArr("interest_reason", opt)}
              >
                {opt}
              </button>
            );
          })}
        </div>
        {otherInterestSelected && (
          <div className="wz-interest-other">
            <label className="wz-label">
              Lý do khác <span className="wz-req">*</span>
            </label>
            <input
              className={`wz-input ${errors.interest_other ? "wz-input-err" : form.interest_other.trim() ? "wz-input-ok" : ""}`}
              placeholder="Ví dụ: muốn thử sức với môi trường startup, học cách làm sản phẩm thật..."
              value={form.interest_other}
              onChange={(e) => set("interest_other", e.target.value)}
            />
            <FieldError error={errors.interest_other} />
          </div>
        )}
      </div>

      <div className={`wz-reveal ${motivationSelected ? "show" : ""}`}>
        <div>
          <div className="wz-section-card" data-guide="why">
            <label className="wz-label-big">
              Vì sao bạn muốn ứng tuyển vị trí này?{" "}
              <span className="wz-req">*</span>
            </label>
            <p className="wz-hint">
              Không cần viết dài đâu. 2-3 ý rõ là team đã hiểu bạn rồi.
            </p>
            <div className="wz-writing-prompts" aria-hidden="true">
              <span>Vì sao hợp?</span>
              <span>Bạn muốn thử điều gì?</span>
              <span>Liên quan tới mục tiêu nào?</span>
            </div>
            <textarea
              className={`wz-textarea ${errors.why_apply ? "wz-input-err" : form.why_apply ? "wz-input-ok" : ""}`}
              rows={3}
              aria-label="Lý do ứng tuyển"
              placeholder="Vd: Mình muốn học cách lên chiến lược content thực chiến và hiểu hành vi khách hàng B2C từ đội ngũ Markee..."
              value={form.why_apply}
              onChange={(e) => set("why_apply", e.target.value)}
            />
            <TextFieldFooter error={errors.why_apply} />
          </div>
        </div>
      </div>

      <div className={`wz-reveal ${whyDone ? "show" : ""}`}>
        <div>
          <div className="wz-section-card" data-guide="experience">
            <label className="wz-label-big">
              Công việc / dự án / CLB / freelance liên quan{" "}
              <span className="wz-req">*</span>
            </label>
            <p className="wz-hint">
              Cứ kể như đang nói với teammate tương lai: bạn từng làm gì, giữ
              vai trò nào, học được gì.
            </p>
            <div className="wz-writing-prompts" aria-hidden="true">
              <span>Bạn từng làm gì?</span>
              <span>Vai trò của bạn?</span>
              <span>Kết quả hoặc điều học được?</span>
            </div>
            <textarea
              className={`wz-textarea ${errors.experience ? "wz-input-err" : form.experience ? "wz-input-ok" : ""}`}
              rows={4}
              aria-label="Trải nghiệm liên quan"
              placeholder="Vd: Làm content cho CLB Marketing UEH 6 tháng, tăng reach FB 40%. Freelance content cho 2 thương hiệu nhỏ..."
              value={form.experience}
              onChange={(e) => set("experience", e.target.value)}
            />
            <TextFieldFooter error={errors.experience} />
          </div>
        </div>
      </div>

      <div className={`wz-reveal ${experienceDone ? "show" : ""}`}>
        <div>
          <div className="wz-section-card" data-guide="skills">
            <label className="wz-label-big">
              Kỹ năng hoặc công cụ đã sử dụng <span className="wz-req">*</span>
            </label>
            <p className="wz-hint">
              Liệt kê những tool hoặc kỹ năng bạn đã thật sự chạm vào, không cần
              phải rất thành thạo.
            </p>
            <div className="wz-writing-prompts" aria-hidden="true">
              <span>Tool đã dùng</span>
              <span>Kỹ năng tự tin</span>
              <span>Mức độ quen thuộc</span>
            </div>
            <textarea
              className={`wz-textarea ${errors.skills ? "wz-input-err" : form.skills ? "wz-input-ok" : ""}`}
              rows={3}
              aria-label="Kỹ năng hoặc công cụ đã sử dụng"
              placeholder="Vd: Canva, Figma, ChatGPT, Google Sheets, viết content, chạy ads Facebook cơ bản..."
              value={form.skills}
              onChange={(e) => set("skills", e.target.value)}
            />
            <TextFieldFooter error={errors.skills} />
          </div>

          <div className="wz-section-card" data-guide="goals">
            <label className="wz-label-big">
              Mục tiêu thực tập / định hướng sự nghiệp{" "}
              <span className="wz-req">*</span>
            </label>
            <p className="wz-hint">
              Nói ngắn bạn muốn học gì và muốn được thử sức ở đâu trong kỳ thực
              tập này.
            </p>
            <div className="wz-writing-prompts" aria-hidden="true">
              <span>Muốn học gì?</span>
              <span>Muốn thử sức ở đâu?</span>
              <span>Mục tiêu sau 3 tháng?</span>
            </div>
            <textarea
              className={`wz-textarea ${errors.goal ? "wz-input-err" : form.goal ? "wz-input-ok" : ""}`}
              rows={3}
              aria-label="Mục tiêu thực tập"
              placeholder="Vd: Sau 3 tháng mình muốn tự lên được 1 campaign nhỏ và nắm quy trình A→Z của team Markee..."
              value={form.goal}
              onChange={(e) => set("goal", e.target.value)}
            />
            <TextFieldFooter error={errors.goal} />
          </div>
        </div>
      </div>

      <div className={`wz-reveal ${skillGoalDone ? "show" : ""}`}>
        <div>
          <div className="wz-section-card" data-guide="availability">
            <label className="wz-label-big">
              Bạn muốn làm việc ở đâu? <span className="wz-req">*</span>
            </label>
            <p className="wz-hint">
              Chọn đúng 1 tổ hợp phù hợp nhất, ví dụ Hybrid tại Hồ Chí Minh hoặc
              Online.
            </p>
            <FieldError error={errors.work_preference} />
            <div className="wz-work-card-grid">
              {WORK_ROWS.map((row) => {
                const rowChecked = selectedWork?.mode === row;
                const selectedLocations = rowChecked
                  ? [selectedWork.location]
                  : [];
                return (
                  <div
                    key={row}
                    className={`wz-work-card ${rowChecked ? "checked" : ""}`}
                  >
                    <div className="wz-work-card-head">
                      <div>
                        <h4>{row}</h4>
                        <p>{WORK_ROW_COPY[row]}</p>
                      </div>
                      <span>{rowChecked ? selectedLocations.length : 0}</span>
                    </div>
                    <div className="wz-work-location-pills">
                      {WORK_COLS.map((col) => {
                        const checked =
                          selectedWork?.mode === row &&
                          selectedWork.location === col;
                        return (
                          <button
                            key={col}
                            type="button"
                            className={`wz-work-location-pill ${checked ? "checked" : ""}`}
                            onClick={() => toggleGrid(row, col)}
                            aria-pressed={checked}
                            title={WORK_COL_COPY[col]}
                          >
                            {checked && <span>✓</span>}
                            {col}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className={`wz-reveal ${workSelected ? "show" : ""}`}>
        <div>
          <div className="wz-step-encourage">
            Tốt rồi. Team đã có bức tranh cơ bản về hướng đi, kinh nghiệm và
            lịch làm việc của bạn.
          </div>
          <div className="wz-section-card" data-guide="note">
            <label className="wz-label-big">
              Có điều gì bạn muốn nhắn gửi thêm cho team không?{" "}
              <span className="wz-req">*</span>
            </label>
            <textarea
              className={`wz-textarea ${errors.note ? "wz-input-err" : form.note ? "wz-input-ok" : ""}`}
              rows={3}
              aria-label="Lời nhắn thêm cho team"
              placeholder="Vd: Mình có thể bắt đầu tuần tới, sẵn sàng làm thêm giờ nếu dự án cần. Trân trọng..."
              value={form.note}
              onChange={(e) => set("note", e.target.value)}
            />
            <TextFieldFooter error={errors.note} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   STEP 3
   ══════════════════════════════════════════════════ */
function Step3({
  form,
  set,
  toggleArr,
  errors,
}: {
  form: FormData;
  set: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
  toggleArr: (k: keyof FormData, v: string) => void;
  errors: StepErrors;
}) {
  const reflectionDone =
    Boolean(form.strengths.trim()) && Boolean(form.weaknesses.trim());

  return (
    <div className="wz-step-content">
      <div className="wz-section-hero">
        <span className="wz-hero-badge">BƯỚC 3</span>
        <h2 className="wz-section-title">Team muốn hiểu bạn hơn</h2>
        <p className="wz-section-sub">
          Không có câu trả lời đúng sai. Cứ chia sẻ như đang kể với teammate
          tương lai.
        </p>
      </div>

      <div className="wz-flow-group-label">
        <span>Tự nhận diện</span>
        <small>Điểm mạnh và phần bạn đang muốn cải thiện</small>
      </div>

      <div className="wz-reflection-card" data-guide="strengths">
        <div className="wz-rc-header">
          <h3 className="wz-rc-title">
            3 điểm mạnh lớn nhất <span className="wz-req">*</span>
          </h3>
          <p className="wz-rc-hint">Liệt kê ngắn gọn, mỗi ý một dòng là ổn</p>
        </div>
        <textarea
          className={`wz-textarea ${errors.strengths ? "wz-input-err" : form.strengths ? "wz-input-ok" : ""}`}
          rows={3}
          aria-label="Điểm mạnh lớn nhất"
          placeholder="Vd: Mình giỏi phân tích và viết content. Đã tự học Canva, CapCut để làm visual cho mạng xã hội..."
          value={form.strengths}
          onChange={(e) => set("strengths", e.target.value)}
        />
        <TextFieldFooter error={errors.strengths} />
      </div>

      <div className="wz-reflection-card" data-guide="weaknesses">
        <div className="wz-rc-header">
          <h3 className="wz-rc-title">
            2 điểm cần cải thiện <span className="wz-req">*</span>
          </h3>
          <p className="wz-rc-hint">Ai cũng có — chia sẻ thoải mái nhé</p>
        </div>
        <textarea
          className={`wz-textarea ${errors.weaknesses ? "wz-input-err" : form.weaknesses ? "wz-input-ok" : ""}`}
          rows={3}
          aria-label="Điểm cần cải thiện"
          placeholder="Vd: Mình hay cầu toàn nên đôi khi tốn nhiều thời gian hơn cần. Mình đang luyện làm việc theo deadline cứng..."
          value={form.weaknesses}
          onChange={(e) => set("weaknesses", e.target.value)}
        />
        <TextFieldFooter error={errors.weaknesses} />
      </div>

      <div className={`wz-reveal ${reflectionDone ? "show" : ""}`}>
        <div>
          <div className="wz-flow-group-label">
            <span>Cách bạn làm việc</span>
            <small>Kỳ vọng, xử lý việc mới và phản hồi khi được góp ý</small>
          </div>

          <div className="wz-reflection-card" data-guide="expectation">
            <div className="wz-rc-header">
              <h3 className="wz-rc-title">
                Mong muốn trong 3 tháng đầu <span className="wz-req">*</span>
              </h3>
              <p className="wz-rc-hint">Một vài mong muốn ngắn gọn là đủ</p>
            </div>
            <textarea
              className={`wz-textarea ${errors.expectation ? "wz-input-err" : form.expectation ? "wz-input-ok" : ""}`}
              rows={3}
              aria-label="Mong muốn trong 3 tháng đầu"
              placeholder="Vd: Trong 3 tháng đầu mình muốn hiểu cách team lên kế hoạch content và tự hoàn thiện 1 bài viết chuẩn tone Markee..."
              value={form.expectation}
              onChange={(e) => set("expectation", e.target.value)}
            />
            <TextFieldFooter error={errors.expectation} />
          </div>

          <div className="wz-reflection-card" data-guide="problem_solving">
            <div className="wz-rc-header">
              <h3 className="wz-rc-title">
                Khi gặp việc chưa biết làm? <span className="wz-req">*</span>
              </h3>
              <p className="wz-rc-hint">Chọn cách phản ứng gần nhất với bạn</p>
            </div>
            <FieldError error={errors.problem_solving} />
            <div className="wz-option-cards">
              {PROBLEM_OPTIONS.map((opt) => {
                const checked = form.problem_solving.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    className={`wz-option-card ${checked ? "checked" : ""}`}
                    onClick={() => toggleArr("problem_solving", opt)}
                  >
                    <span className="wz-oc-text">{opt}</span>
                    <span className={`wz-oc-check ${checked ? "checked" : ""}`}>
                      {checked ? "\u2713" : ""}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="wz-reflection-card" data-guide="feedback_response">
            <div className="wz-rc-header">
              <h3 className="wz-rc-title">
                Khi được góp ý / sửa bài? <span className="wz-req">*</span>
              </h3>
              <p className="wz-rc-hint">Chọn câu mô tả đúng phản ứng của bạn</p>
            </div>
            <FieldError error={errors.feedback_response} />
            <div className="wz-option-cards">
              {FEEDBACK_OPTIONS.map((opt) => {
                const checked = form.feedback_response.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    className={`wz-option-card ${checked ? "checked" : ""}`}
                    onClick={() => toggleArr("feedback_response", opt)}
                  >
                    <span className="wz-oc-text">{opt}</span>
                    <span className={`wz-oc-check ${checked ? "checked" : ""}`}>
                      {checked ? "\u2713" : ""}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   STEP 4 — Profile
   ══════════════════════════════════════════════════ */
function Step4({
  form,
  set,
  errors,
  pendingCvRef,
}: {
  form: FormData;
  set: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
  errors: StepErrors;
  pendingCvRef: React.MutableRefObject<File | null>;
}) {
  const [cvUpload, setCvUpload] = useState<{
    status: "idle" | "done" | "error";
    message: string;
  }>({ status: "idle", message: "" });

  const handleCvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ALLOWED = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!ALLOWED.includes(file.type)) {
      setCvUpload({
        status: "error",
        message: "Chỉ hỗ trợ PDF, DOC hoặc DOCX.",
      });
      e.target.value = "";
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setCvUpload({ status: "error", message: "File CV cần nhỏ hơn 10MB." });
      e.target.value = "";
      return;
    }
    pendingCvRef.current = file;
    set("cv", "pending");
    setCvUpload({
      status: "done",
      message: `✓ ${file.name} - CV sẽ chỉ được tải lên khi bạn nhấn Hoàn tất hồ sơ.`,
    });
    e.target.value = "";
  };

  return (
    <div className="wz-step-content wz-profile-step">
      <div className="wz-section-hero">
        <span className="wz-hero-badge">BƯỚC 4</span>
        <h2 className="wz-section-title">Hồ sơ cá nhân</h2>
        <p className="wz-section-sub">
          Thêm vài thông tin cuối để team liên hệ, kiểm tra lịch học và xem hồ
          sơ của bạn.
        </p>
      </div>

      <div className="wz-info-grid">
        <div className="wz-info-group-label">
          <span>Liên hệ</span>
          <small>Kênh dự phòng nếu team cần nhắn nhanh</small>
        </div>

        <div className="wz-info-card full" data-guide="contact">
          <label className="wz-label">Kênh liên hệ bổ sung</label>
          <p className="wz-hint">
            SĐT/Zalo đã được lấy ở bước bắt đầu. Nếu có Telegram, thêm username
            để team có thêm một kênh dự phòng.
          </p>
          <div className="wz-contact-inline">
            <label className="wz-check-pill">
              <input
                type="checkbox"
                checked={form.has_telegram}
                onChange={(e) => {
                  const checked = e.target.checked;
                  set("has_telegram", checked);
                  if (!checked) set("telegram_username", "");
                }}
              />
              <span className="wz-check-ui" />
              <span>Mình có dùng Telegram</span>
            </label>

            {form.has_telegram && (
              <div className="wz-telegram-inline" data-guide="telegram">
                <input
                  className={`wz-input ${errors.telegram_username ? "wz-input-err" : form.telegram_username && isValidTelegramUsername(form.telegram_username) ? "wz-input-ok" : ""}`}
                  placeholder="@markee_candidate"
                  value={form.telegram_username}
                  onChange={(e) => set("telegram_username", e.target.value)}
                />
                <FieldError error={errors.telegram_username} />
              </div>
            )}
          </div>
        </div>

        <div className="wz-info-group-label">
          <span>Học tập</span>
          <small>Trường và mốc thời gian học của bạn</small>
        </div>

        <div className="wz-info-card" data-guide="dob">
          <label className="wz-label">
            Ngày sinh <span className="wz-req">*</span>
          </label>
          <p className="wz-field-example">Ví dụ: 12/08/2004</p>
          <input
            className={`wz-input ${errors.dob ? "wz-input-err" : isFullDateValue(form.dob) ? "wz-input-ok" : ""}`}
            type="date"
            value={toDateInputValue(form.dob)}
            onChange={(e) => set("dob", e.target.value)}
          />
          <FieldError error={errors.dob} />
        </div>

        <div className="wz-info-card" data-guide="school">
          <label className="wz-label">
            Trường Đại học / Cao đẳng <span className="wz-req">*</span>
          </label>
          <p className="wz-hint">
            Ghi theo mẫu: Tên trường (Mã trường) - Ngành học.
          </p>
          <p className="wz-field-example">
            Ví dụ: Đại học Bách Khoa (QSB) - An toàn thông tin
          </p>
          <input
            className={`wz-input ${errors.school ? "wz-input-err" : isValidSchoolMajorFormat(form.school) ? "wz-input-ok" : ""}`}
            placeholder="Đại học Bách Khoa (QSB) - An toàn thông tin"
            value={form.school}
            onChange={(e) => set("school", e.target.value)}
          />
          <FieldError error={errors.school} />
        </div>

        <div className="wz-info-card" data-guide="enrollment">
          <label className="wz-label">
            Ngày nhập học <span className="wz-req">*</span>
          </label>
          <p className="wz-field-example">Ví dụ: 05/09/2022</p>
          <input
            className={`wz-input ${errors.enrollment ? "wz-input-err" : isFullDateValue(form.enrollment) ? "wz-input-ok" : ""}`}
            type="date"
            value={toDateInputValue(form.enrollment)}
            onChange={(e) => set("enrollment", e.target.value)}
          />
          <FieldError error={errors.enrollment} />
        </div>

        <div className="wz-info-card" data-guide="graduation">
          <label className="wz-label">
            Ngày dự kiến ra trường <span className="wz-req">*</span>
          </label>
          <p className="wz-field-example">Ví dụ: 15/06/2026</p>
          <input
            className={`wz-input ${errors.graduation ? "wz-input-err" : isFullDateValue(form.graduation) ? "wz-input-ok" : ""}`}
            type="date"
            value={toDateInputValue(form.graduation)}
            onChange={(e) => set("graduation", e.target.value)}
          />
          <FieldError error={errors.graduation} />
        </div>

        <div className="wz-info-group-label">
          <span>CV & LinkedIn</span>
          <small>CV bắt buộc, LinkedIn nếu bạn có</small>
        </div>

        <div className="wz-info-card full" data-guide="cv">
          <label className="wz-label">
            File CV <span className="wz-req">*</span>
          </label>
          <p className="wz-hint">
            Upload file CV để hệ thống lưu lên Google Drive. Chỉ cần PDF, DOC
            hoặc DOCX.
          </p>
          <p className="wz-upload-reassurance">
            CV của bạn chỉ dùng cho quy trình tuyển dụng nội bộ.
          </p>
          <div className="wz-cv-upload">
            <label
              className={`wz-upload-drop ${errors.cv ? "error" : form.cv ? "done" : ""}`}
            >
              <input
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleCvUpload}
                disabled={false}
              />
              <span className="wz-upload-icon">↑</span>
              <span>
                {form.cv === "pending"
                  ? "CV đã chọn"
                  : form.cv
                    ? "CV đã sẵn sàng"
                    : "Chọn file CV"}
              </span>
              <small>PDF, DOC hoặc DOCX · tối đa 10MB</small>
            </label>
            {cvUpload.message && (
              <div className={`wz-upload-status ${cvUpload.status}`}>
                {cvUpload.message}
              </div>
            )}
            {form.cv && form.cv !== "pending" && (
              <a
                className="wz-upload-link"
                href={form.cv}
                target="_blank"
                rel="noopener noreferrer"
              >
                Mở file CV đã upload
              </a>
            )}
          </div>
          <FieldError error={errors.cv} />
        </div>

        <div className="wz-info-card full" data-guide="linkedin">
          <label className="wz-label">LinkedIn nếu có</label>
          <p className="wz-hint">
            Không bắt buộc. Nếu profile có dự án, kinh nghiệm hoặc hoạt động nổi
            bật thì dán link ở đây.
          </p>
          <input
            className={`wz-input ${errors.linkedin ? "wz-input-err" : form.linkedin && isValidUrl(form.linkedin) ? "wz-input-ok" : ""}`}
            placeholder="https://www.linkedin.com/in/..."
            value={form.linkedin}
            onChange={(e) => set("linkedin", e.target.value)}
          />
          <FieldError error={errors.linkedin} />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   STEP 5 — Review
   ══════════════════════════════════════════════════ */
function Step5({
  form,
  goTo,
  editIntro,
}: {
  form: FormData;
  goTo: (s: number) => void;
  editIntro: () => void;
}) {
  return (
    <div className="wz-step-content">
      <div className="wz-section-hero">
        <span className="wz-hero-badge">BƯỚC 5</span>
        <h2 className="wz-section-title">Kiểm tra & Gửi hồ sơ</h2>
        <p className="wz-section-sub">Xem lại một lần nữa rồi bấm gửi</p>
      </div>

      <div className="wz-review-hero" data-guide="review">
        <div className="wz-rh-avatar">
          {form.full_name ? form.full_name.charAt(0).toUpperCase() : "?"}
        </div>
        <div className="wz-rh-info">
          <div className="wz-rh-name">{form.full_name || "Chưa điền tên"}</div>
          <div className="wz-rh-detail">{form.email || "Chưa điền email"}</div>
          <div className="wz-rh-tags">
            {form.career_journey.map((c) => (
              <span key={c} className="wz-rh-tag">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      <ReviewSection
        title="Liên hệ"
        step={0}
        goTo={goTo}
        onEdit={editIntro}
        items={[
          { label: "Họ tên", value: form.full_name },
          { label: "Email", value: form.email },
          { label: "SĐT", value: form.phone },
          {
            label: "Zalo",
            value: form.is_zalo_phone
              ? "Dùng cùng số điện thoại"
              : "Chưa xác nhận",
          },
          {
            label: "Telegram",
            value: form.has_telegram ? form.telegram_username : "Không dùng",
          },
        ]}
      />

      <ReviewSection
        title="Định hướng sự nghiệp"
        step={0}
        goTo={goTo}
        items={[
          { label: "Vị trí", value: form.career_journey.join(", ") },
          {
            label: "Điều hứng thú",
            value: getDisplayInterestReasons(form).join(", "),
          },
          { label: "Lý do ứng tuyển", value: form.why_apply },
        ]}
      />

      <ReviewSection
        title="Năng lực & Định hướng"
        step={1}
        goTo={goTo}
        items={[
          { label: "Kinh nghiệm", value: form.experience },
          { label: "Kỹ năng", value: form.skills },
          { label: "Mục tiêu", value: form.goal },
          {
            label: "Làm việc",
            value: Object.entries(form.work_preference)
              .filter(([, v]) => v.length)
              .map(([k, v]) => `${k}: ${v.join(", ")}`)
              .join(" · "),
          },
          { label: "Ghi chú", value: form.note },
        ]}
      />

      <ReviewSection
        title="Tư duy làm việc"
        step={2}
        goTo={goTo}
        items={[
          { label: "Điểm mạnh", value: form.strengths },
          { label: "Cần cải thiện", value: form.weaknesses },
          { label: "Mong muốn 3 tháng", value: form.expectation },
          {
            label: "Xử lý việc chưa biết",
            value: form.problem_solving.join(", "),
          },
          { label: "Khi được góp ý", value: form.feedback_response.join(", ") },
        ]}
      />

      <ReviewSection
        title="Hồ sơ cá nhân"
        step={3}
        goTo={goTo}
        items={[
          { label: "Ngày sinh", value: form.dob },
          { label: "Trường", value: form.school },
          { label: "Nhập học", value: form.enrollment },
          { label: "Ra trường", value: form.graduation },
          {
            label: "CV",
            value:
              form.cv === "pending"
                ? "Đã chọn file – sẽ tải lên khi gửi"
                : form.cv,
          },
          { label: "LinkedIn", value: form.linkedin || "Không thêm" },
        ]}
      />

      <div className="wz-submit-notice">
        Thông tin của bạn được bảo mật tuyệt đối và chỉ dùng cho mục đích tuyển
        dụng.
      </div>
    </div>
  );
}

function ReviewSection({
  title,
  step,
  goTo,
  onEdit,
  items,
}: {
  title: string;
  step: number;
  goTo: (s: number) => void;
  onEdit?: () => void;
  items: { label: string; value: string }[];
}) {
  const optional: string[] = [];
  const hasEmpty = items.some((i) => !i.value && !optional.includes(i.label));
  return (
    <div className={`wz-review-card ${hasEmpty ? "has-empty" : ""}`}>
      <div className="wz-rc-head">
        <span className="wz-rc-head-title">{title}</span>
        <button
          className="wz-rc-edit-btn"
          onClick={onEdit ?? (() => goTo(step))}
        >
          Sửa
        </button>
      </div>
      <div className="wz-rc-body">
        {items
          .filter((f) => f.value)
          .map((f) => (
            <div key={f.label} className="wz-rv-row">
              <span className="wz-rv-label">{f.label}</span>
              <span className="wz-rv-value">{f.value}</span>
            </div>
          ))}
        {hasEmpty && (
          <div className="wz-rv-empty-note">Còn mục bắt buộc chưa điền</div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   SUCCESS
   ══════════════════════════════════════════════════ */
function SuccessScreen({
  onClose,
  name,
  email = "",
  careerJourney = [],
}: {
  onClose: () => void;
  name: string;
  email?: string;
  careerJourney?: string[];
}) {
  const displayName = getCandidateName(name) || "bạn";
  const positionText = careerJourney.length ? careerJourney.join(" · ") : "—";
  const emailText = email || "—";
  const now = new Date();
  const timeStr =
    now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) +
    " · " +
    now.toLocaleDateString("vi-VN");
  const socials = [
    {
      key: "fb",
      href: "https://www.facebook.com/markeeaimarketing",
      mascot: "/img/mascot/Dex-logo.png",
      name: "Markee AI Marketing",
      meta: "2.4k người theo dõi",
      desc: "Like & follow để nhận internship, workshop và tài liệu mới sớm nhất.",
      button: "Theo dõi ngay",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      key: "yt",
      href: "https://www.youtube.com/@markeeai",
      mascot: "/img/mascot/Theo-logo.png",
      name: "YouTube · Markee AI",
      meta: "Video thực chiến AI",
      desc: "Subscribe để xem case study AI Marketing và chuẩn bị tốt hơn cho phỏng vấn.",
      button: "Subscribe",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      key: "li",
      href: "https://www.linkedin.com/in/markee-ai-345489408/?isSelfProfile=true",
      mascot: "/img/mascot/Max-logo.png",
      name: "LinkedIn · Markee AI",
      meta: "LinkedIn Company Page",
      desc: "Follow page để cập nhật tuyển dụng và kết nối với team Markee.",
      button: "Follow",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      key: "tt",
      href: "https://www.tiktok.com/@markee_ai",
      mascot: "/img/mascot/Pip-logo.png",
      name: "TikTok · Markee AI",
      meta: "Tips AI hằng ngày",
      desc: "Follow TikTok để nhận tips AI Marketing ngắn gọn mỗi ngày.",
      button: "Follow TikTok",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="wz-success">
      <div className="wz-success-inner">
        <div className="wz-success-scroll">
          <div className="wz-success-page">
            <section className="wz-result-hero">
              <div className="wz-result-check">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className="wz-result-copy">
                <div className="wz-result-badges">
                  <span>Đã nhận hồ sơ</span>
                  <span>Email tự động · dưới 30 giây</span>
                  <span>Check mail ngay và làm theo hướng dẫn</span>
                </div>
                <h2>
                  Hồ sơ đã được gửi <em>thành công!</em>
                </h2>
                <p>
                  Cảm ơn <strong>{displayName}</strong>. Trong lúc chờ email phản hồi,
                  bạn có thể làm 2 việc nhanh bên dưới để không bỏ lỡ tin tuyển dụng
                  mới và trải nghiệm sản phẩm của Markee.
                </p>
              </div>
              <Image className="wz-result-mascot" src="/img/mascot/Dex-logo.png" alt="Dex" width={90} height={90} />
              <div className="wz-result-summary">
                <div>
                  <span>Vị trí</span>
                  <strong>{positionText}</strong>
                </div>
                <div>
                  <span>Email</span>
                  <strong>{emailText}</strong>
                </div>
                <div>
                  <span>Thời gian gửi</span>
                  <strong>{timeStr}</strong>
                </div>
              </div>
            </section>

            <div className="wz-result-layout">
              <section className="wz-follow-panel">
                <div className="wz-panel-eyebrow">Ưu tiên 1 · Tăng tương tác Markee</div>
                <div className="wz-follow-head">
                  <div>
                    <h3>Like & follow Markee sau khi gửi hồ sơ</h3>
                    <p>
                      Follow kênh bạn dùng nhiều nhất để nhận workshop, tài liệu AI và tin tuyển dụng sớm. Nếu tiện,
                      follow cả 4 kênh để ủng hộ Markee nhé.
                    </p>
                  </div>
                  <div className="wz-follow-mascots">
                    <Image src="/img/mascot/Dex-logo.png" alt="Dex" width={40} height={40} />
                    <Image src="/img/mascot/Theo-logo.png" alt="Theo" width={40} height={40} />
                    <Image src="/img/mascot/Max-logo.png" alt="Max" width={40} height={40} />
                    <Image src="/img/mascot/Pip-logo.png" alt="Pip" width={40} height={40} />
                  </div>
                </div>

                <div className="wz-follow-reason">
                  <span>Vì sao nên follow?</span>
                  <strong>Tin tuyển dụng và workshop thường được cập nhật trên social trước khi lên website.</strong>
                </div>

                <div className="wz-follow-list">
                  {socials.map((social) => (
                    <a key={social.key} href={social.href} target="_blank" rel="noopener noreferrer" className={`wz-follow-card wz-follow-card-${social.key}`}>
                      <Image className="wz-follow-mascot" src={social.mascot} alt="" width={48} height={48} />
                      <div className="wz-follow-icon">{social.icon}</div>
                      <div className="wz-follow-copy">
                        <strong>{social.name}</strong>
                        <span>{social.meta}</span>
                        <p>{social.desc}</p>
                      </div>
                      <div className="wz-follow-btn">{social.button}</div>
                    </a>
                  ))}
                </div>
              </section>

              <aside className="wz-after-submit">
                <section className="wz-app-trial-card">
                  <Image src="/img/mascot/Dex-logo.png" alt="" width={96} height={96} />
                  <div className="wz-panel-eyebrow">Ưu tiên 2 · Trải nghiệm app</div>
                  <h3>Thử Markee AI trong lúc chờ kết quả</h3>
                  <p>
                    Tạo nội dung, lên lịch đa kênh và xem cách team Markee dùng AI Marketing trong công việc thật.
                  </p>
                  <a href="https://app.markeeai.com" target="_blank" rel="noopener noreferrer" className="wz-app-trial-btn">
                    Dùng thử Markee AI miễn phí →
                  </a>
                  <div className="wz-app-trust">
                    <span>Miễn phí 1 tháng</span>
                    <span>1000 AI Credits</span>
                    <span>Không cần thẻ tín dụng</span>
                  </div>
                </section>

                <section className="wz-process-card">
                  <div className="wz-process-title">Tiếp theo sẽ như thế nào?</div>
                  <div className="wz-process-step">
                    <span>1</span>
                    <div>
                      <strong>Team review hồ sơ</strong>
                      <p>Tuyển dụng đọc kỹ thông tin bạn đã chia sẻ.</p>
                    </div>
                  </div>
                  <div className="wz-process-step">
                    <span>2</span>
                    <div>
                      <strong>Email phản hồi</strong>
                      <p>Hệ thống gửi email tự động, nhớ check cả Spam.</p>
                    </div>
                  </div>
                  <div className="wz-process-step">
                    <span>3</span>
                    <div>
                      <strong>Phỏng vấn online nếu phù hợp</strong>
                      <p>Buổi gặp ngắn để team và bạn hiểu nhau hơn.</p>
                    </div>
                  </div>
                </section>
              </aside>
            </div>

            <div className="wz-sent-email-note">
              <span>i</span>
              <p>
                Nhớ kiểm tra <strong>{email ? email : "email của bạn"}</strong> thường xuyên, kể cả thư mục <strong>Spam / Promotions</strong>.
              </p>
            </div>

            <button onClick={onClose} className="wz-sent-back">
              ← Quay lại trang tuyển dụng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
/* ══════════════════════════════════════════════════
   CSS
   ══════════════════════════════════════════════════ */
const wizardCSS = `
@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@700;800&display=swap');
/* ═══════════════════════════════════════════════════════════════
   MARKEE APPLICATION POPUP — Design System v3
   Concept: Dark premium shell + light structured content + calm SaaS interaction
   Palette: Red #EF4444 · Shell #0F172A–#1E293B · Surface #FFF / #F8FAFC
   Rules: RED = primary CTA, focus glow, error/icon accents
   ═══════════════════════════════════════════════════════════════ */

/* ─── Overlay ─── */
.wz-overlay{position:fixed;inset:0;z-index:9999;background:radial-gradient(ellipse at 50% 30%,rgba(30,20,50,.75) 0%,rgba(10,10,28,.82) 100%);backdrop-filter:blur(18px);display:flex;align-items:center;justify-content:center;animation:wzFadeIn .25s ease}
@keyframes wzFadeIn{from{opacity:0}to{opacity:1}}

/* ─── Modal container ─── */
.wz-container{background:rgba(255,255,255,.94);backdrop-filter:blur(24px);width:100%;height:100%;max-width:1280px;max-height:94vh;border-radius:30px;border:1px solid rgba(255,255,255,.22);display:flex;flex-direction:column;overflow:hidden;box-shadow:0 34px 110px rgba(0,0,0,.36),0 0 0 1px rgba(255,255,255,.14),inset 0 1px 0 rgba(255,255,255,.58);animation:wzSlideUp .4s cubic-bezier(.34,1.56,.64,1);font-family:'Be Vietnam Pro',var(--font-geist-sans),-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif}
@keyframes wzSlideUp{from{opacity:0;transform:translateY(40px) scale(.97)}to{opacity:1;transform:none}}

/* ─── Intro screen ─── */
.wz-intro{display:flex;flex-direction:column;flex:1;background:linear-gradient(135deg,#140f1f 0%,#172033 46%,#101827 100%);border-radius:24px;position:relative;overflow:hidden}
.wz-intro::before{content:'';position:absolute;inset:0;background:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:44px 44px;mask-image:linear-gradient(120deg,rgba(0,0,0,.5),transparent 72%);pointer-events:none}
.wz-intro::after{content:'';position:absolute;inset:auto 0 0 0;height:34%;background:linear-gradient(180deg,transparent,rgba(15,23,42,.42));pointer-events:none}
.wz-intro-close{position:absolute;top:20px;right:20px;width:44px;height:44px;border-radius:10px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);color:rgba(255,255,255,.5);font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;z-index:2}
.wz-intro-close:hover{background:#ef4444;color:#fff;border-color:#ef4444}
.wz-intro-content{display:flex;align-items:center;justify-content:center;flex:1;padding:46px 52px;position:relative;z-index:1}
.wz-intro-panel{width:min(880px,100%);display:grid;grid-template-columns:minmax(0,.95fr) minmax(360px,1fr);gap:46px;align-items:center}
.wz-intro-copy{color:#fff}
.wz-intro-mascot-stage{width:min(462px,100%);height:260px;display:flex;align-items:center;justify-content:flex-start;position:relative;margin-bottom:18px;animation:wzBounceIn .7s cubic-bezier(.34,1.56,.64,1)}
.wz-intro-mascot-stage::before{content:'';position:absolute;left:16px;bottom:8px;width:218px;height:94px;border-radius:999px;background:radial-gradient(ellipse,rgba(239,68,68,.18) 0%,rgba(255,255,255,.07) 46%,transparent 72%);filter:blur(6px);pointer-events:none}
.wz-intro-mascot{filter:drop-shadow(0 22px 34px rgba(0,0,0,.32));position:relative;z-index:1}
@keyframes wzBounceIn{from{transform:scale(.76) translateY(16px);opacity:0}to{transform:scale(1) translateY(0);opacity:1}}
.wz-intro-kicker{display:inline-flex;padding:5px 12px;border-radius:999px;background:rgba(239,68,68,.18);border:1px solid rgba(248,113,113,.36);font-size:10px;font-weight:900;color:#fecaca;letter-spacing:.11em;text-transform:uppercase;margin-bottom:14px}
.wz-intro-title{font-family:'Be Vietnam Pro',var(--font-geist-sans),sans-serif;font-size:42px;font-weight:800;line-height:1.14;letter-spacing:-.03em;margin:0 0 14px;color:#fff;max-width:430px}
.wz-intro-desc{font-size:15px;line-height:1.75;color:rgba(255,255,255,.7);margin:0;max-width:410px}
.wz-intro-pills{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}
.wz-intro-pills span{display:inline-flex;align-items:center;height:30px;padding:0 12px;border-radius:999px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.07);color:rgba(255,255,255,.82);font-size:12px;font-weight:700}
.wz-intro-form{background:rgba(255,255,255,.94);backdrop-filter:blur(18px);border:1px solid rgba(255,255,255,.72);border-radius:24px;padding:20px;box-shadow:0 28px 80px rgba(0,0,0,.30),0 18px 46px rgba(239,68,68,.10),inset 0 1px 0 rgba(255,255,255,.88);display:flex;flex-direction:column;gap:12px;position:relative}
.wz-intro-form::before{content:'';position:absolute;inset:0;border-radius:24px;background:linear-gradient(135deg,rgba(239,68,68,.05),transparent 48%);pointer-events:none}
.wz-intro-form-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding:2px 2px 6px;position:relative;z-index:1}
.wz-intro-form-head strong{font-size:18px;color:#0f172a;letter-spacing:-.02em;line-height:1.25}
.wz-intro-form-kicker{font-size:10px;font-weight:900;letter-spacing:.02em;color:#94a3b8}
.wz-intro-form .wz-info-card{border-color:#e2e8f0;background:rgba(255,255,255,.92);padding:14px;position:relative;z-index:1}
.wz-intro-form .wz-btn-start{width:100%;margin-top:2px}
.wz-typing{display:inline-flex;gap:5px;padding:4px 0}
.wz-typing span{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.5);animation:wzTypingDot 1.4s ease-in-out infinite}
.wz-typing span:nth-child(2){animation-delay:.2s}
.wz-typing span:nth-child(3){animation-delay:.4s}
@keyframes wzTypingDot{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-7px);opacity:1}}
.wz-btn-start{padding:14px 44px;border-radius:12px;border:none;background:linear-gradient(180deg,#ef4444 0%,#dc2626 100%);font-size:15px;font-weight:700;color:#fff;cursor:pointer;box-shadow:0 6px 16px rgba(239,68,68,.24),inset 0 1px 0 rgba(255,255,255,.18);transition:transform .22s cubic-bezier(.22,1,.36,1),box-shadow .22s;letter-spacing:-.01em}
.wz-btn-start:hover{transform:translateY(-2px);box-shadow:0 18px 34px rgba(239,68,68,.38),inset 0 1px 0 rgba(255,255,255,.22)}
.wz-intro-hint{font-size:12px;color:#94a3b8;margin:2px 0 0;text-align:center}

/* ─── Header (dark shell) ─── */
.wz-header{display:flex;align-items:center;justify-content:space-between;padding:14px 24px;background:linear-gradient(135deg,#0f172a,#1e293b);flex-shrink:0}
.wz-header-left{display:flex;align-items:center;gap:12px}
.wz-avatar{width:38px;height:38px;border-radius:11px;background:linear-gradient(135deg,#ef4444,#dc2626);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(239,68,68,.4)}
.wz-avatar-text{font-size:17px;font-weight:900;color:#fff}
.wz-brand{font-weight:700;font-size:14px;color:#fff;letter-spacing:-.01em}
.wz-brand-sub{font-size:11px;color:rgba(255,255,255,.45)}
.wz-header-right{display:flex;align-items:center;gap:10px}
.wz-live-badge{display:flex;align-items:center;gap:5px;font-size:10px;font-weight:700;color:#4ade80;letter-spacing:.1em}
.wz-live-dot{width:6px;height:6px;border-radius:50%;background:#4ade80;box-shadow:0 0 8px #4ade80;animation:wzBlink 2s ease-in-out infinite}
@keyframes wzBlink{0%,100%{opacity:1}50%{opacity:.25}}
.wz-close{width:44px;height:44px;border-radius:9px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);color:rgba(255,255,255,.45);font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s}
.wz-close:hover{background:#ef4444;color:#fff;border-color:#ef4444}

/* ─── Stepper (pill style, red only, no green) ─── */
.wz-progress-section{padding:11px 30px 10px;border-bottom:1px solid rgba(226,232,240,.72);background:rgba(255,255,255,.88);backdrop-filter:blur(14px);flex-shrink:0}
@media(max-width:640px){.wz-progress-section{padding:14px 18px 12px}}
.wz-steps-row{display:flex;gap:6px;margin-bottom:9px}
.wz-step-btn{flex:1;display:flex;align-items:center;gap:8px;padding:6px 9px;border-radius:100px;border:1px solid #e2e8f0;background:#fafbfc;cursor:default;transition:all .25s;text-align:left}
.wz-step-btn.active{border-color:#ef4444;border-width:1.5px;background:#fff6f6;box-shadow:0 2px 10px rgba(239,68,68,.14),0 0 0 2px rgba(239,68,68,.055);animation:wz-pulse 2.4s ease-in-out infinite}
@keyframes wz-pulse{0%,100%{box-shadow:0 2px 12px rgba(239,68,68,.18),0 0 0 3px rgba(239,68,68,.08)}50%{box-shadow:0 2px 16px rgba(239,68,68,.25),0 0 0 5px rgba(239,68,68,.06)}}
.wz-step-btn.done{border-color:#bbf7d0;background:#f0fdf4;cursor:pointer}
.wz-step-btn.done:hover{background:#dcfce7;border-color:#86efac}
.wz-step-circle{width:24px;height:24px;border-radius:50%;background:#e2e8f0;color:#94a3b8;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .25s}
.wz-step-num{font-size:12px;font-weight:800;line-height:1}
.wz-step-btn.active .wz-step-circle{background:linear-gradient(180deg,#ef4444,#dc2626);color:#fff;box-shadow:0 2px 6px rgba(239,68,68,.28)}
.wz-step-btn.done .wz-step-circle{background:#10b981;color:#fff;font-size:11px;font-weight:700}
.wz-step-info{display:flex;flex-direction:column;min-width:0}
.wz-step-name{font-size:12px;font-weight:550;color:#64748b;letter-spacing:-.01em}
.wz-step-btn.active .wz-step-name{color:#b91c1c;font-weight:700}
.wz-step-btn.done .wz-step-name{color:#15803d}
.wz-step-desc{display:none}
.wz-bar-wrap{display:flex;align-items:center;gap:10px}
.wz-bar-track{flex:1;height:3px;background:#f1f5f9;border-radius:100px;overflow:hidden}
.wz-bar-fill{height:100%;border-radius:100px;background:linear-gradient(90deg,#10b981 0%,#059669 100%);transition:width .6s cubic-bezier(.34,1.56,.64,1);box-shadow:0 0 8px rgba(16,185,129,.4)}
.wz-bar-label{font-size:10px;font-weight:600;color:#94a3b8;white-space:nowrap}
.wz-mobile-guide,.wz-mobile-summary-bar{display:none}

/* ─── Mascot coach + summary layout ─── */
.wz-main{display:grid;grid-template-columns:124px minmax(0,1fr) 270px;column-gap:0;flex:1;min-height:0;overflow:hidden;padding:0;position:relative;max-width:1280px;margin:0 auto;width:100%;box-sizing:border-box;background:#fff}
.wz-guide-rail,.wz-guide-track,.wz-guide-dot,.wz-guide-mascot,.wz-float-bubble,.wz-float-mascot-wrap,.wz-float-glow{display:none}
@keyframes wzPulseGlow{0%,100%{opacity:.6;transform:scale(1)}50%{opacity:1;transform:scale(1.04)}}
.wz-guide-mascot-img{transition:filter .24s cubic-bezier(.22,1,.36,1),transform .24s cubic-bezier(.22,1,.36,1)}
.wz-guide-mascot-img.warning{filter:saturate(1.1) drop-shadow(0 8px 16px rgba(239,68,68,.16))}
.wz-guide-mascot-img.success,.wz-guide-mascot-img.encourage,.wz-guide-mascot-img.celebrate{transform:translateY(-2px)}
.wz-guide-mascot-img.focused,.wz-guide-mascot-img.listening,.wz-guide-mascot-img.thinking{filter:saturate(1.04) contrast(1.02)}
.wz-guide-mascot-img.contact,.wz-guide-mascot-img.presenting{filter:drop-shadow(0 10px 18px rgba(15,23,42,.10))}

.wz-micro-rail{grid-column:1;position:relative;min-width:0;overflow:visible;background:linear-gradient(90deg,#fff 0%,#fff 72%,#f8fafc 100%);border-right:1px solid #edf2f7}
.wz-micro-coach{position:absolute;right:-34px;top:0;width:154px;height:156px;z-index:8;pointer-events:none;display:block;will-change:transform}
.wz-micro-coach::before{content:'';position:absolute;right:8px;top:22px;width:124px;height:124px;border-radius:50%;background:radial-gradient(circle,rgba(239,68,68,.13) 0%,rgba(239,68,68,.045) 46%,transparent 72%);filter:blur(.2px);pointer-events:none}
.wz-micro-mascot{position:absolute;z-index:2;right:0;top:0;width:132px;height:132px;display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 14px 22px rgba(15,23,42,.13));pointer-events:auto;transition:transform .32s cubic-bezier(.22,1,.36,1),filter .32s cubic-bezier(.22,1,.36,1)}
.wz-micro-coach.idle .wz-micro-mascot{animation:wzMascotBreathe 3.2s ease-in-out infinite}
.wz-micro-coach.category-picked .wz-micro-mascot,
.wz-micro-coach.team-focus .wz-micro-mascot{transform:translateX(8px) translateY(-1px) scale(1.02);filter:drop-shadow(0 16px 24px rgba(239,68,68,.13))}
.wz-micro-coach.complete .wz-micro-mascot{animation:wzMascotPop .48s cubic-bezier(.34,1.56,.64,1)}
@keyframes wzMascotBreathe{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
@keyframes wzMascotPop{0%{transform:scale(.94)}55%{transform:scale(1.08) translateY(-4px)}100%{transform:scale(1)}}
.wz-micro-bubble{position:absolute;left:10px;top:150px;width:184px;padding:10px 11px;border-radius:14px 14px 14px 5px;background:#fff;border:1px solid rgba(239,68,68,.14);box-shadow:0 12px 24px rgba(15,23,42,.10);font-size:11px;font-weight:800;color:#0f172a;line-height:1.34;text-align:left;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.wz-micro-coach.warn .wz-micro-bubble{background:#fff7f7;color:#b91c1c;border-color:#fecaca}
.wz-micro-bubble::after{content:'';position:absolute;right:-6px;top:18px;width:12px;height:12px;background:inherit;border-right:1px solid rgba(239,68,68,.12);border-bottom:1px solid rgba(239,68,68,.12);transform:rotate(-45deg);border-radius:0 0 2px 0}

/* ─── Right summary panel ─── */
.wz-side-panel{grid-column:3;display:flex;flex-direction:column;gap:10px;background:linear-gradient(180deg,#f8fafc 0%,#eef2f7 100%);border-left:1px solid #e2e8f0;overflow:hidden;min-width:0;padding:16px 12px}
.wz-side-summary{display:flex;flex-direction:column;gap:10px;background:rgba(255,255,255,.92);border:1px solid #e2e8f0;border-radius:16px;padding:14px;box-shadow:0 16px 34px rgba(15,23,42,.08),inset 0 1px 0 rgba(255,255,255,.82);flex-shrink:0}
.wz-summary-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
.wz-summary-kicker{font-size:10px;font-weight:900;letter-spacing:.02em;color:#ef4444;margin-bottom:4px}
.wz-summary-title{font-size:15px;font-weight:850;color:#0f172a;letter-spacing:-.02em;line-height:1.25}
.wz-summary-pct{width:46px;height:46px;border-radius:15px;background:linear-gradient(180deg,#ef4444,#dc2626);box-shadow:0 8px 18px rgba(239,68,68,.22);display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px;font-weight:900;letter-spacing:-.02em;flex-shrink:0}
.wz-summary-track{height:5px;border-radius:999px;background:#e2e8f0;overflow:hidden}
.wz-summary-fill{height:100%;border-radius:999px;background:linear-gradient(90deg,#ef4444,#f97316);transition:width .6s cubic-bezier(.34,1.56,.64,1)}
.wz-summary-missing{padding:11px 12px;border-radius:13px;background:#fffaf5;border:1px solid #fed7aa;display:flex;flex-direction:column;gap:7px}
.wz-summary-missing span{font-size:10px;font-weight:900;letter-spacing:.02em;color:#c2410c}
.wz-summary-missing ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}
.wz-summary-missing li{position:relative;padding-left:14px;font-size:12px;font-weight:720;color:#0f172a;line-height:1.35}
.wz-summary-missing li::before{content:'';position:absolute;left:0;top:.62em;width:5px;height:5px;border-radius:999px;background:#fb923c;transform:translateY(-50%)}
.wz-summary-commit{padding:10px 11px;border-radius:13px;background:linear-gradient(180deg,#fff7f7,#fff);border:1px solid #fee2e2;display:flex;flex-direction:column;gap:3px}
.wz-summary-commit span{font-size:10px;font-weight:800;letter-spacing:.02em;color:#ef4444}
.wz-summary-commit strong{font-size:12.5px;color:#0f172a;line-height:1.35}
.wz-summary-list{display:flex;flex-direction:column;gap:7px}
.wz-summary-row{display:grid;grid-template-columns:18px minmax(42px,.38fr) minmax(0,1fr);align-items:center;gap:6px;border:1px solid #e8eef5;border-radius:11px;background:#fff;padding:6px 8px;min-width:0}
.wz-summary-row.done{border-color:#dcfce7;background:#fbfffd}
.wz-summary-row.missing{border-color:#fee2e2;background:#fffafa}
.wz-summary-status{width:18px;height:18px;border-radius:7px;display:flex;align-items:center;justify-content:center;background:#f1f5f9;color:#64748b;font-size:10px;font-weight:900}
.wz-summary-row.done .wz-summary-status{background:#dcfce7;color:#15803d}
.wz-summary-row.missing .wz-summary-status{background:#fee2e2;color:#b91c1c}
.wz-summary-label{font-size:9.5px;font-weight:900;letter-spacing:.02em;color:#94a3b8}
.wz-summary-value{font-size:11.5px;font-weight:750;color:#0f172a;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align:right}
.wz-summary-row.missing .wz-summary-value{color:#94a3b8}

.wz-body{grid-column:2;position:relative;z-index:1;height:100%;overflow-y:auto;padding:32px 28px 104px;scroll-behavior:smooth;background:transparent;min-width:0}
.wz-body[data-dir="next"]{animation:wzSlideNext .35s cubic-bezier(.22,1,.36,1)}
.wz-body[data-dir="prev"]{animation:wzSlidePrev .35s cubic-bezier(.22,1,.36,1)}
@keyframes wzSlideNext{from{opacity:0;transform:translateX(28px)}to{opacity:1;transform:none}}
@keyframes wzSlidePrev{from{opacity:0;transform:translateX(-28px)}to{opacity:1;transform:none}}
.wz-body::-webkit-scrollbar{width:4px}
.wz-body::-webkit-scrollbar-track{background:transparent}
.wz-body::-webkit-scrollbar-thumb{background:#e2e8f0;border-radius:100px}
/* Override blue focus rings → Markee red */
.wz-body *:focus-visible{outline:2px solid #EF3B3B;outline-offset:2px}
.wz-career-card:focus{outline:none}
.wz-career-card:focus-visible{outline:2px solid #EF3B3B;outline-offset:2px}
.wz-interest-pill:focus{outline:none}
.wz-interest-pill:focus-visible{outline:2px solid #EF3B3B;outline-offset:2px}

/* ─── Footer (lighter, less aggressive CTA) ─── */
.wz-footer{display:flex;align-items:center;justify-content:space-between;min-height:84px;padding:14px 32px;border-top:1px solid #e8ecf1;background:rgba(255,255,255,.92);backdrop-filter:blur(12px);flex-shrink:0;gap:12px;box-shadow:0 -4px 16px rgba(15,23,42,.04);z-index:40}
.wz-footer-center{flex:1;text-align:center}
.wz-footer-save{font-size:11px;color:#94a3b8;font-weight:650}
.wz-btn-back{padding:11px 22px;border-radius:12px;border:1px solid #e2e8f0;background:#fff;font-size:13px;font-weight:600;color:#64748b;cursor:pointer;transition:all .2s;white-space:nowrap}
.wz-btn-back:hover:not(:disabled){background:#f8fafc;color:#0f172a;border-color:#cbd5e1}
.wz-btn-back:disabled{opacity:.3;cursor:not-allowed}
.wz-btn-next{min-width:160px;height:48px;padding:0 28px;border-radius:12px;border:none;background:linear-gradient(180deg,#ef4444 0%,#e03131 100%);font-size:14px;font-weight:700;color:#fff;cursor:pointer;transition:transform .22s cubic-bezier(.22,1,.36,1),box-shadow .22s,background .22s;box-shadow:0 3px 10px rgba(239,68,68,.16),inset 0 1px 0 rgba(255,255,255,.16);white-space:nowrap;display:inline-flex;align-items:center;justify-content:center;gap:8px;letter-spacing:-.01em}
.wz-btn-next:disabled{opacity:.45;cursor:not-allowed;box-shadow:none;transform:none}
.wz-btn-next:hover{transform:translateY(-1px);box-shadow:0 7px 15px rgba(239,68,68,.22),inset 0 1px 0 rgba(255,255,255,.16)}
.wz-btn-next:hover:disabled{transform:none;box-shadow:none}
.wz-btn-arrow{font-size:16px;transition:transform .2s;line-height:1}
.wz-btn-next:hover .wz-btn-arrow{transform:translateX(3px)}
.wz-btn-submit{min-width:160px;height:48px;padding:0 28px;border-radius:12px;border:none;background:linear-gradient(180deg,#ef4444 0%,#e03131 100%);font-size:14px;font-weight:700;color:#fff;cursor:pointer;transition:transform .22s cubic-bezier(.22,1,.36,1),box-shadow .22s;box-shadow:0 3px 10px rgba(239,68,68,.16),inset 0 1px 0 rgba(255,255,255,.16);display:flex;align-items:center;justify-content:center;gap:8px;letter-spacing:-.01em}
.wz-btn-submit:disabled{opacity:.7;cursor:not-allowed}
.wz-btn-submit:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 8px 18px rgba(239,68,68,.28),inset 0 1px 0 rgba(255,255,255,.18)}
.wz-submit-wrap{display:flex;flex-direction:column;align-items:flex-end;gap:4px}
.wz-submit-err{font-size:11px;color:#ef4444;font-weight:600;max-width:240px;text-align:right}
.wz-spinner{display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:wzSpin .6s linear infinite}
@keyframes wzSpin{to{transform:rotate(360deg)}}

/* ─── Clean step intro ─── */
.wz-section-hero{display:grid;grid-template-columns:auto minmax(0,1fr);column-gap:12px;align-items:center;margin:0 0 24px;padding:2px 2px 18px;background:transparent;border-radius:0;border-bottom:1px solid #e2e8f0;position:relative;overflow:visible;min-width:0}
.wz-section-hero::before{content:'';position:absolute;left:0;bottom:-1px;width:60px;height:2px;border-radius:999px;background:linear-gradient(90deg,#ef4444,rgba(239,68,68,.18));pointer-events:none}
.wz-section-hero::after{display:none}
.wz-hero-badge{grid-column:1;grid-row:1;display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:999px;background:rgba(248,250,252,.86);border:1px solid #e2e8f0;font-size:10px;font-weight:900;color:#94a3b8;letter-spacing:.12em;margin:0;position:relative;z-index:1;white-space:nowrap;text-transform:uppercase}
.wz-section-title{font-family:'Be Vietnam Pro',var(--font-geist-sans),sans-serif;grid-column:2;grid-row:1;font-size:clamp(20px,2.05vw,24px);font-weight:700;color:#0f172a;letter-spacing:-.02em;margin:0;line-height:1.2;position:relative;z-index:1;min-width:0;overflow-wrap:anywhere;text-wrap:balance}
.wz-section-sub{grid-column:2;grid-row:2;font-size:clamp(12px,1.15vw,13px);color:#64748b;margin:4px 0 0;line-height:1.55;max-width:min(640px,100%);position:relative;z-index:1;min-width:0;overflow-wrap:break-word}

/* ─── Section cards ─ differentiated primary vs secondary ─── */
/* Secondary cards: subtle, light shadow */
.wz-section-card{position:relative;background:#fff;border:1px solid #e8ecf1;border-radius:16px;padding:22px 24px;margin-bottom:14px;overflow:hidden;transition:border-color .22s ease,box-shadow .22s ease,transform .22s ease}
.wz-section-card:hover{border-color:#cbd5e1;box-shadow:0 4px 14px rgba(15,23,42,.05)}
.wz-section-card:focus-within{border-color:#cbd5e1;box-shadow:0 6px 18px rgba(15,23,42,.07)}
/* Primary card: more visual weight, stronger left accent */
.wz-section-card.wz-section-main{background:#fff;border:1px solid #e2e8f0;box-shadow:0 6px 22px rgba(15,23,42,.07);padding:28px 32px;margin-bottom:24px;position:relative;overflow:hidden}
.wz-section-card.wz-section-main::before{content:'';position:absolute;left:0;top:0;bottom:0;width:4px;background:linear-gradient(180deg,#ef4444 0%,#fb7185 100%);opacity:.85}
.wz-section-card .wz-label-big{margin-bottom:8px}
.wz-section-card .wz-hint{margin-bottom:12px}
/* Completion indicator: small green dot top-right when input/textarea has content */
.wz-section-card:has(.wz-input.wz-input-ok)::after,
.wz-section-card:has(.wz-textarea.wz-input-ok)::after,
.wz-section-card:has(.wz-career-card.checked)::after,
.wz-section-card:has(.wz-interest-pill.checked)::after,
.wz-section-card:has(.wz-grid-check.checked)::after{content:'';position:absolute;top:18px;right:18px;width:8px;height:8px;border-radius:999px;background:#10b981;box-shadow:0 0 0 3px rgba(16,185,129,.16);animation:wzPopDot .3s cubic-bezier(.34,1.56,.64,1)}
@keyframes wzPopDot{0%{transform:scale(0)}100%{transform:scale(1)}}
[data-guide].wz-guide-active{border-color:#fecaca!important;box-shadow:0 0 0 2px rgba(239,68,68,.045),0 8px 22px rgba(15,23,42,.065)!important}
.wz-guide-active .wz-input:not(:focus):not(.wz-input-err),.wz-guide-active .wz-textarea:not(:focus):not(.wz-input-err){border-color:#fca5a5!important;box-shadow:0 0 0 3px rgba(239,68,68,.06)!important;background:#fffafa!important}
.wz-section-card.wz-guide-active:not(.wz-section-main)::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:linear-gradient(180deg,#ef4444,#fb7185);opacity:.7;border-radius:0}
.wz-section-card.wz-section-main.wz-guide-active::before{opacity:1;width:5px}
.wz-field-group.wz-guide-active{border-radius:14px}
.wz-review-hero.wz-guide-active{box-shadow:0 0 0 2px rgba(239,68,68,.14),0 8px 24px rgba(15,23,42,.10)!important}

/* ─── Step content layout ─── */
.wz-step-content{width:100%;font-family:'Be Vietnam Pro',var(--font-geist-sans),-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif}
.wz-field-group{margin-bottom:0}

/* Email — inside section card now */
.wz-email-row .wz-label{font-size:13px;color:#475569;margin-bottom:8px;font-weight:600}
.wz-email-row .wz-input{background:rgba(248,250,252,.58)}

/* Zone — main action area headline */
.wz-zone-title{font-size:22px;font-weight:760;color:#0f172a;margin:8px 0 6px;letter-spacing:-.03em}
.wz-zone-sub{font-size:13px;color:#94a3b8;margin:0 0 14px;line-height:1.5}
.wz-career-head{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;margin-bottom:16px;position:relative;z-index:1}
.wz-card-kicker{display:inline-flex;font-size:10px;font-weight:900;letter-spacing:.14em;text-transform:uppercase;color:#94a3b8}
.wz-career-head-badge{display:flex;flex-direction:column;align-items:center;justify-content:center;min-width:92px;padding:10px 12px;border-radius:14px;background:rgba(255,255,255,.76);border:1px solid #e2e8f0;color:#64748b;font-size:11px;font-weight:700;line-height:1.25;text-align:center}
.wz-career-head-badge span{font-size:22px;font-weight:900;color:#334155;letter-spacing:-.04em;line-height:1}
.wz-section-card.wz-category-main{padding:24px 28px;margin-bottom:14px;box-shadow:0 8px 22px rgba(15,23,42,.055);border-color:#e2e8f0}
.wz-section-card.wz-category-main::before{display:none}
.wz-section-card.wz-category-main.locked{padding:18px 28px;margin-bottom:14px}
.wz-section-card.wz-category-main.wz-guide-active{border-color:#e2e8f0!important;box-shadow:0 8px 22px rgba(15,23,42,.055)!important}
.wz-section-card.wz-category-main.locked .wz-choice-head{margin-bottom:10px}
.wz-choice-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:16px}
.wz-change-category-btn{display:inline-flex;align-items:center;justify-content:center;border:1px solid #fecaca;background:#fff7f7;color:#b91c1c;border-radius:999px;padding:9px 14px;font-size:12px;font-weight:800;cursor:pointer;transition:all .18s ease;white-space:nowrap}
.wz-change-category-btn:hover{background:#fee2e2;border-color:#fca5a5}
.wz-category-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;position:relative;z-index:1}
.wz-category-card{min-height:112px;display:grid;grid-template-columns:48px minmax(0,1fr) auto;grid-template-rows:auto auto;align-items:center;column-gap:12px;row-gap:8px;padding:16px;border-radius:16px;border:1px solid #dbe4ef;background:linear-gradient(180deg,#fff,#f8fafc);cursor:pointer;text-align:left;transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease,background .18s ease;position:relative;overflow:hidden}
.wz-category-card:hover{transform:translateY(-3px) scale(1.006);border-color:#fca5a5;box-shadow:0 16px 30px rgba(15,23,42,.11);background:#fff}
.wz-category-card.selected{transform:scale(1.01);border-color:#ef4444;background:linear-gradient(180deg,#fff4f4,#fff);box-shadow:0 0 0 3px rgba(239,68,68,.085),0 16px 28px rgba(239,68,68,.11)}
.wz-category-icon{grid-column:1;grid-row:1 / span 2;width:48px;height:48px;border-radius:14px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:11px;font-weight:900;letter-spacing:.04em;box-shadow:0 8px 18px rgba(15,23,42,.14);transition:transform .2s ease,box-shadow .2s ease}
.wz-category-icon svg{width:24px;height:24px;filter:drop-shadow(0 2px 3px rgba(15,23,42,.16))}
.wz-category-card:hover .wz-category-icon{transform:scale(1.05) rotate(-2deg);box-shadow:0 12px 22px rgba(15,23,42,.18)}
.wz-category-card.selected .wz-category-icon{box-shadow:0 12px 24px rgba(239,68,68,.18)}
.wz-category-copy{grid-column:2 / span 2;display:flex;flex-direction:column;gap:4px;min-width:0}
.wz-category-name{font-size:15px;font-weight:760;color:#0f172a;letter-spacing:-.02em}
.wz-category-desc{font-size:12px;color:#64748b;line-height:1.45}
.wz-category-meta{grid-column:2;justify-self:start;display:inline-flex;align-items:center;border-radius:999px;background:#f1f5f9;color:#64748b;padding:4px 9px;font-size:11px;font-weight:800}
.wz-category-action{grid-column:3;justify-self:end;display:inline-flex;align-items:center;justify-content:center;min-width:48px;height:26px;padding:0 9px;border-radius:999px;background:#fff;color:#64748b;border:1px solid #e2e8f0;font-size:11px;font-weight:800;transition:all .18s ease}
.wz-category-card.selected .wz-category-name{color:#b91c1c}
.wz-category-card.selected .wz-category-meta{background:#fee2e2;color:#b91c1c}
.wz-category-card.selected .wz-category-action{background:#ef4444;border-color:#ef4444;color:#fff}
.wz-category-picked{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:16px;border:1px solid #e2e8f0;background:#f8fafc}
.wz-category-picked div{display:flex;flex-direction:column;gap:1px;min-width:0;flex:1}
.wz-category-picked-label{font-size:10px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;color:#94a3b8}
.wz-category-picked strong{font-size:16px;color:#0f172a;line-height:1.25}
.wz-category-picked>span:last-child{font-size:12px;font-weight:800;color:#64748b;white-space:nowrap}
.wz-switch-note{margin-top:10px;border-radius:12px;background:#f8fafc;border:1px solid #e2e8f0;color:#64748b;padding:10px 12px;font-size:12px;font-weight:650}
.wz-team-reveal{position:relative;z-index:1}
.wz-section-card.wz-team-panel{padding:24px 28px;margin-bottom:24px;border-color:#e2e8f0;box-shadow:0 8px 20px rgba(15,23,42,.055)}

/* Generic labels */
.wz-label{display:block;font-size:13px;font-weight:600;color:#475569;margin-bottom:8px}
.wz-label-big{display:block;font-size:17px;font-weight:720;color:#0f172a;margin-bottom:6px;letter-spacing:-.02em}
.wz-req{color:#ef4444;font-weight:400;margin-left:2px}
.wz-hint{font-size:11.5px;color:#94a3b8;margin:-2px 0 10px;line-height:1.5}
.wz-field-footer{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-top:8px}
.wz-field-error{font-size:12px;color:#ef4444;font-weight:600;margin-top:6px;animation:wzShake .3s ease}
@keyframes wzShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
.wz-divider{height:1px;background:linear-gradient(90deg,transparent,#e2e8f0,transparent);margin:4px 0 8px}

/* ─── Inputs — RED focus only, no green ─── */
.wz-input{width:100%;padding:14px 16px;border:1px solid #cfd9e6;border-radius:14px;font-size:14px;color:#334155;outline:none;background:#f3f6fa;font-family:inherit;transition:border-color .28s ease,box-shadow .28s ease,background .28s ease,color .28s ease;box-sizing:border-box;box-shadow:inset 0 1px 2px rgba(15,23,42,.035)}
.wz-input::placeholder{color:#94a3b8}
.wz-input:hover{background:#f8fafc;border-color:#b8c5d4}
.wz-input:focus{color:#0f172a;background:#fff;border-color:#f87171;box-shadow:0 0 0 4px rgba(239,68,68,.10),0 8px 20px rgba(15,23,42,.035)}
.wz-input-err{border-color:#fca5a5!important;background:#fff7f7!important}
.wz-input-ok{border-color:#cfd9e6!important}
.wz-input-ok:focus{background:#fff!important;border-color:#f87171!important;box-shadow:0 0 0 4px rgba(239,68,68,.10),0 8px 20px rgba(15,23,42,.035)!important}

.wz-textarea{width:100%;padding:14px 16px;border:1px solid #cfd9e6;border-radius:14px;font-size:14px;color:#334155;outline:none;resize:vertical;min-height:128px;font-family:inherit;background:#f3f6fa;line-height:1.7;transition:border-color .28s ease,box-shadow .28s ease,background .28s ease,color .28s ease;box-sizing:border-box;box-shadow:inset 0 1px 2px rgba(15,23,42,.035)}
.wz-textarea::placeholder{color:#b0bad0;font-size:12.5px}
.wz-textarea:hover{background:#f8fafc;border-color:#b8c5d4}
.wz-textarea:focus{color:#0f172a;background:#fff;border-color:#f87171;box-shadow:0 0 0 4px rgba(239,68,68,.10),0 8px 20px rgba(15,23,42,.035)}
.wz-textarea.wz-input-err{border-color:#fca5a5!important;background:#fff7f7!important}
.wz-textarea.wz-input-ok{border-color:#cfd9e6!important}
.wz-textarea.wz-input-ok:focus{background:#fff!important;border-color:#f87171!important;box-shadow:0 0 0 4px rgba(239,68,68,.10),0 8px 20px rgba(15,23,42,.035)!important}
.wz-writing-prompts{display:flex;flex-wrap:wrap;gap:7px;margin:0 0 10px}
.wz-writing-prompts span{display:inline-flex;align-items:center;border:1px solid #e8eef5;background:#f8fafc;color:#94a3b8;border-radius:999px;padding:5px 9px;font-size:10.5px;font-weight:600;line-height:1.2}

/* wz-reveal uses CSS grid trick: animating rows 0→1fr avoids the
   max-height-to-huge-value problem (no mid-transition speed spike). */
.wz-reveal{display:grid;grid-template-rows:0fr;opacity:0;transition:grid-template-rows .55s cubic-bezier(.4,0,.2,1),opacity .4s ease;pointer-events:none}
.wz-reveal>*{overflow:hidden;min-height:0}
.wz-reveal.show{grid-template-rows:1fr;opacity:1;pointer-events:auto}

/* ─── Filter chips (discovery, not dashboard filters) ─── */
.wz-career-guide{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:12px 14px;border-radius:14px;background:#f3f6fa;border:1px solid #dbe4ef;margin-bottom:14px;position:relative;z-index:1}
.wz-career-guide-kicker{flex-shrink:0;font-size:10px;font-weight:900;letter-spacing:.13em;text-transform:uppercase;color:#94a3b8}
.wz-career-guide-text{font-size:12px;color:#64748b;line-height:1.45;text-align:right}
.wz-filter-tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;position:relative;z-index:1}
.wz-filter-tab{display:inline-flex;align-items:center;gap:7px;padding:8px 14px;border-radius:100px;border:1px solid #e2e8f0;background:#fff;font-size:12px;font-weight:500;color:#64748b;cursor:pointer;transition:all .2s}
.wz-filter-tab:hover{background:#f8fafc;color:#0f172a;border-color:#cbd5e1}
.wz-filter-tab.active{background:#fff1f2;border-color:#fecaca;color:#b91c1c;font-weight:700;box-shadow:none}
.wz-filter-count{display:inline-flex;align-items:center;justify-content:center;min-width:20px;height:20px;padding:0 6px;border-radius:999px;background:#f1f5f9;color:#64748b;font-size:10px;font-weight:800}
.wz-filter-tab.active .wz-filter-count{background:#fee2e2;color:#b91c1c}
.wz-selected-summary{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 12px;border-radius:12px;background:#f3f6fa;border:1px dashed #b8c5d4;color:#64748b;font-size:12px;line-height:1.45;margin-bottom:14px;position:relative;z-index:1}
.wz-selected-summary.over{background:#fffbeb;border-color:#fde68a;color:#92400e}
.wz-selected-meter{flex-shrink:0;font-weight:800;color:#0f172a}
.wz-selected-summary.over .wz-selected-meter{color:#b45309}

/* ─── Career cards — SaaS horizontal (icon · label · checkbox) ─── */
.wz-career-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;position:relative;z-index:1}
.wz-career-card{height:76px;display:flex;flex-direction:row;align-items:center;gap:14px;padding:14px 16px;border-radius:16px;border:1px solid #dbe4ef;background:#f8fafc;cursor:pointer;text-align:left;transition:transform .16s ease,border-color .18s ease,box-shadow .18s ease,background .18s ease;width:100%;position:relative;overflow:hidden;box-shadow:inset 0 1px 0 rgba(255,255,255,.84)}
.wz-career-card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:#ef4444;opacity:0;transition:opacity .2s}
.wz-career-card:hover{border-color:#b8c5d4;background:#fff;box-shadow:0 12px 24px rgba(15,23,42,.08);transform:translateY(-1px)}
.wz-career-card.checked{border-color:#fecaca;background:linear-gradient(180deg,#fff8f8 0%,#fff 100%);box-shadow:0 0 0 2px rgba(239,68,68,.055),0 12px 22px rgba(239,68,68,.07)}
.wz-career-card.checked::before{opacity:.5}
.wz-cc-top{display:none}
.wz-cc-icon{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0;box-shadow:0 4px 12px rgba(15,23,42,.12);transition:transform .22s,box-shadow .22s}
.wz-cc-icon svg{width:22px;height:22px;filter:drop-shadow(0 2px 3px rgba(15,23,42,.14))}
.wz-career-card:hover .wz-cc-icon{transform:scale(1.06);box-shadow:0 6px 16px rgba(15,23,42,.16)}
.wz-career-card.checked .wz-cc-icon{box-shadow:0 4px 14px rgba(0,0,0,.2)}
.wz-cc-info{display:flex;flex-direction:column;flex:1;min-width:0}
.wz-cc-label{display:block;font-size:13px;font-weight:700;color:#0f172a;letter-spacing:-.02em;line-height:1.3;margin-bottom:2px}
.wz-career-card.checked .wz-cc-label{color:#991b1b}
.wz-cc-sub{display:block;font-size:11px;color:#94a3b8;line-height:1.4}
.wz-cc-check{width:22px;height:22px;border-radius:6px;border:2px solid #e2e8f0;background:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:transparent;flex-shrink:0;transition:all .2s}
.wz-career-card.checked .wz-cc-check{background:#ef4444;border-color:#ef4444;color:#fff;animation:wzPop .28s cubic-bezier(.34,1.56,.64,1)}
@keyframes wzPop{0%{transform:scale(.4)}100%{transform:scale(1)}}

/* Selected tags strip */
.wz-selected-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:14px;align-items:center}
.wz-selected-label{font-size:11px;color:#94a3b8;font-weight:600;letter-spacing:.02em}
.wz-selected-tag{display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:100px;background:#fff1f2;border:1px solid #fecaca;font-size:11px;font-weight:600;color:#b91c1c}
.wz-selected-tag button{background:none;border:none;cursor:pointer;color:#ef4444;font-size:14px;line-height:1;padding:0 0 0 2px;font-weight:700}
.wz-step-encourage{margin:12px 0 2px;padding:10px 12px;border-radius:12px;border:1px solid #e8eef5;background:#fbfcfe;color:#475569;font-size:12.5px;font-weight:650;line-height:1.55}

/* ─── Interest pills ─ stronger contrast for selected state ─── */
.wz-interest-grid{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:4px}
.wz-interest-pill{display:flex;align-items:center;min-height:44px;padding:9px 16px;border-radius:100px;border:1px solid #e2e8f0;background:#fff;font-size:13px;font-weight:500;color:#475569;cursor:pointer;transition:all .18s cubic-bezier(.22,1,.36,1)}
.wz-interest-pill:hover{border-color:#94a3b8;background:#f8fafc;color:#0f172a;transform:translateY(-1px)}
.wz-interest-pill.checked{border-color:#ef4444;background:#fef2f2;color:#b91c1c;font-weight:700;box-shadow:0 2px 8px rgba(239,68,68,.12)}
.wz-interest-other{display:grid;gap:7px;max-width:560px;margin-top:12px}
.wz-interest-other .wz-label{margin:0}
.wz-interest-other .wz-input{min-height:44px;background:#fff}

/* ─── Reflection cards (Step 2) ─── */
.wz-reflection-card{position:relative;margin-bottom:14px;padding:22px 24px;border-radius:16px;border:1px solid #e8ecf1;background:#fff;overflow:hidden;transition:border-color .22s ease,box-shadow .22s ease,transform .22s ease}
.wz-reflection-card:hover{border-color:#cbd5e1;box-shadow:0 4px 14px rgba(15,23,42,.05)}
.wz-reflection-card:focus-within{border-color:#cbd5e1;box-shadow:0 6px 18px rgba(15,23,42,.07)}
.wz-reflection-card.wz-guide-active::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:linear-gradient(180deg,#ef4444,#fb7185);opacity:.7}
.wz-reflection-card:has(.wz-textarea.wz-input-ok)::after,
.wz-reflection-card:has(.wz-input.wz-input-ok)::after,
.wz-reflection-card:has(.wz-option-card.checked)::after{content:'';position:absolute;top:18px;right:18px;width:8px;height:8px;border-radius:999px;background:#10b981;box-shadow:0 0 0 3px rgba(16,185,129,.16)}
.wz-rc-header{margin-bottom:12px}
.wz-rc-title{font-size:15px;font-weight:700;color:#0f172a;margin:0 0 3px;letter-spacing:-.01em}
.wz-rc-hint{font-size:13px;color:#64748b;margin:0;line-height:1.5}

/* ─── Option cards ─── */
.wz-option-cards{display:flex;flex-direction:column;gap:8px;margin-top:4px}
.wz-option-card{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 18px;border-radius:12px;border:1px solid #e2e8f0;background:#fff;font-size:13px;color:#475569;cursor:pointer;transition:all .2s cubic-bezier(.22,1,.36,1);text-align:left;width:100%}
.wz-option-card:hover{border-color:#94a3b8;background:#f8fafc;transform:translateX(2px);box-shadow:0 2px 8px rgba(15,23,42,.04)}
.wz-option-card.checked{border-color:#ef4444;background:#fef2f2;transform:translateX(2px);box-shadow:0 4px 14px rgba(239,68,68,.12)}
.wz-oc-text{flex:1;font-weight:500;font-size:13px;text-align:left;line-height:1.5;padding-left:2px}
.wz-option-card.checked .wz-oc-text{font-weight:700;color:#991b1b}
.wz-oc-check{width:22px;height:22px;border-radius:7px;border:1.5px solid #cbd5e1;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;transition:all .2s;background:#fff}
.wz-oc-check.checked{background:#ef4444;border-color:#ef4444;animation:wzPop .28s cubic-bezier(.34,1.56,.64,1)}

/* ─── Work preference cards ─── */
.wz-work-card-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.wz-work-card{border:1px solid #dbe4ef;border-radius:16px;background:linear-gradient(180deg,#fff,#f8fafc);padding:14px;transition:border-color .18s ease,box-shadow .18s ease,transform .18s ease,background .18s ease}
.wz-work-card:hover{border-color:#cbd5e1;box-shadow:0 10px 22px rgba(15,23,42,.07);transform:translateY(-1px);background:#fff}
.wz-work-card.checked{border-color:#fecaca;background:linear-gradient(180deg,#fff8f8,#fff);box-shadow:0 0 0 2px rgba(239,68,68,.045)}
.wz-work-card-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px}
.wz-work-card-head h4{font-size:14px;font-weight:760;color:#0f172a;margin:0 0 4px;letter-spacing:-.01em}
.wz-work-card-head p{font-size:11.5px;color:#64748b;line-height:1.45;margin:0}
.wz-work-card-head>span{width:26px;height:26px;border-radius:9px;background:#f1f5f9;color:#64748b;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:900;flex-shrink:0}
.wz-work-card.checked .wz-work-card-head>span{background:#ef4444;color:#fff}
.wz-work-location-pills{display:flex;flex-wrap:wrap;gap:7px}
.wz-work-location-pill{display:inline-flex;align-items:center;gap:5px;min-height:42px;border-radius:999px;border:1px solid #dbe4ef;background:#fff;color:#475569;padding:0 12px;font-size:12px;font-weight:650;cursor:pointer;transition:all .18s ease}
.wz-work-location-pill:hover{border-color:#fca5a5;background:#fff7f7;color:#b91c1c;transform:translateY(-1px)}
.wz-work-location-pill.checked{border-color:#ef4444;background:#ef4444;color:#fff;box-shadow:0 5px 12px rgba(239,68,68,.16)}
.wz-work-location-pill span{font-size:11px;font-weight:900}

/* ─── Work preference matrix (legacy fallback styles) ─── */
.wz-grid-table{border:1px solid #dbe4ef;border-radius:16px;overflow:hidden;background:#fff;box-shadow:inset 0 1px 0 rgba(255,255,255,.88)}
.wz-grid-header{display:grid;grid-template-columns:120px repeat(3,1fr);background:#eef3f8;border-bottom:1px solid #dbe4ef}
.wz-grid-corner{padding:12px}
.wz-grid-col-head{padding:12px 6px;text-align:center;font-size:12px;font-weight:600;color:#64748b}
.wz-grid-row{display:grid;grid-template-columns:120px repeat(3,1fr);border-bottom:1px solid #e8eef5;transition:background .15s}
.wz-grid-row:last-child{border-bottom:none}
.wz-grid-row:hover{background:#fafbfc}
.wz-grid-row-label{padding:12px 16px;font-size:13px;font-weight:600;color:#475569;display:flex;align-items:center}
.wz-grid-cell{display:flex;align-items:center;justify-content:center;padding:10px}
.wz-grid-check{width:28px;height:28px;border-radius:9px;border:1.5px solid #e2e8f0;background:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s;font-size:12px;color:#fff}
.wz-grid-check:hover{border-color:#fecaca;background:#fff1f2}
.wz-grid-check.checked{background:#ef4444;border-color:#ef4444;animation:wzPop .22s cubic-bezier(.34,1.56,.64,1)}

/* ─── Step 3 form ─── */
.wz-info-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.wz-info-grid>.wz-reveal{grid-column:1/-1}
.wz-info-card{position:relative;padding:18px;border-radius:14px;border:1px solid #e8ecf1;background:#fff;overflow:hidden;transition:border-color .22s ease,box-shadow .22s ease}
.wz-info-card:hover{border-color:#cbd5e1;box-shadow:0 4px 12px rgba(15,23,42,.05)}
.wz-info-card:focus-within{border-color:#cbd5e1;box-shadow:0 6px 16px rgba(15,23,42,.07)}
.wz-info-card:has(.wz-input.wz-input-ok)::after{content:'';position:absolute;top:14px;right:14px;width:7px;height:7px;border-radius:999px;background:#10b981;box-shadow:0 0 0 3px rgba(16,185,129,.16)}
.wz-info-card.full{grid-column:1/-1}
.wz-contact-options{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;position:relative;z-index:1}
.wz-check-pill{display:inline-flex;align-items:center;gap:8px;padding:9px 12px;border-radius:999px;border:1px solid #dbe4ef;background:#f8fafc;color:#475569;font-size:12px;font-weight:700;cursor:pointer;transition:all .18s ease;user-select:none}
.wz-check-pill:hover{background:#fff;border-color:#cbd5e1;color:#0f172a;box-shadow:0 4px 12px rgba(15,23,42,.05)}
.wz-check-pill input{position:absolute;opacity:0;pointer-events:none}
.wz-check-ui{width:18px;height:18px;border-radius:6px;border:1.5px solid #cbd5e1;background:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .18s ease}
.wz-check-ui::after{content:'';width:8px;height:5px;border-left:2px solid #fff;border-bottom:2px solid #fff;transform:rotate(-45deg) translate(1px,-1px);opacity:0}
.wz-check-pill input:checked+.wz-check-ui{background:#ef4444;border-color:#ef4444;box-shadow:0 0 0 3px rgba(239,68,68,.10)}
.wz-check-pill input:checked+.wz-check-ui::after{opacity:1}
.wz-check-pill:has(input:checked){background:#fff7f7;border-color:#fecaca;color:#b91c1c}

/* ─── Review (Step 4) ─── */
.wz-review-hero{display:flex;align-items:center;gap:18px;padding:22px;margin-bottom:24px;background:linear-gradient(135deg,#0f172a,#1e293b);border-radius:16px;color:#fff;position:relative;overflow:hidden}
.wz-review-hero::before{content:'';position:absolute;top:-50%;right:-10%;width:200px;height:200px;background:radial-gradient(circle,rgba(239,68,68,.12),transparent 70%);pointer-events:none}
.wz-review-hero.wz-guide-active{background:linear-gradient(135deg,#0f172a,#1e293b)!important;border-color:rgba(239,68,68,.45)!important;box-shadow:0 0 0 4px rgba(239,68,68,.08),0 20px 48px rgba(15,23,42,.14)!important}
.wz-review-hero.wz-guide-active::before{background:radial-gradient(circle,rgba(239,68,68,.18),transparent 70%)}
.wz-rh-avatar{width:52px;height:52px;border-radius:13px;background:linear-gradient(135deg,#ef4444,#dc2626);display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:800;flex-shrink:0;box-shadow:0 4px 14px rgba(239,68,68,.4);position:relative;z-index:1}
.wz-rh-info{flex:1;min-width:0;position:relative;z-index:1}
.wz-rh-name{font-size:17px;font-weight:700;letter-spacing:-.01em}
.wz-rh-detail{font-size:13px;color:rgba(255,255,255,.5);margin-top:2px}
.wz-rh-tags{display:flex;flex-wrap:wrap;gap:5px;margin-top:8px}
.wz-rh-tag{padding:3px 10px;border-radius:100px;background:rgba(239,68,68,.18);border:1px solid rgba(239,68,68,.3);font-size:11px;font-weight:600;color:#fca5a5}
.wz-review-card{border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;margin-bottom:12px;background:#fff;transition:all .2s}
.wz-review-card:hover{border-color:#cbd5e1;box-shadow:0 4px 14px rgba(0,0,0,.05)}
.wz-review-card.has-empty{border-color:#fde68a;background:#fffbeb}
.wz-rc-head{display:flex;align-items:center;justify-content:space-between;padding:12px 18px;background:#f8fafc;border-bottom:1px solid #f1f5f9}
.wz-rc-head-title{font-size:13px;font-weight:700;color:#0f172a;letter-spacing:-.01em}
.wz-rc-edit-btn{min-height:40px;padding:8px 14px;border-radius:10px;border:1px solid #e2e8f0;background:#fff;font-size:12px;font-weight:700;color:#64748b;cursor:pointer;transition:all .18s}
.wz-rc-edit-btn:hover{background:#fef2f2;border-color:#fca5a5;color:#dc2626}
.wz-rc-body{padding:14px 18px}
.wz-rv-row{display:flex;gap:12px;padding:7px 0;border-bottom:1px solid #f8fafc;font-size:13px}
.wz-rv-row:last-child{border-bottom:none}
.wz-rv-label{min-width:130px;flex-shrink:0;font-weight:600;color:#94a3b8;font-size:12px}
.wz-rv-value{color:#0f172a;line-height:1.6;word-break:break-word}
.wz-rv-empty-note{font-size:12px;color:#b45309;font-weight:600;padding:6px 12px;border-radius:8px;background:#fef3c7;border:1px solid #fde68a;margin-top:8px;display:inline-block}
.wz-submit-notice{padding:14px 18px;border-radius:12px;background:#f8fafc;border:1px solid #e2e8f0;font-size:13px;color:#64748b;margin-top:8px;line-height:1.5}

/* ─── Success Screen ─── */
.wz-success-_legacy{}
.wz-success-marquee{display:none}
.wz-success-marquee span{display:inline-block;white-space:nowrap;font-size:11px;font-weight:800;color:#fff;letter-spacing:.06em;text-transform:uppercase;animation:wzMarquee 26s linear infinite;flex-shrink:0}
@keyframes wzMarquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes wzRotateSlow{to{transform:rotate(360deg)}}
@keyframes wzFadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}

/* ── Compact Hero ── */
.wz-sc-hero{display:flex;flex-direction:column;align-items:center;padding:14px 24px 2px;width:100%;text-align:center}
.wz-sc-hero-mascot{width:66px;height:66px;margin-bottom:6px;animation:wzBounceIn .6s cubic-bezier(.34,1.56,.64,1);flex-shrink:0}
.wz-success-video{width:100%;height:100%;object-fit:contain}
.wz-sc-hero-title{font-family:'Be Vietnam Pro',var(--font-geist-sans),sans-serif;font-size:20px;font-weight:800;color:#0f172a;margin:0 0 5px;letter-spacing:-.03em}
.wz-sc-hero-sub{font-size:13px;color:#475569;margin:0;line-height:1.6;max-width:400px}
/* ── Facebook Showcase Card ── */
.wz-fbs-wrap{width:100%;max-width:660px;margin:12px auto 0;padding:0 24px 16px}
.wz-fbs{display:flex;flex-direction:column;background:#fff;border:1px solid #dde3ef;border-radius:22px;overflow:hidden;box-shadow:0 8px 40px rgba(15,23,42,.10),0 1px 0 rgba(255,255,255,.8) inset;text-decoration:none;color:inherit;transition:box-shadow .26s ease,transform .26s cubic-bezier(.34,1.56,.64,1);text-align:left}
.wz-fbs:hover{box-shadow:0 20px 56px rgba(15,23,42,.14);transform:translateY(-4px)}
/* Cover */
.wz-fbs-cover{height:128px;position:relative;overflow:hidden;background:#f8fafc;background-image:linear-gradient(rgba(15,23,42,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(15,23,42,.07) 1px,transparent 1px);background-size:28px 28px;flex-shrink:0}
.wz-fbs-cover-bg{position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,rgba(241,245,249,.7) 100%)}
.wz-fbs-cover-mascot{position:absolute;right:14px;bottom:0;height:116px;width:auto;object-fit:contain;filter:drop-shadow(-4px 0 16px rgba(10,32,64,.45))}
.wz-fbs-cover-text{position:absolute;bottom:16px;left:18px;font-family:'Be Vietnam Pro',var(--font-geist-sans),sans-serif;font-size:10px;font-weight:800;color:rgba(15,23,42,.35);letter-spacing:.12em;text-transform:uppercase}
/* Profile row — avatar overlaps cover bottom */
.wz-fbs-profile{display:flex;align-items:center;gap:8px;padding:0 14px;margin-top:-26px;position:relative;z-index:2}
.wz-fbs-avatar{width:68px;height:68px;border-radius:16px;border:3px solid #fff;box-shadow:0 4px 16px rgba(15,23,42,.18);object-fit:cover;background:#fff;flex-shrink:0;display:block}
.wz-fbs-avatar-fallback{display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#ef4444,#e11d48);color:#fff;font-size:31px;font-weight:900;font-family:'Be Vietnam Pro',var(--font-geist-sans),sans-serif;line-height:1}
.wz-fbs-page-detail{flex:1;min-width:0}
.wz-fbs-follow-pill{flex-shrink:0;background:#1877f2;color:#fff;font-size:12px;font-weight:700;padding:6px 14px;border-radius:8px;white-space:nowrap;margin-left:auto}
.wz-fbs-page-name{font-size:16px;font-weight:800;color:#0f172a;line-height:1.2;letter-spacing:-.02em}
.wz-fbs-page-meta{font-size:10.5px;color:#64748b;margin-top:2px}
/* Body */
.wz-fbs-body{padding:12px 16px 16px;display:flex;flex-direction:column;gap:9px}
.wz-fbs-heading{font-family:'Be Vietnam Pro',var(--font-geist-sans),sans-serif;font-size:16px;font-weight:800;color:#0f172a;margin:0;letter-spacing:-.02em;line-height:1.3}
.wz-fbs-sub{font-size:13px;color:#475569;margin:0;line-height:1.65}
.wz-fbs-benefits{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:6px}
.wz-fbs-benefits li{display:flex;align-items:center;gap:8px;font-size:13px;color:#1e293b;font-weight:600}
.wz-fbs-benefits li::before{content:'✓';display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:50%;background:#ecfdf5;color:#059669;font-weight:900;font-size:11px;flex-shrink:0}
.wz-fbs-invite{background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:8px 12px;font-size:11px;color:#78350f;line-height:1.5}
.wz-fbs-proof{display:flex;align-items:center;gap:8px;font-size:12px;color:#64748b;font-weight:600}
.wz-fbs-proof-dot{color:#cbd5e1}
.wz-fbs-cta{background:linear-gradient(180deg,#1877f2 0%,#1565c0 100%);color:#fff;font-size:14px;font-weight:700;padding:13px 20px;border-radius:12px;text-align:center;letter-spacing:-.01em;box-shadow:0 4px 18px rgba(24,119,242,.35);transition:opacity .2s ease,box-shadow .2s ease}
.wz-fbs:hover .wz-fbs-cta{opacity:.92;box-shadow:0 6px 24px rgba(24,119,242,.44)}
/* community hub hidden */
.wz-community-hub{display:none}

/* What Happens Next */
.wz-success-next{width:100%;max-width:660px;margin:0 auto;padding:10px 24px 6px}
.wz-next-heading{font-family:'Be Vietnam Pro',var(--font-geist-sans),sans-serif;font-size:13px;font-weight:800;color:#0f172a;letter-spacing:-.01em;margin:0 0 8px;text-align:center}
.wz-next-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.wz-next-step{display:flex;flex-direction:column;gap:5px;background:#fff;border:1px solid #edf2f7;border-radius:14px;padding:12px 13px}
.wz-ns-track{display:flex;align-items:center;flex-shrink:0;margin-bottom:2px}
.wz-ns-num{width:24px;height:24px;border-radius:50%;background:linear-gradient(135deg,#ef4444,#fb7185);color:#fff;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.wz-ns-line{display:none}
.wz-ns-content{text-align:left}
.wz-ns-title{font-size:11.5px;font-weight:700;color:#0f172a;margin-bottom:2px;line-height:1.35}
.wz-ns-desc{font-size:10.5px;color:#64748b;line-height:1.5}

/* Footer */
.wz-success-footer{padding:10px 20px 26px;display:flex;justify-content:center}
.wz-btn-close-suc{display:inline-flex;align-items:center;gap:5px;padding:11px 40px;border-radius:12px;border:none;background:linear-gradient(180deg,#ef4444 0%,#e03131 100%);font-size:13px;font-weight:700;color:#fff;cursor:pointer;transition:opacity .18s,box-shadow .18s,transform .18s;font-family:inherit;text-decoration:none;box-shadow:0 4px 14px rgba(239,68,68,.28)}
.wz-btn-close-suc:hover{opacity:.9;box-shadow:0 6px 20px rgba(239,68,68,.36);transform:translateY(-1px)}

/* ─── Calm premium pass: less red, less chrome, more breathing room ─── */
.wz-side-panel{background:linear-gradient(180deg,#fbfcfe 0%,#f3f6fa 100%);padding:14px 11px}
.wz-side-summary{gap:9px;border-color:#e8eef5;border-radius:15px;padding:13px;box-shadow:0 12px 26px rgba(15,23,42,.055),inset 0 1px 0 rgba(255,255,255,.85)}
.wz-summary-kicker{color:#ef4444;font-size:9.5px}
.wz-summary-title{font-size:14.5px;font-weight:780}
.wz-summary-pct{width:42px;height:42px;border-radius:14px;box-shadow:0 8px 16px rgba(239,68,68,.16)}
.wz-summary-track{height:4px;background:#e8eef5}
.wz-summary-fill{background:linear-gradient(90deg,#ef4444,#fb7185);box-shadow:none}
.wz-summary-commit{background:#fff;border-color:#e8eef5;padding:11px 12px;box-shadow:inset 3px 0 0 rgba(239,68,68,.20)}
.wz-summary-commit span{color:#94a3b8;font-weight:850}
.wz-summary-commit strong{font-size:13px;font-weight:800}
.wz-summary-list{gap:6px}
.wz-summary-row{border-color:#edf2f7;background:#fff;padding:6px 7px}
.wz-summary-row.done{border-color:#edf2f7;background:#fff}
.wz-summary-row.missing{border-color:#edf2f7;background:#fff}
.wz-summary-status{background:#f3f6fa;color:#94a3b8}
.wz-summary-row.done .wz-summary-status{background:#ecfdf5;color:#059669}
.wz-summary-row.missing .wz-summary-status{background:#fff7ed;color:#f97316}
.wz-body{padding:28px 26px 96px}
.wz-section-hero{margin-bottom:20px;padding-bottom:15px}
.wz-section-hero::before{background:linear-gradient(90deg,#cbd5e1,rgba(203,213,225,.18))}
.wz-section-card{border-color:#edf2f7;padding:19px 22px;margin-bottom:12px;box-shadow:none}
.wz-section-card:hover{border-color:#dbe4ef;box-shadow:0 3px 12px rgba(15,23,42,.035)}
.wz-section-card:focus-within{border-color:#d8e2ed;box-shadow:0 6px 16px rgba(15,23,42,.045)}
.wz-section-card.wz-section-main{border-color:#e8eef5;padding:24px 28px;margin-bottom:20px;box-shadow:0 6px 18px rgba(15,23,42,.045)}
.wz-section-card.wz-section-main::before{background:#e8eef5;opacity:1;width:3px}
[data-guide].wz-guide-active{border-color:#dbe4ef!important;box-shadow:0 6px 18px rgba(15,23,42,.04)!important}
.wz-section-card.wz-guide-active:not(.wz-section-main)::before{background:#e2e8f0;opacity:.9;width:2px}
.wz-section-card.wz-section-main.wz-guide-active::before{width:3px;opacity:1}
.wz-review-hero.wz-guide-active{box-shadow:0 10px 26px rgba(15,23,42,.12)!important}
.wz-input,.wz-textarea{border-color:#d7e0eb;background:#f7f9fc;box-shadow:inset 0 1px 1px rgba(15,23,42,.025)}
.wz-input:hover,.wz-textarea:hover{border-color:#c7d3e0;background:#fafbfc}
.wz-input:focus,.wz-textarea:focus{border-color:#b8c5d4;box-shadow:0 0 0 4px rgba(148,163,184,.12),0 8px 18px rgba(15,23,42,.03)}
.wz-input-ok:focus,.wz-textarea.wz-input-ok:focus{border-color:#b8c5d4!important;box-shadow:0 0 0 4px rgba(148,163,184,.12),0 8px 18px rgba(15,23,42,.03)!important}
.wz-body *:focus-visible,
.wz-career-card:focus-visible,
.wz-interest-pill:focus-visible{outline-color:#cbd5e1}
.wz-textarea{height:92px;min-height:92px;line-height:1.62;overflow:auto;transition:height .32s cubic-bezier(.22,1,.36,1),border-color .24s,box-shadow .24s,background .24s}
.wz-textarea:focus{height:150px}
.wz-textarea.wz-input-ok:not(:focus){height:110px}
.wz-writing-prompts{max-height:0;opacity:0;overflow:hidden;margin:0;transition:max-height .28s ease,opacity .22s ease,margin .22s ease}
.wz-section-card:focus-within .wz-writing-prompts,
.wz-reflection-card:focus-within .wz-writing-prompts{max-height:72px;opacity:1;margin:0 0 10px}
.wz-label-big{font-size:14.5px;font-weight:680}
.wz-zone-title{font-size:20px;font-weight:720}
.wz-career-head{margin-bottom:14px}
.wz-section-card.wz-category-main{padding:22px 26px;box-shadow:0 5px 16px rgba(15,23,42,.04)}
.wz-section-card.wz-category-main.wz-guide-active{box-shadow:0 5px 16px rgba(15,23,42,.04)!important}
.wz-section-card.wz-team-panel{padding:22px 26px;margin-bottom:20px;box-shadow:0 5px 16px rgba(15,23,42,.04)}
.wz-category-card{border-color:#e1e8f0;box-shadow:none}
.wz-category-card:hover{border-color:#d2ddea;box-shadow:0 12px 24px rgba(15,23,42,.07)}
.wz-category-card.selected{border-color:#ef4444;box-shadow:0 0 0 3px rgba(239,68,68,.07),0 12px 24px rgba(239,68,68,.08)}
.wz-career-card{height:72px;border-color:#e1e8f0;background:#fbfcfe}
.wz-career-card:hover{border-color:#cbd5e1;box-shadow:0 8px 18px rgba(15,23,42,.055)}
.wz-career-card.checked{box-shadow:0 0 0 2px rgba(239,68,68,.045),0 8px 18px rgba(239,68,68,.055)}
.wz-selected-summary{background:#f8fafc;border-color:#d7e0eb}
.wz-interest-pill.checked,.wz-option-card.checked{box-shadow:0 2px 8px rgba(239,68,68,.08)}
.wz-work-card{border-color:#e1e8f0;background:#fbfcfe}
.wz-work-card:hover{box-shadow:0 8px 18px rgba(15,23,42,.045)}
.wz-work-card.checked{box-shadow:0 0 0 2px rgba(239,68,68,.04)}
.wz-work-card-head>span{background:#eef3f8}
.wz-btn-back{border:none;background:transparent;padding:8px 10px;color:#64748b;font-size:12.5px;font-weight:650}
.wz-btn-back:hover:not(:disabled){background:#f8fafc;color:#334155;border-color:transparent}
.wz-footer{min-height:76px;padding:12px 32px;box-shadow:0 -2px 12px rgba(15,23,42,.03)}
.wz-micro-coach::before{background:radial-gradient(circle,rgba(239,68,68,.08) 0%,rgba(239,68,68,.025) 46%,transparent 72%)}
.wz-upload-drop{display:grid;grid-template-columns:34px minmax(0,1fr);gap:2px 10px;align-items:center;border:1px dashed #cbd5e1;background:#f8fafc;border-radius:14px;padding:12px 14px;margin-bottom:10px;cursor:pointer;transition:border-color .2s,background .2s,box-shadow .2s}
.wz-upload-drop:hover{border-color:#fca5a5;background:#fffafa;box-shadow:0 6px 16px rgba(15,23,42,.04)}
.wz-upload-drop input{position:absolute;opacity:0;pointer-events:none}
.wz-upload-icon{grid-row:1 / span 2;width:34px;height:34px;border-radius:11px;display:flex;align-items:center;justify-content:center;background:#fff;color:#ef4444;border:1px solid #e8eef5;font-size:17px;font-weight:850}
.wz-upload-drop span:not(.wz-upload-icon){font-size:13px;font-weight:800;color:#0f172a}
.wz-upload-drop small{font-size:11px;color:#64748b}
.wz-upload-status{font-size:12px;font-weight:650;border-radius:10px;padding:8px 10px;margin-bottom:10px;background:#f8fafc;color:#64748b;border:1px solid #e8eef5}
.wz-upload-status.done{background:#f0fdf4;color:#15803d;border-color:#dcfce7}
.wz-upload-status.error{background:#fff7ed;color:#c2410c;border-color:#fed7aa}
.wz-upload-status.uploading{background:#f8fafc;color:#475569}

/* ─── Final UX polish: calm focus, lighter chrome, consistent rhythm ─── */
.wz-progress-section{padding:9px 30px 9px}
.wz-steps-row{gap:6px;margin-bottom:8px}
.wz-step-btn{padding:5px 8px;background:#fbfcfe;border-color:#e8eef5}
.wz-step-btn.active{animation:none;border-color:#f87171;background:#fffafa;box-shadow:0 2px 8px rgba(239,68,68,.10)}
.wz-step-btn.active .wz-step-circle{box-shadow:none}
.wz-step-name{font-weight:520}
.wz-bar-fill{box-shadow:none}

.wz-section-hero{margin-bottom:22px;padding-bottom:16px}
.wz-section-hero::before{background:linear-gradient(90deg,#cbd5e1,rgba(203,213,225,.18));width:64px}
.wz-section-title{font-weight:700;letter-spacing:-.025em}
.wz-section-sub{color:#6b7c93}
.wz-hero-badge{background:#fff;border-color:#e8eef5;color:#94a3b8}

.wz-section-card,
.wz-reflection-card,
.wz-info-card{border-color:#e8eef5;background:#fff;box-shadow:none}
.wz-section-card:hover,
.wz-reflection-card:hover,
.wz-info-card:hover{border-color:#dbe4ef;box-shadow:0 5px 16px rgba(15,23,42,.04);transform:none}
.wz-section-card:focus-within,
.wz-reflection-card:focus-within,
.wz-info-card:focus-within{border-color:#d9e4ef;background:#fff;box-shadow:0 8px 22px rgba(15,23,42,.055)}
.wz-section-card.wz-section-main,
.wz-section-card.wz-category-main,
.wz-section-card.wz-team-panel{border-color:#e5edf5;box-shadow:0 8px 22px rgba(15,23,42,.045)}
.wz-section-card.wz-section-main::before{background:#e2e8f0;width:3px;opacity:1}
[data-guide].wz-guide-active{border-color:#dbe4ef!important;box-shadow:0 8px 22px rgba(15,23,42,.045)!important}
.wz-section-card.wz-guide-active:not(.wz-section-main)::before,
.wz-reflection-card.wz-guide-active::before{background:#dbe4ef!important;width:2px!important;opacity:1!important}
.wz-review-hero.wz-guide-active{border-color:rgba(255,255,255,.12)!important;box-shadow:0 12px 28px rgba(15,23,42,.16)!important}

.wz-label-big,
.wz-rc-title{font-weight:700}
.wz-zone-title{font-weight:700}
.wz-hint,
.wz-zone-sub,
.wz-rc-hint{color:#94a3b8;line-height:1.5}
.wz-req{color:#f87171}

.wz-input,
.wz-textarea{background:#fbfdff;border-color:#dbe4ef;box-shadow:none;color:#0f172a}
.wz-input:hover,
.wz-textarea:hover{background:#fff;border-color:#cbd8e6}
.wz-input:focus,
.wz-textarea:focus,
.wz-input-ok:focus,
.wz-textarea.wz-input-ok:focus{background:#fff!important;border-color:#fb7185!important;outline:none;box-shadow:0 0 0 4px rgba(251,113,133,.09),0 10px 24px rgba(15,23,42,.055)!important}
.wz-input-err,
.wz-textarea.wz-input-err{background:#fffaf5!important;border-color:#fdba74!important;box-shadow:none!important}
.wz-input-err:focus,
.wz-textarea.wz-input-err:focus{background:#fff!important;border-color:#fb923c!important;box-shadow:0 0 0 4px rgba(251,146,60,.12),0 10px 24px rgba(15,23,42,.05)!important}
.wz-field-error{display:inline-flex;align-items:center;width:max-content;max-width:100%;padding:5px 9px;border-radius:999px;background:#fffbeb;border:1px solid #fde68a;color:#b45309;font-size:11.5px;font-weight:650;animation:none}
.wz-submit-err{color:#b45309;font-weight:650}

.wz-textarea{height:86px;min-height:86px;line-height:1.6;background:#fbfdff;resize:vertical}
.wz-textarea:focus{height:134px}
.wz-textarea.wz-input-ok:not(:focus){height:98px}
.wz-writing-prompts span{background:#f8fafc;border-color:#e8eef5;color:#94a3b8;font-weight:600}
.wz-section-card:focus-within .wz-writing-prompts,
.wz-reflection-card:focus-within .wz-writing-prompts{max-height:64px;margin:0 0 9px}

.wz-flow-group-label,
.wz-info-group-label{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:4px 0 10px;padding:0 2px;color:#94a3b8}
.wz-info-group-label{grid-column:1/-1;margin-top:2px}
.wz-flow-group-label span,
.wz-info-group-label span{font-size:10px;font-weight:900;letter-spacing:.14em;text-transform:uppercase;color:#94a3b8}
.wz-flow-group-label small,
.wz-info-group-label small{font-size:12px;font-weight:600;color:#94a3b8;text-align:right}

.wz-category-card:hover{border-color:#cbd8e6;box-shadow:0 12px 24px rgba(15,23,42,.075);background:#fff;transform:translateY(-2px)}
.wz-category-card.selected{border-color:#fb7185;background:linear-gradient(180deg,#fffafa,#fff);box-shadow:0 0 0 3px rgba(251,113,133,.07),0 12px 24px rgba(15,23,42,.06)}
.wz-category-card.selected .wz-category-name,
.wz-career-card.checked .wz-cc-label,
.wz-interest-pill.checked,
.wz-option-card.checked .wz-oc-text{color:#b91c1c}
.wz-career-card.checked,
.wz-interest-pill.checked,
.wz-option-card.checked,
.wz-work-card.checked{border-color:#fda4af;background:#fffafa;box-shadow:0 0 0 2px rgba(251,113,133,.05)}
.wz-interest-pill,
.wz-option-card,
.wz-work-card,
.wz-career-card{box-shadow:none}
.wz-interest-pill:hover,
.wz-option-card:hover,
.wz-work-card:hover,
.wz-career-card:hover{box-shadow:0 8px 18px rgba(15,23,42,.055)}
.wz-work-location-pill:hover{border-color:#cbd8e6;background:#fff;color:#0f172a}
.wz-work-location-pill.checked,
.wz-work-card.checked .wz-work-card-head>span{background:#ef4444;border-color:#ef4444;color:#fff;box-shadow:none}

.wz-summary-pct,
.wz-mobile-summary-pct{box-shadow:0 7px 14px rgba(239,68,68,.14)}
.wz-side-summary{padding:15px;gap:10px}
.wz-summary-head{padding-bottom:2px}
.wz-summary-title{font-size:15.5px;font-weight:820}
.wz-summary-focus{display:flex;flex-direction:column;gap:4px;padding:11px 12px;border-radius:14px;background:#fff7ed;border:1px solid #fed7aa;box-shadow:inset 3px 0 0 rgba(249,115,22,.22)}
.wz-summary-focus.done{background:#f0fdf4;border-color:#bbf7d0;box-shadow:inset 3px 0 0 rgba(16,185,129,.18)}
.wz-summary-focus span{font-size:9.5px;font-weight:900;letter-spacing:.02em;color:#c2410c}
.wz-summary-focus.done span{color:#059669}
.wz-summary-focus strong{font-size:12px;line-height:1.42;color:#0f172a;font-weight:760}
.wz-summary-missing{background:#fffaf5;border-color:#fed7aa;box-shadow:inset 3px 0 0 rgba(249,115,22,.18)}
.wz-summary-missing li{font-size:12px;font-weight:760}
.wz-summary-commit{box-shadow:inset 3px 0 0 rgba(239,68,68,.14)}
.wz-summary-list-title{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:1px 1px -1px}
.wz-summary-list-title span{font-size:10px;font-weight:900;letter-spacing:.02em;color:#94a3b8}
.wz-summary-list-title strong{font-size:11px;color:#64748b;font-weight:850}
.wz-summary-row{grid-template-columns:20px minmax(50px,.42fr) minmax(0,1fr);min-height:34px}
.wz-summary-status{width:20px;height:20px}
.wz-summary-row.missing .wz-summary-status{background:#fffbeb;color:#d97706}

.wz-contact-inline{display:flex;align-items:flex-start;gap:12px;flex-wrap:wrap;margin-top:12px;position:relative;z-index:1}
.wz-contact-inline .wz-check-pill{min-height:42px}
.wz-telegram-inline{display:flex;align-items:flex-start;gap:8px;min-width:min(360px,100%);flex:1;flex-wrap:wrap}
.wz-telegram-inline .wz-input{min-height:42px;flex:1 1 220px}
.wz-telegram-inline .wz-field-error{margin-top:4px;white-space:normal}

.wz-btn-next,
.wz-btn-submit,
.wz-btn-start{background:linear-gradient(180deg,#ef4444 0%,#dc3333 100%);box-shadow:0 5px 12px rgba(239,68,68,.14),inset 0 1px 0 rgba(255,255,255,.16)}
.wz-btn-next:hover,
.wz-btn-submit:hover:not(:disabled),
.wz-btn-start:hover{box-shadow:0 8px 18px rgba(239,68,68,.20),inset 0 1px 0 rgba(255,255,255,.18)}
.wz-btn-next:disabled{opacity:.42;background:#fca5a5}
.wz-btn-back{background:transparent;border-color:transparent;padding:8px 10px;color:#64748b}
.wz-btn-back:hover:not(:disabled){background:#f8fafc;color:#334155;border-color:transparent}

.wz-upload-drop{margin-bottom:8px}
.wz-upload-drop.done{border-color:#bbf7d0;background:#f0fdf4}
.wz-upload-drop.done .wz-upload-icon{color:#059669;border-color:#bbf7d0}
.wz-upload-drop.error{border-color:#fdba74;background:#fffaf5}
.wz-upload-link{display:inline-flex;width:max-content;max-width:100%;font-size:12px;font-weight:750;color:#2563eb;text-decoration:none;border:1px solid #dbeafe;background:#eff6ff;border-radius:999px;padding:7px 10px}
.wz-upload-link:hover{background:#dbeafe}

/* ─── Final approval pass: lighter surface, calmer CTA, clearer profile step ─── */
.wz-progress-section{padding:7px 30px 7px}
.wz-steps-row{margin-bottom:6px}
.wz-step-btn{padding:4px 8px;min-height:38px}
.wz-step-circle{width:22px;height:22px;font-size:11px}
.wz-step-name{font-size:11.5px}

.wz-footer{min-height:72px;background:linear-gradient(180deg,rgba(255,255,255,.82),rgba(255,255,255,.97));backdrop-filter:blur(18px);border-top:1px solid rgba(226,232,240,.78);box-shadow:0 -10px 28px rgba(15,23,42,.035)}
.wz-btn-next,
.wz-btn-submit,
.wz-btn-start{background:linear-gradient(180deg,#ef4444 0%,#d93a3a 100%);box-shadow:0 4px 10px rgba(239,68,68,.12),inset 0 1px 0 rgba(255,255,255,.16)}
.wz-btn-next:hover,
.wz-btn-submit:hover:not(:disabled),
.wz-btn-start:hover{box-shadow:0 7px 16px rgba(239,68,68,.16),inset 0 1px 0 rgba(255,255,255,.18)}
.wz-btn-next:focus-visible,
.wz-btn-submit:focus-visible,
.wz-btn-start:focus-visible{outline:none;box-shadow:0 0 0 4px rgba(239,68,68,.14),0 7px 16px rgba(239,68,68,.14),inset 0 1px 0 rgba(255,255,255,.18)}

.wz-textarea{height:76px;min-height:76px}
.wz-textarea:focus{height:124px}
.wz-textarea.wz-input-ok:not(:focus){height:88px}

.wz-profile-step .wz-info-grid{gap:16px 22px}
.wz-profile-step .wz-info-group-label{margin:6px 0 4px;padding:14px 2px 0;border-top:1px solid #edf2f7}
.wz-profile-step .wz-info-group-label:first-child{border-top:none;padding-top:0}
.wz-profile-step .wz-info-group-label span{color:#8798ad}
.wz-profile-step .wz-info-group-label small{font-size:12.5px;color:#7f8fa4}
.wz-profile-step .wz-info-card:not(.full){padding:0;border-color:transparent;background:transparent;box-shadow:none;border-radius:0;overflow:visible}
.wz-profile-step .wz-info-card:not(.full):hover,
.wz-profile-step .wz-info-card:not(.full):focus-within{border-color:transparent;background:transparent;box-shadow:none}
.wz-profile-step .wz-info-card:not(.full)::after{display:none}
.wz-profile-step .wz-info-card.full{padding:16px 18px;border-color:#e8eef5;background:rgba(255,255,255,.86);box-shadow:0 6px 18px rgba(15,23,42,.035)}
.wz-profile-step .wz-info-card.full:hover,
.wz-profile-step .wz-info-card.full:focus-within{border-color:#dbe4ef;box-shadow:0 8px 22px rgba(15,23,42,.045)}
.wz-profile-step .wz-input{background:#fff}
.wz-upload-reassurance{margin:-2px 0 10px;font-size:12.5px;font-weight:650;color:#059669}

.wz-summary-title{font-size:16px;line-height:1.25}
.wz-summary-focus{padding:12px 13px;background:#fff7ed;border-color:#fed7aa}
.wz-summary-focus strong{font-size:12.5px;line-height:1.48}
.wz-summary-commit strong{font-size:13.5px;line-height:1.35}
.wz-summary-row{min-height:36px}
.wz-summary-label{font-size:10px}
.wz-summary-value{font-size:12px}
.wz-summary-list-title{margin:2px 1px 0}

/* ─── Tiny fit pass: education fields should guide, not draw a second frame ─── */
.wz-main{grid-template-columns:116px minmax(0,1fr) 270px}
.wz-micro-coach{right:-22px}
.wz-input:focus-visible,
.wz-textarea:focus-visible{outline:none!important}
.wz-profile-step .wz-info-card:not(.full).wz-guide-active{border-color:transparent!important;background:transparent!important;box-shadow:none!important}
.wz-profile-step .wz-info-card:not(.full):focus-within{border-color:transparent!important;background:transparent!important;box-shadow:none!important}
.wz-field-example{margin:-2px 0 9px;font-size:12.5px;line-height:1.45;color:#7f8fa4;font-weight:600}
.wz-profile-step .wz-info-card:not(.full) .wz-hint + .wz-field-example{margin-top:-6px}
.wz-profile-step .wz-info-card:not(.full) .wz-input:focus{box-shadow:0 0 0 3px rgba(251,113,133,.08),0 8px 18px rgba(15,23,42,.04)!important}

/* ─── Final product polish: less boxy, more onboarding flow ─── */
.wz-intro-mascot-stage{height:242px;margin-bottom:14px}
.wz-intro-mascot-stage::before{width:200px;height:82px;opacity:.85}
.wz-intro-form{border:1px solid rgba(255,255,255,.82);box-shadow:0 34px 86px rgba(0,0,0,.34),0 0 0 1px rgba(255,255,255,.24),0 18px 42px rgba(15,23,42,.18),inset 0 1px 0 rgba(255,255,255,.9)}
.wz-intro-pills span{border-color:rgba(255,255,255,.22);background:rgba(255,255,255,.095);color:rgba(255,255,255,.9)}

.wz-main{grid-template-columns:108px minmax(0,1fr) 270px}
.wz-micro-coach{right:-30px}
.wz-progress-section{padding:6px 30px 6px}
.wz-step-btn.active{border-color:#fecaca!important;background:#fffafa;box-shadow:0 2px 7px rgba(239,68,68,.075)!important}
.wz-step-btn.active .wz-step-name{color:#991b1b}
.wz-body{padding:26px 26px 94px}
.wz-section-hero{margin-bottom:18px;padding-bottom:14px}
.wz-section-card{padding:17px 20px;margin-bottom:10px}
.wz-section-card.wz-section-main{padding:22px 26px;margin-bottom:18px}
.wz-section-card.wz-category-main{padding:20px 24px}
.wz-section-card.wz-team-panel{padding:20px 24px;margin-bottom:18px}
.wz-reflection-card{padding:18px 20px;margin-bottom:12px}
.wz-info-card.full{padding:15px 16px}
.wz-label-big{margin-bottom:5px}
.wz-hint,.wz-rc-hint{margin-bottom:8px}

.wz-textarea{height:64px!important;min-height:64px!important;padding:12px 14px;line-height:1.5}
.wz-textarea:focus{height:116px!important}
.wz-textarea.wz-input-ok:not(:focus){height:78px!important}
.wz-writing-prompts span{padding:4px 8px;font-size:10px}

.wz-summary-pct{display:none!important}
.wz-side-summary{gap:9px;padding:14px;border-color:#e8eef5;box-shadow:0 14px 28px rgba(15,23,42,.06);background:rgba(255,255,255,.94)}
.wz-summary-kicker{color:#ef4444;font-size:9.5px}
.wz-summary-track{height:4px;background:#edf2f7}
.wz-summary-focus{padding:10px 11px;border-color:#fed7aa;background:#fff8ef;box-shadow:inset 2px 0 0 rgba(249,115,22,.16)}
.wz-summary-focus.done{border-color:#d8f3df;background:#f7fdf9;box-shadow:inset 2px 0 0 rgba(16,185,129,.14)}
.wz-summary-focus strong{font-size:12px;line-height:1.46}
.wz-summary-commit{padding:10px 11px;border-color:#e8eef5;background:#fff;box-shadow:none}
.wz-summary-list{gap:7px}
.wz-summary-row{min-height:40px;padding:8px 9px;border-color:#edf2f7;background:#fff}
.wz-summary-row.done{border-color:#edf2f7;background:#fff}
.wz-summary-row.missing{border-color:#f8e8d3;background:#fffdf9}
.wz-summary-row.optional{border-color:#edf2f7;background:#fff}
.wz-summary-row.optional .wz-summary-status{background:#f1f5f9;color:#94a3b8}
.wz-summary-row.optional .wz-summary-value{color:#64748b}
.wz-summary-row.missing .wz-summary-status{background:#fff7ed;color:#f59e0b}

.wz-footer{min-height:70px;background:rgba(255,255,255,.76);backdrop-filter:blur(18px);border-top:1px solid rgba(226,232,240,.72);box-shadow:0 -8px 24px rgba(15,23,42,.035)}
.wz-btn-next,.wz-btn-submit,.wz-btn-start{background:linear-gradient(180deg,#ef4444 0%,#d63a3a 100%);box-shadow:0 3px 8px rgba(239,68,68,.10),inset 0 1px 0 rgba(255,255,255,.16)}
.wz-btn-next:hover,.wz-btn-submit:hover:not(:disabled),.wz-btn-start:hover{box-shadow:0 6px 13px rgba(239,68,68,.15),inset 0 1px 0 rgba(255,255,255,.18)}

.wz-mobile-summary-step{width:42px;height:42px;border-radius:13px;background:#fff;color:#64748b;border:1px solid #e2e8f0;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:850;flex-shrink:0}
.wz-profile-step .wz-info-card:not(.full),
.wz-profile-step .wz-info-card:not(.full):focus,
.wz-profile-step .wz-info-card:not(.full):focus-visible{outline:none!important}
.wz-profile-step .wz-info-card:not(.full) .wz-input:focus{box-shadow:0 0 0 3px rgba(251,113,133,.075),0 7px 16px rgba(15,23,42,.035)!important}

/* ─── Bright intro refresh: dark shell, light professional form ─── */
.wz-intro{background:#f8fafc;border-radius:inherit}
.wz-intro::before,.wz-intro::after{display:none}
.wz-intro-content{padding:0;align-items:stretch;justify-content:stretch}
.wz-intro-panel{width:100%;height:100%;min-height:100%;grid-template-columns:minmax(0,1fr) minmax(390px,430px);gap:46px;align-items:center;padding:56px 72px;border-radius:0;background:linear-gradient(135deg,rgba(255,255,255,.99),rgba(248,250,252,.96));border:0;box-shadow:none;position:relative;overflow:hidden}
.wz-intro-panel::before{content:'';position:absolute;inset:0;background:linear-gradient(90deg,rgba(239,68,68,.055),transparent 34%),linear-gradient(rgba(15,23,42,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(15,23,42,.035) 1px,transparent 1px);background-size:auto,36px 36px,36px 36px;pointer-events:none}
.wz-intro-copy,.wz-intro-form{position:relative;z-index:1}
.wz-intro-copy{color:#0f172a}
.wz-intro-mascot-stage{height:252px;margin-bottom:6px;padding-left:24px}
.wz-intro-mascot-stage::before{left:34px;bottom:2px;width:248px;height:104px;background:radial-gradient(ellipse,rgba(239,68,68,.16) 0%,rgba(15,23,42,.08) 48%,transparent 72%)}
.wz-intro-mascot{filter:drop-shadow(0 20px 30px rgba(15,23,42,.18))}
.wz-intro-mini-guide{position:absolute;left:278px;top:24px;width:372px;min-height:64px;padding:12px 17px 12px 46px;border-radius:16px 16px 16px 6px;background:rgba(255,255,255,.94);border:1px solid rgba(226,232,240,.95);box-shadow:0 16px 30px rgba(15,23,42,.10);color:#334155;display:flex;align-items:center;z-index:2;animation:wzMiniGuideIn .28s ease}
.wz-intro-mini-guide::before{content:'';position:absolute;left:-7px;top:22px;width:13px;height:13px;background:inherit;border-left:1px solid rgba(226,232,240,.95);border-bottom:1px solid rgba(226,232,240,.95);transform:rotate(45deg);border-radius:0 0 0 2px}
.wz-intro-mini-guide span{position:absolute;left:13px;top:13px;width:20px;height:20px;border-radius:999px;display:flex;align-items:center;justify-content:center;background:#fff1f2;color:#ef4444;font-size:12px;font-weight:900}
.wz-intro-mini-guide p{margin:0;font-size:15px;font-weight:800;line-height:1.42;color:#263244}
.wz-intro-mini-guide.focused{border-color:#fecaca;box-shadow:0 14px 28px rgba(239,68,68,.08)}
.wz-intro-mini-guide.warning{background:#fffaf5;border-color:#fed7aa}
.wz-intro-mini-guide.warning span{background:#ffedd5;color:#c2410c}
.wz-intro-mini-guide.ready{background:#f7fdf9;border-color:#bbf7d0}
.wz-intro-mini-guide.ready span{background:#dcfce7;color:#059669}
@keyframes wzMiniGuideIn{from{opacity:0;transform:translateX(-6px)}to{opacity:1;transform:none}}
.wz-intro-kicker{background:#fff1f2;border-color:#fecaca;color:#b91c1c}
.wz-intro-title{color:#0f172a;font-size:clamp(34px,3.55vw,46px);max-width:640px}
.wz-intro-title::after{content:'';display:block;width:74px;height:4px;border-radius:999px;background:linear-gradient(90deg,#ef4444,#f97316);margin-top:16px}
.wz-intro-desc{color:#475569;max-width:500px;font-weight:560}
.wz-intro-pills span{background:#fff;border-color:#dbe4ef;color:#334155;box-shadow:0 8px 18px rgba(15,23,42,.045)}
.wz-intro-form{background:#fff;border:1px solid rgba(15,23,42,.06);border-radius:22px;padding:18px;box-shadow:0 20px 40px rgba(15,23,42,.08),0 2px 8px rgba(15,23,42,.04),0 1px 0 rgba(255,255,255,.9) inset;gap:10px}
.wz-intro-form::before{display:none}
.wz-intro-form-head{padding-bottom:0}
.wz-intro-form-kicker{color:#ef4444}
.wz-intro-helper{padding:10px 12px;border-radius:13px;background:#f8fafc;border:1px solid #e2e8f0;position:relative;z-index:1;box-shadow:inset 3px 0 0 rgba(100,116,139,.14)}
.wz-intro-helper.warning{background:#fffaf5;border-color:#fed7aa;box-shadow:inset 3px 0 0 rgba(249,115,22,.18)}
.wz-intro-helper.ready{background:#f0fdf4;border-color:#bbf7d0;box-shadow:inset 3px 0 0 rgba(16,185,129,.16)}
.wz-intro-helper span{display:block;margin-bottom:4px;font-size:10px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;color:#64748b}
.wz-intro-helper.warning span{color:#c2410c}
.wz-intro-helper.ready span{color:#047857}
.wz-intro-helper p{margin:0;font-size:12px;font-weight:680;color:#334155;line-height:1.45}
.wz-intro-helper ul{list-style:none;margin:7px 0 0;padding:0;display:flex;flex-direction:column;gap:5px}
.wz-intro-helper li{position:relative;padding-left:14px;font-size:12px;font-weight:760;color:#0f172a;line-height:1.35}
.wz-intro-helper li::before{content:'';position:absolute;left:0;top:.62em;width:5px;height:5px;border-radius:999px;background:#fb923c;transform:translateY(-50%)}
.wz-intro-form .wz-info-card{background:#fbfdff;border-color:#e2e8f0;border-radius:14px;padding:11px 12px;box-shadow:none}
.wz-intro-form .wz-info-card:focus-within{background:#fff;border-color:#fca5a5;box-shadow:0 0 0 3px rgba(239,68,68,.07)}
.wz-intro-form .wz-label{font-size:12.5px;margin-bottom:7px}
.wz-intro-form .wz-input{background:#fff;border-color:#dbe4ef;min-height:44px;padding:11px 14px}
.wz-intro-form .wz-contact-options{margin-top:10px}
.wz-intro-form .wz-check-pill{font-size:12.5px;font-weight:780;color:#334155;padding:8px 11px}
.wz-intro-form .wz-field-error{margin-top:7px}
.wz-intro-form .wz-btn-start{height:52px;background:linear-gradient(180deg,#ea4444 0%,#d63a3a 100%);box-shadow:0 5px 12px rgba(239,68,68,.12),inset 0 1px 0 rgba(255,255,255,.16)}
.wz-intro-form .wz-btn-start:hover{box-shadow:0 7px 16px rgba(239,68,68,.16),inset 0 1px 0 rgba(255,255,255,.18)}
.wz-intro-close{background:#fff;border-color:#dbe4ef;color:#64748b;box-shadow:0 10px 22px rgba(15,23,42,.08)}
.wz-intro-close:hover{background:#ef4444;border-color:#ef4444;color:#fff}
.wz-intro-hint{display:flex;align-items:center;justify-content:center;gap:6px;color:#64748b;font-weight:750}
.wz-intro-hint span{display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;border-radius:999px;background:#ecfdf5;color:#059669;font-size:10px;font-weight:900}

/* ─── Interaction fixes: steady typing and footer-safe reveal ─── */
.wz-body{padding-bottom:152px}
.wz-textarea{height:108px!important;min-height:108px!important;resize:vertical;overflow:auto}
.wz-textarea:focus,
.wz-textarea.wz-input-ok:not(:focus){height:108px!important}
.wz-writing-prompts,
.wz-writing-prompts *{user-select:none}
.wz-section-card[data-guide="note"]{margin-bottom:36px}

@media(max-width:640px){
  .wz-intro{overflow-y:auto;-webkit-overflow-scrolling:touch}
  .wz-progress-section{padding:8px 18px 7px}
  .wz-step-btn{min-height:40px}
  .wz-intro-content{padding:0}
  .wz-intro-panel{height:auto;min-height:100%;overflow:visible;grid-template-columns:1fr;padding:22px;gap:18px;border-radius:0}
  .wz-intro-mascot-stage{height:176px;padding-left:0}
  .wz-intro-mini-guide{left:50%;top:auto;bottom:0;width:min(280px,100%);transform:translateX(-50%);padding:8px 10px 8px 32px;text-align:left;animation:none}
  .wz-intro-mini-guide::before{display:none}
  .wz-intro-title{font-size:30px}
  .wz-profile-step .wz-info-card.full{padding:15px}
  .wz-profile-step .wz-info-group-label{align-items:flex-start;flex-direction:column;gap:2px}
  .wz-profile-step .wz-info-group-label small{text-align:left}
  .wz-body{padding-bottom:132px}
  .wz-textarea,
  .wz-textarea:focus,
  .wz-textarea.wz-input-ok:not(:focus){height:112px!important;min-height:112px!important}
}

/* ─── Responsive ─── */
@media(max-width:1040px){
  .wz-container{max-width:100%}
}
@media(max-width:959px){
  .wz-mobile-summary-bar{display:flex;align-items:center;gap:10px;padding:10px 22px 12px;border-bottom:1px solid #e8ecf1;background:linear-gradient(135deg,#fff,#f8fafc);flex-shrink:0;box-shadow:0 6px 18px rgba(15,23,42,.04)}
  .wz-mobile-summary-mascot{width:42px;height:42px;display:flex;align-items:center;justify-content:center;flex-shrink:0;filter:drop-shadow(0 8px 14px rgba(15,23,42,.10))}
  .wz-mobile-summary-copy{display:flex;flex-direction:column;gap:1px;min-width:0;flex:1}
  .wz-mobile-summary-copy span{font-size:10px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;color:#94a3b8}
  .wz-mobile-summary-copy strong{font-size:12px;color:#0f172a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .wz-mobile-summary-pct{width:42px;height:42px;border-radius:13px;background:linear-gradient(180deg,#ef4444,#dc2626);color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;box-shadow:0 8px 18px rgba(239,68,68,.18)}
  .wz-main{grid-template-columns:1fr;column-gap:0;padding:0}
  .wz-guide-rail{display:none}
  .wz-micro-rail{display:none}
  .wz-side-panel{display:none}
  .wz-body{grid-column:1;padding:24px 22px 152px}
}

@media(max-width:640px){
  .wz-container{border-radius:0;max-height:100vh}
  .wz-mobile-summary-bar{padding:8px 18px 10px}
  .wz-body{padding:20px 18px 132px}
  .wz-info-grid{grid-template-columns:1fr}
  .wz-info-card.full{grid-column:auto}
  .wz-career-grid{grid-template-columns:1fr;gap:12px}
  .wz-work-card-grid{grid-template-columns:1fr}
  .wz-steps-row{overflow-x:auto}
  .wz-step-info{display:none}
  .wz-step-btn{padding:7px;justify-content:center}
  .wz-review-hero{flex-direction:column;text-align:center}
  .wz-rh-tags{justify-content:center}
  .wz-rv-row{flex-direction:column;gap:2px}
  .wz-rv-label{min-width:0}
  .wz-grid-header,.wz-grid-row{grid-template-columns:80px repeat(3,1fr)}
  .wz-section-card{padding:16px 16px;margin-bottom:14px}
  .wz-section-card.wz-section-main{padding:18px 16px}
  .wz-category-grid{grid-template-columns:1fr}
  .wz-category-card{min-height:96px}
  .wz-choice-head{flex-direction:column;gap:10px}
  .wz-change-category-btn{width:100%;justify-content:center}
  .wz-category-picked{align-items:flex-start}
  .wz-category-picked>span:last-child{white-space:normal;text-align:right}
  .wz-career-head{flex-direction:column;gap:10px}
  .wz-career-head-badge{align-items:flex-start;min-width:0;width:100%}
  .wz-section-hero{display:block;padding:18px 18px 16px}
  .wz-hero-badge{margin-bottom:10px}
  .wz-section-sub{margin-top:6px}
  .wz-section-title{font-size:19px}
  .wz-zone-title{font-size:17px}
  .wz-btn-next,.wz-btn-submit{padding:11px 22px;font-size:13px}
  .wz-intro-content{padding:0}
  .wz-intro-panel{grid-template-columns:1fr;gap:18px;padding:24px;border-radius:0}
  .wz-intro-copy{text-align:center}
  .wz-intro-desc{max-width:none}
  .wz-intro-mascot-stage{width:min(332px,100%);height:194px;margin-bottom:20px;padding-left:0}
  .wz-intro-copy .wz-intro-mascot-stage{margin-inline:auto}
  .wz-intro-title{font-size:24px}
  .wz-intro-pills{justify-content:center}
  .wz-intro-form{padding:14px;border-radius:16px}
  .wz-btn-start{padding:14px 32px;font-size:14px}
  .wz-reflection-card{padding:18px}
  .wz-email-row{max-width:100%}
  .wz-footer{padding:14px 18px}
  .wz-career-guide{align-items:flex-start;flex-direction:column;gap:5px}
  .wz-career-guide-text{text-align:left}
  .wz-filter-tabs{flex-wrap:wrap;overflow-x:visible;margin-inline:0;padding:0}
  .wz-filter-tab{flex:0 0 auto}
  .wz-selected-summary{align-items:flex-start;flex-direction:column;gap:4px}
}
@media(max-width:400px){
  .wz-body{padding:16px 12px 124px}
  .wz-intro-content{padding:0}
  .wz-intro-panel{padding:16px;border-radius:0}
  .wz-intro-mascot-stage{height:146px;padding-left:0}
  .wz-intro-title{font-size:24px}
  .wz-intro-content{padding:0}
  .wz-intro-mascot-stage{width:min(260px,100%);height:160px}
  .wz-intro-title{font-size:20px}
  .wz-success-mascot-wrap{width:160px;height:160px}
  .wz-success-title{font-size:20px}
  .wz-community-grid{grid-template-columns:1fr}
  .wz-community-secondary{grid-template-columns:1fr}
  .wz-community-hub{padding:8px 14px 16px}
  .wz-success-next{padding:12px 14px 8px}
  .wz-footer{padding:12px 12px}
  .wz-btn-next,.wz-btn-submit{min-width:0;padding:11px 18px;font-size:12px}
  .wz-btn-back{padding:11px 16px;font-size:12px}
  .wz-grid-header,.wz-grid-row{grid-template-columns:60px repeat(3,1fr)}
  .wz-section-title{font-size:17px}
  .wz-zone-title{font-size:15px}
  .wz-step-btn{min-width:44px;min-height:44px}
  .wz-filter-tab{padding:10px 10px;font-size:11px;min-height:44px}
  .wz-progress-section{padding:8px 12px 7px}
}

/* Mobile touch pass: keep every important control comfortable inside the phone frame */
@media(max-width:640px){
  .wz-change-category-btn{min-height:42px}
  .wz-interest-pill{min-height:44px;padding-block:10px}
  .wz-work-location-pill{min-height:42px;padding-inline:13px}
  .wz-selected-tag{min-height:44px;padding:4px 4px 4px 12px}
  .wz-selected-tag button{width:40px;height:40px;display:inline-flex;align-items:center;justify-content:center;padding:0;border-radius:999px}
  .wz-rc-edit-btn{min-height:42px;padding:9px 14px}
  .wz-sent-back{min-height:44px;padding:9px 12px}
}

/* ════════════════════════════════════
   SUCCESS SCREEN — DESKTOP 2-COL
   ════════════════════════════════════ */
.wz-success{display:flex;flex-direction:column;flex:1;overflow-y:auto;overflow-x:hidden;background:#f8fafc}
.wz-success-inner{display:flex;flex-direction:column;width:100%;max-width:none;margin:0;min-height:100%;background:#fff;box-shadow:0 0 0 1px #e2e8f0}

/* ── 1. Header (full width, horizontal on desktop) ── */
.wz-sc-confirm{display:flex;align-items:center;gap:16px;padding:22px 28px;border-bottom:1px solid #f1f5f9;background:#fff}
.wz-sc-check-ring{width:46px;height:46px;border-radius:50%;background:linear-gradient(135deg,#10b981,#059669);color:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 4px 14px rgba(16,185,129,.28);animation:wzCheckPop .5s cubic-bezier(.34,1.56,.64,1)}
@keyframes wzCheckPop{from{transform:scale(.5);opacity:0}to{transform:scale(1);opacity:1}}
.wz-sc-confirm-text{flex:1;min-width:0}
.wz-sc-confirm-title{font-size:18px;font-weight:800;color:#0f172a;margin:0 0 3px;letter-spacing:-.02em}
.wz-sc-confirm-sub{font-size:13px;color:#475569;margin:0;line-height:1.5}

/* ── 2. Body: 2-col grid ── */
.wz-success-body{display:grid;grid-template-columns:minmax(0,1fr) 320px;flex:1}
.wz-success-left{padding:20px 24px;border-right:1px solid #f1f5f9;display:flex;flex-direction:column;gap:14px}
.wz-success-right{background:#f8fafc;border-left:1px solid #f1f5f9}

/* ── App summary ── */
.wz-app-summary{padding:12px 14px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:11px;display:flex;flex-direction:column;gap:5px}
.wz-app-row{display:flex;align-items:baseline;gap:8px;font-size:12px;line-height:1.4}
.wz-app-row-label{color:#94a3b8;font-weight:600;white-space:nowrap;min-width:120px;flex-shrink:0}
.wz-app-row-val{color:#1e293b;font-weight:700;word-break:break-word}

/* ── Next steps ── */
.wz-success-next{display:flex;flex-direction:column;gap:8px}
.wz-next-heading{font-size:10.5px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.07em;margin:0 0 2px}
.wz-next-steps{display:flex;flex-direction:column;gap:0}
.wz-next-step{display:flex;gap:10px;align-items:flex-start}
.wz-ns-track{display:flex;flex-direction:column;align-items:center;flex-shrink:0}
.wz-ns-num{width:20px;height:20px;border-radius:50%;background:#ef4444;color:#fff;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center}
.wz-ns-line{width:2px;flex:1;min-height:8px;background:#e2e8f0;margin:2px 0}
.wz-ns-content{padding-bottom:8px}
.wz-ns-title{font-size:13px;font-weight:700;color:#0f172a;margin-bottom:2px}
.wz-ns-desc{font-size:12px;color:#64748b;line-height:1.45}

/* ── Reminder ── */
.wz-sc-reminder{display:flex;align-items:flex-start;gap:8px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:9px;padding:10px 12px;font-size:12px;color:#1e40af;line-height:1.5}
.wz-sc-reminder-icon{font-size:13px;flex-shrink:0;margin-top:1px}

/* ── Community section (right column) ── */
.wz-comm-section{padding:14px 14px 16px}
.wz-comm-divider{display:flex;align-items:center;gap:8px;margin-bottom:8px;color:#94a3b8;font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase}
.wz-comm-divider::before,.wz-comm-divider::after{content:'';flex:1;height:1px;background:#e2e8f0}
.wz-comm-desc{font-size:11.5px;color:#64748b;line-height:1.5;margin:0 0 10px;text-align:center}
.wz-soc-grid{display:grid;grid-template-columns:1fr;gap:7px;margin-bottom:12px}
.wz-soc-card{display:flex;align-items:center;gap:10px;background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:10px 12px;text-decoration:none;color:inherit;transition:border-color .2s,box-shadow .2s}
.wz-soc-card:hover{border-color:#cbd5e1;box-shadow:0 2px 8px rgba(0,0,0,.06)}
.wz-soc-card-primary{border-color:#dbeafe;background:#f0f7ff}
.wz-soc-card-primary:hover{border-color:#93c5fd}
.wz-soc-card-header{display:flex;align-items:center;gap:8px;flex:1;min-width:0}
.wz-soc-icon{width:28px;height:28px;border-radius:7px;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#fff}
.wz-soc-icon-fb{background:#1877f2}
.wz-soc-icon-yt{background:#ff0000}
.wz-soc-icon-li{background:#0a66c2}
.wz-soc-icon-tt{background:#000}
.wz-soc-name{font-size:11px;font-weight:700;color:#1e293b;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wz-soc-meta{font-size:10px;color:#94a3b8;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wz-soc-btn{flex-shrink:0;padding:5px 10px;border-radius:6px;font-size:10.5px;font-weight:600;color:#fff;white-space:nowrap}
.wz-soc-btn-fb{background:#1877f2}
.wz-soc-btn-yt{background:#ff0000}
.wz-soc-btn-li{background:#0a66c2}
.wz-soc-btn-tt{background:#000}

/* ── CTA + footer ── */
.wz-explore-cta{display:block;border:1.5px solid #e2e8f0;background:#fff;color:#374151;font-size:12.5px;font-weight:600;padding:9px 16px;border-radius:9px;text-decoration:none;text-align:center;transition:border-color .2s,background .2s}
.wz-explore-cta:hover{border-color:#cbd5e1;background:#f8fafc;color:#0f172a}
.wz-success-actions{padding:12px 24px;border-top:1px solid #f1f5f9;background:#fff;display:flex;justify-content:center}
.wz-back-link{background:none;border:none;color:#94a3b8;font-size:12px;cursor:pointer;padding:6px 12px}
.wz-back-link:hover{color:#475569;text-decoration:underline}

/* ── Mobile: stack to 1 column ── */
@media(max-width:640px){
  .wz-success-inner{box-shadow:none}
  .wz-sc-confirm{padding:16px 18px;gap:12px}
  .wz-sc-confirm-title{font-size:16px}
  .wz-success-body{grid-template-columns:1fr}
  .wz-success-left{padding:16px 18px;border-right:none;border-bottom:1px solid #f1f5f9}
  .wz-success-right{border-left:none}
}

/* ════════════════════════════════════
   SUCCESS SCREEN — rebuilt post-application flow
   ════════════════════════════════════ */
.wz-container:has(.wz-success){
  width:min(1180px,calc(100vw - 48px));
  max-width:1180px;
  height:min(860px,calc(100dvh - 40px));
  max-height:calc(100dvh - 40px);
  border-radius:30px;
}
.wz-success{height:100%;background:#f7f8fb;overflow:hidden}
.wz-success-inner{height:100%;background:#f7f8fb;box-shadow:none;overflow:hidden}
.wz-success-scroll{
  height:100%;
  overflow-y:auto;
  overscroll-behavior:contain;
  background-color:#f7f8fb;
  background-image:linear-gradient(rgba(148,163,184,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(148,163,184,.12) 1px,transparent 1px);
  background-size:32px 32px;
}
.wz-success-scroll::-webkit-scrollbar{width:5px}
.wz-success-scroll::-webkit-scrollbar-track{background:transparent}
.wz-success-scroll::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:999px}
.wz-success-page{width:100%;max-width:none;margin:0;padding:26px;display:flex;flex-direction:column;gap:16px}
.wz-result-hero{
  position:relative;
  display:grid;
  grid-template-columns:auto minmax(0,1fr) auto;
  gap:16px;
  align-items:center;
  background:#fff;
  border:1px solid #edf1f6;
  border-radius:24px;
  padding:22px 26px;
  box-shadow:0 20px 54px rgba(15,23,42,.09);
  overflow:hidden;
}
.wz-result-hero::before{content:'';position:absolute;left:0;right:0;top:0;height:4px;background:linear-gradient(90deg,#e5323b,#ff5a62,#ffb340,#ffd84d)}
.wz-result-check{width:54px;height:54px;border-radius:18px;background:linear-gradient(135deg,#23b36b,#63c776);color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 14px 28px rgba(35,179,107,.24);flex-shrink:0}
.wz-result-check svg{width:25px;height:25px}
.wz-result-copy{min-width:0}
.wz-result-badges{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:7px}
.wz-result-badges span{display:inline-flex;align-items:center;min-height:24px;border-radius:999px;padding:3px 10px;font-size:10.5px;font-weight:900}
.wz-result-badges span:first-child{background:#e8f5e9;color:#2e7d32}
.wz-result-badges span:first-child::before{content:'';width:6px;height:6px;border-radius:999px;background:#4caf50;margin-right:5px}
.wz-result-badges span:nth-child(2){background:#fff8e1;border:1px solid #ffe082;color:#e65100}
.wz-result-badges span:nth-child(3){background:#eff6ff;border:1px solid #bfdbfe;color:#1d4ed8}
.wz-result-copy h2{font-size:25px;line-height:1.16;font-weight:900;color:#18182d;margin:0 0 6px;letter-spacing:-.03em}
.wz-result-copy h2 em{font-style:normal;color:#e5323b}
.wz-result-copy p{font-size:13px;line-height:1.62;color:#657083;font-weight:680;margin:0;max-width:820px}
.wz-result-copy p strong{color:#1a1a2e}
.wz-result-copy p a{color:#e5323b;font-weight:900;text-decoration:underline;text-underline-offset:2px}
.wz-result-mascot{width:76px;filter:drop-shadow(0 12px 20px rgba(229,50,59,.12));opacity:.92}
.wz-result-summary{grid-column:1 / -1;display:grid;grid-template-columns:1.2fr 1fr auto;gap:0;border:1px solid #e7edf5;border-radius:16px;background:#fbfdff;overflow:hidden}
.wz-result-summary div{padding:11px 14px;border-right:1px solid #e7edf5;min-width:0}
.wz-result-summary div:last-child{border-right:0}
.wz-result-summary span{display:block;font-size:9.5px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;color:#8a96aa;margin-bottom:4px}
.wz-result-summary strong{display:block;font-size:12.5px;font-weight:900;color:#17172a;line-height:1.35;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wz-result-layout{width:100%;display:grid;grid-template-columns:minmax(0,1fr) 360px;gap:16px;align-items:start}
.wz-follow-panel,.wz-app-trial-card,.wz-process-card{background:#fff;border:1px solid #e6ebf3;border-radius:22px;box-shadow:0 14px 34px rgba(15,23,42,.07)}
.wz-follow-panel{padding:18px}
.wz-panel-eyebrow{display:inline-flex;align-items:center;min-height:26px;padding:4px 12px;border-radius:999px;background:#fff1f1;color:#e5323b;font-size:10.5px;font-weight:900;letter-spacing:.07em;text-transform:uppercase;border:1px solid #ffd6d8}
.wz-follow-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin:13px 0 12px}
.wz-follow-head h3{font-size:24px;line-height:1.16;font-weight:900;color:#1a1a2e;letter-spacing:-.03em;margin:0 0 7px;max-width:520px}
.wz-follow-head p{font-size:13px;line-height:1.62;color:#667085;font-weight:680;margin:0;max-width:660px}
.wz-follow-mascots{display:flex;align-items:center;flex-shrink:0;padding-top:2px}
.wz-follow-mascots img{width:38px;height:38px;border-radius:999px;border:3px solid #fff;background:#f8fafc;box-shadow:0 8px 16px rgba(15,23,42,.08);object-fit:contain;margin-left:-10px}
.wz-follow-mascots img:first-child{margin-left:0}
.wz-follow-reason{display:grid;grid-template-columns:auto minmax(0,1fr);gap:10px;align-items:center;background:#fffbea;border:1px solid #ffd84d;border-radius:14px;padding:10px 13px;margin-bottom:13px}
.wz-follow-reason span{font-size:10.5px;font-weight:900;color:#8a6500;text-transform:uppercase;letter-spacing:.08em;white-space:nowrap}
.wz-follow-reason strong{font-size:12px;line-height:1.45;color:#634600}
.wz-follow-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.wz-follow-card{position:relative;min-height:136px;display:grid;grid-template-columns:34px minmax(0,1fr);grid-template-rows:auto 1fr auto;gap:8px 10px;padding:13px;border-radius:16px;border:1px solid #e5ebf4;background:#fff;color:inherit;text-decoration:none;overflow:hidden;transition:transform .18s,box-shadow .18s,border-color .18s}
.wz-follow-card:hover{transform:translateY(-3px);box-shadow:0 16px 30px rgba(15,23,42,.10)}
.wz-follow-card-fb{background:linear-gradient(180deg,#eff6ff,#fff)}
.wz-follow-card-yt{background:linear-gradient(180deg,#fff1f1,#fff)}
.wz-follow-card-li{background:linear-gradient(180deg,#eef7ff,#fff)}
.wz-follow-card-tt{background:linear-gradient(180deg,#f5f5f7,#fff)}
.wz-follow-mascot{position:absolute;right:10px;top:8px;width:44px;height:44px;object-fit:contain;opacity:.78;filter:drop-shadow(0 8px 12px rgba(15,23,42,.10))}
.wz-follow-icon{grid-column:1;grid-row:1;width:34px;height:34px;border-radius:11px;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 16px rgba(15,23,42,.08);position:relative;z-index:1}
.wz-follow-card-fb .wz-follow-icon{color:#1877f2}
.wz-follow-card-yt .wz-follow-icon{color:#ff0000}
.wz-follow-card-li .wz-follow-icon{color:#0a66c2}
.wz-follow-card-tt .wz-follow-icon{color:#000}
.wz-follow-copy{grid-column:2;grid-row:1 / span 2;min-width:0;padding-right:44px;position:relative;z-index:1}
.wz-follow-copy strong{display:block;font-size:13px;font-weight:900;color:#1a1a2e;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wz-follow-copy span{display:block;font-size:10.5px;font-weight:800;color:#7a8598;margin-top:2px}
.wz-follow-copy p{font-size:11.5px;font-weight:680;color:#586273;line-height:1.45;margin:8px 0 0}
.wz-follow-btn{grid-column:1 / -1;grid-row:3;display:flex;align-items:center;justify-content:center;height:38px;border-radius:11px;color:#fff;font-size:12.5px;font-weight:900;position:relative;z-index:1}
.wz-follow-card-fb .wz-follow-btn{background:#1877f2}
.wz-follow-card-yt .wz-follow-btn{background:#ff0000}
.wz-follow-card-li .wz-follow-btn{background:#0a66c2}
.wz-follow-card-tt .wz-follow-btn{background:#000}
.wz-after-submit{display:flex;flex-direction:column;gap:14px;min-width:0}
.wz-app-trial-card{position:sticky;top:18px;overflow:hidden;padding:22px 20px 20px;color:#fff;background:radial-gradient(circle at 16% 100%,rgba(229,50,59,.36),transparent 38%),linear-gradient(135deg,#19182c,#2a2943);border-color:rgba(255,255,255,.08)}
.wz-app-trial-card>img{position:absolute;right:-4px;top:-8px;width:86px;opacity:.18;filter:grayscale(1) brightness(3)}
.wz-app-trial-card .wz-panel-eyebrow{background:#ffe27a;color:#6f4900;border:0;position:relative;z-index:1}
.wz-app-trial-card h3{position:relative;z-index:1;font-size:22px;line-height:1.18;font-weight:900;letter-spacing:-.03em;margin:15px 0 10px}
.wz-app-trial-card p{position:relative;z-index:1;font-size:12.5px;line-height:1.6;color:rgba(255,255,255,.70);font-weight:700;margin:0 0 16px}
.wz-app-trial-btn{position:relative;z-index:1;display:flex;align-items:center;justify-content:center;min-height:52px;border-radius:14px;background:linear-gradient(135deg,#e5323b,#ff5a62);color:#fff;text-decoration:none;font-size:14.5px;font-weight:900;box-shadow:0 18px 36px rgba(229,50,59,.34)}
.wz-app-trust{position:relative;z-index:1;display:flex;flex-wrap:wrap;justify-content:center;gap:7px 10px;margin-top:13px}
.wz-app-trust span{font-size:10.5px;font-weight:800;color:rgba(255,255,255,.58)}
.wz-app-trust span::before{content:'✓ ';color:#4caf50}
.wz-process-card{padding:15px}
.wz-process-title{font-size:11px;font-weight:900;color:#8a96aa;text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px}
.wz-process-step{display:flex;gap:10px;padding:10px 0;border-top:1px solid #eef2f7}
.wz-process-step:first-of-type{border-top:0;padding-top:0}
.wz-process-step span{width:26px;height:26px;border-radius:999px;background:#fff1f1;border:2px solid #e5323b;color:#e5323b;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:900;flex-shrink:0}
.wz-process-step strong{display:block;font-size:12.5px;font-weight:900;color:#1a1a2e;line-height:1.25;margin-bottom:3px}
.wz-process-step p{font-size:11px;line-height:1.42;color:#667085;font-weight:650;margin:0}
.wz-sent-email-note{display:flex;align-items:flex-start;gap:9px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:14px;padding:11px 15px;font-size:12px;color:#1d4ed8;line-height:1.55}
.wz-sent-email-note span{width:18px;height:18px;border-radius:999px;background:#dbeafe;color:#1d4ed8;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:900;flex-shrink:0;margin-top:1px}
.wz-sent-email-note p{margin:0;font-weight:650}
.wz-sent-back{display:flex;align-items:center;justify-content:center;min-height:44px;margin:0 auto;background:transparent;border:none;font-size:13px;font-weight:750;color:#6b7280;text-decoration:none;padding:8px 10px;cursor:pointer;transition:color .18s}
.wz-sent-back:hover{color:#e5323b}

@media(max-width:899px){
  .wz-container:has(.wz-success){width:calc(100vw - 18px);height:calc(100dvh - 18px);max-height:calc(100dvh - 18px);border-radius:22px}
  .wz-success-page{padding:14px 12px 22px;gap:12px;max-width:none}
  .wz-result-hero{grid-template-columns:auto minmax(0,1fr);gap:12px;padding:18px;border-radius:20px}
  .wz-result-mascot{display:none}
  .wz-result-check{width:46px;height:46px;border-radius:15px}
  .wz-result-copy h2{font-size:19px}
  .wz-result-copy p{font-size:12px}
  .wz-result-summary{grid-column:1 / -1;grid-template-columns:1fr}
  .wz-result-summary div{border-right:0;border-bottom:1px solid #e7edf5}
  .wz-result-summary div:last-child{border-bottom:0}
  .wz-result-summary strong{white-space:normal}
  .wz-result-layout{grid-template-columns:1fr;gap:12px}
  .wz-follow-panel{padding:15px;border-radius:18px}
  .wz-panel-eyebrow{font-size:9.5px}
  .wz-follow-head{flex-direction:column;gap:10px;margin-top:12px}
  .wz-follow-head h3{font-size:20px}
  .wz-follow-head p{font-size:12px}
  .wz-follow-mascots img{width:34px;height:34px}
  .wz-follow-reason{grid-template-columns:1fr;gap:4px}
  .wz-follow-list{grid-template-columns:1fr}
  .wz-follow-card{min-height:0}
  .wz-after-submit{gap:12px}
  .wz-app-trial-card{position:relative;top:auto;border-radius:18px;padding:18px 16px}
  .wz-app-trial-card h3{font-size:19px}
  .wz-app-trial-card p{font-size:12px}
  .wz-process-card{border-radius:18px}
}
@media(max-width:420px){
  .wz-success-page{padding:10px 9px 18px}
  .wz-result-hero{padding:16px 14px}
  .wz-result-check{width:42px;height:42px}
  .wz-result-copy h2{font-size:17px}
  .wz-result-badges span{font-size:9.5px}
  .wz-follow-panel{padding:13px}
  .wz-follow-head h3{font-size:18px}
  .wz-follow-card{grid-template-columns:30px minmax(0,1fr);padding:12px}
  .wz-follow-icon{width:30px;height:30px}
  .wz-follow-mascot{display:none}
  .wz-follow-copy{padding-right:0}
  .wz-follow-copy strong{white-space:normal}
  .wz-app-trial-btn{font-size:13px}
}

/* Fit success content to the user's viewport instead of leaving empty side gutters */
@media(min-width:900px){
  .wz-overlay:has(.wz-success){
    padding:clamp(12px,2vh,22px) clamp(14px,2.6vw,42px);
  }
  .wz-container:has(.wz-success){
    width:clamp(960px,72vw,1120px);
    max-width:calc(100vw - clamp(28px,5.2vw,84px));
    height:min(850px,calc(100dvh - clamp(24px,4vh,44px)));
    max-height:calc(100dvh - clamp(24px,4vh,44px));
    border-radius:28px;
  }
  .wz-success-page{
    width:100%;
    max-width:none;
    padding:clamp(18px,2.2vw,26px);
    gap:clamp(12px,1.3vw,16px);
  }
  .wz-result-layout{
    grid-template-columns:minmax(0,1fr) clamp(318px,30%,356px);
    gap:clamp(12px,1.4vw,16px);
  }
  .wz-result-hero{padding:20px clamp(20px,2.2vw,26px)}
  .wz-follow-panel{padding:clamp(15px,1.6vw,18px)}
  .wz-result-copy p{max-width:none}
  .wz-follow-head h3{max-width:620px}
  .wz-follow-head p{max-width:720px}
}

@media(min-width:1180px){
  .wz-container:has(.wz-success){
    width:min(1120px,calc(100vw - 96px));
  }
}

@media(min-width:900px) and (max-width:1180px){
  .wz-container:has(.wz-success){
    width:calc(100vw - 40px);
    max-width:1080px;
  }
}

@media(min-width:900px) and (max-height:760px){
  .wz-container:has(.wz-success){
    height:calc(100dvh - 24px);
    max-height:calc(100dvh - 24px);
  }
  .wz-success-page{padding:16px;gap:12px}
  .wz-result-hero{padding:16px 18px}
  .wz-result-check{width:48px;height:48px}
  .wz-result-copy h2{font-size:22px}
  .wz-result-copy p{font-size:12.3px;line-height:1.5}
  .wz-result-summary div{padding:9px 12px}
  .wz-follow-panel{padding:14px}
  .wz-follow-head{margin:10px 0}
  .wz-follow-head h3{font-size:21px}
  .wz-follow-head p{font-size:12px;line-height:1.5}
  .wz-follow-reason{padding:9px 11px;margin-bottom:10px}
  .wz-follow-card{min-height:124px;padding:11px}
  .wz-follow-copy p{font-size:11px;line-height:1.38}
  .wz-follow-btn{height:34px}
  .wz-app-trial-card{padding:18px}
  .wz-app-trial-card h3{font-size:19px}
  .wz-app-trial-card p{font-size:11.5px}
  .wz-process-card{padding:13px}
}

/* Fill the success modal width: remove the visible empty gutters on desktop */
.wz-success,
.wz-success-inner,
.wz-success-scroll,
.wz-success-page{
  width:100%!important;
  max-width:none!important;
}
.wz-success-inner,
.wz-success-page{
  margin:0!important;
}

@media(min-width:900px){
  .wz-container:has(.wz-success){
    width:min(1320px,calc(100vw - 28px));
    max-width:min(1320px,calc(100vw - 28px));
  }
  .wz-success-page{
    width:100%;
    max-width:none;
    margin:0;
    padding:clamp(12px,1.15vw,18px);
    gap:clamp(12px,1.15vw,16px);
  }
  .wz-result-layout{
    grid-template-columns:minmax(0,1fr) minmax(330px,34%);
    gap:clamp(12px,1.15vw,16px);
  }
  .wz-result-hero{
    padding:clamp(18px,1.65vw,24px);
  }
  .wz-follow-panel{
    padding:clamp(16px,1.35vw,20px);
  }
  .wz-app-trial-card,
  .wz-process-card{
    width:100%;
  }
}

@media(min-width:900px) and (max-width:1100px){
  .wz-container:has(.wz-success){
    width:calc(100vw - 20px);
    max-width:calc(100vw - 20px);
  }
  .wz-result-layout{
    grid-template-columns:minmax(0,1fr) 320px;
  }
}
`;
