
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import ClientI18nProvider from "./components/ClientI18nProvider";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Markee AI Marketing - Nền tảng AI Marketing tất cả trong một",
  description: "Markee là nền tảng AI Marketing giúp bạn tạo nội dung nhanh gấp 10 lần và tăng trưởng bằng dữ liệu thật. Dùng thử MIỄN PHÍ 1 tháng!",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}
      >
        <ClientI18nProvider>
          <Header />
          <div className="pt-16">
            {children}
          </div>
        </ClientI18nProvider>
      </body>
    </html>
  );
}
