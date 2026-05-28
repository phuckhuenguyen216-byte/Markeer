"use client";

import { motion } from "framer-motion";
import { CalendarClock, Calculator, Zap, Target, History } from "lucide-react";
import { useGrowthLocale } from "./useGrowthLocale";

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.58, delay, ease: [0.22, 1, 0.36, 1] as const },
  viewport: { once: true, amount: 0.15 },
});

export default function GrowthLayersSection() {
  const { tx } = useGrowthLocale();

  const phases = [
    {
      badge: tx("Tháng 1", "Month 1"),
      title: "Habit Building",
      icon: History,
      desc: tx("Làm quen, build thói quen. Đừng nghĩ nhiều. Cứ đăng. Cứ tìm.", "Get used to it, build habits. Don't overthink. Just post. Just find."),
      kpi: tx("80% số lượng + 20% chất lượng", "80% quantity + 20% quality"),
      goal: tx("Vượt ngại, tạo consistency", "Overcome hesitation, build consistency"),
      color: "blue"
    },
    {
      badge: tx("Tháng 2+", "Month 2+"),
      title: "Performance Mode",
      icon: Target,
      desc: tx("Chất lượng là vua. Ít bài nhưng hit, nhiều lead nhưng chất.", "Quality is king. Fewer posts but hits, fewer leads but qualified."),
      kpi: "Content approved · DM generated · Lead attributed",
      color: "rose"
    }
  ];

  const schedule = [
    { day: tx("Thứ 2", "Monday"), time: tx("10 phút", "10 mins"), action: tx("Plan tuần: sẽ post bài gì, tìm lead ở đâu, cần join group nào", "Weekly plan: what to post, where to find leads, what groups to join") },
    { day: tx("T3–T6", "Tue–Fri"), time: tx("30-60p/ngày", "30-60m/day"), action: tx("Post bài, tìm prospect, submit lead qua Zalo ngay khi có", "Post content, find prospects, submit leads via Zalo immediately") },
    { day: tx("Thứ 7", "Saturday"), time: tx("5 phút", "5 mins"), action: tx("Update GGSheet KPI Tracker: số bài đã post, số lead submit", "Update GGSheet KPI Tracker: posted count, submitted leads") },
    { day: tx("Đầu tháng", "Early month"), time: "—", action: tx("Sales Lead verify xong → Finance trả thưởng KPI", "Sales Lead verifies → Finance pays KPI bonus") },
  ];

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-20">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,92,118,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,92,118,0.045)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-16 h-52 w-52 rounded-full bg-[radial-gradient(circle,rgba(255,77,95,0.24)_0%,rgba(255,255,255,0)_70%)] blur-2xl"
        animate={{ x: [0, 36, 0], y: [0, 24, 0], opacity: [0.35, 0.7, 0.35] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <motion.div {...rise(0)} className="max-w-[980px] mx-auto text-center">
          <p className="mk-eyebrow text-[#ff4d5f] uppercase">
            {tx("05 · Theo dõi & Tính thưởng", "05 · Tracking & Rewards")}
          </p>
          <h2 className="mk-section-title mt-4 uppercase mx-auto flex flex-wrap justify-center gap-x-2 lg:gap-x-3">
            <span className="text-[#0b1020]">{tx("KPI TUẦN,", "WEEKLY KPI,")}</span>
            <span className="mk-section-title-accent bg-gradient-to-r from-[#ff3f57] via-[#ff4d5f] to-[#ff7b94] bg-clip-text text-transparent">
              {tx("BONUS THÁNG", "MONTHLY BONUS")}
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-[980px] text-[1.02rem] leading-8 text-[#0b1020]/76 sm:text-[1.1rem]">
            {tx(
              "Đơn giản. Làm đúng. Cuối tháng Sales Lead verify và Finance trả thưởng.",
              "Simple. Do it right. Sales Lead verifies and Finance pays out at month end."
            )}
          </p>
        </motion.div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {/* Cột 1: Phases */}
          <motion.div {...rise(0.1)} className="space-y-4">
            {phases.map((phase) => {
               const Icon = phase.icon;
               const isRose = phase.color === "rose";
               return (
                <div key={phase.badge} className={`rounded-[28px] border p-5 sm:p-6 shadow-sm ${isRose ? 'bg-[#fff5f7] border-[#ffe0e8]' : 'bg-[#f5f9ff] border-[#e0edff]'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className={`text-lg font-extrabold flex items-center gap-2 ${isRose ? 'text-[#ff4d5f]' : 'text-[#2f73ff]'}`}>
                      <Icon className="h-5 w-5" /> {phase.badge} — {phase.title}
                    </h3>
                  </div>
                  <p className="text-[0.9rem] text-[#0b1020]/80 leading-relaxed mb-4">
                    {phase.desc}
                  </p>
                  <div className={`rounded-xl p-3.5 text-[0.85rem] ${isRose ? 'bg-white/60 text-[#b51428]' : 'bg-white/60 text-[#144cb5]'}`}>
                    <p><strong>{tx("KPI đo:", "KPI:")}</strong> {phase.kpi}</p>
                    {phase.goal && <p className="mt-1.5"><strong>{tx("Mục tiêu:", "Goal:")}</strong> {phase.goal}</p>}
                  </div>
                </div>
               );
            })}
          </motion.div>

          {/* Cột 2: Lịch trình tuần */}
          <motion.div {...rise(0.15)} className="rounded-[28px] bg-[#160f22] p-5 sm:p-6 shadow-[0_30px_72px_-48px_rgba(22,15,34,0.78)] text-[#dfe8ff]">
            <div className="flex items-center gap-2 text-[#8fb6ff] mb-6">
               <CalendarClock className="h-5 w-5" />
               <h3 className="text-sm font-bold uppercase tracking-wider">{tx("📅 Nhịp tuần — Làm gì và khi nào", "📅 Weekly Rhythm — What and When")}</h3>
            </div>
            
            <div className="space-y-3">
              {schedule.map((item, i) => (
                <div key={item.day} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 p-3.5 rounded-xl bg-white/5 border border-white/5">
                  <div className="shrink-0 sm:w-[120px] flex justify-between items-center sm:block">
                     <p className="font-bold text-[#ff4d5f]">{item.day}</p>
                     <p className="text-xs text-[#8fb6ff] mt-0.5">{item.time}</p>
                  </div>
                  <p className="text-[0.85rem] leading-6 text-white/85 sm:mt-0 mt-1">{item.action}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Khối 3: Ví dụ Bonus */}
        <motion.div {...rise(0.2)} className="mt-5 rounded-[28px] border border-amber-200 bg-[linear-gradient(170deg,#fffdf5_0%,#ffffff_100%)] p-5 sm:p-6 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-[0.08] pointer-events-none">
              <Calculator className="w-40 h-40 text-amber-500" />
           </div>
           
           <h3 className="text-lg font-extrabold text-amber-900 flex items-center gap-2 mb-5 relative z-10">
              💡 {tx("Ví dụ tính bonus — Intern tháng đầu", "Bonus example — First-month Intern")}
           </h3>
           
           <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6 relative z-10">
             <div className="space-y-3">
               <div className="bg-white rounded-xl border border-amber-100 p-3.5 shadow-sm text-[0.85rem]">
                 <span className="inline-block px-2.5 py-1 bg-gray-100 rounded-md text-gray-700 font-bold mb-2">Target</span>
                 <p className="text-gray-800 leading-relaxed">{tx("3 bài chất lượng + 1 qualified lead", "3 quality posts + 1 qualified lead")}</p>
               </div>
               <div className="bg-white rounded-xl border border-amber-100 p-3.5 shadow-sm text-[0.85rem]">
                 <span className="inline-block px-2.5 py-1 bg-amber-100 rounded-md text-amber-800 font-bold mb-2">{tx("Thực tế", "Actual")}</span>
                 <p className="text-gray-800 leading-relaxed">{tx("Đăng 4 bài chất lượng (133% seeding) + submit 1 qualified lead (100% lead)", "Posted 4 quality articles (133% seeding) + submitted 1 qualified lead (100% lead)")}</p>
               </div>
             </div>
             
             <div className="space-y-2 text-[0.85rem] bg-white rounded-xl border border-amber-100 p-4 shadow-sm flex flex-col justify-center">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2.5">
                   <span className="text-gray-600">{tx("Seeding (133% = Mức 4)", "Seeding (133% = Level 4)")}</span>
                   <span className="font-mono font-bold text-gray-900 bg-gray-50 px-2 py-0.5 rounded">100K × 1.5 = 150K</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 py-2.5">
                   <span className="text-gray-600">{tx("Lead (100% = Mức 2)", "Lead (100% = Level 2)")}</span>
                   <span className="font-mono font-bold text-gray-900 bg-gray-50 px-2 py-0.5 rounded">100K × 1 = 100K</span>
                </div>
                <div className="flex justify-between items-center pt-2.5 text-amber-700">
                   <span className="font-bold">→ {tx("Tổng bonus tháng", "Total monthly bonus")}</span>
                   <span className="font-mono font-black text-[1.1rem]">250.000đ</span>
                </div>
             </div>
           </div>

           <div className="mt-5 bg-[linear-gradient(90deg,#ff4d5f,#ff2139)] text-white rounded-xl p-4 text-[0.9rem] font-medium relative z-10 flex items-start sm:items-center gap-3 shadow-md shadow-red-500/20">
              <Zap className="h-5 w-5 shrink-0 text-yellow-300 sm:mt-0 mt-0.5" />
              <p>{tx("Nếu lead đó close thành deal 20M → Thêm hoa hồng Tier C", "If that lead closes a 20M deal → Additional Tier C commission")} <strong className="text-yellow-300 font-black text-base mx-1">500K</strong> {tx("từ Nhóm 1.", "from Group 1.")}</p>
           </div>
        </motion.div>
      </div>
    </section>
  );
}
