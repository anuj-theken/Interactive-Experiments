// The age-profile card, shared by the story and the quiz so both end on the same card.
// html(d) draws it on the page; draw(d) paints the image for downloading and sharing FROM that same HTML:
// it lays out a hidden copy at the width the reader sees and copies every box and line of text onto a canvas,
// so the image always matches the card on screen (landscape on wide screens, portrait on narrow ones).
// d = { tag, cap, age, you, art, rows: [{ label, value, state: 'set'|'skipped'|'empty', sub, wide }] }
//   tag: the headline; cap: label on the character; art: the character's <svg> for the page;
//   age + you: how to paint the character in the image (you = the reader's look, if they picked one).
//   rows[0] is the big answer under the headline; the rest pair up two to a line, wide rows run across.
(function () {
  const BASE = window.AGE_BASE || '';
  const LOGO = BASE + 'assets/logo.png';
  const ORANGE = '#B9401F';
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const shown = r => r.state === 'set' ? r.value : r.state === 'skipped' ? 'Skipped' : '—';

  // One stylesheet for both pages. Layout follows the card's own width (container queries), so the hidden copy
  // laid out at the same width lands on the same layout.
  const CSS = `
  .QW4K-pc-wrap { container-type: inline-size; width: 100%; }
  .QW4K-final { display: grid; grid-template-columns: minmax(0, 46fr) minmax(0, 54fr); grid-template-areas: "art head" "grid grid" "foot foot";
    gap: 26px 28px; align-items: start; background: #fff; border: 3px solid var(--ink); box-shadow: 8px 8px 0 var(--red); padding: 26px; text-align: left; color: var(--ink); }
  .QW4K-final > .QW4K-frame { grid-area: art; width: 100%; }
  .QW4K-pc-head { grid-area: head; min-width: 0; }
  .QW4K-pc-tag { font-family: var(--ken-font-display); font-weight: bold; font-size: 32px; line-height: 1.08; color: var(--ink); }
  .QW4K-pc-rule { width: 64px; height: 3px; background: var(--red); margin: 14px 0 16px; }
  .QW4K-pc-grid { grid-area: grid; margin: 0; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 22px 28px; }
  .QW4K-pc-row { min-width: 0; }
  .QW4K-pc-row.QW4K-wide { grid-column: 1 / -1; }
  .QW4K-pc-row dt { font-family: var(--ken-font-body); font-weight: normal; font-size: 17px; line-height: 1.25; color: var(--ink); }
  .QW4K-pc-row dd { margin: 4px 0 0; font-family: var(--ken-font-body); font-weight: 300; font-size: 24px; line-height: 1.2; color: ${ORANGE}; -webkit-text-stroke: .03em ${ORANGE}; overflow-wrap: anywhere; }
  .QW4K-pc-row dd.QW4K-pc-blank { color: #9A8E7A; -webkit-text-stroke-color: #9A8E7A; }
  .QW4K-pc-row small { display: block; margin-top: 5px; font-family: var(--ken-font-body); font-style: italic; font-size: 12.5px; line-height: 1.3; color: var(--ken-text); }
  .QW4K-pc-foot { grid-area: foot; display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; }
  .QW4K-pc-foot img { height: 22px; width: auto; display: block; flex: none; }
  .QW4K-pc-credit { font-family: var(--ken-font-body); font-style: italic; font-size: 12.5px; line-height: 1.45; color: var(--ken-text); text-align: right; }
  /* Landscape: character on the left, headline and answers on the right */
  @container (min-width: 700px) {
    .QW4K-final { grid-template-columns: 240px minmax(0, 1fr); grid-template-rows: auto 1fr auto; grid-template-areas: "art head" "art grid" "foot foot"; gap: 18px 32px; }
    .QW4K-pc-tag { font-size: 34px; }
    .QW4K-pc-head .QW4K-pc-rule { margin: 12px 0 14px; }
    .QW4K-pc-grid { gap: 18px 28px; }
    .QW4K-pc-row dd { font-size: 23px; }
  }
  /* Phones */
  @container (max-width: 460px) {
    .QW4K-final { gap: 18px 16px; padding: 16px; box-shadow: 6px 6px 0 var(--red); }
    .QW4K-pc-tag { font-size: 22px; }
    .QW4K-pc-rule { width: 44px; margin: 10px 0 10px; }
    .QW4K-pc-grid { gap: 16px 16px; }
    .QW4K-pc-row dt { font-size: 13.5px; }
    .QW4K-pc-row dd { font-size: 17px; }
    .QW4K-pc-row small, .QW4K-pc-credit { font-size: 11px; }
    .QW4K-pc-foot img { height: 17px; }
  }`;
  if (!document.getElementById('QW4K-pc-css')) {
    const st = document.createElement('style'); st.id = 'QW4K-pc-css'; st.textContent = CSS; document.head.appendChild(st);
  }

  const row = (r, cls = '') => {
    const ddc = r.state !== 'set' ? 'QW4K-pc-blank' : '';
    return `<div class="QW4K-pc-row${r.wide ? ' QW4K-wide' : ''}${cls}"><dt>${esc(r.label)}</dt><dd${ddc ? ` class="${ddc}"` : ''}>${esc(shown(r))}</dd>${r.sub ? `<small>${esc(r.sub)}</small>` : ''}</div>`;
  };
  function html(d) {
    const [hero, ...rest] = d.rows;
    return `<div class="QW4K-pc-wrap"><div class="QW4K-final">
      <div class="QW4K-frame">${d.art}<div class="QW4K-cap">${esc(d.cap)}</div></div>
      <div class="QW4K-pc-head"><div class="QW4K-pc-tag">${esc(d.tag)}</div><div class="QW4K-pc-rule"></div>${hero ? `<dl style="margin:0">${row(hero, ' QW4K-pc-hero')}</dl>` : ''}</div>
      <dl class="QW4K-pc-grid">${rest.map(r => row(r)).join('')}</dl>
      <div class="QW4K-pc-foot"><img src="${LOGO}" alt="The Ken"><div class="QW4K-pc-credit">Survey of 301 First Principles readers, September 2026<br>Illustration, not a photo</div></div>
    </div></div>`;
  }

  // ---------- Painting the card onto a canvas ----------
  const loadImg = src => new Promise(res => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = src; });
  const px = v => parseFloat(v) || 0;
  const visible = c => c && c !== 'transparent' && !/rgba\([^)]*,\s*0\)$/.test(c);

  async function draw(d) {
    // Lay out a hidden copy at the width of the card on screen (or a landscape default when it isn't on screen)
    const live = [...document.querySelectorAll('.QW4K-pc-wrap')].find(el => el.offsetWidth > 0 && !el.closest('.QW4K-pc-ghost'));
    const width = live ? live.offsetWidth : 900;
    const PAD = 24, host = document.createElement('div');
    host.className = 'QW4K-pc-ghost';
    host.style.cssText = `position:fixed;left:-100000px;top:0;width:${width + PAD * 2}px;padding:${PAD}px;box-sizing:border-box;pointer-events:none;`;
    host.setAttribute('aria-hidden', 'true');
    host.innerHTML = html(d);
    (live ? live.parentNode : document.body).appendChild(host);
    try {
      const card = host.querySelector('.QW4K-final');
      // The portrait the page shows: the <image> inside the character's <svg> (the reader's own look is drawn in layers instead)
      const pic = !d.you && host.querySelector('.QW4K-frame svg image');
      const [portrait, logo] = await Promise.all([pic ? loadImg(pic.getAttribute('href')) : null, loadImg(LOGO)]);
      await document.fonts.ready;
      const box = host.getBoundingClientRect();
      const s = Math.max(2, 1080 / box.width);
      const cv = document.createElement('canvas');
      cv.width = Math.round(box.width * s); cv.height = Math.round(box.height * s);
      const ctx = cv.getContext('2d');
      ctx.scale(s, s);
      ctx.fillStyle = '#F7F2F2'; ctx.fillRect(0, 0, box.width, box.height);
      const R = el => { const r = el.getBoundingClientRect(); return { x: r.left - box.left, y: r.top - box.top, w: r.width, h: r.height }; };

      async function paintBox(el) {
        const cs = getComputedStyle(el), r = R(el);
        const sh = cs.boxShadow !== 'none' && cs.boxShadow.match(/(rgba?\([^)]*\)|#[0-9a-f]+)\s+(-?[\d.]+)px\s+(-?[\d.]+)px/i);
        if (sh) { ctx.fillStyle = sh[1]; ctx.fillRect(r.x + px(sh[2]), r.y + px(sh[3]), r.w, r.h); }
        if (visible(cs.backgroundColor)) { ctx.fillStyle = cs.backgroundColor; ctx.fillRect(r.x, r.y, r.w, r.h); }
        const bw = px(cs.borderTopWidth);
        if (el.classList.contains('QW4K-frame')) {
          // The character: the panel colour from its <svg>, then the same picture the page shows
          const ix = r.x + bw, iy = r.y + bw, iw = r.w - 2 * bw;
          const svg = el.querySelector('svg'), bg = svg && svg.querySelector('rect'), ask = svg && svg.querySelector('text');
          ctx.fillStyle = (bg && bg.getAttribute('fill')) || '#EAE0DF'; ctx.fillRect(ix, iy, iw, iw);
          ctx.save(); if (ask) ctx.globalAlpha = .28;
          if (d.you && d.age != null) { try { await window.AGE_ART.drawYou(ctx, ix, iy, iw, d.age, d.you, 'joy'); } catch (e) { /* leave the panel plain */ } }
          else if (portrait) ctx.drawImage(portrait, ix, iy, iw, iw);
          ctx.restore();
          if (ask || (!portrait && !d.you)) { ctx.fillStyle = ask ? ask.getAttribute('fill') || '#1A1208' : 'rgba(26,18,8,.35)'; ctx.font = `bold ${iw * .38}px "Jazmin Alt", Georgia, serif`; ctx.textAlign = 'center'; ctx.fillText('?', ix + iw / 2, iy + iw * .59); ctx.textAlign = 'left'; }
        }
        if (el.tagName === 'IMG' && logo) ctx.drawImage(logo, r.x, r.y, r.w, r.h);
        if (bw > 0) { ctx.lineWidth = bw; ctx.strokeStyle = cs.borderTopColor; ctx.strokeRect(r.x + bw / 2, r.y + bw / 2, r.w - bw, r.h - bw); }
      }
      // Each line of text goes exactly where the browser put it: words are grouped into lines by their position
      function paintText(node) {
        const el = node.parentElement, cs = getComputedStyle(el), text = node.data;
        const words = [...text.matchAll(/\S+/g)];
        if (!words.length) return;
        ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        if ('letterSpacing' in ctx) ctx.letterSpacing = cs.letterSpacing === 'normal' ? '0px' : cs.letterSpacing;
        ctx.fillStyle = cs.color; ctx.textBaseline = 'alphabetic';
        const stroke = px(cs.webkitTextStrokeWidth);
        const range = document.createRange(), lines = [];
        words.forEach(m => {
          range.setStart(node, m.index); range.setEnd(node, m.index + m[0].length);
          const rr = range.getClientRects()[0]; if (!rr) return;
          const top = rr.top - box.top, last = lines[lines.length - 1];
          if (last && Math.abs(last.top - top) < 2) last.end = m.index + m[0].length;
          else lines.push({ top, x: rr.left - box.left, start: m.index, end: m.index + m[0].length });
        });
        lines.forEach(l => {
          let str = text.slice(l.start, l.end).replace(/\s+/g, ' ');
          if (cs.textTransform === 'uppercase') str = str.toUpperCase();
          const m = ctx.measureText(str), asc = m.fontBoundingBoxAscent ?? px(cs.fontSize) * .8;
          ctx.fillText(str, l.x, l.top + asc);
          if (stroke) { ctx.lineWidth = stroke; ctx.strokeStyle = cs.webkitTextStrokeColor || cs.color; ctx.lineJoin = 'round'; ctx.strokeText(str, l.x, l.top + asc); }
        });
      }
      async function paint(el) {
        await paintBox(el);
        if (el.tagName.toLowerCase() === 'svg') return;
        for (const n of el.childNodes) {
          if (n.nodeType === 1 && n.tagName.toLowerCase() !== 'svg') await paint(n);
          else if (n.nodeType === 3) paintText(n);
        }
      }
      await paint(card);
      return cv;
    } finally { host.remove(); }
  }
  const blob = async d => { const cv = await draw(d); return new Promise((res, rej) => { try { cv.toBlob(b => b ? res(b) : rej(new Error('empty')), 'image/png'); } catch (e) { rej(e); } }); };

  window.PROFILE_CARD = { html, draw, blob };
})();
