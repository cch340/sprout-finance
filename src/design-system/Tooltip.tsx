import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

export type TooltipSide = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'style'> {
  label: ReactNode;
  side?: TooltipSide;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/** Tooltip — hover/focus label. CSS-only reveal; wraps a single child. */
export function Tooltip({
  label,
  side = 'top',
  children,
  className = '',
  style = {},
  ...rest
}: TooltipProps) {
  const pos: Record<TooltipSide, CSSProperties> = {
    top: { bottom: '100%', left: '50%', transform: 'translateX(-50%) translateY(-6px)' },
    bottom: { top: '100%', left: '50%', transform: 'translateX(-50%) translateY(6px)' },
    left: { right: '100%', top: '50%', transform: 'translateY(-50%) translateX(-6px)' },
    right: { left: '100%', top: '50%', transform: 'translateY(-50%) translateX(6px)' },
  };
  return (
    <span
      className={`sprout-tooltip ${className}`}
      style={{ position: 'relative', display: 'inline-flex' }}
      {...rest}
    >
      {children}
      <span
        role="tooltip"
        className="sprout-tooltip-bubble"
        style={{
          position: 'absolute',
          ...pos[side],
          zIndex: 50,
          padding: '5px var(--space-2)',
          font: 'var(--font-caption)',
          fontWeight: 'var(--fw-medium)' as CSSProperties['fontWeight'],
          color: 'var(--text-on-inverse)',
          background: 'var(--surface-inverse)',
          borderRadius: 'var(--radius-sm)',
          boxShadow: 'var(--shadow-md)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          opacity: 0,
          transition: 'opacity var(--dur-fast) var(--ease-standard)',
          ...style,
        }}
      >
        {label}
      </span>
      <style>{`
        .sprout-tooltip:hover .sprout-tooltip-bubble,
        .sprout-tooltip:focus-within .sprout-tooltip-bubble { opacity: 1; }
      `}</style>
    </span>
  );
}
