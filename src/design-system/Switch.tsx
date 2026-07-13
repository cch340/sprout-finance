import { useId } from 'react';
import type { CSSProperties, InputHTMLAttributes, ReactNode } from 'react';

export type SwitchSize = 'sm' | 'md';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'style' | 'size'> {
  label?: ReactNode;
  description?: ReactNode;
  size?: SwitchSize;
  className?: string;
  style?: CSSProperties;
}

function SwitchStyle({ w, knob }: { w: number; knob: number }) {
  return (
    <style>{`
      .sprout-switch-input:checked + .sprout-switch-track { background: var(--accent); }
      .sprout-switch-input:checked + .sprout-switch-track .sprout-switch-knob { transform: translateX(${w - knob - 6}px); }
      .sprout-switch-input:focus-visible + .sprout-switch-track { box-shadow: var(--shadow-focus); }
    `}</style>
  );
}

/** Switch — on/off toggle. Bare, or as a settings row (with label/description). */
export function Switch({
  label,
  description,
  id,
  disabled,
  size = 'md',
  className = '',
  style = {},
  ...rest
}: SwitchProps) {
  const autoId = useId();
  const swId = id || autoId;
  const w = size === 'sm' ? 36 : 44;
  const h = size === 'sm' ? 22 : 26;
  const knob = h - 6;
  const control = (
    <span style={{ position: 'relative', display: 'inline-flex', flexShrink: 0 }}>
      <input
        type="checkbox"
        id={swId}
        disabled={disabled}
        className="sprout-switch-input"
        style={{
          position: 'absolute',
          opacity: 0,
          width: w,
          height: h,
          margin: 0,
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
        {...rest}
      />
      <span
        className="sprout-switch-track"
        style={{
          width: w,
          height: h,
          borderRadius: 'var(--radius-pill)',
          background: 'var(--neutral-300)',
          transition: 'background-color var(--dur-base) var(--ease-standard)',
          display: 'inline-block',
          position: 'relative',
        }}
      >
        <span
          className="sprout-switch-knob"
          style={{
            position: 'absolute',
            top: 3,
            left: 3,
            width: knob,
            height: knob,
            borderRadius: '50%',
            background: '#fff',
            boxShadow: 'var(--shadow-sm)',
            transition: 'transform var(--dur-base) var(--ease-spring)',
          }}
        />
      </span>
    </span>
  );
  if (!label && !description) {
    return (
      <label
        htmlFor={swId}
        className={`sprout-switch ${className}`}
        style={{ display: 'inline-flex', opacity: disabled ? 0.5 : 1, ...style }}
      >
        {control}
        <SwitchStyle w={w} knob={knob} />
      </label>
    );
  }
  return (
    <label
      htmlFor={swId}
      className={`sprout-switch ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--space-4)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
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
      {control}
      <SwitchStyle w={w} knob={knob} />
    </label>
  );
}
