/* ==========================================================================
   OVERVIEW DASHBOARD — chart + map definitions
   ==========================================================================
   Exposes:
     window.overviewCharts     — map of live ECharts instances (for resize)
     window.overviewMap        — the Leaflet map instance (for invalidateSize)
     window.initOverviewCharts — lazy-init entry point called once by main.js
   DOM ids consumed here are all prefixed `ov-` (see index.html).
   Palette is the cream/brick-red theme, sampled from overview.png (see
   css/dashboard.css section 3 for the full set of per-dashboard themes).

   This is the one dashboard that reads across all 4 respondent categories
   (window.SURVEY_DATA.tenant/homeowner/landlord/nonresident) at once, via
   Aggregate (js/filters.js) — the Age/Career filter card mounted here (no
   Area filter, and no Responses tab: this panel is a cross-cutting summary,
   not tied to one category's own questions) narrows all 4 sets together.
   Unlike every other pie/bar on the site, the Age and Career pies here keep
   blank answers as their own "Not specified" slice instead of excluding
   them — that's how they were built originally, and dropping it would
   silently change the total the 2 pies sum to. With no filters applied,
   every number reproduces the dashboard's original hardcoded values exactly
   (verified against the raw CSV before this rewrite).
   ========================================================================== */

window.overviewCharts = {};
window.overviewMap = null;

window.initOverviewCharts = function initOverviewCharts() {
  const charts = window.overviewCharts;

  const PALETTE = ['#74403f', '#8e4e4d', '#a77574', '#c19e9d', '#d7c1c1', '#ebdfdf'];
  const TEXT_DARK = '#402323';
  const TEXT_MUTED = '#645652';
  const BORDER_TONE = 'rgba(106, 58, 58, 0.14)';

  const commonTextStyle = {
    fontFamily: 'GT America, sans-serif',
    fontSize: 10,
    fontWeight: 300,
    color: TEXT_MUTED
  };

  const RENT_LIMIT_VALUES = ['Strongly agree', 'Agree', 'Not sure', 'Disagree', 'Strongly disagree'];

  charts.bar = ChartTheme.init('ov-chart-bar');
  charts.pieAge = ChartTheme.init('ov-pie-age');
  charts.pieCareer = ChartTheme.init('ov-pie-career');

  const map = L.map('ov-map', {
    zoomControl: false,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    touchZoom: false,
    keyboard: false
  }).setView([12.9650, 77.6200], 10);
  window.overviewMap = map;

  // Esri's free "World Street Map" — not full-detail OSM (every road, POI
  // icon, and building outline — too busy for what's meant to be a plain
  // backdrop for the region markers, not a navigable street map), not
  // CARTO's Voyager/Positron (their anonymous no-API-key tier stamps every
  // tile with a diagonal "API KEY REQUIRED" watermark), and not the flat
  // gray Canvas basemap used before this (no color of its own at all, so
  // every dashboard needed a CSS filter hack to tell them apart — read as
  // muddy rather than "themed"). This one has real (if muted) color and
  // place-name labels baked into the tiles themselves, at a road density
  // well below plain OSM. No key needed.
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'OpenStreetMap',
    maxZoom: 19
  }).addTo(map);

  const REGION_COORDS = {
    Central: { name: 'Central (Indiranagar, Koramangala, MG Road)', coords: [12.9600, 77.6350] },
    East: { name: 'East (Whitefield, Marathahalli, KR Puram)', coords: [12.9750, 77.7100] },
    South: { name: 'South (HSR, BTM, Jayanagar, JP Nagar)', coords: [12.9150, 77.6100] },
    North: { name: 'North (Hebbal, Yelahanka, Airport side)', coords: [13.0400, 77.5900] },
    Outer: { name: 'Outer / Just outside city limits', coords: [12.8700, 77.6600] },
    West: { name: 'West (Rajajinagar, Malleshwaram, Vijayanagar)', coords: [12.9800, 77.5400] }
  };

  const mapCtl = ChartTheme.buildMapMarkers(map, { popupLabel: 'Respondents' });

  function tallyWithBlank(records, field, values) {
    const counts = values.map(() => 0);
    let blank = 0;
    records.forEach((r) => {
      const v = r[field];
      if (!v) { blank++; return; }
      const idx = values.indexOf(v);
      if (idx !== -1) counts[idx]++;
    });
    return { counts, blank };
  }

  function setKpi(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function render(filters) {
    const tenant = Aggregate.filterRecords(window.SURVEY_DATA.tenant, filters);
    const homeowner = Aggregate.filterRecords(window.SURVEY_DATA.homeowner, filters);
    const landlord = Aggregate.filterRecords(window.SURVEY_DATA.landlord, filters);
    const nonresident = Aggregate.filterRecords(window.SURVEY_DATA.nonresident, filters);

    // --- KPI summary panel ---
    setKpi('ov-kpi-total', tenant.length + homeowner.length + landlord.length + nonresident.length);
    setKpi('ov-kpi-tenant', tenant.length);
    setKpi('ov-kpi-owner', homeowner.length);
    setKpi('ov-kpi-landlord', landlord.length);
    setKpi('ov-kpi-nonresident', nonresident.length);

    // --- "Do you think Bengaluru should put a limit on rent hikes?" ---
    const tenantLimit = Aggregate.tally(tenant, 'rentLimit', RENT_LIMIT_VALUES);
    const homeownerLimit = Aggregate.tally(homeowner, 'rentLimit', RENT_LIMIT_VALUES);
    const landlordLimit = Aggregate.tally(landlord, 'rentCap', RENT_LIMIT_VALUES);
    const rows = [
      Aggregate.percentages(tenantLimit.counts, tenantLimit.total),
      Aggregate.percentages(homeownerLimit.counts, homeownerLimit.total),
      Aggregate.percentages(landlordLimit.counts, landlordLimit.total)
    ];
    charts.bar.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params) => ChartTheme.allStatsTooltip(
          params.map((p) => [p.seriesName, p.value, p.color]),
          { suffix: '%', title: params[0] && params[0].axisValueLabel }
        )
      },
      legend: {
        top: 0, left: 0, icon: 'rect', itemWidth: 10, itemHeight: 10,
        textStyle: commonTextStyle
      },
      grid: { left: '1%', right: '3%', bottom: '0%', top: '15%', containLabel: true },
      xAxis: {
        type: 'value',
        max: 100,
        axisLine: { show: false },
        splitLine: { lineStyle: { type: 'dashed', color: BORDER_TONE } },
        axisLabel: { ...commonTextStyle, fontSize: 10, formatter: '{value}%' }
      },
      yAxis: {
        type: 'category',
        data: ['Tenants', 'Own Home', 'Landlords'],
        axisLine: { lineStyle: { color: BORDER_TONE } },
        axisTick: { show: false },
        axisLabel: { ...commonTextStyle, color: TEXT_DARK, fontSize: 10 }
      },
      series: RENT_LIMIT_VALUES.map((name, i) => ({
        name: ['Strongly Agree', 'Agree', 'Not Sure', 'Disagree', 'Strongly Disagree'][i],
        type: 'bar', stack: 'total',
        itemStyle: { color: PALETTE[i], ...(i === 0 ? { borderRadius: [4, 0, 0, 4] } : {}), ...(i === RENT_LIMIT_VALUES.length - 1 ? { borderRadius: [0, 4, 4, 0] } : {}) },
        data: rows.map((row) => row[i]),
        label: ChartTheme.statBarLabel(PALETTE[0])
      }))
    }, true);

    // --- "Age Demographics" / "Career Position" (combined across all 4 categories) ---
    const all = [].concat(tenant, homeowner, landlord, nonresident);

    const age = tallyWithBlank(all, 'age', Aggregate.AGE_OPTIONS);
    // Display order matches the original chart: descending through the
    // "middle" brackets, then "Under 25", then "Not specified" last —
    // not the raw AGE_OPTIONS order and not sorted by count.
    const AGE_PIE_ORDER = [
      ['25 – 34', PALETTE[3]], ['35 – 44', PALETTE[2]], ['45 – 54', PALETTE[1]],
      ['55 and above', PALETTE[0]], ['Under 25', PALETTE[4]]
    ];
    const ageData = AGE_PIE_ORDER.map(([name, color]) => ({
      value: age.counts[Aggregate.AGE_OPTIONS.indexOf(name)], name, itemStyle: { color }
    }));
    ageData.push({ value: age.blank, name: 'Not specified', itemStyle: { color: PALETTE[5] } });
    charts.pieAge.setOption(ChartTheme.pieOption(ageData, commonTextStyle, { name: 'Age', legendRows: 4 }), true);

    const career = tallyWithBlank(all, 'career', Aggregate.CAREER_OPTIONS);
    // Display order is by career seniority (matching the original chart),
    // not by response count — "Not specified" always sits last regardless
    // of where its count would otherwise rank.
    const CAREER_PIE_ORDER = [
      ['Mid career', PALETTE[1]],
      ['Senior career', PALETTE[0]],
      ['Early career', PALETTE[3]],
      ['Self-employed / run my own business', PALETTE[2]],
      ['Not working right now', PALETTE[4]],
      ['Student', PALETTE[3]]
    ];
    const CAREER_SHORT = { 'Self-employed / run my own business': 'Self-employed', 'Not working right now': 'Not working' };
    const careerData = CAREER_PIE_ORDER.map(([name, color]) => ({
      value: career.counts[Aggregate.CAREER_OPTIONS.indexOf(name)],
      name: CAREER_SHORT[name] || name,
      itemStyle: { color }
    }));
    careerData.push({ value: career.blank, name: 'Not specified', itemStyle: { color: PALETTE[5] } });
    charts.pieCareer.setOption(ChartTheme.pieOption(careerData, commonTextStyle, { name: 'Career', legendRows: 4 }), true);

    // --- "Tenant & Landlord Regional Distribution" ---
    const tenantRegions = Aggregate.regionCounts(tenant);
    const landlordRegions = Aggregate.regionCounts(landlord);
    mapCtl.render(
      Object.keys(REGION_COORDS).map((r) => ({
        name: REGION_COORDS[r].name,
        count: tenantRegions[r] + landlordRegions[r],
        coords: REGION_COORDS[r].coords
      })),
      (count) => {
        if (count >= 100) return PALETTE[0];
        if (count >= 25) return PALETTE[1];
        return PALETTE[2];
      }
    );
  }

  const allRecords = [].concat(
    window.SURVEY_DATA.tenant, window.SURVEY_DATA.homeowner,
    window.SURVEY_DATA.landlord, window.SURVEY_DATA.nonresident
  );
  const filterCard = FilterUI.buildFilterCard({
    hasRegion: false,
    ageOptions: Aggregate.optionsWithData(allRecords, 'age', Aggregate.AGE_OPTIONS),
    careerOptions: Aggregate.optionsWithData(allRecords, 'career', Aggregate.CAREER_OPTIONS),
    title: 'Filter this overview',
    onFilterChange: render
  });
  const ovTopRow = document.getElementById('ov-top-row');
  ovTopRow.insertBefore(filterCard.el, ovTopRow.firstChild);
  // The map was created (and sized itself) before the filter card existed,
  // when the map card still had the whole .top-row's width to itself —
  // inserting the filter card as a second flex sibling just now halved it.
  // Leaflet doesn't notice a container resize on its own, so without this
  // it keeps drawing tiles for the old, wider box: centered on the wrong
  // point and panned off Bengaluru entirely once the container narrowed.
  map.invalidateSize();

  FilterUI.enableCardCarousel(document.querySelector('#panel-overview .dashboard-grid'), {
    onLayoutChange: () => Object.values(charts).forEach((c) => c && !c.isDisposed() && c.resize())
  });

  render({});
};
