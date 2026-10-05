# Landing Template — Plan

A static landing-page template built with Astro. Every business-specific detail lives in JSON files and media folders, so a new business site means: create a repo from this template, replace the data and media, push.

The first site built on it: **Ayelet**, who cleans, organizes and helps with whatever else the household needs (laundry, ironing, changing bedding, dishes…) in Beer Sheva (₪100 per hour, ₪150 per hour from 19:00, minimum 4 hours per visit). Her name and details go only into her own repo's data — the template keeps `TODO` test data.

Status: **plan for review — no code yet.**

---

## 1. Goals

- **Static only.** No backend, no database, no forms. Visitors contact the business by tapping **Call** or **WhatsApp**.
- **Template.** Code never contains business data. All of it comes from `src/data/` and `src/assets/media/`.
- **Languages.** Hebrew (default, RTL) and English from day one. Adding a language = copy a folder + one line in an array.
- **Look.** Professional, modern, very polished, with smooth animations that never slow the visitor down.
- **Converts.** One short page, no steps. Call / WhatsApp always one tap away.
- **Found on Google.** Local SEO for Beer Sheva and the surrounding area.
- **Accessible.** Meets Israeli standard IS 5568 (based on WCAG AA), with an accessibility statement page.
- **No leftovers.** The build fails if any placeholder test value is still in the data.

## 2. Stack

| Part | Choice | Why |
|---|---|---|
| Framework | **Astro** (current stable at build time) | Static by default, ships almost no JavaScript, built-in i18n routing and image optimization |
| Styling | Plain CSS with custom properties (variables), logical properties for RTL | Theme colors come from JSON; layout flips by text direction automatically |
| Images | Astro `<Picture>` with sharp | Generates AVIF/WebP in several sizes at build time |
| Fonts | Self-hosted via Fontsource (no request to Google Fonts) | Faster, no third-party requests, no privacy issue |
| Data validation | Zod schemas + a check script | Catches missing fields and placeholders before build |
| Hosting | GitHub Pages, deployed by GitHub Actions | Free for public repos, runs automatically on every push |
| Node | 24 LTS | Matches the rest of your projects |

**Commands** (Astro defaults):

| Command | What it does |
|---|---|
| `npm run dev` | Local server with live reload while working |
| `npm run build` | Runs the data check, then builds the site into `dist/` |
| `npm run preview` | Serves the built `dist/` locally to check before pushing |
| `npm run check` | Runs the data check and Astro's type check without building |

`npm run build` runs the data check first automatically (npm `prebuild` hook), so it can't be skipped by accident.

## 3. Repos and the template model

```
/docker/code/private-landings/
  landing-template/          github.com/pinilalush/landing-template   (marked "Template repository")
  <domain-of-business>/      one repo per business, named after its domain
```

**Creating a new business site:**
1. On GitHub, open `landing-template` → **Use this template** → new public repo named after the domain.
2. Clone it into `private-landings/`.
3. **Link it to the template right away, before changing anything** (`docs/NEW-SITE.md` §2): add the `template` remote, fetch, merge once with `--allow-unrelated-histories`, push. "Use this template" gives the new repo its own history, so this one merge is what lets later template fixes merge normally. Done now, while both copies are identical, it's clean; done later, git conflicts on every file the business changed.
4. Replace the contents of `src/data/` and `src/assets/media/`.
5. `npm run build` until the check passes (no placeholders left).
6. Push → set up GitHub Pages and the domain (section 14).

**Template changes don't reach existing sites automatically.** "Use this template" makes a one-time copy. Thanks to the link in step 3, bringing a template fix into a business repo is a plain merge:
```bash
git fetch template
```
```bash
git merge template/main
```

Business data merges cleanly because **the template never changes `src/data/` or `src/assets/media/` once a business has its own data there** — the rule for template work is: code in the template, data in the business repo. After a merge, look at what changed in the data (`git diff ORIG_HEAD -- src/data src/assets/media`), since a template change to a test value the business kept merges in without a conflict.

## 4. Project structure

```
landing-template/
  .github/workflows/deploy.yml   build + publish to GitHub Pages
  astro.config.mjs               reads site URL and languages from src/data
  package.json
  scripts/check-data.mjs         validation + placeholder check
  docs/
    PLAN.md                      this file
    STEPS.md                     the step-by-step build list
    MEDIA-BRIEF.md               every image/video with its Google prompt (written in the media phase)
    NEW-SITE.md                  step-by-step for starting a new business
  public/
    media/                       videos only (not processed by Astro)
  src/
    data/                        ← EVERYTHING business-specific
      config.json
      business.json
      media.json
      locales/
        he/ content.json  seo.json  ui.json
        en/ content.json  seo.json  ui.json
    assets/media/                ← business images (optimized at build)
    components/                  sections and UI parts
    layouts/                     base layout (html lang/dir, head, SEO tags)
    lib/                         data loading, i18n helpers, WhatsApp link builder
    pages/
      [...lang]/index.astro      home page per language
      [...lang]/accessibility.astro
      404.astro
      favicon.svg.ts, robots.txt.ts   generated from the data (theme colors; sitemap address)
    styles/                      global CSS, theme variables, animations
```

Note: images live in `src/assets/media/` (not `public/`) so Astro can optimize them. Videos go in `public/media/` because Astro doesn't process video.

## 5. Data files

All JSON. Text that changes per language is in `locales/<lang>/`; facts that don't change per language are in `business.json`.

### 5.1 `config.json` — languages, theme, sections

```json
{
  "languages": [
    { "code": "he", "name": "עברית", "dir": "rtl", "default": true },
    { "code": "en", "name": "English", "dir": "ltr" },
    { "code": "ru", "name": "Русский", "dir": "ltr", "deviceRedirect": true }
  ],
  "theme": {
    "colors": {
      "ink": "#0B1426",
      "surface": "#FFFFFF",
      "surfaceAlt": "#F3F7F9",
      "text": "#14202E",
      "textMuted": "#4A5868",
      "primary": "#12B5A6",
      "primaryText": "#04201D",
      "accent": "#7FE3D6"
    },
    "font": "rubik",
    "radius": "1.25rem"
  },
  "sections": {
    "services": true,
    "pricing": true,
    "why": true,
    "area": true,
    "gallery": false,
    "reviews": false,
    "faq": true,
    "finalCta": true
  },
  "heroVideo": false,
  "analytics": {
    "umamiWebsiteId": ""
  }
}
```

- `analytics.umamiWebsiteId` — empty means no counting at all; filling in the business's Umami site ID turns it on (section 16).
- `font` is chosen from the fonts installed in the template (Rubik to start; more can be added to the template later). It must cover every language on the site.
- The check script verifies **color contrast** (text on background, button text on button) meets WCAG AA, so a future business can't pick unreadable colors by accident.

### 5.2 `business.json` — facts that don't change by language

```json
{
  "siteUrl": "https://pinilalush.github.io",
  "basePath": "/landing-template/",
  "phone": "+972500000000",
  "whatsapp": "+972500000000",
  "email": "TODO@example.com",
  "city": "Beer Sheva",
  "geo": { "lat": 31.2520, "lng": 34.7915 },
  "pricing": {
    "currency": "ILS",
    "hourlyRate": 100,
    "minimumHours": 4,
    "step": 0.5,
    "cancellationFee": 100,
    "evening": {
      "from": "19:00",
      "hourlyRate": 150
    }
  },
  "workHours": [
    { "days": ["Su", "Mo", "Tu", "We", "Th"], "from": "08:00", "to": "23:00" },
    { "days": ["Fr"], "from": "08:00", "to": "13:00" }
  ],
  "social": {
    "facebook": "",
    "instagram": "",
    "tiktok": "",
    "googleBusiness": ""
  },
  "contactLanguages": ["he"],
  "payment": ["bit", "paybox", "cash", "transfer"],
  "defaultService": "household",
  "bookingUrl": "",
  "accessibilityStatementDate": "2026-10-05"
}
```

- Phone numbers are stored in international format (`+972…`); the site shows them in local format (`050-000-0000`).
- `email` is optional. Without it, the footer, the contact card and the accessibility statement offer phone and WhatsApp only.
- `pricing` holds only numbers; the words around them ("per hour", "minimum") come from `content.json` per language. The minimum visit price is calculated by the site (4 × ₪100 = ₪400 by day, 4 × ₪150 = ₪600 in the evening), so changing a rate updates everything.
- `pricing.cancellationFee` — optional one-time fee for cancelling a booked visit (Ayelet: ₪100). Shown in the FAQ through `{cancellationFee}`; a business without one leaves it out.
- `pricing.step` — how extra time is charged after the minimum, in hours: `0.5` means by the half hour, so the booking panel offers 4, 4.5, 5….
- **A visit that crosses `evening.from`** is split: the hours before 19:00 at the day rate, the hours after at the evening rate (e.g. 17:00–21:00 = 2 × ₪100 + 2 × ₪150 = ₪500). Same rates every work day, Friday and holiday eves included.
- `pricing.evening` is optional: a business without an evening rate leaves it out, and the day/evening choice (section 7) disappears. If it's there, the check fails unless at least one work day leaves room for a full minimum-length visit starting at `evening.from` (Ayelet's test data: 4 hours from 19:00, so until 23:00).
- `workHours` are the times she works (not shop opening hours). They're shown in the footer and used in the structured data for Google.
- Empty social links are simply not shown.
- `contactLanguages` — the languages she speaks with customers, first one is the main one (section 6). Each must be one of the site's languages.
- `defaultService` — the `id` of the service a booking starts with when the customer didn't come from a service card (Ayelet: `household`, ניהול משק הבית). It's also the service in the default WhatsApp message. The check fails if it isn't one of the services in `content.json`.
- `bookingUrl` — optional online booking page (e.g. her free Cal.com page). Empty means hidden; filled in, a small "or choose a time online" link appears in the booking panel and the footer. WhatsApp stays the main way to book.
- `payment` — how customers can pay, from a fixed list: `bit`, `paybox`, `cash`, `transfer`, `credit`. Shown as small labeled icons near the price; an empty list hides them. Generic icons with the name, not the companies' logos.
- `siteUrl` + `basePath` are where the site actually lives, because the site uses them for its QR code, contact card and the addresses it gives search engines. While testing on GitHub: `https://pinilalush.github.io` + `/<repo>/`. Once the domain is connected: `https://<domain>` + `/`. The template itself keeps its demo address (`https://pinilalush.github.io` + `/landing-template/`), and the data check counts the template's demo path `/landing-template/` as test data, so a business site can't go live with it by mistake (only the template uses that path).

### 5.3 `locales/<lang>/content.json` — business text

```json
{
  "businessName": "TODO: שם העסק",
  "ownerName": "TODO: שם בעלת העסק",
  "tagline": "TODO: משפט מפתח קצר",
  "hero": {
    "title": "TODO: כותרת ראשית",
    "subtitle": "TODO: משפט משנה",
    "badges": ["TODO", "TODO", "TODO"]
  },
  "services": [
    {
      "id": "regular",
      "icon": "sparkle",
      "title": "ניקיון שוטף",
      "text": "TODO",
      "bookingName": "לניקיון שוטף"
    }
  ],
  "pricing": {
    "title": "מחיר",
    "perHour": "לשעה",
    "minimum": "מינימום {hours} שעות לביקור",
    "note": "TODO: מה כלול במחיר"
  },
  "booking": {
    "slots": {
      "day": { "title": "שעות היום", "hint": "עד {eveningFrom}", "inMessage": "בשעות היום" },
      "evening": { "title": "שעות הערב", "hint": "מ־{eveningFrom}", "inMessage": "בשעות הערב" }
    },
    "hoursGuide": [
      { "label": "TODO: דירת 2–3 חדרים", "hours": 4 },
      { "label": "TODO: דירת 4–5 חדרים", "hours": 6 }
    ],
    "message": "היי, אשמח להזמין אותך {service} ל־{duration} {slot}. {availability} הבנתי שהמחיר {price}.",
    "price": {
      "single": "{rate} לשעה, כלומר {total}",
      "split": "{dayDuration} × {rate} + {eveningDuration} × {eveningRate}, כלומר {total}"
    },
    "availability": {
      "open": "מתי את פנויה?",
      "dated": "רציתי לבדוק אם את פנויה {when}, ואם לא, מתי כן נוח לך?"
    },
    "when": { "date": "ביום {weekday} {date}", "time": "מ־{time}" }
  },
  "why": [
    { "icon": "shield", "title": "TODO", "text": "TODO" }
  ],
  "about": { "title": "TODO", "text": "TODO" },
  "area": {
    "title": "אזורי שירות",
    "text": "TODO",
    "places": ["באר שבע"]
  },
  "reviews": [],
  "faq": [
    { "q": "TODO", "a": "TODO" }
  ],
  "finalCta": { "title": "TODO", "text": "TODO" },
  "accessibilityService": "TODO",
  "media": { "hero": "TODO", "about": "TODO" }
}
```

- **One WhatsApp message pattern for the whole site** (`booking.message`), built from the customer's choices in the booking panel (section 7). Each service only gives its short name for the message (`bookingName`, e.g. "לניקיון שוטף"); buttons that aren't for a specific service start with `defaultService` from `business.json`.
- **The message asks, it doesn't assume.** With no day chosen: "…מתי את פנויה?". With a day and/or time: "רציתי לבדוק אם את פנויה ביום ג׳ 14.10 מ־19:00, ואם לא, מתי כן נוח לך?" — so the customer suggests a time and she confirms or offers another.
- Full examples:
  - defaults (one tap): "היי, אשמח להזמין אותך לניהול משק הבית ל־4 שעות בשעות היום. מתי את פנויה? הבנתי שהמחיר 100 ₪ לשעה, כלומר 400 ₪."
  - with choices: "היי, אשמח להזמין אותך לניקיון שוטף ל־4.5 שעות בשעות הערב. רציתי לבדוק אם את פנויה ביום ג׳ 14.10 מ־19:00, ואם לא, מתי כן נוח לך? הבנתי שהמחיר 150 ₪ לשעה, כלומר 675 ₪."
  - crossing 19:00: "היי, אשמח להזמין אותך לניקיון שוטף ל־4 שעות בשעות היום. רציתי לבדוק אם את פנויה ביום ג׳ 14.10 מ־17:00, ואם לא, מתי כן נוח לך? הבנתי שהמחיר שעתיים × 100 ₪ + שעתיים × 150 ₪, כלומר 500 ₪."
- **The message is always written in a language she speaks** (`business.json` → `contactLanguages`, section 6), so it's built from that language's `booking` texts even when the visitor reads the site in English or Russian.
- `hoursGuide` is the "how many hours do I need?" list shown next to the hours selector; tapping a line sets the hours. Real numbers come from her.
- **Placeholders**, filled in from `business.json` → `pricing` and formatted for the language, so changing a price in one place updates every text:
  - `{hours}` — the minimum hours (4), as a plain number (the message uses `{duration}` instead)
  - `{rate}`, `{total}` — the day rate and minimum total (100 ₪, 400 ₪) in normal text; in the message, the chosen slot's rate and chosen hours × rate
  - `{eveningFrom}` — when the evening rate starts (19:00); `{eveningRate}` — the evening hourly rate (150 ₪)
  - `{cancellationFee}` — the one-time cancellation fee (100 ₪)
  - message only: `{service}`, `{duration}`, `{slot}`, `{availability}`, `{when}`, `{weekday}`, `{date}`, `{time}`, `{price}`, and inside `price.split`: `{dayDuration}`, `{eveningDuration}`
  - `{duration}`, `{dayDuration}` and `{eveningDuration}` carry the number **with** the right word for the language, from `ui.json` → `duration` (Hebrew: חצי שעה, שעה, שעה וחצי, שעתיים, שעתיים וחצי, 3 שעות…; Russian uses the short "ч." for any number), so a split never reads "1 שעות"
  - without an evening rate, `{slot}` is empty and the day/evening choice isn't shown
- The check script fails if a text uses a placeholder whose value is missing (e.g. `{eveningRate}` with no evening rate), or a placeholder name it doesn't know (a typo like `{rte}`).
- `reviews` stays empty (section hidden) until there are real reviews from real customers. Each review will hold the customer's first name, area, text, and the date.

### 5.4 `locales/<lang>/seo.json` — search and sharing

```json
{
  "title": "TODO",
  "description": "TODO",
  "ogImage": "og-he",
  "share": {
    "title": "TODO",
    "description": "TODO",
    "imageAlt": "TODO"
  },
  "keywords": {
    "primary": [],
    "services": [],
    "places": [],
    "phrases": []
  }
}
```

Google ignores the `keywords` meta tag, so this list isn't just pasted into a tag. It's the **source list for writing the page text**: headings, service descriptions, FAQ answers, image alt text and structured data are written to include these terms naturally. The check script warns if a `primary` keyword doesn't appear anywhere in the visible content.

Starting keyword list (Hebrew), to confirm with her — she should only list services she actually does:

- **Primary:** ניהול משק בית בבאר שבע, ניקיון בתים בבאר שבע, סידור וארגון הבית בבאר שבע, מארגנת בתים בבאר שבע
- **Services:** ניהול משק בית, עזרה במשק הבית, עוזרת משק בית, כביסה וגיהוץ, גיהוץ, החלפת מצעים, ניקיון שוטף, ניקיון יסודי, ניקיון דירה, ניקיון לפני כניסה לדירה, ניקיון אחרי מעבר דירה, ניקיון אחרי שיפוץ, ניקיון לפני פסח, ניקיון לחגים, ניקיון מטבח, ניקיון חלונות, ניקיון חדרי רחצה, סידור ארונות, סידור ארון בגדים, ארגון מטבח, סידור מזווה, סידור חדרי ילדים, אריזה ופריקה במעבר דירה
- **Phrases people search** (used for search only, not on the page): עוזרת בית בבאר שבע, מנקה בבאר שבע, ניקיון דירה באר שבע מחיר, מסדרת בתים, סידור בית אחרי מעבר, עזרה בניקיון הבית, ניקיון בית לפני אירוע
- **Places (to verify with her):** באר שבע — רמות, נווה זאב, נווה נוי, נחל עשן, נחל בקע, הכלניות, סיגליות, העיר העתיקה, שכונות א׳–ו׳, ט׳, י״א. For now Ayelet serves Beer Sheva only; nearby towns (עומר, להבים, מיתר…) can be added to `area.places` and the keywords later.

English list covers the same services, plus the spellings people use for the city: **Beer Sheva, Be'er Sheva, Beersheba, Beer-Sheva**.

### 5.5 `locales/<lang>/ui.json` — fixed interface text

Text that's the same for any business: "Call now", "Send a WhatsApp message", "Services", "Frequently asked questions", "Accessibility statement", "Skip to content", language switcher labels, screen-reader labels, the accessibility statement template text, the booking panel's labels ("How many hours?", "Day (optional)", "Total", "Send on WhatsApp"), the names of the languages, the payment method names, "Save my number", and the contact-language notes ("The message will be sent in Hebrew", "Calls in Hebrew"). A new business normally doesn't edit this file; a new language does.

### 5.6 `media.json` — every image and video

```json
{
  "hero": { "file": "hero.jpg", "fileMobile": "hero-mobile.jpg", "alt": "hero" },
  "heroVideo": { "file": "hero.mp4", "poster": "hero.jpg" },
  "about": { "file": "about.jpg", "alt": "about" },
  "og": { "he": "og-he.jpg", "en": "og-en.jpg", "ru": "og-ru.jpg" },
  "gallery": []
}
```

`alt` values are **keys** into `content.json` (`"media": { "hero": "…" }`), so image descriptions are translated like everything else.

**`logo` is optional.** Without it, the site shows a text logo: a sparkle mark in the theme color next to the business name — a permanent option for businesses without a logo, and the template default. A business with a logo adds `"logo": { "file": "logo.svg", "alt": "logo" }`, the file in `src/assets/media/`, and the alt text in each `content.json` → `media`.

## 6. Languages and RTL

- **Languages for Ayelet's site:** Hebrew (default), English and **Russian** — Beer Sheva has a large Russian-speaking community. I draft the Russian; a native speaker checks it before launch.
- **URLs:** default language at `/`, others at `/<code>/` (e.g. `/en/`, `/ru/`). Each language is a separate real page, so Google indexes each one.
- **Direction:** the layout sets `<html lang="he" dir="rtl">` from `config.json`. All CSS uses logical properties (`margin-inline-start`, `padding-inline`, `inset-inline-end`), so nothing needs rewriting for RTL. Directional icons (arrows) flip automatically.
- **Device language:** on a visitor's **first** visit to `/`, a small inline script reads `navigator.languages` in order. The first entry that is the default language or a language marked `"deviceRedirect": true` in `config.json` decides: a marked language goes to its URL, the default stays. Anything else → the default stays. **Only Russian is marked** (Pini, 2026-10-06): many Israelis use their phones and computers in English but read Hebrew, so they get Hebrew, and English is one click away in the switcher.
- **Manual choice wins:** the language switcher is always visible in the header. When a visitor picks a language, it's remembered in the browser, and device detection never overrides it again.
- **Google:** crawlers send no language preference, so they always see the default at `/`. `hreflang` tags on every page point to all language versions, plus `x-default`.
- **Adding a language:**
  1. Copy `src/data/locales/he/` to `src/data/locales/<code>/` and translate the three files.
  2. Add `{ "code": "<code>", "name": "…", "dir": "rtl" | "ltr" }` to `languages`.
  3. Add the OG image for it in `media.json`.
  4. `npm run build` — the check script fails if any key is missing compared with the default language.
  5. Add it to `business.json` → `contactLanguages` only if the business actually speaks it.
- **Contact language vs. site language.** The site can be in any language, but she answers WhatsApp and calls only in the languages in `business.json` → `contactLanguages` (Ayelet: Hebrew only).
  - The WhatsApp message is built in the visitor's language if she speaks it, otherwise in her main contact language. A Russian visitor's message goes in Hebrew.
  - In that case the booking panel shows the message **in the visitor's language first**, so they understand every detail (service, hours, day, time, price), with a note: "Ayelet speaks Hebrew, so this is sent in Hebrew". The Hebrew text that will actually be sent is shown under it.
  - Next to the Call button on those pages: "Calls in Hebrew".
- **Mixed text:** phone numbers and English words inside Hebrew are wrapped so they don't get scrambled by the bidirectional algorithm (`dir="ltr"` on phone numbers, `<bdi>` where needed).

## 7. Page and sections

One page per language, short, built for phones first. No forms, no steps.

1. **Header** — logo/business name, language switcher, Call button (from 960px wide; below that the bottom bar has it). Always one row: on phones (under 768px) the language switcher is a small globe button that opens a menu; from 768px the languages show as pills. Stays at the top while scrolling and turns frosted and slimmer — only its background changes, so the page never jumps.
2. **Hero** — headline, one supporting line, 3 short badges (e.g. "reliable and responsible", "thorough", "Beer Sheva and area"), **Call** and **WhatsApp** buttons. Optional background video.
3. **Services** — cards with icon, short text, and a WhatsApp button that opens the booking panel with that service already selected.
4. **Price** — two cards side by side (stacked on phones): **Daytime** (until 19:00) · ₪100 per hour · minimum 4 hours = **₪400**, and **Evening** (from 19:00) · ₪150 per hour · minimum 4 hours = **₪600**. Each card has its own WhatsApp button that opens the booking panel with that time already selected, plus a short line on what's included and the payment methods. A clear price up front saves her the "how much?" messages and filters out visitors who aren't a fit. The same prices appear in the FAQ ("How much does it cost?").
5. **Why her** — three short points with icons, plus a short "about" line and her photo.
6. **Service area** — the places she serves, as chips, with a stylized area graphic (no embedded Google Map: it's heavy and loads third-party cookies).
7. **Gallery** *(off until real photos)*.
8. **Reviews** *(off until real reviews)*.
9. **FAQ** — 5–7 short questions (accordion), written around search keywords.
10. **Final call-to-action** — one line + Call / WhatsApp.
11. **Footer** — contact, work hours, payment methods, social links, **Save my number** (downloads a contact card, so her number is saved in one tap), accessibility statement link.

**Always within reach:**
- **Phones and portrait tablets (under 960px):** a bar fixed to the bottom of the screen with **Call | WhatsApp**, side by side, large tap targets. It slides up once the main section's own Call/WhatsApp buttons scroll out of view (so the two actions never show twice), and stays visible from then on; without JavaScript it's simply always visible.
- **Desktop:** a floating WhatsApp button in the corner (it moves to the correct side in RTL/LTR).

**Other pages:** `/accessibility` (statement, per language) and a styled 404.

**The booking panel.** Every WhatsApp button opens one small panel that builds the message from a few taps, so the customer sees the price before sending anything:
1. **Service** — already selected when they came from a service card; otherwise it starts on the default service (`defaultService`, Ayelet: household management). There's no "not decided yet" option.
2. **Day or evening** — two big buttons with their rates (day ₪100/hour, evening ₪150/hour from 19:00). Already selected when they came from a price card.
3. **How many hours** — a − 4 + stepper that starts at the minimum and moves by `pricing.step` (half hours: 4, 4.5, 5…). The total updates live: "4.5 שעות × 150 ₪ = 675 ₪". Next to it, the "how many hours do I need?" guide (`booking.hoursGuide`); tapping a line sets the hours.
4. **Day (optional)** — the next 14 days as buttons, only days she works; evening is disabled on days whose work hours end before 19:00 (e.g. Friday).
5. **Start time (optional)** — every half hour inside her work hours for that day, so the whole visit fits before her work day ends. Daytime lists start times before 19:00, evening from 19:00. A daytime visit may run past 19:00: the price then splits automatically and shows it, e.g. "2 שעות × 100 ₪ + 2 שעות × 150 ₪ = 500 ₪".
6. **Message preview** — in the visitor's language first, plus the Hebrew that will be sent when the visitor's language isn't hers (section 6) — then one big **Send on WhatsApp** button.

- **Everything starts filled in** (the default service, daytime, 4 hours, no day), so a customer can still send with **one tap**. The extra choices never become required steps.
- **The message asks whether she's free** at the chosen day/time and, if not, when she is (section 5.3) — the customer suggests, she confirms.
- **Always in her language** (section 6): the message is built in a language she speaks, with a note and a translation for visitors in other languages.
- **Built in the browser** with a small script (no server), from texts and prices placed in the page at build time.
- **Looks and feels light:** a bottom sheet on phones, a small dialog on desktop; closes with Esc, a tap outside, or the phone's back button.
- **Accessible:** a real dialog, focus moves into it and back, every control labeled, works with keyboard and screen readers.
- **Without JavaScript**, the buttons still work as plain links with the default message (the button's service or the default one, daytime, 4 hours).
- If a business has no evening rate, the day/evening choice isn't shown.
- If `bookingUrl` is filled in, the panel ends with a small "or choose a time online" link to it.

**Prices** are on by default (`sections.pricing`); a future business that doesn't want to show prices turns the section off and the FAQ answer comes from its own `content.json`.

## 8. Design direction

"Professional, modern, very cool" — and it must still feel *clean*, since that's what she sells.

- **Hero:** deep ink-navy background with a soft aqua/mint glow, large bold Hebrew headline, frosted-glass badges.
- **Content sections:** bright white and very light cool-gray, with aqua accents — the "freshly cleaned" feel.
- **Type:** Rubik (variable weight, Hebrew + Latin + Cyrillic, also Arabic if ever added), big confident headings, comfortable reading size for body text. Heebo was the first choice but has no Cyrillic, so Russian would have fallen back to the phone's default font.
- **Shapes:** rounded cards, subtle depth, thin borders, plenty of space.
- **Icons and illustrations:** custom SVG set in one consistent line style (sparkle, broom, spray bottle, folded clothes, boxes, kitchen, window, shield, clock, map pin).

**Animation**
- Sections fade/slide in as they enter the screen (CSS scroll-driven animations, with a small IntersectionObserver fallback).
- A light "shine" sweeps across the primary buttons and the hero headline once.
- Floating sparkle particles in the hero (SVG/CSS, few and light).
- Cards lift slightly on hover (desktop) and press (phone).
- Everything uses only `transform` and `opacity`, so it stays smooth on cheap phones.
- **`prefers-reduced-motion`** turns all of it off, and the hero video too.

**Before building every section:** I'll build **two hero variations** first, you pick one (or a mix), and then the rest of the page follows that direction.

## 9. Responsive — every screen, every device

The site has to look designed (not just "fit") on every phone, tablet, laptop and large screen, in portrait and landscape, in both RTL and LTR.

**How it's built**
- **Mobile first.** Base CSS is for the smallest phone; larger screens add layout, never the other way round.
- **Fluid, not stepped.** Font sizes, spacing and gaps scale smoothly with the screen using `clamp()`, so there's no size where things suddenly jump or look cramped.
- **Breakpoints only where the layout really changes** (e.g. services: 1 column → 2 → 3), not per device.
- **Components adapt to their own space** (CSS container queries), so a service card looks right whether it's in a narrow column or a wide row.
- **Comfortable width on big screens.** Content has a maximum width and readable line length; backgrounds and the hero stretch edge to edge, so a 27" monitor looks intentional, not empty.
- **Long text never breaks the layout:** long business names, long Hebrew/English words and phone numbers wrap safely; headings are balanced over lines.

**Phones**
- Smallest supported width: **320px** (older small phones) with nothing cut off or overflowing sideways.
- **Notches and home bars:** the bottom Call | WhatsApp bar and header respect the phone's safe areas (`env(safe-area-inset-*)`), so nothing hides behind the notch or the iPhone home indicator.
- **Mobile browser bars:** the hero uses dynamic viewport units (`svh`/`dvh`), so it doesn't jump when Safari/Chrome show or hide their address bar.
- **Landscape phones:** the hero shrinks to fit and the bottom bar gets compact, so content stays visible.
- **Zoom is never blocked** (no `user-scalable=no` / `maximum-scale`), which is also an accessibility requirement.

**Touch vs mouse**
- Hover effects only apply on devices that really hover (`@media (hover: hover)`); on touch screens the same elements get a press effect instead.
- Nothing important is hidden behind hover.
- All tap targets at least 44×44 px with spacing between them.

**Tablets and foldables**
- Portrait and landscape both get proper layouts (not a stretched phone or a squeezed desktop).
- The bottom bar shows on tablets in portrait; in landscape the header's Call button and the floating WhatsApp button take over.

**Images on every screen**
- Each image is generated in several sizes and modern formats; the browser downloads only the size that screen needs, including sharp versions for high-density (retina) screens.
- **Different crop for phones:** the hero has a portrait crop for phones and a wide crop for desktop (`media.json` → `hero.fileMobile`), so the subject is never cut off.
- Icons and illustrations are SVG, so they're sharp at any size.
- Space for each image is reserved before it loads, so the page doesn't jump while loading.

**Browsers:** current and previous major versions of Chrome, Safari (iOS and macOS), Firefox, Edge and Samsung Internet. Newer CSS features (like scroll-driven animations) have a fallback where a browser doesn't support them yet.

**Test matrix** — checked at the end of every build step, in every language (Hebrew right-to-left, English and Russian left-to-right):

| Group | Widths (px) |
|---|---|
| Small phones | 320, 360 |
| Common phones | 375, 390, 412, 430 |
| Phones landscape | 667×375, 844×390, 932×430 |
| Tablets | 768, 820 portrait · 1024, 1180 landscape |
| Laptops | 1280, 1366, 1440 |
| Desktop / large | 1920, 2560 |

I'll check these in the browser and send you screenshots of each; you check on real devices (at least one Android phone, one iPhone, one tablet).

## 10. Contact links

- **Call:** `tel:+972…` from `business.json`.
- **WhatsApp:** `https://wa.me/972…?text=<message>`, the message built by the booking panel (section 7) in her contact language, URL-encoded.
- **Online booking (optional):** `bookingUrl` from `business.json`, opened in a new tab; not shown when empty.
- **Save my number:** a contact card file (`contact.vcf`) made at build time from `business.json` and `content.json`: business name, her name, phone, WhatsApp, email and the site address.
- **QR code:** `qr.svg` (for print) and `qr.png`, made at build time, pointing to the site with `?utm_source=qr`, so Umami can count visits from printed codes (the language redirect keeps the tag). Not shown on the page; it's for flyers, business cards and fridge magnets. The address is listed in `docs/NEW-SITE.md`.
- Phone numbers display in local format and are readable by screen readers.

## 11. SEO

- `<title>` and description per language from `seo.json`.
- Canonical URL, `hreflang` for every language plus `x-default`.
- Open Graph + Twitter card tags, OG image per language (1200×630) — see **Share preview** below.
- **Structured data (JSON-LD):** `LocalBusiness` with name, phone, area served (every place in `area.places`), opening hours from `workHours`, geo, social links (`sameAs`), and the services as an offer catalog with both hourly prices (₪100 by day, ₪150 from 19:00, from `business.json`). Reviews are only added to structured data once real reviews exist.
- Sitemap with all language versions (`@astrojs/sitemap`), `robots.txt`.
- Headings in the right order (one `h1`), real text (not text inside images), alt text from keywords.
- Performance counts for ranking: target **Lighthouse 95+** in all four categories on mobile.

**Outside the site (biggest effect for local search):** a **Google Business Profile** for her business, with the site link, photos, hours and reviews. The site links to it when `social.googleBusiness` is set. I'll write the steps when we get there.

### Share preview

When someone pastes the link into Facebook, WhatsApp, Instagram messages, LinkedIn or X, the app shows a card built from the page's tags. The goal: just pasting the link makes a good-looking post, with no need to add a photo or text.

**What the card shows, and where it comes from**
- **Image:** a designed share image per language (`media.json` → `og`), 1200×630.
- **Title:** `seo.json` → `share.title` — written to invite a click ("בית נקי ומסודר בבאר שבע"), can differ from the Google title.
- **Description:** `seo.json` → `share.description` — one line with the offer and price, e.g. "ניקיון וסידור בתים · 100 ₪ לשעה · מזמינים בוואטסאפ". Uses `{rate}`/`{hours}` like the WhatsApp messages.
- **Site name and link:** the business name and domain.
- If `share.title` or `share.description` is empty, the SEO title/description are used.

**Tags on every page:** `og:type`, `og:site_name`, `og:title`, `og:description`, `og:url`, `og:locale` (`he_IL` / `en_US`) with `og:locale:alternate` for the other languages, `og:image` (full absolute URL) with `og:image:width`, `og:image:height`, `og:image:type` and `og:image:alt`, and `twitter:card` = `summary_large_image`. Width and height are included so Facebook shows the image even the first time a link is shared.

**The share image**
- Design: the hero photo with a dark overlay, the logo/business name, the tagline, the price (₪100 per hour) and the area, in the site's colors and font. One per language.
- **1200×630 JPEG, kept small (target under 300 KB)** — WhatsApp is known to skip large preview images.
- **Important content in the center:** WhatsApp and some apps crop the image to a small square, so the name and price must still read in a centered square.
- **Generated from the data,** so every new business gets its own share image without design work. The exact method is chosen in step 6.3; it must render Hebrew right-to-left correctly.

**Instagram:** Instagram doesn't show link previews in regular posts, and links in captions aren't clickable. The link is used in the **bio** and in **story link stickers**; Instagram messages (DMs) do show the preview card.

**After launch, and every time the image or text changes:** run the link through Facebook's **Sharing Debugger** and click "Scrape Again", because Facebook (and WhatsApp) cache the preview. I'll include this in the launch steps.

## 12. Accessibility (IS 5568 / WCAG AA)

Built in, not added on:
- Semantic HTML, landmarks, one `h1`, logical heading order.
- Full keyboard use, visible focus, "skip to content" link.
- Color contrast checked automatically from `config.json` (section 5.1).
- Text resizes to 200% without breaking.
- Every image has a translated alt text; decorative images are hidden from screen readers.
- Tap targets at least 44×44 px.
- FAQ accordion with proper ARIA states.
- `prefers-reduced-motion` respected; no autoplaying sound; hero video muted, pausable.
- `lang` and `dir` correct on every page.

**Accessibility statement page** per language: what's accessible, known limitations, how to report an accessibility problem (the business's own phone, WhatsApp and, when set, email from `business.json`), a paragraph on the accessibility of the service written for each business (`content.json` → `accessibilityService`: whether there's a place open to the public and how to ask for an adjustment), and the date. No accessibility coordinator: the law requires one only from 25 employees. Template text in `ui.json`, details from the data.

**No third-party "accessibility overlay" widget.** They don't make a site compliant and often break screen readers.

**No accessibility menu.** Regulation 35 requires the site itself to meet IS 5568 and to publish an accessibility statement; it doesn't require a menu. Many Israeli sites show one, but it isn't an obligation, so we don't build it.

**Note:** I'll build the site to the standard, but if she needs formal legal confirmation that her obligations are met, that's for an accessibility consultant.

## 13. Placeholder protection

- Test values all start with **`TODO`** (in any text field) or use the **test phone `+972500000000`**.
- `scripts/check-data.mjs` runs before every build and **fails the build** with a list of exact file + field for:
  - any value starting with `TODO`
  - the test phone number anywhere
  - a missing required field (Zod schema)
  - a language missing keys that the default language has
  - a `siteUrl` that still contains `TODO`, or the template's own demo path (`basePath` `/landing-template/`)
  - color contrast below WCAG AA
  - a file in `media.json` that doesn't exist in `src/assets/media/`
- `npm run dev` shows the same list as warnings, and a small banner on the page saying how many placeholders are left, so you can work with test data.
- To test a build locally while data is still fake: `ALLOW_PLACEHOLDERS=1 npm run build`. The override also allows missing image and video files (they arrive in phase 6), so demos can be built before then; a real build without it still stops on any missing file.
- **The template repo itself** has only test data, but we still want to see it live. The workflow reads `ALLOW_PLACEHOLDERS` from a **repository variable** (Settings → Secrets and variables → Actions → Variables), which is set **only in `landing-template`**. Repos created with "Use this template" copy files, not settings, so a business repo never has it unless someone adds it deliberately.
- Any build with placeholders allowed shows a clear **"Test data — not a real business"** banner and a `noindex` tag, so Google never indexes the demo.

## 14. Deployment and domain

**GitHub Actions workflow** (`.github/workflows/deploy.yml`): on every push to `main`, uses Astro's official deploy action to build and publish `dist/` to GitHub Pages. Part of the template — every new site gets it.

**One-time per repo (you):**
1. *Settings → Pages → Source:* **GitHub Actions**.
2. *Settings → Pages → Custom domain:* the domain, then tick **Enforce HTTPS** once the certificate is ready.
3. In your GitHub account settings: **verify the domain** (Settings → Pages → Add a domain). This stops anyone else from pointing a GitHub Pages site at it.

**DNS at the domain registrar (you):**
- Apex domain (`example.co.il`): `A` records to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (and the matching `AAAA` records GitHub lists).
- `www`: `CNAME` to `pinilalush.github.io`.
- I'll re-check these values against GitHub's current docs when we reach this step.

**Before the domain is bought:** the site can be tested at `https://pinilalush.github.io/<repo>/` by setting `siteUrl` to `https://pinilalush.github.io` and `basePath` to `/<repo>/` in `business.json`; when the domain is connected they change to `https://<domain>` and `/`.

## 15. Media

**Built as code (by me):** the text logo (used when there's no logo file), icon set, illustrations, sparkle/shine effects, section dividers, the service-area graphic, favicon.

**Photos and video (Google image and video tools, by you with my prompts):**
- `hero.jpg` (wide, desktop) and `hero-mobile.jpg` (portrait, phones) — bright, tidy, modern living room in an Israeli apartment, morning light, no people's faces.
- `about.jpg` — **must be a real photo of her** (not AI), when she's ready. Until then the section uses an illustration.
- `og-he.jpg`, `og-en.jpg`, `og-ru.jpg` — social share images (1200×630), generated from the hero image + business data (section 11, **Share preview**).
- `hero.mp4` *(optional)* — short silent loop: a tidy room, slow camera move, sunlight.
- Gallery — **real photos of her work only**, later.

`docs/MEDIA-BRIEF.md` will have, for each file: purpose, size/ratio, file name, the exact prompt, and how to use Google's tools step by step. AI images are used only for atmosphere, never presented as her actual work.

## 16. Privacy

- No cookies, no analytics, no forms, no tracking scripts → no cookie banner needed.
- Fonts and all assets self-hosted; the only outside links are `tel:`, WhatsApp and social links.
- **Counting visits and taps (optional, off by default):** with `analytics.umamiWebsiteId` filled in, the site loads Umami's small script and counts page views plus taps on WhatsApp (Send, per service and day/evening), Call, Save my number and the booking link. No cookies, nothing stored on the visitor's device, no personal data — so still no cookie banner. The counts live in the business's own **Umami Cloud** account (free plan: 100K events a month, one website per account, 6 months of history); you see them on Umami's dashboard. It counts taps, not sent messages, and visitors with ad blockers aren't counted.
- Events recorded: `booking-open` (with `source`: hero, bar, floating, service, price, final, footer), `whatsapp-send` (with the page `lang` and the chosen `service`, `slot`, `hours`, `day`), `call` (with `source`: hero, header, bar, final, footer, statement), `online-booking`, and `save-contact`. The script only counts on the site's own domain (`data-domains`: the site's domain with and without `www.`) and respects the visitor's Do Not Track setting.
- The buttons that open the booking panel are tracked from the panel's own script, not with Umami's link attribute: for a same-tab link, Umami's script cancels the click and navigates to the link itself, which would skip the panel.
- The accessibility statement page gets one line saying visits are counted anonymously, without cookies, when counting is on.

## 17. Quality checks

- `npm run check` — data check + Astro type check.
- Lighthouse (mobile) on the preview build: 95+ performance, accessibility, best practices, SEO.
- Keyboard-only walk-through and a screen-reader pass (NVDA or VoiceOver) in every language.
- Responsive: the full test matrix in section 9, every language, screenshots at every width.
- Booking panel: every combination of service, day/evening, hours, day and time produces the right Hebrew message and price, from every language's page.
- Real devices: at least one Android phone, one iPhone and one tablet, portrait and landscape.
- Links: every Call and WhatsApp button opens the right number with the right message.

## 18. Build steps

The work is split into small steps in **[`docs/STEPS.md`](STEPS.md)**: each step has what gets done, what you'll see at the end, and how it's checked. We go one step at a time, and you approve each one before the next starts.

## 19. Open decisions

- Hero background video: yes / no (can decide after seeing the hero).
- The exact list of services she offers, her hours, and the places she serves.
- Who writes the English and Russian text: I draft both from the Hebrew; you or she approves the English, and a native Russian speaker checks the Russian.
- Before Ayelet uses online booking: check with a free Cal.com test account that approving each booking ("Requires confirmation") and a Hebrew booking page are in the free plan.
- "How many hours do I need?" — her real estimates by home size and service (the guide in the booking panel).
- More price questions for her (text only, filled in with her data): a lower rate for a regular weekly/bi-weekly cleaning; whether the ₪100 cancellation fee applies to any cancellation or only close to the visit (e.g. less than 24 hours before).
- Decided: visits crossing 19:00 are split (hours after 19:00 at ₪150); extra time is charged by the half hour; Friday and holiday eves cost the same as other days; cancelling costs a one-time ₪100; the booking panel starts on household management, with no "not decided yet" option.
- Price details to confirm with her: does ₪100 include VAT (or is she VAT-exempt, עוסק פטור), are cleaning materials included, is there a travel charge for towns outside Beer Sheva, does the 4-hour minimum apply to every service.
