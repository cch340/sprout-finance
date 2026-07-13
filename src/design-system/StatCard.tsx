import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { Icon, type IconName } from './Icon';
import { Amount, type AmountProps } from './Amount';

export interface StatCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  label?: ReactNode;
  value: number | ReactNode;
  amountProps?: Partial<AmountProps>;
  trend?: ReactNode;
  trendDirection?: 'up' | 'down';
  icon?: IconName;
  accent?: boolean;
  footer?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * StatCard — a headline metric with label and optional trend.
 */
export function StatCard({
  label,
  value,
  amountProps = {},
  trend,
  trendDirection,
  icon,
  accent = false,
  footer,
  className = '',
  style = {},
  ...rest
}: StatCardProps) {
  const up = trendDirection === 'up';
  const trendColor =
    trendDirection === 'up'
      ? 'var(--money-in)'
      : trendDirection === 'down'
        ? 'var(--danger-500)'
        : 'var(--text-muted)';
  return (
    <div
      className={`sprout-statcard ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
        padding: 'var(--space-6)',
        background: accent ? 'var(--accent)' : 'var(--surface-card)',
        border: `1px solid ${accent ? 'transparent' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        color: accent ? 'var(--text-on-accent)' : undefined,
        ...style,
      }}
      {...rest}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)', minWidth: 0 }}>
        <span
          style={{
            font: 'var(--font-label)',
            color: accent ? 'rgba(255,255,255,0.85)' : 'var(--text-muted)',
            // Truncate rather than push the icon out / overflow in narrow cells.
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </span>
        {icon && (
          <Icon
            name={icon}
            size={18}
            style={{ color: accent ? 'rgba(255,255,255,0.75)' : 'var(--text-subtle)', flexShrink: 0 }}
          />
        )}
      </div>
      {typeof value === 'number' ? (
        <Amount
          value={value}
          size="xl"
          {...amountProps}
          style={{ color: accent ? '#fff' : undefined, ...(amountProps.style || {}) }}
        />
      ) : (
        <span style={{ font: 'var(--font-h2)', color: accent ? '#fff' : 'var(--text-strong)' }}>
          {value}
        </span>
      )}
      {(trend || footer) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 2 }}>
          {trend && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                font: 'var(--font-caption)',
                fontWeight: 'var(--fw-semibold)' as CSSProperties['fontWeight'],
                color: accent ? '#fff' : trendColor,
              }}
            >
              {trendDirection && <Icon name={up ? 'trending-up' : 'trending-down'} size={14} />}
              {trend}
            </span>
          )}
          {footer && (
            <span
              style={{
                font: 'var(--font-caption)',
                color: accent ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)',
              }}
            >
              {footer}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
