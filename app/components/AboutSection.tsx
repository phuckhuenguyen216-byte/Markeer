import React from 'react';

export default function AboutSection() {
  const coreValues = [
    {
      title: "Tạo nội dung AI đa nền tảng",
      description: "Facebook, TikTok, Instagram, Ads chỉ trong vài giây với đúng giọng thương hiệu & ngành hàng."
    },
    {
      title: "Quản lý kế hoạch & lịch marketing tập trung",
      description: "Lập kế hoạch tuần/tháng, tránh trùng lặp & bỏ sót nội dung một cách hiệu quả."
    },
    {
      title: "Phân tích hiệu quả fanpage theo dữ liệu real-time",
      description: "Theo dõi lượt tiếp cận, tương tác, top bài viết, tăng trưởng liên tục."
    },
    {
      title: "AI đề xuất chiến lược dựa trên hiệu suất thực tế",
      description: "Gợi ý nội dung, lịch đăng, content pillar dựa trên dữ liệu thật và xu hướng."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Markee là gì?
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Markee là nền tảng AI Marketing dành cho doanh nghiệp hiện đại, giúp bạn thay thế nhiều công cụ rời rạc bằng một hệ thống thông minh duy nhất.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {coreValues.map((value, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{index + 1}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}