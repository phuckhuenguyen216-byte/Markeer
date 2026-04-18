"use client";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "next/navigation";
import DOMPurify from "dompurify";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  Eye,
  User,
  Clock,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import Footer from "../../components/Footer";
import SocialMedia from "../../components/SocialMedia";
import type { BlogPost } from "@/lib/blog";
import { TAG_COLOR } from "@/lib/blog";

function readingTime(html: string) {
  const text = html.replace(/<[^>]+>/g, "");
  return Math.max(
    1,
    Math.ceil(text.trim().split(/\s+/).filter(Boolean).length / 200),
  );
}

/* ─── Floating particles ─── */
function Particles({
  count = 14,
  light = false,
}: {
  count?: number;
  light?: boolean;
}) {
  const [particles, setParticles] = useState<
    {
      w: number;
      h: number;
      l: number;
      t: number;
      dy: number;
      dur: number;
      del: number;
    }[]
  >([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: count }, () => ({
        w: Math.random() * 4 + 2,
        h: Math.random() * 4 + 2,
        l: Math.random() * 100,
        t: Math.random() * 100,
        dy: -(Math.random() * 35 + 15),
        dur: Math.random() * 4 + 4,
        del: Math.random() * 5,
      })),
    );
  }, [count]);

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${light ? "bg-red-400/20" : "bg-white/15"}`}
          style={{
            width: p.w,
            height: p.h,
            left: `${p.l}%`,
            top: `${p.t}%`,
          }}
          animate={{
            y: [0, p.dy, 0],
            opacity: [0.15, 0.6, 0.15],
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

export default function BlogDetailPage() {
  const { t, i18n } = useTranslation();
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Auto-translate state
  const [translatedData, setTranslatedData] = useState<{
    title: string;
    excerpt: string;
    content: string;
  } | null>(null);
  const lastTranslatedLang = useRef<string>("");

  const sanitizedContent = useMemo(
    () => (post?.content ? DOMPurify.sanitize(post.content) : ""),
    [post?.content],
  );

  const sanitizedTranslatedContent = useMemo(
    () =>
      translatedData?.content ? DOMPurify.sanitize(translatedData.content) : "",
    [translatedData?.content],
  );

  // Auto-translate when language changes away from "vi"
  const translatePost = useCallback(
    async (targetLang: string, signal?: AbortSignal) => {
      if (!post) return;
      if (lastTranslatedLang.current === targetLang) return;

      try {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            texts: [post.title, post.excerpt || "", post.content],
            targetLang,
          }),
          signal,
        });
        if (!res.ok) return;
        const data = await res.json();
        const tr: string[] = data.translations;
        setTranslatedData({
          title: tr[0] || post.title,
          excerpt: tr[1] || post.excerpt || "",
          content: tr[2] || post.content,
        });
        lastTranslatedLang.current = targetLang;
      } catch {
        // silently fail — show original
      }
    },
    [post],
  );

  useEffect(() => {
    const controller = new AbortController();
    if (i18n.language !== "vi" && post) {
      translatePost(i18n.language, controller.signal);
    }
    if (i18n.language === "vi") {
      setTranslatedData(null);
      lastTranslatedLang.current = "";
    }
    return () => controller.abort();
  }, [i18n.language, post, translatePost]);

  const isTranslated = i18n.language !== "vi" && translatedData !== null;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [slug]);

  // Reset state when navigating between posts
  useEffect(() => {
    setLoading(true);
    setError(false);
    setPost(null);
    setRelated([]);
    setTranslatedData(null);
    lastTranslatedLang.current = "";
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    const controller = new AbortController();
    fetch(`/api/blogs/${slug}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        if (data.error) throw new Error();
        setPost(data);
        return fetch(
          `/api/blogs?status=published&tag=${encodeURIComponent(data.tag)}&limit=4`,
          { signal: controller.signal },
        );
      })
      .then((res) => res?.json())
      .then((list) => {
        const posts = list?.posts || (Array.isArray(list) ? list : []);
        setRelated(posts.filter((p: BlogPost) => p.slug !== slug).slice(0, 3));
      })
      .catch((err) => {
        if (err.name !== "AbortError") setError(true);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-10 h-10 rounded-full border-2 animate-spin"
              style={{ borderColor: "#ef4444", borderTopColor: "transparent" }}
            />
            <p className="text-sm text-gray-400">{t("blog.loadingPost")}</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="min-h-screen bg-white">
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <Sparkles className="h-8 w-8 text-red-200" />
          <p className="text-lg text-gray-500">{t("blog.notFoundTitle")}</p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-bold text-red-600 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> {t("blog.backToBlog")}
          </Link>
        </div>
      </main>
    );
  }

  const mins = readingTime(post.content);
  const tc = TAG_COLOR[post.tag] ?? { bg: "#f3f4f6", text: "#374151" };

  return (
    <main
      className="min-h-screen text-gray-900"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      <style>{`
        @keyframes detail-scan {
          0%,100% { top: -2px; opacity: 0; }
          5%  { opacity: 1; }
          95% { opacity: 1; }
          100%{ top: 100%; opacity: 0; }
        }
        @keyframes detail-shine {
          from { transform: translateX(-100%); }
          to   { transform: translateX(100%); }
        }
        .detail-scan-line {
          position: absolute; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,80,80,0.5) 40%, rgba(255,80,80,0.5) 60%, transparent);
          animation: detail-scan 8s linear infinite;
          pointer-events: none; z-index: 5;
        }
        .detail-cta-btn { position: relative; overflow: hidden; }
        .detail-cta-btn::after {
          content:''; position:absolute; inset:0;
          background: linear-gradient(105deg,transparent 38%,rgba(255,255,255,0.28) 50%,transparent 62%);
          transform: translateX(-120%); pointer-events: none;
        }
        .detail-cta-btn:hover::after { animation: detail-shine 0.65s ease forwards; }

        .blog-content h2 {
          font-size: 1.5rem; font-weight: 800; color: #0a0a0a;
          margin: 2rem 0 0.6rem; line-height: 1.3;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid rgba(239,68,68,0.12);
        }
        .blog-content h3 { font-size: 1.2rem; font-weight: 700; color: #1f2937; margin: 1.5rem 0 0.5rem; }
        .blog-content p { margin: 0.75rem 0; line-height: 1.85; color: #4b5563; font-size: 17px; }
        .blog-content ul, .blog-content ol { margin: 0.75rem 0; padding-left: 1.5rem; color: #4b5563; }
        .blog-content li { margin: 0.4rem 0; line-height: 1.75; }
        .blog-content li::marker { color: #ef4444; }
        .blog-content blockquote {
          border-left: 4px solid #ef4444; background: #fff5f5;
          padding: 1.25rem 1.5rem; margin: 1.5rem 0;
          border-radius: 0 12px 12px 0; color: #991b1b; font-style: italic;
        }
        .blog-content img { border-radius: 14px; margin: 1.75rem 0; max-width: 100%; box-shadow: 0 8px 30px rgba(0,0,0,0.08); }
        .blog-content a { color: #dc2626; text-decoration: underline; text-underline-offset: 3px; }
        .blog-content a:hover { color: #ef4444; }
        .blog-content hr { border: none; height: 1px; background: linear-gradient(90deg, transparent, rgba(239,68,68,0.2), transparent); margin: 2.5rem 0; }
        .blog-content strong { color: #0a0a0a; }
      `}</style>

      {/* ═══════ HERO — Cover image as background ═══════ */}
      <section className="relative overflow-hidden">
        {/* Cover image background */}
        {post.cover_image && (
          <div className="absolute inset-0">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              priority
              className="object-cover"
              unoptimized
            />
            {/* Dark overlay gradient */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(10,5,2,0.55) 0%, rgba(10,5,2,0.75) 50%, rgba(10,5,2,0.92) 100%)",
              }}
            />
          </div>
        )}
        {/* Fallback background if no cover */}
        {!post.cover_image && (
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(160deg, #1a0a08 0%, #2c1810 45%, #3b1c14 100%)",
            }}
          />
        )}

        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right,rgba(255,255,255,0.3) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.3) 1px,transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <Particles count={12} />

        <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 pt-4 pb-14">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 mb-10"
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-white/80 hover:text-white transition"
            >
              <ArrowLeft className="h-4 w-4" /> Blog
            </Link>
            <span className="text-white/30">/</span>
            <span className="text-sm text-white/40 truncate max-w-[200px] sm:max-w-[400px]">
              {post.title}
            </span>
          </motion.div>

          {/* Tag badge + Translate button */}
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 280, damping: 18 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-bold tracking-[0.2em] uppercase"
              style={{
                background: "rgba(255,255,255,0.12)",
                color: "#fff",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {post.tag}
            </motion.div>
          </div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black leading-[1.15] tracking-tight mb-5 text-white"
            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}
          >
            {isTranslated ? translatedData.title : post.title}
          </motion.h1>

          {(isTranslated ? translatedData.excerpt : post.excerpt) && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base sm:text-lg text-white/60 max-w-2xl leading-relaxed font-light mb-6"
            >
              {isTranslated ? translatedData.excerpt : post.excerpt}
            </motion.p>
          )}

          {/* Meta row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4"
          >
            {/* Author pill */}
            <div
              className="flex items-center gap-2.5 px-4 py-2 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(8px)",
              }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #ef4444, #f43f5e)",
                  boxShadow: "0 4px 10px rgba(239,68,68,0.3)",
                }}
              >
                <User className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-none">
                  {post.author}
                </p>
                <p className="text-[10px] text-white/40 mt-0.5">Markee AI</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-[12px] text-white/50 font-medium">
              {post.published_at && (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-red-400" />
                  {new Date(post.published_at).toLocaleDateString(
                    i18n.language,
                    {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    },
                  )}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-red-400" />
                {mins} {t("blog.minuteRead")}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5 text-red-400" />
                {(post.view_count || 0).toLocaleString()}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ ARTICLE ═══════ */}
      <div className="relative" style={{ background: "#ffffff" }}>
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(to right,#dc2626 1px,transparent 1px),linear-gradient(to bottom,#dc2626 1px,transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="relative z-10 mx-auto max-w-3xl px-5 py-16 sm:px-8">
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="blog-content"
            dangerouslySetInnerHTML={{
              __html:
                isTranslated && sanitizedTranslatedContent
                  ? sanitizedTranslatedContent
                  : sanitizedContent,
            }}
          />

          {/* Author bar */}
          <div
            className="mt-14 pt-8 flex items-center justify-between gap-4 flex-wrap"
            style={{ borderTop: "2px solid rgba(239,68,68,0.08)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: "linear-gradient(135deg, #ef4444, #f43f5e)",
                  boxShadow: "0 6px 18px rgba(239,68,68,0.35)",
                }}
              >
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{post.author}</p>
                <p className="text-[11px] text-gray-400">
                  {t("blog.editedBy")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="inline-flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5" />
                {(post.view_count || 0).toLocaleString()} {t("blog.views")}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {mins} {t("blog.minuteRead")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════ CTA ═══════ */}
      <section
        className="relative overflow-hidden py-14"
        style={{
          background:
            "linear-gradient(160deg, #ffffff 0%, #fff5f5 45%, #fef2f2 100%)",
        }}
      >
        <Particles count={10} light />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <div
            className="relative rounded-[22px] overflow-hidden py-10 px-8 sm:px-14 text-center"
            style={{
              background:
                "linear-gradient(135deg, #2b0505 0%, #5a0a0a 45%, #7a0d0d 100%)",
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,34,34,0.09) 1px,transparent 1px),linear-gradient(90deg,rgba(255,34,34,0.09) 1px,transparent 1px)",
                backgroundSize: "60px 60px",
              }}
            />
            <motion.div
              className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[350px] h-[350px] rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,34,34,0.2) 0%, transparent 70%)",
              }}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative z-10">
              <p className="text-[9px] font-bold tracking-[0.35em] uppercase text-red-400 mb-4">
                SYS.CTA — MARKEE AI
              </p>
              <h3 className="text-2xl sm:text-3xl font-semibold text-white mb-4 leading-tight">
                {t("blog.detailCtaTitle")}
              </h3>
              <p className="text-white/50 text-sm mb-6 max-w-2xl mx-auto leading-relaxed font-light">
                {t("blog.detailCtaDesc")}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <motion.div
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    href="https://app.markeeai.com"
                    target="_blank"
                    className="detail-cta-btn inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-white font-bold text-base"
                    style={{
                      background: "linear-gradient(135deg, #ef4444, #e11d48)",
                      boxShadow:
                        "0 14px 44px rgba(239,68,68,0.42), inset 0 1px 0 rgba(255,255,255,0.15)",
                    }}
                  >
                    {t("blog.detailCtaBtn")}
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
                  <Sparkles className="h-4 w-4" /> {t("blog.ctaLearnMore")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ RELATED ═══════ */}
      {related.length > 0 && (
        <section className="relative py-20" style={{ background: "#faf7f6" }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-red-500">
                  RELATED
                </span>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-red-200 to-transparent" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-10">
              {t("blog.relatedTitle")}
            </h3>
            <div className="grid sm:grid-cols-3 gap-7">
              {related.map((r) => {
                const rtc = TAG_COLOR[r.tag] ?? {
                  bg: "#f3f4f6",
                  text: "#374151",
                };
                return (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55 }}
                  >
                    <Link
                      href={`/blog/${r.slug}`}
                      className="group block rounded-[18px] overflow-hidden transition-all duration-[450ms]"
                      style={{
                        background: "linear-gradient(180deg, #ffffff, #fff8f8)",
                        border: "1px solid rgba(255,34,34,0.1)",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.04)",
                      }}
                    >
                      <div className="relative h-48 overflow-hidden">
                        {r.cover_image ? (
                          <Image
                            src={r.cover_image}
                            alt={r.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                            unoptimized
                          />
                        ) : (
                          <div
                            className="absolute inset-0"
                            style={{
                              background:
                                "linear-gradient(135deg, #fff0f0, #ffe0e0)",
                            }}
                          />
                        )}
                        <div
                          className="absolute inset-0"
                          style={{
                            background:
                              "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.5))",
                          }}
                        />
                        <span
                          className="absolute top-3 left-3 text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-lg"
                          style={{ background: rtc.bg, color: rtc.text }}
                        >
                          {r.tag}
                        </span>
                      </div>
                      <div className="p-5">
                        <p className="text-[15px] font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-red-600 transition">
                          {r.title}
                        </p>
                        {r.excerpt && (
                          <p className="mt-2 text-sm text-gray-500 line-clamp-2 leading-relaxed">
                            {r.excerpt}
                          </p>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <Footer />
      <SocialMedia />
    </main>
  );
}
