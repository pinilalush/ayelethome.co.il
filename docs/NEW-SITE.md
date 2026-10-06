# Starting a New Business Site

How to turn the template into a live site for a new business, step by step. Each business gets its own repo, created from the template and named after its domain. The template keeps only test data. The business's details, photos included, go only into its own repo.

**Overview**
1. Create the repo from the template.
2. Clone it into `private-landings/` and link it to the template.
3. Fill in the data files.
4. Add the media.
5. Check and build locally.
6. Publish on GitHub Pages.
7. Connect the domain.
8. After launch: QR code, contact card, share preview, counting, Google.
9. Later: bring template updates into the site.

Throughout, `example.co.il` stands for the business's domain and `<repo>` for the repo name.

---

## 0. Before you start

- **The business's answers:** services, work hours, places served, prices and price details, phone, WhatsApp, email, social links, a real photo of the owner, and who approves the English and Russian texts.
- **The domain** (optional at first). The site can be tested at `https://pinilalush.github.io/<repo>/` before a domain exists. Buy a `.co.il` at an ISOC-IL accredited registrar, and turn on **auto-renew** so the site doesn't go down when the year ends.
- **The media:** see [`MEDIA-BRIEF.md`](MEDIA-BRIEF.md).
- **Tools:** Node 24 (the version is in `.nvmrc`), npm, git, and access to the `pinilalush` GitHub account.

---

## 1. Create the repo from the template

1. Open `https://github.com/pinilalush/landing-template` → **Use this template** → **Create a new repository**.
2. **Owner:** `pinilalush`. **Repository name:** the domain, for example `example.co.il`. **Public** (GitHub Pages is free for public repos). Leave **Include all branches** off.
3. **Create repository.**

"Use this template" copies the files, not the settings. The new repo has **no `ALLOW_PLACEHOLDERS` variable**, so its builds stop while any test data is left. That's intended.

---

## 2. Clone it and link it to the template

```bash
cd /docker/code/private-landings
```
```bash
git clone git@github.com:pinilalush/example.co.il.git
```
```bash
cd example.co.il
```

**Link it to the template, right away, before changing anything.** "Use this template" starts the new repo with its own fresh history, unrelated to the template's. A one-time merge now, while both have the same files, is clean and gives them a shared starting point. Template updates later then merge like normal changes (section 9). If you skip this and merge later, git sees every file that differs (the data included) as a conflict.

```bash
git remote add template git@github.com:pinilalush/landing-template.git
```
```bash
git fetch template
```
```bash
git merge template/main --allow-unrelated-histories --no-edit
```
```bash
git push
```

If the merge reports conflicts, the template changed after the repo was created. Since nothing here is yours yet, take the template's side and finish the merge:
```bash
git read-tree -u --reset template/main
```
```bash
git commit --no-edit
```
```bash
git push
```

Then install the packages:

```bash
npm ci
```

---

## 3. Fill in the data

Everything business-specific lives in **`src/data/`**. Nothing in the code needs to change.

**What the check finds for you.** The data check (run by `npm run dev`, `npm run check` and every build) lists these by file and field:
- any text containing the word **`TODO`**
- the test phone **`+972500000000`**
- the template's demo path **`basePath: "/landing-template/"`**
- image files that are missing

While you work, `npm run dev` also shows a yellow **test-data banner** with the number of values left. A real build stops on the same list.

**A value marked `TODO` that is already right** only needs the word removed. For example, `"TODO Beer Sheva"` becomes `"Beer Sheva"`, and `"TODO 08:00"` becomes `"08:00"`.

**What the check can't judge.** It only sees `TODO` and test values, and the template's numbers and lists look valid. **Review these by hand:**
- **`business.json` → `geo`:** the template's point is a city center. To get one: in Google Maps, right-click the spot; the first line of the menu is the coordinates, and clicking it copies them as `latitude, longitude`. **For privacy, use a central point of the city or area served, never the owner's home.**
- **`business.json` → `pricing`:** rates, minimum hours, step, cancellation fee, evening start time.
- **`business.json` → `payment`**, **`contactLanguages`**, and the **`days` of each `workHours` row**. Only the times are marked `TODO`.
- **`content.json` → `services`** (which services, their `id`s and icons) and **`business.json` → `defaultService`**.
- **`content.json` → `booking.hoursGuide` → `hours`:** the owner's own estimates.
- **`config.json` → `theme.colors`** (the check verifies contrast only), **`sections`** and **`languages`**.
- **`seo.json` → `keywords`** in every language: the template's lists are for home cleaning in Beer Sheva.

A good order to fill them in: `business.json`, then `config.json`, then the default language's `content.json` and `seo.json`, then the other languages, then `media.json`.

### `business.json` — facts that don't change by language

| Field | What it controls |
|---|---|
| `siteUrl` + `basePath` | **Where the site actually lives.** The site uses them for its QR code, its contact card and the addresses it gives search engines and share previews. They also set the domain that visit counting works on. **While testing on GitHub:** `"https://pinilalush.github.io"` + `"/<repo>/"`. **Once the domain is connected:** `"https://example.co.il"` + `"/"`. The template's own `basePath`, `"/landing-template/"`, counts as test data, so a business repo can't go live with it by mistake. |
| `phone`, `whatsapp` | International format, no spaces or dashes: `"+972501234567"`. The site shows `050-123-4567`. They can be different numbers. Call buttons use `phone`, WhatsApp buttons use `whatsapp`, and the contact card lists both. |
| `email` | Optional. Footer, contact card, and the accessibility statement's contact details. Without one (leave the field out or set `""`), these offer phone and WhatsApp only. |
| `city`, `geo` | The city name, and a map point (latitude/longitude) for the area served, for Google's structured data. |
| `pricing` | **Numbers only:** `currency` (`"ILS"`), `hourlyRate`, `minimumHours`, `step` (`0.5` = charged by the half hour after the minimum), optional `cancellationFee`, and optional `evening` (`from`, as in `"19:00"`, plus its `hourlyRate`). Every price in the texts is calculated from these, so a rate changes in one place. To remove `evening` or the whole `pricing`, see *Without an evening rate, or without prices* below. |
| `workHours` | When the owner works: a list of rows, each with `days` (`Su Mo Tu We Th Fr Sa`), `from` and `to` (`"HH:MM"`). Days with different hours get their own row (the template has Sunday–Thursday and Friday). Shown in the footer; it also limits the days and start times in the booking panel. With an evening rate, at least one day must run long enough for a full minimum visit starting at `evening.from` (4 hours from 19:00 means until 23:00). |
| `social` | `facebook`, `instagram`, `tiktok`, `googleBusiness` (the Google Business Profile link). Each is a full `https://` link or `""`; empty ones are hidden. |
| `contactLanguages` | The languages the owner speaks with customers, main one first. Each must be a site language. The WhatsApp message is written in the visitor's language if it's on this list, otherwise in the main one, with a translation shown in the panel. Pages in other languages show "Calls in Hebrew" (or whichever language). |
| `payment` | Any of `bit`, `paybox`, `cash`, `transfer`, `credit`, shown as small labeled icons near the price and in the footer. `[]` hides them. |
| `defaultService` | The `id` of a service in `content.json`. The booking panel starts on it when the customer didn't come from a service card, and the plain WhatsApp link uses it. |
| `bookingUrl` | Optional online booking page (`https://…`). `""` hides it; filled in, a small "or choose a time online" link appears in the booking panel and the footer. |
| `accessibilityStatementDate` | `"YYYY-MM-DD"`, the date shown on the accessibility statement. Update it when the statement is reviewed. |

**Without an evening rate, or without prices.** Removing a number also means editing the texts that use it, in **every** language. The check lists each text that still uses a missing value.
- **No evening rate** (remove `pricing.evening`):
  1. In `content.json`, remove `booking.slots.evening` and `booking.price.split`.
  2. Rewrite `booking.slots.day.hint` and any other text (FAQ answers, for example) that uses `{eveningFrom}` or `{eveningRate}`.

  The day/evening choice and the evening price card disappear.
- **No prices at all** (remove `pricing`):
  1. Set `config.json` → `sections.pricing` to `false`.
  2. Rewrite every text that uses a price placeholder:
     - `content.json` → `booking` (the message must also drop `{duration}` and `{price}`), `faq`
     - `content.json` → `pricing`: delete it (it's optional once `sections.pricing` is `false`)
     - `seo.json` → `description`, `share`
     - `ui.json` → `booking.minimum`, which uses `{hours}`

  **The booking panel disappears**, and every WhatsApp button opens a chat with no prepared message.

### `config.json` — languages, look, sections

| Field | What it controls |
|---|---|
| `languages` | `code`, `name` (in its own language), `dir` (`"rtl"` / `"ltr"`), and exactly one `"default": true`. The default language is at `/`, the others at `/<code>/`. `"deviceRedirect": true` sends first-time visitors whose device is set to that language to its page (the template marks only Russian); everyone else lands on the default. |
| `theme.colors` | `ink` (hero, dark header and footer), `surface` (white sections, text on dark), `surfaceAlt` (light-gray sections), `text`, `textMuted`, `primary` (buttons, accents), `primaryText` (text on buttons), `accent` (glow and sparkles). **The check fails** if text on its background is under 4.5:1 contrast (WCAG AA). |
| `theme.font` | `"rubik"`, the font installed in the template. It covers Hebrew, Latin and Cyrillic. |
| `theme.radius` | Corner rounding, for example `"1.25rem"`. |
| `sections` | Each section on or off: `services`, `pricing`, `why` (the "why us" points with the about text and photo), `area`, `gallery`, `reviews`, `faq`, `finalCta`. **Keep `gallery` and `reviews` off** until there are real photos and real reviews; the check fails if they're on and empty. |
| `heroVideo` | `true` plays `public/media/hero.mp4` softly behind the hero on wider screens, with a pause button; never on phones held upright or with reduced motion. `false` shows only the photo. |
| `analytics.umamiWebsiteId` | `""` means no counting at all. The business's own Umami Cloud website ID turns it on (section 8). |

### `locales/<lang>/content.json` — the page text, per language

Write the default language first, then translate. In every language, the services must have the **same ids in the same order**, and these lists must have the **same number of items**: `hero.badges`, `why`, `area.places`, `faq`, `reviews`, `booking.hoursGuide` (with the same hours).

| Field | What it controls |
|---|---|
| `businessName`, `ownerName` | `businessName` is the text logo in the header and footer, the 404 page title, and the organization on the contact card. `ownerName` is the name on the contact card; it also signs the about text and is the name in "… speaks Hebrew". |
| `tagline` | The short line above the main headline. Also shown in the footer and as the job title on the contact card. |
| `hero` | `title` (the page's only main heading), `subtitle`, and up to 4 `badges`. |
| `services` | One card each: `id` (lowercase-with-dashes), `icon` (one of `sparkle broom spray clothes washer boxes kitchen window shield clock pin`), `title`, `text`, and `bookingName`, which is how the service reads inside the WhatsApp message (for example `"לניקיון שוטף"`). |
| `pricing` | Price section labels, plus `note` (what's included; can be `""`). |
| `booking` | The booking panel and the WhatsApp message. **The template marks the message texts (`message`, `availability`) `TODO` in every language.** Read each one, adjust it, and remove the `TODO`. The Hebrew texts address the owner in the feminine (`מתי את פנויה?`), so change them if the owner is a man (`מתי אתה פנוי?`). `hoursGuide` holds the owner's own "how many hours do I need?" estimates by home size. Each `hours` value must be bookable (at least the minimum, in `step`s). |
| `why` | The "why us" points: `icon`, `title`, `text`. |
| `about` | `title` and `text` next to the owner's photo. |
| `area` | `title`, `text`, and `places`, shown as chips. The first place is the label in the area graphic, usually the city. |
| `reviews` | `[]` until there are real reviews from real customers: `name` (first name), `area`, `text`, `date` (`"YYYY-MM-DD"`). |
| `faq` | Questions and answers (`q`, `a`), written around the search keywords. |
| `finalCta` | The closing `title` and `text` above the last Call/WhatsApp buttons. |
| `accessibilityService` | The "Accessibility of the service" paragraph in the accessibility statement: whether the business has a place open to the public (a home service usually doesn't) and how a customer asks for an adjustment. Write it for this business. |
| `media` | Alt text for every image, under the keys used in `media.json` (`hero`, `about`, gallery keys, `logo`). |

**Placeholders.** Texts can use values from `business.json` → `pricing`, so a price changes in one place:
- `{hours}`: the minimum hours
- `{rate}`, `{total}`: day rate, minimum total
- `{eveningFrom}`, `{eveningRate}`
- `{cancellationFee}`

The message texts in `booking` have their own placeholders (`{service}`, `{duration}`, `{slot}`, `{availability}`, `{price}`, `{when}`, …). The check fails on an unknown placeholder (a typo like `{rte}`), or one with no value (`{eveningRate}` without an evening rate).

### `locales/<lang>/seo.json` — search and link previews

| Field | What it controls |
|---|---|
| `title`, `description` | The page title and description in Google results. |
| `share` | The link-preview card in WhatsApp, Facebook and others: `title`, `description` (one line with the offer and price; `{rate}` and `{hours}` work here), and `imageAlt`. If `title` or `description` is empty, the SEO title or description is used. |
| `ogImage` | The share image's file name without extension. It must match `media.json` → `og.<lang>` (for example `"og-he"` for `og-he.jpg`). |
| `keywords` | `primary`, `services`, `places`, `phrases`: the **source list for writing the page text**. Google ignores keyword tags; the terms belong in headings, service texts, FAQ answers and alt texts. The check warns if a `primary` keyword doesn't appear in the visible text. List only services the business really offers. |

### `locales/<lang>/ui.json` — fixed interface text

Button labels, section names, booking panel labels, day names, payment method names, the accessibility statement template text. **A business normally doesn't edit this file;** a new language translates it. The page speaks as one owner ("למה לבחור בי", "Why choose me"); a business with a team changes `sections.why` to the plural ("למה לבחור בנו"). `languageNames` must include every language in `contactLanguages`.

### `media.json` — which image files to use

Points to the files in `src/assets/media/` (images) and `public/media/` (video). `alt` values are **keys** into `content.json` → `media`, so alt texts are translated like everything else.
- `hero`: `file`, `fileMobile`, `alt`
- `heroVideo`: `file`, `poster`
- `about`: `file`, `alt`
- `og`: a share image per language
- `gallery`: a list of `{ "file", "alt" }`
- optional `logo`: `{ "file": "logo.svg", "alt": "logo" }`. Without it, the site shows the text logo.

**Every image listed must exist** in `src/assets/media/`. The hero video and its poster are only required when `config.json` → `heroVideo` is `true`.

### Adding or removing a language

- **Add:**
  1. Copy `src/data/locales/he/` to `src/data/locales/<code>/` and translate the three files.
  2. Add the language to `config.json` → `languages`, with its `dir`.
  3. Add `og.<code>` to `media.json`, with the matching `ogImage` in its `seo.json`.
  4. Add its name to `languageNames` in every language's `ui.json`.
  5. Add it to `contactLanguages` only if the owner actually speaks it.

  The check lists anything missing compared with the default language.
- **Remove** (for example, a business without Russian):
  1. Delete it from `config.json` → `languages`.
  2. Delete `src/data/locales/<code>/`.
  3. Remove `og.<code>` from `media.json`.

---

## 4. Add the media

[`MEDIA-BRIEF.md`](MEDIA-BRIEF.md) describes every file. Its Part 2 covers what is collected for a business site.

**Putting files in place:**
- **Images go in `src/assets/media/`; a hero video goes in `public/media/`.**
- **File names must match `media.json` exactly**, including upper/lower case and the extension. Google's tools often download PNG files. Either convert the file to JPG, or keep the PNG and change the name in `media.json` (for example `"file": "hero.png"`). The site makes WebP versions of the photos at build time either way.

**Per file:**
- **`hero.jpg`, `hero-mobile.jpg`:** these come with the template (a tidy room) and show softly behind the hero, on wider screens and on phones. **Keep them for a cleaning or household business; replace both for any other kind** (`MEDIA-BRIEF.md` §8).
- **`about.jpg`:** a **real photo of the owner**, never AI. **Remove its location data first** (`MEDIA-BRIEF.md`, *Removing location data*), because the repo is public. A real build stops until it's here.
- **Gallery and logo:** optional. Gallery photos must be **real photos of her work**, with location removed.
- **Area map (`area-map.jpg`):** the map behind the service-area pin. **Run `npm run area-map` once** after setting `business.json` → `city` and `geo`: it downloads the city from OpenStreetMap, shades the whole city area in the theme color, and saves the image (commit it). The template's map is Beer Sheva. If the city has no boundary in OpenStreetMap, the script makes a plain map around `geo`. The page credits OpenStreetMap on the map, as its license requires; leave that line.
- **Share images (`og-<lang>.jpg`):** made automatically before every build (`scripts/share-images.mjs`) from `hero.jpg`, the business name, the tagline and the hourly price, in the site's colors and the Rubik font. Nothing to do; to see them after changing the data, run `npm run share-images`. After launch, and whenever they change, run the link through Facebook's Sharing Debugger and click **Scrape Again**.
- **`hero.mp4`:** the template's video of the same room, played softly behind the hero on wider screens (`config.json` → `heroVideo`). Keep it for a cleaning or household business; for any other kind, replace it (`MEDIA-BRIEF.md` §4) or set `heroVideo` to `false`.

---

## 5. Check and build locally

| Command | What it does |
|---|---|
| `npm run dev` | Local server with live reload at `http://localhost:4321` plus `basePath`. Test data is allowed here, with the banner. |
| `npm run check` | Data check plus Astro's type check, without building. |
| `npm run share-images` | Remakes the share images from the data (every build also does this). |
| `npm run area-map` | Downloads and saves the service-area map for `city` and `geo` (run once per business, needs internet). |
| `npm run build` | Runs the data check first, then builds into `dist/`. **It stops with an exact list (file + field)** while any test data, missing file, contrast problem or placeholder typo is left. In a business repo **it must pass as is**, without `ALLOW_PLACEHOLDERS`. |
| `npm run preview` | Serves the built `dist/` to check before pushing. |
| `ALLOW_PLACEHOLDERS=1 npm run build` | A demo build with test data: test-data banner and `noindex`. **Never for the live site.** |

**Look at it before pushing**, in every language:
- Every Call and WhatsApp button opens the right number with the right message.
- The booking panel prices are right, including a visit that crosses into the evening rate.
- The work hours in the footer are right.
- **Save my number** works.
- The accessibility statement shows the business's phone, WhatsApp, email (if set), the `accessibilityService` paragraph and the date.
- The page looks right on a phone and a desktop.

---

## 6. Publish on GitHub Pages

1. In the new repo: **Settings → Pages → Build and deployment → Source: GitHub Actions.** Don't click **Configure** on the suggested workflows; the repo already has its own, `.github/workflows/deploy.yml`.
2. **Don't add** an `ALLOW_PLACEHOLDERS` variable. It exists only in the template repo, so its demo can run on test data.
3. Commit and push to `main`:
   ```bash
   git add -A
   ```
   ```bash
   git commit -m "Business data and media"
   ```
   ```bash
   git push
   ```
4. Every push to `main` runs the workflow: data check, build, publish. Follow it in the **Actions** tab. A red run with a list of fields means test data is still left. That's expected for pushes made before the data is complete, such as the merge push in section 2.
5. With the testing values in `business.json` (`https://pinilalush.github.io` + `/<repo>/`), the site is at `https://pinilalush.github.io/<repo>/`.

---

## 7. Connect the domain

**About DNS record names.** Each record has a name (also called host) and a value. Many registrar panels, Cloudflare for example, want **only the part before the domain** and add `.example.co.il` themselves:

| Full record name | What you type in such a panel |
|---|---|
| `www.example.co.il` | `www` |
| `example.co.il` itself | `@`, or leave the name empty |

Typing the full name into such a panel creates a doubled name (`…example.co.il.example.co.il`), and the record doesn't work. If the panel shows the full name after saving, check it isn't doubled.

**A. Verify the domain for the GitHub account** (once per domain). This stops anyone else from pointing a GitHub Pages site at it.
1. GitHub → your profile picture → **Settings** → under *Code, planning, and automation*, **Pages** → **Add a domain** → enter `example.co.il`.
2. GitHub shows a **TXT record**, with a value:
   - full name: `_github-pages-challenge-pinilalush.example.co.il`
   - in most panels: `_github-pages-challenge-pinilalush`

   Add it at the registrar.
3. Back in GitHub → **Verify**. DNS can take up to 24 hours. **Keep the TXT record** permanently; removing it removes the verification.

**B. Set the custom domain in the repo** (before the DNS records, as GitHub recommends): **Settings → Pages → Custom domain** → `example.co.il` → **Save**. No `CNAME` file is needed, because the site is published by a GitHub Actions workflow.

**C. DNS records at the registrar:**

| Type | Name | Value |
|---|---|---|
| `A` | `@` (the domain itself) | `185.199.108.153` |
| `A` | `@` | `185.199.109.153` |
| `A` | `@` | `185.199.110.153` |
| `A` | `@` | `185.199.111.153` |
| `AAAA` | `@` | `2606:50c0:8000::153` |
| `AAAA` | `@` | `2606:50c0:8001::153` |
| `AAAA` | `@` | `2606:50c0:8002::153` |
| `AAAA` | `@` | `2606:50c0:8003::153` |
| `CNAME` | `www` | `pinilalush.github.io` |

Remove any other `A`, `AAAA` or `CNAME` records for the domain and `www`, such as the registrar's parking page. With both the domain and `www` set up, GitHub redirects between them.

**D. Switch the site to the domain:** in `business.json`, set `"siteUrl": "https://example.co.il"` and `"basePath": "/"`. Commit and push.

**E. Check DNS** (it may take up to 24 hours).
- **In a browser:** Google's Admin Toolbox Dig, `https://toolbox.googleapps.com/apps/dig/`. Enter the name, pick the record type (A, AAAA, CNAME or TXT), and compare the answer with the tables above.
- **In a terminal:**
  ```bash
  dig example.co.il +noall +answer -t A
  ```
  ```bash
  dig example.co.il +noall +answer -t AAAA
  ```
  ```bash
  dig www.example.co.il +noall +answer
  ```
  ```bash
  dig _github-pages-challenge-pinilalush.example.co.il +noall +answer -t TXT
  ```

**F. HTTPS:** **Settings → Pages → Enforce HTTPS**, once GitHub offers it. The certificate can take up to 24 hours.

---

## 8. After launch

- **QR code** for flyers, business cards and magnets. It isn't shown on the page.
  - `https://example.co.il/qr.svg` is for print. `https://example.co.il/qr.png` is at least 1024 px.
  - Both point to `https://example.co.il/?utm_source=qr`, so visits from printed codes are counted separately. The language redirect keeps the tag.
  - The address comes from `siteUrl` at build time, so **download and print it only after the real domain is in `business.json`**.
- **Contact card:** the footer's **Save my number** button downloads `/contact.vcf` (per language: `/en/contact.vcf`, `/ru/contact.vcf`). It has the owner's name, the business name, the tagline, phone, WhatsApp (if it's a different number), email (if set) and the site address. It can also be sent as a link.
- **Share preview:**
  1. Run each language's address through Facebook's **Sharing Debugger** (`https://developers.facebook.com/tools/debug/`) and click **Scrape Again**.
  2. Paste the link in WhatsApp and Facebook to see the card.
  3. Do this again whenever the share text or image changes, because Facebook and WhatsApp cache the preview.
- **Visit counting (optional):**
  1. In the business's own **Umami Cloud** account (free plan), add a website for the domain and copy its **Website ID**.
  2. Put it in `config.json` → `analytics.umamiWebsiteId`, then push.

  The script counts **only on the domain in `siteUrl`** (with and without `www.`). While `siteUrl` is still `https://pinilalush.github.io`, it counts visits to the github.io test address, so **fill in the ID once the real domain is in `siteUrl`**, or expect test visits in the counts. It uses no cookies and needs no cookie banner. The accessibility statement then mentions that visits are counted anonymously.
- **Google Search Console** (`https://search.google.com/search-console`). Add the site as a property, choosing one of two kinds:
  - **Domain property** (recommended; covers `https`, `www` and the bare domain):
    1. Enter `example.co.il`.
    2. Google shows a TXT record (`google-site-verification=…`). Add it at the registrar on the domain itself (name `@` or empty).
    3. **Verify**, and keep the record.
  - **URL-prefix property:**
    1. Enter `https://example.co.il/` and choose **HTML file** verification.
    2. Download the file, put it in the repo's `public/` folder (create the folder if it's missing), and push.
    3. After the deploy, click **Verify**, and keep the file.

  Then go to **Sitemaps**, enter `sitemap-index.xml` (the full address is `https://example.co.il/sitemap-index.xml`), and **Submit**.
- **Google Business Profile:** create one with the site link, photos, hours and reviews, and put its link in `business.json` → `social.googleBusiness`.
- **Changing anything later:** edit the JSON or media, then push. The workflow republishes.

---

## 9. Bringing template updates into the site

"Use this template" makes a one-time copy, so template fixes don't arrive by themselves. Thanks to the one-time merge in section 2, an update is a normal merge:

```bash
git fetch template
```
```bash
git merge template/main
```

The template's rule is **code in the template, data in the business repo**, so `src/data/` and `src/assets/media/` normally merge without conflicts. If a conflict does appear there, keep the business's version of that file:
```bash
git checkout --ours -- <file>
```
```bash
git add <file>
```
```bash
git commit --no-edit
```

A template change to a test value the business never changed merges in silently, so look at what the update did to the data:
```bash
git diff ORIG_HEAD -- src/data src/assets/media
```
Restore any business value it overwrote. Then run `npm run check`; it names any new field the template update requires. After that, build, check, and push.
