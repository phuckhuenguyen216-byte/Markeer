"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Eye,
  Trash2,
  RefreshCw,
  AlertCircle,
  Users,
  Code,
  Cpu,
  Megaphone,
  TrendingUp,
  Server,
  ArrowLeft,
  ChevronRight,
  Edit
} from "lucide-react";
import Spinner from "../components/Spinner";
import ConfirmModal, { type ConfirmAction } from "../components/ConfirmModal";
import { ToastStack, useToasts } from "../components/Toast";

interface EmployeeRecord {
  id: string;
  full_name: string;
  dob: string;
  gender: string;
  phone: string;
  personal_email: string;
  created_at: string;
  team: string;
}

interface TeamStat {
  name: string;
  count: number;
}

// Date formatter helper: converts any YYYY-MM-DD or other formats into DD/MM/YYYY
const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  if (dateStr.includes("/")) return dateStr; // Already in DD/MM/YYYY format
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    return `${match[3]}/${match[2]}/${match[1]}`;
  }
  return dateStr;
};

export default function EmployeeProfilesPage() {
  const router = useRouter();
  
  // Tầng 1: Selected Team
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [teamStats, setTeamStats] = useState<TeamStat[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

  // Tầng 2: Members in selected Team
  const [profiles, setProfiles] = useState<EmployeeRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  
  const { toasts, addToast } = useToasts();
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch stats for all teams
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await fetch("/api/employee-profiles?stats=true");
      if (!res.ok) throw new Error("Could not fetch team statistics");
      const data = await res.json();
      setTeamStats(data.stats || []);
    } catch (err) {
      console.error(err);
      addToast("Không thể tải thống kê danh sách nhóm", "error");
    } finally {
      setStatsLoading(false);
    }
  }, [addToast]);

  // Fetch profiles for the selected team
  const fetchProfiles = useCallback(async () => {
    if (!selectedTeam) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      params.set("team", selectedTeam);
      params.set("page", String(page));
      params.set("limit", "15");
      
      const res = await fetch(`/api/employee-profiles?${params.toString()}`);
      if (!res.ok) throw new Error("Could not fetch profiles");
      const data = await res.json();
      
      setProfiles(data.profiles || []);
      setTotalPages(data.totalPages || 1);
      setTotalRecords(data.total || 0);
    } catch (err) {
      console.error(err);
      addToast("Không thể tải danh sách hồ sơ nhân sự", "error");
    } finally {
      setLoading(false);
    }
  }, [search, page, selectedTeam, addToast]);

  // Initial load
  useEffect(() => {
    if (selectedTeam === null) {
      fetchStats();
    }
  }, [selectedTeam, fetchStats]);

  // Load profiles when team or page/search changes
  useEffect(() => {
    if (selectedTeam !== null) {
      const timer = setTimeout(() => {
        fetchProfiles();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [fetchProfiles, selectedTeam]);

  const handleDelete = async (id: string, name: string) => {
    setConfirmAction(null);
    setDeletingId(id);
    try {
      const res = await fetch(`/api/employee-profiles/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setProfiles((prev) => prev.filter((p) => p.id !== id));
      addToast(`Đã xóa hồ sơ của: ${name}`, "success");
      // Update totals count locally
      setTotalRecords((prev) => Math.max(0, prev - 1));
    } catch {
      addToast("Lỗi khi xóa hồ sơ nhân viên", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const confirmDelete = (profile: EmployeeRecord) => {
    setConfirmAction({
      title: "Xóa hồ sơ nhân viên?",
      desc: "Hành động này sẽ xóa vĩnh viễn hồ sơ và không thể hoàn tác.",
      detail: `${profile.full_name} - ${profile.personal_email}`,
      danger: true,
      onConfirm: () => handleDelete(profile.id, profile.full_name),
    });
  };

  // Helper to assign icons to teams
  const getTeamIcon = (name: string) => {
    switch (name) {
      case "Dev/DevOps":
        return <Code className="h-6 w-6 text-indigo-500" />;
      case "AI":
        return <Cpu className="h-6 w-6 text-purple-500" />;
      case "Marketing":
        return <Megaphone className="h-6 w-6 text-rose-500" />;
      case "Sales":
        return <TrendingUp className="h-6 w-6 text-amber-500" />;
      case "Infrastructure":
        return <Server className="h-6 w-6 text-teal-500" />;
      default:
        return <Users className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 min-h-screen bg-gray-50/50">
      
      {/* ---------------- TẦNG 1: HIỂN THỊ DANH SÁCH TEAM ---------------- */}
      {selectedTeam === null ? (
        <>
          {/* Top Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                Hồ sơ nhân sự theo phòng ban
              </h1>
              <p className="text-xs font-semibold text-gray-400 mt-1">
                Chọn một phòng ban để quản lý danh sách hồ sơ nhân sự
              </p>
            </div>
            
            <button
              onClick={fetchStats}
              disabled={statsLoading}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-900 transition-colors shadow-sm disabled:opacity-50"
              title="Tải lại thống kê"
            >
              <RefreshCw size={16} className={statsLoading ? "animate-spin" : ""} />
            </button>
          </div>

          {statsLoading && teamStats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Spinner />
              <span className="text-xs font-bold text-gray-400">Đang tải thống kê phòng ban...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {teamStats.map((team) => (
                <div
                  key={team.name}
                  onClick={() => {
                    setSelectedTeam(team.name);
                    setSearch("");
                    setPage(1);
                  }}
                  className="flex items-center justify-between p-6 rounded-2xl border border-gray-100 bg-white hover:border-red-200 hover:shadow-md cursor-pointer transition-all duration-200 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3.5 rounded-xl bg-gray-50 group-hover:bg-red-50/50 transition-colors">
                      {getTeamIcon(team.name)}
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-gray-900 group-hover:text-red-600 transition-colors">
                        Team {team.name}
                      </h3>
                      <p className="text-xs font-semibold text-gray-400 mt-0.5">
                        {team.count} thành viên
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 group-hover:text-red-400 transition-colors translate-x-0 group-hover:translate-x-1 duration-200" />
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        /* ---------------- TẦNG 2: DANH SÁCH THÀNH VIÊN TRONG TEAM ---------------- */
        <>
          {/* Top Header & Back Button */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedTeam(null)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-900 transition-colors shadow-sm"
                title="Quay lại danh sách nhóm"
              >
                <ArrowLeft size={16} />
              </button>
              <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                  <span>Hồ sơ: Team {selectedTeam}</span>
                </h1>
                <p className="text-xs font-semibold text-gray-400 mt-1">
                  Tổng số hồ sơ trong nhóm: {totalRecords}
                </p>
              </div>
            </div>
            
            <button
              onClick={fetchProfiles}
              disabled={loading}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-900 transition-colors shadow-sm disabled:opacity-50"
              title="Tải lại danh sách"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
          </div>

          {/* Search Input Bar */}
          <div className="relative max-w-md w-full">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Tìm theo tên, email hoặc số điện thoại..."
              className="w-full rounded-2xl border border-gray-200 bg-white pl-11 pr-4 py-3 text-sm font-semibold transition-all focus:outline-none focus:border-gray-400 focus:ring-4 focus:ring-gray-100"
            />
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Main Table Card */}
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              {loading && profiles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <Spinner />
                  <span className="text-xs font-bold text-gray-400">Đang tải danh sách hồ sơ...</span>
                </div>
              ) : profiles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                  <AlertCircle size={32} className="text-gray-300 mb-2" />
                  <h3 className="text-sm font-bold text-gray-700">Không có hồ sơ nào</h3>
                  <p className="text-xs text-gray-400 font-semibold mt-1">
                    {search.trim() ? "Không tìm thấy hồ sơ nào khớp với bộ lọc." : `Chưa có hồ sơ nhân viên nào được phân vào Team ${selectedTeam}.`}
                  </p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                      <th className="px-6 py-4">Họ và tên</th>
                      <th className="px-6 py-4">Ngày sinh</th>
                      <th className="px-6 py-4">Giới tính</th>
                      <th className="px-6 py-4">Số điện thoại</th>
                      <th className="px-6 py-4">Email cá nhân</th>
                      <th className="px-6 py-4">Ngày nộp</th>
                      <th className="px-6 py-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-700">
                    {profiles.map((profile) => (
                      <tr
                        key={profile.id}
                        className={`hover:bg-gray-50/50 transition-colors ${
                          deletingId === profile.id ? "opacity-50 pointer-events-none" : ""
                        }`}
                      >
                        <td className="px-6 py-4 font-black text-gray-900">
                          {profile.full_name}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {formatDate(profile.dob)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              profile.gender === "Nam"
                                ? "bg-blue-50 text-blue-600"
                                : "bg-pink-50 text-pink-600"
                            }`}
                          >
                            {profile.gender}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-gray-600">
                          {profile.phone}
                        </td>
                        <td className="px-6 py-4 lowercase text-gray-500">
                          {profile.personal_email}
                        </td>
                        <td className="px-6 py-4 text-gray-400">
                          {formatDate(new Date(profile.created_at).toISOString())}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => router.push(`/admin/employee-profiles/${profile.id}`)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                              title="Xem chi tiết"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => router.push(`/admin/employee-profiles/${profile.id}?edit=true`)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                              title="Chỉnh sửa trực tiếp"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => confirmDelete(profile)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                              title="Xóa hồ sơ"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-50 px-6 py-4 bg-white">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                >
                  Trước
                </button>
                <span className="text-xs font-semibold text-gray-400">
                  Trang {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                >
                  Tiếp
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Confirmation Modal */}
      {confirmAction && (
        <ConfirmModal
          action={confirmAction}
          onCancel={() => setConfirmAction(null)}
        />
      )}

      {/* Toast Notifications */}
      <ToastStack toasts={toasts} />
    </div>
  );
}
