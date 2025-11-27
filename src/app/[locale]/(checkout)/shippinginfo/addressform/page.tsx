"use client";

import React, { useState } from "react";
import { useAddressStore, Address } from "@/store/addressStore";

interface AddressFormProps {
  initialData?: Address;
  index?: number;
  onClose: () => void;
}

export const AddressForm: React.FC<AddressFormProps> = ({ initialData, index, onClose }) => {
  const addAddress = useAddressStore((state) => state.addAddress);
  const updateAddress = useAddressStore((state) => state.updateAddress);
  const deleteAddress = useAddressStore((state) => state.deleteAddress);

  const [name, setName] = useState(initialData?.name || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [province, setProvince] = useState(initialData?.province || "");
  const [district, setDistrict] = useState(initialData?.district || "");
  const [line1, setLine1] = useState(initialData?.line1 || "");
  const [line2, setLine2] = useState(initialData?.line2 || "");
  const [landmark, setLandmark] = useState(initialData?.landmark || "");
  const [label, setLabel] = useState(initialData?.label || "Home");
  const [isDefault, setIsDefault] = useState(initialData?.isDefault || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const addr: Address = { name, phone, province, district, line1, line2, landmark, label, isDefault };
    if (typeof index === "number") {
      updateAddress(index, addr);
    } else {
      addAddress(addr);
    }
    onClose();
  };

  const handleDelete = () => {
    if (typeof index === "number") {
      deleteAddress(index);
      onClose();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <form className="bg-white p-4 rounded-md space-y-3" onSubmit={handleSubmit}>
      <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 w-full rounded" required />
      <input type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className="border p-2 w-full rounded" required />
      <input type="text" placeholder="Province" value={province} onChange={(e) => setProvince(e.target.value)} className="border p-2 w-full rounded" required />
      <input type="text" placeholder="District / City" value={district} onChange={(e) => setDistrict(e.target.value)} className="border p-2 w-full rounded" required />
      <input type="text" placeholder="Address Line 1" value={line1} onChange={(e) => setLine1(e.target.value)} className="border p-2 w-full rounded" required />
      <input type="text" placeholder="Address Line 2" value={line2} onChange={(e) => setLine2(e.target.value)} className="border p-2 w-full rounded" />
      <input type="text" placeholder="Landmark" value={landmark} onChange={(e) => setLandmark(e.target.value)} className="border p-2 w-full rounded" />
      <select value={label} onChange={(e) => setLabel(e.target.value)} className="border p-2 w-full rounded">
        <option value="Home">Home</option>
        <option value="Office">Office</option>
      </select>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} />
        Default Address
      </label>
      <div className="flex gap-2">
        <button type="submit" className="bg-[#00bfa5] text-white py-2 flex-1 rounded font-bold">Save Address</button>
        {typeof index === "number" && (
          <button type="button" onClick={handleDelete} className="bg-red-500 text-white py-2 flex-1 rounded font-bold">Delete</button>
        )}
        <button type="button" onClick={handleCancel} className="bg-gray-300 text-gray-800 py-2 flex-1 rounded font-bold">Cancel</button>
      </div>
    </form>
  );
};
