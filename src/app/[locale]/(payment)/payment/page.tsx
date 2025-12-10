"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useCartStore } from "@/store/useCartStore"
import { Info, ChevronRight, Loader2 } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

export default function PaymentPage() {
  const {
    items,
    subtotal,
    taxTotal,
    deliveryFee,
    serviceFee,
    totalPayable,
    currency,
  } = useCartStore()
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Use the actual values from cart store, with fallback calculation
  const calculatedSubtotal = subtotal || items.reduce(
    (acc, i) => acc + i.price * (i.quantity ?? 1),
    0
  )
  const total = totalPayable || (calculatedSubtotal + (deliveryFee || 0) + (serviceFee || 0) + (taxTotal || 0))

  const handleEsewaPayment = async () => {
    if (isProcessing) return
    
    // Validate cart has items
    if (items.length === 0) {
      toast({
        title: "Cart Empty",
        description: "Your cart is empty. Please add items before proceeding to payment.",
        variant: "destructive",
      })
      return
    }
    
    // Validate total amount
    if (total <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Invalid payment amount. Please check your cart.",
        variant: "destructive",
      })
      return
    }
    
    setIsProcessing(true)
    try {
      // Generate unique transaction ID
      const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
      
      toast({
        title: "Processing Payment",
        description: "Initiating eSewa payment...",
      })

      // Call the initiate payment API
      const response = await fetch("/api/initiate-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          method: "esewa",
          amount: total.toString(),
          productName: `Order from Saransa Marketplace (${items.length} items)`,
          transactionId: transactionId,
        }),
      })

      if (!response.ok) {
        throw new Error(`Payment initiation failed: ${response.statusText}`)
      }

      const paymentData = await response.json()
      
      toast({
        title: "Redirecting to eSewa",
        description: "Please complete your payment on eSewa...",
      })

      // Create form and submit to eSewa
      const form = document.createElement("form")
      form.method = "POST"
      form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form"

      const esewaPayload = {
        amount: paymentData.amount,
        tax_amount: paymentData.esewaConfig.tax_amount,
        total_amount: paymentData.esewaConfig.total_amount,
        transaction_uuid: paymentData.esewaConfig.transaction_uuid,
        product_code: paymentData.esewaConfig.product_code,
        product_service_charge: paymentData.esewaConfig.product_service_charge,
        product_delivery_charge: paymentData.esewaConfig.product_delivery_charge,
        success_url: paymentData.esewaConfig.success_url,
        failure_url: paymentData.esewaConfig.failure_url,
        signed_field_names: paymentData.esewaConfig.signed_field_names,
        signature: paymentData.esewaConfig.signature,
      }

      Object.entries(esewaPayload).forEach(([key, value]) => {
        const input = document.createElement("input")
        input.type = "hidden"
        input.name = key
        input.value = String(value)
        form.appendChild(input)
      })

      document.body.appendChild(form)
      form.submit()
      document.body.removeChild(form)
    } catch (error) {
      console.error("eSewa payment error:", error)
      toast({
        title: "Payment Failed",
        description: "Failed to initiate eSewa payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

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
            className={`bg-white p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-all cursor-pointer ${
              isProcessing ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'
            }`}
            onClick={handleEsewaPayment}
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
              <div>
                <p className="text-[14px] font-medium text-gray-900">
                  {isProcessing ? 'Processing...' : 'Pay with eSewa'}
                </p>
                <p className="text-[11px] text-gray-400">Digital Wallet</p>
              </div>
            </div>
            <div>
              {isProcessing ? (
                <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
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
              className={`bg-white p-2 flex items-center justify-between shadow-sm transition-all cursor-pointer ${
                isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 active:bg-gray-100 active:scale-95 hover:shadow-md'
              }`}
              onClick={() => !isProcessing && router.push("/np/imepaynow")}
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

            <div className={`bg-white p-2 flex items-center justify-between shadow-sm cursor-pointer ${
              isProcessing ? 'opacity-50 cursor-not-allowed' : ''
            }`}>
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
            {currency} {calculatedSubtotal.toLocaleString()}
          </span>
        </div>
        {(deliveryFee || 0) > 0 && (
          <div className="flex justify-between items-center mb-1">
            <span className="text-[14px] text-gray-500">Delivery</span>
            <span className="text-[14px] font-medium text-gray-900">
              {currency} {(deliveryFee || 0).toLocaleString()}
            </span>
          </div>
        )}
        {(taxTotal || 0) > 0 && (
          <div className="flex justify-between items-center mb-1">
            <span className="text-[14px] text-gray-500">Tax</span>
            <span className="text-[14px] font-medium text-gray-900">
              {currency} {(taxTotal || 0).toLocaleString()}
            </span>
          </div>
        )}
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <span className="text-[16px] font-medium text-gray-900">
            Total Amount
          </span>
          <span className="text-[16px] font-bold text-myBlue">{currency} {total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}
