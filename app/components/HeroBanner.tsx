import React from "react";
import Link from "next/link";
import { useTranslation, Trans } from "react-i18next";
import "../i18n";

export default function HeroSection() {
  const { t } = useTranslation("common");

  return (
    <>
      {/* ==================== MOBILE: redesigned hero ==================== */}
      <div className="block md:hidden">

        {/* Banner image — starts at y=0, fixed header overlays top naturally */}
        <div className="relative w-full" style={{ aspectRatio: "390 / 260" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/mascot/banner.png"
            alt="Markee AI Banner"
            className="absolute inset-0 w-full h-full object-cover object-left"
          />
          {/* Fade bottom → brand red */}
          <div
            className="absolute bottom-0 left-0 right-0 h-16"
            style={{ background: "linear-gradient(to bottom, transparent, #d42b4e)" }}
          />
        </div>

        {/* Content section — seamless continuation from banner */}
        <div style={{ background: "linear-gradient(135deg, #d42b4e 0%, #e8294c 60%, #c0392b 100%)" }}>
          <div className="px-5 pt-3 pb-7 pr-16">

            {/* Brand heading */}
            <h1 className="text-3xl font-black text-white leading-none mb-2 tracking-tight">
              {t("hero.brand")}
            </h1>

            {/* Headline */}
            <p className="text-sm font-semibold text-white/90 leading-snug mb-4">
              {t("hero.headline")}
            </p>

            {/* Offer highlight box */}
            <div className="flex items-start gap-2 bg-yellow-400/20 border border-yellow-300/50 rounded-2xl px-3 py-2.5 mb-5">
              <span className="text-yellow-300 shrink-0">🎁</span>
              <p className="text-yellow-100 text-xs font-semibold leading-snug">
                <Trans
                  i18nKey="hero.offer"
                  components={{
                    strong: <span className="text-yellow-300 font-bold" />,
                  }}
                />
              </p>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col gap-3">
              {/* Primary CTA */}
              <Link
                href="https://app.markeeai.com"
                target="_blank"
                className="relative flex items-center justify-center gap-2 w-full px-4 py-3 rounded-full
                bg-linear-to-r from-indigo-500 via-purple-500 to-cyan-400
                text-white font-semibold text-sm shadow-lg border border-white/30 overflow-hidden"
              >
                <span>📝</span>
                <span className="relative z-10">{t("hero.cta")}</span>
                <span suppressHydrationWarning className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent animate-tech-shine" />
              </Link>

              {/* Secondary */}
              <div
                className="relative flex items-center justify-center gap-2 w-full px-4 py-3 rounded-full
                bg-linear-to-r from-indigo-500 via-purple-500 to-cyan-400
                text-white font-semibold text-sm shadow-lg border border-white/30 overflow-hidden"
              >
                <span>🎁</span>
                <span className="relative z-10">{t("hero.badge")}</span>
                <span suppressHydrationWarning className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent animate-tech-shine" />
              </div>
            </div>

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
          className="absolute right-[0%] top-[8%] text-white max-w-[900px] text-center
          bg-[url('/images/tech-bg-red.jpg')] bg-cover bg-center bg-no-repeat
          p-8 rounded-2xl"
          style={{ zIndex: 20 }}
        >
          <h2
            className="text-2xl md:text-3xl font-bold mb-6 max-w-xl mx-auto text-white"
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

          <div className="flex justify-center mt-10 mb-6 -translate-x-6">
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
                className="w-[90vw] max-w-[950px] rounded-xl"
              >
                <source src="/videos/ANIMATION-LOGO.webm" type="video/webm" />
              </video>
            </div>
          </div>
        </div>

        {/* Góc trái dưới */}
        <div
          className="absolute left-[8%] bottom-[12%] md:left-[10%] md:bottom-[12%] text-white max-w-[650px]"
          style={{ zIndex: 20 }}
        >
          <p className="text-lg md:text-2xl font-semibold mb-8 flex justify-center text-center">
            <Trans
              i18nKey="hero.offer"
              components={{
                strong: <span className="text-red-500 font-bold" />,
              }}
            />
          </p>

          <div className="flex items-center justify-center gap-6 flex-wrap">
            <div
              className="relative inline-flex items-center justify-center gap-3 w-[220px] px-6 py-3 rounded-full
              bg-linear-to-r from-indigo-500 via-purple-500 to-cyan-400
              text-white font-semibold text-base border border-white/20 backdrop-blur-md
              animate-tech-glow overflow-hidden"
            >
              <span className="text-lg">🎁</span>
              <span className="relative z-10">{t("hero.badge")}</span>
              <span suppressHydrationWarning className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent animate-tech-shine" />
            </div>

            <Link
              href="https://app.markeeai.com"
              target="_blank"
              className="relative inline-flex items-center justify-center gap-3 w-[250px] px-6 py-3 rounded-full
              bg-linear-to-r from-indigo-500 via-purple-500 to-cyan-400
              text-white font-semibold text-base border border-white/20 backdrop-blur-md
              animate-tech-glow overflow-hidden"
            >
              <span className="text-lg">📝</span>
              <span className="relative z-10">{t("hero.cta")}</span>
              <span suppressHydrationWarning className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent animate-tech-shine" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}