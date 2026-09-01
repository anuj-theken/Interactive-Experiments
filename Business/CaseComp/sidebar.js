/* ==========================================================================
   SIDEBAR — the filter header (life area / feeling / age / city selects,
   shared by both the charts and the stories panel) and the stories panel
   itself (paginated cards of the real free-text answers). Filters change
   what's included in every chart's + every card's aggregation; clicking a
   chart element narrows the cards further to that element's context — the
   two compose rather than compete (see onElementClick).
   ========================================================================== */
window.SidebarUI = (function () {
  const A = window.Aggregate;
  const EMO_ORDER = ['Frustrating', 'Procrastinate', 'Repetitive'];
  const EMO_COLOR = { Frustrating: '#e34948', Procrastinate: '#eda100', Repetitive: '#2a78d6' };
  // A 14-way categorical set for the life-area filter chips + story cards —
  // deliberately clear of red/yellow/blue, which are already the page's
  // reserved Frustrating/Procrastinate/Repetitive vocabulary (see charts.js).
  const CAT_COLOR = {
    'Money & investing':  '#1f9e6e',
    'Groceries':          '#d98a3d',
    'Fitness & wellness': '#2ba79a',
    'Shopping & deals':   '#d15a94',
    'Learning & hobbies': '#7c5cd4',
    'Getting around':     '#a97142',
    'Health & medical':   '#b3486b',
    'Food & eating out':  '#8a9a3e',
    'Travel & holidays':  '#c17a4a',
    'Going out':          '#9b4fc9',
    'Kids & school':      '#3f8f4a',
    'Weddings':           '#cc6f9e',
    'Beauty & self-care': '#6f5aa8',
    'Pets':               '#8a6a4a'
  };
  const PAGE_SIZE = 6;

  const filters = A.defaultFilters();
  let onChangeCb = function () {};
  let cityOptions = [];
  let context = null; // { dimension, value } — set by a chart click; null = unscoped (all current stories)
  let page = 0;
  let headerCtl = {}; // fCat/fAge/fCity elements + syncEmotion, so pill removal can reset the header controls too

  function fmt(n) { return n.toLocaleString('en-IN'); }
  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
  function pct(n, total) { return total ? Math.round((n / total) * 100) : 0; }

  /* ------------------------------ filter header ------------------------------ */
  function buildSelect(select, options, placeholder) {
    select.innerHTML = `<option value="">${escapeHtml(placeholder)}</option>` +
      options.map(o => `<option value="${escapeHtml(o)}">${escapeHtml(o)}</option>`).join('');
  }

  function chipHtml(value, label, color) {
    return `<button type="button" class="chip" data-val="${escapeHtml(value)}" style="--chip:${color}">${escapeHtml(label)}</button>`;
  }

  function buildChipRow(row, options, allLabel, colorOf, current, onPick) {
    row.innerHTML = chipHtml('', allLabel, 'var(--text-secondary)') +
      options.map(o => chipHtml(o, o, colorOf(o))).join('');
    function sync() {
      row.querySelectorAll('.chip').forEach(btn => btn.classList.toggle('active', btn.dataset.val === (current() || '')));
    }
    row.querySelectorAll('.chip').forEach(btn => {
      btn.addEventListener('click', () => { onPick(btn.dataset.val || null); sync(); });
    });
    sync();
    return sync;
  }

  function buildFilters(container) {
    container.innerHTML = `
      <div class="fh-row">
        <div class="fh-controls">
          <div class="fh-group">
            <div class="fh-field">
              <span class="fh-group-label">Life area</span>
              <select class="fh-select" id="fCat"></select>
            </div>
            <div class="fh-field">
              <span class="fh-group-label">Feeling</span>
              <div class="chip-row" id="fEmotion"></div>
            </div>
          </div>
          <div class="fh-group">
            <div class="fh-field">
              <span class="fh-group-label">Age</span>
              <select class="fh-select" id="fAge"></select>
            </div>
            <div class="fh-field">
              <span class="fh-group-label">City</span>
              <select class="fh-select" id="fCity"></select>
            </div>
            <button type="button" class="reset-btn">Reset</button>
          </div>
        </div>
      </div>
    `;
    const fCat = container.querySelector('#fCat');
    const fEmotion = container.querySelector('#fEmotion');
    const fAge = container.querySelector('#fAge');
    const fCity = container.querySelector('#fCity');

    const syncEmotion = buildChipRow(fEmotion, EMO_ORDER, 'All feelings', e => EMO_COLOR[e],
      () => filters.emotion, val => { filters.emotion = val; onChangeCb(); });

    buildSelect(fCat, A.ALL_CATS, 'All life areas');
    buildSelect(fAge, A.ALL_AGE_BINS, 'All ages');
    buildSelect(fCity, cityOptions, 'All cities');

    fCat.addEventListener('change', () => { filters.cat = fCat.value || null; onChangeCb(); });
    fAge.addEventListener('change', () => { filters.ageBin = fAge.value || null; onChangeCb(); });
    fCity.addEventListener('change', () => { filters.city = fCity.value || null; onChangeCb(); });

    container.querySelector('.reset-btn').addEventListener('click', () => {
      filters.cat = null; filters.emotion = null; filters.ageBin = null; filters.city = null;
      fCat.value = ''; fAge.value = ''; fCity.value = '';
      syncEmotion();
      context = null;
      onChangeCb();
    });

    headerCtl = { fCat, fAge, fCity, syncEmotion };
  }

  // Pushes a filter value into both the state and the matching header
  // control, so the header visibly reflects it (used by chart clicks below
  // and by pill removal).
  function syncHeaderControl(key, value) {
    if (key === 'cat' && headerCtl.fCat) headerCtl.fCat.value = value || '';
    if (key === 'ageBin' && headerCtl.fAge) headerCtl.fAge.value = value || '';
    if (key === 'city' && headerCtl.fCity) headerCtl.fCity.value = value || '';
    if (key === 'emotion' && headerCtl.syncEmotion) headerCtl.syncEmotion();
  }

  // Clears one active header filter (as opposed to Reset, which clears all) and
  // resets the matching header control so the UI stays in sync — used by the
  // removable pills in the stories panel.
  function clearFilterKey(key) {
    filters[key] = null;
    syncHeaderControl(key, null);
    onChangeCb();
  }

  function refreshSummary(data) {
    const el = document.getElementById('fhSummary');
    if (el) el.innerHTML = `Showing <b>${fmt(data.totalRespondents)}</b> respondents · <b>${fmt(data.totalTags)}</b> tagged pain points.`;

    // keeps the collapsed toggle button showing how many filters are active
    // even while the controls themselves are hidden inside the overlay
    const badge = document.getElementById('filterBadge');
    if (badge) {
      const count = ['cat', 'emotion', 'ageBin', 'city'].filter(k => filters[k]).length;
      badge.hidden = count === 0;
      badge.textContent = String(count);
    }
  }

  /* ------------------------------ stories panel ------------------------------ */
  const FIELD = { category: 'cat', emotion: 'emotion', system: 'system', ageBin: 'ageBin', city: 'city' };
  const CONTEXT_DIM_LABEL = { category: 'Life area', emotion: 'Feeling', system: 'System', ageBin: 'Age', city: 'City' };
  const FILTER_LABEL = { cat: 'Life area', emotion: 'Feeling', ageBin: 'Age', city: 'City' };

  // Every active constraint on the stories list — header filters + a chart
  // click's context — rendered as one removable pill each.
  function activeFilterPills() {
    const pills = [];
    ['cat', 'emotion', 'ageBin', 'city'].forEach(key => {
      if (filters[key]) pills.push({ kind: 'filter', key, label: `${FILTER_LABEL[key]}: ${filters[key]}` });
    });
    if (context) {
      pills.push({ kind: 'context', label: `${CONTEXT_DIM_LABEL[context.dimension] || context.dimension} (chart): ${context.value}` });
    }
    return pills;
  }

  function renderActiveFilters(container) {
    const el = container.querySelector('#activeFilters');
    if (!el) return;
    const pills = activeFilterPills();
    if (!pills.length) { el.innerHTML = ''; el.hidden = true; return; }
    el.hidden = false;
    el.innerHTML = pills.map((p, i) =>
      `<button type="button" class="active-pill" data-idx="${i}">${escapeHtml(p.label)} <span class="pill-x">×</span></button>`
    ).join('');
    const btns = el.querySelectorAll('.active-pill');
    pills.forEach((p, i) => {
      btns[i].addEventListener('click', () => {
        if (p.kind === 'context') { context = null; page = 0; onChangeCb(); }
        else clearFilterKey(p.key);
      });
    });
  }

  function storyMatches(data) {
    const rows = (data.tagRows || []).filter(t => A.isRealStory(t.story));
    if (!context) return rows;
    const field = FIELD[context.dimension];
    return rows.filter(t => t[field] === context.value);
  }

  function sortedByLength(rows) {
    return rows.slice().sort((a, b) => A.wordCount(b.story) - A.wordCount(a.story));
  }

  const STORY_WORD_LIMIT = 26; // ~20-30 words before a card truncates with "…"

  function truncateStory(story) {
    const words = story.trim().split(/\s+/);
    if (words.length <= STORY_WORD_LIMIT) return null;
    return words.slice(0, STORY_WORD_LIMIT).join(' ') + '…';
  }

  function cardHtml(t) {
    const dominant = t.emotion;
    const catColor = CAT_COLOR[t.cat] || '#898781';
    const short = truncateStory(t.story);
    return `
      <div class="story-card" style="--cat:${catColor}">
        <div class="story-meta">
          <span class="story-dot" style="background:${EMO_COLOR[dominant]}"></span>
          ${escapeHtml(t.cat)} · ${escapeHtml(t.emotion)}${t.ageBin ? ' · ' + escapeHtml(t.ageBin) : ''}${t.city ? ' · ' + escapeHtml(t.city) : ''}
        </div>
        <p class="story-quote">
          <span class="story-quote-text">"${escapeHtml(short || t.story)}"</span>
        </p>
        ${short ? `<button type="button" class="story-toggle" data-full="${escapeHtml(t.story)}" data-short="${escapeHtml(short)}">Read more</button>` : ''}
      </div>`;
  }

  function renderStories(container, data) {
    const scrollEl = container.querySelector('#storiesScroll');
    const pagEl = container.querySelector('#storiesPagination');
    const subEl = container.querySelector('#storiesSub');

    const matches = sortedByLength(storyMatches(data));
    const totalPages = Math.max(1, Math.ceil(matches.length / PAGE_SIZE));
    page = Math.min(page, totalPages - 1);

    subEl.textContent = context
      ? `${fmt(matches.length)} stories match this slice.`
      : `${fmt(matches.length)} stories match the current filters. Click any bar or cell in a chart to focus on that slice.`;
    renderActiveFilters(container);

    if (!matches.length) {
      scrollEl.innerHTML = `<div class="stories-empty">No stories in this slice.</div>`;
      pagEl.innerHTML = '';
      return;
    }

    const pageItems = matches.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
    scrollEl.innerHTML = pageItems.map(cardHtml).join('');
    scrollEl.scrollTop = 0;

    pagEl.innerHTML = `
      <button type="button" class="page-btn" data-dir="prev"${page === 0 ? ' disabled' : ''}>← Prev</button>
      <span class="page-label">Page ${page + 1} of ${totalPages}</span>
      <button type="button" class="page-btn" data-dir="next"${page === totalPages - 1 ? ' disabled' : ''}>Next →</button>
    `;
    const prevBtn = pagEl.querySelector('[data-dir="prev"]');
    const nextBtn = pagEl.querySelector('[data-dir="next"]');
    if (prevBtn) prevBtn.addEventListener('click', () => { page--; renderStories(container, data); });
    if (nextBtn) nextBtn.addEventListener('click', () => { page++; renderStories(container, data); });
  }

  /* ------------------------------ public API ------------------------------ */
  let storiesEl = null;

  function mount(opts) {
    const headerEl = opts.headerEl;
    storiesEl = opts.storiesEl;
    onChangeCb = opts.onFilterChange || function () {};
    cityOptions = A.deriveAggregates(window.ROWS, A.defaultFilters()).cities.map(c => c[0]);
    buildFilters(headerEl);
    storiesEl.innerHTML = `
      <div class="stories-head">
        <div class="stories-title">In their own words</div>
        <div class="stories-sub" id="storiesSub"></div>
        <div class="active-filters" id="activeFilters" hidden></div>
      </div>
      <div class="stories-scroll" id="storiesScroll"></div>
      <div class="stories-pagination" id="storiesPagination"></div>
    `;
    storiesEl.querySelector('#storiesScroll').addEventListener('click', e => {
      const btn = e.target.closest('.story-toggle');
      if (!btn) return;
      const textEl = btn.closest('.story-card').querySelector('.story-quote-text');
      const expanded = btn.dataset.expanded === 'true';
      textEl.textContent = expanded ? `"${btn.dataset.short}"` : `"${btn.dataset.full}"`;
      btn.textContent = expanded ? 'Read more' : 'Show less';
      btn.dataset.expanded = String(!expanded);
    });
    const initial = A.deriveAggregates(window.ROWS, A.defaultFilters());
    refreshSummary(initial);
    renderStories(storiesEl, initial);
  }

  function getFilters() { return filters; }

  function onElementClick(dimension, value) {
    const key = FIELD[dimension];
    page = 0;
    if (key && key !== 'system') {
      // category/emotion/ageBin/city all have a matching header control —
      // clicking a chart element now drives that control directly, so the
      // header visibly reflects it and the charts recompute for it too,
      // instead of only narrowing the stories list on the side.
      filters[key] = value;
      syncHeaderControl(key, value);
      context = null;
      onChangeCb();
    } else {
      // coping "system" has no header filter to drive — stays a
      // stories-only narrowing, same as before.
      context = { dimension, value };
      onChangeCb();
    }
  }

  function refresh(data) {
    refreshSummary(data);
    renderStories(storiesEl, data);
  }

  return { mount, getFilters, onElementClick, refresh };
})();
