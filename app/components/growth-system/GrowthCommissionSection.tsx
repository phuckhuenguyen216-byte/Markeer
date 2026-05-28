"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  CircleDollarSign,
  Clock3,
  HandCoins,
  MessageSquareText,
  TrendingUp,
  UserCheck,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { useGrowthLocale } from "./useGrowthLocale";

const fadeNarrative = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
  viewport: { once: true, amount: 0.22 },
});

export default function GrowthCommissionSection() {
  const { tx } = useGrowthLocale();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"nhom1" | "nhom2">("nhom1");

  const left = [
    { label: "Lead Owner", Icon: UserCheck },
    { label: "Closer", Icon: HandCoins },
    { label: "Delivery", Icon: Wrench },
    { label: "Growth Support", Icon: Users },
  ];

  const right = [
    { labelVi: "Deal chốt nhanh hơn", labelEn: "Faster closing", Icon: CircleDollarSign },
    { labelVi: "Onboard mượt hơn", labelEn: "Smoother onboarding", Icon: MessageSquareText },
    { labelVi: "Retention khỏe hơn", labelEn: "Stronger retention", Icon: Clock3 },
    { labelVi: "Thu nhập tăng rõ", labelEn: "Clear income upside", Icon: TrendingUp },
  ];

  return (
    <section style={{ zIndex: isPopupOpen ? 999 : 0 }} className="relative overflow-hidden py-18 sm:py-22 lg:py-26">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_16%,rgba(66,126,255,0.1)_0%,rgba(255,255,255,0)_36%),radial-gradient(circle_at_78%_66%,rgba(255,77,95,0.1)_0%,rgba(255,255,255,0)_34%)]" />

      <div className="relative mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <motion.p {...fadeNarrative(0)} className="mk-eyebrow text-center text-[#ff4d5f] uppercase">
          {tx("02 · Thu nhập thêm", "02 · Extra income")}
        </motion.p>

        



        <motion.h2
          {...fadeNarrative(0.04)}
          className="mk-section-title mx-auto mt-4 max-w-[980px] text-center uppercase"
        >
          <span className="block text-[#0b1020]">{tx("BẠN CÓ THỂ", "HOW MUCH")}</span>
          <span className="mk-section-title-accent block bg-gradient-to-r from-[#ff3f57] via-[#ff4d5f] to-[#ff7b94] bg-clip-text text-transparent">
            {tx("KIẾM THÊM BAO NHIÊU?", "CAN YOU EARN?")}
          </span>
        </motion.h2>

        <motion.p
          {...fadeNarrative(0.1)}
          className="mx-auto mt-5 max-w-[780px] text-center text-[1.03rem] leading-8 text-[#0b1020]/78 sm:text-[1.12rem]"
        >
          {tx(
            "Hai nguồn hoàn toàn độc lập. Tháng nào làm tốt cả hai → nhận cả hai. Không giới hạn, không trần, không phân biệt intern hay senior.",
            "Two completely independent sources. Do both well in a month → get both. No limits, no cap, no distinction between intern or senior."
          )}
        </motion.p>

        <motion.article
          {...fadeNarrative(0.16)}
          className="relative mt-9 overflow-hidden rounded-[34px] bg-[linear-gradient(170deg,#fff8fb_0%,#ffffff_60%,#fff7fa_100%)] p-5 shadow-[0_34px_82px_-56px_rgba(15,23,42,0.6)] sm:p-8"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,77,95,0.16)_0%,rgba(255,255,255,0)_60%)]" />

          <div className="relative hidden h-[360px] lg:block">
            {left.map((item, index) => {
              const Icon = item.Icon;
              return (
                <motion.div
                  key={item.label}
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 4.8 + index * 0.25, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute left-4 z-20 flex min-w-[220px] items-center justify-between rounded-2xl bg-white/92 px-4 py-3 text-sm font-medium text-[#2b0f1d] shadow-[0_12px_28px_-20px_rgba(15,23,42,0.45)]"
                  style={{ top: `${34 + index * 84}px` }}
                >
                  <span>{item.label}</span>
                  <Icon className="h-4 w-4 text-[#ff4d5f]" />
                </motion.div>
              );
            })}

            {right.map((item, index) => {
              const Icon = item.Icon;
              return (
                <motion.div
                  key={item.labelVi}
                  animate={{ x: [0, -5, 0] }}
                  transition={{ duration: 4.8 + index * 0.25, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute right-4 z-20 flex min-w-[240px] items-center justify-between rounded-2xl bg-white/92 px-4 py-3 text-sm font-medium text-[#2b0f1d] shadow-[0_12px_28px_-20px_rgba(15,23,42,0.45)]"
                  style={{ top: `${34 + index * 84}px` }}
                >
                  <span>{tx(item.labelVi, item.labelEn)}</span>
                  <Icon className="h-4 w-4 text-[#ff4d5f]" />
                </motion.div>
              );
            })}

            <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
              {[16, 39, 62, 85].map((y) => (
                <path
                  key={y}
                  d={`M26 ${y} C40 ${y}, 43 50, 50 50 C57 50, 60 ${y}, 74 ${y}`}
                  stroke="rgba(255,77,95,0.24)"
                  strokeWidth="0.28"
                  fill="none"
                />
              ))}
            </svg>

            <div className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2">
              <motion.div
                animate={{ scale: [1, 1.07, 1], boxShadow: ["0 14px 34px -16px rgba(255,77,95,0.62)", "0 20px 44px -16px rgba(255,77,95,0.78)", "0 14px 34px -16px rgba(255,77,95,0.62)"] }}
                transition={{ duration: 3.1, repeat: Infinity, ease: "easeInOut" }}
                className="inline-flex h-24 w-24 items-center justify-center rounded-full border border-white/60 bg-white shadow-[0_18px_34px_-16px_rgba(255,77,95,0.72)]"
              >
                <Image src="/logo.png" alt="Markee Logo" width={62} height={62} className="h-14 w-14 object-contain" />
              </motion.div>
            </div>
          </div>

          <div className="relative z-20 grid gap-3 lg:hidden">
            {[...left.map((item) => item.label), ...right.map((item) => tx(item.labelVi, item.labelEn))].map((item) => (
              <p key={item} className="rounded-xl bg-white/92 px-4 py-3 text-sm text-[#2b0f1d] shadow-[0_12px_24px_-20px_rgba(15,23,42,0.5)]">
                {item}
              </p>
            ))}
          </div>
        </motion.article>

        <motion.div {...fadeNarrative(0.24)} className="mt-8 max-w-[980px] mx-auto">
          <div className="bg-[linear-gradient(135deg,#ff4d5f_0%,#ff7b94_100%)] rounded-2xl p-4 sm:p-5 text-white shadow-[0_16px_32px_-12px_rgba(255,77,95,0.4)] relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="absolute -top-4 -right-2 p-4 opacity-[0.15] text-[80px] pointer-events-none transform -rotate-12">🌟</div>
            <div className="relative z-10 flex items-center gap-4">
              <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-2xl shrink-0">🌟</div>
              <div>
                <h4 className="text-lg font-bold flex items-center gap-2 leading-tight">Double Reward</h4>
                <p className="mt-0.5 text-white/95 text-[0.95rem] leading-snug">
                  {tx("Tháng nào seeding chất lượng + chốt lead thành công", "Any month with quality seeding + successful closed lead")}
                </p>
              </div>
            </div>
            <div className="relative z-10 w-full sm:w-auto shrink-0">
              <button
                onClick={() => setIsPopupOpen(true)}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-[0.95rem] font-bold text-[#ff4d5f] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md whitespace-nowrap"
              >
                {tx("Xem chi tiết chính sách", "View detailed policy")}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>

      </div>

      <AnimatePresence>
        {isPopupOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPopupOpen(false)}
              className="absolute inset-0 bg-[#0b1020]/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative z-10 w-full max-w-[94vw] sm:max-w-[800px] rounded-[22px] sm:rounded-[28px] bg-white border border-[#ffe0e8] shadow-2xl max-h-[86vh] sm:max-h-[90vh] flex flex-col overflow-hidden"
            >
              <button
                onClick={() => setIsPopupOpen(false)}
                className="absolute right-5 top-5 rounded-full p-2 hover:bg-gray-100 transition-colors z-20"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>

              <div className="px-6 pt-6 pb-0 pr-14 sm:px-10 sm:pt-10 sm:pr-16 border-b border-gray-100 shrink-0">
                <div className="flex gap-2 sm:gap-4">
                  <button
                    className={`pb-3 px-2 font-bold text-[0.95rem] sm:text-[1.05rem] whitespace-nowrap transition-colors relative ${activeTab === "nhom1" ? "text-[#ff4d5f]" : "text-gray-500 hover:text-gray-800"}`}
                    onClick={() => setActiveTab("nhom1")}
                  >
                    {tx("Nhóm 1 — Hoa hồng", "Group 1 — Commission")}
                    {activeTab === "nhom1" && (
                      <motion.div layoutId="activeTabIndicator" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[#ff4d5f]" />
                    )}
                  </button>
                  <button
                    className={`pb-3 px-2 font-bold text-[0.95rem] sm:text-[1.05rem] whitespace-nowrap transition-colors relative ${activeTab === "nhom2" ? "text-[#427eff]" : "text-gray-500 hover:text-gray-800"}`}
                    onClick={() => setActiveTab("nhom2")}
                  >
                    {tx("Nhóm 2 — Thưởng KPI", "Group 2 — KPI Bonus")}
                    {activeTab === "nhom2" && (
                      <motion.div layoutId="activeTabIndicator" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[#427eff]" />
                    )}
                  </button>
                </div>
              </div>

              <div className="text-[#0b1020] p-4 sm:p-8 lg:p-10 flex-1 overflow-y-auto">
                {activeTab === "nhom1" && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                  >
                    <h3 className="text-xl font-extrabold text-[#ff4d5f] flex items-center gap-2">
                      <span className="text-2xl">💵</span> {tx("Nhóm 1 — Hoa hồng khi chốt deal", "Group 1 — Commission on closed deals")}
                    </h3>
                    <p className="mt-2 text-[0.95rem] leading-7 text-gray-700">
                      {tx("Trả khi client ký HĐ + thanh toán. Pool commission chia theo 4 roles cố định.", "Paid when client signs contract + pays. Pool commission divided into 4 fixed roles.")}
                    </p>
                    
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-[#fff0f4] p-3 rounded-xl border border-[#ffccd5]">
                        <p className="text-lg font-bold text-[#ff4d5f]">35%</p>
                        <p className="text-xs font-bold text-gray-900 mt-1">Lead Owner</p>
                        <p className="text-[0.65rem] text-gray-600 mt-0.5 leading-tight">{tx("Người tìm ra / giới thiệu KH", "Finder / Client introducer")}</p>
                      </div>
                      <div className="bg-[#fff0f4] p-3 rounded-xl border border-[#ffccd5]">
                        <p className="text-lg font-bold text-[#ff4d5f]">35%</p>
                        <p className="text-xs font-bold text-gray-900 mt-1">Closer</p>
                        <p className="text-[0.65rem] text-gray-600 mt-0.5 leading-tight">{tx("Sales team demo và chốt deal", "Sales team demo and close")}</p>
                      </div>
                      <div className="bg-[#fff0f4] p-3 rounded-xl border border-[#ffccd5]">
                        <p className="text-lg font-bold text-[#ff4d5f]">20%</p>
                        <p className="text-xs font-bold text-gray-900 mt-1">Delivery</p>
                        <p className="text-[0.65rem] text-gray-600 mt-0.5 leading-tight">{tx("PM + team triển khai dự án", "PM + project delivery team")}</p>
                      </div>
                      <div className="bg-[#fff0f4] p-3 rounded-xl border border-[#ffccd5]">
                        <p className="text-lg font-bold text-[#ff4d5f]">10%</p>
                        <p className="text-xs font-bold text-gray-900 mt-1">Growth Sup</p>
                        <p className="text-[0.65rem] text-gray-600 mt-0.5 leading-tight">{tx("Content/support đóng góp", "Content/support contribution")}</p>
                      </div>
                    </div>

                    <div className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <p className="text-sm font-semibold text-gray-900">
                        {tx("Ví dụ thực tế — Deal 20 triệu/tháng, pool 20%:", "Example — Deal 20M/month, pool 20%:")}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        {tx("Pool = 4 triệu →", "Pool = 4 million →")} <span className="font-semibold text-[#ff4d5f]">Lead Owner: 1.4M</span> · <span className="font-semibold text-[#ff4d5f]">Closer: 1.4M</span> · Delivery: 800K · Growth Sup: 400K
                      </p>
                    </div>

                    <p className="mt-6 text-[0.95rem] font-bold text-gray-900">
                      {tx("Bạn có thể là Lead Owner theo 3 cách:", "You can be a Lead Owner in 3 ways:")}
                    </p>
                    <ul className="mt-3 space-y-3 text-[0.9rem] text-gray-700">
                      <li className="flex gap-2">
                        <span className="shrink-0 mt-0.5 text-base">🥇</span>
                        <div>
                          <strong className="text-gray-900">{tx("Giới thiệu người quen:", "Refer acquaintances:")}</strong> {tx("Bạn biết ai đang cần marketing, web, chatbot? → Giới thiệu với Sales → Sales demo và close → Bạn nhận 35% pool. Không cần gặp khách, không cần biết sales.", "Know anyone who needs marketing, web, chatbots? → Intro to Sales → Sales demo and close → You get 35% of pool. No need to meet clients, no sales skills needed.")}
                        </div>
                      </li>
                      <li className="flex gap-2">
                        <span className="shrink-0 mt-0.5 text-base">🥈</span>
                        <div>
                          <strong className="text-gray-900">{tx("Tìm ra lead chất lượng:", "Find quality leads:")}</strong> {tx("Bạn tìm được prospect (Tên + SĐT + Pain cụ thể) → Submit vào CRM → Sales close → Bạn nhận 5% deal value.", "You find a prospect (Name + Phone + Specific pain) → Submit to CRM → Sales close → You receive 5% of deal value.")}
                        </div>
                      </li>
                      <li className="flex gap-2">
                        <span className="shrink-0 mt-0.5 text-base">🥉</span>
                        <div>
                          <strong className="text-gray-900">{tx("Seeding dẫn về lead:", "Seeding leading to leads:")}</strong> {tx("Bạn post content → Người lạ inbox hỏi → Trở thành client → Bạn nhận Growth Support 10% + KPI Bonus Nhóm 2.", "You post content → Stranger messages → Becomes client → You get Growth Support 10% + Group 2 KPI Bonus.")} <span className="text-[#ff4d5f] font-bold">Double reward!</span>
                        </div>
                      </li>
                    </ul>

                    <div className="mt-5 bg-amber-50 rounded-xl p-4 border border-amber-200">
                      <p className="text-sm font-bold text-amber-900 flex items-center gap-1.5">
                        ⚠️ {tx("Commission Unlock — 2 đợt:", "Commission Unlock — 2 phases:")}
                      </p>
                      <ul className="mt-2 text-[0.85rem] text-amber-800 list-disc list-inside space-y-1.5 ml-1 marker:text-amber-400">
                        <li>{tx("70% hoa hồng trả sau tháng 2 (client đã paid, không refund, active >14 ngày)", "70% commission paid after month 2 (client paid, no refund, active >14 days)")}</li>
                        <li>{tx("30% còn lại trả sau tháng 3 (client vẫn active)", "Remaining 30% paid after month 3 (client still active)")}</li>
                        <li>{tx("Client cancel trước 30 ngày → hold toàn bộ. Cancel ngày 30–60 → thu hồi 30% đã trả.", "Client cancels before 30 days → full hold. Cancels day 30-60 → clawback 30% already paid.")}</li>
                      </ul>
                    </div>
                  </motion.div>
                )}

                {activeTab === "nhom2" && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                  >
                    <h3 className="text-xl font-extrabold text-[#427eff] flex items-center gap-2">
                      <span className="text-2xl">📊</span> {tx("Nhóm 2 — Thưởng KPI hàng tháng", "Group 2 — Monthly KPI Bonus")}
                    </h3>
                    <p className="mt-2 text-[0.95rem] leading-7 text-gray-700">
                      {tx("Không cần deal close. Cuối tháng Sales Lead verify → Trả thưởng theo % đạt. Đo chất lượng, không phải số lượng.", "No deal close needed. End of month Sales Lead verifies → Paid by % achieved. Quality over quantity.")}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2 sm:gap-4">
                      <div className="flex-1 bg-gray-50 rounded-xl p-3 border border-gray-200 text-center">
                        <p className="text-lg">❌</p>
                        <p className="font-bold text-gray-900 mt-1">{tx("Dưới 60%", "Below 60%")}</p>
                        <p className="text-[0.7rem] text-gray-500 mt-0.5">{tx("0x (Không thưởng)", "0x (No bonus)")}</p>
                      </div>
                      <div className="flex-1 bg-green-50 rounded-xl p-3 border border-green-200 text-center">
                        <p className="text-lg">🟢</p>
                        <p className="font-bold text-green-700 mt-1">80–99%</p>
                        <p className="text-[0.7rem] text-green-600 mt-0.5">{tx("1x (Đúng target)", "1x (On target)")}</p>
                      </div>
                      <div className="flex-1 bg-orange-50 rounded-xl p-3 border border-orange-200 text-center">
                        <p className="text-lg">🔥</p>
                        <p className="font-bold text-orange-600 mt-1">≥120%</p>
                        <p className="text-[0.7rem] text-orange-500 mt-0.5">{tx("2x (Top LB)", "2x (Top LB)")}</p>
                      </div>
                    </div>

                    <div className="mt-5 overflow-hidden rounded-xl border border-gray-200">
                      <table className="w-full table-fixed text-[0.78rem] sm:text-sm text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-100 text-gray-800">
                            <th className="w-[30%] p-2.5 sm:p-3 font-semibold">Role</th>
                            <th className="w-[24%] p-2.5 sm:p-3 font-semibold">{tx("KPI Seeding/tháng", "KPI Seeding/month")}</th>
                            <th className="w-[24%] p-2.5 sm:p-3 font-semibold">{tx("KPI Lead/tháng", "KPI Lead/month")}</th>
                            <th className="w-[22%] p-2.5 sm:p-3 font-semibold text-right">{tx("Bonus target", "Target Bonus")}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                          <tr className="hover:bg-gray-50">
                            <td className="p-2.5 sm:p-3 break-words">📣 Marketing/SDR</td>
                            <td className="p-2.5 sm:p-3 break-words text-gray-600">{tx("8 bài chất lượng", "8 quality posts")}</td>
                            <td className="p-2.5 sm:p-3 break-words text-gray-600">{tx("3 qualified leads", "3 qualified leads")}</td>
                            <td className="p-2.5 sm:p-3 font-bold text-[#427eff] text-right">200K/KPI</td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="p-2.5 sm:p-3 break-words">💻 Dev/Tech</td>
                            <td className="p-2.5 sm:p-3 break-words text-gray-600">{tx("3 bài chất lượng", "3 quality posts")}</td>
                            <td className="p-2.5 sm:p-3 break-words text-gray-600">{tx("2 qualified leads", "2 qualified leads")}</td>
                            <td className="p-2.5 sm:p-3 font-bold text-[#427eff] text-right">150K/KPI</td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="p-2.5 sm:p-3 break-words">⚙️ Ops/Finance/HR</td>
                            <td className="p-2.5 sm:p-3 break-words text-gray-600">{tx("2 bài chất lượng", "2 quality posts")}</td>
                            <td className="p-2.5 sm:p-3 break-words text-gray-600">{tx("1 qualified lead", "1 qualified lead")}</td>
                            <td className="p-2.5 sm:p-3 font-bold text-[#427eff] text-right">100K/KPI</td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="p-2.5 sm:p-3 break-words">🎓 Intern</td>
                            <td className="p-2.5 sm:p-3 break-words text-gray-600">{tx("3 bài chất lượng", "3 quality posts")}</td>
                            <td className="p-2.5 sm:p-3 break-words text-gray-600">{tx("1 qualified lead", "1 qualified lead")}</td>
                            <td className="p-2.5 sm:p-3 font-bold text-[#427eff] text-right">100K/KPI</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-4 bg-blue-50/70 rounded-xl p-4 border border-blue-100">
                      <p className="text-sm font-semibold text-blue-900 flex items-start gap-2">
                        <span className="text-lg leading-none shrink-0">📏</span>
                        <span>{tx("\"Bài seeding chất lượng\" = đạt ≥15 reactions HOẶC Sales Lead approve.", "\"Quality seeding post\" = reaches ≥15 reactions OR Sales Lead approves.")}<br/>
                        <span className="font-normal text-blue-800 mt-1 block">{tx("Không phải post về Markee — post về pain của khách, tips thực tế, case study. Thật là đủ. Không cần fancy.", "Do not post about Markee — post about client pain points, practical tips, case studies. Being authentic is enough. No fancy stuff needed.")}</span></span>
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
