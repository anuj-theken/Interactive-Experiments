# Prototype Structure Guide — TCS

This document describes the conventions used in this project so that new prototypes can be converted into the same structure quickly.

Design tokens in this revision are derived from **TCS Mood Board.png**. The companion file `design.html` is the visual reference — swatches, specimens, motifs and the measured contrast numbers. This file is the machine-facing half: what to put in `globals.css`, and the rules Claude must follow when writing module code.

---

## What already exists (never regenerate)

Every project folder already has these before any conversion starts:

| File | What it does |
|------|-------------|
| `index.html` | Server version — absolute paths, Ruttl widget included |
| `index_localLinked.html` | Local dev version — relative paths, no Ruttl widget |
| `styles/globals.css` | Central CSS variables for fonts, type scale, and color palette |

All CDN libraries (GSAP, ScrollTrigger, ECharts) are already loaded in both index files. `globals.css` is already linked in both index files before any module CSS.

**Claude never regenerates these files.** The output of every conversion is only:
- `<section>` block(s) to paste into the existing index files
- `styles/modulename.css` file(s)
- `scripts/modulename.js` file(s)

---

## globals.css — what's in it

This is the single source of truth for design tokens. Module CSS files reference these variables — they never redeclare fonts or hardcode hex colors.

```css
/* styles/globals.css */
@font-face {
  font-family: "Reckless";
  src: url("/fonts/Reckless-Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
}

:root {
  /* ── Type scale — pc / desktop (≥1024px) ── */
  --type-stat:       72px;   /* hero figure — the moodboard's big number */
  --type-heading:    36px;
  --type-subheading: 22px;
  --type-body:       18px;
  --type-legend:     14px;
  --type-eyebrow:    11px;   /* tracked uppercase kicker */

  --font-display: "Reckless", serif;
  --font-body:    "Archivo", sans-serif;
  --font-mono:    "IBM Plex Mono", ui-monospace, monospace;  /* years, tabular figures */

  /* ── Section spacing — pc / desktop (≥1024px) ── */
  --spacing: 120px;

  /* ── Surfaces & ink — sampled from TCS Mood Board.png ── */
  --color-bg:           #f3efe9;  /* Bone — page ground, never stark white */
  --color-bg-warm:      #e6e0d4;  /* Greige — secondary ground, zebra, inactive */
  --color-surface:      #ffffff;  /* card face lifted off the paper */
  --color-bg-dark:      #001647;  /* Ink Navy — chapter panel & dark-mode surface */

  --color-text:         #001647;  /* 15.21:1 on Bone */
  --color-muted:        #5a6580;  /* Slate — 5.08:1 on Bone */
  --color-text-invert:  #f3efe9;  /* copy on the navy panel */
  --color-muted-invert: #9fb0d4;  /* 7.99:1 on navy */
  --color-rule:         #d9d3c6;  /* hairline borders & dividers */
  --color-grid:         #cfe3e3;  /* graph-paper & chart gridlines */

  /* ── Brand / accent ── */
  --color-primary:   #2540b4;  /* Cobalt — links, markers, hero figures. 7.42:1 on Bone */
  --color-secondary: #001647;  /* Ink Navy */
  --color-accent:    #8dd7d6;  /* Aqua — FILL ONLY, 1.43:1 on Bone */
  --color-sky:       #5ba9d1;  /* mid fill, duotone highlight */
  --color-signal:    #ff6900;  /* the one hot accent — emphasis only */
  --color-amber:     #f3ad3d;
  --color-green:     #7abc72;
  --color-forest:    #10371a;
  --color-mint:      #a7d7bc;
  --color-plum:      #7927af;

  /* ── Chart: categorical, light. FIXED ORDER — assign 1..6, never cycle ── */
  --cat-1: #2946ba;  /* Cobalt */
  --cat-2: #fe6906;  /* Orange */
  --cat-3: #41c5c5;  /* Teal   */
  --cat-4: #e5a02c;  /* Amber  */
  --cat-5: #7827ae;  /* Plum   */
  --cat-6: #7abd72;  /* Green  */

  /* ── Chart: categorical, dark (on --color-bg-dark). Same slot order ── */
  --cat-dark-1: #648bff;
  --cat-dark-2: #ee6200;
  --cat-dark-3: #2ca7a7;
  --cat-dark-4: #c58502;
  --cat-dark-5: #b569f2;
  --cat-dark-6: #65a75e;

  /* ── Chart: sequential (magnitude), single hue, light → dark ── */
  --seq-100: #90a8e3;
  --seq-200: #6c8bde;
  --seq-300: #4a6dd7;
  --seq-400: #3150c5;
  --seq-500: #223a9c;
  --seq-600: #182a6b;

  /* dark mode flips the anchor: low → high runs dark → light */
  --seq-dark-100: #2b49be;
  --seq-dark-200: #4265d7;
  --seq-dark-300: #6082e6;
  --seq-dark-400: #82a0ee;
  --seq-dark-500: #a6bdf5;
  --seq-dark-600: #cad9fb;

  /* ── Chart: diverging — Cobalt ↔ Orange, NEUTRAL midpoint ── */
  --div-neg-3: #3150c5;
  --div-neg-2: #5a7ad6;
  --div-neg-1: #89a1df;
  --div-mid:   #dcd7cb;
  --div-pos-1: #d59071;
  --div-pos-2: #d46935;
  --div-pos-3: #c04d00;

  /* ── Status — reserved meaning, never a series color ── */
  --status-good:     #2f7d32;
  --status-warning:  #b07503;
  --status-serious:  #c04d00;
  --status-critical: #a31f1f;
}

/* iPad (769px–1023px) */
@media (max-width: 1023px) {
  :root {
    --type-stat:       56px;
    --type-heading:    32px;
    --type-subheading: 20px;
    --type-body:       16px;
    --type-legend:     12px;
    --type-eyebrow:    11px;
    --spacing: 110px;
  }
}

/* Mobile (≤768px) */
@media (max-width: 768px) {
  :root {
    --type-stat:       44px;
    --type-heading:    28px;
    --type-subheading: 17px;
    --type-body:       14px;
    --type-legend:     11px;
    --type-eyebrow:    10px;
    --spacing: 100px;
  }
}

.TK4R-spacer {
  height: var(--spacing);
}
```

When starting a new project, update only the `--color-*` / `--cat-*` / `--seq-*` / `--div-*` blocks. Type scale, spacing, and the three breakpoints stay the same.

---

## Typography, spacing & breakpoints

Sizes are responsive via CSS variables — `globals.css` swaps the values at each breakpoint, module CSS never sets raw values or its own media queries for these tokens.

| Element | PC (≥1024px) | iPad (769–1023px) | Mobile (≤768px) | Font |
|---------|:---:|:---:|:---:|------|
| Hero stat figure | 72px | 56px | 44px | Reckless |
| Main heading / chart title | 36px | 32px | 28px | Reckless |
| Subheading / section label | 22px | 20px | 17px | Archivo |
| Body copy, annotations | 18px | 16px | 14px | Archivo |
| Legend / chip labels | 14px | 12px | 11px | Archivo |
| Eyebrow / kicker | 11px | 11px | 10px | Archivo 600, 0.14em, uppercase |
| Year / data marker | 15px | 15px | 14px | IBM Plex Mono 500, tabular |
| Footnotes, source lines | 13–14px | 13–14px | 13px | Archivo |
| Section spacing (`.TK4R-spacer`) | 120px | 110px | 100px | — |

Heading, subheading, and legend all scale down at the same ratio as body copy at each breakpoint — never adjust one without the other.

**New in this revision** (the moodboard leans on all three): `--type-stat` for the oversized single figure, `--type-eyebrow` for tracked uppercase kickers, and `--font-mono` for years and any tabular figures. Use `font-variant-numeric: tabular-nums` wherever numbers change on scroll or hover, so the layout doesn't jitter.

In module CSS, always use the variables — never set raw values:

```css
.TK4R1-chart-title    { font-family: var(--font-display); font-size: var(--type-heading); }
.TK4R1-chart-subtitle { font-family: var(--font-body);    font-size: var(--type-subheading); }
.TK4R1-legend-item    { font-family: var(--font-body);    font-size: var(--type-legend); }
.TK4R1-eyebrow        { font-family: var(--font-body);    font-size: var(--type-eyebrow);
                        letter-spacing: 0.14em; text-transform: uppercase; }
.TK4R1-year           { font-family: var(--font-mono);    font-variant-numeric: tabular-nums; }
```

---

## Chart color — the rules

The moodboard's six-swatch strip is a **sequential ramp**, not a series palette. Used as one it fails on three counts: the ends sit outside the legible lightness band, greige and aqua fall under the chroma floor, and aqua↔green are too close to tell apart. The `--cat-*` slots above are those same hues stepped into the band; both light and dark sets pass all six palette checks.

**Non-negotiables:**

- **Assign `--cat-1..6` in fixed order.** Series 1 takes slot 1. Never cycle, never generate a 7th hue — a 7th series folds into "Other", becomes small multiples, or the chart gets faceted.
- **Color follows the entity, never its rank.** A filter that changes the series count must not repaint the survivors.
- **One y-axis, always.** Two measures of different scale become two charts, small multiples, or values indexed to a common base. Never a second axis.
- **Slots 2, 3, 4 and 6 sit below 3:1 on Bone.** Any series wearing them **must** carry a direct label or a table view. This is a hard requirement, not a preference.
- **Scatter, bubble, choropleth and small-multiple forms cap at three series** (slots 1–3) — in those forms any two marks can end up adjacent, which is a stricter test than neighbours-only. More than three means facet or fold.
- **Sequential is one hue, light → dark** (`--seq-*`). Never a rainbow. Dark mode flips the anchor — use `--seq-dark-*`, which runs dark → light as values rise.
- **Diverging is two hues plus a neutral midpoint** (`--div-*`). Never a hue at zero, and only where the data has a real baseline.
- **Status colors are reserved.** `--status-*` never stands in for "series 4", and always ships with an icon *and* a text label — never color alone.
- **Text wears ink tokens, never the series color.** Values, axis labels and legend text use `var(--color-text)` / `var(--color-muted)`; the colored chip beside the label carries identity.
- **Legend always present for ≥2 series** (a single series needs none — the title names it), and ≤4 series are also directly labeled, so identity is never carried by color alone.
- **Recessive chrome.** Gridlines `var(--color-grid)`, axis lines and ticks `var(--color-muted)`, 1px. Thin marks: 2px lines, ≥8px markers, a 2px surface gap between adjacent fills and between stacked segments.

Chart series colors are read from the CSS variables at runtime rather than hardcoded, so the chart always matches the design system:

```js
const css  = getComputedStyle(document.documentElement);
const CAT  = [1,2,3,4,5,6].map(i => css.getPropertyValue(`--cat-${i}`).trim());
const INK  = css.getPropertyValue("--color-text").trim();
const GRID = css.getPropertyValue("--color-grid").trim();
```

---

## Naming conventions

### Prefixes

Fixed for this project — never invent new ones.

| Scope | Prefix |
|-------|--------|
| Shared layout (spacers, outer wrappers) | `TK4R-` |
| Module 1 | `TK4R1-` |
| Module 2 | `TK4R2-` |
| Module N | `TK4RN-` |

`TK4R` is this project's opaque code (the previous project used `QW4K`). It stays deliberately meaningless so module CSS can never collide with a class name on the host page. If you'd rather use a different four-character code, swap it once here and it propagates — nothing else depends on the letters.

Every CSS class and every JS `querySelector` / `getElementById` must use one of these. State the module map in your Claude prompt so Claude knows which number belongs to which visualization.

### Section version comments

Each `<section>` is preceded by a version comment so it's easy to track revisions and disable old ones:

```html
<!--v1.0-->
<section class="TK4R1-chart-section">...</section>
```

To replace a section with a newer version, comment out the old one:

```html
<!--v1.0 REPLACED-->
<!--<section class="TK4R1-chart-section">...</section>-->

<!--v1.1-->
<section class="TK4R1-chart-section">...</section>
```

---

## Section HTML pattern

Claude outputs `<section>` snippets — not full HTML documents. Paste them between the existing content in the index files, wrapped in spacers.

For any card-style chart (a bordered container, as opposed to a bare full-bleed chart), use the frame + container + header-text/legend split below — this is the standard scaffold, not a one-off:

```html
<div class="TK4R-spacer"></div>

<!--v1.0-->
<section class="TK4R1-chart-section">
  <div class="TK4R1-chart-frame">
    <div class="TK4R1-chart-container">
      <div class="TK4R1-chart-header">
        <div class="TK4R1-chart-header-text">
          <p class="TK4R1-eyebrow">Chapter 02</p>
          <h2 class="TK4R1-chart-title">Title</h2>
          <p class="TK4R1-chart-subtitle">Subtitle</p>
        </div>
        <div class="TK4R1-legend" id="TK4R1-legend"></div>
      </div>
      <div id="TK4R1-chart"></div>
      <p class="TK4R1-source">Source: TCS Annual Reports.</p>
    </div>
  </div>
</section>

<div class="TK4R-spacer"></div>
```

The legend `<div>` is left empty in HTML — the module JS populates it (see the Custom HTML legend pattern below). If a chart doesn't need a legend, omit the `<div class="TK4RN-legend">` and drop the flex split in `.TK4RN-chart-header`. The eyebrow line is optional; drop it on charts that aren't opening a chapter.

---

## Card treatment — flat, not shadowed

The moodboard's references are printed pieces. Cards in this system are **flat**: a white face on the Bone ground with a hairline `--color-rule` border. The previous house style's `0 0 30px rgba(0,0,0,0.12)` drop shadow does not belong here.

```css
.TK4R1-chart-frame {
  width: 100%;
  max-width: 1450px;   /* ~100px wider than the container's own max-width */
  margin: 0 auto;
  padding: 40px 24px;  /* shrink to ~20px 12px under 768px */
  box-sizing: border-box;
}

.TK4R1-chart-container {
  width: 100%;
  max-width: 1350px;
  margin: 0 auto;
  background: var(--color-surface);
  border: 1px solid var(--color-rule);
  border-radius: 4px;
  box-sizing: border-box;
}
```

**Keep the frame wrapper even though the shadow is gone.** It owns the card's outer padding, which keeps the gutter consistent across modules, and it is still load-bearing for any module that *does* opt into a shadow — for which the original rule stands:

> Any `.TK4RN-chart-container` with a `box-shadow` must be wrapped in a `.TK4RN-chart-frame` — never apply the shadow directly inside `.TK4RN-chart-section`.
>
> **Why:** `.TK4RN-chart-section` sometimes needs `overflow-x: hidden` (to guard against a flex child overflowing on iPad). Per the CSS spec, once `overflow-x` is non-`visible`, the browser force-computes `overflow-y` to `auto` too — *even if `overflow-y: visible` is set explicitly*. That silently clips the container's `box-shadow` on the top and bottom. Wrapping the container in a padded frame (which never sets `overflow`) keeps the clipping boundary far enough away that the shadow always renders in full.

---

## Dark chapter panels

A full-bleed `--color-bg-dark` section breaks the cream run and marks a new act. Inside one, the whole ink and chart palette switches:

```css
.TK4R3-chapter {
  background: var(--color-bg-dark);
  color: var(--color-text-invert);
}
.TK4R3-chapter .TK4R3-chart-subtitle { color: var(--color-muted-invert); }
.TK4R3-chapter .TK4R3-eyebrow        { color: var(--color-accent); }
```

Charts inside a dark panel read `--cat-dark-*` and `--seq-dark-*` instead of the light sets. These are **separately selected steps**, not a programmatic lightening of the light palette — don't compute them, use the tokens.

---

## Motifs the moodboard repeats

`design.html` §05 shows all six rendered. They're listed here so module code names them consistently:

| Motif | Class stem | Notes |
|---|---|---|
| Timeline spine | `.TK4RN-spine` / `.TK4RN-node` | 1px `--color-rule` vertical, cobalt node dots, years in `--font-mono` |
| Hero stat | `.TK4RN-stat` | `--type-stat` figure in `--color-primary` + short caption in `--color-muted` |
| Isotype / waffle grid | `.TK4RN-iso` | 10 units per row; greige remainder, cobalt count, `--color-signal` for the called-out part |
| Duotone archival photo | `.TK4RN-duo` | B&W image under a cobalt→navy multiply; aqua caption |
| Graph-paper ground | `.TK4RN-graph` | 22px `--color-grid` grid on Bone, standing in for gridlines |
| Navy chapter panel | `.TK4RN-chapter` | see above |

---

## Custom HTML legend pattern

Chart legends are plain HTML/CSS chips rendered in `.TK4RN-chart-header`, next to the title/subtitle — not ECharts' built-in legend component. This keeps the legend inside the same visual container as the header (so it can share alignment, spacing, and the design-system's `--type-legend` token) and lets it sit top-right (or centered, stacked, on mobile) without fighting the chart's own layout.

ECharts still owns the actual show/hide state — the module keeps a `legend` component in the option with `show: false`, and toggles it via `dispatchAction`, syncing the HTML chips to match:

```js
// option
legend: { data: categories, show: false }

// build the chips once, and again after any resize-driven re-render
function buildLegend() {
  legendDom.innerHTML = '';
  categories.forEach(function (cat, i) {
    const item = document.createElement('div');
    item.className = 'TK4R1-legend-item';
    // ...dot tinted CAT[i] + label in var(--color-text)...
    item.addEventListener('click', function () {
      myChart.dispatchAction({ type: 'legendToggleSelect', name: cat });
    });
    legendDom.appendChild(item);
  });
}

// keep chip opacity in sync with actual series visibility
myChart.on('legendselectchanged', function (params) {
  categories.forEach(function (cat) {
    legendItemEls[cat].classList.toggle('is-inactive', !params.selected[cat]);
  });
});
```

```css
.TK4R1-legend-item {
  font-family: var(--font-body);
  font-size: var(--type-legend);
  color: var(--color-text);
  cursor: pointer;
  transition: opacity 0.15s ease;
}
.TK4R1-legend-item.is-inactive { opacity: 0.35; }
```

The chip dot carries the series color; the label text stays in `--color-text`. Never tint the label itself.

After pasting each section, manually add the corresponding `<link>` and `<script>` tags to both index files:

```html
<!-- in <head> of both index files -->
<link rel="stylesheet" href="styles/modulename.css" />          <!-- local -->
<link rel="stylesheet" href="/ProjectName/styles/modulename.css" /> <!-- server -->

<!-- at bottom of <body> in both index files -->
<script src="scripts/modulename.js"></script>           <!-- local -->
<script src="/ProjectName/scripts/modulename.js"></script>  <!-- server -->
```

If the source prototype loads an external library not already in the index files (e.g. Leaflet), add its CDN `<link>`/`<script>` tags alongside the existing CDN tags — same absolute-vs-relative split doesn't apply to CDN URLs, they're identical in both index files.

---

## Interaction baseline

An HTML chart is interactive by default — ship the hover layer rather than adding it later:

- Crosshair + tooltip on line and area charts; per-mark tooltip on bar, dot and cell charts. The only form that skips it is a bare stat tile with no plot.
- Hit targets larger than the mark itself.
- Filters and time-range controls sit in **one row above** the chart, never beside it.
- Tooltips use `--color-surface` with a `--color-rule` border and `--type-legend` text.

---

## Large embedded datasets

If a module's source prototype embeds a large literal dataset (GeoJSON, a big lookup table, etc. — anything that dominates the file's size), split it into its own `scripts/modulename_data.js`, not inline in `scripts/modulename.js`:

```html
<!-- data file loads BEFORE the module's logic file, in both index files -->
<script src="scripts/modulename_data.js"></script>      <!-- local -->
<script src="/ProjectName/scripts/modulename_data.js"></script>  <!-- server -->
<script src="scripts/modulename.js"></script>
<script src="/ProjectName/scripts/modulename.js"></script>
```

The data file just assigns the same global constant the original inline script did (e.g. `const MP_GEO = {...};`) — no build step, no `fetch`, no JSON import. Plain synchronous `<script>` tags execute in document order, so as long as the data file's tag comes first, the constant exists as a global by the time the module's `DOMContentLoaded` handler runs.

**Extract it verbatim — never retype it.** These blobs are often a single very long line; hand-transcribing them risks silent corruption. Pull the exact byte range out with a shell command (e.g. `sed -n '<line>p' source.html > data-file`) and splice it into place with shell tools, not by reading the whole blob into context and rewriting it by hand.

---

## Module CSS pattern

One file per visualization. References globals variables only — no raw values.

```css
/* styles/offshore.css — TK4R1 */

.TK4R1-scroll-wrapper {
  height: 600vh;
  position: relative;
}

.TK4R1-sticky-content {
  position: sticky;
  top: 0;
  height: 100vh;
}

.TK4R1-chart-title {
  font-family: var(--font-display);
  font-size: var(--type-heading);
  color: var(--color-text);
}

.TK4R1-chart-subtitle {
  font-family: var(--font-body);
  font-size: var(--type-subheading);
  color: var(--color-muted);
}

.TK4R1-source {
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--color-muted);
}

.TK4R1-legend-item {
  font-family: var(--font-body);
  font-size: var(--type-legend);
}
```

---

## Module JS pattern

One file per visualization. Self-contained inside a `DOMContentLoaded` listener.

```js
// scripts/offshore.js

document.addEventListener("DOMContentLoaded", function () {
  // 1. Data
  const data = [...];

  // 2. Tokens — read the design system, never hardcode
  const css  = getComputedStyle(document.documentElement);
  const CAT  = [1,2,3,4,5,6].map(i => css.getPropertyValue(`--cat-${i}`).trim());
  const INK  = css.getPropertyValue("--color-text").trim();
  const GRID = css.getPropertyValue("--color-grid").trim();

  // 3. DOM references — always use the module prefix
  const wrapper  = document.querySelector(".TK4R1-scroll-wrapper");
  const chartDom = document.getElementById("TK4R1-chart");

  // 4. Library init
  const chart = echarts.init(chartDom);

  // 5. Render / animation logic
  function update(stepIdx) { ... }

  // 6. Scroll trigger
  ScrollTrigger.create({ ... });
});
```

---

## Responsive images

Three crops per image — desktop, tablet, mobile. Use CSS classes + media queries to switch.

```html
<img src="imgs/image1.png"        class="TK4R1-desktop-img" />
<img src="imgs/image1_ipad.png"   class="TK4R1-ipad-img" />
<img src="imgs/image1_mobile.png" class="TK4R1-mobile-img" />
```

Archival photography goes through the duotone treatment (`.TK4RN-duo`) so decades of mixed-quality source imagery reads as one set.

---

## Step-by-step: converting a single HTML prototype

You start with one self-contained HTML file with inline `<style>` and `<script>` blocks. The output is section snippets + separate CSS and JS files.

### 1. Identify the modules

List every distinct visualization in the HTML. Number them. Each gets a prefix (`TK4R1-`, `TK4R2-`, …) and a short filename (`offshore`, `y2k`, `timeline`).

### 2. Extract the CSS

For each module:
- Cut the `<style>` block out of the HTML.
- Save as `styles/modulename.css`.
- Rename all classes to `TK4RN-classname`.
- Replace any hardcoded font names or hex colors with the `globals.css` variables.
- Update matching class names in the HTML.

### 3. Extract the JS

For each module:
- Cut the `<script>` block out of the HTML.
- Wrap in `document.addEventListener("DOMContentLoaded", function () { ... });`.
- Save as `scripts/modulename.js`.
- Update all `querySelector` / `getElementById` calls to use the prefixed names.
- Replace any hardcoded chart colors with the `--cat-*` / `--seq-*` reads shown above.

### 4. Clean up the HTML into section snippets

What remains in the HTML after extracting CSS and JS is the markup. For each visualization:
- Wrap it in `<section class="TK4RN-...">`.
- Add `<!--v1.0-->` above it.
- Surround with `<div class="TK4R-spacer"></div>` on both sides.

### 5. Plug into the index files

- Paste the `<section>` snippets into the body of both `index.html` and `index_localLinked.html`.
- Add `<link>` tags in `<head>` for each new CSS file (relative path in local, absolute in server).
- Add `<script>` tags at the bottom of `<body>` for each new JS file.

---

## Prompt to give Claude for the conversion

Paste this at the start of any conversion session. Fill in the module map, then paste the raw HTML below.

```
I'm converting a single HTML prototype into the project structure described below.
The index files and globals.css already exist — do NOT regenerate them.

Output only:
1. <section> snippet(s) — ready to paste into the existing index files
2. styles/modulename.css — one file per visualization
3. scripts/modulename.js — one file per visualization

--- Project name ---
TCS

--- Module map ---
TK4R1 = [name of first visualization]
TK4R2 = [name of second visualization]
(add more as needed)

--- Rules ---

PREFIXES
- Shared layout (spacers, outer wrappers): TK4R-
- Module-specific classes and IDs: TK4R1-, TK4R2-, etc. per module map above
- Apply to ALL CSS classes and JS querySelector/getElementById calls

TYPOGRAPHY — globals.css already declares these variables and swaps them per breakpoint. Just use them.
- Hero stat figure → font-family: var(--font-display); font-size: var(--type-stat);        /* 72 / 56 / 44px */
- Headings / chart titles → font-family: var(--font-display); font-size: var(--type-heading);  /* 36 / 32 / 28px */
- Subheadings → font-family: var(--font-body); font-size: var(--type-subheading);              /* 22 / 20 / 17px */
- Body / annotations → font-family: var(--font-body); font-size: var(--type-body);              /* 18 / 16 / 14px */
- Legend / chip labels → font-family: var(--font-body); font-size: var(--type-legend);          /* 14 / 12 / 11px */
- Eyebrow / kicker → font-size: var(--type-eyebrow); letter-spacing: 0.14em; text-transform: uppercase;
- Years / tabular figures → font-family: var(--font-mono); font-variant-numeric: tabular-nums;
- No hardcoded font names. No hardcoded sizes for these roles. No module-level media queries for type sizes — globals.css owns all three breakpoints (pc ≥1024px, iPad 769–1023px, mobile ≤768px).

SPACING — globals.css already declares --spacing and swaps it per breakpoint (120 / 110 / 100px).
- Use var(--spacing) for .TK4R-spacer and any other section-gap sizing — never hardcode.

COLORS — globals.css already declares every token. Just use them. No hardcoded hex, anywhere.
- Ground is var(--color-bg) (#f3efe9 Bone) — never stark white.
- Body copy var(--color-text); footnotes/axes var(--color-muted).
- var(--color-accent) (Aqua) and var(--color-sky) are FILL ONLY on Bone — they fail text contrast there. On a navy panel they are valid type colors.
- var(--color-signal) (Orange) is the single hot accent: one emphasised series, one highlighted year, an outlier. Never a background, never two in a view.

CHART COLOR
- Categorical: assign var(--cat-1) … var(--cat-6) in fixed order, series 1 → slot 1. Never cycle, never invent a 7th — fold to "Other" or facet.
- Read them at runtime from getComputedStyle(document.documentElement), don't hardcode a separate viz palette.
- Slots 2, 3, 4 and 6 are below 3:1 on Bone → those series MUST have a direct label or a table view.
- Scatter / bubble / choropleth / small multiples: cap at 3 series (slots 1–3), else facet.
- Sequential (magnitude): var(--seq-100..600), one hue light→dark. Dark panels use --seq-dark-*.
- Diverging (polarity): var(--div-neg-3..--div-pos-3) with the NEUTRAL var(--div-mid) at zero. Never a hue at the midpoint.
- Status: var(--status-good|warning|serious|critical), reserved meaning, always with an icon AND a label. Never as "series 4".
- One y-axis only. Two measures of different scale → two charts or index to a common base. Never a dual axis.
- Color follows the entity, not its rank — filtering must not repaint the surviving series.
- Legend text and data labels wear var(--color-text) / var(--color-muted), never the series color. The chip dot carries identity.
- Gridlines var(--color-grid), axes var(--color-muted), 1px. Lines 2px, markers ≥8px, 2px surface gap between adjacent/stacked fills.
- Legend present for ≥2 series (none for one); ≤4 series also get direct labels.

CARDS
- Flat: background var(--color-surface), 1px var(--color-rule) border, 4px radius. No drop shadow.
- Still wrap .TK4RN-chart-container in a padded .TK4RN-chart-frame — it owns the gutter, and it's required if the module ever does take a box-shadow (see "Card treatment" in this guide).

DARK PANELS
- A full-bleed var(--color-bg-dark) section switches ink to --color-text-invert / --color-muted-invert and charts to --cat-dark-* / --seq-dark-*. Use the tokens; don't compute a lightened version.

LEGENDS
- Chart legends are custom HTML chips in .TK4RN-chart-header (next to the title/subtitle), not ECharts' built-in legend component — see "Custom HTML legend pattern" in this guide. Keep an ECharts legend component with show:false purely to drive dispatchAction-based toggling.

INTERACTION
- Crosshair + tooltip on line/area, per-mark tooltip on bar/dot/cell. Filters in one row above the chart.

CSS FILES
- One file per module, scoped to that module's prefix
- No @font-face, no :root declarations — globals.css handles all of that
- No CDN <link> tags — already in the index files

JS FILES
- One file per module
- Wrapped in: document.addEventListener("DOMContentLoaded", function() { ... });
- No CDN <script> tags — already in the index files

SECTION HTML
- One <section> per visualization
- <!--v1.0--> comment above each section
- <div class="TK4R-spacer"></div> before and after each section
- For card-style charts: .TK4RN-chart-frame > .TK4RN-chart-container > (.TK4RN-chart-header with header-text + legend) + chart div + source line — see "Section HTML pattern" in this guide
- Output the snippets ready to paste — not a full HTML document

Output each file/snippet with its filename or description as a header.
```
