// Legacy emoji → Lucide icon-name migration.
//
// Categories used to carry an optional `emoji?: string` glyph; they now carry an
// optional `icon?: string` holding a design-system Icon (Lucide) name. Users may
// still have categories persisted with the old `emoji` field (IndexedDB via
// Dexie, and Supabase remote), so anything read from persistence is normalized
// through `migrateLegacyCategory` before it reaches the store.

import type { Category } from './types';

// Curated mapping of the old emoji glyphs to icon names. Keys are the glyphs as
// originally authored (several include a U+FE0F variation selector); variation-
// selector-free variants are registered below so both forms match.
const BASE_EMOJI_TO_ICON: Record<string, string> = {
  '🏠': 'home',
  '🛒': 'shopping-cart',
  '🍽️': 'utensils',
  '🍜': 'soup',
  '🚗': 'car',
  '👶': 'baby',
  '⚡': 'zap',
  '💧': 'droplet',
  '🌐': 'globe',
  '🧾': 'receipt',
  '🛍️': 'shopping-bag',
  '💊': 'pill',
  '🌱': 'sprout',
  '💵': 'banknote',
  '📱': 'smartphone',
  '🎬': 'film',
  '✈️': 'plane',
  '🎁': 'gift',
  '🐾': 'paw-print',
  '📚': 'book-open',
  '🔧': 'wrench',
  '☕': 'coffee',
  '🏥': 'cross',
};

/** U+FE0F variation selector — stripped so both presentation forms match. */
const VARIATION_SELECTOR = /️/g;

/**
 * Emoji → icon-name lookup. Includes both the original glyphs and their
 * variation-selector-free variants so either persisted form resolves.
 */
export const EMOJI_TO_ICON: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (const [glyph, icon] of Object.entries(BASE_EMOJI_TO_ICON)) {
    map[glyph] = icon;
    const bare = glyph.replace(VARIATION_SELECTOR, '');
    if (bare !== glyph) map[bare] = icon;
  }
  return map;
})();

/** Resolve a legacy emoji glyph to an icon name, matching both VS forms. */
function iconForEmoji(emoji: string): string | undefined {
  return EMOJI_TO_ICON[emoji] ?? EMOJI_TO_ICON[emoji.replace(VARIATION_SELECTOR, '')];
}

/**
 * Normalize a possibly-legacy category read from persistence to the icon world.
 *
 * - If `icon` is already set, it wins — return the category with any stray
 *   `emoji` field dropped.
 * - Else if a legacy `emoji` maps to an icon, return it as `icon`.
 * - Else drop the emoji entirely (unknown glyph → keyed / neutral fallback).
 *
 * An `emoji` key never survives on the returned object.
 */
export function migrateLegacyCategory(c: Category & { emoji?: string }): Category {
  const { emoji, ...rest } = c;
  if (rest.icon) return rest;
  if (emoji) {
    const mapped = iconForEmoji(emoji);
    if (mapped) return { ...rest, icon: mapped };
  }
  return rest;
}
