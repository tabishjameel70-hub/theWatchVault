import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Adjust this endpoint to match your Node.js backend route
      const response = await axios.post('/api/users/login', formData);
      
      // Save the user token
      localStorage.setItem('token', response.data.token);
      
      // Redirect to shop or account page
      navigate('/shop');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FCFCF9] px-4 font-sans selection:bg-[#c19a6b] selection:text-white pt-10 pb-20">
      <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-2xl shadow-xl shadow-stone-200/40 border border-stone-100">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif text-[#162032] font-semibold mb-2">Welcome Back</h2>
          <p className="text-sm text-stone-500">Sign in to access your personal vault.</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center border border-red-100">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">
              Email Address
            </label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-stone-200 p-3 text-sm outline-none transition focus:border-[#c19a6b] focus:ring-1 focus:ring-[#c19a6b] bg-stone-50 focus:bg-white"
              placeholder="you@example.com"
              required
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                Password
              </label>
              <a href="#" className="text-xs text-[#c19a6b] hover:text-[#a88355] transition-colors">
                Forgot password?
              </a>
            </div>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-stone-200 p-3 text-sm outline-none transition focus:border-[#c19a6b] focus:ring-1 focus:ring-[#c19a6b] bg-stone-50 focus:bg-white"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#162032] text-white py-3.5 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-[#0f172a] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Create Account Link */}
        <p className="mt-8 text-center text-sm text-stone-500">
          Don't have an account?{' '}
          <a href="/signup" className="text-[#162032] font-semibold hover:text-[#c19a6b] transition-colors">
            Create one
          </a>
        </p>

        {/* ✨ Subtle Admin Portal Link ✨ */}
        <div className="mt-10 pt-6 border-t border-stone-100 text-center">
          <p className="text-[10px] text-stone-400 uppercase tracking-[0.2em] mb-3">
            Secure Access • The Watch Vault
          </p>
          <div>
            <span className="text-xs text-stone-400">Authorized personnel only? </span>
            <a 
              href="/admin/login" 
              className="text-xs text-stone-500 font-medium hover:text-[#c19a6b] transition-colors underline underline-offset-2"
            >
              Admin Portal
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;