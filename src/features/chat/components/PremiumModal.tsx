// src/features/chat/components/PremiumModal.tsx
import { useState } from "react";
import { Crown, X, Check, Clock, Lock, Zap, Loader2 } from "lucide-react";
import { resetCountdown } from "../hooks/usePremium";
import { useCreateTransaction, paymentKeys } from "@/app/api/payment/usePaymentApi";
import { useQueryClient } from "@tanstack/react-query";
import { useResetCountdown } from '../hooks/usePremium';

export type PremiumModalReason = "quota_limit" | "locked_topic";

interface Props {
  open: boolean;
  reason: PremiumModalReason;
  topicName?: string;
  onClose: () => void;
  onPaymentSuccess?: () => void;
}

const FEATURES = [
  { icon: Zap, text: "Penggunaan tanpa terbatas setiap hari" },
  { icon: Lock, text: "Akses semua fitur premium" },
  { icon: Crown, text: "Prioritas fitur eksklusif baru" },
];

declare global {
  interface Window {
    snap: {
      pay: (
        snapToken: string,
        options: {
          onSuccess?: (result: any) => void;
          onPending?: (result: any) => void;
          onError?: (result: any) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

export default function PremiumModal({ open, reason, topicName, onClose, onPaymentSuccess }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const createTransactionMutation = useCreateTransaction();
  const queryClient = useQueryClient();
  const countdown = useResetCountdown(); // ✅ hooks dulu semua

  // ✅ baru early return setelah semua hooks
  if (!open) return null;

  const isQuota = reason === "quota_limit";

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      const res = await createTransactionMutation.mutateAsync();
      const snapToken = (res as any).data?.data?.snap_token;
      if (!snapToken) throw new Error("Snap token tidak ditemukan");

      window.snap.pay(snapToken, {
        onSuccess: (result) => {
          console.log("Payment success:", result);
          queryClient.invalidateQueries({ queryKey: paymentKeys.status() });
          onPaymentSuccess?.();
          onClose();
        },
        onPending: () => {
          onClose();
          alert("Pembayaran sedang diproses. Premium akan aktif setelah terkonfirmasi.");
        },
        onError: () => {
          alert("Pembayaran gagal. Silakan coba lagi.");
        },
        onClose: () => { },
      });
    } catch (err) {
      console.error("Failed:", err);
      alert("Gagal membuat transaksi. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl pointer-events-auto overflow-hidden"
          style={{ animation: "premiumPop 0.35s cubic-bezier(0.34,1.56,0.64,1) both" }}
        >
          {/* Header gradient */}
          <div className="relative bg-gradient-to-br from-red-500 to-red-700 px-6 pt-8 pb-10 overflow-hidden">
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full" />
            <div className="absolute top-4 -right-2 w-16 h-16 bg-white/10 rounded-full" />
            <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors">
              <X className="w-4 h-4 text-white" />
            </button>
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
              <Crown className="w-8 h-8 text-yellow-300" />
            </div>
            <h2 className="text-white font-bold text-xl leading-tight mb-1">
              {isQuota ? "Batas Harian Tercapai" : "Fitur Premium"}
            </h2>
            <p className="text-red-100 text-sm leading-relaxed">
              {isQuota ? (
                <>Kamu sudah menggunakan <span className="text-white font-semibold">5 request</span> hari ini. Reset dalam <span className="text-white font-semibold">{countdown}</span> — atau upgrade sekarang.</>
              ) : (
                <>Topik <span className="text-white font-semibold">{topicName}</span> hanya tersedia untuk member Premium.</>
              )}
            </p>
          </div>

          {/* Price card */}
          <div className="relative -mt-5 mx-4 bg-white rounded-2xl shadow-lg px-5 py-4 mb-4">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-extrabold text-gray-900">Rp 80.000</span>
              <span className="text-gray-400 text-sm font-medium">/ 3 bulan</span>
            </div>
            <p className="text-xs text-gray-400">≈ Rp 26.700 per bulan · Bayar sekali, nikmati 3 bulan</p>
            <div className="border-t border-gray-100 my-3" />
            <ul className="space-y-2.5">
              {FEATURES.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="text-sm text-gray-700 font-medium">{text}</span>
                  <Check className="w-4 h-4 text-green-500 ml-auto flex-shrink-0" />
                </li>
              ))}
            </ul>
          </div>

          {isQuota && (
            <div className="mx-4 mb-4 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <p className="text-xs text-amber-700 font-medium">Atau tunggu reset gratis ({countdown} lagi)</p>
            </div>
          )}

          <div className="px-4 pb-6 flex flex-col gap-2.5">
            <button
              onClick={handleSubscribe}
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg shadow-red-200 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (<><Loader2 className="w-4 h-4 animate-spin" />Memproses...</>) : "Berlangganan Sekarang 🚀"}
            </button>
            <button onClick={onClose} className="w-full py-3 rounded-2xl text-sm text-gray-400 hover:text-gray-600 transition-colors">
              {isQuota ? "Nanti saja" : "Kembali"}
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes premiumPop { from { opacity: 0; transform: scale(0.88) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }`}</style>
    </>
  );
}