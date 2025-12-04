"use strict";
exports.__esModule = true;
exports.shouldHideStickyBar = exports.getCartItemCount = void 0;
function getCartItemCount(cart) {
    if (!cart || !cart.items || cart.items.length === 0) {
        return 0;
    }
    return cart.items.reduce(function (total, item) {
        return total + (item.quantity || 0);
    }, 0);
}
exports.getCartItemCount = getCartItemCount;
function shouldHideStickyBar(pathname) {
    if (!pathname) {
        return false;
    }
    var normalizedPath = pathname.toLowerCase();
    if (normalizedPath.includes("/cart")) {
        return true;
    }
    if (normalizedPath.includes("/checkout")) {
        return true;
    }
    if (normalizedPath.includes("/payment")) {
        return true;
    }
    return false;
}
exports.shouldHideStickyBar = shouldHideStickyBar;
