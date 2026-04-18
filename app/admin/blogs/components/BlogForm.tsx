"use client";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { BlogPost, TAG_OPTIONS } from "@/lib/blog";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("./RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-111 rounded-xl border border-gray-200 bg-gray-50 animate-pulse" />
  ),
});

const IconBack = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M10 3L5 8L10 13"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const IconStar = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M8 1.5L9.8 5.7L14.3 6.2L11 9.3L11.8 13.8L8 11.7L4.2 13.8L5 9.3L1.7 6.2L6.2 5.7L8 1.5Z"
      fill="currentColor"
      opacity="0.85"
    />
  </svg>
);
const IconFlame = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M8 1C8 1 12.5 5 12.5 9.5C12.5 12 10.5 14 8 14C5.5 14 3.5 12 3.5 9.5C3.5 5 8 1 8 1Z"
      fill="currentColor"
      opacity="0.7"
    />
    <path
      d="M8 7C8 7 10 9 10 11C10 12.1 9.1 13 8 13C6.9 13 6 12.1 6 11C6 9 8 7 8 7Z"
      fill="currentColor"
      opacity="0.4"
    />
  </svg>
);
const IconImage = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect
      x="1.5"
      y="2.5"
      width="13"
      height="11"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.2"
      fill="none"
    />
    <circle cx="5.5" cy="6" r="1.5" stroke="currentColor" strokeWidth="1" />
    <path
      d="M1.5 11L5 8L7.5 10L10.5 7L14.5 11"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);
const IconSave = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M12 14H4C3.4 14 3 13.6 3 13V3C3 2.4 3.4 2 4 2H10L13 5V13C13 13.6 12.6 14 12 14Z"
      stroke="currentColor"
      strokeWidth="1.3"
      fill="none"
    />
    <path d="M5 2V5H9V2" stroke="currentColor" strokeWidth="1" />
    <rect
      x="5"
      y="8"
      width="6"
      height="4"
      rx="0.5"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
    />
  </svg>
);

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-[#991b1b]">{title}</h3>
        {description && (
          <p className="text-xs text-gray-400 mt-0.5">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

export default function BlogForm({
  isNew,
  postId,
}: {
  isNew: boolean;
  postId?: string;
}) {
  const router = useRouter();
  const { t } = useTranslation();

  const [post, setPost] = useState<Partial<BlogPost>>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    tag: "AI Marketing",
    cover_image: "",
    author: "MARKEE AI",
    status: "draft",
    is_featured: false,
    is_popular: false,
    view_count: 0,
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew && postId) {
      setLoading(true);
      fetch(`/api/blogs/${postId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && !data.error) setPost(data);
        })
        .catch((err) => console.error("Lỗi tải bài viết:", err))
        .finally(() => setLoading(false));
    }
  }, [isNew, postId]);

  const updateField = (
    field: keyof BlogPost,
    value: BlogPost[keyof BlogPost],
  ) => {
    setPost((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent, overrideStatus?: string) => {
    e.preventDefault();
    if (!post.title?.trim()) {
      alert(t("admin.form.errorTitle"));
      return;
    }
    if (!post.cover_image?.trim()) {
      alert(t("admin.form.errorCover"));
      return;
    }

    setSaving(true);
    try {
      const url = isNew ? "/api/blogs" : `/api/blogs/${post.id}`;
      const method = isNew ? "POST" : "PUT";
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (isNew) headers["x-api-key"] = "markee_blog_2026";

      const submitData = overrideStatus
        ? { ...post, status: overrideStatus }
        : post;
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(submitData),
      });
      if (res.ok) {
        alert(
          isNew ? t("admin.form.successCreate") : t("admin.form.successUpdate"),
        );
        router.push("/admin/blogs");
        router.refresh();
      } else {
        const err = await res.json();
        alert(t("admin.form.errorServer") + ": " + (err.error || "Error"));
      }
    } catch {
      alert(t("admin.form.errorServer"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "#8b4513", borderTopColor: "transparent" }}
          />
          <p className="text-sm text-gray-400">{t("admin.form.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="max-w-4xl mx-auto"
      style={{ fontFamily: "system-ui, sans-serif" }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={() => router.push("/admin/blogs")}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#991b1b] transition font-medium"
        >
          <IconBack /> {t("admin.form.backToList")}
        </button>
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
          style={
            post.status === "published"
              ? { background: "#D1FAE5", color: "#065F46" }
              : { background: "#F3F4F6", color: "#6B7280" }
          }
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: post.status === "published" ? "#16a34a" : "#9CA3AF",
            }}
          />
          {post.status === "published"
            ? t("admin.dashboard.published")
            : t("admin.dashboard.draft")}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Card 1: Info */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <FormSection title={t("admin.form.titlePlaceholder")}>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                {t("admin.form.titlePlaceholder")}{" "}
                <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={post.title || ""}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="e.g. How to use AI for content marketing"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-red-300 focus:ring-2 focus:ring-red-50 transition"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                {t("admin.form.excerptPlaceholder")}
              </label>
              <textarea
                value={post.excerpt || ""}
                onChange={(e) => updateField("excerpt", e.target.value)}
                placeholder="Short description of the post..."
                rows={2}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-300 focus:ring-2 focus:ring-red-50 transition resize-y"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                {t("admin.form.slugPlaceholder")}
              </label>
              <div className="flex items-center gap-0 border border-gray-200 rounded-xl overflow-hidden focus-within:border-red-300 focus-within:ring-2 focus-within:ring-red-50 transition">
                <span className="px-3 py-3 text-sm text-gray-400 bg-gray-50 border-r border-gray-200 select-none">
                  /blog/
                </span>
                <input
                  type="text"
                  value={post.slug || ""}
                  onChange={(e) => updateField("slug", e.target.value)}
                  placeholder="cach-dung-ai-content-marketing"
                  className="flex-1 px-3 py-3 text-sm focus:outline-none"
                />
              </div>
            </div>
          </FormSection>
        </div>

        {/* Card 2: Cover */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <FormSection title={t("admin.form.coverImageLabel")}>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                <span className="inline-flex items-center gap-1">
                  <IconImage /> {t("admin.form.coverImagePlaceholder")}{" "}
                  <span className="text-red-400">*</span>
                </span>
              </label>
              <input
                type="url"
                value={post.cover_image || ""}
                onChange={(e) => updateField("cover_image", e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-300 focus:ring-2 focus:ring-red-50 transition"
                required
              />
            </div>
            {post.cover_image && (
              <div className="relative rounded-xl overflow-hidden border border-gray-200 max-w-lg h-52">
                <Image
                  src={post.cover_image}
                  alt="Cover preview"
                  fill
                  className="object-cover"
                  unoptimized
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      "none";
                  }}
                />
              </div>
            )}
          </FormSection>
        </div>

        {/* Card 3: Classification */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <FormSection title={t("admin.form.tagLabel")}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  {t("admin.form.tagLabel")}
                </label>
                <select
                  value={post.tag || "AI Marketing"}
                  onChange={(e) => updateField("tag", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white"
                >
                  {TAG_OPTIONS.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Status
                </label>
                <select
                  value={post.status || "draft"}
                  onChange={(e) => updateField("status", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white"
                >
                  <option value="draft">{t("admin.dashboard.draft")}</option>
                  <option value="published">
                    {t("admin.dashboard.published")}
                  </option>
                </select>
                <p className="text-[10px] text-gray-400 mt-1">
                  {post.status === "published"
                    ? t("admin.dashboard.published")
                    : t("admin.dashboard.draft")}
                </p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  {t("admin.form.authorLabel")}
                </label>
                <input
                  type="text"
                  value={post.author || ""}
                  onChange={(e) => updateField("author", e.target.value)}
                  placeholder="MARKEE AI"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-300 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {t("admin.form.featuredLabel")}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${post.is_featured ? "border-[#EF9F27] bg-amber-50/50" : "border-gray-150 bg-white hover:border-gray-300"}`}
                >
                  <input
                    type="checkbox"
                    checked={post.is_featured || false}
                    onChange={(e) =>
                      updateField("is_featured", e.target.checked)
                    }
                    className="w-4 h-4 rounded border-gray-300 mt-0.5 accent-[#EF9F27]"
                  />
                  <div>
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                      <span style={{ color: "#EF9F27" }}>
                        <IconStar />
                      </span>
                      {t("admin.form.featuredLabel")}
                    </span>
                    <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                      {t("admin.form.featuredDesc")}
                    </p>
                  </div>
                </label>
                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${post.is_popular ? "border-orange-400 bg-orange-50/50" : "border-gray-150 bg-white hover:border-gray-300"}`}
                >
                  <input
                    type="checkbox"
                    checked={post.is_popular || false}
                    onChange={(e) =>
                      updateField("is_popular", e.target.checked)
                    }
                    className="w-4 h-4 rounded border-gray-300 mt-0.5 accent-orange-500"
                  />
                  <div>
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                      <span style={{ color: "#F97316" }}>
                        <IconFlame />
                      </span>
                      {t("admin.form.popularLabel")}
                    </span>
                    <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                      {t("admin.form.popularDesc")}
                    </p>
                  </div>
                </label>
              </div>
              <p className="text-[10px] text-gray-400 mt-2 leading-relaxed">
                &nbsp;
              </p>
            </div>
          </FormSection>
        </div>

        {/* Card 4: Content */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <FormSection title={t("admin.form.contentLabel")}>
            <RichTextEditor
              value={post.content || ""}
              onChange={(html) => updateField("content", html)}
            />
          </FormSection>
        </div>

        {/* Card 5: Stats (edit only) */}
        {!isNew && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <FormSection title={t("admin.blogs.views")}>
              <div className="max-w-xs">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  {t("admin.blogs.views")}
                </label>
                <input
                  type="number"
                  value={post.view_count || 0}
                  onChange={(e) =>
                    updateField("view_count", parseInt(e.target.value) || 0)
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-300 transition"
                  min={0}
                />
              </div>
            </FormSection>
          </div>
        )}

        {/* Submit bar */}
        <div className="flex items-center justify-between p-5 bg-white rounded-2xl shadow-sm border border-gray-100 sticky bottom-4">
          <button
            type="button"
            onClick={() => router.push("/admin/blogs")}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 transition"
          >
            {t("admin.form.cancelBtn")}
          </button>
          <div className="flex items-center gap-3">
            {post.status === "draft" && (
              <button
                type="button"
                disabled={saving}
                onClick={(e) => handleSubmit(e, "draft")}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
              >
                {saving ? t("admin.form.saving") : t("admin.form.saveDraft")}
              </button>
            )}
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              style={{ background: "#4a2318" }}
            >
              <IconSave />
              {saving
                ? t("admin.form.saving")
                : isNew
                  ? t("admin.form.createPost")
                  : t("admin.form.updatePost")}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
