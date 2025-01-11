import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiUser, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';

const categories = [
  { id: 1, name: 'Bánh kẹo', slug: 'banh-keo' },
  { id: 2, name: 'Đồ uống', slug: 'do-uong' },
  { id: 3, name: 'Giỏ quà', slug: 'gio-qua' },
  { id: 4, name: 'Snacks', slug: 'snacks' },
];

const Header: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const { state } = useCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log('Searching for:', searchTerm);
  };

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            FoodStore
          </Link>

          {/* Categories */}
          <div className="relative">
            <button
              className="px-4 py-2 text-gray-700 hover:text-blue-600"
              onMouseEnter={() => setShowCategories(true)}
              onMouseLeave={() => setShowCategories(false)}
            >
              Danh mục
              {showCategories && (
                <div className="absolute top-full left-0 w-48 bg-white shadow-lg rounded-md py-2">
                  {categories.map(category => (
                    <Link
                      key={category.id}
                      to={`/category/${category.slug}`}
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </button>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-full px-4 text-gray-500 hover:text-blue-600"
              >
                <FiSearch size={20} />
              </button>
            </div>
          </form>

          {/* User & Cart */}
          <div className="flex items-center space-x-4">
            <Link to="/account" className="text-gray-700 hover:text-blue-600">
              <FiUser size={24} />
            </Link>
            <Link to="/cart" className="text-gray-700 hover:text-blue-600 relative">
              <FiShoppingCart size={24} />
              {state.items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {state.items.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 