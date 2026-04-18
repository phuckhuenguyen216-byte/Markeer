"use client";

import { useState, useEffect } from "react";
import i18n from "../i18n";

export default function ClientI18nProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // After mount, switch to the user's stored language preference
    try {
      const stored = localStorage.getItem("i18nextLng");
      if (stored && stored !== i18n.language && ["vi", "en"].includes(stored)) {
        i18n.changeLanguage(stored);
      }
    } catch {
      // localStorage unavailable (Safari private, etc.)
    }
    setMounted(true);
  }, []);

  // Always render same wrapper to avoid unmount/remount of all children
  return (
    <div style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.1s ease" }}>
      {children}
    </div>
  );
}
