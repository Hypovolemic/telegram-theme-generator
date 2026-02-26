import { useState, useMemo } from 'react';
import { type ProcessingStep, type StepStatus } from './ProcessingSteps';

/**
 * Hook to manage processing steps state
 */
export interface UseProcessingStepsOptions {
  steps: Array<{ id: string; label: string; description?: string }>;
}

export interface UseProcessingStepsReturn {
  steps: ProcessingStep[];
  currentStepId: string | null;
  startStep: (stepId: string) => void;
  updateProgress: (stepId: string, progress: number) => void;
  completeStep: (stepId: string) => void;
  failStep: (stepId: string, error: string) => void;
  reset: () => void;
  isComplete: boolean;
  hasError: boolean;
}

export function useProcessingSteps({
  steps: initialSteps,
}: UseProcessingStepsOptions): UseProcessingStepsReturn {
  const [steps, setSteps] = useState<ProcessingStep[]>(
    initialSteps.map((s) => ({ ...s, status: 'pending' as StepStatus }))
  );
  
  const currentStepId = useMemo(
    () => steps.find((s) => s.status === 'active')?.id ?? null,
    [steps]
  );
  
  const isComplete = useMemo(
    () => steps.every((s) => s.status === 'completed'),
    [steps]
  );
  
  const hasError = useMemo(
    () => steps.some((s) => s.status === 'error'),
    [steps]
  );
  
  const startStep = (stepId: string) => {
    setSteps((prev) =>
      prev.map((s) =>
        s.id === stepId ? { ...s, status: 'active', progress: 0 } : s
      )
    );
  };
  
  const updateProgress = (stepId: string, progress: number) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === stepId ? { ...s, progress } : s))
    );
  };
  
  const completeStep = (stepId: string) => {
    setSteps((prev) =>
      prev.map((s) =>
        s.id === stepId ? { ...s, status: 'completed', progress: 100 } : s
      )
    );
  };
  
  const failStep = (stepId: string, error: string) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === stepId ? { ...s, status: 'error', error } : s))
    );
  };
  
  const reset = () => {
    setSteps(
      initialSteps.map((s) => ({
        ...s,
        status: 'pending' as StepStatus,
        progress: undefined,
        error: undefined,
      }))
    );
  };
  
  return {
    steps,
    currentStepId,
    startStep,
    updateProgress,
    completeStep,
    failStep,
    reset,
    isComplete,
    hasError,
  };
}
