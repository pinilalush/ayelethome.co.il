import { getLocale } from './data.ts';
import { localeUrl } from './seo.ts';

export type ShareInfo = { url: string; title: string; text: string; whatsappHref: string };

export function shareInfo(code: string): ShareInfo {
  const { content } = getLocale(code);
  const url = localeUrl(code);
  const text = `${content.businessName} – ${content.tagline}`;
  return { url, title: content.businessName, text, whatsappHref: `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}` };
}
