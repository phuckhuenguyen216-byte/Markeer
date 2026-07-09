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
  confirmed: boolean;
}

const DEFAULT_REVIEWERS = ["Anh Nhớ", "Lê Phi", "Tấn Phát", "Hoàng Yên", "Vũ Phước", "Diệp Hân", "Tấn Huy", "Hà Tiên", "Dương Mai", "a.Minh", "Thương"];

const DEFAULT_STEPS = [
  { id: 1, name: "Thông tin đối tượng" },
  { id: 2, name: "PHẦN 2: KPI & OUTPUT" },
  { id: 3, name: "PHẦN 3: CHẤT LƯỢNG & NĂNG LỰC" },
  { id: 4, name: "PHẦN 4: BEHAVIOR & THÁI ĐỘ" },
  { id: 5, name: "PHẦN 5: SẴN SÀNG LÊN LEVEL (Tối đa 15 điểm)" },
  { id: 6, name: "PHẦN 6: LEADER TỰ ĐÁNH GIÁ" },
  { id: 7, name: "Xác nhận & Gửi" }
];

const DEFAULT_QUESTIONS = [
  { id: "default-q1", section_index: 2, section_title: "PHẦN 2: KPI & OUTPUT", question_text: "Tỷ lệ hoàn thành deliverable checklist", question_type: "scale", options: { min: 1, max: 10, minLabel: "Tệ", maxLabel: "Xuất sắc" }, is_required: true, sort_order: 1 },
  { id: "default-q2", section_index: 2, section_title: "PHẦN 2: KPI & OUTPUT", question_text: "Evidence / Cross-check (Chất lượng 3 output quan trọng nhất)", question_type: "scale", options: { min: 1, max: 10, minLabel: "Không có evidence", maxLabel: "Chuẩn & evidence đầy đủ" }, is_required: true, sort_order: 2 },
  { id: "default-q3", section_index: 2, section_title: "PHẦN 2: KPI & OUTPUT", question_text: "Tiến độ & deadline cam kết", question_type: "scale", options: { min: 1, max: 10, minLabel: "Trễ và bị nhắc nhở nhiều nhưng không cải thiện", maxLabel: "Không trễ" }, is_required: true, sort_order: 3 },
  
  { id: "default-q4", section_index: 3, section_title: "PHẦN 3: CHẤT LƯỢNG & NĂNG LỰC", question_text: "Số lần phải sửa lại sau review", question_type: "scale", options: { min: 1, max: 10, minLabel: "Số lần nhiều", maxLabel: "Ít / Không cần sửa" }, is_required: true, sort_order: 1 },
  { id: "default-q5", section_index: 3, section_title: "PHẦN 3: CHẤT LƯỢNG & NĂNG LỰC", question_text: "Evidence", question_type: "text", options: [], is_required: true, sort_order: 2 },
  { id: "default-q6", section_index: 3, section_title: "PHẦN 3: CHẤT LƯỢNG & NĂNG LỰC", question_text: "Năng lực tự xử lý vs cần hỗ trợ", question_type: "scale", options: { min: 1, max: 10, minLabel: "Cần hỗ trợ liên tục", maxLabel: "Tự xử lý" }, is_required: true, sort_order: 3 },
  { id: "default-q7", section_index: 3, section_title: "PHẦN 3: CHẤT LƯỢNG & NĂNG LỰC", question_text: "Bàn giao đầy đủ (handover/runbook/doc)", question_type: "scale", options: { min: 1, max: 10, minLabel: "Không có", maxLabel: "Bàn giao đầy đủ" }, is_required: true, sort_order: 4 },
  
  { id: "default-q8", section_index: 4, section_title: "PHẦN 4: BEHAVIOR & THÁI ĐỘ", question_text: "Chủ động vượt scope — invisible work (việc ngoài KPI chính, hỗ trợ team, cải tiến quy trình)", question_type: "scale", options: { min: 1, max: 10, minLabel: "Không có", maxLabel: "Có evidence rõ, impact tốt" }, is_required: true, sort_order: 1 },
  { id: "default-q9", section_index: 4, section_title: "PHẦN 4: BEHAVIOR & THÁI ĐỘ", question_text: "Phản ứng với feedback & hành vi cải thiện", question_type: "scale", options: { min: 1, max: 10, minLabel: "Phòng thủ/né tránh", maxLabel: "Tiếp nhận & thay đổi có pattern" }, is_required: true, sort_order: 2 },
  { id: "default-q10", section_index: 4, section_title: "PHẦN 4: BEHAVIOR & THÁI ĐỘ", question_text: "Xử lý blocker & leo thang đúng lúc", question_type: "scale", options: { min: 1, max: 10, minLabel: "Hay bị block, phải nhắc liền tục", maxLabel: "Tự xử lý được + biết khi nào cần hỏi" }, is_required: true, sort_order: 3 },
  
  { id: "default-q11", section_index: 5, section_title: "PHẦN 5: SẴN SÀNG LÊN LEVEL (Tối đa 15 điểm)", question_text: "Đã đáp ứng tiêu chí deliverable của level tiếp theo chưa? (đối chiếu Career Ladder theo track)", question_type: "scale", options: { min: 1, max: 10, minLabel: "Xem xét loại hoặc cần cải thiện nhiều", maxLabel: "Hoàn toàn đáp ứng" }, is_required: true, sort_order: 1 },
  { id: "default-q12", section_index: 5, section_title: "PHẦN 5: SẴN SÀNG LÊN LEVEL (Tối đa 15 điểm)", question_text: "Cam kết kỳ tiếp: cụ thể, đo được, có ownership rõ không?", question_type: "scale", options: { min: 1, max: 10, minLabel: "Không có", maxLabel: "Cam kết cụ thể + ownership rõ" }, is_required: true, sort_order: 2 },
  { id: "default-q13", section_index: 5, section_title: "PHẦN 5: SẴN SÀNG LÊN LEVEL (Tối đa 15 điểm)", question_text: "RED FLAG GATE — Có vi phạm nghiêm trọng (L4-) trong kỳ này không?", question_type: "scale", options: { min: 1, max: 10, minLabel: "Loại", maxLabel: "Không có vi phạm" }, is_required: true, sort_order: 3 },
  
  { id: "default-q14", section_index: 6, section_title: "PHẦN 6: LEADER TỰ ĐÁNH GIÁ", question_text: "Bạn đã hỗ trợ member tốt ở điểm nào trong kỳ này? (VD: Code review kịp, 1-on-1 đều, giao task rõ scope...)", question_type: "text", options: [], is_required: true, sort_order: 1 },
  { id: "default-q15", section_index: 6, section_title: "PHẦN 6: LEADER TỰ ĐÁNH GIÁ", question_text: "Bạn còn thiếu ở đâu khi hỗ trợ member? (VD: Chưa set kỳ vọng rõ đầu sprint, ít feedback giữa kỳ...)", question_type: "text", options: [], is_required: true, sort_order: 2 },
  { id: "default-q16", section_index: 6, section_title: "PHẦN 6: LEADER TỰ ĐÁNH GIÁ", question_text: "Kỳ này có thay đổi lớn nào ảnh hưởng đến member không? (VD: Chuyển team, scope đổi giữa chừng, thiếu resource...)", question_type: "text", options: [], is_required: true, sort_order: 3 }
];

const INITIAL_REVIEWERS: AssignedReviewers = {};
DEFAULT_REVIEWERS.forEach((name) => {
  INITIAL_REVIEWERS[name] = { leader: false, mentor: false };
});

const EMPTY_FORM: LeaderReviewForm = {
  member_name: "",
  current_level: "",
  target_level: "",
  review_period: "",
  assigned_mentors_leaders: INITIAL_REVIEWERS,
  management_time: "",
  confirmed: false,
};

const LEVELS = ["L1 - Seed Intern", "L2 - Growth Intern", "L3 - Strong Intern", "L4 - Fresher Talent", "L5 - Core team", "L6 - Presales"];
const TARGET_LEVELS = ["L1 - Seed Intern", "L2 - Growth Intern", "L3 - Strong Intern", "L4 - Fresher Talent", "L5 - Core team", "L6 - Presales", "L7 - Sales", "L8 - Leader"];

export default function LeaderReviewPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<LeaderReviewForm>(EMPTY_FORM);
  const [questions, setQuestions] = useState<any[]>(DEFAULT_QUESTIONS);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [steps, setSteps] = useState<any[]>(DEFAULT_STEPS);
  const [reviewersList, setReviewersList] = useState<string[]>(DEFAULT_REVIEWERS);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [csrfToken, setCsrfToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const maxStep = steps.length || 7;

  // Initialize answers for default questions
  useEffect(() => {
    const initialAnswers: Record<string, string> = {};
    DEFAULT_QUESTIONS.forEach((q) => {
      initialAnswers[q.id] = "";
    });
    setAnswers(initialAnswers);
  }, []);

  // Fetch sections, questions + CSRF to override static defaults dynamically if available
  useEffect(() => {
    // Fetch CSRF
    fetch("/api/csrf-token")
      .then((res) => res.json())
      .then((data) => {
        if (data.token) setCsrfToken(data.token);
      })
      .catch((err) => console.error("Error fetching CSRF token:", err));

    // Fetch Reviewers from database
    fetch("/api/survey-review/reviewers")
      .then((res) => res.json())
      .then((data) => {
        if (data.reviewers && data.reviewers.length > 0) {
          const list = data.reviewers.map((r: any) => r.name);
          setReviewersList(list);
          const initialReviewers: AssignedReviewers = {};
          list.forEach((name: string) => {
            initialReviewers[name] = { leader: false, mentor: false };
          });
          setForm((prev) => ({ ...prev, assigned_mentors_leaders: initialReviewers }));
        }
      })
      .catch((err) => console.error("Error loading reviewers, fallback to static defaults:", err));

    // Fetch dynamic sections & questions in parallel
    Promise.all([
      fetch("/api/survey-review/sections?type=leader-review").then(res => res.json()),
      fetch("/api/survey-review/questions?type=leader-review").then(res => res.json())
    ]).then(([sectionsData, questionsData]) => {
      // 1. Build steps dynamically if loadedSections is not empty
      const loadedSections = sectionsData.sections || [];
      if (loadedSections.length > 0) {
        const dynamicSteps = loadedSections.map((sec: any) => ({
          id: sec.section_index,
          name: sec.section_title
        }));
        const maxDynamicIndex = loadedSections.reduce((max: number, sec: any) => Math.max(max, sec.section_index), 1);
        
        const builtSteps = [
          { id: 1, name: "Thông tin đối tượng" },
          ...dynamicSteps,
          { id: maxDynamicIndex + 1, name: "Xác nhận & Gửi" }
        ];
        setSteps(builtSteps);
      }

      // 2. Set questions if questionsData is not empty
      if (questionsData.questions && questionsData.questions.length > 0) {
        setQuestions(questionsData.questions);
        const initialAnswers: Record<string, string> = {};
        questionsData.questions.forEach((q: any) => {
          initialAnswers[q.id] = "";
        });
        setAnswers(initialAnswers);
      }
      setLoadingQuestions(false);
    }).catch((err) => {
      console.error("Error loading dynamic survey metadata, keeping static templates:", err);
      setLoadingQuestions(false);
    });
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

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    if (errors[questionId]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[questionId];
        return next;
      });
    }
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
    
    if (currentStep === 1) {
      return "Chào Leader! Hãy điền thông tin member và thời gian quản lý.";
    }
    if (currentStep === maxStep) {
      return "Nhấp xác nhận và lưu trữ đánh giá chéo.";
    }

    const activeStepObj = steps.find(s => s.id === currentStep);
    return `Bạn đang ở phần: ${activeStepObj?.name || ""}. Hãy đánh giá chi tiết nhé!`;
  };

  const validateAll = (): { hasErrors: boolean; firstStepWithError: number } => {
    const newErrors: Record<string, string> = {};

    // Step 1 validation
    if (!form.member_name.trim()) newErrors.member_name = "Tên member là bắt buộc";
    if (!form.current_level) newErrors.current_level = "Vui lòng chọn Level hiện tại";
    if (!form.target_level) newErrors.target_level = "Vui lòng chọn Level đề xuất";
    if (!form.review_period) newErrors.review_period = "Vui lòng chọn Kỳ xét";

    // Dynamic steps questions validation
    questions.forEach((q) => {
      const answerVal = answers[q.id] || "";
      if (q.is_required && !answerVal.trim()) {
        newErrors[q.id] = "Trường này là bắt buộc";
      }
    });

    // Last step validation
    if (!form.confirmed) newErrors.confirmed = "Vui lòng xác nhận trước khi nộp";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      let firstStep = maxStep;
      if (
        newErrors.member_name ||
        newErrors.current_level ||
        newErrors.target_level ||
        newErrors.review_period
      ) {
        firstStep = 1;
      } else {
        // Find first question step with error
        let lowestSection = maxStep;
        questions.forEach((q) => {
          if (newErrors[q.id] && q.section_index < lowestSection) {
            lowestSection = q.section_index;
          }
        });
        firstStep = lowestSection;
      }
      return { hasErrors: true, firstStepWithError: firstStep };
    }

    return { hasErrors: false, firstStepWithError: 0 };
  };

  const handleNext = () => {
    setSubmitError("");
    if (currentStep < maxStep) {
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

    const payload = {
      member_name: form.member_name,
      current_level: form.current_level,
      target_level: form.target_level,
      review_period: form.review_period,
      assigned_mentors_leaders: form.assigned_mentors_leaders,
      management_time: form.management_time,
      answers: questions.map((q) => ({
        section_index: q.section_index,
        section_title: q.section_title,
        question_text: q.question_text,
        question_type: q.question_type,
        answer: answers[q.id] || "",
      })),
    };

    try {
      const res = await fetch("/api/survey-review/leader-review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify(payload),
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
    questionId: string,
    value: string,
    leftLabel: string,
    rightLabel: string
  ) => {
    return (
      <div className="flex flex-col gap-2 mt-1">
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
                name={`scale-${questionId}`}
                checked={value === String(num)}
                onChange={() => handleAnswerChange(questionId, String(num))}
                className="sr-only"
              />
              <span className="text-xs">{num}</span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  const renderQuestionInput = (q: any) => {
    switch (q.question_type) {
      case "scale": {
        let config = { min: 1, max: 10, minLabel: "Tệ", maxLabel: "Xuất sắc" };
        try {
          const parsed = typeof q.options === "string" ? JSON.parse(q.options) : q.options;
          if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
            config = { ...config, ...parsed };
          }
        } catch {}
        return renderLinearScale(q.id, answers[q.id] || "", config.minLabel, config.maxLabel);
      }
      case "text":
        return (
          <input
            type="text"
            value={answers[q.id] || ""}
            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
            placeholder="Nhập ghi chú hoặc câu trả lời..."
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-red-400"
          />
        );
      case "textarea":
      default:
        return (
          <textarea
            rows={3}
            value={answers[q.id] || ""}
            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
            placeholder="Nhập câu trả lời chi tiết..."
            className="w-full rounded-xl border border-gray-200 bg-white p-3 text-xs font-semibold focus:outline-none focus:border-red-400"
          />
        );
    }
  };

  const currentStepQuestions = questions.filter((q) => q.section_index === currentStep);

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
              {steps.map((step) => {
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
                      Phần {currentStep} trên {maxStep}
                    </span>
                    <h2 className="mt-1 text-xl font-black text-gray-900 tracking-tight">
                      {steps[currentStep - 1]?.name || ""}
                    </h2>
                  </div>

                  {submitError && (
                    <div className="mb-5 flex gap-2 rounded-xl bg-red-50 border border-red-200 p-3.5 text-red-800 text-xs font-bold">
                      <AlertCircle size={16} className="shrink-0" />
                      <div>{submitError}</div>
                    </div>
                  )}

                  {loadingQuestions && currentStep > 1 && currentStep < maxStep && questions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400 font-bold text-xs gap-2">
                      <Loader2 className="animate-spin text-red-500" size={24} />
                      <span>Đang tải câu hỏi đánh giá...</span>
                    </div>
                  ) : (
                    <>
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
                              placeholder="Ví dụ: 3 tháng, 6 tháng..."
                              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold focus:outline-none"
                            />
                          </div>

                          {/* Reviewers select */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-700">Leader / Reviewer phụ trách đánh giá chéo</label>
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
                                  {reviewersList.map((name) => (
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

                      {/* DYNAMIC STEPS: Render questions dynamically */}
                      {currentStep > 1 && currentStep < maxStep && (
                        <div className="flex flex-col gap-4">
                          {currentStepQuestions.map((q) => (
                            <div key={q.id} className="flex flex-col gap-1.5">
                              <label className="text-xs font-bold text-gray-700 leading-relaxed">
                                {q.question_text} {q.is_required && <span className="text-red-500">*</span>}
                              </label>
                              {renderQuestionInput(q)}
                              {errors[q.id] && <span className="text-[10px] font-bold text-red-500">{errors[q.id]}</span>}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* LAST STEP: CONFIRM & SUBMIT */}
                      {currentStep === maxStep && (
                        <div className="flex flex-col gap-6 py-4">
                          <div className="rounded-2xl border border-gray-150 bg-white p-6 shadow-sm flex flex-col gap-3">
                            <h3 className="text-base font-black text-gray-800">Xác nhận đánh giá</h3>
                            <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                              Cám ơn bạn đã hoàn thành đánh giá chéo thành viên. Ý kiến của Leader vô cùng quan trọng đối với hội đồng xét duyệt thăng cấp level.
                            </p>

                            <label className="mt-2 flex items-start gap-2.5 text-xs font-bold text-gray-700 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={form.confirmed}
                                onChange={(e) => handleInputChange("confirmed", e.target.checked)}
                                className="mt-0.5 h-4 w-4 accent-red-500 rounded border-gray-300"
                              />
                              <span>Tôi xác nhận các đánh giá và chấm điểm trên là khách quan, chính xác dựa trên kết quả thực tế.</span>
                            </label>
                            {errors.confirmed && <span className="text-[10px] font-bold text-red-500">{errors.confirmed}</span>}
                          </div>
                        </div>
                      )}
                    </>
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
                      disabled={submitting || (loadingQuestions && currentStep > 1 && currentStep < maxStep && questions.length === 0)}
                      className="flex h-10 items-center gap-1.5 rounded-xl bg-red-500 px-5 text-xs font-bold text-white hover:bg-red-600 shadow-lg shadow-red-500/10 disabled:opacity-50"
                    >
                      {submitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <span>{currentStep === maxStep ? "Gửi đánh giá" : "Tiếp tục"}</span>
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
                    Gửi đánh giá thành công!
                  </h2>
                  <p className="mt-2 text-xs text-gray-500 font-semibold px-4 leading-relaxed">
                    Khảo sát đánh giá thành viên của bạn đã được ghi nhận. Hệ thống sẽ tổng hợp để xem xét nâng cấp level cho ứng viên.
                  </p>

                  <div className="mt-6 rounded-2xl border border-gray-150 bg-white p-5 text-left text-xs font-bold text-gray-700 flex flex-col gap-2">
                    <div className="flex justify-between border-b border-gray-50 pb-2">
                      <span className="text-gray-400">Tên Member:</span>
                      <span>{form.member_name}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-50 pb-2">
                      <span className="text-gray-400">Level hiện tại:</span>
                      <span>{form.current_level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Level đề xuất:</span>
                      <span>{form.target_level}</span>
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
