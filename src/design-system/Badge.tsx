import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

export type BadgeTone = 'neutral' | 'accent' | 'income' | 'danger' | 'warning' | 'info';

const tones: Record<BadgeTone, { bg: string; fg: string }> = {
  // Semantic surface alias, not a raw neutral — raw neutrals don't flip in dark mode.
  neutral: { bg: 'var(--surface-hover)', fg: 'var(--text-body)' },
  accent: { bg: 'var(--accent-soft)', fg: 'var(--accent-soft-fg)' },
  income: { bg: 'var(--income-50)', fg: 'var(--income-600)' },
  danger: { bg: 'var(--danger-50)', fg: 'var(--danger-600)' },
  warning: { bg: 'var(--warning-50)', fg: 'var(--warning-600)' },
  info: { bg: 'var(--info-50)', fg: 'var(--info-600)' },
};

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'style'> {
  children?: ReactNode;
  tone?: BadgeTone;
  dot?: boolean;
  solid?: boolean;
  className?: string;
  style?: CSSProperties;
}

/** Badge — small status pill. Tones map to Sprout's semantic colors. */
export function Badge({
  children,
  tone = 'neutral',
  dot = false,
  solid = false,
  className = '',
  style = {},
  ...rest
}: BadgeProps) {
  const t = tones[tone] || tones.neutral;
  return (
    <span
      className={`sprout-badge ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-1)',
        padding: '3px var(--space-2)',
        font: 'var(--font-caption)',
        fontWeight: 'var(--fw-semibold)' as CSSProperties['fontWeight'],
        lineHeight: 1.4,
        borderRadius: 'var(--radius-pill)',
        background: solid ? t.fg : t.bg,
        color: solid ? '#fff' : t.fg,
        whiteSpace: 'nowrap',
        ...style,
      }}
      {...rest}
    >
      {dot && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: solid ? '#fff' : t.fg,
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </span>
  );
}
