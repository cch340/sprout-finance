import type { CSSProperties, ButtonHTMLAttributes, ReactNode, ElementType } from 'react';
import { Icon, type IconName } from './Icon';

export type ButtonVariant = 'primary' | 'secondary' | 'soft' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const base: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 'var(--space-2)',
  fontFamily: 'var(--font-sans)',
  fontWeight: 'var(--fw-semibold)' as CSSProperties['fontWeight'],
  border: '1px solid transparent',
  borderRadius: 'var(--radius-md)',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition:
    'var(--transition-colors), transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-standard)',
  textDecoration: 'none',
  userSelect: 'none',
};

const sizes: Record<ButtonSize, CSSProperties> = {
  sm: { fontSize: 'var(--text-sm)', padding: '0 var(--space-3)', height: 34 },
  md: { fontSize: 'var(--text-md)', padding: '0 var(--space-4)', height: 42 },
  lg: { fontSize: 'var(--text-lg)', padding: '0 var(--space-5)', height: 50 },
};

const variants: Record<ButtonVariant, CSSProperties> = {
  primary: { background: 'var(--accent)', color: 'var(--text-on-accent)', boxShadow: 'var(--shadow-xs)' },
  secondary: {
    background: 'var(--surface-card)',
    color: 'var(--text-body)',
    borderColor: 'var(--border-strong)',
    boxShadow: 'var(--shadow-xs)',
  },
  soft: { background: 'var(--accent-soft)', color: 'var(--accent-soft-fg)' },
  ghost: { background: 'transparent', color: 'var(--text-body)' },
  danger: { background: 'var(--danger-500)', color: '#fff', boxShadow: 'var(--shadow-xs)' },
};

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconStart?: IconName;
  iconEnd?: IconName;
  fullWidth?: boolean;
  loading?: boolean;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
}

/** Button — Sprout's primary action control. */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  iconStart,
  iconEnd,
  fullWidth = false,
  disabled = false,
  loading = false,
  as: Tag = 'button',
  className = '',
  style = {},
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <Tag
      className={`sprout-btn sprout-btn--${variant} ${className}`}
      data-variant={variant}
      aria-busy={loading || undefined}
      disabled={Tag === 'button' ? isDisabled : undefined}
      style={{
        ...base,
        ...sizes[size],
        ...variants[variant],
        width: fullWidth ? '100%' : undefined,
        opacity: isDisabled ? 0.5 : 1,
        pointerEvents: isDisabled ? 'none' : undefined,
        ...style,
      }}
      {...rest}
    >
      {loading && (
        <Icon
          name="repeat"
          size={size === 'sm' ? 15 : 17}
          style={{ animation: 'sprout-spin 0.9s linear infinite' }}
        />
      )}
      {!loading && iconStart && <Icon name={iconStart} size={size === 'sm' ? 15 : 18} />}
      {children != null && <span>{children}</span>}
      {!loading && iconEnd && <Icon name={iconEnd} size={size === 'sm' ? 15 : 18} />}
      <style>{`
        .sprout-btn:hover:not([aria-busy="true"]) { filter: none; }
        .sprout-btn--primary:hover { background: var(--accent-hover) !important; }
        .sprout-btn--primary:active { background: var(--accent-active) !important; transform: scale(0.98); }
        .sprout-btn--secondary:hover { background: var(--surface-hover) !important; }
        .sprout-btn--secondary:active { transform: scale(0.98); }
        .sprout-btn--soft:hover { background: var(--sage-200) !important; }
        .sprout-btn--soft:active { transform: scale(0.98); }
        .sprout-btn--ghost:hover { background: var(--surface-hover) !important; }
        .sprout-btn--danger:hover { background: var(--danger-600) !important; }
        .sprout-btn--danger:active { transform: scale(0.98); }
        .sprout-btn:focus-visible { outline: none; box-shadow: var(--shadow-focus); }
        @keyframes sprout-spin { to { transform: rotate(360deg); } }
      `}</style>
    </Tag>
  );
}
