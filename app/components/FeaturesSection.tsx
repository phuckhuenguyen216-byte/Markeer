import React from 'react';

export default function FeaturesSection() {
  const features = [
    {
      group: "CREATE (TẠO NỘI DUNG)",
      items: [
        {
          title: "AI Content Generator",
          description: "Tạo nội dung cho Facebook, TikTok, Instagram, Ads chỉ trong vài giây. Viết đúng giọng thương hiệu & ngành hàng.",
          icon: "✍️"
        },
        {
          title: "AI Gợi ý ý tưởng & concept",
          description: "Đề xuất chủ đề, concept theo ngành hàng & xu hướng.",
          icon: "💡"
        }
      ]
    },
    {
      group: "PLAN & MANAGE (LẬP KẾ HOẠCH)",
      items: [
        {
          title: "Lập kế hoạch & lịch nội dung",
          description: "Quản lý kế hoạch tuần/tháng, tránh trùng lặp & bỏ sót nội dung.",
          icon: "📅"
        },
        {
          title: "Làm việc nhóm",
          description: "Giao việc – phê duyệt – theo dõi tiến độ trong một nền tảng.",
          icon: "👥"
        },
        {
          title: "Kho tài nguyên thông minh",
          description: "Lưu trữ nội dung AI, media, template tập trung.",
          icon: "📚"
        }
      ]
    },
    {
      group: "ANALYZE & OPTIMIZE (PHÂN TÍCH)",
      items: [
        {
          title: "Phân tích hiệu quả Fanpage",
          description: "Theo dõi: lượt tiếp cận, tương tác, top bài viết, tăng trưởng.",
          icon: "📊"
        },
        {
          title: "So sánh đa Fanpage",
          description: "So sánh hiệu suất để xác định trang mạnh – yếu.",
          icon: "⚖️"
        },
        {
          title: "AI đề xuất chiến lược",
          description: "Gợi ý nội dung, lịch đăng, content pillar dựa trên dữ liệu thật.",
          icon: "🎯"
        }
      ]
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Tính năng nổi bật
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tất cả công cụ bạn cần để xây dựng chiến lược marketing hiệu quả trong một nền tảng duy nhất
          </p>
        </div>

        <div className="space-y-16">
          {features.map((group, groupIndex) => (
            <div key={groupIndex}>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {group.group}
                </h3>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
              </div>

              <div className={`grid grid-cols-1 md:grid-cols-${group.items.length > 2 ? '3' : '2'} gap-6`}>
                {group.items.map((feature, index) => (
                  <div 
                    key={index}
                    className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl">
                          {feature.icon}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-900 mb-3">
                          {feature.title}
                        </h4>
                        <p className="text-gray-600 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Markee giúp bạn xây chiến lược marketing dựa trên dữ liệu – không cảm tính
            </h3>
            <p className="text-lg text-gray-700">
              Mọi quyết định đều được đề xuất bởi AI dựa trên dữ liệu thực tế, giúp bạn tối ưu hiệu quả marketing một cách khoa học.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}