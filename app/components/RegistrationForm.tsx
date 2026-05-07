import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import "../i18n";

export default function RegistrationForm() {
  const { t } = useTranslation("common");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [count, setCount]   = useState(0);
  const [typed, setTyped]   = useState("");
  const [ready, setReady]   = useState(false);
  const TARGET = 10000;
  const TEXT   = "SYSTEM READY · ALL MODULES ONLINE";

  /* ── counter animation ── */
  useEffect(() => {
    let start: number | null = null;
    const duration = 2200;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(ease * TARGET));
      if (p < 1) requestAnimationFrame(step);
      else { setCount(TARGET); setReady(true); }
    };
    const id = setTimeout(() => requestAnimationFrame(step), 600);
    return () => clearTimeout(id);
  }, []);

  /* ── typewriter ── */
  useEffect(() => {
    if (!ready) return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTyped(TEXT.slice(0, i));
      if (i >= TEXT.length) clearInterval(id);
    }, 38);
    return () => clearInterval(id);
  }, [ready]);

  /* ── orbiting particle ring canvas ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const SIZE = 220;
    canvas.width = SIZE; canvas.height = SIZE;
    const cx = SIZE / 2, cy = SIZE / 2;

    /* particles in 3 rings */
    type Particle = { ring: number; angle: number; speed: number; size: number; alpha: number };
    const rings = [
      { r: 100, n: 28, speed: 0.0007 },
      { r: 138, n: 20, speed: -0.0005 },
      { r: 162, n: 14, speed: 0.0003 },
    ];
    const particles: Particle[] = rings.flatMap((ring, ri) =>
      Array.from({ length: ring.n }, (_, i) => ({
        ring: ri,
        angle: (Math.PI * 2 * i) / ring.n + Math.random() * 0.3,
        speed: ring.speed * (0.8 + Math.random() * 0.4),
        size: 1.2 + Math.random() * 1.4,
        alpha: 0.35 + Math.random() * 0.5,
      }))
    );
    const radii = rings.map(r => r.r);

    let raf: number;
    const draw = (ts: number) => {
      ctx.clearRect(0, 0, SIZE, SIZE);

      /* outer glow rings */
      radii.forEach((r, i) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(34,211,238,${[0.12, 0.07, 0.04][i]})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      /* core orb */
      const grad = ctx.createRadialGradient(cx - 18, cy - 22, 8, cx, cy, 68);
      grad.addColorStop(0,   "rgba(255,120,100,0.95)");
      grad.addColorStop(0.4, "rgba(220,38,38,0.85)");
      grad.addColorStop(0.75,"rgba(153,27,27,0.6)");
      grad.addColorStop(1,   "rgba(60,0,0,0)");
      ctx.beginPath(); ctx.arc(cx, cy, 68, 0, Math.PI * 2);
      ctx.fillStyle = grad; ctx.fill();

      /* inner shimmer */
      const shim = ctx.createRadialGradient(cx - 22, cy - 26, 2, cx, cy, 45);
      shim.addColorStop(0,   "rgba(255,200,180,0.6)");
      shim.addColorStop(0.5, "rgba(255,100,80,0.15)");
      shim.addColorStop(1,   "rgba(255,100,80,0)");
      ctx.beginPath(); ctx.arc(cx, cy, 45, 0, Math.PI * 2);
      ctx.fillStyle = shim; ctx.fill();

      /* core pulse ring */
      const pulse = Math.sin(ts * 0.002) * 0.5 + 0.5;
      ctx.beginPath(); ctx.arc(cx, cy, 68 + pulse * 14, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(239,68,68,${0.18 + pulse * 0.12})`;
      ctx.lineWidth = 1.2; ctx.stroke();

      /* rotating particles */
      particles.forEach(p => {
        p.angle += p.speed * 16;
        const r = radii[p.ring];
        const x = cx + r * Math.cos(p.angle);
        const y = cy + r * Math.sin(p.angle) * 0.38; /* flatten = 3D tilt */
        ctx.beginPath(); ctx.arc(x, y, p.size, 0, Math.PI * 2);
        const twinkle = (Math.sin(ts * 0.003 + p.angle * 3) * 0.5 + 0.5) * 0.5;
        ctx.fillStyle = `rgba(239,68,68,${p.alpha + twinkle})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section id="registration-form" className="rf-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=Syne:wght@600;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        .rf-root {
          --r300: #fca5a5;
          --r400: #f87171;
          --r500: #ef4444;
          --r600: #dc2626;
          --r700: #b91c1c;
          --r800: #991b1b;
          --r500-rgb: 239,68,68;
          

          font-family: 'DM Sans', sans-serif;
          position: relative;
          background: #f9fafb;
          overflow: hidden;
           padding: 48px 20px 56px;
           color: #111827;
        }

        /* ── starfield bg ── */
        .rf-stars {
          position: absolute; inset: 0;
          background-image:
            radial-gradient(1px 1px at 12% 18%, rgba(255,255,255,0.35) 0%, transparent 100%),
            radial-gradient(1px 1px at 34% 72%, rgba(255,255,255,0.25) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 55% 33%, rgba(255,255,255,0.3) 0%, transparent 100%),
            radial-gradient(1px 1px at 78% 55%, rgba(255,255,255,0.2) 0%, transparent 100%),
            radial-gradient(1px 1px at 88% 14%, rgba(255,255,255,0.3) 0%, transparent 100%),
            radial-gradient(1px 1px at 22% 88%, rgba(255,255,255,0.2) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 65% 80%, rgba(255,255,255,0.25) 0%, transparent 100%),
            radial-gradient(1px 1px at 44% 5%,  rgba(255,255,255,0.3) 0%, transparent 100%),
            radial-gradient(1px 1px at 91% 78%, rgba(255,255,255,0.2) 0%, transparent 100%),
            radial-gradient(1px 1px at  7% 50%, rgba(255,255,255,0.22) 0%, transparent 100%);
          pointer-events: none;
        }

        /* ── deep bg glow ── */
        .rf-glow-bg {
          position: absolute; inset: 0; pointer-events: none;
           background:
    radial-gradient(ellipse 60% 40% at 50% 40%, rgba(239,68,68,0.08) 0%, transparent 65%);
        }

        /* ── grid ── */
        .rf-grid {
          position: absolute; inset: 0; pointer-events: none;
           background-image:
    linear-gradient(rgba(17,24,39,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(17,24,39,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%);
        }

        /* ── scan ── */
        @keyframes rf-scan {
          0%   { top: -2px; opacity: 0.6; }
          100% { top: 100%; opacity: 0;   }
        }
        .rf-scan {
          position: absolute; left: 0; right: 0; height: 1px; pointer-events: none; z-index: 2;
          background: linear-gradient(90deg, transparent 0%, rgba(var(--r500-rgb),.4) 40%, rgba(var(--r500-rgb),.4) 60%, transparent 100%);
          animation: rf-scan 9s linear infinite;
        }

        /* ── layout ── */
        .rf-wrap {
          position: relative; z-index: 10;
          max-width: 860px; margin: 0 auto;
          display: flex; flex-direction: column; align-items: center;
          gap: 0;
          text-align: center;
        }

        /* ── TOP STATUS BAR ── */
        .rf-status-bar {
          display: flex; align-items: center; gap: 20px;
          margin-bottom: 22px;
          padding: 8px 20px;
          background: rgba(255,255,255,0.7);
  border: 1px solid rgba(239,68,68,0.25);
          position: relative; overflow: hidden;
        }
        .rf-status-bar::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(90deg, rgba(var(--r500-rgb),0.06), transparent 50%, rgba(var(--r500-rgb),0.06));
        }
        .rf-status-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 8px #4ade80;
          animation: rf-blink 2s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes rf-blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .rf-status-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;  color: rgba(17,24,39,0.6);
          letter-spacing: 0.12em; position: relative;
          white-space: nowrap;
        }
        .rf-status-text .hl { color: #4ade80; }
        .rf-status-divider { width: 1px; height: 14px; background: rgba(255,255,255,0.1); }

        /* ── ORB ── */
        .rf-orb-wrap {
          position: relative;
          width: 200px;
  height: 180px;
  margin-bottom: 24px;
          flex-shrink: 0;
        }
        .rf-canvas { display: block; }

        /* orb outer pulse rings */
        @keyframes rf-ring {
          0%   { transform: scale(1);   opacity: 0.4; }
          100% { transform: scale(1.5); opacity: 0;   }
        }
        .rf-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(239,68,68,0.25);
          pointer-events: none;
        }
        .rf-ring-1 {
          inset: 30%; /* 40% of 340 = ~136px radius */
          animation: rf-ring 3.2s ease-out infinite;
        }
        .rf-ring-2 {
          inset: 30%;
          animation: rf-ring 3.2s ease-out infinite 1.6s;
        }

        /* counter inside orb */
        .rf-counter {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 2px; pointer-events: none;
        }
        .rf-counter-num {
          font-family: 'Syne', sans-serif;
          font-size: 2.2rem; font-weight: 800;
          color: #fff; line-height: 1;
          text-shadow: 0 0 24px rgba(var(--r500-rgb),0.7), 0 0 8px rgba(var(--r500-rgb),0.5);
        }
        .rf-counter-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px; letter-spacing: 0.18em;
          color: rgba(255,255,255,0.4); text-transform: uppercase;
        }

        /* ── HEADLINE ── */
        .rf-headline {
  font-family: 'DM Sans', sans-serif;
  font-size: clamp(2rem, 4.5vw, 3.2rem);
  font-weight: 700;
  line-height: 1.18;
  margin: 0 0 10px;
  letter-spacing: -0.015em;

  /* Gradient đen → đỏ */
  background: linear-gradient(
    90deg,
    #201e1e,
    #350707,
    #d63d3d,
    #ad2e2e,
    #ff2a2a
  );

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
        .rf-headline .hi {
          background: linear-gradient(90deg, var(--r400) 0%, var(--r300) 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* ── DESCRIPTION ── */
        .rf-desc {
          font-size: 1.05rem; color: #0a0a0a;
          line-height: 1.8; max-width: 520px; margin: 0 auto 20px;
        }

        /* ── TERMINAL TICKER ── */
        .rf-terminal {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 44px; padding: 10px 18px;
          border: 1px solid rgba(var(--r500-rgb),0.15);
          background: rgba(0,0,0,0.4);
          width: 100%; max-width: 520px;
        }
        .rf-terminal-prompt {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; color: var(--r400);
          flex-shrink: 0;
        }
        .rf-terminal-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; color: rgba(17,24,39,0.6);
          letter-spacing: 0.1em; flex: 1; text-align: left;
        }
        .rf-cursor {
          display: inline-block; width: 7px; height: 13px;
          background: var(--r500); margin-left: 2px; vertical-align: middle;
          animation: rf-cur 1s step-end infinite;
        }
        @keyframes rf-cur { 0%,100%{opacity:1} 50%{opacity:0} }

        /* ================= BUTTON GROUP ================= */
.rf-btns {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}


/* =================================================
   PRIMARY BUTTON
================================================= */
.rf-btn-primary {
  position: relative;
  overflow: hidden;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  padding: 15px 36px;

  background: #ff3b3b;
  color: #fff;

  border: 1px solid #ff3b3b;
  text-decoration: none;

  font-family: 'DM', sans-serif;
  font-weight: 700;
  letter-spacing: .04em;

  clip-path: polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);

  transition:
    color .35s ease,
    transform .2s ease,
    box-shadow .3s ease;
}

/* lớp phủ trắng */
.rf-btn-primary::before {
  content: "";
  position: absolute;

  top: -20%;
  left: -220%;
  width: 220%;
  height: 220%;

  background: #ffffff;

  transform: rotate(25deg);
  transition: left 1.6s cubic-bezier(.22,1,.36,1);

  z-index: 1;
}

/* hover sweep */
.rf-btn-primary:hover::before {
  left: 120%;
}

/* chữ nổi */
.rf-btn-primary span,
.rf-btn-primary svg {
  position: relative;
  z-index: 2;
}

/* đổi màu chữ */
.rf-btn-primary:hover {
  color: #111;
  box-shadow:
    0 8px 30px rgba(255,60,60,.35);
  transform: translateY(-2px);
}

.rf-btn-primary:active {
  transform: scale(.97);
}


/* =================================================
   SECONDARY BUTTON
================================================= */
.rf-btn-secondary {
  position: relative;
  overflow: hidden;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  padding: 14px 32px;

  background: transparent;
  color: #374151;

  border: 1px solid rgba(0,0,0,.2);
  text-decoration: none;

  font-family: 'Syne', sans-serif;
  font-weight: 600;

  clip-path: polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);

  transition:
    color .35s ease,
    transform .2s ease,
    box-shadow .3s ease;
}

/* lớp phủ đỏ */
/* lớp phủ đỏ chạy CHÉO giống primary */
.rf-btn-secondary::before {
  content: "";
  position: absolute;

  top: -20%;
  left: -220%;
  width: 220%;
  height: 220%;

  background: linear-gradient(
    135deg,
    #ff3b3b,
    #ff5c7a
  );

  transform: rotate(25deg);
  transition: left 1.6s cubic-bezier(.22,1,.36,1);

  z-index: 1;
}

/* hover sweep */
.rf-btn-secondary:hover::before {
  left: 120%;
}

.rf-btn-secondary span,
.rf-btn-secondary svg {
  position: relative;
  z-index: 2;
}

/* hover */
.rf-btn-secondary:hover {
  color: #fff;
  border-color: transparent;
  transform: translateY(-2px);
  box-shadow:
    0 8px 25px rgba(255,60,60,.25);
}

.rf-btn-secondary:active {
  transform: scale(.97);
}


/* ================= ICON ================= */
.rf-btn-ico {
  width: 16px;
  height: 16px;
  transition: transform .35s ease;
}

.rf-btn-primary:hover .rf-btn-ico {
  transform: translateX(6px);
}

        /* ── TRUST ROW ── */
        .rf-trust {
          display: flex; align-items: center; justify-content: center;
          gap: 24px; margin-top: 40px; flex-wrap: wrap;
        }
        .rf-trust-item {
          display: flex; align-items: center; gap: 6px;
          font-size: 1rem; color: rgb(0, 0, 0);
        }
        .rf-trust-item svg { color: #4ade80; flex-shrink: 0; }
        .rf-trust-sep {
          width: 3px; height: 3px; border-radius: 50%;
          background: rgba(255,255,255,0.15);
        }

        /* ── BOTTOM METRICS ── */
        .rf-metrics {
          display: flex; align-items: stretch; gap: 0;
          margin-top: 64px; width: 100%; max-width: 620px;
          border: 1px solid rgba(var(--r500-rgb),0.14);
          overflow: hidden;
        }
        .rf-metric {
          flex: 1; padding: 20px 16px; text-align: center;
          position: relative;
        }
        .rf-metric + .rf-metric {
          border-left: 1px solid rgba(var(--r500-rgb),0.14);
        }
        .rf-metric::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, rgba(var(--r500-rgb),0.4), transparent);
        }
        .rf-metric-val {
          font-family: 'Syne', sans-serif;
          font-size: 1.6rem; font-weight: 800; color: var(--r400); line-height: 1;
          margin-bottom: 4px;
        }
        .rf-metric-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px; letter-spacing: 0.14em;
          text-transform: uppercase; color: rgba(255,255,255,0.28);
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 640px) {
          .rf-root { padding: 72px 20px 80px; }
          .rf-orb-wrap { width: 260px; height: 260px; }
          .rf-btns { flex-direction: column; align-items: stretch; }
          .rf-btn-primary, .rf-btn-secondary { justify-content: center; }
          .rf-status-bar { flex-wrap: wrap; gap: 10px; }
          .rf-headline { font-size: 1.85rem; }
        }
      `}</style>

      {/* bg layers */}
      <div className="rf-stars" />
      <div className="rf-glow-bg" />
      <div className="rf-grid" />
      <div className="rf-scan" />

      <div className="rf-wrap">

        {/* ── STATUS BAR ── */}
        <div className="rf-status-bar">
          <div className="rf-status-dot" />
          <span className="rf-status-text"><span className="hl">●</span> LIVE</span>
          <div className="rf-status-divider" />
          <span className="rf-status-text">SYS <span className="hl">v2.4.1</span></span>
          <div className="rf-status-divider" />
          <span className="rf-status-text">UPTIME <span className="hl">99.97%</span></span>
          <div className="rf-status-divider" />
          <span className="rf-status-text">
            {t("registration.usersOnline")} 
            <span className="hl">{count.toLocaleString()}</span>
          </span>
        </div>

        {/* ── ORB ── */}
        <div className="rf-orb-wrap">
          <canvas ref={canvasRef} className="rf-canvas" style={{ width: "100%", height: "100%" }} />
          <div className="rf-ring rf-ring-1" />
          <div className="rf-ring rf-ring-2" />
          <div className="rf-counter">
            <span className="rf-counter-num">{count.toLocaleString()}</span>
            <span className="rf-counter-label">
              {t("registration.users")}
            </span>
          </div>
        </div>

        {/* ── HEADLINE ── */}
        <h2 className="rf-headline">
          {t("registration.title") || (
            <>Sẵn sàng <span className="hi">bứt phá</span><br />cùng Markee AI?</>
          )}
        </h2>

        {/* ── DESCRIPTION ── */}
        <p className="rf-desc">
          {t("registration.description")}
        </p>

        {/* ── TERMINAL TICKER ── */}
        {/* <div className="rf-terminal">
          <span className="rf-terminal-prompt">▶</span>
          <span className="rf-terminal-text">
            {typed}
            <span className="rf-cursor" />
          </span>
        </div> */}

        {/* ── BUTTONS ── */}
        <div className="rf-btns">
        <Link
          href="https://app.markeeai.com"
          target="_blank"
          className="rf-btn-primary"
        >
          <span>{t("registration.primary")}</span>

          <svg
            className="rf-btn-ico"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
          </svg>
        </Link>

        <a
          href="/#features"
          className="rf-btn-primary"
        >
          <svg
            className="rf-btn-ico"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
          </svg>

          <span>{t("registration.secondary")}</span>
        </a>

      </div>

        {/* ── TRUST ── */}
        <div className="rf-trust">
          {[
            t("registration.trust1"),
            t("registration.trust2"),
            t("registration.trust3"),
          ].map((item, i) => (
            <React.Fragment key={i}>
              <div className="rf-trust-item">
                <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                {item}
              </div>
              {i < 2 && <div className="rf-trust-sep" />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}