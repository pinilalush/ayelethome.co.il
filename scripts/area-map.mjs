import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { ASSETS_MEDIA_DIR, DATA_DIR } from '../src/lib/validate.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TILE = 256;
const WIDTH = 1200;
const HEIGHT = 900;
const MAX_REGION = 1600;
const MARGIN = 0.08;
const DEFAULT_SPAN_KM = 10;
const USER_AGENT = 'landing-template area map (https://github.com/pinilalush/landing-template)';
const TILE_URL = (z, x, y) => `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;

const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, DATA_DIR, file), 'utf8'));
const business = readJson('business.json');
const config = readJson('config.json');
const media = readJson('media.json');
const file = media.areaMap?.file;
if (!file) {
  console.log('Area map: media.json has no areaMap, nothing to do.');
  process.exit(0);
}

const clean = (text) => String(text).replace(/^TODO\s*/, '');
const { lat, lng } = business.geo;
const city = clean(business.city);
const get = (url) => fetch(url, { headers: { 'User-Agent': USER_AGENT } });

async function cityBoundary() {
  const viewbox = [lng - 0.3, lat + 0.3, lng + 0.3, lat - 0.3].join(',');
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=jsonv2&polygon_geojson=1&limit=1&bounded=1&viewbox=${viewbox}`;
  const response = await get(url);
  if (!response.ok) throw new Error(`Area map: the city search failed with ${response.status}`);
  const [place] = await response.json();
  const geometry = place?.geojson;
  if (!geometry || !['Polygon', 'MultiPolygon'].includes(geometry.type)) return undefined;
  return geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
}

const project = (z) => (lngLat) => {
  const scale = 2 ** z * TILE;
  const rad = (lngLat[1] * Math.PI) / 180;
  return [((lngLat[0] + 180) / 360) * scale, ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * scale];
};

const polygons = await cityBoundary();
const kmPerDegree = 111.32;
const bounds = polygons
  ? polygons.flat(2).reduce((b, [x, y]) => ({ west: Math.min(b.west, x), east: Math.max(b.east, x), south: Math.min(b.south, y), north: Math.max(b.north, y) }), { west: 180, east: -180, south: 90, north: -90 })
  : (() => {
      const dLat = DEFAULT_SPAN_KM / 2 / kmPerDegree;
      const dLng = dLat / Math.cos((lat * Math.PI) / 180);
      return { west: lng - dLng, east: lng + dLng, south: lat - dLat, north: lat + dLat };
    })();

let zoom = 17;
let region;
for (; zoom >= 8; zoom--) {
  const p = project(zoom);
  const [x1, y1] = p([bounds.west, bounds.north]);
  const [x2, y2] = p([bounds.east, bounds.south]);
  let w = (x2 - x1) * (1 + 2 * MARGIN);
  let h = (y2 - y1) * (1 + 2 * MARGIN);
  if (w / h < WIDTH / HEIGHT) w = (h * WIDTH) / HEIGHT;
  else h = (w * HEIGHT) / WIDTH;
  if (w <= MAX_REGION) {
    region = { left: Math.round((x1 + x2) / 2 - w / 2), top: Math.round((y1 + y2) / 2 - h / 2), width: Math.round(w), height: Math.round(h) };
    break;
  }
}

const firstX = Math.floor(region.left / TILE);
const firstY = Math.floor(region.top / TILE);
const lastX = Math.floor((region.left + region.width - 1) / TILE);
const lastY = Math.floor((region.top + region.height - 1) / TILE);
const tiles = [];
for (let y = firstY; y <= lastY; y++) {
  for (let x = firstX; x <= lastX; x++) {
    const response = await get(TILE_URL(zoom, x, y));
    if (!response.ok) throw new Error(`Area map: tile ${zoom}/${x}/${y} failed with ${response.status}`);
    tiles.push({ input: Buffer.from(await response.arrayBuffer()), left: (x - firstX) * TILE, top: (y - firstY) * TILE });
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
}

const mosaic = await sharp({
  create: { width: (lastX - firstX + 1) * TILE, height: (lastY - firstY + 1) * TILE, channels: 3, background: '#ffffff' },
})
  .composite(tiles)
  .png()
  .toBuffer();

const base = await sharp(mosaic)
  .extract({ left: region.left - firstX * TILE, top: region.top - firstY * TILE, width: region.width, height: region.height })
  .resize(WIDTH, HEIGHT)
  .modulate({ saturation: 0.2, brightness: 1.04 })
  .linear(0.8, 40)
  .png()
  .toBuffer();

const { primary } = config.theme.colors;
const scale = WIDTH / region.width;
const p = project(zoom);
const toPoint = (lngLat) => {
  const [x, y] = p(lngLat);
  return `${((x - region.left) * scale).toFixed(1)},${((y - region.top) * scale).toFixed(1)}`;
};
const area = polygons
  ? polygons.map((rings) => rings.map((ring) => `M${ring.map(toPoint).join('L')}Z`).join('')).join('')
  : '';
const overlay = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">` +
    `<rect width="100%" height="100%" fill="${primary}" fill-opacity="0.08"/>` +
    (area
      ? `<path d="${area}" fill="${primary}" fill-opacity="0.18" fill-rule="evenodd" stroke="${primary}" stroke-opacity="0.9" stroke-width="3" stroke-linejoin="round"/>`
      : '') +
    `</svg>`,
);

const image = await sharp(base).composite([{ input: overlay }]).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
fs.writeFileSync(path.join(root, ASSETS_MEDIA_DIR, file), image);
console.log(
  `Area map: ${ASSETS_MEDIA_DIR}/${file} (${WIDTH}×${HEIGHT}, zoom ${zoom}, ${Math.round(image.length / 1024)} KB), ` +
    (area ? `${city} highlighted.` : `no boundary found for "${city}", plain map around the point.`) +
    ' Map data © OpenStreetMap contributors.',
);
