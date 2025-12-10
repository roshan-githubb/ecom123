// eSewa Configuration
export const ESEWA_CONFIG = {
  // Use sandbox URL for testing, production URL for live
  PAYMENT_URL: process.env.NODE_ENV === 'production' 
    ? 'https://epay.esewa.com.np/api/epay/main/v2/form'
    : 'https://rc-epay.esewa.com.np/api/epay/main/v2/form',
  
  MERCHANT_CODE: process.env.ESEWA_MERCHANT_CODE || 'EPAYTEST', // Use EPAYTEST for sandbox
  
  // Success and failure URLs - use localhost for development
  SUCCESS_URL: process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_BASE_URL + '/api/esewa/success'
    : 'http://localhost:3000/api/esewa/success',
  FAILURE_URL: process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_BASE_URL + '/api/esewa/failure' 
    : 'http://localhost:3000/api/esewa/failure',
}

export interface EsewaPaymentData {
  amount: number
  tax_amount?: number
  total_amount: number
  transaction_uuid: string
  product_code: string
  product_service_charge?: number
  product_delivery_charge?: number
  success_url: string
  failure_url: string
  signed_field_names: string
  signature: string
}