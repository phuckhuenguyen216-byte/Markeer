"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, BookOpenText, CalendarClock, Globe2, Hotel, ShieldCheck, Zap } from "lucide-react";
import { useInsideMarkeeLocale } from "./useInsideMarkeeLocale";

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

const ecosystemLinks: Record<EcosystemCard["key"], { href?: string; label: string; external?: boolean }> = {
  goDanang: {
    href: "https://godanang.net/",
    label: "GoDanang",
    external: true,
  },
  cloudgate: {
    href: "https://getcloudgate.com/",
    label: "Cloudgate",
    external: true,
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

export default function InsideMarkeeHero() {
  const { tx } = useInsideMarkeeLocale();
  const headingLine2 = tx("CÁI GÌ VÀ TẠI SAO?", "WHAT AND WHY?");

  return (
    <section className="relative overflow-hidden bg-white text-[#101426] sm:bg-[#F8F8FA]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:52px_52px]" />
      <div className="pointer-events-none absolute inset-x-0 top-[-12rem] mx-auto h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(255,59,59,0.22)_0%,rgba(255,90,122,0.12)_35%,rgba(255,255,255,0)_72%)] blur-3xl" />
      <div className="pointer-events-none absolute right-[-14rem] top-[22%] h-[24rem] w-[24rem] rounded-full bg-red-200/40 blur-3xl" />
      <div className="pointer-events-none absolute left-[-16rem] bottom-[-8rem] h-[24rem] w-[24rem] rounded-full bg-rose-100/40 blur-3xl" />

      <div className="relative mx-auto max-w-[1320px] px-5 pb-12 pt-10 text-center sm:px-6 sm:pb-14 sm:pt-11 lg:px-8 lg:pb-16 lg:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-[920px]"
        >
          <span className="mk-eyebrow inline-flex items-center rounded-full border border-red-100 bg-white/80 px-4 py-2 text-red-500 uppercase shadow-[0_10px_25px_rgba(248,113,113,0.09)] backdrop-blur">
            <BookOpenText className="mr-2 h-3.5 w-3.5" />
            {tx("BÊN TRONG MARKEE • SỔ TAY CÔNG TY • V1", "INSIDE MARKEE • COMPANY PLAYBOOK • V1")}
          </span>

          <h1 className="mk-title-hero inside-hero-title-up mt-6 text-[#111827]">
            <span className="block">{tx("CHÚNG TA ĐANG XÂY", "WHAT EXACTLY ARE WE BUILDING")}</span>
            <span className="mk-section-title-accent inline-block bg-gradient-to-r from-[#FF3B3B] via-[#FF4F59] to-[#FF5A7A] bg-clip-text pb-[0.08em] text-transparent">
              {headingLine2}
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-[760px] text-[0.98rem] leading-8 text-slate-600 sm:text-lg sm:leading-9">
            {tx(
              "Đây là tài liệu giúp bạn hiểu bức tranh lớn của hệ sinh thái Markee, từ Markee, GoDanang, Cloudgate đến SecurityZone. Đọc xong, bạn sẽ hiểu team mình đang đi đâu, đang làm gì, và vì sao mọi thứ được vận hành theo cách hiện tại.",
              "This page gives you the big picture of the Markee ecosystem, spanning Markee, GoDanang, Cloudgate, and SecurityZone. After reading, you will understand where the team is heading, what we are building, and why we operate this way."
            )}
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3.5">
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

        <div className="mt-9 grid gap-3 md:grid-cols-3">
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
                className={`group rounded-[20px] border border-red-100/80 bg-white/90 p-4 text-left shadow-[0_16px_35px_-28px_rgba(15,23,42,0.55)] backdrop-blur-sm sm:rounded-[22px] sm:p-5 ${isLinked ? "cursor-pointer" : ""}`}
              >
                <Link
                  href={linkItem.href ?? "#"}
                  target={linkItem.external ? "_blank" : undefined}
                  rel={linkItem.external ? "noopener noreferrer" : undefined}
                  className={`${isLinked ? "pointer-events-auto" : "pointer-events-none"}`}
                >
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-100 bg-red-50/70 sm:mb-4 sm:h-12 sm:w-12">
                    <Icon className="h-5 w-5 text-red-500 sm:h-6 sm:w-6" />
                  </div>

                  <h3 className="text-[1.2rem] font-bold leading-[1.16] tracking-[-0.015em] text-slate-900 sm:text-[1.4rem]">{tx(card.titleVi, card.titleEn)}</h3>
                  <p className="mt-1 text-[0.9rem] font-semibold text-[#FF3B3B] sm:text-[0.95rem]">{tx(card.subtitleVi, card.subtitleEn)}</p>
                  <p className="mt-2 text-[0.85rem] leading-6 text-slate-600 sm:mt-2.5 sm:text-[0.9rem] sm:leading-6">{tx(card.descriptionVi, card.descriptionEn)}</p>

                  <div className="mt-3 flex justify-end sm:mt-4">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-red-200 text-red-500 transition-transform duration-300 group-hover:translate-x-1 sm:h-9 sm:w-9">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
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
