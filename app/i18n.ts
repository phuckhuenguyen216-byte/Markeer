"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

const isBrowser = typeof window !== "undefined";

if (!i18n.isInitialized) {
  i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: "vi",
      supportedLngs: ["vi", "en"],
      ns: ["common"],
      defaultNS: "common",
      interpolation: {
        escapeValue: false,
      },
      backend: {
        loadPath: "/locales/{{lng}}/{{ns}}.json",
      },
      detection: {
        order: ["querystring", "localStorage", "cookie", "navigator"],
        caches: isBrowser ? ["localStorage", "cookie"] : [],
      },
      react: {
        useSuspense: false,
      },
    });
}

export default i18n;

