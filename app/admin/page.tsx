"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-1">
      <p className="text-xs font-semibold tracking-widest uppercase text-gray-400">
        {label}
      </p>
      <p
        className="text-3xl font-bold mt-1"
        style={{ color: accent ?? "#8b4513" }}
      >
        {value}
      </p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    views: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blogs?admin=true&limit=200")
      .then((res) => res.json())
      .then((data) => {
        const posts = data.posts || [];
        setStats({
          total: posts.length,
          published: posts.filter(
            (p: { status: string }) => p.status === "published",
          ).length,
          draft: posts.filter((p: { status: string }) => p.status === "draft")
            .length,
          views: posts.reduce(
            (sum: number, p: { view_count: number }) =>
              sum + (p.view_count || 0),
            0,
          ),
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      {/* Compact header */}
      <p className="text-xs text-gray-400 mb-5">
        {t("admin.dashboard.subtitle")}
      </p>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div
            className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "#8b4513", borderTopColor: "transparent" }}
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              label={t("admin.dashboard.totalPosts")}
              value={stats.total}
              accent="#8b4513"
            />
            <StatCard
              label={t("admin.dashboard.published")}
              value={stats.published}
              accent="#16a34a"
            />
            <StatCard
              label={t("admin.dashboard.draft")}
              value={stats.draft}
              accent="#d97706"
            />
            <StatCard
              label={t("admin.dashboard.totalViews")}
              value={stats.views.toLocaleString()}
              accent="#8b4513"
            />
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-bold text-gray-800 mb-4">
              {t("admin.dashboard.quickActions")}
            </h3>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/blogs/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition hover:opacity-90"
                style={{ background: "#c0392b" }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 3V13M3 8H13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                {t("admin.dashboard.newPost")}
              </Link>
              <Link
                href="/admin/blogs"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
              >
                {t("admin.dashboard.managePosts")}
              </Link>
              <Link
                href="/blog"
                target="_blank"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
              >
                {t("admin.dashboard.viewBlog")}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M3 9L9 3M9 3H4M9 3V8"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
