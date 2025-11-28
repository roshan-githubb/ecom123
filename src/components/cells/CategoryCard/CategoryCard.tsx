import { Card } from "@/components/atoms"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface ItemCategoryCardProps extends React.ComponentPropsWithoutRef<"div"> {
    imageUrl: string
    label: string
    shape?: "circle" | "rounded"
    height?: number
    width?: number
}

export const ItemCategoryCard = ({
    imageUrl,
    label,
    shape = "rounded",
    height,
    width,
    className,
    ...props
}: ItemCategoryCardProps) => {
    return (
        <Card
            className={cn(
                "border-none shadow-none flex flex-col items-center gap-2 p-0 bg-transparent",
                className
            )}
            {...props}
        >
            <div
                className={cn(
                    "overflow-hidden",
                    shape === "circle"
                        ? "rounded-full"
                        : "rounded-xl" // slightly rounded edges
                )}
                style={{ width: height?? 80, height: height?? 80 }}
            >
                <Image
                    src={imageUrl}
                    alt={label}
                    width={height?? 80}
                    height={height?? 80}
                    className="object-cover"
                />
            </div>

            <p className="text-[14px] font-medium text-center text-gray-600  dark:text-white">
                {label}
            </p>
        </Card>
    )
}
