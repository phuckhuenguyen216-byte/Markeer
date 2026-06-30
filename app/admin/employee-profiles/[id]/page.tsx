"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  User,
  Calendar,
  Phone,
  Mail,
  CreditCard,
  FileText,
  MapPin,
  Building,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  Edit2,
  Save,
  X,
  Image as ImageIcon,
  Download
} from "lucide-react";
import Spinner from "../../components/Spinner";
import ConfirmModal, { type ConfirmAction } from "../../components/ConfirmModal";
import { ToastStack, useToasts } from "../../components/Toast";

interface EmployeeProfile {
  id: string;
  full_name: string;
  dob: string;
  gender: string;
  phone: string;
  personal_email: string;
  national_id: string;
  id_issue_date: string;
  id_issue_place: string;
  permanent_address: string;
  temporary_address: string;
  cccd_front_path: string;
  cccd_back_path: string;
  other_docs_path: string;
  team: string;
  tax_code: string;
  insurance_code: string;
  health_insurance_code: string;
  bank_account: string;
  bank_name_branch: string;
  created_at: string;
  cccd_front_url?: string;
  cccd_back_url?: string;
  other_docs_url?: string;
}

const TEAMS = [
  "Tổng hợp",
  "Dev/DevOps",
  "AI",
  "Marketing",
  "Sales",
  "Infrastructure"
];

// Helper to format date display as DD/MM/YYYY
const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  if (dateStr.includes("/")) return dateStr; // Already in DD/MM/YYYY format
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    return `${match[3]}/${match[2]}/${match[1]}`;
  }
  return dateStr;
};

export default function EmployeeProfileDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { toasts, addToast } = useToasts();
  
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Edit Mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<EmployeeProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});

  const searchParams = useSearchParams();
  const startEdit = searchParams.get("edit") === "true";

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch(`/api/employee-profiles/${id}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProfile(data);
      setEditForm(data);
    } catch {
      addToast("Không thể tải thông tin hồ sơ nhân viên", "error");
      router.push("/admin/employee-profiles");
    } finally {
      setLoading(false);
    }
  }, [id, router, addToast]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile && startEdit) {
      setIsEditing(true);
    }
  }, [profile, startEdit]);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    addToast(`Đã sao chép: ${fieldName}`, "success");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDelete = async () => {
    if (!profile) return;
    setConfirmAction(null);
    setDeleting(true);
    try {
      const res = await fetch(`/api/employee-profiles/${profile.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      addToast(`Đã xóa hồ sơ của: ${profile.full_name}`, "success");
      router.push("/admin/employee-profiles");
    } catch {
      addToast("Lỗi khi xóa hồ sơ nhân sự", "error");
      setDeleting(false);
    }
  };

  const confirmDelete = () => {
    if (!profile) return;
    setConfirmAction({
      title: "Xóa hồ sơ nhân viên này?",
      desc: "Hành động này sẽ xóa vĩnh viễn hồ sơ của nhân viên và không thể hoàn tác.",
      detail: `${profile.full_name} - ${profile.personal_email}`,
      danger: true,
      onConfirm: handleDelete,
    });
  };

  // Format Date Input auto slash insertion: DD/MM/YYYY
  const formatDatePicker = (val: string) => {
    const clean = val.replace(/[^0-9]/g, "");
    if (clean.length <= 2) return clean;
    if (clean.length <= 4) return `${clean.slice(0, 2)}/${clean.slice(2)}`;
    return `${clean.slice(0, 2)}/${clean.slice(2, 4)}/${clean.slice(4, 8)}`;
  };

  const handleEditChange = (field: keyof EmployeeProfile, value: string) => {
    if (!editForm) return;
    setEditForm((prev) => prev ? { ...prev, [field]: value } : null);
    if (editErrors[field]) {
      setEditErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSave = async () => {
    if (!editForm) return;

    // Simple validation client side
    const errors: Record<string, string> = {};
    if (!editForm.full_name.trim()) errors.full_name = "Họ và tên là bắt buộc";
    if (!editForm.dob.trim()) {
      errors.dob = "Ngày sinh là bắt buộc";
    } else if (!/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(editForm.dob.trim())) {
      errors.dob = "Định dạng ngày sinh phải là DD/MM/YYYY";
    }
    if (!editForm.phone.trim()) errors.phone = "Số điện thoại là bắt buộc";
    if (!editForm.personal_email.trim()) errors.personal_email = "Email là bắt buộc";
    if (!editForm.national_id.trim()) errors.national_id = "CCCD là bắt buộc";
    if (!editForm.id_issue_date.trim()) {
      errors.id_issue_date = "Ngày cấp là bắt buộc";
    } else if (!/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(editForm.id_issue_date.trim())) {
      errors.id_issue_date = "Định dạng ngày cấp phải là DD/MM/YYYY";
    }
    if (!editForm.id_issue_place.trim()) errors.id_issue_place = "Nơi cấp là bắt buộc";
    if (!editForm.permanent_address.trim()) errors.permanent_address = "Địa chỉ thường trú là bắt buộc";
    if (!editForm.temporary_address.trim()) errors.temporary_address = "Địa chỉ tạm trú là bắt buộc";
    if (!editForm.tax_code.trim()) errors.tax_code = "MST là bắt buộc";
    if (!editForm.insurance_code.trim()) errors.insurance_code = "BHXH là bắt buộc";
    if (!editForm.health_insurance_code.trim()) errors.health_insurance_code = "BHYT là bắt buộc";
    if (!editForm.bank_account.trim()) errors.bank_account = "Số tài khoản là bắt buộc";
    if (!editForm.bank_name_branch.trim()) errors.bank_name_branch = "Ngân hàng là bắt buộc";

    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      addToast("Vui lòng sửa các trường thông tin lỗi", "error");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/employee-profiles/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.errors?.join(". ") || data.error || "Lỗi khi cập nhật hồ sơ");
      }

      setProfile(editForm);
      setIsEditing(false);
      addToast("Cập nhật thông tin nhân viên thành công", "success");
      fetchProfile(); // Reload to refresh signed URLs
    } catch (err: any) {
      console.error(err);
      addToast(err.message || "Lỗi cập nhật dữ liệu", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50/50">
        <Spinner />
      </div>
    );
  }

  if (!profile || !editForm) return null;

  return (
    <div className="flex flex-col gap-6 p-6 min-h-screen bg-gray-50/50">
      
      {/* Header Navigation */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200/50 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/admin/employee-profiles")}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-colors shadow-sm"
            title="Quay lại danh sách"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">
              {isEditing ? "Chỉnh sửa hồ sơ nhân sự" : "Chi tiết hồ sơ nhân sự"}
            </h1>
            <p className="text-xs font-semibold text-gray-400 mt-0.5">
              Nhân viên: {profile.full_name} · Phòng ban: <span className="font-bold text-gray-700">{profile.team}</span> · Ngày nộp: {formatDate(new Date(profile.created_at).toISOString())}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 px-5 text-sm font-bold shadow-sm transition-all disabled:opacity-50"
              >
                <Save size={16} />
                <span>{saving ? "Đang lưu..." : "Lưu thay đổi"}</span>
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditForm(profile);
                }}
                disabled={saving}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 px-5 text-sm font-bold transition-all disabled:opacity-50"
              >
                <X size={16} />
                <span>Hủy</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 px-5 text-sm font-bold shadow-sm transition-all"
              >
                <Edit2 size={16} />
                <span>Chỉnh sửa</span>
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 px-5 text-sm font-bold transition-all disabled:opacity-50"
              >
                <Trash2 size={16} />
                <span>{deleting ? "Đang xóa..." : "Xóa hồ sơ"}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Grid Layout of Data Sections */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        
        {/* Section 1: Basic Personal Info */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500">
              <User size={16} />
            </div>
            <h2 className="text-sm font-black text-gray-800 uppercase tracking-wider">
              1. Thông tin cá nhân cơ bản
            </h2>
          </div>

          <div className="flex flex-col gap-3.5">
            {/* Phân nhóm quản lý (Team Select for Admin) */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Phòng ban (Team)</span>
              {isEditing ? (
                <select
                  value={editForm.team}
                  onChange={(e) => handleEditChange("team", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-bold text-gray-800 focus:outline-none focus:border-gray-400"
                >
                  {TEAMS.map(team => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </select>
              ) : (
                <div className="flex items-center text-sm font-bold text-gray-800 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-extrabold">
                    Team {profile.team}
                  </span>
                </div>
              )}
            </div>

            {/* Họ và tên */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Họ và tên</span>
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    value={editForm.full_name}
                    onChange={(e) => handleEditChange("full_name", e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold"
                  />
                  {editErrors.full_name && <span className="text-[10px] text-red-500 font-bold">{editErrors.full_name}</span>}
                </div>
              ) : (
                <div className="flex items-center justify-between text-sm font-bold text-gray-800 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100">
                  <span>{profile.full_name}</span>
                  <button
                    onClick={() => copyToClipboard(profile.full_name, "Họ và tên")}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Ngày sinh */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Ngày sinh</span>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={editForm.dob}
                      onChange={(e) => handleEditChange("dob", formatDatePicker(e.target.value))}
                      placeholder="DD/MM/YYYY"
                      maxLength={10}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold"
                    />
                    {editErrors.dob && <span className="text-[10px] text-red-500 font-bold">{editErrors.dob}</span>}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-800 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100">
                    <Calendar size={14} className="text-gray-400" />
                    <span>{formatDate(profile.dob)}</span>
                  </div>
                )}
              </div>

              {/* Giới tính */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Giới tính</span>
                {isEditing ? (
                  <div className="flex items-center gap-4 h-[38px] rounded-xl border border-gray-200 px-3">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        checked={editForm.gender === "Nam"}
                        onChange={() => handleEditChange("gender", "Nam")}
                        className="accent-red-500 h-3.5 w-3.5"
                      />
                      Nam
                    </label>
                    <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        checked={editForm.gender === "Nữ"}
                        onChange={() => handleEditChange("gender", "Nữ")}
                        className="accent-red-500 h-3.5 w-3.5"
                      />
                      Nữ
                    </label>
                  </div>
                ) : (
                  <div className="flex items-center text-sm font-bold text-gray-800 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      profile.gender === "Nam" ? "bg-blue-50 text-blue-600" : "bg-pink-50 text-pink-600"
                    }`}>
                      {profile.gender}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Số điện thoại */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Số điện thoại</span>
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => handleEditChange("phone", e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold"
                  />
                  {editErrors.phone && <span className="text-[10px] text-red-500 font-bold">{editErrors.phone}</span>}
                </div>
              ) : (
                <div className="flex items-center justify-between text-sm font-bold text-gray-800 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100 font-mono">
                  <span>{profile.phone}</span>
                  <button
                    onClick={() => copyToClipboard(profile.phone, "Số điện thoại")}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Email cá nhân */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Email cá nhân</span>
              {isEditing ? (
                <div>
                  <input
                    type="email"
                    value={editForm.personal_email}
                    onChange={(e) => handleEditChange("personal_email", e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold lowercase"
                  />
                  {editErrors.personal_email && <span className="text-[10px] text-red-500 font-bold">{editErrors.personal_email}</span>}
                </div>
              ) : (
                <div className="flex items-center justify-between text-sm font-bold text-gray-800 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100 lowercase">
                  <span>{profile.personal_email}</span>
                  <button
                    onClick={() => copyToClipboard(profile.personal_email, "Email cá nhân")}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: ID Documents & Residence */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500">
              <MapPin size={16} />
            </div>
            <h2 className="text-sm font-black text-gray-800 uppercase tracking-wider">
              2. Giấy tờ tùy thân & Cư trú
            </h2>
          </div>

          <div className="flex flex-col gap-3.5">
            <div className="grid grid-cols-2 gap-4">
              {/* Số CCCD */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Số CCCD/CMND</span>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={editForm.national_id}
                      onChange={(e) => handleEditChange("national_id", e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold"
                    />
                    {editErrors.national_id && <span className="text-[10px] text-red-500 font-bold">{editErrors.national_id}</span>}
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-sm font-bold text-gray-800 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100 font-mono">
                    <span>{profile.national_id}</span>
                    <button
                      onClick={() => copyToClipboard(profile.national_id, "Số CCCD")}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Ngày cấp */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Ngày cấp</span>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={editForm.id_issue_date}
                      onChange={(e) => handleEditChange("id_issue_date", formatDatePicker(e.target.value))}
                      placeholder="DD/MM/YYYY"
                      maxLength={10}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold"
                    />
                    {editErrors.id_issue_date && <span className="text-[10px] text-red-500 font-bold">{editErrors.id_issue_date}</span>}
                  </div>
                ) : (
                  <div className="flex items-center text-sm font-bold text-gray-800 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100">
                    <span>{formatDate(profile.id_issue_date)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Nơi cấp */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Nơi cấp</span>
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    value={editForm.id_issue_place}
                    onChange={(e) => handleEditChange("id_issue_place", e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold"
                  />
                  {editErrors.id_issue_place && <span className="text-[10px] text-red-500 font-bold">{editErrors.id_issue_place}</span>}
                </div>
              ) : (
                <div className="text-sm font-bold text-gray-800 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100">
                  {profile.id_issue_place}
                </div>
              )}
            </div>

            {/* Địa chỉ thường trú */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Địa chỉ thường trú</span>
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    value={editForm.permanent_address}
                    onChange={(e) => handleEditChange("permanent_address", e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold"
                  />
                  {editErrors.permanent_address && <span className="text-[10px] text-red-500 font-bold">{editErrors.permanent_address}</span>}
                </div>
              ) : (
                <div className="text-sm font-bold text-gray-800 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100">
                  {profile.permanent_address}
                </div>
              )}
            </div>

            {/* Địa chỉ tạm trú */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Địa chỉ tạm trú</span>
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    value={editForm.temporary_address}
                    onChange={(e) => handleEditChange("temporary_address", e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold"
                  />
                  {editErrors.temporary_address && <span className="text-[10px] text-red-500 font-bold">{editErrors.temporary_address}</span>}
                </div>
              ) : (
                <div className="text-sm font-bold text-gray-800 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100">
                  {profile.temporary_address}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section: CCCD Photos & Attachment Display */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col gap-4 md:col-span-2">
          <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500">
              <ImageIcon size={16} />
            </div>
            <h2 className="text-sm font-black text-gray-800 uppercase tracking-wider">
              Tài liệu đính kèm (Ảnh CCCD & Giấy tờ liên quan)
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Mặt trước CCCD */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Mặt trước CCCD/CMND</span>
              {profile.cccd_front_url ? (
                <div className="relative group rounded-2xl border border-gray-200 overflow-hidden bg-gray-50 aspect-video flex items-center justify-center">
                  <img src={profile.cccd_front_url} alt="Mặt trước CCCD" className="h-full w-full object-contain" />
                  <a
                    href={profile.cccd_front_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg bg-black/60 text-white hover:bg-black/85 transition-colors shadow-md"
                    title="Mở tab mới"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              ) : (
                <div className="flex h-32 items-center justify-center rounded-2xl bg-gray-50 border border-gray-150 text-gray-400 text-xs font-bold">
                  Không tìm thấy ảnh mặt trước CCCD
                </div>
              )}
            </div>

            {/* Mặt sau CCCD */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Mặt sau CCCD/CMND</span>
              {profile.cccd_back_url ? (
                <div className="relative group rounded-2xl border border-gray-200 overflow-hidden bg-gray-50 aspect-video flex items-center justify-center">
                  <img src={profile.cccd_back_url} alt="Mặt sau CCCD" className="h-full w-full object-contain" />
                  <a
                    href={profile.cccd_back_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg bg-black/60 text-white hover:bg-black/85 transition-colors shadow-md"
                    title="Mở tab mới"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              ) : (
                <div className="flex h-32 items-center justify-center rounded-2xl bg-gray-50 border border-gray-150 text-gray-400 text-xs font-bold">
                  Không tìm thấy ảnh mặt sau CCCD
                </div>
              )}
            </div>
          </div>

          {/* Tài liệu đính kèm khác */}
          {profile.other_docs_path ? (
            <div className="mt-4 flex flex-col gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Tài liệu khác đính kèm</span>
              <div className="flex items-center justify-between text-sm font-bold bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 text-emerald-700">
                <div className="flex items-center gap-2">
                  <FileText size={16} />
                  <span className="text-xs truncate max-w-[280px] font-mono">
                    {profile.other_docs_path.split("/").pop()}
                  </span>
                </div>
                {profile.other_docs_url && (
                  <a
                    href={profile.other_docs_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 px-4 items-center gap-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm"
                  >
                    <Download size={12} />
                    <span>Tải về / Xem tài liệu</span>
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-2 text-center text-xs font-bold text-gray-400 py-2 border-t border-gray-50">
              Không có tài liệu khác đính kèm
            </div>
          )}
        </div>

        {/* Section 3: Insurance & Taxes */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500">
              <FileText size={16} />
            </div>
            <h2 className="text-sm font-black text-gray-800 uppercase tracking-wider">
              3. Thông tin Bảo hiểm & Thuế
            </h2>
          </div>

          <div className="flex flex-col gap-3.5">
            {/* MST */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Mã số thuế cá nhân (MST)</span>
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    value={editForm.tax_code}
                    onChange={(e) => handleEditChange("tax_code", e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold"
                  />
                  {editErrors.tax_code && <span className="text-[10px] text-red-500 font-bold">{editErrors.tax_code}</span>}
                </div>
              ) : (
                <div className="flex items-center justify-between text-sm font-bold text-gray-800 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100 font-mono">
                  <span>{profile.tax_code}</span>
                  <button
                    onClick={() => copyToClipboard(profile.tax_code, "Mã số thuế")}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* BHXH */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Số sổ Bảo hiểm xã hội (BHXH)</span>
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    value={editForm.insurance_code}
                    onChange={(e) => handleEditChange("insurance_code", e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold"
                  />
                  {editErrors.insurance_code && <span className="text-[10px] text-red-500 font-bold">{editErrors.insurance_code}</span>}
                </div>
              ) : (
                <div className="flex items-center justify-between text-sm font-bold text-gray-800 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100 font-mono">
                  <span>{profile.insurance_code}</span>
                  <button
                    onClick={() => copyToClipboard(profile.insurance_code, "Số sổ BHXH")}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* BHYT */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Mã số thẻ Bảo hiểm y tế (BHYT)</span>
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    value={editForm.health_insurance_code}
                    onChange={(e) => handleEditChange("health_insurance_code", e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold"
                  />
                  {editErrors.health_insurance_code && <span className="text-[10px] text-red-500 font-bold">{editErrors.health_insurance_code}</span>}
                </div>
              ) : (
                <div className="flex items-center justify-between text-sm font-bold text-gray-800 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100 font-mono">
                  <span>{profile.health_insurance_code}</span>
                  <button
                    onClick={() => copyToClipboard(profile.health_insurance_code, "Mã thẻ BHYT")}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 4: Bank Account Details */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500">
              <Building size={16} />
            </div>
            <h2 className="text-sm font-black text-gray-800 uppercase tracking-wider">
              4. Tài khoản ngân hàng
            </h2>
          </div>

          <div className="flex flex-col gap-3.5">
            {/* Số tài khoản */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Số tài khoản nhận lương</span>
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    value={editForm.bank_account}
                    onChange={(e) => handleEditChange("bank_account", e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold"
                  />
                  {editErrors.bank_account && <span className="text-[10px] text-red-500 font-bold">{editErrors.bank_account}</span>}
                </div>
              ) : (
                <div className="flex items-center justify-between text-sm font-bold text-gray-800 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100 font-mono text-base">
                  <span>{profile.bank_account}</span>
                  <button
                    onClick={() => copyToClipboard(profile.bank_account, "Số tài khoản")}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Ngân hàng & Chi nhánh */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Ngân hàng & Chi nhánh mở thẻ</span>
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    value={editForm.bank_name_branch}
                    onChange={(e) => handleEditChange("bank_name_branch", e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold"
                  />
                  {editErrors.bank_name_branch && <span className="text-[10px] text-red-500 font-bold">{editErrors.bank_name_branch}</span>}
                </div>
              ) : (
                <div className="flex items-center justify-between text-sm font-bold text-gray-800 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100">
                  <span>{profile.bank_name_branch}</span>
                  <button
                    onClick={() => copyToClipboard(profile.bank_name_branch, "Tên ngân hàng - Chi nhánh")}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

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
