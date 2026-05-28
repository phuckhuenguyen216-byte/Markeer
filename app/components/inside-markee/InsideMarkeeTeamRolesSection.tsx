"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Compass, Handshake, Rocket, Settings2, Shield, Target, X, ChevronRight, ChevronDown } from "lucide-react";
import { useState, type ComponentType } from "react";
import { useInsideMarkeeLocale } from "./useInsideMarkeeLocale";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] as const },
  viewport: { once: true, amount: 0.2 },
});

type RoleCard = {
  id: string;
  roleVi: string;
  roleEn: string;
  teamVi: string;
  teamEn: string;
  keypointVi: string;
  keypointEn: string;
  summaryVi: string;
  summaryEn: string;
  kpiVi: string;
  kpiEn: string;
  type: "core" | "support";
  Icon: ComponentType<{ className?: string }>;
  iconClass: string;
};

export default function InsideMarkeeTeamRolesSection() {
  const { tx } = useInsideMarkeeLocale();
  const [selectedRole, setSelectedRole] = useState<RoleCard | null>(null);

  const roleCards: RoleCard[] = [
    {
      id: "sdr",
      roleVi: "SDR",
      roleEn: "SDR",
      teamVi: "Core Engine",
      teamEn: "Core Engine",
      keypointVi: "Tìm đúng pain trước khi thị trường kịp nhận ra.",
      keypointEn: "Find the right pain before the market realizes it.",
      summaryVi: '"Thám tử tìm người đang đau". Tìm đúng page/người có pain thật, nhắn tin cá nhân hóa dựa trên vấn đề thực tế thay vì spam.',
      summaryEn: '"Pain detective." Find real pain signals and send personalized outreach instead of spam.',
      kpiVi: "KPI: 15 prospects audit/ngày -> 10 DMs cá nhân hóa -> 1-2 cuộc call được book.",
      kpiEn: "KPI: 15 prospect audits/day -> 10 personalized DMs -> 1-2 booked calls.",
      type: "core",
      Icon: Compass,
      iconClass: "text-[#be123c]",
    },
    {
      id: "sales",
      roleVi: "Sales",
      roleEn: "Sales",
      teamVi: "Core Engine",
      teamEn: "Core Engine",
      keypointVi: "Biến data thành quyết định mua hàng.",
      keypointEn: "Turn data into purchasing decisions.",
      summaryVi: '"Bác sĩ chẩn đoán và kê đơn". Hỏi đúng để hiểu pain, demo live trên data thật, tính ROI theo số thật và mời trial 14 ngày.',
      summaryEn: '"Diagnostic closer." Understand pain, run live demos on real data, calculate ROI, then offer a 14-day trial.',
      kpiVi: "KPI: 3-5 demos/ngày -> LOI signed 2-4/tuần -> trial-to-monthly >60%.",
      kpiEn: "KPI: 3-5 demos/day -> 2-4 LOIs/week -> trial-to-monthly >60%.",
      type: "core",
      Icon: Target,
      iconClass: "text-[#b45309]",
    },
    {
      id: "automation",
      roleVi: "Automation",
      roleEn: "Automation",
      teamVi: "Core Engine",
      teamEn: "Core Engine",
      keypointVi: "Scale thứ đã proven.",
      keypointEn: "Scale what has been proven.",
      summaryVi: '"Thợ lắp máy". Setup chatbot, automation, CRM, report đúng chuẩn trong 7 ngày và log các bước tốn thời gian để product hóa.',
      summaryEn: '"System builder." Set up chatbot, automation, CRM, reporting in 7 days and log time-heavy steps for productization.',
      kpiVi: "KPI: Onboard xong trong 7 ngày · uptime 99%+ · log setup time mỗi task.",
      kpiEn: "KPI: 7-day onboarding · 99%+ uptime · setup-time logging per task.",
      type: "core",
      Icon: Settings2,
      iconClass: "text-[#1d4ed8]",
    },
    {
      id: "csm",
      roleVi: "CSM",
      roleEn: "CSM",
      teamVi: "Support & Expansion",
      teamEn: "Support & Expansion",
      keypointVi: "Giữ trust và mở rộng lifetime value.",
      keypointEn: "Maintain trust and expand lifetime value.",
      summaryVi: '"Người bảo vệ client". Giữ retention qua báo cáo tuần, review tháng, phát hiện sớm risk và mở cơ hội upsell.',
      summaryEn: '"Client guardian." Protect retention with weekly reports, monthly reviews, early risk detection, and upsell signals.',
      kpiVi: "KPI: Churn <5%/tháng · NPS >60 · upsell rate 20% trong 6 tháng.",
      kpiEn: "KPI: Churn <5%/month · NPS >60 · 20% upsell rate in 6 months.",
      type: "support",
      Icon: Handshake,
      iconClass: "text-[#1e40af]",
    },
    {
      id: "community",
      roleVi: "Community",
      roleEn: "Community",
      teamVi: "Support & Expansion",
      teamEn: "Support & Expansion",
      keypointVi: "Biến audience thành network.",
      keypointEn: "Turn the audience into a network.",
      summaryVi: '"Người giữ lửa cộng đồng". Chạy Telegram/events/forum, giữ nội dung 100% hữu ích cho cộng đồng công nghệ, không bán hàng trực tiếp.',
      summaryEn: '"Community firekeeper." Operate Telegram/events/forum with 100% useful tech content and no direct selling.',
      kpiVi: "KPI: Telegram subs +200/tuần · 1 event/tháng · content 100% security/tech.",
      kpiEn: "KPI: +200 Telegram subs/week · 1 event/month · 100% security/tech content.",
      type: "support",
      Icon: Shield,
      iconClass: "text-[#6d28d9]",
    },
    {
      id: "leadership",
      roleVi: "Leadership",
      roleEn: "Leadership",
      teamVi: "Support & Expansion",
      teamEn: "Support & Expansion",
      keypointVi: "Giữ direction và nhịp tăng trưởng.",
      keypointEn: "Maintain direction and growth rhythm.",
      summaryVi: '"Vừa chèo thuyền vừa vẽ bản đồ". Phase 1 ưu tiên 70% close deals Markee bằng tay, 30% xây quan hệ cho Cloudgate.',
      summaryEn: '"Row the boat while drawing the map." In Phase 1: 70% direct deal closing for Markee, 30% relationship building for Cloudgate.',
      kpiVi: "KPI: Close 10 deals đầu bằng tay · LinkedIn 3 posts/tuần · VNISA active member.",
      kpiEn: "KPI: First 10 deals closed manually · 3 LinkedIn posts/week · active VNISA member.",
      type: "support",
      Icon: Rocket,
      iconClass: "text-[#be123c]",
    },
  ];

  const ConnectorRight = () => (
    <div className="absolute top-1/2 -right-8 w-8 h-[2px] bg-[linear-gradient(90deg,rgba(255,77,95,0.2)_0%,rgba(255,77,95,0.8)_100%)] hidden lg:block z-0">
      <div className="absolute inset-0 bg-white/60 blur-[3px] animate-pulse" />
    </div>
  );
  
  const ConnectorDown = () => (
    <div className="absolute -bottom-8 left-1/2 w-[2px] h-8 bg-[linear-gradient(180deg,rgba(255,77,95,0.2)_0%,rgba(255,77,95,0.8)_100%)] hidden lg:block z-0">
      <div className="absolute inset-0 bg-white/60 blur-[3px] animate-pulse" />
    </div>
  );
  
  const ConnectorLeft = () => (
    <div className="absolute top-1/2 -left-8 w-8 h-[2px] bg-[linear-gradient(270deg,rgba(255,77,95,0.2)_0%,rgba(255,77,95,0.8)_100%)] hidden lg:block z-0">
      <div className="absolute inset-0 bg-white/60 blur-[3px] animate-pulse" />
    </div>
  );

  const RoleCardItem = ({ card }: { card: RoleCard }) => {
    const Icon = card.Icon;
    const isCore = card.type === "core";
    
    return (
      <motion.article
        whileHover={{ y: -4 }}
        onClick={() => setSelectedRole(card)}
        className={`group relative z-10 cursor-pointer flex flex-col justify-between rounded-[22px] border border-white/50 bg-white/50 backdrop-blur-xl p-5 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.06)] hover:shadow-[0_0_30px_rgba(255,77,95,0.18)] transition-all h-full`}
      >
        <div>
          <p className={`inline-flex items-center gap-2 font-bold ${isCore ? 'text-[1.1rem]' : 'text-[1rem]'} ${card.iconClass}`}>
            <Icon className={isCore ? 'h-5 w-5' : 'h-4 w-4'} />
            {tx(card.roleVi, card.roleEn)}
          </p>
          <p className="mt-1.5 text-[0.65rem] font-bold tracking-[0.14em] text-[#ff4d5f]/80 uppercase">{tx(card.teamVi, card.teamEn)}</p>
          <p className={`mt-3 font-medium leading-7 text-[#321017]/90 ${isCore ? 'text-[1.05rem]' : 'text-[0.95rem]'}`}>
            {tx(card.keypointVi, card.keypointEn)}
          </p>
        </div>
        <button
          className={`mt-6 pointer-events-none inline-flex items-center gap-1 text-[0.8rem] font-bold text-[#ff4d5f] opacity-80 group-hover:opacity-100 transition-opacity`}
        >
          {tx("Xem chi tiết", "Details")}
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </motion.article>
    );
  };

  return (
    <section style={{ zIndex: selectedRole ? 999 : 0 }} className="relative overflow-hidden bg-[#fafafa] py-24 sm:py-28 lg:py-32">
      {/* Background System */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,92,118,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,92,118,0.03)_1px,transparent_1px)] bg-[size:62px_62px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,240,245,0.7)_0%,rgba(255,255,255,0)_60%)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(255,77,95,0.05)_0%,rgba(255,255,255,0)_70%)] blur-3xl" />

      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <motion.p {...fadeUp(0)} className="mk-eyebrow text-center text-[#ff4d5f] uppercase">
          {tx("06 · TƯ DUY VẬN HÀNH", "06 · OPERATING MINDSET")}
        </motion.p>

        <motion.div {...fadeUp(0.05)} className="mx-auto mt-7 max-w-[940px] text-center">
          <h2 className="mk-section-title">
            <span className="block text-[#321017]">{tx("MỖI ROLE LÀ MỘT MẮT XÍCH", "EACH ROLE IS ONE LINK")}</span>
            <span className="mk-section-title-accent block bg-gradient-to-r from-[#ff3f57] via-[#ff4d5f] to-[#ff748f] bg-clip-text text-transparent">
              {tx("TRONG MÁY TĂNG TRƯỞNG", "IN THE GROWTH ENGINE")}
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-[760px] text-[1.05rem] leading-8 text-[#5f1a22]/85 sm:text-[1.15rem]">
            {tx(
              "Không ai làm việc một mình. Mỗi role feed dữ liệu, trust và tăng trưởng cho role tiếp theo tạo thành một vòng lặp không ngừng nghỉ.",
              "No one works alone. Each role feeds data, trust, and growth to the next, forming an unstoppable loop."
            )}
          </p>
        </motion.div>

        {/* Desktop Pipeline Layout */}
        <motion.div {...fadeUp(0.1)} className="hidden lg:grid grid-cols-3 gap-8 mt-20 max-w-[1080px] mx-auto relative z-10">
          <div className="col-start-1 row-start-1 relative">
            <RoleCardItem card={roleCards[0]} />
            <ConnectorRight />
          </div>
          <div className="col-start-2 row-start-1 relative">
            <RoleCardItem card={roleCards[1]} />
            <ConnectorRight />
          </div>
          <div className="col-start-3 row-start-1 relative">
            <RoleCardItem card={roleCards[2]} />
            <ConnectorDown />
          </div>
          
          <div className="col-start-3 row-start-2 relative">
            <RoleCardItem card={roleCards[3]} />
            <ConnectorLeft />
          </div>
          <div className="col-start-2 row-start-2 relative">
            <RoleCardItem card={roleCards[4]} />
            <ConnectorLeft />
          </div>
          <div className="col-start-1 row-start-2 relative">
            <RoleCardItem card={roleCards[5]} />
          </div>
        </motion.div>

        {/* Mobile Layout */}
        <motion.div {...fadeUp(0.1)} className="flex lg:hidden flex-col gap-5 mt-12 max-w-[500px] mx-auto relative z-10">
          {roleCards.map((card, idx) => (
            <div key={card.id} className="relative">
              <RoleCardItem card={card} />
              {idx < roleCards.length - 1 && (
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-[2px] h-5 bg-[linear-gradient(180deg,rgba(255,77,95,0.2)_0%,rgba(255,77,95,0.8)_100%)] z-0">
                  <div className="absolute inset-0 bg-white/60 blur-[2px] animate-pulse" />
                </div>
              )}
            </div>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedRole && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRole(null)}
              className="absolute inset-0 bg-[#0f172a]/30 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white border border-gray-100 p-6 sm:p-8 shadow-2xl z-10"
            >
              <button
                onClick={() => setSelectedRole(null)}
                className="absolute right-5 top-5 rounded-full p-2 hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
              
              <div>
                <p className={`inline-flex items-center gap-2 text-xl font-extrabold ${selectedRole.iconClass}`}>
                  <selectedRole.Icon className="h-6 w-6" />
                  {tx(selectedRole.roleVi, selectedRole.roleEn)}
                </p>
                <p className="mt-2 text-[0.7rem] font-bold tracking-[0.15em] text-[#ff4d5f] uppercase">{tx(selectedRole.teamVi, selectedRole.teamEn)}</p>
                
                <p className="mt-5 text-[1.05rem] leading-8 text-[#321017]/90 font-medium pb-5 border-b border-gray-100">
                  {tx(selectedRole.summaryVi, selectedRole.summaryEn)}
                </p>
                
                <div className="mt-5 rounded-xl border border-[#ffd6df] bg-[#fff0f4] px-5 py-4 shadow-sm">
                  <p className="text-[0.7rem] font-bold tracking-[0.15em] text-[#ff4d5f] uppercase mb-1.5">
                    {tx("Mục tiêu (KPI)", "Goal (KPI)")}
                  </p>
                  <p className="text-[0.95rem] leading-6 font-bold text-[#321017]">
                    {tx(selectedRole.kpiVi, selectedRole.kpiEn)}
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
