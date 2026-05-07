"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ShieldCheck, Cpu, Zap, Fingerprint } from "lucide-react";
import "../i18n";

const PRIMARY_COLOR = "rgb(225, 29, 72)";

const roles = [
  {
    tagKey: "permission.roles.0.tag",
    titleKey: "permission.roles.0.title",
    featuresKey: "permission.roles.0.features",
    icon: <ShieldCheck size={20} />,
  },
  {
    tagKey: "permission.roles.1.tag",
    titleKey: "permission.roles.1.title",
    featuresKey: "permission.roles.1.features",
    icon: <Cpu size={20} />,
  },
  {
    tagKey: "permission.roles.2.tag",
    titleKey: "permission.roles.2.title",
    featuresKey: "permission.roles.2.features",
    icon: <Fingerprint size={20} />,
  },
];

export default function Permission() {
  const { t } = useTranslation("common");
  const [active, setActive] = useState(0);

  const role = roles[active];
  const raw = t(role.featuresKey, { returnObjects: true });
  const features = Array.isArray(raw) ? raw : [];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;700;900&display=swap');

        .pm-section {
          padding: 100px 24px 120px;
          font-family: 'DM Sans', system-ui, sans-serif;
          overflow: hidden;
          background: #ffffff;
          position: relative;
        }

        /* ── grid background  ── */
        .pm-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,34,34,0.032) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,34,34,0.032) 1px, transparent 1px);
          background-size: 56px 56px;
          pointer-events: none;
        }

        /* ── scan line ── */
        .pm-scan {
          position: absolute; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,80,80,0.55) 40%, rgba(255,80,80,0.55) 60%, transparent);
          animation: pm-scanDown 9s linear infinite;
          pointer-events: none; z-index: 1;
        }
        @keyframes pm-scanDown {
          0%   { top: -2px; opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }

        /* ── corner decorators ── */
        .pm-corner { position: absolute; width: 60px; height: 60px; pointer-events: none; z-index: 2; }
        .pm-corner--tl { top: 20px; left: 20px; }
        .pm-corner--br { bottom: 20px; right: 20px; transform: rotate(180deg); }

        .pm-container {
          max-width: 1200px;
          margin: auto;
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 40px 60px;
          align-items: start;
          position: relative;
          z-index: 3;
        }

        /* HEADER */
        .pm-header-text {
          grid-column: 1 / -1;
          text-align: left;
          margin-bottom: 20px;
        }

        .pm-header-text h2 {
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: clamp(2rem, 4.5vw, 3.2rem);
          font-weight: 700;
          margin-top: 10px;
          margin-bottom: 15px;
          //text-transform: uppercase;
          letter-spacing: -1px;
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

        .pm-header-text p {
          max-width: 1000px;
          color: #666;
          line-height: 1.6;
          font-weight: 300;
        }

        .pm-content {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .pm-nav {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .pm-nav-item {
          padding: 24px;
          border-radius: 20px;
          background: white;
          cursor: pointer;
          transition: all 0.4s ease;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border: 1px solid rgba(255,34,34,0.12);
        }

        .pm-nav-item.active {
          border-color: ${PRIMARY_COLOR}44;
          transform: scale(1.02) translateX(10px);
          box-shadow: 0 20px 40px rgba(255,34,34,0.08);
        }

        .pm-nav-item:not(.active) {
          opacity: 0.6;
        }

        .pm-icon-box {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f0f0f0;
          color: #444;
          transition: 0.3s;
        }

        .pm-nav-item.active .pm-icon-box {
          background: ${PRIMARY_COLOR};
          color: white;
          box-shadow: 0 8px 20px ${PRIMARY_COLOR}44;
        }

        .pm-visual {
          position: relative;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          min-height: 350px;
        }

        .pm-big-num {
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: clamp(80px, 15vw, 200px);
          font-weight: 900;
          line-height: 1.1;
          text-align: right;
          background: linear-gradient(135deg, #222 0%, ${PRIMARY_COLOR} 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          opacity: 0.8;
          transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .pm-feature-cloud {
          position: absolute;
          left: -40px;
          display: flex;
          flex-direction: column;
          gap: 15px;
          width: 300px;
          z-index: 10;
        }

        .pm-feature-tag {
          background: white;
          padding: 16px 24px;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          border-left: 4px solid ${PRIMARY_COLOR};
          font-weight: 600;
          color: #333;
          animation: floatIn 0.6s ease-out backwards;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        @keyframes floatIn {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @media (max-width: 992px) {
          .pm-container { grid-template-columns: 1fr; gap: 40px; }
          .pm-header-text h2 { font-size: 32px; }
          .pm-visual { justify-content: center; min-height: auto; margin-top: 20px; }
          .pm-feature-cloud { position: relative; left: 0; width: 100%; }
          .pm-big-num { font-size: 120px; text-align: center; }
        }
      `}</style>

      <section className="pm-section">
        {/* scan line */}
        <div className="pm-scan" />

        {/* corner decorators */}
        <svg className="pm-corner pm-corner--tl" viewBox="0 0 60 60" fill="none">
          <path d="M0 60 L0 0 L60 0" stroke="rgba(255,34,34,0.18)" strokeWidth="1"/>
          <circle cx="0" cy="0" r="3" fill="rgba(255,34,34,0.45)"/>
          <rect x="26" y="0" width="1" height="10" fill="rgba(255,34,34,0.18)"/>
          <rect x="0" y="26" width="10" height="1" fill="rgba(255,34,34,0.18)"/>
        </svg>
        <svg className="pm-corner pm-corner--br" viewBox="0 0 60 60" fill="none">
          <path d="M0 60 L0 0 L60 0" stroke="rgba(255,34,34,0.18)" strokeWidth="1"/>
          <circle cx="0" cy="0" r="3" fill="rgba(255,34,34,0.45)"/>
        </svg>

        <div className="pm-container">

          {/* HEADER */}
          <div className="pm-header-text">
            <h2>{t("permission.title")}</h2>
            <p>{t("permission.description")}</p>
          </div>

          {/* LEFT: NAV ITEMS */}
          <div className="pm-content">
            <div className="pm-nav">
              {roles.map((r, i) => (
                <div
                  key={i}
                  className={`pm-nav-item ${active === i ? "active" : ""}`}
                  onClick={() => setActive(i)}
                >
                  <div>
                    <div style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: i === active ? PRIMARY_COLOR : "#999",
                      marginBottom: "4px",
                    }}>
                      {t(r.tagKey)}
                    </div>
                    <div style={{ fontSize: "20px", fontWeight: 700 }}>
                      {t(r.titleKey)}
                    </div>
                  </div>
                  <div className="pm-icon-box">
                    {r.icon}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: VISUAL */}
          <div className="pm-visual">
            <div className="pm-big-num">
              {String(active + 1).padStart(2, "0")}
            </div>

            <div className="pm-feature-cloud" key={active}>
              {features.slice(0, 3).map((f, i) => (
                <div
                  className="pm-feature-tag"
                  key={i}
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  <Zap size={16} fill={PRIMARY_COLOR} color={PRIMARY_COLOR} />
                  {f}
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  );
}