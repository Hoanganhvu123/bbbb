import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FiShoppingCart, FiShare2 } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import ProductCard from '../../components/ProductCard';

interface Product {
  id: string;
  title: string;
  price: string;
  image_url: string;
  content?: string;
  url?: string;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const { dispatch } = useCart();

  useEffect(() => {
    // Fetch product detail
    fetch('http://localhost:8000/products')
      .then(response => response.json())
      .then(data => {
        const foundProduct = data.find((p: Product) => p.id === id);
        if (foundProduct) {
          setProduct(foundProduct);
          // Get related products (excluding current product)
          const related = data
            .filter((p: Product) => p.id !== id)
            .slice(0, 4);
          setRelatedProducts(related);
        }
      })
      .catch(error => console.error('Error fetching product:', error));
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      dispatch({
        type: 'ADD_TO_CART',
        item: {
          id: product.id,
          title: product.title,
          price: product.price,
          imageURL: product.image_url.startsWith('//') ? `https:${product.image_url}` : product.image_url,
          quantity
        }
      });
    }
  };

  if (!product) {
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
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Product Image */}
          <div className="md:w-1/2">
            <img
              src={product.image_url.startsWith('//') ? `https:${product.image_url}` : product.image_url}
              alt={product.title}
              className="w-full h-96 object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="md:w-1/2 p-6">
            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-blue-600">{product.price}</span>
              {product.url && (
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Xem trên website gốc
                </a>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-gray-600">Số lượng:</span>
              <div className="flex items-center border rounded">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3 py-1 border-r hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-1">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-3 py-1 border-l hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mb-6"
            >
              <FiShoppingCart size={20} />
              Thêm vào giỏ hàng
            </button>

            {/* Share Button */}
            <button
              onClick={() => navigator.share?.({
                title: product.title,
                text: product.content,
                url: window.location.href
              })}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <FiShare2 size={20} />
              Chia sẻ
            </button>
          </div>
        </div>

        {/* Product Description */}
        {product.content && (
          <div className="p-6 border-t">
            <h2 className="text-2xl font-bold mb-4">Mô tả sản phẩm</h2>
            <div className="prose max-w-none">
              {product.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {relatedProducts.map(product => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail; 