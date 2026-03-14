import { useState } from 'react';
import EngineTopicSelector from './EngineTopicSelector';
import EngineSubModeSelector from './EngineSubModeSelector';
import EngineQuestionnaire from './EngineQuestionnaire';
import { useEngineQuestions, useSaveEngineAnswers } from '@/app/api/chat';
import type { EngineTopic, EngineSubMode, EngineAnswers } from '@/app/api/chat';
import { useToast } from '@/shared/hooks/useToast';
import { usePaymentStatus } from '@/app/api/payment/usePaymentApi';
import { useAuth } from '@/app/auth';
import { isAdminRole } from '../hooks/usePremium';

type Step = 'topic' | 'submode' | 'questionnaire';

const FULLY_LOCKED_TOPICS: EngineTopic[] = [
  'product_development',
  'market_analyst',
  'content_plan',
];

const ANALYSIS_LOCKED_TOPICS: EngineTopic[] = [
  'marketing',
];

interface Props {
  sessionId: string;
  onComplete: (analysis: string, topic: EngineTopic, subMode: EngineSubMode, answers: EngineAnswers) => Promise<void>;
  onLockedTopic?: (topic: EngineTopic) => void;
}

export default function EngineFlow({ sessionId, onComplete, onLockedTopic }: Props) {
  const toast = useToast();
  const [step, setStep] = useState<Step>('topic');
  const [selectedTopic, setSelectedTopic] = useState<EngineTopic | null>(null);
  const [selectedSubMode, setSelectedSubMode] = useState<EngineSubMode | null>(null);

  // ✅ Semua hooks di atas sebelum dipakai
  const { user } = useAuth();
  const { data: paymentStatus } = usePaymentStatus();
  const isPremium = paymentStatus?.is_premium ?? false;
  const isAdmin = isAdminRole(user?.role?.name);
  const bypassLock = isAdmin || isPremium;

  const { data: questionsData, isLoading: isLoadingQuestions } = useEngineQuestions(
    selectedTopic || '',
    selectedSubMode || '',
    !!selectedTopic && !!selectedSubMode
  );

  const saveAnswersMutation = useSaveEngineAnswers();

  const handleTopicSelect = (topic: EngineTopic) => {
    if (!bypassLock && FULLY_LOCKED_TOPICS.includes(topic)) {
      onLockedTopic?.(topic);
      return;
    }
    setSelectedTopic(topic);
    setStep('submode');
  };

  const handleSubModeSelect = (subMode: EngineSubMode) => {
    if (!bypassLock) {
      const isAnalysis = (subMode as string) === 'analysis';
      const analysisOnlyLocked = isAnalysis && selectedTopic && ANALYSIS_LOCKED_TOPICS.includes(selectedTopic);
      if (analysisOnlyLocked) {
        onLockedTopic?.(selectedTopic!);
        return;
      }
    }
    setSelectedSubMode(subMode);
    setStep('questionnaire');
  };

  const handleBackToTopics = () => {
    setSelectedTopic(null);
    setSelectedSubMode(null);
    setStep('topic');
  };

  const handleBackToSubMode = () => {
    setSelectedSubMode(null);
    setStep('submode');
  };

  const handleSubmitAnswers = async (answers: EngineAnswers) => {
    if (!selectedTopic || !selectedSubMode) return;
    try {
      await saveAnswersMutation.mutateAsync({
        session_id: sessionId,
        topic: selectedTopic,
        sub_mode: selectedSubMode,
        answers,
      });
      await onComplete('', selectedTopic, selectedSubMode, answers);
    } catch (error) {
      console.error('Failed to submit answers:', error);
      toast.error('Gagal membuat analysis. Silakan coba lagi.');
    }
  };

  if (step === 'questionnaire' && isLoadingQuestions) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      {step === 'topic' && (
        <EngineTopicSelector onTopicSelect={handleTopicSelect} />
      )}

      {step === 'submode' && selectedTopic && (
        <EngineSubModeSelector
          selectedTopic={selectedTopic}
          onSubModeSelect={handleSubModeSelect}
          onBack={handleBackToTopics}
        />
      )}

      {step === 'questionnaire' && questionsData && (
        <EngineQuestionnaire
          questions={questionsData.questions}
          expectedOutputs={questionsData.output}
          title={questionsData.title}
          description={questionsData.description}
          onSubmit={handleSubmitAnswers}
          onBack={handleBackToSubMode}
          isSubmitting={saveAnswersMutation.isPending}
        />
      )}
    </div>
  );
}