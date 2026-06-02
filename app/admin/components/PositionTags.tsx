import {
  BarChart3,
  BrainCircuit,
  BriefcaseBusiness,
  Code2,
  Megaphone,
  Network,
  ServerCog,
  ShieldCheck,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import {
  POSITION_COLORS,
  DEFAULT_POS_COLOR,
} from "@/lib/recruitment";

function getPositionIcon(position: string): LucideIcon {
  const value = position.toLowerCase();

  if (value.includes("network")) return Network;
  if (value.includes("system") || value.includes("cloud")) return ServerCog;
  if (value.includes("security")) return ShieldCheck;
  if (
    value.includes("frontend") ||
    value.includes("backend") ||
    value.includes("full-stack") ||
    value.includes("devops") ||
    value.includes("platform")
  ) {
    return Code2;
  }
  if (value.includes("ai") || value.includes("ml") || value.includes("research")) {
    return BrainCircuit;
  }
  if (value.includes("data") || value.includes("performance")) return BarChart3;
  if (value.includes("content") || value.includes("marketing")) return Megaphone;
  if (value.includes("sales") || value.includes("customer")) return UsersRound;

  return BriefcaseBusiness;
}

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
        const Icon = getPositionIcon(pos);
        return (
          <span
            key={pos}
            className={`inline-flex items-center gap-1.5 rounded-lg border border-black/5 text-[11px] font-bold ${pad}`}
            style={{ background: c.bg, color: c.color }}
          >
            {showAbbr && c.abbr && (
              <span
                className={`inline-flex shrink-0 items-center justify-center rounded-md bg-white/80 shadow-sm ring-1 ring-black/5 ${
                  size === "md" ? "h-5 w-5" : "h-4 w-4"
                }`}
                style={{ color: c.color }}
              >
                <Icon size={size === "md" ? 13 : 11} strokeWidth={2.6} />
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
