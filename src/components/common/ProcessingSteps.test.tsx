import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import { ProcessingSteps, type ProcessingStep } from './ProcessingSteps';
import { useProcessingSteps } from './useProcessingSteps';

describe('ProcessingSteps', () => {
  const createSteps = (statuses: Array<'pending' | 'active' | 'completed' | 'error'>): ProcessingStep[] =>
    statuses.map((status, i) => ({
      id: `step-${i + 1}`,
      label: `Step ${i + 1}`,
      description: `Description for step ${i + 1}`,
      status,
    }));
  
  describe('rendering', () => {
    it('should render the processing steps', () => {
      render(<ProcessingSteps steps={createSteps(['pending', 'pending'])} />);
      expect(screen.getByTestId('processing-steps')).toBeInTheDocument();
    });
    
    it('should render all step labels', () => {
      render(<ProcessingSteps steps={createSteps(['pending', 'active', 'completed'])} />);
      expect(screen.getByTestId('step-label-step-1')).toHaveTextContent('Step 1');
      expect(screen.getByTestId('step-label-step-2')).toHaveTextContent('Step 2');
      expect(screen.getByTestId('step-label-step-3')).toHaveTextContent('Step 3');
    });
    
    it('should render step descriptions', () => {
      render(<ProcessingSteps steps={createSteps(['active'])} />);
      expect(screen.getByTestId('step-description-step-1')).toHaveTextContent('Description for step 1');
    });
    
    it('should apply custom className', () => {
      render(<ProcessingSteps steps={createSteps(['pending'])} className="custom-class" />);
      expect(screen.getByTestId('processing-steps')).toHaveClass('custom-class');
    });
  });
  
  describe('step indicators', () => {
    it('should show step number for pending steps', () => {
      render(<ProcessingSteps steps={createSteps(['pending'])} />);
      expect(screen.getByTestId('step-indicator-step-1')).toHaveTextContent('1');
    });
    
    it('should show spinner for active steps', () => {
      render(<ProcessingSteps steps={createSteps(['active'])} />);
      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });
    
    it('should show check icon for completed steps', () => {
      render(<ProcessingSteps steps={createSteps(['completed'])} />);
      const indicator = screen.getByTestId('step-indicator-step-1');
      expect(indicator.querySelector('svg')).toBeInTheDocument();
    });
    
    it('should show error icon for error steps', () => {
      const steps: ProcessingStep[] = [{
        id: 'step-1',
        label: 'Step 1',
        status: 'error',
        error: 'Something went wrong',
      }];
      render(<ProcessingSteps steps={steps} />);
      expect(screen.getByTestId('step-error-step-1')).toHaveTextContent('Something went wrong');
    });
  });
  
  describe('step status styling', () => {
    it('should style pending steps with muted text', () => {
      render(<ProcessingSteps steps={createSteps(['pending'])} />);
      expect(screen.getByTestId('step-label-step-1')).toHaveClass('text-gray-400');
    });
    
    it('should style active steps with dark text', () => {
      render(<ProcessingSteps steps={createSteps(['active'])} />);
      expect(screen.getByTestId('step-label-step-1')).toHaveClass('text-gray-900');
    });
    
    it('should style completed steps normally', () => {
      render(<ProcessingSteps steps={createSteps(['completed'])} />);
      expect(screen.getByTestId('step-label-step-1')).toHaveClass('text-gray-700');
    });
    
    it('should style error steps with red text', () => {
      render(<ProcessingSteps steps={createSteps(['error'])} />);
      expect(screen.getByTestId('step-label-step-1')).toHaveClass('text-red-600');
    });
  });
  
  describe('connectors', () => {
    it('should render connectors between steps', () => {
      render(<ProcessingSteps steps={createSteps(['completed', 'active', 'pending'])} />);
      expect(screen.getByTestId('connector-step-1')).toBeInTheDocument();
      expect(screen.getByTestId('connector-step-2')).toBeInTheDocument();
    });
    
    it('should not render connector after last step', () => {
      render(<ProcessingSteps steps={createSteps(['completed', 'pending'])} />);
      expect(screen.queryByTestId('connector-step-2')).not.toBeInTheDocument();
    });
    
    it('should style completed connector with completed color', () => {
      render(<ProcessingSteps steps={createSteps(['completed', 'active'])} />);
      expect(screen.getByTestId('connector-step-1')).toHaveStyle({
        backgroundColor: '#22c55e',
      });
    });
    
    it('should style pending connector with gray', () => {
      render(<ProcessingSteps steps={createSteps(['active', 'pending'])} />);
      expect(screen.getByTestId('connector-step-1')).toHaveStyle({
        backgroundColor: '#e5e7eb',
      });
    });
  });
  
  describe('progress display', () => {
    it('should show progress percentage for active step', () => {
      const steps: ProcessingStep[] = [{
        id: 'step-1',
        label: 'Processing',
        status: 'active',
        progress: 65,
      }];
      render(<ProcessingSteps steps={steps} showProgress={true} />);
      expect(screen.getByText('65%')).toBeInTheDocument();
    });
    
    it('should not show progress when showProgress is false', () => {
      const steps: ProcessingStep[] = [{
        id: 'step-1',
        label: 'Processing',
        status: 'active',
        progress: 65,
      }];
      render(<ProcessingSteps steps={steps} showProgress={false} />);
      expect(screen.queryByText('65%')).not.toBeInTheDocument();
    });
  });
  
  describe('custom colors', () => {
    it('should apply custom completed color', () => {
      render(
        <ProcessingSteps
          steps={createSteps(['completed'])}
          completedColor="#00ff00"
        />
      );
      expect(screen.getByTestId('step-indicator-step-1')).toHaveStyle({
        backgroundColor: '#00ff00',
      });
    });
    
    it('should apply custom active color', () => {
      render(
        <ProcessingSteps
          steps={createSteps(['active'])}
          activeColor="#ff00ff"
        />
      );
      expect(screen.getByTestId('step-indicator-step-1')).toHaveStyle({
        borderColor: '#ff00ff',
      });
    });
    
    it('should apply custom error color', () => {
      render(
        <ProcessingSteps
          steps={createSteps(['error'])}
          errorColor="#ff0000"
        />
      );
      expect(screen.getByTestId('step-indicator-step-1')).toHaveStyle({
        backgroundColor: '#ff0000',
      });
    });
  });
  
  describe('orientation', () => {
    it('should render vertical layout by default', () => {
      render(<ProcessingSteps steps={createSteps(['pending', 'pending'])} />);
      expect(screen.getByTestId('processing-steps')).toHaveClass('flex-col');
    });
    
    it('should render horizontal layout when specified', () => {
      render(<ProcessingSteps steps={createSteps(['pending', 'pending'])} orientation="horizontal" />);
      expect(screen.getByTestId('processing-steps')).not.toHaveClass('flex-col');
    });
  });
});

describe('useProcessingSteps', () => {
  const initialSteps = [
    { id: 'upload', label: 'Upload Image' },
    { id: 'extract', label: 'Extract Colours' },
    { id: 'generate', label: 'Generate Theme' },
  ];
  
  it('should initialize steps as pending', () => {
    const { result } = renderHook(() =>
      useProcessingSteps({ steps: initialSteps })
    );
    
    expect(result.current.steps).toHaveLength(3);
    expect(result.current.steps.every((s) => s.status === 'pending')).toBe(true);
  });
  
  it('should start a step', () => {
    const { result } = renderHook(() =>
      useProcessingSteps({ steps: initialSteps })
    );
    
    act(() => {
      result.current.startStep('upload');
    });
    
    expect(result.current.steps[0].status).toBe('active');
    expect(result.current.currentStepId).toBe('upload');
  });
  
  it('should update progress', () => {
    const { result } = renderHook(() =>
      useProcessingSteps({ steps: initialSteps })
    );
    
    act(() => {
      result.current.startStep('upload');
    });
    
    act(() => {
      result.current.updateProgress('upload', 50);
    });
    
    expect(result.current.steps[0].progress).toBe(50);
  });
  
  it('should complete a step', () => {
    const { result } = renderHook(() =>
      useProcessingSteps({ steps: initialSteps })
    );
    
    act(() => {
      result.current.startStep('upload');
    });
    
    act(() => {
      result.current.completeStep('upload');
    });
    
    expect(result.current.steps[0].status).toBe('completed');
    expect(result.current.steps[0].progress).toBe(100);
  });
  
  it('should fail a step with error', () => {
    const { result } = renderHook(() =>
      useProcessingSteps({ steps: initialSteps })
    );
    
    act(() => {
      result.current.startStep('upload');
    });
    
    act(() => {
      result.current.failStep('upload', 'Upload failed');
    });
    
    expect(result.current.steps[0].status).toBe('error');
    expect(result.current.steps[0].error).toBe('Upload failed');
    expect(result.current.hasError).toBe(true);
  });
  
  it('should track isComplete', () => {
    const { result } = renderHook(() =>
      useProcessingSteps({ steps: initialSteps })
    );
    
    expect(result.current.isComplete).toBe(false);
    
    act(() => {
      result.current.completeStep('upload');
      result.current.completeStep('extract');
      result.current.completeStep('generate');
    });
    
    expect(result.current.isComplete).toBe(true);
  });
  
  it('should reset all steps', () => {
    const { result } = renderHook(() =>
      useProcessingSteps({ steps: initialSteps })
    );
    
    act(() => {
      result.current.startStep('upload');
      result.current.completeStep('upload');
      result.current.startStep('extract');
    });
    
    act(() => {
      result.current.reset();
    });
    
    expect(result.current.steps.every((s) => s.status === 'pending')).toBe(true);
    expect(result.current.currentStepId).toBeNull();
  });
});
