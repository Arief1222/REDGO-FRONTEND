// src/app/chat/components/EngineSubModeSelector.tsx

import { Lightbulb, BarChart2, ArrowLeft } from 'lucide-react';
import type { EngineSubMode } from '@/app/api/chat';

interface Props {
  onSubModeSelect: (subMode: EngineSubMode) => void;
  onBack: () => void;
}

export default function EngineSubModeSelector({ onSubModeSelect, onBack }: Props) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Kembali ke pilihan topik</span>
      </button>

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Pilih Jenis Panduan
        </h1>
        <p className="text-gray-600">
          Apakah Anda ingin memulai dari awal atau mengevaluasi yang sudah ada?
        </p>
      </div>

      {/* Sub-Mode Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* IDEA Card */}
        <button
          onClick={() => onSubModeSelect('idea')}
          className="group p-8 rounded-2xl border-2 border-gray-200 bg-white hover:border-blue-400 hover:shadow-xl hover:-translate-y-2 transition-all text-left"
        >
          {/* Icon */}
          <div className="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
            <Lightbulb className="w-8 h-8 text-blue-600" />
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            IDEA
          </h3>

          {/* Description */}
          <p className="text-gray-600 mb-4">
            Memulai dari awal untuk merencanakan strategi baru
          </p>

          {/* Features */}
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
              <span>Perencanaan dari nol</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
              <span>Strategi baru</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
              <span>Rekomendasi implementasi</span>
            </li>
          </ul>

          {/* Arrow Indicator */}
          <div className="mt-6 flex items-center text-blue-600 group-hover:translate-x-2 transition-transform">
            <span className="font-medium">Pilih IDEA</span>
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>

        {/* ANALYSIS Card */}
        <button
          onClick={() => onSubModeSelect('analysis')}
          className="group p-8 rounded-2xl border-2 border-gray-200 bg-white hover:border-green-400 hover:shadow-xl hover:-translate-y-2 transition-all text-left"
        >
          {/* Icon */}
          <div className="w-16 h-16 rounded-xl bg-green-50 flex items-center justify-center mb-6 group-hover:bg-green-100 transition-colors">
            <BarChart2 className="w-8 h-8 text-green-600" />
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            ANALYSIS
          </h3>

          {/* Description */}
          <p className="text-gray-600 mb-4">
            Evaluasi dan perbaikan strategi yang sudah berjalan
          </p>

          {/* Features */}
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5 flex-shrink-0"></div>
              <span>Audit performa saat ini</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5 flex-shrink-0"></div>
              <span>Identifikasi masalah</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5 flex-shrink-0"></div>
              <span>Rekomendasi optimasi</span>
            </li>
          </ul>

          {/* Arrow Indicator */}
          <div className="mt-6 flex items-center text-green-600 group-hover:translate-x-2 transition-transform">
            <span className="font-medium">Pilih ANALYSIS</span>
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
}