// The age-profile card, shared by the story and the quiz so both end on the same card.
// html(d) draws it on the page; draw(d) paints the same rows into a 1080x1350 image for downloading and sharing.
// d = { tag, cap, age, you, art, rows: [{ label, value, state: 'set'|'skipped'|'empty', sub, wide }] }
//   tag: the headline; cap: label on the character; art: the character's <svg> for the page;
//   age + you: how to draw the character in the image (you = the reader's look, if they picked one).
(function () {
  const BASE = window.AGE_BASE || '';
  const LOGO = BASE + 'assets/logo.png';
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const shown = r => r.state === 'set' ? r.value : r.state === 'skipped' ? 'Skipped' : '—';

  function html(d) {
    const rows = d.rows.map(r => `<div${r.wide ? ' class="QW4K-wide"' : ''}><dt>${r.label}</dt><dd>${r.state === 'set' ? (r.wide ? `<q>${esc(r.value)}</q>` : esc(r.value)) : `<span class="QW4K-pc-blank">${shown(r)}</span>`}${r.sub ? `<small>${r.sub}</small>` : ''}</dd></div>`).join('');
    return `<div class="QW4K-final"><div class="QW4K-frame">${d.art}<div class="QW4K-cap">${esc(d.cap)}</div></div>
      <dl><div class="QW4K-pc-tag">${esc(d.tag)}</div>${rows}</dl>
      <img src="${LOGO}" alt="The Ken" class="QW4K-final-logo"></div>`;
  }

  const loadImg = src => new Promise(res => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = src; });
  function wrapText(ctx, text, x, y, maxW, lineH, maxLines = 9) {
    const words = String(text).split(' '); let line = '', n = 0;
    for (let i = 0; i < words.length; i++) {
      const test = line ? line + ' ' + words[i] : words[i];
      if (ctx.measureText(test).width > maxW && line) {
        if (n === maxLines - 1) { while (ctx.measureText(line + '…').width > maxW && line.length) line = line.slice(0, -1); ctx.fillText(line + '…', x, y + n * lineH); return n + 1; }
        ctx.fillText(line, x, y + n * lineH); n++; line = words[i];
      } else line = test;
    }
    ctx.fillText(line, x, y + n * lineH); return n + 1;
  }
  const fitFont = (ctx, text, family, size, maxW) => { for (; size > 16; size -= 2) { ctx.font = `${size}px ${family}`; if (ctx.measureText(text).width <= maxW) break; } return size; };

  async function draw(d) {
    const cv = document.createElement('canvas'); cv.width = 1080; cv.height = 1350;
    const ctx = cv.getContext('2d'), INKC = '#1A1208', REDC = '#C8423A', MUTED = '#6B5B57';
    const BODY = '"GT America", Arial, sans-serif', DISP = '"Jazmin Alt", Georgia, serif', BOLD = '"GT America Bold", Arial, sans-serif';
    const letter = v => { if ('letterSpacing' in ctx) ctx.letterSpacing = v; };
    const [portrait, logo] = await Promise.all([!d.you && d.age != null ? loadImg(window.AGE_ART.portraitSrc(d.age)) : null, loadImg(LOGO)]);
    await document.fonts.ready;
    ctx.fillStyle = '#F7F2F2'; ctx.fillRect(0, 0, 1080, 1350);
    ctx.fillStyle = REDC; ctx.fillRect(58, 58, 986, 1256);
    ctx.fillStyle = '#fff'; ctx.fillRect(36, 36, 986, 1256);
    ctx.lineWidth = 6; ctx.strokeStyle = INKC; ctx.strokeRect(36, 36, 986, 1256);
    const X = 84, R = 974, W = R - X;
    ctx.font = `24px ${BOLD}`; letter('3px');
    ctx.fillStyle = REDC; ctx.fillText('FIRST PRINCIPLES', X, 104);
    ctx.fillStyle = MUTED; ctx.textAlign = 'right'; ctx.fillText('THE AGE FACTOR · MY PROFILE', R, 104); ctx.textAlign = 'left'; letter('0px');
    // Character and headline
    const PY = 136, PS = 280;
    ctx.fillStyle = '#EAE0DF'; ctx.fillRect(X, PY, PS, PS);
    if (d.you && d.age != null) { try { await window.AGE_ART.drawYou(ctx, X, PY, PS, d.age, d.you, 'joy'); } catch (e) { /* leave the panel plain */ } }
    else if (portrait) ctx.drawImage(portrait, X, PY, PS, PS);
    else { ctx.fillStyle = 'rgba(26,18,8,.35)'; ctx.font = `160px ${DISP}`; ctx.textAlign = 'center'; ctx.fillText('?', X + PS / 2, PY + PS / 2 + 54); ctx.textAlign = 'left'; }
    ctx.lineWidth = 5; ctx.strokeStyle = INKC; ctx.strokeRect(X, PY, PS, PS);
    ctx.font = `20px ${BOLD}`; letter('2px'); const cap = d.cap.toUpperCase(), cw = ctx.measureText(cap).width + 24;
    ctx.fillStyle = INKC; ctx.fillRect(X, PY, cw, 40); ctx.fillStyle = '#fff'; ctx.fillText(cap, X + 12, PY + 28); letter('0px');
    ctx.fillStyle = INKC; ctx.font = `62px ${DISP}`; wrapText(ctx, d.tag, X + PS + 40, PY + 70, R - X - PS - 40, 66, 3);
    // Rows: short answers two to a line, written answers across the card
    let y = PY + PS + 64, col = 0, extra = 0; const half = (W - 40) / 2;
    d.rows.forEach(r => {
      if (r.wide) {
        if (col) { y += 140 + extra; col = 0; extra = 0; }
        ctx.strokeStyle = INKC; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(X, y); ctx.lineTo(R, y); ctx.stroke();
        ctx.fillStyle = MUTED; ctx.font = `20px ${BOLD}`; letter('2px'); ctx.fillText(r.label.toUpperCase(), X, y + 36); letter('0px');
        ctx.fillStyle = r.state === 'set' ? INKC : MUTED; ctx.font = `italic 30px ${BODY}`;
        const n = wrapText(ctx, r.state === 'set' ? `“${r.value}”` : shown(r), X, y + 78, W, 38, 3);
        y += 78 + n * 38 + 18; return;
      }
      const x = X + col * (half + 40);
      ctx.strokeStyle = INKC; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + half, y); ctx.stroke();
      ctx.fillStyle = MUTED; letter('2px'); fitFont(ctx, r.label.toUpperCase(), BOLD, 20, half); ctx.fillText(r.label.toUpperCase(), x, y + 36); letter('0px');
      ctx.fillStyle = r.state === 'set' ? REDC : MUTED; ctx.font = `44px ${DISP}`;
      let lines = 1;
      if (ctx.measureText(shown(r)).width <= half) ctx.fillText(shown(r), x, y + 86);
      else { ctx.font = `32px ${DISP}`; lines = wrapText(ctx, shown(r), x, y + 80, half, 36, 2); }
      if (r.sub) { ctx.fillStyle = INKC; ctx.font = `24px ${BODY}`; ctx.fillText(r.sub, x, y + 120 + (lines - 1) * 30); }
      extra = Math.max(extra, (lines - 1) * 30);
      if (col) { y += 140 + extra; col = 0; extra = 0; } else col = 1;
    });
    // Bottom: Ken logo on the left, the survey on the right
    if (logo) { const lh = 40, lw = logo.width * lh / logo.height; ctx.drawImage(logo, X, 1226, lw, lh); }
    ctx.fillStyle = MUTED; ctx.font = `italic 20px ${BODY}`; ctx.textAlign = 'right';
    ctx.fillText('Survey of 301 First Principles readers, September 2026', R, 1240); ctx.fillText('Illustration, not a photo', R, 1268); ctx.textAlign = 'left';
    return cv;
  }
  const blob = async d => { const cv = await draw(d); return new Promise((res, rej) => { try { cv.toBlob(b => b ? res(b) : rej(new Error('empty')), 'image/png'); } catch (e) { rej(e); } }); };

  window.PROFILE_CARD = { html, draw, blob };
})();
