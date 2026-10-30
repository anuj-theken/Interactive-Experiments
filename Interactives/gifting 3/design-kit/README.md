# Gifting · card templates brief

For the designer. This folder holds every card used in the Gifting interactive, drawn by the live code at 1× web size, so you can redesign from what's actually on the page.

## Files

| File | What it is |
|---|---|
| `gifting-card-templates.svg` | The design file. Open in Figma (drag in) or Illustrator. Every part of a card is its own named layer (`shape`, `hole`, `band`, `headline`, `item`, `price`, …). |
| `gifting-card-templates-preview.png` | The same board as a picture, for a quick look. |
| `build.html` | Regenerates the SVG from the code. Open it in Chrome and press **Download SVG**. |
| `../tag-kit/index.html` | The live tag generator. Change shape, colours, layout, price style and variety, and see it on real gifts. |

**Fonts** (install before opening the SVG; they're in `../assets/fonts/`): Jazmin Alt Bold, GT America Light, GT America Black.

## The cards

**1. Gift tag** (Recommendations). One per gift; 96 on the page across 16 kinds of gift. Each hangs from a string.
- **Shapes:** 7 today (classic, arch, luggage, swallowtail, pointed, scallop, ticket).
- **Layouts:** 3, each leading with something different:
  - *quote* leads with the reader's reason
  - *item* leads with the product
  - *price* leads with the price
- **Price shown as:** coins, rupees, words, or a stamp.
- **Variety:** every tag mixes these at random from set pools, so a string of tags should read like a shop display.
- **States:**
  - default
  - *In the box* (added to the gift box; the tag dims)
  - *For them* (matches the reader's "who's hard to buy for")
  - *Said again* (another reader recommended the same gift)

**2. Belief note card** (Philosophies). One style only: a ruled note with a red margin line. It comes in 3 sizes by reader count (S under 25, M 25–99, L 100+). The same note is used for the scrollytelling step cards and the fanned "hand of three" at the end.
- **States:**
  - default
  - *+1* (one of the reader's three)
  - *Sounds like you* (matches the reader's own philosophy)

**3. Gift box** (checkout). A 3D wrapped box per gift added. It is sized by price band (70–122 px wide) and coloured by kind of gift. The boxes pile up and overlap.

## What we'd like from you

1. **Tag shapes.** Redraw or replace the seven, and add more if you like. Each shape needs to stretch vertically, because the words change length. Please mark:
   - the fixed top (hole plus about 44 px of band)
   - the stretchy middle
   - any fixed bottom detail (like the swallowtail notch)
2. **Tag layouts.** Refine the type hierarchy for the three layouts within the content limits below.
3. **Price marks.** Better versions of the four price displays. They need to work for free, single bands and ranges (e.g. ₹3K–35K lights two coins).
4. **States.** Badges and stamps for the four tag states and the three note-card states.
5. **Note card.** Polish the ruled note: paper, ruling, margin, how the big number sits.
6. **Gift box.** Optional: a nicer box, or a few box styles.

## Constraints

**Sizes.** Tags are 196–236 px wide; height follows the words (roughly 280–420 px). Note cards fill a grid column, about 340 px at desktop and the full screen width on phones (about 350 px).

**Content lengths** (characters, from the real data):

| Field | Shortest | Typical | Longest |
|---|---|---|---|
| Tag headline (reader's words) | 25 | 72 | 129 |
| "Said again" quote | 26 | 79 | 151 |
| Item (the gift) | 4 | 21 | 50 |
| Credit (e.g. "S., Hyderabad, 30–40, 2026") | 6 | 19 | 36 |
| Section label (e.g. "05 · Made by someone with a name") | 9 | 16 | 32 |
| Belief (note card) | 21 | 56 | 126 |
| Belief credit | 19 | 24 | 29 |

**Colour.** Use the palette on the board (`09 · Colour and type`). On dark fills, text goes white. Keep body text at 4.5:1 contrast or better.

**Type.**
- Jazmin for the reader's words and big numbers.
- GT America Black for labels (caps, wide tracking) and item names.
- GT America Light for credits and small print.

**Motion (already built).**
- Tags drop onto the string with a little bounce, and straighten on hover.
- Notes give a small shake on hover (0.5 s).
- Added gifts fly into the checkout.

Tell us if you want any of this to look different.

## Handing back

Either of these works:
- **Figma:** frames named `tag/<shape>`, `tag/layout-<name>`, `tag/state-<name>`, `note/<size>`, `note/state-<name>`, `box`.
- **SVG:** one file per template with the same names, using the layer names from this file.

We turn shapes into code paths (`shapePath` in `scripts/gift-tag.js`) and colours and options into `scripts/tag-theme.js`.
