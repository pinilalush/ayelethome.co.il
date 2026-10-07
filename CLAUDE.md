# Project guide

Read this first when you pick up the project, whether you're Claude Code or a person. It explains what the project is, where the knowledge lives and how the work is done. The same file is in the template and in every business repo made from it; template merges keep it in sync.

## What this is

- **`landing-template`** ([github.com/pinilalush/landing-template](https://github.com/pinilalush/landing-template)) is a static, JSON-driven Astro landing-page template for small local service businesses. It supports Hebrew (default, right-to-left), English and Russian. It holds **test data only** (`TODO` values). The demo is at https://pinilalush.github.io/landing-template/, with a test-data banner and `noindex`.
- **Business sites** are separate repos, one per business, created with GitHub's "Use this template" and named after the business's domain. They sit next to the template in `/docker/code/private-landings/`. Each one has a `template` git remote and takes template updates by merging.

| Business repo | Business | Live |
|---|---|---|
| [`ayelethome.co.il`](https://github.com/pinilalush/ayelethome.co.il) | Ayelet: home cleaning and household management, Beer Sheva | https://ayelethome.co.il (since 2026-10-06) |

**Which repo am I in?** Run `git remote -v`. In the template, `origin` is `landing-template`. A business repo has `origin` pointing to its own repo, plus a `template` remote. **A business repo also has `docs/SITE.md`**, the business's record: decisions, accounts, domain and DNS, operations and the launch checks. Read it before changing anything there.

## Read in this order

1. [`docs/PLAN.md`](docs/PLAN.md): the contract. It covers what the template does, why, and every decision, tagged with who made it and when.
2. [`docs/STEPS.md`](docs/STEPS.md): how it was built, step by step, and the **current step**.
3. [`docs/NEW-SITE.md`](docs/NEW-SITE.md): creating and running a business site, including every data field, publishing, the domain, after-launch tasks and template updates.
4. [`docs/TESTING.md`](docs/TESTING.md): the checks every change goes through, with pass criteria.
5. [`docs/MEDIA-BRIEF.md`](docs/MEDIA-BRIEF.md): every image and video, with the rules (real photos, drawings, AI) and the prompts.
6. `docs/SITE.md`: business repos only.
7. [`README.md`](README.md): a short overview, the commands and the file structure. [`AGENTS.md`](AGENTS.md) has Astro's own notes. It is imported here:

@AGENTS.md

## How we work

Pini owns these repos and approves every step. These rules come from working with him and apply to every session.

- **One step at a time.** Do the step, show the result (screenshots when there's something to see), and wait for approval before the next one. New work gets steps in `docs/STEPS.md`, and its **Current step** line stays up to date.
- **The plan is the contract.** Never change `docs/PLAN.md` to match the code. If something can't be built as written, stop and ask. Pini's decisions are written into the plan with a tag such as "(Pini, 2026-10-06)". In a business repo, decisions about that business go in its `docs/SITE.md` instead.
- **Pini commits, not Claude.** Never run `git add`, `git commit`, `git push`, `git merge` or history rewrites.
  - Prepare the working tree, then hand over the commands.
  - Each command goes on **one line in its own `bash` block**, in order, with no heredocs, so the desktop app shows a Run button.
  - Stay on `main`; don't create branches.
- **Outward-facing steps belong to Pini too.** GitHub settings, DNS at Cloudflare, Search Console, the Facebook Sharing Debugger, anything with credentials: give exact clicks and values and let him do it.
- **Say what the next step does**, not just its number.
- **Code goes in the template; data goes in the business repo.**
  - Code changes are made in `landing-template`, committed there, then merged into each business repo:
    `git fetch template && git merge template/main --no-edit && git push`
  - The template never touches a business's `src/data/` or `src/assets/media/`.
  - Real names, phone numbers and photos never go into the template.
- **Config files stay comment-free.** Put the reasoning in the commit message.
- **Scripted edits assert what must not change.**
  - Replace exact text, assert it matched exactly once, and compare the parsed JSON before and after, ignoring only the intended field.
  - Don't rewrite JSON with `JSON.stringify` or `json.dump`: they reformat the compact one-line objects the data files use.
- **Stay inside the project folders.** Scratch files go in the session's scratchpad, never loose in `/tmp`, in `/docker/code` or in `~/Downloads`.
- **Run the tests as one session** at the end of a change (`docs/TESTING.md`), not after every edit.
- **Processes:** port 9301 belongs to another project. Stop processes by PID; never use `pkill -f` or `pgrep -f`.
- **The owner's photo:** a real photo, or a drawing made from her own photo that she approves. **Never a realistic AI image** of her or of anyone else (`docs/MEDIA-BRIEF.md` §5).

## Commands

| Command | What it does |
|---|---|
| `npm ci` | Installs dependencies (Node 24, see `.nvmrc`). |
| `npm run dev` | Dev server with live reload. Test data is allowed, with a banner. Astro's background mode: `astro dev --background`. |
| `npm run check` | Data check plus Astro's type check. In the template, run it as `ALLOW_PLACEHOLDERS=1 npm run check`. |
| `npm run build` | Remakes the share images, runs the data check, then builds `dist/`. In a business repo it must pass as is. |
| `ALLOW_PLACEHOLDERS=1 npm run build` | Template or demo build with test data: banner and `noindex`. Never for a live site. |
| `npm run preview` | Serves `dist/`. |
| `npm run share-images` | Remakes `og-<lang>.jpg` from the data. The files are tracked, so commit them when they change. |
| `npm run area-map` | Remakes the service-area map from OpenStreetMap (once per business). |

## Where things are

- `src/data/`: all business data.
  - `config.json`: languages, theme, sections, hero video, analytics.
  - `business.json`: site address and base path, phones, prices, work hours, booking settings.
  - `media.json`
  - `locales/<lang>/{content,seo,ui}.json`
- `src/assets/media/`: images, optimized at build. `public/media/` holds the hero videos.
- `src/lib/`:
  - `schema.ts`: the Zod schemas.
  - `validate.ts`: the data check, covering test values, missing files, contrast and placeholders.
  - `booking.ts`: prices and the WhatsApp message.
  - `share.ts`, `structured-data.ts`.
- `src/components/`: one component per section, plus `BookingPanel.astro` and `ShareDialog.astro`. `src/layouts/Base.astro` holds the head, header, footer and language redirect.
- `scripts/`:
  - `check-data.mjs`: the data check (runs before every build).
  - `share-images.mjs`: share images from the data, with Rubik TTFs in `scripts/fonts/`.
  - `area-map.mjs`: the OpenStreetMap area image.
- `.github/workflows/deploy.yml`: build and publish to GitHub Pages on every push to `main`.

## Lessons learned

- **Chrome's automatic translation is not a site bug.** When Chrome translates the English page into Hebrew, it adds niqqud, gets the gender wrong and breaks right-to-left. Check with translation off. This confusion is why only Russian redirects by device language.
- **Don't set a GitHub Pages custom domain before the domain resolves.** GitHub redirects the github.io address to it, so the test site breaks. A new `.il` domain can take hours to publish. When the domain does go live, switch `business.json` to `siteUrl` `https://<domain>` and `basePath` `/` in the same push, or the assets 404.
- **Don't write a shape or ratio in AI image or video prompts.** The tool may draw it as text ("9:16"). Pick the shape in the tool, and make the start image the same shape as the output, or you get black bars.
- **Hero video:**
  - Frame interpolation (ffmpeg `minterpolate`) blurs.
  - Show the photo and the video one at a time, never both; the photo hides while the video plays.
  - The loop recipe is in `docs/MEDIA-BRIEF.md` §4.
- **Astro scoped CSS:** a `<script>` element sits between sections, so `.hero + .section` never matches. Use `.hero ~ section.section:not(.section ~ section)`.
- **Headless Chrome tests:** the test server must send real `Content-Type`s for `.txt` and `.xml`, otherwise Chrome downloads files (`robots.txt`) into `~/Downloads`. Also deny downloads in the test browser.
- **Live tests block Umami** (`*umami*`), so tests don't count as visits.
- **Facebook Sharing Debugger:** response code 206 and the `fb:app_id` warning are normal; ignore them. After the share text or image changes, deploy first, then click **Scrape Again**.
- **Search Console** may show "couldn't fetch" for a sitemap submitted on launch day. It clears by itself.
- **Removing a photo for good:** deleting the file isn't enough in a public repo (`docs/MEDIA-BRIEF.md` §5).
