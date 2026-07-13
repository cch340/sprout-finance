// Rasterize the Sprout icon SVG into PWA PNG icons using Playwright/Chromium.
// Produces: public/pwa-192.png, pwa-512.png, maskable-512.png, apple-touch-icon.png
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pub = resolve(root, 'public');

// The leaf mark group (from sprout-icon.svg), rendered on a sage tile.
const mark = `
  <g transform="translate(30 30) scale(1.25)">
    <rect x="6" y="30" width="8" height="12" rx="4" fill="#ffffff" fill-opacity="0.55"></rect>
    <rect x="19" y="23" width="8" height="19" rx="4" fill="#ffffff" fill-opacity="0.8"></rect>
    <rect x="32" y="17" width="8" height="25" rx="4" fill="#ffffff"></rect>
    <path d="M36 18 C28 19 25 11 26 6 C33 6 37 12 36 18 Z" fill="#ffffff"></path>
    <path d="M36 18 C44 19 47 11 46 6 C39 6 35 12 36 18 Z" fill="#ffffff" fill-opacity="0.75"></path>
  </g>`;

// Rounded-corner icon (regular). viewBox 120, rx 30.
const rounded = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
  <rect width="120" height="120" rx="30" fill="#4F8A6B"></rect>${mark}</svg>`;

// Maskable: full-bleed sage square (no rounded corners), mark within ~72% safe zone.
// Scale the 120-box mark down to 0.72 and center it (offset ~16.8 on each axis).
const maskable = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
  <rect width="120" height="120" fill="#4F8A6B"></rect>
  <g transform="translate(16.8 16.8) scale(0.72)">${
    '<rect width="120" height="120" rx="30" fill="#4F8A6B"></rect>' + mark
  }</g></svg>`;

async function shot(page, svg, size, out) {
  const dataUrl = 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
  await page.setViewportSize({ width: size, height: size });
  await page.goto(
    'data:text/html,' +
      encodeURIComponent(
        `<style>*{margin:0;padding:0}img{display:block;width:${size}px;height:${size}px}</style><img src="${dataUrl}">`,
      ),
  );
  const buf = await page.screenshot({ omitBackground: true });
  await writeFile(resolve(pub, out), buf);
  console.log('wrote', out, size);
}

const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM,
});
const page = await browser.newPage({ deviceScaleFactor: 1 });
await mkdir(pub, { recursive: true });
await shot(page, rounded, 192, 'pwa-192.png');
await shot(page, rounded, 512, 'pwa-512.png');
await shot(page, maskable, 512, 'maskable-512.png');
await shot(page, rounded, 180, 'apple-touch-icon.png');
await browser.close();
