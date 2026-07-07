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
  X,
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

interface SelfReviewForm {
  full_name: string;
  team: string;
  team_other?: string;
  current_level: string;
  target_level: string;
  review_period: string;
  assigned_mentors_leaders: AssignedReviewers;
  confirmed: boolean;
}

const EMPTY_FORM: SelfReviewForm = {
  full_name: "",
  team: "",
  team_other: "",
  current_level: "",
  target_level: "",
  review_period: "",
  assigned_mentors_leaders: {},
  confirmed: false,
};

const TEAMS_LIST = ["Network", "System", "SOC", "Marketing", "Dev/DevOps", "Other"];
const LEVELS = ["L1 - Seed Intern", "L2 - Growth Intern", "L3 - Strong Intern", "L4 - Fresher Talent", "L5 - Core team"];
const TARGET_LEVELS = ["L1 - Seed Intern", "L2 - Growth Intern", "L3 - Strong Intern", "L4 - Fresher Talent", "L5 - Core team", "L6 - Presales"];
const REVIEWERS_LIST = ["Anh Nhớ", "Lê Phi", "Tấn Phát", "Hoàng Yên", "Vũ Phước", "Diệp Hân", "Tấn Huy", "Hà Tiên", "Dương Mai", "a.Minh", "Thương"];

const STEPS = [
  { id: 1, name: "Thông tin chung" },
  { id: 2, name: "KPI & Output" },
  { id: 3, name: "Chất lượng & Chuẩn nghề" },
  { id: 4, name: "Behavior & Thái độ" },
  { id: 5, name: "Đối chiếu tiêu chí" },
  { id: 6, name: "Xác nhận & Gửi" },
];

export default function SelfReviewPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<SelfReviewForm>(EMPTY_FORM);
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [csrfToken, setCsrfToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize reviewers & fetch questions + CSRF
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

    // Fetch dynamic questions
    fetch("/api/survey-review/questions?type=self-review")
      .then((res) => res.json())
      .then((data) => {
        if (data.questions) {
          setQuestions(data.questions);
          // Initialize answers dictionary
          const initialAnswers: Record<string, string> = {};
          data.questions.forEach((q: any) => {
            initialAnswers[q.id] = "";
          });
          setAnswers(initialAnswers);
        }
        setLoadingQuestions(false);
      })
      .catch((err) => {
        console.error("Error loading survey questions:", err);
        setLoadingQuestions(false);
      });
  }, []);

  const handleInputChange = (field: keyof SelfReviewForm, value: any) => {
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
    return currentStep === 1 ? "greeting" : "focused";
  };

  const getMascotMessage = (): string => {
    if (submitted) return "Cám ơn bạn đã gửi bản Self Review! Chúc bạn gặt hái kết quả tốt.";
    if (submitError) return submitError;
    if (Object.keys(errors).length > 0) return "Vui lòng hoàn thành các câu hỏi bắt buộc trước khi gửi.";
    switch (currentStep) {
      case 1:
        return "Chào bạn! Hãy điền đúng thông tin cá nhân và kỳ xét nâng level nhé.";
      case 2:
        return "Phần 1: Hãy mô tả thật chi tiết về KPI, output cốt lõi cùng bằng chứng (evidence) đi kèm.";
      case 3:
        return "Phần 2: Nêu rõ mức độ làm việc độc lập của bạn và chất lượng bàn giao tài liệu kỹ thuật.";
      case 4:
        return "Phần 3: Kể về thái độ ứng xử, tinh thần học hỏi cũng như cách bạn xử lý khó khăn trong kỳ.";
      case 5:
        return "Phần 4: Đối chiếu năng lực bản thân với Career Ladder và các cam kết hành động cụ thể tiếp theo.";
      default:
        return "Xác nhận tính trung thực của các câu trả lời rồi nộp bài khảo sát nhé.";
    }
  };

  const validateAll = (): { hasErrors: boolean; firstStepWithError: number } => {
    const newErrors: Record<string, string> = {};

    // Step 1 validation
    if (!form.full_name.trim()) newErrors.full_name = "Họ và tên là bắt buộc";
    if (!form.team) newErrors.team = "Vui lòng chọn Track / Team";
    if (form.team === "Other" && !form.team_other?.trim()) newErrors.team_other = "Vui lòng nhập tên Team khác";
    if (!form.current_level) newErrors.current_level = "Vui lòng chọn Level hiện tại";
    if (!form.target_level) newErrors.target_level = "Vui lòng chọn Level muốn lên";
    if (!form.review_period.trim()) newErrors.review_period = "Vui lòng nhập Kỳ review";

    // Dynamic steps 2-5 questions validation
    questions.forEach((q) => {
      const answerVal = answers[q.id] || "";
      if (q.is_required && !answerVal.trim()) {
        newErrors[q.id] = "Câu trả lời là bắt buộc";
      }
    });

    // Step 6 validation
    if (!form.confirmed) newErrors.confirmed = "Vui lòng xác nhận tính trung thực trước khi nộp";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      let firstStep = 6;
      if (
        newErrors.full_name ||
        newErrors.team ||
        newErrors.team_other ||
        newErrors.current_level ||
        newErrors.target_level ||
        newErrors.review_period
      ) {
        firstStep = 1;
      } else {
        // Find first question step with error
        let lowestSection = 6;
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
    if (currentStep < 6) {
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
      setSubmitError("Vui lòng điền đầy đủ các câu hỏi bắt buộc trước khi gửi.");
      containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    const payload = {
      full_name: form.full_name,
      team: form.team === "Other" ? `Other: ${form.team_other}` : form.team,
      current_level: form.current_level,
      target_level: form.target_level,
      review_period: form.review_period,
      assigned_mentors_leaders: form.assigned_mentors_leaders,
      answers: questions.map((q) => ({
        section_index: q.section_index,
        section_title: q.section_title,
        question_text: q.question_text,
        question_type: q.question_type,
        answer: answers[q.id] || "",
      })),
    };

    try {
      const res = await fetch("/api/survey-review/self-review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.errors?.join(". ") || data.error || "Gửi khảo sát thất bại. Vui lòng thử lại.");
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

  // Render question component based on its type
  const renderQuestionInput = (q: any) => {
    switch (q.question_type) {
      case "text":
        return (
          <input
            type="text"
            value={answers[q.id] || ""}
            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
            placeholder="Nhập câu trả lời cụ thể..."
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold focus:outline-none focus:border-red-400"
          />
        );
      case "radio": {
        let opts: string[] = [];
        try {
          opts = typeof q.options === "string" ? JSON.parse(q.options) : q.options;
        } catch {
          opts = Array.isArray(q.options) ? q.options : [];
        }
        return (
          <div className="flex flex-col gap-1 text-[11px] font-semibold text-gray-600">
            {opts.map((opt: string) => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer py-1">
                <input
                  type="radio"
                  name={`question-${q.id}`}
                  checked={answers[q.id] === opt}
                  onChange={() => handleAnswerChange(q.id, opt)}
                  className="accent-red-500 h-3.5 w-3.5"
                />
                {opt}
              </label>
            ))}
          </div>
        );
      }
      case "textarea":
      default:
        return (
          <textarea
            rows={3}
            value={answers[q.id] || ""}
            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
            placeholder="Nhập câu trả lời cụ thể..."
            className="w-full rounded-xl border border-gray-200 bg-white p-3 text-xs font-semibold focus:outline-none focus:border-red-400"
          />
        );
    }
  };

  const currentStepQuestions = questions.filter((q) => q.section_index === currentStep);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
      <div className="relative flex h-[780px] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-xl md:flex-row border border-gray-100">
        
        {/* Mascot Sidebar */}
        <div className="hidden w-80 shrink-0 flex-col justify-between border-r border-gray-100 bg-[#fbfbfd] p-8 md:flex">
          <div>
            <div className="flex items-center gap-2 font-bold text-gray-800">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span>MARKEE SURVEY PORTAL</span>
            </div>
            
            {/* Steps progress */}
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

          {/* Guide Mascot */}
          <div className="mt-6 flex flex-col items-center rounded-2xl border border-gray-150 bg-white p-4 shadow-sm">
            <MascotGuide state={getMascotState()} size={95} interactive />
            <p className="mt-3 text-center text-[10.5px] font-bold leading-relaxed text-gray-500">
              {getMascotMessage()}
            </p>
          </div>
        </div>

        {/* Main Content Form area */}
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
                      Phần {currentStep} trên 6
                    </span>
                    <h2 className="mt-1 text-xl font-black text-gray-900 tracking-tight animate-fade-in">
                      {STEPS[currentStep - 1].name}
                    </h2>
                  </div>

                  {submitError && (
                    <div className="mb-5 flex gap-2 rounded-xl bg-red-50 border border-red-200 p-3.5 text-red-800 text-xs font-bold animate-shake">
                      <AlertCircle size={16} className="shrink-0" />
                      <div>{submitError}</div>
                    </div>
                  )}

                  {loadingQuestions && currentStep > 1 && currentStep < 6 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400 font-bold text-xs gap-2">
                      <Loader2 className="animate-spin text-red-500" size={24} />
                      <span>Đang tải câu hỏi khảo sát...</span>
                    </div>
                  ) : (
                    <>
                      {/* STEP 1: Basic Info */}
                      {currentStep === 1 && (
                        <div className="flex flex-col gap-4">
                          {/* Name */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-700">Họ và tên <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              value={form.full_name}
                              onChange={(e) => handleInputChange("full_name", e.target.value)}
                              placeholder="Nguyễn Văn A"
                              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-red-400"
                            />
                            {errors.full_name && <span className="text-[10px] font-bold text-red-500">{errors.full_name}</span>}
                          </div>

                          {/* Team Radio list */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-700">Track / Team <span className="text-red-500">*</span></label>
                            <div className="grid grid-cols-2 gap-2">
                              {TEAMS_LIST.map((t) => (
                                <label key={t} className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-600 cursor-pointer hover:bg-gray-50">
                                  <input
                                    type="radio"
                                    name="team"
                                    checked={form.team === t}
                                    onChange={() => handleInputChange("team", t)}
                                    className="accent-red-500"
                                  />
                                  {t}
                                </label>
                              ))}
                            </div>
                            {form.team === "Other" && (
                              <input
                                type="text"
                                value={form.team_other || ""}
                                onChange={(e) => handleInputChange("team_other", e.target.value)}
                                placeholder="Nhập tên Team khác của bạn"
                                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold focus:outline-none focus:border-red-400"
                              />
                            )}
                            {(errors.team || errors.team_other) && <span className="text-[10px] font-bold text-red-500">{errors.team || errors.team_other}</span>}
                          </div>

                          {/* Level Hiện tại & Muốn lên */}
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
                              <label className="text-xs font-bold text-gray-700">Level muốn lên <span className="text-red-500">*</span></label>
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

                          {/* Review period */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-700">Kỳ review level <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              value={form.review_period}
                              onChange={(e) => handleInputChange("review_period", e.target.value)}
                              placeholder="Tháng 04/2026"
                              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold focus:outline-none"
                            />
                            {errors.review_period && <span className="text-[10px] font-bold text-red-500">{errors.review_period}</span>}
                          </div>

                          {/* Assigned mentors table */}
                          <div className="flex flex-col gap-1.5 mt-2">
                            <label className="text-xs font-bold text-gray-700">Mentor / Leader phụ trách</label>
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

                      {/* DYNAMIC STEPS: Render questions dynamically */}
                      {currentStep > 1 && currentStep < 6 && (
                        <div className="flex flex-col gap-4">
                          {currentStep === 2 && (
                            <div className="rounded-xl bg-red-50/50 border border-red-100 p-3 text-[10.5px] leading-relaxed text-red-700 font-semibold mb-2">
                              <strong>Mẫu 3 dòng trả lời:</strong><br />
                              📌 Bối cảnh: (task gì, dự án gì, tình huống nào)<br />
                              📌 Tôi đã làm: (hành động cụ thể của bạn)<br />
                              📌 Kết quả / Bài học: (output, con số, hoặc rút ra được gì)
                            </div>
                          )}

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

                      {/* STEP 6: CONFIRM & SUBMIT */}
                      {currentStep === 6 && (
                        <div className="flex flex-col gap-6 py-4">
                          <div className="rounded-2xl border border-gray-150 bg-white p-6 shadow-sm flex flex-col gap-3">
                            <h3 className="text-base font-black text-gray-800">Xác nhận thông tin</h3>
                            <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                              Cám ơn bạn đã trả lời đầy đủ và trung thực. Công ty sẽ dựa vào bản tự đánh giá này và bảng đánh giá chéo của Mentor để đưa ra kết quả xét duyệt cuối cùng.
                            </p>

                            <label className="mt-2 flex items-start gap-2.5 text-xs font-bold text-gray-700 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={form.confirmed}
                                onChange={(e) => handleInputChange("confirmed", e.target.checked)}
                                className="mt-0.5 h-4 w-4 accent-red-500 rounded border-gray-300"
                              />
                              <span>Tôi xác nhận tất cả thông tin trên là trung thực và có evidence kèm theo.</span>
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
                      disabled={submitting || (loadingQuestions && currentStep > 1 && currentStep < 6)}
                      className="flex h-10 items-center gap-1.5 rounded-xl bg-red-500 px-5 text-xs font-bold text-white hover:bg-red-600 shadow-lg shadow-red-500/10 disabled:opacity-50"
                    >
                      {submitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <span>{currentStep === 6 ? "Gửi khảo sát" : "Tiếp tục"}</span>
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
                    Nộp Self Review thành công!
                  </h2>
                  <p className="mt-2 text-xs text-gray-500 font-semibold px-4 leading-relaxed">
                    Khảo sát tự đánh giá xét duyệt level của bạn đã được lưu lại thành công. Ban lãnh đạo và Mentor sẽ sớm xem xét thông tin của bạn.
                  </p>

                  <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-5 text-left text-xs font-bold text-gray-700 flex flex-col gap-2">
                    <div className="flex justify-between border-b border-gray-50 pb-2">
                      <span className="text-gray-400">Họ và tên:</span>
                      <span>{form.full_name}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-50 pb-2">
                      <span className="text-gray-400">Team / Track:</span>
                      <span>{form.team === "Other" ? form.team_other : form.team}</span>
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
                    <span>Cám ơn bạn đã hoàn thành khảo sát</span>
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
