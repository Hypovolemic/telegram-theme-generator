import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Spinner, DotsSpinner, PulseSpinner } from './Spinner';

describe('Spinner', () => {
  describe('rendering', () => {
    it('should render the spinner', () => {
      render(<Spinner />);
      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });
    
    it('should have role="status"', () => {
      render(<Spinner />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
    
    it('should have default aria-label', () => {
      render(<Spinner />);
      expect(screen.getByLabelText('Loading')).toBeInTheDocument();
    });
    
    it('should use custom label', () => {
      render(<Spinner label="Processing" />);
      expect(screen.getByLabelText('Processing')).toBeInTheDocument();
    });
    
    it('should have screen reader text', () => {
      render(<Spinner label="Loading data" />);
      expect(screen.getByText('Loading data')).toHaveClass('sr-only');
    });
  });
  
  describe('sizes', () => {
    it('should apply small size classes', () => {
      render(<Spinner size="small" />);
      expect(screen.getByTestId('spinner')).toHaveClass('w-4', 'h-4');
    });
    
    it('should apply medium size classes by default', () => {
      render(<Spinner />);
      expect(screen.getByTestId('spinner')).toHaveClass('w-8', 'h-8');
    });
    
    it('should apply large size classes', () => {
      render(<Spinner size="large" />);
      expect(screen.getByTestId('spinner')).toHaveClass('w-12', 'h-12');
    });
  });
  
  describe('styling', () => {
    it('should apply custom color', () => {
      render(<Spinner color="#ff0000" />);
      expect(screen.getByTestId('spinner')).toHaveStyle({
        borderTopColor: '#ff0000',
      });
    });
    
    it('should apply custom className', () => {
      render(<Spinner className="custom-class" />);
      expect(screen.getByTestId('spinner')).toHaveClass('custom-class');
    });
    
    it('should have spin animation', () => {
      render(<Spinner />);
      expect(screen.getByTestId('spinner')).toHaveClass('animate-spin');
    });
  });
});

describe('DotsSpinner', () => {
  it('should render the dots spinner', () => {
    render(<DotsSpinner />);
    expect(screen.getByTestId('dots-spinner')).toBeInTheDocument();
  });
  
  it('should render three dots', () => {
    render(<DotsSpinner />);
    const dots = screen.getByTestId('dots-spinner').querySelectorAll('.animate-bounce');
    expect(dots).toHaveLength(3);
  });
  
  it('should have role="status"', () => {
    render(<DotsSpinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
  
  it('should apply custom color to dots', () => {
    render(<DotsSpinner color="#00ff00" />);
    const dots = screen.getByTestId('dots-spinner').querySelectorAll('.animate-bounce');
    dots.forEach((dot) => {
      expect(dot).toHaveStyle({ backgroundColor: '#00ff00' });
    });
  });
  
  it('should have staggered animation delays', () => {
    render(<DotsSpinner />);
    const dots = screen.getByTestId('dots-spinner').querySelectorAll('.animate-bounce');
    expect(dots[0]).toHaveStyle({ animationDelay: '0ms' });
    expect(dots[1]).toHaveStyle({ animationDelay: '150ms' });
    expect(dots[2]).toHaveStyle({ animationDelay: '300ms' });
  });
});

describe('PulseSpinner', () => {
  it('should render the pulse spinner', () => {
    render(<PulseSpinner />);
    expect(screen.getByTestId('pulse-spinner')).toBeInTheDocument();
  });
  
  it('should have role="status"', () => {
    render(<PulseSpinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
  
  it('should have ping animation', () => {
    render(<PulseSpinner />);
    const pingElement = screen.getByTestId('pulse-spinner').querySelector('.animate-ping');
    expect(pingElement).toBeInTheDocument();
  });
  
  it('should apply custom color', () => {
    render(<PulseSpinner color="#0000ff" />);
    const pingElement = screen.getByTestId('pulse-spinner').querySelector('.animate-ping');
    expect(pingElement).toHaveStyle({ backgroundColor: '#0000ff' });
  });
});
