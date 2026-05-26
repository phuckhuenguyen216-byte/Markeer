"use client";

import { AlertTriangle, BookOpen, ShieldCheck, Siren, Sparkles, TimerReset } from "lucide-react";
import GrowthSectionTitle from "./GrowthSectionTitle";
import { useGrowthLocale } from "./useGrowthLocale";

export default function GrowthProtectionSection() {
  const { tx } = useGrowthLocale();

  const antiPatterns = [
    tx("văn hóa spam", "spam culture"),
    tx("tạo khẩn cấp giả", "fake urgency"),
    tx("marketing AI giả", "fake AI marketing"),
    tx("ám ảnh vanity metrics", "vanity metric obsession"),
    tx("khai thác ngắn hạn", "short-term exploitation"),
  ];

  const qualityFilter = [
    tx("Nỗi đau rõ ràng và đo được", "Clear and measurable pain"),
    tx("Có ngân sách thực tế", "Has realistic budget"),
    tx("Đang nói với người có quyền quyết định", "Speaking to a decision-maker"),
    tx("Có tiềm năng upsell trong 3-6 tháng", "Has 3-6 month upsell potential"),
    tx("Có thể làm case study/testimonial", "Can become case study/testimonial"),
  ];

  const guardRules = [
    tx("Lead phải có CRM entry mới được tính.", "Lead must have CRM entry to count."),
    tx("Closer có quyền quyết định cuối cùng và phải ghi lý do reject.", "Closer has final say and must document reject reasons."),
    tx("Commission chỉ mở khi active + paid + delivery started.", "Commission unlocks only when active + paid + delivery started."),
    tx("Growth Support chỉ tính khi có xác nhận trực tiếp từ Closer.", "Growth Support counts only with direct confirmation from Closer."),
    tx("Công việc cốt lõi trước, tăng trưởng sau. Không hy sinh Lớp 1.", "Core job first, growth second. Do not sacrifice Layer 1."),
  ];

  const responseProtocol = [
    { step: "01", title: tx("Phát hiện", "Detect"), text: tx("Phát hiện tín hiệu phá bàn giao hoặc niềm tin.", "Detect signals breaking delivery or trust.") },
    { step: "02", title: tx("Tạm dừng", "Pause"), text: tx("Dừng growth actions gây quá tải tức thì.", "Pause growth actions causing overload.") },
    { step: "03", title: tx("Ổn định", "Stabilize"), text: tx("Ưu tiên sửa chất lượng, quy trình, giao tiếp.", "Prioritize quality, process, and communication fixes.") },
    { step: "04", title: tx("Mở lại", "Resume"), text: tx("Chỉ mở lại growth khi hệ thống ổn định.", "Resume growth only after systems stabilize.") },
  ];

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <GrowthSectionTitle label={tx("NGUYÊN TẮC BẢO VỆ HỆ", "SYSTEM PROTECTION RULES")} title={tx("NHỮNG THỨ HỆ SINH THÁI KHÔNG MUỐN TRỞ THÀNH.", "WHAT THE ECOSYSTEM MUST NEVER BECOME.")} />

        <div className="mt-7 grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-[#ffdce4] bg-[#fff8fa] p-4">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#ff4d5f]"><Siren className="h-4 w-4" /> {tx("Chốt chặn bàn giao", "Delivery guardrail")}</p>
            <p className="mt-2 text-sm text-[#0b1020]/76">{tx("Tăng trưởng không được phép làm team quá tải.", "Growth must not overload the team.")}</p>
          </article>
          <article className="rounded-2xl border border-[#d6f2ea] bg-[#f2fbf9] p-4">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#0f766e]"><ShieldCheck className="h-4 w-4" /> {tx("Chốt chặn niềm tin", "Trust guardrail")}</p>
            <p className="mt-2 text-sm text-[#0b1020]/76">{tx("Không đổi niềm tin dài hạn lấy kết quả ngắn hạn.", "Do not trade long-term trust for short-term results.")}</p>
          </article>
          <article className="rounded-2xl border border-[#dce6ff] bg-[#f6f9ff] p-4">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#2f73ff]"><TimerReset className="h-4 w-4" /> {tx("Chốt chặn hệ thống", "System guardrail")}</p>
            <p className="mt-2 text-sm text-[#0b1020]/76">{tx("Không có hệ thống thì không scale thêm.", "No system, no additional scale.")}</p>
          </article>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <article className="gs-protect-zone rounded-[24px] border border-[#ffdbe3] bg-white p-6">
            <p className="text-base leading-7 text-[#0b1020]/78">{tx("Tăng trưởng không được phép phá bàn giao, tạo hỗn loạn, đốt sức team, hoặc phá niềm tin.", "Growth must not break delivery, create chaos, burn the team, or destroy trust.")}</p>

            <div className="mt-4 rounded-2xl border border-[#ffe0e6] bg-[#fff7fa] p-4">
              <p className="text-xs font-semibold tracking-[0.16em] text-[#ff4d5f] uppercase">{tx("BẢNG ANTI-PATTERN", "ANTI-PATTERN BOARD")}</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {antiPatterns.map((item, index) => (
                  <div key={item} className="gs-protect-item flex items-center justify-between rounded-xl border border-[#ffd9e2] bg-white px-3 py-2" style={{ animationDelay: `${index * 0.14}s` }}>
                    <span className="inline-flex items-center gap-2 text-sm text-[#0b1020]/78"><AlertTriangle className="gs-protect-alert h-4 w-4 text-[#ff4d5f]" />{item}</span>
                    <span className="rounded-full bg-[#fff1f5] px-2 py-0.5 text-[10px] font-semibold tracking-[0.08em] text-[#ff4d5f] uppercase">{tx("chặn", "block")}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-5 rounded-2xl border border-[#ffb2c0] bg-gradient-to-r from-[#ff465c] via-[#ff4d5f] to-[#ff6b84] px-4 py-3 text-lg font-bold text-white uppercase">
              {tx("NẾU TĂNG TRƯỞNG PHÁ HỆ THỐNG, ĐÓ KHÔNG PHẢI TĂNG TRƯỞNG TỐT.", "IF GROWTH BREAKS SYSTEMS, IT IS NOT GOOD GROWTH.")}
            </p>
          </article>

          <article className="rounded-[24px] border border-[#dce2f0] bg-[#f8faff] p-6">
            <p className="text-xs font-semibold tracking-[0.16em] text-[#23427a] uppercase">{tx("GIAO THỨC PHẢN ỨNG", "RESPONSE PROTOCOL")}</p>
            <div className="mt-4 space-y-2.5">
              {responseProtocol.map((item) => (
                <div key={item.step} className="rounded-xl border border-[#cfe0ff] bg-white px-3 py-2.5">
                  <p className="text-xs font-semibold tracking-[0.08em] text-[#2f73ff] uppercase">{item.step} · {item.title}</p>
                  <p className="mt-1 text-sm text-[#0b1020]/78">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-[#d6f2ea] bg-[#f2fbf9] p-4">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#0f766e] uppercase"><Sparkles className="h-4 w-4" /> {tx("Auto-trigger sức khỏe bàn giao", "Auto-trigger delivery health")}</p>
              <p className="mt-1 text-sm text-[#0b1020]/78">
                {tx("Nếu PM đánh giá năng lực bàn giao &lt; 3 trong 2 tuần liên tiếp → tự động tạm dừng KPI tăng trưởng cho team đó cho đến khi ổn định.", "If PM rates delivery capacity &lt; 3 for 2 consecutive weeks → automatically pause growth KPI for that team until stable.")}
              </p>
            </div>
          </article>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <article className="rounded-[24px] border border-[#dce2f0] bg-white p-5">
            <p className="text-sm font-semibold tracking-[0.14em] text-[#23427a] uppercase">{tx("BỘ LỌC CHẤT LƯỢNG KHÁCH HÀNG", "CLIENT QUALITY FILTER")}</p>
            <ul className="mt-3 space-y-2 text-sm text-[#0b1020]/78">
              {qualityFilter.map((item) => (
                <li key={item} className="flex items-start gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#2f73ff]" />{item}</li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-[#0b1020]/62">{tx("Đạt từ 3/5 YES: submit cho closer review.", "Reach at least 3/5 YES: submit for closer review.")}</p>
          </article>

          <article className="rounded-[24px] border border-[#dce2f0] bg-white p-5">
            <p className="text-sm font-semibold tracking-[0.14em] text-[#23427a] uppercase">{tx("5 RULE KHÔNG ĐƯỢC VI PHẠM", "5 NON-NEGOTIABLE RULES")}</p>
            <ul className="mt-3 space-y-2 text-sm text-[#0b1020]/78">
              {guardRules.map((item) => (
                <li key={item} className="flex items-start gap-2"><BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-[#23427a]" />{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
