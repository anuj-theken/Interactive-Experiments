import { wp } from './config.js';

// data/gifting-2026.json is the one source of truth: ids, order (which the database ids depend on) and copy.
const DEFAULT_SOURCE = new URL('../../data/gifting-2026.json', import.meta.url).href;
let cache = null;

export function loadData() {
  if (cache) return cache;
  const source = document.body.dataset.giftingSource || (wp && wp.dataUrl) || DEFAULT_SOURCE;
  cache = fetch(source, { credentials: 'same-origin' })
    .then((res) => { if (!res.ok) throw new Error(`Gifting data failed to load (${res.status})`); return res.json(); })
    .then(index);
  return cache;
}

function index(data) {
  const p = data.philosophies;
  const r = data.recommendations;
  data.sectionById = Object.fromEntries(p.sections.map((s) => [s.id, s]));
  data.beliefById = Object.fromEntries(p.beliefs.map((b) => [b.id, b]));
  data.kindById = Object.fromEntries(r.kinds.map((k) => [k.id, k]));
  data.tagById = Object.fromEntries(r.tags.map((t) => [t.id, t]));
  data.tagsForBelief = (id) => r.tags.filter((t) => t.belief === id && !t.pageOnly);
  data.beliefsInSection = (sid) => p.beliefs.filter((b) => b.section === sid);
  return data;
}

// The page code works on short field names. This maps the JSON onto them, keeping every id from the JSON.
const pairs = (qs) => (qs || []).map((q) => [q.text, q.credit]);
const band = (p) => (p.min === p.max ? String(p.max) : `${p.min}–${p.max}`);
export function toPageData(data) {
  const p = data.philosophies, r = data.recommendations, ch = data.charts;
  const keyOf = Object.fromEntries(p.sections.map((s) => [s.id, s.key]));
  const kindName = Object.fromEntries(r.kinds.map((k) => [k.id, k.name]));
  return {
    SECS: p.sections.map((s) => ({ id: s.key, n: s.number, name: s.name, slug: s.id })),
    // hidden beliefs stay in the JSON (their place sets the database card ids) but aren't shown;
    // showIn puts a belief under another section on the page without moving its id
    B: p.beliefs.filter((b) => !b.hidden).map((b) => ({
      id: b.id, s: keyOf[b.showIn || b.section], h: b.headline, w: b.credit, n: b.readers, kw: b.keywords || [], q: pairs(b.quotes),
      ...(b.translation ? { tr: b.translation } : {}),
      ...(b.split ? { split: [b.split.yes, b.split.no] } : {}),
      gifts: (b.giftKinds || []).map((k) => kindName[k]).filter(Boolean),
      ...(b.opposing ? { vs: true, h2: b.opposing.headline, w2: b.opposing.credit, n2: b.opposing.readers } : {}),
      ...(b.trend ? { yrs: ['2024', '2025', '2026'].map((y) => b.trend[y]) } : {}),
      ...(b.chart ? { chart: b.chart } : {})
    })),
    SAMPLES: Object.fromEntries(p.beliefs.filter((b) => b.moreQuotes && b.moreQuotes.length).map((b) => [b.id, pairs(b.moreQuotes)])),
    C: r.kinds.map((k) => ({ id: k.id, n: k.number, name: k.name, enemy: k.tagline, total: k.plannedTotal, apart: !!k.setApart })),
    ORDER: r.kinds.map((k) => k.id),
    G: r.tags.map((t) => ({
      id: t.id, c: t.kind, h: t.reason, w: t.credit, it: t.itWas, b: band(t.price), n: t.mentions, for: t.givenTo || [], q: pairs(t.quotes),
      bel: t.belief ? [t.belief] : null, ed: !!t.editorsPick, pageonly: !!t.pageOnly
    })),
    FEEL: ch.feeling.map((x) => [x.label, x.count]),
    OCC: ch.occasions.map((x) => [x.label, x.count]),
    TIER: ch.recipientShare.map((x) => [x.label, x.share]),
    BUDGET: ch.budget,
    BUDGETS: ch.budgets,
    YEAR_SHARE: ch.yearShare
  };
}
