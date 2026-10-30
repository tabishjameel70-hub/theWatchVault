import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Moved outside so all functions can access it easily
const getSessionId = () => {
  let sessionId = localStorage.getItem('guest_session_id');
  if (!sessionId) {
    sessionId = 'guest_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('guest_session_id', sessionId);
  }
  return sessionId;
};

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [productsList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('/api/cart-product', {
        headers: {
          'session-id': getSessionId()
        },
      });
      setProductList(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    window.addEventListener('cartUpdated', fetchProducts);
    return () => window.removeEventListener('cartUpdated', fetchProducts);
  }, []);

  // --- NEW: Handle Quantity Changes ---
  const updateQuantity = async (productId, currentQty, delta, stockLimit) => {
    const newQty = currentQty + delta;
    
    // Prevent dropping below 1
    if (newQty < 1) return; 

    // Prevent exceeding available stock
    if (stockLimit && newQty > stockLimit) {
      alert(`Cannot add more. Only ${stockLimit} left in stock.`);
      return;
    }

    try {
      await axios.post(`/api/cart-product/${productId}`, { quantity: newQty }, {
        headers: { 'session-id': getSessionId() }
      });
      window.dispatchEvent(new Event('cartUpdated')); // Refresh cart UI
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert(error.response?.data?.message || 'Failed to update quantity.');
    }
  };

  // --- NEW: Handle Item Deletion ---
  const removeItem = async (productId) => {
    try {
      await axios.delete(`/api/cart-product/${productId}`, {
        headers: { 'session-id': getSessionId() }
      });
      window.dispatchEvent(new Event('cartUpdated')); // Refresh cart UI
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item.');
    }
  };

  const cartTotals = productsList.reduce((totals, item) => {
      const price = item.price || item.productId?.price || 0;
      const qty = item.quantity || 1;
      totals.subtotal += price * qty;
      totals.itemCount += qty;
      return totals;
    },{ subtotal: 0, itemCount: 0 }
  );

  const getImageUrl = (item) => {
    const images = item.productImages || item.productId?.productImages;
    if (!images || images.length === 0) return null;
    return images[0].startsWith('http') ? images[0] : `http://localhost:3000${images[0]}`;
  };

  return (
    <>
     <nav className="w-full flex items-center justify-between px-8 py-5 bg-[#FCFCF9] border-b border-gray-100">
        <div className="flex-shrink-0 cursor-pointer">
          <h1 className="text-2xl tracking-wide font-serif text-gray-800 font-semibold">
            TheWatchVault
          </h1>
        </div>

        <div className="hidden md:flex space-x-8">
          <a href="/" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Home</a>
          <a href="/shop" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Shop</a>
          <a href="/contact" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Contact</a>
        </div>

        <div className="flex items-center space-x-6">
          
          {/* User Profile / Login Link */}
          <a 
            href="/login" 
            className="text-gray-600 hover:text-gray-900 transition-colors"
            title="Sign In / Login"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </a>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
            {cartTotals.itemCount > 0 && (
              <span className="absolute -top-2 -right-2.5 bg-[#c19a6b] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white">
                {cartTotals.itemCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Dark Overlay Backdrop */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-stone-100">
          <h2 className="text-xl font-serif text-[#162032] font-semibold">Shopping Cart</h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-stone-400 hover:text-stone-800 transition-colors rounded-full hover:bg-stone-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Dynamic Sidebar Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="w-8 h-8 border-4 border-stone-200 border-t-[#c19a6b] rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="flex flex-col justify-center items-center h-full p-6 text-center">
              <p className="text-red-500 text-sm mb-4">{error}</p>
              <button onClick={fetchProducts} className="text-sm font-bold uppercase tracking-wider text-[#162032] border border-[#162032] px-4 py-2 rounded hover:bg-[#162032] hover:text-white transition">
                Retry
              </button>
            </div>
          ) : productsList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6">
              <svg className="w-16 h-16 text-stone-200 mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-stone-500 font-light text-center mb-2">Your cart is currently empty.</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-[#c19a6b] font-medium text-sm hover:underline hover:text-[#a88355] transition-colors"
              >
                Continue Browsing
              </button>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {productsList.map((item) => {
                // Safely extract product document
                const productDoc = item.productId || {};
                const name = item.productName || productDoc.productName || 'Unknown Watch';
                const price = item.price || productDoc.price || 0;
                const qty = item.quantity || 1;
                const stockLimit = productDoc.stockQuantity;
                const imageUrl = getImageUrl(item);
                const actualProductId = productDoc._id || item._id; 

                return (
                  <div key={item._id} className="flex gap-4 border-b border-stone-100 pb-6 last:border-0 last:pb-0">
                    <div className="w-24 h-24 bg-[#f4f1eb] rounded-lg overflow-hidden flex-shrink-0">
                      {imageUrl ? (
                        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-300">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col flex-1 justify-between">
                      <div>
                        <h3 className="text-[#162032] font-serif text-sm md:text-base leading-tight mb-1 line-clamp-2">
                          {name}
                        </h3>
                        <p className="text-[#c19a6b] font-medium text-sm mt-1">
                          PKR {Number(price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      
                      {/* ✨ NEW: Interactive Quantity & Delete Controls ✨ */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-stone-200 rounded flex-shrink-0">
                          <button 
                            onClick={() => updateQuantity(actualProductId, qty, -1, stockLimit)}
                            disabled={qty <= 1}
                            className="px-2.5 py-0.5 text-stone-500 hover:bg-stone-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            -
                          </button>
                          <span className="px-3 py-0.5 text-xs font-medium text-stone-700 border-l border-r border-stone-200">
                            {qty}
                          </span>
                          <button 
                            onClick={() => updateQuantity(actualProductId, qty, 1, stockLimit)}
                            className="px-2.5 py-0.5 text-stone-500 hover:bg-stone-100 transition-colors"
                          >
                            +
                          </button>
                        </div>

                        <button 
                          onClick={() => removeItem(actualProductId)}
                          className="text-xs text-red-400 hover:text-red-600 underline underline-offset-2 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                      {/* End Controls */}

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-stone-100 bg-stone-50/50">
          <div className="flex justify-between mb-4">
            <span className="text-stone-500 font-medium">Subtotal</span>
            <span className="text-[#162032] font-serif font-semibold">
              PKR {cartTotals.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          <p className="text-xs text-stone-400 mb-6 text-center">Shipping and taxes calculated at checkout.</p>
          
          {/* Note: Fixed the anchor tag so it actually becomes unclickable when empty */}
          <a
            href='/checkout'
            className={`block text-center w-full py-4 text-white font-bold uppercase tracking-wider text-sm rounded-lg transition-colors ${productsList.length > 0
              ? 'bg-[#162032] hover:bg-[#0f172a] active:scale-[0.98]'
              : 'bg-stone-300 pointer-events-none'
              }`}
          >
            Checkout
          </a>
        </div>
      </div>
    </>
  );
};

export default Navbar;