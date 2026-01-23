"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Footer from "../components/Footer";
import ChatwootWidget from "../components/ChatwootWidget";
import SocialMedia from "../components/SocialMedia";

const sections = [
  { id: "section-1", title: "1. Giới thiệu về Chính sách bảo mật" },
  { id: "section-2", title: "2. Thông tin chúng tôi thu thập" },
  { id: "section-3", title: "3. Mục đích sử dụng thông tin" },
  { id: "section-4", title: "4. Chia sẻ thông tin của bạn" },
  { id: "section-5", title: "5. Lưu trữ và xử lý dữ liệu" },
  { id: "section-6", title: "6. Quyền và lựa chọn của bạn" },
  { id: "section-7", title: "7. Bảo mật thông tin của bạn" },
  { id: "section-8", title: "8. Dữ liệu AI và Nội dung người dùng" },
  { id: "section-9", title: "9. Thông tin liên quan đến trẻ em" },
  { id: "section-10", title: "10. Tuân thủ pháp luật" },
  { id: "section-11", title: "11. Cập nhật chính sách bảo mật" },
  { id: "section-12", title: "12. Liên hệ" },
];

export default function PrivacyPolicyPage() {
  const [open, setOpen] = useState(false);

   return (
    <>
    <ChatwootWidget />
    <SocialMedia />
    <div className="relative lg:flex lg:gap-0">


      {/* ================= MOBILE TOC ================= */}
        <div className="lg:hidden">
        <aside
            className={`
            fixed top-16 left-[-40px] z-50
            h-[calc(110vh-5rem)]
            bg-white
            transition-all duration-300 ease-in-out
            ${open ? "w-90" : "w-10"}
            `}
        >
            {/* Toggle button */}
            <button
            onClick={() => setOpen(!open)}
            className="
                absolute -right-10 top-3 w-8 h-8
                bg-gray-800 text-white rounded-full
                flex items-center justify-center shadow
            "
            >
            {open ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>

            {open && (
            <div className="px-12 py-6 h-full overflow-y-auto">
                <h3 className="text-sm font-semibold mb-4 text-gray-900">
                Danh mục
                </h3>

                <ul className="space-y-2">
                {sections.map((item) => (
                    <li key={item.id}>
                    <Link
                        href={`#${item.id}`}
                        className="
                        block text-sm text-gray-700
                        px-3 py-2 rounded-md
                        transition-all
                        hover:bg-gray-50
                        hover:pl-4
                        "
                        onClick={() => setOpen(false)} // click là đóng
                    >
                        {item.title}
                    </Link>
                    </li>
                ))}
                </ul>
            </div>
            )}
        </aside>
        </div>

      {/* ================= DESKTOP TOC (GIỮ NGUYÊN) ================= */}
      <aside
        className="
          hidden lg:block
          sticky top-24
          left-20
          z-40

          w-90               /* cố định width */
          h-[calc(100vh-120px)]

          self-start
          bg-white
          border-r border-gray-200
        "
      >
        <div className="pl-8 pr-6 py-2 h-full overflow-y-auto">
          <h3 className="text-lg font-semibold mb-6 text-gray-900">
            Danh mục
          </h3>

          <ul className="space-y-2">
            {sections.map((item) => (
              <li key={item.id}>
                <Link
                  href={`#${item.id}`}
                  className="
                    group relative overflow-hidden block
                    text-sm font-medium

                    px-4 py-1
                    rounded-lg

                    text-gray-700
                    transition-colors duration-300
                  "
                >
                  {/* Overlay nền đen trượt */}
                  <span
                    className="
                      absolute inset-0
                      bg-black
                      -translate-x-full
                      transition-transform duration-500 ease-out
                      group-hover:translate-x-0
                    "
                  />

                  {/* Thanh nhấn bên trái (giữ nguyên, nhưng nổi trên nền) */}
                  <span
                    className="
                      absolute left-0 top-1/2 -translate-y-1/2
                      h-5 w-[3px]
                      rounded-full
                      bg-white

                      opacity-0 scale-y-0
                      transition-all duration-300
                      group-hover:opacity-100
                      group-hover:scale-y-100
                      z-10
                    "
                  />

                  {/* Text */}
                  <span
                    className="
                      relative z-10
                      transition-colors duration-500
                      group-hover:text-white
                    "
                  >
                    {item.title}
                  </span>
                </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>


      {/* ================= MAIN CONTENT ================= */}
     <main
        className="
          flex-1
          px-6
          pt-16          
          pb-24

          scroll-smooth
          transition-all duration-300

          lg:pl-[120px]
          lg:max-w-6xl
        "
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-10 text-center">
          CHÍNH SÁCH BẢO MẬT THÔNG TIN – MARKEE AI
        </h1>

        <div className="
          space-y-16
          text-gray-800
          leading-relaxed
          text-justify
          break-words
          hyphens-auto
          [&>section]:scroll-mt-28
        ">

          {/* 1 */}
          <section id="section-1" className="scroll-mt-28">
            <h2 className="text-2xl font-semibold mb-4">
              1. Giới thiệu về Chính sách bảo mật
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Về Markee AI:</strong> Chúng tôi là đơn vị cung cấp giải pháp
                trợ lý tiếp thị ứng dụng trí tuệ nhân tạo, giúp người dùng tối ưu hóa
                quy trình sáng tạo và quản lý nội dung.
              </li>
              <li>
                <strong>Đối tượng áp dụng:</strong> Chính sách này có hiệu lực với tất
                cả cá nhân, tổ chức đăng ký tài khoản, truy cập hoặc sử dụng bất kỳ
                tính năng nào trên hệ thống Markee AI.
              </li>
              <li>
                <strong>Phạm vi:</strong> Áp dụng cho mọi hoạt động thu thập dữ liệu
                thông qua website markeeai.com, các công cụ tùy chỉnh (widgets),
                và các dịch vụ tích hợp trực tiếp mà chúng tôi cung cấp.
              </li>
            </ul>
          </section>

          {/* 2 */}
          <section id="section-2" className="scroll-mt-28">
            <h2 className="text-2xl font-semibold mb-4">
                2. Thông tin chúng tôi thu thập
            </h2>

            <ul className="list-disc pl-6 space-y-3">
                <li>
                <strong>Thông tin tài khoản:</strong> Bao gồm tên đăng nhập, địa chỉ email,
                số điện thoại, mật khẩu (đã được mã hóa) và các thông tin liên quan đến doanh
                nghiệp như tên công ty, lĩnh vực kinh doanh để AI làm quen với ngữ cảnh.
                </li>

                <li>
                <strong>Thông tin sử dụng dịch vụ:</strong>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li>
                    <strong>Nội dung:</strong> Các câu lệnh (prompts), văn bản, hình ảnh
                    hoặc tài liệu bạn cung cấp để AI xử lý.
                    </li>
                    <li>
                    <strong>Lịch trình:</strong> Dữ liệu về việc lập kế hoạch bài viết,
                    thời gian đăng tải dự kiến.
                    </li>
                    <li>
                    <strong>Tương tác:</strong> Cách bạn phản hồi với các kết quả do AI tạo ra
                    (thao tác chỉnh sửa, sao chép, lưu trữ).
                    </li>
                </ul>
                </li>

                <li>
                <strong>Dữ liệu kết nối nền tảng bên thứ ba:</strong> Khi bạn thực hiện kết nối
                API (Facebook, Instagram, v.v.), chúng tôi thu thập các chỉ số về lượt tiếp cận,
                tương tác, danh sách trang quản lý và các mã định danh cần thiết để thực hiện
                việc đăng bài tự động hoặc phân tích dữ liệu.
                </li>

                <li>
                <strong>Dữ liệu kỹ thuật:</strong> Địa chỉ IP, loại thiết bị, hệ điều hành,
                trình duyệt, dữ liệu Cookies để ghi nhớ phiên đăng nhập và các tùy chỉnh giao
                diện của người dùng.
                </li>
            </ul>
            </section>
          {/* 3 */}
          <section id="section-3" className="scroll-mt-28">
            <h2 className="text-2xl font-semibold mb-4">
                3. Mục đích sử dụng thông tin
            </h2>

            <ul className="list-disc pl-6 space-y-3">
                <li>
                <strong>Cung cấp &amp; Vận hành:</strong> Đảm bảo các tính năng như tạo content,
                phân tích Fanpage và lập lịch hoạt động đúng chức năng và ổn định.
                </li>

                <li>
                <strong>Huấn luyện &amp; Cải thiện AI:</strong> Sử dụng dữ liệu tổng hợp để tinh
                chỉnh mô hình AI, giúp phản hồi của máy tính ngày càng tự nhiên và chính xác hơn.
                Chúng tôi cam kết không công khai hoặc bán dữ liệu thô của cá nhân cho mục đích này.
                </li>

                <li>
                <strong>Cá nhân hóa trải nghiệm:</strong> Phân tích thói quen sử dụng để đề xuất
                các mẫu (templates) hoặc chiến lược marketing phù hợp nhất với phong cách của bạn.
                </li>

                <li>
                <strong>Hỗ trợ &amp; Bảo mật:</strong> Xác thực danh tính khi đăng nhập, bảo vệ
                tài khoản khỏi các hành vi truy cập trái phép và phản hồi nhanh các yêu cầu hỗ trợ
                kỹ thuật.
                </li>
            </ul>
        </section>

          {/* 4 */}
        <section id="section-4" className="scroll-mt-28">
            <h2 className="text-2xl font-semibold mb-4">
                4. Chia sẻ thông tin của bạn
            </h2>

            <ul className="list-disc pl-6 space-y-3">
                <li>
                <strong>Đối tác hạ tầng &amp; AI:</strong> Để thực hiện việc xử lý ngôn ngữ,
                một phần dữ liệu (như prompt) có thể được gửi qua API của các bên cung cấp
                mô hình AI lớn (ví dụ: OpenAI). Dữ liệu này được chuyển giao dưới dạng mã hóa
                và tuân thủ điều khoản bảo mật của đối tác.
                </li>

                <li>
                <strong>Tuân thủ pháp luật:</strong> Chúng tôi sẽ tiết lộ thông tin cá nhân
                nếu có yêu cầu từ tòa án hoặc cơ quan nhà nước có thẩm quyền trong các trường
                hợp liên quan đến vi phạm pháp luật.
                </li>

                <li>
                <strong>Cam kết thương mại:</strong> Markee AI khẳng định không kinh doanh,
                bán hoặc cho thuê danh sách email, thông tin định danh hay dữ liệu doanh
                nghiệp của người dùng cho các bên quảng cáo thứ ba.
                </li>
            </ul>
        </section>
          {/* 5 */}
          <section id="section-5" className="scroll-mt-28">
            <h2 className="text-2xl font-semibold mb-4">
                5. Lưu trữ và xử lý dữ liệu
            </h2>

            <ul className="list-disc pl-6 space-y-3">
                <li>
                <strong>Vị trí lưu trữ:</strong> Dữ liệu của bạn được lưu trữ trên hệ thống
                máy chủ điện toán đám mây (Cloud Server) đạt tiêu chuẩn quốc tế, đảm bảo
                tính sẵn sàng cao và khả năng phục hồi sau sự cố.
                </li>

                <li>
                <strong>Thời gian lưu trữ:</strong>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li>
                    Thông tin tài khoản được giữ lại cho đến khi người dùng yêu cầu xóa
                    hoặc ngừng sử dụng dịch vụ hoàn toàn.
                    </li>
                    <li>
                    Dữ liệu lịch sử (log) và các phiên làm việc có thể được lưu trữ trong
                    thời gian ngắn hơn (thường từ 6–24 tháng) để phục vụ mục đích phân tích
                    kỹ thuật.
                    </li>
                </ul>
                </li>

                <li>
                <strong>Xử lý khi hủy tài khoản:</strong> Khi bạn thực hiện lệnh xóa tài
                khoản, hệ thống sẽ tiến hành xóa hoặc ẩn danh hóa toàn bộ thông tin cá nhân
                trong vòng 30 ngày, trừ các dữ liệu liên quan đến hóa đơn thanh toán phải
                giữ lại theo quy định thuế.
                </li>
            </ul>
        </section>


          {/* 6 */}
          <section id="section-6" className="scroll-mt-28">
            <h2 className="text-2xl font-semibold mb-4">
                6. Quyền và lựa chọn của bạn
            </h2>

            <ul className="list-disc pl-6 space-y-3">
                <li>
                <strong>Truy cập và Chỉnh sửa:</strong> Bạn có thể tự cập nhật thông tin cá
                nhân hoặc cài đặt thương hiệu bất kỳ lúc nào trong Dashboard.
                </li>

                <li>
                <strong>Xuất dữ liệu:</strong> Markee AI cung cấp công cụ giúp bạn trích
                xuất các nội dung đã tạo hoặc các báo cáo phân tích ra định dạng phổ biến
                (như PDF, Excel).
                </li>

                <li>
                <strong>Xóa dữ liệu:</strong> Người dùng có quyền yêu cầu xóa bỏ hoàn toàn
                các nội dung đã tạo hoặc toàn bộ hồ sơ cá nhân trên hệ thống.
                </li>

                <li>
                <strong>Quản lý liên kết:</strong> Bạn hoàn toàn chủ động trong việc cấp
                quyền hoặc hủy kết nối (Revoke) với các nền tảng mạng xã hội ngay tại giao
                diện cài đặt.
                </li>
            </ul>
        </section>

          {/* 7 */}
          <section id="section-7" className="scroll-mt-28">
            <h2 className="text-2xl font-semibold mb-4">
                7. Bảo mật thông tin của bạn
            </h2>

            <ul className="list-disc pl-6 space-y-3">
                <li>
                <strong>Biện pháp kỹ thuật:</strong> Chúng tôi áp dụng chuẩn mã hóa SSL/TLS
                cho toàn bộ dữ liệu truyền tải giữa máy tính người dùng và máy chủ. Dữ liệu
                nhạy cảm được bảo vệ bởi nhiều lớp tường lửa.
                </li>

                <li>
                <strong>Kiểm soát nội bộ:</strong> Chỉ những nhân viên có nhiệm vụ cụ thể và
                đã cam kết bảo mật mới được quyền truy cập vào các phần dữ liệu giới hạn để
                hỗ trợ khách hàng.
                </li>

                <li>
                <strong>Giới hạn trách nhiệm:</strong> Mặc dù chúng tôi áp dụng những biện
                pháp tiên tiến nhất, nhưng không thể loại trừ hoàn toàn rủi ro từ các cuộc
                tấn công mạng phức tạp. Markee AI sẽ thông báo cho người dùng ngay lập tức
                nếu phát hiện sự cố rò rỉ dữ liệu.
                </li>
            </ul>
        </section>

          {/* 8 */}
          <section id="section-8" className="scroll-mt-28">
            <h2 className="text-2xl font-semibold mb-4">
                8. Dữ liệu AI và Nội dung người dùng
            </h2>

            <ul className="list-disc pl-6 space-y-3">
                <li>
                <strong>Quyền sở hữu nội dung:</strong> Tất cả các văn bản, ý tưởng và kết
                quả do AI tạo ra dựa trên prompt của bạn đều thuộc quyền sở hữu hợp pháp của
                bạn.
                </li>

                <li>
                <strong>Xử lý dữ liệu đầu vào:</strong> Chúng tôi coi các câu lệnh (prompts)
                và tài liệu nội bộ của bạn là tài sản riêng tư. Hệ thống sẽ không bao giờ sử
                dụng dữ liệu thô này để hiển thị công khai cho người dùng khác.
                </li>

                <li>
                <strong>Bảo mật mô hình:</strong> Các “Brand Voice” (giọng văn thương hiệu)
                bạn thiết lập chỉ được áp dụng riêng cho tài khoản của bạn.
                </li>
            </ul>
        </section>


          {/* 9 */}
          <section id="section-9" className="scroll-mt-28">
            <h2 className="text-2xl font-semibold mb-4">
                9. Thông tin liên quan đến trẻ em
            </h2>

            <ul className="list-disc pl-6 space-y-3">
                <li>
                <strong>Giới hạn độ tuổi:</strong> Dịch vụ của chúng tôi không dành cho các
                cá nhân dưới 16 tuổi. Nếu chúng tôi biết rằng chúng tôi đã thu thập dữ liệu
                từ một trẻ vị thành niên, chúng tôi sẽ xóa dữ liệu đó kịp thời.
                </li>

                <li>
                <strong>Xử lý vi phạm:</strong> Chúng tôi không chủ động thu thập dữ liệu
                trẻ em. Nếu phát hiện có thông tin của trẻ em được thu thập trái phép,
                chúng tôi sẽ thực hiện các bước xóa bỏ thông tin đó ngay lập tức.
                </li>
            </ul>
        </section>


          {/* 10 */}
          <section id="section-10" className="scroll-mt-28">
            <h2 className="text-2xl font-semibold mb-4">
                10. Tuân thủ pháp luật và yêu cầu từ cơ quan chức năng
            </h2>

            <ul className="list-disc pl-6 space-y-3">
                <li>
                <strong>Phạm vi cung cấp:</strong> Trong trường hợp có yêu cầu pháp lý,
                Markee AI chỉ cung cấp những dữ liệu tối thiểu và trực tiếp liên quan đến
                yêu cầu đó, nhằm đảm bảo quyền lợi riêng tư lớn nhất có thể cho người dùng.
                </li>

                <li>
                <strong>Thông báo:</strong> Nếu luật pháp không cấm, chúng tôi sẽ nỗ lực
                thông báo cho người dùng khi có yêu cầu cung cấp dữ liệu của họ cho bên
                thứ ba.
                </li>
            </ul>
        </section>


          {/* 11 */}
          <section id="section-11" className="scroll-mt-28">
            <h2 className="text-2xl font-semibold mb-4">
                11. Cập nhật chính sách bảo mật
            </h2>

            <ul className="list-disc pl-6 space-y-3">
                <li>
                <strong>Thay đổi chính sách:</strong> Chúng tôi có quyền cập nhật chính sách
                này để phản ánh những thay đổi trong cách xử lý dữ liệu hoặc thay đổi về
                luật pháp.
                </li>

                <li>
                <strong>Cách thức thông báo:</strong> Mọi thay đổi quan trọng sẽ được thông
                báo qua Email đăng ký của bạn hoặc hiển thị nổi bật tại trang chủ của
                website trong ít nhất 07 ngày trước khi có hiệu lực.
                </li>
            </ul>
        </section>


          {/* 12 */}
          <section id="section-12" className="scroll-mt-28">
            <h2 className="text-2xl font-semibold mb-4">
                12. Liên hệ
            </h2>

            <p className="mb-3">
                Mọi thắc mắc, khiếu nại hoặc yêu cầu liên quan đến dữ liệu cá nhân, vui lòng
                liên hệ với chúng tôi qua:
            </p>

            <ul className="list-disc pl-6 space-y-2">
                <li>
                <strong>Email:</strong> support@markeeai.com
                </li>
                <li>
                <strong>Hỗ trợ trực tuyến:</strong> Khung chat tại góc dưới màn hình website.
                </li>
            </ul>
        </section>
        </div>
      </main>
    </div>
    <Footer />
    </>
  );
}
