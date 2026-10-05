import { buildMessage, type DayCode } from './booking.ts';
import { whatsappHref } from './contact.ts';
import { getLocale, site } from './data.ts';

export function contactLanguage(code: string): string {
  const { contactLanguages } = site.business;
  return contactLanguages.includes(code) ? code : contactLanguages[0];
}

export function defaultWhatsappHref(code: string, serviceId = site.business.defaultService): string {
  const { business } = site;
  if (!business.pricing) return whatsappHref(business.whatsapp);
  const contact = contactLanguage(code);
  const { content, ui } = getLocale(contact);
  const service = content.services.find((s) => s.id === serviceId) ?? content.services[0];
  const text = buildMessage({
    lang: contact,
    texts: content.booking,
    durations: ui.duration,
    days: ui.days as Record<DayCode, string>,
    pricing: business.pricing,
    choice: { serviceName: service.bookingName, slot: 'day', hours: business.pricing.minimumHours },
  });
  return whatsappHref(business.whatsapp, text);
}
