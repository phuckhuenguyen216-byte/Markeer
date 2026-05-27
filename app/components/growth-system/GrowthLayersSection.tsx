"use client";

import { motion } from "framer-motion";
import { CalendarClock } from "lucide-react";
import { useGrowthLocale } from "./useGrowthLocale";

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.58, delay, ease: [0.22, 1, 0.36, 1] as const },
  viewport: { once: true, amount: 0.25 },
});

export default function GrowthLayersSection() {
  const { tx } = useGrowthLocale();

  const model = [
    {
      phaseVi: "Tháng 1",
      phaseEn: "Month 1",
      titleVi: "Build Habit",
      titleEn: "Build Habit",
      descVi: "Tạo nhịp submit và tracking ổn định trước.",
      descEn: "Establish stable submission and tracking rhythm first.",
    },
    {
      phaseVi: "Tháng 2+",
      phaseEn: "Month 2+",
      titleVi: "Quality Mode",
      titleEn: "Quality Mode",
      descVi: "Ưu tiên chất lượng lead/content thay vì spam volume.",
      descEn: "Prioritize lead/content quality over volume spam.",
    },
    {
      phaseVi: "Cuối tháng",
      phaseEn: "Month End",
      titleVi: "Verify & Reward",
      titleEn: "Verify & Reward",
      descVi: "Sales Lead verify, Finance payout theo điều kiện.",
      descEn: "Sales Lead verifies, Finance pays by eligibility.",
    },
  ];

  const weekly = [
    tx("Đầu tuần: chốt focus lane rõ ràng.", "Week start: set clear focus lane."),
    tx("Giữa tuần: log tín hiệu vào hệ thống.", "Mid-week: log signals into the system."),
    tx("Cuối tuần: review quality, chốt bài học.", "Week end: review quality and lock learnings."),
  ];

  return (
    <section className="relative overflow-hidden py-18 sm:py-22 lg:py-26">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,92,118,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,92,118,0.045)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-16 h-52 w-52 rounded-full bg-[radial-gradient(circle,rgba(255,77,95,0.24)_0%,rgba(255,255,255,0)_70%)] blur-2xl"
        animate={{ x: [0, 36, 0], y: [0, 24, 0], opacity: [0.35, 0.7, 0.35] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <motion.div {...rise(0)} className="max-w-[980px]">
          <p className="mk-eyebrow text-[#ff4d5f] uppercase">
            {tx("05 · Theo dõi & Tính thưởng", "05 · Tracking & Rewards")}
          </p>
          <h2 className="mk-section-title mt-4 uppercase">
            <span className="block text-[#0b1020]">{tx("ĐO CHẤT LƯỢNG TRƯỚC.", "MEASURE QUALITY FIRST.")}</span>
            <span className="mk-section-title-accent block bg-gradient-to-r from-[#ff3f57] via-[#ff4d5f] to-[#ff7b94] bg-clip-text text-transparent">
              {tx("ĐO TỐC ĐỘ SAU.", "THEN MEASURE SPEED.")}
            </span>
          </h2>
        </motion.div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.04fr_0.96fr] lg:items-start">
          <motion.article
            {...rise(0.08)}
            className="relative overflow-hidden rounded-[32px] bg-[linear-gradient(170deg,#ffffff_0%,#fff8fb_100%)] p-6 shadow-[0_30px_68px_-50px_rgba(15,23,42,0.56)] sm:p-8"
          >
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -left-[38%] top-0 h-full w-1/3 -skew-x-12 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,116,141,0.2)_50%,rgba(255,255,255,0)_100%)]"
              animate={{ x: ["0%", "420%"] }}
              transition={{ duration: 5.6, repeat: Infinity, ease: "linear" }}
            />
            <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-[#ff4d5f] uppercase">
              <CalendarClock className="h-3.5 w-3.5" />
              {tx("Monthly progression", "Monthly progression")}
            </p>

            <div className="mt-5 space-y-4">
              {model.map((item, index) => (
                <motion.article
                  key={item.phaseVi}
                  initial={{ opacity: 0, x: -14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.45, delay: 0.1 + index * 0.08 }}
                  viewport={{ once: true, amount: 0.2 }}
                  className="relative rounded-2xl bg-white px-4 py-4 shadow-[0_12px_30px_-22px_rgba(15,23,42,0.48)]"
                >
                  <p className="text-[11px] font-semibold tracking-[0.12em] text-[#ff4d5f] uppercase">{tx(item.phaseVi, item.phaseEn)}</p>
                  <p className="mt-1 text-[1.08rem] font-bold text-[#2b0f1d]">{tx(item.titleVi, item.titleEn)}</p>
                  <p className="mt-1.5 text-sm leading-6 text-[#0b1020]/74 sm:text-base sm:leading-7">{tx(item.descVi, item.descEn)}</p>
                </motion.article>
              ))}
            </div>
          </motion.article>

          <motion.article
            {...rise(0.14)}
            className="relative overflow-hidden rounded-[32px] bg-[#190f2a] p-6 text-[#dfe8ff] shadow-[0_30px_72px_-48px_rgba(25,15,42,0.8)] sm:p-8"
          >
            <motion.div
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(255,255,255,0.06)_50%,transparent_100%)]"
              animate={{ y: ["-100%", "100%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />

            <p className="text-xs font-semibold tracking-[0.14em] text-[#8fb6ff] uppercase">{tx("Weekly rhythm", "Weekly rhythm")}</p>

            <div className="relative mt-5 space-y-3">
              {weekly.map((item) => (
                <p key={item} className="rounded-xl bg-white/8 px-4 py-3 text-sm leading-6 sm:text-base sm:leading-7">
                  {item}
                </p>
              ))}
            </div>

            <p className="mt-6 text-sm leading-7 text-[#dfe8ff]/82 sm:text-base">
              {tx(
                "Mục tiêu không phải số đẹp ngắn hạn. Mục tiêu là nhịp tăng trưởng có thể lặp lại mà không làm team mệt rã.",
                "The goal is not short-term vanity metrics. The goal is repeatable growth rhythm without breaking the team."
              )}
            </p>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
