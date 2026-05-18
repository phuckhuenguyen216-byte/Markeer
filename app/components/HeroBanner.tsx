"use client";

import { useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import ConsultationForm from "./ConsultationForm";
import "../i18n";

export default function HeroSection() {
  const { t } = useTranslation("common");
  const [showConsultation, setShowConsultation] = useState(false);
  const [mobileTab, setMobileTab] = useState<number | null>(null);

  const mobileTabs = [
    { icon: "🎯", label: t("consultation.tab1Title") },
    { icon: "💻", label: t("consultation.tab2Title") },
    { icon: "🔥", label: t("consultation.tab3Title") },
  ];

  const consultationToggle = (
    <button
      type="button"
      onClick={() => { setShowConsultation((v) => !v); setMobileTab(null); }}
      className="relative flex items-center justify-center gap-2 w-full px-4 py-3 rounded-full
      bg-linear-to-r from-red-500 via-rose-500 to-orange-400
      text-white font-semibold text-sm shadow-lg border border-white/30 overflow-hidden cursor-pointer"
      aria-expanded={showConsultation}
    >
      <span>🎯</span>
      <span className="relative z-10">{t("solutions.title")}</span>
      <span suppressHydrationWarning className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent animate-tech-shine" />
    </button>
  );

  return (
    <>
      {/* ==================== MOBILE: redesigned hero ==================== */}
      <div className="block md:hidden">

        {/* Banner image — starts at y=0, fixed header overlays top naturally */}
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "390 / 260" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/bannermobile.png"
            alt="Markee AI Banner"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Fade bottom → brand red */}
          <div
            className="absolute bottom-0 left-0 right-0 h-16"
            style={{ background: "linear-gradient(to bottom, transparent, #d42b4e)" }}
          />
        </div>

        {/* Content section — seamless continuation from banner */}
        <div style={{ background: "linear-gradient(135deg, #d42b4e 0%, #e8294c 60%, #c0392b 100%)" }}>
          <div className="px-5 pt-3 pb-7">

            {/* Headline */}
            <h1 className="text-2xl font-black text-white leading-tight mb-2 tracking-tight uppercase">
              {t("hero.headline")}
            </h1>

            {/* Subheadline */}
            <p className="text-sm font-medium text-white/80 leading-snug mb-4">
              {t("hero.subheadline")}
            </p>

            {/* Offer highlight box — click to app */}
            <a
              href="https://app.markeeai.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-yellow-400/20 border border-yellow-300/50 rounded-2xl px-3 py-2.5 mb-5 hover:bg-yellow-400/30 transition-colors"
            >
              <span className="text-yellow-300 shrink-0">🎁</span>
              <span className="text-yellow-100 text-xs font-semibold leading-snug">
                <Trans
                  i18nKey="hero.offer"
                  components={{
                    strong: <span className="text-yellow-300 font-bold" />,
                  }}
                />
              </span>
            </a>

            {consultationToggle}
            {showConsultation && (
              <div
                className="mt-3 rounded-2xl overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.9)",
                  border: "1px solid rgba(255,255,255,0.7)",
                  boxShadow: "0 16px 40px rgba(15,23,42,0.18)",
                  backdropFilter: "blur(14px)",
                }}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-3">
                  <div>
                    <p style={{
                      fontSize: 11, fontWeight: 800, letterSpacing: "0.1em",
                      textTransform: "uppercase", margin: "0 0 3px",
                      background: "linear-gradient(90deg,#201e1e,#ad2e2e,#ff2a2a)",
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                    }}>
                      {t("solutions.title")}
                    </p>
                    <h2 style={{
                      fontSize: 20, fontWeight: 800, lineHeight: 1.12, margin: 0,
                      textTransform: "uppercase",
                      background: "linear-gradient(90deg,#201e1e,#350707,#ad2e2e,#ff2a2a)",
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                    }}>
                      {t("consultation.sectionTitle")}
                    </h2>
                    <p style={{ color: "#64748b", fontSize: 12, marginTop: 4 }}>
                      {t("consultation.sectionSubtitle")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setShowConsultation(false); setMobileTab(null); }}
                    aria-label="Đóng"
                    style={{
                      width: 32, height: 32, borderRadius: "50%", border: "1px solid rgba(225,29,72,0.2)",
                      background: "#fff", color: "#e11d48", fontSize: 18, fontWeight: 900,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", flexShrink: 0,
                    }}
                  >
                    ×
                  </button>
                </div>

                {/* Accordion items */}
                <div className="px-3 pb-3 space-y-2">
                  {mobileTabs.map((tab, i) => (
                    <div key={i}>
                      <button
                        type="button"
                        onClick={() => setMobileTab(mobileTab === i ? null : i)}
                        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl font-bold text-sm border transition-all duration-200 cursor-pointer ${
                          mobileTab === i
                            ? "bg-red-50 text-red-600 border-red-300 shadow-sm"
                            : "bg-white text-gray-700 border-gray-200 hover:border-red-200"
                        }`}
                      >
                        <span className="flex items-center gap-2.5 text-left">
                          <span className="text-base">{tab.icon}</span>
                          <span>{tab.label}</span>
                        </span>
                        <span className={`transition-transform duration-200 shrink-0 text-xs ml-2 text-gray-400 ${mobileTab === i ? "rotate-180" : ""}`}>▼</span>
                      </button>
                      {mobileTab === i && (
                        <div className="mt-2">
                          <ConsultationForm
                            variant="embedded"
                            initialTab={i}
                            hideTabs
                            onClose={() => setMobileTab(null)}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ==================== DESKTOP: giữ nguyên ==================== */}
      <section
        className="hidden md:flex relative min-h-screen w-full -mt-16 items-center bg-cover bg-center"
        style={{
          backgroundImage: "url('/img/mascot/banner.png')",
          position: "relative",
          zIndex: 1,
          isolation: "isolate",
        }}
      >
        {/* Góc trên phải */}
        <div
          className="absolute text-white text-center
          bg-[url('/images/tech-bg-red.jpg')] bg-cover bg-center bg-no-repeat
          p-8 rounded-2xl right-[0%] top-[8%] max-w-[820px]"
          style={{ zIndex: 20 }}
        >
          <h2
            className="font-black mb-3 mx-auto text-white leading-tight uppercase tracking-tight text-4xl md:text-5xl max-w-2xl"
            style={{
              textShadow: `
                0 2px 4px rgba(0,0,0,0.6),
                0 4px 8px rgba(0,0,0,0.5),
                0 8px 16px rgba(0,0,0,0.4),
                0 12px 24px rgba(0,0,0,0.35)
              `,
            }}
          >
            {t("hero.headline")}
          </h2>
          <p
            className="text-base md:text-lg font-medium text-white/85 mx-auto mb-2 max-w-xl"
            style={{
              textShadow: "0 2px 4px rgba(0,0,0,0.5)",
            }}
          >
            {t("hero.subheadline")}
          </p>

          <div className="flex justify-center -mt-5 mb-2 -translate-x-6">
            <div
              className="relative p-0 rounded-xl
              bg-[url('/img/mascot/bieudo-logo.png')]
              bg-contain bg-no-repeat bg-center"
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-[76vw] max-w-[760px] rounded-xl"
              >
                <source src="/videos/ANIMATION-LOGO.webm" type="video/webm" />
              </video>
            </div>
          </div>
        </div>

        {/* Góc trái dưới */}
        <div
          className={`absolute text-white ${
            showConsultation
              ? "left-[3%] top-[120px] w-[min(880px,calc(100vw-460px))]"
              : "left-[5%] bottom-[12%] md:bottom-[12%] max-w-[650px]"
          }`}
          style={{ zIndex: 30 }}
        >
          {!showConsultation && (
            <a
              href="https://app.markeeai.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex items-center justify-center gap-2 w-full px-4 py-3 rounded-full mb-4
              bg-linear-to-r from-red-500 via-rose-500 to-orange-400
              text-white font-semibold text-sm shadow-lg border border-white/30 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
            >
              <span>🎁</span>
              <span><Trans i18nKey="hero.offer" components={{ strong: <span className="font-bold" /> }} /></span>
              <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent animate-tech-shine" />
            </a>
          )}

          <div className={showConsultation ? "w-full" : "w-[min(620px,90vw)] mx-auto"}>
            {!showConsultation && consultationToggle}
            {showConsultation && (
              <div className="origin-top-left scale-[0.98]">
                <ConsultationForm variant="embedded" onClose={() => setShowConsultation(false)} />
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
