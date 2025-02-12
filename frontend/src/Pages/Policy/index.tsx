import React from 'react';
import { Link } from 'react-router-dom';
import { FiShield, FiRefreshCw, FiUsers, FiTruck, FiBookOpen } from 'react-icons/fi';

const policies = [
  {
    icon: <FiShield className="w-8 h-8" />,
    title: "Chính sách bảo mật",
    description: "Cam kết bảo vệ thông tin cá nhân và quyền riêng tư của khách hàng",
    link: "#bao-mat"
  },
  {
    icon: <FiRefreshCw className="w-8 h-8" />,
    title: "Chính sách đổi trả",
    description: "Quy định về việc đổi trả hàng và hoàn tiền trong vòng 24h",
    link: "#doi-tra"
  },
  {
    icon: <FiUsers className="w-8 h-8" />,
    title: "Quyền lợi thành viên",
    description: "Các ưu đãi và quyền lợi đặc biệt dành cho thành viên",
    link: "#thanh-vien"
  },
  {
    icon: <FiTruck className="w-8 h-8" />,
    title: "Chính sách giao hàng",
    description: "Thông tin về phí, thời gian và phương thức giao hàng",
    link: "#giao-hang"
  },
  {
    icon: <FiBookOpen className="w-8 h-8" />,
    title: "Hướng dẫn mua hàng",
    description: "Hướng dẫn chi tiết các bước mua hàng trên website",
    link: "#huong-dan"
  }
];

const PolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-4">
            Chính Sách & Điều Khoản
          </h1>
          <p className="text-xl text-center max-w-2xl mx-auto text-blue-100">
            Tìm hiểu về các chính sách và cam kết của chúng tôi để mang đến trải nghiệm mua sắm tốt nhất cho khách hàng
          </p>
        </div>
      </div>

      {/* Policy Cards Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {policies.map((policy, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-6">
                  {policy.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{policy.title}</h3>
                <p className="text-gray-600 mb-6">{policy.description}</p>
                <a 
                  href={policy.link}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  Xem chi tiết
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Cần hỗ trợ thêm?</h2>
            <p className="text-gray-600 mb-8">
              Đội ngũ chăm sóc khách hàng của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="tel:0932044234"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Gọi ngay: 0932044234
              </a>
              <a 
                href="mailto:sieuthiluxy247@gmail.com"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Gửi email hỗ trợ
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Chính sách bảo mật */}
          <section className="p-8 border-b">
            <h2 className="text-2xl font-bold mb-6">Chính Sách Bảo Mật</h2>
            <div className="prose prose-blue">
              <p className="mb-4">
                Cám ơn quý khách đã truy cập vào website sieuthiluxy.vn. Chúng tôi tôn trọng và cam kết sẽ bảo mật những thông tin mang tính riêng tư của bạn.
              </p>
              <h3 className="text-xl font-semibold mt-6 mb-4">Thu thập thông tin cá nhân</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Chúng tôi thu thập, lưu trữ và xử lý thông tin của bạn cho quá trình mua hàng và cho những thông báo sau này.</li>
                <li>Chúng tôi sẽ không giới hạn thông tin cá nhân: danh hiệu, tên, giới tính, ngày sinh, email, địa chỉ, địa chỉ giao hàng, số điện thoại, fax, chi tiết thanh toán.</li>
              </ul>
            </div>
          </section>

          {/* Chính sách đổi trả */}
          <section className="p-8 border-b">
            <h2 className="text-2xl font-bold mb-6">Chính Sách Đổi Trả</h2>
            <div className="prose prose-blue">
              <h3 className="text-xl font-semibold mb-4">Thời gian đổi trả</h3>
              <p className="mb-4">
                Quý khách có quyền đổi/trả hàng trong vòng 24 giờ (tính từ thời điểm nhận được hàng) trong các trường hợp sau:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Sản phẩm khác với mô tả trên website hoặc fanpage</li>
                <li>Sản phẩm hết hạn sử dụng</li>
                <li>Sản phẩm bị lỗi của nhà sản xuất</li>
              </ul>
            </div>
          </section>

          {/* Chính sách giao hàng */}
          <section className="p-8 border-b">
            <h2 className="text-2xl font-bold mb-6">Chính Sách Giao Hàng</h2>
            <div className="prose prose-blue">
              <h3 className="text-xl font-semibold mb-4">Thời gian giao hàng</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Nội thành: giao nhanh trong 2 giờ</li>
                <li>Ngoại thành: Giao trong vòng 24 giờ</li>
                <li>Ngày Lễ - Tết - Cao điểm: 24 giờ</li>
              </ul>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Biểu phí giao hàng:</h4>
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="text-left py-2">Khu vực</th>
                      <th className="text-right py-2">Phí giao hàng</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Quận 1, 3, 7, Phú Nhuận, Bình Thạnh</td>
                      <td className="text-right">24.000 VND</td>
                    </tr>
                    <tr>
                      <td>Quận 4, 5, 10</td>
                      <td className="text-right">32.000 VND</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Hướng dẫn mua hàng */}
          <section className="p-8">
            <h2 className="text-2xl font-bold mb-6">Hướng Dẫn Mua Hàng</h2>
            <div className="prose prose-blue">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">1</span>
                  <div>
                    <h4 className="font-semibold">Chọn sản phẩm</h4>
                    <p className="text-gray-600">Tìm và chọn sản phẩm bạn muốn mua</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">2</span>
                  <div>
                    <h4 className="font-semibold">Thêm vào giỏ hàng</h4>
                    <p className="text-gray-600">Nhấn nút "Thêm vào giỏ" với số lượng mong muốn</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">3</span>
                  <div>
                    <h4 className="font-semibold">Điền thông tin</h4>
                    <p className="text-gray-600">Điền đầy đủ thông tin giao hàng của bạn</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">4</span>
                  <div>
                    <h4 className="font-semibold">Xác nhận đơn hàng</h4>
                    <p className="text-gray-600">Kiểm tra lại thông tin và xác nhận đặt hàng</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PolicyPage; 