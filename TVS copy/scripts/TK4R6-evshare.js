// scripts/TK4R6-evshare.js — TK4R6 · Electric two-wheeler market share, FY22 → FY24 → CY26 (story V12)
// Scrollytelling: each text step activates a period; the battery's cells re-stack (CSS transitions on
// top/height), the direct labels slide with them, and TVS's share is annotated on the left of its cell.

document.addEventListener("DOMContentLoaded", function () {
  const scrolly = document.getElementById("TK4R6-scrolly");
  const cellsEl = document.getElementById("TK4R6-cells");
  const labelsEl = document.getElementById("TK4R6-labels");
  if (!scrolly || !cellsEl) return;

  gsap.registerPlugin(ScrollTrigger);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const numEl = document.getElementById("TK4R6-num");
  const periodEl = document.getElementById("TK4R6-period");
  const steps = [...scrolly.querySelectorAll(".TK4R6-step")];
  const tvsAnn = document.getElementById("TK4R6-tvs-ann");

  /* ---------------- 1. Data — the three periods the story steps through ---------------- */
  const PERIODS = ["FY22", "FY24", "CY26"];
  // Stack order, baseline up — TVS charges from the bottom of the battery.
  // Entity colours as elsewhere: TVS Crimson, Ola Mustard, rivals alternating tints of one blue,
  // Others the same solid deep steel blue as TK4R3.
  // TVS Crimson at the base. The rivals run one smooth blue ramp up the stack — lightest just above
  // TVS, stepping darker towards the top — so neighbours never jump. Others caps it in deep steel blue.
  const RAMP = t => `color-mix(in srgb, var(--seq-600) ${Math.round(100 - t * 100)}%, var(--seq-100))`;
  const series = [
    { key: "tvs",      name: "TVS Motor",        values: [4, 19, 26],   fill: "var(--color-primary)" },
    { key: "bajaj",    name: "Bajaj Auto",       values: [3, 11, 22],   fill: RAMP(0 / 6) },
    { key: "ather",    name: "Ather Energy",     values: [8, 12, 17],   fill: RAMP(1 / 6) },
    { key: "heromoto", name: "Hero MotoCorp",    values: [0.0, 2, 11],  fill: RAMP(2 / 6) },
    { key: "ola",      name: "Ola Electric",     values: [6, 35, 6.6],  fill: RAMP(3 / 6) },
    { key: "greaves",  name: "Greaves Electric", values: [10, 6, 4],    fill: RAMP(4 / 6) },
    { key: "okinawa",  name: "Okinawa",          values: [19, 2, 0.1],  fill: RAMP(5 / 6) },
    { key: "heroel",   name: "Hero Electric",    values: [27, 1, 0.0],  fill: RAMP(6 / 6) },
    { key: "others",   name: "Others",           values: [24, 12, 12],  fill: "color-mix(in srgb, var(--color-accent) 40%, var(--color-surface))" }
  ];
  const MIN_CELL = 0.5;    // thinner shares aren't drawn as a cell
  const MIN_LABEL = 2;     // shares below this aren't labelled (they'd collide)
  const LABEL_GAP = 19;    // minimum vertical spacing between labels, px
  const GAP = 2;           // card shows through between cells

  /* ---------------- 2. Build cells + labels once; periods only move them ---------------- */
  series.forEach(s => {
    s.cell = document.createElement("div");
    if (s.key === "tvs") s.cell.classList.add("TK4R6-cell--tvs");
    s.cell.className = "TK4R6-cell";
    s.cell.style.background = s.fill;
    cellsEl.appendChild(s.cell);
    if (s.key === "tvs") return;   // TVS is annotated on the left of the battery
    s.label = document.createElement("div");
    s.label.className = "TK4R6-label";
    s.label.innerHTML = `<i></i><span class="TK4R6-sw" style="background:${s.fill}"></span>${s.name} <b></b>`;
    labelsEl.appendChild(s.label);
  });

  /* ---------------- 3. Lay out one period ---------------- */
  let cur = 0;
  const shown = { v: series[0].values[0] };
  function layout(p) {
    const H = cellsEl.clientHeight;
    const vis = series.filter(s => s.values[p] >= MIN_CELL);
    const sum = vis.reduce((a, s) => a + s.values[p], 0);
    const avail = H - GAP * (vis.length - 1);

    // stack from the bottom
    let y = H;
    const centres = [];
    series.forEach(s => {
      const v = s.values[p];
      if (v < MIN_CELL) {
        s.cell.style.height = "0px";
        s.cell.style.opacity = 0;
        if (s.label) s.label.classList.add("is-hidden");
        return;
      }
      const h = avail * v / sum, top = y - h;
      s.cell.style.top = top + "px";
      s.cell.style.height = h + "px";
      s.cell.style.opacity = 1;
      y = top - GAP;
      if (s.key === "tvs") {
        // pinned to the crimson cell, but kept within the battery's height when the cell is tiny
        const half = tvsAnn.offsetHeight / 2;
        tvsAnn.style.top = (Math.min(Math.max(top + h / 2, half - 4), H - half + 4) + 4) + "px";   // +4: casing pad
        return;
      }
      s.label.querySelector("b").textContent = v + "%";
      if (v >= MIN_LABEL) { centres.push({ s, c: top + h / 2 }); s.label.classList.remove("is-hidden"); }
      else s.label.classList.add("is-hidden");
    });

    // labels: keep each beside its cell, but never closer than LABEL_GAP (relax top-down, then fit)
    centres.sort((a, b) => a.c - b.c);
    for (let i = 1; i < centres.length; i++) centres[i].c = Math.max(centres[i].c, centres[i - 1].c + LABEL_GAP);
    const over = centres.length ? centres[centres.length - 1].c - (H - 6) : 0;
    if (over > 0) centres.forEach(o => o.c -= over);
    centres.forEach(o => o.s.label.style.top = (o.c + 4) + "px");   // +4: the cells sit inside a 4px casing pad
  }

  /* ---------------- 4. Go to a period ---------------- */
  function goTo(p, instant) {
    cur = p;
    steps.forEach((st, i) => st.classList.toggle("is-active", i === p));
    periodEl.textContent = PERIODS[p];
    layout(p);
    gsap.to(shown, { v: series[0].values[p], duration: instant || reduce ? 0 : .8, ease: "power2.inOut",
      onUpdate: () => { numEl.textContent = Math.round(shown.v); } });
  }

  // refreshPriority -1: measured after the pinned sections above (TK4R2, TK4R7) add their pin spacing,
  // since their scripts run after this one
  steps.forEach((st, i) => ScrollTrigger.create({
    trigger: st, start: "top 60%", end: "bottom 60%", refreshPriority: -1,
    onToggle: self => { if (self.isActive && i !== cur) goTo(i); }
  }));

  // first paint without animating the cells in from nothing
  cellsEl.querySelectorAll(".TK4R6-cell").forEach(c => c.style.transition = "none");
  labelsEl.querySelectorAll(".TK4R6-label").forEach(l => l.style.transition = "none");
  goTo(0, true);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    cellsEl.querySelectorAll(".TK4R6-cell").forEach(c => c.style.transition = "");
    labelsEl.querySelectorAll(".TK4R6-label").forEach(l => l.style.transition = "");
  }));

  new ResizeObserver(() => layout(cur)).observe(cellsEl);
});
