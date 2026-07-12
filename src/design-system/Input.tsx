import { useId } from 'react';
import type { CSSProperties, InputHTMLAttributes, ReactNode } from 'react';
import { Icon, type IconName } from './Icon';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'style' | 'size' | 'prefix'> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  iconStart?: IconName;
  prefix?: ReactNode;
  suffix?: ReactNode;
  size?: InputSize;
  className?: string;
  style?: CSSProperties;
  containerStyle?: CSSProperties;
}

/**
 * Input — labelled text field with optional icon, prefix/suffix, hint & error.
 * Great for money entry: pass prefix="RM".
 */
export function Input({
  label,
  hint,
  error,
  iconStart,
  prefix,
  suffix,
  size = 'md',
  id,
  className = '',
  style = {},
  containerStyle = {},
  ...rest
}: InputProps) {
  const autoId = useId();
  const inputId = id || autoId;
  const height = size === 'lg' ? 50 : size === 'sm' ? 36 : 44;
  const fontSize = size === 'lg' ? 'var(--text-lg)' : 'var(--text-md)';
  const invalid = Boolean(error);
  return (
    <div
      className={`sprout-field ${className}`}
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', ...containerStyle }}
    >
      {label && (
        <label htmlFor={inputId} style={{ font: 'var(--font-label)', color: 'var(--text-body)' }}>
          {label}
        </label>
      )}
      <div
        className="sprout-input-wrap"
        data-invalid={invalid || undefined}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          height,
          padding: '0 var(--space-3)',
          background: 'var(--surface-card)',
          border: `1px solid ${invalid ? 'var(--danger-500)' : 'var(--border-strong)'}`,
          borderRadius: 'var(--radius-md)',
          transition: 'var(--transition-colors), box-shadow var(--dur-fast) var(--ease-standard)',
        }}
      >
        {iconStart && <Icon name={iconStart} size={18} style={{ color: 'var(--text-muted)' }} />}
        {prefix && (
          <span
            style={{
              font: 'var(--font-body)',
              fontWeight: 'var(--fw-semibold)' as CSSProperties['fontWeight'],
              color: 'var(--text-muted)',
            }}
          >
            {prefix}
          </span>
        )}
        <input
          id={inputId}
          aria-invalid={invalid || undefined}
          style={{
            flex: 1,
            minWidth: 0,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            font: 'var(--font-body)',
            fontSize,
            color: 'var(--text-strong)',
            padding: 0,
            ...style,
          }}
          {...rest}
        />
        {suffix && (
          <span style={{ font: 'var(--font-caption)', color: 'var(--text-muted)' }}>{suffix}</span>
        )}
      </div>
      {(hint || error) && (
        <span
          style={{
            font: 'var(--font-caption)',
            color: invalid ? 'var(--danger-500)' : 'var(--text-muted)',
          }}
        >
          {error || hint}
        </span>
      )}
      <style>{`
        .sprout-input-wrap:focus-within { border-color: var(--ring-focus) !important; box-shadow: var(--shadow-focus); }
        .sprout-input-wrap[data-invalid]:focus-within { box-shadow: 0 0 0 3px rgb(199 80 63 / 0.22); }
        .sprout-field input::placeholder { color: var(--text-subtle); }
      `}</style>
    </div>
  );
}
