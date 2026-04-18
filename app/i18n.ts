"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import viCommon from "../public/locales/vi/common.json";
import enCommon from "../public/locales/en/common.json";

const isBrowser = typeof window !== "undefined";

if (!i18n.isInitialized) {
  // Always init with "vi" to match server-rendered HTML (avoids hydration mismatch).
  // After mount, ClientI18nProvider will switch to the stored language.
  i18n.use(initReactI18next).init({
    lng: "vi",
    fallbackLng: "vi",
    supportedLngs: ["vi", "en"],
    resources: {
      vi: { common: viCommon },
      en: { common: enCommon },
    },
    ns: ["common"],
    defaultNS: "common",
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

  if (isBrowser && typeof window.localStorage !== "undefined") {
    i18n.on("languageChanged", (lng) => {
      try {
        window.localStorage.setItem("i18nextLng", lng);
      } catch {
        // localStorage unavailable (Safari private, etc.)
      }
    });
  }
}

export default i18n;
