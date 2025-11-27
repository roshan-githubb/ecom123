"use client"

import React, { useState } from 'react';
import { Package, Search, MapPin, Truck, CheckCircle, Circle, Store } from 'lucide-react';

const TrackOrder = () => {
    const [orderId, setOrderId] = useState('');
    const [isTracking, setIsTracking] = useState(false);

    const handleTrack = (e: React.FormEvent) => {
        e.preventDefault();
        setIsTracking(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <div className="inline-block p-3 bg-pink-100 rounded-full mb-4">
                        <Truck className="w-8 h-8 text-pink-600" />
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 mb-2">Track Your WeeTok Haul</h1>
                    <p className="text-gray-600 text-lg">See where your goodies are in real-time.</p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-gray-100">
                    <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                placeholder="Enter Order ID (e.g. WT-88291)"
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-pink-500 focus:bg-white focus:outline-none transition-all text-lg font-medium"
                            />
                            <Package className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                        </div>
                        <button
                            type="submit"
                            className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                            Track It
                        </button>
                    </form>
                </div>

                {isTracking && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Order #WT-88291</h2>
                                <div className="flex items-center gap-2 mt-1 text-gray-500">
                                    <Store className="w-4 h-4" />
                                    <span>Sold by <span className="font-bold text-pink-600">Glamour Boutique</span></span>
                                </div>
                            </div>
                            <span className="px-6 py-2 bg-green-100 text-green-700 rounded-full font-bold text-sm uppercase tracking-wide">
                                Arriving Tomorrow
                            </span>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 to-yellow-500"></div>

                            <div className="space-y-8 relative">
                                <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-gray-100"></div>

                                {[
                                    { status: 'Order Placed', time: 'Oct 24, 10:30 AM', active: true, desc: 'Your order has been confirmed.' },
                                    { status: 'Seller Packed', time: 'Oct 24, 02:15 PM', active: true, desc: 'Seller has packed your items.' },
                                    { status: 'Picked Up', time: 'Oct 25, 09:00 AM', active: true, desc: 'WeeTok Logistics picked up the package.' },
                                    { status: 'Out for Delivery', time: 'Estimated Oct 26', active: false, desc: 'Our rider is on the way!' },
                                ].map((step, idx) => (
                                    <div key={idx} className="relative flex items-start gap-6">
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 z-10 transition-colors duration-300 ${step.active ? 'bg-gray-900 text-white shadow-lg' : 'bg-white border-2 border-gray-100 text-gray-300'
                                            }`}>
                                            {step.active ? <CheckCircle className="w-8 h-8" /> : <Circle className="w-8 h-8" />}
                                        </div>
                                        <div className="pt-2">
                                            <h3 className={`text-lg font-bold ${step.active ? 'text-gray-900' : 'text-gray-400'}`}>
                                                {step.status}
                                            </h3>
                                            <p className="text-sm text-gray-500 font-medium mb-1">{step.time}</p>
                                            <p className="text-gray-600">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="text-center pt-8">
                            <p className="text-gray-500">Problem with your order?</p>
                            <button className="text-pink-600 font-bold hover:underline mt-1">Chat with Seller</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackOrder;
