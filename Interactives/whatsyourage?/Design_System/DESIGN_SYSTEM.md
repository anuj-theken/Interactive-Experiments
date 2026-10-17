# The Ken — Editorial Chart Design System

Derived from `Lightrock_Investment_Potfolio/Lightrock_Investment_Chart_Arundhati/index.html`.

Files in this folder:

| File | Purpose |
|---|---|
| `ken-chart.css` | Tokens (CSS variables), fonts, page / title / legend / note / footer components |
| `ken-echarts.js` | Same tokens for ECharts (`window.KEN`): palette, tooltip, axis styles, font-ready init |
| `fonts/` | Jazmin Alt Bold, GT America Light, GT America Black |
| `logo.png` | The Ken wordmark for the footer |

Charts ship as self-contained folders, so copy these files into the chart's `assets/` folder and link them from there (see `PE_Hospitals/`).

---

## 1. Page anatomy (top → bottom)

```
┌───────────────────────────────────────────┐
│              Main title (Jazmin)          │  centred
│        Subtitle — one sentence takeaway   │  centred
├───────────────────────────────────────────┤  1.5px rule
│ KEY     ● Item  ● Item  ■ Item            │  legend box
│ note in italics                           │
├───────────────────────────────────────────┤  1.5px rule
│                                           │
│                  chart                    │
│                                           │
├───────────────────────────────────────────┤  1.5px rule
│ THE KEN    Graphic by Name, D Mon 'YY   Source: … │  footer
└───────────────────────────────────────────┘
```

- Page column: `max-width: 640px` (`.page`). Use `.page--wide` (960px) only when the x-axis needs room (many categories, labels on marks).
- Padding: `clamp(16px,4vw,32px)` top, `clamp(12px,4vw,28px)` sides, 0 bottom (footer provides it).
- Everything sits on one background, `#F7F2F2`. No cards, no chart borders.

## 2. Typography & hierarchy

| Level | Class / use | Font | Size | Colour | Notes |
|---|---|---|---|---|---|
| 1 Title | `.main-title` | Jazmin Alt Bold | `clamp(28px, 6vw, 42px)` | `#1A1208` | line-height 1.05, letter-spacing −1px, centred. Short, editorial (≤ 6 words). |
| 2 Subtitle | `.subtitle` | GT America Light | `clamp(14px, 2.2vw, 15px)` | `#5C4A4A` | line-height 1.5, centred. The takeaway / what's plotted. |
| 3 Legend key | `.legend-key` | GT America Black | 9px, UPPERCASE, +0.08em | `#5C4A4A` | Fixed column 64–80px |
| 4 Legend item | `.leg-item` | GT America Light | 12–14px | `#4A3535` | 10px dot / 12×10 bar swatch, 5px gap |
| 5 Axis / row labels | `KEN.axisLabelBold` | GT America Black | 14px | `#5C4A4A` | Category labels (rows, years) |
| 5 Axis ticks | `KEN.axisLabel` | GT America Light | 13px | `#5C4A4A` | Numeric ticks |
| 5 Axis name | `KEN.axisName` | GT America Black | 11px | `#5C4A4A` or series colour | Only when units aren't obvious |
| 6 Data label (on fill) | — | GT America Black / Light | 11–12px | `rgba(255,255,255,0.92)` | Hide if it doesn't fit the mark |
| 6 Data label (off fill) | — | GT America Black | 12–13px | series colour | |
| 7 Note | `.note` | GT America Light *italic* | 12px | `#5C4A4A` | How to read / caveats |
| 8 Footer | `.footer-*` | GT America Light | 14px (12px ≤ 480px) | `#5C4A4A` | Stacks vertically ≤ 480px |
| Tooltip name | `KEN.tt.name` | GT America Black | 18–22px | `#1A1208` | |
| Tooltip body | `KEN.tt.line` | GT America Light | 13px | `#3A2E20`, values bold `#1A1208` | Missing → `N/A` in `#9A8E7A` |

Only two weights in practice: **Light** for reading text, **Black** for labels/keys/emphasis. Jazmin is for the title only.

## 3. Colour

### Neutrals
| Token | Hex | Use |
|---|---|---|
| `--ken-bg` | `#F7F2F2` | Page, tooltip, label backgrounds |
| `--ken-rule` | `#DCCFCF` | Legend box + footer rules (1.5px), tooltip border |
| `--ken-grid` | `#E0D4D4` | Gridlines / row guides (0.8px, solid) |
| `--ken-outline` | `#C4AAAA` | Hollow size keys, dashed connectors |
| `--ken-ink` | `#1A1208` | Title, emphasised values |
| `--ken-text` | `#5C4A4A` | Subtitle, axes, keys, notes, footer |
| `--ken-text-soft` | `#4A3535` | Legend labels |
| `--ken-body` | `#3A2E20` | Tooltip body |
| `--ken-na` | `#9A8E7A` | Missing data |

### Categorical (assign in this order)
| # | Hex | Name | Text on it |
|---|---|---|---|
| 1 | `#C8423A` | Red — primary accent | white |
| 2 | `#4A7A5A` | Green | white |
| 3 | `#4A9E9A` | Teal | white |
| 4 | `#3D3D3D` | Charcoal | white |
| 5 | `#7A9E4A` | Olive | white |
| 6 | `#A89880` | Taupe | white |
| 7 | `#D4A8A0` | Blush | ink |

- One series → red. Two contrasting measures (e.g. dual axis) → teal + red.
- A lighter step of a series (e.g. increments vs. base) = same hue at ~45% opacity with a solid 1px border in the full hue.

## 4. Chart elements

- **Gridlines**: horizontal only, `#E0D4D4` 0.8px solid. For row-based charts draw the guide through the row centre (Lightrock year rows). No vertical gridlines.
- **Axes**: no axis lines or ticks by default; labels carry the axis. Keep a coloured axis line only on dual-axis charts, to tie each scale to its series.
- **Marks**: flat solid fills, no gradients. Bubbles may overlap slightly; separate with a 1px `#F7F2F2` stroke.
- **Hover**: mark grows ~7% and gets a `rgba(255,255,255,0.45)` 1.5px stroke; everything else unchanged.
- **Filter/selection**: selected marks get a `rgba(26,18,8,0.75)` 1.5px stroke; unselected marks fade to 0.12 opacity (legend items to 0.35).
- **Labels over lines/marks**: pad with a `rgba(247,242,242,0.85)` background, never white.
- **Pills/callouts**: background in series colour, white text, 3px radius.
- **Tooltip**: `#F7F2F2` card, 1px `#DCCFCF` border, 3px radius, `0 4px 20px rgba(0,0,0,.10)` shadow, 12×14 padding. Name → meta → value lines → optional ruled section.
- Render canvas text only after fonts load (`KEN.whenFontsReady`).

## 5. Footer alignment

Three slots in one flex row, vertically centred, `justify-content: space-between`, 8px gap, 24px top / 16px bottom padding, 1.5px `#DCCFCF` top rule.

| Slot | Content | Alignment |
|---|---|---|
| Left | The Ken logo, 18px tall | left |
| Centre | `Graphic by <Name>, <D Mon 'YY>` | centre, `flex: 1` |
| Right | `Source: <sources>` | right, max-width 170px (wraps) |

On mobile (≤ 480px) the footer stacks vertically, centred, in the same order: logo → credit → source, 6px apart, text at 12px.

## 6. Starter template

```html
<link rel="stylesheet" href="assets/ken-chart.css">
<div class="page">
  <div class="main-title">Title</div>
  <div class="subtitle">Subtitle</div>
  <div class="legend-box">
    <div class="legend-row"><div class="legend-key">Key</div>
      <div class="legend-items"><div class="leg-item"><span class="swatch-dot" style="background:#C8423A"></span>Item</div></div>
    </div>
    <div class="note">How to read this chart</div>
  </div>
  <div class="viz-area" id="chart"></div>
  <div class="footer">
    <img src="assets/logo.png" alt="The Ken" class="footer-logo">
    <div class="footer-center">Graphic by Name, 9 Oct '26</div>
    <div class="footer-right">Source: …</div>
  </div>
</div>
```
