"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { ComponentType } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Compass,
  Crown,
  Search,
  ShieldCheck,
  TrendingUp,
  Users,
  XCircle,
  Zap,
} from "lucide-react";
import { useInsideMarkeeLocale } from "./useInsideMarkeeLocale";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] as const },
  viewport: { once: true, amount: 0.2 },
});

type RoleProfile = {
  id: string;
  title: string;
  tone: string;
  border: string;
  bg: string;
  Icon: ComponentType<{ className?: string }>;
  subtitle: string;
  nickname: string;
  story: string;
  focus: string[];
  kpis: { label: string; value: number }[];
  signals: string[];
};

export default function InsideMarkeeCurrentOperationsSection() {
  const { tx } = useInsideMarkeeLocale();

  const flowCards = [
    {
      title: "SDR",
      text: tx("Khảo sát nỗi đau thật từ thị trường.", "Audit real market pain."),
      Icon: Search,
      tone: "text-[#ff4d5f]",
      border: "border-[#ffd2db]",
      bg: "bg-[#fff7f9]",
    },
    {
      title: "SALES",
      text: tx("Chẩn đoán và chốt hợp đồng đúng vấn đề.", "Diagnose and close the right deal."),
      Icon: Compass,
      tone: "text-[#6a5cff]",
      border: "border-[#dcd7ff]",
      bg: "bg-[#f9f8ff]",
    },
    {
      title: "AUTOMATION",
      text: tx("Xây quy trình và kiểm soát chất lượng.", "Build workflows and quality control."),
      Icon: Zap,
      tone: "text-[#2f73ff]",
      border: "border-[#d1e0ff]",
      bg: "bg-[#f5f9ff]",
    },
    {
      title: "CSM",
      text: tx("Giữ khách hàng ổn định và mở cơ hội mở rộng.", "Keep clients healthy and open upsell opportunities."),
      Icon: Users,
      tone: "text-[#0ea5b7]",
      border: "border-[#c7f1f7]",
      bg: "bg-[#f4fcff]",
    },
    {
      title: tx("MỞ RỘNG / GIỚI THIỆU", "UPSELL / REFERRAL"),
      text: tx("Quy trình tốt tạo vòng lặp tăng trưởng.", "Great workflows create compounding growth."),
      Icon: TrendingUp,
      tone: "text-[#ff7f37]",
      border: "border-[#ffdebe]",
      bg: "bg-[#fff9f3]",
    },
  ];

  const securityFlow = [tx("CỘNG ĐỒNG", "COMMUNITY"), tx("NIỀM TIN", "TRUST"), tx("KHÁCH TIỀM NĂNG ẤM", "WARM LEADS")];

  const roleProfiles: RoleProfile[] = useMemo(
    () => [
      {
        id: "sdr",
        title: "SDR",
        tone: "text-[#ff4d5f]",
        border: "border-[#ffcfd8]",
        bg: "bg-[#fff8fa]",
        Icon: Search,
        subtitle: tx("Đại diện phát triển bán hàng", "Sales Development Rep"),
        nickname: tx("THÁM TỬ TÌM NGƯỜI ĐANG ĐAU", "PAIN DETECTIVE"),
        story: tx(
          "SDR tìm đúng doanh nghiệp đang tắc quy trình: hộp thư trễ, bình luận bị bỏ sót, khách tiềm năng rơi mất. Mục tiêu là bàn giao góc nhìn sạch cho bán hàng.",
          "SDR finds businesses blocked by workflow pain and hands clean insights to sales."
        ),
        focus: [
          tx("lọc tín hiệu từ thị trường", "filter market signals"),
          tx("khảo sát góc nhìn theo ngành", "audit insights by niche"),
          tx("mở hội thoại đúng nỗi đau", "open conversations on real pain"),
          tx("bàn giao ngữ cảnh sạch cho bán hàng", "handover clean context to sales"),
        ],
        kpis: [
          { label: tx("Chất lượng khách tiềm năng", "Lead Quality"), value: 78 },
          { label: tx("Tỷ lệ họp tham gia", "Meeting Show Rate"), value: 71 },
          { label: tx("Độ khớp nỗi đau", "Pain Match Accuracy"), value: 83 },
        ],
        signals: [
          tx("TikTok Shop: bỏ sót bình luận, khách hỏi không ai trả lời", "TikTok Shop: missed comments, no response"),
          tx("Spa & Clinic: CSKH chậm, đội quá tải", "Spa & Clinic: slow support, overloaded team"),
          tx("Trang Facebook: hộp thư quá tải, trả lời trễ", "Facebook Page: overloaded inbox, late replies"),
        ],
      },
      {
        id: "sales",
        title: "SALES",
        tone: "text-[#6a5cff]",
        border: "border-[#dcd7ff]",
        bg: "bg-[#f8f7ff]",
        Icon: Compass,
        subtitle: tx("Chẩn đoán & chốt hợp đồng", "Diagnosis & Closing"),
        nickname: tx("BÁC SĨ CHẨN ĐOÁN NỖI ĐAU KINH DOANH", "PAIN DOCTOR"),
        story: tx(
          "Bán hàng không trình bày mù quáng. Vai trò này chẩn đoán điểm nghẽn và chốt đúng phạm vi để bàn giao chạy được ngay.",
          "Sales does not pitch blindly. It diagnoses bottlenecks and closes the right scope for delivery."
        ),
        focus: [
          tx("phân tích nỗi đau thực", "analyze real pain"),
          tx("chốt phạm vi rõ", "close clear scope"),
          tx("gắn kết quả vào đề xuất", "tie proposal to outcomes"),
          tx("bàn giao ngữ cảnh cho tự động hóa", "handover context to automation"),
        ],
        kpis: [
          { label: tx("Cuộc gọi đủ điều kiện", "Qualified Calls"), value: 74 },
          { label: tx("Tỷ lệ chốt", "Close Rate"), value: 62 },
          { label: tx("Độ chính xác phạm vi", "Scope Accuracy"), value: 79 },
        ],
        signals: [
          tx("Hợp đồng không rõ phạm vi sẽ làm bàn giao đứt nhịp", "Unclear scope breaks delivery rhythm"),
          tx("Đề xuất thiếu bản đồ nỗi đau sẽ thất bại nhanh", "Proposals without pain mapping fail quickly"),
          tx("Trình diễn phải dùng tình huống thật, không dùng slide chung", "Demos must use real cases, not generic slides"),
        ],
      },
      {
        id: "automation",
        title: tx("TỰ ĐỘNG HÓA KỸ THUẬT", "AUTOMATION TECH"),
        tone: "text-[#2f73ff]",
        border: "border-[#d1e0ff]",
        bg: "bg-[#f4f8ff]",
        Icon: Zap,
        subtitle: tx("Nhân sự tự động hóa", "Automation Operators"),
        nickname: tx("KỸ SƯ QUY TRÌNH THỰC CHIẾN", "WORKFLOW ENGINEERS"),
        story: tx(
          "Tự động hóa biến SOP thành mô-đun chạy được: CRM, chăm sóc lại, cảnh báo, báo cáo. Chỉ tự động hóa những gì đã xác thực.",
          "Automation turns SOP into reusable modules and automates only validated workflows."
        ),
        focus: [
          tx("chuẩn hóa SOP", "standardize SOP"),
          tx("xây mô-đun tái sử dụng", "build reusable modules"),
          tx("kiểm soát lỗi vận hành", "control operational errors"),
          tx("tối ưu tốc độ xử lý", "optimize execution speed"),
        ],
        kpis: [
          { label: tx("Thời gian hoạt động quy trình", "Workflow Uptime"), value: 91 },
          { label: tx("Mức giảm thao tác tay", "Manual Reduction"), value: 67 },
          { label: tx("Mức tái sử dụng mô-đun", "Module Reuse"), value: 73 },
        ],
        signals: [
          tx("Việc lặp trên 3 lần/tuần => ứng viên tự động hóa", "Repeated tasks >3 times/week => automation candidate"),
          tx("Mỗi mô-đun phải có phương án quay lui an toàn", "Every module needs a safe rollback"),
          tx("Báo cáo phải tự động trước khi mở rộng khách hàng", "Reporting should be automated before scaling clients"),
        ],
      },
      {
        id: "csm",
        title: "CSM",
        tone: "text-[#0ea5b7]",
        border: "border-[#c7f1f7]",
        bg: "bg-[#f3fcff]",
        Icon: Users,
        subtitle: tx("Quản lý thành công khách hàng", "Client Success Management"),
        nickname: tx("NGƯỜI GIỮ NHỊP NIỀM TIN", "TRUST RHYTHM KEEPER"),
        story: tx(
          "CSM giữ nhịp sau bán: cập nhật định kỳ, theo dõi KPI, xử lý vấn đề và mở cơ hội mở rộng đúng lúc.",
          "CSM keeps post-sale rhythm through check-ins, KPI tracking, issue handling, and timely upsell moves."
        ),
        focus: [
          tx("theo dõi KPI theo tuần", "track weekly KPI"),
          tx("giữ nhịp giao tiếp", "keep communication rhythm"),
          tx("chốt feedback vào vòng tối ưu", "loop feedback into optimization"),
          tx("mở cửa giới thiệu tự nhiên", "open natural referral opportunities"),
        ],
        kpis: [
          { label: tx("Độ khỏe duy trì", "Retention Health"), value: 88 },
          { label: tx("Tốc độ xử lý vấn đề", "Issue Resolve Speed"), value: 76 },
          { label: tx("Cơ hội mở rộng", "Upsell Opportunity"), value: 64 },
        ],
        signals: [
          tx("Cập nhật khách hàng trễ => niềm tin giảm nhanh", "Late updates reduce trust quickly"),
          tx("Báo cáo KPI đều đặn tạo cảm giác kiểm soát", "Consistent KPI reports create control"),
          tx("Giới thiệu xuất hiện khi kết quả rõ", "Referrals appear when outcomes are clear"),
        ],
      },
      {
        id: "community",
        title: tx("QUẢN LÝ CỘNG ĐỒNG", "COMMUNITY MANAGER"),
        tone: "text-[#ff8a00]",
        border: "border-[#ffe0ba]",
        bg: "bg-[#fff9f1]",
        Icon: ShieldCheck,
        subtitle: "SecurityZone",
        nickname: tx("NGƯỜI GIỮ NHIỆT CỘNG ĐỒNG", "TRUST LAYER BUILDER"),
        story: tx(
          "Cộng đồng không để bán hàng trực diện. Cộng đồng giữ lớp niềm tin để khách tiềm năng đến với trạng thái đã hiểu và đã tin.",
          "Community is not direct selling. It builds trust so leads arrive educated and trusting."
        ),
        focus: [
          tx("đăng góc nhìn vận hành", "publish operational insight"),
          tx("moderate thảo luận chất lượng", "moderate quality discussions"),
          tx("nuôi khách tiềm năng ấm dài hạn", "nurture long-term warm leads"),
          tx("tạo giới thiệu tự nhiên", "create natural referrals"),
        ],
        kpis: [
          { label: tx("Điểm niềm tin", "Trust Score"), value: 82 },
          { label: tx("Tỷ lệ khách tiềm năng ấm", "Warm Lead Rate"), value: 69 },
          { label: tx("Tốc độ giới thiệu", "Referral Velocity"), value: 61 },
        ],
        signals: [
          tx("Cộng đồng mạnh giúp giảm chi phí thu hút", "Strong community reduces acquisition cost"),
          tx("Nội dung ưu tiên rõ ràng hơn lan truyền", "Content should prioritize clarity over viral"),
          tx("Niềm tin xây chậm nhưng tích lũy mạnh", "Trust builds slow but compounds hard"),
        ],
      },
      {
        id: "ceo",
        title: tx("CEO & LÃNH ĐẠO", "CEO & LEADERSHIP"),
        tone: "text-[#4f66ff]",
        border: "border-[#d7defe]",
        bg: "bg-[#f6f8ff]",
        Icon: Crown,
        subtitle: tx("Lớp định hướng", "Direction Layer"),
        nickname: tx("NGƯỜI GIỮ ĐỊNH HƯỚNG TOÀN HỆ", "SYSTEM DIRECTION OWNER"),
        story: tx(
          "CEO giữ định hướng: đúng nỗi đau, đúng hệ thống, đúng người. Không để đội lệch khỏi hệ thu hút khách.",
          "CEO keeps direction around pain, systems, and people so the team does not drift from acquisition strategy."
        ),
        focus: [
          tx("ra quyết định ưu tiên", "prioritize decisions"),
          tx("giữ kỷ luật hệ thống", "keep systems discipline"),
          tx("phân bổ nguồn lực", "allocate resources"),
          tx("xây đội theo năng lực", "build team by capability"),
        ],
        kpis: [
          { label: tx("Độ rõ thực thi", "Execution Clarity"), value: 84 },
          { label: tx("Mức áp dụng hệ thống", "System Adoption"), value: 77 },
          { label: tx("Tốc độ vòng lặp", "Cycle Velocity"), value: 72 },
        ],
        signals: [
          tx("Thiếu định hướng rõ => đội chạy lệch", "Without clear direction teams drift"),
          tx("KPI phải phản ánh sức khỏe dài hạn", "KPI must reflect long-term health"),
          tx("Tăng trưởng và vận hành phải cân bằng", "Growth and operations must stay balanced"),
        ],
      },
    ],
    [tx]
  );

  const [activeRoleId, setActiveRoleId] = useState("sdr");
  const [expandedRoleId, setExpandedRoleId] = useState("sdr");
  const roleDetailRef = useRef<HTMLDivElement | null>(null);

  const activeRole = roleProfiles.find((role) => role.id === activeRoleId) ?? roleProfiles[0];

  const scrollRoleDetailIntoView = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      window.setTimeout(() => {
        roleDetailRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 90);
    }
  };

  const handleRoleSelect = (roleId: string) => {
    setActiveRoleId(roleId);
    setExpandedRoleId(roleId);
    scrollRoleDetailIntoView();
  };

  useEffect(() => {
    if (roleProfiles.length < 2) return;

    const timer = window.setInterval(() => {
      setActiveRoleId((currentRoleId) => {
        const currentIndex = roleProfiles.findIndex((role) => role.id === currentRoleId);
        const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % roleProfiles.length : 0;
        const nextRoleId = roleProfiles[nextIndex]?.id ?? currentRoleId;
        setExpandedRoleId(nextRoleId);
        return nextRoleId;
      });
    }, 3000);

    return () => {
      window.clearInterval(timer);
    };
  }, [roleProfiles]);

  const dailyTimeline = [
    {
      time: "08:00",
      role: "SDR",
      task: tx("Khảo sát TikTok Shop, spa, clinic để tìm nỗi đau.", "Audit TikTok shops, spas, and clinics to find pain points."),
      tone: "text-[#ff4d5f]",
      border: "border-[#ffd2db]",
      bg: "bg-[#fff8fa]",
      Icon: Search,
    },
    {
      time: "10:30",
      role: "SALES",
      task: tx("Trình diễn trực tiếp trên trang thật và tư vấn hướng xử lý.", "Run live demos on real pages and consult execution paths."),
      tone: "text-[#6a5cff]",
      border: "border-[#dcd7ff]",
      bg: "bg-[#f9f8ff]",
      Icon: Compass,
    },
    {
      time: "13:00",
      role: tx("TỰ ĐỘNG HÓA", "AUTOMATION"),
      task: tx("Thiết lập chatbot, CRM, tự động hóa và báo cáo.", "Set up chatbot, CRM, automation, and reporting."),
      tone: "text-[#2f73ff]",
      border: "border-[#d1e0ff]",
      bg: "bg-[#f4f8ff]",
      Icon: Zap,
    },
    {
      time: "16:00",
      role: "CSM",
      task: tx("Gửi báo cáo tuần, cập nhật khách hàng, xử lý vấn đề.", "Send weekly report, check in clients, resolve issues."),
      tone: "text-[#0ea5b7]",
      border: "border-[#c7f1f7]",
      bg: "bg-[#f3fcff]",
      Icon: Users,
    },
    {
      time: "20:00",
      role: tx("CỘNG ĐỒNG", "COMMUNITY"),
      task: tx("Đăng nội dung giá trị, trả lời cộng đồng, nuôi niềm tin.", "Post valuable content, answer community questions, nurture trust."),
      tone: "text-[#ff8a00]",
      border: "border-[#ffe0ba]",
      bg: "bg-[#fff9f1]",
      Icon: ShieldCheck,
    },
  ];

  const startupBad = [
    tx("Nhắn hộp thư hàng loạt, gọi lạnh tràn lan", "Spam inbox and random cold calls"),
    tx("Không hiểu nỗi đau, chỉ đoán mò", "No pain understanding, only guessing"),
    tx("Làm tính năng không ai dùng", "Build features nobody uses"),
    tx("Chạy theo chỉ số ảo", "Chase vanity metrics"),
    tx("Đốt tiền để phình nhân sự", "Burn cash scaling headcount"),
  ];

  const ecosystemGood = [
    tx("Hiểu nỗi đau thật, giải đúng vấn đề", "Understand real pain, solve the right problem"),
    tx("Xây hệ thống từ nhu cầu thực", "Build systems from real demand"),
    tx("Tự động hóa những thứ đã xác thực", "Automate validated workflows"),
    tx("Tích lũy quy trình và dữ liệu", "Compound workflows with data"),
    tx("Mở rộng bằng hệ thống, không chỉ bằng người", "Scale through systems, not only people"),
  ];

  return (
    <section className="imfx-sec-ops relative overflow-hidden bg-[#fffafb] py-24 sm:py-28 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(11,16,32,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(11,16,32,0.03)_1px,transparent_1px)] bg-[size:58px_58px]" />
      <div className="pointer-events-none absolute left-[-10rem] top-[-8rem] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(255,77,77,0.16)_0%,rgba(255,255,255,0)_72%)] blur-3xl" />

      <div className="relative mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
        <motion.p
          {...fadeUp(0)}
          className="text-sm font-semibold tracking-[0.17em] text-[#0b1020]/80 uppercase"
        >
          {tx("VẬN HÀNH HIỆN TẠI", "CURRENT OPERATIONS")}
        </motion.p>

        <motion.article
          {...fadeUp(0.06)}
          className="imfx-edge-run mt-8 overflow-hidden rounded-[30px] border border-red-100/80 bg-white/94 p-6 shadow-[0_20px_56px_-40px_rgba(15,23,42,0.55)] sm:p-8"
        >
          <div className="grid gap-7 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="max-w-[640px]">
              <h2 className="text-[2.35rem] leading-[1.05] font-extrabold tracking-[-0.03em] text-[#0b1020] sm:text-[3.2rem] lg:text-[4rem]">
                <span className="block sm:whitespace-nowrap">{tx("VAI TRÒ CỦA BẠN", "YOUR ROLE")}</span>
                <span className="block text-[#ff4d5f] sm:whitespace-nowrap">
                  {tx("TRONG HỆ VẬN HÀNH", "IN THE OPERATION MAP")}
                </span>
              </h2>
              <p className="mt-4 text-[1.12rem] leading-[1.45] text-[#0b1020]/84 sm:text-[1.3rem]">
                {tx("Mỗi người là một mắt xích vận hành trong hệ sinh thái.", "Each person is an operating link in the ecosystem.")}
              </p>
              <p className="mt-4 text-base leading-7 text-[#0b1020]/74">
                {tx(
                  "Dù bạn ở vị trí nào, hiểu rõ role của mình và role bên cạnh là cách team giữ flow chạy mượt.",
                  "No matter your role, understanding adjacent roles keeps the system smooth."
                )}
              </p>
              <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                {[
                  tx("Rõ vai trò cá nhân", "Role clarity"),
                  tx("Hiểu điểm bàn giao", "Handover clarity"),
                  tx("Giảm ma sát phối hợp", "Less friction"),
                  tx("Giữ tốc độ toàn hệ", "System speed"),
                ].map((item) => (
                  <p key={item} className="rounded-xl border border-red-100 bg-[#fff8fa] px-3 py-2 text-sm font-semibold text-[#0b1020]/78">
                    {item}
                  </p>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative aspect-[16/10]">
                <Image
                  src="/7.1.png"
                  alt="Current operations mission control map"
                  fill
                  sizes="(max-width: 1024px) 100vw, 56vw"
                  className="object-contain object-center"
                  quality={100}
                />
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-[22px] border border-red-100/80 bg-[#fffdfd] p-4 sm:p-5">
            <p className="text-xs font-semibold tracking-[0.16em] text-[#0b1020]/72 uppercase">
              {tx("LUỒNG CỦA MỘT KHÁCH HÀNG", "CLIENT FLOW")}
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr]">
              {flowCards.map((item, index) => {
                const Icon = item.Icon;
                return (
                  <div key={item.title} className="contents">
                    <div className={`imfx-diagram-float imfx-diagram-step-${index + 1} rounded-2xl border p-3 ${item.border} ${item.bg}`}>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full border bg-white ${item.border} ${item.tone}`}>
                          <Icon className="h-4 w-4" />
                        </span>
                        <p className={`text-sm font-bold ${item.tone}`}>{item.title}</p>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-[#0b1020]/76">{item.text}</p>
                    </div>
                    {index !== flowCards.length - 1 ? (
                      <div className="hidden items-center justify-center md:flex">
                        <ArrowRight className="h-4 w-4 text-red-300" />
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-[220px_1fr_auto_1fr_auto_1fr] md:items-center">
              <p className="text-sm font-semibold text-[#0b1020]/76">
                <span className="text-xs font-bold tracking-[0.16em] text-[#ff8a00] uppercase">
                  {tx("LUỒNG SECURITYZONE", "SECURITYZONE LANE")}
                </span>
                <br />
                {tx("Chạy song song để giữ khách tiềm năng ấm", "Runs in parallel to keep leads warm")}
              </p>
              {securityFlow.map((item, index) => (
                <div key={item} className="contents">
                  <p className={`imfx-diagram-float imfx-diagram-step-${index + 1} rounded-xl border border-amber-100 bg-amber-50/65 px-3 py-2 text-center text-sm font-semibold text-[#8a5200]`}>
                    {item}
                  </p>
                  {index !== securityFlow.length - 1 ? (
                    <div className="hidden items-center justify-center md:flex">
                      <ArrowRight className="h-4 w-4 text-amber-400" />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </motion.article>

        <motion.article
          {...fadeUp(0.14)}
          className="imfx-edge-run mt-8 rounded-[28px] border border-red-100/80 bg-white/95 p-5 shadow-[0_20px_56px_-40px_rgba(15,23,42,0.55)] sm:p-6"
        >
          <p className="text-sm font-semibold tracking-[0.16em] text-[#ff4d5f] uppercase">
            {tx("HỆ VAI TRÒ NỔI BẬT", "FEATURED ROLE SYSTEM")}
          </p>
          <div className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1.45fr_0.95fr]">
            <aside className="space-y-2.5">
              {roleProfiles.map((role) => {
                const Icon = role.Icon;
                const isExpanded = expandedRoleId === role.id;
                const isActive = activeRole.id === role.id;

                return (
                  <div key={role.id} className={`rounded-xl border ${role.border} ${isActive ? role.bg : "bg-white"}`}>
                    <button
                      type="button"
                      onClick={() => handleRoleSelect(role.id)}
                      className="flex w-full items-center justify-between px-3 py-3 text-left"
                    >
                      <span className="flex items-center gap-2.5">
                        <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full border bg-white ${role.border} ${role.tone}`}>
                          <Icon className="h-4 w-4" />
                        </span>
                        <span>
                          <p className={`text-sm font-bold ${isActive ? role.tone : "text-[#0b1020]"}`}>{role.title}</p>
                          <p className="text-xs text-[#0b1020]/58">{role.subtitle}</p>
                        </span>
                      </span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${role.tone} ${isExpanded ? "rotate-180" : "rotate-0"}`} />
                    </button>
                    {isExpanded ? (
                      <div className="border-t border-red-100 px-3 py-3">
                        <p className="text-xs font-semibold tracking-[0.08em] text-[#0b1020]/64 uppercase">
                          {tx("TRỌNG TÂM HIỆN TẠI", "CURRENT FOCUS")}
                        </p>
                        <ul className="mt-2 space-y-1 text-sm text-[#0b1020]/76">
                          {role.focus.slice(0, 2).map((point) => (
                            <li key={point} className="flex items-start gap-2">
                              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#ff7b93]" />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </aside>

            <div
              ref={roleDetailRef}
              className={`relative overflow-hidden rounded-[22px] border p-4 sm:p-6 ${activeRole.border} ${activeRole.bg}`}
            >
              <div className="pointer-events-none absolute right-[-3rem] top-[-3rem] h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(255,77,77,0.2)_0%,rgba(255,255,255,0)_74%)]" />
              <div className="pointer-events-none absolute bottom-0 right-0 h-44 w-44 opacity-35">
                <Image src="/7.2.png" alt="Featured role background visual" fill className="object-contain object-right-bottom" />
              </div>

              <div className="relative">
                <p className={`text-sm font-semibold tracking-[0.11em] uppercase ${activeRole.tone}`}>{activeRole.subtitle}</p>
                <p className="mt-1 text-[1.55rem] leading-[1.1] font-extrabold tracking-[-0.02em] text-[#0b1020] sm:text-[1.85rem]">{activeRole.title}</p>
                <p className={`mt-2 text-[1.55rem] leading-[1.1] font-extrabold tracking-[-0.03em] sm:text-[1.85rem] ${activeRole.tone}`}>{activeRole.nickname}</p>
                <p className="mt-3 text-base leading-7 text-[#0b1020]/78">{activeRole.story}</p>
              </div>

              <div className="relative mt-5 space-y-3">
                {activeRole.kpis.map((item) => (
                  <div key={item.label}>
                    <div className="mb-1 flex items-center justify-between text-xs font-semibold tracking-[0.08em] text-[#0b1020]/70 uppercase">
                      <span>{item.label}</span>
                      <span>{item.value}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-red-100/75">
                      <span className="block h-full rounded-full bg-gradient-to-r from-[#ff4d5f] to-[#ff8a9b]" style={{ width: `${item.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="relative mt-5 grid gap-2 sm:grid-cols-2">
                {activeRole.focus.map((item) => (
                  <p key={item} className="flex items-start gap-2 rounded-xl border border-red-100 bg-white/88 px-3 py-2 text-sm text-[#0b1020]/78">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#ff4d5f]" />
                    {item}
                  </p>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              <p className="text-xs font-semibold tracking-[0.12em] text-[#ff4d5f] uppercase">{tx("TÍN HIỆU THỰC TẾ", "LIVE SIGNALS")}</p>
              {activeRole.signals.map((item, index) => (
                <div key={item} className="rounded-xl border border-red-100 bg-white p-3">
                  <p className="text-sm leading-6 text-[#0b1020]/78">
                    <span className="font-semibold text-[#ff4d5f]">{index + 1}. </span>
                    {item}
                  </p>
                </div>
              ))}
              <div className="rounded-xl border border-red-100 bg-[#fff8fa] p-3">
                <p className="text-xs font-semibold tracking-[0.1em] text-[#ff4d5f] uppercase">{tx("VÌ SAO QUAN TRỌNG", "WHY IT MATTERS")}</p>
                <p className="mt-1 text-sm leading-6 text-[#0b1020]/78">
                  {tx("Rõ vai trò giúp tốc độ bàn giao cao hơn và giảm lỗi vận hành.", "Role clarity increases handover speed and reduces operational errors.")}
                </p>
              </div>
            </div>
          </div>
        </motion.article>

        <motion.article
          {...fadeUp(0.2)}
          className="imfx-timeline mt-8 rounded-[28px] border border-red-100/80 bg-white/95 p-5 shadow-[0_20px_56px_-40px_rgba(15,23,42,0.55)] sm:p-6"
        >
          <p className="text-sm font-semibold tracking-[0.16em] text-[#0b1020]/80 uppercase">
            {tx(
              "NHỮNG GÌ THẬT SỰ DIỄN RA MỖI NGÀY",
              "WHAT ACTUALLY HAPPENS DAILY"
            )}
          </p>

          <div className="relative mt-8 hidden md:block">
            <div className="pointer-events-none absolute left-4 right-4 top-[2.05rem] h-px bg-gradient-to-r from-[#ffd6de] via-[#ff7b93] to-[#ffd6de]" />
            <div className="grid gap-3 md:grid-cols-5">
              {dailyTimeline.map((item) => {
                const Icon = item.Icon;
                return (
                  <div key={item.time} className="relative pt-16">
                    <span className="absolute left-1/2 top-[1.85rem] h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#ff5f78] shadow-[0_0_0_5px_rgba(255,123,147,0.2)]" />
                    <p className="absolute left-1/2 top-0 -translate-x-1/2 text-base font-extrabold text-[#ff4d7a]">
                      {item.time}
                    </p>
                    <div className={`rounded-2xl border p-3 ${item.border} ${item.bg}`}>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full border bg-white ${item.border} ${item.tone}`}>
                          <Icon className="h-4 w-4" />
                        </span>
                        <p className={`text-sm font-bold ${item.tone}`}>{item.role}</p>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-[#0b1020]/76">{item.task}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 space-y-3 md:hidden">
            {dailyTimeline.map((item) => {
              const Icon = item.Icon;
              return (
                <div key={item.time} className={`rounded-2xl border p-3 ${item.border} ${item.bg}`}>
                  <div className="flex items-center justify-between">
                    <p className="text-base font-extrabold text-[#ff4d7a]">{item.time}</p>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full border bg-white ${item.border} ${item.tone}`}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <p className={`text-sm font-bold ${item.tone}`}>{item.role}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#0b1020]/76">{item.task}</p>
                </div>
              );
            })}
          </div>
        </motion.article>

        <motion.article
          {...fadeUp(0.26)}
          className="imfx-edge-run mt-8 rounded-[28px] border border-red-100/80 bg-white/95 p-5 shadow-[0_20px_56px_-40px_rgba(15,23,42,0.55)] sm:p-6"
        >
          <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
            <div className="relative overflow-hidden rounded-2xl border border-red-200 bg-gradient-to-br from-[#fff7f9] via-white to-[#fff2f5] p-5">
              <p className="text-sm font-semibold tracking-[0.16em] text-[#ff4d5f] uppercase">
                {tx("KHỞI NGHIỆP THƯỜNG GẶP", "TYPICAL STARTUP")}
              </p>
              <ul className="mt-4 space-y-2 text-[#0b1020]/78">
                {startupBad.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm leading-6">
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#ff4d5f]" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="pointer-events-none relative mt-4 aspect-[4/3] min-h-[180px] w-full overflow-hidden rounded-xl border border-red-100/80 bg-[#fffafb]">
                <Image
                  src="/7.3.png"
                  alt="Startup struggling visual"
                  fill
                  className="object-cover object-center opacity-90"
                />
              </div>
            </div>

            <div className="hidden items-center lg:flex">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-red-200 bg-white text-lg font-extrabold text-[#0b1020]">
                VS
              </span>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-red-200 bg-gradient-to-br from-[#fff8fa] via-white to-[#fff3f6] p-5">
              <p className="text-sm font-semibold tracking-[0.16em] text-[#ff4d5f] uppercase">
                {tx("HỆ SINH THÁI MARKEE", "MARKEE ECOSYSTEM")}
              </p>
              <ul className="mt-4 space-y-2 text-[#0b1020]/78">
                {ecosystemGood.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm leading-6">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#ff4d5f]" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="pointer-events-none relative mt-4 aspect-[4/3] min-h-[180px] w-full overflow-hidden rounded-xl border border-red-100/80 bg-[#fffafb]">
                <Image
                  src="/7.4.png"
                  alt="Markee ecosystem growth visual"
                  fill
                  className="object-cover object-center opacity-95"
                />
              </div>
            </div>
          </div>
        </motion.article>

        
      </div>
    </section>
  );
}

