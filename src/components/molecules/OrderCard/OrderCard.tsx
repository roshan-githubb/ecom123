import { Button } from "@/components/atoms"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import Image from "next/image"

interface OrderCardProps {
    order: {
        id: string
        displayId: string
        createdAt: string
        total: string
        status: string
        items: {
            id: string
            title: string
            thumbnail: string
            quantity: number
            price: string
        }[]
    }
}

export const OrderCard = ({ order }: OrderCardProps) => {
    return (
        <div className="border border-secondary rounded-sm bg-component overflow-hidden">
            <div className="bg-component-secondary p-4 border-b border-secondary flex flex-col md:flex-row justify-between gap-4 text-sm text-secondary">
                <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                    <div>
                        <span className="block text-xs uppercase font-medium">Order Placed</span>
                        <span className="text-primary">{order.createdAt}</span>
                    </div>
                    <div>
                        <span className="block text-xs uppercase font-medium">Total</span>
                        <span className="text-primary">{order.total}</span>
                    </div>
                    <div>
                        <span className="block text-xs uppercase font-medium">Ship To</span>
                        <span className="text-action hover:underline cursor-pointer">User Name</span>
                    </div>
                </div>
                <div className="flex flex-col items-start md:items-end">
                    <span className="block text-xs uppercase font-medium">Order # {order.displayId}</span>
                    <div className="flex gap-2 mt-1">
                        <LocalizedClientLink href={`/user/orders/${order.id}`} className="text-action hover:underline">
                            View Order Details
                        </LocalizedClientLink>
                        <span className="text-disabled">|</span>
                        <LocalizedClientLink href="#" className="text-action hover:underline">
                            Invoice
                        </LocalizedClientLink>
                    </div>
                </div>
            </div>

            <div className="p-4 md:p-6">
                <h3 className="heading-sm font-bold mb-2 text-primary">{order.status}</h3>
                {order.items.map((item) => (
                    <div key={item.id} className="flex flex-col md:flex-row gap-4 mb-6 last:mb-0">
                        <div className="flex-shrink-0">
                            <LocalizedClientLink href={`/products/${item.id}`}>
                                <div className="relative w-24 h-24 border border-secondary rounded-xs overflow-hidden">
                                    <Image
                                        src={item.thumbnail}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </LocalizedClientLink>
                        </div>
                        <div className="flex-grow">
                            <LocalizedClientLink href={`/products/${item.id}`} className="text-action hover:underline font-medium line-clamp-2">
                                {item.title}
                            </LocalizedClientLink>
                            <p className="text-sm text-secondary mt-1">Return window closed on 15 Jan 2024</p>
                            <div className="mt-2 flex gap-2">
                                <Button variant="tonal" className="h-8 px-3 text-xs">
                                    Buy it again
                                </Button>
                                <Button variant="tonal" className="h-8 px-3 text-xs">
                                    View your item
                                </Button>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 min-w-[200px]">
                            <Button className="w-full bg-myBlue text-white hover:bg-action-hover rounded-full">
                                Track package
                            </Button>
                            <Button variant="tonal" className="w-full border border-secondary rounded-full bg-transparent hover:bg-component-secondary">
                                Return or replace items
                            </Button>
                            <Button variant="tonal" className="w-full border border-secondary rounded-full bg-transparent hover:bg-component-secondary">
                                Write a product review
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="bg-component-secondary p-2 border-t border-secondary text-center md:text-left md:px-6">
                <span className="text-action text-sm font-medium cursor-pointer hover:underline">Archive Order</span>
            </div>
        </div>
    )
}
