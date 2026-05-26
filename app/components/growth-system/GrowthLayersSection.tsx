"use client";

import { CircleDot } from "lucide-react";
import GrowthSectionTitle from "./GrowthSectionTitle";
import { useGrowthLocale } from "./useGrowthLocale";

export default function GrowthLayersSection() {
  const { tx } = useGrowthLocale();

  const layerCards = [
    {
      id: tx("LỚP 1 · BẮT BUỘC", "LAYER 1 · REQUIRED"),
      title: tx("CÔNG VIỆC CỐT LÕI", "CORE JOB"),
      text: tx("Đây là lý do bạn được trả lương. Đây là KPI đánh giá hiệu suất chính.", "This is why you are paid. This is your primary performance KPI."),
      points: [
        tx("Dev: bàn giao sản phẩm, fix bug, build tính năng đúng hạn", "Dev: ship product, fix bugs, build features on time"),
        tx("Marketing: nội dung, chiến dịch, nhận diện thương hiệu", "Marketing: content, campaigns, brand presence"),
        tx("Sales: demo, chốt deal, quản lý pipeline", "Sales: demo, close deals, manage pipeline"),
        tx("Ops/HR/Finance: vận hành hệ thống, tuyển dụng, tài chính", "Ops/HR/Finance: run systems, hiring, finance"),
        tx("Intern: học, hỗ trợ team, hoàn thành task được giao", "Intern: learn, support the team, complete assigned tasks"),
      ],
      tone: "text-[#0b1020]",
      border: "border-[#d7dce8]",
      bg: "bg-white",
    },
    {
      id: tx("LỚP 2 · KHÔNG BẮT BUỘC", "LAYER 2 · OPTIONAL"),
      title: tx("MỞ RỘNG TĂNG TRƯỞNG", "GROWTH EXTENSION"),
      text: tx("Không ảnh hưởng đánh giá core nếu bạn không làm. Nhưng làm tốt thì có reward thật.", "Your core evaluation is unchanged if you skip this. Do it well and you get real rewards."),
      points: [
        tx("Giới thiệu khách", "Lead referrals"),
        tx("Tìm lead chất lượng", "Qualified lead discovery"),
        tx("Seeding nội dung", "Content seeding"),
        tx("Hỗ trợ hệ sinh thái có tác động trực tiếp", "Direct ecosystem support with impact"),
      ],
      tone: "text-[#ff4d5f]",
      border: "border-[#ffd6de]",
      bg: "bg-[#fff7fa]",
    },
    {
      id: tx("LỚP 3 · LEADER & CULTURE", "LAYER 3 · LEADER & CULTURE"),
      title: tx("ĐÓNG GÓP DÀI HẠN", "LONG-TERM CONTRIBUTION"),
      text: tx("Không đo trực tiếp bằng doanh thu ngay lập tức nhưng ảnh hưởng mạnh tới khả năng scale dài hạn.", "Not measured by immediate revenue, but critical for long-term scale."),
      points: [
        tx("cải tiến workflow", "workflow improvement"),
        tx("mentor", "mentoring"),
        tx("tài liệu hóa hệ thống", "system documentation"),
        tx("hỗ trợ onboarding", "onboarding support"),
      ],
      tone: "text-[#7c3aed]",
      border: "border-[#e7ddff]",
      bg: "bg-[#faf7ff]",
    },
  ];

  const roleCoreJobs = [
    ["DEV", tx("Bàn giao sản phẩm, fix bug, build tính năng đúng hạn", "Ship product, fix bugs, build features on time")],
    ["MARKETING", tx("Nội dung, chiến dịch, nhận diện thương hiệu", "Content, campaigns, brand presence")],
    ["SALES", tx("Demo, chốt deal, quản lý pipeline", "Demo, close deals, manage pipeline")],
    ["OPS / HR / FINANCE", tx("Vận hành hệ thống, tuyển dụng, quản lý tài chính", "Run systems, hiring, manage finance")],
    ["INTERN", tx("Học, hỗ trợ team, hoàn thành task được giao", "Learn, support team, complete assigned tasks")],
  ];

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <GrowthSectionTitle label={tx("CẤU TRÚC 3 LỚP", "3-LAYER STRUCTURE")} title={tx("HỆ THỐNG TĂNG TRƯỞNG HIỆN TẠI ĐƯỢC CHIA THÀNH 3 LỚP.", "THE CURRENT GROWTH SYSTEM HAS 3 LAYERS.")} />

        <div className="mt-7 grid gap-4 lg:grid-cols-3">
          {layerCards.map((layer, index) => (
            <article key={layer.id} className={`rounded-[24px] border p-5 shadow-[0_14px_30px_-24px_rgba(15,23,42,0.35)] ${layer.border} ${layer.bg}`}>
              <div className="flex items-center justify-between gap-3">
                <p className={`text-xs font-semibold tracking-[0.16em] uppercase ${layer.tone}`}>{layer.id}</p>
                <span style={{ animationDelay: `${index * 0.18}s` }} className="inline-flex h-2.5 w-2.5 rounded-full bg-[#ff4d5f] animate-pulse" />
              </div>
              <h3 className="mt-2 text-2xl font-extrabold tracking-[-0.02em] text-[#0b1020] uppercase">{layer.title}</h3>
              <p className="mt-2 text-sm leading-7 text-[#0b1020]/78">{layer.text}</p>
              <ul className="mt-3 space-y-2 text-sm text-[#0b1020]/84">
                {layer.points.map((point, pointIndex) => (
                  <li key={point} className="flex items-start gap-2">
                    <CircleDot style={{ animationDelay: `${pointIndex * 0.12}s` }} className="mt-1 h-4 w-4 shrink-0 text-[#ff4d5f] animate-pulse" />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <article className="mt-6 overflow-hidden rounded-[24px] border border-[#dce2f0] bg-white">
          <div className="border-b border-[#e7ebf4] bg-[#f8faff] px-5 py-3">
            <p className="text-sm font-semibold tracking-[0.14em] text-[#23427a] uppercase">{tx("BẢN ĐỒ VAI TRÒ LỚP 1", "LAYER 1 ROLE MAP")}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#eef1f7] bg-[#fcfdff] text-[#0b1020]/68">
                  <th className="px-5 py-3 font-semibold">{tx("Vai trò", "Role")}</th>
                  <th className="px-5 py-3 font-semibold">{tx("Công việc cốt lõi (Lớp 1)", "Core Job (Layer 1)")}</th>
                </tr>
              </thead>
              <tbody>
                {roleCoreJobs.map(([role, job]) => (
                  <tr key={role} className="border-b border-[#f1f3f8] last:border-0">
                    <td className="px-5 py-3 font-semibold text-[#0b1020]">{role}</td>
                    <td className="px-5 py-3 text-[#0b1020]/78">{job}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <p className="mt-6 rounded-[22px] border border-[#ffd8e1] bg-[#fff7fa] px-5 py-4 text-lg font-bold text-[#2b0f1d] uppercase sm:text-xl">
          {tx("KHÔNG PHẢI ĐÓNG GÓP NÀO CŨNG ĐO BẰNG DOANH THU NGAY LẬP TỨC.", "NOT EVERY CONTRIBUTION IS MEASURED BY IMMEDIATE REVENUE.")}
        </p>
      </div>
    </section>
  );
}
