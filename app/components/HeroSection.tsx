import React from 'react';
import Image from 'next/image';

export default function HeroSection() {
  const scrollToForm = () => {
    const formElement = document.getElementById('registration-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[80vh] sm:min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50 to-purple-50" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Hiagi AI Marketing
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
              Nền tảng AI Marketing giúp bạn tạo nội dung nhanh gấp 10 lần & tăng trưởng bằng dữ liệu thật
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-6 leading-relaxed">
              Hiagi là nền tảng AI tất cả trong một giúp doanh nghiệp, shop và agency tạo nội dung – quản lý kế hoạch – phân tích hiệu quả marketing chỉ trong một nơi duy nhất.
            </p>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full mb-4 shadow-lg">
              <span className="text-xl">🎁</span>
              <span className="font-semibold">Ưu đãi đặc biệt cho người dùng mới</span>
            </div>
            <p className="text-base font-medium text-gray-800 mb-6">
              Dùng thử <span className="text-green-600 font-bold">MIỄN PHÍ 1 tháng</span> – 1000 AI credit
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <button
                onClick={scrollToForm}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full text-base font-semibold hover:from-blue-700 hover:to-purple-700 transition-colors shadow-lg"
              >
                Đăng ký nhận ưu đãi
              </button>
              <div className="text-gray-600">
                <span className="mr-4">✔ Không cần thẻ tín dụng</span>
                <span>✔ Kích hoạt ngay</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-8 -left-8 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply blur-2xl opacity-30" />
            <div className="absolute -bottom-8 -right-8 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply blur-2xl opacity-30" />
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-white/20">
              <Image
                src="/dashboard.png"
                alt="Hiagi dashboard mockup"
                width={800}
                height={800}
                className="w-full h-auto rounded-xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
