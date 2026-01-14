"use client"
import React from "react";
import { useTranslation } from "react-i18next";
import "../i18n";

type FeatureItem = {
  title: string;
  description: string;
  icon: string;
};

type FeatureGroup = {
  group: string;
  items: FeatureItem[];
};

export default function FeaturesSection() {
  const { t } = useTranslation("common");
  const rawFeatures = t("features.groups", {
    returnObjects: true,
  }) as unknown;
  const features: FeatureGroup[] = Array.isArray(rawFeatures)
    ? (rawFeatures as FeatureGroup[])
    : [];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t("features.title")}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("features.description")}
          </p>
        </div>

        <div className="space-y-16">
          {features.map((group, groupIndex) => (
            <div key={groupIndex}>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {group.group}
                </h3>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
              </div>

              <div className={`grid grid-cols-1 md:grid-cols-${group.items.length > 2 ? '3' : '2'} gap-6`}>
                {group.items.map((feature, index) => (
                  <div 
                    key={index}
                    className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl">
                          {feature.icon}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-900 mb-3">
                          {feature.title}
                        </h4>
                        <p className="text-gray-600 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t("features.ctaTitle")}
            </h3>
            <p className="text-lg text-gray-700">
              {t("features.ctaDescription")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
