import React from 'react';
import Link from 'next/link';

export default function RegistrationForm() {
  return (
    <section id="registration-form" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-6 tracking-tight">
          Sẵn sàng bùng nổ doanh số với Markee AI?
        </h2>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Gia nhập cộng đồng 10,000+ marketer thông minh đang sử dụng AI để tối ưu hóa công việc mỗi ngày.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="https://marketing.hiagi.ai/"
            target="_blank"
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold text-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Bắt đầu miễn phí ngay
          </Link>
          <Link
             href="https://marketing.hiagi.ai/"
             target="_blank"
             className="w-full sm:w-auto px-8 py-4 bg-white text-gray-800 border border-gray-200 rounded-full font-bold text-lg hover:bg-gray-50 transition-all duration-300"
          >
            Xem demo sản phẩm
          </Link>
        </div>
      </div>
    </section>
  );
}
