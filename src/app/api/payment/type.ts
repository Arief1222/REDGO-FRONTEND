// src/app/api/payment/type.ts

export interface CreateTransactionResponse {
  order_id: string;
  snap_token: string;
  snap_url: string;
  amount: number;
}

export interface PaymentStatusResponse {
  is_premium: boolean;
  premium_expires_at: string | null;
}