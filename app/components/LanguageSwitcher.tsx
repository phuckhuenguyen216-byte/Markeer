"use client";

import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: "vi" | "en") => {
    i18n.changeLanguage(lng);
  };

  const current = i18n.language === "en" ? "en" : "vi";

  return (
    <div className="flex items-center gap-1 text-xs font-medium">
      <button
        type="button"
        onClick={() => changeLanguage("vi")}
        className={`px-2 py-1 rounded-full border transition ${
          current === "vi"
            ? "bg-gray-900 text-white border-gray-900"
            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
        }`}
      >
        VI
      </button>
      <button
        type="button"
        onClick={() => changeLanguage("en")}
        className={`px-2 py-1 rounded-full border transition ${
          current === "en"
            ? "bg-gray-900 text-white border-gray-900"
            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
        }`}
      >
        EN
      </button>
    </div>
  );
}

