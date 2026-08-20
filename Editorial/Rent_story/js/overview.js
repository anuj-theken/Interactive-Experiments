/* ==========================================================================
   OVERVIEW DASHBOARD — chart + map definitions
   ==========================================================================
   Exposes:
     window.overviewCharts     — map of live ECharts instances (for resize)
     window.overviewMap        — the Leaflet map instance (for invalidateSize)
     window.initOverviewCharts — lazy-init entry point called once by main.js
   DOM ids consumed here are all prefixed `ov-` (see index.html).
   Palette is the plum theme — the 5th hue alongside homeowner's terracotta,
   non-resident's sage, landlord's slate-indigo and tenant's teal.

   Adjustments made from the original standalone overview.html to match the
   site-wide design system (dashboardstyleprompt.md, js/chart-theme.js) and
   the other 4 tabs:
   - The 2 demographic pies were switched from a small pie with a vertical
     right-side legend to ChartTheme.pieOption's shared donut spec (fixed
     px radius, inside % labels hidden below 5%, top-left legend) used by
     every pie on the site, so all pies are the same visual family and size.
   - The map's plain translucent circles were switched to
     ChartTheme.buildMapMarkers' numbered badges + hover-name-popup, matching
     the Landlord map.
   - Chart chrome (axis lines, dashed gridlines, fonts, tooltip) now uses the
     shared commonTextStyle/BORDER_TONE conventions instead of one-off hex
     strings.
   - The stacked bar chart's y-axis stays visible (unlike the single-row
     hidden-axis "rent cap" bar on the other 4 tabs) because it genuinely
     compares 3 categories — hiding it would lose that comparison.
   ========================================================================== */

window.overviewCharts = {};
window.overviewMap = null;

window.initOverviewCharts = function initOverviewCharts() {
  const charts = window.overviewCharts;

  const PALETTE = ['#4a1e42', '#6b3260', '#8f4f80', '#b0759d', '#cc9dbe', '#e4c6d9'];
  const TEXT_DARK = '#2c1428';
  const TEXT_MUTED = '#6b5566';
  const BORDER_TONE = 'rgba(70, 20, 60, 0.12)';

  const commonTextStyle = {
    fontFamily: 'GT America, sans-serif',
    fontSize: 10,
    fontWeight: 300,
    color: TEXT_MUTED
  };

  // --- Card: "Do you think Bengaluru should put a limit on rent hikes?" ---
  charts.bar = ChartTheme.init('ov-chart-bar');
  charts.bar.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      valueFormatter: (value) => value + '%'
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
      axisLabel: { ...commonTextStyle, formatter: '{value}%' }
    },
    yAxis: {
      type: 'category',
      data: ['Pay Rent', 'Own Home', 'Landlords'],
      axisLine: { lineStyle: { color: BORDER_TONE } },
      axisTick: { show: false },
      axisLabel: { ...commonTextStyle, fontFamily: 'GT America Bold, sans-serif', fontWeight: 700, color: TEXT_DARK }
    },
    series: [
      { name: 'Strongly Agree', type: 'bar', stack: 'total', itemStyle: { color: PALETTE[0], borderRadius: [4, 0, 0, 4] }, data: [64.18, 23.46, 6.90], label: ChartTheme.statBarLabel() },
      { name: 'Agree', type: 'bar', stack: 'total', itemStyle: { color: PALETTE[1] }, data: [18.62, 27.16, 24.14], label: ChartTheme.statBarLabel() },
      { name: 'Not Sure', type: 'bar', stack: 'total', itemStyle: { color: PALETTE[2] }, data: [5.44, 9.88, 8.62], label: ChartTheme.statBarLabel() },
      { name: 'Disagree', type: 'bar', stack: 'total', itemStyle: { color: PALETTE[3] }, data: [6.30, 19.75, 27.59], label: ChartTheme.statBarLabel() },
      { name: 'Strongly Disagree', type: 'bar', stack: 'total', itemStyle: { color: PALETTE[4], borderRadius: [0, 4, 4, 0] }, data: [5.44, 19.75, 32.76], label: ChartTheme.statBarLabel() }
    ]
  });

  // --- Card: "Age Demographics" ---
  // Colors assigned by actual age order (not by response count, which is
  // how the data below is still sorted): the oldest bracket gets the
  // darkest shade, ramping lighter as age decreases. "Not specified" stays
  // the lightest/neutral tone since it isn't a real point on that scale.
  charts.pieAge = ChartTheme.init('ov-pie-age');
  charts.pieAge.setOption(ChartTheme.pieOption([
    { value: 272, name: '25 – 34', itemStyle: { color: PALETTE[3] } },
    { value: 169, name: '35 – 44', itemStyle: { color: PALETTE[2] } },
    { value: 69, name: '45 – 54', itemStyle: { color: PALETTE[1] } },
    { value: 38, name: '55 and above', itemStyle: { color: PALETTE[0] } },
    { value: 33, name: 'Under 25', itemStyle: { color: PALETTE[4] } },
    { value: 40, name: 'Not specified', itemStyle: { color: PALETTE[5] } }
  ], commonTextStyle, { name: 'Age' }));

  // --- Card: "Career Position" ---
  // Colors assigned by career seniority, not response count: Senior career
  // is darkest, Mid career next, then Early career/Student (lightest of the
  // employed tiers), with Self-employed and Not working as their own tones
  // and "Not specified" kept neutral/lightest.
  charts.pieCareer = ChartTheme.init('ov-pie-career');
  charts.pieCareer.setOption(ChartTheme.pieOption([
    { value: 239, name: 'Mid career', itemStyle: { color: PALETTE[1] } },
    { value: 106, name: 'Senior career', itemStyle: { color: PALETTE[0] } },
    { value: 90, name: 'Early career', itemStyle: { color: PALETTE[3] } },
    { value: 60, name: 'Self-employed', itemStyle: { color: PALETTE[2] } },
    { value: 21, name: 'Not working', itemStyle: { color: PALETTE[4] } },
    { value: 7, name: 'Student', itemStyle: { color: PALETTE[3] } },
    { value: 98, name: 'Not specified', itemStyle: { color: PALETTE[5] } }
  ], commonTextStyle, { name: 'Career' }));

  // --- Card: "Tenant & Landlord Regional Distribution" (static, non-interactive map) ---
  // Same numbered-badge-with-name-popup marker style as the Landlord map
  // (ChartTheme.buildMapMarkers), just non-interactive (no pan/zoom) since
  // this is a small summary panel, not a dedicated exploration map.
  const map = L.map('ov-map', {
    zoomControl: false,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    touchZoom: false,
    keyboard: false
  }).setView([12.9620, 77.6250], 11);
  window.overviewMap = map;

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  ChartTheme.buildMapMarkers(map, [
    { name: 'Central (Indiranagar, Koramangala, MG Road)', count: 128, coords: [12.9600, 77.6350] },
    { name: 'East (Whitefield, Marathahalli, KR Puram)', count: 121, coords: [12.9750, 77.7100] },
    { name: 'South (HSR, BTM, Jayanagar, JP Nagar)', count: 113, coords: [12.9150, 77.6100] },
    { name: 'North (Hebbal, Yelahanka, Airport side)', count: 27, coords: [13.0400, 77.5900] },
    { name: 'Outer / Just outside city limits', count: 23, coords: [12.8700, 77.6600] },
    { name: 'West (Rajajinagar, Malleshwaram, Vijayanagar)', count: 18, coords: [12.9800, 77.5400] }
  ], (count) => {
    if (count >= 100) return PALETTE[0];
    if (count >= 25) return PALETTE[1];
    return PALETTE[2];
  }, { popupLabel: 'Respondents' });
};
