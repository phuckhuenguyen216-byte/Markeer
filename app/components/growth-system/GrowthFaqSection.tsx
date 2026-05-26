"use client";

import GrowthSectionTitle from "./GrowthSectionTitle";
import { useGrowthLocale } from "./useGrowthLocale";

export default function GrowthFaqSection() {
  const { tx } = useGrowthLocale();

  const faqItems = [
    {
      q: tx("Tăng trưởng có bắt buộc không?", "Is growth mandatory?"),
      a: tx("Không bắt buộc ở Lớp 2. Lớp 1 luôn là ưu tiên. Khi công việc cốt lõi chưa ổn thì không chạy task tăng trưởng.", "Not mandatory in Layer 2. Layer 1 is always priority. If core jobs are unstable, do not chase growth tasks."),
    },
    {
      q: tx("Intern có đóng góp được không?", "Can interns contribute?"),
      a: tx("Có. Intern có thể đóng góp qua phát hiện lead, seeding nội dung, cải tiến workflow, hoặc hỗ trợ onboarding.", "Yes. Interns can contribute through lead detection, content seeding, workflow improvements, or onboarding support."),
    },
    {
      q: tx("Đóng góp đo bằng gì?", "How is contribution measured?"),
      a: tx("Đo bằng chất lượng tín hiệu và tác động thực: chất lượng lead, tín hiệu niềm tin, kết quả bàn giao, case study, và mức cải thiện hệ thống.", "By signal quality and real impact: lead quality, trust signals, delivery outcomes, case studies, and system improvement level."),
    },
    {
      q: tx("Nếu không làm sales thì sao?", "What if I am not in sales?"),
      a: tx("Tăng trưởng không phải việc riêng của sales. Bạn vẫn đóng góp qua nội dung, vận hành, chất lượng bàn giao, tự động hóa, và quan hệ.", "Growth is not only sales work. You can still contribute through content, operations, delivery quality, automation, and relationships."),
    },
    {
      q: tx("Tại sao không tối ưu lợi nhuận trước?", "Why not optimize profit first?"),
      a: tx("Phase 1 ưu tiên thị phần và tốc độ học. Tối ưu lợi nhuận quá sớm sẽ chặn tăng trưởng dài hạn.", "Phase 1 prioritizes market share and learning speed. Optimizing profit too early can block long-term growth."),
    },
    {
      q: tx("Điều gì quan trọng nhất trong tăng trưởng?", "What matters most in growth?"),
      a: tx("Niềm tin và hệ thống. Nếu tăng trưởng phá niềm tin hoặc phá bàn giao thì đó không phải tăng trưởng tốt.", "Trust and systems. If growth breaks trust or delivery, it is not good growth."),
    },
  ];

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <GrowthSectionTitle label="FAQ" title={tx("HỎI THẲNG, TRẢ LỜI THẲNG.", "ASK DIRECTLY, ANSWER DIRECTLY.")} />

        <div className="mt-7 space-y-3">
          {faqItems.map((item) => (
            <details key={item.q} className="group rounded-[20px] border border-[#ffdce4] bg-white p-4 open:bg-[#fff8fa]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold tracking-[-0.01em] text-[#2b0f1d]">
                {item.q}
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#ffd6de] text-[#ff4d5f] transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-7 text-[#0b1020]/78">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
