/**
 * Skeleton component props
 */
export interface SkeletonProps {
  /**
   * Width of the skeleton
   * @default '100%'
   */
  width?: string | number;
  
  /**
   * Height of the skeleton
   * @default '1rem'
   */
  height?: string | number;
  
  /**
   * Border radius variant
   * @default 'default'
   */
  variant?: 'default' | 'circular' | 'rectangular' | 'text';
  
  /**
   * Animation type
   * @default 'pulse'
   */
  animation?: 'pulse' | 'wave' | 'none';
  
  /**
   * Number of lines (for text variant)
   * @default 1
   */
  lines?: number;
  
  /**
   * Last line width percentage (for text variant)
   * @default 60
   */
  lastLineWidth?: number;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Get border radius based on variant
 */
function getBorderRadius(variant: string): string {
  switch (variant) {
    case 'circular':
      return '9999px';
    case 'rectangular':
      return '0';
    case 'text':
      return '0.25rem';
    default:
      return '0.375rem';
  }
}

/**
 * Skeleton component
 * 
 * A placeholder loading animation for content that is still loading.
 */
export function Skeleton({
  width = '100%',
  height = '1rem',
  variant = 'default',
  animation = 'pulse',
  lines = 1,
  lastLineWidth = 60,
  className = '',
}: SkeletonProps) {
  const widthValue = typeof width === 'number' ? `${width}px` : width;
  const heightValue = typeof height === 'number' ? `${height}px` : height;
  const borderRadius = getBorderRadius(variant);
  
  // For text variant with multiple lines
  if (variant === 'text' && lines > 1) {
    return (
      <div
        data-testid="skeleton-lines"
        className={`space-y-2 ${className}`}
        style={{ width: widthValue }}
      >
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            data-testid="skeleton-line"
            className={`
              bg-gray-200
              ${animation === 'pulse' ? 'animate-pulse' : ''}
              ${animation === 'wave' ? 'animate-shimmer' : ''}
            `}
            style={{
              height: heightValue,
              borderRadius,
              width: i === lines - 1 ? `${lastLineWidth}%` : '100%',
            }}
          />
        ))}
      </div>
    );
  }
  
  return (
    <div
      data-testid="skeleton"
      className={`
        bg-gray-200 
        ${animation === 'pulse' ? 'animate-pulse' : ''}
        ${animation === 'wave' ? 'relative overflow-hidden' : ''}
        ${className}
      `}
      style={{
        width: variant === 'circular' ? heightValue : widthValue,
        height: heightValue,
        borderRadius,
      }}
    >
      {animation === 'wave' && (
        <div
          className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent"
        />
      )}
      
      {/* Wave animation styles */}
      {animation === 'wave' && (
        <style>{`
          @keyframes shimmer {
            100% {
              transform: translateX(100%);
            }
          }
          .animate-shimmer {
            animation: shimmer 1.5s infinite;
          }
        `}</style>
      )}
    </div>
  );
}

/**
 * Skeleton for avatar/profile pictures
 */
export function SkeletonAvatar({
  size = 40,
  animation = 'pulse',
  className = '',
}: {
  size?: number;
  animation?: 'pulse' | 'wave' | 'none';
  className?: string;
}) {
  return (
    <Skeleton
      variant="circular"
      width={size}
      height={size}
      animation={animation}
      className={className}
    />
  );
}

/**
 * Skeleton for buttons
 */
export function SkeletonButton({
  width = 100,
  height = 36,
  animation = 'pulse',
  className = '',
}: {
  width?: number | string;
  height?: number;
  animation?: 'pulse' | 'wave' | 'none';
  className?: string;
}) {
  return (
    <Skeleton
      width={width}
      height={height}
      animation={animation}
      className={`rounded-lg ${className}`}
    />
  );
}

/**
 * Skeleton for cards
 */
export function SkeletonCard({
  width = '100%',
  height = 200,
  animation = 'pulse',
  className = '',
}: {
  width?: number | string;
  height?: number;
  animation?: 'pulse' | 'wave' | 'none';
  className?: string;
}) {
  return (
    <div
      data-testid="skeleton-card"
      className={`rounded-lg overflow-hidden ${className}`}
      style={{ width: typeof width === 'number' ? `${width}px` : width }}
    >
      {/* Image placeholder */}
      <Skeleton
        height={height * 0.6}
        animation={animation}
        variant="rectangular"
      />
      
      {/* Content placeholders */}
      <div className="p-4 space-y-3">
        <Skeleton height={16} animation={animation} />
        <Skeleton height={12} width="80%" animation={animation} />
        <Skeleton height={12} width="60%" animation={animation} />
      </div>
    </div>
  );
}

/**
 * Skeleton for chat message lists
 */
// Predefined widths for message skeletons to avoid Math.random during render
const MESSAGE_WIDTHS = [160, 120, 180, 110, 150, 140, 170, 130, 190, 125];

export function SkeletonMessageList({
  count = 5,
  animation = 'pulse',
  className = '',
}: {
  count?: number;
  animation?: 'pulse' | 'wave' | 'none';
  className?: string;
}) {
  return (
    <div
      data-testid="skeleton-message-list"
      className={`space-y-4 ${className}`}
    >
      {Array.from({ length: count }).map((_, i) => {
        const isOutgoing = i % 2 === 1;
        const width = MESSAGE_WIDTHS[i % MESSAGE_WIDTHS.length];
        return (
          <div
            key={i}
            className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`
                flex items-end gap-2
                ${isOutgoing ? 'flex-row-reverse' : ''}
              `}
            >
              {!isOutgoing && (
                <SkeletonAvatar size={32} animation={animation} />
              )}
              <div className="space-y-1">
                <Skeleton
                  height={40}
                  width={width}
                  animation={animation}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Skeleton for color palette
 */
export function SkeletonColorPalette({
  colors = 6,
  animation = 'pulse',
  className = '',
}: {
  colors?: number;
  animation?: 'pulse' | 'wave' | 'none';
  className?: string;
}) {
  return (
    <div
      data-testid="skeleton-color-palette"
      className={`flex gap-2 ${className}`}
    >
      {Array.from({ length: colors }).map((_, i) => (
        <Skeleton
          key={i}
          variant="circular"
          width={40}
          height={40}
          animation={animation}
        />
      ))}
    </div>
  );
}

/**
 * Skeleton for theme preview
 */
export function SkeletonThemePreview({
  animation = 'pulse',
  className = '',
}: {
  animation?: 'pulse' | 'wave' | 'none';
  className?: string;
}) {
  return (
    <div
      data-testid="skeleton-theme-preview"
      className={`rounded-lg overflow-hidden border ${className}`}
    >
      {/* Title bar */}
      <Skeleton height={32} animation={animation} variant="rectangular" />
      
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 p-3 border-r space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <SkeletonAvatar size={48} animation={animation} />
              <div className="flex-1 space-y-1.5">
                <Skeleton height={14} width="70%" animation={animation} />
                <Skeleton height={12} width="90%" animation={animation} />
              </div>
            </div>
          ))}
        </div>
        
        {/* Chat area */}
        <div className="flex-1 p-4">
          <SkeletonMessageList count={4} animation={animation} />
        </div>
      </div>
      
      {/* Compose area */}
      <div className="flex items-center gap-3 p-3 border-t">
        <SkeletonAvatar size={24} animation={animation} />
        <Skeleton height={36} className="flex-1 rounded-full" animation={animation} />
        <SkeletonAvatar size={24} animation={animation} />
      </div>
    </div>
  );
}

export default Skeleton;
