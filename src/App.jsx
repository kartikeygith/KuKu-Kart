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
import SellerDashboard from './pages/Seller/SellerDashboard';
import DeliveryPortal from './pages/DeliveryPartner/DeliveryPortal';
import Auth from './pages/Auth/Auth';
import Contact from './pages/Contact/Contact';
import Privacy from './pages/Privacy/Privacy';
import NotFound from './components/NotFound';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <div className="app-layout">
      <Header />
      <main className="main-content" style={{ padding: 0 }}>
        <Routes>
          {/* Public Storefront Routes */}
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

          {/* Contact, Support & Privacy */}
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />

          {/* Account Authentication */}
          <Route path="/login" element={<Auth />} />

          {/* Protected Customer Profile */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />

          {/* Protected Seller Portal (Sellers & Master Admin) */}
          <Route 
            path="/seller" 
            element={
              <ProtectedRoute allowedRoles={['seller', 'admin']}>
                <SellerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/seller/*" 
            element={
              <ProtectedRoute allowedRoles={['seller', 'admin']}>
                <SellerDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Protected Master Admin Portal */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Admin />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/orders" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Admin />
              </ProtectedRoute>
            } 
          />

          {/* Protected Courier Delivery Portal */}
          <Route 
            path="/delivery" 
            element={
              <ProtectedRoute allowedRoles={['delivery_partner', 'admin']}>
                <DeliveryPortal />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
