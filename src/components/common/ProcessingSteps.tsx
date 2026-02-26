import { useMemo } from 'react';
import { Spinner } from './Spinner';

/**
 * Processing step status
 */
export type StepStatus = 'pending' | 'active' | 'completed' | 'error';

/**
 * Individual processing step
 */
export interface ProcessingStep {
  id: string;
  label: string;
  description?: string;
  status: StepStatus;
  progress?: number;
  error?: string;
}

/**
 * ProcessingSteps component props
 */
export interface ProcessingStepsProps {
  /**
   * Array of processing steps
   */
  steps: ProcessingStep[];
  
  /**
   * Layout orientation
   * @default 'vertical'
   */
  orientation?: 'vertical' | 'horizontal';
  
  /**
   * Show progress percentage for active step
   * @default true
   */
  showProgress?: boolean;
  
  /**
   * Custom color for completed steps
   * @default '#22c55e'
   */
  completedColor?: string;
  
  /**
   * Custom color for active step
   * @default '#3b82f6'
   */
  activeColor?: string;
  
  /**
   * Custom color for error state
   * @default '#ef4444'
   */
  errorColor?: string;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Check icon for completed steps
 */
function CheckIcon({ color }: { color: string }) {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke={color}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.5}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

/**
 * Error icon for failed steps
 */
function ErrorIcon({ color }: { color: string }) {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke={color}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.5}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

/**
 * Individual step indicator
 */
function StepIndicator({
  step,
  index,
  completedColor,
  activeColor,
  errorColor,
  showProgress,
}: {
  step: ProcessingStep;
  index: number;
  completedColor: string;
  activeColor: string;
  errorColor: string;
  showProgress: boolean;
}) {
  const { status, progress } = step;
  
  // Determine colors and content based on status
  const { bgColor, borderColor, textColor, content } = useMemo(() => {
    switch (status) {
      case 'completed':
        return {
          bgColor: completedColor,
          borderColor: completedColor,
          textColor: '#ffffff',
          content: <CheckIcon color="#ffffff" />,
        };
      case 'active':
        return {
          bgColor: '#ffffff',
          borderColor: activeColor,
          textColor: activeColor,
          content: <Spinner size="small" color={activeColor} />,
        };
      case 'error':
        return {
          bgColor: errorColor,
          borderColor: errorColor,
          textColor: '#ffffff',
          content: <ErrorIcon color="#ffffff" />,
        };
      default:
        return {
          bgColor: '#ffffff',
          borderColor: '#d1d5db',
          textColor: '#9ca3af',
          content: <span className="text-sm font-medium">{index + 1}</span>,
        };
    }
  }, [status, index, completedColor, activeColor, errorColor]);
  
  return (
    <div className="flex flex-col items-center">
      <div
        data-testid={`step-indicator-${step.id}`}
        className={`
          relative flex items-center justify-center
          w-8 h-8 rounded-full border-2
          transition-all duration-300
        `}
        style={{
          backgroundColor: bgColor,
          borderColor: borderColor,
          color: textColor,
        }}
      >
        {content}
      </div>
      
      {/* Progress indicator below active step */}
      {status === 'active' && showProgress && progress !== undefined && (
        <div className="mt-1 text-xs font-medium" style={{ color: activeColor }}>
          {Math.round(progress)}%
        </div>
      )}
    </div>
  );
}

/**
 * ProcessingSteps component
 * 
 * Displays a series of processing steps with their current status.
 * Shows progress through image upload, color extraction, and theme generation.
 */
export function ProcessingSteps({
  steps,
  orientation = 'vertical',
  showProgress = true,
  completedColor = '#22c55e',
  activeColor = '#3b82f6',
  errorColor = '#ef4444',
  className = '',
}: ProcessingStepsProps) {
  const isVertical = orientation === 'vertical';
  
  return (
    <div
      data-testid="processing-steps"
      className={`
        ${isVertical ? 'flex flex-col' : 'flex items-start justify-between'}
        ${className}
      `}
    >
      {steps.map((step, index) => (
        <div
          key={step.id}
          className={`
            ${isVertical ? 'flex items-start' : 'flex flex-col items-center flex-1'}
            ${index < steps.length - 1 ? (isVertical ? 'pb-6' : '') : ''}
          `}
        >
          {/* Step indicator */}
          <div className="relative">
            <StepIndicator
              step={step}
              index={index}
              completedColor={completedColor}
              activeColor={activeColor}
              errorColor={errorColor}
              showProgress={showProgress}
            />
            
            {/* Connecting line */}
            {index < steps.length - 1 && (
              <>
                {isVertical ? (
                  <div
                    data-testid={`connector-${step.id}`}
                    className="absolute left-1/2 top-8 w-0.5 h-6 -translate-x-1/2"
                    style={{
                      backgroundColor:
                        step.status === 'completed' ? completedColor : '#e5e7eb',
                    }}
                  />
                ) : (
                  <div
                    data-testid={`connector-${step.id}`}
                    className="absolute left-8 top-1/2 h-0.5 -translate-y-1/2"
                    style={{
                      width: 'calc(100% - 2rem)',
                      backgroundColor:
                        step.status === 'completed' ? completedColor : '#e5e7eb',
                    }}
                  />
                )}
              </>
            )}
          </div>
          
          {/* Step content */}
          <div
            className={`
              ${isVertical ? 'ml-4 flex-1' : 'mt-2 text-center max-w-24'}
            `}
          >
            <h4
              data-testid={`step-label-${step.id}`}
              className={`
                text-sm font-medium
                ${step.status === 'active' ? 'text-gray-900' : ''}
                ${step.status === 'completed' ? 'text-gray-700' : ''}
                ${step.status === 'pending' ? 'text-gray-400' : ''}
                ${step.status === 'error' ? 'text-red-600' : ''}
              `}
            >
              {step.label}
            </h4>
            
            {step.description && (
              <p
                data-testid={`step-description-${step.id}`}
                className={`
                  text-xs mt-0.5
                  ${step.status === 'active' ? 'text-gray-600' : 'text-gray-400'}
                `}
              >
                {step.description}
              </p>
            )}
            
            {step.error && (
              <p
                data-testid={`step-error-${step.id}`}
                className="text-xs mt-1 text-red-500"
              >
                {step.error}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProcessingSteps;
