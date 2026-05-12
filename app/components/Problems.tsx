"use client";
import { useTranslation } from "react-i18next";
import "../i18n";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;700;900&display=swap');

  :root {
    --r50:  #fff0f0;
    --r100: #ffe0e0;
    --r200: #ffb3b3;
    --r300: #ff8080;
    --r400: #ff5555;
    --r500: #ff2222;
    --r800: #800000;
    --pb-bg:       #ffffff;
    --pb-border:   rgb(225, 29, 72, 0.12);
    --pb-surface:  rgba(255,34,34,0.035);
    --pb-text-hi:  #0a0a0a;
    --pb-text-mid: #555555;
  }

  .pb-root {
    font-family: 'DM Sans', system-ui, sans-serif;
    position: relative;
    overflow: hidden;
    padding: 100px 0 120px;
    background: #ffffff;
    z-index: 0;
    isolation: isolate;
    clear: both;
  }

  /* ── grid background ── */
  .pb-root::before {
    content: '';
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(255,34,34,0.032) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,34,34,0.032) 1px, transparent 1px);
    background-size: 56px 56px;
    pointer-events: none;
  }

  /* ── scan line ── */
  .pb-scan {
    position: absolute; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,80,80,0.55) 40%, rgba(255,80,80,0.55) 60%, transparent);
    animation: pb-scanDown 9s linear infinite;
    pointer-events: none; z-index: 1;
  }
  @keyframes pb-scanDown {
    0%   { top: -2px; opacity: 0; }
    5%   { opacity: 1; }
    95%  { opacity: 1; }
    100% { top: 100%; opacity: 0; }
  }

  .pb-corner { position: absolute; width: 60px; height: 60px; pointer-events: none; z-index: 2; }
  .pb-corner--tl { top: 20px; left: 20px; }
  .pb-corner--br { bottom: 20px; right: 20px; transform: rotate(180deg); }

  /* ── header ── */
  .pb-header {
    position: relative; z-index: 3;
    max-width: 1200px;
    margin: 0 auto 52px;
    padding: 0 24px;
  }
  .pb-title {
    font-size: clamp(2rem, 4.5vw, 3.2rem);
    font-weight: 700;
    letter-spacing: -.02em;
    margin: 0 0 18px;
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
  .pb-title-rule {
    width: 80px; height: 2px;
    background: var(--r500);
    margin: 0 0 20px;
    position: relative; overflow: hidden;
  }
  .pb-title-rule-shine {
    position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.75), transparent);
    animation: pb-shine 1.4s linear infinite;
  }
  @keyframes pb-shine { from{transform:translateX(-100%)} to{transform:translateX(100%)} }
  .pb-desc {
    font-size: 1.05rem; font-weight: 300; line-height: 1.2;
    max-width: 1200px; color: var(--pb-text-mid);
  }

  /* ── list wrapper ── */
  .pb-list {
    position: relative; z-index: 3;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .pb-list-inner {
    position: relative;
  }
  .pb-list-inner::before {
    content: '';
    position: absolute;
    top: 0; bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 1px;
    background: linear-gradient(
      to bottom,
      transparent,
      rgba(255,34,34,0.22) 12%,
      rgba(255,34,34,0.22) 88%,
      transparent
    );
    pointer-events: none;
    z-index: 0;
  }

  /* ── row ── */
  .pb-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    position: relative;
  }

  /* ── number cell ── */
  .pb-row-num {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 12px;
    position: relative;
    z-index: 1;
  }

  /* ── card cell ── */
  .pb-row-card {
    padding: 16px 24px 14px;
    border: 1px solid var(--pb-border);
    position: relative;
    background: #fff;
    z-index: 1;
    transition:
      background .35s ease,
      border-color .35s ease,
      box-shadow .4s cubic-bezier(.22,1,.36,1),
      transform .4s cubic-bezier(.22,1,.36,1);
  }

  /* shimmer + bottom line nằm trong .pb-row-card-inner có overflow:hidden */
  .pb-row-card-inner {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
  }

  .pb-row-card-inner::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(120deg, transparent 0%, rgba(255,34,34,.07) 45%, transparent 100%);
    transform: translateX(-120%);
    transition: transform .6s cubic-bezier(.22,1,.36,1);
  }

  .pb-row-card-inner::after {
    content: '';
    position: absolute; bottom: 0; left: 0;
    width: 100%; height: 2px;
    background: linear-gradient(90deg, var(--r500), transparent);
    opacity: 0;
    transition: opacity .35s ease;
  }

  .pb-row-card:hover {
    background: rgba(255,34,34,0.045);
    border-color: rgba(255,34,34,.35);
    box-shadow:
      0 14px 44px rgba(239, 68, 68, 0.42),
      0 4px 12px rgba(239, 68, 68, 0.18);
    transform: translateY(-4px);
  }
  .pb-row-card:hover .pb-row-card-inner::before { transform: translateX(120%); }
  .pb-row-card:hover .pb-row-card-inner::after  { opacity: 1; }

  /* ── alternating sides ── */
  .pb-row:nth-child(odd) .pb-row-card { order: 1; border-right: none; }
  .pb-row:nth-child(odd) .pb-row-num  { order: 2; }
  .pb-row:nth-child(even) .pb-row-num  { order: 1; }
  .pb-row:nth-child(even) .pb-row-card { order: 2; border-left: none; }

  /* ── node dot ── */
  .pb-node {
    position: absolute;
    top: 50%;
    width: 10px; height: 10px;
    border-radius: 50%;
    background: var(--r200);
    border: 2px solid var(--pb-bg);
    transform: translateY(-50%);
    transition: background .3s, box-shadow .3s;
    z-index: 10;
  }
  .pb-row:nth-child(odd)  .pb-row-card .pb-node { right: -6px; left: auto; }
  .pb-row:nth-child(even) .pb-row-card .pb-node { left: -6px;  right: auto; }
  .pb-row:hover .pb-node {
    background: var(--r500);
    box-shadow: 0 0 12px rgba(255,34,34,.65);
  }

  /* ── card content ── */
  .pb-index {
    font-size: 64px;
    font-weight: 900;
    line-height: 1;
    letter-spacing: -.04em;
    background: linear-gradient(135deg, rgb(225, 29, 72), rgb(239, 68, 68));
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    user-select: none;
    transition: opacity .3s;
  }

  .pb-card-title {
    font-size: 18px; font-weight: 700;
    color: var(--pb-text-hi); line-height: 1; margin: 0 0 8px;
  }
  .pb-card-desc {
    font-size: 12px; font-weight: 300;
    color: var(--pb-text-mid); line-height: 1.2; margin: 0;
  }

  /* ── responsive ── */
  @media (max-width: 768px) {
    .pb-list-inner::before { display: none; }
    .pb-row { grid-template-columns: 1fr; }
    .pb-row:nth-child(odd)  .pb-row-card,
    .pb-row:nth-child(even) .pb-row-card {
      order: 2; border: 1px solid var(--pb-border);
    }
    .pb-row:first-child .pb-row-card { border-top: 1px solid var(--pb-border); }
    .pb-row:nth-child(odd)  .pb-row-num,
    .pb-row:nth-child(even) .pb-row-num {
      order: 1; padding: 24px 24px 0; justify-content: flex-start;
    }
    .pb-index { font-size: 56px; }
    .pb-node { display: none; }
  }
`;

export default function Problems() {
  const { t } = useTranslation("common");

  const rawCards = t("problems.cards", { returnObjects: true });
  const cards = Array.isArray(rawCards)
    ? (rawCards as { title: string; description: string }[])
    : [];

  if (cards.length === 0) return null;

  return (
    <>
      <style>{css}</style>

      <section className="pb-root" id="problems">
        {/* scan line */}
        <div className="pb-scan" />

        <svg className="pb-corner pb-corner--tl" viewBox="0 0 60 60" fill="none">
          <path d="M0 60 L0 0 L60 0" stroke="rgba(255,34,34,0.18)" strokeWidth="1"/>
          <circle cx="0" cy="0" r="3" fill="rgba(255,34,34,0.45)"/>
          <rect x="26" y="0" width="1" height="10" fill="rgba(255,34,34,0.18)"/>
          <rect x="0" y="26" width="10" height="1" fill="rgba(255,34,34,0.18)"/>
        </svg>
        <svg className="pb-corner pb-corner--br" viewBox="0 0 60 60" fill="none">
          <path d="M0 60 L0 0 L60 0" stroke="rgba(255,34,34,0.18)" strokeWidth="1"/>
          <circle cx="0" cy="0" r="3" fill="rgba(255,34,34,0.45)"/>
        </svg>

        {/* header */}
        <div className="pb-header">
          <h2 className="pb-title">
            {t("problems.title")}
          </h2>
          <div className="pb-title-rule">
            <div className="pb-title-rule-shine" />
          </div>
          <p className="pb-desc">{t("problems.description")}</p>
        </div>

        {/* rows */}
        <div className="pb-list">
          <div className="pb-list-inner">
            {cards.map((card, i) => (
              <div className="pb-row" key={i}>

                {/* large index */}
                <div className="pb-row-num">
                  <span className="pb-index">{String(i + 1).padStart(2, "0")}</span>
                </div>

                {/* card */}
                <div className="pb-row-card">
                  <div className="pb-row-card-inner" />
                  <div className="pb-node" />
                  <h3 className="pb-card-title">{card.title}</h3>
                  <p className="pb-card-desc">{card.description}</p>
                </div>

              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}