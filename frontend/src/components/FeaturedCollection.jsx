import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';


const FeaturedCollection = () => {
  const [productsList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch products from the backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');

      // Note: If FeaturedCollection is on the public home page, you might eventually 
      // want to create a public backend route that doesn't require an admin token.
      const response = await axios.get('/api/admin/products', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
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
  }, []);

  return (
    <section className="w-full bg-white py-16 px-8 md:px-16">
      <div className="max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif font-semibold text-gray-800">
              Our Featured Collection
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Discover the finest selection of premium watches.
            </p>
          </div>
          <a href="/collection" className="text-[#C49B66] hover:text-[#B08A58] text-sm font-medium flex items-center gap-1 mt-4 md:mt-0 transition-colors">
            View All <span>&rarr;</span>
          </a>
        </div>

        {/* Loading and Error States */}
        {loading && <div className="py-10 text-center text-gray-500">Loading collection...</div>}
        {error && <div className="py-10 text-center text-red-500">{error}</div>}

        {/* Product Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productsList.map((product) => (
              // Changed from product.id to product._id for MongoDB
              <div key={product._id} className="group cursor-pointer">
                {/* Product Image */}
                <div className="h-52 overflow-hidden bg-[#F7F5F0]">
                  {product.productImages?.length > 0 ? (
                    <img
                      src={
                        product.productImages[0].startsWith('http')
                          ? product.productImages[0]
                          : `http://localhost:3000${product.productImages[0]}`
                      }
                      alt={product.productName || 'Watch'}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-400">
                      No image available
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div>
                  {/* Changed to product.productName */}
                  <h3 className="font-semibold text-gray-900 text-sm">{product.productName}</h3>
                  {/* Changed to product.category */}
                  <p className="text-xs text-gray-400 mt-0.5 capitalize">{product.category}</p>

                  <div className="flex items-end justify-between mt-3">
                    <div>
                      {/* Added toLocaleString() to format numbers with commas (e.g. 1,250,000) */}
                      <span className="font-bold text-gray-900 text-sm">Rs. {product.price ? product.price.toLocaleString() : '0'}</span>
                      <div className="flex items-center gap-1 mt-1 text-xs font-medium text-[#D4AF37]">
                        {/* Star Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                        {/* Assuming rating isn't in DB yet, falling back to 4.5 */}
                        {product.rating || '4.5'}
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <a href={`/product-details/${product._id}`} className="bg-gray-50 hover:bg-gray-100 border border-gray-100 p-2.5 rounded-lg text-gray-600 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
                    </a>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCollection;