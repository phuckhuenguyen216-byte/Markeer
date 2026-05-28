"use client";

import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useState, useRef } from "react";
import { useInsideMarkeeLocale } from "./useInsideMarkeeLocale";
import { ChevronRight, X } from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] as const },
  viewport: { once: true, amount: 0.2 },
});

type PhaseBlock = {
  phaseVi: string;
  phaseEn: string;
  marker: string;
  tagVi: string;
  tagEn: string;
  timelineVi: string;
  timelineEn: string;
  keypointVi: string;
  keypointEn: string;
  ctaVi: string;
  ctaEn: string;
  isCurrent: boolean;
  shortTitleVi: string;
  shortTitleEn: string;
  paragraphsVi: string[];
  paragraphsEn: string[];
};

export default function InsideMarkeeRoadmapSection() {
  const { tx } = useInsideMarkeeLocale();
  const [selectedPhase, setSelectedPhase] = useState<PhaseBlock | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const mountainScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const progressWidth = useTransform(scrollYProgress, [0.1, 0.7], ["0%", "100%"]);



  const phases: PhaseBlock[] = [
    {
      phaseVi: "Phase 1 — \"Đi làm, đi kiếm khách\"",
      phaseEn: "Phase 1 — \"Get to work, get clients\"",
      marker: "1",
      tagVi: "Giai đoạn hiện tại",
      tagEn: "Current phase",
      timelineVi: "Tháng 0 → Tháng 6",
      timelineEn: "Month 0 → Month 6",
      keypointVi: "Xây nền doanh thu ổn định từ dịch vụ trước khi scale sản phẩm.",
      keypointEn: "Build stable service revenue foundation before scaling product.",
      ctaVi: "Vì sao roadmap này tồn tại?",
      ctaEn: "Why does this roadmap exist?",
      isCurrent: true,
      shortTitleVi: "Phase 1",
      shortTitleEn: "Phase 1",
      paragraphsVi: [
        "Hãy tưởng tượng một chủ homestay ở Đà Nẵng — anh ấy vừa lo đón khách, vừa tự post Facebook, vừa tự rep inbox, vừa không có website đàng hoàng. Markee đến và nói: \"Để tụi mình lo hết phần marketing và công nghệ cho anh. Anh chỉ cần lo vận hành homestay tốt.\"",
        "Đó là những gì Markee bán — không phải AI, không phải chatbot, mà là \"đội marketing + công nghệ thuê ngoài\" cho SME. Team mình làm thật: chạy ads, làm web, build chatbot, viết content, báo cáo tuần. MarkeeAI và các tool là vũ khí giúp team làm nhanh hơn, tốt hơn đối thủ — nhưng vẫn cần người thật làm.",
        "Vừa làm vừa học và cải thiện: Mỗi client là một bài học. AI làm tốt chỗ nào, con người làm tốt chỗ nào, quy trình nào có thể tự động hóa được → team dev tự động hóa dần. Tháng sau làm nhanh hơn tháng trước.",
        "🎯 Mục tiêu Phase 1 cần đạt: 150 triệu/tháng MRR (tức là khoảng 7–10 client ổn định, mỗi client trả trung bình 15–20 triệu/tháng). Đạt được con số này là mình đã chứng minh mô hình hoạt động và bước tiếp."
      ],
      paragraphsEn: [
        "Imagine a homestay owner in Da Nang — welcoming guests, posting on Facebook, replying to inboxes, without a proper website. Markee steps in: 'We handle marketing and tech. You focus on operations.'",
        "That's what we sell — an outsourced marketing + tech team, not just AI or chatbots. We execute: ads, websites, chatbots, content, reports. MarkeeAI is our weapon to work faster and better than competitors.",
        "Learn and improve: Every client is a lesson. What AI does well, what humans do well, what can be automated → our dev team automates step by step. Next month is faster than the previous.",
        "🎯 Phase 1 goal: 150M/month MRR (7-10 stable clients at 15-20M/month). Achieving this validates our model to move forward."
      ],
    },
    {
      phaseVi: "Phase 2 — \"Tự động hóa mạnh hơn\"",
      phaseEn: "Phase 2 — \"Stronger automation\"",
      marker: "2",
      tagVi: "Sắp tới",
      tagEn: "Coming next",
      timelineVi: "Tháng 7 → Tháng 12",
      timelineEn: "Month 7 → Month 12",
      keypointVi: "Mở rộng MarkeeAI thành nền tảng self-serve, gia tăng biên lợi nhuận.",
      keypointEn: "Expand MarkeeAI into self-serve platform, increasing profit margins.",
      ctaVi: "Khám phá chiến lược",
      ctaEn: "Discover strategy",
      isCurrent: false,
      shortTitleVi: "Phase 2",
      shortTitleEn: "Phase 2",
      paragraphsVi: [
        "Khi Phase 1 ổn định, mình tăng tỷ lệ AI lên và bắt đầu build MarkeeAI thành platform — khách có thể tự dùng một phần mà không cần team setup hoàn toàn.",
        "Hình dung đơn giản: Phase 1 là \"nhà hàng\" (team Markee nấu cho bạn ăn). Phase 2 là \"siêu thị + bếp mẫu\" (có người hướng dẫn, nhưng bạn có thể tự làm một phần). Cả hai tồn tại song song — không ai bị bỏ lại.",
        "Cloudgate trong Phase 2: Cloudgate đã có team truyền thống về IT và security rồi. Phase này Markee hỗ trợ Cloudgate thêm về marketing và showcase — giúp Cloudgate có thêm khách hàng, không phải Markee \"nuôi\" Cloudgate. Hai mảng song song, không phụ thuộc nhau về tài chính."
      ],
      paragraphsEn: [
        "Once Phase 1 stabilizes, we increase the AI ratio and build MarkeeAI into a platform — clients can use parts of it without full team setup.",
        "Simply put: Phase 1 is a 'restaurant' (we cook for you). Phase 2 is a 'supermarket + display kitchen' (guided self-serve). Both exist in parallel.",
        "Cloudgate in Phase 2: Cloudgate has its traditional IT/security team. Markee supports Cloudgate with marketing to win clients. The two streams run parallel and financially independent."
      ],
    },
    {
      phaseVi: "Phase 3 — \"Đa ngành, đa sản phẩm\"",
      phaseEn: "Phase 3 — \"Multi-industry, multi-product\"",
      marker: "3",
      tagVi: "Tương lai gần",
      tagEn: "Near future",
      timelineVi: "Tháng 13 → Tháng 24",
      timelineEn: "Month 13 → Month 24",
      keypointVi: "Chiếm lĩnh đa ngành, chốt enterprise deal lớn, khẳng định vị thế.",
      keypointEn: "Dominate verticals, land enterprise deals, cement positioning.",
      ctaVi: "Xem chi tiết",
      ctaEn: "View details",
      isCurrent: false,
      shortTitleVi: "Phase 3",
      shortTitleEn: "Phase 3",
      paragraphsVi: [
        "Markee mở rộng sang nhiều ngành hơn (không chỉ mỹ phẩm, fashion, spa). MarkeeAI SaaS có hàng trăm client tự dùng. Cloudgate bắt đầu win được các deal enterprise lớn (500 triệu → 2 tỷ/deal).",
        "SecurityZone có 10,000+ thành viên, tổ chức conference hàng năm, được biết đến là cộng đồng tech uy tín nhất Việt Nam."
      ],
      paragraphsEn: [
        "Markee expands into more industries. MarkeeAI SaaS gets hundreds of self-serve clients. Cloudgate starts winning large enterprise deals (500M - 2B/deal).",
        "SecurityZone reaches 10,000+ members, hosts annual conferences, and becomes the most trusted tech community in Vietnam."
      ],
    },
    {
      phaseVi: "Phase 4 — \"Hệ sinh thái hoàn chỉnh\"",
      phaseEn: "Phase 4 — \"Complete ecosystem\"",
      marker: "4",
      tagVi: "Tầm nhìn dài hạn",
      tagEn: "Long-term vision",
      timelineVi: "Tháng 24+",
      timelineEn: "Month 24+",
      keypointVi: "Khép kín hệ sinh thái tự nuôi dưỡng và tăng trưởng không giới hạn.",
      keypointEn: "Close the self-sustaining ecosystem loop for unlimited growth.",
      ctaVi: "Tầm nhìn dài hạn",
      ctaEn: "Long-term vision",
      isCurrent: false,
      shortTitleVi: "Phase 4",
      shortTitleEn: "Phase 4",
      paragraphsVi: [
        "SecurityZone trở thành platform đào tạo và chứng chỉ bảo mật lớn nhất VN. MarkeeAI là SaaS marketing hàng đầu cho SME VN. Cloudgate là đối tác công nghệ tin cậy của các doanh nghiệp lớn.",
        "Ba engine chạy song song, feed lẫn nhau, tạo ra vòng lặp tăng trưởng tự nhiên."
      ],
      paragraphsEn: [
        "SecurityZone becomes the largest security training/certification platform in VN. MarkeeAI is the leading marketing SaaS for VN SMEs. Cloudgate is the trusted tech partner for large enterprises.",
        "The three engines run in parallel, feed each other, and create a natural growth loop."
      ],
    },
  ];

  return (
    <section ref={sectionRef} style={{ zIndex: selectedPhase ? 999 : 0 }} className="relative min-h-[100vh] flex flex-col justify-between overflow-hidden pt-20 sm:pt-24 lg:pt-28 pb-12">
      <div className="absolute inset-0 pointer-events-none">
        <motion.div style={{ scale: mountainScale }} className="absolute inset-0 sm:hidden origin-[58%_100%]">
          <Image
            src="/bg6.png"
            alt="Roadmap mountain background"
            fill
            className="object-cover object-[58%_100%] brightness-[1.14] saturate-[1.1]"
            priority={false}
          />
        </motion.div>
        <motion.div style={{ scale: mountainScale }} className="absolute inset-0 hidden sm:block origin-[72%_0%]">
          <Image
            src="/bg6.png"
            alt="Roadmap mountain background"
            fill
            className="object-cover object-[72%_0%]"
            priority={false}
          />
        </motion.div>
        <div className="absolute inset-0 bg-[linear-gradient(170deg,rgba(18,10,16,0.85)_0%,rgba(18,10,16,0.70)_38%,rgba(18,10,16,0.30)_72%,rgba(18,10,16,0.15)_100%)] sm:bg-[linear-gradient(98deg,rgba(18,10,16,0.92)_0%,rgba(18,10,16,0.75)_34%,rgba(18,10,16,0.45)_55%,rgba(18,10,16,0.25)_72%,rgba(18,10,16,0.15)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_58%_90%,rgba(255,123,149,0.3)_0%,rgba(255,255,255,0)_48%)] sm:bg-[radial-gradient(circle_at_16%_88%,rgba(255,123,149,0.24)_0%,rgba(255,255,255,0)_42%)]" />

        {/* Atmospheric Fill Effects (Fog, Path Glow, Particles) */}
        <motion.div 
          className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[80%] bg-[radial-gradient(ellipse_at_center,rgba(255,77,95,0.15)_0%,rgba(255,255,255,0)_70%)] blur-[100px] origin-bottom-right -rotate-[30deg]"
          style={{ opacity: useTransform(scrollYProgress, [0, 1], [0.6, 1]) }}
        />
        <div className="absolute top-[25%] left-0 right-0 h-[35%] bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,181,197,0.08)_50%,rgba(255,255,255,0)_100%)] blur-3xl" />
        <div className="absolute top-[35%] right-[25%] w-1.5 h-1.5 rounded-full bg-white/60 blur-[1px] shadow-[0_0_50px_15px_rgba(255,181,197,0.6),120px_60px_30px_8px_rgba(255,77,95,0.4),-180px_100px_40px_10px_rgba(255,181,197,0.3)] animate-pulse" />
      </div>

      <div className="relative mx-auto w-full max-w-[1380px] px-4 sm:px-6 lg:px-8">
        <motion.p {...fadeUp(0)} className="mk-eyebrow text-[#ffd7df] uppercase">
          {tx("04 · Lộ trình", "04 · Roadmap")}
        </motion.p>

        <motion.div {...fadeUp(0.04)} className="mt-5 max-w-[760px]">
          <h2 className="mk-section-title">
            <span className="block text-white">{tx("CHÚNG TA ĐANG Ở ĐÂU", "WHERE WE ARE")}</span>
            <span className="mk-section-title-accent block bg-gradient-to-r from-[#ffb5c5] via-[#ffdbe3] to-[#ffb5c5] bg-clip-text text-transparent">
              {tx("VÀ SẼ ĐẾN ĐÂU?", "AND WHERE WE GO?")}
            </span>
          </h2>
          <p className="mt-3 text-[1.02rem] leading-8 text-white/90 sm:text-[1.08rem]">
            {tx(
              "Team mình chia hành trình thành 4 giai đoạn. Hiểu rõ mình đang ở giai đoạn nào sẽ giúp bạn biết mình cần làm gì và không cần làm gì.",
              "Our journey has four phases. Knowing your current phase clarifies what to do now and what not to do yet."
            )}
          </p>
        </motion.div>



        <motion.article
          {...fadeUp(0.1)}
          className="mt-10 lg:mt-16 relative z-10 max-w-[420px] ml-2 lg:ml-0"
        >
          <div className="flex items-center gap-3 opacity-80">
            <div className="h-[1px] w-8 bg-[#ffb5c5]" />
            <p className="text-[0.65rem] font-bold tracking-[0.2em] text-[#ffb5c5] uppercase">{tx("✦ BASE CAMP RULE", "✦ BASE CAMP RULE")}</p>
          </div>
          <p className="mt-4 text-[1.15rem] sm:text-[1.25rem] leading-8 sm:leading-9 font-light text-white/90 italic tracking-wide">
            {tx(
              "\"Không unlock phase tiếp theo khi phase hiện tại chưa tự sustain.\"",
              "\"Do not unlock the next phase until the current phase is self-sustaining.\""
            )}
          </p>
        </motion.article>

        <div className="mt-16 lg:mt-20">
          <div className="mb-6 h-1 w-full max-w-[960px] rounded-full bg-white/10 overflow-hidden relative z-10 hidden sm:block mx-auto lg:mx-0">
            <motion.div 
              className="h-full bg-gradient-to-r from-[#ff4d5f] to-[#ffb5c5]" 
              style={{ width: progressWidth }}
            />
          </div>
          
          <div className="grid gap-4 lg:grid-cols-4">
            {phases.map((phase, index) => (
              <motion.article
                key={phase.phaseVi}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                viewport={{ once: true, amount: 0.2 }}
                onClick={() => setSelectedPhase(phase)}
                className={`relative cursor-pointer flex flex-col justify-between overflow-hidden rounded-[20px] px-4 py-4 backdrop-blur-md transition-all duration-700 ${
                  index === 0 ? "lg:mt-0" : index === 1 ? "lg:mt-6" : index === 2 ? "lg:mt-12" : "lg:mt-18"
                } ${
                  phase.isCurrent 
                    ? "border border-[#ff4d5f]/80 bg-[#3a1b2a]/90 shadow-[0_0_60px_rgba(255,77,95,0.5),inset_0_0_20px_rgba(255,77,95,0.15)] saturate-[1.2] ring-1 ring-[#ff4d5f]" 
                    : "border border-white/10 bg-[#3a2834]/40 grayscale-[60%] opacity-50 hover:grayscale-0 hover:opacity-100 hover:bg-[#3a2834]/80"
                }`}
              >
                {phase.isCurrent && (
                  <motion.div
                    aria-hidden
                    className="pointer-events-none absolute -left-[58%] -top-[68%] h-[225%] w-[42%] rotate-[26deg] bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.24)_50%,rgba(255,255,255,0)_100%)]"
                    animate={{ x: ["0%", "260%"], y: ["0%", "190%"] }}
                    transition={{ duration: 4.8, delay: index * 0.45, repeat: Infinity, ease: "linear" }}
                  />
                )}
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[0.65rem] font-bold tracking-[0.12em] text-[#ffd2dc] uppercase">{tx(phase.tagVi, phase.tagEn)}</p>
                    {phase.isCurrent && (
                      <span className="rounded-full bg-[#ff4d5f] px-2 py-0.5 text-[0.6rem] font-bold text-white uppercase tracking-wider animate-pulse">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-[1.1rem] font-bold text-white">{tx(phase.phaseVi, phase.phaseEn)}</p>
                  <p className="mt-0.5 text-[0.65rem] font-semibold tracking-[0.12em] text-[#ffb5c5] uppercase">{tx(phase.timelineVi, phase.timelineEn)}</p>
                  <p className={`mt-2 text-[0.9rem] leading-[1.6] font-medium ${phase.isCurrent ? "text-white" : "text-white/85"}`}>
                    {tx(phase.keypointVi, phase.keypointEn)}
                  </p>
                </div>

                <button
                  className={`mt-4 inline-flex items-center gap-1.5 text-[0.8rem] font-bold transition-colors relative z-10 pointer-events-none ${
                    phase.isCurrent ? "text-[#ffb5c5] hover:text-white" : "text-white/70 hover:text-white"
                  }`}
                >
                  {tx(phase.ctaVi, phase.ctaEn)}
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </motion.article>
            ))}
          </div>
        </div>

      </div>

      <AnimatePresence>
        {selectedPhase && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPhase(null)}
              className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-[#2a1722] border border-[#ffb8c9]/40 p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedPhase(null)}
                className="absolute right-5 top-5 rounded-full p-2 hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5 text-[#ffd2dc]" />
              </button>
              
              <div>
                <p className="text-xs font-semibold tracking-[0.12em] text-[#ffd2dc] uppercase">{tx(selectedPhase.tagVi, selectedPhase.tagEn)}</p>
                <h3 className="mt-1 text-2xl font-bold text-white">{tx(selectedPhase.phaseVi, selectedPhase.phaseEn)}</h3>
                <p className="mt-1 text-sm font-semibold tracking-[0.12em] text-[#ffb5c5] uppercase">{tx(selectedPhase.timelineVi, selectedPhase.timelineEn)}</p>
                
                <div className="mt-6 space-y-4">
                  {selectedPhase.paragraphsVi.map((paragraph, idx) => (
                    <p key={`popup-${selectedPhase.phaseVi}-${idx}`} className="text-[0.98rem] leading-7 text-white/90">
                      {tx(paragraph, selectedPhase.paragraphsEn[Math.min(idx, selectedPhase.paragraphsEn.length - 1)])}
                    </p>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
