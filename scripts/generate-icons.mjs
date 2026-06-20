/**
 * Generate PWA PNG icons from public/favicon.svg
 */
import puppeteer from 'puppeteer-core';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const svgPath = join(root, 'public', 'favicon.svg');
const chromePath = join(
  root,
  '.browsers/chrome/win64-150.0.7871.24/chrome-win64/chrome.exe'
);

const svg = readFileSync(svgPath, 'utf8');

async function generate(size, outPath) {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
  const html = `<!DOCTYPE html><html><body style="margin:0;padding:0;width:${size}px;height:${size}px;background:#09090B;">${svg.replace(
    '<svg',
    `<svg width="${size}" height="${size}"`
  )}</body></html>`;
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: outPath, type: 'png' });
  await browser.close();
  console.log(`Wrote ${outPath}`);
}

await generate(192, join(root, 'public', 'icon-192.png'));
await generate(512, join(root, 'public', 'icon-512.png'));
