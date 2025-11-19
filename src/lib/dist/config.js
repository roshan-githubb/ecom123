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
exports.publicProductClient = exports.fetchQuery = exports.sdk = void 0;
var js_sdk_1 = require("@medusajs/js-sdk");
var MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
exports.sdk = new js_sdk_1["default"]({
    baseUrl: MEDUSA_BACKEND_URL,
    debug: process.env.NODE_ENV === "development",
    publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
});
function fetchQuery(url, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.method, method = _c === void 0 ? "GET" : _c, query = _b.query, headers = _b.headers, body = _b.body;
    return __awaiter(this, void 0, void 0, function () {
        var params, res, data, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    params = query
                        ? "?" +
                            Object.entries(query)
                                .filter(function (_a) {
                                var _ = _a[0], v = _a[1];
                                return v != null;
                            })
                                .map(function (_a) {
                                var k = _a[0], v = _a[1];
                                return k + "=" + v;
                            })
                                .join("&")
                        : "";
                    return [4 /*yield*/, fetch("" + MEDUSA_BACKEND_URL + url + params, {
                            method: method,
                            headers: __assign({ "Content-Type": "application/json", "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY }, headers),
                            body: body ? JSON.stringify(body) : null,
                            credentials: "include"
                        })];
                case 1:
                    res = _e.sent();
                    _e.label = 2;
                case 2:
                    _e.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, res.json()];
                case 3:
                    data = _e.sent();
                    return [3 /*break*/, 5];
                case 4:
                    _d = _e.sent();
                    data = { message: res.statusText };
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/, { ok: res.ok, status: res.status, data: data, error: res.ok ? null : data }];
            }
        });
    });
}
exports.fetchQuery = fetchQuery;
exports.publicProductClient = new js_sdk_1["default"]({
    baseUrl: MEDUSA_BACKEND_URL,
    publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
});
