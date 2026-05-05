/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import "../i18n";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;700;900&display=swap');

  :root {
    --primary: #ff2a2a;
    --primary-light: #FF2A2A15;
    --bg: #ffffff;
    --text-main: #222;
    --text-muted: #666;
    --card-bg: #FFFFFF;
    --radius-lg: 24px;
    --radius-md: 16px;
    --shadow: 0 10px 25px rgba(255,34,34,0.07);
    --shadow-hover: 0 20px 50px rgba(255,34,34,0.13);
  }

  .cp-root {
    background: var(--bg);
    color: var(--text-main);
    padding: 100px 24px 120px;
    font-family: 'DM Sans', system-ui, sans-serif;
    position: relative;
    overflow: hidden;
  }

  /* ── grid background (giống FeaturesSection) ── */
  .cp-root::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,34,34,0.032) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,34,34,0.032) 1px, transparent 1px);
    background-size: 56px 56px;
    pointer-events: none;
  }

  /* ── scan line (giống FeaturesSection) ── */
  .cp-scan {
    position: absolute; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,80,80,0.55) 40%, rgba(255,80,80,0.55) 60%, transparent);
    animation: cp-scanDown 9s linear infinite;
    pointer-events: none; z-index: 1;
  }
  @keyframes cp-scanDown {
    0%   { top: -2px; opacity: 0; }
    5%   { opacity: 1; }
    95%  { opacity: 1; }
    100% { top: 100%; opacity: 0; }
  }

  /* ── corner decorators ── */
  .cp-corner { position: absolute; width: 60px; height: 60px; pointer-events: none; z-index: 2; }
  .cp-corner--tl { top: 20px; left: 20px; }
  .cp-corner--br { bottom: 20px; right: 20px; transform: rotate(180deg); }

  .cp-container {
    max-width: 1000px;
    margin: auto;
    position: relative;
    z-index: 3;
  }

  .cp-header-area {
    text-align: center;
    margin-bottom: 60px;
  }

  .cp-title {
    font-size: clamp(2rem, 4.5vw, 3.2rem);
    font-weight: 700;
    margin-bottom: 16px;
    //text-transform: uppercase;
    letter-spacing: -1px;
    background: linear-gradient(180deg, #252323, #3a0e0e, #6b0000, #b30000, #ff2a2a);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .cp-desc {
    color: var(--text-muted);
    font-size: 1.05rem;
    font-weight: 300;
    max-width: 1000px;
    margin: 20px auto 0 auto;
    line-height: 1.6;
  }

  /* MODULE/CARD */
  .cp-module {
    background: var(--card-bg);
    border: 1px solid rgba(255,34,34,0.12);
    border-radius: var(--radius-lg);
    padding: 30px;
    margin-bottom: 24px;
    box-shadow: var(--shadow);
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
    overflow: hidden;
  }

  .cp-module:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-hover);
    border-color: rgba(255,34,34,0.28);
  }

  .cp-module.active {
    border-color: rgba(255,34,34,0.45);
    background: linear-gradient(to bottom right, #fff, #fff6f6);
    box-shadow: 0 20px 50px rgba(255,34,34,0.12);
  }

  /* shimmer bottom bar */
  .cp-module::after {
    content: '';
    position: absolute;
    left: 0; bottom: 0;
    width: 100%; height: 2px;
    background: linear-gradient(90deg, var(--primary), transparent);
    opacity: 0;
    transition: opacity 0.35s ease;
  }
  .cp-module.active::after,
  .cp-module:hover::after { opacity: 1; }

  /* HEADER TRONG CARD */
  .cp-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .cp-icon-mimic {
    width: 50px;
    height: 50px;
    background: var(--primary-light);
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20px;
    color: var(--primary);
    font-size: 24px;
    transition: all 0.3s ease;
  }

  .cp-module:hover .cp-icon-mimic,
  .cp-module.active .cp-icon-mimic {
    background: var(--primary);
    color: white;
    transform: rotate(-10deg);
    box-shadow: 0 8px 20px rgba(255,34,34,0.3);
  }

  .cp-head-left {
    display: flex;
    align-items: center;
  }

  .cp-tag {
    font-size: 9px;
    font-weight: 700;
    color: var(--primary);
    background: var(--primary-light);
    padding: 4px 10px;
    border-radius: 4px;
    //text-transform: uppercase;
    letter-spacing: 0.28em;
    margin-bottom: 8px;
    display: inline-block;
    border: 1px solid rgba(255,34,34,0.2);
  }

  .cp-name {
    font-size: 20px;
    font-weight: 700;
    color: var(--text-main);
  }

  .cp-status-badge {
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.15em;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .cp-status-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: currentColor;
  }

  .cp-module.active .cp-status-badge {
    background-color: #fff0f0;
    color: var(--primary);
    border: 1px solid rgba(255,34,34,0.2);
  }

  .cp-module.active .cp-status-dot {
    animation: cp-pulse 2.5s ease-in-out infinite;
  }

  .cp-module:not(.active) .cp-status-badge {
    background-color: #f0f0f0;
    color: #999;
    border: 1px solid transparent;
  }

  @keyframes cp-pulse {
    0%,100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  /* BODY TRONG CARD */
  .cp-body {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.5s ease-in-out, opacity 0.3s ease;
    opacity: 0;
    padding-left: 70px;
  }

  .cp-module.active .cp-body {
    max-height: 500px;
    margin-top: 25px;
    opacity: 1;
    padding-bottom: 10px;
  }

  .cp-desc2 {
    color: var(--text-muted);
    font-size: 15px;
    line-height: 1.6;
    font-weight: 300;
    margin-bottom: 20px;
  }

  /* FEATURES LIST */
  .cp-list {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .cp-item {
    background: #fff8f8;
    padding: 10px 16px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 300;
    color: var(--text-main);
    display: flex;
    align-items: center;
    gap: 10px;
    border: 1px solid rgba(255,34,34,0.08);
    transition: all 0.2s ease;
  }

  .cp-item:hover {
    background: rgba(255,34,34,0.05);
    border-color: rgba(255,34,34,0.2);
    transform: translateX(4px);
  }

  .cp-item-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--primary);
    flex-shrink: 0;
    animation: cp-pulse 2.5s ease-in-out infinite;
  }

  @media (max-width: 600px) {
    .cp-title { font-size: 32px; }
    .cp-head { flex-direction: column; align-items: flex-start; gap: 15px; }
    .cp-status-badge { align-self: flex-end; }
    .cp-body { padding-left: 0; }
    .cp-icon-mimic { width: 40px; height: 40px; font-size: 18px; margin-right: 10px; }
    .cp-name { font-size: 18px; }
  }
`;

const getPlanIcon = (index: number) => {
  const icons = ["🤖", "⚙️", "✨"];
  return icons[index % icons.length];
};

export default function Deployment() {
  const { t } = useTranslation("common");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const rawPlans = t("deployment.plans", { returnObjects: true });
  const plans = Array.isArray(rawPlans) ? rawPlans : [
    { tag: "Hobby", title: "Free Cloud", description: "Dành cho dự án cá nhân nhỏ xinh, học tập.", features: ["1 Database", "Shared CPU", "Community Support"] },
    { tag: "Pro", title: "Startup Power", description: "Sức mạnh cho startup đang phát triển nhanh.", features: ["5 Databases", "Dedicated CPU", "Email Support", "Daily Backup"] },
  ];

  return (
    <>
      <style>{css}</style>

      <section className="cp-root">
        {/* scan line */}
        <div className="cp-scan" />

        {/* corner decorators */}
        <svg className="cp-corner cp-corner--tl" viewBox="0 0 60 60" fill="none">
          <path d="M0 60 L0 0 L60 0" stroke="rgba(255,34,34,0.18)" strokeWidth="1"/>
          <circle cx="0" cy="0" r="3" fill="rgba(255,34,34,0.45)"/>
          <rect x="26" y="0" width="1" height="10" fill="rgba(255,34,34,0.18)"/>
          <rect x="0" y="26" width="10" height="1" fill="rgba(255,34,34,0.18)"/>
        </svg>
        <svg className="cp-corner cp-corner--br" viewBox="0 0 60 60" fill="none">
          <path d="M0 60 L0 0 L60 0" stroke="rgba(255,34,34,0.18)" strokeWidth="1"/>
          <circle cx="0" cy="0" r="3" fill="rgba(255,34,34,0.45)"/>
        </svg>

        <div className="cp-container">
          <div className="cp-header-area">
            <h2 className="cp-title">{t("deployment.title")}</h2>
            <p className="cp-desc">{t("deployment.description")}</p>
          </div>

          {plans.map((plan: any, i: number) => {
            const isActive = activeIndex === i;

            return (
              <div
                key={i}
                className={`cp-module ${isActive ? "active" : ""}`}
                onClick={() => setActiveIndex(isActive ? null : i)}
                role="button"
                aria-expanded={isActive}
              >
                <div className="cp-head">
                  <div className="cp-head-left">
                    <div className="cp-icon-mimic">
                      {getPlanIcon(i)}
                    </div>
                    <div>
                      <div className="cp-tag">{plan.tag}</div>
                      <div className="cp-name">{plan.title}</div>
                    </div>
                  </div>

                  <div className="cp-status-badge">
                    <div className="cp-status-dot" />
                    {isActive ? "SELECTED" : "SHOW MORE"}
                  </div>
                </div>

                <div className="cp-body">
                  <p className="cp-desc2">{plan.description}</p>
                  <div className="cp-list">
                    {(plan.features || []).map((f: string, j: number) => (
                      <div key={j} className="cp-item">
                        <div className="cp-item-dot" />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}