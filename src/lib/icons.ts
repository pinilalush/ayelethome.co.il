import type { ICONS } from './schema.ts';

export type ContentIcon = (typeof ICONS)[number];
export type IconName =
  | ContentIcon
  | 'phone'
  | 'whatsapp'
  | 'check'
  | 'globe'
  | 'chevron'
  | 'close'
  | 'minus'
  | 'plus'
  | 'sun'
  | 'moon'
  | 'cash'
  | 'bank'
  | 'card'
  | 'mobilepay'
  | 'userPlus'
  | 'calendar'
  | 'mail'
  | 'facebook'
  | 'instagram'
  | 'tiktok'
  | 'google';

const PHONE =
  'M8.6 3.5H6A2 2 0 0 0 4 5.6c.4 7.6 6.8 14 14.4 14.4a2 2 0 0 0 2.1-2v-2.6a1 1 0 0 0-.7-1l-3.3-1.1a1 1 0 0 0-1 .25l-1.6 1.6a12.4 12.4 0 0 1-5.1-5.1l1.6-1.6a1 1 0 0 0 .25-1L9.6 4.2a1 1 0 0 0-1-.7Z';

export const ICON_PATHS: Record<IconName, string> = {
  sparkle:
    '<path d="M10 3.5c.6 4.2 2.3 5.9 6.5 6.5-4.2.6-5.9 2.3-6.5 6.5-.6-4.2-2.3-5.9-6.5-6.5 4.2-.6 5.9-2.3 6.5-6.5Z"/>' +
    '<path d="M18 14c.3 1.6.9 2.2 2.5 2.5-1.6.3-2.2.9-2.5 2.5-.3-1.6-.9-2.2-2.5-2.5 1.6-.3 2.2-.9 2.5-2.5Z"/>' +
    '<path d="M19 3.5v3M17.5 5h3"/>',
  broom:
    '<path d="M12 2.75V11"/>' +
    '<path d="M10 11h4a1 1 0 0 1 1 1v2H9v-2a1 1 0 0 1 1-1Z"/>' +
    '<path d="M9 14l-1.6 6.3a1 1 0 0 0 1 1.2h7.2a1 1 0 0 0 1-1.2L15 14"/>' +
    '<path d="M10.6 17.5l-.5 3.9M13.4 17.5l.5 3.9"/>',
  spray:
    '<path d="M8.5 4h5a1 1 0 0 1 1 1v2.5h-7V5a1 1 0 0 1 1-1Z"/>' +
    '<path d="M7.5 5.25H5"/>' +
    '<path d="M9.5 7.5V11M12.5 7.5V11"/>' +
    '<path d="M8.5 11h6a2 2 0 0 1 2 2v6.5a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2V13a2 2 0 0 1 2-2Z"/>' +
    '<path d="M2.75 3.5h.01M2 5.25h.01M2.75 7h.01"/>',
  clothes:
    '<path d="M10 5.25a2 2 0 1 1 2 2V8.5"/>' +
    '<path d="M12 8.5l8.4 6.1c.8.6.4 1.9-.6 1.9H4.2c-1 0-1.4-1.3-.6-1.9L12 8.5Z"/>' +
    '<path d="M7 20.5h10"/>',
  washer:
    '<path d="M6 2.5h12a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-15a2 2 0 0 1 2-2Z"/>' +
    '<path d="M4 7h16"/>' +
    '<path d="M7 4.75h.01M9.5 4.75h.01"/>' +
    '<circle cx="12" cy="14" r="4.5"/>' +
    '<path d="M8.5 14.5c1.2-.8 2.3-.8 3.5 0s2.3.8 3.5 0"/>',
  boxes:
    '<path d="M3.5 13h7a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1Z"/>' +
    '<path d="M13.5 13h7a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1Z"/>' +
    '<path d="M8.5 4h7a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z"/>' +
    '<path d="M7 13v2.5M17 13v2.5M12 4v2.5"/>',
  kitchen:
    '<path d="M4.5 10h15"/>' +
    '<path d="M10.5 10a1.5 1.5 0 0 1 3 0"/>' +
    '<path d="M6 10v7.5A2.5 2.5 0 0 0 8.5 20h7a2.5 2.5 0 0 0 2.5-2.5V10"/>' +
    '<path d="M6 12.5H3.5M18 12.5h2.5"/>' +
    '<path d="M9.5 2.75c-.7.7-.7 1.3 0 2s.7 1.3 0 2M14.5 2.75c-.7.7-.7 1.3 0 2s.7 1.3 0 2"/>',
  window:
    '<path d="M5.5 3h13a1 1 0 0 1 1 1v15h-15V4a1 1 0 0 1 1-1Z"/>' +
    '<path d="M3 19h18"/>' +
    '<path d="M12 3v16M4.5 11h15"/>' +
    '<path d="M7 8.5l2-2M14.5 16.5l2-2"/>',
  shield:
    '<path d="M12 3l7 2.75v5.5c0 4.4-2.9 8.2-7 9.75-4.1-1.55-7-5.35-7-9.75v-5.5L12 3Z"/>' +
    '<path d="M9 12l2 2 4-4"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.5"/>',
  phone: `<path d="${PHONE}"/>`,
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.3 2.4 3.5 5.2 3.5 8.5s-1.2 6.1-3.5 8.5c-2.3-2.4-3.5-5.2-3.5-8.5s1.2-6.1 3.5-8.5Z"/>',
  chevron: '<path d="M6.5 9.5 12 15l5.5-5.5"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  minus: '<path d="M5 12h14"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/>',
  cash: '<rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 9.5h.01M18 14.5h.01"/>',
  bank: '<path d="M3 9.5 12 4l9 5.5"/><path d="M5 10.5v7M9.5 10.5v7M14.5 10.5v7M19 10.5v7"/><path d="M3 20h18"/>',
  card: '<rect x="2.5" y="5.5" width="19" height="13" rx="2"/><path d="M2.5 10h19M6.5 15h3"/>',
  mobilepay: '<path d="M13 9.5V4.5a2 2 0 0 0-2-2H6.5a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2H11"/><path d="M7.5 18.5h2"/><circle cx="16.5" cy="15.5" r="4.5"/><path d="M15.3 14.2h2.4M15.3 16.8h2.4M16.5 13v5"/>',
  userPlus: '<circle cx="9.5" cy="8" r="3.5"/><path d="M3 19.5a6.5 6.5 0 0 1 13 0"/><path d="M19 8v6M16 11h6"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/>',
  facebook: '<circle cx="12" cy="12" r="8.5"/><path d="M13 20.5V11a3 3 0 0 1 3-3h1"/><path d="M10 13h6"/>',
  instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="3.75"/><path d="M17.25 6.75h.01"/>',
  tiktok: '<path d="M14.5 3.5v11.25a3.25 3.25 0 1 1-3.25-3.25"/><path d="M14.5 3.5a4.5 4.5 0 0 0 4.5 4.5"/>',
  google: '<path d="M17.3 6.7A7.5 7.5 0 1 0 19.5 12h-7"/>',
  whatsapp:
    '<path d="M3.5 20.5l1.3-4.2A8.5 8.5 0 1 1 8 19.4L3.5 20.5Z"/>' +
    `<path d="${PHONE}" transform="translate(12 12) scale(0.42) translate(-12 -12)" fill="currentColor" stroke="none"/>`,
};
