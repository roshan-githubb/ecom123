import React from 'react';
import { Lock, Shield, Eye } from 'lucide-react';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-black text-gray-900 mb-4">Privacy Policy</h1>
                    <p className="text-gray-500">Last updated: November 2025</p>
                </div>

                <div className="prose prose-lg prose-pink mx-auto text-gray-600">
                    <p className="lead text-xl text-gray-800 mb-8 font-medium">
                        At WeeTok Marketplace, we value your trust. This policy outlines how we handle your data in our social commerce ecosystem.
                    </p>

                    <div className="space-y-12">
                        <section className="bg-gray-50 p-8 rounded-3xl">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <Eye className="w-6 h-6 text-pink-500" />
                                1. Data We Collect
                            </h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Profile Information:</strong> Username, bio, and profile picture.</li>
                                <li><strong>Transaction Data:</strong> Order history, shipping address, and payment details (processed securely).</li>
                                <li><strong>User Content:</strong> Videos, comments, and live stream interactions.</li>
                                <li><strong>Usage Data:</strong> How you interact with sellers and content.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Sharing with Sellers</h2>
                            <p className="mb-4">
                                When you purchase an item, we share necessary information (Name, Shipping Address) with the specific Seller to fulfill your order. Sellers are strictly prohibited from using this data for any other purpose.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Your Rights</h2>
                            <p>
                                You can request to download or delete your data at any time through your account settings. You also have control over your privacy settings regarding who can see your activity.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
