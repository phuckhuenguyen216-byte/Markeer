"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CircleDollarSign, Globe2, Hotel, ShieldCheck, X, ChevronRight } from "lucide-react";
import { useState, type ComponentType, ReactNode } from "react";
import { useInsideMarkeeLocale } from "./useInsideMarkeeLocale";

type HouseCard = {
  title: string;
  domain: string;
  roleVi: string;
  roleEn: string;
  detailVi: string;
  detailEn: string;
  Icon: ComponentType<{ className?: string }>;
  toneClass: string;
  borderClass: string;
  titleClass: string;
  domainClass: string;
  textClass: string;
  positionClass: string;
  popupContentVi: ReactNode;
  popupContentEn: ReactNode;
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] as const },
  viewport: { once: true, amount: 0.2 },
});

export default function InsideMarkeeEcosystemSection() {
  const { tx, isEn } = useInsideMarkeeLocale();
  const [selectedHouse, setSelectedHouse] = useState<HouseCard | null>(null);
  const [hoveredHouse, setHoveredHouse] = useState<string | null>(null);

  const houses: HouseCard[] = [
    {
      title: "Markee",
      domain: "markee.vn · markeeai.com",
      roleVi: "Máy tạo doanh thu",
      roleEn: "Revenue engine",
      detailVi: "Marketing Agency + AI Automation.",
      detailEn: "Marketing Agency + AI Automation.",
      Icon: CircleDollarSign,
      toneClass: "from-[#fff1f5] to-[#ffe6ee]",
      borderClass: "border-[#ffc2d0]",
      titleClass: "text-[#9f1239]",
      domainClass: "text-[#be123c]/85",
      textClass: "text-[#4c1d2f]",
      positionClass: "bottom-2 left-2 sm:bottom-4 sm:-left-6 lg:-left-16",
      popupContentVi: (
        <div className="space-y-3">
          <div><p className="font-semibold text-gray-900">🎯 Khách hàng</p><p className="text-gray-700 mt-1 text-[0.95rem]">Chủ homestay, khách sạn, tour du lịch, shop online. Ưu tiên mảng hospitality nhờ showcase GoDanang.</p></div>
          <div><p className="font-semibold text-gray-900">💼 Dịch vụ (Phase 1)</p><p className="text-gray-700 mt-1 text-[0.95rem]">Đội marketing & tech thuê ngoài. Team chạy ads, web, content, automation. Dùng AI làm vũ khí để nhanh và hiệu quả hơn.</p></div>
          <div><p className="font-semibold text-gray-900">🔄 Mô hình tiến hóa</p><p className="text-gray-700 mt-1 text-[0.95rem]">Từ 70% con người (Phase 1) → 90% AI tự động (Phase 3). Mỗi tháng dev team số hóa thêm 1-2 quy trình.</p></div>
        </div>
      ),
      popupContentEn: (
        <div className="space-y-3">
          <div><p className="font-semibold text-gray-900">🎯 Target Clients</p><p className="text-gray-700 mt-1 text-[0.95rem]">Homestay owners, hotels, tours, online shops. Priority on hospitality thanks to GoDanang showcase.</p></div>
          <div><p className="font-semibold text-gray-900">💼 Services (Phase 1)</p><p className="text-gray-700 mt-1 text-[0.95rem]">Outsourced marketing & tech team. Running ads, web, content, automation. Using AI as a weapon to be faster and more efficient.</p></div>
          <div><p className="font-semibold text-gray-900">🔄 Evolution Model</p><p className="text-gray-700 mt-1 text-[0.95rem]">From 70% human (Phase 1) → 90% AI automated (Phase 3). Every month dev team digitizes 1-2 more processes.</p></div>
        </div>
      )
    },
    {
      title: "GoDanang",
      domain: "godanang.net",
      roleVi: "Case study sống",
      roleEn: "Live showcase",
      detailVi: "Đặt phòng · Tour du lịch Đà Nẵng.",
      detailEn: "Booking · Da Nang Tours.",
      Icon: Hotel,
      toneClass: "from-[#fff6ec] to-[#ffedd8]",
      borderClass: "border-[#ffd8a8]",
      titleClass: "text-[#b45309]",
      domainClass: "text-[#c26610]/85",
      textClass: "text-[#5f3a0b]",
      positionClass: "bottom-2 right-2 sm:bottom-4 sm:-right-6 lg:-right-16",
      popupContentVi: (
        <div className="space-y-3">
          <div><p className="font-semibold text-gray-900">🏖️ GoDanang là gì?</p><p className="text-gray-700 mt-1 text-[0.95rem]">Nền tảng đặt phòng và tour Đà Nẵng (B2C). Đây là dự án nội bộ dùng để test công nghệ và học hỏi thị trường thực tế.</p></div>
          <div><p className="font-semibold text-gray-900">🎯 Tại sao quan trọng?</p><p className="text-gray-700 mt-1 text-[0.95rem]">Là "showroom sống". Pitching với khách B2B bằng kết quả doanh thu thực tế trên GoDanang.net, hoàn toàn không cần slide giấy.</p></div>
          <div><p className="font-semibold text-gray-900">🔄 Vòng lặp dữ liệu</p><p className="text-gray-700 mt-1 text-[0.95rem]">Serve khách B2B → Có insight tối ưu GoDanang B2C → Showcase mạnh hơn → Thu hút thêm khách B2B mới.</p></div>
        </div>
      ),
      popupContentEn: (
        <div className="space-y-3">
          <div><p className="font-semibold text-gray-900">🏖️ What is GoDanang?</p><p className="text-gray-700 mt-1 text-[0.95rem]">Da Nang booking and tour platform (B2C). This is an internal project used to test technology and learn from the real market.</p></div>
          <div><p className="font-semibold text-gray-900">🎯 Why is it important?</p><p className="text-gray-700 mt-1 text-[0.95rem]">It's a "live showroom". Pitching to B2B clients using real revenue results on GoDanang.net, absolutely no paper slides needed.</p></div>
          <div><p className="font-semibold text-gray-900">🔄 Data Loop</p><p className="text-gray-700 mt-1 text-[0.95rem]">Serve B2B clients → Get insights to optimize GoDanang B2C → Stronger showcase → Attract more new B2B clients.</p></div>
        </div>
      )
    },
    {
      title: "Cloudgate",
      domain: "getcloudgate.com",
      roleVi: "Máy tạo deal lớn",
      roleEn: "Enterprise engine",
      detailVi: "Enterprise IT & Security.",
      detailEn: "Enterprise IT & Security.",
      Icon: Globe2,
      toneClass: "from-[#eef5ff] to-[#e3efff]",
      borderClass: "border-[#bfd7ff]",
      titleClass: "text-[#1d4ed8]",
      domainClass: "text-[#2563eb]/85",
      textClass: "text-[#1e3a8a]",
      positionClass: "top-2 left-2 sm:top-4 sm:-left-6 lg:-left-16",
      popupContentVi: (
        <div className="space-y-3">
          <div><p className="font-semibold text-gray-900">🎯 Khách hàng</p><p className="text-gray-700 mt-1 text-[0.95rem]">Giám đốc IT, CTO, CISO của doanh nghiệp lớn (200+ nhân sự) cần bảo mật và hạ tầng mạng nghiêm túc.</p></div>
          <div><p className="font-semibold text-gray-900">💼 Giải pháp</p><p className="text-gray-700 mt-1 text-[0.95rem]">Dịch vụ bảo mật (SOC, Pentest), hạ tầng (Fortinet/Cisco) và Managed IT. Quy mô deal từ 500tr đến 2 tỷ.</p></div>
          <div><p className="font-semibold text-gray-900">⏳ Chiến lược</p><p className="text-gray-700 mt-1 text-[0.95rem]">Enterprise deal cần 3-9 tháng chốt. Hiện tại tập trung xây quan hệ, dùng nguồn lực từ Markee để nuôi sống hệ sinh thái trước.</p></div>
        </div>
      ),
      popupContentEn: (
        <div className="space-y-3">
          <div><p className="font-semibold text-gray-900">🎯 Target Clients</p><p className="text-gray-700 mt-1 text-[0.95rem]">IT Directors, CTOs, CISOs of large enterprises (200+ employees) needing serious security and network infrastructure.</p></div>
          <div><p className="font-semibold text-gray-900">💼 Solutions</p><p className="text-gray-700 mt-1 text-[0.95rem]">Security services (SOC, Pentest), infrastructure (Fortinet/Cisco) and Managed IT. Deal sizes from 500M to 2 Billion.</p></div>
          <div><p className="font-semibold text-gray-900">⏳ Strategy</p><p className="text-gray-700 mt-1 text-[0.95rem]">Enterprise deals take 3-9 months to close. Currently focusing on building relationships, using resources from Markee to sustain the ecosystem first.</p></div>
        </div>
      )
    },
    {
      title: "SecurityZone",
      domain: "securityzone.vn",
      roleVi: "Máy tạo uy tín",
      roleEn: "Trust engine",
      detailVi: "Cộng đồng & Platform.",
      detailEn: "Community & Platform.",
      Icon: ShieldCheck,
      toneClass: "from-[#f5efff] to-[#ece2ff]",
      borderClass: "border-[#d7c2ff]",
      titleClass: "text-[#6d28d9]",
      domainClass: "text-[#7c3aed]/85",
      textClass: "text-[#4c1d95]",
      positionClass: "top-2 right-2 sm:top-4 sm:-right-6 lg:-right-16",
      popupContentVi: (
        <div className="space-y-3">
          <div><p className="font-semibold text-gray-900">🎯 Khách hàng</p><p className="text-gray-700 mt-1 text-[0.95rem]">Developer, IT Pro, Security Researcher đam mê công nghệ và muốn nâng cao trình độ.</p></div>
          <div><p className="font-semibold text-gray-900">💼 Hệ sinh thái</p><p className="text-gray-700 mt-1 text-[0.95rem]">Cộng đồng Forum/Telegram, Events công nghệ, Nexus SOC platform và đào tạo bảo mật chuyên sâu.</p></div>
          <div><p className="font-semibold text-gray-900">🔗 Phễu niềm tin (Trust layer)</p><p className="text-gray-700 mt-1 text-[0.95rem]">Tạo uy tín tuyệt đối. Người dùng sẽ biết Markee qua workshop, IT Director ấn tượng sẽ liên hệ Cloudgate sau sự kiện.</p></div>
        </div>
      ),
      popupContentEn: (
        <div className="space-y-3">
          <div><p className="font-semibold text-gray-900">🎯 Target Clients</p><p className="text-gray-700 mt-1 text-[0.95rem]">Developers, IT Pros, Security Researchers passionate about tech and wanting to level up their skills.</p></div>
          <div><p className="font-semibold text-gray-900">💼 Ecosystem</p><p className="text-gray-700 mt-1 text-[0.95rem]">Forum/Telegram community, Tech events, Nexus SOC platform and advanced security training.</p></div>
          <div><p className="font-semibold text-gray-900">🔗 Trust Funnel</p><p className="text-gray-700 mt-1 text-[0.95rem]">Create absolute credibility. Users will know Markee through workshops, impressed IT Directors will contact Cloudgate after events.</p></div>
        </div>
      )
    },
  ];

  return (
    <section className={`relative overflow-hidden bg-white py-24 text-[#0f172a] sm:py-28 lg:py-32 ${selectedHouse ? "z-[999]" : "z-0"}`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(255,77,95,0.08)_0%,rgba(255,255,255,0)_34%),radial-gradient(circle_at_84%_78%,rgba(255,120,150,0.07)_0%,rgba(255,255,255,0)_36%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative mx-auto max-w-[1420px] px-4 sm:px-6 lg:px-8">
        <motion.p {...fadeUp(0)} className="mk-eyebrow text-center text-[#7f1d35] uppercase">
          {tx("03 · Cấu trúc", "03 · Structure")}
        </motion.p>

        <motion.div {...fadeUp(0.05)} className="mx-auto mt-7 max-w-[920px] text-center">
          <h2 className="mk-section-title uppercase">
            <span className="block text-[#3f1020]">{tx("4 NHÀ", "4 HOUSES")}</span>
            <span className="mk-section-title-accent block bg-gradient-to-r from-[#ff4d5f] via-[#ff6c88] to-[#ff8cab] bg-clip-text text-transparent">
              {tx("1 HỆ SINH THÁI", "1 ECOSYSTEM")}
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-[780px] text-[1.03rem] leading-8 text-[#3f1020]/76 sm:text-[1.12rem]">
            {tx(
              "Team không phải một công ty đơn lẻ. Đây là hệ gồm Markee, GoDanang, Cloudgate, SecurityZone cùng đi về một mục tiêu: tăng trưởng thực cho doanh nghiệp Việt Nam.",
              "The team is not a single-company structure. It is an ecosystem of Markee, GoDanang, Cloudgate, and SecurityZone moving toward one goal: practical growth for Vietnamese businesses."
            )}
          </p>
        </motion.div>

        <motion.div {...fadeUp(0.1)} className="mt-12 grid items-center gap-10 lg:gap-24 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="flex h-full flex-col gap-4">
            <div className="rounded-[26px] border border-[#ffd1db] bg-white p-5 shadow-[0_22px_58px_-40px_rgba(255,77,95,0.32)] sm:p-6 transition-all duration-300 hover:shadow-[0_22px_68px_-30px_rgba(255,77,95,0.4)]">
              <p className="text-xs font-semibold tracking-[0.12em] text-[#9f1239] uppercase">{tx("Cách các nhà phối hợp", "How the houses connect")}</p>
              <p className="mt-3 text-[0.95rem] leading-7 font-medium text-[#4c1d2f] sm:text-[1.05rem]">
                {tx(
                  "GoDanang tạo showcase thực tế. Markee chuyển showcase thành doanh thu. SecurityZone xây trust. Cloudgate scale lên enterprise.",
                  "GoDanang builds real showcase. Markee turns showcase to revenue. SecurityZone builds trust. Cloudgate scales to enterprise."
                )}
              </p>
            </div>

            <div className="rounded-[26px] border border-[#ffd1db] bg-[#fff8fa] p-5 shadow-[0_20px_48px_-36px_rgba(255,77,95,0.34)] sm:p-6 transition-all duration-300 hover:shadow-[0_22px_58px_-26px_rgba(255,77,95,0.42)]">
              <p className="text-xs font-semibold tracking-[0.12em] text-[#9f1239] uppercase">{tx("Nguyên tắc", "Rule")}</p>
              <p className="mt-2 text-[0.95rem] leading-7 font-bold text-[#4c1d2f] sm:text-[1.05rem]">
                {tx(
                  "Không nhà nào cạnh tranh trực tiếp. Mỗi nhà tự lập tài chính và bổ trợ chéo.",
                  "No direct competition. Financially independent and mutually reinforcing."
                )}
              </p>
            </div>

            <div className="rounded-[26px] border border-[#ffd1db] bg-white p-5 shadow-[0_20px_44px_-34px_rgba(255,77,95,0.3)] sm:p-6 transition-all duration-300 hover:shadow-[0_22px_54px_-24px_rgba(255,77,95,0.38)]">
              <p className="text-xs font-semibold tracking-[0.12em] text-[#9f1239] uppercase">{tx("Mục tiêu chung", "Shared target")}</p>
              <p className="mt-2 text-[0.95rem] leading-7 font-medium text-[#4c1d2f] sm:text-[1.05rem]">
                {tx(
                  "Tăng trưởng doanh thu thật, vận hành tinh gọn, tạo vòng lặp học hỏi liên tục.",
                  "Real revenue growth, lean operations, and a continuous learning loop."
                )}
              </p>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[720px] relative">
            
            {/* Living System Background Effects */}
            <div className="absolute inset-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] rounded-full bg-[conic-gradient(from_0deg,rgba(255,77,95,0)_0%,rgba(255,77,95,0.08)_25%,rgba(255,77,95,0)_50%,rgba(255,77,95,0.08)_75%,rgba(255,77,95,0)_100%)] blur-[30px] animate-[spin_15s_linear_infinite] pointer-events-none" />
            <div className="absolute inset-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full border border-dashed border-[#ff4d5f]/15 animate-[spin_20s_linear_infinite_reverse] pointer-events-none" />
            
            {/* Connectors (SVG Pulse Lines) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-40">
              <defs>
                <linearGradient id="pulse-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="50%" stopColor="#ff4d5f">
                    <animate attributeName="stop-color" values="#ff4d5f;#ffb5c5;#ff4d5f" dur="2s" repeatCount="indefinite" />
                  </stop>
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
              <line x1="10%" y1="20%" x2="45%" y2="45%" stroke="url(#pulse-gradient)" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="90%" y1="20%" x2="55%" y2="45%" stroke="url(#pulse-gradient)" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="10%" y1="80%" x2="45%" y2="55%" stroke="url(#pulse-gradient)" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="90%" y1="80%" x2="55%" y2="55%" stroke="url(#pulse-gradient)" strokeWidth="1.5" strokeDasharray="3 3" />
            </svg>

            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative h-full w-full rounded-[28px] border border-[#ffd6df]/60 bg-white p-2 shadow-[0_34px_80px_-48px_rgba(255,77,95,0.4)] sm:p-3"
            >
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px]">
                <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0)_20%,rgba(255,255,255,0.5)_50%,rgba(255,255,255,0)_78%)]" />
              </div>
              
              {/* House Node Hover Glows */}
              <div className={`absolute top-[10%] left-[10%] w-[35%] h-[35%] bg-[radial-gradient(circle,rgba(29,78,216,0.35)_0%,rgba(29,78,216,0)_70%)] blur-2xl transition-opacity duration-500 pointer-events-none z-10 ${hoveredHouse === "Cloudgate" ? "opacity-100" : "opacity-0"}`} />
              <div className={`absolute top-[10%] right-[10%] w-[35%] h-[35%] bg-[radial-gradient(circle,rgba(109,40,217,0.35)_0%,rgba(109,40,217,0)_70%)] blur-2xl transition-opacity duration-500 pointer-events-none z-10 ${hoveredHouse === "SecurityZone" ? "opacity-100" : "opacity-0"}`} />
              <div className={`absolute bottom-[10%] left-[10%] w-[35%] h-[35%] bg-[radial-gradient(circle,rgba(159,18,57,0.35)_0%,rgba(159,18,57,0)_70%)] blur-2xl transition-opacity duration-500 pointer-events-none z-10 ${hoveredHouse === "Markee" ? "opacity-100" : "opacity-0"}`} />
              <div className={`absolute bottom-[10%] right-[10%] w-[35%] h-[35%] bg-[radial-gradient(circle,rgba(180,83,9,0.35)_0%,rgba(180,83,9,0)_70%)] blur-2xl transition-opacity duration-500 pointer-events-none z-10 ${hoveredHouse === "GoDanang" ? "opacity-100" : "opacity-0"}`} />

              <div className="relative z-0">
                <Image
                  src="/banner4.png"
                  alt={tx("Sơ đồ 4 nhà trong hệ sinh thái Markee", "4-house ecosystem map")}
                  width={1300}
                  height={900}
                  className="h-auto w-full rounded-[20px] object-contain drop-shadow-md"
                />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2.5 sm:hidden">
                {houses.map((house) => {
                  const Icon = house.Icon;
                  return (
                    <article
                      key={`mobile-${house.title}`}
                      onClick={() => setSelectedHouse(house)}
                      className={`cursor-pointer rounded-[14px] border ${house.borderClass} bg-gradient-to-br ${house.toneClass} p-2.5 shadow-[0_10px_20px_-10px_rgba(0,0,0,0.1)]`}
                    >
                      <p className={`inline-flex items-center gap-1 text-[0.88rem] font-extrabold ${house.titleClass}`}>
                        <Icon className="h-4 w-4" />
                        {house.title}
                      </p>
                      <p className={`mt-0.5 text-[0.58rem] font-bold tracking-widest uppercase ${house.domainClass}`}>{house.domain}</p>
                      <p className={`mt-1.5 text-[0.76rem] leading-snug font-medium ${house.textClass}`}>{tx("Vai trò:", "Role:")} {tx(house.roleVi, house.roleEn)}</p>
                      <p className={`mt-2 inline-flex items-center gap-1 text-[0.72rem] font-bold ${house.titleClass}`}>
                        {tx("Xem chi tiết", "View details")} <ChevronRight className="h-3.5 w-3.5" />
                      </p>
                    </article>
                  );
                })}
              </div>

              {/* Overlaying Houses */}
              {houses.map((house, index) => {
                const Icon = house.Icon;
                const isHovered = hoveredHouse === house.title;
                return (
                  <motion.article
                    key={house.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    className={`absolute hidden sm:flex ${house.positionClass} flex-col justify-between overflow-hidden rounded-[16px] border-[1.5px] ${house.borderClass} bg-gradient-to-br ${house.toneClass} p-3 sm:p-3.5 transition-all duration-300 w-[46%] max-w-[210px] backdrop-blur-xl bg-opacity-100 z-20 cursor-pointer ${isHovered ? "shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] scale-[1.03]" : "shadow-[0_10px_20px_-10px_rgba(0,0,0,0.1)]"}`}
                    onClick={() => setSelectedHouse(house)}
                    onMouseEnter={() => setHoveredHouse(house.title)}
                    onMouseLeave={() => setHoveredHouse(null)}
                  >
                    <div>
                      <p className={`inline-flex items-center gap-1.5 text-[0.95rem] font-extrabold ${house.titleClass}`}>
                        <Icon className="h-[18px] w-[18px]" />
                        {house.title}
                      </p>
                      <p className={`mt-0.5 text-[0.6rem] font-bold tracking-widest uppercase truncate ${house.domainClass}`}>{house.domain}</p>
                      <p className={`mt-2 text-[0.75rem] leading-tight font-medium ${house.textClass}`}>{tx("Vai trò:", "Role:")} {tx(house.roleVi, house.roleEn)}</p>
                    </div>
                    
                    <div className={`mt-3 flex items-center gap-1 text-[0.7rem] font-extrabold opacity-90 transition-opacity ${isHovered ? "opacity-100" : ""} ${house.titleClass}`}>
                      {tx("Xem chi tiết", "View details")} <ChevronRight className="h-3.5 w-3.5" />
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedHouse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedHouse(null)}
              className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative z-10 w-full max-w-[94vw] sm:max-w-2xl max-h-[86vh] overflow-y-auto overflow-hidden rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-8 shadow-2xl"
            >
              <button
                onClick={() => setSelectedHouse(null)}
                className="absolute right-5 top-5 rounded-full p-2 hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
              
              <div className="pr-8">
                <div className={`inline-flex items-center gap-3 text-xl font-bold ${selectedHouse.titleClass}`}>
                  <selectedHouse.Icon className="h-6 w-6" />
                  {selectedHouse.title}
                </div>
                <p className={`mt-2 text-xs font-semibold tracking-[0.1em] uppercase ${selectedHouse.domainClass}`}>{selectedHouse.domain}</p>
                <div className="mt-1 pb-4 mb-4 border-b border-gray-100">
                  <span className={`text-sm font-semibold ${selectedHouse.textClass}`}>{tx("Vai trò:", "Role:")} {tx(selectedHouse.roleVi, selectedHouse.roleEn)}</span>
                </div>
                
                {isEn ? selectedHouse.popupContentEn : selectedHouse.popupContentVi}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}


