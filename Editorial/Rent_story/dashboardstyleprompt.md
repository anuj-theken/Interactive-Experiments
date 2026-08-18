# Visual Style Prompt — "Sage Survey Dashboard"

Use this as a system/style prompt when generating new single-page HTML data dashboards that should look and feel like this one. It describes the *system* (layout rules, type scale, color algorithm, chart conventions) rather than one fixed set of values, so it can be reused for dashboards with a different number of charts, chart types, or even a different hue.

## 1. Overall structure

- Single self-contained HTML file. Body is a flex container that centers one `.dashboard-container` card both horizontally and vertically, with `16px` outer page padding.
- `.dashboard-container`: max-width ~`1300px`, height ~`92vh` capped at a `max-height` (e.g. `920px`), flex column, `gap: 16px`, `padding: 24px`, `overflow: hidden` on desktop.
- Inside the container: a `<header>` (title + one-line subtitle) followed by a `.dashboard-grid` — a CSS grid, typically `2x2` (`grid-template-columns/rows: 1fr 1fr`, `gap: 16px`). Each grid cell is a `.card`. One cell may itself contain a vertical flex "stack" of two smaller cards when you need more than 4 charts (a `flex-direction: column; gap: 10px` wrapper with each child at `flex: 1`).
- Every chart lives inside a `.chart-box` that fills its card (`flex: 1; width/height: 100%; min-height: 0`) so charting libraries can measure and resize correctly.

## 2. Responsiveness

- Single breakpoint, mobile-first isn't used — instead a max-width breakpoint around `868px` converts the desktop layout to a scrolling stack:
  - `html, body`: `height: auto; overflow: auto;` (desktop locks to viewport height with no page scroll; mobile allows normal scroll).
  - `.dashboard-container`: `height: auto; max-height: none; overflow: visible;` and a smaller `border-radius` (desktop 24px → mobile 16px) and reduced padding.
  - `.dashboard-grid`: switches from `grid` to `display: flex; flex-direction: column;` — cards stack top to bottom.
  - `.card`: gets an explicit fixed height (e.g. `380px`) on mobile so charts still have a defined box to render into; a stacked pair (`.blue-stack`) gets a taller fixed height (e.g. `480px`) to fit both sub-charts.
- Rule of thumb: keep chart-library instances agnostic of viewport — resize/redraw on window resize — and let the *container* CSS do all the responsive work.

## 3. Typography

- One font family for everything: a geometric/humanist sans (this dashboard uses **Plus Jakarta Sans**), applied globally via a universal selector so no element opts out.
- Small, restrained type scale — nothing shouts:
  - Dashboard title (`h1`): ~`1.4rem`, weight `800`, tight `letter-spacing` (~`-0.3px`).
  - Dashboard subtitle: ~`0.8rem`, weight `600`, muted color.
  - Card title: ~`0.88rem`, weight `800`.
  - Card subtitle: ~`0.72rem`, weight `600`, muted color.
  - In-chart text (axis labels, legend labels, data labels): smaller still, ~`9–10px`, weight `600`, using the same font family so canvas-rendered chart text matches the surrounding HTML type.
- All text is left-aligned by default (no centered headers), which reinforces a data-report feel rather than a poster feel.

## 4. Color system (algorithmic, not fixed swatches)

Think of color as two layers, both expressed as CSS custom properties on `:root` so a new iteration only requires swapping variable values:

- **Neutral/UI layer** — a warm, low-contrast paper palette: an outer page background, a slightly darker container background, a slightly lighter card background, a hairline border tone, a near-black text color, and a muted secondary text color. The relationship that matters: `bg-outer` < `container-bg` < `card-bg` in a tight lightness band (a few percent apart), so cards read as "layers of paper" rather than high-contrast panels. Text uses only two tones: dark (primary) and muted (secondary), both derived from the same hue as the palette below for cohesion.
- **Data layer** — a single 5-step **sequential monochromatic ramp** in one hue family (this dashboard uses an olive/sage green), ordered dark → light: `c-1` (deepest, near-black-green) through `c-5` (palest, near-mint). Store it as an ordered array (`palette = [c1, c2, c3, c4, c5]`) and assign chart series/categories by **index**, not by manually picking a color per chart. This is the "algorithm": whichever series comes first gets `palette[0]`, the next `palette[1]`, etc., so any chart — bar, stacked bar, dot matrix, scatter — pulls from the same ordered list and the whole dashboard reads as one tonal family instead of a rainbow.
- To generate a new iteration's palette programmatically: pick a base hue, then generate 5 lightness steps (e.g. HSL lightness ~18% → ~82% at roughly even intervals, keeping saturation fairly low ~25–35% for the muted "paper" feel), sort dark→light, and reuse the neutral-layer formula (outer/container/card backgrounds sampled from the very light end of the same hue, text sampled from the very dark end).

## 5. Legends

- Prefer the charting library's native legend when the chart type supports it (grouped/stacked bars): horizontal orientation, anchored top-left of the chart box (not centered/top), small square swatches (~`10x10px`), label text styled with the same small/semi-bold in-chart font rule from §3.
- For unconventional chart types the library can't auto-legend well (e.g. a dot-matrix/waffle chart), build an **explicit legend**: define an array of `{ name, count, color }` objects up front (colors pulled from the same indexed palette), and render the swatches + labels manually in the chart's own drawing code or as an adjacent HTML row. The visual spec (swatch size, font, spacing) should still match the native-legend look so it's indistinguishable in style.
- Every chart's legend/category order should follow the same left-to-right or dark-to-light logic as the data ramp — don't reorder categories in a way that breaks the visual progression.

## 6. Borders & radius

- Radius scales with nesting depth — outer containers get the largest radius, inner elements get progressively smaller:
  - Outer dashboard container: large radius (~`24px` desktop, ~`16px` mobile), `1px` hairline border in the neutral border tone, plus one soft, low-opacity drop shadow (e.g. `0 10px 30px rgba(0,0,0,0.05)`) — the *only* shadow in the design.
  - Cards: medium radius (~`16px`), same `1px` hairline border, **no shadow** (flatness distinguishes cards from the outer container).
  - Chart marks get their own small, situational radius rather than a uniform one:
    - Grouped/simple bars: round only the top corners (e.g. `border-radius: [4, 4, 0, 0]`) so bars look like soft-topped columns sitting on the axis.
    - Stacked bar segments: round only the outer edge of the whole stack (first segment rounds its leading corners, last segment rounds its trailing corners, middle segments stay square), so the stack reads as one continuous pill rather than a row of separate rounded blocks.
- No sharp 0-radius rectangles anywhere except the flat/square edges just described — softness is a constant, sharpness is only used where two elements need to visually fuse.

## 7. Charting conventions (carry over regardless of library)

- Axis lines: muted, low-contrast tone (not full text-dark, not invisible) on the axis that needs a baseline; the opposing axis often has its line hidden entirely (`show: false`) to reduce chart-junk.
- Gridlines: dashed, very light, horizontal only (value-axis gridlines), never vertical.
- Tooltip: triggered on hover over the axis/category (not per-point), with a shadow-style axis pointer for bar charts.
- Keep chart chrome (axis labels, tick labels) small and low-emphasis; the data marks and the card title carry the visual weight, not the axes.

## 8. Spacing rhythm

- Use one consistent gap unit family: `24px` for the outermost container padding, `16px` for grid gaps and card padding, `8–10px` for internal card header spacing and stacked-chart gaps. Avoid introducing new arbitrary spacing values outside this ~8/16/24 rhythm.

---

**How to use this prompt:** when asking an LLM (or yourself) to build a new dashboard in this style, paste this file and specify only what's unique to the new iteration — the topic/data, the number of charts and their types, and optionally a new base hue for the data ramp. Everything else (structure, responsiveness, type scale, radius rules, legend behavior, spacing) should carry over unchanged.
