/* @ds-bundle: {"format":4,"namespace":"KiraDesignSystem_c378eb","components":[{"name":"Amount","sourcePath":"components/data-display/Amount.jsx"},{"name":"Avatar","sourcePath":"components/data-display/Avatar.jsx"},{"name":"Badge","sourcePath":"components/data-display/Badge.jsx"},{"name":"Card","sourcePath":"components/data-display/Card.jsx"},{"name":"CategoryIcon","sourcePath":"components/data-display/CategoryIcon.jsx"},{"name":"ListRow","sourcePath":"components/data-display/ListRow.jsx"},{"name":"ProgressBar","sourcePath":"components/data-display/ProgressBar.jsx"},{"name":"StatCard","sourcePath":"components/data-display/StatCard.jsx"},{"name":"Tag","sourcePath":"components/data-display/Tag.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"IconButton","sourcePath":"components/forms/IconButton.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"SegmentedControl","sourcePath":"components/forms/SegmentedControl.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"},{"name":"Icon","sourcePath":"components/foundation/Icon.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/data-display/Amount.jsx":"bcf7d3568ae7","components/data-display/Avatar.jsx":"a51e8b028b39","components/data-display/Badge.jsx":"f77bc587aba1","components/data-display/Card.jsx":"a510f1e2675f","components/data-display/CategoryIcon.jsx":"ce4dddad166c","components/data-display/ListRow.jsx":"51149bebf1bb","components/data-display/ProgressBar.jsx":"6e6f152fb183","components/data-display/StatCard.jsx":"8b6d24f47171","components/data-display/Tag.jsx":"4177f934162e","components/feedback/Dialog.jsx":"28659ce06e62","components/feedback/Toast.jsx":"84a54b172937","components/feedback/Tooltip.jsx":"7ea2ea69f70c","components/forms/Button.jsx":"6fb868720572","components/forms/Checkbox.jsx":"de63848c65e1","components/forms/IconButton.jsx":"d8b93e45fb8a","components/forms/Input.jsx":"bdb8c778cbb4","components/forms/Radio.jsx":"8a877490c05f","components/forms/SegmentedControl.jsx":"bdb121ee0e15","components/forms/Select.jsx":"5b6b2233327e","components/forms/Switch.jsx":"ad40a4d083fb","components/forms/Textarea.jsx":"3af787a092a0","components/foundation/Icon.jsx":"68e367effcf5","components/navigation/Tabs.jsx":"4481ac6a447a","ui_kits/desktop/Dashboard.jsx":"ff9612c684b2","ui_kits/desktop/data.js":"effdc55ab4e3","ui_kits/mobile/AddExpense.jsx":"793cdca2f227","ui_kits/mobile/Home.jsx":"76b2268f72aa","ui_kits/mobile/Manage.jsx":"8a19f75a57f1","ui_kits/mobile/Onboarding.jsx":"a9e0866d81e3","ui_kits/mobile/Personal.jsx":"3d7df98dadde","ui_kits/mobile/Reports.jsx":"ba549746345e","ui_kits/mobile/SpaceDetail.jsx":"890464e2b70e","ui_kits/mobile/Spaces.jsx":"516e55d7f4b3","ui_kits/mobile/data.js":"effdc55ab4e3"},"inlinedExternals":[],"unexposedExports":[{"name":"categoryKeys","sourcePath":"components/data-display/CategoryIcon.jsx"},{"name":"iconNames","sourcePath":"components/foundation/Icon.jsx"}]} */

(() => {

const __ds_ns = (window.KiraDesignSystem_c378eb = window.KiraDesignSystem_c378eb || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/data-display/Amount.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Amount — formats a number as Malaysian Ringgit with tabular figures.
 * Expenses render neutral (calm); income is green; over-budget is red.
 */
function Amount({
  value,
  currency = 'RM',
  kind = 'neutral',
  // 'neutral' | 'in' | 'out' | 'over'
  size = 'md',
  // 'sm' | 'md' | 'lg' | 'xl' | 'hero'
  showSign = false,
  decimals = 2,
  weight,
  className = '',
  style = {},
  ...rest
}) {
  const sizeMap = {
    sm: 'var(--text-sm)',
    md: 'var(--text-md)',
    lg: 'var(--text-xl)',
    xl: 'var(--text-3xl)',
    hero: 'var(--text-4xl)'
  };
  const colorMap = {
    neutral: 'var(--text-strong)',
    in: 'var(--money-in)',
    out: 'var(--text-strong)',
    over: 'var(--money-over)'
  };
  const abs = Math.abs(value);
  const [whole, frac] = abs.toLocaleString('en-MY', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).split('.');
  const sign = showSign ? kind === 'in' ? '+' : value < 0 || kind === 'out' ? '−' : '' : value < 0 ? '−' : '';
  const big = size === 'hero' || size === 'xl';
  return /*#__PURE__*/React.createElement("span", _extends({
    className: `sprout-amount ${className}`,
    style: {
      fontFamily: 'var(--font-sans)',
      fontWeight: weight ?? (big ? 'var(--fw-extra)' : 'var(--fw-semibold)'),
      fontSize: sizeMap[size],
      letterSpacing: big ? 'var(--tracking-tight)' : 'var(--tracking-snug)',
      fontVariantNumeric: 'tabular-nums',
      color: colorMap[kind],
      whiteSpace: 'nowrap',
      ...style
    }
  }, rest), sign, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 'inherit',
      opacity: 0.62,
      fontSize: big ? '0.62em' : '0.86em',
      marginRight: '0.12em'
    }
  }, currency), whole, decimals > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: big ? 0.42 : 0.6,
      fontSize: big ? '0.62em' : '1em'
    }
  }, ".", frac));
}
Object.assign(__ds_scope, { Amount });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Amount.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Avatar — initials or image, used for JC / CH / Leo and joint accounts.
 * Deterministic tint from the name unless `color` is given.
 */
const TINTS = [{
  bg: 'var(--sage-100)',
  fg: 'var(--sage-700)'
}, {
  bg: 'var(--cat-food-bg)',
  fg: 'var(--cat-food-fg)'
}, {
  bg: 'var(--cat-car-bg)',
  fg: 'var(--cat-car-fg)'
}, {
  bg: 'var(--cat-baby-bg)',
  fg: 'var(--cat-baby-fg)'
}, {
  bg: 'var(--cat-shopping-bg)',
  fg: 'var(--cat-shopping-fg)'
}];
function hashIndex(str, mod) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = h * 31 + str.charCodeAt(i) | 0;
  return Math.abs(h) % mod;
}
function Avatar({
  name = '',
  src,
  size = 40,
  square = false,
  color,
  className = '',
  style = {},
  ...rest
}) {
  const initials = name.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const tint = color ? {
    bg: color,
    fg: '#fff'
  } : TINTS[hashIndex(name || 'x', TINTS.length)];
  return /*#__PURE__*/React.createElement("span", _extends({
    className: `sprout-avatar ${className}`,
    title: name || undefined,
    style: {
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
      fontWeight: 'var(--fw-bold)',
      fontSize: Math.round(size * 0.38),
      letterSpacing: '-0.02em',
      ...style
    }
  }, rest), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : initials || '?');
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Badge — small status pill. Tones map to Sprout's semantic colors. */
const tones = {
  neutral: {
    bg: 'var(--neutral-150)',
    fg: 'var(--text-body)'
  },
  accent: {
    bg: 'var(--accent-soft)',
    fg: 'var(--accent-soft-fg)'
  },
  income: {
    bg: 'var(--income-50)',
    fg: 'var(--income-600)'
  },
  danger: {
    bg: 'var(--danger-50)',
    fg: 'var(--danger-600)'
  },
  warning: {
    bg: 'var(--warning-50)',
    fg: 'var(--warning-600)'
  },
  info: {
    bg: 'var(--info-50)',
    fg: 'var(--info-600)'
  }
};
function Badge({
  children,
  tone = 'neutral',
  dot = false,
  solid = false,
  className = '',
  style = {},
  ...rest
}) {
  const t = tones[tone] || tones.neutral;
  return /*#__PURE__*/React.createElement("span", _extends({
    className: `sprout-badge ${className}`,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-1)',
      padding: '3px var(--space-2)',
      font: 'var(--font-caption)',
      fontWeight: 'var(--fw-semibold)',
      lineHeight: 1.4,
      borderRadius: 'var(--radius-pill)',
      background: solid ? t.fg : t.bg,
      color: solid ? '#fff' : t.fg,
      whiteSpace: 'nowrap',
      ...style
    }
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: solid ? '#fff' : t.fg,
      flexShrink: 0
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Card — the soft white surface everything in Sprout sits on.
 * `interactive` adds hover lift; `padding` controls interior space.
 */
function Card({
  children,
  interactive = false,
  padding = 'lg',
  radius = 'lg',
  as = 'div',
  className = '',
  style = {},
  ...rest
}) {
  const Tag = as;
  const padMap = {
    none: 0,
    sm: 'var(--space-4)',
    md: 'var(--space-5)',
    lg: 'var(--space-6)'
  };
  const radMap = {
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
    xl: 'var(--radius-xl)'
  };
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: `sprout-card ${interactive ? 'sprout-card--interactive' : ''} ${className}`,
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: radMap[radius] || radius,
      boxShadow: 'var(--shadow-sm)',
      padding: padMap[padding] ?? padding,
      transition: 'transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-standard)',
      ...style
    }
  }, rest), children, interactive && /*#__PURE__*/React.createElement("style", null, `
          .sprout-card--interactive { cursor: pointer; }
          .sprout-card--interactive:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
          .sprout-card--interactive:active { transform: translateY(0); }
        `));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Card.jsx", error: String((e && e.message) || e) }); }

// components/data-display/CategoryIcon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * CategoryIcon — the emoji-in-a-tinted-tile marker Sprout uses for
 * expense categories (echoing the couple's own ⚡💧🛒 sheet convention).
 *
 * Categories in Sprout are SCOPED to a space (Housing has Electric/Water,
 * Car has Road tax, Personal has PTPTN, etc). This map is the union of all
 * category glyphs; which ones appear where is decided by the app's data
 * layer, not here.
 */
const NEUTRAL = {
  bg: 'var(--neutral-150)',
  fg: 'var(--text-muted)'
};
const CATEGORIES = {
  // Everyday Expenses
  grocery: {
    emoji: '🛒',
    bg: 'var(--cat-food-bg)'
  },
  meals: {
    emoji: '🍜',
    bg: 'var(--cat-food-bg)'
  },
  baby: {
    emoji: '👶',
    bg: 'var(--cat-baby-bg)'
  },
  shopping: {
    emoji: '🛍️',
    bg: 'var(--cat-shopping-bg)'
  },
  // Housing (TreeO)
  installment: {
    emoji: '🏠',
    bg: 'var(--cat-house-bg)'
  },
  electric: {
    emoji: '⚡',
    bg: 'var(--cat-food-bg)'
  },
  water: {
    emoji: '💧',
    bg: 'var(--cat-car-bg)'
  },
  internet: {
    emoji: '📶',
    bg: 'var(--cat-car-bg)'
  },
  maintenance: {
    emoji: '🔧',
    ...NEUTRAL
  },
  furniture: {
    emoji: '🛋️',
    bg: 'var(--cat-shopping-bg)'
  },
  appliance: {
    emoji: '🔌',
    bg: 'var(--cat-car-bg)'
  },
  // Car
  car: {
    emoji: '🚗',
    bg: 'var(--cat-car-bg)'
  },
  roadtax: {
    emoji: '🛡️',
    bg: 'var(--cat-car-bg)'
  },
  petrol: {
    emoji: '⛽',
    bg: 'var(--cat-car-bg)'
  },
  // Investment
  investment: {
    emoji: '📈',
    bg: 'var(--cat-house-bg)'
  },
  // Personal (JC / CH)
  income: {
    emoji: '💵',
    bg: 'var(--cat-house-bg)'
  },
  subscriptions: {
    emoji: '🔄',
    bg: 'var(--cat-shopping-bg)'
  },
  insurance: {
    emoji: '🛡️',
    bg: 'var(--cat-car-bg)'
  },
  parent: {
    emoji: '👪',
    bg: 'var(--cat-baby-bg)'
  },
  ptptn: {
    emoji: '🎓',
    bg: 'var(--cat-car-bg)'
  },
  mobile: {
    emoji: '📱',
    bg: 'var(--cat-car-bg)'
  },
  house: {
    emoji: '🏠',
    bg: 'var(--cat-house-bg)'
  },
  joint: {
    emoji: '🌱',
    bg: 'var(--cat-house-bg)'
  },
  // Generic
  bills: {
    emoji: '🧾',
    bg: 'var(--cat-bills-bg)'
  },
  health: {
    emoji: '💊',
    bg: 'var(--cat-bills-bg)'
  },
  savings: {
    emoji: '🌱',
    bg: 'var(--cat-house-bg)'
  },
  money: {
    emoji: '💵',
    bg: 'var(--cat-house-bg)'
  },
  other: {
    emoji: '📦',
    ...NEUTRAL
  }
};
function CategoryIcon({
  category = 'money',
  emoji,
  size = 40,
  radius = 'var(--radius-md)',
  className = '',
  style = {},
  ...rest
}) {
  const def = CATEGORIES[category] || CATEGORIES.other;
  return /*#__PURE__*/React.createElement("span", _extends({
    className: `sprout-cat ${className}`,
    "aria-hidden": "true",
    style: {
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
      ...style
    }
  }, rest), emoji || def.emoji);
}
const categoryKeys = Object.keys(CATEGORIES);
Object.assign(__ds_scope, { CategoryIcon, categoryKeys });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/CategoryIcon.jsx", error: String((e && e.message) || e) }); }

// components/data-display/ProgressBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * ProgressBar — budget / commitment progress. Turns red when over 100%.
 * Optionally segmented for category breakdowns.
 */
function ProgressBar({
  value = 0,
  max = 100,
  tone = 'accent',
  size = 'md',
  segments,
  showLabel = false,
  label,
  className = '',
  style = {},
  ...rest
}) {
  const height = size === 'sm' ? 6 : size === 'lg' ? 12 : 8;
  const pct = Math.min(100, value / max * 100);
  const over = value > max;
  const toneColor = over ? 'var(--danger-500)' : tone === 'income' ? 'var(--money-in)' : tone === 'warning' ? 'var(--warning-500)' : 'var(--accent)';
  return /*#__PURE__*/React.createElement("div", _extends({
    className: `sprout-progress ${className}`,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)',
      ...style
    }
  }, rest), (showLabel || label) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      font: 'var(--font-caption)',
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("span", null, label), showLabel && /*#__PURE__*/React.createElement("span", {
    style: {
      color: over ? 'var(--danger-500)' : 'var(--text-body)',
      fontWeight: 'var(--fw-semibold)'
    }
  }, Math.round(value / max * 100), "%")), /*#__PURE__*/React.createElement("div", {
    role: "progressbar",
    "aria-valuenow": value,
    "aria-valuemax": max,
    style: {
      display: 'flex',
      gap: 2,
      height,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--neutral-200)',
      overflow: 'hidden'
    }
  }, segments ? segments.map((s, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      width: `${s.value / max * 100}%`,
      background: s.color || toneColor
    }
  })) : /*#__PURE__*/React.createElement("span", {
    style: {
      width: `${pct}%`,
      background: toneColor,
      borderRadius: 'var(--radius-pill)',
      transition: 'width var(--dur-slow) var(--ease-out)'
    }
  })));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Tooltip — hover/focus label. CSS-only reveal; wraps a single child.
 * Keep copy short (a few words).
 */
function Tooltip({
  label,
  side = 'top',
  children,
  className = '',
  style = {},
  ...rest
}) {
  const pos = {
    top: {
      bottom: '100%',
      left: '50%',
      transform: 'translateX(-50%) translateY(-6px)'
    },
    bottom: {
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%) translateY(6px)'
    },
    left: {
      right: '100%',
      top: '50%',
      transform: 'translateY(-50%) translateX(-6px)'
    },
    right: {
      left: '100%',
      top: '50%',
      transform: 'translateY(-50%) translateX(6px)'
    }
  }[side];
  return /*#__PURE__*/React.createElement("span", _extends({
    className: `sprout-tooltip ${className}`,
    style: {
      position: 'relative',
      display: 'inline-flex'
    }
  }, rest), children, /*#__PURE__*/React.createElement("span", {
    role: "tooltip",
    className: "sprout-tooltip-bubble",
    style: {
      position: 'absolute',
      ...pos,
      zIndex: 50,
      padding: '5px var(--space-2)',
      font: 'var(--font-caption)',
      fontWeight: 'var(--fw-medium)',
      color: 'var(--text-on-inverse)',
      background: 'var(--surface-inverse)',
      borderRadius: 'var(--radius-sm)',
      boxShadow: 'var(--shadow-md)',
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
      opacity: 0,
      transition: 'opacity var(--dur-fast) var(--ease-standard)',
      ...style
    }
  }, label), /*#__PURE__*/React.createElement("style", null, `
        .sprout-tooltip:hover .sprout-tooltip-bubble,
        .sprout-tooltip:focus-within .sprout-tooltip-bubble { opacity: 1; }
      `));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Radio — single-choice control. Use several with the same `name`. */
function Radio({
  label,
  description,
  id,
  disabled,
  className = '',
  style = {},
  ...rest
}) {
  const autoId = React.useId ? React.useId() : undefined;
  const rId = id || autoId;
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: rId,
    className: `sprout-radio ${className}`,
    style: {
      display: 'flex',
      alignItems: description ? 'flex-start' : 'center',
      gap: 'var(--space-3)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex',
      flexShrink: 0,
      marginTop: description ? 2 : 0
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "radio",
    id: rId,
    disabled: disabled,
    className: "sprout-radio-input",
    style: {
      position: 'absolute',
      opacity: 0,
      width: 20,
      height: 20,
      margin: 0,
      cursor: 'inherit'
    }
  }, rest)), /*#__PURE__*/React.createElement("span", {
    className: "sprout-radio-dot",
    style: {
      width: 20,
      height: 20,
      borderRadius: 'var(--radius-pill)',
      border: '2px solid var(--border-strong)',
      background: 'var(--surface-card)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'var(--transition-colors)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "sprout-radio-fill",
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: '#fff',
      transform: 'scale(0)',
      transition: 'transform var(--dur-fast) var(--ease-spring)'
    }
  }))), (label || description) && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--font-body)',
      fontWeight: 'var(--fw-medium)',
      color: 'var(--text-strong)'
    }
  }, label), description && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--font-caption)',
      color: 'var(--text-muted)'
    }
  }, description)), /*#__PURE__*/React.createElement("style", null, `
        .sprout-radio-input:checked + .sprout-radio-dot { background: var(--accent); border-color: var(--accent); }
        .sprout-radio-input:checked + .sprout-radio-dot .sprout-radio-fill { transform: scale(1); }
        .sprout-radio-input:focus-visible + .sprout-radio-dot { box-shadow: var(--shadow-focus); }
        .sprout-radio:hover .sprout-radio-input:not(:checked):not(:disabled) + .sprout-radio-dot { border-color: var(--accent); }
      `));
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/SegmentedControl.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * SegmentedControl — iOS-style pill switch for 2–4 short options.
 * Controlled: pass `value` + `onChange(value)`. Uncontrolled: `defaultValue`.
 */
function SegmentedControl({
  options,
  value,
  defaultValue,
  onChange,
  size = 'md',
  fullWidth = false,
  className = '',
  style = {},
  ...rest
}) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue ?? options[0]?.value);
  const current = isControlled ? value : internal;
  const height = size === 'sm' ? 32 : 40;
  const select = v => {
    if (!isControlled) setInternal(v);
    onChange?.(v);
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "tablist",
    className: `sprout-segmented ${className}`,
    style: {
      display: fullWidth ? 'grid' : 'inline-grid',
      gridAutoFlow: 'column',
      gridAutoColumns: fullWidth ? '1fr' : 'auto',
      gap: 2,
      padding: 3,
      height,
      background: 'var(--surface-sunken)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      ...style
    }
  }, rest), options.map(o => {
    const active = o.value === current;
    return /*#__PURE__*/React.createElement("button", {
      key: o.value,
      role: "tab",
      "aria-selected": active,
      onClick: () => select(o.value),
      style: {
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
        transition: 'var(--transition-colors), box-shadow var(--dur-fast) var(--ease-standard)'
      }
    }, o.label);
  }));
}
Object.assign(__ds_scope, { SegmentedControl });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SegmentedControl.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Switch — on/off toggle. Controlled via `checked` or uncontrolled `defaultChecked`. */
function Switch({
  label,
  description,
  id,
  disabled,
  size = 'md',
  className = '',
  style = {},
  ...rest
}) {
  const autoId = React.useId ? React.useId() : undefined;
  const swId = id || autoId;
  const w = size === 'sm' ? 36 : 44;
  const h = size === 'sm' ? 22 : 26;
  const knob = h - 6;
  const control = /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    id: swId,
    disabled: disabled,
    className: "sprout-switch-input",
    style: {
      position: 'absolute',
      opacity: 0,
      width: w,
      height: h,
      margin: 0,
      cursor: disabled ? 'not-allowed' : 'pointer'
    }
  }, rest)), /*#__PURE__*/React.createElement("span", {
    className: "sprout-switch-track",
    style: {
      width: w,
      height: h,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--neutral-300)',
      transition: 'background-color var(--dur-base) var(--ease-standard)',
      display: 'inline-block',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "sprout-switch-knob",
    style: {
      position: 'absolute',
      top: 3,
      left: 3,
      width: knob,
      height: knob,
      borderRadius: '50%',
      background: '#fff',
      boxShadow: 'var(--shadow-sm)',
      transition: 'transform var(--dur-base) var(--ease-spring)'
    }
  })));
  if (!label && !description) {
    return /*#__PURE__*/React.createElement("label", {
      htmlFor: swId,
      className: `sprout-switch ${className}`,
      style: {
        display: 'inline-flex',
        opacity: disabled ? 0.5 : 1,
        ...style
      }
    }, control, /*#__PURE__*/React.createElement(SwitchStyle, {
      w: w,
      knob: knob
    }));
  }
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: swId,
    className: `sprout-switch ${className}`,
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--space-4)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--font-body)',
      fontWeight: 'var(--fw-medium)',
      color: 'var(--text-strong)'
    }
  }, label), description && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--font-caption)',
      color: 'var(--text-muted)'
    }
  }, description)), control, /*#__PURE__*/React.createElement(SwitchStyle, {
    w: w,
    knob: knob
  }));
}
function SwitchStyle({
  w,
  knob
}) {
  return /*#__PURE__*/React.createElement("style", null, `
      .sprout-switch-input:checked + .sprout-switch-track { background: var(--accent); }
      .sprout-switch-input:checked + .sprout-switch-track .sprout-switch-knob { transform: translateX(${w - knob - 6}px); }
      .sprout-switch-input:focus-visible + .sprout-switch-track { box-shadow: var(--shadow-focus); }
    `);
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Textarea — multi-line text field with label, hint & error. */
function Textarea({
  label,
  hint,
  error,
  id,
  rows = 3,
  className = '',
  style = {},
  containerStyle = {},
  ...rest
}) {
  const autoId = React.useId ? React.useId() : undefined;
  const inputId = id || autoId;
  const invalid = Boolean(error);
  return /*#__PURE__*/React.createElement("div", {
    className: `sprout-field ${className}`,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)',
      ...containerStyle
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      font: 'var(--font-label)',
      color: 'var(--text-body)'
    }
  }, label), /*#__PURE__*/React.createElement("textarea", _extends({
    id: inputId,
    rows: rows,
    "aria-invalid": invalid || undefined,
    className: "sprout-textarea",
    style: {
      font: 'var(--font-body)',
      color: 'var(--text-strong)',
      background: 'var(--surface-card)',
      border: `1px solid ${invalid ? 'var(--danger-500)' : 'var(--border-strong)'}`,
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-3)',
      resize: 'vertical',
      outline: 'none',
      transition: 'var(--transition-colors), box-shadow var(--dur-fast) var(--ease-standard)',
      ...style
    }
  }, rest)), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--font-caption)',
      color: invalid ? 'var(--danger-500)' : 'var(--text-muted)'
    }
  }, error || hint), /*#__PURE__*/React.createElement("style", null, `
        .sprout-textarea:focus { border-color: var(--ring-focus) !important; box-shadow: var(--shadow-focus); }
        .sprout-textarea::placeholder { color: var(--text-subtle); }
      `));
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); }

// components/foundation/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Curated Lucide icon set (ISC license), embedded so the bundle is
 * self-contained — no CDN dependency. 24×24 viewBox, stroke = currentColor.
 * Add new glyphs by pasting the inner SVG of any Lucide icon here.
 */
const PATHS = {
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  'chevron-right': '<path d="m9 18 6-6-6-6"/>',
  'chevron-left': '<path d="m15 18-6-6 6-6"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  'chevron-up': '<path d="m18 15-6-6-6 6"/>',
  'arrow-left': '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
  'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  'arrow-up-right': '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
  'arrow-down-right': '<path d="m7 7 10 10"/><path d="M17 7v10H7"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  calendar: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
  home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
  wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V6"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>',
  'credit-card': '<rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/>',
  banknote: '<rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>',
  'trending-up': '<path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/>',
  'trending-down': '<path d="M16 17h6v-6"/><path d="m22 17-8.5-8.5-5 5L2 7"/>',
  'pie-chart': '<path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>',
  'bar-chart': '<path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
  repeat: '<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>',
  user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  'plus-circle': '<circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  trash: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M10 11v6"/><path d="M14 11v6"/>',
  zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
  droplet: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
  receipt: '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8H8"/><path d="M16 12H8"/><path d="M13 16H8"/>',
  'more-horizontal': '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
  'more-vertical': '<circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>',
  eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  menu: '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>',
  filter: '<path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>',
  tag: '<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  'alert-triangle': '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  'check-circle': '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>',
  settings: '<path d="M21 4H14"/><path d="M10 4H3"/><path d="M21 12H12"/><path d="M8 12H3"/><path d="M21 20H16"/><path d="M12 20H3"/><path d="M14 2v4"/><path d="M8 10v4"/><path d="M16 18v4"/>',
  wand: '<path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8 19 13"/><path d="M15 9h.01"/><path d="M17.8 6.2 19 5"/><path d="m3 21 9-9"/><path d="M12.2 6.2 11 5"/>'
};

/**
 * Icon — renders a curated Lucide glyph inline.
 * @param {{name: string, size?: number, strokeWidth?: number, className?: string, style?: object, 'aria-label'?: string}} props
 */
function Icon({
  name,
  size = 20,
  strokeWidth = 2,
  className = '',
  style = {},
  ...rest
}) {
  const inner = PATHS[name];
  if (!inner) {
    if (typeof console !== 'undefined') console.warn(`Icon: unknown name "${name}"`);
    return null;
  }
  const label = rest['aria-label'];
  return /*#__PURE__*/React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: className,
    style: {
      display: 'block',
      flexShrink: 0,
      ...style
    },
    role: label ? 'img' : undefined,
    "aria-label": label,
    "aria-hidden": label ? undefined : true,
    focusable: "false",
    dangerouslySetInnerHTML: {
      __html: inner
    }
  }, rest));
}
const iconNames = Object.keys(PATHS);
Object.assign(__ds_scope, { Icon, iconNames });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/foundation/Icon.jsx", error: String((e && e.message) || e) }); }

// components/data-display/ListRow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * ListRow — the transaction/setting row that fills most Sprout screens.
 * Compose freely: `leading` (CategoryIcon/Avatar), `title`, `subtitle`,
 * `trailing` (Amount/Badge), optional `meta` under the trailing slot.
 */
function ListRow({
  leading,
  title,
  subtitle,
  trailing,
  meta,
  chevron = false,
  onClick,
  divider = false,
  className = '',
  style = {},
  ...rest
}) {
  const clickable = Boolean(onClick);
  return /*#__PURE__*/React.createElement("div", _extends({
    className: `sprout-row ${clickable ? 'sprout-row--click' : ''} ${className}`,
    onClick: onClick,
    role: clickable ? 'button' : undefined,
    tabIndex: clickable ? 0 : undefined,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      padding: 'var(--space-3)',
      borderBottom: divider ? '1px solid var(--border-subtle)' : 'none',
      cursor: clickable ? 'pointer' : 'default',
      borderRadius: 'var(--radius-md)',
      transition: 'background-color var(--dur-fast) var(--ease-standard)',
      ...style
    }
  }, rest), leading && /*#__PURE__*/React.createElement("span", {
    style: {
      flexShrink: 0,
      display: 'inline-flex'
    }
  }, leading), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--font-body)',
      fontWeight: 'var(--fw-semibold)',
      color: 'var(--text-strong)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--font-caption)',
      color: 'var(--text-muted)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, subtitle)), (trailing || meta) && /*#__PURE__*/React.createElement("span", {
    style: {
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: 1
    }
  }, trailing, meta && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--font-caption)',
      color: 'var(--text-muted)'
    }
  }, meta)), chevron && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-right",
    size: 18,
    style: {
      color: 'var(--text-subtle)',
      flexShrink: 0
    }
  }), clickable && /*#__PURE__*/React.createElement("style", null, `.sprout-row--click:hover { background: var(--surface-hover); } .sprout-row--click:focus-visible { outline: none; box-shadow: var(--shadow-focus); }`));
}
Object.assign(__ds_scope, { ListRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/ListRow.jsx", error: String((e && e.message) || e) }); }

// components/data-display/StatCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * StatCard — a headline metric with label and optional trend.
 * Used across Sprout's overview (Total spent, Joint Fund, Left to spend).
 */
function StatCard({
  label,
  value,
  amountProps = {},
  trend,
  trendDirection,
  icon,
  accent = false,
  footer,
  className = '',
  style = {},
  ...rest
}) {
  const up = trendDirection === 'up';
  const trendColor = trendDirection === 'up' ? 'var(--money-in)' : trendDirection === 'down' ? 'var(--danger-500)' : 'var(--text-muted)';
  return /*#__PURE__*/React.createElement("div", _extends({
    className: `sprout-statcard ${className}`,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)',
      padding: 'var(--space-6)',
      background: accent ? 'var(--accent)' : 'var(--surface-card)',
      border: `1px solid ${accent ? 'transparent' : 'var(--border-subtle)'}`,
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-sm)',
      color: accent ? 'var(--text-on-accent)' : undefined,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--font-label)',
      color: accent ? 'rgba(255,255,255,0.85)' : 'var(--text-muted)'
    }
  }, label), icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 18,
    style: {
      color: accent ? 'rgba(255,255,255,0.75)' : 'var(--text-subtle)'
    }
  })), typeof value === 'number' ? /*#__PURE__*/React.createElement(__ds_scope.Amount, _extends({
    value: value,
    size: "xl"
  }, amountProps, {
    style: {
      color: accent ? '#fff' : undefined,
      ...(amountProps.style || {})
    }
  })) : /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--font-h2)',
      color: accent ? '#fff' : 'var(--text-strong)'
    }
  }, value), (trend || footer) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      marginTop: 2
    }
  }, trend && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      font: 'var(--font-caption)',
      fontWeight: 'var(--fw-semibold)',
      color: accent ? '#fff' : trendColor
    }
  }, trendDirection && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: up ? 'trending-up' : 'trending-down',
    size: 14
  }), trend), footer && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--font-caption)',
      color: accent ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)'
    }
  }, footer)));
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/StatCard.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Tag — a removable/selectable filter chip. */
function Tag({
  children,
  selected = false,
  onRemove,
  iconStart,
  size = 'md',
  className = '',
  style = {},
  ...rest
}) {
  const height = size === 'sm' ? 26 : 32;
  return /*#__PURE__*/React.createElement("span", _extends({
    className: `sprout-tag ${className}`,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      height,
      padding: size === 'sm' ? '0 var(--space-2)' : '0 var(--space-3)',
      font: 'var(--font-label)',
      fontSize: size === 'sm' ? 'var(--text-xs)' : 'var(--text-sm)',
      borderRadius: 'var(--radius-pill)',
      background: selected ? 'var(--accent)' : 'var(--surface-card)',
      color: selected ? '#fff' : 'var(--text-body)',
      border: `1px solid ${selected ? 'var(--accent)' : 'var(--border-strong)'}`,
      cursor: rest.onClick ? 'pointer' : 'default',
      transition: 'var(--transition-colors)',
      whiteSpace: 'nowrap',
      ...style
    }
  }, rest), iconStart && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconStart,
    size: 14
  }), children, onRemove && /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      onRemove(e);
    },
    "aria-label": "Remove",
    style: {
      display: 'inline-flex',
      border: 'none',
      background: 'transparent',
      padding: 0,
      margin: '0 -2px 0 0',
      cursor: 'pointer',
      color: selected ? 'rgba(255,255,255,0.85)' : 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 14,
    strokeWidth: 2.5
  })));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Tag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Toast — a transient confirmation card. Render one where you want it
 * (Sprout floats it bottom-center on mobile, bottom-right on desktop).
 * This is presentational; manage visibility/timeout in your app.
 */
const tones = {
  success: {
    icon: 'check-circle',
    color: 'var(--money-in)'
  },
  info: {
    icon: 'info',
    color: 'var(--info-500)'
  },
  warning: {
    icon: 'alert-triangle',
    color: 'var(--warning-500)'
  },
  danger: {
    icon: 'alert-triangle',
    color: 'var(--danger-500)'
  }
};
function Toast({
  title,
  description,
  tone = 'success',
  action,
  onAction,
  onClose,
  className = '',
  style = {},
  ...rest
}) {
  const t = tones[tone] || tones.success;
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "status",
    className: `sprout-toast ${className}`,
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 'var(--space-3)',
      minWidth: 280,
      maxWidth: 400,
      padding: 'var(--space-3) var(--space-4)',
      background: 'var(--surface-inverse)',
      color: 'var(--text-on-inverse)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-lg)',
      animation: 'sprout-toast-in var(--dur-base) var(--ease-out)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: t.icon,
    size: 20,
    style: {
      color: t.color,
      marginTop: 1,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--font-body)',
      fontWeight: 'var(--fw-semibold)'
    }
  }, title), description && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--font-caption)',
      color: 'rgba(255,255,255,0.72)',
      marginTop: 1
    }
  }, description)), action && /*#__PURE__*/React.createElement("button", {
    onClick: onAction,
    style: {
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      font: 'var(--font-label)',
      color: 'var(--sage-300)',
      padding: '2px 4px',
      flexShrink: 0
    }
  }, action), onClose && /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Dismiss",
    style: {
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      color: 'rgba(255,255,255,0.6)',
      padding: 0,
      flexShrink: 0,
      display: 'inline-flex'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 16
  })), /*#__PURE__*/React.createElement("style", null, `@keyframes sprout-toast-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }`));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const base = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 'var(--space-2)',
  fontFamily: 'var(--font-sans)',
  fontWeight: 'var(--fw-semibold)',
  border: '1px solid transparent',
  borderRadius: 'var(--radius-md)',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'var(--transition-colors), transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-standard)',
  textDecoration: 'none',
  userSelect: 'none'
};
const sizes = {
  sm: {
    fontSize: 'var(--text-sm)',
    padding: '0 var(--space-3)',
    height: 34
  },
  md: {
    fontSize: 'var(--text-md)',
    padding: '0 var(--space-4)',
    height: 42
  },
  lg: {
    fontSize: 'var(--text-lg)',
    padding: '0 var(--space-5)',
    height: 50
  }
};
const variants = {
  primary: {
    background: 'var(--accent)',
    color: 'var(--text-on-accent)',
    boxShadow: 'var(--shadow-xs)'
  },
  secondary: {
    background: 'var(--surface-card)',
    color: 'var(--text-body)',
    borderColor: 'var(--border-strong)',
    boxShadow: 'var(--shadow-xs)'
  },
  soft: {
    background: 'var(--accent-soft)',
    color: 'var(--accent-soft-fg)'
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-body)'
  },
  danger: {
    background: 'var(--danger-500)',
    color: '#fff',
    boxShadow: 'var(--shadow-xs)'
  }
};

/**
 * Button — Sprout's primary action control.
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  iconStart,
  iconEnd,
  fullWidth = false,
  disabled = false,
  loading = false,
  as = 'button',
  className = '',
  style = {},
  ...rest
}) {
  const Tag = as;
  const isDisabled = disabled || loading;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: `sprout-btn sprout-btn--${variant} ${className}`,
    "data-variant": variant,
    "aria-busy": loading || undefined,
    disabled: Tag === 'button' ? isDisabled : undefined,
    style: {
      ...base,
      ...sizes[size],
      ...variants[variant],
      width: fullWidth ? '100%' : undefined,
      opacity: isDisabled ? 0.5 : 1,
      pointerEvents: isDisabled ? 'none' : undefined,
      ...style
    }
  }, rest), loading && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "repeat",
    size: size === 'sm' ? 15 : 17,
    style: {
      animation: 'sprout-spin 0.9s linear infinite'
    }
  }), !loading && iconStart && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconStart,
    size: size === 'sm' ? 15 : 18
  }), children != null && /*#__PURE__*/React.createElement("span", null, children), !loading && iconEnd && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconEnd,
    size: size === 'sm' ? 15 : 18
  }), /*#__PURE__*/React.createElement("style", null, `
        .sprout-btn:hover:not([aria-busy="true"]) { filter: none; }
        .sprout-btn--primary:hover { background: var(--accent-hover) !important; }
        .sprout-btn--primary:active { background: var(--accent-active) !important; transform: scale(0.98); }
        .sprout-btn--secondary:hover { background: var(--surface-hover) !important; }
        .sprout-btn--secondary:active { transform: scale(0.98); }
        .sprout-btn--soft:hover { background: var(--sage-200) !important; }
        .sprout-btn--soft:active { transform: scale(0.98); }
        .sprout-btn--ghost:hover { background: var(--surface-hover) !important; }
        .sprout-btn--danger:hover { background: var(--danger-600) !important; }
        .sprout-btn--danger:active { transform: scale(0.98); }
        .sprout-btn:focus-visible { outline: none; box-shadow: var(--shadow-focus); }
        @keyframes sprout-spin { to { transform: rotate(360deg); } }
      `));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Checkbox — square check control with optional label & description. */
function Checkbox({
  label,
  description,
  checked,
  defaultChecked,
  disabled,
  id,
  className = '',
  style = {},
  ...rest
}) {
  const autoId = React.useId ? React.useId() : undefined;
  const cbId = id || autoId;
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: cbId,
    className: `sprout-check ${className}`,
    style: {
      display: 'flex',
      alignItems: description ? 'flex-start' : 'center',
      gap: 'var(--space-3)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex',
      flexShrink: 0,
      marginTop: description ? 2 : 0
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    id: cbId,
    checked: checked,
    defaultChecked: defaultChecked,
    disabled: disabled,
    className: "sprout-check-input",
    style: {
      position: 'absolute',
      opacity: 0,
      width: 20,
      height: 20,
      margin: 0,
      cursor: 'inherit'
    }
  }, rest)), /*#__PURE__*/React.createElement("span", {
    className: "sprout-check-box",
    style: {
      width: 20,
      height: 20,
      borderRadius: 'var(--radius-xs)',
      border: '2px solid var(--border-strong)',
      background: 'var(--surface-card)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      transition: 'var(--transition-colors)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 14,
    strokeWidth: 3,
    style: {
      opacity: 0,
      transition: 'opacity var(--dur-fast)'
    },
    className: "sprout-check-tick"
  }))), (label || description) && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--font-body)',
      fontWeight: 'var(--fw-medium)',
      color: 'var(--text-strong)'
    }
  }, label), description && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--font-caption)',
      color: 'var(--text-muted)'
    }
  }, description)), /*#__PURE__*/React.createElement("style", null, `
        .sprout-check-input:checked + .sprout-check-box { background: var(--accent); border-color: var(--accent); }
        .sprout-check-input:checked + .sprout-check-box .sprout-check-tick { opacity: 1; }
        .sprout-check-input:focus-visible + .sprout-check-box { box-shadow: var(--shadow-focus); }
        .sprout-check:hover .sprout-check-input:not(:checked):not(:disabled) + .sprout-check-box { border-color: var(--accent); }
      `));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const sizes = {
  sm: 34,
  md: 42,
  lg: 50
};
const iconSizes = {
  sm: 17,
  md: 20,
  lg: 22
};
const variants = {
  primary: {
    background: 'var(--accent)',
    color: 'var(--text-on-accent)',
    boxShadow: 'var(--shadow-xs)'
  },
  secondary: {
    background: 'var(--surface-card)',
    color: 'var(--text-body)',
    border: '1px solid var(--border-strong)',
    boxShadow: 'var(--shadow-xs)'
  },
  soft: {
    background: 'var(--accent-soft)',
    color: 'var(--accent-soft-fg)'
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-muted)'
  }
};

/**
 * IconButton — a square, icon-only button. Always pass `label` for a11y.
 */
function IconButton({
  icon,
  label,
  variant = 'ghost',
  size = 'md',
  round = false,
  disabled = false,
  className = '',
  style = {},
  ...rest
}) {
  const dim = sizes[size];
  return /*#__PURE__*/React.createElement("button", _extends({
    className: `sprout-iconbtn sprout-iconbtn--${variant} ${className}`,
    "aria-label": label,
    title: label,
    disabled: disabled,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: dim,
      height: dim,
      borderRadius: round ? 'var(--radius-pill)' : 'var(--radius-md)',
      border: '1px solid transparent',
      cursor: 'pointer',
      transition: 'var(--transition-colors), transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-standard)',
      opacity: disabled ? 0.5 : 1,
      pointerEvents: disabled ? 'none' : undefined,
      ...variants[variant],
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: iconSizes[size]
  }), /*#__PURE__*/React.createElement("style", null, `
        .sprout-iconbtn--primary:hover { background: var(--accent-hover) !important; }
        .sprout-iconbtn--secondary:hover { background: var(--surface-hover) !important; }
        .sprout-iconbtn--soft:hover { background: var(--sage-200) !important; }
        .sprout-iconbtn--ghost:hover { background: var(--surface-hover) !important; color: var(--text-body) !important; }
        .sprout-iconbtn:active { transform: scale(0.92); }
        .sprout-iconbtn:focus-visible { outline: none; box-shadow: var(--shadow-focus); }
      `));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Dialog — centered modal on desktop, bottom-sheet feel on mobile.
 * Controlled via `open` + `onClose`. Renders a scrim + card.
 */
function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  className = '',
  style = {},
  ...rest
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = e => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  const maxW = size === 'sm' ? 380 : size === 'lg' ? 640 : 500;
  return /*#__PURE__*/React.createElement("div", {
    className: "sprout-dialog-scrim",
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-4)',
      background: 'rgb(31 37 25 / 0.42)',
      backdropFilter: 'blur(3px)',
      WebkitBackdropFilter: 'blur(3px)',
      animation: 'sprout-fade var(--dur-fast) var(--ease-standard)'
    }
  }, /*#__PURE__*/React.createElement("div", _extends({
    role: "dialog",
    "aria-modal": "true",
    "aria-label": title,
    onClick: e => e.stopPropagation(),
    className: `sprout-dialog ${className}`,
    style: {
      width: '100%',
      maxWidth: maxW,
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-2xl)',
      boxShadow: 'var(--shadow-xl)',
      padding: 'var(--space-6)',
      animation: 'sprout-rise var(--dur-base) var(--ease-out)',
      ...style
    }
  }, rest), (title || onClose) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 'var(--space-4)',
      marginBottom: description ? 'var(--space-2)' : 'var(--space-4)'
    }
  }, title && /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--font-h3)',
      color: 'var(--text-strong)',
      margin: 0
    }
  }, title), onClose && /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "x",
    label: "Close",
    variant: "ghost",
    size: "sm",
    onClick: onClose,
    style: {
      margin: '-4px -6px 0 0'
    }
  })), description && /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--font-body)',
      color: 'var(--text-muted)',
      margin: '0 0 var(--space-5)'
    }
  }, description), children, footer && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 'var(--space-3)',
      marginTop: 'var(--space-6)'
    }
  }, footer)), /*#__PURE__*/React.createElement("style", null, `
        @keyframes sprout-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes sprout-rise { from { opacity: 0; transform: translateY(12px) scale(0.98); } to { opacity: 1; transform: none; } }
      `));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Input — labelled text field with optional icon, prefix/suffix, hint & error.
 * Great for money entry: pass prefix="RM".
 */
function Input({
  label,
  hint,
  error,
  iconStart,
  prefix,
  suffix,
  size = 'md',
  id,
  className = '',
  style = {},
  containerStyle = {},
  ...rest
}) {
  const autoId = React.useId ? React.useId() : undefined;
  const inputId = id || autoId;
  const height = size === 'lg' ? 50 : size === 'sm' ? 36 : 44;
  const fontSize = size === 'lg' ? 'var(--text-lg)' : 'var(--text-md)';
  const invalid = Boolean(error);
  return /*#__PURE__*/React.createElement("div", {
    className: `sprout-field ${className}`,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)',
      ...containerStyle
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      font: 'var(--font-label)',
      color: 'var(--text-body)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "sprout-input-wrap",
    "data-invalid": invalid || undefined,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      height,
      padding: '0 var(--space-3)',
      background: 'var(--surface-card)',
      border: `1px solid ${invalid ? 'var(--danger-500)' : 'var(--border-strong)'}`,
      borderRadius: 'var(--radius-md)',
      transition: 'var(--transition-colors), box-shadow var(--dur-fast) var(--ease-standard)'
    }
  }, iconStart && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconStart,
    size: 18,
    style: {
      color: 'var(--text-muted)'
    }
  }), prefix && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--font-body)',
      fontWeight: 'var(--fw-semibold)',
      color: 'var(--text-muted)'
    }
  }, prefix), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    "aria-invalid": invalid || undefined,
    style: {
      flex: 1,
      minWidth: 0,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      font: 'var(--font-body)',
      fontSize,
      color: 'var(--text-strong)',
      padding: 0,
      ...style
    }
  }, rest)), suffix && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--font-caption)',
      color: 'var(--text-muted)'
    }
  }, suffix)), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--font-caption)',
      color: invalid ? 'var(--danger-500)' : 'var(--text-muted)'
    }
  }, error || hint), /*#__PURE__*/React.createElement("style", null, `
        .sprout-input-wrap:focus-within { border-color: var(--ring-focus) !important; box-shadow: var(--shadow-focus); }
        .sprout-input-wrap[data-invalid]:focus-within { box-shadow: 0 0 0 3px rgb(199 80 63 / 0.22); }
        .sprout-field input::placeholder { color: var(--text-subtle); }
      `));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Select — native select styled to match Sprout inputs, with a chevron.
 * Pass `options` as [{value,label}] or use children <option>.
 */
function Select({
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
}) {
  const autoId = React.useId ? React.useId() : undefined;
  const selectId = id || autoId;
  const height = size === 'lg' ? 50 : size === 'sm' ? 36 : 44;
  const invalid = Boolean(error);
  return /*#__PURE__*/React.createElement("div", {
    className: `sprout-field ${className}`,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)',
      ...containerStyle
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: selectId,
    style: {
      font: 'var(--font-label)',
      color: 'var(--text-body)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "sprout-select-wrap",
    "data-invalid": invalid || undefined,
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      height,
      background: 'var(--surface-card)',
      border: `1px solid ${invalid ? 'var(--danger-500)' : 'var(--border-strong)'}`,
      borderRadius: 'var(--radius-md)',
      transition: 'var(--transition-colors), box-shadow var(--dur-fast) var(--ease-standard)'
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: selectId,
    "aria-invalid": invalid || undefined,
    style: {
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
      ...style
    }
  }, rest), placeholder && /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true
  }, placeholder), options ? options.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label)) : children), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 18,
    style: {
      position: 'absolute',
      right: 'var(--space-3)',
      color: 'var(--text-muted)',
      pointerEvents: 'none'
    }
  })), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--font-caption)',
      color: invalid ? 'var(--danger-500)' : 'var(--text-muted)'
    }
  }, error || hint), /*#__PURE__*/React.createElement("style", null, `.sprout-select-wrap:focus-within { border-color: var(--ring-focus) !important; box-shadow: var(--shadow-focus); }`));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Tabs — underline-style tab bar. Controlled (`value`+`onChange`) or
 * uncontrolled (`defaultValue`). Renders the active tab's `content` if given.
 */
function Tabs({
  items,
  value,
  defaultValue,
  onChange,
  className = '',
  style = {},
  ...rest
}) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue ?? items[0]?.value);
  const current = isControlled ? value : internal;
  const select = v => {
    if (!isControlled) setInternal(v);
    onChange?.(v);
  };
  const active = items.find(i => i.value === current);
  return /*#__PURE__*/React.createElement("div", _extends({
    className: `sprout-tabs ${className}`,
    style: style
  }, rest), /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: 'flex',
      gap: 'var(--space-5)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, items.map(it => {
    const on = it.value === current;
    return /*#__PURE__*/React.createElement("button", {
      key: it.value,
      role: "tab",
      "aria-selected": on,
      onClick: () => select(it.value),
      style: {
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
        transition: 'var(--transition-colors)'
      }
    }, it.label, it.count != null && /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--font-caption)',
        fontWeight: 'var(--fw-semibold)',
        background: on ? 'var(--accent-soft)' : 'var(--neutral-150)',
        color: on ? 'var(--accent-soft-fg)' : 'var(--text-muted)',
        borderRadius: 'var(--radius-pill)',
        padding: '1px 8px'
      }
    }, it.count), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: -1,
        height: 2,
        borderRadius: '2px 2px 0 0',
        background: on ? 'var(--accent)' : 'transparent',
        transition: 'background-color var(--dur-fast) var(--ease-standard)'
      }
    }));
  })), active?.content != null && /*#__PURE__*/React.createElement("div", {
    role: "tabpanel",
    style: {
      paddingTop: 'var(--space-4)'
    }
  }, active.content));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/desktop/Dashboard.jsx
try { (() => {
// Desktop — Sprout on a wide screen: sidebar of spaces + roll-up / space views.
(function () {
  const K = window.KiraDesignSystem_c378eb;
  const {
    Icon,
    Avatar,
    Button,
    IconButton,
    StatCard,
    Card,
    ListRow,
    Amount,
    Badge,
    CategoryIcon,
    SegmentedControl,
    Tag,
    Dialog,
    Input,
    Select
  } = K;
  const D = window.SproutData;
  const SAGE = {
    color: 'var(--sage-700)'
  };

  // Add / edit a recurring commitment (mock — updates in-session).
  function RecurringDialog({
    open,
    onClose,
    onAdd,
    cats
  }) {
    const [label, setLabel] = React.useState('');
    const [amount, setAmount] = React.useState('');
    const [cat, setCat] = React.useState(cats[0]?.key || 'money');
    React.useEffect(() => {
      if (open) {
        setLabel('');
        setAmount('');
        setCat(cats[0]?.key || 'money');
      }
    }, [open]);
    const add = () => {
      onAdd({
        label,
        amount: parseFloat(amount) || 0,
        cat
      });
      onClose();
    };
    return /*#__PURE__*/React.createElement(Dialog, {
      open: open,
      onClose: onClose,
      title: "Add commitment",
      description: "A fixed amount that repeats every month.",
      footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        variant: "ghost",
        onClick: onClose
      }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
        iconStart: "check",
        onClick: add,
        disabled: !label || !amount
      }, "Add"))
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)'
      }
    }, /*#__PURE__*/React.createElement(Input, {
      label: "Name",
      placeholder: "e.g. Streaming, Insurance\u2026",
      value: label,
      onChange: e => setLabel(e.target.value),
      autoFocus: true
    }), /*#__PURE__*/React.createElement(Input, {
      label: "Amount / month",
      prefix: "RM",
      placeholder: "0.00",
      inputMode: "decimal",
      value: amount,
      onChange: e => setAmount(e.target.value)
    }), cats.length > 0 && /*#__PURE__*/React.createElement(Select, {
      label: "Category",
      value: cat,
      onChange: e => setCat(e.target.value),
      options: cats.map(c => ({
        value: c.key,
        label: c.label
      }))
    })));
  }
  const slug = s => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  function BudgetDialog({
    open,
    onClose,
    value,
    onSave,
    spaceName
  }) {
    const [v, setV] = React.useState(value || '');
    React.useEffect(() => {
      if (open) setV(value || '');
    }, [open]);
    return /*#__PURE__*/React.createElement(Dialog, {
      open: open,
      onClose: onClose,
      title: "Monthly budget",
      description: `Set the spending target for ${spaceName}.`,
      footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        variant: "ghost",
        onClick: onClose
      }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
        iconStart: "check",
        onClick: () => {
          onSave(parseFloat(v) || 0);
          onClose();
        },
        disabled: !v
      }, "Save budget"))
    }, /*#__PURE__*/React.createElement(Input, {
      label: "Budget / month",
      prefix: "RM",
      placeholder: "0.00",
      inputMode: "decimal",
      value: v,
      onChange: e => setV(e.target.value),
      autoFocus: true
    }));
  }
  function CategoryDialog({
    open,
    onClose,
    onAdd
  }) {
    const [label, setLabel] = React.useState('');
    React.useEffect(() => {
      if (open) setLabel('');
    }, [open]);
    return /*#__PURE__*/React.createElement(Dialog, {
      open: open,
      onClose: onClose,
      title: "Add category",
      description: "Group transactions within this space.",
      footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        variant: "ghost",
        onClick: onClose
      }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
        iconStart: "check",
        onClick: () => {
          onAdd(label);
          onClose();
        },
        disabled: !label
      }, "Add"))
    }, /*#__PURE__*/React.createElement(Input, {
      label: "Category name",
      placeholder: "e.g. Subscriptions",
      value: label,
      onChange: e => setLabel(e.target.value),
      autoFocus: true
    }));
  }
  function Sidebar({
    active,
    setActive,
    onNewSpace
  }) {
    const item = (id, icon, label, sub) => /*#__PURE__*/React.createElement("button", {
      key: id,
      onClick: () => setActive(id),
      "data-active": active === id,
      className: "nav-item"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: 18
    }), " ", /*#__PURE__*/React.createElement("span", null, label), sub && /*#__PURE__*/React.createElement("em", {
      style: {
        marginLeft: 'auto',
        fontStyle: 'normal',
        font: 'var(--font-caption)',
        color: 'var(--text-subtle)'
      }
    }, sub));
    const shared = D.spaces.filter(s => s.group === 'shared');
    return /*#__PURE__*/React.createElement("aside", {
      className: "sidebar"
    }, /*#__PURE__*/React.createElement("div", {
      className: "brand"
    }, /*#__PURE__*/React.createElement("img", {
      src: "../../assets/sprout-mark.svg",
      width: "30",
      height: "30",
      alt: ""
    }), /*#__PURE__*/React.createElement("span", null, "Sprout")), /*#__PURE__*/React.createElement("nav", {
      className: "nav"
    }, item('home', 'pie-chart', 'Overview'), item('reports', 'bar-chart', 'Reports')), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "navlabel"
    }, "Shared"), /*#__PURE__*/React.createElement("nav", {
      className: "nav"
    }, shared.map(s => item(s.id, s.icon, s.name, s.sub)), /*#__PURE__*/React.createElement("button", {
      className: "nav-item",
      onClick: onNewSpace,
      style: {
        color: 'var(--text-accent)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 18
    }), " ", /*#__PURE__*/React.createElement("span", null, "New space")))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "navlabel"
    }, "Personal"), /*#__PURE__*/React.createElement("nav", {
      className: "nav"
    }, item('jc', 'user', 'JC'), item('ch', 'user', 'CH'))), /*#__PURE__*/React.createElement("div", {
      className: "account"
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: "JC",
      size: 34
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--font-label)',
        color: 'var(--text-strong)'
      }
    }, "JC & CH"), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--font-caption)',
        color: 'var(--text-muted)'
      }
    }, "Household")), /*#__PURE__*/React.createElement(Icon, {
      name: "settings",
      size: 16,
      style: {
        color: 'var(--text-subtle)'
      }
    })));
  }
  function Topbar({
    title,
    sub,
    onAdd,
    extra
  }) {
    return /*#__PURE__*/React.createElement("header", {
      className: "topbar"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--font-caption)',
        color: 'var(--text-muted)'
      }
    }, sub), /*#__PURE__*/React.createElement("h1", {
      style: {
        font: 'var(--font-h1)',
        color: 'var(--text-strong)',
        margin: '2px 0 0'
      }
    }, title)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)'
      }
    }, extra, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex'
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: "JC",
      size: 34,
      style: {
        boxShadow: '0 0 0 2px var(--surface-canvas)'
      }
    }), /*#__PURE__*/React.createElement(Avatar, {
      name: "CH",
      size: 34,
      style: {
        marginLeft: -8,
        boxShadow: '0 0 0 2px var(--surface-canvas)'
      }
    }), /*#__PURE__*/React.createElement(Avatar, {
      name: "Leo",
      size: 34,
      style: {
        marginLeft: -8,
        boxShadow: '0 0 0 2px var(--surface-canvas)'
      }
    })), /*#__PURE__*/React.createElement(IconButton, {
      icon: "search",
      label: "Search",
      variant: "secondary"
    }), /*#__PURE__*/React.createElement(IconButton, {
      icon: "bell",
      label: "Alerts",
      variant: "secondary"
    }), /*#__PURE__*/React.createElement(Button, {
      iconStart: "plus",
      onClick: onAdd
    }, "Add entry")));
  }
  function Home({
    onAdd,
    goSpace
  }) {
    const spendSpaces = D.spaces.filter(s => s.kind === 'spend');
    const joint = D.space('joint');
    const invest = D.space('investment');
    const left = D.budget - D.totalSpent;
    const recent = D.space('expenses').tx.slice(0, 6);
    const bills = D.space('housing').tx.concat(D.space('car').tx).filter(t => t.status);
    return /*#__PURE__*/React.createElement("div", {
      className: "main"
    }, /*#__PURE__*/React.createElement(Topbar, {
      title: "Overview",
      sub: `Household · ${D.monthLabel}`,
      onAdd: onAdd
    }), /*#__PURE__*/React.createElement("div", {
      className: "scroll"
    }, /*#__PURE__*/React.createElement("div", {
      className: "row-3"
    }, /*#__PURE__*/React.createElement(Card, {
      padding: "lg",
      style: {
        background: 'var(--accent)',
        border: 'none',
        gridColumn: 'span 2',
        display: 'flex',
        flexDirection: 'column'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--font-label)',
        color: 'rgba(255,255,255,0.85)'
      }
    }, "Total spent \xB7 Everyday + Housing + Car"), /*#__PURE__*/React.createElement(Amount, {
      value: D.totalSpent,
      size: "hero",
      style: {
        color: '#fff',
        display: 'block',
        margin: '10px 0 4px',
        fontSize: '54px'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        marginBottom: 20
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--font-label)',
        color: '#fff'
      }
    }, "RM ", Math.round(left).toLocaleString(), " left"), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--font-caption)',
        color: 'rgba(255,255,255,0.82)'
      }
    }, "of RM ", D.budget.toLocaleString(), " budget")), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 'auto',
        display: 'flex',
        gap: 3,
        height: 10,
        borderRadius: 'var(--radius-pill)',
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.22)'
      }
    }, spendSpaces.map((s, i) => /*#__PURE__*/React.createElement("span", {
      key: s.id,
      style: {
        width: `${D.spentOf(s) / D.totalSpent * 100}%`,
        background: `rgba(255,255,255,${[0.95, 0.66, 0.4][i]})`
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 12
      }
    }, spendSpaces.map(s => /*#__PURE__*/React.createElement("span", {
      key: s.id,
      style: {
        font: 'var(--font-caption)',
        color: 'rgba(255,255,255,0.9)',
        fontWeight: 'var(--fw-medium)'
      }
    }, s.name, " \xB7 RM ", D.spentOf(s).toLocaleString())))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)'
      }
    }, /*#__PURE__*/React.createElement(StatCard, {
      label: "Joint Fund",
      value: joint.balance,
      icon: "wallet",
      footer: "Shared balance",
      amountProps: {
        style: SAGE
      }
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Investment \xB7 AIA",
      value: invest.value,
      icon: "trending-up",
      footer: "Portfolio value",
      amountProps: {
        style: SAGE
      }
    }))), /*#__PURE__*/React.createElement("div", {
      className: "row-2"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHead, {
      title: "Recent \xB7 Everyday Expenses",
      action: "Open",
      onAction: () => goSpace('expenses')
    }), /*#__PURE__*/React.createElement(Card, {
      padding: "sm"
    }, recent.map((e, i) => /*#__PURE__*/React.createElement(ListRow, {
      key: e.id,
      leading: /*#__PURE__*/React.createElement(CategoryIcon, {
        category: e.cat
      }),
      title: e.vendor,
      subtitle: `${e.note} · ${e.payer}`,
      trailing: /*#__PURE__*/React.createElement(Amount, {
        value: e.amount
      }),
      meta: e.date,
      divider: i < recent.length - 1
    })))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHead, {
      title: "Bills & installments",
      action: "Housing",
      onAction: () => goSpace('housing')
    }), /*#__PURE__*/React.createElement(Card, {
      padding: "sm"
    }, bills.map((c, i) => /*#__PURE__*/React.createElement(ListRow, {
      key: c.id + c.vendor,
      leading: /*#__PURE__*/React.createElement(CategoryIcon, {
        category: c.cat
      }),
      title: c.vendor,
      subtitle: `Paid by ${c.payer}`,
      trailing: /*#__PURE__*/React.createElement(Amount, {
        value: c.amount
      }),
      meta: /*#__PURE__*/React.createElement(Badge, {
        tone: c.status === 'paid' ? 'income' : c.status === 'due' ? 'warning' : 'neutral',
        dot: true
      }, c.status === 'due' ? 'Due ' + c.date : c.status === 'paid' ? 'Paid' : c.date),
      divider: i < bills.length - 1
    })))))));
  }
  function SpaceView({
    spaceId,
    onAdd,
    onSettings
  }) {
    const isPersonal = spaceId === 'jc' || spaceId === 'ch';
    const [cat, setCat] = React.useState('all');
    const space = isPersonal ? D.personal[spaceId] : D.space(spaceId);
    const person = isPersonal ? D.personal[spaceId] : null;
    const [cats, setCats] = React.useState(space.cats);
    const secondary = D.secondaryFields(space);
    const subtitleFor = t => [...secondary.map(f => t[f.key]).filter(Boolean), t.note, t.payer].filter(Boolean).join(' · ');
    let tx = isPersonal ? person.tx.filter(t => t.dir === 'out') : space.tx;
    if (cat !== 'all') tx = tx.filter(t => t.cat === cat);
    const title = isPersonal ? `${person.name} · Personal` : space.name;
    const headVal = isPersonal ? {
      label: 'Spent this month',
      v: person.tx.filter(t => t.dir === 'out').reduce((a, t) => a + t.amount, 0)
    } : space.kind === 'fund' ? {
      label: 'Shared balance',
      v: space.balance
    } : space.kind === 'invest' ? {
      label: 'Portfolio value',
      v: space.value
    } : {
      label: 'Spent this month',
      v: D.spentOf(space)
    };
    const [tab, setTab] = React.useState('activity');
    const [rec, setRec] = React.useState(space.recurring || []);
    const [editRec, setEditRec] = React.useState(false);
    const [recDlg, setRecDlg] = React.useState(false);
    const [budget, setBudget] = React.useState(space.budget);
    const [budgetDlg, setBudgetDlg] = React.useState(false);
    const [editCat, setEditCat] = React.useState(false);
    const [catDlg, setCatDlg] = React.useState(false);
    React.useEffect(() => {
      setTab('activity');
      setRec(space.recurring || []);
      setEditRec(false);
      setBudget(space.budget);
      setCats(space.cats);
      setEditCat(false);
    }, [spaceId]);
    const hasRecurring = !!(space.recurring && space.recurring.length > 0);
    const isFund = space.kind === 'fund';
    const removeCat = key => {
      setCats(cs => cs.filter(c => c.key !== key));
      if (cat === key) setCat('all');
    };
    const addCat = label => setCats(cs => [...cs, {
      key: slug(label) || 'cat-' + cs.length,
      label
    }]);
    const activityBlock = /*#__PURE__*/React.createElement(React.Fragment, null, cats.length > 0 || editCat ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: '0 4px 8px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--font-caption)',
        fontWeight: 'var(--fw-bold)',
        textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-wide)',
        color: 'var(--text-subtle)'
      }
    }, "Categories"), /*#__PURE__*/React.createElement("button", {
      onClick: () => setEditCat(e => !e),
      style: {
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        font: 'var(--font-label)',
        color: 'var(--accent)',
        padding: 4
      }
    }, editCat ? 'Done' : 'Edit')), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap'
      }
    }, !editCat && /*#__PURE__*/React.createElement(Tag, {
      selected: cat === 'all',
      onClick: () => setCat('all')
    }, "All"), cats.map(c => /*#__PURE__*/React.createElement(Tag, {
      key: c.key,
      selected: !editCat && cat === c.key,
      onClick: () => editCat ? removeCat(c.key) : setCat(c.key)
    }, /*#__PURE__*/React.createElement(CategoryIcon, {
      category: c.key,
      size: 18,
      radius: "var(--radius-xs)",
      style: {
        marginRight: 4
      }
    }), c.label, editCat && /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 6,
        color: 'var(--text-muted)',
        fontWeight: 'var(--fw-bold)'
      }
    }, "\xD7"))), editCat && /*#__PURE__*/React.createElement(Tag, {
      onClick: () => setCatDlg(true)
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--accent)',
        fontWeight: 'var(--fw-semibold)'
      }
    }, "+ Add")))) : null, /*#__PURE__*/React.createElement(Card, {
      padding: "sm"
    }, tx.map((t, i) => /*#__PURE__*/React.createElement(ListRow, {
      key: t.id + t.vendor,
      leading: /*#__PURE__*/React.createElement(CategoryIcon, {
        category: t.cat
      }),
      title: t.vendor,
      subtitle: subtitleFor(t),
      trailing: /*#__PURE__*/React.createElement(Amount, {
        value: t.amount,
        kind: t.dir === 'in' ? 'in' : 'neutral',
        showSign: t.dir === 'in'
      }),
      meta: t.status ? /*#__PURE__*/React.createElement(Badge, {
        tone: t.status === 'paid' ? 'income' : t.status === 'due' ? 'warning' : 'neutral',
        dot: true
      }, t.status === 'due' ? 'Due ' + t.date : t.status === 'paid' ? 'Paid' : t.date) : t.date,
      divider: i < tx.length - 1
    }))));
    const recSum = rec.reduce((a, r) => a + r.amount, 0);
    const recurringBlock = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: '0 4px 12px'
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        font: 'var(--font-h3)',
        color: 'var(--text-strong)',
        margin: 0
      }
    }, isFund ? 'How the fund is formed' : 'Monthly commitments'), /*#__PURE__*/React.createElement("button", {
      onClick: () => setEditRec(e => !e),
      style: {
        border: 'none',
        background: 'none',
        font: 'var(--font-label)',
        color: 'var(--accent)',
        cursor: 'pointer'
      }
    }, editRec ? 'Done' : 'Edit')), /*#__PURE__*/React.createElement(Card, {
      padding: "sm"
    }, rec.map((r, i) => /*#__PURE__*/React.createElement(ListRow, {
      key: i,
      leading: /*#__PURE__*/React.createElement(CategoryIcon, {
        category: r.cat
      }),
      title: r.label,
      trailing: editRec ? /*#__PURE__*/React.createElement(IconButton, {
        icon: "x",
        label: "Remove",
        variant: "ghost",
        size: "sm",
        onClick: () => setRec(x => x.filter((_, j) => j !== i))
      }) : /*#__PURE__*/React.createElement(Amount, {
        value: r.amount,
        kind: isFund ? 'in' : 'neutral',
        showSign: isFund
      }),
      divider: true
    })), editRec && /*#__PURE__*/React.createElement(ListRow, {
      leading: /*#__PURE__*/React.createElement("div", {
        style: {
          width: 40,
          height: 40,
          borderRadius: 'var(--radius-md)',
          border: '1.5px dashed var(--border-strong)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)'
        }
      }, "+"),
      title: /*#__PURE__*/React.createElement("span", {
        style: {
          color: 'var(--accent)',
          fontWeight: 'var(--fw-semibold)'
        }
      }, "Add commitment"),
      onClick: () => setRecDlg(true),
      divider: true
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'var(--space-3)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--font-label)',
        color: 'var(--text-muted)'
      }
    }, isFund ? 'Total contributed' : 'Total / month'), /*#__PURE__*/React.createElement(Amount, {
      value: recSum,
      kind: isFund ? 'in' : 'neutral',
      showSign: isFund,
      weight: "var(--fw-extra)"
    }))));
    return /*#__PURE__*/React.createElement("div", {
      className: "main"
    }, /*#__PURE__*/React.createElement(Topbar, {
      title: title,
      sub: space && space.sub ? space.sub : 'June 2026',
      onAdd: onAdd,
      extra: /*#__PURE__*/React.createElement(IconButton, {
        icon: "settings",
        label: "Space settings",
        variant: "secondary",
        onClick: () => onSettings(spaceId)
      })
    }), /*#__PURE__*/React.createElement("div", {
      className: "scroll"
    }, /*#__PURE__*/React.createElement("div", {
      className: "row-2"
    }, /*#__PURE__*/React.createElement(Card, {
      padding: "lg",
      style: {
        background: 'var(--accent)',
        border: 'none'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--font-label)',
        color: 'rgba(255,255,255,0.85)'
      }
    }, headVal.label), /*#__PURE__*/React.createElement(Amount, {
      value: headVal.v,
      size: "hero",
      style: {
        color: '#fff',
        display: 'block',
        marginTop: 6,
        fontSize: '48px'
      }
    }), space.kind === 'spend' && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 16
      }
    }, budget ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        height: 8,
        borderRadius: 'var(--radius-pill)',
        background: 'rgba(255,255,255,0.22)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: Math.min(100, headVal.v / budget * 100) + '%',
        height: '100%',
        background: '#fff',
        borderRadius: 'var(--radius-pill)'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginTop: 8,
        font: 'var(--font-caption)',
        color: 'rgba(255,255,255,0.9)'
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setBudgetDlg(true),
      style: {
        border: 'none',
        background: 'none',
        padding: 0,
        cursor: 'pointer',
        font: 'var(--font-caption)',
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'left'
      }
    }, Math.round(headVal.v / budget * 100), "% of RM ", budget.toLocaleString(), " ", /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 'var(--fw-semibold)',
        textDecoration: 'underline'
      }
    }, "Edit")), /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 'var(--fw-semibold)'
      }
    }, headVal.v > budget ? 'RM ' + Math.round(headVal.v - budget).toLocaleString() + ' over' : 'RM ' + Math.round(budget - headVal.v).toLocaleString() + ' left'))) : /*#__PURE__*/React.createElement("button", {
      onClick: () => setBudgetDlg(true),
      style: {
        border: '1.5px dashed rgba(255,255,255,0.6)',
        background: 'none',
        cursor: 'pointer',
        font: 'var(--font-label)',
        color: '#fff',
        padding: '8px 14px',
        borderRadius: 'var(--radius-md)'
      }
    }, "+ Set a monthly budget"))), isPersonal && /*#__PURE__*/React.createElement(StatCard, {
      label: "Income",
      value: person.income,
      icon: "banknote",
      footer: `${person.name} · ${D.monthLabel}`,
      amountProps: {
        kind: 'in'
      }
    })), hasRecurring ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SegmentedControl, {
      style: {
        maxWidth: 340
      },
      value: tab,
      onChange: setTab,
      options: [{
        value: 'activity',
        label: 'Activity'
      }, {
        value: 'recurring',
        label: isFund ? 'Contributions' : 'Recurring'
      }]
    }), tab === 'recurring' ? recurringBlock : activityBlock) : activityBlock, /*#__PURE__*/React.createElement(RecurringDialog, {
      open: recDlg,
      onClose: () => setRecDlg(false),
      onAdd: item => setRec(r => [...r, item]),
      cats: cats
    }), /*#__PURE__*/React.createElement(BudgetDialog, {
      open: budgetDlg,
      onClose: () => setBudgetDlg(false),
      value: budget,
      onSave: setBudget,
      spaceName: space.name
    }), /*#__PURE__*/React.createElement(CategoryDialog, {
      open: catDlg,
      onClose: () => setCatDlg(false),
      onAdd: addCat
    })));
  }
  function SectionHead({
    title,
    action,
    onAction
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        margin: '0 4px 12px'
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        font: 'var(--font-h3)',
        color: 'var(--text-strong)',
        margin: 0
      }
    }, title), action && /*#__PURE__*/React.createElement("button", {
      onClick: onAction,
      style: {
        border: 'none',
        background: 'none',
        font: 'var(--font-label)',
        color: 'var(--text-accent)',
        cursor: 'pointer'
      }
    }, action));
  }
  window.DesktopSidebar = Sidebar;
  window.DesktopHome = Home;
  window.DesktopSpaceView = SpaceView;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/desktop/Dashboard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/desktop/data.js
try { (() => {
// Sprout sample data — the SPACES model (user-configurable).
// Grounded in the couple's real sheet (RM, JC/CH/Leo, June 2026).
//
// Each space owns: its scoped CATEGORIES and its own generic FIELDS
// (extra info like Store/Vendor + Location). Everything here is data —
// spaces, categories and fields are meant to be added/edited by the user.
(function () {
  const CATS = {
    expenses: [{
      key: 'grocery',
      label: 'Grocery'
    }, {
      key: 'meals',
      label: 'Meals'
    }, {
      key: 'baby',
      label: 'Baby'
    }, {
      key: 'shopping',
      label: 'Shopping'
    }, {
      key: 'other',
      label: 'Other'
    }],
    housing: [{
      key: 'installment',
      label: 'Installment'
    }, {
      key: 'electric',
      label: 'Electric'
    }, {
      key: 'water',
      label: 'Water'
    }, {
      key: 'internet',
      label: 'Internet'
    }, {
      key: 'maintenance',
      label: 'Maintenance'
    }, {
      key: 'furniture',
      label: 'Furniture'
    }, {
      key: 'appliance',
      label: 'Appliance'
    }, {
      key: 'other',
      label: 'Other'
    }],
    car: [{
      key: 'installment',
      label: 'Installment'
    }, {
      key: 'roadtax',
      label: 'Road tax + Insurance'
    }, {
      key: 'maintenance',
      label: 'Maintenance'
    }],
    investment: [{
      key: 'investment',
      label: 'Investment'
    }],
    personal: [{
      key: 'income',
      label: 'Income'
    }, {
      key: 'subscriptions',
      label: 'Subscriptions'
    }, {
      key: 'insurance',
      label: 'Insurance'
    }, {
      key: 'parent',
      label: 'Parent'
    }, {
      key: 'ptptn',
      label: 'PTPTN'
    }, {
      key: 'mobile',
      label: 'Mobile Plan'
    }, {
      key: 'petrol',
      label: 'Petrol'
    }, {
      key: 'house',
      label: 'House'
    }, {
      key: 'joint',
      label: 'Joint Fund'
    }]
  };

  // Generic per-space fields. `primary` field becomes the row title.
  // A field with `options` renders as a dropdown at entry time (+ "Other…").
  const FIELDS = {
    expenses: [{
      key: 'vendor',
      label: 'Store / Vendor',
      type: 'text',
      primary: true,
      placeholder: 'Jaya Grocer'
    }, {
      key: 'location',
      label: 'Location',
      type: 'select',
      options: ['Gurney Plaza', 'Queensbay', 'Aeon · Seberang Jaya', 'Lotus · Bayan Baru', 'Shopee', 'Taobao', 'Online']
    }],
    housing: [{
      key: 'vendor',
      label: 'Bill / Item',
      type: 'text',
      primary: true,
      placeholder: 'Electric Bill'
    }, {
      key: 'provider',
      label: 'Provider',
      type: 'select',
      options: ['TNB', 'PBAPP', 'Time Fibre', 'Maybank', 'Astro']
    }],
    car: [{
      key: 'vendor',
      label: 'Item',
      type: 'text',
      primary: true,
      placeholder: 'Service'
    }, {
      key: 'workshop',
      label: 'Workshop / Station',
      type: 'select',
      options: ['Petronas', 'Shell', 'Perodua SC', 'Toyota SC']
    }],
    investment: [{
      key: 'vendor',
      label: 'Item',
      type: 'text',
      primary: true,
      placeholder: 'Contribution'
    }, {
      key: 'platform',
      label: 'Platform',
      type: 'select',
      options: ['AIA', 'Versa', 'StashAway']
    }],
    joint: [{
      key: 'vendor',
      label: 'Description',
      type: 'text',
      primary: true
    }],
    personal: [{
      key: 'vendor',
      label: 'Payee',
      type: 'text',
      primary: true
    }]
  };
  const spaces = [{
    id: 'expenses',
    name: 'Everyday Expenses',
    short: 'Expenses',
    group: 'shared',
    icon: 'receipt',
    kind: 'spend',
    cats: CATS.expenses,
    fields: FIELDS.expenses,
    budget: 1500,
    tx: [{
      id: 1,
      vendor: 'Jaya Grocer',
      location: 'Gurney Plaza',
      note: 'Grocery, meals',
      cat: 'grocery',
      amount: 218.4,
      date: '14 Jun',
      payer: 'Joint'
    }, {
      id: 2,
      vendor: 'Shopee',
      location: 'Online',
      note: 'Diapers, milk, biscuits',
      cat: 'baby',
      amount: 143.9,
      date: '12 Jun',
      payer: 'CH'
    }, {
      id: 3,
      vendor: 'Aeon',
      location: 'Seberang Jaya',
      note: 'Milk powder, snacks',
      cat: 'grocery',
      amount: 96.3,
      date: '11 Jun',
      payer: 'Joint'
    }, {
      id: 4,
      vendor: 'Bes Kopitiam',
      location: 'Gurney Plaza',
      note: 'Lunch out',
      cat: 'meals',
      amount: 88.0,
      date: '9 Jun',
      payer: 'CH'
    }, {
      id: 5,
      vendor: 'Taobao',
      location: 'Online',
      note: 'Leo shirt, toys',
      cat: 'baby',
      amount: 78.5,
      date: '8 Jun',
      payer: 'CH'
    }, {
      id: 6,
      vendor: 'Lotus',
      location: 'Bayan Baru',
      note: '2 weeks grocery',
      cat: 'grocery',
      amount: 264.2,
      date: '7 Jun',
      payer: 'Joint'
    }, {
      id: 7,
      vendor: 'Jalan Jalan Japan',
      location: 'Queensbay',
      note: 'Leo clothes',
      cat: 'shopping',
      amount: 62.0,
      date: '5 Jun',
      payer: 'CH'
    }]
  }, {
    id: 'housing',
    name: 'Housing',
    short: 'Housing',
    sub: 'TreeO',
    group: 'shared',
    icon: 'home',
    kind: 'spend',
    cats: CATS.housing,
    fields: FIELDS.housing,
    budget: 2100,
    recurring: [{
      label: 'House installment',
      cat: 'installment',
      amount: 1450.0
    }, {
      label: 'Electric (avg)',
      cat: 'electric',
      amount: 180.0
    }, {
      label: 'Water (avg)',
      cat: 'water',
      amount: 60.0
    }, {
      label: 'Internet · Time Fibre',
      cat: 'internet',
      amount: 159.0
    }],
    tx: [{
      id: 1,
      vendor: 'House installment',
      provider: 'Maybank',
      note: 'Monthly',
      cat: 'installment',
      amount: 1450.0,
      date: '1 Jun',
      payer: 'Joint',
      status: 'paid'
    }, {
      id: 2,
      vendor: 'Electric Bill · Jun',
      provider: 'TNB',
      note: '',
      cat: 'electric',
      amount: 186.0,
      date: '28 Jun',
      payer: 'JC',
      status: 'due'
    }, {
      id: 3,
      vendor: 'Water Bill · May–Jun',
      provider: 'PBAPP',
      note: '',
      cat: 'water',
      amount: 62.4,
      date: '30 Jun',
      payer: 'Joint',
      status: 'due'
    }, {
      id: 4,
      vendor: 'Internet',
      provider: 'Time Fibre',
      note: '500 Mbps',
      cat: 'internet',
      amount: 159.0,
      date: '5 Jun',
      payer: 'CH',
      status: 'paid'
    }, {
      id: 5,
      vendor: 'Air Purifier filter',
      provider: 'LG',
      note: 'Replacement',
      cat: 'appliance',
      amount: 120.0,
      date: '6 Jun',
      payer: 'Joint',
      status: 'paid'
    }]
  }, {
    id: 'car',
    name: 'Car',
    short: 'Car',
    group: 'shared',
    icon: 'repeat',
    kind: 'spend',
    cats: CATS.car,
    fields: FIELDS.car,
    budget: 800,
    recurring: [{
      label: 'Myvi installment',
      cat: 'installment',
      amount: 545.0
    }, {
      label: 'Road tax + insurance (monthly)',
      cat: 'roadtax',
      amount: 120.0
    }],
    tx: [{
      id: 1,
      vendor: 'Myvi loan · PQC 9059',
      workshop: 'Maybank',
      note: 'Monthly installment',
      cat: 'installment',
      amount: 545.0,
      date: '10 Jun',
      payer: 'JC',
      status: 'paid'
    }, {
      id: 2,
      vendor: 'Alza service',
      workshop: 'Perodua SC',
      note: 'Maintenance',
      cat: 'maintenance',
      amount: 235.0,
      date: '18 Jun',
      payer: 'JC',
      status: 'paid'
    }]
  }, {
    id: 'investment',
    name: 'Investment',
    short: 'Invest',
    sub: 'AIA',
    group: 'shared',
    icon: 'trending-up',
    kind: 'invest',
    cats: CATS.investment,
    fields: FIELDS.investment,
    value: 12480.0,
    recurring: [{
      label: 'AIA monthly contribution',
      cat: 'investment',
      amount: 300.0
    }],
    tx: [{
      id: 1,
      vendor: 'AIA contribution',
      platform: 'AIA',
      note: 'Monthly',
      cat: 'investment',
      amount: 300.0,
      date: '15 Jun',
      payer: 'Joint',
      status: 'paid'
    }]
  }, {
    id: 'joint',
    name: 'Joint Fund',
    short: 'Joint',
    group: 'shared',
    icon: 'wallet',
    kind: 'fund',
    cats: [],
    fields: FIELDS.joint,
    balance: 8420.0,
    carry: 2100.0,
    recurring: [{
      label: 'Carry forward from 2025',
      cat: 'joint',
      amount: 2100.0
    }, {
      label: 'JC monthly contribution',
      cat: 'joint',
      amount: 1500.0
    }, {
      label: 'CH monthly contribution',
      cat: 'joint',
      amount: 1500.0
    }],
    tx: [{
      id: 1,
      vendor: 'JC contribution',
      note: 'Monthly top-up',
      cat: 'joint',
      amount: 1500.0,
      date: '1 Jun',
      payer: 'JC',
      dir: 'in'
    }, {
      id: 2,
      vendor: 'CH contribution',
      note: 'Monthly top-up',
      cat: 'joint',
      amount: 1500.0,
      date: '1 Jun',
      payer: 'CH',
      dir: 'in'
    }, {
      id: 3,
      vendor: 'House installment',
      note: 'Paid from fund',
      cat: 'house',
      amount: 1450.0,
      date: '1 Jun',
      payer: 'Joint',
      dir: 'out'
    }, {
      id: 4,
      vendor: 'Groceries (Lotus)',
      note: 'Paid from fund',
      cat: 'grocery',
      amount: 264.2,
      date: '7 Jun',
      payer: 'Joint',
      dir: 'out'
    }]
  }];
  const personal = {
    jc: {
      id: 'jc',
      name: 'JC',
      group: 'personal',
      cats: CATS.personal,
      fields: FIELDS.personal,
      income: 6117.0,
      tx: [{
        id: 1,
        vendor: 'Nett Salary',
        note: 'June',
        cat: 'income',
        amount: 6117.0,
        date: '25 Jun',
        dir: 'in'
      }, {
        id: 2,
        vendor: 'Joint Fund',
        note: 'Monthly top-up',
        cat: 'joint',
        amount: 1500.0,
        date: '1 Jun',
        dir: 'out'
      }, {
        id: 3,
        vendor: 'AIA',
        note: 'Insurance',
        cat: 'insurance',
        amount: 220.0,
        date: '18 Jun',
        dir: 'out'
      }, {
        id: 4,
        vendor: 'PTPTN',
        note: 'Study loan',
        cat: 'ptptn',
        amount: 220.0,
        date: '12 Jun',
        dir: 'out'
      }, {
        id: 5,
        vendor: 'Google AI Pro',
        note: 'Subscription',
        cat: 'subscriptions',
        amount: 97.0,
        date: '20 Jun',
        dir: 'out'
      }, {
        id: 6,
        vendor: 'YouTube Premium',
        note: 'Subscription',
        cat: 'subscriptions',
        amount: 17.9,
        date: '12 Jun',
        dir: 'out'
      }, {
        id: 7,
        vendor: 'Petronas',
        note: 'Petrol',
        cat: 'petrol',
        amount: 235.0,
        date: '10 Jun',
        dir: 'out'
      }, {
        id: 8,
        vendor: 'Hotlink',
        note: 'Mobile plan',
        cat: 'mobile',
        amount: 30.0,
        date: '8 Jun',
        dir: 'out'
      }, {
        id: 9,
        vendor: 'Parents',
        note: 'Monthly',
        cat: 'parent',
        amount: 500.0,
        date: '5 Jun',
        dir: 'out'
      }]
    },
    ch: {
      id: 'ch',
      name: 'CH',
      group: 'personal',
      cats: CATS.personal,
      fields: FIELDS.personal,
      income: 6600.0,
      tx: [{
        id: 1,
        vendor: 'Nett Salary',
        note: 'June',
        cat: 'income',
        amount: 6600.0,
        date: '25 Jun',
        dir: 'in'
      }, {
        id: 2,
        vendor: 'Joint Fund',
        note: 'Monthly top-up',
        cat: 'joint',
        amount: 1500.0,
        date: '1 Jun',
        dir: 'out'
      }, {
        id: 3,
        vendor: 'Allianz',
        note: 'Insurance',
        cat: 'insurance',
        amount: 180.0,
        date: '18 Jun',
        dir: 'out'
      }, {
        id: 4,
        vendor: 'Apple One',
        note: 'Subscription',
        cat: 'subscriptions',
        amount: 34.9,
        date: '14 Jun',
        dir: 'out'
      }, {
        id: 5,
        vendor: 'Sinaran Rental',
        note: 'House',
        cat: 'house',
        amount: 450.0,
        date: '3 Jun',
        dir: 'out'
      }, {
        id: 6,
        vendor: 'Hotlink',
        note: 'Mobile plan',
        cat: 'mobile',
        amount: 30.0,
        date: '8 Jun',
        dir: 'out'
      }, {
        id: 7,
        vendor: 'Parents',
        note: 'Monthly',
        cat: 'parent',
        amount: 300.0,
        date: '5 Jun',
        dir: 'out'
      }]
    }
  };

  // 6-month spend history (Everyday + Housing + Car) for Reports.
  const history = [{
    m: 'Jan',
    v: 4310
  }, {
    m: 'Feb',
    v: 3980
  }, {
    m: 'Mar',
    v: 4620
  }, {
    m: 'Apr',
    v: 4180
  }, {
    m: 'May',
    v: 4980
  }, {
    m: 'Jun',
    v: 3708.7
  }];

  // Icon choices offered when creating a new space.
  const spaceIcons = ['receipt', 'home', 'repeat', 'trending-up', 'wallet', 'target', 'pie-chart', 'banknote', 'credit-card', 'tag'];
  const spentOf = sp => sp.tx.filter(t => t.dir !== 'in').reduce((s, t) => s + (t.dir === 'out' && sp.kind === 'fund' ? 0 : t.amount), 0);
  const domainSpend = ['expenses', 'housing', 'car'].reduce((s, id) => s + spentOf(spaces.find(x => x.id === id)), 0);
  const totalBudget = ['expenses', 'housing', 'car'].reduce((s, id) => s + (spaces.find(x => x.id === id).budget || 0), 0);

  // Reports helpers ----------------------------------------------------------
  function spendByPerson() {
    const out = {
      JC: 0,
      CH: 0,
      Joint: 0
    };
    ['expenses', 'housing', 'car'].forEach(id => {
      spaces.find(s => s.id === id).tx.forEach(t => {
        if (out[t.payer] != null) out[t.payer] += t.amount;
      });
    });
    return out;
  }
  function spendBySpace() {
    return ['expenses', 'housing', 'car'].map(id => {
      const s = spaces.find(x => x.id === id);
      return {
        id,
        name: s.name,
        short: s.short,
        icon: s.icon,
        value: spentOf(s)
      };
    });
  }
  function topCategories() {
    const agg = {};
    ['expenses', 'housing', 'car'].forEach(id => {
      const s = spaces.find(x => x.id === id);
      s.tx.forEach(t => {
        const label = (s.cats.find(c => c.key === t.cat) || {}).label || t.cat;
        const k = t.cat + '|' + label;
        agg[k] = (agg[k] || 0) + t.amount;
      });
    });
    return Object.entries(agg).map(([k, v]) => ({
      cat: k.split('|')[0],
      label: k.split('|')[1],
      value: v
    })).sort((a, b) => b.value - a.value).slice(0, 5);
  }
  window.SproutData = {
    monthLabel: 'June 2026',
    budget: totalBudget,
    lastMonthSpend: 4980,
    totalSpent: domainSpend,
    spaces,
    personal,
    history,
    spaceIcons,
    spentOf,
    space: id => spaces.find(s => s.id === id),
    spendByPerson,
    spendBySpace,
    topCategories,
    // generic: secondary (non-primary) fields of a space, for row subtitles
    secondaryFields: sp => (sp.fields || []).filter(f => !f.primary)
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/desktop/data.js", error: String((e && e.message) || e) }); }

// ui_kits/mobile/AddExpense.jsx
try { (() => {
// Add-entry dialog — space FIRST, then a category + fields scoped to it.
(function () {
  const K = window.KiraDesignSystem_c378eb;
  const {
    Dialog,
    Input,
    Select,
    SegmentedControl,
    Switch,
    Button,
    CategoryIcon
  } = K;
  const D = window.SproutData;

  // Renders a space field as text, or (if it has options) a dropdown with an
  // "Other…" escape hatch that reveals a free-text input.
  function FieldInput({
    field,
    onChange
  }) {
    const [sel, setSel] = React.useState('');
    const [custom, setCustom] = React.useState('');
    if (field.type === 'select' && field.options) {
      const opts = field.options.map(o => ({
        value: o,
        label: o
      })).concat({
        value: '__other',
        label: 'Other…'
      });
      return /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2)'
        }
      }, /*#__PURE__*/React.createElement(Select, {
        label: field.label,
        value: sel,
        placeholder: "Choose\u2026",
        options: opts,
        onChange: e => {
          const v = e.target.value;
          setSel(v);
          onChange(v === '__other' ? custom : v);
        }
      }), sel === '__other' && /*#__PURE__*/React.createElement(Input, {
        placeholder: 'Enter ' + field.label.toLowerCase(),
        value: custom,
        onChange: e => {
          setCustom(e.target.value);
          onChange(e.target.value);
        },
        autoFocus: true
      }));
    }
    return /*#__PURE__*/React.createElement(Input, {
      label: field.label,
      placeholder: field.placeholder || '',
      onChange: e => onChange(e.target.value)
    });
  }
  function spaceOptions() {
    const shared = D.spaces.filter(s => s.kind !== 'fund').map(s => ({
      value: s.id,
      label: s.name
    }));
    return [...shared, {
      value: 'jc',
      label: 'JC · Personal'
    }, {
      value: 'ch',
      label: 'CH · Personal'
    }];
  }
  const spaceById = id => id === 'jc' || id === 'ch' ? D.personal[id] : D.space(id);
  const catsFor = id => spaceById(id)?.cats || [];
  const fieldsFor = id => spaceById(id)?.fields || [];
  window.AddExpenseDialog = function AddExpenseDialog({
    open,
    onClose,
    onSave,
    initialSpace = 'expenses'
  }) {
    const [space, setSpace] = React.useState(initialSpace);
    const [cat, setCat] = React.useState(catsFor(initialSpace)[0]?.key);
    const [fieldVals, setFieldVals] = React.useState({});
    const [amount, setAmount] = React.useState('');
    const [payer, setPayer] = React.useState('joint');
    const [note, setNote] = React.useState('');
    const [recurring, setRecurring] = React.useState(false);
    const onSpace = v => {
      setSpace(v);
      setCat(catsFor(v)[0]?.key);
      setFieldVals({});
    };
    const setField = (k, val) => setFieldVals(s => ({
      ...s,
      [k]: val
    }));
    const cats = catsFor(space);
    const fields = fieldsFor(space);
    const primary = fields.find(f => f.primary);
    const secondary = fields.filter(f => !f.primary);
    const personal = space === 'jc' || space === 'ch';
    const save = () => {
      onSave && onSave({
        space,
        cat,
        amount: parseFloat(amount) || 0,
        payer,
        note,
        ...fieldVals
      });
      setAmount('');
      setNote('');
      setFieldVals({});
    };
    return /*#__PURE__*/React.createElement(Dialog, {
      open: open,
      onClose: onClose,
      title: "Add entry",
      description: "Pick a space, then fill in what belongs to it.",
      footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        variant: "ghost",
        onClick: onClose
      }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
        iconStart: "check",
        onClick: save,
        disabled: !amount
      }, "Save entry"))
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)'
      }
    }, /*#__PURE__*/React.createElement(Select, {
      label: "Space",
      value: space,
      onChange: e => onSpace(e.target.value),
      options: spaceOptions()
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        gap: 'var(--space-3)'
      }
    }, /*#__PURE__*/React.createElement(CategoryIcon, {
      category: cat,
      size: 52
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement(Input, {
      label: "Amount",
      prefix: "RM",
      placeholder: "0.00",
      inputMode: "decimal",
      size: "lg",
      value: amount,
      onChange: e => setAmount(e.target.value),
      autoFocus: true
    }))), /*#__PURE__*/React.createElement(Select, {
      label: `Category · ${personal ? 'Personal' : D.space(space)?.name || ''}`,
      value: cat,
      onChange: e => setCat(e.target.value),
      options: cats.map(c => ({
        value: c.key,
        label: c.label
      }))
    }), primary && /*#__PURE__*/React.createElement(FieldInput, {
      key: space + ':' + primary.key,
      field: primary,
      onChange: v => setField(primary.key, v)
    }), secondary.map(f => /*#__PURE__*/React.createElement(FieldInput, {
      key: space + ':' + f.key,
      field: f,
      onChange: v => setField(f.key, v)
    })), !personal && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)'
      }
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        font: 'var(--font-label)',
        color: 'var(--text-body)'
      }
    }, "Paid by"), /*#__PURE__*/React.createElement(SegmentedControl, {
      fullWidth: true,
      value: payer,
      onChange: setPayer,
      options: [{
        value: 'joint',
        label: 'Joint'
      }, {
        value: 'jc',
        label: 'JC'
      }, {
        value: 'ch',
        label: 'CH'
      }]
    })), /*#__PURE__*/React.createElement(Input, {
      label: "Note",
      placeholder: "Anything to remember?",
      value: note,
      onChange: e => setNote(e.target.value)
    }), /*#__PURE__*/React.createElement(Switch, {
      label: "Recurring monthly",
      description: "Repeats on the same day each month",
      checked: recurring,
      onChange: e => setRecurring(e.target.checked)
    })));
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile/AddExpense.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile/Home.jsx
try { (() => {
// Home — a roll-up across every space.
(function () {
  const K = window.KiraDesignSystem_c378eb;
  const {
    StatCard,
    Card,
    ListRow,
    Amount,
    Badge,
    CategoryIcon,
    Avatar,
    Icon
  } = K;
  const D = window.SproutData;
  const SAGE = {
    color: 'var(--sage-700)'
  }; // balances read in sage, not stark black

  function SectionHead({
    title,
    action,
    onAction
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        margin: '0 4px 10px'
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        font: 'var(--font-h3)',
        color: 'var(--text-strong)',
        margin: 0
      }
    }, title), action && /*#__PURE__*/React.createElement("button", {
      onClick: onAction,
      style: {
        border: 'none',
        background: 'none',
        font: 'var(--font-label)',
        color: 'var(--text-accent)',
        cursor: 'pointer'
      }
    }, action));
  }
  window.HomeScreen = function HomeScreen({
    goSpace,
    goTo
  }) {
    const shared = D.spaces.filter(s => s.group === 'shared');
    const spendSpaces = shared.filter(s => s.kind === 'spend');
    const joint = D.space('joint');
    const invest = D.space('invest') || D.space('investment');
    const left = D.budget - D.totalSpent;
    const recent = D.space('expenses').tx.slice(0, 3);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--font-caption)',
        color: 'var(--text-muted)'
      }
    }, "Good evening, JC \uD83C\uDF3F"), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--font-h2)',
        color: 'var(--text-strong)'
      }
    }, D.monthLabel)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        marginRight: 6
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: "JC",
      size: 34,
      style: {
        boxShadow: '0 0 0 2px var(--surface-canvas)'
      }
    }), /*#__PURE__*/React.createElement(Avatar, {
      name: "CH",
      size: 34,
      style: {
        marginLeft: -10,
        boxShadow: '0 0 0 2px var(--surface-canvas)'
      }
    }), /*#__PURE__*/React.createElement(Avatar, {
      name: "Leo",
      size: 34,
      style: {
        marginLeft: -10,
        boxShadow: '0 0 0 2px var(--surface-canvas)'
      }
    }))), /*#__PURE__*/React.createElement(Card, {
      padding: "lg",
      style: {
        background: 'var(--accent)',
        border: 'none'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--font-label)',
        color: 'rgba(255,255,255,0.85)'
      }
    }, "Total spent \xB7 Everyday + Housing + Car"), /*#__PURE__*/React.createElement(Amount, {
      value: D.totalSpent,
      size: "hero",
      style: {
        color: '#fff',
        display: 'block',
        marginTop: 6
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginTop: 6,
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--font-caption)',
        fontWeight: 'var(--fw-semibold)',
        color: '#fff'
      }
    }, "RM ", Math.round(left).toLocaleString(), " left"), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--font-caption)',
        color: 'rgba(255,255,255,0.8)'
      }
    }, "of RM ", D.budget.toLocaleString(), " budget")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 3,
        height: 8,
        borderRadius: 'var(--radius-pill)',
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.22)'
      }
    }, spendSpaces.map((s, i) => /*#__PURE__*/React.createElement("span", {
      key: s.id,
      style: {
        width: `${D.spentOf(s) / D.totalSpent * 100}%`,
        background: `rgba(255,255,255,${[0.95, 0.66, 0.4][i]})`
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 10
      }
    }, spendSpaces.map(s => /*#__PURE__*/React.createElement("span", {
      key: s.id,
      style: {
        font: 'var(--font-caption)',
        color: 'rgba(255,255,255,0.85)',
        fontWeight: 'var(--fw-medium)'
      }
    }, s.short, " ", Math.round(D.spentOf(s) / D.totalSpent * 100), "%")))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'var(--space-3)'
      }
    }, /*#__PURE__*/React.createElement(StatCard, {
      label: "Joint Fund",
      value: joint.balance,
      icon: "wallet",
      footer: "Shared balance",
      amountProps: {
        style: SAGE
      }
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Investment \xB7 AIA",
      value: invest.value,
      icon: "trending-up",
      footer: "Portfolio value",
      amountProps: {
        style: SAGE
      }
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHead, {
      title: "Spaces",
      action: "Manage",
      onAction: () => goTo('spaces')
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)'
      }
    }, D.spaces.filter(s => s.kind === 'spend').map(s => /*#__PURE__*/React.createElement(Card, {
      key: s.id,
      interactive: true,
      padding: "sm",
      onClick: () => goSpace(s.id)
    }, /*#__PURE__*/React.createElement(ListRow, {
      leading: /*#__PURE__*/React.createElement("span", {
        style: {
          width: 40,
          height: 40,
          borderRadius: 'var(--radius-md)',
          background: 'var(--accent-soft)',
          color: 'var(--accent-soft-fg)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: s.icon,
        size: 20
      })),
      title: s.name,
      subtitle: s.sub ? s.sub : `${s.tx.length} entries`,
      trailing: /*#__PURE__*/React.createElement(Amount, {
        value: D.spentOf(s)
      }),
      meta: s.budget ? `of RM ${s.budget.toLocaleString()}` : 'this month',
      chevron: true
    }))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHead, {
      title: "Recent activity",
      action: "See all",
      onAction: () => goSpace('expenses')
    }), /*#__PURE__*/React.createElement(Card, {
      padding: "sm"
    }, recent.map((e, i) => /*#__PURE__*/React.createElement(ListRow, {
      key: e.id,
      leading: /*#__PURE__*/React.createElement(CategoryIcon, {
        category: e.cat
      }),
      title: e.vendor,
      subtitle: `${e.note} · ${e.payer}`,
      trailing: /*#__PURE__*/React.createElement(Amount, {
        value: e.amount
      }),
      meta: e.date,
      divider: i < recent.length - 1
    })))));
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile/Manage.jsx
try { (() => {
// Manage flows — create a new space, and edit a space's categories + fields.
// Interactive mocks (local state) so the shape of "make it your own" is clear.
(function () {
  const K = window.KiraDesignSystem_c378eb;
  const {
    Dialog,
    Input,
    Button,
    IconButton,
    SegmentedControl,
    CategoryIcon,
    Icon,
    Tag,
    Badge
  } = K;
  const D = window.SproutData;

  // A field row in settings: name + type, remove, and preset-value management.
  // Adding preset values turns the field into a dropdown at entry time.
  function FieldRow({
    field,
    onRemove
  }) {
    const [opts, setOpts] = React.useState(field.options ? field.options.slice() : []);
    const [np, setNp] = React.useState('');
    const isSelect = opts.length > 0;
    const addOpt = () => {
      if (!np.trim()) return;
      setOpts(o => [...o, np.trim()]);
      setNp('');
    };
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '10px 12px',
        background: 'var(--surface-sunken)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "tag",
      size: 16,
      style: {
        color: 'var(--text-muted)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        font: 'var(--font-label)',
        color: 'var(--text-strong)'
      }
    }, field.label, field.primary ? ' · title' : ''), /*#__PURE__*/React.createElement(Badge, {
      tone: isSelect ? 'accent' : 'neutral'
    }, isSelect ? 'dropdown' : 'text'), !field.primary && /*#__PURE__*/React.createElement(IconButton, {
      icon: "x",
      label: "Remove field",
      variant: "ghost",
      size: "sm",
      onClick: onRemove
    })), opts.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        flexWrap: 'wrap'
      }
    }, opts.map((o, i) => /*#__PURE__*/React.createElement(Tag, {
      key: o + i,
      size: "sm",
      onRemove: () => setOpts(x => x.filter((_, j) => j !== i))
    }, o))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement(Input, {
      placeholder: "Add a preset value\u2026",
      value: np,
      onChange: e => setNp(e.target.value),
      onKeyDown: e => e.key === 'Enter' && addOpt()
    })), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      iconStart: "plus",
      onClick: addOpt
    }, "Preset")));
  }

  // ---- New space -----------------------------------------------------------
  window.NewSpaceDialog = function NewSpaceDialog({
    open,
    onClose,
    onCreate
  }) {
    const [name, setName] = React.useState('');
    const [icon, setIcon] = React.useState('wallet');
    const [kind, setKind] = React.useState('spend');
    const [budget, setBudget] = React.useState('');
    const create = () => {
      onCreate && onCreate({
        name,
        icon,
        kind,
        budget: kind === 'spend' ? parseFloat(budget) || null : null
      });
      setName('');
      setIcon('wallet');
      setKind('spend');
      setBudget('');
    };
    return /*#__PURE__*/React.createElement(Dialog, {
      open: open,
      onClose: onClose,
      title: "New space",
      description: "Spaces keep money separate \u2014 e.g. another investment, a renovation, a trip.",
      footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        variant: "ghost",
        onClick: onClose
      }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
        iconStart: "plus",
        onClick: create,
        disabled: !name
      }, "Create space"))
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-5)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        gap: 'var(--space-3)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 52,
        height: 52,
        borderRadius: 'var(--radius-md)',
        background: 'var(--accent-soft)',
        color: 'var(--accent-soft-fg)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: 24
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement(Input, {
      label: "Space name",
      placeholder: "e.g. Versa Investment",
      value: name,
      onChange: e => setName(e.target.value),
      autoFocus: true
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)'
      }
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        font: 'var(--font-label)',
        color: 'var(--text-body)'
      }
    }, "Icon"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap'
      }
    }, D.spaceIcons.map(ic => /*#__PURE__*/React.createElement(IconButton, {
      key: ic,
      icon: ic,
      label: ic,
      variant: icon === ic ? 'primary' : 'secondary',
      onClick: () => setIcon(ic)
    })))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)'
      }
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        font: 'var(--font-label)',
        color: 'var(--text-body)'
      }
    }, "Type"), /*#__PURE__*/React.createElement(SegmentedControl, {
      fullWidth: true,
      value: kind,
      onChange: setKind,
      options: [{
        value: 'spend',
        label: 'Spending'
      }, {
        value: 'fund',
        label: 'Fund'
      }, {
        value: 'invest',
        label: 'Investment'
      }]
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--font-caption)',
        color: 'var(--text-muted)'
      }
    }, "You can add categories & fields after creating.")), kind === 'spend' && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)'
      }
    }, /*#__PURE__*/React.createElement(Input, {
      label: "Monthly budget (optional)",
      prefix: "RM",
      placeholder: "0.00",
      inputMode: "decimal",
      value: budget,
      onChange: e => setBudget(e.target.value)
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--font-caption)',
        color: 'var(--text-muted)'
      }
    }, "Set a target now, or add one later from the space."))));
  };

  // ---- Space settings: categories + fields ---------------------------------
  window.SpaceSettingsDialog = function SpaceSettingsDialog({
    open,
    onClose,
    spaceId
  }) {
    const base = spaceId && (spaceId === 'jc' || spaceId === 'ch' ? D.personal[spaceId] : D.space(spaceId));
    const [name, setName] = React.useState(base ? base.name : '');
    const [cats, setCats] = React.useState(base ? base.cats.slice() : []);
    const [fields, setFields] = React.useState(base ? (base.fields || []).slice() : []);
    const [newCat, setNewCat] = React.useState('');
    const [newField, setNewField] = React.useState('');
    React.useEffect(() => {
      if (!base) return;
      setName(base.name);
      setCats(base.cats.slice());
      setFields((base.fields || []).slice());
    }, [spaceId, open]);
    if (!base) return null;
    const addCat = () => {
      if (!newCat.trim()) return;
      setCats(c => [...c, {
        key: 'other',
        label: newCat.trim()
      }]);
      setNewCat('');
    };
    const addField = () => {
      if (!newField.trim()) return;
      setFields(f => [...f, {
        key: 'custom' + f.length,
        label: newField.trim(),
        type: 'text'
      }]);
      setNewField('');
    };
    return /*#__PURE__*/React.createElement(Dialog, {
      open: open,
      onClose: onClose,
      title: `${base.name} · settings`,
      size: "md",
      footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        variant: "ghost",
        onClick: onClose
      }, "Close"), /*#__PURE__*/React.createElement(Button, {
        iconStart: "check",
        onClick: onClose
      }, "Save"))
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-5)'
      }
    }, /*#__PURE__*/React.createElement(Input, {
      label: "Space name",
      value: name,
      onChange: e => setName(e.target.value)
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)'
      }
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        font: 'var(--font-label)',
        color: 'var(--text-body)'
      }
    }, "Categories"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap'
      }
    }, cats.map((c, i) => /*#__PURE__*/React.createElement(Tag, {
      key: c.key + i,
      onRemove: () => setCats(x => x.filter((_, j) => j !== i))
    }, /*#__PURE__*/React.createElement(CategoryIcon, {
      category: c.key,
      size: 18,
      radius: "var(--radius-xs)",
      style: {
        marginRight: 4
      }
    }), c.label))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement(Input, {
      placeholder: "Add a category",
      value: newCat,
      onChange: e => setNewCat(e.target.value),
      onKeyDown: e => e.key === 'Enter' && addCat()
    })), /*#__PURE__*/React.createElement(Button, {
      variant: "soft",
      iconStart: "plus",
      onClick: addCat
    }, "Add"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)'
      }
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        font: 'var(--font-label)',
        color: 'var(--text-body)'
      }
    }, "Extra info fields"), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--font-caption)',
        color: 'var(--text-muted)',
        marginTop: -4
      }
    }, "Shown when adding to this space. Everyday uses Store & Location."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, fields.map((f, i) => /*#__PURE__*/React.createElement(FieldRow, {
      key: f.key + i,
      field: f,
      onRemove: () => setFields(x => x.filter((_, j) => j !== i))
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement(Input, {
      placeholder: "Add a field, e.g. Warranty",
      value: newField,
      onChange: e => setNewField(e.target.value),
      onKeyDown: e => e.key === 'Enter' && addField()
    })), /*#__PURE__*/React.createElement(Button, {
      variant: "soft",
      iconStart: "plus",
      onClick: addField
    }, "Add")))));
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile/Manage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile/Onboarding.jsx
try { (() => {
// Onboarding — Sprout first-run flow (welcome → household → spaces → budget → done).
(function () {
  const K = window.KiraDesignSystem_c378eb;
  const {
    Card,
    Button,
    Input,
    Icon,
    Avatar,
    IconButton,
    Amount
  } = K;
  const SUGGESTED = [{
    id: 'expenses',
    name: 'Everyday Expenses',
    icon: 'receipt',
    on: true
  }, {
    id: 'housing',
    name: 'Housing',
    icon: 'home',
    on: true
  }, {
    id: 'car',
    name: 'Car',
    icon: 'repeat',
    on: true
  }, {
    id: 'investment',
    name: 'Investment',
    icon: 'trending-up',
    on: false
  }, {
    id: 'joint',
    name: 'Joint Fund',
    icon: 'wallet',
    on: true
  }];
  function Dots({
    step,
    total
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        justifyContent: 'center'
      }
    }, Array.from({
      length: total
    }).map((_, i) => /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        width: i === step ? 22 : 7,
        height: 7,
        borderRadius: 'var(--radius-pill)',
        background: i === step ? 'var(--accent)' : 'var(--neutral-300)',
        transition: 'width var(--dur-base) var(--ease-out), background-color var(--dur-base)'
      }
    })));
  }
  window.OnboardingScreen = function OnboardingScreen({
    onDone
  }) {
    const [step, setStep] = React.useState(0);
    const [p1, setP1] = React.useState('JC');
    const [p2, setP2] = React.useState('CH');
    const [spaces, setSpaces] = React.useState(SUGGESTED.map(s => ({
      ...s
    })));
    const [budgets, setBudgets] = React.useState({
      expenses: '1500',
      housing: '2100',
      car: '800'
    });
    const setB = (k, v) => setBudgets(b => ({
      ...b,
      [k]: v
    }));
    const budgetTotal = Object.values(budgets).reduce((a, v) => a + (parseFloat(v) || 0), 0);
    const TOTAL = 5;
    const next = () => setStep(s => Math.min(TOTAL - 1, s + 1));
    const back = () => setStep(s => Math.max(0, s - 1));
    const toggle = id => setSpaces(xs => xs.map(x => x.id === id ? {
      ...x,
      on: !x.on
    } : x));
    const chosen = spaces.filter(s => s.on).length;
    const wrap = (children, footer) => /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        gap: 'var(--space-6)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        minHeight: 40
      }
    }, step > 0 && step < 4 && /*#__PURE__*/React.createElement(IconButton, {
      icon: "arrow-left",
      label: "Back",
      variant: "ghost",
      onClick: back,
      style: {
        marginLeft: -8
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }), step > 0 && step < 4 && /*#__PURE__*/React.createElement(Dots, {
      step: step - 1,
      total: 3
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-5)'
      }
    }, children), footer);

    // Step 0 — welcome
    if (step === 0) {
      return /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          textAlign: 'center',
          paddingTop: 'var(--space-9)'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--space-5)'
        }
      }, /*#__PURE__*/React.createElement("img", {
        src: "../../assets/sprout-icon.svg",
        width: "88",
        height: "88",
        alt: "Sprout",
        style: {
          borderRadius: 24,
          boxShadow: 'var(--shadow-lg)'
        }
      }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
        style: {
          font: 'var(--font-display)',
          color: 'var(--text-strong)',
          margin: 0
        }
      }, "Track money,", /*#__PURE__*/React.createElement("br", null), "together."), /*#__PURE__*/React.createElement("p", {
        style: {
          font: 'var(--font-body)',
          fontSize: 'var(--text-lg)',
          color: 'var(--text-muted)',
          margin: 'var(--space-3) auto 0',
          maxWidth: '30ch'
        }
      }, "Expenses, monthly bills, and who paid what \u2014 in one calm place for you both."))), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-3)',
          paddingBottom: 'var(--space-6)'
        }
      }, /*#__PURE__*/React.createElement(Button, {
        size: "lg",
        fullWidth: true,
        onClick: next
      }, "Get started"), /*#__PURE__*/React.createElement(Button, {
        size: "lg",
        variant: "ghost",
        fullWidth: true
      }, "I already have an account")));
    }

    // Step 1 — household
    if (step === 1) {
      return wrap(/*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
        style: {
          font: 'var(--font-h1)',
          color: 'var(--text-strong)',
          margin: 0
        }
      }, "Who's in your household?"), /*#__PURE__*/React.createElement("p", {
        style: {
          font: 'var(--font-body)',
          color: 'var(--text-muted)',
          margin: 'var(--space-2) 0 0'
        }
      }, "Sprout is better with two. You can invite more later.")), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'flex-end',
          gap: 'var(--space-3)'
        }
      }, /*#__PURE__*/React.createElement(Avatar, {
        name: p1 || '?',
        size: 52
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1
        }
      }, /*#__PURE__*/React.createElement(Input, {
        label: "You",
        value: p1,
        onChange: e => setP1(e.target.value),
        placeholder: "Your name"
      }))), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'flex-end',
          gap: 'var(--space-3)'
        }
      }, /*#__PURE__*/React.createElement(Avatar, {
        name: p2 || '?',
        size: 52
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1
        }
      }, /*#__PURE__*/React.createElement(Input, {
        label: "Partner",
        value: p2,
        onChange: e => setP2(e.target.value),
        placeholder: "Their name"
      }))), /*#__PURE__*/React.createElement("button", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          border: 'none',
          background: 'none',
          color: 'var(--text-accent)',
          font: 'var(--font-label)',
          cursor: 'pointer',
          padding: 4
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "plus",
        size: 16
      }), " Add another person"))), /*#__PURE__*/React.createElement(Button, {
        size: "lg",
        fullWidth: true,
        iconEnd: "arrow-right",
        onClick: next,
        disabled: !p1 || !p2
      }, "Continue"));
    }

    // Step 2 — choose spaces
    if (step === 2) {
      return wrap(/*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
        style: {
          font: 'var(--font-h1)',
          color: 'var(--text-strong)',
          margin: 0
        }
      }, "Choose your spaces"), /*#__PURE__*/React.createElement("p", {
        style: {
          font: 'var(--font-body)',
          color: 'var(--text-muted)',
          margin: 'var(--space-2) 0 0'
        }
      }, "Keep areas of money separate. Add or remove any anytime.")), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2)'
        }
      }, spaces.map(s => /*#__PURE__*/React.createElement(Card, {
        key: s.id,
        interactive: true,
        padding: "sm",
        onClick: () => toggle(s.id),
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          padding: 'var(--space-3)',
          borderColor: s.on ? 'var(--accent)' : 'var(--border-subtle)'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          width: 40,
          height: 40,
          borderRadius: 'var(--radius-md)',
          background: 'var(--accent-soft)',
          color: 'var(--accent-soft-fg)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: s.icon,
        size: 20
      })), /*#__PURE__*/React.createElement("span", {
        style: {
          flex: 1,
          font: 'var(--font-body)',
          fontWeight: 'var(--fw-semibold)',
          color: 'var(--text-strong)'
        }
      }, s.name), /*#__PURE__*/React.createElement("span", {
        style: {
          width: 24,
          height: 24,
          borderRadius: '50%',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: s.on ? 'var(--accent)' : 'transparent',
          border: s.on ? 'none' : '2px solid var(--border-strong)',
          color: '#fff'
        }
      }, s.on && /*#__PURE__*/React.createElement(Icon, {
        name: "check",
        size: 15,
        strokeWidth: 3
      })))))), /*#__PURE__*/React.createElement(Button, {
        size: "lg",
        fullWidth: true,
        iconEnd: "arrow-right",
        onClick: next,
        disabled: chosen === 0
      }, "Continue with ", chosen));
    }

    // Step 3 — per-space budgets
    if (step === 3) {
      const rows = [{
        id: 'expenses',
        name: 'Everyday Expenses',
        icon: 'receipt'
      }, {
        id: 'housing',
        name: 'Housing',
        icon: 'home'
      }, {
        id: 'car',
        name: 'Car',
        icon: 'repeat'
      }];
      return wrap(/*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
        style: {
          font: 'var(--font-h1)',
          color: 'var(--text-strong)',
          margin: 0
        }
      }, "Set a budget per space"), /*#__PURE__*/React.createElement("p", {
        style: {
          font: 'var(--font-body)',
          color: 'var(--text-muted)',
          margin: 'var(--space-2) 0 0'
        }
      }, "A gentle monthly guide for each \u2014 change any of them anytime.")), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-3)'
        }
      }, rows.map(r => /*#__PURE__*/React.createElement("div", {
        key: r.id,
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          width: 40,
          height: 40,
          borderRadius: 'var(--radius-md)',
          background: 'var(--accent-soft)',
          color: 'var(--accent-soft-fg)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: r.icon,
        size: 20
      })), /*#__PURE__*/React.createElement("span", {
        style: {
          flex: 1,
          font: 'var(--font-body)',
          fontWeight: 'var(--fw-semibold)',
          color: 'var(--text-strong)'
        }
      }, r.name), /*#__PURE__*/React.createElement("div", {
        style: {
          width: 130
        }
      }, /*#__PURE__*/React.createElement(Input, {
        prefix: "RM",
        inputMode: "decimal",
        value: budgets[r.id],
        onChange: e => setB(r.id, e.target.value)
      })))), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 4px 0',
          borderTop: '1px solid var(--border-subtle)',
          marginTop: 4
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          font: 'var(--font-label)',
          color: 'var(--text-muted)'
        }
      }, "Total budget"), /*#__PURE__*/React.createElement(Amount, {
        value: budgetTotal,
        size: "lg",
        style: {
          color: 'var(--sage-700)'
        }
      })))), /*#__PURE__*/React.createElement(Button, {
        size: "lg",
        fullWidth: true,
        onClick: next,
        disabled: budgetTotal <= 0
      }, "Finish setup"));
    }

    // Step 4 — done
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-5)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 84,
        height: 84,
        borderRadius: '50%',
        background: 'var(--accent)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'var(--shadow-lg)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 44,
      strokeWidth: 2.6,
      style: {
        color: '#fff'
      }
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
      style: {
        font: 'var(--font-h1)',
        color: 'var(--text-strong)',
        margin: 0
      }
    }, "You're all set, ", p1, "! \uD83C\uDF3F"), /*#__PURE__*/React.createElement("p", {
      style: {
        font: 'var(--font-body)',
        fontSize: 'var(--text-lg)',
        color: 'var(--text-muted)',
        margin: 'var(--space-3) auto 0',
        maxWidth: '30ch'
      }
    }, chosen, " spaces ready for you and ", p2, ". Budget set to ", /*#__PURE__*/React.createElement("strong", {
      style: {
        color: 'var(--text-body)'
      }
    }, "RM ", budgetTotal.toLocaleString()), "."))), /*#__PURE__*/React.createElement("div", {
      style: {
        paddingBottom: 'var(--space-6)'
      }
    }, /*#__PURE__*/React.createElement(Button, {
      size: "lg",
      fullWidth: true,
      iconStart: "home",
      onClick: onDone
    }, "Open Sprout")));
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile/Onboarding.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile/Personal.jsx
try { (() => {
// Personal — JC / CH personal funds (income + personal spending).
(function () {
  const K = window.KiraDesignSystem_c378eb;
  const {
    Card,
    ListRow,
    Amount,
    SegmentedControl,
    StatCard,
    CategoryIcon,
    Avatar,
    Badge
  } = K;
  const D = window.SproutData;
  const SAGE = {
    color: 'var(--sage-700)'
  };
  window.PersonalScreen = function PersonalScreen({
    who,
    setWho
  }) {
    const p = D.personal[who];
    const income = p.income;
    const spent = p.tx.filter(t => t.dir === 'out').reduce((a, t) => a + t.amount, 0);
    const left = income - spent;
    const outTx = p.tx.filter(t => t.dir === 'out');
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-5)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)'
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: p.name,
      size: 40
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--font-caption)',
        color: 'var(--text-muted)'
      }
    }, "Personal \xB7 ", D.monthLabel), /*#__PURE__*/React.createElement("h2", {
      style: {
        font: 'var(--font-h2)',
        color: 'var(--text-strong)',
        margin: 0
      }
    }, p.name, "'s money"))), /*#__PURE__*/React.createElement(SegmentedControl, {
      fullWidth: true,
      value: who,
      onChange: setWho,
      options: [{
        value: 'jc',
        label: 'JC'
      }, {
        value: 'ch',
        label: 'CH'
      }]
    }), /*#__PURE__*/React.createElement(Card, {
      padding: "lg",
      style: {
        background: 'var(--accent)',
        border: 'none'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--font-label)',
        color: 'rgba(255,255,255,0.85)'
      }
    }, "Left this month"), /*#__PURE__*/React.createElement(Amount, {
      value: left,
      size: "hero",
      style: {
        color: '#fff',
        display: 'block',
        marginTop: 4
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 18,
        marginTop: 12
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--font-caption)',
        color: 'rgba(255,255,255,0.9)'
      }
    }, "Income RM ", income.toLocaleString()), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--font-caption)',
        color: 'rgba(255,255,255,0.9)'
      }
    }, "Spent RM ", spent.toLocaleString()))), /*#__PURE__*/React.createElement(Card, {
      padding: "sm"
    }, outTx.map((t, i) => /*#__PURE__*/React.createElement(ListRow, {
      key: t.id,
      leading: /*#__PURE__*/React.createElement(CategoryIcon, {
        category: t.cat
      }),
      title: t.vendor,
      subtitle: `${t.note}`,
      trailing: /*#__PURE__*/React.createElement(Amount, {
        value: t.amount
      }),
      meta: t.date,
      divider: i < outTx.length - 1
    }))));
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile/Personal.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile/Reports.jsx
try { (() => {
// Reports — trend (with range), by space, who-paid (drill-down), top categories.
(function () {
  const K = window.KiraDesignSystem_c378eb;
  const {
    Card,
    Amount,
    ProgressBar,
    CategoryIcon,
    SegmentedControl,
    Icon
  } = K;
  const D = window.SproutData;
  function SectionHead({
    title,
    right
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: '0 4px 12px'
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        font: 'var(--font-h3)',
        color: 'var(--text-strong)',
        margin: 0
      }
    }, title), right);
  }
  const personColor = {
    JC: 'var(--sage-500)',
    CH: 'var(--sage-300)',
    Joint: 'var(--sage-700)'
  };
  window.ReportsScreen = function ReportsScreen() {
    const [range, setRange] = React.useState('6m');
    const [openPerson, setOpenPerson] = React.useState(null);
    const n = range === '3m' ? 3 : 6;
    const hist = D.history.slice(-n);
    const maxV = Math.max(...hist.map(h => h.v));
    const rangeTotal = hist.reduce((a, h) => a + h.v, 0);
    const avg = rangeTotal / hist.length;
    const byPerson = D.spendByPerson();
    const personTotal = Object.values(byPerson).reduce((a, b) => a + b, 0);
    const bySpace = D.spendBySpace();
    const spaceTotal = bySpace.reduce((a, s) => a + s.value, 0);
    const top = D.topCategories();
    const topMax = Math.max(...top.map(t => t.value));
    const personBySpace = p => bySpace.map(s => {
      const sp = D.space(s.id);
      const v = sp.tx.filter(t => t.payer === p).reduce((a, t) => a + t.amount, 0);
      return {
        name: s.short,
        icon: s.icon,
        value: v
      };
    }).filter(x => x.value > 0);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--font-caption)',
        color: 'var(--text-muted)'
      }
    }, D.monthLabel), /*#__PURE__*/React.createElement("h2", {
      style: {
        font: 'var(--font-h1)',
        color: 'var(--text-strong)',
        margin: '2px 0 0'
      }
    }, "Reports")), /*#__PURE__*/React.createElement(SegmentedControl, {
      size: "sm",
      value: range,
      onChange: setRange,
      options: [{
        value: '3m',
        label: '3M'
      }, {
        value: '6m',
        label: '6M'
      }]
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHead, {
      title: "Spending trend",
      right: /*#__PURE__*/React.createElement("span", {
        style: {
          font: 'var(--font-caption)',
          color: 'var(--text-muted)'
        }
      }, "avg RM ", Math.round(avg).toLocaleString(), "/mo")
    }), /*#__PURE__*/React.createElement(Card, {
      padding: "lg"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 10,
        height: 148
      }
    }, hist.map((h, i) => {
      const isNow = i === hist.length - 1;
      return /*#__PURE__*/React.createElement("div", {
        key: h.m,
        style: {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          height: '100%',
          justifyContent: 'flex-end'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          font: 'var(--font-caption)',
          fontWeight: 'var(--fw-semibold)',
          color: isNow ? 'var(--sage-700)' : 'var(--text-subtle)'
        }
      }, (h.v / 1000).toFixed(1), "k"), /*#__PURE__*/React.createElement("div", {
        style: {
          width: '100%',
          maxWidth: 34,
          height: `${h.v / maxV * 100}%`,
          borderRadius: 'var(--radius-sm)',
          background: isNow ? 'var(--accent)' : 'var(--sage-200)'
        }
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          font: 'var(--font-caption)',
          color: 'var(--text-muted)'
        }
      }, h.m));
    })))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHead, {
      title: "By space"
    }), /*#__PURE__*/React.createElement(Card, {
      padding: "lg"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)'
      }
    }, bySpace.map(s => /*#__PURE__*/React.createElement("div", {
      key: s.id,
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        font: 'var(--font-label)',
        color: 'var(--text-body)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: s.icon,
      size: 16,
      style: {
        color: 'var(--text-muted)'
      }
    }), s.name), /*#__PURE__*/React.createElement(Amount, {
      value: s.value
    })), /*#__PURE__*/React.createElement(ProgressBar, {
      value: s.value,
      max: spaceTotal
    })))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHead, {
      title: "Who paid",
      right: /*#__PURE__*/React.createElement("span", {
        style: {
          font: 'var(--font-caption)',
          color: 'var(--text-subtle)'
        }
      }, "tap to break down")
    }), /*#__PURE__*/React.createElement(Card, {
      padding: "lg"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 3,
        height: 12,
        borderRadius: 'var(--radius-pill)',
        overflow: 'hidden',
        marginBottom: 16
      }
    }, ['JC', 'CH', 'Joint'].map(p => /*#__PURE__*/React.createElement("span", {
      key: p,
      style: {
        width: `${byPerson[p] / personTotal * 100}%`,
        background: personColor[p]
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-1)'
      }
    }, ['JC', 'CH', 'Joint'].map(p => {
      const open = openPerson === p;
      const label = p === 'Joint' ? 'Joint Fund' : p;
      return /*#__PURE__*/React.createElement("div", {
        key: p
      }, /*#__PURE__*/React.createElement("button", {
        onClick: () => setOpenPerson(open ? null : p),
        style: {
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '8px 4px',
          border: 'none',
          background: 'none',
          cursor: 'pointer'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          width: 12,
          height: 12,
          borderRadius: 4,
          background: personColor[p]
        }
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          flex: 1,
          textAlign: 'left',
          font: 'var(--font-label)',
          color: 'var(--text-body)'
        }
      }, label), /*#__PURE__*/React.createElement(Amount, {
        value: byPerson[p]
      }), /*#__PURE__*/React.createElement(Icon, {
        name: open ? 'chevron-up' : 'chevron-down',
        size: 16,
        style: {
          color: 'var(--text-subtle)'
        }
      })), open && /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          padding: '6px 4px 12px 26px'
        }
      }, personBySpace(p).map(r => /*#__PURE__*/React.createElement("div", {
        key: r.name,
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: r.icon,
        size: 14,
        style: {
          color: 'var(--text-muted)'
        }
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          flex: 1,
          font: 'var(--font-caption)',
          color: 'var(--text-muted)'
        }
      }, r.name), /*#__PURE__*/React.createElement(Amount, {
        value: r.value,
        size: "sm"
      }))), personBySpace(p).length === 0 && /*#__PURE__*/React.createElement("span", {
        style: {
          font: 'var(--font-caption)',
          color: 'var(--text-subtle)'
        }
      }, "No shared spending this month.")));
    })))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHead, {
      title: "Top categories"
    }), /*#__PURE__*/React.createElement(Card, {
      padding: "sm"
    }, top.map((t, i) => /*#__PURE__*/React.createElement("div", {
      key: t.cat,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        padding: 'var(--space-3)',
        borderBottom: i < top.length - 1 ? '1px solid var(--border-subtle)' : 'none'
      }
    }, /*#__PURE__*/React.createElement(CategoryIcon, {
      category: t.cat,
      size: 36
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--font-body)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-strong)'
      }
    }, t.label), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 5,
        borderRadius: 'var(--radius-pill)',
        background: 'var(--neutral-200)',
        marginTop: 5
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: `${t.value / topMax * 100}%`,
        height: '100%',
        borderRadius: 'var(--radius-pill)',
        background: 'var(--sage-400)'
      }
    }))), /*#__PURE__*/React.createElement(Amount, {
      value: t.value
    }))))));
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile/Reports.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile/SpaceDetail.jsx
try { (() => {
// SpaceDetail — one space's ledger. Tabs: Activity (transactions, editable
// categories) + Recurring (fixed monthly breakdown, add/edit-able). Budget is
// editable per space from the hero. Interactive mock — edits persist in-session.
(function () {
  const K = window.KiraDesignSystem_c378eb;
  const {
    Card,
    ListRow,
    Amount,
    Badge,
    CategoryIcon,
    IconButton,
    Tag,
    ProgressBar,
    SegmentedControl,
    Dialog,
    Input,
    Select,
    Button
  } = K;
  const D = window.SproutData;
  const subtitleFor = (space, t) => [...D.secondaryFields(space).map(f => t[f.key]).filter(Boolean), t.note, t.payer].filter(Boolean).join(' · ');
  const slug = s => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  function BudgetDialog({
    open,
    onClose,
    value,
    onSave,
    spaceName
  }) {
    const [v, setV] = React.useState(value || '');
    React.useEffect(() => {
      if (open) setV(value || '');
    }, [open]);
    return /*#__PURE__*/React.createElement(Dialog, {
      open: open,
      onClose: onClose,
      title: "Monthly budget",
      description: `Set the spending target for ${spaceName}.`,
      footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        variant: "ghost",
        onClick: onClose
      }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
        iconStart: "check",
        onClick: () => {
          onSave(parseFloat(v) || 0);
          onClose();
        },
        disabled: !v
      }, "Save budget"))
    }, /*#__PURE__*/React.createElement(Input, {
      label: "Budget / month",
      prefix: "RM",
      placeholder: "0.00",
      inputMode: "decimal",
      value: v,
      onChange: e => setV(e.target.value),
      autoFocus: true
    }));
  }
  function CategoryDialog({
    open,
    onClose,
    onAdd
  }) {
    const [label, setLabel] = React.useState('');
    React.useEffect(() => {
      if (open) setLabel('');
    }, [open]);
    return /*#__PURE__*/React.createElement(Dialog, {
      open: open,
      onClose: onClose,
      title: "Add category",
      description: "Group transactions within this space.",
      footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        variant: "ghost",
        onClick: onClose
      }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
        iconStart: "check",
        onClick: () => {
          onAdd(label);
          onClose();
        },
        disabled: !label
      }, "Add"))
    }, /*#__PURE__*/React.createElement(Input, {
      label: "Category name",
      placeholder: "e.g. Subscriptions",
      value: label,
      onChange: e => setLabel(e.target.value),
      autoFocus: true
    }));
  }
  function RecurringDialog({
    open,
    onClose,
    onAdd,
    cats
  }) {
    const [label, setLabel] = React.useState('');
    const [amount, setAmount] = React.useState('');
    const [cat, setCat] = React.useState(cats[0]?.key || 'money');
    React.useEffect(() => {
      if (open) {
        setLabel('');
        setAmount('');
        setCat(cats[0]?.key || 'money');
      }
    }, [open]);
    const add = () => {
      onAdd({
        label,
        amount: parseFloat(amount) || 0,
        cat
      });
      onClose();
    };
    return /*#__PURE__*/React.createElement(Dialog, {
      open: open,
      onClose: onClose,
      title: "Add commitment",
      description: "A fixed amount that repeats every month.",
      footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        variant: "ghost",
        onClick: onClose
      }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
        iconStart: "check",
        onClick: add,
        disabled: !label || !amount
      }, "Add"))
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)'
      }
    }, /*#__PURE__*/React.createElement(Input, {
      label: "Name",
      placeholder: "e.g. Streaming, Insurance\u2026",
      value: label,
      onChange: e => setLabel(e.target.value),
      autoFocus: true
    }), /*#__PURE__*/React.createElement(Input, {
      label: "Amount / month",
      prefix: "RM",
      placeholder: "0.00",
      inputMode: "decimal",
      value: amount,
      onChange: e => setAmount(e.target.value)
    }), cats.length > 0 && /*#__PURE__*/React.createElement(Select, {
      label: "Category",
      value: cat,
      onChange: e => setCat(e.target.value),
      options: cats.map(c => ({
        value: c.key,
        label: c.label
      }))
    })));
  }
  function Header({
    space,
    budget,
    onEditBudget,
    onBack,
    onSettings
  }) {
    const sub = space.kind === 'fund' ? 'Shared balance' : space.kind === 'invest' ? 'AIA · portfolio value' : space.sub || 'This month';
    const val = space.kind === 'fund' ? space.balance : space.kind === 'invest' ? space.value : D.spentOf(space);
    const isSpend = space.kind === 'spend';
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)'
      }
    }, /*#__PURE__*/React.createElement(IconButton, {
      icon: "arrow-left",
      label: "Back",
      variant: "ghost",
      onClick: onBack,
      style: {
        marginLeft: -8
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--font-label)',
        color: 'var(--text-muted)',
        flex: 1
      }
    }, space.name), /*#__PURE__*/React.createElement(IconButton, {
      icon: "settings",
      label: "Space settings",
      variant: "ghost",
      onClick: onSettings
    })), /*#__PURE__*/React.createElement(Card, {
      padding: "lg",
      style: {
        background: isSpend ? 'var(--surface-card)' : 'var(--accent)',
        border: isSpend ? undefined : 'none'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--font-label)',
        color: isSpend ? 'var(--text-muted)' : 'rgba(255,255,255,0.85)'
      }
    }, sub), /*#__PURE__*/React.createElement(Amount, {
      value: val,
      size: "hero",
      style: {
        display: 'block',
        marginTop: 4,
        color: isSpend ? 'var(--sage-700)' : '#fff'
      }
    }), isSpend && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 16
      }
    }, budget ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ProgressBar, {
      value: val,
      max: budget
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginTop: 8,
        font: 'var(--font-caption)',
        color: 'var(--text-muted)'
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: onEditBudget,
      style: {
        border: 'none',
        background: 'none',
        padding: 0,
        cursor: 'pointer',
        font: 'var(--font-caption)',
        color: 'var(--text-muted)',
        textAlign: 'left'
      }
    }, Math.round(val / budget * 100), "% of RM ", budget.toLocaleString(), " budget ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--accent)',
        fontWeight: 'var(--fw-semibold)'
      }
    }, "\xB7 Edit")), /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 'var(--fw-semibold)',
        color: val > budget ? 'var(--money-over)' : 'var(--text-body)',
        whiteSpace: 'nowrap'
      }
    }, val > budget ? 'RM ' + Math.round(val - budget).toLocaleString() + ' over' : 'RM ' + Math.round(budget - val).toLocaleString() + ' left'))) : /*#__PURE__*/React.createElement("button", {
      onClick: onEditBudget,
      style: {
        border: '1.5px dashed var(--border-strong)',
        background: 'none',
        cursor: 'pointer',
        font: 'var(--font-label)',
        color: 'var(--accent)',
        padding: '8px 14px',
        borderRadius: 'var(--radius-md)',
        width: '100%'
      }
    }, "+ Set a monthly budget"))));
  }
  function RecurringPanel({
    space
  }) {
    const isFund = space.kind === 'fund';
    const [rec, setRec] = React.useState(space.recurring || []);
    const [edit, setEdit] = React.useState(false);
    const [dlg, setDlg] = React.useState(false);
    React.useEffect(() => {
      setRec(space.recurring || []);
      setEdit(false);
    }, [space.id]);
    const sum = rec.reduce((a, r) => a + r.amount, 0);
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: '0 4px 8px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--font-caption)',
        fontWeight: 'var(--fw-bold)',
        textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-wide)',
        color: 'var(--text-subtle)'
      }
    }, isFund ? 'How the fund is formed' : 'Monthly commitments'), /*#__PURE__*/React.createElement("button", {
      onClick: () => setEdit(e => !e),
      style: {
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        font: 'var(--font-label)',
        color: 'var(--accent)',
        padding: 4
      }
    }, edit ? 'Done' : 'Edit')), /*#__PURE__*/React.createElement(Card, {
      padding: "sm"
    }, rec.map((r, i) => /*#__PURE__*/React.createElement(ListRow, {
      key: i,
      leading: /*#__PURE__*/React.createElement(CategoryIcon, {
        category: r.cat
      }),
      title: r.label,
      trailing: edit ? /*#__PURE__*/React.createElement(IconButton, {
        icon: "x",
        label: "Remove",
        variant: "ghost",
        size: "sm",
        onClick: () => setRec(x => x.filter((_, j) => j !== i))
      }) : /*#__PURE__*/React.createElement(Amount, {
        value: r.amount,
        kind: isFund ? 'in' : 'neutral',
        showSign: isFund
      }),
      divider: true
    })), edit && /*#__PURE__*/React.createElement(ListRow, {
      leading: /*#__PURE__*/React.createElement("div", {
        style: {
          width: 40,
          height: 40,
          borderRadius: 'var(--radius-md)',
          border: '1.5px dashed var(--border-strong)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)'
        }
      }, "+"),
      title: /*#__PURE__*/React.createElement("span", {
        style: {
          color: 'var(--accent)',
          fontWeight: 'var(--fw-semibold)'
        }
      }, "Add commitment"),
      onClick: () => setDlg(true),
      divider: true
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'var(--space-3)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--font-label)',
        color: 'var(--text-muted)'
      }
    }, isFund ? 'Total contributed' : 'Total / month'), /*#__PURE__*/React.createElement(Amount, {
      value: sum,
      kind: isFund ? 'in' : 'neutral',
      showSign: isFund,
      weight: "var(--fw-extra)"
    }))), /*#__PURE__*/React.createElement(RecurringDialog, {
      open: dlg,
      onClose: () => setDlg(false),
      onAdd: item => setRec(r => [...r, item]),
      cats: space.cats || []
    }));
  }
  function ActivityPanel({
    space,
    cats,
    setCats
  }) {
    const [cat, setCat] = React.useState('all');
    const [edit, setEdit] = React.useState(false);
    const [dlg, setDlg] = React.useState(false);
    let list = space.tx;
    if (cat !== 'all') list = list.filter(t => t.cat === cat);
    const statusTone = s => s === 'paid' ? 'income' : s === 'due' ? 'warning' : 'neutral';
    const removeCat = key => {
      setCats(cs => cs.filter(c => c.key !== key));
      if (cat === key) setCat('all');
    };
    const addCat = label => setCats(cs => [...cs, {
      key: slug(label) || 'cat-' + cs.length,
      label
    }]);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-5)'
      }
    }, (cats.length > 0 || edit) && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: '0 4px 8px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--font-caption)',
        fontWeight: 'var(--fw-bold)',
        textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-wide)',
        color: 'var(--text-subtle)'
      }
    }, "Categories"), /*#__PURE__*/React.createElement("button", {
      onClick: () => setEdit(e => !e),
      style: {
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        font: 'var(--font-label)',
        color: 'var(--accent)',
        padding: 4
      }
    }, edit ? 'Done' : 'Edit')), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        overflowX: 'auto',
        paddingBottom: 2
      }
    }, !edit && /*#__PURE__*/React.createElement(Tag, {
      selected: cat === 'all',
      onClick: () => setCat('all')
    }, "All"), cats.map(c => /*#__PURE__*/React.createElement(Tag, {
      key: c.key,
      selected: !edit && cat === c.key,
      onClick: () => edit ? removeCat(c.key) : setCat(c.key)
    }, /*#__PURE__*/React.createElement(CategoryIcon, {
      category: c.key,
      size: 18,
      radius: "var(--radius-xs)",
      style: {
        marginRight: 4
      }
    }), c.label, edit && /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 6,
        color: 'var(--text-muted)',
        fontWeight: 'var(--fw-bold)'
      }
    }, "\xD7"))), edit && /*#__PURE__*/React.createElement(Tag, {
      onClick: () => setDlg(true)
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--accent)',
        fontWeight: 'var(--fw-semibold)'
      }
    }, "+ Add")))), /*#__PURE__*/React.createElement(Card, {
      padding: "sm"
    }, list.map((t, i) => /*#__PURE__*/React.createElement(ListRow, {
      key: t.id,
      leading: /*#__PURE__*/React.createElement(CategoryIcon, {
        category: t.cat
      }),
      title: t.vendor,
      subtitle: subtitleFor(space, t),
      trailing: /*#__PURE__*/React.createElement(Amount, {
        value: t.amount,
        kind: t.dir === 'in' ? 'in' : 'neutral',
        showSign: t.dir === 'in'
      }),
      meta: t.status ? /*#__PURE__*/React.createElement(Badge, {
        tone: statusTone(t.status),
        dot: true
      }, t.status === 'due' ? 'Due ' + t.date : t.status === 'paid' ? 'Paid' : t.date) : t.date,
      divider: i < list.length - 1
    })), list.length === 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 'var(--space-8)',
        textAlign: 'center',
        font: 'var(--font-body)',
        color: 'var(--text-muted)'
      }
    }, "Nothing here yet.")), /*#__PURE__*/React.createElement(CategoryDialog, {
      open: dlg,
      onClose: () => setDlg(false),
      onAdd: addCat
    }));
  }
  window.SpaceDetailScreen = function SpaceDetailScreen({
    spaceId,
    onBack,
    onSettings
  }) {
    const space = D.space(spaceId);
    const [tab, setTab] = React.useState('activity');
    const [budget, setBudget] = React.useState(space ? space.budget : null);
    const [cats, setCats] = React.useState(space ? space.cats : []);
    const [budgetDlg, setBudgetDlg] = React.useState(false);
    React.useEffect(() => {
      setTab('activity');
      setBudget(space ? space.budget : null);
      setCats(space ? space.cats : []);
    }, [spaceId]);
    if (!space) return null;
    const hasRecurring = space.recurring && space.recurring.length > 0;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-5)'
      }
    }, /*#__PURE__*/React.createElement(Header, {
      space: space,
      budget: budget,
      onEditBudget: () => setBudgetDlg(true),
      onBack: onBack,
      onSettings: () => onSettings(space.id)
    }), hasRecurring ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SegmentedControl, {
      fullWidth: true,
      value: tab,
      onChange: setTab,
      options: [{
        value: 'activity',
        label: 'Activity'
      }, {
        value: 'recurring',
        label: space.kind === 'fund' ? 'Contributions' : 'Recurring'
      }]
    }), tab === 'activity' ? /*#__PURE__*/React.createElement(ActivityPanel, {
      space: space,
      cats: cats,
      setCats: setCats
    }) : /*#__PURE__*/React.createElement(RecurringPanel, {
      space: space
    })) : /*#__PURE__*/React.createElement(ActivityPanel, {
      space: space,
      cats: cats,
      setCats: setCats
    }), /*#__PURE__*/React.createElement(BudgetDialog, {
      open: budgetDlg,
      onClose: () => setBudgetDlg(false),
      value: budget,
      onSave: setBudget,
      spaceName: space.name
    }));
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile/SpaceDetail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile/Spaces.jsx
try { (() => {
// Spaces — the launcher listing every space, grouped Shared / Personal.
(function () {
  const K = window.KiraDesignSystem_c378eb;
  const {
    Card,
    ListRow,
    Amount,
    Icon,
    Avatar,
    Button
  } = K;
  const D = window.SproutData;
  const tile = icon => /*#__PURE__*/React.createElement("span", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 'var(--radius-md)',
      background: 'var(--accent-soft)',
      color: 'var(--accent-soft-fg)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 20
  }));
  function valueFor(s) {
    if (s.kind === 'fund') return {
      v: s.balance,
      label: 'balance'
    };
    if (s.kind === 'invest') return {
      v: s.value,
      label: 'value'
    };
    return {
      v: D.spentOf(s),
      label: 'this month'
    };
  }
  window.SpacesScreen = function SpacesScreen({
    goSpace,
    goPersonal,
    onNewSpace
  }) {
    const shared = D.spaces.filter(s => s.group === 'shared');
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-5)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--font-caption)',
        color: 'var(--text-muted)'
      }
    }, D.monthLabel), /*#__PURE__*/React.createElement("h2", {
      style: {
        font: 'var(--font-h1)',
        color: 'var(--text-strong)',
        margin: '2px 0 0'
      }
    }, "Spaces")), /*#__PURE__*/React.createElement(Button, {
      variant: "soft",
      size: "sm",
      iconStart: "plus",
      onClick: onNewSpace
    }, "New space")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--font-caption)',
        fontWeight: 'var(--fw-bold)',
        textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-wide)',
        color: 'var(--text-subtle)',
        margin: '0 4px 8px'
      }
    }, "Shared"), /*#__PURE__*/React.createElement(Card, {
      padding: "sm"
    }, shared.map((s, i) => {
      const val = valueFor(s);
      const budgeted = s.kind === 'spend' && s.budget;
      const pct = budgeted ? Math.min(100, D.spentOf(s) / s.budget * 100) : 0;
      const over = budgeted && D.spentOf(s) > s.budget;
      const meta = budgeted ? /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 5
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          whiteSpace: 'nowrap',
          color: over ? 'var(--money-over)' : 'var(--text-muted)'
        }
      }, Math.round(D.spentOf(s) / s.budget * 100), "% of RM ", s.budget.toLocaleString()), /*#__PURE__*/React.createElement("span", {
        style: {
          width: 68,
          height: 4,
          borderRadius: 'var(--radius-pill)',
          background: 'var(--neutral-200)',
          overflow: 'hidden',
          display: 'block'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'block',
          height: '100%',
          width: pct + '%',
          borderRadius: 'var(--radius-pill)',
          background: over ? 'var(--money-over)' : 'var(--sage-400)'
        }
      }))) : val.label;
      return /*#__PURE__*/React.createElement(ListRow, {
        key: s.id,
        leading: tile(s.icon),
        title: s.name,
        subtitle: s.sub || `${s.tx.length} entries`,
        trailing: /*#__PURE__*/React.createElement(Amount, {
          value: val.v
        }),
        meta: meta,
        chevron: true,
        onClick: () => goSpace(s.id),
        divider: i < shared.length - 1
      });
    }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--font-caption)',
        fontWeight: 'var(--fw-bold)',
        textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-wide)',
        color: 'var(--text-subtle)',
        margin: '0 4px 8px'
      }
    }, "Personal"), /*#__PURE__*/React.createElement(Card, {
      padding: "sm"
    }, ['jc', 'ch'].map((pid, i) => {
      const p = D.personal[pid];
      const spent = p.tx.filter(t => t.dir === 'out').reduce((a, t) => a + t.amount, 0);
      return /*#__PURE__*/React.createElement(ListRow, {
        key: pid,
        leading: /*#__PURE__*/React.createElement(Avatar, {
          name: p.name,
          size: 40
        }),
        title: `${p.name} · Personal`,
        subtitle: `Income RM ${p.income.toLocaleString()}`,
        trailing: /*#__PURE__*/React.createElement(Amount, {
          value: spent
        }),
        meta: "spent",
        chevron: true,
        onClick: () => goPersonal(pid),
        divider: i === 0
      });
    }))));
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile/Spaces.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile/data.js
try { (() => {
// Sprout sample data — the SPACES model (user-configurable).
// Grounded in the couple's real sheet (RM, JC/CH/Leo, June 2026).
//
// Each space owns: its scoped CATEGORIES and its own generic FIELDS
// (extra info like Store/Vendor + Location). Everything here is data —
// spaces, categories and fields are meant to be added/edited by the user.
(function () {
  const CATS = {
    expenses: [{
      key: 'grocery',
      label: 'Grocery'
    }, {
      key: 'meals',
      label: 'Meals'
    }, {
      key: 'baby',
      label: 'Baby'
    }, {
      key: 'shopping',
      label: 'Shopping'
    }, {
      key: 'other',
      label: 'Other'
    }],
    housing: [{
      key: 'installment',
      label: 'Installment'
    }, {
      key: 'electric',
      label: 'Electric'
    }, {
      key: 'water',
      label: 'Water'
    }, {
      key: 'internet',
      label: 'Internet'
    }, {
      key: 'maintenance',
      label: 'Maintenance'
    }, {
      key: 'furniture',
      label: 'Furniture'
    }, {
      key: 'appliance',
      label: 'Appliance'
    }, {
      key: 'other',
      label: 'Other'
    }],
    car: [{
      key: 'installment',
      label: 'Installment'
    }, {
      key: 'roadtax',
      label: 'Road tax + Insurance'
    }, {
      key: 'maintenance',
      label: 'Maintenance'
    }],
    investment: [{
      key: 'investment',
      label: 'Investment'
    }],
    personal: [{
      key: 'income',
      label: 'Income'
    }, {
      key: 'subscriptions',
      label: 'Subscriptions'
    }, {
      key: 'insurance',
      label: 'Insurance'
    }, {
      key: 'parent',
      label: 'Parent'
    }, {
      key: 'ptptn',
      label: 'PTPTN'
    }, {
      key: 'mobile',
      label: 'Mobile Plan'
    }, {
      key: 'petrol',
      label: 'Petrol'
    }, {
      key: 'house',
      label: 'House'
    }, {
      key: 'joint',
      label: 'Joint Fund'
    }]
  };

  // Generic per-space fields. `primary` field becomes the row title.
  // A field with `options` renders as a dropdown at entry time (+ "Other…").
  const FIELDS = {
    expenses: [{
      key: 'vendor',
      label: 'Store / Vendor',
      type: 'text',
      primary: true,
      placeholder: 'Jaya Grocer'
    }, {
      key: 'location',
      label: 'Location',
      type: 'select',
      options: ['Gurney Plaza', 'Queensbay', 'Aeon · Seberang Jaya', 'Lotus · Bayan Baru', 'Shopee', 'Taobao', 'Online']
    }],
    housing: [{
      key: 'vendor',
      label: 'Bill / Item',
      type: 'text',
      primary: true,
      placeholder: 'Electric Bill'
    }, {
      key: 'provider',
      label: 'Provider',
      type: 'select',
      options: ['TNB', 'PBAPP', 'Time Fibre', 'Maybank', 'Astro']
    }],
    car: [{
      key: 'vendor',
      label: 'Item',
      type: 'text',
      primary: true,
      placeholder: 'Service'
    }, {
      key: 'workshop',
      label: 'Workshop / Station',
      type: 'select',
      options: ['Petronas', 'Shell', 'Perodua SC', 'Toyota SC']
    }],
    investment: [{
      key: 'vendor',
      label: 'Item',
      type: 'text',
      primary: true,
      placeholder: 'Contribution'
    }, {
      key: 'platform',
      label: 'Platform',
      type: 'select',
      options: ['AIA', 'Versa', 'StashAway']
    }],
    joint: [{
      key: 'vendor',
      label: 'Description',
      type: 'text',
      primary: true
    }],
    personal: [{
      key: 'vendor',
      label: 'Payee',
      type: 'text',
      primary: true
    }]
  };
  const spaces = [{
    id: 'expenses',
    name: 'Everyday Expenses',
    short: 'Expenses',
    group: 'shared',
    icon: 'receipt',
    kind: 'spend',
    cats: CATS.expenses,
    fields: FIELDS.expenses,
    budget: 1500,
    tx: [{
      id: 1,
      vendor: 'Jaya Grocer',
      location: 'Gurney Plaza',
      note: 'Grocery, meals',
      cat: 'grocery',
      amount: 218.4,
      date: '14 Jun',
      payer: 'Joint'
    }, {
      id: 2,
      vendor: 'Shopee',
      location: 'Online',
      note: 'Diapers, milk, biscuits',
      cat: 'baby',
      amount: 143.9,
      date: '12 Jun',
      payer: 'CH'
    }, {
      id: 3,
      vendor: 'Aeon',
      location: 'Seberang Jaya',
      note: 'Milk powder, snacks',
      cat: 'grocery',
      amount: 96.3,
      date: '11 Jun',
      payer: 'Joint'
    }, {
      id: 4,
      vendor: 'Bes Kopitiam',
      location: 'Gurney Plaza',
      note: 'Lunch out',
      cat: 'meals',
      amount: 88.0,
      date: '9 Jun',
      payer: 'CH'
    }, {
      id: 5,
      vendor: 'Taobao',
      location: 'Online',
      note: 'Leo shirt, toys',
      cat: 'baby',
      amount: 78.5,
      date: '8 Jun',
      payer: 'CH'
    }, {
      id: 6,
      vendor: 'Lotus',
      location: 'Bayan Baru',
      note: '2 weeks grocery',
      cat: 'grocery',
      amount: 264.2,
      date: '7 Jun',
      payer: 'Joint'
    }, {
      id: 7,
      vendor: 'Jalan Jalan Japan',
      location: 'Queensbay',
      note: 'Leo clothes',
      cat: 'shopping',
      amount: 62.0,
      date: '5 Jun',
      payer: 'CH'
    }]
  }, {
    id: 'housing',
    name: 'Housing',
    short: 'Housing',
    sub: 'TreeO',
    group: 'shared',
    icon: 'home',
    kind: 'spend',
    cats: CATS.housing,
    fields: FIELDS.housing,
    budget: 2100,
    recurring: [{
      label: 'House installment',
      cat: 'installment',
      amount: 1450.0
    }, {
      label: 'Electric (avg)',
      cat: 'electric',
      amount: 180.0
    }, {
      label: 'Water (avg)',
      cat: 'water',
      amount: 60.0
    }, {
      label: 'Internet · Time Fibre',
      cat: 'internet',
      amount: 159.0
    }],
    tx: [{
      id: 1,
      vendor: 'House installment',
      provider: 'Maybank',
      note: 'Monthly',
      cat: 'installment',
      amount: 1450.0,
      date: '1 Jun',
      payer: 'Joint',
      status: 'paid'
    }, {
      id: 2,
      vendor: 'Electric Bill · Jun',
      provider: 'TNB',
      note: '',
      cat: 'electric',
      amount: 186.0,
      date: '28 Jun',
      payer: 'JC',
      status: 'due'
    }, {
      id: 3,
      vendor: 'Water Bill · May–Jun',
      provider: 'PBAPP',
      note: '',
      cat: 'water',
      amount: 62.4,
      date: '30 Jun',
      payer: 'Joint',
      status: 'due'
    }, {
      id: 4,
      vendor: 'Internet',
      provider: 'Time Fibre',
      note: '500 Mbps',
      cat: 'internet',
      amount: 159.0,
      date: '5 Jun',
      payer: 'CH',
      status: 'paid'
    }, {
      id: 5,
      vendor: 'Air Purifier filter',
      provider: 'LG',
      note: 'Replacement',
      cat: 'appliance',
      amount: 120.0,
      date: '6 Jun',
      payer: 'Joint',
      status: 'paid'
    }]
  }, {
    id: 'car',
    name: 'Car',
    short: 'Car',
    group: 'shared',
    icon: 'repeat',
    kind: 'spend',
    cats: CATS.car,
    fields: FIELDS.car,
    budget: 800,
    recurring: [{
      label: 'Myvi installment',
      cat: 'installment',
      amount: 545.0
    }, {
      label: 'Road tax + insurance (monthly)',
      cat: 'roadtax',
      amount: 120.0
    }],
    tx: [{
      id: 1,
      vendor: 'Myvi loan · PQC 9059',
      workshop: 'Maybank',
      note: 'Monthly installment',
      cat: 'installment',
      amount: 545.0,
      date: '10 Jun',
      payer: 'JC',
      status: 'paid'
    }, {
      id: 2,
      vendor: 'Alza service',
      workshop: 'Perodua SC',
      note: 'Maintenance',
      cat: 'maintenance',
      amount: 235.0,
      date: '18 Jun',
      payer: 'JC',
      status: 'paid'
    }]
  }, {
    id: 'investment',
    name: 'Investment',
    short: 'Invest',
    sub: 'AIA',
    group: 'shared',
    icon: 'trending-up',
    kind: 'invest',
    cats: CATS.investment,
    fields: FIELDS.investment,
    value: 12480.0,
    recurring: [{
      label: 'AIA monthly contribution',
      cat: 'investment',
      amount: 300.0
    }],
    tx: [{
      id: 1,
      vendor: 'AIA contribution',
      platform: 'AIA',
      note: 'Monthly',
      cat: 'investment',
      amount: 300.0,
      date: '15 Jun',
      payer: 'Joint',
      status: 'paid'
    }]
  }, {
    id: 'joint',
    name: 'Joint Fund',
    short: 'Joint',
    group: 'shared',
    icon: 'wallet',
    kind: 'fund',
    cats: [],
    fields: FIELDS.joint,
    balance: 8420.0,
    carry: 2100.0,
    recurring: [{
      label: 'Carry forward from 2025',
      cat: 'joint',
      amount: 2100.0
    }, {
      label: 'JC monthly contribution',
      cat: 'joint',
      amount: 1500.0
    }, {
      label: 'CH monthly contribution',
      cat: 'joint',
      amount: 1500.0
    }],
    tx: [{
      id: 1,
      vendor: 'JC contribution',
      note: 'Monthly top-up',
      cat: 'joint',
      amount: 1500.0,
      date: '1 Jun',
      payer: 'JC',
      dir: 'in'
    }, {
      id: 2,
      vendor: 'CH contribution',
      note: 'Monthly top-up',
      cat: 'joint',
      amount: 1500.0,
      date: '1 Jun',
      payer: 'CH',
      dir: 'in'
    }, {
      id: 3,
      vendor: 'House installment',
      note: 'Paid from fund',
      cat: 'house',
      amount: 1450.0,
      date: '1 Jun',
      payer: 'Joint',
      dir: 'out'
    }, {
      id: 4,
      vendor: 'Groceries (Lotus)',
      note: 'Paid from fund',
      cat: 'grocery',
      amount: 264.2,
      date: '7 Jun',
      payer: 'Joint',
      dir: 'out'
    }]
  }];
  const personal = {
    jc: {
      id: 'jc',
      name: 'JC',
      group: 'personal',
      cats: CATS.personal,
      fields: FIELDS.personal,
      income: 6117.0,
      tx: [{
        id: 1,
        vendor: 'Nett Salary',
        note: 'June',
        cat: 'income',
        amount: 6117.0,
        date: '25 Jun',
        dir: 'in'
      }, {
        id: 2,
        vendor: 'Joint Fund',
        note: 'Monthly top-up',
        cat: 'joint',
        amount: 1500.0,
        date: '1 Jun',
        dir: 'out'
      }, {
        id: 3,
        vendor: 'AIA',
        note: 'Insurance',
        cat: 'insurance',
        amount: 220.0,
        date: '18 Jun',
        dir: 'out'
      }, {
        id: 4,
        vendor: 'PTPTN',
        note: 'Study loan',
        cat: 'ptptn',
        amount: 220.0,
        date: '12 Jun',
        dir: 'out'
      }, {
        id: 5,
        vendor: 'Google AI Pro',
        note: 'Subscription',
        cat: 'subscriptions',
        amount: 97.0,
        date: '20 Jun',
        dir: 'out'
      }, {
        id: 6,
        vendor: 'YouTube Premium',
        note: 'Subscription',
        cat: 'subscriptions',
        amount: 17.9,
        date: '12 Jun',
        dir: 'out'
      }, {
        id: 7,
        vendor: 'Petronas',
        note: 'Petrol',
        cat: 'petrol',
        amount: 235.0,
        date: '10 Jun',
        dir: 'out'
      }, {
        id: 8,
        vendor: 'Hotlink',
        note: 'Mobile plan',
        cat: 'mobile',
        amount: 30.0,
        date: '8 Jun',
        dir: 'out'
      }, {
        id: 9,
        vendor: 'Parents',
        note: 'Monthly',
        cat: 'parent',
        amount: 500.0,
        date: '5 Jun',
        dir: 'out'
      }]
    },
    ch: {
      id: 'ch',
      name: 'CH',
      group: 'personal',
      cats: CATS.personal,
      fields: FIELDS.personal,
      income: 6600.0,
      tx: [{
        id: 1,
        vendor: 'Nett Salary',
        note: 'June',
        cat: 'income',
        amount: 6600.0,
        date: '25 Jun',
        dir: 'in'
      }, {
        id: 2,
        vendor: 'Joint Fund',
        note: 'Monthly top-up',
        cat: 'joint',
        amount: 1500.0,
        date: '1 Jun',
        dir: 'out'
      }, {
        id: 3,
        vendor: 'Allianz',
        note: 'Insurance',
        cat: 'insurance',
        amount: 180.0,
        date: '18 Jun',
        dir: 'out'
      }, {
        id: 4,
        vendor: 'Apple One',
        note: 'Subscription',
        cat: 'subscriptions',
        amount: 34.9,
        date: '14 Jun',
        dir: 'out'
      }, {
        id: 5,
        vendor: 'Sinaran Rental',
        note: 'House',
        cat: 'house',
        amount: 450.0,
        date: '3 Jun',
        dir: 'out'
      }, {
        id: 6,
        vendor: 'Hotlink',
        note: 'Mobile plan',
        cat: 'mobile',
        amount: 30.0,
        date: '8 Jun',
        dir: 'out'
      }, {
        id: 7,
        vendor: 'Parents',
        note: 'Monthly',
        cat: 'parent',
        amount: 300.0,
        date: '5 Jun',
        dir: 'out'
      }]
    }
  };

  // 6-month spend history (Everyday + Housing + Car) for Reports.
  const history = [{
    m: 'Jan',
    v: 4310
  }, {
    m: 'Feb',
    v: 3980
  }, {
    m: 'Mar',
    v: 4620
  }, {
    m: 'Apr',
    v: 4180
  }, {
    m: 'May',
    v: 4980
  }, {
    m: 'Jun',
    v: 3708.7
  }];

  // Icon choices offered when creating a new space.
  const spaceIcons = ['receipt', 'home', 'repeat', 'trending-up', 'wallet', 'target', 'pie-chart', 'banknote', 'credit-card', 'tag'];
  const spentOf = sp => sp.tx.filter(t => t.dir !== 'in').reduce((s, t) => s + (t.dir === 'out' && sp.kind === 'fund' ? 0 : t.amount), 0);
  const domainSpend = ['expenses', 'housing', 'car'].reduce((s, id) => s + spentOf(spaces.find(x => x.id === id)), 0);
  const totalBudget = ['expenses', 'housing', 'car'].reduce((s, id) => s + (spaces.find(x => x.id === id).budget || 0), 0);

  // Reports helpers ----------------------------------------------------------
  function spendByPerson() {
    const out = {
      JC: 0,
      CH: 0,
      Joint: 0
    };
    ['expenses', 'housing', 'car'].forEach(id => {
      spaces.find(s => s.id === id).tx.forEach(t => {
        if (out[t.payer] != null) out[t.payer] += t.amount;
      });
    });
    return out;
  }
  function spendBySpace() {
    return ['expenses', 'housing', 'car'].map(id => {
      const s = spaces.find(x => x.id === id);
      return {
        id,
        name: s.name,
        short: s.short,
        icon: s.icon,
        value: spentOf(s)
      };
    });
  }
  function topCategories() {
    const agg = {};
    ['expenses', 'housing', 'car'].forEach(id => {
      const s = spaces.find(x => x.id === id);
      s.tx.forEach(t => {
        const label = (s.cats.find(c => c.key === t.cat) || {}).label || t.cat;
        const k = t.cat + '|' + label;
        agg[k] = (agg[k] || 0) + t.amount;
      });
    });
    return Object.entries(agg).map(([k, v]) => ({
      cat: k.split('|')[0],
      label: k.split('|')[1],
      value: v
    })).sort((a, b) => b.value - a.value).slice(0, 5);
  }
  window.SproutData = {
    monthLabel: 'June 2026',
    budget: totalBudget,
    lastMonthSpend: 4980,
    totalSpent: domainSpend,
    spaces,
    personal,
    history,
    spaceIcons,
    spentOf,
    space: id => spaces.find(s => s.id === id),
    spendByPerson,
    spendBySpace,
    topCategories,
    // generic: secondary (non-primary) fields of a space, for row subtitles
    secondaryFields: sp => (sp.fields || []).filter(f => !f.primary)
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile/data.js", error: String((e && e.message) || e) }); }

__ds_ns.Amount = __ds_scope.Amount;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.CategoryIcon = __ds_scope.CategoryIcon;

__ds_ns.ListRow = __ds_scope.ListRow;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.SegmentedControl = __ds_scope.SegmentedControl;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
