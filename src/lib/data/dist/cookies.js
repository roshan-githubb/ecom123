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
exports.removeCartId = exports.setCartId = exports.getCartId = exports.removeAuthToken = exports.setAuthToken = exports.getCacheOptions = exports.getCacheTag = exports.getAuthHeaders = void 0;
require("server-only");
var headers_1 = require("next/headers");
// export const getAuthHeaders = async (): Promise<
//   { authorization: string } | {}
// > => {
//   const cookies = await nextCookies();
//   const token = cookies.get('_medusa_jwt')?.value;
//   if (!token) {
//     return {};
//   }
//   return { authorization: `Bearer ${token}` };
// };
exports.getAuthHeaders = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        // For storefront (products, categories, homepage, etc)
        // NEVER send authorization header
        return [2 /*return*/, {}];
    });
}); };
exports.getCacheTag = function (tag) { return __awaiter(void 0, void 0, Promise, function () {
    var cookies, cacheId, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, headers_1.cookies()];
            case 1:
                cookies = _b.sent();
                cacheId = (_a = cookies.get('_medusa_cache_id')) === null || _a === void 0 ? void 0 : _a.value;
                if (!cacheId) {
                    return [2 /*return*/, ''];
                }
                return [2 /*return*/, tag + "-" + cacheId];
            case 2:
                error_1 = _b.sent();
                return [2 /*return*/, ''];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getCacheOptions = function (tag) { return __awaiter(void 0, void 0, Promise, function () {
    var cacheTag;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (typeof window !== 'undefined') {
                    return [2 /*return*/, {}];
                }
                return [4 /*yield*/, exports.getCacheTag(tag)];
            case 1:
                cacheTag = _a.sent();
                if (!cacheTag) {
                    return [2 /*return*/, {}];
                }
                return [2 /*return*/, { tags: ["" + cacheTag] }];
        }
    });
}); };
exports.setAuthToken = function (token) { return __awaiter(void 0, void 0, void 0, function () {
    var cookies;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, headers_1.cookies()];
            case 1:
                cookies = _a.sent();
                cookies.set('_medusa_jwt', token, {
                    maxAge: 60 * 60 * 24 * 7,
                    httpOnly: true,
                    sameSite: 'lax',
                    secure: process.env.NODE_ENV === 'production'
                });
                return [2 /*return*/];
        }
    });
}); };
exports.removeAuthToken = function () { return __awaiter(void 0, void 0, void 0, function () {
    var cookies;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, headers_1.cookies()];
            case 1:
                cookies = _a.sent();
                cookies.set('_medusa_jwt', '', {
                    maxAge: -1
                });
                return [2 /*return*/];
        }
    });
}); };
exports.getCartId = function () { return __awaiter(void 0, void 0, void 0, function () {
    var cookies;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, headers_1.cookies()];
            case 1:
                cookies = _b.sent();
                return [2 /*return*/, (_a = cookies.get('_medusa_cart_id')) === null || _a === void 0 ? void 0 : _a.value];
        }
    });
}); };
exports.setCartId = function (cartId) { return __awaiter(void 0, void 0, void 0, function () {
    var cookies;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, headers_1.cookies()];
            case 1:
                cookies = _a.sent();
                cookies.set('_medusa_cart_id', cartId, {
                    maxAge: 60 * 60 * 24 * 7,
                    httpOnly: true,
                    sameSite: 'strict',
                    secure: process.env.NODE_ENV === 'production'
                });
                return [2 /*return*/];
        }
    });
}); };
exports.removeCartId = function () { return __awaiter(void 0, void 0, void 0, function () {
    var cookies;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, headers_1.cookies()];
            case 1:
                cookies = _a.sent();
                cookies.set('_medusa_cart_id', '', {
                    maxAge: -1
                });
                return [2 /*return*/];
        }
    });
}); };
