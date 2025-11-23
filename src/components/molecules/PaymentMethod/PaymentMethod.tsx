import React from "react";
import Radio from "@/components/atoms/Radio/RadioCh";

interface PaymentMethodProps {
  selected: string;
  onSelect: (method: string) => void;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({ selected, onSelect }) => {
  return (
    <div className="p-4 border rounded-lg mb-4">
      <h3 className="font-medium mb-2">Select Payment Method</h3>
      <div className="flex space-x-4">
        <Radio label="Bank account" selected={selected === "Bank"} onClick={() => onSelect("Bank")} />
        <Radio label="Khati" selected={selected === "Khati"} onClick={() => onSelect("Khati")} />
      </div>
    </div>
  );
};

export default PaymentMethod;
