# Media Brief

Every image and video the site needs: what it's for, where it shows, its size, its file name, where it goes, the exact prompt, and how to make it with Google's tools.

This brief has **two parts**:
- **Part 1, the template's media (steps 6.2–6.3).** These are AI atmosphere images of a tidy room, with no real person and no real work in them, so they can live in the template and be copied into every new site.
- **Part 2, for a business site.** The owner's photo, photos of her work, and a logo. These are real and personal, so they are **collected and added only in the business's own repo** (step 9.5 for Ayelet), **never in the template**.

The prompts are written for the template's current business type: home cleaning, organizing and household help in an Israeli city. For another kind of business, keep the structure and change the scene (Part 2, §8).

---

## At a glance

| File | Where it shows | Made by | Shape / size | Goes in | Part |
|---|---|---|---|---|---|
| `hero.jpg` | Softly behind the dark glow of the hero on wider screens (built in step 6.3). Also the source of the share images and the video poster | You, with AI | 16:9 landscape, at least 1200 px wide | `src/assets/media/` | 1, template |
| `hero-mobile.jpg` | The same, on phones (built in step 6.3) | You, with AI | 9:16 portrait | `src/assets/media/` | 1, template |
| `og-he.jpg`, `og-en.jpg`, `og-ru.jpg` | The link preview in WhatsApp, Facebook and others (not on the page itself) | **The site, in step 6.3.** Don't make these | 1200 × 630 | made in step 6.3 | 1, template |
| `hero.mp4` | Not yet. The hero has no video player, and `config.json` → `heroVideo` is `false` | You, with AI, **only if step 6.4 says yes** | 16:9, about 8 seconds | `public/media/` | 1, template |
| `about.jpg` | The photo in the "Why us" section, next to the owner's name | **A real photo of the owner.** Never AI | Portrait, at least 1200 × 1500 | the business repo's `src/assets/media/` | 2, business only |
| Gallery photos | The gallery section, which is off until real photos exist | **Real photos of her work only** | 4:3 landscape, at least 1600 px wide | the business repo's `src/assets/media/` | 2, business only |
| `logo.svg` | Header and footer, instead of the text logo | Only if the business already has a logo | SVG | the business repo's `src/assets/media/` | 2, business only |

**Built as code, nothing to make:** the text logo (the default), icons, the hero glow and sparkles, the service-area graphic, the favicon (from the theme colors), the QR code (`/qr.svg`, `/qr.png`) and the contact card (`/contact.vcf`).

**The template keeps no `about.jpg`.** Its About section shows the placeholder (the owner's initial on a dark-aqua background), and its demo builds allow the missing file through `ALLOW_PLACEHOLDERS=1`.

---

## Rules

- **AI images are only for atmosphere:** an empty, tidy room. They never show people, and they are never presented as the business's actual work.
- **`about.jpg` is a real photo of the owner.** No AI image and no AI editing of her face or background. Cropping, straightening and brightness are fine.
- **Gallery: only real photos of her real work**, taken with the client's permission.
- **No text, logos or brand names inside images.** The site's text is real HTML, and share-image text is added in step 6.3.
- **Real photos lose their location data before they go into a repo.** Business repos are **public**, and the original file is stored there as-is (§ *Removing location data*).
- Google's AI images and videos always carry **SynthID**, an invisible watermark, plus C2PA metadata. That's fine, so leave them. A *visible* watermark is another matter: avoid it with the setting below rather than cropping it out.

---

## Which Google tool (checked October 2026)

| Tool | Where | Good for | Free use |
|---|---|---|---|
| **Gemini app** | [gemini.google.com](https://gemini.google.com) or the Gemini phone app | **Images: the simplest option.** Model: Nano Banana 2 | Images: free with any Google account. Downloads are **1K** without a plan and **2K** with any Google AI plan. Google doesn't publish a fixed daily number. Video needs Google AI Plus or higher |
| **Google Flow** | [flow.google](https://flow.google) (desktop Chrome; an Android app is in beta) | **Video** (Veo 3.1), and images with an explicit aspect-ratio picker and several versions at once | 50 credits a day with or without a subscription, plus a one-time 100 for new users. **Images: free.** The model available at no charge is Nano Banana 2 Lite. Veo 3.1 Lite video costs 10 credits per clip, so up to 5 clips a day. Free video is 720p; 1080p upscaling needs AI Plus, Pro or Ultra. Age 18+. Israel is a supported country |
| Google AI Studio | aistudio.google.com | Developers | Google's price list shows **no free tier** for the Nano Banana image models or Veo. Not needed here |
| Whisk, ImageFX | — | — | **Moved into Flow** in February 2026. Use Flow instead |

**Watch for this:** one Google Flow help page says Flow needs a Google AI Plus, Pro or Ultra plan, while the credits page says everyone gets 50 credits a day. If Flow asks you to subscribe, make the images in the Gemini app. The video can wait for step 6.4 anyway.

**One-time setup in the Gemini app (before making images):** since August 2026, Gemini has a setting that turns off the visible sparkle watermark in the corner of images. Open **Settings** (gear icon, bottom left on the web) → **Media watermark** → off. The setting is rolling out gradually and isn't offered in countries whose law requires a visible AI label. If you don't see it, make the images in Flow instead: Flow adds a visible watermark only if you turn it on, except in India, South Korea and Vietnam. SynthID stays either way.

**Write the prompts in English** even if the app is in Hebrew, because the models follow English prompts most precisely. (אפשר להשאיר את הממשק בעברית, רק את הפרומפט מדביקים באנגלית.)

**How to check a downloaded image's size:** on Windows, right-click → Properties → Details. On a Mac, Get Info. On Linux, `file hero.png`.

---

# Part 1 — The template's media (steps 6.2–6.3)

## 1. `hero.jpg` — the room behind the hero

**Purpose.**
- **On the page:** shown **softly behind the dark glow of the hero**, on wider screens. The photo layer is built in step 6.3. The headline, buttons and badges sit on top of it, centered.
- **Share images:** step 6.3 builds them from it: this photo under a dark overlay, with the business name, tagline, price and area on top (PLAN §11, *Share preview*).
- **Video poster:** the poster frame of the hero video, if a video is ever added (`media.json` → `heroVideo.poster`).

**Size.** 16:9 landscape, **at least 1200 px wide**, because the share images are 1200 × 630.
- A free 1K download (roughly 1,400 px on the long side) works, because the photo sits softened behind the glow.
- A 2K download (roughly 2,800 px on the long side) is sharper on large screens, but needs a Google AI plan.

**What it should look like.** A bright, spotless, tidy living room in a modern Israeli apartment, morning light, no people. The **middle of the frame must be calm** (open floor, soft light, nothing busy), because the headline sits over the center of the hero, the share image puts the name and price in the center, and WhatsApp may crop the share image to a centered square.

**File name.** `hero.jpg`. The download is often a PNG. If so, keep the original file and name it `hero.png`; don't rename a PNG to `.jpg`. Step 6.3 puts it in place under the name in `media.json`.

**Prompt (copy exactly):**

```
Photorealistic interior photograph of a bright, spotless, tidy living room in a modern Israeli apartment, early morning sunlight coming through a large window and a sliding glass balcony door with a partly raised white roller shutter. Light porcelain floor tiles, white walls, a light-gray fabric sofa with neatly arranged cushions, a low light-oak coffee table with a small vase of fresh greenery, a healthy green plant in a corner. A few soft aqua and teal accents in the cushions and a folded throw. Calm, airy, uncluttered, freshly cleaned feeling. The center of the frame is open and quiet: clear floor and soft light, no objects in the middle. Eye-level wide shot, 24mm lens, natural soft shadows, realistic textures, high detail, true-to-life colors. No people, no pets, no text, no logos, no brand names, no pictures or posters with writing. Wide landscape image, 16:9 aspect ratio.
```

**If you need to adjust it,** reply in plain words, for example:
- "Same room, less furniture in the middle of the picture."
- "Brighter, more morning sun on the floor."
- "Make it look like a normal mid-range apartment, less luxurious."
- "Same image, but in 16:9 landscape." (use this if it came out square)

### In the Gemini app (simplest)

1. Open [gemini.google.com](https://gemini.google.com) and sign in with a personal Google account.
2. Do the one-time **Media watermark** setup described above.
3. Click **Open sidebar** → **Images**. You can also type the prompt straight into a new chat.
4. Paste the prompt and send it. Without a plan, the model is **Nano Banana 2**. **Redo with Pro** (Nano Banana Pro) needs a Google AI plan and isn't needed here.
5. If it isn't right, reply with a change (see the examples above) instead of starting over. The aspect ratio is set by the prompt, so check that the result really is wide.
6. Hover over the image you like → **Download full size**. On the phone app, tap the image → download. Without a plan the download is 1K; with a Google AI plan it's 2K.
7. Check the size: **at least 1200 px wide**, and clearly wider than it is tall.

### In Google Flow (aspect-ratio picker, several versions at once)

1. Open [flow.google](https://flow.google) in Chrome on a computer and sign in. Flow requires age 18+.
2. Create a **New project**.
3. In the prompt box, click the **model name** → **Image**.
4. Choose **aspect ratio 16:9** and **4 outputs**. Pick the model available at no charge (Nano Banana 2 Lite) unless you have credits to spare for Nano Banana 2.
5. Paste the prompt (the 16:9 at the end does no harm) → **Generate**.
6. Open the best version → **Download**, choosing the largest size offered. Larger sizes may need a plan.
7. For small fixes, Flow can edit a selected area: lasso the area and describe the change.

**Before you accept it, check for these AI mistakes:** warped or melted furniture, a window that makes no sense, a sofa with too many legs, letters on books, boxes or the TV, a mezuzah or other symbols that tie the room to a specific home, a dirty or cluttered corner, or anything that looks like a real brand.

---

## 2. `hero-mobile.jpg` — the same room, for phones

**Purpose.** On phones, the hero shows this portrait version instead of `hero.jpg`, so the room isn't cut into a narrow strip (PLAN §9). It's built in step 6.3.

**Size.** 9:16 portrait, the 1K download (roughly 1,400 px tall). 9:16 covers the tallest phone screens, and a shorter crop can always be cut from it.

**File name.** `hero-mobile.jpg` (or `hero-mobile.png` as downloaded). **Goes in** `src/assets/media/`.

**Best way: start from `hero.jpg`** so both look like the same room. In the Gemini app, in the same chat as the chosen `hero.jpg`, send:

```
Now create the same living room, same style, same light and same colors, as a tall vertical photo for a phone screen, 9:16 aspect ratio. Keep the sofa and the window in the lower part of the picture, and keep the middle and upper part calm: wall, window light and open space only. No people, no text, no logos.
```

In Flow: choose **aspect ratio 9:16**, add `hero.jpg` to the prompt as a reference image (drag it into the prompt box), and use the same prompt.

**If it drifts into a different room,** use the full prompt instead: the `hero.jpg` prompt with its last sentence changed to `Tall vertical image, 9:16 aspect ratio, the sofa and window in the lower part, calm wall and light in the middle and upper part.`

---

## 3. Share images: `og-he.jpg`, `og-en.jpg`, `og-ru.jpg` — **don't make these**

**Purpose.** The preview card that appears when the link is pasted into WhatsApp, Facebook, LinkedIn, X or an Instagram DM. There's one per language.

**Who makes them:** **the site, in step 6.3**, generated from `hero.jpg` and the data (PLAN §11, *Share preview*). Every new business gets its own without design work. Nothing to make in step 6.2, except a good `hero.jpg`.

**For reference, what step 6.3 produces:**
- The `hero.jpg` photo under a dark overlay, with the logo or business name, tagline, price per hour and area, in the site's colors and font. The Hebrew reads right-to-left.
- **1200 × 630 JPEG, under 300 KB**, because WhatsApp skips large preview images.
- **Name and price readable inside the centered 630 × 630 square**, because WhatsApp may crop the image to a square.
- The card's text comes from `seo.json` → `share` (`title`, `description`, `imageAlt`).

**Today:** `media.json` → `og` lists the three files, and the data check looks for them in `src/assets/media/`. Until step 6.3 they're reported as missing, which a demo build with `ALLOW_PLACEHOLDERS=1` allows.

**After launch, and whenever the image or text changes:** run the link through Facebook's **Sharing Debugger** and click **Scrape Again**, because Facebook and WhatsApp cache the preview.

---

## 4. `hero.mp4` — optional background video

**Status:** the hero plays it softly behind the glow when `config.json` → `heroVideo` is `true`: `hero.mp4` (wide, 16:9) on wider screens and `hero-mobile.mp4` (tall, 9:16, `media.json` → `heroVideo.fileMobile`, optional) on phones held upright. Either loads only on a fast connection, never with reduced motion or data saver on, and it has a pause button; otherwise the hero shows the photo. Make each from its own photo as the start image (`hero.jpg` / `hero-mobile.jpg`) with the shape set in the tool, not in the prompt (a ratio in the prompt can be drawn as text). Keep only a clean stretch, loop it forward and back, remove the sound and compress it: `ffmpeg -i clip.mp4 -an -filter_complex "[0:v]trim=duration=4,setpts=PTS-STARTPTS,split[f][r];[r]reverse[rv];[f][rv]concat=n=2:v=1[o]" -map "[o]" -c:v libx264 -crf 26 -pix_fmt yuv420p -movflags +faststart public/media/hero.mp4` (about 3 MB for 8 seconds of 1080p).

**Making it:**
- **Purpose:** a short, silent, looping atmosphere shot: the same tidy room, a slow camera move, sunlight. The video is muted and can be paused, and it's off for visitors who turn off animations (PLAN §8, §12).
- **Size:** 16:9 landscape, about 8 seconds. Free Flow gives **720p**; 1080p needs a Google AI plan. Under the dark glow, 720p is likely enough.
- **File name:** `hero.mp4`. **Goes in `public/media/`**, because Astro doesn't process video. Its poster is `hero.jpg` in `src/assets/media/`.
- **Sound doesn't matter.** Veo may add ambient sound, but the hero video plays muted, and the sound track can be removed when the file is added.

**Prompt (copy exactly):**

```
Slow, smooth, steady camera push-in across this bright, tidy living room. Soft morning sunlight, a sheer curtain moving gently in a light breeze, sunlight shifting softly on the floor tiles. Calm and quiet; nothing else moves. One continuous shot, no cuts, photorealistic. No people, no pets, no text, no logos. No music, no voices.
```

**In Google Flow:**
1. Open the same project as the images at [flow.google](https://flow.google).
2. In the prompt box, click the **model name** → **Video**.
3. **Use `hero.jpg` as the start frame:** drag it onto **+ Add start frame**. That way the video and the poster match. For a cleaner loop, add the same image as the **end frame** too.
4. Preferences: **aspect ratio 16:9 (landscape)**, **1–2 outputs**, model **Veo 3.1 Lite** (10 credits per clip; the free 50 credits a day are enough for up to 5 clips), and **8 seconds** if a length choice is shown. Veo 3.1 Fast costs 20 credits per clip. Veo 3.1 Quality costs 100 credits, more than the free daily 50.
5. Paste the prompt → **Generate**.
6. Download the best clip.
7. **Check for:** objects that change shape, flickering light, a camera that jumps, anything that appears or disappears.

The Gemini app can also make Veo video, but only with Google AI Plus or higher.

---

## Handing over the template's media (step 6.2)

Put the files in one folder, with exactly these names. PNG originals keep `.png`.

```
hero.png            16:9 landscape, the room
hero-mobile.png     9:16 portrait, the same room
hero.mp4            only after step 6.4 says yes
```

Step 6.3 takes it from there:
- **`src/assets/media/`:** the images. Astro makes WebP files in several sizes at build time.
- **`public/media/`:** the video.
- **`media.json`:** updated to match.
- **The hero:** the photo layer is built.
- **Share images:** generated.

**The template still builds only with `ALLOW_PLACEHOLDERS=1` after step 6.3.** It keeps its `TODO` test data and has no owner photo, on purpose. A **business repo**, once its own data and photos are in, must build without it.

---

# Part 2 — For a business site (in the business's own repo only)

Everything in this part is collected from the business and added **only in that business's repo**, never in the template. For Ayelet this is step 9.5.

## 5. `about.jpg` — real photo of the owner

**Purpose.** It's shown in the "Why us" section next to her name and the about text. This is the one image that builds trust, so **it must be a real, recent photo of her. No AI image, and no AI-edited face or background.**

**Status:** without the file, the About section shows a placeholder (her initial), but only in builds with `ALLOW_PLACEHOLDERS=1`. **A business site's real build stops until `about.jpg` is in its `src/assets/media/`**, because `media.json` lists it and the data check requires every listed file.

**How it's displayed (from the code):** the photo is cropped from the center, to a **square on phones** and to a **4:5 portrait on screens from about 900 px wide**, at up to 960 px wide. So:
- **Portrait orientation**, at least 1200 × 1500. Any modern phone in its normal photo mode (3:4) is far above that. Don't crop it yourself.
- **Her face in the middle of the frame**, with space above her head and on both sides, so both the square and the 4:5 crop keep her whole face.

**How to take it (for whoever takes the photo):**
1. Use **daylight**, standing facing a window so the light falls on her face and not behind her. Don't use flash.
2. Choose a **calm, tidy background**: a light wall or a neat corner of a room. It suits the business. Avoid family photos, documents, a house number or anything personal behind her.
3. **She faces the camera and smiles**, framed from the waist or chest up, with the camera at her eye level.
4. Someone else takes it with the **back camera**, which has better quality than the selfie camera. Portrait mode is fine. Take 10–20 shots and pick the best.
5. **Plain clothes in solid colors** (white, light gray, navy or aqua go well with the site), with no logos or large prints.
6. **No beauty filters, stickers or AI effects.** Brightness, straightening and cropping are fine.
7. Send the original at **full quality**. In WhatsApp, attach it as a **document** (📎 → מסמך), not as a photo, because sending it as a photo compresses it.
8. **Remove the location data** before the file goes into the repo (see *Removing location data* below). A photo sent as a document keeps its GPS location, which can be her home address.

**File name:** `about.jpg`. **Goes in** the business repo's `src/assets/media/`. The name must match `media.json` → `about.file`.

**Message to send her (Hebrew):**

> היי! לאתר צריך תמונה אמיתית שלך (לא בינה מלאכותית). כמה טיפים: אור יום מחלון שמולך, רקע נקי ומסודר, פנים למצלמה עם חיוך, מהמותניים או מהחזה ומעלה, ושיהיה קצת מקום מעל הראש. עדיף שמישהו יצלם במצלמה האחורית, בלי פילטרים. אם אפשר, כבי לפני הצילום את שמירת המיקום בהגדרות המצלמה, כדי שהכתובת לא תישמר בתמונה. צלמי כמה, ושלחי את הכי טובות בוואטסאפ **כקובץ (מסמך)**, לא כתמונה, כדי שלא יידחסו. תודה! 😊

---

## 6. Gallery — **real photos of her work only, later**

**Status:** the gallery section is off (`config.json` → `sections.gallery: false`), and `media.json` → `gallery` is empty. It's turned on in the business repo when there are real photos.

**Rules:**
- **Only real photos of her real work.** No AI, no stock photos, and nothing from someone else's business.
- **Ask the client's permission** for every home.
- **Nothing personal in the frame:** no faces, family photos, documents, mail, a house number, a view out of the window that identifies the building, or a mirror that shows the photographer.

**How it's displayed (from the code):** tiles are **square on phones** and **4:3 from about 640 px wide**, cropped from the center. Tapping a tile opens a version up to **1600 px wide**. So:
- **Landscape, 4:3, at least 1600 px wide**, which any modern phone camera exceeds. Keep the subject in the middle.
- Shoot in daylight, with lights on, and the room straightened. **No filters.**
- Send the originals as **documents**. **Remove the location data**, which reveals the client's address (see below).

**File names:** `gallery-01.jpg`, `gallery-02.jpg`, and so on. **Go in** the business repo's `src/assets/media/`.

**In the data:**
- Add each photo to `media.json` → `gallery`, as `{ "file": "gallery-01.jpg", "alt": "gallery01" }`.
- Add the matching alt text to **every** language's `content.json` → `media`, for example `"gallery01": "Kitchen after a deep clean"` (in each language). The data check fails if an alt text is missing in any language.
- Set `config.json` → `sections.gallery: true`.

---

## Removing location data (every real photo)

Phone photos usually store the **GPS location** where they were taken: her home, or a client's. A business repo is **public**, and the original file is stored in it as-is, so **remove the location before copying a photo into the repo**, then confirm it's gone.

- **Windows:**
  1. Right-click the file → **Properties** → **Details** → **Remove Properties and Personal Information**.
  2. Choose **Remove the following properties from this file**, tick everything under **GPS** (or **Select All**) → **OK**.
  3. **To confirm,** open Properties → Details again. There should be no **GPS** section (Latitude/Longitude).
- **Mac:**
  1. Open the file in **Preview** → **Tools** → **Show Inspector** → the **GPS** tab → **Remove Location Info**.
  2. **To confirm,** reopen the Inspector. The GPS tab is gone.
- **Linux:**
  1. Run `exiftool -overwrite_original -gps:all= -xmp:geotag= about.jpg`. This also clears location stored by editing apps (XMP), and leaves no backup copy behind.
  2. **To confirm,** run `exiftool -gpsposition about.jpg`. It should print nothing.

Asking her to turn off location in the camera's settings before taking photos helps too, but always check the file anyway.

---

## 7. Logo — optional, **nothing to make**

**Status:** the template has no logo file. The site shows the **text logo** (a sparkle mark in the theme color next to the business name). That's the default and a permanent design option, not a placeholder.

**Don't generate a logo with AI** for this. If the business **already has a real logo:**
- Ask for an **SVG**. The file is served as-is (not optimized) at about 40 px tall in the header and footer.
- **It must read on the dark navy header and footer of the home page and on light backgrounds.** If the logo works on only one of them, ask the designer for both a light and a dark version. Note that the site currently takes **one** logo file, so using two versions needs a small code change. Otherwise, keep the text logo.
- **File name:** `logo.svg`. **Goes in** the business repo's `src/assets/media/`.
- Add `"logo": { "file": "logo.svg", "alt": "logo" }` to `media.json`, plus a `"logo"` alt text (usually the business name) in every `content.json` → `media`.

---

## 8. A different kind of business

Every site made from the template starts with the template's `hero.jpg` and `hero-mobile.jpg`, the tidy living room. **For a cleaning or household business, they can stay.** For any other kind of business, make a new pair in the business repo:
1. Rewrite the scene in the §1 prompt, keeping the rules: atmosphere only, no people, no text, calm center, 16:9.
2. Make the 9:16 version with the §2 prompt.
3. Replace both files in the business repo's `src/assets/media/`.

The share images follow automatically.

---

## Sources (checked 6 October 2026)

- Gemini app, creating images, 1K/2K downloads, **Download full size**: [support.google.com/gemini/answer/14286560](https://support.google.com/gemini/answer/14286560)
- Gemini app limits by plan; video needs AI Plus or higher: [support.google.com/gemini/answer/16275805](https://support.google.com/gemini/answer/16275805)
- Nano Banana 2 in the Gemini app (Feb 2026), 1K free / 2K paid, aspect ratios: [workspaceupdates.googleblog.com/2026/02/introducing-nano-banana-2-in-gemini-app.html](https://workspaceupdates.googleblog.com/2026/02/introducing-nano-banana-2-in-gemini-app.html)
- Gemini "Media watermark" setting (Aug 2026): [androidheadlines.com/2026/08/google-gemini-turn-off-corner-media-watermarks-3-7-flash.html](https://www.androidheadlines.com/2026/08/google-gemini-turn-off-corner-media-watermarks-3-7-flash.html)
- Flow: Whisk and ImageFX merged in, free image generation (Feb 2026): [blog.google/…/flow-updates-february-2026](https://blog.google/innovation-and-ai/models-and-research/google-labs/flow-updates-february-2026/)
- Flow at flow.google, Gemini Omni, Android app (May 2026): [blog.google/…/flow-updates](https://blog.google/innovation-and-ai/models-and-research/google-labs/flow-updates/)
- Flow models: Nano Banana 2 Lite at no charge, Veo 3.1 Lite/Fast/Quality: [support.google.com/flow/answer/16352836](https://support.google.com/flow/answer/16352836)
- Flow credits: 50 a day, cost per video model, upscaling by plan: [support.google.com/flow/answer/16526234](https://support.google.com/flow/answer/16526234)
- Flow requirements (18+) and watermarks: [support.google.com/flow/answer/16353333](https://support.google.com/flow/answer/16353333)
- Flow countries (Israel included): [support.google.com/flow/answer/16353544](https://support.google.com/flow/answer/16353544)
- Creating images and videos in Flow: [support.google.com/flow/answer/16729550](https://support.google.com/flow/answer/16729550), [support.google.com/flow/answer/16353334](https://support.google.com/flow/answer/16353334)
- Veo 3.1 vertical video and availability (Jan 2026): [blog.google/…/veo-3-1-ingredients-to-video](https://blog.google/innovation-and-ai/technology/ai/veo-3-1-ingredients-to-video/)
- Gemini API prices, no free tier for Nano Banana or Veo: [ai.google.dev/gemini-api/docs/pricing](https://ai.google.dev/gemini-api/docs/pricing)

Google changes these tools often. If a button has moved, the help pages above are the place to check.
