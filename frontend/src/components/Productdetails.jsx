import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';


// 1. Put the session helper OUTSIDE your functions so it can be reused easily
const getSessionId = () => {
  let sessionId = localStorage.getItem('guest_session_id');
  if (!sessionId) {
    sessionId = 'guest_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('guest_session_id', sessionId);
  }
  return sessionId;
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [specificproductsList, setspecificproductsList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // 2. THIS ONLY FETCHES THE WATCH DETAILS TO SHOW ON SCREEN
  useEffect(() => {
    const fetchSpecificProductDetails = async () => {
      try {
        setLoading(true);
        setError(false);

        // This must be a GET request to your product-details route!
        const productDetails = await axios.get(`/api/product-details/${id}`);
        if (productDetails.data.data) {
          const p = productDetails.data.data;
          setspecificproductsList({
            name: p.productName || '',
            description: p.description || '',
            price: p.price || '',
            stock: p.stockQuantity || '',
            category: p.category || "Men's",
            productImages: p.productImages || []
          });
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
        setError('Failed to load product. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSpecificProductDetails();
    }
  }, [id]);

  // 3. THIS ONLY ADDS TO CART WHEN THE BUTTON IS CLICKED
  const handleAddToCart = async () => {
    try {
      // This is a POST request to your cart route using the session ID
      await axios.post(`/api/cart-product/${id}`, {}, {
        headers: {
          'session-id': getSessionId()
        }
      });

      // Redirect back to home after successfully adding to cart
      navigate('/');

    } catch (error) {
      console.error("Failed to add to cart", error);
      alert("Could not add product to cart. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-stone-200 border-t-[#c19a6b] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex flex-col items-center justify-center p-6">
        <div className="bg-white border border-stone-200 shadow-sm p-8 max-w-md w-full text-center rounded-2xl">
          <p className="text-[#162032] font-serif text-xl mb-2">Notice</p>
          <p className="text-stone-500 mb-6">{error}</p>
          <button onClick={() => navigate(-1)} className="px-6 py-2 bg-[#162032] hover:bg-[#0f172a] text-white transition-colors text-sm tracking-wider uppercase rounded-lg">
            Return
          </button>
        </div>
      </div>
    );
  }

  if (!specificproductsList) return null;

  return (
    <div className="min-h-screen bg-[#faf9f6] py-12 px-4 sm:px-6 lg:px-8 font-sans flex items-center justify-center">
      <div className="max-w-5xl w-full bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row transition-all duration-500">

        {/* Left: Product Image Area */}
        <div className="md:w-1/2 bg-[#f4f1eb] relative flex items-center justify-center min-h-[400px] md:min-h-[600px] p-8 md:p-12">
          {specificproductsList.productImages?.length > 0 ? (
            <div className="relative w-full h-full rounded-2xl shadow-xl overflow-hidden group bg-white">
              <img
                src={
                  specificproductsList.productImages[0].startsWith('http')
                    ? specificproductsList.productImages[0]
                    : `http://localhost:3000${specificproductsList.productImages[0]}`
                }
                alt={specificproductsList.name || 'Watch'}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
              />
            </div>
          ) : (
            <div className="text-center bg-white w-full h-full rounded-2xl shadow-xl flex items-center justify-center">
              <span className="text-stone-400 font-serif italic text-lg">Image not available</span>
            </div>
          )}
        </div>

        {/* Right: Product Details Area */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white z-10 shadow-[-10px_0_20px_rgba(0,0,0,0.02)]">
          <div className="mb-4">
            <span className="text-[#c19a6b] text-xs font-bold uppercase tracking-[0.2em]">
              {specificproductsList.category}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-[#162032] mb-6 leading-tight">
            {specificproductsList.name}
          </h1>
          <div className="mb-8">
            <p className="text-2xl font-serif text-[#162032]">
              ${Number(specificproductsList.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="w-12 h-[1px] bg-[#c19a6b] mb-8"></div>
          <p className="text-stone-500 leading-relaxed mb-10 font-light">
            {specificproductsList.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            {/* MAKE SURE handleAddToCart IS CONNECTED TO THIS BUTTON */}
            <button
              disabled={specificproductsList.stock <= 0}
              onClick={handleAddToCart}
              className={`flex-1 py-4 px-8 text-sm font-bold uppercase tracking-wider transition-all duration-300 rounded-lg shadow-sm ${specificproductsList.stock > 0
                  ? 'bg-[#c19a6b] text-white hover:bg-[#a88355] active:scale-[0.98]'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }`}
            >
              {specificproductsList.stock > 0 ? 'Add to Cart' : 'Unavailable'}
            </button>
            <button onClick={() => navigate(-1)} className="py-4 px-8 border border-[#162032] text-[#162032] text-sm font-bold uppercase tracking-wider hover:bg-[#162032] hover:text-white transition-all duration-300 rounded-lg">
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;