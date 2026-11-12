// Chai core: labels, the 6×6 shade chart, families, formulas, similarity, crossword and poster.
// Everything works on a normalised recipe R:
//   { name, vessel, milk(0–5), milkType, teas[], amt(0–6), sweet, extras[], forms{}, st{milk,tea,sweet,<spice>}, boils(0–4), brew(0–5) }
(function () {
  // One vocabulary everywhere: prompts, charts, cards and text all use these labels.
  const L = {
    stage: ['cold pan', 'heating', 'boiling', 'heat off', 'in the cup'],
    stageShort: ['cold pan', 'heating', 'boiling', 'heat off', 'in the cup'],
    milk: ['black', 'a splash', 'a quarter', 'half', 'mostly', 'all milk'],
    milkFrac: ['0', '0.1', '0.25', '0.5', '0.75', '1'],
    milkType: { toned: 'toned', full: 'full-cream', skim: 'double-toned', plant: 'plant', condensed: 'condensed', powder: 'powdered' },
    amt: ['<½ tsp', '½ tsp', '1 tsp', '1½ tsp', '2+ tsp', 'eyeballed', 'one bag'],
    amtShort: ['<½ tsp', '½ tsp', '1 tsp', '1½ tsp', '2+ tsp', 'eyeballed', 'one bag'],
    brew: ['<1 min', '1–2 min', '3–5 min', '5–10 min', '10+ min', 'by colour'],
    brewShort: ['<1 min', '1–2 min', '3–5 min', '5–10 min', '10+ min', 'by colour'],
    boils: ['none', 'once', 'twice', '3+ times', 'simmer'],
    boilsShort: ['none', 'once', 'twice', '3+ times', 'simmer'],
    sweet: { none: 'no sugar', sugar1: 'a little sugar', sugar2: '1 tsp sugar', sugar3: '2+ tsp sugar', jaggery: 'jaggery', free: 'sugar-free', honey: 'honey' },
    vessel: { mug: 'mug', cup: 'cup and saucer', tumbler: 'steel tumbler', glass: 'cutting glass', other: 'cup' },
    tea: { ctc: 'CTC', leaf: 'loose leaf', dust: 'tea dust', bag: 'tea bag', darjeeling: 'Darjeeling', assam: 'Assam', nilgiri: 'Nilgiri', green: 'green tea', unsure: 'whatever’s at home' },
    spice: { ginger: 'ginger', cardamom: 'cardamom', clove: 'clove', cinnamon: 'cinnamon', pepper: 'black pepper', tulsi: 'tulsi', mint: 'mint', masala: 'chai masala', lemon: 'lemon', lemongrass: 'lemongrass', saunf: 'saunf', saffron: 'saffron' },
    form: { whole: 'whole', crushed: 'crushed', grated: 'grated', sliced: 'sliced', powder: 'powdered', seeds: 'seeds only', roasted: 'dry-roasted', fresh: 'fresh', dried: 'dried', packaged: 'packaged' }
  };
  const SPICES = ['ginger', 'cardamom', 'clove', 'cinnamon', 'pepper', 'tulsi', 'mint', 'masala', 'lemongrass', 'saunf', 'saffron', 'lemon'];

  // ---- The shade chart: rows A–F get stronger, columns 1–6 get less milky ----
  const RAMP = ['#F5EBDC', '#EED8BB', '#E3BC92', '#D29C6A', '#BB7A47', '#9C5A30', '#7A3E1F', '#592913', '#3B190A', '#24100A'];
  const lerp = (a, b, t) => Math.round(a + (b - a) * t);
  function rampAt(t) {
    t = Math.max(0, Math.min(1, t)) * (RAMP.length - 1);
    const i = Math.min(RAMP.length - 2, Math.floor(t)), f = t - i;
    const h = c => [1, 3, 5].map(k => parseInt(c.slice(k, k + 2), 16));
    const a = h(RAMP[i]), b = h(RAMP[i + 1]);
    return '#' + a.map((v, k) => lerp(v, b[k], f).toString(16).padStart(2, '0')).join('');
  }
  const cellColour = (row, col) => rampAt((row * 0.42 + col * 0.58) / 5);
  const AMTV = [0.35, 0.5, 1, 1.5, 2, 1, 0.9], BREWV = [0.6, 1, 1.4, 1.8, 2.2, 1.3];
  function shade(R) {
    if (R.milk == null) return null;
    const s = (R.amt == null ? 1 : AMTV[R.amt]) * (R.brew == null ? 1.2 : BREWV[R.brew]) * (R.boils >= 3 ? 1.25 : 1);
    const row = s < 0.5 ? 0 : s < 0.9 ? 1 : s < 1.3 ? 2 : s < 1.8 ? 3 : s < 2.6 ? 4 : 5;
    const col = 5 - R.milk;
    return { row, col, code: 'ABCDEF'[row] + (col + 1), hex: cellColour(row, col), t: (row * 0.42 + col * 0.58) / 5 };
  }

  // ---- Families ----
  const FAM = {
    steeper: { name: 'The Steeper', bg: '#151412', ink: '#F4EFE6', accent: '#9DC47A', blurb: 'Water is the hero here. Milk, if it shows up at all, is a guest.' },
    doodh: { name: 'The Doodh Patti', bg: '#F5EC9E', ink: '#1A1208', accent: '#C8423A', blurb: 'Mostly milk, barely any water. The tapri tradition, made at home.' },
    spicebox: { name: 'The Spice Box', bg: '#86B985', ink: '#13261A', accent: '#7A1E12', blurb: 'Three spices or more. Your pot doubles as a larder.' },
    kadak: { name: 'The Kadak', bg: '#6CC0BC', ink: '#0F2430', accent: '#1F2F6B', blurb: 'Boiled up again and again, or left to simmer. Strong enough to stand a spoon in.' },
    adrak: { name: 'The Adrak', bg: '#F1EEDC', ink: '#1A1208', accent: '#C8423A', blurb: 'Ginger leads. Maybe one friend tags along.' },
    everyday: { name: 'The Everyday', bg: '#E4E2DE', ink: '#1A1208', accent: '#2B4C9A', blurb: 'Water, milk, leaf, boil. The cup most of us grew up on.' }
  };
  function family(R) {
    const ex = R.extras || [];
    if (R.milk != null && R.milk <= 1) return 'steeper';
    if (R.milk >= 4) return 'doodh';
    if (ex.length >= 3) return 'spicebox';
    if (R.boils >= 3 || R.brew === 3 || R.brew === 4) return 'kadak';
    if (ex.includes('ginger')) return 'adrak';
    return 'everyday';
  }

  // ---- Readers → R ----
  function fromReader(r) {
    const st = { milk: r.milkIn, tea: r.teaIn, sweet: r.sweetIn };
    const forms = {};
    (r.extras || []).forEach(s => { const d = r.spice && r.spice[s]; st[s] = d && d.in != null ? d.in : r.spiceIn; if (d && d.f.length) forms[s] = d.f[0]; });
    return { id: r.id, name: r.name, vessel: r.vessel, milk: r.milk, milkType: r.milkType, teas: r.teas || [], amt: r.amt, sweet: r.sweet,
      extras: r.extras || [], forms, st, boils: r.boils, brew: r.brew, cups: r.cups, reader: r };
  }

  // ---- Formula ----
  const TOK = { milk: 'M', tea: 'T', sweet: 'S' };
  function formula(R) {
    const head = [];
    head.push(R.milk == null ? 'm=?' : `m=${L.milkFrac[R.milk]}${R.milk && R.milkType ? ' ' + L.milkType[R.milkType] : ''}`);
    head.push(`T=${R.amt == null ? '?' : L.amt[R.amt]}${R.teas.length ? ' {' + R.teas.map(t => L.tea[t]).join(', ') + '}' : ''}`);
    head.push(`S=${R.sweet ? L.sweet[R.sweet] : '?'}`);
    if (R.extras.length) head.push(`A={${R.extras.map(s => L.spice[s] + (R.forms[s] ? ': ' + L.form[R.forms[s]] : '')).join(', ')}}`);
    const at = i => {
      const out = [];
      if (R.milk > 0 && R.st.milk === i) out.push('M');
      if (R.teas.length && R.st.tea === i) out.push('T');
      if (R.sweet && R.sweet !== 'none' && R.st.sweet === i) out.push('S');
      R.extras.forEach(s => { if (R.st[s] === i) out.push(L.spice[s]); });
      return out;
    };
    const seq = [];
    const s0 = (R.milk !== 5 ? ['W'] : []).concat(at(0));
    if (s0.length) seq.push(s0.join(' + '));
    seq.push('HEAT'); if (at(1).length) seq.push(at(1).join(' + '));
    seq.push('BOIL'); if (at(2).length) seq.push(at(2).join(' + '));
    if (R.boils != null && R.milk > 0) seq.push(R.boils === 4 ? 'SIMMER' : R.boils === 0 ? 'NO BOIL' : `BOIL×${R.boils}`);
    if (at(3).length) { seq.push('OFF'); seq.push(at(3).join(' + ')); }
    if (R.brew != null) seq.push(`BREW(${L.brew[R.brew]})`);
    seq.push('STRAIN'); if (at(4).length) seq.push('CUP + ' + at(4).join(' + '));
    return { head: head.join(' | '), seq: seq.join(' → ') };
  }

  // ---- Similarity ----
  function distance(a, b) {
    let d = 0;
    const num = (x, y, span, w) => { if (x == null || y == null) d += w * 0.35; else d += w * Math.abs(x - y) / span; };
    num(a.milk, b.milk, 5, 2.2);
    num(a.amt == null ? null : AMTV[a.amt], b.amt == null ? null : AMTV[b.amt], 1.65, 1);
    num(a.brew === 5 ? 2 : a.brew, b.brew === 5 ? 2 : b.brew, 4, 1);
    num(a.boils, b.boils, 4, 0.9);
    ['milk', 'tea', 'sweet'].forEach(k => num(a.st[k], b.st[k], 4, 0.7));
    if (a.sweet && b.sweet) { const g = s => s.startsWith('sugar') ? 'sugar' : s; d += a.sweet === b.sweet ? 0 : g(a.sweet) === g(b.sweet) ? 0.15 : 0.5; }
    const A = new Set(a.extras), B = new Set(b.extras), U = new Set([...A, ...B]);
    d += U.size ? 1.6 * (1 - [...A].filter(x => B.has(x)).length / U.size) : 0;
    return d;
  }

  // ---- Crossword ----
  function crossword(entries) {
    const list = [];
    const seen = new Set();
    entries.forEach(e => { const w = e.word.toUpperCase().replace(/[^A-Z]/g, ''); if (w.length >= 3 && w.length <= 12 && !seen.has(w)) { seen.add(w); list.push({ ...e, word: w }); } });
    const cells = new Map(); // "r,c" -> {ch, A:bool, D:bool}
    const placed = [];
    const key = (r, c) => r + ',' + c;
    const get = (r, c) => cells.get(key(r, c));
    function can(w, r, c, dir) {
      const dr = dir === 'D' ? 1 : 0, dc = dir === 'A' ? 1 : 0;
      if (get(r - dr, c - dc) || get(r + dr * w.length, c + dc * w.length)) return -1;
      let cross = 0;
      for (let k = 0; k < w.length; k++) {
        const rr = r + dr * k, cc = c + dc * k, cell = get(rr, cc);
        if (cell) { if (cell.ch !== w[k] || cell[dir]) return -1; cross++; }
        else if (get(rr + dc, cc + dr) || get(rr - dc, cc - dr)) return -1;
      }
      return cross;
    }
    function put(e, r, c, dir) {
      const dr = dir === 'D' ? 1 : 0, dc = dir === 'A' ? 1 : 0;
      for (let k = 0; k < e.word.length; k++) { const kk = key(r + dr * k, c + dc * k); const cell = cells.get(kk) || { ch: e.word[k] }; cell[dir] = true; cells.set(kk, cell); }
      placed.push({ ...e, r, c, dir });
    }
    const bounds = () => { let r0 = 1e9, r1 = -1e9, c0 = 1e9, c1 = -1e9; cells.forEach((v, k) => { const [r, c] = k.split(',').map(Number); r0 = Math.min(r0, r); r1 = Math.max(r1, r); c0 = Math.min(c0, c); c1 = Math.max(c1, c); }); return { r0, r1, c0, c1 }; };
    const order = list.slice().sort((a, b) => (b.pri || 0) - (a.pri || 0) || b.word.length - a.word.length);
    if (!order.length) return { placed: [], rows: 0, cols: 0, cells: [] };
    put(order[0], 0, 0, 'A');
    let pending = order.slice(1);
    for (let pass = 0; pass < 2; pass++) {
      const left = [];
      pending.forEach(e => {
        let best = null;
        cells.forEach((cell, k) => {
          const [r, c] = k.split(',').map(Number);
          for (let i = 0; i < e.word.length; i++) {
            if (e.word[i] !== cell.ch) continue;
            for (const dir of ['A', 'D']) {
              if (cell[dir]) continue;
              const sr = dir === 'D' ? r - i : r, sc = dir === 'A' ? c - i : c;
              const x = can(e.word, sr, sc, dir);
              if (x < 1) continue;
              const b = bounds();
              const nr0 = Math.min(b.r0, sr), nc0 = Math.min(b.c0, sc);
              const nr1 = Math.max(b.r1, sr + (dir === 'D' ? e.word.length - 1 : 0)), nc1 = Math.max(b.c1, sc + (dir === 'A' ? e.word.length - 1 : 0));
              const h = nr1 - nr0 + 1, w = nc1 - nc0 + 1;
              const score = x * 30 - h * w - Math.abs(h - w) * 3 - (w > 13 ? 200 : 0) - (h > 13 ? 200 : 0);
              if (!best || score > best.score) best = { score, r: sr, c: sc, dir };
            }
          }
        });
        if (placed.length >= 10 || (e.pri < 0 && placed.length >= 8)) return;
        if (best) put(e, best.r, best.c, best.dir); else left.push(e);
      });
      pending = left;
    }
    const b = bounds();
    placed.forEach(p => { p.r -= b.r0; p.c -= b.c0; });
    const starts = {};
    placed.slice().sort((x, y) => x.r - y.r || x.c - y.c).forEach(p => { const k = key(p.r, p.c); if (!starts[k]) starts[k] = Object.keys(starts).length + 1; p.n = starts[k]; });
    const out = [];
    cells.forEach((v, k) => { const [r, c] = k.split(',').map(Number); out.push({ r: r - b.r0, c: c - b.c0, ch: v.ch, n: starts[key(r - b.r0, c - b.c0)] }); });
    return { placed, rows: b.r1 - b.r0 + 1, cols: b.c1 - b.c0 + 1, cells: out };
  }

  function clues(R, fam) {
    const E = [];
    const nm = (R.name || 'Chai').split(/[\s(/,]+/).filter(w => w.length >= 3).sort((a, b) => b.length - a.length)[0] || 'Chai';
    E.push({ word: nm, clue: 'What you call it at home', pri: 3 });
    if (R.vessel && R.vessel !== 'other') E.push({ word: { mug: 'MUG', cup: 'SAUCER', tumbler: 'TUMBLER', glass: 'CUTTING' }[R.vessel], clue: { mug: 'What it’s poured into', cup: 'The cup sits on one', tumbler: 'Steel, and it never cools', glass: 'A glass, and a style of serving' }[R.vessel] });
    if (R.milk != null) E.push(R.milk === 0 ? { word: 'BLACK', clue: 'How you take it: no milk at all', pri: 2 } : { word: ['', 'SPLASH', 'QUARTER', 'HALF', 'MOSTLY', 'DOODH'][R.milk], clue: ['', 'Just a ___ of milk', 'Milk’s share of the cup', 'Half water, ___ milk', 'How much of the cup is milk', 'All milk, no water (Hindi)'][R.milk] + (R.milk && R.st.milk != null ? ` · goes in at: ${L.stage[R.st.milk].toLowerCase()}` : ''), pri: 2 });
    const tw = { ctc: ['CTC', 'Round granules'], leaf: ['LEAF', 'Loose ___'], dust: ['DUST', 'Tea ___, fine and fast'], bag: ['TEABAG', 'Dunked, not measured'], darjeeling: ['DARJEELING', 'The champagne of teas'], assam: ['ASSAM', 'Malty leaf from the Brahmaputra valley'], nilgiri: ['NILGIRI', 'Blue-mountain leaf'], green: ['GREEN', '___ tea'] };
    R.teas.forEach(t => tw[t] && E.push({ word: tw[t][0], clue: tw[t][1] + (R.st.tea != null ? ` · in at: ${L.stage[R.st.tea].toLowerCase()}` : ''), pri: 1 }));
    const sw = { sugar1: ['SUGAR', 'A little, under a spoon'], sugar2: ['SUGAR', 'One spoon of it'], sugar3: ['SUGAR', 'Two spoons or more'], jaggery: ['JAGGERY', 'Gur, instead of sugar'], honey: ['HONEY', 'Stirred in instead of sugar'], free: ['STEVIA', 'Sweet, without the sugar'] };
    if (sw[R.sweet]) E.push({ word: sw[R.sweet][0], clue: sw[R.sweet][1] + (R.st.sweet != null ? ` · ${L.stage[R.st.sweet].toLowerCase()}` : '') });
    const sp = { ginger: 'GINGER', cardamom: 'ELAICHI', clove: 'CLOVE', cinnamon: 'CINNAMON', pepper: 'PEPPER', tulsi: 'TULSI', mint: 'MINT', masala: 'MASALA', lemongrass: 'LEMONGRASS', saunf: 'SAUNF', saffron: 'KESAR', lemon: 'LEMON' };
    const spClue = { ginger: 'Adrak', cardamom: 'Green pods, cracked open', clove: 'Laung', cinnamon: 'Dalchini', pepper: 'Kali mirch', tulsi: 'Holy basil', mint: 'Pudina', masala: 'Ready-made mix', lemongrass: 'Tall grass with a citrus note', saunf: 'Fennel seeds', saffron: 'Saffron threads', lemon: 'Nimbu' };
    R.extras.forEach(s => E.push({ word: sp[s], clue: spClue[s] + (R.forms[s] ? `, ${L.form[R.forms[s]]}` : '') + (R.st[s] != null ? ` · ${L.stage[R.st[s]].toLowerCase()}` : '') }));
    if (R.boils != null && R.milk > 0) E.push({ word: ['', 'ONCE', 'TWICE', 'THRICE', 'SIMMER'][R.boils] || '', clue: 'How many times it boils up after the milk' });
    if (R.brew != null) E.push({ word: ['QUICK', 'BRIEF', 'STEEP', 'STRONG', 'KADAK', 'COLOUR'][R.brew], clue: `How long the leaf stays in: ${L.brew[R.brew]}` });
    const fw = { steeper: 'STEEPER', doodh: 'PATTI', spicebox: 'SPICEBOX', kadak: 'KADAK', adrak: 'ADRAK', everyday: 'EVERYDAY' };
    E.push({ word: fw[fam], clue: `Your family: ${FAM[fam].name.replace('The ', '')}` });
    [['PATILA', 'The pan it’s made in'], ['STRAIN', 'The last step'], ['STEAM', 'Rises off the pan'], ['KETTLE', 'Put it on first'], ['BISCUIT', 'Dunked, by some'], ['TAPRI', 'Roadside chai stall'], ['RUSK', 'The other dunkable']].forEach(([w, c]) => E.push({ word: w, clue: c, pri: -1 }));
    return E;
  }

  // ---- Cup, top view ----
  function cupTop(hex, size, opts = {}) {
    const r = size / 2;
    const froth = opts.boils >= 2 ? `<circle cx="${r}" cy="${r}" r="${r * 0.6}" fill="none" stroke="rgba(255,248,236,.45)" stroke-width="${r * 0.08}"/>` : '';
    return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" aria-hidden="true"><circle cx="${r}" cy="${r}" r="${r * 0.96}" fill="#FBF8F3" stroke="#1A1208" stroke-width="${Math.max(1, size / 60)}"/><circle cx="${r}" cy="${r}" r="${r * 0.78}" fill="${hex || '#CFE3E8'}"/>${froth}<ellipse cx="${r * 0.72}" cy="${r * 0.62}" rx="${r * 0.18}" ry="${r * 0.08}" fill="rgba(255,255,255,.35)" transform="rotate(-30 ${r * 0.72} ${r * 0.62})"/></svg>`;
  }

  // ---- Poster (600 × 840) ----
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  function wrap(text, max) { const out = []; let line = ''; text.split(' ').forEach(w => { if ((line + ' ' + w).trim().length > max) { if (line) out.push(line); line = w; } else line = (line + ' ' + w).trim(); }); if (line) out.push(line); return out; }
  function poster(R, opts = {}) {
    const fk = family(R), F = FAM[fk], sh = shade(R) || { hex: '#CFE3E8', code: '—' };
    const W = 600, H = 840, cx = 300, cy = 470;
    const fd = "'Archivo Bold','Archivo',Arial,sans-serif", fb = "'Archivo',Arial,sans-serif", fr = "'Reckless',Georgia,serif";
    const ink = F.ink, acc = F.accent;
    const f = formula(R);
    const parts = [];
    parts.push(`<rect width="${W}" height="${H}" fill="${F.bg}"/>`);
    // header, in the manner of a gallery poster
    const title = (R.name || 'Chai').toUpperCase().slice(0, 22);
    parts.push(`<text x="36" y="66" font-family="${fd}" font-weight="800" font-size="${title.length > 14 ? 26 : 34}" fill="${acc}" letter-spacing="-.5">${esc(title)}</text>`);
    parts.push(`<text x="36" y="${title.length > 14 ? 94 : 100}" font-family="${fd}" font-weight="800" font-size="${title.length > 14 ? 26 : 34}" fill="${ink}" letter-spacing="-.5">${esc(F.name.toUpperCase())}</text>`);
    wrap(F.blurb, 40).forEach((l, i) => parts.push(`<text x="36" y="${128 + i * 15}" font-family="${fr}" font-style="italic" font-size="12.5" fill="${ink}" opacity=".85">${esc(l)}</text>`));
    const meta = [['Shade', sh.code], ['Milk', R.milk == null ? '—' : L.milk[R.milk]], ['Boils', R.boils == null || !R.milk ? '—' : L.boilsShort[R.boils]], ['Brew', R.brew == null ? '—' : L.brewShort[R.brew]]];
    meta.forEach(([k, v], i) => { const x = 372 + (i % 2) * 110, y = 48 + Math.floor(i / 2) * 40; parts.push(`<text x="${x}" y="${y}" font-family="${fb}" font-size="9.5" fill="${ink}" opacity=".7" letter-spacing=".8">${k.toUpperCase()}</text><text x="${x}" y="${y + 16}" font-family="${fd}" font-weight="800" font-size="13" fill="${ink}">${esc(v)}</text>`); });
    // rings of ingredients
    const art = [];
    const ringItems = R.extras.slice(0, 6);
    const tea = R.teas.length || R.amt != null ? (R.teas.find(t => ['darjeeling', 'assam', 'green', 'leaf'].includes(t)) || 'leaf') : null;
    const rings = ringItems.length ? ringItems.slice() : [];
    if (tea) rings.push(tea);
    if (R.sweet && !['none', 'free'].includes(R.sweet) && rings.length < 4) rings.push(R.sweet.startsWith('sugar') ? 'sugar' : R.sweet);
    const n = rings.length, r0 = 128, r1 = 262;
    rings.forEach((name, i) => {
      const rad = n === 1 ? (r0 + r1) / 2 : r0 + (r1 - r0) * i / (n - 1);
      const size = Math.max(22, Math.min(44, 46 - n * 3 + i * 2));
      const count = Math.max(6, Math.floor((2 * Math.PI * rad) / (size * 1.25)));
      const off = (i % 2) * (180 / count);
      for (let k = 0; k < count; k++) {
        const a = off + k * 360 / count;
        art.push(`<g transform="rotate(${a.toFixed(2)}) translate(0 ${-rad}) rotate(${i % 2 ? 180 : 0}) scale(${(size / 48).toFixed(3)}) translate(-24 -24)">${ICON.g(name)}</g>`);
      }
      // a thin orbit line between rings
      art.push(`<circle r="${rad + size * 0.72}" fill="none" stroke="${ink}" stroke-opacity=".14" stroke-width="1"/>`);
    });
    if (!rings.length) for (let k = 0; k < 12; k++) art.push(`<g transform="rotate(${k * 30}) translate(0 -170) scale(.7) translate(-24 -24)">${ICON.g('water')}</g>`);
    parts.push(`<g transform="translate(${cx} ${cy})">${art.join('')}</g>`);
    // saucer as a clock face: what goes in, in order, with flames for the boils
    const sR = 104;
    parts.push(`<g transform="translate(${cx} ${cy})"><circle r="${sR}" fill="#FBF8F3" stroke="#1A1208" stroke-width="2"/><circle r="${sR - 22}" fill="none" stroke="#1A1208" stroke-opacity=".25" stroke-width="1"/>`);
    const seqItems = [];
    if (R.milk !== 5) seqItems.push({ st: 0, c: '#9CCFDC' });
    [['milk', R.milk > 0, '#F4F1EA'], ['tea', R.teas.length || R.amt != null, '#4A2412'], ['sweet', R.sweet && R.sweet !== 'none', '#D9C7A8']].forEach(([k, on, c]) => on && R.st[k] != null && seqItems.push({ st: R.st[k], c }));
    R.extras.forEach(s => R.st[s] != null && seqItems.push({ st: R.st[s], c: ICON.col(s) }));
    seqItems.sort((a, b) => a.st - b.st);
    for (let i = 0; i < 5; i++) { const a = (-90 + i * 72) * Math.PI / 180; parts.push(`<line x1="${Math.cos(a) * (sR - 22)}" y1="${Math.sin(a) * (sR - 22)}" x2="${Math.cos(a) * sR}" y2="${Math.sin(a) * sR}" stroke="#1A1208" stroke-opacity=".35"/>`); }
    const perStage = [0, 0, 0, 0, 0];
    seqItems.forEach(it => { const k = perStage[it.st]++; const a = (-90 + it.st * 72 + 12 + k * 11) * Math.PI / 180; parts.push(`<circle cx="${(Math.cos(a) * (sR - 11)).toFixed(1)}" cy="${(Math.sin(a) * (sR - 11)).toFixed(1)}" r="5" fill="${it.c}" stroke="#1A1208" stroke-width="1.2"/>`); });
    const nb = R.milk > 0 && R.boils != null ? (R.boils === 4 ? 4 : R.boils) : 0;
    for (let k = 0; k < nb; k++) { const a = (-90 + 2 * 72 + 40 + k * 7); parts.push(`<g transform="rotate(${a}) translate(0 ${-(sR + 0)}) scale(.28) translate(-24 -40)">${ICON.g('flame')}</g>`); }
    parts.push(`<circle r="${sR - 26}" fill="#FBF8F3" stroke="#1A1208" stroke-width="2"/><circle r="${sR - 36}" fill="${sh.hex}"/>`);
    if (R.boils >= 2 && R.milk > 0) parts.push(`<circle r="${sR - 48}" fill="none" stroke="rgba(255,248,236,.5)" stroke-width="6"/>`);
    parts.push(`<ellipse cx="-22" cy="-26" rx="14" ry="6" fill="rgba(255,255,255,.3)" transform="rotate(-30 -22 -26)"/></g>`);
    // footer
    const seqLines = wrap(f.seq, 64).slice(0, 3);
    const fy = H - 92;
    parts.push(`<line x1="36" x2="${W - 36}" y1="${fy - 18}" y2="${fy - 18}" stroke="${ink}" stroke-opacity=".3"/>`);
    parts.push(`<text x="36" y="${fy}" font-family="${fb}" font-size="9.5" letter-spacing=".8" fill="${ink}" opacity=".7">THE FORMULA</text>`);
    seqLines.forEach((l, i) => parts.push(`<text x="36" y="${fy + 17 + i * 15}" font-family="${fd}" font-weight="800" font-size="11.5" fill="${ink}">${esc(l)}</text>`));
    parts.push(`<text x="${W - 36}" y="${fy}" text-anchor="end" font-family="${fb}" font-size="9.5" letter-spacing=".8" fill="${ink}" opacity=".7">${esc(opts.foot || 'HOW INDIA MAKES CHAI · THE KEN')}</text>`);
    if (opts.who) parts.push(`<text x="${W - 36}" y="${H - 30}" text-anchor="end" font-family="${fr}" font-style="italic" font-size="12" fill="${ink}">${esc(opts.who)}</text>`);
    return { svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${parts.join('')}</svg>`, family: fk, shade: sh };
  }

  window.CHAICORE = { L, SPICES, RAMP, rampAt, cellColour, shade, FAM, family, fromReader, formula, distance, crossword, clues, cupTop, poster, esc };
})();
