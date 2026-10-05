# Landing Template — Plan

A static landing-page template built with Astro. Every business-specific detail lives in JSON files and media folders, so a new business site means: create a repo from this template, replace the data and media, push.

The first site built on it: **Ayelet**, who cleans and organizes homes in Beer Sheva (₪100 per hour, minimum 4 hours per visit). Her name and details go only into her own repo's data — the template keeps `TODO` test data.

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
3. Replace the contents of `src/data/` and `src/assets/media/`.
4. `npm run build` until the check passes (no placeholders left).
5. Push → set up GitHub Pages and the domain (section 14).

**Template changes don't reach existing sites automatically.** "Use this template" makes a one-time copy. To bring a template fix into a business repo:

```bash
git remote add template git@github.com:pinilalush/landing-template.git
```
(once per business repo), then each time you want the latest template:
```bash
git fetch template
```
```bash
git merge template/main --allow-unrelated-histories
```
(`--allow-unrelated-histories` is only needed the first time.)

This merges cleanly because **the template never changes `src/data/` or `src/assets/media/` once a business has its own data there** — the rule for template work is: code in the template, data in the business repo.

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
    favicon.svg, robots.txt
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
    { "code": "en", "name": "English", "dir": "ltr" }
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
    "font": "heebo",
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
  "heroVideo": false
}
```

- `font` is chosen from the fonts installed in the template (Heebo to start; more can be added to the template later).
- The check script verifies **color contrast** (text on background, button text on button) meets WCAG AA, so a future business can't pick unreadable colors by accident.

### 5.2 `business.json` — facts that don't change by language

```json
{
  "siteUrl": "https://TODO-domain.co.il",
  "basePath": "/",
  "phone": "+972500000000",
  "whatsapp": "+972500000000",
  "email": "TODO@example.com",
  "city": "Beer Sheva",
  "geo": { "lat": 31.2520, "lng": 34.7915 },
  "pricing": {
    "currency": "ILS",
    "hourlyRate": 100,
    "minimumHours": 4
  },
  "hours": [
    { "days": ["Su", "Mo", "Tu", "We", "Th"], "open": "08:00", "close": "18:00" },
    { "days": ["Fr"], "open": "08:00", "close": "13:00" }
  ],
  "social": {
    "facebook": "",
    "instagram": "",
    "tiktok": "",
    "googleBusiness": ""
  },
  "accessibilityContact": {
    "name": "TODO: accessibility coordinator name",
    "phone": "+972500000000",
    "email": "TODO@example.com"
  },
  "accessibilityStatementDate": "2026-10-05"
}
```

- Phone numbers are stored in international format (`+972…`); the site shows them in local format (`050-000-0000`).
- `pricing` holds only numbers; the words around them ("per hour", "minimum") come from `content.json` per language. The minimum visit price is calculated by the site (4 × ₪100 = ₪400), so changing the rate updates everything.
- Empty social links are simply not shown.
- `basePath` is `/landing-template/` only while testing on `pinilalush.github.io/landing-template`; it's `/` once a domain is connected.

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
      "whatsappMessage": "היי, אשמח להזמין אותך לניקיון שוטף, מתי את פנויה? הבנתי שמינימום ההזמנה הוא {hours} שעות, {rate} לשעה."
    }
  ],
  "pricing": {
    "title": "מחיר",
    "perHour": "לשעה",
    "minimum": "מינימום {hours} שעות לביקור ({total})",
    "note": "TODO: מה כלול במחיר",
    "whatsappMessage": "היי, אשמח להזמין אותך, מתי את פנויה? הבנתי שמינימום ההזמנה הוא {hours} שעות, {rate} לשעה."
  },
  "why": [
    { "icon": "shield", "title": "TODO", "text": "TODO" }
  ],
  "about": { "title": "TODO", "text": "TODO" },
  "area": {
    "title": "אזורי שירות",
    "text": "TODO",
    "places": ["באר שבע", "עומר", "להבים", "מיתר"]
  },
  "reviews": [],
  "faq": [
    { "q": "TODO", "a": "TODO" }
  ],
  "finalCta": { "title": "TODO", "text": "TODO" },
  "whatsapp": {
    "default": "היי, אשמח להזמין אותך, מתי את פנויה? הבנתי שמינימום ההזמנה הוא {hours} שעות, {rate} לשעה.",
    "floating": "היי, אשמח להזמין אותך, מתי את פנויה? הבנתי שמינימום ההזמנה הוא {hours} שעות, {rate} לשעה."
  }
}
```

- Every service has its own prefilled WhatsApp message, in the same style: it asks to book, asks when she's free, and confirms the customer saw the minimum and the hourly rate. Example for regular cleaning: "היי, אשמח להזמין אותך לניקיון שוטף, מתי את פנויה? הבנתי שמינימום ההזמנה הוא {hours} שעות, {rate} לשעה."
- `{hours}` and `{rate}` are filled in from `business.json` → `pricing` when the page is built (e.g. "4" and "100 ₪", formatted for the language), so changing the price in one place updates every message. The check script fails if a message uses `{rate}` or `{hours}` and `pricing` is missing.
- English messages follow the same pattern: "Hi, I'd like to book you. When are you available? I understand the minimum is {hours} hours at {rate} per hour."
- `reviews` stays empty (section hidden) until there are real reviews from real customers. Each review will hold the customer's first name, area, text, and the date.

### 5.4 `locales/<lang>/seo.json` — search and sharing

```json
{
  "title": "TODO",
  "description": "TODO",
  "ogImage": "og-he",
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

- **Primary:** ניקיון בתים בבאר שבע, סידור וארגון הבית בבאר שבע, עוזרת בית בבאר שבע, מארגנת בתים בבאר שבע
- **Services:** ניקיון שוטף, ניקיון יסודי, ניקיון דירה, ניקיון לפני כניסה לדירה, ניקיון אחרי מעבר דירה, ניקיון אחרי שיפוץ, ניקיון לפני פסח, ניקיון לחגים, ניקיון מטבח, ניקיון חלונות, ניקיון חדרי רחצה, סידור ארונות, סידור ארון בגדים, ארגון מטבח, סידור מזווה, סידור חדרי ילדים, אריזה ופריקה במעבר דירה
- **Phrases people search:** מנקה בבאר שבע, ניקיון דירה באר שבע מחיר, מסדרת בתים, סידור בית אחרי מעבר, עזרה בניקיון הבית, ניקיון בית לפני אירוע
- **Places (to verify with her):** באר שבע — רמות, נווה זאב, נווה נוי, נחל עשן, נחל בקע, הכלניות, סיגליות, העיר העתיקה, שכונות א׳–ו׳, ט׳, י״א; nearby — עומר, להבים, מיתר, and any other towns she actually serves

English list covers the same services, plus the spellings people use for the city: **Beer Sheva, Be'er Sheva, Beersheba, Beer-Sheva**.

### 5.5 `locales/<lang>/ui.json` — fixed interface text

Text that's the same for any business: "Call now", "Send a WhatsApp message", "Services", "Frequently asked questions", "Accessibility statement", "Skip to content", language switcher labels, screen-reader labels, the accessibility statement template text. A new business normally doesn't edit this file; a new language does.

### 5.6 `media.json` — every image and video

```json
{
  "logo": { "file": "logo.svg", "alt": "logo" },
  "hero": { "file": "hero.jpg", "fileMobile": "hero-mobile.jpg", "alt": "hero" },
  "heroVideo": { "file": "hero.mp4", "poster": "hero.jpg" },
  "about": { "file": "about.jpg", "alt": "about" },
  "og": { "he": "og-he.jpg", "en": "og-en.jpg" },
  "gallery": []
}
```

`alt` values are **keys** into `content.json` (`"media": { "hero": "…" }`), so image descriptions are translated like everything else.

## 6. Languages and RTL

- **URLs:** default language at `/`, others at `/<code>/` (e.g. `/en/`). Each language is a separate real page, so Google indexes each one.
- **Direction:** the layout sets `<html lang="he" dir="rtl">` from `config.json`. All CSS uses logical properties (`margin-inline-start`, `padding-inline`, `inset-inline-end`), so nothing needs rewriting for RTL. Directional icons (arrows) flip automatically.
- **Device language:** on a visitor's **first** visit to `/`, a small inline script compares `navigator.languages` with the `languages` array. If a supported non-default language matches, it goes to that language's URL. No match → the default stays.
- **Manual choice wins:** the language switcher is always visible in the header. When a visitor picks a language, it's remembered in the browser, and device detection never overrides it again.
- **Google:** crawlers send no language preference, so they always see the default at `/`. `hreflang` tags on every page point to all language versions, plus `x-default`.
- **Adding a language:**
  1. Copy `src/data/locales/he/` to `src/data/locales/<code>/` and translate the three files.
  2. Add `{ "code": "<code>", "name": "…", "dir": "rtl" | "ltr" }` to `languages`.
  3. Add the OG image for it in `media.json`.
  4. `npm run build` — the check script fails if any key is missing compared with the default language.
- **Mixed text:** phone numbers and English words inside Hebrew are wrapped so they don't get scrambled by the bidirectional algorithm (`dir="ltr"` on phone numbers, `<bdi>` where needed).

## 7. Page and sections

One page per language, short, built for phones first. No forms, no steps.

1. **Header** — logo/business name, language switcher, Call button (on desktop). Becomes compact and frosted when scrolling.
2. **Hero** — headline, one supporting line, 3 short badges (e.g. "reliable", "discreet", "Beer Sheva and area"), **Call** and **WhatsApp** buttons. Optional background video.
3. **Services** — cards with icon, short text, and a WhatsApp button that opens the chat with that service's message.
4. **Price** — one clear card: **₪100 per hour · minimum 4 hours per visit (₪400)**, a short line on what's included, and a WhatsApp button to book. A clear price up front saves her the "how much?" messages and filters out visitors who aren't a fit. The same price appears in the FAQ ("How much does it cost?").
5. **Why her** — three short points with icons, plus a short "about" line and her photo.
6. **Service area** — the places she serves, as chips, with a stylized area graphic (no embedded Google Map: it's heavy and loads third-party cookies).
7. **Gallery** *(off until real photos)*.
8. **Reviews** *(off until real reviews)*.
9. **FAQ** — 5–7 short questions (accordion), written around search keywords.
10. **Final call-to-action** — one line + Call / WhatsApp.
11. **Footer** — contact, hours, social links, accessibility statement link.

**Always visible:**
- **Phones:** a bar fixed to the bottom of the screen with **Call | WhatsApp**, side by side, large tap targets.
- **Desktop:** a floating WhatsApp button in the corner (it moves to the correct side in RTL/LTR).

**Other pages:** `/accessibility` (statement, per language) and a styled 404.

**Prices** are on by default (`sections.pricing`); a future business that doesn't want to show prices turns the section off and the FAQ answer comes from its own `content.json`.

## 8. Design direction

"Professional, modern, very cool" — and it must still feel *clean*, since that's what she sells.

- **Hero:** deep ink-navy background with a soft aqua/mint glow, large bold Hebrew headline, frosted-glass badges.
- **Content sections:** bright white and very light cool-gray, with aqua accents — the "freshly cleaned" feel.
- **Type:** Heebo (variable weight, Hebrew + Latin), big confident headings, comfortable reading size for body text.
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

**Test matrix** — checked at the end of every build step, in both Hebrew and English:

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
- **WhatsApp:** `https://wa.me/972…?text=<message>`, the message from `content.json` for the current language, with `{hours}` and `{rate}` filled in from the pricing, URL-encoded. Each service button sends its own message.
- Phone numbers display in local format and are readable by screen readers.

## 11. SEO

- `<title>` and description per language from `seo.json`.
- Canonical URL, `hreflang` for every language plus `x-default`.
- Open Graph + Twitter card tags, OG image per language (1200×630).
- **Structured data (JSON-LD):** `LocalBusiness` with name, phone, area served (every place in `area.places`), opening hours, geo, social links (`sameAs`), and the services as an offer catalog with the hourly price (₪100 per hour, from `business.json`). Reviews are only added to structured data once real reviews exist.
- Sitemap with all language versions (`@astrojs/sitemap`), `robots.txt`.
- Headings in the right order (one `h1`), real text (not text inside images), alt text from keywords.
- Performance counts for ranking: target **Lighthouse 95+** in all four categories on mobile.

**Outside the site (biggest effect for local search):** a **Google Business Profile** for her business, with the site link, photos, hours and reviews. The site links to it when `social.googleBusiness` is set. I'll write the steps when we get there.

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

**Accessibility statement page** per language: what's accessible, known limitations, the coordinator's name and contact (from `business.json`), and the date. Template text in `ui.json`, details from the data.

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
  - a `siteUrl` that still contains `TODO`
  - color contrast below WCAG AA
  - a file in `media.json` that doesn't exist in `src/assets/media/`
- `npm run dev` shows the same list as warnings, and a small banner on the page saying how many placeholders are left, so you can work with test data.
- To test a build locally while data is still fake: `ALLOW_PLACEHOLDERS=1 npm run build`.
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

**Before the domain is bought:** the site can be tested at `https://pinilalush.github.io/<repo>/` by setting `basePath` to `/<repo>/` in `business.json`.

## 15. Media

**Built as code (by me):** logo placeholder, icon set, illustrations, sparkle/shine effects, section dividers, the service-area graphic, favicon.

**Photos and video (Google image and video tools, by you with my prompts):**
- `hero.jpg` (wide, desktop) and `hero-mobile.jpg` (portrait, phones) — bright, tidy, modern living room in an Israeli apartment, morning light, no people's faces.
- `about.jpg` — **must be a real photo of her** (not AI), when she's ready. Until then the section uses an illustration.
- `og-he.jpg`, `og-en.jpg` — social share images (1200×630), I'll compose them from the hero image + text.
- `hero.mp4` *(optional)* — short silent loop: a tidy room, slow camera move, sunlight.
- Gallery — **real photos of her work only**, later.

`docs/MEDIA-BRIEF.md` will have, for each file: purpose, size/ratio, file name, the exact prompt, and how to use Google's tools step by step. AI images are used only for atmosphere, never presented as her actual work.

## 16. Privacy

- No cookies, no analytics, no forms, no tracking scripts → no cookie banner needed.
- Fonts and all assets self-hosted; the only outside links are `tel:`, WhatsApp and social links.
- If analytics is wanted later: a cookie-less option, added as a template setting.

## 17. Quality checks

- `npm run check` — data check + Astro type check.
- Lighthouse (mobile) on the preview build: 95+ performance, accessibility, best practices, SEO.
- Keyboard-only walk-through and a screen-reader pass (NVDA or VoiceOver) in Hebrew and English.
- Responsive: the full test matrix in section 9, Hebrew and English, screenshots at every width.
- Real devices: at least one Android phone, one iPhone and one tablet, portrait and landscape.
- Links: every Call and WhatsApp button opens the right number with the right message.

## 18. Build steps

The work is split into small steps in **[`docs/STEPS.md`](STEPS.md)**: each step has what gets done, what you'll see at the end, and how it's checked. We go one step at a time, and you approve each one before the next starts.

## 19. Open decisions

- Hero background video: yes / no (can decide after seeing the hero).
- The exact list of services she offers, her hours, and the places she serves.
- Who writes the English text: I draft it from the Hebrew, you or she approves.
- Price details to confirm with her: does ₪100 include VAT (or is she VAT-exempt, עוסק פטור), are cleaning materials included, is there a travel charge for towns outside Beer Sheva, does the 4-hour minimum apply to every service.
