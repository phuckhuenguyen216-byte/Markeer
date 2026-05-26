"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  HeartPulse,
  Home,
  Map,
  ShoppingBag,
  XCircle,
} from "lucide-react";
import { useInsideMarkeeLocale } from "./useInsideMarkeeLocale";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] as const },
  viewport: { once: true, amount: 0.2 },
});

type MarketCard = {
  title: string;
  subtitle: string;
  points: string[];
  footer: string;
  image: string;
  icon: React.ComponentType<{ className?: string }>;
  className: string;
};

export default function InsideMarkeePhaseOneDetailSection() {
  const { tx } = useInsideMarkeeLocale();

  const marketCards: MarketCard[] = [
    {
      title: "HOMESTAY",
      subtitle: tx("Nhóm mục tiêu chính", "Primary target"),
      points: [
        tx("nỗi đau đặt phòng", "booking pain"),
        tx("quá tải hộp thư", "inbox overload"),
        tx("chưa có website", "no website"),
        tx("chưa có tự động hóa", "no automation"),
      ],
      footer: tx("Nhóm ưu tiên xử lý trước", "Primary target"),
      image: "/8.1.png",
      icon: Home,
      className: "lg:col-span-5 lg:row-span-2 border-red-200 bg-gradient-to-b from-[#fff2f4] to-white",
    },
    {
      title: "TOUR",
      subtitle: tx("Nhóm vận hành tour", "Operator segment"),
      points: [
        tx("lịch vận hành thủ công", "manual schedule"),
        tx("rò rỉ khách tiềm năng", "lead leaks"),
        tx("chưa có CRM", "no CRM"),
      ],
      footer: tx("Phản hồi nhanh là lợi thế", "Fast response wins"),
      image: "/8.2.png",
      icon: Map,
      className: "lg:col-span-3 border-red-200 bg-gradient-to-b from-[#fff6f0] to-white",
    },
    {
      title: "SPA / CLINIC",
      subtitle: tx("Vận hành lặp lại cao", "High-repeat ops"),
      points: [
        tx("rối lịch đặt hẹn", "booking chaos"),
        tx("quá tải nhân sự", "staff overload"),
        tx("đứt gãy chăm sóc lại", "follow-up gaps"),
      ],
      footer: tx("Điểm nghẽn vận hành", "Operational bottleneck"),
      image: "/8.3.png",
      icon: HeartPulse,
      className: "lg:col-span-2 border-red-200 bg-gradient-to-b from-[#fff6f6] to-white",
    },
    {
      title: "SHOP ONLINE",
      subtitle: tx("Nhóm mục tiêu mở rộng", "Secondary target"),
      points: [
        tx("khối lượng hộp thư cao", "high inbox volume"),
        tx("chăm sóc khách hàng thủ công", "manual support"),
        tx("lọc khách chậm", "slow qualification"),
      ],
      footer: tx("Cơ hội tự động hóa", "Automation opportunity"),
      image: "/8.4.png",
      icon: ShoppingBag,
      className: "lg:col-span-2 border-red-200 bg-gradient-to-b from-[#fff3f5] to-white",
    },
  ];

  const commandments = [
    tx("Tốc độ > cầu toàn", "Speed > perfection"),
    tx("Dòng tiền > chỉ số ảo", "Cashflow > vanity"),
    tx("Học nhanh > mở rộng sớm", "Learning > scaling"),
    tx("Hệ thống > hỗn loạn", "Systems > chaos"),
  ];

 

  const outbound = [
    tx("Thư viện quảng cáo", "Ads Library"),
    tx("Bình luận TikTok", "TikTok comments"),
    tx("Nhóm Facebook", "FB groups"),
    tx("Hợp tác đối tác", "agency partnerships"),
  ];
  const inbound = [
    tx("Nội dung từ người sáng lập", "founder content"),
    tx("Tình huống thực tế", "case study"),
    tx("Video ngắn TikTok", "TikTok reels"),
    tx("Thương hiệu lãnh đạo", "leadership branding"),
  ];

  const pricingFlow = [
    tx("Giá thấp", "Low price"),
    tx("Nhiều khách hơn", "More clients"),
    tx("Nhiều dữ liệu hơn", "More data"),
    tx("Hệ thống tốt hơn", "Better systems"),
    tx("ROI cao hơn", "Higher ROI"),
    tx("Giá cao hơn về sau", "Higher pricing later"),
  ];

  return (
    <section className="relative overflow-hidden bg-[#fff9fa] py-24 sm:py-28 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(180,24,40,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(180,24,40,0.08)_1px,transparent_1px)] bg-[size:56px_56px]" />
      <motion.div
        className="pointer-events-none absolute left-[-12rem] top-[8%] h-[31rem] w-[31rem] rounded-full bg-[radial-gradient(circle,rgba(255,77,77,0.34)_0%,rgba(255,255,255,0)_70%)] blur-2xl"
        animate={{ x: [0, 22, 0], y: [0, -16, 0], opacity: [0.7, 1, 0.75] }}
        transition={{ duration: 9, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute right-[-10rem] bottom-[4%] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(255,61,79,0.28)_0%,rgba(255,255,255,0)_72%)] blur-2xl"
        animate={{ x: [0, -24, 0], y: [0, 18, 0], opacity: [0.65, 0.95, 0.65] }}
        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <motion.p
          {...fadeUp(0)}
          className="text-sm font-semibold tracking-[0.16em] text-[#5f1a22] uppercase"
        >
          {tx("PHASE 1 CHI TIẾT", "PHASE 1 DETAILS")}
        </motion.p>

        <motion.div {...fadeUp(0.05)} className="mx-auto mt-8 max-w-[1280px] text-center">
          <motion.p
            className="inline-flex items-center rounded-full border border-red-200 bg-white/92 px-4 py-2 text-xs font-bold tracking-[0.12em] text-red-500 uppercase"
            animate={{ boxShadow: ["0 0 0 0 rgba(255,61,79,0.22)", "0 0 0 10px rgba(255,61,79,0)", "0 0 0 0 rgba(255,61,79,0.22)"] }}
            transition={{ duration: 2.2, repeat: Number.POSITIVE_INFINITY }}
          >
            {tx("Vòng lặp thực thi chiến thuật", "Tactical execution cycle")}
          </motion.p>
          <h2 className="mt-4 text-[2.35rem] leading-[1.05] font-extrabold tracking-[-0.03em] text-[#321017] sm:text-[3.2rem] lg:text-[4rem]">
            <span className="block sm:whitespace-nowrap">
              {tx(
                "PHASE 1 KHÔNG PHẢI ĐỂ XÂY CÔNG TY AI.",
                "PHASE 1 IS NOT ABOUT BUILDING AN AI COMPANY."
              )}
            </span>
            <span className="block text-[#ff4d5f] sm:whitespace-nowrap">
              {tx(
                "MÀ DÙNG ĐỂ TẠO DÒNG TIỀN + HỆ THỐNG.",
                "THIS BUILDS CASHFLOW + SYSTEMS."
              )}
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-[760px] text-xl leading-9 text-[#5f1a22]/80">
            {tx(
              "Mọi thứ hiện tại đều xoay quanh: kiếm khách → bàn giao → học → tự động hóa.",
              "Everything now revolves around: acquisition → delivery → learning → automation."
            )}
          </p>
          <p className="mt-4 text-lg font-semibold tracking-[0.08em] text-[#8a1f2e] uppercase">
            {tx("CỖ MÁY ĐANG CHẠY.", "THE MACHINE IS RUNNING.")}
          </p>
        </motion.div>

        <motion.div {...fadeUp(0.16)} className="mt-12">
          <p className="text-sm font-semibold tracking-[0.15em] text-[#ff3d4f] uppercase">
            {tx("THỊ TRƯỜNG MỤC TIÊU", "MARKET WE ATTACK")}
          </p>
          <div className="mt-4 grid gap-4 lg:grid-cols-12">
            {marketCards.map((card) => {
              const Icon = card.icon;
              return (
                <article key={card.title} className={`rounded-[22px] border p-0 shadow-[0_18px_45px_-34px_rgba(127,29,29,0.45)] ${card.className}`}>
                  <div className="relative h-[170px] overflow-hidden rounded-t-[22px] border-b border-black/5">
                    <Image src={card.image} alt={card.title} fill className="object-cover" quality={100} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                    <div className="absolute left-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/88">
                      <Icon className="h-5 w-5 text-[#ff3d4f]" />
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xl font-extrabold tracking-[-0.02em] text-[#321017]">{card.title}</p>
                    <p className="mt-1 text-xs font-semibold tracking-[0.09em] text-[#ff3d4f] uppercase">{card.subtitle}</p>
                    <ul className="mt-3 space-y-1.5 text-sm text-[#5f1a22]/82">
                      {card.points.map((p) => (
                        <li key={p} className="flex items-start gap-2">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-red-400" />
                          {p}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 rounded-full border border-red-100 bg-white px-3 py-1 text-xs font-semibold text-[#5f1a22]/80">
                      {card.footer}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </motion.div>

        <div className="mt-8 grid items-stretch gap-5 lg:grid-cols-2">
          <motion.article {...fadeUp(0.2)} className="h-full rounded-[24px] border border-red-100/80 bg-[#fff6f8] p-6">
            <p className="text-sm font-semibold tracking-[0.15em] text-[#ff3d4f] uppercase">
              {tx("KHÁCH HÀNG NGHĨ HỌ ĐANG MUA", "CLIENTS THINK THEY BUY")}
            </p>
            <ul className="mt-4 space-y-2.5 text-2xl font-bold text-[#321017]">
              {[
                tx("website", "website"),
                tx("tự động hóa", "automation"),
                tx("chatbot", "chatbot"),
                tx("quảng cáo", "ads"),
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <XCircle className="h-6 w-6 text-red-400" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.article>

          <motion.article {...fadeUp(0.24)} className="h-full rounded-[24px] border border-red-100/80 bg-[#fff4f6] p-6">
            <p className="text-sm font-semibold tracking-[0.15em] text-red-600 uppercase">
              {tx("THỨ HỌ THẬT SỰ TRẢ TIỀN", "WHAT THEY ACTUALLY BUY")}
            </p>
            <ul className="mt-4 space-y-2.5 text-2xl font-bold text-[#321017]">
              {[
                tx("tăng trưởng nhanh hơn", "faster growth"),
                tx("vận hành bớt rối", "less chaos"),
                tx("nhiều khách tiềm năng hơn", "more leads"),
                tx("giảm việc thủ công", "less manual work"),
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-red-500" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.article>
        </div>

        <motion.div {...fadeUp(0.3)} className="mt-8">
          <p className="text-sm font-semibold tracking-[0.15em] text-[#ff3d4f] uppercase">
            {tx("ƯU TIÊN CỦA PHASE 1", "PHASE 1 PRIORITIES")}
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {commandments.map((rule) => (
              <article
                key={rule}
                className="overflow-hidden rounded-[22px] border border-red-100 bg-white px-4 py-4 shadow-[0_14px_40px_-30px_rgba(127,29,29,0.42)] sm:px-5 sm:py-5"
              >
                <p className="text-[clamp(0.95rem,0.95vw,1.22rem)] leading-[1.15] font-extrabold tracking-[-0.01em] text-[#321017] xl:whitespace-nowrap">
                  {rule}
                </p>
              </article>
            ))}
          </div>
        </motion.div>

        <div className="mt-8 grid items-stretch gap-5 lg:grid-cols-2">
          <motion.article {...fadeUp(0.44)} className="h-full rounded-[24px] border border-red-100 bg-[#fff8f8] p-6">
            <p className="text-sm font-semibold tracking-[0.15em] text-red-500 uppercase">
              {tx("TIẾP CẬN CHỦ ĐỘNG · CHẾ ĐỘ SĂN KHÁCH", "OUTBOUND · HUNTER MODE")}
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {outbound.map((item) => (
                <span key={item} className="rounded-full border border-red-200 bg-white px-3 py-1.5 text-sm font-semibold text-[#5f1a22]/82">
                  {item}
                </span>
              ))}
            </div>
          </motion.article>

          <motion.article {...fadeUp(0.48)} className="h-full rounded-[24px] border border-red-100 bg-[#fff5f7] p-6">
            <p className="text-sm font-semibold tracking-[0.15em] text-red-600 uppercase">
              {tx("THU HÚT TỰ NHIÊN · CHẾ ĐỘ HÚT KHÁCH", "INBOUND · GRAVITY MODE")}
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {inbound.map((item) => (
                <span key={item} className="rounded-full border border-red-200 bg-white px-3 py-1.5 text-sm font-semibold text-[#5f1a22]/82">
                  {item}
                </span>
              ))}
            </div>
          </motion.article>
        </div>

        <motion.article
          {...fadeUp(0.52)}
          className="mt-8 rounded-[24px] border border-red-100/80 bg-white p-6 shadow-[0_18px_45px_-34px_rgba(127,29,29,0.45)]"
        >
          <p className="text-sm font-semibold tracking-[0.15em] text-red-500 uppercase">
            {tx("TRIẾT LÝ ĐỊNH GIÁ", "PRICING PHILOSOPHY")}
          </p>
          <p className="mt-2 text-[2.2rem] leading-[1.12] font-extrabold tracking-[-0.02em] text-[#321017]">
            {tx(
              "PHASE 1 TỐI ƯU CHO: TỐC ĐỘ HỌC.",
              "PHASE 1 OPTIMIZES FOR: SPEED OF LEARNING."
            )}
          </p>
          <p className="mt-2 text-lg text-[#5f1a22]/80">
            {tx("KHÔNG PHẢI: LỢI NHUẬN TỐI ĐA NGAY LẬP TỨC.", "NOT: MAX PROFIT.")}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {pricingFlow.map((item, idx) => (
              <div key={item} className="flex items-center gap-3">
                <span className="rounded-full border border-red-100 bg-red-50 px-3 py-1.5 text-sm font-semibold text-[#5f1a22]/82">
                  {item}
                </span>
                {idx !== pricingFlow.length - 1 ? <ArrowRight className="h-4 w-4 text-red-300" /> : null}
              </div>
            ))}
          </div>
        </motion.article>

      </div>
    </section>
  );
}
