// Formatting helpers — money parts, month labels, short display dates.
// Kept free of DOM/React so selectors and tests can use them directly.

const MONTHS_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export interface MoneyParts {
  /** Currency symbol/label, e.g. "RM". */
  symbol: string;
  /** Sign prefix: "", "+" or "−" (minus glyph, not hyphen). */
  sign: string;
  /** Grouped whole part, e.g. "4,182". */
  whole: string;
  /** Fractional part without the dot, e.g. "50" (empty when decimals === 0). */
  decimals: string;
}

/**
 * Break a number into the parts the Amount component renders. `showSign`
 * yields "+" for positive, "−" for negative; otherwise only negatives get "−".
 */
export function formatMoneyParts(
  value: number,
  opts: { currency?: string; decimals?: number; showSign?: boolean } = {},
): MoneyParts {
  const { currency = 'RM', decimals = 2, showSign = false } = opts;
  const abs = Math.abs(value);
  const [whole, frac = ''] = abs
    .toLocaleString('en-MY', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
    .split('.');
  const sign = value < 0 ? '−' : showSign && value > 0 ? '+' : '';
  return { symbol: currency, sign, whole, decimals: frac };
}

/** Flat string form, e.g. "RM 4,182.50". */
export function formatMoney(
  value: number,
  opts: { currency?: string; decimals?: number; showSign?: boolean } = {},
): string {
  const p = formatMoneyParts(value, opts);
  const num = p.decimals ? `${p.whole}.${p.decimals}` : p.whole;
  return `${p.sign}${p.symbol} ${num}`;
}

/** Extract yyyy-mm from an ISO date (yyyy-mm or yyyy-mm-dd). */
export function monthKey(iso: string): string {
  return iso.slice(0, 7);
}

/** "June 2026" from an ISO date (yyyy-mm or yyyy-mm-dd). */
export function monthLabel(iso: string): string {
  const [y, m] = iso.split('-');
  const idx = Number(m) - 1;
  return `${MONTHS_LONG[idx] ?? m} ${y}`;
}

/** Three-letter month label ("Jan"…"Dec") from an ISO date. */
export function monthShort(iso: string): string {
  const idx = Number(iso.split('-')[1]) - 1;
  return MONTHS_SHORT[idx] ?? '';
}

/**
 * Short display date: "Today" when it matches `todayIso`, else "14 Jun".
 * `todayIso` defaults to the local calendar day.
 */
export function shortDate(iso: string, todayIso: string = isoToday()): string {
  if (monthKey(iso) === monthKey(todayIso) && iso.slice(0, 10) === todayIso) {
    return 'Today';
  }
  const [, m, d] = iso.split('-');
  return `${Number(d)} ${MONTHS_SHORT[Number(m) - 1] ?? ''}`.trim();
}

/** Local calendar day as yyyy-mm-dd. */
export function isoToday(d: Date = new Date()): string {
  return isoDate(d);
}

/** yyyy-mm-dd for a Date, using local calendar fields (TZ-stable). */
export function isoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** yyyy-mm for a Date. */
export function isoMonth(d: Date): string {
  return isoDate(d).slice(0, 7);
}
