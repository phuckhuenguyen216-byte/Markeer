import {
  POSITION_COLORS,
  DEFAULT_POS_COLOR,
} from "@/lib/recruitment";

/**
 * Renders position chips from career_journey. Optionally caps the number
 * shown with a "+N" overflow indicator, and can render a small abbr square.
 */
export default function PositionTags({
  positions,
  max,
  showAbbr = false,
  size = "sm",
}: {
  positions: string[];
  max?: number;
  showAbbr?: boolean;
  size?: "sm" | "md";
}) {
  const list = positions || [];
  const shown = typeof max === "number" ? list.slice(0, max) : list;
  const overflow = typeof max === "number" ? list.length - shown.length : 0;

  if (list.length === 0) {
    return <span className="text-xs text-gray-400">---</span>;
  }

  const pad = size === "md" ? "px-3 py-1" : "px-2 py-0.5";

  return (
    <>
      {shown.map((pos) => {
        const c = POSITION_COLORS[pos] || DEFAULT_POS_COLOR;
        return (
          <span
            key={pos}
            className={`inline-flex items-center gap-1.5 rounded-lg border border-black/5 text-[11px] font-bold ${pad}`}
            style={{ background: c.bg, color: c.color }}
          >
            {showAbbr && c.abbr && (
              <span
                className="flex h-4 w-4 items-center justify-center rounded text-[9px] font-black text-white"
                style={{ background: c.color }}
              >
                {c.abbr}
              </span>
            )}
            {pos}
          </span>
        );
      })}
      {overflow > 0 && (
        <span className="text-xs font-bold text-gray-400">+{overflow}</span>
      )}
    </>
  );
}
