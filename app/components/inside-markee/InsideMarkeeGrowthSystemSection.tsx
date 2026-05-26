"use client";

import { motion } from "framer-motion";
import type { ComponentType } from "react";
import { ArrowRight, FileSearch, Search, ShieldCheck, Wrench } from "lucide-react";
import { useInsideMarkeeLocale } from "./useInsideMarkeeLocale";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] as const },
  viewport: { once: true, amount: 0.2 },
});

type SourceNode = {
  title: string;
  tone: string;
  border: string;
  bg: string;
  Icon: ComponentType<{ className?: string }>;
  bullets: string[];
};

export default function InsideMarkeeGrowthSystemSection() {
  const { tx } = useInsideMarkeeLocale();

  const sourceNodes: SourceNode[] = [
    {
      title: tx("TIẾP CẬN CHỦ ĐỘNG", "OUTBOUND"),
      tone: "text-[#6a5cff]",
      border: "border-[#dad5ff]",
      bg: "bg-[#f9f8ff]",
      Icon: Search,
      bullets: [
        tx("khảo sát", "audit"),
        tx("tiếp cận", "outreach"),
        tx("tin nhắn người sáng lập", "founder DM"),
        tx("hợp tác", "partnerships"),
      ],
    },
    {
      title: tx("NỘI DUNG", "CONTENT"),
      tone: "text-[#ff4d5f]",
      border: "border-[#ffd2db]",
      bg: "bg-[#fff8fa]",
      Icon: FileSearch,
      bullets: [
        tx("tình huống thực tế", "case study"),
        tx("nội dung từ người sáng lập", "founder content"),
        tx("video ngắn", "reels"),
        tx("góc nhìn vận hành", "operational insight"),
      ],
    },
    {
      title: tx("CỘNG ĐỒNG", "COMMUNITY"),
      tone: "text-[#0ea5b7]",
      border: "border-[#c8f2f7]",
      bg: "bg-[#f4fdff]",
      Icon: ShieldCheck,
      bullets: [
        tx("SecurityZone", "SecurityZone"),
        tx("niềm tin", "trust"),
        tx("quan hệ", "relationships"),
        tx("giới thiệu", "referrals"),
      ],
    },
    {
      title: tx("BÀN GIAO", "DELIVERY"),
      tone: "text-[#2f73ff]",
      border: "border-[#d1e0ff]",
      bg: "bg-[#f5f9ff]",
      Icon: Wrench,
      bullets: [
        tx("hệ thống", "systems"),
        tx("tự động hóa", "automation"),
        tx("kết quả khách hàng", "client results"),
        tx("duy trì khách hàng", "retention"),
      ],
    },
  ];

  const engineFlow = [
    tx("NỖI ĐAU VẬN HÀNH", "Operational Pain"),
    tx("HỘI THOẠI CHẤT LƯỢNG", "Qualified Conversation"),
    tx("TÍN HIỆU NIỀM TIN", "Trust Signals"),
    tx("KẾT QUẢ CHO KHÁCH HÀNG", "Client Result"),
    tx("ĐẦU RA TÌNH HUỐNG THỰC TẾ", "Case Study Output"),
    tx("CỖ MÁY THU HÚT KHÁCH", "Acquisition Engine"),
  ];

  const flywheel = [
    tx("PHÁT HIỆN NỖI ĐAU", "Pain Discovery"),
    tx("HỘI THOẠI", "Conversation"),
    tx("NIỀM TIN", "Trust"),
    tx("KHÁCH HÀNG", "Client"),
    tx("TÌNH HUỐNG THỰC TẾ", "Case Study"),
    tx("NỘI DUNG", "Content"),
    tx("NHIỀU NIỀM TIN HƠN", "More Trust"),
  ];

  return (
    <section className="imfx-sec-growth relative overflow-hidden bg-gradient-to-b from-[#fffdfd] via-[#fffafc] to-[#fff7fb] py-24 sm:py-28 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,123,147,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,123,147,0.08)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="pointer-events-none absolute left-[-11rem] top-[-7rem] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(255,123,147,0.2)_0%,rgba(255,255,255,0)_74%)] blur-3xl" />
      <div className="pointer-events-none absolute right-[-10rem] bottom-[-8rem] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(255,123,147,0.16)_0%,rgba(255,255,255,0)_74%)] blur-3xl" />

      <div className="relative mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
        <motion.p
          {...fadeUp(0)}
          className="text-sm font-semibold tracking-[0.17em] text-[#0b1020]/80 uppercase"
        >
          {tx("BẢN ĐỒ CỖ MÁY TĂNG TRƯỞNG", "GROWTH ENGINE MAP")}
        </motion.p>

        <motion.div {...fadeUp(0.05)} className="mx-auto mt-8 max-w-[1280px] text-center">
          <h2 className="text-[1.95rem] leading-[1.06] font-extrabold tracking-[-0.03em] text-[#0b1020] sm:text-[2.9rem] lg:text-[3.35rem]">
            <span className="block">
              {tx("BẢN ĐỒ CỖ MÁY TĂNG TRƯỞNG", "GROWTH ENGINE MAP")}
            </span>
            <span className="block text-[#ff4d5f]">
              {tx("KHỞI ĐẦU TỪ NỖI ĐAU VẬN HÀNH,", "STARTS FROM OPERATIONAL PAIN,")}
            </span>
            <span className="block text-[#ff4d5f]">
              {tx("KHÔNG BẮT ĐẦU TỪ ADS.", "NOT FROM ADS.")}
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-[860px] text-xl leading-9 text-[#0b1020]/76">
            {tx(
              "Chúng ta không build cỗ máy bán hàng. Chúng ta build hệ thống niềm tin và biến nó thành cỗ máy thu hút khách.",
              "We are not building a sales machine. We are building trust systems that become an acquisition engine."
            )}
          </p>
        </motion.div>

        <motion.article
          {...fadeUp(0.1)}
          className="mt-10 rounded-[32px] border border-red-100/80 bg-white/95 p-5 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.55)] sm:p-7"
        >
          <div className="grid items-stretch gap-5 lg:grid-cols-[1fr_1fr]">
            <div className="space-y-3">
              <p className="text-xs font-semibold tracking-[0.16em] text-[#ff4d5f] uppercase">
                {tx("NGUỒN TĂNG TRƯỞNG", "Growth Sources")}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {sourceNodes.map((item) => {
                  const Icon = item.Icon;
                  return (
                    <div key={item.title} className={`rounded-2xl border p-4 ${item.border} ${item.bg}`}>
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full border bg-white ${item.border} ${item.tone}`}>
                          <Icon className="h-5 w-5" />
                        </span>
                        <p className={`text-lg font-extrabold ${item.tone}`}>{item.title}</p>
                      </div>
                      <ul className="mt-3 space-y-1.5 text-sm text-[#0b1020]/78">
                        {item.bullets.map((bullet) => (
                          <li key={bullet} className="flex items-start gap-2">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#ff7b93]" />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  tx("Tiếp cận chủ động -> Thu thập nỗi đau", "Outbound -> Pain Capture"),
                  tx("Nội dung -> Hội thoại tốt hơn", "Content -> Better Conversation"),
                  tx("Cộng đồng -> Lớp niềm tin", "Community -> Trust Layer"),
                  tx("Bàn giao -> Tín hiệu kết quả", "Delivery -> Result Signals"),
                ].map((item) => (
                  <p key={item} className="rounded-lg border border-red-100 bg-[#fff8fa] px-3 py-2 text-xs font-semibold tracking-[0.02em] text-[#0b1020]/80">
                    {item}
                  </p>
                ))}
              </div>
            </div>

            <div className="flex h-full flex-col rounded-2xl border border-[#ffdbe3] bg-gradient-to-br from-[#fff8fa] via-white to-[#fffafb] p-5">
              <p className="text-xs font-semibold tracking-[0.16em] text-[#ff4d5f] uppercase">
                {tx("PIPELINE VẬN HÀNH", "ENGINE PIPELINE")}
              </p>
              <div className="relative mt-4 pl-9">
                <div className="pointer-events-none absolute bottom-1 left-3 top-1 w-px bg-gradient-to-b from-[#ffd6de] via-[#ff7b93] to-[#ffd6de]" />
                {engineFlow.map((step, index) => {
                  const isLast = index === engineFlow.length - 1;
                  return (
                    <div key={step} className="relative mb-3">
                      <span className="absolute -left-9 top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-md border border-[#ffd6de] bg-white px-1 text-[11px] font-bold text-[#ff4d5f]">
                        {index + 1}
                      </span>
                      <div
                        className={`rounded-xl border px-3 py-2 text-sm font-semibold ${
                          isLast ? "border-[#ff4d5f] bg-gradient-to-r from-[#ff4d5f] to-[#ff7f95] text-white" : "border-[#ffd6de] bg-white text-[#0b1020]"
                        }`}
                      >
                        {step}
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="mt-4 rounded-xl border border-red-100 bg-white px-4 py-3 text-sm leading-6 text-[#0b1020]/78">
                {tx(
                  "Mọi nguồn tăng trưởng đều đi vào một cỗ máy chung, thay vì chạy task rời rạc.",
                  "All growth sources feed one shared engine instead of disconnected tasks."
                )}
              </p>
              <p className="mt-3 rounded-xl border border-red-100 bg-[#fff8fa] px-4 py-3 text-sm leading-6 text-[#0b1020]/78">
                {tx(
                  "Đầu vào đa dạng, đầu ra phải đồng bộ vào một pipeline có kỷ luật.",
                  "Inputs can vary, but output must converge into one disciplined pipeline."
                )}
              </p>
            </div>
          </div>
        </motion.article>

        <motion.article
          {...fadeUp(0.16)}
          className="mt-10 rounded-[30px] border border-red-100/80 bg-white/95 p-6 shadow-[0_20px_56px_-40px_rgba(15,23,42,0.54)] sm:p-7"
        >
          <p className="text-sm font-semibold tracking-[0.16em] text-[#ff4d5f] uppercase">
            {tx("FLYWHEEL TÍCH LŨY", "COMPOUND FLYWHEEL")}
          </p>
          <div className="mt-4 hidden pb-2 lg:block">
            <div className="flex flex-wrap items-center gap-2">
              {flywheel.map((node, index) => (
                <div key={node} className="flex items-center gap-2">
                  <span className="inline-flex rounded-full border border-[#ffd6de] bg-[#fff9fb] px-4 py-2 text-sm font-semibold text-[#0b1020]">{node}</span>
                  {index !== flywheel.length - 1 ? <ArrowRight className="h-4 w-4 text-[#ff7b93]" /> : null}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 lg:hidden">
            {flywheel.map((node) => (
              <span
                key={node}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#ffd6de] bg-[#fff9fb] px-3 py-2 text-center text-sm font-semibold text-[#0b1020]"
              >
                {node}
              </span>
            ))}
          </div>
          
          <p className="mt-5 text-base leading-7 text-[#0b1020]/78">
            <span className="font-semibold text-[#ff4d5f]">
              {tx("Đây là hệ thống thu hút khách.", "This is an acquisition system.")}
            </span>{" "}
            {tx(
              "Không phải kiểu marketing agency chạy các task rời rạc.",
              "Not an agency-style setup with disconnected tasks."
            )}
          </p>
        </motion.article>

        <motion.p
          {...fadeUp(0.22)}
          className="mt-8 text-center text-base leading-7 text-[#0b1020]/82"
        >
          {tx(
            "Khi cỗ máy tăng trưởng đã rõ, câu hỏi tiếp theo là: đội tự động hóa chính mình như thế nào?",
            "Once the growth engine is clear, the next question is: How does the team automate itself?"
          )}
        </motion.p>
      </div>
    </section>
  );
}
