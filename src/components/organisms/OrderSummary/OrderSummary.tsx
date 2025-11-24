import React from "react";
import OrderItem from "@/components/molecules/OrderParcelItems/OrderItemCh";

const OrderSummary: React.FC = () => {
  const items = [
    { name: "Cotton-shirt", color: "White", price: 3000 },
    { name: "Cotton-shirt", color: "White", price: 3000 },
    { name: "Cotton-shirt", color: "White", price: 3000 },
    { name: "Cotton-shirt", color: "White", price: 3000 },
  ];

  const subtotal = items.reduce((acc, item) => acc + item.price, 0);
  const delivery = 100;
  const serviceFee = 50;
  const total = subtotal + delivery + serviceFee;

  return (
    <div className="p-4 border rounded-lg mb-4">
      <h3 className="font-medium mb-2">Order Summary</h3>
      {items.map((item, idx) => (
        <OrderItem key={idx} {...item} />
      ))}
      <hr className="my-2" />
      <div className="flex justify-between">
        <span>Subtotal</span>
        <span>Rs {subtotal}</span>
      </div>
      <div className="flex justify-between text-red-500">
        <span>Delivery Charge</span>
        <span>Rs {delivery}</span>
      </div>
      <div className="flex justify-between">
        <span>Service Fee</span>
        <span>Rs {serviceFee}</span>
      </div>
      <hr className="my-2" />
      <div className="flex justify-between font-bold text-lg">
        <span>Total Payable</span>
        <span>Rs {total}</span>
      </div>
    </div>
  );
};

export default OrderSummary;
