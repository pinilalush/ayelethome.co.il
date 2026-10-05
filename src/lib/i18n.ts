import { getRelativeLocaleUrl } from 'astro:i18n';
import { site } from './data.ts';
import type { Language } from './schema.ts';

export const LANGUAGE_STORAGE_KEY = 'lang';

export function homeUrl(code: string): string {
  return getRelativeLocaleUrl(code);
}

export function getLanguage(code: string): Language {
  const language = site.languages.find((l) => l.code === code);
  if (!language) throw new Error(`Unknown language "${code}". Languages in config.json: ${site.languages.map((l) => l.code).join(', ')}`);
  return language;
}
