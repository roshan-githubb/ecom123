"use client"

import { Button } from "@/components/atoms"
import { HttpTypes } from "@medusajs/types"
import { ProductVariants } from "@/components/molecules"
import { getProductPrice } from "@/lib/helpers/get-product-price"
import { useState, useMemo } from "react"
import { addToCart } from "@/lib/data/cart"
import { toast } from "@/lib/helpers/toast"
import { useCartContext } from "@/components/providers"

const optionsAsKeymap = (
    variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
    return variantOptions?.reduce(
        (
            acc: Record<string, string>,
            varopt: HttpTypes.StoreProductOptionValue
        ) => {
            acc[varopt.option?.title.toLowerCase() || ""] = varopt.value
            return acc
        },
        {}
    )
}

export const ProductDetailsHeaderClient = ({
    product,
    locale,
}: {
    product: HttpTypes.StoreProduct
    locale: string
}) => {
    const { onAddToCart, cart } = useCartContext()
    const [isAdding, setIsAdding] = useState(false)
    const [selectedVariant, setSelectedVariant] = useState<Record<string, string>>({})

    const { cheapestVariant, cheapestPrice } = getProductPrice({
        product,
    })

    // Check if product has any valid prices in current region
    const hasAnyPrice = cheapestPrice !== null && cheapestVariant !== null

    // Initialize selected variant with cheapest variant
    const initialVariant = useMemo(() => {
        return hasAnyPrice
            ? {
                ...optionsAsKeymap(cheapestVariant.options ?? null),
            }
            : {}
    }, [hasAnyPrice, cheapestVariant])

    // Use initial variant if no selection has been made
    const currentVariant = Object.keys(selectedVariant).length > 0
        ? selectedVariant
        : initialVariant

    // get selected variant id
    const variantId =
        product.variants?.find(({ options }: { options: any }) =>
            options?.every((option: any) =>
                currentVariant[option.option?.title.toLowerCase() || ""]?.includes(
                    option.value
                )
            )
        )?.id || ""

    // get variant price
    const { variantPrice } = getProductPrice({
        product,
        variantId,
    })

    const variantStock =
        product.variants?.find(({ id }) => id === variantId)?.inventory_quantity ||
        0

    const variantHasPrice = !!product.variants?.find(({ id }) => id === variantId)
        ?.calculated_price

    const isVariantStockMaxLimitReached =
        (cart?.items?.find((item) => item.variant_id === variantId)?.quantity ??
            0) >= variantStock

    // Handle variant selection change
    const handleVariantChange = (optionTitle: string, value: string) => {
        setSelectedVariant(prev => ({
            ...prev,
            [optionTitle.toLowerCase()]: value
        }))
    }

    // add the selected variant to the cart
    const handleAddToCart = async () => {
        if (!variantId || !hasAnyPrice) return null

        setIsAdding(true)

        const subtotal = +(variantPrice?.calculated_price_without_tax_number || 0)
        const total = +(variantPrice?.calculated_price_number || 0)

        const storeCartLineItem = {
            thumbnail: product.thumbnail || "",
            product_title: product.title,
            quantity: 1,
            subtotal,
            total,
            tax_total: total - subtotal,
            variant_id: variantId,
            product_id: product.id,
            variant: product.variants?.find(({ id }) => id === variantId),
        }

        try {
            if (!isVariantStockMaxLimitReached) {
                onAddToCart(storeCartLineItem, variantPrice?.currency_code || "eur")
            }
            await addToCart({
                variantId: variantId,
                quantity: 1,
                countryCode: locale,
            })
            toast.success({
                title: "Added to cart",
                description: `${product.title} has been added to your cart`,
            })
        } catch (error) {
            toast.error({
                title: "Error adding to cart",
                description: "Some variant does not have the required inventory",
            })
        } finally {
            setIsAdding(false)
        }
    }

    return (
        <div className="border rounded-sm p-5">
            <div className="flex justify-between">
                <div>
                    <h2 className="label-md text-secondary">
                        {/* {product?.brand || "No brand"} */}
                    </h2>
                    <h1 className="heading-lg text-primary">{product.title}</h1>
                    <div className="mt-2 flex gap-2 items-center">
                        {hasAnyPrice && variantPrice ? (
                            <>
                                <span className="heading-md text-primary">
                                    {variantPrice.calculated_price}
                                </span>
                                {variantPrice.calculated_price_number !==
                                    variantPrice.original_price_number && (
                                        <span className="label-md text-secondary line-through">
                                            {variantPrice.original_price}
                                        </span>
                                    )}
                            </>
                        ) : (
                            <span className="label-md text-secondary pt-2 pb-4">
                                Not available in your region
                            </span>
                        )}
                    </div>
                </div>
            </div>
            {/* Product Variants */}
            {hasAnyPrice && (
                <ProductVariants
                    product={product}
                    selectedVariant={currentVariant}
                    onVariantChange={handleVariantChange}
                />
            )}
            {/* Add to Cart */}
            <Button
                onClick={handleAddToCart}
                disabled={!variantStock || !variantHasPrice || !hasAnyPrice}
                loading={isAdding}
                className="w-full uppercase mb-4 py-3 flex justify-center"
                size="large"
            >
                {!hasAnyPrice
                    ? "NOT AVAILABLE IN YOUR REGION"
                    : variantStock && variantHasPrice
                        ? "ADD TO CART"
                        : "OUT OF STOCK"}
            </Button>
        </div>
    )
}
