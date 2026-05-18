"use client";

import { useTranslation } from "react-i18next";
import "../i18n";

export default function Solutions() {
  const { t } = useTranslation("common");
  const plans = [
    {
      tag: "MARKETING AGENCY",
      tagColor: "#f97316",
      title: t("solutions.plan1Title"),
      description: t("solutions.plan1Desc"),
      features: t("solutions.plan1Features", { returnObjects: true }) as string[],
      price: "2.000.000đ",
      priceSuffix: t("solutions.plan1PriceSuffix"),
      pricePrefix: t("solutions.plan1PricePrefix"),
      cta: t("solutions.plan1Cta"),
      ctaColor: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
      note: t("solutions.plan1Note"),
      zaloMsg: "Xin chào Markee! Tôi muốn tư vấn dịch vụ AI Marketing Trọn Gói.",
    },
    {
      tag: "IT OUTSOURCING",
      tagColor: "#10b981",
      title: t("solutions.plan2Title"),
      description: t("solutions.plan2Desc"),
      features: t("solutions.plan2Features", { returnObjects: true }) as string[],
      price: "2.000.000đ",
      priceSuffix: t("solutions.plan1PriceSuffix"),
      pricePrefix: t("solutions.plan2PricePrefix"),
      cta: t("solutions.plan2Cta"),
      ctaColor: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      note: t("solutions.plan2Note"),
      zaloMsg: "Xin chào Markee! Tôi muốn nhận báo giá dịch vụ Phát Triển AI & Software.",
    },
  ];

  const css = `
  .sol-root {
    font-family: 'DM Sans', system-ui, sans-serif;
    position: relative;
    overflow: hidden;
    padding: 100px 0 120px;
    background: #ffffff;
    z-index: 0;
    isolation: isolate;
  }
  .sol-root::before {
    content: '';
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(255,34,34,0.032) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,34,34,0.032) 1px, transparent 1px);
    background-size: 56px 56px;
    pointer-events: none;
  }
  .sol-scan {
    position: absolute; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,80,80,0.55) 40%, rgba(255,80,80,0.55) 60%, transparent);
    animation: sol-scanDown 9s linear infinite;
    pointer-events: none; z-index: 1;
  }
  @keyframes sol-scanDown { 0% { top: 0; } 100% { top: 100%; } }
  .sol-corner {
    position: absolute; width: 60px; height: 60px; z-index: 2;
  }
  .sol-corner--tl { top: 16px; left: 16px; }
  .sol-corner--br { bottom: 16px; right: 16px; transform: rotate(180deg); }
  .sol-title {
    font-size: clamp(2rem, 4.5vw, 3.2rem);
    font-weight: 700;
    letter-spacing: -.02em;
    line-height: 1.1;
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
    text-transform: uppercase;
  }
  .sol-title-red {
    -webkit-text-fill-color: transparent;
  }
  .sol-title-rule {
    width: 80px; height: 2px; background: #ff2222;
    margin: 0 auto 20px; position: relative; overflow: hidden;
  }
  .sol-title-rule-shine {
    position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.75), transparent);
    animation: sol-shine 1.4s linear infinite;
  }
  @keyframes sol-shine { from{transform:translateX(-100%)} to{transform:translateX(100%)} }
  `;

  return (
    <>
      <style>{css}</style>
      <section className="sol-root" id="solutions">
        <div className="sol-scan" />
        <svg className="sol-corner sol-corner--tl" viewBox="0 0 60 60" fill="none">
          <path d="M0 60 L0 0 L60 0" stroke="rgba(255,34,34,0.18)" strokeWidth="1" />
          <circle cx="0" cy="0" r="3" fill="rgba(255,34,34,0.45)" />
          <rect x="26" y="0" width="1" height="10" fill="rgba(255,34,34,0.18)" />
          <rect x="0" y="26" width="10" height="1" fill="rgba(255,34,34,0.18)" />
        </svg>
        <svg className="sol-corner sol-corner--br" viewBox="0 0 60 60" fill="none">
          <path d="M0 60 L0 0 L60 0" stroke="rgba(255,34,34,0.18)" strokeWidth="1" />
          <circle cx="0" cy="0" r="3" fill="rgba(255,34,34,0.45)" />
        </svg>

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="sol-title">
              {t("solutions.titleDark")}{" "}<span className="sol-title-red">{t("solutions.titleRed")}</span>
            </h2>
            <div className="sol-title-rule"><div className="sol-title-rule-shine" /></div>
            <p className="text-gray-500 text-base max-w-xl mx-auto">
              {t("solutions.description")}
            </p>
          </div>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {plans.map((plan, i) => (
              <div
                key={i}
                className="relative rounded-2xl p-8 border border-red-100 flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-red-300"
                style={{
                  background: "linear-gradient(160deg, #ffffff 0%, #fff8f8 100%)",
                  boxShadow: "0 4px 20px rgba(225,29,72,0.06)",
                }}
              >
                <span
                  className="inline-block px-3 py-1 rounded text-xs font-bold tracking-wider uppercase mb-4 w-fit"
                  style={{
                    background: `${plan.tagColor}15`,
                    color: plan.tagColor,
                    border: `1px solid ${plan.tagColor}30`,
                  }}
                >
                  {plan.tag}
                </span>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{plan.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-gray-600">
                      <span className="text-red-500 mt-0.5 shrink-0">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mb-5">
                  <span className="text-gray-400 text-sm">{plan.pricePrefix} </span>
                  <span className="text-3xl font-black text-red-500">{plan.price}</span>
                  <span className="text-gray-400 text-sm"> {plan.priceSuffix}</span>
                </div>
                <a
                  href={`https://zalo.me/2031335970632550296?message=${encodeURIComponent(plan.zaloMsg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 rounded-xl font-bold text-white text-base text-center transition-all duration-300 hover:scale-[1.02] hover:shadow-lg block"
                  style={{
                    background: "linear-gradient(135deg, rgb(225,29,72) 0%, #ff4444 100%)",
                    boxShadow: "0 6px 20px rgba(225,29,72,0.25)",
                  }}
                >
                  {plan.cta}
                </a>
                <p className="text-center text-xs text-gray-400 mt-3">{plan.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
