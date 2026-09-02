/* ==========================================================================
   CHART THEME — shared design-system primitives for every dashboard module
   ==========================================================================
   Loaded before overview.js/homeowner.js/nonresident.js/landlord.js/tenant.js.
   These are the pieces that must be byte-for-byte identical across all 5
   tabs' charts; each dashboard module calls into this instead of
   re-implementing the same chart by hand.

   window.ChartTheme.init(id)
     echarts.init() with a forced high devicePixelRatio. ECharts sizes its
     canvas to the container's CSS pixel size × devicePixelRatio; on a
     standard (non-retina) display, or when the container has a fractional
     CSS width from flex/grid layout, that can round to a canvas that's a
     hair too small, leaving glyph edges to be clipped or antialiased into a
     soft/pixelated look. Forcing devicePixelRatio to at least 2 gives the
     canvas enough sub-pixel headroom that this never shows.

   window.ChartTheme.pieOption(data, textStyle, opts)
     The one pie/donut spec used everywhere: fixed pixel radius (so every
     pie on the site is visually the same size regardless of its card's
     actual dimensions), top-left legend, inside % labels hidden below a 5%
     slice threshold (too small to hold text without overlapping) and
     colored per-slice via contrastColor() below (dark on the palette's
     lightest tints, white otherwise) instead of flatly white. Pass
     {mini: true} for a smaller fixed radius where 2+ pies must fit tightly
     side-by-side in a single card. {legendRows: N} pins the donut's Y
     position to what a fixed N-row legend would need, instead of each
     pie computing its own from its own category count — pass the same N
     to every pie in a row so they visually align even when their actual
     category counts differ. {extraGap: N} adds N extra px between the
     legend and the donut on top of that.

   window.ChartTheme.statBarAxes(textStyle, borderColor, categoryLabel)
     The shared grid/xAxis/yAxis for every "single-row 100% stacked bar"
     card (rent-cap / rent-limit / top-right / the Overview bar's per-row
     shape). A real 0-100% value axis with dashed gridlines every 20% — data
     passed to the series must be pre-normalized to percentages (of the
     respondent count) so every bar spans the same 0-100% scale and is
     therefore the same length regardless of the tab's underlying counts.
     grid.left/right are both 0% — true full card width, flush with the
     legend (also left:0) on both ends. containLabel is deliberately OFF:
     with it on, ECharts reserves left-margin space to fit the category
     y-axis's labels even though that axis is hidden (show:false) — a fixed
     ~60px phantom gap between the legend and the bar, independent of
     container width, so it was easy to mistake for a CSS layout bug. grid
     "bottom" is a fixed px instead, doing the job containLabel used to do
     for the one visible line of x-axis % labels. Those labels have their
     "0%"/"100%" values hidden too (formatter skips them) since each is
     centered exactly on an edge tick and has nowhere to overflow but past
     the card edge now that grid.left/right are 0 — both values are implied
     by the bar's own start/end anyway.

   window.ChartTheme.statBarLabel()
     The inside-segment % label for a stat bar (bold, hidden below a 5%
     share so a thin sliver never overflows its own segment) — same
     hide-below-5% convention as pieOption's inside labels. Text color is
     picked per-segment via contrastColor() below, not flatly white — the
     palette's lightest tints need a dark label instead. Returns a fresh
     object each call; spread it into every series' `label` field.

   window.ChartTheme.buildMapMarkers(map, opts)
     Returns a controller `{ render(locations, colorForCount), setSelected(name) }`
     for the "numbered circle badge on a Leaflet map" pattern used by the
     Landlord and Overview maps: a divIcon sized by count (18-40px), showing
     the respondent count inside the badge, colored by
     `colorForCount(count, maxCount, minCount)`, with the place NAME shown in
     a hover popup. `render()` clears and redraws all markers — cheap enough
     at 6 markers to just call again on every filter change instead of
     diffing. opts.popupLabel customizes the popup's count line (default
     "Count"); opts.onClick(name), if given, fires when a marker is clicked
     (used by the Landlord map to double as a region filter control) and the
     clicked marker gets a `.pin-selected` ring via setSelected(name) — pass
     null to clear the ring.

   window.ChartTheme.buildDotMatrix(gridEl, legendEl, data)
     The one dot-matrix implementation: plain DOM `.dot-item` divs in a
     `.dot-matrix-grid` (equal row/column gap via CSS `gap`, so x/y spacing
     always matches) plus a `.right-legend` list. `data` is an array of
     {name, count, color, label?} — `count` is how many dots to draw;
     `label` (defaults to `count`) is the number shown in the legend, for
     cases where dots are a scaled-down stand-in for a larger raw count.
     Clears both elements first, so it's safe to call again on every filter
     change to redraw with a new `data` set. Its category colors should
     come from contrastRamp() below, not straight PALETTE[i] slices — see
     that function's own comment for why.

   window.ChartTheme.contrastRamp(hex, count)
     `count` evenly-lightness-spaced shades of `hex`'s own hue, darkest
     first — the color set for a dot-matrix's `data` (above) or any other
     multi-category legend that needs its categories to read apart from
     each other, as opposed to an ordered ramp like the PALETTE arrays.
   ========================================================================== */

window.ChartTheme = (function () {
  const DPR = Math.max(2, window.devicePixelRatio || 1);

  function init(id) {
    return echarts.init(document.getElementById(id), null, { devicePixelRatio: DPR });
  }

  function luminance(hex) {
    if (!hex || hex[0] !== '#') return 1;
    const n = hex.length === 4 ? hex.slice(1).split('').map((c) => c + c).join('') : hex.slice(1);
    const r = parseInt(n.substring(0, 2), 16);
    const g = parseInt(n.substring(2, 4), 16);
    const b = parseInt(n.substring(4, 6), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  }

  function hexToHsl(hex) {
    const n = hex.replace('#', '');
    const r = parseInt(n.substring(0, 2), 16) / 255;
    const g = parseInt(n.substring(2, 4), 16) / 255;
    const b = parseInt(n.substring(4, 6), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2;
    let h = 0, s = 0;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
    }
    return { h, s: s * 100, l: l * 100 };
  }

  function hslToHex(h, s, l) {
    h = ((h % 360) + 360) % 360 / 360;
    s /= 100;
    l /= 100;
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    const toHex = (x) => Math.round(x * 255).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  // Evenly-spaced, meaningfully distinct shades of a theme's own hue — for
  // multi-category legends (dot-matrix) where 4-7 slices need to read
  // apart from each other at a glance, not just an ordered dark-to-light
  // ramp. The plain PALETTE arrays used elsewhere on the site bunch
  // several of their steps together at the pale end (fine for an ordered
  // stacked bar, where position already carries the ranking — too close
  // to tell apart as separate dot-matrix categories on their own). `hex`
  // anchors the hue/saturation (pass the dashboard's own darkest palette
  // shade); `count` is how many distinct steps are needed, returned
  // darkest-first so the existing "biggest category = darkest dot"
  // convention still holds.
  function contrastRamp(hex, count) {
    const { h, s } = hexToHsl(hex);
    const minL = 26, maxL = 68;
    const sat = Math.max(s, 38); // floor saturation so the palest steps don't wash out to near-gray
    return Array.from({ length: Math.max(1, count) }, (_, i) =>
      hslToHex(h, sat, count > 1 ? minL + (maxL - minL) * (i / (count - 1)) : minL)
    );
  }

  // Picks a readable in-segment label color against an arbitrary bar/slice
  // fill — every palette here ramps from a dark tone down to a near-white
  // tint, and a flatly white label (the old default) went unreadable on
  // those lightest tints. `hex` is whatever color ECharts resolved for that
  // segment (`params.color` in a label callback). The dark choice is
  // `darkColor` — that CHART's own darkest palette shade, passed in by the
  // caller (or, for pieOption, worked out automatically from its own data,
  // see below) — rather than a generic gray, so a light-slice label reads
  // as the same color family as the rest of the chart instead of a
  // one-off default.
  function contrastColor(hex, darkColor) {
    return luminance(hex) > 0.55 ? (darkColor || 'rgba(0, 0, 0, 0.72)') : '#fff';
  }

  // The lowest-luminance color actually used in `data` (each item's
  // `itemStyle.color`) — pieOption's own stand-in for "the darkest color on
  // that chart" when picking a light-slice label color, so it stays correct
  // even for a pie that only uses part of its dashboard's palette range.
  function darkestOf(data) {
    let dark = null, darkLum = Infinity;
    data.forEach((d) => {
      const c = d.itemStyle && d.itemStyle.color;
      if (!c) return;
      const lum = luminance(c);
      if (lum < darkLum) { darkLum = lum; dark = c; }
    });
    return dark;
  }

  // One consistent tooltip everywhere on the site: hovering ANY part of a
  // chart shows every category's value at once, not just whichever bar,
  // slice, or box the cursor happens to be over — a single glanceable
  // summary instead of having to sweep the mouse across the whole chart to
  // read it. Returns a plain HTML string (not a formatter function) — set
  // directly as `tooltip.formatter`; with no {a}/{b}/{c} tokens in it,
  // ECharts just shows this same content no matter which point triggered
  // the hover, which is the point. `rows` is `[[name, value, colorHex?],
  // ...]` in the order they should list. `opts.suffix` appends to every
  // value (e.g. '%'); `opts.title` is an optional bold heading line, for
  // charts whose own card-title doesn't already say what the numbers mean
  // (e.g. Overview's 3-row stat bar, one tooltip per row).
  function allStatsTooltip(rows, opts) {
    opts = opts || {};
    const suffix = opts.suffix || '';
    const title = opts.title
      ? `<div style="font-family:'GT America Bold',sans-serif;font-weight:700;margin-bottom:4px;">${opts.title}</div>`
      : '';
    const body = rows.map(([name, value, color]) => {
      const swatch = color
        ? `<span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:${color};margin-right:6px;"></span>`
        : '';
      return `<div style="display:flex;align-items:center;justify-content:space-between;gap:16px;">` +
        `<span style="display:flex;align-items:center;">${swatch}${name}</span>` +
        `<b style="margin-left:8px;">${value}${suffix}</b></div>`;
    }).join('');
    return title + body;
  }

  function statBarAxes(textStyle, borderColor, categoryLabel) {
    return {
      // containLabel:false is deliberate: with containLabel:true, ECharts
      // reserves left-margin space to fit the (hidden!) category y-axis's
      // labels anyway — a ~60px phantom gap between the legend and the bar
      // that shows up regardless of container width or padding. bottom is
      // a fixed px instead, sized for the one visible line of x-axis %
      // labels, since containLabel was also doing that job.
      grid: { left: '0%', right: '0%', bottom: 18, top: '15%', containLabel: false },
      xAxis: {
        type: 'value',
        max: 100,
        axisLine: { show: false },
        splitLine: { lineStyle: { type: 'dashed', color: borderColor } },
        // Hide the "0%" and "100%" labels — each centered on its own edge
        // tick, they have nowhere to overflow but past the card's edge
        // (which clips them now that grid.left/right are 0). Both values
        // are implied by the bar's own start/end anyway. The gridlines
        // themselves still show.
        axisLabel: { ...textStyle, fontSize: 10, formatter: (value) => (value === 0 || value === 100 ? '' : value + '%') }
      },
      yAxis: { type: 'category', data: [categoryLabel], show: false }
    };
  }

  // `darkColor` — the same stacked bar's own darkest segment color — is the
  // caller's responsibility here (unlike pieOption, a single stat bar's
  // series are built one at a time, each with only its own segment's color
  // in scope, so there's no single `data` array here to read every
  // segment's color back out of).
  function statBarLabel(darkColor) {
    return {
      show: true,
      position: 'inside',
      formatter: (p) => (p.value < 5 ? '' : Math.round(p.value * 10) / 10 + '%'),
      color: (p) => contrastColor(p.color, darkColor),
      fontFamily: 'GT America Bold, sans-serif',
      fontWeight: 700,
      fontSize: 9
    };
  }

  const PIE_RADIUS = [46, 78];
  const MINI_PIE_RADIUS = [22, 42];

  function pieLabelFormatter(params) {
    return params.percent < 5 ? '' : Math.round(params.percent) + '%';
  }

  // opts.showCount's formatter (pieOption, below) — same hide-below-5%-
  // share threshold as the default (still a meaningful cutoff for "too
  // thin to hold a label" regardless of what the label says), but shows
  // the raw respondent count instead of a percentage. For pies whose
  // legend already lists categories without numbers and whose card has no
  // other count anywhere — showing only "%" both in the donut AND nowhere
  // near an actual number read as more confusing than informative.
  function pieCountFormatter(params) {
    return params.percent < 5 ? '' : params.value;
  }

  // Legends wrap to roughly 2 entries per row at the pie card widths used on
  // this site. Reserving a FIXED PIXEL center-y (not a %) scaled to the
  // actual number of rows a given category count will wrap to guarantees
  // the legend never overlaps the donut below it, regardless of how many
  // categories a particular chart has (4 categories vs. Tenant's 6-category
  // "Coping Mechanisms" pie, which was overlapping before this).
  // opts.legendRows overrides the auto-computed row count — pass the same
  // value to 2+ pies so their donuts land on the same Y even when their
  // actual category counts (and so legend row counts) differ, e.g. 2 pies
  // side by side in a row that should look aligned. opts.extraGap adds
  // flat extra px between the legend and the donut on top of that, for
  // when a pie just needs more breathing room on its own.
  function pieCenterY(count, radius, opts) {
    opts = opts || {};
    const legendRows = opts.legendRows || Math.ceil(count / 2);
    const extraGap = opts.extraGap || 0;
    return 14 + legendRows * 15 + extraGap + radius[1] + 8;
  }

  function pieOption(data, textStyle, opts) {
    opts = opts || {};
    const mini = !!opts.mini;
    const radius = mini ? MINI_PIE_RADIUS : PIE_RADIUS;
    const darkColor = darkestOf(data);
    const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
    return {
      tooltip: {
        trigger: 'item',
        formatter: allStatsTooltip(data.map((d) => [
          d.name, `${d.value} (${Math.round((d.value / total) * 1000) / 10}%)`, d.itemStyle && d.itemStyle.color
        ]))
      },
      legend: {
        top: 0, left: 0, orient: 'horizontal', icon: 'rect',
        itemWidth: 8, itemHeight: 8, textStyle
      },
      series: [{
        name: opts.name || '',
        type: 'pie',
        radius,
        center: ['50%', pieCenterY(data.length, radius, opts)],
        avoidLabelOverlap: true,
        label: {
          show: true,
          position: 'inside',
          formatter: opts.showCount ? pieCountFormatter : pieLabelFormatter,
          color: (p) => contrastColor(p.color, darkColor),
          fontFamily: 'GT America Bold, sans-serif',
          fontWeight: 700,
          fontSize: mini ? 9 : 10
        },
        data
      }]
    };
  }

  function buildMapMarkers(map, opts) {
    opts = opts || {};
    const popupLabel = opts.popupLabel || 'Count';
    const onClick = opts.onClick || null;
    let selectedName = null;
    let current = [];

    function clear() {
      current.forEach((m) => map.removeLayer(m.marker));
      current = [];
    }

    function render(locations, colorForCount) {
      clear();
      const counts = locations.map((loc) => loc.count);
      const maxCount = Math.max(...counts, 1);
      const minCount = Math.min(...counts, 0);
      const span = maxCount - minCount || 1;

      locations.forEach((loc) => {
        const size = Math.round(18 + ((loc.count - minCount) / span) * 22);
        const fontSize = Math.max(9, Math.round(size * 0.42));
        const color = colorForCount(loc.count, maxCount, minCount);
        const isSelected = onClick && loc.name === selectedName;
        // Dim (not shrink/zero) every OTHER marker once one is selected —
        // each marker's count/size always reflects the Age/Career filters
        // only, never the Area selection itself (the caller deliberately
        // excludes `region` when computing these counts), so picking a
        // region no longer collapses every other marker to "0" and makes
        // the map look broken. Dimming keeps the full geographic picture
        // visible while still making the selected one pop.
        const isDimmed = onClick && selectedName && !isSelected;

        const icon = L.divIcon({
          className: '',
          html: `<div class="dynamic-map-pin${isSelected ? ' pin-selected' : ''}${isDimmed ? ' pin-dimmed' : ''}" style="
            width: ${size}px;
            height: ${size}px;
            font-size: ${fontSize}px;
            background-color: ${color};
            border: 2px solid rgba(255, 255, 255, 0.9);
          ">${loc.count}</div>`,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2]
        });

        const marker = L.marker(loc.coords, { icon }).addTo(map);
        const popupContent = `<b>${loc.name}</b><br>${popupLabel}: <b>${loc.count}</b>`;

        marker.on('mouseover', (e) => {
          L.popup({ offset: [0, -size / 4], closeButton: false })
            .setLatLng(e.latlng)
            .setContent(popupContent)
            .openOn(map);
        });

        marker.on('mouseout', () => map.closePopup());
        if (onClick) {
          marker.getElement && marker.on('add', () => {
            const el = marker.getElement();
            if (el) el.style.cursor = 'pointer';
          });
          marker.on('click', () => onClick(loc.name));
        }

        current.push({ name: loc.name, marker });
      });
    }

    return {
      render,
      setSelected(name) {
        selectedName = name;
      }
    };
  }

  function buildDotMatrix(gridEl, legendEl, data) {
    gridEl.innerHTML = '';
    data.forEach((item) => {
      const shownCount = item.label !== undefined ? item.label : item.count;
      for (let i = 0; i < item.count; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot-item';
        dot.style.backgroundColor = item.color;
        dot.title = `${item.name}: ${shownCount}`;
        gridEl.appendChild(dot);
      }
    });

    legendEl.innerHTML = data.map((item) => `
      <div class="legend-item">
        <span class="legend-swatch circle" style="background-color: ${item.color};"></span>
        <span>${item.name} (${item.label !== undefined ? item.label : item.count})</span>
      </div>
    `).join('');
  }

  return { init, statBarAxes, statBarLabel, pieOption, buildDotMatrix, buildMapMarkers, contrastRamp, allStatsTooltip };
})();
