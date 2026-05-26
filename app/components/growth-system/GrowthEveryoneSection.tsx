"use client";

import { Bot, Compass, FileText, Lightbulb, Users, Wrench } from "lucide-react";
import GrowthSectionTitle from "./GrowthSectionTitle";
import { useGrowthLocale } from "./useGrowthLocale";

export default function GrowthEveryoneSection() {
  const { tx } = useGrowthLocale();

  const roleExamples = [
    { role: tx("NỘI DUNG", "CONTENT"), impact: tx("Xây niềm tin.", "Build trust."), Icon: FileText, tone: "text-[#ff4d5f]", bg: "bg-[#fff6f8]", border: "border-[#ffd6de]" },
    { role: tx("DEV / TỰ ĐỘNG HÓA", "DEV / AUTOMATION"), impact: tx("Tăng tốc bàn giao.", "Speed up delivery."), Icon: Bot, tone: "text-[#2f73ff]", bg: "bg-[#f5f8ff]", border: "border-[#d9e5ff]" },
    { role: tx("VẬN HÀNH", "OPERATIONS"), impact: tx("Giảm ma sát.", "Reduce friction."), Icon: Wrench, tone: "text-[#0f766e]", bg: "bg-[#f2fbfa]", border: "border-[#c9efea]" },
    { role: tx("BÁN HÀNG", "SALES"), impact: tx("Hiểu nỗi đau kinh doanh.", "Understand business pain."), Icon: Compass, tone: "text-[#7c3aed]", bg: "bg-[#f8f4ff]", border: "border-[#e7ddff]" },
    { role: tx("CỘNG ĐỒNG", "COMMUNITY"), impact: tx("Tạo quan hệ.", "Build relationships."), Icon: Users, tone: "text-[#ea580c]", bg: "bg-[#fff7ed]", border: "border-[#fed7aa]" },
    { role: tx("THỰC TẬP SINH", "INTERN"), impact: tx("Quan sát và cải tiến quy trình.", "Observe and improve workflows."), Icon: Lightbulb, tone: "text-[#0369a1]", bg: "bg-[#f0f9ff]", border: "border-[#bae6fd]" },
  ];

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <GrowthSectionTitle
          label={tx("TĂNG TRƯỞNG LÀ VIỆC CỦA MỌI NGƯỜI", "GROWTH IS EVERYONE'S JOB")}
          title={tx("AI TRONG HỆ SINH THÁI CŨNG CÓ THỂ ĐÓNG GÓP VÀO TĂNG TRƯỞNG.", "ANYONE IN THE ECOSYSTEM CAN CONTRIBUTE TO GROWTH.")}
        />

        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {roleExamples.map((item, index) => {
            const Icon = item.Icon;
            return (
              <article
                key={item.role}
                style={{ animationDelay: `${index * 0.12}s` }}
                className={`imfx-diagram-float rounded-[22px] border p-4 shadow-[0_12px_28px_-24px_rgba(15,23,42,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_36px_-24px_rgba(255,77,95,0.42)] ${item.border} ${item.bg}`}
              >
                <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full border bg-white ${item.border} ${item.tone}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-3 text-xl font-extrabold tracking-[-0.02em] text-[#0b1020] uppercase">{item.role}</p>
                <p className={`mt-1 text-sm font-semibold ${item.tone}`}>{item.impact}</p>
              </article>
            );
          })}
        </div>

        <p className="mt-6 rounded-[22px] border border-[#ff97a8] bg-gradient-to-r from-[#ff3f57] via-[#ff4d5f] to-[#ff6d86] px-5 py-4 text-xl font-bold text-white shadow-[0_20px_40px_-24px_rgba(255,77,95,0.65)] sm:text-2xl">
          &quot;{tx("TĂNG TRƯỞNG XUẤT HIỆN KHI CÁC HỆ THỐNG KẾT NỐI VỚI NHAU.", "GROWTH APPEARS WHEN SYSTEMS CONNECT TO EACH OTHER.")}&quot;
        </p>
      </div>
    </section>
  );
}
