# Build Steps

The plan in [`PLAN.md`](PLAN.md) split into small steps. One step at a time: I do the work, show you the result, you approve, then we move to the next one.

**How every step ends**
- I run the checks listed for the step and send screenshots where there's something to see.
- I give you the exact `git` commands to commit and push (I don't commit myself).
- You approve, or tell me what to change.

**Who:** 🤖 = me · 👤 = you · 👩 = her (through you)

**Current step:** 1.2

---

## Phase 0 — Before code

- [x] **0.1 👤 Review the plan.** Read `PLAN.md`, answer or note the open decisions (section 19).
- [x] **0.2 👤 First push.** Push the two docs to `github.com/pinilalush/landing-template` (I'll give the commands).
- [ ] **0.3 👤👩 Ask Ayelet the open questions** (services, hours, places, price details). Not needed to build the template, needed for her site in Phase 9 — can run in parallel.

## Phase 1 — Base

- [x] **1.1 🤖 Create the Astro project.** `package.json`, `astro.config.mjs`, TypeScript config, `.gitignore`, Node version file, the folder structure from PLAN section 4.
  *You see:* `npm run dev` opens an empty page. *Check:* `npm run build` creates `dist/`.
- [ ] **1.2 🤖 Data files with test data.** `config.json`, `business.json` (with the ₪100 / 4-hour pricing), `media.json`, and `locales/he` + `locales/en` (`content.json`, `seo.json`, `ui.json`). Every unknown value marked `TODO`.
  *Check:* every field from PLAN section 5 exists.
- [ ] **1.3 🤖 Schemas and data loading.** Zod schemas for every file, helpers that load the data for a given language.
  *Check:* a wrong type or missing field gives a clear error naming the file and field.
- [ ] **1.4 🤖 Placeholder and data check.** `scripts/check-data.mjs`: `TODO` values, test phone, missing fields, missing language keys, color contrast, missing media files. Wired to run before every build; `ALLOW_PLACEHOLDERS` override; "test data" banner + `noindex` when placeholders are allowed.
  *Check:* `npm run build` **fails** with the list; `ALLOW_PLACEHOLDERS=1 npm run build` passes and shows the banner.
- [ ] **1.5 🤖 Languages and RTL.** Routing (`/` Hebrew, `/en/` English), base layout with `lang`/`dir` from `config.json`, language switcher, device-language detection on first visit, remembered manual choice.
  *You see:* Hebrew right-to-left at `/`, English left-to-right at `/en/`. *Check:* browser set to English → goes to `/en/`; picking Hebrew in the switcher sticks after reload.
- [ ] **1.6 🤖 Theme and responsive base.** Colors and radius from `config.json` as CSS variables, self-hosted Heebo, fluid type and spacing scale, safe-area handling, layout container.
  *Check:* changing a color in `config.json` changes the site; nothing overflows at 320px.

## Phase 2 — Design

- [ ] **2.1 🤖 Icons and logo placeholder.** The SVG icon set (sparkle, broom, spray bottle, folded clothes, boxes, kitchen, window, shield, clock, map pin, phone, WhatsApp) and a text-based placeholder logo.
- [ ] **2.2 🤖 Two hero variations.** Both languages, screenshots on phone and desktop.
- [ ] **2.3 👤 Choose a hero** (or a mix of both).
- [ ] **2.4 🤖 Finish the chosen hero and the header**, including the compact frosted header on scroll.
  *Check:* responsive matrix (PLAN section 9) for the hero and header.

## Phase 3 — Sections

Each section is checked at every width in the responsive matrix, in Hebrew and English, before moving on.

- [ ] **3.1 🤖 Contact buttons.** Call and WhatsApp link builders, bottom Call | WhatsApp bar (phones, tablets portrait), floating WhatsApp button (desktop), Call button in the header.
  *Check:* every button opens the right number with the right message, in both languages.
- [ ] **3.2 🤖 Services** — cards with a WhatsApp button per service.
- [ ] **3.3 🤖 Price** — ₪100 per hour, minimum 4 hours (₪400), what's included, book on WhatsApp.
- [ ] **3.4 🤖 Why her + about.**
- [ ] **3.5 🤖 Service area** — place chips and the area graphic.
- [ ] **3.6 🤖 FAQ** — accordion, includes the price question.
- [ ] **3.7 🤖 Final call-to-action, footer, 404 page.**
- [ ] **3.8 🤖 Gallery and reviews** — built and tested with sample data, then switched off in `config.json`.
- [ ] **3.9 🤖 Animations** — scroll reveals, shine, hero sparkles, press/hover effects; all off with reduced motion.
- [ ] **3.10 🤖 Full responsive pass** — the whole page at every width in the matrix, portrait and landscape.
  *You see:* the complete page with test data. 👤 Check it on your own phone and a tablet.

## Phase 4 — SEO

- [ ] **4.1 🤖 Keyword lists** in `seo.json` (Hebrew and English), and the test content rewritten to use them naturally. Check script warns about primary keywords not used in the page.
- [ ] **4.2 🤖 Head tags** — title, description, canonical, `hreflang`, Open Graph and social cards.
- [ ] **4.3 🤖 Structured data** — `LocalBusiness` with area, hours, services and the hourly price.
  *Check:* passes Google's Rich Results Test and the schema.org validator.
- [ ] **4.4 🤖 Sitemap and robots.txt.**

## Phase 5 — Accessibility

- [ ] **5.1 🤖 Accessibility pass** — keyboard only, screen reader (Hebrew and English), contrast, 200% zoom, focus order, reduced motion.
- [ ] **5.2 🤖 Accessibility statement page** in both languages, details from `business.json`.
- [ ] **5.3 🤖 Lighthouse on the local preview** — 95+ in all four categories on mobile.

## Phase 6 — Media

- [ ] **6.1 🤖 Media brief** (`docs/MEDIA-BRIEF.md`) — each image/video: purpose, size, file name, the exact prompt, and step-by-step how to create it with Google's tools.
- [ ] **6.2 👤 Create the media** with Google and put the files in a folder for me.
- [ ] **6.3 🤖 Add the media** — desktop and phone crops of the hero, optimization, OG share images in both languages.
- [ ] **6.4 👤 Decide on the hero video** after seeing the hero with the real image.

## Phase 7 — Deploy the template demo

- [ ] **7.1 🤖 GitHub Actions workflow** (`.github/workflows/deploy.yml`).
- [ ] **7.2 👤 GitHub settings** — Pages source: GitHub Actions; repository variable `ALLOW_PLACEHOLDERS=1` (template repo only). I'll give exact clicks.
- [ ] **7.3 👤 Push** → site goes live at `https://pinilalush.github.io/landing-template/` with the test-data banner.
- [ ] **7.4 🤖👤 Check the live demo** — Lighthouse, responsive matrix, real devices.

## Phase 8 — Finish the template

- [ ] **8.1 🤖 `docs/NEW-SITE.md` and `README.md`** — how to start a new business site, step by step.
- [ ] **8.2 👤 Mark the repo as a template** (Settings → Template repository).
- [ ] **8.3 👤🤖 Dry run** — create a throwaway repo from the template, confirm its build fails on placeholders (no variable copied), then you delete the throwaway repo.

## Phase 9 — Ayelet's site (home cleaning and organizing, Beer Sheva)

The domain steps (9.2–9.3) don't depend on the template and can be done any time earlier, so the name is secured.

- [ ] **9.1 🤖 Questionnaire for Ayelet** — a short Hebrew list you can send her on WhatsApp: business name, phone, services, hours, places, price details (VAT, materials, travel, minimum), social links, accessibility contact.
- [ ] **9.2 🤖 Domain name ideas** — a short list of names (`.co.il` and `.com`) that are easy to say on the phone and spell in English letters without mistakes, with the registrar options and approximate yearly cost. 👤👩 Pick one.
- [ ] **9.3 👤 Buy Ayelet's domain** at a registrar (an ISOC-IL accredited registrar for `.co.il`). Turn on auto-renew so the site doesn't go down when the year ends.
- [ ] **9.4 👤 Create Ayelet's repo** from the template ("Use this template"), named after the domain, public, cloned into `private-landings/`.
- [ ] **9.5 🤖 Fill Ayelet's data** — Hebrew content from her answers, English draft, her pricing (₪100 per hour, 4-hour minimum unless she says otherwise). 👤👩 Approve the texts.
- [ ] **9.6 🤖 Build passes with no placeholders.**
- [ ] **9.7 👤 Publish** — Pages source: GitHub Actions, push, check at `https://pinilalush.github.io/<repo>/`.
- [ ] **9.8 👤 Connect the domain** — DNS records, GitHub Pages custom domain, domain verification, HTTPS. I'll give exact values.
- [ ] **9.9 🤖👤 Final checks on the real domain** — every button, both languages, Lighthouse, real devices.
- [ ] **9.10 👤👩 Google Search Console** (submit the sitemap) and **Google Business Profile** for Ayelet — I'll write the steps.
