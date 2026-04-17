// src/features/chat/components/PremiumModal.tsx
import { useState } from "react";
import { Crown, X, Check, Lock, Zap, Loader2, LogIn, ChevronLeft } from "lucide-react";
import { useCreateTransaction, paymentKeys } from "@/app/api/payment/usePaymentApi";
import { useQueryClient } from "@tanstack/react-query";
import { useResetCountdown } from '../hooks/usePremium';

export type PremiumModalReason = "quota_limit" | "locked_topic";
type Step = "info" | "checkout";
type PaymentMethod = "qris" | "va";

interface Props {
  open: boolean;
  reason: PremiumModalReason;
  topicName?: string;
  mode?: string;
  onClose: () => void;
  onPaymentSuccess?: () => void;
}

const FEATURES = [
  { icon: Zap,   text: "Penggunaan tanpa batas setiap hari" },
  { icon: Lock,  text: "Akses semua fitur premium" },
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

export default function PremiumModal({ open, reason, topicName, mode, onClose, onPaymentSuccess }: Props) {
  const [step, setStep] = useState<Step>("info");
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("qris");
  const [isLoading, setIsLoading] = useState(false);

  const createTransactionMutation = useCreateTransaction();
  const queryClient = useQueryClient();
  const countdown = useResetCountdown(mode ?? "discuss");

  if (!open) return null;

  const isQuota = reason === "quota_limit";

  const handleClose = () => {
    setStep("info"); // reset step saat modal ditutup
    onClose();
  };

  const handlePay = async () => {
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
          handleClose();
        },
        onPending: () => {
          handleClose();
          alert("Pembayaran sedang diproses. Premium akan aktif setelah terkonfirmasi.");
        },
        onError: () => {
          alert("Pembayaran gagal. Silakan coba lagi.");
        },
        onClose: () => {},
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
      <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl pointer-events-auto overflow-hidden"
          style={{ animation: "premiumPop 0.35s cubic-bezier(0.34,1.56,0.64,1) both" }}
        >
          {step === "info" ? (
            // ─── Step 1: Info & Pricing ────────────────────────────────────
            <>
              {/* Header gradient */}
              <div className="relative bg-gradient-to-br from-red-500 to-red-700 px-6 pt-8 pb-10 overflow-hidden">
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full" />
                <div className="absolute top-4 -right-2 w-16 h-16 bg-white/10 rounded-full" />
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
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
                    <>
                      Kamu sudah mencapai{" "}
                      <span className="text-white font-semibold">batas percakapan</span> harian.
                      Tunggu dalam{" "}
                      <span className="text-white font-semibold">{countdown}</span> — atau upgrade sekarang.
                    </>
                  ) : (
                    <>
                      Topik <span className="text-white font-semibold">{topicName}</span> hanya
                      tersedia untuk member Premium.
                    </>
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

              <div className="px-4 pb-6 flex flex-col gap-2.5">
                <button
                  onClick={() => setStep("checkout")}
                  className="w-full py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg shadow-red-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  Berlangganan Sekarang
                </button>
                <button
                  onClick={handleClose}
                  className="w-full py-3 rounded-2xl text-sm text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {isQuota ? "Nanti saja" : "Kembali"}
                </button>
              </div>
            </>
          ) : (
            // ─── Step 2: Checkout / Pilih Metode Pembayaran ───────────────
            <>
              {/* Top bar */}
              <div className="flex items-center gap-3 px-5 pt-5 pb-2">
                <button
                  onClick={() => setStep("info")}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
                <h2 className="font-bold text-base text-gray-900 flex-1 text-center pr-8">
                  Checkout Premium Plan
                </h2>
              </div>

              {/* Price summary */}
              <div className="flex flex-col items-center py-5 px-6">
                <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-3">
                  <Crown className="w-7 h-7 text-red-600" />
                </div>
                <div className="text-3xl font-extrabold text-gray-900 tracking-tight">Rp 80.000</div>
                <div className="text-xs text-gray-400 mt-1">Durasi: 3 bulan</div>
              </div>

              <div className="border-t border-gray-100 mx-4" />

              {/* Payment methods */}
              <div className="px-4 pt-4 pb-2">
                <p className="text-xs text-gray-400 mb-3">Pilih metode pembayaran</p>

                {/* QRIS */}
                <div
                  onClick={() => setSelectedMethod("qris")}
                  className="flex items-center gap-3 border rounded-2xl px-4 py-3.5 cursor-pointer mb-2.5 transition-colors"
                  style={{ borderColor: selectedMethod === "qris" ? "#D93B2B" : "#E8E8E8", borderWidth: "1.5px" }}
                >
                  <RadioDot active={selectedMethod === "qris"} />
                  <div className="w-11 h-7 flex items-center justify-center flex-shrink-0">
                    <img src="/qris-logo.png" alt="QRIS" className="w-12 h-auto" />
                  </div>
                  <span className="text-sm font-medium text-gray-800">QRIS</span>
                </div>

                {/* Virtual Account */}
                <div
                  onClick={() => setSelectedMethod("va")}
                  className="flex items-center gap-3 border rounded-2xl px-4 py-3.5 cursor-pointer mb-2.5 transition-colors"
                  style={{ borderColor: selectedMethod === "va" ? "#D93B2B" : "#E8E8E8", borderWidth: "1.5px" }}
                >
                  <RadioDot active={selectedMethod === "va"} />
                  <div className="w-11 h-7 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-800">Virtual Account</span>
                </div>
              </div>

              {/* CTA */}
              <div className="px-4 pb-6 pt-2 flex flex-col gap-2">
                <button
                  onClick={handlePay}
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg shadow-red-200 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" />Memproses...</>
                  ) : (
                    <><LogIn className="w-4 h-4" />Bayar Sekarang</>
                  )}
                </button>
                <p className="text-center text-xs text-gray-400 leading-relaxed">
                  Pembayaran aman via Midtrans · Metode terpilih akan dikonfirmasi di halaman berikutnya.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes premiumPop {
          from { opacity: 0; transform: scale(0.88) translateY(20px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </>
  );
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function RadioDot({ active }: { active: boolean }) {
  return (
    <div
      style={{
        width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
        border: `2px solid ${active ? "#D93B2B" : "#ccc"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "border-color 0.15s",
      }}
    >
      {active && (
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#D93B2B" }} />
      )}
    </div>
  );
}