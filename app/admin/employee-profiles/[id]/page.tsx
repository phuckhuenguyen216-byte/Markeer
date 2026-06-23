"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, User, Calendar, Phone, Mail, CreditCard, FileText, MapPin, Building, ShieldAlert, Copy, Check, Trash2, ExternalLink } from "lucide-react";
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
  documents_folder: string;
  tax_code: string;
  insurance_code: string;
  health_insurance_code: string;
  bank_account: string;
  bank_name_branch: string;
  created_at: string;
}

export default function EmployeeProfileDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { toasts, addToast } = useToasts();
  
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch(`/api/employee-profiles/${id}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProfile(data);
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
      addToast("Lỗi khi xóa hồ sơ", "error");
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

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50/50">
        <Spinner />
      </div>
    );
  }

  if (!profile) return null;

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
              Chi tiết hồ sơ nhân sự
            </h1>
            <p className="text-xs font-semibold text-gray-400 mt-0.5">
              Họ tên: {profile.full_name} · Ngày nộp: {new Date(profile.created_at).toLocaleDateString("vi-VN")}
            </p>
          </div>
        </div>

        <button
          onClick={confirmDelete}
          disabled={deleting}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 px-5 text-sm font-bold transition-all disabled:opacity-50"
        >
          <Trash2 size={16} />
          <span>{deleting ? "Đang xóa..." : "Xóa hồ sơ"}</span>
        </button>
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
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Họ và tên</span>
              <div className="flex items-center justify-between text-sm font-bold text-gray-800 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100">
                <span>{profile.full_name}</span>
                <button
                  onClick={() => copyToClipboard(profile.full_name, "Họ và tên")}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Ngày sinh</span>
                <div className="flex items-center gap-2 text-sm font-bold text-gray-800 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100">
                  <Calendar size={14} className="text-gray-400" />
                  <span>{profile.dob}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Giới tính</span>
                <div className="flex items-center text-sm font-bold text-gray-800 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    profile.gender === "Nam" ? "bg-blue-50 text-blue-600" : "bg-pink-50 text-pink-600"
                  }`}>
                    {profile.gender}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Số điện thoại</span>
              <div className="flex items-center justify-between text-sm font-bold text-gray-800 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100 font-mono">
                <span>{profile.phone}</span>
                <button
                  onClick={() => copyToClipboard(profile.phone, "Số điện thoại")}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Email cá nhân</span>
              <div className="flex items-center justify-between text-sm font-bold text-gray-800 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100 lowercase">
                <span>{profile.personal_email}</span>
                <button
                  onClick={() => copyToClipboard(profile.personal_email, "Email cá nhân")}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Copy size={14} />
                </button>
              </div>
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
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Số CCCD/CMND</span>
                <div className="flex items-center justify-between text-sm font-bold text-gray-800 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100 font-mono">
                  <span>{profile.national_id}</span>
                  <button
                    onClick={() => copyToClipboard(profile.national_id, "Số CCCD")}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Ngày cấp</span>
                <div className="flex items-center text-sm font-bold text-gray-800 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100">
                  <span>{profile.id_issue_date}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Nơi cấp</span>
              <div className="text-sm font-bold text-gray-800 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100">
                {profile.id_issue_place}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Địa chỉ thường trú</span>
              <div className="text-sm font-bold text-gray-800 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100">
                {profile.permanent_address}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Địa chỉ tạm trú</span>
              <div className="text-sm font-bold text-gray-800 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100">
                {profile.temporary_address}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Thư mục hồ sơ (Google Drive)</span>
              <div className="flex items-center justify-between text-sm font-bold bg-red-50/50 p-2.5 rounded-xl border border-red-100 text-red-700">
                <span className="truncate max-w-[280px] font-mono text-xs">{profile.documents_folder}</span>
                <div className="flex items-center gap-2">
                  <a
                    href={profile.documents_folder}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-7 px-3 items-center gap-1 rounded-lg bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-colors shadow-sm"
                  >
                    <span>Mở link</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>
          </div>
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
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Mã số thuế cá nhân (MST)</span>
              <div className="flex items-center justify-between text-sm font-bold text-gray-800 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100 font-mono">
                <span>{profile.tax_code}</span>
                <button
                  onClick={() => copyToClipboard(profile.tax_code, "Mã số thuế")}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Số sổ Bảo hiểm xã hội (BHXH)</span>
              <div className="flex items-center justify-between text-sm font-bold text-gray-800 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100 font-mono">
                <span>{profile.insurance_code}</span>
                <button
                  onClick={() => copyToClipboard(profile.insurance_code, "Số sổ BHXH")}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Mã số thẻ Bảo hiểm y tế (BHYT)</span>
              <div className="flex items-center justify-between text-sm font-bold text-gray-800 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100 font-mono">
                <span>{profile.health_insurance_code}</span>
                <button
                  onClick={() => copyToClipboard(profile.health_insurance_code, "Mã thẻ BHYT")}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Copy size={14} />
                </button>
              </div>
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
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Số tài khoản nhận lương</span>
              <div className="flex items-center justify-between text-sm font-bold text-gray-800 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100 font-mono text-base">
                <span>{profile.bank_account}</span>
                <button
                  onClick={() => copyToClipboard(profile.bank_account, "Số tài khoản")}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Ngân hàng & Chi nhánh mở thẻ</span>
              <div className="flex items-center justify-between text-sm font-bold text-gray-800 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100">
                <span>{profile.bank_name_branch}</span>
                <button
                  onClick={() => copyToClipboard(profile.bank_name_branch, "Tên ngân hàng - Chi nhánh")}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Copy size={14} />
                </button>
              </div>
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
