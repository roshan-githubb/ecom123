"use strict";
exports.__esModule = true;
exports.useCheckoutStore = void 0;
var zustand_1 = require("zustand");
exports.useCheckoutStore = zustand_1.create(function (set) { return ({
    address: null,
    payment: "bank",
    setAddress: function (addr) { return set({ address: addr }); },
    setPayment: function (pay) { return set({ payment: pay }); }
}); });
