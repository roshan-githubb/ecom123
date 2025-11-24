import React from "react";

interface UserDetailsProps {
  name: string;
  phone: string;
  address: string;
  type: string;
}

const UserDetailsCard: React.FC<UserDetailsProps> = ({ name, phone, address, type }) => {
  return (
    <div className="p-4 border rounded-lg shadow-sm mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-gray-900">Your Details</h3>
        <span className="text-blue-600 cursor-pointer">Change</span>
      </div>
      <p>{name}</p>
      <p>{phone}</p>
      <p>{address}</p>
      <span className="mt-2 inline-block bg-gray-200 text-gray-700 px-2 py-1 rounded">{type}</span>
    </div>
  );
};

export default UserDetailsCard;
