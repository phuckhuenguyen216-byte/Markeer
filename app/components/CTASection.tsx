/* eslint-disable react-hooks/purity */
"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence, Easing, Variants } from "framer-motion";
import "../i18n";


/* ─────────────── Floating Particles ─────────────── */
function Particles({ count = 22, light = false }: { count?: number; light?: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${light ? "bg-red-400/25" : "bg-white/15"}`}
          style={{
            width: Math.random() * 5 + 2,
            height: Math.random() * 5 + 2,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -(Math.random() * 40 + 20), 0],
            x: [0, (Math.random() - 0.5) * 20, 0],
            opacity: [0.15, 0.7, 0.15],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: Math.random() * 4 + 4,
            repeat: Infinity,
            delay: Math.random() * 6,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}


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
        boxShadow: "0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(239,68,68,0.06)",
      }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: "linear-gradient(135deg, #ef4444, #f43f5e)", boxShadow: "0 4px 12px rgba(239,68,68,0.4)" }}
      >
        {icon}
      </div>
      <div>
        <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider leading-none">{label}</p>
        <p className="text-sm font-extrabold text-gray-900 mt-0.5 leading-none">{value}</p>
      </div>
    </motion.div>
  );
}

/* ─────────────── Fancy form input ─────────────── */
function FancyInput({
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

  const sharedClass = "w-full px-5 py-4 rounded-2xl text-gray-900 placeholder-gray-400 text-[15px]";

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
}

/* ─────────────── Feature bullet ─────────────── */
function FeatureItem({ text, index }: { text: string; index: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, x: -28 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.25 + index * 0.13, ease: [0.22, 0.68, 0, 1.2] }}
      className="flex items-center gap-3 text-gray-700"
    >
      <motion.div
        whileHover={{ scale: 1.3, rotate: 8 }}
        className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          background: "linear-gradient(135deg, #ef4444, #f43f5e)",
          boxShadow: "0 4px 10px rgba(239,68,68,0.35)",
        }}
      >
        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </motion.div>
      <span className="text-[15px] font-medium leading-snug">{text}</span>
    </motion.li>
  );
}

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
        transition={{ type: "spring", stiffness: 280, damping: 18, delay: 0.12 }}
        className="w-20 h-20 rounded-full flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)", boxShadow: "0 8px 32px rgba(34,197,94,0.4)" }}
      >
        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </motion.div>
      <motion.h4 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }} className="text-2xl font-extrabold text-gray-950">
        Đăng ký thành công! 🎉
      </motion.h4>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-gray-500 max-w-xs text-sm leading-relaxed">
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

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════ */
export default function CTASection() {
  const { t } = useTranslation("common");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const scrollToForm = () => document.getElementById("registration-form")?.scrollIntoView({ behavior: "smooth" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1800);
  };

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

      {/* ═══════ HERO SECTION (giữ nguyên) ═══════ */}
      <div
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #ffffff 0%, #fff5f5 45%, #fef2f2 75%, #fff1f2 100%)" }}
      >
        <motion.div
          className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(239,68,68,0.07) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-20 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(244,63,94,0.06) 0%, transparent 70%)" }}
          animate={{ scale: [1.1, 1, 1.1] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage: "linear-gradient(to right,#dc2626 1px,transparent 1px),linear-gradient(to bottom,#dc2626 1px,transparent 1px)",
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
                  background: "radial-gradient(circle, rgba(239,68,68,0.18) 20%, transparent 70%)",
                  filter: "blur(28px)",
                  transform: "scale(0.85)",
                }}
                animate={{ opacity: [0.5, 1, 0.5], scale: [0.85, 0.95, 0.85] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />

              <div
                className="robot-float scan-wrap"
                style={{ filter: "drop-shadow(0 28px 56px rgba(239,68,68,0.22)) drop-shadow(0 8px 16px rgba(0,0,0,0.08))" }}
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

              <StatCard pos="left-[-10%] top-[25%]" label="Độ hài lòng" value="98.5%" delay={0.7} icon={<svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>} />
              <StatCard pos="right-[-0%] bottom-[25%]" label="Người dùng" value="12,400+" delay={0.9} icon={<svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/></svg>} />
            </div>
          </motion.div>

          {/* Text content */}
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="order-1 lg:order-2 text-center lg:text-left">
            <motion.div variants={fadeUp}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 280, damping: 18 }}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold tracking-widest uppercase"
                style={{
                  background: "linear-gradient(135deg,rgba(239,68,68,0.1) 0%,rgba(244,63,94,0.06) 100%)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  color: "#dc2626",
                  boxShadow: "0 0 24px rgba(239,68,68,0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
                }}
              >
                <motion.span animate={{ scale: [1,1.4,1], opacity:[1,0.5,1] }} transition={{ duration: 1.5, repeat: Infinity }}>⚡</motion.span>
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

            <motion.p variants={fadeUp} className="mt-5 text-[17px] text-gray-500 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              {t("cta.description")}
            </motion.p>

            <ul className="mt-8 space-y-4 max-w-md mx-auto lg:mx-0">
  {points.map((item, i) => (
    <li
      key={i}
      className={`
        flex items-center gap-5 px-5 py-3.5 rounded-xl transition-all duration-500 ease-out
        ${active === i
          ? "bg-gradient-to-r from-red-600/25 to-rose-600/15 border border-red-400/60 scale-[1.05] shadow-[0_12px_40px_rgba(239,68,68,0.4)] backdrop-blur-md"
          : "bg-white/5 border border-transparent opacity-85 hover:opacity-100 hover:bg-white/10 hover:border-red-500/30 hover:scale-[1.02]"
        }
      `}
    >
      <span
        className={`
          flex-shrink-0 w-4 h-4 rounded-full transition-all duration-400
          ${active === i
            ? "bg-gradient-to-br from-red-500 to-rose-500 scale-130 shadow-[0_0_20px_rgba(239,68,68,0.9)] ring-4 ring-red-500/50"
            : "bg-red-400/60"
          }
        `}
      />

      <span 
        className={`
          font-semibold text-[15.5px] sm:text-[16px] lg:text-[16.5px] leading-tight transition-all duration-500
          ${active === i 
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

            <motion.div variants={fadeUp} className="mt-10 flex justify-center lg:justify-start">
              <motion.button
                onClick={scrollToForm}
                whileHover={{ scale: 1.04, y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="cta-btn w-full sm:w-auto px-8 sm:px-11 py-[16px] sm:py-[18px] rounded-2xl text-white font-bold text-[17px] tracking-wide"
                style={{
                  background: "linear-gradient(135deg, #ef4444 0%, #e11d48 100%)",
                  boxShadow: "0 14px 44px rgba(239,68,68,0.42), 0 4px 12px rgba(239,68,68,0.18), inset 0 1px 0 rgba(255,255,255,0.15)",
                }}
              >
                <span className="flex items-center gap-2">
                  {t("cta.button")}
                  <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>→</motion.span>
                </span>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ═══════ FORM SECTION - Bob-logo to hơn nữa ═══════ */}
      <div
        id="registration-form"
        className="relative overflow-hidden py-6 md:py-8"
        style={{ background: "linear-gradient(148deg, #dc2626 0%, #be123c 55%, #9f1239 100%)" }}
      >
        <div className="absolute top-0 inset-x-0 h-px pointer-events-none" style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)" }} />

        <motion.div
          className="absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)", filter: "blur(50px)" }}
          animate={{ scale: [1,1.15,1], opacity:[0.6,1,0.6] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-20 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(253,164,175,0.15) 0%, transparent 70%)", filter: "blur(40px)" }}
          animate={{ scale: [1.1,1,1.1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        <Particles count={28} light={false} />

        <div className="relative max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">

          {/* Form card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div
              className="relative rounded-3xl p-5 sm:p-6 lg:p-8 overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.97)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(255,255,255,0.25)",
                boxShadow: "0 40px 100px rgba(0,0,0,0.28), 0 8px 24px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.8)",
              }}
            >
              <div className="absolute top-0 left-10 right-10 h-[3px] rounded-b-full" style={{ background: "linear-gradient(90deg, #ef4444, #f43f5e, #ef4444)" }} />

              <AnimatePresence>{submitted && <SuccessOverlay onReset={() => setSubmitted(false)} />}</AnimatePresence>

              <motion.h3
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="
                  text-2xl 
                  lg:text-[2rem] 
                  font-bold 
                  mb-7 
                  leading-[1.25]
                  bg-gradient-to-r 
                  from-gray-900 
                  via-red-600 
                  to-rose-500 
                  bg-clip-text 
                  text-transparent
                "
              >
                {t("cta.headline")}
              </motion.h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                {[
                  { type: "text", placeholder: t("cta.namePlaceholder") || "Họ và tên", required: true },
                  { type: "email", placeholder: t("cta.emailPlaceholder") || "Email của bạn", required: true },
                ].map((field, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.18 + i * 0.12 }}>
                    <FancyInput {...field} />
                  </motion.div>
                ))}

                <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.42 }}>
                  <FancyInput rows={4} placeholder={t("cta.messagePlaceholder") || "Bạn muốn bắt đầu từ đâu?"} />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.56 }}>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={!isSubmitting ? { scale: 1.02, y: -2 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                    className={`cta-btn relative w-full py-3 rounded-2xl font-bold text-[17px] text-white ${isSubmitting ? "cursor-not-allowed" : ""}`}
                    style={{
                      background: isSubmitting ? "#9ca3af" : "linear-gradient(135deg, #ef4444 0%, #e11d48 100%)",
                      boxShadow: isSubmitting ? "none" : "0 10px 32px rgba(239,68,68,0.45), inset 0 1px 0 rgba(255,255,255,0.15)",
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
                        <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          {t("cta.button")}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </motion.div>
              </form>

              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.72 }} className="mt-7 flex flex-wrap gap-5 justify-center lg:justify-start">
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
          </motion.div>

          {/* Robot Bob - TO HƠN THÊM */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex justify-center order-last lg:justify-end lg:-mr-12 xl:-mr-16"
          >
            <div className="relative w-full max-w-[750px] lg:max-w-[850px] xl:max-w-[950px] py-4 lg:py-4 flex items-center justify-center overflow-visible">
              <motion.div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(255,255,255,0.22) 0%, transparent 70%)", filter: "blur(36px)" }}
                animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.1, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />

              <div
                className="robot-float-2 scan-wrap w-full max-w-none"
                style={{ filter: "drop-shadow(0 28px 56px rgba(0,0,0,0.3)) drop-shadow(0 0 50px rgba(255,255,255,0.08))" }}
              >
                <div className="scan-line scan-line-w" style={{ animationDelay: "1.6s" }} />
                <img
                  src="/img/mascot/zara-anh.png"
                  alt="AI Assistant"
                  className={`
                    w-full
                    max-w-[420px] sm:max-w-[480px] md:max-w-[440px]
                    lg:max-w-[620px] xl:max-w-[720px] 2xl:max-w-[800px]
                    lg:scale-115 xl:scale-100 2xl:scale-105
                    h-auto object-contain
                    transition-transform duration-700
                    hover:scale-105 lg:hover:scale-110
                  `}
                />
                <p
  className="-mt-20 ml-35 text-3xl font-extrabold tracking-[0.15em] text-white lg:ml-58 lg:mb-8"
  style={{
    textShadow: "0 0 18px rgba(255,255,255,0.7)",
  }}
>
  ZARA
</p>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.7, y: 10 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.65, type: "spring", stiffness: 200, damping: 18 }}
                className="hidden lg:block absolute top-18 -right-2 px-5 py-4 rounded-2xl"
                style={{
                  background: "rgba(255,255,255,0.18)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.28)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                }}
              >
                <motion.p animate={{ y: [0, -4, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="text-white text-sm font-semibold whitespace-nowrap">
                  {t("cta.point3")} 🤖
                </motion.p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}