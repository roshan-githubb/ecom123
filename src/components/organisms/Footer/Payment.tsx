"use client";

import React from "react";
import Image from "next/image";
import { CreditCard, Lock, ShieldCheck, Banknote } from "lucide-react";

type PaymentMethod =
  | {
      name: string;
      type: "icon";
      icon: React.FC<React.SVGProps<SVGSVGElement>>;
      color: string;
      bg: string;
    }
  | {
      name: string;
      type: "image";
      src: string;
      bg: string;
    };

const paymentMethods: PaymentMethod[] = [
  { name: "Credit/Debit Card", icon: CreditCard, type: "icon", color: "text-blue-600", bg: "bg-blue-50" },
  { name: "Esewa", src: "/images/icons/esewa.png", type: "image", bg: "bg-green-50" },
  { name: "Khalti", src: "/images/icons/khalti.png", type: "image", bg: "bg-purple-50" },
  { name: "IMEPay", src: "/images/icons/imekhalti.png", type: "image", bg: "bg-red-50" },
  { name: "Cash on Delivery", icon: Banknote, type: "icon", color: "text-yellow-600", bg: "bg-yellow-50" },
];

const Payment = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black text-gray-900 mb-4">Payment Methods</h1>
          <p className="text-xl text-gray-600">Secure and convenient ways to pay on WeeTok Marketplace.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-8">Accepted Payments</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {paymentMethods.map((method, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center p-6 border-2 border-gray-100 rounded-2xl
                hover:border-pink-500 hover:bg-pink-50 transition-all duration-300 cursor-default group"
              >
                <div
                  className={`w-12 h-12 ${method.bg} rounded-full flex items-center justify-center mb-4
                  group-hover:scale-110 transition-transform`}
                >
                  {method.type === "icon" ? (
                    <method.icon className={`w-6 h-6 ${method.color}`} />
                  ) : (
                    <Image src={method.src} alt={method.name} width={26} height={26} className="object-contain" />
                  )}
                </div>

                <span className="font-bold text-gray-800">{method.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-900 text-white rounded-3xl p-8 shadow-xl">
            <Lock className="w-10 h-10 mb-4 text-pink-500" />
            <h3 className="text-xl font-bold mb-2">Encrypted Transactions</h3>
            <p className="text-gray-400 leading-relaxed">
              All payments are processed through secure gateways. We never store your card details or sensitive banking information.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <ShieldCheck className="w-10 h-10 mb-4 text-green-500" />
            <h3 className="text-xl font-bold mb-2">Payment Protection</h3>
            <p className="text-gray-600 leading-relaxed">
              Your money is held safely until you confirm delivery. If you don&apos;t receive your item, you get a full refund.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
