"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  Application,
  STATUS_OPTIONS,
  getStatusInfo,
  ApplicationStatus,
} from "@/lib/application";

const TEAM_FILTERS = [
  "all",
  "Infrastructure",
  "Dev/DevOps",
  "AI",
  "Marketing",
  "Sales",
];

/* Map team → position labels (must match CAREER_OPTIONS in ApplicationWizard) */
const TEAM_POSITIONS: Record<string, string[]> = {
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
  Sales: ["B2B Sales", "Business Development"],
};

function isStarred(app: Application) {
  return (app.admin_notes || "").includes("[STARRED]");
}

/** Position → color mapping matching the recruitment form */
const POSITION_COLORS: Record<string, { bg: string; color: string }> = {
  "Network Team": { bg: "#dbeafe", color: "#2563eb" },
  "System Team": { bg: "#dbeafe", color: "#2563eb" },
  "Security Team": { bg: "#dbeafe", color: "#2563eb" },
  "Hội nghị & Tổng đài": { bg: "#dbeafe", color: "#2563eb" },
  "Cloud & Datacenter": { bg: "#dbeafe", color: "#2563eb" },
  BA: { bg: "#ede9fe", color: "#7c3aed" },
  "Backend Developer": { bg: "#ede9fe", color: "#7c3aed" },
  "Frontend Developer": { bg: "#ede9fe", color: "#7c3aed" },
  "Full-stack Developer": { bg: "#ede9fe", color: "#7c3aed" },
  "DevOps / Platform": { bg: "#ede9fe", color: "#7c3aed" },
  "AI / ML Engineer": { bg: "#fee2e2", color: "#dc2626" },
  "Data Analyst / Engineer": { bg: "#fee2e2", color: "#dc2626" },
  "AI Product / Research": { bg: "#fee2e2", color: "#dc2626" },
  "Content & Social": { bg: "#fef3c7", color: "#d97706" },
  "Performance & Acquisition": { bg: "#fef3c7", color: "#d97706" },
  "Marketing Ops": { bg: "#fef3c7", color: "#d97706" },
  "B2B Sales": { bg: "#d1fae5", color: "#059669" },
  "Business Development": { bg: "#d1fae5", color: "#059669" },
  "Customer Success": { bg: "#d1fae5", color: "#059669" },
};
const DEFAULT_POS_COLOR = { bg: "#f3f4f6", color: "#4b5563" };

export default function AdminApplicationsPage() {
  const router = useRouter();
  const [apps, setApps] = useState<Application[]>([]);
  const [allApps, setAllApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [teamFilter, setTeamFilter] = useState("all");
  const [toasts, setToasts] = useState<
    { id: number; msg: string; type: "success" | "error" }[]
  >([]);
  const [confirmAction, setConfirmAction] = useState<{
    title: string;
    desc: string;
    detail: string;
    onConfirm: () => void;
    danger?: boolean;
  } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const addToast = useCallback(
    (msg: string, type: "success" | "error" = "success") => {
      const id = Date.now();
      setToasts((p) => [...p, { id, msg, type }]);
      setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
    },
    [],
  );

  const fetchApps = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      params.set("limit", "100");
      const res = await fetch(`/api/applications?${params.toString()}`);
      const data = await res.json();
      const all: Application[] = data.applications || [];
      setAllApps(all);

      // Client-side filtering
      let filtered = all;
      if (statusFilter !== "all") {
        filtered = filtered.filter((a) => a.status === statusFilter);
      }
      if (teamFilter !== "all") {
        const positions = TEAM_POSITIONS[teamFilter] || [];
        filtered = filtered.filter((a) =>
          (a.career_journey || []).some((pos) => positions.includes(pos)),
        );
      }

      setApps(filtered);
    } catch {
      addToast("Lỗi tải danh sách ứng viên", "error");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, teamFilter, search, addToast]);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  /* ── actions ── */

  const handleView = (app: Application) => {
    // Auto-mark as "reviewing" (Đã xem) if currently "new"
    if (app.status === "new") {
      fetch(`/api/applications/${app.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "reviewing" as ApplicationStatus }),
      }).catch(() => {});
    }
    router.push(`/admin/applications/${app.id}`);
  };

  const handleDelete = async (app: Application) => {
    setConfirmAction(null);
    setDeletingId(app.id);
    try {
      const res = await fetch(`/api/applications/${app.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      addToast(`Đã xóa: ${app.full_name}`);
      fetchApps();
    } catch {
      addToast("Lỗi xóa hồ sơ", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const toggleStar = async (app: Application) => {
    setTogglingId(app.id);
    const starred = isStarred(app);
    const newNotes = starred
      ? (app.admin_notes || "").replace("[STARRED]", "").trim()
      : `[STARRED] ${app.admin_notes || ""}`.trim();
    try {
      const res = await fetch(`/api/applications/${app.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ admin_notes: newNotes }),
      });
      if (!res.ok) throw new Error();
      addToast(
        starred
          ? `Bỏ đánh dấu: ${app.full_name}`
          : `Đánh dấu nổi bật: ${app.full_name}`,
      );
      fetchApps();
    } catch {
      addToast("Lỗi cập nhật", "error");
    } finally {
      setTogglingId(null);
    }
  };

  /* ── sort: starred first for new/reviewing ── */
  const sortedApps = [...apps].sort((a, b) => {
    const aStarred =
      isStarred(a) && (a.status === "new" || a.status === "reviewing") ? 1 : 0;
    const bStarred =
      isStarred(b) && (b.status === "new" || b.status === "reviewing") ? 1 : 0;
    return bStarred - aStarred;
  });

  const statusCounts: Record<string, number> = { all: allApps.length };
  STATUS_OPTIONS.forEach((s) => {
    statusCounts[s.value] = allApps.filter((a) => a.status === s.value).length;
  });

  // Team counts from allApps (pre-team-filter)
  const teamCounts: Record<string, number> = { all: allApps.length };
  TEAM_FILTERS.slice(1).forEach((team) => {
    const positions = TEAM_POSITIONS[team] || [];
    teamCounts[team] = allApps.filter((a) =>
      (a.career_journey || []).some((pos) => positions.includes(pos)),
    ).length;
  });

  /* ── Statistics computed from allApps ── */
  const stats = useMemo(() => {
    const total = allApps.length;
    if (total === 0) return null;

    // Career Journey
    const careerMap: Record<string, number> = {};
    allApps.forEach((a) =>
      (a.career_journey || []).forEach((c) => {
        careerMap[c] = (careerMap[c] || 0) + 1;
      }),
    );

    // Team breakdown
    const teamMap: Record<string, number> = {};
    Object.entries(TEAM_POSITIONS).forEach(([team, positions]) => {
      teamMap[team] = allApps.filter((a) =>
        (a.career_journey || []).some((p) => positions.includes(p)),
      ).length;
    });

    // Interest reasons
    const interestMap: Record<string, number> = {};
    allApps.forEach((a) =>
      (a.interest_reason || []).forEach((r) => {
        interestMap[r] = (interestMap[r] || 0) + 1;
      }),
    );

    // Problem solving
    const problemMap: Record<string, number> = {};
    allApps.forEach((a) =>
      (a.problem_solving || []).forEach((p) => {
        problemMap[p] = (problemMap[p] || 0) + 1;
      }),
    );

    // Feedback response
    const feedbackMap: Record<string, number> = {};
    allApps.forEach((a) =>
      (a.feedback_response || []).forEach((f) => {
        feedbackMap[f] = (feedbackMap[f] || 0) + 1;
      }),
    );

    // Work preference: count each mode×city combo
    const workMap: Record<string, number> = {};
    allApps.forEach((a) =>
      Object.entries(a.work_preference || {}).forEach(([mode, cities]) => {
        if (Array.isArray(cities))
          cities.forEach((city) => {
            const key = `${mode} — ${city}`;
            workMap[key] = (workMap[key] || 0) + 1;
          });
      }),
    );

    // Schools
    const schoolMap: Record<string, number> = {};
    allApps.forEach((a) => {
      const s = (a.school || "").trim();
      if (s) schoolMap[s] = (schoolMap[s] || 0) + 1;
    });

    // Status breakdown
    const statusMap: Record<string, number> = {};
    STATUS_OPTIONS.forEach((s) => {
      statusMap[s.label] = allApps.filter((a) => a.status === s.value).length;
    });

    // Has CV
    const hasCV = allApps.filter((a) => a.cv?.trim()).length;
    const cvMap: Record<string, number> = {
      "Có nộp CV": hasCV,
      "Chưa nộp CV": total - hasCV,
    };

    // Zalo
    const hasZalo = allApps.filter((a) =>
      (a.admin_notes || "").toLowerCase().includes("zalo"),
    ).length;
    const zaloMap: Record<string, number> = {
      "SĐT là Zalo": hasZalo,
      "Không phải Zalo": total - hasZalo,
    };

    // Submissions by date
    const dateMap: Record<string, number> = {};
    allApps.forEach((a) => {
      const d = new Date(a.created_at).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      });
      dateMap[d] = (dateMap[d] || 0) + 1;
    });

    const sorted = (m: Record<string, number>) =>
      Object.entries(m).sort((a, b) => b[1] - a[1]);

    // Date sorted chronologically
    const dateSorted = Object.entries(dateMap).sort((a, b) => {
      const [dA, mA] = a[0].split("/").map(Number);
      const [dB, mB] = b[0].split("/").map(Number);
      return mA !== mB ? mA - mB : dA - dB;
    });

    // Free-text answers
    const freeText: { name: string; fullName: string; answer: string }[] = [];
    const textFields: { key: keyof Application; label: string }[] = [
      { key: "why_apply", label: "L\u00fd do \u1ee9ng tuy\u1ec3n" },
      { key: "experience", label: "Kinh nghi\u1ec7m" },
      { key: "skills", label: "K\u1ef9 n\u0103ng" },
      { key: "goal", label: "M\u1ee5c ti\u00eau" },
      { key: "strengths", label: "\u0110i\u1ec3m m\u1ea1nh" },
      { key: "weaknesses", label: "\u0110i\u1ec3m y\u1ebfu" },
      { key: "expectation", label: "K\u1ef3 v\u1ecdng" },
      { key: "note", label: "Ghi ch\u00fa" },
    ];
    allApps.forEach((a) => {
      textFields.forEach((f) => {
        const val = ((a[f.key] as string) || "").trim();
        if (val)
          freeText.push({ name: f.label, fullName: a.full_name, answer: val });
      });
    });

    return {
      total,
      career: sorted(careerMap),
      team: sorted(teamMap),
      interest: sorted(interestMap),
      problem: sorted(problemMap),
      feedback: sorted(feedbackMap),
      work: sorted(workMap),
      school: sorted(schoolMap).slice(0, 20),
      status: Object.entries(statusMap),
      cv: Object.entries(cvMap),
      zalo: Object.entries(zaloMap),
      date: dateSorted,
      freeText,
      textFields: textFields.map((f) => f.label),
    };
  }, [allApps]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "#8b4513", borderTopColor: "transparent" }}
          />
          <p className="text-sm text-gray-400">Đang tải danh sách...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      {/* Toasts */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`rounded-xl px-4 py-3 text-sm font-semibold shadow-lg text-white ${t.type === "error" ? "bg-red-500" : "bg-gray-900"}`}
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
            <p className="text-sm text-gray-500 mb-1">{confirmAction.desc}</p>
            <p
              className={`text-sm font-semibold mb-5 ${confirmAction.danger ? "text-red-600" : "text-gray-700"}`}
            >
              {confirmAction.detail}
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

      {/* Summary toolbar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 mb-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Status dots summary */}
          <div className="flex items-center gap-4 flex-wrap">
            {STATUS_OPTIONS.map((s) => (
              <span
                key={s.value}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500"
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: s.color }}
                />
                <span className="font-bold" style={{ color: s.color }}>
                  {statusCounts[s.value] || 0}
                </span>
                {s.label.toLowerCase()}
              </span>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {stats && (
              <button
                onClick={() => setShowStats(true)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition"
                style={{
                  background: "#4a2318",
                  color: "#fff",
                }}
              >
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                  <rect
                    x="1"
                    y="8"
                    width="3"
                    height="7"
                    rx="0.5"
                    fill="currentColor"
                    opacity="0.4"
                  />
                  <rect
                    x="5.5"
                    y="4"
                    width="3"
                    height="11"
                    rx="0.5"
                    fill="currentColor"
                    opacity="0.6"
                  />
                  <rect
                    x="10"
                    y="1"
                    width="3"
                    height="14"
                    rx="0.5"
                    fill="currentColor"
                    opacity="0.9"
                  />
                </svg>
                Thống kê ({stats.total})
              </button>
            )}
            <button
              onClick={() => {
                setLoading(true);
                fetchApps();
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition"
            >
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                <path
                  d="M14 8A6 6 0 1 1 8 2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M14 2v4h-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Tải lại
            </button>
            <button
              onClick={async () => {
                setSyncing(true);
                try {
                  const res = await fetch("/api/applications/sync-sheet", {
                    method: "POST",
                  });
                  const data = await res.json();
                  if (!res.ok) throw new Error(data.error);
                  addToast(data.message);
                } catch (err) {
                  addToast(
                    err instanceof Error ? err.message : "Lỗi đồng bộ",
                    "error",
                  );
                } finally {
                  setSyncing(false);
                }
              }}
              disabled={syncing}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-500 hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition disabled:opacity-50"
            >
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                <rect
                  x="1"
                  y="1"
                  width="14"
                  height="14"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.3"
                />
                <path
                  d="M4 5h8M4 8h8M4 11h5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
              {syncing ? "Đang đồng bộ..." : "Sync Google Sheet"}
            </button>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            width="15"
            height="15"
            viewBox="0 0 16 16"
            fill="none"
          >
            <circle
              cx="6.5"
              cy="6.5"
              r="5"
              stroke="currentColor"
              strokeWidth="1.3"
            />
            <path
              d="M10.5 10.5L14 14"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="text"
            placeholder="Tìm tên, email, SĐT..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 h-9 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:border-red-300"
          />
        </div>

        {/* Status tabs */}
        <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1 overflow-x-auto">
          {[{ value: "all", label: "Tất cả" }, ...STATUS_OPTIONS].map((s) => (
            <button
              key={s.value}
              onClick={() => setStatusFilter(s.value)}
              className="px-3 py-1 rounded-md text-xs font-semibold transition whitespace-nowrap"
              style={
                statusFilter === s.value
                  ? { background: "#4a2318", color: "#fff" }
                  : { color: "#6b7280" }
              }
            >
              {s.label}
              {(statusCounts[s.value] ?? 0) > 0 && (
                <span className="ml-1 opacity-60">{statusCounts[s.value]}</span>
              )}
            </button>
          ))}
        </div>

        {/* Team tabs */}
        <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1 overflow-x-auto">
          {TEAM_FILTERS.map((t) => (
            <button
              key={t}
              onClick={() => setTeamFilter(t)}
              className="px-3 py-1 rounded-md text-xs font-semibold transition whitespace-nowrap"
              style={
                teamFilter === t
                  ? { background: "#4a2318", color: "#fff" }
                  : { color: "#6b7280" }
              }
            >
              {t === "all" ? "Tất cả team" : t}
              {(teamCounts[t] ?? 0) > 0 && (
                <span className="ml-1 opacity-60">{teamCounts[t]}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Stats modal */}
      {stats &&
        showStats &&
        createPortal(
          <div
            className="fixed inset-0 flex items-start justify-center bg-black/50 backdrop-blur-sm overflow-y-auto py-6 px-4"
            style={{ zIndex: 9999 }}
            onClick={() => setShowStats(false)}
          >
            <div
              className="w-full max-w-5xl bg-gray-50 rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                      <rect
                        x="1"
                        y="8"
                        width="3"
                        height="7"
                        rx="0.5"
                        fill="#d97706"
                        opacity="0.4"
                      />
                      <rect
                        x="5.5"
                        y="4"
                        width="3"
                        height="11"
                        rx="0.5"
                        fill="#d97706"
                        opacity="0.6"
                      />
                      <rect
                        x="10"
                        y="1"
                        width="3"
                        height="14"
                        rx="0.5"
                        fill="#d97706"
                        opacity="0.9"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Thống kê tổng hợp
                    </h2>
                    <p className="text-xs text-gray-400">
                      {stats.total} hồ sơ ứng tuyển
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowStats(false)}
                  className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M4 4l8 8M12 4l-8 8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>

              {/* Summary cards */}
              <div className="px-6 pt-5 pb-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {STATUS_OPTIONS.map((s) => {
                  const count = allApps.filter(
                    (a) => a.status === s.value,
                  ).length;
                  return (
                    <div
                      key={s.value}
                      className="bg-white rounded-xl border border-gray-100 p-3.5 text-center"
                    >
                      <div
                        className="text-2xl font-black"
                        style={{ color: s.color }}
                      >
                        {count}
                      </div>
                      <div className="text-[11px] font-semibold text-gray-500 mt-0.5">
                        {s.label}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Charts grid */}
              <div className="px-6 py-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
                <StatsCard
                  title="Phân bố theo Team"
                  data={stats.team}
                  total={stats.total}
                  defaultColor="#4a2318"
                />
                <StatsCard
                  title="Career Journey / Vị trí"
                  data={stats.career}
                  total={stats.total}
                  colorMap={POSITION_COLORS}
                  defaultColor="#8b5cf6"
                />
                <StatsCard
                  title="Điều hứng thú"
                  data={stats.interest}
                  total={stats.total}
                  defaultColor="#f59e0b"
                />
                <StatsCard
                  title="Cách xử lý vấn đề"
                  data={stats.problem}
                  total={stats.total}
                  defaultColor="#3b82f6"
                />
                <StatsCard
                  title="Phản ứng khi nhận góp ý"
                  data={stats.feedback}
                  total={stats.total}
                  defaultColor="#10b981"
                />
                <StatsCard
                  title="Hình thức làm việc"
                  data={stats.work}
                  total={stats.total}
                  defaultColor="#6366f1"
                />
                <StatsCard
                  title="Trường học (top 20)"
                  data={stats.school}
                  total={stats.total}
                  defaultColor="#ec4899"
                />
                <StatsCard
                  title="Ngày nộp hồ sơ"
                  data={stats.date}
                  total={stats.total}
                  defaultColor="#0ea5e9"
                />
                <StatsCard
                  title="CV"
                  data={stats.cv}
                  total={stats.total}
                  defaultColor="#8b5cf6"
                />
                <StatsCard
                  title="Zalo"
                  data={stats.zalo}
                  total={stats.total}
                  defaultColor="#2563eb"
                />
              </div>

              {/* Free-text answers */}
              <div className="px-6 pb-6">
                <FreeTextSection
                  answers={stats.freeText}
                  fields={stats.textFields}
                />
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* Empty */}
      {apps.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            className="mb-4 opacity-25"
          >
            <rect
              x="8"
              y="5"
              width="32"
              height="38"
              rx="5"
              fill="currentColor"
            />
            <path
              d="M16 16h16M16 23h12M16 30h14"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.4"
            />
          </svg>
          <p className="text-sm font-medium">Chưa có hồ sơ nào</p>
          <p className="text-xs mt-1">Hồ sơ ứng tuyển sẽ xuất hiện ở đây</p>
        </div>
      )}

      {/* Application cards */}
      {apps.length > 0 && (
        <div className="flex flex-col gap-3">
          {sortedApps.map((app) => {
            const st = getStatusInfo(app.status);
            const teams = app.career_journey || [];
            const starred = isStarred(app);
            const dateStr = new Date(app.created_at).toLocaleDateString(
              "vi-VN",
              { day: "2-digit", month: "2-digit", year: "numeric" },
            );
            const timeStr = new Date(app.created_at).toLocaleTimeString(
              "vi-VN",
              { hour: "2-digit", minute: "2-digit" },
            );

            return (
              <div
                key={app.id}
                className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group ${starred ? "border-amber-200 bg-amber-50/30" : "border-gray-100"}`}
              >
                <div className="flex items-stretch">
                  {/* Left status accent */}
                  <div
                    className="w-1 shrink-0 hidden sm:block"
                    style={{ background: st.color }}
                  />

                  {/* Star button */}
                  <button
                    onClick={() => toggleStar(app)}
                    disabled={togglingId === app.id}
                    className="flex items-center px-2 shrink-0 transition hover:scale-110 disabled:opacity-50"
                    title={starred ? "Bỏ đánh dấu" : "Đánh dấu nổi bật"}
                  >
                    <span
                      className="text-lg"
                      style={{ color: starred ? "#f59e0b" : "#d1d5db" }}
                    >
                      {starred ? "★" : "☆"}
                    </span>
                  </button>

                  {/* Content */}
                  <div className="flex-1 p-4 flex flex-col justify-center min-w-0">
                    <div className="flex items-start gap-2 mb-1.5">
                      <h3 className="font-semibold text-gray-900 text-sm truncate group-hover:text-amber-800 transition-colors flex-1">
                        {app.full_name}
                      </h3>
                    </div>

                    <p className="text-xs text-gray-600 truncate mb-3 max-w-125">
                      {app.email}
                      <span className="mx-1.5 text-gray-300">|</span>
                      {app.phone}
                      {app.school && (
                        <>
                          <span className="mx-1.5 text-gray-300">|</span>
                          <span className="text-gray-600 font-medium">
                            {app.school}
                          </span>
                        </>
                      )}
                    </p>

                    <div className="flex flex-wrap items-center gap-2">
                      {teams.slice(0, 3).map((c) => {
                        const pc = POSITION_COLORS[c] || DEFAULT_POS_COLOR;
                        return (
                          <span
                            key={c}
                            className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold"
                            style={{ background: pc.bg, color: pc.color }}
                          >
                            {c}
                          </span>
                        );
                      })}
                      {teams.length > 3 && (
                        <span className="text-[11px] text-gray-400">
                          +{teams.length - 3}
                        </span>
                      )}

                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold"
                        style={{ background: st.bg, color: st.color }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: st.color }}
                        />
                        {st.label}
                      </span>

                      <span className="w-px h-3 bg-gray-200 hidden sm:block" />

                      <span className="text-[11px] text-gray-400 hidden sm:inline">
                        {dateStr} {timeStr}
                      </span>

                      {app.cv && (
                        <>
                          <span className="w-px h-3 bg-gray-200 hidden sm:block" />
                          <a
                            href={app.cv}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-blue-500 font-semibold hover:underline"
                          >
                            <svg
                              width="11"
                              height="11"
                              viewBox="0 0 16 16"
                              fill="none"
                            >
                              <path
                                d="M4 2h5l5 5v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"
                                stroke="currentColor"
                                strokeWidth="1.3"
                              />
                              <path
                                d="M9 2v5h5"
                                stroke="currentColor"
                                strokeWidth="1.3"
                                strokeLinejoin="round"
                              />
                            </svg>
                            CV
                          </a>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions — only View and Delete */}
                  <div className="flex items-center gap-2 px-4 shrink-0">
                    <button
                      onClick={() => handleView(app)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition hover:opacity-80"
                      style={{ background: "#FEE2E2", color: "#5c3320" }}
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          fill="none"
                        />
                        <circle
                          cx="8"
                          cy="8"
                          r="2"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          fill="none"
                        />
                      </svg>
                      Xem
                    </button>

                    <button
                      onClick={() =>
                        setConfirmAction({
                          title: "Xóa hồ sơ ứng viên?",
                          desc: "Hành động này không thể hoàn tác.",
                          detail: `${app.full_name} — ${app.email}`,
                          danger: true,
                          onConfirm: () => handleDelete(app),
                        })
                      }
                      disabled={deletingId === app.id}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition hover:opacity-80 disabled:opacity-50"
                      style={{ background: "#FEE2E2", color: "#5c3320" }}
                      title="Xóa"
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M3 4h10l-1 10H4L3 4z"
                          stroke="currentColor"
                          strokeWidth="1.2"
                        />
                        <path
                          d="M1 4h14"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                        />
                        <path
                          d="M6 2h4"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                        />
                      </svg>
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Stats Bar Chart Card ─── */
function StatsCard({
  title,
  data,
  total,
  colorMap,
  defaultColor,
}: {
  title: string;
  data: [string, number][];
  total: number;
  colorMap?: Record<string, { bg: string; color: string }>;
  defaultColor: string;
}) {
  const max = data.length > 0 ? data[0][1] : 1;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ background: defaultColor }}
        />
        <h3 className="text-sm font-bold text-gray-800">{title}</h3>
        <span className="ml-auto text-xs text-gray-400 font-medium">
          {data.length} lựa chọn
        </span>
      </div>
      <div className="px-5 py-4 flex flex-col gap-3 max-h-[420px] overflow-y-auto">
        {data.map(([label, count]) => {
          const pct = total > 0 ? ((count / total) * 100).toFixed(1) : "0";
          const barWidth = max > 0 ? (count / max) * 100 : 0;
          const color = colorMap?.[label]?.color || defaultColor;
          const bg = colorMap?.[label]?.bg || `${defaultColor}18`;

          return (
            <div key={label}>
              <div className="flex items-baseline justify-between mb-1">
                <span
                  className="text-xs font-semibold text-gray-700 truncate max-w-[70%]"
                  title={label}
                >
                  {label}
                </span>
                <span
                  className="text-xs font-bold shrink-0 ml-2"
                  style={{ color }}
                >
                  {count}{" "}
                  <span className="font-normal text-gray-400">({pct}%)</span>
                </span>
              </div>
              <div className="h-5 bg-gray-50 rounded-md overflow-hidden relative border border-gray-100">
                <div
                  className="h-full rounded-md transition-all duration-500 ease-out"
                  style={{
                    width: `${barWidth}%`,
                    background: `linear-gradient(90deg, ${color}cc, ${color})`,
                    minWidth: count > 0 ? "4px" : "0",
                  }}
                />
                {barWidth > 25 && (
                  <span className="absolute inset-y-0 left-2 flex items-center text-[10px] font-bold text-white/90">
                    {count}
                  </span>
                )}
              </div>
            </div>
          );
        })}
        {data.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-4">
            Chưa có dữ liệu
          </p>
        )}
      </div>
    </div>
  );
}

/* ─── Free-text Answers Section ─── */
function FreeTextSection({
  answers,
  fields,
}: {
  answers: { name: string; fullName: string; answer: string }[];
  fields: string[];
}) {
  const [activeField, setActiveField] = useState(fields[0] || "");
  const filtered = answers.filter((a) => a.name === activeField);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ background: "#6366f1" }}
        />
        <h3 className="text-sm font-bold text-gray-800">Câu trả lời tự nhập</h3>
        <span className="ml-auto text-xs text-gray-400 font-medium">
          {filtered.length} câu trả lời
        </span>
      </div>

      {/* Field tabs */}
      <div className="px-5 pt-3 pb-2 flex gap-1.5 flex-wrap">
        {fields.map((f) => {
          const count = answers.filter((a) => a.name === f).length;
          return (
            <button
              key={f}
              onClick={() => setActiveField(f)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold transition"
              style={
                activeField === f
                  ? { background: "#4a2318", color: "#fff" }
                  : { background: "#f3f4f6", color: "#6b7280" }
              }
            >
              {f}
              {count > 0 && <span className="ml-1 opacity-60">{count}</span>}
            </button>
          );
        })}
      </div>

      {/* Answers list */}
      <div className="px-5 py-3 flex flex-col gap-2.5 max-h-[400px] overflow-y-auto">
        {filtered.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-4">
            Chưa có câu trả lời
          </p>
        )}
        {filtered.map((a, i) => (
          <div
            key={i}
            className="rounded-xl border border-gray-100 bg-gray-50 p-3"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold text-gray-700">
                {a.fullName}
              </span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">
              {a.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
