import type { CSSProperties, HTMLAttributes } from 'react';

const NEUTRAL = { bg: 'var(--surface-hover)', fg: 'var(--text-muted)' };

interface CatDef {
  emoji: string;
  bg: string;
  fg?: string;
}

/**
 * Categories in Sprout are SCOPED to a space. This map is the union of all
 * category glyphs; which ones appear where is decided by the app data layer.
 */
const CATEGORIES: Record<string, CatDef> = {
  // Everyday Expenses
  grocery: { emoji: '🛒', bg: 'var(--cat-food-bg)' },
  meals: { emoji: '🍜', bg: 'var(--cat-food-bg)' },
  baby: { emoji: '👶', bg: 'var(--cat-baby-bg)' },
  shopping: { emoji: '🛍️', bg: 'var(--cat-shopping-bg)' },
  // Housing (TreeO)
  installment: { emoji: '🏠', bg: 'var(--cat-house-bg)' },
  electric: { emoji: '⚡', bg: 'var(--cat-food-bg)' },
  water: { emoji: '💧', bg: 'var(--cat-car-bg)' },
  internet: { emoji: '📶', bg: 'var(--cat-car-bg)' },
  maintenance: { emoji: '🔧', ...NEUTRAL },
  furniture: { emoji: '🛋️', bg: 'var(--cat-shopping-bg)' },
  appliance: { emoji: '🔌', bg: 'var(--cat-car-bg)' },
  // Car
  car: { emoji: '🚗', bg: 'var(--cat-car-bg)' },
  roadtax: { emoji: '🛡️', bg: 'var(--cat-car-bg)' },
  petrol: { emoji: '⛽', bg: 'var(--cat-car-bg)' },
  // Investment
  investment: { emoji: '📈', bg: 'var(--cat-house-bg)' },
  // Personal (JC / CH)
  income: { emoji: '💵', bg: 'var(--cat-house-bg)' },
  subscriptions: { emoji: '🔄', bg: 'var(--cat-shopping-bg)' },
  insurance: { emoji: '🛡️', bg: 'var(--cat-car-bg)' },
  parent: { emoji: '👪', bg: 'var(--cat-baby-bg)' },
  ptptn: { emoji: '🎓', bg: 'var(--cat-car-bg)' },
  mobile: { emoji: '📱', bg: 'var(--cat-car-bg)' },
  house: { emoji: '🏠', bg: 'var(--cat-house-bg)' },
  joint: { emoji: '🌱', bg: 'var(--cat-house-bg)' },
  // Generic
  bills: { emoji: '🧾', bg: 'var(--cat-bills-bg)' },
  health: { emoji: '💊', bg: 'var(--cat-bills-bg)' },
  savings: { emoji: '🌱', bg: 'var(--cat-house-bg)' },
  money: { emoji: '💵', bg: 'var(--cat-house-bg)' },
  other: { emoji: '📦', ...NEUTRAL },
};

export const categoryKeys = Object.keys(CATEGORIES);

export interface CategoryIconProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'style'> {
  category?: string;
  emoji?: string;
  size?: number;
  radius?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * CategoryIcon — the emoji-in-a-tinted-tile marker Sprout uses for
 * expense categories.
 */
export function CategoryIcon({
  category = 'money',
  emoji,
  size = 40,
  radius = 'var(--radius-md)',
  className = '',
  style = {},
  ...rest
}: CategoryIconProps) {
  const def = CATEGORIES[category] || CATEGORIES.other;
  return (
    <span
      className={`sprout-cat ${className}`}
      aria-hidden="true"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: radius,
        background: def.bg,
        fontSize: Math.round(size * 0.5),
        lineHeight: 1,
        ...style,
      }}
      {...rest}
    >
      {emoji || def.emoji}
    </span>
  );
}
