import type { APIRoute } from 'astro';
import { site } from '../lib/data.ts';
import { ICON_PATHS } from '../lib/icons.ts';

export const GET: APIRoute = () => {
  const { primary, primaryText } = site.config.theme.colors;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">` +
    `<rect width="32" height="32" rx="8" fill="${primary}"/>` +
    `<svg x="4" y="4" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${primaryText}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICON_PATHS.sparkle}</svg>` +
    `</svg>`;
  return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml' } });
};
