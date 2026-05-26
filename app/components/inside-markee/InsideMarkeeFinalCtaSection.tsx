"use client";

import { motion } from "framer-motion";
import type { ComponentType } from "react";
import { ArrowRight, Beaker, BriefcaseBusiness, CheckCircle2, Heart, Network, RefreshCcw, Users, XCircle } from "lucide-react";
import { useInsideMarkeeLocale } from "./useInsideMarkeeLocale";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] as const },
  viewport: { once: true, amount: 0.2 },
});

export default function InsideMarkeeFinalCtaSection() {
  const { tx } = useInsideMarkeeLocale();

  const joinCards = [
    {
      title: tx("THAM GIA ĐỘI", "JOIN THE TEAM"),
      points: [
        tx("người làm sản phẩm", "builders"),
        tx("người vận hành", "operators"),
        tx("người làm tiếp thị", "marketers"),
        tx("người làm kỹ thuật", "developers"),
        tx(
          "người muốn lớn lên cùng hệ thống",
          "people who want to grow with systems"
        ),
      ],
      Icon: Users,
    },
    {
      title: tx("LÀM VIỆC CÙNG MARKEE", "WORK WITH MARKEE"),
      points: [
        tx("tăng trưởng nhanh hơn", "grow faster"),
        tx("tự động hóa vận hành", "automate operations"),
        tx("xây quy trình có thể mở rộng", "build scalable workflows"),
      ],
      Icon: BriefcaseBusiness,
    },
    {
      title: tx("ĐỒNG XÂY HỆ SINH THÁI", "BUILD WITH THE ECOSYSTEM"),
      points: [
        tx("đối tác", "partners"),
        tx("cộng đồng", "communities"),
        tx("nhà sáng tạo", "creators"),
        tx("người vận hành", "operators"),
        tx("cộng tác dài hạn", "long-term collaborators"),
      ],
      Icon: Network,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#fffdfd_45%,#fff9fb_100%)] py-24 sm:py-28 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,92,118,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,92,118,0.08)_1px,transparent_1px)] bg-[size:58px_58px]" />
      <div className="pointer-events-none absolute left-1/2 top-[-13rem] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,77,77,0.2)_0%,rgba(255,185,198,0.13)_38%,rgba(255,255,255,0)_78%)] blur-3xl" />

      <div className="relative mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
        <motion.p
          {...fadeUp(0)}
          className="text-center text-sm font-semibold tracking-[0.17em] text-[#0b1020]/80 uppercase"
        >
          {tx("HÀNH TRÌNH TIẾP TỤC", "THE JOURNEY CONTINUES")}
        </motion.p>

        <motion.div {...fadeUp(0.05)} className="mx-auto mt-8 max-w-[980px] text-center">
          <h2 className="text-[3rem] leading-[1.05] font-extrabold tracking-[-0.03em] text-[#2d0d18] sm:text-[4.2rem]">
            {tx("CHÚNG TA VẪN ĐANG", "WE ARE STILL")}
            <br />
            <span className="text-[#ff4d5f]">{tx("RẤT SỚM.", "VERY EARLY.")}</span>
          </h2>

          
        </motion.div>

        <motion.article
          {...fadeUp(0.16)}
          className="mx-auto mt-10 w-full max-w-[1100px] rounded-[24px] border border-red-100/80 bg-white p-6"
        >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-sm font-semibold tracking-[0.16em] text-[#ff4d4d] uppercase">{tx("MỌI THỨ HIỆN TẠI:", "EVERYTHING NOW:")}</p>
                <ul className="mt-3 space-y-1.5 text-[#2d0d18]/82">
                  {[
                    tx("quy trình", "workflows"),
                    tx("hệ thống", "systems"),
                    tx("tự động hóa", "automation"),
                    tx("tăng trưởng", "growth"),
                    tx("cộng đồng", "community"),
                    tx("vận hành", "operations"),
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-red-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-[0.78rem] font-semibold tracking-[0.16em] whitespace-nowrap text-[#ff4d4d] uppercase sm:text-sm">{tx("KHÔNG AI CÓ TẤT CẢ CÂU TRẢ LỜI.", "NO ONE HAS ALL ANSWERS.")}</p>
                <p className="mt-3 text-[#2d0d18]/82">{tx("ĐỘI VẪN ĐANG:", "THE TEAM IS STILL:")}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <FlowChip label={tx("HỌC", "LEARN")} Icon={Beaker} />
                  <span className="text-red-300">→</span>
                  <FlowChip label={tx("KIỂM THỬ", "TEST")} Icon={Beaker} />
                  <span className="text-red-300">→</span>
                  <FlowChip label={tx("THẤT BẠI", "FAIL")} Icon={XCircle} />
                  <span className="text-red-300">→</span>
                  <FlowChip label={tx("CẢI TIẾN", "IMPROVE")} Icon={ArrowRight} />
                  <span className="text-red-300">→</span>
                  <FlowChip label={tx("LẶP LẠI", "ITERATE")} Icon={RefreshCcw} />
                </div>
              </div>
            </div>
        </motion.article>

        <motion.p {...fadeUp(0.26)} className="mt-9 text-center text-base leading-7 text-[#2d0d18]/82">
          {tx(
            "Đây là thời điểm thú vị nhất để tham gia, cùng xây, cùng đóng góp và cùng lớn lên với hệ sinh thái.",
            "This is the most interesting moment to join, build, contribute, and grow with the ecosystem."
          )}
        </motion.p>

        <motion.p
          {...fadeUp(0.3)}
          className="mt-8 text-center text-sm font-semibold tracking-[0.2em] text-[#ff4d4d] uppercase"
        >
          {tx("THAM GIA HÀNH TRÌNH", "JOIN THE JOURNEY")}
        </motion.p>

        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {joinCards.map((card, index) => {
            const Icon = card.Icon;
            return (
              <motion.article key={card.title} {...fadeUp(0.32 + index * 0.04)} className="imfx-edge-run rounded-[24px] border border-red-100/80 bg-white p-6 shadow-[0_16px_46px_-40px_rgba(15,23,42,0.6)]">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-red-100 bg-[#fff8fa] text-[#ff4d4d]">
                  <Icon className="h-6 w-6" />
                </span>
                <p className="mt-4 text-[2rem] leading-[1.1] font-bold tracking-[-0.02em] text-[#2d0d18]">{card.title}</p>
                <ul className="mt-4 space-y-2 text-[#2d0d18]/78">
                  {card.points.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#ff4d4d]" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-red-200 text-[#ff4d4d]">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </motion.article>
            );
          })}
        </div>

        <motion.div {...fadeUp(0.42)} className="mt-12 text-center">
          <p className="text-xs tracking-[0.22em] text-[#2d0d18]/44 uppercase">
            INSIDE MARKEE · COMPANY PLAYBOOK · V1
          </p>
          <p className="mt-4 text-[4rem] font-extrabold leading-none tracking-[-0.03em] text-[#2d0d18] sm:text-[5rem]">
            {tx("MỌI THỨ ĐỀU TÍCH LŨY.", "EVERYTHING COMPOUNDS.")}
          </p>
          <p className="mt-4 text-base text-[#2d0d18]/62">{tx("Cảm ơn vì đã đọc tới đây.", "Thank you for reading all the way here.")}</p>
          <p className="mt-2 text-[#ff6f82]">
            <Heart className="mx-auto h-4 w-4" />
          </p>
        </motion.div>
      </div>
    </section>
  );
}

type FlowChipProps = {
  Icon: ComponentType<{ className?: string }>;
  label: string;
};

function FlowChip({ Icon, label }: FlowChipProps) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-[#fffafb] px-3 py-2 text-sm text-[#2d0d18]/82">
      <Icon className="h-4 w-4 text-[#ff4d4d]" />
      {label}
    </span>
  );
}
