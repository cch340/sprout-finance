import type { CSSProperties, HTMLAttributes, ReactNode, ElementType } from 'react';

export type CardPadding = 'none' | 'sm' | 'md' | 'lg';
export type CardRadius = 'md' | 'lg' | 'xl';

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, 'style'> {
  children?: ReactNode;
  interactive?: boolean;
  padding?: CardPadding;
  radius?: CardRadius | string;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
}

/**
 * Card — the soft white surface everything in Sprout sits on.
 * `interactive` adds hover lift; `padding` controls interior space.
 */
export function Card({
  children,
  interactive = false,
  padding = 'lg',
  radius = 'lg',
  as: Tag = 'div',
  className = '',
  style = {},
  ...rest
}: CardProps) {
  const padMap: Record<CardPadding, string | number> = {
    none: 0,
    sm: 'var(--space-4)',
    md: 'var(--space-5)',
    lg: 'var(--space-6)',
  };
  const radMap: Record<string, string> = {
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
    xl: 'var(--radius-xl)',
  };
  return (
    <Tag
      className={`sprout-card ${interactive ? 'sprout-card--interactive' : ''} ${className}`}
      style={{
        background: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: radMap[radius as CardRadius] || radius,
        boxShadow: 'var(--shadow-sm)',
        padding: padMap[padding] ?? padding,
        transition:
          'transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-standard)',
        ...style,
      }}
      {...rest}
    >
      {children}
      {interactive && (
        <style>{`
          .sprout-card--interactive { cursor: pointer; }
          .sprout-card--interactive:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
          .sprout-card--interactive:active { transform: translateY(0); }
        `}</style>
      )}
    </Tag>
  );
}
