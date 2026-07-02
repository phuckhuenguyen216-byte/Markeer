"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit2,
  CheckCircle,
  XCircle,
  HelpCircle,
  Save,
  X,
  Loader2,
  Trash2,
  Calendar,
  Layers,
  Briefcase
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";

interface SelfReview {
  id: string;
  full_name: string;
  team: string;
  current_level: string;
  target_level: string;
  review_period: string;
  assigned_mentors_leaders: {
    [name: string]: {
      leader: boolean;
      mentor: boolean;
    };
  };
  kpi_answers: {
    q1: string;
    q2: string;
    q3: string;
    q4: string;
    self_score: string;
  };
  quality_answers: {
    q5: string;
    q6: string;
    q7: string;
  };
  behavior_answers: {
    q8: string;
    q9: string;
    q10: string;
  };
  commitment_answers: {
    q11: string;
    q12: string;
    q13: string;
  };
  status: string;
  created_at: string;
}

export default function AdminSelfReviewsPage() {
  const [reviews, setReviews] = useState<SelfReview[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 15;

  const [selectedReview, setSelectedReview] = useState<SelfReview | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<SelfReview | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [page, search]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/survey-review/self-review?search=${encodeURIComponent(search)}&page=${page}&limit=${limit}`);
      const data = await res.json();
      if (res.ok) {
        setReviews(data.reviews || []);
        setTotal(data.total || 0);
      }
    } catch (err) {
      console.error("Error fetching self reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/survey-review/self-review/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setReviews((prev) => prev.map((r) => (r.id === id ? updated.review : r)));
        if (selectedReview && selectedReview.id === id) {
          setSelectedReview(updated.review);
        }
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleSaveEdit = async () => {
    if (!editForm) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/survey-review/self-review/${editForm.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        const updated = await res.json();
        setReviews((prev) => prev.map((r) => (r.id === editForm.id ? updated.review : r)));
        setSelectedReview(updated.review);
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Error saving edits:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleStartEdit = () => {
    setEditForm(JSON.parse(JSON.stringify(selectedReview)));
    setIsEditing(true);
  };

  const handleEditInputChange = (field: keyof SelfReview, value: any) => {
    if (!editForm) return;
    setEditForm((prev) => prev ? { ...prev, [field]: value } : null);
  };

  const handleEditNestedChange = (category: "kpi_answers" | "quality_answers" | "behavior_answers" | "commitment_answers", key: string, value: string) => {
    if (!editForm) return;
    setEditForm((prev) => {
      if (!prev) return null;
      const sub = { ...prev[category] as any, [key]: value };
      return { ...prev, [category]: sub };
    });
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="flex flex-col gap-6 p-1">
      {/* Top Header & Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-800">Khảo sát Self Review</h1>
          <p className="text-xs text-gray-500 font-semibold">Quản lý và phê duyệt các biểu mẫu ứng viên tự đánh giá lên level</p>
        </div>

        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Tìm kiếm họ tên, team..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-4 text-xs font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:border-red-400"
          />
        </div>
      </div>

      {/* Main Table Card */}
      <div className="overflow-hidden rounded-2xl border border-gray-150 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-[10px] font-black uppercase text-gray-400 tracking-wider">
                <th className="px-5 py-3.5">Họ và tên</th>
                <th className="px-5 py-3.5">Track / Team</th>
                <th className="px-5 py-3.5">Level hiện tại</th>
                <th className="px-5 py-3.5">Level đề xuất</th>
                <th className="px-5 py-3.5">Kỳ review</th>
                <th className="px-5 py-3.5">Trạng thái</th>
                <th className="px-5 py-3.5 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-gray-400 font-semibold">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-gray-300 mb-2" />
                    Đang tải danh sách khảo sát...
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-gray-400 font-semibold">
                    Không tìm thấy bài khảo sát nào.
                  </td>
                </tr>
              ) : (
                reviews.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-gray-800">{row.full_name}</td>
                    <td className="px-5 py-3.5 font-semibold text-gray-500">{row.team}</td>
                    <td className="px-5 py-3.5"><span className="rounded bg-gray-100 px-2 py-0.5 font-bold text-gray-600 text-[10px]">{row.current_level}</span></td>
                    <td className="px-5 py-3.5"><span className="rounded bg-red-50 px-2 py-0.5 font-bold text-red-600 text-[10px]">{row.target_level}</span></td>
                    <td className="px-5 py-3.5 font-bold text-gray-700">{row.review_period}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black ${
                        row.status === "Đã duyệt lên Level"
                          ? "bg-emerald-50 text-emerald-700"
                          : row.status === "Từ chối lên Level"
                          ? "bg-rose-50 text-rose-700"
                          : "bg-amber-50 text-amber-700"
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => { setSelectedReview(row); setIsEditing(false); }}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-gray-900 transition-all hover:bg-gray-50"
                          title="Xem chi tiết"
                        >
                          <Eye size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
            <span className="text-[11px] font-bold text-gray-400">
              Trang {page} / {totalPages} (Tổng {total} kết quả)
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-gray-900 disabled:opacity-40"
              >
                <ChevronLeft size={13} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-gray-900 disabled:opacity-40"
              >
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Details Slide-Over / Modal */}
      {selectedReview && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-gray-900/40 backdrop-blur-sm">
          <div className="flex h-screen w-full max-w-3xl flex-col rounded-l-3xl bg-white shadow-2xl overflow-hidden border-l border-gray-150">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/50">
              <div>
                <h3 className="text-base font-black text-gray-800">
                  {isEditing ? "Chỉnh sửa khảo sát" : "Chi tiết Self Review"}
                </h3>
                <p className="text-[10px] font-bold text-gray-400 mt-0.5 uppercase tracking-wide">
                  Mã hồ sơ: #{selectedReview.id.substring(0, 8)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {!isEditing ? (
                  <button
                    onClick={handleStartEdit}
                    className="flex h-8 items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 text-xs font-bold text-gray-600 hover:bg-gray-50"
                  >
                    <Edit2 size={12} />
                    <span>Sửa dữ liệu</span>
                  </button>
                ) : (
                  <button
                    onClick={handleSaveEdit}
                    disabled={saving}
                    className="flex h-8 items-center gap-1 rounded-xl bg-red-500 px-3 text-xs font-bold text-white hover:bg-red-600 disabled:opacity-50"
                  >
                    {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                    <span>Lưu lại</span>
                  </button>
                )}
                <button
                  onClick={() => { setSelectedReview(null); setIsEditing(false); }}
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-400 hover:text-gray-600"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Scrollable details content */}
            <div className="flex-1 overflow-y-auto p-6 text-xs leading-relaxed space-y-6">
              
              {/* Approval status badge and controls */}
              <div className="rounded-2xl bg-gray-50 p-4 border border-gray-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Trạng thái hiện tại</span>
                  <div className="mt-0.5 font-black text-sm text-gray-800">{selectedReview.status}</div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleUpdateStatus(selectedReview.id, "Đang xem xét")}
                    className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 font-bold text-amber-600 hover:bg-amber-50 text-[11px]"
                  >
                    Đang xem xét
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedReview.id, "Đã duyệt lên Level")}
                    className="rounded-xl border border-emerald-200 bg-white px-3 py-1.5 font-bold text-emerald-600 hover:bg-emerald-50 text-[11px]"
                  >
                    Duyệt lên Level
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedReview.id, "Từ chối lên Level")}
                    className="rounded-xl border border-rose-200 bg-white px-3 py-1.5 font-bold text-rose-600 hover:bg-rose-50 text-[11px]"
                  >
                    Từ chối lên Level
                  </button>
                </div>
              </div>

              {/* View/Edit Form */}
              {isEditing && editForm ? (
                // EDIT MODE FORM
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-gray-500">Họ và tên</label>
                      <input
                        type="text"
                        value={editForm.full_name}
                        onChange={(e) => handleEditInputChange("full_name", e.target.value)}
                        className="rounded-lg border border-gray-200 px-3 py-1.5 font-semibold text-gray-800 focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-gray-500">Track / Team</label>
                      <input
                        type="text"
                        value={editForm.team}
                        onChange={(e) => handleEditInputChange("team", e.target.value)}
                        className="rounded-lg border border-gray-200 px-3 py-1.5 font-semibold text-gray-800 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-gray-500">Level hiện tại</label>
                      <input
                        type="text"
                        value={editForm.current_level}
                        onChange={(e) => handleEditInputChange("current_level", e.target.value)}
                        className="rounded-lg border border-gray-200 px-3 py-1.5 font-semibold text-gray-800 focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-gray-500">Level đề xuất</label>
                      <input
                        type="text"
                        value={editForm.target_level}
                        onChange={(e) => handleEditInputChange("target_level", e.target.value)}
                        className="rounded-lg border border-gray-200 px-3 py-1.5 font-semibold text-gray-800 focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-gray-500">Kỳ review</label>
                      <input
                        type="text"
                        value={editForm.review_period}
                        onChange={(e) => handleEditInputChange("review_period", e.target.value)}
                        className="rounded-lg border border-gray-200 px-3 py-1.5 font-semibold text-gray-800 focus:outline-none"
                      />
                    </div>
                  </div>

                  <hr className="border-gray-100" />

                  {/* KPI edits */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-red-500 uppercase text-[10px] tracking-wider">Phần 1: KPI & Output</h4>
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-gray-600">[Q1] Giao bao nhiêu task, hoàn thành bao nhiêu % và đúng hạn chưa?</label>
                      <textarea
                        rows={2}
                        value={editForm.kpi_answers.q1}
                        onChange={(e) => handleEditNestedChange("kpi_answers", "q1", e.target.value)}
                        className="rounded-lg border border-gray-200 p-2 font-semibold text-gray-700"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-gray-600">[Q2] Liệt kê 2–3 output quan trọng nhất (link evidence)</label>
                      <textarea
                        rows={2}
                        value={editForm.kpi_answers.q2}
                        onChange={(e) => handleEditNestedChange("kpi_answers", "q2", e.target.value)}
                        className="rounded-lg border border-gray-200 p-2 font-semibold text-gray-700"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-gray-600">[Q3] Tổng KPI Points tự tính & screenshot log</label>
                      <input
                        type="text"
                        value={editForm.kpi_answers.q3}
                        onChange={(e) => handleEditNestedChange("kpi_answers", "q3", e.target.value)}
                        className="rounded-lg border border-gray-200 px-3 py-1.5 font-semibold text-gray-750"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-gray-600">[Q4] Task trễ hoặc chưa đạt (lý do & xử lý thế nào)</label>
                      <textarea
                        rows={2}
                        value={editForm.kpi_answers.q4}
                        onChange={(e) => handleEditNestedChange("kpi_answers", "q4", e.target.value)}
                        className="rounded-lg border border-gray-200 p-2 font-semibold text-gray-700"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-gray-600">Tự chấm điểm</label>
                      <input
                        type="text"
                        value={editForm.kpi_answers.self_score}
                        onChange={(e) => handleEditNestedChange("kpi_answers", "self_score", e.target.value)}
                        className="w-20 rounded-lg border border-gray-200 px-3 py-1 font-semibold text-gray-800"
                      />
                    </div>
                  </div>

                  <hr className="border-gray-100" />

                  {/* Quality edits */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-red-500 uppercase text-[10px] tracking-wider">Phần 2: Chất lượng & Chuẩn nghề</h4>
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-gray-600">[Q5] Output bị review trả lại nhiều không, bao nhiêu lần?</label>
                      <textarea
                        rows={2}
                        value={editForm.quality_answers.q5}
                        onChange={(e) => handleEditNestedChange("quality_answers", "q5", e.target.value)}
                        className="rounded-lg border border-gray-200 p-2 font-semibold text-gray-700"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-gray-600">[Q6] Phần tự xử lý độc lập vs phần cần hỗ trợ</label>
                      <textarea
                        rows={2}
                        value={editForm.quality_answers.q6}
                        onChange={(e) => handleEditNestedChange("quality_answers", "q6", e.target.value)}
                        className="rounded-lg border border-gray-200 p-2 font-semibold text-gray-700"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-gray-600">[Q7] Tài liệu bàn giao (handover/runbook/doc link)</label>
                      <textarea
                        rows={2}
                        value={editForm.quality_answers.q7}
                        onChange={(e) => handleEditNestedChange("quality_answers", "q7", e.target.value)}
                        className="rounded-lg border border-gray-200 p-2 font-semibold text-gray-700"
                      />
                    </div>
                  </div>

                  <hr className="border-gray-100" />

                  {/* Behavior edits */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-red-500 uppercase text-[10px] tracking-wider">Phần 3: Behavior & Thái độ</h4>
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-gray-600">[Q8] Việc tự làm ngoài task được giao</label>
                      <textarea
                        rows={2}
                        value={editForm.behavior_answers.q8}
                        onChange={(e) => handleEditNestedChange("behavior_answers", "q8", e.target.value)}
                        className="rounded-lg border border-gray-200 p-2 font-semibold text-gray-700"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-gray-600">[Q9] Lần nhận feedback và sự thay đổi</label>
                      <textarea
                        rows={2}
                        value={editForm.behavior_answers.q9}
                        onChange={(e) => handleEditNestedChange("behavior_answers", "q9", e.target.value)}
                        className="rounded-lg border border-gray-200 p-2 font-semibold text-gray-700"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-gray-600">[Q10] Khó khăn blocker (tự xử lý vs leo thang)</label>
                      <textarea
                        rows={2}
                        value={editForm.behavior_answers.q10}
                        onChange={(e) => handleEditNestedChange("behavior_answers", "q10", e.target.value)}
                        className="rounded-lg border border-gray-200 p-2 font-semibold text-gray-700"
                      />
                    </div>
                  </div>

                  <hr className="border-gray-100" />

                  {/* Commitment edits */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-red-500 uppercase text-[10px] tracking-wider">Phần 4: Đối chiếu & Cam kết</h4>
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-gray-600">[Q11] Điểm đạt vs điểm chưa đạt so với level muốn lên</label>
                      <textarea
                        rows={2}
                        value={editForm.commitment_answers.q11}
                        onChange={(e) => handleEditNestedChange("commitment_answers", "q11", e.target.value)}
                        className="rounded-lg border border-gray-200 p-2 font-semibold text-gray-700"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-gray-600">[Q12] Cam kết cụ thể nếu được thăng cấp</label>
                      <textarea
                        rows={2}
                        value={editForm.commitment_answers.q12}
                        onChange={(e) => handleEditNestedChange("commitment_answers", "q12", e.target.value)}
                        className="rounded-lg border border-gray-200 p-2 font-semibold text-gray-700"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-gray-600">[Q13] Đóng góp/Context muốn sếp biết thêm</label>
                      <textarea
                        rows={2}
                        value={editForm.commitment_answers.q13}
                        onChange={(e) => handleEditNestedChange("commitment_answers", "q13", e.target.value)}
                        className="rounded-lg border border-gray-200 p-2 font-semibold text-gray-700"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                // NORMAL VIEW DETAILS
                <div className="space-y-6">
                  {/* General Info Grid */}
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4 rounded-2xl border border-gray-100 bg-white p-5">
                    <div>
                      <span className="text-gray-400 font-bold">Họ và tên:</span>
                      <div className="font-black text-sm text-gray-800 mt-0.5">{selectedReview.full_name}</div>
                    </div>
                    <div>
                      <span className="text-gray-400 font-bold">Track / Team:</span>
                      <div className="font-bold text-gray-700 mt-0.5">{selectedReview.team}</div>
                    </div>
                    <div>
                      <span className="text-gray-400 font-bold">Level hiện tại / Đề xuất:</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="rounded bg-gray-100 px-2 py-0.5 font-bold text-gray-600 text-[10px]">{selectedReview.current_level}</span>
                        <span className="text-gray-300">→</span>
                        <span className="rounded bg-red-50 px-2 py-0.5 font-bold text-red-600 text-[10px]">{selectedReview.target_level}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400 font-bold">Kỳ xét / Ngày nộp:</span>
                      <div className="font-bold text-gray-700 mt-0.5">
                        {selectedReview.review_period} ({new Date(selectedReview.created_at).toLocaleDateString("vi-VN")})
                      </div>
                    </div>
                  </div>

                  {/* Mentor/Leader Checklist display */}
                  <div className="space-y-2">
                    <h4 className="font-black text-gray-800 uppercase tracking-wider text-[10px]">Leader / Mentor phụ trách đánh giá chéo</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(selectedReview.assigned_mentors_leaders || {}).map(([name, roles]) => {
                        if (!roles.leader && !roles.mentor) return null;
                        return (
                          <div key={name} className="rounded-xl border border-gray-150 bg-white px-3 py-1.5 flex items-center gap-2">
                            <span className="font-bold text-gray-700">{name}</span>
                            <div className="flex gap-1">
                              {roles.leader && <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[9px] font-black text-amber-700">Leader</span>}
                              {roles.mentor && <span className="rounded bg-sky-50 px-1.5 py-0.5 text-[9px] font-black text-sky-700">Mentor</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* KPI answers */}
                  <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5">
                    <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                      <h4 className="font-black text-red-500 uppercase tracking-wider text-[10px]">Phần 1: KPI & Output</h4>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-400 font-bold">Tự chấm điểm:</span>
                        <span className="rounded bg-red-500 text-white font-black text-xs px-2 py-0.5">{selectedReview.kpi_answers.self_score || "N/A"} / 5</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="font-bold text-gray-800 leading-relaxed">[Q1] Số lượng task & tỷ lệ hoàn thành đúng hạn:</div>
                        <p className="mt-1 text-gray-600 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100 whitespace-pre-wrap">{selectedReview.kpi_answers.q1}</p>
                      </div>
                      <div>
                        <div className="font-bold text-gray-800 leading-relaxed">[Q2] Các output quan trọng kèm link evidence:</div>
                        <p className="mt-1 text-gray-600 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100 whitespace-pre-wrap">{selectedReview.kpi_answers.q2}</p>
                      </div>
                      <div>
                        <div className="font-bold text-gray-800 leading-relaxed">[Q3] Tổng điểm KPI & link log:</div>
                        <p className="mt-1 text-gray-700 font-bold bg-gray-50/50 p-2.5 rounded-xl border border-gray-100">{selectedReview.kpi_answers.q3}</p>
                      </div>
                      <div>
                        <div className="font-bold text-gray-800 leading-relaxed">[Q4] Task bị trễ hoặc chưa đạt (lý do & xử lý):</div>
                        <p className="mt-1 text-gray-600 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100 whitespace-pre-wrap">{selectedReview.kpi_answers.q4}</p>
                      </div>
                    </div>
                  </div>

                  {/* Quality answers */}
                  <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5">
                    <h4 className="font-black text-red-500 uppercase tracking-wider text-[10px] border-b border-gray-50 pb-2">Phần 2: Chất lượng & Chuẩn nghề</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="font-bold text-gray-800 leading-relaxed">[Q5] Output bị review trả lại & số lần sửa:</div>
                        <p className="mt-1 text-gray-600 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100 whitespace-pre-wrap">{selectedReview.quality_answers.q5}</p>
                      </div>
                      <div>
                        <div className="font-bold text-gray-800 leading-relaxed">[Q6] Phạm vi độc lập xử lý vs sự hỗ trợ:</div>
                        <p className="mt-1 text-gray-600 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100 whitespace-pre-wrap">{selectedReview.quality_answers.q6}</p>
                      </div>
                      <div>
                        <div className="font-bold text-gray-800 leading-relaxed">[Q7] Tài liệu bàn giao & link runbook/checklist:</div>
                        <p className="mt-1 text-gray-600 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100 whitespace-pre-wrap">{selectedReview.quality_answers.q7}</p>
                      </div>
                    </div>
                  </div>

                  {/* Behavior answers */}
                  <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5">
                    <h4 className="font-black text-red-500 uppercase tracking-wider text-[10px] border-b border-gray-50 pb-2">Phần 3: Behavior & Thái độ</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="font-bold text-gray-800 leading-relaxed">[Q8] Những đóng góp chủ động ngoài task được giao:</div>
                        <p className="mt-1 text-gray-600 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100 whitespace-pre-wrap">{selectedReview.behavior_answers.q8}</p>
                      </div>
                      <div>
                        <div className="font-bold text-gray-800 leading-relaxed">[Q9] Lần nhận feedback từ sếp & sự cải thiện:</div>
                        <p className="mt-1 text-gray-600 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100 whitespace-pre-wrap">{selectedReview.behavior_answers.q9}</p>
                      </div>
                      <div>
                        <div className="font-bold text-gray-800 leading-relaxed">[Q10] Khó khăn blocker & kỹ năng leo thang đúng lúc:</div>
                        <p className="mt-1 text-gray-600 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100 whitespace-pre-wrap">{selectedReview.behavior_answers.q10}</p>
                      </div>
                    </div>
                  </div>

                  {/* Commitment answers */}
                  <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5">
                    <h4 className="font-black text-red-500 uppercase tracking-wider text-[10px] border-b border-gray-50 pb-2">Phần 4: Đối chiếu tiêu chí & Cam kết</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="font-bold text-gray-800 leading-relaxed">[Q11] Điểm mạnh/yếu so với level tiếp theo:</div>
                        <p className="mt-1 text-gray-600 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100 whitespace-pre-wrap">{selectedReview.commitment_answers.q11}</p>
                      </div>
                      <div>
                        <div className="font-bold text-gray-800 leading-relaxed">[Q12] Cam kết hành động cụ thể ở kỳ tiếp theo:</div>
                        <p className="mt-1 text-gray-600 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100 whitespace-pre-wrap">{selectedReview.commitment_answers.q12}</p>
                      </div>
                      {selectedReview.commitment_answers.q13 && (
                        <div>
                          <div className="font-bold text-gray-800 leading-relaxed">[Q13] Đóng góp/Context muốn sếp biết thêm:</div>
                          <p className="mt-1 text-gray-600 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100 whitespace-pre-wrap">{selectedReview.commitment_answers.q13}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
