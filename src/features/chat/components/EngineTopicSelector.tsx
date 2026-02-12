// src/app/chat/components/EngineTopicSelector.tsx

import { useState } from 'react';
import { 
  DollarSign, 
  Star, 
  TrendingUp, 
  Target, 
  Smartphone,
  FileText,
  ShoppingCart,
  BarChart3,
  Package
} from 'lucide-react';
import type { EngineTopic } from '@/app/api/chat';

interface Props {
  onTopicSelect: (topic: EngineTopic) => void;
}

const topicIcons: Record<EngineTopic, React.ReactNode> = {
  pricing: <DollarSign className="w-8 h-8" />,
  branding: <Star className="w-8 h-8" />,
  marketing: <TrendingUp className="w-8 h-8" />,
  positioning: <Target className="w-8 h-8" />,
  digital_marketing: <Smartphone className="w-8 h-8" />,
  content_plan: <FileText className="w-8 h-8" />,
  sales_system: <ShoppingCart className="w-8 h-8" />,
  market_analyst: <BarChart3 className="w-8 h-8" />,
  product_development: <Package className="w-8 h-8" />,
};

const topicNames: Record<EngineTopic, string> = {
  pricing: 'Pricing',
  branding: 'Branding',
  marketing: 'Marketing',
  positioning: 'Positioning',
  digital_marketing: 'Digital Marketing',
  content_plan: 'Content Plan',
  sales_system: 'Sales System',
  market_analyst: 'Market Analyst',
  product_development: 'Product Development',
};

const topicDescriptions: Record<EngineTopic, string> = {
  pricing: 'Strategi harga produk',
  branding: 'Identitas brand',
  marketing: 'Campaign & promosi',
  positioning: 'Posisi di pasar',
  digital_marketing: 'Strategi digital',
  content_plan: 'Rencana konten',
  sales_system: 'Sistem penjualan',
  market_analyst: 'Analisis pasar',
  product_development: 'Pengembangan produk',
};

export default function EngineTopicSelector({ onTopicSelect }: Props) {
  const [selectedTopic, setSelectedTopic] = useState<EngineTopic | null>(null);

  const topics: EngineTopic[] = [
    'pricing',
    'branding',
    'marketing',
    'positioning',
    'digital_marketing',
    'content_plan',
    'sales_system',
    'market_analyst',
    'product_development',
  ];

  const handleTopicClick = (topic: EngineTopic) => {
    setSelectedTopic(topic);
    // Small delay for visual feedback
    setTimeout(() => {
      onTopicSelect(topic);
    }, 200);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Pilih Topik yang Ingin Dibahas
        </h1>
        <p className="text-gray-600">
          Pilih salah satu dari 9 topik bisnis untuk mendapatkan panduan terstruktur
        </p>
      </div>

      {/* Topic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.map((topic) => (
          <button
            key={topic}
            onClick={() => handleTopicClick(topic)}
            className={`
              group relative p-6 rounded-2xl border-2 transition-all
              hover:border-red-400 hover:shadow-lg hover:-translate-y-1
              ${
                selectedTopic === topic
                  ? 'border-red-500 bg-red-50 shadow-lg -translate-y-1'
                  : 'border-gray-200 bg-white'
              }
            `}
          >
            {/* Icon */}
            <div className={`
              w-16 h-16 rounded-xl flex items-center justify-center mb-4
              transition-colors
              ${
                selectedTopic === topic
                  ? 'bg-red-600 text-white'
                  : 'bg-red-50 text-red-600 group-hover:bg-red-100'
              }
            `}>
              {topicIcons[topic]}
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {topicNames[topic]}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600">
              {topicDescriptions[topic]}
            </p>

            {/* Selected Indicator */}
            {selectedTopic === topic && (
              <div className="absolute top-4 right-4">
                <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}