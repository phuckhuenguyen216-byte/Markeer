"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Footer from "../components/Footer";
import SocialMedia from "../components/SocialMedia";
import ChatwootWidget from "../components/ChatwootWidget";

const sections = [
  { id: "section-1", title: "1. Giới thiệu & Mối Quan Hệ Pháp Lý" },
  { id: "section-2", title: "2. Chấp Thuận Điều Khoản" },
  { id: "section-3", title: "3. Thay Đổi Điều Khoản" },
  { id: "section-4", title: "4. Đối Tượng & Điều Kiện Sử Dụng" },
  { id: "section-5", title: "5. Tài khoản của bạn" },
  { id: "section-6", title: "6. Quyền Truy Cập & Sử Dụng Dịch Vụ" },
  { id: "section-7", title: "7. Nội dung & Dữ liệu Người dùng" },
  { id: "section-8", title: "8. Quyền sở hữu trí tuệ" },
  { id: "section-9", title: "9. Hợp tác với Bên Thứ Ba" },
  { id: "section-10", title: "10. Tạm ngưng & Chấm dứt dịch vụ" },
  { id: "section-11", title: "11. Bồi thường và Trách nhiệm" },
  { id: "section-12", title: "12. Loại trừ & giới hạn trách nhiệm" },
  { id: "section-13", title: "13. Luật áp dụng & Giải quyết tranh chấp" },
  { id: "section-14", title: "14. Điều khoản khác" },
  { id: "section-15", title: "15. Liên hệ" },
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
          ĐIỀU KHOẢN DỊCH VỤ - MARKEE AI
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
          <section id="section-1">
            <h2 className="text-2xl font-semibold mb-4">
                1. Giới thiệu & Mối Quan Hệ Pháp Lý
            </h2>

            <p className="mb-4">
                Markee AI (“Markee”, “chúng tôi”) là nền tảng phần mềm trực tuyến cung cấp
                các giải pháp ứng dụng trí tuệ nhân tạo trong marketing, bao gồm nhưng
                không giới hạn ở việc tạo nội dung, đề xuất ý tưởng, tối ưu hiệu suất,
                phân tích dữ liệu và tự động hoá đăng tải nội dung trên các kênh truyền
                thông và nền tảng số (“Dịch vụ”).
            </p>

            <p>
                Bằng việc truy cập website <a href="https://markeeai.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium hover:underline">
                https://markeeai.com/
                </a>, tạo tài khoản hoặc sử
                dụng bất kỳ phần nào của Dịch vụ, bạn (“Người dùng”, “bạn”) xác nhận đã
                đọc, hiểu và đồng ý chịu sự ràng buộc của Điều khoản dịch vụ này, từ đó
                hình thành một thỏa thuận pháp lý có giá trị giữa bạn và Markee AI.
            </p>
            </section>


          {/* 2 */}
          <section id="section-2" >
            <h2 className="text-2xl font-semibold mb-4">
                2. Chấp Thuận Điều Khoản
            </h2>

            <p>
                Việc bạn tạo tài khoản, truy cập hoặc sử dụng Dịch vụ đồng nghĩa với việc
                bạn chấp thuận toàn bộ các điều khoản và điều kiện được quy định tại đây.
                Nếu bạn không đồng ý với bất kỳ nội dung nào của Điều khoản dịch vụ, bạn
                không được phép truy cập hoặc sử dụng Dịch vụ của Markee AI.
            </p>
            </section>

          {/* 3 */}
          <section id="section-3">
                <h2 className="text-2xl font-semibold mb-4">
                    3. Thay Đổi Điều Khoản
                </h2>

                <p className="mb-4">
                    Markee có quyền sửa đổi, cập nhật hoặc bổ sung Điều khoản dịch vụ này bất kỳ lúc 
                    nào nhằm phản ánh sự thay đổi của Dịch vụ, yêu cầu pháp lý hoặc nhu cầu kinh doanh. 
                    Các thay đổi sẽ có hiệu lực kể từ thời điểm được công bố trên website, thông báo trong ứng dụng hoặc gửi qua email (nếu có).
                </p>

                <p>
                    Việc bạn tiếp tục sử dụng Dịch vụ sau khi các thay đổi có hiệu lực được
                    hiểu là bạn đã chấp thuận Điều khoản dịch vụ được cập nhật.
                </p>
            </section>

          {/* 4 */}
        <section id="section-4">
            <h2 className="text-2xl font-semibold mb-4">
                4. Đối Tượng & Điều Kiện Sử Dụng
            </h2>

            <p className="mb-3">
                Dịch vụ của chúng tôi không dành cho các cá nhân dưới 16 tuổi. Nếu chúng
                tôi biết rằng chúng tôi đã thu thập dữ liệu từ một trẻ vị thành niên,
                chúng tôi sẽ xóa dữ liệu đó kịp thời.
            </p>

            <p>
                Bạn cam kết cung cấp và duy trì các thông tin cần thiết để tạo và quản lý
                tài khoản một cách chính xác. Markee không chịu trách nhiệm đối với các
                sự cố phát sinh do thông tin tài khoản không chính xác hoặc không còn hiệu
                lực.
            </p>
        </section>

          {/* 5 */}
        <section id="section-5">
            <h2 className="text-2xl font-semibold mb-4">
                5. Tài khoản của bạn
            </h2>

            <div className="space-y-4 text-gray-800 leading-relaxed">
                <p>
                Để sử dụng đầy đủ các tính năng của Dịch vụ, bạn cần tạo một tài khoản
                Markee AI. Mỗi tài khoản được bảo vệ bằng thông tin đăng nhập riêng và
                chỉ được sử dụng bởi chính chủ tài khoản.
                </p>

                <p>
                Bạn chịu hoàn toàn trách nhiệm trong việc bảo mật thông tin đăng nhập,
                cũng như mọi hoạt động diễn ra thông qua tài khoản của mình. Bạn không
                được chia sẻ, cho mượn hoặc chuyển nhượng tài khoản cho bên thứ ba nếu
                không có sự cho phép bằng văn bản của Markee.
                </p>

                <p>
                Markee có quyền tạm ngưng, hạn chế hoặc chấm dứt tài khoản của bạn nếu
                phát hiện có dấu hiệu vi phạm Điều khoản dịch vụ, pháp luật hiện hành
                hoặc gây rủi ro cho hệ thống và người dùng khác.
                </p>
            </div>
        </section>

          {/* 6 */}
        <section id="section-6">
            <h2 className="text-2xl font-semibold mb-4">
                6. Quyền Truy Cập &amp; Sử Dụng Dịch Vụ
            </h2>

            <div className="space-y-4 text-gray-800 leading-relaxed">
                <p>
                Markee cấp cho bạn một quyền sử dụng Dịch vụ có giới hạn, không độc quyền,
                không thể chuyển nhượng và có thể bị thu hồi, chỉ nhằm mục đích sử dụng
                các tính năng theo đúng chức năng mà Markee cung cấp.
                </p>

                <p>
                Bạn cam kết không sử dụng Dịch vụ vào các mục đích sau:
                </p>

                <ul className="list-disc pl-6 space-y-2">
                <li>
                    Xâm nhập, can thiệp trái phép, phá hoại hoặc làm gián đoạn hệ thống,
                    máy chủ hoặc hạ tầng kỹ thuật của Markee.
                </li>

                <li>
                    Lạm dụng các tính năng AI để tạo, lan truyền nội dung vi phạm pháp luật,
                    xâm phạm quyền của bên thứ ba hoặc trái thuần phong mỹ tục.
                </li>

                <li>
                    Phát tán mã độc, spam, nội dung quảng cáo trái phép hoặc quấy rối
                    người khác.
                </li>

                <li>
                    Sử dụng Dịch vụ theo cách gây ảnh hưởng tiêu cực đến uy tín, hoạt động
                    hoặc người dùng khác của Markee.
                </li>
                </ul>

                <p>
                Markee có quyền áp dụng các biện pháp kỹ thuật hoặc hành chính, bao gồm
                đình chỉ hoặc chấm dứt quyền truy cập, nếu phát hiện hành vi vi phạm.
                </p>
            </div>
        </section>

          {/* 7 */}
        <section id="section-7">
            <h2 className="text-2xl font-semibold text-gray-900">
                7. Nội dung & Dữ liệu Người dùng
            </h2>

            <p className="text-gray-700 leading-relaxed">
                “Nội dung người dùng” bao gồm tất cả dữ liệu, văn bản, hình ảnh, video,
                thông tin, nội dung tiếp thị hoặc các dữ liệu khác mà bạn tạo, tải lên,
                nhập vào hoặc xử lý thông qua Dịch vụ.
            </p>

            <p className="text-gray-700 leading-relaxed">
                Bạn vẫn giữ quyền sở hữu đối với Nội dung người dùng của mình. Tuy nhiên,
                bằng việc sử dụng Dịch vụ, bạn cấp cho Markee quyền không độc quyền để
                lưu trữ, xử lý, phân tích và sử dụng Nội dung người dùng đó nhằm mục đích
                vận hành, cải thiện và cung cấp Dịch vụ.
            </p>

            <p className="text-gray-700 leading-relaxed">
                Bạn chịu hoàn toàn trách nhiệm pháp lý đối với Nội dung người dùng của
                mình. Markee có quyền xóa, hạn chế hiển thị hoặc từ chối xử lý bất kỳ nội
                dung nào vi phạm pháp luật, quyền của bên thứ ba hoặc Điều khoản dịch vụ
                này.
            </p>
        </section>


          {/* 8 */}
          <section id="section-8">
            <h2 className="text-2xl font-semibold text-gray-900">
                8. Quyền sở hữu trí tuệ
            </h2>

            <p className="text-gray-700 leading-relaxed">
                Tất cả các quyền sở hữu trí tuệ liên quan đến Dịch vụ, bao gồm nhưng không
                giới hạn ở phần mềm, mã nguồn, thuật toán AI, thiết kế giao diện, thương
                hiệu, logo và nội dung do Markee tạo ra, đều thuộc quyền sở hữu độc quyền
                của Markee AI hoặc bên cấp phép hợp pháp cho Markee.
            </p>

            <p className="text-gray-700 leading-relaxed">
                Bạn không được sao chép, chỉnh sửa, phân phối, tái tạo, đảo ngược kỹ thuật
                hoặc phát triển sản phẩm cạnh tranh dựa trên Dịch vụ của Markee nếu không
                có sự cho phép bằng văn bản.
            </p>
        </section>

          {/* 9 */}
          <section id="section-9">
            <h2 className="text-2xl font-semibold text-gray-900">
                9. Hợp tác với Bên Thứ Ba
            </h2>

            <p className="text-gray-700 leading-relaxed">
                Dịch vụ của Markee có thể tích hợp hoặc kết nối với các nền tảng và dịch vụ
                của bên thứ ba như Facebook, Instagram, LinkedIn, WordPress hoặc các nền
                tảng khác.
            </p>

            <p className="text-gray-700 leading-relaxed">
                Việc bạn sử dụng các tích hợp này đồng nghĩa với việc bạn chấp thuận và
                tuân thủ các điều khoản, chính sách riêng của các bên thứ ba đó. Markee
                không chịu trách nhiệm đối với nội dung, chính sách, thay đổi hoặc rủi ro
                phát sinh từ các dịch vụ của bên thứ ba.
            </p>
        </section>

          {/* 10 */}
         <section id="section-10">
            <h2 className="text-2xl font-semibold text-gray-900">
                10. Tạm ngưng &amp; Chấm dứt dịch vụ
            </h2>

            <p className="text-gray-700 leading-relaxed">
                Markee có quyền tạm ngưng hoặc chấm dứt quyền truy cập Dịch vụ của bạn trong
                các trường hợp sau:
            </p>

            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>
                Bạn vi phạm nghiêm trọng hoặc vi phạm nhiều lần Điều khoản dịch vụ.
                </li>
                <li>
                Theo yêu cầu của cơ quan nhà nước có thẩm quyền hoặc quy định pháp luật.
                </li>
                <li>
                Nhằm bảo vệ hệ thống, người dùng khác hoặc quyền lợi hợp pháp của Markee.
                </li>
            </ul>

            <p className="text-gray-700 leading-relaxed">
                Khi tài khoản bị chấm dứt, bạn sẽ không còn quyền truy cập Dịch vụ và dữ
                liệu liên quan, ngoại trừ các dữ liệu mà Markee có nghĩa vụ lưu trữ theo
                yêu cầu của pháp luật.
            </p>
        </section>

          {/* 11 */}
          <section id="section-11">
            <h2 className="text-2xl font-semibold text-gray-900">
                11. Bồi thường và Trách nhiệm
            </h2>

            <p className="text-gray-700 leading-relaxed">
                Bạn đồng ý bồi thường và giữ cho Markee không bị thiệt hại đối với mọi
                khiếu nại, tổn thất, trách nhiệm, chi phí hoặc yêu cầu phát sinh từ:
            </p>

            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Việc bạn vi phạm Điều khoản dịch vụ.</li>
                <li>
                Nội dung hoặc hành vi sử dụng Dịch vụ của bạn gây thiệt hại cho Markee
                hoặc bên thứ ba.
                </li>
            </ul>

            <p className="text-gray-700 leading-relaxed">
                Trách nhiệm pháp lý của Markee (nếu có) sẽ được giới hạn trong phạm vi
                tối đa mà pháp luật cho phép.
            </p>
        </section>

          {/* 12 */}
          <section id="section-12">
            <h2 className="text-2xl font-semibold text-gray-900">
                12. Loại trừ &amp; Giới hạn Trách nhiệm
            </h2>

            <p className="text-gray-700 leading-relaxed">
                Dịch vụ của Markee được cung cấp trên cơ sở “nguyên trạng” và “theo khả
                năng hiện có”. Markee không đưa ra bất kỳ bảo đảm nào, dù rõ ràng hay
                ngụ ý, rằng Dịch vụ sẽ không bị gián đoạn, không có lỗi hoặc đáp ứng
                mọi kỳ vọng của người dùng.
            </p>

            <p className="text-gray-700 leading-relaxed">
                Trong mọi trường hợp, Markee không chịu trách nhiệm đối với các thiệt
                hại gián tiếp, ngẫu nhiên, đặc biệt, mất doanh thu, mất lợi nhuận, mất
                dữ liệu hoặc cơ hội kinh doanh phát sinh từ việc sử dụng hoặc không
                thể sử dụng Dịch vụ.
            </p>
        </section>

        <section id="section-13">
            <h2 className="text-2xl font-semibold text-gray-900">
                13. Luật áp dụng &amp; Giải quyết tranh chấp
            </h2>

            <p className="text-gray-700 leading-relaxed">
                Điều khoản dịch vụ này được điều chỉnh và giải thích theo pháp luật
                áp dụng mà Markee lựa chọn. Mọi tranh chấp phát sinh liên quan đến
                Điều khoản dịch vụ hoặc Dịch vụ sẽ được ưu tiên giải quyết thông qua
                thương lượng thiện chí; nếu không đạt được thỏa thuận, tranh chấp
                sẽ được đưa ra cơ quan giải quyết có thẩm quyền theo quy định pháp luật.
            </p>
        </section>

        <section id="section-14">
            <h2 className="text-2xl font-semibold text-gray-900">
                14. Điều khoản khác
            </h2>

            <p className="text-gray-700 leading-relaxed">
                Nếu bất kỳ điều khoản nào trong Điều khoản dịch vụ này bị tuyên bố
                là vô hiệu hoặc không thể thi hành, các điều khoản còn lại vẫn giữ
                nguyên hiệu lực.
            </p>

            <p className="text-gray-700 leading-relaxed">
                Việc Markee không thực hiện hoặc chậm thực hiện bất kỳ quyền nào
                không được coi là từ bỏ quyền đó.
            </p>
        </section>

        <section id="section-15">
            <h2 className="text-2xl font-semibold text-gray-900">
                15. Liên hệ
            </h2>

            <p className="text-gray-700 leading-relaxed">
                Nếu bạn có bất kỳ câu hỏi, khiếu nại hoặc yêu cầu nào liên quan đến
                Điều khoản dịch vụ này, vui lòng liên hệ với chúng tôi thông qua các
                thông tin hỗ trợ được công bố trên website chính thức của Markee AI
                tại{" "}
                <a
                href="https://markeeai.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-medium hover:underline"
                >
                https://markeeai.com/
                </a>
                .
            </p>
        </section>

        </div>
      </main>
    </div>
    <Footer />
    </>
  );
}
