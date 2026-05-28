"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock3, Handshake, SearchCheck, ArrowRight, X } from "lucide-react";
import { useGrowthLocale } from "./useGrowthLocale";

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.58, delay, ease: [0.22, 1, 0.36, 1] as const },
  viewport: { once: true, amount: 0.25 },
});

export default function GrowthLeadFlowSection() {
  const { tx } = useGrowthLocale();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState<"luat" | "flow">("luat");
  const [activeTab, setActiveTab] = useState<"flow" | "bikip">("flow");

  const priorities = [
    {
      titleVi: "Prior relationship",
      titleEn: "Prior relationship",
      descVi: "Ưu tiên cao nhất nếu có context quan hệ thật.",
      descEn: "Top priority when real relationship context exists.",
      Icon: Handshake,
    },
    {
      titleVi: "Discovery quality",
      titleEn: "Discovery quality",
      descVi: "Ai hiểu pain sâu hơn sẽ có ownership mạnh hơn.",
      descEn: "Deeper pain discovery builds stronger ownership.",
      Icon: SearchCheck,
    },
    {
      titleVi: "CRM timestamp",
      titleEn: "CRM timestamp",
      descVi: "Chỉ dùng làm tiebreaker cho case ngang nhau.",
      descEn: "Only used as tie-breaker for equal cases.",
      Icon: Clock3,
    },
  ];

  const steps = [
    tx("Ghi prospect + pain cụ thể", "Capture prospect + specific pain"),
    tx("Submit đúng format", "Submit in correct format"),
    tx("Sales Lead log CRM", "Sales Lead logs CRM"),
    tx("Chờ close + unlock", "Wait for close + unlock"),
  ];

  return (
    <section style={{ zIndex: isPopupOpen ? 999 : 0 }} className="relative overflow-hidden py-18 sm:py-22 lg:py-26">
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(59,130,246,0.06)_0%,rgba(255,255,255,0)_36%),radial-gradient(circle_at_74%_72%,rgba(255,77,95,0.08)_0%,rgba(255,255,255,0)_34%)]"
        animate={{ opacity: [0.86, 1, 0.86] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <motion.div {...reveal(0)} className="relative mx-auto max-w-[980px] text-center">
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-5 h-16 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,77,95,0.22)_0%,rgba(255,255,255,0)_72%)] blur-xl"
            animate={{ opacity: [0.4, 1, 0.4], scale: [0.95, 1.08, 0.95] }}
            transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
          />
          <p className="mk-eyebrow text-[#ff4d5f] uppercase">
            {tx("03 · Outbound & Inbound", "03 · Outbound & Inbound")}
          </p>
          <h2 className="mk-section-title mx-auto mt-4 max-w-[22ch] uppercase sm:max-w-[30ch] lg:max-w-none">
            <span className="block text-[#0b1020]">{tx("KHÔNG CÒN LÀ AI NHẮN TRƯỚC.", "NO LONGER WHO MESSAGES FIRST.")}</span>
            <span className="mk-section-title-accent block bg-gradient-to-r from-[#ff3f57] via-[#ff4d5f] to-[#ff7a94] bg-clip-text text-transparent">
              {tx("MÀ LÀ AI MANG CONTEXT TỐT HƠN.", "IT IS WHO BRINGS BETTER CONTEXT.")}
            </span>
          </h2>
        </motion.div>

        <div className="mt-8 grid gap-7 lg:grid-cols-[1fr_1fr] lg:items-start">
          <motion.article
            {...reveal(0.06)}
            onClick={() => { setPopupType("luat"); setIsPopupOpen(true); }}
            className="group cursor-pointer relative overflow-hidden rounded-[30px] bg-[#160f22] p-6 text-[#dbe7ff] shadow-[0_30px_72px_-48px_rgba(22,15,34,0.78)] sm:p-7 transition-transform hover:-translate-y-1 hover:shadow-[0_30px_72px_-40px_rgba(22,15,34,0.9)]"
          >
            <motion.div
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(255,255,255,0.05)_50%,transparent_100%)]"
              animate={{ y: ["-100%", "100%"] }}
              transition={{ duration: 5.2, repeat: Infinity, ease: "linear" }}
            />

            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold tracking-[0.14em] text-[#7db2ff] uppercase">{tx("Priority stack", "Priority stack")}</p>
              <span className="text-xs font-semibold text-[#ff4d5f] opacity-0 transition-opacity group-hover:opacity-100 flex items-center gap-1">
                {tx("Xem chi tiết", "View details")} <ArrowRight className="h-3 w-3" />
              </span>
            </div>
            <div className="relative mt-5 space-y-4">
              {priorities.map((item, index) => {
                const Icon = item.Icon;
                return (
                  <motion.article
                    key={item.titleVi}
                    initial={{ opacity: 0, x: -14 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.45, delay: 0.12 + index * 0.08 }}
                    viewport={{ once: true, amount: 0.2 }}
                    className="rounded-2xl bg-white/8 px-4 py-4"
                  >
                    <p className="inline-flex items-center gap-2 text-sm font-semibold text-white">
                      <Icon className="h-4 w-4 text-[#7db2ff]" />
                      {tx(item.titleVi, item.titleEn)}
                    </p>
                    <p className="mt-1.5 text-sm leading-6 text-[#dbe7ff]/82 sm:text-base sm:leading-7">{tx(item.descVi, item.descEn)}</p>
                  </motion.article>
                );
              })}
            </div>
          </motion.article>

          <motion.article
            {...reveal(0.12)}
            onClick={() => { setPopupType("flow"); setActiveTab("flow"); setIsPopupOpen(true); }}
            className="group cursor-pointer relative overflow-hidden rounded-[30px] bg-[linear-gradient(170deg,#ffffff_0%,#fff8fb_100%)] p-6 shadow-[0_28px_66px_-48px_rgba(15,23,42,0.54)] sm:p-7 transition-transform hover:-translate-y-1 hover:shadow-[0_28px_66px_-40px_rgba(15,23,42,0.7)]"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold tracking-[0.14em] text-[#ff4d5f] uppercase">{tx("4-step submit flow", "4-step submit flow")}</p>
              <span className="text-xs font-semibold text-[#ff4d5f] opacity-0 transition-opacity group-hover:opacity-100 flex items-center gap-1">
                {tx("Xem chi tiết", "View details")} <ArrowRight className="h-3 w-3" />
              </span>
            </div>

            <div className="relative mt-5">
              <svg className="pointer-events-none absolute left-0 top-3 hidden h-[calc(100%-24px)] w-[34px] sm:block" viewBox="0 0 34 260" preserveAspectRatio="none" aria-hidden>
                <path d="M18 0 C10 26, 26 44, 18 70 C10 96, 26 114, 18 140 C10 168, 26 186, 18 214 C14 232, 18 246, 18 260" stroke="rgba(255,77,95,0.36)" strokeWidth="1.2" fill="none" />
              </svg>

              <div className="space-y-4">
                {steps.map((step, index) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.14 + index * 0.08 }}
                    viewport={{ once: true, amount: 0.25 }}
                    className="relative rounded-2xl bg-white px-4 py-3.5 shadow-[0_12px_28px_-22px_rgba(15,23,42,0.48)] sm:pl-12"
                  >
                    <span className="mb-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#ff4d5f] text-xs font-semibold text-white sm:absolute sm:left-3 sm:top-3.5">
                      {index + 1}
                    </span>
                    <p className="text-sm leading-6 text-[#0b1020]/78 sm:text-base sm:leading-7">{step}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div 
              className="mt-6 pt-5 border-t border-gray-100 relative group/tags"
              onClick={(e) => { e.stopPropagation(); setPopupType("flow"); setActiveTab("bikip"); setIsPopupOpen(true); }}
            >
              <div className="w-full flex items-center justify-between mb-3">
                <p className="text-xs font-semibold tracking-[0.14em] text-[#ff4d5f] uppercase">{tx("Bí kíp thực chiến", "Practical Tactics")}</p>
                <span className="text-xs font-semibold text-[#ff4d5f] opacity-0 transition-opacity group-hover/tags:opacity-100 flex items-center gap-1">
                  {tx("Xem", "View")} <ArrowRight className="h-3 w-3" />
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {["FB Ads Library", "TikTok comments", "Zalo/FB groups", "Prior network", "Founder content"].map((item) => (
                  <span key={item} className="rounded-full bg-[#f5f8ff] px-3 py-1.5 text-sm text-[#23427a] hover:bg-[#e0eaff] transition-colors">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </motion.article>
        </div>
      </div>

      <AnimatePresence>
        {isPopupOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPopupOpen(false)}
              className="absolute inset-0 bg-[#0b1020]/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className={`relative w-full max-w-[800px] rounded-[28px] bg-white border border-[#ffe0e8] shadow-2xl z-10 max-h-[90vh] flex flex-col overflow-hidden ${popupType === "flow" ? "sm:h-[650px]" : "h-auto"}`}
            >
              <button
                onClick={() => setIsPopupOpen(false)}
                className="absolute right-5 top-5 rounded-full p-2 hover:bg-gray-100 transition-colors z-20"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>

              {popupType === "flow" && (
                <div className="px-6 pt-6 pb-0 sm:px-10 sm:pt-10 border-b border-gray-100 shrink-0">
                  <div className="flex gap-4">
                    <button
                      className={`pb-3 px-2 font-bold text-[1.05rem] transition-colors relative whitespace-nowrap ${activeTab === "flow" ? "text-[#ff4d5f]" : "text-gray-500 hover:text-gray-800"}`}
                      onClick={() => setActiveTab("flow")}
                    >
                      {tx("4 Bước Submit", "4-Step Flow")}
                      {activeTab === "flow" && (
                        <motion.div layoutId="activeLeadTabIndicator" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[#ff4d5f]" />
                      )}
                    </button>
                    <button
                      className={`pb-3 px-2 font-bold text-[1.05rem] transition-colors relative whitespace-nowrap ${activeTab === "bikip" ? "text-[#ff4d5f]" : "text-gray-500 hover:text-gray-800"}`}
                      onClick={() => setActiveTab("bikip")}
                    >
                      {tx("Bí kíp Thực chiến", "Practical Tactics")}
                      {activeTab === "bikip" && (
                        <motion.div layoutId="activeLeadTabIndicator" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[#ff4d5f]" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              <div className={`text-[#0b1020] p-6 sm:p-10 ${popupType === "flow" ? "flex-1 overflow-y-auto" : "overflow-y-auto"}`}>
                {popupType === "luat" && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-2xl font-extrabold text-[#0b1020]">
                        {tx("Khách của ai? Tính như thế nào?", "Whose prospect is it? How is it calculated?")}
                      </h3>
                      <p className="mt-2 text-[0.95rem] leading-7 text-gray-600">
                        {tx("Đọc kỹ phần này — làm sai mất hoa hồng như chơi. Không còn áp dụng rule cũ gây toxic.", "Read this carefully — a mistake could cost you your commission. Toxic old rule no longer applies.")}
                      </p>
                    </div>

                    <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200">
                      <h4 className="text-sm font-extrabold text-amber-900 flex items-center gap-2 uppercase tracking-wide">
                        <span className="text-base">⚠️</span> {tx("THAY ĐỔI QUAN TRỌNG", "IMPORTANT CHANGE")}
                      </h4>
                      <p className="mt-3 text-[0.95rem] font-bold text-amber-900">
                        {tx('"Ai nhắn trước là chủ lead" — RULE CŨ. KHÔNG CÒN ÁP DỤNG.', '"First to message owns the lead" — OLD RULE. NO LONGER APPLIES.')}
                      </p>
                      <p className="mt-2 text-[0.9rem] text-amber-800 leading-relaxed">
                        {tx("Rule cũ gây toxic: intern spam số điện thoại ngẫu nhiên để claim, người đã invest nhiều effort lại không được công nhận. Rule mới công bằng hơn:", "The old rule caused toxicity: interns spamming random phone numbers to claim, while those who invested effort were unrecognised. The new rule is fairer:")}
                      </p>

                      <div className="mt-4 space-y-3">
                        <div className="bg-white rounded-xl p-3.5 border border-amber-100 shadow-sm">
                          <p className="font-bold text-amber-900">
                            <span className="text-[#ff4d5f] font-extrabold mr-1">L1</span>
                            {tx("Prior Relationship — Ưu tiên cao nhất", "Prior Relationship — Highest Priority")}
                          </p>
                          <p className="text-[0.85rem] text-amber-800 mt-1">
                            {tx(
                              "Bạn đã có trao đổi thực tế với prospect từ trước, hoặc có quan hệ cá nhân. Phải ghi rõ khi submit: \"Tôi đã quen biết/đã nói chuyện với họ trước rồi.\"",
                              "You already had real conversations with this prospect, or have a personal relationship. Clearly state this when submitting."
                            )}
                          </p>
                        </div>
                        <div className="bg-white rounded-xl p-3.5 border border-amber-100 shadow-sm">
                          <p className="font-bold text-amber-900">
                            <span className="text-[#ff4d5f] font-extrabold mr-1">L2</span>
                            {tx("Discovery Quality — Ai biết nhiều hơn", "Discovery Quality — Who Knows More")}
                          </p>
                          <p className="text-[0.85rem] text-amber-800 mt-1">
                            {tx(
                              "Ai submit được thông tin đầy đủ và sâu hơn: pain cụ thể, budget signal, tên người quyết định — người đó được ưu tiên. Submit càng chi tiết càng có lợi cho bạn.",
                              "Whoever submits deeper, more complete information (specific pain, budget signals, decision maker) gets priority. More detail gives you an advantage."
                            )}
                          </p>
                        </div>
                        <div className="bg-white rounded-xl p-3.5 border border-amber-100 shadow-sm opacity-90">
                          <p className="font-bold text-amber-900">
                            <span className="text-gray-500 font-extrabold mr-1">L3</span>
                            {tx("CRM Timestamp — Chỉ dùng khi L1 & L2 ngang nhau", "CRM Timestamp — Only when L1 & L2 are tied")}
                          </p>
                          <p className="text-[0.85rem] text-amber-800 mt-1">
                            {tx(
                              "Timestamp là tiebreaker cuối cùng, không phải rule chính. Nếu cả hai submit thông tin như nhau cùng lúc, người nhắn vào nhóm trước được tính.",
                              "Timestamp is only the final tiebreaker, not the main rule. If both submissions are equally strong, earlier message time wins."
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {popupType === "flow" && activeTab === "flow" && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                  >
                    <h4 className="text-xl font-extrabold text-[#0b1020] flex items-center gap-2">
                      <span className="text-2xl">📤</span> {tx("4 Bước submit lead — Đúng quy trình là có tiền", "4-Step submit flow — Right process means money")}
                    </h4>
                    <div className="mt-5 space-y-4">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#ff4d5f] text-white flex items-center justify-center font-bold text-sm">1</div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 mb-2">{tx("Quy trình 4 Bước:", "4-Step Process:")}</p>
                          <p className="font-bold text-gray-900">{tx("Tìm được prospect — Ghi chép ngay", "Find prospect — Note it down immediately")}</p>
                          <p className="text-[0.9rem] text-gray-600 mt-1">{tx("Cần có: Tên + SĐT + Ngành + Pain cụ thể (họ đang gặp vấn đề gì). Càng chi tiết càng tốt — đây là L2 advantage.", "Required: Name + Phone + Industry + Specific Pain. The more detailed, the better — this is an L2 advantage.")}</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#ff4d5f] text-white flex items-center justify-center font-bold text-sm">2</div>
                        <div>
                          <p className="font-bold text-gray-900">{tx("Nhắn vào nhóm Zalo Sales ngay — Đúng format", "Message Sales Zalo group immediately — Correct format")}</p>
                          <div className="mt-2 bg-gray-50 rounded-lg p-3 border border-gray-200 text-[0.85rem] font-mono text-gray-800">
                            {tx("🎯 Lead mới:", "🎯 New lead:")} {tx("[Tên] - [SĐT] - [Ngành]", "[Name] - [Phone] - [Industry]")}<br/>
                            {tx("Pain: [Mô tả vấn đề cụ thể]", "Pain: [Specific problem description]")}<br/>
                            {tx("Relationship: [Người quen / Tìm qua FB / Group / Khác]", "Relationship: [Prior contact / Found via FB / Group / Other]")}
                          </div>
                          <p className="text-[0.85rem] text-gray-500 mt-2 italic">{tx("Nếu có quen biết trước → thêm dòng: \"Đã nói chuyện với họ [X] lần về [Y]\"", "If prior relationship → add line: \"Talked to them [X] times about [Y]\"")}</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#ff4d5f] text-white flex items-center justify-center font-bold text-sm">3</div>
                        <div>
                          <p className="font-bold text-gray-900">{tx("Sales Lead log vào CRM trong 24h", "Sales Lead logs into CRM within 24h")}</p>
                          <p className="text-[0.9rem] text-gray-600 mt-1">{tx("Sales Lead check xem lead này đã có trong CRM chưa. Chưa có → log ngay, bạn được ghi nhận. Đã có → thông báo bạn và giải thích.", "Sales Lead checks if lead exists in CRM. If not → logs immediately, you are credited. If yes → notifies you and explains.")}</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#ff4d5f] text-white flex items-center justify-center font-bold text-sm">4</div>
                        <div>
                          <p className="font-bold text-gray-900">{tx("Chờ Sales close → Nhận thông báo khi client trả tiền", "Wait for Sales to close → Get notified when client pays")}</p>
                          <p className="text-[0.9rem] text-gray-600 mt-1">{tx("Bạn không cần làm thêm gì sau bước 2. Finance sẽ thông báo khi commission được unlock. Thường tháng 2 nhận 70%, tháng 3 nhận 30% còn lại.", "You don't need to do anything after step 2. Finance notifies when commission is unlocked. Usually 70% in month 2, remaining 30% in month 3.")}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {popupType === "flow" && activeTab === "bikip" && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="grid sm:grid-cols-2 gap-6"
                  >
                    <div className="bg-[#f8faff] rounded-2xl p-5 border border-[#e0eaff]">
                      <h4 className="text-lg font-extrabold text-[#23427a] mb-4">{tx("📤 Outbound — Chủ động tìm", "📤 Outbound — Active hunting")}</h4>
                      <ul className="space-y-4 text-[0.85rem] text-gray-700">
                        <li><strong className="text-gray-900">{tx("🔴 FB Ads Library (nhanh nhất):", "🔴 FB Ads Library (fastest):")}</strong> {tx("vào facebook.com/ads/library, tìm shop đang chạy ads, vào fanpage xem comment có ngập không — nhắn tin ngay.", "go to facebook.com/ads/library, find shops running ads, check if fanpage comments are flooded — message immediately.")}</li>
                        <li><strong className="text-gray-900">{tx("🎵 TikTok comments:", "🎵 TikTok comments:")}</strong> {tx("Tìm TikTok của homestay/mỹ phẩm/spa có nhiều \"còn phòng không?\" chưa rep → nhắn chủ account.", "Find TikToks of homestays/cosmetics/spas with many unreplied \"any rooms?\" → message the account owner.")}</li>
                        <li><strong className="text-gray-900">{tx("👥 Zalo/FB Groups:", "👥 Zalo/FB Groups:")}</strong> {tx("Join group chủ shop → lắng nghe 3 ngày → answer câu hỏi thật → DM sau khi đã engage.", "Join shop owner groups → listen for 3 days → answer real questions → DM after engaging.")}</li>
                        <li><strong className="text-gray-900">{tx("🤝 Người quen:", "🤝 Network:")}</strong> {tx("Ai quen đang chạy shop, homestay, spa? Kể họ nghe về Markee và intro với Sales.", "Know anyone running a shop, homestay, or spa? Tell them about Markee and intro to Sales.")}</li>
                      </ul>
                    </div>
                    
                    <div className="bg-[#fffcf8] rounded-2xl p-5 border border-[#ffeed4]">
                      <h4 className="text-lg font-extrabold text-[#a16207] mb-4">{tx("📥 Inbound — Content kéo khách", "📥 Inbound — Content attraction")}</h4>
                      <ul className="space-y-4 text-[0.85rem] text-gray-700">
                        <li><strong className="text-gray-900">{tx("✍️ Post cá nhân 1-2 lần/tuần:", "✍️ Personal posts 1-2 times/week:")}</strong> {tx("Pain của chủ shop, kết quả thực tế, tips marketing nhỏ. Thật là đủ.", "Shop owners' pain, real results, small marketing tips. Being authentic is enough.")}</li>
                        <li><strong className="text-gray-900">{tx("🎬 Video ngắn:", "🎬 Short videos:")}</strong> {tx("\"Shop mất bao nhiêu đơn vì rep chậm?\", case study thực tế. Không cần production fancy.", "\"How many orders do shops lose due to slow replies?\", real case studies. No fancy production needed.")}</li>
                        <li><strong className="text-gray-900">{tx("💬 Comment có giá trị:", "💬 Valuable comments:")}</strong> {tx("Vào post của khách hàng tiềm năng, comment insight thực sự hữu ích — không phải \"dùng Markee đi\".", "Go to potential clients' posts, drop genuinely useful insights — not just \"use Markee\".")}</li>
                        <li><strong className="text-gray-900">{tx("👤 Founder/Leader branding:", "👤 Founder/Leader branding:")}</strong> {tx("CEO và leader post về kinh nghiệm thực chiến → khách tự tìm đến.", "CEO and leaders post about practical experience → clients will come naturally.")}</li>
                      </ul>
                    </div>
                  </motion.div>
                )}
                
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
