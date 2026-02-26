/**
 * Spinner component props
 */
export interface SpinnerProps {
  /**
   * Size of the spinner
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Color of the spinner (CSS color value)
   * @default 'currentColor'
   */
  color?: string;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Accessible label for screen readers
   * @default 'Loading'
   */
  label?: string;
}

const sizeClasses = {
  small: 'w-4 h-4',
  medium: 'w-8 h-8',
  large: 'w-12 h-12',
};

const borderSizeClasses = {
  small: 'border-2',
  medium: 'border-3',
  large: 'border-4',
};

/**
 * Spinner component
 * 
 * A loading spinner with customizable size and color.
 * Uses CSS animations for smooth rotation.
 */
export function Spinner({
  size = 'medium',
  color = 'currentColor',
  className = '',
  label = 'Loading',
}: SpinnerProps) {
  return (
    <div
      data-testid="spinner"
      role="status"
      aria-label={label}
      className={`
        inline-block rounded-full
        animate-spin
        ${sizeClasses[size]}
        ${borderSizeClasses[size]}
        ${className}
      `}
      style={{
        borderColor: `${color}20`,
        borderTopColor: color,
      }}
    >
      <span className="sr-only">{label}</span>
    </div>
  );
}

/**
 * Dots spinner variant
 * Three bouncing dots animation
 */
export function DotsSpinner({
  size = 'medium',
  color = 'currentColor',
  className = '',
  label = 'Loading',
}: SpinnerProps) {
  const dotSizeClasses = {
    small: 'w-1.5 h-1.5',
    medium: 'w-2 h-2',
    large: 'w-3 h-3',
  };
  
  const gapClasses = {
    small: 'gap-1',
    medium: 'gap-1.5',
    large: 'gap-2',
  };
  
  return (
    <div
      data-testid="dots-spinner"
      role="status"
      aria-label={label}
      className={`flex items-center ${gapClasses[size]} ${className}`}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`rounded-full animate-bounce ${dotSizeClasses[size]}`}
          style={{
            backgroundColor: color,
            animationDelay: `${i * 150}ms`,
            animationDuration: '600ms',
          }}
        />
      ))}
      <span className="sr-only">{label}</span>
    </div>
  );
}

/**
 * Pulse spinner variant
 * Expanding ring animation
 */
export function PulseSpinner({
  size = 'medium',
  color = 'currentColor',
  className = '',
  label = 'Loading',
}: SpinnerProps) {
  return (
    <div
      data-testid="pulse-spinner"
      role="status"
      aria-label={label}
      className={`relative ${sizeClasses[size]} ${className}`}
    >
      <div
        className="absolute inset-0 rounded-full animate-ping opacity-75"
        style={{ backgroundColor: color }}
      />
      <div
        className="absolute inset-1/4 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export default Spinner;
