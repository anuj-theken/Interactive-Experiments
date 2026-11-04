// scripts/TK4R9-factories.js — TK4R9 · TVS, Ather and Ola Electric — factory map
// Needs TK4R9_DISTRICTS + TK4R9_STATES from scripts/TK4R9-factories_data.js (loaded first).

document.addEventListener("DOMContentLoaded", async function () {
  const section = document.getElementById("TK4R9-section");
  const el = document.getElementById("TK4R9-map");
  if (!section || !el || typeof TK4R9_DISTRICTS === "undefined") return;

  gsap.registerPlugin(ScrollTrigger);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- 1. Places (approximate) ---------------- */
  const P = {
    hosur: [77.83, 12.735],       // TVS Motor plant, Hosur
    tvsChennai: [80.246, 13.06],  // TVS office, Chennai
    iitm: [80.2336, 12.9916],     // IIT Madras, where Ather began
    ola: [78.365, 12.332],        // Ola Futurefactory, Pochampalli
    krishnagiri: [77.9, 12.28],   // district label point
    bengaluru: [77.59, 12.97]
  };

  /* ---------------- 2. Cameras ---------------- */
  const CAMS = [
    { lng: 78.72, lat: 12.75, zoom: 1.0 },  // 0 TVS, Hosur (with Chennai visible)
    { lng: 79.92, lat: 13.0, zoom: 2.4 },   // 1 Ather, Chennai (gentle zoom)
    { lng: 78.62, lat: 12.68, zoom: 1.0 }   // 2 Ola, Krishnagiri + Chennai
  ];
  const isMobile = () => el.clientWidth <= 768;
  const cam = i => {
    const c = { ...CAMS[i] };
    if (isMobile()) { if (i === 0 || i === 2) { c.lng = 79.04; c.lat = 12.6; c.zoom = .95; } else { c.lng = 79.89; c.lat = 12.8; } }
    return c;
  };
  // c = TVS Chennai bubble, a = Ather, o = Ola, k = district shade
  const S = { ...cam(0), c: 0, a: 0, o: 0, k: 0 };

  /* ---------------- 3. Chart ---------------- */
  echarts.registerMap("TK4R9-districts", TK4R9_DISTRICTS);
  echarts.registerMap("TK4R9-states", TK4R9_STATES);
  await new Promise(r => {
    const ok = () => el.clientWidth > 0 && el.clientHeight > 0;
    if (ok()) return r();
    const ro = new ResizeObserver(() => { if (ok()) { ro.disconnect(); r(); } });
    ro.observe(el); setTimeout(r, 3000);
  });
  const chart = echarts.init(el, null, { renderer: "canvas" });

  // tokens — read the design system (and the module's entity colours), never hardcode
  let C = {};
  function readColors() {
    const root = getComputedStyle(section);   // the section may be a dark island on the light page
    const v = n => root.getPropertyValue(n).trim();
    C = {
      sea: v("--map-sea"), land: v("--map-land"), line: v("--map-border"), state: v("--color-accent"),
      ink: v("--color-text"), muted: v("--color-muted"), card: v("--color-surface"),
      tvs: v("--color-primary"), ather: v("--seq-300"), ola: v("--color-mustard"),
      font: v("--font-body"), legend: parseFloat(v("--type-legend")) || 14
    };
  }
  function mix(h1, h2, t) {
    const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
    const a = p(h1), b = p(h2);
    return "rgb(" + a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(",") + ")";
  }
  function layout() {
    const w = el.clientWidth, h = el.clientHeight, m = w <= 768;
    return { layoutCenter: m ? ["50%", "40%"] : ["63%", "50%"], layoutSize: Math.max(w, h) * (m ? .75 : 1.05) };
  }
  const BOUND = [[76.2, 14.4], [81.0, 11.0]];
  function geos() {
    const L = layout();
    const base = { roam: false, silent: true, boundingCoords: BOUND, layoutCenter: L.layoutCenter, layoutSize: L.layoutSize,
      center: [S.lng, S.lat], zoom: S.zoom, emphasis: { disabled: true }, label: { show: false }, select: { disabled: true } };
    return [
      { ...base, map: "TK4R9-districts", z: 1, itemStyle: { areaColor: C.land, borderColor: C.line, borderWidth: .6 },
        regions: [{ name: "Krishnagiri|Tamil Nadu", itemStyle: { areaColor: mix(C.land, C.ola, 0.28 * S.k),
          borderColor: S.k > 0.01 ? C.ola : C.line, borderWidth: S.k > 0.01 ? 1.6 : .6 } }] },
      { ...base, map: "TK4R9-states", z: 2, itemStyle: { areaColor: "transparent", borderColor: C.state, borderWidth: 1.3 } }
    ];
  }
  const lbl = (pos, extra = {}) => ({ show: true, position: pos, distance: 9, fontFamily: C.font, fontSize: C.legend - 1, fontWeight: 600,
    color: C.ink, backgroundColor: C.card, padding: [4, 7], borderRadius: 3, ...extra });
  function places() {
    const out = [];
    if (S.zoom <= 5) out.push({ name: "Bengaluru", value: P.bengaluru, symbolSize: 5, itemStyle: { color: C.muted },
      label: lbl("top", { color: C.muted, fontWeight: 500, backgroundColor: "transparent" }) });
    if (S.k > 0.05 && !isMobile()) out.push({ name: "Krishnagiri district", value: P.krishnagiri, symbolSize: 0,
      label: lbl("inside", { color: C.ola, fontSize: C.legend - 2, backgroundColor: "transparent", opacity: S.k }) });
    return out;
  }
  function markers() {
    const out = [], B = bubbleOps();
    const small = (pos, op, extra = {}) => lbl(pos, { show: op < 0.3, fontSize: C.legend - 2, ...extra });
    out.push({ name: "TVS Motor, Hosur", value: P.hosur, symbolSize: 14, itemStyle: { color: C.tvs, borderColor: C.card, borderWidth: 2 }, label: small("bottom", B.hosur) });
    out.push({ name: "TVS office", value: P.tvsChennai, symbolSize: S.zoom > 2 ? 13 : 9, itemStyle: { color: C.tvs, borderColor: C.card, borderWidth: 2 }, label: small("left", B.chennai, { offset: [0, -9] }) });
    if (S.a > 0) out.push({ name: "Ather Energy", value: P.iitm, symbolSize: 15 * S.a, itemStyle: { color: C.ather, borderColor: C.card, borderWidth: 2, opacity: S.a }, label: small("left", B.ather, { offset: [0, 9], opacity: S.a }) });
    if (S.o > 0) out.push({ name: "Ola Futurefactory", value: P.ola, symbolSize: 20 * S.o, itemStyle: { color: C.ola, borderColor: C.card, borderWidth: 2, opacity: S.o }, label: { show: false } });
    return out;
  }

  /* ---------------- 4. Speech bubbles (HTML, pinned to map points) ---------------- */
  const BUBBLES = [
    { id: "hosur",   at: P.hosur,      dir: "up-right",   c: "--TK4R9-tvs",   title: "TVS Motor", text: "Hosur plant. The first TVS 50 was built here." },
    { id: "chennai", at: P.tvsChennai, dir: "left-up",    c: "--TK4R9-tvs",   title: "TVS Motor", text: "Office, Chennai." },
    { id: "ather",   at: P.iitm,       dir: "left-down",  c: "--TK4R9-ather", title: "Ather Energy, 2013", text: "Founded by IIT Madras alumni Tarun Mehta and Swapnil Jain, 30 minutes from TVS’s office." },
    { id: "ola",     at: P.ola,        dir: "down-right", c: "--TK4R9-ola",   title: "Ola Electric, 2017", text: "Planned the world’s largest two-wheeler factory: 10 million scooters a year. Same district as TVS’s Hosur plant." }
  ];
  const layer = document.getElementById("TK4R9-bubbles");
  BUBBLES.forEach(b => {
    const d = document.createElement("div");
    d.className = "TK4R9-bubble TK4R9-bubble--" + b.dir;
    d.style.setProperty("--c", "var(" + b.c + ")");
    d.innerHTML = "<b>" + b.title + "</b><span>" + b.text + "</span>";
    layer.appendChild(d); b.el = d;
  });
  function bubbleOps() { return { hosur: Math.max(1 - S.c, S.o), chennai: S.c * (1 - S.o), ather: S.a * (1 - S.o), ola: S.o }; }
  function placeBubbles() {
    const ops = bubbleOps(), w = el.clientWidth, h = el.clientHeight;
    BUBBLES.forEach(b => {
      let op = Math.max(0, Math.min(1, ops[b.id]));
      const p = chart.convertToPixel({ geoIndex: 0 }, b.at);
      if (!p || p[0] < -40 || p[0] > w + 40 || p[1] < -40 || p[1] > h + 40) op = 0;
      // position follows the map; the pop/fade is a CSS transition triggered once per crossing
      if (p) { b.el.style.left = p[0] + "px"; b.el.style.top = p[1] + "px"; }
      const on = b.el.classList.contains("is-show");
      if (!on && op > 0.55) b.el.classList.add("is-show");
      else if (on && op < 0.35) b.el.classList.remove("is-show");
    });
  }
  function series() {
    return [
      { type: "scatter", coordinateSystem: "geo", geoIndex: 0, silent: true, z: 4, data: places(), label: { formatter: "{b}" }, animation: false },
      { type: "effectScatter", coordinateSystem: "geo", geoIndex: 0, silent: true, z: 6, data: markers(),
        rippleEffect: { brushType: "stroke", scale: reduce ? 1 : 3.2, period: 3 }, showEffectOn: "render", label: { formatter: "{b}" }, animation: false }
    ];
  }
  function full() { readColors(); return { backgroundColor: C.sea, animation: false, geo: geos(), series: series() }; }

  let queued = false;
  const raisedEl = document.getElementById("TK4R9-raised"), capEl = document.getElementById("TK4R9-cap");
  const chips = [...section.querySelectorAll(".TK4R9-chip")];
  function render() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      chart.setOption({ geo: geos(), series: series() }, { replaceMerge: ["series"] });
      placeBubbles();
      raisedEl.textContent = "$" + Math.round(800 * S.o) + "M";
      capEl.textContent = (10 * S.o).toFixed(S.o < 1 ? 1 : 0) + "M";
      chips[1].classList.toggle("is-on", S.a > 0.5);
      chips[2].classList.toggle("is-on", S.o > 0.5);
    });
  }
  chart.setOption(full());
  placeBubbles();

  // opening moment: drop the TVS pin in when the section scrolls into view
  if (!reduce) {
    const z0 = S.zoom;
    ScrollTrigger.create({ trigger: section, start: "top 75%", once: true, onEnter: () => {
      S.zoom = z0 * 0.82;
      gsap.to(S, { zoom: z0, duration: 1.6, ease: "power3.out", onUpdate: render });
    } });
  }

  /* ---------------- 5. Scroll ---------------- */
  section.dataset.step = "0";
  section.querySelectorAll(".TK4R9-step").forEach(sec => {
    const i = +sec.dataset.step;
    ScrollTrigger.create({ trigger: sec, start: "top 55%", end: "bottom 55%",
      onToggle: self => { if (self.isActive) section.dataset.step = i; } });
    if (i === 0) return;
    const tl = gsap.timeline({ defaults: { ease: "none" }, onUpdate: render,
      scrollTrigger: { trigger: sec, start: "top 90%", end: "center 35%", scrub: reduce ? true : 0.8 } });
    tl.fromTo(S, cam(i - 1), { ...cam(i), duration: .4, ease: "power2.inOut", immediateRender: false }, 0);
    if (i === 1) {
      tl.fromTo(S, { c: 0 }, { c: 1, duration: .15, immediateRender: false }, .42)
        .fromTo(S, { a: 0 }, { a: 1, duration: .2, immediateRender: false }, .62);
    } else {
      tl.fromTo(S, { k: 0 }, { k: 1, duration: .3, immediateRender: false }, .35)
        .fromTo(S, { o: 0 }, { o: 1, duration: .45, ease: "power1.out", immediateRender: false }, .45);
    }
  });
  // leaving the section hides the Ola HUD
  ScrollTrigger.create({ trigger: section, start: "top bottom", end: "bottom top",
    onLeave: () => { section.dataset.step = ""; }, onLeaveBack: () => { section.dataset.step = ""; } });

  /* ---------------- 6. Resize ---------------- */
  let rt, lw = el.clientWidth, lh = el.clientHeight;
  new ResizeObserver(() => {
    const w = el.clientWidth, h = el.clientHeight;
    if (!w || !h || (w === lw && h === lh)) return;
    lw = w; lh = h;
    clearTimeout(rt);
    rt = setTimeout(() => { chart.resize(); chart.setOption(full()); placeBubbles(); ScrollTrigger.refresh(); }, 120);
  }).observe(el);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { chart.setOption(full()); placeBubbles(); ScrollTrigger.refresh(); });
});
