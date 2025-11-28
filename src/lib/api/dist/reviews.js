"use strict";
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
exports.submitSellerReview = exports.fetchSellerRatingSummary = exports.fetchSellerReviews = exports.submitProductReview = exports.fetchProductRatingSummary = exports.fetchProductReviews = void 0;
exports.fetchProductReviews = function (productId, limit, offset) {
    if (limit === void 0) { limit = 10; }
    if (offset === void 0) { offset = 0; }
    return __awaiter(void 0, void 0, Promise, function () {
        var res, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL + "/store/products/" + productId + "/reviews?limit=" + limit + "&offset=" + offset)];
                case 1:
                    res = _a.sent();
                    if (!res.ok)
                        throw new Error("Failed to fetch product reviews");
                    return [4 /*yield*/, res.json()];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data];
            }
        });
    });
};
exports.fetchProductRatingSummary = function (productId) { return __awaiter(void 0, void 0, Promise, function () {
    var publishableKey, res, data, payload, err_1;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;
                if (!publishableKey) {
                    console.warn("Missing NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY");
                    return [2 /*return*/, { average_rating: 0, total_reviews: 0 }];
                }
                _d.label = 1;
            case 1:
                _d.trys.push([1, 4, , 5]);
                return [4 /*yield*/, fetch(process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL + "/store/products/" + productId + "/rating-summary", {
                        headers: {
                            "x-publishable-api-key": publishableKey,
                            "Content-Type": "application/json"
                        },
                        cache: "no-store"
                    })];
            case 2:
                res = _d.sent();
                if (!res.ok) {
                    console.log(" Failed to fetch for " + productId + ": " + res.status + " " + res.statusText);
                    return [2 /*return*/, { average_rating: 0, total_reviews: 0 }];
                }
                return [4 /*yield*/, res.json()];
            case 3:
                data = _d.sent();
                payload = data.data || data;
                return [2 /*return*/, {
                        average_rating: Number((_a = payload.average_rating) !== null && _a !== void 0 ? _a : 0),
                        total_reviews: Number((_b = payload.total_reviews) !== null && _b !== void 0 ? _b : 0),
                        last_month_sales: Number((_c = payload.last_month_sales) !== null && _c !== void 0 ? _c : 0)
                    }];
            case 4:
                err_1 = _d.sent();
                console.error("[fetchProductRatingSummary] Error for " + productId, err_1);
                return [2 /*return*/, { average_rating: 0, total_reviews: 0 }];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.submitProductReview = function (productId, rating, customerNote) { return __awaiter(void 0, void 0, Promise, function () {
    var res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch(process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL + "/store/reviews", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        reference: "product",
                        reference_id: productId,
                        rating: rating,
                        customer_note: customerNote
                    })
                })];
            case 1:
                res = _a.sent();
                if (!res.ok)
                    throw new Error("Failed to submit product review");
                return [2 /*return*/];
        }
    });
}); };
exports.fetchSellerReviews = function (sellerId, limit, offset) {
    if (limit === void 0) { limit = 10; }
    if (offset === void 0) { offset = 0; }
    return __awaiter(void 0, void 0, Promise, function () {
        var res, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL + "/store/seller/" + sellerId + "/reviews?limit=" + limit + "&offset=" + offset)];
                case 1:
                    res = _a.sent();
                    if (!res.ok)
                        throw new Error("Failed to fetch seller reviews");
                    return [4 /*yield*/, res.json()];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data];
            }
        });
    });
};
exports.fetchSellerRatingSummary = function (sellerId) { return __awaiter(void 0, void 0, Promise, function () {
    var res, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch(process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL + "/store/seller/" + sellerId + "/rating-summary")];
            case 1:
                res = _a.sent();
                if (!res.ok)
                    throw new Error("Failed to fetch seller rating summary");
                return [4 /*yield*/, res.json()];
            case 2:
                data = _a.sent();
                return [2 /*return*/, data];
        }
    });
}); };
exports.submitSellerReview = function (sellerId, rating, customerNote) { return __awaiter(void 0, void 0, Promise, function () {
    var res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch(process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL + "/store/reviews", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        reference: "seller",
                        reference_id: sellerId,
                        rating: rating,
                        customer_note: customerNote
                    })
                })];
            case 1:
                res = _a.sent();
                if (!res.ok)
                    throw new Error("Failed to submit seller review");
                return [2 /*return*/];
        }
    });
}); };
