import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { Icon, type IconName } from './Icon';

export type ToastTone = 'success' | 'info' | 'warning' | 'danger';

const tones: Record<ToastTone, { icon: IconName; color: string }> = {
  success: { icon: 'check-circle', color: 'var(--money-in)' },
  info: { icon: 'info', color: 'var(--info-500)' },
  warning: { icon: 'alert-triangle', color: 'var(--warning-500)' },
  danger: { icon: 'alert-triangle', color: 'var(--danger-500)' },
};

export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'title'> {
  title?: ReactNode;
  description?: ReactNode;
  tone?: ToastTone;
  action?: ReactNode;
  onAction?: () => void;
  onClose?: () => void;
  className?: string;
  style?: CSSProperties;
}

/** Toast — a transient dark confirmation card, with action / dismiss. */
export function Toast({
  title,
  description,
  tone = 'success',
  action,
  onAction,
  onClose,
  className = '',
  style = {},
  ...rest
}: ToastProps) {
  const t = tones[tone] || tones.success;
  return (
    <div
      role="status"
      className={`sprout-toast ${className}`}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--space-3)',
        minWidth: 280,
        maxWidth: 400,
        padding: 'var(--space-3) var(--space-4)',
        background: 'var(--surface-inverse)',
        color: 'var(--text-on-inverse)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        animation: 'sprout-toast-in var(--dur-base) var(--ease-out)',
        ...style,
      }}
      {...rest}
    >
      <Icon name={t.icon} size={20} style={{ color: t.color, marginTop: 1, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ font: 'var(--font-body)', fontWeight: 'var(--fw-semibold)' as CSSProperties['fontWeight'] }}>
          {title}
        </div>
        {description && (
          <div style={{ font: 'var(--font-caption)', color: 'rgba(255,255,255,0.72)', marginTop: 1 }}>
            {description}
          </div>
        )}
      </div>
      {action && (
        <button
          onClick={onAction}
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            font: 'var(--font-label)',
            color: 'var(--sage-300)',
            padding: '2px 4px',
            flexShrink: 0,
          }}
        >
          {action}
        </button>
      )}
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Dismiss"
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.6)',
            padding: 0,
            flexShrink: 0,
            display: 'inline-flex',
          }}
        >
          <Icon name="x" size={16} />
        </button>
      )}
      <style>{`@keyframes sprout-toast-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }`}</style>
    </div>
  );
}
