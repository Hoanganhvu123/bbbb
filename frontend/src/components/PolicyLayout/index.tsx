import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiChevronRight } from 'react-icons/fi';

interface PolicyLayoutProps {
  children: React.ReactNode;
}

const policies = [
  { 
    title: "Chính sách bảo mật", 
    path: "/chinh-sach/bao-mat",
    icon: "🔒"
  },
  { 
    title: "Chính sách đổi trả", 
    path: "/chinh-sach/doi-tra",
    icon: "🔄"
  },
  { 
    title: "Quyền lợi thành viên", 
    path: "/chinh-sach/thanh-vien",
    icon: "👥"
  },
  { 
    title: "Chính sách giao hàng", 
    path: "/chinh-sach/giao-hang",
    icon: "🚚"
  },
  { 
    title: "Hướng dẫn mua hàng", 
    path: "/chinh-sach/huong-dan",
    icon: "📝"
  }
];

const PolicyLayout: React.FC<PolicyLayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
        <Link to="/" className="hover:text-blue-600">
          <FiHome className="inline" />
        </Link>
        <FiChevronRight className="text-gray-400" />
        <Link to="/chinh-sach" className="hover:text-blue-600">
          Chính sách
        </Link>
        <FiChevronRight className="text-gray-400" />
        <span className="text-gray-900">
          {policies.find(p => p.path === location.pathname)?.title || 'Chính sách'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h3 className="text-lg font-bold mb-4 text-gray-900">
              Danh mục chính sách
            </h3>
            <nav className="space-y-2">
              {policies.map((policy) => (
                <Link
                  key={policy.path}
                  to={policy.path}
                  className={`block px-4 py-2 rounded-lg transition-colors ${
                    location.pathname === policy.path
                      ? 'bg-blue-50 text-blue-600'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-2">{policy.icon}</span>
                  {policy.title}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-md p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PolicyLayout; 