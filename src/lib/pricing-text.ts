import { formatMoney, formatNumber } from './booking.ts';
import { site } from './data.ts';
import { fill } from './text.ts';

export function pricingValues(code: string): Record<string, string> {
  const pricing = site.business.pricing;
  if (!pricing) return {};
  const money = (amount: number) => formatMoney(code, amount, pricing.currency);
  return {
    hours: formatNumber(code, pricing.minimumHours),
    rate: money(pricing.hourlyRate),
    total: money(pricing.hourlyRate * pricing.minimumHours),
    ...(pricing.evening ? { eveningFrom: pricing.evening.from, eveningRate: money(pricing.evening.hourlyRate) } : {}),
    ...(pricing.cancellationFee ? { cancellationFee: money(pricing.cancellationFee) } : {}),
  };
}

export function fillPricing(text: string, code: string): string {
  return fill(text, pricingValues(code));
}
