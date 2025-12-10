"use client";

import React, { useState } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { useAddressStore, Address } from "@/store/addressStore";
import { AddressForm } from "./addressform/page";
import { useRouter } from "next/navigation";
import { applySelectedAddressToCart } from "@/lib/actions/address-selection";

export default function ShippingAddress() {
  const addresses = useAddressStore((state) => state.addresses);
  const selectAddress = useAddressStore((state) => state.selectAddress);
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState<number | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();

  const handleAddressSelection = async (address: Address, index: number) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setFormError(null);

    selectAddress(index);

    const error = await applySelectedAddressToCart(address);

    if (error) {
      setFormError(error);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    router.push("/np/check");
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans text-[#333] pb-10 max-w-md mx-auto border-x border-gray-200">
      <div className="p-4 bg-white mb-3">
        <button
          className="w-full border border-myBlue text-myBlue font-bold text-[14px] py-3.5 flex items-center justify-center disabled:opacity-50"
          onClick={() => { setEditIndex(undefined); setShowForm(true); }}
          disabled={isSubmitting}
        >
          + Add address
        </button>
      </div>

      {showForm && (
        <div className="p-4 bg-white mb-3">
          <AddressForm
            index={editIndex}
            initialData={editIndex !== undefined ? addresses[editIndex] : undefined}
            onClose={() => setShowForm(false)}
          />
        </div>
      )}

      {formError && (
        <div className="bg-red-100 text-red-700 p-3 mx-4 mb-3 rounded-md font-medium">
          Error selecting address: {formError}
        </div>
      )}

      <div className={`space-y-3 ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}>
        {addresses.map((addr, i) => (
          <div
            key={i}
            className="bg-white p-4 flex items-start gap-3 cursor-pointer hover:bg-gray-50"
            onClick={() => handleAddressSelection(addr, i)}
          >
            <div className="mt-1">
              <div className="w-10 h-10 bg-[#e3e8ec] rounded-md flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,_#000_1px,_transparent_1px)] bg-[length:4px_4px]"></div>
                <MapPin className="w-5 h-5 text-[#2b5bf7] fill-[#2b5bf7] relative z-10" />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-start mb-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[14px] text-gray-900">{addr.name}</span>
                  <span className="text-gray-400 text-[13px]">{addr.phone}</span>
                </div>
                <button
                  className="text-sm font-bold text-myBlue uppercase"
                  onClick={(e) => { e.stopPropagation(); setEditIndex(i); setShowForm(true); }}
                >
                  Edit
                </button>
              </div>

              <p className="text-[12px] text-gray-500 mb-2">
                {`${addr.province}, ${addr.district}, ${addr.line1}${addr.line2 ? ', ' + addr.line2 : ''}`}
              </p>
              {addr.landmark && <p className="text-[12px] text-gray-400 mb-2">{addr.landmark}</p>}

              <div className="flex items-center gap-2">
                <span className="border border-gray-400 text-gray-500 text-[10px] font-bold px-1 py-[1px] rounded-[2px] uppercase">{addr.label}</span>
                {addr.isDefault && <span className="border border-red-400 text-red-400 text-[10px] font-bold px-1 py-[1px] rounded-[2px]">Default shipping address</span>}
              </div>
            </div>
          </div>
        ))}
        {isSubmitting && (
          <div className="text-center text-sm text-[#00bfa5] font-medium py-3">
            <span className="flex items-center justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Applying address to cart...
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
