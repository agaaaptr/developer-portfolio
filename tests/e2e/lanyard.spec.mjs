import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import jsQR from 'jsqr';
import sharp from 'sharp';

const destination = 'https://aga-putra.vercel.app/links';
const projects = JSON.parse(readFileSync(new URL('../../src/data/projects.json', import.meta.url), 'utf8'));
const personal = JSON.parse(readFileSync(new URL('../../src/data/personal.json', import.meta.url), 'utf8'));

async function openHero(page) {
  await page.goto('/');
  await expect(page.locator('#home canvas[data-engine]')).toHaveClass(/opacity-100/);
  await expect(page.locator('[data-lanyard-hit-area]')).toBeVisible();
  await page.waitForTimeout(900);
}

async function scrollToHeroTop(page) {
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(150);
}

async function decodeVisibleBadge(page) {
  const box = await page.locator('[data-lanyard-hit-area]').boundingBox();
  if (!box) return null;
  const viewport = page.viewportSize();
  const x = Math.max(0, box.x);
  const y = Math.max(0, box.y);
  const width = Math.min(viewport.width, box.x + box.width) - x;
  const height = Math.min(viewport.height, box.y + box.height) - y;
  if (width <= 0 || height <= 0) return null;
  const screenshot = await page.screenshot({ clip: { x, y, width, height }, scale: 'device' });
  const { data, info } = await sharp(screenshot).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const pixels = new Uint8ClampedArray(data.buffer, data.byteOffset, data.byteLength);
  return jsQR(pixels, info.width, info.height)?.data ?? null;
}

async function clickBadge(page) {
  const box = await page.locator('[data-lanyard-hit-area]').boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
}

test('hero overlay preserves navigation and shows the complete interactive badge', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.addInitScript(() => {
    window.__lanyardFallbackSeen = false;
    new MutationObserver(() => {
      if (document.querySelector('[data-lanyard-fallback]')) window.__lanyardFallbackSeen = true;
    }).observe(document, { childList: true, subtree: true });
  });
  await openHero(page);
  const layout = await page.evaluate(() => {
    const hero = document.querySelector('#home').getBoundingClientRect();
    const overlay = document.querySelector('[data-lanyard-overlay]').getBoundingClientRect();
    return {
      hero: { x: hero.x, y: hero.y, width: hero.width, height: hero.height },
      overlay: { x: overlay.x, y: overlay.y, width: overlay.width, height: overlay.height },
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    };
  });
  expect(layout.overlay).toEqual(layout.hero);
  expect(layout.overflow).toBe(false);
  expect(await page.evaluate(() => window.__lanyardFallbackSeen)).toBe(false);
  await expect(page.locator('[data-lanyard-hint] button')).toHaveCount(0);
  await page.getByRole('button', { name: 'Download CV or portfolio' }).click();
  await expect(page.getByRole('link', { name: /English CV/ })).toBeVisible();
  expect(errors).toEqual([]);
});

test('manual flip exposes a rendered QR that decodes to the link hub', async ({ page }, testInfo) => {
  await openHero(page);
  await scrollToHeroTop(page);
  await testInfo.attach('lanyard-front', { body: await page.screenshot(), contentType: 'image/png' });
  await clickBadge(page);
  await expect(page.locator('[data-lanyard-hit-area]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('link', { name: 'Open link hub without scanning', includeHidden: true })).toHaveAttribute('href', '/links');
  await expect.poll(() => decodeVisibleBadge(page), { timeout: 10_000, intervals: [500, 1000] }).toBe(destination);
  await testInfo.attach('lanyard-qr-back', { body: await page.screenshot(), contentType: 'image/png' });
  if (page.viewportSize().height < 500) {
    const box = await page.locator('[data-lanyard-hit-area]').boundingBox();
    expect(box.y + box.height).toBeLessThanOrEqual(page.viewportSize().height);
  }
});

test('site navigation stays operable above the lanyard when its mobile menu opens', async ({ page }) => {
  await openHero(page);
  if (page.viewportSize().width < 1024) {
    const toggle = page.getByRole('button', { name: 'Toggle navigation' });
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await page.locator('#mobile-navigation').getByRole('button', { name: /contact/i }).click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  } else {
    await page.locator('header').getByRole('button', { name: /work/i }).click();
  }
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
});

test('the navbar remains above the badge when they overlap', async ({ page }) => {
  await openHero(page);
  await scrollToHeroTop(page);
  const hit = page.locator('[data-lanyard-hit-area]');
  const badge = await hit.boundingBox();
  const navbar = await page.locator('header nav').boundingBox();
  const x = navbar.x + navbar.width / 2;
  const y = navbar.y + navbar.height / 2;
  await page.mouse.move(badge.x + badge.width / 2, badge.y + badge.height / 2);
  await page.mouse.down();
  await page.mouse.move(x, y, { steps: 12 });
  await page.waitForTimeout(150);
  const moved = await hit.boundingBox();
  expect(moved.x).toBeLessThan(navbar.x + navbar.width);
  expect(moved.x + moved.width).toBeGreaterThan(navbar.x);
  expect(moved.y).toBeLessThan(navbar.y + navbar.height);
  expect(moved.y + moved.height).toBeGreaterThan(navbar.y);
  expect(await page.evaluate(({ x, y }) => Boolean(document.elementFromPoint(x, y)?.closest('header')), { x, y })).toBe(true);
  await page.mouse.up();
});

test('pointer capture keeps dragging beyond the viewport in multiple directions', async ({ page }) => {
  await openHero(page);
  await scrollToHeroTop(page);
  const hit = page.locator('[data-lanyard-hit-area]');
  const badge = await hit.boundingBox();
  const viewport = page.viewportSize();
  await page.mouse.move(badge.x + badge.width / 2, badge.y + badge.height / 2);
  await page.mouse.down();
  for (const point of [
    { x: -120, y: viewport.height / 2 },
    { x: viewport.width + 120, y: viewport.height + 120 },
    { x: viewport.width / 2, y: -120 },
  ]) {
    await page.mouse.move(point.x, point.y, { steps: 12 });
    await page.waitForTimeout(100);
    const moved = await hit.boundingBox();
    expect(Math.abs(moved.x + moved.width / 2 - point.x)).toBeLessThan(80);
    expect(Math.abs(moved.y + moved.height / 2 - point.y)).toBeLessThan(80);
  }
  await page.mouse.up();
});

test('clicking the badge flips it and dragging does not trigger a flip', async ({ page }) => {
  await openHero(page);
  await scrollToHeroTop(page);
  const hit = page.locator('[data-lanyard-hit-area]');
  await expect(hit).toBeVisible();
  const hint = await page.locator('[data-lanyard-hint]').boundingBox();
  await clickBadge(page);
  await expect(hit).toHaveAttribute('aria-pressed', 'true');
  await page.waitForTimeout(1000);
  expect((await page.locator('[data-lanyard-hint]').boundingBox()).height).toBe(hint.height);
  const second = await hit.boundingBox();
  await page.mouse.move(second.x + second.width / 2, second.y + second.height / 2);
  await page.mouse.down();
  await page.mouse.move(second.x + second.width / 2 + 60, second.y + second.height / 2, { steps: 8 });
  await page.waitForTimeout(100);
  await page.mouse.up();
  await expect(hit).toHaveAttribute('aria-pressed', 'true');
  await expect.poll(async () => Math.abs((await hit.boundingBox()).x - second.x)).toBeGreaterThan(10);
});

test('touch tap and vertical drag work without disabling page scrolling', async ({ page }, testInfo) => {
  test.skip(!testInfo.project.use.hasTouch, 'This viewport does not emulate touch.');
  await openHero(page);
  await scrollToHeroTop(page);
  const hit = page.locator('[data-lanyard-hit-area]');
  const initial = await hit.boundingBox();
  await page.touchscreen.tap(initial.x + initial.width / 2, initial.y + initial.height / 2);
  await expect(hit).toHaveAttribute('aria-pressed', 'true');
  await page.waitForTimeout(1000);
  const box = await hit.boundingBox();
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y + 60 }] });
  await page.waitForTimeout(100);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect(hit).toHaveAttribute('aria-pressed', 'true');
  await expect.poll(async () => Math.abs((await hit.boundingBox()).y - box.y)).toBeGreaterThan(10);
  await cdp.send('Input.synthesizeScrollGesture', {
    x: 10,
    y: Math.min(300, page.viewportSize().height - 20),
    yDistance: -250,
    gestureSourceType: 'touch',
  });
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  await cdp.detach();
});

test('reduced motion retains manual flip and link access', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openHero(page);
  await expect(page.getByText('Motion reduced. Tap the badge to see the QR.')).toBeVisible();
  const hit = page.locator('[data-lanyard-hit-area]');
  await hit.focus();
  await page.keyboard.press('Enter');
  await expect(hit).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('link', { name: 'Open link hub without scanning', includeHidden: true })).toHaveAttribute('href', '/links');
  await page.keyboard.press('Space');
  await expect(hit).toHaveAttribute('aria-pressed', 'false');
});

test('keyboard focus remains on the badge throughout an animated flip', async ({ page }) => {
  await openHero(page);
  const hit = page.locator('[data-lanyard-hit-area]');
  await hit.focus();
  await page.keyboard.press('Enter');
  await expect(hit).toHaveAttribute('aria-pressed', 'true');
  await page.waitForTimeout(1200);
  await expect(hit).toBeFocused();
  await page.keyboard.press('Space');
  await expect(hit).toHaveAttribute('aria-pressed', 'false');
});

test('a WebGL failure leaves a usable two-sided fallback', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') return null;
      return original.call(this, type, ...args);
    };
  });
  await page.goto('/');
  await expect(page.getByText('3D preview unavailable. Tap the static badge to flip it.')).toBeVisible();
  const fallback = page.locator('[data-lanyard-fallback]');
  await fallback.click();
  await expect(fallback).toHaveAttribute('aria-pressed', 'true');
  await expect(fallback.locator('img[src="/images/qr-links.png"]')).toBeVisible();
});

test('missing portrait and QR assets show explicit fallbacks', async ({ page }) => {
  await page.route(`**${personal.profileImage}`, (route) => route.abort());
  await page.route('**/images/qr-links.png', (route) => route.abort());
  await page.goto('/');
  await expect(page.getByText('Profile photo unavailable. Showing initials.')).toBeVisible();
  await expect(page.getByText('QR unavailable. Use the link hub below.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open link hub without scanning' })).toBeVisible();
});

test('idle hints are brief and manually opening the back pauses them', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'The same timing controller is shared by all viewport sizes.');
  await openHero(page);
  const hit = page.locator('[data-lanyard-hit-area]');
  await expect(hit).toHaveAttribute('aria-pressed', 'true', { timeout: 12_000 });
  const hintStarted = Date.now();
  await expect(hit).toHaveAttribute('aria-pressed', 'false', { timeout: 4_000 });
  expect(Date.now() - hintStarted).toBeGreaterThanOrEqual(900);
  await clickBadge(page);
  await expect(hit).toHaveAttribute('aria-pressed', 'true');
  await page.waitForTimeout(9_000);
  await expect(hit).toHaveAttribute('aria-pressed', 'true');
});

test('links and project routes remain available and the link hub has no site chrome', async ({ page }) => {
  await page.goto('/links');
  await expect(page.getByRole('link', { name: /GitHub/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /LinkedIn/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Instagram/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /WhatsApp/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Email/i })).toBeVisible();
  await expect(page.locator('header nav')).toHaveCount(0);
  await page.goto('/project/all');
  await expect(page.locator('main')).toBeVisible();
  await page.goto(`/project/${projects[0].slug}`);
  await expect(page.locator('main')).toBeVisible();
});
