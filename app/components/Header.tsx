/* eslint-disable @next/next/no-html-link-for-pages */
"use client";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import "../../app/i18n";
import LanguageSwitcher from "./LanguageSwitcher";
import { useState } from "react";

export default function Header() {
  const { t } = useTranslation("common");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.svg"
            alt="Markee AI Marketing"
            width={120}
            height={32}
            className="h-8 w-auto"
          />
          <span className="text-lg font-semibold tracking-tight text-gray-900">
            Markee
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-700">
          {/* <a
            href="/#features"
            className="hover:text-gray-900 transition-colors"
          >
            {t("header.features")}
          </a> */}

          <Link
            href="/"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            {t("header.home")}
          </Link>

          {/* Services Dropdown */}
          <div className="relative group">
            <button
              type="button"
              className="flex items-center gap-1 hover:text-gray-900 transition-colors"
            >
              {t("header.services")}
              <span className="text-xs">▾</span>
            </button>

            <div className="absolute left-0 top-full mt-2 w-56 rounded-xl bg-white shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-1">
              <Link
                href="https://chat.markeeai.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
              >
                Markee Chat
              </Link>
              <Link
                href="/markee-marketing"
                className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
              >
                Markee Marketing
              </Link>
            </div>
          </div>

          {/* About Dropdown */}
          <div className="relative group">
            <Link
              href="/about"
              className="flex items-center gap-1 hover:text-gray-900 transition-colors"
            >
              {t("header.aboutMenu")}
              <span className="text-xs">▾</span>
            </Link>

            <div className="absolute left-0 top-full mt-2 w-56 rounded-xl bg-white shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-1">
              <Link
                href="/policy"
                className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
              >
                {t("header.privacy")}
              </Link>
              <Link
                href="/terms"
                className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
              >
                {t("header.terms")}
              </Link>
            </div>
          </div>

          <Link
            href="/docs/autopost/intro"
            className="hover:text-gray-900 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("header.documentation")}
          </Link>

          <Link
            href="/blog"
            className="hover:text-gray-900 transition-colors"
            onClick={() => window.scrollTo({ top: 0 })}
          >
            Blog
          </Link>

          

          <Link href="/apply" className="hover:text-gray-900 transition-colors">
            {t("header.apply")}
          </Link>
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Phone */}
          <a
            href="tel:0765055708"
            className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-red-500 transition-colors"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="hidden sm:inline">0765 055 708</span>
          </a>

          <LanguageSwitcher />

          {/* Desktop Register Button */}
          <Link
            href="https://app.markeeai.com"
            target="_blank"
            className="hidden md:block rounded-full bg-red-500 text-white px-5 py-2 text-sm font-medium hover:bg-red-600 transition-all"
          >
            {t("header.register")}
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden px-2 py-1.5 text-gray-700 hover:text-gray-900 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <span className="text-xs font-semibold">Menu</span>
          </button>
        </div>
      </div>

      {/* ==================== MOBILE MENU ==================== */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-6 py-8 flex flex-col gap-6 text-base">
            <Link
              href="/"
              className="font-medium text-gray-700 hover:text-gray-900"
              onClick={() => {
                setIsOpen(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              {t("header.home")}
            </Link>

            {/* Services Section in Mobile */}
            <div className="pt-1">
              <p className="text-sm text-gray-500 mb-2 px-1">
                {t("header.services")}
              </p>
              <Link
                href="https://chat.markeeai.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="block py-3 px-1 text-gray-700 hover:text-gray-900"
                onClick={() => setIsOpen(false)}
              >
                Markee Chat
              </Link>
              <Link
                href="/markee-marketing"
                className="block py-3 px-1 text-gray-700 hover:text-gray-900"
                onClick={() => setIsOpen(false)}
              >
                Markee Marketing
              </Link>
            </div>

            <a
              href="/#features"
              className="font-medium text-gray-700 hover:text-gray-900"
              onClick={() => setIsOpen(false)}
            >
              {t("header.features")}
            </a>

            <Link
              href="https://app.markeeai.com"
              target="_blank"
              className="font-medium text-gray-700 hover:text-gray-900"
              onClick={() => setIsOpen(false)}
            >
              {t("header.app")}
            </Link>

            <Link
              href="/docs/autopost/intro"
              target="_blank"
              className="font-medium text-gray-700 hover:text-gray-900"
              onClick={() => setIsOpen(false)}
            >
              {t("header.documentation")}
            </Link>

            <Link
              href="/blog"
              className="font-medium text-gray-700 hover:text-gray-900"
              onClick={() => {
                setIsOpen(false);
                window.scrollTo({ top: 0 });
              }}
            >
              Blog
            </Link>

            <Link
              href="/apply"
              className="font-medium text-gray-700 hover:text-gray-900"
              onClick={() => setIsOpen(false)}
            >
              {t("header.apply")}
            </Link>

            {/* About Section in Mobile */}
            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500 mb-3 px-1">
                {t("header.aboutMenu")}
              </p>
              <Link
                href="/policy"
                className="block py-3 px-1 text-gray-700 hover:text-gray-900"
                onClick={() => setIsOpen(false)}
              >
                {t("header.privacy")}
              </Link>
              <Link
                href="/terms"
                className="block py-3 px-1 text-gray-700 hover:text-gray-900"
                onClick={() => setIsOpen(false)}
              >
                {t("header.terms")}
              </Link>
            </div>

            {/* Register Button in Mobile */}
            <Link
              href="https://app.markeeai.com"
              target="_blank"
              onClick={() => setIsOpen(false)}
              className="mt-4 block w-full text-center rounded-full bg-red-500 text-white py-3.5 font-semibold text-base hover:bg-red-600 transition-all"
            >
              {t("header.register")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
