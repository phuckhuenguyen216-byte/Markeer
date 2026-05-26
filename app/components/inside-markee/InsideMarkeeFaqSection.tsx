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
      question: tx("ĐÂY LÀ MỘT CÔNG TY HAY NHIỀU CÔNG TY?", "IS THIS ONE COMPANY OR MULTIPLE COMPANIES?"),
      intro: tx("Về mặt cấu trúc, mỗi hệ sinh thái có:", "Structurally, each ecosystem has:"),
      points: [
        tx("vai trò riêng", "its own role"),
        tx("thị trường riêng", "its own market"),
        tx("định hướng riêng", "its own direction"),
      ],
      outro: tx(
        "Tuy vậy, tư duy chiến lược vẫn kết nối để tạo lợi thế dài hạn.",
        "Strategic thinking remains connected to build long-term advantage."
      ),
    },
    {
      id: "02",
      question: tx("TẠI SAO KHÔNG XÂY SAAS TỪ ĐẦU?", "WHY NOT BUILD SAAS FROM DAY ONE?"),
      intro: tx("Hệ sinh thái cần:", "The ecosystem wants to:"),
      points: [
        tx("hiểu quy trình thật", "understand real workflows"),
        tx("xác thực nỗi đau thật", "validate real pain"),
        tx("xây hệ thống từ thực tế", "build systems from reality"),
      ],
      outro: tx(
        "Service không phải giải pháp tạm. Đó là nơi team học vận hành thật.",
        "Service is not a temporary workaround. It is where the team learns real operations."
      ),
    },
    {
      id: "03",
      question: tx("MARKEE LÀ AI COMPANY HAY MARKETING AGENCY?", "IS MARKEE AN AI COMPANY OR A MARKETING AGENCY?"),
      intro: tx("AI chỉ là công cụ. Marketing chỉ là một lớp.", "AI is a tool. Marketing is one layer."),
      points: [
        tx(
          "Thứ hệ sinh thái đang xây là hệ thống tăng trưởng và vận hành.",
          "What we build is growth and operational systems."
        ),
      ],
    },
    {
      id: "04",
      question: tx("CLOUDGATE LIÊN QUAN GÌ ĐẾN MARKEE?", "HOW IS CLOUDGATE RELATED TO MARKEE?"),
      intro: tx("Cloudgate giúp hệ sinh thái xây:", "Cloudgate helps build:"),
      points: [
        tx("năng lực doanh nghiệp", "enterprise capability"),
        tx("kiến thức hạ tầng", "infrastructure knowledge"),
        tx("chiều sâu kỹ thuật", "technical depth"),
        tx("uy tín dài hạn", "long-term credibility"),
      ],
    },
    {
      id: "05",
      question: tx("GODANANG LÀ PROJECT PHỤ HAY BUSINESS THẬT?", "IS GODANANG A SIDE PROJECT OR A REAL BUSINESS?"),
      intro: tx("GoDanang là business thật. Nó tồn tại để:", "GoDanang is a real business. It exists to:"),
      points: [
        tx("kiểm thử hệ thống", "test systems"),
        tx("xác thực quy trình", "validate workflows"),
        tx("xây tình huống thực tế ngành lưu trú", "build hospitality case studies"),
      ],
    },
    {
      id: "06",
      question: tx("SECURITYZONE CÓ PHẢI CHỈ LÀ KÊNH BÁN HÀNG?", "IS SECURITYZONE ONLY A SALES CHANNEL?"),
      intro: tx("Không chỉ là kênh bán hàng. SecurityZone tồn tại để:", "Not only a sales channel. SecurityZone exists to:"),
      points: [
        tx("xây niềm tin", "build trust"),
        tx("xây cộng đồng", "community"),
        tx("xây quan hệ", "relationships"),
        tx("xây ảnh hưởng dài hạn", "long-term influence"),
      ],
    },
    {
      id: "07",
      question: tx("THỰC TẬP SINH HOẶC NGƯỜI MỚI CÓ THỂ ĐÓNG GÓP GÌ?", "HOW CAN INTERNS OR NEW MEMBERS CONTRIBUTE?"),
      intro: tx(
        "Hệ sinh thái không chỉ cần chuyên gia lâu năm. Hệ sinh thái cần:",
        "The ecosystem needs more than senior experts. It needs:"
      ),
      points: [
        tx("người chịu học", "people willing to learn"),
        tx("người biết quan sát hệ thống", "observe systems"),
        tx("người cải tiến quy trình", "improve workflows"),
        tx("người đóng góp vào tăng trưởng", "contribute to growth"),
      ],
    },
    {
      id: "08",
      question: tx("KHI NÀO CHUYỂN SANG GIAI ĐOẠN 2?", "WHEN DOES THE ECOSYSTEM MOVE TO PHASE 2?"),
      intro: tx("Khi:", "When:"),
      points: [
        tx("quy trình đủ ổn định", "workflows are stable"),
        tx("chất lượng bàn giao đủ rõ", "delivery quality is clear"),
        tx("cơ hội tự động hóa đủ nhiều", "automation opportunities are rich enough"),
        tx("hệ thống đủ trưởng thành", "systems are mature enough"),
      ],
      outro: tx("Phase 1 giữ kỷ luật chốt chặn vận hành và MRR ổn định trước khi tăng tốc.", "Phase 1 enforces operational and MRR gates before acceleration."),
    },
    {
      id: "09",
      question: tx("HỆ SINH THÁI CÓ PHẢI ĐANG LÀM QUÁ NHIỀU THỨ?", "IS THE ECOSYSTEM DOING TOO MANY THINGS?"),
      intro: tx("Nếu nhìn từng hệ sinh thái riêng lẻ, có thể thấy như vậy.", "If viewed in isolation, it can look that way."),
      points: [
        tx("Nhưng ở cấp độ hệ thống, mọi thứ đều đang hỗ trợ học nhanh.", "At systems level, everything supports learning."),
        tx("tự động hóa", "automation"),
        tx("tăng trưởng", "growth"),
        tx("niềm tin", "trust"),
        tx("lợi thế vận hành", "operational advantage"),
      ],
    },
    {
      id: "10",
      question: tx("TẦM NHÌN DÀI HẠN THẬT SỰ LÀ GÌ?", "WHAT IS THE TRUE LONG-TERM VISION?"),
      intro: tx("Trong dài hạn, hệ sinh thái muốn xây:", "Long-term, the ecosystem aims to build:"),
      points: [
        tx("hệ thống có thể mở rộng", "scalable systems"),
        tx("hạ tầng vận hành", "operational infrastructure"),
        tx("các lớp tự động hóa", "automation layers"),
        tx("năng lực nền tảng", "platform capabilities"),
        tx("lợi thế hệ sinh thái tích lũy", "compound ecosystem advantage"),
      ],
    },
  ];

  const [openId, setOpenId] = useState<string>("01");

  return (
    <section className="relative overflow-hidden bg-white py-24 sm:py-28 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,92,118,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,92,118,0.08)_1px,transparent_1px)] bg-[size:58px_58px]" />
      <div className="pointer-events-none absolute left-1/2 top-[-12rem] h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,77,77,0.18)_0%,rgba(255,176,190,0.12)_38%,rgba(255,255,255,0)_78%)] blur-3xl" />

      <div className="relative mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
        <motion.p
          {...fadeUp(0)}
          className="text-center text-sm font-semibold tracking-[0.17em] text-[#0b1020]/80 uppercase"
        >
          {tx("CÂU HỎI THƯỜNG GẶP", "FAQ")}
        </motion.p>

        <motion.div {...fadeUp(0.05)} className="mx-auto mt-7 max-w-[980px] text-center">
  
          <h2 className="mt-4 text-[2.35rem] leading-[1.05] font-extrabold tracking-[-0.03em] text-[#2d0d18] sm:text-[3.35rem] lg:text-[3.8rem]">
            {tx("NHỮNG CÂU HỎI", "THE QUESTIONS")}
            <br />
            <span className="text-[#ff4d5f]">
              {tx("MỌI NGƯỜI HỎI NHIỀU NHẤT.", "PEOPLE ASK MOST.")}
            </span>
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#2d0d18]/78">
            {tx(
              "Nếu đọc tới đây, mọi người thường bắt đầu hỏi: hệ sinh thái này thật sự vận hành như thế nào?",
              "At this point people usually ask: how does this ecosystem actually operate?"
            )}
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
                    <p className="text-[0.94rem] leading-[1.4] font-bold tracking-[-0.01em] text-[#2d0d18] sm:text-[1.06rem]">
                      {item.question}
                    </p>
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

        <motion.article
          {...fadeUp(0.22)}
          className="mx-auto mt-10 w-full max-w-[1180px] rounded-[24px] border border-red-100/80 bg-[#fff9fb] p-6 sm:p-8"
        >
            <p className="text-sm font-semibold tracking-[0.16em] text-[#ff4d4d] uppercase">{tx("ĐIỀU CUỐI CÙNG", "FINAL NOTE")}</p>
            <p className="mt-4 text-[#2d0d18]/82">{tx("Không ai trong hệ sinh thái hiện tại có tất cả câu trả lời.", "No one in this ecosystem has all answers.")}</p>
            <p className="mt-3 text-[#2d0d18]/82">{tx("Đội vẫn đang:", "The team is still:")}</p>
            <p className="mt-2 text-lg font-semibold text-[#2d0d18]">
              {tx(
                "HỌC → XÂY → THỬ → SAI → CẢI TIẾN → TIẾN HÓA",
                "LEARN → BUILD → TEST → FAIL → IMPROVE → EVOLVE"
              )}
            </p>
            <p className="mt-3 text-[#2d0d18]/78">{tx("mỗi ngày.", "every day.")}</p>
        </motion.article>

        <motion.p {...fadeUp(0.3)} className="mt-7 text-center text-base leading-7 text-[#2d0d18]/82">
          {tx(
            "Nếu đọc tới đây, bạn đã hiểu gần như toàn bộ hệ sinh thái đang xây gì, vận hành như thế nào và đang đi về đâu.",
            "If you made it here, you now understand what the ecosystem builds, how it operates, and where it is heading."
          )}
        </motion.p>
      </div>
    </section>
  );
}
