"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Activity, Heart, ArrowRight, X, AlertTriangle, Check } from "lucide-react";
import { useGrowthLocale } from "./useGrowthLocale";

const slam = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.58, delay, ease: [0.22, 1, 0.36, 1] as const },
  viewport: { once: true, amount: 0.15 },
});

export default function GrowthProtectionSection() {
  const { tx } = useGrowthLocale();
  const [activePopup, setActivePopup] = useState<"delivery" | "retention" | "culture" | null>(null);

  const pillars = [
    {
      id: "delivery" as const,
      icon: Shield,
      title: tx("Sức khỏe delivery", "Delivery Health"),
      subtitle: tx("Bảo vệ trước khi collapse", "Protect before collapse"),
      desc: tx("Agency chết không phải vì thiếu lead — chết vì delivery collapse khi nhận quá nhiều client.", "Agencies don't die from lack of leads — they die from delivery collapse when taking too many clients."),
      color: "from-blue-500 to-cyan-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      iconColor: "text-blue-400"
    },
    {
      id: "retention" as const,
      icon: Activity,
      title: tx("Theo dõi retention", "Retention Monitoring"),
      subtitle: tx("Theo dõi sớm, hành động nhanh", "Track early, act fast"),
      desc: tx("Mất 1 client ở Phase 1 = mất revenue + mất case study + negative word-of-mouth.", "Losing 1 client in Phase 1 = lost revenue + lost case study + negative word-of-mouth."),
      color: "from-amber-500 to-orange-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      iconColor: "text-amber-400"
    },
    {
      id: "culture" as const,
      icon: Heart,
      title: tx("Bảo vệ văn hóa", "Protect culture"),
      subtitle: tx("Không để mọi thứ chỉ còn là tiền", "Don't let everything be just about money"),
      desc: tx("Hệ thống reward bằng tiền. Nhưng không được đánh mất support, chia sẻ và mentor.", "Reward system is monetary. But don't lose support, sharing, and mentoring."),
      color: "from-purple-500 to-pink-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      iconColor: "text-purple-400"
    }
  ];

  const rules = [
    { id: "R1", title: tx("Lead phải có entry CRM", "Lead must have CRM entry"), desc: tx("Mới được tính hoa hồng. Nhắn Zalo nhóm đúng format. Không exception.", "To count for commission. Message Zalo group in correct format. No exceptions.") },
    { id: "R2", title: tx("Closer có final say", "Closer has final say"), desc: tx("Phải document lý do reject. Không argue, hỏi cách improve cho lead tiếp theo.", "Must document reject reason. No arguing, ask how to improve for next leads.") },
    { id: "R3", title: tx("Commission unlock", "Commission unlock"), desc: tx("Khi đủ 4 điều kiện: Client paid + No refund + Active 14 ngày + Delivery started.", "When 4 conditions met: Client paid + No refund + Active 14 days + Delivery started.") },
    { id: "R4", title: tx("Growth Support 10%", "Growth Support 10%"), desc: tx("Chỉ trả khi có Closer xác nhận đóng góp. Không thì 10% về company pool.", "Paid only with Closer's confirmed contribution. Otherwise 10% goes to company pool.") },
    { id: "R5", title: tx("Core job trước, growth sau", "Core job first, growth later"), desc: tx("Không sacrifice Layer 1. KPI tụt vì chase lead = warning ngay.", "Do not sacrifice Layer 1. KPI drops due to lead chasing = immediate warning.") },
  ];

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-20 bg-[#0b060d]">
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,77,95,0.15)_0%,rgba(11,6,13,0)_44%)]"
        animate={{ opacity: [0.9, 1, 0.9] }}
        transition={{ duration: 7.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,130,150,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,130,150,0.04)_1px,transparent_1px)] bg-[size:68px_68px]" />

      <div className="relative mx-auto max-w-[1320px] px-4 text-white sm:px-6 lg:px-8">
        <motion.div {...slam(0)} className="mx-auto max-w-[980px] text-center">
          <p className="mk-eyebrow text-[#ff4d5f] uppercase">{tx("06 · Quan trọng — Đọc kỹ", "06 · Important — Read carefully")}</p>
          <h2 className="mk-section-title mt-4 uppercase text-white flex flex-wrap justify-center gap-x-2 lg:gap-x-3">
            <span>{tx("BẢO VỆ TEAM VÀ", "PROTECT THE TEAM AND")}</span>
            <span className="text-[#ff4d5f]">{tx("HỆ THỐNG", "SYSTEM")}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[980px] text-[1.02rem] leading-8 text-white/70">
            {tx("Growth war machine chỉ chạy được khi team còn sức chiến đấu. Đây là cách chúng ta tự bảo vệ.", "The growth war machine only runs when the team is strong. This is how we protect ourselves.")}
          </p>
        </motion.div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <motion.article {...slam(0.1)} className="grid gap-4">
             {pillars.map((item) => {
                const Icon = item.icon;
                return (
                   <div 
                     key={item.id}
                     onClick={() => setActivePopup(item.id)}
                     className={`group relative overflow-hidden rounded-[24px] bg-white/5 border border-white/10 p-5 sm:p-6 cursor-pointer hover:bg-white/10 transition-colors`}
                   >
                     <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                           <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${item.bg} ${item.border} border`}>
                              <Icon className={`w-6 h-6 ${item.iconColor}`} />
                           </div>
                           <div>
                              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                 {item.title}
                              </h3>
                              <p className="text-[#ff9cae] text-sm font-semibold mb-2">{item.subtitle}</p>
                              <p className="text-white/60 text-[0.85rem] leading-relaxed max-w-[280px] sm:max-w-sm">{item.desc}</p>
                           </div>
                        </div>
                        <div className="shrink-0 mt-2 sm:mt-0">
                           <span className="text-xs font-semibold text-white/40 group-hover:text-[#ff4d5f] flex items-center gap-1 transition-colors">
                              {tx("Xem chi tiết", "View details")} <ArrowRight className="w-3 h-3" />
                           </span>
                        </div>
                     </div>
                   </div>
                )
             })}
          </motion.article>

          <motion.article {...slam(0.15)} className="rounded-[28px] bg-[#1a0c14] border border-[#ff4d5f]/20 p-5 sm:p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
              <AlertTriangle className="w-5 h-5 text-[#ff4d5f]" /> {tx("5 Rules — Không được vi phạm", "5 Rules — Non-negotiable")}
            </h3>
            <div className="space-y-4">
               {rules.map((rule) => (
                  <div key={rule.id} className="flex gap-3">
                     <span className="shrink-0 w-8 h-8 rounded-lg bg-[#ff4d5f]/20 text-[#ff4d5f] font-bold flex items-center justify-center text-sm border border-[#ff4d5f]/30">
                        {rule.id}
                     </span>
                     <div>
                        <h4 className="text-white font-semibold text-[0.95rem]">{rule.title}</h4>
                        <p className="text-white/60 text-[0.85rem] leading-6 mt-0.5">{rule.desc}</p>
                     </div>
                  </div>
               ))}
            </div>
          </motion.article>
        </div>
      </div>

      <AnimatePresence>
        {activePopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActivePopup(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative z-10 w-full max-w-[94vw] sm:max-w-[600px] max-h-[86vh] sm:max-h-[90vh] overflow-y-auto rounded-[20px] sm:rounded-[24px] bg-[#1a1423] border border-white/10 shadow-2xl text-white h-auto"
            >
              <button
                onClick={() => setActivePopup(null)}
                className="absolute right-4 top-4 rounded-full p-2 hover:bg-white/10 transition-colors z-20"
              >
                <X className="h-5 w-5 text-white/60" />
              </button>

              <div className="p-4 sm:p-8">
                 {activePopup === "delivery" && (
                    <div>
                       <h3 className="text-xl font-bold flex items-center gap-2 text-blue-400 mb-2">
                          <Shield className="w-6 h-6" /> {tx("Sức khỏe delivery", "Delivery Health")}
                       </h3>
                       <p className="text-white/60 text-sm mb-6">{tx("Bảo vệ trước khi collapse", "Protect before collapse")}</p>
                       
                       <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                          <p className="font-bold text-white mb-2">{tx("Rule auto-trigger đơn giản:", "Simple auto-trigger rule:")}</p>
                          <ul className="list-disc pl-5 space-y-2 text-[0.9rem] text-white/80">
                             <li>{tx("Mỗi tuần, PM rate delivery capacity của team: 1 (quá tải) → 5 (còn nhiều bandwidth).", "Every week, PM rates team's delivery capacity: 1 (overloaded) → 5 (high bandwidth).")}</li>
                             <li>{tx("Nếu bất kỳ PM nào rate dưới 3 hai tuần liên tiếp → Growth KPI của team đó tự động pause cho đến khi ổn định.", "If any PM rates below 3 for two consecutive weeks → The team's Growth KPI is automatically paused until stabilized.")}</li>
                          </ul>
                          <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg text-[0.85rem] text-blue-200">
                             {tx("Không cần CEO quyết định. Không cần họp. Auto-trigger.", "No CEO decision needed. No meetings. Auto-trigger.")}
                          </div>
                       </div>
                    </div>
                 )}

                 {activePopup === "retention" && (
                    <div>
                       <h3 className="text-xl font-bold flex items-center gap-2 text-amber-400 mb-2">
                          <Activity className="w-6 h-6" /> {tx("Theo dõi retention", "Retention Monitoring")}
                       </h3>
                       <p className="text-white/60 text-sm mb-6">{tx("Theo dõi sớm, chưa cần optimize vội", "Track early, no need to optimize yet")}</p>
                       
                       <p className="text-[0.9rem] text-white/80 mb-4">{tx("Phase 1 mình chưa cần tối ưu retention — nhưng phải biết sớm trước khi churn xảy ra. 3 metrics đơn giản:", "In Phase 1 we don't need to optimize retention yet — but we must know early before churn happens. 3 simple metrics:")}</p>
                       
                       <div className="overflow-x-auto">
                         <table className="w-full text-left border-collapse text-[0.85rem]">
                            <thead>
                               <tr className="border-b border-white/10 text-white/60">
                                  <th className="py-2 px-2 font-medium">Metric</th>
                                  <th className="py-2 px-2 font-medium">{tx("Ngưỡng", "Threshold")}</th>
                                  <th className="py-2 px-2 font-medium">{tx("Action", "Action")}</th>
                               </tr>
                            </thead>
                            <tbody className="text-white/80">
                               <tr className="border-b border-white/5">
                                  <td className="py-3 px-2 font-semibold text-white">Client satisfaction</td>
                                  <td className="py-3 px-2 text-amber-300">{tx("< 6/10 ở tuần 2", "< 6/10 at week 2")}</td>
                                  <td className="py-3 px-2">{tx("Intervention call (PM)", "Intervention call (PM)")}</td>
                               </tr>
                               <tr className="border-b border-white/5">
                                  <td className="py-3 px-2 font-semibold text-white">Churn reason</td>
                                  <td className="py-3 px-2 text-amber-300">{tx("Bất kỳ cancel nào", "Any cancellation")}</td>
                                  <td className="py-3 px-2">{tx("Exit interview 10p, log CRM", "10m exit interview, log CRM")}</td>
                               </tr>
                               <tr>
                                  <td className="py-3 px-2 font-semibold text-white">Delivery overload</td>
                                  <td className="py-3 px-2 text-amber-300">{tx("PM rate < 3", "PM rate < 3")}</td>
                                  <td className="py-3 px-2">{tx("Trigger pause Growth ngay", "Trigger pause Growth immediately")}</td>
                               </tr>
                            </tbody>
                         </table>
                       </div>
                    </div>
                 )}

                 {activePopup === "culture" && (
                    <div>
                       <h3 className="text-xl font-bold flex items-center gap-2 text-purple-400 mb-2">
                          <Heart className="w-6 h-6" /> {tx("Bảo vệ văn hóa", "Protect culture")}
                       </h3>
                       <p className="text-white/60 text-sm mb-6">{tx("Không để mọi thứ chỉ còn là tiền", "Don't let everything be just about money")}</p>
                       
                       <p className="text-[0.9rem] text-white/80 mb-5 leading-relaxed">
                          {tx("Những đóng góp văn hóa không có KPI, không có bonus — nhưng được đánh giá định tính trong quarterly review và ảnh hưởng đến cơ hội phát triển. Đừng bỏ qua chúng vì không thấy số tiền ngay.", "Cultural contributions have no KPI, no bonus — but are evaluated qualitatively in quarterly reviews and impact growth opportunities. Don't ignore them just because you don't see immediate money.")}
                       </p>

                       <div className="grid sm:grid-cols-2 gap-4">
                          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                             <h4 className="text-green-400 font-bold mb-3 flex items-center gap-2"><Check className="w-4 h-4"/> {tx("Được ghi nhận", "Recognized")}</h4>
                             <ul className="space-y-2 text-[0.85rem] text-white/80">
                                <li>{tx("→ Mentor người mới onboard", "→ Mentor new onboarded members")}</li>
                                <li>{tx("→ Chia sẻ insight thật sự", "→ Share real insights")}</li>
                                <li>{tx("→ Cải thiện SOP, process", "→ Improve SOPs, processes")}</li>
                                <li>{tx("→ Support deadline gấp", "→ Support urgent deadlines")}</li>
                             </ul>
                          </div>
                          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                             <h4 className="text-red-400 font-bold mb-3 flex items-center gap-2"><X className="w-4 h-4"/> {tx("Không được tính", "Not counted")}</h4>
                             <ul className="space-y-2 text-[0.85rem] text-white/80">
                                <li>{tx("→ Giúp để lấy \"điểm văn hóa\"", "→ Helping just to get \"culture points\"")}</li>
                                <li>{tx("→ Fake support, làm màu", "→ Fake support, showing off")}</li>
                                <li>{tx("→ Share session không ai cần", "→ Sharing sessions nobody needs")}</li>
                             </ul>
                          </div>
                       </div>
                    </div>
                 )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
