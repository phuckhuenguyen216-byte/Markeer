/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import Footer from "../components/Footer";

export default function ApplyPage() {
  const { t, i18n } = useTranslation("common");
  const [showForm, setShowForm] = useState(false);
  const [animatedValues, setAnimatedValues] = useState<number[]>([0, 0, 0]);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [animatedGrades, setAnimatedGrades] = useState<number[]>([0, 0, 0]);
  const [gradeAnimated, setGradeAnimated] = useState(false);
  const lang = i18n.language;

  // Re-observe .anim elements after every language change
  // Key insight: on language switch, elements already in viewport must
  // immediately get "visible" — only off-screen elements should fade in.
  useEffect(() => {
    // Small timeout lets React finish re-rendering translated content
    const id = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) e.target.classList.add("visible");
          });
        },
        { threshold: 0.1 },
      );

      document.querySelectorAll(".anim").forEach((el) => {
        // If already scrolled into view (was visible before), mark immediately
        const rect = el.getBoundingClientRect();
        const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
        if (inViewport) {
          el.classList.add("visible");
        } else {
          el.classList.remove("visible");
          observer.observe(el);
        }
      });

      return () => observer.disconnect();
    }, 0);

    return () => clearTimeout(id);
  }, [lang]); // re-run on every language change

  useEffect(() => {
    const el = document.querySelector(".score-bar-list");
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);

            const target = [60, 20, 20];

            target.forEach((value, index) => {
              let start = 0;
              const duration = 3500;
              const stepTime = 10;
              const increment = value / (duration / stepTime);

              const timer = setInterval(() => {
                start += increment;

                setAnimatedValues((prev) => {
                  const updated = [...prev];
                  updated[index] = Math.min(Math.floor(start), value);
                  return updated;
                });

                if (start >= value) clearInterval(timer);
              }, stepTime);
            });
          }
        });
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    const el = document.querySelector(".grade-table");
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !gradeAnimated) {
            setGradeAnimated(true);

            const target = [85, 75, 75];

            target.forEach((value, index) => {
              let start = 0;
              const duration = 3500;
              const stepTime = 10;
              const increment = value / (duration / stepTime);

              const timer = setInterval(() => {
                start += increment;

                setAnimatedGrades((prev) => {
                  const updated = [...prev];
                  updated[index] = Math.min(Math.floor(start), value);
                  return updated;
                });

                if (start >= value) clearInterval(timer);
              }, stepTime);
            });
          }
        });
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [gradeAnimated]);

  const benefitItems = t("apply.benefits.items", {
    returnObjects: true,
  }) as Array<{
    icon: string;
    title: string;
    desc: string;
  }>;

  const teamItems = t("apply.teams.items", { returnObjects: true }) as Array<{
    num: string;
    icon: string;
    name: string;
    sub: string;
  }>;

  const evalBars = t("apply.eval.bars", { returnObjects: true }) as Array<{
    name: string;
    pct: number;
    sub: string;
  }>;

  const evalBehaviorItems = t("apply.eval.behavior.items", {
    returnObjects: true,
  }) as string[];

  const gradeHead = t("apply.eval.gradeHead", {
    returnObjects: true,
  }) as string[];

  const grades = t("apply.eval.grades", { returnObjects: true }) as Array<{
    label: string;
    score: number;
    badge: string;
    bg: string;
    col: string;
    desc: string;
  }>;

  const guidelineItems = t("apply.guidelines.items", {
    returnObjects: true,
  }) as Array<{
    num: string;
    icon: string;
    text: string;
  }>;

  const benefitPills = t("apply.benefits.card.pills", {
    returnObjects: true,
  }) as string[];

  const pathSteps = t("apply.path", { returnObjects: true }) as string[];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        *, *::before, *::after { box-sizing: border-box;}

        :root {
          --red: #e53e3e;
          --red-light: #fff5f5;
          --red-mid: #fed7d7;
          --red-dark: #c53030;
          --red-deep: #9b2c2c;
          --dark: #1a1a2e;
          --white: #ffffff;
          --gray-50: #f9fafb;
          --gray-100: #f3f4f6;
          --gray-200: #e5e7eb;
          --gray-400: #9ca3af;
          --gray-600: #4b5563;
          --gray-800: #1f2937;
          --font: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .anim { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .anim.visible { opacity: 1; transform: none; }
        .d1{transition-delay:0.1s} .d2{transition-delay:0.2s} .d3{transition-delay:0.3s}
        .d4{transition-delay:0.4s} .d5{transition-delay:0.5s} .d6{transition-delay:0.6s}

        .hero {
          background: var(--dark);
          background-image: 
            linear-gradient(rgba(26, 26, 46, 0.78), rgba(26, 26, 46, 0.85)),
            url('https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop');
          background-size: cover;
          background-position: center;
          min-height: 85vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 4rem 1.5rem 3rem;
          text-align: center;
          position: relative;
        }

        .hero::before {
          content: '';
          inset: 0;
          background: radial-gradient(ellipse 80% 60% at 60% 0%, rgba(229,62,62,0.28) 0%, transparent 65%);
          z-index: 1;
        }
        .hero::after {
          content:''; position:absolute; bottom:0; left:0; right:0; height:1px;
          background: linear-gradient(90deg, transparent, rgba(229,62,62,0.4), transparent);
        }

        .hero-badge {
          display:inline-flex; align-items:center; gap:8px;
          background: rgba(229,62,62,0.15); border: 1px solid rgba(229,62,62,0.4);
          color: #fc8181; font-size:0.72rem; font-weight:600;
          letter-spacing:0.18em; text-transform:uppercase;
          padding: 6px 16px; border-radius:100px; margin-bottom:2.5rem;
        }
        .badge-dot { width:6px; height:6px; background:#fc8181; border-radius:50%; animation:blink 2s infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

        .hero-title {
          font-size: clamp(3rem, 8vw, 3rem); font-weight:700;
          line-height:1.0; letter-spacing:-0.04em; color:#fff; margin-bottom:1rem;
        }
        .hero-title span { color: var(--red); }

        .hero-sub { font-size: clamp(1rem, 2.5vw, 1.25rem); font-weight:300; color:rgba(255,255,255,0.5); margin-bottom:2rem; }

        .hero-path {
          display: inline-flex;
          align-items: center;
          padding: 12px 16px;
          margin-bottom: 2.5rem;
          gap: 0px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
          position: relative;
          overflow: hidden;
        }

        .hero-path::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            rgba(229,62,62,0.15),
            rgba(249,115,22,0.15),
            rgba(234,179,8,0.15),
            rgba(163,230,77,0.15),
            rgba(34,211,238,0.15),
            rgba(192,132,252,0.15),
            rgba(229,62,62,0.15)
          );
          background-size: 300% 100%;
          animation: gradientFlow 15s linear infinite;
          opacity: 0.65;
          z-index: -1;
          border-radius: 20px;
        }

        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }

        .path-step {
          padding: 12px 26px;
          font-size: 0.92rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: #fff;
          position: relative;
          z-index: 2;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          white-space: nowrap;
        }

        .path-step:nth-of-type(1) { background: linear-gradient(135deg, #e53e3e, #f87171); }
        .path-step:nth-of-type(2) { background: linear-gradient(135deg, #f59e0b, #fbbf24); }
        .path-step:nth-of-type(3) { background: linear-gradient(135deg, #10b981, #34d399); }
        .path-step:nth-of-type(4) { background: linear-gradient(135deg, #3b82f6, #60a5fa); }
        .path-step:nth-of-type(5) { background: linear-gradient(135deg, #8b5cf6, #c084fc); }

        .path-step:hover {
          transform: translateY(-4px) scale(1.08);
          box-shadow: 0 15px 35px rgba(255,255,255,0.3);
        }

        .path-step.active { font-weight: 700; }

        .path-div {
          color: rgba(255,255,255,0.45);
          font-size: 1.35rem;
          padding: 0 8px;
        }

        @media (max-width: 680px) {
          .hero-path { padding: 10px; gap: 6px; }
          .path-step { padding: 10px 12px; font-size: 0.85rem; }
        }

        .hero-desc { font-size: clamp(0.92rem,2vw,1.05rem); color:rgba(255,255,255,0.55); line-height:1.8; max-width:700px; margin:0 auto 2rem; }

        .hero-checks { display:flex; gap:1.5rem; justify-content:center; flex-wrap:wrap; margin-bottom:3rem; }
        .hero-check { display:flex; align-items:center; gap:7px; font-size:0.88rem; color:rgba(255,255,255,0.7); font-weight:500; }
        .chk { width:20px; height:20px; background:var(--red); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.62rem; color:#fff; flex-shrink:0; }

        .cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
          color: #fff;
          font-size: 1.13rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          padding: 10px 12px;
          border-radius: 5px;
          border: none;
          cursor: pointer;
          position: relative;
          overflow: visible;
          box-shadow: 0 12px 35px rgba(229, 62, 62, 0.5);
          text-transform: uppercase;
          z-index: 2;
          font-family: var(--font);
          animation: buttonPulse 2.8s ease-in-out infinite;
        }

        @keyframes buttonPulse {
          0%, 100% { transform: translateY(0) scale(1); }
          50%      { transform: translateY(-8px) scale(1.03); }
        }

        .cta-btn:hover {
          animation-play-state: paused;
          transform: translateY(-6px) scale(1.05);
          box-shadow: 0 25px 60px rgba(229, 62, 62, 0.7);
        }

        .cta-btn::after {
          content: '';
          position: absolute;
          top: -22px; left: -22px; right: -22px; bottom: -22px;
          border: 3px solid rgba(252, 129, 129, 0.6);
          border-radius: 5px;
          opacity: 0;
          animation: outerRipple 1.2s linear infinite;
          z-index: -1;
          pointer-events: none;
        }

        .cta-btn::before {
          content: '';
          position: absolute;
          top: -28px; left: -28px; right: -28px; bottom: -28px;
          border: 2px solid rgba(252, 129, 129, 0.35);
          border-radius: 5px;
          opacity: 0;
          animation: outerRipple 2s linear infinite 1.2s;
          z-index: -1;
          pointer-events: none;
        }

        @keyframes outerRipple {
          0% { transform: scale(0.7); opacity: 0.7; }
          100% { transform: scale(1.6); opacity: 0; }
        }

        .btn-arrow {
          width: 32px; height: 32px;
          background: rgba(255,255,255,0.25);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem;
          transition: transform 0.4s ease;
        }

        .cta-btn:hover .btn-arrow { transform: translateX(8px); }

        .hero-stats {
          display:grid; grid-template-columns:repeat(4,1fr);
          gap:1px; background:rgba(255,255,255,0.07);
          border:1px solid rgba(255,255,255,0.07); border-radius:5px;
          overflow:hidden; margin-top:4rem; max-width:800px; width:100%;
        }
        .stat-box { background:rgba(255,255,255,0.03); padding:0.75rem 1rem; text-align:center; transition:background 0.2s; }
        .stat-box:hover { background:rgba(229,62,62,0.08); }
        .stat-num { font-size:2.4rem; font-weight:900; color:var(--red); line-height:1; }
        .stat-lbl { font-size:0.75rem; color:rgba(255,255,255,0.4); margin-top:6px; font-weight:500; letter-spacing:0.05em; }

        .white-sections { background:var(--white); }
        .section-wrap { max-width:1400px; margin:0 auto; padding:4rem 1.5rem; }

        .section-tag {
          display:inline-flex; align-items:center; gap:8px;
          font-size:0.7rem; font-weight:700; letter-spacing:0.2em;
          text-transform:uppercase; color:var(--red); margin-bottom:1rem;
        }
        .section-tag::before { content:''; width:20px; height:2px; background:var(--red); border-radius:2px; }

        .section-h { font-size:clamp(2rem,5vw,3rem); font-weight:700; color:var(--gray-800); line-height:1.15; letter-spacing:-0.025em; margin-bottom:0.75rem; }
        .section-p { font-size:1rem; color:var(--gray-600); line-height:1.75; max-width:520px; margin-bottom:3.5rem; }

        .benefits-layout { display:grid; grid-template-columns:1fr 1fr; gap:3rem; align-items:start; }
        .benefits-list { display:flex; flex-direction:column; }
        .benefit-row {
          display: flex; gap: 1rem; padding: 1.25rem; border-radius: 12px;
          border: 1px solid transparent; transition: all 0.25s ease; position: relative;
          border-bottom:2px solid var(--gray-100); overflow: hidden;
          transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.25s cubic-bezier(0.22, 1, 0.36, 1),
            background 0.15s ease, border-color 0.15s ease;
        }
        .benefit-row:first-child { padding-top:15; }
        .benefit-row:last-child { border-bottom:-1px; }
        .benefit-row:hover {
          background: #fff; border-color: var(--red-mid);
          transform: translateX(3px); box-shadow: 0 10px 30px rgba(229, 62, 62, 0.08);
        }
        .benefit-icon-wrap {
          width: 42px; height: 42px; border-radius: 12px;
          background: var(--red-light); display: flex; align-items: center;
          justify-content: center; font-size: 1.1rem; flex-shrink: 0;
          margin-top: 2px; transition: all 0.25s ease;
        }
        .benefit-row:hover .benefit-icon-wrap {
          background: var(--red); color: #fff; transform: scale(1.1) rotate(5deg);
        }
        .benefit-t { font-size: 20px; font-weight: 700; color: var(--gray-800); margin-bottom: 4px; transition: color 0.2s; }
        .benefit-row:hover .benefit-t { color: var(--red-dark); }
        .benefit-d { font-size: 15px; color: var(--gray-600); line-height: 1.6; }

        .benefit-row::before {
          content: ""; position: absolute; left: 0; top: 50%;
          transform: translateY(-50%) scaleY(0); width: 3px; height: 60%;
          background: linear-gradient(var(--red), #fc8181); border-radius: 2px;
          transition: transform 0.25s ease;
        }
        .benefit-row:hover::before { transform: translateY(-50%) scaleY(1); }
        .benefit-row::after {
          content: ""; position: absolute; top: 0; left: -120%; width: 60%; height: 100%;
          background: linear-gradient(120deg, transparent 0%, rgba(255, 116, 116, 0.5) 50%, transparent 100%);
          transform: skewX(-20deg);
        }
        .benefit-row:hover::after { animation: shine 0.8s ease forwards; }
        @keyframes shine { 0% { left: -120%; } 100% { left: 120%; } }

        .benefits-right { position:sticky; top:6rem; }
        .benefit-card-big { background:var(--dark); border-radius:20px; padding:2.5rem; color:#fff; position:relative; overflow:hidden; }
        .benefit-card-big::before { content:''; position:absolute; top:-60px; right:-60px; width:240px; height:240px; border-radius:50%; background:radial-gradient(circle,rgba(229,62,62,0.3) 0%,transparent 70%); }
        .bcb-label { font-size:0.7rem; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; color:#fc8181; margin-bottom:1.5rem; }
        .bcb-title { font-size:1.6rem; font-weight:700; line-height:1.25; margin-bottom:1rem; }
        .bcb-desc { font-size:0.9rem; color:rgba(255,255,255,0.55); line-height:1.7; margin-bottom:2rem; }
        .bcb-pills { display:flex; gap:8px; flex-wrap:wrap; }
        .bcb-pill { background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.1); border-radius:100px; padding:5px 12px; font-size:0.78rem; color:rgba(255,255,255,0.7); }

        .s-divider { height:1px; background:var(--gray-100); max-width:1100px; margin:0 auto; }

        .teams-layout { display:grid; grid-template-columns:repeat(5,1fr); gap:16px; }
        .team-card {
          border-radius: 16px; overflow: hidden; border: 1px solid var(--gray-200);
          background: var(--white); position: relative;
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.25s ease;
        }
        .team-card:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 20px 50px rgba(0,0,0,0.12); border-color: var(--red); }
        .team-card::after {
          content: ""; position: absolute; bottom: 0; left: -100%; width: 100%; height: 3px;
          background: linear-gradient(90deg, transparent, var(--red), #fc8181, transparent);
          transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1); transform: translateX(0);
        }
        .team-card:hover::after { transform: translateX(200%); }
        .team-card:hover .team-icon { transform: scale(1.2) rotate(5deg); }
        .team-card:hover .team-card-top { background: #fff5f5; }
        .team-card-top {
          padding: 1.5rem; border-bottom: 1px solid var(--gray-100); background: var(--gray-50);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 10px; position: relative; transition: background 0.3s ease;
        }
        .team-num-badge {
          position: absolute; top: 12px; left: 12px;
          font-size: 0.65rem; font-weight: 800; letter-spacing: 0.12em;
          color: #fff; background: linear-gradient(135deg, var(--red), #fc8181);
          border-radius: 6px; padding: 4px 8px; box-shadow: 0 4px 12px rgba(229, 62, 62, 0.4);
        }
        .team-icon {
          width: 70px; height: 70px; display: flex; align-items: center; justify-content: center;
          font-size: 2.8rem; border-radius: 50%; background: var(--red-light); color: var(--red);
          transition: all 0.3s ease;
        }
        .team-card:hover .team-icon, .team-card.active .team-icon {
          background: var(--red); color: #fff; transform: scale(1.15) rotate(6deg);
          box-shadow: 0 10px 25px rgba(229, 62, 62, 0.35);
        }
        .team-card-body { padding:1.25rem 1.5rem; }
        .team-n { font-size:1.25rem; font-weight:800; color:var(--gray-800); margin-bottom:4px; }
        .team-s { font-size:1rem; color:var(--gray-600); line-height:1.5; }

        .eval-layout { display:grid; grid-template-columns:1fr 1.2fr; gap:3rem; }
        .score-bar-list { display:flex; flex-direction:column; gap:1.25rem; margin-bottom:2rem; }
        .score-bar-header { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:8px; }
        .score-bar-name { font-size:0.9rem; font-weight:600; color:var(--gray-800); }
        .score-bar-pct { font-size:2rem; font-weight:900; color:var(--red); }
        .score-bar-track { height:8px; background:var(--gray-100); border-radius:100px; overflow:hidden; }
        .score-bar-fill { height: 100%; border-radius: 100px; background: linear-gradient(90deg, var(--red), #fc8181); width: 0; transition: width 5s ease; }
        .score-bar-sub { font-size:16px; color:var(--gray-400); margin-top:4px; }

        .grade-table { border-radius:16px; overflow:hidden; border:1px solid var(--gray-200); }
        .grade-head { background:var(--gray-50); padding:1rem 1.25rem; font-size:16px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--gray-400); display:grid; grid-template-columns:80px 1fr 1fr; gap:1rem; }
        .grade-row { display:grid; grid-template-columns:80px 1fr 1fr; gap:1rem; padding:1.1rem 1.25rem; align-items:center; border-top:1px solid var(--gray-100); transition:background 0.15s; }
        .grade-row:hover { background:var(--gray-50); }
        .grade-score-val { font-size:1.6rem; font-weight:900; color:var(--gray-800); }
        .grade-badge { display:inline-flex; align-items:center; justify-content:center; font-size:0.68rem; font-weight:800; letter-spacing:0.1em; padding:4px 10px; border-radius:6px; width:fit-content; }
        .grade-d { font-size:16px; color:var(--gray-600); }

        .behavior-panel { margin-top:2rem; border-radius:12px; background:var(--red-light); border:1px solid var(--red-mid); padding:1.5rem; }
        .behavior-t { font-size:0.85rem; font-weight:700; color:var(--red-dark); margin-bottom:0.75rem; }
        .behavior-li { display:flex; gap:8px; font-size:16px; color:var(--gray-600); line-height:1.6; margin-bottom:4px; }
        .behavior-li::before { content:'→'; color:var(--red); flex-shrink:0; font-weight:700; }

        .guidelines-layout { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
        .guide-card {
          background: var(--white); border: 1px solid var(--gray-200); border-radius: 22px;
          padding: 2.25rem 2rem 2rem; position: relative; overflow: hidden;
          transition: all 0.45s cubic-bezier(0.23, 1, 0.32, 1); box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
        }
        .guide-card:hover { transform: translateY(-14px) scale(1.02); border-color: var(--red); box-shadow: 0 25px 60px rgba(229, 62, 62, 0.18); background: #fffafafa; }
        .guide-card::before {
          content: ''; position: absolute; top: 0; left: -100%; width: 60%; height: 4px;
          background: linear-gradient(90deg, transparent, var(--red), #fc8181, transparent);
          transition: left 0.8s ease;
        }
        .guide-card:hover::before { left: 120%; }
        .guide-num-wrapper { display: flex; align-items: center; gap: 16px; margin-bottom: 1.4rem; }
        .guide-icon {
          font-size: 2.3rem; width: 64px; height: 64px; display: flex; align-items: center; justify-content: center;
          background: var(--red-light); color: var(--red); border-radius: 18px;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); box-shadow: 0 4px 12px rgba(229, 62, 62, 0.15);
        }
        .guide-card:hover .guide-icon { background: var(--red); color: #fff; transform: scale(1.15) rotate(12deg); box-shadow: 0 8px 20px rgba(229, 62, 62, 0.3); }
        .guide-num {
          font-size: 3.1rem; font-weight: 900; line-height: 1;
          background: linear-gradient(135deg, var(--red), #fc8181);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 3px 6px rgba(229, 62, 62, 0.25)); transition: transform 0.4s ease;
        }
        .guide-card:hover .guide-num { transform: scale(1.08); }
        .guide-text { font-size: 0.96rem; color: var(--gray-600); line-height: 1.78; }

        .final-section {
          background: var(--dark); position: relative; overflow: hidden;
          padding: 4rem 1.5rem; text-align: center;
        }
        .final-section::before {
          content: ""; position: absolute; inset: 0;
          background-image: linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          mask-image: radial-gradient(circle at center, black 40%, transparent 80%);
        }
        .final-section::after {
          content: ""; position: absolute; width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(239,68,68,0.25), transparent 70%);
          top: 50%; left: 50%; transform: translate(-50%, -50%);
          filter: blur(80px); z-index: 0;
        }
        .final-section * { position: relative; z-index: 2; }
        .final-big { font-size:clamp(2.5rem,7vw,3.5rem); font-weight:700; color:#fff; line-height:1.08; letter-spacing:-0.04em; margin-bottom:1.25rem; max-width:700px; margin-inline:auto; }
        .final-big span { color:var(--red); }
        .final-sub { font-size:1.05rem; color:rgba(255,255,255,0.5); max-width:480px; margin:0 auto 3rem; line-height:1.75; }

        .modal-bg { position:fixed; inset:0; z-index:999; background:rgba(0,0,0,0.75); backdrop-filter:blur(10px); display:flex; align-items:center; justify-content:center; padding:1rem; animation:mfade 0.2s ease; }
        @keyframes mfade { from{opacity:0} to{opacity:1} }
        .modal-box { background:#fff; border-radius:20px; width:100%; min-height:100%; display:flex; flex-direction:column; overflow:hidden; animation:mslide 0.3s cubic-bezier(0.34,1.56,0.64,1); }
        @keyframes mslide { from{opacity:0;transform:translateY(32px) scale(0.96)} to{opacity:1;transform:none} }
        .modal-head { display:flex; align-items:center; justify-content:space-between; padding:1.25rem 1.5rem; border-bottom:1px solid var(--gray-100); background:var(--gray-50); }
        .modal-head-title { font-size:1rem; font-weight:700; color:var(--gray-800); display:flex; align-items:center; gap:8px; }
        .modal-close { width:34px; height:34px; border-radius:8px; border:1px solid var(--gray-200); background:#fff; cursor:pointer; font-size:1rem; color:var(--gray-400); display:flex; align-items:center; justify-content:center; transition:all 0.15s; font-family:var(--font); }
        .modal-close:hover { background:var(--red); color:#fff; border-color:var(--red); }
        .modal-body { flex:1; overflow-y:auto; }

        @media (max-width:900px) {
          .benefits-layout { grid-template-columns:1fr; }
          .benefits-right { position:static; }
          .teams-layout { grid-template-columns:repeat(2,1fr); }
          .eval-layout { grid-template-columns:1fr; }
          .guidelines-layout { grid-template-columns:repeat(2,1fr); }
          .hero-stats { grid-template-columns:repeat(2,1fr); }
        }
        @media (max-width:560px) {
          .teams-layout { grid-template-columns:1fr 1fr; }
          .guidelines-layout { grid-template-columns:1fr; }
          .grade-head,.grade-row { grid-template-columns:60px 1fr; }
          .grade-d { display:none; }
        }
      `}</style>

      {/* HERO */}
      <section className="hero">
        <div className="hero-badge">
          <span className="badge-dot" /> {t("apply.badge")}
        </div>
        <h1 className="hero-title">
          {t("apply.title")} <span>{t("apply.titleHighlight")}</span>
        </h1>
        <p className="hero-sub">{t("apply.subtitle")}</p>

        <div className="hero-path">
          {pathSteps.map((label, i) => (
            <span
              key={label}
              className={`path-step ${i === 0 ? "active" : ""}`}
            >
              {label}
            </span>
          ))}
        </div>

        <p className="hero-desc">{t("apply.desc")}</p>

        <button className="cta-btn" onClick={() => setShowForm(true)}>
          {t("apply.cta")}
          <span className="btn-arrow">→</span>
        </button>

        <div className="hero-stats">
          {[
            { n: "5", lKey: "apply.stats.teams" },
            { n: "7", lKey: "apply.stats.levels" },
            { n: "100%", lKey: "apply.stats.kpi" },
            { n: "∞", lKey: "apply.stats.opportunity" },
          ].map((s) => (
            <div key={s.lKey} className="stat-box">
              <div className="stat-num">{s.n}</div>
              <div className="stat-lbl">{t(s.lKey)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* WHITE SECTIONS */}
      <div className="white-sections">
        {/* S1 BENEFITS */}
        <div className="section-wrap">
          <div className="section-tag">{t("apply.benefits.tag")}</div>
          <h2 className="section-h anim">{t("apply.benefits.heading")}</h2>
          <p className="section-p anim d1">{t("apply.benefits.subheading")}</p>
          <div className="benefits-layout">
            <div>
              <div className="benefits-list">
                {benefitItems.map((b, i) => (
                  <div
                    key={b.title}
                    className={`benefit-row anim d${Math.min(i + 1, 6)}`}
                  >
                    <div className="benefit-icon-wrap">{b.icon}</div>
                    <div>
                      <div className="benefit-t">✓ {b.title}</div>
                      <div className="benefit-d">{b.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="benefits-right anim d2">
              <div className="benefit-card-big">
                <div className="bcb-label">
                  {t("apply.benefits.card.label")}
                </div>
                <div className="bcb-title">
                  {t("apply.benefits.card.title")}
                </div>
                <div className="bcb-desc">{t("apply.benefits.card.desc")}</div>
                <div className="bcb-pills">
                  {benefitPills.map((p) => (
                    <span key={p} className="bcb-pill">
                      {p}
                    </span>
                  ))}
                </div>
                <div
                  style={{
                    marginTop: "2rem",
                    padding: "1.25rem",
                    background: "rgba(229,62,62,0.15)",
                    borderRadius: 12,
                    border: "1px solid rgba(229,62,62,0.25)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      color: "#fc8181",
                      marginBottom: 6,
                    }}
                  >
                    {t("apply.benefits.card.highlightLabel")}
                  </div>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      color: "rgba(255,255,255,0.8)",
                      lineHeight: 1.6,
                    }}
                  >
                    {t("apply.benefits.card.highlightText")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="s-divider" />

        {/* S2 TEAMS */}
        <div className="section-wrap">
          <div className="section-tag">{t("apply.teams.tag")}</div>
          <h2 className="section-h anim">{t("apply.teams.heading")}</h2>
          <p className="section-p anim d1">{t("apply.teams.subheading")}</p>
          <div className="teams-layout">
            {teamItems.map((team, i) => (
              <div key={team.name} className={`team-card anim d${i + 1}`}>
                <div className="team-card-top">
                  <div className="team-num-badge">{team.num}</div>
                  <div className="team-icon">{team.icon}</div>
                </div>
                <div className="team-card-body">
                  <div className="team-n">{team.name}</div>
                  <div className="team-s">{team.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="s-divider" />

        {/* S3 EVAL */}
        <div className="section-wrap">
          <div className="section-tag">{t("apply.eval.tag")}</div>
          <h2 className="section-h anim">{t("apply.eval.heading")}</h2>
          <p className="section-p anim d1">{t("apply.eval.subheading")}</p>
          <div className="eval-layout">
            <div>
              <div className="score-bar-list">
                {evalBars.map((bar, i) => (
                  <div key={bar.name} className={`anim d${i + 1}`}>
                    <div className="score-bar-header">
                      <span className="score-bar-name">{bar.name}</span>
                      <span className="score-bar-pct">
                        {animatedValues[i] ?? 0}
                      </span>
                    </div>
                    <div className="score-bar-track">
                      <div
                        className="score-bar-fill"
                        style={{ width: hasAnimated ? `${bar.pct}%` : "0%" }}
                      />
                    </div>
                    <div className="score-bar-sub">{bar.sub}</div>
                  </div>
                ))}
              </div>
              <div className="behavior-panel anim d4">
                <div className="behavior-t">
                  {t("apply.eval.behavior.title")}
                </div>
                {evalBehaviorItems.map((item, i) => (
                  <div key={i} className="behavior-li">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="anim d2">
              <div className="grade-table">
                <div className="grade-head">
                  {gradeHead.map((h) => (
                    <span key={h}>{h}</span>
                  ))}
                </div>
                {grades.map((g, i) => (
                  <div key={g.badge} className="grade-row">
                    <span className="grade-score-val">
                      {g.label} {animatedGrades[i] ?? 0}
                    </span>
                    <span
                      className="grade-badge"
                      style={{ background: g.bg, color: g.col }}
                    >
                      {g.badge}
                    </span>
                    <span className="grade-d">{g.desc}</span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: 16,
                  padding: "1.5rem",
                  background: "var(--gray-50)",
                  borderRadius: 12,
                  border: "1px solid var(--gray-200)",
                }}
              >
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "var(--gray-400)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  {t("apply.eval.noteLabel")}
                </div>
                <div
                  style={{
                    fontSize: "16px",
                    color: "var(--gray-600)",
                    lineHeight: 1.7,
                  }}
                >
                  {t("apply.eval.noteText")}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="s-divider" />

        {/* S4 GUIDELINES */}
        <div className="section-wrap">
          <div className="section-tag">{t("apply.guidelines.tag")}</div>
          <h2 className="section-h anim">{t("apply.guidelines.heading")}</h2>
          <p className="section-p anim d1">
            {t("apply.guidelines.subheading")}
          </p>

          <div className="guidelines-layout">
            {guidelineItems.map((g, i) => (
              <div
                key={g.num}
                className={`guide-card anim d${Math.min(i + 1, 6)}`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="guide-num-wrapper">
                  <span className="guide-icon">{g.icon}</span>
                  <span className="guide-num">{g.num}</span>
                </div>
                <div className="guide-text">{g.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FINAL CTA */}
      <section className="final-section">
        <div
          className="section-tag anim"
          style={{ justifyContent: "center", color: "#fc8181" }}
        >
          {t("apply.final.readyTag")}
        </div>
        <h2 className="final-big anim d1">
          {t("apply.final.heading")}
          <br />
          <span>{t("apply.final.headingHighlight")}</span>
        </h2>
        <p className="final-sub anim d2">{t("apply.final.desc")}</p>
        <div className="anim d3">
          <button className="cta-btn" onClick={() => setShowForm(true)}>
            {t("apply.cta")} <span className="btn-arrow">→</span>
          </button>
        </div>
      </section>

      {/* MODAL */}
      {showForm && (
        <div
          className="modal-bg"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowForm(false);
          }}
        >
          <div className="modal-box">
            <div className="modal-head">
              <div className="modal-head-title">
                <span style={{ fontSize: "1.1rem" }}>🚀</span>{" "}
                {t("apply.modal.title")}
              </div>
              <button
                className="modal-close"
                onClick={() => setShowForm(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <iframe
                src="https://docs.google.com/forms/d/e/1FAIpQLSc6JGg4OuscRkP3ZI-OvtmPmG91aIdLzw7y53S9ThD10oLd5Q/viewform?embedded=true"
                width="100%"
                height="700"
                frameBorder={0}
                marginHeight={0}
                marginWidth={0}
                style={{ display: "block" }}
              >
                {t("apply.modal.loading")}
              </iframe>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
