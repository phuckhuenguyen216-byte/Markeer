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
  Calendar,
  Layers,
  Star
} from "lucide-react";

interface AnswerItem {
  section_index: number;
  section_title: string;
  question_text: string;
  question_type: string;
  answer: string;
}

interface LeaderReview {
  id: string;
  member_name: string;
  current_level: string;
  target_level: string;
  review_period: string;
  assigned_mentors_leaders: {
    [name: string]: {
      leader: boolean;
      mentor: boolean;
    };
  };
  management_time: string;
  answers: AnswerItem[];
  status: string;
  created_at: string;
}

export default function AdminLeaderReviewsPage() {
  const [reviews, setReviews] = useState<LeaderReview[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 15;

  const [selectedReview, setSelectedReview] = useState<LeaderReview | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<LeaderReview | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [page, search]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/survey-review/leader-review?search=${encodeURIComponent(search)}&page=${page}&limit=${limit}`);
      const data = await res.json();
      if (res.ok) {
        setReviews(data.reviews || []);
        setTotal(data.total || 0);
      }
    } catch (err) {
      console.error("Error fetching leader reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/survey-review/leader-review/${id}`, {
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
      const res = await fetch(`/api/survey-review/leader-review/${editForm.id}`, {
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

  const handleEditInputChange = (field: keyof LeaderReview, value: any) => {
    if (!editForm) return;
    setEditForm((prev) => prev ? { ...prev, [field]: value } : null);
  };

  const handleEditAnswerChange = (index: number, val: string) => {
    if (!editForm) return;
    const updatedAnswers = [...editForm.answers];
    updatedAnswers[index] = { ...updatedAnswers[index], answer: val };
    setEditForm({ ...editForm, answers: updatedAnswers });
  };

  const renderScoreBadge = (score: string) => {
    const num = parseInt(score);
    if (isNaN(num)) return <span className="text-gray-400">N/A</span>;
    let color = "bg-gray-100 text-gray-700";
    if (num >= 8) color = "bg-emerald-50 text-emerald-700 border border-emerald-100";
    else if (num >= 5) color = "bg-amber-50 text-amber-700 border border-amber-100";
    else color = "bg-rose-50 text-rose-700 border border-rose-100";

    return (
      <span className={`inline-flex items-center justify-center font-bold px-2 py-0.5 rounded text-[10px] ${color}`}>
        {num}/10
      </span>
    );
  };

  const renderScoreRow = (label: string, score: string) => {
    return (
      <div className="flex items-center justify-between border-b border-gray-50 py-1.5 last:border-b-0">
        <span className="text-gray-600 font-semibold">{label}</span>
        {renderScoreBadge(score)}
      </div>
    );
  };

  const totalPages = Math.ceil(total / limit);

  // Group selected review answers by section_title for rendering
  const getGroupedAnswers = (review: LeaderReview) => {
    const list = review.answers || [];
    const grouped: Record<string, AnswerItem[]> = {};
    list.forEach((ans) => {
      const title = ans.section_title || "PHẦN CÂU HỎI";
      if (!grouped[title]) {
        grouped[title] = [];
      }
      grouped[title].push(ans);
    });
    return grouped;
  };

  return (
    <div className="flex flex-col gap-6 p-1">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-800">Khảo sát Leader Review</h1>
          <p className="text-xs text-gray-500 font-semibold">Xem, chỉnh sửa và phê duyệt các bản khảo sát đánh giá năng lực từ Trưởng phòng</p>
        </div>

        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Tìm kiếm member..."
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
                <th className="px-5 py-3.5">Họ và tên Member</th>
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
                  <td colSpan={6} className="px-5 py-10 text-center text-gray-400 font-semibold">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-gray-300 mb-2" />
                    Đang tải danh sách khảo sát...
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-gray-400 font-semibold">
                    Không tìm thấy bài khảo sát nào.
                  </td>
                </tr>
              ) : (
                reviews.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/30 transition-all">
                    <td className="px-5 py-3.5 font-bold text-gray-800">{row.member_name}</td>
                    <td className="px-5 py-3.5">
                      <span className="rounded bg-gray-100 px-2 py-0.5 font-bold text-gray-600 text-[10px]">{row.current_level}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="rounded bg-blue-50 px-2 py-0.5 font-bold text-blue-600 text-[10px]">{row.target_level}</span>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-gray-600">
                      {row.review_period ? new Date(row.review_period).toLocaleDateString("vi-VN") : "N/A"}
                    </td>
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
                      <button
                        onClick={() => { setSelectedReview(row); setIsEditing(false); }}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-gray-900 transition-all hover:bg-gray-50 mx-auto"
                        title="Xem chi tiết"
                      >
                        <Eye size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
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

      {/* Details Slide-Over / Drawer */}
      {selectedReview && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-gray-900/40 backdrop-blur-sm">
          <div className="flex h-screen w-full max-w-3xl flex-col rounded-l-3xl bg-white shadow-2xl overflow-hidden border-l border-gray-150 animate-fade-in">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/50">
              <div>
                <h3 className="text-base font-black text-gray-800">
                  {isEditing ? "Chỉnh sửa khảo sát" : "Chi tiết Leader Review"}
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

            {/* Content area */}
            <div className="flex-1 overflow-y-auto p-6 text-xs leading-relaxed space-y-6">
              
              {/* Approval status actions */}
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

              {isEditing && editForm ? (
                // EDIT MODE
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-gray-500">Họ và tên Member</label>
                      <input
                        type="text"
                        value={editForm.member_name}
                        onChange={(e) => handleEditInputChange("member_name", e.target.value)}
                        className="rounded-lg border border-gray-200 px-3 py-1.5 font-semibold text-gray-800 focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-gray-500">Thời gian quản lý trực tiếp</label>
                      <input
                        type="text"
                        value={editForm.management_time}
                        onChange={(e) => handleEditInputChange("management_time", e.target.value)}
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
                      <label className="font-bold text-gray-500">Kỳ review (date)</label>
                      <input
                        type="date"
                        value={editForm.review_period}
                        onChange={(e) => handleEditInputChange("review_period", e.target.value)}
                        className="rounded-lg border border-gray-200 px-3 py-1.5 font-semibold text-gray-800 focus:outline-none"
                      />
                    </div>
                  </div>

                  <hr className="border-gray-150" />

                  {/* Answers dynamic editing */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-red-500 uppercase text-[10px] tracking-wider">Đánh giá câu trả lời của Leader</h4>
                    {editForm.answers && editForm.answers.map((ans, idx) => (
                      <div key={idx} className="flex flex-col gap-1.5">
                        <label className="font-bold text-gray-650 leading-relaxed">
                          {ans.question_text}
                        </label>
                        {ans.question_type === "textarea" ? (
                          <textarea
                            rows={3}
                            value={ans.answer || ""}
                            onChange={(e) => handleEditAnswerChange(idx, e.target.value)}
                            className="rounded-lg border border-gray-200 p-2 font-semibold text-gray-700 focus:outline-none"
                          />
                        ) : (
                          <input
                            type="text"
                            value={ans.answer || ""}
                            onChange={(e) => handleEditAnswerChange(idx, e.target.value)}
                            className="rounded-lg border border-gray-200 px-3 py-1.5 font-semibold text-gray-700 focus:outline-none"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                // VIEW DETAILS
                <div className="space-y-6">
                  {/* General Info Grid */}
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4 rounded-2xl border border-gray-100 bg-white p-5">
                    <div>
                      <span className="text-gray-400 font-bold">Tên Member:</span>
                      <div className="font-black text-sm text-gray-800 mt-0.5">{selectedReview.member_name}</div>
                    </div>
                    <div>
                      <span className="text-gray-400 font-bold">Thời gian quản lý trực tiếp:</span>
                      <div className="font-bold text-gray-700 mt-0.5">{selectedReview.management_time || "Chưa ghi nhận"}</div>
                    </div>
                    <div>
                      <span className="text-gray-400 font-bold">Level hiện tại / Đề xuất:</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="rounded bg-gray-100 px-2 py-0.5 font-bold text-gray-600 text-[10px]">{selectedReview.current_level}</span>
                        <span className="text-gray-300">→</span>
                        <span className="rounded bg-blue-50 px-2 py-0.5 font-bold text-blue-600 text-[10px]">{selectedReview.target_level}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400 font-bold">Kỳ xét / Ngày đánh giá:</span>
                      <div className="font-bold text-gray-700 mt-0.5">
                        {selectedReview.review_period ? new Date(selectedReview.review_period).toLocaleDateString("vi-VN") : "N/A"}{" "}
                        ({new Date(selectedReview.created_at).toLocaleDateString("vi-VN")})
                      </div>
                    </div>
                  </div>

                  {/* Leader/Reviewer checklist */}
                  <div className="space-y-2">
                    <h4 className="font-black text-gray-800 uppercase tracking-wider text-[10px]">Leader / Reviewer đánh giá</h4>
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

                  {/* Dynamic sections rendering */}
                  {Object.entries(getGroupedAnswers(selectedReview)).map(([sectionTitle, list]) => {
                    const hasScale = list.some((ans) => ans.question_type === "scale");

                    if (hasScale) {
                      return (
                        <div key={sectionTitle} className="rounded-2xl border border-gray-100 bg-white p-5 space-y-3">
                          <h4 className="font-black text-red-500 uppercase tracking-wider text-[10px] border-b border-gray-50 pb-2">
                            {sectionTitle}
                          </h4>
                          {list.map((ans, idx) => (
                            <div key={idx}>
                              {ans.question_type === "scale" ? (
                                renderScoreRow(ans.question_text, ans.answer)
                              ) : (
                                <div className="mt-2 pt-2 border-t border-gray-50">
                                  <span className="text-gray-400 font-bold">{ans.question_text}:</span>
                                  <p className="mt-1 text-gray-700 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100 font-semibold">
                                    {ans.answer || <span className="text-gray-400 italic">Chưa nhập</span>}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      );
                    } else {
                      return (
                        <div key={sectionTitle} className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5">
                          <h4 className="font-black text-red-500 uppercase tracking-wider text-[10px] border-b border-gray-50 pb-2">
                            {sectionTitle}
                          </h4>
                          <div className="space-y-4">
                            {list.map((ans, idx) => (
                              <div key={idx} className="flex flex-col gap-1">
                                <div className="font-bold text-gray-800 leading-relaxed">{ans.question_text}</div>
                                <p className="mt-1 text-gray-600 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100 whitespace-pre-wrap">
                                  {ans.answer || <span className="text-gray-400 italic">Không có câu trả lời</span>}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
