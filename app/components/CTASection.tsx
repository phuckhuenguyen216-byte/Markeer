/* eslint-disable react-hooks/purity */
"use client";

import React, { useEffect, useState, useMemo, memo } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence, Easing, Variants } from "framer-motion";
import "../i18n";

/* ─────────────── Floating Particles ─────────────── */
// memo + useMemo: particles generated once per mount, never re-created on parent re-render
const Particles = memo(function Particles({
  count = 22,
  light = false,
}: {
  count?: number;
  light?: boolean;
}) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        w: Math.random() * 5 + 2,
        h: Math.random() * 5 + 2,
        l: Math.random() * 100,
        t: Math.random() * 100,
        dy: -(Math.random() * 40 + 20),
        dx: (Math.random() - 0.5) * 20,
        dur: Math.random() * 4 + 4,
        del: Math.random() * 6,
      })),
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${light ? "bg-red-400/25" : "bg-white/15"}`}
          style={{
            width: p.w,
            height: p.h,
            left: `${p.l}%`,
            top: `${p.t}%`,
          }}
          animate={{
            y: [0, p.dy, 0],
            x: [0, p.dx, 0],
            opacity: [0.15, 0.7, 0.15],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: p.dur,
            repeat: Infinity,
            delay: p.del,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
});

/* ─────────────── Stat card ─────────────── */
function StatCard({
  icon,
  label,
  value,
  delay,
  pos,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  delay: number;
  pos: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, type: "spring", stiffness: 220, damping: 18 }}
      whileHover={{ scale: 1.06, y: -3 }}
      className={`absolute ${pos} z-10 flex items-center gap-3 px-4 py-3 rounded-2xl`}
      style={{
        background: "rgba(255,255,255,0.94)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(239,68,68,0.1)",
        boxShadow:
          "0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(239,68,68,0.06)",
      }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          background: "linear-gradient(135deg, #ef4444, #f43f5e)",
          boxShadow: "0 4px 12px rgba(239,68,68,0.4)",
        }}
      >
        {icon}
      </div>
      <div>
        <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider leading-none">
          {label}
        </p>
        <p className="text-sm font-extrabold text-gray-900 mt-0.5 leading-none">
          {value}
        </p>
      </div>
    </motion.div>
  );
}

/* ─────────────── Fancy form input ─────────────── */
const FancyInput = memo(function FancyInput({
  type = "text",
  placeholder,
  required,
  rows,
}: {
  type?: string;
  placeholder: string;
  required?: boolean;
  rows?: number;
}) {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const baseStyle: React.CSSProperties = {
    border: focused
      ? "1.5px solid rgba(239,68,68,0.7)"
      : hasValue
        ? "1.5px solid rgba(239,68,68,0.3)"
        : "1.5px solid rgba(209,213,219,0.7)",
    boxShadow: focused
      ? "0 0 0 4px rgba(239,68,68,0.08), 0 4px 16px rgba(239,68,68,0.1)"
      : "0 1px 4px rgba(0,0,0,0.04)",
    background: focused ? "rgba(255,255,255,1)" : "rgba(249,250,251,0.8)",
    transition: "all 0.25s ease",
    outline: "none",
    resize: "none",
  };

  const sharedClass =
    "w-full px-5 py-4 rounded-2xl text-gray-900 placeholder-gray-400 text-[15px]";

  const events = {
    onFocus: () => setFocused(true),
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFocused(false);
      setHasValue(e.target.value.length > 0);
    },
  };

  return (
    <motion.div
      animate={focused ? { y: -2 } : { y: 0 }}
      transition={{ type: "spring", stiffness: 380, damping: 22 }}
      className="relative"
    >
      <motion.div
        className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full z-10"
        animate={{
          opacity: focused ? 1 : 0,
          background: "linear-gradient(to bottom, #ef4444, #f43f5e)",
        }}
        transition={{ duration: 0.2 }}
      />

      {rows ? (
        <textarea
          rows={rows}
          placeholder={placeholder}
          className={sharedClass}
          style={baseStyle}
          {...(events as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          required={required}
          className={sharedClass}
          style={baseStyle}
          {...(events as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
    </motion.div>
  );
});

/* ─────────────── Success overlay ─────────────── */
function SuccessOverlay({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, backdropFilter: "blur(0px)" }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ type: "spring", stiffness: 240, damping: 22 }}
      className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/97 rounded-3xl gap-5 px-8 text-center"
    >
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 280,
          damping: 18,
          delay: 0.12,
        }}
        className="w-20 h-20 rounded-full flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #22c55e, #16a34a)",
          boxShadow: "0 8px 32px rgba(34,197,94,0.4)",
        }}
      >
        <svg
          className="w-10 h-10 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </motion.div>
      <motion.h4
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28 }}
        className="text-2xl font-extrabold text-gray-950"
      >
        Đăng ký thành công! 🎉
      </motion.h4>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-500 max-w-xs text-sm leading-relaxed"
      >
        Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
      </motion.p>
      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.52 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        onClick={onReset}
        className="mt-1 px-8 py-3 rounded-xl text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
      >
        Gửi thêm
      </motion.button>
    </motion.div>
  );
}

/* ─────────────── Modal Decorations (static layer, never re-renders) ─────────────── */
const ModalDecorations = memo(function ModalDecorations() {
  return (
    <>
      <motion.div
        className="absolute -top-32 -left-20 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.13) 0%, transparent 65%)", filter: "blur(60px)" }}
        animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-24 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(253,164,175,0.18) 0%, transparent 70%)", filter: "blur(50px)" }}
        animate={{ scale: [1.1, 1, 1.1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="absolute top-0 inset-x-0 h-[2px] pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)" }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="absolute inset-0 rounded-[28px] pointer-events-none"
        style={{ border: "1px solid rgba(255,255,255,0.1)" }}
        animate={{ boxShadow: ["0 0 0 0px rgba(239,68,68,0)", "0 0 0 6px rgba(239,68,68,0.15)", "0 0 0 0px rgba(239,68,68,0)"] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <Particles count={30} light={false} />
    </>
  );
});

/* ─────────────── Modal Form Content (isolated state) ─────────────── */
const ModalFormContent = memo(function ModalFormContent({
  t,
  onSubmitSuccess,
}: {
  t: (key: string) => string;
  onSubmitSuccess: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmitSuccess();
    }, 1800);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {[
        { type: "text", placeholder: t("cta.namePlaceholder") || "Họ và tên", required: true },
        { type: "email", placeholder: t("cta.emailPlaceholder") || "Email của bạn", required: true },
      ].map((field, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + i * 0.12 }}
        >
          <FancyInput {...field} />
        </motion.div>
      ))}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.54 }}>
        <FancyInput rows={4} placeholder={t("cta.messagePlaceholder") || "Bạn muốn bắt đầu từ đâu?"} />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.66 }}>
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={!isSubmitting ? { scale: 1.02, y: -3 } : {}}
          whileTap={!isSubmitting ? { scale: 0.98 } : {}}
          className={`cta-btn relative w-full py-[17px] rounded-2xl font-bold text-[17px] text-white ${isSubmitting ? "cursor-not-allowed" : ""}`}
          style={{
            background: isSubmitting ? "#9ca3af" : "linear-gradient(135deg, #ef4444 0%, #e11d48 100%)",
            boxShadow: isSubmitting ? "none" : "0 12px 36px rgba(239,68,68,0.45), inset 0 1px 0 rgba(255,255,255,0.15)",
            transition: "background 0.3s ease, box-shadow 0.3s ease",
          }}
        >
          <AnimatePresence mode="wait">
            {isSubmitting ? (
              <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-3">
                <motion.span className="w-5 h-5 rounded-full border-2 border-white/40 border-t-white" animate={{ rotate: 360 }} transition={{ duration: 0.75, repeat: Infinity, ease: "linear" }} />
                Đang gửi...
              </motion.span>
            ) : (
              <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-2">
                {t("cta.button")}
                <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>→</motion.span>
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>
    </form>
  );
});

/* ─────────────── Modal Form Card (isolated: submitted state stays here) ─────────────── */
const ModalFormCard = memo(function ModalFormCard({
  t,
}: {
  t: (key: string) => string;
}) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div
      className="relative rounded-3xl p-6 sm:p-8 lg:p-10 overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.3)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.22), 0 8px 24px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.9)",
      }}
    >
      <div className="absolute top-0 left-10 right-10 h-[3px] rounded-b-full" style={{ background: "linear-gradient(90deg, #ef4444, #f43f5e, #ef4444)" }} />
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%)" }} />

      <AnimatePresence>
        {submitted && <SuccessOverlay onReset={() => setSubmitted(false)} />}
      </AnimatePresence>

      {/* Form header */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }} className="mb-7">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.28, type: "spring", stiffness: 280 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4"
          style={{ background: "linear-gradient(135deg,rgba(239,68,68,0.1),rgba(244,63,94,0.06))", border: "1px solid rgba(239,68,68,0.2)", color: "#dc2626" }}
        >
          <motion.span animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>⚡</motion.span>
          {t("cta.badge")}
        </motion.div>
        <h3 className="text-2xl sm:text-3xl lg:text-[2rem] font-bold leading-[1.2] bg-gradient-to-r from-gray-900 via-red-600 to-rose-500 bg-clip-text text-transparent">
          {t("cta.headline")}
        </h3>
        <p className="mt-2 text-sm text-gray-500 leading-relaxed">{t("cta.description")}</p>
      </motion.div>

      {!submitted && <ModalFormContent t={t} onSubmitSuccess={() => setSubmitted(true)} />}

      {/* Trust badges */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-6 flex flex-wrap gap-5 justify-center lg:justify-start">
        {[t("cta.noCard"), t("cta.cancelAnytime")].map((label, i) => (
          <span key={i} className="flex items-center gap-2 text-sm text-gray-500 font-medium">
            <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg,#22c55e,#16a34a)", boxShadow: "0 2px 8px rgba(34,197,94,0.3)" }}>
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </span>
            {label}
          </span>
        ))}
      </motion.div>
    </div>
  );
});

/* ─────────────── Registration Modal (near-fullscreen) ─────────────── */
function RegistrationModal({
  isOpen,
  onClose,
  t,
}: {
  isOpen: boolean;
  onClose: () => void;
  t: (key: string) => string;
}) {
  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    if (isOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const sb = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${sb}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        /* ── Backdrop ── */
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(12px)", padding: "12px" }}
          onClick={handleClose}
        >
          {/* ── Modal shell – near-fullscreen ── */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 60 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 30 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="relative w-full overflow-hidden"
            style={{
              maxWidth: "1200px",
              width: "calc(100vw - 24px)",
              maxHeight: "100vh",
              borderRadius: 28,
              background: "linear-gradient(148deg, #dc2626 0%, #be123c 55%, #9f1239 100%)",
              boxShadow: "0 48px 140px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative layer – fully isolated from form state */}
            <ModalDecorations />

            {/* ── Close button ── */}
            <motion.button
              whileHover={{ scale: 1.12, rotate: 90, background: "rgba(255,255,255,0.3)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              onClick={handleClose}
              className="absolute top-4 right-4 z-40 w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.28)" }}
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>

            {/* ── Two-column layout ── */}
            <div className="relative grid lg:grid-cols-2 gap-0 overflow-y-auto" style={{ maxHeight: "94vh" }}>

              {/* ════ LEFT: Form card ════ */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12, duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="flex flex-col justify-center p-6 sm:p-8 lg:p-10"
              >
                {/* ModalFormCard owns submitted state – isolated so modal shell never re-renders */}
                <ModalFormCard t={t} />
              </motion.div>

              {/* ════ RIGHT: Robot Zara ════ */}
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.18, duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="hidden lg:flex flex-col items-center justify-end relative overflow-visible py-6 pr-4"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.7, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.7, type: "spring", stiffness: 200, damping: 18 }}
                  className="absolute top-10 right-6 px-5 py-4 rounded-2xl z-20"
                  style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.28)", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}
                >
                  <motion.p animate={{ y: [0, -4, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="text-white text-sm font-semibold whitespace-nowrap">
                    {t("cta.point3")} 🤖
                  </motion.p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.85, type: "spring", stiffness: 220, damping: 18 }}
                  whileHover={{ scale: 1.06, y: -3 }}
                  className="absolute bottom-[38%] left-2 z-20 flex items-center gap-3 px-4 py-3 rounded-2xl"
                  style={{ background: "rgba(255,255,255,0.94)", backdropFilter: "blur(16px)", border: "1px solid rgba(239,68,68,0.1)", boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg,#ef4444,#f43f5e)", boxShadow: "0 4px 12px rgba(239,68,68,0.4)" }}>
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider leading-none">Độ hài lòng</p>
                    <p className="text-sm font-extrabold text-gray-900 mt-0.5 leading-none">98.5%</p>
                  </div>
                </motion.div>

                <div className="relative w-full flex items-end justify-center overflow-visible">
                  <motion.div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{ background: "radial-gradient(circle, rgba(255,255,255,0.22) 0%, transparent 70%)", filter: "blur(40px)" }}
                    animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.1, 1] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <div className="robot-float-2 scan-wrap w-full" style={{ filter: "drop-shadow(0 28px 56px rgba(0,0,0,0.3)) drop-shadow(0 0 50px rgba(255,255,255,0.08))" }}>
                    <div className="scan-line scan-line-w" style={{ animationDelay: "1.6s" }} />
                    <img
                      src="/img/mascot/zara-anh.png"
                      alt="ZARA AI"
                      className="w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[500px] xl:max-w-[580px] mx-auto h-auto object-contain transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                  <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-3xl font-extrabold tracking-[0.18em] text-white" style={{ textShadow: "0 0 18px rgba(255,255,255,0.7)" }}>
                    ZARA
                  </p>
                </div>
              </motion.div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════ */
export default function CTASection() {
  const { t } = useTranslation("common");
  const [modalOpen, setModalOpen] = useState(false);

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 36 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94] as unknown as Easing[],
      },
    },
  };

  const stagger: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  };

  const points = [t("cta.point1"), t("cta.point2"), t("cta.point3")];

  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % points.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');

        @keyframes robot-float {
          0%,100% { transform: translateY(0) rotate(-1deg); }
          50%      { transform: translateY(-16px) rotate(1deg); }
        }
        @keyframes scan-line {
          0%,100% { top: -4px; opacity: 0; }
          10%      { opacity: 1; }
          90%      { opacity: 1; }
          100%     { top: 105%; opacity: 0; }
        }
        @keyframes btn-shine {
          from { transform: translateX(-120%); }
          to   { transform: translateX(120%); }
        }

        .robot-float { animation: robot-float 5s ease-in-out infinite; }
        .robot-float-2 { animation: robot-float 5.5s ease-in-out infinite; animation-delay: 0.9s; }

        .scan-wrap { position: relative; overflow: hidden; }
        .scan-line {
          position: absolute; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, rgba(239,68,68,0.55), transparent);
          animation: scan-line 3.2s ease-in-out infinite;
          pointer-events: none; z-index: 5;
        }
        .scan-line-w {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent);
        }

        .cta-btn { position: relative; overflow: hidden; }
        .cta-btn::after {
          content:''; position:absolute; inset:0;
          background: linear-gradient(105deg,transparent 38%,rgba(255,255,255,0.28) 50%,transparent 62%);
          transform: translateX(-120%);
          pointer-events: none;
        }
        .cta-btn:hover::after { animation: btn-shine 0.65s ease forwards; }
      `}</style>

      {/* ═══════ HERO SECTION (giữ nguyên hoàn toàn) ═══════ */}
      <div
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #ffffff 0%, #fff5f5 45%, #fef2f2 75%, #fff1f2 100%)",
        }}
      >
        <motion.div
          className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(239,68,68,0.07) 0%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-20 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(244,63,94,0.06) 0%, transparent 70%)",
          }}
          animate={{ scale: [1.1, 1, 1.1] }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(to right,#dc2626 1px,transparent 1px),linear-gradient(to bottom,#dc2626 1px,transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        <Particles count={18} light />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16 grid lg:grid-cols-2 gap-12 xl:gap-16 items-center">
          {/* Robot Dex */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex justify-center lg:justify-end order-2 lg:order-1"
          >
            <div className="relative w-full max-w-[560px] mx-auto flex items-center justify-center">
              <motion.div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, rgba(239,68,68,0.18) 20%, transparent 70%)",
                  filter: "blur(28px)",
                  transform: "scale(0.85)",
                }}
                animate={{ opacity: [0.5, 1, 0.5], scale: [0.85, 0.95, 0.85] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <div
                className="robot-float scan-wrap"
                style={{
                  filter:
                    "drop-shadow(0 28px 56px rgba(239,68,68,0.22)) drop-shadow(0 8px 16px rgba(0,0,0,0.08))",
                }}
              >
                <div className="scan-line" />
                <img
                  src="/img/mascot/Dex-logo.png"
                  alt="AI Assistant"
                  className="
                    w-full
                    max-w-[420px]
                    sm:max-w-[440px]
                    md:max-w-[480px]
                    lg:max-w-[520px]
                    xl:max-w-[560px]
                    h-auto
                    object-contain
                    transition-transform duration-700
                    hover:scale-105
                  "
                />
                <p
                  className="-mt-20 ml-35 text-3xl font-extrabold tracking-[0.15em] text-red-500 lg:ml-58 lg:mb-8"
                  style={{
                    textShadow: "0 0 18px rgba(255,255,255,0.7)",
                  }}
                >
                  DEX
                </p>
              </div>

              <StatCard
                pos="left-[-10%] top-[25%]"
                label="Độ hài lòng"
                value="98.5%"
                delay={0.7}
                icon={
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                }
              />
              <StatCard
                pos="right-[-0%] bottom-[25%]"
                label="Người dùng"
                value="12,400+"
                delay={0.9}
                icon={
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                }
              />
            </div>
          </motion.div>

          {/* Text content */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="order-1 lg:order-2 text-center lg:text-left"
          >
            <motion.div variants={fadeUp}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 280, damping: 18 }}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold tracking-widest uppercase"
                style={{
                  background:
                    "linear-gradient(135deg,rgba(239,68,68,0.1) 0%,rgba(244,63,94,0.06) 100%)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  color: "#dc2626",
                  boxShadow:
                    "0 0 24px rgba(239,68,68,0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
                }}
              >
                <motion.span
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ⚡
                </motion.span>
                {t("cta.badge")}
              </motion.div>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="
                mt-6
                text-3xl
                sm:text-4xl
                lg:text-[3.4rem]
                font-bold
                leading-[1.2]
                tracking-[-0.015em]
                max-w-[720px]
                bg-gradient-to-r
                from-gray-900
                via-red-600
                to-rose-600
                bg-clip-text
                text-transparent
              "
            >
              {t("cta.headline")}
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mt-5 text-[17px] text-gray-500 max-w-lg mx-auto lg:mx-0 leading-relaxed"
            >
              {t("cta.description")}
            </motion.p>

            <ul className="mt-8 space-y-4 max-w-md mx-auto lg:mx-0">
              {points.map((item, i) => (
                <li
                  key={i}
                  className={`
        flex items-center gap-5 px-5 py-3.5 rounded-xl transition-all duration-500 ease-out
        ${
          active === i
            ? "bg-gradient-to-r from-red-600/25 to-rose-600/15 border border-red-400/60 scale-[1.05] shadow-[0_12px_40px_rgba(239,68,68,0.4)] backdrop-blur-md"
            : "bg-white/5 border border-transparent opacity-85 hover:opacity-100 hover:bg-white/10 hover:border-red-500/30 hover:scale-[1.02]"
        }
      `}
                >
                  <span
                    className={`
          flex-shrink-0 w-4 h-4 rounded-full transition-all duration-400
          ${
            active === i
              ? "bg-gradient-to-br from-red-500 to-rose-500 scale-130 shadow-[0_0_20px_rgba(239,68,68,0.9)] ring-4 ring-red-500/50"
              : "bg-red-400/60"
          }
        `}
                  />

                  <span
                    className={`
          font-semibold text-[15.5px] sm:text-[16px] lg:text-[16.5px] leading-tight transition-all duration-500
          ${
            active === i
              ? "text-white font-extrabold text-[16.5px] sm:text-[17px] lg:text-[18px] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] tracking-wide brightness-125 scale-[1.02]"
              : "text-red-500 font-bold tracking-wide"
          }
        `}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <motion.div
              variants={fadeUp}
              className="mt-10 flex justify-center lg:justify-start"
            >
              {/* ── Nút này giờ mở modal thay vì scroll ── */}
              <motion.button
                onClick={() => setModalOpen(true)}
                whileHover={{ scale: 1.04, y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="cta-btn w-full sm:w-auto px-8 sm:px-11 py-[16px] sm:py-[18px] rounded-2xl text-white font-bold text-[17px] tracking-wide"
                style={{
                  background:
                    "linear-gradient(135deg, #ef4444 0%, #e11d48 100%)",
                  boxShadow:
                    "0 14px 44px rgba(239,68,68,0.42), 0 4px 12px rgba(239,68,68,0.18), inset 0 1px 0 rgba(255,255,255,0.15)",
                }}
              >
                <span className="flex items-center gap-2">
                  {t("cta.button")}
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ═══════ REGISTRATION MODAL ═══════ */}
      <RegistrationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        t={t}
      />
    </section>
  );
}