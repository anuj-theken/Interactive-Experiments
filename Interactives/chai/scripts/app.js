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
  const cupPt = (R, x, y, d, o = {}) => ({ name: R.you ? 'you' : R.id, value: [x, y], R, symbol: o.sym || GLASS, symbolSize: R.you ? [Math.max(d * .9, 12), Math.max(d * 1.17, 16)] : [d * .62, d * .82],
    itemStyle: { color: (R.you ? A.liquid(R) : R.shade && R.shade.hex) || '#CFC6BA', borderColor: R.you ? RED : 'rgba(36,26,17,.5)', borderWidth: R.you ? 2.4 : .6, opacity: o.op == null ? 1 : o.op },
    z: R.you ? 10 : 2 });
  // stacked columns of glasses (used by the pour and the cup charts)
  function columns(ch, W, H, groups, labels, o = {}) {
    const data = [], els = [];
    const padX = 4, top = 10, bottom = o.bottom || 44, gw = (W - padX * 2) / groups.length, h = H - top - bottom;
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
  const kfig = (n, cap, of = N) => `<div class="kfig"><span class="kn">${n}</span><span class="kc">${cap}</span><span class="kbar" title="${n} of ${of}"><i style="width:${Math.max(1.5, 100 * n / of)}%"></i></span><span class="kof">${n} of ${of}${of === N ? ' readers' : ''} · ${Math.round(100 * n / of)}%</span></div>`;
  const modeOf = vals => { const m = {}; vals.forEach(v => { if (v != null) m[v] = (m[v] || 0) + 1; }); const e = Object.entries(m).sort((a, b) => b[1] - a[1])[0]; return e ? [e[0], e[1]] : [null, 0]; };
  const youLine = html => html ? `<span class="you-line"><em>you</em>${html}</span>` : '';
  const CH = {};
  CH.pour = {
    no: 'fig. i', label: 'every reader’s glass, tinted by their recipe',
    like: R => R.milk == null ? null : r => r.milk === R.milk,
    you: R => R.milk == null ? '' : `Your pour, <b>${L.milk[R.milk]}</b>, is shared by <b>${S.milk[R.milk]}</b> readers.`,
    steps: [
      { st: 'all', k: () => kfig(N, 'glasses, one for every reader'), h: () => `Nobody chose these colours. Each is computed from the recipe, the way a pan turns from cream to mahogany.` },
      { st: 'milk', k: () => kfig(S.milk[3], 'pour half milk, the most common'), h: () => `Sort them by milk. Add up the splashes, quarters and black teas, though, and <b>${S.mostlyWater}</b> of ${N} make a cup that’s mostly water.<span class="hint">${S.toned} use toned or double-toned milk; ${S.full} use full-cream.</span>` },
      { st: 'ends', k: () => kfig(S.milk[0], 'take it black, no milk at all'), h: () => `At the other end, <b>${S.milk[5]}</b> let no water near the pan, tapri-style. One of them, in Mumbai, uses condensed milk.` },
      { st: 'you', you: true, k: () => { const R = meR(); return R.milk == null ? '' : kfig(S.milk[R.milk], `pour ${L.milk[R.milk]}, like you`); }, h: () => {
        const R = meR();
        if (R.milk == null) return `<span class="you-tag">You</span>Your pan is still empty. Scroll back up a little and add water, milk or both, and this page will filter to the readers who pour like you.`;
        const g = RS.filter(r => r.milk === R.milk), [ms, mc] = modeOf(g.filter(r => r.milk > 0).map(r => r.st.milk)), gin = g.filter(r => r.extras.includes('ginger')).length, [fam, fc] = modeOf(g.map(r => r.fam));
        return `<span class="you-tag">Readers like you</span>Highlighted: the <b>${g.length}</b> who pour like you. ${R.milk > 0 && ms != null ? `<b>${mc}</b> of them add the milk at <b>${L.stage[ms]}</b>; ` : ''}<b>${gin}</b> add ginger, and the most common family among them is <b>${C.FAM[fam].name}</b> (${fc}).`;
      } }
    ],
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
    steps: [
      { st: 'count', k: () => kfig(S.sp.ginger, 'add ginger: two in three kitchens'), h: () => `<b>Cardamom</b> is next (${S.sp.cardamom}). After that the larder thins out fast.<span class="hint">${S.plain} add nothing at all, and ${S.sp.lemongrass} wrote in lemongrass on their own.</span>` },
      { st: 'stage', k: () => { const top = S.spStage.indexOf(Math.max(...S.spStage)); return kfig(S.spStage[top], `spice additions go in while ${L.stage[top]}`, S.spUses); }, h: () => `Most spices go in early, before the leaf and the milk can dull them.` },
      { st: 'form', k: () => kfig(S.gCrushed, 'crush their ginger; ' + S.gGrated + ' grate it', S.sp.ginger), h: () => `Cardamom is almost always cracked open (<b>${S.cCrushed}</b>).<span class="hint">Red: crushed. Ochre: grated. Green: whole. Grey: powdered. Pale: didn’t say.</span>` },
      { st: 'late', k: () => kfig(S.cardOff, 'add cardamom only after the heat is off', S.sp.cardamom), h: () => `<q>That way it leaves a stronger fragrance, which gets lost otherwise.</q><span class="hint">A reader in Bhopal</span>` },
      { st: 'you', you: true, k: () => { const R = meR(), f = CH.larder.like(R); return f ? kfig(cnt(f), R.extras.length ? 'share a spice with you' : 'keep it plain, like you') : ''; }, h: () => {
        const R = meR();
        if (!R.extras.length) return `<span class="you-tag">You</span>${ME.touched.larder ? `You keep it plain. Highlighted: the <b>${S.plain}</b> readers who do too.` : 'Scroll back up and add your spices, and this page will filter to the readers who share them.'}`;
        const g = RS.filter(CH.larder.like(R)), [other, oc] = modeOf([].concat(...g.map(r => r.extras.filter(s => !R.extras.includes(s)))));
        const same = cnt(r => r.extras.length === R.extras.length && R.extras.every(s => r.extras.includes(s)));
        return `<span class="you-tag">Readers like you</span>Highlighted: everyone who shares a spice with you. ${same ? `<b>${same}</b> use exactly your set.` : 'Nobody uses exactly your set.'}${other ? ` The one they add that you don’t: <b>${L.spice[other]}</b> (${oc}).` : ''}`;
      } }
    ],
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
    return { name: it.you ? 'you-' + it.s : it.r.id + '-' + it.s, value: [x, y], it, symbolSize: it.you ? Math.max(d * 1.3, 10) : d * 0.82, z: it.you ? 10 : 2,
      itemStyle: { color, opacity: op, borderColor: it.you ? RED : 'rgba(36,26,17,.4)', borderWidth: it.you ? 2.5 : 0.6 } };
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
    steps: [
      { st: 'all', k: () => kfig(S.teaAt[2], 'wait for the boil before the leaf goes in'), h: () => `Three rows: the leaf, the milk and the sweetener. Each glass is one reader, placed in the column for the moment that ingredient goes into their pan.<span class="hint">Readers who take no milk or no sugar simply don’t appear in that row.</span>` },
      { st: 'common', k: () => kfig(S.common, 'put the leaf and the milk in together, at the boil'), h: () => `Lit up: the same readers in both rows. It’s the single most common method, and still only about one kitchen in five.` },
      { st: 'milkfirst', k: () => kfig(S.milkFirst, 'put the milk in before the leaf'), h: () => `Lit up: their milk sits in an earlier column than their leaf. <b>${S.teaFirst}</b> do the opposite, and <b>${S.together}</b> add both at once.` },
      { st: 'boils', k: () => kfig(S.multi, 'boil it 3+ times, or let it simmer'), h: () => `Now just the milk: once it’s in, how many times is the pan allowed to rise? <b>${S.boil[1]}</b> stop at once.<span class="hint"><q>Make it full flame and let it go up and down 2-3 times,</q> writes a reader in Mumbai.</span>` },
      { st: 'cup', k: () => kfig(S.milkCup, 'add the milk only in the cup'), h: () => `Lit up: everyone who finishes at the table. <b>${S.sweetCup}</b> stir the sugar in there too.` },
      { st: 'you', you: true, k: () => { const R = meR(); return R.st.tea == null ? '' : kfig(cnt(r => r.st.tea === R.st.tea), `add the leaf at ${L.stage[R.st.tea]}, like you`); }, h: () => {
        const R = meR();
        if (R.st.tea == null) return `<span class="you-tag">You</span>Add a leaf and circle when it goes in, a little further up, and your glasses will appear here in red.`;
        const g = RS.filter(r => r.st.tea === R.st.tea), [b, bc] = modeOf(g.filter(r => r.milk > 0).map(r => r.boils)), [m, mc] = modeOf(g.filter(r => r.milk > 0).map(r => r.st.milk));
        const same = cnt(r => r.st.tea === R.st.tea && (R.milk ? r.st.milk === R.st.milk && r.boils === R.boils : r.milk === 0));
        return `<span class="you-tag">Readers like you</span>Lit up: readers whose leaf goes in when yours does. Most of them add the milk at <b>${m != null ? L.stage[m] : '?'}</b> (${mc}) and let it boil <b>${b != null ? L.boils[b] : '?'}</b> (${bc}). ${same ? `<b>${same}</b> match your whole order.` : '<b>Nobody</b> matches your whole order.'}`;
      } }
    ],
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
    steps: [
      { st: 'all', k: () => kfig(S.ctc, 'use CTC, granules that colour a pan in seconds'), h: () => `Each reader lands in a square: how much tea they use, and how long it stays in before they strain.` },
      { st: 'top', k: () => kfig(S.topCell[1], 'share the busiest square'), h: () => { const [a, b] = S.topCell[0].split('-').map(Number); return `<b>${L.amt[a]}</b>, strained after <b>${L.brew[b]}</b>.`; } },
      { st: 'kadak', k: () => kfig(S.kadak, 'use 1½ tsp or more for 5 minutes or more'), h: () => `Kadak, by any definition.<span class="hint"><q>Tastes like dessert,</q> says one, who lets it simmer for ten minutes on weekend evenings.</span>` },
      { st: 'quick', k: () => kfig(S.quick, 'strain within a minute'), h: () => `${S.quickSteep ? `${S.quickSteep} of them add the leaf only after the heat is off. ` : ''}And <b>${S.eyeball}</b> eyeball the tea; <b>${S.colour}</b> strain only when <q>the colour looks right</q>.` },
      { st: 'you', you: true, k: () => { const R = meR(); return R.amt == null ? '' : kfig(cnt(r => r.amt === R.amt), `use ${L.amt[R.amt]}, like you`); }, h: () => {
        const R = meR();
        if (R.amt == null) return `<span class="you-tag">You</span>Circle how much tea you use (in chapter III) and how long it stays in (just above), and this page will filter to readers like you.`;
        const g = RS.filter(r => r.amt === R.amt), [br, brc] = modeOf(g.map(r => r.brew)), [ti, tic] = modeOf(g.map(r => r.st.tea));
        return `<span class="you-tag">Readers like you</span>Highlighted: everyone who uses <b>${L.amt[R.amt]}</b>. Most strain after <b>${L.brew[br]}</b> (${brc}) and add the leaf at <b>${L.stage[ti]}</b> (${tic}).${R.brew != null ? ` Your square holds <b>${S.leafCell[R.amt + '-' + R.brew] || 0}</b>.` : ''}`;
      } }
    ],
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
    steps: [
      { st: 'sweet', k: () => kfig(S.noSugar, 'take no sugar at all, the biggest group'), h: () => `<b>${S.sugar}</b> use sugar, <b>${S.jaggery}</b> jaggery, <b>${S.free}</b> a sugar-free sweetener and <b>${S.honey}</b> honey.` },
      { st: 'where', k: () => kfig(S.sweetCup, 'of those who sweeten wait until it’s in the cup', N - S.noSugar), h: () => `<b>${S.sweetPan}</b> put it in the pan, where it cooks with the milk.<span class="hint">Darkened: sweetened in the cup.</span>` },
      { st: 'vessel', k: () => kfig(S.vessel.mug, 'drink from a mug'), h: () => `<b>${S.vessel.cup}</b> use a cup and saucer, <b>${S.vessel.tumbler}</b> a steel tumbler and <b>${S.vessel.glass}</b> a cutting glass.<span class="hint"><q>Tea in a mug is for bodybuilders,</q> says a reader in Lucknow.</span>` },
      { st: 'you', you: true, k: () => { const R = meR(); return R.vessel ? kfig(S.vessel[R.vessel], `drink from a ${L.vessel[R.vessel]}, like you`) : ''; }, h: () => {
        const R = meR();
        if (!R.vessel) return `<span class="you-tag">You</span>Pick what you drink from, just above, and this page will filter to the readers who share your cup.`;
        const g = RS.filter(r => r.vessel === R.vessel), ns = g.filter(r => r.sweet === 'none').length, [fam, fc] = modeOf(g.map(r => r.fam));
        return `<span class="you-tag">Readers like you</span>Highlighted: the <b>${g.length}</b> who drink from a ${L.vessel[R.vessel]}. <b>${ns}</b> of them take no sugar, and their most common family is <b>${C.FAM[fam].name}</b> (${fc}).`;
      } }
    ],
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
  }

  // ---------- Cell specs ----------
  let NOW_T = 0;
  const CLOCK = ['0:00', '0:45', '2:00', '3:30', '5:00'], MINS = [0, .75, 2, 3.5, 5];
  const who = rr => [rr.age, rr.town].filter(Boolean).map(esc).join(' · ') || 'A reader';
  const vesselFor = (R, o) => A.vessel(R, { still: true, ...o });
  const clock = t => { const a = MINS[t] / 6 * 360; return `<span class="clock"><svg viewBox="0 0 30 30" aria-hidden="true"><circle cx="15" cy="15" r="13" fill="#FBF6EA" stroke="#241A11" stroke-width="1.6"/>${[0, 1, 2, 3, 4, 5].map(i => `<line x1="15" y1="3.5" x2="15" y2="6" stroke="#241A11" transform="rotate(${i * 60} 15 15)"/>`).join('')}<path d="M15 15 L15 3 A12 12 0 ${a > 180 ? 1 : 0} 1 ${15 + 12 * Math.sin(a * Math.PI / 180)} ${15 - 12 * Math.cos(a * Math.PI / 180)}Z" fill="#A8321F" opacity=".25"/><line x1="15" y1="15" x2="15" y2="5" stroke="#A8321F" stroke-width="2" stroke-linecap="round" transform="rotate(${a} 15 15)"/></svg>${CLOCK[t]}</span>`; };

  const LEDE = { key: 'lede', render: () => `<div class="c-no">fig. 0 · the shade chart</div><div class="c-art lede-art">${ledeSVG()}</div><div class="c-lab"><b>Every shade of chai, A1 to F6</b><small>stronger going down, less milky going right. Yours will land on it.</small></div>` };
  const HEAD_UNUSED = { key: 'head', render: () => `<div class="hd"><div class="hd-k">First Principles · Special edition · 15 Nov 2026</div><h2 class="hd-t">How do you make your chai?</h2><p class="hd-by">by <a href="https://the-ken.com/writers/rohin/" target="_blank" rel="noopener">Rohin Dharmakumar</a> and <a href="https://the-ken.com/writers/anuj_269/" target="_blank" rel="noopener">Anuj Debnath</a></p></div>` };
  const TEA = { key: 'tea', live: true, cls: 'c-tea', render: () => {
    const R = meR(), t = NOW_T, sh = C.shade(R);
    const inCup = t >= 4;
    const float = ME.extras.filter(s => ME.spiceSt[s] == null || ME.spiceSt[s] <= t);
    const art = inCup ? A.vessel(R, { float: !ME.vessel || ME.vessel === 'glass' ? ME.extras : [] }) : A.pan(A.liquidAt(R, t), t, { float });
    const fam = meEmpty() ? '' : C.FAM[C.family(R)].name;
    return `<div class="tea-top"><span class="c-no">${inCup ? 'your chai' : 'your pan'} · <i>${L.stage[Math.min(t, 4)]}</i></span>${clock(t)}</div>
      <div class="c-art">${art}</div>
      ${A.strip(R, { you: true, remove: true, now: t })}
`;
  } };
  const badge = on => `<span class="addb${on ? ' on' : ''}" aria-hidden="true">${on ? '✓' : '+'}</span>`;
  const ING = k => ({ key: 'ing:' + k, live: true, tag: 'button', cls: 'c-ing', attrs: () => ({ 'data-act': 'tile', 'data-k': k, 'aria-pressed': String(inPot(k)), 'aria-label': `${LAB[k]}: ${inPot(k) ? 'in your pan, tap to remove' : 'tap to add'}. ${countFor(k)} readers use it.` }),
    render: () => `<div class="ing-top"><span class="c-no">${countFor(k)} readers</span>${badge(inPot(k))}</div><div class="c-art">${ICON(k)}</div><div class="ing-name">${LAB[k]}</div><div class="ing-hint">${inPot(k) ? 'in your pan' : 'tap to add'}</div>` });
  const VES_LAB = { glass: 'Cutting glass', cup: 'Cup & saucer', mug: 'Mug', tumbler: 'Steel tumbler' };
  const VES = t => ({ key: 'ves:' + t, live: true, tag: 'button', cls: 'c-ing', attrs: () => ({ 'data-act': 'vessel', 'data-v': t, 'aria-pressed': String(ME.vessel === t), 'aria-label': `${VES_LAB[t]}: ${ME.vessel === t ? 'yours' : 'tap to pour into it'}` }),
    render: () => `<div class="ing-top"><span class="c-no">${S.vessel[t]} readers</span>${badge(ME.vessel === t)}</div><div class="c-art">${vesselFor({ ...meR(), vessel: t }, { type: t, emptyLabel: false })}</div><div class="ing-name">${VES_LAB[t]}</div><div class="ing-hint">${ME.vessel === t ? 'poured' : 'tap to pour'}</div>` });
  // Notebook cells: everything you can change is written on ruled paper, with readers' counts pencilled in.
  const OC = {
    milkShare: v => S.milk[v], milkType: v => cnt(r => r.milkType === v), milkIn: v => cnt(r => r.milk > 0 && r.st.milk === +v),
    amt: v => cnt(r => r.amt === +v), teaIn: v => cnt(r => r.st.tea === +v),
    boils: v => S.boil[v], brew: v => cnt(r => r.brew === +v), sugarAmt: v => cnt(r => r.sweet === v), sweetIn: v => cnt(r => r.sweet !== 'none' && r.st.sweet === +v),
    name: v => cnt(r => r.name.toLowerCase() === v.toLowerCase())
  };
  const NOTE = (field, q, opts, cond, off) => ({ key: 'opt:' + field, live: true, cls: 'c-notebook', render: () => {
    const on = !cond || cond(), cur = ME[field];
    return `<div class="nq">${q}</div><div class="nopts${on ? '' : ' c-off'}">${opts().map(([v, lab]) => `<button class="nopt" type="button" data-act="opt" data-f="${field}" data-v="${v}" aria-pressed="${String(cur) === String(v)}">${lab}${OC[field] ? `<sup>${OC[field](v)}</sup>` : ''}</button>`).join('')}</div><div class="nhint">${on ? (cur == null ? 'circle one · small numbers are readers' : 'tap another to change') : off}</div>`;
  } });
  // One notebook line per spice: tap its name to change how it's prepared, circle when it goes in.
  const SPICEBOOK = { key: 'spicebook', live: true, cls: 'c-notebook', render: () => ME.extras.length
    ? `<div class="nq">When does each spice go in?</div><div class="srows" data-fit>${ME.extras.map(k => `<div class="srow"><button class="nopt sname" type="button" data-act="form" data-k="${k}" title="tap to change how it’s prepared">${LAB[k].toLowerCase()}, <i>${L.form[ME.forms[k]] || ''}</i></button><span class="sopts">${['cold pan', 'heating', 'boiling', 'heat off'].map((l, v) => `<button class="nopt" type="button" data-act="sst" data-k="${k}" data-v="${v}" aria-pressed="${ME.spiceSt[k] === v}">${l}</button>`).join('')}</span></div>`).join('')}</div><div class="nhint">circle a moment for each · tap a name to change how it’s prepared</div>`
    : `<div class="nq">When does each spice go in?</div><div class="nopts c-off"><span class="nopt">add a spice first</span></div><div class="nhint">nothing else? ${S.plain} readers keep it plain too</div>` };
  const PREP = { key: 'prep', live: true, cls: 'c-notebook', render: () => ME.extras.length
    ? `<div class="nq">How do you prepare them?</div><div class="nopts">${ME.extras.map(k => `<button class="nopt" type="button" data-act="form" data-k="${k}">${LAB[k].toLowerCase()}: <u>${L.form[ME.forms[k]] || ''}</u></button>`).join('')}</div><div class="nhint">tap a spice to change how it’s prepared</div>`
    : `<div class="nq">How do you prepare them?</div><div class="nopts c-off"><span class="nopt">add a spice first</span></div><div class="nhint">nothing else? ${S.plain} readers keep it plain too</div>` };

  const TITLES = {
    cover: { bg: '#1F3A2B', k: 'Nº 01 · a kitchen ledger', time: '', h: 'How India makes chai', hi: 'चाय कैसे बनती है', q: `${N} recipes, set down like specimens.`, cue: 'Scroll ↓' },
    cold: { bg: '#7A2318', k: 'Chapter I', time: '0:00', h: 'The cold pan', hi: 'ठंडा पतीला', q: 'Before the flame is lit: what goes in the pan?', cue: 'Scroll ↓' },
    heat: { bg: '#22304F', k: 'Chapter II', time: '0:45', h: 'Heating up', hi: 'आँच पर', q: 'The water warms and the larder opens.', cue: 'Scroll ↓' },
    boil: { bg: '#1F3A2B', k: 'Chapter III', time: '2:00', h: 'The boil', hi: 'उबाल', q: 'The leaf, the milk, and how many times it rises.', cue: 'Scroll ↓' },
    off: { bg: '#7A4416', k: 'Chapter IV', time: '3:30', h: 'Off the flame', hi: 'आँच बंद', q: 'The flame is off. The leaf keeps working.', cue: 'Scroll ↓' },
    cup: { bg: '#6B4A12', k: 'Chapter V', time: '5:00', h: 'In the cup', hi: 'कप में', q: 'Sweetened, poured and named.', cue: 'Scroll ↓' },
    voices: { bg: '#1F3A2B', k: 'In their own words', time: '', h: 'Kitchen voices', hi: 'रसोई की बातें', q: 'Tap a cup to read how it’s made.', cue: '' }
  };
  const TITLE = id => { const t = TITLES[id]; return { key: 'title:' + id, cls: 'c-title', render: () => `<div class="blk" style="background:${t.bg}"><div class="blk-top"><div class="blk-dots"><i></i><i></i><i></i></div>${t.time ? `<div class="blk-t">${t.time}</div>` : ''}</div><div class="blk-k">${t.k}</div><div class="blk-h">${t.h}</div><div class="blk-hi">${t.hi}</div><div class="blk-q">${t.q}${t.cue ? `<span class="cue">${t.cue}</span>` : ''}</div></div>` }; };
  const TEXT = (key, no, h, live) => ({ key: 'text:' + key, live: !!live, render: () => `<div class="c-text" data-fit>${h()}</div>` });
  const STEP = (ch, i) => ({ key: 'step:' + ch + i, live: true, render: () => { const s = CH[ch].steps[i], R = meR(); return `<div class="c-text" data-fit>${s.k ? s.k() : ''}${s.h()}${s.you || mode === 'd' ? '' : youLine(CH[ch].you(R))}</div>`; } });
  // Your side of the comparison, opposite the survey's
  const YOU = (ch, i) => ({ key: 'you:' + ch + i, live: true, cls: 'c-you', render: () => { const s = CH[ch].steps[i], R = meR(), y = s.you ? '' : CH[ch].you(R);
    return `<div class="c-text" data-fit><div class="pz-k you-k">You</div>${s.you ? `<span class="yc-big">Readers like you are highlighted on the chart below.</span>` : y ? `<span class="yc-big">${y}</span>` : `<span class="yc-empty">Your answer will show here once you’ve added it to your pan.</span>`}</div>`; } });
  // A plate of the chapter's ingredients, drawn large
  const ILLUS = id => ({ key: 'illus:' + id, render: () => `<div class="illus">${PZ[id].ic.map(k => `<figure><span>${ICON(k)}</span><figcaption>${(LAB[k] || (k === 'flame' ? 'the flame' : k)).toLowerCase()}</figcaption></figure>`).join('')}</div>` });
  const PZ = {
    intro: { k: 'Nº 01 · why we asked', h: 'Everyone at home is wrong, obviously', d: `Why we asked ${N} readers exactly how they make their tea.`, ic: ['leaf', 'ginger', 'milk', 'sugar'], you: false },
    cold: { k: 'Chapter I · 0:00', h: 'Before the flame is lit', d: 'Water first, or milk first? Most kitchens start with water.', ic: ['water', 'milk'], you: false },
    heat: { k: 'Chapter II · 0:45', h: 'The larder opens', d: 'Spices bloom in hot water, so most go in early.', ic: ['ginger', 'cardamom', 'clove', 'cinnamon'], you: true },
    boil: { k: 'Chapter III · 2:00', h: 'The moment that divides households', d: 'The leaf goes in, the milk rises, and someone counts the boils.', ic: ['ctc', 'assam', 'darjeeling', 'flame'], you: true },
    off: { k: 'Chapter IV · 3:30', h: 'The leaf keeps working', d: 'Colour, then body, then (eventually) bitterness.', ic: ['leaf', 'bag', 'dust'], you: true },
    cup: { k: 'Chapter V · 5:00', h: 'Sweetened, poured and named', d: 'The last decisions happen at the table.', ic: ['sugar', 'jaggery', 'honey', 'free'], you: true }
  };
  const PROSE = (key, h) => ({ key: 'prose:' + key, live: true, render: () => { const z = PZ[key];
    return `<div class="pz">${z.you ? panSoFar() : ''}<div class="pz-top"><div class="pz-text"><div class="pz-k">${z.k}</div><h3 class="pz-h">${z.h}</h3><p class="pz-d">${z.d}</p></div></div><div class="pz-body" data-fit>${h()}</div></div>`; } });
  const CHART = ch => ({ key: 'chart:' + ch, render: () => `<div class="c-chart"></div><div class="c-lab"><small>${CH[ch].label}</small></div>`,
    mount: el => { const chart = echarts.init(el.querySelector('.c-chart'), null, { renderer: 'canvas' }); LIVE[ch] = { chart, step: LIVE[ch] ? LIVE[ch].step : 0 }; },
    unmount: () => { if (LIVE[ch]) { LIVE[ch].chart.dispose(); delete LIVE[ch]; } } });
  const SPEC = (id, no, k, w) => { const r = byId(id); return { key: 'spec:' + id, cls: 'c-spec', render: () => `<div class="c-art">${vesselFor(r, { type: r.vessel })}</div>${A.strip(r)}<div class="c-lab"><b>${k}</b><small>${w} · ${C.FAM[r.fam].name} · shade ${r.shade ? r.shade.code : ''}</small></div>` }; };
  const QUOTE = (id, q) => { const r = byId(id); return { key: 'quote:' + id, cls: 'c-quote', render: () => `<div class="qt" data-fit><q>${esc(q)}</q></div><div class="rel-top">${vesselFor(r, { type: r.vessel })}<div><div class="rel-n">${esc(r.name)}</div><div class="rel-w">${who(r.reader)}</div></div></div>${A.strip(r)}` }; };
  const HINT = (key, h) => ({ key: 'hint:' + key, render: () => `<div class="c-text" data-fit>${h}</div>` });
  const FAM_RULE = { steeper: 'Black, or just a splash of milk.', doodh: 'Mostly or all milk.', spicebox: 'Three spices or more.', kadak: 'Boiled three times or more, simmered, or brewed five minutes plus.', adrak: 'Ginger, with at most one other spice.', everyday: 'None of the above: the classic.' };
  const FAMBLK = { key: 'fam', live: true, cls: 'c-title', render: () => {
    if (meEmpty()) return `<div class="blk" style="background:#3A2C1F"><div class="blk-dots"><i></i><i></i><i></i></div><div class="blk-k">Your family</div><div class="blk-h">Not yet poured</div><div class="blk-q">Scroll back up and make a cup: even water and a tea bag counts.<span class="cue"><button type="button" data-act="goto" data-to="cold-ask" style="text-decoration:underline">Back to the cold pan ↑</button></span></div></div>`;
    const fk = C.family(meR()), F = C.FAM[fk];
    return `<div class="blk" style="background:${A.FAMX[fk].block}"><div class="blk-dots"><i></i><i></i><i></i></div><div class="blk-k">Your family · ${S.fam[fk]} of ${N} readers</div><div class="blk-h">${F.name}</div><div class="blk-hi">${A.FAMX[fk].hi}</div><div class="blk-q">${F.blurb}</div></div>`;
  } };
  const SHADE = { key: 'shade', live: true, render: () => {
    const sh = C.shade(meR());
    const cells = []; for (let r = -1; r < 6; r++) for (let c = -1; c < 6; c++) cells.push(r < 0 && c < 0 ? '<span></span>' : r < 0 ? `<span>${c + 1}</span>` : c < 0 ? `<span>${'ABCDEF'[r]}</span>` : `<i class="${sh && ME.teas.length && sh.row === r && sh.col === c ? 'me' : ''}" style="background:${C.cellColour(r, c)}"></i>`);
    return `<div class="shgrid">${cells.join('')}</div><div class="c-lab">${sh && ME.teas.length ? `yours is <b>${sh.code}</b>` : 'add leaf to find yours'}<small>stronger going down, less milky going right</small></div>`;
  } };
  const FORMULA = { key: 'formula', live: true, render: () => {
    const R = meR(), f = C.formula(R), fk = C.family(R), fams = Object.keys(C.FAM);
    return `${A.strip(R, { you: true })}<div class="formula">${esc(f.head)}<span class="seq">${esc(f.seq)}</span></div>
      <div class="famrow">${fams.map(k => `<div title="${C.FAM[k].name}: ${S.fam[k]}" style="flex:${S.fam[k]};background:${A.FAMX[k].block};opacity:${k === fk && !meEmpty() ? 1 : .3}"></div>`).join('')}</div>
      <div class="c-note">${meEmpty() ? 'Six families, sorted by simple rules.' : 'How we sort: ' + FAM_RULE[fk]}</div>`;
  } };
  const REL = i => ({ key: 'rel:' + i, live: true, cls: 'c-rel', render: () => {
    if (meEmpty()) return `<div class="c-note" style="margin:auto">appears once you’ve made a cup</div>`;
    const R = meR(), r = RS.map(x => ({ x, d: C.distance(R, x) })).sort((a, b) => a.d - b.d)[i].x;
    const q = r.reader.quote || r.reader.special;
    return `<div class="rel-top">${vesselFor(r, { type: r.vessel })}<div><div class="rel-n">${esc(r.name.length > 20 ? r.name.slice(0, 20) + '…' : r.name)}</div><div class="rel-w">${who(r.reader)}</div></div></div>${A.strip(r)}${q ? `<q>${esc(q)}</q>` : ''}`;
  } });
  const POUR = { key: 'pour', tag: 'button', cls: 'c-pourcell', attrs: () => ({ 'data-act': 'pour', 'aria-label': 'Pour my card' }), render: () => `<div class="c-btn"><span class="pour">Pour my card</span><small>your chai, illustrated, with its timeline</small></div>` };
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
  const VOICE = (id, q) => { const r = byId(id);
    return { key: 'voice:' + id, cls: 'c-voice', tag: 'button', attrs: () => ({ 'data-act': 'voice', 'aria-label': `${r.name}, ${r.reader.town || 'a reader'}: ${q}` }), pad0: true,
      render: () => `<div class="v-in"><div class="vf"><div class="c-art">${vesselFor(r, { type: r.vessel })}</div><div class="ing-name">${esc(r.name.length > 18 ? r.name.slice(0, 18) + '…' : r.name)}</div><div class="ing-hint">${who(r.reader)}</div>${A.strip(r)}</div>
        <div class="vf vb"><div class="qt" data-fit="grow" data-max="24" data-mmax="16"><q>${esc(q)}</q></div><div class="v-who">${esc(r.name)} · ${who(r.reader)}</div>${A.strip(r)}</div></div>` }; };
  const RTITLE = (key, h, d) => ({ key: 'rtitle:' + key, render: () => `<div class="rt"><div class="pz-k">From readers’ kitchens</div><h3 class="pz-h">${h}</h3><p class="pz-d">${d}</p></div>` });
  const RESP = { cold: ['Who puts what in first', 'Four readers on water, milk and the cold pan.'], heat: ['The spice obsessives', 'Four readers on their larders.'], boil: ['Counting the boils', 'Four readers on the moment it rises.'],
    off: ['After the flame', 'Four readers on how long the leaf stays.'], cup: ['At the table', 'Four readers on cups, sugar and company.'], end1: ['Kitchen voices', 'More from readers, in their own words.'], end2: ['Kitchen voices', 'And four more, to try tomorrow morning.'] };
  // ---------- Paragraphs between the chapters ----------
  function panSoFar() {
    if (meEmpty()) return `<p class="pan-so-far"><em>your pan</em>Still empty. You can scroll back and fill it at any point; everything below will follow.</p>`;
    const R = meR(), bits = [];
    if (R.milk != null) bits.push(R.milk === 0 ? 'water, no milk' : R.milk === 5 ? 'milk, no water' : `water and ${L.milk[R.milk]} milk`);
    if (R.extras.length) bits.push(R.extras.map(s => L.spice[s]).join(', '));
    if (R.teas.length) bits.push(R.teas.map(t => L.tea[t]).join(' and ') + (R.st.tea != null ? ` (in at ${L.stage[R.st.tea]})` : ''));
    if (R.sweet && R.sweet !== 'none') bits.push(L.sweet[R.sweet]);
    const sh = C.shade(R);
    return `<p class="pan-so-far"><em>your pan</em>So far: ${bits.join('; ')}.${sh && R.teas.length ? ` Shade <b>${sh.code}</b>, ${C.FAM[C.family(R)].name}.` : ''}</p>`;
  }
  const P = {
    intro: () => `<p>I know my tea recipe is arduous, and I’ve never met anyone who makes it exactly the way I do. Everyone at home has an opinion about it. Everyone at home is wrong, obviously.</p><p>So we asked. Readers of First Principles told us their milk, their leaf, their spices and, most importantly, their <i>sequence</i>: when each thing goes in, and how many times it’s allowed to boil. Of <b>${N}</b> recipes, <b>${S.uniqueSeq}</b> were one of a kind.</p><p>You’ll make yours as you read: tap an ingredient to put it in your pan, tap its icon to take it out. The clock moves as you scroll. Your recipe stays in your browser; nothing is saved or sent.</p>`,
    cold: () => `<p>Every cup starts the same way: a pan, a flame not yet lit, and a decision about what goes in before the heat. Most readers start with water and treat milk as a guest. <b>${S.mostlyWater}</b> of ${N} make a cup that is mostly water, and <b>${S.milkStart}</b> put milk in the cold pan right at the start.</p><p>Chai is also rarely made for one. <b>${S.cups2}</b> readers usually make two cups at a time; <b>${S.cups3p}</b> make three or more. Only <b>${S.cups1}</b> make a single cup.</p><p>So begin as you begin at home. The pan in the middle is yours, and it will cook as you scroll.</p>`,
    heat: () => `<p>As the pan warms, the larder opens. Whole and crushed spices give up their flavour slowly in hot water, which is why most readers add them early, before the leaf and the milk can mute them.</p><p>Ginger dominates: <b>${S.sp.ginger}</b> readers use it, usually crushed or grated. But this is also where the obsessives show themselves, with spices dry-roasted, pounded, timed to the second or held back until the very end.</p><p>Add yours, and say when they go in.</p>`,
    boil: () => `<p>Now the pan is boiling, and this is the moment that divides households. <b>${S.teaBoil}</b> readers wait for the boil before the leaf goes in; <b>${S.teaStart}</b> put it in the cold pan with everything else.</p><p>Most of them use CTC (<b>${S.ctc}</b> readers). The name stands for crush, tear, curl: the leaf is rolled into small granules that colour a pan in seconds. Then comes the milk, and the old argument about how many times it should be allowed to rise.</p>`,
    off: () => `<p>The flame goes off, but the leaf keeps working. The longer tea sits, the more colour and body it gives, and eventually the more bitterness.</p><p>Some readers strain within a minute. <b>${S.longBrew}</b> leave it for five minutes or more. And <b>${S.colour}</b> don’t use a clock at all: they strain when <q>the colour looks right</q>.</p>`,
    cup: () => `<p>The last decisions happen at the table: whether it’s sweetened in the pan or in the cup, and what it’s poured into.</p><p><b>${S.noSugar}</b> readers take no sugar at all, more than any single sweetener. <b>${S.jaggery}</b> use jaggery. And the vessel matters more than you’d think: <b>${S.vessel.mug}</b> drink from a mug, <b>${S.vessel.cup}</b> from a cup and saucer, and at least one of them has strong views about the other.</p>`
  };

  // ---------- Scenes ----------
  // d: 6 columns × 4 rows (tablet and up) · m: 4 columns × 6 rows (phones). Same letter = one cell; '.' = an empty box.
  // t is the time on the stove for that scene.
  // Your pan is always in the centre: columns 3–4 of the top half on wide screens, columns 2–3 on phones.
  const CD = ['x x Y Y k k', 'x x Y Y k k', 'c c c c c c', 'c c c c c c'];
  const CM = ['. Y Y .', 'x x x x', 'x x x x', 'c c c c', 'c c c c', 'c c c c'];
  const PD = ['T T Y Y I I', 'T T Y Y I I', 'P P P P P P', 'P P P P P P'];
  const PM = ['. Y Y .', '. Y Y .', 'T T T T', 'P P P P', 'P P P P', 'P P P P'];
  const SC = [];
  const dataScenes = (ch, t, head) => CH[ch].steps.forEach((s, i) => SC.push({ id: ch + '-' + i, t, h: 80, head, d: CD, m: CM, chart: { ch, step: i }, cells: { Y: TEA, c: CHART(ch), x: STEP(ch, i), k: YOU(ch, i) } }));
  const RD = ['1 1 Y Y 2 2', '1 1 Y Y 2 2', '3 3 x x 4 4', '3 3 x x 4 4'], RM = ['. Y Y .', 'x x x x', '1 1 2 2', '1 1 2 2', '3 3 4 4', '3 3 4 4'];
  const responses = (key, t, head) => { const cells = { Y: TEA, x: RTITLE(key, ...RESP[key]) }; Q[key].forEach(([id, q], i) => cells[String(i + 1)] = VOICE(id, q));
    SC.push({ id: 'resp-' + key, t, h: 70, head, d: RD, m: RM, cells }); SC.push({ id: 'resp-' + key + '-b', t, h: 100, head, d: RD, m: RM, cells, flip: true }); };
  const chapter = (id, t, head) => SC.push({ id, t, h: 110, head, d: PD, m: PM, cells: { Y: TEA, T: TITLE(id), I: ILLUS(id), P: PROSE(id, P[id]) } });

  SC.push({ id: 'specimens', t: 0, h: 120, head: 'Three specimens',
    d: ['A A Y Y B B', 'A A Y Y B B', 'x x x C C C', 'x x x C C C'],
    m: ['. Y Y .', '. Y Y .', 'A A B B', 'A A B B', 'C C x x', 'C C x x'],
    cells: { Y: TEA, A: SPEC('khi044', '01', 'the standard', 'New Delhi'), B: SPEC('vnskyu', '02', 'the tapri', 'Mumbai'), C: SPEC('j0mha9', '03', 'the obsessive', 'Bengaluru'),
      x: TEXT('cover', '', () => `<div class="pz-k">How to read a recipe</div>Three of ${N} recipes. Each icon sits at the moment it goes in, from the cold pan to the cup. Flames count the boils.<span class="hint">Yours is the empty pan in the middle. Scroll, and we’ll cook it the way you do.</span>`) } });

  const H1 = 'I · The cold pan';
  chapter('cold', 0, H1);
  SC.push({ id: 'cold-ask', t: 0, h: 160, head: H1,
    d: ['w w Y Y k k', 'w w Y Y k k', 's s s q q q', 't t t q q q'],
    m: ['w Y Y k', 'w Y Y k', 's s s s', 't t t t', 'q q q q', 'q q q q'],
    cells: { Y: TEA, w: ING('water'), k: ING('milk'),
      s: NOTE('milkShare', 'How much of the cup is milk?', () => [[1, 'a splash'], [2, 'a quarter'], [3, 'half'], [4, 'mostly'], [5, 'all milk']], () => ME.milkOn, 'add milk first'),
      t: NOTE('milkType', 'Which milk?', () => [['toned', 'toned'], ['full', 'full-cream'], ['skim', 'double-toned'], ['plant', 'plant'], ['condensed', 'condensed']], () => ME.milkOn, 'add milk first'),
      q: NOTE('milkIn', 'When does the milk go in?', () => [[0, 'cold pan'], [1, 'heating'], [2, 'boiling'], [4, 'in the cup']], () => ME.milkOn, 'add milk first') } });
  dataScenes('pour', 0, H1);
  responses('cold', 0, H1);

  const H2 = 'II · Heating up';
  chapter('heat', 1, H2);
  SC.push({ id: 'heat-ask', t: 1, h: 160, head: H2,
    d: ['1 2 Y Y 3 4', '5 6 Y Y 7 8', '9 0 a b w w', 'e e e e w w'],
    m: ['1 Y Y 2', '3 Y Y 4', '5 6 7 8', '9 0 a b', 'w w w w', 'w w w w'],
    cells: { Y: TEA, w: SPICEBOOK, e: TEXT('spicetime', '', () => `${kfig(S.sepTimed, 'readers add their spices at different moments', S.spiced)}<span class="hint">Out of ${S.spiced} who use two or more. Like the reader who adds cardamom only once the heat is off.</span>`), ...Object.fromEntries(SPICE_SHELF.map((k, i) => ['1234567890ab'[i], ING(k)])) } });
  dataScenes('larder', 1, H2);
  responses('heat', 1, H2);

  const H3 = 'III · The boil';
  chapter('boil', 2, H3);
  SC.push({ id: 'boil-ask', t: 2, h: 170, head: H3,
    d: ['1 2 Y Y 3 4', '5 6 Y Y 7 h', 'a a i i b b', 'a a i i b b'],
    m: ['1 Y Y 2', '3 Y Y 4', '5 6 7 h', 'a a a a', 'i i i i', 'b b b b'],
    cells: { Y: TEA, 1: ING('ctc'), 2: ING('leaf'), 3: ING('dust'), 4: ING('bag'), 5: ING('darjeeling'), 6: ING('assam'), 7: ING('green'),
      h: HINT('boil', 'Tap a leaf to add it. Then circle how much, and when it goes in.'),
      a: NOTE('amt', 'How much tea per cup?', () => [[0, '<½ tsp'], [1, '½ tsp'], [2, '1 tsp'], [3, '1½ tsp'], [4, '2+ tsp'], [5, 'eyeballed']].concat(ME.teas.includes('bag') ? [[6, 'one bag']] : []), () => ME.teas.length, 'add a leaf first'),
      i: NOTE('teaIn', 'When does the leaf go in?', () => [[0, 'cold pan'], [1, 'heating'], [2, 'boiling'], [3, 'heat off']], () => ME.teas.length, 'add a leaf first'),
      b: NOTE('boils', 'After the milk, how many times does it boil up?', () => L.boils.map((l, i) => [i, l]), () => ME.milkOn && ME.milkIn !== 4, 'only if milk goes in the pan') } });
  dataScenes('sequence', 2, H3);
  responses('boil', 2, H3);

  const H4 = 'IV · Off the flame';
  chapter('off', 3, H4);
  SC.push({ id: 'off-ask', t: 3, h: 130, head: H4,
    d: ['x x Y Y q q', 'x x Y Y q q', 'r r r r r r', 'r r r r r r'],
    m: ['. Y Y .', '. Y Y .', 'r r r r', 'r r r r', 'x x q q', 'x x q q'],
    cells: { Y: TEA, r: NOTE('brew', 'Once the leaf is in, how long until you strain?', () => L.brew.map((l, i) => [i, l]), () => ME.teas.length, 'add a leaf first (chapter III)'),
      x: TEXT('offnote', '', () => `${kfig(S.quick, 'readers are done in under a minute')}<b>${S.longBrew}</b> wait five minutes or more.`),
      q: QUOTE('8etsq8', 'Once it boils, add a teaspoon of Darjeeling long leaf for each cup and steep for 2.5 minutes. Strain and drink it.') } });
  dataScenes('leaf', 3, H4);
  responses('off', 3, H4);

  const H5 = 'V · In the cup';
  chapter('cup', 3, H5);
  SC.push({ id: 'cup-ask', t: 4, h: 170, head: H5,
    d: ['p q Y Y r z', 'u u Y Y o o', 'a b c d n n', 'a b c d n n'],
    m: ['p Y Y q', 'r Y Y z', 'u u o o', 'a b c d', 'n n n n', 'n n n n'],
    cells: { Y: TEA, p: ING('sugar'), q: ING('jaggery'), r: ING('honey'), z: ING('free'),
      u: NOTE('sugarAmt', 'How much sugar?', () => [['sugar1', 'under a spoon'], ['sugar2', 'one spoon'], ['sugar3', 'two or more']], () => ME.sweet === 'sugar', 'only if you add sugar'),
      o: NOTE('sweetIn', 'When is it sweetened?', () => [[0, 'cold pan'], [2, 'boiling'], [3, 'heat off'], [4, 'in the cup']], () => ME.sweet, 'add a sweetener first'),
      n: NOTE('name', 'And what do you call it?', () => [['Chai', 'chai'], ['Cha', 'cha'], ['Chaya', 'chaya'], ['Chaha', 'chaha'], ['Tea', 'tea']]),
      a: VES('glass'), b: VES('cup'), c: VES('mug'), d: VES('tumbler') } });
  dataScenes('cup', 4, H5);
  responses('cup', 4, H5);

  SC.push({ id: 'yours', t: 4, h: 160, head: 'Your chai',
    d: ['F F Y Y S S', 'F F Y Y S S', 'f f 1 2 3 P', 'f f 1 2 3 P'],
    m: ['. Y Y .', 'F F S S', 'F F S S', 'f f f f', '1 1 2 2', '3 3 P P'],
    cells: { Y: TEA, F: FAMBLK, S: SHADE, f: FORMULA, 1: REL(0), 2: REL(1), 3: REL(2), P: POUR } });
  responses('end1', 4, 'Kitchen voices');
  responses('end2', 4, 'Kitchen voices');
  SC.push({ id: 'outro', t: 4, h: 130, head: 'Fin',
    d: ['x x Y Y P P', 'x x Y Y P P', 'S S S f f f', 'S S S f f f'],
    m: ['. Y Y .', '. Y Y .', 'x x x x', 'x x x x', 'P P P P', 'P P P P'],
    cells: { Y: TEA, P: POUR, S: SHADE, f: FORMULA, x: TEXT('outro', '', () => `<div class="pz-k">Postscript</div>Your tea is yours. It turns out it has relatives you didn’t know about, and ${N} kitchens’ worth of ideas to steal.<span class="hint">Try someone else’s recipe tomorrow morning. Then send your card to whoever at home makes it “wrong”.</span>`) } });

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
  const INK_FROM = 'inset(0% 100% 0% 0%)', INK_TO = 'inset(0% 0% 0% 0%)';
  function go(idx) {
    busy = true;
    const first = curIdx < 0;
    const sc = idx >= 0 ? SC[idx] : null;
    const prevT = NOW_T;
    if (sc) NOW_T = sc.t;
    const layout = sc ? parse(sc[mode]) : {};
    const want = {};
    if (!sc) { const l0 = parse(SC[0][mode]); want.tea = { rect: l0.Y, spec: TEA }; NOW_T = 0; }
    if (sc) Object.entries(layout).forEach(([id, rect]) => { if (id[0] === '.') return; const spec = sc.cells[id]; if (!spec) { console.warn('no cell for', id, sc.id); return; } want[spec.key] = { rect, spec }; });
    const tl = gsap.timeline({ onComplete: () => { busy = false; curIdx = idx; if (target !== idx) go(target); } });
    let n = 0;
    Object.keys(cur).forEach(key => {
      if (want[key]) return;
      const e = cur[key]; delete cur[key]; e.leaving = true;
      tl.to(e.inner, { autoAlpha: 0, y: -6, duration: .22, ease: 'power1.in', onComplete: () => { if (e.spec.unmount) e.spec.unmount(); e.el.remove(); } }, (n++) * .01);
    });
    const nl = sc ? linesFor(layout) : {};
    Object.keys(curLines).forEach(k => { if (nl[k]) return; const el = curLines[k]; delete curLines[k]; tl.to(el, { attr: { 'stroke-dashoffset': -1 }, duration: .3, ease: 'power1.in', onComplete: () => el.remove() }, 0); });
    let m = 0;
    Object.entries(nl).forEach(([k, seg]) => {
      if (curLines[k]) { placeLine(curLines[k], seg); return; }
      const el = document.createElementNS(NS, 'line'); el.setAttribute('pathLength', '1'); el.setAttribute('stroke-dasharray', '1 1'); el.setAttribute('stroke-dashoffset', '1');
      placeLine(el, seg); svg.appendChild(el); curLines[k] = el;
      tl.to(el, { attr: { 'stroke-dashoffset': 0 }, duration: first ? 1.1 : .5, ease: 'power2.inOut' }, (first ? .05 : .18) + (m++) * (first ? .05 : .012));
    });
    let a = 0;
    Object.entries(want).forEach(([key, w]) => {
      const e = cur[key];
      if (e) {
        e.spec = w.spec;
        if (!sameRect(e.rect, w.rect)) { e.rect = w.rect; const ck = key.startsWith('chart:') ? key.slice(6) : null; tl.to(e.el, { ...px(w.rect), duration: .6, ease: 'power3.inOut', onUpdate: () => { if (ck && LIVE[ck]) LIVE[ck].chart.resize(); }, onComplete: () => fit(e.inner) }, .1); }
        if (w.spec.live) paint(e);
        if (key === 'tea' && prevT < 4 && NOW_T >= 4) { const v = e.inner.querySelector('.vessel'); if (v) tl.from(v, { y: -40, autoAlpha: 0, duration: .7, ease: 'bounce.out' }, .2); }
        return;
      }
      const ne = makeCell(key, w.spec, w.rect);
      cur[key] = ne;
      if (!sc) { gsap.set(ne.inner, { autoAlpha: 1 }); return; }
      gsap.set(ne.inner, { clipPath: INK_FROM, autoAlpha: 1 });
      tl.to(ne.inner, { clipPath: INK_TO, duration: .6, ease: 'power2.inOut', clearProps: 'clipPath' }, (first ? .5 : .24) + (a++) * .04);
    });
    $('sheet').classList.toggle('at-intro', !sc);
    let fv = 0;
    Object.entries(cur).forEach(([k, e]) => { if (!k.startsWith('voice:')) return; const on = !!(sc && sc.flip); if (e.inner.classList.contains('on') !== on) tl.call(() => e.inner.classList.toggle('on', on), null, .35 + (fv++) * .14); });
    if (sc && sc.chart) { const lv = LIVE[sc.chart.ch]; if (lv) { lv.step = sc.chart.step; tl.call(() => drawChart(sc.chart.ch), null, .3); } }
    $('shPage').textContent = String(Math.max(0, idx) + 1).padStart(2, '0');
    setHead(sc ? sc.head : 'Chai elements', sc ? sc.t : 0);
  }

  function updateIntro() {}
  // Running head: where you are on the left, the pan's temperature on the right.
  const TEMP = [24, 68, 100, 94, 78];
  const temp = { v: 24 };
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
  function compBar() {
    const el = $('shComp'); if (!el) return;
    const segs = compSegs(NOW_T), total = segs.length ? 1 : 0;
    el.innerHTML = total ? `<span class="cb">${segs.map(([l, v, c]) => { const p = v / total; return `<i style="flex:${p};background:${c}" title="${l} · ${Math.max(1, Math.round(p * 100))}%">${p > .17 ? `<em>${l} ${Math.round(p * 100)}%</em>` : ''}</i>`; }).join('')}</span>`
      : `<span class="cb cb-empty"><em>empty</em></span>`;
  }
  function setHead(label, t) {
    $('shLeft').textContent = label;
    compBar();
    gsap.to(temp, { v: TEMP[Math.min(4, t)], duration: .9, ease: 'power2.out', overwrite: true, onUpdate: () => {
      const v = Math.round(temp.v), f = (v - 20) / 80;
      $('shDeg').textContent = v;
      $('shMerc').setAttribute('height', (4 + 20 * f).toFixed(1)); $('shMerc').setAttribute('y', (27 - 20 * f).toFixed(1));
      $('shTemp').style.color = v >= 95 ? '#A8321F' : v >= 60 ? '#8A4A1E' : '#3D6FB6';
    } });
  }
  function onScroll() {
    const vh = innerHeight / 100;
    const pos = (scrollY - wrap.offsetTop) / vh;
    let idx = -1;
    updateIntro(pos);
    if (pos >= STARTS[0]) { idx = 0; for (let i = 0; i < SC.length; i++) if (STARTS[i] <= pos) idx = i; }
    if (idx !== target) { target = idx; if (!busy && target !== curIdx) go(target); }
  }
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
  function refresh(added) {
    Object.values(cur).forEach(e => {
      if (!e.spec.live || e.leaving) return;
      const ae = document.activeElement, sel = ae && e.inner.contains(ae) && ae !== e.inner ? ['act', 'k', 'f', 'v'].map(a => ae.dataset[a] != null ? `[data-${a}="${ae.dataset[a]}"]` : '').join('') : null;
      paint(e);
      if (sel) { const f = e.inner.querySelector(sel); if (f) f.focus({ preventScroll: true }); }
    });
    if (cur.tea) {
      if (added) { const it = cur.tea.inner.querySelector(`.strip .si[data-k="${added}"]`); if (it) gsap.from(it, { scale: 0, y: -30, rotation: -40, duration: .5, ease: 'back.out(2)' }); }
      const v = cur.tea.inner.querySelector('.vessel'); if (v) gsap.fromTo(v, { rotate: -1.5 }, { rotate: 0, duration: .6, ease: 'elastic.out(1, .4)', transformOrigin: '50% 100%' });
    }
    Object.keys(LIVE).forEach(drawChart);
    compBar();
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
    // your pan, on the boil
    g += nest(A.pan(C.cellColour(2, 2), 2, { float: ['ginger', 'cardamom'] }), 455, ground - 540 * 1.15 + 18, 540, 'lp');
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
    if (meEmpty()) { toast('Make a cup first: add something to your pan.'); scrollToScene('cold-ask'); return; }
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

  // ---------- Events ----------
  let toastT;
  function toast(msg) { const t = $('toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 2200); }
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-act]'); if (!el) return;
    const a = el.dataset.act, k = el.dataset.k;
    if (a === 'tile') { const was = inPot(k); toggle(k); refresh(was ? null : k); }
    else if (a === 'out') { gsap.to(el, { scale: 0, rotation: 30, opacity: 0, duration: .2, onComplete: () => { toggle(k); refresh(); } }); }
    else if (a === 'vessel') { ME.vessel = ME.vessel === el.dataset.v ? null : el.dataset.v; refresh(); }
    else if (a === 'opt') {
      const f = el.dataset.f, v = el.dataset.v, num = ['milkShare', 'amt', 'brew', 'boils', 'milkIn', 'teaIn', 'sweetIn'].includes(f);
      const keep = f === 'milkShare' || f === 'sugarAmt';
      ME[f] = String(ME[f]) === v && !keep ? null : (num ? +v : v);
      if (f === 'milkShare') ME.water = ME.milkShare !== 5;
      if (f === 'brew') ME.touched.brew = true;
      refresh();
    }
    else if (a === 'sst') { const v = +el.dataset.v; ME.spiceSt[k] = ME.spiceSt[k] === v ? null : v; refresh(); }
    else if (a === 'form') { const list = FORMS[k]; ME.forms[k] = list[(list.indexOf(ME.forms[k]) + 1) % list.length]; refresh(); }
    else if (a === 'voice') { el.classList.toggle('on'); }
    else if (a === 'pour') { openCard(); }
    else if (a === 'goto') { scrollToScene(el.dataset.to); }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('modal').hidden) closeCard(); });
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
