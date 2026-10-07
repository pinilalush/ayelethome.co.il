# Testing

The checks every change goes through before Pini commits, and the extra checks for a site going live. They run **as one test session at the end of a change**, not after every edit. Each check has its pass criteria. A check that fails is reported with its output; it is never skipped silently.

The standards come from the plan: responsive (PLAN §9), accessibility (§12), placeholder protection (§13) and quality checks (§17).

---

## 1. Data check and build (every change)

| Where | Command | Passes when |
|---|---|---|
| Template | `ALLOW_PLACEHOLDERS=1 npm run check` | No errors. Pending items are test data, which the template is allowed to have. |
| Template | `ALLOW_PLACEHOLDERS=1 npm run build` | Build completes. |
| Business repo | `npm run check` | No errors, no pending items. |
| Business repo | `npm run build` | `Data check passed: no problems and no test data left.` and the build completes. **Never** use `ALLOW_PLACEHOLDERS` here. |

After the build, `git status` must show only the intended changes. The build remakes `src/assets/media/og-*.jpg`. A share image that changed when it shouldn't have means the data or the script changed something.

## 2. Layout matrix (any change to markup, CSS or text)

Every page, in every language, at every size in PLAN §9:

- **Pages:** `/`, `/en/`, `/ru/`, `/accessibility/`, `/en/accessibility/`, `/ru/accessibility/`.
- **Sizes (width × height):**
  - 320×640, 360×740, 375×812, 390×844, 412×915, 430×932
  - landscape phones: 667×375, 844×390, 932×430
  - tablets: 768×1024, 820×1180, 1024×768, 1180×820
  - desktops: 1280×800, 1366×768, 1440×900, 1920×1080, 2560×1440
- That's 108 combinations. Emulate a mobile device under 768 px wide, and emulate `prefers-reduced-motion: reduce` so reveal animations don't hide content.

**Passes when, on every combination:**
- **No sideways scroll:** `document.documentElement.scrollWidth` ≤ `clientWidth`.
- **No text outside the screen:** every visible element with its own text inside `header`, `main` and `footer` has its box within the viewport's width.
- **No clipped text:** no visible text element whose `scrollWidth` exceeds `clientWidth` while its `overflow-x` is not `visible`.
- **Tap targets at least 44×44 px** for every visible `a[href]`, `button`, `summary`, `select` and `input`. Links inside running text (`p a`) are exempt.

**Skip** elements that are visually hidden (`.visually-hidden`, `clip-path: inset(50%)`), `aria-hidden`, inside a closed `dialog`, or inside a closed `details` (apart from its `summary`).

**How it's run:**
1. Build, then serve `dist/` from a small static server.
   - It must send the right `Content-Type` for `.html .css .js .svg .png .jpg .webp .avif .woff2 .txt .xml .vcf`. Otherwise Chrome downloads files instead of showing them.
   - For the template, strip the `/landing-template` base path from requests.
2. Drive headless Chrome over the DevTools Protocol from a short Node script:
   - `--headless=new`, a throwaway `--user-data-dir` in the scratchpad, and `--remote-debugging-port` on a free port (never 9301).
   - Call `Browser.setDownloadBehavior` with `deny`.
   - Run `Emulation.setDeviceMetricsOverride` and `Emulation.setEmulatedMedia` before each page.
   - Navigate, wait for `document.fonts.ready`, then evaluate the checks above.
3. Stop Chrome and the server by PID.

**Screenshots** of the changed section at a phone width (390×844) and a desktop width (1280×800), in Hebrew and one left-to-right language, go to Pini with the result.

## 3. Keyboard

On `/`, `/en/` and `/ru/`, at 390×844 and 1280×800, press Tab from the top until focus returns to the first stop, about 35 stops.

**Passes when every stop:**
- has a **visible focus ring**: an `outline` with a width, or a `box-shadow`;
- is **on screen** once focused;
- is **not covered by something else**: `document.elementFromPoint` at the element's center is the element or inside it, so for example the sticky header or bottom bar doesn't hide it.

**The booking panel and the share dialog:**
- Focus moves into them when they open.
- Esc closes them.
- Focus returns to the button that opened them.

## 4. Booking panel (any change to booking code, prices, hours or booking texts)

From **every** language's page, the WhatsApp message is in the owner's language (`contactLanguages`) and the price is right.

- **The plain link without JavaScript** sends the default message (default service, daytime, minimum hours).
- **One tap** with the defaults sends the default message.
- **Every service × day/evening × hours** (minimum to a few steps above, in half hours) gives the correct total.
- **A daytime visit that crosses the evening start is split:** 17:00 to 21:00 is 2 × ₪100 + 2 × ₪150 = ₪500. A split of 1 hour or half an hour uses the singular wording (שעה, חצי שעה, never "1 שעות").
- **Days and start times** offered are only within the work hours. Evening is unavailable on a day that ends before the evening start (for example Friday). With no start time chosen, an evening visit is priced as ending at closing time, and a day visit as starting at opening time.
- **Services in `estimateByPhone`:**
  - The hours stepper is hidden and `booking.estimateNote` is shown.
  - The message uses `booking.messageEstimate`: it asks to talk by phone and states the rate and the minimum hours.
- **The message asks whether she's free**, and never states a booking as confirmed.

## 5. Lighthouse

Mobile, which is Lighthouse's default, on every page in the layout matrix.
- For a change: run it on `npm run preview`.
- For a launch: run it on the live address.

Live runs block Umami, so test runs aren't counted:

```bash
npx lighthouse https://example.co.il/ --only-categories=performance,accessibility,best-practices,seo --blocked-url-patterns="*umami*" --chrome-flags="--headless=new" --output=html --output-path=<scratchpad>/lh-he.html
```

**Passes when** all four categories score **95 or more**. Video weight and cache lifetime notices are expected: GitHub Pages sets the cache, and the hero video is deliberately loaded only on fast connections. Reports go to the scratchpad and are deleted afterwards, because they embed full-page screenshots.

## 6. Share preview (any change to names, taglines, prices, the hero photo or `share-images.mjs`)

- `src/assets/media/og-<lang>.jpg`:
  - 1200×630, under 300 KB.
  - Name, tagline and price readable in a centered square.
  - The name split into even lines, with no word left alone.
- **After the deploy:**
  1. Facebook Sharing Debugger: click **Scrape Again** for each language's address.
  2. Paste the link in WhatsApp.
  3. The card shows the new title, description and image.

## 7. Live checks (launch, domain or hosting changes)

| Check | Passes when |
|---|---|
| Pages and files | `/`, `/en/`, `/ru/`, the three accessibility pages, `/sitemap-index.xml`, `/sitemap-0.xml`, `/robots.txt`, `/qr.svg`, `/qr.png` and every `contact.vcf` return 200, with the right content type. Every image, script and stylesheet the pages load returns 200. |
| 404 | An unknown address shows the styled 404 page. |
| Redirects | `http://`, `www.` and `pinilalush.github.io/<repo>/` all end at `https://<domain>/`. |
| HTTPS | The certificate is valid. **Enforce HTTPS** is on, so `http://` gets a 301 from `Server: GitHub.com`. |
| Indexing | No `noindex`. `robots.txt` allows everything and names the sitemap. The sitemap lists every page with `hreflang` alternates. |
| QR | `qr.svg` decodes to `https://<domain>/?utm_source=qr`. |
| Structured data | Google's Rich Results Test finds *Local business* and *Organization* with no errors. |
| Lighthouse | Section 5, on the live address. |
| Layout and keyboard | Sections 2 and 3, on the live address, with Umami blocked. |
| Share preview | Section 6. |
| Search Console | Domain verified; `sitemap-index.xml` submitted; status **Success** within a few days. |

## 8. People and devices (launch, or a big visual change)

- **Pini, on a real phone (and a tablet if available):** Call, a WhatsApp booking message, Share, Save my number, switching language, the hero video on Wi-Fi.
- **A screen-reader pass** (VoiceOver or TalkBack) in every language when the markup changes a lot: headings in order, every control labeled, the booking panel announced as a dialog.
- **A native speaker** reads any new English or Russian text before launch, or Pini approves it.

## Reporting

Report what ran and what passed, with numbers: "108/108 layout combinations pass", "keyboard 34–36 stops, all clean", the Lighthouse scores per page. List anything that failed, with its output, and anything that was skipped, with the reason. A business repo records its launch results in `docs/SITE.md`.
