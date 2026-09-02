/* ==========================================================================
   FILTERS — cross-dashboard aggregation + filter-bar UI
   ==========================================================================
   Loaded after js/data.js and js/chart-theme.js, before the 5 dashboard
   modules. Two globals:

   window.Aggregate
     Pure functions over window.SURVEY_DATA record arrays (see js/data.js —
     one object per respondent, field values are literal survey answer
     text, '' if left blank). Every dashboard module re-aggregates a
     filtered subset of its records on every filter change instead of
     reading pre-computed numbers, so the charts stay exact regardless of
     which age/career/region slice is selected.
       .AGE_OPTIONS / .CAREER_OPTIONS / .REGION_OPTIONS — canonical value
         lists, in the order filter pills are drawn.
       .filterRecords(records, filters) — filters = {age?, career?, region?},
         each '' or omitted means "don't filter on this dimension".
       .tally(records, field, values) — { counts: [...aligned to values],
         total } counting non-blank answers only (blanks excluded from both
         the numerator and denominator, matching this site's existing
         "drop unanswered" convention for every pie/bar on the site).
       .tallyGrouped(records, field, groups) — like tally, but each group is
         [label, [...rawValuesThatCountTowardIt]], for charts whose slice
         combines 2+ raw answers into one bucket (e.g. Tenant's
         "Brokers / Others" = "Brokers" + "Something else").
       .countFlag(records, field, code) — count of records whose `field`
         array (a multi-select checkbox question, e.g. Tenant's coping
         mechanisms) contains `code`.
       .percentages(counts, total) — counts -> % of total, 2dp, matching the
         precision already baked into the stat-bar charts (e.g. 64.18).
       .regionCounts(records) — { Central: n, East: n, ... } over
         REGION_OPTIONS, for the map markers.

   window.FilterUI
     .buildFilterCard(config) — builds a `.card.filter-card` (age/career[/
       region] pill groups) and returns it UNMOUNTED — the caller places it
       in the DOM itself (typically as the first child of a `.top-row`, next
       to the map card — see css/dashboard.css section 8). config:
         hasRegion: boolean — adds the "Area" pill group.
         ageOptions / careerOptions / regionOptions: arrays overriding the
           default Aggregate.AGE_OPTIONS/CAREER_OPTIONS/REGION_OPTIONS pill
           lists — pass Aggregate.optionsWithData(records, field, options)
           to drop pills with zero matching respondents on that dashboard.
         title: string for the card's own heading.
         onFilterChange(filters) — fired on every pill click.
       Returns { el, getState(), setRegion(value) } — setRegion() lets the
       Landlord/Tenant map's marker clicks drive the same "Area" pill group
       instead of duplicating filter state.
     .mountSectionTabs(containerEl, config) — builds the Charts/
       Responses(/Suggestions) folder-tab switch and inserts it as a sibling
       immediately BEFORE `containerEl` (a `.dashboard-container`) — outside
       it, not as its first child, so the tabs can overlap down into its
       top edge instead of being clipped by its own padding/overflow. See
       css/dashboard.css section 8. config:
         labels: [chartsLabel, responsesLabel] — defaults to
           ['Charts', 'Responses']; Homeowner passes ['Charts',
           'Suggestions'] since its subjective field is advice, not a
           complaint.
         onViewChange(view) — fired on every tab click ('charts'/
           'responses').
     .buildResponseCards(container, items, emptyText) — renders one PAGE of
       items = [{quote, meta}] (or, for Landlord's 2-field cards,
       {lines: [{label, quote}], meta}) as a card grid, or an empty-state
       message if `items` is empty. Called by mountResponses below — reach
       for that instead of this directly unless you specifically don't want
       pagination.
     .mountResponses(scrollEl, paginationEl, items, opts) — paginates
       `items` (opts.pageSize, default 9) into `scrollEl` with Prev/Next
       controls in `paginationEl`, so the Responses view's height stays
       constant regardless of how many responses match the current filters
       — call this again (a fresh call, not a persistent handle) every time
       the filtered item set changes, which resets to page 1.
   ========================================================================== */

window.Aggregate = (function () {
  const AGE_OPTIONS = ['Under 25', '25 – 34', '35 – 44', '45 – 54', '55 and above'];
  const CAREER_OPTIONS = ['Student', 'Early career', 'Mid career', 'Senior career', 'Self-employed / run my own business', 'Not working right now'];
  const REGION_OPTIONS = ['Central', 'East', 'South', 'West', 'North', 'Outer'];

  function filterRecords(records, filters) {
    filters = filters || {};
    return records.filter((r) =>
      (!filters.age || r.age === filters.age) &&
      (!filters.career || r.career === filters.career) &&
      (!filters.region || r.region === filters.region)
    );
  }

  function tally(records, field, values) {
    const counts = values.map(() => 0);
    let total = 0;
    records.forEach((r) => {
      const v = r[field];
      if (!v) return;
      const idx = values.indexOf(v);
      if (idx === -1) return;
      counts[idx]++;
      total++;
    });
    return { counts, total };
  }

  function tallyGrouped(records, field, groups) {
    const counts = groups.map(() => 0);
    let total = 0;
    records.forEach((r) => {
      const v = r[field];
      if (!v) return;
      const idx = groups.findIndex((g) => g[1].indexOf(v) !== -1);
      if (idx === -1) return;
      counts[idx]++;
      total++;
    });
    return { counts, total };
  }

  function countFlag(records, field, code) {
    return records.reduce((n, r) => n + ((r[field] || []).indexOf(code) !== -1 ? 1 : 0), 0);
  }

  function percentages(counts, total) {
    if (!total) return counts.map(() => 0);
    return counts.map((c) => Math.round((c / total) * 10000) / 100);
  }

  function regionCounts(records) {
    const out = {};
    REGION_OPTIONS.forEach((r) => { out[r] = 0; });
    records.forEach((r) => { if (r.region && out[r.region] !== undefined) out[r.region]++; });
    return out;
  }

  const CAREER_SHORT = {
    'Self-employed / run my own business': 'Self-employed',
    'Not working right now': 'Not working'
  };

  function shortCareer(career) {
    return CAREER_SHORT[career] || career;
  }

  // Which of `options` actually has at least 1 unfiltered respondent in
  // `records` for `field` — e.g. Landlord has zero "Under 25" or "Student"
  // respondents, so those 2 pills would just be dead ends on that
  // dashboard's filter card. Pass the result as the ageOptions/
  // careerOptions/regionOptions override to buildFilterCard (below) instead
  // of a dashboard hardcoding which values to drop, so this stays correct
  // if the underlying survey data ever changes.
  function optionsWithData(records, field, options) {
    return options.filter((opt) => records.some((r) => r[field] === opt));
  }

  // A crude but effective filter for the free-text Responses/Suggestions
  // tabs: real written answers ("Rents went up 30% and my landlord wouldn't
  // budge.") almost always contain a period or comma somewhere; one- or
  // two-word non-answers ("Good", "N/A", "ok", "-") almost never do. Used
  // to drop the latter from every dashboard's response cards rather than
  // padding out a page of quotes with near-blank ones.
  function looksLikeSentence(text) {
    return /[.,]/.test(text);
  }

  return {
    AGE_OPTIONS, CAREER_OPTIONS, REGION_OPTIONS,
    filterRecords, tally, tallyGrouped, countFlag, percentages, regionCounts, shortCareer, optionsWithData, looksLikeSentence
  };
})();

window.FilterUI = (function () {
  const CAREER_SHORT = {
    'Self-employed / run my own business': 'Self-employed',
    'Not working right now': 'Not working'
  };

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function buildFilterCard(config) {
    config = config || {};
    const hasRegion = !!config.hasRegion;
    const onChange = config.onFilterChange || function () {};
    const title = config.title || 'Filter this dashboard';

    const state = { age: '', career: '', region: '' };

    const card = document.createElement('div');
    card.className = 'card filter-card';
    card.innerHTML = `
      <div class="card-title">${escapeHtml(title)}</div>
    `;

    const groups = document.createElement('div');
    groups.className = 'filter-groups';
    card.appendChild(groups);

    let regionGroupEl = null;

    function buildGroup(key, label, options, shortLabels) {
      const group = document.createElement('div');
      group.className = 'filter-group';
      group.dataset.filter = key;

      const cap = document.createElement('span');
      cap.className = 'filter-label';
      cap.textContent = label;
      group.appendChild(cap);

      function makePill(text, value) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'filter-pill' + (value === '' ? ' active' : '');
        btn.textContent = text;
        btn.dataset.value = value;
        btn.addEventListener('click', () => {
          state[key] = value;
          group.querySelectorAll('.filter-pill').forEach((b) => b.classList.toggle('active', b === btn));
          onChange(Object.assign({}, state));
        });
        group.appendChild(btn);
      }

      makePill('All', '');
      options.forEach((opt) => makePill((shortLabels && shortLabels[opt]) || opt, opt));
      groups.appendChild(group);
      return group;
    }

    // ageOptions/careerOptions/regionOptions let a dashboard pass a subset
    // (via Aggregate.optionsWithData) instead of the full canonical list —
    // e.g. Landlord has zero "Under 25" or "Student" respondents, so those
    // pills would just be dead ends there.
    buildGroup('age', 'Age', config.ageOptions || Aggregate.AGE_OPTIONS);
    buildGroup('career', 'Career', config.careerOptions || Aggregate.CAREER_OPTIONS, CAREER_SHORT);
    if (hasRegion) regionGroupEl = buildGroup('region', 'Area', config.regionOptions || Aggregate.REGION_OPTIONS);

    return {
      el: card,
      getState: () => Object.assign({}, state),
      setRegion(value) {
        if (!regionGroupEl) return;
        state.region = value;
        regionGroupEl.querySelectorAll('.filter-pill').forEach((b) => b.classList.toggle('active', b.dataset.value === value));
        onChange(Object.assign({}, state));
      }
    };
  }

  function mountSectionTabs(containerEl, config) {
    config = config || {};
    const labels = config.labels || ['Charts', 'Responses'];
    const onView = config.onViewChange || function () {};

    const nav = document.createElement('nav');
    nav.className = 'section-tabs';
    nav.setAttribute('role', 'tablist');
    nav.innerHTML = [
      { view: 'charts', label: labels[0] },
      { view: 'responses', label: labels[1] }
    ].map((tab, i) => `
      <button type="button" class="section-tab-btn${i === 0 ? ' active' : ''}" data-view="${tab.view}" role="tab" aria-selected="${i === 0}">${escapeHtml(tab.label)}</button>
    `).join('');
    // A sibling BEFORE containerEl (the .dashboard-container), not its
    // first child — so the tabs sit outside the container's own padding/
    // overflow:hidden box and can overlap down into its top edge (the
    // folder-tab "attached to the sheet" illusion — see .section-tabs in
    // css/dashboard.css section 8), the same way the old cross-dashboard
    // tabs sat in .page-header, a sibling of .dashboard-container, before
    // this became a per-dashboard Charts/Responses switch.
    containerEl.parentNode.insertBefore(nav, containerEl);

    const buttons = nav.querySelectorAll('.section-tab-btn');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.classList.contains('active')) return;
        buttons.forEach((b) => {
          const active = b === btn;
          b.classList.toggle('active', active);
          b.setAttribute('aria-selected', String(active));
        });
        onView(btn.dataset.view);
      });
    });
  }

  // Replays a CSS fade-in on `el` even if it's already mounted/visible —
  // remove the class, force a reflow (offsetWidth read) so the browser
  // forgets the animation already ran, then re-add it. Call on whichever of
  // `.dashboard-grid` / `.responses-view` just became visible from inside a
  // dashboard's onViewChange handler, so Charts<->Responses fades instead
  // of snapping — the old cross-dashboard tab switcher had this (js/main.js
  // did the same dance), but that file is gone now that switching is
  // per-dashboard instead.
  function replayEnter(el) {
    if (!el) return;
    el.classList.remove('view-enter');
    void el.offsetWidth;
    el.classList.add('view-enter');
  }

  function truncateWords(text, maxWords) {
    const words = text.trim().split(/\s+/);
    if (words.length <= maxWords) return text.trim();
    return words.slice(0, maxWords).join(' ') + '…';
  }

  // One shared modal, appended to <body> (not the card grid) — position:
  // fixed + a backdrop, so "expand" lands ON TOP of everything instead of
  // growing the card downward and reflowing the grid (which would fight
  // .responses-scroll's fixed-height point: a page's height shouldn't
  // change based on which card is open, same as it shouldn't change based
  // on which page of results is showing).
  let modalEl = null;

  function ensureModal() {
    if (modalEl) return modalEl;
    modalEl = document.createElement('div');
    modalEl.className = 'response-modal-backdrop';
    modalEl.innerHTML = `
      <div class="response-modal" role="dialog" aria-modal="true">
        <button type="button" class="response-modal-close" aria-label="Close">&times;</button>
        <div class="response-modal-body"></div>
        <div class="response-modal-meta"></div>
      </div>
    `;
    document.body.appendChild(modalEl);
    modalEl.addEventListener('click', (e) => { if (e.target === modalEl) closeModal(); });
    modalEl.querySelector('.response-modal-close').addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
    return modalEl;
  }

  function openModal(item) {
    const modal = ensureModal();
    modal.querySelector('.response-modal-body').innerHTML = item.lines
      ? item.lines.map((l) => `
          <div class="response-quote-label">${escapeHtml(l.label)}</div>
          <div class="response-quote">&ldquo;${escapeHtml(l.quote)}&rdquo;</div>
        `).join('')
      : `<div class="response-quote">&ldquo;${escapeHtml(item.quote)}&rdquo;</div>`;
    modal.querySelector('.response-modal-meta').textContent = item.meta;
    modal.classList.add('open');
  }

  function closeModal() {
    if (modalEl) modalEl.classList.remove('open');
  }

  // Cards show a short (~25-word, single-quote cards; ~12 words per line
  // for Landlord's 2-line cards) preview with a "…" if the real answer
  // runs longer — click (or Enter/Space) opens the full text in the shared
  // modal above, rather than growing the card itself.
  function buildResponseCards(container, items, emptyText) {
    if (!items.length) {
      container.innerHTML = `<div class="responses-empty">${escapeHtml(emptyText || 'No responses match these filters.')}</div>`;
      return;
    }
    container.innerHTML = items.map((item, i) => {
      // No per-line .response-quote-label here (unlike the expanded modal
      // below) — Landlord's 2-quote cards used to caption each quote with
      // the question it answers, but that's redundant now that the
      // Responses tab shows the underlying question once, up in
      // .responses-header, instead of repeating it on every card.
      const body = item.lines
        ? item.lines.map((l) => `
            <div class="response-quote">&ldquo;${escapeHtml(truncateWords(l.quote, 12))}&rdquo;</div>
          `).join('')
        : `<div class="response-quote">&ldquo;${escapeHtml(truncateWords(item.quote, 26))}&rdquo;</div>`;
      return `
        <div class="response-card"${item.lines ? ' data-multi-quote="true"' : ''} data-index="${i}" tabindex="0" role="button" aria-label="Expand full response">
          ${body}
          <div class="response-meta">${escapeHtml(item.meta)}</div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.response-card').forEach((card) => {
      const item = items[Number(card.dataset.index)];
      card.addEventListener('click', () => openModal(item));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(item); }
      });
    });
  }

  function mountResponses(scrollEl, paginationEl, items, opts) {
    opts = opts || {};
    const pageSize = opts.pageSize || 9;
    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
    let page = 0;

    function renderPage() {
      buildResponseCards(scrollEl, items.slice(page * pageSize, page * pageSize + pageSize), opts.emptyText);

      if (items.length === 0) {
        paginationEl.innerHTML = '';
        return;
      }
      paginationEl.innerHTML = `
        <button type="button" class="page-btn" data-dir="prev"${page === 0 ? ' disabled' : ''}>&larr; Prev</button>
        <span class="page-label">Page ${page + 1} of ${totalPages}</span>
        <button type="button" class="page-btn" data-dir="next"${page === totalPages - 1 ? ' disabled' : ''}>Next &rarr;</button>
      `;
      const prevBtn = paginationEl.querySelector('[data-dir="prev"]');
      const nextBtn = paginationEl.querySelector('[data-dir="next"]');
      prevBtn.addEventListener('click', () => { page--; renderPage(); });
      nextBtn.addEventListener('click', () => { page++; renderPage(); });
    }

    renderPage();
  }

  // Below `opts.breakpoint` (matches css/dashboard.css section 11's own
  // breakpoint — pass the same number), every `.card` inside `containerEl`
  // (a dashboard's `.dashboard-grid` — regardless of how deep it's nested
  // in left-column/right-column/pies-row, so this doesn't need to know a
  // given dashboard's own column layout) is moved out into a flat,
  // horizontally swipeable "one card at a time" track, with a Back/Next
  // pill-button pair + dot strip above it — real charts stay live and
  // rendering the whole time (a DOM reparent, not a remove/recreate), so
  // nothing needs to be re-initialized, only resized (`opts.onLayoutChange`,
  // for the ECharts instances that care about their container's exact
  // pixel box). Reversible: resizing back past the breakpoint restores
  // every card to its original parent and position via a same-spot marker
  // comment left behind at capture time (a plain sibling-node reference
  // would break here, since by the time a card in the MIDDLE of its
  // original parent gets restored, an EARLIER card's own restore may have
  // already re-parented that sibling out from under it). `containerEl`
  // itself is never removed, just display:none'd while carouseled, so
  // callers that still hold a reference to it (or its cards) don't need to
  // know any of this happened.
  function enableCardCarousel(containerEl, opts) {
    if (!containerEl) return;
    opts = opts || {};
    const breakpoint = opts.breakpoint || 1024;
    const onLayoutChange = opts.onLayoutChange || function () {};
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);

    let slots = null; // [{ card, marker }], captured once, lazily
    let controls = null, track = null, dots = null, prevBtn = null, nextBtn = null;
    let active = false;
    let scrollRaf = null;

    function capture() {
      if (slots) return;
      slots = Array.from(containerEl.querySelectorAll('.card')).map((card) => {
        const marker = document.createComment('carousel-slot');
        card.parentNode.insertBefore(marker, card);
        return { card, marker };
      });
    }

    function trackWidth() {
      return track.clientWidth || 1;
    }

    function currentIndex() {
      return Math.max(0, Math.min(slots.length - 1, Math.round(track.scrollLeft / trackWidth())));
    }

    function goTo(i) {
      i = Math.max(0, Math.min(slots.length - 1, i));
      track.scrollTo({ left: i * trackWidth(), behavior: 'smooth' });
    }

    function onScroll() {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = null;
        const idx = currentIndex();
        dots.querySelectorAll('.carousel-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
        prevBtn.disabled = idx === 0;
        nextBtn.disabled = idx === slots.length - 1;
      });
    }

    function activate() {
      capture();
      if (active || !slots.length) return;
      active = true;

      track = document.createElement('div');
      track.className = 'card-carousel';

      dots = document.createElement('div');
      dots.className = 'carousel-dots';

      slots.forEach((slot, i) => {
        slot.card.classList.add('carousel-slide');
        track.appendChild(slot.card);

        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Go to card ${i + 1} of ${slots.length}`);
        dot.addEventListener('click', () => goTo(i));
        dots.appendChild(dot);
      });

      // Same "← Prev [label] Next →" shape as the Responses tab's own
      // pagination bar (.pagination/.page-btn) — text pill buttons above
      // the card, not icon buttons floating over it, so the two paging
      // controls on a dashboard (Charts here, Responses below) read as one
      // consistent pattern instead of two different UI languages.
      prevBtn = document.createElement('button');
      prevBtn.type = 'button';
      prevBtn.className = 'carousel-nav-btn';
      prevBtn.innerHTML = '&larr; Back';
      prevBtn.disabled = true;
      prevBtn.addEventListener('click', () => goTo(currentIndex() - 1));

      nextBtn = document.createElement('button');
      nextBtn.type = 'button';
      nextBtn.className = 'carousel-nav-btn';
      nextBtn.innerHTML = 'Next &rarr;';
      nextBtn.addEventListener('click', () => goTo(currentIndex() + 1));

      controls = document.createElement('div');
      controls.className = 'carousel-controls';
      controls.appendChild(prevBtn);
      controls.appendChild(dots);
      controls.appendChild(nextBtn);

      containerEl.parentNode.insertBefore(controls, containerEl);
      containerEl.parentNode.insertBefore(track, containerEl);
      containerEl.style.display = 'none';

      track.addEventListener('scroll', onScroll, { passive: true });
      onLayoutChange();
    }

    function deactivate() {
      if (!active) return;
      active = false;
      slots.forEach((slot) => {
        slot.card.classList.remove('carousel-slide');
        slot.marker.parentNode.insertBefore(slot.card, slot.marker);
      });
      controls.remove();
      track.remove();
      controls = track = dots = prevBtn = nextBtn = null;
      containerEl.style.display = '';
      onLayoutChange();
    }

    function sync() {
      if (mq.matches) activate(); else deactivate();
    }

    sync();
    (mq.addEventListener ? mq.addEventListener.bind(mq, 'change') : mq.addListener.bind(mq))(sync);
  }

  return { buildFilterCard, mountSectionTabs, replayEnter, buildResponseCards, mountResponses, enableCardCarousel };
})();
