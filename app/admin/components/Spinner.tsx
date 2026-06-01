/** Brown brand spinner, optionally centered with a label. */
export default function Spinner({
  size = 40,
  label,
  center = false,
  className = "",
}: {
  size?: number;
  label?: string;
  center?: boolean;
  className?: string;
}) {
  const block = (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div
        className="animate-spin rounded-full border-2 border-t-transparent"
        style={{
          width: size,
          height: size,
          borderColor: "#8b4513",
          borderTopColor: "transparent",
        }}
      />
      {label && <p className="text-sm font-medium text-gray-400">{label}</p>}
    </div>
  );

  if (center) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        {block}
      </div>
    );
  }
  return block;
}
