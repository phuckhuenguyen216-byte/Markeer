"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, CircleAlert, Cog, FileText, MessageSquareText, Network, TrendingUp, UserRound, Wrench, XCircle, Zap } from "lucide-react";
import { useInsideMarkeeLocale } from "./useInsideMarkeeLocale";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] as const },
  viewport: { once: true, amount: 0.2 },
});

export default function InsideMarkeeInternalAutomationSection() {
  const { tx } = useInsideMarkeeLocale();

  const automationFlow = [
    { title: tx("CÔNG VIỆC THỦ CÔNG", "HUMAN WORK"), Icon: UserRound, tone: "text-[#ff4d5f]", border: "border-[#ffd2db]", bg: "bg-[#fff8fa]" },
    { title: tx("QUY TRÌNH LẶP LẠI", "REPEATED WORKFLOW"), Icon: Wrench, tone: "text-[#6a5cff]", border: "border-[#dad5ff]", bg: "bg-[#f8f7ff]" },
    { title: tx("SOP ĐƯỢC GHI CHUẨN", "DOCUMENTED SOP"), Icon: FileText, tone: "text-[#2f73ff]", border: "border-[#d1e0ff]", bg: "bg-[#f5f9ff]" },
    { title: tx("MODULE TỰ ĐỘNG HÓA", "AUTOMATION MODULE"), Icon: Zap, tone: "text-[#0ea5b7]", border: "border-[#c8f2f7]", bg: "bg-[#f3fdff]" },
    { title: tx("HỆ THỐNG NỘI BỘ", "INTERNAL SYSTEM"), Icon: Network, tone: "text-[#ff7f37]", border: "border-[#ffdebf]", bg: "bg-[#fff9f3]" },
    { title: tx("VẬN HÀNH CÓ THỂ MỞ RỘNG", "SCALABLE OPERATIONS"), Icon: TrendingUp, tone: "text-white", border: "border-[#9f1f37]", bg: "bg-gradient-to-r from-[#ff4d5f] to-[#ff7f95]" },
  ];

  const agencyNormal = [tx("thuê thêm người", "hire more people"), tx("nhận thêm việc", "take more tasks"), tx("tăng áp lực bàn giao", "increase delivery pressure"), tx("phụ thuộc việc thủ công", "depend on manual work")];
  const markeeWay = [tx("quan sát quy trình", "observe workflow"), tx("ghi chuẩn SOP", "document SOP"), tx("tự động hóa việc lặp lại", "automate repeated work"), tx("tái sử dụng mô-đun", "reuse modules"), tx("cải tiến theo từng vòng", "improve every cycle")];

  const automateTargets = [
    { label: tx("Lọc khách tiềm năng", "Lead qualification"), Icon: MessageSquareText },
    { label: tx("Xử lý inbox", "Inbox handling"), Icon: MessageSquareText },
    { label: tx("Hệ thống follow-up", "Follow-up systems"), Icon: Zap },
    { label: tx("Quy trình CRM", "CRM workflows"), Icon: Network },
    { label: tx("Báo cáo", "Reporting"), Icon: FileText },
    { label: tx("Việc bàn giao lặp lại", "Repetitive delivery tasks"), Icon: Cog },
  ];

  const evolution = [
    { title: "PHASE 1", mode: tx("Con người dẫn dắt, AI hỗ trợ", "Human-led, AI-assisted"), percent: 34 },
    { title: "PHASE 2", mode: tx("Vận hành lai", "Hybrid operations"), percent: 66 },
    { title: "LONG-TERM", mode: tx("Hệ thống dẫn dắt, con người định hướng", "System-led, human-directed"), percent: 92 },
  ];

  const warning = [tx("nhiều noise hơn", "more noise"), tx("nhiều complexity hơn", "more complexity"), tx("systems khó maintain hơn", "harder systems maintenance")];

  return (
    <section className="imfx-sec-auto relative overflow-hidden bg-[#fffafb] py-24 sm:py-28 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(11,16,32,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(11,16,32,0.03)_1px,transparent_1px)] bg-[size:58px_58px]" />
      <div className="pointer-events-none absolute left-1/2 top-[-11rem] h-[33rem] w-[33rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,77,77,0.18)_0%,rgba(255,170,186,0.12)_38%,rgba(255,255,255,0)_76%)] blur-3xl" />

      <div className="relative mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
        <motion.p
          {...fadeUp(0)}
          className="text-sm font-semibold tracking-[0.17em] text-[#0b1020]/80 uppercase"
        >
          {tx("HỆ TỰ ĐỘNG HÓA NỘI BỘ", "INTERNAL AUTOMATION SYSTEM")}
        </motion.p>

        <motion.div {...fadeUp(0.05)} className="mx-auto mt-8 max-w-[1260px] text-center">
          <h2 className="mt-4 text-[2rem] leading-[1.05] font-extrabold tracking-[-0.03em] text-[#0b1020] sm:text-[2.95rem] lg:text-[3.65rem]">
            <span className="block">{tx("VŨ KHÍ THẬT SỰ CỦA MARKEE", "MARKEE'S REAL WEAPON")}</span>
            <span className="block text-[#ff4d5f]">{tx("KHÔNG PHẢI AI.", "IS NOT AI.")}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-[900px] text-xl leading-9 text-[#0b1020]/76">
            {tx(
              "Nhìn từ ngoài, Markee giống agency. Bên trong, đội đang biến quy trình lặp lại thành hệ thống.",
              "From outside, Markee looks like an agency. Inside, the team turns repeated workflows into systems."
            )}
          </p>
        </motion.div>

        <motion.article {...fadeUp(0.1)} className="imfx-edge-run mt-10 rounded-[30px] border border-red-100/80 bg-white/95 p-6 shadow-[0_24px_58px_-40px_rgba(15,23,42,0.54)] sm:p-7">
          <p className="text-sm font-semibold tracking-[0.16em] text-[#ff4d5f] uppercase">
            {tx("CON NGƯỜI → HỆ THỐNG → TỰ ĐỘNG HÓA", "HUMAN → SYSTEM → AUTOMATION")}
          </p>
          <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr_auto_1.2fr] lg:items-stretch">
            {automationFlow.map((item, index) => {
              const Icon = item.Icon;
              const isLast = index === automationFlow.length - 1;
              const isFinalNode = isLast;
              return (
                <div key={item.title} className="contents">
                  <div className={`rounded-2xl border p-3 sm:p-4 ${item.bg} ${item.border} ${isFinalNode ? "shadow-[0_16px_35px_-24px_rgba(255,77,95,0.9)]" : ""}`}>
                    <div className="flex items-center gap-2.5">
                      <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full border ${isFinalNode ? "border-white/40 bg-white/12 text-white" : `${item.border} bg-white ${item.tone}`}`}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <p className={`text-sm font-bold ${isFinalNode ? "text-white" : item.tone}`}>{item.title}</p>
                    </div>
                  </div>
                  {!isLast ? (
                    <div className="hidden items-center justify-center lg:flex">
                      <ArrowRight className="h-4 w-4 text-red-300" />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </motion.article>

        <div className="mt-8 grid gap-5 xl:grid-cols-2">
          <motion.article {...fadeUp(0.14)} className="imfx-pulse-soft rounded-[28px] border border-red-100/80 bg-gradient-to-br from-[#fff8fa] via-white to-[#fff4f7] p-6 shadow-[0_18px_46px_-36px_rgba(15,23,42,0.48)]">
            <p className="text-sm font-semibold tracking-[0.16em] text-[#ff4d5f] uppercase">{tx("AGENCY TRUYỀN THỐNG", "TRADITIONAL AGENCY")}</p>
            <ul className="mt-4 space-y-2.5 text-[#0b1020]/78">
              {agencyNormal.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm leading-6">
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#ff4d5f]" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-lg font-bold text-[#ff4d5f]">{tx("Kết quả: nghẽn.", "Result: Bottleneck.")}</p>
          </motion.article>

          <motion.article {...fadeUp(0.18)} className="imfx-pulse-soft rounded-[28px] border border-red-100/80 bg-gradient-to-br from-[#fff8fa] via-white to-[#fff3f6] p-6 shadow-[0_18px_46px_-36px_rgba(15,23,42,0.48)]">
            <p className="text-sm font-semibold tracking-[0.16em] text-[#ff4d5f] uppercase">
              MARKEE
            </p>
            <ul className="mt-4 space-y-2.5 text-[#0b1020]/78">
              {markeeWay.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm leading-6">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#ff4d5f]" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-lg font-bold text-[#ff4d5f]">{tx("Kết quả: vận hành tốt hơn.", "Result: Better operations.")}</p>
          </motion.article>
        </div>

        <motion.article {...fadeUp(0.22)} className="imfx-edge-run mt-8 rounded-[28px] border border-red-100/80 bg-white/95 p-6 shadow-[0_20px_56px_-40px_rgba(15,23,42,0.52)]">
          <p className="text-sm font-semibold tracking-[0.16em] text-[#ff4d5f] uppercase">{tx("NHỮNG THỨ BỌN MÌNH TỰ ĐỘNG HÓA TRƯỚC", "WHAT WE AUTOMATE FIRST")}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {automateTargets.map((item) => {
              const Icon = item.Icon;
              return (
                <p key={item.label} className="flex items-center gap-2 rounded-full border border-red-100 bg-[#fff9fb] px-4 py-2 text-sm font-medium text-[#0b1020]/82">
                  <Icon className="h-4 w-4 text-[#ff4d5f]" />
                  {item.label}
                </p>
              );
            })}
          </div>
          <p className="mt-5 rounded-xl border border-red-100 bg-[#fff8fa] px-4 py-3 text-sm leading-6 text-[#0b1020]/78">
            {tx("Chỉ tự động hóa thứ đã xác thực, lặp lại đủ nhiều, và có thể mở rộng ổn định.", "Automate only what is validated, repeated enough, and stably scalable.")}
          </p>
        </motion.article>

        <motion.article {...fadeUp(0.26)} className="imfx-bars mt-8 rounded-[28px] border border-red-100/80 bg-white/95 p-6 shadow-[0_20px_56px_-40px_rgba(15,23,42,0.52)]">
          <p className="text-sm font-semibold tracking-[0.16em] text-[#ff4d5f] uppercase">
            {tx("TIẾN HÓA VAI TRÒ CON NGƯỜI", "HUMAN EVOLUTION")}
          </p>
          <div className="mt-4 space-y-4">
            {evolution.map((item) => (
              <div key={item.title}>
                <div className="mb-1.5 flex items-center justify-between">
                  <p className="text-sm font-bold tracking-[0.08em] text-[#0b1020]/76 uppercase">{item.title}</p>
                  <p className="text-sm font-semibold text-[#0b1020]">{item.mode}</p>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-red-100/70">
                  <span className="block h-full rounded-full bg-gradient-to-r from-[#ff4d5f] via-[#ff7f93] to-[#ff9baa]" style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-5 text-base leading-7 text-[#0b1020]/78">
            {tx("Con người không biến mất. Con người chuyển từ làm việc lặp sang chiến lược, quan hệ, ra quyết định và sáng tạo.", "Humans do not disappear. They shift from tasks to strategy, relationships, decisions, and creativity.")}
          </p>
        </motion.article>

        <motion.article
          {...fadeUp(0.3)}
          className="relative mt-8 overflow-hidden rounded-[30px] border border-[#5a101f] bg-[radial-gradient(circle_at_18%_25%,rgba(255,77,77,0.3),transparent_45%),radial-gradient(circle_at_82%_8%,rgba(255,140,165,0.22),transparent_56%),linear-gradient(135deg,#2a0812_0%,#511224_100%)] p-8 sm:p-10"
        >
          <p className="text-[2rem] leading-[1.07] font-extrabold tracking-[-0.03em] text-white sm:text-[3.25rem] lg:text-[4.2rem]">
            {tx("HỆ THỐNG MỚI MỞ RỘNG ĐƯỢC.", "SYSTEMS SCALE.")}
            <br />
            <span className="text-[#ff9fb0]">
              {tx("VIỆC THỦ CÔNG THÌ KHÔNG.", "MANUAL WORK DOES NOT.")}
            </span>
          </p>
          <p className="mt-4 max-w-[760px] text-lg leading-8 text-white/84">
            {tx("Nếu một quy trình phải làm tay quá nhiều lần, đó không phải việc đơn lẻ. Đó là tín hiệu để xây hệ thống.", "If a workflow is repeated manually too often, it is not a task. It is a signal to build a system.")}
          </p>
        </motion.article>

        <motion.article {...fadeUp(0.34)} className="imfx-pulse-soft mt-8 rounded-[28px] border border-amber-200 bg-gradient-to-r from-[#fff9ef] via-white to-[#fff8ef] p-6">
          <p className="inline-flex items-center gap-2 text-sm font-semibold tracking-[0.14em] text-amber-700 uppercase">
            <CircleAlert className="h-4 w-4" />
            {tx("CẢNH BÁO CUỐI", "Final Warning")}
          </p>
          <p className="mt-3 text-xl font-bold text-[#0b1020]">{tx("Tự động hóa không phải mục tiêu cuối cùng.", "Automation is not the final goal.")}</p>
          <p className="mt-2 text-base text-[#0b1020]/76">{tx("Better operations mới là mục tiêu cuối cùng.", "Better operations is the final goal.")}</p>
          <ul className="mt-4 space-y-2 text-[#0b1020]/78">
            {warning.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm leading-6">
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-xl border border-amber-200 bg-white px-4 py-3 text-sm font-semibold text-amber-700">
            {tx(
              "Rõ vận hành trước khi tự động hóa.",
              "Operational clarity before automation."
            )}
          </p>
        </motion.article>
      </div>
    </section>
  );
}

