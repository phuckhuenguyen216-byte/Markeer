import React from "react";
import Link from "next/link";
import { useTranslation, Trans } from "react-i18next";
import "../i18n";

export default function HeroSection() {
  const { t } = useTranslation("common");

  return (
    <section
      className="relative min-h-screen w-full flex -mt-16 items-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/img/mascot/banner.png')",
      }}
    >
      {/* ==================== DESKTOP - GIỮ NGUYÊN 100% ==================== */}
      <div
        className="hidden md:block absolute right-[0%] top-[8%] text-white max-w-[900px] text-center
        bg-[url('/images/tech-bg-red.jpg')] bg-cover bg-center bg-no-repeat
        p-8 rounded-2xl"
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
              className="w-[90vw] max-w-[950px] min-w-[750px] rounded-xl"
            >
              <source src="/videos/ANIMATION-LOGO.webm" type="video/webm" />
            </video>
          </div>
        </div>
      </div>

                  {/* ==================== MOBILE - CHỈNH CHUẨN, NỀN ĐEN MỜ NHẸ ==================== */}
      <div className="block md:hidden relative w-full min-h-[85dvh] pt-20 pb-16 text-white text-center overflow-hidden">
        
        {/* Overlay nền đen - MỜ NHẸ như yêu cầu */}
        <div 
          className="absolute inset-0 bg-gradient-to-b 
                     from-black/35 via-black/25 to-black/15 z-0" 
        />

        <div className="relative z-10 px-6 max-w-[360px] mx-auto flex flex-col justify-center min-h-[85dvh]">
          
          {/* Brand */}
          <h1 
            className="text-5xl font-bold mb-4 leading-tight text-white"
            // style={{
            //   textShadow: `
            //     0 4px 8px rgba(0,0,0,0.55),
            //     0 8px 16px rgba(0,0,0,0.45),
            //     0 12px 24px rgba(0,0,0,0.35)
            //   `,
            // }}
          >
            {t("hero.brand")}
          </h1>

          {/* Headline */}
          <h2 
            className="text-[23px] font-bold mb-9 leading-tight px-3 text-center text-white"
            // style={{
            //   textShadow: `
            //     0 4px 10px rgba(0,0,0,0.9),
            //     0 8px 20px rgba(0,0,0,0.8),
            //     0 14px 28px rgba(0,0,0,0.7)
            //   `,
            // }}
          >
            {t("hero.headline")}
          </h2>

          {/* Offer Text */}
          <p className="text-[16.5px] font-semibold mb-11 px-4 leading-relaxed text-white drop-shadow-xl">
            <Trans
              i18nKey="hero.offer"
              components={{
                strong: <span className="text-white-400 text-xl font-bold" />,
              }}
            />
          </p>

          {/* Buttons */}
          <div className="flex flex-col items-center gap-5 w-full max-w-[310px]">
            {/* BADGE */}
            <div
              className="relative inline-flex items-center justify-center gap-3 w-full px-6 py-4 rounded-full
              bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400
              text-white font-semibold text-base shadow-lg
              border border-white/30 backdrop-blur-md animate-tech-glow overflow-hidden"
            >
              <span className="text-2xl">🎁</span>
              <span className="relative z-10">{t("hero.badge")}</span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-tech-shine"></span>
            </div>

            {/* CTA BUTTON */}
            <Link
              href="https://app.markeeai.com"
              target="_blank"
              className="relative inline-flex items-center justify-center gap-3 w-full px-6 py-4 rounded-full
              bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400
              text-white font-semibold text-base shadow-lg
              border border-white/30 backdrop-blur-md animate-tech-glow overflow-hidden"
            >
              <span className="text-2xl">📝</span>
              <span className="relative z-10">{t("hero.cta")}</span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-tech-shine"></span>
            </Link>
          </div>
        </div>
      </div>

      {/* ==================== BÊN TRÁI DƯỚI - CHỈ DESKTOP ==================== */}
      <div className="hidden md:block absolute left-[8%] bottom-[12%] md:left-[10%] md:bottom-[12%] text-white max-w-[650px]">
        <p className="text-lg md:text-2xl font-semibold mb-8 flex justify-center text-center">
          <Trans
            i18nKey="hero.offer"
            components={{
              strong: <span className="text-red-500 font-bold" />,
            }}
          />
        </p>

        <div className="flex items-center justify-center gap-6 flex-wrap">
          {/* BADGE */}
          <div
            className="relative inline-flex items-center justify-center gap-3 w-[220px] px-6 py-3 rounded-full
            bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400
            text-white font-semibold text-base
            border border-white/20
            backdrop-blur-md
            animate-tech-glow
            overflow-hidden"
          >
            <span className="text-lg">🎁</span>
            <span className="relative z-10">{t("hero.badge")}</span>
            <span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent
              animate-tech-shine"
            ></span>
          </div>

          {/* CTA */}
          <Link
            href="https://app.markeeai.com"
            target="_blank"
            className="relative inline-flex items-center justify-center gap-3 w-[250px] px-6 py-3 rounded-full
            bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400
            text-white font-semibold text-base
            border border-white/20
            backdrop-blur-md
            animate-tech-glow
            overflow-hidden"
          >
            <span className="text-lg">📝</span>
            <span className="relative z-10">{t("hero.cta")}</span>
            <span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent
              animate-tech-shine"
            ></span>
          </Link>
        </div>
      </div>
    </section>
  );
}