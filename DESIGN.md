# Personal site: build brief

Build Evan Davies-Velie's personal website from this brief. The look is settled. Match the mockups in `reference/` closely and don't invent a different style.

## Stack

- **Astro**, static output. No React unless a component really needs it.
- **Plain CSS** with custom properties (tokens below). No Tailwind.
- **Math:** `remark-math` + `rehype-katex` so project pages can use `$...$` and `$$...$$`.
- **Hosting:** Cloudflare Pages (or GitHub Pages), auto-deploy on push to `main`.

## The look: "Night Sky Liner Notes"

A dark night-sky page laid out like an album's liner notes. Research is **Side A**, personal projects are **Side B**, each item is a numbered **track** (A1, A2, B1...).

### Tokens

```css
:root {
  --bg: #0c0f1d;          /* page background */
  --panel: rgba(23,27,49,0.85);
  --line: #262b48;        /* borders, dividers */
  --line-soft: #1c2038;
  --text: #e9e6dd;
  --text-body: #d6d3cb;   /* long-form paragraphs */
  --muted: #b8b6c8;
  --dim: #8a90b4;
  --faint: #6b7096;       /* labels, track numbers */
  --amber: #e8b86b;       /* the one accent */
  --amber-hover: #f6d79e;
  --max: 1120px;          /* content width */
}
```

Amber is the only accent. The radio section is the one place it flips: amber background, dark text.

### Type

Google Fonts: **Instrument Serif** (400, italic), **DM Mono** (400, 500), **DM Sans** (400, 500, 600).

| Use | Font | Size |
|---|---|---|
| Name on home | Instrument Serif | 96px, line-height 0.95, second line italic amber |
| Project page title | Instrument Serif | 84px |
| Section headings | Instrument Serif | 56px (home), 42px (project) |
| Track titles | Instrument Serif | 34px |
| Body | DM Sans | 18px, line-height 1.75 on project pages |
| Labels, nav, track numbers, captions | DM Mono | 12-13px, uppercase, letter-spacing 0.1-0.14em |

Scale the big sizes down on phones (`clamp()`).

## The animated sky

This is the signature of the site. The exact CSS and markup are in `reference/sky.css` and `reference/sky.html`. Port them as a `<Sky />` component that sits behind all content (absolutely positioned, `pointer-events: none`, `aria-hidden`).

Layers: tiled star fields (one static, two twinkling), drifting nebula clouds, a faint Milky Way band, celestial grid lines, two constellations (Cassiopeia, Lyra), a ringed planet, a small galaxy, 12 four-point sparkle stars, a slow satellite, and three shooting stars. On the home page, rings pulse out from a spinning record behind the photo.

The project page uses a lighter version: no Milky Way, grid, constellations or planet, fewer sparkles. Make the component take a `variant` prop (`"full"` / `"light"`).

**Performance rules (these matter, the first version lagged badly):**
- Only animate `transform` and `opacity`.
- No `filter: blur()` on anything that moves. The nebulae are soft radial gradients instead.
- Never animate `background-position`.
- Respect `prefers-reduced-motion`: stop all animation, hide meteors, rings and satellite. (Already in `sky.css`.)
- Test on a phone and an older laptop before launch.

## Pages

### Home (`reference/home-mockup.html`)
1. Top bar: sky coordinates on the left in mono (`RA 04h 38m · DEC +45°30′`), nav on the right: Research, Projects, Radio, CV.
2. Hero: "VOL. 1 — LINER NOTES" label, name, one-line intro. On the right, a square photo with a spinning record behind it.
3. "Now spinning" strip: latest track from Last.fm.
4. **Side A · research:** a numbered track list. Each row: track number, title + one-line summary, tag on the right (THESIS / HARDWARE / PAPERS). Link to "Publications".
5. **Side B · for fun:** grid of square image cards with track number and title.
6. **Radio:** amber block, show name, schedule, play button with on/off-air status.
7. Footer: copyright, email, GitHub, Last.fm.

### Project page (`reference/project-mockup.html`)
1. Back link + nav.
2. Header: track label (`SIDE A · TRACK 1 · MASTER'S THESIS`), big title with an italic amber second half, one-line summary, pill tags.
3. Full-width hero figure with mono caption.
4. Two columns: a sidebar ("Tracklist" = section links, plus Links) and the article (max ~720px).
5. Article parts to support: numbered `h2`s, figures with mono captions, display math in a bordered panel, a highlighted "callout" box (amber border) for a key result.
6. Prev/next track links at the bottom.
7. On phones the sidebar stacks above the article.

### Also needed
- **Projects index** and **Publications** (generated from `src/data/publications.bib`, Evan's name bolded).
- **CV** page or PDF link.

## Content structure

Projects are a content collection: `src/content/projects/*.md`.

```yaml
---
title: "Blazar variability"
titleAccent: "with CHIME"     # italic amber part of the title
side: A                       # A = research, B = for fun
track: 1
tag: THESIS
summary: "One line for the home page list."
pills: ["McGill · 2026", "CHIME", "400–800 MHz"]
hero: ./blazar-hero.png
draft: false
---
```

Home page lists and track numbers come from this, sorted by `side` then `track`.

Starting projects (Evan writes the text):
- A1 Blazar variability with CHIME (thesis)
- A2 The nodding dish (CHORD elevation drive for beam calibration)
- A3 CHIME/FRB collaboration papers
- B1 Analog theremin
- B2 Astrophotography
- B3 WFMU playlist tool

Leave clear `[PLACEHOLDER]` text wherever real content is missing. Don't invent facts, numbers or quotes.

## Last.fm "now spinning"

- Fetch `user.getrecenttracks` (limit 1) from the Last.fm API on the client, refresh every 60s.
- Username and API key go in env vars (`PUBLIC_LASTFM_USER`, `PUBLIC_LASTFM_KEY`), never hard-coded.
- Show "NOW SPINNING" if the track is currently playing, otherwise "LAST PLAYED". Fail quietly (hide the strip) if the request fails.

## Radio (later)

Build the radio block as a static placeholder for now (off-air state, next show date). The plan is to wire it to a stream later. Keep the component self-contained so that's easy.

## Done means

- Matches the mockups on desktop, and works at phone width with no horizontal scroll.
- Sky runs smoothly and stops under reduced motion.
- Lighthouse performance and accessibility both 90+.
- Deploys from `main`.
