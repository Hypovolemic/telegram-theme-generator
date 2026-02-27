import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PrivacyPolicy } from './PrivacyPolicy';

describe('PrivacyPolicy', () => {
  const defaultProps = {
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render the privacy policy modal', () => {
      render(<PrivacyPolicy {...defaultProps} />);
      
      expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    });

    it('should render the TL;DR summary section', () => {
      render(<PrivacyPolicy {...defaultProps} />);
      
      expect(screen.getByText("TL;DR: Your Privacy is Guaranteed")).toBeInTheDocument();
      expect(screen.getByText(/never leave your device/)).toBeInTheDocument();
    });

    it('should render the How It Works section', () => {
      render(<PrivacyPolicy {...defaultProps} />);
      
      expect(screen.getByText('How It Works')).toBeInTheDocument();
      expect(screen.getByText(/client-side processing/i)).toBeInTheDocument();
    });

    it('should render the What We Don\'t Collect section', () => {
      render(<PrivacyPolicy {...defaultProps} />);
      
      expect(screen.getByText("What We Don't Collect")).toBeInTheDocument();
      expect(screen.getByText('Your images or photos')).toBeInTheDocument();
      expect(screen.getByText('Usage analytics or metrics')).toBeInTheDocument();
    });

    it('should render the Technical Details section', () => {
      render(<PrivacyPolicy {...defaultProps} />);
      
      expect(screen.getByText('Technical Details')).toBeInTheDocument();
      expect(screen.getByText(/HTML5 Canvas API/i)).toBeInTheDocument();
    });

    it('should render the Open Source section with GitHub link', () => {
      render(<PrivacyPolicy {...defaultProps} />);
      
      expect(screen.getByText('Open Source Transparency')).toBeInTheDocument();
      const githubLink = screen.getByRole('link', { name: 'GitHub' });
      expect(githubLink).toHaveAttribute('href', 'https://github.com/Hypovolemic/telegram-theme-generator');
    });

    it('should render the processing flow steps', () => {
      render(<PrivacyPolicy {...defaultProps} />);
      
      expect(screen.getByText('Processing Flow:')).toBeInTheDocument();
      expect(screen.getByText('You select an image from your device')).toBeInTheDocument();
      expect(screen.getByText(/image loads into your browser's memory/)).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('should call onClose when close button is clicked', () => {
      render(<PrivacyPolicy {...defaultProps} />);
      
      const closeButton = screen.getByRole('button', { name: /close privacy policy/i });
      fireEvent.click(closeButton);
      
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when "Got it, thanks!" button is clicked', () => {
      render(<PrivacyPolicy {...defaultProps} />);
      
      const gotItButton = screen.getByRole('button', { name: /got it, thanks!/i });
      fireEvent.click(gotItButton);
      
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('accessibility', () => {
    it('should have proper heading structure', () => {
      render(<PrivacyPolicy {...defaultProps} />);
      
      const mainHeading = screen.getByRole('heading', { name: 'Privacy Policy', level: 2 });
      expect(mainHeading).toBeInTheDocument();
    });

    it('should have accessible close button', () => {
      render(<PrivacyPolicy {...defaultProps} />);
      
      const closeButton = screen.getByRole('button', { name: /close privacy policy/i });
      expect(closeButton).toBeInTheDocument();
    });

    it('should have links with proper attributes', () => {
      render(<PrivacyPolicy {...defaultProps} />);
      
      const githubLink = screen.getByRole('link', { name: 'GitHub' });
      expect(githubLink).toHaveAttribute('target', '_blank');
      expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });
});
