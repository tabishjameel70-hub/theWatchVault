import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedCollection from './components/FeaturedCollection';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import AdminInventory from './components/AdminInventory'
import AdminProductEdit from './components/AdminProductEdit'
import ProductDetails from './components/Productdetails';
import Checkout from './components/checkout';
import Footer from './components/Footer'
import OrderSuccess from './components/Ordersuccess';
import RecentOrders from './components/Recentorders';
import Contact from './components/contact'
import Login from './components/Login';
import Signup from './components/sigin';
import Shopcollection from './components/Shopcollection'
function App() {
  return (
    <Routes>
      {/* Customer Home Page Route */}
      <Route path="/" element={
        <>
          <Navbar />
          <Hero />
          <FeaturedCollection />
          <Footer />
        </>
      } />

      {/* Admin Dashboard Route (Independent layout) */}
      <Route path="/admin" element={<AdminDashboard />} />
      {/* Admin Login Route (Independent layout) */}
      <Route path="/admin/login" element={<AdminLogin />} />
      {/* Admin Dashboard Route (Independent layout) */}
      <Route path="/login" element={<Login />} />
      {/* Admin Dashboard Route (Independent layout) */}
      <Route path="/signup" element={<Signup />} />
      {/* Admin Inventory Route (Independent layout) */}
      <Route path="/admin/inventory" element={<AdminInventory />} />
      {/* Admin Inventory Route (Independent layout) */}
      <Route path="/admin/products/:id" element={<AdminProductEdit />} />
      {/* specific product Route (Independent layout) */}
      <Route path="/product-details/:id" element={<ProductDetails />} />
      {/* specific product Route (Independent layout) */}
      <Route path="/checkout" element={<Checkout />} />
      {/* specific product Route (Independent layout) */}
      <Route path="/order-success" element={<OrderSuccess />} />
      {/* specific product Route (Independent layout) */}
      <Route path="/admin/recent-orders" element={<RecentOrders />} />
      {/* specific product Route (Independent layout) */}
      
      <Route path="/contact" element={<Contact />} />
             {/* specific product Route (Independent layout) */}
      
      <Route path="/shop-collection" element={<Shopcollection />} />
    </Routes>
  );
}

export default App;