"use client";

import React, { useState, FormEvent } from "react";
import { useAddressStore, Address } from "@/store/addressStore"; 
import { setAddresses } from "@/lib/data/cart"; 
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react"; 
import { AddressFormData } from "./schema"

interface AddressFormProps {
  defaultValues?: AddressFormData | null;
  initialData?: Address;
  index?: number;
  onClose: () => void;

}

export const AddressForm: React.FC<AddressFormProps> = ({ initialData, index, onClose }) => {
  const addAddress = useAddressStore((state) => state.addAddress);
  const updateAddress = useAddressStore((state) => state.updateAddress);
  
  const [name, setName] = useState(initialData?.name || "");
  const [email, setEmail] = useState(initialData?.email || ""); 
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [province, setProvince] = useState(initialData?.province || "");
  const [district, setDistrict] = useState(initialData?.district || "");
  const [line1, setLine1] = useState(initialData?.line1 || "");
  const [line2, setLine2] = useState(initialData?.line2 || "");
  const [postalCode, setPostalCode] = useState(initialData?.postalCode || ""); 
  const [countryCode, setCountryCode] = useState(initialData?.countryCode || "np"); 
  const [landmark, setLandmark] = useState(initialData?.landmark || "");
  const [label, setLabel] = useState(initialData?.label || "Home");
  const [isDefault, setIsDefault] = useState(initialData ? initialData.isDefault : true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // Check if user is logged in
  React.useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/customer/me", {
          method: "GET",
          credentials: "include",
        })
        setIsLoggedIn(res.ok && (await res.json()).customer !== null)
      } catch {
        setIsLoggedIn(false)
      }
    }
    checkAuth()
  }, [])


  const actionHandler = async (formData: FormData) => {
    setError(null);
    setLoading(true);

    if (!name || !email || !phone || !province || !district || !line1 || !postalCode || !countryCode) {
        setError("Please fill in all required fields.");
        setLoading(false);
        return;
    }

    const addr: Address = { name, email, phone, province, district, line1, line2, landmark, label, isDefault, postalCode, countryCode };
    
    if (typeof index === "number") {
      updateAddress(index, addr);
    } else {
      addAddress(addr);
    }

    const nameParts = name.trim().split(/\s+/);
    const first_name = nameParts[0] || '';
    const last_name = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '.'; 


    formData.set("email", email);
    formData.set("shipping_address.first_name", first_name);
    formData.set("shipping_address.last_name", last_name);
    formData.set("shipping_address.address_1", line1);
    formData.set("shipping_address.address_2", line2);
    formData.set("shipping_address.city", district);      
    formData.set("shipping_address.province", province);   
    formData.set("shipping_address.postal_code", postalCode);
    formData.set("shipping_address.country_code", countryCode);
    formData.set("shipping_address.phone", phone);
    formData.set("shipping_address.company", "");
    formData.set("address_name", label);
    formData.set("isDefaultShipping", isDefault ? "true" : "false");


    const result = await setAddresses(null, formData);

    if (result) {
      setError(result as string); 
    } else {
   
      onClose();
      router.push("/np/check");
    }
    setLoading(false);
  };

  return (
    <form 
        className="bg-white p-4 rounded-md space-y-3" 
        onSubmit={(e: FormEvent) => { 
            e.preventDefault(); 
            actionHandler(new FormData()); 
        }}
    >
   
      <input type="email" placeholder="Email Address (Required)" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 w-full rounded" required />
      <input type="text" placeholder="Full Name (First & Last)" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 w-full rounded" required />
      <input type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className="border p-2 w-full rounded" required />
      
    
      <input type="text" placeholder="Province" value={province} onChange={(e) => setProvince(e.target.value)} className="border p-2 w-full rounded" required />
      <input type="text" placeholder="District / City2" value={district} onChange={(e) => setDistrict(e.target.value)} className="border p-2 w-full rounded" required />
      <input type="text" placeholder="Address Line 1" value={line1} onChange={(e) => setLine1(e.target.value)} className="border p-2 w-full rounded" required />
      <input type="text" placeholder="Address Line 2 (Optional)" value={line2} onChange={(e) => setLine2(e.target.value)} className="border p-2 w-full rounded" />
      <input type="text" placeholder="Postal Code (Required)" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="border p-2 w-full rounded" required />
      
      <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)} className="border p-2 w-full rounded" required>
        <option value="np">Nepal</option>
        <option value="in">India</option>
      </select>
      
    
      <input type="text" placeholder="Landmark (Optional)" value={landmark} onChange={(e) => setLandmark(e.target.value)} className="border p-2 w-full rounded" />
      <select value={label} onChange={(e) => setLabel(e.target.value)} className="border p-2 w-full rounded">
        <option value="Home">Home</option>
        <option value="Office">Office</option>
      </select>
      
      {/* Save to Profile Checkbox - Only show for logged-in users */}
      {isLoggedIn && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={isDefault} 
              onChange={(e) => setIsDefault(e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div className="flex-1">
              <span className="font-medium text-gray-900 block">Save as my default address</span>
              <span className="text-sm text-gray-600">
                This address will be automatically used for future orders
              </span>
            </div>
          </label>
        </div>
      )}
      
      
      {error && <p className="text-red-500 text-sm mt-2 font-medium border border-red-200 p-2 rounded-md">{error}</p>}
      
      <div className="flex gap-2">
        <button 
            type="submit" 
            className="bg-[#00bfa5] text-white py-2 flex-1 rounded font-bold flex items-center justify-center disabled:bg-gray-400"
            disabled={loading}
        >
          {loading ? (
            <span className="flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
            </span>
          ) : (
            "Save Address"
          )}
        </button>
      </div>
    </form>
  );
};
