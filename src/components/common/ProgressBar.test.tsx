import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressBar, CircularProgress } from './ProgressBar';

describe('ProgressBar', () => {
  describe('rendering', () => {
    it('should render the progress bar', () => {
      render(<ProgressBar value={50} />);
      expect(screen.getByTestId('progress-bar')).toBeInTheDocument();
    });
    
    it('should have role="progressbar"', () => {
      render(<ProgressBar value={50} />);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
    
    it('should set aria-valuenow', () => {
      render(<ProgressBar value={75} />);
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '75');
    });
    
    it('should set aria-valuemin and aria-valuemax', () => {
      render(<ProgressBar value={50} max={200} />);
      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).toHaveAttribute('aria-valuemin', '0');
      expect(progressbar).toHaveAttribute('aria-valuemax', '200');
    });
  });
  
  describe('progress value', () => {
    it('should show correct width percentage', () => {
      render(<ProgressBar value={50} />);
      expect(screen.getByTestId('progress-fill')).toHaveStyle({ width: '50%' });
    });
    
    it('should calculate percentage from max', () => {
      render(<ProgressBar value={50} max={200} />);
      expect(screen.getByTestId('progress-fill')).toHaveStyle({ width: '25%' });
    });
    
    it('should clamp value to 0', () => {
      render(<ProgressBar value={-10} />);
      expect(screen.getByTestId('progress-fill')).toHaveStyle({ width: '0%' });
    });
    
    it('should clamp value to 100', () => {
      render(<ProgressBar value={150} />);
      expect(screen.getByTestId('progress-fill')).toHaveStyle({ width: '100%' });
    });
  });
  
  describe('sizes', () => {
    it('should apply small size class', () => {
      render(<ProgressBar value={50} size="small" />);
      expect(screen.getByTestId('progress-bar')).toHaveClass('h-1');
    });
    
    it('should apply medium size class by default', () => {
      render(<ProgressBar value={50} />);
      expect(screen.getByTestId('progress-bar')).toHaveClass('h-2');
    });
    
    it('should apply large size class', () => {
      render(<ProgressBar value={50} size="large" />);
      expect(screen.getByTestId('progress-bar')).toHaveClass('h-4');
    });
  });
  
  describe('variants', () => {
    it('should apply primary color by default', () => {
      render(<ProgressBar value={50} />);
      expect(screen.getByTestId('progress-fill')).toHaveStyle({
        backgroundColor: '#3b82f6',
      });
    });
    
    it('should apply success color', () => {
      render(<ProgressBar value={50} variant="success" />);
      expect(screen.getByTestId('progress-fill')).toHaveStyle({
        backgroundColor: '#22c55e',
      });
    });
    
    it('should apply warning color', () => {
      render(<ProgressBar value={50} variant="warning" />);
      expect(screen.getByTestId('progress-fill')).toHaveStyle({
        backgroundColor: '#f59e0b',
      });
    });
    
    it('should apply error color', () => {
      render(<ProgressBar value={50} variant="error" />);
      expect(screen.getByTestId('progress-fill')).toHaveStyle({
        backgroundColor: '#ef4444',
      });
    });
    
    it('should apply custom color', () => {
      render(<ProgressBar value={50} variant="#ff00ff" />);
      expect(screen.getByTestId('progress-fill')).toHaveStyle({
        backgroundColor: '#ff00ff',
      });
    });
  });
  
  describe('label', () => {
    it('should show label when showLabel is true', () => {
      render(<ProgressBar value={50} showLabel />);
      expect(screen.getByText('50%')).toBeInTheDocument();
    });
    
    it('should not show label by default', () => {
      render(<ProgressBar value={50} />);
      expect(screen.queryByText('50%')).not.toBeInTheDocument();
    });
    
    it('should show custom label text', () => {
      render(<ProgressBar value={50} showLabel label="Loading..." />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
    
    it('should use custom format function', () => {
      render(
        <ProgressBar
          value={50}
          max={100}
          showLabel
          formatLabel={(v, m) => `${v} of ${m}`}
        />
      );
      expect(screen.getByText('50 of 100')).toBeInTheDocument();
    });
  });
  
  describe('indeterminate', () => {
    it('should not set aria-valuenow when indeterminate', () => {
      render(<ProgressBar value={50} indeterminate />);
      expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow');
    });
    
    it('should have animation when indeterminate', () => {
      render(<ProgressBar value={50} indeterminate />);
      const fill = screen.getByTestId('progress-fill');
      expect(fill).toHaveStyle({ width: '40%' });
    });
  });
  
  describe('animation', () => {
    it('should have transition by default', () => {
      render(<ProgressBar value={50} />);
      expect(screen.getByTestId('progress-fill')).toHaveClass('transition-all');
    });
    
    it('should not have transition when animated is false', () => {
      render(<ProgressBar value={50} animated={false} />);
      expect(screen.getByTestId('progress-fill')).not.toHaveClass('transition-all');
    });
  });
});

describe('CircularProgress', () => {
  describe('rendering', () => {
    it('should render the circular progress', () => {
      render(<CircularProgress value={50} />);
      expect(screen.getByTestId('circular-progress')).toBeInTheDocument();
    });
    
    it('should have role="progressbar"', () => {
      render(<CircularProgress value={50} />);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
    
    it('should set aria-valuenow', () => {
      render(<CircularProgress value={75} />);
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '75');
    });
  });
  
  describe('size', () => {
    it('should apply custom size', () => {
      render(<CircularProgress value={50} size={100} />);
      expect(screen.getByTestId('circular-progress')).toHaveStyle({
        width: '100px',
        height: '100px',
      });
    });
  });
  
  describe('showValue', () => {
    it('should show value when showValue is true', () => {
      render(<CircularProgress value={50} showValue />);
      expect(screen.getByText('50%')).toBeInTheDocument();
    });
    
    it('should not show value by default', () => {
      render(<CircularProgress value={50} />);
      expect(screen.queryByText('50%')).not.toBeInTheDocument();
    });
    
    it('should not show value when indeterminate', () => {
      render(<CircularProgress value={50} showValue indeterminate />);
      expect(screen.queryByText('50%')).not.toBeInTheDocument();
    });
  });
  
  describe('indeterminate', () => {
    it('should have spin animation when indeterminate', () => {
      render(<CircularProgress value={50} indeterminate />);
      const svg = screen.getByTestId('circular-progress').querySelector('svg');
      expect(svg).toHaveClass('animate-spin');
    });
    
    it('should not set aria-valuenow when indeterminate', () => {
      render(<CircularProgress value={50} indeterminate />);
      expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow');
    });
  });
});
