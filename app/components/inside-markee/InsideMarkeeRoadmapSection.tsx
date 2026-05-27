"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useInsideMarkeeLocale } from "./useInsideMarkeeLocale";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] as const },
  viewport: { once: true, amount: 0.2 },
});

type PhaseBlock = {
  phase: string;
  marker: string;
  tagVi: string;
  tagEn: string;
  timelineVi: string;
  timelineEn: string;
  paragraphsVi: string[];
  paragraphsEn: string[];
};

export default function InsideMarkeeRoadmapSection() {
  const { tx } = useInsideMarkeeLocale();
  const gateTips = [
    tx("Đúng gate", "Right gate"),
    tx("Đúng nhịp", "Right rhythm"),
    tx("Đúng nguồn lực", "Right resources"),
    tx("Đúng thời điểm scale", "Right timing to scale"),
  ];

  const phases: PhaseBlock[] = [
    {
      phase: "Phase 1",
      marker: "1",
      tagVi: "Giai đoạn hiện tại - TẤT CẢ TẬP TRUNG VÀO ĐÂY",
      tagEn: "Current phase - FULL FOCUS HERE",
      timelineVi: "Tháng 0 -> Tháng 6",
      timelineEn: "Month 0 -> Month 6",
      paragraphsVi: [
        '🔥 "Đi làm, đi học, đi kiếm khách".',
        "Markee bán đội marketing + công nghệ thuê ngoài cho SME: chạy ads, làm web, build chatbot, viết content, báo cáo tuần.",
        "Vừa làm vừa học: mỗi client là một bài học để team dev tự động hóa dần, tháng sau nhanh hơn tháng trước.",
        "Gate cần đạt: 150 triệu/tháng MRR (khoảng 7-10 client ổn định, mỗi client 15-20 triệu/tháng).",
      ],
      paragraphsEn: [
        '🔥 "Execute, learn, and win clients."',
        "Markee runs done-for-you marketing + technology delivery for SMEs.",
        "Each client becomes learning data to automate workflows and increase monthly execution speed.",
        "Phase gate target: 150M VND MRR with 7-10 stable clients.",
      ],
    },
    {
      phase: "Phase 2",
      marker: "2",
      tagVi: "Sắp tới",
      tagEn: "Coming next",
      timelineVi: "Tháng 7 -> Tháng 12",
      timelineEn: "Month 7 -> Month 12",
      paragraphsVi: [
        '🚀 "Tự động hóa mạnh hơn, mở rộng thị trường".',
        "Khi Phase 1 ổn định, tăng tỷ lệ AI và build MarkeeAI thành platform để khách tự dùng một phần.",
        "Phase 1 và Phase 2 chạy song song: vừa done-for-you vừa self-serve có hướng dẫn.",
        "Cloudgate được Markee hỗ trợ marketing + showcase để mở rộng khách enterprise, nhưng hai mảng vẫn độc lập tài chính.",
      ],
      paragraphsEn: [
        '🚀 "Stronger automation, broader market."',
        "After Phase 1 stabilizes, increase AI ratio and package MarkeeAI into platform layers.",
        "Team-assisted delivery and partial self-serve run in parallel.",
        "Markee supports Cloudgate's marketing/showcase while both streams stay financially independent.",
      ],
    },
    {
      phase: "Phase 3",
      marker: "3",
      tagVi: "Tương lai gần",
      tagEn: "Near future",
      timelineVi: "Tháng 13 -> Tháng 24",
      timelineEn: "Month 13 -> Month 24",
      paragraphsVi: [
        '📈 "Mở rộng đa ngành, đa sản phẩm".',
        "Markee mở rộng sang nhiều ngành hơn, MarkeeAI SaaS có hàng trăm client tự dùng.",
        "Cloudgate bắt đầu win được các deal enterprise lớn (500 triệu -> 2 tỷ/deal).",
        "SecurityZone có 10,000+ thành viên, tổ chức conference hàng năm, được biết đến là cộng đồng tech uy tín nhất Việt Nam.",
      ],
      paragraphsEn: [
        '📈 "Multi-industry, multi-product expansion."',
        "Markee expands into more verticals and MarkeeAI SaaS reaches hundreds of active users.",
        "Cloudgate starts landing larger enterprise deals.",
        "SecurityZone scales to a large trusted tech community with annual conferences.",
      ],
    },
    {
      phase: "Phase 4",
      marker: "4",
      tagVi: "Tầm nhìn dài hạn",
      tagEn: "Long-term vision",
      timelineVi: "Tháng 24+",
      timelineEn: "Month 24+",
      paragraphsVi: [
        '🌟 "Hệ sinh thái hoàn chỉnh".',
        "SecurityZone thành platform đào tạo/chứng chỉ lớn; MarkeeAI thành SaaS marketing mạnh cho SME; Cloudgate thành đối tác enterprise tin cậy.",
        "Ba engine chạy song song, feed lẫn nhau và tạo vòng lặp tăng trưởng tự nhiên.",
        "Mỗi engine tự đứng vững nhưng vẫn liên kết để tối ưu tăng trưởng dài hạn cho toàn hệ.",
      ],
      paragraphsEn: [
        '🌟 "Complete ecosystem."',
        "SecurityZone becomes a major training/certification platform, MarkeeAI a leading SME marketing SaaS, and Cloudgate a trusted enterprise technology partner.",
        "All engines run in parallel and compound naturally.",
        "Each engine stands independently while still optimizing long-term growth together.",
      ],
    },
  ];

  return (
    <section className="relative overflow-hidden py-20 sm:py-24 lg:py-28">
      <div className="absolute inset-0">
        <div className="absolute inset-0 sm:hidden">
          <Image
            src="/bg6.png"
            alt="Roadmap mountain background"
            fill
            className="object-cover object-[58%_100%] scale-[1.16] brightness-[1.14] saturate-[1.1]"
            priority={false}
          />
        </div>
        <div className="absolute inset-0 hidden sm:block">
          <Image
            src="/bg6.png"
            alt="Roadmap mountain background"
            fill
            className="object-cover object-[72%_0%]"
            priority={false}
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(170deg,rgba(18,10,16,0.74)_0%,rgba(18,10,16,0.56)_38%,rgba(18,10,16,0.18)_72%,rgba(18,10,16,0.04)_100%)] sm:bg-[linear-gradient(98deg,rgba(18,10,16,0.82)_0%,rgba(18,10,16,0.64)_34%,rgba(18,10,16,0.34)_55%,rgba(18,10,16,0.12)_72%,rgba(18,10,16,0.05)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_58%_90%,rgba(255,123,149,0.3)_0%,rgba(255,255,255,0)_48%)] sm:bg-[radial-gradient(circle_at_16%_88%,rgba(255,123,149,0.24)_0%,rgba(255,255,255,0)_42%)]" />
      </div>

      <div className="relative mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
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

        <motion.div {...fadeUp(0.1)} className="mt-14 hidden max-w-[920px] lg:block">
          <div className="relative">
            <div className="absolute left-[12.5%] right-[12.5%] top-[18px] z-0 h-[2px] bg-[linear-gradient(to_right,rgba(255,192,206,0.42)_0%,rgba(255,192,206,0.95)_52%,rgba(255,192,206,0.42)_100%)]" />
            <div className="grid grid-cols-4 gap-4">
              {phases.map((phase, index) => (
                <div key={`top-${phase.phase}`} className="pt-0.5 text-center">
                  <span className="relative z-20 mx-auto inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#ffb8c9]/90 bg-[#fff3f7] text-sm font-bold text-[#ff4d5f] shadow-[0_10px_24px_-14px_rgba(255,77,95,0.7)]">
                    {index + 1}
                  </span>
                  <p className="mt-2.5 text-[1.05rem] font-bold text-white">{phase.phase}</p>
                  <p className="mt-0.5 text-xs font-semibold tracking-[0.12em] text-[#ffd2dc] uppercase">{tx(phase.timelineVi, phase.timelineEn)}</p>
                </div>
              ))}
            </div>

            <div className="mt-7 grid grid-cols-4 gap-3">
              {gateTips.map((tip) => (
                <div key={tip} className="rounded-full border border-white/28 bg-black/20 px-3 py-1.5 text-center text-xs font-semibold text-[#ffd7df]">
                  {tip}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="mt-10 grid gap-3 lg:mt-14 lg:grid-cols-4">
          {phases.map((phase, index) => (
            <motion.article
              key={phase.phase}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.48, delay: 0.08 + index * 0.06 }}
              viewport={{ once: true, amount: 0.2 }}
              className="relative overflow-hidden rounded-[22px] border border-white/40 bg-[#3a2834]/72 px-4 py-4 text-white/95 shadow-[0_22px_45px_-24px_rgba(12,4,9,0.85)] backdrop-blur-md lg:min-h-[360px]"
            >
              <motion.div
                aria-hidden
                className="pointer-events-none absolute -left-[58%] -top-[68%] h-[225%] w-[42%] rotate-[26deg] bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.24)_50%,rgba(255,255,255,0)_100%)]"
                animate={{ x: ["0%", "260%"], y: ["0%", "190%"] }}
                transition={{ duration: 4.8, delay: index * 0.45, repeat: Infinity, ease: "linear" }}
              />
              <p className="text-xs font-semibold tracking-[0.12em] text-[#ffd2dc] uppercase">{tx(phase.tagVi, phase.tagEn)}</p>
              <p className="mt-2 text-[1.08rem] font-bold text-white">{phase.phase}</p>
              <p className="text-xs font-semibold tracking-[0.12em] text-[#ffd2dc] uppercase">{tx(phase.timelineVi, phase.timelineEn)}</p>
              <div className="mt-3 space-y-2.5">
                {phase.paragraphsVi.map((paragraph, idx) => (
                  <p key={`${phase.phase}-${idx}`} className="text-[0.92rem] leading-7 text-white/92">
                    {tx(paragraph, phase.paragraphsEn[Math.min(idx, phase.paragraphsEn.length - 1)])}
                  </p>
                ))}
              </div>
            </motion.article>
          ))}
        </div>

        <motion.article
          {...fadeUp(0.24)}
          className="mt-6 rounded-[22px] border border-[#ffb8c9]/55 bg-[#3a1b2a]/55 px-5 py-4 text-white/92 backdrop-blur-sm"
        >
          <p className="text-xs font-semibold tracking-[0.13em] text-[#ffd2dc] uppercase">{tx("⚠️ Quan trọng", "⚠️ Important")}</p>
          <p className="mt-2 text-sm leading-7 sm:text-base">
            {tx(
              "Chỉ chuyển sang giai đoạn tiếp theo khi đạt đủ điều kiện - không rush, không bỏ qua bước. Nếu gate chưa đạt, không rút nguồn lực sang phase sau.",
              "Move to the next phase only when gates are met. No rushing, no skipped steps. Without the gate, no resource shift. This discipline keeps the system alive."
            )}
          </p>
        </motion.article>
      </div>
    </section>
  );
}
