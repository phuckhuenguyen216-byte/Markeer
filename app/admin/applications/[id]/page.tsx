"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Application,
  STATUS_OPTIONS,
  getStatusInfo,
  ApplicationStatus,
} from "@/lib/application";

/* ── helpers ── */
function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(-2)
    .join("")
    .toUpperCase();
}

/** Position → color mapping matching the recruitment form */
const POSITION_COLORS: Record<
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
const DEFAULT_POS_COLOR = { bg: "#f3f4f6", color: "#4b5563", abbr: "" };

function isZalo(notes: string) {
  return /zalo/i.test(notes || "");
}

function daysAgo(dateStr: string) {
  const d = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (d === 0) return "Hôm nay";
  if (d === 1) return "Hôm qua";
  return `${d} ngày trước`;
}

function formatDate(dateStr: string) {
  if (!dateStr) return "---";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
}

/* ── page ── */
export default function AdminApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [rating, setRating] = useState(0);
  const [toasts, setToasts] = useState<
    { id: number; msg: string; type: "success" | "error" }[]
  >([]);
  const [confirmAction, setConfirmAction] = useState<{
    title: string;
    desc: string;
    onConfirm: () => void;
    danger?: boolean;
  } | null>(null);

  const addToast = useCallback(
    (msg: string, type: "success" | "error" = "success") => {
      const tid = Date.now();
      setToasts((p) => [...p, { id: tid, msg, type }]);
      setTimeout(() => setToasts((p) => p.filter((t) => t.id !== tid)), 3500);
    },
    [],
  );

  useEffect(() => {
    fetch(`/api/applications/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setApp(data);
        // Strip [STARRED] tag from display
        setNotes((data.admin_notes || "").replace("[STARRED]", "").trim());
      })
      .catch(() => addToast("Không tìm thấy hồ sơ", "error"))
      .finally(() => setLoading(false));
  }, [id, addToast]);

  const updateStatus = async (status: ApplicationStatus) => {
    setConfirmAction(null);
    if (!app) return;
    try {
      const res = await fetch(`/api/applications/${app.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      setApp((p) => (p ? { ...p, status } : p));
      addToast(`Trạng thái → ${getStatusInfo(status).label}`);
    } catch {
      addToast("Lỗi cập nhật trạng thái", "error");
    }
  };

  const confirmStatusChange = (status: ApplicationStatus) => {
    const info = getStatusInfo(status);
    setConfirmAction({
      title: `Đổi trạng thái sang "${info.label}"?`,
      desc: `${app?.full_name} — ${app?.email}`,
      danger: status === "rejected",
      onConfirm: () => updateStatus(status),
    });
  };

  const saveNotes = async () => {
    if (!app) return;
    setSaving(true);
    try {
      // Preserve [STARRED] tag if present
      const hasStarred = (app.admin_notes || "").includes("[STARRED]");
      const finalNotes = hasStarred ? `[STARRED] ${notes}`.trim() : notes;
      const res = await fetch(`/api/applications/${app.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ admin_notes: finalNotes }),
      });
      if (!res.ok) throw new Error();
      setApp((p) => (p ? { ...p, admin_notes: finalNotes } : p));
      addToast("Đã lưu ghi chú");
    } catch {
      addToast("Lỗi lưu ghi chú", "error");
    } finally {
      setSaving(false);
    }
  };

  /* loading / not found */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div
          className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "#8b4513", borderTopColor: "transparent" }}
        />
      </div>
    );
  }
  if (!app) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <p className="text-base font-medium mb-4">Không tìm thấy hồ sơ</p>
        <button
          onClick={() => router.push("/admin/applications")}
          className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const st = getStatusInfo(app.status);
  const dateStr = new Date(app.created_at).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const timeStr = new Date(app.created_at).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const teams = app.career_journey || [];
  const hasZalo = isZalo(app.admin_notes);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      {/* Toasts */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`rounded-xl px-5 py-3.5 text-sm font-semibold shadow-lg text-white ${t.type === "error" ? "bg-red-500" : "bg-gray-900"}`}
          >
            {t.msg}
          </div>
        ))}
      </div>

      {/* Confirm modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-base font-bold text-gray-800 mb-2">
              {confirmAction.title}
            </h3>
            <p
              className={`text-sm font-semibold mb-5 ${confirmAction.danger ? "text-red-600" : "text-gray-500"}`}
            >
              {confirmAction.desc}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmAction(null)}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button
                onClick={confirmAction.onConfirm}
                className={`flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition ${confirmAction.danger ? "bg-red-500 hover:bg-red-600" : "bg-gray-900 hover:bg-gray-800"}`}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── HERO SUMMARY ─── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        {/* top row: back + status */}
        <div className="flex items-center justify-between mb-5">
          <Link
            href="/admin/applications"
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-400 hover:text-gray-600 transition"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 3L5 8l5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Danh sách
          </Link>
          <div className="flex items-center gap-2 flex-wrap">
            {STATUS_OPTIONS.map((s) => {
              const active = app.status === s.value;
              return (
                <button
                  key={s.value}
                  onClick={() => confirmStatusChange(s.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition cursor-pointer ${
                    active
                      ? ""
                      : "hover:border-gray-400 hover:text-gray-600 hover:bg-gray-50"
                  }`}
                  style={
                    active
                      ? {
                          background: s.bg,
                          color: s.color,
                          borderColor: s.color,
                        }
                      : {
                          background: "#fff",
                          color: "#9ca3af",
                          borderColor: "#e5e7eb",
                        }
                  }
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* hero content */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* avatar */}
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-black shrink-0"
            style={{ background: st.color }}
          >
            {initials(app.full_name)}
          </div>

          {/* info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                {app.full_name}
              </h1>
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: st.bg, color: st.color }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: st.color }}
                />
                {st.label}
              </span>
            </div>

            {/* position tags */}
            <div className="flex flex-wrap gap-2 mb-2">
              {teams.map((t) => {
                const pc = POSITION_COLORS[t] || DEFAULT_POS_COLOR;
                return (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-bold"
                    style={{ background: pc.bg, color: pc.color }}
                  >
                    {pc.abbr && (
                      <span
                        className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-black text-white"
                        style={{ background: pc.color }}
                      >
                        {pc.abbr}
                      </span>
                    )}
                    {t}
                  </span>
                );
              })}
            </div>

            {/* quick meta row */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500">
              {app.school && (
                <span className="flex items-center gap-1.5 font-medium">
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M2 6l6-3 6 3-6 3-6-3z"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M12 7.5v4c0 1-2.7 2-4 2s-4-1-4-2v-4"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                  </svg>
                  {app.school}
                </span>
              )}
              <span className="flex items-center gap-1.5 font-medium">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <rect
                    x="2"
                    y="2"
                    width="12"
                    height="12"
                    rx="3"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                  <path d="M2 6h12" stroke="currentColor" strokeWidth="1.2" />
                </svg>
                {daysAgo(app.created_at)} ({dateStr} {timeStr})
              </span>
            </div>

            {/* contact chips */}
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <a
                href={`mailto:${app.email}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition cursor-pointer"
                title="Gửi email"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <rect
                    x="1"
                    y="3"
                    width="14"
                    height="10"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M1 5l7 4 7-4"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                </svg>
                {app.email}
              </a>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(app.phone);
                  addToast(`Đã copy: ${app.phone}`);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-sm font-semibold text-gray-700 hover:bg-green-50 hover:text-green-600 transition cursor-pointer"
                title="Nhấn để copy số điện thoại"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <rect
                    x="4"
                    y="1"
                    width="8"
                    height="14"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M7 12h2"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
                {app.phone}
                {hasZalo && (
                  <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-black text-white bg-blue-500">
                    Zalo
                  </span>
                )}
              </button>

              {app.dob && (
                <span className="px-3 py-1.5 rounded-lg bg-gray-50 text-sm font-semibold text-gray-500">
                  Sinh: {formatDate(app.dob)}
                </span>
              )}
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col gap-2 shrink-0 lg:min-w-[140px]">
            {app.cv && (
              <a
                href={app.cv}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition hover:opacity-90"
                style={{ background: "#4a2318" }}
              >
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M4 2h5l5 5v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M9 2v5h5"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinejoin="round"
                  />
                </svg>
                Xem CV
              </a>
            )}
            <button
              onClick={() => confirmStatusChange("interviewed")}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition hover:opacity-90"
              style={{ background: "#f5f3ff", color: "#7c3aed" }}
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <rect
                  x="2"
                  y="2"
                  width="12"
                  height="12"
                  rx="3"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
                <path d="M2 6h12" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="5" cy="9" r="1" fill="currentColor" />
              </svg>
              Đặt lịch PV
            </button>
            <button
              onClick={() => confirmStatusChange("accepted")}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition hover:opacity-90"
              style={{ background: "#f0fdf4", color: "#16a34a" }}
            >
              Đạt
            </button>
            <button
              onClick={() => confirmStatusChange("rejected")}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition hover:opacity-90"
              style={{ background: "#fef2f2", color: "#ef4444" }}
            >
              Loại
            </button>
          </div>
        </div>
      </div>

      {/* ─── TWO-COLUMN BODY ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT — 2 cols */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* SECTION 1: Career Fit */}
          <Section title="Định hướng & Động lực">
            <div className="mb-5">
              <SLabel>Vị trí ứng tuyển</SLabel>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {teams.map((t) => {
                  const pc = POSITION_COLORS[t] || DEFAULT_POS_COLOR;
                  return (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold"
                      style={{ background: pc.bg, color: pc.color }}
                    >
                      {pc.abbr && (
                        <span
                          className="w-4 h-4 rounded flex items-center justify-center text-[9px] font-black text-white"
                          style={{ background: pc.color }}
                        >
                          {pc.abbr}
                        </span>
                      )}
                      {t}
                    </span>
                  );
                })}
                {teams.length === 0 && (
                  <span className="text-xs text-gray-400">---</span>
                )}
              </div>
            </div>

            <div className="mb-5">
              <SLabel>Điều hứng thú</SLabel>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {(app.interest_reason || []).map((r) => (
                  <span
                    key={r}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                    style={{ background: "#eff6ff", color: "#1d4ed8" }}
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>

            <ContentBlock label="Lý do ứng tuyển" value={app.why_apply} />
            <ContentBlock label="Mục tiêu thực tập" value={app.goal} />
          </Section>

          {/* SECTION 2: Experience & Skills */}
          <Section title="Kinh nghiệm & Kỹ năng">
            <ContentBlock label="Kinh nghiệm" value={app.experience} />
            <ContentBlock label="Kỹ năng / Công cụ" value={app.skills} />
          </Section>

          {/* SECTION 3: Mindset & Traits */}
          <Section title="Tư duy & Làm việc">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
              <div>
                <SLabel color="#16a34a">Điểm mạnh</SLabel>
                <p className="text-sm text-gray-700 leading-relaxed mt-1 whitespace-pre-wrap">
                  {app.strengths || "---"}
                </p>
              </div>
              <div>
                <SLabel color="#f59e0b">Cần cải thiện</SLabel>
                <p className="text-sm text-gray-700 leading-relaxed mt-1 whitespace-pre-wrap">
                  {app.weaknesses || "---"}
                </p>
              </div>
            </div>

            <ContentBlock label="Kỳ vọng 3 tháng đầu" value={app.expectation} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <SLabel>Cách xử lý vấn đề</SLabel>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {(app.problem_solving || []).map((p) => (
                    <span
                      key={p}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                      style={{ background: "#f0fdf4", color: "#15803d" }}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <SLabel>Phản ứng khi góp ý</SLabel>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {(app.feedback_response || []).map((f) => (
                    <span
                      key={f}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                      style={{ background: "#fef3c7", color: "#92400e" }}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* SECTION 4: Work Preference + Note (compact) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.keys(app.work_preference || {}).length > 0 && (
              <Section title="Hình thức làm việc" compact>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-left text-gray-400 uppercase tracking-wider">
                      <th className="pb-2 font-semibold">Hình thức</th>
                      <th className="pb-2 font-semibold">Chi tiết</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {Object.entries(app.work_preference || {}).map(
                      ([key, vals]) => (
                        <tr key={key}>
                          <td className="py-2 font-semibold text-gray-700 whitespace-nowrap pr-4">
                            {key}
                          </td>
                          <td className="py-2 text-gray-600">
                            {Array.isArray(vals)
                              ? vals.join(", ")
                              : String(vals)}
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </Section>
            )}

            {/* Education detail */}
            <Section title="Học vấn" compact>
              <div className="space-y-2 text-sm">
                <InfoRow label="Trường" value={app.school} />
                <InfoRow label="Nhập học" value={formatDate(app.enrollment)} />
                <InfoRow
                  label="Ra trường (dự kiến)"
                  value={formatDate(app.graduation)}
                />
              </div>
            </Section>
          </div>

          {/* Note from candidate */}
          {app.note && (
            <Section title="Lời nhắn gửi team">
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                {app.note}
              </p>
            </Section>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="flex flex-col gap-5">
          {/* Quick rating */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-800 mb-3">
              Đánh giá nhanh
            </h3>
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star === rating ? 0 : star)}
                  className="text-xl transition hover:scale-110"
                  style={{
                    color: star <= rating ? "#f59e0b" : "#e5e7eb",
                  }}
                >
                  &#9733;
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm font-bold text-amber-600">
                  {rating}/5
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400">
              Nhấn sao để đánh giá ứng viên
            </p>
          </div>

          {/* HR Notes */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-800 mb-3">Ghi chú HR</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              placeholder="Ghi chú nội bộ về ứng viên..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm leading-relaxed focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-50 resize-y"
            />
            <button
              onClick={saveNotes}
              disabled={saving}
              className="mt-3 w-full py-2.5 rounded-xl text-sm font-bold text-white transition disabled:opacity-50 hover:opacity-90"
              style={{ background: "#4a2318" }}
            >
              {saving ? "Đang lưu..." : "Lưu ghi chú"}
            </button>
          </div>

          {/* Quick info recap */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-800 mb-3">
              Thông tin nhanh
            </h3>
            <div className="space-y-3 text-sm">
              <InfoRow label="Email" value={app.email} />
              <div>
                <span className="text-gray-400 text-xs font-semibold block mb-0.5">
                  Số điện thoại
                </span>
                <span className="text-gray-800 font-semibold">
                  {app.phone}
                  {hasZalo && (
                    <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-black text-white bg-blue-500 align-middle">
                      Zalo
                    </span>
                  )}
                </span>
              </div>
              <InfoRow label="Trường" value={app.school} />
              <InfoRow label="Ngày nộp" value={`${dateStr} ${timeStr}`} />
              {app.cv && (
                <div>
                  <span className="text-gray-400 text-xs font-semibold block mb-0.5">
                    CV / Portfolio
                  </span>
                  <a
                    href={app.cv}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline break-all text-sm font-semibold"
                  >
                    Xem CV
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function Section({
  title,
  children,
  compact,
}: {
  title: string;
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${compact ? "p-5" : "p-6"}`}
    >
      <h2
        className={`font-bold text-gray-900 mb-4 ${compact ? "text-sm" : "text-base"}`}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

function SLabel({
  children,
  color,
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <span
      className="block text-xs font-bold uppercase tracking-wider mb-1"
      style={{ color: color || "#94a3b8" }}
    >
      {children}
    </span>
  );
}

function ContentBlock({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="mb-5">
      <SLabel>{label}</SLabel>
      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mt-1">
        {value}
      </p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-gray-400 text-xs font-semibold block mb-0.5">
        {label}
      </span>
      <span className="text-gray-800 font-semibold">{value || "---"}</span>
    </div>
  );
}
