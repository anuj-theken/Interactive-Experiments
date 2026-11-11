// scripts/TK4R8-flight.js — TK4R8 · Chennai to Hamamatsu, 1992 — the TVS flight map
// Needs TK4R8_GEO from scripts/TK4R8-flight_data.js (loaded first).

document.addEventListener("DOMContentLoaded", async function () {
  const section = document.getElementById("TK4R8-section");
  const el = document.getElementById("TK4R8-map");
  if (!section || !el || typeof TK4R8_GEO === "undefined") return;

  gsap.registerPlugin(ScrollTrigger);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const CHENNAI = [80.27, 13.08], HAMAMATSU = [137.73, 34.71];

  /* ---------------- 1. Geometry ---------------- */
  const rad = d => d * Math.PI / 180, deg = r => r * 180 / Math.PI;
  function toVec([lng, lat]) { const a = rad(lat), b = rad(lng); return [Math.cos(a) * Math.cos(b), Math.cos(a) * Math.sin(b), Math.sin(a)]; }
  function toLL([x, y, z]) { return [deg(Math.atan2(y, x)), deg(Math.atan2(z, Math.hypot(x, y)))]; }
  const A = toVec(CHENNAI), B = toVec(HAMAMATSU);
  const omega = Math.acos(A[0] * B[0] + A[1] * B[1] + A[2] * B[2]);
  const KM = Math.round(6371 * omega);
  function gc(t) {
    const s = Math.sin(omega), k1 = Math.sin((1 - t) * omega) / s, k2 = Math.sin(t * omega) / s;
    return toLL([k1 * A[0] + k2 * B[0], k1 * A[1] + k2 * B[1], k1 * A[2] + k2 * B[2]]);
  }
  const N = 120;
  // three slightly separated arcs per direction so the batches read as distinct trips
  function arc(offset) {
    const pts = [];
    for (let i = 0; i <= N; i++) { const t = i / N, [lng, lat] = gc(t), bow = Math.sin(Math.PI * t) * offset; pts.push([lng - bow * 0.35, lat + bow]); }
    return pts;
  }
  const outArcs = [arc(1.6), arc(4.2), arc(6.8)];
  const retArcs = [arc(-1.6), arc(-4.2), arc(-6.8)].map(a => a.slice().reverse());

  // colleagues around Tamil Nadu (seeded, deterministic)
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const colleagues = [];
  while (colleagues.length < 240) {
    const lat = 8.6 + rnd() * 4.6, lng = 76.8 + rnd() * 3.5;
    const east = 79.05 + (lat - 9) * 0.3, west = 76.9 + (lat - 9) * 0.28;
    if (lng < east && lng > west) colleagues.push([lng, lat]);
  }
  colleagues.sort((p, q) => Math.hypot(p[0] - CHENNAI[0], p[1] - CHENNAI[1]) - Math.hypot(q[0] - CHENNAI[0], q[1] - CHENNAI[1]));

  /* ---------------- 2. State animated by GSAP ---------------- */
  const CAMS = [
    { lng: 110, lat: 22, zoom: .72 },    // 0 hero
    { lng: 79.6, lat: 12.2, zoom: 4.6 }, // 1 home
    { lng: 84, lat: 15, zoom: 2.4 },     // 2 batches
    { lng: 104, lat: 23, zoom: .78 },    // 3 flight
    { lng: 137.2, lat: 35, zoom: 6 },    // 4 japan
    { lng: 104, lat: 23, zoom: .78 },    // 5 return
    { lng: 79.2, lat: 11.4, zoom: 4.8 }, // 6 share
    { lng: 103, lat: 23, zoom: .74 }     // 7 outro
  ];
  const isMobile = () => el.clientWidth <= 768;
  // on phones the card sits below the map, so wide shots centre on the route midpoint
  const cam = i => { const c = { ...CAMS[i] }; if (isMobile() && c.zoom < 2) { c.lng = 109; c.lat = 24; c.zoom = Math.min(c.zoom, 1); } return c; };
  const S = { ...cam(0), seats: 0, out: 0, weeks: 0, ret: 0, share: 0 };

  /* ---------------- 3. Chart ---------------- */
  echarts.registerMap("TK4R8-asia", TK4R8_GEO);
  // wait until the map box has a real size
  await new Promise(r => {
    const ok = () => el.clientWidth > 0 && el.clientHeight > 0;
    if (ok()) return r();
    const ro = new ResizeObserver(() => { if (ok()) { ro.disconnect(); r(); } });
    ro.observe(el); setTimeout(r, 3000);
  });
  const chart = echarts.init(el, null, { renderer: "canvas" });

  // tokens — read the design system, never hardcode
  let C = {};
  function readColors() {
    // read from the section: it runs as a light island (TK4R-theme-light) inside the dark page
    const cs = getComputedStyle(section), v = n => cs.getPropertyValue(n).trim();
    C = {
      sea: v("--map-sea"), land: v("--map-land"), line: v("--map-border"),
      home: v("--map-land-focus"), away: v("--map-land-away"),
      ink: v("--color-text"), card: v("--color-surface"),
      out: v("--color-royal"), ret: v("--color-primary"),
      font: v("--font-body"), legend: parseFloat(v("--type-legend")) || 14
    };
  }
  function layout() {
    const w = el.clientWidth, h = el.clientHeight, mobile = w <= 768;
    return { layoutCenter: mobile ? ["50%", "40%"] : ["62%", "50%"], layoutSize: Math.max(w, h) * (mobile ? .62 : 1.08) };
  }
  const PLANE = "path://M23,11 L19,9.5 L14,9.5 L9,2 L7,2 L10,9.5 L4,9.5 L2,6.5 L0.5,6.5 L1.5,11 L0.5,15.5 L2,15.5 L4,12.5 L10,12.5 L7,20 L9,20 L14,12.5 L19,12.5 Z";

  function baseOption() {
    readColors();
    const L = layout();
    return {
      backgroundColor: C.sea, animation: false,
      geo: {
        map: "TK4R8-asia", roam: false, silent: true, boundingCoords: [[60, 48], [150, -8]],
        layoutCenter: L.layoutCenter, layoutSize: L.layoutSize, center: [S.lng, S.lat], zoom: S.zoom,
        itemStyle: { areaColor: C.land, borderColor: C.line, borderWidth: .6 },
        regions: [{ name: "India", itemStyle: { areaColor: C.home } }, { name: "Japan", itemStyle: { areaColor: C.away } }],
        emphasis: { disabled: true }, label: { show: false }
      },
      series: series()
    };
  }
  const batchStart = b => b * 0.18, batchSpan = 0.64;
  const bp = (p, b) => Math.max(0, Math.min(1, (p - batchStart(b)) / batchSpan));
  function partial(arc, p) {
    const n = Math.max(2, Math.round(p * N) + 1), pts = arc.slice(0, n);
    // interpolate the head for smoothness
    const f = p * N, i = Math.floor(f);
    if (i < N && p > 0) { const t = f - i, a = arc[i], b = arc[i + 1]; pts[pts.length - 1] = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }
    return pts;
  }
  function heading(arc, p) { const i = Math.min(N - 1, Math.floor(p * N)), a = arc[i], b = arc[i + 1]; return deg(Math.atan2(b[1] - a[1], (b[0] - a[0]) * 0.75)); }

  function series() {
    const lines = [], planes = [];
    // outbound Royal solid, homebound Crimson dashed
    [[outArcs, S.out, C.out, "solid"], [retArcs, S.ret, C.ret, [6, 5]]].forEach(([arcs, p, color, type]) => {
      arcs.forEach((arc, b) => {
        const q = bp(p, b);
        if (q <= 0) return;
        lines.push({ coords: partial(arc, q), lineStyle: { color, type, width: 2.2, opacity: .95 } });
        if (q < 1) planes.push({ value: partial(arc, q).at(-1), symbolRotate: heading(arc, q), itemStyle: { color } });
      });
    });
    const shareN = Math.round(S.share * colleagues.length);
    const zoomScale = Math.min(1.5, 0.85 + S.zoom * 0.12);
    return [
      { type: "lines", coordinateSystem: "geo", polyline: true, silent: true, z: 3, data: lines, animation: false },
      { type: "scatter", coordinateSystem: "geo", silent: true, z: 6, symbol: PLANE, symbolSize: [30, 28], data: planes, animation: false },
      { type: "scatter", coordinateSystem: "geo", silent: true, z: 4, symbolSize: 4.5 * zoomScale,
        data: colleagues.slice(0, shareN).map(c => ({ value: c, itemStyle: { color: C.ret, opacity: .85 } })), animation: false },
      { type: "effectScatter", coordinateSystem: "geo", silent: true, z: 5,
        rippleEffect: { brushType: "stroke", scale: reduce ? 1 : 4, period: 3.2 }, showEffectOn: "render",
        symbolSize: 9,
        label: { show: true, position: "right", distance: 10, fontFamily: C.font, fontSize: C.legend, fontWeight: 600, color: C.ink,
                 backgroundColor: C.card, padding: [4, 7], borderRadius: 3 },
        data: [
          { name: "Chennai", value: CHENNAI, itemStyle: { color: C.out }, label: { formatter: "Chennai, Tamil Nadu" } },
          { name: "Hamamatsu", value: HAMAMATSU, itemStyle: { color: C.ret }, label: { position: "left", formatter: "Hamamatsu · Suzuki HQ" } }
        ] }
    ];
  }

  let queued = false;
  function render() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      chart.setOption({ geo: { center: [S.lng, S.lat], zoom: S.zoom }, series: series() }, { lazyUpdate: false });
      hud();
    });
  }

  /* ---------------- 4. HUD ---------------- */
  const seatEls = [];
  section.querySelectorAll(".TK4R8-batch").forEach(f => {
    for (let i = 0; i < 25; i++) { const s = document.createElement("div"); s.className = "TK4R8-seat"; f.insertBefore(s, f.querySelector("figcaption")); seatEls.push(s); }
  });
  const wkGrid = document.getElementById("TK4R8-wk-grid"), wkEls = [];
  for (let i = 0; i < 16; i++) { const w = document.createElement("div"); w.className = "TK4R8-wk" + (i >= 12 ? " TK4R8-wk--maybe" : ""); wkGrid.appendChild(w); wkEls.push(w); }
  const seatCount = document.getElementById("TK4R8-seat-count"), kmEl = document.getElementById("TK4R8-km"), distLabel = document.getElementById("TK4R8-dist-label");
  const fmt = n => Math.round(n).toLocaleString("en-IN");
  document.getElementById("TK4R8-km-final").textContent = fmt(KM);
  function hud() {
    const n = Math.round(S.seats);
    seatCount.textContent = n;
    seatEls.forEach((s, i) => s.classList.toggle("is-on", i < n));
    wkEls.forEach((e, i) => e.classList.toggle("is-on", i < S.weeks));
    const step = +section.dataset.step;
    if (step >= 5) { distLabel.textContent = "Distance home, Hamamatsu to Chennai"; kmEl.textContent = fmt(Math.min(1, S.ret / (batchStart(0) + batchSpan)) * KM); }
    else { distLabel.textContent = "Distance flown, Chennai to Hamamatsu"; kmEl.textContent = fmt(Math.min(1, S.out / (batchStart(0) + batchSpan)) * KM); }
  }

  chart.setOption(baseOption());

  /* ---------------- 5. Scroll ---------------- */
  const HUD = { 0: "", 1: "", 2: "seats", 3: "dist", 4: "weeks", 5: "dist", 6: "", 7: "" };
  const ACTION = { 2: { seats: 75 }, 3: { out: 1 }, 4: { weeks: 16 }, 5: { ret: 1 }, 6: { share: 1 } };
  section.dataset.step = "0";
  section.querySelectorAll(".TK4R8-step").forEach(sec => {
    const i = +sec.dataset.step;
    ScrollTrigger.create({
      trigger: sec, start: "top 55%", end: "bottom 55%",
      onToggle: self => { if (self.isActive) { section.dataset.step = i; section.dataset.hud = HUD[i]; render(); } }
    });
    if (i === 0) return;
    const tl = gsap.timeline({ defaults: { ease: "none" }, onUpdate: render,
      scrollTrigger: { trigger: sec, start: "top 90%", end: "center 35%", scrub: reduce ? true : 0.8 } });
    tl.fromTo(S, cam(i - 1), { ...cam(i), duration: .38, ease: "power2.inOut", immediateRender: false }, 0);
    if (ACTION[i]) {
      const key = Object.keys(ACTION[i])[0];
      tl.fromTo(S, { [key]: 0 }, { [key]: ACTION[i][key], duration: .55, immediateRender: false }, .4);
    }
  });
  // leaving the section above or below hides the HUD
  ScrollTrigger.create({ trigger: section, start: "top bottom", end: "bottom top",
    onLeave: () => { section.dataset.hud = ""; }, onLeaveBack: () => { section.dataset.hud = ""; } });

  /* ---------------- 6. Resize ---------------- */
  let rt, lastW = el.clientWidth, lastH = el.clientHeight;
  new ResizeObserver(() => {
    const w = el.clientWidth, h = el.clientHeight;
    if (!w || !h || (w === lastW && h === lastH)) return;
    lastW = w; lastH = h;
    clearTimeout(rt);
    rt = setTimeout(() => { chart.resize(); chart.setOption(baseOption()); ScrollTrigger.refresh(); }, 120);
  }).observe(el);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { chart.setOption(baseOption()); ScrollTrigger.refresh(); });
});
