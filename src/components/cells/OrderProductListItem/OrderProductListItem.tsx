import { Divider } from "@/components/atoms"
import { convertToLocale } from "@/lib/helpers/money"
import { cn } from "@/lib/utils"
import Image from "next/image"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { Fragment } from "react"

export const OrderProductListItem = ({
  item,
  currency_code,
  withDivider,
}: {
  item: any
  currency_code: string
  withDivider?: boolean
}) => (
  <Fragment>
    {withDivider && <Divider className="my-3" />}

    <li className="w-full list-none">
      <div className="flex gap-4 py-3">
        {/* IMAGE */}
        <div className="w-16 h-16 shrink-0 rounded-md overflow-hidden border bg-white flex items-center justify-center">
          <Image
            src={item.thumbnail || "/images/placeholder.svg"}
            alt={item.product_title}
            width={64}
            height={64}
            className={cn("object-cover", !item.thumbnail && "opacity-30")}
          />
        </div>

        {/* INFO */}
        <div className="flex-1 min-w-0 space-y-1">
          {/* PRODUCT TITLE AS LINK */}
          {item.variant?.product?.handle ? (
            <LocalizedClientLink
              href={`/products/${item.variant.product.handle}`}
              className="text-sm font-medium text-secondary hover:text-primary transition-colors line-clamp-2"
            >
              {item.product_title}
            </LocalizedClientLink>
          ) : (
            <p className="text-sm font-medium text-secondary line-clamp-2">
              {item.product_title}
            </p>
          )}

          {/* VARIANT */}
          {(item.variant_title || item.variant?.title) && (
            <p className="text-xs text-muted-foreground">
              {item.variant_title || item.variant?.title}
            </p>
          )}

          {/* QTY × UNIT PRICE */}
          <p className="text-xs text-muted-foreground">
            Qty {item.quantity} ×{" "}
            {convertToLocale({
              amount: item.unit_price,
              currency_code,
            })}
          </p>
        </div>

        {/* TOTAL */}
        <div className="flex items-center text-sm font-semibold text-primary whitespace-nowrap">
          {convertToLocale({
            amount: item.total,
            currency_code,
          })}
        </div>
      </div>
    </li>
  </Fragment>
)
