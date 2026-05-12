"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  Database,
  Eye,
  FileText,
  Filter,
  RefreshCw,
  Search,
  Star,
  Trash2,
  Users,
  X,
} from "lucide-react";
import {
  Application,
  ApplicationStatus,
  STATUS_OPTIONS,
  getStatusInfo,
} from "@/lib/application";

const TEAM_FILTERS = [
  "all",
  "Infrastructure",
  "Dev/DevOps",
  "AI",
  "Marketing",
  "Sales",
];

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
  Sales: ["B2B Sales", "Business Development", "Customer Success"],
};

const TEAM_STYLES: Record<string, { bg: string; color: string; dot: string }> =
  {
    Infrastructure: { bg: "#eff6ff", color: "#2563eb", dot: "#3b82f6" },
    "Dev/DevOps": { bg: "#f5f3ff", color: "#7c3aed", dot: "#8b5cf6" },
    AI: { bg: "#fef2f2", color: "#dc2626", dot: "#ef4444" },
    Marketing: { bg: "#fffbeb", color: "#d97706", dot: "#f59e0b" },
    Sales: { bg: "#ecfdf5", color: "#059669", dot: "#10b981" },
    all: { bg: "#f3f4f6", color: "#4b5563", dot: "#6b7280" },
  };

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

function isStarred(app: Application) {
  return (app.admin_notes || "").includes("[STARRED]");
}

function hasZalo(app: Application) {
  return /zalo/i.test(app.admin_notes || "");
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return (parts.length ? parts.slice(-2) : ["?"])
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getPrimaryTeam(app: Application) {
  const positions = app.career_journey || [];
  return (
    Object.entries(TEAM_POSITIONS).find(([, teamPositions]) =>
      positions.some((pos) => teamPositions.includes(pos)),
    )?.[0] || "all"
  );
}

function formatSubmittedAt(value: string) {
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
      setToasts((prev) => [...prev, { id, msg, type }]);
      setTimeout(
        () => setToasts((prev) => prev.filter((toast) => toast.id !== id)),
        3500,
      );
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

      let filtered = all;
      if (statusFilter !== "all") {
        filtered = filtered.filter((app) => app.status === statusFilter);
      }
      if (teamFilter !== "all") {
        const positions = TEAM_POSITIONS[teamFilter] || [];
        filtered = filtered.filter((app) =>
          (app.career_journey || []).some((pos) => positions.includes(pos)),
        );
      }

      setApps(filtered);
    } catch {
      addToast("Lỗi tải danh sách ứng viên", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast, search, statusFilter, teamFilter]);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  const handleView = (app: Application) => {
    if (app.status === "new") {
      fetch(`/api/applications/${app.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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
      addToast("Lỗi xóa ứng viên", "error");
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
        headers: { "Content-Type": "application/json" },
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
      addToast("Lỗi cập nhật đánh dấu", "error");
    } finally {
      setTogglingId(null);
    }
  };

  const handleSyncSheet = async () => {
    setSyncing(true);
    try {
      const res = await fetch("/api/applications/sync-sheet", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      addToast(data.message || "Đã đồng bộ Google Sheet");
    } catch (err) {
      addToast(err instanceof Error ? err.message : "Lỗi đồng bộ", "error");
    } finally {
      setSyncing(false);
    }
  };

  const sortedApps = useMemo(
    () =>
      [...apps].sort((a, b) => {
        const aStarred =
          isStarred(a) && (a.status === "new" || a.status === "reviewing")
            ? 1
            : 0;
        const bStarred =
          isStarred(b) && (b.status === "new" || b.status === "reviewing")
            ? 1
            : 0;
        return bStarred - aStarred;
      }),
    [apps],
  );

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allApps.length };
    STATUS_OPTIONS.forEach((status) => {
      counts[status.value] = allApps.filter(
        (app) => app.status === status.value,
      ).length;
    });
    return counts;
  }, [allApps]);

  const teamCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allApps.length };
    TEAM_FILTERS.slice(1).forEach((team) => {
      const positions = TEAM_POSITIONS[team] || [];
      counts[team] = allApps.filter((app) =>
        (app.career_journey || []).some((pos) => positions.includes(pos)),
      ).length;
    });
    return counts;
  }, [allApps]);

  const stats = useMemo(() => {
    const total = allApps.length;
    if (total === 0) return null;

    const sorted = (map: Record<string, number>) =>
      Object.entries(map).sort((a, b) => b[1] - a[1]);

    const careerMap: Record<string, number> = {};
    const teamMap: Record<string, number> = {};
    const interestMap: Record<string, number> = {};
    const problemMap: Record<string, number> = {};
    const feedbackMap: Record<string, number> = {};
    const workMap: Record<string, number> = {};
    const schoolMap: Record<string, number> = {};
    const dateMap: Record<string, number> = {};

    Object.keys(TEAM_POSITIONS).forEach((team) => {
      teamMap[team] = 0;
    });

    allApps.forEach((app) => {
      (app.career_journey || []).forEach((career) => {
        careerMap[career] = (careerMap[career] || 0) + 1;
      });

      const team = getPrimaryTeam(app);
      if (team !== "all") teamMap[team] = (teamMap[team] || 0) + 1;

      (app.interest_reason || []).forEach((reason) => {
        interestMap[reason] = (interestMap[reason] || 0) + 1;
      });

      (app.problem_solving || []).forEach((problem) => {
        problemMap[problem] = (problemMap[problem] || 0) + 1;
      });

      (app.feedback_response || []).forEach((feedback) => {
        feedbackMap[feedback] = (feedbackMap[feedback] || 0) + 1;
      });

      Object.entries(app.work_preference || {}).forEach(([mode, cities]) => {
        if (!Array.isArray(cities)) return;
        cities.forEach((city) => {
          const key = `${mode} - ${city}`;
          workMap[key] = (workMap[key] || 0) + 1;
        });
      });

      const school = (app.school || "").trim();
      if (school) schoolMap[school] = (schoolMap[school] || 0) + 1;

      const date = new Date(app.created_at).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      });
      dateMap[date] = (dateMap[date] || 0) + 1;
    });

    const dateSorted = Object.entries(dateMap).sort((a, b) => {
      const [dA, mA] = a[0].split("/").map(Number);
      const [dB, mB] = b[0].split("/").map(Number);
      return mA !== mB ? mA - mB : dA - dB;
    });

    const freeText: { name: string; fullName: string; answer: string }[] = [];
    const textFields: { key: keyof Application; label: string }[] = [
      { key: "why_apply", label: "Lý do ứng tuyển" },
      { key: "experience", label: "Kinh nghiệm" },
      { key: "skills", label: "Kỹ năng" },
      { key: "goal", label: "Mục tiêu" },
      { key: "strengths", label: "Điểm mạnh" },
      { key: "weaknesses", label: "Điểm yếu" },
      { key: "expectation", label: "Kỳ vọng" },
      { key: "note", label: "Ghi chú" },
    ];

    allApps.forEach((app) => {
      textFields.forEach((field) => {
        const value = ((app[field.key] as string) || "").trim();
        if (value) {
          freeText.push({
            name: field.label,
            fullName: app.full_name,
            answer: value,
          });
        }
      });
    });

    const hasCv = allApps.filter((app) => app.cv?.trim()).length;
    const zaloCount = allApps.filter(hasZalo).length;

    return {
      total,
      career: sorted(careerMap),
      team: sorted(teamMap),
      interest: sorted(interestMap),
      problem: sorted(problemMap),
      feedback: sorted(feedbackMap),
      work: sorted(workMap),
      school: sorted(schoolMap).slice(0, 20),
      date: dateSorted,
      cv: [
        ["Có nộp CV", hasCv],
        ["Chưa nộp CV", total - hasCv],
      ] as [string, number][],
      zalo: [
        ["SĐT là Zalo", zaloCount],
        ["Không phải Zalo", total - zaloCount],
      ] as [string, number][],
      freeText,
      textFields: textFields.map((field) => field.label),
    };
  }, [allApps]);

  const statusTabs = [
    {
      value: "all",
      label: "Tất cả",
      count: allApps.length,
      color: "#4a2318",
      bg: "#f8f4f1",
    },
    ...STATUS_OPTIONS.map((status) => ({
      value: status.value,
      label: status.label,
      count: statusCounts[status.value] || 0,
      color: status.color,
      bg: status.bg,
    })),
  ];

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white px-10 py-8 shadow-sm">
          <div
            className="h-10 w-10 animate-spin rounded-full border-2 border-t-transparent"
            style={{ borderColor: "#8b4513", borderTopColor: "transparent" }}
          />
          <p className="text-sm font-medium text-gray-500">
            Đang tải danh sách...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="mx-auto max-w-[1380px] space-y-6"
      style={{ fontFamily: "system-ui, sans-serif" }}
    >
      <ToastStack toasts={toasts} />

      <ConfirmModal
        action={confirmAction}
        onCancel={() => setConfirmAction(null)}
      />

      <section className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f6eee9] text-[#4a2318]">
              <Users size={17} />
            </span>
            <div className="min-w-0">
              <h2 className="text-sm font-black text-gray-950">
                Danh sách ứng viên
              </h2>
              <p className="text-[11px] font-semibold text-gray-500">
                {sortedApps.length} đang hiển thị
              </p>
            </div>
          </div>

          <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
            {stats && (
              <button
                type="button"
                onClick={() => setShowStats(true)}
                className="inline-flex h-8 items-center gap-2 rounded-xl px-3 text-xs font-bold text-white shadow-sm transition hover:opacity-90"
                style={{ background: "#4a2318" }}
              >
                <BarChart3 size={14} />
                Thống kê
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                fetchApps();
              }}
              className="inline-flex h-8 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 text-xs font-bold text-gray-600 transition hover:bg-gray-50"
            >
              <RefreshCw size={14} />
              Tải lại
            </button>
            <button
              type="button"
              onClick={handleSyncSheet}
              disabled={syncing}
              className="inline-flex h-8 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 text-xs font-bold text-gray-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-50"
            >
              <Database size={14} />
              {syncing ? "Đang đồng bộ..." : "Sync Sheet"}
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3">
          {/* Search */}
          <div className="relative min-w-[200px] flex-1">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm tên, email, SĐT..."
              className="h-9 w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm text-gray-700 outline-none transition focus:border-[#a0522d] focus:bg-white focus:ring-2 focus:ring-[#f6eee9]"
            />
          </div>

          {/* Team filter */}
          <label className="relative block w-[200px] shrink-0">
            <Filter
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <select
              value={teamFilter}
              onChange={(event) => setTeamFilter(event.target.value)}
              className="h-9 w-full appearance-none rounded-xl border border-gray-200 bg-white pl-9 pr-8 text-sm font-bold text-gray-600 outline-none transition focus:border-[#a0522d] focus:ring-2 focus:ring-[#f6eee9]"
            >
              {TEAM_FILTERS.map((team) => (
                <option key={team} value={team}>
                  {`${team === "all" ? "Tất cả team" : team} (${teamCounts[team] ?? 0})`}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              ▾
            </span>
          </label>

        </div>

        <div className="mt-2 flex gap-2 overflow-x-auto">
          {statusTabs.map((status) => {
            const active = statusFilter === status.value;
            return (
              <button
                key={status.value}
                type="button"
                onClick={() => setStatusFilter(status.value)}
                className="inline-flex h-8 shrink-0 items-center gap-2 rounded-xl border px-3 text-xs font-bold transition"
                style={
                  active
                    ? {
                        borderColor: status.color,
                        background: status.bg,
                        color: status.color,
                      }
                    : {
                        borderColor: "#e5e7eb",
                        background: "#fff",
                        color: "#6b7280",
                      }
                }
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: status.color }}
                />
                {status.label}
                <span className="rounded-full bg-white/70 px-1.5 text-[10px]">
                  {status.count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {sortedApps.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="flex flex-col gap-2">
            {sortedApps.map((app) => (
              <CandidateRow
                key={app.id}
                app={app}
                deleting={deletingId === app.id}
                toggling={togglingId === app.id}
                onView={() => handleView(app)}
                onToggleStar={() => toggleStar(app)}
                onDelete={() =>
                  setConfirmAction({
                    title: "Xóa ứng viên?",
                    desc: "Hành động này không thể hoàn tác.",
                    detail: `${app.full_name} - ${app.email}`,
                    danger: true,
                    onConfirm: () => handleDelete(app),
                  })
                }
              />
            ))}
          </div>
          <p className="text-center text-xs font-bold text-gray-400">
            Hiển thị {sortedApps.length} / {allApps.length}
          </p>
        </>
      )}

      {stats &&
        showStats &&
        createPortal(
          <StatsModal
            stats={stats}
            allApps={allApps}
            onClose={() => setShowStats(false)}
          />,
          document.body,
        )}
    </div>
  );
}

function CandidateRow({
  app,
  deleting,
  toggling,
  onView,
  onToggleStar,
  onDelete,
}: {
  app: Application;
  deleting: boolean;
  toggling: boolean;
  onView: () => void;
  onToggleStar: () => void;
  onDelete: () => void;
}) {
  const status = getStatusInfo(app.status);
  const team = getPrimaryTeam(app);
  const teamStyle = TEAM_STYLES[team] || TEAM_STYLES.all;
  const starred = isStarred(app);
  const submitted = formatSubmittedAt(app.created_at);
  const positions = app.career_journey || [];

  return (
    <div
      className={`flex items-center gap-4 rounded-2xl border bg-white px-4 py-3 shadow-sm transition hover:shadow-md ${
        starred ? "border-amber-200 bg-amber-50/30" : "border-gray-200"
      }`}
    >
      {/* Avatar */}
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black text-white"
        style={{ background: status.color }}
      >
        {getInitials(app.full_name)}
      </div>

      {/* Name + school */}
      <div className="w-44 shrink-0">
        <p className="truncate text-sm font-black text-gray-950">{app.full_name || "---"}</p>
        {app.school && (
          <p className="truncate text-xs font-medium text-gray-400">{app.school}</p>
        )}
      </div>

      {/* Contact */}
      <div className="hidden min-w-0 flex-1 md:block">
        <p className="truncate text-xs font-semibold text-gray-700">{app.email || "---"}</p>
        <div className="mt-0.5 flex items-center gap-1.5">
          <p className="text-xs text-gray-400">{app.phone || "---"}</p>
          {hasZalo(app) && (
            <span className="rounded-md border border-blue-100 bg-blue-50 px-1.5 py-0.5 text-[10px] font-black text-blue-600">
              Zalo
            </span>
          )}
        </div>
      </div>

      {/* Positions */}
      <div className="hidden w-48 shrink-0 flex-wrap items-center gap-1.5 lg:flex">
        {positions.slice(0, 2).map((pos) => {
          const color = POSITION_COLORS[pos] || DEFAULT_POS_COLOR;
          return (
            <span
              key={pos}
              className="rounded-lg border border-black/5 px-2 py-0.5 text-[11px] font-bold"
              style={{ background: color.bg, color: color.color }}
            >
              {pos}
            </span>
          );
        })}
        {positions.length > 2 && (
          <span className="text-xs font-bold text-gray-400">+{positions.length - 2}</span>
        )}
      </div>

      {/* Status + team */}
      <div className="hidden shrink-0 items-center gap-2 sm:flex">
        <span
          className="inline-flex h-6 items-center gap-1 rounded-lg px-2 text-[11px] font-bold"
          style={{ background: status.bg, color: status.color }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: status.color }} />
          {status.label}
        </span>
        {team !== "all" && (
          <span
            className="hidden h-6 items-center gap-1 rounded-lg px-2 text-[11px] font-bold xl:inline-flex"
            style={{ background: teamStyle.bg, color: teamStyle.color }}
          >
            {team}
          </span>
        )}
      </div>

      {/* Date */}
      <p className="hidden shrink-0 text-xs font-semibold text-gray-400 lg:block">
        {submitted.date}
      </p>

      {/* Actions */}
      <div className="ml-auto flex shrink-0 items-center gap-1.5">
        <button
          type="button"
          onClick={onToggleStar}
          disabled={toggling}
          className="flex h-8 w-8 items-center justify-center rounded-xl text-gray-300 transition hover:bg-amber-50 hover:text-amber-500 disabled:opacity-50"
        >
          <Star size={15} className={starred ? "fill-amber-400 text-amber-500" : ""} />
        </button>
        {app.cv && (
          <a
            href={app.cv}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-2.5 text-xs font-bold text-gray-700 transition hover:bg-gray-100"
          >
            <FileText size={13} />
            CV
          </a>
        )}
        <button
          type="button"
          onClick={onView}
          className="inline-flex h-8 items-center gap-1.5 rounded-xl bg-gray-100 px-2.5 text-xs font-bold text-gray-900 transition hover:bg-gray-200"
        >
          <Eye size={13} />
          Chi tiết
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={deleting}
          className="flex h-8 w-8 items-center justify-center rounded-xl text-red-400 transition hover:bg-red-50 disabled:opacity-50"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

function ToastStack({
  toasts,
}: {
  toasts: { id: number; msg: string; type: "success" | "error" }[];
}) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-2xl px-4 py-3 text-sm font-bold text-white shadow-lg ${
            toast.type === "error" ? "bg-red-500" : "bg-gray-950"
          }`}
        >
          {toast.msg}
        </div>
      ))}
    </div>
  );
}

function ConfirmModal({
  action,
  onCancel,
}: {
  action: {
    title: string;
    desc: string;
    detail: string;
    onConfirm: () => void;
    danger?: boolean;
  } | null;
  onCancel: () => void;
}) {
  if (!action) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <h3 className="text-base font-black text-gray-900">{action.title}</h3>
        <p className="mt-2 text-sm text-gray-500">{action.desc}</p>
        <p
          className={`mt-2 text-sm font-bold ${
            action.danger ? "text-red-600" : "text-gray-700"
          }`}
        >
          {action.detail}
        </p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-2xl border border-gray-200 py-2.5 text-sm font-bold text-gray-600 transition hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={action.onConfirm}
            className={`flex-1 rounded-2xl py-2.5 text-sm font-bold text-white transition ${
              action.danger
                ? "bg-red-500 hover:bg-red-600"
                : "bg-gray-950 hover:bg-gray-800"
            }`}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
        <Users size={26} />
      </div>
      <p className="text-sm font-black text-gray-700">Chưa có ứng viên nào</p>
      <p className="mt-1 text-xs text-gray-400">
        Dữ liệu sẽ xuất hiện sau khi có người gửi form.
      </p>
    </div>
  );
}

function StatsModal({
  stats,
  allApps,
  onClose,
}: {
  stats: {
    total: number;
    career: [string, number][];
    team: [string, number][];
    interest: [string, number][];
    problem: [string, number][];
    feedback: [string, number][];
    work: [string, number][];
    school: [string, number][];
    date: [string, number][];
    cv: [string, number][];
    zalo: [string, number][];
    freeText: { name: string; fullName: string; answer: string }[];
    textFields: string[];
  };
  allApps: Application[];
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-6xl overflow-hidden rounded-3xl bg-gray-50 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-2xl"
              style={{ background: "#f5f0ed", color: "#4a2318" }}
            >
              <BarChart3 size={19} />
            </span>
            <div>
              <h2 className="text-lg font-black text-gray-950">
                Thống kê tổng hợp
              </h2>
              <p className="text-xs font-medium text-gray-400">
                {stats.total} ứng viên đang được theo dõi
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 px-5 pt-5 sm:grid-cols-3 md:grid-cols-5 sm:px-6">
          {STATUS_OPTIONS.map((status) => {
            const count = allApps.filter(
              (app) => app.status === status.value,
            ).length;
            return (
              <div
                key={status.value}
                className="rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm"
              >
                <div
                  className="text-2xl font-black"
                  style={{ color: status.color }}
                >
                  {count}
                </div>
                <div className="mt-1 text-[11px] font-bold text-gray-500">
                  {status.label}
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-5 px-5 py-5 lg:grid-cols-2 sm:px-6">
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
            title="Ngày nộp"
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

        <div className="px-5 pb-6 sm:px-6">
          <FreeTextSection answers={stats.freeText} fields={stats.textFields} />
        </div>
      </div>
    </div>
  );
}

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
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-3.5">
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ background: defaultColor }}
        />
        <h3 className="text-sm font-black text-gray-800">{title}</h3>
        <span className="ml-auto text-xs font-bold text-gray-400">
          {data.length} mục
        </span>
      </div>
      <div className="flex max-h-[420px] flex-col gap-3 overflow-y-auto px-5 py-4">
        {data.length === 0 && (
          <p className="py-4 text-center text-xs text-gray-400">
            Chưa có dữ liệu
          </p>
        )}
        {data.map(([label, count]) => {
          const pct = total > 0 ? ((count / total) * 100).toFixed(1) : "0";
          const barWidth = max > 0 ? (count / max) * 100 : 0;
          const color = colorMap?.[label]?.color || defaultColor;

          return (
            <div key={label}>
              <div className="mb-1 flex items-baseline justify-between gap-3">
                <span
                  className="max-w-[70%] truncate text-xs font-bold text-gray-700"
                  title={label}
                >
                  {label}
                </span>
                <span className="shrink-0 text-xs font-black" style={{ color }}>
                  {count}{" "}
                  <span className="font-medium text-gray-400">({pct}%)</span>
                </span>
              </div>
              <div className="relative h-5 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                <div
                  className="h-full rounded-lg transition-all duration-500"
                  style={{
                    width: `${barWidth}%`,
                    background: `linear-gradient(90deg, ${color}cc, ${color})`,
                    minWidth: count > 0 ? "4px" : "0",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FreeTextSection({
  answers,
  fields,
}: {
  answers: { name: string; fullName: string; answer: string }[];
  fields: string[];
}) {
  const [activeField, setActiveField] = useState(fields[0] || "");
  const filtered = answers.filter((answer) => answer.name === activeField);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-3.5">
        <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
        <h3 className="text-sm font-black text-gray-800">Câu trả lời tự nhập</h3>
        <span className="ml-auto text-xs font-bold text-gray-400">
          {filtered.length} câu trả lời
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 px-5 pb-2 pt-3">
        {fields.map((field) => {
          const count = answers.filter((answer) => answer.name === field).length;
          return (
            <button
              key={field}
              type="button"
              onClick={() => setActiveField(field)}
              className="rounded-xl px-2.5 py-1.5 text-xs font-bold transition"
              style={
                activeField === field
                  ? { background: "#4a2318", color: "#fff" }
                  : { background: "#f3f4f6", color: "#6b7280" }
              }
            >
              {field}
              {count > 0 && <span className="ml-1 opacity-60">{count}</span>}
            </button>
          );
        })}
      </div>

      <div className="flex max-h-[420px] flex-col gap-2.5 overflow-y-auto px-5 py-3">
        {filtered.length === 0 && (
          <p className="py-4 text-center text-xs text-gray-400">
            Chưa có câu trả lời
          </p>
        )}
        {filtered.map((answer, index) => (
          <div
            key={`${answer.fullName}-${index}`}
            className="rounded-2xl border border-gray-100 bg-gray-50 p-3"
          >
            <p className="mb-1.5 text-xs font-black text-gray-700">
              {answer.fullName}
            </p>
            <p className="whitespace-pre-wrap text-xs leading-relaxed text-gray-600">
              {answer.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
