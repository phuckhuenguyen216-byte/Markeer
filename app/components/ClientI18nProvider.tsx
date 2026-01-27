"use client";

import { useState, useEffect } from "react";
import "../i18n";

export default function ClientI18nProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Trả về null để tránh hiện tượng "nháy" nội dung sai ngôn ngữ (Hydration Mismatch)
    // Người dùng sẽ thấy màn hình trắng trong tích tắc thay vì thấy tiếng Việt rồi chuyển sang Anh
    return <div className="opacity-0">{children}</div>;
  }

  return <>{children}</>;
}
