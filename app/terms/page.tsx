"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Footer from "../components/Footer";
import ChatwootWidget from "../components/ChatwootWidget";
import { useTranslation, Trans } from "react-i18next";

export default function PrivacyPolicyPage() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const sections = [
    { id: "section-1", title: t("terms.sections.1.title") },
    { id: "section-2", title: t("terms.sections.2.title") },
    { id: "section-3", title: t("terms.sections.3.title") },
    { id: "section-4", title: t("terms.sections.4.title") },
    { id: "section-5", title: t("terms.sections.5.title") },
    { id: "section-6", title: t("terms.sections.6.title") },
    { id: "section-7", title: t("terms.sections.7.title") },
    { id: "section-8", title: t("terms.sections.8.title") },
    { id: "section-9", title: t("terms.sections.9.title") },
    { id: "section-10", title: t("terms.sections.10.title") },
    { id: "section-11", title: t("terms.sections.11.title") },
    { id: "section-12", title: t("terms.sections.12.title") },
    { id: "section-13", title: t("terms.sections.13.title") },
    { id: "section-14", title: t("terms.sections.14.title") },
    { id: "section-15", title: t("terms.sections.15.title") },
  ];

  return (
    <>
    <ChatwootWidget />
    <div className="relative lg:flex lg:gap-0">

      {/* ================= MOBILE TOC ================= */}
        <div className="lg:hidden">
        <aside
            className={`
            fixed top-16 left-0 z-50
            h-[calc(100dvh-4rem)]
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
                {t("terms.toc.title")}
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
            {t("terms.toc.title")}
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
          {t("terms.title")}
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
          <section id="section-1">
            <h2 className="text-2xl font-semibold mb-4">
                {t("terms.sections.1.title")}
            </h2>

            <p className="mb-4">
                {t("terms.sections.1.content1")}
            </p>

            <p>
                <Trans 
                  i18nKey="terms.sections.1.content2"
                  components={{
                    1: <a href="https://markeeai.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium hover:underline">https://markeeai.com/</a>
                  }}
                />
            </p>
            </section>


          {/* 2 */}
          <section id="section-2" >
            <h2 className="text-2xl font-semibold mb-4">
                {t("terms.sections.2.title")}
            </h2>

            <p>
                {t("terms.sections.2.content")}
            </p>
            </section>

          {/* 3 */}
          <section id="section-3">
                <h2 className="text-2xl font-semibold mb-4">
                    {t("terms.sections.3.title")}
                </h2>

                <p className="mb-4">
                    {t("terms.sections.3.content1")}
                </p>

                <p>
                    {t("terms.sections.3.content2")}
                </p>
            </section>

          {/* 4 */}
        <section id="section-4">
            <h2 className="text-2xl font-semibold mb-4">
                {t("terms.sections.4.title")}
            </h2>

            <p className="mb-3">
                {t("terms.sections.4.content1")}
            </p>

            <p>
                {t("terms.sections.4.content2")}
            </p>
        </section>

          {/* 5 */}
        <section id="section-5">
            <h2 className="text-2xl font-semibold mb-4">
                {t("terms.sections.5.title")}
            </h2>

            <div className="space-y-4 text-gray-800 leading-relaxed">
                <p>{t("terms.sections.5.items.0")}</p>
                <p>{t("terms.sections.5.items.1")}</p>
                <p>{t("terms.sections.5.items.2")}</p>
            </div>
        </section>

          {/* 6 */}
        <section id="section-6">
            <h2 className="text-2xl font-semibold mb-4">
                {t("terms.sections.6.title")}
            </h2>

            <div className="space-y-4 text-gray-800 leading-relaxed">
                <p>
                {t("terms.sections.6.intro")}
                </p>

                <p>
                {t("terms.sections.6.list_intro")}
                </p>

                <ul className="list-disc pl-6 space-y-2">
                <li>
                    {t("terms.sections.6.list_items.0")}
                </li>

                <li>
                    {t("terms.sections.6.list_items.1")}
                </li>

                <li>
                    {t("terms.sections.6.list_items.2")}
                </li>

                <li>
                    {t("terms.sections.6.list_items.3")}
                </li>
                </ul>

                <p>
                {t("terms.sections.6.outro")}
                </p>
            </div>
        </section>

          {/* 7 */}
        <section id="section-7">
            <h2 className="text-2xl font-semibold text-gray-900">
                {t("terms.sections.7.title")}
            </h2>

            <p className="text-gray-700 leading-relaxed">
                {t("terms.sections.7.items.0")}
            </p>

            <p className="text-gray-700 leading-relaxed">
                {t("terms.sections.7.items.1")}
            </p>

            <p className="text-gray-700 leading-relaxed">
                {t("terms.sections.7.items.2")}
            </p>
        </section>


          {/* 8 */}
          <section id="section-8">
            <h2 className="text-2xl font-semibold text-gray-900">
                {t("terms.sections.8.title")}
            </h2>

            <p className="text-gray-700 leading-relaxed">
                {t("terms.sections.8.items.0")}
            </p>

            <p className="text-gray-700 leading-relaxed">
                {t("terms.sections.8.items.1")}
            </p>
        </section>

          {/* 9 */}
          <section id="section-9">
            <h2 className="text-2xl font-semibold text-gray-900">
                {t("terms.sections.9.title")}
            </h2>

            <p className="text-gray-700 leading-relaxed">
                {t("terms.sections.9.items.0")}
            </p>

            <p className="text-gray-700 leading-relaxed">
                {t("terms.sections.9.items.1")}
            </p>
        </section>

          {/* 10 */}
         <section id="section-10">
            <h2 className="text-2xl font-semibold text-gray-900">
                {t("terms.sections.10.title")}
            </h2>

            <p className="text-gray-700 leading-relaxed">
                {t("terms.sections.10.intro")}
            </p>

            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>
                {t("terms.sections.10.list_items.0")}
                </li>
                <li>
                {t("terms.sections.10.list_items.1")}
                </li>
                <li>
                {t("terms.sections.10.list_items.2")}
                </li>
            </ul>

            <p className="text-gray-700 leading-relaxed">
                {t("terms.sections.10.outro")}
            </p>
        </section>

          {/* 11 */}
          <section id="section-11">
            <h2 className="text-2xl font-semibold text-gray-900">
                {t("terms.sections.11.title")}
            </h2>

            <p className="text-gray-700 leading-relaxed">
                {t("terms.sections.11.intro")}
            </p>

            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>{t("terms.sections.11.list_items.0")}</li>
                <li>
                {t("terms.sections.11.list_items.1")}
                </li>
            </ul>

            <p className="text-gray-700 leading-relaxed">
                {t("terms.sections.11.outro")}
            </p>
        </section>

          {/* 12 */}
          <section id="section-12">
            <h2 className="text-2xl font-semibold text-gray-900">
                {t("terms.sections.12.title")}
            </h2>

            <p className="text-gray-700 leading-relaxed">
                {t("terms.sections.12.items.0")}
            </p>

            <p className="text-gray-700 leading-relaxed">
                {t("terms.sections.12.items.1")}
            </p>
        </section>

        <section id="section-13">
            <h2 className="text-2xl font-semibold text-gray-900">
                {t("terms.sections.13.title")}
            </h2>

            <p className="text-gray-700 leading-relaxed">
                {t("terms.sections.13.content")}
            </p>
        </section>

        <section id="section-14">
            <h2 className="text-2xl font-semibold text-gray-900">
                {t("terms.sections.14.title")}
            </h2>

            <p className="text-gray-700 leading-relaxed">
                {t("terms.sections.14.items.0")}
            </p>

            <p className="text-gray-700 leading-relaxed">
                {t("terms.sections.14.items.1")}
            </p>
        </section>

        <section id="section-15">
            <h2 className="text-2xl font-semibold text-gray-900">
                {t("terms.sections.15.title")}
            </h2>

            <p className="text-gray-700 leading-relaxed">
                <Trans 
                  i18nKey="terms.sections.15.content"
                  components={{
                    1: <a
                    href="https://markeeai.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-medium hover:underline"
                    >
                    https://markeeai.com/
                    </a>
                  }}
                />
            </p>
        </section>

        </div>
      </main>
    </div>
    <Footer />
    </>
  );
}
