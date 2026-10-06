import type { z } from 'astro/zod';
import { CONTRAST_PAIRS, MIN_CONTRAST, contrastRatio } from './contrast.ts';
import { allowedTokens, hasStrayBraces, tokensIn, whyUnfillable, type TextFile } from './placeholders.ts';
import { businessSchema, configSchema, contentSchema, mediaSchema, seoSchema, uiSchema } from './schema.ts';
import type { Business, Config, Locale, Media, SiteData } from './schema.ts';

export const DATA_DIR = 'src/data';
export const ASSETS_MEDIA_DIR = 'src/assets/media';
export const PUBLIC_MEDIA_DIR = 'public/media';
export const TEST_PHONE = '+972500000000';
export const TEMPLATE_BASE_PATH = '/landing-template/';

export type RawFiles = Record<string, unknown>;
export type PendingReason = 'todo' | 'test-phone' | 'demo-path' | 'missing-media';
export type Pending = { file: string; field: string; reason: PendingReason; detail?: string };
export type ValidationOptions = { mediaFiles?: string[]; publicMediaFiles?: string[] };
export type ValidationResult = { data?: SiteData; issues: string[]; pending: Pending[]; warnings: string[] };

const PLACEHOLDER = /\bTODO\b/;
const PLACEHOLDER_PREFIX = /^TODO(?::\s*|\s+|$)/;

const UI_ON_PAGE = ['call', 'callNow', 'bookOnWhatsapp', 'sendWhatsapp', 'sections', 'booking', 'payment', 'contact', 'workHours', 'saveContact'];
const CONTENT_SECTION: Record<string, keyof Config['sections']> = {
  services: 'services',
  pricing: 'pricing',
  why: 'why',
  about: 'why',
  area: 'area',
  reviews: 'reviews',
  faq: 'faq',
  finalCta: 'finalCta',
};
const NOT_SHOWN = new Set(['id', 'icon', 'bookingName', 'inMessage']);
const MESSAGE_ONLY = new Set(['message', 'price', 'availability', 'when']);
const SENTENCE_END = /[.!?;:·|()[\]\n]+|\s[-–—]\s/;
const WORD = /[\p{L}\p{N}]+(?:['"][\p{L}\p{N}]+)*/gu;
const HEBREW_MARKS = /[\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7]/g;
const HEBREW_PREFIX = /^[משהוכלב]{1,3}$/;
const RUSSIAN_ENDING = /(?:ами|ями|ого|его|ому|ему|ыми|ими|ой|ей|ий|ый|ая|яя|ое|ее|ую|юю|ов|ев|ам|ям|ах|ях|ом|ем|ы|и|а|я|о|е|у|ю|ь)$/;
const MAX_GAP = 3;

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

function stripPlaceholders(value: unknown, file: string, path: PropertyKey[], pending: Pending[]): unknown {
  if (typeof value === 'string') {
    const at = { file: `${DATA_DIR}/${file}`, field: formatPath(path) };
    if (value === TEST_PHONE) pending.push({ ...at, reason: 'test-phone' });
    if (!PLACEHOLDER.test(value)) return value;
    pending.push({ ...at, reason: 'todo' });
    return value.replace(PLACEHOLDER_PREFIX, '');
  }
  if (Array.isArray(value)) return value.map((item, i) => stripPlaceholders(item, file, [...path, i], pending));
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, stripPlaceholders(item, file, [...path, key], pending)]),
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

function parseFile<T>(raw: RawFiles, file: string, schema: z.ZodType<T>, issues: string[], pending: Pending[]): T | undefined {
  if (!(file in raw)) {
    issues.push(`${where(file)}: file is missing`);
    return undefined;
  }
  const value = stripPlaceholders(raw[file], file, [], pending);
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
  } else if (business?.pricing && evening) {
    const minutes = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));
    const need = minutes(evening.from) + business.pricing.minimumHours * 60;
    if (!business.workHours.some((h) => minutes(h.from) <= minutes(evening.from) && minutes(h.to) >= need)) {
      const until = `${String(Math.floor(need / 60) % 24).padStart(2, '0')}:${String(need % 60).padStart(2, '0')}`;
      issues.push(`${where('business.json', ['workHours'])}: no work day leaves room for an evening visit — at least ${business.pricing.minimumHours} hours from ${evening.from}, so work hours must run until ${until} on at least one day`);
    }
  }
  for (const [i, code] of (business?.contactLanguages ?? []).entries()) {
    if (!codes.includes(code)) {
      issues.push(`${where('business.json', ['contactLanguages', i])}: "${code}" is not in config.json → languages`);
    }
  }

  if (config.sections.gallery && media.gallery.length === 0) {
    issues.push(`${where('media.json', ['gallery'])}: empty, but config.json → sections.gallery is true`);
  }

  const altKeys = [...(media.logo ? [media.logo.alt] : []), media.hero.alt, media.about.alt, ...media.gallery.map((g) => g.alt)];
  for (const [code, { content, seo, ui }] of Object.entries(locales)) {
    const file = `locales/${code}/content.json`;
    for (const key of altKeys) {
      if (!(key in content.media)) issues.push(`${where(file, ['media'])}: missing the alt text "${key}" used in media.json`);
    }
    if (config.sections.pricing && !content.pricing) {
      issues.push(`${where(file, ['pricing'])}: missing, but config.json → sections.pricing is true`);
    }
    if (business && !content.services.some((s) => s.id === business.defaultService)) {
      issues.push(`${where('business.json', ['defaultService'])}: "${business.defaultService}" is not one of the service ids in ${file} → services`);
    }
    for (const id of business?.estimateByPhone ?? []) {
      if (!content.services.some((s) => s.id === id)) {
        issues.push(`${where('business.json', ['estimateByPhone'])}: "${id}" is not one of the service ids in ${file} → services`);
      }
    }
    if (business?.estimateByPhone?.length) {
      for (const key of ['estimateNote', 'messageEstimate'] as const) {
        if (!content.booking[key]) issues.push(`${where(file, ['booking', key])}: missing, but business.json → estimateByPhone lists services`);
      }
    }
    if (config.sections.reviews && content.reviews.length === 0) {
      issues.push(`${where(file, ['reviews'])}: empty, but config.json → sections.reviews is true`);
    }
    if (config.sections.faq && content.faq.length === 0) {
      issues.push(`${where(file, ['faq'])}: empty, but config.json → sections.faq is true`);
    }
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

function eachString(value: unknown, path: PropertyKey[], visit: (text: string, path: PropertyKey[]) => void) {
  if (typeof value === 'string') visit(value, path);
  else if (Array.isArray(value)) value.forEach((item, i) => eachString(item, [...path, i], visit));
  else if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) eachString(item, [...path, key], visit);
  }
}

function checkPlaceholderTokens(business: Business, locales: Record<string, Locale>, issues: string[]) {
  for (const [code, locale] of Object.entries(locales)) {
    for (const file of ['content', 'seo', 'ui'] as TextFile[]) {
      eachString(locale[file], [], (text, path) => {
        const at = where(`locales/${code}/${file}.json`, path);
        const allowed = allowedTokens(file, formatPath(path));
        for (const token of new Set(tokensIn(text))) {
          if (!allowed.includes(token)) {
            const hint = allowed.length ? `allowed here: ${allowed.map((t) => `{${t}}`).join(' ')}` : 'no placeholders are allowed here';
            issues.push(`${at}: unknown placeholder {${token}} (${hint})`);
            continue;
          }
          const reason = whyUnfillable(token, business);
          if (reason) issues.push(`${at}: {${token}} can't be filled in, ${reason}`);
        }
        if (hasStrayBraces(text)) issues.push(`${at}: a "{" or "}" that isn't part of a placeholder like {hours}`);
      });
    }
  }
}

function checkLanguagesMatch(config: Config, locales: Record<string, Locale>, issues: string[]) {
  const defaultCode = config.languages.find((l) => l.default)?.code;
  const base = defaultCode ? locales[defaultCode] : undefined;
  if (!base) return;
  const lists: Array<[PropertyKey[], (l: Locale) => unknown[]]> = [
    [['hero', 'badges'], (l) => l.content.hero.badges],
    [['why'], (l) => l.content.why],
    [['area', 'places'], (l) => l.content.area.places],
    [['faq'], (l) => l.content.faq],
    [['reviews'], (l) => l.content.reviews],
    [['booking', 'hoursGuide'], (l) => l.content.booking.hoursGuide],
  ];
  for (const [code, locale] of Object.entries(locales)) {
    if (code === defaultCode) continue;
    const file = `locales/${code}/content.json`;
    const ids = locale.content.services.map((s) => s.id).join(', ');
    const baseIds = base.content.services.map((s) => s.id).join(', ');
    if (ids !== baseIds) issues.push(`${where(file, ['services'])}: service ids are [${ids}], but ${defaultCode} has [${baseIds}] (same services, same order)`);
    for (const [path, list] of lists) {
      const n = list(locale).length, m = list(base).length;
      if (n !== m) issues.push(`${where(file, path)}: has ${n} item${n === 1 ? '' : 's'}, but ${defaultCode} has ${m}`);
    }
    const hours = locale.content.booking.hoursGuide.map((g) => g.hours).join(', ');
    const baseHours = base.content.booking.hoursGuide.map((g) => g.hours).join(', ');
    if (hours !== baseHours && locale.content.booking.hoursGuide.length === base.content.booking.hoursGuide.length) {
      issues.push(`${where(file, ['booking', 'hoursGuide'])}: hours are [${hours}], but ${defaultCode} has [${baseHours}]`);
    }
  }
}

function checkContrast(config: Config, issues: string[]) {
  const colors = config.theme.colors;
  for (const { fg, bg, use } of CONTRAST_PAIRS) {
    const ratio = contrastRatio(colors[fg], colors[bg]);
    if (ratio < MIN_CONTRAST) {
      issues.push(`${where('config.json', ['theme', 'colors', fg])}: ${colors[fg]} on ${bg} ${colors[bg]} has contrast ${ratio.toFixed(2)}:1, needs at least ${MIN_CONTRAST}:1 (${use})`);
    }
  }
}

function pageTexts(config: Config, { content, ui }: Locale): string[] {
  const texts: string[] = [];
  eachString(content, [], (text, path) => {
    const [top, sub] = path.map(String);
    const section = CONTENT_SECTION[top];
    if (section && !config.sections[section]) return;
    if (top === 'media' || top === 'accessibilityService' || NOT_SHOWN.has(String(path.at(-1)))) return;
    if (top === 'booking' && MESSAGE_ONLY.has(sub)) return;
    texts.push(text);
  });
  for (const key of UI_ON_PAGE) eachString((ui as Record<string, unknown>)[key], [], (text) => texts.push(text));
  return texts;
}

function words(text: string): string[] {
  const plain = text.normalize('NFC').replace(HEBREW_MARKS, '').replace(/[׳’`]/g, "'").replace(/[״“”]/g, '"');
  return [...plain.toLowerCase().replace(/ё/g, 'е').matchAll(WORD)].map((m) => m[0]);
}

function stem(word: string): string {
  if (/[а-я]/.test(word)) {
    const base = word.replace(RUSSIAN_ENDING, '');
    return base.length >= 3 ? base : word;
  }
  return word.length > 3 && !word.endsWith('ss') ? word.replace(/'?s$/, '') : word;
}

function sameWord(a: string, b: string): boolean {
  if (a === b) return true;
  if (/[\u05D0-\u05EA]/.test(a)) {
    const [short, long] = a.length < b.length ? [a, b] : [b, a];
    return short.length >= 2 && long.endsWith(short) && HEBREW_PREFIX.test(long.slice(0, long.length - short.length));
  }
  return stem(a) === stem(b);
}

function containsKeyword(sentence: string[], keyword: string[]): boolean {
  const rest = (from: number, k: number): boolean => {
    if (k === keyword.length) return true;
    for (let j = from; j < Math.min(sentence.length, from + MAX_GAP + 1); j++) {
      if (sameWord(sentence[j], keyword[k]) && rest(j + 1, k + 1)) return true;
    }
    return false;
  };
  return sentence.some((word, i) => sameWord(word, keyword[0]) && rest(i + 1, 1));
}

function checkKeywords(config: Config, locales: Record<string, Locale>, warnings: string[]) {
  for (const [code, locale] of Object.entries(locales)) {
    const sentences = pageTexts(config, locale)
      .flatMap((text) => text.split(SENTENCE_END))
      .map(words)
      .filter((s) => s.length > 0);
    for (const [i, keyword] of locale.seo.keywords.primary.entries()) {
      const wanted = words(keyword);
      if (wanted.length && !sentences.some((s) => containsKeyword(s, wanted))) {
        warnings.push(`${where(`locales/${code}/seo.json`, ['keywords', 'primary', i])}: "${keyword}" isn't used anywhere in the page text (work it into a heading, a service or an FAQ answer in content.json)`);
      }
    }
  }
}

function checkMediaFiles(config: Config, media: Media, options: ValidationOptions, pending: Pending[]) {
  const wanted: Array<{ path: PropertyKey[]; file: string; dir: 'assets' | 'public' }> = [
    ...(media.logo ? [{ path: ['logo', 'file'], file: media.logo.file, dir: 'assets' as const }] : []),
    { path: ['hero', 'file'], file: media.hero.file, dir: 'assets' },
    ...(media.hero.fileMobile ? [{ path: ['hero', 'fileMobile'], file: media.hero.fileMobile, dir: 'assets' as const }] : []),
    { path: ['about', 'file'], file: media.about.file, dir: 'assets' },
    ...(media.areaMap ? [{ path: ['areaMap', 'file'], file: media.areaMap.file, dir: 'assets' as const }] : []),
    ...Object.entries(media.og).map(([code, file]) => ({ path: ['og', code], file, dir: 'assets' as const })),
    ...media.gallery.map((g, i) => ({ path: ['gallery', i, 'file'], file: g.file, dir: 'assets' as const })),
  ];
  if (config.heroVideo && media.heroVideo) {
    wanted.push({ path: ['heroVideo', 'file'], file: media.heroVideo.file, dir: 'public' });
    if (media.heroVideo.fileMobile) wanted.push({ path: ['heroVideo', 'fileMobile'], file: media.heroVideo.fileMobile, dir: 'public' });
    wanted.push({ path: ['heroVideo', 'poster'], file: media.heroVideo.poster, dir: 'assets' });
  }
  for (const { path, file, dir } of wanted) {
    const available = dir === 'assets' ? options.mediaFiles : options.publicMediaFiles;
    if (!available || available.includes(file)) continue;
    const folder = dir === 'assets' ? ASSETS_MEDIA_DIR : PUBLIC_MEDIA_DIR;
    pending.push({ file: `${DATA_DIR}/media.json`, field: formatPath(path), reason: 'missing-media', detail: `${file} is not in ${folder}/` });
  }
}

export function validateSiteData(raw: RawFiles, options: ValidationOptions = {}): ValidationResult {
  const issues: string[] = [];
  const pending: Pending[] = [];
  const warnings: string[] = [];

  const config = parseFile(raw, 'config.json', configSchema, issues, pending);
  const business = parseFile(raw, 'business.json', businessSchema, issues, pending);
  const media = parseFile(raw, 'media.json', mediaSchema, issues, pending);
  if (business?.basePath === TEMPLATE_BASE_PATH) pending.push({ file: `${DATA_DIR}/business.json`, field: 'basePath', reason: 'demo-path' });

  const locales: Record<string, Locale> = {};
  for (const code of languageCodes(config, raw)) {
    const content = parseFile(raw, `locales/${code}/content.json`, contentSchema, issues, pending);
    const seo = parseFile(raw, `locales/${code}/seo.json`, seoSchema, issues, pending);
    const ui = parseFile(raw, `locales/${code}/ui.json`, uiSchema, issues, pending);
    if (content && seo && ui) locales[code] = { content, seo, ui };
  }

  if (config && media) crossCheck(config, business, media, locales, issues);
  if (business) checkPlaceholderTokens(business, locales, issues);
  if (config) {
    checkLanguagesMatch(config, locales, issues);
    checkContrast(config, issues);
    checkKeywords(config, locales, warnings);
  }
  if (config && media) checkMediaFiles(config, media, options, pending);

  if (!config || !business || !media || issues.length) return { issues, pending, warnings };

  const defaultLanguage = config.languages.find((l) => l.default)!;
  return {
    data: { config, business, media, languages: config.languages, defaultLanguage, locales },
    issues,
    pending,
    warnings,
  };
}

export function formatIssues(issues: string[]): string {
  const count = `${issues.length} problem${issues.length === 1 ? '' : 's'}`;
  return `The data in ${DATA_DIR} has ${count}:\n${issues.map((i) => `  • ${i}`).join('\n')}`;
}

export function formatWarnings(warnings: string[]): string {
  const count = `${warnings.length} warning${warnings.length === 1 ? '' : 's'}`;
  return `Data check: ${count} (the build still runs):\n${warnings.map((w) => `  • ${w}`).join('\n')}`;
}

const REASON_LABEL: Record<PendingReason, string> = {
  todo: 'still test data (TODO)',
  'test-phone': 'test phone number',
  'demo-path': "the template's demo address",
  'missing-media': 'image or video file not found',
};

export function formatPending(pending: Pending[]): string {
  const groups = new Map<string, Pending[]>();
  for (const p of pending) {
    const key = `${p.file}\u0000${p.reason}`;
    groups.set(key, [...(groups.get(key) ?? []), p]);
  }
  const lines = [...groups.values()].map((group) => {
    const { file, reason } = group[0];
    const fields = group.map((p) => (p.detail ? `${p.field} (${p.detail})` : p.field)).join(', ');
    return `  • ${file}, ${REASON_LABEL[reason]} (${group.length}): ${fields}`;
  });
  return `${pending.length} value${pending.length === 1 ? '' : 's'} still need real data:\n${lines.join('\n')}`;
}
