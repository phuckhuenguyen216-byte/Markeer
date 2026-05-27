"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CircleDollarSign, Globe2, Hotel, ShieldCheck } from "lucide-react";
import type { ComponentType } from "react";
import { useInsideMarkeeLocale } from "./useInsideMarkeeLocale";

type HouseCard = {
  title: string;
  domain: string;
  roleVi: string;
  roleEn: string;
  detailVi: string;
  detailEn: string;
  Icon: ComponentType<{ className?: string }>;
  toneClass: string;
  borderClass: string;
  titleClass: string;
  domainClass: string;
  textClass: string;
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] as const },
  viewport: { once: true, amount: 0.2 },
});

export default function InsideMarkeeEcosystemSection() {
  const { tx } = useInsideMarkeeLocale();

  const houses: HouseCard[] = [
    {
      title: "Markee",
      domain: "markee.vn · markeeai.com",
      roleVi: "Máy tạo doanh thu",
      roleEn: "Revenue engine",
      detailVi: "Agency + AI automation cho SME, tạo dòng tiền hiện tại để nuôi toàn hệ sinh thái.",
      detailEn: "Agency + AI automation for SMEs, generating current cashflow for the ecosystem.",
      Icon: CircleDollarSign,
      toneClass: "from-[#fff1f5] to-[#ffe6ee]",
      borderClass: "border-[#ffc2d0]",
      titleClass: "text-[#9f1239]",
      domainClass: "text-[#be123c]/85",
      textClass: "text-[#4c1d2f]",
    },
    {
      title: "GoDanang",
      domain: "godanang.net",
      roleVi: "Case study sống",
      roleEn: "Live showcase",
      detailVi: "Showroom thật trong ngành du lịch để chứng minh hệ thống marketing + automation chạy ngoài thị trường.",
      detailEn: "Live hospitality showroom proving marketing + automation in real markets.",
      Icon: Hotel,
      toneClass: "from-[#fff6ec] to-[#ffedd8]",
      borderClass: "border-[#ffd8a8]",
      titleClass: "text-[#b45309]",
      domainClass: "text-[#c26610]/85",
      textClass: "text-[#5f3a0b]",
    },
    {
      title: "Cloudgate",
      domain: "cloudgate.vn",
      roleVi: "Máy tạo deal lớn",
      roleEn: "Enterprise engine",
      detailVi: "Nhắm enterprise IT/security, deal lớn chu kỳ dài, bổ sung tầng tăng trưởng dài hạn.",
      detailEn: "Targets enterprise IT/security with large, long-cycle deals for long-term growth.",
      Icon: Globe2,
      toneClass: "from-[#eef5ff] to-[#e3efff]",
      borderClass: "border-[#bfd7ff]",
      titleClass: "text-[#1d4ed8]",
      domainClass: "text-[#2563eb]/85",
      textClass: "text-[#1e3a8a]",
    },
    {
      title: "SecurityZone",
      domain: "securityzone.vn",
      roleVi: "Máy tạo uy tín",
      roleEn: "Trust engine",
      detailVi: "Xây cộng đồng công nghệ để tích lũy trust, authority và network effect cho toàn hệ.",
      detailEn: "Builds tech community to compound trust, authority, and network effects.",
      Icon: ShieldCheck,
      toneClass: "from-[#f5efff] to-[#ece2ff]",
      borderClass: "border-[#d7c2ff]",
      titleClass: "text-[#6d28d9]",
      domainClass: "text-[#7c3aed]/85",
      textClass: "text-[#4c1d95]",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-white py-24 text-[#0f172a] sm:py-28 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(255,77,95,0.08)_0%,rgba(255,255,255,0)_34%),radial-gradient(circle_at_84%_78%,rgba(255,120,150,0.07)_0%,rgba(255,255,255,0)_36%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.05)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative mx-auto max-w-[1420px] px-4 sm:px-6 lg:px-8">
        <motion.p {...fadeUp(0)} className="mk-eyebrow text-center text-[#7f1d35] uppercase">
          {tx("03 · Cấu trúc", "03 · Structure")}
        </motion.p>

        <motion.div {...fadeUp(0.05)} className="mx-auto mt-7 max-w-[920px] text-center">
          <h2 className="mk-section-title uppercase">
            <span className="block text-[#3f1020]">{tx("4 NHÀ", "4 HOUSES")}</span>
            <span className="mk-section-title-accent block bg-gradient-to-r from-[#ff4d5f] via-[#ff6c88] to-[#ff8cab] bg-clip-text text-transparent">
              {tx("MỖI NHÀ MỘT VAI TRÒ", "ONE ROLE EACH")}
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-[780px] text-[1.03rem] leading-8 text-[#3f1020]/76 sm:text-[1.12rem]">
            {tx(
              "Team không phải một công ty đơn lẻ. Đây là hệ gồm Markee, GoDanang, Cloudgate, SecurityZone cùng đi về một mục tiêu: tăng trưởng thực cho doanh nghiệp Việt Nam.",
              "The team is not a single-company structure. It is an ecosystem of Markee, GoDanang, Cloudgate, and SecurityZone moving toward one goal: practical growth for Vietnamese businesses."
            )}
          </p>
        </motion.div>

        <motion.div {...fadeUp(0.1)} className="mt-12 grid items-stretch gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="flex h-full flex-col gap-4">
            <div className="rounded-[26px] border border-[#ffd1db] bg-white p-5 shadow-[0_22px_58px_-40px_rgba(255,77,95,0.32)] sm:p-6">
              <p className="text-xs font-semibold tracking-[0.12em] text-[#9f1239] uppercase">{tx("Cách các nhà phối hợp", "How the houses connect")}</p>
              <p className="mt-3 text-sm leading-7 text-[#4c1d2f] sm:text-base">
                {tx(
                  "GoDanang tạo showcase sống trong hospitality. Markee dùng showcase này để phục vụ SME và tăng doanh thu. SecurityZone tạo trust và network cộng đồng. Cloudgate mở rộng vào enterprise IT/security.",
                  "GoDanang provides a live hospitality showcase. Markee uses it to serve SMEs and drive revenue. SecurityZone builds trust and community network effects. Cloudgate expands into enterprise IT/security."
                )}
              </p>
            </div>

            <div className="rounded-[26px] border border-[#ffd1db] bg-[#fff8fa] p-5 shadow-[0_20px_48px_-36px_rgba(255,77,95,0.34)] sm:p-6">
              <p className="text-xs font-semibold tracking-[0.12em] text-[#9f1239] uppercase">{tx("Nguyên tắc", "Rule")}</p>
              <p className="mt-2 text-sm leading-7 font-semibold text-[#4c1d2f] sm:text-base">
                {tx(
                  "Không nhà nào compete trực tiếp. Mỗi nhà tự nuôi sống mình và bổ trợ lẫn nhau.",
                  "No house competes directly. Each house is financially independent and mutually reinforcing."
                )}
              </p>
            </div>

            <div className="rounded-[26px] border border-[#ffd1db] bg-white p-5 shadow-[0_20px_44px_-34px_rgba(255,77,95,0.3)] sm:p-6">
              <p className="text-xs font-semibold tracking-[0.12em] text-[#9f1239] uppercase">{tx("Mục tiêu chung", "Shared target")}</p>
              <p className="mt-2 text-sm leading-7 text-[#4c1d2f] sm:text-base">
                {tx(
                  "Bốn nhà cùng đẩy về một hướng: tăng trưởng doanh thu thật, vận hành nhẹ hơn và tạo vòng lặp học hỏi liên tục từ thị trường.",
                  "All four houses push toward one direction: real revenue growth, lighter operations, and a continuous market-learning loop."
                )}
              </p>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[720px]">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative h-full overflow-hidden rounded-[28px] border border-[#ffd6df] bg-white p-3 shadow-[0_34px_80px_-48px_rgba(255,77,95,0.34)] sm:p-4"
            >
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0)_20%,rgba(255,255,255,0.45)_50%,rgba(255,255,255,0)_78%)]" />
              <Image
                src="/banner4.png"
                alt={tx("Sơ đồ 4 nhà trong hệ sinh thái Markee", "4-house ecosystem map")}
                width={1300}
                height={900}
                className="h-auto w-full rounded-[20px] object-contain"
              />
            </motion.div>
          </div>
        </motion.div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {houses.map((house, index) => {
            const Icon = house.Icon;
            return (
              <motion.article
                key={house.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08 + index * 0.08 }}
                viewport={{ once: true, amount: 0.3 }}
                animate={{ y: [0, -3, 0] }}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`group relative overflow-hidden rounded-2xl border ${house.borderClass} bg-gradient-to-br ${house.toneClass} p-4 shadow-[0_20px_45px_-34px_rgba(255,77,95,0.38)] transition-shadow duration-300 hover:shadow-[0_30px_55px_-30px_rgba(255,77,95,0.48)]`}
              >
                <div className="pointer-events-none absolute -left-24 top-0 h-full w-20 -skew-x-12 bg-white/50 opacity-0 blur-md transition-all duration-500 group-hover:left-[120%] group-hover:opacity-100" />
                <p className={`inline-flex items-center gap-2 text-sm font-semibold ${house.titleClass}`}>
                  <Icon className="h-4 w-4" />
                  {house.title}
                </p>
                <p className={`mt-1 text-xs font-semibold tracking-[0.1em] uppercase ${house.domainClass}`}>{house.domain}</p>
                <p className={`mt-2 text-sm font-semibold ${house.textClass}`}>{tx(house.roleVi, house.roleEn)}</p>
                <p className={`mt-2 text-sm leading-6 ${house.textClass}`}>{tx(house.detailVi, house.detailEn)}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

