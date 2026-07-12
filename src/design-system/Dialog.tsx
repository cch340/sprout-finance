import { useEffect } from 'react';
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { IconButton } from './IconButton';

export type DialogSize = 'sm' | 'md' | 'lg';

export interface DialogProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'title'> {
  open: boolean;
  onClose?: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: DialogSize;
  className?: string;
  style?: CSSProperties;
}

/**
 * Dialog — centered modal. Controlled via `open` + `onClose`.
 * Scrim = green-ink 42% + 3px blur; card radius 28px.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  className = '',
  style = {},
  ...rest
}: DialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  const maxW = size === 'sm' ? 380 : size === 'lg' ? 640 : 500;
  return (
    <div
      className="sprout-dialog-scrim"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-4)',
        background: 'rgb(31 37 25 / 0.42)',
        backdropFilter: 'blur(3px)',
        WebkitBackdropFilter: 'blur(3px)',
        animation: 'sprout-fade var(--dur-fast) var(--ease-standard)',
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
        onClick={(e) => e.stopPropagation()}
        className={`sprout-dialog ${className}`}
        style={{
          width: '100%',
          maxWidth: maxW,
          background: 'var(--surface-card)',
          borderRadius: 'var(--radius-2xl)',
          boxShadow: 'var(--shadow-xl)',
          padding: 'var(--space-6)',
          animation: 'sprout-rise var(--dur-base) var(--ease-out)',
          ...style,
        }}
        {...rest}
      >
        {(title || onClose) && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 'var(--space-4)',
              marginBottom: description ? 'var(--space-2)' : 'var(--space-4)',
            }}
          >
            {title && (
              <h2 style={{ font: 'var(--font-h3)', color: 'var(--text-strong)', margin: 0 }}>
                {title}
              </h2>
            )}
            {onClose && (
              <IconButton
                icon="x"
                label="Close"
                variant="ghost"
                size="sm"
                onClick={onClose}
                style={{ margin: '-4px -6px 0 0' }}
              />
            )}
          </div>
        )}
        {description && (
          <p
            style={{
              font: 'var(--font-body)',
              color: 'var(--text-muted)',
              margin: '0 0 var(--space-5)',
            }}
          >
            {description}
          </p>
        )}
        {children}
        {footer && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 'var(--space-3)',
              marginTop: 'var(--space-6)',
            }}
          >
            {footer}
          </div>
        )}
      </div>
      <style>{`
        @keyframes sprout-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes sprout-rise { from { opacity: 0; transform: translateY(12px) scale(0.98); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
}
