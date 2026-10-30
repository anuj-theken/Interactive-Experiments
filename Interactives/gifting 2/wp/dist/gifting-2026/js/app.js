/* Gifting · The Ken. Landing split, the two stories, overlays, footer.
   Built to the 2026 web architecture: views by ?view= (landing · recommendations · philosophies), data from
   data/gifting-2026.json, answers held as drafts in gk26_* storage until the reader signs in with an emailed code,
   then sent as database rows (scripts/gifting/rows.js). Tags: scripts/gift-tag.js + scripts/tag-theme.js. */
import { wp } from './gifting/config.js';
import { loadData, toPageData } from './gifting/data.js';
import { beliefIds, tagIds, questionIds } from './gifting/rows.js';
import { store } from './gifting/store.js';
import { renderSignIn, configureSignIn, pull, waitingCount } from './gifting/signin.js';

loadData().then(start).catch(err => {
  const box = document.getElementById('story');
  if (box) { box.classList.add('on'); box.innerHTML = '<p class="note" style="padding:40px 20px;text-align:center">We couldn’t load the gifting guide. Refresh to try again.</p>'; }
  console.error(err);
});

function start(DATA) {
  const { SECS, B, FEEL, OCC, TIER, C, ORDER, G, SAMPLES, BUDGET } = toPageData(DATA);
  const $ = s => document.querySelector(s);
  const E = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const cById = id => C.find(c => c.id === id);
  const cByName = n => C.find(c => c.name === n);

  // Seeded shuffle, so a reload with ?seed=123 shows the same order
  let seed = +(new URLSearchParams(location.search).get('seed') || Date.now() % 100000) || 1;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  // What the reader has done lives in the store (gk26_* keys): drafts until they sign in, then sent as they go
  let picks = store.picks(), kept = store.keeps();
  let matches = [], forIds = [];
  const mine = () => store.mine();
  // Each question's key in the database contract (rows.js) and how it's listed while waiting to be sent
  const QKEY = { mine: 'q01', s1: 'q02', s2: 'q06', s3: 'q09', s4: 'q16', s5: 'q20', who: 'hero:recommendations' };
  const QLABEL = {
    q01: 'Your philosophy about gifting', q02: 'In one line: a great gift is one that…', q06: 'The feeling you want a gift to create',
    q09: 'Who is hardest to buy for, and what finally worked', q16: 'What you’d love to get but never buy yourself', q20: 'Your budget for a close friend',
    'hero:recommendations': 'Your hardest person to buy for'
  };
  function saveAnswer(key, label, value, kind, quiet) {
    store.setMine(key, value);
    const r = store.addDraft(key, label, value, kind);
    if (!quiet) toast(r === 'saved' ? (kind === 'text' ? 'Saved. It’s with the editor now.' : 'Counted.') : (kind === 'text' ? 'Kept as a draft in this browser. Sign in at checkout to send it.' : 'Noted. It counts once you sign in.'));
    refreshCards();
  }
  function refreshCards() { if (currentSide === 'r') refreshBox(false); else if (currentSide === 'p') refreshThree(false); }

  function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('on'), 2400); }

  // Section colours. Philosophies: one per section; recommendations: from the tag theme.
  const SC = { s1: '#C8423A', s2: '#4A9E9A', s3: '#4A7A5A', s4: '#3D3D3D', s5: '#7A9E4A' };
  const tagColour = cid => { const t = window.TAG_THEME; return (t.palette || {})[(t.sections || {})[cid]] || '#C8423A'; };
  const LIVE_G = G.filter(g => !g.pageonly);
  const ASSETS = wp && wp.assetsUrl ? wp.assetsUrl.replace(/\/?$/, '/') : '';
  const READERS = 'nearly a thousand';

  /* ---------- gift tags ----------
     Each gift has its own tag. Readers who recommended the same gift again (g.q) get a tag each too,
     marked "Said again": same item and price, their own words, and a look of their own. */
  function tagContent(g, q) {
    const c = cById(g.c);
    return q ? { kicker: c.n + ' · Said again', headline: q[0], editorial: false, credit: q[1], item: g.it, band: g.b, count: g.n, section: g.c }
      : { kicker: c.n + ' · ' + c.name, headline: g.h, editorial: !!g.ed, credit: g.w, item: g.it, band: g.b, count: g.n, section: g.c };
  }
  // data-card="<json id>" plus the database ids (type, cat_id, card_id) the card's answers are saved under
  const INST_KEY = 'gk26_tag_at';
  const tagAt = () => { try { return JSON.parse(localStorage.getItem(INST_KEY)) || {}; } catch (e) { return {}; } };
  const setTagAt = (id, inst) => { const m = tagAt(); if (inst) m[id] = inst; else delete m[id]; try { localStorage.setItem(INST_KEY, JSON.stringify(m)); } catch (e) {} };
  // the tag that shows a gift's state: the one tapped, or the gift's own tag if none was recorded
  const showsState = (el) => { const at = tagAt()[el.dataset.id]; return at ? at === el.dataset.inst : !el.classList.contains('rep'); };
  const idAttrs = ids => ids ? `data-type="${ids.type}" data-cat-id="${ids.cat_id}" data-card-id="${ids.card_id}"` : '';
  function tagHTML(g, opts) {
    opts = opts || {};
    const qi = opts.qi, q = qi != null ? g.q[qi] : null;
    const st = GiftTag.style(q ? g.id + '~' + qi : g.id, g.c);
    const r = ((rnd() * 2 - 1) * (+st.tilt || 0)).toFixed(1);
    const open = `GF.openTag('${g.id}',${q ? qi : 'null'},this)`;
    const inst = q ? `${g.id}~${qi}` : g.id, at = tagAt()[g.id], mineTag = at ? at === inst : !q;
    const gave = mineTag && store.landed().includes(g.id), isKept = mineTag && kept.includes(g.id);
    return `<div class="gtag ${q ? 'rep' : ''} ${isKept ? 'kept' : ''} ${gave ? 'gave' : ''} ${forIds.includes(g.id) ? 'for' : ''}" style="--r:${opts.r ?? r}deg;--d:${(rnd() * .35).toFixed(2)}s" data-id="${g.id}" data-inst="${inst}" data-card="${g.id}" ${idAttrs(tagIds(DATA, g.id))} ${opts.static ? '' : `role="button" tabindex="0" onclick="${open}" onkeydown="if(event.key==='Enter')${open}"`}>${GiftTag.svg(tagContent(g, q), st, opts)}${q ? '<span class="said">Said again</span>' : ''}<span class="gave-mark" aria-hidden="true">You gave this</span></div>`;
  }
  // a section's tags: each gift, then the readers who said it again
  const tagsFor = cid => shuffle(G.filter(g => g.c === cid)).flatMap(g => [{ g }, ...g.q.map((q, i) => ({ g, qi: i }))]);
  const TAG_COUNT = G.reduce((a, g) => a + 1 + g.q.length, 0);

  /* ---------- belief cards ----------
     One card per belief, on a ruled note, in a grid under each section's question. */
  const size = n => n >= 100 ? 'L' : n >= 25 ? 'M' : 'S';
  // other readers who said the same belief in their own words
  const againFor = b => { const seen = new Set([b.h.toLowerCase().replace(/[^a-z]/g, '').slice(0, 30)]); return [...b.q, ...(SAMPLES[b.id] || [])].filter(q => { const k = q[0].toLowerCase().replace(/[^a-z]/g, '').slice(0, 30); if (seen.has(k)) return false; seen.add(k); return true; }); };
  function cardHTML(b) {
    const sec = SECS.find(s => s.id === b.s), tot = b.vs ? b.n + b.n2 : b.n;
    const quote = b.vs ? `“${E(b.h)}”<span class="or">OR</span>“${E(b.h2)}”` : `“${E(b.h)}”`;
    const count = b.vs
      ? `<b>${b.n}</b><span class="vs">VS</span><b>${b.n2}</b><small>readers disagree</small>`
      : `<b>${b.n}</b><small>${b.n === 1 ? 'reader said this' : 'readers said something like this'}</small>${b.n === 1 ? '<span class="one">ONE OF ONE</span>' : ''}`;
    return `<button class="bcard v-index ${size(tot)} ${picks.includes(b.id) ? 'picked' : ''} ${matches.includes(b.id) ? 'match' : ''}" style="--sc:${SC[b.s]}" data-id="${b.id}" data-card="${b.id}" ${idAttrs(beliefIds(DATA, b.id))} onclick="GF.openCard('${b.id}',null,this)">
      <div class="top"><span class="label">${sec.n} · ${E(sec.name)}</span></div>
      <div class="quote">${quote}</div>
      <div class="credit">${E(b.vs ? b.w + ' · and · ' + b.w2 : b.w)}</div>
      <div class="count">${count}</div></button>`;
  }
  const cardsFor = sid => shuffle(B.filter(b => b.s === sid)).map(b => cardHTML(b));

  /* ---------- question cards ---------- */
  function qcard(o) {
    // o: { id, n, label, q, why, kind: text|tap|number, options, placeholder, submit, skip, foot, dark }
    let form = '';
    if (o.kind === 'tap') form = `<div class="qopts">${o.options.map(x => `<button class="pill" aria-pressed="false" onclick="GF.tap(this,'${o.id}','${E(x)}')">${E(x)}</button>`).join('')}</div>`;
    else if (o.kind === 'slider') form = `<div class="slide"><div class="slide-val" id="val-${o.id}">Drag to answer</div><input type="range" class="qr" min="0" max="${o.max}" step="${o.step}" value="0" id="in-${o.id}" aria-label="${E(o.q)}" oninput="GF.slide('${o.id}',this.value,false)" onchange="GF.slide('${o.id}',this.value,true)"><div class="qscale"><span>₹0</span><span>₹${(o.max / 1000)}K or more</span></div></div>`;
    else if (o.kind === 'number') form = `<div class="num-row"><span class="rs">₹</span><input type="number" inputmode="numeric" min="0" id="in-${o.id}" placeholder="${E(o.placeholder || '')}"><button class="pill solid" onclick="GF.submit('${o.id}')">${E(o.submit || 'Compare')}</button></div>`;
    else form = `${o.kinds ? `<label class="kind-pick"><span class="label">Which kind of gift?</span><select id="kind-${o.id}">${C.map(c => `<option value="${c.id}">${c.n} · ${E(c.name)}</option>`).join('')}</select></label>` : ''}<textarea class="free" id="in-${o.id}" placeholder="${E(o.placeholder || '')}" rows="3"></textarea>
      <div class="qacts"><button class="pill solid" onclick="GF.submit('${o.id}')">${E(o.submit || 'Send')}</button>${o.skip ? `<button class="skip" onclick="GF.skip('${o.id}')">${E(o.skip)}</button>` : ''}</div>`;
    const key = QKEY[o.id] || (o.kinds ? 'missed' : '');
    return `<section class="ask" id="ask-${o.id}" ${key ? `data-key="${key}"` : ''} ${idAttrs(QKEY[o.id] && questionIds(DATA, QKEY[o.id]))}><div class="qcard ${o.dark ? 'dark' : ''}">
      <span class="qnum">Question ${o.n}</span>
      <div class="qhead"><div class="qlabel">${E(o.label)}</div><div class="qtext">${E(o.q)}</div></div>
      <div class="qform">${o.why ? `<div class="qwhy">${o.why}</div>` : ''}${form}</div>
      <div class="qyou" id="you-${o.id}" aria-live="polite"></div>
      ${o.foot ? `<div class="qfoot">${o.foot}</div>` : ''}</div></section>`;
  }

  /* ---------- shared story pieces ---------- */
  function bar(side) {
    const idx = side === 'r'
      ? ORDER.map(id => { const c = cById(id); return `<a data-to="${id}" onclick="GF.jump('${id}')"><small>${c.n}</small>${E(c.name)}</a>`; }).join('')
      : SECS.map(s => `<a data-to="${s.slug}" onclick="GF.jump('${s.slug}')"><small>${s.n}</small>${E(s.name)}</a>`).join('');
    // the other half of the guide, as the bar's one prominent button
    const other = side === 'r' ? { go: 'philosophies', k: 'Why we give', t: 'Philosophies' } : { go: 'recommendations', k: 'What to give', t: 'Recommendations' };
    return `<nav class="bar" aria-label="Gifting"><button class="back" onclick="GF.home()" aria-label="Back to the start"><span aria-hidden="true">←</span> Back</button><div class="idx" id="idx">${idx}</div>
      <button class="switch" onclick="GF.go('${other.go}')"><small>${other.k}</small><b>${other.t}</b><span aria-hidden="true">→</span></button></nav>`;
  }
  function artHead(o) {
    return `<header class="art-band" style="--band:${o.band};--band-ink:${o.ink}"><div class="art-head">
      <div class="kicker-tag">${o.tag}</div>
      <div class="art-meta"><span>Special edition</span><span>29 Oct 2026</span><span>${o.meta}</span></div>
      <h1 class="art-title">${o.title}</h1>
      <p class="art-strap">${o.strap}</p>
      <p class="art-by"><i>by</i><a href="https://the-ken.com/writers/anuj_269/" target="_blank" rel="noopener">Anuj Debnath</a></p>
      ${o.art ? `<div class="art-art">${o.art}</div>` : ''}</div></header>`;
  }
  function footer(side) {
    const other = side === 'r'
      ? { go: 'philosophies', k: '02 · Philosophies', t: 'Why we give: 41 beliefs, agree with three' }
      : { go: 'recommendations', k: '01 · Recommendations', t: 'What to give: 64 gifts readers actually gave' };
    return `<footer class="site-foot"><div class="sf-inner">
      <div class="sf-sec"><h2 class="sf-h">The other half</h2>
        <button class="sf-other" onclick="GF.go('${other.go}')"><span><span class="label">${other.k}</span><b>${other.t}</b></span><span class="arrow">→</span></button></div>
      <div class="sf-sec"><h2 class="sf-h">Share this</h2><div class="sf-links">
        <a class="sf-btn" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent('What makes a gift land? ' + location.href)}">WhatsApp</a>
        <a class="sf-btn" target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?url=${encodeURIComponent(location.href)}">X</a>
        <a class="sf-btn" target="_blank" rel="noopener" href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(location.href)}">LinkedIn</a>
        <button class="sf-btn" onclick="GF.copy(location.href,'Link copied')">Copy link</button></div></div>
      <div class="sf-sec"><h2 class="sf-h">Credits</h2><p>Designed and developed by Anuj Debnath.</p><p><span class="ph">[ADD: survey, research and editing credits]</span></p></div>
      <div class="sf-sec"><h2 class="sf-h">About the data</h2>
        <p>These answers come from The Ken’s reader surveys on gifting between 2024 and 2026: one asking for gift recommendations, the other about how readers think about giving. It is not a representative sample.</p>
        <p>Similar answers were grouped by hand. The count on a card or tag is how many answers said something like it, across all years. We quote only readers who agreed to be quoted, and credit them by initials, city and age band, or as “Reader”. Quotes are lightly edited for length.</p>
        <p>Price bands: free; ₹ under ₹3,000; ₹₹ ₹3,000–12,000; ₹₹₹ ₹12,000–35,000; ₹₹₹₹ ₹35,000–50,000.</p></div>
      <div class="sf-bottom"><div class="sf-legal"><a href="https://the-ken.com/terms-and-conditions/" target="_blank" rel="noopener">Terms &amp; Conditions</a><span aria-hidden="true">•</span><a href="https://the-ken.com/privacy-policy/" target="_blank" rel="noopener">Privacy</a></div>
        <div class="sf-copy">© 2026 Kenrise Media Private Limited. All rights reserved</div></div>
      </div>
      <div class="sf-pile" id="sfPile"></div>
      <div class="sf-inner"><div class="sf-mark"><img src="${ASSETS}assets/logo.png" alt="The Ken"></div></div></footer>`;
  }

  /* ================= RECOMMENDATIONS ================= */
  // One section per kind of gift; each section's tags hang on their own string that scrolls sideways
  function recommendations() {
    const sample = shuffle(LIVE_G.filter(g => g.n >= 40)).slice(0, 3);
    const ap = ORDER.filter(id => cById(id).apart), main = ORDER.filter(id => !ap.includes(id));
    return bar('r') + artHead({
      band: 'var(--side-r)', ink: 'var(--ink)', tag: 'Gifting · Recommendations', meta: `${TAG_COUNT} tags`,
      title: 'Every gift here came with a person attached',
      strap: 'We asked readers what to give and kept only the gifts that came with a reason. So the reason is the headline. The thing itself is in the small print.',
      art: sample.map((g, i) => tagHTML(g, { static: true, width: 200, r: [-5, 2, 6][i], stringH: 26, bg: 'var(--side-r)' })).join('')
    }) + `
    <section class="nl context">
      <span class="ph">PLACEHOLDER COPY</span>
      <p>Three years of answers, sorted into <b>sixteen kinds of gift</b>. No brands on the front, no product photos, nothing above about ₹50,000.</p>
      <p>Each tag is one reader and one gift. When more readers recommended the same thing, each of them gets a tag too, marked <b>Said again</b>. That’s ${TAG_COUNT} tags for ${G.length} gifts. Some tags lead with why a reader gave it, some with the thing itself, some with the price.</p>
      ${legend()}
      <div class="reading"><p>This is an interactive story. Each kind of gift has its own string: scroll it sideways. Tap a tag to keep it, or to tell us you gave it. Your gift box at the bottom of the screen fills as you go.</p><p>Your answers wait in this browser until you sign in at checkout. Nothing is sent before that.</p></div>
    </section>
    ${qcard({ id: 'who', n: 1, label: 'Before we start', q: 'Who’s hard to buy for this year?', why: 'Tell us who. We’ll mark the gifts readers gave to someone like them.', kind: 'text', placeholder: 'My dad, who wants nothing…', submit: 'Show me', skip: 'Just browsing ↓', foot: '152 readers told us who is hardest to buy for' })}
    ${main.map(id => sectionHTML(cById(id))).join('')}
    <div class="apart"><div class="apart-h"><span class="label" style="color:#D9CECD">Set apart</span><p class="note" style="margin-top:6px;font-size:16px">Two more. One is a person; the other is not buying.</p></div>${ap.map(id => sectionHTML(cById(id))).join('')}</div>
    ${qcard({ id: 'missed', n: 2, label: 'Your turn', q: 'What gift is missing from these strings?', why: 'One you gave that landed: the gift, who it was for, and why it worked. One line is enough.', kind: 'text', kinds: true, placeholder: 'A fountain pen for my sister, because…', submit: 'Send' })}
    <section class="sec" id="end"><div class="sec-head"><div class="sec-num"><b>END</b><span></span></div><h2>Your gift box</h2><p class="dek">Every gift you add gets a box. Bigger price, bigger box.</p></div>
      <div class="ask"><div class="endcard boxcard" id="endcard">${boxPanel()}</div></div></section>
    ${footer('r')}`;
  }
  function legend() {
    const coins = n => `<span class="coin">${'<i>₹</i>'.repeat(n)}</span>`;
    return `<div class="legend"><div class="label">Price</div><div class="items">
      <span><span class="coin"><i style="background:none;border:1px dashed var(--muted);color:var(--muted);width:auto;padding:0 4px;border-radius:7px">FREE</i></span></span>
      <span>${coins(1)} under ₹3K</span><span>${coins(2)} ₹3–12K</span><span>${coins(3)} ₹12–35K</span><span>${coins(4)} ₹35–50K</span></div>
      <div class="note">A range lights up more than one coin: a gift that can cost ₹3K or ₹30K shows two.</div></div>`;
  }
  function sectionHTML(c) {
    const ts = tagsFor(c.id), gifts = G.filter(g => g.c === c.id).length, again = ts.length - gifts;
    return `<section class="sec" id="${c.id}" style="--sc:${tagColour(c.id)}"><div class="sec-head">
      <div class="sec-num"><b>${c.n}</b><span></span></div><h2>${E(c.name)}</h2><p class="dek"><em>${E(c.enemy)}</em></p>
      <p class="note meta">${gifts} ${gifts === 1 ? 'gift' : 'gifts'}${again ? `, ${again} said again by other readers` : ''} · ${c.total} kinds came up in all</p></div>
      <div class="rail-wrap at-start">
        <button class="rail-arrow prev" onclick="GF.railBy('${c.id}',-1)" aria-label="Scroll ${E(c.name)} left">←</button>
        <div class="rail" id="r-${c.id}" tabindex="0" aria-label="${E(c.name)}: ${ts.length} tags. Scroll sideways."><div class="strand" style="--sc:${tagColour(c.id)}">${ts.map(t => tagHTML(t.g, { qi: t.qi })).join('')}</div></div>
        <button class="rail-arrow next" onclick="GF.railBy('${c.id}',1)" aria-label="Scroll ${E(c.name)} right">→</button>
      </div>
      <div class="rail-status"><div class="rail-track"><i></i></div><span class="note">${ts.length} tags · scroll →</span></div></section>`;
  }

  /* ---------- section strings: arrows, drag, how far along ---------- */
  function railBy(cid, dir) { const r = document.getElementById('r-' + cid); r && r.scrollBy({ left: dir * r.clientWidth * .8, behavior: 'smooth' }); }
  function railShow(el, smooth) {
    const r = el && el.closest('.rail'); if (!r) return;
    const left = el.getBoundingClientRect().left - r.getBoundingClientRect().left + r.scrollLeft - 40;
    r.scrollTo({ left, behavior: smooth === false ? 'auto' : 'smooth' });
  }
  document.addEventListener('pointerenter', e => {
    const t = e.target.closest && e.target.closest('.rail .gtag, .wall .bcard');
    if (t && e.pointerType === 'mouse' && !t.classList.contains('swinging')) t.classList.add('swinging', 'hung');
  }, true);
  document.addEventListener('animationend', e => {
    const t = e.target.classList && (e.target.classList.contains('gtag') || e.target.classList.contains('bcard')) ? e.target : null; if (!t) return;
    if (e.animationName === 'gk-hang' || e.animationName === 'gk-pegin') t.classList.add('hung');
    if (e.animationName === 'gk-swing' || e.animationName === 'gk-sway') t.classList.remove('swinging');
  });
  let drag = null;
  window.addEventListener('pointermove', e => { if (!drag) return; const dx = e.clientX - drag.x; if (Math.abs(dx) > 5) { drag.moved = true; drag.r.classList.add('dragging'); } if (drag.moved) drag.r.scrollLeft = drag.left - dx; });
  window.addEventListener('pointerup', () => { if (drag) { drag.r.classList.remove('dragging'); if (!drag.moved) drag = null; else setTimeout(() => { drag = null; }, 0); } });
  function railWatch() {
    document.querySelectorAll('.rail').forEach(r => {
      const wrap = r.parentNode, bar = wrap.nextElementSibling.querySelector('i');
      let tick = false;
      const update = () => {
        tick = false; const max = r.scrollWidth - r.clientWidth;
        bar.style.width = (max > 0 ? Math.max(.08, (r.scrollLeft + r.clientWidth) / r.scrollWidth) * 100 : 100) + '%';
        wrap.classList.toggle('at-start', r.scrollLeft < 8); wrap.classList.toggle('at-end', r.scrollLeft > max - 8);
        wrap.nextElementSibling.classList.toggle('fits', max <= 8);
      };
      r.addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(update); } }, { passive: true });
      update();
      // drag to scroll with a mouse; a drag doesn't count as a tap on a tag
      r.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse' || e.button !== 0) return; drag = { r, x: e.clientX, left: r.scrollLeft, moved: false }; });
      r.addEventListener('click', e => { if (drag && drag.moved) { e.stopPropagation(); e.preventDefault(); } drag = null; }, true);
      r.addEventListener('keydown', e => { if (e.target !== r) return; if (e.key === 'ArrowRight') r.scrollBy({ left: r.clientWidth * .8, behavior: 'smooth' }); if (e.key === 'ArrowLeft') r.scrollBy({ left: -r.clientWidth * .8, behavior: 'smooth' }); });
    });
  }

  /* ---------- the gift box: one box per gift, bigger price → bigger box ---------- */
  const inBox = () => kept.map(id => G.find(g => g.id === id)).filter(Boolean);
  const fmtK = k => k === 0 ? '₹0' : k >= 100 ? '₹' + (k / 100).toFixed(1).replace(/\.0$/, '') + 'L' : '₹' + k + 'K';
  function boxTotal(gs) { const t = gs.reduce((a, g) => { const [lo, hi] = GiftTag.priceRange(g.b); return [a[0] + lo, a[1] + hi]; }, [0, 0]); return t[1] === 0 ? 'free' : `${fmtK(t[0])}–${fmtK(t[1])}`; }
  let lastAdded = null;
  // A pile of 3D boxes in set spots: the first box sits front and centre, the next ones go behind,
  // then on top, then out to the sides. Bigger gifts get the lower spots; boxes further back are drawn first.
  const SPOTS = [
    { x: 0, y: 0, z: 10, s: 1 },        // front centre
    { x: -88, y: -26, z: 6, s: .95 },   // behind, left
    { x: 86, y: -24, z: 6, s: .95 },    // behind, right
    { on: 0, x: 6, z: 11, s: .78 },     // on the first
    { x: -168, y: 4, z: 12, s: .9 },    // front left
    { x: 166, y: 6, z: 12, s: .9 },     // front right
    { x: -30, y: -48, z: 3, s: .9 },    // far back
    { x: 40, y: -50, z: 2, s: .85 },
    { on: 1, x: -4, z: 7, s: .76 },     // on the back two
    { on: 2, x: 4, z: 7, s: .76 },
    { on: 3, x: -2, z: 12, s: .8 },     // top of the centre stack
    { x: -96, y: 22, z: 14, s: .72 },   // small ones at the front
    { x: 98, y: 24, z: 14, s: .72 },
    { on: 4, x: 4, z: 13, s: .78 },
    { on: 5, x: -4, z: 13, s: .78 },
    { x: -240, y: -10, z: 5, s: .8 },
    { x: 238, y: -8, z: 5, s: .8 },
    { x: 0, y: 34, z: 16, s: .62 }
  ];
  /* ---------- the footer pile: wrapped boxes along the bottom edge that hop when you touch them ----------
     On Recommendations your kept gifts are in it (bigger, in their kind's colour, named on hover).
     Every box opens your checkout. Boxes stacked on a box hop with it. */
  const PILE_COLS = ['#C8423A', '#4A9E9A', '#4A7A5A', '#7A9E4A', '#3D3D3D', '#A89880', '#E9C6C4', '#D9B98A', '#F3E9D2', '#2F5D8A', '#B0475F'];
  // one box: shape 'cube' (any height, flat parcel to tall box) or 'round' (a hatbox); --top is where a box on it rests
  function fbox(w, col, opts, child) {
    opts = opts || {};
    const shape = opts.shape || 'cube', hr = opts.hr || .66, title = opts.title || '';
    const rib = GiftTag.isDark(col) ? '#F7F2F2' : '#C8423A', ribS = shade(rib, .8), rw = Math.max(5, w * .12), bow = w * .2;
    const bowSVG = (cx, cy) => `<g transform="translate(${cx} ${cy})"><path d="M0,0 c${-w * .26},${-w * .2} ${-w * .3},${w * .03} 0,0 z M0,0 c${w * .26},${-w * .2} ${w * .3},${w * .03} 0,0 z" fill="${rib}" stroke="#1A1208" stroke-width="1.5" stroke-linejoin="round"/><circle r="${Math.max(2.5, w * .04)}" fill="${rib}" stroke="#1A1208" stroke-width="1.3"/></g>`;
    let W, H, top, body;
    if (shape === 'round') {
      const h = Math.round(w * hr), ry = w * .17, x0 = 2, y0 = bow + ry + 2, cx = x0 + w / 2;
      W = w + 4; H = y0 + h + ry + 2; top = y0;
      body = `<path d="M${x0},${y0} v${h} a${w / 2},${ry} 0 0 0 ${w},0 v${-h} z" fill="${col}" stroke="#1A1208" stroke-width="2" stroke-linejoin="round"/>
        <rect x="${cx - rw / 2}" y="${y0}" width="${rw}" height="${h + ry}" fill="${rib}" stroke="#1A1208" stroke-width="1.2"/>
        <ellipse cx="${cx}" cy="${y0}" rx="${w / 2}" ry="${ry}" fill="${shade(col, 1.18)}" stroke="#1A1208" stroke-width="2"/>
        <path d="M${cx - rw / 2},${y0 - ry} h${rw} v${ry * 2} h${-rw} z" fill="${ribS}" stroke="#1A1208" stroke-width="1.2"/>${bowSVG(cx, y0)}`;
    } else {
      const h = Math.round(w * hr), d = w * .34, dx = d * .62, dy = d * .5, x0 = 2, y0 = dy + bow + 2, cx = x0 + w / 2;
      W = w + dx + 4; H = y0 + h + 2; top = dy + bow;
      body = `<path d="M${x0 + w},${y0} l${dx},${-dy} v${h} l${-dx},${dy} z" fill="${shade(col, .72)}" stroke="#1A1208" stroke-width="2" stroke-linejoin="round"/>
        <rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="${col}" stroke="#1A1208" stroke-width="2"/>
        <path d="M${x0},${y0} h${w} l${dx},${-dy} h${-w} z" fill="${shade(col, 1.18)}" stroke="#1A1208" stroke-width="2" stroke-linejoin="round"/>
        <rect x="${cx - rw / 2}" y="${y0}" width="${rw}" height="${h}" fill="${rib}" stroke="#1A1208" stroke-width="1.2"/>
        <path d="M${cx - rw / 2},${y0} h${rw} l${dx},${-dy} h${-rw} z" fill="${ribS}" stroke="#1A1208" stroke-width="1.2" stroke-linejoin="round"/>${bowSVG(cx + dx / 2, y0 - dy / 2)}`;
    }
    return `<div class="fbox" style="width:${W.toFixed(0)}px;height:${H.toFixed(0)}px;--top:${top.toFixed(0)}px;--dl:${(opts.dl || 0).toFixed(2)}s" ${title ? `title="${E(title)}" aria-label="${E(title)}"` : ''} role="button" tabindex="-1" onclick="GF.openDock()">
      <svg viewBox="0 0 ${W.toFixed(1)} ${H.toFixed(1)}" width="${W.toFixed(0)}" height="${H.toFixed(0)}" aria-hidden="true">${body}</svg>${child || ''}</div>`;
  }
  function footerPile() {
    const host = $('#sfPile'); if (!host) return;
    // only in the empty margins beside the footer's centre column, never over the text or the logo
    const W = host.clientWidth, inner = host.parentNode.querySelector('.sf-inner').getBoundingClientRect(), left = host.getBoundingClientRect().left;
    const CLEAR = 48, zones = [[-12, inner.left - left - CLEAR], [inner.right - left + CLEAR, W + 12]].filter(([a, b]) => b - a >= 90);
    if (!zones.length) { host.innerHTML = ''; return; }
    let sd = 11; const r = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
    const pick = () => PILE_COLS[Math.floor(r() * PILE_COLS.length)];
    // a mix of shapes: flat parcels, cubes, tall boxes, hatboxes
    const look = () => { const v = r(); return v < .2 ? { shape: 'round', hr: .45 + r() * .4 } : v < .4 ? { hr: .38 + r() * .14 } : v < .6 ? { hr: 1 + r() * .3 } : { hr: .55 + r() * .3 }; };
    const mine = currentSide === 'r' ? inBox() : [];
    const out = []; let i = 0, m = 0;
    // a stack: each box sits on the one below, a bit narrower, until it runs out of height or luck
    function stack(w, level, x) {
      if (level > 3 || w < 24 || r() > [.95, .85, .7, .5][level]) return '';
      const w2 = Math.round(w * (.6 + r() * .25)), off = Math.round((w - w2) * r());
      return `<div class="fbox-on" style="left:${off}px">${fbox(w2, pick(), Object.assign(look(), { dl: x + level * .06 }), stack(w2, level + 1, x))}</div>`;
    }
    for (const [z0, z1] of zones) for (let x = z0; ;) {
      const g = i % 2 === 1 && m < mine.length ? mine[m] : null;
      const w = Math.round(g ? 84 + r() * 14 : 46 + r() * 40), lk = g ? { hr: .66 } : look();
      if (x + w + w * .22 > z1) break;
      if (g) m++;
      const dl = (x / Math.max(W, 1)) * .5;
      out.push(`<div class="fbox-slot" style="left:${x}px">${fbox(w, g ? tagColour(g.c) : pick(), Object.assign(lk, { title: g ? `${g.it} · in your gift box` : 'Open your gift box', dl }), stack(w, 0, dl + .06))}</div>`);
      x += w + Math.round(w * .2 + r() * 6); i++;
    }
    host.innerHTML = out.join('');
    watchEnd();
  }
  // reaching the end of the page: every box jumps, in a wave, every time
  let endIO = null;
  function watchEnd() {
    if (endIO) endIO.disconnect();
    const mark = document.querySelector('.site-foot .sf-mark');
    if (!mark || !('IntersectionObserver' in window)) return;
    endIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) document.querySelectorAll('.sf-pile .fbox').forEach(b => { b.classList.remove('hop', 'wave'); void b.offsetWidth; b.classList.add('wave'); }); }), { threshold: .9 });
    endIO.observe(mark);
  }
  let pileT; addEventListener('resize', () => { clearTimeout(pileT); pileT = setTimeout(footerPile, 200); });
  // a box hops when the pointer arrives (or on tap), plays out, lands; boxes on it go along
  document.addEventListener('pointerenter', e => { const b = e.target.closest && e.target.closest('.fbox'); if (b && e.target === b && !b.classList.contains('hop')) b.classList.add('hop'); }, true);
  document.addEventListener('animationend', e => { if (e.animationName === 'gk-hop') e.target.classList.remove('hop', 'wave'); });

  const shade = (hex, f) => { const [r, g, b] = [1, 3, 5].map(k => parseInt(hex.slice(k, k + 2), 16)); return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v * f)))).map(v => v.toString(16).padStart(2, '0')).join(''); };
  function boxesSVG(gs, opts) {
    opts = opts || {};
    if (!gs.length) return `<svg class="pile" viewBox="0 0 300 170" role="img" aria-label="An empty gift box"><ellipse cx="150" cy="150" rx="100" ry="9" fill="#1A1208" opacity=".07"/><path d="M95 70 h100 l26 -20 h-100 z" fill="none" stroke="#B9A9A7" stroke-width="2.5" stroke-dasharray="7 6" stroke-linejoin="round"/><path d="M95 70 v76 h100 v-76 M195 146 l26 -20 v-76" fill="none" stroke="#B9A9A7" stroke-width="2.5" stroke-dasharray="7 6" stroke-linejoin="round"/><text x="145" y="114" text-anchor="middle" font-family="GT America, Arial" font-size="12" fill="#8A7B78">empty</text></svg>`;
    const SZ = [70, 76, 90, 106, 122];
    const items = gs.map(g => { const hi = GiftTag.bandRange(g.b)[1], h0 = GiftTag.hash(g.id); return { g, w: SZ[hi], hr: .62 + (h0 % 4) * .08, rot: ((h0 >> 3) % 7) - 3, col: tagColour(g.c) }; })
      .sort((a, b) => b.w - a.w);
    const shown = items.slice(0, SPOTS.length), extra = items.length - shown.length, placed_ = [];
    // place each box: its front face sits at (x, bottom); a box "on" another sits on that box's top face
    const placed = shown.map((it, k) => {
      const sp = SPOTS[k], w = it.w * sp.s, h = w * it.hr, d = w * .34;
      let x, bottom;
      if (sp.on != null && placed_[sp.on]) { const u = placed_[sp.on]; x = u.cx + sp.x; bottom = u.top - u.d * .18; }
      else { x = sp.x; bottom = sp.y; }
      const b = { it, sp, w, h, d, cx: x, bottom, top: bottom - h, z: sp.z + k * .01 };
      placed_[k] = b; return b;
    });
    function boxSVG(b) {
      const { it, w, h, d } = b, x0 = b.cx - w / 2, y1 = b.bottom, y0 = b.top, dx = d * .62, dy = d * .5;
      const front = it.col, top = shade(it.col, 1.18), side = shade(it.col, .72);
      const rib = GiftTag.isDark(it.col) ? '#F7F2F2' : '#C8423A', ribS = shade(rib, .8), rw = Math.max(7, w * .12);
      const cxF = x0 + w / 2;
      return `<g class="bx ${it.g.id === lastAdded && opts.animate ? 'new' : ''}" transform="rotate(${it.rot * .6} ${b.cx} ${y1})"><title>${E(it.g.it)} · ${GiftTag.priceLabel(it.g.b)}</title>
        <path d="M${x0 + w},${y0} l${dx},${-dy} v${h} l${-dx},${dy} z" fill="${side}" stroke="#1A1208" stroke-width="2" stroke-linejoin="round"/>
        <rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="${front}" stroke="#1A1208" stroke-width="2"/>
        <path d="M${x0},${y0} h${w} l${dx},${-dy} h${-w} z" fill="${top}" stroke="#1A1208" stroke-width="2" stroke-linejoin="round"/>
        <rect x="${cxF - rw / 2}" y="${y0}" width="${rw}" height="${h}" fill="${rib}" stroke="#1A1208" stroke-width="1.3"/>
        <path d="M${cxF - rw / 2},${y0} h${rw} l${dx},${-dy} h${-rw} z" fill="${ribS}" stroke="#1A1208" stroke-width="1.3" stroke-linejoin="round"/>
        <path d="M${x0 + w},${y0 + h * .45} l${dx},${-dy} v${rw} l${-dx},${dy} z" fill="${ribS}" stroke="#1A1208" stroke-width="1.3" stroke-linejoin="round"/>
        <g transform="translate(${cxF + dx / 2} ${y0 - dy / 2})"><path d="M0,0 c${-w * .26},${-w * .2} ${-w * .3},${w * .03} 0,0 z M0,0 c${w * .26},${-w * .2} ${w * .3},${w * .03} 0,0 z" fill="${rib}" stroke="#1A1208" stroke-width="1.6" stroke-linejoin="round"/><circle r="${Math.max(3, w * .04)}" fill="${rib}" stroke="#1A1208" stroke-width="1.4"/></g></g>`;
    }
    const minX = Math.min(...placed.map(b => b.cx - b.w / 2)) - 14, maxX = Math.max(...placed.map(b => b.cx + b.w / 2 + b.d * .62)) + 14;
    const minY = Math.min(...placed.map(b => b.top - b.d * .5 - b.w * .22)) - 8, maxY = Math.max(...placed.map(b => b.bottom)) + 18;
    const W = Math.max(maxX - minX, 260), cx = (minX + maxX) / 2;
    return `<svg class="pile" viewBox="${cx - W / 2} ${minY} ${W} ${maxY - minY}" role="img" aria-label="${gs.length} wrapped gift boxes in a pile">
      <ellipse cx="${cx + 10}" cy="${Math.max(...placed.map(b => b.bottom)) + 4}" rx="${(maxX - minX) / 2}" ry="10" fill="#1A1208" opacity=".1"/>
      ${placed.slice().sort((a, b) => a.z - b.z).map(boxSVG).join('')}
      ${extra > 0 ? `<text x="${maxX - 10}" y="${maxY - 4}" text-anchor="end" font-family="GT America Bold, Arial" font-weight="bold" font-size="13" fill="#1A1208">+${extra} more</text>` : ''}</svg>`;
  }
  /* ---------- the generated card: the picture and every answer at once ----------
     Each answer sits under the question it answers, so the card reads on its own when shared. */
  const qa = (q, a, to, cta, plain) => a != null && a !== ''
    ? `<div class="gc-qa"><span class="q">${E(q)}</span><span class="a">${plain ? E(a) : '“' + E(a) + '”'}</span></div>`
    : `<div class="gc-qa todo"><span class="q">${E(q)}</span><button class="skip" onclick="GF.closeOv();GF.jump('${to}')">${cta || 'Answer it'} ↑</button></div>`;
  const givenGifts = () => store.landed().map(id => G.find(g => g.id === id)).filter(Boolean);
  function giftCard(animate) {
    const gs = inBox(), m = mine(), given = givenGifts(), added = Object.keys(m).filter(k => k.startsWith('missed:') && cById(k.split(':')[1]));
    return `<div class="gc">
      <div class="gc-art">${boxesSVG(gs, { animate })}<p class="gc-cap">${gs.length ? `${gs.length} ${gs.length === 1 ? 'gift' : 'gifts'} · roughly <b>${boxTotal(gs)}</b>` : 'Your gift box is empty'}</p></div>
      <div class="gc-body"><span class="label gc-k">My gift card · The Ken’s Gifting 2026</span>
        ${qa('Who’s hard to buy for this year?', m['hero:recommendations'], 'ask-who', 'Tell us')}
        <div class="gc-sec"><span class="label">In my gift box · ${gs.length}</span>
          ${gs.length ? `<ol class="box-list">${gs.map(g => `<li style="--sc:${tagColour(g.c)}" data-card="${g.id}"><i></i><span>${E(g.it)}<small>${GiftTag.priceLabel(g.b)} · ${E(cById(g.c).name)}</small></span><button onclick="GF.unbox('${g.id}')" aria-label="Take ${E(g.it)} out">×</button></li>`).join('')}</ol>` : '<p class="note">Tap a tag, then Keep.</p>'}</div>
        <div class="gc-sec"><span class="label">Gifts I gave that landed · ${given.length}</span>
          ${given.length ? `<ol class="gave-list">${given.map(g => { const h = m[`how:${g.id}`] || {}; return `<li style="--sc:${tagColour(g.c)}" data-card="${g.id}"><i></i><div><b>${E(g.it)}</b>
            ${h.who ? `<span><em>For</em>${E(h.who)}</span>` : ''}${h.how ? `<span><em>How it went</em>“${E(h.how)}”</span>` : ''}
            ${!h.who && !h.how ? `<button class="skip" onclick="GF.closeOv();GF.toTag('${g.id}')">Add who it was for →</button>` : ''}</div></li>`; }).join('')}</ol>` : '<p class="note">Gave one of these? Open its tag and tap “I gave this, it landed”.</p>'}</div>
        ${added.length ? `<div class="gc-sec"><span class="label">A gift I’d add to the strings</span>${added.map(k => qa(`For ${cById(k.split(':')[1]).name}`, m[k])).join('')}</div>` : ''}
      </div></div>`;
  }
  function sendCta() {
    const n = waitingCount();
    return store.user() ? `<span class="note">Saved to ${E(store.user())}</span>` : n ? `<button class="pill red" onclick="GF.openDock()">Send ${n} to The Ken →</button>` : '';
  }
  function boxPanel(animate, inSheet) {
    return `${giftCard(animate)}${inSheet ? '' : `<div class="acts">${sendCta()}</div>`}`;
  }
  // the checkout button, bottom centre, always in view on Recommendations
  function checkoutHTML() {
    const gs = inBox();
    return `<span class="ck-icon"><svg viewBox="0 0 34 30" aria-hidden="true"><rect x="4" y="11" width="26" height="17" fill="${gs.length ? '#C8423A' : 'none'}" stroke="currentColor" stroke-width="2"/><rect x="2" y="6" width="30" height="7" fill="${gs.length ? '#C8423A' : 'none'}" stroke="currentColor" stroke-width="2"/><rect x="15" y="6" width="4" height="22" fill="currentColor"/><path d="M17 6 c-6,-6 -9,0 0,0 z M17 6 c6,-6 9,0 0,0 z" fill="none" stroke="currentColor" stroke-width="1.8"/></svg><b>${gs.length}</b></span>
      <span class="ck-txt"><b>Gift box</b><small>${gs.length ? `${gs.length} ${gs.length === 1 ? 'gift' : 'gifts'} · ${boxTotal(gs)}` : 'Empty · add a tag'}</small></span><span class="ck-go">Checkout →</span>`;
  }
  function refreshBox(animate) {
    const ck = $('#checkout'); if (ck) ck.innerHTML = checkoutHTML();
    refreshDock(animate && dockTab === 'r');
    const ec = $('#endcard'); if (ec && currentSide === 'r') { ec.innerHTML = boxPanel(animate); footerPile(); }
  }
  // Checkout: both cards in one pop-up, with a toggle; then sign in and send (scripts/gifting/signin.js)
  let dockTab = 'r';
  const dockCard = animate => dockTab === 'r' ? boxPanel(animate, true) : threePanel(animate, true);
  function dockTabs() {
    const tab = (k, label, n) => `<button role="tab" aria-selected="${dockTab === k}" class="${dockTab === k ? 'on' : ''}" onclick="GF.dockSwitch('${k}')">${label}<small>${n}</small></button>`;
    return tab('r', 'Gift box', `${inBox().length} kept · ${givenGifts().length} given`) + tab('p', 'Your three', `${picks.length} of 3`);
  }
  function openDock(tab) {
    dockTab = tab === 'r' || tab === 'p' ? tab : currentSide === 'p' ? 'p' : 'r';
    ov(`<div class="big box-sheet" id="dockSheet" role="document"><button class="x" onclick="GF.closeOv()" aria-label="Close">×</button>
      <div class="dock-tabs" role="tablist" aria-label="Your cards" id="dockTabs">${dockTabs()}</div>
      <div id="sheetCard" role="tabpanel">${dockCard(false)}</div><div id="signin-host"></div></div>`, 'var(--red)');
    renderSignIn($('#signin-host'));
  }
  function dockSwitch(tab) { dockTab = tab; refreshDock(false); }
  function refreshDock(animate) {
    if (!$('#dockSheet')) return;
    $('#dockTabs').innerHTML = dockTabs();
    $('#sheetCard').innerHTML = dockCard(animate);
  }
  function openBox() { openDock('r'); }
  function openSignIn() { ov(`<div class="big box-sheet narrow" id="signSheet" role="document"><button class="x" onclick="GF.closeOv()" aria-label="Close">×</button><div id="signin-host"></div></div>`, 'var(--red)'); renderSignIn($('#signin-host')); }

  /* ================= PHILOSOPHIES ================= */
  const ASK = {
    s1: { q: 'In one line: a great gift is one that…', label: 'We asked', kind: 'text', placeholder: '…they use every day', foot: '159 readers answered in 2026', echo: true },
    s2: { q: 'What feeling do you most want a gift to create?', label: 'We asked', kind: 'tap', options: FEEL.map(f => f[0]), why: 'Pick one to see how readers answered.', foot: '154 readers answered in 2026' },
    s3: { q: 'Who is hardest for you to buy for, and what finally worked?', label: 'We asked', kind: 'text', placeholder: 'My mother-in-law. A…', foot: '152 readers answered in 2026', echo: true },
    s4: { q: 'What would you love to get, but never buy yourself?', label: 'We asked', kind: 'text', placeholder: 'A really good…, because…', why: 'And why not?', foot: '143 readers answered in 2026', echo: true },
    s5: { q: 'What would you spend on a gift for a close friend or family member?', label: 'We asked', kind: 'slider', max: 20000, step: 500, why: 'Drag the slider. Your marker moves against what readers said.', foot: '638 readers answered in 2024 and 2026' }
  };
  const SDEK = {
    s1: 'What readers think a gift is actually for.',
    s2: 'The feeling a gift should leave behind.',
    s3: 'The people nobody knows how to buy for, and the occasions that make us try.',
    s4: 'The things readers want, but won’t buy for themselves.',
    s5: 'What a good gift should cost, and who gets the budget.'
  };
  const FEEL_N = FEEL.reduce((a, f) => a + f[1], 0);
  function philosophies() {
    return bar('p') + artHead({
      band: 'var(--side-p)', ink: '#F7F2F2', tag: 'Gifting · Philosophies', meta: `${B.length} beliefs`,
      title: 'Every gift has two people in it',
      strap: 'One is trying to say something. The other is trying to work out what. Here is what readers of The Ken believe about giving.',
      art: `<div class="art-hand">${shuffle(B.filter(b => !b.vs && b.h.length < 60 && b.n > 20)).slice(0, 3).map((b, i) => `<div class="bcard v-index M" style="--sc:${SC[b.s]};--i:${i};pointer-events:none"><div class="quote">“${E(b.h)}”</div><div class="count"><b>${b.n}</b><small>readers</small></div></div>`).join('')}</div>`
    }) + `
    <section class="nl context">
      <span class="ph">PLACEHOLDER COPY</span>
      <p>Ask readers about the best gift they ever gave and they remember a face. Ask about the best one they got and they tell you how often they use it.</p>
      <p>We’ve asked The Ken’s subscribers and readers about giving for three years now. Their answers settled into <b>${B.length} beliefs</b> about what a gift is for, who makes it hard, and what it should cost.</p>
      <p>Each card is one belief, in one reader’s words. The big number is how many readers said something like it.</p>
      <div class="pick3" role="note"><span class="pick3-slots" aria-hidden="true"><i></i><i></i><i></i></span><div><b>Pick three. Only three.</b><p>Tap the beliefs you agree with and +1 them. Your three fill up at the bottom of the screen, and at the end we’ll tell you what kind of giver you are.</p></div></div>
      <div class="reading"><p>This is an interactive story. Answer the questions as you go: they all end up on your card at the end.</p><p>Your answers wait in this browser until you sign in. Nothing is sent before that.</p></div>
    </section>
    ${qcard({ id: 'mine', n: 1, label: 'Before we start', q: 'Do you have a philosophy about gifting?', why: 'Write it in a line. We’ll find the readers who think like you.', kind: 'text', placeholder: 'Mine is…', submit: 'That’s mine', skip: 'I don’t. Show me theirs ↓', dark: true })}
    ${SECS.map((s, i) => {
      const cards = cardsFor(s.id);
      return `<section class="sec" id="${s.slug}" style="--sc:${SC[s.id]}"><div class="sec-head"><div class="sec-num"><b>${s.n}</b><span></span></div><h2>${E(s.name)}</h2>
        <p class="dek">${SDEK[s.id]}</p><p class="note meta">${cards.length} beliefs · shuffled</p></div>
        ${qcard(Object.assign({ id: s.id, n: i + 2 }, ASK[s.id]))}
        <div class="wall">${cards.join('')}</div></section>`; }).join('')}
    <section class="sec" id="end"><div class="sec-head"><div class="sec-num"><b>END</b><span></span></div><h2>Your gifting philosophy</h2><p class="dek">Three beliefs, in other readers’ words, and what they say about you.</p></div>
      <div class="ask"><div class="endcard boxcard" id="endcard">${threePanel()}</div></div></section>
    ${footer('p')}`;
  }
  // budget slider: your marker moves against the medians as you drag
  const MED_GIVE = BUDGET.give, MED_GET = BUDGET.get, fmtR = x => '₹' + Math.round(x).toLocaleString('en-IN');
  function budgetChart(v) {
    const max = 20000, X = x => 4 + Math.min(x, max) / max * 92;
    return `<div class="strip"><div class="axis">${[0, 5000, 10000, 15000, 20000].map(t => `<span style="left:${X(t)}%">${t ? '₹' + t / 1000 + 'K' : '₹0'}</span>`).join('')}</div>
      <i class="mk get" style="left:${X(MED_GET)}%"><em>Readers want to get · ${fmtR(MED_GET)}</em></i>
      <i class="mk give" style="left:${X(MED_GIVE)}%"><em>Readers give · ${fmtR(MED_GIVE)}</em></i>
      <i class="mk you" style="left:${X(v)}%"><em>You · ${v >= max ? fmtR(max) + '+' : fmtR(v)}</em></i></div>`;
  }
  function slide(id, raw, done) {
    const v = +raw, r = $('#in-' + id); r.style.setProperty('--p', v / r.max * 100 + '%'); r.classList.add('set');
    $('#val-' + id).innerHTML = `<b>${v >= +r.max ? fmtR(v) + '+' : fmtR(v)}</b>`;
    you(id, `${budgetChart(v)}<p>${v > MED_GIVE ? `You’d spend <b>more</b> than most readers, ${(v / MED_GIVE).toFixed(1).replace(/\.0$/, '')}× the median.` : v < MED_GIVE ? `You’d spend <b>less</b> than most readers.` : 'You’re <b>exactly</b> at the median.'} Readers would give ${fmtR(MED_GIVE)}, but only want ${fmtR(MED_GET)} spent on them.</p>`);
    if (done) saveAnswer(QKEY[id], QLABEL[QKEY[id]], `₹${v.toLocaleString('en-IN')}${v >= +r.max ? '+' : ''}`, 'number');
  }

  /* ---------- your three: the dock, the hand of cards, your type ---------- */
  const TYPES = {
    s1: ['The Purposeful', 'A gift should do a job. You’d rather it got used than admired.'],
    s2: ['The Moment-Maker', 'You give for the look on their face when they open it.'],
    s3: ['The Problem-Solver', 'Give you the impossible person. You like a hard case.'],
    s4: ['The Indulger', 'You give people what they’d never buy themselves.'],
    s5: ['The Fair Accountant', 'You know what a gift should cost, and who deserves the budget.'],
    mix: ['The All-Rounder', 'A bit of everything. A safe pair of hands at any occasion.']
  };
  function myType() {
    const bs = picks.map(id => B.find(b => b.id === id)).filter(Boolean);
    if (bs.length < 3) return null;
    const n = {}; bs.forEach(b => n[b.s] = (n[b.s] || 0) + 1);
    const top = Object.entries(n).sort((a, b) => b[1] - a[1])[0];
    return TYPES[top[1] >= 2 ? top[0] : 'mix'];
  }
  let lastPicked = null;
  function handHTML(animate) {
    const bs = [0, 1, 2].map(i => B.find(b => b.id === picks[i]));
    return `<div class="hand">${bs.map((b, i) => b
      ? `<div class="hcard v-index ${animate && b.id === lastPicked ? 'new' : ''}" style="--i:${i};--sc:${SC[b.s]}"><span class="label">${SECS.find(s => s.id === b.s).n} · ${E(SECS.find(s => s.id === b.s).name)}</span><div class="quote">“${E(b.h.length > 110 ? b.h.slice(0, 108) + '…' : b.h)}”</div><small>with ${b.n - 1} other readers</small></div>`
      : `<div class="hcard empty" style="--i:${i}"><span>${i + 1}</span><small>+1 a card</small></div>`).join('')}</div>`;
  }
  function threePanel(animate, inSheet) {
    const bs = picks.map(id => B.find(b => b.id === id)).filter(Boolean), t = myType(), m = mine();
    const agree = bs.reduce((a, b) => a + b.n - 1, 0);
    return `<div class="gc">
      <div class="gc-art">${handHTML(animate)}<p class="gc-cap">${t ? `<b>${t[0]}</b>` : `${bs.length} of 3 picked`}</p></div>
      <div class="gc-body"><span class="label gc-k">My gifting philosophy · The Ken’s Gifting 2026</span>
        ${t ? `<h3 class="type">${t[0]}</h3><p class="box-total">${t[1]}</p><p class="note">Between them, my three beliefs are shared by ${agree} other readers.</p>`
          : `<p class="box-total">${bs.length ? `Pick ${3 - bs.length} more to see what kind of giver you are.` : 'Tap a card and +1 it. Three cards make your philosophy.'}</p>`}
        ${qa('My philosophy, in one line', m.q01, 'ask-mine', 'Write it')}
        <div class="gc-sec"><span class="label">The three beliefs I +1’d · ${bs.length}/3</span>
          ${bs.length ? `<ol class="box-list">${bs.map(b => `<li style="--sc:${SC[b.s]}" data-card="${b.id}"><i></i><span>“${E(b.h)}”<small>${b.n} readers · ${E(SECS.find(s => s.id === b.s).name)}</small></span><button onclick="GF.plus('${b.id}')" aria-label="Take back your +1">×</button></li>`).join('')}</ol>` : '<p class="note">Tap a card, then +1.</p>'}</div>
        <div class="gc-sec"><span class="label">What I told The Ken</span>
          ${qa('A great gift is one that…', m.q02, 'ask-s1')}${qa('The feeling I want a gift to create', m.q06, 'ask-s2', 'Pick one', true)}
          ${qa('Hardest to buy for, and what finally worked', m.q09, 'ask-s3')}${qa('What I’d love to get but never buy myself', m.q16, 'ask-s4')}
          ${qa('What I’d spend on someone close', m.q20, 'ask-s5', 'Set it', true)}</div>
      </div></div>
      ${inSheet ? '' : `<div class="acts">${sendCta()}</div>`}`;
  }
  function dockThreeHTML() {
    const n = picks.length;
    return `<span class="ck-slots">${[0, 1, 2].map(i => { const b = B.find(x => x.id === picks[i]); return `<i style="${b ? `background:${SC[b.s]}` : ''}" class="${b ? 'f' : ''}"></i>`; }).join('')}</span>
      <span class="ck-txt"><b>Your three</b><small>${n === 3 ? myType()[0] : n ? `${n} of 3 · pick ${3 - n} more` : 'Tap a card, then +1'}</small></span><span class="ck-go">${n === 3 ? 'See it →' : 'View →'}</span>`;
  }
  function refreshThree(animate) {
    const ck = $('#checkout'); if (ck) ck.innerHTML = dockThreeHTML();
    refreshDock(animate && dockTab === 'p');
    const ec = $('#endcard'); if (ec && currentSide === 'p') ec.innerHTML = threePanel(animate);
  }
  function openThree() { openDock('p'); }

  /* ---------- answering ---------- */
  function you(id, html) { const el = $('#you-' + id); if (el) el.innerHTML = html; }
  function echo(sec) { const b = shuffle(B.filter(x => x.s === sec && !x.vs))[0]; return b ? `<span class="echo">“${E(b.h)}”<span class="credit">${E(b.w)}</span></span>` : ''; }
  function submit(id) {
    const el = $('#in-' + id); const v = (el && el.value || '').trim();
    if (!v) { el && el.focus(); return; }
    if (id === 'missed') {
      const k = $('#kind-missed').value, c = cById(k);
      saveAnswer(`missed:${k}`, `A gift for ${c.name}`, v, 'text');
    } else saveAnswer(QKEY[id], QLABEL[QKEY[id]], v, 'text');
    if (id === 'mine') {
      const t = v.toLowerCase();
      matches = B.filter(b => b.kw && b.kw.some(k => t.includes(k))).slice(0, 3).map(b => b.id);
      document.querySelectorAll('.wall .bcard').forEach(c => c.classList.toggle('match', matches.includes(c.dataset.id)));
      you(id, matches.length ? `Yours sounds like <b>${matches.length} of theirs</b>. They’re marked “Sounds like you” on the lines below.` : 'Nobody has said it quite like that. Have a look at theirs below.');
      const first = matches.length && document.querySelector(`.wall .bcard[data-id="${matches[0]}"]`);
      setTimeout(() => { (first ? first.closest('.sec') : $('#' + SECS[0].slug)).scrollIntoView({ behavior: 'smooth', block: 'start' }); if (first) railShow(first); }, 900);
    } else if (id === 'who') {
      const words = v.toLowerCase().split(/[^a-z-]+/).filter(w => w.length > 2);
      forIds = LIVE_G.filter(g => g.for.some(f => words.some(w => f === w || f.startsWith(w) || w.startsWith(f)))).map(g => g.id);
      document.querySelectorAll('.rail .gtag').forEach(t => t.classList.toggle('for', forIds.includes(t.dataset.id)));
      const secs = [...new Set(forIds.map(fid => G.find(g => g.id === fid).c))];
      you(id, forIds.length ? `We marked <b>${forIds.length} gifts</b> readers gave to someone like that, across ${secs.length} kinds. Look for “For them” on the string.` : 'Nobody has written about them yet. Have a look anyway.');
      if (forIds.length) setTimeout(() => { const el = document.querySelector(`.rail .gtag[data-id="${forIds[0]}"]`); el.closest('.sec').scrollIntoView({ behavior: 'smooth', block: 'start' }); railShow(el); }, 900);
    } else if (id === 'missed') {
      el.value = ''; you(id, `Thank you. It’s on your card as a gift for <b>${E(cById($('#kind-missed').value).name)}</b>.`);
    } else {
      el.value = ''; you(id, `Thank you. Here’s one reader who sees it differently, or the same:${echo(id)}`);
    }
  }
  function skip(id) {
    if (id === 'who') jump(ORDER[0]); else jump(SECS[0].slug);
  }
  function tap(btn, id, v, restoring) {
    btn.parentNode.querySelectorAll('.pill').forEach(p => p.setAttribute('aria-pressed', 'false'));
    btn.setAttribute('aria-pressed', 'true');
    if (!restoring) saveAnswer(QKEY[id], QLABEL[QKEY[id]], v, 'tap');
    const f = FEEL.find(x => x[0] === v);
    you(id, `<p><b>${Math.round(f[1] / FEEL_N * 100)}%</b> of readers chose “${E(v)}” too. ${f === FEEL[0] ? 'That’s the most common answer.' : `The most common answer was “${E(FEEL[0][0])}”.`}</p>
      <div class="hbars grow">${FEEL.map((x, k) => `<div class="hb ${x[0] === v ? 'mine' : ''}"><span>${E(x[0])}${x[0] === v ? ' · you' : ''}</span><i style="--w:${(x[1] / FEEL[0][1] * 100).toFixed(0)}%;--k:${k}"></i><b>${Math.round(x[1] / FEEL_N * 100)}%</b></div>`).join('')}</div>`);
  }

  /* ---------- overlays ---------- */
  function ov(html, colour) { const o = $('#ov'); o.innerHTML = html; o.style.setProperty('--sc', colour || 'var(--red)'); o.classList.add('on'); document.documentElement.style.overflow = 'hidden'; const x = o.querySelector('.x'); x && x.focus({ preventScroll: true }); }
  function closeOv() { $('#ov').classList.remove('on'); document.documentElement.style.overflow = ''; }
  $('#ov').addEventListener('click', e => { if (e.target.id === 'ov') closeOv(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeOv(); });

  function bars(rows, total) {
    const max = Math.max(...rows.map(r => r[1]));
    return `<div class="bars">${rows.map(r => `<span>${E(r[0])}</span><i style="width:${(r[1] / max * 100).toFixed(0)}%"></i><b>${total ? Math.round(r[1] / total * 100) + '%' : r[1]}</b>`).join('')}</div>`;
  }
  // the back of a card: the words, how many readers agree, one decision
  let lastCard = null;
  function openCard(id, qi, el, deep) {
    if (el) lastCard = el;
    const b = B.find(x => x.id === id), sec = SECS.find(s => s.id === b.s), sib = B.filter(x => x.s === b.s), i = sib.indexOf(b);
    const q = qi != null ? againFor(b)[qi] : null, on = picks.includes(id), full = !on && picks.length >= 3;
    const words = q ? `<blockquote class="first">“${E(q[0])}”<span class="credit">${E(q[1])}</span></blockquote>`
      : b.vs ? `<blockquote class="first">“${E(b.h)}”<span class="credit">${E(b.w)}</span></blockquote><p class="label" style="margin:10px 0 0 14px">or</p><blockquote class="first">“${E(b.h2)}”<span class="credit">${E(b.w2)}</span></blockquote>`
      : `<blockquote class="first">“${E(b.h)}”<span class="credit">${E(b.w)}</span></blockquote>`;
    const pct = Math.min(100, b.n / B[0].n * 100);
    ov(`<div class="big cardpop" role="document"><button class="x" onclick="GF.closeOv()" aria-label="Close">×</button>
      <div class="top"><span class="label">${q ? 'Said again · ' : ''}${sec.n} · ${E(sec.name)}</span><span class="pn"><button onclick="GF.openCard('${sib[(i - 1 + sib.length) % sib.length].id}')" aria-label="Previous belief">‹</button>${i + 1} / ${sib.length}<button onclick="GF.openCard('${sib[(i + 1) % sib.length].id}')" aria-label="Next belief">›</button></span></div>
      ${words}
      <div class="agree">${b.vs ? `<b>${b.n}</b> vs <b>${b.n2}</b> readers` : `<b>${b.n}</b> ${b.n === 1 ? 'reader said this' : 'readers said something like this'}`}<span class="meter"><i style="width:${pct.toFixed(0)}%"></i></span></div>
      <div class="acts"><button class="pill ${on ? '' : 'red'}" ${full ? 'disabled' : ''} onclick="GF.plus('${id}')">${on ? 'Take back my +1' : '+1 · I believe this too'}</button><button class="pill" onclick="GF.closeOv()">Not for me</button>
        ${deep ? '' : `<button class="pill deeper-btn" onclick="GF.openCard('${id}',${qi == null ? 'null' : qi},null,true)">Go deeper ↓</button>`}</div>
      ${full ? `<p class="warn">That’s three already. Take one back from <button class="skip" onclick="GF.openThree()">your three</button> to add this.</p>` : `<p class="note" style="margin-top:10px">${3 - picks.length} of 3 left</p>`}
      ${deep ? deeper(b) : ''}</div>`, SC[b.s]);
    if (deep) { const d = $('#deep'); d && setTimeout(() => d.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60); }
  }
  // Go deeper: the numbers behind a belief, more readers in their own words, gifts for people who hold it,
  // and the rest of its section. Same content as the old belief page, kept to one simple column.
  function deeper(b) {
    const sec = SECS.find(s => s.id === b.s), more = againFor(b);
    let data = '';
    if (b.yrs) data = `<p class="deep-cap">Share of readers’ philosophies that said this, by survey year</p><div class="yrs">${b.yrs.map((v, k) => `<div style="height:${Math.max(4, v * 1.8)}px"><b>${v}%</b><span>20${24 + k}</span></div>`).join('')}</div>`;
    else if (b.vs) data = `<p class="deep-cap">Readers split on this</p><div class="bigs"><span><b>${b.n}</b>say cash is fine</span><span><b>${b.n2}</b>say never</span></div>`;
    else if (b.chart === 'feeling') data = `<p class="deep-cap">The feeling readers most want a gift to create, 2026</p>${bars(FEEL, FEEL_N)}`;
    else if (b.chart === 'occasions') data = `<p class="deep-cap">Readers who named each occasion as one that drives their gifting, 2026</p>${bars(OCC)}`;
    else if (b.chart === 'budget') data = `<p class="deep-cap">Median ideal budget for a close friend or family member, ${BUDGET.year}</p><div class="bigs"><span><b>₹${BUDGET.give.toLocaleString('en-IN')}</b>to give</span><span><b>₹${BUDGET.get.toLocaleString('en-IN')}</b>to get</span></div>`;
    else if (b.chart === 'recipientShare') data = `<p class="deep-cap">Share of a year’s gifting each group gets, most common answer, 2026</p><div class="bars">${TIER.map(t => `<span>${E(t[0])}</span><i style="width:${({ '25%+': 100, '10–25%': 58, '1–5%': 14 })[t[1]] || 10}%"></i><b>${E(t[1])}</b>`).join('')}</div>`;
    const tags = DATA.tagsForBelief(b.id).map(t => G.find(g => g.id === t.id)).filter(Boolean);
    const kinds = (b.gifts || []).map(cByName).filter(Boolean);
    const others = B.filter(x => x.s === b.s && x.id !== b.id).sort((x, y) => y.n - x.n).slice(0, 4);
    return `<div class="deep" id="deep">
      <div class="deep-sec"><span class="label">The numbers</span>${data || `<div class="bigs"><span><b>${b.n}</b>${b.n === 1 ? 'reader said this' : 'readers said something like this'}, of ${B.filter(x => x.s === b.s).reduce((a, x) => a + x.n + (x.n2 || 0), 0)} in “${E(sec.name)}”</span></div>`}</div>
      ${more.length ? `<div class="deep-sec"><span class="label">More readers, in their own words · ${more.length}</span>${more.map(q => `<blockquote>“${E(q[0])}”<span class="credit">${E(q[1])}</span></blockquote>`).join('')}</div>` : ''}
      ${tags.length || kinds.length ? `<div class="deep-sec"><span class="label">Gifts for people who believe this</span><div class="chips">${tags.map(g => `<button class="chip" onclick="GF.toTag('${g.id}')">${E(g.it)}</button>`).join('')}${kinds.map(c => `<button class="chip" onclick="GF.toSection('${c.id}')">${E(c.name)} →</button>`).join('')}</div></div>` : ''}
      ${others.length ? `<div class="deep-sec"><span class="label">More from ${sec.n} · ${E(sec.name)}</span><div class="chips">${others.map(o => `<button class="chip" onclick="GF.openCard('${o.id}',null,null,true)">“${E(o.h.length > 56 ? o.h.slice(0, 54) + '…' : o.h)}”</button>`).join('')}</div></div>` : ''}
    </div>`;
  }
  function plus(id) {
    const result = store.togglePick(id), adding = result === 'added';
    if (result === 'full') return;
    if (adding) { const bb = B.find(x => x.id === id); store.addDraft(`plus:${id}`, `+1 on “${bb.h.slice(0, 60)}${bb.h.length > 60 ? '…' : ''}”`, 1, 'tap'); }
    picks = store.picks();
    lastPicked = adding ? id : null;
    const sheetOpen = !!$('#dockSheet');
    if (!sheetOpen) closeOv();
    document.querySelectorAll('.wall .bcard').forEach(c => c.classList.toggle('picked', picks.includes(c.dataset.id)));
    const el = lastCard && lastCard.isConnected && lastCard.dataset.id === id ? lastCard : document.querySelector(`.wall .bcard[data-id="${id}"]`);
    const ck = $('#checkout');
    const done = () => { refreshThree(adding); if (ck) { ck.classList.remove('bump', 'shake'); void ck.offsetWidth; ck.classList.add(adding ? 'bump' : 'shake'); } };
    if (adding && el && ck && !sheetOpen) fly(el, ck, done); else done();
    const b = B.find(x => x.id === id);
    const later = store.user() ? '' : ' · counts once you sign in';
    toast(adding ? (picks.length === 3 ? `That’s your three. You’re ${myType()[0]}.` : `+1 · ${3 - picks.length} to go${later}`) : 'Took back your +1');
  }
  // the back of a tag: what it is, what it costs, why a reader gave it. Two choices: keep it, or say you gave it.
  let lastTag = null;
  function openTag(id, qi, el, opts) {
    opts = opts || {};
    if (el) lastTag = el;
    const g = G.find(x => x.id === id), c = cById(g.c), sib = G.filter(x => x.c === g.c), i = Math.max(0, sib.indexOf(g));
    const q = qi != null && g.q[qi] ? g.q[qi] : null, words = q ? '“' + E(q[0]) + '”' : (g.ed ? E(g.h) : '“' + E(g.h) + '”'), who = q ? q[1] : g.w;
    const [lo, hi] = GiftTag.bandRange(g.b), has = kept.includes(id), gave = store.landed().includes(id), how = mine()[`how:${id}`] || {};
    const coins = hi === 0 ? '' : [1, 2, 3, 4].map(n => `<i class="${n >= Math.max(1, lo) && n <= hi ? 'on' : ''}">₹</i>`).join('');
    ov(`<div class="big tagpop" role="document" data-card="${g.id}" ${idAttrs(tagIds(DATA, g.id))}><button class="x" onclick="GF.closeOv()" aria-label="Close">×</button>
      <div class="top"><span class="label">${c.n} · ${E(c.name)}</span>${sib.length > 1 ? `<span class="pn"><button onclick="GF.openTag('${sib[(i - 1 + sib.length) % sib.length].id}')" aria-label="Previous gift">‹</button>${i + 1} / ${sib.length}<button onclick="GF.openTag('${sib[(i + 1) % sib.length].id}')" aria-label="Next gift">›</button></span>` : ''}</div>
      <h3>${E(g.it)}</h3>
      <div class="price-line"><span class="coins">${coins}</span><b>${GiftTag.priceLabel(g.b)}</b></div>
      <blockquote class="first">${words}<span class="credit">${E(who)}</span></blockquote>
      ${g.q.length ? `<p class="note said-n">${q ? 'Said again. ' : ''}${g.q.length + 1} readers recommended this, in their own words.</p>` : ''}
      <div class="acts two"><button class="pill ${has ? 'solid' : 'red'}" aria-pressed="${has}" onclick="GF.keep('${id}')">${has ? 'Kept · take it out' : 'Keep'}</button>
        <button class="pill ${gave ? 'solid' : ''}" aria-pressed="${gave}" onclick="GF.gave('${id}')">${gave ? 'You gave this' : 'I gave this, it landed'}</button></div>
      ${gave ? `<form class="how" onsubmit="event.preventDefault();GF.how('${id}')" novalidate>
        <span class="label">Tell us about it</span>
        <label><span>Who was it for?</span><input id="how-who" type="text" autocomplete="off" placeholder="My sister, for her 30th" value="${E(how.who || '')}"></label>
        <label><span>How did it go?</span><textarea id="how-how" rows="2" placeholder="She still uses it every morning…">${E(how.how || '')}</textarea></label>
        <div class="qacts"><button class="pill red" type="submit">${how.who || how.how ? 'Update' : 'Send'}</button><span class="note">${opts.justGave ? 'Noted that you gave it. ' : ''}One line each is plenty.</span></div></form>` : ''}
      </div>`, tagColour(g.c));
    if (opts.justGave) setTimeout(() => { const f = $('#how-who'); f && f.focus({ preventScroll: true }); }, 60);
  }
  // Keep: the pop-up closes and the tag flies into the gift box
  function keep(id) {
    const adding = store.toggleKeep(id);
    kept = store.keeps(); rememberTag(id);
    lastAdded = adding ? id : null;
    const sheetOpen = !!$('#dockSheet');
    if (!sheetOpen) closeOv();
    const tagEl = lastTag && lastTag.isConnected && lastTag.dataset.id === id ? lastTag : document.querySelector(`.rail .gtag[data-id="${id}"]`);
    syncTags();
    const ck = $('#checkout');
    const done = () => { refreshBox(adding); bump(adding); };
    if (adding && tagEl && ck && !sheetOpen) { if (tagEl.getBoundingClientRect().right < 0 || tagEl.getBoundingClientRect().left > innerWidth) railShow(tagEl, false); fly(tagEl, ck, done); }
    else done();
    if (tagEl) { tagEl.classList.remove('pop'); void tagEl.offsetWidth; tagEl.classList.add('pop'); }
    const g = G.find(x => x.id === id);
    toast(adding ? `Kept “${g.it}” · ${kept.length} in your box${store.user() ? '' : ' · sign in at checkout to save it'}` : `Took out “${g.it}”`);
  }
  // I gave this, it landed: the pop-up stays open and asks who it was for and how it went
  function gave(id) {
    const g = G.find(x => x.id === id);
    if (store.landed().includes(id)) {
      store.unmarkLanded(id); store.setMine(`how:${id}`, null); rememberTag(id);
      syncTags(); refreshBox(false); toast(`Took back “${g.it}”`);
      openTag(id);
      return;
    }
    store.markLanded(id); rememberTag(id);
    saveAnswer(`landed:${id}`, `It landed: ${g.it}`, 1, 'tap', true);
    syncTags();
    openTag(id, null, null, { justGave: true });
  }
  // the answer goes in one row (how:<tag id>); the card keeps who and how apart, to show them back
  function how(id) {
    const who = ($('#how-who').value || '').trim(), went = ($('#how-how').value || '').trim();
    if (!who && !went) { $('#how-who').focus(); return; }
    const g = G.find(x => x.id === id);
    store.removeDraft(`landed:${id}`);
    saveAnswer(`how:${id}`, `How it went: ${g.it}`, [who && `Given to: ${who}.`, went && `How it went: ${went}`].filter(Boolean).join(' '), 'text', true);
    store.setMine(`how:${id}`, { who, how: went });
    closeOv();
    const tagEl = lastTag && lastTag.isConnected && lastTag.dataset.id === id ? lastTag : document.querySelector(`.rail .gtag[data-id="${id}"]`);
    lastAdded = null;
    if (tagEl && $('#checkout')) fly(tagEl, $('#checkout'), () => { refreshBox(false); bump(true); }); else refreshBox(false);
    toast(`Thank you. “${g.it}” is on your card${store.user() ? '' : ' · sign in at checkout to send it'}`);
  }
  function syncTags() {
    const landed = store.landed();
    document.querySelectorAll('.rail .gtag').forEach(t => { const on = showsState(t); t.classList.toggle('kept', on && kept.includes(t.dataset.id)); t.classList.toggle('gave', on && landed.includes(t.dataset.id)); });
  }
  // remember which tag was used, when it's the first choice made for that gift
  function rememberTag(id) {
    const el = lastTag && lastTag.isConnected && lastTag.dataset.id === id ? lastTag : null;
    if (!kept.includes(id) && !store.landed().includes(id)) { setTagAt(id, null); return; }
    if (el && !tagAt()[id]) setTagAt(id, el.dataset.inst);
  }
  function bump(up) { const ck = $('#checkout'); if (!ck) return; ck.classList.remove('bump', 'shake'); void ck.offsetWidth; ck.classList.add(up ? 'bump' : 'shake'); }
  function unbox(id) { if (kept.includes(id)) keep(id); }
  function fly(from, to, done) {
    const a = from.getBoundingClientRect(), b = to.getBoundingClientRect();
    const ghost = from.cloneNode(true); ghost.classList.add('ghost');
    Object.assign(ghost.style, { position: 'fixed', left: a.left + 'px', top: a.top + 'px', width: a.width + 'px', margin: 0, zIndex: 1050, pointerEvents: 'none', transform: 'none', animation: 'none' });
    ($('#gk-root') || document.body).appendChild(ghost);
    const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
    if (!ghost.animate || matchMedia('(prefers-reduced-motion: reduce)').matches) { ghost.remove(); done(); return; }
    const anim = ghost.animate([
      { transform: 'translate(0,0) scale(1) rotate(0deg)', opacity: 1 },
      { transform: `translate(${dx * .35}px, ${dy * .2 - 80}px) scale(.7) rotate(-8deg)`, opacity: 1, offset: .35 },
      { transform: `translate(${dx}px, ${dy}px) scale(.08) rotate(18deg)`, opacity: .3 }
    ], { duration: 750, easing: 'cubic-bezier(.5,0,.4,1)' });
    anim.onfinish = () => { ghost.remove(); done(); };
  }

  function copy(text, msg) { (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(() => toast(msg), () => toast('Couldn’t copy. Select and copy it instead.')); }


  /* ---------- navigation ---------- */
  let currentSide = null;
  function jump(id) { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  // Views by ?view= on the page's own URL (the 2026 architecture), without reloading
  const VIEWS = ['landing', 'philosophies', 'recommendations'];
  const viewUrl = v => { const u = new URL((wp && wp.baseUrl) || location.href, location.href); u.hash = ''; u.searchParams.delete('view'); if (v && v !== 'landing') u.searchParams.set('view', v); return u.pathname + u.search; };
  const currentView = () => { const v = new URLSearchParams(location.search).get('view'); return VIEWS.includes(v) ? v : 'landing'; };
  function go(name) { closeOv(); const url = viewUrl(name); if (location.pathname + location.search !== url) history.pushState({ view: name }, '', url); route(); }
  function home() { go('landing'); }
  let after = null; // runs once the story has rendered (cross-links between stories)
  function toTag(id) { after = () => { const el = document.querySelector(`.rail .gtag[data-id="${id}"]`); el.closest('.sec').scrollIntoView({ block: 'start' }); railShow(el, false); openTag(id, null, el); }; if (currentSide === 'r') { closeOv(); after(); after = null; } else go('recommendations'); }
  function toSection(cid) { after = () => jump(cid); if (currentSide === 'r') { closeOv(); after(); after = null; } else go('recommendations'); }
  function toCard(id) { after = () => { const el = document.querySelector(`.wall .bcard[data-id="${id}"]`); if (el) { el.closest('.sec').scrollIntoView({ block: 'start' }); railShow(el, false); } openCard(id, null, el); }; if (currentSide === 'p') { closeOv(); after(); after = null; } else go('philosophies'); }

  const land_ = $('#land'), split = $('#split'), story = $('#story');
  function showLanding() {
    currentSide = null; story.classList.remove('on'); story.innerHTML = ''; $('#checkout').hidden = true;
    land_.style.display = ''; land_.classList.remove('opening', 'gone'); split.classList.remove('opening');
    split.querySelectorAll('.side').forEach(s => s.classList.remove('picked'));
    document.body.classList.add('locked'); window.scrollTo(0, 0); $('#progress').style.transform = 'scaleX(0)';
  }
  function showStory(name, animate) {
    const side = name === 'recommendations' ? 'r' : 'p';
    const render = () => {
      currentSide = side; matches = []; forIds = [];
      story.innerHTML = side === 'r' ? recommendations() : philosophies();
      story.classList.remove('on'); void story.offsetWidth; story.classList.add('on');
      document.body.classList.remove('locked', 'dealt'); window.scrollTo(0, 0);
      requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('dealt')));
      document.title = (side === 'r' ? 'What to Give' : 'Why We Give') + ' · The Ken';
      $('#checkout').hidden = false; $('#checkout').setAttribute('aria-label', side === 'r' ? 'Open your gift box' : 'Open your three'); if (side === 'r') refreshBox(false); else refreshThree(false); railWatch(); syncTags(); footerPile();
      restore(); watch();
      if (after) { const f = after; after = null; setTimeout(f, 60); }
    };
    if (!animate) { land_.style.display = 'none'; render(); return; }
    land_.style.setProperty('--head-h', $('#landHead').offsetHeight + 'px');
    split.querySelector(`[data-go="${name}"]`).classList.add('picked');
    land_.classList.add('opening'); split.classList.add('opening');
    setTimeout(() => { render(); land_.classList.add('gone'); setTimeout(() => { land_.style.display = 'none'; }, 360); }, 640);
  }
  // put back answers given earlier in this browser
  function restore() {
    const m = mine();
    ['mine', 'who'].forEach(id => { const el = document.getElementById('in-' + id); if (el && m[QKEY[id]]) el.value = m[QKEY[id]]; });
    if (m.q06) { const b = [...document.querySelectorAll('#ask-s2 .pill')].find(p => p.textContent.trim() === m.q06); b && tap(b, 's2', m.q06, true); }
    const r = $('#in-s5'); if (m.q20 && r) { const v = Math.min(+r.max, +String(m.q20).replace(/\D/g, '')); r.value = v; slide('s5', v, false); }
  }
  // progress bar + current section in the index
  let watching = false;
  function watch() {
    if (watching) return; watching = true;
    let tick = false;
    window.addEventListener('scroll', () => { if (tick) return; tick = true; requestAnimationFrame(() => {
      tick = false; if (!currentSide) return;
      const h = document.documentElement.scrollHeight - innerHeight; $('#progress').style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
      let cur = null; document.querySelectorAll('.sec').forEach(s => { if (s.getBoundingClientRect().top < innerHeight * .35) cur = s.id; });
      document.querySelectorAll('#idx a').forEach(a => { const on = a.dataset.to === cur; if (on && !a.classList.contains('on')) a.scrollIntoView({ block: 'nearest', inline: 'center' }); a.classList.toggle('on', on); });
    }); }, { passive: true });
  }

  let first = true;
  function route() {
    const p = currentView();
    document.body.dataset.gifting = p;
    closeOv();
    if (p === 'recommendations' || p === 'philosophies') {
      const animate = !first && land_.style.display !== 'none';
      if (!animate && currentSide) { land_.style.display = 'none'; }
      showStory(p, animate);
    } else showLanding();
    first = false;
  }
  window.addEventListener('popstate', route);
  // old #/recommendations links still work
  if (/^#\/(recommendations|philosophies)/.test(location.hash)) history.replaceState(null, '', viewUrl(location.hash.slice(2)));
  split.querySelectorAll('.side').forEach(s => s.addEventListener('click', () => go(s.dataset.go)));

  /* ---------- landing art ---------- */
  function landingArt() {
    $('#sideRp').textContent = `${LIVE_G.length} gifts readers actually gave, sorted into ${C.length} kinds. Each one comes with the person it was for.`;
    $('#sidePp').textContent = `${B.length} beliefs about what a gift is for, who makes it hard and what it should cost. Agree with three.`;
    const gs = shuffle(LIVE_G.filter(g => g.n >= 40 && g.h.length < 60)).slice(0, 3);
    $('#artR').innerHTML = `<div style="display:flex;gap:22px;align-items:flex-start;margin-bottom:-8px">${gs.map((g, i) => tagHTML(g, { static: true, width: 180, r: [-6, 3, 7][i], stringH: 60, bg: 'var(--side-r)' })).join('')}</div>`;
    const bs = shuffle(B.filter(b => !b.vs && b.h.length < 64 && b.n > 10)).slice(0, 3);
    $('#artP').innerHTML = `<div style="position:relative;width:340px;height:200px;margin-bottom:6px">${bs.map((b, i) => `<div class="bcard M" style="position:absolute;left:${[0, 70, 140][i]}px;top:${[30, 0, 40][i]}px;width:200px;transform:rotate(${[-7, 2, 8][i]}deg);--sc:${SC[b.s]};pointer-events:none"><div class="quote" style="font-size:16px;margin-top:0">“${E(b.h)}”</div><div class="count"><b style="font-size:24px">${b.n}</b><small>readers</small></div></div>`).join('')}</div>`;
  }

  /* ---------- signing in ---------- */
  configureSignIn({ toast });
  // On the-ken.com the site's navbar sits above the page: the landing and the top bar stay below it
  (function trackNav() {
    const nav = document.querySelector('nav.navbar'); if (!nav) return;
    const set = () => document.documentElement.style.setProperty('--gifting-nav-h', nav.offsetHeight + 'px');
    set(); if ('ResizeObserver' in window) new ResizeObserver(set).observe(nav); addEventListener('resize', set);
  })();
  // the site header's Sign in (see wp/page-gifting-2026-3-0.php) asks for this
  document.addEventListener('gifting:open-answers', openSignIn);
  document.addEventListener('gifting:signed-in', () => {
    picks = store.picks(); kept = store.keeps();
    syncTags();
    document.querySelectorAll('.wall .bcard').forEach(c => c.classList.toggle('picked', picks.includes(c.dataset.id)));
    refreshCards();
  });

  window.GF = { openCard, openTag, closeOv, plus, keep, gave, how, unbox, openBox, openThree, openDock, dockSwitch, signIn: openSignIn, railBy, slide, submit, skip, tap, jump, go, home, toTag, toSection, toCard, copy };
  GiftTag.ready().then(() => { landingArt(); route(); pull(); });
}
