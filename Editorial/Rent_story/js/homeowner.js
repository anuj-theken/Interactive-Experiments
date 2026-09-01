/* ==========================================================================
   HOMEOWNER DASHBOARD — chart definitions
   ==========================================================================
   Exposes:
     window.homeownerCharts     — map of live ECharts instances (for resize)
     window.initHomeownerCharts — lazy-init entry point called once by main.js
   DOM ids consumed here are all prefixed `ho-` (see index.html).

   Every chart is rebuilt from window.SURVEY_DATA.homeowner (see js/data.js)
   through Aggregate (js/filters.js), driven by the Age/Career filter card
   mounted here via FilterUI, in its own top-row (no Area filter, and so no
   map to sit next to — homeowners weren't asked which part of the city
   they're in). With no filters applied, every number reproduces the
   dashboard's original hardcoded values exactly (verified against the raw
   CSV before this rewrite).
   ========================================================================== */

window.homeownerCharts = {};

window.initHomeownerCharts = function initHomeownerCharts() {
  const charts = window.homeownerCharts;
  const container = document.getElementById('panel-homeowner');

  const PALETTE = ['#9f6651', '#c27c63', '#cf9985', '#ddb7a9', '#ead1c8'];
  const TEXT_DARK = '#57382d';
  const TEXT_MUTED = '#6f6056';
  const BORDER_TONE = 'rgba(146, 93, 74, 0.14)';

  const commonTextStyle = {
    fontFamily: 'GT America, sans-serif',
    fontSize: 10,
    fontWeight: 300,
    color: TEXT_MUTED
  };

  const boldLabelStyle = { fontFamily: 'GT America Bold, sans-serif', fontWeight: 700 };

  charts.rentedBefore = ChartTheme.init('ho-chart-rented-before');
  charts.pushedBuy = ChartTheme.init('ho-chart-pushed-buy');
  charts.rentLimit = ChartTheme.init('ho-chart-rent-limit');
  charts.todayRents = ChartTheme.init('ho-chart-today-rents');
  charts.buyingPossible = ChartTheme.init('ho-chart-buying-possible');

  const RENTED_BEFORE_VALUES = ['Yes, for many years', 'Yes, for a short time', 'No, I moved into family property', 'No, I bought without ever renting here'];
  const RENTED_BEFORE_LABELS = ['Yes, many years', 'Yes, short time', 'Family property', 'Bought directly'];

  const PUSHED_BUY_VALUES = ['It was one of the reasons', 'Not much — I bought for other reasons', 'It was the main reason — I was tired of rent going up', 'Does not apply — I did not rent before buying'];
  const PUSHED_BUY_LABELS = ['One of reasons', 'Other reasons', 'Tired of rent up', 'Did not rent'];

  const RENT_LIMIT_VALUES = ['Strongly agree', 'Agree', 'Not sure', 'Disagree', 'Strongly disagree'];

  const TODAY_RENTS_VALUES = ['It is worse now, but I would still manage', 'Honestly, I would not be able to rent my old life today', 'About the same as my time', 'I do not know what rents are like now'];
  const TODAY_RENTS_LABELS = ['Worse, manage', 'Cannot afford', 'About same', 'Do not know'];

  const BUYING_POSSIBLE_VALUES = ['Hard, but possible', 'Almost impossible now', 'Yes, but only with help from family/friends', 'Yes, if they plan and save', "No chance at today's prices"];
  const BUYING_POSSIBLE_LABELS = ['Hard, possible', 'Impossible now', 'Family help', 'If plan/save', 'No chance'];
  const BUYING_POSSIBLE_COLORS = [PALETTE[1], PALETTE[0], PALETTE[2], PALETTE[3], PALETTE[4]];

  function render(records) {
    // --- "Before you owned a home, did you rent in Bengaluru?" ---
    const rentedBefore = Aggregate.tally(records, 'rentedBefore', RENTED_BEFORE_VALUES);
    charts.rentedBefore.setOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: {
        top: 0, left: 0, icon: 'rect', itemWidth: 10, itemHeight: 10,
        textStyle: commonTextStyle, data: [{ name: 'Respondents', itemStyle: { color: PALETTE[0] } }]
      },
      grid: { left: '0%', right: '3%', bottom: '0%', top: '15%', containLabel: true },
      xAxis: {
        type: 'category', data: RENTED_BEFORE_LABELS,
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
        data: rentedBefore.counts.map((v, i) => ({ value: v, itemStyle: { color: PALETTE[i] } })),
        itemStyle: { borderRadius: [4, 4, 0, 0] },
        label: { show: true, position: 'top', ...commonTextStyle, ...boldLabelStyle, color: TEXT_DARK }
      }]
    }, true);

    // --- "How much did rising rent push you to buy a home?" ---
    const pushedBuy = Aggregate.tally(records, 'pushedBuy', PUSHED_BUY_VALUES);
    charts.pushedBuy.setOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: {
        top: 0, left: 0, icon: 'rect', itemWidth: 10, itemHeight: 10,
        textStyle: commonTextStyle, data: [{ name: 'Respondents', itemStyle: { color: PALETTE[0] } }]
      },
      grid: { left: '0%', right: '3%', bottom: '0%', top: '15%', containLabel: true },
      xAxis: {
        type: 'category', data: PUSHED_BUY_LABELS,
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
        data: pushedBuy.counts.map((v, i) => ({ value: v, itemStyle: { color: PALETTE[i] } })),
        itemStyle: { borderRadius: [4, 4, 0, 0] },
        label: { show: true, position: 'top', ...commonTextStyle, ...boldLabelStyle, color: TEXT_DARK }
      }]
    }, true);

    // --- "Do you think Bengaluru should put a limit on how much rent can go up?" ---
    const rentLimit = Aggregate.tally(records, 'rentLimit', RENT_LIMIT_VALUES);
    const rentLimitPct = Aggregate.percentages(rentLimit.counts, rentLimit.total);
    charts.rentLimit.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
      legend: {
        top: 0, left: 0, icon: 'rect', itemWidth: 10, itemHeight: 10,
        textStyle: commonTextStyle,
        data: RENT_LIMIT_VALUES
      },
      ...ChartTheme.statBarAxes(commonTextStyle, BORDER_TONE, 'Limit Rent'),
      series: RENT_LIMIT_VALUES.map((name, i) => ({
        name, type: 'bar', stack: 'total', data: [rentLimitPct[i]],
        itemStyle: { color: PALETTE[i], ...(i === 0 ? { borderRadius: [4, 0, 0, 4] } : {}), ...(i === RENT_LIMIT_VALUES.length - 1 ? { borderRadius: [0, 4, 4, 0] } : {}) },
        label: ChartTheme.statBarLabel()
      }))
    }, true);

    // --- "Compared to what you once paid, how do today's rents look?" ---
    const todayRents = Aggregate.tally(records, 'todayRents', TODAY_RENTS_VALUES);
    charts.todayRents.setOption(ChartTheme.pieOption(
      TODAY_RENTS_LABELS.map((name, i) => ({ value: todayRents.counts[i], name, itemStyle: { color: PALETTE[i] } })),
      commonTextStyle, { name: 'Today Rents', legendRows: 3 }
    ), true);

    // --- "Do you think buying a home is still possible for young renters today?" ---
    const buyingPossible = Aggregate.tally(records, 'buyingPossible', BUYING_POSSIBLE_VALUES);
    charts.buyingPossible.setOption(ChartTheme.pieOption(
      BUYING_POSSIBLE_LABELS.map((name, i) => ({ value: buyingPossible.counts[i], name, itemStyle: { color: BUYING_POSSIBLE_COLORS[i] } })),
      commonTextStyle, { name: 'Buying Possible', legendRows: 3 }
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
      document.getElementById('ho-responses'),
      document.getElementById('ho-pagination'),
      items,
      { emptyText: 'No homeowner responses match these filters.' }
    );
  }

  function toggleView(view) {
    const chartsView = document.getElementById('ho-charts-view');
    const responsesView = document.getElementById('ho-responses-view');
    chartsView.style.display = view === 'charts' ? '' : 'none';
    responsesView.style.display = view === 'responses' ? '' : 'none';
    if (view === 'charts') {
      FilterUI.replayEnter(chartsView.querySelector('.dashboard-grid'));
      requestAnimationFrame(() => Object.values(charts).forEach((c) => c && !c.isDisposed() && c.resize()));
    } else {
      FilterUI.replayEnter(responsesView);
    }
  }

  function applyFilters(filters) {
    const records = Aggregate.filterRecords(window.SURVEY_DATA.homeowner, filters);
    render(records);
    renderResponses(records);
  }

  const filterCard = FilterUI.buildFilterCard({
    hasRegion: false,
    // No homeowner respondent is a Student — that pill would be a dead end.
    careerOptions: Aggregate.optionsWithData(window.SURVEY_DATA.homeowner, 'career', Aggregate.CAREER_OPTIONS),
    title: 'Filter Homeowner Responses',
    subtitle: 'Select an age group or career stage — every chart and the Suggestions tab below both narrow to match.',
    onFilterChange: applyFilters
  });
  document.getElementById('ho-top-row').appendChild(filterCard.el);

  // Homeowner's subjective field ("What would you tell a young renter in
  // Bengaluru today?") is advice, not a complaint — "Suggestions" fits it
  // better than the generic "Responses" label the other 3 dashboards use.
  FilterUI.mountSectionTabs(container, { labels: ['Charts', 'Suggestions'], onViewChange: toggleView });

  applyFilters({});
};
