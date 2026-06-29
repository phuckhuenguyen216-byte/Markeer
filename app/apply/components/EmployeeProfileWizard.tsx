"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Phone,
  Mail,
  CreditCard,
  FileText,
  MapPin,
  Building,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  X,
  Lock,
  Heart,
  UploadCloud,
  Check,
  Loader2
} from "lucide-react";
import MascotGuide from "@/app/components/MascotGuide";
import type { MascotState } from "@/app/components/Mascot";

interface FormData {
  full_name: string;
  dob: string;
  gender: "Nam" | "Nữ" | "";
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
}

const EMPTY_FORM: FormData = {
  full_name: "",
  dob: "",
  gender: "",
  phone: "",
  personal_email: "",
  national_id: "",
  id_issue_date: "",
  id_issue_place: "",
  permanent_address: "",
  temporary_address: "",
  cccd_front_path: "",
  cccd_back_path: "",
  other_docs_path: "",
  team: "Tổng hợp",
  tax_code: "",
  insurance_code: "",
  health_insurance_code: "",
  bank_account: "",
  bank_name_branch: "",
};

const STEPS = [
  { id: 1, name: "Thông tin cơ bản" },
  { id: 2, name: "Giấy tờ & Cư trú" },
  { id: 3, name: "Bảo hiểm & Thuế" },
  { id: 4, name: "Tài khoản ngân hàng" },
];

export default function EmployeeProfileWizard({ onClose }: { onClose?: () => void }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [csrfToken, setCsrfToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Upload previews and states
  const [uploadingFront, setUploadingFront] = useState(false);
  const [uploadingBack, setUploadingBack] = useState(false);
  const [uploadingDocs, setUploadingDocs] = useState(false);
  
  const [frontPreview, setFrontPreview] = useState<string>("");
  const [backPreview, setBackPreview] = useState<string>("");
  const [docsFileName, setDocsFileName] = useState<string>("");

  const containerRef = useRef<HTMLDivElement>(null);
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);
  const docsInputRef = useRef<HTMLInputElement>(null);

  // Fetch CSRF Token on mount
  useEffect(() => {
    fetch("/api/csrf-token")
      .then((res) => res.json())
      .then((data) => {
        if (data.token) setCsrfToken(data.token);
      })
      .catch((err) => console.error("Error fetching CSRF token:", err));
  }, []);

  // Format Date Input auto slash insertion: DD/MM/YYYY
  const formatDatePicker = (val: string) => {
    const clean = val.replace(/[^0-9]/g, "");
    if (clean.length <= 2) return clean;
    if (clean.length <= 4) return `${clean.slice(0, 2)}/${clean.slice(2)}`;
    return `${clean.slice(0, 2)}/${clean.slice(2, 4)}/${clean.slice(4, 8)}`;
  };

  // Upload handler
  const handleFileUpload = async (file: File, type: "front" | "back" | "docs") => {
    const formData = new FormData();
    formData.append("file", file);

    // Create local object URL for instant preview
    const localUrl = URL.createObjectURL(file);
    if (type === "front") {
      setFrontPreview(localUrl);
      setUploadingFront(true);
    } else if (type === "back") {
      setBackPreview(localUrl);
      setUploadingBack(true);
    } else {
      setDocsFileName(file.name);
      setUploadingDocs(true);
    }

    try {
      const res = await fetch("/api/employee-profiles/upload", {
        method: "POST",
        headers: {
          "x-csrf-token": csrfToken,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Tải tệp lên thất bại");
      }

      setForm((prev) => {
        if (type === "front") return { ...prev, cccd_front_path: data.path };
        if (type === "back") return { ...prev, cccd_back_path: data.path };
        return { ...prev, other_docs_path: data.path };
      });

      // Clear the error for this field
      const fieldName = type === "front" ? "cccd_front_path" : type === "back" ? "cccd_back_path" : "other_docs_path";
      setErrors((prev) => {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });

    } catch (err: any) {
      console.error(err);
      alert(err.message || "Lỗi khi tải tệp lên.");
      // Reset preview on error
      if (type === "front") setFrontPreview("");
      else if (type === "back") setBackPreview("");
      else setDocsFileName("");
    } finally {
      if (type === "front") setUploadingFront(false);
      else if (type === "back") setUploadingBack(false);
      else setUploadingDocs(false);
    }
  };

  // Set Mascot State based on current step
  const getMascotState = (): MascotState => {
    if (submitted) return "success";
    if (submitError || Object.keys(errors).length > 0) return "warning";
    switch (currentStep) {
      case 1:
        return "greeting";
      case 2:
        return "thinking";
      case 3:
        return "focused";
      case 4:
        return "contact";
      default:
        return "idle";
    }
  };

  const getMascotMessage = (): string => {
    if (submitted) return "Tuyệt vời! Thông tin hồ sơ của bạn đã được lưu lại an toàn trên hệ thống.";
    if (submitError) return submitError;
    if (Object.keys(errors).length > 0) return "Có một số trường thông tin chưa hợp lệ. Bạn kiểm tra lại nhé.";
    switch (currentStep) {
      case 1:
        return "Chào bạn! Hãy nhập thông tin cá nhân cơ bản của mình để công ty bắt đầu làm thủ tục nhân sự nhé.";
      case 2:
        return "Hãy tải trực tiếp ảnh chụp 2 mặt CCCD và tài liệu đính kèm (nếu có). Mọi thông tin được mã hóa bảo mật tuyệt đối.";
      case 3:
        return "Thông tin thuế và bảo hiểm xã hội rất quan trọng để công ty thực hiện đầy đủ quyền lợi và nghĩa vụ pháp lý cho bạn.";
      case 4:
        return "Hãy điền chính xác thông tin tài khoản ngân hàng để bộ phận kế toán chi trả các khoản lương/phụ cấp đúng hạn nha.";
      default:
        return "Mình luôn ở đây để đồng hành cùng bạn.";
    }
  };

  const validateAll = (): { hasErrors: boolean; firstStepWithError: number } => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    // STEP 1 Validation
    if (!form.full_name.trim()) newErrors.full_name = "Họ và tên không được để trống";
    
    if (!form.dob.trim()) {
      newErrors.dob = "Ngày sinh không được để trống";
    } else if (!/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(form.dob.trim())) {
      newErrors.dob = "Định dạng ngày sinh phải là ngày/tháng/năm (DD/MM/YYYY)";
    }

    if (!form.gender) newErrors.gender = "Vui lòng chọn giới tính";
    
    if (!form.phone.trim()) {
      newErrors.phone = "Số điện thoại không được để trống";
    } else {
      const cleanedPhone = form.phone.replace(/[\s\-().]/g, "");
      if (!/^(0|\+84)\d{9,10}$/.test(cleanedPhone)) {
        newErrors.phone = "Số điện thoại không đúng định dạng";
      }
    }

    if (!form.personal_email.trim()) {
      newErrors.personal_email = "Email cá nhân không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.personal_email.trim())) {
      newErrors.personal_email = "Email không hợp lệ";
    }

    // STEP 2 Validation
    if (!form.national_id.trim()) newErrors.national_id = "Số CCCD/CMND không được để trống";
    
    if (!form.id_issue_date.trim()) {
      newErrors.id_issue_date = "Ngày cấp không được để trống";
    } else if (!/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(form.id_issue_date.trim())) {
      newErrors.id_issue_date = "Định dạng ngày cấp phải là ngày/tháng/năm (DD/MM/YYYY)";
    }

    if (!form.id_issue_place.trim()) newErrors.id_issue_place = "Nơi cấp không được để trống";
    if (!form.permanent_address.trim()) newErrors.permanent_address = "Địa chỉ thường trú không được để trống";
    if (!form.temporary_address.trim()) newErrors.temporary_address = "Địa chỉ tạm trú không được để trống";
    
    if (!form.cccd_front_path) newErrors.cccd_front_path = "Vui lòng tải ảnh mặt trước CCCD";
    if (!form.cccd_back_path) newErrors.cccd_back_path = "Vui lòng tải ảnh mặt sau CCCD";

    // STEP 3 Validation
    if (!form.tax_code.trim()) newErrors.tax_code = "Mã số thuế không được để trống";
    if (!form.insurance_code.trim()) newErrors.insurance_code = "Mã số BHXH không được để trống";
    if (!form.health_insurance_code.trim()) newErrors.health_insurance_code = "Mã thẻ BHYT không được để trống";

    // STEP 4 Validation
    if (!form.bank_account.trim()) newErrors.bank_account = "Số tài khoản không được để trống";
    if (!form.bank_name_branch.trim()) newErrors.bank_name_branch = "Tên ngân hàng & chi nhánh không được để trống";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Find the first step ID that contains an error
      let firstStep = 4;
      if (newErrors.full_name || newErrors.dob || newErrors.gender || newErrors.phone || newErrors.personal_email) {
        firstStep = 1;
      } else if (
        newErrors.national_id ||
        newErrors.id_issue_date ||
        newErrors.id_issue_place ||
        newErrors.permanent_address ||
        newErrors.temporary_address ||
        newErrors.cccd_front_path ||
        newErrors.cccd_back_path
      ) {
        firstStep = 2;
      } else if (newErrors.tax_code || newErrors.insurance_code || newErrors.health_insurance_code) {
        firstStep = 3;
      }
      return { hasErrors: true, firstStepWithError: firstStep };
    }

    return { hasErrors: false, firstStepWithError: 0 };
  };

  const handleNext = () => {
    setSubmitError("");
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
      containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    setSubmitError("");
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    const { hasErrors, firstStepWithError } = validateAll();
    
    if (hasErrors) {
      setCurrentStep(firstStepWithError);
      setSubmitError("Vui lòng hoàn thành đầy đủ thông tin bắt buộc trước khi gửi.");
      containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/employee-profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.errors?.join(". ") || data.error || "Gửi hồ sơ thất bại. Vui lòng thử lại.");
        return;
      }

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setSubmitError("Lỗi kết nối mạng. Vui lòng thử lại sau.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 p-4 backdrop-blur-sm sm:p-6 md:p-8">
      <div className="relative flex h-full max-h-[850px] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl md:flex-row">
        
        {/* Header Close button */}
        {!submitted && (
          <button
            onClick={onClose || (() => router.push("/"))}
            className="absolute top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors"
            title="Đóng"
          >
            <X size={20} />
          </button>
        )}

        {/* Mascot & Progress Sidebar (Hidden on Mobile) */}
        <div className="hidden w-80 shrink-0 flex-col justify-between border-r border-gray-100 bg-[#fbfbfd] p-8 md:flex">
          <div>
            <div className="flex items-center gap-2 font-bold text-gray-800">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span>MARKEE PROFILE SETUP</span>
            </div>
            
            {/* Steps Visual Indicator (Clickable to switch step) */}
            <div className="mt-8 flex flex-col gap-6">
              {STEPS.map((step) => {
                const isActive = step.id === currentStep;
                const isCompleted = step.id < currentStep || submitted;
                return (
                  <button
                    key={step.id}
                    onClick={() => !submitted && setCurrentStep(step.id)}
                    className="flex items-center gap-3 w-full text-left bg-transparent border-none p-0 cursor-pointer focus:outline-none"
                  >
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-xl font-bold text-xs transition-all ${
                        isActive
                          ? "bg-red-500 text-white shadow-md shadow-red-500/20 scale-105"
                          : isCompleted
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {isCompleted ? "✓" : step.id}
                    </div>
                    <span
                      className={`text-sm font-semibold transition-colors ${
                        isActive ? "text-gray-800 font-bold" : "text-gray-400"
                      }`}
                    >
                      {step.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Animated Mascot Guidance Card */}
          <div className="mt-8 flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <MascotGuide state={getMascotState()} size={110} interactive />
            <p className="mt-4 text-center text-xs font-semibold leading-relaxed text-gray-500">
              {getMascotMessage()}
            </p>
          </div>
        </div>

        {/* Main Content Area */}
        <div ref={containerRef} className="flex flex-1 flex-col overflow-y-auto bg-gray-50/50">
          <div className="flex-1 p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                  className="mx-auto max-w-xl"
                >
                  {/* Step Banner */}
                  <div className="mb-6">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-red-500">
                      Phần {currentStep} của 4
                    </span>
                    <h2 className="mt-1 text-2xl font-black text-gray-900 tracking-tight">
                      {STEPS[currentStep - 1].name}
                    </h2>
                    <p className="text-xs font-semibold text-gray-400 mt-0.5">
                      Vui lòng nhập đúng và đầy đủ thông tin để tiến hành làm hợp đồng.
                    </p>
                  </div>

                  {/* Errors Summary Banner */}
                  {Object.keys(errors).length > 0 && (
                    <div className="mb-6 flex gap-2 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-amber-800 text-xs font-semibold">
                      <AlertCircle size={16} className="shrink-0 mt-0.5" />
                      <div>
                        Vui lòng hoàn thành các thông tin được yêu cầu bên dưới để tiếp tục.
                      </div>
                    </div>
                  )}

                  {submitError && (
                    <div className="mb-6 flex gap-2 rounded-2xl bg-red-50 border border-red-200 p-4 text-red-800 text-xs font-semibold animate-pulse">
                      <AlertCircle size={16} className="shrink-0 mt-0.5" />
                      <div>{submitError}</div>
                    </div>
                  )}

                  {/* Form Step Contents */}
                  <div className="flex flex-col gap-5">
                    
                    {/* STEP 1: Basic Personal Info */}
                    {currentStep === 1 && (
                      <>
                        {/* Họ và tên */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                            <span>Họ và tên</span>
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={form.full_name}
                              onChange={(e) => handleInputChange("full_name", e.target.value)}
                              placeholder="Nguyễn Văn A"
                              className={`w-full rounded-xl border bg-white px-4 py-3 text-sm font-semibold transition-all focus:outline-none focus:ring-2 ${
                                errors.full_name
                                  ? "border-red-300 focus:ring-red-100"
                                  : "border-gray-200 focus:border-gray-400 focus:ring-gray-100"
                              }`}
                            />
                            <User size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          </div>
                          {errors.full_name && <span className="text-[11px] font-bold text-red-500">{errors.full_name}</span>}
                        </div>

                        {/* Ngày sinh & Giới tính */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                              <span>Ngày sinh</span>
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={form.dob}
                              onChange={(e) => handleInputChange("dob", formatDatePicker(e.target.value))}
                              placeholder="DD/MM/YYYY"
                              maxLength={10}
                              className={`w-full rounded-xl border bg-white px-4 py-3 text-sm font-semibold transition-all focus:outline-none focus:ring-2 ${
                                errors.dob
                                  ? "border-red-300 focus:ring-red-100"
                                  : "border-gray-200 focus:border-gray-400 focus:ring-gray-100"
                              }`}
                            />
                            {errors.dob && <span className="text-[11px] font-bold text-red-500">{errors.dob}</span>}
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                              <span>Giới tính</span>
                              <span className="text-red-500">*</span>
                            </label>
                            <div className="flex h-[46px] items-center gap-4 rounded-xl border border-gray-200 bg-white px-4">
                              <label className="flex items-center gap-2 text-sm font-bold text-gray-600 cursor-pointer">
                                <input
                                  type="radio"
                                  name="gender"
                                  checked={form.gender === "Nam"}
                                  onChange={() => handleInputChange("gender", "Nam")}
                                  className="accent-red-500 h-4 w-4"
                                />
                                Nam
                              </label>
                              <label className="flex items-center gap-2 text-sm font-bold text-gray-600 cursor-pointer">
                                <input
                                  type="radio"
                                  name="gender"
                                  checked={form.gender === "Nữ"}
                                  onChange={() => handleInputChange("gender", "Nữ")}
                                  className="accent-red-500 h-4 w-4"
                                />
                                Nữ
                              </label>
                            </div>
                            {errors.gender && <span className="text-[11px] font-bold text-red-500">{errors.gender}</span>}
                          </div>
                        </div>

                        {/* Số điện thoại */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                            <span>Số điện thoại</span>
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="tel"
                              value={form.phone}
                              onChange={(e) => handleInputChange("phone", e.target.value)}
                              placeholder="09xxxxxxxx"
                              className={`w-full rounded-xl border bg-white px-4 py-3 text-sm font-semibold transition-all focus:outline-none focus:ring-2 ${
                                errors.phone
                                  ? "border-red-300 focus:ring-red-100"
                                  : "border-gray-200 focus:border-gray-400 focus:ring-gray-100"
                              }`}
                            />
                            <Phone size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          </div>
                          {errors.phone && <span className="text-[11px] font-bold text-red-500">{errors.phone}</span>}
                        </div>

                        {/* Email cá nhân */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                            <span>Email cá nhân</span>
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="email"
                              value={form.personal_email}
                              onChange={(e) => handleInputChange("personal_email", e.target.value)}
                              placeholder="example@gmail.com"
                              className={`w-full rounded-xl border bg-white px-4 py-3 text-sm font-semibold transition-all focus:outline-none focus:ring-2 ${
                                errors.personal_email
                                  ? "border-red-300 focus:ring-red-100"
                                  : "border-gray-200 focus:border-gray-400 focus:ring-gray-100"
                              }`}
                            />
                            <Mail size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          </div>
                          <span className="text-[10px] font-medium text-gray-400">
                            * Vui lòng không sử dụng địa chỉ email do nhà trường cung cấp.
                          </span>
                          {errors.personal_email && <span className="text-[11px] font-bold text-red-500">{errors.personal_email}</span>}
                        </div>
                      </>
                    )}

                    {/* STEP 2: ID Documents & Residence (Direct Uploads) */}
                    {currentStep === 2 && (
                      <>
                        {/* Số CCCD & Ngày cấp */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                              <span>Số CCCD/CMND</span>
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={form.national_id}
                              onChange={(e) => handleInputChange("national_id", e.target.value)}
                              placeholder="Số CCCD gồm 12 chữ số"
                              className={`w-full rounded-xl border bg-white px-4 py-3 text-sm font-semibold transition-all focus:outline-none focus:ring-2 ${
                                errors.national_id
                                  ? "border-red-300 focus:ring-red-100"
                                  : "border-gray-200 focus:border-gray-400 focus:ring-gray-100"
                              }`}
                            />
                            {errors.national_id && <span className="text-[11px] font-bold text-red-500">{errors.national_id}</span>}
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                              <span>Ngày cấp</span>
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={form.id_issue_date}
                              onChange={(e) => handleInputChange("id_issue_date", formatDatePicker(e.target.value))}
                              placeholder="DD/MM/YYYY"
                              maxLength={10}
                              className={`w-full rounded-xl border bg-white px-4 py-3 text-sm font-semibold transition-all focus:outline-none focus:ring-2 ${
                                errors.id_issue_date
                                  ? "border-red-300 focus:ring-red-100"
                                  : "border-gray-200 focus:border-gray-400 focus:ring-gray-100"
                              }`}
                            />
                            {errors.id_issue_date && <span className="text-[11px] font-bold text-red-500">{errors.id_issue_date}</span>}
                          </div>
                        </div>

                        {/* Nơi cấp */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                            <span>Nơi cấp</span>
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={form.id_issue_place}
                            onChange={(e) => handleInputChange("id_issue_place", e.target.value)}
                            placeholder="Cục Cảnh sát Quản lý hành chính về trật tự xã hội"
                            className={`w-full rounded-xl border bg-white px-4 py-3 text-sm font-semibold transition-all focus:outline-none focus:ring-2 ${
                              errors.id_issue_place
                                ? "border-red-300 focus:ring-red-100"
                                : "border-gray-200 focus:border-gray-400 focus:ring-gray-100"
                            }`}
                          />
                          {errors.id_issue_place && <span className="text-[11px] font-bold text-red-500">{errors.id_issue_place}</span>}
                        </div>

                        {/* Địa chỉ thường trú */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                            <span>Địa chỉ thường trú</span>
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={form.permanent_address}
                              onChange={(e) => handleInputChange("permanent_address", e.target.value)}
                              placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                              className={`w-full rounded-xl border bg-white px-4 py-3 text-sm font-semibold transition-all focus:outline-none focus:ring-2 ${
                                errors.permanent_address
                                  ? "border-red-300 focus:ring-red-100"
                                  : "border-gray-200 focus:border-gray-400 focus:ring-gray-100"
                              }`}
                            />
                            <MapPin size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          </div>
                          <span className="text-[10px] font-medium text-gray-400">* Ghi đúng theo hộ khẩu/CCCD.</span>
                          {errors.permanent_address && <span className="text-[11px] font-bold text-red-500">{errors.permanent_address}</span>}
                        </div>

                        {/* Địa chỉ tạm trú */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                            <span>Địa chỉ tạm trú</span>
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={form.temporary_address}
                              onChange={(e) => handleInputChange("temporary_address", e.target.value)}
                              placeholder="Địa chỉ chỗ ở hiện tại của bạn"
                              className={`w-full rounded-xl border bg-white px-4 py-3 text-sm font-semibold transition-all focus:outline-none focus:ring-2 ${
                                errors.temporary_address
                                  ? "border-red-300 focus:ring-red-100"
                                  : "border-gray-200 focus:border-gray-400 focus:ring-gray-100"
                              }`}
                            />
                            <MapPin size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          </div>
                          <span className="text-[10px] font-medium text-gray-400">* Chỗ ở thực tế hiện tại để liên lạc khi cần.</span>
                          {errors.temporary_address && <span className="text-[11px] font-bold text-red-500">{errors.temporary_address}</span>}
                        </div>

                        {/* Direct File Uploads (2-sides CCCD and optional others) */}
                        <div className="flex flex-col gap-4">
                          <span className="text-xs font-bold text-gray-700">Tải tệp tin tài liệu cá nhân</span>
                          
                          {/* CCCD Front & Back side grid */}
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {/* CCCD Front Upload Box */}
                            <div className="flex flex-col gap-1">
                              <label className="text-[11px] font-bold text-gray-500">Mặt trước CCCD/CMND <span className="text-red-500">*</span></label>
                              <div
                                onClick={() => !uploadingFront && frontInputRef.current?.click()}
                                className={`relative flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-white p-3 transition-all hover:bg-gray-50/50 ${
                                  errors.cccd_front_path
                                    ? "border-red-300 bg-red-50/10"
                                    : form.cccd_front_path
                                    ? "border-emerald-300"
                                    : "border-gray-200 hover:border-red-400"
                                }`}
                              >
                                <input
                                  type="file"
                                  ref={frontInputRef}
                                  accept="image/png, image/jpeg, image/jpg"
                                  className="hidden"
                                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "front")}
                                />
                                {uploadingFront ? (
                                  <div className="flex flex-col items-center gap-2">
                                    <Loader2 className="h-6 w-6 animate-spin text-red-500" />
                                    <span className="text-[10px] font-bold text-gray-500">Đang tải lên...</span>
                                  </div>
                                ) : frontPreview ? (
                                  <div className="absolute inset-2 overflow-hidden rounded-xl">
                                    <img src={frontPreview} alt="CCCD Front Side" className="h-full w-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-xl">
                                      <span className="text-[11px] font-bold text-white">Đổi hình ảnh</span>
                                    </div>
                                  </div>
                                ) : form.cccd_front_path ? (
                                  <div className="flex flex-col items-center gap-1.5 text-emerald-500">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50">
                                      <Check size={18} />
                                    </div>
                                    <span className="text-[10px] font-bold">Đã tải lên thành công</span>
                                  </div>
                                ) : (
                                  <div className="flex flex-col items-center text-center">
                                    <UploadCloud size={24} className="text-gray-400" />
                                    <span className="mt-1 text-xs font-bold text-gray-600">Chọn hoặc thả ảnh vào</span>
                                    <span className="text-[9px] text-gray-400 font-semibold mt-0.5">Hỗ trợ JPG, PNG (tối đa 5MB)</span>
                                  </div>
                                )}
                              </div>
                              {errors.cccd_front_path && <span className="text-[10px] font-bold text-red-500 mt-1">{errors.cccd_front_path}</span>}
                            </div>

                            {/* CCCD Back Upload Box */}
                            <div className="flex flex-col gap-1">
                              <label className="text-[11px] font-bold text-gray-500">Mặt sau CCCD/CMND <span className="text-red-500">*</span></label>
                              <div
                                onClick={() => !uploadingBack && backInputRef.current?.click()}
                                className={`relative flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-white p-3 transition-all hover:bg-gray-50/50 ${
                                  errors.cccd_back_path
                                    ? "border-red-300 bg-red-50/10"
                                    : form.cccd_back_path
                                    ? "border-emerald-300"
                                    : "border-gray-200 hover:border-red-400"
                                }`}
                              >
                                <input
                                  type="file"
                                  ref={backInputRef}
                                  accept="image/png, image/jpeg, image/jpg"
                                  className="hidden"
                                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "back")}
                                />
                                {uploadingBack ? (
                                  <div className="flex flex-col items-center gap-2">
                                    <Loader2 className="h-6 w-6 animate-spin text-red-500" />
                                    <span className="text-[10px] font-bold text-gray-500">Đang tải lên...</span>
                                  </div>
                                ) : backPreview ? (
                                  <div className="absolute inset-2 overflow-hidden rounded-xl">
                                    <img src={backPreview} alt="CCCD Back Side" className="h-full w-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-xl">
                                      <span className="text-[11px] font-bold text-white">Đổi hình ảnh</span>
                                    </div>
                                  </div>
                                ) : form.cccd_back_path ? (
                                  <div className="flex flex-col items-center gap-1.5 text-emerald-500">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50">
                                      <Check size={18} />
                                    </div>
                                    <span className="text-[10px] font-bold">Đã tải lên thành công</span>
                                  </div>
                                ) : (
                                  <div className="flex flex-col items-center text-center">
                                    <UploadCloud size={24} className="text-gray-400" />
                                    <span className="mt-1 text-xs font-bold text-gray-600">Chọn hoặc thả ảnh vào</span>
                                    <span className="text-[9px] text-gray-400 font-semibold mt-0.5">Hỗ trợ JPG, PNG (tối đa 5MB)</span>
                                  </div>
                                )}
                              </div>
                              {errors.cccd_back_path && <span className="text-[10px] font-bold text-red-500 mt-1">{errors.cccd_back_path}</span>}
                            </div>
                          </div>

                          {/* Optional Other Documents Upload Box */}
                          <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-bold text-gray-500">Các tài liệu khác (Sơ yếu lý lịch, thẻ BHYT...) <span className="text-gray-400">(Tùy chọn)</span></label>
                            <div
                              onClick={() => !uploadingDocs && docsInputRef.current?.click()}
                              className={`relative flex h-24 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-white p-3 transition-all hover:bg-gray-50/50 ${
                                form.other_docs_path ? "border-emerald-300" : "border-gray-200 hover:border-red-400"
                              }`}
                            >
                              <input
                                type="file"
                                ref={docsInputRef}
                                accept="image/png, image/jpeg, image/jpg, application/pdf"
                                className="hidden"
                                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "docs")}
                              />
                              {uploadingDocs ? (
                                <div className="flex flex-col items-center gap-2">
                                  <Loader2 className="h-5 w-5 animate-spin text-red-500" />
                                  <span className="text-[9px] font-bold text-gray-500">Đang tải tài liệu lên...</span>
                                </div>
                              ) : docsFileName ? (
                                <div className="flex items-center gap-2 text-emerald-500">
                                  <FileText size={20} />
                                  <span className="text-xs font-bold truncate max-w-[200px]">{docsFileName}</span>
                                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50">
                                    <Check size={12} />
                                  </div>
                                </div>
                              ) : form.other_docs_path ? (
                                <div className="flex items-center gap-2 text-emerald-500">
                                  <FileText size={20} />
                                  <span className="text-xs font-bold">Tài liệu đã được đính kèm</span>
                                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50">
                                    <Check size={12} />
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 text-center text-gray-500">
                                  <UploadCloud size={20} className="text-gray-400" />
                                  <span className="text-xs font-bold">Bấm chọn tệp đính kèm (PDF, Ảnh...)</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* STEP 3: Insurance & Taxes */}
                    {currentStep === 3 && (
                      <>
                        {/* Mã số thuế cá nhân */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                            <span>Mã số Thuế cá nhân (MST)</span>
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={form.tax_code}
                            onChange={(e) => handleInputChange("tax_code", e.target.value)}
                            placeholder="Mã số thuế gồm 10 chữ số"
                            className={`w-full rounded-xl border bg-white px-4 py-3 text-sm font-semibold transition-all focus:outline-none focus:ring-2 ${
                              errors.tax_code
                                ? "border-red-300 focus:ring-red-100"
                                : "border-gray-200 focus:border-gray-400 focus:ring-gray-100"
                            }`}
                          />
                          {errors.tax_code && <span className="text-[11px] font-bold text-red-500">{errors.tax_code}</span>}
                        </div>

                        {/* Số sổ BHXH */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                            <span>Số sổ Bảo hiểm xã hội (BHXH)</span>
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={form.insurance_code}
                            onChange={(e) => handleInputChange("insurance_code", e.target.value)}
                            placeholder="Mã số BHXH gồm 10 chữ số"
                            className={`w-full rounded-xl border bg-white px-4 py-3 text-sm font-semibold transition-all focus:outline-none focus:ring-2 ${
                              errors.insurance_code
                                ? "border-red-300 focus:ring-red-100"
                                : "border-gray-200 focus:border-gray-400 focus:ring-gray-100"
                            }`}
                          />
                          {errors.insurance_code && <span className="text-[11px] font-bold text-red-500">{errors.insurance_code}</span>}
                        </div>

                        {/* Mã số thẻ BHYT */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                            <span>Mã số thẻ Bảo hiểm y tế (BHYT)</span>
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={form.health_insurance_code}
                            onChange={(e) => handleInputChange("health_insurance_code", e.target.value)}
                            placeholder="Mã số thẻ BHYT (ví dụ: GD479...)"
                            className={`w-full rounded-xl border bg-white px-4 py-3 text-sm font-semibold transition-all focus:outline-none focus:ring-2 ${
                              errors.health_insurance_code
                                ? "border-red-300 focus:ring-red-100"
                                : "border-gray-200 focus:border-gray-400 focus:ring-gray-100"
                            }`}
                          />
                          {errors.health_insurance_code && <span className="text-[11px] font-bold text-red-500">{errors.health_insurance_code}</span>}
                        </div>
                      </>
                    )}

                    {/* STEP 4: Bank Account Details */}
                    {currentStep === 4 && (
                      <>
                        {/* Số tài khoản */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                            <span>Số tài khoản</span>
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={form.bank_account}
                              onChange={(e) => handleInputChange("bank_account", e.target.value)}
                              placeholder="Nhập số tài khoản ngân hàng của bạn"
                              className={`w-full rounded-xl border bg-white px-4 py-3 text-sm font-semibold transition-all focus:outline-none focus:ring-2 ${
                                errors.bank_account
                                  ? "border-red-300 focus:ring-red-100"
                                  : "border-gray-200 focus:border-gray-400 focus:ring-gray-100"
                              }`}
                            />
                            <CreditCard size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          </div>
                          {errors.bank_account && <span className="text-[11px] font-bold text-red-500">{errors.bank_account}</span>}
                        </div>

                        {/* Tên ngân hàng - Chi nhánh mở thẻ */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                            <span>Tên ngân hàng - Chi nhánh mở thẻ</span>
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={form.bank_name_branch}
                              onChange={(e) => handleInputChange("bank_name_branch", e.target.value)}
                              placeholder="Ví dụ: Vietcombank - Chi nhánh Đà Nẵng"
                              className={`w-full rounded-xl border bg-white px-4 py-3 text-sm font-semibold transition-all focus:outline-none focus:ring-2 ${
                                errors.bank_name_branch
                                  ? "border-red-300 focus:ring-red-100"
                                  : "border-gray-200 focus:border-gray-400 focus:ring-gray-100"
                              }`}
                            />
                            <Building size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          </div>
                          {errors.bank_name_branch && <span className="text-[11px] font-bold text-red-500">{errors.bank_name_branch}</span>}
                        </div>

                        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm mt-2">
                          <div className="flex items-start gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 shrink-0">
                              <Lock size={16} />
                            </div>
                            <div>
                              <h4 className="text-xs font-black text-gray-800">Cam kết bảo mật thông tin</h4>
                              <p className="mt-1 text-[11px] leading-relaxed text-gray-400 font-semibold">
                                Mọi thông tin cá nhân và tài khoản của bạn sẽ được bảo mật tuyệt đối, chỉ sử dụng cho mục đích kế toán chi trả lương và ghi nhận nhân sự nội bộ tại công ty.
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                  </div>

                  {/* Wizard Navigation Action Controls */}
                  <div className="mt-8 flex justify-between gap-4 border-t border-gray-100 pt-6">
                    {currentStep > 1 ? (
                      <button
                        onClick={handleBack}
                        disabled={submitting}
                        className="flex h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        <ArrowLeft size={16} />
                        <span>Quay lại</span>
                      </button>
                    ) : (
                      <div />
                    )}

                    <button
                      onClick={handleNext}
                      disabled={submitting}
                      className="flex h-11 items-center gap-2 rounded-xl bg-red-500 px-6 text-sm font-bold text-white hover:bg-red-600 shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all disabled:opacity-50"
                    >
                      {submitting ? (
                        <span>Đang xử lý...</span>
                      ) : (
                        <>
                          <span>{currentStep === 4 ? "Gửi hồ sơ" : "Tiếp tục"}</span>
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* STEP SUCCESS VIEW */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mx-auto max-w-md text-center py-8"
                >
                  <div className="flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-xl shadow-emerald-500/25">
                      <CheckCircle2 size={36} />
                    </div>
                  </div>

                  <h2 className="mt-6 text-3xl font-black text-gray-900 tracking-tight">
                    Nhập hồ sơ thành công!
                  </h2>
                  <p className="mt-2 text-sm text-gray-500 font-semibold px-4">
                    Hồ sơ cá nhân của bạn đã được tiếp nhận. Ban nhân sự sẽ sớm xử lý và làm hợp đồng/thủ tục lương cho bạn.
                  </p>

                  {/* Profile Summary Card */}
                  <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
                      Tóm tắt thông tin đã gửi
                    </span>
                    <div className="mt-3 flex flex-col gap-2.5 text-xs font-bold text-gray-700">
                      <div className="flex justify-between border-b border-gray-50 pb-2">
                        <span className="text-gray-400">Họ và tên:</span>
                        <span>{form.full_name}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-50 pb-2">
                        <span className="text-gray-400">Số điện thoại:</span>
                        <span>{form.phone}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-50 pb-2">
                        <span className="text-gray-400">Email:</span>
                        <span className="lowercase">{form.personal_email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Ngày gửi:</span>
                        <span>{form.dob}</span>
                      </div>
                    </div>
                  </div>

                  {/* Return Home Button */}
                  <button
                    onClick={() => {
                      if (onClose) {
                        onClose();
                      } else {
                        router.push("/");
                      }
                    }}
                    className="mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gray-900 px-8 text-sm font-bold text-white hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/10"
                  >
                    <span>Quay về trang chủ</span>
                  </button>

                  <div className="mt-6 flex items-center justify-center gap-1 text-[10px] text-gray-400 font-semibold">
                    <span>Cám ơn bạn đã cung cấp thông tin</span>
                    <Heart size={10} className="text-red-500 fill-current" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
