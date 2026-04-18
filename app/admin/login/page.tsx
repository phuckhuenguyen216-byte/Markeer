"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase";

export default function AdminLogin() {
  const { t } = useTranslation();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    const normalizedLogin = username.trim().toLowerCase();

    if (!normalizedLogin || !password) {
      setError(t("admin.login.errorEmpty"));
      return;
    }
    setLoading(true);
    setError("");
    const supabase = createSupabaseBrowserClient();
    const email = normalizedLogin.includes("@")
      ? normalizedLogin
      : `${normalizedLogin}@markeeai.com`;
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (authError) {
      setError(t("admin.login.errorWrong"));
    } else {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="flex w-[700px] max-w-[95vw] rounded-2xl shadow-2xl overflow-hidden">
        {/* LEFT PANEL */}
        <div
          className="w-[240px] flex-shrink-0 relative flex flex-col items-center justify-center p-8 overflow-hidden"
          style={{
            background:
              "linear-gradient(160deg,#2c1810 0%,#3b1c14 60%,#4a2318 100%)",
          }}
        >
          <div className="relative z-10 text-center">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(255,255,255,0.15)" }}
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="10" fill="#ef4444" opacity="0.9" />
                <path
                  d="M11 16l3 3 7-7"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="text-white font-bold text-xl leading-tight">
              Markee
              <br />
              AI
            </p>
            <p
              className="text-xs tracking-widest uppercase mt-1"
              style={{ color: "#d4a088" }}
            >
              Admin Portal
            </p>
            <div
              className="mt-5 px-3 py-1 rounded-full text-xs tracking-wider uppercase"
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "0.5px solid rgba(255,255,255,0.25)",
                color: "#fecaca",
              }}
            >
              {t("admin.login.adminLabel")}
            </div>
          </div>
          <svg
            className="absolute bottom-0 left-0 w-full"
            viewBox="0 0 240 60"
            style={{ opacity: 0.2 }}
          >
            <path
              d="M0 30 Q60 10 120 30 Q180 50 240 30 L240 60 L0 60Z"
              fill="white"
            />
          </svg>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 bg-white p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-1 text-gray-800">
            {t("admin.login.welcome")}
          </h2>
          <p className="text-sm text-gray-400 mb-7">
            {t("admin.login.subtitle")}
          </p>
          <div className="flex gap-2 mb-7">
            {["Blog", "Content", "Analytics"].map((t) => (
              <span
                key={t}
                className="text-xs px-3 py-1 rounded-full border border-gray-200 text-gray-400"
              >
                {t}
              </span>
            ))}
          </div>
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-600">
              {error}
            </div>
          )}
          <div className="mb-4">
            <label className="block text-xs font-semibold tracking-widest uppercase text-gray-400 mb-2">
              {t("admin.login.usernamePlaceholder")}
            </label>
            <input
              type="text"
              placeholder="admin"
              className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm bg-gray-50 focus:outline-none focus:border-red-300"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>
          <div className="mb-2">
            <label className="block text-xs font-semibold tracking-widest uppercase text-gray-400 mb-2">
              {t("admin.login.passwordPlaceholder")}
            </label>
            <input
              type="password"
              placeholder="••••••"
              className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm bg-gray-50 focus:outline-none focus:border-red-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full h-10 rounded-lg text-white text-sm font-semibold mt-5 transition hover:opacity-90 disabled:opacity-60"
            style={{ background: "#c0392b" }}
          >
            {loading ? t("admin.login.loggingIn") : t("admin.login.loginBtn")}
          </button>
          <p className="text-center text-xs text-gray-400 mt-4">
            {t("admin.login.subtitle")}
          </p>
        </div>
      </div>
    </div>
  );
}
