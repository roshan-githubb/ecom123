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
        try {
            var addresses = JSON.parse(localStorage.getItem("addresses") || "[]");
            var selectedIndex = JSON.parse(localStorage.getItem("selectedAddressIndex") || "null");
            set({
                addresses: addresses,
                selectedAddressIndex: selectedIndex !== null && selectedIndex !== void 0 ? selectedIndex : undefined
            });
        }
        catch (_a) {
            localStorage.removeItem("addresses");
            localStorage.removeItem("selectedAddressIndex");
        }
    },
    addAddress: function (addr) {
        return set(function (state) {
            var addresses = addr.isDefault
                ? state.addresses.map(function (a) { return (__assign(__assign({}, a), { isDefault: false })); })
                : __spreadArrays(state.addresses);
            var updated = __spreadArrays(addresses, [addr]);
            var selectedIndex = addr.isDefault ? updated.length - 1 : state.selectedAddressIndex;
            localStorage.setItem("addresses", JSON.stringify(updated));
            if (selectedIndex !== undefined) {
                localStorage.setItem("selectedAddressIndex", JSON.stringify(selectedIndex));
            }
            return { addresses: updated, selectedAddressIndex: selectedIndex };
        });
    },
    updateAddress: function (index, addr) {
        return set(function (state) {
            var updated = state.addresses.map(function (a, i) {
                return i === index ? addr : addr.isDefault ? __assign(__assign({}, a), { isDefault: false }) : a;
            });
            var selectedIndex = addr.isDefault ? index : state.selectedAddressIndex;
            localStorage.setItem("addresses", JSON.stringify(updated));
            if (selectedIndex !== undefined) {
                localStorage.setItem("selectedAddressIndex", JSON.stringify(selectedIndex));
            }
            return { addresses: updated, selectedAddressIndex: selectedIndex };
        });
    },
    deleteAddress: function (index) {
        return set(function (state) {
            var updated = state.addresses.filter(function (_, i) { return i !== index; });
            var selectedIndex = state.selectedAddressIndex;
            if (selectedIndex === index)
                selectedIndex = undefined;
            else if (selectedIndex && selectedIndex > index)
                selectedIndex--;
            localStorage.setItem("addresses", JSON.stringify(updated));
            if (selectedIndex === undefined)
                localStorage.removeItem("selectedAddressIndex");
            else
                localStorage.setItem("selectedAddressIndex", JSON.stringify(selectedIndex));
            return { addresses: updated, selectedAddressIndex: selectedIndex };
        });
    },
    setDefault: function (index) {
        return set(function (state) {
            var updated = state.addresses.map(function (a, i) { return (__assign(__assign({}, a), { isDefault: i === index })); });
            localStorage.setItem("addresses", JSON.stringify(updated));
            localStorage.setItem("selectedAddressIndex", JSON.stringify(index));
            return { addresses: updated, selectedAddressIndex: index };
        });
    },
    selectAddress: function (index) {
        return set(function () {
            localStorage.setItem("selectedAddressIndex", JSON.stringify(index));
            return { selectedAddressIndex: index };
        });
    }
}); });
