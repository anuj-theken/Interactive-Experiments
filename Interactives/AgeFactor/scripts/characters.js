// Flat SVG characters for the Age Factor story. Everything is drawn in a 200×200 square.
// Character(age, opts) returns an <svg> string showing a generated character for that age; Scene(name, opts) adds props on top.
// figure() is the older flat drawing, kept for reference.
(function () {
  const INK = '#1A1208';
  const BGS = ['#F2D7C9', '#E7D3C1', '#E9CFCB', '#D9DCCB', '#D3DDD9', '#E3DACB', '#E6DDE3'];
  const SHIRTS = ['#4A9E9A', '#C8423A', '#4A7A5A', '#3D3D3D', '#7A9E4A', '#A89880', '#4A7A5A'];
  const SKINS = (window.FP_CHARS && window.FP_CHARS.skins) || ['#C98E62', '#B97A4F', '#D9A27A']; // lightest to deepest

  function hairColor(age) {
    if (age < 38) return '#24170F';
    if (age < 48) return '#4B4039';
    if (age < 58) return '#8A827B';
    if (age < 68) return '#BDB7B0';
    return '#ECE8E2';
  }
  const decadeOf = age => age < 20 ? 0 : Math.min(6, Math.floor(age / 10) - 1);

  // Figure only (no background), centred at x=100, head at y≈96
  function figure(age, o = {}) {
    const hair = o.hair || 'short', mood = o.mood || 'smile';
    const skin = o.skin || SKINS[0], shirt = o.shirt || SHIRTS[decadeOf(age)];
    const hc = hairColor(age), old = age >= 55, teen = age < 20;
    const shade = 'rgba(26,18,8,0.12)';
    let s = '';
    // long hair sits behind the head
    if (hair === 'long') {
      s += age >= 60
        ? `<circle cx="100" cy="52" r="15" fill="${hc}"/>`
        : `<path d="M62 98 C58 58 80 44 100 44 C122 44 142 58 138 98 L142 156 C122 164 78 164 58 156 Z" fill="${hc}"/>`;
    }
    // body + neck
    s += `<path d="M26 200 C28 160 60 144 100 144 C140 144 172 160 174 200 Z" fill="${shirt}"/>`;
    s += `<path d="M84 145 L100 166 L116 145" fill="none" stroke="${shade}" stroke-width="4" stroke-linejoin="round"/>`;
    s += `<rect x="88" y="116" width="24" height="34" rx="10" fill="${skin}"/>`;
    s += `<rect x="88" y="128" width="24" height="8" fill="${shade}"/>`;
    // ears + head
    s += `<ellipse cx="69" cy="100" rx="6" ry="9" fill="${skin}"/><ellipse cx="131" cy="100" rx="6" ry="9" fill="${skin}"/>`;
    s += `<ellipse cx="100" cy="96" rx="${teen ? 29 : 31}" ry="${teen ? 34 : 36}" fill="${skin}"/>`;
    // hair front
    if (hair === 'long') {
      s += `<path d="M68 98 C62 58 84 48 102 48 C124 48 140 62 132 98 C124 74 106 66 92 70 C80 74 72 84 68 98 Z" fill="${hc}"/>`;
    } else if (age >= 62) {
      s += `<path d="M69 96 C67 76 74 66 82 66 C78 74 75 84 74 98 Z M131 96 C133 76 126 66 118 66 C122 74 125 84 126 98 Z" fill="${hc}"/>`;
    } else if (old) {
      s += `<path d="M69 94 C64 62 84 52 100 54 C118 52 136 62 131 94 C127 80 122 72 116 70 C110 64 92 64 84 70 C78 72 72 80 69 94 Z" fill="${hc}"/>`;
    } else {
      s += `<path d="M68 92 C62 58 82 46 102 48 C126 48 140 62 132 92 C126 76 114 68 100 72 C86 68 74 76 68 92 Z" fill="${hc}"/>`;
    }
    // brows
    const browY = mood === 'worried' ? 82 : 84;
    s += `<path d="M82 ${browY + (mood === 'worried' ? 2 : 0)} L94 ${browY}" stroke="${age >= 58 ? '#9C948C' : INK}" stroke-width="3" stroke-linecap="round"/>`;
    s += `<path d="M106 ${browY} L118 ${browY + (mood === 'worried' ? 2 : 0)}" stroke="${age >= 58 ? '#9C948C' : INK}" stroke-width="3" stroke-linecap="round"/>`;
    // eyes
    if (mood === 'tired') s += `<path d="M84 97 L92 97 M108 97 L116 97" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
    else if (mood === 'joy') s += `<path d="M84 98 Q88 92 92 98 M108 98 Q112 92 116 98" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
    else s += `<circle cx="88" cy="97" r="3.4" fill="${INK}"/><circle cx="112" cy="97" r="3.4" fill="${INK}"/>`;
    // glasses after 45
    if (age >= 45) s += `<g fill="none" stroke="${INK}" stroke-width="2.4"><circle cx="88" cy="97" r="9"/><circle cx="112" cy="97" r="9"/><path d="M97 96 L103 96"/></g>`;
    // nose
    s += `<path d="M100 101 Q97 108 101 110" fill="none" stroke="${shade}" stroke-width="2.5" stroke-linecap="round"/>`;
    // mouth
    const mouths = {
      smile: `<path d="M90 117 Q100 125 110 117" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`,
      joy: `<path d="M88 115 Q100 130 112 115 Z" fill="${INK}"/><path d="M92 117 Q100 121 108 117" fill="#fff"/>`,
      neutral: `<path d="M92 118 L108 118" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`,
      worried: `<path d="M91 121 Q100 114 109 121" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`,
      tired: `<path d="M92 119 Q100 116 108 119" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`,
      o: `<ellipse cx="100" cy="119" rx="5" ry="6" fill="${INK}"/>`
    };
    s += mouths[mood] || mouths.smile;
    // cheeks + lines of age
    s += `<circle cx="80" cy="110" r="5" fill="#C8423A" opacity=".16"/><circle cx="120" cy="110" r="5" fill="#C8423A" opacity=".16"/>`;
    if (age >= 40) s += `<path d="M84 112 Q82 118 86 122 M116 112 Q118 118 114 122" fill="none" stroke="${shade}" stroke-width="2" stroke-linecap="round"/>`;
    if (age >= 50) s += `<path d="M88 72 Q100 69 112 72 M90 77 Q100 75 110 77" fill="none" stroke="${shade}" stroke-width="2" stroke-linecap="round"/>`;
    return s;
  }

  const wrap = (inner, bg, label) =>
    `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img"${label ? ` aria-label="${label}"` : ''}><rect x="-100" y="-100" width="400" height="400" fill="${bg}"/>${inner}</svg>`;

  // Generated characters: character-kit/build_fp.py layers the FP survey parts into scripts/fp-characters.js.
  // Each decade has ten, half female-presenting. o.hair ('long'|'short'), o.mood and o.skin pick the closest match;
  // o.avoid skips ids; o.pick takes the nth equal match; o.id picks one exactly (the fixed "anchor" reader too).
  const FP = window.FP_CHARS || { dir: '', skins: SKINS, chars: [] };
  const PORTRAIT_DIR = FP.dir + 'web/', CUT_DIR = FP.dir + 'cut/', LAYER_DIR = FP.dir + 'layers/';
  const STORY = FP.chars.filter(c => !c.fixed);
  const BY_DECADE = [0, 1, 2, 3, 4, 5, 6].map(d => STORY.filter(c => c.decade === d));
  const MOODS = { joy: ['joy'], smile: ['smile', 'joy'], neutral: ['neutral', 'smile'], worried: ['worried', 'neutral'], tired: ['worried', 'neutral'] };
  function pick(age, o = {}) {
    if (o.id) { const c = FP.chars.find(c => c.id === o.id); if (c) return c; }
    const list = BY_DECADE[decadeOf(age)], avoid = o.avoid || [], skin = FP.skins.indexOf(o.skin);
    const score = c => (o.hair && c.hair === o.hair ? 4 : 0) + (o.mood && (MOODS[o.mood] || [o.mood]).includes(c.mood) ? 2 : 0) + (skin >= 0 && c.skin === skin ? 1 : 0) - (avoid.includes(c.id) ? 10 : 0);
    const ranked = list.map((c, i) => [c, score(c), i]).sort((a, b) => b[1] - a[1] || a[2] - b[2]);
    const best = ranked.filter(r => r[1] === ranked[0][1]);
    return best[(o.pick || 0) % best.length][0];
  }
  const portraitId = (age, o = {}) => pick(age, o).id;
  const portraitSrcOf = (age, o = {}) => `${PORTRAIT_DIR}${portraitId(age, o)}.png`;

  // The reader's own character, stacked from pre-coloured layers so any combination works.
  // o.you = { length: 'long'|'short', curl: 'straight'|'curly', facial: null|'moustache'|'beard1'|'beard2'|'beard3', skin: 0-5 }
  // Readers pick only length and curl; age picks the hairstyle (long straight hair goes braid, loose, waves, bob, bun;
  // short hair thins to balding). Hair and beards grey with age, specs arrive in the 50s, and teens get the big eyes.
  const HAIR_LENGTHS = [['long', 'Long'], ['short', 'Short']];
  const HAIR_TYPES = [['straight', 'Straight'], ['curly', 'Curly']];
  const FACIAL = [[null, 'None'], ['moustache', 'Moustache'], ['beard3', 'Goatee'], ['beard2', 'Chin strap'], ['beard1', 'Full beard']];
  // Hair part per decade (Teens..70s+). Parts: 1-2 long waves, 3 braid, 4 bun, 5 curls, 6 bob, 7 short curls, 8 short, 9 quiff, 10 balding, 0 bald
  const HAIR_BY_AGE = {
    'long-straight': [3, 2, 1, 6, 6, 4, 4], 'long-curly': [5, 5, 5, 5, 5, 7, 7],
    'short-straight': [9, 9, 8, 8, 10, 10, 0], 'short-curly': [7, 7, 7, 7, 7, 10, 10],
  };
  const hairTone = age => age < 38 ? 0 : age < 48 ? 1 : age < 58 ? 2 : age < 68 ? 3 : 4;
  const YOU_FACE = { smile: 4, neutral: 4, joy: 5, worried: 8, tired: 8 };
  function youLayers(age, you, mood) {
    const d = decadeOf(age), tone = hairTone(age);
    const style = (HAIR_BY_AGE[`${you.length || 'short'}-${you.curl || 'straight'}`] || HAIR_BY_AGE['short-straight'])[d];
    const face = d === 0 ? 1 : YOU_FACE[mood] || 4;
    const L = [`base-${you.skin ?? 2}`, 'shirt-3', `face-${face}`];
    if (d >= 4 && face !== 1) L.push('specs-2');
    if (style) L.push(`hair-${style}-${tone}`);
    if (you.facial && d >= 1) L.push(`beard-${you.facial}-${tone}`); // over the hair, so long hair never hides it
    return L.map(n => `${LAYER_DIR}${n}.png`);
  }
  const youLooksFem = you => !you.facial && you.length === 'long';
  // Layers are 500px copies of the 1000px canvas; the portrait shows the square from (80,40) to (940,900), the chart cut-out (215,70)-(805,660)
  const youInner = (age, o) => `<g transform="translate(-18.6 -9.3) scale(.232558)">${youLayers(age, o.you, o.mood).map(h => `<image href="${h}" width="1000" height="1000"/>`).join('')}</g>`;
  const portrait = (age, o = {}) => o.you ? youInner(age, o) : `<image href="${portraitSrcOf(age, o)}" width="200" height="200" preserveAspectRatio="xMidYMid slice"/>`;
  const portraitSrc = (age, o = {}) => portraitSrcOf(age, o);

  const IMG = {};
  const loadLayer = src => IMG[src] || (IMG[src] = new Promise((ok, no) => { const im = new Image(); im.onload = () => ok(im); im.onerror = no; im.src = src; }));
  // Draws the reader's character into a canvas square (for the share card)
  async function drawYou(ctx, x, y, size, age, you, mood) {
    const ims = await Promise.all(youLayers(age, you, mood).map(loadLayer));
    ims.forEach(im => ctx.drawImage(im, 40, 20, 430, 430, x, y, size, size));
  }
  // A small cut-out of the reader's character for their chart square. Built once per look on a canvas; null until ready,
  // and null for good where the browser won't export the canvas (pages opened straight from disk)
  const CUTS = {};
  function youCut(age, you, onReady) {
    const key = youLayers(age, you, 'smile').join('|');
    if (key in CUTS) return CUTS[key];
    CUTS[key] = null;
    Promise.all(youLayers(age, you, 'smile').map(loadLayer)).then(ims => {
      const cv = document.createElement('canvas'); cv.width = cv.height = 128;
      const c = cv.getContext('2d'); ims.forEach(im => c.drawImage(im, 107.5, 35, 295, 295, 0, 0, 128, 128));
      try { CUTS[key] = cv.toDataURL('image/png'); if (onReady) onReady(); } catch (e) { /* tainted canvas: keep the plain square */ }
    }).catch(() => {});
    return null;
  }

  function Character(age, o = {}) {
    let inner = portrait(age, o);
    if (o.question) inner = `<g opacity=".28">${inner}</g><text x="100" y="118" text-anchor="middle" font-family="Jazmin Alt, Georgia, serif" font-weight="bold" font-size="76" fill="${INK}">?</text>`;
    return wrap(inner, o.bg || BGS[decadeOf(age)], o.label);
  }

  function bubble(x, y, w, h, text, tailX, tailY, size = 15) {
    return `<g><path d="M${x + 8} ${y} H${x + w - 8} Q${x + w} ${y} ${x + w} ${y + 8} V${y + h - 8} Q${x + w} ${y + h} ${x + w - 8} ${y + h} H${tailX + 10} L${tailX} ${tailY} L${tailX - 2} ${y + h} H${x + 8} Q${x} ${y + h} ${x} ${y + h - 8} V${y + 8} Q${x} ${y} ${x + 8} ${y} Z" fill="#fff" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
      <text x="${x + w / 2}" y="${y + h / 2 + size * 0.36}" text-anchor="middle" font-family="GT America Bold, Arial, sans-serif" font-weight="bold" font-size="${size}" fill="${INK}">${text}</text></g>`;
  }

  function Scene(name, o = {}) {
    const age = o.age || 40;
    if (name === 'uncle') {
      const word = (o.you ? youLooksFem(o.you) : pick(age, o).hair === 'long') ? 'Hi aunty!' : 'Hi uncle!';
      return wrap(portrait(age, o) + bubble(118, 10, 76, 34, word, 186, 62, 13), '#E9CFCB', 'Someone calls the character uncle');
    }
    if (name === 'pill') {
      const clock = `<g transform="translate(30 32)"><circle r="20" fill="#fff" stroke="${INK}" stroke-width="3"/><path d="M0 0 V-15 M0 0 L10 6" stroke="#C8423A" stroke-width="3.5" stroke-linecap="round"/><circle r="2.5" fill="${INK}"/></g>`;
      const pill = `<g transform="translate(164 172) rotate(-35)"><rect x="-26" y="-11" width="52" height="22" rx="11" fill="#fff" stroke="${INK}" stroke-width="2.5"/><path d="M0 -11 H15 A11 11 0 0 1 15 11 H0 Z" fill="#C8423A" stroke="${INK}" stroke-width="2.5"/></g>`;
      return wrap(portrait(age, o) + clock + pill, '#D3DDD9', 'The character next to an anti-ageing pill');
    }
    if (name === 'crowd') {
      let s = '';
      [[24, 34, 1.0], [78, 30, 3.2], [132, 36, 5.0], [0, 96, 2.0], [52, 100, 4.0], [104, 98, 6.0], [156, 104, 0.4]].forEach(([x, y, d], i) => {
        const a = Math.round(d * 10 + 18);
        s += `<g transform="translate(${x - 12} ${y}) scale(.42)">${figure(a, { hair: i % 3 === 1 ? 'long' : 'short', mood: i % 2 ? 'smile' : 'joy', skin: SKINS[i % 3] })}</g>`;
      });
      return wrap(s, '#E7D3C1', 'A crowd of readers of different ages');
    }
    if (name === 'decade') {
      const icons = { freedom: '✈', family: '♥', money: '₹', work: '⚒', health: '✚', learning: '✎' };
      let s = portrait(age, o);
      const on = o.on || []; // keys of icons the reader picked: drawn bigger and filled red
      Object.entries(icons).forEach(([k, ic], i) => {
        const ang = -Math.PI * (0.1 + i * 0.16), x = 100 + Math.cos(ang) * 82, y = 104 + Math.sin(ang) * 82, hot = on.includes(k);
        s += `<g transform="translate(${x} ${y}) scale(${hot ? 1.25 : on.length ? .85 : 1})" opacity="${on.length && !hot ? .55 : 1}"><circle r="15" fill="${hot ? '#C8423A' : '#fff'}" stroke="${INK}" stroke-width="2.2"/><text y="6" text-anchor="middle" font-size="16" fill="${hot ? '#fff' : '#C8423A'}" font-family="Arial">${ic}</text></g>`;
      });
      return wrap(s, '#F2D7C9', 'The character surrounded by things that make a decade good');
    }
    return Character(age, o);
  }

  // Transparent head-and-shoulders cut-outs of the same characters, for chart marks
  const cutSrc = id => `${CUT_DIR}${id}.png`;
  // A stable, varied cut-out for mark i: drawn from the reader's decade when known, otherwise from all of them
  const cutFor = (i, dec) => { const list = dec >= 0 ? BY_DECADE[dec] : STORY; return cutSrc(list[(i * 7 + (i >> 3)) % list.length].id); };

  window.AGE_ART = { Character, Scene, figure, decadeOf, SKINS, portraitId, portraitSrc, PORTRAIT_DIR, cutFor, cutSrc, HAIR_LENGTHS, HAIR_TYPES, FACIAL, youLayers, drawYou, youCut };
})();
