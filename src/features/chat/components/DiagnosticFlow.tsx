import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Lightbulb, MessageCircle, Check, Loader2 } from 'lucide-react';
import type { DiagnosticData } from '@/app/api/chat';
import { chatApi } from '@/app/api/chat';
import { motion, AnimatePresence } from "framer-motion";

type DiagnosticFlowProps = {
  onComplete: (data: DiagnosticData, choice: 'explore' | 'skip', arahan: string) => void;
};

type Step = 'landing' | 'context' | 'signals' | 'perception' | 'analyzing' | 'diagnosis' | 'direction';

const STEP_ORDER: Step[] = ['landing', 'context', 'signals', 'perception', 'analyzing', 'diagnosis', 'direction'];

export default function DiagnosticFlow({ onComplete }: DiagnosticFlowProps) {
  const [step, setStep] = useState<Step>('landing');
  const [data, setData] = useState<DiagnosticData>({});
  const [diagnosis, setDiagnosis] = useState<string>('');
  const [arahan, setArahan] = useState<string>('');

  const updateData = (key: keyof DiagnosticData, value: string | string[]) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  // ✅ Kembali = selalu ke landing
  const goToLanding = () => setStep('landing');



  // ✅ Sebelumnya = satu step ke belakang (hanya page 2,3,4)
  const goPrev = () => {
    if (step === 'diagnosis') {
      setStep('perception');
    } else {
      const idx = STEP_ORDER.indexOf(step);
      if (idx > 0) setStep(STEP_ORDER[idx - 1]);
    }
  };

  const handleComplete = (choice: 'explore' | 'skip') => {
    onComplete(data, choice, arahan);
  };

  const renderStep = () => {
    switch (step) {
      case 'landing':
        return <LandingPage onStart={() => setStep('context')} onSkip={() => onComplete({}, 'skip', '')} />;

      case 'context':
        return (
          <StepShell
            label="STEP 1 OF 4" title="Konteks Bisnis" subtitle="Ceritakan kondisi bisnis Anda saat ini"
            onBack={goToLanding} showPrev={false} onPrev={goPrev}
            onNext={() => setStep('signals')} canNext={!!(data.businessStage && data.teamSize && data.position)} nextLabel="Lanjutkan"
          >
            <QuestionBlock number={1} question="Di tahap mana bisnis berjalan?"
              options={["Baru mulai berjalan (≤ 6 bulan)", "> 6 bulan tetapi belum stabil", "Sudah stabil, namun pertumbuhan melambat", "Sedang bertumbuh, tetapi terasa sulit dikendalikan", "Sedang mengalami penurunan atau tekanan yang signifikan"]}
              selected={data.businessStage} onSelect={v => updateData('businessStage', v)} />
            <QuestionBlock number={2} question="Berapa orang yang terlibat?"
              options={["Sendiri", "2–5 orang", "6–10 orang", "11–20 orang", "Lebih dari 20 orang"]}
              selected={data.teamSize} onSelect={v => updateData('teamSize', v)} />
            <QuestionBlock number={3} question="Mana yang menggambarkan posisi Anda saat ini?"
              options={["Sebagian besar operasional masih dikerjakan sendiri", "Mengelola tim, tetapi masih ikut serta dalam eksekusi", "Berfokus pada pengambilan keputusan dan arah bisnis", "Sistem seting bermasalah dan harus ikut turun tangan masalah harian"]}
              selected={data.position} onSelect={v => updateData('position', v)} />
          </StepShell>
        );

      case 'signals':
        return (
          <StepShell
            label="STEP 2 OF 4" title="Identifikasi Sinyal Masalah" subtitle="Apa yang paling Anda rasakan?"
            onBack={goToLanding} showPrev={true} onPrev={goPrev}
            onNext={() => setStep('perception')} canNext={!!((data.challenges?.length ?? 0) > 0 && data.situation)} nextLabel="Lanjutkan"
          >
            <SignalQuestions data={data} updateData={updateData} />
          </StepShell>
        );

      case 'perception':
        return (
          <StepShell
            label="STEP 3 OF 4" title="Persepsi Anda" subtitle="Menurut Anda, apa masalah utamanya?"
            onBack={goToLanding} showPrev={true} onPrev={goPrev}
            onNext={() => setStep('analyzing')} canNext={!!(data.perceivedProblem && data.confidence)} nextLabel="Selesai & Analisis"
          >
            <QuestionBlock number={6} question="Menurut Anda, apa yang saat ini menjadi masalah utama?"
              options={["Penjualan / pemasaran", "Struktur tim & kemampuan eksekusi", "Beban pengambilan keputusan pada saya", "Operasional / alur kerja yang tidak stabil", "Keuangan / arus kas", "Arah / prioritas bisnis", "Hasil kerja tidak sebanding dengan upaya","Belum dapat mengidentifikasinya dengan jelas"]}
              selected={data.perceivedProblem} onSelect={v => updateData('perceivedProblem', v)} />
            {data.perceivedProblem && (
              <QuestionBlock number={7} question="Seberapa yakin dengan jawaban no.6?"
                options={["Sangat yakin", "Cukup yakin", "Tidak yakin sama sekali"]}
                selected={data.confidence} onSelect={v => updateData('confidence', v)} />
            )}
          </StepShell>
        );

      case 'analyzing':
        return <AnalyzingStep data={data} onComplete={(aiAnalysis) => {
          const parsed = parseAnalysis(aiAnalysis);
          setDiagnosis(parsed.diagnosis);
          setArahan(parsed.arahan);
          setStep('diagnosis');
        }} />;

      case 'diagnosis':
        return (
          <StepShell
            label="STEP 4 OF 4" title="Temuan Awal" subtitle=""
            onBack={goToLanding} showPrev={true} onPrev={goPrev}
            onNext={() => setStep('direction')} canNext={true} nextLabel="Lanjut ke Arahan"
          >
            <div className="bg-white dark:bg-gray-800 border-2 border-red-200 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-3">Berdasarkan jawaban Anda...</h3>
                  <div className="prose prose-sm max-w-none">{formatAIResponse(diagnosis)}</div>
                </div>
              </div>
            </div>
          </StepShell>
        );

      case 'direction':
        return <DirectionStep arahan={arahan} onNext={handleComplete} onBack={goToLanding} />;

      default:
        return null;
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  );

  // ✅ StepShell — layout wrapper untuk semua step kecuali landing & direction
  function StepShell({
    label, title, subtitle, children,
    onBack, showPrev, onPrev, onNext, canNext, nextLabel,
  }: {
    label: string; title: string; subtitle: string; children: React.ReactNode;
    onBack: () => void; showPrev: boolean; onPrev: () => void;
    onNext: () => void; canNext: boolean; nextLabel: string;
  }) {
    return (
      <div className="min-h-full px-4 py-8">
        <div className="max-w-2xl w-full mx-auto">

          {/* ✅ Tombol Kembali ke landing — kiri atas, semua page */}
          <button
            onClick={onBack}
            type="button"
            className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors text-sm mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>

          {/* Header */}
          <div className="mb-6">
            <div className="text-xs text-red-600 font-semibold mb-1 uppercase tracking-wide">{label}</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{title}</h2>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>

          {/* Content */}
          <div className="space-y-6">
            {children}
          </div>

          {/* ✅ Bottom nav — Sebelumnya (kiri, page 2-4) + tombol utama (kanan) */}
          <div className="mt-8 flex gap-3">
            {showPrev && (
              <button
                onClick={onPrev}
                type="button"
                className="flex items-center justify-center gap-2 px-5 py-3.5 bg-white dark:bg-gray-800 border-2 border-gray-200 text-gray-600 rounded-xl hover:border-gray-300 hover:text-gray-800 transition-all font-medium text-sm whitespace-nowrap"
              >
                <ArrowLeft className="w-4 h-4" />
                Sebelumnya
              </button>
            )}
            <button
              onClick={onNext}
              disabled={!canNext}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md font-semibold text-sm"
            >
              {nextLabel}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    );
  }

  // Signal questions
  function SignalQuestions({ data, updateData }: {
    data: DiagnosticData;
    updateData: (key: keyof DiagnosticData, value: string | string[]) => void;
  }) {
    const toggleChallenge = (challenge: string) => {
      const current = data.challenges || [];
      if (current.includes(challenge)) {
        updateData('challenges', current.filter(c => c !== challenge));
      } else if (current.length < 3) {
        updateData('challenges', [...current, challenge]);
      }
    };

    return (
      <>
        <div>
          <div className="text-base font-semibold text-gray-900 mb-1">
            4. Yang paling melelahkan akhir-akhir ini{' '}
            <span className="text-gray-400 font-normal text-sm">(pilih maks. 3)</span>
          </div>
          <div className="text-xs text-gray-400 mb-3">Dipilih: {data.challenges?.length ?? 0} / 3</div>
          <div className="space-y-2">
            {[
              "Pendapatan tidak konsisten dan sulit diprediksi",
              "Tim belum bisa bekerja mandiri tanpa banyak arahan",
              "Terlalu banyak keputusan yang harus ditangani sendiri",
              "Ada uang masuk, namun ruang gerak terasa sempit",
              "Masalah yang sama terus berulang",
              "Sulit menentukan mana yang harus diprioritaskan terlebih dulu",
              "Upaya yang dikeluarkan terasa tidak sebanding dengan hasil"
            ].map(challenge => {
              const isSelected = (data.challenges ?? []).includes(challenge);
              const isDisabled = !isSelected && (data.challenges?.length ?? 0) >= 3;
              return (
                <button
                  key={challenge}
                  onClick={() => toggleChallenge(challenge)}
                  disabled={isDisabled}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all border-2 text-sm
                  ${isSelected ? 'bg-red-50 border-red-300 text-red-900' : 'bg-white dark:bg-gray-800 border-gray-200 hover:border-gray-300 text-gray-700'}
                  ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-red-600 border-red-600' : 'border-gray-300'}`}>
                      {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
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
          options={["Tim bekerja keras, tetapi hasil belum sebanding dengan upaya", "Setiap ada peningkatan, muncul tekanan atau kendala baru", "Bisnis bertumbuhn, namun koordinasi dan kontrol semakin sulit","Banyak keputusan penting bergantung pada saya", "Arah dan prioritas bisnis sering berubah atau tidak konsisten"]}
          selected={data.situation}
          onSelect={v => updateData('situation', v)}
        />
      </>
    );
  }

  function parseAnalysis(raw: string): { diagnosis: string; arahan: string } {
    const diagnosisMatch = raw.match(/\[DIAGNOSIS\]([\s\S]*?)(?=\[ARAHAN\]|$)/i);
    const arahanMatch = raw.match(/\[ARAHAN\]([\s\S]*?)$/i);
    return {
      diagnosis: diagnosisMatch?.[1]?.trim() || raw,
      arahan: arahanMatch?.[1]?.trim() || "",
    };
  }

  function formatAIResponse(text: string) {
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let listItems: JSX.Element[] = [];
    let listType: 'bullet' | 'number' | null = null;
    let currentListStartNumber = 1;

    const flushList = () => {
      if (listItems.length > 0) {
        if (listType === 'number') {
          elements.push(<ol key={`ol-${elements.length}`} start={currentListStartNumber} className="list-decimal list-inside space-y-1.5 my-3 ml-4">{listItems}</ol>);
        } else {
          elements.push(<ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-1.5 my-3 ml-4">{listItems}</ul>);
        }
        listItems = []; listType = null; currentListStartNumber = 1;
      }
    };

    const processInline = (line: string): (string | JSX.Element)[] | string => {
      line = line.replace(/^#+\s*/g, '');
      const segments: (string | JSX.Element)[] = [];
      let lastIndex = 0;
      const matches: Array<{ index: number; length: number; text: string; tag: string }> = [];
      [{ regex: /\*\*(.+?)\*\*/g, tag: 'bold' }, { regex: /__(.+?)__/g, tag: 'u' }, { regex: /_(.+?)_/g, tag: 'i' }]
        .forEach(({ regex, tag }) => { let m; const r = new RegExp(regex); while ((m = r.exec(line)) !== null) matches.push({ index: m.index, length: m[0].length, text: m[1], tag }); });
      matches.sort((a, b) => a.index - b.index);
      matches.forEach((m, i) => {
        if (m.index > lastIndex) segments.push(line.substring(lastIndex, m.index));
        if (m.tag === 'bold') segments.push(<strong key={i} className="font-bold text-gray-900">{m.text}</strong>);
        else if (m.tag === 'u') segments.push(<span key={i} className="underline font-semibold text-red-700">{m.text}</span>);
        else segments.push(<em key={i} className="italic text-gray-600">{m.text}</em>);
        lastIndex = m.index + m.length;
      });
      if (lastIndex < line.length) segments.push(line.substring(lastIndex));
      return segments.length > 0 ? segments : line;
    };

    lines.forEach((line, idx) => {
      line = line.trim();
      if (!line) { flushList(); return; }
      if (line.match(/^#+\s+/)) {
        flushList();
        elements.push(<h3 key={idx} className="font-bold text-sm text-gray-900 mt-4 mb-2">{processInline(line.replace(/^#+\s+/, ''))}</h3>);
        return;
      }
      const nm = line.match(/^(\d+)\.\s+(.+)/);
      if (nm) {
        const n = parseInt(nm[1]);
        if (listType !== 'number' || n === 1) { flushList(); listType = 'number'; currentListStartNumber = n; }
        listItems.push(<li key={idx} className="text-gray-700 text-sm leading-relaxed">{processInline(nm[2])}</li>);
        return;
      }
      const bm = line.match(/^[-•]\s+(.+)/);
      if (bm) {
        if (listType !== 'bullet') { flushList(); listType = 'bullet'; }
        listItems.push(<li key={idx} className="text-gray-700 text-sm leading-relaxed">{processInline(bm[1])}</li>);
        return;
      }
      flushList();
      elements.push(<p key={idx} className="text-gray-700 text-sm leading-relaxed mb-2">{processInline(line)}</p>);
    });
    flushList();
    return elements;
  }

  // Landing
  function LandingPage({ onStart, onSkip }: { onStart: () => void; onSkip: () => void }) {
    const title = "Your space to think about business";
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-[100svh] flex items-center justify-center px-4"
      >
        <div className="max-w-2xl mx-auto text-center">

          {/* HEADER */}
          <div className="mb-8">

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.4 }}
              className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <Lightbulb className="w-4 h-4" />
              Mode: Probe
            </motion.div>

            <motion.h1
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.06 } }
              }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 flex flex-wrap justify-center gap-2"
            >
              <span>"</span>

              {title.split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 }
                  }}
                >
                  {word}
                </motion.span>
              ))}

              <span>"</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.45 }}
              style={{ willChange: "transform" }}
             className="text-xl text-gray-600 dark:text-gray-400 mb-8"
            >
              Diskusikan ide, strategi, dan arah bisnis.
              Ready akan bantu mencari apa yang sebenarnya bermasalah.
            </motion.p>

          </div>

          {/* BUTTONS */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.45 }}
            style={{ willChange: "transform" }}
            className="space-y-4"
          >

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={onStart}
              className="w-full max-w-md mx-auto flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl shadow-lg hover:shadow-xl font-semibold text-lg"
            >
              Mulai Temukan
              <ArrowRight className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={onSkip}
              className="w-full max-w-md mx-auto flex items-center justify-center gap-3 px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 rounded-xl border-2 border-gray-200 hover:bg-gray-50 font-medium"
            >
              <MessageCircle className="w-5 h-5" />
              Mulai diskusi
            </motion.button>

          </motion.div>

          {/* FEATURE CARDS */}
          <motion.div
            initial="hidden"
            animate="show"
            transition={{ delay: 0.5 }}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.15
                }
              }
            }}
            className="mt-12 grid md:grid-cols-3 gap-4 text-left"
          >

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.45 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200"
            >
              <div className="text-sm font-semibold text-gray-900 mb-2">
                Diagnose business issues
              </div>
              <div className="text-sm text-gray-600">
                Not just answer questions
              </div>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.45 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200"
            >
              <div className="text-sm font-semibold text-gray-900 mb-2">
                Structured thinking
              </div>
              <div className="text-sm text-gray-600">
                Not random advice
              </div>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.45 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200"
            >
              <div className="text-sm font-semibold text-gray-900 mb-2">
                Built for founders
              </div>
              <div className="text-sm text-gray-600">
                Who are tired of guessing
              </div>
            </motion.div>

          </motion.div>

        </div>
      </motion.div>
    );
  }
  // Analyzing
  function AnalyzingStep({ data, onComplete }: { data: DiagnosticData; onComplete: (a: string) => void }) {
    const [error, setError] = useState('');
    React.useEffect(() => {
      const analyze = async () => {
        try {
          const res = await chatApi.analyzeDiagnostic({
            session_id: crypto.randomUUID(),
            business_stage: data.businessStage || '',
            team_size: data.teamSize || '',
            position: data.position || '',
            challenges: data.challenges || [],
            situation: data.situation || '',
            perceived_problem: data.perceivedProblem || '',
            confidence: data.confidence || '',
          });
          await new Promise(r => setTimeout(r, 2000));
          onComplete(res.data.analysis);
        } catch {
          setError('Gagal menganalisis. Mencoba lagi...');
          setTimeout(analyze, 1000);
        }
      };
      analyze();
    }, []);
    return (
      <div className="h-full flex items-center justify-center px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <Loader2 className="w-12 h-12 text-red-600 mx-auto mb-5 animate-spin" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">{error || 'Menganalisis jawaban Anda...'}</h2>
          <p className="text-sm text-gray-500">Ready sedang menyimpulkan pola dari informasi yang Anda berikan</p>
        </div>
      </div>
    );
  }

  // Direction
  function DirectionStep({ arahan, onNext, onBack }: { arahan: string; onNext: (c: 'explore' | 'skip') => void; onBack: () => void }) {
    return (
      <div className="min-h-full px-4 py-8">
        <div className="max-w-2xl w-full mx-auto">
          <button onClick={onBack} type="button" className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors text-sm mb-6">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </button>
          <div className="mb-8">
            <div className="text-xs text-red-600 font-semibold mb-1 uppercase tracking-wide">ARAHAN</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Langkah Selanjutnya</h2>
            <p className="text-base text-gray-700 leading-relaxed">{arahan || "Ready siap membantu Anda mengurai masalah ini lebih dalam."}</p>
          </div>
          <div className="space-y-3">
            <button onClick={() => onNext('explore')} className="w-full flex items-center justify-between px-6 py-5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 bg-white dark:bg-gray-800/20 rounded-lg flex items-center justify-center text-lg">🔍</div>
                <div className="text-left">
                  <div className="font-semibold">Mulai dari sini</div>
                  <div className="text-sm text-red-100">Eksplorasi lebih dalam bersama Ready</div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={() => onNext('skip')} className="w-full flex items-center justify-center px-6 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 text-gray-500 rounded-xl hover:border-gray-300 transition-all font-medium text-sm">
              Skip
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Question Block
  function QuestionBlock({ number, question, options, selected, onSelect }: {
    number: number; question: string; options: string[]; selected?: string; onSelect: (v: string) => void;
  }) {
    return (
      <div>
        <div className="text-base font-semibold text-gray-900 mb-3">{number}. {question}</div>
        <div className="space-y-2">
          {options.map(option => (
            <button key={option} onClick={() => onSelect(option)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all border-2 text-sm
              ${selected === option ? 'bg-red-50 border-red-300 text-red-900' : 'bg-white dark:bg-gray-800 border-gray-200 hover:border-gray-300 text-gray-700'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selected === option ? 'bg-red-600 border-red-600' : 'border-gray-300'}`}>
                  {selected === option && <div className="w-1.5 h-1.5 bg-white dark:bg-gray-800 rounded-full" />}
                </div>
                <span className="font-medium">{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }}