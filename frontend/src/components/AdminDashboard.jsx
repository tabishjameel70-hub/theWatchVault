import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [productsList, setProductList] = useState([]);
  const [orders, setOrders] = useState([]);
  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/admin/products', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      setProductList(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  }
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(false);
      const response = await axios.get('/api/orders', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      setOrders(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);

    } finally {
      // THIS IS THE CRITICAL FIX:
      // Stops the loading spinner/text so the table can render the data
      setIsLoading(false);
    }
  }
  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);
  // State for text inputs
  const [formData, setFormData] = useState({
    productName: '',
    category: "Men's", // Set default to match your select options
    price: '',
    stockQuantity: '',
    description: ''
  });
  // State for the file
  const [productImage, setProductImage] = useState(null);
  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fileInputRef = useRef(null);
  const fileInputKey = 0; // Or a state variable if you need to force reset the file input
  // Handle standard text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  // Handle file input
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProductImage(e.target.files[0]);
    }
  };
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (!productImage) {
      setError('Please select an image.');
      setIsLoading(false);
      return;
    }

    // 1. Initialize FormData
    const submissionData = new FormData();

    // 2. Append all text fields from state
    submissionData.append('productName', formData.productName);
    submissionData.append('category', formData.category);
    submissionData.append('price', formData.price);
    submissionData.append('description', formData.description);
    submissionData.append('stockQuantity', formData.stockQuantity);

    // 3. Append the file
    // 'productImages' matches upload.single('productImages') in your backend
    submissionData.append('productImages', productImage);

    try {
      // 4. Send request using Axios
      const response = await axios.post('/api/admin/productlisting',
        submissionData,
        {
          headers: {
            // Ensure auth token is sent if isAdmin middleware requires it
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setSuccess('Product created successfully!');
      // Reset form
      setFormData({
        productName: '', category: "Men's", price: '', stockQuantity: '', description: ''
      });
      setProductImage(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FDFDFB] font-sans text-gray-800">
      {/* Sidebar */}
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
            {/* Replaced navItems.map with static links */}
            <div className="flex items-center gap-3 rounded-lg px-4 py-3 transition-colors bg-[#C49B66] text-white">
              <span className="w-5 text-center text-lg" aria-hidden="true">📊</span>
              <span className="text-sm font-medium">Dashboard</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg px-4 py-3 transition-colors text-gray-300 hover:bg-gray-800 hover:text-white cursor-pointer">
              <span className="w-5 text-center text-lg" aria-hidden="true">📦</span>
              <a href="/admin/inventory" className='text-sm font-medium'>Inventory</a>
            </div>
            <div className="flex items-center gap-3 rounded-lg px-4 py-3 transition-colors text-gray-300 hover:bg-gray-800 hover:text-white cursor-pointer">
              <span className="w-5 text-center text-lg" aria-hidden="true">📦</span>
              <a href="/admin/recent-orders" className='text-sm font-medium'>Recent Orders</a>
            </div>
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

      {/* Main content */}
      <main className="min-w-0 flex-1 overflow-y-auto">
        <header className="flex flex-col gap-4 border-b border-gray-100 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#B08A58]">
              The Watch Vault / Admin
            </p>
            <h2 className="mt-1 font-serif text-2xl font-bold text-gray-900">
              Dashboard
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage your watch collection and store activity.
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

        <div className="px-5 py-7 sm:px-8 lg:px-10">

          {/* Summary cards: Replaced statItems.map with static cards for fetched data */}
          <section
            aria-label="Store overview"
            className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium text-gray-500">Total Revenue</p>
              {/* Inject your fetched data state here, e.g., {fetchedData.revenue} */}
              <p className="mt-3 text-2xl font-bold text-gray-900">PKR 0</p>
              <p className="mt-2 text-xs text-gray-400">All time earnings</p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium text-gray-500">Total Orders</p>
              <p className="mt-3 text-2xl font-bold text-gray-900">0</p>
              <p className="mt-2 text-xs text-gray-400">Completed & pending</p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium text-gray-500">Total Products</p>
              <p className="mt-3 text-2xl font-bold text-gray-900">{productsList.length}</p>
              <p className="mt-2 text-xs text-gray-400">Active inventory</p>
            </div>

          </section>
          <div className="grid grid-cols-1 gap-7 xl:grid-cols-3">
      

            {/* Create product form */}
            <section className="h-fit rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5">
                <p className="text-xs uppercase tracking-[0.16em] text-[#B08A58]">
                  Inventory
                </p>
                <h3 className="mt-1 font-serif text-xl font-bold text-gray-900">
                  Create Product
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Add a watch to your store catalogue.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="productName"
                    className="mb-1.5 block text-xs font-medium text-gray-600"
                  >
                    Product Name *
                  </label>
                  <input
                    id="productName"
                    name="productName"
                    type="text"
                    value={formData.productName}
                    onChange={handleChange}
                    placeholder="Rolex Submariner"
                    required
                    className="w-full rounded-lg border border-gray-200 p-2.5 text-sm outline-none transition focus:border-[#C49B66] focus:ring-2 focus:ring-[#C49B66]/15"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="category"
                      className="mb-1.5 block text-xs font-medium text-gray-600"
                    >
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-200 bg-white p-2.5 text-sm outline-none focus:border-[#C49B66]"
                    >
                      <option value="Men's">Men's</option>
                      <option value="Women's">Women's</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="price"
                      className="mb-1.5 block text-xs font-medium text-gray-600"
                    >
                      Price (PKR) *
                    </label>
                    <input
                      id="price"
                      name="price"
                      type="number"
                      min="1"
                      step="1"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="125000"
                      required
                      className="w-full rounded-lg border border-gray-200 p-2.5 text-sm outline-none focus:border-[#C49B66]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="stockQuantity"
                    className="mb-1.5 block text-xs font-medium text-gray-600"
                  >
                    Stock Quantity
                  </label>
                  <input
                    id="stockQuantity"
                    name="stockQuantity"
                    type="number"
                    min="0"
                    step="1"
                    value={formData.stockQuantity}
                    onChange={handleChange}
                    placeholder="10"
                    className="w-full rounded-lg border border-gray-200 p-2.5 text-sm outline-none focus:border-[#C49B66]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="mb-1.5 block text-xs font-medium text-gray-600"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the watch, materials, movement, and features..."
                    className="w-full resize-y rounded-lg border border-gray-200 p-2.5 text-sm outline-none focus:border-[#C49B66]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="productImages"
                    className="mb-1.5 block text-xs font-medium text-gray-600"
                  >
                    Product Image
                  </label>
                  <input
                    key={fileInputKey}
                    ref={fileInputRef}
                    id="productImages"
                    name="productImages"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full rounded-lg border border-gray-200 p-2 text-xs text-gray-500 file:mr-3 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-xs file:font-medium file:text-gray-700 hover:file:bg-gray-200"
                  />
                  {productImage && (
                    <p className="mt-2 truncate text-xs text-gray-500">
                      Selected: {productImage.name}
                    </p>
                  )}
                </div>

                {error && (
                  <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    {error}
                  </p>
                )}

                {success && (
                  <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                    {success}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-2 w-full rounded-lg bg-[#C49B66] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#B08A58] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? 'Saving Product...' : 'Save Product'}
                </button>
              </form>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;