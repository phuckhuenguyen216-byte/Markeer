"use client";

import Image from "next/image";
import { Activity, Bot, Layers3, MessageCircleMore, ShieldCheck, Users } from "lucide-react";
import GrowthSectionTitle from "./GrowthSectionTitle";
import { useGrowthLocale } from "./useGrowthLocale";

export default function GrowthWhySection() {
  const { tx } = useGrowthLocale();

  const dynamicLayers = [
    tx("Lớp nội dung", "Content layer"),
    tx("Lớp niềm tin", "Trust layer"),
    tx("Lớp tự động hóa", "Automation layer"),
    tx("Lớp bàn giao", "Delivery layer"),
    tx("Lớp quan hệ", "Relationship layer"),
  ];

  const liveSignals = [
    { label: tx("Niềm tin tăng", "Trust up"), value: "+32%", Icon: ShieldCheck },
    { label: tx("Vòng giới thiệu", "Referral loop"), value: tx("Đang chạy", "Active"), Icon: Activity },
    { label: tx("Nội dung đến hội thoại", "Content to conversation"), value: tx("Đồng bộ", "Synchronized"), Icon: MessageCircleMore },
    { label: tx("Tự động hóa", "Automation"), value: tx("Tuyến sống", "Core lane"), Icon: Bot },
  ];

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <GrowthSectionTitle
          label={tx("VÌ SAO HỆ THỐNG NÀY TỒN TẠI", "WHY THIS SYSTEM EXISTS")}
          title={tx("TẠI SAO HỆ SINH THÁI CẦN MỘT HỆ THỐNG TĂNG TRƯỞNG?", "WHY DOES THE ECOSYSTEM NEED A GROWTH SYSTEM?")}
          centered
        />

        <div className="mt-7 grid items-stretch gap-6 lg:grid-cols-2">
          <article className="flex h-full flex-col rounded-[24px] border border-[#ffdbe3] bg-white p-6">
            <h3 className="text-[1.22rem] leading-8 font-bold text-[#0b1020] sm:text-[1.42rem]">
              {tx("Hệ sinh thái không tăng trưởng chỉ bằng sales.", "An ecosystem cannot grow through sales alone.")}
            </h3>
            <p className="mt-2 text-[1rem] leading-7 text-[#0b1020]/76">
              {tx(
                "Tăng trưởng xuất hiện khi các lớp vận hành bắt đầu kết nối thành một vòng lặp.",
                "Growth appears when operational layers connect into one loop."
              )}
            </p>

            <ul className="mt-5 space-y-2.5 text-base leading-7 text-[#0b1020]/82">
              <li className="flex items-center gap-3"><MessageCircleMore className="h-4 w-4 text-[#ff4d5f]" />{tx("nội dung tạo niềm tin", "content builds trust")}</li>
              <li className="flex items-center gap-3"><Layers3 className="h-4 w-4 text-[#ff4d5f]" />{tx("hệ thống tạo khả năng mở rộng", "systems create scalability")}</li>
              <li className="flex items-center gap-3"><ShieldCheck className="h-4 w-4 text-[#ff4d5f]" />{tx("bàn giao tạo giới thiệu", "delivery generates referrals")}</li>
              <li className="flex items-center gap-3"><Users className="h-4 w-4 text-[#ff4d5f]" />{tx("con người tạo mạng lưới", "people build networks")}</li>
            </ul>

            <div className="mt-6 rounded-2xl border border-[#ffdbe3] bg-[#fff7fa] p-5">
              <p className="text-lg font-bold text-[#ff4d5f]">{tx("Tăng trưởng không phải: đi bán hàng.", "Growth is not: just selling.")}</p>
              <p className="mt-1.5 text-[1.28rem] leading-9 font-bold text-[#0b1020]">
                {tx("Tăng trưởng là: tạo thêm giá trị cho hệ sinh thái theo thời gian.", "Growth is: creating more value for the ecosystem over time.")}
              </p>
            </div>

            <p className="mt-6 text-sm font-semibold tracking-[0.13em] text-[#ff4d5f] uppercase">{tx("LỚP ĐỘNG CỦA HỆ", "ACTIVE LAYERS")}</p>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {dynamicLayers.map((item) => (
                <span key={item} className="inline-flex items-center gap-2 rounded-full border border-[#ffdce4] bg-white px-3 py-1.5 text-sm font-semibold text-[#0b1020]/82">
                  <span className="h-2 w-2 rounded-full bg-[#ff6f86] animate-pulse" />
                  {item}
                </span>
              ))}
            </div>

            <p className="mt-6 text-sm font-semibold tracking-[0.13em] text-[#ff4d5f] uppercase">{tx("TÍN HIỆU ĐANG CHẠY", "LIVE SIGNALS")}</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {liveSignals.map((item) => {
                const Icon = item.Icon;
                return (
                  <div key={item.label} className="rounded-xl border border-[#ffdce4] bg-white px-3 py-2.5">
                    <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.08em] text-[#0b1020]/64 uppercase">
                      <Icon className="h-3.5 w-3.5 text-[#ff4d5f]" />
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm font-bold text-[#0b1020]">{item.value}</p>
                  </div>
                );
              })}
            </div>
          </article>

          <article className="flex h-full flex-col rounded-[24px] border border-[#ffdbe3] bg-gradient-to-br from-[#fff8fa] to-white p-6">
            <div className="mt-4 overflow-hidden rounded-[20px] border border-[#ffdce4] bg-white">
              <div className="relative aspect-square min-h-[320px] sm:min-h-[420px]">
                <Image src="/banner2.png" alt={tx("Mô hình động cơ đóng góp", "Contribution engine model")} fill className="object-contain object-top" />
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-[#ffdce4] bg-white px-3 py-2.5">
                <p className="text-[11px] font-semibold tracking-[0.08em] text-[#0b1020]/62 uppercase">{tx("Nhịp niềm tin", "Trust rhythm")}</p>
                <p className="mt-1 text-sm font-bold text-[#0b1020]">{tx("Ổn định và tích lũy", "Stable and compounding")}</p>
              </div>
              <div className="rounded-xl border border-[#ffdce4] bg-white px-3 py-2.5">
                <p className="text-[11px] font-semibold tracking-[0.08em] text-[#0b1020]/62 uppercase">{tx("Tuyến tự động hóa", "Automation lane")}</p>
                <p className="mt-1 text-sm font-bold text-[#0b1020]">{tx("Hệ thống đồng bộ", "Synchronized systems")}</p>
              </div>
              <div className="rounded-xl border border-[#ffdce4] bg-white px-3 py-2.5">
                <p className="text-[11px] font-semibold tracking-[0.08em] text-[#0b1020]/62 uppercase">{tx("Vòng giới thiệu", "Referral loop")}</p>
                <p className="mt-1 text-sm font-bold text-[#0b1020]">{tx("Đang hoạt động", "Running")}</p>
              </div>
            </div>

            <p className="mt-3 rounded-xl border border-[#ffdce4] bg-white px-3 py-2.5 text-sm text-[#0b1020]/74">
              {tx(
                "Động cơ tăng trưởng chỉ chạy tốt khi lớp đóng góp, lớp bàn giao và lớp niềm tin giữ cùng một nhịp.",
                "The growth engine works best when contribution, delivery, and trust layers stay in one rhythm."
              )}
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
