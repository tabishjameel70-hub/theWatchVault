import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';

const RecentOrders = () => {
  const location = useLocation();

  // --- Data States ---
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);

  // --- UI States ---
  const [expandedRowId, setExpandedRowId] = useState(null);

  // --- Fetch Data ---
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(false);
      const response = await axios.get('/api/orders', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = response.data.data || response.data || [];
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProductsCount = async () => {
    try {
      const response = await axios.get('/api/admin/products', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = response.data.data || [];
      setTotalProducts(data.length);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchProductsCount();
  }, []);

  // --- Helpers ---
  const toggleRow = (id) => {
    setExpandedRowId((prev) => (prev === id ? null : id));
  };

  const getImageUrl = (item) => {
    if (!item) return null;
    const images = item.productImages || item.productId?.productImages;
    if (!images || images.length === 0) return null;
    const imagePath = images[0].startsWith('/') ? images[0] : `/${images[0]}`;
    return images[0].startsWith('http') ? images[0] : `http://localhost:3000${imagePath}`;
  };

  // --- Derived Stats ---
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount || order.price || 0), 0);
  const totalOrdersCount = orders.length;

  return (
    <div className="flex h-screen w-full bg-[#FAFAFA] font-sans overflow-hidden">
      
      {/* ================= SIDEBAR ================= */}
      <aside className="hidden md:flex w-64 shrink-0 bg-[#1C2020] text-gray-300 flex-col justify-between min-h-screen shadow-xl">
        <div>
          <div className="p-6 border-b border-gray-700">
            <h1 className="text-xl font-serif font-semibold text-white">
              The Watch Vault
            </h1>
            <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-[#C49B66]">
              Administration
            </p>
          </div>

          <nav className="mt-6 px-4 space-y-2">
            <Link 
              to="/admin" 
              className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                location.pathname === '/admin' ? 'bg-[#C49B66] text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="w-5 text-center text-lg" aria-hidden="true">📊</span>
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
            
            <Link 
              to="/admin/inventory" 
              className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                location.pathname === '/admin/inventory' ? 'bg-[#C49B66] text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="w-5 text-center text-lg" aria-hidden="true">📦</span>
              <span className="text-sm font-medium">Inventory</span>
            </Link>
            
            <Link 
              to="/admin/recent-orders" 
              className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                location.pathname === '/admin/recent-orders' ? 'bg-[#C49B66] text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="w-5 text-center text-lg" aria-hidden="true">🧾</span>
              <span className="text-sm font-medium">Recent Orders</span>
            </Link>
          </nav>
        </div>

        <div className="p-6">
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem('adminToken');
              window.location.href = '/login';
            }}
            className="flex w-full items-center gap-3 text-sm text-gray-400 transition-colors hover:text-white"
          >
            <span aria-hidden="true">↪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 overflow-y-auto p-6 sm:p-10">
        <div className="mx-auto max-w-7xl space-y-8 animate-in fade-in duration-300">

          {/* Top Header */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#B08A58]">The Watch Vault / Admin</p>
              <h2 className="mt-1 font-serif text-3xl font-bold text-slate-900">Recent Orders</h2>
              <p className="mt-1 text-sm text-slate-500">Real-time orders fetched from your API.</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900">Admin</p>
                <p className="text-xs text-slate-500">Store administrator</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-[#C49B66]/20 text-[#C49B66] flex items-center justify-center font-bold font-serif text-lg border border-[#C49B66]/30">
                A
              </div>
            </div>
          </header>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Revenue</p>
              <h4 className="mt-2 text-3xl font-bold text-slate-900 font-serif">PKR {totalRevenue.toLocaleString()}</h4>
              <p className="mt-1 text-xs text-slate-400">All time earnings</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Orders</p>
              <h4 className="mt-2 text-3xl font-bold text-slate-900 font-serif">{totalOrdersCount}</h4>
              <p className="mt-1 text-xs text-slate-400">Completed & pending</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Products</p>
              <h4 className="mt-2 text-3xl font-bold text-slate-900 font-serif">{totalProducts}</h4>
              <p className="mt-1 text-xs text-slate-400">Active inventory</p>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 font-serif">Order History</h3>
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                orders.length > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
              }`}>
                {orders.length > 0 ? `${orders.length} Live Orders` : 'No data'}
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="bg-slate-50/80">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Order ID</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Customer</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Product</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Amount</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Date</th>
                    <th className="px-6 py-4 text-right"></th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-10 text-center text-sm text-slate-400">Loading orders...</td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-10 text-center text-sm text-rose-500">Failed to load orders.</td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-10 text-center text-sm text-slate-400">No orders to display.</td>
                    </tr>
                  ) : (
                    orders.map((order) => {
                      const orderId = order._id || order.id;
                      const isExpanded = expandedRowId === orderId;
                      
                      const firstItem = order.items?.[0];
                      const productData = firstItem?.productId;
                      const imageUrl = getImageUrl(firstItem);
                      const isMultiple = order.items?.length > 1;

                      const customerName = order.name || order.user?.name || order.address?.name || 'Guest User';
                      const email = order.email || order.user?.email || 'No email provided';
                      const phone = order.phone || order.address?.phone || order.shippingAddress?.phone || 'No phone provided';

                      const fullAddress = typeof order.address === 'object' && order.address !== null
                        ? `${order.address.street || ''}${order.address.city ? `, ${order.address.city}` : ''}`.trim() || 'No full address provided'
                        : order.address || 'No full address provided';

                      return (
                        <Fragment key={orderId}>
                          {/* ================= MAIN ROW ================= */}
                          <tr 
                            onClick={() => toggleRow(orderId)}
                            className={`group cursor-pointer transition-colors hover:bg-slate-50/70 border-t border-slate-100 ${isExpanded ? 'bg-slate-50/50' : ''}`}
                          >
                            <td className="px-6 py-4 whitespace-nowrap font-mono text-xs font-medium text-slate-600">
                              #{order._id ? order._id.slice(-6).toUpperCase() : order.id}
                            </td>

                            <td className="px-4 py-3.5 text-gray-600 font-medium">
                              {customerName}
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {imageUrl ? (
                                  <img src={imageUrl} alt={productData?.productName || "Product"} className="h-9 w-9 rounded object-cover border border-slate-200" onError={(e) => e.target.style.display = 'none'} />
                                ) : (
                                  <div className="h-9 w-9 rounded bg-slate-100 flex items-center justify-center text-[10px] text-slate-400 border border-slate-200">Img</div>
                                )}
                                <div className="flex flex-col">
                                  <span className="font-medium text-slate-900 truncate max-w-[150px]">
                                    {productData?.productName || 'Unknown Watch'}
                                  </span>
                                  {isMultiple && (
                                    <span className="mt-0.5 w-fit rounded-md bg-[#C49B66]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#B08A58]">
                                      +{order.items.length - 1} more item{order.items.length - 1 > 1 ? 's' : ''}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-4 font-semibold text-slate-900">
                              Rs. {Number(order.totalAmount || order.price || 0).toLocaleString()}
                            </td>

                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider border ${order.status === 'completed' || order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : order.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                                {order.status || 'Pending'}
                              </span>
                            </td>

                            <td className="px-6 py-4 text-sm text-slate-500">
                              {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                            </td>

                            <td className="px-6 py-4 text-right">
                              <svg 
                                className={`inline-block h-5 w-5 text-slate-400 transition-transform duration-300 ease-in-out ${isExpanded ? 'rotate-180' : ''}`}
                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </td>
                          </tr>

                          {/* ================= EXPANDABLE DETAILS ROW ================= */}
                          <tr>
                            <td colSpan={7} className="p-0 border-none">
                              <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                <div className="overflow-hidden bg-[#F8F9FA] shadow-inner">
                                  
                                  <div className="p-6 md:p-8 border-l-4 border-[#C49B66]">
                                    
                                    {/* Destination & Contact */}
                                    <div className="flex flex-col md:flex-row gap-8 md:gap-16 mb-8">
                                      <div className="flex-1">
                                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">Shipping Destination</h4>
                                        <p className="font-medium text-slate-800 mb-1">{customerName}</p>
                                        <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
                                          {fullAddress}
                                        </p>
                                      </div>
                                      
                                      <div className="flex-1">
                                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">Customer Contact</h4>
                                        <div className="space-y-2 text-sm">
                                          <p className="flex items-center gap-2 text-slate-600">
                                            <span className="font-medium text-slate-800 w-12">Email:</span> 
                                            {email}
                                          </p>
                                          <p className="flex items-center gap-2 text-slate-600">
                                            <span className="font-medium text-slate-800 w-12">Phone:</span> 
                                            {phone}
                                          </p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* All Items Grid */}
                                    <div>
                                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 border-t border-slate-200 pt-6">
                                        Items in this order
                                      </h4>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {order.items?.map((item, index) => {
                                          const itemProductData = item.productId;
                                          const itemImgUrl = getImageUrl(item);
                                          
                                          return (
                                            <div key={index} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                                              {itemImgUrl ? (
                                                <img src={itemImgUrl} alt="product" className="h-12 w-12 rounded-lg object-cover border border-slate-100" onError={(e) => e.target.style.display = 'none'} />
                                              ) : (
                                                <div className="h-12 w-12 rounded-lg bg-slate-50 flex items-center justify-center text-[10px] text-slate-400 border border-slate-100">Img</div>
                                              )}
                                              <div className="flex flex-col flex-1 min-w-0">
                                                <span className="text-sm font-semibold text-slate-900 truncate">
                                                  {itemProductData?.productName || 'Unknown Watch'}
                                                </span>
                                                <div className="flex items-center justify-between mt-1">
                                                  <span className="text-xs font-medium text-slate-500">Qty: {item.quantity || 1}</span>
                                                  <span className="text-xs font-bold text-[#C49B66]">
                                                    Rs. {Number(item.price || itemProductData?.price || 0).toLocaleString()}
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>

                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecentOrders;