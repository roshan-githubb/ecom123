export type PaymentMethod = "esewa" | "khalti";

export interface PaymentRequestData {
  amount: string;
  productName: string;
  transactionId: string;
  method: PaymentMethod;
}

export interface DummyDataResponse {
  amount: string;
  productName: string;
  transactionId: string;
}