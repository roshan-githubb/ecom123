"use strict";
exports.__esModule = true;
exports.convertToLocale = void 0;
var isEmpty_1 = require("./isEmpty");
exports.convertToLocale = function (_a) {
    var amount = _a.amount, currency_code = _a.currency_code, _b = _a.minimumFractionDigits, minimumFractionDigits = _b === void 0 ? 0 : _b, _c = _a.maximumFractionDigits, maximumFractionDigits = _c === void 0 ? 0 : _c, _d = _a.locale, locale = _d === void 0 ? "en-US" : _d;
    return currency_code && !isEmpty_1.isEmpty(currency_code)
        ? new Intl.NumberFormat(locale, {
            style: "currency",
            currency: currency_code,
            minimumFractionDigits: minimumFractionDigits,
            maximumFractionDigits: maximumFractionDigits
        }).format(amount)
        : amount.toString();
};
