import { create } from "zustand";

export interface Address {
  name: string;
  phone: string;
  province: string;
  district: string;
  line1: string;
  line2?: string;
  landmark?: string;
  label: string;
  isDefault: boolean;
}

interface AddressStore {
  addresses: Address[];
  selectedAddressIndex?: number;
  addAddress: (addr: Address) => void;
  updateAddress: (index: number, addr: Address) => void;
  deleteAddress: (index: number) => void;
  setDefault: (index: number) => void;
  selectAddress: (index: number) => void;
  loadFromStorage: () => void;
}

export const useAddressStore = create<AddressStore>((set, get) => ({
  addresses: [], 
  selectedAddressIndex: undefined,

  loadFromStorage: () => {
    if (typeof window === "undefined") return;

    const storedAddresses = JSON.parse(localStorage.getItem("addresses") || "[]") || [];
    const storedIndex = JSON.parse(localStorage.getItem("selectedAddressIndex") || "null");
    set({
      addresses: storedAddresses,
      selectedAddressIndex: storedIndex,
    });
  },

  addAddress: (addr) =>
    set((state) => {
      const newAddresses = addr.isDefault
        ? state.addresses.map((a) => ({ ...a, isDefault: false }))
        : state.addresses;
      const updated = [...newAddresses, addr];

      if (typeof window !== "undefined") {
        localStorage.setItem("addresses", JSON.stringify(updated));
        if (addr.isDefault) localStorage.setItem("selectedAddressIndex", JSON.stringify(updated.length - 1));
      }

      return { addresses: updated };
    }),

  updateAddress: (index, addr) =>
    set((state) => {
      const updated = [...state.addresses];
      if (addr.isDefault) updated.forEach((a, i) => i !== index && (a.isDefault = false));
      updated[index] = addr;

      if (typeof window !== "undefined") {
        localStorage.setItem("addresses", JSON.stringify(updated));
        if (addr.isDefault) localStorage.setItem("selectedAddressIndex", JSON.stringify(index));
      }

      return { addresses: updated };
    }),

  deleteAddress: (index) =>
    set((state) => {
      const updated = state.addresses.filter((_, i) => i !== index);

      if (typeof window !== "undefined") {
        localStorage.setItem("addresses", JSON.stringify(updated));
        // If the deleted address was selected, reset selection
        const selectedIndex = get().selectedAddressIndex;
        if (selectedIndex === index) {
          localStorage.removeItem("selectedAddressIndex");
        }
      }

      return { addresses: updated };
    }),

  setDefault: (index) =>
    set((state) => {
      const updated = state.addresses.map((a, i) => ({ ...a, isDefault: i === index }));

      if (typeof window !== "undefined") {
        localStorage.setItem("addresses", JSON.stringify(updated));
        localStorage.setItem("selectedAddressIndex", JSON.stringify(index));
      }

      return { addresses: updated };
    }),

  selectAddress: (index) =>
    set(() => {
      if (typeof window !== "undefined") {
        localStorage.setItem("selectedAddressIndex", JSON.stringify(index));
      }
      return { selectedAddressIndex: index };
    }),
}));
