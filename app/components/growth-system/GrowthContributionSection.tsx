"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useGrowthLocale } from "./useGrowthLocale";

const entry = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.58, delay, ease: [0.22, 1, 0.36, 1] as const },
  viewport: { once: true, amount: 0.25 },
});

export default function GrowthContributionSection() {
  const { tx } = useGrowthLocale();
  const [activeGate, setActiveGate] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveGate((prev) => (prev + 1) % 5);
    }, 3000);
    return () => window.clearInterval(timer);
  }, []);

  const gates = [
    tx("Pain rõ và đo được", "Clear measurable pain"),
    tx("Có ngân sách thực tế", "Realistic budget"),
    tx("Có decision maker tham gia", "Decision maker involved"),
    tx("Có upsell potential", "Upsell potential"),
    tx("Có thể làm case study", "Case-study potential"),
  ];

  const redFlags = [
    tx("Pain mơ hồ, chỉ nói chung chung.", "Vague pain with generic requests."),
    tx("Kỳ vọng lớn nhưng không có ngân sách rõ.", "Big expectations without clear budget."),
    tx("One-time scope, không có đường dài.", "One-time scope with no long-term path."),
  ];

  return (
    <section className="relative overflow-hidden py-18 sm:py-22 lg:py-26">
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,77,95,0.11)_0%,rgba(255,255,255,0)_38%)]"
        animate={{ opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <motion.p {...entry(0)} className="mk-eyebrow text-center text-[#ff4d5f] uppercase">
          {tx("04 · Customer Quality Filter", "04 · Customer Quality Filter")}
        </motion.p>

        <motion.h2
          {...entry(0.05)}
          className="mk-section-title mx-auto mt-4 max-w-[980px] text-center uppercase"
        >
          <span className="block text-[#0b1020]">{tx("KHÔNG PHẢI KHÁCH NÀO CŨNG NÊN NHẬN.", "NOT EVERY CUSTOMER SHOULD BE TAKEN.")}</span>
          <span className="mk-section-title-accent block bg-gradient-to-r from-[#ff3f57] via-[#ff4d5f] to-[#ff7c95] bg-clip-text text-transparent">
            {tx("ĐẦU VÀO SAI LÀ DELIVERY SẼ VỠ.", "BAD INPUT BREAKS DELIVERY.")}
          </span>
        </motion.h2>

        <motion.p
          {...entry(0.1)}
          className="mx-auto mt-5 max-w-[980px] text-center text-[1.02rem] leading-8 text-[#0b1020]/76 sm:text-[1.1rem]"
        >
          {tx(
            "Lọc đúng từ đầu để giữ chất lượng delivery, giữ nhịp vận hành và giữ trust dài hạn.",
            "Filter right from the start to protect delivery quality, operating rhythm, and long-term trust."
          )}
        </motion.p>

        <motion.article
          {...entry(0.16)}
          className="mt-8 rounded-[32px] bg-[linear-gradient(170deg,#fff8fb_0%,#ffffff_100%)] p-6 shadow-[0_30px_72px_-52px_rgba(15,23,42,0.6)] sm:p-8"
        >
          <p className="text-xs font-semibold tracking-[0.14em] text-[#ff4d5f] uppercase">{tx("5 quality gates", "5 quality gates")}</p>

          <div className="relative mt-6 hidden lg:block">
            <div className="grid grid-cols-5 gap-3">
              {gates.map((gate, index) => {
                const isActive = activeGate === index;
                return (
                  <motion.div
                    key={gate}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.42, delay: 0.12 + index * 0.05 }}
                    viewport={{ once: true, amount: 0.2 }}
                    className={`rounded-2xl border px-3 py-4 text-center text-sm font-medium transition-all duration-700 ${
                      isActive
                        ? "border-[#ff5f78] bg-[#fff4f7] text-[#2b0f1d] shadow-[0_18px_34px_-20px_rgba(255,77,95,0.7)]"
                        : "border-[#eadde1] bg-[#fbf8f9] text-[#6e6168] shadow-[0_10px_22px_-20px_rgba(15,23,42,0.4)]"
                    }`}
                  >
                    <p className={`${isActive ? "font-semibold" : "font-medium"}`}>{gate}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:hidden">
            {gates.map((gate, index) => {
              const isActive = activeGate === index;
              return (
                <motion.div
                  key={gate}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.42, delay: 0.12 + index * 0.05 }}
                  viewport={{ once: true, amount: 0.2 }}
                  className={`rounded-2xl border px-3 py-4 text-center text-sm transition-all duration-700 ${
                    isActive
                      ? "border-[#ff5f78] bg-[#fff4f7] font-semibold text-[#2b0f1d] shadow-[0_18px_34px_-20px_rgba(255,77,95,0.7)]"
                      : "border-[#eadde1] bg-[#fbf8f9] font-medium text-[#6e6168] shadow-[0_10px_22px_-20px_rgba(15,23,42,0.4)]"
                  }`}
                >
                  {gate}
                </motion.div>
              );
            })}
          </div>
          <p className="mt-5 text-sm leading-7 text-[#0b1020]/74 sm:text-base">
            {tx(
              "Đạt từ 3/5 gate trở lên thì submit cho closer review. Dưới mức đó: bổ sung context trước khi đẩy vào pipeline.",
              "Submit to closer review only when 3/5 gates are met. Below that threshold, add context before pipeline entry."
            )}
          </p>
        </motion.article>

        <motion.div {...entry(0.22)} className="mt-6 grid gap-4 md:grid-cols-3">
          {redFlags.map((flag, index) => (
            <motion.article
              key={flag}
              animate={{ boxShadow: ["0 18px 38px -26px rgba(43,15,29,0.7)", "0 24px 46px -26px rgba(43,15,29,0.82)", "0 18px 38px -26px rgba(43,15,29,0.7)"] }}
              transition={{ duration: 3.2 + index * 0.25, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-2xl bg-[#2b0f1d] px-4 py-4 text-[#ffdce4]"
            >
              <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.12em] text-[#ff7f95] uppercase">
                <AlertTriangle className="h-3.5 w-3.5" />
                Red flag
              </p>
              <p className="mt-2 text-sm leading-6 sm:text-base sm:leading-7">{flag}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
