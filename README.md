# Landing Template

A static one-page site template for small local service businesses, built with [Astro](https://astro.build). Every business detail (texts, prices, hours, contact numbers, colors, images) lives in JSON files and a media folder, so a new business site means: create a repo from this template, replace the data and media, push.

- **Languages:** Hebrew (default, right-to-left), English and Russian. Adding a language takes:
  - an entry in `config.json` (with its text direction)
  - its three translated locale files
  - a share image
  - its name in every language's `ui.json` → `languageNames`

  See `docs/NEW-SITE.md` §3.
- **Contact:** no backend, no forms. Visitors tap **Call** or **WhatsApp**. A small booking panel builds the WhatsApp message with the service, hours, optional day and time, and the price, in a language the owner speaks.
- **Built in:**
  - local SEO
  - an accessibility statement (Israeli standard IS 5568 / WCAG AA)
  - a QR code for print (`/qr.svg`, `/qr.png`)
  - a contact card (`/contact.vcf`)
  - optional cookie-free visit counting (Umami)
- **No leftovers:** the build stops while any test value (`TODO`, the test phone, the template's demo path `/landing-template/`) or required image is left.
- **Hosting:** GitHub Pages, deployed by GitHub Actions on every push to `main`.

This repo holds **test data only**. A real business's details go only into its own repo.

## Start a new business site

Follow **[`docs/NEW-SITE.md`](docs/NEW-SITE.md)**: use this template, clone and link it to the template, fill in the data, add the media, check, publish, connect the domain.

## Requirements

Node 24 (see `.nvmrc`) and npm.

```bash
npm ci
```

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Local server with live reload. Test data is allowed, with a banner counting what's left. |
| `npm run check` | Data check plus Astro's type check, without building. In the template itself (test data), run `ALLOW_PLACEHOLDERS=1 npm run check`. |
| `npm run build` | Runs the data check first, then builds the site into `dist/`. Stops with a list of exact file + field for any test data, missing image or invalid value. |
| `npm run preview` | Serves the built `dist/` locally. |
| `ALLOW_PLACEHOLDERS=1 npm run build` | Demo build with test data: test-data banner and `noindex`. |

## Structure

```
.github/workflows/deploy.yml   build + publish to GitHub Pages
astro.config.mjs               site address, base path and languages, read from src/data
scripts/check-data.mjs         the data check (runs before every build)
docs/                          plan, build steps, new-site guide, media brief
public/media/                  hero video, if a site uses one
src/
  data/                        everything business-specific
    config.json                languages, theme colors, sections on/off, analytics
    business.json              site URL and base path, phones, email, city and map point, prices, work hours, social links, payment methods
    media.json                 which image files to use
    locales/<lang>/            content.json (page text), seo.json (search + share), ui.json (interface)
  assets/media/                business images (optimized at build time)
  components/                  page sections and UI parts
  layouts/Base.astro           html lang/dir, head, header, footer
  lib/                         schemas, data check, languages, booking, prices, QR, contact card
  pages/
    [...lang]/index.astro      the page, per language
    [...lang]/accessibility.astro  the accessibility statement, per language
    [...lang]/contact.vcf.ts   the contact card, per language
    404.astro
    qr.svg.ts, qr.png.ts       QR codes for print
    favicon.svg.ts             favicon from the theme colors
    robots.txt.ts              robots.txt with the sitemap address (the sitemap itself is /sitemap-index.xml)
  styles/global.css
```

## Docs

- [`docs/PLAN.md`](docs/PLAN.md): the plan, covering what the template does and why.
- [`docs/STEPS.md`](docs/STEPS.md): the build, step by step.
- [`docs/NEW-SITE.md`](docs/NEW-SITE.md): starting a new business site.
- [`docs/MEDIA-BRIEF.md`](docs/MEDIA-BRIEF.md): every image and video, with prompts for Google's image and video tools.

## Working on the template

**Code goes in the template; data goes in the business repo.** Once a business has its own `src/data/` and `src/assets/media/`, the template never changes them. Each business repo is linked to the template once, by a merge right after it's created (`docs/NEW-SITE.md` §2), and after that it pulls template fixes with a plain `git fetch template` and `git merge template/main` (§9). Real photos and personal details never go into the template.
