"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useGrowthLocale } from "./useGrowthLocale";

export default function GrowthFaqSection() {
  const { tx } = useGrowthLocale();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqItems = [
    {
      q: tx("Intern có được nhận hoa hồng không?", "Can interns receive commission?"),
      a: tx("Có. Hệ thống reward theo đóng góp thật, không theo level.", "Yes. The system rewards real contribution, not seniority level."),
    },
    {
      q: tx("Hai người cùng biết một lead thì sao?", "What if two people know the same lead?"),
      a: tx("Ưu tiên prior relationship và discovery quality. Timestamp chỉ là tiebreaker.", "Prior relationship and discovery quality come first. Timestamp is only a tiebreaker."),
    },
    {
      q: tx("Bị overload core job thì growth KPI thế nào?", "What if core job becomes overloaded?"),
      a: tx("Core luôn ưu tiên. Khi quá tải, Growth KPI sẽ pause để bảo vệ delivery.", "Core always comes first. Under overload, Growth KPI pauses to protect delivery."),
    },
    {
      q: tx("Không thích viết content có đóng góp được không?", "Can I contribute without writing content?"),
      a: tx("Có. Bạn vẫn đóng góp qua lead discovery, referral, workflow insight hoặc delivery support.", "Yes. You can contribute through lead discovery, referrals, workflow insight, or delivery support."),
    },
    {
      q: tx("Hỏi ai về ownership và payout?", "Who handles ownership and payout questions?"),
      a: tx("Ownership/KPI: Sales Lead. Timeline và payout: Finance.", "Ownership/KPI: Sales Lead. Timeline and payout: Finance."),
    },
  ];

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-[1120px] px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="mk-eyebrow text-[#ff4d5f] uppercase">{tx("07 · FAQ", "07 · FAQ")}</p>
          <h2 className="mk-section-title mx-auto mt-3 max-w-[760px] uppercase">
            <span className="block text-[#0b1020]">{tx("HỎI NHANH, TRẢ LỜI", "QUICK QUESTIONS,")}</span>
          </h2>
        </div>

        <div className="mt-8 divide-y divide-[#ffe2e8] rounded-[22px] bg-white px-5 shadow-[0_18px_46px_-38px_rgba(15,23,42,0.48)] sm:px-7">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.q} className="py-4">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 text-left text-[1.02rem] font-semibold text-[#2b0f1d]"
                >
                  <span>{item.q}</span>
                  <span className={`text-[#ff4d5f] transition-transform ${isOpen ? "rotate-45" : "rotate-0"}`}>+</span>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="mt-2 pr-6 text-sm leading-7 text-[#0b1020]/76 sm:text-base sm:leading-7">{item.a}</p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
