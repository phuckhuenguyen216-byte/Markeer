"use client";

import Image from "next/image";
import { ArrowRight, CirclePlay, Sparkles } from "lucide-react";
import { useGrowthLocale } from "./useGrowthLocale";

export default function GrowthHeroSection() {
  const { tx } = useGrowthLocale();

  const chips = [
    tx("hạ tầng", "infrastructure"),
    tx("hệ sinh thái", "ecosystem"),
    tx("lớp vận hành", "operations layer"),
    tx("lớp thông minh", "intelligence layer"),
    tx("động cơ tăng trưởng", "growth engine"),
  ];

  return (
    <section className="relative overflow-hidden border-b border-[#ffdbe3] bg-[radial-gradient(circle_at_12%_10%,rgba(255,77,95,0.2)_0%,rgba(255,255,255,0)_42%),radial-gradient(circle_at_86%_0%,rgba(59,130,246,0.18)_0%,rgba(255,255,255,0)_36%),linear-gradient(160deg,#fff5f8_0%,#ffffff_48%,#fff9fb_100%)] py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8">
        <p className="inline-flex items-center gap-2 rounded-full border border-[#ffd4dd] bg-white/95 px-4 py-2 text-xs font-semibold tracking-[0.16em] text-[#ff4d5f] uppercase">
          <Sparkles className="h-3.5 w-3.5" /> {tx("Hệ thống tăng trưởng · Lớp vận hành nội bộ · V1", "Growth system · Internal operations layer · V1")}
        </p>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[0.98fr_1.02fr]">
          <div>
            <h1 className="text-[2.45rem] leading-[1.03] font-black tracking-[-0.035em] text-[#0b1020] uppercase sm:text-[3.5rem] lg:text-[4.35rem]">
              <span className="block">{tx("MARKEE KHÔNG CHẠY TIẾP THỊ.", "MARKEE DOES NOT JUST DO MARKETING.")}</span>
              <span className="block text-[#ff4d5f]">{tx("MARKEE XÂY HỆ THỐNG TĂNG TRƯỞNG.", "MARKEE BUILDS GROWTH SYSTEMS.")}</span>
            </h1>

            <p className="mt-6 max-w-[760px] text-lg leading-8 text-[#0b1020]/82 sm:text-xl sm:leading-9">
              {tx(
                "Khi nội dung, hệ thống, tự động hóa và quan hệ bắt đầu kết nối với nhau, tăng trưởng không còn là chiến dịch mà trở thành một lớp vận hành.",
                "When content, systems, automation, and relationships start connecting, growth is no longer a campaign but an operating layer."
              )}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              {chips.map((item) => (
                <span key={item} className="rounded-full border border-[#ffd6de] bg-white px-3 py-1.5 text-sm font-semibold text-[#0b1020]/82">
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-2xl border border-[#ff6f86] bg-[#ff4d5f] px-6 py-3 text-base font-semibold text-white shadow-[0_18px_34px_-20px_rgba(255,77,95,0.6)] transition hover:translate-y-[-1px]"
              >
                {tx("Khám phá hệ thống", "Explore the system")} <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-2xl border border-[#d8deec] bg-white px-6 py-3 text-base font-semibold text-[#0b1020] transition hover:border-[#c8d0e4]"
              >
                {tx("Xem luồng hệ sinh thái", "View ecosystem flow")} <CirclePlay className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-5 text-base text-[#0b1020]/72">
              {tx(
                "Không phải trang giới thiệu dịch vụ. Đây là lớp hạ tầng tăng trưởng của hệ sinh thái.",
                "This is not a service intro page. This is the growth infrastructure layer of the ecosystem."
              )}
            </p>
          </div>

          <article className="relative overflow-hidden rounded-[32px] border border-[#ffd9e2] bg-white/92 p-3 shadow-[0_24px_56px_-42px_rgba(15,23,42,0.58)] sm:p-4">
            <div className="relative aspect-[1.08/1] overflow-hidden rounded-[24px] border border-[#ffe1e8]">
              <Image src="/bannergrowth.png" alt={tx("Mô tả hệ sinh thái tăng trưởng", "Growth ecosystem overview")} fill className="object-cover object-center" priority />
            </div>
          </article>
        </div>

        <div className="mt-8 rounded-[24px] border border-[#ffd8e1] bg-[#2b0f1d] p-5 text-[#ffdce4] sm:p-6">
          <p className="text-xs font-semibold tracking-[0.18em] text-[#ff4d5f] uppercase">{tx("TƯ DUY GIAI ĐOẠN 1", "PHASE 1 MINDSET")}</p>
          <p className="mt-2 text-lg font-bold text-white sm:text-xl">
            {tx(
              "Markee không xây công ty để chạy quảng cáo. Markee xây hạ tầng để hệ thống tạo tăng trưởng bền vững.",
              "Markee is not building a company to run ads. Markee is building infrastructure for sustainable system growth."
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
