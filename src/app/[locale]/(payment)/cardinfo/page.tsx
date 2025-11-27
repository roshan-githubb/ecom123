"use client"

import React from 'react';
import { useCartStore } from '@/store/useCartStore';
import {
    Info,
    ShieldCheck,
    HelpCircle
} from 'lucide-react';

export default function CardInfo() {
    const items = useCartStore((state) => state.items)

    const subtotal = items.reduce((acc, i) => acc + (i.price * (i.quantity ?? 1)), 0)
    const deliveryCharge = 100
    const serviceFee = 50
    const total = subtotal + deliveryCharge + serviceFee
    return (
        <div className="min-h-screen bg-[#eef1f3] font-sans text-[#333] pb-32 max-w-md mx-auto relative">

            <div className="bg-[#e3eaf5] p-3 flex items-start gap-3">
                <Info className="w-4 h-4 text-[#1e53a3] flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-[#1e53a3] leading-snug">
                    Ensure you have collected the payment voucher to get Bank and Wallet Discounts. 0% EMI available on selected bank partners.
                </p>
            </div>

            <div className="bg-[#eef9f2] py-2 flex items-center justify-center gap-2 border-b border-gray-100">
                <ShieldCheck className="w-4 h-4 text-[#26bd71] fill-[#26bd71] text-white" />
                <span className="text-[11px] text-[#26bd71] font-medium">Covered by Weetok Payment Protection</span>
            </div>

            <div className="px-4 py-5">

                <div className="space-y-3">

                    <div className="relative">
                        <div className="absolute top-[-20px] right-0 flex items-center gap-1 mb-1">
                            <span className="text-[10px] font-bold text-blue-800">VISA</span>
                            <div className="flex -space-x-1">
                                <div className="w-4 h-2.5 bg-red-500 rounded-sm"></div>
                                <div className="w-4 h-2.5 bg-orange-500 rounded-sm"></div>
                            </div>
                        </div>
                        <input
                            type="text"
                            placeholder="Card number"
                            className="w-full h-10 px-3 border border-gray-300 rounded-[4px] text-[13px] focus:outline-none focus:border-orange-500 bg-[#f5f5f5]"
                        />
                    </div>

                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Expiry (MM/YY)"
                                className="w-full h-10 px-3 border border-gray-300 rounded-[4px] text-[13px] focus:outline-none focus:border-orange-500 bg-[#f5f5f5]"
                            />
                            <HelpCircle className="w-4 h-4 text-gray-400 absolute right-2 top-3" />
                        </div>
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="CVV"
                                className="w-full h-10 px-3 border border-gray-300 rounded-[4px] text-[13px] focus:outline-none focus:border-orange-500 bg-[#f5f5f5]"
                            />
                            <HelpCircle className="w-4 h-4 text-gray-400 absolute right-2 top-3" />
                        </div>
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Name on card"
                            className="w-full h-10 px-3 border border-gray-300 rounded-[4px] text-[13px] focus:outline-none focus:border-orange-500 bg-[#f5f5f5]"
                        />
                        <HelpCircle className="w-4 h-4 text-gray-400 absolute right-2 top-3" />
                    </div>

                </div>

                <p className="mt-4 text-[11px] text-gray-500 leading-tight">
                    We will save this card for your convenience. If required, you can remove the card in the &quot;Payment Options&quot; section in the &quot;Account&quot; menu.
                </p>

            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-10 max-w-md mx-auto">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-[13px] text-gray-500">Subtotal</span>
                    <span className="text-[13px] font-bold text-gray-900">Rs. {subtotal}</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                    <span className="text-[15px] font-medium text-gray-900">Total Amount</span>
                    <span className="text-[15px] font-bold text-myBlue">Rs. {total}</span>
                </div>

                <button className="w-full bg-myBlue text-white font-medium text-[14px] py-3 rounded-[4px] shadow-sm hover:bg-gray-100 active:bg-blue-800 active:scale-95 shadow-sm hover:shadow-md transition-all cursor-pointer">
                    Pay Now
                </button>
            </div>

        </div>
    );
}
