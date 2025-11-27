// src/services/cart.ts

export function getLocalCartId(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("cart_id");
}

export function setLocalCartId(id: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem("cart_id", id);
}

export async function getOrCreateCartId() {
    let cartId = getLocalCartId();
    if (cartId) return cartId;

    const res = await fetch("/api/cart/create", {
        method: "POST",
    });

    const data = await res.json();

    cartId = data.cart.id;
    if (cartId) {
        setLocalCartId(cartId);
    }

    return cartId;
}

export async function addToServerCart(variantId: string, quantity = 1) {
    const cartId = await getOrCreateCartId();

    const res = await fetch("/api/cart/add", {
        method: "POST",
        body: JSON.stringify({
            cart_id: cartId,
            variant_id: variantId,
            quantity,
        }),
    });
    return res.json();
}

export async function updateCartItemQuantity(lineItemId: string, quantity: number) {
    const cartId = await getOrCreateCartId();
    
    console.log('line item id and quantity ', lineItemId, quantity)
    return fetch("/api/cart/update", {
        method: "POST",
        body: JSON.stringify({ cart_id: cartId ,line_item_id: lineItemId, quantity }),
    }).then(res => res.json());
}


export async function removeFromCart(lineItemId: string) {
    const cartId = getLocalCartId();
    if (!cartId) return null;

    const res = await fetch("/api/cart/remove", {
        method: "POST",
        body: JSON.stringify({
            cart_id: cartId,
            line_item_id: lineItemId,
        }),
    });

    return res.json();
}

export async function getCart() {
    const cartId = getLocalCartId();
    if (!cartId) return null;

    const res = await fetch("/api/cart/get", {
        method: "POST",
        body: JSON.stringify({
            cart_id: cartId,
        }),
    });
    const data = await res.json();

    console.log("Cart:", data);

    return data;
}
