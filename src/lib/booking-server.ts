import { buildMessage, type DayCode, type Slot } from './booking.ts';
import { whatsappHref } from './contact.ts';
import { getLocale, site } from './data.ts';

export function contactLanguage(code: string): string {
  const { contactLanguages } = site.business;
  return contactLanguages.includes(code) ? code : contactLanguages[0];
}

export function defaultWhatsappHref(code: string, serviceId = site.business.defaultService, slot: Slot = 'day'): string {
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
    workHours: business.workHours,
    choice: {
      serviceName: service.bookingName,
      slot,
      hours: business.pricing.minimumHours,
      estimate: business.estimateByPhone?.includes(service.id),
    },
  });
  return whatsappHref(business.whatsapp, text);
}
