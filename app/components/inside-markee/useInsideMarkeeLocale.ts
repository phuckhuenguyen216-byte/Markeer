"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "../../i18n";

export function useInsideMarkeeLocale() {
  const { i18n } = useTranslation("common");
  const [language, setLanguage] = useState(
    i18n.resolvedLanguage ?? i18n.language ?? "vi",
  );

  useEffect(() => {
    const updateLanguage = (lng: string) => {
      setLanguage(lng || i18n.resolvedLanguage || "vi");
    };

    updateLanguage(i18n.resolvedLanguage ?? i18n.language ?? "vi");
    i18n.on("languageChanged", updateLanguage);

    return () => {
      i18n.off("languageChanged", updateLanguage);
    };
  }, [i18n]);

  const isEn = language.toLowerCase().startsWith("en");

  const tx = (vi: string, en: string) => (isEn ? en : vi);

  return { isEn, tx };
}
