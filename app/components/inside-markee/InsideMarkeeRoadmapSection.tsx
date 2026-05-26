"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ChefHat,
  Flame,
  Rocket,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { useInsideMarkeeLocale } from "./useInsideMarkeeLocale";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] as const },
  viewport: { once: true, amount: 0.2 },
});

export default function InsideMarkeeRoadmapSection() {
  const { tx } = useInsideMarkeeLocale();


  const currentWork = [
    tx("chạy ads & tối ưu", "run ads and optimize"),
    tx("trả lời inbox & chăm sóc khách hàng", "reply inbox and support clients"),
    tx("xây website", "build websites"),
    tx("viết nội dung", "write content"),
    tx("thiết lập tự động hóa", "set up automation"),
    tx("làm báo cáo", "make reports"),
    tx("hỗ trợ khách hàng thật", "support real clients"),
  ];

  const currentImportant = [
    tx("hiểu quy trình thật", "understand real workflows"),
    tx("hiểu nỗi đau thật", "understand real pain"),
    tx("tạo doanh thu thật", "generate real revenue"),
    tx("học từ từng khách hàng", "learn from each client"),
    tx("tự động hóa từng chút một", "automate step by step"),
  ];

  const notThis = [
    tx("hào nhoáng AI", "AI hype"),
    tx("ảo tưởng SaaS", "SaaS fantasy"),
    tx("xây thứ quá xa thực tế hiện tại", "build only for far-future fantasy"),
    tx("mở rộng khi chưa chạy ổn", "scale before things truly work"),
  ];

  const disciplineNegative = [
    tx("Không xây SaaS quá sớm", "Do not build SaaS too early"),
    tx("Không mở rộng bằng nhân sự", "Do not scale by headcount"),
    tx("Không chuyển giai đoạn khi quy trình chưa ổn định", "Do not move phase when workflows are unstable"),
  ];

  const disciplinePositive = [
    tx("ưu tiên hệ thống", "Systems first"),
    tx("ưu tiên khả năng lặp lại", "Repeatability first"),
    tx("ưu tiên tăng trưởng bền vững", "Sustainable growth first"),
  ];

  const infraFlow = [
    tx("Con người", "People"),
    tx("Quy trình", "Processes"),
    tx("Hệ thống", "Systems"),
    tx("Tự động hóa", "Automation"),
    tx("Hạ tầng có thể mở rộng", "Scalable Infrastructure"),
  ];

  const phaseCards = [
    {
      icon: Rocket,
      title: "Phase 2",
      subtitle: tx("MỞ RỘNG TỰ ĐỘNG HÓA", "Automation Expansion"),
      timeline: tx("Tháng 7 → Tháng 12", "Month 7 → Month 12"),
      bullets: [
        tx("hệ thống tái sử dụng", "reusable systems"),
        tx("tự động hóa onboarding", "onboarding automation"),
        tx("bàn giao có AI hỗ trợ", "AI-assisted delivery"),
        tx("chuẩn hóa vận hành", "operational standardization"),
      ],
    },
    {
      icon: TrendingUp,
      title: "Phase 3",
      subtitle: tx("NỀN TẢNG & MỞ RỘNG", "Platform & Scale"),
      timeline: tx("Tháng 13 → Tháng 24", "Month 13 → Month 24"),
      bullets: [
        tx("các lớp SaaS", "SaaS layers"),
        tx("onboarding tự phục vụ", "self-service onboarding"),
        tx("mở rộng đa ngành", "multi-industry expansion"),
        tx("tăng trưởng doanh nghiệp", "enterprise growth"),
      ],
    },
    {
      icon: Sparkles,
      title: "Phase 4",
      subtitle: tx("HỆ SINH THÁI HOÀN CHỈNH", "Complete Ecosystem"),
      timeline: tx("Tháng 24+", "Month 24+"),
      bullets: [
        tx("flywheel hệ sinh thái", "ecosystem flywheel"),
        tx("giáo dục + phân phối", "education + distribution"),
        tx("hạ tầng có thể mở rộng", "scalable infrastructure"),
        tx("vận hành ưu tiên tự động hóa", "automation-first operations"),
      ],
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#fff9fb] py-24 sm:py-28 lg:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[36rem] sm:h-[40rem] lg:h-[45rem]">
        <Image
          src="/bg6.png"
          alt="Roadmap background"
          fill
          className="object-cover object-right-top scale-[1.02] opacity-[0.98] saturate-120 contrast-110"
        />
        <div className="absolute inset-0 bg-[linear-gradient(102deg,rgba(255,255,255,0.74)_0%,rgba(255,255,255,0.56)_34%,rgba(255,255,255,0.22)_60%,rgba(255,255,255,0.1)_100%)]" />
        <div className="absolute right-[-10%] top-[4%] h-[36rem] w-[68%] bg-[radial-gradient(ellipse_at_75%_36%,rgba(40,20,54,0.34)_0%,rgba(40,20,54,0.16)_32%,rgba(255,255,255,0)_70%)] mix-blend-multiply" />
        <div className="absolute right-[-11rem] top-[8%] h-[33rem] w-[33rem] rounded-full bg-[radial-gradient(circle,rgba(255,77,77,0.18)_0%,rgba(255,255,255,0)_72%)] blur-3xl" />
        <div className="absolute inset-x-0 bottom-[-1px] h-32 bg-gradient-to-b from-transparent via-[#fff9fb]/65 to-[#fff9fb]" />
      </div>

      <div className="relative mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <motion.p
          {...fadeUp(0)}
          className="text-sm font-semibold tracking-[0.16em] text-[#0b1020]/82 uppercase"
        >
          {tx("LỘ TRÌNH", "ROADMAP")}
        </motion.p>

        <div className="relative mt-7 lg:min-h-[420px]">
          <motion.div {...fadeUp(0.05)} className="max-w-[940px] lg:max-w-[58%]">
            <h2 className="text-[2.35rem] leading-[1.04] font-extrabold tracking-[-0.03em] text-[#0b1020] sm:text-[3.2rem] lg:text-[4rem]">
              <span className="block">
                {tx("CHÚNG TA ĐANG Ở ĐÂU —", "WHERE ARE WE NOW —")}
              </span>
              <span className="block">
                {tx("VÀ SẼ", "AND WHERE WILL WE")}{" "}
                <span className="bg-gradient-to-r from-[#ff3d4f] to-[#ff7083] bg-clip-text text-transparent">
                  {tx("ĐI ĐẾN ĐÂU?", "GO NEXT?")}
                </span>
              </span>
            </h2>
            <p className="mt-6 max-w-[680px] text-[1.08rem] leading-8 text-[#0b1020]/76 sm:text-[1.35rem] sm:leading-9 lg:text-2xl lg:leading-10">
              {tx(
                "Team mình không thể xây hệ sinh thái trong 1 năm. Mọi thứ đi theo từng phase rõ ràng.",
                "We are not building an ecosystem in one year. Everything moves through clear phases."
              )}
            </p>
            <p className="mt-4 text-lg leading-8 text-[#0b1020]/75">
              {tx(
                "Mỗi phase tồn tại để: học · xác thực · xây hệ thống · rồi mới mở rộng.",
                "Each phase exists to: learn · validate · build systems · then scale."
              )}
            </p>
          </motion.div>

        </div>

        <motion.article
          {...fadeUp(0.16)}
          className="relative z-10 mt-2 overflow-hidden rounded-[28px] border border-red-200/75 bg-gradient-to-br from-[#fff6f8] via-white to-white p-0 shadow-[0_26px_60px_-42px_rgba(255,61,79,0.62)] lg:-mt-12"
        >
          <div className="grid gap-0 lg:grid-cols-[120px_1fr]">
            <div className="flex flex-col items-center justify-center bg-gradient-to-b from-[#ff4d5f] to-[#ff6d85] px-4 py-8 text-white">
              <motion.div
                className="inline-flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/85 text-2xl font-extrabold"
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(255,255,255,0.6)",
                    "0 0 0 14px rgba(255,255,255,0)",
                    "0 0 0 0 rgba(255,255,255,0.6)",
                  ],
                }}
                transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY }}
              >
                1
              </motion.div>
              <p className="mt-4 text-center text-sm font-bold tracking-[0.1em] uppercase">
                {tx("GIAI ĐOẠN HIỆN TẠI", "CURRENT PHASE")}
              </p>
            </div>

            <div className="p-6 sm:p-7">
              <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr_0.9fr]">
                <div>
                  <p className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-bold tracking-[0.11em] text-red-500 uppercase">
                    <Flame className="h-3.5 w-3.5" />
                    {tx("GIAI ĐOẠN HIỆN TẠI", "CURRENT PHASE")}
                  </p>
                  <h3 className="mt-3 text-[2.45rem] leading-[1.08] font-extrabold tracking-[-0.02em] text-[#ff3d4f]">
                    {tx("DỊCH VỤ + SINH TỒN", "Service + Survival")}
                  </h3>
                  <p className="mt-3 text-xl font-semibold text-[#0b1020]">
                    {tx(
                      "“ĐI LÀM. ĐI HỌC. ĐI KIẾM KHÁCH.”",
                      '"DO THE WORK. LEARN FAST. WIN CLIENTS."'
                    )}
                  </p>
                  <p className="mt-4 text-base leading-7 text-[#0b1020]/78">
                    {tx(
                      "Markee là đội marketing + công nghệ thuê ngoài cho SME. Chúng ta làm thật, có người thật, có workflow thật, có revenue thật.",
                      "Markee is an outsourced marketing + technology team for SMEs, with real workflows and real revenue."
                    )}
                  </p>
                  <div className="mt-5 rounded-2xl border border-red-100 bg-white px-4 py-3 text-sm leading-6 text-[#0b1020]/78">
                    <p className="font-semibold text-[#ff3d4f]">
                      {tx(
                        "MỖI CLIENT ĐỀU LÀ DỮ LIỆU HUẤN LUYỆN.",
                        "EVERY CLIENT IS TRAINING DATA."
                      )}
                    </p>
                    <p>
                      {tx(
                        "Mỗi khách hàng không chỉ là doanh thu, mà còn là góc nhìn vận hành.",
                        "Every client is not only revenue, but also operational insight."
                      )}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-red-100/70 bg-white p-4">
                  <p className="text-xs font-bold tracking-[0.11em] text-red-500 uppercase">
                    {tx("CHÚNG TA ĐANG LÀM", "CURRENT EXECUTION")}
                  </p>
                  <ul className="mt-3 space-y-2.5">
                    {currentWork.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm leading-6 text-[#0b1020]/78">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-red-100/70 bg-white p-4">
                  <p className="text-xs font-bold tracking-[0.11em] text-red-500 uppercase">
                    {tx("ĐIỀU QUAN TRỌNG", "WHAT MATTERS")}
                  </p>
                  <ul className="mt-3 space-y-2.5">
                    {currentImportant.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm leading-6 text-[#0b1020]/78">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 rounded-xl border border-red-100 bg-[#fff8fa] p-3">
                    <p className="text-sm font-semibold text-[#ff3d4f]">{tx("Vừa làm vừa học.", "Build while learning.")}</p>
                    <p className="text-sm text-[#0b1020]/76">
                      {tx("Mỗi tháng tốt hơn tháng trước.", "Every month should be better than the previous one.")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_1fr_1fr]">
                <div className="rounded-xl border border-red-200 bg-white px-4 py-3">
                  <p className="text-xs font-bold tracking-[0.1em] text-red-500 uppercase">
                    {tx("MỤC TIÊU GIAI ĐOẠN 1", "Target phase 1")}
                  </p>
                  <p className="mt-1 text-[2rem] font-extrabold tracking-[-0.02em] text-[#ff3d4f]">150M MRR</p>
                  <p className="text-sm text-[#0b1020]/75">
                    {tx("7–10 khách hàng ổn định", "7–10 stable clients")}
                  </p>
                </div>
                <div className="rounded-xl border border-red-100 bg-white px-4 py-3">
                  <p className="text-xs font-bold tracking-[0.1em] text-red-500 uppercase">
                    {tx("KHÔNG PHẢI LÀ", "NOT THIS")}
                  </p>
                  <ul className="mt-1 space-y-1.5">
                    {notThis.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-[#0b1020]/78">
                        <XCircle className="h-3.5 w-3.5 shrink-0 text-red-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-red-100 bg-white px-4 py-3">
                  <p className="text-xs font-bold tracking-[0.1em] text-red-500 uppercase">
                    {tx("NẾU CHƯA ĐẠT 150M", "IF NOT YET 150M")}
                  </p>
                  <ul className="mt-1 space-y-1.5 text-sm text-[#0b1020]/78">
                    <li>✕ {tx("không mở rộng", "no scaling")}</li>
                    <li>✕ {tx("không vội vàng làm SaaS", "no rushing SaaS")}</li>
                    <li>✕ {tx("không chia nhỏ trọng tâm", "no split focus")}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.article>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {phaseCards.map((phase, idx) => {
            const Icon = phase.icon;
            return (
              <motion.article
                key={phase.title}
                {...fadeUp(0.2 + idx * 0.04)}
                className="rounded-[24px] border border-red-100/75 bg-white/90 p-6 shadow-[0_18px_45px_-34px_rgba(15,23,42,0.48)]"
              >
                <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.11em] text-[#0b1020]/72 uppercase">
                  <Icon className="h-4 w-4 text-[#ff3d4f]" />
                  {phase.title}
                </p>
                <p className="mt-2 text-[2rem] leading-[1.12] font-extrabold tracking-[-0.02em] text-[#0b1020]">
                  {phase.subtitle}
                </p>
                <p className="mt-1 text-sm font-semibold tracking-[0.08em] text-[#ff3d4f] uppercase">
                  {phase.timeline}
                </p>
                <ul className="mt-4 space-y-2">
                  {phase.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2 text-sm leading-6 text-[#0b1020]/78">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-red-400" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </motion.article>
            );
          })}
        </div>

        <motion.article
          {...fadeUp(0.32)}
          className="mt-8 overflow-hidden rounded-[28px] border border-red-100/80 bg-white/90 shadow-[0_20px_52px_-36px_rgba(15,23,42,0.5)]"
        >
          <div className="grid gap-0 lg:grid-cols-[1fr_180px_1fr]">
            <div className="p-6 sm:p-7">
              <p className="inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-bold tracking-[0.1em] text-red-500 uppercase">
                PHASE 1
              </p>
              <h3 className="mt-3 flex items-center gap-2 text-[2.3rem] font-extrabold tracking-[-0.02em] text-[#ff3d4f]">
                <ChefHat className="h-7 w-7" />
                {tx("NHÀ HÀNG", "Restaurant")}
              </h3>
              <p className="mt-2 text-lg text-[#0b1020]/76">
                {tx("“ĐỘI MARKEE NẤU CHO KHÁCH.”", "“TEAM MARKEE COOKS FOR CLIENTS.”")}
              </p>
              <ul className="mt-4 space-y-2 text-base text-[#0b1020]/82">
                <li>• {tx("dịch vụ là trọng tâm", "service-heavy")}</li>
                <li>• {tx("bàn giao thủ công", "manual delivery")}</li>
                <li>• {tx("chăm sóc sát sao", "high-touch")}</li>
              </ul>
            </div>

            <div className="flex flex-col items-center justify-center border-y border-red-100/70 bg-gradient-to-b from-[#fff7fb] to-[#f8f9ff] p-4 lg:border-x lg:border-y-0">
              <ArrowRight className="h-8 w-8 text-[#ff4d5f]" />
              <p className="mt-2 text-center text-sm font-bold tracking-[0.09em] text-[#0b1020]/75 uppercase">
                {tx("TỪ", "FROM")}
              </p>
              <p className="text-center text-base font-semibold text-[#0b1020]">
                {tx("THỰC THI DỊCH VỤ", "Service execution")}
              </p>
              <p className="mt-2 text-center text-sm font-bold tracking-[0.09em] text-[#0b1020]/75 uppercase">
                {tx("ĐẾN", "TO")}
              </p>
              <p className="text-center text-base font-semibold text-[#0b1020]">
                {tx("HẠ TẦNG CÓ THỂ MỞ RỘNG", "Scalable infrastructure")}
              </p>
            </div>

            <div className="p-6 sm:p-7">
              <p className="inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-bold tracking-[0.1em] text-red-600 uppercase">
                PHASE 2
              </p>
              <h3 className="mt-3 flex items-center gap-2 text-[2.3rem] font-extrabold tracking-[-0.02em] text-[#ff5b6f]">
                <ShoppingCart className="h-7 w-7" />
                {tx("SIÊU THỊ + BẾP", "Supermarket + Kitchen")}
              </h3>
              <p className="mt-2 text-lg text-[#0b1020]/76">
                {tx(
                  "“KHÁCH BẮT ĐẦU TỰ DÙNG MỘT PHẦN.”",
                  "“CLIENTS START SELF-USING PART OF THE SYSTEM.”"
                )}
              </p>
              <ul className="mt-4 space-y-2 text-base text-[#0b1020]/82">
                <li>• {tx("tự động hóa có hỗ trợ", "assisted automation")}</li>
                <li>• {tx("hệ thống tái sử dụng", "reusable systems")}</li>
                <li>• {tx("tự phục vụ một phần", "partial self-service")}</li>
              </ul>
            </div>
          </div>
        </motion.article>

        

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <motion.article
            {...fadeUp(0.44)}
            className="rounded-[24px] border border-red-100/80 bg-white/92 p-6 shadow-[0_18px_46px_-34px_rgba(15,23,42,0.48)]"
          >
            <p className="text-sm font-semibold tracking-[0.15em] text-[#ff3d4f] uppercase">
              {tx("NGUYÊN TẮC KỶ LUẬT", "Discipline Rules")}
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="space-y-2.5">
                {disciplineNegative.map((item) => (
                  <p key={item} className="flex items-start gap-2.5 text-base leading-7 text-[#0b1020]/78">
                    <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#ff3d4f]" />
                    {item}
                  </p>
                ))}
              </div>
              <div className="space-y-2.5">
                {disciplinePositive.map((item) => (
                  <p key={item} className="flex items-start gap-2.5 text-base leading-7 text-[#0b1020]/78">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#ff3d4f]" />
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </motion.article>

          <motion.article {...fadeUp(0.48)} className="rounded-[24px] border border-red-100/80 bg-white/92 p-6">
            <p className="text-sm font-semibold tracking-[0.15em] text-[#0b1020]/72 uppercase">
              {tx("LUỒNG NHỎ", "Mini flow")}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              {infraFlow.map((item, idx) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="inline-flex rounded-full border border-red-100 bg-red-50 px-3 py-1.5 text-sm font-semibold text-[#0b1020]/78 shadow-[0_10px_24px_-18px_rgba(255,61,79,0.6)]">
                    {item}
                  </span>
                  {idx !== infraFlow.length - 1 ? <ArrowRight className="h-4 w-4 text-red-300" /> : null}
                </div>
              ))}
            </div>
          </motion.article>
        </div>

        <motion.p {...fadeUp(0.54)} className="mt-8 text-center text-lg leading-8 text-[#0b1020]/82">
          <span className="font-semibold text-[#ff3d4f]">⚠️ </span>
          {tx(
            "Nếu Phase 1 chưa đạt đủ MRR, đội sẽ KHÔNG rút lực sang Giai đoạn 2. Kỷ luật này là thứ giúp hệ sinh thái sống sót.",
            "If Phase 1 has not reached enough MRR, the team will NOT shift force to Phase 2. This discipline is what keeps the ecosystem alive."
          )}
        </motion.p>
      </div>
    </section>
  );
}
