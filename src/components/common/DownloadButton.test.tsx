import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DownloadButton } from './DownloadButton';

// Mock file-utils
vi.mock('../../utils/file-utils', () => ({
  downloadTheme: vi.fn(),
}));

import { downloadTheme } from '../../utils/file-utils';

describe('DownloadButton', () => {
  const mockContent = 'windowBg: #ffffff;\nwindowFg: #000000;';
  const mockFilename = 'test-theme';

  beforeEach(() => {
    vi.clearAllMocks();
    // Default successful download
    vi.mocked(downloadTheme).mockImplementation(async (options) => {
      options.onStart?.();
      const result = { success: true, filename: `${options.filename}.tdesktop-theme` };
      options.onSuccess?.(result);
      return result;
    });
  });

  describe('rendering', () => {
    it('should render the download button', () => {
      render(<DownloadButton content={mockContent} filename={mockFilename} />);
      expect(screen.getByTestId('download-button')).toBeInTheDocument();
    });

    it('should display default text', () => {
      render(<DownloadButton content={mockContent} filename={mockFilename} />);
      expect(screen.getByText('Download Theme')).toBeInTheDocument();
    });

    it('should render custom children', () => {
      render(
        <DownloadButton content={mockContent} filename={mockFilename}>
          Custom Download Text
        </DownloadButton>
      );
      expect(screen.getByText('Custom Download Text')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <DownloadButton
          content={mockContent}
          filename={mockFilename}
          className="custom-class"
        />
      );
      expect(screen.getByTestId('download-button')).toHaveClass('custom-class');
    });
  });

  describe('variants', () => {
    it('should apply primary variant styles', () => {
      render(
        <DownloadButton
          content={mockContent}
          filename={mockFilename}
          variant="primary"
        />
      );
      expect(screen.getByTestId('download-button')).toHaveClass('bg-blue-600');
    });

    it('should apply secondary variant styles', () => {
      render(
        <DownloadButton
          content={mockContent}
          filename={mockFilename}
          variant="secondary"
        />
      );
      expect(screen.getByTestId('download-button')).toHaveClass('bg-gray-600');
    });

    it('should apply outline variant styles', () => {
      render(
        <DownloadButton
          content={mockContent}
          filename={mockFilename}
          variant="outline"
        />
      );
      expect(screen.getByTestId('download-button')).toHaveClass('border-blue-600');
    });
  });

  describe('sizes', () => {
    it('should apply small size styles', () => {
      render(
        <DownloadButton
          content={mockContent}
          filename={mockFilename}
          size="small"
        />
      );
      expect(screen.getByTestId('download-button')).toHaveClass('text-sm');
    });

    it('should apply medium size styles', () => {
      render(
        <DownloadButton
          content={mockContent}
          filename={mockFilename}
          size="medium"
        />
      );
      expect(screen.getByTestId('download-button')).toHaveClass('text-base');
    });

    it('should apply large size styles', () => {
      render(
        <DownloadButton
          content={mockContent}
          filename={mockFilename}
          size="large"
        />
      );
      expect(screen.getByTestId('download-button')).toHaveClass('text-lg');
    });
  });

  describe('click behavior', () => {
    it('should call downloadTheme when clicked', async () => {
      const user = userEvent.setup();
      render(<DownloadButton content={mockContent} filename={mockFilename} />);

      await user.click(screen.getByTestId('download-button'));

      expect(downloadTheme).toHaveBeenCalledWith(
        expect.objectContaining({
          filename: mockFilename,
          content: mockContent,
        })
      );
    });

    it('should not call downloadTheme when disabled', async () => {
      const user = userEvent.setup();
      render(
        <DownloadButton content={mockContent} filename={mockFilename} disabled />
      );

      await user.click(screen.getByTestId('download-button'));

      expect(downloadTheme).not.toHaveBeenCalled();
    });
  });

  describe('loading state', () => {
    it('should show downloading text while downloading', async () => {
      // Make download hang
      vi.mocked(downloadTheme).mockImplementation(async (options) => {
        options.onStart?.();
        // Don't resolve immediately
        return new Promise(() => {});
      });

      render(<DownloadButton content={mockContent} filename={mockFilename} />);

      fireEvent.click(screen.getByTestId('download-button'));

      await waitFor(() => {
        expect(screen.getByText('Downloading...')).toBeInTheDocument();
      });
    });

    it('should have aria-busy while downloading', async () => {
      vi.mocked(downloadTheme).mockImplementation(async (options) => {
        options.onStart?.();
        return new Promise(() => {});
      });

      render(<DownloadButton content={mockContent} filename={mockFilename} />);

      fireEvent.click(screen.getByTestId('download-button'));

      await waitFor(() => {
        expect(screen.getByTestId('download-button')).toHaveAttribute('aria-busy', 'true');
      });
    });

    it('should be disabled while downloading', async () => {
      vi.mocked(downloadTheme).mockImplementation(async (options) => {
        options.onStart?.();
        return new Promise(() => {});
      });

      render(<DownloadButton content={mockContent} filename={mockFilename} />);

      fireEvent.click(screen.getByTestId('download-button'));

      await waitFor(() => {
        expect(screen.getByTestId('download-button')).toBeDisabled();
      });
    });
  });

  describe('success state', () => {
    it('should show success text after download', async () => {
      render(<DownloadButton content={mockContent} filename={mockFilename} />);

      fireEvent.click(screen.getByTestId('download-button'));

      await waitFor(() => {
        expect(screen.getByText('Downloaded!')).toBeInTheDocument();
      });
    });

    it('should show success notification', async () => {
      render(<DownloadButton content={mockContent} filename={mockFilename} />);

      fireEvent.click(screen.getByTestId('download-button'));

      await waitFor(() => {
        expect(screen.getByTestId('notification-success')).toBeInTheDocument();
      });
    });

    it('should call onSuccess callback', async () => {
      const onSuccess = vi.fn();
      render(
        <DownloadButton
          content={mockContent}
          filename={mockFilename}
          onSuccess={onSuccess}
        />
      );

      fireEvent.click(screen.getByTestId('download-button'));

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledWith(
          expect.objectContaining({
            success: true,
            filename: expect.stringContaining('.tdesktop-theme'),
          })
        );
      });
    });
  });

  describe('error state', () => {
    beforeEach(() => {
      vi.mocked(downloadTheme).mockImplementation(async (options) => {
        options.onStart?.();
        const error = new Error('Download failed');
        options.onError?.(error);
        return { success: false, filename: options.filename, error: 'Download failed' };
      });
    });

    it('should show error text on failure', async () => {
      render(<DownloadButton content={mockContent} filename={mockFilename} />);

      fireEvent.click(screen.getByTestId('download-button'));

      await waitFor(() => {
        expect(screen.getByText('Failed')).toBeInTheDocument();
      });
    });

    it('should show error notification', async () => {
      render(<DownloadButton content={mockContent} filename={mockFilename} />);

      fireEvent.click(screen.getByTestId('download-button'));

      await waitFor(() => {
        expect(screen.getByTestId('notification-error')).toBeInTheDocument();
      });
    });

    it('should call onError callback', async () => {
      const onError = vi.fn();
      render(
        <DownloadButton
          content={mockContent}
          filename={mockFilename}
          onError={onError}
        />
      );

      fireEvent.click(screen.getByTestId('download-button'));

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(expect.any(Error));
      });
    });
  });

  describe('notification', () => {
    it('should dismiss notification on button click', async () => {
      const user = userEvent.setup();
      render(<DownloadButton content={mockContent} filename={mockFilename} />);

      fireEvent.click(screen.getByTestId('download-button'));

      await waitFor(() => {
        expect(screen.getByTestId('notification-success')).toBeInTheDocument();
      });

      const dismissButton = screen.getByLabelText('Dismiss notification');
      await user.click(dismissButton);

      expect(screen.queryByTestId('notification-success')).not.toBeInTheDocument();
    });

    it('should show filename in success notification', async () => {
      render(<DownloadButton content={mockContent} filename={mockFilename} />);

      fireEvent.click(screen.getByTestId('download-button'));

      await waitFor(() => {
        expect(screen.getByText(/test-theme\.tdesktop-theme/)).toBeInTheDocument();
      });
    });
  });

  describe('disabled state', () => {
    it('should have disabled attribute', () => {
      render(
        <DownloadButton content={mockContent} filename={mockFilename} disabled />
      );
      expect(screen.getByTestId('download-button')).toBeDisabled();
    });

    it('should have disabled cursor style', () => {
      render(
        <DownloadButton content={mockContent} filename={mockFilename} disabled />
      );
      expect(screen.getByTestId('download-button')).toHaveClass('disabled:cursor-not-allowed');
    });
  });

  describe('feedbackDuration', () => {
    it('should reset to idle after feedbackDuration', async () => {
      // Use a very short feedback duration so the test runs quickly
      render(
        <DownloadButton
          content={mockContent}
          filename={mockFilename}
          feedbackDuration={50}
        />
      );

      fireEvent.click(screen.getByTestId('download-button'));

      await waitFor(() => {
        expect(screen.getByText('Downloaded!')).toBeInTheDocument();
      });

      // Wait for feedbackDuration to elapse
      await waitFor(() => {
        expect(screen.getByText('Download Theme')).toBeInTheDocument();
      }, { timeout: 200 });
    });
  });
});
