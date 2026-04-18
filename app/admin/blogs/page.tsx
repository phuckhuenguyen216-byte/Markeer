"use client";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";
import { BlogPost, TAG_OPTIONS, TAG_COLOR } from "@/lib/blog";

const ALL_TAG = "__all__";
const FILTER_TABS = [ALL_TAG, ...TAG_OPTIONS];

export default function AdminBlogsPage() {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(ALL_TAG);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft"
  >("all");
  const [toasts, setToasts] = useState<
    { id: number; msg: string; type: "success" | "error" }[]
  >([]);
  const [confirmDelete, setConfirmDelete] = useState<BlogPost | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const addToast = (msg: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      3500,
    );
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/blogs?admin=true");
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (err) {
      console.error("Lỗi tải bài viết:", err);
      addToast(t("admin.blogs.loadError"), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (post: BlogPost) => {
    setConfirmDelete(null);
    setDeletingId(post.id);
    try {
      const res = await fetch(`/api/blogs/${post.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      addToast(`${t("admin.blogs.deleted")}: "${post.title}"`);
      fetchPosts();
    } catch (err) {
      addToast(
        `${t("admin.blogs.deleteFailed")}: ${err instanceof Error ? err.message : "Unknown error"}`,
        "error",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = posts.filter((p) => {
    const matchTab = activeTab === ALL_TAG || p.tag === activeTab;
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.tag.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchTab && matchSearch && matchStatus;
  });

  const publishedCount = posts.filter((p) => p.status === "published").length;
  const draftCount = posts.filter((p) => p.status === "draft").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "#8b4513", borderTopColor: "transparent" }}
          />
          <p className="text-sm text-gray-400">{t("admin.blogs.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      {/* Toast */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-xl px-4 py-3 text-sm font-semibold shadow-lg text-white ${toast.type === "error" ? "bg-red-500" : "bg-gray-900"}`}
          >
            {toast.msg}
          </div>
        ))}
      </div>

      {/* Confirm delete */}
      {confirmDelete && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-base font-bold text-gray-800 mb-2">
              {t("admin.blogs.confirmDeleteTitle")}
            </h3>
            <p className="text-sm text-gray-500 mb-1">
              {t("admin.blogs.confirmDeleteMsg")}
            </p>
            <p className="text-sm font-semibold text-red-600 mb-5">
              &ldquo;{confirmDelete.title}&rdquo;
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
              >
                {t("admin.blogs.cancel")}
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-600 transition"
              >
                {t("admin.blogs.delete")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compact toolbar */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-gray-400">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              {publishedCount} {t("admin.blogs.showing")}
            </span>
            <span className="mx-2 text-gray-300">·</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
              {draftCount} {t("admin.blogs.draftTab").toLowerCase()}
            </span>
          </span>
        </div>
        <Link
          href="/admin/blogs/new"
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition hover:opacity-90"
          style={{ background: "#c0392b", color: "#fff" }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 3V13M3 8H13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          {t("admin.blogs.addNew")}
        </Link>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            width="15"
            height="15"
            viewBox="0 0 16 16"
            fill="none"
          >
            <circle
              cx="6.5"
              cy="6.5"
              r="5"
              stroke="currentColor"
              strokeWidth="1.3"
            />
            <path
              d="M10.5 10.5L14 14"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="text"
            placeholder={t("admin.blogs.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 h-9 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:border-red-300"
          />
        </div>
        <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1 overflow-x-auto">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-3 py-1 rounded-md text-xs font-semibold transition whitespace-nowrap"
              style={
                activeTab === tab
                  ? { background: "#4a2318", color: "#fff" }
                  : { color: "#6b7280" }
              }
            >
              {tab === ALL_TAG ? t("admin.blogs.all") : tab}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1">
          {(["all", "published", "draft"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="px-3 py-1 rounded-md text-xs font-semibold transition whitespace-nowrap"
              style={
                statusFilter === s
                  ? { background: "#4a2318", color: "#fff" }
                  : { color: "#6b7280" }
              }
            >
              {s === "all"
                ? t("admin.blogs.all")
                : s === "published"
                  ? t("admin.blogs.publishedTab")
                  : t("admin.blogs.draftTab")}
            </button>
          ))}
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            className="mb-4 opacity-25"
          >
            <rect
              x="8"
              y="5"
              width="32"
              height="38"
              rx="5"
              fill="currentColor"
            />
            <rect
              x="14"
              y="14"
              width="20"
              height="3"
              rx="1.5"
              fill="white"
              opacity="0.5"
            />
            <rect
              x="14"
              y="22"
              width="16"
              height="3"
              rx="1.5"
              fill="white"
              opacity="0.3"
            />
          </svg>
          <p className="text-sm font-medium">{t("admin.blogs.noPosts")}</p>
          <p className="text-xs mt-1">{t("admin.blogs.noPostsDesc")}</p>
        </div>
      )}

      {/* Blog card list */}
      {filtered.length > 0 && (
        <div className="flex flex-col gap-3">
          {filtered.map((post) => {
            const tc = TAG_COLOR[post.tag] ?? {
              bg: "#f3f4f6",
              text: "#374151",
            };
            const isPublished = post.status === "published";
            return (
              <div
                key={post.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
              >
                <div className="flex items-stretch">
                  {/* Thumbnail */}
                  <div className="relative w-35 shrink-0 hidden sm:block">
                    {post.cover_image ? (
                      <Image
                        src={post.cover_image}
                        alt=""
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <rect
                            x="2"
                            y="2"
                            width="12"
                            height="12"
                            rx="2"
                            fill="#d1d5db"
                          />
                          <circle cx="6" cy="6" r="1.5" fill="#9ca3af" />
                          <path
                            d="M2 11L5.5 8L8 10L11 7L14 11V12C14 13.1 13.1 14 12 14H4C2.9 14 2 13.1 2 12V11Z"
                            fill="#9ca3af"
                          />
                        </svg>
                      </div>
                    )}
                    <div
                      className="absolute top-0 left-0 w-1 h-full"
                      style={{
                        background: isPublished ? "#16a34a" : "#D1D5DB",
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4 flex flex-col justify-center min-w-0">
                    <div className="flex items-start gap-2 mb-1.5">
                      <h3 className="font-semibold text-gray-900 text-sm truncate group-hover:text-amber-800 transition-colors flex-1">
                        {post.title}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-400 truncate mb-3 max-w-125">
                      {post.excerpt || ""}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold"
                        style={{ background: tc.bg, color: tc.text }}
                      >
                        {post.tag}
                      </span>
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold"
                        style={{
                          background: isPublished ? "#D1FAE5" : "#F3F4F6",
                          color: isPublished ? "#065F46" : "#6B7280",
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            background: isPublished ? "#16a34a" : "#9CA3AF",
                          }}
                        />
                        {isPublished
                          ? t("admin.dashboard.published")
                          : t("admin.dashboard.draft")}
                      </span>
                      {post.is_featured && (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold"
                          style={{ background: "#FEF3C7", color: "#92400E" }}
                        >
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 16 16"
                            fill="none"
                          >
                            <path
                              d="M8 1.5L9.8 5.7L14.3 6.2L11 9.3L11.8 13.8L8 11.7L4.2 13.8L5 9.3L1.7 6.2L6.2 5.7L8 1.5Z"
                              fill="#EF9F27"
                            />
                          </svg>
                          {t("admin.blogs.featured")}
                        </span>
                      )}
                      {post.is_popular && (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold"
                          style={{ background: "#FFEDD5", color: "#C2410C" }}
                        >
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 16 16"
                            fill="none"
                          >
                            <path
                              d="M8 1C8 1 12.5 5 12.5 9.5C12.5 12 10.5 14 8 14C5.5 14 3.5 12 3.5 9.5C3.5 5 8 1 8 1Z"
                              fill="#F97316"
                            />
                          </svg>
                          {t("admin.blogs.popular")}
                        </span>
                      )}
                      <span className="w-px h-3 bg-gray-200 hidden sm:block" />
                      <span className="inline-flex items-center gap-1 text-[11px] text-gray-400">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M1 8C1 8 3.5 3 8 3C12.5 3 15 8 15 8C15 8 12.5 13 8 13C3.5 13 1 8 1 8Z"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            fill="none"
                          />
                          <circle
                            cx="8"
                            cy="8"
                            r="2"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            fill="none"
                          />
                        </svg>
                        {(post.view_count || 0).toLocaleString()}
                      </span>
                      <span className="text-[11px] text-gray-400 hidden sm:inline">
                        {post.published_at
                          ? new Date(post.published_at).toLocaleDateString()
                          : ""}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 px-4 shrink-0">
                    <Link
                      href={`/admin/blogs/${post.id}/edit`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition hover:opacity-80"
                      style={{ background: "#FEE2E2", color: "#5c3320" }}
                      title={t("admin.blogs.edit")}
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M11.5 1.5L14.5 4.5L5 14H2V11L11.5 1.5Z"
                          stroke="currentColor"
                          strokeWidth="1.3"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {t("admin.blogs.edit")}
                    </Link>
                    <button
                      onClick={() => setConfirmDelete(post)}
                      disabled={deletingId === post.id}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition hover:opacity-80 disabled:opacity-50"
                      style={{ background: "#FEE2E2", color: "#5c3320" }}
                      title={t("admin.blogs.delete")}
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M3 4H13L12 14H4L3 4Z"
                          stroke="currentColor"
                          strokeWidth="1.2"
                        />
                        <path
                          d="M1 4H15"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                        />
                        <path
                          d="M6 2H10"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                        />
                      </svg>
                      {t("admin.blogs.delete")}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filtered.length > 0 && (
        <p className="text-xs text-gray-400 mt-4 text-right">
          {t("admin.blogs.showing")} {filtered.length} / {posts.length}
        </p>
      )}
    </div>
  );
}
