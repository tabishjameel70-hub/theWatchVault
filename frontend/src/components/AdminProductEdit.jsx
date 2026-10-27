import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const AdminProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: 'electronics',
  });
  
  // NEW: Dedicated state for the image file
  const [imageFile, setImageFile] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await axios.get(`/api/admin/products/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        
        if (response.data.data) {
           const p = response.data.data;
           setProduct({
             name: p.productName || '',
             description: p.description || '',
             price: p.price || '',
             stock: p.stockQuantity || '',
             category: p.category || 'electronics'
           });
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
        setError('Failed to load product. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.id]: e.target.value });
  };

  // NEW: Handle file selection
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // UPDATED: Convert data to FormData to support Multer file uploads
  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    // Create FormData object
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price);
    formData.append('stock', product.stock);
    formData.append('category', product.category);
    
    // Only append the image if the user selected a new one
    // Note: The key 'productImages' must perfectly match upload.single('productImages') on the backend
    if (imageFile) {
        formData.append('productImages', imageFile);
    }

    try {
        // Send formData instead of the product object
        await axios.put(`/api/admin/products/${id}`, formData, {
            headers: { 
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'multipart/form-data' // Required for file uploads
            }
        });
        alert('Product updated successfully!');
        navigate('/admin/inventory');
    } catch (error) {
        console.error('Failed to update:', error);
        alert('Failed to update product. Check console for errors.');
    } finally {
        setSaving(false);
    }
  };

  if (loading) return <div className="text-center mt-20 text-gray-500">Loading product details...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-sm border border-gray-100 mt-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-sm text-gray-500 mt-1">Update the details and inventory for this product.</p>
      </div>

      {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

      <form className="space-y-6" onSubmit={handleUpdate}>
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">Product Name</label>
          <input type="text" id="name" value={product.name} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
          <textarea id="description" rows="5" value={product.description} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-1">Price (Rs)</label>
            <input type="number" id="price" value={product.price} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label htmlFor="stock" className="block text-sm font-semibold text-gray-700 mb-1">Stock Quantity</label>
            <input type="number" id="stock" value={product.stock} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
            <select id="category" value={product.category} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="accessories">Accessories</option>
              <option value="home">Home & Lifestyle</option>
            </select>
          </div>
          
          {/* UPDATED: Added onChange handler for the file input */}
          <div>
            <label htmlFor="image" className="block text-sm font-semibold text-gray-700 mb-1">Product Image (Optional)</label>
            <input type="file" id="image" onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 pt-6 mt-6 border-t border-gray-100">
          <button type="button" onClick={() => navigate('/admin/inventory')} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium focus:outline-none focus:ring-2 focus:ring-gray-200">Cancel</button>
          <button type="submit" disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductEdit;