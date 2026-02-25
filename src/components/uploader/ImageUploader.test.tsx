import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ImageUploader } from './ImageUploader';
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_FILE_SIZE,
  ERROR_MESSAGES,
} from './types';

// Helper to create a mock file
function createMockFile(
  name: string,
  size: number,
  type: string
): File {
  const content = new Array(size).fill('a').join('');
  return new File([content], name, { type });
}

// Helper to create a DataTransfer object for drag and drop
function createDataTransfer(files: File[]): DataTransfer {
  const dataTransfer = {
    files: files,
    items: files.map((file) => ({
      kind: 'file',
      type: file.type,
      getAsFile: () => file,
    })),
    types: ['Files'],
    getData: () => '',
    setData: () => {},
    clearData: () => {},
    setDragImage: () => {},
    dropEffect: 'none',
    effectAllowed: 'all',
  };
  return dataTransfer as unknown as DataTransfer;
}

describe('ImageUploader', () => {
  const mockOnImageUpload = vi.fn();
  const mockOnClear = vi.fn();
  const mockOnError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock FileReader with proper class
    class MockFileReader {
      onload: ((event: ProgressEvent<FileReader>) => void) | null = null;
      onerror: ((event: ProgressEvent<FileReader>) => void) | null = null;
      result: string | ArrayBuffer | null = null;
      readyState = 0;
      error: DOMException | null = null;
      EMPTY = 0;
      LOADING = 1;
      DONE = 2;
      onabort = null;
      onloadend = null;
      onloadstart = null;
      onprogress = null;
      abort = vi.fn();
      readAsArrayBuffer = vi.fn();
      readAsBinaryString = vi.fn();
      readAsText = vi.fn();
      addEventListener = vi.fn();
      removeEventListener = vi.fn();
      dispatchEvent = vi.fn();

      readAsDataURL() {
        setTimeout(() => {
          this.result = 'data:image/png;base64,mockbase64data';
          this.readyState = 2;
          this.onload?.({ target: this } as unknown as ProgressEvent<FileReader>);
        }, 10);
      }
    }
    vi.stubGlobal('FileReader', MockFileReader);
  });

  describe('rendering', () => {
    it('should render the drop zone', () => {
      render(<ImageUploader onImageUpload={mockOnImageUpload} />);
      expect(screen.getByTestId('drop-zone')).toBeInTheDocument();
    });

    it('should render upload instructions', () => {
      render(<ImageUploader onImageUpload={mockOnImageUpload} />);
      expect(screen.getByText(/click to upload/i)).toBeInTheDocument();
      expect(screen.getByText(/drag and drop/i)).toBeInTheDocument();
    });

    it('should display accepted file types', () => {
      render(<ImageUploader onImageUpload={mockOnImageUpload} />);
      expect(screen.getByText(/jpg.*png.*webp/i)).toBeInTheDocument();
    });

    it('should display max file size', () => {
      render(<ImageUploader onImageUpload={mockOnImageUpload} />);
      expect(screen.getByText(/10.*MB/i)).toBeInTheDocument();
    });

    it('should have hidden file input', () => {
      render(<ImageUploader onImageUpload={mockOnImageUpload} />);
      const input = screen.getByTestId('file-input');
      expect(input).toHaveClass('hidden');
    });

    it('should apply custom className', () => {
      render(
        <ImageUploader
          onImageUpload={mockOnImageUpload}
          className="custom-class"
        />
      );
      expect(screen.getByTestId('drop-zone').parentElement).toHaveClass('custom-class');
    });
  });

  describe('click to upload', () => {
    it('should open file dialog when drop zone is clicked', async () => {
      const user = userEvent.setup();
      render(<ImageUploader onImageUpload={mockOnImageUpload} />);

      const input = screen.getByTestId('file-input') as HTMLInputElement;
      const clickSpy = vi.spyOn(input, 'click');

      await user.click(screen.getByTestId('drop-zone'));
      expect(clickSpy).toHaveBeenCalled();
    });

    it('should not open file dialog when disabled', async () => {
      const user = userEvent.setup();
      render(<ImageUploader onImageUpload={mockOnImageUpload} disabled />);

      const input = screen.getByTestId('file-input') as HTMLInputElement;
      const clickSpy = vi.spyOn(input, 'click');

      await user.click(screen.getByTestId('drop-zone'));
      expect(clickSpy).not.toHaveBeenCalled();
    });

    it('should handle keyboard activation (Enter)', async () => {
      const user = userEvent.setup();
      render(<ImageUploader onImageUpload={mockOnImageUpload} />);

      const input = screen.getByTestId('file-input') as HTMLInputElement;
      const clickSpy = vi.spyOn(input, 'click');

      screen.getByTestId('drop-zone').focus();
      await user.keyboard('{Enter}');
      expect(clickSpy).toHaveBeenCalled();
    });

    it('should handle keyboard activation (Space)', async () => {
      const user = userEvent.setup();
      render(<ImageUploader onImageUpload={mockOnImageUpload} />);

      const input = screen.getByTestId('file-input') as HTMLInputElement;
      const clickSpy = vi.spyOn(input, 'click');

      screen.getByTestId('drop-zone').focus();
      await user.keyboard(' ');
      expect(clickSpy).toHaveBeenCalled();
    });
  });

  describe('file input change', () => {
    it('should process valid image file', async () => {
      render(<ImageUploader onImageUpload={mockOnImageUpload} />);

      const file = createMockFile('test.jpg', 1024, 'image/jpeg');
      const input = screen.getByTestId('file-input');

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(mockOnImageUpload).toHaveBeenCalledWith(
          file,
          expect.stringContaining('data:image')
        );
      });
    });

    it('should show preview after upload', async () => {
      render(<ImageUploader onImageUpload={mockOnImageUpload} />);

      const file = createMockFile('test.png', 1024, 'image/png');
      const input = screen.getByTestId('file-input');

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByTestId('image-preview')).toBeInTheDocument();
      });
    });

    it('should display file name after upload', async () => {
      render(<ImageUploader onImageUpload={mockOnImageUpload} />);

      const file = createMockFile('my-wallpaper.png', 1024, 'image/png');
      const input = screen.getByTestId('file-input');

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText('my-wallpaper.png')).toBeInTheDocument();
      });
    });
  });

  describe('drag and drop', () => {
    it('should show dragging state on drag enter', () => {
      render(<ImageUploader onImageUpload={mockOnImageUpload} />);
      const dropZone = screen.getByTestId('drop-zone');

      fireEvent.dragEnter(dropZone, {
        dataTransfer: createDataTransfer([]),
      });

      expect(screen.getByText(/drop image here/i)).toBeInTheDocument();
    });

    it('should reset state on drag leave', () => {
      render(<ImageUploader onImageUpload={mockOnImageUpload} />);
      const dropZone = screen.getByTestId('drop-zone');

      fireEvent.dragEnter(dropZone, {
        dataTransfer: createDataTransfer([]),
      });
      fireEvent.dragLeave(dropZone, {
        dataTransfer: createDataTransfer([]),
        relatedTarget: document.body,
      });

      expect(screen.getByText(/click to upload/i)).toBeInTheDocument();
    });

    it('should process dropped file', async () => {
      render(<ImageUploader onImageUpload={mockOnImageUpload} />);
      const dropZone = screen.getByTestId('drop-zone');

      const file = createMockFile('dropped.jpg', 1024, 'image/jpeg');

      fireEvent.drop(dropZone, {
        dataTransfer: createDataTransfer([file]),
      });

      await waitFor(() => {
        expect(mockOnImageUpload).toHaveBeenCalledWith(
          file,
          expect.stringContaining('data:image')
        );
      });
    });

    it('should not process drop when disabled', async () => {
      render(<ImageUploader onImageUpload={mockOnImageUpload} disabled />);
      const dropZone = screen.getByTestId('drop-zone');

      const file = createMockFile('dropped.jpg', 1024, 'image/jpeg');

      fireEvent.drop(dropZone, {
        dataTransfer: createDataTransfer([file]),
      });

      await waitFor(() => {
        expect(mockOnImageUpload).not.toHaveBeenCalled();
      });
    });
  });

  describe('file type validation', () => {
    it('should accept JPG files', async () => {
      render(<ImageUploader onImageUpload={mockOnImageUpload} />);

      const file = createMockFile('test.jpg', 1024, 'image/jpeg');
      fireEvent.change(screen.getByTestId('file-input'), {
        target: { files: [file] },
      });

      await waitFor(() => {
        expect(mockOnImageUpload).toHaveBeenCalled();
      });
    });

    it('should accept PNG files', async () => {
      render(<ImageUploader onImageUpload={mockOnImageUpload} />);

      const file = createMockFile('test.png', 1024, 'image/png');
      fireEvent.change(screen.getByTestId('file-input'), {
        target: { files: [file] },
      });

      await waitFor(() => {
        expect(mockOnImageUpload).toHaveBeenCalled();
      });
    });

    it('should accept WebP files', async () => {
      render(<ImageUploader onImageUpload={mockOnImageUpload} />);

      const file = createMockFile('test.webp', 1024, 'image/webp');
      fireEvent.change(screen.getByTestId('file-input'), {
        target: { files: [file] },
      });

      await waitFor(() => {
        expect(mockOnImageUpload).toHaveBeenCalled();
      });
    });

    it('should reject GIF files', async () => {
      render(
        <ImageUploader
          onImageUpload={mockOnImageUpload}
          onError={mockOnError}
        />
      );

      const file = createMockFile('test.gif', 1024, 'image/gif');
      fireEvent.change(screen.getByTestId('file-input'), {
        target: { files: [file] },
      });

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith(
          'invalid-type',
          ERROR_MESSAGES['invalid-type']
        );
      });
    });

    it('should reject PDF files', async () => {
      render(
        <ImageUploader
          onImageUpload={mockOnImageUpload}
          onError={mockOnError}
        />
      );

      const file = createMockFile('test.pdf', 1024, 'application/pdf');
      fireEvent.change(screen.getByTestId('file-input'), {
        target: { files: [file] },
      });

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith(
          'invalid-type',
          ERROR_MESSAGES['invalid-type']
        );
      });
    });

    it('should show error message for invalid type', async () => {
      render(<ImageUploader onImageUpload={mockOnImageUpload} />);

      const file = createMockFile('test.gif', 1024, 'image/gif');
      fireEvent.change(screen.getByTestId('file-input'), {
        target: { files: [file] },
      });

      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument();
        expect(screen.getByText(ERROR_MESSAGES['invalid-type'])).toBeInTheDocument();
      });
    });

    it('should accept custom file types', async () => {
      render(
        <ImageUploader
          onImageUpload={mockOnImageUpload}
          acceptedTypes={['image/gif']}
        />
      );

      const file = createMockFile('test.gif', 1024, 'image/gif');
      fireEvent.change(screen.getByTestId('file-input'), {
        target: { files: [file] },
      });

      await waitFor(() => {
        expect(mockOnImageUpload).toHaveBeenCalled();
      });
    });
  });

  describe('file size validation', () => {
    it('should accept files under size limit', async () => {
      render(<ImageUploader onImageUpload={mockOnImageUpload} />);

      const file = createMockFile('test.jpg', 5 * 1024 * 1024, 'image/jpeg'); // 5MB
      fireEvent.change(screen.getByTestId('file-input'), {
        target: { files: [file] },
      });

      await waitFor(() => {
        expect(mockOnImageUpload).toHaveBeenCalled();
      });
    });

    it('should reject files over size limit', async () => {
      render(
        <ImageUploader
          onImageUpload={mockOnImageUpload}
          onError={mockOnError}
        />
      );

      const file = createMockFile('test.jpg', 15 * 1024 * 1024, 'image/jpeg'); // 15MB
      fireEvent.change(screen.getByTestId('file-input'), {
        target: { files: [file] },
      });

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith(
          'file-too-large',
          ERROR_MESSAGES['file-too-large']
        );
      });
    });

    it('should show error message for oversized file', async () => {
      render(<ImageUploader onImageUpload={mockOnImageUpload} />);

      const file = createMockFile('test.jpg', 15 * 1024 * 1024, 'image/jpeg');
      fireEvent.change(screen.getByTestId('file-input'), {
        target: { files: [file] },
      });

      await waitFor(() => {
        expect(screen.getByText(ERROR_MESSAGES['file-too-large'])).toBeInTheDocument();
      });
    });

    it('should accept custom max file size', async () => {
      render(
        <ImageUploader
          onImageUpload={mockOnImageUpload}
          maxFileSize={1024} // 1KB
          onError={mockOnError}
        />
      );

      const file = createMockFile('test.jpg', 2048, 'image/jpeg'); // 2KB
      fireEvent.change(screen.getByTestId('file-input'), {
        target: { files: [file] },
      });

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith(
          'file-too-large',
          expect.any(String)
        );
      });
    });
  });

  describe('upload progress', () => {
    it('should show progress indicator during upload', async () => {
      render(<ImageUploader onImageUpload={mockOnImageUpload} />);

      const file = createMockFile('test.jpg', 1024, 'image/jpeg');
      fireEvent.change(screen.getByTestId('file-input'), {
        target: { files: [file] },
      });

      // Progress should show immediately
      expect(screen.getByTestId('upload-progress')).toBeInTheDocument();
    });

    it('should show progress bar', async () => {
      render(<ImageUploader onImageUpload={mockOnImageUpload} />);

      const file = createMockFile('test.jpg', 1024, 'image/jpeg');
      fireEvent.change(screen.getByTestId('file-input'), {
        target: { files: [file] },
      });

      expect(screen.getByTestId('progress-bar')).toBeInTheDocument();
    });

    it('should show uploading text', async () => {
      render(<ImageUploader onImageUpload={mockOnImageUpload} />);

      const file = createMockFile('test.jpg', 1024, 'image/jpeg');
      fireEvent.change(screen.getByTestId('file-input'), {
        target: { files: [file] },
      });

      expect(screen.getByText(/uploading/i)).toBeInTheDocument();
    });
  });

  describe('clear functionality', () => {
    it('should show clear button after upload', async () => {
      render(<ImageUploader onImageUpload={mockOnImageUpload} />);

      const file = createMockFile('test.jpg', 1024, 'image/jpeg');
      fireEvent.change(screen.getByTestId('file-input'), {
        target: { files: [file] },
      });

      await waitFor(() => {
        expect(screen.getByTestId('clear-button')).toBeInTheDocument();
      });
    });

    it('should clear upload when clear button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <ImageUploader
          onImageUpload={mockOnImageUpload}
          onClear={mockOnClear}
        />
      );

      const file = createMockFile('test.jpg', 1024, 'image/jpeg');
      fireEvent.change(screen.getByTestId('file-input'), {
        target: { files: [file] },
      });

      await waitFor(() => {
        expect(screen.getByTestId('clear-button')).toBeInTheDocument();
      });

      await user.click(screen.getByTestId('clear-button'));

      expect(mockOnClear).toHaveBeenCalled();
      expect(screen.queryByTestId('image-preview')).not.toBeInTheDocument();
    });

    it('should reset to idle state after clear', async () => {
      const user = userEvent.setup();
      render(<ImageUploader onImageUpload={mockOnImageUpload} />);

      const file = createMockFile('test.jpg', 1024, 'image/jpeg');
      fireEvent.change(screen.getByTestId('file-input'), {
        target: { files: [file] },
      });

      await waitFor(() => {
        expect(screen.getByTestId('clear-button')).toBeInTheDocument();
      });

      await user.click(screen.getByTestId('clear-button'));

      expect(screen.getByText(/click to upload/i)).toBeInTheDocument();
    });

    it('should show try again button on error', async () => {
      const user = userEvent.setup();
      render(<ImageUploader onImageUpload={mockOnImageUpload} />);

      const file = createMockFile('test.gif', 1024, 'image/gif');
      fireEvent.change(screen.getByTestId('file-input'), {
        target: { files: [file] },
      });

      await waitFor(() => {
        expect(screen.getByText(/try again/i)).toBeInTheDocument();
      });

      await user.click(screen.getByText(/try again/i));

      expect(screen.getByText(/click to upload/i)).toBeInTheDocument();
    });
  });

  describe('disabled state', () => {
    it('should show disabled styling', () => {
      render(<ImageUploader onImageUpload={mockOnImageUpload} disabled />);
      expect(screen.getByTestId('drop-zone')).toHaveClass('opacity-50');
      expect(screen.getByTestId('drop-zone')).toHaveClass('cursor-not-allowed');
    });

    it('should have disabled file input', () => {
      render(<ImageUploader onImageUpload={mockOnImageUpload} disabled />);
      expect(screen.getByTestId('file-input')).toBeDisabled();
    });

    it('should have tabIndex -1 when disabled', () => {
      render(<ImageUploader onImageUpload={mockOnImageUpload} disabled />);
      expect(screen.getByTestId('drop-zone')).toHaveAttribute('tabIndex', '-1');
    });
  });

  describe('accessibility', () => {
    it('should have role button', () => {
      render(<ImageUploader onImageUpload={mockOnImageUpload} />);
      expect(screen.getByTestId('drop-zone')).toHaveAttribute('role', 'button');
    });

    it('should have aria-label', () => {
      render(<ImageUploader onImageUpload={mockOnImageUpload} />);
      expect(screen.getByTestId('drop-zone')).toHaveAttribute('aria-label', 'Upload image');
    });

    it('should be focusable', () => {
      render(<ImageUploader onImageUpload={mockOnImageUpload} />);
      expect(screen.getByTestId('drop-zone')).toHaveAttribute('tabIndex', '0');
    });

    it('should have aria-label on clear button', async () => {
      render(<ImageUploader onImageUpload={mockOnImageUpload} />);

      const file = createMockFile('test.jpg', 1024, 'image/jpeg');
      fireEvent.change(screen.getByTestId('file-input'), {
        target: { files: [file] },
      });

      await waitFor(() => {
        expect(screen.getByTestId('clear-button')).toHaveAttribute(
          'aria-label',
          'Remove image'
        );
      });
    });
  });

  describe('constants', () => {
    it('should export accepted image types', () => {
      expect(ACCEPTED_IMAGE_TYPES).toContain('image/jpeg');
      expect(ACCEPTED_IMAGE_TYPES).toContain('image/png');
      expect(ACCEPTED_IMAGE_TYPES).toContain('image/webp');
    });

    it('should export max file size as 10MB', () => {
      expect(MAX_FILE_SIZE).toBe(10 * 1024 * 1024);
    });

    it('should export error messages', () => {
      expect(ERROR_MESSAGES['invalid-type']).toBeDefined();
      expect(ERROR_MESSAGES['file-too-large']).toBeDefined();
      expect(ERROR_MESSAGES['no-file']).toBeDefined();
      expect(ERROR_MESSAGES['upload-failed']).toBeDefined();
    });
  });
});
