import React, { useState } from 'react';
import { ArrowRight, Lightbulb, MessageCircle, Check, Loader2 } from 'lucide-react';
import type { DiagnosticData } from '@/app/api/chat';
import { chatApi } from '@/app/api/chat';

type DiagnosticFlowProps = {
  onComplete: (data: DiagnosticData) => void;
};

type Step = 'landing' | 'context' | 'signals' | 'perception' | 'analyzing' | 'diagnosis' | 'direction';

// Main Component
export default function DiagnosticFlow({ onComplete }: DiagnosticFlowProps) {
  const [step, setStep] = useState<Step>('landing');
  const [data, setData] = useState<DiagnosticData>({});
  const [analysis, setAnalysis] = useState<string>('');

  const updateData = (key: keyof DiagnosticData, value: string | string[]) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const handleComplete = () => {
    onComplete(data);
  };

  const renderStep = () => {
    switch (step) {
      case 'landing':
        return <LandingPage onStart={() => setStep('context')} onSkip={() => onComplete({})} />;
      case 'context':
        return <ContextStep data={data} updateData={updateData} onNext={() => setStep('signals')} />;
      case 'signals':
        return <SignalsStep data={data} updateData={updateData} onNext={() => setStep('perception')} />;
      case 'perception':
        return <PerceptionStep data={data} updateData={updateData} onNext={() => setStep('analyzing')} />;
      case 'analyzing':
        return <AnalyzingStep data={data} onComplete={(aiAnalysis) => {
          setAnalysis(aiAnalysis); // ✅ Save AI analysis
          setStep('diagnosis');
        }} />;
    case 'diagnosis':
        return <DiagnosisStep data={data} analysis={analysis} onNext={() => setStep('direction')} />;
      case 'direction':
        return <DirectionStep analysis={analysis} onNext={handleComplete} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {renderStep()}
    </div>
  );
}

// Landing Page
function LandingPage({ onStart, onSkip }: { onStart: () => void; onSkip: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Lightbulb className="w-4 h-4" />
            Mode: Find Your Problem
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            "Most founders don't have a solution problem. They have a misdiagnosis problem."
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Sebagian besar founder salah fokus saat menghadapi masalah bisnis.
            Ready akan bantu mencari apa yang sebenarnya bermasalah.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={onStart}
            className="w-full max-w-md mx-auto flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
          >
            Mulai Temukan
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={onSkip}
            className="w-full max-w-md mx-auto flex items-center justify-center gap-3 px-8 py-4 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all border-2 border-gray-200 font-medium"
          >
            <MessageCircle className="w-5 h-5" />
            Sudah tahu masalahnya? Langsung diskusi
          </button>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-4 text-left">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="text-sm font-semibold text-gray-900 mb-2">
              Diagnose business issues
            </div>
            <div className="text-sm text-gray-600">
              Not just answer questions
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="text-sm font-semibold text-gray-900 mb-2">
              Structured thinking
            </div>
            <div className="text-sm text-gray-600">
              Not random advice
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="text-sm font-semibold text-gray-900 mb-2">
              Built for founders
            </div>
            <div className="text-sm text-gray-600">
              Who are tired of guessing
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Context Step
type StepProps = {
  data: DiagnosticData;
  updateData: (key: keyof DiagnosticData, value: string | string[]) => void;
  onNext: () => void;
};

function ContextStep({ data, updateData, onNext }: StepProps) {
  const canProceed = data.businessStage && data.teamSize && data.position;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="mb-8">
          <div className="text-sm text-red-600 font-semibold mb-2">STEP 1 OF 4</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Konteks Bisnis</h2>
          <p className="text-gray-600">Ceritakan kondisi bisnis Anda saat ini</p>
        </div>

        <div className="space-y-8">
          <QuestionBlock
            number={1}
            question="Di tahap mana bisnis berjalan?"
            options={[
              "Baru mulai (≤ 6 bulan)",
              "> 6 bulan tapi belum stabil",
              "Stabil, tim bekerja sesuai, tapi stuck",
              "Tumbuh tapi terasa kacau",
              "Sedang menurun / banyak tekanan"
            ]}
            selected={data.businessStage}
            onSelect={(v: string) => updateData('businessStage', v)}
          />

          <QuestionBlock
            number={2}
            question="Berapa orang yang terlibat?"
            options={["Sendiri", "2–5 orang", "6–10 orang", "11–20 orang", "20 +"]}
            selected={data.teamSize}
            onSelect={(v: string) => updateData('teamSize', v)}
          />

          <QuestionBlock
            number={3}
            question="Mana yang menggambarkan posisi Anda saat ini?"
            options={[
              "Hampir semua masih dikerjakan sendiri",
              "Mengelola tim, tapi masih ikut eksekusi",
              "Fokus di pengambilan keputusan",
              "Terjebak urusan harian / pemadam kebakaran"
            ]}
            selected={data.position}
            onSelect={(v: string) => updateData('position', v)}
          />
        </div>

        <button
          onClick={onNext}
          disabled={!canProceed}
          className="mt-8 w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg font-semibold"
        >
          Lanjutkan
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// Signals Step
// Signals Step
function SignalsStep({ data, updateData, onNext }: StepProps) {
  const toggleChallenge = (challenge: string) => {
    const current = data.challenges || [];
    if (current.includes(challenge)) {
      updateData('challenges', current.filter((c: string) => c !== challenge));
    } else if (current.length < 3) {
      updateData('challenges', [...current, challenge]);
    }
  };

  const canProceed = (data.challenges?.length ?? 0) > 0 && data.situation;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="mb-8">
          <div className="text-sm text-red-600 font-semibold mb-2">STEP 2 OF 4</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Identifikasi Sinyal Masalah</h2>
          <p className="text-gray-600">Apa yang paling Anda rasakan?</p>
        </div>

        <div className="space-y-8">
          <div>
            <div className="text-lg font-semibold text-gray-900 mb-4">
              4. Yang paling melelahkan akhir-akhir ini (pilih maks. 3)
            </div>
            <div className="text-sm text-gray-500 mb-4">
              Dipilih: {data.challenges?.length ?? 0} / 3
            </div>
            <div className="space-y-2">
              {[
                "Penjualan tidak konsisten",
                "Tim perlu terus diawasi",
                "Terlalu banyak keputusan, tidak jelas prioritas",
                "Ada pendapatan, namun keuangan terasa ketat",
                "Semua terasa mendesak",
                "Bingung bagian yang perlu dibenahi terlebih dulu",
                "Banyak kerja, namun hasilnya kecil"
              ].map((challenge) => {
                const challenges = data.challenges ?? [];
                const isSelected = challenges.includes(challenge);
                const isDisabled = !isSelected && challenges.length >= 3;

                return (
                  <button
                    key={challenge}
                    onClick={() => toggleChallenge(challenge)}
                    disabled={isDisabled}
                    className={`w-full text-left px-5 py-4 rounded-xl transition-all border-2 ${
                      isSelected
                        ? 'bg-red-50 border-red-300 text-red-900'
                        : 'bg-white border-gray-200 hover:border-gray-300 text-gray-700'
                    } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        isSelected ? 'bg-red-600 border-red-600' : 'border-gray-300'
                      }`}>
                        {isSelected && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span className="font-medium">{challenge}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <QuestionBlock
            number={5}
            question="Mana yang menggambarkan situasi bisnis saat ini?"
            options={[
              "Tim sudah kerja keras, tapi hasil tidak sebanding",
              "Masalah yang sama terus terulang",
              "Bisnis bertumbuh, namun menambah masalah internal",
              "Takut salah ambil keputusan",
              "Saya merasa jadi bottleneck bisnis"
            ]}
            selected={data.situation}
            onSelect={(v: string) => updateData('situation', v)}
          />
        </div>

        <button
          onClick={onNext}
          disabled={!canProceed}
          className="mt-8 w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg font-semibold"
        >
          Lanjutkan
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// Perception Step
function PerceptionStep({ data, updateData, onNext }: StepProps) {
  const canProceed = data.perceivedProblem && data.confidence;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="mb-8">
          <div className="text-sm text-red-600 font-semibold mb-2">STEP 3 OF 4</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Persepsi Anda</h2>
          <p className="text-gray-600">Menurut Anda, apa masalah utamanya?</p>
        </div>

        <div className="space-y-8">
          <QuestionBlock
            number={6}
            question="Menurut Anda, apa yang saat ini menjadi masalah utama?"
            options={[
              "Penjualan / pemasaran",
              "Tim / kepemimpinan",
              "Operasional / sistem kerja",
              "Keuangan / arus kas",
              "Strategi / arah bisnis",
              "Jujur, saya belum tahu"
            ]}
            selected={data.perceivedProblem}
            onSelect={(v: string) => updateData('perceivedProblem', v)}
          />

          <QuestionBlock
            number={7}
            question="Seberapa yakin dengan jawaban no.6?"
            options={[
              "Sangat yakin",
              "Cukup yakin",
              "Tidak yakin sama sekali"
            ]}
            selected={data.confidence}
            onSelect={(v: string) => updateData('confidence', v)}
          />
        </div>

        <button
          onClick={onNext}
          disabled={!canProceed}
          className="mt-8 w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg font-semibold"
        >
          Selesai & Analisis
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// Analyzing Step
function AnalyzingStep({ data, onComplete }: { 
  data: DiagnosticData; 
  onComplete: (analysis: string) => void 
}) {
  const [error, setError] = useState<string>('');

  React.useEffect(() => {
    const analyze = async () => {
      try {
        // Call AI analysis API
        const response = await chatApi.analyzeDiagnostic({
          session_id: crypto.randomUUID(), // Temporary, akan di-set nanti
          business_stage: data.businessStage || '',
          team_size: data.teamSize || '',
          position: data.position || '',
          challenges: data.challenges || [],
          situation: data.situation || '',
          perceived_problem: data.perceivedProblem || '',
          confidence: data.confidence || '',
        });

        // Wait minimum 2 seconds untuk UX
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        onComplete(response.data.analysis);
      } catch (err) {
        console.error('Analysis error:', err);
        setError('Gagal menganalisis. Mencoba lagi...');
        
        // Retry after 1 second
        setTimeout(() => analyze(), 1000);
      }
    };

    analyze();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center">
        <Loader2 className="w-16 h-16 text-red-600 mx-auto mb-6 animate-spin" />
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          {error || 'Menganalisis jawaban Anda...'}
        </h2>
        <p className="text-gray-600">
          AI sedang menyimpulkan pola dari informasi yang Anda berikan
        </p>
      </div>
    </div>
  );
}

// Diagnosis Step
type DiagnosisStepProps = {
  data: DiagnosticData;
  onNext: () => void;
};

function DiagnosisStep({ data, analysis, onNext }: { 
  data: DiagnosticData; 
  analysis: string; 
  onNext: () => void 
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="mb-8">
          <div className="text-sm text-red-600 font-semibold mb-2">DIAGNOSIS</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Temuan Awal</h2>
        </div>

        <div className="bg-white border-2 border-red-200 rounded-2xl p-8 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Berdasarkan jawaban Anda...
              </h3>
              {/* ✅ SHOW AI ANALYSIS */}
              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                {analysis}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onNext}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-lg font-semibold"
        >
          Lanjut ke Arahan
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// Direction Step
function DirectionStep({ analysis, onNext }: { 
  analysis: string; 
  onNext: () => void 
}) {
  // Extract focus area from analysis (simple approach)
  const getFocusArea = () => {
    if (analysis.toLowerCase().includes('prioritas')) return 'prioritas dan kerangka pengambilan keputusan';
    if (analysis.toLowerCase().includes('tim')) return 'struktur tim dan kepemimpinan';
    if (analysis.toLowerCase().includes('sistem')) return 'sistem operasional';
    if (analysis.toLowerCase().includes('strategi')) return 'strategi bisnis';
    return 'area yang paling berpengaruh saat ini';
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="mb-8">
          <div className="text-sm text-red-600 font-semibold mb-2">ARAHAN</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Langkah Selanjutnya</h2>
          <p className="text-xl text-gray-700 leading-relaxed">
            "Kita akan mulai dengan fokus pada <span className="font-bold text-red-700">{getFocusArea()}</span>, 
            karena area ini memiliki pengaruh terbesar saat ini."
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={onNext}
            className="w-full flex items-center justify-between px-6 py-5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                🔍
              </div>
              <div className="text-left">
                <div className="font-semibold">Mengurai masalah ini lebih dalam</div>
                <div className="text-sm text-red-100">Eksplorasi akar penyebab</div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={onNext}
            className="w-full flex items-center justify-between px-6 py-5 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:border-gray-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                🧭
              </div>
              <div className="text-left">
                <div className="font-semibold">Menentukan prioritas yang perlu dibenahi</div>
                <div className="text-sm text-gray-500">Buat action plan</div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
// Reusable Question Block Component
type QuestionBlockProps = {
  number: number;
  question: string;
  options: string[];
  selected?: string;
  onSelect: (option: string) => void;
};

function QuestionBlock({ number, question, options, selected, onSelect }: QuestionBlockProps) {
  return (
    <div>
      <div className="text-lg font-semibold text-gray-900 mb-4">
        {number}. {question}
      </div>
      <div className="space-y-2">
        {options.map((option: string) => (
          <button
            key={option}
            onClick={() => onSelect(option)}
            className={`w-full text-left px-5 py-4 rounded-xl transition-all border-2 ${
              selected === option
                ? 'bg-red-50 border-red-300 text-red-900'
                : 'bg-white border-gray-200 hover:border-gray-300 text-gray-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selected === option ? 'bg-red-600 border-red-600' : 'border-gray-300'
              }`}>
                {selected === option && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              <span className="font-medium">{option}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}