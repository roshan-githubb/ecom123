"use server";
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
exports.listCartOptions = exports.updateRegionWithValidation = exports.updateRegion = exports.placeOrder = exports.setAddresses = exports.deletePromotionCode = exports.removeShippingMethod = exports.applyPromotions = exports.initiatePaymentSession = exports.setShippingMethod = exports.deleteLineItem = exports.updateLineItem = exports.addToCart = exports.updateCart = exports.getOrSetCart = exports.retrieveCart = void 0;
var config_1 = require("../config");
var medusa_error_1 = require("@/lib/helpers/medusa-error");
var cache_1 = require("next/cache");
var navigation_1 = require("next/navigation");
var cookies_1 = require("./cookies");
var regions_1 = require("./regions");
var parse_variant_error_1 = require("@/lib/helpers/parse-variant-error");
/**
 * Retrieves a cart by its ID. If no ID is provided, it will use the cart ID from the cookies.
 * @param cartId - optional - The ID of the cart to retrieve.
 * @returns The cart object if found, or null if not found.
 */
function retrieveCart(cartId) {
    return __awaiter(this, void 0, void 0, function () {
        var id, _a, headers, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = cartId;
                    if (_a) return [3 /*break*/, 2];
                    return [4 /*yield*/, cookies_1.getCartId()];
                case 1:
                    _a = (_c.sent());
                    _c.label = 2;
                case 2:
                    id = _a;
                    if (!id) {
                        return [2 /*return*/, null];
                    }
                    _b = [{}];
                    return [4 /*yield*/, cookies_1.getAuthHeaders()];
                case 3:
                    headers = __assign.apply(void 0, _b.concat([(_c.sent())]));
                    return [4 /*yield*/, config_1.sdk.client
                            .fetch("/store/carts/" + id, {
                            method: "GET",
                            query: {
                                fields: "*items,*region, *items.product, *items.variant, *items.variant.options, items.variant.options.option.title," +
                                    "*items.thumbnail, *items.metadata, +items.total, *promotions, +shipping_methods.name, *items.product.seller" +
                                    ""
                            },
                            headers: headers,
                            cache: "no-cache"
                        })
                            .then(function (_a) {
                            var cart = _a.cart;
                            return cart;
                        })["catch"](function () { return null; })];
                case 4: return [2 /*return*/, _c.sent()];
            }
        });
    });
}
exports.retrieveCart = retrieveCart;
function getOrSetCart(countryCode) {
    return __awaiter(this, void 0, void 0, function () {
        var region, cart, headers, _a, cartResp, cartCacheTag, cartCacheTag;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, regions_1.getRegion(countryCode)];
                case 1:
                    region = _b.sent();
                    if (!region) {
                        throw new Error("Region not found for country code: " + countryCode);
                    }
                    return [4 /*yield*/, retrieveCart()];
                case 2:
                    cart = _b.sent();
                    _a = [{}];
                    return [4 /*yield*/, cookies_1.getAuthHeaders()];
                case 3:
                    headers = __assign.apply(void 0, _a.concat([(_b.sent())]));
                    if (!!cart) return [3 /*break*/, 7];
                    return [4 /*yield*/, config_1.sdk.store.cart.create({ region_id: region.id }, {}, headers)];
                case 4:
                    cartResp = _b.sent();
                    cart = cartResp.cart;
                    return [4 /*yield*/, cookies_1.setCartId(cart.id)];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, cookies_1.getCacheTag("carts")];
                case 6:
                    cartCacheTag = _b.sent();
                    cache_1.revalidateTag(cartCacheTag);
                    _b.label = 7;
                case 7:
                    if (!(cart && (cart === null || cart === void 0 ? void 0 : cart.region_id) !== region.id)) return [3 /*break*/, 10];
                    return [4 /*yield*/, config_1.sdk.store.cart.update(cart.id, { region_id: region.id }, {}, headers)];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, cookies_1.getCacheTag("carts")];
                case 9:
                    cartCacheTag = _b.sent();
                    cache_1.revalidateTag(cartCacheTag);
                    _b.label = 10;
                case 10: return [2 /*return*/, cart];
            }
        });
    });
}
exports.getOrSetCart = getOrSetCart;
function updateCart(data) {
    return __awaiter(this, void 0, void 0, function () {
        var cartId, headers, _a;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, cookies_1.getCartId()];
                case 1:
                    cartId = _b.sent();
                    if (!cartId) {
                        throw new Error("No existing cart found, please create one before updating");
                    }
                    _a = [{}];
                    return [4 /*yield*/, cookies_1.getAuthHeaders()];
                case 2:
                    headers = __assign.apply(void 0, _a.concat([(_b.sent())]));
                    return [4 /*yield*/, config_1.sdk.store.cart
                            .update(cartId, data, {}, headers)
                            .then(function (_a) {
                            var cart = _a.cart;
                            return __awaiter(_this, void 0, void 0, function () {
                                var cartCacheTag;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0: return [4 /*yield*/, cookies_1.getCacheTag("carts")];
                                        case 1:
                                            cartCacheTag = _b.sent();
                                            return [4 /*yield*/, cache_1.revalidateTag(cartCacheTag)];
                                        case 2:
                                            _b.sent();
                                            return [2 /*return*/, cart];
                                    }
                                });
                            });
                        })["catch"](medusa_error_1["default"])];
                case 3: return [2 /*return*/, _b.sent()];
            }
        });
    });
}
exports.updateCart = updateCart;
function addToCart(_a) {
    var _b;
    var variantId = _a.variantId, quantity = _a.quantity, countryCode = _a.countryCode;
    return __awaiter(this, void 0, void 0, function () {
        var cart, headers, _c, currentItem;
        var _this = this;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!variantId) {
                        throw new Error("Missing variant ID when adding to cart");
                    }
                    return [4 /*yield*/, getOrSetCart(countryCode)];
                case 1:
                    cart = _d.sent();
                    if (!cart) {
                        throw new Error("Error retrieving or creating cart");
                    }
                    _c = [{}];
                    return [4 /*yield*/, cookies_1.getAuthHeaders()];
                case 2:
                    headers = __assign.apply(void 0, _c.concat([(_d.sent())]));
                    currentItem = (_b = cart.items) === null || _b === void 0 ? void 0 : _b.find(function (item) { return item.variant_id === variantId; });
                    if (!currentItem) return [3 /*break*/, 4];
                    return [4 /*yield*/, config_1.sdk.store.cart
                            .updateLineItem(cart.id, currentItem.id, { quantity: currentItem.quantity + quantity }, {}, headers)["catch"](medusa_error_1["default"])["finally"](function () { return __awaiter(_this, void 0, void 0, function () {
                            var cartCacheTag;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, cookies_1.getCacheTag("carts")];
                                    case 1:
                                        cartCacheTag = _a.sent();
                                        cache_1.revalidateTag(cartCacheTag);
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 3:
                    _d.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, config_1.sdk.store.cart
                        .createLineItem(cart.id, {
                        variant_id: variantId,
                        quantity: quantity
                    }, {}, headers)
                        .then(function () { return __awaiter(_this, void 0, void 0, function () {
                        var cartCacheTag;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, cookies_1.getCacheTag("carts")];
                                case 1:
                                    cartCacheTag = _a.sent();
                                    cache_1.revalidateTag(cartCacheTag);
                                    return [2 /*return*/];
                            }
                        });
                    }); })["catch"](medusa_error_1["default"])["finally"](function () { return __awaiter(_this, void 0, void 0, function () {
                        var cartCacheTag;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, cookies_1.getCacheTag("carts")];
                                case 1:
                                    cartCacheTag = _a.sent();
                                    cache_1.revalidateTag(cartCacheTag);
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 5:
                    _d.sent();
                    _d.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.addToCart = addToCart;
function updateLineItem(_a) {
    var lineId = _a.lineId, quantity = _a.quantity;
    return __awaiter(this, void 0, void 0, function () {
        var cartId, headers, _b, res, cartCacheTag;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!lineId) {
                        throw new Error("Missing lineItem ID when updating line item");
                    }
                    return [4 /*yield*/, cookies_1.getCartId()];
                case 1:
                    cartId = _c.sent();
                    if (!cartId) {
                        throw new Error("Missing cart ID when updating line item");
                    }
                    _b = [{}];
                    return [4 /*yield*/, cookies_1.getAuthHeaders()];
                case 2:
                    headers = __assign.apply(void 0, _b.concat([(_c.sent())]));
                    return [4 /*yield*/, config_1.fetchQuery("/store/carts/" + cartId + "/line-items/" + lineId, {
                            body: { quantity: quantity },
                            method: "POST",
                            headers: headers
                        })];
                case 3:
                    res = _c.sent();
                    return [4 /*yield*/, cookies_1.getCacheTag("carts")];
                case 4:
                    cartCacheTag = _c.sent();
                    return [4 /*yield*/, cache_1.revalidateTag(cartCacheTag)];
                case 5:
                    _c.sent();
                    return [2 /*return*/, res];
            }
        });
    });
}
exports.updateLineItem = updateLineItem;
function deleteLineItem(lineId) {
    return __awaiter(this, void 0, void 0, function () {
        var cartId, headers, _a;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!lineId) {
                        throw new Error("Missing lineItem ID when deleting line item");
                    }
                    return [4 /*yield*/, cookies_1.getCartId()];
                case 1:
                    cartId = _b.sent();
                    if (!cartId) {
                        throw new Error("Missing cart ID when deleting line item");
                    }
                    _a = [{}];
                    return [4 /*yield*/, cookies_1.getAuthHeaders()];
                case 2:
                    headers = __assign.apply(void 0, _a.concat([(_b.sent())]));
                    return [4 /*yield*/, config_1.sdk.store.cart
                            .deleteLineItem(cartId, lineId, headers)
                            .then(function () { return __awaiter(_this, void 0, void 0, function () {
                            var cartCacheTag;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, cookies_1.getCacheTag("carts")];
                                    case 1:
                                        cartCacheTag = _a.sent();
                                        return [4 /*yield*/, cache_1.revalidateTag(cartCacheTag)];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })["catch"](medusa_error_1["default"])];
                case 3:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.deleteLineItem = deleteLineItem;
function setShippingMethod(_a) {
    var cartId = _a.cartId, shippingMethodId = _a.shippingMethodId;
    return __awaiter(this, void 0, void 0, function () {
        var headers, _b, res, cartCacheTag;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = [{}];
                    return [4 /*yield*/, cookies_1.getAuthHeaders()];
                case 1:
                    headers = __assign.apply(void 0, _b.concat([(_c.sent())]));
                    return [4 /*yield*/, config_1.fetchQuery("/store/carts/" + cartId + "/shipping-methods", {
                            body: { option_id: shippingMethodId },
                            method: "POST",
                            headers: headers
                        })];
                case 2:
                    res = _c.sent();
                    return [4 /*yield*/, cookies_1.getCacheTag("carts")];
                case 3:
                    cartCacheTag = _c.sent();
                    cache_1.revalidateTag(cartCacheTag);
                    return [2 /*return*/, res];
            }
        });
    });
}
exports.setShippingMethod = setShippingMethod;
function initiatePaymentSession(cart, data) {
    return __awaiter(this, void 0, void 0, function () {
        var headers, _a;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = [{}];
                    return [4 /*yield*/, cookies_1.getAuthHeaders()];
                case 1:
                    headers = __assign.apply(void 0, _a.concat([(_b.sent())]));
                    return [2 /*return*/, config_1.sdk.store.payment
                            .initiatePaymentSession(cart, data, {}, headers)
                            .then(function (resp) { return __awaiter(_this, void 0, void 0, function () {
                            var cartCacheTag;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, cookies_1.getCacheTag("carts")];
                                    case 1:
                                        cartCacheTag = _a.sent();
                                        cache_1.revalidateTag(cartCacheTag);
                                        return [2 /*return*/, resp];
                                }
                            });
                        }); })["catch"](medusa_error_1["default"])];
            }
        });
    });
}
exports.initiatePaymentSession = initiatePaymentSession;
function applyPromotions(codes) {
    return __awaiter(this, void 0, void 0, function () {
        var cartId, headers, _a;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, cookies_1.getCartId()];
                case 1:
                    cartId = _b.sent();
                    if (!cartId) {
                        throw new Error("No existing cart found");
                    }
                    _a = [{}];
                    return [4 /*yield*/, cookies_1.getAuthHeaders()];
                case 2:
                    headers = __assign.apply(void 0, _a.concat([(_b.sent())]));
                    return [2 /*return*/, config_1.sdk.store.cart
                            .update(cartId, { promo_codes: codes }, {}, headers)
                            .then(function (_a) {
                            var cart = _a.cart;
                            return __awaiter(_this, void 0, void 0, function () {
                                var cartCacheTag, applied;
                                var _b;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0: return [4 /*yield*/, cookies_1.getCacheTag("carts")];
                                        case 1:
                                            cartCacheTag = _c.sent();
                                            cache_1.revalidateTag(cartCacheTag);
                                            applied = (_b = cart.promotions) === null || _b === void 0 ? void 0 : _b.some(function (promotion) {
                                                return codes.includes(promotion.code);
                                            });
                                            return [2 /*return*/, applied];
                                    }
                                });
                            });
                        })["catch"](medusa_error_1["default"])];
            }
        });
    });
}
exports.applyPromotions = applyPromotions;
function removeShippingMethod(shippingMethodId) {
    return __awaiter(this, void 0, void 0, function () {
        var cartId, headers, _a;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, cookies_1.getCartId()];
                case 1:
                    cartId = _b.sent();
                    if (!cartId) {
                        throw new Error("No existing cart found");
                    }
                    _a = [{}];
                    return [4 /*yield*/, cookies_1.getAuthHeaders()];
                case 2:
                    headers = __assign.apply(void 0, [__assign.apply(void 0, _a.concat([(_b.sent())])), { "Content-Type": "application/json", "x-publishable-api-key": process.env
                                .NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY }]);
                    return [2 /*return*/, fetch(process.env.MEDUSA_BACKEND_URL + "/store/carts/" + cartId + "/shipping-methods", {
                            method: "DELETE",
                            body: JSON.stringify({ shipping_method_ids: [shippingMethodId] }),
                            headers: headers
                        })
                            .then(function () { return __awaiter(_this, void 0, void 0, function () {
                            var cartCacheTag;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, cookies_1.getCacheTag("carts")];
                                    case 1:
                                        cartCacheTag = _a.sent();
                                        cache_1.revalidateTag(cartCacheTag);
                                        return [2 /*return*/];
                                }
                            });
                        }); })["catch"](medusa_error_1["default"])];
            }
        });
    });
}
exports.removeShippingMethod = removeShippingMethod;
function deletePromotionCode(promoId) {
    return __awaiter(this, void 0, void 0, function () {
        var cartId, headers, _a;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, cookies_1.getCartId()];
                case 1:
                    cartId = _b.sent();
                    if (!cartId) {
                        throw new Error("No existing cart found");
                    }
                    _a = [{}];
                    return [4 /*yield*/, cookies_1.getAuthHeaders()];
                case 2:
                    headers = __assign.apply(void 0, [__assign.apply(void 0, _a.concat([(_b.sent())])), { "Content-Type": "application/json", "x-publishable-api-key": process.env
                                .NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY }]);
                    return [2 /*return*/, fetch(process.env.MEDUSA_BACKEND_URL + "/store/carts/" + cartId + "/promotions", {
                            method: "DELETE",
                            body: JSON.stringify({ promo_codes: [promoId] }),
                            headers: headers
                        })
                            .then(function () { return __awaiter(_this, void 0, void 0, function () {
                            var cartCacheTag;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, cookies_1.getCacheTag("carts")];
                                    case 1:
                                        cartCacheTag = _a.sent();
                                        cache_1.revalidateTag(cartCacheTag);
                                        return [2 /*return*/];
                                }
                            });
                        }); })["catch"](medusa_error_1["default"])];
            }
        });
    });
}
exports.deletePromotionCode = deletePromotionCode;
// TODO: Pass a POJO instead of a form entity here
function setAddresses(currentState, formData) {
    return __awaiter(this, void 0, void 0, function () {
        var cartId, data, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    if (!formData) {
                        throw new Error("No form data found when setting addresses");
                    }
                    cartId = cookies_1.getCartId();
                    if (!cartId) {
                        throw new Error("No existing cart found when setting addresses");
                    }
                    data = {
                        shipping_address: {
                            first_name: formData.get("shipping_address.first_name"),
                            last_name: formData.get("shipping_address.last_name"),
                            address_1: formData.get("shipping_address.address_1"),
                            address_2: "",
                            company: formData.get("shipping_address.company"),
                            postal_code: formData.get("shipping_address.postal_code"),
                            city: formData.get("shipping_address.city"),
                            country_code: formData.get("shipping_address.country_code"),
                            province: formData.get("shipping_address.province"),
                            phone: formData.get("shipping_address.phone")
                        },
                        email: formData.get("email")
                    };
                    // const sameAsBilling = formData.get("same_as_billing")
                    // if (sameAsBilling === "on") data.billing_address = data.shipping_address
                    data.billing_address = data.shipping_address;
                    // if (sameAsBilling !== "on")
                    //   data.billing_address = {
                    //     first_name: formData.get("billing_address.first_name"),
                    //     last_name: formData.get("billing_address.last_name"),
                    //     address_1: formData.get("billing_address.address_1"),
                    //     address_2: "",
                    //     company: formData.get("billing_address.company"),
                    //     postal_code: formData.get("billing_address.postal_code"),
                    //     city: formData.get("billing_address.city"),
                    //     country_code: formData.get("billing_address.country_code"),
                    //     province: formData.get("billing_address.province"),
                    //     phone: formData.get("billing_address.phone"),
                    //   }
                    return [4 /*yield*/, updateCart(data)];
                case 1:
                    // if (sameAsBilling !== "on")
                    //   data.billing_address = {
                    //     first_name: formData.get("billing_address.first_name"),
                    //     last_name: formData.get("billing_address.last_name"),
                    //     address_1: formData.get("billing_address.address_1"),
                    //     address_2: "",
                    //     company: formData.get("billing_address.company"),
                    //     postal_code: formData.get("billing_address.postal_code"),
                    //     city: formData.get("billing_address.city"),
                    //     country_code: formData.get("billing_address.country_code"),
                    //     province: formData.get("billing_address.province"),
                    //     phone: formData.get("billing_address.phone"),
                    //   }
                    _a.sent();
                    return [4 /*yield*/, cache_1.revalidatePath("/cart")];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    return [2 /*return*/, e_1.message];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.setAddresses = setAddresses;
/**
 * Places an order for a cart. If no cart ID is provided, it will use the cart ID from the cookies.
 * @param cartId - optional - The ID of the cart to place an order for.
 * @returns The cart object if the order was successful, or null if not.
 */
function placeOrder(cartId) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var id, _c, headers, _d, res, cartCacheTag;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _c = cartId;
                    if (_c) return [3 /*break*/, 2];
                    return [4 /*yield*/, cookies_1.getCartId()];
                case 1:
                    _c = (_e.sent());
                    _e.label = 2;
                case 2:
                    id = _c;
                    if (!id) {
                        throw new Error("No existing cart found when placing an order");
                    }
                    _d = [{}];
                    return [4 /*yield*/, cookies_1.getAuthHeaders()];
                case 3:
                    headers = __assign.apply(void 0, _d.concat([(_e.sent())]));
                    return [4 /*yield*/, config_1.fetchQuery("/store/carts/" + id + "/complete", {
                            method: "POST",
                            headers: headers
                        })];
                case 4:
                    res = _e.sent();
                    return [4 /*yield*/, cookies_1.getCacheTag("carts")];
                case 5:
                    cartCacheTag = _e.sent();
                    cache_1.revalidateTag(cartCacheTag);
                    if ((_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.order_set) {
                        cache_1.revalidatePath("/user/reviews");
                        cache_1.revalidatePath("/user/orders");
                        cookies_1.removeCartId();
                        navigation_1.redirect("/order/" + ((_b = res === null || res === void 0 ? void 0 : res.data) === null || _b === void 0 ? void 0 : _b.order_set.orders[0].id) + "/confirmed");
                    }
                    return [2 /*return*/, res];
            }
        });
    });
}
exports.placeOrder = placeOrder;
/**
 * Updates the countrycode param and revalidates the regions cache
 * @param regionId
 * @param countryCode
 */
function updateRegion(countryCode, currentPath) {
    return __awaiter(this, void 0, void 0, function () {
        var cartId, region, cartCacheTag, regionCacheTag, productsCacheTag;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, cookies_1.getCartId()];
                case 1:
                    cartId = _a.sent();
                    return [4 /*yield*/, regions_1.getRegion(countryCode)];
                case 2:
                    region = _a.sent();
                    if (!region) {
                        throw new Error("Region not found for country code: " + countryCode);
                    }
                    if (!cartId) return [3 /*break*/, 5];
                    return [4 /*yield*/, updateCart({ region_id: region.id })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, cookies_1.getCacheTag("carts")];
                case 4:
                    cartCacheTag = _a.sent();
                    cache_1.revalidateTag(cartCacheTag);
                    _a.label = 5;
                case 5: return [4 /*yield*/, cookies_1.getCacheTag("regions")];
                case 6:
                    regionCacheTag = _a.sent();
                    cache_1.revalidateTag(regionCacheTag);
                    return [4 /*yield*/, cookies_1.getCacheTag("products")];
                case 7:
                    productsCacheTag = _a.sent();
                    cache_1.revalidateTag(productsCacheTag);
                    navigation_1.redirect("/" + countryCode + currentPath);
                    return [2 /*return*/];
            }
        });
    });
}
exports.updateRegion = updateRegion;
/**
 * Updates the region and returns removed items for notification
 * This is a wrapper around updateRegion that doesn't redirect
 * Uses error-driven approach: tries to update, catches price errors, removes problem items, retries
 * @param countryCode - The country code to update to
 * @param currentPath - The current path for redirect
 * @returns Array of removed item names and new path
 */
function updateRegionWithValidation(countryCode, currentPath) {
    var _a, _b;
    return __awaiter(this, void 0, Promise, function () {
        var cartId, region, removedItems, headers, _c, error_1, problematicVariantIds, cart, _loop_1, _i, problematicVariantIds_1, variantId, fetchError_1, cartCacheTag, regionCacheTag, productsCacheTag;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, cookies_1.getCartId()];
                case 1:
                    cartId = _d.sent();
                    return [4 /*yield*/, regions_1.getRegion(countryCode)];
                case 2:
                    region = _d.sent();
                    if (!region) {
                        throw new Error("Region not found for country code: " + countryCode);
                    }
                    removedItems = [];
                    if (!cartId) return [3 /*break*/, 19];
                    _c = [{}];
                    return [4 /*yield*/, cookies_1.getAuthHeaders()];
                case 3:
                    headers = __assign.apply(void 0, _c.concat([(_d.sent())]));
                    _d.label = 4;
                case 4:
                    _d.trys.push([4, 6, , 17]);
                    return [4 /*yield*/, updateCart({ region_id: region.id })];
                case 5:
                    _d.sent();
                    return [3 /*break*/, 17];
                case 6:
                    error_1 = _d.sent();
                    // Check if error is about variants not having prices
                    if (!((_a = error_1 === null || error_1 === void 0 ? void 0 : error_1.message) === null || _a === void 0 ? void 0 : _a.includes("do not have a price"))) {
                        // Re-throw if it's a different error
                        throw error_1;
                    }
                    problematicVariantIds = parse_variant_error_1.parseVariantIdsFromError(error_1.message);
                    // Early return if no variant IDs found
                    if (!problematicVariantIds.length) {
                        throw new Error("Failed to parse variant IDs from error");
                    }
                    _d.label = 7;
                case 7:
                    _d.trys.push([7, 15, , 16]);
                    return [4 /*yield*/, config_1.sdk.client.fetch("/store/carts/" + cartId, {
                            method: "GET",
                            query: {
                                fields: "*items"
                            },
                            headers: headers,
                            cache: "no-cache"
                        })
                        // Iterate over problematic variants and remove corresponding items
                    ];
                case 8:
                    cart = (_d.sent()).cart;
                    _loop_1 = function (variantId) {
                        var item, deleteError_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    item = (_b = cart === null || cart === void 0 ? void 0 : cart.items) === null || _b === void 0 ? void 0 : _b.find(function (item) { return item.variant_id === variantId; });
                                    if (!item) return [3 /*break*/, 4];
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, config_1.sdk.store.cart.deleteLineItem(cart.id, item.id, headers)];
                                case 2:
                                    _a.sent();
                                    removedItems.push(item.product_title || "Unknown product");
                                    return [3 /*break*/, 4];
                                case 3:
                                    deleteError_1 = _a.sent();
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, problematicVariantIds_1 = problematicVariantIds;
                    _d.label = 9;
                case 9:
                    if (!(_i < problematicVariantIds_1.length)) return [3 /*break*/, 12];
                    variantId = problematicVariantIds_1[_i];
                    return [5 /*yield**/, _loop_1(variantId)];
                case 10:
                    _d.sent();
                    _d.label = 11;
                case 11:
                    _i++;
                    return [3 /*break*/, 9];
                case 12:
                    if (!(removedItems.length > 0)) return [3 /*break*/, 14];
                    return [4 /*yield*/, updateCart({ region_id: region.id })];
                case 13:
                    _d.sent();
                    _d.label = 14;
                case 14: return [3 /*break*/, 16];
                case 15:
                    fetchError_1 = _d.sent();
                    throw new Error("Failed to handle incompatible cart items");
                case 16: return [3 /*break*/, 17];
                case 17: return [4 /*yield*/, cookies_1.getCacheTag("carts")];
                case 18:
                    cartCacheTag = _d.sent();
                    cache_1.revalidateTag(cartCacheTag);
                    _d.label = 19;
                case 19: return [4 /*yield*/, cookies_1.getCacheTag("regions")];
                case 20:
                    regionCacheTag = _d.sent();
                    cache_1.revalidateTag(regionCacheTag);
                    return [4 /*yield*/, cookies_1.getCacheTag("products")];
                case 21:
                    productsCacheTag = _d.sent();
                    cache_1.revalidateTag(productsCacheTag);
                    return [2 /*return*/, {
                            removedItems: removedItems,
                            newPath: "/" + countryCode + currentPath
                        }];
            }
        });
    });
}
exports.updateRegionWithValidation = updateRegionWithValidation;
function listCartOptions() {
    return __awaiter(this, void 0, void 0, function () {
        var cartId, headers, _a, next, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, cookies_1.getCartId()];
                case 1:
                    cartId = _c.sent();
                    _a = [{}];
                    return [4 /*yield*/, cookies_1.getAuthHeaders()];
                case 2:
                    headers = __assign.apply(void 0, _a.concat([(_c.sent())]));
                    _b = [{}];
                    return [4 /*yield*/, cookies_1.getCacheOptions("shippingOptions")];
                case 3:
                    next = __assign.apply(void 0, _b.concat([(_c.sent())]));
                    return [4 /*yield*/, config_1.sdk.client.fetch("/store/shipping-options", {
                            query: { cart_id: cartId },
                            next: next,
                            headers: headers,
                            cache: "force-cache"
                        })];
                case 4: return [2 /*return*/, _c.sent()];
            }
        });
    });
}
exports.listCartOptions = listCartOptions;
