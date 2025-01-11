import React, { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext';
import productsData from '../../data.json';
import { FiShoppingCart } from 'react-icons/fi';

interface Product {
  id: string;
  title: string;
  price: string;
  imageURL: string;
  description: string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { dispatch } = useCart();

  useEffect(() => {
    setProducts(productsData);
  }, []);

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

  const handleAddToCart = (product: Product) => {
    dispatch({
      type: 'ADD_TO_CART',
      item: {
        id: product.id,
        title: product.title,
        price: product.price,
        imageURL: product.imageURL,
        quantity: 1
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Sản phẩm</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={product.imageURL}
              alt={product.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-blue-600 font-bold">
                  {formatPrice(product.price)}
                </span>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FiShoppingCart />
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products; 