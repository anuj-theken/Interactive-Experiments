/* ==========================================================================
   NON-RESIDENT DASHBOARD — chart definitions
   ==========================================================================
   Exposes:
     window.nonresidentCharts     — map of live ECharts instances (for resize)
     window.initNonresidentCharts — lazy-init entry point called by main.js
   DOM ids consumed here are all prefixed `nr-` (see index.html).
   ========================================================================== */

window.nonresidentCharts = {};

window.initNonresidentCharts = function initNonresidentCharts() {
  const charts = window.nonresidentCharts;

  const fontStyle = { fontFamily: 'GT America', fontWeight: 300, fontSize: 10, color: '#3d4128' };
  const fontStyleBold = { fontFamily: 'GT America Bold', fontWeight: 700 };
  const TEXT_MUTED = '#636454';
  const BORDER_TONE = 'rgba(101, 108, 68, 0.14)';
  const palette = ['#6f764a', '#87905a', '#a1a87e', '#bdc2a4', '#d5d8c5'];

  // --- Card: "Impact on Personal Choice vs. Advice to Others" ---
  charts.topLeft = ChartTheme.init('nr-chart-top-left');
  charts.topLeft.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { left: '0%', top: 0, orient: 'horizontal', textStyle: fontStyle, itemWidth: 10, itemHeight: 10 },
    grid: { left: '0%', right: '3%', bottom: '3%', top: '22%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['Yes / Direct', 'Paused / Thought', 'No / Never', 'N/A / Encouraged'],
      axisLabel: { ...fontStyleBold, fontSize: 9.5, color: '#3d4128', align: 'center' },
      axisLine: { lineStyle: { color: '#a1a87e' } }
    },
    yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed', color: 'rgba(0,0,0,0.08)' } }, axisLabel: { fontSize: 9 } },
    series: [
      {
        name: 'Said No to Move/Job', type: 'bar', itemStyle: { color: palette[0], borderRadius: [4, 4, 0, 0] }, data: [16, 18, 15, 19],
        label: { show: true, position: 'top', ...fontStyleBold, fontSize: 9, color: '#3d4128' }
      },
      {
        name: 'Told Others Not to Move', type: 'bar', itemStyle: { color: palette[2], borderRadius: [4, 4, 0, 0] }, data: [28, 15, 20, 7],
        label: { show: true, position: 'top', ...fontStyleBold, fontSize: 9, color: '#3d4128' }
      }
    ]
  });

  // --- Card: "Frequency of Cost of Living Discussions" ---
  // Shared "single-row 100% stacked bar" spec (ChartTheme.statBarAxes): a
  // real 0-100% axis with dashed gridlines, so this bar is the same length
  // as ho-chart-rent-limit / ll-chart-rent-cap / tn-chart-rent-limit — data
  // normalized to % of the 68 non-residents who answered this question.
  charts.topRight = ChartTheme.init('nr-chart-top-right');
  charts.topRight.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
    legend: {
      top: 0, left: 0, icon: 'rect', itemWidth: 10, itemHeight: 10,
      textStyle: { ...fontStyle, color: TEXT_MUTED }
    },
    ...ChartTheme.statBarAxes({ ...fontStyle, color: TEXT_MUTED }, BORDER_TONE, 'Mentions'),
    series: [
      { name: 'All the time', type: 'bar', stack: 'total', itemStyle: { color: palette[0], borderRadius: [4, 0, 0, 4] }, data: [29.41], label: ChartTheme.statBarLabel() },
      { name: 'Fairly often', type: 'bar', stack: 'total', itemStyle: { color: palette[1] }, data: [51.47], label: ChartTheme.statBarLabel() },
      { name: 'Once in a while', type: 'bar', stack: 'total', itemStyle: { color: palette[2] }, data: [11.76], label: ChartTheme.statBarLabel() },
      { name: 'Rarely', type: 'bar', stack: 'total', itemStyle: { color: palette[3] }, data: [2.94], label: ChartTheme.statBarLabel() },
      { name: 'I never hear about it', type: 'bar', stack: 'total', itemStyle: { color: palette[4], borderRadius: [0, 4, 4, 0] }, data: [4.41], label: ChartTheme.statBarLabel() }
    ]
  });

  // --- Card: "Would Lower Rent Make You Consider Moving?" (dot matrix) ---
  // Uses the shared ChartTheme.buildDotMatrix (plain DOM dots, equal x/y gap
  // via CSS `gap`) — the same implementation as Landlord's and Tenant's dot
  // matrices, so all 3 look and behave identically.
  ChartTheme.buildDotMatrix(
    document.getElementById('nr-dot-matrix'),
    document.getElementById('nr-legend-matrix'),
    [
      { name: 'Yes, main holding factor', count: 4, color: palette[0] },
      { name: 'Maybe, with other factors', count: 31, color: palette[1] },
      { name: 'No, rent is not why I stay away', count: 25, color: palette[2] },
      { name: 'Would never move there anyway', count: 9, color: palette[4] }
    ]
  );

  // --- Card: "In your own city, is rent a big worry too?" ---
  charts.bottomRight1 = ChartTheme.init('nr-chart-bottom-right-1');
  charts.bottomRight1.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '0%', right: '10%', bottom: '5%', top: '5%', containLabel: true },
    xAxis: { type: 'value', show: false },
    yAxis: {
      type: 'category',
      data: ['Manageable/Affordable', 'Yes, just as bad', 'Yes, but not as bad'],
      axisLabel: { ...fontStyleBold, fontSize: 9, color: '#3d4128', align: 'right' },
      axisLine: { show: false }, axisTick: { show: false }
    },
    series: [{
      type: 'bar', data: [23, 24, 25], itemStyle: { color: palette[1], borderRadius: [0, 4, 4, 0] },
      label: { show: true, position: 'right', ...fontStyleBold, fontSize: 9, color: '#3d4128' }
    }]
  });

  // --- Card: "How do Bengaluru's rents compare to your city?" ---
  charts.bottomRight2 = ChartTheme.init('nr-chart-bottom-right-2');
  charts.bottomRight2.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '0%', right: '10%', bottom: '5%', top: '5%', containLabel: true },
    xAxis: { type: 'value', show: false },
    yAxis: {
      type: 'category',
      data: ['Unknown/Left BLR', 'About the same', 'My city is worse', 'BLR is much worse'],
      axisLabel: { ...fontStyleBold, fontSize: 9, color: '#3d4128', align: 'right' },
      axisLine: { show: false }, axisTick: { show: false }
    },
    series: [{
      type: 'bar', data: [9, 14, 17, 31], itemStyle: { color: palette[2], borderRadius: [0, 4, 4, 0] },
      label: { show: true, position: 'right', ...fontStyleBold, fontSize: 9, color: '#3d4128' }
    }]
  });
};
