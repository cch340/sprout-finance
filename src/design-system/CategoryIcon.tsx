import type { CSSProperties, HTMLAttributes } from 'react';
import { Icon, type IconName } from './Icon';

const NEUTRAL = { bg: 'var(--surface-hover)', fg: 'var(--text-muted)' };

interface CatDef {
  icon: IconName;
  bg: string;
  fg: string;
}

/**
 * Categories in Sprout are SCOPED to a space. This map is the union of all
 * category icons; which ones appear where is decided by the app data layer.
 */
const CATEGORIES: Record<string, CatDef> = {
  // Everyday Expenses
  grocery: { icon: 'shopping-cart', bg: 'var(--cat-food-bg)', fg: 'var(--cat-food-fg)' },
  meals: { icon: 'soup', bg: 'var(--cat-food-bg)', fg: 'var(--cat-food-fg)' },
  baby: { icon: 'baby', bg: 'var(--cat-baby-bg)', fg: 'var(--cat-baby-fg)' },
  shopping: { icon: 'shopping-bag', bg: 'var(--cat-shopping-bg)', fg: 'var(--cat-shopping-fg)' },
  // Housing (TreeO)
  installment: { icon: 'home', bg: 'var(--cat-house-bg)', fg: 'var(--cat-house-fg)' },
  electric: { icon: 'zap', bg: 'var(--cat-food-bg)', fg: 'var(--cat-food-fg)' },
  water: { icon: 'droplet', bg: 'var(--cat-car-bg)', fg: 'var(--cat-car-fg)' },
  internet: { icon: 'wifi', bg: 'var(--cat-car-bg)', fg: 'var(--cat-car-fg)' },
  maintenance: { icon: 'wrench', ...NEUTRAL },
  furniture: { icon: 'armchair', bg: 'var(--cat-shopping-bg)', fg: 'var(--cat-shopping-fg)' },
  appliance: { icon: 'plug', bg: 'var(--cat-car-bg)', fg: 'var(--cat-car-fg)' },
  // Car
  car: { icon: 'car', bg: 'var(--cat-car-bg)', fg: 'var(--cat-car-fg)' },
  roadtax: { icon: 'shield', bg: 'var(--cat-car-bg)', fg: 'var(--cat-car-fg)' },
  petrol: { icon: 'fuel', bg: 'var(--cat-car-bg)', fg: 'var(--cat-car-fg)' },
  // Investment
  investment: { icon: 'trending-up', bg: 'var(--cat-house-bg)', fg: 'var(--cat-house-fg)' },
  // Personal (JC / CH)
  income: { icon: 'banknote', bg: 'var(--cat-house-bg)', fg: 'var(--cat-house-fg)' },
  subscriptions: { icon: 'repeat', bg: 'var(--cat-shopping-bg)', fg: 'var(--cat-shopping-fg)' },
  insurance: { icon: 'shield', bg: 'var(--cat-car-bg)', fg: 'var(--cat-car-fg)' },
  parent: { icon: 'users', bg: 'var(--cat-baby-bg)', fg: 'var(--cat-baby-fg)' },
  ptptn: { icon: 'graduation-cap', bg: 'var(--cat-car-bg)', fg: 'var(--cat-car-fg)' },
  mobile: { icon: 'smartphone', bg: 'var(--cat-car-bg)', fg: 'var(--cat-car-fg)' },
  house: { icon: 'home', bg: 'var(--cat-house-bg)', fg: 'var(--cat-house-fg)' },
  joint: { icon: 'sprout', bg: 'var(--cat-house-bg)', fg: 'var(--cat-house-fg)' },
  // Generic
  bills: { icon: 'receipt', bg: 'var(--cat-bills-bg)', fg: 'var(--cat-bills-fg)' },
  health: { icon: 'pill', bg: 'var(--cat-bills-bg)', fg: 'var(--cat-bills-fg)' },
  savings: { icon: 'sprout', bg: 'var(--cat-house-bg)', fg: 'var(--cat-house-fg)' },
  money: { icon: 'banknote', bg: 'var(--cat-house-bg)', fg: 'var(--cat-house-fg)' },
  other: { icon: 'package', ...NEUTRAL },
};

export const categoryKeys = Object.keys(CATEGORIES);

export interface CategoryIconProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'style'> {
  category?: string;
  icon?: IconName;
  size?: number;
  radius?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * CategoryIcon — the icon-in-a-tinted-tile marker Sprout uses for
 * expense categories. An explicit `icon` prop overrides the keyed mapping.
 */
export function CategoryIcon({
  category = 'money',
  icon,
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
        color: def.fg,
        lineHeight: 1,
        ...style,
      }}
      {...rest}
    >
      <Icon name={icon || def.icon} size={Math.round(size * 0.5)} />
    </span>
  );
}
