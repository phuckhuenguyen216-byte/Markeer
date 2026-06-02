"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Edit3,
  FileText,
  GraduationCap,
  Mail,
  Phone,
  Plus,
  Save,
  Star,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import {
  Application,
  STATUS_OPTIONS,
  getStatusInfo,
  ApplicationStatus,
} from "@/lib/application";
import {
  getInitials,
  getPrimaryTeam,
  hasZalo,
  isStarred,
  toggleStarredNotes,
  stripStarredTag,
  daysAgo,
  formatDate,
  getRecruitmentMeta,
  upsertRecruitmentMeta,
  createEmptyManagement,
  LEADER_TEAMS,
  LEVEL_OPTIONS,
  type EmployeeLevel,
  type LeaderTeam,
  type RecruitmentLeader,
  type RecruitmentManagement,
} from "@/lib/recruitment";
import { StatusBadge } from "../../components/StatusControl";
import PositionTags from "../../components/PositionTags";
import Spinner from "../../components/Spinner";
import { ToastStack, useToasts } from "../../components/Toast";
import ConfirmModal, { type ConfirmAction } from "../../components/ConfirmModal";

const EMPLOYEE_STATUSES: ApplicationStatus[] = ["accepted", "resigned"];

function todayInputValue() {
  return new Date().toISOString().slice(0, 10);
}

export default function AdminApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [starSaving, setStarSaving] = useState(false);
  const { toasts, addToast } = useToasts();
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [navIds, setNavIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"management" | "application">(
    "management",
  );
  const [management, setManagement] = useState<RecruitmentManagement>(
    createEmptyManagement,
  );
  const [managementSaving, setManagementSaving] = useState(false);
  const [activeLevel, setActiveLevel] = useState<EmployeeLevel>("lv1");
  const [leaders, setLeaders] = useState<RecruitmentLeader[]>([]);
  const [leadersLoading, setLeadersLoading] = useState(true);
  const [leaderSaving, setLeaderSaving] = useState(false);
  const [showLeaderModal, setShowLeaderModal] = useState(false);
  const [editingLeaderId, setEditingLeaderId] = useState<string | null>(null);
  const [leaderDraft, setLeaderDraft] = useState<{
    name: string;
    team: LeaderTeam;
  }>({ name: "", team: "Marketing" });
  const [showStatusActions, setShowStatusActions] = useState(false);
  const [acceptDraft, setAcceptDraft] = useState<{
    leaderId: string;
    startLevelDate: string;
  } | null>(null);
  const [promoteDraft, setPromoteDraft] = useState<{
    nextLevel: EmployeeLevel;
    startDate: string;
  } | null>(null);

  const fetchLeaders = useCallback(async () => {
    setLeadersLoading(true);
    try {
      const res = await fetch("/api/recruitment/leaders");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không tải được leader");
      setLeaders(Array.isArray(data.leaders) ? data.leaders : []);
    } catch {
      addToast("Lỗi tải danh sách leader", "error");
    } finally {
      setLeadersLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchLeaders();
  }, [fetchLeaders]);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("recruitment:nav");
      if (raw) setNavIds(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    fetch(`/api/applications/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        const meta = getRecruitmentMeta(data.admin_notes || "");
        setApp(data);
        setNotes(stripStarredTag(data.admin_notes || ""));
        setManagement(meta);
        setActiveLevel(meta.currentLevel);
        setActiveTab(
          EMPLOYEE_STATUSES.includes(data.status) ? "management" : "application",
        );
      })
      .catch(() => addToast("Không tìm thấy hồ sơ", "error"))
      .finally(() => setLoading(false));
  }, [id, addToast]);

  const navIndex = navIds.indexOf(id);
  const prevId = navIndex > 0 ? navIds[navIndex - 1] : null;
  const nextId =
    navIndex >= 0 && navIndex < navIds.length - 1 ? navIds[navIndex + 1] : null;

  const goTo = useCallback(
    (targetId: string | null) => {
      if (targetId) router.push(`/admin/applications/${targetId}`);
    },
    [router],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "ArrowLeft") goTo(prevId);
      if (e.key === "ArrowRight") goTo(nextId);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, prevId, nextId]);

  const updateStatus = async (
    status: ApplicationStatus,
    nextManagement?: RecruitmentManagement,
  ) => {
    setConfirmAction(null);
    if (!app) return;
    const body =
      nextManagement && status === "accepted"
        ? {
            status,
            admin_notes: upsertRecruitmentMeta(
              toggleStarredNotes(notes, isStarred(app)),
              nextManagement,
            ),
          }
        : { status };
    try {
      const res = await fetch(`/api/applications/${app.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error();
      const meta = getRecruitmentMeta(data.admin_notes || "");
      setApp(data);
      setManagement(meta);
      setActiveLevel(meta.currentLevel);
      setActiveTab(
        EMPLOYEE_STATUSES.includes(data.status) ? "management" : "application",
      );
      addToast(`Trạng thái → ${getStatusInfo(status).label}`);
    } catch {
      addToast("Lỗi cập nhật trạng thái", "error");
    }
  };

  const confirmStatusChange = (status: ApplicationStatus) => {
    if (!app || status === app.status) return;
    if (status === "accepted") {
      setShowStatusActions(false);
      setAcceptDraft({
        leaderId: management.leader?.id || "",
        startLevelDate: management.startLevelDate || todayInputValue(),
      });
      return;
    }
    const info = getStatusInfo(status);
    setShowStatusActions(false);
    setConfirmAction({
      title: `Đổi trạng thái sang "${info.label}"?`,
      desc: `Trạng thái hiện tại là "${getStatusInfo(app.status).label}". Hành động này chỉ nên dùng khi hồ sơ thật sự chuyển bước.`,
      detail: `${app.full_name} - ${app.email}`,
      danger: status === "rejected" || status === "resigned",
      onConfirm: () => updateStatus(status),
    });
  };

  const confirmAcceptEmployee = () => {
    if (!acceptDraft) return;
    const leader =
      leaders.find((item) => item.id === acceptDraft.leaderId) || null;
    const finalDate = acceptDraft.startLevelDate || todayInputValue();
    const nextManagement: RecruitmentManagement = {
      ...management,
      leader,
      currentLevel: "lv1",
      startLevelDate: finalDate,
      levels: {
        ...management.levels,
        lv1: {
          ...management.levels.lv1,
          startedAt: finalDate,
        },
      },
    };
    setAcceptDraft(null);
    void updateStatus("accepted", nextManagement);
  };

  const toggleStar = async () => {
    if (!app) return;
    setStarSaving(true);
    const starred = isStarred(app);
    const finalNotes = toggleStarredNotes(app.admin_notes || "", !starred);
    try {
      const res = await fetch(`/api/applications/${app.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_notes: finalNotes }),
      });
      if (!res.ok) throw new Error();
      setApp((p) => (p ? { ...p, admin_notes: finalNotes } : p));
      addToast(starred ? "Đã bỏ đánh dấu" : "Đã đánh dấu nổi bật");
    } catch {
      addToast("Lỗi cập nhật đánh dấu", "error");
    } finally {
      setStarSaving(false);
    }
  };

  const saveNotes = async () => {
    if (!app) return;
    setSaving(true);
    try {
      const visibleNotes = toggleStarredNotes(notes, isStarred(app));
      const finalNotes = upsertRecruitmentMeta(visibleNotes, management);
      const res = await fetch(`/api/applications/${app.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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

  const updateLevelRecord = (
    level: EmployeeLevel,
    field: "target" | "comment",
    value: string,
  ) => {
    setManagement((prev) => ({
      ...prev,
      levels: {
        ...prev.levels,
        [level]: {
          ...prev.levels[level],
          [field]: value,
          updatedAt: new Date().toISOString(),
        },
      },
    }));
  };

  const saveManagement = async () => {
    if (!app) return;
    await saveManagementState(management);
  };

  const saveStartLevelDate = async (value: string) => {
    const nextManagement = {
      ...management,
      startLevelDate: value,
      levels: {
        ...management.levels,
        lv1: {
          ...management.levels.lv1,
          startedAt: value,
        },
      },
    };
    setManagement(nextManagement);
    await saveManagementState(nextManagement);
  };

  const saveLevelStartDate = async (level: EmployeeLevel, value: string) => {
    const nextManagement = {
      ...management,
      startLevelDate: level === "lv1" ? value : management.startLevelDate,
      levels: {
        ...management.levels,
        [level]: {
          ...management.levels[level],
          startedAt: value,
        },
      },
    };
    setManagement(nextManagement);
    await saveManagementState(nextManagement);
  };

  const saveManagementState = async (nextManagement: RecruitmentManagement) => {
    if (!app) return;
    setManagementSaving(true);
    const visibleNotes = toggleStarredNotes(notes, isStarred(app));
    const finalNotes = upsertRecruitmentMeta(visibleNotes, nextManagement);
    try {
      const res = await fetch(`/api/applications/${app.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_notes: finalNotes }),
      });
      if (!res.ok) throw new Error();
      setManagement(nextManagement);
      setApp((p) => (p ? { ...p, admin_notes: finalNotes } : p));
      addToast("Đã lưu thông tin quản lý");
    } catch {
      addToast("Lỗi lưu thông tin quản lý", "error");
    } finally {
      setManagementSaving(false);
    }
  };

  const confirmPromoteLevel = (nextLevel: EmployeeLevel) => {
    setPromoteDraft({
      nextLevel,
      startDate: management.levels[nextLevel].startedAt || todayInputValue(),
    });
  };

  const savePromoteLevel = () => {
    if (!promoteDraft) return;
    const nextManagement = {
      ...management,
      currentLevel: promoteDraft.nextLevel,
      levels: {
        ...management.levels,
        [promoteDraft.nextLevel]: {
          ...management.levels[promoteDraft.nextLevel],
          startedAt: promoteDraft.startDate || todayInputValue(),
        },
      },
    };
    setActiveLevel(promoteDraft.nextLevel);
    setPromoteDraft(null);
    void saveManagementState(nextManagement);
  };

  const resetLeaderForm = () => {
    setEditingLeaderId(null);
    setLeaderDraft({ name: "", team: "Marketing" });
  };

  const saveLeader = async () => {
    const name = leaderDraft.name.trim();
    if (!name || leaderSaving) return;

    setLeaderSaving(true);
    try {
      if (editingLeaderId) {
        const res = await fetch(`/api/recruitment/leaders/${editingLeaderId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, team: leaderDraft.team }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Lỗi sửa leader");
        const updated = data.leader as RecruitmentLeader;

        setLeaders((prev) =>
          prev.map((leader) =>
            leader.id === editingLeaderId ? updated : leader,
          ),
        );
        if (management.leader?.id === editingLeaderId) {
          const nextManagement = { ...management, leader: updated };
          await saveManagementState(nextManagement);
        }
        addToast("Đã lưu leader");
      } else {
        const res = await fetch("/api/recruitment/leaders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, team: leaderDraft.team }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Lỗi thêm leader");
        setLeaders((prev) => [...prev, data.leader as RecruitmentLeader]);
        addToast("Đã thêm leader");
      }

      resetLeaderForm();
    } catch {
      addToast("Lỗi lưu leader", "error");
    } finally {
      setLeaderSaving(false);
    }
  };

  const editLeader = (leader: RecruitmentLeader) => {
    setEditingLeaderId(leader.id);
    setLeaderDraft({ name: leader.name, team: leader.team });
  };

  const deleteLeader = async (leaderId: string) => {
    if (leaderSaving) return;
    setLeaderSaving(true);
    try {
      const res = await fetch(`/api/recruitment/leaders/${leaderId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi xóa leader");

      setLeaders((prev) => prev.filter((leader) => leader.id !== leaderId));
      if (management.leader?.id === leaderId) {
        const nextManagement = { ...management, leader: null };
        await saveManagementState(nextManagement);
      }
      if (editingLeaderId === leaderId) resetLeaderForm();
      addToast("Đã xóa leader");
    } catch {
      addToast("Lỗi xóa leader", "error");
    } finally {
      setLeaderSaving(false);
    }
  };

  /* loading / not found */
  if (loading) {
    return <Spinner center />;
  }
  if (!app) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <p className="mb-4 text-base font-medium">Không tìm thấy hồ sơ</p>
        <button
          onClick={() => router.push("/admin/applications")}
          className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const st = getStatusInfo(app.status);
  const dateStr = formatDate(app.created_at);
  const timeStr = new Date(app.created_at).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const teams = app.career_journey || [];
  const team = getPrimaryTeam(app);
  const zalo = hasZalo(app);
  const starred = isStarred(app);
  const isEmployee = EMPLOYEE_STATUSES.includes(app.status);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      <ToastStack toasts={toasts} />
      <ConfirmModal
        action={confirmAction}
        onCancel={() => setConfirmAction(null)}
      />
      {showLeaderModal && (
        <LeaderModal
          leaders={leaders}
          loading={leadersLoading}
          saving={leaderSaving}
          draft={leaderDraft}
          editingId={editingLeaderId}
          onDraftChange={setLeaderDraft}
          onSave={saveLeader}
          onEdit={editLeader}
          onDelete={deleteLeader}
          onReset={resetLeaderForm}
          onClose={() => setShowLeaderModal(false)}
        />
      )}
      {acceptDraft && (
        <AcceptEmployeeModal
          leaders={leaders}
          saving={managementSaving}
          leaderId={acceptDraft.leaderId}
          startLevelDate={acceptDraft.startLevelDate}
          onChange={(patch) =>
            setAcceptDraft((prev) => (prev ? { ...prev, ...patch } : prev))
          }
          onCancel={() => setAcceptDraft(null)}
          onConfirm={confirmAcceptEmployee}
        />
      )}
      {promoteDraft && (
        <PromoteLevelModal
          currentLevel={management.currentLevel}
          nextLevel={promoteDraft.nextLevel}
          startDate={promoteDraft.startDate}
          saving={managementSaving}
          onChange={(startDate) =>
            setPromoteDraft((prev) => (prev ? { ...prev, startDate } : prev))
          }
          onCancel={() => setPromoteDraft(null)}
          onConfirm={savePromoteLevel}
        />
      )}

      {/* ─── HEADER SCORECARD ─── */}
      <div className="mb-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        {/* top row: back + prev/next + star + status buttons */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Link
              href="/admin/applications"
              className="flex items-center gap-1.5 text-sm font-semibold text-gray-400 transition hover:text-gray-600"
            >
              <ArrowLeft size={15} />
              Danh sách
            </Link>
            {navIndex >= 0 && navIds.length > 1 && (
              <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 p-0.5">
                <button
                  type="button"
                  onClick={() => goTo(prevId)}
                  disabled={!prevId}
                  className="flex h-6 w-6 items-center justify-center rounded-md text-gray-500 transition hover:bg-white hover:text-[#4a2318] disabled:opacity-30"
                  title="Hồ sơ trước (←)"
                >
                  <ChevronLeft size={15} />
                </button>
                <span className="px-1 text-[11px] font-bold text-gray-500">
                  {navIndex + 1}/{navIds.length}
                </span>
                <button
                  type="button"
                  onClick={() => goTo(nextId)}
                  disabled={!nextId}
                  className="flex h-6 w-6 items-center justify-center rounded-md text-gray-500 transition hover:bg-white hover:text-[#4a2318] disabled:opacity-30"
                  title="Hồ sơ sau (→)"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={toggleStar}
              disabled={starSaving}
              className={`flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-bold transition disabled:opacity-50 ${
                starred
                  ? "border-amber-300 bg-amber-50 text-amber-600"
                  : "border-gray-200 bg-white text-gray-400 hover:bg-gray-50"
              }`}
              title={starred ? "Bỏ đánh dấu" : "Đánh dấu nổi bật"}
            >
              <Star
                size={14}
                className={starred ? "fill-amber-400 text-amber-500" : ""}
              />
              {starred ? "Nổi bật" : "Đánh dấu"}
            </button>
            <span className="mx-1 hidden h-5 w-px bg-gray-200 sm:block" />
            <div className="flex flex-col items-end gap-1">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowStatusActions((value) => !value)}
                  className="flex h-8 items-center gap-2 rounded-lg border px-2.5 text-xs font-bold transition hover:bg-gray-50"
                  style={{
                    borderColor: st.color,
                    color: st.color,
                    background: st.bg,
                  }}
                >
                  <span className="hidden text-gray-500 sm:inline">
                    Trạng thái:
                  </span>
                  {st.label}
                  <Edit3 size={13} />
                </button>

                {showStatusActions && (
                  <div className="absolute right-0 top-10 z-30 w-64 rounded-xl border border-gray-200 bg-white p-3 shadow-xl">
                  <div className="mb-2">
                    <p className="text-xs font-black text-gray-900">
                      Đổi trạng thái hồ sơ
                    </p>
                    <p className="mt-0.5 text-[11px] font-medium leading-relaxed text-gray-400">
                      Chỉ đổi khi hồ sơ thật sự chuyển bước. Mỗi lần đổi sẽ cần xác nhận.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    {STATUS_OPTIONS.map((s) => {
                      const active = app.status === s.value;
                      return (
                        <button
                          key={s.value}
                          type="button"
                          disabled={active}
                          onClick={() => confirmStatusChange(s.value)}
                          className={`flex h-9 w-full items-center justify-between rounded-lg border px-3 text-left text-xs font-bold transition disabled:cursor-default ${
                            active
                              ? "border-gray-200 bg-gray-50 text-gray-400"
                              : "border-gray-100 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <span>{s.label}</span>
                          {active ? (
                            <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-black text-gray-400">
                              hiện tại
                            </span>
                          ) : (
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{ background: s.color }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowStatusActions(false)}
                    className="mt-2 h-8 w-full rounded-lg border border-gray-200 text-xs font-bold text-gray-500 transition hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  </div>
                )}
              </div>
              {isEmployee && (
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400">
                  Start level
                  <input
                    type="date"
                    value={management.startLevelDate}
                    onChange={(event) =>
                      void saveStartLevelDate(event.target.value)
                    }
                    className="h-7 rounded-lg border border-gray-200 bg-white px-2 text-[11px] font-bold text-gray-600 outline-none transition focus:border-[#8b4513] focus:ring-2 focus:ring-[#f6eee9]"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* hero content */}
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-lg font-black text-white"
            style={{ background: st.color }}
          >
            {getInitials(app.full_name)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-gray-900">
                {app.full_name}
              </h1>
              <StatusBadge status={app.status} />
              {starred && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-black text-amber-600">
                  <Star size={11} className="fill-amber-400 text-amber-500" />
                  Nổi bật
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <PositionTags positions={teams} showAbbr size="md" />
            </div>
          </div>
        </div>
      </div>

      {/* ─── HIGHLIGHTS BAND ─── */}
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-5">
        <HighlightCard icon={<Briefcase size={15} />} label="Vị trí">
          <span className="truncate text-sm font-black text-gray-900">
            {teams[0] || "---"}
          </span>
          {teams.length > 1 && (
            <span className="text-[11px] font-bold text-gray-400">
              +{teams.length - 1} vị trí khác
            </span>
          )}
          {team !== "all" && (
            <span className="text-[11px] font-bold text-gray-400">
              Team {team}
            </span>
          )}
        </HighlightCard>

        <HighlightCard icon={<FileText size={15} />} label="CV / Portfolio">
          {app.cv ? (
            <a
              href={app.cv}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-black text-white transition hover:opacity-90"
              style={{ background: "#4a2318" }}
            >
              <FileText size={12} />
              Xem CV
            </a>
          ) : (
            <span className="text-sm font-bold text-gray-300">Chưa nộp</span>
          )}
        </HighlightCard>

        <HighlightCard icon={<Mail size={15} />} label="Liên hệ">
          <a
            href={`mailto:${app.email}`}
            className="truncate text-xs font-bold text-gray-700 hover:text-blue-600"
            title={app.email}
          >
            {app.email}
          </a>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(app.phone);
              addToast(`Đã copy: ${app.phone}`);
            }}
            className="flex w-fit items-center gap-1 text-xs font-bold text-gray-500 hover:text-green-600"
            title="Nhấn để copy"
          >
            <Phone size={11} />
            {app.phone}
            {zalo && (
              <span className="rounded bg-blue-500 px-1 py-0.5 text-[9px] font-black text-white">
                Zalo
              </span>
            )}
          </button>
        </HighlightCard>

        <HighlightCard icon={<Calendar size={15} />} label="Ngày nộp">
          <span className="text-sm font-black text-gray-900">
            {daysAgo(app.created_at)}
          </span>
          <span className="text-[11px] font-bold text-gray-400">
            {dateStr} {timeStr}
          </span>
        </HighlightCard>

        <HighlightCard icon={<GraduationCap size={15} />} label="Trường">
          <span
            className="truncate text-sm font-black text-gray-900"
            title={app.school}
          >
            {app.school || "---"}
          </span>
          {app.dob && (
            <span className="text-[11px] font-bold text-gray-400">
              Sinh {formatDate(app.dob)}
            </span>
          )}
        </HighlightCard>
      </div>

      {isEmployee && (
        <div className="mb-4 inline-flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab("management")}
            className={`h-9 rounded-lg px-4 text-sm font-black transition ${
              activeTab === "management"
                ? "bg-[#4a2318] text-white"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            Quản lý nhân viên
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("application")}
            className={`h-9 rounded-lg px-4 text-sm font-black transition ${
              activeTab === "application"
                ? "bg-[#4a2318] text-white"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            Hồ sơ ứng tuyển
          </button>
        </div>
      )}

      {isEmployee && activeTab === "management" ? (
        <ManagementPanel
          management={management}
          leaders={leaders}
          leadersLoading={leadersLoading}
          activeLevel={activeLevel}
          saving={managementSaving}
          onChange={setManagement}
          onLevelChange={setActiveLevel}
          onUpdateLevel={updateLevelRecord}
          onPromoteLevel={confirmPromoteLevel}
          onStartLevelDateChange={saveStartLevelDate}
          onLevelStartDateChange={saveLevelStartDate}
          onOpenLeaders={() => setShowLeaderModal(true)}
          onSave={saveManagement}
        />
      ) : (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* LEFT — 2 cols */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          {/* SECTION 1: Career Fit */}
          <Section title="Định hướng & Động lực">
            <div className="mb-5">
              <SLabel>Vị trí ứng tuyển</SLabel>
              <div className="mt-1.5 flex flex-wrap gap-2">
                <PositionTags positions={teams} showAbbr size="md" />
              </div>
            </div>

            {(app.interest_reason || []).length > 0 && (
              <div className="mb-5">
                <SLabel>Điều hứng thú</SLabel>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {(app.interest_reason || []).map((r) => (
                    <span
                      key={r}
                      className="rounded-lg px-2.5 py-1 text-xs font-semibold"
                      style={{ background: "#eff6ff", color: "#1d4ed8" }}
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            )}

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
            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <SLabel color="#16a34a">Điểm mạnh</SLabel>
                <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                  {app.strengths || "---"}
                </p>
              </div>
              <div>
                <SLabel color="#f59e0b">Cần cải thiện</SLabel>
                <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                  {app.weaknesses || "---"}
                </p>
              </div>
            </div>

            <ContentBlock label="Kỳ vọng 3 tháng đầu" value={app.expectation} />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <SLabel>Cách xử lý vấn đề</SLabel>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {(app.problem_solving || []).map((p) => (
                    <span
                      key={p}
                      className="rounded-lg px-2.5 py-1 text-xs font-semibold"
                      style={{ background: "#f0fdf4", color: "#15803d" }}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <SLabel>Phản ứng khi góp ý</SLabel>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {(app.feedback_response || []).map((f) => (
                    <span
                      key={f}
                      className="rounded-lg px-2.5 py-1 text-xs font-semibold"
                      style={{ background: "#fef3c7", color: "#92400e" }}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* SECTION 4: Work Preference + Education */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Object.keys(app.work_preference || {}).length > 0 && (
              <Section title="Hình thức làm việc" compact>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-left uppercase tracking-wider text-gray-400">
                      <th className="pb-2 font-semibold">Hình thức</th>
                      <th className="pb-2 font-semibold">Chi tiết</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {Object.entries(app.work_preference || {}).map(
                      ([key, vals]) => (
                        <tr key={key}>
                          <td className="whitespace-nowrap py-2 pr-4 font-semibold text-gray-700">
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

          {app.note && (
            <Section title="Lời nhắn gửi team">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-600">
                {app.note}
              </p>
            </Section>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="flex flex-col gap-4 lg:sticky lg:top-6 lg:self-start">
          {/* HR Notes */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-bold text-gray-800">Ghi chú HR</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              placeholder="Ghi chú nội bộ về ứng viên..."
              className="w-full resize-y rounded-xl border border-gray-200 px-3 py-2.5 text-sm leading-relaxed focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-50"
            />
            <button
              onClick={saveNotes}
              disabled={saving}
              className="mt-3 w-full rounded-xl py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50"
              style={{ background: "#4a2318" }}
            >
              {saving ? "Đang lưu..." : "Lưu ghi chú"}
            </button>
          </div>

          {/* Quick info recap */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-bold text-gray-800">
              Thông tin nhanh
            </h3>
            <div className="space-y-3 text-sm">
              <InfoRow label="Email" value={app.email} />
              <div>
                <span className="mb-0.5 block text-xs font-semibold text-gray-400">
                  Số điện thoại
                </span>
                <span className="font-semibold text-gray-800">
                  {app.phone}
                  {zalo && (
                    <span className="ml-2 rounded bg-blue-500 px-1.5 py-0.5 align-middle text-[10px] font-black text-white">
                      Zalo
                    </span>
                  )}
                </span>
              </div>
              <InfoRow label="Trường" value={app.school} />
              <InfoRow label="Ngày nộp" value={`${dateStr} ${timeStr}`} />
              {app.cv && (
                <div>
                  <span className="mb-0.5 block text-xs font-semibold text-gray-400">
                    CV / Portfolio
                  </span>
                  <a
                    href={app.cv}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-sm font-semibold text-blue-500 hover:underline"
                  >
                    Xem CV
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}

/* ── Sub-components ── */

function AcceptEmployeeModal({
  leaders,
  saving,
  leaderId,
  startLevelDate,
  onChange,
  onCancel,
  onConfirm,
}: {
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
              Chọn leader phụ trách và ngày start level. Có thể chọn sau nếu
              chưa phân công ngay.
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
            <SLabel>Leader phụ trách</SLabel>
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
            <SLabel>Ngày start level</SLabel>
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

function PromoteLevelModal({
  currentLevel,
  nextLevel,
  startDate,
  saving,
  onChange,
  onCancel,
  onConfirm,
}: {
  currentLevel: EmployeeLevel;
  nextLevel: EmployeeLevel;
  startDate: string;
  saving: boolean;
  onChange: (startDate: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const current = LEVEL_OPTIONS.find((level) => level.value === currentLevel);
  const next = LEVEL_OPTIONS.find((level) => level.value === nextLevel);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-black text-gray-950">
              Nâng level lên {next?.label}
            </h2>
            <p className="mt-1 text-xs font-semibold leading-relaxed text-gray-500">
              Level hiện tại là {current?.label}. Chọn ngày bắt đầu level mới
              trước khi lưu.
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

        <label className="block">
          <SLabel>Ngày lên {next?.label}</SLabel>
          <input
            type="date"
            value={startDate}
            disabled={saving}
            onChange={(event) => onChange(event.target.value)}
            className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm font-bold text-gray-700 outline-none transition focus:border-[#8b4513] focus:ring-2 focus:ring-[#f6eee9]"
          />
        </label>

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
            {saving ? "Đang lưu..." : "Lưu nâng level"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ManagementPanel({
  management,
  leaders,
  leadersLoading,
  activeLevel,
  saving,
  onChange,
  onLevelChange,
  onUpdateLevel,
  onPromoteLevel,
  onStartLevelDateChange,
  onLevelStartDateChange,
  onOpenLeaders,
  onSave,
}: {
  management: RecruitmentManagement;
  leaders: RecruitmentLeader[];
  leadersLoading: boolean;
  activeLevel: EmployeeLevel;
  saving: boolean;
  onChange: React.Dispatch<React.SetStateAction<RecruitmentManagement>>;
  onLevelChange: (level: EmployeeLevel) => void;
  onUpdateLevel: (
    level: EmployeeLevel,
    field: "target" | "comment",
    value: string,
  ) => void;
  onPromoteLevel: (level: EmployeeLevel) => void;
  onStartLevelDateChange: (value: string) => void | Promise<void>;
  onLevelStartDateChange: (
    level: EmployeeLevel,
    value: string,
  ) => void | Promise<void>;
  onOpenLeaders: () => void;
  onSave: () => void;
}) {
  const currentLeader = management.leader;
  const currentIndex = LEVEL_OPTIONS.findIndex(
    (level) => level.value === management.currentLevel,
  );
  const nextLevel = LEVEL_OPTIONS[currentIndex + 1]?.value;

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[340px_minmax(0,1fr)]">
      <div className="space-y-4">
        <Section title="Phân công quản lý" compact>
          <div className="space-y-4">
            <div>
              <SLabel>Leader phụ trách</SLabel>
              <div className="mt-1 flex gap-2">
                <select
                  value={currentLeader?.id || ""}
                  disabled={leadersLoading}
                  onChange={(event) => {
                    const leader =
                      leaders.find((item) => item.id === event.target.value) ||
                      null;
                    onChange((prev) => ({ ...prev, leader }));
                  }}
                  className="h-10 min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-700 outline-none transition focus:border-[#8b4513] focus:ring-2 focus:ring-[#f6eee9]"
                >
                  <option value="">
                    {leadersLoading ? "Đang tải leader..." : "Chưa chọn leader"}
                  </option>
                  {leaders.map((leader) => (
                    <option key={leader.id} value={leader.id}>
                      {leader.name} - {leader.team}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={onOpenLeaders}
                  className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 text-xs font-bold text-gray-600 transition hover:bg-gray-50"
                >
                  <Edit3 size={13} />
                  Leader
                </button>
              </div>
              {currentLeader && (
                <div className="mt-2 inline-flex max-w-full items-center gap-2 rounded-lg bg-gray-50 px-2.5 py-1.5">
                  <span className="truncate text-xs font-bold text-gray-800">
                    {currentLeader.name}
                  </span>
                  <LeaderTeamTag team={currentLeader.team} />
                </div>
              )}
            </div>

            <div>
              <SLabel>Level hiện tại</SLabel>
              <div className="mt-1 rounded-xl border border-gray-200 bg-gray-50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-black text-gray-900">
                      {
                        LEVEL_OPTIONS.find(
                          (level) => level.value === management.currentLevel,
                        )?.label
                      }
                    </p>
                    <p className="mt-0.5 text-xs font-medium leading-relaxed text-gray-500">
                      Chọn LV bên dưới chỉ để xem lại target và nhận xét.
                    </p>
                  </div>
                  {nextLevel ? (
                    <button
                      type="button"
                      onClick={() => onPromoteLevel(nextLevel)}
                      className="h-8 shrink-0 rounded-lg border border-[#8b4513] bg-white px-3 text-xs font-bold text-[#4a2318] transition hover:bg-[#fbf6f2]"
                    >
                      Nâng lên{" "}
                      {LEVEL_OPTIONS.find((level) => level.value === nextLevel)
                        ?.label || ""}
                    </button>
                  ) : (
                    <span className="shrink-0 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-600">
                      Đã ở level cao nhất
                    </span>
                  )}
                </div>
              </div>
            </div>

            <label className="block">
              <SLabel>Ngày start level</SLabel>
              <input
                type="date"
                value={management.startLevelDate}
                onChange={(event) =>
                  void onStartLevelDateChange(event.target.value)
                }
                className="mt-1 h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-700 outline-none transition focus:border-[#8b4513] focus:ring-2 focus:ring-[#f6eee9]"
              />
              <p className="mt-1 text-xs font-medium leading-relaxed text-gray-400">
                Mặc định là ngày chuyển trạng thái sang Đã nhận, có thể chỉnh
                lại khi cần.
              </p>
            </label>
          </div>
        </Section>

        <Section title="Xem lại theo level" compact>
          <div className="space-y-2">
            {LEVEL_OPTIONS.map((level) => {
              const record = management.levels[level.value];
              const active = activeLevel === level.value;
              const isCurrent = management.currentLevel === level.value;
              return (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => onLevelChange(level.value)}
                  className={`flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left transition ${
                    active
                      ? "border-[#8b4513] bg-[#fbf6f2]"
                      : "border-gray-100 bg-white hover:bg-gray-50"
                  }`}
                >
                  <span className="min-w-0">
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="text-sm font-bold text-gray-900">
                      {level.label}
                      </span>
                      {isCurrent && (
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                          hiện tại
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block truncate text-xs font-medium text-gray-400">
                      {record.target || record.comment
                        ? "Đã có dữ liệu"
                        : "Chưa nhập"}
                    </span>
                  </span>
                  <ChevronRight size={15} className="shrink-0 text-gray-300" />
                </button>
              );
            })}
          </div>
        </Section>
      </div>

      <Section title={`Target và nhận xét ${activeLevel.toUpperCase()}`}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {LEVEL_OPTIONS.map((level) => (
              <button
                key={level.value}
                type="button"
                onClick={() => onLevelChange(level.value)}
                className={`h-8 rounded-lg border px-3 text-xs font-bold transition ${
                  activeLevel === level.value
                    ? "border-[#8b4513] bg-[#4a2318] text-white"
                    : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                {level.label}
              </button>
            ))}
            <label className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2 text-[11px] font-bold text-gray-500">
              Ngày level
              <input
                type="date"
                value={management.levels[activeLevel].startedAt || ""}
                onChange={(event) =>
                  void onLevelStartDateChange(activeLevel, event.target.value)
                }
                className="h-6 rounded-md border border-gray-100 px-1 text-[11px] font-bold text-gray-700 outline-none focus:border-[#8b4513]"
              />
            </label>
          </div>
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="inline-flex h-9 items-center gap-2 rounded-xl bg-[#4a2318] px-4 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            <Save size={15} />
            {saving ? "Đang lưu..." : "Lưu quản lý"}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <label>
            <SLabel>Target {activeLevel.toUpperCase()}</SLabel>
            <textarea
              value={management.levels[activeLevel].target}
              onChange={(event) =>
                onUpdateLevel(activeLevel, "target", event.target.value)
              }
              rows={7}
              placeholder="Nhập target, mục tiêu, KPI hoặc việc cần đạt..."
              className="mt-1 w-full resize-y rounded-xl border border-gray-200 px-3 py-2.5 text-sm leading-relaxed text-gray-700 outline-none transition focus:border-[#8b4513] focus:ring-2 focus:ring-[#f6eee9]"
            />
          </label>
          <label>
            <SLabel>Nhận xét {activeLevel.toUpperCase()}</SLabel>
            <textarea
              value={management.levels[activeLevel].comment}
              onChange={(event) =>
                onUpdateLevel(activeLevel, "comment", event.target.value)
              }
              rows={7}
              placeholder="Nhập nhận xét, điểm mạnh, điểm cần cải thiện..."
              className="mt-1 w-full resize-y rounded-xl border border-gray-200 px-3 py-2.5 text-sm leading-relaxed text-gray-700 outline-none transition focus:border-[#8b4513] focus:ring-2 focus:ring-[#f6eee9]"
            />
          </label>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          {LEVEL_OPTIONS.map((level) => {
            const record = management.levels[level.value];
            return (
              <button
                key={level.value}
                type="button"
                onClick={() => onLevelChange(level.value)}
                className={`rounded-xl border p-3 text-left transition ${
                  activeLevel === level.value
                    ? "border-[#8b4513] bg-[#fbf6f2]"
                    : "border-gray-100 bg-gray-50 hover:bg-white"
                }`}
              >
                <p className="mb-2 text-xs font-bold text-gray-500">
                  Lưu trữ {level.label}
                </p>
                <p className="mb-2 text-xs font-semibold text-gray-400">
                  Ngày level: {record.startedAt || "---"}
                </p>
                <p className="line-clamp-2 text-xs leading-relaxed text-gray-600">
                  <strong>Target:</strong> {record.target || "---"}
                </p>
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-600">
                  <strong>Nhận xét:</strong> {record.comment || "---"}
                </p>
              </button>
            );
          })}
        </div>
      </Section>
    </div>
  );
}

function LeaderModal({
  leaders,
  loading,
  saving,
  draft,
  editingId,
  onDraftChange,
  onSave,
  onEdit,
  onDelete,
  onReset,
  onClose,
}: {
  leaders: RecruitmentLeader[];
  loading: boolean;
  saving: boolean;
  draft: { name: string; team: LeaderTeam };
  editingId: string | null;
  onDraftChange: (draft: { name: string; team: LeaderTeam }) => void;
  onSave: () => void | Promise<void>;
  onEdit: (leader: RecruitmentLeader) => void;
  onDelete: (leaderId: string) => void | Promise<void>;
  onReset: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f8f4f1] text-[#4a2318]">
              <UserRound size={17} />
            </span>
            <div>
              <h2 className="text-base font-black text-gray-950">
                Quản lý leader
              </h2>
              <p className="text-xs font-semibold text-gray-400">
                Team tag chỉ để nhìn và phân biệt, không ảnh hưởng vị trí.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-[0px] font-black leading-none text-gray-500 transition after:text-lg after:content-['×'] hover:bg-gray-50"
          >
            Đóng
          </button>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_160px_auto_auto]">
          <input
            value={draft.name}
            disabled={saving}
            onChange={(event) =>
              onDraftChange({ ...draft, name: event.target.value })
            }
            placeholder="Tên leader"
            className="h-10 rounded-lg border border-gray-200 px-3 text-sm font-semibold outline-none focus:border-[#8b4513] focus:ring-2 focus:ring-[#f6eee9]"
          />
          <select
            value={draft.team}
            disabled={saving}
            onChange={(event) =>
              onDraftChange({ ...draft, team: event.target.value as LeaderTeam })
            }
            className="h-10 rounded-lg border border-gray-200 px-3 text-sm font-bold outline-none focus:border-[#8b4513]"
          >
            {LEADER_TEAMS.map((team) => (
              <option key={team.value} value={team.value}>
                {team.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={onSave}
            disabled={saving || !draft.name.trim()}
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-[#4a2318] px-3 text-sm font-black text-white transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={15} />
            {editingId ? "Lưu" : "Thêm"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={onReset}
              disabled={saving}
              className="h-10 rounded-lg border border-gray-200 px-3 text-sm font-black text-gray-500 transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              Hủy
            </button>
          )}
        </div>

        <div className="divide-y divide-gray-100 rounded-xl border border-gray-100">
          {loading && (
            <div className="px-3 py-4 text-sm font-semibold text-gray-400">
              Đang tải leader...
            </div>
          )}
          {!loading && leaders.length === 0 && (
            <div className="px-3 py-4 text-sm font-semibold text-gray-400">
              Chưa có leader nào.
            </div>
          )}
          {!loading && leaders.map((leader) => (
            <div
              key={leader.id}
              className="flex items-center justify-between gap-3 px-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-gray-900">
                  {leader.name}
                </p>
                <LeaderTeamTag team={leader.team} />
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onEdit(leader)}
                  disabled={saving}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                  title="Sua"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(leader.id)}
                  disabled={saving}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  title="Xoa"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LeaderTeamTag({ team }: { team: LeaderTeam }) {
  const info = LEADER_TEAMS.find((item) => item.value === team) || LEADER_TEAMS[5];
  return (
    <span
      className="inline-flex w-fit rounded-md px-2 py-0.5 text-[10px] font-black"
      style={{ color: info.color, background: info.bg }}
    >
      {info.label}
    </span>
  );
}

function HighlightCard({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-gray-100 bg-white p-3.5 shadow-sm">
      <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wide text-gray-400">
        <span className="text-gray-400">{icon}</span>
        {label}
      </div>
      <div className="flex min-w-0 flex-col gap-0.5">{children}</div>
    </div>
  );
}

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
      className={`rounded-2xl border border-gray-100 bg-white shadow-sm ${compact ? "p-4" : "p-5"}`}
    >
      <h2
        className={`mb-4 font-bold text-gray-900 ${compact ? "text-sm" : "text-base"}`}
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
      className="mb-1 block text-xs font-bold uppercase tracking-wider"
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
      <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
        {value}
      </p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="mb-0.5 block text-xs font-semibold text-gray-400">
        {label}
      </span>
      <span className="font-semibold text-gray-800">{value || "---"}</span>
    </div>
  );
}
