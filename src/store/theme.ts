// Theme helpers — apply the stored theme to <html data-theme> and toggle it.
import type { Theme } from '../domain/types';

/** Reflect a theme onto the document root (light is the default). */
export function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.theme = theme;
}

/** Initialize from stored settings, honoring the persisted value. */
export function initTheme(theme: Theme | undefined): Theme {
  const resolved: Theme = theme === 'dark' ? 'dark' : 'light';
  applyTheme(resolved);
  return resolved;
}

/** Opposite of the given theme. */
export function nextTheme(theme: Theme): Theme {
  return theme === 'dark' ? 'light' : 'dark';
}
