import { useId } from 'react';
import type { CSSProperties, InputHTMLAttributes, ReactNode } from 'react';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'style'> {
  label?: ReactNode;
  description?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/** Radio — single-choice control. Use several with the same `name`. */
export function Radio({
  label,
  description,
  id,
  disabled,
  className = '',
  style = {},
  ...rest
}: RadioProps) {
  const autoId = useId();
  const rId = id || autoId;
  return (
    <label
      htmlFor={rId}
      className={`sprout-radio ${className}`}
      style={{
        display: 'flex',
        alignItems: description ? 'flex-start' : 'center',
        gap: 'var(--space-3)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      <span
        style={{
          position: 'relative',
          display: 'inline-flex',
          flexShrink: 0,
          marginTop: description ? 2 : 0,
        }}
      >
        <input
          type="radio"
          id={rId}
          disabled={disabled}
          className="sprout-radio-input"
          style={{
            position: 'absolute',
            opacity: 0,
            width: 20,
            height: 20,
            margin: 0,
            cursor: 'inherit',
          }}
          {...rest}
        />
        <span
          className="sprout-radio-dot"
          style={{
            width: 20,
            height: 20,
            borderRadius: 'var(--radius-pill)',
            border: '2px solid var(--border-strong)',
            background: 'var(--surface-card)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'var(--transition-colors)',
          }}
        >
          <span
            className="sprout-radio-fill"
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#fff',
              transform: 'scale(0)',
              transition: 'transform var(--dur-fast) var(--ease-spring)',
            }}
          />
        </span>
      </span>
      {(label || description) && (
        <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {label && (
            <span
              style={{
                font: 'var(--font-body)',
                fontWeight: 'var(--fw-medium)' as CSSProperties['fontWeight'],
                color: 'var(--text-strong)',
              }}
            >
              {label}
            </span>
          )}
          {description && (
            <span style={{ font: 'var(--font-caption)', color: 'var(--text-muted)' }}>
              {description}
            </span>
          )}
        </span>
      )}
      <style>{`
        .sprout-radio-input:checked + .sprout-radio-dot { background: var(--accent); border-color: var(--accent); }
        .sprout-radio-input:checked + .sprout-radio-dot .sprout-radio-fill { transform: scale(1); }
        .sprout-radio-input:focus-visible + .sprout-radio-dot { box-shadow: var(--shadow-focus); }
        .sprout-radio:hover .sprout-radio-input:not(:checked):not(:disabled) + .sprout-radio-dot { border-color: var(--accent); }
      `}</style>
    </label>
  );
}
