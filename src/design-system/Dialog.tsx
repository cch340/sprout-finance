import { useEffect, useRef } from 'react';
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
  const cardRef = useRef<HTMLDivElement>(null);
  // Keep the latest onClose in a ref so the effect below can depend only on
  // `open`. If it depended on `onClose` too, any parent that passes a fresh
  // arrow each render (e.g. `onClose={() => { commit(); close(); }}`) would make
  // the effect re-run on every keystroke, and `card.focus()` would yank focus
  // out of the input the user is typing in — hiding the mobile keyboard.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    // Remember what had focus so we can restore it on close.
    const prevFocus = document.activeElement as HTMLElement | null;
    // Move focus into the dialog (the container itself, so we don't auto-focus
    // the first input — which would scroll the form) once mounted.
    const card = cardRef.current;
    card?.focus();

    const focusables = () =>
      Array.from(
        card?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((el) => el.offsetParent !== null || el === card);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseRef.current?.();
        return;
      }
      if (e.key !== 'Tab') return;
      // Trap Tab within the dialog.
      const items = focusables();
      if (items.length === 0) {
        e.preventDefault();
        card?.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey) {
        if (active === first || active === card || !card?.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      // Restore focus to the trigger when the dialog closes.
      prevFocus?.focus?.();
    };
  }, [open]);
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
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className={`sprout-dialog ${className}`}
        style={{
          outline: 'none',
          width: '100%',
          maxWidth: maxW,
          // Cap height so tall forms never run off-screen; dvh keeps it honest
          // under iOS Safari's dynamic toolbar. Body scrolls, header/footer stay.
          maxHeight: 'min(85dvh, 760px)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: 'var(--surface-card)',
          borderRadius: 'var(--radius-2xl)',
          boxShadow: 'var(--shadow-xl)',
          animation: 'sprout-rise var(--dur-base) var(--ease-out)',
          ...style,
        }}
        {...rest}
      >
        {(title || onClose) && (
          <div
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 'var(--space-4)',
              padding: `var(--space-6) var(--space-6) ${
                description ? 'var(--space-2)' : 'var(--space-4)'
              }`,
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
        <div
          className="sprout-dialog-body"
          style={{
            flex: '1 1 auto',
            minHeight: 0,
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
            padding: `0 var(--space-6) ${
              footer ? 'var(--space-2)' : 'calc(var(--space-6) + env(safe-area-inset-bottom))'
            }`,
          }}
        >
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
        </div>
        {footer && (
          <div
            style={{
              flexShrink: 0,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 'var(--space-3)',
              // Bottom base matches the footer's top padding so the gap reads
              // balanced; safe-area is *added* only on real notched devices.
              padding: `var(--space-4) var(--space-6) calc(var(--space-4) + env(safe-area-inset-bottom))`,
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
