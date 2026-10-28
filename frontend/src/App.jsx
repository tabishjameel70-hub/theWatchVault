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
function App() {
  return (
    <Routes>
      {/* Customer Home Page Route */}
      <Route path="/" element={
        <>
          <Navbar />
          <Hero />
          <FeaturedCollection />
          <Footer/>
        </>
      } />

      {/* Admin Dashboard Route (Independent layout) */}
      <Route path="/admin" element={<AdminDashboard />} />
      {/* Admin Login Route (Independent layout) */}
      <Route path="/admin/login" element={<AdminLogin />} />
      {/* Admin Inventory Route (Independent layout) */}
      <Route path="/admin/inventory" element={<AdminInventory />} />
      {/* Admin Inventory Route (Independent layout) */}
      <Route path="/admin/products/:id" element={<AdminProductEdit />} />
      {/* specific product Route (Independent layout) */}
      <Route path="/product-details/:id" element={<ProductDetails />} />
        {/* specific product Route (Independent layout) */}
      <Route path="/checkout" element={<Checkout />} />
    </Routes>
  );
}

export default App;