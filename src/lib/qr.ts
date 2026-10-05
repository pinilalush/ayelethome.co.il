import { encode } from 'uqr';

export type QrColors = { dark: string; light: string };

const QUIET_ZONE = 4;

export function qrMatrix(text: string): boolean[][] {
  return encode(text, { ecc: 'M', border: QUIET_ZONE }).data;
}

export function qrSvg(matrix: boolean[][], colors: QrColors): string {
  const size = matrix.length;
  let path = '';
  for (const [y, row] of matrix.entries()) {
    for (let x = 0; x < size; x++) {
      if (!row[x]) continue;
      const start = x;
      while (x + 1 < size && row[x + 1]) x++;
      path += `M${start} ${y}h${x - start + 1}v1h-${x - start + 1}z`;
    }
  }
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size * 10}" height="${size * 10}" shape-rendering="crispEdges">` +
    `<rect width="${size}" height="${size}" fill="${colors.light}"/>` +
    `<path fill="${colors.dark}" d="${path}"/>` +
    `</svg>\n`
  );
}

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(bytes: Uint8Array): number {
  let c = 0xffffffff;
  for (const b of bytes) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Uint8Array): Uint8Array<ArrayBuffer> {
  const out = new Uint8Array(12 + data.length);
  const view = new DataView(out.buffer);
  view.setUint32(0, data.length);
  for (let i = 0; i < 4; i++) out[4 + i] = type.charCodeAt(i);
  out.set(data, 8);
  view.setUint32(8 + data.length, crc32(out.subarray(4, 8 + data.length)));
  return out;
}

async function deflate(data: Uint8Array<ArrayBuffer>): Promise<Uint8Array<ArrayBuffer>> {
  const stream = new Blob([data]).stream().pipeThrough(new CompressionStream('deflate'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

export async function qrPng(matrix: boolean[][], colors: QrColors, minSize = 1024): Promise<Uint8Array<ArrayBuffer>> {
  const scale = Math.ceil(minSize / matrix.length);
  const size = matrix.length * scale;
  const rowBytes = Math.ceil(size / 8) + 1;
  const pixels = new Uint8Array(rowBytes * size);
  for (let y = 0; y < size; y++) {
    const row = matrix[Math.floor(y / scale)];
    for (let x = 0; x < size; x++) {
      if (row[Math.floor(x / scale)]) pixels[y * rowBytes + 1 + (x >> 3)] |= 0x80 >> (x & 7);
    }
  }
  const header = new Uint8Array(13);
  const view = new DataView(header.buffer);
  view.setUint32(0, size);
  view.setUint32(4, size);
  header.set([1, 3, 0, 0, 0], 8);
  const parts = [
    new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', header),
    chunk('PLTE', new Uint8Array([...rgb(colors.light), ...rgb(colors.dark)])),
    chunk('IDAT', await deflate(pixels)),
    chunk('IEND', new Uint8Array(0)),
  ];
  const png = new Uint8Array(parts.reduce((total, part) => total + part.length, 0));
  let offset = 0;
  for (const part of parts) {
    png.set(part, offset);
    offset += part.length;
  }
  return png;
}
