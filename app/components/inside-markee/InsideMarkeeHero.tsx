"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Inter } from "next/font/google";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BookOpenText,
  Bot,
  CalendarClock,
  Globe2,
  Hotel,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { useInsideMarkeeLocale } from "./useInsideMarkeeLocale";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

type EcosystemCard = {
  key: "goDanang" | "cloudgate" | "securityZone";
  Icon: LucideIcon;
  titleVi: string;
  titleEn: string;
  subtitleVi: string;
  subtitleEn: string;
  descriptionVi: string;
  descriptionEn: string;
};

const ecosystemLinks: Record<
  EcosystemCard["key"],
  { href?: string; label: string; external?: boolean }
> = {
  goDanang: {
    href: "https://godanang.net/",
    label: "GoDanang",
    external: true,
  },
  cloudgate: {
    label: "Cloudgate (coming soon)",
  },
  securityZone: {
    href: "https://securityzone.vn/",
    label: "SecurityZone",
    external: true,
  },
};

const ecosystemCards: EcosystemCard[] = [
  {
    key: "goDanang",
    Icon: Hotel,
    titleVi: "GoDanang",
    titleEn: "GoDanang",
    subtitleVi: "Nền tảng trải nghiệm du lịch",
    subtitleEn: "Live hospitality showcase",
    descriptionVi: "Nền tảng giới thiệu khách sạn và trải nghiệm du lịch Đà Nẵng theo thời gian thực.",
    descriptionEn: "A live platform for hotels and real-time travel experiences in Danang.",
  },
  {
    key: "cloudgate",
    Icon: Globe2,
    titleVi: "Cloudgate",
    titleEn: "Cloudgate",
    subtitleVi: "Hạ tầng IT & bảo mật doanh nghiệp",
    subtitleEn: "Enterprise IT & security",
    descriptionVi: "Giải pháp hạ tầng cloud và bảo mật giúp doanh nghiệp mở rộng ổn định.",
    descriptionEn: "Cloud infrastructure and security solutions for stable business growth.",
  },
  {
    key: "securityZone",
    Icon: ShieldCheck,
    titleVi: "SecurityZone",
    titleEn: "SecurityZone",
    subtitleVi: "Tầng cộng đồng & niềm tin",
    subtitleEn: "Community & trust layer",
    descriptionVi: "Cộng đồng chia sẻ kiến thức, cảnh báo rủi ro và tăng nhận thức an toàn số.",
    descriptionEn: "A knowledge-sharing community for alerts, trust, and digital safety awareness.",
  },
];

type FloatingCard = {
  key: "goDanang" | "cloudgate" | "securityZone" | "aiAutomation";
  icon: LucideIcon;
  className: string;
  delay: number;
  labelVi: string;
  labelEn: string;
};

const floatingCards: FloatingCard[] = [
  {
    key: "goDanang",
    icon: Hotel,
    className: "-left-7 top-[60%] lg:-left-10",
    delay: 0,
    labelVi: "GoDanang",
    labelEn: "GoDanang",
  },
  {
    key: "cloudgate",
    icon: Globe2,
    className: "left-[54%] top-[2%] lg:left-[58%]",
    delay: 0.25,
    labelVi: "Cloudgate",
    labelEn: "Cloudgate",
  },
  {
    key: "securityZone",
    icon: ShieldCheck,
    className: "bottom-[2%] right-[4%] lg:right-0",
    delay: 0.45,
    labelVi: "SecurityZone",
    labelEn: "SecurityZone",
  },
  {
    key: "aiAutomation",
    icon: Bot,
    className: "right-[-1%] top-[34%] lg:-right-5",
    delay: 0.7,
    labelVi: "Tự động hóa AI",
    labelEn: "AI Automation",
  },
];

export default function InsideMarkeeHero() {
  const { isEn, tx } = useInsideMarkeeLocale();
  const headingLine2 = tx("CÁI GÌ VÀ TẠI SAO?", "WHAT AND WHY?");

  return (
    <section className={`${inter.className} relative overflow-hidden bg-white text-[#101426] sm:bg-[#F8F8FA]`}>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:52px_52px]" />
      <div className="pointer-events-none absolute inset-x-0 top-[-12rem] mx-auto h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(255,59,59,0.22)_0%,rgba(255,90,122,0.12)_35%,rgba(255,255,255,0)_72%)] blur-3xl" />
      <div className="pointer-events-none absolute right-[-14rem] top-[22%] h-[24rem] w-[24rem] rounded-full bg-red-200/40 blur-3xl" />
      <div className="pointer-events-none absolute left-[-16rem] bottom-[-8rem] h-[24rem] w-[24rem] rounded-full bg-rose-100/40 blur-3xl" />

      <div className="relative mx-auto max-w-[1320px] px-5 pb-12 pt-10 sm:px-6 sm:pb-14 sm:pt-11 lg:px-8 lg:pb-16 lg:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[640px]"
          >
            <span className="inline-flex items-center rounded-full border border-red-100 bg-white/80 px-4 py-2 text-[11px] font-semibold tracking-[0.22em] text-red-500 uppercase shadow-[0_10px_25px_rgba(248,113,113,0.09)] backdrop-blur">
              <BookOpenText className="mr-2 h-3.5 w-3.5" />
              {tx("BÊN TRONG MARKEE • SỔ TAY CÔNG TY • V1", "INSIDE MARKEE • COMPANY PLAYBOOK • V1")}
            </span>

            <h1 className="mt-6 text-[1.9rem] font-extrabold leading-[1.14] tracking-[-0.03em] text-[#111827] sm:text-[3rem] sm:leading-[1.12] lg:text-[4.2rem] lg:leading-[1.1]">
              <span className={`block ${isEn ? "" : "md:whitespace-nowrap"}`}>{tx("CHÚNG TA ĐANG XÂY", "WHAT EXACTLY ARE WE BUILDING")}</span>
              <span className={`inline-block leading-[1.2] pb-[0.12em] ${isEn ? "" : "md:whitespace-nowrap"} bg-gradient-to-r from-[#FF3B3B] via-[#FF4F59] to-[#FF5A7A] bg-clip-text text-transparent`}>{headingLine2}</span>
            </h1>

            <p className="mt-5 max-w-[580px] text-[0.98rem] leading-7 text-slate-600 sm:text-lg sm:leading-9">
              {tx(
                "Đây là tài liệu giúp bạn hiểu bức tranh lớn của hệ sinh thái Markee, từ Markee, GoDanang, Cloudgate đến SecurityZone.",
                "This page gives you the big picture of the Markee ecosystem, spanning Markee, GoDanang, Cloudgate, and SecurityZone."
              )}
            </p>
            <p className="mt-2 max-w-[560px] text-[0.98rem] leading-7 text-slate-600 sm:text-lg sm:leading-9">
              {tx(
                "Đọc xong, bạn sẽ hiểu team mình đang đi đâu, đang làm gì, và vì sao mọi thứ được vận hành theo cách hiện tại.",
                "After reading, you will understand where the team is heading, what we are building, and why we operate this way."
              )}
            </p>

            <p className="mt-5 flex items-center gap-2 text-[0.95rem] font-medium text-slate-500 sm:text-[1.04rem]">
              <Sparkles className="h-4 w-4 text-red-500" />
              {tx("Một hệ sinh thái, chung định hướng, thực thi dài hạn.", "One ecosystem, shared direction, long-term execution.")}
            </p>

            <div className="mt-7 flex flex-wrap gap-3.5">
              <Link
                href="/about"
                className="inline-flex items-center rounded-2xl bg-gradient-to-r from-[#FF3B3B] to-[#FF5A7A] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_35px_-16px_rgba(255,59,59,0.75)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_40px_-18px_rgba(255,59,59,0.78)] sm:px-7 sm:py-3.5 sm:text-base"
              >
                <Zap className="mr-2 h-4 w-4" />
                {tx("Tìm hiểu Markee", "Explore Markee")}
              </Link>

              <Link
                href="/docs/autopost/intro"
                className="inline-flex items-center rounded-2xl border border-white bg-white/70 px-5 py-3 text-sm font-semibold text-slate-800 shadow-[0_12px_24px_rgba(15,23,42,0.07)] transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-200 hover:bg-white sm:px-7 sm:py-3.5 sm:text-base"
              >
                {tx("Xem tài liệu", "Read docs")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 34 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-[720px] px-0 sm:px-1 lg:max-w-[920px] lg:px-2"
          >
            <div className="pointer-events-none absolute inset-0 m-auto hidden h-[88%] w-[88%] rounded-full border border-red-200/70 md:block" />
            <div className="pointer-events-none absolute inset-[7%] hidden rounded-full border border-dashed border-red-200/70 md:block" />

            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut" }} className="relative">
              <motion.div
                animate={{ rotate: [-3.4, -1.6, -3.4], y: [0, -8, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="origin-center will-change-transform lg:[transform:perspective(1900px)_rotateY(-6.8deg)_rotateX(2.5deg)_rotate(-0.8deg)_scale(1.08)] xl:[transform:perspective(1900px)_rotateY(-6.8deg)_rotateX(2.5deg)_rotate(-0.8deg)_scale(1.14)]"
              >
                <Image
                  src="/bannerinside1.png"
                  alt={tx("Sơ đồ hệ sinh thái Markee", "Markee ecosystem diagram")}
                  width={2400}
                  height={1697}
                  priority
                  className="h-auto w-full rounded-none border-0 bg-transparent drop-shadow-[0_18px_34px_rgba(15,23,42,0.2)] sm:rounded-none sm:border-0 sm:bg-transparent sm:drop-shadow-[0_56px_100px_rgba(15,23,42,0.32)]"
                />
              </motion.div>
            </motion.div>

            {floatingCards.map((card) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.key}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1, y: [0, -9, 0] }}
                  transition={{ duration: 4.4, delay: card.delay, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
                  className={`absolute hidden rounded-2xl border border-white/70 bg-white/84 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-[0_18px_45px_-28px_rgba(15,23,42,0.55)] backdrop-blur md:flex md:items-center md:gap-2 ${card.className}`}
                >
                  <Icon className="h-4 w-4 text-red-500" />
                  {tx(card.labelVi, card.labelEn)}
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        <div className="mt-7 grid gap-3 md:grid-cols-3">
          {ecosystemCards.map((card, index) => {
            const Icon = card.Icon;
            const linkItem = ecosystemLinks[card.key];
            const isLinked = Boolean(linkItem.href);
            return (
              <motion.article
                key={card.key}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16 + index * 0.08, duration: 0.5 }}
                whileHover={{ y: -6 }}
                className={`group rounded-[22px] border border-red-100/80 bg-white/90 p-4 shadow-[0_16px_35px_-28px_rgba(15,23,42,0.55)] backdrop-blur-sm sm:rounded-[24px] sm:p-6 ${isLinked ? "cursor-pointer" : ""}`}
              >
                <Link
                  href={linkItem.href ?? "#"}
                  target={linkItem.external ? "_blank" : undefined}
                  rel={linkItem.external ? "noopener noreferrer" : undefined}
                  className={`${isLinked ? "pointer-events-auto" : "pointer-events-none"}`}
                >
                  <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-red-100 bg-red-50/70 sm:mb-5 sm:h-16 sm:w-16">
                    <Icon className="h-5 w-5 text-red-500 sm:h-7 sm:w-7" />
                  </div>

                  <h3 className="text-[1.42rem] font-bold leading-none tracking-[-0.02em] text-slate-900 sm:text-[2rem]">{tx(card.titleVi, card.titleEn)}</h3>
                  <p className="mt-1.5 text-[0.96rem] font-semibold text-[#FF3B3B] sm:text-[1.15rem]">{tx(card.subtitleVi, card.subtitleEn)}</p>
                  <p className="mt-2.5 text-[0.92rem] leading-6 text-slate-600 sm:mt-4 sm:text-base sm:leading-8">{tx(card.descriptionVi, card.descriptionEn)}</p>

                  <div className="mt-4 flex justify-end sm:mt-5">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-red-200 text-red-500 transition-transform duration-300 group-hover:translate-x-1 sm:h-10 sm:w-10">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>

                {!isLinked && <p className="mt-1 text-xs font-semibold tracking-[0.08em] text-slate-400 uppercase">{tx("Cloudgate (sắp có link)", "Cloudgate (link coming soon)")}</p>}
              </motion.article>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-4 flex items-center justify-center gap-2.5 px-2 py-2 text-center text-base font-medium text-slate-700 sm:mt-5 sm:gap-3 sm:text-lg"
        >
          <CalendarClock className="h-5 w-5 text-red-500" />
          {tx("Đọc khoảng 10-15 phút nhưng sẽ giúp bạn hiểu cả năm làm việc.", "10-15 minutes to read, but it will save you months of alignment.")}
        </motion.div>
      </div>
    </section>
  );
}
