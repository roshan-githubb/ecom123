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
exports.config = exports.middleware = void 0;
var server_1 = require("next/server");
var BACKEND_URL = process.env.MEDUSA_BACKEND_URL;
var PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;
var DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "us";
var regionMapCache = {
    regionMap: new Map(),
    regionMapUpdated: Date.now()
};
function getRegionMap(cacheId) {
    return __awaiter(this, void 0, void 0, function () {
        var regionMap, regionMapUpdated, regions;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    regionMap = regionMapCache.regionMap, regionMapUpdated = regionMapCache.regionMapUpdated;
                    if (!BACKEND_URL) {
                        throw new Error("Middleware.ts: Error fetching regions. Did you set up regions in your Medusa Admin and define a MEDUSA_BACKEND_URL environment variable? Note that the variable is no longer named NEXT_PUBLIC_MEDUSA_BACKEND_URL.");
                    }
                    if (!(!regionMap.keys().next().value ||
                        regionMapUpdated < Date.now() - 3600 * 1000)) return [3 /*break*/, 2];
                    return [4 /*yield*/, fetch(BACKEND_URL + "/store/regions", {
                            headers: {
                                "x-publishable-api-key": PUBLISHABLE_API_KEY
                            },
                            next: {
                                revalidate: 3600,
                                tags: ["regions-" + cacheId]
                            },
                            cache: "force-cache"
                        }).then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                            var json;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, response.json()];
                                    case 1:
                                        json = _a.sent();
                                        if (!response.ok) {
                                            throw new Error(json.message);
                                        }
                                        return [2 /*return*/, json];
                                }
                            });
                        }); })];
                case 1:
                    regions = (_a.sent()).regions;
                    if (!(regions === null || regions === void 0 ? void 0 : regions.length)) {
                        throw new Error("No regions found. Please set up regions in your Medusa Admin.");
                    }
                    // Create a map of country codes to regions.
                    regions.forEach(function (region) {
                        var _a;
                        (_a = region.countries) === null || _a === void 0 ? void 0 : _a.forEach(function (c) {
                            var _a;
                            regionMapCache.regionMap.set((_a = c.iso_2) !== null && _a !== void 0 ? _a : "", region);
                        });
                    });
                    regionMapCache.regionMapUpdated = Date.now();
                    _a.label = 2;
                case 2: return [2 /*return*/, regionMapCache.regionMap];
            }
        });
    });
}
function getCountryCode(request, regionMap) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var countryCode, vercelCountryCode, urlCountryCode;
        return __generator(this, function (_c) {
            try {
                countryCode = void 0;
                vercelCountryCode = (_a = request.headers
                    .get("x-vercel-ip-country")) === null || _a === void 0 ? void 0 : _a.toLowerCase();
                urlCountryCode = (_b = request.nextUrl.pathname.split("/")[1]) === null || _b === void 0 ? void 0 : _b.toLowerCase();
                if (urlCountryCode && regionMap.has(urlCountryCode)) {
                    countryCode = urlCountryCode;
                }
                else if (vercelCountryCode && regionMap.has(vercelCountryCode)) {
                    countryCode = vercelCountryCode;
                }
                else if (regionMap.has(DEFAULT_REGION)) {
                    countryCode = DEFAULT_REGION;
                }
                else if (regionMap.keys().next().value) {
                    countryCode = regionMap.keys().next().value;
                }
                return [2 /*return*/, countryCode];
            }
            catch (error) {
                if (process.env.NODE_ENV === "development") {
                    console.error("Middleware.ts: Error getting the country code. Did you set up regions in your Medusa Admin and define a MEDUSA_BACKEND_URL environment variable? Note that the variable is no longer named NEXT_PUBLIC_MEDUSA_BACKEND_URL.");
                }
            }
            return [2 /*return*/];
        });
    });
}
function middleware(request) {
    return __awaiter(this, void 0, void 0, function () {
        var cacheIdCookie, urlSegment, looksLikeLocale, response, cacheId, regionMap, countryCode, _a, urlHasCountryCode, redirectPath, queryString, redirectUrl;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    // Short-circuit static assets
                    if (request.nextUrl.pathname.includes(".")) {
                        return [2 /*return*/, server_1.NextResponse.next()];
                    }
                    cacheIdCookie = request.cookies.get("_medusa_cache_id");
                    urlSegment = request.nextUrl.pathname.split("/")[1];
                    looksLikeLocale = /^[a-z]{2}$/i.test(urlSegment || "");
                    // Fast path: URL already has a locale segment and cache cookie exists
                    if (looksLikeLocale && cacheIdCookie) {
                        return [2 /*return*/, server_1.NextResponse.next()];
                    }
                    response = server_1.NextResponse.next();
                    cacheId = (cacheIdCookie === null || cacheIdCookie === void 0 ? void 0 : cacheIdCookie.value) || crypto.randomUUID();
                    if (!cacheIdCookie) {
                        response.cookies.set("_medusa_cache_id", cacheId, {
                            maxAge: 60 * 60 * 24
                        });
                    }
                    return [4 /*yield*/, getRegionMap(cacheId)];
                case 1:
                    regionMap = _b.sent();
                    _a = regionMap;
                    if (!_a) return [3 /*break*/, 3];
                    return [4 /*yield*/, getCountryCode(request, regionMap)];
                case 2:
                    _a = (_b.sent());
                    _b.label = 3;
                case 3:
                    countryCode = _a;
                    urlHasCountryCode = countryCode && request.nextUrl.pathname.split("/")[1].includes(countryCode);
                    // If no country code in URL but we can resolve one, redirect to locale-prefixed path
                    if (!urlHasCountryCode && countryCode) {
                        redirectPath = request.nextUrl.pathname === "/" ? "" : request.nextUrl.pathname;
                        queryString = request.nextUrl.search ? request.nextUrl.search : "";
                        redirectUrl = request.nextUrl.origin + "/" + countryCode + redirectPath + queryString;
                        return [2 /*return*/, server_1.NextResponse.redirect(redirectUrl, 307)];
                    }
                    return [2 /*return*/, response];
            }
        });
    });
}
exports.middleware = middleware;
exports.config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|images|assets|png|svg|jpg|jpeg|gif|webp).*)",
    ]
};
