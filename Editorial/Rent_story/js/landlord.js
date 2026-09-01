/* ==========================================================================
   LANDLORD DASHBOARD — chart + map definitions
   ==========================================================================
   Exposes:
     window.landlordCharts     — map of live ECharts instances (for resize)
     window.landlordMap        — the Leaflet map instance (for invalidateSize)
     window.initLandlordCharts — lazy-init entry point called once by main.js
   DOM ids consumed here are all prefixed `ll-` (see index.html).
   Palette is the cream/tan-camel theme, sampled from landlord.png (see
   css/dashboard.css section 3 for the full set of per-dashboard themes).

   Every chart (and the map) is rebuilt from window.SURVEY_DATA.landlord (see
   js/data.js) through Aggregate (js/filters.js), driven by the Age/Career/
   Area filter card mounted here via FilterUI, in the top-row next to the
   map. The map doubles as the "Area" filter control: its markers stay live
   (recolored/resized to the filtered counts) and clicking one sets the Area
   pill to that region — click the same marker again (or its pill) to clear
   it back to "All". With no filters applied, every number reproduces the
   dashboard's original hardcoded values exactly (verified against the raw
   CSV before this rewrite).
   ========================================================================== */

window.landlordCharts = {};
window.landlordMap = null;

window.initLandlordCharts = function initLandlordCharts() {
  const charts = window.landlordCharts;
  const container = document.getElementById('panel-landlord');
  const palette = ['#856348', '#a27958', '#b6967d', '#ccb5a3', '#ded0c5'];
  const defaultFont = 'GT America';
  const boldFont = 'GT America Bold';
  const TEXT_DARK = '#493628';
  const TEXT_MUTED = '#685f54';
  const borderTone = 'rgba(122, 91, 66, 0.14)';
  const pieTextStyle = { fontFamily: defaultFont, fontSize: 9, color: TEXT_MUTED };

  // --- Map: "What area of Bangalore do you rent properties in?" ---
  const map = L.map('ll-map', {
    zoomControl: false,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    touchZoom: false,
    keyboard: false
  }).setView([12.9650, 77.6200], 10);
  window.landlordMap = map;

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
    popupLabel: 'Landlord Count',
    onClick: (name) => {
      const region = Object.keys(REGION_COORDS).find((r) => REGION_COORDS[r].name === name);
      if (!region || !filterCard) return;
      const current = filterCard.getState().region;
      filterCard.setRegion(current === region ? '' : region);
    }
  });

  charts.portfolio = ChartTheme.init('ll-chart-portfolio');
  charts.motivation = ChartTheme.init('ll-chart-motivation');
  charts.pricing = ChartTheme.init('ll-chart-pricing');
  charts.rentCap = ChartTheme.init('ll-chart-rent-cap');
  charts.pieHike = ChartTheme.init('ll-pie-hike');
  charts.pieSpeed = ChartTheme.init('ll-pie-speed');

  const PORTFOLIO_VALUES = ['One', 'Two', 'Three to five', 'More than five'];
  const PORTFOLIO_LABELS = ['One', 'Two', '3 - 5', '> 5'];

  const MOTIVATION_VALUES = ['I bought it to live in, then moved to a different house', 'I got it from family / inherited it', 'I bought it to earn rent', 'I bought it for my child or for later use', 'Other reasons'];
  const MOTIVATION_LABELS = ['Lived then moved', 'Inherited', 'Earn rent', 'Child / later', 'Other'];

  const PRICING_VALUES = ['I matched nearby houses', 'The broker or agent told me the rate', 'I took what the last tenant paid and added a bit', 'Honestly, whatever I felt I could get', 'It covers my costs'];
  const PRICING_LABELS = ['Matched nearby', 'Broker rate', 'Last rent + bit', 'Whatever possible', 'Covers costs'];

  const RENT_CAP_VALUES = ['Strongly disagree', 'Disagree', 'Agree', 'Not sure', 'Strongly agree'];
  const RENT_CAP_LABELS = ['Strongly Disagree', 'Disagree', 'Agree', 'Not Sur', 'Strongly Agre'];

  const LAST_HIKE_GROUPS = [
    ['Up to 10%', ['Up to 10%']],
    ['11–20%', ['11–20%']],
    ['No raise', ['I did not raise it']],
    ['Empty / NA', ['The house was empty/does not apply']],
    ['>20%', ['21–40%', 'More than 40%']]
  ];

  const SPEED_VALUES = ['In a few days — many people wanted it', 'In a week or two', 'More than a month', 'It has not been vacant in years'];
  const SPEED_LABELS = ['Few days', '1-2 weeks', '>1 month', 'Not vacant'];

  const RAISE_REASON_VALUES = ['Rents in the area went up, so I did the same', 'Other reasons', 'I was charging low before, so I fixed it', 'People were ready to pay', 'My costs went up — tax, repairs, loan etc', 'I did not raise it', 'A new metro or office nearby raised demand'];
  const RAISE_REASON_LABELS = ['Rents in area went up', 'Other reasons', 'Charging low before / fixed', 'People ready to pay', 'Costs went up (tax/repairs)', 'Did not raise rent', 'Metro / office nearby'];
  const RAISE_REASON_COLORS = [palette[0], palette[1], palette[2], palette[3], palette[4], '#7e5a3e', '#c8ab8f'];

  function render(records, mapRecords) {
    // --- Map + portfolio bar ---
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
        if (count >= 10) return palette[0];
        if (count >= 5) return palette[1];
        return palette[2];
      }
    );

    const portfolio = Aggregate.tally(records, 'portfolioSize', PORTFOLIO_VALUES);
    charts.portfolio.setOption({
      tooltip: { trigger: 'axis' },
      grid: { top: 20, bottom: 25, left: 25, right: 10 },
      xAxis: {
        type: 'category', data: PORTFOLIO_LABELS,
        axisLine: { lineStyle: { color: palette[2] } },
        axisLabel: { fontFamily: defaultFont, fontSize: 9, fontWeight: 600 }
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { type: 'dashed', color: borderTone } },
        axisLabel: { fontFamily: defaultFont, fontSize: 9 }
      },
      series: [{
        data: portfolio.counts, type: 'bar',
        itemStyle: { color: palette[1], borderRadius: [4, 4, 0, 0] },
        label: { show: true, position: 'top', fontFamily: boldFont, fontWeight: 700, fontSize: 9, color: TEXT_DARK }
      }]
    }, true);

    // --- "Why become a landlord?" ---
    // Horizontal, not vertical: these are full multi-word phrases, and a
    // narrow ~1/3-width card doesn't give 5 vertical columns enough room
    // for that much label text without it overlapping into its neighbors.
    // Laid on its side, each label gets a full-width row instead.
    const motivation = Aggregate.tally(records, 'motivation', MOTIVATION_VALUES);
    charts.motivation.setOption({
      tooltip: { trigger: 'axis' },
      grid: { top: 8, bottom: 8, left: 8, right: 26, containLabel: true },
      xAxis: {
        type: 'value',
        splitLine: { lineStyle: { type: 'dashed', color: borderTone } },
        axisLabel: { fontFamily: defaultFont, fontSize: 9 }
      },
      yAxis: {
        type: 'category', data: MOTIVATION_LABELS,
        axisLine: { show: false }, axisTick: { show: false },
        axisLabel: { fontFamily: defaultFont, fontSize: 9, fontWeight: 600, color: TEXT_DARK }
      },
      series: [{
        data: motivation.counts, type: 'bar', barWidth: 12,
        itemStyle: { color: palette[1], borderRadius: [0, 4, 4, 0] },
        label: { show: true, position: 'right', fontFamily: boldFont, fontWeight: 700, fontSize: 9, color: TEXT_DARK }
      }]
    }, true);

    // --- "Rent pricing logic?" (same reasoning as motivation, above) ---
    const pricing = Aggregate.tally(records, 'pricing', PRICING_VALUES);
    charts.pricing.setOption({
      tooltip: { trigger: 'axis' },
      grid: { top: 8, bottom: 8, left: 8, right: 26, containLabel: true },
      xAxis: {
        type: 'value',
        splitLine: { lineStyle: { type: 'dashed', color: borderTone } },
        axisLabel: { fontFamily: defaultFont, fontSize: 9 }
      },
      yAxis: {
        type: 'category', data: PRICING_LABELS,
        axisLine: { show: false }, axisTick: { show: false },
        axisLabel: { fontFamily: defaultFont, fontSize: 9, fontWeight: 600, color: TEXT_DARK }
      },
      series: [{
        data: pricing.counts, type: 'bar', barWidth: 12,
        itemStyle: { color: palette[2], borderRadius: [0, 4, 4, 0] },
        label: { show: true, position: 'right', fontFamily: boldFont, fontWeight: 700, fontSize: 9, color: TEXT_DARK }
      }]
    }, true);

    // --- "Do you think Bengaluru should put a limit on how much rent can go up?" ---
    const rentCap = Aggregate.tally(records, 'rentCap', RENT_CAP_VALUES);
    const rentCapPct = Aggregate.percentages(rentCap.counts, rentCap.total);
    const rentCapTotal = rentCap.total;
    charts.rentCap.setOption({
      tooltip: {
        trigger: 'item',
        formatter: (params) => `${params.marker} ${params.seriesName.replace(/\s*\([^)]*\)/, '')}: <b>${params.value}%</b> (${Math.round(params.value * rentCapTotal / 100)} responses)`
      },
      legend: {
        top: 0, left: 0, icon: 'rect', itemWidth: 10, itemHeight: 10,
        textStyle: { fontFamily: defaultFont, fontSize: 10, fontWeight: 600, color: TEXT_MUTED }
      },
      ...ChartTheme.statBarAxes({ fontFamily: defaultFont, fontSize: 10, color: TEXT_MUTED }, borderTone, 'Responses'),
      series: RENT_CAP_LABELS.map((label, i) => ({
        name: RENT_CAP_LABELS[i], type: 'bar', stack: 'total', data: [rentCapPct[i]],
        itemStyle: { color: palette[i], ...(i === 0 ? { borderRadius: [4, 0, 0, 4] } : {}), ...(i === RENT_CAP_VALUES.length - 1 ? { borderRadius: [0, 4, 4, 0] } : {}) },
        label: ChartTheme.statBarLabel()
      }))
    }, true);

    // --- "Last renewal hike?" / "Time to find tenant?" ---
    const lastHike = Aggregate.tallyGrouped(records, 'lastHike', LAST_HIKE_GROUPS);
    charts.pieHike.setOption(ChartTheme.pieOption(
      LAST_HIKE_GROUPS.map(([name], i) => ({ value: lastHike.counts[i], name, itemStyle: { color: palette[i] } })),
      pieTextStyle, { name: 'Last Hike' }
    ), true);

    const speed = Aggregate.tally(records, 'vacancySpeed', SPEED_VALUES);
    charts.pieSpeed.setOption(ChartTheme.pieOption(
      SPEED_LABELS.map((name, i) => ({ value: speed.counts[i], name, itemStyle: { color: [palette[0], palette[1], palette[2], palette[4]][i] } })),
      pieTextStyle, { name: 'Vacancy Time' }
    ), true);

    // --- "Why did you raise the rent last time?" (dot matrix + legend) ---
    const raiseReason = Aggregate.tally(records, 'raiseReason', RAISE_REASON_VALUES);
    ChartTheme.buildDotMatrix(
      document.getElementById('ll-dot-matrix'),
      document.getElementById('ll-legend-matrix'),
      RAISE_REASON_LABELS.map((name, i) => ({ name, count: raiseReason.counts[i], color: RAISE_REASON_COLORS[i] }))
    );
  }

  function renderResponses(records) {
    const items = records
      .filter((r) => r.cutEarnings || r.raiseReason)
      .map((r) => {
        const lines = [];
        if (r.raiseReason) lines.push({ label: 'Why they raised the rent', quote: r.raiseReason });
        if (r.cutEarnings) lines.push({ label: 'If a rent cap cut their earnings', quote: r.cutEarnings });
        return { lines, meta: (r.age || 'Age not specified') + ' • ' + (r.career ? Aggregate.shortCareer(r.career) : 'Career not specified') };
      });
    FilterUI.mountResponses(
      document.getElementById('ll-responses'),
      document.getElementById('ll-pagination'),
      items,
      { emptyText: 'No landlord responses match these filters.' }
    );
  }

  function toggleView(view) {
    const chartsView = document.getElementById('ll-charts-view');
    const responsesView = document.getElementById('ll-responses-view');
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
    const records = Aggregate.filterRecords(window.SURVEY_DATA.landlord, filters);
    const mapRecords = Aggregate.filterRecords(window.SURVEY_DATA.landlord, { age: filters.age, career: filters.career });
    render(records, mapRecords);
    renderResponses(records);
  }

  filterCard = FilterUI.buildFilterCard({
    hasRegion: true,
    // No landlord respondent is Under 25 or a Student — those 2 pills
    // would just be dead ends here.
    ageOptions: Aggregate.optionsWithData(window.SURVEY_DATA.landlord, 'age', Aggregate.AGE_OPTIONS),
    careerOptions: Aggregate.optionsWithData(window.SURVEY_DATA.landlord, 'career', Aggregate.CAREER_OPTIONS),
    title: 'Filter Landlord Responses',
    subtitle: 'Select an age group, career stage or area — the map, every chart, and the Responses tab below all narrow to match.',
    onFilterChange: applyFilters
  });
  document.getElementById('ll-top-row').insertBefore(filterCard.el, document.getElementById('ll-top-row').firstChild);
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
