import React, { useState, useEffect } from 'react';
import { FiX, FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';

const Cart: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { state, dispatch } = useCart();
  const [lastItemCount, setLastItemCount] = useState(state.items.length);

  // Tự động mở giỏ hàng khi có sản phẩm mới được thêm vào
  useEffect(() => {
    if (state.items.length > lastItemCount) {
      setIsOpen(true);
      // Tự động đóng sau 3 giây
      const timer = setTimeout(() => {
        setIsOpen(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
    setLastItemCount(state.items.length);
  }, [state.items.length, lastItemCount]);

  const totalAmount = state.items.reduce((sum, item) => {
    const price = parseInt(item.price.replace(/\D/g, ''));
    return sum + price * item.quantity;
  }, 0);

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      dispatch({ type: 'REMOVE_FROM_CART', id });
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', id, quantity });
    }
  };

  const handleRemoveItem = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', id });
  };

  const handleCheckout = () => {
    // TODO: Implement checkout logic
    alert('Chức năng thanh toán đang được phát triển!');
  };

  return (
    <>
      {/* Cart Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        title="Mở giỏ hàng"
      >
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
          {state.items.length}
        </span>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </button>

      {/* Cart Sidebar */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? 'bg-opacity-50 z-50' : 'bg-opacity-0 -z-10'
        }`}
        onClick={() => setIsOpen(false)}
      >
        <div 
          className="absolute left-0 top-0 h-full w-full md:w-96 bg-white shadow-lg transition-transform duration-300"
          style={{ transform: isOpen ? 'translateX(0)' : 'translateX(-100%)' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold">Giỏ hàng ({state.items.length})</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
              title="Đóng giỏ hàng"
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Cart Items */}
          <div className="p-4 space-y-4 h-[calc(100vh-200px)] overflow-y-auto">
            {state.items.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                Giỏ hàng trống
              </div>
            ) : (
              state.items.map(item => (
                <div key={item.id} className="flex gap-4 border-b pb-4">
                  <img
                    src={item.imageURL}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-blue-600 font-bold">{item.price}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Giảm số lượng"
                      >
                        <FiMinus size={16} />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Tăng số lượng"
                      >
                        <FiPlus size={16} />
                      </button>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1 hover:bg-gray-100 rounded ml-auto text-red-500"
                        title="Xóa sản phẩm"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 border-t bg-white p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold">Tổng tiền:</span>
              <span className="text-xl font-bold text-blue-600">
                {totalAmount.toLocaleString('vi-VN')}₫
              </span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={state.items.length === 0}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Thanh toán
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart; 