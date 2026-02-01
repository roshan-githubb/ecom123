export function getOrderDisplayStatus(
  status: string,
  fulfillmentStatus: string
): string {
  
  if (status === "cancelled") {
    return "Cancelled"
  }

  if (status === "completed" && fulfillmentStatus === "delivered") {
    return "Delivered"
  }

  if (status === "pending") {
    switch (fulfillmentStatus) {
      case "fulfilled":
        return "Ready to Ship"
      case "shipped":
        return "Shipped"
      case "not_fulfilled":
        return "Pending"
      case "delivered":
        return "Delivered"
      default:
        return "Pending"
    }
  }

  return status.charAt(0).toUpperCase() + status.slice(1)
}

export function getOrderStatusColor(displayStatus: string): string {
  switch (displayStatus) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "Ready to Ship":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "Shipped":
      return "bg-green-100 text-green-800 border-green-200"
    case "Delivered":
      return "bg-green-100 text-green-800 border-green-200"
    case "Cancelled":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}
