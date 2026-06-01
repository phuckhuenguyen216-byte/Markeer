import {
  STATUS_OPTIONS,
  getStatusInfo,
  type ApplicationStatus,
} from "@/lib/application";
import Badge from "./Badge";

/** Read-only status pill. */
export function StatusBadge({
  status,
  className = "",
}: {
  status: ApplicationStatus;
  className?: string;
}) {
  const info = getStatusInfo(status);
  return (
    <Badge bg={info.bg} color={info.color} dot className={className}>
      {info.label}
    </Badge>
  );
}

/**
 * Inline status dropdown for changing an application's status without
 * opening the detail page. Caller handles persistence via onChange.
 */
export function StatusSelect({
  status,
  onChange,
  disabled,
  className = "",
}: {
  status: ApplicationStatus;
  onChange: (next: ApplicationStatus) => void;
  disabled?: boolean;
  className?: string;
}) {
  const info = getStatusInfo(status);
  return (
    <select
      value={status}
      disabled={disabled}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => onChange(e.target.value as ApplicationStatus)}
      className={`h-7 cursor-pointer appearance-none rounded-lg border px-2 text-[11px] font-bold outline-none transition disabled:opacity-50 ${className}`}
      style={{ background: info.bg, color: info.color, borderColor: info.color }}
    >
      {STATUS_OPTIONS.map((s) => (
        <option key={s.value} value={s.value} style={{ color: "#111827" }}>
          {s.label}
        </option>
      ))}
    </select>
  );
}
