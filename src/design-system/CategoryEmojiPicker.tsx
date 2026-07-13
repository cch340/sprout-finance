import type { CSSProperties } from 'react';

/**
 * Curated set of category-appropriate emoji offered when creating a custom
 * category. Kept small and calm on purpose — no free-text emoji input.
 */
export const CATEGORY_EMOJI = [
  '🏠', '🛒', '🍽️', '🚗', '👶', '⚡', '💧', '🌐',
  '🧾', '🛍️', '💊', '🌱', '💵', '📱', '🎬', '✈️',
  '🎁', '🐾', '📚', '🔧', '☕', '🏥',
] as const;

export interface CategoryEmojiPickerProps {
  /** Currently selected emoji, or undefined for "none" (neutral fallback tile). */
  value?: string;
  onChange: (emoji: string | undefined) => void;
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
    fontSize: Math.round(TILE * 0.5),
    lineHeight: 1,
    transition: 'box-shadow var(--dur-fast) var(--ease-standard)',
    boxShadow: selected ? '0 0 0 2px var(--accent)' : '0 0 0 1px var(--border-subtle)',
  };
}

/**
 * CategoryEmojiPicker — a compact grid of curated category emoji plus a "none"
 * option (falls back to the neutral keyed tile). The selected tile gets an
 * accent ring. Purely presentational; the parent owns the value.
 */
export function CategoryEmojiPicker({
  value,
  onChange,
  className = '',
  style = {},
}: CategoryEmojiPickerProps) {
  return (
    <div
      className={`sprout-emoji-picker ${className}`}
      role="group"
      aria-label="Category emoji"
      style={{ display: 'flex', flexWrap: 'wrap', gap: 6, ...style }}
    >
      <button
        type="button"
        aria-label="No emoji"
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
      {CATEGORY_EMOJI.map((e) => (
        <button
          key={e}
          type="button"
          aria-label={e}
          aria-pressed={value === e}
          onClick={() => onChange(e)}
          style={tileStyle(value === e)}
        >
          {e}
        </button>
      ))}
    </div>
  );
}
