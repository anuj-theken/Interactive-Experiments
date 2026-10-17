// Character kit: stacks layered parts (parts.js) into one character.
// Every part is drawn on the same 1000x1000 canvas, already in position, so parts line up just by stacking.
// Age-driven changes (hair colour, receding hair, lines, glasses) are rules here, not extra drawings.
(function () {
  // Back to front
  const SLOTS = ['hair-back', 'neck', 'top', 'head', 'lines', 'face', 'facial-hair', 'hair-front', 'glasses'];
  // A hairstyle is a front part plus a back part
  const STYLES = {
    short: ['short', 'none'], curly: ['curly', 'none'], bun: ['bun', 'none'], long: ['fringe', 'long'],
    bob: ['fringe', 'shoulder'], receding: ['receding', 'none'], bald: ['bald', 'none'],
  };
  const BGS = ['#CFC9EA', '#FBE59A', '#82B0E6', '#FBB9A8', '#DDEFBB', '#F6BFCD', '#B3CFD1']; // one per decade, from the portraits
  const SKINS = ['#FFFFFF', '#F3D3B5', '#D9A27A', '#B97A4F', '#7E5136'];
  const decadeOf = age => age < 20 ? 0 : Math.min(6, Math.floor(age / 10) - 1);
  const hairColour = age => age < 38 ? '#111111' : age < 48 ? '#4A4542' : age < 58 ? '#8E8984' : age < 68 ? '#C9C5C0' : '#FFFFFF';
  const variants = slot => Object.keys(window.KIT_PARTS || {}).filter(k => k.startsWith(slot + '--')).map(k => k.split('--')[1]);

  function resolve(o = {}) {
    const age = o.age ?? 35;
    let style = o.hair || 'short';
    if (o.ageing !== false && age >= 62 && ['short', 'curly', 'fringe'].includes(style)) style = 'receding';
    const [front, back] = STYLES[style] || STYLES.short;
    return {
      age,
      'hair-back': back, 'hair-front': front, neck: 'default', head: 'default',
      top: o.top || 'tee', face: o.face || 'smile', 'facial-hair': o.facial || 'none',
      lines: o.lines ?? (age >= 55 ? '2' : age >= 40 ? '1' : null),
      glasses: !o.glasses || o.glasses === 'auto' ? (age >= 45 ? 'round' : 'none') : o.glasses,
      colours: { hair: o.hairColour || hairColour(age), skin: o.skin || SKINS[0], top: o.topColour || null },
      bg: o.bg === null ? null : o.bg || BGS[decadeOf(age)],
    };
  }

  // Returns an <svg> string. o: { age, hair, facial, glasses, top, face, skin, bg, only: [slots to include] }
  function compose(o = {}) {
    const r = resolve(o), P = window.KIT_PARTS || {};
    let inner = r.bg ? `<rect width="1000" height="1000" fill="${r.bg}"/>` : '';
    SLOTS.forEach(slot => {
      if (o.only && !o.only.includes(slot)) return;
      const v = r[slot]; if (v == null) return;
      inner += `<g data-slot="${slot}" data-part="${slot}--${v}">${P[slot + '--' + v] || ''}</g>`;
    });
    const doc = new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">${inner}</svg>`, 'image/svg+xml');
    // Shapes named fill-hair*, fill-skin*, fill-top* are recoloured; everything else stays as drawn
    [['fill-hair', r.colours.hair], ['fill-skin', r.colours.skin], ['fill-top', r.colours.top]].forEach(([key, col]) =>
      doc.querySelectorAll(`[id^="${key}"]`).forEach(el => { if (col) el.setAttribute('fill', col); }));
    doc.querySelectorAll('[id]').forEach(el => el.removeAttribute('id')); // ids would clash once several characters share a page
    const svg = doc.documentElement;
    svg.setAttribute('role', 'img');
    if (o.label) svg.setAttribute('aria-label', o.label);
    return svg.outerHTML;
  }

  window.CharacterKit = { compose, resolve, SLOTS, STYLES, SKINS, BGS, variants, hairColour, decadeOf };
})();
