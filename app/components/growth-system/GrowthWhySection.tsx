"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useGrowthLocale } from "./useGrowthLocale";

const chapterReveal = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] as const },
  viewport: { once: true, amount: 0.25 },
});

export default function GrowthWhySection() {
  const { tx } = useGrowthLocale();

  const layers = [
    {
      layer: "Layer 1 · BẮT BUỘC",
      nameVi: "Core Job",
      nameEn: "Core Job",
      textVi: "Lý do bạn được trả lương (Code, Marketing, Sales, Ops). Không làm tốt việc chính = không có chuyện làm Layer 2.",
      textEn: "Reason you get paid (Code, Mkt, Sales, Ops). Failing core job = no Layer 2.",
    },
    {
      layer: "Layer 2 · KHÔNG BẮT BUỘC",
      nameVi: "Growth Expansion",
      nameEn: "Growth Expansion",
      textVi: "Cơ hội kiếm thêm không giới hạn từ việc đóng góp growth (seeding, tìm lead). Cấm bỏ bê việc chính để chase hoa hồng.",
      textEn: "Unlimited extra income from growth (seeding, leads). Do not sacrifice core job for commission.",
    },
    {
      layer: "Layer 3 · LEADER & CULTURE",
      nameVi: "Đóng góp cho tổ chức",
      nameEn: "Organization Contribution",
      textVi: "Mentor, chia sẻ kiến thức, cải thiện quy trình. Đánh giá định tính, ảnh hưởng trực tiếp đến cơ hội phát triển.",
      textEn: "Mentor, share knowledge, improve SOPs. Qualitative review, impacts career growth.",
    },
  ];

  return (
    <section className="relative overflow-hidden py-18 sm:py-22 lg:py-26">
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_14%,rgba(255,77,95,0.12)_0%,rgba(255,255,255,0)_42%)]"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
          <motion.article {...chapterReveal(0)} className="lg:pt-4">
            <p className="mk-eyebrow text-[#ff4d5f] uppercase">
              {tx("01 · Đọc cái này trước tất cả", "01 · Read this before all")}
            </p>

            <h2 className="mk-section-title mt-4 uppercase">
              <span className="block text-[#0b1020]">{tx("TẠI SAO TÀI LIỆU", "WHY DOES THIS")}</span>
              <span className="mk-section-title-accent block bg-gradient-to-r from-[#ff3f57] via-[#ff4d5f] to-[#ff7c95] bg-clip-text text-transparent">
                {tx("NÀY TỒN TẠI?", "DOCUMENT EXIST?")}
              </span>
            </h2>

            <p className="mt-6 max-w-[760px] text-[1.04rem] leading-8 text-[#0b1020]/78 sm:text-[1.12rem]">
              {tx(
                "Vì Markee đang ở giai đoạn chiếm thị phần — và chúng ta cần toàn bộ team cùng tham gia vào growth, không chỉ team Sales.",
                "Because Markee is in the market share grab phase — and we need the entire team involved in growth, not just Sales."
              )}
            </p>

            <div className="mt-7 max-w-[720px] rounded-[24px] bg-white/78 p-5 shadow-[0_10px_28px_-24px_rgba(15,23,42,0.58)] sm:p-7 border border-[#ffe0e8]">
              <p className="text-sm font-extrabold text-[#ff4d5f] uppercase tracking-wide">🔥 Mindset Phase 1</p>
              <p className="mt-2.5 text-[0.98rem] leading-7 text-[#2b0f1d] sm:text-[1.05rem] font-medium">
                {tx(
                  "Markee không đang xây \"công ty ổn định\". Mình đang xây growth war machine. Speed quan trọng hơn perfection. Market share quan trọng hơn margin. Và mọi người trong team đều có thể đóng góp vào growth — và được trả tiền xứng đáng cho điều đó.",
                  "Markee is not building a \"stable company\". We are building a growth war machine. Speed > perfection. Market share > margin. Everyone can contribute to growth — and get paid fairly for it."
                )}
              </p>
            </div>

            <p className="mt-6 max-w-[720px] text-[0.95rem] font-medium leading-7 text-[#0b1020]/70 italic bg-[#fff7fa] p-4 rounded-xl border-l-2 border-[#ff4d5f]">
              {tx("🎯 Tóm lại: Làm tốt công việc chính trước. Kiếm thêm từ growth nếu muốn. Đóng góp cho team nếu có thể. Ba thứ này KHÔNG cạnh tranh nhau — chúng bổ sung nhau.", "🎯 TL;DR: Do core work well first. Earn extra from growth if you want. Contribute to the team if you can. These 3 do NOT compete — they complement.")}
            </p>
          </motion.article>

          <motion.article
            {...chapterReveal(0.08)}
            className="relative overflow-hidden rounded-[30px] bg-[linear-gradient(170deg,#ffffff_0%,#fff7fa_100%)] p-6 shadow-[0_26px_64px_-48px_rgba(15,23,42,0.58)] sm:p-7"
          >
            <motion.div
              className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(255,77,95,0.2)_0%,rgba(255,255,255,0)_70%)] blur-xl"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            />

            <p className="inline-flex items-center gap-2 text-[0.65rem] font-extrabold tracking-[0.15em] text-[#ff4d5f] uppercase bg-white/90 px-3 py-1.5 rounded-full border border-[#ffe0e8]">
              <Sparkles className="h-3 w-3" />
              {tx("3 layer — Hiểu đúng để không bị nhầm", "3 layer — Understand to avoid confusion")}
            </p>

            <div className="mt-5 space-y-4">
              {layers.map((item, index) => (
                <motion.article
                  key={item.layer}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
                  viewport={{ once: true, amount: 0.2 }}
                  className="relative rounded-2xl bg-white/86 px-4 py-4 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.5)]"
                >
                  <p className="text-[11px] font-semibold tracking-[0.14em] text-[#ff4d5f] uppercase">{item.layer}</p>
                  <p className="mt-1 text-[1.05rem] font-bold text-[#2b0f1d]">{tx(item.nameVi, item.nameEn)}</p>
                  <p className="mt-1.5 text-sm leading-6 text-[#0b1020]/74 sm:text-base sm:leading-7">{tx(item.textVi, item.textEn)}</p>
                </motion.article>
              ))}
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
