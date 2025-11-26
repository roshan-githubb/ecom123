"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.useAddressStore = void 0;
var zustand_1 = require("zustand");
exports.useAddressStore = zustand_1.create(function (set, get) { return ({
    addresses: [],
    selectedAddressIndex: undefined,
    loadFromStorage: function () {
        if (typeof window === "undefined")
            return;
        var storedAddresses = JSON.parse(localStorage.getItem("addresses") || "[]") || [];
        var storedIndex = JSON.parse(localStorage.getItem("selectedAddressIndex") || "null");
        set({
            addresses: storedAddresses,
            selectedAddressIndex: storedIndex
        });
    },
    addAddress: function (addr) {
        return set(function (state) {
            var newAddresses = addr.isDefault
                ? state.addresses.map(function (a) { return (__assign(__assign({}, a), { isDefault: false })); })
                : state.addresses;
            var updated = __spreadArrays(newAddresses, [addr]);
            if (typeof window !== "undefined") {
                localStorage.setItem("addresses", JSON.stringify(updated));
                if (addr.isDefault)
                    localStorage.setItem("selectedAddressIndex", JSON.stringify(updated.length - 1));
            }
            return { addresses: updated };
        });
    },
    updateAddress: function (index, addr) {
        return set(function (state) {
            var updated = __spreadArrays(state.addresses);
            if (addr.isDefault)
                updated.forEach(function (a, i) { return i !== index && (a.isDefault = false); });
            updated[index] = addr;
            if (typeof window !== "undefined") {
                localStorage.setItem("addresses", JSON.stringify(updated));
                if (addr.isDefault)
                    localStorage.setItem("selectedAddressIndex", JSON.stringify(index));
            }
            return { addresses: updated };
        });
    },
    deleteAddress: function (index) {
        return set(function (state) {
            var updated = state.addresses.filter(function (_, i) { return i !== index; });
            if (typeof window !== "undefined") {
                localStorage.setItem("addresses", JSON.stringify(updated));
                // If the deleted address was selected, reset selection
                var selectedIndex = get().selectedAddressIndex;
                if (selectedIndex === index) {
                    localStorage.removeItem("selectedAddressIndex");
                }
            }
            return { addresses: updated };
        });
    },
    setDefault: function (index) {
        return set(function (state) {
            var updated = state.addresses.map(function (a, i) { return (__assign(__assign({}, a), { isDefault: i === index })); });
            if (typeof window !== "undefined") {
                localStorage.setItem("addresses", JSON.stringify(updated));
                localStorage.setItem("selectedAddressIndex", JSON.stringify(index));
            }
            return { addresses: updated };
        });
    },
    selectAddress: function (index) {
        return set(function () {
            if (typeof window !== "undefined") {
                localStorage.setItem("selectedAddressIndex", JSON.stringify(index));
            }
            return { selectedAddressIndex: index };
        });
    }
}); });
