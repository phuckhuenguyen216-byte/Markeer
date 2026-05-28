"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useInsideMarkeeLocale } from "./useInsideMarkeeLocale";

type FaqItem = {
  id: string;
  question: string;
  intro: string;
  points: string[];
  outro?: string;
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] as const },
  viewport: { once: true, amount: 0.2 },
});

export default function InsideMarkeeFaqSection() {
  const { tx } = useInsideMarkeeLocale();

  const faqItems: FaqItem[] = [
    {
      id: "01",
      question: tx("Đây là một công ty hay nhiều công ty?", "Is this one company or multiple companies?"),
      intro: tx("Về mặt cấu trúc, mỗi hệ sinh thái có:", "Structurally, each ecosystem has:"),
      points: [
        tx("Vai trò riêng.", "Its own role."),
        tx("Thị trường riêng.", "Its own market."),
        tx("Định hướng riêng.", "Its own direction."),
      ],
      outro: tx("Tuy vậy, tư duy chiến lược vẫn kết nối để tạo lợi thế dài hạn.", "Strategic thinking remains connected to build long-term advantage."),
    },
    {
      id: "02",
      question: tx("Tại sao không xây SaaS từ đầu?", "Why not build SaaS from day one?"),
      intro: tx("Hệ sinh thái cần:", "The ecosystem wants to:"),
      points: [
        tx("Hiểu quy trình thật.", "Understand real workflows."),
        tx("Xác thực nỗi đau thật.", "Validate real pain."),
        tx("Xây hệ thống từ thực tế.", "Build systems from reality."),
      ],
      outro: tx("Service không phải giải pháp tạm. Đó là nơi team học vận hành thật.", "Service is not a temporary workaround. It is where the team learns real operations."),
    },
    {
      id: "03",
      question: tx("Markee là AI company hay marketing agency?", "Is Markee an AI company or a marketing agency?"),
      intro: tx("AI chỉ là công cụ. Marketing chỉ là một lớp.", "AI is a tool. Marketing is one layer."),
      points: [tx("Thứ hệ sinh thái đang xây là hệ thống tăng trưởng và vận hành.", "What we build is growth and operational systems.")],
    },
    {
      id: "06",
      question: tx("SecurityZone có phải chỉ là kênh bán hàng?", "Is SecurityZone only a sales channel?"),
      intro: tx("Không chỉ là kênh bán hàng. SecurityZone tồn tại để:", "Not only a sales channel. SecurityZone exists to:"),
      points: [
        tx("Xây niềm tin.", "Build trust."),
        tx("Xây cộng đồng.", "Community."),
        tx("Xây quan hệ.", "Relationships."),
        tx("Xây ảnh hưởng dài hạn.", "Long-term influence."),
      ],
    },
    {
      id: "07",
      question: tx("Thực tập sinh hoặc người mới có thể đóng góp gì?", "How can interns or new members contribute?"),
      intro: tx("Hệ sinh thái không chỉ cần chuyên gia lâu năm. Hệ sinh thái cần:", "The ecosystem needs more than senior experts. It needs:"),
      points: [
        tx("Người chịu học.", "People willing to learn."),
        tx("Người biết quan sát hệ thống.", "Observe systems."),
        tx("Người cải tiến quy trình.", "Improve workflows."),
        tx("Người đóng góp vào tăng trưởng.", "Contribute to growth."),
      ],
    },
    {
      id: "08",
      question: tx("Khi nào chuyển sang giai đoạn 2?", "When does the ecosystem move to phase 2?"),
      intro: tx("Khi:", "When:"),
      points: [
        tx("Quy trình đủ ổn định.", "Workflows are stable."),
        tx("Chất lượng bàn giao đủ rõ.", "Delivery quality is clear."),
        tx("Cơ hội tự động hóa đủ nhiều.", "Automation opportunities are rich enough."),
        tx("Hệ thống đủ trưởng thành.", "Systems are mature enough."),
      ],
      outro: tx("Phase 1 giữ kỷ luật chốt chặn vận hành và MRR ổn định trước khi tăng tốc.", "Phase 1 enforces operational and MRR gates before acceleration."),
    },
  ];

  const [openId, setOpenId] = useState<string>("01");

  return (
    <section className="relative overflow-hidden bg-white py-24 sm:py-28 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,92,118,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,92,118,0.08)_1px,transparent_1px)] bg-[size:58px_58px]" />
      <div className="pointer-events-none absolute left-1/2 top-[-12rem] h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,77,77,0.18)_0%,rgba(255,176,190,0.12)_38%,rgba(255,255,255,0)_78%)] blur-3xl" />

      <div className="relative mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
        <motion.p {...fadeUp(0)} className="mk-eyebrow text-center text-[#0b1020]/80 uppercase">
          {tx("CÂU HỎI THƯỜNG GẶP", "FAQ")}
        </motion.p>

        <motion.div {...fadeUp(0.05)} className="mx-auto mt-7 max-w-[980px] text-center">
          <h2 className="mk-section-title mt-4 text-[#2d0d18]">
            {tx("NHỮNG CÂU HỎI", "THE QUESTIONS")}
            <br />
            <span className="mk-section-title-accent text-[#ff4d5f]">{tx("MỌI NGƯỜI HỎI NHIỀU NHẤT.", "PEOPLE ASK MOST.")}</span>
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#2d0d18]/78">
            {tx("Nếu đọc tới đây, mọi người thường bắt đầu hỏi: hệ sinh thái này thật sự vận hành như thế nào?", "At this point people usually ask: how does this ecosystem actually operate?")}
          </p>
        </motion.div>

        <motion.div {...fadeUp(0.16)} className="mt-10 space-y-4">
          {faqItems.map((item) => {
            const active = openId === item.id;
            return (
              <article
                key={item.id}
                className={`rounded-[28px] border bg-white transition-all duration-300 ${
                  active ? "border-red-200 shadow-[0_24px_65px_-44px_rgba(255,77,77,0.65)]" : "border-red-100/80 hover:border-red-200 hover:shadow-[0_18px_50px_-42px_rgba(255,77,77,0.45)]"
                }`}
              >
                <button type="button" onClick={() => setOpenId(active ? "" : item.id)} className="flex w-full items-center justify-between gap-4 px-6 py-6 text-left sm:px-8">
                  <div className="flex items-start">
                    <p className="text-[0.94rem] leading-[1.4] font-bold tracking-[-0.01em] text-[#2d0d18] sm:text-[1.06rem]">{item.question}</p>
                  </div>
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-red-100 bg-[#fff8fa] text-[#ff4d4d]">
                    {active ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {active && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
                      <div className="border-t border-red-100/80 px-6 pb-7 pt-5 sm:px-8">
                        <p className="text-base leading-7 text-[#2d0d18]/78">{item.intro}</p>
                        <ul className="mt-2 space-y-1.5 text-[#2d0d18]/76">
                          {item.points.map((point) => (
                            <li key={point} className="flex items-start gap-2.5">
                              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-red-400" />
                              {point}
                            </li>
                          ))}
                        </ul>
                        {item.outro ? <p className="mt-3 text-base leading-7 text-[#2d0d18]/78">{item.outro}</p> : null}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </article>
            );
          })}
        </motion.div>

        <motion.p {...fadeUp(0.3)} className="mt-7 text-center text-base leading-7 text-[#2d0d18]/82">
          {tx("Nếu đọc tới đây, bạn đã hiểu gần như toàn bộ hệ sinh thái đang xây gì, vận hành như thế nào và đang đi về đâu.", "If you made it here, you now understand what the ecosystem builds, how it operates, and where it is heading.")}
        </motion.p>
      </div>
    </section>
  );
}
