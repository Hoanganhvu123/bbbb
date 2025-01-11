import React from 'react';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  id: string;
  title: string;
  price: string;
  imageURL: string;
  description: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, title, price, imageURL, description }) => {
  const { dispatch } = useCart();

  const formatPrice = (price: string) => {
    const numericPrice = price.replace(/[^0-9]/g, '');
    try {
      return new Intl.NumberFormat('vi-VN', { 
        style: 'currency', 
        currency: 'VND' 
      }).format(Number(numericPrice));
    } catch (error) {
      return price;
    }
  };

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_TO_CART',
      item: {
        id,
        title,
        price,
        imageURL,
        quantity: 1
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageURL} 
          alt={title}
          className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.png';
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-blue-600">{formatPrice(price)}</span>
          <button
            onClick={handleAddToCart}
            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors duration-300"
          >
            Thêm vào giỏ
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 