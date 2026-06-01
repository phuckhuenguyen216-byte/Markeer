import type { ReactNode } from "react";

/** Generic colored pill used across the admin recruitment UI. */
export default function Badge({
  bg,
  color,
  dot,
  children,
  className = "",
}: {
  bg: string;
  color: string;
  dot?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg px-2 py-0.5 text-[11px] font-bold ${className}`}
      style={{ background: bg, color }}
    >
      {dot && (
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-full"
          style={{ background: color }}
        />
      )}
      {children}
    </span>
  );
}
