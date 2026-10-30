import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '' 
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Adjust this endpoint to match your Node.js backend route
      const response = await axios.post('/api/signup', formData);
      
      // Automatically log them in by saving the token
      localStorage.setItem('token', response.data.token);
      
      // Redirect to shop or success page
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FCFCF9] px-4 font-sans selection:bg-[#c19a6b] selection:text-white pt-10 pb-20">
      <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-2xl shadow-xl shadow-stone-200/40 border border-stone-100">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif text-[#162032] font-semibold mb-2">Create an Account</h2>
          <p className="text-sm text-stone-500">Begin your horological journey with us.</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center border border-red-100">
            {error}
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">
              Full Name
            </label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-stone-200 p-3 text-sm outline-none transition focus:border-[#c19a6b] focus:ring-1 focus:ring-[#c19a6b] bg-stone-50 focus:bg-white"
              placeholder="John Doe"
              required
            />
          </div>

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
            <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">
              Password
            </label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-stone-200 p-3 text-sm outline-none transition focus:border-[#c19a6b] focus:ring-1 focus:ring-[#c19a6b] bg-stone-50 focus:bg-white"
              placeholder="Create a strong password"
              required
              minLength="6"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#162032] text-white py-3.5 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-[#0f172a] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Back to Login Link */}
        <p className="mt-8 text-center text-sm text-stone-500">
          Already have an account?{' '}
          <a href="/login" className="text-[#162032] font-semibold hover:text-[#c19a6b] transition-colors">
            Sign in
          </a>
        </p>

      </div>
    </div>
  );
};

export default Signup;