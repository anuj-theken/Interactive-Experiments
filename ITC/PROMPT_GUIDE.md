# Prototype Structure Guide

This document describes the conventions used in this project so that new prototypes can be converted into the same structure quickly.

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
  /* Type scale — pc / desktop (≥1024px) */
  --type-heading:    36px;
  --type-subheading: 22px;
  --type-body:       18px;
  --type-legend:     14px;
  --font-display: "Reckless", serif;
  --font-body:    "Archivo", sans-serif;

  /* Section spacing — pc / desktop (≥1024px) */
  --spacing: 120px;

  /* Color palette — updated per project */
  --color-primary:   #d70a0d;
  --color-secondary: #590b23;
  --color-accent:    #f4a261;
  --color-bg:        #ffffff;
  --color-text:      #1d1b1c;
  --color-muted:     #888888;
}

/* iPad (769px–1023px) */
@media (max-width: 1023px) {
  :root {
    --type-heading:    32px;
    --type-subheading: 20px;
    --type-body:       16px;
    --type-legend:     12px;
    --spacing: 110px;
  }
}

/* Mobile (≤768px) */
@media (max-width: 768px) {
  :root {
    --type-heading:    28px;
    --type-subheading: 17px;
    --type-body:       14px;
    --type-legend:     11px;
    --spacing: 100px;
  }
}

.QW4K-spacer {
  height: var(--spacing);
}
```

When starting a new project, update only the `--color-*` variables in `globals.css`. Everything else — type scale, spacing, and the three breakpoints — stays the same.

---

## Typography, spacing & breakpoints

Fixed across all projects — never change. Sizes are responsive via CSS variables — `globals.css` swaps the values at each breakpoint, module CSS never sets raw values or its own media queries for these tokens.

| Element | PC (≥1024px) | iPad (769–1023px) | Mobile (≤768px) | Font |
|---------|:---:|:---:|:---:|------|
| Main heading / chart title | 36px | 32px | 28px | Reckless |
| Subheading / section label | 22px | 20px | 17px | Archivo |
| Body copy, annotations | 18px | 16px | 14px | Archivo |
| Legend / chip labels | 14px | 12px | 11px | Archivo |
| Footnotes, source lines | 13–14px | 13–14px | 13px | Archivo |
| Section spacing (`.QW4K-spacer`) | 120px | 110px | 100px | — |

Heading, subheading, and legend all scale down at the same ratio as body copy at each breakpoint — never adjust one without the other.

In module CSS, always use the variables — never set raw values:

```css
.QW4K1-chart-title    { font-family: var(--font-display); font-size: var(--type-heading); }
.QW4K1-chart-subtitle { font-family: var(--font-body);    font-size: var(--type-subheading); }
.QW4K1-legend-item    { font-family: var(--font-body);    font-size: var(--type-legend); }
```

---

## Naming conventions

### Prefixes

Fixed — never invent new ones.

| Scope | Prefix |
|-------|--------|
| Shared layout (spacers, outer wrappers) | `QW4K-` |
| Module 1 | `QW4K1-` |
| Module 2 | `QW4K2-` |
| Module N | `QW4KN-` |

Every CSS class and every JS `querySelector` / `getElementById` must use one of these. State the module map in your Claude prompt so Claude knows which number belongs to which visualization.

### Section version comments

Each `<section>` is preceded by a version comment so it's easy to track revisions and disable old ones:

```html
<!--v1.0-->
<section class="QW4K1-chart-section">...</section>
```

To replace a section with a newer version, comment out the old one:

```html
<!--v1.0 REPLACED-->
<!--<section class="QW4K1-chart-section">...</section>-->

<!--v1.1-->
<section class="QW4K1-chart-section">...</section>
```

---

## Section HTML pattern

Claude outputs `<section>` snippets — not full HTML documents. Paste them between the existing content in the index files, wrapped in spacers.

For any card-style chart (a bordered/shadowed container, as opposed to a bare full-bleed chart), use the frame + container + header-text/legend split below — this is the standard scaffold, not a one-off:

```html
<div class="QW4K-spacer"></div>

<!--v1.0-->
<section class="QW4K1-chart-section">
  <div class="QW4K1-chart-frame">
    <div class="QW4K1-chart-container">
      <div class="QW4K1-chart-header">
        <div class="QW4K1-chart-header-text">
          <h2 class="QW4K1-chart-title">Title</h2>
          <p class="QW4K1-chart-subtitle">Subtitle</p>
        </div>
        <div class="QW4K1-legend" id="QW4K1-legend"></div>
      </div>
      <div id="QW4K1-chart"></div>
    </div>
  </div>
</section>

<div class="QW4K-spacer"></div>
```

The legend `<div>` is left empty in HTML — the module JS populates it (see the Custom HTML legend pattern below). If a chart doesn't need a legend, omit the `<div class="QW4KN-legend">` and drop the flex split in `.QW4KN-chart-header`, but still keep `.QW4KN-chart-frame` wrapping `.QW4KN-chart-container` whenever the container has a `box-shadow`.

---

## Card shadow / frame pattern

Any `.QW4KN-chart-container` with a `box-shadow` must be wrapped in a `.QW4KN-chart-frame` — never apply the shadow directly inside `.QW4KN-chart-section`.

**Why:** `.QW4KN-chart-section` sometimes needs `overflow-x: hidden` (to guard against a flex child overflowing on iPad). Per the CSS spec, once `overflow-x` is non-`visible`, the browser force-computes `overflow-y` to `auto` too — *even if `overflow-y: visible` is set explicitly*. That silently clips the container's `box-shadow` on the top and bottom. Wrapping the container in a padded frame (which never sets `overflow`) keeps the clipping boundary far enough away that the shadow always renders in full.

```css
.QW4K1-chart-frame {
  width: 100%;
  max-width: 1450px;   /* ~100px wider than the container's own max-width */
  margin: 0 auto;
  padding: 40px 24px;  /* shrink to ~20px 12px under 768px */
  box-sizing: border-box;
}

.QW4K1-chart-container {
  width: 100%;
  max-width: 1350px;
  margin: 0 auto;
  background: var(--color-bg);
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.12);
  box-sizing: border-box;
}
```

---

## Custom HTML legend pattern

Chart legends are plain HTML/CSS chips rendered in `.QW4KN-chart-header`, next to the title/subtitle — not ECharts' built-in legend component. This keeps the legend inside the same visual container as the header (so it can share alignment, spacing, and the design-system's `--type-legend` token) and lets it sit top-right (or centered, stacked, on mobile) without fighting the chart's own layout.

ECharts still owns the actual show/hide state — the module keeps a `legend` component in the option with `show: false`, and toggles it via `dispatchAction`, syncing the HTML chips to match:

```js
// option
legend: { data: categories, show: false }

// build the chips once, and again after any resize-driven re-render
function buildLegend() {
  legendDom.innerHTML = '';
  categories.forEach(function (cat) {
    const item = document.createElement('div');
    item.className = 'QW4K1-legend-item';
    // ...dot + label...
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
.QW4K1-legend-item {
  font-family: var(--font-body);
  font-size: var(--type-legend);
  cursor: pointer;
  transition: opacity 0.15s ease;
}
.QW4K1-legend-item.is-inactive { opacity: 0.35; }
```

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
/* styles/stocks.css — QW4K1 */

.QW4K1-scroll-wrapper {
  height: 600vh;
  position: relative;
}

.QW4K1-sticky-content {
  position: sticky;
  top: 0;
  height: 100vh;
}

.QW4K1-chart-title {
  font-family: var(--font-display);
  font-size: var(--type-heading);
  color: var(--color-text);
}

.QW4K1-chart-subtitle {
  font-family: var(--font-display);
  font-size: var(--type-subheading);
  color: var(--color-muted);
}

.QW4K1-legend-item {
  font-family: var(--font-body);
  font-size: var(--type-legend);
}
```

---

## Module JS pattern

One file per visualization. Self-contained inside a `DOMContentLoaded` listener.

```js
// scripts/stocks.js

document.addEventListener("DOMContentLoaded", function () {
  // 1. Data
  const data = [...];

  // 2. DOM references — always use the module prefix
  const wrapper  = document.querySelector(".QW4K1-scroll-wrapper");
  const chartDom = document.getElementById("QW4K1-chart");

  // 3. Library init
  const chart = echarts.init(chartDom);

  // 4. Render / animation logic
  function update(stepIdx) { ... }

  // 5. Scroll trigger
  ScrollTrigger.create({ ... });
});
```

---

## Responsive images

Three crops per image — desktop, tablet, mobile. Use CSS classes + media queries to switch.

```html
<img src="imgs/image1.png"        class="QW4K1-desktop-img" />
<img src="imgs/image1_ipad.png"   class="QW4K1-ipad-img" />
<img src="imgs/image1_mobile.png" class="QW4K1-mobile-img" />
```

---

## Step-by-step: converting a single HTML prototype

You start with one self-contained HTML file with inline `<style>` and `<script>` blocks. The output is section snippets + separate CSS and JS files.

### 1. Identify the modules

List every distinct visualization in the HTML. Number them. Each gets a prefix (`QW4K1-`, `QW4K2-`, …) and a short filename (`stocks`, `arpu`, `timeline`).

### 2. Extract the CSS

For each module:
- Cut the `<style>` block out of the HTML.
- Save as `styles/modulename.css`.
- Rename all classes to `QW4KN-classname`.
- Replace any hardcoded font names or hex colors with the `globals.css` variables.
- Update matching class names in the HTML.

### 3. Extract the JS

For each module:
- Cut the `<script>` block out of the HTML.
- Wrap in `document.addEventListener("DOMContentLoaded", function () { ... });`.
- Save as `scripts/modulename.js`.
- Update all `querySelector` / `getElementById` calls to use the prefixed names.

### 4. Clean up the HTML into section snippets

What remains in the HTML after extracting CSS and JS is the markup. For each visualization:
- Wrap it in `<section class="QW4KN-...">`.
- Add `<!--v1.0-->` above it.
- Surround with `<div class="QW4K-spacer"></div>` on both sides.

### 5. Plug into the index files

- Paste the `<section>` snippets into the body of both `index.html` and `index_localLinked.html`.
- Add `<link>` tags in `<head>` for each new CSS file (relative path in local, absolute in server).
- Add `<script>` tags at the bottom of `<body>` for each new JS file.

---

## Prompt to give Claude for the conversion

Paste this at the start of any conversion session. Fill in the module map and color palette, then paste the raw HTML below.

```
I'm converting a single HTML prototype into the project structure described below.
The index files and globals.css already exist — do NOT regenerate them.

Output only:
1. <section> snippet(s) — ready to paste into the existing index files
2. styles/modulename.css — one file per visualization
3. scripts/modulename.js — one file per visualization

--- Project name ---
[ProjectName]

--- Module map ---
QW4K1 = [name of first visualization]
QW4K2 = [name of second visualization]
(add more as needed)

--- Color palette (will be in globals.css — reference only, do not redeclare) ---
--color-primary:   [hex]
--color-secondary: [hex]
--color-accent:    [hex]
--color-bg:        [hex]
--color-text:      [hex]
--color-muted:     [hex]

--- Rules ---

PREFIXES
- Shared layout (spacers, outer wrappers): QW4K-
- Module-specific classes and IDs: QW4K1-, QW4K2-, etc. per module map above
- Apply to ALL CSS classes and JS querySelector/getElementById calls

TYPOGRAPHY — globals.css already declares these variables and swaps them per breakpoint. Just use them.
- Headings / chart titles → font-family: var(--font-display); font-size: var(--type-heading);  /* 36 / 32 / 28px — pc / iPad / mobile */
- Subheadings → font-family: var(--font-body); font-size: var(--type-subheading);              /* 22 / 20 / 17px — pc / iPad / mobile */
- Body / annotations → font-family: var(--font-body); font-size: var(--type-body);              /* 18 / 16 / 14px — pc / iPad / mobile */
- Legend / chip labels → font-family: var(--font-body); font-size: var(--type-legend);          /* 14 / 12 / 11px — pc / iPad / mobile */
- No hardcoded font names. No hardcoded sizes for these roles. No module-level media queries for type sizes — globals.css owns all three breakpoints (pc ≥1024px, iPad 769–1023px, mobile ≤768px).

SPACING — globals.css already declares --spacing and swaps it per breakpoint (120 / 110 / 100px — pc / iPad / mobile).
- Use var(--spacing) for .QW4K-spacer and any other section-gap sizing — never hardcode.

COLORS — globals.css already declares these variables. Just use them.
- No hardcoded hex values in module CSS — always var(--color-*)
- Chart series colors also pull from these variables at runtime (e.g. read via getComputedStyle(document.documentElement) in JS) rather than hardcoding a separate data-viz palette — the chart should always match the design system, not just the header/legend chrome.

CARD SHADOWS
- Any container with a box-shadow (.QW4KN-chart-container) must be wrapped in a .QW4KN-chart-frame with its own padding — never give the shadowed element's direct parent an overflow-x/overflow-y other than visible, or the shadow clips on the clipped axis (see "Card shadow / frame pattern" in this guide).

LEGENDS
- Chart legends are custom HTML chips in .QW4KN-chart-header (next to the title/subtitle), not ECharts' built-in legend component — see "Custom HTML legend pattern" in this guide. Keep an ECharts legend component with show:false purely to drive dispatchAction-based toggling.

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
- <div class="QW4K-spacer"></div> before and after each section
- For card-style charts: .QW4KN-chart-frame > .QW4KN-chart-container > (.QW4KN-chart-header with header-text + legend) + chart div — see "Section HTML pattern" in this guide
- Output the snippets ready to paste — not a full HTML document

Output each file/snippet with its filename or description as a header.
```
