// src/app/api/payment/paymentApi.ts
import { apiService } from '@/app/services/apiService';
import { ResponseApi } from '@/shared/types/api/type';
import type { CreateTransactionResponse, PaymentStatusResponse } from './type';

export const paymentApi = {
  /** Buat transaksi baru, dapat snap_token */
  createTransaction: () =>
    apiService.post<ResponseApi<CreateTransactionResponse>>('/core/v1/payment/create', {}),

  /** Cek status premium user yang sedang login */
  getStatus: () =>
    apiService.get<ResponseApi<PaymentStatusResponse>>('/core/v1/payment/status'),
};