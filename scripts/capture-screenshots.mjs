/**
 * Capture real app screenshots for the README.
 * Requires: npm run dev (or BASE_URL=https://tabakpp.web.app)
 *
 * Optional: SCREENSHOT_EMAIL, SCREENSHOT_PASSWORD for authenticated views
 */
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'screenshots');
const chromePath = join(
  root,
  '.browsers/chrome/win64-150.0.7871.24/chrome-win64/chrome.exe'
);

const baseUrl = (process.env.BASE_URL || 'http://localhost:5173').replace(/\/$/, '');
const demoEmail = process.env.SCREENSHOT_EMAIL || 'tabakpp.readme.screenshots@test.com';
const demoPassword = process.env.SCREENSHOT_PASSWORD || 'TabakppReadme2026!';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

mkdirSync(outDir, { recursive: true });

async function setInputByPlaceholder(page, placeholder, value) {
  await page.waitForSelector(`input[placeholder="${placeholder}"]`, { timeout: 15000 });
  await page.evaluate(
    (ph, val) => {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
      const input = document.querySelector(`input[placeholder="${ph}"]`);
      if (!input || !setter) throw new Error(`Input not found: ${ph}`);
      setter.call(input, val);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    },
    placeholder,
    value
  );
}

async function setReactInput(page, labelText, value) {
  await page.waitForFunction(
    (label) =>
      [...document.querySelectorAll('label')].some(
        (el) => el.textContent?.trim().toLowerCase() === label.toLowerCase()
      ),
    { timeout: 15000 },
    labelText
  );
  await page.evaluate(
    (label, val) => {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
      const labels = [...document.querySelectorAll('label')];
      const match = labels.find((el) => el.textContent?.trim().toLowerCase() === label.toLowerCase());
      const input =
        (match?.htmlFor && document.getElementById(match.htmlFor)) ||
        match?.parentElement?.querySelector('input');
      if (!input || !setter) throw new Error(`Input not found: ${label}`);
      setter.call(input, val);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    },
    labelText,
    value
  );
}

async function clickButtonWithText(page, text) {
  const clicked = await page.evaluate((needle) => {
    const btn = [...document.querySelectorAll('button')].find((b) =>
      b.textContent?.trim().includes(needle)
    );
    if (!btn) return false;
    btn.click();
    return true;
  }, text);
  if (!clicked) throw new Error(`Button not found: ${text}`);
}

async function isAuthenticated(page) {
  return page.evaluate(
    () =>
      Boolean(document.querySelector('[data-testid="tracker-card-0"]')) ||
      [...document.querySelectorAll('button')].some((b) => b.textContent?.includes('Init Node'))
  );
}

async function ensureDemoSession(page) {
  if (await isAuthenticated(page)) return;

  await clickButtonWithText(page, 'Sign in');
  await delay(400);
  await setReactInput(page, 'Email', demoEmail);
  await setReactInput(page, 'Password', demoPassword);
  await page.click('button[type="submit"]');
  await delay(5000);

  if (!(await isAuthenticated(page))) {
    await clickButtonWithText(page, 'Sign up');
    await delay(400);
    await setReactInput(page, 'Name', 'Readme Demo');
    await setReactInput(page, 'Email', demoEmail);
    await setReactInput(page, 'Password', demoPassword);
    await page.click('button[type="submit"]');
    await delay(6000);
  }

  await page.waitForFunction(
    () =>
      document.querySelector('[data-testid="tracker-card-0"]') ||
      [...document.querySelectorAll('button')].some((b) => b.textContent?.includes('Init Node')),
    { timeout: 45000 }
  );

  const needsProtocol = await page.evaluate(
    () => [...document.querySelectorAll('button')].some((b) => b.textContent?.includes('Init Node'))
  );
  if (needsProtocol) {
    await clickButtonWithText(page, 'Init Node');
    await setInputByPlaceholder(page, 'e.g. Marlboro Red', 'Marlboro Red');
    await clickButtonWithText(page, 'Init Entry');
    await delay(3000);
  }
}

const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const page = await browser.newPage();

// Auth screen (unauthenticated)
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle2', timeout: 90000 });
await page.waitForSelector('.auth-screen', { timeout: 20000 });
await delay(1500);
await page.screenshot({ path: join(outDir, 'app.png') });
console.log('Saved public/screenshots/app.png');

// Authenticated views
await ensureDemoSession(page);

const authenticatedShots = [
  { name: 'track.png', path: '/track', width: 1280, height: 900, wait: 2500 },
  { name: 'history.png', path: '/history', width: 1280, height: 900, wait: 3000 },
  { name: 'settings.png', path: '/settings', width: 390, height: 844, wait: 2500 },
];

for (const shot of authenticatedShots) {
  await page.setViewport({ width: shot.width, height: shot.height, deviceScaleFactor: 2 });
  await page.goto(`${baseUrl}${shot.path}`, { waitUntil: 'networkidle2', timeout: 90000 });
  await delay(shot.wait);
  await page.screenshot({ path: join(outDir, shot.name) });
  console.log(`Saved public/screenshots/${shot.name}`);
}

await browser.close();
console.log('Done — real app screenshots captured.');
