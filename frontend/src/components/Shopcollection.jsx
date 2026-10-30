import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Helper to manage guest sessions for the cart
const getSessionId = () => {
  let sessionId = localStorage.getItem('guest_session_id');
  if (!sessionId) {
    sessionId = 'guest_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('guest_session_id', sessionId);
  }
  return sessionId;
};

const Shop = () => {
  const [productsList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.get('/api/admin/products', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setProductList(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setError('Failed to load the collection. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle Cart Additions
  const handleAddToCart = async (e, productId) => {
    e.preventDefault();
    
    const product = productsList.find((p) => p._id === productId || p.id === productId);
    
    if (product && product.stockQuantity <= 0) {
      alert("Sorry, this product is currently out of stock.");
      return;
    }

    try {
      await axios.post(`/api/cart-product/${productId}`, {}, {
        headers: {
          'session-id': getSessionId()
        }
      });

      // Dispatch event to update navbar cart count instantly
      window.dispatchEvent(new Event('cartUpdated'));

    } catch (error) {
      console.error("Failed to add to cart", error);
      alert(error.response?.data?.message || "Could not add product to cart. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFCF9] font-sans selection:bg-[#c19a6b] selection:text-white">
      
      {/* --- HERO BANNER --- */}
      <section className="w-full bg-[#162032] py-20 px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-[#c19a6b] uppercase tracking-[0.25em] text-xs font-bold block mb-4">
            The Watch Vault
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">
            The Complete Collection
          </h1>
          <p className="text-gray-400 text-sm md:text-base font-light max-w-xl mx-auto leading-relaxed">
            Explore our curated selection of authentic, premium timepieces. From daily sophistication to rare collector editions, find the perfect watch to elevate your wrist.
          </p>
        </div>
      </section>

      {/* --- SHOP GRID SECTION --- */}
      <section className="w-full py-16 px-6 md:px-12 lg:px-16 max-w-[1400px] mx-auto">
        
        {/* Toolbar (Filters / Count) */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 pb-4 border-b border-gray-200 gap-4">
          <p className="text-sm text-gray-500 font-medium">
            Showing <span className="text-gray-900">{productsList.length}</span> timepieces
          </p>
          <div className="flex items-center gap-4">
            <select className="text-sm border-gray-200 rounded-md py-2 px-3 text-gray-700 bg-white outline-none focus:border-[#c19a6b]">
              <option>Sort by: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest Arrivals</option>
            </select>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="py-20 flex justify-center items-center">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-[#c19a6b] rounded-full animate-spin"></div>
          </div>
        )}
        
        {error && (
          <div className="py-20 text-center text-red-500 bg-red-50 rounded-xl max-w-2xl mx-auto">
            {error}
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {productsList.map((product) => {
              const isOutOfStock = product.stockQuantity <= 0;

              return (
                <div key={product._id} className="group cursor-pointer flex flex-col h-full">

                  {/* Image Container */}
                  <div className="relative h-72 w-full overflow-hidden bg-[#F7F5F0] rounded-lg mb-4">
                    
                    {/* Out of Stock Badge */}
                    {isOutOfStock && (
                      <div className="absolute top-3 left-3 bg-red-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded uppercase tracking-wider z-10">
                        Out of Stock
                      </div>
                    )}

                    {product.productImages?.length > 0 ? (
                      <img
                        src={
                          product.productImages[0].startsWith('http')
                            ? product.productImages[0]
                            : `http://localhost:3000${product.productImages[0]}`
                        }
                        alt={product.productName || 'Watch'}
                        className={`h-full w-full object-cover transition-transform duration-700 ${isOutOfStock ? 'opacity-70' : 'group-hover:scale-105'}`}
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-gray-400">
                        No image
                      </div>
                    )}

                    {/* Hover Overlay: View Details */}
                    <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out flex justify-center pointer-events-none group-hover:pointer-events-auto z-10">
                      <a
                        href={`/product-details/${product._id}`}
                        className="block bg-gray-900/95 backdrop-blur-sm text-white text-xs font-semibold tracking-wide py-3 px-8 rounded-full w-full text-center shadow-lg hover:bg-black transition-colors"
                      >
                        View Details
                      </a>
                    </div>
                  </div>

                  {/* Product Details Container */}
                  <div className="flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-1">
                      <a href={`/product-details/${product._id}`} className="block flex-grow">
                        <h3 className="font-serif font-semibold text-gray-900 text-base leading-tight hover:text-[#c19a6b] transition-colors">
                          {product.productName}
                        </h3>
                      </a>
                    </div>
                    
                    <p className="text-xs text-gray-400 capitalize mb-4">
                      {product.category || 'Luxury Watch'}
                    </p>

                    {/* Price and Cart Button Pushed to Bottom */}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                      <div>
                        <span className={`font-bold text-base block ${isOutOfStock ? 'text-gray-400' : 'text-[#162032]'}`}>
                          PKR {product.price ? product.price.toLocaleString() : '0'}
                        </span>
                      </div>

                      {/* Quick Add Button */}
                      <button
                        onClick={(e) => handleAddToCart(e, product._id)}
                        disabled={isOutOfStock}
                        title={isOutOfStock ? "Out of Stock" : "Add to Cart"}
                        className={`p-3 rounded-full transition-all duration-300 ${
                          isOutOfStock 
                            ? 'bg-gray-100 text-gray-300 cursor-not-allowed' 
                            : 'bg-stone-100 hover:bg-[#162032] text-gray-600 hover:text-white shadow-sm'
                        }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </section>

    </div>
  );
};

export default Shop;