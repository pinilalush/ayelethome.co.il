import { getAbsoluteLocaleUrl, getRelativeLocaleUrl } from 'astro:i18n';
import { site } from './data.ts';
import { findImage } from './media.ts';

export type Alternate = { hreflang: string; href: string };
export type ShareImage = { url: string; width: number; height: number; type: string };

const IMAGE_TYPES: Record<string, string> = { jpg: 'image/jpeg', svg: 'image/svg+xml' };

export function localeUrl(code: string, path = ''): string {
  return new URL(getAbsoluteLocaleUrl(code, path)).href;
}

export function pagePath(pathname: string, code: string): string {
  const home = getRelativeLocaleUrl(code);
  if (!pathname.startsWith(home)) throw new Error(`The page ${pathname} is not under ${home}, the home of language "${code}"`);
  return pathname.slice(home.length);
}

export function alternates(path: string): Alternate[] {
  return [
    ...site.languages.map((l) => ({ hreflang: l.code, href: localeUrl(l.code, path) })),
    { hreflang: 'x-default', href: localeUrl(site.defaultLanguage.code, path) },
  ];
}

export function ogLocale(code: string): string {
  const { language, region } = new Intl.Locale(code).maximize();
  return region ? `${language}_${region}` : language;
}

export function shareImage(code: string): ShareImage | undefined {
  const image = findImage(site.media.og[code]);
  if (!image) return undefined;
  return {
    url: new URL(image.src, localeUrl(code)).href,
    width: image.width,
    height: image.height,
    type: IMAGE_TYPES[image.format] ?? `image/${image.format}`,
  };
}

export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
