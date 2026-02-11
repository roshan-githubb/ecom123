"use client"

import { useState, useEffect } from "react"
import CartShippingMethodsSection from "@/components/sections/CartShippingMethodsSection/CartShippingMethodsSection"
import DeliveryAddress from "@/components/sections/Checkout/DeliveryAddress"
import CartPaymentSection from "@/components/sections/CartPaymentSection/CartPaymentSection"
import { OrderSummary, RememberUserInfo } from "@/components/organisms/CartSummary/CartItemSummary"
import { AddVariantSheet } from "@/components/molecules/AddVariantModal/AddVariantModal"
import { useProductModalStore } from "@/store/useProductModalStore"
import { useCartStore } from "@/store/useCartStore"
import { retrieveCart } from "@/lib/data/cart"
import { listCartShippingMethods } from "@/lib/data/fulfillment"
import { listCartPaymentMethods } from "@/lib/data/payment"

interface CheckoutClientProps {
  initialCart: any
  initialShippingMethods: any
  initialPaymentMethods: any
}

export function CheckoutClient({
  initialCart,
  initialShippingMethods,
  initialPaymentMethods,
}: CheckoutClientProps) {
  const [cart, setCart] = useState(initialCart)
  const [shippingMethods, setShippingMethods] = useState(initialShippingMethods)
  const [paymentMethods, setPaymentMethods] = useState(initialPaymentMethods)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    initialCart.payment_collection?.payment_sessions[0]?.provider_id || ""
  )
  const [isLoadingAfterAddress, setIsLoadingAfterAddress] = useState(false)
  const [isLoadingAfterShipping, setIsLoadingAfterShipping] = useState(false)
  const [isEnrichingData, setIsEnrichingData] = useState(false)
  const { isOpen, product, closeModal } = useProductModalStore()

  const paymentMethod = cart.payment_collection?.payment_sessions[0]?.providerId
  console.log('cart ', initialCart)
  
 
  const cartItems = useCartStore(state => state.items)
  const cartItemsCount = cartItems.length
  const cartSubtotal = useCartStore(state => state.subtotal)

  useEffect(() => {
    const refreshCartData = async () => {
      if (cart?.id) {
        const updatedCart = await retrieveCart(cart.id)
        if (updatedCart) {
          setCart(updatedCart)
          
          if (updatedCart.shipping_address?.address_1) {
            const shipping = await listCartShippingMethods(updatedCart.id)
            setShippingMethods(shipping)
          }
        }
      }
    }
    
    refreshCartData()
  }, [cartItemsCount, cartSubtotal])

  // Enrich cart data in background if we got minimal data
  useEffect(() => {
    const enrichCartData = async () => {
      // Check if we have minimal cart data (missing product details)
      if (cart && cart.items && cart.items.length > 0) {
        const hasMinimalData = !cart.items[0]?.product || !cart.items[0]?.variant?.options
        
        if (hasMinimalData) {
          setIsEnrichingData(true)
          try {
            const fullCart = await retrieveCart()
            if (fullCart) {
              setCart(fullCart)
            }
          } catch (error) {
            console.error('Failed to enrich cart data:', error)
          } finally {
            setIsEnrichingData(false)
          }
        }
      }
    }

    enrichCartData()
  }, []) // Only run once on mount

  const handleAddressUpdate = async () => {
    setIsLoadingAfterAddress(true)
    try {
      const updatedCart = await retrieveCart()
      setCart(updatedCart)

      if (updatedCart) {
        const [shipping, payment] = await Promise.all([
          listCartShippingMethods(updatedCart.id || ''),
          listCartPaymentMethods(updatedCart.region?.id ?? "")
        ])
        setShippingMethods(shipping)
        setPaymentMethods(payment)
      }
      window.dispatchEvent(new CustomEvent('addressUpdated'))
    } finally {
      setIsLoadingAfterAddress(false)
    }
  }

  const handleShippingUpdate = async () => {
    setIsLoadingAfterShipping(true)
    try {
      const updatedCart = await retrieveCart()
      setCart(updatedCart)
      window.dispatchEvent(new CustomEvent('shippingUpdated'))
    } finally {
      setIsLoadingAfterShipping(false)
    }
  }

  const handlePaymentUpdate = () => {
    window.dispatchEvent(new CustomEvent('paymentUpdated'))
  }

  const allVendorsHaveShipping = () => {
    if (!cart?.items || !cart?.shipping_methods) return false
    
    const uniqueSellers = new Set(
      cart.items.map((item: any) => item.product?.seller?.id).filter(Boolean)
    )
    const vendorCount = uniqueSellers.size
    const shippingMethodCount = cart.shipping_methods.length
    
    return vendorCount > 0 && shippingMethodCount >= vendorCount
  }

  const showPaymentSection = allVendorsHaveShipping()
  console.log('isready payment proceed shipping methods, paymentmethods, showpaymentsection ', shippingMethods , paymentMethods , showPaymentSection )

  return (
    <div className="min-h-screen pb-8 overflow-x-hidden">
      {isEnrichingData && (
        <div className="max-w-md mx-auto mb-2 bg-blue-50 border border-blue-200 rounded-lg p-3 mx-4 md:mx-0">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
            <p className="text-xs text-blue-700">Loading checkout details...</p>
          </div>
        </div>
      )}
      
      <main className="max-w-md mx-auto relative z-0">
        <OrderSummary />
        <DeliveryAddress onAddressUpdate={handleAddressUpdate} />
        
        {isLoadingAfterAddress && (
          <div className="max-w-md mx-auto mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
              <p className="text-sm text-blue-700 font-medium">
                Loading shipping methods...
              </p>
            </div>
          </div>
        )}
        
        <div className="my-4"></div>
        {cart && shippingMethods && (
          <CartShippingMethodsSection
            cart={cart}
            availableShippingMethods={shippingMethods as any}
            onShippingUpdate={handleShippingUpdate}
          />
        )}
      
        {isLoadingAfterShipping && (
          <div className="max-w-md mx-auto mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
              <p className="text-sm text-green-700 font-medium">
                Loading payment options...
              </p>
            </div>
          </div>
        )}
        
        {showPaymentSection && cart && paymentMethods && !isLoadingAfterShipping && (
          <CartPaymentSection
          setSelectedPaymentMethod={setSelectedPaymentMethod}
          selectedPaymentMethod={selectedPaymentMethod}
            cart={cart}
            availablePaymentMethods={paymentMethods}
            onPaymentUpdate={handlePaymentUpdate}
          />
        )}
      </main>
      
      <RememberUserInfo cart={cart} isReady={!!( paymentMethods && showPaymentSection)} selectedPaymentMethod={selectedPaymentMethod}/>

      {isOpen && product && (
        <AddVariantSheet
          product={product}
          cardPos={{ top: 0, left: 0, width: 0, height: 0 }}
          onClose={closeModal}
          products={[product]}
          currentProductIndex={0}
          onProductChange={() => {}}
        />
      )}
    </div>
  )
}
