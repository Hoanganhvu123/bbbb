import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Header from './components/Header';
import Footer from './components/Footer';
import Products from './Pages/Products';
import ProductDetail from './Pages/ProductDetail';
import Cart from './components/Cart';
import { CartProvider } from './context/CartContext';
import Chatbot from './components/Chatbot/Chatbot';
import PolicyPage from './Pages/Policy';

const App: React.FC = () => {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/chinh-sach" element={<PolicyPage />} />
            </Routes>
          </main>
          <Footer />
          <Cart />
          <Chatbot />
          <ToastContainer position="bottom-right" />
        </div>
      </Router>
    </CartProvider>
  );
};

export default App;
