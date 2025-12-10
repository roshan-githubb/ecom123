"use strict";
// src/services/cart.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.getCart = exports.removeFromCart = exports.updateCartItemQuantity = exports.addToServerCart = exports.getOrCreateCartId = exports.setLocalCartId = exports.getLocalCartId = void 0;
function getLocalCartId() {
    if (typeof window === "undefined")
        return null;
    return localStorage.getItem("cart_id");
}
exports.getLocalCartId = getLocalCartId;
function setLocalCartId(id) {
    if (typeof window === "undefined")
        return;
    localStorage.setItem("cart_id", id);
}
exports.setLocalCartId = setLocalCartId;
function getOrCreateCartId() {
    return __awaiter(this, void 0, void 0, function () {
        var cartId, res, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cartId = getLocalCartId();
                    if (cartId)
                        return [2 /*return*/, cartId];
                    return [4 /*yield*/, fetch("/api/cart/create", {
                            method: "POST"
                        })];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    data = _a.sent();
                    cartId = data.cart.id;
                    if (cartId) {
                        setLocalCartId(cartId);
                    }
                    return [2 /*return*/, cartId];
            }
        });
    });
}
exports.getOrCreateCartId = getOrCreateCartId;
function addToServerCart(variantId, quantity) {
    if (quantity === void 0) { quantity = 1; }
    return __awaiter(this, void 0, void 0, function () {
        var cartId, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getOrCreateCartId()];
                case 1:
                    cartId = _a.sent();
                    return [4 /*yield*/, fetch("/api/cart/add", {
                            method: "POST",
                            body: JSON.stringify({
                                cart_id: cartId,
                                variant_id: variantId,
                                quantity: quantity
                            })
                        })];
                case 2:
                    res = _a.sent();
                    return [2 /*return*/, res.json()];
            }
        });
    });
}
exports.addToServerCart = addToServerCart;
function updateCartItemQuantity(lineItemId, quantity) {
    return __awaiter(this, void 0, void 0, function () {
        var cartId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getOrCreateCartId()];
                case 1:
                    cartId = _a.sent();
                    console.log('line item id and quantity ', lineItemId, quantity);
                    return [2 /*return*/, fetch("/api/cart/update", {
                            method: "POST",
                            body: JSON.stringify({ cart_id: cartId, line_item_id: lineItemId, quantity: quantity })
                        }).then(function (res) { return res.json(); })];
            }
        });
    });
}
exports.updateCartItemQuantity = updateCartItemQuantity;
function removeFromCart(lineItemId) {
    return __awaiter(this, void 0, void 0, function () {
        var cartId, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cartId = getLocalCartId();
                    if (!cartId)
                        return [2 /*return*/, null];
                    return [4 /*yield*/, fetch("/api/cart/remove", {
                            method: "POST",
                            body: JSON.stringify({
                                cart_id: cartId,
                                line_item_id: lineItemId
                            })
                        })];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, res.json()];
            }
        });
    });
}
exports.removeFromCart = removeFromCart;
function getCart() {
    return __awaiter(this, void 0, void 0, function () {
        var cartId, res, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cartId = getLocalCartId();
                    if (!cartId)
                        return [2 /*return*/, null];
                    return [4 /*yield*/, fetch("/api/cart/get", {
                            method: "POST",
                            body: JSON.stringify({
                                cart_id: cartId
                            })
                        })];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    data = _a.sent();
                    console.log("Cart:", data);
                    return [2 /*return*/, data];
            }
        });
    });
}
exports.getCart = getCart;
