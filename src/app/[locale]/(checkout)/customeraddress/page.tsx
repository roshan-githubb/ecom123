"use client";

import React from "react";
import { MapPin, ChevronRight } from "lucide-react";
import { useAddressStore } from "@/store/addressStore";

export default function CustomerAddress() {
  const addresses = useAddressStore((state) => state.addresses);
  const selectedIndex = useAddressStore((state) => state.selectedAddressIndex);
  const addr = selectedIndex !== undefined ? addresses[selectedIndex] : null;

  if (!addr) return <p className="p-4">No address selected</p>;

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans text-[#333] p-4 flex justify-center">
      <div className="w-full max-w-md bg-white rounded-xl p-4 shadow-sm h-fit">

        <div className="flex items-start gap-3 mb-3">
          <div className="mt-1 flex-shrink-0">
            <div className="w-10 h-10 bg-[#e3e8ec] rounded-md flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,_#000_1px,_transparent_1px)] bg-[length:4px_4px]"></div>
              <MapPin className="w-5 h-5 text-[#2b5bf7] fill-[#2b5bf7] relative z-10" />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-[15px] text-gray-900">{addr.name}</span>
                <span className="text-gray-400 text-[13px]">{addr.phone}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
            </div>

            <div className="leading-snug">
              <span className="inline-block bg-[#2b5bf7] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-[4px] mr-1 align-middle">
                {addr.label.toUpperCase()}
              </span>
              <span className="text-[13px] text-gray-600">
                {`${addr.line1}${addr.line2 ? ', ' + addr.line2 : ''}, ${addr.district}, ${addr.province}${addr.landmark ? ', Near ' + addr.landmark : ''}`}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
