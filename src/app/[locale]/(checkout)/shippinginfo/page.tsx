"use client";

import React, { useState } from "react";
import { MapPin } from "lucide-react";
import { useAddressStore } from "@/store/addressStore";
import { AddressForm } from "./addressform/page";
import { useRouter } from "next/navigation";

export default function ShippingAddress() {
  const addresses = useAddressStore((state) => state.addresses);
  const selectAddress = useAddressStore((state) => state.selectAddress);
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState<number | undefined>(undefined);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans text-[#333] pb-10 max-w-md mx-auto border-x border-gray-200">

      <div className="p-4 bg-white mb-3">
        <button
          className="w-full border border-[#00bfa5] text-[#00bfa5] font-bold text-[14px] py-3.5 flex items-center justify-center"
          onClick={() => { setEditIndex(undefined); setShowForm(true); }}
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

      <div className="space-y-3">
        {addresses.map((addr, i) => (
          <div
            key={i}
            className="bg-white p-4 flex items-start gap-3 cursor-pointer hover:bg-gray-50"
            onClick={() => {
              selectAddress(i);
              router.push("/in/check"); 
            }}
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
      </div>
    </div>
  );
}
