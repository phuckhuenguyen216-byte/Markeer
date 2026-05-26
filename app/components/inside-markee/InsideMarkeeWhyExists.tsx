"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowDown,
  Cog,
  Handshake,
  HelpCircle,
  LockKeyhole,
  Megaphone,
  PieChart,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { useInsideMarkeeLocale } from "./useInsideMarkeeLocale";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
  viewport: { once: true, amount: 0.2 },
});

export default function InsideMarkeeWhyExists() {
  const { tx } = useInsideMarkeeLocale();

  const tags = [
    { label: "AI", Icon: Sparkles },
    { label: tx("TIẾP THỊ", "MARKETING"), Icon: Megaphone },
    { label: tx("TỰ ĐỘNG HÓA", "AUTOMATION"), Icon: Cog },
    { label: tx("BẢO MẬT", "SECURITY"), Icon: LockKeyhole },
    { label: tx("CỘNG ĐỒNG", "COMMUNITY"), Icon: Handshake },
  ];

  const questionBlocks = [
    tx("Nếu cùng là growth, ranh giới vai trò giữa Markee và Cloudgate nằm ở đâu?", "If both drive growth, where is the role boundary between Markee and Cloudgate?"),
    tx("Vì sao khi pitch, team nói business outcome trước rồi mới nói AI hoặc tool?", "Why does the team lead with business outcomes first, then AI/tools?"),
    tx("GoDanang là môi trường test workflow hay là business vận hành thật?", "Is GoDanang a workflow testbed or a real operating business?"),
    tx("SecurityZone là trust layer dài hạn hay kênh acquisition ngắn hạn?", "Is SecurityZone a long-term trust layer or a short-term acquisition channel?"),
    tx("Mỗi ecosystem nên đo KPI khác nhau như thế nào để không optimize sai mục tiêu?", "How should each ecosystem define KPIs to avoid optimizing the wrong target?"),
    tx("Khi nào một workflow nên chuyển từ service thủ công sang automation layer?", "When should a workflow move from manual service into an automation layer?"),
  ];

  const commonProblemItems = [
    tx("làm sai hướng", "move in the wrong direction"),
    tx("optimize sai thứ", "optimize the wrong thing"),
    tx("nghĩ team không focus", "assume the team is unfocused"),
    tx("không hiểu vì sao nhiều ecosystem tồn tại cùng lúc", "not understand why multiple ecosystems coexist"),
  ];

  const notItems = [
    tx("Một team chỉ bán tool AI để tạo cảm giác tương lai.", "A team that only sells AI tools to look futuristic."),
    tx("Một agency chỉ chạy marketing ngắn hạn và chase vanity metrics.", "An agency focused only on short-term marketing and vanity metrics."),
    tx("Một công ty security tách rời khỏi bài toán growth và operations.", "A security company isolated from growth and operations."),
    tx("Một startup SaaS build sản phẩm trước khi hiểu workflow thực tế.", "A SaaS startup building product before understanding real workflows."),
  ];

  const purposeItems = [
    tx("hiểu team thật sự đang build gì", "understand what the team is truly building"),
    tx("biết mỗi ecosystem đóng vai trò gì", "know what role each ecosystem plays"),
    tx("đi đúng hướng", "move in the right direction"),
    tx("không làm sai mục tiêu", "avoid optimizing the wrong target"),
  ];

  const flowNodes = [
    { label: "AI", Icon: Sparkles },
    { label: tx("Tự động hóa", "Automation"), Icon: Cog },
    { label: tx("Vận hành", "Operations"), Icon: PieChart },
    { label: tx("Tăng trưởng", "Growth"), Icon: TrendingUp },
    { label: tx("Cộng đồng", "Community"), Icon: Users },
  ];

  return (
    <section className="relative overflow-hidden bg-[#fffafb] py-24 sm:py-28 lg:py-32">
      <div className="pointer-events-none absolute right-[-14rem] top-[11%] h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(255,77,77,0.25)_0%,rgba(255,130,160,0.16)_42%,rgba(255,255,255,0)_72%)]" />
      <div className="pointer-events-none absolute bottom-[-12rem] left-[-12rem] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(255,77,77,0.2)_0%,rgba(255,255,255,0)_75%)]" />

      <div className="relative mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <motion.p {...fadeUp(0)} className="text-sm font-semibold tracking-[0.16em] text-slate-700 uppercase">
          {tx("VÌ SAO TRANG NÀY TỒN TẠI", "WHY THIS PAGE EXISTS")}
        </motion.p>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1.5fr_1fr]">
          <motion.div {...fadeUp(0.05)}>
            <h2 className="max-w-4xl text-[44px] leading-[1.04] font-extrabold tracking-[-0.03em] text-[#0b1020] sm:text-[58px] lg:text-[74px]">
              {tx("Đọc cái này trước", "Read this first")}
              <br />
              {tx("khi làm", "before doing")}{" "}
              <span className="bg-gradient-to-r from-[#FF3B3B] via-[#FF4C5F] to-[#FF5A7A] bg-clip-text text-transparent">
                {tx("bất cứ thứ gì.", "anything else.")}
              </span>
            </h2>

            <div className="mt-6 h-1 w-12 rounded-full bg-gradient-to-r from-[#FF3B3B] to-[#FF7A93]" />
            <p className="mt-6 max-w-3xl text-[1.95rem] leading-[1.28] text-slate-700 sm:text-[2.1rem]">
              {tx(
                "Nếu chỉ nhìn từ bên ngoài, team này sẽ trông như đang làm quá nhiều thứ cùng lúc.",
                "From the outside, this team can look like it is doing too many things at once."
              )}
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              {tags.map(({ label, Icon }) => (
                <span key={label} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-[0_8px_22px_-18px_rgba(15,23,42,0.35)]">
                  <Icon className="h-4 w-4 text-red-500" />
                  {label}
                </span>
              ))}
            </div>

            <p className="mt-5 text-xl text-slate-700">
              {tx(
                "Và thật lòng, điều đó rất dễ khiến mọi người bị rối nếu không có context chung.",
                "And honestly, this quickly creates confusion without shared context."
              )}
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.1)} className="rounded-[32px] border border-red-100 bg-white/95 p-6 shadow-[0_20px_50px_-30px_rgba(255,77,77,0.45)] sm:p-7">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-500">
                <AlertCircle className="h-5 w-5" />
              </span>
              <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold tracking-[0.11em] text-red-500 uppercase">
                {tx("VẤN ĐỀ THƯỜNG GẶP", "COMMON PROBLEM")}
              </span>
            </div>

            <h3 className="mt-5 text-[2.3rem] leading-[1.08] font-bold tracking-[-0.02em] text-[#0b1020] sm:text-[2.65rem]">
              {tx("Khi không hiểu", "When people don’t see")}
              <br />
              <span className="bg-gradient-to-r from-[#FF3B3B] to-[#FF5B7E] bg-clip-text text-transparent">
                {tx("bức tranh lớn,", "the big picture,")}
              </span>
            </h3>

            <p className="mt-3 text-lg text-slate-600">{tx("mọi người sẽ rất dễ:", "it becomes easy to:")}</p>
            <ul className="mt-4 space-y-3">
              {commonProblemItems.map((item) => (
                <li key={item} className="flex items-start gap-3 text-lg leading-8 text-slate-700">
                  <span className="mt-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-red-200 bg-red-50 text-xs font-bold text-red-500">×</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <div className="mt-10 grid gap-7 lg:grid-cols-2 lg:items-stretch">
          <motion.article {...fadeUp(0.16)} whileHover={{ y: -6 }} className="h-full rounded-[30px] border border-red-100 bg-white/95 p-6 shadow-[0_20px_60px_-35px_rgba(255,77,77,0.35)] sm:p-8">
            <div className="flex items-start gap-4">
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-red-500">
                <HelpCircle className="h-6 w-6" />
              </span>
              <div className="w-full">
                <h3 className="text-[2rem] leading-[1.2] font-bold text-[#121a2f] sm:text-[2.25rem]">
                  {tx("Nhiều người mới vào sẽ hỏi:", "Most new people ask:")}
                </h3>
                <div className="mt-6 space-y-4">
                  {questionBlocks.map((item) => (
                    <blockquote key={item} className="rounded-[20px] border border-red-100 bg-gradient-to-br from-white to-[#fff6f8] p-4 text-[1rem] leading-7 text-slate-700 sm:p-5 sm:text-[1.08rem] sm:leading-8">
                      {item}
                    </blockquote>
                  ))}
                </div>
              </div>
            </div>
          </motion.article>

          <div className="flex h-full flex-col gap-7">
            <motion.article {...fadeUp(0.2)} whileHover={{ y: -6 }} className="flex-1 rounded-[30px] border border-red-100 bg-white/95 p-6 shadow-[0_18px_50px_-30px_rgba(255,77,77,0.35)] sm:p-7">
              <p className="inline-flex rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold tracking-[0.12em] text-red-500 uppercase sm:text-sm">
                {tx("THỨ BỌN MÌNH KHÔNG PHẢI", "WHAT WE ARE NOT")}
              </p>
              <h3 className="mt-5 text-[2.25rem] leading-[1.08] font-bold tracking-[-0.02em] text-[#0b1020]">{tx("Không chỉ là một nhãn:", "Not just a label:")}</h3>
              <ul className="mt-5 space-y-3">
                {notItems.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[1.2rem] leading-8 text-slate-700">
                    <span className="mt-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-red-200 bg-red-50 text-[11px] font-bold text-red-500">×</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 border-t border-red-100 pt-5 text-lg leading-8 text-slate-600">
                {tx("Đó chỉ là lớp mô tả bề mặt, chưa phải chiến lược vận hành thật sự.", "Those are surface labels, not the real operating strategy.")}
              </p>
            </motion.article>

            <motion.article {...fadeUp(0.24)} whileHover={{ y: -6 }} className="flex-1 rounded-[30px] border border-red-100 bg-gradient-to-br from-white via-white to-[#fff2f6] p-6 shadow-[0_22px_60px_-32px_rgba(255,77,77,0.42)] sm:p-7">
              <p className="inline-flex rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold tracking-[0.12em] text-red-500 uppercase sm:text-sm">
                {tx("THỨ BỌN MÌNH ĐANG XÂY", "WHAT WE ARE BUILDING")}
              </p>
              <h3 className="mt-5 text-[2.4rem] leading-[1.1] font-bold tracking-[-0.02em] text-[#0b1020]">
                {tx("Một hệ sinh thái", "An ecosystem")}
                <br />
                {tx("giúp doanh nghiệp Việt Nam", "that helps Vietnamese businesses")}
                <br />
                <span className="bg-gradient-to-r from-[#FF3B3B] via-[#FF4C5F] to-[#FF5A7A] bg-clip-text text-transparent">{tx("tăng trưởng và", "grow and")}</span>
                <br />
                <span className="bg-gradient-to-r from-[#FF3B3B] via-[#FF4C5F] to-[#FF5A7A] bg-clip-text text-transparent">{tx("vận hành tốt hơn.", "operate better.")}</span>
              </h3>
              <p className="mt-4 text-base leading-7 text-slate-600">
                {tx("Không phải nhiều mảnh rời rạc. Đây là một hệ thống thống nhất giữa tăng trưởng, vận hành và niềm tin.", "Not fragmented efforts. One unified system across growth, operations, and trust.")}
              </p>
            </motion.article>
          </div>
        </div>

        <motion.article {...fadeUp(0.26)} className="mt-8 rounded-[30px] border border-red-100 bg-white/95 p-6 shadow-[0_16px_45px_-30px_rgba(255,77,77,0.36)] sm:p-9">
          <div className="relative hidden pb-1 lg:block">
            <div className="absolute left-[10%] right-[10%] top-8 border-t border-dashed border-red-300/80" />
            <div className="relative grid grid-cols-5 gap-5">
              {flowNodes.map((node) => {
                const Icon = node.Icon;
                return (
                  <div key={node.label} className="flex flex-col items-center">
                    <span className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-red-100 bg-red-50 text-red-500 shadow-[0_12px_24px_-16px_rgba(255,77,77,0.5)]">
                      <Icon className="h-7 w-7" />
                    </span>
                    <span className="mt-3 text-lg font-medium text-slate-700">{node.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 lg:hidden">
            {flowNodes.map((node) => {
              const Icon = node.Icon;
              return (
                <div key={node.label} className="rounded-2xl border border-red-100 bg-[#fff9fb] px-3 py-3 text-center">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-red-100 bg-red-50 text-red-500">
                    <Icon className="h-4 w-4" />
                  </span>
                  <p className="mt-2 text-sm font-semibold text-slate-700">{node.label}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex justify-center"><ArrowDown className="h-5 w-5 text-red-400" /></div>
          <div className="mt-2 flex justify-center">
            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-[#FF3B3B] to-[#FF5A7A] px-7 py-3 text-xl font-bold text-white shadow-[0_18px_34px_-20px_rgba(255,77,77,0.75)]">
              <Users className="mr-2 h-6 w-6" />
              {tx("Hệ sinh thái dài hạn", "Long-term Ecosystem")}
            </span>
          </div>
        </motion.article>

        <motion.article {...fadeUp(0.3)} className="mt-7 rounded-[30px] border border-amber-200 bg-gradient-to-r from-[#fff8e8] via-[#fffdf6] to-[#fff8e8] p-6 shadow-[0_16px_45px_-30px_rgba(217,119,6,0.35)] sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr] lg:items-center">
            <div>
              <p className="inline-flex rounded-full border border-amber-200 bg-white px-4 py-1.5 text-xs font-bold tracking-[0.11em] text-amber-700 uppercase sm:text-sm">
                {tx("MỤC ĐÍCH TÀI LIỆU NÀY", "THE PURPOSE OF THIS DOCUMENT")}
              </p>
              <h3 className="mt-4 text-[2.3rem] leading-[1.1] font-bold tracking-[-0.02em] text-[#0b1020] sm:text-[2.55rem]">
                {tx("Tài liệu này giải thích tất cả.", "This document explains everything.")}
              </h3>
            </div>

            <ul className="grid gap-3 text-lg leading-8 text-slate-700 sm:grid-cols-2">
              {purposeItems.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-red-200 bg-red-50 text-xs font-bold text-red-500">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </motion.article>

        <motion.div {...fadeUp(0.34)} className="mt-6 flex justify-center">
          <p className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3 text-[0.95rem] text-slate-600 shadow-[0_10px_24px_-18px_rgba(15,23,42,0.3)] sm:text-base">
            <span>
              <span className="font-semibold text-[#FF3B3B]">{tx("Nghe có vẻ phức tạp?", "Sounds complicated?")}</span>{" "}
              {tx("Đừng lo. Cứ đọc tiếp như đang đọc một câu chuyện thôi.", "Don’t worry. Keep reading it like a simple story.")}
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
