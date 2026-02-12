import { Card } from "@/components/atoms"
import { retrieveCustomer } from "@/lib/data/customer"
import { getRegion } from "@/lib/data/regions"

export const OrderAddresses = async ({ singleOrder }: { singleOrder: any }) => {
  const user = await retrieveCustomer()
  const region = await getRegion(singleOrder.shipping_address.country_code)

  if (!user) return null

  const shipping = singleOrder.shipping_address
  const billing = singleOrder.billing_address

  return (
    <Card className="space-y-5 px-4 py-4">
      {/* SHIPPING */}
      <div className="space-y-1.5">
        <h4 className="text-xs font-semibold text-secondary uppercase tracking-wide">
          Shipping address
        </h4>

        <div className="text-xs text-muted-foreground leading-relaxed">
          <p className="font-medium text-secondary">
            {shipping.first_name} {shipping.last_name}
          </p>

          <p>
            {shipping.address_1}, {shipping.city}
            {shipping.province ? `, ${shipping.province}` : ""}
          </p>

          <p>
            {region?.name ||
              shipping.country_code?.toUpperCase()}
          </p>

          <p>
            {shipping.phone || user.phone}
          </p>
        </div>
      </div>

      {/* BILLING */}
      <div className="space-y-1.5">
        <h4 className="text-xs font-semibold text-secondary uppercase tracking-wide">
          Billing address
        </h4>

        {billing?.id === shipping?.id ? (
          <p className="text-xs text-muted-foreground">
            Same as shipping address
          </p>
        ) : (
          <div className="text-xs text-muted-foreground leading-relaxed">
            <p className="font-medium text-secondary">
              {billing.first_name} {billing.last_name}
            </p>
            <p>
              {billing.address_1}, {billing.city}
            </p>
            <p>
              {billing.phone || user.phone}
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
