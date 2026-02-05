"use client";
import { useState } from "react";
import { Button } from "@/components/esewa/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/esewa/card";
import { Input } from "@/components/esewa/input";
import { Label } from "@/components/esewa/label";
import { useToast } from "@/hooks/use-toast";
import Script from "next/script";

export default function KhaltiPayment() {
  const [amount, setAmount] = useState<string>("");
  const [productName, setProductName] = useState<string>("");
  const [transactionId, setTransactionId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/initiate-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: "khalti",
          amount,
          productName,
          transactionId,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Payment initiation failed");
      }
      
      const data = await response.json();
      
      if (!data.khaltiPaymentUrl) {
        throw new Error("Khalti payment URL not received");
      }
      
      toast({
        title: "Payment Initiated",
        description: "Redirecting to Khalti payment gateway...",
      });
      
      window.location.href = data.khaltiPaymentUrl;
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: "Payment initiation failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Script
        src="https://khalti.s3.ap-south-1.amazonaws.com/KPG/dist/2020.12.22.0.0.0/khalti-checkout.iffe.js"
        strategy="lazyOnload"
      />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle>Khalti Payment</CardTitle>
            <CardDescription>Enter payment details for Khalti</CardDescription>
          </CardHeader>
          <form onSubmit={handlePayment}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (NPR)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
                  required
                  min="1"
                  step="0.01"
                  placeholder="Enter amount"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  id="productName"
                  value={productName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProductName(e.target.value)}
                  required
                  placeholder="Enter product name"
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="transactionId">Transaction ID</Label>
                <Input
                  id="transactionId"
                  value={transactionId}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTransactionId(e.target.value)}
                  required
                  placeholder="Enter transaction ID"
                  maxLength={50}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || !amount || !productName || !transactionId}
              >
                {isLoading ? "Processing..." : "Pay with Khalti"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
}