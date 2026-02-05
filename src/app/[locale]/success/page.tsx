"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Loader2, XCircle, Home, Package, ArrowRight } from "lucide-react";
import { Suspense } from "react";
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [orderCreated, setOrderCreated] = useState(false);
  const [hasAttemptedVerification, setHasAttemptedVerification] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const method = searchParams.get("method");
    const data = searchParams.get("data");
    const pidx = searchParams.get("pidx");
    const cartId = searchParams.get("cartId");

    if (data && method === "esewa" && !paymentInfo) {
      try {
        const decoded = JSON.parse(atob(data));
        setPaymentInfo({ ...decoded, method: "esewa" });
        router.replace("/success");
      } catch (err) {
        console.error("Failed to decode eSewa data", err);
      }
      return;
    }

    if (pidx && method === "khalti" && !hasAttemptedVerification) {
      verifyKhaltiPayment(pidx, cartId);
    }

  }, []); 

  const verifyKhaltiPayment = async (pidx: string, cartId: string | null) => {
    if (hasAttemptedVerification) {
      console.log("Verification already attempted, skipping...");
      return;
    }

    setHasAttemptedVerification(true);
    setIsVerifying(true);
    setVerificationError(null);

    try {
      console.log("Starting Khalti verification for pidx:", pidx);
      
      const verifyResponse = await fetch(`/api/khalti/verify?pidx=${pidx}`);
      
      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json();
        throw new Error(errorData.error || "Payment verification failed");
      }

      const verificationData = await verifyResponse.json();
      console.log("Khalti verification successful:", verificationData);

      if (!verificationData.verified) {
        throw new Error("Payment verification failed");
      }

      if (cartId) {
        console.log("Creating order for cart:", cartId);
        const { placeOrder } = await import("@/lib/data/cart");
        const orderResult = await placeOrder(cartId);

        if (orderResult?.error) {
          console.error("Order creation failed:", orderResult);
          throw new Error("Failed to create order");
        }

        console.log("Order created successfully:", orderResult);
        setOrderCreated(true);
      }

      setPaymentInfo({
        method: "khalti",
        status: "Completed",
        transaction_id: verificationData.transactionId,
        total_amount: verificationData.amount,
      });

      router.replace("/success");
    } catch (error) {
      console.error("Khalti verification error:", error);
      setVerificationError(
        error instanceof Error ? error.message : "Payment verification failed"
      );
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {isVerifying ? (
            <motion.div
              key="verifying"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-xl p-8 text-center"
            >
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <Loader2 className="w-20 h-20 text-myBlue animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full"></div>
                  </div>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Verifying Payment
              </h2>
              <p className="text-gray-600 mb-6">
                Please wait while we confirm your payment...
              </p>
              <div className="flex justify-center gap-2">
                <div className="w-2 h-2 bg-myBlue rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-myBlue rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-myBlue rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </motion.div>
          ) : verificationError ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <div className="flex justify-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center"
                >
                  <XCircle className="w-12 h-12 text-red-500" />
                </motion.div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
                Payment Verification Failed
              </h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-700 text-sm text-center mb-2">
                  {verificationError}
                </p>
                <p className="text-red-600 text-xs text-center">
                  If amount was deducted, please contact support with your transaction details.
                </p>
              </div>
              <LocalizedClientLink
                href="/"
                className="w-full flex items-center justify-center gap-2 bg-myBlue text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
                onClick={() => setIsNavigating(true)}
              >
                {isNavigating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Home className="w-5 h-5" />
                )}
                Return to Home
              </LocalizedClientLink>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              {/* Success Header */}
              <div className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                  className="flex justify-center mb-4"
                >
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-12 h-12 text-green-500" />
                  </div>
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold text-white mb-2"
                >
                  Payment Successful!
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-blue-100 text-sm"
                >
                  Your order has been placed successfully
                </motion.p>
              </div>

              {/* Payment Details */}
              {paymentInfo && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="p-6 space-y-3"
                >
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Payment Method</span>
                      <span className="text-sm font-semibold text-gray-900 capitalize">
                        {paymentInfo.method || "eSewa"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Status</span>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {paymentInfo.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Amount</span>
                      <span className="text-lg font-bold text-myBlue">
                        Rs. {paymentInfo.total_amount}
                      </span>
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Transaction ID</p>
                      <p className="text-xs font-mono text-gray-700 break-all bg-white p-2 rounded border border-gray-200">
                        {paymentInfo.transaction_id || paymentInfo.transaction_code}
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm text-blue-800 text-center">
                      Order confirmation has been sent to your email
                    </p>
                  </div>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="p-6 pt-0 space-y-3"
              >
                <LocalizedClientLink
                  href="/user/orders"
                  className="w-full flex items-center justify-center gap-2 bg-myBlue text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl group disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setIsNavigating(true)}
                >
                  {isNavigating ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Package className="w-5 h-5" />
                      View My Orders
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </LocalizedClientLink>

                <LocalizedClientLink
                  href="/"
                  className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3.5 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setIsNavigating(true)}
                >
                  {isNavigating ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Home className="w-5 h-5" />
                      Continue Shopping
                    </>
                  )}
                </LocalizedClientLink>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-myBlue animate-spin" />
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
