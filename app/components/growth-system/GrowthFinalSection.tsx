"use client";

import { ArrowRight } from "lucide-react";
import { useGrowthLocale } from "./useGrowthLocale";

export default function GrowthFinalSection() {
  const { tx } = useGrowthLocale();

  const ctas = ["Contribute with clarity", "Grow with the system", "Build better together"];

  return (
    <section className="relative overflow-hidden border-t border-[#ffe1e8] bg-[linear-gradient(180deg,#fff9fb_0%,#fff5f8_100%)] py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,77,95,0.15)_0%,rgba(255,255,255,0)_42%)]" />

      <div className="relative mx-auto max-w-[1120px] px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="mk-eyebrow text-[#ff4d5f] uppercase">{tx("FINAL SECTION", "FINAL SECTION")}</p>
          <h2 className="mk-section-title mx-auto mt-3 max-w-[760px] uppercase">
            <span className="block text-[#0b1020]">{tx("NHỚ 3 ĐIỀU NÀY", "REMEMBER THESE 3")}</span>
            <span className="mk-section-title-accent block bg-gradient-to-r from-[#ff3f57] via-[#ff4d5f] to-[#ff7b94] bg-clip-text text-transparent">
              {tx("ĐỂ BẮT ĐẦU ĐÚNG.", "TO START RIGHT.")}
            </span>
          </h2>
        </div>

        <div className="mx-auto mt-8 max-w-[760px] space-y-3 text-center">
          <p className="text-[1.02rem] text-[#2b0f1d] sm:text-[1.08rem]">{tx("Làm tốt công việc chính trước.", "Do core work well first.")}</p>
          <p className="text-[1.02rem] text-[#2b0f1d] sm:text-[1.08rem]">{tx("Submit lead chi tiết, có pain thật.", "Submit detailed leads with real pain.")}</p>
          <p className="text-[1.02rem] text-[#2b0f1d] sm:text-[1.08rem]">{tx("Content thật + lead thật = growth thật.", "Real content + real leads = real growth.")}</p>
        </div>

        <p className="mx-auto mt-6 max-w-[840px] text-center text-[1.2rem] leading-[1.35] font-semibold tracking-[-0.02em] text-[#7f2b3a] sm:text-[1.45rem]">
          {tx("Growth tốt không làm team rối hơn. Growth tốt làm hệ thống mạnh hơn.", "Good growth does not make teams chaotic. Good growth makes systems stronger.")}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
          {ctas.map((cta) => (
            <span key={cta} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#2b0f1d] shadow-[0_10px_24px_-18px_rgba(15,23,42,0.42)]">
              {cta}
              <ArrowRight className="h-3.5 w-3.5 text-[#ff4d5f]" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
