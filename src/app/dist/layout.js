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
exports.metadata = void 0;
var google_1 = require("next/font/google");
require("./globals.css");
var ui_1 = require("@medusajs/ui");
var head_1 = require("next/head");
var cart_1 = require("@/lib/data/cart");
var providers_1 = require("./providers");
// Existing Funnel_Display font (optional, still available)
var funnelDisplay = google_1.Funnel_Display({
    variable: "--font-funnel-sans",
    subsets: ["latin"],
    weight: ["300", "400", "500", "600"]
});
// Poppins font for global use
var poppins = google_1.Poppins({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-poppins"
});
exports.metadata = {
    title: {
        template: "%s | " + (process.env.NEXT_PUBLIC_SITE_NAME ||
            "Saransa - Marketplace Storefront"),
        "default": process.env.NEXT_PUBLIC_SITE_NAME ||
            "Saransa - Marketplace Storefront"
    },
    description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
        "Saransa - Marketplace Storefront",
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
    alternates: {
        languages: {
            "x-default": process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        }
    }
};
function RootLayout(_a) {
    var _b;
    var children = _a.children, params = _a.params;
    return __awaiter(this, void 0, void 0, function () {
        var locale, cart, mappedCart, ALGOLIA_APP, htmlLang;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, params];
                case 1:
                    locale = (_c.sent()).locale;
                    return [4 /*yield*/, cart_1.retrieveCart()
                        // Fix TypeScript type mismatch by mapping StoreCart to expected Cart type
                    ];
                case 2:
                    cart = _c.sent();
                    mappedCart = cart
                        ? __assign(__assign({}, cart), { promotions: ((_b = cart.promotions) !== null && _b !== void 0 ? _b : []).map(function (promo) {
                                var _a;
                                return (__assign(__assign({}, promo), { created_at: promo.created_at || new Date().toISOString(), updated_at: promo.updated_at || new Date().toISOString(), deleted_at: (_a = promo.deleted_at) !== null && _a !== void 0 ? _a : null }));
                            }) }) : null;
                    ALGOLIA_APP = process.env.NEXT_PUBLIC_ALGOLIA_ID;
                    htmlLang = locale || "en";
                    return [2 /*return*/, (React.createElement("html", { lang: htmlLang, className: poppins.variable },
                            React.createElement(head_1["default"], null,
                                React.createElement("link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" }),
                                React.createElement("link", { rel: "preconnect", href: "https://fonts.gstatic.com" }),
                                React.createElement("link", { rel: "preconnect", href: "https://fonts.googleapis.com", crossOrigin: "anonymous" }),
                                React.createElement("link", { rel: "dns-prefetch", href: "https://fonts.googleapis.com" }),
                                React.createElement("link", { rel: "preconnect", href: "https://i.imgur.com", crossOrigin: "anonymous" }),
                                React.createElement("link", { rel: "dns-prefetch", href: "https://i.imgur.com" }),
                                ALGOLIA_APP && (React.createElement(React.Fragment, null,
                                    React.createElement("link", { rel: "preconnect", href: "https://algolia.net", crossOrigin: "anonymous" }),
                                    React.createElement("link", { rel: "preconnect", href: "https://algolianet.com", crossOrigin: "anonymous" }),
                                    React.createElement("link", { rel: "dns-prefetch", href: "https://algolia.net" }),
                                    React.createElement("link", { rel: "dns-prefetch", href: "https://algolianet.com" }))),
                                React.createElement("link", { rel: "preconnect", href: "https://medusa-public-images.s3.eu-west-1.amazonaws.com", crossOrigin: "anonymous" }),
                                React.createElement("link", { rel: "dns-prefetch", href: "https://medusa-public-images.s3.eu-west-1.amazonaws.com" }),
                                React.createElement("link", { rel: "preconnect", href: "https://mercur-connect.s3.eu-central-1.amazonaws.com", crossOrigin: "anonymous" }),
                                React.createElement("link", { rel: "dns-prefetch", href: "https://mercur-connect.s3.eu-central-1.amazonaws.com" }),
                                React.createElement("link", { rel: "preconnect", href: "https://s3.eu-central-1.amazonaws.com", crossOrigin: "anonymous" }),
                                React.createElement("link", { rel: "dns-prefetch", href: "https://s3.eu-central-1.amazonaws.com" }),
                                React.createElement("link", { rel: "preconnect", href: "https://api.mercurjs.com", crossOrigin: "anonymous" }),
                                React.createElement("link", { rel: "dns-prefetch", href: "https://api.mercurjs.com" })),
                            React.createElement("body", { className: poppins.variable + " antialiased bg-primary text-secondary relative" },
                                React.createElement(providers_1.Providers, { cart: mappedCart }, children),
                                React.createElement(ui_1.Toaster, { position: "top-right" }))))];
            }
        });
    });
}
exports["default"] = RootLayout;
