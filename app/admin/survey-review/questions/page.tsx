"use client";

import { useEffect, useState, useRef } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  HelpCircle,
  X,
  Check,
  AlertCircle,
  Loader2,
  Save,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  ChevronRight
} from "lucide-react";
import Spinner from "../../components/Spinner";
import ConfirmModal, { ConfirmAction } from "../../components/ConfirmModal";
import { ToastStack, useToasts } from "../../components/Toast";
import MascotGuide from "@/app/components/MascotGuide";
import type { MascotState } from "@/app/components/Mascot";

interface SurveyQuestion {
  id: string;
  survey_type: "self-review" | "leader-review";
  section_index: number;
  section_title: string;
  question_text: string;
  question_type: "text" | "textarea" | "radio" | "scale";
  options: any;
  is_required: boolean;
  sort_order: number;
}

interface SurveySection {
  id: string;
  survey_type: "self-review" | "leader-review";
  section_index: number;
  section_title: string;
}

interface SurveyReviewer {
  id: string;
  name: string;
  created_at: string;
}

export default function QuestionSettingsPage() {
  const [activeTab, setActiveTab] = useState<"self-review" | "leader-review" | "reviewers">("self-review");
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const [sections, setSections] = useState<SurveySection[]>([]);
  const [steps, setSteps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const { toasts, addToast } = useToasts();

  // Reset/Confirm actions
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [resetting, setResetting] = useState(false);

  // Question Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<SurveyQuestion | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Question Form State
  const [formSectionIndex, setFormSectionIndex] = useState(2);
  const [formSectionTitle, setFormSectionTitle] = useState("");
  const [formQuestionText, setFormQuestionText] = useState("");
  const [formQuestionType, setFormQuestionType] = useState<"text" | "textarea" | "radio" | "scale">("textarea");
  const [formIsRequired, setFormIsRequired] = useState(true);
  const [formSortOrder, setFormSortOrder] = useState(0);

  // Question Options configuration
  const [radioOptions, setRadioOptions] = useState<string[]>([]);
  const [newRadioOption, setNewRadioOption] = useState("");
  const [scaleMinLabel, setScaleMinLabel] = useState("Tệ");
  const [scaleMaxLabel, setScaleMaxLabel] = useState("Xuất sắc");

  // Section Modal State
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [editingSection, setEditingSection] = useState<SurveySection | null>(null);
  const [formSectionTitleInput, setFormSectionTitleInput] = useState("");
  const [sectionModalLoading, setSectionModalLoading] = useState(false);

  // Reviewers State
  const [reviewersList, setReviewersList] = useState<SurveyReviewer[]>([]);
  const [showReviewerModal, setShowReviewerModal] = useState(false);
  const [editingReviewer, setEditingReviewer] = useState<SurveyReviewer | null>(null);
  const [formReviewerNameInput, setFormReviewerNameInput] = useState("");
  const [reviewerModalLoading, setReviewerModalLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const maxStep = steps.length || 6;

  const fetchAllData = async () => {
    setLoading(true);
    setError("");
    try {
      if (activeTab === "reviewers") {
        const res = await fetch("/api/survey-review/reviewers");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Không thể tải danh sách Reviewer");
        setReviewersList(data.reviewers || []);
      } else {
        const [secRes, quesRes] = await Promise.all([
          fetch(`/api/survey-review/sections?type=${activeTab}`),
          fetch(`/api/survey-review/questions?type=${activeTab}`)
        ]);

        const secData = await secRes.json();
        const quesData = await quesRes.json();

        if (!secRes.ok) throw new Error(secData.error || "Không thể tải danh sách phần");
        if (!quesRes.ok) throw new Error(quesData.error || "Không thể tải danh sách câu hỏi");

        const loadedSections = secData.sections || [];
        setSections(loadedSections);
        setQuestions(quesData.questions || []);

        // Build steps dynamically
        const dynamicSteps = loadedSections.map((sec: any) => ({
          id: sec.section_index,
          name: sec.section_title,
          dbId: sec.id
        }));

        const maxDynamicIndex = loadedSections.reduce((max: number, sec: any) => Math.max(max, sec.section_index), 1);
        const builtSteps = [
          { id: 1, name: activeTab === "self-review" ? "Thông tin chung" : "Thông tin đối tượng" },
          ...dynamicSteps,
          { id: maxDynamicIndex + 1, name: "Xác nhận & Gửi" }
        ];
        setSteps(builtSteps);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentStep(1);
    fetchAllData();
  }, [activeTab]);

  const getMascotMessage = (): string => {
    if (showModal) return "Bạn đang cấu hình nội dung câu hỏi mới. Hãy thiết lập thật đầy đủ nhé!";
    if (showSectionModal) return "Bạn đang cập nhật Phần lớn cho biểu mẫu. Tên phần sẽ tự hiển thị trên Sidebar.";
    if (currentStep === 1) return "Chào Admin! Phần 1 là thông tin cá nhân cơ bản và được cố định trong mã nguồn.";
    if (currentStep === maxStep) return "Admin có thể xem trước cách nút xác nhận và gửi khảo sát hiển thị ở đây.";
    return `Bạn đang xem và chỉnh sửa Phần ${currentStep - 1} của biểu mẫu. Rê chuột vào câu hỏi bất kỳ để sửa/xóa trực tuyến!`;
  };

  // Section CRUD Handlers
  const handleOpenAddSectionModal = () => {
    setEditingSection(null);
    setFormSectionTitleInput("");
    setShowSectionModal(true);
  };

  const handleOpenEditSectionModal = (sec: SurveySection) => {
    setEditingSection(sec);
    setFormSectionTitleInput(sec.section_title);
    setShowSectionModal(true);
  };

  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSectionTitleInput.trim()) {
      addToast("Vui lòng nhập tên Phần lớn", "error");
      return;
    }

    setSectionModalLoading(true);
    try {
      const isEdit = !!editingSection;
      const url = isEdit
        ? `/api/survey-review/sections/${editingSection.id}`
        : "/api/survey-review/sections";

      const payload = {
        survey_type: activeTab,
        section_title: formSectionTitleInput.trim()
      };

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lưu phần thất bại");

      addToast(isEdit ? "Cập nhật tên phần thành công!" : "Thêm phần lớn mới thành công!", "success");
      setShowSectionModal(false);
      fetchAllData();
    } catch (err: any) {
      console.error(err);
      addToast(err.message, "error");
    } finally {
      setSectionModalLoading(false);
    }
  };

  const handleDeleteSectionClick = (sec: SurveySection) => {
    setConfirmAction({
      title: "Xác nhận xóa Phần lớn",
      desc: `Bạn có chắc chắn muốn xóa Phần: "${sec.section_title}" không?`,
      detail: "Lưu ý: Tất cả các câu hỏi thuộc phần này cũng sẽ bị xóa vĩnh viễn. Các phần phía sau sẽ tự động dồn lên.",
      danger: true,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/survey-review/sections/${sec.id}`, {
            method: "DELETE"
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Xóa phần thất bại");

          addToast("Đã xóa phần lớn thành công", "success");
          setConfirmAction(null);
          setCurrentStep(1);
          fetchAllData();
        } catch (err: any) {
          console.error(err);
          addToast(err.message, "error");
        }
      }
    });
  };

  // Question CRUD Handlers
  const handleOpenAddModal = () => {
    setEditingQuestion(null);
    setFormSectionIndex(currentStep);
    
    const activeSection = sections.find(s => s.section_index === currentStep);
    setFormSectionTitle(activeSection?.section_title || `PHẦN ${currentStep - 1}: `);
    
    setFormQuestionText("");
    setFormQuestionType(activeTab === "self-review" ? "textarea" : "scale");
    setFormIsRequired(true);
    setFormSortOrder(questions.filter(q => q.section_index === currentStep).length + 1);
    setRadioOptions([]);
    setNewRadioOption("");
    setScaleMinLabel("Tệ");
    setScaleMaxLabel("Xuất sắc");
    
    setShowModal(true);
  };

  const handleOpenEditModal = (q: SurveyQuestion) => {
    setEditingQuestion(q);
    setFormSectionIndex(q.section_index);
    setFormSectionTitle(q.section_title);
    setFormQuestionText(q.question_text);
    setFormQuestionType(q.question_type);
    setFormIsRequired(q.is_required);
    setFormSortOrder(q.sort_order);

    // Load options
    let parsedOptions: any = [];
    try {
      parsedOptions = typeof q.options === "string" ? JSON.parse(q.options) : q.options;
    } catch {
      parsedOptions = q.options;
    }

    if (q.question_type === "radio") {
      setRadioOptions(Array.isArray(parsedOptions) ? parsedOptions : []);
    } else if (q.question_type === "scale") {
      setScaleMinLabel(parsedOptions?.minLabel || "Tệ");
      setScaleMaxLabel(parsedOptions?.maxLabel || "Xuất sắc");
    }
    
    setShowModal(true);
  };

  const handleAddRadioOption = () => {
    if (!newRadioOption.trim()) return;
    if (radioOptions.includes(newRadioOption.trim())) {
      addToast("Lựa chọn này đã tồn tại", "error");
      return;
    }
    setRadioOptions([...radioOptions, newRadioOption.trim()]);
    setNewRadioOption("");
  };

  const handleRemoveRadioOption = (index: number) => {
    setRadioOptions(radioOptions.filter((_, i) => i !== index));
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSectionTitle.trim()) {
      addToast("Vui lòng nhập tên phần câu hỏi", "error");
      return;
    }
    if (!formQuestionText.trim()) {
      addToast("Vui lòng nhập nội dung câu hỏi", "error");
      return;
    }

    // Build options payload
    let optionsPayload: any = [];
    if (formQuestionType === "radio") {
      if (radioOptions.length === 0) {
        addToast("Vui lòng thêm ít nhất một lựa chọn trắc nghiệm", "error");
        return;
      }
      optionsPayload = radioOptions;
    } else if (formQuestionType === "scale") {
      optionsPayload = {
        min: 1,
        max: 10,
        minLabel: scaleMinLabel.trim() || "Tệ",
        maxLabel: scaleMaxLabel.trim() || "Xuất sắc"
      };
    }

    setModalLoading(true);
    try {
      const isEdit = !!editingQuestion;
      const url = isEdit 
        ? `/api/survey-review/questions/${editingQuestion.id}`
        : "/api/survey-review/questions";
      
      const payload = {
        survey_type: activeTab,
        section_index: formSectionIndex,
        section_title: formSectionTitle.trim(),
        question_text: formQuestionText.trim(),
        question_type: formQuestionType,
        options: optionsPayload,
        is_required: formIsRequired,
        sort_order: formSortOrder,
      };

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lưu thất bại");

      addToast(isEdit ? "Đã sửa câu hỏi thành công!" : "Đã thêm câu hỏi mới thành công!", "success");
      setShowModal(false);
      fetchAllData();
    } catch (err: any) {
      console.error(err);
      addToast(err.message, "error");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setConfirmAction({
      title: "Xác nhận xóa câu hỏi",
      desc: "Bạn có chắc chắn muốn xóa câu hỏi này khỏi biểu mẫu?",
      detail: "Các câu trả lời lịch sử đã nộp trước đây sẽ không bị ảnh hưởng.",
      danger: true,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/survey-review/questions/${id}`, {
            method: "DELETE"
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Xóa thất bại");

          addToast("Đã xóa câu hỏi thành công", "success");
          setConfirmAction(null);
          fetchAllData();
        } catch (err: any) {
          console.error(err);
          addToast(err.message, "error");
        }
      }
    });
  };

  // Reviewers CRUD Handlers
  const handleOpenAddReviewerModal = () => {
    setEditingReviewer(null);
    setFormReviewerNameInput("");
    setShowReviewerModal(true);
  };

  const handleOpenEditReviewerModal = (rev: SurveyReviewer) => {
    setEditingReviewer(rev);
    setFormReviewerNameInput(rev.name);
    setShowReviewerModal(true);
  };

  const handleSaveReviewer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formReviewerNameInput.trim()) {
      addToast("Vui lòng nhập họ tên Reviewer", "error");
      return;
    }

    setReviewerModalLoading(true);
    try {
      const isEdit = !!editingReviewer;
      const url = isEdit
        ? `/api/survey-review/reviewers/${editingReviewer.id}`
        : "/api/survey-review/reviewers";

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formReviewerNameInput.trim() })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lưu reviewer thất bại");

      addToast(isEdit ? "Cập nhật tên reviewer thành công!" : "Thêm reviewer thành công!", "success");
      setShowReviewerModal(false);
      fetchAllData();
    } catch (err: any) {
      console.error(err);
      addToast(err.message, "error");
    } finally {
      setReviewerModalLoading(false);
    }
  };

  const handleDeleteReviewerClick = (rev: SurveyReviewer) => {
    setConfirmAction({
      title: "Xác nhận xóa Reviewer",
      desc: `Bạn có chắc chắn muốn xóa Reviewer "${rev.name}" khỏi danh sách?`,
      detail: "Tên của reviewer này sẽ biến mất khỏi danh sách lựa chọn đánh giá chéo.",
      danger: true,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/survey-review/reviewers/${rev.id}`, {
            method: "DELETE"
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Xóa thất bại");

          addToast("Đã xóa reviewer thành công", "success");
          setConfirmAction(null);
          fetchAllData();
        } catch (err: any) {
          console.error(err);
          addToast(err.message, "error");
        }
      }
    });
  };

  const handleResetToDefaults = () => {
    setConfirmAction({
      title: "Khôi phục biểu mẫu gốc",
      desc: "Hành động này sẽ ghi đè toàn bộ câu hỏi và phần cấu hình tùy chỉnh hiện tại để tải lại danh sách mặc định nguyên bản.",
      detail: "Hãy chắc chắn trước khi tiếp tục!",
      danger: true,
      onConfirm: async () => {
        setResetting(true);
        try {
          const res = await fetch(`/api/survey-review/questions/reset?type=${activeTab}`, {
            method: "POST"
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Đặt lại thất bại");

          addToast("Khôi phục toàn bộ bản gốc thành công!", "success");
          setConfirmAction(null);
          setCurrentStep(1);
          fetchAllData();
        } catch (err: any) {
          console.error(err);
          addToast(err.message, "error");
        } finally {
          setResetting(false);
        }
      }
    });
  };

  const handleNext = () => {
    if (currentStep < maxStep) {
      setCurrentStep((p) => p + 1);
      containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((p) => p - 1);
      containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Filter current questions in dynamic steps
  const activeQuestions = questions
    .filter((q) => q.section_index === currentStep)
    .sort((a, b) => a.sort_order - b.sort_order);

  // Active section metadata
  const activeSection = sections.find(s => s.section_index === currentStep);

  // Render question input component (read-only for preview)
  const renderQuestionInputPreview = (q: SurveyQuestion) => {
    switch (q.question_type) {
      case "text":
        return (
          <input
            type="text"
            placeholder="Ô nhập tự luận ngắn..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2 text-xs font-semibold focus:outline-none"
            disabled
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
          <div className="flex flex-col gap-1 text-[11px] font-semibold text-gray-550">
            {opts.map((opt: string) => (
              <label key={opt} className="flex items-center gap-2 py-0.5 opacity-70">
                <input type="radio" disabled className="h-3.5 w-3.5" />
                {opt}
              </label>
            ))}
          </div>
        );
      }
      case "scale": {
        let config = { min: 1, max: 10, minLabel: "Tệ", maxLabel: "Xuất sắc" };
        try {
          const parsed = typeof q.options === "string" ? JSON.parse(q.options) : q.options;
          if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
            config = { ...config, ...parsed };
          }
        } catch {}
        return (
          <div className="flex flex-col gap-2 mt-1">
            <div className="flex justify-between text-[10px] font-bold text-gray-400 px-1">
              <span>{config.minLabel}</span>
              <span>{config.maxLabel}</span>
            </div>
            <div className="flex items-center justify-between gap-1 bg-gray-50/50 p-2 rounded-xl border border-gray-100 opacity-70">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                <div key={num} className="flex flex-1 justify-center py-1 rounded bg-white text-gray-400 text-xs border border-gray-100 font-bold">
                  {num}
                </div>
              ))}
            </div>
          </div>
        );
      }
      case "textarea":
      default:
        return (
          <textarea
            rows={3}
            placeholder="Ô nhập tự luận dài..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-xs font-semibold focus:outline-none"
            disabled
          />
        );
    }
  };

  return (
    <div className="flex-1 p-6 sm:p-8 overflow-y-auto bg-gray-50 flex flex-col gap-6">
      <ToastStack toasts={toasts} />
      
      {/* Top Controller Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Trình Biên Tập Biểu Mẫu Trực Quan</h1>
          <p className="text-xs font-semibold text-gray-400 mt-1">Thiết kế cấu trúc câu hỏi động bằng cách tương tác trực tiếp trên giao diện thực.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-gray-200 bg-white p-0.5 flex">
            <button
              onClick={() => setActiveTab("self-review")}
              className={`rounded-lg px-3 py-1.5 text-xs font-black transition-all ${
                activeTab === "self-review" ? "bg-red-500 text-white" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Self Review
            </button>
            <button
              onClick={() => setActiveTab("leader-review")}
              className={`rounded-lg px-3 py-1.5 text-xs font-black transition-all ${
                activeTab === "leader-review" ? "bg-red-500 text-white" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Leader Review
            </button>
            <button
              onClick={() => setActiveTab("reviewers")}
              className={`rounded-lg px-3 py-1.5 text-xs font-black transition-all ${
                activeTab === "reviewers" ? "bg-red-500 text-white" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Reviewers
            </button>
          </div>

          {activeTab !== "reviewers" && (
            <button
              onClick={handleResetToDefaults}
              disabled={resetting}
              className="flex h-9 items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 text-xs font-black text-gray-600 hover:bg-gray-50 hover:text-red-500 hover:border-red-200 transition-all cursor-pointer shadow-sm disabled:opacity-50"
            >
              <RotateCcw size={13} />
              <span>Khôi phục bản gốc</span>
            </button>
          )}
        </div>
      </div>

      {activeTab === "reviewers" ? (
        /* REVIEWERS LIST DASHBOARD TABLE VIEW */
        <div className="flex-1 bg-white rounded-3xl border border-gray-150 shadow-sm p-6 sm:p-8 flex flex-col gap-6 min-h-[500px]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-5">
            <div>
              <h2 className="text-lg font-black text-gray-800 tracking-tight">Quản lý Danh sách Reviewer / Mentor</h2>
              <p className="text-xs text-gray-400 mt-1 font-semibold">Thêm, sửa đổi hoặc xóa tên các thành viên chấm đánh giá chéo hiển thị trong form ở client.</p>
            </div>
            <button
              onClick={handleOpenAddReviewerModal}
              className="flex h-10 items-center gap-1.5 rounded-xl bg-red-500 px-5 text-xs font-black text-white hover:bg-red-600 shadow-lg shadow-red-500/10 cursor-pointer transition-all"
            >
              <Plus size={15} />
              <span>Thêm Reviewer mới</span>
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 font-bold text-xs gap-2">
              <Loader2 className="animate-spin text-red-500" size={24} />
              <span>Đang tải danh sách Reviewer...</span>
            </div>
          ) : reviewersList.length === 0 ? (
            <div className="rounded-2xl border border-gray-150 bg-gray-50/50 p-12 text-center text-xs font-bold text-gray-400">
              Chưa có reviewer nào trong danh sách. Hãy nhấn "Thêm Reviewer mới" ở trên để bổ sung.
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-gray-150 bg-white shadow-sm flex-1">
              <table className="w-full text-left text-xs font-semibold text-gray-700">
                <thead className="bg-gray-50 border-b border-gray-100 text-[10px] font-black uppercase text-gray-400 tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5">Họ và tên</th>
                    <th className="px-6 py-3.5">Ngày cập nhật</th>
                    <th className="px-6 py-3.5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reviewersList.map((rev) => (
                    <tr key={rev.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-gray-800">{rev.name}</td>
                      <td className="px-6 py-4 text-gray-400">{new Date(rev.created_at).toLocaleDateString("vi-VN")}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditReviewerModal(rev)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-50 cursor-pointer"
                            title="Sửa tên Reviewer"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteReviewerClick(rev)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-white text-rose-500 hover:text-rose-750 hover:bg-rose-50 cursor-pointer"
                            title="Xóa Reviewer"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Main Simulation Wizard Container (Self / Leader Reviews) */
        <div className="flex-1 min-h-[580px] bg-white rounded-3xl border border-gray-150 shadow-sm flex overflow-hidden">
          
          {/* Left Interactive Sidebar */}
          <div className="hidden w-80 shrink-0 flex-col justify-between border-r border-gray-100 bg-[#fbfbfd] p-8 md:flex select-none">
            <div>
              <div className="flex items-center gap-2 font-bold text-gray-800">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span className="uppercase text-[10px] tracking-widest">{activeTab === "self-review" ? "Self Review Visual Builder" : "Leader Review Visual Builder"}</span>
              </div>
              
              {/* Steps map */}
              <div className="mt-8 flex flex-col gap-4">
                {steps.map((step) => {
                  const isActive = step.id === currentStep;
                  const isCompleted = step.id < currentStep;
                  return (
                    <button
                      onClick={() => setCurrentStep(step.id)}
                      className="flex items-center gap-3 w-full text-left bg-transparent border-none p-0 cursor-pointer focus:outline-none"
                    >
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-lg font-bold text-xs transition-all ${
                          isActive
                             ? "bg-red-500 text-white shadow-md shadow-red-500/20"
                             : isCompleted
                             ? "bg-gray-900 text-white"
                             : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {step.id}
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

                {/* Add Section button in Sidebar */}
                <button
                  onClick={handleOpenAddSectionModal}
                  className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-red-200 bg-white py-2 text-xs font-black text-red-500 hover:bg-red-50/50 hover:border-red-400 transition-all cursor-pointer"
                >
                  <Plus size={13} />
                  <span>Thêm Phần mới</span>
                </button>
              </div>
            </div>

            {/* Guide Mascot */}
            <div className="mt-6 flex flex-col items-center rounded-2xl border border-gray-150 bg-white p-4 shadow-sm">
              <MascotGuide state={showModal || showSectionModal ? "thinking" : currentStep === 1 ? "greeting" : "focused"} size={90} interactive />
              <p className="mt-3 text-center text-[10px] font-black leading-relaxed text-gray-500">
                {getMascotMessage()}
              </p>
            </div>
          </div>

          {/* Right Form Simulation Window */}
          <div ref={containerRef} className="flex flex-1 flex-col overflow-y-auto bg-gray-50/50">
            <div className="flex-1 p-6 sm:p-8">
              <div className="mx-auto max-w-xl">
                
                {/* Header section with inline section edit controls */}
                <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <span className="text-xs font-black uppercase tracking-widest text-red-500">
                      Bước {currentStep} trên {maxStep}
                    </span>
                    <h2 className="mt-1 text-xl font-black text-gray-900 tracking-tight">
                      {currentStep === 1 ? (activeTab === "self-review" ? "Thông tin chung" : "Thông tin đối tượng") :
                       currentStep === maxStep ? "Xác nhận & Gửi" :
                       activeSection?.section_title || ""}
                    </h2>
                  </div>

                  {/* Section control actions */}
                  {activeSection && currentStep > 1 && currentStep < maxStep && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleOpenEditSectionModal(activeSection)}
                        className="flex h-8 items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                        title="Đổi tên phần"
                      >
                        <Edit2 size={12} />
                        <span>Đổi tên</span>
                      </button>
                      <button
                        onClick={() => handleDeleteSectionClick(activeSection)}
                        className="flex h-8 items-center gap-1 rounded-xl border border-rose-100 bg-white px-3 text-[11px] font-bold text-rose-500 hover:bg-rose-50 cursor-pointer"
                        title="Xóa phần lớn"
                      >
                        <Trash2 size={12} />
                        <span>Xóa Phần</span>
                      </button>
                    </div>
                  )}
                </div>

                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400 font-bold text-xs gap-2">
                    <Loader2 className="animate-spin text-red-500" size={24} />
                    <span>Đang tải câu hỏi...</span>
                  </div>
                ) : error ? (
                  <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-xs font-bold text-red-800 flex gap-2">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                ) : (
                  <>
                    {/* Step 1: Info (Read-only System Meta fields) */}
                    {currentStep === 1 && (
                      <div className="flex flex-col gap-4 border border-dashed border-gray-200 rounded-2xl p-5 bg-white">
                        <div className="bg-gray-100 text-gray-500 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-wide inline-block w-fit">
                          Trường dữ liệu hệ thống (Cố định)
                        </div>
                        
                        <div className="flex flex-col gap-1.5 opacity-50">
                          <label className="text-xs font-bold text-gray-500">
                            {activeTab === "self-review" ? "Họ và tên thành viên" : "Tên Member được đánh giá"}
                          </label>
                          <input type="text" disabled className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-xs focus:outline-none" />
                        </div>

                        <div className="flex flex-col gap-1.5 opacity-50">
                          <label className="text-xs font-bold text-gray-500">Kỳ đánh giá xét duyệt</label>
                          <input type="text" disabled className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-xs focus:outline-none" />
                        </div>

                        <p className="text-[10px] font-bold text-gray-400 italic mt-2">
                          *Các trường cấu hình này được cố định để tự động liên kết với hồ sơ người dùng trong Database.
                        </p>
                      </div>
                    )}

                    {/* Dynamic Steps: Editable items */}
                    {currentStep > 1 && currentStep < maxStep && (
                      <div className="flex flex-col gap-5">
                        
                        {/* Prominent Add Question block */}
                        <button
                          onClick={handleOpenAddModal}
                          className="w-full border-2 border-dashed border-red-200 hover:border-red-400 rounded-2xl bg-red-50/20 hover:bg-red-50/40 p-4 text-xs font-black text-red-500 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Plus size={15} />
                          <span>Thêm câu hỏi mới vào Phần này</span>
                        </button>

                        {/* Render questions list */}
                        {activeQuestions.length === 0 ? (
                          <div className="rounded-2xl border border-gray-150 bg-white p-12 text-center text-xs font-bold text-gray-400">
                            Chưa có câu hỏi nào ở bước này.
                          </div>
                        ) : (
                          <div className="flex flex-col gap-4">
                            {activeQuestions.map((q) => (
                              <div
                                key={q.id}
                                className="group relative rounded-2xl border border-gray-150 bg-white p-5 hover:border-red-400 hover:shadow-md transition-all flex flex-col gap-2"
                              >
                                {/* Hover Tool Action Controls */}
                                <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => handleOpenEditModal(q)}
                                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all cursor-pointer"
                                    title="Chỉnh sửa câu hỏi"
                                  >
                                    <Edit2 size={12} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteClick(q.id)}
                                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-white text-rose-500 hover:text-rose-750 hover:bg-rose-50 transition-all cursor-pointer"
                                    title="Xóa câu hỏi"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>

                                <div className="pr-16">
                                  <div className="flex items-center gap-1.5 mb-1.5">
                                    <span className="rounded bg-gray-150 px-1.5 py-0.5 text-[9px] font-black text-gray-500 tracking-wider">
                                      #{q.sort_order}
                                    </span>
                                    <span className="rounded bg-red-50 text-red-500 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider">
                                      {q.question_type === "scale" ? "Scale 1-10" : q.question_type}
                                    </span>
                                    {q.is_required && (
                                      <span className="rounded bg-rose-50 px-1.5 py-0.5 text-[9px] font-black text-rose-600">Bắt buộc</span>
                                    )}
                                  </div>
                                  <label className="text-xs font-bold text-gray-700 leading-relaxed">
                                    {q.question_text}
                                  </label>
                                </div>

                                {renderQuestionInputPreview(q)}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Last Step: Confirm checkbox */}
                    {currentStep === maxStep && (
                      <div className="flex flex-col gap-4 border border-dashed border-gray-200 rounded-2xl p-5 bg-white opacity-60">
                        <h3 className="text-sm font-black text-gray-800">Cam kết nộp khảo sát (Tĩnh)</h3>
                        <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                          Hộp xác nhận cam kết tính trung thực của bài tự đánh giá / đánh giá chéo.
                        </p>
                        <label className="flex items-start gap-2.5 text-xs font-bold text-gray-700 mt-2">
                          <input type="checkbox" disabled checked className="mt-0.5 accent-red-500 rounded h-4 w-4" />
                          <span>Tôi xác nhận tất cả thông tin trên là chính xác và trung thực.</span>
                        </label>
                      </div>
                    )}
                  </>
                )}

                {/* Bottom Simulator Stepper Buttons */}
                <div className="mt-8 flex justify-between gap-4 border-t border-gray-100 pt-5">
                  <button
                    onClick={handleBack}
                    disabled={currentStep === 1}
                    className="flex h-10 items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 text-xs font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
                  >
                    <ArrowLeft size={14} />
                    <span>Quay lại</span>
                  </button>

                  <button
                    onClick={handleNext}
                    disabled={currentStep === maxStep}
                    className="flex h-10 items-center gap-1.5 rounded-xl bg-red-500 px-5 text-xs font-bold text-white hover:bg-red-600 shadow-lg shadow-red-500/10 disabled:opacity-40 cursor-pointer"
                  >
                    <span>Tiếp tục</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Edit/Add Question Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden border border-gray-100 animate-fade-in flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/50">
              <h3 className="text-sm font-black text-gray-800 uppercase tracking-wide">
                {editingQuestion ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi khảo sát"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-gray-605 cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveQuestion} className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 text-xs font-bold text-gray-700">
              
              <div className="grid grid-cols-2 gap-4">
                {/* Section Index */}
                <div className="flex flex-col gap-1.5">
                  <label>Chỉ số Phần (Section Index) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    value={formSectionIndex}
                    disabled
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs focus:outline-none text-gray-400"
                  />
                </div>

                {/* Sort Order */}
                <div className="flex flex-col gap-1.5">
                  <label>Thứ tự hiển thị (Sort Order) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    value={formSortOrder}
                    onChange={(e) => setFormSortOrder(parseInt(e.target.value) || 0)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Section Title */}
              <div className="flex flex-col gap-1.5">
                <label>Tiêu đề Phần (Section Title) <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formSectionTitle}
                  onChange={(e) => setFormSectionTitle(e.target.value)}
                  placeholder="Ví dụ: PHẦN 1: KPI & OUTPUT"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs focus:outline-none"
                  required
                />
              </div>

              {/* Question Text */}
              <div className="flex flex-col gap-1.5">
                <label>Nội dung Câu hỏi <span className="text-red-500">*</span></label>
                <textarea
                  rows={3}
                  value={formQuestionText}
                  onChange={(e) => setFormQuestionText(e.target.value)}
                  placeholder="Nhập nội dung câu hỏi..."
                  className="w-full rounded-xl border border-gray-200 p-3 text-xs focus:outline-none"
                  required
                />
              </div>

              {/* Question Type */}
              <div className="flex flex-col gap-1.5">
                <label>Định dạng trả lời <span className="text-red-500">*</span></label>
                <select
                  value={formQuestionType}
                  onChange={(e: any) => setFormQuestionType(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs bg-white focus:outline-none"
                >
                  <option value="textarea">Tự luận dài (Textarea)</option>
                  <option value="text">Tự luận ngắn (Text)</option>
                  <option value="radio">Trắc nghiệm (Radio options)</option>
                  <option value="scale">Thang điểm 1 - 10 (Linear Scale)</option>
                </select>
              </div>

              {/* Configurations for Radio types */}
              {formQuestionType === "radio" && (
                <div className="flex flex-col gap-2 rounded-2xl bg-gray-50 p-4 border border-gray-100">
                  <label className="text-[10px] text-gray-500 uppercase tracking-wide">Các lựa chọn trắc nghiệm:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newRadioOption}
                      onChange={(e) => setNewRadioOption(e.target.value)}
                      placeholder="Thêm lựa chọn..."
                      className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddRadioOption}
                      className="rounded-xl bg-gray-800 text-white px-3 text-xs hover:bg-gray-700 cursor-pointer"
                    >
                      Thêm
                    </button>
                  </div>
                  <div className="mt-2 flex flex-col gap-1.5">
                    {radioOptions.length === 0 ? (
                      <span className="text-[10px] text-gray-400 italic">Chưa có lựa chọn nào</span>
                    ) : (
                      radioOptions.map((opt, i) => (
                        <div key={opt} className="flex items-center justify-between rounded-lg bg-white border border-gray-100 px-3 py-1 text-xs">
                          <span className="font-semibold text-gray-700">{opt}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveRadioOption(i)}
                            className="text-rose-500 hover:text-rose-700 bg-transparent border-none p-0 cursor-pointer"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Configurations for Scale types */}
              {formQuestionType === "scale" && (
                <div className="grid grid-cols-2 gap-3 rounded-2xl bg-gray-50 p-4 border border-gray-100">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gray-500 uppercase">Nhãn điểm thấp nhất (1):</label>
                    <input
                      type="text"
                      value={scaleMinLabel}
                      onChange={(e) => setScaleMinLabel(e.target.value)}
                      placeholder="VD: Tệ"
                      className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gray-500 uppercase">Nhãn điểm cao nhất (10):</label>
                    <input
                      type="text"
                      value={scaleMaxLabel}
                      onChange={(e) => setScaleMaxLabel(e.target.value)}
                      placeholder="VD: Xuất sắc"
                      className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Required toggle */}
              <label className="flex items-center gap-2 mt-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formIsRequired}
                  onChange={(e) => setFormIsRequired(e.target.checked)}
                  className="h-4 w-4 accent-red-500 rounded border-gray-300 cursor-pointer"
                />
                <span>Bắt buộc điền khảo sát</span>
              </label>

              {/* Save Footer */}
              <div className="mt-4 flex justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-505 hover:bg-gray-50 cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="flex items-center gap-1.5 rounded-xl bg-red-500 px-5 py-2 text-xs font-black text-white hover:bg-red-600 shadow-md shadow-red-500/10 cursor-pointer disabled:opacity-50"
                >
                  {modalLoading ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                  <span>Lưu lại</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Section Create/Edit Modal */}
      {showSectionModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden border border-gray-100 animate-fade-in flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/50">
              <h3 className="text-sm font-black text-gray-800 uppercase tracking-wide">
                {editingSection ? "Sửa tên Phần lớn" : "Thêm Phần lớn mới"}
              </h3>
              <button
                onClick={() => setShowSectionModal(false)}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveSection} className="p-6 flex flex-col gap-4 text-xs font-bold text-gray-700">
              <div className="flex flex-col gap-1.5">
                <label>Tiêu đề Phần lớn (Section Title) <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formSectionTitleInput}
                  onChange={(e) => setFormSectionTitleInput(e.target.value)}
                  placeholder="Ví dụ: PHẦN 1: HIỆU SUẤT CÔNG VIỆC"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs focus:outline-none focus:border-red-400"
                  required
                />
              </div>

              {editingSection && (
                <p className="text-[10px] text-gray-400 leading-normal font-semibold">
                  * Khi bạn đổi tên phần này, hệ thống sẽ tự động đồng bộ tiêu đề mới sang toàn bộ câu hỏi hiện có trong phần này.
                </p>
              )}

              {/* Footer */}
              <div className="mt-2 flex justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowSectionModal(false)}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-50 cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={sectionModalLoading}
                  className="flex items-center gap-1.5 rounded-xl bg-red-500 px-5 py-2 text-xs font-black text-white hover:bg-red-600 shadow-md shadow-red-500/10 cursor-pointer disabled:opacity-50"
                >
                  {sectionModalLoading ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                  <span>Lưu lại</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reviewer Create/Edit Modal */}
      {showReviewerModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden border border-gray-100 animate-fade-in flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/50">
              <h3 className="text-sm font-black text-gray-800 uppercase tracking-wide">
                {editingReviewer ? "Sửa thông tin Reviewer" : "Thêm Reviewer mới"}
              </h3>
              <button
                onClick={() => setShowReviewerModal(false)}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveReviewer} className="p-6 flex flex-col gap-4 text-xs font-bold text-gray-700">
              <div className="flex flex-col gap-1.5">
                <label>Họ và tên Reviewer <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formReviewerNameInput}
                  onChange={(e) => setFormReviewerNameInput(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn B"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs focus:outline-none focus:border-red-400"
                  required
                />
              </div>

              {/* Footer */}
              <div className="mt-2 flex justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowReviewerModal(false)}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-50 cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={reviewerModalLoading}
                  className="flex items-center gap-1.5 rounded-xl bg-red-500 px-5 py-2 text-xs font-black text-white hover:bg-red-600 shadow-md shadow-red-500/10 cursor-pointer disabled:opacity-50"
                >
                  {reviewerModalLoading ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                  <span>Lưu lại</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete/Reset Confirmation Dialog */}
      <ConfirmModal
        action={confirmAction}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
}
