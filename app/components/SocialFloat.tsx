"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    $chatwoot?: {
      toggle: () => void;
    };
  }
}

type SocialItem = {
  name: string;
  bg: string;
  icon: React.ReactNode;
  href?: string;
  action?: "chatwoot";
};

const socials: SocialItem[] = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/markeeaimarketing",
    bg: "bg-blue-600",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: "Zalo",
    href: "https://zalo.me/2031335970632550296",
    bg: "bg-blue-500",
    icon: <span className="text-white text-[11px] font-black leading-none">Zalo</span>,
  },
  {
    name: "Discord",
    href: "https://discord.com/channels/1443163286773170218/1443240299416522924",
    bg: "bg-indigo-500",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
      </svg>
    ),
  },
  {
    name: "Viber",
    href: "https://invite.viber.com/?g2=AQAP4%2FUS7E8NqlYDXE7sn5XUpn3hiArfFeLU0p%2FXKJ2RjplQ4QvPZqwYHFpQj6ew",
    bg: "bg-purple-600",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
        <path d="M11.398.002C9.473.028 5.331.344 3.014 2.467 1.294 4.187.541 6.77.46 9.947c-.08 3.177-.185 9.133 5.604 10.76h.005l-.003 2.46s-.04.993.616 1.195c.793.243 1.26-.51 2.018-1.324.415-.446.988-1.102 1.42-1.603 3.91.33 6.916-.423 7.26-.534.794-.257 5.288-.834 6.024-6.806.76-6.163-.357-10.056-2.344-11.801C19.103.925 14.723-.034 11.398.002zm.297 1.93c2.93-.036 6.716.672 8.488 2.26 1.621 1.423 2.47 4.748 1.82 10.099-.596 4.83-4.087 5.17-4.756 5.387-.285.093-2.836.728-6.163.533 0 0-2.44 2.943-3.2 3.709-.12.12-.26.167-.353.145-.13-.031-.166-.181-.165-.399l.02-4.029c-4.77-1.337-4.49-6.27-4.424-8.881.065-2.612.668-4.79 2.075-6.167C6.578 3.075 8.764 1.968 11.695 1.932z" />
      </svg>
    ),
  },
  {
    name: "Telegram",
    href: "https://t.me/+zl4qiUlVDQ44ZDE9",
    bg: "bg-sky-500",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/markeeaimarketing1111/",
    bg: "bg-linear-to-br from-yellow-400 via-pink-500 to-purple-600",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    name: "Messenger",
    href: "https://m.me/markeeaimarketing",
    bg: "bg-blue-500",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
        <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.301 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111S18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8.2l3.131 3.259L19.752 8.2l-6.561 6.763z" />
      </svg>
    ),
  },
  {
    name: "Chatwoot",
    action: "chatwoot",
    bg: "bg-yellow-400",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3C7.029 3 3 6.805 3 11.5C3 14.221 4.353 16.642 6.46 18.209V21L9.331 19.424C10.172 19.673 11.067 19.806 12 19.806C16.971 19.806 21 16.001 21 11.306C21 6.611 16.971 3 12 3Z"
          fill="white"
        />
      </svg>
    ),
  },
];

export default function SocialFloat() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    if (pathname?.startsWith("/admin")) return;
    const onScroll = () => setShowScroll(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const toggleChatwoot = () => window.$chatwoot?.toggle();

  return (
    <div className="fixed right-4 bottom-4 z-9999 flex flex-col items-end gap-2">
      {/* Social icons (revealed on mascot click) */}
      <div
        className={`flex flex-col gap-2 transition-all duration-300 origin-bottom ${
          open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-75 pointer-events-none h-0 overflow-hidden"
        }`}
      >
        {socials.map((s) =>
          s.action === "chatwoot" ? (
            <button
              key={s.name}
              type="button"
              title={s.name}
              onClick={toggleChatwoot}
              className={`w-12 h-12 rounded-full ${s.bg} flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200 cursor-pointer`}
            >
              {s.icon}
            </button>
          ) : (
            <a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              title={s.name}
              className={`w-12 h-12 rounded-full ${s.bg} flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200`}
            >
              {s.icon}
            </a>
          )
        )}
      </div>

      {/* Mascot toggle button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Toggle social links"
        className={`w-14 h-14 rounded-full bg-white border-2 border-red-200 shadow-xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:shadow-2xl ${
          open ? "scale-110" : ""
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/img/mascot/Pip-logo.png"
          alt="Chat"
          className="w-10 h-10 rounded-full object-cover"
        />
      </button>

      {/* Scroll to top button (below mascot) */}
      {showScroll && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="w-12 h-12 rounded-full bg-linear-to-br from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg flex items-center justify-center cursor-pointer transition-all hover:scale-110"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}
