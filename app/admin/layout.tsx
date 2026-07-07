/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { createSupabaseBrowserClient } from "@/lib/supabase";

const menu = [
  {
    nameKey: "admin.sidebar.dashboard",
    href: "/admin",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect
          x="1"
          y="1"
          width="6"
          height="6"
          rx="1.5"
          fill="currentColor"
          opacity="0.9"
        />
        <rect
          x="9"
          y="1"
          width="6"
          height="6"
          rx="1.5"
          fill="currentColor"
          opacity="0.6"
        />
        <rect
          x="1"
          y="9"
          width="6"
          height="6"
          rx="1.5"
          fill="currentColor"
          opacity="0.6"
        />
        <rect
          x="9"
          y="9"
          width="6"
          height="6"
          rx="1.5"
          fill="currentColor"
          opacity="0.3"
        />
      </svg>
    ),
  },
  {
    nameKey: "admin.sidebar.manageBlog",
    href: "/admin/blogs",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect
          x="2"
          y="1"
          width="12"
          height="14"
          rx="2"
          fill="currentColor"
          opacity="0.2"
        />
        <rect
          x="4"
          y="4"
          width="8"
          height="1.5"
          rx="0.75"
          fill="currentColor"
          opacity="0.85"
        />
        <rect
          x="4"
          y="7"
          width="6"
          height="1.5"
          rx="0.75"
          fill="currentColor"
          opacity="0.6"
        />
        <rect
          x="4"
          y="10"
          width="7"
          height="1.5"
          rx="0.75"
          fill="currentColor"
          opacity="0.4"
        />
      </svg>
    ),
  },
  {
    nameKey: "admin.sidebar.manageApplications",
    href: "/admin/applications",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect
          x="2"
          y="2"
          width="12"
          height="12"
          rx="2"
          fill="currentColor"
          opacity="0.2"
        />
        <path
          d="M5 6h6M5 8.5h4M5 11h5"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          opacity="0.8"
        />
        <circle cx="12" cy="4" r="2.5" fill="#ef4444" />
      </svg>
    ),
  },
  {
    nameKey: "admin.sidebar.manageEmployeeProfiles",
    href: "/admin/employee-profiles",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect
          x="2"
          y="2"
          width="12"
          height="12"
          rx="2"
          fill="currentColor"
          opacity="0.2"
        />
        <path
          d="M8 8a2 2 0 100-4 2 2 0 000 4zm-4 4c0-1.5 2.5-2.2 4-2.2s4 .7 4 2.2v.8H4V12z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.85"
        />
        <circle cx="12" cy="4" r="2.5" fill="#10b981" />
      </svg>
    ),
  },
  {
    nameKey: "admin.sidebar.surveyReviewLevel",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect
          x="2"
          y="2"
          width="12"
          height="12"
          rx="2"
          fill="currentColor"
          opacity="0.2"
        />
        <path
          d="M4 5h8M4 8h8M4 11h5"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          opacity="0.85"
        />
        <circle cx="12" cy="12" r="2" fill="#ef4444" />
      </svg>
    ),
    children: [
      {
        nameKey: "admin.sidebar.selfReviewLevel",
        href: "/admin/survey-review/self-review",
      },
      {
        nameKey: "admin.sidebar.leaderReviewLevel",
        href: "/admin/survey-review/leader-review",
      },
      {
        nameKey: "admin.sidebar.questionSettings",
        href: "/admin/survey-review/questions",
      },
    ],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [surveyExpanded, setSurveyExpanded] = useState(pathname.startsWith("/admin/survey-review"));
  const [email, setEmail] = useState("");

  useEffect(() => {
    setMounted(true);
    if (pathname === "/admin/login") return;
    const supabase = createSupabaseBrowserClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push("/admin/login");
      else setEmail(data.user.email || "");
    });
  }, [pathname, router]);

  const handleLogout = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const { t } = useTranslation();

  if (!mounted) return null;
  if (pathname === "/admin/login") return <>{children}</>;

  const currentPage = (() => {
    for (const item of menu) {
      if (item.href && (pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href)))) {
        return item.nameKey;
      }
      if (item.children) {
        for (const child of item.children) {
          if (pathname === child.href || (child.href !== "/admin" && pathname.startsWith(child.href))) {
            return child.nameKey;
          }
        }
      }
    }
    return "Admin";
  })();

  const currentPageLabel =
    currentPage === "Admin" ? currentPage : t(currentPage);

  return (
    <>
      <style>{`
        .admin-shell { display: flex; height: 100vh; overflow: hidden; background: #eef1f5; font-family: system-ui, -apple-system, sans-serif; }

        .sidebar {
          width: ${collapsed ? "64px" : "220px"};
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          height: 100vh;
          transition: width 0.3s cubic-bezier(.4,0,.2,1);
          overflow: hidden;
          background: #2c1810;
          box-shadow: 4px 0 24px rgba(44,24,16,0.25);
        }

        .sidebar::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, #2c1810 0%, #381c13 100%);
          z-index: 0;
        }

        .sidebar-wave {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          z-index: 1;
          opacity: 0.12;
          display: none;
        }
        @keyframes wave-move {
          from { transform: translateY(0px) scaleX(1); }
          to   { transform: translateY(-12px) scaleX(1.05); }
        }

        .sidebar-dot {
          position: absolute;
          border-radius: 50%;
          background: rgba(180,120,90,0.12);
          display: none;
          z-index: 1;
        }
        @keyframes float-dot {
          from { transform: translateY(0); opacity: 0.15; }
          to   { transform: translateY(-14px); opacity: 0.35; }
        }

        .sidebar-inner { position: relative; z-index: 2; display: flex; flex-direction: column; height: 100%; }

        .sidebar-logo {
          padding: 18px 14px 14px;
          border-bottom: 0.5px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          gap: 10px;
          min-height: 66px;
        }
        .logo-mark {
          width: 36px; height: 36px; flex-shrink: 0;
          border-radius: 12px;
          background: linear-gradient(135deg, #b45309, #7c2d12);
          display: flex; align-items: center; justify-content: center;
          color: #fff;
          font-size: 15px;
          font-weight: 900;
          letter-spacing: 0;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.18), 0 8px 18px rgba(0,0,0,0.22);
        }
        .logo-mark:hover { transform: translateY(-1px); }
        .logo-text { overflow: hidden; transition: opacity 0.2s, width 0.3s; white-space: nowrap; }
        .logo-text.hidden-text { opacity: 0; width: 0; }

        .sidebar-nav { flex: 1; padding: 12px 8px; display: flex; flex-direction: column; gap: 2px; }
        .nav-label {
          font-size: 9px; letter-spacing: 2px; text-transform: uppercase;
          color: rgba(255,255,255,0.3); padding: 8px 8px 4px;
          overflow: hidden; white-space: nowrap;
          transition: opacity 0.2s;
        }
        .nav-label.hidden-text { opacity: 0; }

        .nav-link {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 10px; border-radius: 10px;
          text-decoration: none;
          font-size: 12px; font-weight: 500;
          color: rgba(255,255,255,0.5);
          transition: all 0.18s ease;
          position: relative;
          overflow: hidden;
          white-space: nowrap;
        }
        .nav-link::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(90deg, rgba(180,100,70,0.4), rgba(200,130,90,0.2));
          opacity: 0; border-radius: 10px;
          transition: opacity 0.2s;
        }
        .nav-link:hover { color: rgba(255,255,255,0.9); }
        .nav-link:hover::before { opacity: 0.6; }
        .nav-link.active { color: #fff; }
        .nav-link.active::before { opacity: 1; }
        .nav-link-bar {
          position: absolute; left: 0; top: 20%; bottom: 20%;
          width: 3px; border-radius: 2px;
          background: #c0392b;
          opacity: 0; transform: scaleY(0);
          transition: all 0.2s;
        }
        .nav-link.active .nav-link-bar { opacity: 1; transform: scaleY(1); }
        .nav-link-icon { flex-shrink: 0; transition: transform 0.2s; }
        .nav-link:hover .nav-link-icon { transform: scale(1.15); }
        .nav-link-name { overflow: hidden; transition: opacity 0.2s, max-width 0.3s; max-width: 120px; }
        .nav-link-name.hidden-text { opacity: 0; max-width: 0; }

        .collapse-btn { display: none; }

        .sidebar-footer { padding: 10px 8px 14px; border-top: 0.5px solid rgba(255,255,255,0.06); }
        .logout-btn {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 10px; border-radius: 10px;
          background: none; border: none; cursor: pointer;
          width: 100%; font-size: 12px; font-weight: 500;
          color: rgba(255,140,80,0.65);
          transition: all 0.18s;
          white-space: nowrap;
        }
        .logout-btn:hover { color: rgba(255,140,80,1); background: rgba(255,100,50,0.1); }

        .admin-main { flex: 1; display: flex; flex-direction: column; min-width: 0; height: 100vh; min-height: 0; background: #eef1f5; }

        .topbar {
          height: 52px; flex-shrink: 0;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 clamp(12px, 1.8vw, 24px);
          position: relative; z-index: 30;
        }
        .topbar-left { display: flex; min-width: 0; align-items: center; gap: 10px; }
        .topbar-toggle {
          width: 30px;
          height: 30px;
          border-radius: 9px;
          border: 1px solid #e5e7eb;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.18s;
        }
        .topbar-toggle:hover { background: #f9fafb; color: #4a2318; border-color: #d6c4ba; }
        .topbar-toggle svg { transition: transform 0.2s; }
        .topbar-toggle.collapsed svg { transform: rotate(180deg); }
        .breadcrumb-sep { color: #d1d5db; font-size: 14px; }
        .topbar-page { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 14px; font-weight: 700; color: #5c3320; }
        .topbar-sub { font-size: 11px; color: #9ca3af; white-space: nowrap; }

        .topbar-right { display: flex; min-width: 0; align-items: center; gap: 10px; }
        .avatar-ring {
          width: 30px; height: 30px; border-radius: 50%;
          background: linear-gradient(135deg,#8b4513,#a0522d);
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 11px; font-weight: 700;
          box-shadow: 0 0 0 2px #fff, 0 0 0 3.5px #8b4513;
        }
        .topbar-name { max-width: min(260px, 28vw); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; color: #6b7280; font-weight: 500; }

        .online-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #16a34a;
          box-shadow: 0 0 0 2px rgba(22,163,74,0.25);
          animation: pulse-green 2s ease-in-out infinite;
        }
        @keyframes pulse-green {
          0%,100% { box-shadow: 0 0 0 2px rgba(22,163,74,0.25); }
          50%      { box-shadow: 0 0 0 5px rgba(22,163,74,0.08); }
        }

        .topbar-logout {
          display: flex;
          align-items: center;
          gap: 6px;
          height: 30px;
          padding: 0 10px;
          border-radius: 9px;
          border: 1px solid rgba(192,57,43,0.25);
          background: #fff;
          color: #c0392b;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
        }

        .admin-content { flex: 1; min-height: 0; padding: clamp(12px, 1.6vw, 20px); overflow-y: auto; }

        .page-enter { animation: page-in 0.25s ease forwards; }
        @keyframes page-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        @media (max-width: 900px) {
          .sidebar { width: 68px !important; }
          .logo-text, .nav-label, .nav-link-name { opacity: 0 !important; width: 0 !important; max-width: 0 !important; }
          .sidebar-logo { padding-left: 17px; padding-right: 17px; }
          .logout-btn span { opacity: 0 !important; max-width: 0 !important; }
        }

        @media (max-width: 720px) {
          .topbar { height: 48px; gap: 8px; }
          .topbar-sub, .breadcrumb-sep, .online-dot, .topbar-name, .topbar-logout span { display: none; }
          .topbar-right { gap: 8px; }
          .topbar-logout { width: 30px; padding: 0; justify-content: center; }
          .admin-content { padding: 10px; }
        }
      `}</style>

      <div className="admin-shell">
        <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
          <div
            className="sidebar-dot"
            style={{
              width: 80,
              height: 80,
              top: "15%",
              right: -20,
              animationDelay: "0s",
            }}
          />
          <div
            className="sidebar-dot"
            style={{
              width: 50,
              height: 50,
              top: "45%",
              left: -10,
              animationDelay: "2s",
            }}
          />
          <div
            className="sidebar-dot"
            style={{
              width: 40,
              height: 40,
              bottom: "25%",
              right: 10,
              animationDelay: "4s",
            }}
          />

          <svg
            className="sidebar-wave"
            viewBox="0 0 220 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 60 Q55 30 110 60 Q165 90 220 60 L220 100 L0 100Z"
              fill="white"
            />
            <path
              d="M0 75 Q55 45 110 75 Q165 95 220 75 L220 100 L0 100Z"
              fill="white"
              opacity="0.5"
            />
          </svg>

          <button
            className={`collapse-btn ${collapsed ? "flipped" : ""}`}
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Mở rộng" : "Thu gọn"}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path
                d="M6.5 2L3.5 5L6.5 8"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="sidebar-inner">
            <div className="sidebar-logo">
              <div className="logo-mark">
                M
              </div>
              <div className={`logo-text ${collapsed ? "hidden-text" : ""}`}>
                <p
                  style={{
                    fontSize: 13,
                    color: "#fff",
                    fontWeight: 700,
                    lineHeight: 1.2,
                  }}
                >
                  Markee AI
                </p>
                <p
                  style={{
                    fontSize: 9,
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    color: "#fca5a5",
                    marginTop: 2,
                  }}
                >
                  Admin Panel
                </p>
              </div>
            </div>

            <nav className="sidebar-nav">
              <div className={`nav-label ${collapsed ? "hidden-text" : ""}`}>
                Điều hướng
              </div>
              {menu.map((item) => {
                if (item.children) {
                  const isAnyChildActive = item.children.some((child) => pathname === child.href);
                  return (
                    <div key={item.nameKey} className="flex flex-col">
                      <button
                        onClick={() => setSurveyExpanded(!surveyExpanded)}
                        className={`nav-link w-full text-left bg-transparent border-none cursor-pointer ${isAnyChildActive ? "active" : ""}`}
                        title={collapsed ? t(item.nameKey) : undefined}
                      >
                        <div className="nav-link-bar" />
                        <span className="nav-link-icon">{item.icon}</span>
                        <span className={`nav-link-name ${collapsed ? "hidden-text" : ""} flex-1`}>
                          {t(item.nameKey)}
                        </span>
                        {!collapsed && (
                          <svg
                            className={`w-3 h-3 transition-transform duration-200 ${surveyExpanded ? "rotate-90" : ""}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </button>
                      
                      {surveyExpanded && !collapsed && (
                        <div className="ml-6 mt-1 flex flex-col gap-1 border-l border-white/10 pl-2">
                          {item.children.map((child) => {
                            const isChildActive = pathname === child.href;
                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                className={`nav-link py-1.5 text-[11px] ${isChildActive ? "active text-white font-bold" : "text-white/60"}`}
                              >
                                <span className="nav-link-name">
                                  {t(child.nameKey)}
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`nav-link ${isActive ? "active" : ""}`}
                    title={collapsed ? t(item.nameKey) : undefined}
                  >
                    <div className="nav-link-bar" />
                    <span className="nav-link-icon">{item.icon}</span>
                    <span
                      className={`nav-link-name ${collapsed ? "hidden-text" : ""}`}
                    >
                      {t(item.nameKey)}
                    </span>
                  </Link>
                );
              })}
            </nav>

            <div className="sidebar-footer">
              <button
                className="logout-btn"
                onClick={handleLogout}
                title={collapsed ? t("admin.sidebar.logout") : undefined}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 16 16"
                  fill="none"
                  style={{ flexShrink: 0 }}
                >
                  <path
                    d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 11l3-3-3-3M13 8H6"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span
                  className={collapsed ? "hidden-text" : ""}
                  style={{
                    overflow: "hidden",
                    transition: "opacity 0.2s, max-width 0.3s",
                    maxWidth: collapsed ? 0 : 120,
                    opacity: collapsed ? 0 : 1,
                  }}
                >
                  {t("admin.sidebar.logout")}
                </span>
              </button>
            </div>
          </div>
        </aside>

        <div className="admin-main">
          <div className="topbar">
            <div className="topbar-left">
              <button
                type="button"
                className={`topbar-toggle ${collapsed ? "collapsed" : ""}`}
                onClick={() => setCollapsed(!collapsed)}
                title={
                  collapsed
                    ? "Mở rộng thanh điều hướng"
                    : "Thu gọn thanh điều hướng"
                }
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M8.8 3.5 5.3 7l3.5 3.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <span className="topbar-sub">Admin</span>
              <span className="breadcrumb-sep">/</span>
              <span className="topbar-page">{currentPageLabel}</span>
            </div>
            <div className="topbar-right">
              <div className="online-dot" title="Online" />
              <span className="topbar-name">{email || "admin"}</span>
              <div className="avatar-ring">
                {(email || "A").charAt(0).toUpperCase()}
              </div>
              <button
                type="button"
                onClick={handleLogout}
                title={t("admin.sidebar.logout")}
                className="topbar-logout"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 11l3-3-3-3M13 8H6"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{t("admin.sidebar.logout")}</span>
              </button>
            </div>
          </div>

          <div className="admin-content">
            <div className="page-enter" key={pathname}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
