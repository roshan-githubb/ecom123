import React from 'react';
import { Scale, FileText, AlertTriangle } from 'lucide-react';

const TermsConditions = () => {
    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-black text-gray-900 mb-4">Terms of Service</h1>
                    <p className="text-gray-500">Last updated: November 2025</p>
                </div>

                <div className="prose prose-lg prose-pink mx-auto text-gray-600">
                    <p className="lead text-xl text-gray-800 mb-8 font-medium">
                        Welcome to WeeTok Marketplace. By using our platform, you agree to these terms.
                    </p>

                    <div className="space-y-12">
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Marketplace Nature</h2>
                            <p>
                                WeeTok is a platform that connects Buyers and Sellers. We are not the seller of items offered by third-party vendors. We facilitate transactions but do not take ownership of the goods.
                            </p>
                        </section>

                        <section className="bg-pink-50 p-8 rounded-3xl border border-pink-100">
                            <h2 className="text-2xl font-bold text-pink-900 mb-4 flex items-center gap-3">
                                <AlertTriangle className="w-6 h-6 text-pink-600" />
                                2. User Conduct
                            </h2>
                            <p className="mb-4 text-pink-800">
                                We maintain a safe and positive community. You agree NOT to:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-pink-800">
                                <li>Post illegal, offensive, or fraudulent content.</li>
                                <li>Harass other users or sellers during live streams.</li>
                                <li>Attempt to bypass WeeTok&apos;s payment system.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Purchases & Payments</h2>
                            <p>
                                Buyers are obligated to pay for items purchased. Payments are processed via our supported methods (Card, Esewa, Khalti, IMEPay, COD). WeeTok holds funds in escrow until delivery is confirmed.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsConditions;
