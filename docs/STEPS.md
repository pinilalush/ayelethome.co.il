# Build Steps

The plan in [`PLAN.md`](PLAN.md) split into small steps. One step at a time: I do the work, show you the result, you approve, then we move to the next one.

**How every step ends**
- I run the checks listed for the step and send screenshots where there's something to see.
- I give you the exact `git` commands to commit and push (I don't commit myself).
- You approve, or tell me what to change.

**Who:** 🤖 = me · 👤 = you · 👩 = her (through you)

**Current step:** 5.3 and 7.4 (Lighthouse and checks on the live demo), then Phase 9.

---

## Phase 0 — Before code

- [x] **0.1 👤 Review the plan.** Read `PLAN.md`, answer or note the open decisions (section 19).
- [x] **0.2 👤 First push.** Push the two docs to `github.com/pinilalush/landing-template` (I'll give the commands).
- [ ] **0.3 👤👩 Ask Ayelet the open questions** (services, hours, places, price details). Not needed to build the template, needed for her site in Phase 9 — can run in parallel.

## Phase 1 — Base

- [x] **1.1 🤖 Create the Astro project.** `package.json`, `astro.config.mjs`, TypeScript config, `.gitignore`, Node version file, the folder structure from PLAN section 4.
  *You see:* `npm run dev` opens an empty page. *Check:* `npm run build` creates `dist/`.
- [x] **1.2 🤖 Data files with test data.** `config.json`, `business.json` (₪100 by day, ₪150 from 19:00, 4-hour minimum, work hours), `media.json`, and `locales/he` + `locales/en` (`content.json`, `seo.json`, `ui.json`). Every unknown value marked `TODO`.
  *Check:* every field from PLAN section 5 exists.
- [x] **1.3 🤖 Schemas and data loading.** Zod schemas for every file, helpers that load the data for a given language.
  *Check:* a wrong type or missing field gives a clear error naming the file and field.
- [x] **1.3b 🤖 Data for the new decisions.** Russian files, contact language, payment methods, half-hour step, booking link and Umami settings (empty), and the booking panel texts (service names for the message, one message pattern with single and split price, hours guide) in the data files and rules, replacing the per-button messages.
  *Check:* all three languages load; the rules catch a contact language that isn't a site language and an unknown payment method.
- [x] **1.4 🤖 Placeholder and data check.** `scripts/check-data.mjs`: `TODO` values, test phone, missing fields, missing language keys, color contrast, missing media files, unknown or unfillable placeholders (`{rte}`, or `{eveningRate}` with no evening rate). Wired to run before every build; `ALLOW_PLACEHOLDERS` override; "test data" banner + `noindex` when placeholders are allowed.
  *Check:* `npm run build` **fails** with the list; `ALLOW_PLACEHOLDERS=1 npm run build` passes and shows the banner.
- [x] **1.5 🤖 Languages and RTL.** Routing (`/` Hebrew, `/en/` English), base layout with `lang`/`dir` from `config.json`, language switcher, device-language detection on first visit, remembered manual choice.
  *You see:* Hebrew right-to-left at `/`, English left-to-right at `/en/`. *Check:* browser set to English → goes to `/en/`; picking Hebrew in the switcher sticks after reload.
- [x] **1.6 🤖 Theme and responsive base.** Colors and radius from `config.json` as CSS variables, self-hosted Rubik, fluid type and spacing scale, safe-area handling, layout container.
  *Check:* changing a color in `config.json` changes the site; nothing overflows at 320px.

## Phase 2 — Design

- [x] **2.1 🤖 Icons and logo placeholder.** The SVG icon set (sparkle, broom, spray bottle, folded clothes, boxes, kitchen, window, shield, clock, map pin, phone, WhatsApp) and a text-based placeholder logo.
- [x] **2.2 🤖 Two hero variations.** Both languages, screenshots on phone and desktop.
- [x] **2.3 👤 Choose a hero** (or a mix of both). Chosen: **A · Glow** (dark, aqua glow, floating sparkles, centered headline).
- [x] **2.4 🤖 Finish the chosen hero and the header**, including the compact frosted header on scroll.
  *Check:* responsive matrix (PLAN section 9) for the hero and header.

## Phase 3 — Sections

Each section is checked at every width in the responsive matrix, in every language, before moving on.

- [x] **3.1 🤖 Contact buttons.** Call link, bottom Call | WhatsApp bar (phones, tablets portrait), floating WhatsApp button (desktop), Call button in the header, "Calls in Hebrew" note on other languages' pages.
- [x] **3.1b 🤖 Booking panel.** Service, day/evening, hours in half-hour steps with live price and the hours guide, optional day and start time limited to her work hours, split price for visits that cross 19:00, message preview in the visitor's language plus the Hebrew that's sent, Send on WhatsApp; works as a plain link without JavaScript.
  *Check:* every combination gives the right Hebrew message and price from every language's page, including 17:00–21:00 = ₪500, and correct singular wording when a split gives 1 hour or half an hour; one tap still sends the default message; keyboard, screen reader and the phone's back button work.
- [x] **3.1c 🤖 Optional settings** — Umami counting (page views and taps on WhatsApp, Call, Save my number, booking link) when `analytics.umamiWebsiteId` is set; the "choose a time online" link when `bookingUrl` is set. Both hidden and nothing loaded when empty.
  *Check:* with both empty, the built site loads no outside script; with test values, the script and link appear.
- [x] **3.2 🤖 Services** — cards with a WhatsApp button per service.
- [x] **3.3 🤖 Price** — two cards: day ₪100 per hour (at least ₪400) and evening from 19:00 ₪150 per hour (at least ₪600), what's included, a WhatsApp button on each.
- [x] **3.4 🤖 Why her + about.**
- [x] **3.5 🤖 Service area** — place chips and the area graphic.
- [x] **3.6 🤖 FAQ** — accordion, includes the price question.
- [x] **3.7 🤖 Final call-to-action, footer, 404 page.** Footer includes work hours, payment methods, Save my number (`contact.vcf`, tracked as `save-contact`), and the online-booking link when `bookingUrl` is set.
- [x] **3.7b 🤖 QR code** — `qr.svg` and `qr.png` made at build time, pointing to the site.
- [x] **3.8 🤖 Gallery and reviews** — built and tested with sample data, then switched off in `config.json`.
- [x] **3.9 🤖 Animations** — scroll reveals, shine, hero sparkles, press/hover effects; all off with reduced motion.
- [x] **3.10 🤖 Full responsive pass** — the whole page at every width in the matrix, portrait and landscape.
  *You see:* the complete page with test data. 👤 Check it on your own phone and a tablet.

## Phase 4 — SEO

- [x] **4.1 🤖 Keyword lists** in `seo.json` (Hebrew, English and Russian), and the test content rewritten to use them naturally. Check script warns about primary keywords not used in the page.
- [x] **4.2 🤖 Head tags** — title, description, canonical, `hreflang`, and the full share-preview tags (PLAN section 11, **Share preview**).
- [ ] **4.3 🤖 Structured data** — `LocalBusiness` with area, hours, services and the hourly price.
  *Check:* passes Google's Rich Results Test and the schema.org validator.
- [x] **4.4 🤖 Sitemap and robots.txt.**

## Phase 5 — Accessibility

- [x] **5.1 🤖 Accessibility pass** — keyboard only, screen reader (every language), contrast, 200% zoom, focus order, reduced motion.
- [x] **5.2 🤖 Accessibility statement page** in every language, details from `business.json`.
- [ ] **5.3 🤖 Lighthouse on the local preview** — 95+ in all four categories on mobile.

## Phase 6 — Media

- [x] **6.1 🤖 Media brief** (`docs/MEDIA-BRIEF.md`) — each image/video: purpose, size, file name, the exact prompt, and step-by-step how to create it with Google's tools.
- [x] **6.2 👤 Create the media** with Google and put the files in a folder for me. *(Done: the hero photo, wide and tall. The video waits for 6.4.)*
- [x] **6.3 🤖 Add the media** — desktop and phone crops of the hero, optimization, and the share images in every language generated from the data (under 300 KB, readable as a centered square).
- [x] **6.4 👤 Decide on the hero video** after seeing the hero with the real image.

## Phase 7 — Deploy the template demo

- [x] **7.1 🤖 GitHub Actions workflow** (`.github/workflows/deploy.yml`).
- [x] **7.2 👤 GitHub settings** — Pages source: GitHub Actions; repository variable `ALLOW_PLACEHOLDERS=1` (template repo only). I'll give exact clicks.
- [x] **7.3 👤 Push** → site goes live at `https://pinilalush.github.io/landing-template/` with the test-data banner.
- [ ] **7.4 🤖👤 Check the live demo** — Lighthouse, responsive matrix, real devices.

## Phase 8 — Finish the template

- [x] **8.1 🤖 `docs/NEW-SITE.md` and `README.md`** — how to start a new business site, step by step.
- [x] **8.2 👤 Mark the repo as a template** (Settings → Template repository).
- [x] **8.3 👤🤖 Dry run** — create a throwaway repo from the template, confirm its build fails on placeholders (no variable copied), then you delete the throwaway repo.

## Phase 9 — Ayelet's site (home cleaning and organizing, Beer Sheva)

The domain steps (9.2–9.3) don't depend on the template and can be done any time earlier, so the name is secured.

- [x] **9.1 🤖 Questionnaire for Ayelet** — a short Hebrew list you can send her on WhatsApp: business name, phone, services, hours, places, price details (VAT, materials, travel, minimum), social links. *(Done: she answered.)*
- [x] **9.2 🤖 Domain name ideas** — a short list of names (`.co.il` and `.com`) that are easy to say on the phone and spell in English letters without mistakes, with the registrar options and approximate yearly cost. 👤👩 Pick one.
- [x] **9.3 👤 Buy Ayelet's domain** at a registrar (an ISOC-IL accredited registrar for `.co.il`). Turn on auto-renew so the site doesn't go down when the year ends. *(Done 2026-10-05. Auto-renew is off by your choice, so renew it by hand before the year ends.)*
- [ ] **9.4 👤 Create Ayelet's repo** from the template ("Use this template"), named after the domain, public, cloned into `private-landings/`, and linked to the template right away, before any data changes (`docs/NEW-SITE.md` §2).
- [ ] **9.5 🤖 Fill Ayelet's data** — Hebrew content from her answers, English and Russian drafts, her hours guide, her pricing (₪100 per hour, ₪150 from 19:00, 4-hour minimum unless she says otherwise). 👤👩 Approve the texts.
- [ ] **9.5b 👤 A native Russian speaker checks the Russian text** (site and booking-panel translation notes).
- [x] **9.5c 👤 Open a free Umami Cloud account** for Ayelet's site and send me the site ID. *(Done — the ID goes into her repo's `config.json` in 9.5, not into the template.)* *(Optional, later:* a free Cal.com account if she wants online booking — test approval and Hebrew first.*)*
- [ ] **9.6 🤖 Build passes with no placeholders.**
- [ ] **9.7 👤 Publish** — Pages source: GitHub Actions, push, check at `https://pinilalush.github.io/<repo>/`.
- [ ] **9.8 👤 Connect the domain** — DNS records, GitHub Pages custom domain, domain verification, HTTPS. I'll give exact values. *(Started: DNS is on Cloudflare with the GitHub records, and the GitHub verification record is in place; Verify waits until the registry publishes the domain.)*
- [ ] **9.9 🤖👤 Final checks on the real domain** — every button, every language, Lighthouse, real devices, and the share preview: Facebook Sharing Debugger ("Scrape Again"), then paste the link in WhatsApp and Facebook to see the card.
- [ ] **9.10 👤👩 Google Search Console** (submit the sitemap) and **Google Business Profile** for Ayelet — I'll write the steps.
