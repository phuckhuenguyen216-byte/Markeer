"use client";

import { motion } from "framer-motion";
import { ArrowRight, BriefcaseBusiness, Handshake, TrendingUp } from "lucide-react";
import { useInsideMarkeeLocale } from "./useInsideMarkeeLocale";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] as const },
  viewport: { once: true, amount: 0.2 },
});

export default function InsideMarkeeFinalCtaSection() {
  const { tx } = useInsideMarkeeLocale();

  const ctas = [
    {
      titleVi: "Work with us",
      titleEn: "Work with us",
      textVi: "Dành cho doanh nghiệp muốn tăng trưởng thực tế bằng hệ thống.",
      textEn: "For businesses that want practical growth through systems.",
      Icon: BriefcaseBusiness,
    },
    {
      titleVi: "Build with us",
      titleEn: "Build with us",
      textVi: "Dành cho người thích tạo sản phẩm, quy trình và automation thật.",
      textEn: "For builders who love real products, workflows, and automation.",
      Icon: Handshake,
    },
    {
      titleVi: "Grow with us",
      titleEn: "Grow with us",
      textVi: "Dành cho đối tác và cộng đồng muốn đi đường dài cùng Markee.",
      textEn: "For partners and communities that want a long-term journey with Markee.",
      Icon: TrendingUp,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#fff9fb_100%)] py-24 sm:py-28 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,92,118,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,92,118,0.08)_1px,transparent_1px)] bg-[size:58px_58px]" />
      <div className="pointer-events-none absolute left-1/2 top-[-13rem] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,77,77,0.2)_0%,rgba(255,185,198,0.13)_38%,rgba(255,255,255,0)_78%)] blur-3xl" />

      <div className="relative mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
        <motion.p {...fadeUp(0)} className="mk-eyebrow text-center text-[#0b1020]/80 uppercase">
          {tx("Final · Closing Section", "Final · Closing Section")}
        </motion.p>

        <motion.div {...fadeUp(0.05)} className="mx-auto mt-7 max-w-[980px] text-center">
          <h2 className="mk-section-title text-[#2d0d18]">
            {tx("Chúng tôi không chỉ xây một công ty.", "We are not just building a company.")}
            <br />
            <span className="mk-section-title-accent text-[#ff4d5f]">
              {tx("Chúng tôi đang xây một hệ sinh thái.", "We are building an ecosystem.")}
            </span>
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#2d0d18]/80">
            {tx(
              "Nơi công nghệ, con người và vận hành kết hợp để giúp doanh nghiệp Việt Nam phát triển tốt hơn.",
              "Where technology, people, and operations combine to help Vietnamese businesses grow better."
            )}
          </p>
        </motion.div>

        <div className="mt-9 grid gap-5 md:grid-cols-3">
          {ctas.map((card, index) => {
            const Icon = card.Icon;
            return (
              <motion.article key={card.titleVi} {...fadeUp(0.14 + index * 0.04)} className="rounded-[24px] border border-red-100/80 bg-white p-6 shadow-[0_16px_46px_-40px_rgba(15,23,42,0.6)]">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-red-100 bg-[#fff8fa] text-[#ff4d4d]">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-4 text-2xl font-bold tracking-[-0.02em] text-[#2d0d18]">{tx(card.titleVi, card.titleEn)}</p>
                <p className="mt-2 text-sm leading-6 text-[#2d0d18]/78 sm:text-base sm:leading-7">{tx(card.textVi, card.textEn)}</p>
                <div className="mt-5">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-red-200 text-[#ff4d4d]">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </motion.article>
            );
          })}
        </div>

        <motion.p
          {...fadeUp(0.28)}
          className="mt-8 text-center text-sm font-semibold tracking-[0.14em] text-[#7f2b3a] uppercase sm:text-base"
        >
          {tx(
            "Một hệ sinh thái. Một nhịp vận hành. Một đà tăng trưởng tích lũy.",
            "One ecosystem. One operating rhythm. One compounding growth momentum."
          )}
        </motion.p>
      </div>
    </section>
  );
}
