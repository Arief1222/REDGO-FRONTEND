// src/app/chat/components/EngineFlow.tsx - FIXED: Save analysis to backend

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import EngineTopicSelector from './EngineTopicSelector';
import EngineSubModeSelector from './EngineSubModeSelector';
import EngineQuestionnaire from './EngineQuestionnaire';
import {
  useEngineQuestions,
  useSaveEngineAnswers,
  useGenerateEngineAnalysis,
  // useSendMessage, // ✅ ADD THIS
} from '@/app/api/chat';
import type { EngineTopic, EngineSubMode, EngineAnswers} from '@/app/api/chat';
import { useToast } from '@/shared/hooks/useToast';

type Step = 'topic' | 'submode' | 'questionnaire';

interface Props {
  sessionId: string;
  onComplete: (analysis: string, topic: EngineTopic, subMode: EngineSubMode) => void;
}

export default function EngineFlow({ sessionId, onComplete }: Props) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [step, setStep] = useState<Step>('topic');
  const [selectedTopic, setSelectedTopic] = useState<EngineTopic | null>(null);
  const [selectedSubMode, setSelectedSubMode] = useState<EngineSubMode | null>(null);

  // Fetch questions when topic and submode are selected
  const {
    data: questionsData,
    isLoading: isLoadingQuestions,
  } = useEngineQuestions(
    selectedTopic || '',
    selectedSubMode || '',
    !!selectedTopic && !!selectedSubMode
  );

  const saveAnswersMutation = useSaveEngineAnswers();
  const generateAnalysisMutation = useGenerateEngineAnalysis();
  // const sendMessageMutation = useSendMessage(); // ✅ ADD THIS

  const handleTopicSelect = (topic: EngineTopic) => {
    setSelectedTopic(topic);
    setStep('submode');
  };

  const handleSubModeSelect = (subMode: EngineSubMode) => {
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
      // 1. Save answers to engine_answers table
      await saveAnswersMutation.mutateAsync({
        session_id: sessionId,
        topic: selectedTopic,
        sub_mode: selectedSubMode,
        answers,
      });

      // 2. Generate analysis (backend will save it as message automatically)
      const analysisResult = await generateAnalysisMutation.mutateAsync({
        session_id: sessionId,
        topic: selectedTopic,
        sub_mode: selectedSubMode,
      });

      console.log("✅ Engine analysis generated and saved by backend");

      // ✅ 3. Invalidate chat history to refresh sidebar
      queryClient.invalidateQueries({ queryKey: ['chatHistory'] });

      // 4. Complete flow - show in UI
      onComplete(analysisResult.analysis, selectedTopic, selectedSubMode);
      
      toast.success('Analysis berhasil dibuat!');
    } catch (error) {
      console.error('Failed to submit answers:', error);
      toast.error('Gagal membuat analysis. Silakan coba lagi.');
    }
  };

  // Show loading when fetching questions
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

  // Render current step
  return (
    <div className="h-full overflow-y-auto">
      {step === 'topic' && (
        <EngineTopicSelector onTopicSelect={handleTopicSelect} />
      )}

      {step === 'submode' && (
        <EngineSubModeSelector
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
          isSubmitting={saveAnswersMutation.isPending || generateAnalysisMutation.isPending}
        />
      )}
    </div>
  );
}