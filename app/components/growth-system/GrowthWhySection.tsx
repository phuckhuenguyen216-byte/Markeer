"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useGrowthLocale } from "./useGrowthLocale";

const chapterReveal = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] as const },
  viewport: { once: true, amount: 0.25 },
});

export default function GrowthWhySection() {
  const { tx } = useGrowthLocale();

  const layers = [
    {
      layer: "Layer 1",
      nameVi: "Core Job",
      nameEn: "Core Job",
      textVi: "Bắt buộc và ưu tiên số 1. Core yếu thì growth chỉ là ảo giác.",
      textEn: "Mandatory and priority #1. Weak core makes growth an illusion.",
    },
    {
      layer: "Layer 2",
      nameVi: "Growth Expansion",
      nameEn: "Growth Expansion",
      textVi: "Optional nhưng có thưởng rõ. Đóng góp thật thì thu nhập tăng thật.",
      textEn: "Optional but reward-based. Real contribution creates real upside.",
    },
    {
      layer: "Layer 3",
      nameVi: "Leader & Culture",
      nameEn: "Leader & Culture",
      textVi: "Mentor, chia sẻ và nâng cấp hệ thống để team scale không vỡ nhịp.",
      textEn: "Mentor, share, and upgrade systems so scaling does not break rhythm.",
    },
  ];

  return (
    <section className="relative overflow-hidden py-18 sm:py-22 lg:py-26">
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_14%,rgba(255,77,95,0.12)_0%,rgba(255,255,255,0)_42%)]"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
          <motion.article {...chapterReveal(0)} className="lg:pt-4">
            <p className="mk-eyebrow text-[#ff4d5f] uppercase">
              {tx("01 · Đọc cái này trước tất cả", "01 · Read this before all")}
            </p>

            <h2 className="mk-section-title mt-4 uppercase">
              <span className="block text-[#0b1020]">{tx("GROWTH KHÔNG PHẢI", "GROWTH IS NOT")}</span>
              <span className="block text-[#0b1020]">{tx("VIỆC CỦA RIÊNG SALES.", "A SALES-ONLY JOB.")}</span>
              <span className="mk-section-title-accent block bg-gradient-to-r from-[#ff3f57] via-[#ff4d5f] to-[#ff7c95] bg-clip-text text-transparent">
                {tx("GROWTH LÀ HỆ THỐNG", "GROWTH IS AN")}
              </span>
              <span className="mk-section-title-accent block bg-gradient-to-r from-[#ff3f57] via-[#ff4d5f] to-[#ff7c95] bg-clip-text text-transparent">
                {tx("CỦA CẢ TEAM.", "ALL-TEAM SYSTEM.")}
              </span>
            </h2>

            <p className="mt-6 max-w-[760px] text-[1.04rem] leading-8 text-[#0b1020]/78 sm:text-[1.12rem]">
              {tx(
                "Đây là Growth System v1.0 cho Phase 1: làm tốt việc chính trước, mở rộng growth khi đủ lực, và giữ văn hóa để hệ thống đi đường dài.",
                "This is Growth System v1.0 for Phase 1: execute core work first, expand growth with real capacity, and protect culture for the long run."
              )}
            </p>

            <div className="mt-7 space-y-3 max-w-[720px]">
              {[
                tx("Core trước. Không core thì không growth bền.", "Core first. No core means no durable growth."),
                tx("Muốn kiếm thêm? Đóng góp growth có chất lượng.", "Want more upside? Contribute quality growth."),
                tx("Muốn team scale? Bắt đầu từ hệ thống và văn hóa.", "Want team scale? Start with systems and culture."),
              ].map((item) => (
                <p key={item} className="rounded-xl bg-white/78 px-4 py-3 text-sm leading-7 text-[#2b0f1d] shadow-[0_10px_28px_-24px_rgba(15,23,42,0.58)] sm:text-base">
                  {item}
                </p>
              ))}
            </div>
          </motion.article>

          <motion.article
            {...chapterReveal(0.08)}
            className="relative overflow-hidden rounded-[30px] bg-[linear-gradient(170deg,#ffffff_0%,#fff7fa_100%)] p-6 shadow-[0_26px_64px_-48px_rgba(15,23,42,0.58)] sm:p-7"
          >
            <motion.div
              className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(255,77,95,0.2)_0%,rgba(255,255,255,0)_70%)] blur-xl"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            />

            <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.15em] text-[#ff4d5f] uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              {tx("3-layer operating model", "3-layer operating model")}
            </p>

            <div className="mt-5 space-y-4">
              {layers.map((item, index) => (
                <motion.article
                  key={item.layer}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
                  viewport={{ once: true, amount: 0.2 }}
                  className="relative rounded-2xl bg-white/86 px-4 py-4 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.5)]"
                >
                  <p className="text-[11px] font-semibold tracking-[0.14em] text-[#ff4d5f] uppercase">{item.layer}</p>
                  <p className="mt-1 text-[1.05rem] font-bold text-[#2b0f1d]">{tx(item.nameVi, item.nameEn)}</p>
                  <p className="mt-1.5 text-sm leading-6 text-[#0b1020]/74 sm:text-base sm:leading-7">{tx(item.textVi, item.textEn)}</p>
                </motion.article>
              ))}
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
