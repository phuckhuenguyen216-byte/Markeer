"use client";

import { useTranslation } from "react-i18next";
import "../../i18n";

export function useInsideMarkeeLocale() {
  const { i18n } = useTranslation("common");
  const isEn = i18n.language?.toLowerCase().startsWith("en");

  const tx = (vi: string, en: string) => (isEn ? en : vi);

  return { isEn, tx };
}
