'use server';
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
exports.POST = void 0;
var server_1 = require("next/server");
var uuid_1 = require("uuid");
var generateEsewaSignature_1 = require("@/lib/generateEsewaSignature");
function validateEnvironmentVariables() {
    var requiredEnvVars = [
        "NEXT_PUBLIC_BASE_URL",
        "NEXT_PUBLIC_ESEWA_MERCHANT_CODE",
        "NEXT_PUBLIC_ESEWA_SECRET_KEY",
        "NEXT_PUBLIC_KHALTI_SECRET_KEY",
    ];
    for (var _i = 0, requiredEnvVars_1 = requiredEnvVars; _i < requiredEnvVars_1.length; _i++) {
        var envVar = requiredEnvVars_1[_i];
        if (!process.env[envVar]) {
            throw new Error("Missing environment variable: " + envVar);
        }
    }
}
function POST(req) {
    return __awaiter(this, void 0, void 0, function () {
        var paymentData, amount, productName, transactionId, method, _a, transactionUuid, esewaConfig, signatureString, signature, khaltiConfig, response, errorData, khaltiResponse, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("Received POST request to /api/checkout-session");
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 11, , 12]);
                    validateEnvironmentVariables();
                    return [4 /*yield*/, req.json()];
                case 2:
                    paymentData = _b.sent();
                    amount = paymentData.amount, productName = paymentData.productName, transactionId = paymentData.transactionId, method = paymentData.method;
                    if (!amount || !productName || !transactionId || !method) {
                        console.error("Missing required fields:", paymentData);
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Missing required fields" }, { status: 400 })];
                    }
                    _a = method;
                    switch (_a) {
                        case "esewa": return [3 /*break*/, 3];
                        case "khalti": return [3 /*break*/, 4];
                    }
                    return [3 /*break*/, 9];
                case 3:
                    {
                        console.log("Initiating eSewa payment");
                        transactionUuid = Date.now() + "-" + uuid_1.v4();
                        esewaConfig = {
                            amount: amount,
                            tax_amount: "0",
                            total_amount: amount,
                            transaction_uuid: transactionUuid,
                            product_code: process.env.NEXT_PUBLIC_ESEWA_MERCHANT_CODE,
                            product_service_charge: "0",
                            product_delivery_charge: "0",
                            success_url: process.env.NEXT_PUBLIC_BASE_URL + "/success?method=esewa",
                            failure_url: "" + process.env.NEXT_PUBLIC_BASE_URL,
                            signed_field_names: "total_amount,transaction_uuid,product_code"
                        };
                        signatureString = "total_amount=" + esewaConfig.total_amount + ",transaction_uuid=" + esewaConfig.transaction_uuid + ",product_code=" + esewaConfig.product_code;
                        signature = generateEsewaSignature_1.generateEsewaSignature(process.env.NEXT_PUBLIC_ESEWA_SECRET_KEY, signatureString);
                        console.log("eSewa config:", __assign(__assign({}, esewaConfig), { signature: signature }));
                        return [2 /*return*/, server_1.NextResponse.json({
                                amount: amount,
                                esewaConfig: __assign(__assign({}, esewaConfig), { signature: signature, product_service_charge: Number(esewaConfig.product_service_charge), product_delivery_charge: Number(esewaConfig.product_delivery_charge), tax_amount: Number(esewaConfig.tax_amount), total_amount: Number(esewaConfig.total_amount) })
                            })];
                    }
                    _b.label = 4;
                case 4:
                    console.log("Initiating Khalti payment");
                    khaltiConfig = {
                        return_url: process.env.NEXT_PUBLIC_BASE_URL + "/success?method=khalti",
                        website_url: process.env.NEXT_PUBLIC_BASE_URL,
                        amount: Math.round(parseFloat(amount) * 100),
                        purchase_order_id: transactionId,
                        purchase_order_name: productName,
                        customer_info: {
                            name: "dai",
                            email: "dai@gmail.com",
                            phone: "9800000000"
                        }
                    };
                    return [4 /*yield*/, fetch("https://a.khalti.com/api/v2/epayment/initiate/", {
                            method: "POST",
                            headers: {
                                Authorization: "Key " + process.env.NEXT_PUBLIC_KHALTI_SECRET_KEY,
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(khaltiConfig)
                        })];
                case 5:
                    response = _b.sent();
                    if (!!response.ok) return [3 /*break*/, 7];
                    return [4 /*yield*/, response.json()];
                case 6:
                    errorData = _b.sent();
                    console.error("Khalti API Error:", errorData);
                    throw new Error("Khalti payment initiation failed: " + JSON.stringify(errorData));
                case 7: return [4 /*yield*/, response.json()];
                case 8:
                    khaltiResponse = _b.sent();
                    console.log("Khalti payment initiated:", khaltiResponse);
                    return [2 /*return*/, server_1.NextResponse.json({
                            khaltiPaymentUrl: khaltiResponse.payment_url
                        })];
                case 9:
                    console.error("Invalid payment method:", method);
                    return [2 /*return*/, server_1.NextResponse.json({ error: "Invalid payment method" }, { status: 400 })];
                case 10: return [3 /*break*/, 12];
                case 11:
                    err_1 = _b.sent();
                    console.error("Payment API Error:", err_1);
                    return [2 /*return*/, server_1.NextResponse.json({
                            error: "Error creating payment session",
                            details: err_1 instanceof Error ? err_1.message : "Unknown error"
                        }, { status: 500 })];
                case 12: return [2 /*return*/];
            }
        });
    });
}
exports.POST = POST;
