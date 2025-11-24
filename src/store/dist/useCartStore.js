"use client";
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
exports.useCartStore = void 0;
var zustand_1 = require("zustand");
var middleware_1 = require("zustand/middleware");
exports.useCartStore = zustand_1.create()(middleware_1.persist(function (set, get) { return ({
    items: [],
    addToCart: function (item, quantity) {
        if (quantity === void 0) { quantity = 1; }
        var existing = get().items.find(function (i) { return i.id === item.id; });
        if (existing) {
            set({
                items: get().items.map(function (i) {
                    var _a;
                    return i.id === item.id
                        ? __assign(__assign({}, i), { quantity: (_a = i.quantity) !== null && _a !== void 0 ? _a : 0 + quantity }) : i;
                })
            });
        }
        else {
            set({ items: __spreadArrays(get().items, [__assign(__assign({}, item), { quantity: quantity })]) });
        }
    },
    increase: function (id) {
        return set({
            items: get().items.map(function (i) { var _a; return i.id === id ? __assign(__assign({}, i), { quantity: (_a = i.quantity) !== null && _a !== void 0 ? _a : 0 + 1 }) : i; })
        });
    },
    decrease: function (id) {
        return set({
            items: get().items
                .map(function (i) { var _a; return i.id === id ? __assign(__assign({}, i), { quantity: (_a = i.quantity) !== null && _a !== void 0 ? _a : 0 - 1 }) : i; })
                .filter(function (i) { var _a; return (_a = i.quantity) !== null && _a !== void 0 ? _a : 0 > 0; })
        });
    },
    updateQuantity: function (id, quantity) {
        return set({
            items: get().items
                .map(function (i) { return (i.id === id ? __assign(__assign({}, i), { quantity: quantity }) : i); })
                .filter(function (i) { var _a; return (_a = i.quantity) !== null && _a !== void 0 ? _a : 0 > 0; })
        });
    },
    total: function () {
        return get().items.reduce(function (sum, item) { var _a; return sum + item.price * ((_a = item.quantity) !== null && _a !== void 0 ? _a : 0); }, 0);
    },
    clearCart: function () { return set({ items: [] }); }
}); }, { name: "cart-store" }));
