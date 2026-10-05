import type { Locale, SiteData } from './schema.ts';
import { formatIssues, validateSiteData, type RawFiles } from './validate.ts';

const modules = import.meta.glob<unknown>('../data/**/*.json', { eager: true, import: 'default' });
const raw: RawFiles = Object.fromEntries(
  Object.entries(modules).map(([path, value]) => [path.replace('../data/', ''), value]),
);

const result = validateSiteData(raw);
if (!result.data) throw new Error(formatIssues(result.issues));

export const site: SiteData = result.data;
export const placeholders: string[] = result.placeholders;

export function getLocale(code: string): Locale {
  const locale = site.locales[code];
  if (!locale) throw new Error(`No data for language "${code}". Languages in config.json: ${Object.keys(site.locales).join(', ')}`);
  return locale;
}
