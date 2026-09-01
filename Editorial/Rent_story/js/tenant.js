/* ==========================================================================
   TENANT DASHBOARD — chart definitions
   ==========================================================================
   Exposes:
     window.tenantCharts     — map of live ECharts instances (for resize)
     window.initTenantCharts — lazy-init entry point called once by main.js
   DOM ids consumed here are all prefixed `tn-` (see index.html).
   Palette is the teal theme — the 4th hue alongside homeowner's terracotta,
   non-resident's sage and landlord's slate-indigo, so no two tabs share a
   color family. Tooltip/legend/axis conventions match the other 3 modules
   (no custom tooltip skin, index-based palette assignment, top-left legend).

   Every chart is rebuilt from window.SURVEY_DATA.tenant (see js/data.js)
   through Aggregate (js/filters.js) rather than hand-pasted counts, so the
   Age/Career/Area filter card (mounted here via FilterUI, in the top-row
   next to the new tenant map) can re-render the whole page — including the
   Responses tab of tenant.subjective quotes — against whatever subset is
   currently selected. With no filters applied, every number reproduces the
   dashboard's original hardcoded values exactly (verified against the raw
   CSV before this rewrite).

   The tenant map (#tn-map) is new — this dashboard previously had none —
   added so the Area filter (like Landlord's) has a map to sit next to and
   double-click into, using the same region built from "Where do you live
   in Bangalore?" that Landlord's uses from "What area do you rent
   properties in?".
   ========================================================================== */

window.tenantCharts = {};
window.tenantMap = null;

window.initTenantCharts = function initTenantCharts() {
  const charts = window.tenantCharts;
  const container = document.getElementById('panel-tenant');

  const PALETTE = ['#994d28', '#bb5e31', '#ca815e', '#daa68e', '#e7c7b7', '#f3e2da'];
  const TEXT_DARK = '#542a16';
  const TEXT_MUTED = '#6d594c';
  const BORDER_TONE = 'rgba(140, 70, 37, 0.14)';

  const commonTextStyle = {
    fontFamily: 'GT America, sans-serif',
    fontSize: 10,
    fontWeight: 300,
    color: TEXT_MUTED
  };

  // --- Map: "Where do you live in Bangalore?" ---
  const map = L.map('tn-map', {
    zoomControl: false,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    touchZoom: false,
    keyboard: false
  }).setView([12.9650, 77.6200], 10);
  window.tenantMap = map;

  // Standard OSM tiles, not CARTO's Voyager style — CARTO's anonymous
  // (no-API-key) tier now stamps every tile with a diagonal "API KEY
  // REQUIRED" watermark, which was reading as a broken/unfinished map.
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    subdomains: 'abc',
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const REGION_COORDS = {
    East: { name: 'East (Whitefield, Marathahalli, KR Puram)', coords: [12.9698, 77.7500] },
    Central: { name: 'Central (Indiranagar, Koramangala, MG Road)', coords: [12.9784, 77.6408] },
    South: { name: 'South (HSR, BTM, Jayanagar, JP Nagar)', coords: [12.9121, 77.6445] },
    West: { name: 'West (Rajajinagar, Malleshwaram, Vijayanagar)', coords: [12.9783, 77.5510] },
    Outer: { name: 'Outer / Just outside city limits', coords: [12.8500, 77.6800] },
    North: { name: 'North (Hebbal, Yelahanka, Airport side)', coords: [13.0358, 77.5970] }
  };

  let filterCard = null;
  const mapCtl = ChartTheme.buildMapMarkers(map, {
    popupLabel: 'Tenant Count',
    onClick: (name) => {
      const region = Object.keys(REGION_COORDS).find((r) => REGION_COORDS[r].name === name);
      if (!region || !filterCard) return;
      const current = filterCard.getState().region;
      filterCard.setRegion(current === region ? '' : region);
    }
  });

  charts.deposit = ChartTheme.init('tn-chart-deposit');
  charts.payShare = ChartTheme.init('tn-chart-pay-share');
  charts.treemap = ChartTheme.init('tn-chart-treemap');
  charts.rentLimit = ChartTheme.init('tn-chart-rent-limit');
  charts.leaveRent = ChartTheme.init('tn-chart-leave-rent');
  charts.hikePie = ChartTheme.init('tn-chart-hike-pie');
  charts.copingPie = ChartTheme.init('tn-chart-coping-pie');

  const DEPOSIT_VALUES = ["1–2 months' rent", '3–5 months', '6–8 months', '9–10 months', 'More than 10 months'];
  const DEPOSIT_LABELS = ['1–2m', '3–5m', '6–8m', '9–10m', '>10m'];

  const PAY_SHARE_VALUES = ['Under 20%', '20–30%', '30–40%', '40–50%', 'Over 50%'];
  const PAY_SHARE_LABELS = ['<20%', '20–30%', '30–40%', '40–50%', '>50%'];

  const REASON_GROUPS = [
    ['Landlords taking advantage', ['Landlords taking advantage']],
    ['Too many people moving', ['Too many people moving here']],
    ['High IT salaries', ['IT salaries']],
    ['Not enough housing', ['Not enough housing']],
    ['Brokers / Others', ['Brokers', 'Something else']]
  ];

  const HIKE_LAST_VALUES = ['I paid it, no discussion', "I pushed back, and they didn't budge", 'I negotiated it down', "Haven't faced a rent hike", 'I walked/moved out over it'];
  const HIKE_LAST_LABELS = ['Paid, no discussion', 'Pushed back (no budge)', 'Negotiated down', 'No hike faced', 'Moved out over hike'];

  const RENT_LIMIT_VALUES = ['Strongly agree', 'Agree', 'Not sure', 'Disagree', 'Strongly disagree'];

  const LEAVE_RENT_VALUES = ["I'm already past my limit", "Another 10% and I'm out", 'Another 25%', "I'd never leave over rent", "I'll pay whatever it takes to stay"];
  const LEAVE_RENT_LABELS = ['Past limit', 'Another 10% out', 'Another 25%', 'Never leave', 'Pay whatever'];

  const RENEWAL_HIKE_VALUES = ["It didn't go up", 'Up to 10%', '11–20%', '21–40%', 'More than 40%', "Haven't renewed / not applicable"];
  const RENEWAL_HIKE_LABELS = ["Didn't go up", 'Up to 10%', '11–20%', '21–40%', 'More than 40%', 'Not renewed / N/A'];

  const COPING = ['commute', 'downgrade', 'flatmates', 'savings', 'delayed', 'none'];
  const COPING_LABELS = ['Longer commute', 'Downgraded place', "Flatmates I didn't want", 'Dipped into savings', 'Delayed financial goals', 'None of these'];

  function render(records, mapRecords) {
    // --- Map ---
    // mapRecords (age/career filters only, region excluded — see
    // applyFilters below) rather than records: markers always show what
    // they'd show with no Area filter, so selecting one region doesn't
    // collapse every other marker's count to 0. The selected region still
    // gets called out — via .pin-selected's ring and the dimmed opacity on
    // every other marker (see chart-theme.js's buildMapMarkers) — just not
    // by hiding real numbers.
    const regionCounts = Aggregate.regionCounts(mapRecords);
    mapCtl.render(
      Object.keys(REGION_COORDS).map((r) => ({ name: REGION_COORDS[r].name, count: regionCounts[r], coords: REGION_COORDS[r].coords })),
      (count) => {
        if (count >= 60) return PALETTE[0];
        if (count >= 20) return PALETTE[1];
        return PALETTE[2];
      }
    );

    // --- Card: "Security Deposit Paid" ---
    const deposit = Aggregate.tally(records, 'deposit', DEPOSIT_VALUES);
    charts.deposit.setOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: '0%', right: '3%', bottom: '0%', top: '8%', containLabel: true },
      xAxis: {
        type: 'category',
        data: DEPOSIT_LABELS,
        axisLine: { lineStyle: { color: BORDER_TONE } },
        axisTick: { show: false },
        axisLabel: { ...commonTextStyle, interval: 0, fontSize: 11, color: TEXT_DARK }
      },
      yAxis: {
        type: 'value', axisLine: { show: false }, axisTick: { show: false },
        splitLine: { lineStyle: { type: 'dashed', color: BORDER_TONE } },
        axisLabel: commonTextStyle
      },
      series: [{
        name: 'Tenants', type: 'bar', barWidth: '50%',
        data: deposit.counts.map((v, i) => ({ value: v, itemStyle: { color: PALETTE[i] } })),
        itemStyle: { borderRadius: [4, 4, 0, 0] },
        label: { show: true, position: 'top', ...commonTextStyle, fontFamily: 'GT America Bold, sans-serif', fontWeight: 700, color: TEXT_DARK }
      }]
    }, true);

    // --- Card: "Monthly Rent Share" ---
    const payShare = Aggregate.tally(records, 'payShare', PAY_SHARE_VALUES);
    charts.payShare.setOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: '0%', right: '3%', bottom: '0%', top: '8%', containLabel: true },
      xAxis: {
        type: 'category',
        data: PAY_SHARE_LABELS,
        axisLine: { lineStyle: { color: BORDER_TONE } },
        axisTick: { show: false },
        axisLabel: { ...commonTextStyle, interval: 0, fontSize: 11, color: TEXT_DARK }
      },
      yAxis: {
        type: 'value', axisLine: { show: false }, axisTick: { show: false },
        splitLine: { lineStyle: { type: 'dashed', color: BORDER_TONE } },
        axisLabel: commonTextStyle
      },
      series: [{
        name: 'Tenants', type: 'bar', barWidth: '50%',
        data: payShare.counts.map((v, i) => ({ value: v, itemStyle: { color: PALETTE[i] } })),
        itemStyle: { borderRadius: [4, 4, 0, 0] },
        label: { show: true, position: 'top', ...commonTextStyle, fontFamily: 'GT America Bold, sans-serif', fontWeight: 700, color: TEXT_DARK }
      }]
    }, true);

    // --- Card: "Biggest Reason Rents Have Risen" (dot matrix + explicit legend) ---
    // Each dot stands in for a few raw responses so the grid stays legible;
    // `label` keeps the legend showing the true raw count. The scale factor
    // is derived from the filtered total (min 1) instead of a hardcoded
    // "/3", so the matrix still reads sensibly on small filtered subsets.
    const reasons = Aggregate.tallyGrouped(records, 'reasonRisen', REASON_GROUPS);
    const reasonScale = Math.max(1, Math.round(reasons.total / 48) || 1);
    ChartTheme.buildDotMatrix(
      document.getElementById('tn-dot-matrix'),
      document.getElementById('tn-legend-reasons'),
      REASON_GROUPS.map(([name], i) => ({
        name,
        count: Math.max(reasons.counts[i] > 0 ? 1 : 0, Math.round(reasons.counts[i] / reasonScale)),
        label: reasons.counts[i],
        color: PALETTE[i]
      }))
    );

    // --- Card: "When Landlords Last Hiked Rent" (treemap) ---
    const hikeLast = Aggregate.tally(records, 'hikeLast', HIKE_LAST_VALUES);
    charts.treemap.setOption({
      tooltip: { formatter: '{b}: <b>{c} tenants</b>' },
      series: [{
        type: 'treemap',
        width: '100%',
        height: '100%',
        roam: false,
        nodeClick: false,
        breadcrumb: { show: false },
        label: {
          show: true,
          fontFamily: 'GT America Bold, sans-serif',
          fontSize: 10,
          fontWeight: 700,
          color: '#ffffff',
          overflow: 'break',
          lineHeight: 13,
          formatter: (p) => `${p.name}\n(${p.value})`
        },
        itemStyle: { borderColor: '#f7f7f4', borderWidth: 2, gapWidth: 2 },
        data: HIKE_LAST_LABELS.map((name, i) => ({ name, value: hikeLast.counts[i], itemStyle: { color: PALETTE[i] } }))
      }]
    }, true);

    // --- Card: "Rent Cap Support" ---
    const rentLimit = Aggregate.tally(records, 'rentLimit', RENT_LIMIT_VALUES);
    const rentLimitPct = Aggregate.percentages(rentLimit.counts, rentLimit.total);
    charts.rentLimit.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
      legend: {
        top: 0, left: 0, icon: 'rect', itemWidth: 10, itemHeight: 10,
        textStyle: commonTextStyle,
        data: RENT_LIMIT_VALUES
      },
      ...ChartTheme.statBarAxes(commonTextStyle, BORDER_TONE, 'Responses'),
      series: RENT_LIMIT_VALUES.map((name, i) => ({
        name, type: 'bar', stack: 'total', data: [rentLimitPct[i]],
        itemStyle: { color: PALETTE[i], ...(i === 0 ? { borderRadius: [4, 0, 0, 4] } : {}), ...(i === RENT_LIMIT_VALUES.length - 1 ? { borderRadius: [0, 4, 4, 0] } : {}) },
        label: ChartTheme.statBarLabel()
      }))
    }, true);

    // --- Card: "Max Rent Before Leaving City" (diverging horizontal bar) ---
    const leaveRent = Aggregate.tally(records, 'leaveRent', LEAVE_RENT_VALUES);
    const leaveColors = ['#7a8290', '#98a0ab', '#5b6272', PALETTE[1], PALETTE[0]];
    const leaveSign = [-1, -1, -1, 1, 1];
    charts.leaveRent.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params) => `${params[0].name}: <b>${Math.abs(params[0].value)} tenants</b>`
      },
      grid: { left: '0%', right: '4%', bottom: '0%', top: '4%', containLabel: true },
      xAxis: {
        type: 'value',
        axisLabel: { formatter: (v) => Math.abs(v), ...commonTextStyle },
        splitLine: { lineStyle: { type: 'dashed', color: BORDER_TONE } }
      },
      yAxis: {
        type: 'category',
        data: LEAVE_RENT_LABELS,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { ...commonTextStyle, fontFamily: 'GT America Bold, sans-serif', fontWeight: 700, color: TEXT_DARK }
      },
      series: [{
        type: 'bar',
        barWidth: 14,
        label: {
          show: true, formatter: (p) => Math.abs(p.value),
          fontFamily: 'GT America Bold, sans-serif', fontWeight: 700, fontSize: 9, color: TEXT_DARK
        },
        data: leaveRent.counts.map((v, i) => ({
          value: v * leaveSign[i],
          itemStyle: { color: leaveColors[i], borderRadius: leaveSign[i] < 0 ? [4, 0, 0, 4] : [0, 4, 4, 0] },
          label: { position: leaveSign[i] < 0 ? 'left' : 'right' }
        }))
      }]
    }, true);

    // --- Card: "Last Renewal Hike" ---
    const renewalHike = Aggregate.tally(records, 'renewalHike', RENEWAL_HIKE_VALUES);
    const renewalColors = [PALETTE[4], PALETTE[3], PALETTE[2], PALETTE[1], PALETTE[0], PALETTE[5]];
    charts.hikePie.setOption(ChartTheme.pieOption(
      RENEWAL_HIKE_LABELS.map((name, i) => ({ value: renewalHike.counts[i], name, itemStyle: { color: renewalColors[i] } })),
      commonTextStyle, { name: 'Renewal Hike', extraGap: 20 }
    ), true);

    // --- Card: "Moving & Coping Trade-offs" ---
    const copingCounts = COPING.map((code) => Aggregate.countFlag(records, 'coping', code));
    charts.copingPie.setOption(ChartTheme.pieOption(
      COPING_LABELS.map((name, i) => ({ value: copingCounts[i], name, itemStyle: { color: PALETTE[i] } })),
      commonTextStyle, { name: 'Coping Mechanisms', extraGap: 20 }
    ), true);
  }

  function renderResponses(records) {
    const items = records
      .filter((r) => r.subjective)
      .map((r) => ({
        quote: r.subjective,
        meta: (r.age || 'Age not specified') + ' • ' + (r.career ? Aggregate.shortCareer(r.career) : 'Career not specified')
      }));
    FilterUI.mountResponses(
      document.getElementById('tn-responses'),
      document.getElementById('tn-pagination'),
      items,
      { emptyText: 'No tenant responses match these filters.' }
    );
  }

  function toggleView(view) {
    const chartsView = document.getElementById('tn-charts-view');
    const responsesView = document.getElementById('tn-responses-view');
    chartsView.style.display = view === 'charts' ? '' : 'none';
    responsesView.style.display = view === 'responses' ? '' : 'none';
    if (view === 'charts') {
      FilterUI.replayEnter(chartsView.querySelector('.dashboard-grid'));
      requestAnimationFrame(() => {
        Object.values(charts).forEach((c) => c && !c.isDisposed() && c.resize());
        map.invalidateSize();
      });
    } else {
      FilterUI.replayEnter(responsesView);
    }
  }

  function applyFilters(filters) {
    mapCtl.setSelected(filters.region ? REGION_COORDS[filters.region].name : null);
    const records = Aggregate.filterRecords(window.SURVEY_DATA.tenant, filters);
    const mapRecords = Aggregate.filterRecords(window.SURVEY_DATA.tenant, { age: filters.age, career: filters.career });
    render(records, mapRecords);
    renderResponses(records);
  }

  filterCard = FilterUI.buildFilterCard({
    hasRegion: true,
    ageOptions: Aggregate.optionsWithData(window.SURVEY_DATA.tenant, 'age', Aggregate.AGE_OPTIONS),
    careerOptions: Aggregate.optionsWithData(window.SURVEY_DATA.tenant, 'career', Aggregate.CAREER_OPTIONS),
    title: 'Filter Tenant Responses',
    subtitle: 'Select an age group, career stage or area — the map, every chart, and the Responses tab below all narrow to match.',
    onFilterChange: applyFilters
  });
  document.getElementById('tn-top-row').insertBefore(filterCard.el, document.getElementById('tn-top-row').firstChild);
  // The map was created (and sized itself) before the filter card existed,
  // when the map card still had the whole .top-row's width to itself —
  // inserting the filter card as a second flex sibling just now halved it.
  // Leaflet doesn't notice a container resize on its own, so without this
  // it keeps drawing tiles for the old, wider box: centered on the wrong
  // point and panned off Bengaluru entirely once the container narrowed.
  map.invalidateSize();

  FilterUI.mountSectionTabs(container, { onViewChange: toggleView });

  applyFilters({});
};
