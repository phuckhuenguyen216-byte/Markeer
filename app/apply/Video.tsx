import React from "react";
import { useTranslation } from "react-i18next";

const videos = [
  {
    key: "policy",
    videoUrl:
      "https://drive.google.com/file/d/1sMfeCbWkSmx6w1Uaa9gj2eY48e-l_P60/preview",
  },
  {
    key: "kpi",
    videoUrl:
      "https://drive.google.com/file/d/1Wvb5Z6mVSx8OoZwMw6E9Tgc7PEesemPG/preview",
  },
];

export default function VideoGuide() {
  const { t, i18n } = useTranslation();

  const openVideo = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <div className="py-12">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Switch language */}
        <div className="flex justify-end mb-4 gap-2">
          <button
            onClick={() => i18n.changeLanguage("vi")}
            className="px-2 py-1 rounded hover:bg-red-100"
          >
            🇻🇳
          </button>
          <button
            onClick={() => i18n.changeLanguage("en")}
            className="px-2 py-1 rounded hover:bg-red-100"
          >
            🇺🇸
          </button>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-red-600 mb-2">
          📺 {t("videoGuide.title")}
        </h1>

        <p className="text-center text-red-400 mb-10">
          {t("videoGuide.description")}
        </p>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {videos.map((item) => (
            <div
              key={item.key}
              className="group bg-white rounded-2xl overflow-hidden border border-red-100 
              shadow-md transition-all duration-300
              hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-200"
            >
              {/* Thumbnail */}
              <div className="h-64 bg-gradient-to-r from-red-200 to-red-100 flex items-center justify-center">
                <button
                  onClick={() => openVideo(item.videoUrl)}
                  className="bg-white p-5 rounded-full shadow-md 
                  transition-all duration-300 
                  group-hover:scale-110 animate-pulse"
                >
                  ▶
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <span className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded-full">
                  {t(`videoGuide.videos.${item.key}.tag`)}
                </span>

                <h2 className="mt-4 font-semibold text-lg text-gray-800">
                  {t(`videoGuide.videos.${item.key}.title`)}
                </h2>

                <p className="text-gray-500 text-sm mt-2">
                  {t(`videoGuide.videos.${item.key}.desc`)}
                </p>

                {/* Button animated */}
                <button
                  onClick={() => openVideo(item.videoUrl)}
                  className="relative mt-5 px-6 py-2 rounded-lg text-white font-medium overflow-hidden
                  bg-gradient-to-r from-red-500 via-red-400 to-red-500
                  bg-[length:200%_100%]
                  animate-[gradientMove_3s_linear_infinite]
                  hover:scale-105 transition-transform duration-300"
                >
                  <span className="relative z-10">
                    {t("videoGuide.watchVideo")}
                  </span>

                  {/* shine */}
                  <span className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition"></span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Animation */}
      <style>
        {`
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
          }
        `}
      </style>
    </div>
  );
}