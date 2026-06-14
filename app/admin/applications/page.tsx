"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BarChart3,
  BriefcaseBusiness,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Database,
  Eye,
  FileText,
  Filter,
  History,
  LayoutGrid,
  Rows3,
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
import type { RecruitmentActivityLog } from "@/lib/recruitment-activity-log";
import {
  TEAM_FILTERS,
  TEAM_POSITIONS,
  POSITION_COLORS,
  getInitials,
  getPrimaryTeam,
  hasZalo,
  isStarred,
  toggleStarredNotes,
  formatSubmittedAt,
  getRecruitmentMeta,
  upsertRecruitmentMeta,
  LEADER_TEAMS,
  TEAM_STYLES,
  type RecruitmentPosition,
  type RecruitmentLeader,
} from "@/lib/recruitment";
import { StatusSelect } from "../components/StatusControl";
import PositionTags from "../components/PositionTags";
import Spinner from "../components/Spinner";
import { ToastStack, useToasts } from "../components/Toast";
import ConfirmModal, { type ConfirmAction } from "../components/ConfirmModal";

type SortKey = "name" | "team" | "leader" | "status" | "date";
type PeopleScope = "all" | "reviewing" | "employees";

const STATUS_ORDER: Record<string, number> = STATUS_OPTIONS.reduce(
  (acc, status, index) => ({ ...acc, [status.value]: index }),
  {} as Record<string, number>,
);

const EMPLOYEE_STATUSES: ApplicationStatus[] = ["accepted", "resigned"];
const CLOSED_STATUSES: ApplicationStatus[] = [
  "accepted",
  "rejected",
  "resigned",
];

function starRank(app: Application) {
  return isStarred(app) && (app.status === "new" || app.status === "reviewing")
    ? 1
    : 0;
}

function ApplicationsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [allApps, setAllApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(() => searchParams.get("q") || "");
  const [statusFilter, setStatusFilter] = useState(
    () => searchParams.get("status") || "all",
  );
  const [teamFilter, setTeamFilter] = useState(
    () => searchParams.get("team") || "all",
  );
  const [leaderFilter, setLeaderFilter] = useState(
    () => searchParams.get("leader") || "all",
  );
  const [peopleScope, setPeopleScope] = useState<PeopleScope>(() => {
    const scope = searchParams.get("scope");
    return scope === "reviewing" || scope === "employees" ? scope : "all";
  });
  const [sortKey, setSortKey] = useState<SortKey | null>(
    () => (searchParams.get("sort") as SortKey | null) || null,
  );
  const [sortDir, setSortDir] = useState<"asc" | "desc">(
    () => (searchParams.get("dir") === "desc" ? "desc" : "asc"),
  );
  const [viewMode, setViewMode] = useState<"table" | "card">(
    () => (searchParams.get("view") === "card" ? "card" : "table"),
  );
  const [pageSize, setPageSize] = useState<10 | 25 | 50>(() => {
    const limit = Number(searchParams.get("limit"));
    return limit === 10 || limit === 50 ? limit : 25;
  });
  const [page, setPage] = useState(() => {
    const value = Number(searchParams.get("page"));
    return Number.isFinite(value) && value > 0 ? value : 1;
  });
  const { toasts, addToast } = useToasts();
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [statusSavingId, setStatusSavingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkSaving, setBulkSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showActivityLogs, setShowActivityLogs] = useState(false);
  const [activityLogs, setActivityLogs] = useState<RecruitmentActivityLog[]>([]);
  const [activityLogsLoading, setActivityLogsLoading] = useState(false);
  const [leaderSavingId, setLeaderSavingId] = useState<string | null>(null);
  const [leaders, setLeaders] = useState<RecruitmentLeader[]>([]);
  const [positions, setPositions] = useState<RecruitmentPosition[]>([]);
  const [showPositions, setShowPositions] = useState(false);
  const [positionSavingId, setPositionSavingId] = useState<string | null>(null);
  const [acceptDraft, setAcceptDraft] = useState<{
    app: Application;
    leaderId: string;
    startLevelDate: string;
  } | null>(null);

  const fetchApps = useCallback(async () => {
    try {
      const res = await fetch(`/api/applications?limit=1000`);
      const data = await res.json();
      const all: Application[] = data.applications || [];
      setAllApps(all);
    } catch {
      addToast("Lỗi tải danh sách ứng viên", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const fetchLeaders = useCallback(async () => {
    try {
      const res = await fetch("/api/recruitment/leaders");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không tải được leader");
      setLeaders(Array.isArray(data.leaders) ? data.leaders : []);
    } catch {
      addToast("Lỗi tải danh sách leader", "error");
    }
  }, [addToast]);

  const fetchPositions = useCallback(async () => {
    try {
      const res = await fetch("/api/recruitment/positions?includeInactive=1");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không tải được vị trí");
      setPositions(Array.isArray(data.positions) ? data.positions : []);
    } catch {
      addToast("Lỗi tải danh sách vị trí tuyển", "error");
    }
  }, [addToast]);

  const fetchActivityLogs = useCallback(async () => {
    setActivityLogsLoading(true);
    try {
      const res = await fetch("/api/recruitment/activity-logs?limit=120");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không tải được nhật ký");
      setActivityLogs(Array.isArray(data.logs) ? data.logs : []);
    } catch (error) {
      addToast(
        error instanceof Error ? error.message : "Không tải được nhật ký",
        "error",
      );
    } finally {
      setActivityLogsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchApps();
    fetchLeaders();
    fetchPositions();
  }, [fetchApps, fetchLeaders, fetchPositions]);

  // Sync filters + view to the URL (debounced) so reload/back/share keep state.
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams();
      if (search.trim()) params.set("q", search.trim());
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (teamFilter !== "all") params.set("team", teamFilter);
      if (leaderFilter !== "all") params.set("leader", leaderFilter);
      if (peopleScope !== "all") params.set("scope", peopleScope);
      if (pageSize !== 25) params.set("limit", String(pageSize));
      if (page > 1) params.set("page", String(page));
      if (sortKey) {
        params.set("sort", sortKey);
        params.set("dir", sortDir);
      }
      if (viewMode === "card") params.set("view", "card");
      const qs = params.toString();
      router.replace(qs ? `/admin/applications?${qs}` : "/admin/applications", {
        scroll: false,
      });
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [
    search,
    statusFilter,
    teamFilter,
    leaderFilter,
    peopleScope,
    pageSize,
    page,
    sortKey,
    sortDir,
    viewMode,
    router,
  ]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  useEffect(() => {
    setPage(1);
  }, [
    search,
    statusFilter,
    teamFilter,
    leaderFilter,
    peopleScope,
    sortKey,
    sortDir,
    pageSize,
  ]);

  const handleView = (app: Application) => {
    // Save the current filtered order so the detail page can offer prev/next.
    try {
      sessionStorage.setItem(
        "recruitment:nav",
        JSON.stringify(sortedApps.map((a) => a.id)),
      );
    } catch {
      /* ignore storage errors */
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
      setAllApps((prev) => prev.filter((item) => item.id !== app.id));
      addToast(`Đã xóa: ${app.full_name}`);
    } catch {
      addToast("Lỗi xóa ứng viên", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const confirmDelete = (app: Application) =>
    setConfirmAction({
      title: "Xóa ứng viên?",
      desc: "Hành động này không thể hoàn tác.",
      detail: `${app.full_name} - ${app.email}`,
      danger: true,
      onConfirm: () => handleDelete(app),
    });

  const toggleStar = async (app: Application) => {
    setTogglingId(app.id);
    const starred = isStarred(app);
    const newNotes = toggleStarredNotes(app.admin_notes || "", !starred);

    // optimistic update
    setAllApps((prev) =>
      prev.map((item) =>
        item.id === app.id ? { ...item, admin_notes: newNotes } : item,
      ),
    );

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
    } catch {
      // revert
      setAllApps((prev) =>
        prev.map((item) =>
          item.id === app.id
            ? { ...item, admin_notes: app.admin_notes }
            : item,
        ),
      );
      addToast("Lỗi cập nhật đánh dấu", "error");
    } finally {
      setTogglingId(null);
    }
  };

  const handleStatusChange = async (
    app: Application,
    next: ApplicationStatus,
  ) => {
    if (next === app.status) return;
    if (next === "accepted") {
      const meta = getRecruitmentMeta(app.admin_notes || "");
      setAcceptDraft({
        app,
        leaderId: meta.leader?.id || "",
        startLevelDate: meta.startLevelDate || todayInputValue(),
      });
      return;
    }
    setStatusSavingId(app.id);
    const prevStatus = app.status;

    // optimistic update
    setAllApps((prev) =>
      prev.map((item) =>
        item.id === app.id ? { ...item, status: next } : item,
      ),
    );

    try {
      const res = await fetch(`/api/applications/${app.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error();
      setAllApps((prev) =>
        prev.map((item) => (item.id === app.id ? data : item)),
      );
      addToast(`Cập nhật trạng thái: ${app.full_name}`);
    } catch {
      setAllApps((prev) =>
        prev.map((item) =>
          item.id === app.id ? { ...item, status: prevStatus } : item,
        ),
      );
      addToast("Lỗi cập nhật trạng thái", "error");
    } finally {
      setStatusSavingId(null);
    }
  };

  const handleLeaderChange = async (app: Application, leaderId: string) => {
    if (app.status === "resigned") {
      addToast("Nhân viên đã nghỉ không thể sửa leader", "error");
      return;
    }

    setConfirmAction(null);
    setLeaderSavingId(app.id);
    try {
      const res = await fetch(`/api/applications/${app.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leaderId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi cập nhật leader");
      setAllApps((prev) =>
        prev.map((item) => (item.id === app.id ? data : item)),
      );
      if (showActivityLogs) fetchActivityLogs();
      addToast(`Đã cập nhật leader: ${app.full_name}`);
    } catch (error) {
      addToast(
        error instanceof Error ? error.message : "Lỗi cập nhật leader",
        "error",
      );
    } finally {
      setLeaderSavingId(null);
    }
  };

  const confirmLeaderChange = (app: Application, leaderId: string) => {
    const meta = getRecruitmentMeta(app.admin_notes || "");
    const currentLeaderName = meta.leader?.name || "Chưa gán";
    const nextLeader =
      leaders.find((leader) => leader.id === leaderId) || null;
    const nextLeaderName = nextLeader?.name || "Chưa gán";

    if ((meta.leader?.id || "") === leaderId) return;
    if (app.status === "resigned") {
      addToast("Nhân viên đã nghỉ không thể sửa leader", "error");
      return;
    }

    setConfirmAction({
      title: "Đổi leader?",
      desc:
        leaderId && !EMPLOYEE_STATUSES.includes(app.status)
          ? "Hồ sơ đang xét sẽ tự chuyển sang trạng thái Đã nhận."
          : "Leader mới sẽ được lưu vào hồ sơ ứng viên.",
      detail: `${app.full_name}: ${currentLeaderName} -> ${nextLeaderName}`,
      onConfirm: () => handleLeaderChange(app, leaderId),
    });
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

  const handleTogglePosition = async (position: RecruitmentPosition) => {
    const nextActive = !position.is_active;
    setPositionSavingId(position.id);
    const snapshot = positions;
    setPositions((prev) =>
      prev.map((item) =>
        item.id === position.id ? { ...item, is_active: nextActive } : item,
      ),
    );

    try {
      const res = await fetch(`/api/recruitment/positions/${position.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: nextActive }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi cập nhật vị trí");
      const updated = data.position as RecruitmentPosition;
      setPositions((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item)),
      );
      addToast(
        nextActive
          ? `Đã mở tuyển: ${position.label}`
          : `Đã ẩn khỏi form: ${position.label}`,
      );
    } catch {
      setPositions(snapshot);
      addToast("Lỗi cập nhật vị trí tuyển", "error");
    } finally {
      setPositionSavingId(null);
    }
  };

  const confirmAcceptEmployee = async () => {
    if (!acceptDraft) return;
    const { app, leaderId, startLevelDate } = acceptDraft;
    const leader = leaders.find((item) => item.id === leaderId) || null;
    const meta = getRecruitmentMeta(app.admin_notes || "");
    const finalDate = startLevelDate || todayInputValue();
    const nextManagement = {
      ...meta,
      leader,
      currentLevel: "lv1" as const,
      startLevelDate: finalDate,
      levels: {
        ...meta.levels,
        lv1: {
          ...meta.levels.lv1,
          startedAt: finalDate,
        },
      },
    };
    const finalNotes = upsertRecruitmentMeta(
      app.admin_notes || "",
      nextManagement,
    );

    setStatusSavingId(app.id);
    try {
      const res = await fetch(`/api/applications/${app.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "accepted", admin_notes: finalNotes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi cập nhật trạng thái");
      setAllApps((prev) =>
        prev.map((item) => (item.id === app.id ? data : item)),
      );
      setAcceptDraft(null);
      addToast(`Đã nhận nhân viên: ${app.full_name}`);
    } catch (error) {
      addToast(
        error instanceof Error ? error.message : "Lỗi cập nhật trạng thái",
        "error",
      );
    } finally {
      setStatusSavingId(null);
    }
  };

  const toggleSelect = (id: string) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const clearSelection = () => setSelectedIds(new Set());

  const bulkStatusChange = async (next: ApplicationStatus) => {
    const ids = [...selectedIds];
    if (ids.length === 0) return;
    if (next === "accepted") {
      if (ids.length === 1) {
        const app = allApps.find((item) => item.id === ids[0]);
        if (app) {
          const meta = getRecruitmentMeta(app.admin_notes || "");
          setAcceptDraft({
            app,
            leaderId: meta.leader?.id || "",
            startLevelDate: meta.startLevelDate || todayInputValue(),
          });
        }
      } else {
        addToast("Hãy nhận từng hồ sơ để chọn leader và ngày start level.", "error");
      }
      return;
    }
    setBulkSaving(true);
    const snapshot = allApps;
    setAllApps((prev) =>
      prev.map((item) =>
        selectedIds.has(item.id) ? { ...item, status: next } : item,
      ),
    );
    try {
      await Promise.all(
        ids.map((id) =>
          fetch(`/api/applications/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: next }),
          }).then((r) => {
            if (!r.ok) throw new Error();
          }),
        ),
      );
      addToast(`Đã cập nhật ${ids.length} hồ sơ`);
      clearSelection();
    } catch {
      setAllApps(snapshot);
      addToast("Lỗi cập nhật hàng loạt", "error");
    } finally {
      setBulkSaving(false);
    }
  };

  const bulkDelete = async () => {
    const ids = [...selectedIds];
    if (ids.length === 0) return;
    setConfirmAction(null);
    setBulkSaving(true);
    const snapshot = allApps;
    setAllApps((prev) => prev.filter((item) => !selectedIds.has(item.id)));
    try {
      await Promise.all(
        ids.map((id) =>
          fetch(`/api/applications/${id}`, { method: "DELETE" }).then((r) => {
            if (!r.ok) throw new Error();
          }),
        ),
      );
      addToast(`Đã xóa ${ids.length} hồ sơ`);
      clearSelection();
    } catch {
      setAllApps(snapshot);
      addToast("Lỗi xóa hàng loạt", "error");
    } finally {
      setBulkSaving(false);
    }
  };

  const confirmBulkDelete = () =>
    setConfirmAction({
      title: "Xóa các hồ sơ đã chọn?",
      desc: "Hành động này không thể hoàn tác.",
      detail: `${selectedIds.size} hồ sơ`,
      danger: true,
      onConfirm: bulkDelete,
    });

  const sortedApps = useMemo(() => {
    const query = search.trim().toLowerCase();
    let filtered = allApps;

    if (query) {
      filtered = filtered.filter((app) =>
        [app.full_name, app.email, app.phone, app.school]
          .filter(Boolean)
          .some((field) => field!.toLowerCase().includes(query)),
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }
    if (peopleScope === "reviewing") {
      filtered = filtered.filter(
        (app) => !CLOSED_STATUSES.includes(app.status),
      );
    }
    if (peopleScope === "employees") {
      filtered = filtered.filter((app) =>
        EMPLOYEE_STATUSES.includes(app.status),
      );
    }
    if (teamFilter !== "all") {
      const positions = TEAM_POSITIONS[teamFilter] || [];
      filtered = filtered.filter((app) =>
        (app.career_journey || []).some((pos) => positions.includes(pos)),
      );
    }
    if (leaderFilter !== "all") {
      filtered = filtered.filter((app) => {
        const leader = getRecruitmentMeta(app.admin_notes || "").leader;
        if (leaderFilter === "none") return !leader;
        return leader?.id === leaderFilter;
      });
    }

    const dir = sortDir === "asc" ? 1 : -1;
    const compare = (a: Application, b: Application) => {
      switch (sortKey) {
        case "name":
          return dir * (a.full_name || "").localeCompare(b.full_name || "", "vi");
        case "team":
          return dir * getPrimaryTeam(a).localeCompare(getPrimaryTeam(b), "vi");
        case "leader": {
          const leaderA = getRecruitmentMeta(a.admin_notes || "").leader?.name || "";
          const leaderB = getRecruitmentMeta(b.admin_notes || "").leader?.name || "";
          return dir * leaderA.localeCompare(leaderB, "vi");
        }
        case "status":
          return (
            dir *
            ((STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99))
          );
        case "date":
          return (
            dir *
            (new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
          );
        default:
          return 0;
      }
    };

    return [...filtered].sort((a, b) => {
      // Tier 1: starred new/reviewing always float to top
      const starDiff = starRank(b) - starRank(a);
      if (starDiff !== 0) return starDiff;
      // Tier 2: chosen column, or default newest-first
      if (sortKey) return compare(a, b);
      const statusDiff =
        (STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99);
      if (statusDiff !== 0) return statusDiff;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [
    allApps,
    search,
    statusFilter,
    teamFilter,
    leaderFilter,
    peopleScope,
    sortKey,
    sortDir,
  ]);

  const totalPages = Math.max(1, Math.ceil(sortedApps.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * pageSize;
  const visibleApps = sortedApps.slice(pageStart, pageStart + pageSize);
  const visibleFrom = sortedApps.length === 0 ? 0 : pageStart + 1;
  const visibleTo = Math.min(pageStart + pageSize, sortedApps.length);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const allPageSelected =
    visibleApps.length > 0 && visibleApps.every((a) => selectedIds.has(a.id));

  const toggleSelectAll = () =>
    setSelectedIds((prev) => {
      if (visibleApps.length > 0 && visibleApps.every((a) => prev.has(a.id))) {
        const next = new Set(prev);
        visibleApps.forEach((a) => next.delete(a.id));
        return next;
      }
      const next = new Set(prev);
      visibleApps.forEach((a) => next.add(a.id));
      return next;
    });

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

  const leaderCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: allApps.length,
      none: 0,
    };

    leaders.forEach((leader) => {
      counts[leader.id] = 0;
    });

    allApps.forEach((app) => {
      const leader = getRecruitmentMeta(app.admin_notes || "").leader;
      if (!leader) {
        counts.none += 1;
        return;
      }
      counts[leader.id] = (counts[leader.id] || 0) + 1;
    });

    return counts;
  }, [allApps, leaders]);

  const activePositionCount = useMemo(
    () => positions.filter((position) => position.is_active).length,
    [positions],
  );
  const hasQuickFilter = teamFilter !== "all" || leaderFilter !== "all";

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

  const scopeTabs: {
    value: PeopleScope;
    label: string;
    count: number;
  }[] = [
    { value: "all", label: "Tất cả", count: allApps.length },
    {
      value: "reviewing",
      label: "Đang xét",
      count: allApps.filter(
        (app) => !CLOSED_STATUSES.includes(app.status),
      ).length,
    },
    {
      value: "employees",
      label: "Nhân viên",
      count: allApps.filter((app) => EMPLOYEE_STATUSES.includes(app.status))
        .length,
    },
  ];

  const paginationControls = (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 bg-white px-3 py-2">
      <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
        <span>
          Hiển thị {visibleFrom}-{visibleTo} / {sortedApps.length}
        </span>
        <span className="hidden text-gray-300 sm:inline">·</span>
        <label className="flex items-center gap-2">
          Số dòng
          <select
            value={pageSize}
            onChange={(event) =>
              setPageSize(Number(event.target.value) as 10 | 25 | 50)
            }
            className="h-8 rounded-lg border border-gray-200 bg-white px-2 text-xs font-black text-gray-700 outline-none focus:border-[#8b4513]"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </label>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setPage((value) => Math.max(1, value - 1))}
          disabled={safePage <= 1}
          className="h-8 rounded-lg border border-gray-200 bg-white px-3 text-xs font-black text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Trước
        </button>
        <span className="text-xs font-black text-gray-500">
          Trang {safePage} / {totalPages}
        </span>
        <button
          type="button"
          onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
          disabled={safePage >= totalPages}
          className="h-8 rounded-lg border border-gray-200 bg-white px-3 text-xs font-black text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Sau
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="rounded-2xl border border-gray-100 bg-white px-10 py-8 shadow-sm">
          <Spinner label="Đang tải danh sách..." />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4" style={{ fontFamily: "system-ui, sans-serif" }}>
      <ToastStack toasts={toasts} />

      <ConfirmModal
        action={confirmAction}
        onCancel={() => setConfirmAction(null)}
      />

      {showPositions && (
        <RecruitmentPositionsModal
          positions={positions}
          savingId={positionSavingId}
          onToggle={handleTogglePosition}
          onRefresh={fetchPositions}
          onClose={() => setShowPositions(false)}
        />
      )}

      {showActivityLogs &&
        createPortal(
          <ActivityLogModal
            logs={activityLogs}
            loading={activityLogsLoading}
            onRefresh={fetchActivityLogs}
            onClose={() => setShowActivityLogs(false)}
          />,
          document.body,
        )}

      {acceptDraft &&
        createPortal(
          <AcceptEmployeeModal
            app={acceptDraft.app}
            leaders={leaders}
            saving={statusSavingId === acceptDraft.app.id}
            leaderId={acceptDraft.leaderId}
            startLevelDate={acceptDraft.startLevelDate}
            onChange={(patch) =>
              setAcceptDraft((prev) => (prev ? { ...prev, ...patch } : prev))
            }
            onCancel={() => setAcceptDraft(null)}
            onConfirm={confirmAcceptEmployee}
          />,
          document.body,
        )}

      <section className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
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
            <div className="inline-flex h-8 items-center rounded-lg border border-gray-200 bg-gray-50 p-0.5">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                title="Dạng bảng"
                  className={`flex h-7 w-7 items-center justify-center rounded-md transition ${
                  viewMode === "table"
                    ? "bg-white text-[#4a2318] shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Rows3 size={15} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("card")}
                title="Dạng thẻ"
                  className={`flex h-7 w-7 items-center justify-center rounded-md transition ${
                  viewMode === "card"
                    ? "bg-white text-[#4a2318] shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <LayoutGrid size={15} />
              </button>
            </div>
            {stats && (
              <button
                type="button"
                onClick={() => setShowStats(true)}
                className="inline-flex h-8 items-center gap-2 rounded-lg px-3 text-xs font-bold text-white shadow-sm transition hover:opacity-90"
                style={{ background: "#4a2318" }}
              >
                <BarChart3 size={14} />
                Thống kê
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setShowActivityLogs(true);
                fetchActivityLogs();
              }}
              className="inline-flex h-8 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-xs font-bold text-gray-600 transition hover:border-[#d8c4b8] hover:bg-[#fbf6f2] hover:text-[#4a2318]"
            >
              <History size={14} />
              Nhật ký
            </button>
            <button
              type="button"
              onClick={() => setShowPositions(true)}
              className="inline-flex h-8 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-xs font-bold text-gray-600 transition hover:border-[#d8c4b8] hover:bg-[#fbf6f2] hover:text-[#4a2318]"
            >
              <BriefcaseBusiness size={14} />
              Vị trí tuyển
              <span className="rounded-full bg-gray-100 px-1.5 text-[10px] text-gray-500">
                {activePositionCount}/{positions.length || 0}
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                fetchApps();
              }}
              className="inline-flex h-8 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-xs font-bold text-gray-600 transition hover:bg-gray-50"
            >
              <RefreshCw size={14} />
              Tải lại
            </button>
            <button
              type="button"
              onClick={handleSyncSheet}
              disabled={syncing}
              className="inline-flex h-8 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-xs font-bold text-gray-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-50"
            >
              <Database size={14} />
              {syncing ? "Đang đồng bộ..." : "Sync Sheet"}
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3">
          {/* Search */}
          <div className="relative min-w-[220px] flex-1">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm tên, email, SĐT..."
              className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm text-gray-700 outline-none transition focus:border-[#a0522d] focus:bg-white focus:ring-2 focus:ring-[#f6eee9]"
            />
          </div>

          {/* Team filter */}
          <label className="relative block w-full shrink-0 sm:w-[220px]">
            <Filter
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <select
              value={teamFilter}
              onChange={(event) => setTeamFilter(event.target.value)}
              className="h-9 w-full appearance-none rounded-lg border border-gray-200 bg-white pl-9 pr-8 text-sm font-bold text-gray-600 outline-none transition focus:border-[#a0522d] focus:ring-2 focus:ring-[#f6eee9]"
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

          {/* Leader filter */}
          <label className="relative block w-full shrink-0 sm:w-[220px]">
            <Users
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <select
              value={leaderFilter}
              onChange={(event) => setLeaderFilter(event.target.value)}
              className="h-9 w-full appearance-none rounded-lg border border-gray-200 bg-white pl-9 pr-8 text-sm font-bold text-gray-600 outline-none transition focus:border-[#a0522d] focus:ring-2 focus:ring-[#f6eee9]"
            >
              <option value="all">
                {`Tất cả leader (${leaderCounts.all ?? 0})`}
              </option>
              <option value="none">
                {`Chưa gán leader (${leaderCounts.none ?? 0})`}
              </option>
              {leaders.map((leader) => (
                <option key={leader.id} value={leader.id}>
                  {`${leader.name} (${leaderCounts[leader.id] ?? 0})`}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              ▾
            </span>
          </label>

          {hasQuickFilter && (
            <button
              type="button"
              onClick={() => {
                setTeamFilter("all");
                setLeaderFilter("all");
              }}
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-black text-gray-500 transition hover:border-[#d8c4b8] hover:bg-[#fbf6f2] hover:text-[#4a2318]"
            >
              <X size={13} />
              Xóa lọc nhanh
            </button>
          )}

        </div>

        <div className="mt-2 flex gap-2 overflow-x-auto border-t border-gray-100 pt-2">
          {scopeTabs.map((scope) => {
            const active = peopleScope === scope.value;
            return (
              <button
                key={scope.value}
                type="button"
                onClick={() => {
                  setPeopleScope(scope.value);
                  if (scope.value === "employees") setStatusFilter("all");
                }}
                className={`inline-flex h-8 shrink-0 items-center gap-2 rounded-lg border px-3 text-xs font-black transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e7d9d0] ${
                  active
                    ? "border-[#4a2318] bg-[#f8f4f1] text-[#4a2318]"
                    : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                {scope.label}
                <span className="rounded-full bg-white/70 px-1.5 text-[10px]">
                  {scope.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-2 flex gap-2 overflow-x-auto">
          {statusTabs.map((status) => {
            const active = statusFilter === status.value;
            return (
              <button
                key={status.value}
                type="button"
                onClick={() => setStatusFilter(status.value)}
                className="inline-flex h-8 shrink-0 items-center gap-2 rounded-lg border px-3 text-xs font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e7d9d0]"
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

      {selectedIds.size > 0 && (
        <div className="sticky top-0 z-20 flex flex-wrap items-center gap-2 rounded-xl border border-[#e7d9d0] bg-[#fbf6f2] px-3 py-2 shadow-sm">
          <span className="text-sm font-black text-[#4a2318]">
            Đã chọn {selectedIds.size}
          </span>
          <span className="mx-1 hidden h-5 w-px bg-[#e7d9d0] sm:block" />
          <label className="relative">
            <select
              defaultValue=""
              disabled={bulkSaving}
              onChange={(e) => {
                if (e.target.value) {
                  bulkStatusChange(e.target.value as ApplicationStatus);
                  e.target.value = "";
                }
              }}
              className="h-8 cursor-pointer appearance-none rounded-xl border border-gray-200 bg-white pl-3 pr-8 text-xs font-bold text-gray-700 outline-none transition focus:border-[#a0522d] disabled:opacity-50"
            >
              <option value="" disabled>
                Đổi trạng thái…
              </option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
              ▾
            </span>
          </label>
          <button
            type="button"
            onClick={confirmBulkDelete}
            disabled={bulkSaving}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 text-xs font-bold text-red-500 transition hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2 size={13} />
            Xóa
          </button>
          <button
            type="button"
            onClick={clearSelection}
            className="ml-auto inline-flex h-8 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-bold text-gray-500 transition hover:bg-gray-50"
          >
            <X size={13} />
            Bỏ chọn
          </button>
        </div>
      )}

      {sortedApps.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {viewMode === "table" ? (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
              <table className="w-full min-w-[1180px] table-fixed border-collapse text-left">
                <colgroup>
                  <col className="w-9" />
                  <col className="w-9" />
                  <col className="w-[250px]" />
                  <col className="w-[140px]" />
                  <col className="w-[230px]" />
                  <col className="w-[230px]" />
                  <col className="w-[136px]" />
                  <col className="w-[104px]" />
                  <col className="w-[112px]" />
                </colgroup>
                <thead className="sticky top-0 z-10 border-b border-gray-200 bg-[#faf7f4]">
                  <tr className="text-[10px] font-black uppercase tracking-wide text-gray-500">
                    <th className="w-9 px-2 py-2.5">
                      <input
                        type="checkbox"
                        checked={allPageSelected}
                        onChange={toggleSelectAll}
                        className="h-3.5 w-3.5 cursor-pointer accent-[#8b4513]"
                        title="Chọn tất cả đang hiển thị"
                      />
                    </th>
                    <th className="w-8 px-1 py-2.5" />
                    <SortableTh
                      label="Ứng viên"
                      sortKey="name"
                      activeKey={sortKey}
                      dir={sortDir}
                      onSort={toggleSort}
                      className="px-3 py-2.5"
                    />
                    <SortableTh
                      label="Leader"
                      sortKey="leader"
                      activeKey={sortKey}
                      dir={sortDir}
                      onSort={toggleSort}
                      className="px-3 py-2.5"
                    />
                    <th className="px-3 py-2.5">Liên hệ</th>
                    <SortableTh
                      label="Vị trí"
                      sortKey="team"
                      activeKey={sortKey}
                      dir={sortDir}
                      onSort={toggleSort}
                      className="px-3 py-2.5"
                    />
                    <SortableTh
                      label="Trạng thái"
                      sortKey="status"
                      activeKey={sortKey}
                      dir={sortDir}
                      onSort={toggleSort}
                      className="px-3 py-2.5"
                    />
                    <SortableTh
                      label="Ngày"
                      sortKey="date"
                      activeKey={sortKey}
                      dir={sortDir}
                      onSort={toggleSort}
                      className="px-3 py-2.5"
                    />
                    <th className="px-3 py-2.5 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {visibleApps.map((app) => (
                    <CandidateRow
                      key={app.id}
                      app={app}
                      selected={selectedIds.has(app.id)}
                      onToggleSelect={() => toggleSelect(app.id)}
                      deleting={deletingId === app.id}
                      toggling={togglingId === app.id}
                      statusSaving={statusSavingId === app.id}
                      leaders={leaders}
                      leaderSaving={leaderSavingId === app.id}
                      onView={() => handleView(app)}
                      onToggleStar={() => toggleStar(app)}
                      onLeaderChange={(leaderId) =>
                        confirmLeaderChange(app, leaderId)
                      }
                      onStatusChange={(next) => handleStatusChange(app, next)}
                      onDelete={() => confirmDelete(app)}
                    />
                  ))}
                </tbody>
              </table>
              </div>
              {paginationControls}
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {visibleApps.map((app) => (
                  <CandidateCard
                    key={app.id}
                    app={app}
                    selected={selectedIds.has(app.id)}
                    onToggleSelect={() => toggleSelect(app.id)}
                    toggling={togglingId === app.id}
                    statusSaving={statusSavingId === app.id}
                    leaders={leaders}
                    leaderSaving={leaderSavingId === app.id}
                    onView={() => handleView(app)}
                    onToggleStar={() => toggleStar(app)}
                    onLeaderChange={(leaderId) =>
                      confirmLeaderChange(app, leaderId)
                    }
                    onStatusChange={(next) => handleStatusChange(app, next)}
                    onDelete={() => confirmDelete(app)}
                  />
                ))}
              </div>
              {paginationControls}
            </div>
          )}
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

export default function AdminApplicationsPage() {
  return (
    <Suspense fallback={<Spinner center label="Đang tải danh sách..." />}>
      <ApplicationsContent />
    </Suspense>
  );
}

function AcceptEmployeeModal({
  app,
  leaders,
  saving,
  leaderId,
  startLevelDate,
  onChange,
  onCancel,
  onConfirm,
}: {
  app: Application;
  leaders: RecruitmentLeader[];
  saving: boolean;
  leaderId: string;
  startLevelDate: string;
  onChange: (patch: { leaderId?: string; startLevelDate?: string }) => void;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-black text-gray-950">
              Chuyển sang Đã nhận
            </h2>
            <p className="mt-1 text-xs font-semibold leading-relaxed text-gray-500">
              Chọn leader phụ trách và ngày start level cho {app.full_name}.
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:opacity-50"
            aria-label="Đóng"
          >
            <X size={15} />
          </button>
        </div>

        <div className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-xs font-black uppercase tracking-wide text-gray-400">
              Leader phụ trách
            </span>
            <select
              value={leaderId}
              disabled={saving}
              onChange={(event) => onChange({ leaderId: event.target.value })}
              className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm font-bold text-gray-700 outline-none transition focus:border-[#8b4513] focus:ring-2 focus:ring-[#f6eee9]"
            >
              <option value="">Chọn sau</option>
              {leaders.map((leader) => (
                <option key={leader.id} value={leader.id}>
                  {leader.name} - {leader.team}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-black uppercase tracking-wide text-gray-400">
              Ngày start level
            </span>
            <input
              type="date"
              value={startLevelDate}
              disabled={saving}
              onChange={(event) =>
                onChange({ startLevelDate: event.target.value })
              }
              className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm font-bold text-gray-700 outline-none transition focus:border-[#8b4513] focus:ring-2 focus:ring-[#f6eee9]"
            />
          </label>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="h-9 rounded-xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={saving}
            className="h-9 rounded-xl bg-[#4a2318] px-4 text-sm font-black text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Đang lưu..." : "Xác nhận Đã nhận"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SortableTh({
  label,
  sortKey,
  activeKey,
  dir,
  onSort,
  className = "",
}: {
  label: string;
  sortKey: SortKey;
  activeKey: SortKey | null;
  dir: "asc" | "desc";
  onSort: (key: SortKey) => void;
  className?: string;
}) {
  const active = activeKey === sortKey;
  return (
    <th className={className}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={`inline-flex items-center gap-1 whitespace-nowrap transition hover:text-[#4a2318] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e7d9d0] ${
          active ? "text-[#4a2318]" : ""
        }`}
      >
        {label}
        {active ? (
          dir === "asc" ? (
            <ChevronUp size={13} />
          ) : (
            <ChevronDown size={13} />
          )
        ) : (
          <ChevronsUpDown size={13} className="text-gray-300" />
        )}
      </button>
    </th>
  );
}

const COMPACT_LEADER_TEAM_LABELS: Record<RecruitmentLeader["team"], string> = {
  Marketing: "MKT",
  "Dev/DevOps": "Dev",
  AI: "AI",
  Infrastructure: "Infra",
  Sales: "Sales",
  Other: "Other",
};

function getLeaderTeamShort(team: RecruitmentLeader["team"]) {
  return (
    COMPACT_LEADER_TEAM_LABELS[team] ||
    LEADER_TEAMS.find((item) => item.value === team)?.label ||
    team
  );
}

function getLeaderOptionLabel(leader: RecruitmentLeader) {
  return `${leader.name} - ${getLeaderTeamShort(leader.team)}`;
}

function LeaderQuickSelect({
  app,
  leaders,
  saving,
  className = "",
  onChange,
}: {
  app: Application;
  leaders: RecruitmentLeader[];
  saving: boolean;
  className?: string;
  onChange: (leaderId: string) => void;
}) {
  const meta = getRecruitmentMeta(app.admin_notes || "");
  const disabled = saving || app.status === "resigned";

  return (
    <label className={`relative block ${className}`} title={disabled ? "Đã nghỉ - không thể sửa leader" : "Sửa leader"}>
      <select
        value={meta.leader?.id || ""}
        disabled={disabled}
        onClick={(event) => event.stopPropagation()}
        onChange={(event) => onChange(event.target.value)}
        className={`h-7 w-full cursor-pointer appearance-none rounded-md border bg-white pl-2 pr-5 text-[10px] font-black outline-none transition focus:border-[#8b4513] focus:ring-2 focus:ring-[#f6eee9] disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 ${
          meta.leader
            ? "border-[#d8c4b8] text-[#4a2318]"
            : "border-gray-200 text-gray-500"
        }`}
      >
        <option value="">Chưa gán</option>
        {leaders.map((leader) => (
          <option key={leader.id} value={leader.id}>
            {getLeaderOptionLabel(leader)}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-[9px] text-gray-400">
        {saving ? "..." : "▾"}
      </span>
    </label>
  );
}

function CandidateRow({
  app,
  selected,
  onToggleSelect,
  deleting,
  toggling,
  statusSaving,
  leaders,
  leaderSaving,
  onView,
  onToggleStar,
  onLeaderChange,
  onStatusChange,
  onDelete,
}: {
  app: Application;
  selected: boolean;
  onToggleSelect: () => void;
  deleting: boolean;
  toggling: boolean;
  statusSaving: boolean;
  leaders: RecruitmentLeader[];
  leaderSaving: boolean;
  onView: () => void;
  onToggleStar: () => void;
  onLeaderChange: (leaderId: string) => void;
  onStatusChange: (next: ApplicationStatus) => void;
  onDelete: () => void;
}) {
  const status = getStatusInfo(app.status);
  const team = getPrimaryTeam(app);
  const starred = isStarred(app);
  const submitted = formatSubmittedAt(app.created_at);
  const positions = app.career_journey || [];
  const meta = getRecruitmentMeta(app.admin_notes || "");

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <tr
      onClick={onView}
      className={`group cursor-pointer text-[13px] transition hover:bg-[#fafafa] ${
        selected ? "bg-[#fbf6f2]" : starred ? "bg-amber-50/30" : "bg-white"
      }`}
    >
      {/* Select */}
      <td className="px-2 py-2" onClick={stop}>
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggleSelect}
          className="h-3.5 w-3.5 cursor-pointer rounded accent-[#8b4513]"
        />
      </td>

      {/* Star */}
      <td className="px-1 py-2" onClick={stop}>
        <button
          type="button"
          onClick={onToggleStar}
          disabled={toggling}
          className="flex h-7 w-7 items-center justify-center rounded-md text-gray-300 transition hover:bg-amber-50 hover:text-amber-500 disabled:opacity-50"
          title={starred ? "Bỏ đánh dấu" : "Đánh dấu nổi bật"}
        >
          <Star
            size={14}
            className={starred ? "fill-amber-400 text-amber-500" : ""}
          />
        </button>
      </td>

      {/* Candidate */}
      <td className="px-3 py-2">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[11px] font-black text-white"
            style={{ background: status.color }}
          >
            {getInitials(app.full_name)}
          </div>
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-1.5">
              <p className="truncate font-bold leading-tight text-gray-950">
                {app.full_name || "---"}
              </p>
            </div>
            <div className="flex min-w-0 items-center gap-1.5">
              <p className="truncate text-[11px] font-semibold text-gray-400">
                {positions[0] || (team !== "all" ? team : app.school || "---")}
              </p>
              {(meta.leader || meta.currentLevel !== "lv1") && (
                <span className="shrink-0 rounded bg-gray-100 px-1.5 py-px text-[9px] font-black uppercase text-gray-500">
                  {meta.currentLevel}
                </span>
              )}
            </div>
          </div>
        </div>
      </td>

      {/* Leader quick edit */}
      <td className="px-3 py-2" onClick={stop}>
        <LeaderQuickSelect
          app={app}
          leaders={leaders}
          saving={leaderSaving}
          onChange={onLeaderChange}
        />
      </td>

      {/* Contact */}
      <td className="px-3 py-2">
        <p className="truncate text-xs font-medium text-gray-600">{app.email || "---"}</p>
        <div className="mt-0.5 flex items-center gap-1.5">
          <span className="text-[11px] text-gray-400">{app.phone || "---"}</span>
          {hasZalo(app) && (
            <span className="rounded bg-blue-50 px-1.5 py-px text-[9px] font-black text-blue-600">
              Zalo
            </span>
          )}
        </div>
      </td>

      {/* Positions */}
      <td className="px-3 py-2">
        <div className="flex max-w-[250px] flex-wrap items-center gap-1">
          <PositionTags positions={positions} max={1} />
        </div>
      </td>

      {/* Status (inline select) */}
      <td className="px-3 py-2" onClick={stop}>
        <StatusSelect
          status={app.status}
          disabled={statusSaving}
          onChange={onStatusChange}
          className="w-[108px]"
        />
      </td>

      {/* Date */}
      <td className="px-3 py-2 text-xs font-semibold text-gray-400">
        {submitted.date}
      </td>

      {/* Actions */}
      <td className="px-3 py-2" onClick={stop}>
        <div className="flex items-center justify-end gap-1">
          {app.cv && (
            <a
              href={app.cv}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-gray-600 transition hover:bg-gray-100"
              title="Xem CV"
            >
              <FileText size={13} />
            </a>
          )}
          <button
            type="button"
            onClick={onView}
            className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-100 text-gray-900 transition hover:bg-gray-200"
            title="Chi tiết"
          >
            <Eye size={13} />
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="flex h-7 w-7 items-center justify-center rounded-md text-red-400 transition hover:bg-red-50 disabled:opacity-50"
            title="Xóa"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </td>
    </tr>
  );
}

function CandidateCard({
  app,
  selected,
  onToggleSelect,
  toggling,
  statusSaving,
  leaders,
  leaderSaving,
  onView,
  onToggleStar,
  onLeaderChange,
  onStatusChange,
  onDelete,
}: {
  app: Application;
  selected: boolean;
  onToggleSelect: () => void;
  toggling: boolean;
  statusSaving: boolean;
  leaders: RecruitmentLeader[];
  leaderSaving: boolean;
  onView: () => void;
  onToggleStar: () => void;
  onLeaderChange: (leaderId: string) => void;
  onStatusChange: (next: ApplicationStatus) => void;
  onDelete: () => void;
}) {
  const status = getStatusInfo(app.status);
  const team = getPrimaryTeam(app);
  const starred = isStarred(app);
  const submitted = formatSubmittedAt(app.created_at);
  const positions = app.career_journey || [];
  const meta = getRecruitmentMeta(app.admin_notes || "");

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      onClick={onView}
      className={`group cursor-pointer rounded-2xl border bg-white p-3.5 shadow-sm transition hover:shadow-md ${
        selected
          ? "border-[#a0522d] ring-1 ring-[#a0522d]"
          : starred
            ? "border-amber-200 bg-amber-50/30"
            : "border-gray-200"
      }`}
    >
      {/* Header: checkbox + avatar + name + star */}
      <div className="flex items-start gap-2.5">
        <input
          type="checkbox"
          checked={selected}
          onClick={stop}
          onChange={onToggleSelect}
          className="mt-1 h-3.5 w-3.5 shrink-0 cursor-pointer accent-[#8b4513]"
        />
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-black text-white"
          style={{ background: status.color }}
        >
          {getInitials(app.full_name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-1.5">
            <p className="truncate text-sm font-black leading-tight text-gray-950">
              {app.full_name || "---"}
            </p>
            {meta.leader && (
              <span className="max-w-[90px] shrink-0 truncate rounded-md bg-slate-100 px-1.5 py-px text-[9px] font-black text-slate-500">
                {meta.leader.name}
              </span>
            )}
          </div>
          <p className="truncate text-[11px] font-medium text-gray-400">
            {submitted.date}
          </p>
          {(meta.leader || meta.currentLevel !== "lv1") && (
            <p className="mt-1 truncate text-[10px] font-black uppercase text-gray-400">
              {meta.currentLevel}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={(e) => {
            stop(e);
            onToggleStar();
          }}
          disabled={toggling}
          className="-mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-300 transition hover:bg-amber-50 hover:text-amber-500 disabled:opacity-50"
          title={starred ? "Bỏ đánh dấu" : "Đánh dấu nổi bật"}
        >
          <Star
            size={15}
            className={starred ? "fill-amber-400 text-amber-500" : ""}
          />
        </button>
      </div>

      {/* Positions */}
      <div className="mt-2.5 flex flex-wrap items-center gap-1">
        {positions.length > 0 ? (
          <PositionTags positions={positions} max={2} />
        ) : (
          team !== "all" && (
            <span className="text-[11px] font-bold text-gray-400">{team}</span>
          )
        )}
      </div>

      {/* Contact */}
      <div className="mt-2.5 space-y-0.5 border-t border-gray-100 pt-2.5">
        <p className="truncate text-xs text-gray-600">{app.email || "---"}</p>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-gray-400">{app.phone || "---"}</span>
          {hasZalo(app) && (
            <span className="rounded bg-blue-50 px-1 text-[9px] font-black text-blue-600">
              Zalo
            </span>
          )}
        </div>
      </div>

      <div className="mt-2.5" onClick={stop}>
        <LeaderQuickSelect
          app={app}
          leaders={leaders}
          saving={leaderSaving}
          onChange={onLeaderChange}
        />
      </div>

      {/* Footer: status + actions */}
      <div className="mt-2.5 flex items-center justify-between gap-2" onClick={stop}>
        <StatusSelect
          status={app.status}
          disabled={statusSaving}
          onChange={onStatusChange}
        />
        <div className="flex items-center gap-1">
          {app.cv && (
            <a
              href={app.cv}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-600 transition hover:bg-gray-100"
              title="Xem CV"
            >
              <FileText size={13} />
            </a>
          )}
          <button
            type="button"
            onClick={onView}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-gray-900 transition hover:bg-gray-200"
            title="Chi tiết"
          >
            <Eye size={13} />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-red-400 transition hover:bg-red-50"
            title="Xóa"
          >
            <Trash2 size={13} />
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

function todayInputValue() {
  return new Date().toISOString().slice(0, 10);
}

function RecruitmentPositionsModal({
  positions,
  savingId,
  onToggle,
  onRefresh,
  onClose,
}: {
  positions: RecruitmentPosition[];
  savingId: string | null;
  onToggle: (position: RecruitmentPosition) => void;
  onRefresh: () => void;
  onClose: () => void;
}) {
  const activeCount = positions.filter((position) => position.is_active).length;

  return (
    <div className="fixed inset-x-0 bottom-0 top-12 z-[9999] flex items-start justify-center overflow-y-auto bg-black/50 px-4 pb-6 pt-5 backdrop-blur-sm sm:px-6 sm:pt-7">
      <div className="flex max-h-[calc(100dvh-5rem)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-gray-50 shadow-2xl">
        <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-white px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f6eee9] text-[#4a2318]">
              <BriefcaseBusiness size={18} />
            </span>
            <div>
              <h2 className="text-base font-black text-gray-950">
                Quản lý vị trí tuyển dụng
              </h2>
              <p className="text-xs font-semibold text-gray-400">
                {activeCount}/{positions.length} vị trí đang hiện trên form ứng tuyển
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onRefresh}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-xs font-bold text-gray-600 transition hover:bg-gray-50"
            >
              <RefreshCw size={14} />
              Tải lại
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 transition hover:bg-gray-50 hover:text-gray-700"
              title="Đóng"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="space-y-4 overflow-y-auto p-4 sm:p-5">
          {positions.length === 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-sm font-semibold text-gray-400">
              Chưa có dữ liệu vị trí tuyển dụng.
            </div>
          )}

          {TEAM_FILTERS.filter((team) => team !== "all").map((team) => {
            const teamPositions = positions.filter(
              (position) => position.team === team,
            );
            if (teamPositions.length === 0) return null;
            const style = TEAM_STYLES[team] || TEAM_STYLES.all;
            const teamActive = teamPositions.filter(
              (position) => position.is_active,
            ).length;

            return (
              <section
                key={team}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: style.dot }}
                    />
                    <h3 className="text-sm font-black text-gray-900">{team}</h3>
                  </div>
                  <span
                    className="rounded-full px-2.5 py-1 text-[11px] font-black"
                    style={{ background: style.bg, color: style.color }}
                  >
                    {teamActive}/{teamPositions.length} đang tuyển
                  </span>
                </div>

                <div className="divide-y divide-gray-100">
                  {teamPositions.map((position) => {
                    const saving = savingId === position.id;
                    return (
                      <div
                        key={position.id}
                        className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-black text-gray-900">
                            {position.label}
                          </p>
                          <p className="mt-0.5 text-xs font-semibold text-gray-400">
                            {position.is_active
                              ? "Đang hiển thị trên form ứng tuyển"
                              : "Đang ẩn khỏi form ứng tuyển"}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => onToggle(position)}
                          disabled={saving}
                          className={`inline-flex h-9 min-w-[120px] items-center justify-center rounded-lg border px-3 text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-60 ${
                            position.is_active
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : "border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100"
                          }`}
                        >
                          {saving
                            ? "Đang lưu..."
                            : position.is_active
                              ? "Đang hiện"
                              : "Đang ẩn"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const ACTIVITY_LABELS: Record<string, string> = {
  "application.update": "Cập nhật hồ sơ",
  "application.delete": "Xóa hồ sơ",
  "leader.create": "Thêm leader",
  "leader.update": "Sửa leader",
  "leader.delete": "Xóa leader",
  "position.create": "Thêm vị trí",
  "position.update": "Sửa vị trí",
  "sheet.sync": "Sync Sheet",
};

function asLogRecord(value: unknown) {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function getLogName(value: unknown) {
  const record = asLogRecord(value);
  return typeof record?.name === "string" && record.name.trim()
    ? record.name
    : "Chưa gán";
}

function describeActivity(log: RecruitmentActivityLog) {
  const details = log.details || {};
  const changes = asLogRecord(details.changes);
  const parts: string[] = [];

  const statusChange = asLogRecord(changes?.status);
  if (
    typeof statusChange?.from === "string" &&
    typeof statusChange?.to === "string"
  ) {
    parts.push(
      `Trạng thái: ${getStatusInfo(statusChange.from as ApplicationStatus).label} -> ${
        getStatusInfo(statusChange.to as ApplicationStatus).label
      }`,
    );
  }

  const leaderChange = asLogRecord(changes?.leader);
  if (leaderChange) {
    parts.push(
      `Leader: ${getLogName(leaderChange.from)} -> ${getLogName(
        leaderChange.to,
      )}`,
    );
  }

  if (changes?.admin_notes) {
    parts.push("Cập nhật ghi chú");
  }

  if (typeof details.count === "number") {
    parts.push(`${details.count} hồ sơ`);
  }

  const from = asLogRecord(details.from);
  const to = asLogRecord(details.to);
  if (from || to) {
    const fromText = from
      ? Object.entries(from)
          .map(([key, value]) => `${key}: ${String(value)}`)
          .join(", ")
      : "";
    const toText = to
      ? Object.entries(to)
          .map(([key, value]) => `${key}: ${String(value)}`)
          .join(", ")
      : "";
    parts.push([fromText, toText].filter(Boolean).join(" -> "));
  }

  if (typeof details.team === "string") {
    parts.push(`Team: ${details.team}`);
  }

  return parts.filter(Boolean).join(" | ") || "Không có chi tiết";
}

function formatActivityTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function ActivityLogModal({
  logs,
  loading,
  onRefresh,
  onClose,
}: {
  logs: RecruitmentActivityLog[];
  loading: boolean;
  onRefresh: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        className="flex max-h-[calc(100dvh-3rem)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f6eee9] text-[#4a2318]">
              <History size={18} />
            </span>
            <div className="min-w-0">
              <h2 className="text-base font-black text-gray-950">Nhật ký</h2>
              <p className="truncate text-xs font-semibold text-gray-400">
                Ai thao tác gì, trên mục nào và lúc nào
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onRefresh}
              disabled={loading}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-xs font-bold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Tải lại
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition hover:bg-gray-50 hover:text-gray-700"
              title="Đóng"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto p-4">
          {loading && logs.length === 0 ? (
            <div className="flex min-h-[220px] items-center justify-center">
              <Spinner label="Đang tải nhật ký..." />
            </div>
          ) : logs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-sm font-semibold text-gray-400">
              Chưa có log nào.
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <table className="w-full min-w-[860px] table-fixed text-left">
                <colgroup>
                  <col className="w-[150px]" />
                  <col className="w-[190px]" />
                  <col className="w-[170px]" />
                  <col />
                  <col className="w-[150px]" />
                </colgroup>
                <thead className="bg-[#faf7f4] text-[10px] font-black uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-3 py-2.5">Hành động</th>
                    <th className="px-3 py-2.5">Người làm</th>
                    <th className="px-3 py-2.5">Đối tượng</th>
                    <th className="px-3 py-2.5">Chi tiết</th>
                    <th className="px-3 py-2.5">Thời gian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {logs.map((log) => (
                    <tr key={log.id} className="bg-white">
                      <td className="px-3 py-3 font-black text-[#4a2318]">
                        {ACTIVITY_LABELS[log.action] || log.action}
                      </td>
                      <td className="px-3 py-3">
                        <p className="truncate font-bold text-gray-700">
                          {log.actor_email || "Unknown"}
                        </p>
                      </td>
                      <td className="px-3 py-3">
                        <p className="truncate font-semibold text-gray-600">
                          {log.entity_label || log.entity_id || "---"}
                        </p>
                        <p className="mt-0.5 text-[10px] font-bold uppercase text-gray-300">
                          {log.entity_type}
                        </p>
                      </td>
                      <td className="px-3 py-3 font-medium leading-relaxed text-gray-500">
                        {describeActivity(log)}
                      </td>
                      <td className="px-3 py-3 font-bold text-gray-400">
                        {formatActivityTime(log.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
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
