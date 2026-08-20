/* ==========================================================================
   LANDLORD DASHBOARD — chart + map definitions
   ==========================================================================
   Exposes:
     window.landlordCharts     — map of live ECharts instances (for resize)
     window.landlordMap        — the Leaflet map instance (for invalidateSize)
     window.initLandlordCharts — lazy-init entry point called once by main.js
   DOM ids consumed here are all prefixed `ll-` (see index.html).
   Palette is the slate/indigo theme — kept distinct from the homeowner
   (terracotta) and non-resident (sage) themes on purpose.
   ========================================================================== */

window.landlordCharts = {};
window.landlordMap = null;

window.initLandlordCharts = function initLandlordCharts() {
  const charts = window.landlordCharts;
  const palette = ['#263454', '#3c4f74', '#5f7699', '#93a5c2', '#c7d2e3'];
  const defaultFont = 'GT America';
  const boldFont = 'GT America Bold';
  const TEXT_DARK = '#1c2233';
  const TEXT_MUTED = '#5b6478';
  const borderTone = 'rgba(30, 40, 70, 0.14)';

  // --- Map: "What area of Bangalore do you rent properties in?" ---
  const map = L.map('ll-map', { zoomControl: false }).setView([12.9650, 77.6200], 10);
  window.landlordMap = map;

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap'
  }).addTo(map);

  ChartTheme.buildMapMarkers(map, [
    { name: 'East (Whitefield, Marathahalli, KR Puram)', count: 20, coords: [12.9698, 77.7500] },
    { name: 'Central (Indiranagar, Koramangala, MG Road)', count: 13, coords: [12.9784, 77.6408] },
    { name: 'South (HSR, BTM, Jayanagar, JP Nagar)', count: 12, coords: [12.9121, 77.6445] },
    { name: 'West (Rajajinagar, Malleshwaram, Vijayanagar)', count: 5, coords: [12.9783, 77.5510] },
    { name: 'Outer / Just outside city limits', count: 4, coords: [12.8500, 77.6800] },
    { name: 'North (Hebbal, Yelahanka, Airport side)', count: 3, coords: [13.0358, 77.5970] }
  ], (count) => {
    if (count >= 10) return palette[0];
    if (count >= 5) return palette[1];
    return palette[2];
  }, { popupLabel: 'Landlord Count' });

  // --- Same card: portfolio-size bar chart, next to the map ---
  charts.portfolio = ChartTheme.init('ll-chart-portfolio');
  charts.portfolio.setOption({
    tooltip: { trigger: 'axis' },
    grid: { top: 20, bottom: 25, left: 25, right: 10 },
    xAxis: {
      type: 'category',
      data: ['One', 'Two', '3 - 5', '> 5'],
      axisLine: { lineStyle: { color: palette[2] } },
      axisLabel: { fontFamily: defaultFont, fontSize: 9, fontWeight: 600 }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { type: 'dashed', color: borderTone } },
      axisLabel: { fontFamily: defaultFont, fontSize: 9 }
    },
    series: [{
      data: [36, 15, 2, 1],
      type: 'bar',
      itemStyle: { color: palette[1], borderRadius: [4, 4, 0, 0] },
      label: { show: true, position: 'top', fontFamily: boldFont, fontWeight: 700, fontSize: 9, color: TEXT_DARK }
    }]
  });

  // --- Card: "Why become a landlord?" ---
  charts.motivation = ChartTheme.init('ll-chart-motivation');
  charts.motivation.setOption({
    tooltip: { trigger: 'axis' },
    grid: { top: 15, bottom: 40, left: '2%', right: '4%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['Lived then\nmoved', 'Inherited', 'Earn rent', 'Child /\nLater', 'Other'],
      axisLine: { lineStyle: { color: palette[2] } },
      axisLabel: { fontFamily: defaultFont, fontSize: 8, fontWeight: 600, interval: 0, lineHeight: 11 }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { type: 'dashed', color: borderTone } },
      axisLabel: { fontFamily: defaultFont, fontSize: 9 }
    },
    series: [{
      data: [30, 10, 9, 5, 3],
      type: 'bar',
      itemStyle: { color: palette[1], borderRadius: [4, 4, 0, 0] },
      label: { show: true, position: 'top', fontFamily: boldFont, fontWeight: 700, fontSize: 9, color: TEXT_DARK }
    }]
  });

  // --- Card: "Rent pricing logic?" ---
  charts.pricing = ChartTheme.init('ll-chart-pricing');
  charts.pricing.setOption({
    tooltip: { trigger: 'axis' },
    grid: { top: 15, bottom: 40, left: '2%', right: '4%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['Matched\nnearby', 'Broker\nrate', 'Last rent\n+ bit', 'Whatever\npossible', 'Covers\ncosts'],
      axisLine: { lineStyle: { color: palette[2] } },
      axisLabel: { fontFamily: defaultFont, fontSize: 8, fontWeight: 600, interval: 0, lineHeight: 11 }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { type: 'dashed', color: borderTone } },
      axisLabel: { fontFamily: defaultFont, fontSize: 9 }
    },
    series: [{
      data: [27, 13, 9, 6, 1],
      type: 'bar',
      itemStyle: { color: palette[2], borderRadius: [4, 4, 0, 0] },
      label: { show: true, position: 'top', fontFamily: boldFont, fontWeight: 700, fontSize: 9, color: TEXT_DARK }
    }]
  });

  // --- Card: "Do you think Bengaluru should put a limit on how much rent can go up?" ---
  // Shared "single-row 100% stacked bar" spec (ChartTheme.statBarAxes): a
  // real 0-100% axis with dashed gridlines, so this bar is the same length
  // as ho-chart-rent-limit / nr-chart-top-right / tn-chart-rent-limit.
  charts.rentCap = ChartTheme.init('ll-chart-rent-cap');
  charts.rentCap.setOption({
    tooltip: {
      trigger: 'item',
      formatter: (params) => `${params.marker} ${params.seriesName.replace(/\s*\([^)]*\)/, '')}: <b>${params.value}%</b> (${Math.round(params.value * 0.58)} responses)`
    },
    legend: {
      top: 0, left: 0, icon: 'rect', itemWidth: 10, itemHeight: 10,
      textStyle: { fontFamily: defaultFont, fontSize: 10, fontWeight: 600, color: TEXT_MUTED }
    },
    ...ChartTheme.statBarAxes({ fontFamily: defaultFont, fontSize: 10, color: TEXT_MUTED }, borderTone, 'Responses'),
    series: [
      { name: 'Strongly Disagree', type: 'bar', stack: 'total', data: [32.8], itemStyle: { color: palette[0], borderRadius: [4, 0, 0, 4] }, label: ChartTheme.statBarLabel() },
      { name: 'Disagree', type: 'bar', stack: 'total', data: [27.6], itemStyle: { color: palette[1] }, label: ChartTheme.statBarLabel() },
      { name: 'Agree', type: 'bar', stack: 'total', data: [24.1], itemStyle: { color: palette[2] }, label: ChartTheme.statBarLabel() },
      { name: 'Not Sur', type: 'bar', stack: 'total', data: [8.6], itemStyle: { color: palette[3] }, label: ChartTheme.statBarLabel() },
      { name: 'Strongly Agre', type: 'bar', stack: 'total', data: [6.9], itemStyle: { color: palette[4], borderRadius: [0, 4, 4, 0] }, label: ChartTheme.statBarLabel() }
    ]
  });

  // --- Card: "Last renewal hike?" / "Time to find tenant?" — standard-size
  // pies (ChartTheme.pieOption default radius + native top-left legend),
  // same as every other pie card on the site. Previously a 3-mini-pie
  // "Tenancy & Rental Dynamics" card with a custom HTML legend; the broker
  // pie was dropped so these 2 could sit at full standard size instead of
  // shrinking 3 across a single card. ---
  const pieTextStyle = { fontFamily: defaultFont, fontSize: 9, color: TEXT_MUTED };

  charts.pieHike = ChartTheme.init('ll-pie-hike');
  charts.pieHike.setOption(ChartTheme.pieOption([
    { value: 40, name: 'Up to 10%', itemStyle: { color: palette[0] } },
    { value: 5, name: '11–20%', itemStyle: { color: palette[1] } },
    { value: 5, name: 'No raise', itemStyle: { color: palette[2] } },
    { value: 2, name: 'Empty / NA', itemStyle: { color: palette[3] } },
    { value: 2, name: '>20%', itemStyle: { color: palette[4] } }
  ], pieTextStyle, { name: 'Last Hike' }));

  charts.pieSpeed = ChartTheme.init('ll-pie-speed');
  charts.pieSpeed.setOption(ChartTheme.pieOption([
    { value: 22, name: 'Few days', itemStyle: { color: palette[0] } },
    { value: 17, name: '1-2 weeks', itemStyle: { color: palette[1] } },
    { value: 11, name: '>1 month', itemStyle: { color: palette[2] } },
    { value: 6, name: 'Not vacant', itemStyle: { color: palette[4] } }
  ], pieTextStyle, { name: 'Vacancy Time' }));

  // --- Card: "Why did you raise the rent last time?" (dot matrix + legend) ---
  ChartTheme.buildDotMatrix(
    document.getElementById('ll-dot-matrix'),
    document.getElementById('ll-legend-matrix'),
    [
      { name: 'Rents in area went up', count: 16, color: palette[0] },
      { name: 'Other reasons', count: 10, color: palette[1] },
      { name: 'Charging low before / fixed', count: 9, color: palette[2] },
      { name: 'People ready to pay', count: 6, color: palette[3] },
      { name: 'Costs went up (tax/repairs)', count: 6, color: palette[4] },
      { name: 'Did not raise rent', count: 5, color: '#4a5b80' },
      { name: 'Metro / office nearby', count: 1, color: '#aab7d0' }
    ]
  );
};
