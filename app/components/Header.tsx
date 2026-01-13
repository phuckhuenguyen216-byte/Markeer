import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-20 bg-white/70 backdrop-blur-md border-b border-gray-200/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Markee AI Marketing" className="h-8 w-auto" />
          <span className="text-lg font-semibold tracking-tight">Markee</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-700">
          <a href="#features" className="hover:text-gray-900">Tính năng</a>
          <Link href="https://marketing.hiagi.ai/" className="hover:text-gray-900" target="_blank">Đăng ký</Link>
          <Link href="https://marketing.hiagi.ai/" className="hover:text-gray-900" target="_blank">Truy cập ứng dụng</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="https://marketing.hiagi.ai/"
            target="_blank"
            className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-colors"
          >
            Đăng ký
          </Link>
        </div>
      </div>
    </header>
  );
}
