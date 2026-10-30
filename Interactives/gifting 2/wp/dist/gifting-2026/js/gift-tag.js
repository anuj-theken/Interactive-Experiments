/* Gift tag renderer, shared by the story (index.html) and the tag kit (tag-kit/index.html).

   GiftTag.svg(content, style) returns one tag as an inline SVG string.
     content: { kicker, headline, credit, item, band, count, section, editorial }
     style:   GiftTag.style(id, section) = window.TAG_THEME, then its variety picks, then any per-tag override

   Variety: when TAG_THEME.variety.on is true, each gift draws its own shape, layout, colour, accent and
   width from the pools in TAG_THEME.variety, picked from the gift's id so a tag looks the same on every visit.

   Every look option the renderer understands is listed in GiftTag.SCHEMA (and GiftTag.POOLS for variety).
   The kit builds its controls from those lists. Call GiftTag.ready() (fonts loaded) before the first render. */
(function () {
  const SHAPES = ['classic', 'arch', 'luggage', 'swallowtail', 'pointed', 'scallop', 'ticket'];
  const LAYOUTS = ['frame', 'quote', 'item', 'price'];
  const ACCENTS = ['band', 'edge', 'fill', 'none'];
  const SCHEMA = [
    { key: 'shape', label: 'Shape', type: 'choice', options: SHAPES },
    { key: 'layout', label: 'Layout', type: 'choice', options: LAYOUTS },
    { key: 'fill', label: 'Tag colour', type: 'colour' },
    { key: 'accent', label: 'Accent colour', type: 'colour', extra: ['section'] },
    { key: 'accentStyle', label: 'Accent sits', type: 'choice', options: ACCENTS },
    { key: 'border', label: 'Border width', type: 'range', min: 0, max: 4, step: 0.5 },
    { key: 'borderColour', label: 'Border colour', type: 'colour' },
    { key: 'shadow', label: 'Shadow', type: 'colour', extra: ['none', 'section'] },
    { key: 'shadowOffset', label: 'Shadow offset', type: 'range', min: 0, max: 10, step: 1 },
    { key: 'hole', label: 'Hole', type: 'choice', options: ['ring', 'plain', 'none'] },
    { key: 'string', label: 'String', type: 'choice', options: ['twine', 'ribbon', 'none'] },
    { key: 'stub', label: 'Tear-off stub', type: 'toggle' },
    { key: 'price', label: 'Price shown as', type: 'choice', options: ['coins', 'rupees', 'label', 'stamp'] },
    { key: 'priceCaption', label: 'Price in words under it', type: 'toggle' },
    { key: 'showKicker', label: 'Section label', type: 'toggle' },
    { key: 'showCredit', label: 'Reader credit', type: 'toggle' },
    { key: 'showCount', label: '“Came up” count', type: 'toggle' },
    { key: 'quoteMarks', label: 'Quote marks', type: 'toggle' },
    { key: 'tilt', label: 'Random tilt (±°)', type: 'range', min: 0, max: 8, step: 0.5 }
  ];
  // what the variety pools may hold (fills come from the palette, plus "section")
  const POOLS = { shapes: SHAPES, layouts: LAYOUTS, accentStyles: ACCENTS };

  // Price bands from the survey: 0 free · 1 under ₹3K · 2 ₹3–12K · 3 ₹12–35K · 4 ₹35–50K
  const LO = [0, 0, 3, 12, 35], HI = [0, 3, 12, 35, 50];
  function bandRange(b) { const p = String(b).split(/[–-]/).map(Number); return [p[0], p.length > 1 ? p[1] : p[0]]; }
  function priceRange(b) { const [lo, hi] = bandRange(b); return [LO[lo], HI[hi]]; } // ₹ thousands
  // the price as symbols, as on the card frames: ₹, ₹–₹₹, Free
  const SYM = ['Free', '₹', '₹₹', '₹₹₹', '₹₹₹₹'];
  function priceSymbols(b) { const [lo, hi] = bandRange(b); return lo === hi ? SYM[hi] : `${SYM[lo]}–${SYM[hi]}`; }
  function priceLabel(b) {
    const [lo, hi] = bandRange(b);
    if (hi === 0) return 'Free';
    if (lo === 0) return 'Free to ₹' + HI[hi] + 'K';
    if (lo === 1) return 'Under ₹' + HI[hi] + 'K';
    return '₹' + LO[lo] + '–' + HI[hi] + 'K';
  }

  const FONT = {
    display: '"Jazmin Alt", Georgia, serif',
    body: '"GT America", Arial, sans-serif',
    bold: '"GT America Bold", Arial, sans-serif'
  };
  function ready() {
    if (!document.fonts) return Promise.resolve();
    return Promise.all([
      document.fonts.load('bold 20px "Jazmin Alt"'),
      document.fonts.load('bold 14px "GT America Bold"'),
      document.fonts.load('300 12px "GT America"')
    ]).catch(() => {});
  }

  const ctx = document.createElement('canvas').getContext('2d');
  function wrap(text, font, max, maxLines) {
    ctx.font = font;
    const out = []; let line = '';
    String(text).split(/\s+/).filter(Boolean).forEach(w => {
      const t = line ? line + ' ' + w : w;
      if (ctx.measureText(t).width > max && line) { out.push(line); line = w; } else line = t;
    });
    if (line) out.push(line);
    if (maxLines && out.length > maxLines) {
      const keep = out.slice(0, maxLines); let last = keep[maxLines - 1] + '…';
      while (ctx.measureText(last).width > max && last.length > 2) last = last.slice(0, -2).trim() + '…';
      keep[maxLines - 1] = last; return keep;
    }
    return out;
  }
  const E = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  function hexToRgb(h) { h = String(h).replace('#', ''); if (h.length === 3) h = h.replace(/./g, c => c + c); const n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function isDark(h) { const [r, g, b] = hexToRgb(h); return (0.299 * r + 0.587 * g + 0.114 * b) < 150; }
  function hash(s) { let h = 2166136261; for (const ch of String(s)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }

  // Theme → variety picks → per-tag override, with colour names resolved to hex.
  function style(id, section, theme) {
    const th = theme || window.TAG_THEME;
    const t = Object.assign({}, th);
    const v = th.variety;
    if (v && v.on) {
      const pick = (pool, salt) => pool && pool.length ? pool[hash(id + salt) % pool.length] : undefined;
      const sh = pick(v.shapes, 's'), la = pick(v.layouts, 'l'), fi = pick(v.fills, 'f'), ac = pick(v.accentStyles, 'a');
      if (sh) t.shape = sh; if (la) t.layout = la; if (fi) t.fill = fi; if (ac) t.accentStyle = ac;
      if (v.widths) { const [a, b] = v.widths; t._width = a + (hash(id + 'w') % 5) / 4 * (b - a); }
      if (v.prices && v.prices.length) t.price = pick(v.prices, 'p');
    }
    Object.assign(t, (th.overrides || {})[id] || {});
    const pal = t.palette || {};
    const col = c => c === 'section' ? (pal[(t.sections || {})[section]] || pal.red || '#C8423A') : (pal[c] || c);
    t._fill = col(t.fill); t._accent = col(t.accent); t._border = col(t.borderColour);
    t._shadow = t.shadow === 'none' ? null : col(t.shadow);
    t._ink = pal.ink || '#1A1208';
    t._fillInk = (t.fillInk || {})[t.fill] || '';
    // an accent the same colour as the tag disappears: use the section colour (or ink) instead
    if (t._accent.toLowerCase() === t._fill.toLowerCase() && t.accentStyle !== 'fill') t._accent = t.fill === 'section' ? t._ink : col('section');
    return t;
  }

  function shapePath(shape, W, H) {
    const c = Math.round(W * 0.2), tail = 18;
    switch (shape) {
      case 'arch': return `M0,46 C0,10 ${W * .22},0 ${W / 2},0 C${W * .78},0 ${W},10 ${W},46 V${H} H0 Z`;
      case 'luggage': { const r = 14; return `M${r},0 H${W - r} Q${W},0 ${W},${r} V${H - r} Q${W},${H} ${W - r},${H} H${r} Q0,${H} 0,${H - r} V${r} Q0,0 ${r},0 Z`; }
      case 'swallowtail': return `M${c},0 H${W - c} L${W},${c} V${H} L${W / 2},${H - tail} L0,${H} V${c} Z`;
      case 'pointed': return `M0,38 L${W / 2},0 L${W},38 V${H} H0 Z`;
      case 'scallop': { // wavy top edge and bottom edge
        const n = 6, s = W / n; let d = `M0,10`;
        for (let i = 0; i < n; i++) d += ` Q${i * s + s / 2},-6 ${(i + 1) * s},10`;
        d += ` V${H - 8}`;
        for (let i = n; i > 0; i--) d += ` Q${i * s - s / 2},${H + 6} ${(i - 1) * s},${H - 8}`;
        return d + ' Z';
      }
      case 'ticket': { const r = 12; return `M${r},0 H${W - r} A${r},${r} 0 0 0 ${W},${r} V${H - r} A${r},${r} 0 0 0 ${W - r},${H} H${r} A${r},${r} 0 0 0 0,${H - r} V${r} A${r},${r} 0 0 0 ${r},0 Z`; }
      default: return `M${c},0 H${W - c} L${W},${c} V${H} H0 V${c} Z`;
    }
  }

  let uid = 0;
  function svg(content, st, opts) {
    opts = opts || {};
    const S = Object.assign({}, st);
    const W = Math.round(opts.width || S._width || 230), P = 16, inner = W - P * 2;
    const fill = S.accentStyle === 'fill' ? S._accent : S._fill;
    const dark = isDark(fill);
    const txt = dark ? '#FFFFFF' : S._ink;
    const soft = dark ? 'rgba(255,255,255,.78)' : '#5C4A4A';
    const bandOn = S.accentStyle === 'band';
    const onBand = isDark(S._accent) ? '#FFFFFF' : S._ink;
    const hSize = opts.headSize || (W >= 260 ? 22 : W >= 225 ? 19 : 17);
    const id = 'gt' + (++uid);
    const stringH = S.string === 'none' ? 0 : (opts.stringH == null ? 34 : opts.stringH);
    const holeY = S.shape === 'scallop' ? 26 : 22;
    const layout = S.layout || 'quote';
    const parts = [];
    const accentText = dark ? '#FFFFFF' : (isDark(S._accent) || S._accent === S._fill ? S._accent : S._ink);
    let y = bandOn ? 60 : (S.shape === 'pointed' ? 56 : 50);

    const text = (x, yy, font, size, colour, str, extra) => `<text x="${x}" y="${yy}" font-family='${FONT[font]}' font-weight="${font === 'body' ? 300 : 'bold'}" font-size="${size}" fill="${colour}" ${extra || ''}>${E(str)}</text>`;
    const layer = (start, name) => { const seg = parts.splice(start); if (seg.length) parts.push(`<g class="gt-${name}">${seg.join('')}</g>`); };
    const lines = (arr, yy, lh, font, size, colour, extra) => { arr.forEach((l, i) => parts.push(text(P, yy + i * lh, font, size, colour, l, extra))); return yy + (arr.length - 1) * lh; };

    // kicker (section label), shortened to fit
    if (S.showKicker && content.kicker) {
      const k = String(content.kicker).toUpperCase();
      ctx.font = `bold 9px ${FONT.bold}`;
      let kk = k; while (kk.length > 4 && ctx.measureText(kk).width + kk.length * 1.3 > inner) kk = kk.slice(0, -2);
      parts.push(`<g class="gt-kicker">${text(P, y, 'bold', 9, soft, kk === k ? k : kk.trim() + '…', 'letter-spacing="1.3"')}</g>`); y += 16;
    } else y -= 4;

    const q = S.quoteMarks && !content.editorial;
    const quote = (q ? '“' : '') + content.headline + (q ? '”' : '');
    const hasBand = content.band != null && content.band !== '';
    let perfY;

    function credit() {
      if (!(S.showCredit && content.credit)) return;
      const at = parts.length; y += 17; y = lines(wrap(content.credit, `300 11px ${FONT.body}`, inner, 2), y, 14, 'body', 11, soft); layer(at, 'credit');
    }
    function perf(gap) { y += gap; perfY = y; y += S.stub ? 22 : 10; if (!S.stub) parts.push(`<line x1="${P}" x2="${W - P}" y1="${perfY}" y2="${perfY}" stroke="${soft}" stroke-width="1" opacity=".5"/>`); }

    let frameH = 0;
    if (layout === 'frame') {
      // the card frames (design-kit / imgs/cards/sample.png): words centred at the top, then the credit, the gift's
      // icon and its name in blue, and price + "came up" along the bottom edge. Every card is at least 1.3× as tall as wide.
      const cx = W / 2, GREY = '#707070', BLUE = S._fillInk || '#1150BD', fin = W - 36, qs = opts.headSize || (W >= 240 ? 19 : 17.5), qlh = Math.round(qs * 1.16);
      const mid = (str, yy, font, size, colour, extra) => text(cx, yy, font, size, colour, str, `text-anchor="middle" ${extra || ''}`);
      let at = parts.length;
      const ql = wrap(quote, `bold ${qs}px ${FONT.display}`, fin);
      y = holeY + 24 + qs * .8;
      ql.forEach((l, i) => parts.push(mid(l, y + i * qlh, 'display', qs, txt))); y += (ql.length - 1) * qlh; layer(at, 'headline');
      if (S.showCredit && content.credit) {
        at = parts.length; y += 17;
        const cl = wrap(String(content.credit).toUpperCase(), `bold 8.5px ${FONT.bold}`, fin - 8, 2);
        cl.forEach((l, i) => parts.push(mid(l, y + i * 12, 'bold', 8.5, GREY, 'letter-spacing=".6"'))); y += (cl.length - 1) * 12; layer(at, 'credit');
      }
      const ICON = Math.round(W * .3), il = content.item ? wrap(String(content.item).toUpperCase(), `bold 12px ${FONT.bold}`, fin, 3) : [];
      const blockH = (content.icon ? ICON + 12 : 0) + il.length * 15, ROW = 34;
      frameH = Math.max(Math.round(W * 1.3), Math.ceil(y + 18 + blockH + 18 + ROW));
      let by = y + Math.max(18, (frameH - ROW - y - blockH) / 2);
      // the icon, tinted to the card's text colour (the icons are line art on transparent backgrounds)
      if (content.icon) { parts.push(`<filter id="${id}t"><feFlood flood-color="${BLUE}"/><feComposite in2="SourceAlpha" operator="in"/></filter><image class="gt-icon" href="${E(content.icon)}" x="${cx - ICON / 2}" y="${by.toFixed(1)}" width="${ICON}" height="${ICON}" preserveAspectRatio="xMidYMid meet" filter="url(#${id}t)"/>`); by += ICON + 12; }
      at = parts.length; il.forEach((l, i) => parts.push(mid(l, by + 10 + i * 15, 'bold', 12, BLUE, 'letter-spacing=".4"'))); layer(at, 'item');
      const fy = frameH - 16 - (S.shape === 'scallop' ? 5 : 0);
      if (hasBand) parts.push(`<g class="gt-price">${text(P, fy, 'bold', 10, GREY, priceSymbols(content.band))}</g>`);
      if (S.showCount && content.count) parts.push(`<g class="gt-count">${text(W - P, fy, 'bold', 9, GREY, `CAME UP X${content.count}`, 'text-anchor="end" letter-spacing=".6"')}</g>`);
      y = frameH - 14;
    } else if (layout === 'item') {
      // the product leads: item in display type, price right under it, the reader's reason below the tear
      y += hSize * 0.82;
      let at = parts.length;
      y = lines(wrap(content.item, `bold ${hSize + 1}px ${FONT.display}`, inner, 4), y, Math.round((hSize + 1) * 1.12), 'display', hSize + 1, txt); layer(at, 'item');
      if (hasBand) { y += 22; parts.push(`<g class="gt-price">${text(P, y, 'bold', 15, accentText, priceLabel(content.band))}</g>`); }
      perf(16);
      parts.push(`<g class="gt-label">${text(P, y, 'bold', 8.5, soft, 'WHY', 'letter-spacing="1.4"')}</g>`); y += 16;
      at = parts.length; y = lines(wrap(quote, `300 13px ${FONT.body}`, inner, 4), y, 17, 'body', 13, txt, 'font-style="italic"'); layer(at, 'headline');
      credit();
      y += 14;
      if (S.showCount && content.count) parts.push(`<text class="gt-count" x="${P}" y="${y + 9}" font-family='${FONT.body}' font-weight="300" font-size="11" fill="${soft}">came up <tspan font-family='${FONT.bold}' font-weight="bold" fill="${txt}">${E(content.count)}×</tspan></text>`);
      y += 14;
    } else if (layout === 'price') {
      // a shop tag: the price is the headline, then the item, then a short line from the reader
      if (hasBand) {
        const pl = priceLabel(content.band), big = pl.length > 9 ? 26 : 34;
        y += big * 0.8;
        const at = parts.length; y = lines(wrap(pl, `bold ${big}px ${FONT.display}`, inner, 2), y, Math.round(big * 1.02), 'display', big, accentText); layer(at, 'price');
        y += 8;
      }
      y += 14;
      let at = parts.length; y = lines(wrap(content.item, `bold 15px ${FONT.bold}`, inner, 3), y, 18, 'bold', 15, txt); layer(at, 'item');
      perf(16);
      at = parts.length; y = lines(wrap(quote, `bold 14px ${FONT.display}`, inner, 3), y + 4, 17, 'display', 14, txt); layer(at, 'headline');
      credit();
      y += 14;
      if (S.showCount && content.count) parts.push(`<text class="gt-count" x="${P}" y="${y + 9}" font-family='${FONT.body}' font-weight="300" font-size="11" fill="${soft}">came up <tspan font-family='${FONT.bold}' font-weight="bold" fill="${txt}">${E(content.count)}×</tspan></text>`);
      y += 14;
    } else {
      // quote (default): the reader's reason leads, the item and price sit on the stub
      y += hSize * 0.82;
      let at = parts.length; y = lines(wrap(quote, `bold ${hSize}px ${FONT.display}`, inner), y, Math.round(hSize * 1.14), 'display', hSize, txt); layer(at, 'headline');
      credit();
      perf(16);
      if (content.item) {
        parts.push(`<g class="gt-label">${text(P, y, 'bold', 8.5, soft, 'IT WAS', 'letter-spacing="1.4"')}</g>`); y += 17;
        at = parts.length; y = lines(wrap(content.item, `bold 14px ${FONT.bold}`, inner), y, 17, 'bold', 14, txt); layer(at, 'item');
      }
      y += 14;
      const fy = y; at = parts.length;
      const priceCol = dark ? '#FFFFFF' : S._accent;
      if (hasBand) {
        const [lo, hi] = bandRange(content.band);
        if (S.price === 'coins') {
          if (hi === 0) parts.push(`<rect x="${P}" y="${fy}" width="40" height="17" rx="8.5" fill="none" stroke="${txt}" stroke-width="1.2" stroke-dasharray="3 2"/>` + text(P + 20, fy + 12, 'bold', 8.5, txt, 'FREE', 'text-anchor="middle" letter-spacing="1"'));
          else for (let i = 1; i <= 4; i++) {
            const on = i >= Math.max(1, lo) && i <= hi, cx = P + 8.5 + (i - 1) * 20;
            parts.push(`<circle cx="${cx}" cy="${fy + 8.5}" r="8" fill="${on ? priceCol : 'none'}" stroke="${on ? priceCol : soft}" stroke-width="1.2" ${on ? '' : 'stroke-dasharray="2 2" opacity=".55"'}/>` + text(cx, fy + 12.5, 'bold', 10, on ? (isDark(priceCol) ? '#fff' : S._ink) : soft, '₹', `text-anchor="middle" ${on ? '' : 'opacity=".55"'}`));
          }
        } else if (S.price === 'rupees') {
          if (hi === 0) parts.push(text(P, fy + 14, 'bold', 13, priceCol, 'FREE', 'letter-spacing="1"'));
          else for (let i = 1; i <= 4; i++) { const on = i >= Math.max(1, lo) && i <= hi; parts.push(`<text x="${P + (i - 1) * 13}" y="${fy + 14}" font-family='${FONT.bold}' font-weight="bold" font-size="17" fill="${on ? priceCol : soft}" opacity="${on ? 1 : .3}">₹</text>`); }
        } else if (S.price === 'stamp') {
          const lab = priceLabel(content.band).toUpperCase();
          ctx.font = `bold 10px ${FONT.bold}`; const w = ctx.measureText(lab).width + 16;
          const sc = dark ? txt : S._accent;
          parts.push(`<g transform="rotate(-4 ${P + w / 2} ${fy + 10})"><rect x="${P}" y="${fy}" width="${w}" height="21" rx="3" fill="none" stroke="${sc}" stroke-width="1.8"/><rect x="${P + 2.5}" y="${fy + 2.5}" width="${w - 5}" height="16" rx="2" fill="none" stroke="${sc}" stroke-width=".7"/>${text(P + w / 2, fy + 14.5, 'bold', 10, sc, lab, 'text-anchor="middle" letter-spacing=".6"')}</g>`);
        } else parts.push(text(P, fy + 14, 'bold', 14, priceCol, priceLabel(content.band)));
      }
      layer(at, 'price');
      if (S.showCount && content.count) parts.push(`<text class="gt-count" x="${W - P}" y="${fy + 13}" text-anchor="end" font-family='${FONT.body}' font-weight="300" font-size="11" fill="${soft}">came up <tspan font-family='${FONT.bold}' font-weight="bold" fill="${txt}">${E(content.count)}×</tspan></text>`);
      y = fy + 22;
      if (S.priceCaption && hasBand && (S.price === 'coins' || S.price === 'rupees')) { parts.push(`<g class="gt-caption">${text(P, y + 8, 'body', 10.5, soft, priceLabel(content.band))}</g>`); y += 14; }
    }
    const H = frameH || Math.ceil(y + 14 + (S.shape === 'swallowtail' ? 16 : 0) + (S.shape === 'scallop' ? 8 : 0));

    // shape, accent, holes, string
    const d = shapePath(S.shape, W, H);
    const off = S._shadow ? (S.shadowOffset || 0) : 0;
    const bw = +S.border || 0;
    const bg = opts.bg || 'var(--gt-bg, #F7F2F2)';
    const deco = []; let notch = '';
    if (bandOn) deco.push(`<rect class="gt-band" x="0" y="-10" width="${W}" height="${(S.shape === 'pointed' ? 50 : 44) + 10}" fill="${S._accent}" clip-path="url(#${id}c)"/>`);
    if (S.accentStyle === 'edge') deco.push(`<rect class="gt-edge" x="0" y="-10" width="7" height="${H + 20}" fill="${S._accent}" clip-path="url(#${id}c)"/>`);
    if (S.stub && perfY) {
      deco.push(`<line class="gt-perf" x1="10" x2="${W - 10}" y1="${perfY}" y2="${perfY}" stroke="${soft}" stroke-width="1.3" stroke-dasharray="4 3" opacity=".8"/>`);
      if (S.shape !== 'luggage' && S.shape !== 'ticket') notch = `<g class="gt-notch" clip-path="url(#${id}c)"><circle cx="0" cy="${perfY}" r="6.5" fill="${bg}" stroke="${S._border}" stroke-width="${bw * 2}"/><circle cx="${W}" cy="${perfY}" r="6.5" fill="${bg}" stroke="${S._border}" stroke-width="${bw * 2}"/></g>`;
    }
    const ringCol = bandOn ? onBand : (dark ? '#fff' : S._border);
    const hole = S.hole === 'none' ? '' :
      `<g class="gt-hole">${S.hole === 'ring' ? `<circle cx="${W / 2}" cy="${holeY}" r="10.5" fill="${bandOn ? 'rgba(255,255,255,.22)' : 'none'}" stroke="${ringCol}" stroke-width="1.5" opacity=".9"/>` : ''}<circle cx="${W / 2}" cy="${holeY}" r="5.5" fill="${bg}" stroke="${ringCol}" stroke-width="1"/></g>`;
    const sw = S.string === 'ribbon' ? 5 : 1.6;
    const sc = S.string === 'ribbon' ? (S.accent === 'section' ? S._accent : (S.palette || {}).red || '#C8423A') : (opts.stringColour || S._ink);
    const str = stringH ? `<path class="gt-string" d="M${W / 2},${holeY} C${W / 2 - 3},${holeY - 12} ${W / 2 + 4},${-stringH * .55} ${W / 2},${-stringH}" fill="none" stroke="${sc}" stroke-width="${sw}" stroke-linecap="round"/>` : '';
    const pad = Math.max(bw, 1) + 6;
    const vbX = -pad, vbY = -stringH - 8, vbW = W + off + pad * 2, vbH = H + off + stringH + pad + 8;
    return `<svg class="gtag-svg" xmlns="http://www.w3.org/2000/svg" viewBox="${vbX} ${vbY} ${vbW} ${vbH}" width="${vbW}" height="${vbH}" role="img" aria-label="${E(content.item ? content.item + ': ' : '')}${E(content.headline)}">
<defs><clipPath id="${id}c"><path d="${d}"/></clipPath></defs>
${off ? `<path class="gt-shadow" d="${d}" transform="translate(${off},${off})" fill="${S._shadow}"/>` : ''}
<path class="gt-shape" d="${d}" fill="${fill}"/>${deco.join('')}
${bw ? `<path class="gt-border" d="${d}" fill="none" stroke="${S._border}" stroke-width="${bw}" stroke-linejoin="round"/>` : ''}${notch}
${hole}${str}${parts.join('')}</svg>`;
  }

  window.GiftTag = { SCHEMA, POOLS, svg, style, ready, priceLabel, priceSymbols, priceRange, bandRange, isDark, hash, shapePath, FONT };
})();
