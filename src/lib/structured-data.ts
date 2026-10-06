import type { DayCode } from './booking.ts';
import { getLocale, site } from './data.ts';
import { fillPricing } from './pricing-text.ts';
import { localeUrl, shareImage } from './seo.ts';

const DAY_NAMES: Record<DayCode, string> = {
  Su: 'Sunday',
  Mo: 'Monday',
  Tu: 'Tuesday',
  We: 'Wednesday',
  Th: 'Thursday',
  Fr: 'Friday',
  Sa: 'Saturday',
};

const HOUR = 'HUR';

function offerPricing(code: string) {
  const { business, config } = site;
  const pricing = business.pricing;
  if (!config.sections.pricing || !pricing) return undefined;
  const { slots } = getLocale(code).content.booking;
  const evening = pricing.evening && slots.evening ? { ...pricing.evening, slot: slots.evening } : undefined;
  const rate = (price: number, name?: string) => ({
    '@type': 'UnitPriceSpecification',
    ...(name ? { name } : {}),
    price,
    priceCurrency: pricing.currency,
    unitCode: HOUR,
  });
  const label = (slot: { title: string; hint: string }) => `${slot.title} (${fillPricing(slot.hint, code)})`;
  return {
    priceSpecification: evening
      ? [rate(pricing.hourlyRate, label(slots.day)), rate(evening.hourlyRate, label(evening.slot))]
      : rate(pricing.hourlyRate),
    eligibleQuantity: { '@type': 'QuantitativeValue', minValue: pricing.minimumHours, unitCode: HOUR },
  };
}

export function localBusiness(code: string) {
  const { business } = site;
  const { content, ui } = getLocale(code);
  const sameAs = Object.values(business.social).filter(Boolean);
  const pricing = offerPricing(code);
  const image = shareImage(code)?.url;
  const rates = business.pricing ? [business.pricing.hourlyRate, business.pricing.evening?.hourlyRate].filter((r): r is number => r !== undefined) : [];
  const plainMoney = (amount: number) => new Intl.NumberFormat('en', { style: 'currency', currency: business.pricing?.currency ?? 'ILS', maximumFractionDigits: 0 }).format(amount);
  const priceRange = rates.length ? [...new Set([Math.min(...rates), Math.max(...rates)])].map(plainMoney).join('–') : undefined;
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${localeUrl(site.defaultLanguage.code)}#business`,
    name: content.businessName,
    url: localeUrl(code),
    telephone: business.phone,
    ...(image ? { image } : {}),
    ...(priceRange ? { priceRange } : {}),
    address: { '@type': 'PostalAddress', addressLocality: business.city, ...(business.phone.startsWith('+972') ? { addressCountry: 'IL' } : {}) },
    geo: { '@type': 'GeoCoordinates', latitude: business.geo.lat, longitude: business.geo.lng },
    areaServed: content.area.places,
    openingHoursSpecification: business.workHours.map((hours) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: hours.days.map((day) => DAY_NAMES[day]),
      opens: hours.from,
      closes: hours.to,
    })),
    ...(sameAs.length ? { sameAs } : {}),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: ui.sections.services,
      itemListElement: content.services.map((service) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: service.title, description: service.text },
        ...pricing,
      })),
    },
  };
}
