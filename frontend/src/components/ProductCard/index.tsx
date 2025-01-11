import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiEye } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  id: string;
  title: string;
  price: string;
  image_url: string;
  rating?: number;
  soldCount?: number;
  isNew?: boolean;
  isSale?: boolean;
  originalPrice?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  price,
  image_url,
  rating = 4.5,
  soldCount = Math.floor(Math.random() * 100),
  isNew = Math.random() > 0.7,
  isSale = Math.random() > 0.7,
  originalPrice = isSale ? (parseInt(price.replace(/\D/g, '')) * 1.2).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '₫' : undefined
}) => {
  const [showQuickView, setShowQuickView] = useState(false);
  const { dispatch } = useCart();

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_TO_CART',
      item: {
        id,
        title,
        price,
        imageURL: image_url.startsWith('//') ? `https:${image_url}` : image_url,
        quantity: 1
      }
    });
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative"
      onMouseEnter={() => setShowQuickView(true)}
      onMouseLeave={() => setShowQuickView(false)}
    >
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-2">
        {isNew && (
          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">New</span>
        )}
        {isSale && (
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">Sale</span>
        )}
      </div>

      {/* Quick View Overlay */}
      {showQuickView && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-4 z-20">
          <button
            onClick={handleAddToCart}
            className="bg-white p-2 rounded-full hover:bg-blue-500 hover:text-white transition-colors"
            title="Thêm vào giỏ"
          >
            <FiShoppingCart size={20} />
          </button>
          <button
            className="bg-white p-2 rounded-full hover:bg-blue-500 hover:text-white transition-colors"
            title="Yêu thích"
          >
            <FiHeart size={20} />
          </button>
          <Link
            to={`/product/${id}`}
            className="bg-white p-2 rounded-full hover:bg-blue-500 hover:text-white transition-colors"
            title="Xem chi tiết"
          >
            <FiEye size={20} />
          </Link>
        </div>
      )}

      {/* Product Image */}
      <img
        src={image_url.startsWith('//') ? `https:${image_url}` : image_url}
        alt={title}
        className="w-full h-48 object-cover"
      />

      {/* Product Info */}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2 line-clamp-2">{title}</h2>
        
        {/* Rating & Sold Count */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="ml-1 text-sm text-gray-600">{rating}</span>
          </div>
          <span className="text-sm text-gray-500">Đã bán {soldCount}</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-blue-600">{price}</span>
          {originalPrice && (
            <span className="text-sm text-gray-400 line-through">{originalPrice}</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <FiShoppingCart />
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
};

export default ProductCard; 