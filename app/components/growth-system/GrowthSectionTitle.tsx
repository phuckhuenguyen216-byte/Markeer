type GrowthSectionTitleProps = {
  label: string;
  title: string;
  centered?: boolean;
  maxWidthClassName?: string;
};

export default function GrowthSectionTitle({
  label,
  title,
  centered = false,
  maxWidthClassName = "max-w-[880px]",
}: GrowthSectionTitleProps) {
  const lines = title.split("\n").map((line) => line.trim()).filter(Boolean);

  return (
    <div className={centered ? "text-center" : undefined}>
      <p className="mk-eyebrow text-[#ff4d5f] uppercase">{label}</p>
      <h2
        className={`mk-section-title mt-3 text-[#0b1020] [text-wrap:balance] ${maxWidthClassName} ${
          centered ? "mx-auto" : ""
        }`}
      >
        {lines.length > 0 ? (
          lines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))
        ) : (
          <span>{title}</span>
        )}
      </h2>
    </div>
  );
}
