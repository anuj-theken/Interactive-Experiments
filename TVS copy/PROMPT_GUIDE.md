# Prototype Structure Guide — TVS

This document describes the conventions used in this project so that new prototypes can be converted into the same structure quickly.

Design tokens in this revision are derived from **TVS Mood Board (1).png** — a five-swatch strip (Oxblood `#770101`, Crimson `#c1111e`, Cream `#ffeed4`, Deep Navy `#023048`, Steel Blue `#659aba`) over a wall of printed, vernacular references: hand-painted Tamil signboards, half-donut and ring charts, hatched remainders, blue-vs-red split bars, cut-out archival portraits. Type, spacing and breakpoints are unchanged from the house system — only colour and chart treatment moved. The companion file `design.html` is the visual reference — swatches, specimens, motifs and the measured contrast numbers. This file is the machine-facing half: what to put in `globals.css`, and the rules Claude must follow when writing module code.

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

  /* ── Surfaces & ink — sampled from TVS Mood Board.png ── */
  --color-bg:           #faf2e3;  /* Paper — page ground, never stark white */
  --color-bg-warm:      #ffeed4;  /* Cream (board swatch) — secondary ground, zebra, inactive */
  --color-surface:      #fffaf0;  /* card face lifted off the paper — warm, not #fff */
  --color-bg-dark:      #023048;  /* Deep Navy (board swatch) — chapter panel & dark-mode surface */

  --color-text:         #023048;  /* 12.43:1 on Paper */
  --color-muted:        #4f5f6b;  /* Slate — 5.93:1 on Paper */
  --color-text-invert:  #ffeed4;  /* Cream on the navy panel — 12.14:1 */
  --color-muted-invert: #a9c3d6;  /* 7.55:1 on navy */
  --color-rule:         #e6d8bf;  /* hairline borders & dividers */
  --color-grid:         #eadfca;  /* graph-paper & chart gridlines — warm, recessive */

  /* ── Brand / accent ── */
  --color-primary:   #c1111e;  /* Crimson (board swatch) — hero figures, year markers, links. 5.61:1 on Paper */
  --color-secondary: #023048;  /* Deep Navy */
  --color-oxblood:   #770101;  /* Oxblood (board swatch) — deep rules, sticker outlines, red panel. 10.55:1 */
  --color-accent:    #659aba;  /* Steel Blue (board swatch) — FILL ONLY on Paper (2.74:1); type on navy (4.53:1) */
  --color-royal:     #1f4fd1;  /* the board's chart blue — the cool pole */
  --color-signal:    #e8452c;  /* Vermilion — the one hot chart accent, emphasis only. 3.55:1 */
  --color-mustard:   #d4982a;

  /* ── Chart: categorical, light. FIXED ORDER — assign 1..6, never cycle ── */
  --cat-1: #1f4fd1;  /* Royal    */
  --cat-2: #c1111e;  /* Crimson  */
  --cat-3: #3d8fc6;  /* Steel    */
  --cat-4: #d4982a;  /* Mustard  */
  --cat-5: #7a2e8f;  /* Mulberry */
  --cat-6: #1e8259;  /* Green    */

  /* ── Chart: categorical, dark (on --color-bg-dark). Same slot order ── */
  --cat-dark-1: #5580ff;
  --cat-dark-2: #ee4046;
  --cat-dark-3: #3a9fd8;
  --cat-dark-4: #c0861a;
  --cat-dark-5: #ad62cc;
  --cat-dark-6: #2a9a68;

  /* ── Chart: sequential (magnitude), single hue (blue), light → dark ── */
  --seq-100: #88afe2;
  --seq-200: #6497d3;
  --seq-300: #3f7fc0;
  --seq-400: #1468ab;
  --seq-500: #00518c;
  --seq-600: #003c69;

  /* dark mode flips the anchor: low → high runs dark → light */
  --seq-dark-100: #215da5;
  --seq-dark-200: #4379bc;
  --seq-dark-300: #6295d4;
  --seq-dark-400: #87b1e6;
  --seq-dark-500: #b1cdf2;
  --seq-dark-600: #d5e6fc;

  /* ── Chart: diverging — Royal ↔ Crimson, NEUTRAL midpoint ── */
  --div-neg-3: #2b51aa;
  --div-neg-2: #5978bb;
  --div-neg-1: #8ba2ce;
  --div-mid:   #e4dccd;
  --div-pos-1: #ca918a;
  --div-pos-2: #c25e55;
  --div-pos-3: #b32322;

  /* ── Texture — remainders, "not counted", the print hatch ── */
  --texture-ink:  rgba(2, 48, 72, 0.32);  /* Deep Navy at 32% — hatch / stipple stroke */

  /* ── Status — reserved meaning, never a series color ── */
  --status-good:     #456b00;
  --status-warning:  #9a6a00;
  --status-serious:  #c75400;
  --status-critical: #770101;
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

When starting a new project, update only the `--color-*` / `--cat-*` / `--seq-*` / `--div-*` / `--texture-*` / `--status-*` blocks. Type scale, spacing, and the three breakpoints stay the same.

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

The moodboard's five-swatch strip is **not** a series palette. Oxblood and Deep Navy sit below the legible lightness band, Cream is a ground, Steel Blue falls under the chroma floor, and Oxblood↔Crimson are the same hue. The board's *charts* tell the real story: a royal blue against a red, with mustard, green and steel as supporting notes. The `--cat-*` slots above are built from those, stepped into the band and run through the palette validator — light set on Paper and dark set on Deep Navy both pass all checks (light: worst adjacent CVD ΔE 16.2, normal-vision 26.8; dark: 14.9 / 25.3, every slot ≥ 3:1).

**Non-negotiables:**

- **Assign `--cat-1..6` in fixed order.** Series 1 takes slot 1. Never cycle, never generate a 7th hue — a 7th series folds into "Other", becomes small multiples, or the chart gets faceted.
- **Color follows the entity, never its rank.** A filter that changes the series count must not repaint the survivors.
- **One y-axis, always.** Two measures of different scale become two charts, small multiples, or values indexed to a common base. Never a second axis.
- **Slot 4 (Mustard, 2.27:1) sits below 3:1 on Paper.** Any series wearing slot 4 **must** carry a direct label or a table view. This is a hard requirement, not a preference.
- **Status-good sits only ΔE ~9 from slot 6 (Green).** Never show a status-good marker in a chart that also uses slot 6; if both are needed, the status always carries its icon + label.
- **Scatter, bubble, choropleth and small-multiple forms cap at three series** (slots 1–3) — in those forms any two marks can end up adjacent, which is a stricter test than neighbours-only. More than three means facet or fold.
- **Sequential is one hue, light → dark** (`--seq-*`). Never a rainbow. Dark mode flips the anchor — use `--seq-dark-*`, which runs dark → light as values rise.
- **Diverging is two hues plus a neutral midpoint** (`--div-*`). Never a hue at zero, and only where the data has a real baseline.
- **Status colors are reserved.** `--status-*` never stands in for "series 4", and always ships with an icon *and* a text label — never color alone.
- **Text wears ink tokens, never the series color.** Values, axis labels and legend text use `var(--color-text)` / `var(--color-muted)`; the colored chip beside the label carries identity.
- **Legend always present for ≥2 series** (a single series needs none — the title names it), and ≤4 series are also directly labeled, so identity is never carried by color alone.
- **Recessive chrome.** Gridlines `var(--color-grid)`, axis lines and ticks `var(--color-muted)`, 1px. Thin marks: 2px lines, ≥8px markers, a 2px surface gap between adjacent fills and between stacked segments.

---

## Chart aesthetic — printed, not dashboard

The board's charts look like they came off a press: flat ink on paper, chunky shapes, hatched remainders, big numbers on leader lines. Apply this on top of the colour rules above.

- **Flat fills, square ends.** No gradients, no shadows, no glow. Bars and segments end square (`borderRadius: 0`), not rounded — this overrides the generic "rounded data-ends" default. The 2px gap between fills is the paper colour showing through (`--color-surface` on cards, `--color-bg` on bare charts).
- **Remainders are textured, not grey.** "The rest of the total", "not yet", "everyone else" — any track a value fills into — uses a 45° hatch or a dot stipple in `--texture-ink`, never a flat grey bar. This is the board's 0–100% bar and hatched map. (ECharts: `itemStyle.decal`, see snippet below. CSS: `repeating-linear-gradient(45deg, var(--texture-ink) 0 1px, transparent 1px 6px)`.)
- **Preferred forms, in the board's own vocabulary:**
  - *Half-donut / semicircle* for share-of-whole with ≤ 4 parts (the 48 / 36 / 16 piece). Flat bottom edge on the baseline, 2px paper gaps between wedges.
  - *Concentric rings* for a few nested shares (the 29.9 / 55.7 / 14.4 piece) — one ring per entity, unfilled track hatched.
  - *Split stacked bar* for a two-period or two-group comparison — segments labelled inside in `--color-text-invert` (or `--color-text` on light slots), a thin mono caption above each half ("Up until 2004 · After 2004").
  - *Two-pole block chart* — blue category vs red category, sub-groups as tints of each pole (use the `--div-neg-*` arm for the blue side and `--div-pos-*` for the red side; the darkest step is the largest group).
  - *Isotype / waffle* — see Motifs.
- **Blue vs red is the board's core contrast.** For any binary comparison (before/after, them/us, India/abroad) use slot 1 (Royal) against slot 2 (Crimson) — don't reach for slots 3+.
- **Leader-line callouts.** Key values sit outside the mark on a 1px `--color-text` leader, the figure in `--font-display` at `--type-subheading` or larger, with the `%` or unit at ~55% size. Use sparingly — 2 to 4 per chart.
- **Minimal grid.** Prefer no gridlines + direct labels, or the graph-paper ground. When an axis is needed, draw the baseline only, 1px `--color-text`; ticks and other axis lines in `--color-muted`.
- **One hot mark.** `--color-signal` (Vermilion) picks out a single wedge, bar or year. It is never a series colour and never appears twice in a view.

```js
// hatched remainder track — ECharts decal
const TEX = css.getPropertyValue("--texture-ink").trim();
const remainder = {
  color: "transparent",
  decal: { symbol: "rect", symbolSize: 1, color: TEX,
           dashArrayX: [1, 0], dashArrayY: [1.5, 5], rotation: Math.PI / 4 }
};
// square ends + paper gap
const BAR = { borderRadius: 0, borderColor: css.getPropertyValue("--color-surface").trim(), borderWidth: 2 };
```

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
      <p class="TK4R1-source">Source: TVS Motor Annual Reports.</p>
    </div>
  </div>
</section>

<div class="TK4R-spacer"></div>
```

The legend `<div>` is left empty in HTML — the module JS populates it (see the Custom HTML legend pattern below). If a chart doesn't need a legend, omit the `<div class="TK4RN-legend">` and drop the flex split in `.TK4RN-chart-header`. The eyebrow line is optional; drop it on charts that aren't opening a chapter.

---

## Card treatment — flat, not shadowed

The moodboard's references are printed pieces. Cards in this system are **flat**: a warm `--color-surface` face on the Paper ground with a hairline `--color-rule` border. The previous house style's `0 0 30px rgba(0,0,0,0.12)` drop shadow does not belong here.

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

A full-bleed Deep Navy `--color-bg-dark` section breaks the paper run and marks a new act. Inside one, the whole ink and chart palette switches:

```css
.TK4R3-chapter {
  background: var(--color-bg-dark);
  color: var(--color-text-invert);
}
.TK4R3-chapter .TK4R3-chart-subtitle { color: var(--color-muted-invert); }
.TK4R3-chapter .TK4R3-eyebrow        { color: var(--color-accent); }
```

Charts inside a dark panel read `--cat-dark-*` and `--seq-dark-*` instead of the light sets. These are **separately selected steps**, not a programmatic lightening of the light palette — don't compute them, use the tokens.

**Signboard panel (red).** The board's hand-painted Tamil signs give a second, rarer panel: full-bleed `--color-primary` (Crimson) or `--color-oxblood`, type in `--color-text-invert` (Cream, 5.48:1 on Crimson, 10.30:1 on Oxblood). Use it for **one** pull-quote or hero stat per story — never put a chart on it.

```css
.TK4R5-signboard {
  background: var(--color-primary);
  color: var(--color-text-invert);
}
```

---

## Motifs the moodboard repeats

`design.html` §05 shows all six rendered. They're listed here so module code names them consistently:

| Motif | Class stem | Notes |
|---|---|---|
| Timeline spine | `.TK4RN-spine` / `.TK4RN-node` | 1px `--color-text` vertical, crimson node dots, years in `--font-mono` |
| Hero stat | `.TK4RN-stat` | `--type-stat` figure in `--color-primary` + short caption in `--color-muted` |
| Isotype / waffle grid | `.TK4RN-iso` | 10 units per row; hatched remainder, navy count, `--color-primary` for the called-out part |
| Duotone archival photo | `.TK4RN-duo` | B&W image under a Steel→Deep Navy multiply; cream mono caption |
| Cut-out portrait | `.TK4RN-cutout` | archival figure clipped to its silhouette with a 3px `--color-primary` sticker outline, on Cream (the "1908" card) |
| Hatched remainder | `.TK4RN-hatch` | 45° `--texture-ink` hatch for "rest of total" tracks and unselected areas |
| Graph-paper ground | `.TK4RN-graph` | 22px `--color-grid` grid on Paper, standing in for gridlines |
| Navy chapter panel | `.TK4RN-chapter` | see above |
| Signboard panel | `.TK4RN-signboard` | crimson ground, cream type — one per story, never with a chart |

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
TVS

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
- Ground is var(--color-bg) (#faf2e3 Paper) — never stark white. Cards use var(--color-surface) (#fffaf0).
- Body copy var(--color-text) (Deep Navy); footnotes/axes var(--color-muted).
- var(--color-primary) (Crimson) is for hero figures, year markers, links and timeline nodes.
- var(--color-accent) (Steel Blue) is FILL ONLY on Paper — it fails text contrast there. On the navy panel it is a valid type color (eyebrows).
- var(--color-signal) (Vermilion) is the single hot chart accent: one emphasised wedge/bar/year. Never a background, never a series, never two in a view.

CHART COLOR
- Categorical: assign var(--cat-1) … var(--cat-6) in fixed order, series 1 → slot 1. Never cycle, never invent a 7th — fold to "Other" or facet.
- Read them at runtime from getComputedStyle(document.documentElement), don't hardcode a separate viz palette.
- Slot 4 (Mustard) is below 3:1 on Paper → that series MUST have a direct label or a table view.
- Binary comparisons are Royal (cat-1) vs Crimson (cat-2). Sub-groups within each pole use the --div-neg-* (blue) / --div-pos-* (red) arms.
- Status-good is close to slot 6 (Green) — don't put both in one chart.
- Scatter / bubble / choropleth / small multiples: cap at 3 series (slots 1–3), else facet.
- Sequential (magnitude): var(--seq-100..600), one hue light→dark. Dark panels use --seq-dark-*.
- Diverging (polarity): var(--div-neg-3..--div-pos-3) with the NEUTRAL var(--div-mid) at zero. Never a hue at the midpoint.
- Status: var(--status-good|warning|serious|critical), reserved meaning, always with an icon AND a label. Never as "series 4".
- One y-axis only. Two measures of different scale → two charts or index to a common base. Never a dual axis.
- Color follows the entity, not its rank — filtering must not repaint the surviving series.
- Legend text and data labels wear var(--color-text) / var(--color-muted), never the series color. The chip dot carries identity.
- Gridlines var(--color-grid), axes var(--color-muted), 1px. Lines 2px, markers ≥8px, 2px surface gap between adjacent/stacked fills.
- Legend present for ≥2 series (none for one); ≤4 series also get direct labels.

CHART AESTHETIC — printed, not dashboard (see "Chart aesthetic" in this guide)
- Flat fills, no gradients/shadows. Square bar/segment ends (borderRadius 0). 2px paper-coloured gap between fills.
- "Rest of total" / unfilled tracks use a 45° hatch in var(--texture-ink) (ECharts itemStyle.decal), never a flat grey.
- Prefer the board's forms: half-donut for ≤4-part shares, concentric rings, split stacked bars labelled inside segments, two-pole blue/red block charts, isotype grids.
- Key values on 1px leader lines, figure in var(--font-display), unit at ~55% size. 2–4 callouts max.
- Minimal grid: none + direct labels, or graph-paper ground. Baseline 1px var(--color-text).

CARDS
- Flat: background var(--color-surface), 1px var(--color-rule) border, 4px radius. No drop shadow.
- Still wrap .TK4RN-chart-container in a padded .TK4RN-chart-frame — it owns the gutter, and it's required if the module ever does take a box-shadow (see "Card treatment" in this guide).

DARK PANELS
- A full-bleed var(--color-bg-dark) section switches ink to --color-text-invert / --color-muted-invert and charts to --cat-dark-* / --seq-dark-*. Use the tokens; don't compute a lightened version.
- Signboard panel: var(--color-primary) or var(--color-oxblood) ground with var(--color-text-invert) type — one pull-quote/hero stat per story, never a chart.

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
