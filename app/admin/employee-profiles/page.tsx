"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Eye, Trash2, Calendar, RefreshCw, AlertCircle } from "lucide-react";
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
}

export default function EmployeeProfilesPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<EmployeeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const { toasts, addToast } = useToasts();
  
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
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
  }, [search, page, addToast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProfiles();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchProfiles]);

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
    } catch {
      addToast("Lỗi khi xóa hồ sơ", "error");
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

  return (
    <div className="flex flex-col gap-6 p-6 min-h-screen bg-gray-50/50">
      
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Quản lý Hồ sơ nhân sự
          </h1>
          <p className="text-xs font-semibold text-gray-400 mt-1">
            Tổng số hồ sơ đã thu thập: {totalRecords}
          </p>
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
          placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
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
              <h3 className="text-sm font-bold text-gray-700">Chưa có hồ sơ nhân sự nào</h3>
              <p className="text-xs text-gray-400 font-semibold mt-1">
                Các hồ sơ nhân sự sau khi điền thành công sẽ xuất hiện tại đây.
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
                      {profile.dob}
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
                      {new Date(profile.created_at).toLocaleDateString("vi-VN")}
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
