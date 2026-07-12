import type { CSSProperties, HTMLAttributes, ReactNode, MouseEvent } from 'react';
import { Icon, type IconName } from './Icon';

export type TagSize = 'sm' | 'md';

export interface TagProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'style'> {
  children?: ReactNode;
  selected?: boolean;
  onRemove?: (e: MouseEvent) => void;
  iconStart?: IconName;
  size?: TagSize;
  className?: string;
  style?: CSSProperties;
}

/** Tag — a removable/selectable filter chip. */
export function Tag({
  children,
  selected = false,
  onRemove,
  iconStart,
  size = 'md',
  className = '',
  style = {},
  ...rest
}: TagProps) {
  const height = size === 'sm' ? 26 : 32;
  return (
    <span
      className={`sprout-tag ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        height,
        padding: size === 'sm' ? '0 var(--space-2)' : '0 var(--space-3)',
        font: 'var(--font-label)',
        fontSize: size === 'sm' ? 'var(--text-xs)' : 'var(--text-sm)',
        borderRadius: 'var(--radius-pill)',
        background: selected ? 'var(--accent)' : 'var(--surface-card)',
        color: selected ? '#fff' : 'var(--text-body)',
        border: `1px solid ${selected ? 'var(--accent)' : 'var(--border-strong)'}`,
        cursor: rest.onClick ? 'pointer' : 'default',
        transition: 'var(--transition-colors)',
        whiteSpace: 'nowrap',
        ...style,
      }}
      {...rest}
    >
      {iconStart && <Icon name={iconStart} size={14} />}
      {children}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(e);
          }}
          aria-label="Remove"
          style={{
            display: 'inline-flex',
            border: 'none',
            background: 'transparent',
            padding: 0,
            margin: '0 -2px 0 0',
            cursor: 'pointer',
            color: selected ? 'rgba(255,255,255,0.85)' : 'var(--text-muted)',
          }}
        >
          <Icon name="x" size={14} strokeWidth={2.5} />
        </button>
      )}
    </span>
  );
}
