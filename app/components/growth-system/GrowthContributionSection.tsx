"use client";

import { ArrowRight, Eye, Lightbulb, Megaphone, Search, ShieldCheck, Workflow } from "lucide-react";
import GrowthSectionTitle from "./GrowthSectionTitle";
import { useGrowthLocale } from "./useGrowthLocale";

export default function GrowthContributionSection() {
  const { tx } = useGrowthLocale();

  const contributionTypes = [
    { title: tx("Nhìn ra nỗi đau", "Spot pain"), text: tx("Nhìn ra vấn đề thật từ khách hàng, không đoán mò.", "Identify real customer pain, not guesses."), Icon: Search, tone: "text-[#ff4d5f]", border: "border-[#ffd6de]", bg: "bg-[#fff8fa]" },
    { title: tx("Tìm cơ hội", "Find opportunities"), text: tx("Chỉ ra đúng điểm có thể tạo tăng trưởng theo từng phase.", "Pinpoint the right leverage points by phase."), Icon: Lightbulb, tone: "text-[#2f73ff]", border: "border-[#d5e1ff]", bg: "bg-[#f6f9ff]" },
    { title: tx("Chia sẻ insight", "Share insight"), text: tx("Biến dữ liệu vận hành thành insight dùng được.", "Turn operational data into actionable insight."), Icon: Eye, tone: "text-[#0f766e]", border: "border-[#cdece7]", bg: "bg-[#f5fcfa]" },
    { title: tx("Cải tiến hệ thống", "Improve systems"), text: tx("Tối ưu workflow để team chạy nhanh mà vẫn ổn định.", "Optimize workflows so teams move fast and stay stable."), Icon: Workflow, tone: "text-[#7c3aed]", border: "border-[#e7ddff]", bg: "bg-[#faf7ff]" },
    { title: tx("Xây niềm tin", "Build trust"), text: tx("Nuôi niềm tin bằng chất lượng bàn giao và sự rõ ràng.", "Build trust through delivery quality and clarity."), Icon: ShieldCheck, tone: "text-[#ea580c]", border: "border-[#ffd9b5]", bg: "bg-[#fff8f1]" },
    { title: tx("Tăng độ hiện diện", "Increase presence"), text: tx("Làm đúng nội dung để tín hiệu hệ sinh thái rõ hơn.", "Create the right content so ecosystem signals become clearer."), Icon: Megaphone, tone: "text-[#0369a1]", border: "border-[#cde9ff]", bg: "bg-[#f2f9ff]" },
  ];

  const flowLane = [
    { step: "01", title: tx("Nhận biết", "Awareness"), signal: tx("Phát hiện nỗi đau", "Detect pain") },
    { step: "02", title: tx("Niềm tin", "Trust"), signal: tx("Xác nhận độ tin cậy", "Validate credibility") },
    { step: "03", title: tx("Hội thoại", "Conversation"), signal: tx("Làm rõ bối cảnh", "Clarify context") },
    { step: "04", title: tx("Cơ hội", "Opportunity"), signal: tx("Xác định phạm vi", "Define scope") },
    { step: "05", title: tx("Bàn giao", "Delivery"), signal: tx("Tạo giá trị thực", "Create real value") },
  ];

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <GrowthSectionTitle label={tx("CÁCH ĐÓNG GÓP TĂNG TRƯỞNG VẬN HÀNH", "HOW GROWTH CONTRIBUTION WORKS")} title={tx("ĐÓNG GÓP KHÔNG CHỈ LÀ: MANG KHÁCH VỀ.", "CONTRIBUTION IS NOT ONLY: BRINGING CLIENTS.")} />

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <article className="relative overflow-hidden rounded-[26px] border border-[#ffdbe3] bg-white p-6 sm:p-7">
            <div className="pointer-events-none absolute -left-16 top-[-3rem] h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(255,77,95,0.16)_0%,rgba(255,255,255,0)_72%)]" />
            <p className="relative z-10 max-w-[760px] text-[1.02rem] leading-8 text-[#0b1020]/80">
              {tx(
                "Đóng góp tăng trưởng không phải spam kiếm khách. Đó là cách bạn tạo thêm tín hiệu đúng cho hệ sinh thái để nội dung, niềm tin, hệ thống và bàn giao kết nối thành tăng trưởng bền vững.",
                "Growth contribution is not spam prospecting. It is how you create the right signals so content, trust, systems, and delivery connect into sustainable growth."
              )}
            </p>

            <div className="relative z-10 mt-5 grid gap-3 sm:grid-cols-2">
              {contributionTypes.map((item, index) => {
                const Icon = item.Icon;
                return (
                  <article key={item.title} style={{ animationDelay: `${index * 0.09}s` }} className={`imfx-diagram-float rounded-2xl border px-4 py-3 ${item.border} ${item.bg}`}>
                    <p className={`inline-flex items-center gap-2 text-sm font-extrabold tracking-[0.02em] ${item.tone}`}>
                      <Icon className="h-4 w-4" />
                      {item.title}
                    </p>
                    <p className="mt-1.5 text-sm leading-6 text-[#0b1020]/74">{item.text}</p>
                  </article>
                );
              })}
            </div>

            <p className="relative z-10 mt-5 rounded-2xl border border-[#ff9bad] bg-gradient-to-r from-[#ff3f57] via-[#ff4d5f] to-[#ff6983] px-5 py-3 text-lg font-bold text-white">
              &quot;{tx("TĂNG TRƯỞNG BẮT ĐẦU TỪ NHẬN BIẾT VÀ NIỀM TIN.", "GROWTH STARTS WITH AWARENESS AND TRUST.")}&quot;
            </p>
          </article>

          <article className="relative overflow-hidden rounded-[26px] border border-[#dce6ff] bg-[linear-gradient(160deg,#f7faff_0%,#f4f8ff_52%,#f9fbff_100%)] p-6 sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold tracking-[0.16em] text-[#2f73ff] uppercase">{tx("LUỒNG ĐÓNG GÓP", "CONTRIBUTION FLOW")}</p>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#cfe0ff] bg-white px-3 py-1.5 text-[11px] font-semibold tracking-[0.1em] text-[#35508f] uppercase">
                <span className="h-2 w-2 rounded-full bg-[#4f7fff] animate-pulse" />
                {tx("Đang định tuyến", "Routing")}
              </span>
            </div>

            <div className="relative mt-5 pl-7">
              <div className="absolute bottom-2 left-3 top-2 w-px bg-gradient-to-b from-[#8eb2ff] via-[#5f8dff] to-[#8eb2ff]" />
              <div className="space-y-3.5">
                {flowLane.map((item, index) => (
                  <article key={item.step} className="relative rounded-xl border border-[#cfe0ff] bg-white px-3 py-2.5">
                    <span className="absolute -left-7 top-3 inline-flex h-5 min-w-5 items-center justify-center rounded-md border border-[#cfe0ff] bg-[#edf3ff] px-1 text-[11px] font-bold text-[#2f73ff]">{item.step}</span>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-bold text-[#143c86]">{item.title}</p>
                      {index !== flowLane.length - 1 ? <ArrowRight className="h-3.5 w-3.5 text-[#5f8dff]" /> : null}
                    </div>
                    <p className="mt-0.5 text-xs text-[#0b1020]/68">{item.signal}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              {flowLane.map((item, index, arr) => (
                <div key={item.step} className="flex items-center gap-2">
                  <span className="rounded-full border border-[#cfe0ff] bg-white px-3 py-1.5 text-xs font-semibold text-[#1e3a8a]">{item.title}</span>
                  {index !== arr.length - 1 ? <ArrowRight className="h-3 w-3 text-[#5f8dff]" /> : null}
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
