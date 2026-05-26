"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowDown,
  CheckCircle2,
  CircleAlert,
  Cog,
  Sparkles,
  Target,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { useInsideMarkeeLocale } from "./useInsideMarkeeLocale";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] as const },
  viewport: { once: true, amount: 0.2 },
});

export default function InsideMarkeeServiceFirstSection() {
  const { tx } = useInsideMarkeeLocale();

  const antiPatternItems = [
    tx("Build trước khi hiểu pain", "Build before understanding pain"),
    tx("Automate trước khi có workflow thật", "Automate before real workflows"),
    tx("Scale thứ chưa thật sự work", "Scale what is not proven to work"),
  ];

  const pipelineItems = [
    {
      label: tx("DỊCH VỤ", "SERVICE"),
      desc: tx("Làm trực tiếp với khách hàng thật.", "Work directly with real customers."),
      textColor: "text-[#ff5b5b]",
      borderColor: "border-[#ff9ca7]",
      dotColor: "bg-[#ff5b5b]",
    },
    {
      label: tx("HỌC", "LEARN"),
      desc: tx("Hiểu pain thật.", "Understand real pain."),
      textColor: "text-[#c96bff]",
      borderColor: "border-[#ddb2ff]",
      dotColor: "bg-[#c96bff]",
    },
    {
      label: tx("TỰ ĐỘNG HÓA", "AUTOMATE"),
      desc: tx("Chỉ automate thứ đã validated.", "Automate only validated workflows."),
      textColor: "text-[#6f78ff]",
      borderColor: "border-[#c5caff]",
      dotColor: "bg-[#6f78ff]",
    },
    {
      label: tx("ĐÓNG GÓI", "PRODUCTIZE"),
      desc: tx("Workflow tốt nhất trở thành system.", "Best workflows become systems."),
      textColor: "text-[#4d7dff]",
      borderColor: "border-[#bad0ff]",
      dotColor: "bg-[#4d7dff]",
    },
    {
      label: tx("MỞ RỘNG", "SCALE"),
      desc: tx("Software hóa và nhân bản.", "Software scales and multiplies."),
      textColor: "text-[#28b5d6]",
      borderColor: "border-[#a8e8ff]",
      dotColor: "bg-[#28b5d6]",
    },
  ];

  const miniCards = [
    {
      title: "SERVICE",
      text: tx("Làm trực tiếp với khách thật.", "Work directly with real customers."),
      icon: Target,
      tone: "text-[#ff4d4d]",
      border: "border-[#ffd2d2]",
      bg: "bg-[#fff8f8]",
    },
    {
      title: "LEARN",
      text: tx("Hiểu pain thật. Không phải assumption.", "Learn real pain. Not assumptions."),
      icon: Sparkles,
      tone: "text-[#9d4edd]",
      border: "border-[#e7d1ff]",
      bg: "bg-[#fbf8ff]",
    },
    {
      title: "AUTOMATE",
      text: tx("Chỉ automate thứ đã validated.", "Automate only what is validated."),
      icon: Cog,
      tone: "text-[#4068ff]",
      border: "border-[#cfdbff]",
      bg: "bg-[#f7f9ff]",
    },
    {
      title: "SCALE",
      text: tx("Software trở thành multiplier.", "Software becomes a multiplier."),
      icon: TrendingUp,
      tone: "text-[#0ea5b7]",
      border: "border-[#c8f2f7]",
      bg: "bg-[#f5fdff]",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-white py-24 sm:py-28 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(11,16,32,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(11,16,32,0.03)_1px,transparent_1px)] bg-[size:58px_58px]" />
      <div className="pointer-events-none absolute left-[-12rem] top-[-10rem] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(255,77,77,0.18)_0%,rgba(255,255,255,0)_72%)] blur-3xl" />
      <div className="pointer-events-none absolute right-[-12rem] bottom-[-10rem] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(121,99,255,0.13)_0%,rgba(255,255,255,0)_74%)] blur-3xl" />

      <div className="relative mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <motion.p
          {...fadeUp(0)}
          className="text-sm font-semibold tracking-[0.16em] text-[#0b1020]/82 uppercase"
        >
          {tx("VÌ SAO ƯU TIÊN SERVICE", "WHY SERVICE FIRST")}
        </motion.p>

        <div className="mt-7 grid items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
          <motion.div {...fadeUp(0.05)} className="h-full max-w-[780px] lg:max-w-none">
            <h2 className="text-[2rem] leading-[1.06] font-extrabold tracking-[-0.03em] text-[#0b1020] sm:text-[3.2rem] lg:text-[5rem]">
              {tx("Tại sao bọn mình", "Why we")}
              <br />
              <span className="bg-gradient-to-r from-[#ff3d4f] to-[#ff7083] bg-clip-text text-transparent">
                {tx("không build SaaS ngay?", "didn't build SaaS immediately?")}
              </span>
            </h2>

            <p className="mt-5 text-[1.08rem] leading-8 text-[#0b1020]/78 sm:text-xl sm:leading-9 lg:text-2xl lg:leading-10">
              {tx(
                "Phần lớn startup chết vì build product quá sớm.",
                "Most startups fail because they build product too early."
              )}
            </p>

            <div className="mt-5 space-y-4">
              {antiPatternItems.map((item) => (
                <p
                  key={item}
                  className="flex items-start gap-3 font-semibold tracking-[-0.02em] text-[#0b1020]"
                >
                  <XCircle className="mt-1 h-6 w-6 shrink-0 text-[#ff4d4d] sm:h-7 sm:w-7" />
                  <span className="text-[1.04rem] leading-[1.3] sm:text-[1.32rem] lg:text-[2.05rem]">{item}</span>
                </p>
              ))}
            </div>
          </motion.div>

          <motion.article
            {...fadeUp(0.1)}
            className="relative h-full px-0 py-2 sm:px-4 sm:py-4"
          >
            <div className="pointer-events-none absolute bottom-8 left-[2.8rem] top-7 w-px bg-gradient-to-b from-[#ff667f] via-[#8b69ff] to-[#2ac0df]" />
            <div className="relative space-y-5">
              {pipelineItems.map((step, idx) => (
                <div key={step.label} className="pl-[3.45rem] sm:pl-[4.1rem]">
                  <div className="relative">
                    <span
                      className={`absolute -left-[3.45rem] top-0 inline-flex h-9 w-9 items-center justify-center rounded-full border bg-white sm:-left-[4.1rem] sm:h-11 sm:w-11 ${step.borderColor}`}
                    >
                      <span className={`h-3 w-3 rounded-full ${step.dotColor}`} />
                    </span>
                    <p className={`text-[1.62rem] leading-none font-extrabold tracking-[-0.02em] sm:text-[2.2rem] lg:text-[3.1rem] ${step.textColor}`}>
                      {step.label}
                    </p>
                    <p className="mt-1.5 text-[0.98rem] leading-7 text-[#0b1020]/84 sm:text-lg sm:leading-8">{step.desc}</p>
                  </div>
                  {idx !== pipelineItems.length - 1 ? (
                    <ArrowDown className="ml-1 mt-2 h-5 w-5 text-[#0b1020]/38" />
                  ) : null}
                </div>
              ))}
            </div>
          </motion.article>
        </div>

        <motion.article
          {...fadeUp(0.18)}
          className="mt-10 overflow-hidden rounded-[30px] border border-red-100 bg-white/95 shadow-[0_24px_56px_-42px_rgba(15,23,42,0.45)]"
        >
          <div className="grid items-stretch gap-0 lg:grid-cols-[1fr_0.62fr_1fr]">
            <div className="p-4 sm:p-7">
              <div className="relative mx-auto aspect-square w-full max-w-[190px] overflow-hidden rounded-2xl border border-red-100 bg-[#fff8fa] sm:max-w-[235px]">
                <Image src="/5.1.png" alt="Phase 1 restaurant" fill className="object-cover" quality={100} />
              </div>
              <p className="mt-4 inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-semibold tracking-[0.1em] text-red-500 uppercase">
                PHASE 1
              </p>
              <h3 className="mt-2 text-[1.72rem] font-extrabold tracking-[-0.02em] text-[#ff3d4f] sm:text-[2.2rem]">
                {tx("NHÀ HÀNG", "RESTAURANT")}
              </h3>
              <p className="mt-1 text-lg text-[#0b1020]/75">
                {tx("“Team Markee nấu cho khách.”", "“Team Markee cooks for clients.”")}
              </p>
              <ul className="mt-4 space-y-2 text-[1rem] text-[#0b1020]/82 sm:text-lg">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-red-400" />
                  {tx("dịch vụ là trọng tâm", "service-heavy")}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-red-400" />
                  {tx("bàn giao thủ công", "manual delivery")}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-red-400" />
                  {tx("chăm sóc sát sao", "high-touch")}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-red-400" />
                  {tx("vòng phản hồi nhanh", "fast feedback loop")}
                </li>
              </ul>
            </div>

            <div className="flex flex-col items-center justify-center gap-2.5 border-y border-red-100/70 bg-gradient-to-b from-[#fff7fb] to-[#f8f9ff] p-5 sm:p-7 lg:border-x lg:border-y-0">
              <p className="text-[1.7rem] font-extrabold tracking-[-0.03em] text-[#0b1020] sm:text-[2.25rem] lg:text-[3rem]">{tx("Học", "Learn")}</p>
              <ArrowDown className="h-5 w-5 text-red-400" />
              <p className="text-[1.7rem] font-extrabold tracking-[-0.03em] text-[#0b1020] sm:text-[2.25rem] lg:text-[3rem]">{tx("Chuẩn hóa", "Systemize")}</p>
              <ArrowDown className="h-5 w-5 text-[#6b6dff]" />
              <p className="text-[1.7rem] font-extrabold tracking-[-0.03em] text-[#0b1020] sm:text-[2.25rem] lg:text-[3rem]">{tx("Tự động hóa", "Automate")}</p>
            </div>

            <div className="p-4 sm:p-7">
              <div className="relative mx-auto aspect-square w-full max-w-[190px] overflow-hidden rounded-2xl border border-blue-100 bg-[#f7f9ff] sm:max-w-[235px]">
                <Image src="/5.2.png" alt="Phase 2 operating system" fill className="object-cover" quality={100} />
              </div>
              <p className="mt-4 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold tracking-[0.1em] text-blue-600 uppercase">
                PHASE 2+
              </p>
              <h3 className="mt-2 text-[1.72rem] font-extrabold tracking-[-0.02em] text-[#3266e5] sm:text-[2.2rem]">
                {tx("HỆ ĐIỀU HÀNH", "OPERATING SYSTEM")}
              </h3>
              <p className="mt-1 text-lg text-[#0b1020]/75">
                {tx("“Workflow trở thành infrastructure.”", "“Workflow becomes infrastructure.”")}
              </p>
              <ul className="mt-4 space-y-2 text-[1rem] text-[#0b1020]/82 sm:text-lg">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-500" />
                  {tx("hệ thống tái sử dụng", "reusable systems")}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-500" />
                  {tx("tự động hóa", "automation")}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-500" />
                  {tx("bàn giao có thể scale", "scalable delivery")}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-500" />
                  {tx("các lớp SaaS", "SaaS layers")}
                </li>
              </ul>
            </div>
          </div>
        </motion.article>

       

        <div className="mt-8 grid gap-4 md:grid-cols-2 sm:gap-5">
          {miniCards.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.title}
                {...fadeUp(0.28 + idx * 0.03)}
                whileHover={{ y: -4 }}
                className={`rounded-[24px] border p-4 shadow-[0_16px_42px_-34px_rgba(15,23,42,0.5)] sm:p-6 ${item.border} ${item.bg}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-full border bg-white ${item.border} ${item.tone}`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className={`text-[1.32rem] font-extrabold tracking-[-0.02em] sm:text-[1.65rem] ${item.tone}`}>{item.title}</p>
                </div>
                <p className="mt-3 text-[1rem] leading-7 text-[#0b1020]/82 sm:mt-4 sm:text-xl sm:leading-8">{item.text}</p>
              </motion.article>
            );
          })}
        </div>

        <motion.article
          {...fadeUp(0.4)}
          className="mt-7 rounded-[26px] border border-amber-200 bg-gradient-to-r from-[#fff8ee] via-[#fffdf8] to-[#fff8ee] p-6 sm:p-8"
        >
          <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-semibold tracking-[0.13em] text-amber-600 uppercase">
                <CircleAlert className="h-4 w-4" />
                {tx("LƯU Ý QUAN TRỌNG", "IMPORTANT NOTE")}
              </p>
              <p className="mt-3 text-[1.5rem] leading-[1.2] font-bold tracking-[-0.02em] text-[#0b1020] sm:text-[2.1rem] sm:leading-[1.15]">
                {tx("Bọn mình không chống lại SaaS.", "We are not anti-SaaS.")}
              </p>
              <p className="mt-3 text-[1rem] leading-7 text-[#0b1020]/78 sm:text-lg sm:leading-8">
                {tx(
                  "Tầm nhìn dài hạn vẫn là: hệ thống · tự động hóa · hạ tầng có thể scale · nền tảng.",
                  "Long-term vision is still: systems · automation · scalable infrastructure · platforms."
                )}
              </p>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-white px-4 py-3 text-[1rem] leading-7 font-semibold text-[#c56b00] sm:px-5 sm:py-4 sm:text-xl sm:leading-8">
              {tx(
                "Nhưng hiện tại là phase xây hiểu biết vận hành.",
                "But now this is the build-understanding phase."
              )}
            </div>
          </div>
        </motion.article>

      </div>
    </section>
  );
}
