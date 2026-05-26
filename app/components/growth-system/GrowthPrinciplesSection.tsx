"use client";

import GrowthSectionTitle from "./GrowthSectionTitle";
import { useGrowthLocale } from "./useGrowthLocale";

export default function GrowthPrinciplesSection() {
  const { tx } = useGrowthLocale();

  const principles = [
    tx("NIỀM TIN > HÀO NHOÁNG", "TRUST > HYPE"),
    tx("HỆ THỐNG > HỖN LOẠN", "SYSTEMS > CHAOS"),
    tx("DÀI HẠN > NGẮN HẠN", "LONG-TERM > SHORT-TERM"),
    tx("THỰC TẾ > CHỈ SỐ ẢO", "REALITY > VANITY METRICS"),
    tx("QUAN HỆ > SPAM", "RELATIONSHIPS > SPAM"),
    tx("BẰNG CHỨNG > HỨA HẸN", "PROOF > PROMISES"),
  ];

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <GrowthSectionTitle label={tx("NGUYÊN TẮC TĂNG TRƯỞNG", "GROWTH PRINCIPLES")} title={tx("NHỮNG NGUYÊN TẮC MÀ HỆ SINH THÁI TĂNG TRƯỞNG LUÔN GIỮ.", "THE PRINCIPLES THE GROWTH ECOSYSTEM ALWAYS HOLDS.")} />

        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((item) => (
            <div key={item} className="rounded-[20px] border border-[#ffdce4] bg-white px-4 py-4 text-lg font-bold tracking-[-0.01em] text-[#2b0f1d]">
              {item}
            </div>
          ))}
        </div>

        <p className="mt-6 rounded-[22px] border border-[#ffdbe3] bg-[#2b0f1d] px-5 py-4 text-xl font-bold text-[#ffe5eb] sm:text-2xl">
          “{tx("NIỀM TIN TÍCH LŨY NHANH HƠN HÀO NHOÁNG.", "TRUST COMPOUNDS FASTER THAN HYPE.")}”
        </p>
      </div>
    </section>
  );
}
