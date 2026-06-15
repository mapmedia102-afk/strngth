import sharp from 'sharp';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

// Icon SVG — dark bg, cyan "S" glyph with glow
function makeSVG(size, masked = false) {
  const pad = masked ? size * 0.15 : size * 0.08;
  const inner = size - pad * 2;
  const cx = size / 2;
  const cy = size / 2;
  const r = masked ? size / 2 : size * 0.14;
  const fontSize = inner * 0.62;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="${size * 0.025}" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <radialGradient id="bg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#0d0d1a"/>
      <stop offset="100%" stop-color="#03030a"/>
    </radialGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${r}" fill="url(#bg)"/>
  <text
    x="${cx}" y="${cy + fontSize * 0.36}"
    font-family="Arial Black, Arial, sans-serif"
    font-weight="900"
    font-size="${fontSize}"
    text-anchor="middle"
    fill="#00d4ff"
    filter="url(#glow)"
    letter-spacing="-2"
  >S</text>
  <text
    x="${cx}" y="${size - pad * 0.9}"
    font-family="Arial, sans-serif"
    font-weight="700"
    font-size="${size * 0.095}"
    text-anchor="middle"
    fill="rgba(0,212,255,0.55)"
    letter-spacing="${size * 0.018}"
  >STRNGTH</text>
</svg>`;
}

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

mkdirSync(join(publicDir, 'icons'), { recursive: true });

for (const s of sizes) {
  const svg = Buffer.from(makeSVG(s));
  await sharp(svg).png().toFile(join(publicDir, 'icons', `icon-${s}x${s}.png`));
  console.log(`  icon-${s}x${s}.png`);
}

// Maskable (extra padding for Android adaptive icon safe zone)
for (const s of [192, 512]) {
  const svg = Buffer.from(makeSVG(s, true));
  await sharp(svg).png().toFile(join(publicDir, 'icons', `icon-maskable-${s}x${s}.png`));
  console.log(`  icon-maskable-${s}x${s}.png`);
}

// Apple touch icon 180x180
const atSvg = Buffer.from(makeSVG(180));
await sharp(atSvg).png().toFile(join(publicDir, 'apple-touch-icon.png'));
console.log('  apple-touch-icon.png');

// Favicon 32x32
const fav32 = Buffer.from(makeSVG(32));
await sharp(fav32).png().toFile(join(publicDir, 'favicon-32x32.png'));
console.log('  favicon-32x32.png');

// Favicon 16x16
const fav16 = Buffer.from(makeSVG(16));
await sharp(fav16).png().toFile(join(publicDir, 'favicon-16x16.png'));
console.log('  favicon-16x16.png');

console.log('\nAll PWA icons generated.');
