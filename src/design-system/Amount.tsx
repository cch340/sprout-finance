import type { CSSProperties, HTMLAttributes } from 'react';

export type AmountKind = 'neutral' | 'in' | 'out' | 'over';
export type AmountSize = 'sm' | 'md' | 'lg' | 'xl' | 'hero';

export interface AmountProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'style'> {
  value: number;
  currency?: string;
  kind?: AmountKind;
  size?: AmountSize;
  showSign?: boolean;
  decimals?: number;
  weight?: CSSProperties['fontWeight'];
  className?: string;
  style?: CSSProperties;
}

/**
 * Amount — formats a number as Malaysian Ringgit with tabular figures.
 * Expenses render neutral (calm); income is green; over-budget is red.
 */
export function Amount({
  value,
  currency = 'RM',
  kind = 'neutral',
  size = 'md',
  showSign = false,
  decimals = 2,
  weight,
  className = '',
  style = {},
  ...rest
}: AmountProps) {
  const sizeMap: Record<AmountSize, string> = {
    sm: 'var(--text-sm)',
    md: 'var(--text-md)',
    lg: 'var(--text-xl)',
    xl: 'var(--text-3xl)',
    hero: 'var(--text-4xl)',
  };
  const colorMap: Record<AmountKind, string> = {
    neutral: 'var(--text-strong)',
    in: 'var(--money-in)',
    out: 'var(--text-strong)',
    over: 'var(--money-over)',
  };
  const abs = Math.abs(value);
  const [whole, frac] = abs
    .toLocaleString('en-MY', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
    .split('.');
  const sign = showSign
    ? kind === 'in'
      ? '+'
      : value < 0 || kind === 'out'
        ? '−'
        : ''
    : value < 0
      ? '−'
      : '';
  const big = size === 'hero' || size === 'xl';
  return (
    <span
      className={`sprout-amount ${className}`}
      style={{
        fontFamily: 'var(--font-sans)',
        fontWeight: weight ?? (big ? ('var(--fw-extra)' as CSSProperties['fontWeight']) : ('var(--fw-semibold)' as CSSProperties['fontWeight'])),
        fontSize: sizeMap[size],
        letterSpacing: big ? 'var(--tracking-tight)' : 'var(--tracking-snug)',
        fontVariantNumeric: 'tabular-nums',
        color: colorMap[kind],
        whiteSpace: 'nowrap',
        ...style,
      }}
      {...rest}
    >
      {sign}
      <span
        style={{
          fontWeight: 'inherit',
          opacity: 0.62,
          fontSize: big ? '0.62em' : '0.86em',
          marginRight: '0.12em',
        }}
      >
        {currency}
      </span>
      {whole}
      {decimals > 0 && (
        <span style={{ opacity: big ? 0.42 : 0.6, fontSize: big ? '0.62em' : '1em' }}>
          .{frac}
        </span>
      )}
    </span>
  );
}
