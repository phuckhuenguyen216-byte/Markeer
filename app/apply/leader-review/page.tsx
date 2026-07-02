"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Lock,
  Heart,
  Loader2,
  Calendar,
  Layers,
  ChevronRight,
  FileText
} from "lucide-react";
import MascotGuide from "@/app/components/MascotGuide";
import type { MascotState } from "@/app/components/Mascot";

interface AssignedReviewers {
  [name: string]: {
    leader: boolean;
    mentor: boolean;
  };
}

interface LeaderReviewForm {
  member_name: string;
  current_level: string;
  target_level: string;
  review_period: string;
  assigned_mentors_leaders: AssignedReviewers;
  management_time: string;
  kpi_answers: {
    completion_rate: string; // 1-10
    evidence_quality: string; // 1-10
    deadline_progress: string; // 1-10
  };
  quality_answers: {
    rework_count: string; // 1-10
    evidence_text: string;
    independency: string; // 1-10
    handover_completion: string; // 1-10
  };
  behavior_answers: {
    scope_exceeding: string; // 1-10
    feedback_reaction: string; // 1-10
    blocker_handling: string; // 1-10
  };
  readiness_answers: {
    target_readiness: string; // 1-10
    commitment_clarity: string; // 1-10
    red_flag: string; // 1-10
  };
  self_eval_answers: {
    leader_support_positives: string;
    leader_support_negatives: string;
    external_factors: string;
  };
  confirmed: boolean;
}

const EMPTY_FORM: LeaderReviewForm = {
  member_name: "",
  current_level: "",
  target_level: "",
  review_period: "",
  assigned_mentors_leaders: {},
  management_time: "",
  kpi_answers: { completion_rate: "", evidence_quality: "", deadline_progress: "" },
  quality_answers: { rework_count: "", evidence_text: "", independency: "", handover_completion: "" },
  behavior_answers: { scope_exceeding: "", feedback_reaction: "", blocker_handling: "" },
  readiness_answers: { target_readiness: "", commitment_clarity: "", red_flag: "" },
  self_eval_answers: { leader_support_positives: "", leader_support_negatives: "", external_factors: "" },
  confirmed: false,
};

const LEVELS = ["L1 - Seed Intern", "L2 - Growth Intern", "L3 - Strong Intern", "L4 - Fresher Talent", "L5 - Core team", "L6 - Presales"];
const TARGET_LEVELS = ["L1 - Seed Intern", "L2 - Growth Intern", "L3 - Strong Intern", "L4 - Fresher Talent", "L5 - Core team", "L6 - Presales", "L7 - Sales", "L8 - Leader"];
const REVIEWERS_LIST = ["Anh Nhớ", "Lê Phi", "Tấn Phát", "Hoàng Yên", "Vũ Phước", "Diệp Hân", "Tấn Huy", "Hà Tiên", "Dương Mai", "a.Minh", "Thương"];

const STEPS = [
  { id: 1, name: "Thông tin đối tượng" },
  { id: 2, name: "KPI & Output" },
  { id: 3, name: "Chất lượng & Năng lực" },
  { id: 4, name: "Behavior & Thái độ" },
  { id: 5, name: "Sẵn sàng lên Level" },
  { id: 6, name: "Leader tự đánh giá" },
  { id: 7, name: "Xác nhận & Gửi" },
];

export default function LeaderReviewPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<LeaderReviewForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [csrfToken, setCsrfToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize reviewers checklist state on mount
  useEffect(() => {
    const initialReviewers: AssignedReviewers = {};
    REVIEWERS_LIST.forEach((name) => {
      initialReviewers[name] = { leader: false, mentor: false };
    });
    setForm((prev) => ({ ...prev, assigned_mentors_leaders: initialReviewers }));

    // Fetch CSRF
    fetch("/api/csrf-token")
      .then((res) => res.json())
      .then((data) => {
        if (data.token) setCsrfToken(data.token);
      })
      .catch((err) => console.error("Error fetching CSRF token:", err));
  }, []);

  const handleInputChange = (field: keyof LeaderReviewForm, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleKPIChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      kpi_answers: { ...prev.kpi_answers, [field]: value },
    }));
  };

  const handleQualityChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      quality_answers: { ...prev.quality_answers, [field]: value },
    }));
  };

  const handleBehaviorChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      behavior_answers: { ...prev.behavior_answers, [field]: value },
    }));
  };

  const handleReadinessChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      readiness_answers: { ...prev.readiness_answers, [field]: value },
    }));
  };

  const handleSelfEvalChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      self_eval_answers: { ...prev.self_eval_answers, [field]: value },
    }));
  };

  const handleReviewerCheck = (name: string, role: "leader" | "mentor", checked: boolean) => {
    setForm((prev) => {
      const updated = { ...prev.assigned_mentors_leaders };
      updated[name] = { ...updated[name], [role]: checked };
      return { ...prev, assigned_mentors_leaders: updated };
    });
  };

  const getMascotState = (): MascotState => {
    if (submitted) return "success";
    if (submitError || Object.keys(errors).length > 0) return "warning";
    return "thinking";
  };

  const getMascotMessage = (): string => {
    if (submitted) return "Đã ghi nhận đánh giá của Leader thành công!";
    if (submitError) return submitError;
    if (Object.keys(errors).length > 0) return "Vui lòng đánh giá đủ các tiêu chí chấm điểm bắt buộc.";
    switch (currentStep) {
      case 1:
        return "Chào Leader! Hãy điền thông tin member và thời gian quản lý.";
      case 2:
        return "Phần 2: Đánh giá hiệu suất hoàn thành checklist deliverable và evidence.";
      case 3:
        return "Phần 3: Chấm điểm chất lượng bàn giao tài liệu kỹ thuật và khả năng tự xử lý.";
      case 4:
        return "Phần 4: Chấm điểm thái độ tiếp thu feedback và xử lý blocker.";
      case 5:
        return "Phần 5: Đánh giá tính sẵn sàng lên level mới và kiểm tra vi phạm Red Flag.";
      case 6:
        return "Phần 6: Tự phản hồi về cách hỗ trợ member của mình kỳ qua.";
      default:
        return "Nhấp xác nhận và lưu trữ đánh giá chéo.";
    }
  };

  const validateAll = (): { hasErrors: boolean; firstStepWithError: number } => {
    const newErrors: Record<string, string> = {};

    // Step 1
    if (!form.member_name.trim()) newErrors.member_name = "Tên member là bắt buộc";
    if (!form.current_level) newErrors.current_level = "Vui lòng chọn Level hiện tại";
    if (!form.target_level) newErrors.target_level = "Vui lòng chọn Level đề xuất";
    if (!form.review_period) newErrors.review_period = "Vui lòng chọn Kỳ xét";

    // Step 2
    if (!form.kpi_answers.completion_rate) newErrors.completion_rate = "Vui lòng chọn Tỷ lệ hoàn thành";
    if (!form.kpi_answers.evidence_quality) newErrors.evidence_quality = "Vui lòng chọn chất lượng Evidence";
    if (!form.kpi_answers.deadline_progress) newErrors.deadline_progress = "Vui lòng chọn tiến độ deadline";

    // Step 3
    if (!form.quality_answers.rework_count) newErrors.rework_count = "Vui lòng chọn số lần rework";
    if (!form.quality_answers.evidence_text.trim()) newErrors.evidence_text = "Vui lòng nhập ghi chú Evidence";
    if (!form.quality_answers.independency) newErrors.independency = "Vui lòng chọn năng lực tự xử lý";
    if (!form.quality_answers.handover_completion) newErrors.handover_completion = "Vui lòng chọn mức độ bàn giao";

    // Step 4
    if (!form.behavior_answers.scope_exceeding) newErrors.scope_exceeding = "Vui lòng chọn điểm chủ động";
    if (!form.behavior_answers.feedback_reaction) newErrors.feedback_reaction = "Vui lòng chọn điểm thái độ";
    if (!form.behavior_answers.blocker_handling) newErrors.blocker_handling = "Vui lòng chọn điểm xử lý blocker";

    // Step 5
    if (!form.readiness_answers.target_readiness) newErrors.target_readiness = "Vui lòng chọn mức độ sẵn sàng";
    if (!form.readiness_answers.commitment_clarity) newErrors.commitment_clarity = "Vui lòng chọn mức độ cam kết";
    if (!form.readiness_answers.red_flag) newErrors.red_flag = "Vui lòng kiểm tra Red Flag";

    // Step 6
    if (!form.self_eval_answers.leader_support_positives.trim()) newErrors.leader_support_positives = "Vui lòng ghi nhận ưu điểm";
    if (!form.self_eval_answers.leader_support_negatives.trim()) newErrors.leader_support_negatives = "Vui lòng ghi nhận nhược điểm";

    // Step 7
    if (!form.confirmed) newErrors.confirmed = "Vui lòng xác nhận trước khi nộp";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      let firstStep = 7;
      if (newErrors.member_name || newErrors.current_level || newErrors.target_level || newErrors.review_period) {
        firstStep = 1;
      } else if (newErrors.completion_rate || newErrors.evidence_quality || newErrors.deadline_progress) {
        firstStep = 2;
      } else if (newErrors.rework_count || newErrors.evidence_text || newErrors.independency || newErrors.handover_completion) {
        firstStep = 3;
      } else if (newErrors.scope_exceeding || newErrors.feedback_reaction || newErrors.blocker_handling) {
        firstStep = 4;
      } else if (newErrors.target_readiness || newErrors.commitment_clarity || newErrors.red_flag) {
        firstStep = 5;
      } else if (newErrors.leader_support_positives || newErrors.leader_support_negatives) {
        firstStep = 6;
      }
      return { hasErrors: true, firstStepWithError: firstStep };
    }

    return { hasErrors: false, firstStepWithError: 0 };
  };

  const handleNext = () => {
    setSubmitError("");
    if (currentStep < 7) {
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
      setSubmitError("Vui lòng điền đầy đủ và đánh giá hết các mục bắt buộc.");
      containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/survey-review/leader-review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.errors?.join(". ") || data.error || "Gửi đánh giá thất bại. Vui lòng thử lại.");
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

  const renderLinearScale = (
    value: string,
    onChange: (val: string) => void,
    leftLabel: string,
    rightLabel: string
  ) => {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-[10px] font-bold text-gray-400 px-1 leading-relaxed">
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>
        <div className="flex items-center justify-between gap-1 bg-gray-50/50 p-2 rounded-xl border border-gray-100">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
            <label
              key={num}
              className={`flex flex-1 flex-col items-center justify-center py-1.5 rounded-lg cursor-pointer transition-all hover:bg-red-50/10 ${
                value === String(num) ? "bg-red-50 text-red-600 font-black shadow-sm" : "text-gray-500"
              }`}
            >
              <input
                type="radio"
                checked={value === String(num)}
                onChange={() => onChange(String(num))}
                className="sr-only"
              />
              <span className="text-xs">{num}</span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
      <div className="relative flex h-[780px] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-xl md:flex-row border border-gray-100">
        
        {/* Sidebar */}
        <div className="hidden w-80 shrink-0 flex-col justify-between border-r border-gray-100 bg-[#fbfbfd] p-8 md:flex">
          <div>
            <div className="flex items-center gap-2 font-bold text-gray-800">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span>LEADER EVALUATION</span>
            </div>
            
            {/* Steps Visual Indicator */}
            <div className="mt-8 flex flex-col gap-4">
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
                      className={`flex h-7 w-7 items-center justify-center rounded-lg font-bold text-xs transition-all ${
                        isActive
                          ? "bg-red-500 text-white shadow-md shadow-red-500/20"
                          : isCompleted
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {isCompleted ? "✓" : step.id}
                    </div>
                    <span
                      className={`text-xs font-bold transition-colors ${
                        isActive ? "text-gray-800" : "text-gray-400"
                      }`}
                    >
                      {step.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center rounded-2xl border border-gray-150 bg-white p-4 shadow-sm">
            <MascotGuide state={getMascotState()} size={95} interactive />
            <p className="mt-3 text-center text-[10.5px] font-bold leading-relaxed text-gray-500">
              {getMascotMessage()}
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div ref={containerRef} className="flex flex-1 flex-col overflow-y-auto bg-gray-50/50">
          <div className="flex-1 p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="mx-auto max-w-xl"
                >
                  <div className="mb-6">
                    <span className="text-xs font-black uppercase tracking-widest text-red-500">
                      Phần {currentStep} trên 7
                    </span>
                    <h2 className="mt-1 text-xl font-black text-gray-900 tracking-tight">
                      {STEPS[currentStep - 1].name}
                    </h2>
                  </div>

                  {submitError && (
                    <div className="mb-5 flex gap-2 rounded-xl bg-red-50 border border-red-200 p-3.5 text-red-800 text-xs font-bold">
                      <AlertCircle size={16} className="shrink-0" />
                      <div>{submitError}</div>
                    </div>
                  )}

                  {/* STEP 1: Basic Info */}
                  {currentStep === 1 && (
                    <div className="flex flex-col gap-4">
                      {/* Member name */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-700">Tên Member được review <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          value={form.member_name}
                          onChange={(e) => handleInputChange("member_name", e.target.value)}
                          placeholder="Họ và tên thành viên"
                          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-red-400"
                        />
                        {errors.member_name && <span className="text-[10px] font-bold text-red-500">{errors.member_name}</span>}
                      </div>

                      {/* Levels grid */}
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-gray-700">Level hiện tại <span className="text-red-500">*</span></label>
                          <select
                            value={form.current_level}
                            onChange={(e) => handleInputChange("current_level", e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-bold text-gray-700"
                          >
                            <option value="">-- Chọn level --</option>
                            {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                          </select>
                          {errors.current_level && <span className="text-[10px] font-bold text-red-500">{errors.current_level}</span>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-gray-700">Level đề xuất lên <span className="text-red-500">*</span></label>
                          <select
                            value={form.target_level}
                            onChange={(e) => handleInputChange("target_level", e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-bold text-gray-700"
                          >
                            <option value="">-- Chọn level --</option>
                            {TARGET_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                          </select>
                          {errors.target_level && <span className="text-[10px] font-bold text-red-500">{errors.target_level}</span>}
                        </div>
                      </div>

                      {/* Review Period (Date picker) */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-700">Kỳ xét duyệt <span className="text-red-500">*</span></label>
                        <input
                          type="date"
                          value={form.review_period}
                          onChange={(e) => handleInputChange("review_period", e.target.value)}
                          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 focus:outline-none"
                        />
                        {errors.review_period && <span className="text-[10px] font-bold text-red-500">{errors.review_period}</span>}
                      </div>

                      {/* Direct Management time */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-700">Thời gian quản lý trực tiếp</label>
                        <input
                          type="text"
                          value={form.management_time}
                          onChange={(e) => handleInputChange("management_time", e.target.value)}
                          placeholder="Ví dụ: 6 tháng, 1 năm..."
                          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold focus:outline-none"
                        />
                      </div>

                      {/* Assigned mentors checklist */}
                      <div className="flex flex-col gap-1.5 mt-2">
                        <label className="text-xs font-bold text-gray-700">Leader / Reviewer phụ trách</label>
                        <div className="rounded-xl border border-gray-150 bg-white overflow-hidden text-xs">
                          <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100 text-[10px] font-black uppercase text-gray-400">
                              <tr>
                                <th className="px-4 py-2">Họ tên</th>
                                <th className="px-4 py-2 text-center">Leader</th>
                                <th className="px-4 py-2 text-center">Mentor</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {REVIEWERS_LIST.map((name) => (
                                <tr key={name}>
                                  <td className="px-4 py-2 font-bold text-gray-700">{name}</td>
                                  <td className="px-4 py-2 text-center">
                                    <input
                                      type="checkbox"
                                      checked={form.assigned_mentors_leaders[name]?.leader || false}
                                      onChange={(e) => handleReviewerCheck(name, "leader", e.target.checked)}
                                      className="h-3.5 w-3.5 accent-red-500 cursor-pointer"
                                    />
                                  </td>
                                  <td className="px-4 py-2 text-center">
                                    <input
                                      type="checkbox"
                                      checked={form.assigned_mentors_leaders[name]?.mentor || false}
                                      onChange={(e) => handleReviewerCheck(name, "mentor", e.target.checked)}
                                      className="h-3.5 w-3.5 accent-red-500 cursor-pointer"
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: KPI & OUTPUT */}
                  {currentStep === 2 && (
                    <div className="flex flex-col gap-5">
                      {/* Q1 */}
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-700">Tỷ lệ hoàn thành deliverable checklist <span className="text-red-500">*</span></label>
                        {renderLinearScale(form.kpi_answers.completion_rate, (v) => handleKPIChange("completion_rate", v), "Tệ", "Xuất sắc")}
                        {errors.completion_rate && <span className="text-[10px] font-bold text-red-500">{errors.completion_rate}</span>}
                      </div>

                      {/* Q2 */}
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-700">Evidence / Cross-check (Chất lượng 3 output tốt nhất) <span className="text-red-500">*</span></label>
                        {renderLinearScale(form.kpi_answers.evidence_quality, (v) => handleKPIChange("evidence_quality", v), "Không có evidence", "Chuẩn & evidence đầy đủ")}
                        {errors.evidence_quality && <span className="text-[10px] font-bold text-red-500">{errors.evidence_quality}</span>}
                      </div>

                      {/* Q3 */}
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-700">Tiến độ & deadline cam kết <span className="text-red-500">*</span></label>
                        {renderLinearScale(form.kpi_answers.deadline_progress, (v) => handleKPIChange("deadline_progress", v), "Trễ & bị nhắc nhở nhiều", "Không trễ")}
                        {errors.deadline_progress && <span className="text-[10px] font-bold text-red-500">{errors.deadline_progress}</span>}
                      </div>
                    </div>
                  )}

                  {/* STEP 3: QUALITY & ABILITY */}
                  {currentStep === 3 && (
                    <div className="flex flex-col gap-4">
                      {/* Q4 */}
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-700">Số lần phải sửa lại sau review <span className="text-red-500">*</span></label>
                        {renderLinearScale(form.quality_answers.rework_count, (v) => handleQualityChange("rework_count", v), "Nhiều lần sửa", "Ít / Không cần sửa")}
                        {errors.rework_count && <span className="text-[10px] font-bold text-red-500">{errors.rework_count}</span>}
                      </div>

                      {/* Evidence text */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-700">Nhập ghi chú Evidence <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          value={form.quality_answers.evidence_text}
                          onChange={(e) => handleQualityChange("evidence_text", e.target.value)}
                          placeholder="Mô tả tóm tắt bằng chứng thực tế..."
                          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold focus:outline-none focus:border-red-400"
                        />
                        {errors.evidence_text && <span className="text-[10px] font-bold text-red-500">{errors.evidence_text}</span>}
                      </div>

                      {/* Q5 */}
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-700">Năng lực tự xử lý vs cần hỗ trợ <span className="text-red-500">*</span></label>
                        {renderLinearScale(form.quality_answers.independency, (v) => handleQualityChange("independency", v), "Cần hỗ trợ liên tục", "Tự xử lý")}
                        {errors.independency && <span className="text-[10px] font-bold text-red-500">{errors.independency}</span>}
                      </div>

                      {/* Q6 */}
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-700">Bàn giao đầy đủ (handover/runbook/doc) <span className="text-red-500">*</span></label>
                        {renderLinearScale(form.quality_answers.handover_completion, (v) => handleQualityChange("handover_completion", v), "Không có", "Bàn giao đầy đủ")}
                        {errors.handover_completion && <span className="text-[10px] font-bold text-red-500">{errors.handover_completion}</span>}
                      </div>
                    </div>
                  )}

                  {/* STEP 4: BEHAVIOR & ATTITUDE */}
                  {currentStep === 4 && (
                    <div className="flex flex-col gap-5">
                      {/* Q7 */}
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-700">Chủ động vượt scope — invisible work <span className="text-red-500">*</span></label>
                        {renderLinearScale(form.behavior_answers.scope_exceeding, (v) => handleBehaviorChange("scope_exceeding", v), "Không có", "Có evidence rõ, impact tốt")}
                        {errors.scope_exceeding && <span className="text-[10px] font-bold text-red-500">{errors.scope_exceeding}</span>}
                      </div>

                      {/* Q8 */}
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-700">Phản ứng với feedback & hành vi cải thiện <span className="text-red-500">*</span></label>
                        {renderLinearScale(form.behavior_answers.feedback_reaction, (v) => handleBehaviorChange("feedback_reaction", v), "Phòng thủ/né tránh", "Tiếp nhận & thay đổi tốt")}
                        {errors.feedback_reaction && <span className="text-[10px] font-bold text-red-500">{errors.feedback_reaction}</span>}
                      </div>

                      {/* Q9 */}
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-700">Xử lý blocker & leo thang đúng lúc <span className="text-red-500">*</span></label>
                        {renderLinearScale(form.behavior_answers.blocker_handling, (v) => handleBehaviorChange("blocker_handling", v), "Hay bị block, nhắc liên tục", "Tự xử lý + hỏi đúng lúc")}
                        {errors.blocker_handling && <span className="text-[10px] font-bold text-red-500">{errors.blocker_handling}</span>}
                      </div>
                    </div>
                  )}

                  {/* STEP 5: READINESS */}
                  {currentStep === 5 && (
                    <div className="flex flex-col gap-5">
                      {/* Q10 */}
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-700">Đã đáp ứng tiêu chí deliverable của level tiếp theo chưa? <span className="text-red-500">*</span></label>
                        {renderLinearScale(form.readiness_answers.target_readiness, (v) => handleReadinessChange("target_readiness", v), "Cần cải thiện nhiều", "Hoàn toàn đáp ứng")}
                        {errors.target_readiness && <span className="text-[10px] font-bold text-red-500">{errors.target_readiness}</span>}
                      </div>

                      {/* Q11 */}
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-700">Cam kết kỳ tiếp: cụ thể, đo được, có ownership rõ không? <span className="text-red-500">*</span></label>
                        {renderLinearScale(form.readiness_answers.commitment_clarity, (v) => handleReadinessChange("commitment_clarity", v), "Không có", "Cam kết cụ thể + rõ ràng")}
                        {errors.commitment_clarity && <span className="text-[10px] font-bold text-red-500">{errors.commitment_clarity}</span>}
                      </div>

                      {/* Q12 */}
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-700">RED FLAG GATE — Có vi phạm nghiêm trọng (L4-) kỳ này? <span className="text-red-500">*</span></label>
                        {renderLinearScale(form.readiness_answers.red_flag, (v) => handleReadinessChange("red_flag", v), "Có vi phạm (Loại)", "Không có vi phạm")}
                        {errors.red_flag && <span className="text-[10px] font-bold text-red-500">{errors.red_flag}</span>}
                      </div>
                    </div>
                  )}

                  {/* STEP 6: LEADER SUPPORT */}
                  {currentStep === 6 && (
                    <div className="flex flex-col gap-4">
                      {/* Strengths */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-700 leading-relaxed">
                          Bạn đã hỗ trợ member tốt ở điểm nào trong kỳ này? (Giao task rõ scope, 1-on-1 đều...) <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          rows={3}
                          value={form.self_eval_answers.leader_support_positives}
                          onChange={(e) => handleSelfEvalChange("leader_support_positives", e.target.value)}
                          placeholder="Mô tả cụ thể hành động hỗ trợ của bạn..."
                          className="w-full rounded-xl border border-gray-200 bg-white p-3 text-xs font-semibold focus:outline-none focus:border-red-400"
                        />
                        {errors.leader_support_positives && <span className="text-[10px] font-bold text-red-500">{errors.leader_support_positives}</span>}
                      </div>

                      {/* Improvements */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-700 leading-relaxed">
                          Bạn còn thiếu ở đâu khi hỗ trợ member? (Chưa set kỳ vọng rõ, thiếu feedback...) <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          rows={3}
                          value={form.self_eval_answers.leader_support_negatives}
                          onChange={(e) => handleSelfEvalChange("leader_support_negatives", e.target.value)}
                          placeholder="Mô tả cụ thể điểm cần cải thiện của Leader..."
                          className="w-full rounded-xl border border-gray-200 bg-white p-3 text-xs font-semibold focus:outline-none focus:border-red-400"
                        />
                        {errors.leader_support_negatives && <span className="text-[10px] font-bold text-red-500">{errors.leader_support_negatives}</span>}
                      </div>

                      {/* External factors */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-700 leading-relaxed">
                          Kỳ này có thay đổi lớn nào ảnh hưởng đến member không? (Chuyển team, thiếu resource...) <span className="text-gray-400">(Tùy chọn)</span>
                        </label>
                        <textarea
                          rows={3}
                          value={form.self_eval_answers.external_factors}
                          onChange={(e) => handleSelfEvalChange("external_factors", e.target.value)}
                          placeholder="Mô tả hoàn cảnh khách quan ảnh hưởng..."
                          className="w-full rounded-xl border border-gray-200 bg-white p-3 text-xs font-semibold focus:outline-none focus:border-red-400"
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 7: CONFIRM & SUBMIT */}
                  {currentStep === 7 && (
                    <div className="flex flex-col gap-5 py-4">
                      <div className="rounded-2xl border border-gray-150 bg-white p-6 shadow-sm flex flex-col gap-3">
                        <h3 className="text-base font-black text-gray-800">Cam kết & Gửi đánh giá</h3>
                        <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                          Vui lòng kiểm tra kỹ điểm số trước khi bấm gửi. Kết quả này sẽ được HR/Manager tổng hợp và KHÔNG chia sẻ trực tiếp bản đánh giá này cho member để đảm bảo tính bảo mật.
                        </p>

                        <label className="mt-2 flex items-start gap-2.5 text-xs font-bold text-gray-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={form.confirmed}
                            onChange={(e) => handleInputChange("confirmed", e.target.checked)}
                            className="mt-0.5 h-4 w-4 accent-red-500 rounded border-gray-300"
                          />
                          <span>Tôi xác nhận các đánh giá trên là khách quan, trung thực và có bằng chứng cụ thể.</span>
                        </label>
                        {errors.confirmed && <span className="text-[10px] font-bold text-red-500">{errors.confirmed}</span>}
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="mt-8 flex justify-between gap-4 border-t border-gray-100 pt-5">
                    {currentStep > 1 ? (
                      <button
                        onClick={handleBack}
                        disabled={submitting}
                        className="flex h-10 items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 text-xs font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <ArrowLeft size={14} />
                        <span>Quay lại</span>
                      </button>
                    ) : (
                      <div />
                    )}

                    <button
                      onClick={handleNext}
                      disabled={submitting}
                      className="flex h-10 items-center gap-1.5 rounded-xl bg-red-500 px-5 text-xs font-bold text-white hover:bg-red-600 shadow-lg shadow-red-500/10 disabled:opacity-50"
                    >
                      {submitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <span>{currentStep === 7 ? "Gửi đánh giá" : "Tiếp tục"}</span>
                          <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* Success View */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mx-auto max-w-md text-center py-12"
                >
                  <div className="flex justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                      <CheckCircle2 size={32} />
                    </div>
                  </div>

                  <h2 className="mt-6 text-2xl font-black text-gray-900 tracking-tight">
                    Nộp Leader Review thành công!
                  </h2>
                  <p className="mt-2 text-xs text-gray-500 font-semibold px-4 leading-relaxed">
                    Bản khảo sát đánh giá năng lực của member đã được lưu lại thành công. Ban lãnh đạo và ban nhân sự sẽ sớm tiến hành xem xét.
                  </p>

                  <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-5 text-left text-xs font-bold text-gray-700 flex flex-col gap-2">
                    <div className="flex justify-between border-b border-gray-50 pb-2">
                      <span className="text-gray-400">Tên Member:</span>
                      <span>{form.member_name}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-50 pb-2">
                      <span className="text-gray-400">Level đề xuất:</span>
                      <span>{form.target_level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Kỳ review:</span>
                      <span>{form.review_period}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => router.push("/")}
                    className="mt-8 inline-flex h-10 items-center justify-center rounded-xl bg-gray-900 px-6 text-xs font-bold text-white hover:bg-gray-800 transition-colors"
                  >
                    <span>Quay về trang chủ</span>
                  </button>

                  <div className="mt-5 flex items-center justify-center gap-1 text-[10px] text-gray-400 font-semibold">
                    <span>Cám ơn Leader đã đóng góp ý kiến</span>
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
