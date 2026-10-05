import { site } from './data.ts';

export const UMAMI_SCRIPT = 'https://cloud.umami.is/script.js';

export const analyticsId = site.config.analytics.umamiWebsiteId;

export function trackAttrs(event: string, props: Record<string, string> = {}): Record<string, string> {
  if (!analyticsId) return {};
  return {
    'data-umami-event': event,
    ...Object.fromEntries(Object.entries(props).map(([key, value]) => [`data-umami-event-${key}`, value])),
  };
}

export function trackingDomains(): string {
  const host = new URL(site.business.siteUrl).hostname.replace(/^www\./, '');
  return `${host},www.${host}`;
}
