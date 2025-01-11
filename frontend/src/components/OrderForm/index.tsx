import React, { useState } from 'react';
import './styles.css';

interface OrderFormProps {
  onClose: () => void;
  cartItems: {
    id: string;
    title: string;
    price: string;
    quantity: number;
  }[];
  onSubmit: (formData: {
    name: string;
    phone: string;
    address: string;
    deliveryTime: string;
    note?: string;
  }) => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ onClose, cartItems, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    deliveryTime: '',
    note: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const totalAmount = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ''));
    return sum + (price * item.quantity);
  }, 0);

  // Tính thời gian cho datetime-local
  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1); // Ít nhất 1 tiếng sau thời điểm hiện tại
    return now.toISOString().slice(0, 16); // Format YYYY-MM-DDThh:mm
  };

  const getMaxDateTime = () => {
    const now = new Date();
    now.setDate(now.getDate() + 14); // Tối đa 14 ngày sau
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="order-form">
      <div className="order-form-header">
        <h3>📋 Xác nhận đơn hàng</h3>
        <button onClick={onClose} className="close-button" title="Đóng">×</button>
      </div>

      <div className="order-form-content">
        <div className="cart-items">
          <h4 className="cart-title">Giỏ hàng của bạn</h4>
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <span className="item-title">{item.title}</span>
              <span className="item-quantity">x{item.quantity}</span>
              <span className="item-price">{item.price}</span>
            </div>
          ))}
          <div className="total-amount">
            Tổng tiền: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Họ tên</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nhập họ tên của bạn"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Số điện thoại</label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Nhập số điện thoại"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="deliveryTime">Thời gian nhận hàng</label>
            <input
              type="datetime-local"
              id="deliveryTime"
              value={formData.deliveryTime}
              onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
              min={getMinDateTime()}
              max={getMaxDateTime()}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Địa chỉ nhận hàng</label>
            <textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Nhập địa chỉ nhận hàng"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="note">Ghi chú (không bắt buộc)</label>
            <textarea
              id="note"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              placeholder="Nhập ghi chú nếu có"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button">
              💳 Đặt hàng ngay
            </button>
            <button type="button" onClick={onClose} className="cancel-button">
              ❌ Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm; 