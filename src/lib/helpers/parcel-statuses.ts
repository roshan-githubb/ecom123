export const steps = ["Pending", "Ready to Ship", "Shipped", "Delivered"]

export const parcelStatuses = (
  fulfillmentStatus: "not_fulfilled" | "fulfilled" | "delivered" | "shipped"
) => {
  switch (fulfillmentStatus) {
    case "not_fulfilled":
      return 0 
    case "fulfilled":
      return 1 
    case "shipped":
      return 2 
    case "delivered":
      return 3 
    default:
      return 0
  }
}
