import { useId } from 'react';
import type { CSSProperties, TextareaHTMLAttributes, ReactNode } from 'react';

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'style'> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  className?: string;
  style?: CSSProperties;
  containerStyle?: CSSProperties;
}

/** Textarea — multi-line text field with label, hint & error. */
export function Textarea({
  label,
  hint,
  error,
  id,
  rows = 3,
  className = '',
  style = {},
  containerStyle = {},
  ...rest
}: TextareaProps) {
  const autoId = useId();
  const inputId = id || autoId;
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
      <textarea
        id={inputId}
        rows={rows}
        aria-invalid={invalid || undefined}
        className="sprout-textarea"
        style={{
          font: 'var(--font-body)',
          color: 'var(--text-strong)',
          background: 'var(--surface-card)',
          border: `1px solid ${invalid ? 'var(--danger-500)' : 'var(--border-strong)'}`,
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-3)',
          resize: 'vertical',
          outline: 'none',
          transition: 'var(--transition-colors), box-shadow var(--dur-fast) var(--ease-standard)',
          ...style,
        }}
        {...rest}
      />
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
        .sprout-textarea:focus { border-color: var(--ring-focus) !important; box-shadow: var(--shadow-focus); }
        .sprout-textarea::placeholder { color: var(--text-subtle); }
      `}</style>
    </div>
  );
}
