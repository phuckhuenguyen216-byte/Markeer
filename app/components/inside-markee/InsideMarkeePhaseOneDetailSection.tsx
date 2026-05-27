"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2, Hotel, Map, Sparkles, Stethoscope } from "lucide-react";
import { useInsideMarkeeLocale } from "./useInsideMarkeeLocale";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] as const },
  viewport: { once: true, amount: 0.2 },
});

export default function InsideMarkeePhaseOneDetailSection() {
  const { tx } = useInsideMarkeeLocale();

  const coreDelivery = [
    tx("Website/landing page chuyển đổi tốt", "High-conversion websites and landing pages"),
    tx("Marketing execution đa kênh", "Multi-channel marketing execution"),
    tx("Automation cho inbox, follow-up, booking", "Automation for inbox, follow-up, and booking"),
    tx("Báo cáo rõ và tối ưu theo dữ liệu thật", "Clear reporting and optimization from real data"),
  ];

  const segmentCards = [
    {
      title: tx("Homestay & khách sạn nhỏ", "Homestay & small hotels"),
      image: "/8.1.png",
      Icon: Hotel,
    },
    {
      title: tx("Tour & dịch vụ du lịch", "Tours & hospitality services"),
      image: "/8.2.png",
      Icon: Map,
    },
    {
      title: tx("Spa / clinic / SMEs tương tự", "Spa / clinic / similar SMEs"),
      image: "/8.3.png",
      Icon: Stethoscope,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-white py-24 sm:py-28 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(180,24,40,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(180,24,40,0.055)_1px,transparent_1px)] bg-[size:60px_60px]" />
      <div className="pointer-events-none absolute left-[-10rem] top-[14%] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(255,77,77,0.16)_0%,rgba(255,255,255,0)_72%)] blur-3xl" />

      <div className="relative mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <motion.p {...fadeUp(0)} className="mk-eyebrow text-[#5f1a22] uppercase">
          {tx("05 · Phase 1 chi tiết", "05 · Phase 1 details")}
        </motion.p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <motion.article
            {...fadeUp(0.05)}
            className="relative overflow-hidden rounded-[32px] bg-[linear-gradient(165deg,#fff8fb_0%,#ffffff_58%,#fff7fa_100%)] p-6 shadow-[0_28px_72px_-50px_rgba(15,23,42,0.56)] sm:p-8"
          >
            <div className="pointer-events-none absolute right-[-6rem] top-[-4rem] h-[15rem] w-[15rem] rounded-full bg-[radial-gradient(circle,rgba(255,77,95,0.14)_0%,rgba(255,255,255,0)_72%)] blur-2xl" />

            <h2 className="mk-section-title">
              <span className="block text-[#321017]">{tx("PHASE 1 LÀ", "PHASE 1 IS")}</span>
              <span className="mk-section-title-accent block bg-gradient-to-r from-[#ff3f57] via-[#ff4d5f] to-[#ff748f] bg-clip-text text-transparent">
                {tx("SERVICE-FIRST", "SERVICE-FIRST")}
              </span>
              <span className="block text-[#321017]">{tx("VÀ KẾT QUẢ-TRƯỚC.", "AND OUTCOME-FIRST.")}</span>
            </h2>

            <p className="mt-4 max-w-[680px] text-[1.02rem] leading-8 text-[#5f1a22]/80 sm:text-[1.1rem]">
              {tx(
                "Markee bán một team growth + công nghệ cùng vận hành với doanh nghiệp, không bán một tool tự chạy.",
                "Markee sells a growth + technology team operating with the business, not a self-running tool."
              )}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {coreDelivery.map((item) => (
                <p
                  key={item}
                  className="flex items-start gap-3 rounded-2xl bg-white/85 px-4 py-3 text-sm leading-6 text-[#5f1a22]/82 shadow-[0_10px_24px_-20px_rgba(15,23,42,0.42)] sm:text-base sm:leading-7"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#ff4d5f]" />
                  {item}
                </p>
              ))}
            </div>

            <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#fff2f6] px-4 py-2 text-sm font-medium text-[#7f2b3a]">
              <Sparkles className="h-4 w-4 text-[#ff4d5f]" />
              {tx(
                "Mục tiêu: học nhanh từ client thật để build hệ thống đúng.",
                "Goal: learn fast from real clients to build the right system."
              )}
            </p>
          </motion.article>

          <motion.article
            {...fadeUp(0.1)}
            className="relative rounded-[32px] bg-white p-4 shadow-[0_26px_62px_-44px_rgba(15,23,42,0.55)] sm:p-5"
          >
            <div className="relative -mt-8 ml-auto h-[360px] w-[95%] overflow-hidden rounded-[26px] sm:h-[420px]">
              <Image src="/5.1.png" alt="Phase 1 service execution visual" fill className="object-cover" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,13,18,0.04)_0%,rgba(14,13,18,0.46)_100%)]" />
            </div>
            <div className="px-2 pb-2 pt-5 sm:px-3">
              <p className="text-xs font-semibold tracking-[0.14em] text-[#ff4d4d] uppercase">{tx("Core message", "Core message")}</p>
              <p className="mt-2 text-[1.05rem] leading-8 text-[#5f1a22]/84 sm:text-[1.12rem]">
                {tx(
                  "Đội ngũ Markee + AI làm cho bạn, để kết quả đến nhanh hơn và ổn định hơn.",
                  "Markee team + AI works for you, so outcomes arrive faster and stay stable."
                )}
              </p>
            </div>
          </motion.article>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {segmentCards.map((segment, index) => {
            const Icon = segment.Icon;
            return (
              <motion.article
                key={segment.title}
                {...fadeUp(0.16 + index * 0.04)}
                className="group relative overflow-hidden rounded-[26px]"
              >
                <div className="relative h-[230px] w-full">
                  <Image
                    src={segment.image}
                    alt={segment.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,13,18,0.08)_25%,rgba(14,13,18,0.58)_100%)]" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                  <p className="inline-flex items-center gap-2 rounded-full bg-white/86 px-3 py-1.5 text-xs font-semibold tracking-[0.09em] text-[#ff4d4d] uppercase backdrop-blur">
                    <Icon className="h-3.5 w-3.5" />
                    {tx("Segment", "Segment")}
                  </p>
                  <p className="mt-2 text-[1.1rem] leading-7 font-semibold text-white sm:text-[1.2rem]">{segment.title}</p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

