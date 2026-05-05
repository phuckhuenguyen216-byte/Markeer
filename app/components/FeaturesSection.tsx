  /* eslint-disable react-hooks/exhaustive-deps */
  "use client"
  import React, { useEffect, useRef, useState, useCallback } from "react";
  import { useTranslation } from "react-i18next";
  import "../i18n";
  import {
    Send,
    Share2,
    Calendar,
    Clock,
    ListChecks,
    History,
    BarChart3,
    TrendingUp,
    Target,
    Sparkles
  } from "lucide-react";
import { t } from "i18next";

  const ICON_MAP: Record<
    string,
    { icon: React.ReactNode; color: string; bg: string }
  > = {
    Send: {
      icon: <Send size={20} />,
      color: "#2563eb",
      bg: "rgba(37,99,235,0.12)"
    },
    Share2: {
      icon: <Share2 size={20} />,
      color: "#7c3aed",
      bg: "rgba(124,58,237,0.12)"
    },
    Calendar: {
      icon: <Calendar size={20} />,
      color: "#ea580c",
      bg: "rgba(234,88,12,0.12)"
    },
    Clock: {
      icon: <Clock size={20} />,
      color: "#0891b2",
      bg: "rgba(8,145,178,0.12)"
    },
    ListChecks: {
      icon: <ListChecks size={20} />,
      color: "#16a34a",
      bg: "rgba(22,163,74,0.12)"
    },
    History: {
      icon: <History size={20} />,
      color: "#9333ea",
      bg: "rgba(147,51,234,0.12)"
    },
    BarChart3: {
      icon: <BarChart3 size={20} />,
      color: "#dc2626",
      bg: "rgba(220,38,38,0.12)"
    },
    TrendingUp: {
      icon: <TrendingUp size={20} />,
      color: "#059669",
      bg: "rgba(5,150,105,0.12)"
    },
    Target: {
      icon: <Target size={20} />,
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.12)"
    },
    Sparkles: {
      icon: <Sparkles size={20} />,
      color: "#db2777",
      bg: "rgba(219,39,119,0.12)"
    }
  };

  // const features = t("features.groups", { returnObjects: true }) as FeatureGroup[];
  // type FeatureItem = {
  //   title: string;
  //   description: string;
  //   icon: string;
  // };

  // type FeatureGroup = {
  //   group: string;
  //   name: string;
  //   logo: string;
  //   items: FeatureItem[];
  // };

  type FeatureItem = {
  title: string;
  description: string;
  icon: string;
  };

  type FeatureGroup = {
    group: string;
    name: string;
    logo: string;
    video: string;
    items: FeatureItem[];
  };

  function GlitchText({ text }: { text: string }) {
    return (
      <span className="glitch" data-text={text}>
        {text}
      </span>
    );
  }

  const CYCLE_DURATION = 5000;

  export default function FeaturesSection() {

    const openVideo = (videoUrl: string) => {
      window.open(videoUrl, "_blank");
    };

    const { t } = useTranslation("common");
    const rawFeatures = t("features.groups", { returnObjects: true }) as unknown;
    const features: FeatureGroup[] = Array.isArray(rawFeatures)
      ? (rawFeatures as FeatureGroup[])
      : [];
    const rawBenefits = t("Benefit.description", { returnObjects: true });

    const benefits = Array.isArray(rawBenefits)
      ? rawBenefits
      : Object.values(rawBenefits || {});

    const [activeGroup, setActiveGroup] = useState(0);
    const [progress, setProgress] = useState(0);
    const startTimeRef = useRef<number>(Date.now());
    const rafRef = useRef<number | null>(null);
    const isPausedRef = useRef(false);
    const activeGroupRef = useRef(0);

    const goToGroup = useCallback((idx: number) => {
      activeGroupRef.current = idx;
      setActiveGroup(idx);
      startTimeRef.current = Date.now();
      setProgress(0);
    }, []);

    const [activeVideo, setActiveVideo] = useState<string | null>(null);
    const [isVideoOpen, setIsVideoOpen] = useState(false);

    // Auto cycle
    useEffect(() => {
      if (features.length <= 1) return;

      let advancing = false;
      const tick = () => {
        if (!isPausedRef.current) {
          const elapsed = Date.now() - startTimeRef.current;
          const p = Math.min((elapsed / CYCLE_DURATION) * 100, 100);
          setProgress(p);

          if (p >= 100 && !advancing) {
            advancing = true;
            const next = (activeGroupRef.current + 1) % features.length;
            goToGroup(next);
            setTimeout(() => { advancing = false; }, 400);
          }
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }, [features.length, goToGroup]);

    const handleTabClick = (i: number) => {
      if (i === activeGroupRef.current) return;
      isPausedRef.current = false;
      goToGroup(i);
    };

    return (
      <>
        <style>{`
          :root {
            --r50:  #fff0f0;
            --r100: #ffe0e0;
            --r200: #ffb3b3;
            --r300: #ff8080;
            --r400: #ff5555;
            --r500: #ff2222;
            --r600: #e00000;
            --r800: #800000;
            --fs-bg:       #ffffff;
            --fs-border:   rgba(255,34,34,0.1);
            --fs-surface:  rgba(255,34,34,0.035);
            --fs-text-hi:  #0a0a0a;
            --fs-text-mid: #555555;
            --fs-text-low: #aaaaaa;
          }

          .fs-wrap {
            font-family: 'DM Sans', sans-serif;
            background: var(--fs-bg);
            position: relative;
            overflow: hidden;
            padding: 100px 0 120px;
          }
          .fs-wrap::before {
            content: '';
            position: absolute; inset: 0;
            background-image:
              linear-gradient(rgba(255,34,34,0.032) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,34,34,0.032) 1px, transparent 1px);
            background-size: 56px 56px;
            pointer-events: none;
          }

          .fs-scan {
            position: absolute; left: 0; right: 0; height: 1px;
            background: linear-gradient(90deg, transparent, rgba(255,80,80,0.55) 40%, rgba(255,80,80,0.55) 60%, transparent);
            animation: scanDown 9s linear infinite;
            pointer-events: none; z-index: 1;
          }
          @keyframes scanDown {
            0%  { top: -2px; opacity: 0; }
            5%  { opacity: 1; }
            95% { opacity: 1; }
            100%{ top: 100%; opacity: 0; }
          }

          .fs-corner { position: absolute; width: 60px; height: 60px; pointer-events: none; z-index: 2; }
          .fs-corner--tl { top: 20px; left: 20px; }
          .fs-corner--br { bottom: 20px; right: 20px; transform: rotate(180deg); }

          .fs-header {
            text-align: center; padding: 0 24px;
            max-width: 1200px; margin: 0 auto 64px;
            position: relative; z-index: 3;
          }
          .fs-eyebrow {
            font-size: 10px; letter-spacing: .3em;
            color: var(--r500); text-transform: uppercase;
            display: flex; align-items: center; justify-content: center;
            gap: 14px; margin-bottom: 22px;
          }
          .fs-eyebrow-line {
            display: block; width: 36px; height: 1px;
            background: linear-gradient(90deg, transparent, var(--r400));
          }
          .fs-eyebrow-line.rev { transform: scaleX(-1); }
          .fs-title {
            font-size: clamp(2rem, 4.5vw, 3.6rem);
            font-weight: 900;
            // color: var(--fs-text-hi);
            line-height: 1.1; letter-spacing: -.02em; margin-bottom: 14px;
            background: linear-gradient(180deg, #252323, #3a0e0e, #6b0000, #b30000, #ff2a2a);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

          }
          .fs-title-rule {
            width: 120px; height: 2px; background: var(--r500);
            margin: 0 auto 20px; position: relative; overflow: hidden;
          }
          .fs-title-rule-shine {
            position: absolute; inset: 0;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent);
            animation: fs-shine 1.2s linear infinite;
          }
          @keyframes fs-shine { from{transform:translateX(-100%)} to{transform:translateX(100%)} }
          .fs-subtitle{
  font-size: 1.05rem;
  font-weight: 300;
  line-height: 1.75;
  max-width: 580px;
  margin: 0 auto;

  background: linear-gradient(
    90deg,
    #ff4d4d,
    #ff8080,
    #ff4d4d
  );

  background-size: 200%;

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  animation: subtitleMove 6s linear infinite,
             subtitleFloat 4s ease-in-out infinite;
}
             

          .fs-tabs-row {
            max-width: 1200px;
            margin: 0 auto 52px;
            padding: 0 24px;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            position: relative;
            z-index: 3;
          }
          @media (max-width: 720px) {
            .fs-tabs-row { grid-template-columns: 1fr; }
          }

          .fs-tab-card-visual {
            position: absolute;
            top: -170px;
            left: 0;
            right: 0;
            display: flex;
            justify-content: center;
            z-index: 6;
            pointer-events: none;
          }
.fs-logo-name{
  margin-top:10px;
  transform: translateX(-130px);
  font-size:25px;
  font-weight:800;
  letter-spacing:0.15em;

  /* gradient màu */
  background: linear-gradient(
    90deg,
    #ff2a2a,
    #ff7a18,
    #ff4fa3,
    #ffd93d,
    #ff2a2a
  );
  background-size:200%;

  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
  background-clip:text;

  text-shadow:0 0 18px rgba(255,255,255,0.6);

  animation:logoGradient 4s linear infinite;
}

@keyframes logoGradient{
  0%{
    background-position:0%;
  }
  100%{
    background-position:200%;
  }
}
          .fs-tab-card {
            position: relative;
            overflow: visible;
            cursor: pointer;
            border: 1px solid var(--fs-border);
            border-radius: 0;
            background: #fff;
            padding: 220px 30px 40px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            justify-content: center;
            min-height: 360px;
            outline: none;
            gap: 0;
            transition:
              border-color 0.35s ease,
              box-shadow 0.35s ease,
              background 0.35s ease,
              transform 0.35s cubic-bezier(0.22,1,0.36,1);
          }

          .fs-tab-card:hover:not(.active) {
            border-color: rgba(255,34,34,0.28);
            background: var(--fs-surface);
            transform: translateY(-4px);
            box-shadow: 0 12px 36px rgba(255,34,34,0.09);
          }

          .fs-tab-card.active {
            border-color: rgba(255,34,34,0.45);
            background: linear-gradient(160deg, rgba(255,34,34,0.055) 0%, rgba(255,34,34,0.015) 100%);
            box-shadow:
              0 24px 60px rgba(255,34,34,0.15),
              0 6px 16px rgba(255,34,34,0.08),
              inset 0 1px 0 rgba(255,255,255,0.9);
            transform: translateY(-6px);
          }

          .fs-tab-card-topbar {
            position: absolute;
            top: 0; left: 0; right: 0;
            height: 3px;
            background: linear-gradient(90deg, var(--r500), var(--r300), var(--r500));
            transform: scaleX(0);
            transform-origin: left;
            transition: transform 0.45s cubic-bezier(0.22,1,0.36,1);
            border-radius: 0 0 3px 3px;
          }
          .fs-tab-card.active .fs-tab-card-topbar { transform: scaleX(1); }

          .fs-tab-card-num {
            font-size: 9px;
            letter-spacing: .3em;
            color: var(--r300);
            margin-bottom: 20px;
            position: relative; z-index: 1;
            transition: color 0.25s;
            text-transform: uppercase;
          }
          .fs-tab-card.active .fs-tab-card-num { color: var(--r500); }

          .fs-tab-card-icon {
            width: 76px; height: 76px;
            border-radius: 22px;
            background: linear-gradient(135deg, var(--r50), var(--r100));
            border: 1px solid var(--r200);
            display: flex; align-items: center; justify-content: center;
            font-size: 2.4rem;
            margin-bottom: 20px;
            position: relative; z-index: 1;
            transition:
              transform 0.4s cubic-bezier(0.22,1,0.36,1),
              background 0.35s ease,
              box-shadow 0.35s ease;
          }
          .fs-tab-card.active .fs-tab-card-icon {
            background: linear-gradient(135deg, var(--r100), var(--r200));
            box-shadow: 0 10px 28px rgba(255,34,34,0.28);
            transform: scale(1.1);
          }
          .fs-tab-card:hover:not(.active) .fs-tab-card-icon {
            transform: scale(1.05) rotate(-4deg);
          }

          .fs-tab-card-label {
            font-size: 18px;
            font-weight: 700;
            color: var(--fs-text-low);
            line-height: 1.5;
            margin-bottom: 0px;
            position: relative; z-index: 1;
            transition: color 0.25s;
            margin-top: 20px;
          }
          .fs-tab-card.active .fs-tab-card-label { color: var(--fs-text-hi); }

          .fs-tab-card-count {
            font-size: 11px;
            color: #ccc;
            letter-spacing: .08em;
            position: relative; z-index: 1;
            transition: color 0.25s;
          }
          .fs-tab-card.active .fs-tab-card-count { color: #999; }

          .fs-tab-card-progress {
            position: absolute;
            bottom: 0; left: 0;
            height: 3px; width: 100%;
            background: linear-gradient(90deg, #ff2a2a, #ff6a6a);
            box-shadow: 0 0 8px rgba(255,42,42,0.5);
            transform-origin: left;
            border-radius: 0 0 20px 20px;
          }

          .fs-tab-card-dot {
            position: absolute;
            bottom: -6px;
            left: 50%;
            transform: translateX(-50%);
            width: 10px; height: 10px;
            border-radius: 50%;
            background: var(--r200);
            border: 2px solid var(--fs-bg);
            z-index: 6;
            transition: background 0.3s;
            display: none;
          }
          .fs-tab-card.active .fs-tab-card-dot {
            display: block;
            background: var(--r500);
            box-shadow: 0 0 10px rgba(255,34,34,0.6);
          }
          .fs-tab-card.active .fs-tab-card-dot::before,
          .fs-tab-card.active .fs-tab-card-dot::after {
            content: '';
            position: absolute;
            inset: -20px;
            border-radius: 50%;
            border: 2px solid rgba(255,34,34,0.4);
            opacity: 0; transform: scale(0.5);
          }
          .fs-tab-card.active .fs-tab-card-dot::before { animation: rippleWave 2.2s ease-out infinite; }
          .fs-tab-card.active .fs-tab-card-dot::after  { animation: rippleWave 2.2s ease-out infinite; animation-delay: 1.1s; }
          @keyframes rippleWave {
            0%   { opacity: 0.6; transform: scale(0.6); }
            70%  { opacity: 0.2; }
            100% { opacity: 0; transform: scale(2.4); }
          }

          .fs-content-panel {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 24px;
            position: relative; z-index: 3;
          }

          .fs-content-header {
            display: flex; align-items: center; gap: 14px; margin-bottom: 28px;
          }
          .fs-content-tag {
            font-size: 9px; letter-spacing: .25em;
            color: var(--r500); padding: 4px 10px;
            border: 1px solid rgba(255,34,34,0.22);
            border-radius: 4px; background: var(--r50); white-space: nowrap;
          }
          .fs-content-rule {
            flex: 1; height: 1px;
            background: linear-gradient(90deg, rgba(255,34,34,0.25), transparent);
          }

          .fs-content-container {
            position: relative;
            min-height: 400px; /* Adjust based on your content */
          }

          .fs-content-group {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.4s ease;
            will-change: opacity;
          }

          .fs-content-group.active {
            opacity: 1;
            pointer-events: auto;
            position: relative;
          }

          .fs-grid {
            display: flex;
            flex-direction: column;
            gap: 24px;
            width: 100%;
          }

          .fs-card {
  position: relative;
  overflow: hidden;

  background:
    linear-gradient(180deg,#ffffff 0%,#fff6f6 100%);

  border: 1px solid rgba(255,34,34,0.15);
  border-radius: 18px;

  padding: 24px 28px;
  display: flex;
  gap: 22px;
  align-items: center;

  width: 100%;
  min-height: 120px;

  transition:
    transform .45s cubic-bezier(.22,1,.36,1),
    box-shadow .45s ease,
    border-color .35s ease,
    background .35s ease;

  box-shadow:
    0 4px 10px rgba(0,0,0,.04),
    0 1px 2px rgba(0,0,0,.05);
}
          .fs-card:hover {
  transform: translateY(-8px) scale(1.01);

  border-color: rgba(255,34,34,0.45);

  box-shadow:
    0 25px 60px rgba(255,34,34,.18),
    0 8px 20px rgba(0,0,0,.08);
}
          .fs-card::after {
            content: ''; position: absolute;
            left: 0; bottom: 0; width: 100%; height: 2px;
            background: rgba(255,42,42,0.12);
          }
          .fs-card:hover {
  transform: translateY(-8px) scale(1.01);

  border-color: rgba(255,34,34,0.45);

  box-shadow:
    0 25px 60px rgba(255,34,34,.18),
    0 8px 20px rgba(0,0,0,.08);
}
          .fs-card:hover::before { left: 100%; }

          .fc-icon {
  width: 54px;
  height: 54px;

  border-radius: 16px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  backdrop-filter: blur(6px);

  border: 1px solid rgba(255,255,255,.6);

  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.9),
    0 6px 18px rgba(0,0,0,.08);

  transition:
    transform .4s cubic-bezier(.22,1,.36,1),
    box-shadow .35s ease;
}
          .fs-card:hover .fc-icon {
  transform: rotate(-8deg) scale(1.12);

  box-shadow:
    0 12px 28px rgba(255,34,34,.25);
}
          .fc-content { position: relative; z-index: 1; flex: 1; }
          .fc-title {
            font-size: 18px; font-weight: 700;
            color: var(--fs-text-hi); line-height: 1.35; margin-bottom: 6px;
          }
          .fc-desc { font-size: 15px; color: var(--fs-text-mid); line-height: 1.65; font-weight: 300; }

          .fc-status { display: flex; align-items: center; gap: 6px; flex-shrink: 0; position: relative; z-index: 1; }
          .fc-led { width: 5px; height: 5px; border-radius: 50%; background: var(--r200); }
          .fc-led.on { background: var(--r500); animation: ledBlink 2.5s ease-in-out infinite; }
          @keyframes ledBlink { 0%,100% { opacity: 1; } 50% { opacity: .3; } }
          .fc-status-txt { font-size: 7.5px; letter-spacing: .15em; color: var(--r400); }

          .fs-tab-card-img {
            width: 400px;
            height: 500px;
            object-fit: contain;
            transition:
              transform .7s cubic-bezier(0.22,1,0.36,1),
              filter .5s ease;
            filter:
              drop-shadow(0 30px 50px rgba(255,34,34,.25))
              drop-shadow(0 10px 20px rgba(0,0,0,.18));
            transform-origin: center top;
          }

          .fs-tab-card.active .fs-tab-card-img {
            transform: scale(1.2) translateY(-12px);
            filter:
              drop-shadow(0 60px 100px rgba(255,34,34,.45));
          }

          .fs-tab-card:hover:not(.active) .fs-tab-card-img {
            transform: scale(1.1) translateY(-6px);
          }

          .glitch {
  position: relative;
  display: inline-block;
}

.glitch {
  position: relative;
  display: inline-block;

  background: linear-gradient(135deg, var(--r500), var(--r800));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  animation: glitchMain 2.8s infinite steps(2);
}
@keyframes glitchMain {
  0%   { transform: translate(0) skew(0deg); }
  10%  { transform: translate(-2px, 1px) skew(-2deg); }
  20%  { transform: translate(2px, -1px) skew(2deg); }
  30%  { transform: translate(-3px, 2px) skew(0deg); }
  40%  { transform: translate(3px, -2px) skew(1deg); }
  50%  { transform: translate(0) skew(0deg); }
  60%  { transform: translate(-4px, 1px) skew(-1deg); }
  70%  { transform: translate(3px, 2px) skew(2deg); }
  80%  { transform: translate(-2px, -1px) skew(0deg); }
  90%  { transform: translate(2px, 1px) skew(-1deg); }
  100% { transform: translate(0) skew(0deg); }
}

// .glitch::before {
//   left: 2px;
//   background-image: linear-gradient(135deg, var(--r500), var(--r800));
//   -webkit-background-clip: text;
//   background-clip: text;
//   -webkit-text-fill-color: transparent;
//   animation: g1 4.2s infinite steps(4);   /* steps để giữ cảm giác glitch digital */
// }

// .glitch::after {
//   left: -2px;
//   background-image: linear-gradient(135deg, var(--r500), var(--r800));
//   -webkit-background-clip: text;
//   background-clip: text;
//   -webkit-text-fill-color: transparent;
//   animation: g2 5.1s infinite steps(4);   /* thời gian khác → không đồng bộ */
// }

// /* ──────────────────────────────────────────────── */
// /* g1 – layer trên, giật thường xuyên hơn            */
// /* ──────────────────────────────────────────────── */
// @keyframes g1 {
//   0%    { transform: translate(0); }
//   8%    { transform: translate(-3px, 1px); }
//   16%   { transform: translate(3px, -2px); }
//   24%   { transform: translate(-2px, 2px); }
//   32%   { transform: translate(2px, -1px); }
//   40%   { transform: translate(-1px, 1px); }
//   48%   { transform: translate(0); }
//   56%   { transform: translate(-4px, 2px); }
//   64%   { transform: translate(3px, -3px); }
//   72%   { transform: translate(-2px, 1px); }
//   80%   { transform: translate(1px, -1px); }
//   88%   { transform: translate(-3px, 2px); }
//   96%   { transform: translate(2px, -2px); }
//   100%  { transform: translate(0); }
// }

// /* ──────────────────────────────────────────────── */
// /* g2 – layer dưới    */
// /* ──────────────────────────────────────────────── */
// @keyframes g2 {
//   0%    { transform: translate(0); }
//   10%   { transform: translate(3px, -1px); }
//   20%   { transform: translate(-3px, 2px); }
//   30%   { transform: translate(2px, -2px); }
//   40%   { transform: translate(-1px, 1px); }
//   50%   { transform: translate(3px, -1px); }
//   60%   { transform: translate(0); }
//   70%   { transform: translate(-4px, 3px); }
//   80%   { transform: translate(2px, -1px); }
//   90%   { transform: translate(-2px, 2px); }
//   100%  { transform: translate(0); }
// }

          
          /* CTA WRAPPER */
/* ───────────────────────────── */

.fs-cta {
  max-width: 1500px;
  margin: 90px auto 0;
  padding: 0 24px;
  position: relative;
  z-index: 3;
}

/* ───────────────────────────── */
/* CTA INNER SURFACE */
/* ───────────────────────────── */

.fs-cta-inner {
   background: linear-gradient(135deg, #2b0505 0%, #5a0a0a 45%, #7a0d0d 100%);
  border-radius: 22px;
  padding: 60px 60px;

  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 60px;
  flex-direction: column;
  align-items: center;
  text-align: center;

  overflow: hidden;
  position: relative;
}

/* Grid overlay tech */
.fs-cta-inner::before {
  content: '';
  position: absolute;
  inset: 0;
   background-image:
    linear-gradient(rgba(255,34,34,0.09) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,34,34,0.09) 1px, transparent 1px);
  background-size: 60px 60px;
}

/* Light sweep */
.fs-cta-inner::after {
  content: '';
  position: absolute;
  top: 0;
  left: -40%;
  width: 40%;
  height: 100%;

  background: linear-gradient(
    120deg,
    transparent,
    rgba(255, 34, 34, 0.08),
    rgba(255, 34, 34, 0.18),
    transparent
  );

  animation: ctaScan 7s linear infinite;
}

@keyframes ctaScan {
  0% { left: -40%; }
  100% { left: 140%; }
}

/* ───────────────────────────── */
/* LARGE GLOW DRIFT */
/* ───────────────────────────── */

.fs-cta-glow {
  position: absolute;
  width: 520px;
  height: 520px;
  border-radius: 50%;
  text-align: center;

  background: radial-gradient(
    circle,
    rgba(255, 34, 34, 0.28) 0%,
    rgba(255, 34, 34, 0.15) 40%,
    transparent 70%
  );

  top: 50%;
  right: 5%;
  transform: translateY(-50%);
  pointer-events: none;

  animation: glowDrift 8s ease-in-out infinite;
}

@keyframes glowDrift {
  0%,100% { transform: translateY(-50%) scale(1); }
  50% { transform: translateY(-50%) scale(1.15); }
}

/* ───────────────────────────── */
/* TEXT SECTION */
/* ───────────────────────────── */

.fs-cta-eyebrow {
  font-family: 'DM Sans', sans-serif;
  font-size: 9px;
  letter-spacing: .35em;
  color: var(--r400);
  margin-bottom: 14px;
  position: relative;
}

.fs-cta-title {
  font-family: 'DM Sans', sans-serif;
  font-size: clamp(1.4rem, 2.8vw, 2rem);
  font-weight: 600;   /* đổi từ 900 -> 600 */
  color: #fff;
  line-height: 1.35;  /* tăng nhẹ để tránh cắt dấu */
  margin-bottom: 16px;
}

/* Text shimmer */
.fs-cta-title::after {
  content: '';
  position: absolute;
  top: 0;
  left: -50%;
  width: 50%;
  height: 100%;

  background: linear-gradient(
    120deg,
    transparent,
    rgba(255,255,255,0.25),
    transparent
  );

  animation: textShimmer 5s linear infinite;
}

@keyframes textShimmer {
  0% { left: -50%; }
  100% { left: 150%; }
}

.fs-cta-body {
  font-size: 1rem;
  color: rgb(255, 255, 255);
  font-weight: 300;
  line-height: 1.7;
  max-width: 520px;
  position: relative;
  text-align: center;
  margin: 0 auto;
}

/* ───────────────────────────── */
/* HEX TECH BADGE */
/* ───────────────────────────── */

.fs-hex {
  position: relative;
  width: 100px;
  height: 100px;

  display: flex;
  align-items: center;
  justify-content: center;
}

/* Rotating outer ring */
.fs-hex::before {
  content: '';
  position: absolute;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  border: 1px solid rgba(255, 34, 34, 0.25);

  animation: rotateRing 12s linear infinite;
}

@keyframes rotateRing {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Hex background */
.fs-hex-bg {
  position: absolute;
  inset: 0;

  clip-path: polygon(
    50% 0%,100% 25%,100% 75%,
    50% 100%,0% 75%,0% 25%
  );

  background: linear-gradient(135deg, var(--r500), var(--r800));
  animation: hexGlow 3s ease-in-out infinite;
}

@keyframes hexGlow {
  0%,100% {
    filter: brightness(1) drop-shadow(0 0 8px rgba(255,34,34,.4));
  }
  50% {
    filter: brightness(1.25) drop-shadow(0 0 22px rgba(255,34,34,.8));
  }
}

.fs-hex-icon {
  position: relative;
  font-size: 2rem;
  z-index: 2;
  animation: iconPulse 2.5s ease-in-out infinite;
}

@keyframes iconPulse {
  0%,100% { transform: scale(1); }
  50% { transform: scale(1.18); }
}

.fs-hex-label {
  font-family: 'DM Sans', sans-serif;
  font-size: 8px;
  letter-spacing: .25em;
  color: rgba(255,255,255,.5);
  text-align: center;
  margin-top: 10px;
}

/* ───────────────────────────── */
/* RESPONSIVE */
/* ───────────────────────────── */

@media (max-width: 640px) {
  .fs-cta-inner {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 40px 28px;
  }

  .fs-cta-glow {
    display: none;
  }
}

.feature-highlight {
  max-width: 1200px;
  margin: 120px auto 0; 
  padding: 60px 32px;
  position: relative;
  overflow: hidden;
}

/* HEADER */
.feature-header {
  text-align: center;
  margin-bottom: 50px;
}

// .feature-eyebrow {
//   font-size: 15px;
//   color: #ff2a2a;
//   text-transform: uppercase;
//   display: inline-block;
//   margin-bottom: 12px;
// }

.feature-title {
  font-size: clamp(28px, 3.5vw, 42px);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.3;

  background: linear-gradient(
    90deg,
    #6f1a1a,
    #993f3f,
    #ff2a2a
  );
  background-size: 200%;

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  animation: titleFlow 6s linear infinite;

  text-shadow: 0 0 18px rgba(176, 104, 104, 0.25);
}

@keyframes titleFlow {
  0% { background-position: 0%; }
  100% { background-position: 200%; }
}

/* GRID */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

/* CARD */
.feature-card {
  position: relative;
  padding: 26px 20px;
  border-radius: 16px;

  background: rgba(249, 223, 223, 0.7);
  border: 1px solid rgba(255, 42, 42, 0.15);
  backdrop-filter: blur(10px);

  transition: all 0.4s cubic-bezier(.22,1,.36,1);
  overflow: hidden;
}

/* hover nâng */
.feature-card:hover {
  transform: translateY(-10px);
  border-color: rgba(255, 42, 42, 0.5);
  box-shadow: 0 25px 60px rgba(255, 42, 42, 0.15);
}

/* index number */
.feature-index {
  font-size: 18px;
  letter-spacing: .25em;
  color: #ff2a2a;
  margin-bottom: 14px;
}

/* title */
.feature-card h3 {
  font-size: 20px;
  font-weight: 700;
  color: #111;
  margin-bottom: 10px;
}

/* text */
.feature-card p {
  font-size: 16px;
  color: #555;
  line-height: 1.6;
}

/* glow effect */
.feature-glow {
  position: absolute;
  inset: -40%;
  background: radial-gradient(
    circle,
    rgba(255, 42, 42, 0.15),
    transparent 60%
  );
  opacity: 0;
  transition: 0.4s;
}

.feature-card:hover .feature-glow {
  opacity: 1;
}

/* alternating tone */
.feature-card.dark {
  background: rgba(163, 52, 52, 0.47);
  color: white;
}

.feature-card.dark h3 {
  color: #fff;
}

.feature-card.dark p {
  color: #cfcfcf;
}

/* responsive */
@media (max-width: 900px) {
  .feature-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 520px) {
  .feature-grid {
    grid-template-columns: 1fr;
  }
}

/* responsive */
/*@media (max-width: 768px) {
  .feature-grid {
    grid-template-columns: 1fr 1fr;
  }
}*/
        `}</style>

        <section className="fs-wrap" id="features">
          {/* <div className="fs-scan" /> */}

          <svg className="fs-corner fs-corner--tl" viewBox="0 0 60 60" fill="none">
            <path d="M0 60 L0 0 L60 0" stroke="rgba(255,34,34,0.18)" strokeWidth="1"/>
            <circle cx="0" cy="0" r="3" fill="rgba(255,34,34,0.45)"/>
            <rect x="26" y="0" width="1" height="10" fill="rgba(255,34,34,0.18)"/>
            <rect x="0" y="26" width="10" height="1" fill="rgba(255,34,34,0.18)"/>
          </svg>
          <svg className="fs-corner fs-corner--br" viewBox="0 0 60 60" fill="none">
            <path d="M0 60 L0 0 L60 0" stroke="rgba(255,34,34,0.18)" strokeWidth="1"/>
            <circle cx="0" cy="0" r="3" fill="rgba(255,34,34,0.45)"/>
          </svg>

          {/* HEADER */}
          <div className="fs-header">
            <div className="fs-eyebrow">
              <span className="fs-eyebrow-line" />
              SYS.CORE — MODULES
              <span className="fs-eyebrow-line rev" />
            </div>
            <h2 className="fs-title">
              <GlitchText text={t("features.title")} />
            </h2>
            <div className="fs-title-rule">
              <div className="fs-title-rule-shine" />
            </div>
            <p className="fs-subtitle">{t("features.description")}</p>
          </div>

          {/* TABS */}
          <div className="fs-tabs-row">
            {features.map((group, i) => {
              const isActive = activeGroup === i;
              return (
                <button
                  key={i}
                  className={`fs-tab-card ${isActive ? "active" : ""}`}
                  onClick={() => {
                    handleTabClick(i);
                    setActiveVideo(group.video);
                    setIsVideoOpen(true);
                  }}
                  onMouseEnter={() => { isPausedRef.current = true; }}
                  onMouseLeave={() => { isPausedRef.current = false; }}
                >
                 <div className="fs-tab-card-visual">

                  <img
                    src={group.logo}
                    alt={group.group}
                    className="fs-tab-card-img"
                  />
                </div>
                 <p className="fs-logo-name">
                    {group.name}
                  </p>

                  <div className="fs-tab-card-label">{group.group}</div>
                  <div className="fs-tab-card-count">{group.items.length} modules</div>

                  {isActive && (
                    <div
                      className="fs-tab-card-progress"
                      style={{ transform: `scaleX(${progress / 100})` }}
                    />
                  )}

                  <div className="fs-tab-card-dot" />
                </button>
              );
            })}
          </div>

          {/* CONTENT */}
          <div className="fs-content-panel">
            <div className="fs-content-header">
              <span className="fs-content-tag">
                GROUP_{String(activeGroup + 1).padStart(2, "0")} — {features[activeGroup]?.group}
              </span>
              <div className="fs-content-rule" />
            </div>

            <div className="fs-content-container">
              {features.map((group, groupIdx) => (
                <div
                  key={groupIdx}
                  className={`fs-content-group ${activeGroup === groupIdx ? 'active' : ''}`}
                >
                  <div className="fs-grid">
                    {group.items.map((feature, idx) => {
                      const iconData = ICON_MAP[feature.icon];
                      return (
                        <div
                          key={idx}
                          className="fs-card"
                        >
                          <div
                            className="fc-icon"
                            style={{
                              color: iconData?.color,
                              background: iconData?.bg
                            }}
                          >
                            {iconData?.icon}
                          </div>
                          <div className="fc-content">
                            <div className="fc-title">{feature.title}</div>
                            <p className="fc-desc">{feature.description}</p>
                          </div>
                          <div className="fc-status">
                            <div className="fc-led on" />
                            <span className="fc-status-txt">ONLINE</span>
                            <div className="fc-led" />
                            <div className="fc-led" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
        {/* <div className="fs-cta">
          <div className="fs-cta-inner">
            <div className="fs-cta-glow" />
            <div>
              <div className="fs-cta-eyebrow"></div>
              <div className="fs-cta-title">{t("features.ctaTitle")}</div>
              <p className="fs-cta-body">{t("features.ctaDescription")}</p>
            </div> */}
            {/* <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8, position:"relative" }}>
              <div className="fs-hex">
                <div className="fs-hex-bg" />
                <span className="fs-hex-icon">⚡</span>
              </div>
              <div className="fs-hex-label">READY</div>
            </div> */}
          {/* </div>
        </div> */}

        <div className="feature-highlight">
  <div className="feature-header">
    <h2 className="feature-title">
      {t("Benefit.title")}
    </h2>

  </div>

  <div className="feature-grid">
    {benefits?.map((item, i) => (
        <div
          key={i}
          className={`feature-card ${i % 2 === 0 ? "red" : "dark"}`}
        >
          <div className="feature-index">
            0{i + 1}
          </div>

          <h3>{item.key}</h3>
          <p>{item.value}</p>

          <div className="feature-glow" />
        </div>
      )
    )}
  </div>
</div>

        </section>

        {isVideoOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(255,34,34,0.18)" }} >

            {/* click nền để đóng */}
            <div
              className="absolute inset-0"
              onClick={() => setIsVideoOpen(false)}
            />

            {/* video box */}
            <div className="relative z-10 w-[90%] max-w-4xl">

              {/* video */}
              <video
                controls
                autoPlay
                className="w-full rounded-2xl shadow-2xl border border-red-500/30"
              >
                <source src={activeVideo || ""} type="video/mp4" />
              </video>

              {/* nút đóng */}
              <button
                onClick={() => setIsVideoOpen(false)}
                className="
                  absolute top-2 right-2
                  w-5 h-5
                  flex items-center justify-center
                  rounded-full
                  bg-black/50 backdrop-blur-md
                  text-white
                  text-[12px]
                  border border-white/20
                  hover:bg-red-500 hover:scale-110
                  transition-all duration-300
                  shadow-lg
                "
              >
                ✕
              </button>

            </div>
          </div>)
        }

      </>
    );
  }