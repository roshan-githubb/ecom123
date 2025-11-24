"use client"

import React, { useState } from "react";
import UserDetailsCard from "@/components/molecules/UserDetailsCard/UserDetailsCardCh";
import OrderSummary from "../OrderSummary/OrderSummary";
import PaymentMethod from "@/components/molecules/PaymentMethod/PaymentMethod";
import Button from "@/components/atoms/Button/ButtonCh";

const CheckoutForm: React.FC = () => {
  const [payment, setPayment] = useState("Bank");

  return (
    <div className="max-w-md mx-auto my-4">
      <UserDetailsCard
        name="Sabina Pandit"
        phone="+977 9821314152"
        address="Kathmandu, Baneshwor Near Eyeplex mall, ward 3"
        type="Home"
      />
      <OrderSummary />
      <PaymentMethod selected={payment} onSelect={setPayment} />
      <Button>Place Order & Pay</Button>
    </div>
  );
};

export default CheckoutForm;
