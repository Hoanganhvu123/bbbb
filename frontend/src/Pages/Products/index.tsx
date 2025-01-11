import React, { useEffect, useState } from 'react';
import ProductCard from '../../components/ProductCard';
import { FiFilter, FiChevronDown } from 'react-icons/fi';

interface Product {
  id: string;
  title: string;
  price: string;
  image_url: string;
}

const ITEMS_PER_PAGE = 8;

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8000/products')
      .then(response => response.json())
      .then(data => {
        // Add id field if not present
        const productsWithIds = data.map((product: Product, index: number) => ({
          ...product,
          id: product.id || `product-${index + 1}`
        }));
        setProducts(productsWithIds);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  }, []);

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    const priceA = parseInt(a.price.replace(/\D/g, ''));
    const priceB = parseInt(b.price.replace(/\D/g, ''));

    switch (sortBy) {
      case 'price-asc':
        return priceA - priceB;
      case 'price-desc':
        return priceB - priceA;
      case 'name-asc':
        return a.title.localeCompare(b.title);
      case 'name-desc':
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  // Filter products by price
  const filteredProducts = sortedProducts.filter(product => {
    const price = parseInt(product.price.replace(/\D/g, ''));
    return price >= priceRange[0] && price <= priceRange[1];
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      {/* Filters & Sort */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          <FiFilter />
          Lọc sản phẩm
          <FiChevronDown className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="default">Sắp xếp mặc định</option>
          <option value="price-asc">Giá tăng dần</option>
          <option value="price-desc">Giá giảm dần</option>
          <option value="name-asc">Tên A-Z</option>
          <option value="name-desc">Tên Z-A</option>
        </select>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="mb-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-4">Khoảng giá</h3>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="1000000"
              step="50000"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
              className="flex-1"
            />
            <span>-</span>
            <input
              type="range"
              min="0"
              max="1000000"
              step="50000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="flex-1"
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>{priceRange[0].toLocaleString('vi-VN')}₫</span>
            <span>{priceRange[1].toLocaleString('vi-VN')}₫</span>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100"
          >
            Trước
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 border rounded-lg ${
                currentPage === i + 1 ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
};

export default Products; 