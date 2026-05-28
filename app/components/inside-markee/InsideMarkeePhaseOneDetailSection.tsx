"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Hotel, Target, DollarSign, Settings, Sparkles, X, ChevronRight } from "lucide-react";
import { useInsideMarkeeLocale } from "./useInsideMarkeeLocale";
import { useState, ReactNode } from "react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] as const },
  viewport: { once: true, amount: 0.2 },
});

export default function InsideMarkeePhaseOneDetailSection() {
  const { tx, isEn } = useInsideMarkeeLocale();

  type PhaseTopic = {
    title: string;
    image: string;
    Icon: any;
    popupContentVi: ReactNode;
    popupContentEn: ReactNode;
  };

  const [selectedTopic, setSelectedTopic] = useState<PhaseTopic | null>(null);

  const principles = [
    tx("✦ Bán kết quả trước khi bán tool", "✦ Sell outcomes before tools"),
    tx("✦ Ưu tiên ngành có data thật", "✦ Prioritize real-data verticals"),
    tx("✦ Vừa kiếm tiền vừa build system", "✦ Earn while building the system"),
    tx("✦ Chỉ automation thứ đã proven", "✦ Only automate proven processes"),
  ];

  const topics: PhaseTopic[] = [
    {
      title: tx("Khách hàng & Dịch vụ", "Clients & Services"),
      image: "/8.1.png",
      Icon: Target,
      popupContentVi: (
        <div className="space-y-6">
          <div>
            <h4 className="font-bold text-[#ff4d5f] text-lg mb-2">🎯 Khách hàng chủ đạo — Du lịch</h4>
            <ul className="space-y-2 text-gray-800 text-[0.95rem] ml-4 list-disc marker:text-[#ff4d5f]">
              <li><strong className="text-gray-900">Chủ Homestay & Khách sạn nhỏ:</strong> Cần website đặt phòng, marketing, chatbot CSKH, automation booking.</li>
              <li><strong className="text-gray-900">Chủ Tour & Hướng dẫn viên:</strong> Cần website bán tour, content marketing, AI support trả lời lịch trình.</li>
              <li><strong className="text-gray-900">Spa & Dịch vụ du lịch:</strong> Cần marketing đến đúng khách du lịch, review management, CSKH 24/7.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#ff4d5f] text-lg mb-2">📦 Client nhận được gì? (Done-for-you)</h4>
            <p className="text-gray-700 text-[0.95rem] mb-2">Team Markee lo toàn bộ từ A → Z. Client không cần biết công nghệ. Markee làm thay bạn, không bán tool để bạn tự dùng:</p>
            <ul className="space-y-2 text-gray-800 text-[0.95rem] ml-4 list-disc marker:text-[#ff4d5f]">
              <li><strong className="text-gray-900">Website / Landing page:</strong> Thiết kế và build website bán hàng, book tour — đẹp, convert được.</li>
              <li><strong className="text-gray-900">Marketing Agency:</strong> Chạy Facebook/TikTok/Google Ads, tạo content, quản lý fanpage, tăng leads thật.</li>
              <li><strong className="text-gray-900">AI Automation:</strong> Chatbot CSKH, tự động follow-up, tự động hóa quy trình booking, báo cáo.</li>
            </ul>
          </div>
        </div>
      ),
      popupContentEn: (
        <div className="space-y-6">
          <div>
            <h4 className="font-bold text-[#ff4d5f] text-lg mb-2">🎯 Core Clients — Tourism</h4>
            <ul className="space-y-2 text-gray-800 text-[0.95rem] ml-4 list-disc marker:text-[#ff4d5f]">
              <li><strong className="text-gray-900">Homestay & Small Hotel Owners:</strong> Need booking websites, marketing, customer service chatbots, automation booking.</li>
              <li><strong className="text-gray-900">Tour Owners & Guides:</strong> Need tour sales websites, content marketing, AI support for itinerary replies.</li>
              <li><strong className="text-gray-900">Spa & Travel Services:</strong> Need marketing to the right tourists, review management, 24/7 customer service.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#ff4d5f] text-lg mb-2">📦 What do clients get? (Done-for-you)</h4>
            <p className="text-gray-700 text-[0.95rem] mb-2">The Markee team handles everything from A → Z. Clients don't need to know technology. Markee does it for you, not selling tools for you to use yourself:</p>
            <ul className="space-y-2 text-gray-800 text-[0.95rem] ml-4 list-disc marker:text-[#ff4d5f]">
              <li><strong className="text-gray-900">Website / Landing page:</strong> Design and build sales websites, tour booking — beautiful, high-converting.</li>
              <li><strong className="text-gray-900">Marketing Agency:</strong> Run Facebook/TikTok/Google Ads, create content, manage fanpages, increase real leads.</li>
              <li><strong className="text-gray-900">AI Automation:</strong> Customer service chatbots, auto follow-ups, booking process automation, reporting.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: tx("Sales, Giá & Hoa hồng", "Sales, Pricing & Commision"),
      image: "/8.2.png",
      Icon: DollarSign,
      popupContentVi: (
        <div className="space-y-6">
          <div>
            <h4 className="font-bold text-[#ff4d5f] text-lg mb-2">💰 Pricing — Chiến lược chiếm thị phần</h4>
            <p className="text-gray-700 text-[0.95rem] mb-2">Ưu tiên chiếm thị phần và học nhanh nhất, không ưu tiên lợi nhuận. Giá phải cực cạnh tranh để khách thử.</p>
            <ul className="space-y-2 text-gray-800 text-[0.95rem] ml-4 list-disc marker:text-[#ff4d5f]">
              <li><strong className="text-gray-900">Định giá thông minh:</strong> Giá gốc + Discount có lý do (vd: client đầu tiên, tháng ra mắt).</li>
              <li><strong className="text-gray-900">KPI Guarantee:</strong> Cam kết kết quả (inbox dưới 1 phút, X leads/tháng). Không đạt → hoàn tiền.</li>
              <li><strong className="text-gray-900">Tăng giá tự nhiên:</strong> Sau 3–6 tháng có kết quả thật → bỏ discount, tăng về giá trị thực tế.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#ff4d5f] text-lg mb-2">🔍 Cách tìm khách hàng (Inbound & Outbound)</h4>
            <ul className="space-y-2 text-gray-800 text-[0.95rem] ml-4 list-disc marker:text-[#ff4d5f]">
              <li><strong className="text-gray-900">Outbound (Facebook Ads Library / TikTok):</strong> Nhắn tin các fanpage đang chạy ads nhưng không rep kịp comment.</li>
              <li><strong className="text-gray-900">Agency Partnership:</strong> Hợp tác với Ads agency nhỏ → họ giới thiệu Markee cho client → chia % hoa hồng.</li>
              <li><strong className="text-gray-900">Inbound (Toàn team seeding):</strong> Mỗi người đăng 1-2 post/tuần kể chuyện thật về kết quả làm cho khách. Case study là lead chất lượng nhất.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#ff4d5f] text-lg mb-2">🤝 Hoa hồng cho toàn team</h4>
            <p className="text-gray-700 text-[0.95rem]">Bất kỳ ai (intern, dev, designer...) giới thiệu được client ký hợp đồng → đều nhận hoa hồng.</p>
          </div>
        </div>
      ),
      popupContentEn: (
        <div className="space-y-6">
          <div>
            <h4 className="font-bold text-[#ff4d5f] text-lg mb-2">💰 Pricing — Market Share Strategy</h4>
            <p className="text-gray-700 text-[0.95rem] mb-2">Prioritize gaining market share and learning fastest, not profit. Prices must be extremely competitive for clients to try.</p>
            <ul className="space-y-2 text-gray-800 text-[0.95rem] ml-4 list-disc marker:text-[#ff4d5f]">
              <li><strong className="text-gray-900">Smart Pricing:</strong> Base price + Reasoned discount (e.g., first client, launch month).</li>
              <li><strong className="text-gray-900">KPI Guarantee:</strong> Guaranteed results (inbox under 1 min, X leads/month). Fail to achieve → refund.</li>
              <li><strong className="text-gray-900">Natural Price Increase:</strong> After 3–6 months with real results → remove discounts, increase to actual value.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#ff4d5f] text-lg mb-2">🔍 How to find clients (Inbound & Outbound)</h4>
            <ul className="space-y-2 text-gray-800 text-[0.95rem] ml-4 list-disc marker:text-[#ff4d5f]">
              <li><strong className="text-gray-900">Outbound (Facebook Ads Library / TikTok):</strong> Message fanpages running ads but failing to reply to comments in time.</li>
              <li><strong className="text-gray-900">Agency Partnership:</strong> Partner with small Ads agencies → they refer Markee to clients → share commission %.</li>
              <li><strong className="text-gray-900">Inbound (Whole team seeding):</strong> Everyone posts 1-2 times/week sharing real stories about client results. Case studies are the highest quality leads.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#ff4d5f] text-lg mb-2">🤝 Commission for the whole team</h4>
            <p className="text-gray-700 text-[0.95rem]">Anyone (intern, dev, designer...) who introduces a client that signs a contract → receives a commission.</p>
          </div>
        </div>
      )
    },
    {
      title: tx("Cỗ máy tiến hóa nội bộ", "Internal Evolution Engine"),
      image: "/8.3.png",
      Icon: Settings,
      popupContentVi: (
        <div className="space-y-6">
          <div>
            <h4 className="font-bold text-[#ff4d5f] text-lg mb-2">⚙️ Vũ khí bí mật của Markee</h4>
            <p className="text-gray-800 text-[0.95rem] mb-2">Chúng ta là agency có team dev liên tục tự động hóa chính công việc của mình.</p>
            <ul className="space-y-2 text-gray-700 text-[0.9rem] bg-gray-50 rounded-xl p-4 border border-gray-100">
              <li><strong>Phase 1:</strong> 50–70% Con người / 30–50% AI</li>
              <li><strong>Phase 2:</strong> 30–50% Con người / 50–70% AI</li>
              <li><strong>Cuối cùng:</strong> &lt;10% Con người / 90%+ Tự động hoàn toàn</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#ff4d5f] text-lg mb-2">👥 Dev team 2 tầng</h4>
            <ul className="space-y-2 text-gray-800 text-[0.95rem] ml-4 list-disc marker:text-[#ff4d5f]">
              <li><strong className="text-gray-900">Senior dev:</strong> Làm cho client thật. Build automation, chatbot... Tích lũy module thật từ production.</li>
              <li><strong className="text-gray-900">Junior dev:</strong> Nhận lại modules từ senior, tái sử dụng, tích hợp vào MarkeeAI platform nội bộ.</li>
            </ul>
            <p className="text-[#e11d48] font-medium text-[0.95rem] mt-3 italic">"Vòng lặp: Senior build module → Junior đóng gói template → Onboard client mới cực nhanh."</p>
          </div>
          <div>
            <h4 className="font-bold text-[#ff4d5f] text-lg mb-2">💡 Tại sao không build SaaS ngay từ đầu?</h4>
            <p className="text-gray-700 text-[0.95rem]">Build SaaS ngay mất 6-12 tháng mà chưa chắc đúng nhu cầu. Làm service trước → có doanh thu ngay tuần đầu → học được client thật sự cần gì. Client đang trả tiền để chúng ta R&D hệ thống.</p>
          </div>
        </div>
      ),
      popupContentEn: (
        <div className="space-y-6">
          <div>
            <h4 className="font-bold text-[#ff4d5f] text-lg mb-2">⚙️ Markee's Secret Weapon</h4>
            <p className="text-gray-800 text-[0.95rem] mb-2">We are an agency with a dev team continuously automating our own work.</p>
            <ul className="space-y-2 text-gray-700 text-[0.9rem] bg-gray-50 rounded-xl p-4 border border-gray-100">
              <li><strong>Phase 1:</strong> 50–70% Human / 30–50% AI</li>
              <li><strong>Phase 2:</strong> 30–50% Human / 50–70% AI</li>
              <li><strong>Final:</strong> &lt;10% Human / 90%+ Fully Automated</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#ff4d5f] text-lg mb-2">👥 Two-tier Dev Team</h4>
            <ul className="space-y-2 text-gray-800 text-[0.95rem] ml-4 list-disc marker:text-[#ff4d5f]">
              <li><strong className="text-gray-900">Senior dev:</strong> Works for real clients. Builds automation, chatbots... Accumulates real modules from production.</li>
              <li><strong className="text-gray-900">Junior dev:</strong> Takes modules back from seniors, reuses, integrates into internal MarkeeAI platform.</li>
            </ul>
            <p className="text-[#e11d48] font-medium text-[0.95rem] mt-3 italic">"Loop: Senior builds module → Junior packages template → Onboard new clients blazingly fast."</p>
          </div>
          <div>
            <h4 className="font-bold text-[#ff4d5f] text-lg mb-2">💡 Why not build SaaS from day one?</h4>
            <p className="text-gray-700 text-[0.95rem]">Building SaaS immediately takes 6-12 months without certainty of demand. Doing service first → revenue in week one → learn what clients truly need. Clients are paying us to R&D the system.</p>
          </div>
        </div>
      )
    },
  ];

  return (
    <section style={{ zIndex: selectedTopic ? 999 : 0 }} className="relative overflow-hidden bg-white py-24 sm:py-28 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,240,245,0.8)_0%,rgba(255,255,255,0)_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(180,24,40,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(180,24,40,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_70%)]" />
      <div className="pointer-events-none absolute left-[-10rem] top-[14%] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(255,77,77,0.12)_0%,rgba(255,255,255,0)_72%)] blur-3xl" />

      <div className="relative mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <motion.p {...fadeUp(0)} className="mk-eyebrow text-[#5f1a22] uppercase">
          {tx("05 · Phase 1 chi tiết", "05 · Phase 1 details")}
        </motion.p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <motion.article
            {...fadeUp(0.05)}
            className="relative overflow-hidden rounded-[32px] bg-[linear-gradient(165deg,#fff8fb_0%,#ffffff_58%,#fff7fa_100%)] p-6 shadow-[0_28px_72px_-50px_rgba(15,23,42,0.56)] sm:p-8"
          >
            <div className="pointer-events-none absolute right-[-6rem] top-[-4rem] h-[15rem] w-[15rem] rounded-full bg-[radial-gradient(circle,rgba(255,77,95,0.14)_0%,rgba(255,255,255,0)_72%)] blur-2xl" />

            <h2 className="mk-section-title">
              <span className="block text-[#321017]">{tx("TRƯỚC KHI SCALE AI", "BEFORE SCALING AI")}</span>
              <span className="mk-section-title-accent block bg-gradient-to-r from-[#ff3f57] via-[#ff4d5f] to-[#ff748f] bg-clip-text text-transparent">
                {tx("PHẢI KIẾM ĐƯỢC TIỀN", "WE MUST EARN MONEY")}
              </span>
            </h2>

            <p className="mt-5 max-w-[680px] text-[1.05rem] leading-8 text-[#5f1a22]/85 sm:text-[1.15rem]">
              {tx(
                "Markee chưa bán AI tool tự chạy. Chúng tôi dùng AI để tạo kết quả thật trước, sau đó mới scale thành hệ thống.",
                "Markee doesn't sell self-running AI tools yet. We use AI to generate real results first, then scale into a system."
              )}
            </p>

            <div className="mt-8 space-y-4">
              {principles.map((item) => (
                <p
                  key={item}
                  className="flex items-start text-[1.05rem] font-semibold text-[#5f1a22]/95 tracking-wide"
                >
                  {item}
                </p>
              ))}
            </div>

            <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#fff2f6] px-4 py-2 text-sm font-medium text-[#7f2b3a]">
              <Sparkles className="h-4 w-4 text-[#ff4d5f]" />
              {tx(
                "Mục tiêu: học nhanh từ client thật để build hệ thống đúng.",
                "Goal: learn fast from real clients to build the right system."
              )}
            </p>
          </motion.article>

          <motion.article
            {...fadeUp(0.1)}
            className="relative rounded-[32px] bg-white p-4 shadow-[0_26px_62px_-44px_rgba(15,23,42,0.4)] sm:p-5"
          >
            <div className="relative w-full h-[360px] overflow-hidden rounded-[24px] sm:h-[420px] bg-gray-50 border border-gray-100/50">
              <Image src="/5.1.png" alt="Phase 1 service execution visual" fill className="object-cover" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0)_10%,rgba(255,255,255,0.25)_70%,rgba(255,255,255,0.7)_100%)] pointer-events-none" />
              
              {/* Invisible automation cues / Hologram system feel */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15)_0%,rgba(255,255,255,0)_60%)] mix-blend-overlay pointer-events-none" />
              <div className="absolute top-[25%] left-[10%] w-[35%] h-[1px] bg-white/70 blur-[1px] shadow-[0_0_12px_3px_rgba(255,255,255,0.9)] animate-pulse pointer-events-none" />
              <div className="absolute bottom-[35%] right-[15%] w-[45%] h-[1px] bg-white/70 blur-[1px] shadow-[0_0_12px_3px_rgba(255,255,255,0.9)] animate-pulse pointer-events-none" />
              <div className="absolute top-[10%] bottom-[10%] left-[20%] w-[1px] bg-[linear-gradient(to_bottom,transparent_0%,rgba(255,255,255,0.6)_50%,transparent_100%)] pointer-events-none" />
            </div>
            
            <div className="px-3 pb-3 pt-6 sm:px-4">
              <div className="flex items-center gap-2">
                <div className="h-[1px] w-6 bg-[#ff4d4d]" />
                <p className="text-[0.65rem] font-bold tracking-[0.2em] text-[#ff4d4d] uppercase">{tx("Founder statement", "Founder statement")}</p>
              </div>
              <p className="mt-3 text-[1.15rem] leading-8 font-light text-[#5f1a22]/90 sm:text-[1.25rem] italic">
                {tx(
                  "\"Con người làm chiến lược. AI tăng tốc execution.\"",
                  "\"Humans do strategy. AI accelerates execution.\""
                )}
              </p>
            </div>
          </motion.article>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {topics.map((topic, index) => {
            const Icon = topic.Icon;
            return (
              <motion.article
                key={topic.title}
                {...fadeUp(0.16 + index * 0.04)}
                onClick={() => setSelectedTopic(topic)}
                className="group cursor-pointer relative flex flex-col overflow-hidden rounded-[26px] bg-white border border-[#ffd6df] shadow-[0_12px_24px_-12px_rgba(15,23,42,0.06)] hover:shadow-[0_20px_40px_-16px_rgba(15,23,42,0.1)] transition-all duration-300"
              >
                <div className="relative h-[180px] w-full overflow-hidden bg-gray-100">
                  <Image
                    src={topic.image}
                    alt={topic.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
                
                <div className="flex flex-1 flex-col justify-between p-5 bg-white">
                  <div>
                    <p className="inline-flex items-center gap-1.5 rounded-full bg-[#fff0f4] px-3 py-1.5 text-[0.65rem] font-bold tracking-[0.12em] text-[#ff4d4d] uppercase shadow-sm">
                      <Icon className="h-3.5 w-3.5" />
                      {tx("Nội dung chính", "Main topic")}
                    </p>
                    <p className="mt-3 text-[1.15rem] leading-7 font-extrabold text-[#321017]">{topic.title}</p>
                  </div>
                  
                  <button
                    className="mt-6 inline-flex w-full pointer-events-none items-center justify-center gap-1.5 rounded-2xl bg-[#fff0f4] py-3 text-[0.85rem] font-bold text-[#ff4d5f] transition-colors group-hover:bg-[#ffe1e8]"
                  >
                    {tx("Bấm xem chi tiết", "View details")}
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>

      {/* POPUP MODAL */}
      <AnimatePresence>
        {selectedTopic && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTopic(null)}
              className="absolute inset-0 bg-[#0f172a]/30 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white border border-gray-100 p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedTopic(null)}
                className="absolute right-5 top-5 rounded-full p-2 hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
              
              <div className="pr-6">
                <p className="text-[0.7rem] font-bold tracking-[0.15em] text-[#ff4d5f] uppercase mb-1">
                  {tx("Chi tiết Phase 1", "Phase 1 Detail")}
                </p>
                <h3 className="text-2xl font-extrabold text-[#321017] mb-6 pb-4 border-b border-gray-100">
                  {selectedTopic.title}
                </h3>
                
                {isEn ? selectedTopic.popupContentEn : selectedTopic.popupContentVi}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

