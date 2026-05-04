"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { isValidEmail, isValidPhone, isValidUrl } from "@/lib/application";
import Mascot from "@/app/components/Mascot";
import type { MascotState } from "@/app/components/Mascot";
import { motion } from "framer-motion";

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
    msg: "Chọn 1 category trước, rồi tick các hướng phù hợp bên trong category đó.",
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
    msg: "Thêm năm nhập học để team hiểu giai đoạn học của bạn.",
  },
  graduation: {
    pose: "focused",
    msg: "Thêm mốc ra trường dự kiến để team sắp xếp kỳ thực tập.",
  },
  cv: {
    pose: "contact",
    msg: "Dán link CV hoặc portfolio, nhớ bật quyền xem công khai nhé.",
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
  1: "experience",
  2: "strengths",
  3: "contact",
  4: "review",
};

interface GuideDot {
  key: GuideKey;
  label: string;
  y: number;
}

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
  review: "Review",
};

const ERROR_GUIDE_KEY: Record<string, GuideKey> = {
  career_journey: "positions",
  interest_reason: "interests",
  why_apply: "why",
  work_preference: "availability",
  goal: "goals",
  phone: "contact",
  telegram_username: "telegram",
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

/* ─────────────── types ─────────────── */
interface FormData {
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
  is_zalo_phone: boolean;
  has_telegram: boolean;
  telegram_username: string;
  school: string;
  enrollment: string;
  graduation: string;
  cv: string;
}

const EMPTY: FormData = {
  email: "",
  career_journey: [],
  interest_reason: [],
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
};

const STORAGE_KEY = "markee_application_draft";

const CAREER_OPTIONS = [
  {
    label: "Network Team",
    sub: "Routing · Switching · Firewall · VPN",
    team: "Infrastructure",
    color: "#3b82f6",
    abbr: "NET",
  },
  {
    label: "System Team",
    sub: "Windows · Linux · Virtualization · Server",
    team: "Infrastructure",
    color: "#3b82f6",
    abbr: "SYS",
  },
  {
    label: "Security Team",
    sub: "SIEM · Monitoring · Log Analysis",
    team: "Infrastructure",
    color: "#3b82f6",
    abbr: "SEC",
  },
  {
    label: "Hội nghị & Tổng đài",
    sub: "Teams · Zoom · VoIP · Call Center",
    team: "Infrastructure",
    color: "#3b82f6",
    abbr: "COM",
  },
  {
    label: "Cloud & Datacenter",
    sub: "Cloud Ops · Datacenter Operations",
    team: "Infrastructure",
    color: "#3b82f6",
    abbr: "CLD",
  },
  {
    label: "BA",
    sub: "Business Analyst",
    team: "Dev/DevOps",
    color: "#8b5cf6",
    abbr: "BA",
  },
  {
    label: "Backend Developer",
    sub: "API · Database · Server logic",
    team: "Dev/DevOps",
    color: "#8b5cf6",
    abbr: "BE",
  },
  {
    label: "Frontend Developer",
    sub: "React · UI/UX · Web",
    team: "Dev/DevOps",
    color: "#8b5cf6",
    abbr: "FE",
  },
  {
    label: "Full-stack Developer",
    sub: "End-to-end development",
    team: "Dev/DevOps",
    color: "#8b5cf6",
    abbr: "FS",
  },
  {
    label: "DevOps / Platform",
    sub: "CI/CD · Docker · Cloud",
    team: "Dev/DevOps",
    color: "#8b5cf6",
    abbr: "OPS",
  },
  {
    label: "AI / ML Engineer",
    sub: "Machine Learning · Deep Learning",
    team: "AI",
    color: "#ef4444",
    abbr: "ML",
  },
  {
    label: "Data Analyst / Engineer",
    sub: "Data Pipeline · Analytics",
    team: "AI",
    color: "#ef4444",
    abbr: "DA",
  },
  {
    label: "AI Product / Research",
    sub: "AI Product · Research",
    team: "AI",
    color: "#ef4444",
    abbr: "RES",
  },
  {
    label: "Content & Social",
    sub: "Content Marketing · Social Media",
    team: "Marketing",
    color: "#f59e0b",
    abbr: "CNT",
  },
  {
    label: "Performance & Acquisition",
    sub: "Ads · Growth · Conversion",
    team: "Marketing",
    color: "#f59e0b",
    abbr: "PRF",
  },
  {
    label: "Marketing Ops",
    sub: "Automation · Analytics · CRM",
    team: "Marketing",
    color: "#f59e0b",
    abbr: "MKT",
  },
  {
    label: "B2B Sales",
    sub: "Account Executive · Solution Sales",
    team: "Sales",
    color: "#10b981",
    abbr: "B2B",
  },
  {
    label: "Business Development",
    sub: "Partnership · New Market",
    team: "Sales",
    color: "#10b981",
    abbr: "BD",
  },
  {
    label: "Customer Success",
    sub: "Onboarding · Retention",
    team: "Sales",
    color: "#10b981",
    abbr: "CS",
  },
];

const TEAM_FILTERS = [
  "Infrastructure",
  "Dev/DevOps",
  "AI",
  "Marketing",
  "Sales",
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

const WORK_ROWS = ["Hybrid", "Part-time", "Full-time", "Onsite"];
const WORK_COLS = ["Hồ Chí Minh", "Đà Nẵng", "Online"];

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

function hasWorkPreference(form: FormData) {
  return Object.values(form.work_preference).some((v) => v.length > 0);
}

function validateIntro(form: FormData): StepErrors {
  const e: StepErrors = {};
  if (!form.full_name.trim()) e.full_name = "Họ tên là bắt buộc";
  if (!form.email.trim()) e.email = "Email là bắt buộc";
  else if (!isValidEmail(form.email.trim())) e.email = "Email không hợp lệ";
  return e;
}

function validateStep(step: number, form: FormData): StepErrors {
  const e: StepErrors = {};
  if (step === 0) {
    if (!form.career_journey.length)
      e.career_journey = "Vui lòng chọn ít nhất 1 hướng trong 1 category";
    else if (getSelectedCareerTeams(form.career_journey).length !== 1)
      e.career_journey = "Chỉ chọn 1 category/team cho mỗi hồ sơ";
    if (Object.keys(e).length) return e;

    if (!form.interest_reason.length)
      e.interest_reason = "Vui lòng chọn điều hứng thú";
    if (Object.keys(e).length) return e;

    if (!form.why_apply.trim())
      e.why_apply = "Vui lòng cho biết lý do ứng tuyển";
  } else if (step === 1) {
    if (!form.experience.trim())
      e.experience = "Vui lòng chia sẻ kinh nghiệm liên quan";
    if (Object.keys(e).length) return e;

    if (!form.skills.trim()) e.skills = "Vui lòng liệt kê kỹ năng/công cụ";
    if (!form.goal.trim()) e.goal = "Vui lòng chia sẻ mục tiêu thực tập";
    if (Object.keys(e).length) return e;

    if (!hasWorkPreference(form))
      e.work_preference = "Vui lòng chọn hình thức/địa điểm phù hợp";
    if (Object.keys(e).length) return e;

    if (!form.note.trim()) e.note = "Vui lòng nhắn gửi thêm cho team";
  } else if (step === 2) {
    if (!form.strengths.trim()) e.strengths = "Vui lòng chia sẻ điểm mạnh";
    if (!form.weaknesses.trim())
      e.weaknesses = "Vui lòng chia sẻ điểm cần cải thiện";
    if (Object.keys(e).length) return e;

    if (!form.expectation.trim())
      e.expectation = "Vui lòng chia sẻ mong muốn trong 3 tháng đầu";
    if (Object.keys(e).length) return e;

    if (!form.problem_solving.length)
      e.problem_solving = "Vui lòng chọn ít nhất 1";
    if (!form.feedback_response.length)
      e.feedback_response = "Vui lòng chọn ít nhất 1";
  } else if (step === 3) {
    if (!form.phone.trim()) e.phone = "SĐT là bắt buộc";
    else if (!isValidPhone(form.phone.trim())) e.phone = "SĐT không hợp lệ";
    if (form.has_telegram && !form.telegram_username.trim())
      e.telegram_username = "Vui lòng nhập username Telegram";
    else if (
      form.has_telegram &&
      !isValidTelegramUsername(form.telegram_username)
    )
      e.telegram_username = "Telegram username cần có dạng @username";
    if (Object.keys(e).length) return e;

    if (!form.dob) e.dob = "Ngày sinh là bắt buộc";
    if (!form.school.trim()) e.school = "Trường là bắt buộc";
    if (Object.keys(e).length) return e;

    if (!form.enrollment) e.enrollment = "Năm nhập học là bắt buộc";
    if (!form.graduation) e.graduation = "Dự kiến ra trường là bắt buộc";
    if (Object.keys(e).length) return e;

    if (!form.cv.trim()) e.cv = "CV/Portfolio là bắt buộc";
    if (form.cv.trim() && !isValidUrl(form.cv.trim()))
      e.cv = "Link không hợp lệ";
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
        ? `${hey}thêm mã trường trong ngoặc và chuyên ngành nhé. Ví dụ: Đại học Bách Khoa (QSB) – An toàn thông tin.`
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
      msg: `${hey}tick lịch hoặc hình thức làm việc phù hợp với bạn nhé.`,
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
      msg: `${hey}thêm năm nhập học để team hiểu lộ trình học của bạn.`,
    },
    graduation: {
      pose: "focused",
      msg: `${hey}thêm mốc ra trường dự kiến để team sắp xếp kỳ thực tập.`,
    },
    cv: {
      pose: "contact",
      msg: form.cv.trim()
        ? `${hey}link CV cần bắt đầu bằng http hoặc https, kiểm tra lại nhé.`
        : `${hey}dán link CV hoặc portfolio, nhớ bật quyền xem giúp mình nhé.`,
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
    form.interest_reason.length > 0 &&
    hasText(form.why_apply);
  const hasCapability =
    hasText(form.experience) &&
    hasText(form.skills) &&
    hasText(form.goal) &&
    hasWorkPreference(form) &&
    hasText(form.note);
  const hasReflection =
    hasText(form.strengths) && hasText(form.weaknesses);
  const hasBehavior =
    form.problem_solving.length > 0 && form.feedback_response.length > 0;
  const hasProfile =
    isValidPhone(form.phone.trim()) &&
    (!form.has_telegram || isValidTelegramUsername(form.telegram_username)) &&
    Boolean(form.dob) &&
    hasText(form.school) &&
    Boolean(form.enrollment) &&
    Boolean(form.graduation) &&
    Boolean(form.cv.trim());

  if (key === "default") {
    if (step === 0) {
      if (hasDirection)
        return {
          pose: "encourage",
          msg: `${hey}hướng ứng tuyển rõ rồi. Tiếp theo mình hỏi kinh nghiệm và kỹ năng nhé.`,
        };
      return {
        pose: "presenting",
        msg: `${hey}chọn team hoặc vị trí trước, mình sẽ mở câu hỏi liên quan sau.`,
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
        msg: `${hey}mình cần vài dự án, kỹ năng và lịch làm việc để hiểu bạn hơn.`,
      };
    }
    if (step === 2) {
      if (
        hasReflection &&
        hasBehavior &&
        hasText(form.expectation)
      )
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
        msg: `${hey}thêm thông tin liên hệ, học tập và link CV để hồ sơ đầy đủ.`,
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
    if (!isValidPhone(form.phone.trim())) {
      return {
        pose: "contact",
        msg: `${hey}thêm SĐT bạn hay dùng để team liên hệ nhé.`,
      };
    }
    if (form.has_telegram && !form.telegram_username.trim()) {
      return {
        pose: "contact",
        msg: `${hey}bạn tick có Telegram rồi, nhập thêm @username bên dưới nhé.`,
      };
    }
    return {
      pose: "encourage",
      msg: form.is_zalo_phone
        ? `${hey}SĐT kiêm Zalo đã ổn. Tiếp theo thêm ngày sinh và trường nhé.`
        : `${hey}SĐT ổn rồi. Nếu số này là Zalo, tick thêm để team dễ liên hệ nhé.`,
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
    return {
      pose: "encourage",
      msg: `${hey}thông tin trường đã có. Thêm mốc nhập học nữa nhé.`,
    };
  }

  if (key === "enrollment") {
    return form.enrollment
      ? {
          pose: "encourage",
          msg: `${hey}mốc nhập học đã có rồi. Còn dự kiến ra trường nữa thôi.`,
        }
      : GUIDE.enrollment;
  }

  if (key === "graduation") {
    return form.graduation
      ? {
          pose: "encourage",
          msg: `${hey}mốc ra trường đã có. Giờ dán link CV hoặc portfolio nhé.`,
        }
      : GUIDE.graduation;
  }

  if (key === "positions") {
    if (selectedCount === 0)
      return {
        pose: "presenting",
        msg: `${hey}chọn 1 category, rồi tick các hướng phù hợp bên trong category đó nhé.`,
      };
    return {
      pose: "encourage",
      msg: `${hey}mình sẽ hỏi theo các hướng bạn đã chọn. Tiếp theo chọn lý do bạn hứng thú nhé.`,
    };
  }

  if (key === "interests") {
    return form.interest_reason.length
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
}: {
  onClose: () => void;
}) {
  const [showIntro, setShowIntro] = useState(true);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [checking, setChecking] = useState(false);
  const [errors, setErrors] = useState<StepErrors>({});
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [teamFilter, setTeamFilter] = useState("Infrastructure");
  const csrfTokenRef = useRef<string>("");
  const bodyRef = useRef<HTMLDivElement>(null);
  const guideRailRef = useRef<HTMLDivElement>(null);
  const guideScrollFrameRef = useRef<number | null>(null);
  const guideManualLockUntilRef = useRef(0);

  /* ── Mascot guide ── */
  const [activeSection, setActiveSection] = useState<GuideKey>(
    STEP_DEFAULT_KEY[0] ?? "default",
  );
  const [guideDots, setGuideDots] = useState<GuideDot[]>([]);
  const [guideY, setGuideY] = useState(96);
  const activeSectionRef = useRef<GuideKey>(STEP_DEFAULT_KEY[0] ?? "default");
  const guide = getSmartGuide(activeSection, step, form, errors);
  const hasGuideError = Object.keys(errors).length > 0;
  const mascotY = guideY + 18;

  const bubbleRef = useRef<HTMLDivElement>(null);

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
    if (!rail) return 96;
    const railRect = rail.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const minY = Math.min(96, Math.max(84, railRect.height - 160));
    const maxY = Math.max(minY, railRect.height - 160);
    const targetY = elRect.top + elRect.height / 2 - railRect.top;
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
    (el: HTMLElement | null, shouldSyncDots = true) => {
      if (!el) return;
      const key = el.dataset.guide as GuideKey | undefined;
      if (!key) return;
      setActiveSection((prev) => (prev === key ? prev : key));
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

    activateGuideElement(closest, true);
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
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-guide]");
      guideManualLockUntilRef.current = Date.now() + 900;
      activateGuideElement(el);
    },
    [activateGuideElement],
  );

  const handleBodyPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-guide]");
      guideManualLockUntilRef.current = Date.now() + 650;
      activateGuideElement(el);
    },
    [activateGuideElement],
  );

  const handleBodyInput = useCallback(
    (e: React.FormEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-guide]");
      guideManualLockUntilRef.current = Date.now() + 1000;
      activateGuideElement(el, false);
    },
    [activateGuideElement],
  );

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setForm((p) => ({ ...p, ...JSON.parse(saved) }));
    } catch {
      /* ignore */
    }
  }, []);

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
      return {
        ...p,
        [key]: arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val],
      };
    });
    setErrors((p) => {
      const n = { ...p };
      delete n[key];
      return n;
    });
  }, []);

  const toggleGrid = useCallback((row: string, col: string) => {
    setForm((p) => {
      const wp = { ...p.work_preference };
      const arr = wp[row] || [];
      wp[row] = arr.includes(col)
        ? arr.filter((c) => c !== col)
        : [...arr, col];
      return { ...p, work_preference: wp };
    });
    setErrors((p) => {
      const n = { ...p };
      delete n.work_preference;
      return n;
    });
  }, []);

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
    // Check duplicate phone on step 3
    if (step === 3 && form.phone.trim()) {
      setChecking(true);
      try {
        const res = await fetch(
          `/api/applications/check?phone=${encodeURIComponent(form.phone.trim())}`,
        );
        const data = await res.json();
        if (data.exists) {
          setErrors({ phone: data.message });
          setChecking(false);
          return;
        }
      } catch {
        /* proceed if check fails */
      }
      setChecking(false);
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
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfTokenRef.current,
        },
        body: JSON.stringify(form),
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
    } catch {
      /* proceed if check fails */
    }
    setChecking(false);
    setErrors({});
    setShowIntro(false);
    setActiveSection(STEP_DEFAULT_KEY[0] ?? "default");
  };

  const pct = Math.round(((step + 1) / STEPS.length) * 100);

  return (
    <>
      <style>{wizardCSS}</style>
      <div className="wz-overlay">
        <div className="wz-container">
          {submitted ? (
            <SuccessScreen onClose={onClose} name={form.full_name} />
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

              <div
                className={`wz-mobile-guide${hasGuideError ? " warn" : ""}`}
                aria-live="polite"
              >
                <div className="wz-mobile-guide-mascot">
                  <Mascot
                    state={guide.pose}
                    size={56}
                    interactive
                    hoverState="greeting"
                  />
                </div>
                <div className="wz-mobile-guide-copy">{guide.msg}</div>
              </div>

              {/* ── Two-column: guide lane (left) + form body (right) ── */}
              <div className="wz-main">
                <div
                  className="wz-guide-rail"
                  ref={guideRailRef}
                  aria-live="polite"
                >
                  <motion.div
                    className="wz-guide-mascot"
                    animate={{ y: mascotY }}
                    transition={{
                      duration: 0.56,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <motion.div
                      ref={bubbleRef}
                      key={`${step}-${guide.msg}`}
                      className={`wz-float-bubble${hasGuideError ? " warn" : ""}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.18, ease: [0.25, 1, 0.5, 1] }}
                    >
                      {guide.msg}
                    </motion.div>
                    <div className="wz-float-mascot-wrap">
                      <div className="wz-float-glow" />
                      <Mascot
                        state={guide.pose}
                        size={124}
                        className={`wz-guide-mascot-img ${guide.pose}`}
                        interactive
                        hoverState="greeting"
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
                      teamFilter={teamFilter}
                      setTeamFilter={setTeamFilter}
                      errors={errors}
                    />
                  )}
                  {step === 1 && (
                    <Step2
                      form={form}
                      set={set}
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
                    <Step4 form={form} set={set} errors={errors} />
                  )}
                  {step === 4 && <Step5 form={form} goTo={goTo} />}
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
                  {step === 0 ? "Sửa tên/email" : "Quay lại"}
                </button>
                <div className="wz-footer-center">
                  {Object.keys(errors).length > 0 && (
                    <span className="wz-footer-err">
                      Còn trường bắt buộc chưa điền
                    </span>
                  )}
                </div>
                {step < LAST_STEP ? (
                  <button
                    className="wz-btn-next"
                    onClick={goNext}
                    disabled={checking}
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
  const name = getCandidateName(form.full_name);
  const canStart =
    Boolean(form.full_name.trim()) && isValidEmail(form.email.trim());
  const hasName = Boolean(form.full_name.trim());
  const hasEmail = Boolean(form.email.trim());
  const hasEmailReady = isValidEmail(form.email.trim());
  const greeting = (() => {
    if (errors.full_name && errors.email) {
      return "Mình cần tên và email trước để bắt đầu cho gọn nhé.";
    }
    if (errors.full_name) {
      return "Cho mình biết tên để xưng hô tự nhiên hơn nhé.";
    }
    if (errors.email) {
      return hasEmail
        ? "Email có vẻ chưa đúng, kiểm tra lại giúp mình nhé."
        : "Thêm email bạn hay dùng để team liên hệ nhé.";
    }
    if (canStart) {
      return `Chào ${name}, mình đã sẵn sàng. Bấm bắt đầu nhé.`;
    }
    if (hasName && !hasEmailReady) {
      return `${name}, thêm email nữa là mình đưa bạn vào form.`;
    }
    if (!hasName && hasEmailReady) {
      return "Email ổn rồi, thêm tên để mình xưng hô tự nhiên nhé.";
    }
    return "Xin chào! Nhập tên và email nhé, mình sẽ hướng dẫn bạn từng phần.";
  })();
  const introPose: MascotState =
    errors.full_name || errors.email
      ? "warning"
      : canStart
        ? "encourage"
        : hasName || hasEmail
          ? "focused"
          : "greeting";

  return (
    <div className="wz-intro">
      <button className="wz-intro-close" onClick={onClose} aria-label="Đóng">
        ✕
      </button>
      <div className="wz-intro-content">
        <div className="wz-intro-panel">
          <div className="wz-intro-copy">
            <div className="wz-intro-mascot-stage">
              <span className="wz-intro-speech">{greeting}</span>
              <Mascot
                state={introPose}
                size={224}
                className="wz-intro-mascot"
                interactive
                hoverState={canStart ? "celebrate" : "presenting"}
              />
            </div>
            <span className="wz-intro-kicker">
              Markee Recruitment · Internship 2026
            </span>
            <h2 className="wz-intro-title">
              Ứng tuyển Markee cùng mascot guide
            </h2>
            <p className="wz-intro-desc">
              Nhập tên và email trước để mascot xưng hô tự nhiên, sau đó mình
              mới hỏi định hướng, kỹ năng và hồ sơ.
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
              <strong>{name ? `Hi ${name}` : "Làm quen trước"}</strong>
            </div>
            <div className="wz-info-card full" data-guide="full_name">
              <label className="wz-label">
                Họ và tên <span className="wz-req">*</span>
              </label>
              <input
                className={`wz-input ${errors.full_name ? "wz-input-err" : form.full_name ? "wz-input-ok" : ""}`}
                placeholder="Nguyen Van A"
                value={form.full_name}
                onChange={(e) => set("full_name", e.target.value)}
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
                onChange={(e) => set("email", e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onStart();
                }}
              />
              <FieldError error={errors.email} />
            </div>

            <button
              className="wz-btn-start"
              onClick={onStart}
              disabled={checking}
            >
              {checking ? "Đang kiểm tra..." : "Bắt đầu ứng tuyển"}
            </button>
            <p className="wz-intro-hint">Tiến trình được lưu tự động</p>
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
  teamFilter,
  setTeamFilter,
  errors,
}: {
  form: FormData;
  set: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
  toggleArr: (k: keyof FormData, v: string) => void;
  teamFilter: string;
  setTeamFilter: (f: string) => void;
  errors: StepErrors;
}) {
  const selectedTeams = getSelectedCareerTeams(form.career_journey);
  const selectedTeam = selectedTeams[0] ?? null;
  const activeTeam = selectedTeam ?? teamFilter;
  const filtered = CAREER_OPTIONS.filter((o) => o.team === activeTeam);
  const careerSelected = form.career_journey.length > 0;
  const interestSelected = form.interest_reason.length > 0;
  const selectedCount = form.career_journey.length;
  const filterCount = (filter: string) =>
    CAREER_OPTIONS.filter((o) => o.team === filter).length;
  const handleTeamSelect = (team: string) => {
    setTeamFilter(team);
    if (selectedTeam && selectedTeam !== team) {
      set("career_journey", []);
    }
  };

  return (
    <div className="wz-step-content">
      <div className="wz-section-hero">
        <span className="wz-hero-badge">BƯỚC 1</span>
        <h2 className="wz-section-title">Bạn muốn thực tập hướng nào?</h2>
        <p className="wz-section-sub">
          Chọn team/vị trí trước, rồi mình mới hỏi lý do ứng tuyển liên quan
        </p>
      </div>

      <div className="wz-section-card wz-section-main" data-guide="positions">
        <div className="wz-career-head">
          <div>
            <span className="wz-card-kicker">Career path</span>
            <h3 className="wz-zone-title">
              Career Journey / Team <span className="wz-req">*</span>
            </h3>
            <p className="wz-zone-sub">
              Chọn 1 category duy nhất, rồi tick bao nhiêu hướng bên trong cũng được.
            </p>
          </div>
          <div className="wz-career-head-badge">
            <span>{filtered.length}</span>
            hướng trong category
          </div>
        </div>
        <FieldError error={errors.career_journey} />
        <div className="wz-career-guide">
          <span className="wz-career-guide-kicker">Gợi ý từ Markee</span>
          <span className="wz-career-guide-text">
            Đang xem {filtered.length} hướng thuộc {activeTeam}. Đổi category sẽ bỏ chọn hướng cũ.
          </span>
        </div>
        <div className="wz-filter-tabs">
          {TEAM_FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              className={`wz-filter-tab ${activeTeam === f ? "active" : ""}`}
              onClick={() => handleTeamSelect(f)}
            >
              <span>{f}</span>
              <span className="wz-filter-count">{filterCount(f)}</span>
            </button>
          ))}
        </div>
        <div className="wz-selected-summary">
          <span className="wz-selected-meter">
            Đã chọn {selectedCount} hướng trong {activeTeam}
          </span>
          <span>
            Chỉ dùng 1 category cho mỗi hồ sơ; bên trong category có thể chọn nhiều hướng.
          </span>
        </div>
        <div className="wz-career-grid">
          {filtered.map((opt) => {
            const checked = form.career_journey.includes(opt.label);
            return (
              <button
                key={opt.label}
                type="button"
                className={`wz-career-card ${checked ? "checked" : ""}`}
                onClick={() => toggleArr("career_journey", opt.label)}
              >
                <span className="wz-cc-abbr" style={{ background: opt.color }}>
                  {opt.abbr}
                </span>
                <div className="wz-cc-info">
                  <span className="wz-cc-label">{opt.label}</span>
                  <span className="wz-cc-sub">{opt.sub}</span>
                </div>
                <div className="wz-cc-check">{checked ? "\u2713" : ""}</div>
              </button>
            );
          })}
        </div>
        {form.career_journey.length > 0 && (
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
        )}
      </div>

      <div className={`wz-reveal ${careerSelected ? "show" : ""}`}>
        <div>
          <div className="wz-section-card" data-guide="interests">
            <label className="wz-label-big">
              Điều gì khiến bạn hứng thú nhất? <span className="wz-req">*</span>
            </label>
            <p className="wz-hint">Có thể chọn nhiều lý do</p>
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
          </div>
        </div>
      </div>

      <div className={`wz-reveal ${interestSelected ? "show" : ""}`}>
        <div>
          <div className="wz-section-card" data-guide="why">
            <label className="wz-label-big">
              Vì sao bạn muốn ứng tuyển vị trí này?{" "}
              <span className="wz-req">*</span>
            </label>
            <p className="wz-hint">
              Chia sẻ ngắn gọn vì sao vị trí này phù hợp với định hướng của bạn.
            </p>
            <textarea
              className={`wz-textarea ${errors.why_apply ? "wz-input-err" : form.why_apply ? "wz-input-ok" : ""}`}
              rows={4}
              placeholder="Mình muốn ứng tuyển vì..."
              value={form.why_apply}
              onChange={(e) => set("why_apply", e.target.value)}
            />
            <TextFieldFooter
              error={errors.why_apply}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   STEP 2
   ══════════════════════════════════════════════════ */
function Step2({
  form,
  set,
  toggleGrid,
  errors,
}: {
  form: FormData;
  set: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
  toggleGrid: (r: string, c: string) => void;
  errors: StepErrors;
}) {
  const experienceDone = Boolean(form.experience.trim());
  const skillGoalDone =
    Boolean(form.skills.trim()) && Boolean(form.goal.trim());
  const workSelected = hasWorkPreference(form);

  return (
    <div className="wz-step-content">
      <div className="wz-section-hero">
        <span className="wz-hero-badge">BƯỚC 2</span>
        <h2 className="wz-section-title">Năng lực & định hướng</h2>
        <p className="wz-section-sub">
          Lấy đúng các câu về dự án, kỹ năng, mục tiêu và cách bạn muốn làm việc
        </p>
      </div>

      <div className="wz-section-card" data-guide="experience">
        <label className="wz-label-big">
          Công việc / dự án / CLB / freelance liên quan{" "}
          <span className="wz-req">*</span>
        </label>
        <p className="wz-hint">
          Nêu vai trò và kết quả ngắn gọn, giống yêu cầu trong Google Form.
        </p>
        <textarea
          className={`wz-textarea ${errors.experience ? "wz-input-err" : form.experience ? "wz-input-ok" : ""}`}
          rows={4}
          placeholder="Ví dụ: tham gia dự án firewall mô phỏng, viết content quảng cáo, làm đồ án..."
          value={form.experience}
          onChange={(e) => set("experience", e.target.value)}
        />
        <TextFieldFooter
          error={errors.experience}
        />
      </div>

      <div className={`wz-reveal ${experienceDone ? "show" : ""}`}>
        <div>
          <div className="wz-section-card" data-guide="skills">
            <label className="wz-label-big">
              Kỹ năng hoặc công cụ đã sử dụng <span className="wz-req">*</span>
            </label>
            <p className="wz-hint">
              Ví dụ: Wireshark, Canva, Excel, ChatGPT, Python, Google Ads...
            </p>
            <textarea
              className={`wz-textarea ${errors.skills ? "wz-input-err" : form.skills ? "wz-input-ok" : ""}`}
              rows={3}
              placeholder="Figma, React, Python, Canva, Google Ads..."
              value={form.skills}
              onChange={(e) => set("skills", e.target.value)}
            />
            <TextFieldFooter
              error={errors.skills}
            />
          </div>

          <div className="wz-section-card" data-guide="goals">
            <label className="wz-label-big">
              Mục tiêu thực tập / định hướng sự nghiệp{" "}
              <span className="wz-req">*</span>
            </label>
            <p className="wz-hint">
              Bạn muốn học gì, thử sức ở đâu, phát triển kỹ năng nào?
            </p>
            <textarea
              className={`wz-textarea ${errors.goal ? "wz-input-err" : form.goal ? "wz-input-ok" : ""}`}
              rows={3}
              placeholder="Sau kỳ thực tập, bạn muốn đạt được gì?"
              value={form.goal}
              onChange={(e) => set("goal", e.target.value)}
            />
            <TextFieldFooter
              error={errors.goal}
            />
          </div>
        </div>
      </div>

      <div className={`wz-reveal ${skillGoalDone ? "show" : ""}`}>
        <div>
          <div className="wz-section-card" data-guide="availability">
            <label className="wz-label-big">
              Bạn muốn làm việc ở đâu? <span className="wz-req">*</span>
            </label>
            <p className="wz-hint">Tick vào các ô phù hợp với bạn</p>
            <FieldError error={errors.work_preference} />
            <div className="wz-grid-table">
              <div className="wz-grid-header">
                <div className="wz-grid-corner" />
                {WORK_COLS.map((col) => (
                  <div key={col} className="wz-grid-col-head">
                    {col}
                  </div>
                ))}
              </div>
              {WORK_ROWS.map((row) => (
                <div key={row} className="wz-grid-row">
                  <div className="wz-grid-row-label">{row}</div>
                  {WORK_COLS.map((col) => {
                    const checked = (form.work_preference[row] || []).includes(
                      col,
                    );
                    return (
                      <div key={col} className="wz-grid-cell">
                        <button
                          type="button"
                          className={`wz-grid-check ${checked ? "checked" : ""}`}
                          onClick={() => toggleGrid(row, col)}
                        >
                          {checked && "\u2713"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={`wz-reveal ${workSelected ? "show" : ""}`}>
        <div>
          <div className="wz-section-card" data-guide="note">
            <label className="wz-label-big">
              Có điều gì bạn muốn nhắn gửi thêm cho team không?{" "}
              <span className="wz-req">*</span>
            </label>
            <textarea
              className={`wz-textarea ${errors.note ? "wz-input-err" : form.note ? "wz-input-ok" : ""}`}
              rows={3}
              placeholder="Bạn có thể viết ngắn một lời nhắn, kỳ vọng hoặc thông tin team nên biết."
              value={form.note}
              onChange={(e) => set("note", e.target.value)}
            />
            <TextFieldFooter
              error={errors.note}
            />
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
          Không có câu trả lời đúng sai — chia sẻ ngắn gọn là đủ
        </p>
      </div>

      <div className="wz-reflection-card" data-guide="strengths">
        <div className="wz-rc-header">
          <h3 className="wz-rc-title">
            3 điểm mạnh lớn nhất <span className="wz-req">*</span>
          </h3>
          <p className="wz-rc-hint">Liệt kê ngắn gọn — không cần viết dài</p>
        </div>
        <textarea
          className={`wz-textarea ${errors.strengths ? "wz-input-err" : form.strengths ? "wz-input-ok" : ""}`}
          rows={3}
          placeholder="Tư duy logic, chịu áp lực tốt, học nhanh..."
          value={form.strengths}
          onChange={(e) => set("strengths", e.target.value)}
        />
        <TextFieldFooter
          error={errors.strengths}
        />
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
          placeholder="Đôi khi quá cầu toàn, cần cải thiện time management..."
          value={form.weaknesses}
          onChange={(e) => set("weaknesses", e.target.value)}
        />
        <TextFieldFooter
          error={errors.weaknesses}
        />
      </div>

      <div className={`wz-reveal ${reflectionDone ? "show" : ""}`}>
        <div>
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
              placeholder="Mình mong muốn..."
              value={form.expectation}
              onChange={(e) => set("expectation", e.target.value)}
            />
            <TextFieldFooter
              error={errors.expectation}
            />
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
}: {
  form: FormData;
  set: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
  errors: StepErrors;
}) {
  const telegramVisible = form.has_telegram;

  return (
    <div className="wz-step-content">
      <div className="wz-section-hero">
        <span className="wz-hero-badge">BƯỚC 4</span>
        <h2 className="wz-section-title">Hồ sơ cá nhân</h2>
        <p className="wz-section-sub">
          Những thông tin cuối để team liên hệ, kiểm tra lịch học và xem hồ sơ
        </p>
      </div>

      <div className="wz-info-grid">
        <div className="wz-info-card full" data-guide="contact">
          <label className="wz-label">
            Số điện thoại / Zalo <span className="wz-req">*</span>
          </label>
          <p className="wz-hint">
            Team sẽ nhắn lịch phỏng vấn qua đây. Nhập số điện thoại chính của
            bạn.
          </p>
          <input
            className={`wz-input ${errors.phone ? "wz-input-err" : form.phone && isValidPhone(form.phone) ? "wz-input-ok" : ""}`}
            placeholder="0912 345 678"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
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
          </div>
        </div>

        <div className={`wz-reveal ${telegramVisible ? "show" : ""}`}>
          <div>
            <div className="wz-info-card full" data-guide="telegram">
              <label className="wz-label">
                Telegram username <span className="wz-req">*</span>
              </label>
              <p className="wz-hint">
                Nhập username bắt đầu bằng @ để team nhắn đúng tài khoản.
              </p>
              <input
                className={`wz-input ${errors.telegram_username ? "wz-input-err" : form.telegram_username && isValidTelegramUsername(form.telegram_username) ? "wz-input-ok" : ""}`}
                placeholder="@markee_candidate"
                value={form.telegram_username}
                onChange={(e) => set("telegram_username", e.target.value)}
              />
              <FieldError error={errors.telegram_username} />
            </div>
          </div>
        </div>

        <div className="wz-info-card" data-guide="dob">
          <label className="wz-label">
            Ngày sinh <span className="wz-req">*</span>
          </label>
          <input
            className={`wz-input ${errors.dob ? "wz-input-err" : form.dob ? "wz-input-ok" : ""}`}
            type="date"
            value={form.dob}
            onChange={(e) => set("dob", e.target.value)}
          />
          <FieldError error={errors.dob} />
        </div>

        <div className="wz-info-card" data-guide="school">
          <label className="wz-label">
            Trường Đại học / Cao đẳng <span className="wz-req">*</span>
          </label>
          <p className="wz-hint">
            Ghi theo mẫu: Tên trường (Mã trường) – Ngành học.
          </p>
          <input
            className={`wz-input ${errors.school ? "wz-input-err" : form.school ? "wz-input-ok" : ""}`}
            placeholder="Đại học Bách Khoa (QSB) – Ngành An toàn thông tin"
            value={form.school}
            onChange={(e) => set("school", e.target.value)}
          />
          <FieldError error={errors.school} />
        </div>

        <div className="wz-info-card" data-guide="enrollment">
          <label className="wz-label">
            Năm nhập học <span className="wz-req">*</span>
          </label>
          <input
            className={`wz-input ${errors.enrollment ? "wz-input-err" : form.enrollment ? "wz-input-ok" : ""}`}
            type="date"
            value={form.enrollment}
            onChange={(e) => set("enrollment", e.target.value)}
          />
          <FieldError error={errors.enrollment} />
        </div>

        <div className="wz-info-card" data-guide="graduation">
          <label className="wz-label">
            Dự kiến ra trường <span className="wz-req">*</span>
          </label>
          <input
            className={`wz-input ${errors.graduation ? "wz-input-err" : form.graduation ? "wz-input-ok" : ""}`}
            type="date"
            value={form.graduation}
            onChange={(e) => set("graduation", e.target.value)}
          />
          <FieldError error={errors.graduation} />
        </div>

        <div className="wz-info-card full" data-guide="cv">
          <label className="wz-label">
            CV / Portfolio <span className="wz-req">*</span>
          </label>
          <p className="wz-hint">
            Dán link Google Drive, LinkedIn, GitHub hoặc portfolio. Nhớ mở quyền
            xem.
          </p>
          <input
            className={`wz-input ${errors.cv ? "wz-input-err" : form.cv && isValidUrl(form.cv) ? "wz-input-ok" : ""}`}
            placeholder="https://..."
            value={form.cv}
            onChange={(e) => set("cv", e.target.value)}
          />
          <FieldError error={errors.cv} />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   STEP 5 — Review
   ══════════════════════════════════════════════════ */
function Step5({ form, goTo }: { form: FormData; goTo: (s: number) => void }) {
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
        step={3}
        goTo={goTo}
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
          { label: "Điều hứng thú", value: form.interest_reason.join(", ") },
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
          { label: "CV", value: form.cv },
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
  items,
}: {
  title: string;
  step: number;
  goTo: (s: number) => void;
  items: { label: string; value: string }[];
}) {
  const optional: string[] = [];
  const hasEmpty = items.some((i) => !i.value && !optional.includes(i.label));
  return (
    <div className={`wz-review-card ${hasEmpty ? "has-empty" : ""}`}>
      <div className="wz-rc-head">
        <span className="wz-rc-head-title">{title}</span>
        <button className="wz-rc-edit-btn" onClick={() => goTo(step)}>
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
const SUCCESS_TIPS = [
  "📬 Kiểm tra email (cả thư mục spam)",
  "🌐 Theo dõi markeeai.com nhé!",
  "💬 Liên hệ hello@markeeai.com nếu cần hỗ trợ",
];

function SuccessScreen({
  onClose,
  name,
}: {
  onClose: () => void;
  name: string;
}) {
  const [tipIdx, setTipIdx] = useState(0);
  const [tipVisible, setTipVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setTipVisible(false);
      setTimeout(() => {
        setTipIdx((i) => (i + 1) % SUCCESS_TIPS.length);
        setTipVisible(true);
      }, 420);
    }, 4800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="wz-success">
      <div className="wz-success-marquee">
        <span>
          Chào mừng bạn đến với Markee AI &nbsp;&bull;&nbsp; Welcome to Markee
          AI &nbsp;&bull;&nbsp; Chào mừng bạn đến với Markee AI
          &nbsp;&bull;&nbsp; Welcome to Markee AI &nbsp;&bull;&nbsp;
        </span>
        <span aria-hidden="true">
          Chào mừng bạn đến với Markee AI &nbsp;&bull;&nbsp; Welcome to Markee
          AI &nbsp;&bull;&nbsp; Chào mừng bạn đến với Markee AI
          &nbsp;&bull;&nbsp; Welcome to Markee AI &nbsp;&bull;&nbsp;
        </span>
      </div>
      <div className="wz-success-mascot-wrap">
        <div className={`wz-success-tip${tipVisible ? " visible" : ""}`}>
          {SUCCESS_TIPS[tipIdx]}
        </div>
        <video
          className="wz-success-video"
          src="/img/mascot_t/AI_mascot.webm"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
      <h2 className="wz-success-title">Nộp hồ sơ thành công!</h2>
      <p className="wz-success-name">
        Cảm ơn <strong>{name || "bạn"}</strong>!
      </p>
      <p className="wz-success-desc">
        Team tuyển dụng sẽ review và phản hồi qua email trong{" "}
        <strong>3–5 ngày làm việc</strong>.
      </p>
      <div className="wz-success-social">
        <p className="wz-success-social-label">
          🎉 Follow & cập nhật tin tức mới nhất từ Markee AI!
        </p>
        <div className="wz-social-links">
          <a
            href="https://www.facebook.com/markeeaimarketing"
            target="_blank"
            rel="noopener noreferrer"
            className="wz-social-link wz-social-fb"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook
          </a>
          <a
            href="https://www.instagram.com/markeeaimarketing1111/"
            target="_blank"
            rel="noopener noreferrer"
            className="wz-social-link wz-social-ig"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            Instagram
          </a>
          <a
            href="https://t.me/+zl4qiUlVDQ44ZDE9"
            target="_blank"
            rel="noopener noreferrer"
            className="wz-social-link wz-social-tg"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
            Telegram
          </a>
          <a
            href="https://discord.com/channels/1443163286773170218/1443240299416522924"
            target="_blank"
            rel="noopener noreferrer"
            className="wz-social-link wz-social-discord"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.079.111 18.1.129 18.11a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            Discord
          </a>
          <a
            href="https://invite.viber.com/?g2=AQAP4%2FUS7E8NqlYDXE7sn5XUpn3hiArfFeLU0p%2FXKJ2RjplQ4QvPZqwYHFpQj6ew"
            target="_blank"
            rel="noopener noreferrer"
            className="wz-social-link wz-social-viber"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.398.002C9.473.028 5.331.344 3.014 2.467 1.294 4.177.693 6.698.623 9.82c-.07 3.121-.154 8.972 5.5 10.548h.005l-.005 2.417s-.038.997.624 1.2c.805.248 1.277-.512 2.046-1.332.422-.453.997-1.116 1.434-1.62 3.95.33 6.986-.424 7.331-.537.798-.258 5.315-.836 6.049-6.819.757-6.161-.366-10.052-2.94-11.797l-.001-.001c-.714-.481-3.574-1.781-8.783-1.877a16.16 16.16 0 0 0-.48-.002zm.038 1.72a14.62 14.62 0 0 1 .434.002c4.685.084 7.207 1.212 7.812 1.616 2.131 1.441 3.07 4.925 2.387 10.286-.613 5.027-4.252 5.354-4.918 5.566-.293.095-3.001.755-6.459.526 0 0-2.563 3.087-3.359 3.887-.123.124-.266.173-.362.15-.135-.034-.172-.197-.17-.436l.022-3.782c-4.814-1.337-4.742-6.31-4.682-9.05.064-2.741.561-4.9 2.009-6.337 1.95-1.78 5.487-2.029 7.286-2.028zm.139 2.62c-.277-.003-.454.274-.311.516.135.225.328.393.487.6.38.489.717 1.003.994 1.546a9.867 9.867 0 0 1 .919 3.546c.02.277.28.47.551.418.27-.052.457-.309.437-.586a11.573 11.573 0 0 0-1.077-4.152 9.52 9.52 0 0 0-1.169-1.82c-.19-.231-.484-.366-.77-.068l-.06-.001zm-3.62.526a2.064 2.064 0 0 0-.413.043c-.424.09-.824.34-1.106.67-.27.32-.41.715-.38 1.117.06.82.48 1.537.937 2.218.457.681.967 1.33 1.546 1.912.58.58 1.23 1.09 1.912 1.547.682.456 1.398.876 2.218.937.403.03.797-.11 1.118-.38.33-.282.58-.682.67-1.107.09-.424-.02-.864-.27-1.206-.25-.342-.64-.54-1.05-.556-.41-.016-.82.122-1.148.358l-.25.19a.55.55 0 0 1-.567.058 7.685 7.685 0 0 1-2.75-2.751.553.553 0 0 1 .058-.567l.19-.25c.236-.327.374-.737.358-1.147-.016-.41-.214-.8-.556-1.05a1.64 1.64 0 0 0-.517-.237zm4.041.848c-.2.016-.365.17-.357.374.008.204.16.35.363.375.586.07 1.073.318 1.453.748.38.43.573.97.57 1.559-.003.203.144.37.347.388.204.019.385-.129.404-.332a3.574 3.574 0 0 0-.814-2.537 3.122 3.122 0 0 0-1.966-1.175zm.697 1.618c-.203.013-.362.19-.345.393.004.05.014.094.03.134.07.178.22.302.41.318.08.007.143.065.155.144.013.079-.03.154-.103.182a.376.376 0 0 0-.235.473.376.376 0 0 0 .473.235c.43-.153.692-.608.617-1.056-.075-.448-.474-.796-.93-.82l-.072-.003z" />
            </svg>
            Viber
          </a>
        </div>
      </div>
      <button
        className="wz-btn-next"
        onClick={onClose}
        style={{ marginTop: 24, paddingInline: 44 }}
      >
        Đóng
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   CSS
   ══════════════════════════════════════════════════ */
const wizardCSS = `
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
.wz-container{background:rgba(255,255,255,.94);backdrop-filter:blur(24px);width:100%;height:100%;max-width:1080px;max-height:94vh;border-radius:30px;border:1px solid rgba(255,255,255,.22);display:flex;flex-direction:column;overflow:hidden;box-shadow:0 34px 110px rgba(0,0,0,.36),0 0 0 1px rgba(255,255,255,.14),inset 0 1px 0 rgba(255,255,255,.58);animation:wzSlideUp .4s cubic-bezier(.34,1.56,.64,1);font-family:var(--font-geist-sans),-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif}
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
.wz-intro-halo{display:none}
.wz-intro-speech{position:absolute;left:224px;top:2px;width:218px;min-height:72px;padding:14px 16px;border-radius:18px 18px 18px 6px;background:rgba(255,255,255,.96);border:1px solid rgba(255,255,255,.76);box-shadow:0 20px 42px rgba(0,0,0,.20),0 3px 10px rgba(15,23,42,.08);font-size:13px;font-weight:750;line-height:1.42;color:#172033;z-index:2;display:flex;align-items:center}
.wz-intro-speech::after{content:'';position:absolute;left:-7px;top:42px;width:14px;height:14px;background:rgba(255,255,255,.96);border-left:1px solid rgba(255,255,255,.76);border-bottom:1px solid rgba(255,255,255,.76);transform:rotate(45deg);border-radius:0 0 0 3px}
.wz-intro-mascot{filter:drop-shadow(0 22px 34px rgba(0,0,0,.32));position:relative;z-index:1}
@keyframes wzBounceIn{from{transform:scale(.76) translateY(16px);opacity:0}to{transform:scale(1) translateY(0);opacity:1}}
.wz-intro-kicker{display:inline-flex;padding:5px 12px;border-radius:999px;background:rgba(239,68,68,.18);border:1px solid rgba(248,113,113,.36);font-size:10px;font-weight:900;color:#fecaca;letter-spacing:.11em;text-transform:uppercase;margin-bottom:14px}
.wz-intro-title{font-size:42px;font-weight:950;line-height:1.14;letter-spacing:-.04em;margin:0 0 14px;color:#fff;max-width:430px}
.wz-intro-desc{font-size:15px;line-height:1.75;color:rgba(255,255,255,.7);margin:0;max-width:410px}
.wz-intro-pills{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}
.wz-intro-pills span{display:inline-flex;align-items:center;height:30px;padding:0 12px;border-radius:999px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.07);color:rgba(255,255,255,.82);font-size:12px;font-weight:700}
.wz-intro-form{background:rgba(255,255,255,.94);backdrop-filter:blur(18px);border:1px solid rgba(255,255,255,.72);border-radius:24px;padding:20px;box-shadow:0 28px 80px rgba(0,0,0,.30),0 18px 46px rgba(239,68,68,.10),inset 0 1px 0 rgba(255,255,255,.88);display:flex;flex-direction:column;gap:12px;position:relative}
.wz-intro-form::before{content:'';position:absolute;inset:0;border-radius:24px;background:linear-gradient(135deg,rgba(239,68,68,.05),transparent 48%);pointer-events:none}
.wz-intro-form-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding:2px 2px 6px;position:relative;z-index:1}
.wz-intro-form-head strong{font-size:18px;color:#0f172a;letter-spacing:-.02em;line-height:1.25}
.wz-intro-form-kicker{font-size:10px;font-weight:900;letter-spacing:.14em;text-transform:uppercase;color:#94a3b8}
.wz-intro-form .wz-info-card{border-color:#e2e8f0;background:rgba(255,255,255,.92);padding:14px;position:relative;z-index:1}
.wz-intro-form .wz-btn-start{width:100%;margin-top:2px}
.wz-intro-chat{display:flex;flex-direction:column;gap:10px;max-width:500px;width:100%;margin-bottom:36px}
.wz-intro-bubble{background:rgba(255,255,255,.06);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.08);border-radius:14px;border-top-left-radius:4px;padding:16px 22px;color:rgba(255,255,255,.88);font-size:15px;line-height:1.65;opacity:0;transform:translateY(12px);transition:all .45s cubic-bezier(.22,1,.36,1);min-height:52px;display:flex;align-items:center}
.wz-intro-bubble.visible{opacity:1;transform:none}
.wz-intro-bubble p{margin:0}
.wz-typing{display:inline-flex;gap:5px;padding:4px 0}
.wz-typing span{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.5);animation:wzTypingDot 1.4s ease-in-out infinite}
.wz-typing span:nth-child(2){animation-delay:.2s}
.wz-typing span:nth-child(3){animation-delay:.4s}
@keyframes wzTypingDot{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-7px);opacity:1}}
.wz-intro-cta{opacity:0;transform:translateY(20px);transition:all .5s cubic-bezier(.22,1,.36,1);text-align:center}
.wz-intro-cta.visible{opacity:1;transform:none}
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
.wz-progress-section{padding:14px 30px 12px;border-bottom:1px solid rgba(226,232,240,.72);background:rgba(255,255,255,.86);backdrop-filter:blur(14px);flex-shrink:0}
@media(max-width:640px){.wz-progress-section{padding:14px 18px 12px}}
.wz-steps-row{display:flex;gap:6px;margin-bottom:12px}
.wz-step-btn{flex:1;display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:100px;border:1px solid #e2e8f0;background:#fafbfc;cursor:default;transition:all .25s;text-align:left}
.wz-step-btn.active{border-color:#ef4444;border-width:2px;background:#fff5f5;box-shadow:0 2px 12px rgba(239,68,68,.18),0 0 0 3px rgba(239,68,68,.08);animation:wz-pulse 2s ease-in-out infinite}
@keyframes wz-pulse{0%,100%{box-shadow:0 2px 12px rgba(239,68,68,.18),0 0 0 3px rgba(239,68,68,.08)}50%{box-shadow:0 2px 16px rgba(239,68,68,.25),0 0 0 5px rgba(239,68,68,.06)}}
.wz-step-btn.done{border-color:#bbf7d0;background:#f0fdf4;cursor:pointer}
.wz-step-btn.done:hover{background:#dcfce7;border-color:#86efac}
.wz-step-circle{width:26px;height:26px;border-radius:50%;background:#e2e8f0;color:#94a3b8;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .25s}
.wz-step-num{font-size:12px;font-weight:800;line-height:1}
.wz-step-btn.active .wz-step-circle{background:linear-gradient(180deg,#ef4444,#dc2626);color:#fff;box-shadow:0 2px 6px rgba(239,68,68,.28)}
.wz-step-btn.done .wz-step-circle{background:#10b981;color:#fff;font-size:11px;font-weight:700}
.wz-step-info{display:flex;flex-direction:column;min-width:0}
.wz-step-name{font-size:12px;font-weight:600;color:#64748b;letter-spacing:-.01em}
.wz-step-btn.active .wz-step-name{color:#b91c1c;font-weight:700}
.wz-step-btn.done .wz-step-name{color:#15803d}
.wz-step-desc{display:none}
.wz-bar-wrap{display:flex;align-items:center;gap:10px}
.wz-bar-track{flex:1;height:3px;background:#f1f5f9;border-radius:100px;overflow:hidden}
.wz-bar-fill{height:100%;border-radius:100px;background:linear-gradient(90deg,#10b981 0%,#059669 100%);transition:width .6s cubic-bezier(.34,1.56,.64,1);box-shadow:0 0 8px rgba(16,185,129,.4)}
.wz-bar-label{font-size:10px;font-weight:600;color:#94a3b8;white-space:nowrap}
.wz-mobile-guide{display:none}

/* ─── Premium guide rail (narrower, more visible line) ─── */
.wz-main{display:grid;grid-template-columns:176px minmax(0,1fr);column-gap:32px;flex:1;min-height:0;overflow:visible;padding:0 32px;position:relative;max-width:1120px;margin:0 auto;width:100%;box-sizing:border-box;background:#fff}
.wz-guide-rail{position:absolute;left:34px;top:32px;bottom:24px;width:152px;z-index:20;overflow:visible;pointer-events:none}
.wz-guide-track,.wz-guide-dot{display:none}
.wz-guide-mascot{position:absolute;top:0;left:10px;width:140px;height:140px;z-index:3;pointer-events:auto;will-change:transform}
.wz-float-bubble{position:absolute;bottom:calc(100% + 18px);left:50%;transform:translateX(-50%);pointer-events:auto;background:#fff;border:1px solid rgba(15,23,42,.06);border-radius:17px;padding:13px 15px;width:178px;min-height:66px;font-size:12px;font-weight:700;color:#0F172A;line-height:1.42;letter-spacing:-.005em;box-shadow:0 16px 36px rgba(15,23,42,.11),0 3px 8px rgba(15,23,42,.05);text-align:center;display:flex;align-items:center;justify-content:center;word-break:normal;overflow-wrap:break-word}
.wz-float-bubble::after{content:'';position:absolute;bottom:-6px;left:50%;transform:translateX(-50%) rotate(45deg);width:11px;height:11px;background:#fff;border-right:1px solid rgba(15,23,42,.06);border-bottom:1px solid rgba(15,23,42,.06);border-radius:0 0 2px 0}

.wz-float-bubble.warn{background:#FFF7F7;color:#B91C1C;box-shadow:0 18px 40px rgba(185,28,28,.12),0 4px 12px rgba(15,23,42,.05)}
.wz-float-bubble.warn::after{background:#FFF7F7;filter:drop-shadow(0 1px 1px rgba(185,28,28,.08))}

.wz-float-mascot-wrap{position:absolute;left:50%;bottom:0;transform:translateX(-50%);display:flex;align-items:center;justify-content:center;pointer-events:none;filter:drop-shadow(0 14px 24px rgba(15,23,42,.14))}
.wz-float-glow{position:absolute;width:148px;height:148px;border-radius:50%;background:radial-gradient(circle,rgba(239,59,59,.18) 0%,transparent 65%);pointer-events:none;animation:wzPulseGlow 2.4s ease-in-out infinite}
@keyframes wzPulseGlow{0%,100%{opacity:.6;transform:scale(1)}50%{opacity:1;transform:scale(1.04)}}
.wz-guide-mascot-img{transition:filter .24s cubic-bezier(.22,1,.36,1),transform .24s cubic-bezier(.22,1,.36,1)}
.wz-guide-mascot-img.warning{filter:saturate(1.1) drop-shadow(0 8px 16px rgba(239,68,68,.16))}
.wz-guide-mascot-img.success,.wz-guide-mascot-img.encourage,.wz-guide-mascot-img.celebrate{transform:translateY(-2px)}
.wz-guide-mascot-img.focused,.wz-guide-mascot-img.listening,.wz-guide-mascot-img.thinking{filter:saturate(1.04) contrast(1.02)}
.wz-guide-mascot-img.contact,.wz-guide-mascot-img.presenting{filter:drop-shadow(0 10px 18px rgba(15,23,42,.10))}

.wz-body{grid-column:2;position:relative;z-index:1;height:100%;overflow-y:auto;padding:32px 4px 104px 0;scroll-behavior:smooth;background:transparent;min-width:0}
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
.wz-footer-err{font-size:11px;color:#f59e0b;font-weight:600}
.wz-btn-back{padding:11px 22px;border-radius:12px;border:1px solid #e2e8f0;background:#fff;font-size:13px;font-weight:600;color:#64748b;cursor:pointer;transition:all .2s;white-space:nowrap}
.wz-btn-back:hover:not(:disabled){background:#f8fafc;color:#0f172a;border-color:#cbd5e1}
.wz-btn-back:disabled{opacity:.3;cursor:not-allowed}
.wz-btn-next{min-width:160px;height:48px;padding:0 28px;border-radius:12px;border:none;background:linear-gradient(180deg,#ef4444 0%,#dc2626 100%);font-size:14px;font-weight:700;color:#fff;cursor:pointer;transition:transform .22s cubic-bezier(.22,1,.36,1),box-shadow .22s;box-shadow:0 4px 12px rgba(239,68,68,.20),inset 0 1px 0 rgba(255,255,255,.18);white-space:nowrap;display:inline-flex;align-items:center;justify-content:center;gap:8px;letter-spacing:-.01em}
.wz-btn-next:hover{transform:translateY(-1px);box-shadow:0 8px 18px rgba(239,68,68,.28),inset 0 1px 0 rgba(255,255,255,.18)}
.wz-btn-arrow{font-size:16px;transition:transform .2s;line-height:1}
.wz-btn-next:hover .wz-btn-arrow{transform:translateX(3px)}
.wz-btn-submit{min-width:160px;height:48px;padding:0 28px;border-radius:12px;border:none;background:linear-gradient(180deg,#ef4444 0%,#dc2626 100%);font-size:14px;font-weight:700;color:#fff;cursor:pointer;transition:transform .22s cubic-bezier(.22,1,.36,1),box-shadow .22s;box-shadow:0 4px 12px rgba(239,68,68,.20),inset 0 1px 0 rgba(255,255,255,.18);display:flex;align-items:center;justify-content:center;gap:8px;letter-spacing:-.01em}
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
.wz-section-title{grid-column:2;grid-row:1;font-size:clamp(20px,2.05vw,24px);font-weight:800;color:#0f172a;letter-spacing:-.02em;margin:0;line-height:1.18;position:relative;z-index:1;min-width:0;overflow-wrap:anywhere;text-wrap:balance}
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
.wz-section-card:has(.wz-input:not(:placeholder-shown))::after,
.wz-section-card:has(.wz-textarea:not(:placeholder-shown))::after,
.wz-section-card:has(.wz-career-card.checked)::after,
.wz-section-card:has(.wz-interest-pill.checked)::after,
.wz-section-card:has(.wz-grid-check.checked)::after{content:'';position:absolute;top:18px;right:18px;width:8px;height:8px;border-radius:999px;background:#10b981;box-shadow:0 0 0 3px rgba(16,185,129,.16);animation:wzPopDot .3s cubic-bezier(.34,1.56,.64,1)}
@keyframes wzPopDot{0%{transform:scale(0)}100%{transform:scale(1)}}
[data-guide].wz-guide-active{border-color:#fca5a5!important;box-shadow:0 0 0 3px rgba(239,68,68,.06),0 8px 22px rgba(15,23,42,.08)!important}
.wz-section-card.wz-guide-active:not(.wz-section-main)::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:linear-gradient(180deg,#ef4444,#fb7185);opacity:.7;border-radius:0}
.wz-section-card.wz-section-main.wz-guide-active::before{opacity:1;width:5px}
.wz-field-group.wz-guide-active{border-radius:14px}
.wz-review-hero.wz-guide-active{box-shadow:0 0 0 2px rgba(239,68,68,.14),0 8px 24px rgba(15,23,42,.10)!important}

/* ─── Step content layout ─── */
.wz-step-content{width:100%;font-family:var(--font-geist-sans),-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif}
.wz-field-group{margin-bottom:0}

/* Email — inside section card now */
.wz-email-row .wz-label{font-size:13px;color:#475569;margin-bottom:8px;font-weight:600}
.wz-email-row .wz-input{background:rgba(248,250,252,.58)}

/* Zone — main action area headline */
.wz-zone-title{font-size:22px;font-weight:800;color:#0f172a;margin:8px 0 6px;letter-spacing:-.03em}
.wz-zone-sub{font-size:13px;color:#94a3b8;margin:0 0 14px;line-height:1.5}
.wz-career-head{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;margin-bottom:16px;position:relative;z-index:1}
.wz-card-kicker{display:inline-flex;font-size:10px;font-weight:900;letter-spacing:.14em;text-transform:uppercase;color:#94a3b8}
.wz-career-head-badge{display:flex;flex-direction:column;align-items:center;justify-content:center;min-width:92px;padding:10px 12px;border-radius:14px;background:rgba(255,255,255,.76);border:1px solid #e2e8f0;color:#64748b;font-size:11px;font-weight:700;line-height:1.25;text-align:center}
.wz-career-head-badge span{font-size:22px;font-weight:900;color:#334155;letter-spacing:-.04em;line-height:1}

/* Generic labels */
.wz-label{display:block;font-size:13px;font-weight:600;color:#475569;margin-bottom:8px}
.wz-label-big{display:block;font-size:15px;font-weight:700;color:#0f172a;margin-bottom:6px;letter-spacing:-.01em}
.wz-req{color:#ef4444;font-weight:400;margin-left:2px}
.wz-hint{font-size:12.5px;color:#64748b;margin:-2px 0 12px;line-height:1.55}
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
.wz-textarea::placeholder{color:#94a3b8}
.wz-textarea:hover{background:#f8fafc;border-color:#b8c5d4}
.wz-textarea:focus{color:#0f172a;background:#fff;border-color:#f87171;box-shadow:0 0 0 4px rgba(239,68,68,.10),0 8px 20px rgba(15,23,42,.035)}
.wz-textarea.wz-input-err{border-color:#fca5a5!important;background:#fff7f7!important}
.wz-textarea.wz-input-ok{border-color:#cfd9e6!important}
.wz-textarea.wz-input-ok:focus{background:#fff!important;border-color:#f87171!important;box-shadow:0 0 0 4px rgba(239,68,68,.10),0 8px 20px rgba(15,23,42,.035)!important}

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
.wz-career-card.checked{border-color:#fca5a5;background:linear-gradient(180deg,#fff7f7 0%,#fff 100%);box-shadow:0 0 0 3px rgba(239,68,68,.075),0 14px 24px rgba(239,68,68,.08)}
.wz-career-card.checked::before{opacity:.68}
.wz-cc-top{display:none}
.wz-cc-abbr{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:#fff;letter-spacing:.04em;flex-shrink:0;box-shadow:0 4px 12px rgba(15,23,42,.12);transition:transform .22s,box-shadow .22s}
.wz-career-card:hover .wz-cc-abbr{transform:scale(1.06);box-shadow:0 6px 16px rgba(15,23,42,.16)}
.wz-career-card.checked .wz-cc-abbr{box-shadow:0 4px 14px rgba(0,0,0,.2)}
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

/* ─── Interest pills ─ stronger contrast for selected state ─── */
.wz-interest-grid{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:4px}
.wz-interest-pill{display:flex;align-items:center;padding:9px 16px;border-radius:100px;border:1px solid #e2e8f0;background:#fff;font-size:13px;font-weight:500;color:#475569;cursor:pointer;transition:all .18s cubic-bezier(.22,1,.36,1)}
.wz-interest-pill:hover{border-color:#94a3b8;background:#f8fafc;color:#0f172a;transform:translateY(-1px)}
.wz-interest-pill.checked{border-color:#ef4444;background:#fef2f2;color:#b91c1c;font-weight:700;box-shadow:0 2px 8px rgba(239,68,68,.12)}

/* ─── Reflection cards (Step 2) ─── */
.wz-reflection-card{position:relative;margin-bottom:14px;padding:22px 24px;border-radius:16px;border:1px solid #e8ecf1;background:#fff;overflow:hidden;transition:border-color .22s ease,box-shadow .22s ease,transform .22s ease}
.wz-reflection-card:hover{border-color:#cbd5e1;box-shadow:0 4px 14px rgba(15,23,42,.05)}
.wz-reflection-card:focus-within{border-color:#cbd5e1;box-shadow:0 6px 18px rgba(15,23,42,.07)}
.wz-reflection-card.wz-guide-active::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:linear-gradient(180deg,#ef4444,#fb7185);opacity:.7}
.wz-reflection-card:has(.wz-textarea:not(:placeholder-shown))::after,
.wz-reflection-card:has(.wz-input:not(:placeholder-shown))::after,
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

/* ─── Work preference matrix (softer, rounded) ─── */
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
.wz-info-card:has(.wz-input:not(:placeholder-shown))::after{content:'';position:absolute;top:14px;right:14px;width:7px;height:7px;border-radius:999px;background:#10b981;box-shadow:0 0 0 3px rgba(16,185,129,.16)}
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
.wz-rc-edit-btn{padding:5px 12px;border-radius:8px;border:1px solid #e2e8f0;background:#fff;font-size:12px;font-weight:600;color:#64748b;cursor:pointer;transition:all .18s}
.wz-rc-edit-btn:hover{background:#fef2f2;border-color:#fca5a5;color:#dc2626}
.wz-rc-body{padding:14px 18px}
.wz-rv-row{display:flex;gap:12px;padding:7px 0;border-bottom:1px solid #f8fafc;font-size:13px}
.wz-rv-row:last-child{border-bottom:none}
.wz-rv-label{min-width:130px;flex-shrink:0;font-weight:600;color:#94a3b8;font-size:12px}
.wz-rv-value{color:#0f172a;line-height:1.6;word-break:break-word}
.wz-rv-empty-note{font-size:12px;color:#b45309;font-weight:600;padding:6px 12px;border-radius:8px;background:#fef3c7;border:1px solid #fde68a;margin-top:8px;display:inline-block}
.wz-submit-notice{padding:14px 18px;border-radius:12px;background:#f8fafc;border:1px solid #e2e8f0;font-size:13px;color:#64748b;margin-top:8px;line-height:1.5}

/* ─── Success ─── */
.wz-success{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:40px 40px 56px;flex:1;background:radial-gradient(ellipse at 50% 0%,rgba(239,68,68,.07) 0%,#fff 58%);position:relative;overflow:visible}
.wz-success-marquee{position:absolute;top:0;left:0;right:0;height:38px;background:linear-gradient(90deg,#ef4444,#f97316,#ef4444);display:flex;align-items:center;overflow:hidden;z-index:2;white-space:nowrap}
.wz-success-marquee span{display:inline-block;white-space:nowrap;font-size:12px;font-weight:800;color:#fff;letter-spacing:.06em;text-transform:uppercase;animation:wzMarquee 16s linear infinite;flex-shrink:0;padding-right:0}
@keyframes wzMarquee{from{transform:translateX(0)}to{transform:translateX(-100%)}}
.wz-success-tip{background:#fff;border:1.5px solid rgba(239,68,68,.22);border-radius:16px 16px 16px 4px;padding:10px 16px;font-size:12.5px;font-weight:700;color:#0f172a;max-width:185px;width:max-content;display:flex;align-items:center;justify-content:center;text-align:left;box-shadow:0 4px 18px rgba(15,23,42,.10);opacity:0;position:absolute;top:14px;left:54%;transform:translateY(-4px);transition:opacity .45s ease,transform .45s ease;z-index:10;pointer-events:none;line-height:1.45}
.wz-success-tip::after{content:'';position:absolute;bottom:-7px;left:16px;transform:rotate(-45deg);width:12px;height:12px;background:#fff;border-left:1.5px solid rgba(239,68,68,.22);border-bottom:1.5px solid rgba(239,68,68,.22);border-radius:0 0 0 3px}
.wz-success-tip.visible{opacity:1;transform:translateY(0)}
.wz-success-mascot-wrap{width:300px;height:300px;margin-bottom:12px;margin-top:4px;animation:wzBounceIn .6s cubic-bezier(.34,1.56,.64,1);display:flex;align-items:center;justify-content:center;position:relative}
.wz-success-mascot-wrap::before{content:'';position:absolute;width:240px;height:240px;border-radius:50%;background:radial-gradient(circle,rgba(239,68,68,.2) 0%,rgba(251,146,60,.1) 44%,transparent 72%);animation:wzPulseGlow 2.6s ease-in-out infinite;pointer-events:none}
.wz-success-mascot-wrap::after{content:'';position:absolute;width:268px;height:268px;border-radius:50%;border:2px dashed rgba(239,68,68,.22);animation:wzRotateSlow 14s linear infinite;pointer-events:none}
@keyframes wzRotateSlow{to{transform:rotate(360deg)}}
.wz-success-video{width:100%;height:100%;object-fit:contain}
.wz-success-title{font-size:28px;font-weight:900;color:#0f172a;margin-bottom:8px;letter-spacing:-.03em}
.wz-success-name{font-size:15px;color:#475569;margin-bottom:4px}
.wz-success-desc{font-size:14px;color:#64748b;line-height:1.7;max-width:380px}
.wz-success-checklist{display:flex;flex-direction:column;gap:8px;margin-top:28px;width:100%;max-width:360px}
.wz-sc-item{padding:12px 18px;border-radius:12px;background:#f8fafc;border:1px solid #e2e8f0;font-size:13px;color:#475569;text-align:left;animation:wzFadeUp .4s ease both}
.wz-sc-item:nth-child(1){animation-delay:.3s}
.wz-sc-item:nth-child(2){animation-delay:.5s}
.wz-sc-item:nth-child(3){animation-delay:.7s}
@keyframes wzFadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
.wz-success-social{margin-top:24px;width:100%;max-width:460px;animation:wzFadeUp .4s ease both;animation-delay:.9s;background:linear-gradient(135deg,#fff5f5 0%,#f0f9ff 55%,#fdf4ff 100%);border:1.5px solid rgba(239,68,68,.16);border-radius:20px;padding:20px 24px 22px;box-shadow:0 8px 32px rgba(239,68,68,.09),0 2px 8px rgba(15,23,42,.04)}
.wz-success-social-label{font-size:14px;font-weight:800;color:#0f172a;margin:0 0 14px;text-align:center;letter-spacing:-.01em}
.wz-social-links{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}
.wz-social-link{display:inline-flex;align-items:center;gap:8px;padding:10px 18px;border-radius:100px;font-size:13px;font-weight:700;text-decoration:none;transition:all .22s cubic-bezier(.22,1,.36,1);border:2px solid;line-height:1;box-shadow:0 2px 8px rgba(15,23,42,.07)}
.wz-social-fb{background:#f0f4ff;border-color:#bfceff;color:#1877F2}
.wz-social-fb:hover{background:#1877F2;color:#fff;border-color:#1877F2;transform:translateY(-2px);box-shadow:0 6px 16px rgba(24,119,242,.28)}
.wz-social-ig{background:#fdf2f8;border-color:#f0abdc;color:#E1306C}
.wz-social-ig:hover{background:linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888);color:#fff;border-color:transparent;transform:translateY(-2px);box-shadow:0 6px 16px rgba(225,48,108,.28)}
.wz-social-tg{background:#f0f9ff;border-color:#bae6fd;color:#0088cc}
.wz-social-tg:hover{background:#0088cc;color:#fff;border-color:#0088cc;transform:translateY(-2px);box-shadow:0 6px 16px rgba(0,136,204,.28)}
.wz-social-discord{background:#f3f0ff;border-color:#c4b5fd;color:#5865F2}
.wz-social-discord:hover{background:#5865F2;color:#fff;border-color:#5865F2;transform:translateY(-2px);box-shadow:0 6px 16px rgba(88,101,242,.28)}
.wz-social-viber{background:#f5f0ff;border-color:#d8b4fe;color:#7360F2}
.wz-social-viber:hover{background:#7360F2;color:#fff;border-color:#7360F2;transform:translateY(-2px);box-shadow:0 6px 16px rgba(115,96,242,.28)}

/* ─── Responsive ─── */
@media(max-width:1040px){
  .wz-container{max-width:100%}
}
@media(max-width:959px){
  .wz-mobile-guide{display:flex;align-items:center;gap:10px;padding:10px 22px 12px;border-bottom:1px solid #fee2e2;background:linear-gradient(135deg,#fff,#fff7f7);flex-shrink:0;box-shadow:0 6px 18px rgba(15,23,42,.04)}
  .wz-mobile-guide.warn{background:#fff7f7;border-color:#fecaca}
  .wz-mobile-guide-mascot{width:50px;height:50px;display:flex;align-items:center;justify-content:center;flex-shrink:0;filter:drop-shadow(0 8px 14px rgba(15,23,42,.12))}
  .wz-mobile-guide-copy{font-size:12px;font-weight:600;color:#334155;line-height:1.45}
  .wz-mobile-guide.warn .wz-mobile-guide-copy{color:#b91c1c}
  .wz-main{grid-template-columns:1fr;column-gap:0;padding:0}
  .wz-guide-rail{display:none}
  .wz-body{grid-column:1;padding:24px 22px 104px}
}

@media(max-width:640px){
  .wz-container{border-radius:0;max-height:100vh}
  .wz-mobile-guide{padding:8px 18px 10px}
  .wz-body{padding:20px 18px 96px}
  .wz-info-grid{grid-template-columns:1fr}
  .wz-info-card.full{grid-column:auto}
  .wz-career-grid{grid-template-columns:1fr;gap:12px}
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
  .wz-career-head{flex-direction:column;gap:10px}
  .wz-career-head-badge{align-items:flex-start;min-width:0;width:100%}
  .wz-section-hero{display:block;padding:18px 18px 16px}
  .wz-hero-badge{margin-bottom:10px}
  .wz-section-sub{margin-top:6px}
  .wz-section-title{font-size:19px}
  .wz-zone-title{font-size:17px}
  .wz-btn-next,.wz-btn-submit{padding:11px 22px;font-size:13px}
  .wz-intro-content{padding:36px 20px}
  .wz-intro-panel{grid-template-columns:1fr;gap:18px}
  .wz-intro-copy{text-align:center}
  .wz-intro-desc{max-width:none}
  .wz-intro-mascot-stage{width:min(332px,100%);height:194px;margin-bottom:20px}
  .wz-intro-copy .wz-intro-mascot-stage{margin-inline:auto}
  .wz-intro-speech{left:154px;top:0;width:154px;min-height:62px;padding:10px 12px;font-size:11px}
  .wz-intro-speech::after{top:36px}
  .wz-intro-halo{display:none}
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
  .wz-body{padding:16px 12px 90px}
  .wz-intro-content{padding:24px 12px}
  .wz-intro-mascot-stage{width:min(260px,100%);height:160px}
  .wz-intro-speech{left:120px;width:130px;font-size:10px;padding:8px 10px}
  .wz-intro-title{font-size:20px}
  .wz-success-mascot-wrap{width:min(260px,80vw);height:min(260px,80vw)}
  .wz-success{padding:24px 14px 36px}
  .wz-success-title{font-size:20px}
  .wz-footer{padding:12px 12px}
  .wz-btn-next,.wz-btn-submit{min-width:0;padding:11px 18px;font-size:12px}
  .wz-btn-back{padding:11px 16px;font-size:12px}
  .wz-grid-header,.wz-grid-row{grid-template-columns:60px repeat(3,1fr)}
  .wz-section-title{font-size:17px}
  .wz-zone-title{font-size:15px}
  .wz-step-btn{min-width:44px;min-height:44px}
  .wz-filter-tab{padding:10px 10px;font-size:11px;min-height:44px}
  .wz-progress-section{padding:12px 12px 10px}
}
`;
