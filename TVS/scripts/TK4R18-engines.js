// scripts/TK4R18-engines.js — TK4R18 · Two-stroke vs four-stroke, TVS-Suzuki (story V7.2)
// Scrollytelling. The stage is CSS-sticky; story steps scroll past in the right column.
// The step crossing the trigger line sets data-beat on the scrolly, and CSS does the rest:
//   0  two-stroke engine (Suzuki's bet)        3  both engines side by side
//   1  backdrop turns to rough terrain         4  chart — Hero Honda 28% → 42%
//   2  four-stroke replaces it (Honda's bet)   5  chart — TVS Suzuki stuck at 15–19%
// The chart is a small hand-built SVG; colours come from CSS classes reading the tokens.

document.addEventListener("DOMContentLoaded", function () {
  const scrolly = document.getElementById("TK4R18-scrolly");
  if (!scrolly) return;

  const steps = [...scrolly.querySelectorAll(".TK4R18-step")];
  const chart = document.getElementById("TK4R18-chart");
  const svg = document.getElementById("TK4R18-svg");

  // ── data (story V7.2) ──
  const HERO = [{ year: 1996, v: 28 }, { year: 2000, v: 42 }];
  const TVS_BAND = { from: 1996, to: 2000, lo: 15, hi: 19 };

  // ── chart geometry (viewBox units) — a narrower box on phones keeps labels legible ──
  const phone = window.matchMedia("(max-width: 768px)");
  const Y_MAX = 50;
  let W, H, M;
  const x = yr => M.l + (yr - 1996) / 4 * (W - M.l - M.r);
  const y = v => H - M.b - v / Y_MAX * (H - M.t - M.b);

  const NS = "http://www.w3.org/2000/svg";
  function el(tag, attrs, parent, text) {
    const n = document.createElementNS(NS, tag);
    Object.entries(attrs || {}).forEach(([k, v]) => n.setAttribute(k, v));
    if (text !== undefined) n.textContent = text;
    (parent || svg).appendChild(n);
    return n;
  }
  // a big display figure with a smaller "%"
  function value(label, attrs, parent) {
    const t = el("text", Object.assign({ class: "TK4R18-val" }, attrs), parent);
    t.appendChild(document.createTextNode(label));
    const p = document.createElementNS(NS, "tspan");
    p.setAttribute("class", "TK4R18-pct");
    p.textContent = "%";
    t.appendChild(p);
    return t;
  }

  function buildChart() {
    if (!svg) return;
    if (phone.matches) { W = 380; H = 300; M = { l: 30, r: 100, t: 14, b: 30 }; }
    else               { W = 600; H = 350; M = { l: 40, r: 128, t: 18, b: 32 }; }
    svg.textContent = "";
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);

    // grid + y ticks
    for (let v = 0; v <= Y_MAX; v += 10) {
      if (v > 0) el("line", { class: "TK4R18-grid", x1: M.l, x2: W - M.r + 8, y1: y(v), y2: y(v) });
      el("text", { class: "TK4R18-tick TK4R18-tick--y", x: M.l - 10, y: y(v) }, svg, v);
    }
    // baseline + x ticks
    el("line", { class: "TK4R18-base", x1: M.l, x2: W - M.r + 8, y1: y(0), y2: y(0) });
    for (let yr = 1996; yr <= 2000; yr++) {
      el("text", { class: "TK4R18-tick TK4R18-tick--x", x: x(yr), y: H - M.b + 22 }, svg,
        phone.matches && yr > 1996 && yr < 2000 ? "’" + String(yr).slice(2) : yr);
    }

    // TVS Suzuki — a 15–19% band across the period (only the range is known, not each year)
    const bandG = el("g", { class: "TK4R18-band-g" });
    el("rect", {
      class: "TK4R18-band",
      x: x(TVS_BAND.from), y: y(TVS_BAND.hi),
      width: x(TVS_BAND.to) - x(TVS_BAND.from), height: y(TVS_BAND.lo) - y(TVS_BAND.hi)
    }, bandG);
    [TVS_BAND.lo, TVS_BAND.hi].forEach(v =>
      el("line", { class: "TK4R18-band-edge", x1: x(TVS_BAND.from), x2: x(TVS_BAND.to), y1: y(v), y2: y(v) }, bandG));

    const bandLbl = el("g", { class: "TK4R18-fade TK4R18-fade--band" });
    const bx = x(TVS_BAND.to) + 14, bMid = y((TVS_BAND.lo + TVS_BAND.hi) / 2);
    value("15–19", { x: bx, y: bMid + 4 }, bandLbl);
    el("text", { class: "TK4R18-name", x: bx, y: bMid + 24 }, bandLbl, "TVS Suzuki");

    // Hero Honda — two known points, joined by a straight line
    el("path", {
      class: "TK4R18-hero-line",
      d: `M${x(HERO[0].year)},${y(HERO[0].v)} L${x(HERO[1].year)},${y(HERO[1].v)}`,
      pathLength: 1
    });
    const start = el("g", { class: "TK4R18-fade TK4R18-fade--hero-start" });
    el("circle", { class: "TK4R18-hero-dot", cx: x(HERO[0].year), cy: y(HERO[0].v), r: 6 }, start);
    value("28", { x: x(HERO[0].year) + 4, y: y(HERO[0].v) - 16 }, start);

    const end = el("g", { class: "TK4R18-fade TK4R18-fade--hero-end" });
    el("circle", { class: "TK4R18-hero-dot", cx: x(HERO[1].year), cy: y(HERO[1].v), r: 6 }, end);
    value("42", { x: x(HERO[1].year) + 14, y: y(HERO[1].v) + 4 }, end);
    el("text", { class: "TK4R18-name", x: x(HERO[1].year) + 14, y: y(HERO[1].v) + 24 }, end, "Hero Honda");
  }

  // ── beats ──
  let current = -1;
  function setBeat(b) {
    if (b === current) return;
    current = b;
    scrolly.dataset.beat = b;
    steps.forEach((s, i) => s.classList.toggle("is-active", i === b));
    if (chart) {
      chart.classList.toggle("is-hero", b >= 4);
      chart.classList.toggle("is-band", b >= 5);
    }
  }

  // the active step is the last one whose card has crossed the trigger line
  // (70% down on desktop; 85% on phones, where cards ride in along the bottom)
  const cards = steps.map(s => s.querySelector(".TK4R18-card") || s);
  let ticking = false;
  function update() {
    ticking = false;
    const line = window.innerHeight * (phone.matches ? 0.85 : 0.7);
    let b = 0;
    cards.forEach((c, i) => { if (c.getBoundingClientRect().top < line) b = i; });
    setBeat(b);
  }
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }

  buildChart();
  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  phone.addEventListener("change", buildChart);
});
