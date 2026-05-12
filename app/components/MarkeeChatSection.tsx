"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Bot,
  MessagesSquare,
  Sparkles,
  UsersRound,
} from "lucide-react";

const CHAT_URL = "https://chat.markeeai.com/";

const highlights = [
  {
    icon: MessagesSquare,
    title: "Hội thoại đa kênh",
    text: "Gom Facebook, Zalo, TikTok và Website vào một luồng xử lý tập trung.",
  },
  {
    icon: UsersRound,
    title: "Hồ sơ khách hàng",
    text: "Lưu lịch sử tương tác, ghi chú và trạng thái chăm sóc rõ ràng cho từng khách.",
  },
  {
    icon: Bot,
    title: "Tự động hóa vận hành",
    text: "Gắn nhãn, phân tuyến, tóm tắt hội thoại và giảm thao tác lặp lại cho đội ngũ.",
  },
];

export default function MarkeeChatSection() {
  return (
    <section className="relative overflow-hidden bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="relative mx-auto max-w-6xl">
        <div className="flex flex-col gap-10">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
              <Sparkles size={16} />
              Markee Chat AI
            </div>

            <h2 className="mx-auto mt-5 max-w-4xl text-3xl font-bold leading-tight tracking-normal text-gray-950 sm:text-4xl lg:text-5xl">
              Quản lý toàn bộ hội thoại và khách hàng trên một nền tảng duy nhất
            </h2>

            <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-gray-600 sm:text-lg">
              Markee Chat kết nối các kênh bán hàng và chăm sóc khách hàng vào một hệ
              thống tập trung, giúp doanh nghiệp phản hồi nhanh hơn, không bỏ sót khách
              hàng và theo dõi tiến độ xử lý rõ ràng hơn.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {highlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600">
                      <Icon size={20} />
                    </div>
                    <h3 className="text-sm font-bold text-gray-950">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-gray-600">{item.text}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex justify-center">
              <Link
                href={CHAT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-red-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition-all hover:-translate-y-0.5 hover:bg-red-600"
              >
                Truy cập Markee Chat
                <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>

          <Link
            href={CHAT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block overflow-hidden rounded-lg border border-gray-200 bg-gray-50 shadow-2xl shadow-gray-900/10"
            aria-label="Mở trang Markee Chat"
          >
            <Image
              src="/img/markechat/banner.png"
              alt="Giao diện Markee Chat AI"
              width={1440}
              height={820}
              sizes="(max-width: 1280px) 100vw, 1152px"
              className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-lg bg-white/92 px-4 py-3 shadow-lg backdrop-blur">
              <div>
                <p className="text-sm font-bold text-gray-950">Markee Chat</p>
                <p className="text-xs text-gray-500">Không bỏ sót hội thoại khách hàng</p>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-white">
                <ArrowUpRight size={18} />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
