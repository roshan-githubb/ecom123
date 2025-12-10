"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/esewa/card";
import { Button } from "@/components/esewa/button";
import { Suspense } from "react";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [paymentInfo, setPaymentInfo] = useState<any>(null);

  useEffect(() => {
  const data = searchParams.get("data");

  if (data) {
    try {
      const decoded = JSON.parse(atob(data));
      setPaymentInfo(decoded);
      router.replace("/success");
    } catch (err) {
      console.error("Failed to decode eSewa data", err);
    }
  }
}, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
            >
              <CheckCircle className="w-16 h-16 text-green-500" />
            </motion.div>
          </div>
          <CardTitle className="text-center text-2xl font-bold text-green-700">
            Payment Successful!
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="text-center text-gray-600">
              <p className="mb-2">
                Thank you for your payment. Your transaction has been completed
                successfully.
              </p>
              {paymentInfo && (
  <div className="text-sm text-gray-600 space-y-1">
    <p>
      Payment method: <span className="font-semibold">eSewa</span>
    </p>
    <p>
      Status: <span className="font-semibold">{paymentInfo.status}</span>
    </p>
    <p>
      Amount: Rs. {paymentInfo.total_amount}
    </p>
    <p className="truncate">
      Transaction ID: {paymentInfo.transaction_code}
    </p>
  </div>
)}

            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button variant="outline" asChild className="w-full">
            <Link href="/">Return to Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}