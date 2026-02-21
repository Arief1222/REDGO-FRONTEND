// src/app/chat/components/EngineQuestionnaire.tsx

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import type { EngineQuestion, EngineAnswers } from '@/app/api/chat';

interface Props {
  questions: EngineQuestion[];
  expectedOutputs: string[];
  title: string;
  description: string;
  onSubmit: (answers: EngineAnswers) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export default function EngineQuestionnaire({
  questions,
  title,
  description,
  onSubmit,
  onBack,
  isSubmitting,
}: Props) {
  const [answers, setAnswers] = useState<EngineAnswers>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const canProceed = answers[currentQuestion.key]?.trim().length > 0;
  const allAnswered = questions.every(q => answers[q.key]?.trim().length > 0);

  const handleNext = () => {
    if (canProceed && !isLastQuestion) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (allAnswered) {
      onSubmit(answers);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      if (!isLastQuestion && canProceed) {
        handleNext();
      } else if (isLastQuestion && allAnswered) {
        handleSubmit();
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        disabled={isSubmitting}
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Kembali</span>
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600">{description}</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Pertanyaan {currentQuestionIndex + 1} dari {questions.length}</span>
          <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-600 to-red-700 transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 mb-6 shadow-sm">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-sm">
            {currentQuestion.order}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {currentQuestion.question}
            </h3>
            {currentQuestion.hint && (
              <p className="text-sm text-gray-400 mt-1">
                {currentQuestion.hint}
              </p>
            )}
          </div>
        </div>

        <textarea
          value={answers[currentQuestion.key] || ''}
          onChange={(e) => setAnswers(prev => ({ ...prev, [currentQuestion.key]: e.target.value }))}
          onKeyDown={handleKeyPress}
          placeholder="Ketik jawaban Anda di sini..."
          rows={4}
          className="w-full border-2 border-gray-200 rounded-xl p-4 focus:border-red-400 focus:outline-none resize-none text-gray-800 placeholder-gray-400"
          disabled={isSubmitting}
        />

        <p className="text-xs text-gray-500 mt-2">
          Tekan Ctrl + Enter untuk lanjut ke pertanyaan berikutnya
        </p>

      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0 || isSubmitting}
          className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Sebelumnya</span>
        </button>

        {!isLastQuestion ? (
          <button
            onClick={handleNext}
            disabled={!canProceed || isSubmitting}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg disabled:shadow-none"
          >
            <span>Selanjutnya</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered || isSubmitting}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg disabled:shadow-none"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>Generate Analysis</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Questions Overview */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-gray-900 mb-3 text-sm">
          Status Pertanyaan:
        </h4>
        <div className="flex flex-wrap gap-2">
          {questions.map((q, idx) => (
            <button
              key={q.key}
              onClick={() => setCurrentQuestionIndex(idx)}
              disabled={isSubmitting}
              className={`
                w-9 h-9 rounded-full flex items-center justify-center
                text-xs font-semibold transition-all
                ${currentQuestionIndex === idx
                  ? 'bg-red-600 text-white'
                  : answers[q.key]?.trim()
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-white text-gray-600 border border-gray-300'
                }
              `}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}