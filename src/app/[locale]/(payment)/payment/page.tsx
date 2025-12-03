"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useCartStore } from "@/store/useCartStore"
import { Info, ChevronRight } from "lucide-react"
import Image from "next/image"

export default function PaymentPage() {
  const items = useCartStore((state) => state.items)
  const [selectedSavedMethod, setSelectedSavedMethod] = useState(false)
  const router = useRouter()

  const subtotal = items.reduce(
    (acc, i) => acc + i.price * (i.quantity ?? 1),
    0
  )
  const deliveryCharge = 100
  const serviceFee = 50
  const total = subtotal + deliveryCharge + serviceFee

  return (
    <div className="min-h-screen bg-[#eef1f3] font-sans text-[#333] pb-20 max-w-md mx-auto">
      <div className="bg-[#e3eaf5] p-3 flex items-start gap-3 mb-4">
        <Info className="w-5 h-5 text-[#1e53a3] flex-shrink-0 mt-0.5" />
        <p className="text-[12px] text-[#1e53a3] leading-snug">
          Ensure you have collected the payment voucher to get Bank and Wallet
          Discounts. 0% EMI available on selected bank partners.
        </p>
      </div>

      <div className="px-4 space-y-6">
        <div>
          <h2 className="text-[13px] font-bold text-gray-800 mb-2">
            Recommended method(s)
          </h2>
          <div
            className="bg-white p-2 flex items-center justify-between shadow-sm hover:bg-gray-100 active:bg-blue-800 active:scale-95 shadow-sm hover:shadow-md transition-all cursor-pointer"
            onClick={() => router.push("/np/cardinfo")}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-6 bg-blue-500 rounded-sm flex items-center justify-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full ml-3 mt-1"></div>
              </div>
              <div>
                <p className="text-[14px] font-medium text-gray-900">
                  Credit/Debit Card
                </p>
                <p className="text-[11px] text-gray-400">Credit/Debit Card</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1">
                <div className="w-5 h-3 bg-red-500 rounded-sm"></div>
                <div className="w-5 h-3 bg-orange-500 rounded-sm"></div>
              </div>
              <span className="text-[10px] text-blue-800 font-bold">VISA</span>
              <ChevronRight className="w-4 h-4 text-gray-400 ml-1" />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-[13px] font-bold text-gray-800 mb-2">
            My Saved Payment Methods
          </h2>
          <div
            className="bg-white p-4 flex items-center justify-between shadow-sm active:scale-95 shadow-sm hover:shadow-md transition-all cursor-pointer"
            onClick={() => setSelectedSavedMethod(!selectedSavedMethod)}
          >
            <div className="flex items-center gap-3">
              <div>
                <Image
                  src="/images/icons/esewa.png"
                  alt="esewa logo"
                  width={20} 
                  height={20}
                />
              </div>
              <p className="text-[14px] text-gray-600">Test User</p>
            </div>
            <div>
              {selectedSavedMethod ? (
                <div className="w-5 h-5 rounded-full border-[5px] border-blue-500 bg-white"></div>
              ) : (
                <div className="w-5 h-5 rounded-full border border-gray-300 bg-white"></div>
              )}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-[13px] font-bold text-gray-800 mb-2">
            Other Payment Methods
          </h2>
          <div className="space-y-2">
            <div
              className="bg-white p-2 flex items-center justify-between shadow-sm hover:bg-gray-100 active:bg-gray-100 active:scale-95 shadow-sm hover:shadow-md transition-all cursor-pointer"
              onClick={() => router.push("/np/imepaynow")}
            >
              <div className="flex items-center gap-3">
                <div>
                  <Image
                    src="/images/icons/imekhalti.png"
                    alt="khalti logo"
                    width={20}
                    height={20}
                  />
                </div>
                <div>
                  <p className="text-[14px] font-medium text-gray-900">
                    Khalti by IME
                  </p>
                  <p className="text-[11px] text-gray-400">Mobile Wallet</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>

            <div className="bg-white p-2 flex items-center justify-between shadow-sm cursor-pointer">
              <div className="flex items-center gap-3">
                <div>
                  <Image
                    src="/images/icons/cod.png"
                    alt="cod"
                    width={20}
                    height={20}
                  />
                </div>
                <div>
                  <p className="text-[14px] font-medium text-gray-900">
                    Cash on Delivery
                  </p>
                  <p className="text-[11px] text-gray-400">Cash on Delivery</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-6 py-4 opacity-40 grayscale">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 border border-gray-600 rounded-full flex items-center justify-center text-[8px]">
              ✓
            </div>
            <span className="text-[10px] font-bold">Norton</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold border border-gray-600 px-1">
              PCI
            </span>
          </div>
          <div className="text-[10px] font-bold">VISA</div>
          <div className="text-[10px] font-bold">Mastercard</div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-10 max-w-md mx-auto">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[14px] text-gray-500">Subtotal</span>
          <span className="text-[14px] font-medium text-gray-900">
            Rs. {subtotal}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[16px] font-medium text-gray-900">
            Total Amount
          </span>
          <span className="text-[16px] font-bold text-myBlue">Rs. {total}</span>
        </div>
      </div>
    </div>
  )
}
