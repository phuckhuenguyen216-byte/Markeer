"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Eye,
  FileText,
  Plus,
  UserCheck,
  Users,
} from "lucide-react";
import { Application, getStatusInfo } from "@/lib/application";
import {
  getInitials,
  getPrimaryTeam,
  formatSubmittedAt,
} from "@/lib/recruitment";
import { StatusBadge } from "./components/StatusControl";
import BlogStatusBadge, { type BlogStatus } from "./components/BlogStatusBadge";
import Spinner from "./components/Spinner";

type BlogPost = {
  id: string;
  title: string;
  status: BlogStatus;
  view_count?: number;
  published_at?: string;
  created_at?: string;
};

function StatCard({
  label,
  value,
  sub,
  accent,
  icon,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          {label}
        </p>
        {icon && (
          <span
            className="flex h-8 w-8 items-center justify-center rounded-xl"
            style={{ background: `${accent ?? "#8b4513"}1a`, color: accent ?? "#8b4513" }}
          >
            {icon}
          </span>
        )}
      </div>
      <p className="mt-1 text-3xl font-black" style={{ color: accent ?? "#8b4513" }}>
        {value}
      </p>
      {sub && <p className="mt-1 text-xs font-semibold text-gray-400">{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const { t } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    views: 0,
    apps: 0,
    newApps: 0,
    interviewed: 0,
    accepted: 0,
  });
  const [recentApps, setRecentApps] = useState<Application[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/blogs?admin=true&limit=200")
        .then((r) => r.json())
        .catch(() => ({ posts: [] })),
      fetch("/api/applications?limit=1000")
        .then((r) => r.json())
        .catch(() => ({ applications: [] })),
    ])
      .then(([blogData, appData]) => {
        const posts: BlogPost[] = blogData.posts || [];
        const apps: Application[] = appData.applications || [];

        setStats({
          total: posts.length,
          published: posts.filter((p) => p.status === "published").length,
          draft: posts.filter((p) => p.status === "draft").length,
          views: posts.reduce((sum, p) => sum + (p.view_count || 0), 0),
          apps: apps.length,
          newApps: apps.filter((a) => a.status === "new").length,
          interviewed: apps.filter((a) => a.status === "interviewed").length,
          accepted: apps.filter((a) => a.status === "accepted").length,
        });

        setRecentApps(
          [...apps]
            .sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime(),
            )
            .slice(0, 5),
        );
        setRecentPosts(
          [...posts]
            .sort(
              (a, b) =>
                new Date(b.published_at || b.created_at || 0).getTime() -
                new Date(a.published_at || a.created_at || 0).getTime(),
            )
            .slice(0, 5),
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const avgViews =
    stats.published > 0 ? Math.round(stats.views / stats.published) : 0;

  if (loading) {
    return <Spinner center label={t("admin.dashboard.subtitle")} />;
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      <p className="mb-5 text-xs text-gray-400">
        {t("admin.dashboard.subtitle")}
      </p>

      {/* Stat cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={t("admin.dashboard.totalPosts")}
          value={stats.total}
          accent="#8b4513"
          icon={<FileText size={16} />}
          sub={`${stats.published} hiển thị · ${stats.draft} nháp`}
        />
        <StatCard
          label={t("admin.dashboard.totalViews")}
          value={stats.views.toLocaleString()}
          accent="#a0522d"
          icon={<Eye size={16} />}
          sub={`TB ${avgViews.toLocaleString()}/bài`}
        />
        <StatCard
          label="Tổng ứng viên"
          value={stats.apps}
          accent="#4a2318"
          icon={<Users size={16} />}
          sub={`${stats.newApps} hồ sơ mới`}
        />
        <StatCard
          label="Đã nhận"
          value={stats.accepted}
          accent="#16a34a"
          icon={<UserCheck size={16} />}
          sub={`${stats.interviewed} đã phỏng vấn`}
        />
      </div>

      {/* Recent + quick actions */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Recent candidates */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h3 className="text-sm font-black text-gray-800">
              Ứng viên mới nhất
            </h3>
            <Link
              href="/admin/applications"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#8b4513] transition hover:text-[#4a2318]"
            >
              Xem tất cả
              <ArrowUpRight size={13} />
            </Link>
          </div>
          {recentApps.length === 0 ? (
            <p className="px-5 py-8 text-center text-xs text-gray-400">
              Chưa có ứng viên nào
            </p>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentApps.map((app) => {
                const st = getStatusInfo(app.status);
                const team = getPrimaryTeam(app);
                const submitted = formatSubmittedAt(app.created_at);
                return (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() =>
                      router.push(`/admin/applications/${app.id}`)
                    }
                    className="flex w-full items-center gap-3 px-5 py-3 text-left transition hover:bg-gray-50"
                  >
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-black text-white"
                      style={{ background: st.color }}
                    >
                      {getInitials(app.full_name)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-black text-gray-950">
                        {app.full_name || "---"}
                      </p>
                      <p className="truncate text-xs font-medium text-gray-400">
                        {(app.career_journey || [])[0] ||
                          (team !== "all" ? team : "---")}
                      </p>
                    </div>
                    <StatusBadge status={app.status} className="hidden sm:inline-flex" />
                    <span className="hidden shrink-0 text-xs font-semibold text-gray-400 md:block">
                      {submitted.date}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right column: recent posts + quick actions */}
        <div className="flex flex-col gap-4">
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h3 className="text-sm font-black text-gray-800">
                Bài viết gần đây
              </h3>
              <Link
                href="/admin/blogs"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#8b4513] transition hover:text-[#4a2318]"
              >
                Tất cả
                <ArrowUpRight size={13} />
              </Link>
            </div>
            {recentPosts.length === 0 ? (
              <p className="px-5 py-8 text-center text-xs text-gray-400">
                Chưa có bài viết
              </p>
            ) : (
              <div className="divide-y divide-gray-50">
                {recentPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/admin/blogs/${post.id}/edit`}
                    className="flex items-center gap-3 px-5 py-3 transition hover:bg-gray-50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-gray-900">
                        {post.title}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
                        <Eye size={11} />
                        {(post.view_count || 0).toLocaleString()}
                      </p>
                    </div>
                    <BlogStatusBadge status={post.status} />
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-black text-gray-800">
              {t("admin.dashboard.quickActions")}
            </h3>
            <div className="flex flex-col gap-2">
              <Link
                href="/admin/blogs/new"
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
                style={{ background: "#c0392b" }}
              >
                <Plus size={16} />
                {t("admin.dashboard.newPost")}
              </Link>
              <Link
                href="/admin/applications"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-600 transition hover:bg-gray-50"
              >
                <Users size={15} />
                Quản lý ứng viên
              </Link>
              <Link
                href="/admin/blogs"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-600 transition hover:bg-gray-50"
              >
                <FileText size={15} />
                {t("admin.dashboard.managePosts")}
              </Link>
              <Link
                href="/blog"
                target="_blank"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-600 transition hover:bg-gray-50"
              >
                <ArrowUpRight size={15} />
                {t("admin.dashboard.viewBlog")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
