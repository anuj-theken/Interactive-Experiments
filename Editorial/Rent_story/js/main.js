/* ==========================================================================
   MAIN — tab switching + orchestration
   ==========================================================================
   Wires the 5 tab buttons (.tab-btn[data-tab="..."]) to the 5 dashboard
   panels (#panel-overview / #panel-homeowner / #panel-nonresident /
   #panel-landlord / #panel-tenant). Each dashboard's charts are defined in
   its own js/<name>.js file and are lazy-initialized the first time its tab
   is opened (ECharts/Leaflet need a visible, sized container to measure
   against). Overview is the default tab shown on load.
   ========================================================================== */

(function () {
  const SUBTITLES = {
    overview: 'An analysis of tenant perspectives, rent caps, and demographics across Bengaluru',
    homeowner: 'Owner perspectives on rent limits, historical rent increases, and market feasibility for young buyers',
    nonresident: "Data summary from respondents living outside Bengaluru who weighed Bengaluru's rents against a move or a job here",
    landlord: 'Data summary of rental caps, landlord motivations, pricing strategies, and portfolio density',
    tenant: 'Insights from 373 tenant responses on hikes, deposits, rent limits, and moving pressure'
  };

  const PANEL_IDS = {
    overview: 'panel-overview',
    homeowner: 'panel-homeowner',
    nonresident: 'panel-nonresident',
    landlord: 'panel-landlord',
    tenant: 'panel-tenant'
  };

  const initialized = { overview: false, homeowner: false, nonresident: false, landlord: false, tenant: false };

  const INIT_FNS = {
    overview: 'initOverviewCharts',
    homeowner: 'initHomeownerCharts',
    nonresident: 'initNonresidentCharts',
    landlord: 'initLandlordCharts',
    tenant: 'initTenantCharts'
  };

  // Charts must not be created until the custom @font-face fonts (Jazmin
  // Alt / GT America, see css/dashboard.css) are loaded — ECharts measures
  // axis/legend label widths (containLabel, etc.) using whatever font is
  // ACTUALLY available at setOption() time, and won't re-measure later if a
  // web font swaps in after the fact. Without this gate, labels measured
  // against a fallback system font can render clipped once the real
  // (usually wider, bold) font paints in.
  const fontsReady = (document.fonts && document.fonts.ready) || Promise.resolve();

  function resizeAll(charts) {
    if (!charts) return;
    Object.values(charts).forEach((c) => c && c.resize());
  }

  function resizeTab(tab) {
    if (tab === 'overview') {
      resizeAll(window.overviewCharts);
      if (window.overviewMap) window.overviewMap.invalidateSize();
    }
    if (tab === 'homeowner') resizeAll(window.homeownerCharts);
    if (tab === 'nonresident') resizeAll(window.nonresidentCharts);
    if (tab === 'landlord') {
      resizeAll(window.landlordCharts);
      if (window.landlordMap) window.landlordMap.invalidateSize();
    }
    if (tab === 'tenant') resizeAll(window.tenantCharts);
  }

  function showTab(tab) {
    Object.keys(PANEL_IDS).forEach((key) => {
      document.getElementById(PANEL_IDS[key]).style.display = key === tab ? 'flex' : 'none';
    });

    document.querySelectorAll('.tab-btn').forEach((btn) => {
      const isActive = btn.dataset.tab === tab;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
    });

    document.getElementById('dynamic-subtitle').textContent = SUBTITLES[tab];

    fontsReady.then(() => {
      if (!initialized[tab]) {
        window[INIT_FNS[tab]]();
        initialized[tab] = true;
      }
      requestAnimationFrame(() => resizeTab(tab));
    });
  }

  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => showTab(btn.dataset.tab));
  });

  window.addEventListener('resize', () => {
    resizeAll(window.overviewCharts);
    resizeAll(window.homeownerCharts);
    resizeAll(window.nonresidentCharts);
    resizeAll(window.landlordCharts);
    resizeAll(window.tenantCharts);
    if (window.overviewMap) window.overviewMap.invalidateSize();
    if (window.landlordMap) window.landlordMap.invalidateSize();
  });

  showTab('overview');
})();
