"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, CirclePlay, Sparkles } from "lucide-react";
import { useGrowthLocale } from "./useGrowthLocale";

const lineReveal = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
  viewport: { once: true, amount: 0.4 },
});

const orbitDots = [
  "left-[8%] top-[18%]",
  "left-[20%] top-[10%]",
  "left-[84%] top-[20%]",
  "right-[8%] top-[42%]",
  "left-[12%] bottom-[18%]",
  "right-[18%] bottom-[14%]",
];

export default function GrowthHeroSection() {
  const { tx } = useGrowthLocale();

  return (
    <section className="relative overflow-hidden border-b border-[#ffe0e8] bg-[linear-gradient(160deg,#fff6fa_0%,#ffffff_42%,#fff8fb_100%)] py-16 sm:py-20 lg:py-32">
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(255,77,95,0.2)_0%,rgba(255,255,255,0)_42%),radial-gradient(circle_at_86%_10%,rgba(66,126,255,0.18)_0%,rgba(255,255,255,0)_38%)]"
        animate={{ opacity: [0.9, 1, 0.9] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {orbitDots.map((cls, index) => (
        <motion.span
          key={cls}
          className={`pointer-events-none absolute ${cls} h-1.5 w-1.5 rounded-full bg-[#ff7f95]/80`}
          animate={{ y: [0, -6, 0], opacity: [0.3, 0.9, 0.3] }}
          transition={{ duration: 2.7 + index * 0.2, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <div className="relative mx-auto max-w-[1360px] px-5 sm:px-6 lg:px-8">
        <p className="mk-eyebrow inline-flex items-center gap-2 rounded-full border border-[#ffd4dd] bg-white/90 px-4 py-2 text-[#ff4d5f] uppercase">
          <Sparkles className="h-3.5 w-3.5" />
          {tx("Growth System · Operating Story · V1", "Growth System · Operating Story · V1")}
        </p>

        <div className="mt-8 grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <motion.h1
              {...lineReveal(0.02)}
              className="mk-title-hero max-w-[21rem] uppercase sm:max-w-[780px]"
            >
              <span className="block text-[#0b1020]">{tx("KHÔNG PHẢI MỘT", "NOT A SINGLE")}</span>
              <span className="block text-[#0b1020]">{tx("CHIẾN DỊCH -", "CAMPAIGN -")}</span>
              <span className="mk-section-title-accent block bg-gradient-to-r from-[#ff3f57] via-[#ff4d5f] to-[#ff7b94] bg-clip-text text-transparent">
                {tx("LÀ MỘT HỆ VẬN", "IT IS A GROWTH")}
              </span>
              <span className="mk-section-title-accent block bg-gradient-to-r from-[#ff3f57] via-[#ff4d5f] to-[#ff7b94] bg-clip-text text-transparent">
                {tx("HÀNH TĂNG TRƯỞNG.", "OPERATING SYSTEM.")}
              </span>
            </motion.h1>

            <motion.p
              {...lineReveal(0.12)}
              className="mt-6 max-w-[700px] text-[1.05rem] leading-8 text-[#0b1020]/80 sm:text-[1.18rem] sm:leading-9"
            >
              {tx(
                "Khi content, automation, CRM và delivery cùng chạy theo một nhịp, growth không còn là campaign. Growth trở thành lớp vận hành của cả team.",
                "When content, automation, CRM, and delivery run in one rhythm, growth is no longer a campaign. It becomes an operating layer for the whole team."
              )}
            </motion.p>

            <motion.div {...lineReveal(0.2)} className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ff4d5f] px-6 py-3 text-base font-semibold text-white shadow-[0_18px_34px_-20px_rgba(255,77,95,0.62)] transition hover:-translate-y-0.5 sm:w-auto"
              >
                {tx("Khám phá hệ thống", "Explore the system")}
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[#d8deec] bg-white px-6 py-3 text-base font-semibold text-[#0b1020] transition hover:border-[#c8d0e4] sm:w-auto"
              >
                {tx("Xem flow chapter", "View chapter flow")}
                <CirclePlay className="h-4 w-4" />
              </button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, amount: 0.35 }}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div className="pointer-events-none absolute -inset-6 rounded-[36px] bg-[radial-gradient(circle,rgba(255,77,95,0.22)_0%,rgba(255,255,255,0)_66%)] blur-xl" />
              <Image
                src="/bannergrowth.png"
                alt={tx("Mô tả hệ sinh thái tăng trưởng", "Growth ecosystem overview")}
                width={1500}
                height={1180}
                priority
                className="relative h-auto w-full rounded-[30px] object-contain drop-shadow-[0_34px_76px_rgba(15,23,42,0.28)]"
              />
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          {...lineReveal(0.28)}
          className="mt-9 rounded-[24px] bg-[#220c18] px-5 py-5 text-[#ffdce4] shadow-[0_24px_52px_-34px_rgba(34,12,24,0.72)] sm:px-6"
        >
          <p className="text-xs font-semibold tracking-[0.16em] text-[#ff7f95] uppercase">{tx("Mindset", "Mindset")}</p>
          <p className="mt-2 text-lg font-semibold leading-8 text-white sm:text-xl">
            {tx(
              "Core trước, growth sau. Nhưng khi hệ thống đủ khỏe, growth sẽ khuếch đại toàn bộ năng lực team.",
              "Core first, growth second. But once the system is healthy, growth amplifies the whole team's capability."
            )}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
