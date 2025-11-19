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
exports.listProductsWithSort = exports.listProducts = void 0;
var config_1 = require("@/lib/config");
var sort_products_1 = require("@/lib/helpers/sort-products");
var regions_1 = require("./regions");
exports.listProducts = function (_a) {
    var _b = _a.pageParam, pageParam = _b === void 0 ? 1 : _b, queryParams = _a.queryParams, countryCode = _a.countryCode, providedRegionId = _a.regionId;
    return __awaiter(void 0, void 0, void 0, function () {
        var limit, offset, regionId, region, _c, _d, products, _e, count, validProducts;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    limit = (queryParams === null || queryParams === void 0 ? void 0 : queryParams.limit) || 12;
                    offset = (pageParam - 1) * limit;
                    regionId = providedRegionId;
                    if (!(!regionId && countryCode)) return [3 /*break*/, 2];
                    return [4 /*yield*/, regions_1.getRegion(countryCode)];
                case 1:
                    region = _f.sent();
                    regionId = region === null || region === void 0 ? void 0 : region.id;
                    _f.label = 2;
                case 2:
                    if (!regionId) {
                        console.warn("No region_id - prices will be missing!");
                    }
                    return [4 /*yield*/, config_1.publicProductClient.store.product.list(__assign({ limit: limit,
                            offset: offset, region_id: regionId, fields: "+variants.calculated_price.*" }, queryParams))
                        // Filter out products with no price
                    ];
                case 3:
                    _c = _f.sent(), _d = _c.products, products = _d === void 0 ? [] : _d, _e = _c.count, count = _e === void 0 ? 0 : _e;
                    validProducts = products.filter(function (p) { var _a; return (_a = p.variants) === null || _a === void 0 ? void 0 : _a.some(function (v) { var _a; return ((_a = v.calculated_price) === null || _a === void 0 ? void 0 : _a.calculated_amount) != null; }); });
                    return [2 /*return*/, {
                            response: { products: validProducts, count: validProducts.length },
                            nextPage: count > offset + limit ? pageParam + 1 : null
                        }];
            }
        });
    });
};
exports.listProductsWithSort = function (_a) {
    var _b = _a.page, page = _b === void 0 ? 1 : _b, queryParams = _a.queryParams, _c = _a.sortBy, sortBy = _c === void 0 ? "created_at" : _c, countryCode = _a.countryCode, category_id = _a.category_id, seller_id = _a.seller_id, collection_id = _a.collection_id;
    return __awaiter(void 0, void 0, Promise, function () {
        var limit, products, filtered, sorted, start, end;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    limit = (queryParams === null || queryParams === void 0 ? void 0 : queryParams.limit) || 12;
                    return [4 /*yield*/, exports.listProducts({
                            pageParam: 1,
                            queryParams: __assign(__assign({}, queryParams), { limit: 200, category_id: category_id,
                                collection_id: collection_id }),
                            countryCode: countryCode
                        })];
                case 1:
                    products = (_d.sent()).response.products;
                    filtered = seller_id
                        ? products.filter(function (p) { var _a; return ((_a = p.seller) === null || _a === void 0 ? void 0 : _a.id) === seller_id; })
                        : products;
                    filtered = filtered.filter(function (p) { var _a; return (_a = p.variants) === null || _a === void 0 ? void 0 : _a.some(function (v) { return v.calculated_price != null; }); });
                    sorted = sort_products_1.sortProducts(filtered, sortBy);
                    start = (page - 1) * limit;
                    end = start + limit;
                    return [2 /*return*/, {
                            response: {
                                products: sorted.slice(start, end),
                                count: filtered.length
                            },
                            nextPage: end < filtered.length ? page + 1 : null
                        }];
            }
        });
    });
};
