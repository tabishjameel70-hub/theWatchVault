import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const navigate = useNavigate();

  // --- Form State ---
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNum: '',
    address: '',
    city: '',
    zipCode: '',
    homeType: 'House',
    shippingMethod: 'Standard Delivery',
    paymentMethod: 'COD'
  });

  // --- Cart State ---
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchCartProducts = async () => {
    try {
      setLoading(true);
      setError(false);
      const getSessionId = () => {
        let sessionId = localStorage.getItem('guest_session_id');
        if (!sessionId) {
          sessionId = 'guest_' + Math.random().toString().substr(2, 9);
          localStorage.setItem('guest_session_id', sessionId);
        }
        return sessionId;
      };
      const response = await axios.get('/api/check-out', {
        headers: {
          'session-id': getSessionId()
        }
      });
      // ONLY set the cart items here. Do NOT navigate!
      setCartItems(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCartProducts();
    window.addEventListener('cartUpdated', fetchCartProducts);
    return () => window.removeEventListener('cartUpdated', fetchCartProducts);
  }, []);

  // Calculate subtotal dynamically
  const subTotalAmount = cartItems.reduce((totals, item) => {
    const price = item.price || item.productId?.price || 0;
    const qty = item.quantity || 1;
    totals.subtotal += price * qty;
    totals.itemCount += qty;
    return totals;
  }, { subtotal: 0, itemCount: 0 });

  // Handle images
  const getImageUrl = (item) => {
    const images = item.productImages || item.productId?.productImages;
    if (!images || images.length === 0) return null;
    return images[0].startsWith('http') ? images[0] : `http://localhost:3000${images[0]}`;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // NEW: Handle form submission to your backend
  // NEW: Handle form submission to your backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const sessionId = localStorage.getItem('guest_session_id');

      const payload = {
        ...formData,
        items: cartItems,
        totalAmount: subTotalAmount.subtotal
      };
      // Inside Checkout.jsx handleSubmit:
      const response = await axios.post('/api/check-out', payload, {
        headers: { 'session-id': sessionId }
      });

      // 1. Merge your fully populated cartItems into the order!
      const completeOrder = {
        ...response.data.data,
        items: cartItems
      };

      setCartItems([]);

      // 2. Pass the merged order to your perfect OrderSuccess page
      navigate('/order-success', { state: { order: completeOrder } });



    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.response?.data?.message || 'Failed to place order.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-800 selection:bg-[#c19a6b] selection:text-white">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-serif text-slate-900 tracking-tight">Secure Checkout</h1>
          <p className="text-slate-500 mt-2">Please enter your details to complete your order.</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-center gap-3 animate-fade-in">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* --- LEFT COLUMN: Form Inputs --- */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">

            {/* Contact Info Card */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200/60 transition-all hover:shadow-md">
              <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#c19a6b]/10 text-[#c19a6b] flex items-center justify-center text-sm">1</span>
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c19a6b]/30 focus:border-[#c19a6b] transition-all duration-200" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c19a6b]/30 focus:border-[#c19a6b] transition-all duration-200" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
                  <input type="tel" name="phoneNum" required value={formData.phoneNum} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c19a6b]/30 focus:border-[#c19a6b] transition-all duration-200" placeholder="+92 300 1234567" />
                </div>
              </div>
            </div>

            {/* Shipping Address Card */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200/60 transition-all hover:shadow-md">
              <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#c19a6b]/10 text-[#c19a6b] flex items-center justify-center text-sm">2</span>
                Shipping Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Street Address</label>
                  <input type="text" name="address" required value={formData.address} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c19a6b]/30 focus:border-[#c19a6b] transition-all duration-200" placeholder="123 Luxury Ave, Suite 400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">City</label>
                  <input type="text" name="city" required value={formData.city} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c19a6b]/30 focus:border-[#c19a6b] transition-all duration-200" placeholder="Karachi" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Zip / Postal Code</label>
                  <input type="text" name="zipCode" required value={formData.zipCode} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c19a6b]/30 focus:border-[#c19a6b] transition-all duration-200" placeholder="75000" />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Location Type</label>
                  <div className="relative">
                    <select name="homeType" value={formData.homeType} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c19a6b]/30 focus:border-[#c19a6b] transition-all duration-200 appearance-none cursor-pointer">
                      <option value="House">House / Villa</option>
                      <option value="Apartment">Apartment / Flat</option>
                      <option value="Office">Office</option>
                      <option value="Other">Other</option>
                    </select>
                    {/* Custom Select Arrow */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Methods Card */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200/60 transition-all hover:shadow-md grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-[#c19a6b]/10 text-[#c19a6b] flex items-center justify-center text-sm">3</span>
                  Shipping
                </h2>
                <div className="relative">
                  <select name="shippingMethod" value={formData.shippingMethod} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c19a6b]/30 focus:border-[#c19a6b] transition-all duration-200 appearance-none cursor-pointer">
                    <option value="Standard Delivery">Standard Delivery (3-5 Days)</option>
                    <option value="Express Delivery">Express Delivery (1-2 Days)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-[#c19a6b]/10 text-[#c19a6b] flex items-center justify-center text-sm">4</span>
                  Payment
                </h2>
                <div className="relative">
                  <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c19a6b]/30 focus:border-[#c19a6b] transition-all duration-200 appearance-none cursor-pointer">
                    <option value="COD">Cash on Delivery (COD)</option>
                    <option value="Bank">Direct Bank Transfer</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* --- RIGHT COLUMN: Order Summary --- */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 sticky top-8">
              <h2 className="text-xl font-serif text-slate-900 mb-6 pb-4 border-b border-slate-100">Order Summary</h2>

              <div className="max-h-[340px] overflow-y-auto mb-6 space-y-5 pr-2 custom-scrollbar">
                {cartItems.length > 0 ? (
                  cartItems.map((item, index) => {
                    const imageUrl = getImageUrl(item);
                    return (
                      <div key={index} className="flex justify-between items-center group">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                            <img src={imageUrl || ''} alt={item.productId?.productName} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex flex-col">
                            <p className="text-sm font-semibold text-slate-900 truncate max-w-[130px]">{item.productId?.productName}</p>
                            <p className="text-xs text-slate-500 mt-0.5">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="text-sm font-medium text-slate-900">
                          Rs. {(item.productId?.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    )
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                    <svg className="w-12 h-12 mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                    <p className="text-sm italic">Your cart is empty.</p>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100 pt-6 space-y-4 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-900">Rs. {subTotalAmount.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="text-slate-400 italic">Calculated at next step</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold pt-4 border-t border-slate-100 mt-2 text-slate-900">
                  <span>Total</span>
                  <span className="text-[#c19a6b]">Rs. {subTotalAmount.subtotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || cartItems.length === 0}
                className={`w-full mt-8 py-4 px-6 text-sm font-bold uppercase tracking-widest rounded-xl transition-all duration-300 flex justify-center items-center gap-2 ${submitting || cartItems.length === 0
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-[#c19a6b] text-white hover:bg-[#a88355] shadow-lg shadow-[#c19a6b]/20 hover:shadow-[#c19a6b]/40 hover:-translate-y-0.5 active:translate-y-0'
                  }`}
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Processing...
                  </>
                ) : 'Place Order'}
              </button>

              <div className="mt-5 text-center">
                <span className="text-xs text-slate-500 flex items-center justify-center gap-1.5 font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  256-Bit Secure Checkout
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;