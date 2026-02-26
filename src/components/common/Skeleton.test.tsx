import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Skeleton,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonCard,
  SkeletonMessageList,
  SkeletonColorPalette,
  SkeletonThemePreview,
} from './Skeleton';

describe('Skeleton', () => {
  describe('rendering', () => {
    it('should render the skeleton element', () => {
      render(<Skeleton />);
      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    });
    
    it('should apply custom width and height', () => {
      render(<Skeleton width={200} height={100} />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveStyle({ width: '200px', height: '100px' });
    });
    
    it('should apply string dimensions', () => {
      render(<Skeleton width="50%" height="2rem" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveStyle({ width: '50%', height: '2rem' });
    });
    
    it('should apply custom className', () => {
      render(<Skeleton className="custom-class" />);
      expect(screen.getByTestId('skeleton')).toHaveClass('custom-class');
    });
  });
  
  describe('variants', () => {
    it('should render default variant with rounded corners', () => {
      render(<Skeleton variant="default" />);
      expect(screen.getByTestId('skeleton')).toHaveStyle({ borderRadius: '0.375rem' });
    });
    
    it('should render circular variant with full border radius', () => {
      render(<Skeleton variant="circular" height={40} />);
      expect(screen.getByTestId('skeleton')).toHaveStyle({ borderRadius: '9999px' });
    });
    
    it('should render rectangular variant with no border radius', () => {
      render(<Skeleton variant="rectangular" />);
      expect(screen.getByTestId('skeleton')).toHaveStyle({ borderRadius: '0' });
    });
    
    it('should render text variant with small border radius', () => {
      render(<Skeleton variant="text" />);
      expect(screen.getByTestId('skeleton')).toHaveStyle({ borderRadius: '0.25rem' });
    });
  });
  
  describe('animation', () => {
    it('should apply pulse animation by default', () => {
      render(<Skeleton />);
      expect(screen.getByTestId('skeleton')).toHaveClass('animate-pulse');
    });
    
    it('should apply wave animation with overflow hidden', () => {
      render(<Skeleton animation="wave" />);
      expect(screen.getByTestId('skeleton')).toHaveClass('overflow-hidden');
    });
    
    it('should not animate when animation is none', () => {
      render(<Skeleton animation="none" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).not.toHaveClass('animate-pulse');
    });
  });
  
  describe('text lines', () => {
    it('should render multiple lines with text variant', () => {
      render(<Skeleton variant="text" lines={3} />);
      const lines = screen.getAllByTestId('skeleton-line');
      expect(lines).toHaveLength(3);
    });
    
    it('should render last line shorter', () => {
      render(<Skeleton variant="text" lines={3} lastLineWidth={60} />);
      const lines = screen.getAllByTestId('skeleton-line');
      expect(lines[2]).toHaveStyle({ width: '60%' });
    });
  });
});

describe('SkeletonAvatar', () => {
  it('should render a circular skeleton', () => {
    render(<SkeletonAvatar />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveStyle({ borderRadius: '9999px' });
  });
  
  it('should apply default size (40px)', () => {
    render(<SkeletonAvatar />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveStyle({ width: '40px', height: '40px' });
  });
  
  it('should apply custom size', () => {
    render(<SkeletonAvatar size={64} />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveStyle({ width: '64px', height: '64px' });
  });
  
  it('should apply custom animation', () => {
    render(<SkeletonAvatar animation="none" />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).not.toHaveClass('animate-pulse');
  });
});

describe('SkeletonButton', () => {
  it('should render a skeleton button', () => {
    render(<SkeletonButton />);
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });
  
  it('should apply default dimensions', () => {
    render(<SkeletonButton />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveStyle({ width: '100px', height: '36px' });
  });
  
  it('should apply custom width', () => {
    render(<SkeletonButton width={200} />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveStyle({ width: '200px' });
  });
  
  it('should apply custom height', () => {
    render(<SkeletonButton height={48} />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveStyle({ height: '48px' });
  });
  
  it('should have rounded corners', () => {
    render(<SkeletonButton />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveClass('rounded-lg');
  });
});

describe('SkeletonCard', () => {
  it('should render a card container', () => {
    render(<SkeletonCard />);
    expect(screen.getByTestId('skeleton-card')).toBeInTheDocument();
  });
  
  it('should have rounded corners and overflow hidden', () => {
    render(<SkeletonCard />);
    const card = screen.getByTestId('skeleton-card');
    expect(card).toHaveClass('rounded-lg', 'overflow-hidden');
  });
  
  it('should render multiple skeleton elements (image and content)', () => {
    render(<SkeletonCard />);
    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons.length).toBeGreaterThan(1);
  });
  
  it('should apply custom width', () => {
    render(<SkeletonCard width={300} />);
    const card = screen.getByTestId('skeleton-card');
    expect(card).toHaveStyle({ width: '300px' });
  });
  
  it('should apply custom className', () => {
    render(<SkeletonCard className="custom-card" />);
    expect(screen.getByTestId('skeleton-card')).toHaveClass('custom-card');
  });
});

describe('SkeletonMessageList', () => {
  it('should render default 5 messages', () => {
    render(<SkeletonMessageList />);
    const list = screen.getByTestId('skeleton-message-list');
    // Count direct children (message wrappers)
    expect(list.children).toHaveLength(5);
  });
  
  it('should render specified number of messages', () => {
    render(<SkeletonMessageList count={3} />);
    const list = screen.getByTestId('skeleton-message-list');
    expect(list.children).toHaveLength(3);
  });
  
  it('should render alternating message alignment', () => {
    render(<SkeletonMessageList count={4} />);
    const list = screen.getByTestId('skeleton-message-list');
    const messages = list.children;
    // First (index 0) should be justify-start (incoming)
    expect(messages[0]).toHaveClass('justify-start');
    // Second (index 1) should be justify-end (outgoing)
    expect(messages[1]).toHaveClass('justify-end');
    expect(messages[2]).toHaveClass('justify-start');
    expect(messages[3]).toHaveClass('justify-end');
  });
  
  it('should apply custom className', () => {
    render(<SkeletonMessageList className="custom-messages" />);
    expect(screen.getByTestId('skeleton-message-list')).toHaveClass('custom-messages');
  });
});

describe('SkeletonColorPalette', () => {
  it('should render default 6 color swatches', () => {
    render(<SkeletonColorPalette />);
    const container = screen.getByTestId('skeleton-color-palette');
    const swatches = container.querySelectorAll('[data-testid="skeleton"]');
    expect(swatches).toHaveLength(6);
  });
  
  it('should render specified number of swatches', () => {
    render(<SkeletonColorPalette colors={8} />);
    const container = screen.getByTestId('skeleton-color-palette');
    const swatches = container.querySelectorAll('[data-testid="skeleton"]');
    expect(swatches).toHaveLength(8);
  });
  
  it('should render circular swatches', () => {
    render(<SkeletonColorPalette />);
    const container = screen.getByTestId('skeleton-color-palette');
    const swatches = container.querySelectorAll('[data-testid="skeleton"]');
    swatches.forEach((swatch) => {
      expect(swatch).toHaveStyle({ borderRadius: '9999px' });
    });
  });
  
  it('should apply custom className', () => {
    render(<SkeletonColorPalette className="custom-palette" />);
    expect(screen.getByTestId('skeleton-color-palette')).toHaveClass('custom-palette');
  });
});

describe('SkeletonThemePreview', () => {
  it('should render the preview container', () => {
    render(<SkeletonThemePreview />);
    expect(screen.getByTestId('skeleton-theme-preview')).toBeInTheDocument();
  });
  
  it('should have rounded corners and border', () => {
    render(<SkeletonThemePreview />);
    const preview = screen.getByTestId('skeleton-theme-preview');
    expect(preview).toHaveClass('rounded-lg', 'border');
  });
  
  it('should include message list skeleton', () => {
    render(<SkeletonThemePreview />);
    expect(screen.getByTestId('skeleton-message-list')).toBeInTheDocument();
  });
  
  it('should include multiple skeleton elements', () => {
    render(<SkeletonThemePreview />);
    const skeletons = screen.getAllByTestId('skeleton');
    // Should have multiple skeleton elements (header, avatars, messages, etc.)
    expect(skeletons.length).toBeGreaterThan(5);
  });
  
  it('should apply custom className', () => {
    render(<SkeletonThemePreview className="custom-preview" />);
    expect(screen.getByTestId('skeleton-theme-preview')).toHaveClass('custom-preview');
  });
});
