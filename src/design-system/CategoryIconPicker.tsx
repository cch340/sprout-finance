import type { CSSProperties } from 'react';
import { Icon, type IconName } from './Icon';

/**
 * Curated set of category-appropriate icons offered when creating a custom
 * category. Kept small and calm on purpose — no free-form icon input.
 */
export const CATEGORY_ICONS: IconName[] = [
  'home', 'shopping-cart', 'utensils', 'soup', 'car', 'baby', 'zap', 'droplet',
  'globe', 'receipt', 'shopping-bag', 'pill', 'sprout', 'banknote', 'smartphone',
  'film', 'plane', 'gift', 'paw-print', 'book-open', 'wrench', 'coffee', 'cross',
];

export interface CategoryIconPickerProps {
  /** Currently selected icon, or undefined for "none" (neutral fallback tile). */
  value?: IconName;
  onChange: (icon: IconName | undefined) => void;
  className?: string;
  style?: CSSProperties;
}

const TILE = 34;

function tileStyle(selected: boolean): CSSProperties {
  return {
    width: TILE,
    height: TILE,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    padding: 0,
    cursor: 'pointer',
    borderRadius: 'var(--radius-md)',
    border: 'none',
    background: 'var(--surface-hover)',
    lineHeight: 1,
    transition: 'box-shadow var(--dur-fast) var(--ease-standard)',
    boxShadow: selected ? '0 0 0 2px var(--accent)' : '0 0 0 1px var(--border-subtle)',
  };
}

/**
 * CategoryIconPicker — a compact grid of curated category icons plus a "none"
 * option (falls back to the neutral keyed tile). The selected tile gets an
 * accent ring. Purely presentational; the parent owns the value.
 */
export function CategoryIconPicker({
  value,
  onChange,
  className = '',
  style = {},
}: CategoryIconPickerProps) {
  return (
    <div
      className={`sprout-icon-picker ${className}`}
      role="group"
      aria-label="Category icon"
      style={{ display: 'flex', flexWrap: 'wrap', gap: 6, ...style }}
    >
      <button
        type="button"
        aria-label="No icon"
        aria-pressed={!value}
        onClick={() => onChange(undefined)}
        style={{
          ...tileStyle(!value),
          color: 'var(--text-muted)',
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--fw-semibold)',
        }}
      >
        None
      </button>
      {CATEGORY_ICONS.map((n) => (
        <button
          key={n}
          type="button"
          aria-label={n}
          aria-pressed={value === n}
          onClick={() => onChange(n)}
          style={{
            ...tileStyle(value === n),
            color: value === n ? 'var(--accent)' : 'var(--text-muted)',
          }}
        >
          <Icon name={n} size={17} />
        </button>
      ))}
    </div>
  );
}
