import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';

const OrderSuccess = () => {
    const location = useLocation();
    
    // Grab the order data we passed from Checkout.jsx
    const order = location.state?.order;

    // If someone tries to visit /success directly without checking out, send them home
    if (!order) {
        return <Navigate to="/" replace />;
    }

    // Helper to safely format image URLs
    const getImageUrl = (item) => {
        const images = item.productImages || item.productId?.productImages;
        if (!images || images.length === 0) return null;
        return images[0].startsWith('http') ? images[0] : `http://localhost:3000${images[0]}`;
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-800 selection:bg-[#c19a6b] selection:text-white">
            <div className="max-w-3xl mx-auto">

                {/* --- SUCCESS HEADER --- */}
                <div className="flex flex-col items-center text-center mb-10">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20 animate-bounce">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-serif text-slate-900 tracking-tight mb-2">Order Confirmed!</h1>
                    <p className="text-slate-500 max-w-md">
                        Thank you for shopping with The Watch Vault. Your order has been received and is being processed.
                    </p>
                </div>

                {/* --- MAIN ORDER CARD --- */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">

                    {/* Card Header: Order Info */}
                    <div className="bg-slate-50/50 border-b border-slate-100 p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Order Number</p>
                            {/* Uses the last 8 characters of the MongoDB ID for a clean order number */}
                            <p className="text-lg font-semibold text-slate-900 uppercase">
                                #ORD-{order._id.substring(order._id.length - 8)}
                            </p>
                        </div>
                        <div className="sm:text-right">
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Date</p>
                            <p className="text-sm font-medium text-slate-900">
                                {new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', {
                                    year: 'numeric', month: 'long', day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>

                    <div className="p-6 sm:p-8">

                        {/* Purchased Items List */}
                        <h2 className="text-sm font-bold uppercase tracking-wider mb-6 text-[#c19a6b]">Order Details</h2>
                        <div className="space-y-6 mb-8 custom-scrollbar">
                            {order.items?.map((item) => {
                                const name = item.productName || item.productId?.productName || 'Unknown Watch';
                                const price = item.price || item.productId?.price || 0;
                                const qty = item.quantity || 1;
                                const imageUrl = getImageUrl(item);
                                
                                return (
                                    <div key={item._id || item.productId?._id} className="flex justify-between items-center group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-24 h-24 bg-[#f4f1eb] rounded-lg overflow-hidden flex-shrink-0">
                                                {imageUrl ? (
                                                    <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-stone-300">
                                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <p className="text-sm font-semibold text-slate-900">{name}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">Qty: {qty}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm font-medium text-slate-900">Rs. {(price * qty).toLocaleString()}</p>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Pricing Totals */}
                        <div className="border-t border-slate-100 pt-6 space-y-4 text-sm mb-8">
                            <div className="flex justify-between text-slate-600">
                                <span>Subtotal</span>
                                <span className="font-medium text-slate-900">Rs. {order.totalAmount?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Shipping</span>
                                <span className="font-medium text-slate-900">{order.shippingMethod}</span>
                            </div>
                            <div className="flex justify-between items-center text-lg font-bold pt-4 border-t border-slate-100 mt-2 text-slate-900">
                                <span>Total Paid</span>
                                <span className="text-[#c19a6b]">Rs. {order.totalAmount?.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Customer & Shipping Info Summary */}
                        <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Shipping Address</h3>
                                <p className="text-sm text-slate-800 font-medium">{order.name}</p>
                                <p className="text-sm text-slate-500 mt-1">{order.address}</p>
                                <p className="text-sm text-slate-500">{order.city}, {order.zipCode}</p>
                            </div>
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Contact Info</h3>
                                <p className="text-sm text-slate-800 font-medium">{order.email}</p>
                                <p className="text-sm text-slate-500 mt-1">{order.phoneNum}</p>
                                <p className="text-sm text-slate-500 mt-1 capitalize">Payment: {order.paymentMethod}</p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* --- ACTION BUTTONS --- */}
                <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
                    <Link to="/" className="w-full sm:w-auto px-8 py-3.5 bg-[#c19a6b] text-white text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-[#a88355] shadow-lg shadow-[#c19a6b]/20 transition-all text-center">
                        Continue Shopping
                    </Link>
                    <button className="w-full sm:w-auto px-8 py-3.5 bg-white text-slate-700 text-sm font-bold uppercase tracking-widest rounded-xl border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-all text-center">
                        Download Receipt
                    </button>
                </div>

            </div>
        </div>
    );
};

export default OrderSuccess;