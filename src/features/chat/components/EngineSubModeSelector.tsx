import { useState } from "react";
import { Lightbulb, BarChart2, ArrowLeft, Lock } from "lucide-react";
import type { EngineSubMode, EngineTopic } from "@/app/api/chat";
import { usePaymentStatus } from "@/app/api/payment/usePaymentApi";
import { useAuth } from "@/app/auth";
import { isAdminRole } from "../hooks/usePremium";

// Topic yang HANYA punya sub-mode idea (tidak ada analysis card)
const IDEA_ONLY_TOPICS: EngineTopic[] = ["content_plan"];

// Topic yang fully locked — langsung blok masuk ke sub-mode selector
const FULLY_LOCKED_TOPICS: EngineTopic[] = [
  "product_development",
  "market_analyst",
  "content_plan",
];

// Topic yang hanya analysis-nya locked
const ANALYSIS_LOCKED_TOPICS: EngineTopic[] = [
  "marketing",
];

interface Props {
  selectedTopic: EngineTopic;
  onSubModeSelect: (subMode: EngineSubMode) => void;
  onBack: () => void;
  onLockedTopic?: () => void; // callback kalau topic fully locked
}

export default function EngineSubModeSelector({ selectedTopic, onSubModeSelect, onBack, onLockedTopic }: Props) {
  const showAnalysis = !IDEA_ONLY_TOPICS.includes(selectedTopic);
  const [selectedMode, setSelectedMode] = useState<EngineSubMode | null>(null);

  const { user } = useAuth();
  const { data: paymentStatus } = usePaymentStatus();
  const isPremium = paymentStatus?.is_premium ?? false;
  const isAdmin = isAdminRole(user?.role?.name);
  const bypassLock = isAdmin || isPremium;

  const isFullyLocked = !bypassLock && FULLY_LOCKED_TOPICS.includes(selectedTopic);
  const analysisLocked = !bypassLock && ANALYSIS_LOCKED_TOPICS.includes(selectedTopic);

  const handleSelect = (mode: EngineSubMode) => {
    setSelectedMode(mode);
    setTimeout(() => onSubModeSelect(mode), 200);
  };

  // ── Fully locked: tampilkan peringatan, bukan card sub-mode ──
  if (isFullyLocked) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali ke pilihan topik</span>
        </button>

        <div className="flex flex-col items-center justify-center text-center py-16 px-6">
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center">
              <Lock className="w-9 h-9 text-amber-400" strokeWidth={1.75} />
            </div>
            <div className="absolute -inset-1 rounded-2xl border border-amber-100" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Topik ini Khusus Premium
          </h2>
          <p className="text-gray-500 mb-2 max-w-sm">
            <span className="font-semibold text-gray-700">
              {selectedTopic === "product_development"
                ? "Product Development"
                : selectedTopic === "market_analyst"
                  ? "Market Analyst"
                  : "Content Plan"}
            </span>{" "}
            hanya tersedia untuk pengguna Premium.
          </p>
          <p className="text-gray-400 text-sm mb-8 max-w-xs">
            Upgrade sekarang untuk akses semua topik dan sub-mode tanpa batas.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onBack}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Pilih Topik Lain
            </button>
            <button
              onClick={onLockedTopic}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition-colors shadow-sm shadow-amber-200 flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Upgrade Premium
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Normal flow ──
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Kembali ke pilihan topik</span>
      </button>

      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Pilih Jenis Panduan</h1>
        <p className="text-gray-600">
          Apakah Anda ingin memulai dari awal atau mengevaluasi yang sudah ada?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* IDEA */}
        <button
          onClick={() => handleSelect("idea")}
          className={`
            group relative p-8 rounded-2xl border-2 transition-all text-left
            hover:border-blue-400 hover:shadow-xl hover:-translate-y-1
            ${selectedMode === "idea" ? "border-blue-500 bg-blue-50 shadow-lg -translate-y-1" : "border-gray-200 bg-white"}
          `}
        >
          {selectedMode === "idea" && (
            <div className="absolute top-4 right-4">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          )}
          <div className="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
            <Lightbulb className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">IDEA</h3>
          <p className="text-gray-600 mb-4">Memulai dari awal untuk merencanakan strategi baru</p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5" /><span>Perencanaan dari nol</span></li>
            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5" /><span>Strategi baru</span></li>
            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5" /><span>Rekomendasi implementasi</span></li>
          </ul>
          <div className="mt-6 flex items-center text-blue-600 group-hover:translate-x-1 transition-transform">
            <span className="font-medium">Pilih IDEA</span>
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>

        {/* ANALYSIS */}
        {showAnalysis && (
          <button
            onClick={() => handleSelect("analysis")}
            className={`
              group relative p-8 rounded-2xl border-2 transition-all text-left
              ${analysisLocked
                ? "border-amber-200 bg-amber-50/40 hover:border-amber-300 hover:shadow-md"
                : `hover:border-green-400 hover:shadow-xl hover:-translate-y-1
                   ${selectedMode === "analysis" ? "border-green-500 bg-green-50 shadow-lg -translate-y-1" : "border-gray-200 bg-white"}`
              }
            `}
          >
            {analysisLocked && (
              <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-amber-100 border border-amber-300 rounded-full px-2.5 py-1">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-xs font-semibold text-amber-700">Premium</span>
              </div>
            )}
            {!analysisLocked && selectedMode === "analysis" && (
              <div className="absolute top-4 right-4">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            )}
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-colors
              ${analysisLocked ? "bg-amber-100/60 group-hover:bg-amber-100" : "bg-green-50 group-hover:bg-green-100"}`}
            >
              {analysisLocked
                ? <Lock className="w-8 h-8 text-amber-400" />
                : <BarChart2 className="w-8 h-8 text-green-600" />
              }
            </div>
            <h3 className={`text-2xl font-bold mb-3 ${analysisLocked ? "text-gray-400" : "text-gray-900"}`}>
              ANALYSIS
            </h3>
            <p className={`mb-4 ${analysisLocked ? "text-gray-400" : "text-gray-600"}`}>
              {analysisLocked ? "Fitur ini tersedia untuk pengguna Premium" : "Evaluasi dan perbaikan strategi yang sudah berjalan"}
            </p>
            {analysisLocked ? (
              <div className="space-y-2 text-sm text-gray-400">
                {["Audit performa saat ini", "Identifikasi masalah", "Rekomendasi optimasi"].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <Lock className="w-3.5 h-3.5 mt-0.5 text-amber-300 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            ) : (
              <ul className="space-y-2 text-sm text-gray-600">
                {["Audit performa saat ini", "Identifikasi masalah", "Rekomendasi optimasi"].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
            <div className={`mt-6 flex items-center gap-2 transition-transform
              ${analysisLocked ? "text-amber-500" : "text-green-600 group-hover:translate-x-1"}`}
            >
              {analysisLocked
                ? <><Lock className="w-4 h-4" /><span className="font-medium text-sm">Upgrade untuk akses</span></>
                : <><span className="font-medium">Pilih ANALYSIS</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              }
            </div>
          </button>
        )}
      </div>
    </div>
  );
}