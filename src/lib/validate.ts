import type { z } from 'astro/zod';
import { businessSchema, configSchema, contentSchema, mediaSchema, seoSchema, uiSchema } from './schema.ts';
import type { Business, Config, Locale, Media, SiteData } from './schema.ts';

export const DATA_DIR = 'src/data';

export type RawFiles = Record<string, unknown>;
export type ValidationResult = { data?: SiteData; issues: string[]; placeholders: string[] };

const PLACEHOLDER = /\bTODO\b/;
const PLACEHOLDER_PREFIX = /^TODO(?::\s*|\s+|$)/;

function formatPath(path: PropertyKey[]): string {
  return path.reduce<string>(
    (out, part) => (typeof part === 'number' ? `${out}[${part}]` : out ? `${out}.${String(part)}` : String(part)),
    '',
  );
}

export function where(file: string, path: PropertyKey[] = []): string {
  const field = formatPath(path);
  return `${DATA_DIR}/${file}${field ? ` → ${field}` : ''}`;
}

function stripPlaceholders(value: unknown, file: string, path: PropertyKey[], found: string[]): unknown {
  if (typeof value === 'string') {
    if (!PLACEHOLDER.test(value)) return value;
    found.push(where(file, path));
    return value.replace(PLACEHOLDER_PREFIX, '');
  }
  if (Array.isArray(value)) return value.map((item, i) => stripPlaceholders(item, file, [...path, i], found));
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, stripPlaceholders(item, file, [...path, key], found)]),
    );
  }
  return value;
}

function describe(file: string, issue: z.core.$ZodIssue): string {
  const input = (issue as { input?: unknown }).input;
  if (issue.code === 'invalid_type') {
    if (input === undefined) return `${where(file, issue.path)}: missing (expected ${issue.expected})`;
    return `${where(file, issue.path)}: expected ${issue.expected} (got ${JSON.stringify(input)})`;
  }
  if (issue.code === 'unrecognized_keys') {
    const keys = issue.keys.map((k) => `"${k}"`).join(', ');
    return `${where(file, issue.path)}: unknown field ${keys} (a typo, or a field that doesn't belong here)`;
  }
  const got = input !== undefined && (input === null || typeof input !== 'object') ? ` (got ${JSON.stringify(input)})` : '';
  return `${where(file, issue.path)}: ${issue.message}${got}`;
}

function parseFile<T>(
  raw: RawFiles,
  file: string,
  schema: z.ZodType<T>,
  issues: string[],
  placeholders: string[],
): T | undefined {
  if (!(file in raw)) {
    issues.push(`${where(file)}: file is missing`);
    return undefined;
  }
  const value = stripPlaceholders(raw[file], file, [], placeholders);
  const result = schema.safeParse(value, { reportInput: true });
  if (result.success) return result.data;
  for (const issue of result.error.issues) issues.push(describe(file, issue));
  return undefined;
}

function languageCodes(config: Config | undefined, raw: RawFiles): string[] {
  if (config) return config.languages.map((l) => l.code);
  const languages = (raw['config.json'] as { languages?: unknown } | undefined)?.languages;
  if (!Array.isArray(languages)) return [];
  const codes = languages.map((l) => (l as { code?: unknown })?.code).filter((c): c is string => typeof c === 'string');
  return [...new Set(codes)];
}

function crossCheck(config: Config, business: Business | undefined, media: Media, locales: Record<string, Locale>, issues: string[]) {
  const codes = config.languages.map((l) => l.code);

  for (const code of codes) {
    if (!media.og[code]) issues.push(`${where('media.json', ['og'])}: missing a share image for "${code}"`);
  }
  for (const code of Object.keys(media.og)) {
    if (!codes.includes(code)) issues.push(`${where('media.json', ['og', code])}: "${code}" is not in config.json → languages`);
  }
  if (config.heroVideo && !media.heroVideo) {
    issues.push(`${where('media.json', ['heroVideo'])}: missing, but config.json → heroVideo is true`);
  }
  if (business && config.sections.pricing && !business.pricing) {
    issues.push(`${where('business.json', ['pricing'])}: missing, but config.json → sections.pricing is true`);
  }
  const evening = business?.pricing?.evening;
  if (business && evening && !business.workHours.some((h) => h.from < evening.from && evening.from < h.to)) {
    issues.push(`${where('business.json', ['pricing', 'evening', 'from'])}: the evening rate starts at ${evening.from}, but no work hours run past that time`);
  }
  for (const [i, code] of (business?.contactLanguages ?? []).entries()) {
    if (!codes.includes(code)) {
      issues.push(`${where('business.json', ['contactLanguages', i])}: "${code}" is not in config.json → languages`);
    }
  }

  const altKeys = [media.logo.alt, media.hero.alt, media.about.alt, ...media.gallery.map((g) => g.alt)];
  for (const [code, { content, seo, ui }] of Object.entries(locales)) {
    for (const key of altKeys) {
      if (!(key in content.media)) {
        issues.push(`${where(`locales/${code}/content.json`, ['media'])}: missing the alt text "${key}" used in media.json`);
      }
    }
    if (config.sections.pricing && !content.pricing) {
      issues.push(`${where(`locales/${code}/content.json`, ['pricing'])}: missing, but config.json → sections.pricing is true`);
    }
    const file = `locales/${code}/content.json`;
    if (business?.pricing?.evening) {
      if (!content.booking.slots.evening) issues.push(`${where(file, ['booking', 'slots', 'evening'])}: missing, but business.json has an evening rate`);
      if (!content.booking.price.split) issues.push(`${where(file, ['booking', 'price', 'split'])}: missing, but business.json has an evening rate`);
    }
    const pricing = business?.pricing;
    if (pricing) {
      for (const [i, { hours }] of content.booking.hoursGuide.entries()) {
        const steps = (hours - pricing.minimumHours) / pricing.step;
        if (hours < pricing.minimumHours || Math.abs(steps - Math.round(steps)) > 1e-9) {
          issues.push(`${where(file, ['booking', 'hoursGuide', i, 'hours'])}: ${hours} isn't a bookable length (minimum ${pricing.minimumHours}, then steps of ${pricing.step})`);
        }
      }
    }
    for (const contactCode of business?.contactLanguages ?? []) {
      if (!(contactCode in ui.languageNames)) {
        issues.push(`${where(`locales/${code}/ui.json`, ['languageNames'])}: missing the name of "${contactCode}", a language in business.json → contactLanguages`);
      }
    }
    const og = media.og[code];
    if (og && seo.ogImage !== og.replace(/\.[^.]+$/, '')) {
      issues.push(`${where(`locales/${code}/seo.json`, ['ogImage'])}: "${seo.ogImage}" doesn't match media.json → og.${code} ("${og}")`);
    }
  }
}

export function validateSiteData(raw: RawFiles): ValidationResult {
  const issues: string[] = [];
  const placeholders: string[] = [];

  const config = parseFile(raw, 'config.json', configSchema, issues, placeholders);
  const business = parseFile(raw, 'business.json', businessSchema, issues, placeholders);
  const media = parseFile(raw, 'media.json', mediaSchema, issues, placeholders);

  const locales: Record<string, Locale> = {};
  for (const code of languageCodes(config, raw)) {
    const content = parseFile(raw, `locales/${code}/content.json`, contentSchema, issues, placeholders);
    const seo = parseFile(raw, `locales/${code}/seo.json`, seoSchema, issues, placeholders);
    const ui = parseFile(raw, `locales/${code}/ui.json`, uiSchema, issues, placeholders);
    if (content && seo && ui) locales[code] = { content, seo, ui };
  }

  if (config && media) crossCheck(config, business, media, locales, issues);
  if (!config || !business || !media || issues.length) return { issues, placeholders };

  const defaultLanguage = config.languages.find((l) => l.default)!;
  return {
    data: { config, business, media, languages: config.languages, defaultLanguage, locales },
    issues,
    placeholders,
  };
}

export function formatIssues(issues: string[]): string {
  const count = `${issues.length} problem${issues.length === 1 ? '' : 's'}`;
  return `The data in ${DATA_DIR} has ${count}:\n${issues.map((i) => `  • ${i}`).join('\n')}`;
}
