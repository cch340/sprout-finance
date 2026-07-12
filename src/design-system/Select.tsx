import { useId } from 'react';
import type { CSSProperties, SelectHTMLAttributes, ReactNode } from 'react';
import { Icon } from './Icon';

export type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectOption {
  value: string;
  label: ReactNode;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'style' | 'size'> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  options?: SelectOption[];
  placeholder?: string;
  size?: SelectSize;
  className?: string;
  style?: CSSProperties;
  containerStyle?: CSSProperties;
  children?: ReactNode;
}

/** Select — native select styled to match Sprout inputs, with a chevron. */
export function Select({
  label,
  hint,
  error,
  options,
  placeholder,
  size = 'md',
  id,
  className = '',
  style = {},
  containerStyle = {},
  children,
  ...rest
}: SelectProps) {
  const autoId = useId();
  const selectId = id || autoId;
  const height = size === 'lg' ? 50 : size === 'sm' ? 36 : 44;
  const invalid = Boolean(error);
  return (
    <div
      className={`sprout-field ${className}`}
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', ...containerStyle }}
    >
      {label && (
        <label htmlFor={selectId} style={{ font: 'var(--font-label)', color: 'var(--text-body)' }}>
          {label}
        </label>
      )}
      <div
        className="sprout-select-wrap"
        data-invalid={invalid || undefined}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          height,
          background: 'var(--surface-card)',
          border: `1px solid ${invalid ? 'var(--danger-500)' : 'var(--border-strong)'}`,
          borderRadius: 'var(--radius-md)',
          transition: 'var(--transition-colors), box-shadow var(--dur-fast) var(--ease-standard)',
        }}
      >
        <select
          id={selectId}
          aria-invalid={invalid || undefined}
          style={{
            appearance: 'none',
            WebkitAppearance: 'none',
            flex: 1,
            height: '100%',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            font: 'var(--font-body)',
            color: 'var(--text-strong)',
            padding: '0 var(--space-8) 0 var(--space-3)',
            cursor: 'pointer',
            ...style,
          }}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options
            ? options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))
            : children}
        </select>
        <Icon
          name="chevron-down"
          size={18}
          style={{
            position: 'absolute',
            right: 'var(--space-3)',
            color: 'var(--text-muted)',
            pointerEvents: 'none',
          }}
        />
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
      <style>{`.sprout-select-wrap:focus-within { border-color: var(--ring-focus) !important; box-shadow: var(--shadow-focus); }`}</style>
    </div>
  );
}
