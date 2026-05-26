"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, CheckCircle2, Code2, Compass, FileText, Network, Target, UserRoundSearch, Wrench } from "lucide-react";
import { useInsideMarkeeLocale } from "./useInsideMarkeeLocale";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] as const },
  viewport: { once: true, amount: 0.2 },
});

export default function InsideMarkeeTeamRolesSection() {
  const { tx } = useInsideMarkeeLocale();

  const roleCards = [
    {
      id: "01",
      label: tx("ĐẦU VÀO TĂNG TRƯỞNG", "GROWTH ENTRY"),
      title: tx("SDR / TẠO KHÁCH TIỀM NĂNG", "SDR / LEAD GENERATION"),
      accent: "text-[#ff4d4d]",
      iconBg: "bg-[#fff6f8]",
      Icon: UserRoundSearch,
      points: [tx("tìm nỗi đau vận hành", "find operational pain"), tx("tìm đúng doanh nghiệp cần hỗ trợ", "find qualified businesses"), tx("mở hội thoại", "open conversations"), tx("sàng lọc cơ hội", "qualify opportunities")],
      note: tx("SDR không chỉ nhắn hàng loạt tìm khách. Vai trò này tồn tại để phát hiện vấn đề kinh doanh thật.", "SDR is not spam. This role exists to detect real business problems."),
    },
    {
      id: "02",
      label: tx("CHẨN ĐOÁN KINH DOANH", "BUSINESS DIAGNOSIS"),
      title: tx("BÁN HÀNG / CHIẾN LƯỢC", "SALES / STRATEGY"),
      accent: "text-[#ff5b37]",
      iconBg: "bg-[#fff7f4]",
      Icon: Compass,
      points: [tx("hiểu nỗi đau", "understand pain"), tx("chẩn đoán điểm nghẽn", "diagnose bottlenecks"), tx("đề xuất hệ thống", "propose systems"), tx("gắn với kết quả kinh doanh", "connect to business outcomes")],
      note: tx("Bán hàng không chỉ là chốt hợp đồng. Vai trò này phải hiểu vận hành, hệ thống và quy trình.", "Sales is not only closing deals. Sales must understand operations, systems, and workflows."),
    },
    {
      id: "03",
      label: tx("NGƯỜI XÂY HỆ THỐNG", "SYSTEM BUILDERS"),
      title: tx("TỰ ĐỘNG HÓA / KỸ THUẬT", "AUTOMATION / TECH"),
      accent: "text-[#ff4d71]",
      iconBg: "bg-[#fff6fa]",
      Icon: Code2,
      points: [tx("xây quy trình", "build workflows"), tx("tự động hóa nội bộ", "internal automation"), tx("tích hợp hệ thống", "integrations"), tx("vận hành có thể mở rộng", "scalable operations")],
      note: tx("Vai trò này không chỉ làm công cụ. Vai trò này giúp hệ sinh thái mở rộng bền vững.", "This role is not only tooling. It helps the ecosystem scale sustainably."),
    },
    {
      id: "04",
      label: tx("LỚP NIỀM TIN", "TRUST LAYER"),
      title: tx("NỘI DUNG / TRUYỀN THÔNG", "CONTENT / MEDIA"),
      accent: "text-[#ff4d71]",
      iconBg: "bg-[#fff6fa]",
      Icon: FileText,
      points: [tx("xây niềm tin", "build trust"), tx("giải thích hệ thống", "explain systems"), tx("góc nhìn vận hành", "operational insights"), tx("độ phủ thu hút tự nhiên", "inbound visibility")],
      note: tx("Nội dung không tồn tại để câu lượt xem. Nội dung tồn tại để xây độ tin cậy.", "Content is not for farming views. It exists to build credibility."),
    },
    {
      id: "05",
      label: tx("ỔN ĐỊNH BÀN GIAO", "DELIVERY STABILITY"),
      title: tx("VẬN HÀNH", "OPERATIONS"),
      accent: "text-[#ff6a5a]",
      iconBg: "bg-[#fff9f7]",
      Icon: Wrench,
      points: [tx("giữ bàn giao ổn định", "keep delivery stable"), tx("cải tiến quy trình", "improve workflows"), tx("giảm ma sát", "reduce friction"), tx("duy trì chất lượng", "maintain quality"), tx("ghi chuẩn hệ thống", "document systems")],
      note: tx("Vận hành giữ hệ sinh thái không hỗn loạn khi mở rộng.", "Operations keeps the ecosystem from chaos while scaling."),
    },
    {
      id: "06",
      label: tx("ĐỊNH HƯỚNG & HỆ THỐNG", "DIRECTION & SYSTEMS"),
      title: tx("LÃNH ĐẠO", "LEADERSHIP"),
      accent: "text-[#ff4d4d]",
      iconBg: "bg-[#fff6f8]",
      Icon: Network,
      points: [tx("xác định hướng đi", "define direction"), tx("kết nối các hệ", "connect ecosystems"), tx("ưu tiên hệ thống", "prioritize systems"), tx("phân bổ nguồn lực", "allocate resources"), tx("xây lợi thế dài hạn", "build long-term advantage")],
      note: tx("Lãnh đạo không chỉ quản lý con người. Vai trò này tồn tại để giữ hệ sinh thái đi đúng hướng.", "Leadership is not only people management. It exists to keep ecosystem direction correct."),
    },
  ];

  const evolutionLadder = [
    tx("CHUYÊN VIÊN CAO CẤP", "SENIOR DEV"),
    tx("XÂY CHO KHÁCH THẬT", "REAL CLIENT BUILDS"),
    tx("MÔ-ĐUN ĐANG CHẠY", "WORKING MODULES"),
    tx("CHUYÊN VIÊN MỚI", "JUNIOR DEV"),
    tx("NỀN TẢNG AI MARKEE", "MARKEE AI PLATFORM"),
  ];

  return (
    <section className="relative overflow-hidden bg-white py-24 sm:py-28 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,92,118,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,92,118,0.08)_1px,transparent_1px)] bg-[size:58px_58px]" />
      <div className="pointer-events-none absolute right-[-10rem] top-[-6rem] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(255,77,77,0.2)_0%,rgba(255,176,190,0.12)_38%,rgba(255,255,255,0)_78%)] blur-3xl" />

      <div className="relative mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
        <motion.p
          {...fadeUp(0)}
          className="text-sm font-semibold tracking-[0.17em] text-[#0b1020]/80 uppercase"
        >
          {tx("VAI TRÒ ĐỘI", "TEAM ROLES")}
        </motion.p>

        <div className="mt-7 grid items-stretch gap-5 xl:grid-cols-[1.02fr_0.98fr]">
          <motion.article {...fadeUp(0.05)} className="rounded-[30px] border border-red-100/80 bg-white p-8 shadow-[0_20px_56px_-42px_rgba(15,23,42,0.5)]">
            <h2 className="mt-4 max-w-[760px] text-[2.15rem] leading-[1.05] font-extrabold tracking-[-0.03em] text-[#2d0d18] sm:text-[3.05rem] lg:text-[3.5rem]">
              <span className="block">{tx("QUY TRÌNH TRỞ THÀNH", "WORKFLOW THAT")}</span>
              <span className="block text-[#ff4d5f]">{tx("HỆ THỐNG.", "BECOMES A SYSTEM.")}</span>
            </h2>
            <p className="mt-4 max-w-[660px] text-lg leading-8 text-[#2d0d18]/78">
              {tx(
                "Mục tiêu phần này: nhìn vào vai trò là hiểu đội vận hành theo hệ thống, không theo việc rời rạc.",
                "This section maps roles as a system, not as disconnected tasks."
              )}
            </p>
            <p className="mt-8 text-xl font-semibold tracking-[0.14em] text-[#9d2a3a] uppercase">
              {tx(
                "HỌC → ĐÓNG GÓI → TÁI DÙNG → SCALE",
                "LEARN → PACKAGE → REUSE → SCALE"
              )}
            </p>
            <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {[
                tx("vai trò rõ", "role clarity"),
                tx("bàn giao sạch", "clean handover"),
                tx("quy trình lặp", "repeatable workflow"),
                tx("mở rộng có kỷ luật", "disciplined scale"),
              ].map((item) => (
                <p key={item} className="rounded-xl border border-red-100 bg-[#fff8fa] px-3 py-2 text-sm font-semibold text-[#2d0d18]/78">
                  {item}
                </p>
              ))}
            </div>
            <p className="mt-4 text-sm leading-6 text-[#2d0d18]/72">
              {tx(
                "Mỗi box phía dưới là một mắt xích bắt buộc để quy trình đi từ làm tay sang hệ thống.",
                "Each card below is a required link to turn manual work into systems."
              )}
            </p>
          </motion.article>

          <motion.article {...fadeUp(0.1)} className="imfx-edge-run rounded-[30px] border border-red-100/80 bg-[#fff9fb] p-6">
            <div className="space-y-3">
              {evolutionLadder.map((item, index) => (
                <div key={item}>
                  <div className={`imfx-diagram-float imfx-diagram-step-${index + 1} flex items-center justify-between rounded-2xl border border-red-100 bg-white px-4 py-3`}>
                    <p className="text-xl font-bold tracking-[0.08em] text-[#7f3b45] uppercase">{item}</p>
                    <Target className="h-5 w-5 text-[#ff6b7f]" />
                  </div>
                  {index !== evolutionLadder.length - 1 ? (
                    <div className="flex justify-center py-2">
                      <ArrowDown className="h-4 w-4 text-[#ff95a5]" />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </motion.article>
        </div>

      
          

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {roleCards.map((role, index) => {
            const Icon = role.Icon;
            return (
              <motion.article key={role.id} {...fadeUp(0.24 + index * 0.03)} className={`imfx-role-trace imfx-diagram-step-${index + 1} flex h-full flex-col rounded-[22px] border border-red-100/80 bg-white p-5 shadow-[0_16px_42px_-34px_rgba(15,23,42,0.5)]`}>
                <div className="flex items-center gap-2 text-sm font-semibold tracking-[0.11em] uppercase">
                  <span className={role.accent}>{role.label}</span>
                </div>
                <div className="mt-3.5 flex items-start gap-3">
                  <span className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-red-100 ${role.iconBg}`}>
                    <Icon className={`h-5 w-5 ${role.accent}`} />
                  </span>
                  <h3 className="text-[1.34rem] leading-[1.14] font-bold tracking-[-0.02em] text-[#2d0d18] sm:text-[1.5rem]">{role.title}</h3>
                </div>
                <ul className="mt-3.5 min-h-[136px] space-y-2 text-[#2d0d18]/82">
                  {role.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#ff4d4d]" />
                      {point}
                    </li>
                  ))}
                </ul>
                <p className="mt-auto rounded-xl border border-red-100 bg-[#fff8fa] px-3.5 py-2.5 text-[0.92rem] leading-6 text-[#2d0d18]/78">{role.note}</p>
              </motion.article>
            );
          })}
        </div>

        <motion.article {...fadeUp(0.44)} className="mt-8 rounded-[26px] border border-red-100/80 bg-white p-6">
          <p className="text-sm font-semibold tracking-[0.16em] text-[#ff4d4d] uppercase">{tx("SƠ ĐỒ LIÊN KẾT VAI TRÒ", "ROLE CONNECT MAP")}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr] sm:items-center">
            {[
              tx("TĂNG TRƯỞNG", "GROWTH"),
              tx("BÁN HÀNG", "SALES"),
              tx("VẬN HÀNH", "OPS"),
              tx("TỰ ĐỘNG HÓA", "AUTOMATION"),
              tx("HỆ THỐNG", "SYSTEMS"),
              tx("BÀN GIAO", "DELIVERY"),
            ].map((item, index, arr) => (
              <div key={item} className="contents">
                <p className={`imfx-diagram-float imfx-diagram-step-${index + 1} rounded-xl border border-red-100 bg-[#fff8fa] px-3 py-2 text-center text-sm font-semibold text-[#7f3b45]`}>{item}</p>
                {index !== arr.length - 1 ? (
                  <div className="hidden sm:flex sm:justify-center">
                    <ArrowRight className="h-4 w-4 text-red-300" />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          <p className="mt-4 rounded-xl border border-red-100 bg-[#fff8fa] px-4 py-3 text-sm leading-6 text-[#2d0d18]/78">
            {tx(
              "Thiếu một lớp, hệ sinh thái sẽ nghẽn và mất tốc độ mở rộng.",
              "If one layer is missing, the ecosystem bottlenecks and loses scale speed."
            )}
          </p>
        </motion.article>

        <motion.p {...fadeUp(0.5)} className="mt-7 text-center text-base leading-7 text-[#2d0d18]/82">
          {tx("Khi vai trò đã rõ và kết nối tốt, thứ tiếp theo quyết định tốc độ phát triển là văn hóa.", "When roles are clear and connected, the next speed lever is culture.")}
        </motion.p>
      </div>
    </section>
  );
}
