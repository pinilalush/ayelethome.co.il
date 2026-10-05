import type { APIRoute } from 'astro';
import { getAbsoluteLocaleUrl } from 'astro:i18n';
import { site } from '../lib/data.ts';
import { qrMatrix, qrPng } from '../lib/qr.ts';

export const GET: APIRoute = async () => {
  const { ink, surface } = site.config.theme.colors;
  const matrix = qrMatrix(getAbsoluteLocaleUrl(site.defaultLanguage.code));
  return new Response(await qrPng(matrix, { dark: ink, light: surface }), { headers: { 'Content-Type': 'image/png' } });
};
