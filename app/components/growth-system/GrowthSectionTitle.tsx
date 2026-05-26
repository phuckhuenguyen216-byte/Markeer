type GrowthSectionTitleProps = {
  label: string;
  title: string;
  centered?: boolean;
};

const TITLE_BREAK_THRESHOLD = 28;

function splitTitle(title: string): [string, string | null] {
  const normalized = title.trim().replace(/\s+/g, " ");
  if (!normalized) return ["", null];

  if (normalized.includes("\n")) {
    const [first, ...rest] = normalized.split("\n");
    return [first.trim(), rest.join(" ").trim() || null];
  }

  if (normalized.length <= TITLE_BREAK_THRESHOLD) {
    return [normalized, null];
  }

  const words = normalized.split(" ");
  let firstLine = "";
  let secondLine = "";

  for (let i = 0; i < words.length; i += 1) {
    const test = firstLine ? `${firstLine} ${words[i]}` : words[i];
    if (test.length <= Math.ceil(normalized.length / 2) || firstLine.length < TITLE_BREAK_THRESHOLD * 0.55) {
      firstLine = test;
    } else {
      secondLine = words.slice(i).join(" ");
      break;
    }
  }

  if (!secondLine) return [normalized, null];
  return [firstLine, secondLine];
}

export default function GrowthSectionTitle({ label, title, centered = false }: GrowthSectionTitleProps) {
  const [line1, line2] = splitTitle(title.toUpperCase());

  return (
    <div className={centered ? "text-center" : undefined}>
      <p className="text-sm font-semibold tracking-[0.16em] text-[#ff4d5f] uppercase">{label}</p>
      <h2 className="mt-3 text-[2rem] leading-[1.08] font-extrabold tracking-[-0.03em] uppercase sm:text-[2.8rem] lg:text-[3.5rem]">
        <span className={`block ${line2 ? "text-[#0b1020]" : "text-[#ff4d5f]"}`}>{line1}</span>
        {line2 ? <span className="block text-[#ff4d5f]">{line2}</span> : null}
      </h2>
    </div>
  );
}
