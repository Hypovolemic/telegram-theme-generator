import { useMemo } from 'react';

/**
 * ProgressBar component props
 */
export interface ProgressBarProps {
  /**
   * Current progress value (0-100)
   */
  value: number;
  
  /**
   * Maximum value
   * @default 100
   */
  max?: number;
  
  /**
   * Size variant
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Color variant or custom color
   * @default 'primary'
   */
  variant?: 'primary' | 'success' | 'warning' | 'error' | string;
  
  /**
   * Show percentage label
   * @default false
   */
  showLabel?: boolean;
  
  /**
   * Custom label format function
   */
  formatLabel?: (value: number, max: number) => string;
  
  /**
   * Enable animation
   * @default true
   */
  animated?: boolean;
  
  /**
   * Show indeterminate loading state
   * @default false
   */
  indeterminate?: boolean;
  
  /**
   * Show striped pattern
   * @default false
   */
  striped?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Accessible label
   */
  label?: string;
}

const sizeClasses = {
  small: 'h-1',
  medium: 'h-2',
  large: 'h-4',
};

const variantColors: Record<string, string> = {
  primary: '#3b82f6',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
};

/**
 * ProgressBar component
 * 
 * A progress indicator with customizable appearance and animations.
 */
export function ProgressBar({
  value,
  max = 100,
  size = 'medium',
  variant = 'primary',
  showLabel = false,
  formatLabel,
  animated = true,
  indeterminate = false,
  striped = false,
  className = '',
  label,
}: ProgressBarProps) {
  // Calculate percentage
  const percentage = useMemo(() => {
    if (indeterminate) return 100;
    return Math.min(Math.max((value / max) * 100, 0), 100);
  }, [value, max, indeterminate]);
  
  // Get color
  const color = variantColors[variant] || variant;
  
  // Format label text
  const labelText = useMemo(() => {
    if (formatLabel) {
      return formatLabel(value, max);
    }
    return `${Math.round(percentage)}%`;
  }, [value, max, percentage, formatLabel]);
  
  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          {label && (
            <span className="text-sm font-medium text-gray-700">{label}</span>
          )}
          <span className="text-sm text-gray-500">{labelText}</span>
        </div>
      )}
      
      {/* Progress track */}
      <div
        data-testid="progress-bar"
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || 'Progress'}
        className={`
          w-full rounded-full bg-gray-200 overflow-hidden
          ${sizeClasses[size]}
        `}
      >
        {/* Progress fill */}
        <div
          data-testid="progress-fill"
          className={`
            h-full rounded-full
            ${animated && !indeterminate ? 'transition-all duration-300 ease-out' : ''}
            ${indeterminate ? 'animate-progress-indeterminate' : ''}
            ${striped ? 'bg-stripes' : ''}
          `}
          style={{
            width: indeterminate ? '40%' : `${percentage}%`,
            backgroundColor: color,
            backgroundImage: striped
              ? `linear-gradient(
                  45deg,
                  rgba(255, 255, 255, 0.15) 25%,
                  transparent 25%,
                  transparent 50%,
                  rgba(255, 255, 255, 0.15) 50%,
                  rgba(255, 255, 255, 0.15) 75%,
                  transparent 75%,
                  transparent
                )`
              : undefined,
            backgroundSize: striped ? '1rem 1rem' : undefined,
            animation: striped && animated
              ? 'progress-stripes 1s linear infinite'
              : indeterminate
                ? 'progress-indeterminate 1.5s ease-in-out infinite'
                : undefined,
          }}
        />
      </div>
      
      {/* Inline styles for animations */}
      <style>{`
        @keyframes progress-indeterminate {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(150%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        
        @keyframes progress-stripes {
          from {
            background-position: 1rem 0;
          }
          to {
            background-position: 0 0;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Circular progress indicator
 */
export interface CircularProgressProps {
  /**
   * Current progress value (0-100)
   */
  value: number;
  
  /**
   * Size in pixels
   * @default 48
   */
  size?: number;
  
  /**
   * Stroke width in pixels
   * @default 4
   */
  strokeWidth?: number;
  
  /**
   * Color
   * @default '#3b82f6'
   */
  color?: string;
  
  /**
   * Track color
   * @default '#e5e7eb'
   */
  trackColor?: string;
  
  /**
   * Show percentage in center
   * @default false
   */
  showValue?: boolean;
  
  /**
   * Indeterminate spinning state
   * @default false
   */
  indeterminate?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Accessible label
   */
  label?: string;
}

export function CircularProgress({
  value,
  size = 48,
  strokeWidth = 4,
  color = '#3b82f6',
  trackColor = '#e5e7eb',
  showValue = false,
  indeterminate = false,
  className = '',
  label = 'Progress',
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(Math.max(value, 0), 100);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div
      data-testid="circular-progress"
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        className={indeterminate ? 'animate-spin' : ''}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={indeterminate ? circumference * 0.75 : strokeDashoffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="transition-all duration-300 ease-out"
        />
      </svg>
      
      {/* Center value */}
      {showValue && !indeterminate && (
        <span
          className="absolute text-xs font-semibold"
          style={{ color }}
        >
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
}

export default ProgressBar;
