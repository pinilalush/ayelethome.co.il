import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { formatMoney } from '../src/lib/booking.ts';
import { ASSETS_MEDIA_DIR, DATA_DIR, validateSiteData } from '../src/lib/validate.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WIDTH = 1200;
const HEIGHT = 630;
const COLUMN = 600;
const MAX_BYTES = 300 * 1024;

const fontDir = fs.mkdtempSync(path.join(os.tmpdir(), 'share-fonts-'));
fs.writeFileSync(
  path.join(fontDir, 'fonts.conf'),
  `<?xml version="1.0"?><fontconfig><dir>${path.join(root, 'scripts/fonts')}</dir><cachedir>${fontDir}</cachedir></fontconfig>`,
);
process.env.FONTCONFIG_FILE = path.join(fontDir, 'fonts.conf');
const { default: sharp } = await import('sharp');

function readJsonTree(dir) {
  const files = {};
  const walk = (current) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.json')) files[path.relative(dir, full).split(path.sep).join('/')] = JSON.parse(fs.readFileSync(full, 'utf8'));
    }
  };
  walk(dir);
  return files;
}

const escape = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function textImage(markup, size) {
  return sharp({ text: { text: markup, font: `Rubik ${size}`, width: COLUMN, align: 'centre', rgba: true, dpi: 72, wrap: 'word', spacing: Math.round(size * 0.25) } })
    .png()
    .toBuffer({ resolveWithObject: true });
}

async function shareImage(site, code, heroFile) {
  const { ink, primary, primaryText, accent, surface } = site.config.theme.colors;
  const { content } = site.locales[code];
  const pricing = site.business.pricing;

  const background = await sharp(heroFile).resize(WIDTH, HEIGHT, { fit: 'cover' }).blur(1.5).toBuffer();
  const overlay = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
      <defs><radialGradient id="g" cx="50%" cy="50%" r="55%"><stop offset="0" stop-color="${primary}" stop-opacity="0.38"/><stop offset="1" stop-color="${primary}" stop-opacity="0"/></radialGradient></defs>
      <rect width="100%" height="100%" fill="${ink}" fill-opacity="0.78"/>
      <rect width="100%" height="100%" fill="url(#g)"/>
    </svg>`,
  );

  const title = await textImage(
    `<span foreground="${surface}" weight="800" size="${content.businessName.length > 24 ? 50 : 64}pt">${escape(content.businessName)}</span>\n<span foreground="${accent}" weight="400" size="30pt">${escape(content.tagline)}</span>`,
    30,
  );
  const layers = [{ input: overlay, top: 0, left: 0 }];
  const parts = [title];

  let pill;
  if (pricing) {
    const price = await textImage(
      `<span foreground="${primaryText}" weight="700" size="40pt">${escape(`${formatMoney(code, pricing.hourlyRate, pricing.currency)} ${content.pricing.perHour}`)}</span>`,
      40,
    );
    const trimmed = await sharp(price.data).trim().toBuffer({ resolveWithObject: true });
    const padX = 40;
    const padY = 18;
    const w = trimmed.info.width + padX * 2;
    const h = trimmed.info.height + padY * 2;
    const shape = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="${h / 2}" fill="${primary}"/></svg>`);
    pill = { data: await sharp(shape).composite([{ input: trimmed.data, top: padY, left: padX }]).png().toBuffer(), info: { width: w, height: h } };
    parts.push(pill);
  }

  const gap = 36;
  const total = parts.reduce((sum, p) => sum + p.info.height, 0) + gap * (parts.length - 1);
  let top = Math.round((HEIGHT - total) / 2);
  for (const part of parts) {
    layers.push({ input: part.data, top, left: Math.round((WIDTH - part.info.width) / 2) });
    top += part.info.height + gap;
  }

  let quality = 82;
  let out;
  do {
    out = await sharp(background).composite(layers).jpeg({ quality, mozjpeg: true }).toBuffer();
    quality -= 6;
  } while (out.length > MAX_BYTES && quality > 40);
  return out;
}

const result = validateSiteData(readJsonTree(path.join(root, DATA_DIR)));
if (!result.data) {
  console.log('Share images: skipped, the data has problems (the data check lists them).');
  process.exit(0);
}
const site = result.data;
const heroFile = path.join(root, ASSETS_MEDIA_DIR, site.media.hero.file);
if (!fs.existsSync(heroFile)) {
  console.log(`Share images: skipped, ${ASSETS_MEDIA_DIR}/${site.media.hero.file} is missing.`);
  process.exit(0);
}
for (const { code } of site.languages) {
  const file = site.media.og[code];
  if (!file) continue;
  const image = await shareImage(site, code, heroFile);
  fs.writeFileSync(path.join(root, ASSETS_MEDIA_DIR, file), image);
  console.log(`Share images: ${ASSETS_MEDIA_DIR}/${file} (${Math.round(image.length / 1024)} KB)`);
}
fs.rmSync(fontDir, { recursive: true, force: true });
