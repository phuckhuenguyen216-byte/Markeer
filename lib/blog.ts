export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tag: string;
  cover_image: string;
  author: string;
  status: "draft" | "published";
  is_featured: boolean;
  is_popular: boolean;
  view_count: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export const TAG_OPTIONS = [
  "AI Marketing",
  "Content",
  "Social Media",
  "Analytics",
  "Case Study",
  "Tutorial",
];

export const TAG_COLOR: Record<string, { bg: string; text: string }> = {
  "AI Marketing": { bg: "#FEE2E2", text: "#991B1B" },
  Content: { bg: "#FEF3C7", text: "#92400E" },
  "Social Media": { bg: "#FCE7F3", text: "#9D174D" },
  Analytics: { bg: "#D1FAE5", text: "#065F46" },
  "Case Study": { bg: "#FFEDD5", text: "#9A3412" },
  Tutorial: { bg: "#FDE8E8", text: "#7F1D1D" },
};
