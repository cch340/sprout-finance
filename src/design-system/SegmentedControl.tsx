import { useState } from 'react';
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

export type SegmentedSize = 'sm' | 'md';

export interface SegmentedOption {
  value: string;
  label: ReactNode;
}

export interface SegmentedControlProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'onChange'> {
  options: SegmentedOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  size?: SegmentedSize;
  fullWidth?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * SegmentedControl — iOS-style pill switch for 2–4 short options.
 * Controlled: pass `value` + `onChange`. Uncontrolled: `defaultValue`.
 */
export function SegmentedControl({
  options,
  value,
  defaultValue,
  onChange,
  size = 'md',
  fullWidth = false,
  className = '',
  style = {},
  ...rest
}: SegmentedControlProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue ?? options[0]?.value);
  const current = isControlled ? value : internal;
  const height = size === 'sm' ? 32 : 40;
  const select = (v: string) => {
    if (!isControlled) setInternal(v);
    onChange?.(v);
  };
  return (
    <div
      role="tablist"
      className={`sprout-segmented ${className}`}
      style={{
        display: fullWidth ? 'grid' : 'inline-grid',
        gridAutoFlow: 'column',
        gridAutoColumns: fullWidth ? '1fr' : 'auto',
        gap: 2,
        padding: 3,
        height,
        background: 'var(--surface-sunken)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        ...style,
      }}
      {...rest}
    >
      {options.map((o) => {
        const active = o.value === current;
        return (
          <button
            key={o.value}
            role="tab"
            aria-selected={active}
            onClick={() => select(o.value)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-2)',
              padding: '0 var(--space-4)',
              border: 'none',
              cursor: 'pointer',
              borderRadius: 'calc(var(--radius-md) - 3px)',
              font: 'var(--font-label)',
              fontSize: size === 'sm' ? 'var(--text-sm)' : 'var(--text-md)',
              color: active ? 'var(--text-strong)' : 'var(--text-muted)',
              background: active ? 'var(--surface-card)' : 'transparent',
              boxShadow: active ? 'var(--shadow-xs)' : 'none',
              transition: 'var(--transition-colors), box-shadow var(--dur-fast) var(--ease-standard)',
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
