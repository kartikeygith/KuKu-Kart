import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/navbar/Header';
import Home from './pages/Home/Home';
import ProductList from './pages/Products/ProductList';
import ProductDetail from './pages/ProductDetails/ProductDetail';
import Cart from './pages/Cart/Cart';
import Wishlist from './pages/Wishlist/Wishlist';
import Checkout from './pages/Checkout/Checkout';
import OrderTracker from './pages/Orders/OrderTracker';
import OrderSuccess from './pages/Orders/OrderSuccess';
import Profile from './pages/Profile/Profile';
import Admin from './pages/Admin/Admin';
import DeliveryPortal from './pages/DeliveryPartner/DeliveryPortal';
import Auth from './pages/Auth/Auth';
import NotFound from './components/NotFound';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="app-layout">
      <Header />
      <main className="main-content" style={{ padding: 0 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          
          {/* Order Routes */}
          <Route path="/orders" element={<OrderTracker />} />
          <Route path="/orders/:orderId" element={<OrderTracker />} />
          <Route path="/orders/:orderId/success" element={<OrderSuccess />} />
          <Route path="/orders/success" element={<OrderSuccess />} />
          <Route path="/account/orders" element={<OrderTracker />} />

          {/* Account & Administration */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/orders" element={<Admin />} />
          <Route path="/delivery" element={<DeliveryPortal />} />
          <Route path="/login" element={<Auth />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
