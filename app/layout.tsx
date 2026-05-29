import type { Metadata } from "next";
import { Geist, Geist_Mono, DM_Sans } from "next/font/google";
import "./globals.css";
import ClientI18nProvider from "./components/ClientI18nProvider";
import ConditionalHeader from "./components/ConditionalHeader";
import SocialFloat from "./components/SocialFloat";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Markee AI Marketing - Nền tảng AI Marketing tất cả trong một",
  description:
    "Markee là nền tảng AI Marketing giúp bạn tạo nội dung nhanh gấp 10 lần và tăng trưởng bằng dữ liệu thật. Dùng thử MIỄN PHÍ 1 tháng!",
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
      <head>
        <Script id="chatwoot-widget" strategy="afterInteractive">{`
          if (!window.__markeeChatwootInitialized) {
            window.__markeeChatwootInitialized = true;
            window.chatwootSettings = {"position":"right","type":"standard","launcherTitle":"","hideMessageBubble":true};
            (function(d,t) {
              var BASE_URL="https://crm.smb.markeeai.com";
              var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
              g.src=BASE_URL+"/packs/js/sdk.js";
              g.async = true;
              s.parentNode.insertBefore(g,s);
              g.onload=function(){
                window.chatwootSDK.run({
                  websiteToken: 'oBoaPY8grWDTu8KY68jn8m7z',
                  baseUrl: BASE_URL
                });
              };
            })(document,"script");
          }
        `}</Script>
        <Script id="chunk-error-reload" strategy="afterInteractive">{`
          window.addEventListener('error', function(e) {
            if (e && e.message && e.message.toLowerCase().includes('chunkloaderror')) {
              window.location.reload();
            }
          });
        `}</Script>
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-PTXW47KK');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dmSans.variable} overflow-x-hidden antialiased bg-white text-gray-900`}
      >
        <ClientI18nProvider>
          <ConditionalHeader />
          {children}
          <SocialFloat />
        </ClientI18nProvider>
      </body>
    </html>
  );
}

