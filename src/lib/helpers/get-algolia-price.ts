import { convertToLocale } from "@/lib/helpers/money"

export const getAlgoliaPrice = (
  product: any,
  currency_code: string
) => {
  const variant = product.variants?.find((variant: any) =>
    variant.prices?.some(
      (price: any) => price.currency_code === currency_code
    ) || variant.calculated_price
  )

  if (!variant) return null

  if (variant.calculated_price) {
    return {
      calculated_price: convertToLocale({
        amount: variant.calculated_price.calculated_amount,
        currency_code: variant.calculated_price.currency_code,
      }),
      original_price: convertToLocale({
        amount: variant.calculated_price.original_amount,
        currency_code: variant.calculated_price.currency_code,
      }),
    }
  }

  const price = variant.prices?.find(
    (p: any) => p.currency_code === currency_code
  )

  if (!price?.amount) return null

  return {
    calculated_price: convertToLocale({
      amount: price.amount,
      currency_code,
    }),
    original_price: price.original_amount
      ? convertToLocale({
          amount: price.original_amount,
          currency_code,
        })
      : null,
  }
}
