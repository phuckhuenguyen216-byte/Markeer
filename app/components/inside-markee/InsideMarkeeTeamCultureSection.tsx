"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { CheckCircle2, ChevronRight, X as XIcon, XCircle } from "lucide-react";
import { useInsideMarkeeLocale } from "./useInsideMarkeeLocale";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] as const },
  viewport: { once: true, amount: 0.2 },
});

type CultureItem = {
  id: string;
  titleVi: string;
  titleEn: string;
  keypointVi: string;
  keypointEn: string;
  detailVi: string;
  detailEn: string;
};

export default function InsideMarkeeTeamCultureSection() {
  const { tx, isEn } = useInsideMarkeeLocale();
  const [selectedItem, setSelectedItem] = useState<CultureItem | null>(null);

  const dos: CultureItem[] = [
    {
      id: "do-1",
      titleVi: "🎯 Bán kết quả - không bán công nghệ",
      titleEn: "🎯 Sell outcomes - not technology",
      keypointVi: "Bán kết quả bằng tiền, không bán tool AI.",
      keypointEn: "Sell monetary outcomes, not AI tools.",
      detailVi:
        'Với khách hàng, đừng bao giờ nói "AI chatbot", "machine learning", "LLM". Chỉ nói "rep inbox dưới 1 phút", "không bỏ sót đơn", "giảm 2 nhân sự CSKH". Khách hàng SME không cần biết AI là gì - họ cần thấy kết quả bằng tiền.',
      detailEn:
        "Never say AI jargon to clients. Only speak in outcomes like reply speed, no missed orders, and staffing efficiency.",
    },
    {
      id: "do-2",
      titleVi: "📊 Demo trên data thật của khách",
      titleEn: "📊 Demo on real client data",
      keypointVi: "Lấy câu hỏi thật của khách để demo, không dùng ví dụ chung chung.",
      keypointEn: "Use real client questions for demos, not generic examples.",
      detailVi:
        "Trước mỗi demo, dành 30 phút vào fanpage/TikTok của khách, lấy 5-7 câu hỏi họ hay gặp nhất, load vào demo environment. Show AI trả lời đúng những câu đó.",
      detailEn:
        "Before each demo, collect 5-7 real client questions and demo using those exact questions.",
    },
    {
      id: "do-3",
      titleVi: "📝 Ghi chép learning từ mỗi client",
      titleEn: "📝 Document learnings from each client",
      keypointVi: "Log lại lỗi và requirement để cải thiện app.",
      keypointEn: "Log errors and requirements to improve the app.",
      detailVi:
        "Mỗi khi AI xử lý sai, khách yêu cầu tính năng mới, hoặc setup lâu hơn bình thường - đều phải log lại. Không log là lãng phí bài học.",
      detailEn:
        "Log failures, feature requests, and slow setup points. No log means lost learning.",
    },
    {
      id: "do-4",
      titleVi: '🤝 Refer chéo giữa 3 "nhà"',
      titleEn: '🤝 Cross-refer between the 3 "houses"',
      keypointVi: "Khách hỏi ngoài mảng thì refer qua nhà khác, không tự nhận.",
      keypointEn: "Refer clients to the right house for out-of-scope requests.",
      detailVi:
        "Nếu khách Markee hỏi enterprise security thì refer sang Cloudgate. Nếu khách Cloudgate hỏi marketing thì refer sang Markee.",
      detailEn:
        "Keep domain boundaries clear and refer across houses when needed.",
    },
  ];

  const donts: CultureItem[] = [
    {
      id: "dont-1",
      titleVi: "🚫 Nhận custom request ngoài scope",
      titleEn: "🚫 Take custom out-of-scope requests",
      keypointVi: "Từ chối custom request phá vỡ quy trình chuẩn, dù thêm tiền.",
      keypointEn: "Reject custom requests that break standard workflows.",
      detailVi:
        'Mỗi custom request ngoài template đều kéo thêm chi phí vận hành và làm team khó scale. Câu trả lời mặc định: "ngoài scope, báo giá riêng".',
      detailEn:
        "Out-of-scope custom work breaks templates and hurts scalability. Default response: separate quote.",
    },
    {
      id: "dont-2",
      titleVi: "🚫 Post nội dung bán hàng trên SecurityZone",
      titleEn: "🚫 Post promotional content on SecurityZone",
      keypointVi: "Chỉ post nội dung có ích cho cộng đồng, không bán hàng trực tiếp.",
      keypointEn: "Only post useful community content, no direct selling.",
      detailVi:
        "SecurityZone là tầng trust. Post bán hàng trực diện sẽ làm community mất niềm tin rất nhanh.",
      detailEn:
        "SecurityZone is a trust layer. Direct promo content erodes trust quickly.",
    },
    {
      id: "dont-3",
      titleVi: "🚫 Scale bằng cách tăng headcount",
      titleEn: "🚫 Scale by adding headcount",
      keypointVi: "Build thêm automation để scale, không phụ thuộc tăng người.",
      keypointEn: "Scale with automation, not headcount growth.",
      detailVi:
        "Khi áp lực tăng, câu hỏi đúng là cần tự động hóa thêm gì, không phải thuê thêm bao nhiêu người.",
      detailEn:
        "When load grows, ask what to automate next instead of how many people to hire.",
    },
    {
      id: "dont-4",
      titleVi: '🚫 Nói "AI tự động hoàn toàn"',
      titleEn: '🚫 Say "fully automated AI"',
      keypointVi: "Tránh tạo kỳ vọng sai, luôn bán kết quả thực tế trong Phase 1.",
      keypointEn: "Avoid false expectations in Phase 1.",
      detailVi:
        'Phase 1 vẫn cần team làm thật nhiều phần. Đúng nhất là nói "Đội ngũ Markee + AI làm cho bạn" và nhấn vào kết quả đo được.',
      detailEn:
        "Phase 1 is still team-assisted. Position it as team + AI execution and emphasize measurable outcomes.",
    },
  ];

  return (
    <section className={`relative overflow-hidden bg-[#120d14] py-20 sm:py-24 lg:py-20 ${selectedItem ? "z-[999]" : "z-0"}`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(255,102,128,0.26)_0%,rgba(18,13,20,0)_42%),linear-gradient(to_right,rgba(255,144,165,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,144,165,0.06)_1px,transparent_1px)] bg-[size:auto,64px_64px,64px_64px]" />

      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <motion.p {...fadeUp(0)} className="mk-eyebrow text-center text-white/70 uppercase">
          {tx("07 · Văn hóa team", "07 · Team culture")}
        </motion.p>

        <motion.div {...fadeUp(0.05)} className="mx-auto mt-6 max-w-[880px] text-center">
          <h2 className="mk-section-title">
            <span className="block text-white">{tx("NHỮNG THỨ MÌNH LÀM", "THINGS WE DO")}</span>
            <span className="mk-section-title-accent block bg-gradient-to-r from-[#ff627a] via-[#ff4d5f] to-[#ff9cae] bg-clip-text text-transparent">
              {tx("VÀ KHÔNG LÀM", "AND DO NOT DO")}
            </span>
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-4">
            <motion.h3 {...fadeUp(0.1)} className="mb-6 flex items-center gap-2 text-xl font-bold text-white">
              <CheckCircle2 className="h-6 w-6 text-emerald-400" />
              {tx("✅ Team mình LUÔN làm:", "✅ Our team ALWAYS does:")}
            </motion.h3>

            {dos.map((item, index) => (
              <motion.article
                key={item.id}
                {...fadeUp(0.15 + index * 0.05)}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedItem(item)}
                className="cursor-pointer rounded-[20px] border border-emerald-500/20 bg-white/[0.04] p-4 shadow-[0_18px_44px_-30px_rgba(0,0,0,0.6)] backdrop-blur-[2px] sm:p-5"
              >
                <p className="text-[1rem] leading-[1.3] font-bold tracking-[-0.01em] text-white">{tx(item.titleVi, item.titleEn)}</p>
                <p className="mt-1.5 text-[0.85rem] leading-5 text-emerald-100/80">{tx(item.keypointVi, item.keypointEn)}</p>
                <button
                  type="button"
                  onClick={() => setSelectedItem(item)}
                  className="mt-3 inline-flex items-center gap-1 text-[0.8rem] font-semibold text-emerald-400 opacity-80 transition-opacity hover:opacity-100"
                >
                  {tx("Xem chi tiết", "View details")}
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </motion.article>
            ))}
          </div>

          <div className="space-y-4">
            <motion.h3 {...fadeUp(0.1)} className="mb-6 flex items-center gap-2 text-xl font-bold text-white">
              <XCircle className="h-6 w-6 text-red-400" />
              {tx("❌ Team mình KHÔNG làm:", "❌ Our team NEVER does:")}
            </motion.h3>

            {donts.map((item, index) => (
              <motion.article
                key={item.id}
                {...fadeUp(0.15 + index * 0.05)}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedItem(item)}
                className="cursor-pointer rounded-[20px] border border-red-500/20 bg-white/[0.04] p-4 shadow-[0_18px_44px_-30px_rgba(0,0,0,0.6)] backdrop-blur-[2px] sm:p-5"
              >
                <p className="text-[1rem] leading-[1.3] font-bold tracking-[-0.01em] text-white">{tx(item.titleVi, item.titleEn)}</p>
                <p className="mt-1.5 text-[0.85rem] leading-5 text-red-100/80">{tx(item.keypointVi, item.keypointEn)}</p>
                <button
                  type="button"
                  onClick={() => setSelectedItem(item)}
                  className="mt-3 inline-flex items-center gap-1 text-[0.8rem] font-semibold text-red-400 opacity-80 transition-opacity hover:opacity-100"
                >
                  {tx("Xem chi tiết", "View details")}
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </motion.article>
            ))}
          </div>
        </div>

        <motion.div {...fadeUp(0.4)} className="mt-14 rounded-3xl border border-[#ffb8c9]/20 bg-[#3a1b2a]/40 px-6 py-8 text-center backdrop-blur-sm sm:px-10">
          <p className="mb-4 text-xs font-semibold tracking-[0.15em] text-[#ffb8c9] uppercase">{tx("Câu chốt quan trọng nhất", "The most important takeaway")}</p>
          <p className="mx-auto max-w-[1020px] text-[1.1rem] leading-8 font-bold text-white sm:text-[1.25rem] sm:leading-9">
            {isEn ? (
              <>
                Every client is not just revenue - every client is a lesson to build a better product.
                <br />
                <span className="text-[#ffb8c9]">Do it well, learn fast, build right.</span>
              </>
            ) : (
              <>
                Mỗi client không chỉ là doanh thu - mỗi client là một bài học để mình build sản phẩm tốt hơn.
                <br />
                <span className="text-[#ffb8c9]">Làm tốt, học nhanh, build đúng.</span>
              </>
            )}
          </p>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative z-10 w-full max-w-[94vw] sm:max-w-lg max-h-[86vh] overflow-y-auto overflow-hidden rounded-2xl sm:rounded-3xl border border-[#ffb8c9]/30 bg-[#2a1722] p-4 shadow-2xl sm:p-8"
            >
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="absolute top-5 right-5 rounded-full p-2 transition-colors hover:bg-white/10"
              >
                <XIcon className="h-5 w-5 text-[#ffd2dc]" />
              </button>

              <h3 className="mt-1 pr-6 text-xl font-bold text-white">{tx(selectedItem.titleVi, selectedItem.titleEn)}</h3>
              <div className="mt-5 space-y-4">
                <p className="text-[1rem] leading-7 text-white/80">{tx(selectedItem.detailVi, selectedItem.detailEn)}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
