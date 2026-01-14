import React from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import "../i18n";

export default function RegistrationForm() {
  const { t } = useTranslation("common");
  return (
    <section id="registration-form" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-6 tracking-tight">
          {t("registration.title")}
        </h2>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          {t("registration.description")}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="https://app.markeeai.com"
            target="_blank"
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold text-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            {t("registration.primary")}
          </Link>
          <Link
             href="https://app.markeeai.com"
             target="_blank"
             className="w-full sm:w-auto px-8 py-4 bg-white text-gray-800 border border-gray-200 rounded-full font-bold text-lg hover:bg-gray-50 transition-all duration-300"
          >
            {t("registration.secondary")}
          </Link>
        </div>
      </div>
    </section>
  );
}
