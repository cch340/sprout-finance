import { useId } from 'react';
import type { CSSProperties, InputHTMLAttributes, ReactNode } from 'react';
import { Icon } from './Icon';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'style'> {
  label?: ReactNode;
  description?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/** Checkbox — square check control with optional label & description. */
export function Checkbox({
  label,
  description,
  checked,
  defaultChecked,
  disabled,
  id,
  className = '',
  style = {},
  ...rest
}: CheckboxProps) {
  const autoId = useId();
  const cbId = id || autoId;
  return (
    <label
      htmlFor={cbId}
      className={`sprout-check ${className}`}
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
          type="checkbox"
          id={cbId}
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          className="sprout-check-input"
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
          className="sprout-check-box"
          style={{
            width: 20,
            height: 20,
            borderRadius: 'var(--radius-xs)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            transition: 'var(--transition-colors)',
          }}
        >
          <Icon
            name="check"
            size={14}
            strokeWidth={3}
            style={{ transition: 'opacity var(--dur-fast)' }}
            className="sprout-check-tick"
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
        .sprout-check-box { background: var(--surface-card); border: 2px solid var(--border-strong); }
        .sprout-check-tick { opacity: 0; }
        .sprout-check-input:checked + .sprout-check-box { background: var(--accent); border-color: var(--accent); }
        .sprout-check-input:checked + .sprout-check-box .sprout-check-tick { opacity: 1; }
        .sprout-check-input:focus-visible + .sprout-check-box { box-shadow: var(--shadow-focus); }
        .sprout-check:hover .sprout-check-input:not(:checked):not(:disabled) + .sprout-check-box { border-color: var(--accent); }
      `}</style>
    </label>
  );
}
