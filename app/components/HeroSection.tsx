/* eslint-disable react-hooks/purity */
"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Transition } from "framer-motion";
import { useTranslation, Trans } from "react-i18next";
import "../i18n";

/* Animated corner bracket */
const Corner = ({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) => {
  const base = "absolute w-5 h-5 border-red-500";
  const classes: Record<string, string> = {
    tl: "top-0 left-0 border-t-2 border-l-2",
    tr: "top-0 right-0 border-t-2 border-r-2",
    bl: "bottom-0 left-0 border-b-2 border-l-2",
    br: "bottom-0 right-0 border-b-2 border-r-2",
  };
  return <span className={`${base} ${classes[pos]}`} />;
};

export default function HeroSection() {
  const { t } = useTranslation("common");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* Particle grid canvas */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const dots: { x: number; y: number; o: number; speed: number }[] = [];
    const COLS = 20,
      ROWS = 12;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        dots.push({
          x: (c / (COLS - 1)) * canvas.width,
          y: (r / (ROWS - 1)) * canvas.height,
          o: Math.random() * 0.5 + 0.1,
          speed: Math.random() * 0.01 + 0.003,
        });
      }
    }

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach((d) => {
        d.o += d.speed;
        if (d.o > 0.6 || d.o < 0.05) d.speed *= -1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,60,60,${d.o})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const fadeUp = (delay = 0) => ({
    initial: { y: 32, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: {
      duration: 0.6,
      delay,
      ease: [0.22, 1, 0.36, 1] as const,
    } satisfies Transition,
  });

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        backgroundImage:
          "url('https://png.pngtree.com/thumb_back/fh260/background/20210422/pngtree-technology-red-line-circuit-background-with-shine-light-image_647278.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* ── Dot grid canvas ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-40 pointer-events-none"
      />

      {/* ── Subtle grid lines ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,40,40,.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,40,40,.04) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Glow blobs ── */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-rose-700/10 rounded-full blur-[100px] pointer-events-none" />

      {/* ── Horizontal scan line ── */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent pointer-events-none"
        animate={{ top: ["10%", "90%", "10%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-[1300px] mx-auto px-6 lg:px-10 w-full py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* ════ LEFT ════ */}
          <div className="flex flex-col gap-6">
            {/* eyebrow tag */}
            <motion.div {...fadeUp(0.1)} className="flex items-center gap-3">
              <span className="block w-8 h-px bg-red-500" />
              <span className="text-red-400 text-xs tracking-[0.25em] uppercase font-mono">
                AI · Marketing · Platform
              </span>
            </motion.div>

            {/* brand */}
            <motion.h1
              {...fadeUp(0.2)}
              className="text-6xl md:text-7xl font-black leading-none tracking-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              <span className="text-white">{t("hero.brand")}</span>
            </motion.h1>

            {/* headline */}
            <motion.h2
              {...fadeUp(0.3)}
              className="text-xl md:text-2xl font-semibold text-white leading-snug max-w-md"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {t("hero.headline")}
            </motion.h2>

            {/* subheadline */}
            <motion.p
              {...fadeUp(0.4)}
              className="text-base text-white leading-relaxed max-w-sm"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {t("hero.subheadline")}
            </motion.p>

            {/* badge */}
            <motion.div {...fadeUp(0.5)} className="flex items-center gap-3">
              <div className="relative flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-2 rounded-sm text-sm font-mono">
                <Corner pos="tl" />
                <Corner pos="tr" />
                <Corner pos="bl" />
                <Corner pos="br" />
                <span>🎁</span>
                <span>{t("hero.badge")}</span>
              </div>
            </motion.div>

            {/* offer */}
            <motion.p
              {...fadeUp(0.55)}
              className="text-sm text-white"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <Trans
                i18nKey="hero.offer"
                components={{
                  strong: <span className="text-red-400 font-bold" />,
                }}
              />
            </motion.p>

            {/* CTA */}
            <motion.div
              {...fadeUp(0.65)}
              className="flex items-center gap-4 pt-2"
            >
              <Link
                href="https://app.markeeai.com"
                target="_blank"
                className="
      group relative inline-flex items-center justify-center
      px-8 py-3.5
      text-sm font-semibold uppercase tracking-wider
      text-white overflow-hidden
      bg-[#0b0b0e]
      border border-red-500/40
      transition-all duration-300
    "
              >
                {/* ===== hover energy background ===== */}
                <span
                  className="
        absolute inset-0
        opacity-0
        group-hover:opacity-100
        transition duration-500
        bg-gradient-to-r
        from-transparent
        via-red-500/30
        to-transparent
        animate-[shine_1.2s_linear]
      "
                />

                {/* ===== scanning line ===== */}
                <span
                  className="
        absolute top-0 left-[-100%]
        w-full h-full
        bg-gradient-to-r
        from-transparent
        via-white/30
        to-transparent
        group-hover:left-[120%]
        transition-all duration-700
      "
                />

                {/* ===== glow explosion ===== */}
                <span
                  className="
        absolute inset-0
        opacity-0
        group-hover:opacity-100
        bg-red-500/20
        blur-xl
        transition duration-500
      "
                />

                {/* ===== tech border animate ===== */}
                <span
                  className="
        absolute inset-0
        rounded-sm
        border border-red-500/30
        group-hover:border-red-400
        group-hover:shadow-[0_0_25px_rgba(255,60,60,0.9)]
        transition-all duration-300
      "
                />

                {/* ===== button content ===== */}
                <span className="relative z-10 flex items-center gap-2">
                  {t("hero.cta")}

                  <motion.svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                    whileHover={{ x: 6 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </motion.svg>
                </span>
              </Link>

              {/* pulse indicator */}
              <div className="flex items-center gap-2 text-white/30 text-xs font-mono">
                <span className="relative flex w-2 h-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                Live
              </div>
            </motion.div>
          </div>

          {/* ════ RIGHT — Screen Frame ════ */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              ease: [0.22, 1, 0.36, 1] as const,
            }}
            className="relative flex justify-center items-center"
          >
            {/* outer frame */}
            <div className="relative w-full max-w-[560px]">
              {/* top bar */}
              <div className="flex items-center gap-2 bg-[#0f0f12] border border-red-900/40 border-b-0 px-4 py-2.5">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
                </div>
                <div className="flex-1 flex justify-center">
                  <span className="text-[10px] font-mono text-white/20 tracking-widest">
                    MARKEE · AI · PREVIEW
                  </span>
                </div>
                {/* signal bars */}
                <div className="flex items-end gap-0.5">
                  {[3, 5, 7, 9].map((h, i) => (
                    <span
                      key={i}
                      className="w-1 bg-red-500/50 rounded-sm"
                      style={{ height: h }}
                    />
                  ))}
                </div>
              </div>

              {/* screen */}
              <div className="relative border border-red-900/40 overflow-hidden bg-black">
                {/* scanlines overlay */}
                <div
                  className="absolute inset-0 z-10 pointer-events-none opacity-[0.08]"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,1) 2px, rgba(0,0,0,1) 4px)",
                  }}
                />

                {/* vignette */}
                <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(0,0,0,0.7)_100%)]" />

                {/* red corner glow */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-red-600/20 blur-2xl z-10 pointer-events-none" />

                {/* video */}
                {/* ===== Desktop Video ===== */}
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className="hidden lg:block w-full h-auto object-cover"
                >
                  <source src="/videos/video.mp4" type="video/mp4" />
                </video>

                {/* ===== Mobile Video ===== */}
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className="block lg:hidden w-full h-auto object-cover"
                >
                  <source src="/videos/video.mp4" type="video/mp4" />
                </video>
              </div>

              {/* bottom status bar */}
              <div className="flex items-center justify-between bg-[#0a0a0c] border border-red-900/40 border-t-0 px-4 py-2">
                <span className="text-[10px] font-mono text-red-500/60 tracking-widest">
                  SYS:ONLINE
                </span>
                <div className="flex items-center gap-1">
                  {[8, 14, 5, 11, 7, 13, 4, 10].map((h, i) => (
                    <motion.span
                      key={i}
                      className="block w-1 bg-red-500/50 rounded-sm"
                      animate={{ height: [2, h, 2] }}
                      transition={{
                        duration: 0.6 + i * 0.1,
                        repeat: Infinity,
                        repeatType: "mirror",
                      }}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-mono text-white/20 tracking-widest">
                  ● REC
                </span>
              </div>

              {/* Corner brackets on whole card */}
              <Corner pos="tl" />
              <Corner pos="tr" />
              <Corner pos="bl" />
              <Corner pos="br" />

              {/* floating stat chip */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-5 -left-6 bg-[#0f0f12] border border-red-900/50 px-4 py-2.5 shadow-xl shadow-black/50"
              >
                <Corner pos="tl" />
                <Corner pos="tr" />
                <Corner pos="bl" />
                <Corner pos="br" />
                <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-0.5">
                  Content Gen
                </p>
                <p className="text-2xl font-black text-white">10×</p>
              </motion.div>

              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="absolute -top-5 -right-6 bg-[#0f0f12] border border-red-900/50 px-4 py-2.5 shadow-xl shadow-black/50"
              >
                <Corner pos="tl" />
                <Corner pos="tr" />
                <Corner pos="bl" />
                <Corner pos="br" />
                <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-0.5">
                  Accuracy
                </p>
                <p className="text-2xl font-black text-red-400">98%</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Bottom border line ── */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
    </section>
  );
}
