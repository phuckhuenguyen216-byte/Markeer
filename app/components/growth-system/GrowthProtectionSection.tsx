"use client";

import { motion } from "framer-motion";
import { useGrowthLocale } from "./useGrowthLocale";

const slam = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.58, delay, ease: [0.22, 1, 0.36, 1] as const },
  viewport: { once: true, amount: 0.25 },
});

export default function GrowthProtectionSection() {
  const { tx } = useGrowthLocale();

  const principles = [
    {
      headA: "DELIVERY",
      headB: "OVER HYPE",
      textVi: "Nếu growth kéo team vào overload, hệ thống phải giảm nhịp để bảo toàn chất lượng bàn giao.",
      textEn: "If growth drives overload, the system must slow down to protect delivery quality.",
    },
    {
      headA: "RETENTION",
      headB: "OVER VANITY",
      textVi: "Không chase số đẹp nếu churn âm thầm tăng ở phía sau.",
      textEn: "Do not chase pretty numbers while hidden churn rises behind them.",
    },
    {
      headA: "TRUST",
      headB: "OVER SPEED",
      textVi: "Không hứa điều hệ thống chưa làm được chỉ để đóng deal nhanh.",
      textEn: "Never promise what the system cannot deliver just to close faster.",
    },
  ];

  const rules = [
    tx("Lead phải có CRM entry mới hợp lệ.", "Lead is valid only with CRM entry."),
    tx("Closer có quyền reject và phải ghi rõ lý do.", "Closer can reject and must document reasons."),
    tx("Commission chỉ unlock khi đủ điều kiện vận hành.", "Commission unlocks only with operating eligibility."),
    tx("Growth Support cần xác nhận đóng góp trực tiếp.", "Growth Support needs direct contribution confirmation."),
    tx("Core job trước, growth sau.", "Core job first, growth second."),
  ];

  return (
    <section className="relative overflow-hidden py-20 sm:py-24 lg:py-28">
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,77,95,0.25)_0%,rgba(12,7,16,0)_44%),linear-gradient(180deg,#140b18_0%,#120b16_55%,#1a0f22_100%)]"
        animate={{ opacity: [0.9, 1, 0.9] }}
        transition={{ duration: 7.2, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,130,150,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,130,150,0.08)_1px,transparent_1px)] bg-[size:68px_68px]" />

      <div className="relative mx-auto max-w-[1320px] px-4 text-white sm:px-6 lg:px-8">
        <motion.div {...slam(0)} className="mx-auto max-w-[980px] text-center">
          <p className="mk-eyebrow text-[#ff95a8] uppercase">
            {tx("06 · Quan trọng — Đọc kỹ", "06 · Important — Read carefully")}
          </p>
          <h2 className="mk-section-title mt-4 uppercase">
            <span className="block text-white">{tx("GROWTH TỐT KHÔNG ĐƯỢC PHÁ", "GOOD GROWTH MUST NOT BREAK")}</span>
            <span className="mk-section-title-accent block bg-gradient-to-r from-[#ff627a] via-[#ff4d5f] to-[#ff9cae] bg-clip-text text-transparent">
              {tx("HỆ THỐNG CORE.", "THE CORE SYSTEM.")}
            </span>
          </h2>
        </motion.div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.03fr_0.97fr] lg:items-start">
          <motion.article {...slam(0.08)} className="space-y-4">
            {principles.map((item, index) => (
              <motion.article
                key={item.headA}
                animate={{ boxShadow: ["0 14px 34px -24px rgba(255,77,95,0.34)", "0 22px 44px -24px rgba(255,77,95,0.5)", "0 14px 34px -24px rgba(255,77,95,0.34)"] }}
                transition={{ duration: 3.4 + index * 0.25, repeat: Infinity, ease: "easeInOut" }}
                className="relative overflow-hidden rounded-[24px] bg-white/8 px-5 py-5 backdrop-blur-[2px] sm:px-6"
              >
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute -left-[46%] -top-[80%] h-[240%] w-[36%] rotate-[28deg] bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,88,112,0.42)_52%,rgba(255,255,255,0)_100%)]"
                  animate={{ x: ["0%", "310%"], y: ["0%", "180%"] }}
                  transition={{ duration: 3.4, delay: index * 0.22, repeat: Infinity, ease: "linear" }}
                />
                <p className="text-[1.22rem] leading-[1.08] font-black tracking-[-0.02em] uppercase sm:text-[1.45rem]">
                  <span className="block text-white">{item.headA}</span>
                  <span className="block bg-gradient-to-r from-[#ff627a] via-[#ff4d5f] to-[#ff9cae] bg-clip-text text-transparent">{item.headB}</span>
                </p>
                <p className="mt-2 text-sm leading-7 text-white/82 sm:text-base sm:leading-8">{tx(item.textVi, item.textEn)}</p>
              </motion.article>
            ))}
          </motion.article>

          <motion.article {...slam(0.14)} className="rounded-[30px] bg-[#2b0f1d] p-6 shadow-[0_30px_72px_-48px_rgba(0,0,0,0.82)] sm:p-8">
            <p className="text-xs font-semibold tracking-[0.14em] text-[#ff95a8] uppercase">
              {tx("5 rules không vi phạm", "5 non-negotiable rules")}
            </p>
            <div className="mt-5 space-y-3">
              {rules.map((rule, index) => (
                <p key={rule} className="flex gap-3 text-sm leading-6 text-white/88 sm:text-base sm:leading-7">
                  <span className="mt-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white/12 text-xs font-semibold">
                    {index + 1}
                  </span>
                  <span>{rule}</span>
                </p>
              ))}
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
