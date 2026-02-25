import { analytics } from './config'
import { logEvent as firebaseLogEvent, Analytics } from 'firebase/analytics'

const addAppContext = (params?: Record<string, any>) => ({
  ...params,
  app_name: 'marketplace',
  app_type: 'b2c_storefront'
})

export const logPageView = (pagePath: string, pageTitle: string) => {
  if (!analytics) {
    console.warn('Analytics not initialized, skipping page_view')
    return
  }
  
  console.log('Logging page_view:', pagePath)
  firebaseLogEvent(analytics, 'page_view', addAppContext({
    page_path: pagePath,
    page_title: pageTitle,
  }))
}

export const logCustomEvent = (eventName: string, params?: Record<string, any>) => {
  if (!analytics) {
    console.warn('Analytics not initialized, skipping', eventName)
    return
  }
  
  console.log('Logging custom event:', eventName, params)
  firebaseLogEvent(analytics, eventName, addAppContext(params))
}

export const logAddToCart = (productId: string, productName: string, price: number) => {
  if (!analytics) {
    console.warn('Analytics not initialized, skipping add_to_cart')
    return
  }
  
  firebaseLogEvent(analytics, 'add_to_cart', addAppContext({
    currency: 'NPR',
    value: price,
    item_id: productId,
    item_name: productName,
    price: price,
    quantity: 1,
    items: [{
      item_id: productId,
      item_name: productName,
      price: price,
      quantity: 1,
    }]
  }))
}

export const logPurchase = (orderId: string, total: number, items: any[]) => {
  if (!analytics) {
    console.warn('Analytics not initialized, skipping purchase')
    return
  }
  
  
  const firstItem = items[0] || {}
  
  firebaseLogEvent(analytics as Analytics, 'purchase', addAppContext({
    transaction_id: orderId,
    value: total,
    currency: 'NPR',
    item_id: firstItem.item_id,
    item_name: firstItem.item_name,
    price: firstItem.price,
    quantity: firstItem.quantity,
    items: items,
  }) as any)
}

export const logViewProduct = (productId: string, productName: string, price: number) => {
  if (!analytics) {
    console.warn('Analytics not initialized, skipping view_item')
    return
  }
  
  firebaseLogEvent(analytics, 'view_item', addAppContext({
    currency: 'NPR',
    value: price,
    item_id: productId,
    item_name: productName,
    price: price,
    items: [{
      item_id: productId,
      item_name: productName,
      price: price,
    }]
  }))
}

export const logSearch = (searchTerm: string) => {
  if (!analytics) {
    console.warn('Analytics not initialized, skipping search')
    return
  }
  
  console.log('Logging search:', searchTerm)
  firebaseLogEvent(analytics, 'search', addAppContext({
    search_term: searchTerm,
  }))
}
