// What we send to the database. Every answer becomes one row:
//   { type: 'philosophy' | 'recommendation', cat_id, card_id, vote | thought }
// cat_id is the section (philosophies) or kind (recommendations), 1-based, in data/gifting-2026.json order.
// card_id is the card's place inside its section or kind, 1-based; 0 means a free answer to the section's question.
// Same contract as the 2026 build's rows.js, so the gifting_2026_* endpoints work unchanged.
const SECTION_QUESTIONS = { q02: 'for', q06: 'moment', q09: 'people', q16: 'secret', q20: 'cost' };
const LANDED = 'landed';
const place = (list, item) => list.indexOf(item) + 1;
const vote = (on) => ({ vote: on ? 1 : 0 });
const thought = (value) => ({ thought: String(value ?? '').trim() });

// The database identifiers of one card, for data attributes and debugging
export function beliefIds(data, id) {
  const b = data.beliefById[id];
  if (!b) return null;
  const p = data.philosophies;
  return { type: 'philosophy', cat_id: place(p.sections, data.sectionById[b.section]), card_id: place(p.beliefs.filter((x) => x.section === b.section), b) };
}
export function tagIds(data, id) {
  const t = data.tagById[id];
  if (!t) return null;
  const r = data.recommendations;
  return { type: 'recommendation', cat_id: place(r.kinds, data.kindById[t.kind]), card_id: place(r.tags.filter((x) => x.kind === t.kind), t) };
}
export function questionIds(data, key) {
  const section = data.sectionById[SECTION_QUESTIONS[key]];
  if (section) return { type: 'philosophy', cat_id: place(data.philosophies.sections, section), card_id: 0 };
  const [kind, id] = key.split(':');
  const k = kind === 'missed' && data.kindById[id];
  return k ? { type: 'recommendation', cat_id: place(data.recommendations.kinds, k), card_id: 0 } : null;
}

function beliefRow(data, id, on) { const ids = beliefIds(data, id); return ids && { ...ids, ...vote(on) }; }
function tagRow(data, id, field) { const ids = tagIds(data, id); return ids && { ...ids, ...field }; }
function thoughtRow(type, cat, value) { return { type, cat_id: cat, card_id: 0, ...thought(value) }; }

export function toRow(data, key, value) {
  const [kind, id] = key.split(':');
  if (kind === 'plus') return beliefRow(data, id, value);
  if (kind === 'keep') return tagRow(data, id, vote(value));
  if (kind === 'how') return tagRow(data, id, thought(value));
  if (kind === 'landed') return tagRow(data, id, thought(value ? LANDED : ''));
  if (kind === 'missed') {
    const k = data.kindById[id];
    return k ? thoughtRow('recommendation', place(data.recommendations.kinds, k), value) : null;
  }
  const section = data.sectionById[SECTION_QUESTIONS[key]];
  if (!section) return null;
  const answer = key === 'q20' ? String(value).replace(/\D/g, '') : value;
  return thoughtRow('philosophy', place(data.philosophies.sections, section), answer);
}

export function signInRows(data, { picks, keeps, drafts }) {
  return [
    ...picks.map((id) => beliefRow(data, id, 1)),
    ...keeps.map((id) => tagRow(data, id, vote(1))),
    ...Object.entries(drafts).filter(([key]) => !/^(plus|keep):/.test(key)).map(([key, d]) => toRow(data, key, d.value))
  ].filter(Boolean);
}

export function fromRows(data, rows, { first = [], max }) {
  const p = data.philosophies;
  const r = data.recommendations;
  const picks = [], keeps = [], landed = [];
  rows.forEach((row) => {
    if (!Number(row.card_id)) return;
    if (row.type === 'philosophy') {
      const s = p.sections[row.cat_id - 1];
      const b = s && p.beliefs.filter((x) => x.section === s.id)[row.card_id - 1];
      if (b && Number(row.vote)) picks.push(b.id);
    } else if (row.type === 'recommendation') {
      const k = r.kinds[row.cat_id - 1];
      const t = k && r.tags.filter((x) => x.kind === k.id)[row.card_id - 1];
      if (t && Number(row.vote)) keeps.push(t.id);
      if (t && row.thought) landed.push(t.id);
    }
  });
  return {
    picks: [...new Set([...first.filter((id) => picks.includes(id)), ...picks])].slice(0, max),
    keeps: [...new Set(keeps)],
    landed
  };
}
