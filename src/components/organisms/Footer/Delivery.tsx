"use client"

import React from 'react';
import { Truck, MapPin, Clock, Zap } from 'lucide-react';

const Delivery = () => {
    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            <div className="bg-gray-900 text-white py-20 px-4 text-center">
                <h1 className="text-4xl md:text-6xl font-black mb-6">Fast & Reliable Delivery</h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    Whether it&apos;s fulfilled by WeeTok or directly from the seller, we ensure your package arrives safely.
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
                    <div>
                        <span className="text-pink-600 font-bold tracking-wider uppercase mb-2 block">WeeTok Express</span>
                        <h2 className="text-4xl font-bold mb-6">Fulfilled by WeeTok</h2>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            Look for the <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-pink-100 text-pink-800 mx-1"><Zap className="w-3 h-3 mr-1" /> EXPRESS</span> badge.
                            These items are stored in our warehouses and shipped directly to you for the fastest delivery times.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-center font-medium text-gray-800">
                                <Clock className="w-5 h-5 text-pink-500 mr-3" />
                                Next Day Delivery in Metro Areas
                            </li>
                            <li className="flex items-center font-medium text-gray-800">
                                <Truck className="w-5 h-5 text-pink-500 mr-3" />
                                Free Shipping on orders over Rs. 1000
                            </li>
                        </ul>
                    </div>
                    <div className="bg-pink-50 rounded-3xl p-8 md:p-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                        <img
                            src="https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=1600&q=80"
                            alt="Delivery Van"
                            className="relative rounded-2xl shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1 bg-blue-50 rounded-3xl p-8 md:p-12">
                        <img
                            src="https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=1600&q=80"
                            alt="Seller Packing"
                            className="rounded-2xl shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500"
                        />
                    </div>
                    <div className="order-1 md:order-2">
                        <span className="text-blue-600 font-bold tracking-wider uppercase mb-2 block">Direct Shipping</span>
                        <h2 className="text-4xl font-bold mb-6">Seller Shipping</h2>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            Many unique items are shipped directly from our verified sellers. Delivery times vary based on the seller&apos;s location and handling time.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-center font-medium text-gray-800">
                                <MapPin className="w-5 h-5 text-blue-500 mr-3" />
                                Trackable via WeeTok App
                            </li>
                            <li className="flex items-center font-medium text-gray-800">
                                <Truck className="w-5 h-5 text-blue-500 mr-3" />
                                Standard Delivery (3-7 Days)
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Delivery;
