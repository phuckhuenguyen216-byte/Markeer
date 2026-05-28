"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Check, X, ShieldAlert, ArrowRight, ChevronDown } from "lucide-react";
import { useGrowthLocale } from "./useGrowthLocale";

const entry = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.58, delay, ease: [0.22, 1, 0.36, 1] as const },
  viewport: { once: true, amount: 0.15 },
});

export default function GrowthContributionSection() {
  const { tx } = useGrowthLocale();
  const [openQ, setOpenQ] = useState<number | null>(0);

  const questions = [
    {
      q: tx("Pain rõ ràng và đo được không?", "Is the pain clear and measurable?"),
      yes: tx('"Rep 300 inbox/ngày không kịp, mất 20 đơn/tuần"', '"Cannot rep 300 inbox/day, losing 20 orders/week"'),
      no: tx('"Muốn cải thiện marketing" — quá chung chung', '"Want to improve marketing" — too generic'),
    },
    {
      q: tx("Có ngân sách thực tế không?", "Is there a realistic budget?"),
      yes: tx('"Đang trả agency 15M/tháng, muốn chỗ tốt hơn"', '"Paying agency 15M/month, want a better place"'),
      no: tx('"Đang tìm hiểu giá rồi tính sau" — chưa sẵn sàng', '"Just checking prices" — not ready'),
    },
    {
      q: tx("Đang nói chuyện với người ra quyết định?", "Talking to the decision maker?"),
      yes: tx("Founder / Giám đốc / Manager có quyền ký", "Founder / Director / Manager with sign-off power"),
      no: tx("Nhân viên không biết sếp có mua hay không", "Employee who does not know if boss will buy"),
    },
    {
      q: tx("Có potential upsell trong 3-6 tháng?", "Potential upsell in 3-6 months?"),
      yes: tx("Business đang grow, có plan mở rộng", "Business is growing, has expansion plans"),
      no: tx("One-time project, không có plan tiếp theo", "One-time project, no further plans"),
    },
    {
      q: tx("Có thể làm case study / testimonial?", "Can we do a case study / testimonial?"),
      yes: tx("Brand có tên, network rộng, sẵn sàng chia sẻ", "Known brand, wide network, willing to share"),
      no: tx("Muốn ẩn danh hoàn toàn, network nhỏ", "Wants to be fully anonymous, small network"),
    },
  ];

  const redFlags = [
    { name: tx("Mặc cả quá mức", "Excessive haggling"), desc: tx('"Giảm 50% đi", "chỗ khác rẻ hơn nhiều"', '"Give me 50% off", "others are much cheaper"'), score: "+1" },
    { name: tx("Scope không rõ", "Unclear scope"), desc: tx('"Bạn cứ làm rồi tôi sẽ biết mình cần gì"', '"You just do it and I will know what I need"'), score: "+1" },
    { name: tx("Đòi 24/7", "Demands 24/7"), desc: tx('"Tôi hay cần gấp, phải rep ngay lập tức"', '"I often need things urgently, must reply immediately"'), score: "+1" },
    { name: tx("Giao tiếp toxic", "Toxic communication"), desc: tx("Nói chuyện thiếu tôn trọng, pressure liên tục", "Disrespectful talk, constant pressure"), score: "+1" },
    { name: tx("Gấp nhưng không rõ", "Urgent but unclear"), desc: tx('"Cần gấp!" nhưng không biết cần làm gì', '"Urgent!" but does not know what is needed'), score: "+2" },
    { name: tx("Rủi ro thanh toán", "Payment risk"), desc: tx('Chần chừ về payment terms, hỏi "trả sau xong"', 'Hesitant on payment terms, asks "pay later"'), score: "+2" },
  ];

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-20">
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,77,95,0.11)_0%,rgba(255,255,255,0)_38%)]"
        animate={{ opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <motion.p {...entry(0)} className="mk-eyebrow text-center text-[#ff4d5f] uppercase">
          {tx("04 · Customer Quality Filter", "04 · Customer Quality Filter")}
        </motion.p>

        <motion.h2
          {...entry(0.05)}
          className="mk-section-title mx-auto mt-4 max-w-[980px] text-center uppercase"
        >
          <span className="block text-[#0b1020]">{tx("KHÔNG PHẢI KHÁCH NÀO CŨNG NÊN NHẬN.", "NOT EVERY CUSTOMER SHOULD BE TAKEN.")}</span>
          <span className="mk-section-title-accent block bg-gradient-to-r from-[#ff3f57] via-[#ff4d5f] to-[#ff7c95] bg-clip-text text-transparent">
            {tx("ĐẦU VÀO SAI LÀ DELIVERY SẼ VỠ.", "BAD INPUT BREAKS DELIVERY.")}
          </span>
        </motion.h2>

        <motion.p
          {...entry(0.1)}
          className="mx-auto mt-5 max-w-[980px] text-center text-[1.02rem] leading-8 text-[#0b1020]/76 sm:text-[1.1rem]"
        >
          {tx(
            "Bộ lọc này giúp chúng ta chọn đúng khách ngay từ đầu để bảo vệ chất lượng delivery.",
            "This filter helps us choose the right clients from the start to protect delivery quality."
          )}
        </motion.p>

        <motion.article
          {...entry(0.16)}
          className="mt-8 rounded-[28px] bg-[linear-gradient(170deg,#fff8fb_0%,#ffffff_100%)] p-5 sm:p-6 shadow-[0_30px_72px_-52px_rgba(15,23,42,0.6)] border border-[#ffe0e8]"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ffe0e8] pb-4">
            <h3 className="text-lg font-extrabold text-[#0b1020] flex items-center gap-2">
              <span className="text-xl">✅</span> {tx("5 Câu hỏi — Đạt ≥3 YES thì submit", "5 Questions — ≥3 YES to submit")}
            </h3>
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 items-start">
            {questions.map((item, index) => {
              const isOpen = openQ === index;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 + index * 0.05 }}
                  viewport={{ once: true, amount: 0.15 }}
                  className={`rounded-xl border transition-colors cursor-pointer overflow-hidden ${isOpen ? "border-[#ff4d5f] bg-white shadow-[0_8px_20px_-12px_rgba(255,77,95,0.3)]" : "border-gray-100 bg-gray-50/50 hover:bg-white"}`}
                  onClick={() => setOpenQ(isOpen ? null : index)}
                >
                  <div className="p-4 flex items-center justify-between">
                    <p className={`font-bold flex items-start gap-2 ${isOpen ? "text-[#ff4d5f]" : "text-[#0b1020]"}`}>
                      <span className={`${isOpen ? "text-[#ff4d5f]" : "text-gray-400"} shrink-0`}>C{index + 1}</span>
                      {item.q}
                    </p>
                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className={`${isOpen ? "text-[#ff4d5f]" : "text-gray-400"}`}>
                       <ChevronDown className="h-5 w-5" />
                    </motion.div>
                  </div>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-1 space-y-2 text-[0.85rem] border-t border-gray-50 mt-1">
                          <div className="flex items-start gap-2 text-green-700">
                            <Check className="h-4 w-4 shrink-0 mt-0.5" />
                            <p>{item.yes}</p>
                          </div>
                          <div className="flex items-start gap-2 text-red-600/80">
                            <X className="h-4 w-4 shrink-0 mt-0.5" />
                            <p>{item.no}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 bg-gray-50 rounded-2xl p-3 border border-gray-100">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-100 text-green-800 font-bold text-sm">
              ≥4 YES <ArrowRight className="h-3.5 w-3.5 opacity-50" /> Auto-accept
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-100 text-amber-800 font-bold text-sm">
              3 YES <ArrowRight className="h-3.5 w-3.5 opacity-50" /> Closer review
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-100 text-red-800 font-bold text-sm">
              ≤2 YES <ArrowRight className="h-3.5 w-3.5 opacity-50" /> {tx("Cần thêm info", "Needs more info")}
            </div>
          </div>

        </motion.article>

        <motion.article
          {...entry(0.24)}
          className="mt-6 rounded-[28px] bg-[#160f22] p-5 sm:p-6 shadow-[0_30px_72px_-48px_rgba(22,15,34,0.78)] text-white relative overflow-hidden"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,77,95,0.15)_0%,rgba(0,0,0,0)_60%)]" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <h3 className="text-xl font-extrabold text-[#ff4d5f] flex items-center gap-2">
                <ShieldAlert className="h-6 w-6" /> {tx("🚩 Red Flag Score", "🚩 Red Flag Score")}
              </h3>
              <p className="mt-1 text-sm text-[#dbe7ff]/70">{tx("Từ chối hoặc tăng giá khi tổng điểm ≥ 3", "Reject or increase price when total score ≥ 3")}</p>
            </div>
          </div>

          <div className="relative z-10 mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {redFlags.map((flag, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                viewport={{ once: true }}
                className="rounded-2xl bg-white/5 border border-white/10 p-3.5"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="font-bold text-[#ffdce4]">{flag.name}</p>
                  <span className="shrink-0 flex items-center justify-center rounded-md bg-[#ff4d5f] px-2 py-0.5 text-xs font-black text-white">
                    {flag.score}
                  </span>
                </div>
                <p className="text-[0.85rem] leading-6 text-[#dbe7ff]/60">{flag.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.article>

      </div>
    </section>
  );
}
