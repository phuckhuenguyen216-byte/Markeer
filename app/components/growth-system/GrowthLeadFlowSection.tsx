"use client";

import { motion } from "framer-motion";
import { Clock3, Handshake, SearchCheck } from "lucide-react";
import { useGrowthLocale } from "./useGrowthLocale";

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.58, delay, ease: [0.22, 1, 0.36, 1] as const },
  viewport: { once: true, amount: 0.25 },
});

export default function GrowthLeadFlowSection() {
  const { tx } = useGrowthLocale();

  const priorities = [
    {
      titleVi: "Prior relationship",
      titleEn: "Prior relationship",
      descVi: "Ưu tiên cao nhất nếu có context quan hệ thật.",
      descEn: "Top priority when real relationship context exists.",
      Icon: Handshake,
    },
    {
      titleVi: "Discovery quality",
      titleEn: "Discovery quality",
      descVi: "Ai hiểu pain sâu hơn sẽ có ownership mạnh hơn.",
      descEn: "Deeper pain discovery builds stronger ownership.",
      Icon: SearchCheck,
    },
    {
      titleVi: "CRM timestamp",
      titleEn: "CRM timestamp",
      descVi: "Chỉ dùng làm tiebreaker cho case ngang nhau.",
      descEn: "Only used as tie-breaker for equal cases.",
      Icon: Clock3,
    },
  ];

  const steps = [
    tx("Ghi prospect + pain cụ thể", "Capture prospect + specific pain"),
    tx("Submit đúng format", "Submit in correct format"),
    tx("Sales Lead log CRM", "Sales Lead logs CRM"),
    tx("Chờ close + unlock", "Wait for close + unlock"),
  ];

  return (
    <section className="relative overflow-hidden py-18 sm:py-22 lg:py-26">
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(59,130,246,0.06)_0%,rgba(255,255,255,0)_36%),radial-gradient(circle_at_74%_72%,rgba(255,77,95,0.08)_0%,rgba(255,255,255,0)_34%)]"
        animate={{ opacity: [0.86, 1, 0.86] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <motion.div {...reveal(0)} className="relative mx-auto max-w-[980px] text-center">
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-5 h-16 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,77,95,0.22)_0%,rgba(255,255,255,0)_72%)] blur-xl"
            animate={{ opacity: [0.4, 1, 0.4], scale: [0.95, 1.08, 0.95] }}
            transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
          />
          <p className="mk-eyebrow text-[#ff4d5f] uppercase">
            {tx("03 · Outbound & Inbound", "03 · Outbound & Inbound")}
          </p>
          <h2 className="mk-section-title mx-auto mt-4 max-w-[22ch] uppercase sm:max-w-[30ch] lg:max-w-none">
            <span className="block text-[#0b1020]">{tx("KHÔNG CÒN LÀ AI NHẮN TRƯỚC.", "NO LONGER WHO MESSAGES FIRST.")}</span>
            <span className="mk-section-title-accent block bg-gradient-to-r from-[#ff3f57] via-[#ff4d5f] to-[#ff7a94] bg-clip-text text-transparent">
              {tx("MÀ LÀ AI MANG CONTEXT TỐT HƠN.", "IT IS WHO BRINGS BETTER CONTEXT.")}
            </span>
          </h2>
        </motion.div>

        <div className="mt-8 grid gap-7 lg:grid-cols-[1fr_1fr] lg:items-start">
          <motion.article
            {...reveal(0.06)}
            className="relative overflow-hidden rounded-[30px] bg-[#160f22] p-6 text-[#dbe7ff] shadow-[0_30px_72px_-48px_rgba(22,15,34,0.78)] sm:p-7"
          >
            <motion.div
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(255,255,255,0.05)_50%,transparent_100%)]"
              animate={{ y: ["-100%", "100%"] }}
              transition={{ duration: 5.2, repeat: Infinity, ease: "linear" }}
            />

            <p className="text-xs font-semibold tracking-[0.14em] text-[#7db2ff] uppercase">{tx("Priority stack", "Priority stack")}</p>
            <div className="relative mt-5 space-y-4">
              {priorities.map((item, index) => {
                const Icon = item.Icon;
                return (
                  <motion.article
                    key={item.titleVi}
                    initial={{ opacity: 0, x: -14 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.45, delay: 0.12 + index * 0.08 }}
                    viewport={{ once: true, amount: 0.2 }}
                    className="rounded-2xl bg-white/8 px-4 py-4"
                  >
                    <p className="inline-flex items-center gap-2 text-sm font-semibold text-white">
                      <Icon className="h-4 w-4 text-[#7db2ff]" />
                      {tx(item.titleVi, item.titleEn)}
                    </p>
                    <p className="mt-1.5 text-sm leading-6 text-[#dbe7ff]/82 sm:text-base sm:leading-7">{tx(item.descVi, item.descEn)}</p>
                  </motion.article>
                );
              })}
            </div>
          </motion.article>

          <motion.article
            {...reveal(0.12)}
            className="relative overflow-hidden rounded-[30px] bg-[linear-gradient(170deg,#ffffff_0%,#fff8fb_100%)] p-6 shadow-[0_28px_66px_-48px_rgba(15,23,42,0.54)] sm:p-7"
          >
            <p className="text-xs font-semibold tracking-[0.14em] text-[#ff4d5f] uppercase">{tx("4-step submit flow", "4-step submit flow")}</p>

            <div className="relative mt-5">
              <svg className="pointer-events-none absolute left-0 top-3 hidden h-[calc(100%-24px)] w-[34px] sm:block" viewBox="0 0 34 260" preserveAspectRatio="none" aria-hidden>
                <path d="M18 0 C10 26, 26 44, 18 70 C10 96, 26 114, 18 140 C10 168, 26 186, 18 214 C14 232, 18 246, 18 260" stroke="rgba(255,77,95,0.36)" strokeWidth="1.2" fill="none" />
              </svg>

              <div className="space-y-4">
                {steps.map((step, index) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.14 + index * 0.08 }}
                    viewport={{ once: true, amount: 0.25 }}
                    className="relative rounded-2xl bg-white px-4 py-3.5 shadow-[0_12px_28px_-22px_rgba(15,23,42,0.48)] sm:pl-12"
                  >
                    <span className="mb-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#ff4d5f] text-xs font-semibold text-white sm:absolute sm:left-3 sm:top-3.5">
                      {index + 1}
                    </span>
                    <p className="text-sm leading-6 text-[#0b1020]/78 sm:text-base sm:leading-7">{step}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {["FB Ads Library", "TikTok comments", "Zalo/FB groups", "Prior network", "Founder content"].map((item) => (
                <span key={item} className="rounded-full bg-[#f5f8ff] px-3 py-1.5 text-sm text-[#23427a]">
                  {item}
                </span>
              ))}
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
