import { z } from 'astro/zod';

export const ICONS = ['sparkle', 'broom', 'spray', 'clothes', 'washer', 'boxes', 'kitchen', 'window', 'shield', 'clock', 'pin'] as const;
export const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const;
export const FONTS = ['rubik'] as const;
export const PAYMENTS = ['bit', 'paybox', 'cash', 'transfer', 'credit'] as const;

const text = z.string().trim().min(1, 'must not be empty');
const optionalText = z.string().trim();
const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'expected a color like #12B5A6');
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
const time = z.string().regex(TIME, 'expected a time like 08:00');
const phone = z.string().regex(/^\+[1-9]\d{7,14}$/, 'expected an international number like +972501234567');
const email = z.email('expected an email address like name@example.com');
const httpsUrl = z.url({ protocol: /^https$/, error: 'expected a full address starting with https://' });
const optionalUrl = z.union([z.literal(''), httpsUrl], { error: 'expected "" or a full address starting with https://' });
const isoDate = z.iso.date('expected a date like 2026-10-05');
const langCode = z.string().regex(/^[a-z]{2,3}$/, 'expected a language code like he or en');
const imageFile = z.string().regex(/^[\w.-]+\.(jpe?g|png|webp|avif|svg)$/i, 'expected an image file name like hero.jpg');
const videoFile = z.string().regex(/^[\w.-]+\.(mp4|webm)$/i, 'expected a video file name like hero.mp4');
const altKey = z.string().regex(/^[\w-]+$/, 'expected a key from content.json → media, like hero');
const slug = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'expected an id like deep-cleaning');
const icon = z.enum(ICONS, { error: `expected one of: ${ICONS.join(', ')}` });
const day = z.enum(DAYS, { error: `expected one of: ${DAYS.join(', ')}` });
const payment = z.enum(PAYMENTS, { error: `expected one of: ${PAYMENTS.join(', ')}` });
const positive = z.number().positive('must be more than 0');

export const configSchema = z.strictObject({
  languages: z
    .array(
      z.strictObject({
        code: langCode,
        name: text,
        dir: z.enum(['rtl', 'ltr'], { error: 'expected "rtl" or "ltr"' }),
        default: z.boolean().optional(),
      }),
    )
    .min(1, 'at least one language is required')
    .refine((ls) => ls.filter((l) => l.default).length === 1, 'exactly one language must have "default": true')
    .refine((ls) => new Set(ls.map((l) => l.code)).size === ls.length, 'language codes must be unique'),
  theme: z.strictObject({
    colors: z.strictObject({
      ink: hex,
      surface: hex,
      surfaceAlt: hex,
      text: hex,
      textMuted: hex,
      primary: hex,
      primaryText: hex,
      accent: hex,
    }),
    font: z.enum(FONTS, { error: `expected one of: ${FONTS.join(', ')}` }),
    radius: z.string().regex(/^\d+(\.\d+)?(rem|em|px)$/, 'expected a size like 1.25rem'),
  }),
  sections: z.strictObject({
    services: z.boolean(),
    pricing: z.boolean(),
    why: z.boolean(),
    area: z.boolean(),
    gallery: z.boolean(),
    reviews: z.boolean(),
    faq: z.boolean(),
    finalCta: z.boolean(),
  }),
  heroVideo: z.boolean(),
  analytics: z.strictObject({
    umamiWebsiteId: z.union([
      z.literal(''),
      z.uuid('expected "" or an Umami website ID like 94db1cb1-74f4-4a40-ad6c-962362670409'),
    ]),
  }),
});

export const businessSchema = z.strictObject({
  siteUrl: httpsUrl,
  basePath: z.string().regex(/^\/([\w.-]+\/)*$/, 'expected "/" or a path like "/repo-name/"'),
  phone,
  whatsapp: phone,
  email,
  city: text,
  geo: z.strictObject({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
  pricing: z
    .strictObject({
      currency: z.string().regex(/^[A-Z]{3}$/, 'expected a currency code like ILS'),
      hourlyRate: positive,
      minimumHours: positive,
      step: positive,
      cancellationFee: positive.optional(),
      evening: z
        .strictObject({
          from: time,
          hourlyRate: positive,
        })
        .optional(),
    })
    .optional(),
  workHours: z.array(
    z
      .strictObject({
        days: z.array(day).min(1, 'at least one day is required'),
        from: time,
        to: time,
      })
      .refine((h) => !TIME.test(h.from) || !TIME.test(h.to) || h.to > h.from, {
        error: 'must be later than "from"',
        path: ['to'],
      }),
  ),
  social: z.strictObject({
    facebook: optionalUrl,
    instagram: optionalUrl,
    tiktok: optionalUrl,
    googleBusiness: optionalUrl,
  }),
  contactLanguages: z
    .array(langCode)
    .min(1, 'at least one contact language is required')
    .refine((ls) => new Set(ls).size === ls.length, 'languages must not repeat'),
  payment: z.array(payment).refine((ps) => new Set(ps).size === ps.length, 'payment methods must not repeat'),
  bookingUrl: optionalUrl,
  accessibilityStatementDate: isoDate,
});

const image = z.strictObject({ file: imageFile, alt: altKey });

export const mediaSchema = z.strictObject({
  logo: image.optional(),
  hero: z.strictObject({ file: imageFile, fileMobile: imageFile.optional(), alt: altKey }),
  heroVideo: z.strictObject({ file: videoFile, poster: imageFile }).optional(),
  about: image,
  og: z.record(langCode, imageFile),
  gallery: z.array(image),
});

const titleText = z.strictObject({ title: text, text });
const slot = z.strictObject({ title: text, hint: text, inMessage: text });
const half = (n: number) => Number.isInteger(n * 2);

export const contentSchema = z.strictObject({
  businessName: text,
  ownerName: text,
  tagline: text,
  hero: z.strictObject({
    title: text,
    subtitle: text,
    badges: z.array(text).max(4, 'at most 4 badges'),
  }),
  services: z
    .array(z.strictObject({ id: slug, icon, title: text, text, bookingName: text }))
    .min(1, 'at least one service is required')
    .refine((ss) => new Set(ss.map((s) => s.id)).size === ss.length, 'service ids must be unique'),
  pricing: z
    .strictObject({
      title: text,
      perHour: text,
      minimum: text,
      note: optionalText,
    })
    .optional(),
  booking: z.strictObject({
    generalName: text,
    slots: z.strictObject({ day: slot, evening: slot.optional() }),
    hoursGuide: z.array(
      z.strictObject({
        label: text,
        hours: positive.refine(half, 'expected whole or half hours, like 4 or 4.5'),
      }),
    ),
    message: text,
    price: z.strictObject({ single: text, split: text.optional() }),
    availability: z.strictObject({ open: text, dated: text }),
    when: z.strictObject({ date: text, time: text }),
  }),
  why: z.array(z.strictObject({ icon, title: text, text })),
  about: titleText,
  area: z.strictObject({ title: text, text, places: z.array(text).min(1, 'at least one place is required') }),
  reviews: z.array(z.strictObject({ name: text, area: text, text, date: isoDate })),
  faq: z.array(z.strictObject({ q: text, a: text })),
  finalCta: titleText,
  media: z.record(altKey, text),
});

export const seoSchema = z.strictObject({
  title: text,
  description: text,
  ogImage: text,
  share: z.strictObject({
    title: optionalText,
    description: optionalText,
    imageAlt: text,
  }),
  keywords: z.strictObject({
    primary: z.array(text).min(1, 'at least one primary keyword is required'),
    services: z.array(text),
    places: z.array(text),
    phrases: z.array(text),
  }),
});

export const uiSchema = z.strictObject({
  skipToContent: text,
  call: text,
  callNow: text,
  callsIn: text,
  whatsapp: text,
  sendWhatsapp: text,
  bookOnWhatsapp: text,
  languageSwitcher: text,
  languageNames: z.record(langCode, text),
  opensInNewTab: text,
  sections: z.strictObject({
    services: text,
    why: text,
    gallery: text,
    reviews: text,
    faq: text,
  }),
  booking: z.strictObject({
    title: text,
    service: text,
    when: text,
    hours: text,
    hoursGuide: text,
    minimum: text,
    day: text,
    time: text,
    flexible: text,
    total: text,
    preview: text,
    contactNote: text,
    send: text,
    close: text,
    onlineBooking: text,
    anyService: text,
    fewerHours: text,
    moreHours: text,
  }),
  duration: z.strictObject({
    half: text,
    one: text,
    oneAndHalf: text,
    two: text,
    twoAndHalf: text,
    other: text,
  }),
  payment: z.strictObject({
    title: text,
    ...(Object.fromEntries(PAYMENTS.map((p) => [p, text])) as Record<(typeof PAYMENTS)[number], typeof text>),
  }),
  saveContact: text,
  contact: text,
  workHours: text,
  days: z.strictObject(Object.fromEntries(DAYS.map((d) => [d, text])) as Record<(typeof DAYS)[number], typeof text>),
  social: z.strictObject({
    facebook: text,
    instagram: text,
    tiktok: text,
    googleBusiness: text,
  }),
  accessibilityStatement: text,
  testDataBanner: text,
  notFound: z.strictObject({ title: text, text, back: text }),
});

export type Config = z.infer<typeof configSchema>;
export type Language = Config['languages'][number];
export type Business = z.infer<typeof businessSchema>;
export type Media = z.infer<typeof mediaSchema>;
export type Content = z.infer<typeof contentSchema>;
export type Seo = z.infer<typeof seoSchema>;
export type Ui = z.infer<typeof uiSchema>;
export type Locale = { content: Content; seo: Seo; ui: Ui };
export type SiteData = {
  config: Config;
  business: Business;
  media: Media;
  languages: Language[];
  defaultLanguage: Language;
  locales: Record<string, Locale>;
};
