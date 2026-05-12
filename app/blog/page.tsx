/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Sparkles,
  TrendingUp,
  ArrowRight,
  Eye,
  Clock,
  Zap,
  BarChart3,
  Users,
  FileText,
} from "lucide-react";
import type { BlogPost } from "@/lib/blog";
import { TAG_OPTIONS, TAG_COLOR } from "@/lib/blog";

import Footer from "../components/Footer";
import SocialMedia from "../components/SocialMedia";

function readingTime(html: string) {
  const text = html.replace(/<[^>]+>/g, "");
  return Math.max(
    1,
    Math.ceil(text.trim().split(/\s+/).filter(Boolean).length / 200),
  );
}

/* ─── Border Trace — glowing dash traveling around section perimeter ─── */
function BorderTrace({
  color = "rgba(239,68,68,0.35)",
  glow,
  duration = 10,
}: {
  color?: string;
  glow?: string;
  duration?: number;
}) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-[2]"
      preserveAspectRatio="none"
    >
      {/* Faint static border */}
      <rect
        x="0.5"
        y="0.5"
        width="calc(100% - 1px)"
        height="calc(100% - 1px)"
        fill="none"
        stroke={color.replace(/[\d.]+\)$/, "0.08)")}
        strokeWidth="1"
        rx="0"
      />
      {/* Animated glowing trace */}
      <rect
        x="0.5"
        y="0.5"
        width="calc(100% - 1px)"
        height="calc(100% - 1px)"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        rx="0"
        strokeDasharray="120 380"
        style={{
          animation: `borderTrace ${duration}s linear infinite`,
          filter: glow ? `drop-shadow(0 0 6px ${glow})` : undefined,
        }}
      />
      {/* Second trace going opposite direction for richness */}
      <rect
        x="0.5"
        y="0.5"
        width="calc(100% - 1px)"
        height="calc(100% - 1px)"
        fill="none"
        stroke={color.replace(/[\d.]+\)$/, "0.15)")}
        strokeWidth="1"
        rx="0"
        strokeDasharray="60 440"
        style={{
          animation: `borderTraceReverse ${duration * 1.4}s linear infinite`,
        }}
      />
    </svg>
  );
}

/* ─── Particles ─── */
function createParticles(count: number) {
  return Array.from({ length: count }, () => ({
    w: Math.random() * 5 + 2,
    h: Math.random() * 5 + 2,
    l: Math.random() * 100,
    t: Math.random() * 100,
    dy: -(Math.random() * 40 + 20),
    dx: (Math.random() - 0.5) * 20,
    dur: Math.random() * 4 + 4,
    del: Math.random() * 6,
  }));
}

function Particles({
  count = 22,
  light = false,
}: {
  count?: number;
  light?: boolean;
}) {
  const [particles] = useState<
    {
      w: number;
      h: number;
      l: number;
      t: number;
      dy: number;
      dx: number;
      dur: number;
      del: number;
    }[]
  >(() => createParticles(count));

  if (particles.length === 0) return null;

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
}

/* ─── Floating stat card (like CTASection) ─── */
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
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
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

const ALL_TAG = "__all__";
const FILTER_TABS = [ALL_TAG, ...TAG_OPTIONS];

export default function BlogPage() {
  const { t, i18n } = useTranslation();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(ALL_TAG);
  const [visibleCount, setVisibleCount] = useState(9);

  // Auto-translate: when language !== "vi", translate title/excerpt
  const [translatedMap, setTranslatedMap] = useState<
    Record<string, { title: string; excerpt: string }>
  >({});
  const lastTranslatedLang = useRef<string>("");

  useEffect(() => {
    fetch("/api/blogs?status=published&limit=100")
      .then((res) => res.json())
      .then((data) => setPosts(data.posts || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Auto-translate posts when language changes away from "vi"
  const translatePosts = useCallback(
    async (targetLang: string, signal?: AbortSignal) => {
      if (posts.length === 0) return;
      if (lastTranslatedLang.current === targetLang) return;

      try {
        const textsToTranslate: string[] = [];
        const postIds: string[] = [];
        posts.forEach((p) => {
          textsToTranslate.push(p.title);
          textsToTranslate.push(p.excerpt || "");
          postIds.push(p.id);
        });

        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ texts: textsToTranslate, targetLang }),
          signal,
        });

        if (!res.ok) return;
        const data = await res.json();
        const translations: string[] = data.translations;

        const newMap: Record<string, { title: string; excerpt: string }> = {};
        postIds.forEach((id, idx) => {
          newMap[id] = {
            title: translations[idx * 2] || "",
            excerpt: translations[idx * 2 + 1] || "",
          };
        });

        setTranslatedMap(newMap);
        lastTranslatedLang.current = targetLang;
      } catch {
        // silently fail — show original
      }
    },
    [posts],
  );

  useEffect(() => {
    const controller = new AbortController();
    if (i18n.language !== "vi" && posts.length > 0) {
      translatePosts(i18n.language, controller.signal);
    }
    if (i18n.language === "vi") {
      setTranslatedMap({});
      lastTranslatedLang.current = "";
    }
    return () => controller.abort();
  }, [i18n.language, posts, translatePosts]);

  const isTranslated =
    i18n.language !== "vi" && Object.keys(translatedMap).length > 0;

  const latestPosts = posts.filter((p) => !p.is_popular).slice(0, 6);
  const popularPosts = posts
    .filter((p) => p.is_popular)
    .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
    .slice(0, 6);
  const filteredAll =
    activeTab === ALL_TAG ? posts : posts.filter((p) => p.tag === activeTab);

  return (
    <main
      className="min-h-screen text-gray-900"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      <style>{`
        @keyframes borderTrace {
          0%   { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -2000; }
        }
        @keyframes borderTraceReverse {
          0%   { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 2000; }
        }
        @keyframes blog-shine {
          from { transform: translateX(-100%); }
          to   { transform: translateX(100%); }
        }
        @keyframes float-mascot {
          0%,100% { transform: translateY(0) rotate(-1deg); }
          50%     { transform: translateY(-16px) rotate(1deg); }
        }
        @keyframes card-glow {
          0%,100% { box-shadow: 0 4px 10px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.05); }
          50%     { box-shadow: 0 8px 24px rgba(239,68,68,0.08), 0 2px 6px rgba(0,0,0,0.04); }
        }
        @keyframes blog-scan {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }

        .blog-title-rule {
          width: 120px; height: 2px; background: #ef4444;
          margin: 0 auto 18px; position: relative; overflow: hidden;
        }
        .blog-title-rule::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent);
          animation: blog-shine 1.2s linear infinite;
        }
        .blog-card {
          position: relative; overflow: hidden;
          background: linear-gradient(180deg, #ffffff 0%, #fff8f8 100%);
          border: 1px solid rgba(255,34,34,0.1);
          border-radius: 18px;
          transition: transform 0.45s cubic-bezier(0.22,1,0.36,1), box-shadow 0.45s ease, border-color 0.35s ease;
          animation: card-glow 4s ease-in-out infinite;
        }
        .blog-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, #ff2a2a, #ff6a6a, #ff2a2a);
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.5s cubic-bezier(0.22,1,0.36,1);
        }
        .blog-card:hover::before { transform: scaleX(1); }
        .blog-card:hover {
          transform: translateY(-10px) scale(1.02);
          border-color: rgba(255,34,34,0.4);
          box-shadow: 0 30px 70px rgba(255,34,34,0.18), 0 10px 25px rgba(0,0,0,0.1);
          animation: none;
        }
        .blog-card::after {
          content: ''; position: absolute; left: 0; bottom: 0; width: 100%; height: 2px;
          background: rgba(255,42,42,0.08);
          transition: background 0.35s;
        }
        .blog-card:hover::after {
          background: linear-gradient(90deg, #ff2a2a, #ff6a6a);
          box-shadow: 0 0 8px rgba(255,42,42,0.5);
        }
        .blog-cta-btn { position: relative; overflow: hidden; }
        .blog-cta-btn::after {
          content:''; position:absolute; inset:0;
          background: linear-gradient(105deg,transparent 38%,rgba(255,255,255,0.28) 50%,transparent 62%);
          transform: translateX(-120%);
          pointer-events: none;
        }
        .blog-cta-btn:hover::after { animation: blog-shine 0.65s ease forwards; }
        .scan-wrap { position: relative; overflow: hidden; }
        .float-mascot { animation: float-mascot 5s ease-in-out infinite; }
        .featured-card {
          position: relative; overflow: hidden;
          border-radius: 22px;
          transition: transform 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.5s ease;
        }
        .featured-card:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 40px 80px rgba(0,0,0,0.2), 0 15px 30px rgba(239,68,68,0.15);
        }
      `}</style>

      {/* ═══════ HERO — MASCOT STYLE (like CTASection) ═══════ */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #ffffff 0%, #fff5f5 45%, #fef2f2 75%, #fff1f2 100%)",
        }}
      >
        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(to right,#dc2626 1px,transparent 1px),linear-gradient(to bottom,#dc2626 1px,transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <BorderTrace color="rgba(239,68,68,0.15)" duration={14} />
        <Particles count={18} light />

        {/* Glow orbs */}
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

        {/* Corner decorations */}
        <svg
          className="absolute top-5 left-5 w-[50px] h-[50px] pointer-events-none z-2 opacity-40"
          viewBox="0 0 60 60"
          fill="none"
        >
          <path
            d="M0 60 L0 0 L60 0"
            stroke="rgba(255,34,34,0.18)"
            strokeWidth="1"
          />
          <circle cx="0" cy="0" r="3" fill="rgba(255,34,34,0.35)" />
        </svg>
        <svg
          className="absolute bottom-5 right-5 w-[50px] h-[50px] pointer-events-none z-2 rotate-180 opacity-40"
          viewBox="0 0 60 60"
          fill="none"
        >
          <path
            d="M0 60 L0 0 L60 0"
            stroke="rgba(255,34,34,0.18)"
            strokeWidth="1"
          />
          <circle cx="0" cy="0" r="3" fill="rgba(255,34,34,0.35)" />
        </svg>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 grid lg:grid-cols-2 gap-10 xl:gap-14 items-center">
          {/* LEFT — Mascot with floating stats */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.85,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="flex justify-center lg:justify-end order-2 lg:order-1"
          >
            <div className="relative w-full max-w-[480px] mx-auto flex items-center justify-center">
              <motion.div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, rgba(239,68,68,0.18) 20%, transparent 70%)",
                  filter: "blur(28px)",
                  transform: "scale(0.85)",
                }}
                animate={{
                  opacity: [0.5, 1, 0.5],
                  scale: [0.85, 0.95, 0.85],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <div
                className="float-mascot scan-wrap"
                style={{
                  filter:
                    "drop-shadow(0 28px 56px rgba(239,68,68,0.22)) drop-shadow(0 8px 16px rgba(0,0,0,0.08))",
                }}
              >
                <div
                  className="absolute left-0 right-0 h-[2px] pointer-events-none z-5"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                    animation: "borderTrace 3s linear infinite",
                    top: "50%",
                  }}
                />
                <img
                  src="/img/mascot/Dex-logo.png"
                  alt="Markee AI Blog"
                  className="w-full max-w-[380px] sm:max-w-[420px] lg:max-w-[460px] h-auto object-contain transition-transform duration-700 hover:scale-105"
                />
                <p
                  className="text-center -mt-6 text-2xl font-extrabold tracking-[0.15em] text-red-500"
                  style={{
                    textShadow: "0 0 18px rgba(255,255,255,0.7)",
                  }}
                >
                  MARKEE BLOG
                </p>
              </div>

              <StatCard
                pos="left-[-8%] top-[20%]"
                label={t("blog.statPosts")}
                value={`${posts.length}+`}
                delay={0.5}
                icon={<FileText className="w-4 h-4 text-white" />}
              />
              <StatCard
                pos="right-[-5%] top-[35%]"
                label={t("blog.statReads")}
                value="12,400+"
                delay={0.7}
                icon={<Users className="w-4 h-4 text-white" />}
              />
              <StatCard
                pos="left-[5%] bottom-[15%]"
                label={t("blog.statGrowth")}
                value="+250%"
                delay={0.9}
                icon={<BarChart3 className="w-4 h-4 text-white" />}
              />
            </div>
          </motion.div>

          {/* RIGHT — Text content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75 }}
            className="order-1 lg:order-2 text-center lg:text-left"
          >
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
              BLOG
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-6 text-3xl sm:text-4xl lg:text-[3.4rem] font-bold leading-[1.2] tracking-tight max-w-[600px]"
              style={{
                background:
                  "linear-gradient(135deg, #0a0a0a 20%, #dc2626 60%, #f43f5e 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {t("blog.title")}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-5 text-[17px] text-gray-500 max-w-lg mx-auto lg:mx-0 leading-relaxed"
            >
              {t("blog.heroDesc")}
            </motion.p>

            {/* Quick stats row */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 flex flex-wrap justify-center lg:justify-start gap-4"
            >
              {[
                { icon: <Zap className="h-3.5 w-3.5" />, label: "AI Insights" },
                {
                  icon: <TrendingUp className="h-3.5 w-3.5" />,
                  label: "Case Studies",
                },
                {
                  icon: <Sparkles className="h-3.5 w-3.5" />,
                  label: "Tutorials",
                },
              ].map((item, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium text-red-600/70"
                >
                  {item.icon} {item.label}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="mt-8 flex flex-wrap justify-center lg:justify-start gap-3"
            >
              <motion.a
                href="#latest"
                whileHover={{ scale: 1.04, y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="blog-cta-btn inline-flex items-center gap-2 px-7 py-[15px] rounded-2xl text-white font-bold text-[15px] tracking-wide"
                style={{
                  background:
                    "linear-gradient(135deg, #ef4444 0%, #e11d48 100%)",
                  boxShadow:
                    "0 14px 44px rgba(239,68,68,0.42), 0 4px 12px rgba(239,68,68,0.18), inset 0 1px 0 rgba(255,255,255,0.15)",
                }}
              >
                <Sparkles className="h-4 w-4" /> {t("blog.latestBtn")}
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                >
                  →
                </motion.span>
              </motion.a>
              <motion.a
                href="#popular"
                whileHover={{ scale: 1.04, y: -2 }}
                className="inline-flex items-center gap-2 px-7 py-[15px] rounded-2xl text-red-600 font-bold text-[15px] transition"
                style={{
                  background: "rgba(239,68,68,0.06)",
                  border: "1px solid rgba(239,68,68,0.2)",
                }}
              >
                <TrendingUp className="h-4 w-4" /> {t("blog.popularBtn")}
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-10 h-10 rounded-full border-2 animate-spin"
              style={{ borderColor: "#ef4444", borderTopColor: "transparent" }}
            />
            <p className="text-sm text-gray-400">{t("blog.loading")}</p>
          </div>
        </div>
      ) : (
        <>
          {/* ═══════ FEATURED / LATEST ═══════ */}
          {latestPosts.length > 0 && (
            <section
              id="latest"
              className="relative py-24 overflow-hidden"
              style={{
                background:
                  "linear-gradient(170deg, #faf7f6 0%, #fff5f5 40%, #fef2f2 70%, #faf7f6 100%)",
              }}
            >
              {/* Grid overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(to right,rgba(220,38,38,0.04) 1px,transparent 1px),linear-gradient(to bottom,rgba(220,38,38,0.04) 1px,transparent 1px)",
                  backgroundSize: "56px 56px",
                }}
              />
              {/* Scan line */}
              <BorderTrace
                color="rgba(239,68,68,0.3)"
                glow="rgba(239,68,68,0.15)"
                duration={12}
              />
              <Particles count={16} light />

              {/* Glow orbs */}
              <motion.div
                className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%)",
                }}
                animate={{ scale: [1, 1.15, 1], opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute bottom-0 -left-20 w-[400px] h-[400px] rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, rgba(244,63,94,0.06) 0%, transparent 70%)",
                }}
                animate={{ scale: [1.1, 1, 1.1] }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 3,
                }}
              />

              {/* Corner brackets */}
              <svg
                className="absolute top-5 left-5 w-[50px] h-[50px] pointer-events-none z-2"
                viewBox="0 0 60 60"
                fill="none"
              >
                <path
                  d="M0 60 L0 0 L60 0"
                  stroke="rgba(255,34,34,0.15)"
                  strokeWidth="1"
                />
                <circle cx="0" cy="0" r="3" fill="rgba(255,34,34,0.35)" />
                <rect
                  x="26"
                  y="0"
                  width="1"
                  height="8"
                  fill="rgba(255,34,34,0.12)"
                />
                <rect
                  x="0"
                  y="26"
                  width="8"
                  height="1"
                  fill="rgba(255,34,34,0.12)"
                />
              </svg>
              <svg
                className="absolute bottom-5 right-5 w-[50px] h-[50px] pointer-events-none z-2 rotate-180"
                viewBox="0 0 60 60"
                fill="none"
              >
                <path
                  d="M0 60 L0 0 L60 0"
                  stroke="rgba(255,34,34,0.15)"
                  strokeWidth="1"
                />
                <circle cx="0" cy="0" r="3" fill="rgba(255,34,34,0.35)" />
              </svg>

              {/* Decorative side line */}
              <div
                className="absolute left-8 top-1/4 bottom-1/4 w-px pointer-events-none hidden lg:block"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent, rgba(239,68,68,0.12), transparent)",
                }}
              />
              <div
                className="absolute right-8 top-1/3 bottom-1/3 w-px pointer-events-none hidden lg:block"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent, rgba(239,68,68,0.08), transparent)",
                }}
              />

              <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-red-500">
                      {t("blog.latestLabel")}
                    </span>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-red-200 to-transparent" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
                  {t("blog.latestTitle")}
                </h2>
                <p className="text-gray-400 text-sm mb-12 max-w-md">
                  {t("blog.latestDesc")}
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {latestPosts.map((post, i) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      delay={i * 0.08}
                      translatedTitle={
                        isTranslated ? translatedMap[post.id]?.title : undefined
                      }
                      translatedExcerpt={
                        isTranslated
                          ? translatedMap[post.id]?.excerpt
                          : undefined
                      }
                    />
                  ))}
                </div>
              </div>

              {/* Bottom section divider */}
              <div
                className="absolute bottom-0 inset-x-0 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(239,68,68,0.2) 30%, rgba(239,68,68,0.2) 70%, transparent)",
                }}
              />
            </section>
          )}

          {/* ═══════ POPULAR — Dark red section ═══════ */}
          {popularPosts.length > 0 && (
            <section
              id="popular"
              className="relative py-24 overflow-hidden"
              style={{
                background:
                  "linear-gradient(148deg, #dc2626 0%, #be123c 55%, #9f1239 100%)",
              }}
            >
              {/* Top shine line */}
              <div
                className="absolute top-0 inset-x-0 h-px pointer-events-none"
                style={{
                  background:
                    "linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)",
                }}
              />
              {/* Grid overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.06) 1px,transparent 1px)",
                  backgroundSize: "60px 60px",
                }}
              />
              <BorderTrace
                color="rgba(255,255,255,0.35)"
                glow="rgba(255,255,255,0.12)"
                duration={9}
              />
              <Particles count={30} />

              {/* Big glow orbs */}
              <motion.div
                className="absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)",
                  filter: "blur(50px)",
                }}
                animate={{
                  scale: [1, 1.18, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute -bottom-20 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, rgba(253,164,175,0.18) 0%, transparent 70%)",
                  filter: "blur(40px)",
                }}
                animate={{ scale: [1.1, 1, 1.1] }}
                transition={{
                  duration: 9,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2,
                }}
              />
              {/* Center diagonal light streak */}
              <motion.div
                className="absolute top-0 left-0 w-[200%] h-[2px] pointer-events-none"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 20%, rgba(255,255,255,0.15), transparent 80%)",
                  transform: "rotate(-15deg)",
                  transformOrigin: "top left",
                }}
                animate={{ x: ["-100%", "50%"] }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              {/* Corner brackets (white) */}
              <svg
                className="absolute top-5 left-5 w-[50px] h-[50px] pointer-events-none z-2"
                viewBox="0 0 60 60"
                fill="none"
              >
                <path
                  d="M0 60 L0 0 L60 0"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="1"
                />
                <circle cx="0" cy="0" r="3" fill="rgba(255,255,255,0.45)" />
                <rect
                  x="26"
                  y="0"
                  width="1"
                  height="8"
                  fill="rgba(255,255,255,0.15)"
                />
                <rect
                  x="0"
                  y="26"
                  width="8"
                  height="1"
                  fill="rgba(255,255,255,0.15)"
                />
              </svg>
              <svg
                className="absolute bottom-5 right-5 w-[50px] h-[50px] pointer-events-none z-2 rotate-180"
                viewBox="0 0 60 60"
                fill="none"
              >
                <path
                  d="M0 60 L0 0 L60 0"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="1"
                />
                <circle cx="0" cy="0" r="3" fill="rgba(255,255,255,0.45)" />
              </svg>

              {/* Decorative side lines */}
              <div
                className="absolute left-8 top-1/4 bottom-1/4 w-px pointer-events-none hidden lg:block"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent, rgba(255,255,255,0.15), transparent)",
                }}
              />
              <div
                className="absolute right-8 top-1/3 bottom-1/3 w-px pointer-events-none hidden lg:block"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent, rgba(255,255,255,0.1), transparent)",
                }}
              />

              <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-white/60">
                      SYS.POPULAR — TOP READS
                    </span>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-white/25 to-transparent" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                  {t("blog.popularTitle")}
                </h2>
                <p className="text-white/45 text-sm mb-12 max-w-md">
                  {t("blog.popularDesc")}
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {popularPosts.map((post, i) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      delay={i * 0.08}
                      variant="dark"
                      translatedTitle={
                        isTranslated ? translatedMap[post.id]?.title : undefined
                      }
                      translatedExcerpt={
                        isTranslated
                          ? translatedMap[post.id]?.excerpt
                          : undefined
                      }
                    />
                  ))}
                </div>
              </div>

              {/* Bottom shine line */}
              <div
                className="absolute bottom-0 inset-x-0 h-px pointer-events-none"
                style={{
                  background:
                    "linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)",
                }}
              />
            </section>
          )}

          {/* ═══════ ALL POSTS ═══════ */}
          <section
            className="relative py-24 overflow-hidden"
            style={{
              background:
                "linear-gradient(175deg, #ffffff 0%, #fff8f8 35%, #fff5f5 65%, #ffffff 100%)",
            }}
          >
            {/* Grid overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(to right,rgba(220,38,38,0.035) 1px,transparent 1px),linear-gradient(to bottom,rgba(220,38,38,0.035) 1px,transparent 1px)",
                backgroundSize: "56px 56px",
              }}
            />
            {/* Scan line */}
            <BorderTrace
              color="rgba(239,68,68,0.28)"
              glow="rgba(239,68,68,0.12)"
              duration={14}
            />
            <Particles count={14} light />

            {/* Glow orbs */}
            <motion.div
              className="absolute top-1/3 -left-20 w-[450px] h-[450px] rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(239,68,68,0.07) 0%, transparent 70%)",
              }}
              animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{
                duration: 9,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute bottom-1/4 -right-16 w-[350px] h-[350px] rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(244,63,94,0.06) 0%, transparent 70%)",
              }}
              animate={{ scale: [1.05, 0.95, 1.05] }}
              transition={{
                duration: 11,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 4,
              }}
            />

            {/* Corner brackets */}
            <svg
              className="absolute top-5 left-5 w-[50px] h-[50px] pointer-events-none z-2"
              viewBox="0 0 60 60"
              fill="none"
            >
              <path
                d="M0 60 L0 0 L60 0"
                stroke="rgba(255,34,34,0.15)"
                strokeWidth="1"
              />
              <circle cx="0" cy="0" r="3" fill="rgba(255,34,34,0.35)" />
              <rect
                x="26"
                y="0"
                width="1"
                height="8"
                fill="rgba(255,34,34,0.12)"
              />
              <rect
                x="0"
                y="26"
                width="8"
                height="1"
                fill="rgba(255,34,34,0.12)"
              />
            </svg>
            <svg
              className="absolute bottom-5 right-5 w-[50px] h-[50px] pointer-events-none z-2 rotate-180"
              viewBox="0 0 60 60"
              fill="none"
            >
              <path
                d="M0 60 L0 0 L60 0"
                stroke="rgba(255,34,34,0.15)"
                strokeWidth="1"
              />
              <circle cx="0" cy="0" r="3" fill="rgba(255,34,34,0.35)" />
            </svg>

            {/* Decorative side lines */}
            <div
              className="absolute left-8 top-1/4 bottom-1/4 w-px pointer-events-none hidden lg:block"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, rgba(239,68,68,0.1), transparent)",
              }}
            />
            <div
              className="absolute right-8 top-1/3 bottom-1/3 w-px pointer-events-none hidden lg:block"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, rgba(239,68,68,0.07), transparent)",
              }}
            />

            {/* Floating decorative dots */}
            <motion.div
              className="absolute top-[15%] right-[12%] w-1.5 h-1.5 rounded-full bg-red-400/30 pointer-events-none hidden lg:block"
              animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div
              className="absolute top-[60%] left-[8%] w-2 h-2 rounded-full bg-red-300/20 pointer-events-none hidden lg:block"
              animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1.5 }}
            />
            <motion.div
              className="absolute bottom-[20%] right-[6%] w-1 h-1 rounded-full bg-red-500/25 pointer-events-none hidden lg:block"
              animate={{ scale: [1, 2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 5, repeat: Infinity, delay: 2 }}
            />
            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-red-500">
                    EXPLORE
                  </span>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-red-200 to-transparent" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-8">
                {t("blog.allTitle")}
              </h2>

              {/* Filter tabs */}
              <div className="flex gap-2.5 overflow-visible flex-wrap mb-10">
                {FILTER_TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setVisibleCount(9);
                    }}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200"
                    style={
                      activeTab === tab
                        ? {
                            background:
                              "linear-gradient(135deg, #ef4444, #e11d48)",
                            color: "#fff",
                            border: "1px solid transparent",
                          }
                        : {
                            background: "rgba(239,68,68,0.05)",
                            color: "#666",
                            border: "1px solid rgba(239,68,68,0.12)",
                          }
                    }
                  >
                    {tab === ALL_TAG ? t("blog.filterAll") : tab}
                  </button>
                ))}
              </div>

              {filteredAll.length === 0 ? (
                <div className="text-center py-24 text-gray-400">
                  <Sparkles className="h-10 w-10 mx-auto mb-4 text-red-200" />
                  <p className="text-base">{t("blog.noPostsInCategory")}</p>
                </div>
              ) : (
                <>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAll.slice(0, visibleCount).map((post, i) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        delay={i * 0.05}
                        translatedTitle={
                          isTranslated
                            ? translatedMap[post.id]?.title
                            : undefined
                        }
                        translatedExcerpt={
                          isTranslated
                            ? translatedMap[post.id]?.excerpt
                            : undefined
                        }
                      />
                    ))}
                  </div>
                  {visibleCount < filteredAll.length && (
                    <div className="text-center mt-14">
                      <motion.button
                        whileHover={{ scale: 1.04, y: -3 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setVisibleCount((prev) => prev + 9)}
                        className="blog-cta-btn inline-flex items-center gap-2 px-9 py-4 rounded-2xl text-white font-bold text-base"
                        style={{
                          background:
                            "linear-gradient(135deg, #ef4444, #e11d48)",
                          boxShadow:
                            "0 14px 44px rgba(239,68,68,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
                        }}
                      >
                        {t("blog.loadMore")} <ArrowRight className="h-4 w-4" />
                      </motion.button>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>

          {/* ═══════ CTA — Dark tech style ═══════ */}
          <section
            className="relative overflow-hidden py-16"
            style={{
              background:
                "linear-gradient(160deg, #ffffff 0%, #fff5f5 45%, #fef2f2 100%)",
            }}
          >
            <Particles count={14} light />
            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
              <div
                className="relative rounded-[22px] overflow-hidden py-16 px-10 sm:px-16"
                style={{
                  background:
                    "linear-gradient(135deg, #2b0505 0%, #5a0a0a 45%, #7a0d0d 100%)",
                }}
              >
                {/* Grid tech overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,34,34,0.09) 1px,transparent 1px),linear-gradient(90deg,rgba(255,34,34,0.09) 1px,transparent 1px)",
                    backgroundSize: "60px 60px",
                  }}
                />
                {/* Light sweep */}
                <div
                  className="absolute top-0 left-[-40%] w-[40%] h-full pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(120deg, transparent, rgba(255,34,34,0.08), rgba(255,34,34,0.18), transparent)",
                    animation: "blog-scan 7s linear infinite",
                  }}
                />
                <motion.div
                  className="absolute top-1/2 right-[5%] -translate-y-1/2 w-[520px] h-[520px] rounded-full pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(255,34,34,0.28) 0%, rgba(255,34,34,0.15) 40%, transparent 70%)",
                  }}
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
                  <div className="text-center lg:text-left">
                    <p className="text-[9px] font-bold tracking-[0.35em] uppercase text-red-400 mb-4">
                      SYS.CTA — MARKEE AI
                    </p>
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white mb-5 leading-tight">
                      {t("blog.ctaTitle")}
                    </h3>
                    <p className="text-white/50 text-sm sm:text-base mb-8 leading-relaxed font-light max-w-md">
                      {t("blog.ctaDesc")}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                      <motion.div
                        whileHover={{ scale: 1.04, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Link
                          href="https://app.markeeai.com"
                          target="_blank"
                          className="blog-cta-btn inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-white font-bold text-base"
                          style={{
                            background:
                              "linear-gradient(135deg, #ef4444, #e11d48)",
                            boxShadow:
                              "0 14px 44px rgba(239,68,68,0.42), inset 0 1px 0 rgba(255,255,255,0.15)",
                          }}
                        >
                          {t("blog.ctaBtn")}
                          <motion.span
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.4, repeat: Infinity }}
                          >
                            →
                          </motion.span>
                        </Link>
                      </motion.div>
                      <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm transition"
                        style={{
                          border: "1px solid rgba(255,255,255,0.15)",
                          color: "rgba(255,255,255,0.7)",
                        }}
                      >
                        {t("blog.ctaLearnMore")}
                      </Link>
                    </div>
                  </div>

                  {/* Hex tech badge (like FeaturesSection CTA) */}
                  <div className="hidden lg:flex justify-center">
                    <div className="relative w-[140px] h-[140px] flex items-center justify-center">
                      <div
                        className="absolute w-[200px] h-[200px] rounded-full pointer-events-none"
                        style={{
                          border: "1px solid rgba(255,34,34,0.25)",
                          animation: "spin 12s linear infinite",
                        }}
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          clipPath:
                            "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
                          background:
                            "linear-gradient(135deg, #ef4444, #991b1b)",
                          animation: "pulse 3s ease-in-out infinite",
                        }}
                      />
                      <span className="relative z-10 text-4xl">🚀</span>
                      <p className="absolute -bottom-8 text-[8px] tracking-[0.25em] text-white/40 uppercase text-center">
                        MARKEE AI
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      <Footer />
      <SocialMedia />
    </main>
  );
}

/* ─────────────── Post Card — Premium ─────────────── */
function PostCard({
  post,
  delay = 0,
  variant = "light",
  translatedTitle,
  translatedExcerpt,
}: {
  post: BlogPost;
  delay?: number;
  variant?: "light" | "dark";
  translatedTitle?: string;
  translatedExcerpt?: string;
}) {
  const tc = TAG_COLOR[post.tag] ?? { bg: "#f3f4f6", text: "#374151" };
  const mins = readingTime(post.content);
  const { t } = useTranslation();

  const displayTitle = translatedTitle || post.title;
  const displayExcerpt = translatedExcerpt || post.excerpt;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 0.68, 0, 1.05],
      }}
    >
      <Link
        href={`/blog/${post.slug}`}
        className={`group block ${variant === "dark" ? "" : "blog-card"}`}
        style={
          variant === "dark"
            ? {
                borderRadius: 18,
                overflow: "hidden",
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow:
                  "0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.06)",
                transition:
                  "transform 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.5s ease, border-color 0.4s",
              }
            : undefined
        }
      >
        <div
          className="relative h-56 overflow-hidden"
          style={{ borderRadius: "18px 18px 0 0" }}
        >
          {post.cover_image ? (
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              unoptimized
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #fff0f0, #ffe0e0)",
              }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Sparkles className="h-10 w-10 text-red-300" />
              </motion.div>
            </div>
          )}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.55))",
            }}
          />

          {/* Tag badge */}
          <span
            className="absolute top-3 left-3 text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-lg"
            style={{
              background: tc.bg,
              color: tc.text,
              backdropFilter: "blur(8px)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            {post.tag}
          </span>

          {/* View count */}
          {(post.view_count ?? 0) > 0 && (
            <span className="absolute top-3 right-3 flex items-center gap-1 text-[10px] text-white/80 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-lg">
              <Eye className="h-3 w-3" />{" "}
              {(post.view_count || 0).toLocaleString()}
            </span>
          )}

          {/* Bottom gradient overlay with reading time */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1 text-[10px] text-white/70 font-medium">
            <Clock className="h-3 w-3" /> {mins} {t("blog.minuteRead")}
          </div>
        </div>

        <div className="p-5">
          <h3
            className={`text-[15px] font-bold leading-snug line-clamp-2 mb-2 transition-colors duration-300 ${
              variant === "dark"
                ? "text-white group-hover:text-red-200"
                : "text-gray-900 group-hover:text-red-600"
            }`}
          >
            {displayTitle}
          </h3>
          {displayExcerpt && (
            <p
              className={`text-[13px] line-clamp-2 leading-relaxed mb-4 ${
                variant === "dark" ? "text-white/45" : "text-gray-500"
              }`}
            >
              {displayExcerpt}
            </p>
          )}
          <div
            className={`flex items-center justify-between text-[11px] pt-3 ${
              variant === "dark"
                ? "text-white/35 border-t border-white/10"
                : "text-gray-400 border-t border-gray-100"
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center"
                style={{
                  background:
                    variant === "dark"
                      ? "rgba(255,255,255,0.1)"
                      : "linear-gradient(135deg, #ef4444, #f43f5e)",
                }}
              >
                <span className="text-[8px] text-white font-bold">M</span>
              </div>
              <span className="font-semibold">{post.author}</span>
            </div>
            {post.published_at && (
              <span>{new Date(post.published_at).toLocaleDateString()}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
