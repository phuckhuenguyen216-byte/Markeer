"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap, Target, ShieldCheck } from "lucide-react";
import { useGrowthLocale } from "./useGrowthLocale";

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.58, delay, ease: [0.22, 1, 0.36, 1] as const },
  viewport: { once: true, amount: 0.15 },
});

export default function GrowthFinalSection() {
  const { tx } = useGrowthLocale();

  const rules = [
    { icon: Zap, text: tx("Làm tốt công việc chính trước.", "Do core work well first.") },
    { icon: Target, text: tx("Submit lead chi tiết, có pain thật.", "Submit detailed leads with real pain.") },
    { icon: ShieldCheck, text: tx("Content thật + lead thật = growth thật.", "Real content + real leads = real growth.") }
  ];

  return (
    <section className="relative overflow-hidden border-t border-[#ffe0e8] bg-[linear-gradient(180deg,#fffafb_0%,#ffffff_100%)] py-20 sm:py-28">
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(255,77,95,0.12)_0%,rgba(255,255,255,0)_60%)]"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-[1120px] px-4 sm:px-6 lg:px-8">
        <motion.div {...rise(0)} className="text-center">
          <p className="mk-eyebrow text-[#ff4d5f] uppercase tracking-widest">{tx("TỔNG KẾT", "SUMMARY")}</p>
          <h2 className="mk-section-title mx-auto mt-4 max-w-[760px] uppercase text-[#0b1020]">
            <span className="block">{tx("NHỚ 3 ĐIỀU NÀY", "REMEMBER THESE 3")}</span>
            <span className="block bg-gradient-to-r from-[#ff3f57] via-[#ff4d5f] to-[#ff7b94] bg-clip-text text-transparent">
              {tx("ĐỂ BẮT ĐẦU ĐÚNG.", "TO START RIGHT.")}
            </span>
          </h2>
        </motion.div>

        <motion.div {...rise(0.1)} className="mx-auto mt-12 grid w-full max-w-[1150px] gap-5 lg:grid-cols-3">
          {rules.map((rule, idx) => {
             const Icon = rule.icon;
             return (
               <div key={idx} className="flex flex-col items-center text-center rounded-[28px] bg-white border border-[#ffe0e8] px-3 py-6 shadow-[0_20px_40px_-15px_rgba(255,77,95,0.08)] transition-transform hover:-translate-y-1">
                 <div className="w-14 h-14 rounded-2xl bg-[#fff5f7] border border-[#ffe0e8] flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6 text-[#ff4d5f]" />
                 </div>
                 <p className="text-[1.02rem] text-[#2b0f1d] font-bold lg:whitespace-nowrap">{rule.text}</p>
               </div>
             )
          })}
        </motion.div>

        <motion.div {...rise(0.2)} className="mx-auto mt-16 max-w-[840px] text-center">
          <p className="text-[1.2rem] leading-[1.4] font-medium text-[#7f2b3a] sm:text-[1.35rem]">
            {tx("Growth tốt không làm team rối hơn.", "Good growth does not make teams chaotic.")} <br className="hidden sm:block" />
            <strong className="text-[#ff4d5f] font-black">{tx("Growth tốt làm hệ thống mạnh hơn.", "Good growth makes systems stronger.")}</strong>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
