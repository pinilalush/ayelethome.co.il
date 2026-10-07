# Site record: ayelethome.co.il

The record of Ayelet's site: the business, the accounts and services it runs on, every decision about it, how to run it, and how it was checked at launch. Everything general (how the template works, the data fields, the tests) is in the other docs; this file holds only what is specific to this site. Keep it up to date whenever something here changes.

Start with [`CLAUDE.md`](../CLAUDE.md) for how the work is done, then read this file.

## At a glance

| | |
|---|---|
| Business | **איילת ניהול משקי בית**: home cleaning, tidying and household management (laundry, ironing, bedding, dishes, whatever the household needs) |
| Owner | Ayelet (first name only on the site). Pini runs the site for her and relays her approvals. |
| Area | All of Beer Sheva, no other towns |
| Live site | https://ayelethome.co.il (Hebrew `/`, English `/en/`, Russian `/ru/`) |
| Repo | [github.com/pinilalush/ayelethome.co.il](https://github.com/pinilalush/ayelethome.co.il), public, created from [`landing-template`](https://github.com/pinilalush/landing-template) with a `template` remote |
| Launched | 2026-10-06 (built 2026-10-05 to 2026-10-06) |
| Names | he "איילת ניהול משקי בית" · en "Ayelet Household Management" · ru "Айелет — порядок в доме" |

## Where the facts live

The data files are the source of truth; this record explains them.

| What | File |
|---|---|
| Phone and WhatsApp (`+972556666630`, the same number), prices, work hours, payment methods, default service, phone-estimate services | `src/data/business.json` |
| Languages, theme colors, sections on or off, hero video, Umami ID | `src/data/config.json` |
| All page text, per language (services, FAQ, booking messages, hours guide, about text) | `src/data/locales/<lang>/content.json` |
| Titles, descriptions, keywords, share-preview text | `src/data/locales/<lang>/seo.json` |
| Which image files are used | `src/data/media.json` |
| Images | `src/assets/media/`. Hero videos: `public/media/` |

## Decisions

All made on 2026-10-05 and 2026-10-06, from Ayelet's questionnaire answers and Pini's decisions. A change to any of these is a decision for Pini (and Ayelet); record it here with the date.

**Name and wording**
- The name is "איילת ניהול משקי בית" (Pini changed "משק בית" to "משקי בית").
- The Russian name is short so the header fits on phones.
- The site describes her work as "ניקיון וניהול משק הבית".
- She is "אמינה ואחראית", never "דיסקרטית", which can read the wrong way (Pini).
- The site speaks to one visitor (בשבילך, שלך) and in her first person (למה לבחור בי, not בנו).
- "עוזרת בית" is a search keyword only, not visible text.
- The area is "באר שבע", never "והסביבה".

**The page**
- Order: hero, then the about section with the "why choose me" points, then prices, service area, services and FAQ.
- The closing call-to-action band is off.
- Gallery and reviews stay off until there are real photos of her work and real reviews.

**The hero**
- The headline is "רוצה בית נקי ומסודר בבאר שבע?", with a two-line subtitle.
- A calm background video plays: a wide version on desktop and a portrait version on phones (`hero.mp4`, `hero-mobile.mp4`). It loads only on a fast connection, never with reduced motion, and has a pause button.

**The about section**
- Pini's wording, in three paragraphs.
- The picture is **a drawing of Ayelet**, made in Gemini from her own photo and approved by her (`about-illustration.jpg`). The alt text says it's an illustration.
- **Don't put a photo of her on the site or in the repo unless she asks for one.** Never use a realistic AI image.

**Services**
- All seven template services.
- **"סדר וניקיון יסודי" (deep) comes first and is the booking panel's default.**
- Deep cleaning and Passover cleaning are **estimated by phone** (`estimateByPhone`): the panel hides the hours and the message asks to talk by phone.

**Prices**
- ₪100 per hour by day, ₪150 per hour from 19:00. Visits crossing 19:00 are split.
- The 4-hour minimum applies to **every** service; after that, half-hour steps.
- The same price applies on Fridays and holiday eves.
- She's VAT-exempt (עוסק פטור): the site says only "המחיר סופי" and doesn't mention VAT.
- The client provides the cleaning materials.
- No discount for regular clients, though regular weekly or bi-weekly visits can be arranged.
- Cancelling is free until two days before the visit; later, a one-time ₪100.

**Work hours and payment**
- Sunday to Thursday 08:00–23:00 (day until 19:00, evening 19:00–23:00); Friday 08:00–13:00.
- Payment by bit, PayBox, cash or bank transfer (no credit card).

**Contact**
- Phone and WhatsApp on the same number.
- She speaks Hebrew with customers (`contactLanguages: ["he"]`), so every WhatsApp message is in Hebrew; on the English and Russian pages the booking panel also shows it in the visitor's language.
- **No email** on the site, by her choice. No social links.
- Booking is by WhatsApp only.
- Customers can leave a key; nobody needs to be home.

**Hours guide**
- 2–3 rooms and 4 rooms: 4 hours.
- 5 rooms or more: 5 hours, an estimate, not a commitment.

**Languages**
- Hebrew is the default, with English and Russian.
- **Only Russian device languages redirect automatically** (`deviceRedirect`). English visitors stay on Hebrew unless they switch; Chrome's own translation of the English page had confused things.
- Pini approved the English. Claude did the Russian review at Pini's request; a native Russian reading is still welcome.

**Other features**
- **Service area map:** a static OpenStreetMap image with the whole city of Beer Sheva shaded, credited "© OpenStreetMap contributors".
- **Share button** in the header and the footer.
- **No Google Business Profile for now** (Pini).
- **Domain:** registered in Pini's name, auto-renew off. Both are his choice; don't suggest changing them.

## Accounts and services

| Service | What it's used for | Notes |
|---|---|---|
| GitHub (`pinilalush`) | Code, and hosting on GitHub Pages | Pages source: GitHub Actions (`.github/workflows/deploy.yml`, on every push to `main`). Custom domain `ayelethome.co.il`, domain verified for the account, **Enforce HTTPS** on. No `ALLOW_PLACEHOLDERS` variable here. |
| LiveDNS | Registrar for `ayelethome.co.il` | Registered 2026-10-05 in Pini's name, valid to **2027-10-05**, **auto-renew off: renew it by hand before that date**, or the site goes down. |
| Cloudflare | DNS | Nameservers `dayana.ns.cloudflare.com` and `kaiser.ns.cloudflare.com`. Every record is **DNS only** (grey cloud), so GitHub issues and serves the certificate. |
| Let's Encrypt via GitHub | HTTPS certificate | Issued and renewed by GitHub automatically (the first one runs to 2027-01-04). Nothing to do while DNS stays as below. |
| Umami Cloud (free plan, Pini's account) | Anonymous visit and tap counts, no cookies | Website ID in `config.json` → `analytics.umamiWebsiteId`. Events are listed in the template's PLAN §16. |
| Google Search Console (Pini's account) | Search presence | **Domain property** `ayelethome.co.il`, verified by a DNS TXT record. `sitemap-index.xml` submitted and indexing requested for the home page on 2026-10-06. |
| Facebook Sharing Debugger | Refreshing the link preview | Scraped on 2026-10-06 after the final share image. |

**DNS records at Cloudflare** (keep all of them):

| Type | Name | Value | Purpose |
|---|---|---|---|
| A | `@` | `185.199.108.153` | GitHub Pages |
| A | `@` | `185.199.109.153` | GitHub Pages |
| A | `@` | `185.199.110.153` | GitHub Pages |
| A | `@` | `185.199.111.153` | GitHub Pages |
| CNAME | `www` | `pinilalush.github.io` | `www` redirects to the bare domain |
| TXT | `_github-pages-challenge-pinilalush` | (GitHub's code) | GitHub domain verification; removing it removes the verification |
| TXT | `@` | `google-site-verification=…` | Search Console verification; removing it removes access |

There are no `AAAA` records (IPv6), which is optional; GitHub's four addresses are in the template's `docs/NEW-SITE.md` §7. There are no `MX` records, since there's no email at this domain.

## Running the site

**Change a text, price, hour or setting**
1. Edit the file under `src/data/` (see *Where the facts live*). Keep every language in step: the same service ids in the same order, and the same number of FAQ items, badges and hours-guide lines.
2. Run `npm run build`. It must end with `Data check passed: no problems and no test data left.`
3. Run the checks in the template's `docs/TESTING.md` that the change calls for, then hand Pini the commit and push commands.
4. The deploy takes about 2 minutes (GitHub → Actions).
5. If the name, tagline, price, hero photo or share texts changed: the build remakes `src/assets/media/og-*.jpg` (commit them), and after the deploy, click **Scrape Again** in the Facebook Sharing Debugger.
6. New or changed English or Russian text needs Pini's approval (or a native speaker's) before it goes live.

**Bring in template updates.** Template changes are made and committed in `landing-template` first. Then:

```bash
git fetch template && git merge template/main --no-edit && git push
```

Before pushing, check what the merge did to the data with `git diff ORIG_HEAD -- src/data src/assets/media`, and run `npm run build`. If the template changed `scripts/share-images.mjs`, the build remakes the share images: commit them and re-scrape. This repo differs from the template only in `src/data/`, `src/assets/media/` and this file, so merges are normally clean.

**Yearly and occasional tasks**

| When | What |
|---|---|
| Before **2027-10-05** | Renew `ayelethome.co.il` at LiveDNS (auto-renew is off). |
| Every few months | Search Console: pages indexed, no errors. Umami: visits and taps. |
| When the accessibility statement is reviewed | Update `business.json` → `accessibilityStatementDate`. |
| When she has real reviews or photos of her work | Turn on `reviews` or `gallery` in `config.json` with the real content. Remove the location data from photos first (`MEDIA-BRIEF.md`). |
| If she wants online booking | Test Cal.com's free plan first (PLAN §19), then fill in `bookingUrl`. |

## Media

| File | What it is | Source |
|---|---|---|
| `hero.jpg`, `hero-mobile.jpg` | A tidy living room behind the hero (wide and portrait) | AI-generated atmosphere images, from the template (`MEDIA-BRIEF.md` §1–2) |
| `public/media/hero.mp4`, `hero-mobile.mp4` | The hero's background loop (1080p wide; 1080×1920 portrait) | Google Flow, made from the hero photos, looped forward and back, silent |
| `about-illustration.jpg` | Ayelet, drawn (1200×1500) | Gemini, from her own photo, approved by her |
| `area-map.jpg` | Beer Sheva with the city area shaded | `npm run area-map` (OpenStreetMap) |
| `og-he.jpg`, `og-en.jpg`, `og-ru.jpg` | Link-preview images | Made by every build from the data |

## Launch checks (2026-10-06)

All run on the live domain, per the template's `docs/TESTING.md` §7.

| Check | Result |
|---|---|
| Pages and files | Every page, file and asset returns 200; the 404 page works |
| Redirects | `http://`, `www.` and `pinilalush.github.io/ayelethome.co.il/` all lead to `https://ayelethome.co.il/` |
| HTTPS | Valid Let's Encrypt certificate; `http://` answers 301 from GitHub |
| QR code | `qr.svg` opens `https://ayelethome.co.il/?utm_source=qr` |
| Structured data | Rich Results Test: *Local business* and *Organization*, valid |
| Layout | 108/108 combinations pass (6 pages × 18 sizes), with Umami blocked |
| Keyboard | Home page in three languages at phone and desktop width: 34–36 stops each, all with a visible focus ring, on screen and uncovered |
| Share preview | Facebook and WhatsApp cards right in all three languages |
| Real phone | Pini: Call, WhatsApp booking, Share, Save my number and the language switch all work |
| Search Console | Domain verified, sitemap submitted, home page indexing requested. The sitemap first showed "couldn't fetch", as expected on launch day. |

**Lighthouse, mobile, live (Umami blocked):**

| Page | Performance | Accessibility | Best practices | SEO | LCP | CLS |
|---|---|---|---|---|---|---|
| `/` (he) | 98 | 100 | 100 | 100 | 2.4 s | 0.022 |
| `/en/` | 99 | 100 | 100 | 100 | 1.8 s | 0.038 |
| `/ru/` | 99 | 100 | 100 | 100 | 2.0 s | 0.013 |
| `/accessibility/` | 100 | 100 | 100 | 100 | 1.8 s | 0.003 |

## Open, optional

- A native Russian speaker reads the Russian pages.
- A Google Business Profile, if Pini decides to have one (then link it in `social.googleBusiness`).
- Online booking with Cal.com, after testing the free plan.
- Real reviews and real photos of her work (gallery).
- IPv6 (`AAAA`) records.
