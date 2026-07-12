import type { CSSProperties, HTMLAttributes } from 'react';

const TINTS = [
  { bg: 'var(--sage-100)', fg: 'var(--sage-700)' },
  { bg: 'var(--cat-food-bg)', fg: 'var(--cat-food-fg)' },
  { bg: 'var(--cat-car-bg)', fg: 'var(--cat-car-fg)' },
  { bg: 'var(--cat-baby-bg)', fg: 'var(--cat-baby-fg)' },
  { bg: 'var(--cat-shopping-bg)', fg: 'var(--cat-shopping-fg)' },
];

function hashIndex(str: string, mod: number): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h) % mod;
}

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'style'> {
  name?: string;
  src?: string;
  size?: number;
  square?: boolean;
  color?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Avatar — initials or image, used for JC / CH / Leo and joint accounts.
 * Deterministic tint from the name unless `color` is given.
 */
export function Avatar({
  name = '',
  src,
  size = 40,
  square = false,
  color,
  className = '',
  style = {},
  ...rest
}: AvatarProps) {
  const initials = name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const tint = color ? { bg: color, fg: '#fff' } : TINTS[hashIndex(name || 'x', TINTS.length)];
  return (
    <span
      className={`sprout-avatar ${className}`}
      title={name || undefined}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        flexShrink: 0,
        overflow: 'hidden',
        borderRadius: square ? 'var(--radius-md)' : 'var(--radius-pill)',
        background: src ? 'var(--surface-sunken)' : tint.bg,
        color: tint.fg,
        fontFamily: 'var(--font-sans)',
        fontWeight: 'var(--fw-bold)' as CSSProperties['fontWeight'],
        fontSize: Math.round(size * 0.38),
        letterSpacing: '-0.02em',
        ...style,
      }}
      {...rest}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        initials || '?'
      )}
    </span>
  );
}
