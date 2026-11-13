// How India makes chai · page logic.
// Below the header the page becomes one pinned specimen sheet. The story runs on a cooking clock — 0:00 cold pan,
// 0:45 heating, 2:00 the boil, 3:30 heat off, 5:00 in the cup. Each scene is a grid layout (written like CSS
// grid-template-areas): its rules draw themselves in and its cells are re-inked with new content. Your pan sits in the
// top-left cell the whole way, the questions sit around it, and the charts live in the grid boxes.
(function () {
  const C = window.CHAICORE, L = C.L, ICON = window.ICON, A = window.CHAIART;
  const $ = id => document.getElementById(id);
  const esc = C.esc;
  gsap.registerPlugin(ScrollTrigger);

  // ---------- Readers ----------
  const RS = window.CHAI.map(C.fromReader);
  RS.forEach((r, i) => { r.i = i; r.shade = C.shade(r); r.fam = C.family(r); r.f = C.formula(r); });
  const N = RS.length;
  const cnt = f => RS.filter(f).length;
  const pct = k => Math.round(100 * k / N);
  const byId = p => RS.find(r => r.id.startsWith(p));

  // ---------- Stats used in the text (computed, so they follow the data as it grows) ----------
  const S = { n: N };
  S.milk = [0, 1, 2, 3, 4, 5].map(k => cnt(r => r.milk === k));
  S.mostlyWater = S.milk[0] + S.milk[1] + S.milk[2];
  S.toned = cnt(r => r.milkType === 'toned' || r.milkType === 'skim');
  S.full = cnt(r => r.milkType === 'full');
  S.milkStart = cnt(r => r.milk > 0 && r.st.milk === 0);
  S.milkBoil = cnt(r => r.milk > 0 && r.st.milk === 2);
  S.cups2 = cnt(r => r.cups === 2); S.cups1 = cnt(r => r.cups === 1); S.cups3p = cnt(r => r.cups >= 3);
  S.ctc = cnt(r => r.teas.includes('ctc'));
  S.teaBoil = cnt(r => r.st.tea === 2); S.teaStart = cnt(r => r.st.tea === 0); S.teaOff = cnt(r => r.st.tea === 3);
  S.leafCell = {}; RS.forEach(r => { if (r.amt != null && r.brew != null) { const k = r.amt + '-' + r.brew; S.leafCell[k] = (S.leafCell[k] || 0) + 1; } });
  S.topCell = Object.entries(S.leafCell).sort((a, b) => b[1] - a[1])[0];
  S.kadak = cnt(r => (r.amt === 3 || r.amt === 4) && (r.brew === 3 || r.brew === 4));
  S.quick = cnt(r => r.brew === 0);
  S.quickSteep = cnt(r => r.brew === 0 && r.st.tea >= 3);
  S.longBrew = cnt(r => r.brew === 3 || r.brew === 4);
  S.eyeball = cnt(r => r.amt === 5); S.colour = cnt(r => r.brew === 5);
  S.noSugar = cnt(r => r.sweet === 'none'); S.sugar = cnt(r => (r.sweet || '').startsWith('sugar')); S.jaggery = cnt(r => r.sweet === 'jaggery'); S.honey = cnt(r => r.sweet === 'honey'); S.free = cnt(r => r.sweet === 'free');
  S.sweetCup = cnt(r => r.st.sweet === 4 && r.sweet !== 'none'); S.sweetPan = cnt(r => r.sweet && r.sweet !== 'none' && r.st.sweet != null && r.st.sweet < 4);
  S.vessel = {}; ['glass', 'cup', 'mug', 'tumbler'].forEach(v => S.vessel[v] = cnt(r => r.vessel === v));
  S.sp = {}; C.SPICES.forEach(s => S.sp[s] = cnt(r => r.extras.includes(s)));
  S.spiceList = C.SPICES.filter(s => S.sp[s] > 0).sort((a, b) => S.sp[b] - S.sp[a]);
  S.plain = cnt(r => r.extras.length === 0);
  S.spStage = [0, 0, 0, 0, 0]; RS.forEach(r => r.extras.forEach(s => { if (r.st[s] != null) S.spStage[r.st[s]]++; }));
  S.spUses = S.spStage.reduce((a, b) => a + b, 0);
  const formCount = (s, f) => cnt(r => r.forms[s] === f);
  S.gCrushed = formCount('ginger', 'crushed'); S.gGrated = formCount('ginger', 'grated'); S.cCrushed = formCount('cardamom', 'crushed');
  S.cardOff = cnt(r => r.extras.includes('cardamom') && r.st.cardamom === 3);
  S.spiced = cnt(r => r.extras.length >= 2); S.sepTimed = cnt(r => new Set(r.extras.map(s => r.st[s]).filter(x => x != null)).size > 1);
  S.common = cnt(r => r.st.tea === 2 && r.st.milk === 2);
  S.milkFirst = cnt(r => r.milk > 0 && r.st.milk != null && r.st.milk < r.st.tea);
  S.teaFirst = cnt(r => r.milk > 0 && r.st.milk != null && r.st.tea < r.st.milk);
  S.together = cnt(r => r.milk > 0 && r.st.milk != null && r.st.milk === r.st.tea);
  S.boil = [0, 1, 2, 3, 4].map(k => cnt(r => r.milk > 0 && r.boils === k));
  S.multi = S.boil[3] + S.boil[4];
  S.milkCup = cnt(r => r.st.milk === 4);
  const sig = r => r.f.head + '|' + r.f.seq;
  const sigs = {}; RS.forEach(r => sigs[sig(r)] = (sigs[sig(r)] || 0) + 1);
  S.uniqueSeq = RS.filter(r => sigs[sig(r)] === 1).length;
  S.fam = {}; Object.keys(C.FAM).forEach(k => S.fam[k] = cnt(r => r.fam === k));
  document.querySelectorAll('[data-n]').forEach(el => { const v = S[el.dataset.n]; if (v != null) el.textContent = v; });

  // ---------- You ----------
  const ME = { name: null, vessel: null, water: false, milkOn: false, milkShare: null, milkType: null, milkIn: null, teas: [], amt: null, teaIn: null, sweet: null, sugarAmt: 'sugar2', sweetIn: null, brew: null, extras: [], forms: {}, spiceSt: {}, boils: null, touched: {} };
  function meR() {
    const milk = ME.milkOn ? (ME.milkShare != null ? ME.milkShare : (ME.water ? 3 : 5)) : (ME.water ? 0 : null);
    const sweet = ME.sweet ? (ME.sweet === 'sugar' ? ME.sugarAmt : ME.sweet) : (ME.touched.sweet ? 'none' : null);
    const st = { milk: ME.milkOn ? ME.milkIn : null, tea: ME.teas.length ? ME.teaIn : null, sweet: ME.sweet ? ME.sweetIn : null };
    ME.extras.forEach(s => st[s] = ME.spiceSt[s] == null ? null : ME.spiceSt[s]);
    return { name: ME.name || 'Chai', vessel: ME.vessel, milk, milkType: ME.milkOn ? ME.milkType : null, teas: ME.teas.slice(), amt: ME.amt != null ? ME.amt : (ME.teas.includes('bag') ? 6 : null),
      sweet, extras: ME.extras.slice(), forms: { ...ME.forms }, st, boils: ME.milkOn ? ME.boils : null, brew: ME.brew, you: true };
  }
  const meEmpty = () => !ME.water && !ME.milkOn && !ME.teas.length && !ME.extras.length && !ME.sweet;

  const LAB = { water: 'Water', milk: 'Milk', ctc: 'CTC', leaf: 'Loose leaf', dust: 'Tea dust', bag: 'Tea bag', darjeeling: 'Darjeeling', assam: 'Assam', green: 'Green tea',
    sugar: 'Sugar', jaggery: 'Jaggery', honey: 'Honey', free: 'Sugar-free', ginger: 'Ginger', cardamom: 'Cardamom', clove: 'Clove', cinnamon: 'Cinnamon', pepper: 'Black pepper', tulsi: 'Tulsi', mint: 'Mint', masala: 'Chai masala', lemongrass: 'Lemongrass', saunf: 'Saunf', saffron: 'Saffron', lemon: 'Lemon' };
  const TEAS = ['ctc', 'leaf', 'dust', 'bag', 'darjeeling', 'assam', 'green'];
  const SWEETS = ['sugar', 'jaggery', 'honey', 'free'];
  const SPICE_SHELF = ['ginger', 'cardamom', 'clove', 'cinnamon', 'pepper', 'tulsi', 'mint', 'masala', 'lemongrass', 'saunf', 'saffron', 'lemon'];
  const FORMS = { ginger: ['crushed', 'grated', 'sliced', 'whole', 'powder'], cardamom: ['crushed', 'whole', 'powder', 'seeds'], clove: ['whole', 'crushed', 'powder'], cinnamon: ['whole', 'crushed', 'powder'], pepper: ['crushed', 'whole', 'powder'], tulsi: ['fresh', 'dried', 'crushed'], mint: ['fresh', 'dried'], masala: ['packaged', 'powder'], lemongrass: ['fresh', 'dried'], saunf: ['whole', 'roasted', 'crushed'], saffron: ['whole'], lemon: ['fresh'] };
  const inPot = k => k === 'water' ? ME.water : k === 'milk' ? ME.milkOn : TEAS.includes(k) ? ME.teas.includes(k) : SWEETS.includes(k) ? ME.sweet === k : ME.extras.includes(k);
  const countFor = k => k === 'water' ? cnt(r => r.milk < 5) : k === 'milk' ? cnt(r => r.milk > 0) : TEAS.includes(k) ? cnt(r => r.teas.includes(k)) : k === 'sugar' ? S.sugar : SWEETS.includes(k) ? cnt(r => r.sweet === k) : S.sp[k] || 0;

  // Adding something in a chapter assumes it goes in at that chapter's moment; the notebook lets you change it.
  function toggle(k) {
    if (k === 'water') { ME.water = !ME.water; if (ME.milkOn) { if (!ME.water) ME.milkShare = 5; else if (ME.milkShare === 5) ME.milkShare = 3; } }
    else if (k === 'milk') { ME.milkOn = !ME.milkOn; if (ME.milkOn && ME.milkShare == null) ME.milkShare = ME.water ? 3 : 5; }
    else if (TEAS.includes(k)) { const i = ME.teas.indexOf(k); if (i >= 0) ME.teas.splice(i, 1); else { ME.teas.push(k); if (ME.teaIn == null) ME.teaIn = NOW_T <= 3 ? Math.max(NOW_T, 0) : 2; } }
    else if (SWEETS.includes(k)) { ME.touched.sweet = true; ME.sweet = ME.sweet === k ? null : k; }
    else { ME.touched.larder = true; const i = ME.extras.indexOf(k); if (i >= 0) { ME.extras.splice(i, 1); delete ME.forms[k]; delete ME.spiceSt[k]; } else { ME.extras.push(k); ME.forms[k] = FORMS[k][0]; ME.spiceSt[k] = Math.min(3, Math.max(0, NOW_T)); } }
  }

  // ---------- Charts (each lives in a grid box) ----------
  const FONT = 'Archivo, Arial, sans-serif', FELL = "'IM Fell English', Georgia, serif";
  const INK = '#241A11', TXT = '#5A4A38', RED = '#A8321F', GRID = '#CDBFA6';
  const GLASS = 'path://M0,0L20,0L16.5,26L3.5,26Z';
  const VSYM = { glass: GLASS, mug: 'path://M0,2L17,2L17,26L0,26Z M17,7C25,7 25,20 17,20L17,17C21,17 21,10 17,10Z', cup: 'path://M2,4L24,4C24,16 19,22 13,22C7,22 2,16 2,4Z M0,23L26,23L26,25.5L0,25.5Z', tumbler: 'path://M5,0L19,0L18,18L6,18Z M0,18L24,18C23,25 1,25 0,18Z', other: GLASS };
  const TT = { backgroundColor: '#F6F0E2', borderColor: '#8D7B62', borderWidth: 1, padding: [10, 12], textStyle: { fontFamily: FONT, fontSize: 12.5, color: '#3A2C1F' }, extraCssText: 'border-radius:2px;box-shadow:0 4px 18px rgba(40,25,10,.18);width:240px;white-space:normal;line-height:1.45;' };
  const smallVessel = (R, w = 38, h = 44) => A.vessel(R, { still: true, emptyLabel: false }).replace('<svg class="vessel"', `<svg class="vessel" width="${w}" height="${h}"`);
  function ttReader(R) {
    if (R.you) return `<div style="font-family:${FELL};font-size:16px;color:${RED}">You</div>${A.strip(R, { you: true })}`;
    const rr = R.reader;
    return `<div style="display:flex;gap:8px;align-items:flex-end">${smallVessel(R)}<div><div style="font-family:${FELL};font-size:16px;color:${INK};line-height:1.1">${esc(R.name)}</div><div style="color:${TXT};font-size:11.5px">${[rr.age, rr.town].filter(Boolean).map(esc).join(' · ') || 'A reader'}</div></div></div>${A.strip(R)}`;
  }
  const hash = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  function packD(counts, w, h, maxD) {
    const m = Math.max(1, ...counts);
    let d = Math.min(maxD, Math.sqrt(w * h / m));
    while (d > 2 && Math.floor(w / d) * Math.floor(h / d) < m) d -= 0.2;
    return Math.max(2, d);
  }
  function packAt(i, n, d, x0, y0, w, h, mode) {
    const cols = Math.max(1, Math.floor(w / d));
    const r = Math.floor(i / cols), c = i % cols;
    const used = Math.min(cols, n), off = mode === 'left' ? 0 : (w - used * d) / 2;
    return [x0 + off + (c + .5) * d, mode === 'top' || mode === 'left' ? y0 + (r + .5) * d : y0 + h - (r + .5) * d];
  }
  function setGraphics(ch, els) {
    const prev = ch.__g || [], ids = els.map(e => e.id);
    ch.__g = ids;
    return els.concat(prev.filter(id => !ids.includes(id)).map(id => ({ id, $action: 'remove' })));
  }
  const gText = (id, x, y, text, o = {}) => ({ type: 'text', id, x, y, silent: true, z: 5, style: { text, fill: o.fill || TXT, font: `${o.bold ? 700 : 400} ${o.size || 11}px ${o.serif ? FELL : o.bold ? "Poppins, Archivo, Arial" : FONT}`, textAlign: o.align || 'center', textVerticalAlign: o.v || 'middle', opacity: o.opacity == null ? 1 : o.opacity, lineHeight: (o.size || 11) * 1.15 } });
  const gRect = (id, x, y, w, h, o = {}) => ({ type: 'rect', id, silent: true, z: 0, shape: { x, y, width: w, height: h }, style: { fill: o.fill || 'none', stroke: o.stroke || GRID, lineWidth: o.lw || 1, lineDash: o.dash || null } });
  function baseScatter(W, H) {
    return { animationDurationUpdate: 900, animationEasingUpdate: 'cubicInOut', animationDuration: 600,
      grid: { left: 0, right: 0, top: 0, bottom: 0 }, xAxis: { type: 'value', min: 0, max: W, show: false }, yAxis: { type: 'value', min: 0, max: H, show: false, inverse: true },
      tooltip: { ...TT, trigger: 'item', confine: true, formatter: p => p.data && p.data.R ? ttReader(p.data.R) : '' } };
  }
  // Readers whose cards are on screen are drawn bigger, outlined, and named on the chart.
  let FEAT = new Set();
  const featLabel = R => ({ show: true, position: 'top', distance: 3, formatter: (t => t.length > 14 ? t.slice(0, 13) + '…' : t)(R.reader.town || R.reader.city || 'a reader'), fontFamily: FELL, fontSize: 12.5, color: INK, backgroundColor: '#FBF6EA', borderColor: INK, borderWidth: .8, padding: [2, 5, 1] });
  const cupPt = (R, x, y, d, o = {}) => { const f = !R.you && FEAT.has(R.id);
    return { name: R.you ? 'you' : R.id, value: [x, y], R, symbol: o.sym || GLASS, symbolSize: R.you || f ? [Math.max(d * .9, 12), Math.max(d * 1.17, 16)] : [d * .62, d * .82],
      itemStyle: { color: (R.you ? A.liquid(R) : R.shade && R.shade.hex) || '#CFC6BA', borderColor: R.you ? RED : f ? INK : 'rgba(36,26,17,.5)', borderWidth: R.you ? 2.4 : f ? 2 : .6, opacity: f ? 1 : o.op == null ? 1 : o.op },
      label: f ? featLabel(R) : { show: false }, z: R.you ? 10 : f ? 9 : 2 }; };
  // stacked columns of glasses (used by the pour and the cup charts)
  function columns(ch, W, H, groups, labels, o = {}) {
    const data = [], els = [];
    const padX = 4, top = 24, bottom = o.bottom || 44, gw = (W - padX * 2) / groups.length, h = H - top - bottom;
    const d = packD(groups.map(g => g.length), gw - 6, h, 30);
    groups.forEach((g, k) => {
      const x0 = padX + k * gw + 3, dimCol = o.dimCol && o.dimCol(k), foc = (o.focus || []).includes(k);
      if (foc) { const rows = Math.ceil(g.length / Math.max(1, Math.floor((gw - 6) / d))); els.push(gRect('cf' + k, x0 - 2, H - bottom - rows * d - 6, gw - 2, rows * d + 6, { stroke: RED, lw: 1.5, dash: [4, 3], fill: 'rgba(168,50,31,.06)' })); }
      g.forEach((r, i) => { const [x, y] = packAt(i, g.length, d, x0, top, gw - 6, h, 'bottom'); data.push(cupPt(r, x, y, d, { op: !r.you && (dimCol || (o.dim && o.dim(r))) ? .15 : 1, sym: o.sym ? o.sym(r) : null })); });
      els.push(gText('cl' + k, x0 + (gw - 6) / 2, H - bottom + 15, labels[k], { serif: true, fill: foc ? RED : INK, size: W < 420 ? 11 : 14 }));
      els.push(gText('cc' + k, x0 + (gw - 6) / 2, H - bottom + (labels[k].includes('\n') ? 40 : 32), String(g.filter(r => !r.you).length), { bold: true, fill: foc ? RED : TXT, size: foc ? (W < 420 ? 13 : 16) : (W < 420 ? 10 : 12), opacity: dimCol ? .4 : 1 }));
    });
    els.push(gRect('cbase', padX, H - bottom + 1, W - padX * 2, 0.5, { stroke: INK }));
    return { ...baseScatter(W, H), series: [{ type: 'scatter', data }], graphic: setGraphics(ch, els) };
  }

  // Key figure shown at the top of every data step: a big number, what it counts, and its share of all readers.
  // Key figure: a big number, what it counts, and the share said the way people say it ("about 3 in 10"),
  // drawn as ten little glasses.
  const kfig = (n, cap, of = N) => { const f = n / of, k = Math.round(10 * f), who = of === N ? 'readers' : 'of them';
    const say = f >= .95 ? `nearly all ${who}` : f < .1 ? `about 1 in ${Math.max(2, Math.round(1 / f))} ${who}` : f > .45 && f < .55 ? `about half of ${of === N ? 'all readers' : 'them'}` : `about ${k} in 10 ${who}`;
    return `<div class="kfig"><span class="kn">${n}</span><span class="kc">${cap}</span><span class="kten" title="${n} of ${of}">${f >= .1 ? Array.from({ length: 10 }, (_, i) => `<i class="${i < k ? 'on' : ''}"></i>`).join('') : ''}<em>${say}</em></span></div>`; };
  const modeOf = vals => { const m = {}; vals.forEach(v => { if (v != null) m[v] = (m[v] || 0) + 1; }); const e = Object.entries(m).sort((a, b) => b[1] - a[1])[0]; return e ? [e[0], e[1]] : [null, 0]; };
  const youLine = html => html ? `<span class="you-line"><em>you</em>${html}</span>` : '';
  const CH = {};
  CH.pour = {
    no: 'fig. i', label: 'every reader’s glass, tinted by their recipe',
    like: R => R.milk == null ? null : r => r.milk === R.milk,
    you: R => R.milk == null ? '' : `Your pour, <b>${L.milk[R.milk]}</b>, is shared by <b>${S.milk[R.milk]}</b> readers.`,
    draw(ch, st, W, H) {
      const R = meR(), you = R.milk != null ? R : null;
      if (st === 'all') {
        const data = [];
        const list = RS.slice().sort((a, b) => (a.shade ? a.shade.t : 2) - (b.shade ? b.shade.t : 2));
        if (you) { const t = (C.shade(you) || { t: 0 }).t; let at = list.findIndex(r => r.shade && r.shade.t >= t); if (at < 0) at = list.length; list.splice(at, 0, you); }
        const pad = 10, d = packD([list.length], W - pad * 2, H - pad * 2, 44);
        const cols = Math.floor((W - pad * 2) / d), rows = Math.ceil(list.length / cols), y0 = (H - rows * d) / 2;
        list.forEach((r, i) => { const [x, y] = packAt(i, list.length, d, pad, y0, W - pad * 2, rows * d, 'top'); data.push(cupPt(r, x, y, d)); });
        return { ...baseScatter(W, H), series: [{ type: 'scatter', data }], graphic: setGraphics(ch, []) };
      }
      const groups = [0, 1, 2, 3, 4, 5].map(k => RS.filter(r => r.milk === k).sort((a, b) => (a.shade ? a.shade.t : 0) - (b.shade ? b.shade.t : 0)));
      if (you) groups[you.milk].push(you);
      const lk = st === 'you' && CH.pour.like(R);
      return columns(ch, W, H, groups, L.milk, { dimCol: st === 'ends' ? k => k > 0 && k < 5 : null, dim: lk ? r => !lk(r) : null, focus: st === 'milk' ? [3] : st === 'ends' ? [0, 5] : st === 'you' && you ? [you.milk] : [] });
    }
  };

  const FORM_COL = { crushed: '#A8321F', grated: '#D9962E', sliced: '#B5702C', whole: '#3F6B4C', powder: '#8A7B70', seeds: '#2B4C9A', roasted: '#5A2D18', fresh: '#7FB37F', dried: '#C9A27A', packaged: '#3D3D3D' };
  CH.larder = {
    no: 'fig. ii', label: 'each dot is one reader’s spice',
    like: R => !R.extras.length ? (ME.touched.larder ? r => !r.extras.length : null) : r => r.extras.some(s => R.extras.includes(s)),
    you: R => R.extras.length ? `Your larder: <b>${R.extras.map(s => L.spice[s]).join(', ')}</b>. <b>${cnt(r => r.extras.some(s => R.extras.includes(s)))}</b> readers use at least one of these.` : ME.touched.larder ? `You add nothing else, like <b>${S.plain}</b> readers.` : '',
    draw(ch, st, W, H) {
      const R = meR();
      const rowsK = S.spiceList.slice(0, W < 420 ? 9 : 11);
      const left = W < 420 ? 74 : 96, top = st === 'count' ? 6 : 26, right = 6, bottom = 4;
      const rh = (H - top - bottom) / rowsK.length;
      const items = [];
      RS.forEach(r => r.extras.forEach(s => { if (rowsK.includes(s)) items.push({ r, s, stg: r.st[s], form: r.forms[s] }); }));
      const mine = R.extras.filter(s => rowsK.includes(s)).map(s => ({ r: R, s, stg: R.st[s], form: R.forms[s], you: true }));
      const data = [], els = [];
      const col = it => st === 'form' ? (FORM_COL[it.form] || '#E3D6BF') : ICON.col(it.s);
      if (st === 'count') {
        const groups = rowsK.map(s => items.filter(it => it.s === s).concat(mine.filter(m => m.s === s)));
        const d = packD(groups.map(g => g.length), W - left - right, rh - 4, 14);
        groups.forEach((g, k) => g.forEach((it, i) => { const [x, y] = packAt(i, g.length, d, left, top + k * rh + 2, W - left - right, rh - 4, 'left'); data.push(spPt(it, x, y, d, 1, col(it))); }));
      } else {
        const cw = (W - left - right) / 5;
        const cells = {}; items.concat(mine).forEach(it => { const k = it.s + '-' + (it.stg == null ? 'x' : it.stg); (cells[k] = cells[k] || []).push(it); });
        const d = packD(Object.entries(cells).filter(([k]) => !k.endsWith('x')).map(([, v]) => v.length), cw - 6, rh - 4, 14);
        Object.entries(cells).forEach(([k, g]) => {
          const [s, stg] = k.split('-'), ri = rowsK.indexOf(s);
          g.sort((a, b) => (a.you ? 1 : 0) - (b.you ? 1 : 0));
          g.forEach((it, i) => {
            if (stg === 'x') { data.push(spPt(it, left + (W - left - right) / 2, top + (ri + .5) * rh, d, 0, col(it))); return; }
            const [x, y] = packAt(i, g.length, d, left + +stg * cw + 3, top + ri * rh + 2, cw - 6, rh - 4, 'top');
            const lk = st === 'you' && CH.larder.like(R);
            data.push(spPt(it, x, y, d, it.you || (st === 'late' ? +stg >= 3 : lk ? lk(it.r) : true) ? 1 : .14, col(it)));
          });
        });
        L.stage.forEach((s, i) => els.push(gText('sx' + i, left + (i + .5) * cw, 11, s + ' · ' + S.spStage[i], { serif: true, fill: (i >= 3 && st === 'late') || (st === 'stage' && S.spStage[i] === Math.max(...S.spStage)) ? RED : INK, size: W < 420 ? 9.5 : 13 })));
        for (let i = 1; i < 5; i++) els.push(gRect('sg' + i, left + i * cw, top, 0.5, H - top - bottom));
      }
      rowsK.forEach((s, k) => {
        const on = R.extras.includes(s);
        els.push(gText('sl' + k, left - 8, top + (k + .5) * rh - (W < 420 ? 6 : 7), L.spice[s].replace('chai masala', 'masala'), { align: 'right', serif: true, fill: on ? RED : INK, size: W < 420 ? 12 : 14 }));
        els.push(gText('sn' + k, left - 8, top + (k + .5) * rh + (W < 420 ? 7 : 9), String(S.sp[s]), { align: 'right', bold: true, fill: on ? RED : TXT, size: W < 420 ? 10 : 11.5 }));
        if (k) els.push(gRect('sr' + k, left, top + k * rh, W - left - right, 0.5));
      });
      return { ...baseScatter(W, H), tooltip: { ...TT, confine: true, formatter: p => p.data && p.data.it ? spTip(p.data.it) : '' }, series: [{ type: 'scatter', data, symbol: 'circle' }], graphic: setGraphics(ch, els) };
    }
  };
  function spPt(it, x, y, d, op, color) {
    const f = !it.you && FEAT.has(it.r.id);
    return { name: it.you ? 'you-' + it.s : it.r.id + '-' + it.s, value: [x, y], it, symbolSize: it.you || f ? Math.max(d * 1.3, 10) : d * 0.82, z: it.you ? 10 : f ? 9 : 2,
      itemStyle: { color, opacity: f ? 1 : op, borderColor: it.you ? RED : f ? INK : 'rgba(36,26,17,.4)', borderWidth: it.you ? 2.5 : f ? 2 : 0.6 } };
  }
  function spTip(it) {
    if (it.you) return `<div style="font-family:${FELL};font-size:15px;color:${RED}">You · ${L.spice[it.s]}${it.form ? ', ' + L.form[it.form] : ''}</div><div>${it.stg != null ? 'goes in: ' + L.stage[it.stg] : 'not timed yet'}</div>`;
    const rr = it.r.reader;
    return `<div style="font-family:${FELL};font-size:15px;color:${INK}">${esc(L.spice[it.s])}${it.form ? `, ${L.form[it.form]}` : ''}</div><div>${it.stg != null ? 'goes in: ' + L.stage[it.stg] : 'didn’t say when'}</div><div style="color:${TXT};font-size:11.5px;margin-top:3px">${esc(it.r.name)} · ${[rr.age, rr.town].filter(Boolean).map(esc).join(' · ')}</div>`;
  }

  const AX = [
    { name: 'Tea goes in', min: -1, max: 5, lab: v => L.stage[v] },
    { name: 'Milk goes in', min: -2, max: 5, lab: v => v === -1 ? 'no milk' : L.stage[v] },
    { name: 'Boils after milk', min: -2, max: 5, lab: v => v === -1 ? 'n/a' : L.boils[v] },
    { name: 'Leaf stays in', min: -1, max: 6, lab: v => L.brew[v] },
    { name: 'Sweetener goes in', min: -2, max: 5, lab: v => v === -1 ? 'none' : L.stage[v] }
  ];
  const seqVals = (R, jit) => {
    const j = k => jit ? (hash(R.i * 7 + k) - .5) * 0.5 : 0;
    if (R.st.tea == null) return null;
    const milkIn = R.milk === 0 || R.st.milk == null ? -1 : R.st.milk;
    const boils = R.milk === 0 || R.boils == null ? -1 : R.boils;
    const sw = !R.sweet || R.sweet === 'none' || R.st.sweet == null ? -1 : R.st.sweet;
    return [R.st.tea + j(1), milkIn + j(2), boils + j(3), (R.brew == null ? 2 : R.brew) + j(4), sw + j(5)];
  };
  // When does each thing go in? One row per ingredient, one column per moment, one glass per reader.
  // The same reader appears once in each row, so a highlighted group lights up across all three.
  const SEQ_ROWS = [
    { lab: 'the leaf', get: r => r.st.tea },
    { lab: 'the milk', get: r => r.milk > 0 ? r.st.milk : null },
    { lab: 'the sweetener', get: r => r.sweet && r.sweet !== 'none' ? r.st.sweet : null }
  ];
  S.teaAt = [0, 1, 2, 3, 4].map(k => cnt(r => r.st.tea === k));
  CH.sequence = {
    no: 'fig. iii', label: 'each glass is one reader, placed at the moment that ingredient goes in',
    like: R => R.st.tea == null ? null : r => r.st.tea === R.st.tea,
    you: R => R.st.tea == null ? '' : `Your leaf goes in at <b>${L.stage[R.st.tea]}</b>, like <b>${cnt(r => r.st.tea === R.st.tea)}</b> readers${R.milk && R.boils != null ? `; it boils <b>${L.boils[R.boils]}</b>, like <b>${S.boil[R.boils]}</b>` : ''}.`,
    draw(ch, st, W, H) {
      const R = meR(), small = W < 520;
      const lk = st === 'you' && CH.sequence.like(R);
      const hot = r => lk ? lk(r) : st === 'common' ? r.st.tea === 2 && r.st.milk === 2 : st === 'milkfirst' ? r.milk > 0 && r.st.milk != null && r.st.milk < r.st.tea : st === 'boils' ? r.milk > 0 && r.boils >= 3 : st === 'cup' ? r.st.milk === 4 || (r.st.sweet === 4 && r.sweet !== 'none') : true;
      const data = [], els = [];
      if (st === 'boils') {
        // one row: how many times it rises after the milk
        const groups = [0, 1, 2, 3, 4].map(k => RS.filter(r => r.milk > 0 && r.boils === k));
        if (R.milk > 0 && R.boils != null) groups[R.boils].push(R);
        return columns(ch, W, H, groups, L.boils, { focus: [3, 4] });
      }
      const left = small ? 74 : 118, top = 30, right = 6, bottom = 6, cols = 5;
      const cw = (W - left - right) / cols, rh = (H - top - bottom) / SEQ_ROWS.length;
      const cells = SEQ_ROWS.map(() => [[], [], [], [], []]);
      RS.forEach(r => SEQ_ROWS.forEach((row, ri) => { const v = row.get(r); if (v != null) cells[ri][v].push(r); }));
      SEQ_ROWS.forEach((row, ri) => { const v = row.get(R); if (v != null) cells[ri][v].push(R); });
      const d = packD([].concat(...cells.map(rw => rw.map(c => c.length))), cw - 8, rh - 22, 22);
      cells.forEach((rw, ri) => rw.forEach((list, ci) => {
        const x0 = left + ci * cw + 4, y0 = top + ri * rh + 4;
        list.sort((p, q) => (p.you ? 1 : 0) - (q.you ? 1 : 0));
        list.forEach((r, i) => { const [x, y] = packAt(i, list.length, d, x0, y0, cw - 8, rh - 22, 'top'); data.push({ ...cupPt(r, x, y, d, { op: r.you || hot(r) ? 1 : .13 }), name: (r.you ? 'you' : r.id) + '-' + ri }); });
        const n = list.filter(r => !r.you).length, lit = list.filter(r => !r.you && hot(r)).length;
        if (n) els.push(gText('n' + ri + ci, left + (ci + 1) * cw - 6, top + (ri + 1) * rh - 9, st === 'all' ? String(n) : `${lit} of ${n}`, { align: 'right', bold: st === 'all' || lit > 0, fill: st !== 'all' && lit ? RED : TXT, size: small ? 10 : 12 }));
      }));
      L.stage.forEach((s, i) => els.push(gText('h' + i, left + (i + .5) * cw, 13, s, { serif: true, fill: INK, size: small ? 11 : 14 })));
      SEQ_ROWS.forEach((row, ri) => {
        els.push(gText('r' + ri, left - 10, top + (ri + .5) * rh - 8, small ? row.lab.replace('the ', '') : row.lab, { align: 'right', serif: true, fill: INK, size: small ? 12 : 15 }));
        els.push(gText('rs' + ri, left - 10, top + (ri + .5) * rh + 10, 'goes in', { align: 'right', serif: true, fill: TXT, size: small ? 10 : 12 }));
        if (ri) els.push(gRect('rl' + ri, 0, top + ri * rh, W, 0.5, { stroke: '#8D7B62' }));
      });
      for (let i = 1; i < cols; i++) els.push(gRect('sv' + i, left + i * cw, top, 0.5, H - top - bottom));
      return { ...baseScatter(W, H), series: [{ type: 'scatter', data }], graphic: setGraphics(ch, els) };
    }
  };

  const AMT_COLS = [0, 1, 2, 3, 4, 5, 6];
  CH.leaf = {
    no: 'fig. iv', label: 'tea per cup, across · time before straining, down',
    like: R => R.amt == null ? null : r => r.amt === R.amt,
    you: R => R.amt == null ? '' : R.brew == null ? `You use <b>${L.amt[R.amt]}</b>, like <b>${cnt(r => r.amt === R.amt)}</b> readers.` : `Your square, <b>${L.amt[R.amt]}</b> for <b>${L.brew[R.brew]}</b>, holds <b>${S.leafCell[R.amt + '-' + R.brew] || 0}</b> readers.`,
    draw(ch, st, W, H) {
      const R = meR(), you = R.amt != null && R.brew != null ? { ...R, milk: R.milk == null ? 3 : R.milk } : null;
      const left = W < 420 ? 54 : 74, top = 28, right = 6, bottom = 6;
      const cw = (W - left - right) / AMT_COLS.length, chh = (H - top - bottom) / 6;
      const cells = {};
      RS.forEach(r => { if (r.amt == null || r.brew == null) return; (cells[r.amt + '-' + r.brew] = cells[r.amt + '-' + r.brew] || []).push(r); });
      if (you) (cells[you.amt + '-' + you.brew] = cells[you.amt + '-' + you.brew] || []).push(you);
      const d = packD(Object.values(cells).map(c => c.length), cw - 6, chh - 6, 24);
      const [ta, tb] = S.topCell[0].split('-').map(Number);
      const lk = st === 'you' && CH.leaf.like(meR());
      const hot = r => st === 'top' ? r.amt === ta && r.brew === tb : st === 'kadak' ? (r.amt === 3 || r.amt === 4) && (r.brew === 3 || r.brew === 4) : st === 'quick' ? r.brew === 0 || r.amt === 5 || r.brew === 5 : lk ? lk(r) : true;
      const data = [], els = [];
      Object.entries(cells).forEach(([k, list]) => {
        const [a, b] = k.split('-').map(Number), x0 = left + AMT_COLS.indexOf(a) * cw + 3, y0 = top + b * chh + 3;
        list.sort((p, q) => (p.you ? 1 : 0) - (q.you ? 1 : 0));
        list.forEach((r, i) => { const [x, y] = packAt(i, list.length, d, x0, y0, cw - 6, chh - 6, 'top'); data.push(cupPt(r, x, y, d, { op: r.you || hot(r) ? 1 : .14 })); });
      });
      AMT_COLS.forEach((a, i) => els.push(gText('ax' + i, left + (i + .5) * cw, 13, L.amt[a], { serif: true, fill: INK, size: W < 420 ? 9.5 : 13.5 })));
      L.brew.forEach((b, i) => els.push(gText('ay' + i, left - 6, top + (i + .5) * chh, b, { align: 'right', serif: true, size: W < 420 ? 10.5 : 13.5, fill: INK })));
      for (let i = 0; i <= AMT_COLS.length; i++) els.push(gRect('gx' + i, left + i * cw, top, 0.5, H - top - bottom));
      for (let j = 0; j <= 6; j++) els.push(gRect('gy' + j, left, top + j * chh, W - left - right, 0.5));
      if (st === 'kadak') { els.push(gRect('hk', left + 3 * cw, top + 3 * chh, 2 * cw, 2 * chh, { stroke: RED, lw: 2, dash: [5, 4], fill: 'rgba(168,50,31,.06)' })); els.push(gText('hkt', left + 5 * cw - 4, top + 5 * chh - 8, S.kadak + ' readers', { align: 'right', fill: RED, size: 13, bold: true })); }
      if (st === 'top') { els.push(gRect('ht', left + AMT_COLS.indexOf(ta) * cw, top + tb * chh, cw, chh, { stroke: RED, lw: 2, fill: 'rgba(168,50,31,.06)' })); els.push(gText('htt', left + (AMT_COLS.indexOf(ta) + 1) * cw - 3, top + (tb + 1) * chh - 8, String(S.topCell[1]), { align: 'right', fill: RED, size: 14, bold: true })); }
      if (st === 'you' && you) els.push(gRect('hy', left + AMT_COLS.indexOf(you.amt) * cw, top, cw, H - top - bottom, { stroke: RED, lw: 1.5, dash: [4, 3], fill: 'rgba(168,50,31,.05)' }));
      return { ...baseScatter(W, H), series: [{ type: 'scatter', data }], graphic: setGraphics(ch, els) };
    }
  };

  const SW_ORDER = ['none', 'sugar1', 'sugar2', 'sugar3', 'jaggery', 'free', 'honey'];
  const SW_LAB = ['no\nsugar', 'a little\nsugar', '1 tsp\nsugar', '2+ tsp\nsugar', 'jaggery', 'sugar-\nfree', 'honey'];
  const V_ORDER = ['glass', 'cup', 'mug', 'tumbler'];
  CH.cup = {
    no: 'fig. v', label: 'every reader’s cup, by what sweetens it and what holds it',
    like: R => R.vessel ? r => r.vessel === R.vessel : R.sweet ? r => r.sweet === R.sweet : null,
    you: R => [R.sweet ? `<b>${L.sweet[R.sweet]}</b>, like <b>${cnt(r => r.sweet === R.sweet)}</b> readers` : '', R.vessel ? `a <b>${L.vessel[R.vessel]}</b>, like <b>${S.vessel[R.vessel]}</b>` : ''].filter(Boolean).join('; '),
    draw(ch, st, W, H) {
      const R = meR();
      if (st === 'vessel' || st === 'you') {
        const groups = V_ORDER.map(v => RS.filter(r => r.vessel === v).sort((a, b) => (a.shade ? a.shade.t : 0) - (b.shade ? b.shade.t : 0)));
        if (R.vessel && R.milk != null) groups[V_ORDER.indexOf(R.vessel)].push(R);
        const lk = st === 'you' && CH.cup.like(R);
        return columns(ch, W, H, groups, V_ORDER.map(v => L.vessel[v]), { sym: r => VSYM[r.vessel] || GLASS, dim: lk ? r => !lk(r) : null, focus: st === 'vessel' ? [2] : R.vessel ? [V_ORDER.indexOf(R.vessel)] : [] });
      }
      const groups = SW_ORDER.map(s => RS.filter(r => r.sweet === s).sort((a, b) => (a.shade ? a.shade.t : 0) - (b.shade ? b.shade.t : 0)));
      if (R.sweet && R.milk != null) groups[SW_ORDER.indexOf(R.sweet)].push(R);
      return columns(ch, W, H, groups, SW_LAB, { bottom: 54, dim: st === 'where' ? r => r.sweet === 'none' || r.st.sweet !== 4 : null, focus: st === 'sweet' ? [0] : [] });
    }
  };

  const LIVE = {}; // chart key -> { chart, step }
  function drawChart(key) {
    const lv = LIVE[key]; if (!lv) return;
    const el = lv.chart.getDom(), W = el.clientWidth, H = el.clientHeight;
    if (!W || !H) return;
    lv.chart.setOption(CH[key].draw(lv.chart, CH[key].steps[lv.step].st, W, H));
    // on phones your line sits under the chart (the text box above is too small for it)
    const yl = el.parentNode.querySelector('.c-yl'); if (yl) { const t = youLine(CH[key].you(meR())); if (yl.innerHTML !== t) { yl.innerHTML = t; if (mode === 'm') requestAnimationFrame(() => lv.chart.resize()); } }
  }

  // ---------- Cell specs ----------
  // The story is about the teas, not the making: a glass, the things people put in it, then the readers themselves.
  let NOW_T = 2; // new leaves and spices default to going in at the boil / while heating
  const who = rr => [rr.age, rr.town].filter(Boolean).map(esc).join(' · ') || 'A reader';
  const vesselFor = (R, o) => A.vessel(R, { still: true, ...o });
  const trunc = (s, n) => s.length > n ? s.slice(0, n - 1).trim() + '…' : s;

  const Q = {
    cold: [['odmp7b', 'Until the boiling water becomes dark, do not add milk.'],
      ['ukuktg', 'After the tea is added, boil for another 30 seconds and switch off, let it settle, then strain. In the cup, a splash of milk first, then the strained tea.'],
      ['en3o8c', 'I use two pans. I boil the water and milk separately, and let the milk get boiled really a few times.'],
      ['wghgzx', 'Put the tea leaves in once it starts boiling, let it simmer a couple of minutes, then a splash of milk to get the correct dark brown colour. Three boils and it is done.']],
    heat: [['j0mha9', 'I love to let the ginger simmer the longest with the water and sugar so it candies a little bit before everything else goes in. Makes the ginger pop. Believe me.'],
      ['a444to', 'Cardamom goes only at the end after turning the fire off. That way it leaves a stronger fragrance which gets lost otherwise.'],
      ['n1n7n9', 'Dried tulsi, crushed ginger, and either cardamom or cinnamon. Never together, and a maximum of only three herbs.'],
      ['5hvwyn', 'If I use ginger, I grate it to release the flavour and add some dry ginger powder.']],
    boil: [['1no1do', 'Then make it full flame and let it go up and down 2-3 times, then strain and drink it with biscuits or rusk.'],
      ['q2b87m', 'Cloves, ginger and cardamom go in once the milk and water start boiling. I let it simmer for 3-4 minutes, until I get the smell of the ingredients.'],
      ['9ulomy', 'Tea goes in once the water starts to boil. Milk goes in after it has come to a full boil. Once the milk goes in, the stove is turned down to a simmer.'],
      ['yp3fv4', 'Add sugar, then add some more fresh tea powder to add the flavour, then strain and have it hot.']],
    off: [['q5ebsr', 'I was long addicted to very strongly boiled tea, around 15 minutes. Now I bring water to a boil, turn off the heat, add half a teaspoon of CTC and let it brew for about 5 minutes.'],
      ['zdmun4', 'Girnar mamri chaa, bought loose from a tea shop in Ghatkopar. I add it to the vessel, cover it, and strain after about a minute.'],
      ['115cpl', 'Half a teaspoon of leaf in an infuser, dropped in my cup and closed. After about 3 minutes, when the colour looks dark enough, I take it out.'],
      ['x64yqt', 'Once it’s off the flame, I aerate it by pouring it back and forth between the mug and the vessel a few times, and then strain.']],
    cup: [['2xzrgb', 'A cup-saucer is a ritual. Tea in a mug is for bodybuilders. Tea needs finesse in making and serving.'],
      ['owynz2', 'Pour into a mug, add sugar, stir and… the best part of the day is about to start.'],
      ['cqgqr0', 'The chai simmers or boils a bit more when it’s with friends or guests, or a weekend!'],
      ['oatdpb', 'The water also plays an important role. If the water is hard or salty, you will not experience the tea as you want it.']],
    end1: [['e7d8r3', 'Crushed ginger, fresh mint and fresh lemongrass go into the water. The moment the aroma is released, in goes the tea powder.'],
      ['jzpwu3', 'Always fresh orthodox Assam, as I am placed in a tea garden where we produce orthodox teas.'],
      ['iu90rr', 'When I have extra time, mostly weekend evenings, I let the tea simmer 10 minutes or more and add a bit of sugar. Tastes like dessert.'],
      ['8urwlb', 'Everybody’s hands, mood and experience have that magic that creates a very specific tea every time somebody makes it.']],
    end2: [['xqp8x0', 'Crush the cardamom and switch off the flame. Add a quarter teaspoon of long leaf, cover the pan, steep for a minute and strain.'],
      ['f69bqz', 'Darjeeling and CTC are poles apart and do not give synergy. No blend. I am a purist.'],
      ['w3k9md', 'If the tea bag is in too long, it becomes bitter.'],
      ['h7uhyh', 'Lemongrass is the new addition. It goes in with the rest of the ingredients.']]
  };
  // Curated quotes win; otherwise a reader's own free-text answer.
  const QMAP = {}; Object.values(Q).forEach(l => l.forEach(([id, q]) => { const r = byId(id); if (r) QMAP[r.id] = q; }));
  const quoteOf = r => QMAP[r.id] || (r.reader.quote || '').trim();
  const sweetLab = s => s === 'none' ? 'no sugar' : L.sweet[s];
  function recipeLine(r) {
    const b = [];
    if (r.milk != null) b.push(r.milk === 0 ? 'black' : r.milk === 5 ? 'all milk' : `${L.milk[r.milk]} milk`);
    if (r.teas.length) b.push(r.teas.map(t => L.tea[t]).join(' + ') + (r.amt != null && r.amt < 5 ? `, ${L.amt[r.amt]}` : ''));
    if (r.milk > 0 && r.boils != null) b.push(r.boils === 4 ? 'simmered' : r.boils === 0 ? 'never boiled' : `boiled ${L.boils[r.boils]}`);
    if (r.extras.length) b.push(r.extras.map(s => L.spice[s]).join(', '));
    if (r.sweet) b.push(sweetLab(r.sweet));
    return b.join(' · ');
  }

  // A reader's tea, as a card: their glass, who they are, what they said, and a way into their recipe.
  // Readers are known by town and age; "name" is what they call the drink.
  const placeOf = r => r.reader.town || (r.reader.city && r.reader.city !== 'Elsewhere in India' ? r.reader.city : 'A reader');
  const callsIt = r => [r.reader.age, r.name && r.name.length < 24 ? `calls it ${r.name.toLowerCase() === 'chai' ? 'chai' : r.name}` : ''].filter(Boolean).map(esc).join(' · ');
  const rcard = (r, extra = '') => `<div class="rel-top">${vesselFor(r, { type: r.vessel })}<div><div class="rel-n">${esc(trunc(placeOf(r), 22))}</div><div class="rel-w">${callsIt(r)}</div></div></div>
    <div class="rc-q">${quoteOf(r) ? `<q>${esc(trunc(quoteOf(r), 230))}</q>` : ''}<span class="rc-r">${esc(recipeLine(r))}</span></div>${extra}`;
  const rcBack = r => `<div class="rc-bh"><span class="pz-k">How they make it</span><div class="rel-n">${esc(trunc(placeOf(r), 22))}</div></div>${A.strip(r)}<div class="rc-bl">${esc(recipeLine(r))}</div>`;
  const RCARD = (r, why) => r ? { key: 'rc:' + r.id, cls: 'c-rc', pad0: true, attrs: () => ({ title: 'Tap to turn the card over' }),
    render: () => `<div class="rc-in"><div class="rc-f">${why ? `<div class="rc-why">${why}</div>` : ''}${rcard(r, `<div class="rc-btns"><button class="rc-make" type="button" data-act="make" data-id="${r.id}">Make theirs <span aria-hidden="true">↗</span></button><span class="rc-turn" aria-hidden="true">↻ timeline</span></div>`)}</div>
      <div class="rc-b">${why ? `<div class="rc-why">${why}</div>` : ''}${rcBack(r)}<div class="rc-btns"><button class="rc-make" type="button" data-act="make" data-id="${r.id}">Make theirs <span aria-hidden="true">↗</span></button><span class="rc-turn" aria-hidden="true">↻ quote</span></div></div></div>` }
    : { key: 'rc:none', render: () => '' };

  // The big glass in the middle of the opening (and, at the end, yours)
  let HERO_MODE = 'empty';
  const HERO_R = { milk: 3, teas: ['ctc'], amt: 2, brew: 2, st: {}, extras: [], boils: 2, forms: {} };
  const HERO = { key: 'hero', live: true, cls: 'c-hero', render: () => {
    if (HERO_MODE === 'you' && !meEmpty()) {
      const R = meR(), sh = C.shade(R);
      return `<div class="c-art">${A.vessel(R, { type: R.vessel || 'glass', float: R.extras })}</div><div class="c-lab"><b>${esc(R.name)}</b><small>${C.FAM[C.family(R)].name}${sh ? ' · shade ' + sh.code : ''}</small></div>`;
    }
    const full = HERO_MODE !== 'empty';
    return `<div class="c-art">${A.vessel(HERO_R, { type: 'glass', colour: full ? C.cellColour(2, 2) : null, emptyLabel: false, float: full ? ['ginger', 'cardamom', 'tulsi'] : [] })}</div>${HERO_MODE === 'you' ? '<div class="c-lab"><small>yours goes here</small></div>' : ''}`;
  } };
  const ORBS = ['water', 'milk', 'ctc', 'leaf', 'sugar', 'jaggery', 'ginger', 'cardamom', 'clove', 'cinnamon', 'pepper', 'tulsi', 'mint', 'masala', 'lemongrass', 'saffron'];
  const ORB = k => ({ key: 'orb:' + k, cls: 'c-orb', render: () => `<div class="c-art">${ICON(k)}</div><div class="ing-name">${LAB[k]}</div><div class="ing-hint">${countFor(k)} readers</div>` });
  const BIG = (key, h, p) => ({ key: 'big:' + key, render: () => `<div class="c-text c-big" data-fit><div class="hero-t">${h}</div>${p ? `<p>${p()}</p>` : ''}</div>` });
  const CTA = { key: 'cta', live: true, cls: 'c-cta', render: () => meEmpty()
    ? `<button type="button" class="cta-b" data-act="make"><span class="pour">Make your own</span><small>Build your cup. It will show up, in red, in every chart.</small></button>`
    : `<button type="button" class="cta-b" data-act="make"><span class="pour">Change your chai</span><small>Your cup is in every chart, in red.</small></button><button type="button" class="cta-s" data-act="pour">Pour my card ↗</button>` };

  const TITLES = {
    who: { bg: '#22304F', k: 'Who we asked', h: 'The readers', hi: 'पाठक', q: `${N} kitchens, one survey.` },
    pour: { bg: '#7A2318', k: 'Chapter I', h: 'No two cups alike', hi: 'हर कप अलग', q: 'The colour of a glass is its recipe.' },
    sequence: { bg: '#1F3A2B', k: 'Chapter II', h: 'The boil debate', hi: 'उबाल की बहस', q: 'What goes in when, and how many times it rises.' },
    leaf: { bg: '#7A4416', k: 'Chapter III', h: 'How strong is strong', hi: 'कड़क', q: 'How much leaf, and how long it stays.' },
    larder: { bg: '#22231F', k: 'Chapter IV', h: 'The spice box', hi: 'मसाला डिब्बा', q: 'Ginger first, then everything else.' },
    cup: { bg: '#6B4A12', k: 'Chapter V', h: 'At the table', hi: 'मेज़ पर', q: 'Sugar, and what it’s poured into.' }
  };
  const TITLE = id => { const t = TITLES[id]; return { key: 'title:' + id, cls: 'c-title', render: () => `<div class="blk" style="background:${t.bg}"><div class="blk-top"><div class="blk-dots"><i></i><i></i><i></i></div></div><div class="blk-k">${t.k}</div><div class="blk-h">${t.h}</div><div class="blk-hi">${t.hi}</div><div class="blk-q">${t.q}</div></div>` }; };
  // Two or three sentences per step, never more. If you've made a cup, a line about it is added.
  const STEP = (ch, i) => ({ key: 'step:' + ch + i, live: true, render: () => { const s = CH[ch].steps[i]; return `<div class="c-text c-step">${s.k ? s.k() : ''}<p class="st-p">${s.h()}</p>${youLine(CH[ch].you(meR()))}</div>`; } });
  const CHART = ch => ({ key: 'chart:' + ch, render: () => `<div class="c-chart"></div><div class="c-yl"></div><div class="c-lab"><small>${CH[ch].label}</small></div>`,
    mount: el => { const chart = echarts.init(el.querySelector('.c-chart'), null, { renderer: 'canvas' }); LIVE[ch] = { chart, step: LIVE[ch] ? LIVE[ch].step : 0 }; },
    unmount: () => { if (LIVE[ch]) { LIVE[ch].chart.dispose(); delete LIVE[ch]; } } });

  // ---------- Who answered ----------
  const CITY = [['Bengaluru', c => c === 'Bengaluru'], ['Mumbai', c => c === 'Mumbai'], ['Delhi NCR', c => c === 'Delhi NCR'], ['other\nmetros', c => ['Chennai', 'Hyderabad', 'Pune', 'Kolkata'].includes(c)],
    ['elsewhere\nin India', c => c === 'Elsewhere in India'], ['abroad', c => c === 'Abroad'], ['didn’t\nsay', c => !c]];
  const AGES = ['18–24', '25–34', '35–44', '45–54', '55–64', '65+'];
  S.men = cnt(r => r.reader.g === 'm'); S.women = cnt(r => r.reader.g === 'w');
  S.bigThree = cnt(r => ['Bengaluru', 'Mumbai', 'Delhi NCR'].includes(r.reader.city));
  S.midAge = cnt(r => ['25–34', '35–44', '45–54'].includes(r.reader.age));
  S.abroad = cnt(r => r.reader.city === 'Abroad'); S.over55 = cnt(r => ['55–64', '65+'].includes(r.reader.age));
  const byShade = g => g.sort((a, b) => (a.shade ? a.shade.t : 0) - (b.shade ? b.shade.t : 0));
  const svgURI = svg => 'image://data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"'));
  const noYou = () => '';

  CH.who = {
    label: 'one glass per reader, tinted by their recipe', you: noYou,
    steps: [{ st: 'city', k: () => kfig(N, 'readers of First Principles told us how they make chai'), h: () => `<b>${S.bigThree}</b> live in Bengaluru, Mumbai or Delhi; <b>${S.abroad}</b> make theirs abroad.`,
      why: ['Lives in Bengaluru, the biggest group', 'Makes their chai abroad'],
      picks: [r => r.reader.city === 'Bengaluru', r => r.reader.city === 'Abroad'] }],
    draw(ch, st, W, H) { return columns(ch, W, H, CITY.map(([, f]) => byShade(RS.filter(r => f(r.reader.city)))), CITY.map(c => c[0]), { bottom: 54, focus: [0, 1, 2] }); }
  };
  // Women on the left, men on the right, one row per age band: a population pyramid made of glasses.
  CH.pyramid = {
    label: 'one glass per reader · women left, men right', you: noYou,
    steps: [{ st: 'age', k: () => kfig(S.midAge, 'are between 25 and 54'), h: () => `Two in three are men. The women who answered skew older: tap a glass to read its recipe.`,
      why: ['One of the oldest readers, 65+', 'A woman aged 25–34'],
      picks: [r => r.reader.age === '65+', r => r.reader.g === 'w' && r.reader.age === '25–34'] }],
    draw(ch, st, W, H) {
      const top = 30, bottom = 8, mid = W / 2, gap = W < 420 ? 26 : 40, rows = AGES.slice().reverse(), rh = (H - top - bottom) / rows.length;
      const side = (g, a) => byShade(RS.filter(r => r.reader.g === g && r.reader.age === a));
      const all = rows.map(a => [side('w', a), side('m', a)]);
      const d = packD([].concat(...all.map(p => p.map(x => x.length))), mid - gap - 6, rh - 6, 22);
      const data = [], els = [];
      all.forEach(([w, m], i) => {
        const y0 = top + i * rh + 3;
        m.forEach((r, k) => { const [x, y] = packAt(k, m.length, d, mid + gap, y0, mid - gap - 6, rh - 6, 'left'); data.push(cupPt(r, x, y, d)); });
        w.forEach((r, k) => { const [x, y] = packAt(k, w.length, d, mid + gap, y0, mid - gap - 6, rh - 6, 'left'); data.push(cupPt(r, 2 * mid - x, y, d)); });
        els.push(gText('pa' + i, mid, top + (i + .5) * rh, rows[i], { serif: true, fill: INK, size: W < 420 ? 10 : 13 }));
        if (i) els.push(gRect('pr' + i, 0, top + i * rh, W, 0.5));
      });
      els.push(gText('pw', mid - gap, 12, `women · ${S.women}`, { align: 'right', bold: true, fill: '#1F3A2B', size: W < 420 ? 11 : 13 }));
      els.push(gText('pm', mid + gap, 12, `men · ${S.men}`, { align: 'left', bold: true, fill: RED, size: W < 420 ? 11 : 13 }));
      return { ...baseScatter(W, H), series: [{ type: 'scatter', data }], graphic: setGraphics(ch, els) };
    }
  };

  // When the leaf goes in → when the milk goes in, as a flow
  const FLOWK = {}; RS.forEach(r => { if (r.milk > 0 && r.st.milk != null && r.st.tea != null) { const k = r.st.tea + '>' + r.st.milk; FLOWK[k] = (FLOWK[k] || 0) + 1; } });
  CH.flow = {
    label: 'left: when the leaf goes in · right: when the milk goes in · width = readers',
    you: R => R.milk > 0 && R.st.milk != null && R.st.tea != null ? `Your path, leaf at <b>${L.stage[R.st.tea]}</b> and milk at <b>${L.stage[R.st.milk]}</b>, is shared by <b>${FLOWK[R.st.tea + '>' + R.st.milk] || 0}</b> readers.` : '',
    steps: [{ st: 'flow', k: () => kfig(S.milkFirst, 'put the milk in before the leaf'), h: () => `Follow the red: milk first. The brown bands are leaf first (<b>${S.teaFirst}</b>), and grey is both at once (<b>${S.together}</b>).`,
      why: ['Puts the milk in first', 'Puts the leaf in first'],
      picks: [r => r.milk > 0 && r.st.milk != null && r.st.milk < r.st.tea, r => r.milk > 0 && r.st.milk != null && r.st.tea < r.st.milk] }],
    draw(ch, st, W, H) {
      const nodes = [], links = [], R = meR(), small = W < 420;
      [0, 1, 2, 3].forEach(i => nodes.push({ name: 'L' + i, lab: 'leaf · ' + L.stage[i], itemStyle: { color: '#6B3A1E', borderColor: INK }, label: { position: 'left' } }));
      [0, 1, 2, 4].forEach(i => nodes.push({ name: 'M' + i, lab: 'milk · ' + L.stage[i], itemStyle: { color: '#F4ECDC', borderColor: INK }, label: { position: 'right' } }));
      Object.entries(FLOWK).forEach(([k, v]) => { const [t, m] = k.split('>').map(Number); if (t > 3) return;
        const mine = R.st && R.milk > 0 && R.st.tea === t && R.st.milk === m;
        links.push({ source: 'L' + t, target: 'M' + m, value: v, t, m, lineStyle: { color: mine ? RED : m < t ? RED : t < m ? '#8A5A33' : '#9C9284', opacity: mine ? .85 : m < t ? .55 : .3, borderColor: mine ? INK : 'none' } }); });
      return { animationDurationUpdate: 800, tooltip: { ...TT, trigger: 'item', formatter: p => p.dataType === 'edge' ? `<b>${p.data.value}</b> readers put the leaf in at <b>${L.stage[p.data.t]}</b> and the milk at <b>${L.stage[p.data.m]}</b>.` : `${p.data.lab}: <b>${p.value}</b>` },
        series: [{ type: 'sankey', left: small ? 70 : 130, right: small ? 70 : 130, top: 12, bottom: 12, nodeWidth: small ? 10 : 16, nodeGap: small ? 10 : 16, draggable: false, layoutIterations: 0, emphasis: { focus: 'adjacency' },
          label: { fontFamily: FELL, fontSize: small ? 11 : 14, color: INK, formatter: p => p.data.lab.replace(' · ', small ? '\n' : ' · ') }, data: nodes, links }] };
    }
  };

  // Which spices share a pan: a web of icons, line width = readers who use both
  const WEB = S.spiceList.slice(0, 10), PAIRS = {};
  RS.forEach(r => { const e = r.extras.filter(s => WEB.includes(s)); e.forEach((a, i) => e.slice(i + 1).forEach(b => { const k = [a, b].sort().join('+'); PAIRS[k] = (PAIRS[k] || 0) + 1; })); });
  S.pairTop = Object.entries(PAIRS).sort((a, b) => b[1] - a[1])[0];
  CH.pairs = {
    label: 'each line joins two spices used together · thicker = more kitchens',
    you: R => R.extras.length >= 2 ? (k => `Your pair, <b>${k.split('+').map(s => L.spice[s]).join(' + ')}</b>, shares <b>${PAIRS[k] || 0}</b> pans.`)([R.extras[0], R.extras[1]].sort().join('+')) : '',
    steps: [{ st: 'web', k: () => kfig(S.pairTop[1], `put ${S.pairTop[0].split('+').map(s => L.spice[s]).join(' and ')} in together`), h: () => `Ginger is the hub nearly everything else hangs off. Tulsi, mint and lemongrass make a little herbal corner of their own.`,
      why: ['Uses ginger and cardamom together', 'Adds tulsi or lemongrass'],
      picks: [r => r.extras.includes('ginger') && r.extras.includes('cardamom'), r => r.extras.includes('tulsi') || r.extras.includes('lemongrass')] }],
    draw(ch, st, W, H) {
      const R = meR(), mx = Math.max(...WEB.map(s => S.sp[s])), pm = Math.max(...Object.values(PAIRS)), small = W < 420, base = Math.min(W, H);
      const nodes = WEB.map(s => ({ name: s, value: S.sp[s], symbol: svgURI(ICON(s)), symbolSize: (small ? 22 : 30) + (base / 9) * Math.sqrt(S.sp[s] / mx),
        label: { show: true, formatter: `${L.spice[s].replace('chai masala', 'masala')} · ${S.sp[s]}`, position: 'bottom', distance: 2, fontFamily: FELL, fontSize: small ? 11 : 13.5, color: R.extras.includes(s) ? RED : INK } }));
      const links = Object.entries(PAIRS).map(([k, v]) => { const [a, b] = k.split('+'), mine = R.extras.includes(a) && R.extras.includes(b), top = k === S.pairTop[0];
        return { source: a, target: b, value: v, lineStyle: { width: 1 + 13 * v / pm, color: mine ? RED : top ? '#7A2318' : '#8D7B62', opacity: mine || top ? .8 : .35, curveness: .18 } }; });
      return { animationDurationUpdate: 800, tooltip: { ...TT, trigger: 'item', formatter: p => p.dataType === 'edge' ? `<b>${p.data.value}</b> kitchens use ${L.spice[p.data.source]} and ${L.spice[p.data.target]}` : `${L.spice[p.name]}: <b>${p.value}</b> readers` },
        series: [{ type: 'graph', layout: 'circular', circular: { rotateLabel: false }, top: small ? 30 : 46, bottom: small ? 40 : 56, left: small ? 40 : 90, right: small ? 40 : 90, roam: false, data: nodes, links, emphasis: { focus: 'adjacency' } }] };
    }
  };

  // What it's poured into: a bar made of the vessels themselves
  CH.vessels = {
    label: 'one vessel per reader · each tinted by that reader’s chai',
    you: R => R.vessel ? `You drink from a <b>${L.vessel[R.vessel]}</b>, like <b>${S.vessel[R.vessel]}</b> readers.` : '',
    steps: [{ st: 'vessel', k: () => kfig(S.vessel.mug, 'drink from a mug'), h: () => `<b>${S.vessel.cup}</b> hold out for a cup and saucer, <b>${S.vessel.tumbler}</b> a steel tumbler and just <b>${S.vessel.glass}</b> a cutting glass.`,
      why: ['Drinks from a cup and saucer', 'Drinks from a glass or steel tumbler'],
      picks: [r => r.vessel === 'cup', r => r.vessel === 'glass' || r.vessel === 'tumbler'] }],
    draw(ch, st, W, H) {
      const order = ['mug', 'cup', 'tumbler', 'glass'], R = meR(), left = W < 420 ? 74 : 130, small = W < 420;
      const rows = order.map(v => byShade(RS.filter(r => r.vessel === v)).reverse());
      const rh = (H - 16) / order.length, d = packD(rows.map(g => g.length), W - left - 40, rh - 10, 34);
      const data = [], els = [];
      rows.forEach((g, i) => {
        const list = R.vessel === order[i] && R.milk != null ? g.concat([R]) : g;
        list.forEach((r, k) => { const [x, y] = packAt(k, list.length, d, left, 8 + i * rh + 5, W - left - 40, rh - 10, 'left'); data.push(cupPt(r, x, y, d * 1.15, { sym: VSYM[order[i]] })); });
        els.push(gText('vl' + i, left - 12, 8 + (i + .5) * rh - 8, L.vessel[order[i]].replace('cup and saucer', small ? 'cup & saucer' : 'cup and saucer'), { align: 'right', serif: true, fill: INK, size: small ? 12 : 16 }));
        els.push(gText('vn' + i, left - 12, 8 + (i + .5) * rh + 10, String(g.length), { align: 'right', bold: true, fill: i === 0 ? RED : TXT, size: small ? 12 : 15 }));
        if (i) els.push(gRect('vr' + i, 0, 8 + i * rh, W, 0.5));
      });
      return { ...baseScatter(W, H), series: [{ type: 'scatter', data }], graphic: setGraphics(ch, els) };
    }
  };

  // ---------- The chapters, re-cut around the most interesting findings ----------
  const [TA, TB] = S.topCell[0].split('-').map(Number);
  CH.pour.steps = [
    { st: 'all', k: () => kfig(S.uniqueSeq, 'of the recipes are one of a kind'), h: () => `Each glass is coloured by its recipe, from milky cream to near-black. Nobody chose these shades: the milk, the leaf and the boiling did.` },
    { st: 'milk', k: () => kfig(S.mostlyWater, 'make a cup that is mostly water'), h: () => `Half milk is the biggest single group. Only <b>${S.milk[5]}</b> keep water out of the pan altogether, tapri-style.`,
      why: ['Takes it black: no milk at all', 'All milk: no water at all'],
      picks: [r => r.milk === 0, r => r.milk === 5] }
  ];
  CH.sequence.steps = [
    { st: 'common', k: () => kfig(S.common, 'put the leaf and the milk in together, at the boil'), h: () => `Each row is an ingredient; each column is the moment it goes in. The most common method is still only one kitchen in five.` },
    { st: 'boils', k: () => kfig(S.multi, 'let it rise three times or more, or simmer'), h: () => `Once the milk is in, <b>${S.boil[1]}</b> stop at the first boil. The rest let the pan rise and fall, some for ten minutes.`,
      why: ['Boils it three times or more', 'Stops at the first boil'],
      picks: [r => r.milk > 0 && r.boils >= 3, r => r.milk > 0 && r.boils === 1] }
  ];
  CH.leaf.steps = [
    { st: 'top', k: () => kfig(S.topCell[1], 'share the busiest square'), h: () => `Across: tea per cup. Down: how long it stays in. The busiest square is <b>${L.amt[TA]}</b> for <b>${L.brew[TB]}</b>.` },
    { st: 'kadak', k: () => kfig(S.kadak, 'use 1½ tsp or more, for five minutes or more'), h: () => `Kadak, by any definition. At the other end, <b>${S.quick}</b> strain within a minute.`,
      why: ['Kadak: lots of leaf, brewed long', 'Strains within a minute'],
      picks: [r => (r.amt === 3 || r.amt === 4) && (r.brew === 3 || r.brew === 4), r => r.brew === 0] }
  ];
  CH.larder.steps = [
    { st: 'count', k: () => kfig(S.sp.ginger, 'add ginger: two in three kitchens'), h: () => `Cardamom comes next (<b>${S.sp.cardamom}</b>), and then the spice box thins out fast. <b>${S.plain}</b> add nothing at all.` },
    { st: 'late', k: () => kfig(S.cardOff, 'add cardamom only after the heat is off', S.sp.cardamom), h: () => `Most spices go in early, before the leaf and milk can mute them. A few hold the cardamom back for its fragrance.`,
      why: ['Adds cardamom after the flame is off', 'Puts ginger in the cold pan'],
      picks: [r => r.extras.includes('cardamom') && r.st.cardamom === 3, r => r.extras.includes('ginger') && r.st.ginger === 0] }
  ];
  CH.cup.steps = [
    { st: 'sweet', k: () => kfig(S.noSugar, 'take no sugar, the biggest group'), h: () => `<b>${S.sugar}</b> use sugar and <b>${S.jaggery}</b> jaggery. Most who sweeten wait until it’s in the cup.` }
  ];

  // Each step brings two readers whose glasses are marked on the chart; nobody appears twice.
  const usedR = new Set();
  const goodQ = r => { const q = quoteOf(r); return q.length > 30 && q.length < 240; };
  const rscore = r => (QMAP[r.id] ? 4 : 0) + (goodQ(r) ? 2 : quoteOf(r) ? .5 : 0) + hash(r.i * 3.1);
  const pickReaders = fs => fs.map(f => { const pool = RS.filter(r => !usedR.has(r.id) && f(r)).sort((a, b) => rscore(b) - rscore(a)); if (pool[0]) usedR.add(pool[0].id); return pool[0]; });

  // A fact tile: an icon, a number, a few words
  const FACT = (key, icon, n, cap) => ({ key: 'fact:' + key, cls: 'c-fact', render: () => `<div class="fact"><span class="fi">${icon.startsWith('<') ? icon : ICON(icon)}</span><b>${typeof n === 'function' ? n() : n}</b><small>${cap}</small></div>` });
  // two icons with an arrow between them: "this, then that"
  const orderIc = (a, b) => `<svg class="ic" viewBox="0 0 104 48" aria-hidden="true"><g>${ICON.g(a)}</g><path d="M50 24 h10 m-4 -5 l5 5 l-5 5" fill="none" stroke="#A8321F" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><g transform="translate(56 0)">${ICON.g(b)}</g></svg>`;
  const vIcon = (t, milk = 3) => A.vessel({ milk, teas: ['ctc'], amt: 2, brew: 2, boils: 2, st: {}, extras: [], forms: {} }, { type: t, still: true, emptyLabel: false });

  // ---------- Scenes ----------
  // d: 6 columns × 4 rows (tablet and up) · m: 4 columns × 6 rows (phones). Same letter = one cell; '.' = an empty box.
  // Every scene gets its own arrangement, so the sheet keeps rearranging itself as you read.
  const SC = [];
  const LAY = {
    titleL: { d: ['T T c c c c', 'T T c c c c', 'x x c c c c', 'x x c c c c'], m: ['T T T T', 'x x x x', 'c c c c', 'c c c c', 'c c c c', 'c c c c'] },
    titleR: { d: ['c c c c T T', 'c c c c T T', 'c c c c x x', 'c c c c x x'], m: ['T T T T', 'x x x x', 'c c c c', 'c c c c', 'c c c c', 'c c c c'] },
    titleTop: { d: ['T T T x x x', 'c c c c c c', 'c c c c c c', 'c c c c c c'], m: ['T T T T', 'x x x x', 'c c c c', 'c c c c', 'c c c c', 'c c c c'] },
    titleBL: { d: ['x x c c c c', 'x x c c c c', 'T T c c c c', 'T T c c c c'], m: ['x x x x', 'c c c c', 'c c c c', 'c c c c', 'c c c c', 'T T T T'] },
    sideL: { d: ['x x f c c c', 'x x f c c c', 'v w g c c c', 'v w g c c c'], m: ['x x x x', 'c c c c', 'c c c c', 'c c c c', 'v v w w', 'v v w w'] },
    sideR: { d: ['c c c c x x', 'c c c c x x', 'c c c c f v', 'c c c c g v'], m: ['c c c c', 'c c c c', 'c c c c', 'x x x x', 'v v w w', 'v v w w'] },
    under: { d: ['c c c c c c', 'c c c c c c', 'x x f g v w', 'x x f g v w'], m: ['x x x x', 'c c c c', 'c c c c', 'c c c c', 'v v w w', 'v v w w'] },
    frame: { d: ['v x x x x w', 'v c c c c w', 'v c c c c w', 'f c c c c g'], m: ['x x x x', 'c c c c', 'c c c c', 'c c c c', 'v v w w', 'v v w w'] },
    wideL: { d: ['c c c x x x', 'c c c x x x', 'c c c v w f', 'c c c v w g'], m: ['x x x x', 'x x x x', 'c c c c', 'c c c c', 'v v w w', 'v v w w'] }
  };
  const HEADS = { who: 'Who we asked', pyramid: 'Who we asked', pour: 'I · No two cups alike', sequence: 'II · The boil debate', flow: 'II · The boil debate', leaf: 'III · How strong is strong', larder: 'IV · The spice box', pairs: 'IV · The spice box', cup: 'V · At the table', vessels: 'V · At the table' };
  const CUE = ch => ({ key: 'cue:' + ch, cls: 'c-cue', render: () => `<div class="cue-in"><span class="cue-arrow" aria-hidden="true">↓</span><span>Look at the chart first.<br>Keep scrolling for what it says.</span></div>` });
  function scene(ch, i, lay, o = {}) {
    const s = CH[ch].steps[i], L0 = LAY[lay], cells = { c: CHART(ch), x: STEP(ch, i), ...(o.cells || {}) };
    if (o.title) cells.T = TITLE(o.title);
    let feat = [];
    if (L0.d.join(' ').includes('v')) { const rs = pickReaders(s.picks || []); cells.v = RCARD(rs[0], (s.why || [])[0]); cells.w = RCARD(rs[1], (s.why || [])[1]); feat = rs.filter(Boolean).map(r => r.id); }
    if (o.title) SC.push({ id: ch + '-' + i + '-in', h: 90, head: HEADS[ch], d: L0.d, m: L0.m, chart: { ch, step: i }, cells: { ...cells, x: CUE(ch) }, feat });
    SC.push({ id: ch + '-' + i, h: 175, head: HEADS[ch], d: L0.d, m: L0.m, chart: { ch, step: i }, cells, feat });
  }

  // 1 · a glass, and everything India puts in it
  const orbCells = {}; ORBS.forEach((k, i) => orbCells['abcdefghijklmnop'[i]] = ORB(k));
  SC.push({ id: 'hero', h: 160, head: 'What goes in', hero: 'empty',
    d: ['a b Y Y c d', 'e f Y Y g h', 'i j x x k l', 'm n x x o p'],
    m: ['a b c d', 'e Y Y f', 'g Y Y h', 'i x x j', 'k x x l', 'm n o p'],
    cells: { Y: HERO, x: BIG('all', 'Indians put all kinds of things in their tea.', () => `These are the sixteen most common, from ${N} readers’ recipes.`), ...orbCells } });
  // 2 · it all goes in
  SC.push({ id: 'hero-in', h: 150, head: 'What goes in', hero: 'full', flow: true,
    d: ['x x Y Y M M', 'x x Y Y M M', 'x x Y Y M M', 'x x Y Y M M'],
    m: ['Y Y Y Y', 'Y Y Y Y', 'Y Y Y Y', 'x x x x', 'x x x x', 'M M M M'],
    cells: { Y: HERO, x: BIG('yours', 'But maybe yours is different.', () => `Scroll on to see how ${N} readers make theirs. Or make your own first, and find the kitchens that make it like you.`), M: CTA } });
  // 3 · the readers
  scene('who', 0, 'wideL', { cells: { f: FACT('men', 'person', S.men, 'men'), g: FACT('women', 'woman', S.women, 'women') } });
  scene('pyramid', 0, 'under', { cells: { f: FACT('abroad', 'globe', S.abroad, 'make it abroad'), g: FACT('over55', 'elder', S.over55, 'are 55 or older') } });
  // I
  scene('pour', 0, 'titleL', { title: 'pour' });
  scene('pour', 1, 'sideR', { cells: { f: FACT('water', 'water', S.mostlyWater, 'mostly water'), g: FACT('allmilk', 'milk', S.milk[5], 'all milk, no water') } });
  // II
  scene('sequence', 0, 'titleR', { title: 'sequence' });
  scene('flow', 0, 'frame', { cells: { f: FACT('milkfirst', orderIc('milk', 'ctc'), S.milkFirst, 'milk first, then leaf'), g: FACT('teafirst', orderIc('ctc', 'milk'), S.teaFirst, 'leaf first, then milk') } });
  scene('sequence', 1, 'sideL', { cells: { f: FACT('once', 'once', S.boil[1], 'boil it just once'), g: FACT('simmer', 'simmer', S.boil[4], 'let it simmer') } });
  // III
  scene('leaf', 0, 'titleTop', { title: 'leaf' });
  scene('leaf', 1, 'under', { cells: { f: FACT('kadak', 'strong', S.kadak, 'make it kadak'), g: FACT('quick', 'quick', S.quick, 'strain within a minute') } });
  // IV
  scene('larder', 0, 'titleBL', { title: 'larder' });
  scene('pairs', 0, 'frame', { cells: { f: FACT('ginger', 'ginger', S.sp.ginger, 'use ginger'), g: FACT('plain', 'nospice', S.plain, 'add no spice at all') } });
  scene('larder', 1, 'sideR', { cells: { f: FACT('cardoff', orderIc('stage3', 'cardamom'), S.cardOff, 'cardamom after the flame'), g: FACT('cardamom', 'cardamom', S.sp.cardamom, 'use cardamom') } });
  // V
  scene('cup', 0, 'titleR', { title: 'cup' });
  scene('vessels', 0, 'wideL', { cells: { f: FACT('mug', vIcon('mug'), S.vessel.mug, 'mugs'), g: FACT('glass', vIcon('glass'), S.vessel.glass, 'cutting glasses') } });
  // the end: yours, and more readers to steal from
  const endR = Q.end1.concat(Q.end2).map(([id]) => byId(id)).filter(r => r && !usedR.has(r.id));
  RS.filter(r => !usedR.has(r.id) && goodQ(r) && !endR.includes(r)).sort((a, b) => rscore(b) - rscore(a)).forEach(r => { if (endR.length < 6) endR.push(r); });
  const endCells = {}; endR.forEach((r, i) => endCells[String(i + 1)] = RCARD(r, 'In their own words'));
  SC.push({ id: 'end', h: 180, head: 'Your chai', hero: 'you',
    d: ['x x Y Y M M', 'x x Y Y M M', '1 2 3 4 5 6', '1 2 3 4 5 6'],
    m: ['Y Y M M', 'Y Y M M', 'x x x x', '1 1 2 2', '1 1 2 2', '1 1 2 2'],
    cells: { Y: HERO, M: CTA, x: BIG('end', 'Every kitchen is quietly certain its tea is the correct one.', () => `Yours too. Make it, name it, and send the card to whoever at home makes it “wrong”.`), ...endCells } });

  // ---------- The sheet engine ----------
  const grid = $('shGrid'), svg = $('shLines'), wrap = $('sheetWrap');
  const DIM = { d: { cols: 6, rows: 4 }, m: { cols: 4, rows: 6 } };
  let mode = innerWidth < 700 ? 'm' : 'd';
  const cur = {};           // key -> { el, inner, rect, spec }
  let curLines = {};        // key -> <line>
  let curIdx = -2, target = -3, busy = false;
  const INTRO = 6; // a breath after the sheet pins, before the grid draws // vh of scrolling for the opening: header lifts away, your pan and the running head appear // vh of scrolling over which the opening lifts away; the grid starts drawing at the end of it
  const STARTS = []; { let acc = INTRO; SC.forEach(s => { STARTS.push(acc); acc += s.h; }); wrap.style.height = (acc + 100) + 'vh'; }

  function parse(rows) {
    const R = {};
    rows.forEach((row, y) => row.trim().split(/\s+/).forEach((id, x) => {
      if (id === '.') id = '.' + x + '_' + y;
      const r = R[id];
      if (!r) R[id] = { x, y, w: 1, h: 1 }; else { r.w = Math.max(r.w, x - r.x + 1); r.h = Math.max(r.h, y - r.y + 1); }
    }));
    return R;
  }
  function linesFor(layout) {
    const H = new Set(), V = new Set();
    Object.values(layout).forEach(r => {
      for (let i = 0; i < r.w; i++) { H.add((r.x + i) + ',' + r.y); H.add((r.x + i) + ',' + (r.y + r.h)); }
      for (let j = 0; j < r.h; j++) { V.add(r.x + ',' + (r.y + j)); V.add((r.x + r.w) + ',' + (r.y + j)); }
    });
    const out = {};
    const merge = (set, horiz) => {
      const by = {};
      set.forEach(s => { const [a, b] = s.split(',').map(Number); const k = horiz ? b : a, v = horiz ? a : b; (by[k] = by[k] || []).push(v); });
      Object.entries(by).forEach(([k, vs]) => { vs.sort((p, q) => p - q); let s0 = vs[0], prev = vs[0];
        for (let i = 1; i <= vs.length; i++) { if (vs[i] === prev + 1) { prev = vs[i]; continue; } const key = (horiz ? 'h' : 'v') + k + ':' + s0 + '-' + (prev + 1); out[key] = horiz ? [s0, +k, prev + 1, +k] : [+k, s0, +k, prev + 1]; s0 = prev = vs[i]; } });
    };
    merge(H, true); merge(V, false);
    return out;
  }
  const unit = () => ({ ux: grid.clientWidth / DIM[mode].cols, uy: grid.clientHeight / DIM[mode].rows });
  const px = r => { const { ux, uy } = unit(); return { left: r.x * ux, top: r.y * uy, width: r.w * ux, height: r.h * uy }; };
  const sameRect = (a, b) => a && b && a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h;
  const NS = 'http://www.w3.org/2000/svg';
  function placeLine(el, seg) { const { ux, uy } = unit(); el.setAttribute('x1', seg[0] * ux); el.setAttribute('y1', seg[1] * uy); el.setAttribute('x2', seg[2] * ux); el.setAttribute('y2', seg[3] * uy); }

  // Text never scrolls inside a box: it steps down in size until it fits.
  function fit(root) {
    root.querySelectorAll('[data-fit]').forEach(el => {
      el.style.fontSize = '';
      let fs = el.dataset.fit === 'grow' ? (mode === 'm' ? +(el.dataset.mmax || 21) : +(el.dataset.max || 32)) : parseFloat(getComputedStyle(el).fontSize), n = 0;
      el.style.fontSize = fs + 'px';
      while ((el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1) && fs > 9 && n++ < 70) { fs -= .5; el.style.fontSize = fs + 'px'; }
    });
  }
  function applyAttrs(entry) {
    const a = entry.spec.attrs ? entry.spec.attrs() : {};
    Object.entries(a).forEach(([k, v]) => entry.inner.setAttribute(k, v));
  }
  function paint(entry) { entry.inner.innerHTML = entry.spec.render(); applyAttrs(entry); fit(entry.inner); }
  const shapeCls = e => { const r = px(e.rect); e.inner.classList.toggle('wide-x', mode === 'd' && r.width > r.height * 2.6); };
  function makeCell(key, spec, rect) {
    const el = document.createElement('div');
    el.className = 'cell';
    Object.assign(el.style, Object.fromEntries(Object.entries(px(rect)).map(([k, v]) => [k, v + 'px'])));
    const inner = document.createElement(spec.tag || 'div');
    if (spec.tag === 'button') inner.type = 'button';
    inner.className = 'cell-in ' + (spec.cls || '');
    if (spec.pad0) inner.style.padding = '0';
    el.appendChild(inner);
    grid.appendChild(el);
    const entry = { el, inner, rect, spec };
    shapeCls(entry);
    paint(entry);
    if (spec.mount) spec.mount(el);
    return entry;
  }

  function ledeTarget() {
    const art = cur.lede && cur.lede.inner.querySelector('.lede-art'); if (!art) return null;
    const r = art.getBoundingClientRect(); let w = r.width, h = w * 9 / 16; if (h > r.height) { h = r.height; w = h * 16 / 9; }
    return { left: r.left + (r.width - w) / 2, top: r.top + (r.height - h) / 2, width: w, height: h };
  }
  // Changing scenes: old cells fade, rules undraw and redraw, new cells are inked in from the left.
  // The order things arrive in a scene: the chapter, then the data, then what it means, then the people.
  let nFact = 0, nCard = 0;
  const buildAt = (key, a) => { if (a === 0) nFact = nCard = 0;
    const t = key.split(':')[0];
    return t === 'title' ? 0 : t === 'chart' ? .15 : t === 'fact' ? .75 + .15 * nFact++ : t === 'step' ? 1.05 : t === 'rc' ? 1.45 + .2 * nCard++ : a * .06; };
  const INK_FROM = 'inset(0% 100% 0% 0%)', INK_TO = 'inset(0% 0% 0% 0%)';
  function go(idx) {
    busy = true;
    const first = curIdx < 0;
    const sc = idx >= 0 ? SC[idx] : null;
    const layout = sc ? parse(sc[mode]) : {};
    const want = {};
    HERO_MODE = sc && sc.hero || 'empty';
    FEAT = new Set(sc && sc.feat || []);
    if (!sc) { const l0 = parse(SC[0][mode]); want.hero = { rect: l0.Y, spec: HERO }; }
    if (sc) Object.entries(layout).forEach(([id, rect]) => { if (id[0] === '.') return; const spec = sc.cells[id]; if (!spec) { console.warn('no cell for', id, sc.id); return; } want[spec.key] = { rect, spec }; });
    const tl = gsap.timeline({ onComplete: () => { busy = false; curIdx = idx; if (target !== idx) go(target); } });
    let n = 0;
    // Going forward into a 'flow' scene, the ingredients around the glass fly into it before their boxes go.
    const flowing = !!(sc && sc.flow && curIdx >= 0 && curIdx < idx && cur.hero && layout.Y);
    const gr = grid.getBoundingClientRect(), hy = flowing ? px(layout.Y) : null;
    Object.keys(cur).forEach(key => {
      if (want[key]) return;
      const e = cur[key]; delete cur[key]; e.leaving = true;
      const ic = flowing && key.startsWith('orb:') && e.inner.querySelector('.c-art .ic');
      if (ic) {
        const f = ic.getBoundingClientRect(), fly = ic.cloneNode(true);
        fly.classList.add('fly'); Object.assign(fly.style, { left: f.left + 'px', top: f.top + 'px', width: f.width + 'px', height: f.height + 'px' });
        document.body.appendChild(fly);
        const dx = gr.left + hy.left + hy.width / 2 - (f.left + f.width / 2), dy = gr.top + hy.top + hy.height * .55 - (f.top + f.height / 2);
        tl.to(fly, { x: dx, y: dy, scale: .2, rotation: (hash(n) - .5) * 300, duration: .75, ease: 'power2.in', onComplete: () => fly.remove() }, .02 + n * .035);
        tl.to(e.inner, { autoAlpha: 0, duration: .2, onComplete: () => e.el.remove() }, (n++) * .01);
        return;
      }
      tl.to(e.inner, { autoAlpha: 0, y: -6, duration: .22, ease: 'power1.in', onComplete: () => { if (e.spec.unmount) e.spec.unmount(); e.el.remove(); } }, (n++) * .01);
    });
    const nl = sc ? linesFor(layout) : {};
    Object.keys(curLines).forEach(k => { if (nl[k]) return; const el = curLines[k]; delete curLines[k]; tl.to(el, { attr: { 'stroke-dashoffset': -1 }, duration: .3, ease: 'power1.in', onComplete: () => el.remove() }, 0); });
    let m = 0;
    Object.entries(nl).forEach(([k, seg]) => {
      if (curLines[k]) { placeLine(curLines[k], seg); return; }
      const el = document.createElementNS(NS, 'line'); el.setAttribute('pathLength', '1'); el.setAttribute('stroke-dasharray', '1 1'); el.setAttribute('stroke-dashoffset', '1');
      placeLine(el, seg); svg.appendChild(el); curLines[k] = el;
      tl.to(el, { attr: { 'stroke-dashoffset': 0 }, duration: first ? 1.1 : .7, ease: 'power2.inOut' }, (first ? .05 : .2) + (m++) * (first ? .05 : .02));
    });
    let a = 0;
    Object.entries(want).forEach(([key, w]) => {
      const e = cur[key];
      if (e) {
        e.spec = w.spec;
        if (!sameRect(e.rect, w.rect)) { e.rect = w.rect; shapeCls(e); const ck = key.startsWith('chart:') ? key.slice(6) : null; tl.to(e.el, { ...px(w.rect), duration: .8, ease: 'power3.inOut', onUpdate: () => { if (ck && LIVE[ck]) LIVE[ck].chart.resize(); }, onComplete: () => { fit(e.inner); if (ck && LIVE[ck]) { LIVE[ck].chart.resize(); drawChart(ck); } } }, .1); }
        if (w.spec.live && key === 'hero' && flowing) tl.call(() => { paint(e); const v = e.inner.querySelector('.vessel'); if (v) gsap.from(v, { scale: .94, transformOrigin: '50% 100%', duration: .6, ease: 'back.out(3)' }); }, null, .02 + n * .035 + .6);
        else if (w.spec.live) paint(e);
        return;
      }
      const ne = makeCell(key, w.spec, w.rect);
      cur[key] = ne;
      if (!sc) { gsap.set(ne.inner, { autoAlpha: 1 }); return; }
      const at = (first ? .5 : .3) + buildAt(key, a++);
      if (key.startsWith('chart:')) { gsap.set(ne.inner, { clipPath: INK_FROM, autoAlpha: 1 }); tl.to(ne.inner, { clipPath: INK_TO, duration: .8, ease: 'power2.inOut', clearProps: 'clipPath' }, at); }
      else { gsap.set(ne.inner, { autoAlpha: 0, y: 10 }); tl.to(ne.inner, { autoAlpha: 1, y: 0, duration: .7, ease: 'power2.out', clearProps: 'transform' }, at); }
    });
    $('sheet').classList.toggle('at-intro', !sc);
    if (sc && sc.chart) { const lv = LIVE[sc.chart.ch]; if (lv) { lv.step = sc.chart.step; tl.call(() => drawChart(sc.chart.ch), null, .3); } }
    $('shPage').textContent = String(Math.max(0, idx) + 1).padStart(2, '0');
    $('shLeft').textContent = sc ? sc.head : '';
  }

  // What's in the pan right now, as one stacked bar: liquids first, then the leaf, the sweetener and each spice.
  const MILKF = [0, .1, .25, .5, .75, 1], AMTF = [.035, .045, .06, .075, .09, .06, .055];
  function compSegs(t) {
    const inBy = st => t >= 4 || st == null || st <= t;
    const segs = [];
    const milkIn = ME.milkOn && (ME.milkIn == null ? true : inBy(ME.milkIn));
    const share = ME.milkOn ? MILKF[ME.milkShare == null ? 3 : ME.milkShare] : 0;
    const water = ME.water ? (milkIn ? 1 - share : 1) : 0, milk = milkIn ? (ME.water ? share : 1) : 0;
    const solids = [];
    if (ME.teas.length && (ME.teaIn == null ? t >= 2 : inBy(ME.teaIn))) solids.push(['leaf', AMTF[ME.amt == null ? 2 : ME.amt], '#6B3A1E']);
    if (ME.sweet && inBy(ME.sweetIn)) solids.push([LAB[ME.sweet].toLowerCase(), .035, ME.sweet === 'sugar' ? '#FBF8F1' : ICON.col(ME.sweet)]);
    ME.extras.forEach(k => { if (inBy(ME.spiceSt[k])) solids.push([LAB[k].toLowerCase(), .018, ICON.col(k)]); });
    const solidSum = solids.reduce((a, b) => a + b[1], 0), liquid = Math.max(0, 1 - solidSum);
    if (water) segs.push(['water', water * liquid, '#9CCFDC']);
    if (milk) segs.push(['milk', milk * liquid, '#F6F1E6']);
    solids.forEach(x => segs.push(x));
    const total = segs.reduce((a, b) => a + b[1], 0);
    return total ? segs.map(([l, v, c]) => [l, v / total, c]) : [];
  }
  function onScroll() {
    if (mkOpen) return;
    const vh = innerHeight / 100;
    const pos = (scrollY - wrap.offsetTop) / vh;
    let idx = -1;
    if (pos >= STARTS[0]) { idx = 0; for (let i = 0; i < SC.length; i++) if (STARTS[i] <= pos) idx = i; }
    if (idx !== target) { target = idx; clearTimeout(settleT); settleT = setTimeout(() => { if (!busy && target !== curIdx) go(target); }, curIdx < 0 && idx <= 0 ? 0 : 420); }
  }
  let settleT;
  let ticking = false;
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; onScroll(); }); } }, { passive: true });
  function scrollToScene(id) { const i = SC.findIndex(s => s.id === id); if (i >= 0) scrollTo({ top: wrap.offsetTop + STARTS[i] * innerHeight / 100 + 4, behavior: 'smooth' }); }

  function relayout() {
    const nm = innerWidth < 700 ? 'm' : 'd';
    if (nm !== mode) { mode = nm; Object.values(cur).forEach(e => { if (e.spec.unmount) e.spec.unmount(); e.el.remove(); }); Object.keys(cur).forEach(k => delete cur[k]); Object.values(curLines).forEach(l => l.remove()); curLines = {}; const i = curIdx; curIdx = -2; busy = false; target = i; if (i >= -1) go(i); return; }
    const sc = SC[curIdx]; if (!sc) return;
    const layout = parse(sc[mode]);
    Object.entries(layout).forEach(([id, rect]) => { const spec = sc.cells[id]; const e = spec && cur[spec.key]; if (e) { e.rect = rect; gsap.set(e.el, px(rect)); fit(e.inner); } });
    const nl = linesFor(layout); Object.entries(nl).forEach(([k, seg]) => curLines[k] && placeLine(curLines[k], seg));
    Object.keys(LIVE).forEach(k => { LIVE[k].chart.resize(); drawChart(k); });
  }

  // ---------- State changes ----------
  function refresh() {
    Object.values(cur).forEach(e => {
      if (!e.spec.live || e.leaving) return;
      const ae = document.activeElement, sel = ae && e.inner.contains(ae) && ae !== e.inner ? ['act', 'k', 'f', 'v'].map(a => ae.dataset[a] != null ? `[data-${a}="${ae.dataset[a]}"]` : '').join('') : null;
      paint(e);
      if (sel) { const f = e.inner.querySelector(sel); if (f) f.focus({ preventScroll: true }); }
    });
    Object.keys(LIVE).forEach(drawChart);
  }

  // ---------- Lede (header, unchanged look) ----------
  // The lede: a kitchen counter drawn from the story's own pieces — your patila on the boil, the four vessels in
  // deepening shades of chai, and the larder spilled across the counter. No raster image.
  function ledeSVG() {
    const W = 1600, H = 900, ground = 830, ink = '#2A1E14';
    const nest = (svg, x, y, w, cls) => svg.replace(/<svg class="vessel[^"]*"[^>]*>/, `<svg class="${cls || 'lv'}" x="${x}" y="${y}" width="${w}" height="${w * 1.15}" viewBox="0 0 200 230" overflow="visible">`);
    const base = { milk: 3, teas: ['ctc'], amt: 2, brew: 2, st: {}, extras: [], boils: 2, forms: {} };
    let g = '';
    // the counter: a ruled edge, like the sheet
    g += `<line x1="40" x2="${W - 40}" y1="${ground}" y2="${ground}" stroke="${ink}" stroke-width="2.5"/><line x1="40" x2="${W - 40}" y1="${ground + 10}" y2="${ground + 10}" stroke="#8D7B62" stroke-width="1.2"/>`;
    // the larder, spilled on the left
    [['cinnamon', 115, 785, 2.8, -8], ['ginger', 265, 762, 3.4, 12], ['cardamom', 375, 800, 1.8, 70], ['cardamom', 410, 782, 1.7, 20], ['cardamom', 345, 812, 1.6, -30], ['clove', 440, 795, 1.7, 35],
     ['leaf', 175, 655, 2.6, -25], ['tulsi', 80, 620, 2.6, -10], ['ctc', 315, 665, 2.2, 0], ['sugar', 425, 690, 2, 8], ['pepper', 210, 800, 1.2, 0], ['saunf', 95, 720, 1.3, 15]]
      .forEach(([n, x, y, sc, r]) => g += `<g class="ls" transform="translate(${x} ${y}) rotate(${r}) scale(${sc}) translate(-24 -24)">${ICON.g(n)}</g>`);
    // a big glass of chai
    g += nest(A.vessel({ ...base, vessel: 'glass' }, { type: 'glass', colour: C.cellColour(2, 2), float: ['ginger', 'cardamom', 'tulsi'] }), 470, ground - 500 * 1.15 + 6, 500, 'lp');
    // four vessels, lightest to darkest
    [['glass', C.cellColour(1, 1)], ['cup', C.cellColour(2, 3)], ['mug', C.cellColour(3, 4)], ['tumbler', C.cellColour(4, 5)]]
      .forEach(([t, col], i) => g += nest(A.vessel({ ...base, vessel: t }, { type: t, colour: col }), 975 + i * 148, ground - 182 * 1.15 + 6, 182, 'lv'));
    // a little hand-written note on the counter
    g += `<text x="${W - 50}" y="${ground + 58}" text-anchor="end" font-family="Kalam, cursive" font-size="36" fill="#1D2C6B">${N} kitchens, ${S.uniqueSeq} recipes of their own</text>`;
    return `<svg viewBox="-80 90 1760 990" preserveAspectRatio="xMidYMid meet">${g}</svg>`;
  }
  function renderLede() {
    $('lede').innerHTML = ledeSVG();
    gsap.from('#lede .lp', { y: 40, autoAlpha: 0, duration: .8, ease: 'power3.out', delay: .15 });
    gsap.from('#lede .lv', { y: 30, autoAlpha: 0, duration: .6, ease: 'back.out(1.6)', stagger: .1, delay: .45 });
    gsap.from('#lede .ls', { autoAlpha: 0, scale: .6, transformOrigin: '50% 50%', duration: .5, stagger: .03, delay: .3 });
  }

  // ---------- The printed card ----------
  function openCard() {
    if (meEmpty()) { openMaker(); return; }
    $('nameIn').value = ME.name || '';
    $('nameIn').placeholder = meR().name || 'Chai';
    drawCard();
    $('modal').hidden = false; document.body.style.overflow = 'hidden'; placeName();
    gsap.fromTo('#card3d', { scale: .85, rotate: -4, autoAlpha: 0 }, { scale: 1, rotate: 0, autoAlpha: 1, duration: .6, ease: 'back.out(1.5)' });
    $('modalMsg').textContent = '';
    $('dlBtn').focus({ preventScroll: true });
  }
  // The name on the card is the only editable thing on it: an input laid exactly over where the title prints.
  function drawCard() {
    $('cw').innerHTML = A.card(meR(), N + 1, { segs: compSegs(4), hideName: true });
    placeName();
  }
  function placeName() {
    const inp = $('nameIn'), box = $('card3d'), k = box.clientHeight / 840;
    const nm = (inp.value || meR().name || 'Chai'), fs = nm.length > 18 ? 28 : nm.length > 12 ? 34 : 40;
    Object.assign(inp.style, { top: (548 - fs * .82) * k + 'px', height: fs * 1.12 * k + 'px', fontSize: fs * k + 'px' });
    // a blinking cursor at the end of the name, and a small pen, until it's tapped
    const cx = document.createElement('canvas').getContext('2d'); cx.font = `bold ${fs * k}px Reckless, Georgia, serif`;
    const tw = cx.measureText(nm).width, mid = box.clientWidth / 2;
    Object.assign($('nameCaret').style, { left: mid + tw / 2 + 3 * k + 'px', top: (548 - fs * .74) * k + 'px', height: fs * .9 * k + 'px' });
    Object.assign($('namePen').style, { left: mid + tw / 2 + 18 * k + 'px', top: (548 - fs * .6) * k + 'px', fontSize: Math.max(10, 13 * k) + 'px' });
  }
  function closeCard() { $('modal').hidden = true; document.body.style.overflow = ''; }

  // PNG export: fonts are inlined into the SVG so the canvas can draw them.
  let fontCss = null;
  const b64 = buf => { let bin = ''; const u = new Uint8Array(buf); for (let i = 0; i < u.length; i += 0x8000) bin += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000)); return btoa(bin); };
  async function embedFonts() {
    if (fontCss != null) return fontCss;
    try {
      const css = await (await fetch($('gfonts').href)).text();
      const blocks = [...css.matchAll(/\/\*\s*([\w-]+)\s*\*\/\s*(@font-face\s*{[^}]*})/g)].filter(m => m[1] === 'latin' || m[1] === 'devanagari').map(m => m[2]);
      const out = await Promise.all(blocks.map(async b => { const u = (b.match(/url\(([^)]+)\)/) || [])[1]; if (!u) return ''; const data = b64(await (await fetch(u)).arrayBuffer()); return b.replace(u, `data:font/woff2;base64,${data}`); }));
      fontCss = out.join('');
    } catch (e) { fontCss = ''; }
    return fontCss;
  }
  async function cardPNG() {
    const svgs = A.card(meR(), N + 1, { segs: compSegs(4) });
    const css = await embedFonts();
    const withFonts = svgs.replace(/^<svg([^>]*)>/, `<svg$1><style>${css}</style>`);
    const img = new Image();
    const url = URL.createObjectURL(new Blob([withFonts], { type: 'image/svg+xml' }));
    await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = url; });
    const cv = document.createElement('canvas'); cv.width = 1200; cv.height = 1680;
    cv.getContext('2d').drawImage(img, 0, 0, 1200, 1680);
    URL.revokeObjectURL(url);
    return new Promise(res => cv.toBlob(res, 'image/png'));
  }
  async function download() {
    $('modalMsg').textContent = 'Printing…';
    try {
      const blob = await cardPNG();
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'my-chai.png'; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      $('modalMsg').textContent = 'Saved.';
    } catch (e) { $('modalMsg').textContent = 'Couldn’t make the image here. Try a screenshot.'; }
  }
  async function share() {
    const R = meR(), f = C.formula(R), fk = C.family(R);
    const text = `My chai is ${C.FAM[fk].name}, shade ${(C.shade(R) || {}).code || '—'}.\n${f.seq}\nHow do you make yours?`;
    try {
      const blob = await cardPNG();
      const file = new File([blob], 'my-chai.png', { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], text, url: location.href }); return; }
      if (navigator.share) { await navigator.share({ text, url: location.href }); return; }
    } catch (e) { if (e && e.name === 'AbortError') return; }
    try { await navigator.clipboard.writeText(text + '\n' + location.href); $('modalMsg').textContent = 'Your formula and the link are copied.'; } catch (e) { $('modalMsg').textContent = 'Copy failed. Download the image instead.'; }
  }

  // ---------- Make your own: the back of the sheet ----------
  // The whole sheet flips over. It opens already filled: with a reader's recipe (from their card), with what you
  // made before, or with the most common answer to every question. One frame, a few tabs, every option an icon.
  const MODE = f => +modeOf(RS.map(f))[0];
  function defaultMe() {
    Object.assign(ME, { water: true, milkOn: true, milkShare: MODE(r => r.milk > 0 && r.milk < 5 ? r.milk : null), milkType: 'toned', milkIn: MODE(r => r.milk > 0 ? r.st.milk : null),
      teas: ['ctc'], amt: MODE(r => r.amt < 5 ? r.amt : null), teaIn: MODE(r => r.st.tea), brew: MODE(r => r.brew), boils: MODE(r => r.milk > 0 ? r.boils : null),
      sweet: 'sugar', sugarAmt: 'sugar2', sweetIn: MODE(r => r.sweet && r.sweet !== 'none' ? r.st.sweet : null), extras: ['ginger'], forms: { ginger: 'crushed' }, spiceSt: { ginger: 1 }, vessel: 'cup', touched: { sweet: true } });
  }
  function loadReader(r) {
    const sw = r.sweet || null;
    Object.assign(ME, { water: r.milk == null || r.milk < 5, milkOn: r.milk > 0, milkShare: r.milk > 0 ? r.milk : null, milkType: r.milkType || null, milkIn: r.milk > 0 ? r.st.milk : null,
      teas: r.teas.filter(t => TEAS.includes(t)), amt: r.amt, teaIn: r.st.tea, brew: r.brew, boils: r.boils,
      sweet: sw && sw.startsWith('sugar') ? 'sugar' : sw && sw !== 'none' ? sw : null, sugarAmt: sw && sw.startsWith('sugar') ? sw : 'sugar2', sweetIn: r.st.sweet,
      extras: r.extras.filter(s => SPICE_SHELF.includes(s)), forms: { ...r.forms }, spiceSt: {}, vessel: r.vessel && r.vessel !== 'other' ? r.vessel : 'glass', touched: { sweet: true } });
    if (!ME.teas.length && r.amt != null) ME.teas = ['ctc'];
    ME.extras.forEach(s => ME.spiceSt[s] = r.st[s] == null ? 1 : r.st[s]);
  }
  let mkOpen = false, mkLast = null, mkPrev = [], mkTab = 'pour', mkStart = null;
  const milkV = () => ME.milkOn ? (ME.water ? ME.milkShare : 5) : 0;
  const SWEET_OPTS = ['none', 'sugar1', 'sugar2', 'sugar3', 'jaggery', 'honey', 'free'];
  const curSweet = () => ME.sweet === 'sugar' ? ME.sugarAmt : ME.sweet || 'none';

  // Little pictures for every option
  const sv = (inner, vb = '0 0 48 48') => `<svg class="ic" viewBox="${vb}" aria-hidden="true">${inner}</svg>`;
  const spoons = a => { const n = [[.55], [.75], [1], [1, .6], [1, 1]][a] || [1];
    return sv(n.map((k, i) => `<g transform="translate(${(n.length > 1 ? (i ? 22 : 2) : 12) + 24 * (1 - k) / 2} ${24 * (1 - k) / 2 + (i ? 8 : 0)}) scale(${k * (n.length > 1 ? .62 : 1)})">${ICON.g('spoon')}</g>`).join('')); };
  const clockAt = b => { if (b === 5) return sv(`<circle cx="24" cy="24" r="17" fill="${C.cellColour(3, 2)}" stroke="#1A1208" stroke-width="1.8"/><path d="M14 30 q10 -14 20 0" fill="none" stroke="#FBF6EA" stroke-width="2.4" stroke-linecap="round"/><circle cx="24" cy="24" r="3" fill="#FBF6EA"/>`);
    const f = [1, 2, 4, 7.5, 12][b] / 12, a = f * 2 * Math.PI, x = 24 + 15 * Math.sin(a), y = 24 - 15 * Math.cos(a);
    return sv(`<circle cx="24" cy="24" r="17" fill="#FBF6EA" stroke="#1A1208" stroke-width="1.8"/>${f >= 1 ? `<circle cx="24" cy="24" r="15" fill="#A8321F" opacity=".35"/>` : `<path d="M24 24 L24 9 A15 15 0 ${f > .5 ? 1 : 0} 1 ${x.toFixed(1)} ${y.toFixed(1)}Z" fill="#A8321F" opacity=".35"/>`}<path d="M24 24 L${x.toFixed(1)} ${y.toFixed(1)}" stroke="#A8321F" stroke-width="2.2" stroke-linecap="round"/><circle cx="24" cy="24" r="2" fill="#1A1208"/>`); };
  const flames = b => b === 0 ? ICON('flameoff') : b === 4 ? ICON('simmer') : sv(Array.from({ length: b }, (_, i) => `<g transform="translate(${(48 - b * 17) / 2 + i * 17 - 4} 10) scale(.52)">${ICON.g('flame')}</g>`).join(''));
  const STAGE_IC = ['stage0', 'stage1', 'stage2', 'stage3', 'cup'];
  const cubes = n => sv(Array.from({ length: n }, (_, i) => `<g transform="translate(${(48 - n * 20) / 2 + i * 20 - 4} ${n > 1 ? 8 : 4}) scale(${n > 1 ? .6 : .8})">${ICON.g('sugar')}</g>`).join(''));
  const SWEET_IC = { none: ICON('nosugar'), sugar1: cubes(1).replace('scale(.8)', 'scale(.55)').replace('translate(10', 'translate(15'), sugar2: cubes(1), sugar3: cubes(2), jaggery: ICON('jaggery'), honey: ICON('honey'), free: ICON('free') };
  const milkGlass = v => A.vessel({ milk: v, teas: ['ctc'], amt: ME.amt == null ? 2 : ME.amt, brew: ME.brew == null ? 2 : ME.brew, boils: ME.boils == null ? 2 : ME.boils, st: {}, extras: [], forms: {} }, { type: 'glass', still: true, emptyLabel: false });

  const tile = (f, v, pic, lab, on, n) => `<button type="button" class="mk-t" data-act="mk-opt" data-f="${f}" data-v="${v}" aria-pressed="${on}"><span class="mk-ti">${pic}</span><span class="mk-tl">${lab}</span>${n != null ? `<sup>${n}</sup>` : ''}</button>`;
  const tog = k => `<button type="button" class="mk-t" data-act="mk-tog" data-k="${k}" aria-pressed="${inPot(k)}"><span class="mk-ti">${ICON(k)}</span><span class="mk-tl">${LAB[k]}</span><sup>${countFor(k)}</sup></button>`;
  const sect = (q, body, off) => `<div class="mk-q${off ? ' off' : ''}"><h4>${q}${off ? ` <i>· ${off}</i>` : ''}</h4><div class="mk-tiles">${body}</div></div>`;
  const TABS = [
    { id: 'pour', ic: 'milk', lab: 'Pour', body: () => sect('How much of it is milk?', [0, 1, 2, 3, 4, 5].map(v => tile('milk', v, milkGlass(v), L.milk[v], milkV() === v, S.milk[v])).join(''))
      + sect('When does the milk go in?', [0, 1, 2, 4].map(v => tile('milkIn', v, ICON(STAGE_IC[v]), L.stage[v], ME.milkOn && ME.milkIn === v, cnt(r => r.milk > 0 && r.st.milk === v))).join(''), ME.milkOn ? '' : 'no milk') },
    { id: 'leaf', ic: 'leaf', lab: 'Leaf', body: () => sect('Which tea? (pick any)', TEAS.map(tog).join(''))
      + sect('How much per cup?', [0, 1, 2, 3, 4].map(v => tile('amt', v, spoons(v), L.amt[v], ME.amt === v, cnt(r => r.amt === v))).join('')) },
    { id: 'boil', ic: 'flame', lab: 'Boil', body: () => sect('When does the leaf go in?', [0, 1, 2, 3].map(v => tile('teaIn', v, ICON(STAGE_IC[v]), L.stage[v], ME.teaIn === v, cnt(r => r.st.tea === v))).join(''))
      + sect('After the milk, how many boils?', [0, 1, 2, 3, 4].map(v => tile('boils', v, flames(v), L.boils[v], ME.milkOn && ME.boils === v, S.boil[v])).join(''), ME.milkOn ? '' : 'no milk') },
    { id: 'brew', ic: 'clock', lab: 'Brew', body: () => sect('How long before you strain?', [0, 1, 2, 3, 4, 5].map(v => tile('brew', v, clockAt(v), L.brew[v], ME.brew === v, cnt(r => r.brew === v))).join('')) },
    { id: 'spice', ic: 'ginger', lab: 'Spices', body: () => sect('What else goes in? (pick any)', SPICE_SHELF.map(tog).join('')) },
    { id: 'table', ic: 'cup', lab: 'Table', body: () => sect('Sweetened with', SWEET_OPTS.map(s => tile('sweet', s, SWEET_IC[s], sweetLab(s), curSweet() === s, cnt(r => r.sweet === s))).join(''))
      + sect('Drunk from', V_ORDER.map(v => tile('vessel', v, A.vessel({ ...meR(), vessel: v }, { type: v, still: true, emptyLabel: false }), L.vessel[v].replace('cup and saucer', 'cup & saucer'), ME.vessel === v, S.vessel[v])).join('')) }
  ];
  // Replace only the nodes whose markup changed, so untouched tiles never move or flicker.
  function patch(old, neu) {
    const a = [...old.children], b = [...neu.children];
    if (a.length !== b.length) { old.innerHTML = neu.innerHTML; return; }
    a.forEach((o, i) => { const n = b[i]; if (o.outerHTML === n.outerHTML || o.id === 'mkAt') return;
      if (o.tagName === n.tagName && o.className === n.className && o.children.length && !o.matches('.mk-t')) { patch(o, n); [...n.attributes].forEach(at => { if (o.getAttribute(at.name) !== at.value) o.setAttribute(at.name, at.value); }); }
      else o.replaceWith(n.cloneNode(true)); });
  }
  function mkControls() {
    $('mkTabs').innerHTML = TABS.map(t => `<button type="button" role="tab" class="mk-tab" data-act="mk-tab" data-tab="${t.id}" aria-selected="${t.id === mkTab}">${ICON(t.ic)}<span>${t.lab}</span></button>`).join('');
    const html = `<div class="mk-at" id="mkAt"></div>` + TABS.find(t => t.id === mkTab).body(), box = $('mkCtrl');
    if (box.dataset.tab !== mkTab) { box.innerHTML = html; box.dataset.tab = mkTab; }
    else { const tmp = document.createElement('div'); tmp.innerHTML = html; patch(box, tmp); }
    mkAtLine();
  }
  function mkCup() {
    const R = meR(), sh = C.shade(R), fk = C.family(R);
    $('mkCupBody').innerHTML = `<div class="mk-art" id="mkArt"></div><hr class="mk-sep">${mkTimeline()}`;
    const nm = $('mkName'); if (document.activeElement !== nm) nm.value = ME.name || ''; nm.placeholder = 'Name your chai';
    mkTime();
  }
  // The moment slider: the pan (or the cup, at the end) as it is at that moment; what's still to come is dimmed.
  let mkNow = 4;
  function mkAtLine() { const el = $('mkAt'); if (el) el.innerHTML = mkNow < 4 ? `${ICON(STAGE_IC[mkNow])}<span>Anything you add now goes in at <b>${L.stage[mkNow]}</b></span>` : `${ICON('cup')}<span>Slide the timeline to a moment, and whatever you add goes in then</span>`; }
  function mkTime() {
    mkAtLine();
    const R = meR(), t = mkNow;
    const inBy = x => x.st <= t;
    const float = ME.extras.filter(k => (ME.spiceSt[k] == null ? 1 : ME.spiceSt[k]) <= t);
    $('mkArt').innerHTML = t >= 4 ? A.vessel(R, { type: R.vessel || 'glass', float: R.extras }) : A.pan(A.liquidAt(R, t), t, { float });
    $('mkTl').querySelectorAll('.tl-c').forEach(c => { const i = +c.dataset.st; c.classList.toggle('now', i === t); c.classList.toggle('later', i > t); });
    $('mkTl').querySelectorAll('.tl-i').forEach(el => { const x = tlItems().find(y => y.k === el.dataset.k); el.classList.toggle('in', !!x && inBy(x)); });
  }
  // The cooking timeline, editable: drag an ingredient to the moment it goes in, or tap it to move it one step on.
  const tlItems = () => {
    const it = [];
    if (ME.water) it.push({ k: 'water', ic: 'water', lab: 'Water', st: 0, fixed: true });
    if (ME.milkOn) it.push({ k: 'milk', ic: 'milk', lab: 'Milk', st: ME.milkIn == null ? 2 : ME.milkIn });
    ME.teas.forEach(t => it.push({ k: 'tea', t, ic: t, lab: L.tea[t] || 'Tea', st: ME.teaIn == null ? 2 : ME.teaIn }));
    if (ME.sweet) it.push({ k: 'sweet', ic: ME.sweet, lab: LAB[ME.sweet], st: ME.sweetIn == null ? 4 : ME.sweetIn });
    ME.extras.forEach(x => it.push({ k: x, ic: x, lab: LAB[x], st: ME.spiceSt[x] == null ? 1 : ME.spiceSt[x] }));
    return it;
  };
  function mkTimeline() {
    const it = tlItems(), nb = ME.milkOn && ME.boils ? (ME.boils === 4 ? 3 : ME.boils) : 0;
    return `<div class="tl-slide"><input type="range" class="tl-range" id="mkRange" min="0" max="4" step="1" value="${mkNow}" aria-label="Moment in the cooking" aria-valuetext="${L.stage[mkNow]}"></div>
      <div class="tl" id="mkTl">${L.stage.map((lab, i) => `<div class="tl-c" data-st="${i}"><button type="button" class="tl-h" data-act="tl-at" data-st="${i}">${ICON(STAGE_IC[i])}<span>${lab}</span></button><div class="tl-d">${it.filter(x => x.st === i).map(x => `<span class="tl-i${x.fixed ? ' fixed' : ''}" data-k="${x.k}"${x.t ? ` data-t="${x.t}"` : ''} title="${x.lab}${x.fixed ? '' : ' · drag to move'}" ${x.fixed ? '' : 'tabindex="0" role="button"'}>${ICON(x.ic)}</span>`).join('')}${i === 2 && nb ? `<span class="tl-fl">${'<i></i>'.repeat(nb)}</span>` : ''}</div></div>`).join('')}</div>
`;
  }
  function setStage(k, st) {
    if (k === 'milk') ME.milkIn = st; else if (k === 'tea') ME.teaIn = st; else if (k === 'sweet') ME.sweetIn = st; else ME.spiceSt[k] = st;
    mkLast = { f: 'stage', k, v: st };
    mkRender();
    const ch = $('mkTl').querySelector(`.tl-i[data-k="${k}"]`); if (ch) gsap.from(ch, { scale: .3, y: -14, duration: .45, ease: 'back.out(2.4)' });
  }
  const TL_KEY = { milk: 'milk', milkIn: 'milk', amt: 'tea', teaIn: 'tea', sweet: 'sweet' };
  // take the tapped tile's picture and position before the panel re-renders
  const grab = el => { const pic = el && el.querySelector('.mk-ti svg, svg'); return pic ? { pic: pic.cloneNode(true), a: pic.getBoundingClientRect() } : null; };
  function flyIn(src, key, tea) {
    if (!src || !src.a.width) return;
    const to = (key && $('mkTl').querySelector(`.tl-i[data-k="${key}"]${tea ? `[data-t="${tea}"]` : ''}`)) || $('mkArt');
    const a = src.a, b = to.getBoundingClientRect();
    const fly = src.pic; fly.classList.add('fly'); Object.assign(fly.style, { left: a.left + 'px', top: a.top + 'px', width: a.width + 'px', height: a.height + 'px' });
    document.body.appendChild(fly);
    const tx = b.left + b.width / 2 - (a.left + a.width / 2), ty = b.top + b.height / 2 - (a.top + a.height / 2), arc = Math.min(-60, ty * .3);
    gsap.timeline({ onComplete: () => fly.remove() })
      .to(fly, { x: tx * .5, y: arc, scale: .8, rotation: tx > 0 ? 12 : -12, duration: .32, ease: 'power1.out' })
      .to(fly, { x: tx, y: ty, scale: to === $('mkArt') ? .35 : .55, rotation: 0, duration: .38, ease: 'power2.in' })
      .add(() => {
        if (to === $('mkArt')) gsap.fromTo('#mkArt .vessel', { scale: .95 }, { scale: 1, duration: .5, ease: 'back.out(3)', transformOrigin: '50% 100%' });
        else { gsap.fromTo(to, { scale: 1.45 }, { scale: 1, duration: .5, ease: 'back.out(3)' }); const col = to.closest('.tl-c'); if (col) { col.classList.add('flash'); setTimeout(() => col.classList.remove('flash'), 700); } }
      });
    gsap.set(to, { autoAlpha: 0 }); gsap.set(to, { autoAlpha: 1, delay: .68 });
  }
  const stageOf = k => (tlItems().find(x => x.k === k) || {}).st;
  $('mkCup').addEventListener('input', e => { if (!e.target.classList.contains('tl-range')) return; mkNow = +e.target.value; e.target.setAttribute('aria-valuetext', L.stage[mkNow]); mkTime(); });
  $('mkName').addEventListener('input', e => { ME.name = e.target.value.trim() || null; });
  $('mkName').addEventListener('keydown', e => { if (e.key === 'Enter') e.target.blur(); });
  let drag = null;
  document.addEventListener('pointermove', e => { if (e.pointerType !== 'mouse') return; const rc = e.target.closest && e.target.closest('.c-rc'); if (!rc) return;
    const r = rc.getBoundingClientRect(), fx = (e.clientX - r.left) / r.width - .5, fy = (e.clientY - r.top) / r.height - .5;
    rc.style.setProperty('--ry', (fx * 44).toFixed(1) + 'deg'); rc.style.setProperty('--rx', (-fy * 18).toFixed(1) + 'deg'); });
  document.addEventListener('pointerout', e => { const rc = e.target.closest && e.target.closest('.c-rc'); if (rc && !rc.contains(e.relatedTarget)) { rc.style.setProperty('--ry', '0deg'); rc.style.setProperty('--rx', '0deg'); } });
  $('mkCup').addEventListener('pointerdown', e => {
    const el = e.target.closest('.tl-i'); if (!el || el.classList.contains('fixed')) return;
    e.preventDefault(); el.setPointerCapture(e.pointerId);
    drag = { el, k: el.dataset.k, x: e.clientX, y: e.clientY, moved: false };
  });
  $('mkCup').addEventListener('pointermove', e => {
    if (!drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) < 5) return;
    drag.moved = true; drag.el.classList.add('dragging');
    gsap.set(drag.el, { x: dx, y: dy });
    const over = colAt(e.clientX, e.clientY);
    $('mkTl').querySelectorAll('.tl-c').forEach(c => c.classList.toggle('over', c === over));
  });
  const colAt = (x, y) => [...$('mkTl').querySelectorAll('.tl-c')].find(c => { const r = c.getBoundingClientRect(); return x >= r.left && x <= r.right && y >= r.top - 40 && y <= r.bottom + 40; });
  $('mkCup').addEventListener('pointerup', e => {
    if (!drag) return; const d = drag; drag = null;
    if (!d.moved) { setStage(d.k, (stageOf(d.k) + 1) % 5); return; }
    const c = colAt(e.clientX, e.clientY);
    if (c) setStage(d.k, +c.dataset.st); else gsap.to(d.el, { x: 0, y: 0, duration: .3, ease: 'power2.out', onComplete: () => d.el.classList.remove('dragging') });
  });
  $('mkCup').addEventListener('pointercancel', () => { if (drag) { gsap.set(drag.el, { x: 0, y: 0 }); drag.el.classList.remove('dragging'); drag = null; } });
  $('mkCup').addEventListener('keydown', e => { const el = e.target.closest('.tl-i'); if (!el || el.classList.contains('fixed')) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); const d = e.key === 'ArrowLeft' ? 4 : 1, k = el.dataset.k; setStage(k, (stageOf(k) + d) % 5); const n = $('mkTl').querySelector(`.tl-i[data-k="${k}"]`); if (n) n.focus(); } });
  // What the last change means, in readers
  function mkSay(top) {
    const R = meR(), l = mkLast;
    let s = '';
    if (l) {
      if (l.f === 'milk') s = `<b>${S.milk[l.v]}</b> pour ${L.milk[l.v]}.`;
      else if (l.f === 'amt') s = `<b>${cnt(r => r.amt === l.v)}</b> use ${L.amt[l.v]}.`;
      else if (l.f === 'brew') s = `<b>${cnt(r => r.brew === l.v)}</b> strain after ${L.brew[l.v]}.`;
      else if (l.f === 'boils') s = `<b>${S.boil[l.v]}</b> boil it ${L.boils[l.v]}.`;
      else if (l.f === 'teaIn') s = `<b>${cnt(r => r.st.tea === l.v)}</b> add leaf at ${L.stage[l.v]}.`;
      else if (l.f === 'milkIn') s = `<b>${cnt(r => r.milk > 0 && r.st.milk === l.v)}</b> add milk at ${L.stage[l.v]}.`;
      else if (l.f === 'sweet') s = `<b>${cnt(r => r.sweet === l.v)}</b> take ${sweetLab(l.v)}.`;
      else if (l.f === 'vessel') s = `<b>${S.vessel[l.v]}</b> use a ${L.vessel[l.v]}.`;
      else if (l.f === 'stage') { const v = l.v, k = l.k, n = k === 'milk' ? cnt(r => r.milk > 0 && r.st.milk === v) : k === 'tea' ? cnt(r => r.st.tea === v) : k === 'sweet' ? cnt(r => r.sweet && r.sweet !== 'none' && r.st.sweet === v) : cnt(r => r.extras.includes(k) && r.st[k] === v);
        s = `<b>${n}</b> add ${k === 'tea' ? 'the leaf' : k === 'sweet' ? 'the sweetener' : k === 'milk' ? 'the milk' : L.spice[k]} at ${L.stage[v]}.`; }
      else if (l.f === 'tog') s = `<b>${countFor(l.v)}</b> use ${LAB[l.v].toLowerCase()}.`;
    }
    const near = RS.filter(r => C.distance(R, r) < 1.6).length;
    return `${s ? `<span class="mk-now">${s}</span> ` : ''}${meEmpty() ? 'Your pan is empty: add what goes in, as it goes in.' : near ? `<b>${near}</b> kitchens make it almost like you.` : 'Keep adding, and the closest kitchens will show up here.'}`;
  }
  function mkCards() {
    const R = meR(), top = RS.map(r => ({ r, d: C.distance(R, r) })).sort((a, b) => a.d - b.d).slice(0, 3);
    $('mkSay').innerHTML = mkSay(top);
    $('mkCards').innerHTML = top.map(({ r, d }) => `<div class="mk-card" data-id="${r.id}"><div class="rel-top">${vesselFor(r, { type: r.vessel })}<div><div class="rel-n">${esc(trunc(placeOf(r), 18))}</div><div class="rel-w">${callsIt(r)}</div></div><span class="mk-match">${Math.max(5, Math.round(100 * (1 - d / 7)))}%</span></div>
      <div class="mk-cq">${quoteOf(r) ? `<q>${esc(trunc(quoteOf(r), 110))}</q>` : `<span>${esc(recipeLine(r))}</span>`}</div><button class="rc-make" type="button" data-act="make" data-id="${r.id}">Try theirs ↺</button></div>`).join('');
    const fresh = [...$('mkCards').children].filter(el => !mkPrev.includes(el.dataset.id));
    if (fresh.length && fresh.length < 3) gsap.from(fresh, { x: 18, autoAlpha: 0, duration: .4, stagger: .06, ease: 'power2.out' });
    mkPrev = top.map(t => t.r.id);
  }
  function mkRender() {
    mkControls(); mkCup(); mkCards();
    const v = $('mkCup').querySelector('.vessel'); if (v) gsap.fromTo(v, { rotate: -2 }, { rotate: 0, duration: .6, ease: 'elastic.out(1, .4)', transformOrigin: '50% 100%' });
  }
  function openMaker(id) {
    const r = id && RS.find(x => x.id === id);
    if (r) $('mkFrom').innerHTML = (loadReader(r), `From a reader in <b>${esc(placeOf(r))}</b>`);
    else if (meEmpty()) { defaultMe(); $('mkFrom').innerHTML = 'From the most common answers'; }
    else $('mkFrom').innerHTML = 'Your chai, as you left it';
    mkLast = null; mkPrev = []; mkNow = 4;
    mkStart = JSON.stringify(ME);
    mkRender();
    if (mkOpen) return;
    mkOpen = true; document.body.style.overflow = 'hidden';
    $('sheet').classList.add('flipped'); $('maker').removeAttribute('inert'); $('shFront').setAttribute('inert', '');
    gsap.timeline().to('#shCard', { rotateY: 180, duration: 1, ease: 'power3.inOut' }).to('#shCard', { scale: .96, duration: .5, ease: 'power2.out', yoyo: true, repeat: 1 }, 0);
  }
  function closeMaker() {
    if (!mkOpen) return; mkOpen = false;
    refresh();
    $('sheet').classList.remove('flipped'); $('maker').setAttribute('inert', ''); $('shFront').removeAttribute('inert');
    gsap.timeline({ onComplete: () => { document.body.style.overflow = ''; } }).to('#shCard', { rotateY: 0, duration: 1, ease: 'power3.inOut' }).to('#shCard', { scale: .96, duration: .5, ease: 'power2.out', yoyo: true, repeat: 1 }, 0);
  }

  // ---------- Events ----------
  let toastT;
  function toast(msg) { const t = $('toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 2200); }
  document.addEventListener('click', e => {
    const rc = e.target.closest('.c-rc');
    if (rc && !e.target.closest('[data-act]')) { rc.classList.toggle('on'); return; }
    const el = e.target.closest('[data-act]'); if (!el) return;
    const a = el.dataset.act, k = el.dataset.k;
    if (a === 'make') { openMaker(el.dataset.id); }
    else if (a === 'mk-close') { closeMaker(); }
    else if (a === 'mk-reset') { Object.assign(ME, { water: false, milkOn: false, milkShare: null, milkType: null, milkIn: null, teas: [], amt: null, teaIn: null, sweet: null, sugarAmt: 'sugar2', sweetIn: null, brew: null, extras: [], forms: {}, spiceSt: {}, boils: null, touched: {} });
      mkNow = 0; mkLast = null; mkPrev = []; $('mkFrom').textContent = 'From an empty pan'; mkRender(); toast('Empty pan. Add things as they go in.'); gsap.fromTo('#mkCup .mk-art', { rotate: -6 }, { rotate: 0, duration: .7, ease: 'elastic.out(1, .4)' }); }
    else if (a === 'tl-at') { mkNow = +el.dataset.st; $('mkRange').value = mkNow; mkTime(); }
    else if (a === 'tl-pick') { setStage(el.dataset.k, mkNow); }
    else if (a === 'mk-tab') { mkTab = el.dataset.tab; mkControls(); gsap.fromTo('#mkCtrl', { autoAlpha: 0 }, { autoAlpha: 1, duration: .3, ease: 'power1.out' }); }
    else if (a === 'mk-tog') { const was = inPot(k), src = grab(el); toggle(k); if (!was && mkNow < 4) { if (TEAS.includes(k)) ME.teaIn = mkNow; else ME.spiceSt[k] = mkNow; }
      mkLast = !was && mkNow < 4 ? { f: 'stage', k: TEAS.includes(k) ? 'tea' : k, v: mkNow } : { f: 'tog', v: k }; mkRender();
      if (!was) flyIn(src, TEAS.includes(k) ? 'tea' : k, TEAS.includes(k) ? k : null); }
    else if (a === 'mk-opt') {
      const f = el.dataset.f, v = el.dataset.v, hadMilk = ME.milkOn, hadSweet = !!ME.sweet, src = grab(el);
      if (f === 'sweet') { ME.touched.sweet = true; if (v === 'none') ME.sweet = null; else if (v.startsWith('sugar')) { ME.sweet = 'sugar'; ME.sugarAmt = v; } else ME.sweet = v; if (ME.sweet && ME.sweetIn == null) ME.sweetIn = 4; }
      else if (f === 'vessel') ME.vessel = v;
      else if (f === 'milk') { const m = +v; ME.water = m < 5; ME.milkOn = m > 0; ME.milkShare = m > 0 ? m : null; if (m > 0 && ME.milkIn == null) ME.milkIn = 2; if (m > 0 && ME.boils == null) ME.boils = 2; }
      else { ME[f] = +v; if (f === 'amt' && !ME.teas.length) ME.teas = ['ctc']; }
      mkLast = { f, v: f === 'sweet' || f === 'vessel' ? v : +v };
      if (mkNow < 4 && f === 'milk' && !hadMilk && ME.milkOn) { ME.milkIn = mkNow; mkLast = { f: 'stage', k: 'milk', v: mkNow }; }
      if (mkNow < 4 && f === 'sweet' && !hadSweet && ME.sweet) { ME.sweetIn = mkNow; mkLast = { f: 'stage', k: 'sweet', v: mkNow }; }
      mkRender();
      flyIn(src, TL_KEY[f]);
    }
    else if (a === 'pour') { openCard(); }
  });
  document.addEventListener('keydown', e => { if (e.key !== 'Escape') return; if (!$('modal').hidden) closeCard(); else if (mkOpen) closeMaker(); });
  $('modal').addEventListener('click', e => { if (e.target.closest('[data-close]')) closeCard(); });
  $('dlBtn').addEventListener('click', download);
  $('nameIn').addEventListener('input', e => { ME.name = e.target.value.trim() || null; placeName(); });
  $('nameIn').addEventListener('keydown', e => { if (e.key === 'Enter') e.target.blur(); });
  $('shareBtn').addEventListener('click', share);
  const pageUrl = encodeURIComponent(location.href.split('#')[0]), shareText = encodeURIComponent('How do you make your chai? Build your cup and see where it sits among other readers’.');
  $('sfWa').href = `https://wa.me/?text=${shareText}%20${pageUrl}`;
  $('sfX').href = `https://twitter.com/intent/tweet?text=${shareText}&url=${pageUrl}`;
  $('sfLi').href = `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`;
  $('sfCopy').addEventListener('click', async () => { try { await navigator.clipboard.writeText(location.href.split('#')[0]); toast('Link copied'); } catch (e) { toast('Couldn’t copy'); } });

  // ---------- Boot ----------
  SC.forEach(s => ['d', 'm'].forEach(md => s[md].forEach(row => { if (row.trim().split(/\s+/).length !== DIM[md].cols) console.error('bad row', s.id, md, row); })));
  window.__chaiScenes = SC.map(s => s.id); // test harness
  window.__chaiScene = i => scrollTo(0, wrap.offsetTop + STARTS[i] * innerHeight / 100 + 4); // used by the test harness
  renderLede();
  let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { relayout(); if (!$('modal').hidden) placeName(); }, 120); });
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => { onScroll(); ScrollTrigger.refresh(); Object.values(cur).forEach(e => fit(e.inner)); Object.keys(LIVE).forEach(drawChart); });
  onScroll();
  gsap.to('.progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .3 } });
})();

// Paper gradient: slide it at half the scroll speed, and warm the page as the reader goes further.
(() => {
  const root = document.body; let raf = 0;
  const upd = () => {
    raf = 0; const y = window.scrollY, max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    root.style.setProperty('--sy', (-y * .5).toFixed(1) + 'px');
    root.style.setProperty('--warm', Math.min(1, y / max).toFixed(3));
  };
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(upd); }, { passive: true });
  addEventListener('resize', upd); upd();
})();
