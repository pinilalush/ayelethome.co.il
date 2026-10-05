import { getRelativeLocaleUrl } from 'astro:i18n';
import { getLocale, site } from './data.ts';
import type { Language } from './schema.ts';
import { fill } from './text.ts';

export const LANGUAGE_STORAGE_KEY = 'lang';

export function homeUrl(code: string): string {
  return getRelativeLocaleUrl(code);
}

export function getLanguage(code: string): Language {
  const language = site.languages.find((l) => l.code === code);
  if (!language) throw new Error(`Unknown language "${code}". Languages in config.json: ${site.languages.map((l) => l.code).join(', ')}`);
  return language;
}

export function callsInNote(code: string): string | undefined {
  const { contactLanguages } = site.business;
  if (contactLanguages.includes(code)) return undefined;
  const { ui } = getLocale(code);
  const names = contactLanguages.map((c) => ui.languageNames[c] ?? c);
  const list = new Intl.ListFormat(code, { type: 'conjunction' }).format(names);
  return fill(ui.callsIn, { language: list });
}
