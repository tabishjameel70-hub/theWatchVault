import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const getSessionId = () => {
  let sessionId = localStorage.getItem('guest_session_id');
  if (!sessionId) {
    sessionId = 'guest_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('guest_session_id', sessionId);
  }
  return sessionId;
};

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
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // --- Fetch Cart Data ---
  useEffect(() => {
    const fetchCart = async () => {
      try {
        // Replace with your actual route to get the cart
        const response = await axios.get('/api/cart', {
          headers: { 'session-id': getSessionId() }
        });
        
        // Assuming your backend returns { items: [...], totalAmount: Number }
        if (response.data && response.data.cart) {
          setCartItems(response.data.cart.items || []);
          
          // Calculate total if backend doesn't send it directly
          const total = response.data.cart.items.reduce((sum, item) => sum + (item.productId.price * item.quantity), 0);
          setTotalAmount(total);
        }
      } catch (err) {
        console.error('Error fetching cart:', err);
        setError('Could not load cart details.');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // --- Handle Input Changes ---
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // --- Handle Order Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // POST to your order creation route
      await axios.post('/api/checkout', formData, {
        headers: { 'session-id': getSessionId() }
      });

      // Clear session cart on successful checkout
      alert('Order placed successfully!');
      navigate('/order-success'); // Redirect to a success page

    } catch (err) {
      console.error('Checkout error:', err);
      setError('Failed to place order. Please check your details and try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-stone-200 border-t-[#c19a6b] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] py-12 px-4 sm:px-6 lg:px-8 font-sans text-[#162032]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif mb-10 text-center md:text-left">Secure Checkout</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* --- LEFT COLUMN: Form Inputs --- */}
          <div className="lg:col-span-7 xl:col-span-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            
            {/* Contact Info */}
            <h2 className="text-lg font-bold uppercase tracking-wider mb-6 text-[#c19a6b]">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase">Full Name</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#162032] transition-colors" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase">Email Address</label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#162032] transition-colors" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase">Phone Number</label>
                <input type="tel" name="phoneNum" required value={formData.phoneNum} onChange={handleChange} className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#162032] transition-colors" placeholder="+92 300 1234567" />
              </div>
            </div>

            {/* Shipping Address */}
            <h2 className="text-lg font-bold uppercase tracking-wider mb-6 text-[#c19a6b] mt-10">Shipping Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase">Street Address</label>
                <input type="text" name="address" required value={formData.address} onChange={handleChange} className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#162032] transition-colors" placeholder="123 Luxury Ave, Suite 400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase">City</label>
                <input type="text" name="city" required value={formData.city} onChange={handleChange} className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#162032] transition-colors" placeholder="Karachi" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase">Zip / Postal Code</label>
                <input type="text" name="zipCode" required value={formData.zipCode} onChange={handleChange} className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#162032] transition-colors" placeholder="75000" />
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase">Location Type</label>
                <select name="homeType" value={formData.homeType} onChange={handleChange} className="w-full border-b border-gray-300 py-2 bg-transparent focus:outline-none focus:border-[#162032] transition-colors cursor-pointer text-gray-700">
                  <option value="House">House / Villa</option>
                  <option value="Apartment">Apartment / Flat</option>
                  <option value="Office">Office</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Methods */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
              <div>
                <h2 className="text-lg font-bold uppercase tracking-wider mb-6 text-[#c19a6b]">Shipping Method</h2>
                <select name="shippingMethod" value={formData.shippingMethod} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 bg-transparent focus:outline-none focus:border-[#162032] transition-colors cursor-pointer text-gray-700">
                  <option value="Standard Delivery">Standard Delivery (3-5 Days)</option>
                  <option value="Express Delivery">Express Delivery (1-2 Days)</option>
                </select>
              </div>
              <div>
                <h2 className="text-lg font-bold uppercase tracking-wider mb-6 text-[#c19a6b]">Payment Method</h2>
                <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 bg-transparent focus:outline-none focus:border-[#162032] transition-colors cursor-pointer text-gray-700">
                  <option value="COD">Cash on Delivery (COD)</option>
                  <option value="Bank">Direct Bank Transfer</option>
                </select>
              </div>
            </div>

          </div>

          {/* --- RIGHT COLUMN: Order Summary --- */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-[#162032] text-white p-8 rounded-2xl shadow-xl sticky top-8">
              <h2 className="text-xl font-serif mb-6 border-b border-gray-700 pb-4">Order Summary</h2>
              
              {/* Cart Items Loop */}
              <div className="max-h-[300px] overflow-y-auto mb-6 space-y-4 pr-2">
                {cartItems.length > 0 ? (
                  cartItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded flex items-center justify-center overflow-hidden">
                           {/* Assuming item.productId has the product details populated */}
                           <img src={item.productId.productImages?.[0] ? (item.productId.productImages[0].startsWith('http') ? item.productId.productImages[0] : `http://localhost:3000${item.productId.productImages[0]}`) : ''} alt={item.productId.productName} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold truncate max-w-[120px]">{item.productId.productName}</p>
                          <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="text-sm font-medium">Rs. {(item.productId.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm italic">Your cart is empty.</p>
                )}
              </div>

              <div className="border-t border-gray-700 pt-6 space-y-3 text-sm">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>Rs. {totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Shipping</span>
                  <span>Calculated at next step</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold pt-4 border-t border-gray-700 mt-4 text-[#c19a6b]">
                  <span>Total</span>
                  <span>Rs. {totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={submitting || cartItems.length === 0}
                className={`w-full mt-8 py-4 px-6 text-sm font-bold uppercase tracking-widest rounded-lg transition-all duration-300 shadow-lg ${
                  submitting || cartItems.length === 0 
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                    : 'bg-[#c19a6b] text-white hover:bg-[#a88355] hover:-translate-y-1 active:scale-[0.98]'
                }`}
              >
                {submitting ? 'Processing...' : 'Place Order'}
              </button>
              
              <div className="mt-4 text-center">
                <span className="text-xs text-gray-400 flex items-center justify-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  Secure Checkout
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