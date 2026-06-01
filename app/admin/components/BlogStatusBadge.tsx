import Badge from "./Badge";

export type BlogStatus = "draft" | "published";

export const BLOG_STATUS: Record<
  BlogStatus,
  { label: string; bg: string; color: string }
> = {
  published: { label: "Hiển thị", bg: "#D1FAE5", color: "#065F46" },
  draft: { label: "Nháp", bg: "#F3F4F6", color: "#6B7280" },
};

/** Status pill for blog posts (draft / published). */
export default function BlogStatusBadge({
  status,
  className = "",
}: {
  status: BlogStatus;
  className?: string;
}) {
  const s = BLOG_STATUS[status] ?? BLOG_STATUS.draft;
  return (
    <Badge bg={s.bg} color={s.color} dot className={className}>
      {s.label}
    </Badge>
  );
}
