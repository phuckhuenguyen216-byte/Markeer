"use client";

import { ArrowRight } from "lucide-react";
import GrowthSectionTitle from "./GrowthSectionTitle";
import { useGrowthLocale } from "./useGrowthLocale";

export default function GrowthLeadFlowSection() {
  const { tx } = useGrowthLocale();

  const leadFlow = [
    tx("TÌM NỖI ĐAU", "PAIN DISCOVERY"),
    tx("HỘI THOẠI", "CONVERSATION"),
    tx("SÀNG LỌC", "QUALIFICATION"),
    tx("CHIẾN LƯỢC", "STRATEGY"),
    tx("BÀN GIAO", "DELIVERY"),
    tx("TÌNH HUỐNG THỰC TẾ", "CASE STUDY"),
    tx("THÊM NIỀM TIN", "MORE TRUST"),
  ];

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <GrowthSectionTitle
          label={tx("LUỒNG LEAD HỆ SINH THÁI", "ECOSYSTEM LEAD FLOW")}
          title={tx("MỘT LEAD HIỆN TẠI ĐI QUA HỆ SINH THÁI NHƯ THẾ NÀO", "HOW A LEAD FLOWS THROUGH THE ECOSYSTEM")}
        />

        <article className="mt-7 rounded-[24px] border border-[#ffdbe3] bg-white p-6">
          <div className="flex flex-wrap items-center gap-2.5">
            {leadFlow.map((item, index) => (
              <div key={item} className="flex items-center gap-2.5">
                <span style={{ animationDelay: `${index * 3}s` }} className="gs-lead-step rounded-full border border-[#ffd6de] bg-[#fff8fa] px-3 py-2 text-sm font-semibold text-[#2b0f1d]">
                  {item}
                </span>
                {index !== leadFlow.length - 1 ? <ArrowRight style={{ animationDelay: `${index * 3}s` }} className="gs-lead-arrow h-4 w-4 text-[#ff9aae]" /> : null}
              </div>
            ))}
          </div>

          <p className="mt-5 text-base leading-7 text-[#0b1020]/78">
            {tx("Một lead tốt không bắt đầu bằng spam. Nó bắt đầu bằng đúng nỗi đau, đúng thời điểm, và đúng quan hệ.", "A good lead does not start with spam. It starts with the right pain, right timing, and right relationship.")}
          </p>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-[#dce6ff] bg-[#f7faff] p-4">
              <p className="text-xs font-semibold tracking-[0.16em] text-[#2f73ff] uppercase">{tx("CHỦ ĐỘNG", "OUTBOUND")}</p>
              <ul className="mt-2 space-y-2 text-sm text-[#0b1020]/78">
                <li>{tx("Thư viện quảng cáo", "Ads library")}</li>
                <li>{tx("Bình luận TikTok", "TikTok comments")}</li>
                <li>{tx("Nhóm Zalo / Facebook", "Zalo / Facebook groups")}</li>
                <li>{tx("Người quen và mạng lưới", "Network and relationships")}</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-[#d6f2ea] bg-[#f2fbf9] p-4">
              <p className="text-xs font-semibold tracking-[0.16em] text-[#0f766e] uppercase">{tx("THU HÚT TỰ NHIÊN", "INBOUND")}</p>
              <ul className="mt-2 space-y-2 text-sm text-[#0b1020]/78">
                <li>{tx("Post cá nhân 1-2 lần/tuần", "Personal posts 1-2 times/week")}</li>
                <li>{tx("Video ngắn theo nỗi đau thực tế", "Short videos based on real pain")}</li>
                <li>{tx("Bình luận có giá trị", "Valuable comments")}</li>
                <li>{tx("Xây thương hiệu founder / leader", "Founder / leader branding")}</li>
              </ul>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
