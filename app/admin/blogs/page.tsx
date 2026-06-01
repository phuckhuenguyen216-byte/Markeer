"use client";
import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";
import {
  Eye,
  Flame,
  ImageIcon,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import { BlogPost, TAG_OPTIONS, TAG_COLOR } from "@/lib/blog";
import { formatDate } from "@/lib/recruitment";
import Badge from "../components/Badge";
import BlogStatusBadge from "../components/BlogStatusBadge";
import Spinner from "../components/Spinner";
import { ToastStack, useToasts } from "../components/Toast";
import ConfirmModal, { type ConfirmAction } from "../components/ConfirmModal";

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
  const { toasts, addToast } = useToasts();
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch("/api/blogs?admin=true");
      const data = await res.json();
      setPosts(data.posts || []);
    } catch {
      addToast(t("admin.blogs.loadError"), "error");
    } finally {
      setLoading(false);
    }
  }, [addToast, t]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDelete = async (post: BlogPost) => {
    setConfirmAction(null);
    setDeletingId(post.id);
    try {
      const res = await fetch(`/api/blogs/${post.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
      addToast(`${t("admin.blogs.deleted")}: "${post.title}"`);
    } catch (err) {
      addToast(
        `${t("admin.blogs.deleteFailed")}: ${err instanceof Error ? err.message : "Unknown error"}`,
        "error",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const toggleStatus = async (post: BlogPost) => {
    setTogglingId(post.id);
    const next = post.status === "published" ? "draft" : "published";
    setPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, status: next } : p)),
    );
    try {
      const res = await fetch(`/api/blogs/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      addToast(
        next === "published"
          ? `Đã xuất bản: "${post.title}"`
          : `Đã chuyển nháp: "${post.title}"`,
      );
    } catch {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id ? { ...p, status: post.status } : p,
        ),
      );
      addToast("Lỗi cập nhật trạng thái", "error");
    } finally {
      setTogglingId(null);
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
    return <Spinner center label={t("admin.blogs.loading")} />;
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      <ToastStack toasts={toasts} />
      <ConfirmModal
        action={confirmAction}
        onCancel={() => setConfirmAction(null)}
      />

      {/* Toolbar */}
      <div className="mb-5 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-400">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            {publishedCount} {t("admin.blogs.showing")}
          </span>
          <span className="mx-2 text-gray-300">·</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
            {draftCount} {t("admin.blogs.draftTab").toLowerCase()}
          </span>
        </span>
        <Link
          href="/admin/blogs/new"
          className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-white transition hover:opacity-90"
          style={{ background: "#c0392b" }}
        >
          <Plus size={15} />
          {t("admin.blogs.addNew")}
        </Link>
      </div>

      {/* Filter bar */}
      <div className="mb-5 flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder={t("admin.blogs.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-4 text-sm outline-none focus:border-[#a0522d]"
          />
        </div>
        <div className="flex gap-1 overflow-x-auto rounded-lg border border-gray-200 bg-white p-1">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="whitespace-nowrap rounded-md px-3 py-1 text-xs font-semibold transition"
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
        <div className="flex gap-1 rounded-lg border border-gray-200 bg-white p-1">
          {(["all", "published", "draft"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="whitespace-nowrap rounded-md px-3 py-1 text-xs font-semibold transition"
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

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <ImageIcon size={44} className="mb-4 opacity-25" />
          <p className="text-sm font-medium">{t("admin.blogs.noPosts")}</p>
          <p className="mt-1 text-xs">{t("admin.blogs.noPostsDesc")}</p>
        </div>
      ) : (
        <>
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full border-collapse text-left">
              <thead className="sticky top-0 z-10 bg-[#f8f4f1]">
                <tr className="text-[10px] font-black uppercase tracking-wide text-gray-500">
                  <th className="hidden w-14 px-2 py-2 sm:table-cell">Ảnh</th>
                  <th className="px-2 py-2">Bài viết</th>
                  <th className="hidden px-2 py-2 md:table-cell">Danh mục</th>
                  <th className="px-2 py-2">Trạng thái</th>
                  <th className="hidden px-2 py-2 lg:table-cell">Cờ</th>
                  <th className="hidden px-2 py-2 lg:table-cell">Lượt xem</th>
                  <th className="hidden px-2 py-2 lg:table-cell">Ngày</th>
                  <th className="px-2 py-2 text-right">
                    {t("admin.blogs.edit")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((post) => {
                  const tc = TAG_COLOR[post.tag] ?? {
                    bg: "#f3f4f6",
                    text: "#374151",
                  };
                  return (
                    <tr
                      key={post.id}
                      className="text-sm transition hover:bg-gray-50"
                    >
                      {/* Thumbnail */}
                      <td className="hidden px-2 py-1.5 sm:table-cell">
                        <div className="relative h-9 w-11 overflow-hidden rounded-lg bg-gray-100">
                          {post.cover_image ? (
                            <Image
                              src={post.cover_image}
                              alt=""
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center text-gray-300">
                              <ImageIcon size={15} />
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Title + excerpt */}
                      <td className="px-2 py-1.5">
                        <p className="max-w-[360px] truncate font-bold leading-tight text-gray-950">
                          {post.title}
                        </p>
                        {post.excerpt && (
                          <p className="max-w-[360px] truncate text-[11px] font-medium text-gray-400">
                            {post.excerpt}
                          </p>
                        )}
                      </td>

                      {/* Tag */}
                      <td className="hidden px-2 py-1.5 md:table-cell">
                        <Badge bg={tc.bg} color={tc.text}>
                          {post.tag}
                        </Badge>
                      </td>

                      {/* Status toggle */}
                      <td className="px-2 py-1.5">
                        <button
                          type="button"
                          onClick={() => toggleStatus(post)}
                          disabled={togglingId === post.id}
                          title="Đổi trạng thái"
                          className="transition hover:opacity-75 disabled:opacity-50"
                        >
                          <BlogStatusBadge status={post.status} />
                        </button>
                      </td>

                      {/* Flags */}
                      <td className="hidden px-2 py-1.5 lg:table-cell">
                        <div className="flex items-center gap-1.5">
                          {post.is_featured && (
                            <span title={t("admin.blogs.featured")}>
                              <Star
                                size={14}
                                className="fill-amber-400 text-amber-500"
                              />
                            </span>
                          )}
                          {post.is_popular && (
                            <span title={t("admin.blogs.popular")}>
                              <Flame size={14} className="text-orange-500" />
                            </span>
                          )}
                          {!post.is_featured && !post.is_popular && (
                            <span className="text-xs text-gray-300">—</span>
                          )}
                        </div>
                      </td>

                      {/* Views */}
                      <td className="hidden px-2 py-1.5 lg:table-cell">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500">
                          <Eye size={13} className="text-gray-400" />
                          {(post.view_count || 0).toLocaleString()}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="hidden px-2 py-1.5 text-xs font-semibold text-gray-400 lg:table-cell">
                        {post.published_at ? formatDate(post.published_at) : "—"}
                      </td>

                      {/* Actions */}
                      <td className="px-2 py-1.5">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/admin/blogs/${post.id}/edit`}
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-gray-900 transition hover:bg-gray-200"
                            title={t("admin.blogs.edit")}
                          >
                            <Pencil size={13} />
                          </Link>
                          <button
                            type="button"
                            onClick={() =>
                              setConfirmAction({
                                title: t("admin.blogs.confirmDeleteTitle"),
                                desc: t("admin.blogs.confirmDeleteMsg"),
                                detail: post.title,
                                danger: true,
                                onConfirm: () => handleDelete(post),
                              })
                            }
                            disabled={deletingId === post.id}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-red-400 transition hover:bg-red-50 disabled:opacity-50"
                            title={t("admin.blogs.delete")}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-right text-xs font-bold text-gray-400">
            {t("admin.blogs.showing")} {filtered.length} / {posts.length}
          </p>
        </>
      )}
    </div>
  );
}
