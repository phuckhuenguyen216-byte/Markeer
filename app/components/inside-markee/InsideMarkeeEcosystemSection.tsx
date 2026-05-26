"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import {
  ArrowDown,
  CircleDollarSign,
  Globe2,
  Hotel,
  ShieldCheck,
} from "lucide-react";
import { useInsideMarkeeLocale } from "./useInsideMarkeeLocale";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
  viewport: { once: true, amount: 0.2 },
});

type ToneName = "markee" | "godanang" | "cloudgate" | "securityzone";

const toneMap: Record<
  ToneName,
  {
    shell: string;
    iconWrap: string;
    subtitle: string;
    mini: string;
    miniTitle: string;
    miniText: string;
  }
> = {
  markee: {
    shell: "border-[#ffd0d7] bg-gradient-to-b from-[#fff8f9] to-white",
    iconWrap: "border-[#ffd7df] bg-[#fff3f6]",
    subtitle: "text-[#ff3d4f]",
    mini: "border-[#ffd8df] bg-[#fff7f9]",
    miniTitle: "text-[#d93648]",
    miniText: "text-[#5f1e27]",
  },
  godanang: {
    shell: "border-[#ffe2bd] bg-gradient-to-b from-[#fffaf3] to-white",
    iconWrap: "border-[#ffe8cc] bg-[#fff6ea]",
    subtitle: "text-[#ff8a00]",
    mini: "border-[#ffe4bf] bg-[#fff9ef]",
    miniTitle: "text-[#d97706]",
    miniText: "text-[#6b3b05]",
  },
  cloudgate: {
    shell: "border-[#cfe1ff] bg-gradient-to-b from-[#f4f8ff] to-white",
    iconWrap: "border-[#dbe8ff] bg-[#f1f6ff]",
    subtitle: "text-[#2563eb]",
    mini: "border-[#d3e3ff] bg-[#f5f9ff]",
    miniTitle: "text-[#1d4ed8]",
    miniText: "text-[#1e3a8a]",
  },
  securityzone: {
    shell: "border-[#e5d4ff] bg-gradient-to-b from-[#faf6ff] to-white",
    iconWrap: "border-[#ebddff] bg-[#f8f2ff]",
    subtitle: "text-[#9333ea]",
    mini: "border-[#eadcff] bg-[#fbf7ff]",
    miniTitle: "text-[#7e22ce]",
    miniText: "text-[#4c1d95]",
  },
};

export default function InsideMarkeeEcosystemSection() {
  const { tx } = useInsideMarkeeLocale();

  const loopNodes = [
    { key: "markee", label: "Markee", tone: "markee" as const, x: "50%", y: "8%" },
    {
      key: "real-sme",
      label: tx("Dữ liệu SME thật", "Real SME data"),
      tone: "cloudgate" as const,
      x: "78%",
      y: "20%",
    },
    {
      key: "godanang-validation",
      label: tx("GoDanang validation", "GoDanang validation"),
      tone: "godanang" as const,
      x: "90%",
      y: "48%",
    },
    {
      key: "security-trust",
      label: tx("SecurityZone trust", "SecurityZone trust"),
      tone: "securityzone" as const,
      x: "78%",
      y: "76%",
    },
    {
      key: "cloudgate-leverage",
      label: tx("Cloudgate leverage", "Cloudgate leverage"),
      tone: "cloudgate" as const,
      x: "50%",
      y: "90%",
    },
    {
      key: "better-systems",
      label: tx("Better systems", "Better systems"),
      tone: "markee" as const,
      x: "22%",
      y: "76%",
    },
    {
      key: "better-outcomes",
      label: tx("Better outcomes", "Better outcomes"),
      tone: "godanang" as const,
      x: "10%",
      y: "48%",
    },
    {
      key: "stronger-ecosystem",
      label: tx("Stronger ecosystem", "Stronger ecosystem"),
      tone: "securityzone" as const,
      x: "22%",
      y: "20%",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-white py-24 sm:py-28 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(11,16,32,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(11,16,32,0.035)_1px,transparent_1px)] bg-[size:58px_58px]" />
      <div className="pointer-events-none absolute left-[-10rem] top-[8%] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(255,77,77,0.14)_0%,rgba(255,255,255,0)_72%)] blur-3xl" />
      <div className="pointer-events-none absolute right-[-13rem] bottom-[6%] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(147,51,234,0.11)_0%,rgba(255,255,255,0)_76%)] blur-3xl" />

      <div className="relative mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <motion.p
          {...fadeUp(0)}
          className="text-sm font-semibold tracking-[0.16em] text-[#0b1020]/80 uppercase"
        >
          {tx("HỆ SINH THÁI", "THE ECOSYSTEM")}
        </motion.p>

        <div className="mt-8 grid items-center gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <motion.div {...fadeUp(0.04)}>
            <h2 className="text-[3.2rem] leading-[1.03] font-extrabold tracking-[-0.03em] text-[#0b1020] sm:text-[4.3rem] lg:text-[5.45rem]">
              {tx("Chúng ta có", "We have")}{" "}
              <span className="bg-gradient-to-r from-[#ff3d4f] to-[#ff6b7a] bg-clip-text text-transparent">
                {tx('4 "nhà".', '4 "houses".')}
              </span>
              <br />
              {tx("Mỗi nhà", "Each house")}{" "}
              <span className="bg-gradient-to-r from-[#ff3d4f] to-[#ff6b7a] bg-clip-text text-transparent">
                {tx("một vai trò.", "has one role.")}
              </span>
            </h2>

            <div className="mt-6 h-1 w-12 rounded-full bg-gradient-to-r from-[#FF3B3B] to-[#FF7A93]" />
            <p className="mt-6 max-w-[620px] text-xl leading-9 text-[#0b1020]/76">
              {tx(
                "Team mình không phải 1 công ty duy nhất. Mà là nhiều thực thể khác nhau cùng di chuyển về một mục tiêu chung.",
                "We are not a single company structure. We are multiple entities moving toward one shared objective."
              )}
            </p>
          </motion.div>

          <motion.div
            {...fadeUp(0.1)}
            className="mx-auto w-full max-w-[760px] overflow-hidden rounded-[30px] border border-red-100 bg-white/95 p-3 shadow-[0_24px_70px_-34px_rgba(255,77,77,0.45)]"
          >
            <div className="relative h-[300px] w-full bg-white sm:h-[420px] lg:h-[500px]">
              <Image
                src="/banner4.png"
                alt={tx("Markee ecosystem visual", "Markee ecosystem visual")}
                fill
                quality={100}
                className="object-contain"
                sizes="(min-width: 1024px) 56vw, 100vw"
              />
            </div>
          </motion.div>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2 lg:items-start">
          <ExpandCard
            delay={0.18}
            toneName="markee"
            icon={<CircleDollarSign className="h-5 w-5 text-[#ff3d4f]" />}
            title="MARKEE"
            subtitle={tx("Máy tạo doanh thu", "Revenue engine")}
          >
            <div className="grid gap-3 md:grid-cols-3">
              <MiniBlock
                toneName="markee"
                title={tx("KHÁCH HÀNG", "MARKET")}
                items={[
                  tx("SME Việt Nam", "Vietnam SMEs"),
                  tx("Lưu trú", "Hospitality"),
                  tx("Phòng khám", "Clinic"),
                  tx("Spa", "Spa"),
                  tx("Thương mại điện tử", "Ecommerce"),
                ]}
              />
              <MiniBlock
                toneName="markee"
                title={tx("MÔ HÌNH HIỆN TẠI", "CURRENT MODEL")}
                items={[
                  tx("Agency + tự động hóa AI", "Agency + AI Automation"),
                  tx("50–70% con người · 30–50% AI", "50–70% human · 30–50% AI"),
                  "↓",
                  tx("<10% con người · 90% tự động hóa", "<10% human · 90% automation"),
                ]}
              />
              <MiniBlock
                toneName="markee"
                title={tx("VAI TRÒ CHIẾN LƯỢC", "STRATEGIC ROLE")}
                items={[
                  tx("tạo dòng tiền", "generate cashflow"),
                  tx("xây phân phối", "build distribution"),
                  tx("nuôi hệ sinh thái", "fund ecosystem"),
                  tx("kiểm thử workflow AI", "test AI workflows"),
                ]}
              />
            </div>
          </ExpandCard>

          <ExpandCard
            delay={0.22}
            toneName="godanang"
            icon={<Hotel className="h-5 w-5 text-[#ff8a00]" />}
            title="GODANANG"
            subtitle={tx("Showcase sống", "Live showcase")}
          >
            <div className="grid gap-3 md:grid-cols-2">
              <MiniBlock
                toneName="godanang"
                title={tx("VÌ SAO NÓ TỒN TẠI", "WHY IT EXISTS")}
                items={[
                  tx("Không phải side project.", "Not a side project."),
                  tx("Mà là real hospitality environment để test workflow thật.", "A real hospitality environment to test real workflows."),
                ]}
              />
              <MiniBlock
                toneName="godanang"
                title={tx("GIÁ TRỊ", "VALUE")}
                items={[
                  tx("đặt phòng thực", "real bookings"),
                  tx("vận hành thực", "real operations"),
                  tx("hành vi khách hàng thực", "real customer behavior"),
                  tx("dữ liệu du lịch thực", "real tourism data"),
                ]}
              />
            </div>
            <div className="mt-4 rounded-2xl border border-[#ffe2bd] bg-[#fff8f1] p-4">
              <p className="text-sm font-semibold tracking-[0.08em] text-[#ff8a00] uppercase">
                {tx("VÒNG LẶP", "LOOP")}
              </p>
              <p className="mt-2 text-sm leading-7 text-[#7c4906]">
                {tx(
                  "Khách lưu trú → insight tốt hơn → tối ưu GoDanang → tình huống thực tế mạnh hơn → thu hút thêm khách lưu trú",
                  "Hospitality clients → better insight → optimize GoDanang → stronger case study → attract more hospitality clients"
                )}
              </p>
            </div>
          </ExpandCard>

          <ExpandCard
            delay={0.26}
            toneName="cloudgate"
            icon={<Globe2 className="h-5 w-5 text-[#2563eb]" />}
            title="CLOUDGATE"
            subtitle={tx("Máy tạo deal lớn", "Enterprise engine")}
          >
            <div className="grid gap-3 md:grid-cols-3">
              <MiniBlock toneName="cloudgate" title={tx("ĐỊNH VỊ", "POSITIONING")} items={["Enterprise IT", "Security", "Infrastructure"]} />
              <MiniBlock toneName="cloudgate" title={tx("KHÁCH HÀNG", "CLIENTS")} items={["CTO", "CISO", "IT Director"]} />
              <MiniBlock
                toneName="cloudgate"
                title={tx("THỰC TẾ", "REALITY")}
                items={[
                  tx("Deal lớn, nhưng cycle dài.", "Large deals, long cycle."),
                  tx("Chưa phải growth engine chính.", "Not the primary growth engine yet."),
                  tx("Cần Markee tạo cashflow trước.", "Needs Markee cashflow first."),
                ]}
              />
            </div>
          </ExpandCard>

          <ExpandCard
            delay={0.3}
            toneName="securityzone"
            icon={<ShieldCheck className="h-5 w-5 text-[#9333ea]" />}
            title="SECURITYZONE"
            subtitle={tx("Máy tạo uy tín", "Trust engine")}
          >
            <div className="grid gap-3 md:grid-cols-2">
              <MiniBlock
                toneName="securityzone"
                title={tx("MỤC ĐÍCH", "PURPOSE")}
                items={[
                  tx("Không phải để bán hàng trực tiếp.", "Not for direct selling."),
                  tx("Build trust · authority · network effect", "Build trust · authority · network effect"),
                ]}
              />
              <MiniBlock
                toneName="securityzone"
                title={tx("HIỆU ỨNG", "EFFECT")}
                items={["Community", "↓ Workshops", "↓ Relationships", "↓ Enterprise trust", "↓ Deals"]}
              />
            </div>
          </ExpandCard>
        </div>

        <motion.div
          {...fadeUp(0.35)}
          className="mt-9 rounded-[26px] border border-red-100 bg-gradient-to-r from-white to-[#fff8fa] p-7"
        >
          <p className="text-center text-[2rem] leading-[1.26] font-bold tracking-[-0.02em] text-[#0b1020] sm:text-[2.35rem]">
            {tx("Không “nhà” nào compete với nhau.", "No “house” is competing with another.")}
            <br />
            {tx("Chúng hỗ trợ nhau, học từ nhau, và compound theo thời gian.", "They support each other, learn from each other, and compound over time.")}
          </p>
        </motion.div>

        <motion.div
          {...fadeUp(0.4)}
          className="mt-7 rounded-[28px] border border-red-100/80 bg-white p-6 shadow-[0_22px_60px_-38px_rgba(15,23,42,0.45)] sm:p-8"
        >
          <p className="text-sm font-semibold tracking-[0.13em] text-red-500 uppercase">
            {tx("HỆ SINH THÁI HOẠT ĐỘNG NHƯ 1 VÒNG LẶP TĂNG TRƯỞNG", "ECOSYSTEM COMPOUND LOOP")}
          </p>

          <div className="mt-6 hidden lg:block">
            <div className="relative mx-auto h-[450px] max-w-[980px]">
              <motion.div
                className="absolute inset-[18%] rounded-full border border-dashed border-red-200/70"
                animate={{ rotate: 360 }}
                transition={{ duration: 44, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
              <div className="absolute inset-[27%] rounded-full border border-red-100" />

              {loopNodes.map((node) => (
                <div
                  key={node.key}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: node.x, top: node.y }}
                >
                  <LoopBadge label={node.label} toneName={node.tone} />
                </div>
              ))}

              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-200 bg-white px-6 py-3 text-sm font-bold tracking-[0.08em] text-red-500 uppercase shadow-[0_12px_28px_-18px_rgba(255,77,77,0.6)]">
                {tx("Vòng lặp tích lũy", "Compound Loop")}
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 lg:hidden">
            {[
              "Markee",
              tx("Dữ liệu SME thật", "Real SME data"),
              tx("GoDanang validation", "GoDanang validation"),
              tx("SecurityZone trust", "SecurityZone trust"),
              tx("Cloudgate leverage", "Cloudgate leverage"),
              tx("Better systems", "Better systems"),
              tx("Better outcomes", "Better outcomes"),
              tx("Stronger ecosystem", "Stronger ecosystem"),
            ].map((item, idx, arr) => (
              <div key={item} className="flex flex-col items-center gap-2">
                <LoopBadge label={item} toneName={loopNodes[idx].tone} />
                {idx !== arr.length - 1 ? <ArrowDown className="h-4 w-4 text-red-300" /> : null}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          {...fadeUp(0.46)}
          className="mt-7 rounded-[30px] border border-amber-200 bg-gradient-to-r from-[#fff9ee] to-[#fff6e8] p-7 sm:p-9"
        >
            <p className="text-[1.65rem] leading-[1.16] font-bold tracking-[-0.02em] text-[#0b1020] sm:text-[2.3rem] lg:text-[2.8rem]">
              {tx("Chúng ta không build nhiều business riêng lẻ.", "We are not building isolated businesses.")}
              <br />
              <span className="bg-gradient-to-r from-[#ff3d4f] to-[#ff6b7a] bg-clip-text text-transparent">
              {tx("Chúng ta đang build:", "We are building:")}
            </span>
            <br />
            {tx("một operating system cho tăng trưởng doanh nghiệp Việt Nam.", "an operating system for Vietnamese business growth.")}
          </p>
          <p className="mt-5 text-lg text-[#0b1020]/76">
            {tx("Và mỗi ecosystem chỉ là một layer trong hệ thống đó.", "And each ecosystem is only one layer of that system.")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

type ExpandCardProps = {
  delay: number;
  toneName: ToneName;
  icon: ReactNode;
  title: string;
  subtitle: string;
  children: ReactNode;
};

function ExpandCard({ delay, toneName, icon, title, subtitle, children }: ExpandCardProps) {
  const tone = toneMap[toneName];

  return (
    <motion.article
      {...fadeUp(delay)}
      className={`group rounded-[26px] border p-5 shadow-[0_20px_50px_-36px_rgba(15,23,42,0.5)] ${tone.shell}`}
    >
      <div className="flex items-center gap-3">
        <span className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${tone.iconWrap}`}>
          {icon}
        </span>
        <div>
          <p className="text-[1.85rem] leading-none font-bold tracking-[-0.02em] text-[#0b1020]">{title}</p>
          <p className={`mt-1 text-sm font-semibold ${tone.subtitle}`}>{subtitle}</p>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </motion.article>
  );
}

type MiniBlockProps = {
  title: string;
  items: string[];
  toneName: ToneName;
};

function MiniBlock({ title, items, toneName }: MiniBlockProps) {
  const tone = toneMap[toneName];

  return (
    <div className={`rounded-2xl border p-4 ${tone.mini}`}>
      <p className={`text-xs font-bold tracking-[0.11em] uppercase ${tone.miniTitle}`}>{title}</p>
      <ul className={`mt-2 space-y-1.5 text-sm leading-6 ${tone.miniText}`}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

type LoopBadgeProps = {
  label: string;
  toneName: ToneName;
};

function LoopBadge({ label, toneName }: LoopBadgeProps) {
  const tone = toneMap[toneName];

  return (
    <div
      className={`rounded-full border px-4 py-2 text-sm font-semibold shadow-[0_8px_24px_-18px_rgba(15,23,42,0.4)] ${tone.mini}`}
    >
      <span className={tone.miniTitle}>{label}</span>
    </div>
  );
}
