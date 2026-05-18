"use client";

import { useTranslation } from "react-i18next";
import "../i18n";

export default function CaseStudies() {
  const { t } = useTranslation("common");
  const cases = (t("caseStudies.cases", { returnObjects: true }) as Array<{
    category: string;
    name: string;
    description: string;
    stats: Array<{ value: string; label: string }>;
    tags: string[];
  }>).map((c, i) => ({
    ...c,
    categoryColor: ["#f97316", "#3b82f6", "#a855f7"][i],
  }));

  const css = `
  .cs-root {
    font-family: 'DM Sans', system-ui, sans-serif;
    position: relative;
    overflow: hidden;
    padding: 100px 0 120px;
    background: #ffffff;
    z-index: 0;
    isolation: isolate;
  }
  .cs-root::before {
    content: '';
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(255,34,34,0.032) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,34,34,0.032) 1px, transparent 1px);
    background-size: 56px 56px;
    pointer-events: none;
  }
  .cs-scan {
    position: absolute; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,80,80,0.55) 40%, rgba(255,80,80,0.55) 60%, transparent);
    animation: cs-scanDown 9s linear infinite;
    pointer-events: none; z-index: 1;
  }
  @keyframes cs-scanDown { 0% { top: 0; } 100% { top: 100%; } }
  .cs-corner {
    position: absolute; width: 60px; height: 60px; z-index: 2;
  }
  .cs-corner--tl { top: 16px; left: 16px; }
  .cs-corner--br { bottom: 16px; right: 16px; transform: rotate(180deg); }
  .cs-title {
    font-size: clamp(2rem, 4.5vw, 3.2rem);
    font-weight: 700;
    letter-spacing: -.02em;
    line-height: 1.1;
    margin: 0 0 18px;
    background: linear-gradient(90deg, #201e1e, #350707, #ad2e2e, #ff2a2a);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-transform: uppercase;
  }
  .cs-title-rule {
    width: 80px; height: 2px; background: #ff2222;
    margin: 0 auto 20px; position: relative; overflow: hidden;
  }
  .cs-title-rule-shine {
    position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.75), transparent);
    animation: cs-shine 1.4s linear infinite;
  }
  @keyframes cs-shine { from{transform:translateX(-100%)} to{transform:translateX(100%)} }
  `;

  return (
    <>
      <style>{css}</style>
      <section className="cs-root" id="case-studies">
        <div className="cs-scan" />
        <svg className="cs-corner cs-corner--tl" viewBox="0 0 60 60" fill="none">
          <path d="M0 60 L0 0 L60 0" stroke="rgba(255,34,34,0.18)" strokeWidth="1" />
          <circle cx="0" cy="0" r="3" fill="rgba(255,34,34,0.45)" />
          <rect x="26" y="0" width="1" height="10" fill="rgba(255,34,34,0.18)" />
          <rect x="0" y="26" width="10" height="1" fill="rgba(255,34,34,0.18)" />
        </svg>
        <svg className="cs-corner cs-corner--br" viewBox="0 0 60 60" fill="none">
          <path d="M0 60 L0 0 L60 0" stroke="rgba(255,34,34,0.18)" strokeWidth="1" />
          <circle cx="0" cy="0" r="3" fill="rgba(255,34,34,0.45)" />
        </svg>

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="cs-title">{t("caseStudies.title")}</h2>
            <div className="cs-title-rule"><div className="cs-title-rule-shine" /></div>
            <p className="text-gray-500 text-base max-w-xl mx-auto">
              {t("caseStudies.description")}
            </p>
          </div>

          {/* Case Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {cases.map((c, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 border border-red-100 flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:border-red-300"
                style={{
                  background: "linear-gradient(160deg, #ffffff 0%, #fff8f8 100%)",
                  boxShadow: "0 4px 20px rgba(225,29,72,0.05)",
                }}
              >
                <span className="text-[10px] font-bold tracking-wider uppercase mb-3 text-red-500">
                  🏷 {c.category}
                </span>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{c.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">{c.description}</p>
                <div className="space-y-4 flex-1">
                  {c.stats.map((stat, j) => (
                    <div key={j} className="flex items-baseline gap-3">
                      <span className="text-xl font-black shrink-0 text-red-500">{stat.value}</span>
                      <span className="text-xs text-gray-500">{stat.label}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-red-100">
                  <span className="text-[10px] font-bold tracking-wider px-2 py-1 rounded bg-red-50 text-red-500">
                    {c.tags[0]}
                  </span>
                  <span className="text-xs text-red-400 font-semibold cursor-pointer hover:text-red-600 transition-colors">
                    {c.tags[1]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
