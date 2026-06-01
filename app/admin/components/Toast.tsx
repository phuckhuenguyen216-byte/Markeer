"use client";
import { useCallback, useState } from "react";

export type Toast = { id: number; msg: string; type: "success" | "error" };

/** Hook returning toast state + an addToast dispatcher (auto-dismiss 3.5s). */
export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (msg: string, type: "success" | "error" = "success") => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, msg, type }]);
      setTimeout(
        () => setToasts((prev) => prev.filter((toast) => toast.id !== id)),
        3500,
      );
    },
    [],
  );

  return { toasts, addToast };
}

/** Fixed bottom-right stack of toast notifications. */
export function ToastStack({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-2xl px-4 py-3 text-sm font-bold text-white shadow-lg ${
            toast.type === "error" ? "bg-red-500" : "bg-gray-950"
          }`}
        >
          {toast.msg}
        </div>
      ))}
    </div>
  );
}
