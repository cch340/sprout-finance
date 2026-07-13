import type { CSSProperties, HTMLAttributes, ReactNode, KeyboardEvent } from 'react';
import { Icon } from './Icon';

export interface ListRowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'title' | 'onClick'> {
  leading?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  trailing?: ReactNode;
  meta?: ReactNode;
  chevron?: boolean;
  onClick?: () => void;
  divider?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * ListRow — the transaction/setting row that fills most Sprout screens.
 */
export function ListRow({
  leading,
  title,
  subtitle,
  trailing,
  meta,
  chevron = false,
  onClick,
  divider = false,
  className = '',
  style = {},
  ...rest
}: ListRowProps) {
  const clickable = Boolean(onClick);
  const handleKey = clickable
    ? (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }
    : undefined;
  return (
    <div
      className={`sprout-row ${clickable ? 'sprout-row--click' : ''} ${className}`}
      onClick={onClick}
      onKeyDown={handleKey}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        padding: 'var(--space-3)',
        borderBottom: divider ? '1px solid var(--border-subtle)' : 'none',
        cursor: clickable ? 'pointer' : 'default',
        borderRadius: 'var(--radius-md)',
        transition: 'background-color var(--dur-fast) var(--ease-standard)',
        ...style,
      }}
      {...rest}
    >
      {leading && <span style={{ flexShrink: 0, display: 'inline-flex' }}>{leading}</span>}
      <span
        style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}
      >
        <span
          style={{
            font: 'var(--font-body)',
            fontWeight: 'var(--fw-semibold)' as CSSProperties['fontWeight'],
            color: 'var(--text-strong)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </span>
        {subtitle && (
          <span
            style={{
              font: 'var(--font-caption)',
              color: 'var(--text-muted)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {subtitle}
          </span>
        )}
      </span>
      {(trailing || meta) && (
        <span
          style={{
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 1,
          }}
        >
          {trailing}
          {meta && (
            <span style={{ font: 'var(--font-caption)', color: 'var(--text-muted)' }}>{meta}</span>
          )}
        </span>
      )}
      {chevron && (
        <Icon
          name="chevron-right"
          size={18}
          style={{ color: 'var(--text-subtle)', flexShrink: 0 }}
        />
      )}
      {clickable && (
        <style>{`.sprout-row--click:hover { background: var(--surface-hover); } .sprout-row--click:focus-visible { outline: none; box-shadow: var(--shadow-focus); }`}</style>
      )}
    </div>
  );
}
