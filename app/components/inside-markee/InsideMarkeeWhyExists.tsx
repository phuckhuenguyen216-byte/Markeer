"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Dot, Sparkles } from "lucide-react";
import { useInsideMarkeeLocale } from "./useInsideMarkeeLocale";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] as const },
  viewport: { once: true, amount: 0.2 },
});

const orbitDots = [
  "left-[10%] top-[22%]",
  "left-[22%] top-[10%]",
  "left-[82%] top-[18%]",
  "left-[90%] top-[38%]",
  "left-[16%] top-[76%]",
  "left-[78%] top-[82%]",
];

export default function InsideMarkeeWhyExists() {
  const { tx } = useInsideMarkeeLocale();

  const notLabels = [
    tx("Không chỉ là công ty AI", "Not only an AI company"),
    tx("Không chỉ là agency marketing", "Not only a marketing agency"),
    tx("Không chỉ là công ty bảo mật", "Not only a security company"),
  ];

  const keyPoints = [
    tx("Một hệ sinh thái, một hướng đi.", "One ecosystem, one direction."),
    tx("Bán kết quả, không bán công nghệ.", "Sell outcomes, not technology."),
    tx("Mỗi chapter dưới đây là một layer của hệ thống.", "Each chapter below is one layer of the system."),
  ];

  return (
    <section className="relative overflow-hidden bg-[#fffafb] py-20 sm:py-24 lg:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,92,118,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,92,118,0.045)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_22%,rgba(255,77,95,0.13)_0%,rgba(255,255,255,0)_36%),radial-gradient(circle_at_84%_18%,rgba(255,77,95,0.15)_0%,rgba(255,255,255,0)_34%)]" />

      <div className="relative mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <motion.p {...fadeUp(0)} className="mk-eyebrow text-[#0b1020]/80 uppercase">
          {tx("01 · Lời mở đầu", "01 · Opening")}
        </motion.p>

        <div className="mt-8 grid items-center gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10">
          <motion.article
            {...fadeUp(0.05)}
            className="rounded-[30px] bg-white/72 p-7 shadow-[0_24px_66px_-44px_rgba(15,23,42,0.54)] backdrop-blur-md sm:p-9"
          >
            <h2 className="mk-section-title max-w-[760px] text-[#2b0f1d]">
              <span className="block">{tx("CHÚNG TA ĐANG BUILD", "WE ARE BUILDING")}</span>
              <span className="block">{tx("MỘT HỆ SINH THÁI", "AN ECOSYSTEM")}</span>
              <span className="mk-section-title-accent block bg-gradient-to-r from-[#ff3f57] via-[#ff4d5f] to-[#ff7692] bg-clip-text text-transparent">
                {tx("TĂNG TRƯỞNG.", "FOR GROWTH.")}
              </span>
            </h2>

            <p className="mt-5 max-w-[700px] text-[1.02rem] leading-7 text-[#2d0d18]/78 sm:text-[1.12rem] sm:leading-8">
              {tx(
                "Markee kết hợp AI, automation, marketing, công nghệ và cộng đồng để giúp doanh nghiệp Việt Nam tăng trưởng bền hơn và vận hành nhẹ hơn.",
                "Markee combines AI, automation, marketing, technology, and community so Vietnamese businesses can grow more sustainably and operate with less friction."
              )}
            </p>

            <div className="mt-5 flex flex-wrap gap-2.5">
              {notLabels.map((item) => (
                <p
                  key={item}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#fff4f7] px-3.5 py-1.5 text-sm font-medium text-[#7d2534]"
                >
                  <Dot className="h-4 w-4 text-[#ff4d5f]" />
                  {item}
                </p>
              ))}
            </div>
          </motion.article>

          <motion.article {...fadeUp(0.1)} className="relative overflow-visible rounded-[30px]">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6.2, ease: "easeInOut", repeat: Infinity }}
              className="relative rounded-[30px] bg-white/76 p-4 shadow-[0_34px_80px_-46px_rgba(255,77,95,0.55)] backdrop-blur-md"
            >
              <div className="pointer-events-none absolute -inset-6 rounded-[36px] bg-[radial-gradient(circle,rgba(255,77,95,0.15)_0%,rgba(255,255,255,0)_64%)]" />
              <div className="relative">
                <div className="absolute inset-0 rounded-[24px] bg-[radial-gradient(circle_at_54%_36%,rgba(255,77,95,0.18)_0%,rgba(255,255,255,0)_68%)]" />
                <Image src="/bannerinside.png" alt="Inside Markee overview" width={1200} height={760} className="relative h-auto w-full rounded-[24px]" />
              </div>
            </motion.div>

            {orbitDots.map((cls, index) => (
              <motion.span
                key={cls}
                className={`pointer-events-none absolute ${cls} h-2 w-2 rounded-full bg-[#ff728a]/80`}
                animate={{ y: [0, -7, 0], opacity: [0.35, 0.9, 0.35] }}
                transition={{ duration: 2.8 + index * 0.22, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}

            <div className="mt-4 space-y-2.5 rounded-[24px] bg-white/78 p-5 shadow-[0_22px_52px_-42px_rgba(15,23,42,0.56)] backdrop-blur-md">
              {keyPoints.map((point) => (
                <p key={point} className="flex items-start gap-2.5 text-sm leading-6 text-[#2d0d18]/78 sm:text-base sm:leading-7">
                  <Sparkles className="mt-1 h-3.5 w-3.5 shrink-0 text-[#ff4d5f]" />
                  {point}
                </p>
              ))}
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
