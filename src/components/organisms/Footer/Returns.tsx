"use client"

import React from 'react';
import { RefreshCw, MessageCircle, ShieldCheck, AlertCircle } from 'lucide-react';

const Returns = () => {
    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Returns & Refunds</h1>
                    <p className="text-xl text-gray-600">WeeTok Buyer Protection has you covered.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {[
                        { title: 'Contact Seller', desc: 'First, chat with the seller to resolve the issue directly.', icon: MessageCircle, color: 'text-blue-500', bg: 'bg-blue-50' },
                        { title: 'Open Dispute', desc: 'If the seller doesn\'t respond, open a dispute with WeeTok.', icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-50' },
                        { title: 'Get Refunded', desc: 'Once approved, money returns to your wallet instantly.', icon: RefreshCw, color: 'text-green-500', bg: 'bg-green-50' },
                    ].map((step, idx) => (
                        <div key={idx} className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 text-center hover:-translate-y-2 transition-transform duration-300">
                            <div className={`w-16 h-16 ${step.bg} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                                <step.icon className={`w-8 h-8 ${step.color}`} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                            <p className="text-gray-500 leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
                    <div className="bg-gray-900 p-8 text-white flex items-center gap-4">
                        <ShieldCheck className="w-10 h-10 text-pink-500" />
                        <div>
                            <h2 className="text-2xl font-bold">WeeTok Buyer Protection</h2>
                            <p className="text-gray-400">Shop with confidence. We hold your payment until you&apos;re happy.</p>
                        </div>
                    </div>

                    <div className="p-8 md:p-12 space-y-8">
                        <div className="flex gap-6">
                            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 font-bold text-pink-600 text-xl">1</div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">7-Day Return Window</h3>
                                <p className="text-gray-600">You have 7 days from the delivery date to request a return for eligible items. Items must be unused and in original packaging.</p>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 font-bold text-pink-600 text-xl">2</div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Return Shipping</h3>
                                <p className="text-gray-600">If the item is defective, return shipping is free. For &quot;change of mind&quot; returns, shipping fees may apply depending on the seller&apos;s policy.</p>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 font-bold text-pink-600 text-xl">3</div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Non-Returnable Items</h3>
                                <p className="text-gray-600">Hygiene products, custom-made items, and digital goods are generally not eligible for return unless defective.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-8 text-center border-t border-gray-100">
                        <button className="bg-pink-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-pink-700 transition-colors shadow-lg hover:shadow-pink-500/30">
                            Start a Return
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Returns;
