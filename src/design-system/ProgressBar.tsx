import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

export type ProgressTone = 'accent' | 'income' | 'warning';
export type ProgressSize = 'sm' | 'md' | 'lg';

export interface ProgressSegment {
  value: number;
  color?: string;
}

export interface ProgressBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  value?: number;
  max?: number;
  tone?: ProgressTone;
  size?: ProgressSize;
  segments?: ProgressSegment[];
  showLabel?: boolean;
  label?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * ProgressBar — budget / commitment progress. Turns red when over 100%.
 * Optionally segmented for category breakdowns.
 */
export function ProgressBar({
  value = 0,
  max = 100,
  tone = 'accent',
  size = 'md',
  segments,
  showLabel = false,
  label,
  className = '',
  style = {},
  ...rest
}: ProgressBarProps) {
  const height = size === 'sm' ? 6 : size === 'lg' ? 12 : 8;
  const pct = Math.min(100, (value / max) * 100);
  const over = value > max;
  const toneColor = over
    ? 'var(--danger-500)'
    : tone === 'income'
      ? 'var(--money-in)'
      : tone === 'warning'
        ? 'var(--warning-500)'
        : 'var(--accent)';
  return (
    <div
      className={`sprout-progress ${className}`}
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', ...style }}
      {...rest}
    >
      {(showLabel || label) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            font: 'var(--font-caption)',
            color: 'var(--text-muted)',
          }}
        >
          <span>{label}</span>
          {showLabel && (
            <span
              style={{
                color: over ? 'var(--danger-500)' : 'var(--text-body)',
                fontWeight: 'var(--fw-semibold)' as CSSProperties['fontWeight'],
              }}
            >
              {Math.round((value / max) * 100)}%
            </span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemax={max}
        style={{
          display: 'flex',
          gap: 2,
          height,
          borderRadius: 'var(--radius-pill)',
          background: 'var(--neutral-200)',
          overflow: 'hidden',
        }}
      >
        {segments ? (
          segments.map((s, i) => (
            <span
              key={i}
              style={{ width: `${(s.value / max) * 100}%`, background: s.color || toneColor }}
            />
          ))
        ) : (
          <span
            style={{
              width: `${pct}%`,
              background: toneColor,
              borderRadius: 'var(--radius-pill)',
              transition: 'width var(--dur-slow) var(--ease-out)',
            }}
          />
        )}
      </div>
    </div>
  );
}
