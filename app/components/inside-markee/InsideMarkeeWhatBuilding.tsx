"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { useInsideMarkeeLocale } from "./useInsideMarkeeLocale";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
  viewport: { once: true, amount: 0.2 },
});

export default function InsideMarkeeWhatBuilding() {
  const { tx } = useInsideMarkeeLocale();

  const perceivedList = ["AI", "Chatbot", tx("Tự động hóa", "Automation"), "Website", "Ads", tx("Công cụ", "Tools")];
  const neededList = [
    tx("Nhiều đơn hơn", "More orders"),
    tx("Rep nhanh hơn", "Faster replies"),
    tx("Ít việc tay hơn", "Less manual work"),
    tx("Vận hành mượt hơn", "Smoother operations"),
    tx("Tăng trưởng tốt hơn", "Better growth"),
  ];

  const analogies = [
    {
      brand: "Shopee",
      logo: "/shoppelogo.jpg",
      noSell: tx("Không bán app.", "Not just an app."),
      sell: tx("mua hàng nhanh hơn", "faster shopping"),
      zoomClass: "scale-[1.28]",
    },
    {
      brand: "Grab",
      logo: "/grablogo.png",
      noSell: tx("Không bán app.", "Not just an app."),
      sell: tx("di chuyển nhanh hơn", "faster mobility"),
      zoomClass: "scale-100",
    },
    {
      brand: "MoMo",
      logo: "/momologo.png",
      noSell: tx("Không bán ví điện tử.", "Not just an e-wallet."),
      sell: tx("thanh toán tiện hơn", "easier payments"),
      zoomClass: "scale-100",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-white py-24 sm:py-28 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(11,16,32,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(11,16,32,0.035)_1px,transparent_1px)] bg-[size:58px_58px]" />
      <div className="pointer-events-none absolute right-[-12rem] top-8 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(255,77,77,0.17)_0%,rgba(255,140,170,0.1)_40%,rgba(255,255,255,0)_76%)] blur-3xl" />

      <div className="relative mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <motion.p {...fadeUp(0)} className="text-sm font-semibold tracking-[0.15em] text-[#0b1020]/80 uppercase">
          {tx("THỨ CHÚNG TA THẬT SỰ ĐANG XÂY", "WHAT WE ACTUALLY BUILD")}
        </motion.p>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[0.96fr_1.04fr]">
          <motion.div {...fadeUp(0.05)}>
            <h2 className="text-[48px] leading-[1.02] font-extrabold tracking-[-0.03em] text-[#0b1020] sm:text-[68px] lg:text-[84px]">
              {tx("Chúng ta thật sự", "What are we")}
              <br />
              {tx("đang bán gì?", "actually selling?")}
            </h2>

            <div className="mt-8 space-y-2 text-[2.6rem] leading-[1.08] font-bold tracking-[-0.02em] text-[#0b1020] sm:text-[3.1rem]">
              <p>{tx("Khách hàng", "Customers")}</p>
              <p>{tx("không mua AI.", "do not buy AI.")}</p>
              <p>{tx("Họ mua", "They buy")}</p>
              <p className="bg-gradient-to-r from-[#FF3B3B] to-[#FF647E] bg-clip-text text-transparent">{tx("kết quả.", "outcomes.")}</p>
            </div>

            <p className="mt-6 max-w-xl text-xl leading-9 text-[#0b1020]/74">
              {tx("AI chỉ là lớp công nghệ phía sau.", "AI is the technology layer in the backend.")}
            </p>
          </motion.div>

          <motion.div initial={false} animate={{ y: [0, -4, 0] }} transition={{ duration: 5.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }} className="overflow-hidden rounded-[30px] border border-red-100 bg-white/95 shadow-[0_28px_70px_-34px_rgba(255,77,77,0.45)]">
            <div className="relative h-[280px] w-full bg-white sm:h-[460px]">
              <Image src="/banners3.png" alt={tx("Markee outcome visual", "Markee outcome visual")} fill quality={100} priority className="object-contain p-2 opacity-100 sm:p-3" sizes="(min-width: 1024px) 52vw, 100vw" />
            </div>
          </motion.div>
        </div>

        <motion.div {...fadeUp(0.15)} className="relative mt-10 grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
          <article className="rounded-[26px] border border-red-100 bg-gradient-to-br from-[#fff8f9] to-white p-6 sm:p-7">
            <p className="text-xs font-bold tracking-[0.12em] text-red-500 uppercase">{tx("MỌI NGƯỜI NGHĨ", "PERCEIVED")}</p>
            <h3 className="mt-3 text-[2.3rem] leading-[1.08] font-bold tracking-[-0.02em] text-[#0b1020] sm:text-[2.7rem]">{tx("Mình đang bán:", "We are selling:")}</h3>
            <ul className="mt-5 grid gap-2 text-xl text-[#0b1020]/80 sm:grid-cols-2">
              {perceivedList.map((item) => (
                <li key={item} className="flex items-center gap-3 py-0.5"><XCircle className="h-4 w-4 text-red-500" />{item}</li>
              ))}
            </ul>
          </article>

          <div className="hidden items-center justify-center lg:flex">
            <motion.span animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }} transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }} className="inline-flex h-28 w-28 items-center justify-center rounded-full border border-slate-200 bg-white text-5xl font-extrabold text-red-400 shadow-[0_14px_34px_-20px_rgba(15,23,42,0.35)]">≠</motion.span>
          </div>

          <article className="rounded-[26px] border border-red-100 bg-gradient-to-br from-[#fff8fa] to-white p-6 sm:p-7">
            <p className="text-xs font-bold tracking-[0.12em] text-red-500 uppercase">{tx("KHÁCH HÀNG THẬT SỰ CẦN", "REAL NEED")}</p>
            <h3 className="mt-3 text-[2.3rem] leading-[1.08] font-bold tracking-[-0.02em] text-[#0b1020] sm:text-[2.7rem]">{tx("Những điều này:", "These outcomes:")}</h3>
            <ul className="mt-5 grid gap-2 text-xl text-[#0b1020]/88 sm:grid-cols-2">
              {neededList.map((item) => (
                <li key={item} className="flex items-center gap-3 py-0.5"><CheckCircle2 className="h-4 w-4 text-red-500" />{item}</li>
              ))}
            </ul>
          </article>
        </motion.div>

        <motion.div {...fadeUp(0.2)} className="mt-8 rounded-[30px] border border-red-100 bg-white p-4 sm:mt-10 sm:p-7">
          <p className="text-xs font-bold tracking-[0.12em] text-red-500 uppercase">{tx("THẾ GIỚI CŨNG VẬY", "REAL-WORLD ANALOGY")}</p>
          <div className="mt-3 grid gap-3 sm:mt-4 sm:gap-4 md:grid-cols-3">
            {analogies.map((item, index) => (
              <motion.article key={item.brand} animate={{ y: [0, -4, 0] }} transition={{ duration: 3 + index * 0.7, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }} className="rounded-[18px] border border-slate-200 bg-white p-3 shadow-[0_14px_36px_-28px_rgba(15,23,42,0.45)] sm:rounded-[22px] sm:p-5">
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-red-100 bg-white shadow-[0_12px_24px_-18px_rgba(255,77,77,0.45)] sm:h-20 sm:w-20">
                    <span className="inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full sm:h-16 sm:w-16">
                      <Image src={item.logo} alt={`${item.brand} logo`} width={64} height={64} className={`h-full w-full object-cover ${item.zoomClass}`} />
                    </span>
                  </span>
                  <h4 className="text-[1.22rem] font-bold tracking-[-0.02em] text-[#0b1020] sm:text-[2rem]">{item.brand}</h4>
                </div>
                <p className="mt-2 text-[0.88rem] text-[#0b1020]/78 sm:mt-4 sm:text-xl">{item.noSell}</p>
                <p className="mt-2 flex items-center gap-2 text-[0.88rem] font-semibold text-[#0b1020] sm:text-xl">
                  <ArrowRight className="h-4 w-4 text-red-500" />
                  <span className="rounded-xl bg-slate-100 px-2.5 py-1.5 text-[0.82rem] text-[#0b1020] sm:text-[1.1rem]">{item.sell}</span>
                </p>
              </motion.article>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-red-100 bg-gradient-to-r from-[#fff8f8] to-[#fff2f5] px-4 py-3 sm:mt-5 sm:px-5 sm:py-4">
            <p className="text-[1.28rem] leading-[1.23] font-bold tracking-[-0.02em] text-[#0b1020] sm:text-[2rem] sm:leading-[1.2] lg:text-[2.4rem]">
              {tx("Công nghệ chỉ là phương tiện.", "Technology is only the vehicle.")}
              <br />
              <span className="bg-gradient-to-r from-[#FF3B3B] to-[#FF5F7B] bg-clip-text text-transparent">{tx("Outcome mới là thứ khách hàng trả tiền.", "Outcome is what customers pay for.")}</span>
            </p>
          </div>
        </motion.div>

        <motion.div {...fadeUp(0.25)} className="mt-10 rounded-[30px] border border-red-100 bg-white p-6 shadow-[0_20px_55px_-34px_rgba(255,77,77,0.4)] sm:p-8">
          <p className="text-xs font-bold tracking-[0.12em] text-red-500 uppercase">{tx("HỆ SINH THÁI CHÚNG TA XÂY", "STACKED ECOSYSTEM ARCHITECTURE")}</p>

          <div className="mt-5 space-y-3.5">
            <div className="grid gap-3 md:grid-cols-[230px_1fr]">
              <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-4">
                <p className="text-xs font-bold tracking-[0.12em] text-red-500 uppercase">01</p>
                <p className="mt-1 text-xl font-bold text-red-600">{tx("NỀN TẢNG", "FOUNDATION")}</p>
              </div>
              <div className="rounded-2xl border border-red-100 bg-white px-4 py-4">
                <div className="flex flex-wrap gap-2.5 text-sm font-semibold text-slate-700 sm:text-base">{["AI", "Automation", "Data", "Infrastructure"].map((item) => <span key={item} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">{item}</span>)}</div>
              </div>
            </div>

            <div className="flex justify-center"><ArrowDown className="h-5 w-5 text-red-400" /></div>

            <div className="grid gap-3 md:grid-cols-[230px_1fr]">
              <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-4">
                <p className="text-xs font-bold tracking-[0.12em] text-red-500 uppercase">02</p>
                <p className="mt-1 text-xl font-bold text-red-600">{tx("VẬN HÀNH", "OPERATIONS")}</p>
              </div>
              <div className="rounded-2xl border border-red-100 bg-white px-4 py-4">
                <div className="flex flex-wrap gap-2.5 text-sm font-semibold text-slate-700 sm:text-base">{["Sales", "Marketing", "Support", "Internal Ops"].map((item) => <span key={item} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">{item}</span>)}</div>
              </div>
            </div>

            <div className="flex justify-center"><ArrowDown className="h-5 w-5 text-red-400" /></div>

            <div className="grid gap-3 md:grid-cols-[230px_1fr]">
              <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-4">
                <p className="text-xs font-bold tracking-[0.12em] text-red-500 uppercase">03</p>
                <p className="mt-1 text-xl font-bold text-red-600">{tx("KẾT QUẢ", "OUTCOME")}</p>
              </div>
              <div className="rounded-2xl border border-red-100 bg-white px-4 py-4">
                <div className="flex flex-wrap gap-2.5 text-sm font-semibold text-slate-700 sm:text-base">{[tx("tăng trưởng", "growth"), tx("nhanh hơn", "faster"), tx("ít chi phí hơn", "lower cost"), tx("scale tốt hơn", "better scale")].map((item) => <span key={item} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">{item}</span>)}</div>
              </div>
            </div>

            <div className="flex justify-center"><ArrowDown className="h-5 w-5 text-red-400" /></div>

            <div className="rounded-2xl border border-red-100 bg-gradient-to-r from-[#fff8f8] to-[#fff2f5] px-5 py-5 text-center">
              <p className="text-xs font-bold tracking-[0.12em] text-red-500 uppercase">04</p>
              <p className="mt-1 text-[2rem] font-bold tracking-[-0.02em] text-red-600 sm:text-[2.4rem]">{tx("HỆ SINH THÁI KINH DOANH DÀI HẠN", "Long-term Business Ecosystem")}</p>
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp(0.3)} className="mt-9 rounded-[30px] border border-red-100 bg-gradient-to-r from-[#fff8ee] to-[#fff6e8] p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-[2.6rem] leading-[1.08] font-bold tracking-[-0.03em] text-[#0b1020] sm:text-[3rem]">
                {tx("Chúng ta không build tool.", "We do not build tools.")}
                <br />
                <span className="bg-gradient-to-r from-[#FF3B3B] to-[#FF5F7B] bg-clip-text text-transparent">{tx("Chúng ta build:", "We build:")}</span>
              </p>

              <div className="mt-4 flex flex-wrap gap-2.5 text-base font-semibold text-slate-700 sm:text-lg">
                {[tx("hệ thống", "systems"), tx("vận hành", "operations"), tx("tăng trưởng", "growth"), tx("business outcome thực tế", "real business outcomes")].map((item) => (
                  <span key={item} className="rounded-full border border-amber-200 bg-white px-4 py-2">{item}</span>
                ))}
              </div>
            </div>

            <p className="text-lg leading-9 text-[#0b1020]/75">
              {tx(
                "Đó là lý do tài liệu này tồn tại: để cả team nhìn cùng một bức tranh và giữ đúng hướng khi triển khai.",
                "This section exists so the team shares one picture and stays aligned in execution."
              )}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
