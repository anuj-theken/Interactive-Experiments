/* ==========================================================================
   HOMEOWNER DASHBOARD — chart definitions
   ==========================================================================
   Exposes:
     window.homeownerCharts     — map of live ECharts instances (for resize)
     window.initHomeownerCharts — lazy-init entry point called once by main.js
   DOM ids consumed here are all prefixed `ho-` (see index.html).
   ========================================================================== */

window.homeownerCharts = {};

window.initHomeownerCharts = function initHomeownerCharts() {
  const charts = window.homeownerCharts;

  const PALETTE = ['#6b2d18', '#99472a', '#c26946', '#e09170', '#f2beaa'];
  const TEXT_DARK = '#2c201a';
  const TEXT_MUTED = '#786960';
  const BORDER_TONE = 'rgba(60, 40, 30, 0.08)';

  const commonTextStyle = {
    fontFamily: 'GT America, sans-serif',
    fontSize: 10,
    fontWeight: 300,
    color: TEXT_MUTED
  };

  const boldLabelStyle = { fontFamily: 'GT America Bold, sans-serif', fontWeight: 700 };

  // --- Card: "Before you owned a home, did you rent in Bengaluru?" ---
  charts.rentedBefore = ChartTheme.init('ho-chart-rented-before');
  charts.rentedBefore.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: {
      top: 0, left: 0, icon: 'rect', itemWidth: 10, itemHeight: 10,
      textStyle: commonTextStyle, data: [{ name: 'Respondents', itemStyle: { color: PALETTE[0] } }]
    },
    grid: { left: '0%', right: '3%', bottom: '0%', top: '15%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['Yes, many years', 'Yes, short time', 'Family property', 'Bought directly'],
      axisLine: { lineStyle: { color: BORDER_TONE } },
      axisTick: { show: false },
      axisLabel: { ...commonTextStyle, interval: 0 }
    },
    yAxis: {
      type: 'value', axisLine: { show: false }, axisTick: { show: false },
      splitLine: { lineStyle: { type: 'dashed', color: BORDER_TONE } },
      axisLabel: commonTextStyle
    },
    series: [{
      name: 'Respondents', type: 'bar', barWidth: '36%',
      data: [
        { value: 54, itemStyle: { color: PALETTE[0] } },
        { value: 17, itemStyle: { color: PALETTE[1] } },
        { value: 11, itemStyle: { color: PALETTE[2] } },
        { value: 2, itemStyle: { color: PALETTE[3] } }
      ],
      itemStyle: { borderRadius: [4, 4, 0, 0] },
      label: { show: true, position: 'top', ...commonTextStyle, ...boldLabelStyle, color: TEXT_DARK }
    }]
  });

  // --- Card: "How much did rising rent push you to buy a home?" ---
  charts.pushedBuy = ChartTheme.init('ho-chart-pushed-buy');
  charts.pushedBuy.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: {
      top: 0, left: 0, icon: 'rect', itemWidth: 10, itemHeight: 10,
      textStyle: commonTextStyle, data: [{ name: 'Respondents', itemStyle: { color: PALETTE[0] } }]
    },
    grid: { left: '0%', right: '3%', bottom: '0%', top: '15%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['One of reasons', 'Other reasons', 'Tired of rent up', 'Did not rent'],
      axisLine: { lineStyle: { color: BORDER_TONE } },
      axisTick: { show: false },
      axisLabel: { ...commonTextStyle, interval: 0 }
    },
    yAxis: {
      type: 'value', axisLine: { show: false }, axisTick: { show: false },
      splitLine: { lineStyle: { type: 'dashed', color: BORDER_TONE } },
      axisLabel: commonTextStyle
    },
    series: [{
      name: 'Respondents', type: 'bar', barWidth: '36%',
      data: [
        { value: 31, itemStyle: { color: PALETTE[0] } },
        { value: 29, itemStyle: { color: PALETTE[1] } },
        { value: 11, itemStyle: { color: PALETTE[2] } },
        { value: 11, itemStyle: { color: PALETTE[3] } }
      ],
      itemStyle: { borderRadius: [4, 4, 0, 0] },
      label: { show: true, position: 'top', ...commonTextStyle, ...boldLabelStyle, color: TEXT_DARK }
    }]
  });

  // --- Card: "Do you think Bengaluru should put a limit on how much rent can go up?" ---
  // Shared "single-row 100% stacked bar" spec (ChartTheme.statBarAxes): a
  // real 0-100% axis with dashed gridlines, so this bar is the same length
  // as ll-chart-rent-cap / tn-chart-rent-limit / nr-chart-top-right — data
  // is normalized to % of the 81 homeowner respondents who answered this
  // (same percentages as Overview's "Own Home" row).
  charts.rentLimit = ChartTheme.init('ho-chart-rent-limit');
  charts.rentLimit.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
    legend: {
      top: 0, left: 0, icon: 'rect', itemWidth: 10, itemHeight: 10,
      textStyle: commonTextStyle,
      data: ['Strongly agree', 'Agree', 'Not sure', 'Disagree', 'Strongly disagree']
    },
    ...ChartTheme.statBarAxes(commonTextStyle, BORDER_TONE, 'Limit Rent'),
    series: [
      { name: 'Strongly agree', type: 'bar', stack: 'total', data: [23.46], itemStyle: { color: PALETTE[0], borderRadius: [4, 0, 0, 4] }, label: ChartTheme.statBarLabel() },
      { name: 'Agree', type: 'bar', stack: 'total', data: [27.16], itemStyle: { color: PALETTE[1] }, label: ChartTheme.statBarLabel() },
      { name: 'Not sure', type: 'bar', stack: 'total', data: [9.88], itemStyle: { color: PALETTE[2] }, label: ChartTheme.statBarLabel() },
      { name: 'Disagree', type: 'bar', stack: 'total', data: [19.75], itemStyle: { color: PALETTE[3] }, label: ChartTheme.statBarLabel() },
      { name: 'Strongly disagree', type: 'bar', stack: 'total', data: [19.75], itemStyle: { color: PALETTE[4], borderRadius: [0, 4, 4, 0] }, label: ChartTheme.statBarLabel() }
    ]
  });

  // --- Card: "Compared to what you once paid, how do today's rents look?" ---
  charts.todayRents = ChartTheme.init('ho-chart-today-rents');
  charts.todayRents.setOption(ChartTheme.pieOption([
    { value: 35, name: 'Worse, manage', itemStyle: { color: PALETTE[0] } },
    { value: 25, name: 'Cannot afford', itemStyle: { color: PALETTE[1] } },
    { value: 11, name: 'About same', itemStyle: { color: PALETTE[2] } },
    { value: 10, name: 'Do not know', itemStyle: { color: PALETTE[3] } }
  ], commonTextStyle, { name: 'Today Rents' }));

  // --- Card: "Do you think buying a home is still possible for young renters today?" ---
  // "Impossible now" gets the darkest shade — the most negative/definitive
  // answer on this scale.
  charts.buyingPossible = ChartTheme.init('ho-chart-buying-possible');
  charts.buyingPossible.setOption(ChartTheme.pieOption([
    { value: 34, name: 'Hard, possible', itemStyle: { color: PALETTE[1] } },
    { value: 17, name: 'Impossible now', itemStyle: { color: PALETTE[0] } },
    { value: 15, name: 'Family help', itemStyle: { color: PALETTE[2] } },
    { value: 15, name: 'If plan/save', itemStyle: { color: PALETTE[3] } },
    { value: 2, name: 'No chance', itemStyle: { color: PALETTE[4] } }
  ], commonTextStyle, { name: 'Buying Possible' }));
};
