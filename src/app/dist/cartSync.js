"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var useCartStore_1 = require("@/store/useCartStore");
function CartSync(_a) {
    var children = _a.children;
    react_1.useEffect(function () {
        var syncCart = function (e) {
            if (e.key === "cart-store") {
                var newCart = JSON.parse(e.newValue || "[]");
                useCartStore_1.useCartStore.setState({ items: newCart });
            }
        };
        window.addEventListener("storage", syncCart);
        return function () { return window.removeEventListener("storage", syncCart); };
    }, []);
    return React.createElement(React.Fragment, null, children);
}
exports["default"] = CartSync;
