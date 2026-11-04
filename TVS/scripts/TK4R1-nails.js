// scripts/TK4R1-nails.js — TK4R1 · Nails on the road
// Needs TK4R1_GEO from scripts/TK4R1-nails_data.js (loaded first).

document.addEventListener("DOMContentLoaded", function () {
  const wrapper = document.getElementById("TK4R1-wrapper");
  const stage   = document.getElementById("TK4R1-stage");
  if (!wrapper || !stage || typeof TK4R1_GEO === "undefined") return;

  gsap.registerPlugin(ScrollTrigger);
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  // read tokens from the section: it runs as a dark island (TK4R-theme-dark) on the light page
  const css = n => getComputedStyle(stage).getPropertyValue(n).trim();
  const px  = n => parseFloat(css(n)) || 14;
  const isMobile = () => stage.clientWidth <= 768;

  /* ---------------- 1. Data ---------------- */
  const CITIES = [
    { name: "Madurai",     c: [78.12, 9.925] },
    { name: "Thanjavur",   c: [79.139, 10.787] },
    { name: "Pudukkottai", c: [78.821, 10.381] }
  ];
  const TOWNS = [
    { name: "Tiruchirappalli", c: [78.69, 10.80] },
    { name: "Dindigul",        c: [77.98, 10.36] },
    { name: "Sivaganga",       c: [78.48, 9.85] },
    { name: "Kumbakonam",      c: [79.38, 10.96] },
    { name: "Melur",           c: [78.338, 10.032] },
    { name: "Tirumayam",       c: [78.75, 10.245] }
  ];
  // Closed loop: Madurai → Thanjavur → Pudukkottai → back to Madurai
  const ROUTE = [
    [78.12, 9.925], [78.338, 10.032], [78.40, 10.20], [78.52, 10.47], [78.70, 10.60],
    [78.92, 10.71], [79.139, 10.787], [79.03, 10.58], [78.821, 10.381], [78.75, 10.245],
    [78.60, 10.11], [78.48, 9.87], [78.28, 9.86]
  ];

  /* ---------------- 2. Map (ECharts) ---------------- */
  echarts.registerMap("TK4R1-region", TK4R1_GEO);
  const chart = echarts.init(document.getElementById("TK4R1-chart"), null, { renderer: "canvas" });

  function mapLayout() {
    const w = stage.clientWidth, h = stage.clientHeight;
    if (isMobile()) return { center: ["50%", "36%"], size: Math.min(w * 1.55, h * 0.95) };
    return { center: ["65%", "50%"], size: Math.min(w * 0.82, h * 1.35) };
  }

  function buildOption() {
    const L = mapLayout();
    const fontDisplay = css("--font-display"), fontBody = css("--font-body");
    return {
      backgroundColor: css("--map-sea"),
      animation: false,
      geo: {
        map: "TK4R1-region", roam: false, silent: true,
        layoutCenter: L.center, layoutSize: L.size,
        center: [78.66, 10.36], zoom: 2.45,
        itemStyle: { areaColor: css("--map-land"), borderColor: css("--map-border"), borderWidth: 0.8 },
        regions: CITIES.map(c => ({ name: c.name, itemStyle: { areaColor: css("--map-land-focus") } })),
        label: { show: false }
      },
      series: [
        { type: "scatter", coordinateSystem: "geo", silent: true, symbol: "circle", symbolSize: 4,
          itemStyle: { color: css("--color-muted") },
          label: { show: true, position: "right", distance: 4, color: css("--color-muted"),
                   fontFamily: fontBody, fontWeight: 500, fontSize: px("--type-legend") },
          data: TOWNS.map(t => ({ name: t.name, value: t.c, label: { formatter: t.name } })) },
        { type: "scatter", coordinateSystem: "geo", silent: true, symbolSize: 12,
          itemStyle: { color: css("--color-primary"), borderColor: css("--color-surface"), borderWidth: 2 },
          label: { show: true, color: css("--color-text"), fontFamily: fontDisplay, fontWeight: 600,
                   fontSize: px("--type-subheading"), textBorderColor: css("--map-land"), textBorderWidth: 3 },
          data: CITIES.map(c => ({ name: c.name, value: c.c, label: { formatter: c.name,
            position: c.name === "Thanjavur" ? "top" : (c.name === "Madurai" ? (isMobile() ? "bottom" : "left") : "right"), distance: 10 } })) },
        { type: "scatter", coordinateSystem: "geo", silent: true, symbolSize: 0,
          label: { show: true, formatter: "{b}", color: css("--color-muted"), fontFamily: fontDisplay,
                   fontStyle: "italic", fontSize: px("--type-body"), opacity: 0.8 },
          data: [{ name: "Palk Bay", value: [79.35, 9.9] }] }
      ]
    };
  }

  /* ---------------- 3. Path geometry ---------------- */
  let path = { pts: [], cum: [], len: 1 };
  function project(c) { return chart.convertToPixel({ geoIndex: 0 }, c); }
  function buildPath() {
    const P = ROUTE.map(project), n = P.length, out = [];
    for (let i = 0; i < n; i++) {
      const p0 = P[(i - 1 + n) % n], p1 = P[i], p2 = P[(i + 1) % n], p3 = P[(i + 2) % n];
      for (let s = 0; s < 24; s++) {
        const t = s / 24, t2 = t * t, t3 = t2 * t;
        out.push([
          .5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
          .5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)
        ]);
      }
    }
    out.push(out[0].slice());
    const cum = [0];
    for (let i = 1; i < out.length; i++) cum.push(cum[i - 1] + Math.hypot(out[i][0] - out[i - 1][0], out[i][1] - out[i - 1][1]));
    path = { pts: out, cum, len: cum[cum.length - 1] };
    const d = "M" + out.map(p => p[0].toFixed(1) + "," + p[1].toFixed(1)).join("L");
    ["TK4R1-road", "TK4R1-road-under", "TK4R1-service"].forEach(id => document.getElementById(id).setAttribute("d", d));
  }
  function pointAt(t, lane = 0) {
    t = ((t % 1) + 1) % 1;
    const target = t * path.len, c = path.cum;
    let lo = 0, hi = c.length - 1;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (c[m] < target) lo = m; else hi = m; }
    const a = path.pts[lo], b = path.pts[hi], seg = (c[hi] - c[lo]) || 1, f = (target - c[lo]) / seg;
    const dx = b[0] - a[0], dy = b[1] - a[1], dl = Math.hypot(dx, dy) || 1;
    return { x: a[0] + dx * f - dy / dl * lane, y: a[1] + dy * f + dx / dl * lane, dx, dy };
  }

  /* ---------------- 4. Sprite art (token colours only) ---------------- */
  const INK = "var(--color-text)", PAPER = "var(--color-surface)", RED = "var(--color-primary)";
  const BRASS = "var(--color-mustard)", STEEL = "var(--color-muted)", GLASS = "var(--cat-6)";
  const ART = {
    bullock: `<svg viewBox="0 0 58 34">
      <path d="M2 21 L2 9 Q2 5 6 5 L22 5 Q26 5 26 9 L26 21 Z" fill="${BRASS}" stroke="${INK}" stroke-width="1.6"/>
      <path d="M4 5 Q14 -2 24 5" fill="none" stroke="${INK}" stroke-width="1.6"/>
      <line x1="26" y1="18" x2="36" y2="18" stroke="${INK}" stroke-width="1.6"/>
      <circle cx="14" cy="24" r="8" fill="${PAPER}" stroke="${INK}" stroke-width="1.8"/>
      <path d="M14 16v16M6 24h16M8.5 18.5l11 11M19.5 18.5l-11 11" stroke="${INK}" stroke-width="1"/>
      <path d="M34 14 Q34 9 40 9 L49 9 Q53 9 53 13 L53 20 Q53 22 51 22 L37 22 Q34 22 34 19 Z" fill="${PAPER}" stroke="${INK}" stroke-width="1.6"/>
      <path d="M51 11 L55 7 L57 9 L56 13 Z" fill="${PAPER}" stroke="${INK}" stroke-width="1.4"/>
      <path d="M54 7 Q55 2 52 1M55 7 Q58 4 57 1" fill="none" stroke="${INK}" stroke-width="1.4"/>
      <path class="TK4R1-leg TK4R1-l1" d="M37 22 L36 32M41 22 L42 32" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>
      <path class="TK4R1-leg TK4R1-l2" d="M47 22 L46 32M51 22 L52 32" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    horse: `<svg viewBox="0 0 58 34">
      <path d="M3 18 L5 8 L22 8 L24 18 Z" fill="${PAPER}" stroke="${INK}" stroke-width="1.6"/>
      <path d="M3 8 L13 3 L24 8" fill="${RED}" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>
      <line x1="22" y1="15" x2="36" y2="14" stroke="${INK}" stroke-width="1.6"/>
      <circle cx="14" cy="23" r="9" fill="none" stroke="${INK}" stroke-width="1.8"/>
      <path d="M14 14v18M5 23h18M7.6 16.6l12.8 12.8M20.4 16.6l-12.8 12.8" stroke="${INK}" stroke-width=".9"/>
      <path d="M34 13 Q35 10 40 10 L48 10 L51 4 L56 5 L56 9 L53 10 L52 17 Q51 20 47 20 L38 20 Q34 20 34 17 Z" fill="${STEEL}" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round"/>
      <path class="TK4R1-leg TK4R1-l1" d="M37 20 L35 32M41 20 L43 32" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>
      <path class="TK4R1-leg TK4R1-l2" d="M46 20 L45 32M50 19 L52 32" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    bus: `<svg viewBox="0 0 62 42">
      <rect x="3" y="7" width="50" height="22" rx="2" fill="${BRASS}" stroke="${INK}" stroke-width="1.8"/>
      <path d="M3 7 Q28 1 53 7" fill="${INK}" stroke="${INK}" stroke-width="1.8"/>
      <path d="M53 15 L60 17 L60 29 L53 29 Z" fill="${BRASS}" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>
      <rect x="7" y="11" width="9" height="8" fill="${PAPER}" stroke="${INK}" stroke-width="1.2"/>
      <rect x="19" y="11" width="9" height="8" fill="${PAPER}" stroke="${INK}" stroke-width="1.2"/>
      <rect x="31" y="11" width="9" height="8" fill="${PAPER}" stroke="${INK}" stroke-width="1.2"/>
      <rect x="43" y="11" width="7" height="12" fill="${PAPER}" stroke="${INK}" stroke-width="1.2"/>
      <line x1="5" y1="23" x2="41" y2="23" stroke="${RED}" stroke-width="2.4"/>
      <g class="TK4R1-magnet">
        <path d="M22 31 L22 35 Q22 39 28 39 Q34 39 34 35 L34 31" fill="none" stroke="${RED}" stroke-width="4"/>
        <path d="M22 33 L22 35M34 33 L34 35" stroke="${STEEL}" stroke-width="4.2"/>
        <path class="TK4R1-field" d="M18 42 Q28 48 38 42M14 45 Q28 54 42 45" fill="none" stroke="${RED}" stroke-width="1.2" stroke-dasharray="2 3"/>
      </g>
      <g><circle cx="13" cy="31" r="6" fill="${INK}"/><circle cx="13" cy="31" r="2.2" fill="${PAPER}"/></g>
      <g><circle cx="49" cy="31" r="6" fill="${INK}"/><circle cx="49" cy="31" r="2.2" fill="${PAPER}"/></g>
    </svg>`,
    boy: `<svg viewBox="0 0 22 34">
      <circle cx="10" cy="5" r="4" fill="${INK}"/>
      <path d="M10 9 L10 21" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
      <path d="M10 12 L16 16" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>
      <path d="M13 16 L21 16 L19 22 L15 22 Z" fill="${BRASS}" stroke="${INK}" stroke-width="1.2" stroke-linejoin="round"/>
      <path d="M6 20 L14 20 L13 24 L7 24 Z" fill="${PAPER}" stroke="${INK}" stroke-width="1"/>
      <path class="TK4R1-leg TK4R1-l1" d="M9 23 L7 33" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>
      <path class="TK4R1-leg TK4R1-l2" d="M11 23 L13 33" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>
    </svg>`,
    nail: `<svg viewBox="0 0 12 12"><path d="M2 2 L10 10" stroke="${STEEL}" stroke-width="1.8" stroke-linecap="round"/><path d="M0.5 4 L4 0.5" stroke="${STEEL}" stroke-width="2.2" stroke-linecap="round"/></svg>`,
    bottle: `<svg viewBox="0 0 12 12"><path d="M4 11 L4 5 L5 4 L5 1.5 L7 1.5 L7 4 L8 5 L8 11 Z" fill="${GLASS}" fill-opacity=".55" stroke="${GLASS}" stroke-width="1"/></svg>`
  };

  /* ---------------- helpers ---------------- */
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const mod1 = v => ((v % 1) + 1) % 1;
  const easeIn = f => f * f;
  const easeOut = f => 1 - (1 - f) * (1 - f);

  /* ---------------- 5. Actors ---------------- */
  const actorsEl = document.getElementById("TK4R1-actors");
  const allActors = [];
  function makeActor(kind, cls, lane) {
    const el = document.createElement("div");
    el.className = "TK4R1-sprite TK4R1-" + cls;
    el.innerHTML = `<div class="TK4R1-flip"><div class="TK4R1-inner">${ART[kind]}</div></div>`;
    actorsEl.appendChild(el);
    const a = { kind, el, lane, flip: el.querySelector(".TK4R1-flip"), inner: el.querySelector(".TK4R1-inner"),
      l1: [...el.querySelectorAll(".TK4R1-l1")], l2: [...el.querySelectorAll(".TK4R1-l2")],
      facing: 1, x: 0, y: 0, t: 0, used: false };
    allActors.push(a);
    return a;
  }
  const carts = [
    makeActor("bullock", "cart", -7), makeActor("horse", "cart", 7),
    makeActor("bullock", "cart", -7), makeActor("horse", "cart", 7)
  ];
  const CART = [{ s: .05, dir: 1, v: .12 }, { s: .30, dir: -1, v: .11 }, { s: .55, dir: 1, v: .13 }, { s: .80, dir: -1, v: .12 }];  // short, slow walk
  const cartT = (i, c) => CART[i].s + CART[i].dir * CART[i].v * c;

  const boys = [makeActor("boy", "boy", 0), makeActor("boy", "boy", 0), makeActor("boy", "boy", 0)];
  const boyT = (i, p) => i / 3 + p / 3;

  const bus = makeActor("bus", "bus", 0);
  const busMagnet = bus.el.querySelector(".TK4R1-magnet");
  const busField = bus.el.querySelector(".TK4R1-field");
  const PUNCTURE_T = .115;

  // Place an actor at route position t, moving in direction dir. Legs swing with distance travelled.
  function setActor(a, t, dir, opacity, inner = "") {
    a.used = true;
    if (opacity <= 0.001) { a.el.style.opacity = 0; return; }
    const p = pointAt(t, a.lane), q = pointAt(t + dir * .003, a.lane);
    if (Math.abs(q.x - p.x) > .05) a.facing = q.x < p.x ? -1 : 1;
    a.t = t; a.x = p.x; a.y = p.y;
    a.el.style.opacity = opacity;
    a.el.style.transform = `translate(${p.x}px,${p.y}px) translate(-50%,-92%)`;
    a.flip.style.transform = `scaleX(${a.facing})`;
    a.inner.style.transform = inner;
    if (a.l1.length) {
      const sw = REDUCED ? 0 : Math.sin(t * Math.PI * 2 * 45) * 5;
      a.l1.forEach(l => l.style.transform = `rotate(${sw}deg)`);
      a.l2.forEach(l => l.style.transform = `rotate(${-sw}deg)`);
    }
  }

  /* ---------------- 6. Debris ---------------- */
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const nailsEl = document.getElementById("TK4R1-nails");
  const debris = [];
  function addDebris(kind, t) {
    const el = document.createElement("div");
    el.className = "TK4R1-" + kind; el.innerHTML = ART[kind];
    nailsEl.appendChild(el);
    const d = { kind, el, t, lane: (rnd() - .5) * 12, rot: rnd() * 360, hx: 0, hy: 0, ev: {} };
    debris.push(d); return d;
  }
  for (let i = 0; i < 70; i++) addDebris("nail", (i + rnd() * .8) / 70);
  for (let i = 0; i < 12; i++) addDebris("bottle", (i + rnd()) / 12);
  addDebris("nail", PUNCTURE_T);

  function placeDebris(d) {
    const p = pointAt(d.t, d.lane);
    d.hx = p.x; d.hy = p.y;
    d.el.style.left = p.x + "px"; d.el.style.top = p.y + "px";
  }

  /* Each nail/bottle gets a list of events per scene, in that scene's own clock.
     "drop" makes it appear (a cart passed), "pick" takes it away (a boy or the magnet passed). */
  const W = .015;              // how long a fade in / fade out lasts, in scene units — quick
  const STATIC = -Infinity;    // already lying on the road when the scene starts
  function buildEvents() {
    debris.forEach(d => {
      const nt = d.t;
      // Scene A: steps 1–2. Carts drop nails and bottles during step 2 (clock 1 → 2).
      const a = [];
      CART.forEach((cfg, i) => {
        const dist = mod1(cfg.dir * (nt - cartT(i, 1)));
        const c = 1 + dist / cfg.v;
        if (c <= 2) a.push({ at: c, type: "drop" });
      });
      // Scene B: step 5. Everything starts on the road; the boy whose stretch it is picks it up.
      const i = Math.floor(nt * 3) % 3;
      const b = [{ at: STATIC, type: "drop" }, { at: 3 * mod1(nt - i / 3), type: "pick", by: boys[i] }];
      // Scene C: steps 6–7 (clock 0 → 2). Carts drop nails; the magnet bus loops once in step 7.
      const c = [];
      if (d.kind === "nail") {
        CART.forEach(cfg => {
          const at = mod1(cfg.dir * (nt - cfg.s)) / cfg.v;
          if (at <= 2) c.push({ at, type: "drop" });
        });
        c.push({ at: 1 + mod1(nt) - .012, type: "pick", by: bus });
      }
      [a, b, c].forEach(list => list.sort((x, y) => x.at - y.at));
      d.ev = { A: a, B: b, C: c };
    });
  }
  buildEvents();

  function resolve(events, clock) {
    let vis = false, last = null, picks = 0;
    for (const e of events) {
      if (e.at > clock) break;
      if (e.type === "drop" && !vis) { vis = true; last = e; }
      else if (e.type === "pick" && vis) { vis = false; last = e; picks++; }
    }
    return { last, picks };
  }
  // Draw one item given its scene state. Returns pick count so tallies can add up.
  function drawDebris(d, mode, clock) {
    const el = d.el, rot = d.kind === "nail" ? d.rot : 0;
    if (mode === "none") { el.style.opacity = 0; return 0; }
    if (mode === "all") { el.style.opacity = 1; el.style.transform = `rotate(${rot}deg)`; return 0; }
    const r = resolve(d.ev[mode], clock);
    if (!r.last) { el.style.opacity = 0; return r.picks; }
    const f = r.last.at === STATIC ? 1 : clamp((clock - r.last.at) / W);
    // calm: items fade in where they fall and fade out where they're collected — no bounce, spin or fly
    el.style.transform = `rotate(${rot}deg)`;
    el.style.opacity = r.last.type === "drop" ? f : 1 - f;
    return r.picks;
  }

  /* ---------------- 7. HUD & fixed elements ---------------- */
  const road = document.getElementById("TK4R1-road"), service = document.getElementById("TK4R1-service");
  const burst = document.getElementById("TK4R1-burst");
  const ledger = document.getElementById("TK4R1-ledger"), stamp = ledger.querySelector(".TK4R1-stamp");
  const tallyBoys = document.getElementById("TK4R1-tally-boys"), tallyMag = document.getElementById("TK4R1-tally-magnet");
  const nBoys = document.getElementById("TK4R1-n-boys"), nMag = document.getElementById("TK4R1-n-magnet");
  function hud(el, o) { el.style.opacity = o; }
  function dash(el, f) { el.style.strokeDasharray = `${path.len * f} ${path.len}`; }

  /* ---------------- 8. The frame: everything is a function of (step, progress) ---------------- */
  function frame(step, p) {
    allActors.forEach(a => a.used = false);
    let roadF = 1, serviceF = 0, serviceO = 0, ledgerO = 0, stampF = 0, boysO = 0, magO = 0;
    let burstO = 0, dMode = "none", clock = 0, magnet = 0;

    switch (step) {
      case 0:
        roadF = .12 + .88 * easeOut(clamp(p / .85));
        break;
      case 1:
        carts.forEach((c, i) => setActor(c, cartT(i, p), CART[i].dir, clamp(p / .12)));
        break;
      case 2:
        carts.forEach((c, i) => setActor(c, cartT(i, 1 + p), CART[i].dir, 1));
        dMode = "A"; clock = 1 + p;
        break;
      case 3: {
        carts.forEach((c, i) => setActor(c, cartT(i, 2), CART[i].dir, 1 - clamp(p / .15)));
        const q = clamp(p / .22);
        setActor(bus, 0, 1, q);
        serviceF = easeOut(clamp((p - .22) / .6)); serviceO = .85;
        dMode = "all";
        break;
      }
      case 4: {
        const drive = clamp(p / .45), q = clamp((p - .45) / .08);
        setActor(bus, PUNCTURE_T * easeIn(drive), 1, 1, `rotate(${-4 * q}deg)`);
        serviceF = 1; serviceO = .85 * (1 - clamp(p / .2));
        burstO = q * (1 - clamp((p - .88) / .1));
        ledgerO = clamp(p / .12); stampF = clamp((p - .6) / .08);
        dMode = "all";
        break;
      }
      case 5:
        setActor(bus, PUNCTURE_T, 1, 1 - clamp(p / .12), "translate(0,2px) rotate(-5deg)");
        boys.forEach((b, i) => setActor(b, boyT(i, p), 1, clamp(p / .06)));
        dMode = "B"; clock = p; boysO = 1;
        break;
      case 6:
        boys.forEach((b, i) => setActor(b, boyT(i, 1), 1, 1 - clamp(p / .12)));
        carts.forEach((c, i) => setActor(c, cartT(i, p), CART[i].dir, clamp(p / .12)));
        dMode = "C"; clock = p;
        break;
      case 7:
        carts.forEach((c, i) => setActor(c, cartT(i, 1 + p), CART[i].dir, 1));
        setActor(bus, p, 1, clamp(p / .05));
        magnet = 1; magO = 1;
        dMode = "C"; clock = 1 + p;
        break;
    }
    allActors.forEach(a => { if (!a.used) a.el.style.opacity = 0; });

    // debris (bus/boys positions are already up to date)
    let picks = 0;
    debris.forEach(d => {
      const mode = dMode === "C" && d.kind === "bottle" ? "none" : dMode;
      picks += drawDebris(d, mode, clock);
    });
    nBoys.textContent = step === 5 ? picks : 0;
    nMag.textContent = step === 7 ? picks : 0;

    // route, service line, HUD, burst
    dash(road, roadF);
    dash(service, serviceF); service.style.opacity = serviceO;
    hud(ledger, ledgerO); hud(tallyBoys, boysO); hud(tallyMag, magO);
    stamp.style.opacity = stampF;
    if (burstO > 0) {
      burst.style.left = (bus.x + 30) + "px"; burst.style.top = (bus.y - 70) + "px";
      burst.style.opacity = burstO;
      burst.style.transform = "none";
    } else burst.style.opacity = 0;
    busMagnet.style.opacity = magnet;
    busField.style.opacity = magnet ? .6 : 0;
  }

  /* ---------------- 9. Scroll → (step, progress), local to this section ---------------- */
  const sections = [...wrapper.querySelectorAll(".TK4R1-step")];
  let anchors = [], maxScroll = 1, wrapperTop = 0;
  function measure() {
    const vh = stage.clientHeight, mobile = isMobile();
    // Each card sticks in place while its (tall) step scrolls past, so the map has room to play slowly.
    sections.forEach((s, i) => {
      const c = s.querySelector(".TK4R1-card"), h = c.offsetHeight;
      const top = mobile ? vh - h - 18 : (i === 0 ? vh - h - vh * .12 : (vh - h) / 2);
      c.style.top = top + "px";
      s.style.paddingTop = top + "px";
    });
    wrapperTop = wrapper.getBoundingClientRect().top + window.scrollY;
    anchors = sections.map((s, i) => i === 0 ? 0 : (s.getBoundingClientRect().top + window.scrollY - wrapperTop) - vh * .35);
    maxScroll = Math.max(1, wrapper.offsetHeight - vh);
  }
  function stepAt(y) {
    let n = 0;
    for (let i = 0; i < anchors.length; i++) if (y >= anchors[i]) n = i;
    const end = n < anchors.length - 1 ? anchors[n + 1] : maxScroll;
    return [n, clamp((y - anchors[n]) / Math.max(1, end - anchors[n]))];
  }

  const smooth = { y: window.scrollY };
  let drawnY = null;
  function draw(force) {
    if (!force && drawnY === smooth.y) return;
    drawnY = smooth.y;
    const local = smooth.y - wrapperTop;
    // skip work while the section is well off-screen
    if (!force && (local < -stage.clientHeight || local > maxScroll + stage.clientHeight)) return;
    const [n, p] = stepAt(local);
    frame(n, p);
  }
  ScrollTrigger.create({
    trigger: wrapper, start: "top bottom", end: "bottom top",
    onUpdate: self => {
      gsap.to(smooth, { y: self.scroll(), duration: REDUCED ? 0 : .35, ease: "power2.out", overwrite: true });
    }
  });
  gsap.ticker.add(() => draw(false));

  /* ---------------- 10. Layout ---------------- */
  function render() {
    chart.setOption(buildOption(), true);
    chart.resize();
    buildPath();
    debris.forEach(placeDebris);
    measure();
    draw(true);
  }
  render();

  let rT;
  window.addEventListener("resize", () => {
    clearTimeout(rT);
    rT = setTimeout(() => { render(); ScrollTrigger.refresh(); }, 120);
  });
  // re-measure after other modules' pin-spacers change the page height above/below
  ScrollTrigger.addEventListener("refresh", measure);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(render);
});
