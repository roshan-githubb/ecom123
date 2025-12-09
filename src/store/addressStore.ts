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
  email: string;
  postalCode: string;
  countryCode: string;
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
    try {
      const addresses = JSON.parse(localStorage.getItem("addresses") || "[]");
      const selectedIndex = JSON.parse(
        localStorage.getItem("selectedAddressIndex") || "null"
      );

      set({
        addresses,
        selectedAddressIndex: selectedIndex ?? undefined,
      });
    } catch {
      localStorage.removeItem("addresses");
      localStorage.removeItem("selectedAddressIndex");
    }
  },

  addAddress: (addr) =>
    set((state) => {
      const addresses = addr.isDefault
        ? state.addresses.map((a) => ({ ...a, isDefault: false }))
        : [...state.addresses];

      const updated = [...addresses, addr];
      const selectedIndex = addr.isDefault ? updated.length - 1 : state.selectedAddressIndex;

      localStorage.setItem("addresses", JSON.stringify(updated));
      if (selectedIndex !== undefined) {
        localStorage.setItem("selectedAddressIndex", JSON.stringify(selectedIndex));
      }

      return { addresses: updated, selectedAddressIndex: selectedIndex };
    }),

  updateAddress: (index, addr) =>
    set((state) => {
      const updated = state.addresses.map((a, i) =>
        i === index ? addr : addr.isDefault ? { ...a, isDefault: false } : a
      );

      const selectedIndex = addr.isDefault ? index : state.selectedAddressIndex;

      localStorage.setItem("addresses", JSON.stringify(updated));
      if (selectedIndex !== undefined) {
        localStorage.setItem("selectedAddressIndex", JSON.stringify(selectedIndex));
      }

      return { addresses: updated, selectedAddressIndex: selectedIndex };
    }),

  deleteAddress: (index) =>
    set((state) => {
      const updated = state.addresses.filter((_, i) => i !== index);

      let selectedIndex = state.selectedAddressIndex;
      if (selectedIndex === index) selectedIndex = undefined;
      else if (selectedIndex && selectedIndex > index) selectedIndex--;

      localStorage.setItem("addresses", JSON.stringify(updated));
      if (selectedIndex === undefined)
        localStorage.removeItem("selectedAddressIndex");
      else
        localStorage.setItem("selectedAddressIndex", JSON.stringify(selectedIndex));

      return { addresses: updated, selectedAddressIndex: selectedIndex };
    }),

  setDefault: (index) =>
    set((state) => {
      const updated = state.addresses.map((a, i) => ({
        ...a,
        isDefault: i === index,
      }));

      localStorage.setItem("addresses", JSON.stringify(updated));
      localStorage.setItem("selectedAddressIndex", JSON.stringify(index));

      return { addresses: updated, selectedAddressIndex: index };
    }),

  selectAddress: (index) =>
    set(() => {
      localStorage.setItem("selectedAddressIndex", JSON.stringify(index));
      return { selectedAddressIndex: index };
    }),
}));
