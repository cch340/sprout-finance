import { useState } from 'react';
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

export interface TabItem {
  value: string;
  label: ReactNode;
  count?: number;
  content?: ReactNode;
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'onChange'> {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
  style?: CSSProperties;
}

/**
 * Tabs — underline-style tab bar. Controlled (`value`+`onChange`) or
 * uncontrolled (`defaultValue`). Renders the active tab's `content` if given.
 */
export function Tabs({
  items,
  value,
  defaultValue,
  onChange,
  className = '',
  style = {},
  ...rest
}: TabsProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue ?? items[0]?.value);
  const current = isControlled ? value : internal;
  const select = (v: string) => {
    if (!isControlled) setInternal(v);
    onChange?.(v);
  };
  const active = items.find((i) => i.value === current);
  return (
    <div className={`sprout-tabs ${className}`} style={style} {...rest}>
      <div
        role="tablist"
        style={{ display: 'flex', gap: 'var(--space-5)', borderBottom: '1px solid var(--border-subtle)' }}
      >
        {items.map((it) => {
          const on = it.value === current;
          return (
            <button
              key={it.value}
              role="tab"
              aria-selected={on}
              onClick={() => select(it.value)}
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: 'var(--space-3) 2px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                font: 'var(--font-label)',
                fontSize: 'var(--text-md)',
                color: on ? 'var(--text-strong)' : 'var(--text-muted)',
                transition: 'var(--transition-colors)',
              }}
            >
              {it.label}
              {it.count != null && (
                <span
                  style={{
                    font: 'var(--font-caption)',
                    fontWeight: 'var(--fw-semibold)' as CSSProperties['fontWeight'],
                    background: on ? 'var(--accent-soft)' : 'var(--surface-hover)',
                    color: on ? 'var(--accent-soft-fg)' : 'var(--text-muted)',
                    borderRadius: 'var(--radius-pill)',
                    padding: '1px 8px',
                  }}
                >
                  {it.count}
                </span>
              )}
              <span
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: -1,
                  height: 2,
                  borderRadius: '2px 2px 0 0',
                  background: on ? 'var(--accent)' : 'transparent',
                  transition: 'background-color var(--dur-fast) var(--ease-standard)',
                }}
              />
            </button>
          );
        })}
      </div>
      {active?.content != null && (
        <div role="tabpanel" style={{ paddingTop: 'var(--space-4)' }}>
          {active.content}
        </div>
      )}
    </div>
  );
}
