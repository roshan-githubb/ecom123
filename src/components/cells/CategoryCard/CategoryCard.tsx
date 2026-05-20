import { Card } from "@/components/atoms"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

interface ItemCategoryCardProps extends React.ComponentPropsWithoutRef<"div"> {
  link?: string
  imageUrl: string
  label: string
  shape?: "circle" | "rounded"
  height?: number
  width?: number
}

export const ItemCategoryCard = ({
  link,
  imageUrl,
  label,
  shape = "rounded",
  height,
  width,
  className,
  ...props
}: ItemCategoryCardProps) => {
  const Wrapper = link ? Link : "div"

  return (
    <Wrapper
      href={link ?? "#"}
      className="flex-col justify-center items-center"
    >
      <Card
        className={cn(
          "border-none shadow-none flex flex-col items-center gap-2 p-0 bg-transparent cursor-pointer transition-transform active:scale-95",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "relative overflow-hidden mx-auto bg-gray-100 flex items-center justify-center transition-opacity active:opacity-70",
            shape === "circle" ? "rounded-full" : "rounded-xl"
          )}
          style={{ width: height ?? 80, height: height ?? 80 }}
        >
          <Image
            src={imageUrl}
            alt={label}
            fill
            sizes="80px"
            className="cover"
          />
        </div>

        <p className="text-[14px] pt-2 font-medium text-center text-gray-600 dark:text-white">
          {label}
        </p>
      </Card>
    </Wrapper>
  )
}
