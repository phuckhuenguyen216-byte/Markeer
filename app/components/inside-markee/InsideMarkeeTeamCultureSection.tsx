"use client";

import { motion } from "framer-motion";
import { useInsideMarkeeLocale } from "./useInsideMarkeeLocale";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] as const },
  viewport: { once: true, amount: 0.2 },
});

export default function InsideMarkeeTeamCultureSection() {
  const { tx } = useInsideMarkeeLocale();

  const principles = [
    {
      titleA: "EXECUTION",
      titleB: "OVER NOISE",
      textVi: "Ít khẩu hiệu, nhiều kết quả thật. Mỗi quyết định phải đi về hành động đo được.",
      textEn: "Less slogans, more real outcomes. Every decision must convert into measurable action.",
    },
    {
      titleA: "SYSTEMS",
      titleB: "OVER CHAOS",
      textVi: "Không chạy theo việc rời rạc. Chuẩn hóa quy trình để tăng tốc mà không vỡ delivery.",
      textEn: "No scattered execution. Standardize workflows to speed up without breaking delivery.",
    },
    {
      titleA: "OWNERSHIP",
      titleB: "OVER EXCUSES",
      textVi: "Chạm vào vấn đề là cùng chịu trách nhiệm đưa nó về trạng thái tốt hơn.",
      textEn: "Whoever touches the problem co-owns improving its state.",
    },
    {
      titleA: "LONG-TERM TRUST",
      titleB: "OVER HYPE",
      textVi: "Không đánh đổi uy tín dài hạn lấy lợi ích ngắn hạn. Trust là tài sản lõi của ecosystem.",
      textEn: "Never trade long-term credibility for short-term hype. Trust is core ecosystem capital.",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#120d14] py-24 sm:py-28 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(255,102,128,0.26)_0%,rgba(18,13,20,0)_42%),linear-gradient(to_right,rgba(255,144,165,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,144,165,0.06)_1px,transparent_1px)] bg-[size:auto,64px_64px,64px_64px]" />
      <div className="pointer-events-none absolute left-1/2 top-[18%] h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,77,95,0.2)_0%,rgba(18,13,20,0)_72%)] blur-3xl" />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[32%] h-px bg-gradient-to-r from-transparent via-[#ff7b95]/70 to-transparent"
        animate={{ opacity: [0.2, 0.8, 0.2] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-0 h-full w-[28rem] -skew-x-12 bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,157,177,0.24)_48%,rgba(255,255,255,0)_100%)] blur-2xl"
        animate={{ x: ["-40vw", "120vw"] }}
        transition={{ duration: 6.2, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <motion.p {...fadeUp(0)} className="mk-eyebrow text-center text-white/70 uppercase">
          {tx("07 · Văn hóa team", "07 · Team culture")}
        </motion.p>

        <motion.div {...fadeUp(0.05)} className="mx-auto mt-7 max-w-[880px] text-center">
          <h2 className="mk-section-title">
            <span className="block text-white">{tx("ĐÂY LÀ CÁCH ECOSYSTEM", "THIS IS HOW THE ECOSYSTEM")}</span>
            <span className="mk-section-title-accent block bg-gradient-to-r from-[#ff627a] via-[#ff4d5f] to-[#ff9cae] bg-clip-text text-transparent">
              {tx("VẬN HÀNH VÀ RA QUYẾT ĐỊNH", "OPERATES AND DECIDES")}
            </span>
          </h2>
          <div className="mx-auto mt-4 max-w-[1180px] overflow-visible">
            <p className="text-center text-[0.9rem] leading-7 text-white/80 sm:text-[0.96rem] lg:text-[1rem]">
              {tx(
                "Văn hóa không phải poster giá trị. Văn hóa là bộ lọc chiến lược giúp team scale có kỷ luật và giữ trust dài hạn.",
                "Culture is not a values poster. It is the strategic filter that keeps scaling disciplined and trust durable."
              )}
            </p>
          </div>
        </motion.div>

        <div className="mt-10 space-y-6">
          {principles.map((item, index) => (
            <motion.article
              key={item.titleA}
              {...fadeUp(0.1 + index * 0.06)}
              whileHover={{ y: -6 }}
              className="rounded-[28px] bg-white/[0.03] px-5 py-6 backdrop-blur-[2px] shadow-[0_18px_44px_-30px_rgba(0,0,0,0.6)] sm:px-8 sm:py-8"
            >
              <p className="text-[1.18rem] leading-[1.1] font-black tracking-[-0.014em] sm:text-[1.7rem] lg:text-[2rem]">
                <span className="block text-white">{item.titleA}</span>
                <span className="mk-section-title-accent block bg-gradient-to-r from-[#ff627a] via-[#ff4d5f] to-[#ff9cae] bg-clip-text text-transparent">
                  {item.titleB}
                </span>
              </p>
              <p className="mt-3 max-w-[880px] text-sm leading-7 text-white/78 sm:text-base sm:leading-8">
                {tx(item.textVi, item.textEn)}
              </p>
            </motion.article>
          ))}
        </div>

        <motion.div {...fadeUp(0.38)} className="mt-6">
          <p className="mx-auto max-w-[1220px] text-center text-[0.9rem] font-semibold text-white/92 sm:text-[0.98rem] lg:text-[1.03rem]">
            {tx(
              "Team mạnh không phải team ồn ào. Team mạnh là team ra quyết định đúng, vận hành chắc, và đi đường dài cùng nhau.",
              "Strong teams are not noisy teams. Strong teams make better decisions, operate with discipline, and build for the long run."
            )}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
