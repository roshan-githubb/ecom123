"use client"

import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, HelpCircle, ShoppingBag, Store, DollarSign, Video } from 'lucide-react';

const FAQ = () => {
    const [activeTab, setActiveTab] = useState<'buyer' | 'seller'>('buyer');
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const buyerFaqs = [
        {
            question: "How do I buy from a Live Stream?",
            answer: "During a live stream, products will appear at the bottom of the screen. Simply tap the 'Buy Now' button to purchase instantly without leaving the stream."
        },
        {
            question: "Is my payment secure on WeeTok?",
            answer: "Yes! We use WeeTok Secure Pay. Your payment is held in escrow and only released to the seller once you confirm you've received the item."
        },
        {
            question: "How do I track my order from multiple sellers?",
            answer: "You can track all your orders in one place under 'My Orders'. Each seller ships independently, so you'll see separate tracking for each package."
        },
        {
            question: "What is the return policy?",
            answer: "Most items have a 7-day return window. However, check the specific seller's policy on the product page before purchasing."
        }
    ];

    const sellerFaqs = [
        {
            question: "How do I start selling on WeeTok?",
            answer: "Tap 'Become a Seller' in your profile settings. You'll need to verify your identity and link a bank account to receive payouts."
        },
        {
            question: "What are the selling fees?",
            answer: "We charge a flat 5% commission on successful sales. There are no listing fees or monthly subscription costs."
        },
        {
            question: "How do I go live to sell?",
            answer: "Once you're a verified seller, tap the '+' button and select 'Live Shopping'. Add products to your stream bucket before you go live!"
        },
        {
            question: "When do I get paid?",
            answer: "Earnings are released to your wallet 3 days after the order is delivered and confirmed by the buyer."
        }
    ];

    const faqs = activeTab === 'buyer' ? buyerFaqs : sellerFaqs;

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <div className="py-20 px-4 text-center text-white relative overflow-hidden bg-gray-900">
                <div className="absolute inset-0 bg-black/10"></div>
                <h1 className="text-4xl md:text-6xl font-black mb-6 relative z-10 tracking-tight">WeeTok Help Center</h1>
                <p className="text-xl md:text-2xl font-medium mb-10 relative z-10 max-w-2xl mx-auto">
                    Everything you need to know about buying, selling, and thriving on WeeTok Marketplace.
                </p>

                <div className="max-w-xl mx-auto relative z-10">
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Search for help..."
                            className="w-full py-4 pl-14 pr-6 rounded-full text-gray-900 shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/50 transition-all duration-300 text-lg"
                        />
                        <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6 group-focus-within:text-pink-500 transition-colors" />
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8 relative z-20">
                <div className="bg-white rounded-2xl p-2 shadow-xl flex mb-12">
                    <button
                        onClick={() => setActiveTab('buyer')}
                        className={`flex-1 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 ${activeTab === 'buyer'
                                ? 'bg-gray-900 text-white shadow-md'
                                : 'text-gray-500 hover:bg-gray-50'
                            }`}
                    >
                        <ShoppingBag className="w-5 h-5" />
                        For Buyers
                    </button>
                    <button
                        onClick={() => setActiveTab('seller')}
                        className={`flex-1 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 ${activeTab === 'seller'
                                ? 'bg-pink-600 text-white shadow-md'
                                : 'text-gray-500 hover:bg-gray-50'
                            }`}
                    >
                        <Store className="w-5 h-5" />
                        For Sellers
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {[
                        { label: 'Live Shopping', icon: Video, color: 'text-purple-500', bg: 'bg-purple-50' },
                        { label: 'Payments', icon: DollarSign, color: 'text-green-500', bg: 'bg-green-50' },
                        { label: 'Orders', icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-50' },
                        { label: 'Account', icon: HelpCircle, color: 'text-orange-500', bg: 'bg-orange-50' },
                    ].map((cat, idx) => (
                        <div key={idx} className={`${cat.bg} p-6 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-300`}>
                            <cat.icon className={`w-8 h-8 mb-3 ${cat.color}`} />
                            <span className="font-bold text-gray-800">{cat.label}</span>
                        </div>
                    ))}
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <span className="w-2 h-8 bg-pink-500 rounded-full"></span>
                        Top {activeTab === 'buyer' ? 'Buyer' : 'Seller'} Questions
                    </h2>

                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full px-8 py-6 text-left flex justify-between items-center focus:outline-none"
                            >
                                <span className="font-bold text-lg text-gray-800">{faq.question}</span>
                                {openIndex === index ? (
                                    <ChevronUp className="w-6 h-6 text-pink-500" />
                                ) : (
                                    <ChevronDown className="w-6 h-6 text-gray-400" />
                                )}
                            </button>
                            <div
                                className={`px-8 transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-48 opacity-100 pb-8' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <p className="text-gray-600 leading-relaxed text-lg">{faq.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FAQ;
