/* ==========================================================================
   NON-RESIDENT DASHBOARD — chart definitions
   ==========================================================================
   Exposes:
     window.nonresidentCharts     — map of live ECharts instances (for resize)
     window.initNonresidentCharts — lazy-init entry point called by main.js
   DOM ids consumed here are all prefixed `nr-` (see index.html).

   Every chart is rebuilt from window.SURVEY_DATA.nonresident (see
   js/data.js) through Aggregate (js/filters.js), driven by the Age/Career
   filter card mounted here via FilterUI, in its own top-row (no Area
   filter, and so no map to sit next to — non-residents don't live in
   Bengaluru, so there's no "which part of the city" to ask). Several
   charts here bucket 2+ raw survey answers into one shared slice
   (see the *_GROUPS constants) — those groupings, and the one stray answer
   each of the two "said no" columns drops (a single "I thought about it
   hard, but went anyway" / free-floating response neither column's 4
   buckets was designed to hold), were reverse-engineered from this
   dashboard's original hardcoded numbers against the raw CSV before this
   rewrite, and reproduce them exactly with no filters applied.
   ========================================================================== */

window.nonresidentCharts = {};

window.initNonresidentCharts = function initNonresidentCharts() {
  const charts = window.nonresidentCharts;
  const container = document.getElementById('panel-nonresident');

  const fontStyle = { fontFamily: 'GT America', fontWeight: 300, fontSize: 10, color: '#3d4128' };
  const fontStyleBold = { fontFamily: 'GT America Bold', fontWeight: 700 };
  const TEXT_MUTED = '#636454';
  const BORDER_TONE = 'rgba(101, 108, 68, 0.14)';
  const palette = ['#6f764a', '#87905a', '#a1a87e', '#bdc2a4', '#d5d8c5'];

  charts.topLeft = ChartTheme.init('nr-chart-top-left');
  charts.topRight = ChartTheme.init('nr-chart-top-right');
  charts.bottomRight1 = ChartTheme.init('nr-chart-bottom-right-1');
  charts.bottomRight2 = ChartTheme.init('nr-chart-bottom-right-2');

  const TOP_LEFT_LABELS = ['Yes / Direct', 'Paused / Thought', 'No / Never', 'N/A / Encouraged'];

  const SAID_NO_GROUPS = [
    ['Yes — I turned down or avoided a Bengaluru move over cost'],
    ['It made me pause, but was not the deciding factor'],
    ['No, cost never came into it'],
    ['Does not apply — I never had the chance']
  ].map((raws, i) => [TOP_LEFT_LABELS[i], raws]);

  const TOLD_OTHERS_GROUPS = [
    ['Yes, more than once', 'Yes, once'],
    ['No, but I have thought about it'],
    ['No, never'],
    ['I would actually tell them to go, rent or not']
  ].map((raws, i) => [TOP_LEFT_LABELS[i], raws]);

  const OFTEN_VALUES = ['All the time — it is the first thing people mention', 'Fairly often', 'Once in a while', 'Rarely', 'I never hear about it'];
  const OFTEN_LABELS = ['All the time', 'Fairly often', 'Once in a while', 'Rarely', 'I never hear about it'];

  const LOWER_RENT_GROUPS = [
    ['Yes, main holding factor', ['Yes, rent is the main thing holding me back']],
    ['Maybe, with other factors', ['Maybe, along with a few other things']],
    ['No, rent is not why I stay away', ['No, rent is not why I stay away']],
    ['Would never move there anyway', ['I would never move there anyway']]
  ];
  const LOWER_RENT_COLORS = [palette[0], palette[1], palette[2], palette[4]];

  const OWN_CITY_GROUPS = [
    ['Manageable/Affordable', ['No, rent is manageable here', 'No, rent is affordable where I live']],
    ['Yes, just as bad', ['Yes, just as bad as Bengaluru sounds']],
    ['Yes, but not as bad', ['Yes, but not as bad']]
  ];

  const COMPARE_CITY_GROUPS = [
    ['Unknown/Left BLR', ['I do not know how they compare', 'I used to live in Bengaluru — the rent is why I left']],
    ['About the same', ['About the same']],
    ['My city is worse', ['My city is actually worse']],
    ['BLR is much worse', ['Much worse than where I live']]
  ];

  function render(records) {
    // --- "Impact on Personal Choice vs. Advice to Others" ---
    const saidNo = Aggregate.tallyGrouped(records, 'saidNo', SAID_NO_GROUPS);
    const toldOthers = Aggregate.tallyGrouped(records, 'toldOthers', TOLD_OTHERS_GROUPS);
    charts.topLeft.setOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { left: '0%', top: 0, orient: 'horizontal', textStyle: fontStyle, itemWidth: 10, itemHeight: 10 },
      grid: { left: '0%', right: '3%', bottom: '3%', top: '22%', containLabel: true },
      xAxis: {
        type: 'category',
        data: TOP_LEFT_LABELS,
        axisLabel: { ...fontStyleBold, fontSize: 9.5, color: '#3d4128', align: 'center' },
        axisLine: { lineStyle: { color: '#a1a87e' } }
      },
      yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed', color: 'rgba(0,0,0,0.08)' } }, axisLabel: { fontSize: 9 } },
      series: [
        {
          name: 'Said No to Move/Job', type: 'bar', itemStyle: { color: palette[0], borderRadius: [4, 4, 0, 0] }, data: saidNo.counts,
          label: { show: true, position: 'top', ...fontStyleBold, fontSize: 9, color: '#3d4128' }
        },
        {
          name: 'Told Others Not to Move', type: 'bar', itemStyle: { color: palette[2], borderRadius: [4, 4, 0, 0] }, data: toldOthers.counts,
          label: { show: true, position: 'top', ...fontStyleBold, fontSize: 9, color: '#3d4128' }
        }
      ]
    }, true);

    // --- "Frequency of Cost of Living Discussions" ---
    const often = Aggregate.tally(records, 'oftenComesUp', OFTEN_VALUES);
    const oftenPct = Aggregate.percentages(often.counts, often.total);
    charts.topRight.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
      legend: {
        top: 0, left: 0, icon: 'rect', itemWidth: 10, itemHeight: 10,
        textStyle: { ...fontStyle, color: TEXT_MUTED }
      },
      ...ChartTheme.statBarAxes({ ...fontStyle, color: TEXT_MUTED }, BORDER_TONE, 'Mentions'),
      series: OFTEN_LABELS.map((name, i) => ({
        name, type: 'bar', stack: 'total', itemStyle: { color: palette[i], ...(i === 0 ? { borderRadius: [4, 0, 0, 4] } : {}), ...(i === OFTEN_LABELS.length - 1 ? { borderRadius: [0, 4, 4, 0] } : {}) }, data: [oftenPct[i]], label: ChartTheme.statBarLabel()
      }))
    }, true);

    // --- "Would Lower Rent Make You Consider Moving?" (dot matrix) ---
    const lowerRent = Aggregate.tallyGrouped(records, 'lowerRentMove', LOWER_RENT_GROUPS);
    ChartTheme.buildDotMatrix(
      document.getElementById('nr-dot-matrix'),
      document.getElementById('nr-legend-matrix'),
      LOWER_RENT_GROUPS.map(([name], i) => ({ name, count: lowerRent.counts[i], color: LOWER_RENT_COLORS[i] }))
    );

    // --- "In your own city, is rent a big worry too?" ---
    const ownCity = Aggregate.tallyGrouped(records, 'ownCityWorry', OWN_CITY_GROUPS);
    charts.bottomRight1.setOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: '0%', right: '10%', bottom: '5%', top: '5%', containLabel: true },
      xAxis: { type: 'value', show: false },
      yAxis: {
        type: 'category',
        data: OWN_CITY_GROUPS.map((g) => g[0]),
        axisLabel: { ...fontStyleBold, fontSize: 9, color: '#3d4128', align: 'right' },
        axisLine: { show: false }, axisTick: { show: false }
      },
      series: [{
        type: 'bar', data: ownCity.counts, itemStyle: { color: palette[1], borderRadius: [0, 4, 4, 0] },
        label: { show: true, position: 'right', ...fontStyleBold, fontSize: 9, color: '#3d4128' }
      }]
    }, true);

    // --- "How do Bengaluru's rents compare to your city?" ---
    const compareCity = Aggregate.tallyGrouped(records, 'compareCity', COMPARE_CITY_GROUPS);
    charts.bottomRight2.setOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: '0%', right: '10%', bottom: '5%', top: '5%', containLabel: true },
      xAxis: { type: 'value', show: false },
      yAxis: {
        type: 'category',
        data: COMPARE_CITY_GROUPS.map((g) => g[0]),
        axisLabel: { ...fontStyleBold, fontSize: 9, color: '#3d4128', align: 'right' },
        axisLine: { show: false }, axisTick: { show: false }
      },
      series: [{
        type: 'bar', data: compareCity.counts, itemStyle: { color: palette[2], borderRadius: [0, 4, 4, 0] },
        label: { show: true, position: 'right', ...fontStyleBold, fontSize: 9, color: '#3d4128' }
      }]
    }, true);
  }

  function renderResponses(records) {
    const items = records
      .filter((r) => r.subjective)
      .map((r) => ({
        quote: r.subjective,
        meta: (r.age || 'Age not specified') + ' • ' + (r.career ? Aggregate.shortCareer(r.career) : 'Career not specified')
      }));
    FilterUI.mountResponses(
      document.getElementById('nr-responses'),
      document.getElementById('nr-pagination'),
      items,
      { emptyText: 'No non-resident responses match these filters.' }
    );
  }

  function toggleView(view) {
    const chartsView = document.getElementById('nr-charts-view');
    const responsesView = document.getElementById('nr-responses-view');
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
    const records = Aggregate.filterRecords(window.SURVEY_DATA.nonresident, filters);
    render(records);
    renderResponses(records);
  }

  const filterCard = FilterUI.buildFilterCard({
    hasRegion: false,
    ageOptions: Aggregate.optionsWithData(window.SURVEY_DATA.nonresident, 'age', Aggregate.AGE_OPTIONS),
    careerOptions: Aggregate.optionsWithData(window.SURVEY_DATA.nonresident, 'career', Aggregate.CAREER_OPTIONS),
    title: 'Filter Non-Resident Responses',
    subtitle: 'Select an age group or career stage — every chart and the Responses tab below both narrow to match.',
    onFilterChange: applyFilters
  });
  document.getElementById('nr-top-row').appendChild(filterCard.el);

  FilterUI.mountSectionTabs(container, { onViewChange: toggleView });

  applyFilters({});
};
