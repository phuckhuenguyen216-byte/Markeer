"use client";

import { CircleCheck, CircleX, Handshake, Sparkles } from "lucide-react";
import GrowthSectionTitle from "./GrowthSectionTitle";
import { useGrowthLocale } from "./useGrowthLocale";

export default function GrowthCultureSection() {
  const { tx } = useGrowthLocale();

  const expectations = [
    tx("ownership", "ownership"),
    tx("tư duy hệ thống", "systems thinking"),
    tx("rõ ràng", "clarity"),
    tx("thích nghi", "adaptability"),
    tx("sẵn sàng học", "learning mindset"),
  ];

  const recognized = [
    tx("mentor người mới onboard", "mentoring new onboard members"),
    tx("chia sẻ insight thật với team", "sharing real insights with the team"),
    tx("cải thiện SOP / quy trình", "improving SOP/workflows"),
    tx("support đồng nghiệp khi deadline gấp", "supporting teammates on urgent deadlines"),
  ];

  const notCounted = [
    tx("fake support để lấy điểm", "fake support for points"),
    tx("share session không ai cần", "sharing sessions nobody needs"),
    tx("hy sinh chất lượng để chạy KPI ảo", "sacrificing quality for vanity KPI"),
    tx("chạy reward bất chấp hệ thống", "chasing rewards while breaking systems"),
  ];

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <GrowthSectionTitle label={tx("VĂN HÓA VÀ KỲ VỌNG", "CULTURE & EXPECTATIONS")} title={tx("ĐIỀU HỆ SINH THÁI THẬT SỰ KỲ VỌNG.", "WHAT THE ECOSYSTEM TRULY EXPECTS.")} />

        <div className="mt-7 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <article className="rounded-[24px] border border-[#ffdbe3] bg-white p-6">
            <p className="text-base leading-7 text-[#0b1020]/78">
              {tx("Không ai cần biết tất cả hoặc hoàn hảo. Nhưng hệ sinh thái coi trọng ownership và tư duy hệ thống.", "No one needs to know everything or be perfect. But the ecosystem values ownership and systems thinking.")}
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {expectations.map((item, index) => (
                <div key={item} style={{ animationDelay: `${index * 0.1}s` }} className="imfx-diagram-float rounded-xl border border-[#ffdce4] bg-[#fff8fa] px-3 py-2.5">
                  <p className="text-sm font-semibold text-[#2b0f1d]">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#d6f2ea] bg-[#f2fbf9] p-4">
                <p className="text-sm font-semibold text-[#0f766e] uppercase">{tx("ĐƯỢC GHI NHẬN", "RECOGNIZED")}</p>
                <ul className="mt-2 space-y-1.5 text-sm text-[#0b1020]/78">
                  {recognized.map((item) => (
                    <li key={item} className="flex items-start gap-2"><CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#0f766e]" />{item}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-[#ffe0e6] bg-[#fff7fa] p-4">
                <p className="text-sm font-semibold text-[#ff4d5f] uppercase">{tx("KHÔNG ĐƯỢC TÍNH", "NOT COUNTED")}</p>
                <ul className="mt-2 space-y-1.5 text-sm text-[#0b1020]/78">
                  {notCounted.map((item) => (
                    <li key={item} className="flex items-start gap-2"><CircleX className="mt-0.5 h-4 w-4 shrink-0 text-[#ff4d5f]" />{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>

          <article className="rounded-[24px] border border-[#ffd9e2] bg-[#2b0f1d] p-6 text-[#ffe5eb]">
            <p className="text-xs font-semibold tracking-[0.16em] uppercase">{tx("TUYÊN NGÔN VĂN HÓA", "CULTURE STATEMENT")}</p>
            <p className="mt-3 text-2xl font-bold leading-[1.25] text-white uppercase sm:text-3xl">
              “{tx("HỆ THỐNG ĐƯỢC XÂY BỞI NHỮNG NGƯỜI THẬT SỰ QUAN TÂM.", "SYSTEMS ARE BUILT BY PEOPLE WHO TRULY CARE.")}”
            </p>

            <div className="mt-5 rounded-2xl border border-white/20 bg-white/8 p-4">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-white"><Handshake className="h-4 w-4" /> {tx("Kỳ vọng của team", "Team expectation")}</p>
              <p className="mt-2 text-sm leading-7 text-[#ffdce4]/92">
                {tx("Bộ máy tăng trưởng chỉ chạy bền khi con người trong hệ còn năng lượng, còn niềm tin, còn tinh thần học hỏi và giữ kỷ luật hệ thống qua từng vòng lặp.", "The growth machine sustains only when people still have energy, trust, a learning mindset, and system discipline in every loop.")}
              </p>
            </div>

            <div className="mt-4 rounded-2xl border border-[#ff9bad] bg-gradient-to-r from-[#ff3f57] via-[#ff4d5f] to-[#ff6d86] px-4 py-3 text-white">
              <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase"><Sparkles className="h-4 w-4" /> {tx("Hành vi cốt lõi", "Core behavior")}</p>
              <p className="mt-1 text-sm">{tx("Làm đúng việc khó, làm đều, và làm có hệ thống.", "Do hard things right, do them consistently, and do them systematically.")}</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
