import { ALLOW_PLACEHOLDERS } from 'astro:env/server';
import type { Locale, SiteData } from './schema.ts';
import { formatIssues, formatPending, validateSiteData, type Pending, type RawFiles } from './validate.ts';

const modules = import.meta.glob<unknown>('../data/**/*.json', { eager: true, import: 'default' });
const raw: RawFiles = Object.fromEntries(
  Object.entries(modules).map(([path, value]) => [path.replace('../data/', ''), value]),
);
const mediaFiles = Object.keys(import.meta.glob('../assets/media/*')).map((path) => path.split('/').pop() ?? path);

const result = validateSiteData(raw, { mediaFiles });
if (!result.data) throw new Error(formatIssues(result.issues));

const allowPlaceholders = import.meta.env.DEV || ALLOW_PLACEHOLDERS === '1' || ALLOW_PLACEHOLDERS === 'true';
if (result.pending.length) {
  const report = formatPending(result.pending);
  if (!allowPlaceholders) {
    throw new Error(`${report}\n\nReplace these with real data. To build a demo with test data anyway: ALLOW_PLACEHOLDERS=1 npm run build`);
  }
  if (import.meta.env.DEV) console.warn(report);
}

export const site: SiteData = result.data;
export const pending: Pending[] = result.pending;
export const isTestData = pending.length > 0;

export function getLocale(code: string): Locale {
  const locale = site.locales[code];
  if (!locale) throw new Error(`No data for language "${code}". Languages in config.json: ${Object.keys(site.locales).join(', ')}`);
  return locale;
}
