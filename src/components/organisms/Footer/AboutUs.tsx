import React from 'react';
import { Users, Heart, ShoppingBag, Video } from 'lucide-react';

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            <div className="relative bg-black text-white py-32 px-4 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

                <div className="relative z-10 max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter">
                        WeeTok <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Marketplace</span>
                    </h1>
                    <p className="text-2xl md:text-3xl font-medium text-gray-300 max-w-3xl mx-auto">
                        Where Entertainment Meets Commerce.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-4xl font-black mb-6">Not Just Another Store</h2>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        WeeTok is a social marketplace where creators, sellers, and shoppers connect.
                        Discover viral products through short videos, join live shopping events, and support local businesses.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {[
                        { title: 'Discover', desc: 'Find products you never knew you needed through trending videos.', icon: Video, color: 'text-pink-500' },
                        { title: 'Shop Live', desc: 'Interact with sellers in real-time and buy instantly during streams.', icon: ShoppingBag, color: 'text-purple-500' },
                        { title: 'Connect', desc: 'Join a community of millions of shoppers and creators.', icon: Users, color: 'text-blue-500' },
                    ].map((item, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-3xl p-10 text-center hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100">
                            <item.icon className={`w-12 h-12 mx-auto mb-6 ${item.color}`} />
                            <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                            <p className="text-gray-600">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-gray-900 text-white py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-black mb-12">Join the Revolution</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="p-6">
                            <div className="text-5xl font-black text-pink-500 mb-2">1M+</div>
                            <div className="text-gray-400 font-bold uppercase">Active Users</div>
                        </div>
                        <div className="p-6">
                            <div className="text-5xl font-black text-purple-500 mb-2">50k+</div>
                            <div className="text-gray-400 font-bold uppercase">Verified Sellers</div>
                        </div>
                        <div className="p-6">
                            <div className="text-5xl font-black text-blue-500 mb-2">24/7</div>
                            <div className="text-gray-400 font-bold uppercase">Live Streams</div>
                        </div>
                        <div className="p-6">
                            <div className="text-5xl font-black text-green-500 mb-2">100%</div>
                            <div className="text-gray-400 font-bold uppercase">Secure</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
