"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import "../i18n";

type ConsultationFormProps = {
  variant?: "section" | "embedded";
  onClose?: () => void;
  initialTab?: number;
  hideTabs?: boolean;
};

type ConsultationTab = {
  icon: string;
  label: string;
  color: string;
  title: string;
  subtitle: string;
  desc: string;
  painPoints: string[];
  tags: string[];
  pricePrefix: string;
  price: string;
  priceSuffix: string;
  priceBadge: string;
  formTitle: string;
  ctaLabel: string;
  trusts: string[];
  contactCta?: string;
  bundle?: string;
  bundleDesc?: string;
};

export default function ConsultationForm({ variant = "section", onClose, initialTab = 0, hideTabs = false }: ConsultationFormProps) {
  const { t } = useTranslation("common");
  const [activeTab, setActiveTab] = useState(initialTab);
  const [mobileOpen, setMobileOpen] = useState<number | null>(null);
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [showSocial, setShowSocial] = useState(false);

  const tabsData: ConsultationTab[] = [
    {
      icon: "🎯",
      label: t("consultation.tab1Title"),
      color: "#e11d48",
      title: "Marketing Agency",
      subtitle: t("consultation.tab1Subtitle"),
      desc: t("consultation.tab1Desc"),
      painPoints: t("consultation.tab1PainPoints", { returnObjects: true }) as string[],
      tags: t("consultation.tab1Tags", { returnObjects: true }) as string[],
      pricePrefix: t("consultation.tab1PricePrefix"),
      price: "2.000.000đ",
      priceSuffix: t("consultation.tab1PriceSuffix"),
      priceBadge: t("consultation.tab1PriceBadge"),
      formTitle: t("consultation.tab1FormTitle"),
      ctaLabel: t("consultation.tab1Cta"),
      trusts: t("consultation.tab1Trusts", { returnObjects: true }) as string[],
    },
    {
      icon: "💻",
      label: t("consultation.tab2Title"),
      color: "#e11d48",
      title: "IT Outsourcing",
      subtitle: t("consultation.tab2Subtitle"),
      desc: t("consultation.tab2Desc"),
      painPoints: t("consultation.tab2PainPoints", { returnObjects: true }) as string[],
      tags: t("consultation.tab2Tags", { returnObjects: true }) as string[],
      pricePrefix: t("consultation.tab2PricePrefix"),
      price: "2.000.000đ",
      priceSuffix: t("consultation.tab2PriceSuffix"),
      priceBadge: t("consultation.tab2PriceBadge"),
      formTitle: t("consultation.tab2FormTitle"),
      ctaLabel: t("consultation.tab2Cta"),
      trusts: t("consultation.tab2Trusts", { returnObjects: true }) as string[],
    },
    {
      icon: "🔥",
      label: t("consultation.tab3Title"),
      color: "#e11d48",
      title: t("consultation.tabBoth"),
      subtitle: t("consultation.tab3Subtitle"),
      desc: t("consultation.tab3Desc"),
      painPoints: t("consultation.tab3PainPoints", { returnObjects: true }) as string[],
      tags: t("consultation.tab3Tags", { returnObjects: true }) as string[],
      pricePrefix: t("consultation.tab3PricePrefix"),
      price: "3.000.000đ",
      priceSuffix: t("consultation.tab3PriceSuffix"),
      priceBadge: t("consultation.tab3PriceBadge"),
      formTitle: t("consultation.tab3FormTitle"),
      ctaLabel: t("consultation.tab3Cta"),
      trusts: t("consultation.tab3Trusts", { returnObjects: true }) as string[],
      bundle: t("consultation.tab3Bundle"),
      bundleDesc: t("consultation.tab3BundleDesc"),
    },
  ];

  const handleSubmit = async (service: string) => {
    if (!phone.trim() || phone.trim().length < 8) {
      setError(t("consultation.errorPhone"));
      return;
    }
    setError("");
    setSending(true);
    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), service }),
      });
      if (res.ok) {
        setSent(true);
        setPhone("");
      } else {
        const data = await res.json();
        setError(data.error || t("consultation.errorGeneral"));
      }
    } catch {
      setError(t("consultation.errorGeneral"));
    } finally {
      setSending(false);
    }
  };

  const css = `
  .cf-root {
    font-family: 'DM Sans', system-ui, sans-serif;
    position: relative;
    overflow: hidden;
    padding: 100px 0 120px;
    background: #ffffff;
    z-index: 0;
    isolation: isolate;
  }
  .cf-root::before {
    content: '';
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(255,34,34,0.032) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,34,34,0.032) 1px, transparent 1px);
    background-size: 56px 56px;
    pointer-events: none;
  }
  .cf-scan {
    position: absolute; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,80,80,0.55) 40%, rgba(255,80,80,0.55) 60%, transparent);
    animation: cf-scanDown 9s linear infinite;
    pointer-events: none; z-index: 1;
  }
  @keyframes cf-scanDown { 0% { top: 0; } 100% { top: 100%; } }
  .cf-corner {
    position: absolute; width: 60px; height: 60px; z-index: 2;
  }
  .cf-corner--tl { top: 16px; left: 16px; }
  .cf-corner--br { bottom: 16px; right: 16px; transform: rotate(180deg); }
  .cf-title {
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
    text-align: center;
  }
  .cf-subtitle {
    color: #4b5563;
    font-size: clamp(.95rem, 2vw, 1.125rem);
    font-weight: 600;
    line-height: 1.4;
    margin: -8px 0 14px;
    text-align: center;
  }
  .cf-title-rule {
    width: 80px; height: 2px; background: #ff2222;
    margin: 0 auto 20px; position: relative; overflow: hidden;
  }
  .cf-title-rule-shine {
    position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.75), transparent);
    animation: cf-shine 1.4s linear infinite;
  }
  @keyframes cf-shine { from{transform:translateX(-100%)} to{transform:translateX(100%)} }
  .cf-card {
    background: linear-gradient(160deg, #ffffff 0%, #fff8f8 100%);
    border: 1px solid rgba(255,34,34,0.12);
    border-radius: 20px;
    padding: 28px 24px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4px 24px rgba(225,29,72,0.06);
  }
  .cf-card::before {
    content:'';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at top center, rgba(255,34,34,0.03), transparent 60%);
    pointer-events: none;
  }
  .cf-card::after {
    content:'';
    position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, rgba(255,34,34,0.3), transparent);
  }
  .cf-embedded {
    font-family: 'DM Sans', system-ui, sans-serif;
    width: 100%;
    color: #111827;
  }
  .cf-embedded-shell {
    border: 1px solid rgba(255,255,255,.72);
    border-radius: 24px;
    padding: 16px;
    background: rgba(255,255,255,.72);
    box-shadow: 0 22px 54px rgba(15,23,42,.16);
    backdrop-filter: blur(14px);
  }
  .cf-embedded-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 12px;
  }
  .cf-embedded-kicker {
    font-size: 11px;
    font-weight: 800;
    letter-spacing: .1em;
    text-transform: uppercase;
    margin: 0 0 4px;
    background: linear-gradient(90deg, #201e1e, #ad2e2e, #ff2a2a);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .cf-embedded-heading {
    font-size: 24px;
    font-weight: 800;
    line-height: 1.12;
    letter-spacing: -.01em;
    margin: 0;
    text-transform: uppercase;
    background: linear-gradient(90deg, #201e1e, #350707, #ad2e2e, #ff2a2a);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    -webkit-font-smoothing: antialiased;
    text-rendering: geometricPrecision;
  }
  .cf-embedded-copy {
    color: #64748b;
    font-size: 13px;
    line-height: 1.45;
    margin: 6px 0 0;
    max-width: 560px;
  }
  .cf-embedded-close {
    width: 36px;
    height: 36px;
    border: 1px solid rgba(225,29,72,.18);
    border-radius: 999px;
    background: #fff;
    color: #e11d48;
    font-size: 20px;
    font-weight: 900;
    line-height: 1;
    cursor: pointer;
    box-shadow: 0 8px 18px rgba(225,29,72,.12);
    flex: 0 0 auto;
  }
  .cf-embedded-tabs {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
    padding: 0 0 12px;
  }
  .cf-embedded-tab {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: 1px solid #e5e7eb;
    background: rgba(255,255,255,.96);
    color: #4b5563;
    border-radius: 16px;
    min-width: 0;
    min-height: 54px;
    padding: 9px 10px;
    font-size: 12px;
    font-weight: 800;
    line-height: 1.2;
    cursor: pointer;
    transition: all .25s ease;
    box-shadow: 0 8px 24px rgba(15,23,42,.08);
  }
  .cf-embedded-tab span:last-child {
    min-width: 0;
    overflow-wrap: anywhere;
  }
  .cf-embedded-tab.is-active {
    border-color: #fca5a5;
    background: #fff1f2;
    color: #e11d48;
    box-shadow: 0 0 0 2px rgba(244,63,94,.22), 0 8px 24px rgba(225,29,72,.14);
  }
  .cf-hero-card {
    background: linear-gradient(160deg, rgba(255,255,255,.97) 0%, rgba(255,248,248,.97) 100%);
    border: 1px solid rgba(255,34,34,.13);
    border-radius: 18px;
    padding: 14px;
    box-shadow: 0 14px 34px rgba(15,23,42,.12);
  }
  .cf-hero-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(260px, .8fr);
    gap: 14px;
    align-items: start;
  }
  .cf-hero-title-row {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 10px;
  }
  .cf-hero-title-row h3 {
    color: #111827;
    font-size: 20px;
    font-weight: 900;
    line-height: 1.12;
    margin: 0;
  }
  .cf-hero-title-row p {
    color: #64748b;
    font-size: 12px;
    margin: 4px 0 0;
  }
  .cf-hero-desc {
    color: #475569;
    font-size: 13px;
    line-height: 1.55;
    margin: 0 0 12px;
  }
  .cf-hero-points {
    display: grid;
    gap: 8px;
  }
  .cf-hero-point {
    display: flex;
    gap: 8px;
    align-items: flex-start;
    padding: 7px 10px;
    border: 1px solid #eef2f7;
    border-radius: 12px;
    background: #f8fafc;
    color: #334155;
    font-size: 12px;
    line-height: 1.3;
  }
  .cf-hero-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    margin-bottom: 14px;
  }
  .cf-hero-tags span {
    border: 1px solid rgba(225,29,72,.28);
    background: rgba(225,29,72,.07);
    color: #e11d48;
    border-radius: 999px;
    padding: 5px 9px;
    font-size: 11.5px;
    font-weight: 800;
  }
  .cf-hero-price {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
    margin-bottom: 14px;
  }
  .cf-hero-price strong {
    color: #111827;
    font-size: 25px;
    font-weight: 950;
    letter-spacing: -.02em;
  }
  .cf-hero-form {
    border-top: 1px solid #eef2f7;
    padding-top: 14px;
  }
  .cf-hero-form-row {
    display: flex;
    gap: 10px;
  }
  .cf-embedded .cf-social-row {
    display: none;
  }
  .cf-embedded input {
    min-width: 0;
  }
  @media (max-width: 767px) {
    .cf-embedded-shell {
      padding: 12px;
      border-radius: 20px;
    }
    .cf-embedded-head {
      gap: 10px;
      margin-bottom: 10px;
    }
    .cf-embedded-heading {
      font-size: 20px;
    }
    .cf-embedded-copy {
      font-size: 12px;
    }
    .cf-embedded-tabs {
      display: flex;
      overflow-x: auto;
      scrollbar-width: none;
    }
    .cf-embedded-tabs::-webkit-scrollbar {
      display: none;
    }
    .cf-embedded-tab {
      flex: 0 0 auto;
      min-height: 42px;
      max-width: 220px;
      padding: 9px 12px;
      font-size: 12px;
    }
    .cf-hero-card {
      padding: 14px;
    }
    .cf-hero-grid {
      display: block;
    }
    .cf-hero-points {
      margin-bottom: 14px;
    }
    .cf-hero-form-row {
      flex-direction: column;
    }
  }
  `;

  const renderCard = (tab: ConsultationTab, idx: number) => (
    <div className="cf-card" key={idx}>
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <span className="text-2xl">{tab.icon}</span>
        <div className="flex-1">
          <h3 className="text-gray-800 font-bold text-base leading-tight">{tab.title}</h3>
          <p className="text-gray-500 text-xs mt-1">{tab.subtitle}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm leading-relaxed mb-5">{tab.desc}</p>

      {/* Pain Points */}
      <div className="space-y-3 mb-5">
        {Array.isArray(tab.painPoints) && tab.painPoints.map((point, j) => (
          <div key={j} className="flex items-start gap-3 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5">
            <span className="text-gray-400 text-sm mt-0.5">💬</span>
            <span className="text-gray-700 text-sm leading-snug">{point}</span>
          </div>
        ))}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-5">
        {Array.isArray(tab.tags) && tab.tags.map((tag, j) => (
          <span
            key={j}
            className="px-3 py-1.5 rounded-full text-xs font-medium border"
            style={{
              borderColor: `${tab.color}40`,
              color: tab.color,
              background: `${tab.color}10`,
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Bundle (tab 3 only) */}
      {"bundle" in tab && tab.bundle && (
        <div className="flex items-start gap-3 bg-orange-50 border border-orange-200 rounded-xl p-4 mb-5">
          <span className="text-xl">🎁</span>
          <div>
            <p className="text-gray-800 font-bold text-sm">{tab.bundle}</p>
            <p className="text-gray-500 text-xs mt-1">{tab.bundleDesc}</p>
          </div>
        </div>
      )}

      {/* Contact CTA (tab3 instead of price) */}
      {"contactCta" in tab && tab.contactCta && (
        <div className="flex items-center gap-3 mb-5 px-4 py-3 rounded-xl border border-red-200 bg-red-50">
          <span className="text-red-500 text-lg">📞</span>
          <p className="text-red-600 font-bold text-sm">{tab.contactCta}</p>
        </div>
      )}

      {/* Price */}
      {tab.price && (
        <div className="flex items-center gap-3 mb-5">
          <div>
            <span className="text-gray-500 text-sm">{tab.pricePrefix} </span>
            <span className="text-2xl font-black text-gray-800">{tab.price}</span>
            <span className="text-gray-500 text-sm"> {tab.priceSuffix}</span>
          </div>
          {tab.priceBadge && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600 border border-green-200">
              ✓ {tab.priceBadge}
            </span>
          )}
        </div>
      )}
      {!tab.price && tab.priceBadge && (
        <div className="flex items-center gap-3 mb-5">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600 border border-green-200">
            ✓ {tab.priceBadge}
          </span>
        </div>
      )}

      {/* Form */}
      <div className="border-t border-gray-100 pt-5">
        <p className="text-gray-800 font-bold text-xs tracking-wider uppercase mb-3 flex items-center gap-2">
          <span>📞</span> {tab.formTitle}
        </p>
        {sent ? (
          <div className="py-3">
            <p className="text-green-600 font-bold text-sm mb-2">✓ {t("consultation.success")}</p>
            <button type="button" onClick={() => setSent(false)} className="text-red-500 text-xs underline cursor-pointer">
              {t("consultation.sendAnother")}
            </button>
          </div>
        ) : (
          <div className="flex gap-2 mb-3">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t("consultation.placeholder")}
              className="flex-1 px-4 py-3 rounded-lg bg-white border border-gray-200 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-red-400 transition-colors"
              onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(tab.label); }}
            />
            <button
              type="button"
              onClick={() => handleSubmit(tab.label)}
              disabled={sending}
              className="px-5 py-3 rounded-lg font-bold text-white text-sm whitespace-nowrap transition-all duration-300 hover:scale-105 cursor-pointer disabled:opacity-50"
              style={{
                background: `linear-gradient(135deg, ${tab.color} 0%, ${tab.color}cc 100%)`,
                boxShadow: `0 4px 12px ${tab.color}40`,
              }}
            >
              {sending ? "..." : tab.ctaLabel}
            </button>
          </div>
        )}
        {error && <p className="text-red-500 text-xs mb-2">{error}</p>}

        <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
          {Array.isArray(tab.trusts) && tab.trusts.map((trust, j) => (
            <span key={j} className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              {trust}
            </span>
          ))}
        </div>

        {/* Social - Mascot toggle */}
        <div className="cf-social-row flex items-center gap-3 mt-4">
          <button
            type="button"
            onClick={() => setShowSocial(!showSocial)}
            className="w-10 h-10 rounded-full bg-red-50 border border-red-200 flex items-center justify-center cursor-pointer hover:scale-110 transition-all duration-300"
            title={t("consultation.orContact")}
          >
            <Image src="/img/mascot/Pip-logo.png" alt="Chat" width={28} height={28} className="w-7 h-7 rounded-full object-cover" />
          </button>
          {showSocial && (
            <div className="flex items-center gap-2 animate-[fadeIn_0.3s_ease]">
              <a href="#" className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center hover:scale-110 transition-transform" title="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-blue-400 flex items-center justify-center hover:scale-110 transition-transform" title="Zalo">
                <span className="text-white text-xs font-black">Zalo</span>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-sky-500 flex items-center justify-center hover:scale-110 transition-transform" title="Telegram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center hover:scale-110 transition-transform" title="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center hover:scale-110 transition-transform" title="Discord">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center hover:scale-110 transition-transform" title="Viber">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M11.398.002C9.473.028 5.331.344 3.014 2.467 1.294 4.187.541 6.77.46 9.947c-.08 3.177-.185 9.133 5.604 10.76h.005l-.003 2.46s-.04.993.616 1.195c.793.243 1.26-.51 2.018-1.324.415-.446.988-1.102 1.42-1.603 3.91.33 6.916-.423 7.26-.534.794-.257 5.288-.834 6.024-6.806.76-6.163-.357-10.056-2.344-11.801C19.103.925 14.723-.034 11.398.002zm.297 1.93c2.93-.036 6.716.672 8.488 2.26 1.621 1.423 2.47 4.748 1.82 10.099-.596 4.83-4.087 5.17-4.756 5.387-.285.093-2.836.728-6.163.533 0 0-2.44 2.943-3.2 3.709-.12.12-.26.167-.353.145-.13-.031-.166-.181-.165-.399l.02-4.029c-4.77-1.337-4.49-6.27-4.424-8.881.065-2.612.668-4.79 2.075-6.167C6.578 3.075 8.764 1.968 11.695 1.932z"/></svg>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderHeroCard = (tab: ConsultationTab) => (
    <div className="cf-hero-card">
      <div className="cf-hero-grid">
        <div>
          <div className="cf-hero-title-row">
            <span className="text-2xl">{tab.icon}</span>
            <div>
              <h3>{tab.title}</h3>
              <p>{tab.subtitle}</p>
            </div>
          </div>
          <p className="cf-hero-desc">{tab.desc}</p>
          <div className="cf-hero-points">
            {tab.painPoints.slice(0, 3).map((point) => (
              <div className="cf-hero-point" key={point}>
                <span className="text-gray-400 text-xs mt-0.5">💬</span>
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="cf-hero-tags">
            {tab.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>

          {"bundle" in tab && tab.bundle && (
            <div className="flex items-start gap-2 bg-orange-50 border border-orange-200 rounded-xl p-3 mb-3">
              <span className="text-lg">🎁</span>
              <div>
                <p className="text-gray-800 font-bold text-xs">{tab.bundle}</p>
                <p className="text-gray-500 text-[11px] mt-1">{tab.bundleDesc}</p>
              </div>
            </div>
          )}

          {tab.price && (
            <div className="cf-hero-price">
              <div>
                <span className="text-gray-500 text-sm">{tab.pricePrefix} </span>
                <strong>{tab.price}</strong>
                <span className="text-gray-500 text-sm"> {tab.priceSuffix}</span>
              </div>
              {tab.priceBadge && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600 border border-green-200">
                  ✓ {tab.priceBadge}
                </span>
              )}
            </div>
          )}

          <div className="cf-hero-form">
            <p className="text-gray-800 font-bold text-[11px] tracking-wider uppercase mb-3 flex items-center gap-2">
              <span>📞</span> {tab.formTitle}
            </p>
            {sent ? (
              <div className="py-2">
                <p className="text-green-600 font-bold text-sm mb-2">✓ {t("consultation.success")}</p>
                <button type="button" onClick={() => setSent(false)} className="text-red-500 text-xs underline cursor-pointer">
                  {t("consultation.sendAnother")}
                </button>
              </div>
            ) : (
              <div className="cf-hero-form-row mb-3">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t("consultation.placeholder")}
                  className="flex-1 px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-red-400 transition-colors"
                  onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(tab.label); }}
                />
                <button
                  type="button"
                  onClick={() => handleSubmit(tab.label)}
                  disabled={sending}
                  className="px-5 py-3 rounded-xl font-bold text-white text-sm whitespace-nowrap transition-all duration-300 hover:scale-105 cursor-pointer disabled:opacity-50 bg-rose-500 shadow-lg shadow-rose-500/25"
                >
                  {sending ? "..." : tab.ctaLabel}
                </button>
              </div>
            )}
            {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
            <div className="flex flex-wrap gap-3 text-xs text-gray-500">
              {tab.trusts.map((trust) => (
                <span key={trust} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  {trust}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (variant === "embedded") {
    return (
      <>
        <style>{css}</style>
        <div className="cf-embedded cf-embedded-shell">
          {!hideTabs && (
          <div className="cf-embedded-head">
            <div>
              <p className="cf-embedded-kicker">{t("solutions.title")}</p>
              <h2 className="cf-embedded-heading">{t("consultation.sectionTitle")}</h2>
              <p className="cf-embedded-copy">{t("consultation.sectionSubtitle")}.</p>
            </div>
            {onClose && (
              <button type="button" className="cf-embedded-close" onClick={onClose} aria-label="Đóng form">
                ×
              </button>
            )}
          </div>
          )}
          {!hideTabs && (
          <div className="cf-embedded-tabs" role="tablist" aria-label={t("consultation.sectionTitle")}>
            {tabsData.map((tab, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={activeTab === i}
                onClick={() => setActiveTab(i)}
                className={`cf-embedded-tab ${activeTab === i ? "is-active" : ""}`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
          )}
          {renderHeroCard(tabsData[activeTab])}
        </div>
      </>
    );
  }

  return (
    <>
      <style>{css}</style>
      <section className="cf-root" id="consultation">
        <div className="cf-scan" />
        <svg className="cf-corner cf-corner--tl" viewBox="0 0 60 60" fill="none">
          <path d="M0 60 L0 0 L60 0" stroke="rgba(255,34,34,0.18)" strokeWidth="1" />
          <circle cx="0" cy="0" r="3" fill="rgba(255,34,34,0.45)" />
          <rect x="26" y="0" width="1" height="10" fill="rgba(255,34,34,0.18)" />
          <rect x="0" y="26" width="10" height="1" fill="rgba(255,34,34,0.18)" />
        </svg>
        <svg className="cf-corner cf-corner--br" viewBox="0 0 60 60" fill="none">
          <path d="M0 60 L0 0 L60 0" stroke="rgba(255,34,34,0.18)" strokeWidth="1" />
          <circle cx="0" cy="0" r="3" fill="rgba(255,34,34,0.45)" />
        </svg>

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="cf-title">{t("consultation.sectionTitle")}</h2>
            <div className="cf-title-rule"><div className="cf-title-rule-shine" /></div>
            <p className="cf-subtitle text-gray-500 max-w-xl mx-auto">{t("consultation.sectionSubtitle")}</p>
            <p className="text-gray-400 text-sm mt-2">{t("consultation.sectionDesc")}</p>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden md:flex justify-start gap-3 mb-8">
            {tabsData.map((tab, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveTab(i)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border cursor-pointer ${
                  activeTab === i
                    ? "border-red-400 bg-red-50 text-red-600 shadow-md"
                    : "border-gray-200 bg-white text-gray-500 hover:border-red-200"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Desktop: 2-column layout */}
          <div className="hidden md:grid md:grid-cols-5 gap-8 items-start">
            {/* LEFT: Form card (3/5) */}
            <div className="col-span-3">
              {renderCard(tabsData[activeTab], activeTab)}
            </div>

            {/* RIGHT: Info panel (2/5) */}
            <div className="col-span-2 sticky top-32 space-y-5">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center py-4 rounded-xl border border-red-100 bg-white" style={{ boxShadow: "0 2px 12px rgba(225,29,72,0.04)" }}>
                  <div className="text-2xl font-black text-red-500">200+</div>
                  <div className="text-[10px] text-gray-500 font-medium uppercase mt-1">{t("consultation.stat1")}</div>
                </div>
                <div className="text-center py-4 rounded-xl border border-red-100 bg-white" style={{ boxShadow: "0 2px 12px rgba(225,29,72,0.04)" }}>
                  <div className="text-2xl font-black text-red-500">60%</div>
                  <div className="text-[10px] text-gray-500 font-medium uppercase mt-1">{t("consultation.stat2")}</div>
                </div>
                <div className="text-center py-4 rounded-xl border border-red-100 bg-white" style={{ boxShadow: "0 2px 12px rgba(225,29,72,0.04)" }}>
                  <div className="text-2xl font-black text-red-500">{t("consultation.stat3Value")}</div>
                  <div className="text-[10px] text-gray-500 font-medium uppercase mt-1">{t("consultation.stat3")}</div>
                </div>
                <div className="text-center py-4 rounded-xl border border-red-100 bg-white" style={{ boxShadow: "0 2px 12px rgba(225,29,72,0.04)" }}>
                  <div className="text-2xl font-black text-red-500">98%</div>
                  <div className="text-[10px] text-gray-500 font-medium uppercase mt-1">{t("consultation.stat4")}</div>
                </div>
              </div>

              {/* Testimonial */}
              <div className="rounded-xl border border-red-100 bg-white p-5" style={{ boxShadow: "0 2px 12px rgba(225,29,72,0.04)" }}>
                <p className="text-gray-600 text-sm italic leading-relaxed mb-3">
                  &ldquo;{t("consultation.testimonialQuote")}&rdquo;
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-500 text-xs font-bold">NV</div>
                  <div>
                    <p className="text-gray-800 text-xs font-bold">{t("consultation.testimonialName")}</p>
                    <p className="text-gray-400 text-[10px]">{t("consultation.testimonialRole")}</p>
                  </div>
                </div>
              </div>

              {/* Guarantee */}
              <div className="rounded-xl border border-green-100 bg-green-50/50 p-4">
                <p className="text-green-700 text-xs font-bold mb-1 flex items-center gap-2">🛡️ {t("consultation.guaranteeTitle")}</p>
                <ul className="space-y-1 text-xs text-green-600">
                  {((t("consultation.guaranteeItems", { returnObjects: true }) as string[]) || []).map((item, idx) => (
                    <li key={idx}>✓ {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Mobile Accordion */}
          <div className="md:hidden space-y-3">
            {tabsData.map((tab, i) => (
              <div key={i}>
                <button
                  type="button"
                  onClick={() => setMobileOpen(mobileOpen === i ? null : i)}
                  className={`w-full flex items-center justify-between px-5 py-4 rounded-xl text-sm font-bold transition-all duration-300 border cursor-pointer ${
                    mobileOpen === i
                      ? "border-red-400 bg-red-50 text-red-600"
                      : "border-gray-200 bg-white text-gray-600"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </span>
                  <span className={`transition-transform duration-300 ${mobileOpen === i ? "rotate-180" : ""}`}>▼</span>
                </button>
                {mobileOpen === i && (
                  <div className="mt-2">
                    {renderCard(tab, i)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
