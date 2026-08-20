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
   ========================================================================== */

window.tenantCharts = {};

window.initTenantCharts = function initTenantCharts() {
  const charts = window.tenantCharts;

  const PALETTE = ['#0e3d3a', '#1c5955', '#3c7d78', '#6ca39d', '#9fc7c1', '#cde3df'];
  const TEXT_DARK = '#123330';
  const TEXT_MUTED = '#4f6b67';
  const BORDER_TONE = 'rgba(20, 55, 50, 0.12)';

  const commonTextStyle = {
    fontFamily: 'GT America, sans-serif',
    fontSize: 10,
    fontWeight: 300,
    color: TEXT_MUTED
  };

  // --- Card: "Security Deposit Paid" ---
  charts.deposit = ChartTheme.init('tn-chart-deposit');
  charts.deposit.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '0%', right: '3%', bottom: '0%', top: '8%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['1–2m', '3–5m', '6–8m', '9–10m', '>10m'],
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
      data: [
        { value: 45, itemStyle: { color: PALETTE[0] } },
        { value: 204, itemStyle: { color: PALETTE[1] } },
        { value: 85, itemStyle: { color: PALETTE[2] } },
        { value: 18, itemStyle: { color: PALETTE[3] } },
        { value: 13, itemStyle: { color: PALETTE[4] } }
      ],
      itemStyle: { borderRadius: [4, 4, 0, 0] },
      label: { show: true, position: 'top', ...commonTextStyle, fontFamily: 'GT America Bold, sans-serif', fontWeight: 700, color: TEXT_DARK }
    }]
  });

  // --- Card: "Monthly Rent Share" ---
  charts.payShare = ChartTheme.init('tn-chart-pay-share');
  charts.payShare.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '0%', right: '3%', bottom: '0%', top: '8%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['<20%', '20–30%', '30–40%', '40–50%', '>50%'],
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
      data: [
        { value: 173, itemStyle: { color: PALETTE[0] } },
        { value: 147, itemStyle: { color: PALETTE[1] } },
        { value: 28, itemStyle: { color: PALETTE[2] } },
        { value: 8, itemStyle: { color: PALETTE[3] } },
        { value: 3, itemStyle: { color: PALETTE[4] } }
      ],
      itemStyle: { borderRadius: [4, 4, 0, 0] },
      label: { show: true, position: 'top', ...commonTextStyle, fontFamily: 'GT America Bold, sans-serif', fontWeight: 700, color: TEXT_DARK }
    }]
  });

  // --- Card: "Biggest Reason Rents Have Risen" (dot matrix + explicit legend) ---
  // Uses the shared ChartTheme.buildDotMatrix — same implementation as
  // Landlord's and Non-Resident's dot matrices. Each dot stands in for
  // ~3 raw responses (145 responses would be too many dots to render
  // legibly); `label` keeps the legend showing the true raw count.
  ChartTheme.buildDotMatrix(
    document.getElementById('tn-dot-matrix'),
    document.getElementById('tn-legend-reasons'),
    [
      { name: 'Landlords taking advantage', count: 48, label: 145, color: PALETTE[0] },
      { name: 'Too many people moving', count: 34, label: 101, color: PALETTE[1] },
      { name: 'High IT salaries', count: 19, label: 57, color: PALETTE[2] },
      { name: 'Not enough housing', count: 12, label: 35, color: PALETTE[3] },
      { name: 'Brokers / Others', count: 7, label: 21, color: PALETTE[4] }
    ]
  );

  // --- Card: "When Landlords Last Hiked Rent" (treemap) ---
  charts.treemap = ChartTheme.init('tn-chart-treemap');
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
      itemStyle: { borderColor: '#e3edeb', borderWidth: 2, gapWidth: 2 },
      data: [
        { name: 'Paid, no discussion', value: 162, itemStyle: { color: PALETTE[0] } },
        { name: 'Pushed back (no budge)', value: 72, itemStyle: { color: PALETTE[1] } },
        { name: 'Negotiated down', value: 61, itemStyle: { color: PALETTE[2] } },
        { name: 'No hike faced', value: 48, itemStyle: { color: PALETTE[3] } },
        { name: 'Moved out over hike', value: 17, itemStyle: { color: PALETTE[4] } }
      ]
    }]
  });

  // --- Card: "Rent Cap Support" ---
  // Shared "single-row 100% stacked bar" spec (ChartTheme.statBarAxes): a
  // real 0-100% axis with dashed gridlines, so this bar is the same length
  // as ho-chart-rent-limit / nr-chart-top-right / ll-chart-rent-cap — data
  // normalized to % of the 349 tenants who answered this question (same
  // percentages as Overview's "Pay Rent" row).
  charts.rentLimit = ChartTheme.init('tn-chart-rent-limit');
  charts.rentLimit.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
    legend: {
      top: 0, left: 0, icon: 'rect', itemWidth: 10, itemHeight: 10,
      textStyle: commonTextStyle,
      data: ['Strongly agree', 'Agree', 'Not sure', 'Disagree', 'Strongly disagree']
    },
    ...ChartTheme.statBarAxes(commonTextStyle, BORDER_TONE, 'Responses'),
    series: [
      { name: 'Strongly agree', type: 'bar', stack: 'total', data: [64.18], itemStyle: { color: PALETTE[0], borderRadius: [4, 0, 0, 4] }, label: ChartTheme.statBarLabel() },
      { name: 'Agree', type: 'bar', stack: 'total', data: [18.62], itemStyle: { color: PALETTE[1] }, label: ChartTheme.statBarLabel() },
      { name: 'Not sure', type: 'bar', stack: 'total', data: [5.44], itemStyle: { color: PALETTE[2] }, label: ChartTheme.statBarLabel() },
      { name: 'Disagree', type: 'bar', stack: 'total', data: [6.30], itemStyle: { color: PALETTE[3] }, label: ChartTheme.statBarLabel() },
      { name: 'Strongly disagree', type: 'bar', stack: 'total', data: [5.44], itemStyle: { color: PALETTE[4], borderRadius: [0, 4, 4, 0] }, label: ChartTheme.statBarLabel() }
    ]
  });

  // --- Card: "Max Rent Before Leaving City" (diverging horizontal bar) ---
  // Deliberately bipolar: "would leave" thresholds read in a muted warning
  // tone, "would stay" thresholds in the theme ramp — the one chart on the
  // page allowed off-ramp since the data itself is two opposed directions.
  charts.leaveRent = ChartTheme.init('tn-chart-leave-rent');
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
      data: ['Past limit', 'Another 10% out', 'Another 25%', 'Never leave', 'Pay whatever'],
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
      data: [
        { value: -65, itemStyle: { color: '#b1615c', borderRadius: [4, 0, 0, 4] }, label: { position: 'left' } },
        { value: -67, itemStyle: { color: '#c1817d', borderRadius: [4, 0, 0, 4] }, label: { position: 'left' } },
        { value: -102, itemStyle: { color: '#a24842', borderRadius: [4, 0, 0, 4] }, label: { position: 'left' } },
        { value: 95, itemStyle: { color: PALETTE[1], borderRadius: [0, 4, 4, 0] }, label: { position: 'right' } },
        { value: 42, itemStyle: { color: PALETTE[0], borderRadius: [0, 4, 4, 0] }, label: { position: 'right' } }
      ]
    }]
  });

  // --- Card: "Landlord Hike Reactions" ---
  charts.hikePie = ChartTheme.init('tn-chart-hike-pie');
  charts.hikePie.setOption(ChartTheme.pieOption([
    { value: 162, name: 'Paid, no discussion', itemStyle: { color: PALETTE[0] } },
    { value: 72, name: 'Pushed back', itemStyle: { color: PALETTE[1] } },
    { value: 61, name: 'Negotiated down', itemStyle: { color: PALETTE[2] } },
    { value: 48, name: "Haven't faced hike", itemStyle: { color: PALETTE[3] } },
    { value: 17, name: 'Walked / moved out', itemStyle: { color: PALETTE[4] } }
  ], commonTextStyle, { name: 'Hike Outcome' }));

  // --- Card: "Moving & Coping Trade-offs" ---
  charts.copingPie = ChartTheme.init('tn-chart-coping-pie');
  charts.copingPie.setOption(ChartTheme.pieOption([
    { value: 122, name: 'Delayed financial goals', itemStyle: { color: PALETTE[0] } },
    { value: 91, name: 'Downgraded place', itemStyle: { color: PALETTE[1] } },
    { value: 82, name: 'Longer commute', itemStyle: { color: PALETTE[2] } },
    { value: 76, name: 'Dipped into savings', itemStyle: { color: PALETTE[3] } },
    { value: 40, name: 'Took on flatmates', itemStyle: { color: PALETTE[4] } },
    { value: 119, name: 'None of these', itemStyle: { color: PALETTE[5] } }
  ], commonTextStyle, { name: 'Coping Mechanisms' }));
};
