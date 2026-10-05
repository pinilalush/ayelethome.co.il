import type { Config } from './schema.ts';

type ColorName = keyof Config['theme']['colors'];

export const MIN_CONTRAST = 4.5;

export const CONTRAST_PAIRS: ReadonlyArray<{ fg: ColorName; bg: ColorName; use: string }> = [
  { fg: 'text', bg: 'surface', use: 'body text' },
  { fg: 'text', bg: 'surfaceAlt', use: 'body text on light-gray sections' },
  { fg: 'textMuted', bg: 'surface', use: 'secondary text' },
  { fg: 'textMuted', bg: 'surfaceAlt', use: 'secondary text on light-gray sections' },
  { fg: 'primaryText', bg: 'primary', use: 'button text' },
  { fg: 'surface', bg: 'ink', use: 'text on the dark hero' },
];

function luminance(hex: string): number {
  const channel = (i: number) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
}

export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
