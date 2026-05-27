"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CircleDollarSign,
  Clock3,
  HandCoins,
  MessageSquareText,
  TrendingUp,
  UserCheck,
  Users,
  Wrench,
} from "lucide-react";
import { useGrowthLocale } from "./useGrowthLocale";

const fadeNarrative = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
  viewport: { once: true, amount: 0.22 },
});

export default function GrowthCommissionSection() {
  const { tx } = useGrowthLocale();

  const left = [
    { label: "Lead Owner", Icon: UserCheck },
    { label: "Closer", Icon: HandCoins },
    { label: "Delivery", Icon: Wrench },
    { label: "Growth Support", Icon: Users },
  ];

  const right = [
    { labelVi: "Deal chốt nhanh hơn", labelEn: "Faster closing", Icon: CircleDollarSign },
    { labelVi: "Onboard mượt hơn", labelEn: "Smoother onboarding", Icon: MessageSquareText },
    { labelVi: "Retention khỏe hơn", labelEn: "Stronger retention", Icon: Clock3 },
    { labelVi: "Thu nhập tăng rõ", labelEn: "Clear income upside", Icon: TrendingUp },
  ];

  return (
    <section className="relative overflow-hidden py-18 sm:py-22 lg:py-26">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_16%,rgba(66,126,255,0.1)_0%,rgba(255,255,255,0)_36%),radial-gradient(circle_at_78%_66%,rgba(255,77,95,0.1)_0%,rgba(255,255,255,0)_34%)]" />

      <div className="relative mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <motion.p {...fadeNarrative(0)} className="mk-eyebrow text-center text-[#ff4d5f] uppercase">
          {tx("02 · Thu nhập thêm", "02 · Extra income")}
        </motion.p>

        <motion.h2
          {...fadeNarrative(0.04)}
          className="mk-section-title mx-auto mt-4 max-w-[980px] text-center uppercase"
        >
          <span className="block text-[#0b1020]">{tx("ĐÓNG GÓP ĐÚNG CÁCH", "CONTRIBUTION DONE RIGHT")}</span>
          <span className="mk-section-title-accent block bg-gradient-to-r from-[#ff3f57] via-[#ff4d5f] to-[#ff7b94] bg-clip-text text-transparent">
            {tx("THÌ THU NHẬP TĂNG RÕ.", "CREATES CLEAR INCOME UPSIDE.")}
          </span>
        </motion.h2>

        <motion.p
          {...fadeNarrative(0.1)}
          className="mx-auto mt-5 max-w-[780px] text-center text-[1.03rem] leading-8 text-[#0b1020]/78 sm:text-[1.12rem]"
        >
          {tx(
            "Có hai nguồn độc lập: commission khi deal thành công, và KPI bonus theo chất lượng đóng góp hàng tháng. Kết quả thật có thể mở double reward.",
            "Two independent streams: commission on closed deals and KPI bonus from monthly quality contribution. Real outcomes can unlock double reward."
          )}
        </motion.p>

        <motion.article
          {...fadeNarrative(0.16)}
          className="relative mt-9 overflow-hidden rounded-[34px] bg-[linear-gradient(170deg,#fff8fb_0%,#ffffff_60%,#fff7fa_100%)] p-5 shadow-[0_34px_82px_-56px_rgba(15,23,42,0.6)] sm:p-8"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,77,95,0.16)_0%,rgba(255,255,255,0)_60%)]" />

          <div className="relative hidden h-[410px] lg:block">
            {left.map((item, index) => {
              const Icon = item.Icon;
              return (
                <motion.div
                  key={item.label}
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 4.8 + index * 0.25, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute left-4 z-20 flex min-w-[220px] items-center justify-between rounded-2xl bg-white/92 px-4 py-3 text-sm font-medium text-[#2b0f1d] shadow-[0_12px_28px_-20px_rgba(15,23,42,0.45)]"
                  style={{ top: `${34 + index * 84}px` }}
                >
                  <span>{item.label}</span>
                  <Icon className="h-4 w-4 text-[#ff4d5f]" />
                </motion.div>
              );
            })}

            {right.map((item, index) => {
              const Icon = item.Icon;
              return (
                <motion.div
                  key={item.labelVi}
                  animate={{ x: [0, -5, 0] }}
                  transition={{ duration: 4.8 + index * 0.25, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute right-4 z-20 flex min-w-[240px] items-center justify-between rounded-2xl bg-white/92 px-4 py-3 text-sm font-medium text-[#2b0f1d] shadow-[0_12px_28px_-20px_rgba(15,23,42,0.45)]"
                  style={{ top: `${34 + index * 84}px` }}
                >
                  <span>{tx(item.labelVi, item.labelEn)}</span>
                  <Icon className="h-4 w-4 text-[#ff4d5f]" />
                </motion.div>
              );
            })}

            <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
              {[18, 37, 56, 75].map((y) => (
                <path
                  key={y}
                  d={`M26 ${y} C40 ${y}, 43 50, 50 50 C57 50, 60 ${y}, 74 ${y}`}
                  stroke="rgba(255,77,95,0.24)"
                  strokeWidth="0.28"
                  fill="none"
                />
              ))}
            </svg>

            <div className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2">
              <motion.div
                animate={{ scale: [1, 1.07, 1], boxShadow: ["0 14px 34px -16px rgba(255,77,95,0.62)", "0 20px 44px -16px rgba(255,77,95,0.78)", "0 14px 34px -16px rgba(255,77,95,0.62)"] }}
                transition={{ duration: 3.1, repeat: Infinity, ease: "easeInOut" }}
                className="inline-flex h-24 w-24 items-center justify-center rounded-full border border-white/60 bg-white shadow-[0_18px_34px_-16px_rgba(255,77,95,0.72)]"
              >
                <Image src="/logo.png" alt="Markee Logo" width={62} height={62} className="h-14 w-14 object-contain" />
              </motion.div>
            </div>
          </div>

          <div className="relative z-20 grid gap-3 lg:hidden">
            {[...left.map((item) => item.label), ...right.map((item) => tx(item.labelVi, item.labelEn))].map((item) => (
              <p key={item} className="rounded-xl bg-white/92 px-4 py-3 text-sm text-[#2b0f1d] shadow-[0_12px_24px_-20px_rgba(15,23,42,0.5)]">
                {item}
              </p>
            ))}
          </div>
        </motion.article>

        <motion.p {...fadeNarrative(0.24)} className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#7f2b3a] sm:text-base">
          {tx("Không trả tiền cho noise. Trả tiền cho tác động.", "Do not reward noise. Reward impact.")}
          <ArrowRight className="h-3.5 w-3.5 text-[#ff4d5f]" />
        </motion.p>
      </div>
    </section>
  );
}
