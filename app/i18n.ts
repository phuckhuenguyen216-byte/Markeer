"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import viCommon from "../public/locales/vi/common.json";
import enCommon from "../public/locales/en/common.json";

const isBrowser = typeof window !== "undefined";

if (!i18n.isInitialized) {
  const initialLng =
    isBrowser && typeof window.localStorage !== "undefined"
      ? window.localStorage.getItem("i18nextLng") ||
        (typeof navigator !== "undefined" &&
        navigator.language?.toLowerCase().startsWith("vi")
          ? "vi"
          : "en")
      : "vi";

  i18n.use(initReactI18next).init({
    lng: initialLng,
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
      window.localStorage.setItem("i18nextLng", lng);
    });
  }
}

export default i18n;
