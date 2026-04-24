import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const videos = [
  {
    key: "policy",
    fileId: "1sMfeCbWkSmx6w1Uaa9gj2eY48e-l_P60",
  },
  {
    key: "kpi",
    fileId: "1Wvb5Z6mVSx8OoZwMw6E9Tgc7PEesemPG",
  },
];

export default function VideoGuide() {
  const { t } = useTranslation();
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <div className="py-12">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Title */}
        <h1 className="text-5xl font-bold text-center text-red-600 mb-2">
          📺 {t("videoGuide.title")}
        </h1>

        <p className="text-center text-gray-400 mb-10">
          {t("videoGuide.description")}
        </p>

        {/* 🔴 BUTTON TRÊN */}
        <div className="flex justify-center mb-12">
          <button
            className="relative px-8 py-3 rounded-xl text-white font-semibold overflow-hidden
            bg-gradient-to-r from-red-500 via-red-400 to-red-500
            bg-[length:200%_100%]
            animate-[gradientMove_3s_linear_infinite]
            shadow-lg hover:scale-105 transition"
          >
            <span className="relative z-10">
              🏢 {t("videoGuide.watchVideo")}
            </span>

            <span className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition"></span>
          </button>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-20">
          {videos.map((item) => (
            <div
              key={item.key}
              onClick={() =>
                setActiveVideo(
                  `https://drive.google.com/file/d/${item.fileId}/preview`
                )
              }
              className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-red-100 
              shadow-md transition-all duration-300
              hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-200"
            >
              {/* 🖼 Thumbnail thật */}
              <div className="h-90 relative overflow-hidden">
                <img
                  src={`https://drive.google.com/thumbnail?id=${item.fileId}`}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />

                {/* overlay */}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="bg-white p-4 rounded-full shadow-md group-hover:scale-110 transition">
                    ▶
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <span className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded-full">
                  {t(`videoGuide.videos.${item.key}.tag`)}
                </span>

                <h2 className="mt-4 font-semibold text-xl text-gray-800">
                  {t(`videoGuide.videos.${item.key}.title`)}
                </h2>

                <p className="text-gray-500 text-sm mt-3">
                  {t(`videoGuide.videos.${item.key}.desc`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🎬 MODAL FULLSCREEN */}
      {activeVideo && (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
          {/* Close */}
          <button
            onClick={() => setActiveVideo(null)}
            className="absolute top-5 right-5 text-white text-3xl hover:scale-110 transition"
          >
            ✕
          </button>

          {/* Video */}
          <iframe
            src={activeVideo}
            className="w-[90%] h-[90%]"
            allow="autoplay"
          />
        </div>
      )}

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