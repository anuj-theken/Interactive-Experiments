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
     slice threshold (too small to hold text without overlapping). Pass
     {mini: true} for a smaller fixed radius where 2+ pies must fit tightly
     side-by-side in a single card.

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
     The inside-segment % label for a stat bar (white, bold, hidden below a
     5% share so a thin sliver never overflows its own segment) — same
     hide-below-5% convention as pieOption's inside labels. Returns a fresh
     object each call; spread it into every series' `label` field.

   window.ChartTheme.buildMapMarkers(map, locations, colorForCount, opts)
     The one "numbered circle badge on a Leaflet map" implementation, used by
     both the Landlord and Overview maps: a divIcon sized by count (18-40px),
     showing the respondent count inside the badge, colored by
     `colorForCount(count, maxCount, minCount)`, with the place NAME shown in
     a hover popup. `locations` is an array of {name, count, coords:[lat,lng]}.
     opts.popupLabel customizes the popup's count line (default "Count").

   window.ChartTheme.buildDotMatrix(gridEl, legendEl, data)
     The one dot-matrix implementation: plain DOM `.dot-item` divs in a
     `.dot-matrix-grid` (equal row/column gap via CSS `gap`, so x/y spacing
     always matches) plus a `.right-legend` list. `data` is an array of
     {name, count, color, label?} — `count` is how many dots to draw;
     `label` (defaults to `count`) is the number shown in the legend, for
     cases where dots are a scaled-down stand-in for a larger raw count.
   ========================================================================== */

window.ChartTheme = (function () {
  const DPR = Math.max(2, window.devicePixelRatio || 1);

  function init(id) {
    return echarts.init(document.getElementById(id), null, { devicePixelRatio: DPR });
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
        axisLabel: { ...textStyle, formatter: (value) => (value === 0 || value === 100 ? '' : value + '%') }
      },
      yAxis: { type: 'category', data: [categoryLabel], show: false }
    };
  }

  function statBarLabel() {
    return {
      show: true,
      position: 'inside',
      formatter: (p) => (p.value < 5 ? '' : Math.round(p.value * 10) / 10 + '%'),
      color: '#fff',
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

  // Legends wrap to roughly 2 entries per row at the pie card widths used on
  // this site. Reserving a FIXED PIXEL center-y (not a %) scaled to the
  // actual number of rows a given category count will wrap to guarantees
  // the legend never overlaps the donut below it, regardless of how many
  // categories a particular chart has (4 categories vs. Tenant's 6-category
  // "Coping Mechanisms" pie, which was overlapping before this).
  function pieCenterY(count, radius) {
    const legendRows = Math.ceil(count / 2);
    return 14 + legendRows * 15 + radius[1] + 8;
  }

  function pieOption(data, textStyle, opts) {
    opts = opts || {};
    const mini = !!opts.mini;
    const radius = mini ? MINI_PIE_RADIUS : PIE_RADIUS;
    return {
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      legend: {
        top: 0, left: 0, orient: 'horizontal', icon: 'rect',
        itemWidth: 8, itemHeight: 8, textStyle
      },
      series: [{
        name: opts.name || '',
        type: 'pie',
        radius,
        center: ['50%', pieCenterY(data.length, radius)],
        avoidLabelOverlap: true,
        label: {
          show: true,
          position: 'inside',
          formatter: pieLabelFormatter,
          color: '#fff',
          fontFamily: 'GT America Bold, sans-serif',
          fontWeight: 700,
          fontSize: mini ? 9 : 10
        },
        data
      }]
    };
  }

  function buildMapMarkers(map, locations, colorForCount, opts) {
    opts = opts || {};
    const popupLabel = opts.popupLabel || 'Count';
    const counts = locations.map((loc) => loc.count);
    const maxCount = Math.max(...counts);
    const minCount = Math.min(...counts);
    const span = maxCount - minCount || 1;

    locations.forEach((loc) => {
      const size = Math.round(18 + ((loc.count - minCount) / span) * 22);
      const fontSize = Math.max(9, Math.round(size * 0.42));
      const color = colorForCount(loc.count, maxCount, minCount);

      const icon = L.divIcon({
        className: '',
        html: `<div class="dynamic-map-pin" style="
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
    });
  }

  function buildDotMatrix(gridEl, legendEl, data) {
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

  return { init, statBarAxes, statBarLabel, pieOption, buildDotMatrix, buildMapMarkers };
})();
