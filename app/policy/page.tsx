"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Footer from "../components/Footer";
import ChatwootWidget from "../components/ChatwootWidget";
import { useTranslation } from "react-i18next";

export default function PrivacyPolicyPage() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const sections = [
    { id: "section-1", title: t("policy.sections.1.title") },
    { id: "section-2", title: t("policy.sections.2.title") },
    { id: "section-3", title: t("policy.sections.3.title") },
    { id: "section-4", title: t("policy.sections.4.title") },
    { id: "section-5", title: t("policy.sections.5.title") },
    { id: "section-6", title: t("policy.sections.6.title") },
    { id: "section-7", title: t("policy.sections.7.title") },
    { id: "section-8", title: t("policy.sections.8.title") },
    { id: "section-9", title: t("policy.sections.9.title") },
    { id: "section-10", title: t("policy.sections.10.title") },
    { id: "section-11", title: t("policy.sections.11.title") },
    { id: "section-12", title: t("policy.sections.12.title") },
  ];

  return (
    <>
    <ChatwootWidget />
    <div className="relative lg:flex lg:gap-0">


      {/* ================= MOBILE TOC ================= */}
        <div className="lg:hidden">
        <aside
            className={`
            fixed top-16 left-[-40px] z-50
            h-[calc(110vh-5rem)]
            bg-white
            transition-all duration-300 ease-in-out
            ${open ? "w-90" : "w-10"}
            `}
        >
            {/* Toggle button */}
            <button
            onClick={() => setOpen(!open)}
            className="
                absolute -right-10 top-3 w-8 h-8
                bg-gray-800 text-white rounded-full
                flex items-center justify-center shadow
            "
            >
            {open ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>

            {open && (
            <div className="px-12 py-6 h-full overflow-y-auto">
                <h3 className="text-sm font-semibold mb-4 text-gray-900">
                {t("policy.toc.title")}
                </h3>

                <ul className="space-y-2">
                {sections.map((item) => (
                    <li key={item.id}>
                    <Link
                        href={`#${item.id}`}
                        className="
                        block text-sm text-gray-700
                        px-3 py-2 rounded-md
                        transition-all
                        hover:bg-gray-50
                        hover:pl-4
                        "
                        onClick={() => setOpen(false)} // click là đóng
                    >
                        {item.title}
                    </Link>
                    </li>
                ))}
                </ul>
            </div>
            )}
        </aside>
        </div>

      {/* ================= DESKTOP TOC (GIỮ NGUYÊN) ================= */}
      <aside
        className="
          hidden lg:block
          sticky top-24
          left-20
          z-40

          w-90               /* cố định width */
          h-[calc(100vh-120px)]

          self-start
          bg-white
          border-r border-gray-200
        "
      >
        <div className="pl-8 pr-6 py-2 h-full overflow-y-auto">
          <h3 className="text-lg font-semibold mb-6 text-gray-900">
            {t("policy.toc.title")}
          </h3>

          <ul className="space-y-2">
            {sections.map((item) => (
              <li key={item.id}>
                <Link
                  href={`#${item.id}`}
                  className="
                    group relative overflow-hidden block
                    text-sm font-medium

                    px-4 py-1
                    rounded-lg

                    text-gray-700
                    transition-colors duration-300
                  "
                >
                  {/* Overlay nền đen trượt */}
                  <span
                    className="
                      absolute inset-0
                      bg-black
                      -translate-x-full
                      transition-transform duration-500 ease-out
                      group-hover:translate-x-0
                    "
                  />

                  {/* Thanh nhấn bên trái (giữ nguyên, nhưng nổi trên nền) */}
                  <span
                    className="
                      absolute left-0 top-1/2 -translate-y-1/2
                      h-5 w-[3px]
                      rounded-full
                      bg-white

                      opacity-0 scale-y-0
                      transition-all duration-300
                      group-hover:opacity-100
                      group-hover:scale-y-100
                      z-10
                    "
                  />

                  {/* Text */}
                  <span
                    className="
                      relative z-10
                      transition-colors duration-500
                      group-hover:text-white
                    "
                  >
                    {item.title}
                  </span>
                </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>


      {/* ================= MAIN CONTENT ================= */}
     <main
        className="
          flex-1
          px-6
          pt-16          
          pb-24

          scroll-smooth
          transition-all duration-300

          lg:pl-[120px]
          lg:max-w-6xl
        "
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-10 text-center">
          {t("policy.title")}
        </h1>

        <div className="
          space-y-16
          text-gray-800
          leading-relaxed
          text-justify
          wrap-break-word
          hyphens-auto
          [&>section]:scroll-mt-28
        ">

          {/* 1 */}
          <section id="section-1" className="scroll-mt-28">
            <h2 className="text-2xl font-semibold mb-4">
              {t("policy.sections.1.title")}
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>{t("policy.sections.1.items.0.title")}:</strong> {t("policy.sections.1.items.0.content")}
              </li>
              <li>
                <strong>{t("policy.sections.1.items.1.title")}:</strong> {t("policy.sections.1.items.1.content")}
              </li>
              <li>
                <strong>{t("policy.sections.1.items.2.title")}:</strong> {t("policy.sections.1.items.2.content")}
              </li>
            </ul>
          </section>

          {/* 2 */}
          <section id="section-2" className="scroll-mt-28">
            <h2 className="text-2xl font-semibold mb-4">
                {t("policy.sections.2.title")}
            </h2>

            <ul className="list-disc pl-6 space-y-3">
                <li>
                <strong>{t("policy.sections.2.items.0.title")}:</strong> {t("policy.sections.2.items.0.content")}
                </li>

                <li>
                <strong>{t("policy.sections.2.items.1.title")}:</strong>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li>
                    <strong>{t("policy.sections.2.items.1.subitems.0.title")}:</strong> {t("policy.sections.2.items.1.subitems.0.content")}
                    </li>
                    <li>
                    <strong>{t("policy.sections.2.items.1.subitems.1.title")}:</strong> {t("policy.sections.2.items.1.subitems.1.content")}
                    </li>
                    <li>
                    <strong>{t("policy.sections.2.items.1.subitems.2.title")}:</strong> {t("policy.sections.2.items.1.subitems.2.content")}
                    </li>
                </ul>
                </li>

                <li>
                <strong>{t("policy.sections.2.items.2.title")}:</strong> {t("policy.sections.2.items.2.content")}
                </li>

                <li>
                <strong>{t("policy.sections.2.items.3.title")}:</strong> {t("policy.sections.2.items.3.content")}
                </li>
            </ul>
            </section>
          {/* 3 */}
          <section id="section-3" className="scroll-mt-28">
            <h2 className="text-2xl font-semibold mb-4">
                {t("policy.sections.3.title")}
            </h2>

            <ul className="list-disc pl-6 space-y-3">
                <li>
                <strong>{t("policy.sections.3.items.0.title")}:</strong> {t("policy.sections.3.items.0.content")}
                </li>

                <li>
                <strong>{t("policy.sections.3.items.1.title")}:</strong> {t("policy.sections.3.items.1.content")}
                </li>

                <li>
                <strong>{t("policy.sections.3.items.2.title")}:</strong> {t("policy.sections.3.items.2.content")}
                </li>

                <li>
                <strong>{t("policy.sections.3.items.3.title")}:</strong> {t("policy.sections.3.items.3.content")}
                </li>
            </ul>
        </section>

          {/* 4 */}
        <section id="section-4" className="scroll-mt-28">
            <h2 className="text-2xl font-semibold mb-4">
                {t("policy.sections.4.title")}
            </h2>

            <ul className="list-disc pl-6 space-y-3">
                <li>
                <strong>{t("policy.sections.4.items.0.title")}:</strong> {t("policy.sections.4.items.0.content")}
                </li>

                <li>
                <strong>{t("policy.sections.4.items.1.title")}:</strong> {t("policy.sections.4.items.1.content")}
                </li>

                <li>
                <strong>{t("policy.sections.4.items.2.title")}:</strong> {t("policy.sections.4.items.2.content")}
                </li>
            </ul>
        </section>
          {/* 5 */}
          <section id="section-5" className="scroll-mt-28">
            <h2 className="text-2xl font-semibold mb-4">
                {t("policy.sections.5.title")}
            </h2>

            <ul className="list-disc pl-6 space-y-3">
                <li>
                <strong>{t("policy.sections.5.items.0.title")}:</strong> {t("policy.sections.5.items.0.content")}
                </li>

                <li>
                <strong>{t("policy.sections.5.items.1.title")}:</strong>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li>
                    {t("policy.sections.5.items.1.subitems.0.content")}
                    </li>
                    <li>
                    {t("policy.sections.5.items.1.subitems.1.content")}
                    </li>
                </ul>
                </li>

                <li>
                <strong>{t("policy.sections.5.items.2.title")}:</strong> {t("policy.sections.5.items.2.content")}
                </li>
            </ul>
        </section>


          {/* 6 */}
          <section id="section-6" className="scroll-mt-28">
            <h2 className="text-2xl font-semibold mb-4">
                {t("policy.sections.6.title")}
            </h2>

            <ul className="list-disc pl-6 space-y-3">
                <li>
                <strong>{t("policy.sections.6.items.0.title")}:</strong> {t("policy.sections.6.items.0.content")}
                </li>

                <li>
                <strong>{t("policy.sections.6.items.1.title")}:</strong> {t("policy.sections.6.items.1.content")}
                </li>

                <li>
                <strong>{t("policy.sections.6.items.2.title")}:</strong> {t("policy.sections.6.items.2.content")}
                </li>

                <li>
                <strong>{t("policy.sections.6.items.3.title")}:</strong> {t("policy.sections.6.items.3.content")}
                </li>
            </ul>
        </section>

          {/* 7 */}
          <section id="section-7" className="scroll-mt-28">
            <h2 className="text-2xl font-semibold mb-4">
                {t("policy.sections.7.title")}
            </h2>

            <ul className="list-disc pl-6 space-y-3">
                <li>
                <strong>{t("policy.sections.7.items.0.title")}:</strong> {t("policy.sections.7.items.0.content")}
                </li>

                <li>
                <strong>{t("policy.sections.7.items.1.title")}:</strong> {t("policy.sections.7.items.1.content")}
                </li>

                <li>
                <strong>{t("policy.sections.7.items.2.title")}:</strong> {t("policy.sections.7.items.2.content")}
                </li>
            </ul>
        </section>

          {/* 8 */}
          <section id="section-8" className="scroll-mt-28">
            <h2 className="text-2xl font-semibold mb-4">
                {t("policy.sections.8.title")}
            </h2>

            <ul className="list-disc pl-6 space-y-3">
                <li>
                <strong>{t("policy.sections.8.items.0.title")}:</strong> {t("policy.sections.8.items.0.content")}
                </li>

                <li>
                <strong>{t("policy.sections.8.items.1.title")}:</strong> {t("policy.sections.8.items.1.content")}
                </li>

                <li>
                <strong>{t("policy.sections.8.items.2.title")}:</strong> {t("policy.sections.8.items.2.content")}
                </li>
            </ul>
        </section>


          {/* 9 */}
          <section id="section-9" className="scroll-mt-28">
            <h2 className="text-2xl font-semibold mb-4">
                {t("policy.sections.9.title")}
            </h2>

            <ul className="list-disc pl-6 space-y-3">
                <li>
                <strong>{t("policy.sections.9.items.0.title")}:</strong> {t("policy.sections.9.items.0.content")}
                </li>

                <li>
                <strong>{t("policy.sections.9.items.1.title")}:</strong> {t("policy.sections.9.items.1.content")}
                </li>
            </ul>
        </section>


          {/* 10 */}
          <section id="section-10" className="scroll-mt-28">
            <h2 className="text-2xl font-semibold mb-4">
                {t("policy.sections.10.title")}
            </h2>

            <ul className="list-disc pl-6 space-y-3">
                <li>
                <strong>{t("policy.sections.10.items.0.title")}:</strong> {t("policy.sections.10.items.0.content")}
                </li>

                <li>
                <strong>{t("policy.sections.10.items.1.title")}:</strong> {t("policy.sections.10.items.1.content")}
                </li>
            </ul>
        </section>


          {/* 11 */}
          <section id="section-11" className="scroll-mt-28">
            <h2 className="text-2xl font-semibold mb-4">
                {t("policy.sections.11.title")}
            </h2>

            <ul className="list-disc pl-6 space-y-3">
                <li>
                <strong>{t("policy.sections.11.items.0.title")}:</strong> {t("policy.sections.11.items.0.content")}
                </li>

                <li>
                <strong>{t("policy.sections.11.items.1.title")}:</strong> {t("policy.sections.11.items.1.content")}
                </li>
            </ul>
        </section>


          {/* 12 */}
          <section id="section-12" className="scroll-mt-28">
            <h2 className="text-2xl font-semibold mb-4">
                {t("policy.sections.12.title")}
            </h2>

            <p className="mb-3">
                {t("policy.sections.12.intro")}
            </p>

            <ul className="list-disc pl-6 space-y-2">
                <li>
                <strong>{t("policy.sections.12.items.0.title")}:</strong> {t("policy.sections.12.items.0.content")}
                </li>
                <li>
                <strong>{t("policy.sections.12.items.1.title")}:</strong> {t("policy.sections.12.items.1.content")}
                </li>
            </ul>
        </section>
        </div>
      </main>
    </div>
    <Footer />
    </>
  );
}
