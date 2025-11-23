import React from "react";

interface OrderItemProps {
  name: string;
  color: string;
  price: number;
}

const OrderItem: React.FC<OrderItemProps> = ({ name, color, price }) => {
  return (
    <div className="flex justify-between items-center py-2">
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 bg-gray-200 rounded"></div>
        <div>
          <p>{name}</p>
          <p className="text-gray-500 text-sm">{color}</p>
        </div>
      </div>
      <p>Rs {price}</p>
    </div>
  );
};

export default OrderItem;
