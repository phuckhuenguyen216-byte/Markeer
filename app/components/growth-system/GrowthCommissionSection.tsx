"use client";

import GrowthSectionTitle from "./GrowthSectionTitle";
import { useGrowthLocale } from "./useGrowthLocale";

export default function GrowthCommissionSection() {
  const { tx } = useGrowthLocale();

  const commissionRoles = [
    tx("CHỦ LEAD", "LEAD OWNER"),
    tx("NGƯỜI CHỐT", "CLOSER"),
    tx("BÀN GIAO", "DELIVERY"),
    tx("HỖ TRỢ TĂNG TRƯỞNG", "GROWTH SUPPORT"),
  ];
  const submissionSteps = [
    tx("Tìm prospect và ghi: Tên + SĐT + ngành + nỗi đau cụ thể.", "Find prospects and record: Name + Phone + Industry + specific pain."),
    tx("Submit ngay vào nhóm Sales theo format chuẩn.", "Submit immediately to Sales group using the standard format."),
    tx("Sales Lead log CRM trong 24h.", "Sales Lead logs CRM within 24h."),
    tx("Chờ close + xác nhận thanh toán để mở reward.", "Wait for close + payment confirmation to unlock reward."),
  ];

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <GrowthSectionTitle label={tx("CÁCH COMMISSION VẬN HÀNH", "HOW COMMISSION WORKS")} title={tx("TẠI SAO HỆ SINH THÁI CÓ INCENTIVE TĂNG TRƯỞNG?", "WHY DOES THE ECOSYSTEM HAVE GROWTH INCENTIVES?")} />

        <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <article className="rounded-[24px] border border-[#ffdbe3] bg-white p-6">
            <p className="text-base leading-7 text-[#0b1020]/78">
              {tx("Nếu ai đó tạo giá trị thật, giúp hệ sinh thái tăng trưởng, hoặc mở ra cơ hội thật thì hệ sinh thái cần reward đóng góp đó.", "If someone creates real value, helps ecosystem growth, or opens real opportunities, the ecosystem should reward that contribution.")}
            </p>
            <p className="mt-4 text-sm font-semibold tracking-[0.13em] text-[#ff4d5f] uppercase">{tx("COMMISSION KHÔNG TỒN TẠI ĐỂ", "COMMISSION DOES NOT EXIST TO")}</p>
            <ul className="mt-2 space-y-2 text-sm text-[#0b1020]/78">
              <li>{tx("tạo cạnh tranh nội bộ,", "create internal competition,")}</li>
              <li>{tx("biến hệ sinh thái thành culture chỉ bán hàng,", "turn the ecosystem into a sales-only culture,")}</li>
              <li>{tx("khuyến khích spam lead chất lượng thấp.", "encourage low-quality lead spam.")}</li>
            </ul>
            <p className="mt-5 rounded-2xl border border-[#ffdbe3] bg-[#fff7fa] px-4 py-3 text-lg font-bold text-[#2b0f1d] uppercase">
              {tx("MỤC TIÊU LÀ: ĐỒNG BỘ INCENTIVE VỚI TĂNG TRƯỞNG HỆ SINH THÁI.", "THE GOAL IS: ALIGN INCENTIVES WITH ECOSYSTEM GROWTH.")}
            </p>
          </article>

          <article className="rounded-[24px] border border-[#dce6ff] bg-[#f8faff] p-6">
            <p className="text-xs font-semibold tracking-[0.16em] text-[#23427a] uppercase">{tx("GIÁ TRỊ ĐÓNG GÓP → REWARD HỆ SINH THÁI", "CONTRIBUTION VALUE → ECOSYSTEM REWARD")}</p>
            <div className="mt-3 space-y-2.5">
              {commissionRoles.map((role) => (
                <div key={role} className="rounded-xl border border-[#cfe0ff] bg-white px-3 py-2 text-sm font-semibold text-[#0b1020]">{role}</div>
              ))}
            </div>
            <p className="mt-4 text-sm leading-6 text-[#0b1020]/72">
              {tx("Tỷ lệ % chi tiết không công khai trong tài liệu này. Mỗi version policy có thể thay đổi theo phase scale của công ty.", "Detailed % rates are not public in this document. Each policy version may change by company scale phase.")}
            </p>
          </article>
        </div>

        <article className="mt-6 rounded-[24px] border border-[#dce2f0] bg-white p-6">
          <p className="text-sm font-semibold tracking-[0.14em] text-[#23427a] uppercase">{tx("LEAD OWNERSHIP VÀ LUỒNG SUBMIT", "LEAD OWNERSHIP AND SUBMISSION FLOW")}</p>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-[#e5eaf6] bg-[#fbfcff] p-4">
              <p className="font-semibold text-[#0b1020] uppercase">{tx("RULE ƯU TIÊN", "PRIORITY RULES")}</p>
              <ul className="mt-2 space-y-2 text-sm text-[#0b1020]/78">
                <li>L1: {tx("Quan hệ trước đó", "Prior relationship")}</li>
                <li>L2: {tx("Chất lượng khám phá", "Discovery quality")}</li>
                <li>L3: CRM Timestamp ({tx("phân xử", "tiebreaker")})</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-[#e5eaf6] bg-[#fbfcff] p-4">
              <p className="font-semibold text-[#0b1020] uppercase">{tx("4 BƯỚC SUBMIT LEAD", "4 LEAD SUBMISSION STEPS")}</p>
              <ol className="mt-2 space-y-2 text-sm text-[#0b1020]/78">
                {submissionSteps.map((step, index) => (
                  <li key={step}>{index + 1}. {step}</li>
                ))}
              </ol>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
