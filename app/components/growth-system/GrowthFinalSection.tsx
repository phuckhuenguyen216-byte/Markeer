"use client";

import GrowthSectionTitle from "./GrowthSectionTitle";
import { useGrowthLocale } from "./useGrowthLocale";

export default function GrowthFinalSection() {
  const { tx } = useGrowthLocale();

  const finalLoop = [
    tx("CON NGƯỜI", "PEOPLE"),
    tx("HỆ THỐNG", "SYSTEMS"),
    tx("NIỀM TIN", "TRUST"),
    tx("TĂNG TRƯỞNG", "GROWTH"),
    tx("THÊM CƠ HỘI", "MORE OPPORTUNITIES"),
    tx("HỆ SINH THÁI TỐT HƠN", "A BETTER ECOSYSTEM"),
  ];

  return (
    <section className="border-t border-[#ffdce4] bg-[linear-gradient(180deg,#fff9fb_0%,#fff5f8_100%)] py-18 sm:py-20">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <GrowthSectionTitle label={tx("TUYÊN BỐ CUỐI", "FINAL STATEMENT")} title={tx("TĂNG TRƯỞNG KHÔNG PHẢI MỘT PHÒNG BAN.", "GROWTH IS NOT A DEPARTMENT.")} centered />

        <p className="mx-auto mt-6 max-w-[920px] text-center text-lg leading-8 text-[#0b1020]/80 sm:text-xl sm:leading-9">
          {tx("Nó là kết quả khi hệ thống, con người, niềm tin, vận hành và tư duy dài hạn bắt đầu kết nối với nhau.", "It is the result when systems, people, trust, operations, and long-term thinking start connecting.")}
        </p>

        <div className="mt-7 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <article className="rounded-[24px] border border-[#ffdbe3] bg-white p-6">
            <p className="text-xs font-semibold tracking-[0.16em] text-[#ff4d5f] uppercase">{tx("VÒNG LẶP TÍCH LŨY HỆ SINH THÁI", "ECOSYSTEM COMPOUND LOOP")}</p>
            <div className="mt-4 grid gap-2">
              {finalLoop.map((item, index) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#ffd6de] bg-[#fff8fa] text-xs font-bold text-[#ff4d5f]">{index + 1}</span>
                  <p className="rounded-xl border border-[#ffd6de] bg-white px-3 py-2 text-sm font-semibold text-[#0b1020]">{item}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[24px] border border-[#dce2f0] bg-[#f8faff] p-6">
            <p className="text-3xl font-black tracking-[-0.03em] text-[#0b1020] uppercase sm:text-4xl">“{tx("MỌI THỨ ĐỀU TÍCH LŨY.", "EVERYTHING COMPOUNDS.")}”</p>
            <p className="mt-4 text-sm leading-7 text-[#0b1020]/78">
              {tx(
                "System Version 1.0 — Phase 1 (đến Q3/2026 hoặc khi team vượt 15 người). Khi công ty scale lên, system này sẽ được review và nâng cấp. Mọi thay đổi sẽ được thông báo trước ít nhất 2 tuần.",
                "System Version 1.0 — Phase 1 (until Q3/2026 or when the team exceeds 15 people). As the company scales, this system will be reviewed and upgraded. Any changes will be announced at least 2 weeks in advance."
              )}
            </p>
            <p className="mt-4 rounded-xl border border-[#cfe0ff] bg-white px-3 py-3 text-xs tracking-[0.16em] text-[#23427a] uppercase">
              {tx("ĐỪNG QUOTE POLICY CŨ KHI CÓ VERSION MỚI.", "DO NOT QUOTE OLD POLICY WHEN A NEW VERSION EXISTS.")}
            </p>
            <p className="mt-4 text-sm text-[#0b1020]/58">
              {tx(
                "markee.vn · markeeai.com · Hệ thống tăng trưởng v1.0 · Giai đoạn 1 · Rà soát Q3/2026",
                "markee.vn · markeeai.com · Growth System v1.0 · Phase 1 · Review Q3/2026"
              )}
            </p>
          </article>
        </div>

        <p className="mt-8 rounded-[20px] border border-[#ffdbe3] bg-white px-4 py-3 text-sm leading-7 text-[#0b1020]/78">
          {tx(
            "Nhớ 3 điều để bắt đầu ngay hôm nay: (1) làm tốt Lớp 1 trước, (2) gửi lead chi tiết để tăng chiều sâu khám phá, (3) nội dung thật + lead thật = thưởng gấp đôi.",
            "Remember 3 things to start today: (1) do Layer 1 well first, (2) submit detailed leads to improve discovery depth, (3) real content + real leads = double reward."
          )}
        </p>
      </div>
    </section>
  );
}
