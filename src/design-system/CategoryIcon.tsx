import type { CSSProperties, HTMLAttributes } from 'react';
import { Icon, PATHS, type IconName } from './Icon';

/**
 * Categories in Sprout are SCOPED to a space. This map is the union of all
 * category icons; which ones appear where is decided by the app data layer.
 */
const CATEGORIES: Record<string, IconName> = {
  // Everyday Expenses
  grocery: 'shopping-cart',
  meals: 'soup',
  baby: 'baby',
  shopping: 'shopping-bag',
  // Housing (TreeO)
  installment: 'home',
  electric: 'zap',
  water: 'droplet',
  internet: 'wifi',
  maintenance: 'wrench',
  furniture: 'armchair',
  appliance: 'plug',
  // Car
  car: 'car',
  roadtax: 'shield',
  petrol: 'fuel',
  // Investment
  investment: 'trending-up',
  // Personal (JC / CH)
  income: 'banknote',
  subscriptions: 'repeat',
  insurance: 'shield',
  parent: 'users',
  ptptn: 'graduation-cap',
  mobile: 'smartphone',
  house: 'home',
  joint: 'sprout',
  // Generic
  bills: 'receipt',
  health: 'pill',
  savings: 'sprout',
  money: 'banknote',
  other: 'package',
};

export const categoryKeys = Object.keys(CATEGORIES);

export interface CategoryIconProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'style'> {
  category?: string;
  /** Explicit icon name (domain stores it as a plain string); unknown names fall back to the keyed mapping. */
  icon?: string;
  size?: number;
  radius?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * CategoryIcon — the icon-in-a-neutral-tile marker Sprout uses for expense
 * categories. The glyph carries the meaning; the tile uses the theme's
 * neutral surface/text colors so seeded and custom categories look alike.
 * An explicit `icon` prop overrides the keyed mapping.
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
  const iconName =
    icon && icon in PATHS ? (icon as IconName) : CATEGORIES[category] || CATEGORIES.other;
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
        background: 'var(--surface-hover)',
        color: 'var(--text-muted)',
        lineHeight: 1,
        ...style,
      }}
      {...rest}
    >
      <Icon name={iconName} size={Math.round(size * 0.5)} />
    </span>
  );
}
