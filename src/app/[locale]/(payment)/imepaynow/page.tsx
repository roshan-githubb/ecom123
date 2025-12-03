"use client"

import React from "react"
import { Info } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCartStore } from "@/store/useCartStore"

export default function IMEPayPaynowPage() {
  const router = useRouter()
  const items=useCartStore((state)=>state.items)
 
  const subtotal = items.reduce((acc, i) => acc + (i.price * (i.quantity ?? 1)), 0)
  const deliveryCharge = 100
  const serviceFee = 50
  const total = subtotal + deliveryCharge + serviceFee
 
  return (
    <div className="min-h-screen bg-[#eef1f3] font-sans text-[#333] pb-32 max-w-md mx-auto relative">
      <div className="bg-[#e3eaf5] p-3 flex items-start gap-3">
        <Info className="w-4 h-4 text-[#1e53a3] flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-[#1e53a3] leading-snug">
          Ensure you have collected the payment voucher to get Bank and Wallet
          Discounts. 0% EMI available on selected bank partners.
        </p>
      </div>

      <div className="bg-[#f5f5f5] p-4 border-b border-gray-200">
        <div className="flex items-start gap-3">
          <div className="w-8 h-5 bg-[#ed1c24] rounded-[2px] flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-[8px] font-bold italic">
              IME Pay
            </span>
          </div>
          <p className="text-[13px] text-gray-800 leading-snug">
            Pay with your IME Pay Account. Please make sure you have enough
            balance in your account.
          </p>
        </div>
      </div>

      <div className="px-4 py-6">
        <p className="text-[12px] text-gray-500 mb-4 leading-relaxed">
          &quot;You will be redirected to your IME Pay account to complete your
          payment:
        </p>

        <ol className="list-decimal pl-4 space-y-1 text-[12px] text-gray-500 leading-relaxed mb-4">
          <li className="pl-1">
            Login to your IME Pay account using your IME Pay ID and your PIN.
          </li>
          <li className="pl-1">
            Ensure your IME Pay account is active and has sufficient balance.
          </li>
          <li className="pl-1">
            Enter OTP (one time password) sent to your registered mobile number.
          </li>
        </ol>

        <p className="text-[12px] text-gray-500 italic">
          ***Login with your IME Pay mobile and PIN.***
        </p>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-10 max-w-md mx-auto">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[13px] text-gray-500">Subtotal</span>
          <span className="text-[13px] font-bold text-gray-900">Rs. {subtotal}</span>
        </div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-[15px] font-medium text-gray-900">
            Total Amount
          </span>
          <span className="text-[15px] font-bold text-myBlue">Rs. {total}</span>
        </div>

        <button
          type="button"
          className="w-full bg-myBlue text-white font-medium text-[14px] py-3 rounded-[4px] shadow-sm hover:bg-blue-700 active:bg-blue-800 active:scale-95 transition-all uppercase"
          onClick={() => router.push("/np/imebottombar")}
        >
          Pay Now
        </button>
      </div>
    </div>
  )
}
