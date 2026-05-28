"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useInsideMarkeeLocale } from "./useInsideMarkeeLocale";
import { useState } from "react";
import { ChevronRight, X as XIcon, CheckCircle2, XCircle } from "lucide-react";

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
  const { tx } = useInsideMarkeeLocale();
  const [selectedItem, setSelectedItem] = useState<CultureItem | null>(null);

  const dos: CultureItem[] = [
    {
      id: "do-1",
      titleVi: "🎯 Bán kết quả — không bán công nghệ",
      titleEn: "🎯 Sell outcomes — not technology",
      keypointVi: "Bán kết quả bằng tiền, không bán tool AI.",
      keypointEn: "Sell monetary outcomes, not AI tools.",
      detailVi: "Với khách hàng, đừng bao giờ nói \"AI chatbot\", \"machine learning\", \"LLM\". Chỉ nói \"rep inbox dưới 1 phút\", \"không bỏ sót đơn\", \"giảm 2 nhân sự CSKH\". Khách hàng SME không cần biết AI là gì — họ cần thấy kết quả bằng tiền.",
      detailEn: "Never say 'AI chatbot', 'machine learning', or 'LLM' to clients. Only say 'rep inbox under 1 minute', 'no missed orders', 'reduce 2 CS staffs'. SME clients don't need to know what AI is — they need to see monetary outcomes.",
    },
    {
      id: "do-2",
      titleVi: "📊 Demo trên data thật của khách",
      titleEn: "📊 Demo on real client data",
      keypointVi: "Lấy câu hỏi thật của khách để demo, không dùng ví dụ chung chung.",
      keypointEn: "Use real client questions for demos, not generic examples.",
      detailVi: "Trước mỗi demo, dành 30 phút vào fanpage/TikTok của khách, lấy 5–7 câu hỏi họ hay gặp nhất, load vào demo environment. Show AI trả lời đúng những câu ĐÓ — không phải câu ví dụ chung chung. Đây là thứ làm khách ấn tượng nhất.",
      detailEn: "Before each demo, spend 30 minutes on the client's fanpage/TikTok, extract 5-7 most common questions, and load them into the demo environment. Show AI answering exactly THOSE questions. This is what impresses clients the most.",
    },
    {
      id: "do-3",
      titleVi: "📝 Ghi chép lại learning từ mỗi client",
      titleEn: "📝 Document learnings from each client",
      keypointVi: "Log lại lỗi và requirement để cải thiện app.",
      keypointEn: "Log errors and requirements to improve the app.",
      detailVi: "Mỗi khi AI handle sai → log lại. Mỗi khi khách hỏi thêm tính năng gì → log lại. Mỗi khi setup tốn nhiều thời gian hơn bình thường → log lại. Đây là data để team dev cải thiện app mỗi sprint. Không log = lãng phí bài học.",
      detailEn: "Every time AI handles incorrectly → log it. Every time a client asks for a feature → log it. Every time setup takes longer than usual → log it. This is data for the dev team to improve the app every sprint. Not logging = wasted lessons.",
    },
    {
      id: "do-4",
      titleVi: "🤝 Refer chéo giữa 3 \"nhà\"",
      titleEn: "🤝 Cross-refer between the 3 \"houses\"",
      keypointVi: "Khách hỏi ngoài mảng thì refer qua nhà khác, không tự nhận.",
      keypointEn: "Refer clients to the right house for out-of-scope requests.",
      detailVi: "Nếu khách Markee hỏi về enterprise security → refer sang Cloudgate, không tự nhận. Nếu khách Cloudgate hỏi về marketing → refer sang Markee. Chúng ta làm tốt nhất khi ở đúng domain của mình.",
      detailEn: "If a Markee client asks about enterprise security → refer to Cloudgate, do not take it. If a Cloudgate client asks about marketing → refer to Markee. We perform best when staying in our own domain.",
    },
  ];

  const donts: CultureItem[] = [
    {
      id: "dont-1",
      titleVi: "🚫 Nhận custom request ngoài scope",
      titleEn: "🚫 Take custom out-of-scope requests",
      keypointVi: "Từ chối custom request phá vỡ quy trình chuẩn, dù thêm tiền.",
      keypointEn: "Reject custom requests that break standard workflows, even for extra money.",
      detailVi: "Khi một khách nói \"anh làm thêm cái X được không?\" và bạn nói có → bạn vừa phá vỡ template chuẩn của cả team. Mỗi custom request = một đêm thêm giờ cho tech team = không scale được. Câu trả lời mặc định là \"ngoài scope, chúng em sẽ báo giá riêng.\"",
      detailEn: "When a client asks 'can you add X?' and you say yes → you just broke the team's standard template. Each custom request = an extra night for the tech team = unscalable. Default answer is 'out of scope, we will quote separately.'",
    },
    {
      id: "dont-2",
      titleVi: "🚫 Post promotional content trên SecurityZone",
      titleEn: "🚫 Post promotional content on SecurityZone",
      keypointVi: "Chỉ post nội dung có ích cho cộng đồng, không bán hàng.",
      keypointEn: "Only post useful community content, no direct selling.",
      detailVi: "Đừng post \"Markee đang sale 30%\" hay \"Cloudgate mở dịch vụ mới\" lên SecurityZone Telegram hay Facebook. Community sẽ mất niềm tin ngay lập tức và dừng theo dõi. SecurityZone chỉ post content có ích cho IT community — không bán hàng.",
      detailEn: "Do not post 'Markee is 30% off' or 'Cloudgate launches new service' on SecurityZone channels. The community will lose trust and stop following immediately. SecurityZone only posts useful content for the IT community — no sales.",
    },
    {
      id: "dont-3",
      titleVi: "🚫 Scale team bằng cách hire thêm người",
      titleEn: "🚫 Scale the team by hiring headcount",
      keypointVi: "Build thêm automation để scale, không hire headcount.",
      keypointEn: "Build more automation to scale, do not hire headcount.",
      detailVi: "Khi team bắt đầu nói \"cần hire thêm 2 người để handle khách mới\" — đó là dấu hiệu nguy hiểm. Câu đúng phải là \"cần build thêm automation gì để 1 người handle được gấp đôi khách\". Chúng ta scale bằng hệ thống, không phải headcount.",
      detailEn: "When the team says 'we need to hire 2 more people for new clients' — that's a dangerous sign. The correct question is 'what automation do we build so 1 person handles twice the clients'. We scale by systems, not headcount.",
    },
    {
      id: "dont-4",
      titleVi: "🚫 Nói \"AI tự động hoàn toàn\"",
      titleEn: "🚫 Say \"fully automated AI\"",
      keypointVi: "Tránh tạo kỳ vọng sai, luôn bán kết quả thực tế trong Phase 1.",
      keypointEn: "Avoid false expectations, always sell realistic outcomes in Phase 1.",
      detailVi: "Phase 1 team mình vẫn làm 50–70% công việc thật sự. Nói \"AI tự động hết\" là tạo kỳ vọng sai → khách thất vọng khi thấy team mình phải involve nhiều. Đúng nhất là: \"Đội ngũ Markee + AI làm cho bạn — kết quả nhanh hơn, tốt hơn agency thường.\" Và khi nói về AI, nói về kết quả: \"Rep inbox dưới 1 phút\", \"follow-up tự động\" — không nói về technology.",
      detailEn: "In Phase 1, our team still does 50-70% of the real work. Saying 'AI automates everything' sets wrong expectations → clients get disappointed seeing our involvement. Correct phrasing: 'Markee team + AI works for you — faster, better results than typical agencies.' When talking about AI, talk about outcomes: 'rep inbox under 1 min' — not technology.",
    },
  ];

  return (
    <section className={`relative overflow-hidden bg-[#120d14] py-20 sm:py-24 lg:py-20 ${selectedItem ? "z-[999]" : "z-0"}`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(255,102,128,0.26)_0%,rgba(18,13,20,0)_42%),linear-gradient(to_right,rgba(255,144,165,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,144,165,0.06)_1px,transparent_1px)] bg-[size:auto,64px_64px,64px_64px]" />
      <div className="pointer-events-none absolute left-1/2 top-[18%] h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,77,95,0.2)_0%,rgba(18,13,20,0)_72%)] blur-3xl" />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[32%] h-px bg-gradient-to-r from-transparent via-[#ff7b95]/70 to-transparent"
        animate={{ opacity: [0.2, 0.8, 0.2] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-0 h-full w-[28rem] -skew-x-12 bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,157,177,0.24)_48%,rgba(255,255,255,0)_100%)] blur-2xl"
        animate={{ x: ["-40vw", "120vw"] }}
        transition={{ duration: 6.2, repeat: Infinity, ease: "linear" }}
      />

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
          <div className="mx-auto mt-5 max-w-[1180px] overflow-visible">
            <p className="text-center text-[0.95rem] leading-7 text-white/80 sm:text-[1rem] lg:text-[1.05rem]">
              {tx(
                "Những điều này không phải \"rule\" cứng nhắc. Chúng là kết quả của nhiều bài học thực tế. Hiểu lý do đằng sau quan trọng hơn chỉ nhớ quy tắc.",
                "These are not rigid 'rules'. They are the result of many real-world lessons. Understanding the 'why' is more important than memorizing the rule."
              )}
            </p>
          </div>
        </motion.div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* DOS SECTION */}
          <div className="space-y-4">
            <motion.h3 {...fadeUp(0.1)} className="text-xl font-bold text-white flex items-center gap-2 mb-6">
              <CheckCircle2 className="h-6 w-6 text-emerald-400" />
              {tx("✅ Team mình LUÔN làm:", "✅ Our team ALWAYS does:")}
            </motion.h3>
            
            {dos.map((item, index) => (
              <motion.article
                key={item.id}
                {...fadeUp(0.15 + index * 0.05)}
                whileHover={{ y: -4 }}
                className="rounded-[20px] border border-emerald-500/20 bg-white/[0.04] p-4 backdrop-blur-[2px] shadow-[0_18px_44px_-30px_rgba(0,0,0,0.6)] sm:p-5"
              >
                <p className="text-[1rem] leading-[1.3] font-bold tracking-[-0.01em] text-white">
                  {tx(item.titleVi, item.titleEn)}
                </p>
                <p className="mt-1.5 text-[0.85rem] leading-5 text-emerald-100/80">
                  {tx(item.keypointVi, item.keypointEn)}
                </p>
                <button
                  onClick={() => setSelectedItem(item)}
                  className="mt-3 inline-flex items-center gap-1 text-[0.8rem] font-semibold text-emerald-400 opacity-80 hover:opacity-100 transition-opacity"
                >
                  {tx("Xem chi tiết", "View details")}
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </motion.article>
            ))}
          </div>

          {/* DONTS SECTION */}
          <div className="space-y-4">
            <motion.h3 {...fadeUp(0.1)} className="text-xl font-bold text-white flex items-center gap-2 mb-6">
              <XCircle className="h-6 w-6 text-red-400" />
              {tx("❌ Team mình KHÔNG làm:", "❌ Our team NEVER does:")}
            </motion.h3>
            
            {donts.map((item, index) => (
              <motion.article
                key={item.id}
                {...fadeUp(0.15 + index * 0.05)}
                whileHover={{ y: -4 }}
                className="rounded-[20px] border border-red-500/20 bg-white/[0.04] p-4 backdrop-blur-[2px] shadow-[0_18px_44px_-30px_rgba(0,0,0,0.6)] sm:p-5"
              >
                <p className="text-[1rem] leading-[1.3] font-bold tracking-[-0.01em] text-white">
                  {tx(item.titleVi, item.titleEn)}
                </p>
                <p className="mt-1.5 text-[0.85rem] leading-5 text-red-100/80">
                  {tx(item.keypointVi, item.keypointEn)}
                </p>
                <button
                  onClick={() => setSelectedItem(item)}
                  className="mt-3 inline-flex items-center gap-1 text-[0.8rem] font-semibold text-red-400 opacity-80 hover:opacity-100 transition-opacity"
                >
                  {tx("Xem chi tiết", "View details")}
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </motion.article>
            ))}
          </div>
        </div>

        <motion.div {...fadeUp(0.4)} className="mt-14 rounded-3xl border border-[#ffb8c9]/20 bg-[#3a1b2a]/40 px-6 py-8 text-center backdrop-blur-sm sm:px-10">
          <p className="text-xs font-semibold tracking-[0.15em] text-[#ffb8c9] uppercase mb-4">{tx("Câu chốt quan trọng nhất", "The most important takeaway")}</p>
          <p className="mx-auto max-w-[1020px] text-[1.1rem] font-bold leading-8 text-white sm:text-[1.25rem] sm:leading-9">
            {tx(
              <>
                "Mỗi client không chỉ là doanh thu — mỗi client là một bài học để mình build sản phẩm tốt hơn.<br />
                <span className="text-[#ffb8c9]">Làm tốt, học nhanh, build đúng.</span>"
              </>,
              <>
                "Every client is not just revenue — every client is a lesson to build a better product.<br />
                <span className="text-[#ffb8c9]">Do it well, learn fast, build right.</span>"
              </>
            )}
          </p>
        </motion.div>
      </div>

      {/* POPUP MODAL */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 px-4 sm:px-6">
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
              className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-[#2a1722] border border-[#ffb8c9]/30 p-6 sm:p-8 shadow-2xl z-10"
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute right-5 top-5 rounded-full p-2 hover:bg-white/10 transition-colors"
              >
                <XIcon className="h-5 w-5 text-[#ffd2dc]" />
              </button>
              
              <div>
                <h3 className="mt-1 text-xl font-bold text-white pr-6">{tx(selectedItem.titleVi, selectedItem.titleEn)}</h3>
                


                <div className="mt-5 space-y-4">
                  <p className="text-[1rem] leading-7 text-white/80">
                    {tx(selectedItem.detailVi, selectedItem.detailEn)}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
