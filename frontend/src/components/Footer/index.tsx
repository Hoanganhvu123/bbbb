import React from 'react';
import { FiFacebook, FiInstagram, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white shadow-md mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4">Về FoodStore</h3>
            <p className="text-gray-600 mb-4">
              FoodStore là cửa hàng chuyên cung cấp các sản phẩm bánh kẹo, đồ ăn vặt nhập khẩu chính hãng với giá cả hợp lý và chất lượng đảm bảo.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Liên hệ</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-600">
                <FiMapPin />
                <span>123 Đường ABC, Quận XYZ, TP.HCM</span>
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <FiPhone />
                <a href="tel:0123456789" className="hover:text-blue-600">0123 456 789</a>
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <FiMail />
                <a href="mailto:info@foodstore.com" className="hover:text-blue-600">
                  info@foodstore.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div>
            <h3 className="text-lg font-bold mb-4">Theo dõi chúng tôi</h3>
            <form onSubmit={(e) => e.preventDefault()} className="mb-4">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Đăng ký
                </button>
              </div>
            </form>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600"
              >
                <FiFacebook size={24} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600"
              >
                <FiInstagram size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t mt-8 pt-8 text-center text-gray-600">
          <p>© 2024 FoodStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 