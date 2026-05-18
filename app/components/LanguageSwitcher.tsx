"use client";

import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: "vi" | "en") => {
    i18n.changeLanguage(lng);
  };

  const current = i18n.language === "en" ? "en" : "vi";

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => changeLanguage("vi")}
        className={`w-8 h-8 rounded-full border-2 transition flex items-center justify-center overflow-hidden ${
          current === "vi"
            ? "border-red-500 shadow-md"
            : "border-gray-200 hover:border-gray-400 opacity-60"
        }`}
        title="Tiếng Việt"
      >
        <svg viewBox="0 0 640 480" className="w-5 h-5">
          <rect width="640" height="480" fill="#da251d" />
          <polygon points="320,80 365,215 507,215 391,290 418,425 320,350 222,425 249,290 133,215 275,215" fill="#ff0" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => changeLanguage("en")}
        className={`w-8 h-8 rounded-full border-2 transition flex items-center justify-center overflow-hidden ${
          current === "en"
            ? "border-blue-500 shadow-md"
            : "border-gray-200 hover:border-gray-400 opacity-60"
        }`}
        title="English"
      >
        <svg viewBox="0 0 640 480" className="w-5 h-5">
          <rect width="640" height="480" fill="#012169" />
          <path d="M75,0L320,170L565,0H640V60L390,230L640,390V480H565L320,310L75,480H0V390L245,230L0,60V0H75Z" fill="#fff" />
          <path d="M0,0L640,480M640,0L0,480" stroke="#C8102E" strokeWidth="40" />
          <path d="M320,0V480M0,240H640" fill="#fff" stroke="#fff" strokeWidth="100" />
          <path d="M320,0V480M0,240H640" stroke="#C8102E" strokeWidth="60" />
        </svg>
      </button>
    </div>
  );
}

