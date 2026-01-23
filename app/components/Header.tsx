"use client";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import "../../app/i18n";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const { t } = useTranslation("common");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-200/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/logo.svg"
            alt="Markee AI Marketing"
            className="h-8 w-auto"
          />
          <span className="text-lg font-semibold tracking-tight">
            Markee
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-700">
          <a href="#features" className="hover:text-gray-900">
            {t("header.features")}
          </a>

          <Link
            href="https://app.markeeai.com"
            className="hover:text-gray-900"
            target="_blank"
          >
            {t("header.app")}
          </Link>

          <Link
            href="/docs/autopost/intro"
            className="hover:text-gray-900"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("header.documentation")}
          </Link>
          {/* === About dropdown === */}
          <div className="relative group">
            <button className="flex items-center gap-1 hover:text-gray-900 transition-colors">
              {t("header.aboutMenu")}
              <span className="text-xs">▾</span>
            </button>
            {/* Dropdown */}
            <div
              className="
                absolute left-0 top-full mt-2
                w-56
                rounded-xl
                bg-white
                shadow-lg
                border border-gray-200
                opacity-0 invisible
                group-hover:opacity-100 group-hover:visible
                transition-all duration-200
              "
            >
              <Link
                href="/policy"
                className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-t-xl"
              >
                {t("header.privacy")}
              </Link>

              <Link
                href="/terms"
                className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-b-xl"
              >
                {t("header.terms")}
              </Link>

            </div>
          </div>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            href="https://app.markeeai.com"
            target="_blank"
            className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-colors"
          >
            {t("header.register")}
          </Link>
          
        </div>
      </div>
    </header>
  );
}
