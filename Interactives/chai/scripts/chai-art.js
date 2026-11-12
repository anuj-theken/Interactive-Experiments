// Chai art: side-view vessels, the stamp poster (card back) and the newspaper crossword (card front).
(function () {
  const C = window.CHAICORE, L = C.L, ICON = window.ICON, esc = C.esc;
  let uid = 0;

  // Family extras: a Hindi name and a block colour, in the manner of an old municipal stamp
  const FAMX = {
    steeper: { hi: 'काली चाय', block: '#22231F' },
    doodh: { hi: 'दूध पत्ती', block: '#6B4A12' },
    spicebox: { hi: 'मसाला डिब्बा', block: '#1F3A2B' },
    kadak: { hi: 'कड़क', block: '#7A2318' },
    adrak: { hi: 'अदरक वाली', block: '#7A4416' },
    everyday: { hi: 'रोज़ की चाय', block: '#22304F' }
  };

  const mix = (a, b, t) => { const h = c => [1, 3, 5].map(k => parseInt(c.slice(k, k + 2), 16)); const x = h(a), y = h(b); return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join(''); };

  // What colour is in the vessel right now?
  function liquid(R) {
    if (R.milk == null) return null;
    if (!R.teas.length && R.amt == null) return R.milk === 0 ? '#D3E3E6' : mix('#D3E3E6', '#F8F3E8', R.milk / 5);
    const sh = C.shade({ ...R, amt: R.amt == null ? 2 : R.amt });
    return sh ? sh.hex : '#D3E3E6';
  }

  // Side view. viewBox 0 0 200 230, ground at ~210.
  function vessel(R, o = {}) {
    const type = o.type || R.vessel || 'glass', col = o.colour !== undefined ? o.colour : liquid(R);
    const id = 'v' + (++uid), ink = '#2A1E14', sw = 2.4;
    const milky = R.milk > 0;
    const froth = col && milky ? mix(col, '#FFF8EC', .45) : col;
    const surf = col ? mix(col, '#FFFFFF', .18) : null;
    const boils = R.boils == null ? (col ? 1 : 0) : Math.max(1, Math.min(3, R.boils === 4 ? 3 : R.boils));
    const steamAt = (y, n) => col && !o.still ? Array.from({ length: n }, (_, i) => `<path class="steam s${i}" d="M${100 + (i - (n - 1) / 2) * 18} ${y} q-7 -10 0 -20 q7 -10 0 -20" fill="none" stroke="#A89A88" stroke-width="2.6" stroke-linecap="round" opacity=".6"/>`).join('') : '';
    let g = `<ellipse cx="100" cy="214" rx="78" ry="7" fill="#2A1E14" opacity=".1"/>`;
    if (type === 'glass' || type === 'other') {
      const xl = y => 52 + (y - 36) / 164 * 14, xr = y => 148 - (y - 36) / 164 * 14, yL = 60;
      g += steamAt(30, boils);
      if (col) {
        g += `<path d="M${xl(yL)} ${yL} L${xr(yL)} ${yL} L${xr(190)} 190 L${xl(190)} 190Z" fill="${col}"/>`;
        if (milky) g += `<path d="M${xl(yL)} ${yL} L${xr(yL)} ${yL} L${xr(yL + 8)} ${yL + 8} L${xl(yL + 8)} ${yL + 8}Z" fill="${froth}"/>`;
        g += `<ellipse cx="100" cy="${yL}" rx="${(xr(yL) - xl(yL)) / 2}" ry="4.5" fill="${surf}"/>`;
        (o.float || []).slice(0, 4).forEach((k, i) => { const x = 74 + (i % 2) * 34 + (i > 1 ? 10 : 0), y = 96 + Math.floor(i / 2) * 40 + (i % 2) * 12; g += `<g transform="translate(${x} ${y}) rotate(${i * 37 - 30}) scale(.42) translate(-24 -24)" opacity=".8">${ICON.g(k)}</g>`; });
      }
      for (let k = 1; k < 8; k++) { const t = k / 8; g += `<line x1="${52 + 96 * t}" y1="38" x2="${66 + 68 * t}" y2="190" stroke="${k % 2 ? '#FFFFFF' : ink}" stroke-opacity="${k % 2 ? .35 : .12}" stroke-width="${k % 2 ? 2 : 1}"/>`; }
      g += `<path d="M52 36 L148 36 L134 200 L66 200Z" fill="rgba(255,255,255,${col ? .1 : .28})" stroke="${ink}" stroke-width="${sw}" stroke-linejoin="round"/>`;
      g += `<path d="M66 190 L134 190 L134 200 L66 200Z" fill="rgba(255,255,255,.35)" stroke="${ink}" stroke-width="1.2"/>`;
      g += `<ellipse cx="100" cy="36" rx="48" ry="5" fill="none" stroke="${ink}" stroke-width="${sw}"/><path d="M60 46 L70 180" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".5"/>`;
    } else if (type === 'cup') {
      g += `<ellipse cx="100" cy="200" rx="88" ry="14" fill="#F7F2E8" stroke="${ink}" stroke-width="${sw}"/><ellipse cx="100" cy="198" rx="52" ry="8" fill="none" stroke="${ink}" stroke-opacity=".3"/>`;
      g += steamAt(66, boils);
      g += `<path d="M156 102 C 192 96, 194 146, 150 152" fill="none" stroke="${ink}" stroke-width="11" stroke-linecap="round"/><path d="M156 102 C 192 96, 194 146, 150 152" fill="none" stroke="#F7F2E8" stroke-width="6" stroke-linecap="round"/>`;
      g += `<path d="M40 82 C 40 150, 70 194, 100 194 C 130 194, 160 150, 160 82Z" fill="#F7F2E8" stroke="${ink}" stroke-width="${sw}" stroke-linejoin="round"/>`;
      g += `<path d="M44 104 C 70 114, 130 114, 156 104" fill="none" stroke="#7A2318" stroke-width="3"/>` + [60, 80, 100, 120, 140].map(x => `<circle cx="${x}" cy="${x === 100 ? 120 : 117 + Math.abs(x - 100) * -.06}" r="2.6" fill="#1F3A2B"/>`).join('');
      g += `<ellipse cx="100" cy="82" rx="60" ry="12" fill="#F7F2E8" stroke="${ink}" stroke-width="${sw}"/>`;
      if (col) g += `<ellipse cx="100" cy="85" rx="53" ry="9" fill="${milky ? froth : col}"/><ellipse cx="100" cy="86" rx="44" ry="6.5" fill="${col}"/>`;
      g += `<path d="M52 140 C 58 160, 70 176, 84 184" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".6"/>`;
    } else if (type === 'mug') {
      g += steamAt(56, boils);
      g += `<path d="M150 96 C 188 96, 188 162, 150 162" fill="none" stroke="${ink}" stroke-width="12" stroke-linecap="round"/><path d="M150 96 C 188 96, 188 162, 150 162" fill="none" stroke="#F1ECDF" stroke-width="7" stroke-linecap="round"/>`;
      g += `<path d="M50 72 L50 184 Q50 196 62 196 L138 196 Q150 196 150 184 L150 72Z" fill="#F1ECDF" stroke="${ink}" stroke-width="${sw}" stroke-linejoin="round"/>`;
      g += `<path d="M50 182 Q50 196 62 196 L138 196 Q150 196 150 182Z" fill="#1F3A2B"/>`;
      g += `<ellipse cx="100" cy="72" rx="50" ry="10" fill="#F1ECDF" stroke="#1F3A2B" stroke-width="5"/><ellipse cx="100" cy="72" rx="50" ry="10" fill="none" stroke="${ink}" stroke-width="1.4"/>`;
      if (col) g += `<ellipse cx="100" cy="74" rx="44" ry="7.5" fill="${milky ? froth : col}"/><ellipse cx="100" cy="75" rx="37" ry="5.5" fill="${col}"/>`;
      g += `<path d="M118 100 q6 4 3 9 q-5 2 -8 -3Z" fill="#3B3A36" opacity=".55"/><path d="M62 88 L62 170" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".55"/>`;
    } else if (type === 'tumbler') {
      g += `<defs><linearGradient id="${id}s" x1="0" x2="1"><stop offset="0" stop-color="#8E9396"/><stop offset=".35" stop-color="#E9ECEC"/><stop offset=".6" stop-color="#B7BCBE"/><stop offset="1" stop-color="#7D8285"/></linearGradient></defs>`;
      g += `<path d="M24 166 L176 166 C 172 196, 142 210, 100 210 C 58 210, 28 196, 24 166Z" fill="url(#${id}s)" stroke="${ink}" stroke-width="${sw}" stroke-linejoin="round"/><ellipse cx="100" cy="166" rx="76" ry="10" fill="#C9CDCE" stroke="${ink}" stroke-width="${sw}"/>`;
      g += steamAt(40, boils);
      g += `<path d="M64 48 L136 48 L129 176 L71 176Z" fill="url(#${id}s)" stroke="${ink}" stroke-width="${sw}" stroke-linejoin="round"/>`;
      g += `<path d="M66 70 L134 70 M70 158 L130 158" stroke="${ink}" stroke-opacity=".3" stroke-width="1.4"/>`;
      g += `<ellipse cx="100" cy="48" rx="36" ry="6" fill="#D5D9DA" stroke="${ink}" stroke-width="${sw}"/>`;
      if (col) g += `<ellipse cx="100" cy="50" rx="31" ry="4.4" fill="${milky ? froth : col}"/><ellipse cx="100" cy="50.5" rx="24" ry="3.2" fill="${col}"/>`;
    }
    if (!col && o.emptyLabel !== false) g += `<text x="100" y="${type === 'glass' ? 130 : 140}" text-anchor="middle" font-family="'IM Fell English', Georgia, serif" font-style="italic" font-size="14" fill="${ink}" opacity=".55">empty</text>`;
    return `<svg class="vessel" viewBox="0 0 200 230" preserveAspectRatio="xMidYMax meet" aria-hidden="true">${g}</svg>`;
  }

  // ---- Grain filter, reused in exports ----
  const grainDefs = (id, alpha = .22, freq = .85) => `<filter id="${id}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="matrix" values="0 0 0 0 .18  0 0 0 0 .13  0 0 0 0 .08  0 0 0 ${alpha} 0"/></filter>`;

  // ---- Card back: a stamp ----
  function wrap(text, max) { const out = []; let line = ''; String(text).split(' ').forEach(w => { if ((line + ' ' + w).trim().length > max) { if (line) out.push(line); line = w; } else line = (line + ' ' + w).trim(); }); if (line) out.push(line); return out; }
  function stamp(R, opts = {}) {
    const fk = C.family(R), F = C.FAM[fk], X = FAMX[fk], sh = C.shade(R) || { code: '—' };
    const W = 600, H = 840, P = 22, paper = '#EFE6D0', blk = X.block, cream = '#F2E9D3';
    const id = 'st' + (++uid);
    const f = C.formula(R);
    const pop = "Poppins, 'Archivo Bold', Arial, sans-serif", hind = "Hind, 'Noto Sans Devanagari', sans-serif", fell = "'IM Fell English', Georgia, serif", mono = "ui-monospace, Menlo, monospace";
    // perforations
    let holes = '';
    const r = 9, step = 26;
    for (let x = step / 2; x < W; x += step) holes += `<circle cx="${x}" cy="0" r="${r}"/><circle cx="${x}" cy="${H}" r="${r}"/>`;
    for (let y = step / 2; y < H; y += step) holes += `<circle cx="0" cy="${y}" r="${r}"/><circle cx="${W}" cy="${y}" r="${r}"/>`;
    let g = `<defs><mask id="${id}m"><rect width="${W}" height="${H}" fill="#fff"/><g fill="#000">${holes}</g></mask>${grainDefs(id + 'g', .3)}<clipPath id="${id}a"><path d="M70 560 L70 330 Q70 250 150 236 Q200 200 300 196 Q400 200 450 236 Q530 250 530 330 L530 560Z"/></clipPath></defs>`;
    g += `<g mask="url(#${id}m)"><rect width="${W}" height="${H}" fill="${paper}"/>`;
    g += `<rect x="${P}" y="${P}" width="${W - 2 * P}" height="${H - 2 * P}" fill="none" stroke="#7A2318" stroke-width="2.5"/>`;
    // top-left: name in heavy grotesk
    const name = (R.name || 'Chai').toUpperCase().slice(0, 10);
    g += `<text x="48" y="104" font-family="${pop}" font-weight="800" font-size="${name.length > 6 ? 46 : 60}" fill="${blk}" letter-spacing="-1">${esc(name)}</text>`;
    g += `<text x="48" y="${name.length > 6 ? 152 : 160}" font-family="${pop}" font-weight="800" font-size="${F.name.length > 14 ? 30 : 38}" fill="${blk}" letter-spacing="-.5">${esc(F.name.replace('The ', '').toUpperCase())}</text>`;
    // top-right block
    g += `<rect x="352" y="44" width="200" height="132" fill="${blk}"/>`;
    g += [0, 1, 2].map(i => `<circle cx="${370}" cy="${62 + i * 12}" r="4" fill="${cream}"/>`).join('');
    g += `<text x="536" y="70" text-anchor="end" font-family="${pop}" font-weight="700" font-size="20" fill="${cream}">${esc(sh.code)}</text>`;
    g += `<text x="370" y="132" font-family="${hind}" font-weight="600" font-size="${X.hi.length > 8 ? 24 : 30}" fill="${cream}">${esc(X.hi)}</text>`;
    g += `<text x="370" y="160" font-family="${fell}" font-style="italic" font-size="13" fill="${cream}" opacity=".85">shade ${esc(sh.code)} · ${esc(L.milk[R.milk == null ? 3 : R.milk].toLowerCase())}</text>`;
    // the picture: arch window on a dark block, the glass inside with its spices around it
    g += `<rect x="48" y="196" width="504" height="378" fill="${blk}"/>`;
    g += `<g clip-path="url(#${id}a)"><rect x="70" y="190" width="460" height="380" fill="#E7D8B6"/>`;
    const ring = R.extras.length ? R.extras.slice(0, 4) : [R.teas.find(t => ['darjeeling', 'assam', 'green', 'leaf'].includes(t)) || 'leaf'];
    ring.forEach((k, i) => {
      const rad = 150 - i * 30, n = Math.max(8, Math.round(rad / 9)), sz = 30 - i * 2;
      for (let j = 0; j < n; j++) { const a = j * 360 / n + i * 11; g += `<g transform="translate(300 420) rotate(${a.toFixed(1)}) translate(0 ${-rad}) scale(${(sz / 48).toFixed(3)}) translate(-24 -24)" opacity=".9">${ICON.g(k)}</g>`; }
    });
    g += `<circle cx="300" cy="420" r="96" fill="#E7D8B6" opacity=".85"/>`;
    g += `</g><path d="M70 560 L70 330 Q70 250 150 236 Q200 200 300 196 Q400 200 450 236 Q530 250 530 330 L530 560Z" fill="none" stroke="${blk}" stroke-width="3"/>`;
    const v = vessel(R, { still: true, emptyLabel: false, float: R.extras }).replace('<svg class="vessel" viewBox="0 0 200 230" preserveAspectRatio="xMidYMax meet" aria-hidden="true">', '<svg x="200" y="320" width="200" height="230" viewBox="0 0 200 230">');
    g += v;
    // bottom-left: Hindi
    g += `<text x="48" y="660" font-family="${hind}" font-weight="700" font-size="58" fill="${blk}">मेरी</text><text x="48" y="728" font-family="${hind}" font-weight="700" font-size="58" fill="${blk}">चाय</text>`;
    g += `<text x="50" y="780" font-family="${fell}" font-style="italic" font-size="14" fill="${blk}">${esc(opts.who || 'How India makes chai')}</text>`;
    // bottom-right block: the formula
    g += `<rect x="290" y="596" width="262" height="200" fill="${blk}"/>`;
    g += [0, 1, 2].map(i => `<circle cx="${520 + i * 12}" cy="614" r="4" fill="${cream}"/>`).join('');
    g += `<text x="306" y="640" font-family="${pop}" font-weight="700" font-size="17" fill="${cream}">${esc(F.name)}</text><line x1="306" x2="536" y1="652" y2="652" stroke="${cream}" stroke-opacity=".5"/>`;
    wrap(f.seq, 34).slice(0, 7).forEach((l, i) => g += `<text x="306" y="${672 + i * 16}" font-family="${mono}" font-size="10.5" fill="${cream}">${esc(l)}</text>`);
    g += `<text x="${W - 50}" y="${H - 34}" text-anchor="end" font-family="${fell}" font-size="11" fill="#7A2318" letter-spacing="1">THE KEN · FIRST PRINCIPLES</text>`;
    g += `<rect width="${W}" height="${H}" filter="url(#${id}g)"/></g>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${g}</svg>`;
  }

  // ---- Card front: a newspaper crossword ----
  function newspaper(R, n) {
    const fk = C.family(R), sh = C.shade(R) || { code: '—' };
    const cw = C.crossword(C.clues(R, fk));
    const W = 600, H = 840, ink = '#1C1712', paper = '#EFE8D8', id = 'np' + (++uid);
    const ost = "'Old Standard TT', Georgia, serif", fr = "UnifrakturMaguntia, 'Old Standard TT', serif", hand = "Kalam, 'Comic Sans MS', cursive";
    const s = Math.min(40, 500 / Math.max(cw.cols, 1), 330 / Math.max(cw.rows, 1));
    const ox = (W - cw.cols * s) / 2, oy = 196 + (330 - cw.rows * s) / 2;
    let g = `<defs>${grainDefs(id, .34, .9)}</defs><rect width="${W}" height="${H}" fill="${paper}"/>`;
    // a chai ring, left by the cup that sat on the paper
    g += `<g opacity=".22" transform="translate(500 120) rotate(20)"><circle r="62" fill="none" stroke="#8A4A1E" stroke-width="7" stroke-dasharray="120 8 60 14 200 6"/><circle r="56" fill="none" stroke="#8A4A1E" stroke-width="2" opacity=".6"/></g>`;
    g += `<text x="${W / 2}" y="70" text-anchor="middle" font-family="${fr}" font-size="50" fill="${ink}">The Chai Chronicle</text>`;
    g += `<line x1="30" x2="${W - 30}" y1="88" y2="88" stroke="${ink}" stroke-width="2.5"/><line x1="30" x2="${W - 30}" y1="93" y2="93" stroke="${ink}" stroke-width=".8"/>`;
    g += `<text x="30" y="110" font-family="${ost}" font-size="11" letter-spacing="1" fill="${ink}">VOL. I · NO. ${esc(sh.code)}</text><text x="${W / 2}" y="110" text-anchor="middle" font-family="${ost}" font-size="11" letter-spacing="1" fill="${ink}">SATURDAY, 15 NOVEMBER 2026</text><text x="${W - 30}" y="110" text-anchor="end" font-family="${ost}" font-size="11" letter-spacing="1" fill="${ink}">PRICE: ONE CUP</text>`;
    g += `<line x1="30" x2="${W - 30}" y1="120" y2="120" stroke="${ink}" stroke-width=".8"/>`;
    g += `<text x="${W / 2}" y="154" text-anchor="middle" font-family="${ost}" font-weight="700" font-size="25" fill="${ink}">Crossword: ${esc(C.FAM[fk].name)}</text>`;
    g += `<text x="${W / 2}" y="176" text-anchor="middle" font-family="${ost}" font-style="italic" font-size="13.5" fill="${ink}">Every answer is a step in your recipe. Solved, in ink, at the kitchen table.</text>`;
    // grid: black squares fill the box, white squares carry the letters
    const have = new Set(cw.cells.map(c => c.r + ',' + c.c));
    g += `<rect x="${ox - 3}" y="${oy - 3}" width="${cw.cols * s + 6}" height="${cw.rows * s + 6}" fill="${ink}"/>`;
    for (let r = 0; r < cw.rows; r++) for (let c = 0; c < cw.cols; c++) if (!have.has(r + ',' + c)) g += `<rect x="${ox + c * s}" y="${oy + r * s}" width="${s}" height="${s}" fill="${ink}"/>`;
    cw.cells.forEach(c => {
      const x = ox + c.c * s, y = oy + c.r * s;
      g += `<rect x="${x + .6}" y="${y + .6}" width="${s - 1.2}" height="${s - 1.2}" fill="#F7F1E3"/>`;
      if (c.n) g += `<text x="${x + 2.5}" y="${y + s * .27}" font-family="${ost}" font-size="${Math.max(7, s * .24)}" fill="${ink}">${c.n}</text>`;
      g += `<text class="cwl" x="${x + s / 2}" y="${y + s * .78}" text-anchor="middle" font-family="${hand}" font-weight="700" font-size="${s * .62}" fill="#1D2C6B">${c.ch}</text>`;
    });
    const across = cw.placed.filter(p => p.dir === 'A').sort((a, b) => a.n - b.n), down = cw.placed.filter(p => p.dir === 'D').sort((a, b) => a.n - b.n);
    const top = 548;
    g += `<line x1="30" x2="${W - 30}" y1="${top}" y2="${top}" stroke="${ink}" stroke-width="2"/><line x1="${W / 2}" x2="${W / 2}" y1="${top + 12}" y2="${H - 64}" stroke="${ink}" stroke-width=".8"/>`;
    const col = (title, list, x) => {
      let y = top + 30, out = `<text x="${x}" y="${y}" font-family="${ost}" font-weight="700" font-size="15" letter-spacing="2" fill="${ink}">${title}</text>`;
      y += 22;
      list.forEach(p => {
        wrap(`${p.n}. ${p.clue} (${p.word.length})`, 33).forEach((l, i) => { if (y < H - 66) out += `<text x="${x + (i ? 16 : 0)}" y="${y}" font-family="${ost}" font-size="14" fill="${ink}">${esc(l)}</text>`; y += 17; });
        y += 4;
      });
      return out;
    };
    g += col('ACROSS', across, 36) + col('DOWN', down, W / 2 + 14);
    g += `<line x1="30" x2="${W - 30}" y1="${H - 52}" y2="${H - 52}" stroke="${ink}" stroke-width=".8"/>`;
    g += `<text x="30" y="${H - 30}" font-family="${ost}" font-style="italic" font-size="12.5" fill="${ink}">One cup among ${n}. Turn over for your stamp ↻</text><text x="${W - 30}" y="${H - 30}" text-anchor="end" font-family="${ost}" font-size="11" letter-spacing="1" fill="${ink}">THE KEN</text>`;
    g += `<rect width="${W}" height="${H}" filter="url(#${id})"/>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${g}</svg>`;
  }

  // ---- Time on the stove ----
  // What the pan holds at moment t (0 cold pan … 3 heat off): milk only once it's in, leaf darkening the longer it's been in.
  function liquidAt(R, t) {
    if (t >= 4) return liquid(R);
    const milkIn = R.milk > 0 && (R.st.milk == null || R.st.milk <= t);
    const base = { ...R, milk: R.milk == null ? null : (milkIn ? R.milk : (R.milk === 5 ? null : 0)) };
    if (base.milk == null && R.milk === 5 && !milkIn) return null;
    const plain = liquid({ ...base, teas: [], amt: null });
    const teaIn = R.teas.length && (R.st.tea == null ? t >= 2 : R.st.tea <= t);
    if (!teaIn || !plain) return plain;
    const age = t - (R.st.tea == null ? 2 : R.st.tea);
    const full = liquid({ ...base });
    return mix(plain, full, age <= 0 ? .5 : age === 1 ? .82 : 1);
  }
  // A patila on the burner. Same 200×230 box as the vessels, so the tea cell never jumps.
  function pan(col, t, o = {}) {
    const ink = '#2A1E14';
    let g = `<ellipse cx="100" cy="216" rx="70" ry="6" fill="#2A1E14" opacity=".12"/>`;
    g += `<path d="M40 206 L160 206 L152 214 L48 214Z" fill="#3A332D" stroke="${ink}" stroke-width="1.6"/>`;
    const fl = t === 1 ? 3 : t === 2 ? 5 : 0;
    for (let i = 0; i < fl; i++) { const x = 100 + (i - (fl - 1) / 2) * 17, h = t === 2 ? 20 : 12; g += `<path class="flm" d="M${x - 6} 205 Q${x - 7} ${205 - h * .6} ${x} ${205 - h} Q${x + 7} ${205 - h * .6} ${x + 6} 205Z" fill="${i % 2 ? '#F7C64A' : '#E8742A'}" stroke="${ink}" stroke-width="1"/>`; }
    if (!fl) g += `<path d="M66 204 h68" stroke="#6E655C" stroke-width="3" stroke-dasharray="4 5" stroke-linecap="round"/>`;
    if (col && t >= 1 && t <= 3) { const n = t === 2 ? 3 : 1; for (let i = 0; i < n; i++) g += `<path class="steam s${i}" d="M${100 + (i - (n - 1) / 2) * 20} 60 q-7 -10 0 -20 q7 -10 0 -20" fill="none" stroke="#A89A88" stroke-width="2.6" stroke-linecap="round" opacity=".6"/>`; }
    g += `<path d="M168 92 L198 86 Q201 92 198 96 L168 102" fill="#2A2522" stroke="${ink}" stroke-width="2" stroke-linejoin="round"/>`;
    g += `<path d="M28 76 L172 76 L164 190 Q100 202 36 190Z" fill="#BDB8B0" stroke="${ink}" stroke-width="2.4" stroke-linejoin="round"/>`;
    if (col) {
      g += `<path d="M30.6 100 L169.4 100 L164 190 Q100 202 36 190Z" fill="${col}"/><ellipse cx="100" cy="100" rx="69.4" ry="8" fill="${mix(col, '#FFFFFF', .18)}"/>`;
      if (t === 2) for (let i = 0; i < 7; i++) g += `<circle class="bub b${i % 3}" cx="${44 + i * 19}" cy="${100 + (i % 2) * 3}" r="${3 + (i % 3)}" fill="${mix(col, '#FFFFFF', .4)}" stroke="${mix(col, '#000000', .2)}" stroke-width=".8"/>`;
      (o.float || []).slice(0, 5).forEach((k, i) => { g += `<g transform="translate(${56 + i * 22} ${126 + (i % 2) * 22}) rotate(${i * 41 - 30}) scale(.4) translate(-24 -24)" opacity=".85">${ICON.g(k)}</g>`; });
    } else if (o.emptyLabel !== false) g += `<text x="100" y="146" text-anchor="middle" font-family="'IM Fell English', Georgia, serif" font-style="italic" font-size="14" fill="${ink}" opacity=".55">empty pan</text>`;
    g += `<path d="M28 76 L172 76 L164 190 Q100 202 36 190Z" fill="none" stroke="${ink}" stroke-width="2.4" stroke-linejoin="round"/>`;
    g += `<path d="M24 70 L176 70 L174 80 L26 80Z" fill="#CFCAC2" stroke="${ink}" stroke-width="2.2" stroke-linejoin="round"/><path d="M44 92 L48 176" stroke="#fff" stroke-width="3.5" stroke-linecap="round" opacity=".45"/>`;
    return `<svg class="vessel pan" viewBox="0 0 200 230" preserveAspectRatio="xMidYMax meet" aria-hidden="true">${g}</svg>`;
  }

  // ---- The recipe strip: the one way a recipe is drawn, for you and for every reader ----
  // Five moments on a line; each ingredient's icon sits at the moment it goes in. Flames count the boils.
  const STRIP_L = ['cold pan', 'heating', 'boiling', 'heat off', 'in the cup'];
  function strip(R, o = {}) {
    const cols = [[], [], [], [], []], later = [];
    const put = (k, st, key) => (st == null ? later : cols[st]).push({ k, key: key || k });
    if (R.milk != null && R.milk < 5) cols[0].push({ k: 'water', key: 'water' });
    if (R.milk > 0) put('milk', R.st.milk);
    (R.teas.length ? R.teas : (R.amt != null ? ['leaf'] : [])).forEach(t => put(t === 'unsure' ? 'leaf' : t, R.st.tea, t));
    if (R.sweet && R.sweet !== 'none') { const k = R.sweet.startsWith('sugar') ? 'sugar' : R.sweet; put(k, R.st.sweet, k); }
    R.extras.forEach(s => put(s, R.st[s]));
    const nb = R.milk > 0 && R.boils ? (R.boils === 4 ? 3 : R.boils) : 0;
    const ic = it => o.remove ? `<button type="button" class="si" data-act="out" data-k="${it.key}" aria-label="Take ${it.k} out">${ICON(it.k)}</button>` : `<span class="si">${ICON(it.k)}</span>`;
    const colHTML = (items, i, lab) => `<div class="st-c${o.now === i ? ' now' : ''}"><div class="st-i">${items.map(ic).join('')}${i === 2 && nb ? `<span class="st-f">${'<i></i>'.repeat(nb)}${R.boils === 4 ? '<em>sim</em>' : ''}</span>` : ''}</div><div class="st-l">${lab}</div></div>`;
    return `<div class="strip${o.you ? ' you' : ''}">${cols.map((c, i) => colHTML(c, i, STRIP_L[i])).join('')}${later.length ? colHTML(later, -1, 'when?') : ''}</div>`;
  }

  // ---- The card: your chai, illustrated, with its timeline (the same layout as the readers' response cards) ----
  function card(R, n, o = {}) {
    const W = 600, H = 840, ink = '#241A11', paper = '#EFE7D5', red = '#A8321F', id = 'cd' + (++uid);
    const fk = C.family(R), F = C.FAM[fk], X = FAMX[fk], sh = C.shade(R) || { code: '—' };
    const fell = "'IM Fell English', Georgia, serif", rk = "Reckless, Georgia, serif", pop = "Poppins, Arial, sans-serif";
    let g = `<defs>${grainDefs(id, .26)}</defs><rect width="${W}" height="${H}" fill="${paper}"/><rect x="22" y="22" width="${W - 44}" height="${H - 44}" fill="none" stroke="#8D7B62" stroke-width="1.2"/>`;
    g += `<line x1="22" x2="${W - 22}" y1="80" y2="80" stroke="#8D7B62" stroke-width="1.2"/>`;
    // what went into it, as one stacked bar
    const segs = o.segs || [];
    let bx = 44; const bw = W - 88, by0 = 39, bh = 24;
    segs.forEach(([l, p, c]) => { const w = p * bw; g += `<rect x="${bx.toFixed(1)}" y="${by0}" width="${Math.max(2, w).toFixed(1)}" height="${bh}" fill="${c}" stroke="${ink}" stroke-opacity=".45" stroke-width=".8"/>`; if (p > .14) g += `<text x="${(bx + w / 2).toFixed(1)}" y="${by0 + 16}" text-anchor="middle" font-family="${fell}" font-size="12" fill="${ink}">${esc(l)} ${Math.round(p * 100)}%</text>`; bx += w; });
    if (segs.length) g += `<rect x="44" y="${by0}" width="${bw}" height="${bh}" fill="none" stroke="${ink}" stroke-width="1.2"/>`;
    // the illustration
    const v = vessel(R, { still: true, emptyLabel: false, float: !R.vessel || R.vessel === 'glass' ? R.extras : [] }).replace(/<svg class="vessel"[^>]*>/, '<svg x="135" y="120" width="330" height="380" viewBox="0 0 200 230">');
    g += v;
    const nm = (R.name || 'Chai').slice(0, 28), nfs = nm.length > 18 ? 28 : nm.length > 12 ? 34 : 40;
    if (!o.hideName) g += `<text x="${W / 2}" y="548" text-anchor="middle" font-family="${rk}" font-weight="bold" font-size="${nfs}" fill="${ink}">${esc(nm)}</text>`;
    g += `<text x="${W / 2}" y="578" text-anchor="middle" font-family="${fell}" font-style="italic" font-size="18" fill="${ink}">${esc(F.name)} · ${esc(X.hi)} · shade ${esc(sh.code)}</text>`;
    // the timeline: five moments, icons where each thing goes in, flames for the boils
    const cols = [[], [], [], [], []], later = [];
    const put = (k, st) => (st == null ? later : cols[st]).push(k);
    if (R.milk != null && R.milk < 5) cols[0].push('water');
    if (R.milk > 0) put('milk', R.st.milk);
    R.teas.forEach(t => put(t === 'unsure' ? 'leaf' : t, R.st.tea));
    if (R.sweet && R.sweet !== 'none') put(R.sweet.startsWith('sugar') ? 'sugar' : R.sweet, R.st.sweet);
    R.extras.forEach(s => put(s, R.st[s]));
    const x0 = 70, x1 = W - 70, by = 690, labs = ['cold pan', 'heating', 'boiling', 'heat off', 'in the cup'];
    g += `<line x1="${x0 - 14}" x2="${x1 + 14}" y1="${by}" y2="${by}" stroke="#8D7B62" stroke-width="1.2"/>`;
    labs.forEach((l, i) => {
      const x = x0 + i * (x1 - x0) / 4;
      g += `<circle cx="${x}" cy="${by}" r="4.5" fill="${paper}" stroke="#8D7B62" stroke-width="1.2"/><text x="${x}" y="${by + 22}" text-anchor="middle" font-family="${fell}" font-size="13" fill="#5A4A38">${l}</text>`;
      const items = cols[i], sz = items.length > 4 ? 22 : 30;
      items.forEach((k, j) => { const col = j % 3, row = Math.floor(j / 3), n = Math.min(3, items.length); const ix = x + (col - (n - 1) / 2) * (sz + 2) - sz / 2, iy = by - 12 - (row + 1) * (sz + 2); g += `<g transform="translate(${ix} ${iy}) scale(${sz / 48})">${ICON.g(k)}</g>`; });
      if (i === 2 && R.milk > 0 && R.boils) for (let b = 0; b < Math.min(3, R.boils === 4 ? 3 : R.boils); b++) g += `<g transform="translate(${x + 24 + b * 11} ${by - 22}) scale(.26)">${ICON.g('flame')}</g>`;
    });
    if (later.length) g += `<text x="${W / 2}" y="${by - 96}" text-anchor="middle" font-family="${fell}" font-style="italic" font-size="12" fill="#5A4A38">not yet timed: ${later.map(k => k).join(', ')}</text>`;
    g += `<line x1="22" x2="${W - 22}" y1="752" y2="752" stroke="#8D7B62" stroke-width="1.2"/>`;
    g += `<text x="44" y="788" font-family="${fell}" font-style="italic" font-size="14" fill="${ink}">One cup among ${n}</text><text x="${W - 44}" y="788" text-anchor="end" font-family="${fell}" font-size="14" fill="${ink}">How India makes chai · The Ken</text>`;
    g += `<rect width="${W}" height="${H}" filter="url(#${id})"/>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${g}</svg>`;
  }

  window.CHAIART = { FAMX, liquid, liquidAt, vessel, pan, strip, stamp, newspaper, card, mix };
})();
