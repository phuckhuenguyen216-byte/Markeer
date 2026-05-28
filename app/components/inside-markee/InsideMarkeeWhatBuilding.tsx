"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Quote, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { useInsideMarkeeLocale } from "./useInsideMarkeeLocale";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] as const },
  viewport: { once: true, amount: 0.22 },
});

type BrandItem = {
  name: string;
  logo: string;
  insightVi: string;
  insightEn: string;
  accent: string;
};

const brands: BrandItem[] = [
  {
    name: "Shopee",
    logo: "/shoppelogo.jpg",
    insightVi: "Bán trải nghiệm mua nhanh hơn.",
    insightEn: "Sells a faster buying experience.",
    accent: "border-[#fb923c]/60",
  },
  {
    name: "Grab",
    logo: "/grablogo.png",
    insightVi: "Bán việc di chuyển dễ hơn.",
    insightEn: "Sells easier mobility.",
    accent: "border-[#22c55e]/55",
  },
  {
    name: "MoMo",
    logo: "/momologo.png",
    insightVi: "Bán việc thanh toán tiện hơn.",
    insightEn: "Sells easier cashless payments.",
    accent: "border-[#d946ef]/55",
  },
];

export default function InsideMarkeeWhatBuilding() {
  const { tx } = useInsideMarkeeLocale();



  return (
    <section className="relative overflow-hidden bg-[#fff2f6] py-20 sm:py-24 lg:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_12%,rgba(255,77,95,0.22)_0%,rgba(255,255,255,0)_34%),radial-gradient(circle_at_84%_78%,rgba(255,77,95,0.18)_0%,rgba(255,255,255,0)_40%)]" />

      <div className="relative mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <motion.p {...fadeUp(0)} className="mk-eyebrow text-[#7f1d35] uppercase">
          {tx("02 · Câu chuyện của mình", "02 · Our story")}
        </motion.p>

        <div className="mt-8 grid gap-7 xl:grid-cols-2 xl:items-stretch">
          <motion.article
            {...fadeUp(0.06)}
            className="relative h-full overflow-hidden rounded-[32px] border border-[#ffb8c8] bg-[linear-gradient(155deg,#3a0f1f_0%,#55172d_48%,#7a1c3e_100%)] p-6 text-white shadow-[0_34px_90px_-46px_rgba(127,29,53,0.75)] sm:p-8"
          >
            <div className="pointer-events-none absolute -right-20 top-8 h-52 w-52 rounded-full bg-[#ff7b95]/40 blur-3xl" />
            <div className="pointer-events-none absolute -left-20 bottom-[-3.5rem] h-44 w-44 rounded-full bg-[#ff5170]/35 blur-3xl" />

            <h2 className="mk-section-title relative uppercase">
              <span className="block">{tx("CHÚNG TA ĐANG XÂY GÌ?", "WHAT ARE WE BUILDING?")}</span>
              <span className="mk-section-title-accent block bg-gradient-to-r from-[#ffd2dc] via-[#ffffff] to-[#ffd2dc] bg-clip-text text-transparent">
                {tx("BÁN KẾT QUẢ, KHÔNG BÁN TOOL.", "SELL OUTCOMES, NOT TOOLS.")}
              </span>
            </h2>

            <p className="relative mt-5 max-w-[780px] text-[1.03rem] leading-8 text-white/84 sm:text-[1.12rem]">
              {tx(
                "Shopee, Grab, MoMo đều không bán tính năng thuần. Họ bán một trạng thái tốt hơn cho người dùng. Markee cũng vậy: AI và automation chỉ là công cụ phía sau.",
                "Shopee, Grab, and MoMo do not sell raw features. They sell a better end state for users. Markee does the same: AI and automation are the engine behind it."
              )}
            </p>

            <div className="relative mt-6 grid gap-2.5 sm:grid-cols-3">
              {brands.map((brand, index) => (
                <motion.div
                  key={brand.name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.1 + index * 0.08 }}
                  viewport={{ once: true, amount: 0.35 }}
                  className={`rounded-2xl border ${brand.accent} bg-white/95 p-3 text-[#1f2937]`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="relative h-7 w-7 overflow-hidden rounded-full">
                      <Image
                        src={brand.logo}
                        alt={brand.name}
                        fill
                        className={`object-cover ${
                          brand.name === "Grab" ? "scale-[1.35] blur-[0.45px]" : ""
                        }`}
                      />
                    </span>
                    <p className="text-sm font-semibold">{brand.name}</p>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-[#4b5563]">{tx(brand.insightVi, brand.insightEn)}</p>
                </motion.div>
              ))}
            </div>


          </motion.article>

          <div className="flex flex-col gap-4 h-full">
            <motion.article
              {...fadeUp(0.1)}
              className="relative overflow-hidden rounded-[30px] border border-[#ffd0da] bg-white/95 p-3 shadow-[0_30px_80px_-44px_rgba(255,77,95,0.52)] sm:p-4"
            >
              <div className="pointer-events-none absolute -inset-6 rounded-[34px] bg-[radial-gradient(circle,rgba(255,77,95,0.22)_0%,rgba(255,255,255,0)_66%)]" />
              <motion.div
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
                className="relative aspect-[20/11] overflow-hidden rounded-[22px]"
              >
                <Image
                  src="/banners3.png"
                  alt={tx("Bản đồ chuyển đổi từ công cụ sang kết quả", "Outcome-oriented transformation map")}
                  fill
                  className="object-cover object-[center_18%]"
                  sizes="(min-width: 1280px) 38vw, (min-width: 768px) 45vw, 100vw"
                />
              </motion.div>
            </motion.article>

            <motion.article
              {...fadeUp(0.14)}
              className="flex-1 rounded-[26px] border border-[#ffc7d3] bg-white p-5 shadow-[0_22px_46px_-28px_rgba(255,77,95,0.42)]"
            >
              <p className="text-xs font-semibold tracking-[0.11em] text-[#9f1239] uppercase">{tx("Sứ mệnh", "Mission")}</p>
              <p className="mt-2 flex items-start gap-2.5 text-[1rem] leading-7 font-semibold text-[#4c1d2f] sm:text-[1.08rem]">
                <Quote className="mt-1 h-4 w-4 shrink-0 text-[#ff4d5f]" />
                {tx(
                  "Giúp doanh nghiệp Việt Nam tăng trưởng doanh thu và vận hành nhẹ nhàng hơn, bằng AI và tự động hóa thực chiến.",
                  "Help Vietnamese businesses grow revenue and operate more smoothly through practical AI and automation."
                )}
              </p>

              <div className="mt-4 flex flex-wrap gap-2.5">
                <OutcomeChip>{tx("Thực chiến", "Practical execution")}</OutcomeChip>
                <OutcomeChip>{tx("Đo được kết quả", "Measurable outcomes")}</OutcomeChip>
                <OutcomeChip>{tx("Client thấy lợi sớm", "Early visible value")}</OutcomeChip>
              </div>
            </motion.article>
          </div>
        </div>
      </div>
    </section>
  );
}

function OutcomeChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-sm font-medium text-[#9f1239]">
      <ArrowRight className="h-3.5 w-3.5 text-[#ff4d5f]" />
      {children}
    </span>
  );
}
