import type { Business } from './schema.ts';

export type TextFile = 'content' | 'seo' | 'ui';

const PRICE_TOKENS = ['hours', 'rate', 'total', 'eveningFrom', 'eveningRate', 'cancellationFee'];

const RULES: Record<string, string[]> = {
  'content:booking.message': ['service', 'hours', 'slot', 'availability', 'price'],
  'content:booking.price.single': ['rate', 'total'],
  'content:booking.price.split': ['dayHours', 'rate', 'eveningHours', 'eveningRate', 'total'],
  'content:booking.availability.dated': ['when'],
  'content:booking.when.date': ['weekday', 'date'],
  'content:booking.when.time': ['time'],
  'ui:callsIn': ['language'],
  'ui:booking.minimum': ['hours'],
  'ui:booking.contactNote': ['name', 'language'],
};

const NEEDS_PRICING = new Set(['hours', 'rate', 'total', 'price', 'dayHours', 'eveningHours', 'eveningFrom', 'eveningRate', 'cancellationFee']);
const NEEDS_EVENING = new Set(['dayHours', 'eveningHours', 'eveningFrom', 'eveningRate']);

const TOKEN = /\{(\w+)\}/g;

export function allowedTokens(file: TextFile, path: string): string[] {
  return RULES[`${file}:${path}`] ?? (file === 'ui' ? [] : PRICE_TOKENS);
}

export function tokensIn(text: string): string[] {
  return [...text.matchAll(TOKEN)].map((m) => m[1]);
}

export function hasStrayBraces(text: string): boolean {
  return /[{}]/.test(text.replace(TOKEN, ''));
}

export function whyUnfillable(token: string, business: Business): string | undefined {
  if (NEEDS_PRICING.has(token) && !business.pricing) return 'business.json has no pricing';
  if (NEEDS_EVENING.has(token) && !business.pricing?.evening) return 'business.json has no evening rate';
  if (token === 'cancellationFee' && !business.pricing?.cancellationFee) return 'business.json has no cancellation fee';
  return undefined;
}
