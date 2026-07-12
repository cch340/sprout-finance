import type { CSSProperties, ButtonHTMLAttributes } from 'react';
import { Icon, type IconName } from './Icon';

export type IconButtonVariant = 'primary' | 'secondary' | 'soft' | 'ghost';
export type IconButtonSize = 'sm' | 'md' | 'lg';

const sizes: Record<IconButtonSize, number> = { sm: 34, md: 42, lg: 50 };
const iconSizes: Record<IconButtonSize, number> = { sm: 17, md: 20, lg: 22 };

const variants: Record<IconButtonVariant, CSSProperties> = {
  primary: { background: 'var(--accent)', color: 'var(--text-on-accent)', boxShadow: 'var(--shadow-xs)' },
  secondary: {
    background: 'var(--surface-card)',
    color: 'var(--text-body)',
    border: '1px solid var(--border-strong)',
    boxShadow: 'var(--shadow-xs)',
  },
  soft: { background: 'var(--accent-soft)', color: 'var(--accent-soft-fg)' },
  ghost: { background: 'transparent', color: 'var(--text-muted)' },
};

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  icon: IconName;
  label: string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  round?: boolean;
  className?: string;
  style?: CSSProperties;
}

/** IconButton — a square, icon-only button. Always pass `label` for a11y. */
export function IconButton({
  icon,
  label,
  variant = 'ghost',
  size = 'md',
  round = false,
  disabled = false,
  className = '',
  style = {},
  ...rest
}: IconButtonProps) {
  const dim = sizes[size];
  return (
    <button
      className={`sprout-iconbtn sprout-iconbtn--${variant} ${className}`}
      aria-label={label}
      title={label}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: dim,
        height: dim,
        borderRadius: round ? 'var(--radius-pill)' : 'var(--radius-md)',
        border: '1px solid transparent',
        cursor: 'pointer',
        transition:
          'var(--transition-colors), transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-standard)',
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? 'none' : undefined,
        ...variants[variant],
        ...style,
      }}
      {...rest}
    >
      <Icon name={icon} size={iconSizes[size]} />
      <style>{`
        .sprout-iconbtn--primary:hover { background: var(--accent-hover) !important; }
        .sprout-iconbtn--secondary:hover { background: var(--surface-hover) !important; }
        .sprout-iconbtn--soft:hover { background: var(--sage-200) !important; }
        .sprout-iconbtn--ghost:hover { background: var(--surface-hover) !important; color: var(--text-body) !important; }
        .sprout-iconbtn:active { transform: scale(0.92); }
        .sprout-iconbtn:focus-visible { outline: none; box-shadow: var(--shadow-focus); }
      `}</style>
    </button>
  );
}
