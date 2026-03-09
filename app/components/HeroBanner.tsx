import React from "react";
import Link from "next/link";
import { useTranslation, Trans } from "react-i18next";
import "../i18n";

export default function HeroSection() {
  const { t } = useTranslation("common");

  return (
    <section
      className="relative min-h-screen flex items-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/img/mascot/banner.png')",
      }}
    >
      {/* BÊN PHẢI */}
      <div
        className="hidden md:block absolute right-[0%] top-[8%] text-white max-w-[900px] text-center
        bg-[url('/images/tech-bg-red.jpg')] bg-cover bg-center bg-no-repeat
        p-8 rounded-2xl"
      >

        {/* <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
          {t("hero.brand")}
        </h1> */}

   <h2
  className="text-2xl md:text-3xl font-bold mb-6 max-w-xl mx-auto text-white"
  style={{
    textShadow: `
      0 2px 4px rgba(0,0,0,0.6),
      0 4px 8px rgba(0,0,0,0.5),
      0 8px 16px rgba(0,0,0,0.4),
      0 12px 24px rgba(0,0,0,0.35)
    `
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

        {/* TECH BADGE */}
        

      </div>

      {/* ================================================
          PHẦN MOBILE - layout dọc, centered, nhỏ gọn
      ================================================ */}
      <div className="block md:hidden w-full px-5 -mt-66 pb-20 text-white text-center">
        <h1 className="text-4xl font-bold mb-3 leading-tight">
          {t("hero.brand")}
        </h1>

        <h2 className="text-xl font-bold mb-6 px-4 max-w-md mx-auto">
          {t("hero.headline")}
        </h2>

        {/* VIDEO - Mobile: nhỏ hơn, full width nhưng có giới hạn */}
        <div className="flex justify-center mb-8">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full max-w-[320px] sm:max-w-[380px]"
          >
            <source src="/videos/ANIMATION-LOGO.webm" type="video/webm" />
          </video>
        </div>

        {/* TECH BADGE - Mobile: nhỏ hơn một chút */}
        <div
          className="
            inline-flex items-center gap-2 px-5 py-3 rounded-full mx-auto
            bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400
            text-white font-semibold text-base
            border border-white/20
            backdrop-blur-md
            animate-tech-glow
            overflow-hidden
          "
        >
          <span className="text-xl">🎁</span>
          <span className="relative z-10">{t("hero.badge")}</span>
          <span
            className="
              absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent
              animate-tech-shine
            "
          />
        </div>
      </div>

      {/* BÊN TRÁI DƯỚI */}
<div className="absolute left-[8%] bottom-[12%] md:left-[10%] md:bottom-[12%] text-white max-w-[650px]">

  {/* TEXT */}
  <p className="text-lg md:text-2xl font-semibold mb-8 flex justify-center text-center">
    <Trans
      i18nKey="hero.offer"
      components={{
        strong: <span className="text-red-500 font-bold" />,
      }}
    />
  </p>

  {/* BUTTONS */}
  <div className="flex items-center justify-center gap-6 flex-wrap">

    {/* BADGE */}
    <div
      className="relative inline-flex items-center gap-3 px-6 py-3 rounded-full
      bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400
      text-white font-semibold text-base
      border border-white/20
      backdrop-blur-md
      animate-tech-glow
      overflow-hidden"
    >
      <span className="text-lg">🎁</span>

      <span className="relative z-10">
        {t("hero.badge")}
      </span>

      {/* ánh sáng chạy */}
      <span
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent
        animate-tech-shine"
      ></span>
    </div>
    <Link
  href="https://app.markeeai.com"
  target="_blank"
  className="relative inline-flex items-center gap-3 px-6 py-3 rounded-full
  bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400
  text-white font-semibold text-base
  border border-white/20
  backdrop-blur-md
  animate-tech-glow
  overflow-hidden"
>

  <span className="relative z-10">
    {t("hero.cta")}
  </span>

  <span
    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent
    animate-tech-shine"
  ></span>

</Link>

    {/* CTA BUTTON */}
    {/* <Link
      href="https://app.markeeai.com"
      target="_blank"
      className="
      relative inline-block
      px-8 py-3
      font-semibold text-white
      bg-gradient-to-r from-blue-600 to-purple-600
      overflow-hidden
      skew-x-[-20deg]
      transition-all duration-300
      group
      hover:shadow-[0_0_25px_rgba(168,85,247,0.7)]
      hover:scale-105
      "
    >

      <span className="relative z-10 skew-x-[20deg] group-hover:text-white transition-colors duration-300">
        {t("hero.cta")}
      </span>

      <span
        className="
        absolute top-0 left-0
        w-0 h-full
        bg-red-400
        transition-all duration-500
        group-hover:w-full
        "
      ></span>

    </Link> */}

  </div>
</div>
    </section>
  );
}