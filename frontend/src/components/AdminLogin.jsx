import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); // Clear error when typing
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
        // 1. FIXED: Added formData so the backend receives the email and password
        const response = await axios.post('/api/admin/login', formData);
        
        console.log(response.data.message);
        localStorage.setItem('adminToken', response.data.token);
        
        // (Optional but recommended) Redirect the user after successful login
        navigate('/admin'); 
        
    } catch (error) { 
        // 2. FIXED: Changed 'err' to 'error' to match the variable below
        setError(error.response?.data?.message || 'Invalid credentials');
    } finally {
        setIsLoading(false);
    }
};
    return (
        <div className="min-h-screen bg-[#1C2020] flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md bg-[#252A2A] rounded-2xl shadow-2xl p-8 border border-gray-800">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-serif text-white font-semibold mb-2">We Watch Vault</h1>
                    <p className="text-gray-400 text-sm">Secure Admin Portal</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="admin@wewatchvault.com"
                            className="w-full bg-[#1C2020] text-gray-200 border border-gray-700 rounded-lg p-3 outline-none focus:border-[#C49B66] transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full bg-[#1C2020] text-gray-200 border border-gray-700 rounded-lg p-3 outline-none focus:border-[#C49B66] transition-colors"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#C49B66] hover:bg-[#B08A58] text-white font-medium rounded-lg p-3 transition-colors mt-4 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : (
                            'Access Dashboard'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;