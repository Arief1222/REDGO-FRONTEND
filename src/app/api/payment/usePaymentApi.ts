// src/app/api/payment/usePaymentApi.ts
import { useMutation, useQuery } from '@tanstack/react-query';
import { storageService } from '@/app/services/storageService';
import { paymentApi } from './paymentApi';

export const paymentKeys = {
  all: ['payment'] as const,
  status: () => [...paymentKeys.all, 'status'] as const,
};

/** Hook cek status premium dari backend */
export const usePaymentStatus = () => {
  const token = storageService.get<string>('token');
  return useQuery({
    queryKey: paymentKeys.status(),
    queryFn: () => paymentApi.getStatus(),
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // cache 5 menit
    select: (res) => res.data.data,
  });
};

/** Hook buat transaksi baru → dapat snap_token */
export const useCreateTransaction = () => {
  return useMutation({
    mutationFn: () => paymentApi.createTransaction(),
  });
};