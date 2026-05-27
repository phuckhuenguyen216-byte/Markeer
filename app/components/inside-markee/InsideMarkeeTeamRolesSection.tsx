"use client";

import { motion } from "framer-motion";
import { Compass, Handshake, Rocket, Settings2, Shield, Target } from "lucide-react";
import type { ComponentType } from "react";
import { useInsideMarkeeLocale } from "./useInsideMarkeeLocale";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] as const },
  viewport: { once: true, amount: 0.2 },
});

type RoleCard = {
  roleVi: string;
  roleEn: string;
  teamVi: string;
  teamEn: string;
  summaryVi: string;
  summaryEn: string;
  kpiVi: string;
  kpiEn: string;
  Icon: ComponentType<{ className?: string }>;
  toneClass: string;
  borderClass: string;
  iconClass: string;
};

export default function InsideMarkeeTeamRolesSection() {
  const { tx } = useInsideMarkeeLocale();

  const roleCards: RoleCard[] = [
    {
      roleVi: "SDR - Sales Development Rep",
      roleEn: "SDR - Sales Development Rep",
      teamVi: "Team Markee",
      teamEn: "Markee Team",
      summaryVi:
        '"Thám tử tìm người đang đau". Tìm đúng page/người có pain thật, nhắn tin cá nhân hóa dựa trên vấn đề thực tế thay vì spam.',
      summaryEn:
        '"Pain detective." Find real pain signals and send personalized outreach instead of spam.',
      kpiVi: "KPI: 15 prospects audit/ngày -> 10 DMs cá nhân hóa -> 1-2 cuộc call được book.",
      kpiEn: "KPI: 15 prospect audits/day -> 10 personalized DMs -> 1-2 booked calls.",
      Icon: Compass,
      toneClass: "from-[#fff6f8] to-white",
      borderClass: "border-[#ffcbd7]",
      iconClass: "text-[#be123c]",
    },
    {
      roleVi: "Sales - Người chốt deal",
      roleEn: "Sales - Deal closer",
      teamVi: "Team Markee",
      teamEn: "Markee Team",
      summaryVi:
        '"Bác sĩ chẩn đoán và kê đơn". Hỏi đúng để hiểu pain, demo live trên data thật, tính ROI theo số thật và mời trial 14 ngày.',
      summaryEn:
        '"Diagnostic closer." Understand pain, run live demos on real data, calculate ROI, then offer a 14-day trial.',
      kpiVi: "KPI: 3-5 demos/ngày -> LOI signed 2-4/tuần -> trial-to-monthly >60%.",
      kpiEn: "KPI: 3-5 demos/day -> 2-4 LOIs/week -> trial-to-monthly >60%.",
      Icon: Target,
      toneClass: "from-[#fff8ee] to-white",
      borderClass: "border-[#ffd7ad]",
      iconClass: "text-[#b45309]",
    },
    {
      roleVi: "Automation Tech - Người build hệ thống",
      roleEn: "Automation Tech - System builder",
      teamVi: "Team Markee",
      teamEn: "Markee Team",
      summaryVi:
        '"Thợ lắp máy". Setup chatbot, automation, CRM, report đúng chuẩn trong 7 ngày và log các bước tốn thời gian để product hóa.',
      summaryEn:
        '"System builder." Set up chatbot, automation, CRM, reporting in 7 days and log time-heavy steps for productization.',
      kpiVi: "KPI: Onboard xong trong 7 ngày · uptime 99%+ · log setup time mỗi task.",
      kpiEn: "KPI: 7-day onboarding · 99%+ uptime · setup-time logging per task.",
      Icon: Settings2,
      toneClass: "from-[#eef5ff] to-white",
      borderClass: "border-[#bfd7ff]",
      iconClass: "text-[#1d4ed8]",
    },
    {
      roleVi: "CSM - Customer Success Manager",
      roleEn: "CSM - Customer Success Manager",
      teamVi: "Team Markee",
      teamEn: "Markee Team",
      summaryVi:
        '"Người bảo vệ client". Giữ retention qua báo cáo tuần, review tháng, phát hiện sớm risk và mở cơ hội upsell.',
      summaryEn:
        '"Client guardian." Protect retention with weekly reports, monthly reviews, early risk detection, and upsell signals.',
      kpiVi: "KPI: Churn <5%/tháng · NPS >60 · upsell rate 20% trong 6 tháng.",
      kpiEn: "KPI: Churn <5%/month · NPS >60 · 20% upsell rate in 6 months.",
      Icon: Handshake,
      toneClass: "from-[#f2f8ff] to-white",
      borderClass: "border-[#c9ddff]",
      iconClass: "text-[#1e40af]",
    },
    {
      roleVi: "Community Manager - SecurityZone",
      roleEn: "Community Manager - SecurityZone",
      teamVi: "Team SecurityZone",
      teamEn: "SecurityZone Team",
      summaryVi:
        '"Người giữ lửa cộng đồng". Chạy Telegram/events/forum, giữ nội dung 100% hữu ích cho cộng đồng công nghệ, không bán hàng trực tiếp.',
      summaryEn:
        '"Community firekeeper." Operate Telegram/events/forum with 100% useful tech content and no direct selling.',
      kpiVi: "KPI: Telegram subs +200/tuần · 1 event/tháng · content 100% security/tech.",
      kpiEn: "KPI: +200 Telegram subs/week · 1 event/month · 100% security/tech content.",
      Icon: Shield,
      toneClass: "from-[#f6f1ff] to-white",
      borderClass: "border-[#d8c8ff]",
      iconClass: "text-[#6d28d9]",
    },
    {
      roleVi: "CEO & Leadership - Người cầm lái",
      roleEn: "CEO & Leadership - Direction owner",
      teamVi: "All teams",
      teamEn: "All teams",
      summaryVi:
        '"Vừa chèo thuyền vừa vẽ bản đồ". Phase 1 ưu tiên 70% close deals Markee bằng tay, 30% xây quan hệ cho Cloudgate.',
      summaryEn:
        '"Row the boat while drawing the map." In Phase 1: 70% direct deal closing for Markee, 30% relationship building for Cloudgate.',
      kpiVi: "KPI: Close 10 deals đầu bằng tay · LinkedIn 3 posts/tuần · VNISA active member.",
      kpiEn: "KPI: First 10 deals closed manually · 3 LinkedIn posts/week · active VNISA member.",
      Icon: Rocket,
      toneClass: "from-[#fff1f5] to-white",
      borderClass: "border-[#ffcbda]",
      iconClass: "text-[#be123c]",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#fffafb] py-24 sm:py-28 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,92,118,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,92,118,0.05)_1px,transparent_1px)] bg-[size:62px_62px]" />
      <div className="pointer-events-none absolute right-[-8rem] top-[-6rem] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(255,77,77,0.15)_0%,rgba(255,255,255,0)_74%)] blur-3xl" />

      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <motion.p {...fadeUp(0)} className="mk-eyebrow text-center text-[#0b1020]/80 uppercase">
          {tx("06 · Vai trò của bạn", "06 · Your role")}
        </motion.p>

        <motion.div {...fadeUp(0.05)} className="mx-auto mt-7 max-w-[940px] text-center">
          <h2 className="mk-section-title">
            <span className="block text-[#2d0d18]">{tx("MỖI ROLE LÀ MỘT MẮT XÍCH", "EACH ROLE IS ONE LINK")}</span>
            <span className="mk-section-title-accent block bg-gradient-to-r from-[#ff3f57] via-[#ff4d5f] to-[#ff748f] bg-clip-text text-transparent">
              {tx("TRONG MÁY TĂNG TRƯỞNG", "IN THE GROWTH ENGINE")}
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-[760px] text-[1.02rem] leading-8 text-[#2d0d18]/78 sm:text-[1.1rem]">
            {tx(
              "Dù bạn ở vị trí nào, trọng tâm vẫn là một nhịp chung: tìm đúng pain, chốt đúng giải pháp, giao đúng chất lượng, giữ trust và scale có kỷ luật.",
              "No matter the role, the rhythm is shared: find real pain, close the right outcome, deliver quality, protect trust, and scale with discipline."
            )}
          </p>
        </motion.div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {roleCards.map((card, index) => {
            const Icon = card.Icon;
            return (
              <motion.article
                key={card.roleVi}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.48, delay: 0.08 + index * 0.06 }}
                viewport={{ once: true, amount: 0.2 }}
                whileHover={{ y: -8 }}
                className={`rounded-[24px] border ${card.borderClass} bg-gradient-to-br ${card.toneClass} p-5 shadow-[0_20px_48px_-34px_rgba(15,23,42,0.42)]`}
              >
                <p className={`inline-flex items-center gap-2 text-sm font-semibold ${card.iconClass}`}>
                  <Icon className="h-4 w-4" />
                  {tx(card.roleVi, card.roleEn)}
                </p>
                <p className="mt-1 text-xs font-semibold tracking-[0.12em] text-[#7f2b3a]/75 uppercase">{tx(card.teamVi, card.teamEn)}</p>
                <p className="mt-3 text-sm leading-7 text-[#2d0d18]/82">{tx(card.summaryVi, card.summaryEn)}</p>
                <p className="mt-3 rounded-xl border border-white/70 bg-white/78 px-3.5 py-2.5 text-sm leading-6 font-medium text-[#5f1e27]">
                  {tx(card.kpiVi, card.kpiEn)}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

