"use client";

import { useTranslation } from "react-i18next";
import "../i18n";

export default function WhyMarkee() {
  const { t } = useTranslation("common");
  const rows = t("whyMarkee.rows", { returnObjects: true }) as Array<{
    criteria: string;
    markee: string;
    agency: string;
    internal: string;
  }>;

  const css = `
  .wm-root {
    font-family: 'DM Sans', system-ui, sans-serif;
    position: relative;
    overflow: hidden;
    padding: 100px 0 120px;
    background: #ffffff;
    z-index: 0;
    isolation: isolate;
  }
  .wm-root::before {
    content: '';
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(255,34,34,0.032) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,34,34,0.032) 1px, transparent 1px);
    background-size: 56px 56px;
    pointer-events: none;
  }
  .wm-scan {
    position: absolute; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,80,80,0.55) 40%, rgba(255,80,80,0.55) 60%, transparent);
    animation: wm-scanDown 9s linear infinite;
    pointer-events: none; z-index: 1;
  }
  @keyframes wm-scanDown { 0% { top: 0; } 100% { top: 100%; } }
  .wm-corner {
    position: absolute; width: 60px; height: 60px; z-index: 2;
  }
  .wm-corner--tl { top: 16px; left: 16px; }
  .wm-corner--br { bottom: 16px; right: 16px; transform: rotate(180deg); }
  .wm-title {
    font-size: clamp(1.6rem, 4vw, 2.4rem);
    font-weight: 700;
    letter-spacing: -.02em;
    margin: 0 0 18px;
    background: linear-gradient(90deg, #201e1e, #350707, #ad2e2e, #ff2a2a);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-transform: uppercase;
  }
  .wm-title-rule {
    width: 80px; height: 2px; background: #ff2222;
    margin: 0 auto 20px; position: relative; overflow: hidden;
  }
  .wm-title-rule-shine {
    position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.75), transparent);
    animation: wm-shine 1.4s linear infinite;
  }
  @keyframes wm-shine { from{transform:translateX(-100%)} to{transform:translateX(100%)} }
  `;

  return (
    <>
      <style>{css}</style>
      <section className="wm-root" id="why-markee">
        <div className="wm-scan" />
        <svg className="wm-corner wm-corner--tl" viewBox="0 0 60 60" fill="none">
          <path d="M0 60 L0 0 L60 0" stroke="rgba(255,34,34,0.18)" strokeWidth="1" />
          <circle cx="0" cy="0" r="3" fill="rgba(255,34,34,0.45)" />
          <rect x="26" y="0" width="1" height="10" fill="rgba(255,34,34,0.18)" />
          <rect x="0" y="26" width="10" height="1" fill="rgba(255,34,34,0.18)" />
        </svg>
        <svg className="wm-corner wm-corner--br" viewBox="0 0 60 60" fill="none">
          <path d="M0 60 L0 0 L60 0" stroke="rgba(255,34,34,0.18)" strokeWidth="1" />
          <circle cx="0" cy="0" r="3" fill="rgba(255,34,34,0.45)" />
        </svg>

        <div className="max-w-5xl mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="wm-title">{t("whyMarkee.title")}</h2>
            <div className="wm-title-rule"><div className="wm-title-rule-shine" /></div>
            <p className="text-gray-500 text-base max-w-xl mx-auto">
              {t("whyMarkee.description")}
            </p>
          </div>

          {/* Comparison Table */}
          {/* Desktop: full comparison table */}
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-red-100" style={{ background: "#ffffff", boxShadow: "0 4px 20px rgba(225,29,72,0.05)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-red-100 bg-red-50/50">
                  <th className="text-left py-5 px-6 text-gray-600 font-medium">
                    {t("whyMarkee.colCriteria")}
                  </th>
                  <th className="py-5 px-6 text-center">
                    <div className="inline-flex flex-col items-center gap-1 px-4 py-2 rounded-xl bg-red-500 border border-red-600">
                      <span className="text-white font-bold text-base">Markee AI</span>
                      <span className="text-red-100 text-[10px]">⚡ Markee AI</span>
                    </div>
                  </th>
                  <th className="py-5 px-6 text-center text-gray-500 font-medium">
                    {t("whyMarkee.colAgency")}
                  </th>
                  <th className="py-5 px-6 text-center text-gray-500 font-medium">
                    {t("whyMarkee.colInternal")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className="border-b border-red-50 last:border-b-0 hover:bg-red-50/30 transition-colors">
                    <td className="py-4 px-6 text-gray-700 font-medium">
                      {row.criteria}
                    </td>
                    <td className="py-4 px-6 text-center font-semibold text-red-500">
                      {row.markee}
                    </td>
                    <td className="py-4 px-6 text-center text-gray-400">
                      {row.agency}
                    </td>
                    <td className="py-4 px-6 text-center text-gray-400">
                      {row.internal}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: compact 3-column comparison cards */}
          <div className="md:hidden space-y-2.5">
            {rows.map((row, i) => (
              <div
                key={i}
                className="rounded-xl border border-red-100 bg-white p-3"
                style={{ boxShadow: "0 2px 10px rgba(225,29,72,0.04)" }}
              >
                {/* Criterion */}
                <h4 className="text-gray-800 font-bold text-[13px] mb-2.5 leading-snug">
                  {row.criteria}
                </h4>

                {/* 3-column side-by-side comparison */}
                <div className="grid grid-cols-3 gap-1.5">
                  <div className="px-2 py-2 rounded-lg bg-red-500 border border-red-600 text-center">
                    <div className="text-[9px] text-red-100 font-semibold uppercase tracking-wider mb-0.5">
                      ⚡ Markee
                    </div>
                    <div className="text-white font-bold text-[12px] leading-tight">
                      {row.markee}
                    </div>
                  </div>
                  <div className="px-2 py-2 rounded-lg bg-gray-50 border border-gray-200 text-center">
                    <div className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">
                      Agency
                    </div>
                    <div className="text-gray-500 text-[12px] leading-tight">
                      {row.agency}
                    </div>
                  </div>
                  <div className="px-2 py-2 rounded-lg bg-gray-50 border border-gray-200 text-center">
                    <div className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">
                      Nội bộ
                    </div>
                    <div className="text-gray-500 text-[12px] leading-tight">
                      {row.internal}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
