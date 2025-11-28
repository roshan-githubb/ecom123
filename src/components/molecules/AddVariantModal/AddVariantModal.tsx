"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { Modal } from "@/components/molecules"
import { Button } from "@/components/atoms"
import { useCartStore } from "@/store/useCartStore"
import toast from "react-hot-toast"

interface AddVariantModalProps {
    product: any;
    onClose: () => void;
}

export function AddVariantModal({ product, onClose }: AddVariantModalProps) {
    const colorOption = product?.options?.find(
        (opt: any) => opt.title.toLowerCase() === "color"
    )

    const colors =
        colorOption?.values?.map((v: any) => ({
            id: v.id,
            label: v.value,
        })) || []

    const sizes: string[] =
        product?.options
            ?.find((opt: any) => opt.title.toLowerCase() === "size")
            ?.values?.map((v: any) => String(v.value)) || []

    const [selectedColor, setSelectedColor] = useState(colors[0]?.label)
    const [selectedSize, setSelectedSize] = useState(sizes[0])

    // ---- Compute selected variant ----
    const selectedVariant = useMemo(() => {
        if (!product) return undefined
        return product.variants?.find((v: any) => {
            const colorMatch = selectedColor
                ? v.options.some((o: any) => o.value === selectedColor)
                : true

            const sizeMatch = selectedSize
                ? v.options.some((o: any) => o.value === selectedSize)
                : true

            return colorMatch && sizeMatch
        })
    }, [selectedColor, selectedSize, product?.variants])

    // ---- Add to cart ----
    const handleConfirm = async () => {
        if (!selectedVariant) {
            toast.error("Please choose a valid variant")
            return
        }

        try {
            await useCartStore.getState().add(selectedVariant.id, 1)
            toast.success("Added to cart")
            onClose()
        } catch {
            toast.error("Failed to add to cart")
        }
    }

    // ---- Early return if no product ----
    if (!product) return null

    return (
        <Modal heading="Choose Options" onClose={onClose}>
            <div className="space-y-6">
                {/* Product Preview */}
                <div className="flex gap-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                            src={product.images?.[0]?.url || "/images/not-available.png"}
                            alt={product.title}
                            width={96}
                            height={96}
                            className="object-cover w-full h-full"
                        />
                    </div>

                    <div className="flex-1">
                        <h3 className="font-medium text-[15px]">{product.title}</h3>
                    </div>
                </div>

                {/* COLORS */}
                {colors.length > 0 && (
                    <div>
                        <p className="font-medium mb-2 text-sm">Color</p>
                        <div className="flex flex-wrap gap-2">
                            {colors.map((c: any) => (
                                <button
                                    key={c.id}
                                    onClick={() => setSelectedColor(c.label)}
                                    className={`px-3 py-1 rounded-lg border text-sm ${selectedColor === c.label
                                        ? "border-blue-600 bg-blue-50"
                                        : "border-gray-300"
                                        }`}
                                >
                                    {c.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* SIZES */}
                {sizes.length > 0 && (
                    <div>
                        <p className="font-medium mb-2 text-sm">Size</p>
                        <div className="flex flex-wrap gap-2">
                            {sizes.map((s: string) => (
                                <button
                                    key={s}
                                    onClick={() => setSelectedSize(s)}
                                    className={`px-4 py-1 rounded-lg border text-sm uppercase ${selectedSize === s
                                        ? "border-blue-600 bg-blue-50"
                                        : "border-gray-300"
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Confirm Button */}
                <div className="pt-4 border-t flex justify-end">
                    <Button
                        disabled={!selectedVariant}
                        onClick={handleConfirm}
                        className="px-6 py-2 bg-blue-600 text-white rounded-full"
                    >
                        Add to Cart
                    </Button>
                </div>
            </div>
        </Modal>
    )
}
