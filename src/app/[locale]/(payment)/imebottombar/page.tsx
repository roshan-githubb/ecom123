"use client"

import React from "react"
import { X, ChevronRight, Smartphone } from "lucide-react"
import { useRouter } from "next/navigation"

export default function BottombarIMEPayPage() {
  const router=useRouter();
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans text-[#333]">
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full bg-[#f2f2f2] relative min-h-screen">
        <div className="bg-[#f2f2f2] p-4 flex items-center justify-between relative">
          <div className="absolute left-0 right-0 text-center pointer-events-none">
            <h1 className="text-[16px] font-bold text-gray-800">
              IME Pay - Wallet Link
            </h1>
          </div>
          <div className="ml-auto z-10" onClick={()=>router.back()}>
            <X className="w-5 h-5 text-gray-500 cursor-pointer" />
          </div>
        </div>

        <div className="px-4">
          <div className="bg-[#fcf4db] border border-[#f5eaba] rounded-md p-3 mb-6 flex items-start gap-3">
            <Smartphone className="w-4 h-4 text-[#8a6d3b] flex-shrink-0 mt-0.5" />
            <p className="text-[12px] text-[#8a6d3b] leading-tight">
              If you&apos;ve been migrated from IME Pay or already have a Khalti
              account, you can continue using Khalti directly.
            </p>
          </div>

          <h2 className="text-[14px] font-bold text-gray-700 mb-4">
            Payment Mode
          </h2>

          <div className="space-y-4">
            {/* IME Pay Button */}
            <div className="w-40 h-32 bg-[#e6e6e6] rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-gray-200 transition-colors mx-auto">
              <div className="h-8 flex items-center justify-center mb-1">
                <span className="text-red-600 font-bold text-2xl italic tracking-tighter">
                  IME
                </span>
                <span className="text-red-600 text-2xl italic">pay</span>
                <div className="mb-4 ml-0.5">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="red"
                    className="transform -rotate-45"
                  >
                    <path
                      d="M22 2L11 13"
                      stroke="red"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22 2L15 22L11 13L2 9L22 2Z"
                      stroke="red"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-[13px] font-medium text-gray-700">
                  IME Pay
                </span>
                <div className="w-3 h-3 rounded-full bg-red-700 flex items-center justify-center">
                  <ChevronRight className="w-2 h-2 text-white" />
                </div>
              </div>
            </div>

            {/* Khalti Button */}
            <div className="w-40 h-32 bg-[#e6e6e6] rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-gray-200 transition-colors mx-auto">
              <div className="h-8 flex items-center justify-center mb-1 relative">
                <span className="text-red-600 font-bold text-2xl">khalti</span>
                <div className="absolute -top-1 -right-3">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="red">
                    <path
                      d="M22 2L11 13"
                      stroke="red"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22 2L15 22L11 13L2 9L22 2Z"
                      stroke="red"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="absolute -bottom-2 right-0 text-[8px] text-gray-500">
                  by IME
                </span>
              </div>

              <div className="flex items-center gap-1 mt-1">
                <span className="text-[13px] font-medium text-gray-700">
                  Khalti
                </span>
                <div className="w-3 h-3 rounded-full bg-red-700 flex items-center justify-center">
                  <ChevronRight className="w-2 h-2 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 text-center mt-4 pb-8">
          <p className="text-[10px] text-gray-500 leading-tight">
            2025 © IME Digital Solution Ltd. All rights reserved. Version:
            4.5.532
          </p>
        </div>
      </div>
    </div>
  )
}
