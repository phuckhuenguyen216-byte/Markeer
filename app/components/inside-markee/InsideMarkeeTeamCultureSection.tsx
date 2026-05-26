"use client";

import { motion } from "framer-motion";
import { AlertTriangle, CalendarClock, FileText, Megaphone, ShieldCheck, Target, UserRound, Users, Wrench, XCircle } from "lucide-react";
import { useInsideMarkeeLocale } from "./useInsideMarkeeLocale";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] as const },
  viewport: { once: true, amount: 0.2 },
});

export default function InsideMarkeeTeamCultureSection() {
  const { tx } = useInsideMarkeeLocale();

  const alwaysDo = [
    { title: tx("BÁN KẾT QUẢ", "SELL OUTCOMES"), text: tx("Bán kết quả, không bán từ ngữ hào nhoáng.", "Sell outcomes, not buzzwords."), Icon: Target },
    { title: tx("HỌC LIÊN TỤC", "LEARN CONTINUOUSLY"), text: tx("Ghi lại bài học, cải tiến quy trình, chuẩn hóa hệ thống.", "Log learning, improve workflows, document systems."), Icon: FileText },
    { title: tx("XÂY NIỀM TIN", "BUILD TRUST"), text: tx("Niềm tin quan trọng hơn hiệu ứng ngắn hạn.", "Trust matters more than short-term hype."), Icon: ShieldCheck },
    { title: tx("CẢI TIẾN HỆ THỐNG", "IMPROVE SYSTEMS"), text: tx("Nếu workflow có thể tốt hơn, team sẽ nâng cấp ngay.", "If workflows can improve, the team upgrades them."), Icon: Wrench },
    { title: tx("TƯ DUY DÀI HẠN", "THINK LONG-TERM"), text: tx("Không tối ưu cho cảm xúc ngắn hạn.", "Do not optimize for short-term dopamine."), Icon: CalendarClock },
    { title: tx("HỖ TRỢ HỆ SINH THÁI", "HELP THE ECOSYSTEM"), text: tx("Mỗi người đang đóng góp vào thứ lớn hơn task hiện tại.", "Everyone contributes to something larger than a single task."), Icon: Users },
  ];

  const neverDo = [
    { title: tx("AI HÀO NHOÁNG GIẢ", "FAKE AI BUZZWORDS"), text: tx("Không dùng AI chỉ để tiếp thị cho có vẻ tương lai.", "Do not use AI as fake futuristic marketing."), Icon: AlertTriangle },
    { title: tx("HỨA QUÁ MỨC", "OVERPROMISE"), text: tx("Không hứa thứ team không thể bàn giao.", "Do not promise what the team cannot deliver."), Icon: XCircle },
    { title: tx("TĂNG TRƯỞNG KIỂU SPAM", "SPAM GROWTH"), text: tx("Không tăng trưởng bằng spam hoặc tương tác giả.", "Do not build growth via spam or fake engagement."), Icon: Megaphone },
    { title: tx("TÙY BIẾN GÂY HỖN LOẠN", "CUSTOM CHAOS"), text: tx("Không nhận mọi yêu cầu nếu nó phá hệ thống.", "Do not accept custom requests that break systems."), Icon: Wrench },
    { title: tx("TƯ DUY NGẮN HẠN", "SHORT-TERM THINKING"), text: tx("Không chỉ tối ưu cho doanh thu ngắn hạn.", "Do not optimize only for short-term revenue."), Icon: CalendarClock },
    { title: tx("VĂN HÓA CÁI TÔI", "EGO-FIRST CULTURE"), text: tx("Hệ thống quan trọng hơn cái tôi cá nhân.", "Systems matter more than individual ego."), Icon: UserRound },
  ];

  const principles = [
    { id: "01", title: tx("TỐC ĐỘ ƯU TIÊN HƠN CẦU TOÀN", "SPEED OVER PERFECTION"), text: tx("Di chuyển nhanh, lặp nhanh, cải tiến liên tục.", "Move fast, iterate fast, improve continuously.") },
    { id: "02", title: tx("THỰC TẾ QUAN TRỌNG HƠN GIẢ ĐỊNH", "REALITY OVER ASSUMPTIONS"), text: tx("Thực tế luôn thắng lý thuyết.", "Reality beats theory.") },
    { id: "03", title: tx("ĐƠN GIẢN MỚI MỞ RỘNG ĐƯỢC", "SIMPLICITY SCALES"), text: tx("Hệ thống đơn giản mở rộng tốt hơn hệ thống quá phức tạp.", "Simple systems scale better than over-complex systems.") },
    { id: "04", title: tx("RÕ RÀNG TRƯỚC KHI TỰ ĐỘNG HÓA", "CLARITY BEFORE AUTOMATION"), text: tx("Quy trình chưa rõ thì tự động hóa chỉ tạo hỗn loạn.", "If workflows are unclear, automation adds chaos.") },
    { id: "05", title: tx("LỢI THẾ DÀI HẠN SẼ TÍCH LŨY", "LONG-TERM ADVANTAGE COMPOUNDS"), text: tx("Những thứ build đúng sẽ tích lũy theo thời gian.", "Well-built systems compound over time.") },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fff8fb] via-white to-[#fff7f7] py-24 sm:py-28 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,92,118,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,92,118,0.08)_1px,transparent_1px)] bg-[size:58px_58px]" />
      <div className="pointer-events-none absolute right-[-10rem] top-[-6rem] h-[31rem] w-[31rem] rounded-full bg-[radial-gradient(circle,rgba(255,77,77,0.2)_0%,rgba(255,176,190,0.12)_38%,rgba(255,255,255,0)_78%)] blur-3xl" />

      <div className="relative mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
        <motion.p
          {...fadeUp(0)}
          className="text-center text-sm font-semibold tracking-[0.17em] text-[#0b1020]/80 uppercase"
        >
          {tx("VĂN HÓA ĐỘI", "TEAM CULTURE")}
        </motion.p>

        <motion.div {...fadeUp(0.05)} className="mx-auto mt-7 max-w-[1240px] text-center">
          <h2 className="mt-4 text-[1.95rem] leading-[1.06] font-extrabold tracking-[-0.03em] text-[#2d0d18] sm:text-[2.75rem] lg:text-[3.3rem]">
            <span className="block">
              {tx("VĂN HÓA KHÔNG PHẢI KHẨU HIỆU.", "CULTURE IS NOT A SLOGAN.")}
            </span>
            <span className="block text-[#ff4d5f]">
              {tx("VĂN HÓA LÀ CÁCH ĐỘI RA QUYẾT ĐỊNH.", "IT IS HOW THE TEAM DECIDES.")}
            </span>
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#2d0d18]/78">
            {tx(
              "Hệ thống và tự động hóa rất quan trọng. Nhưng nếu văn hóa sai, mọi hệ thống rồi cũng sẽ đổ vỡ.",
              "Systems and automation matter. But if culture is wrong, every system eventually breaks down."
            )}
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              tx("RÕ RÀNG", "CLARITY"),
              tx("TRÁCH NHIỆM", "OWNERSHIP"),
              tx("KỶ LUẬT", "DISCIPLINE"),
            ].map((tag) => (
              <span
                key={tag}
                className="rounded-xl border border-red-100 bg-[#fff8fa] px-3 py-2 text-center text-sm font-semibold tracking-[0.08em] text-[#8f2f3f]"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        <div className="mt-10 grid gap-5 xl:grid-cols-2">
          <motion.article {...fadeUp(0.16)} className="rounded-[24px] border border-red-100/80 bg-white p-6">
            <p className="text-sm font-semibold tracking-[0.16em] text-[#ff4d4d] uppercase">{tx("THỨ BỌN MÌNH LUÔN LÀM", "WHAT WE ALWAYS DO")}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {alwaysDo.map((item) => {
                const Icon = item.Icon;
                return (
                  <div key={item.title} className="rounded-2xl border border-red-100 bg-[#fffafb] p-4">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-red-100 bg-white text-[#ff4d4d]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <p className="mt-3 text-xl font-bold text-[#2d0d18]">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-[#2d0d18]/76">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </motion.article>

          <motion.article {...fadeUp(0.2)} className="rounded-[24px] border border-red-100/80 bg-[#fff9fa] p-6">
            <p className="text-sm font-semibold tracking-[0.16em] text-[#ff4d4d] uppercase">{tx("THỨ BỌN MÌNH KHÔNG LÀM", "WHAT WE NEVER DO")}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {neverDo.map((item) => {
                const Icon = item.Icon;
                return (
                  <div key={item.title} className="rounded-2xl border border-red-100 bg-white p-4">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-red-100 bg-[#fff8fa] text-[#ff4d4d]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <p className="mt-3 text-xl font-bold text-[#2d0d18]">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-[#2d0d18]/76">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </motion.article>
        </div>

        <motion.article {...fadeUp(0.26)} className="mt-9 rounded-[28px] border border-red-100/80 bg-white p-6 sm:p-8">
          <p className="text-sm font-semibold tracking-[0.16em] text-[#ff4d4d] uppercase">
            {tx("NGUYÊN TẮC VẬN HÀNH", "OPERATING PRINCIPLES")}
          </p>
          <div className="mt-4 divide-y divide-red-100">
            {principles.map((item) => (
              <div key={item.id} className="grid gap-3 py-4 sm:grid-cols-[24px_1fr_1.1fr]">
                <span className="mt-2 inline-flex h-2.5 w-2.5 rounded-full bg-[#ff4d4d]" />
                <p className="text-lg font-semibold text-[#2d0d18]">{item.title}</p>
                <p className="text-sm leading-6 text-[#2d0d18]/76">{item.text}</p>
              </div>
            ))}
          </div>
        </motion.article>

        <div className="mt-8 grid gap-5 xl:grid-cols-[1fr_1fr]">
          <motion.article {...fadeUp(0.32)} className="rounded-[24px] border border-red-100/80 bg-gradient-to-br from-[#fff7fa] via-white to-[#fff3f6] p-7">
            <p className="text-[2.5rem] leading-[1.1] font-extrabold tracking-[-0.03em] text-[#2d0d18] sm:text-[3.2rem]">
              {tx("HỆ THỐNG MỚI MỞ RỘNG ĐƯỢC.", "SYSTEMS SCALE.")}
              <br />
              <span className="text-[#ff4d5f]">{tx("NIỀM TIN SẼ TÍCH LŨY.", "TRUST COMPOUNDS.")}</span>
            </p>
            <p className="mt-4 text-base leading-7 text-[#2d0d18]/78">
              {tx(
                "Nhiều startup không chết vì thiếu năng lực. Họ chết vì văn hóa đổ vỡ và hệ thống mất kỷ luật.",
                "Many startups do not fail from talent gaps. They fail from culture breakdown and weak system discipline."
              )}
            </p>
          </motion.article>

          <motion.article {...fadeUp(0.36)} className="rounded-[24px] border border-red-100/80 bg-white p-7">
            <p className="text-sm font-semibold tracking-[0.16em] text-[#ff4d4d] uppercase">{tx("ĐIỀU QUAN TRỌNG", "IMPORTANT")}</p>
            <p className="mt-4 text-base leading-7 text-[#2d0d18]/82">
              {tx(
                "Văn hóa không được viết ra một lần rồi tự tồn tại. Nó được định hình mỗi ngày bởi giao tiếp, quyết định và hành vi.",
                "Culture is not written once and self-sustained. It is shaped daily through communication, decisions, and behavior."
              )}
            </p>
            <p className="mt-4 rounded-xl border border-red-100 bg-[#fff8fa] px-4 py-3 text-sm leading-6 text-[#2d0d18]/78">
              {tx(
                "Đó là lý do team bảo vệ sự rõ ràng, niềm tin, tinh thần trách nhiệm và tư duy hệ thống ngay cả khi tăng trưởng nhanh.",
                "That is why the team protects clarity, trust, ownership, and systems thinking even in fast growth phases."
              )}
            </p>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
