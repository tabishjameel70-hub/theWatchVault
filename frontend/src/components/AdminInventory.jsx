import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function AdminInventory() {
  const [productsList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch products from the backend
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
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/admin/login';
  };

  return (
    <div className="flex min-h-screen bg-[#FDFDFB] font-sans text-gray-800">

      {/* Sidebar */}
      <aside className="hidden min-h-screen w-64 shrink-0 flex-col justify-between bg-[#1C2020] text-gray-300 shadow-xl md:flex">
        <div>
          <div className="border-b border-gray-700 p-6">
            <h1 className="font-serif text-xl font-semibold text-white">
              The Watch Vault
            </h1>
            <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-[#C49B66]">
              Administration
            </p>
          </div>

          <nav className="mt-6 space-y-2 px-4">
            <Link
              to="/admin"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-300 transition hover:bg-gray-800 hover:text-white"
            >
              <span>📊</span>
              <span className="text-sm font-medium">Dashboard</span>
            </Link>

            <Link
              to="/admin/inventory"
              className="flex items-center gap-3 rounded-lg bg-[#C49B66] px-4 py-3 text-white"
            >
              <span>📦</span>
              <span className="text-sm font-medium">Inventory</span>
            </Link>
          </nav>
        </div>

        <div className="p-6">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 text-sm text-gray-400 transition hover:text-white"
          >
            <span>↪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-col gap-4 border-b border-gray-100 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#B08A58]">
              The Watch Vault / Admin
            </p>
            <h2 className="mt-1 font-serif text-2xl font-bold text-gray-900">
              Inventory Management
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              View all watches added to your store.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2E8DA] font-semibold text-[#8A673E]">
              A
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Admin</p>
              <p className="text-xs text-gray-500">Store administrator</p>
            </div>
          </div>
        </header>

        {/* Products Section */}
        <section className="flex-1 px-5 py-7 sm:px-8 lg:px-10">
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-gray-900">
                  All Inventory Products
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Products created from your admin dashboard.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="rounded-full bg-[#F2E8DA] px-3 py-1.5 text-xs font-semibold text-[#8A673E]">
                  Total: {productsList.length}
                </span>

                <button
                  type="button"
                  onClick={fetchProducts}
                  disabled={loading}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm hover:border-[#C49B66] disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Refresh'}
                </button>
              </div>
            </div>

            {loading ? (
              <div className="py-16 text-center text-sm text-gray-500">
                Loading products...
              </div>
            ) : error ? (
              <div className="py-16 text-center">
                <p className="text-sm text-red-600">{error}</p>
                <button
                  type="button"
                  onClick={fetchProducts}
                  className="mt-4 rounded-lg bg-[#1C2020] px-4 py-2 text-sm text-white"
                >
                  Try Again
                </button>
              </div>
            ) : productsList.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 py-16 text-center">
                <p className="text-4xl">⌚</p>
                <h4 className="mt-3 font-serif text-lg font-semibold">
                  No products found
                </h4>
                <p className="mt-2 text-sm text-gray-500">
                  Add products from your Dashboard to see them here.
                </p>
                <Link
                  to="/admin"
                  className="mt-5 inline-block rounded-lg bg-[#C49B66] px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Go to Dashboard
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {productsList.map((product) => (
                  <article
                    key={product._id}
                    className="group overflow-hidden rounded-xl border border-gray-100 transition hover:border-[#C49B66]/50 hover:shadow-lg"
                  >
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
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="truncate font-serif text-lg font-semibold text-gray-900">
                          {product.productName}
                        </h4>
                        <p className="shrink-0 text-sm font-bold text-[#8A673E]">
                          PKR {Number(product.price || 0).toLocaleString()}
                        </p>
                      </div>

                      <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                        {product.description || 'No description available.'}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center justify-between border-t border-gray-100 pt-3 gap-2">
                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-md bg-gray-100 px-2.5 py-1 text-[10px] font-semibold uppercase text-gray-600">
                            {product.category || 'Uncategorized'}
                          </span>
                          <span className={`rounded-md px-2.5 py-1 text-[10px] font-semibold uppercase ${Number(product.stockQuantity) > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                            }`}>
                            {Number(product.stockQuantity) > 0 ? `Stock: ${product.stockQuantity}` : 'Out of Stock'}
                          </span>
                        </div>

                        <a href={`/admin/products/${product._id}`}
                          className="rounded-md bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase text-[#8A673E] transition-colors hover:bg-amber-100"
                        >
                          Edit
                        </a>
                        
                      </div>
                    </div>

                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}