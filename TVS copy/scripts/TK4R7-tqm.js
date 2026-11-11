// scripts/TK4R7-tqm.js — TK4R7 · Four principles of TQM
// The gauge is scroll-linked (scrubbed); the centre copy plays its own eased swap per principle.

document.addEventListener("DOMContentLoaded", function () {
  const stage = document.getElementById("TK4R7-stage");
  if (!stage) return;

  /* ---------------- 1. Data ---------------- */
  const ICONS = {
    kaizen:   ["M3 21h5v-4h5v-4h5V9h3", "M15 3h6v6", "M21 3l-6 6"],
    atarimae: ["M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z", "M8.5 12l2.5 2.5 4.5-5"],
    kansei:   ["M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z", "M7.5 11.5h2.5l1-2 2 4 1-2h2.5"],
    miryoku:  ["M6 4h12l3 5-9 11L3 9z", "M3 9h18", "M9.5 4L8 9l4 11", "M14.5 4L16 9l-4 11"]
  };
  const DATA = [
    { key: "kaizen",   term: "Kaizen",                desc: "Make small and systematic improvements to processes every day." },
    { key: "atarimae", term: "Atarimae hinshitsu",    desc: "Products or services should work as intended, without failure." },
    { key: "kansei",   term: "Kansei",                desc: "Examine how a user interacts with a product physically and emotionally to drive design improvements." },
    { key: "miryoku",  term: "Miryokuteki hinshitsu", desc: "Add aesthetic appeal, charm, and emotional value beyond basic functionality." }
  ];

  /* ---------------- 2. Centre slides ---------------- */
  const core = document.getElementById("TK4R7-core");
  const slide = (cls, num, title, body) => `
    <div class="TK4R7-slide ${cls}">
      <div class="TK4R7-mask"><span class="TK4R7-ln TK4R7-num">${num}</span></div>
      <div class="TK4R7-mask"><h2 class="TK4R7-ln TK4R7-title">${title}</h2></div>
      <span class="TK4R7-bar"></span>
      <div class="TK4R7-mask"><p class="TK4R7-ln TK4R7-desc">${body}</p></div>
    </div>`;
  DATA.forEach((d, i) => core.insertAdjacentHTML("beforeend", slide("TK4R7-slide--step", `${String(i + 1).padStart(2, "0")} / 04`, d.term, d.desc)));
  core.insertAdjacentHTML("beforeend", slide("TK4R7-slide--outro", "04 / 04", "Total quality",
    "Improve daily, work reliably, design for feeling, delight beyond function."));

  /* ---------------- 3. Gauge ---------------- */
  const NS = "http://www.w3.org/2000/svg", svg = document.getElementById("TK4R7-gauge-svg");
  const el = (t, a, p = svg) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); p.appendChild(e); return e; };
  const C = 300, R = 220, A0 = -135, SPAN = 270, SEG = SPAN / 4, GAP = 3;
  const pt = (a, r) => { const t = a * Math.PI / 180; return [C + r * Math.sin(t), C - r * Math.cos(t)]; };
  const arc = (a0, a1, r) => { const [x0, y0] = pt(a0, r), [x1, y1] = pt(a1, r); return `M${x0} ${y0} A${r} ${r} 0 ${(a1 - a0) > 180 ? 1 : 0} 1 ${x1} ${y1}`; };
  const dash = p => { const L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; return p; };

  const orbit = el("circle", { cx: C, cy: C, r: 302, class: "TK4R7-orbit" });
  const inner = el("circle", { cx: C, cy: C, r: 172, class: "TK4R7-inner" });

  const tracks = [], segs = [];
  for (let i = 0; i < 4; i++) {
    const a0 = A0 + i * SEG + GAP / 2, a1 = A0 + (i + 1) * SEG - GAP / 2;
    tracks.push(dash(el("path", { d: arc(a0, a1, R), class: "TK4R7-track" })));
  }
  for (let i = 0; i < 4; i++) {
    const a0 = A0 + i * SEG + GAP / 2, a1 = A0 + (i + 1) * SEG - GAP / 2;
    segs.push(dash(el("path", { d: arc(a0, a1, R), class: "TK4R7-seg" })));
  }

  const tickG = el("g", {}), litG = el("g", {});
  const ticks = [], litTicks = [[], [], [], []];
  for (let k = 0; k <= 40; k++) {
    const a = A0 + k * (SPAN / 40), major = k % 5 === 0;
    const [x0, y0] = pt(a, 238), [x1, y1] = pt(a, major ? 252 : 245);
    const at = { x1: x0, y1: y0, x2: x1, y2: y1 };
    ticks.push(el("line", { ...at, class: "TK4R7-tick" + (major ? " TK4R7-tick--major" : "") }, tickG));
    litTicks[k === 0 ? 0 : Math.ceil(k / 10) - 1].push(
      el("line", { ...at, class: "TK4R7-tick TK4R7-tick--lit" + (major ? " TK4R7-tick--major" : ""), opacity: 0 }, litG));
  }

  const badges = DATA.map((d, i) => {
    const [x, y] = pt(A0 + (i + .5) * SEG, 280);
    const wrap = el("g", { transform: `translate(${x} ${y})` });
    const g = el("g", {}, wrap);
    el("circle", { r: 18, class: "TK4R7-badge-bg" }, g);
    const ring = el("circle", { r: 18, class: "TK4R7-badge-lit", opacity: 0 }, g);
    const mk = (cls, op) => {
      const ig = el("g", { class: cls, transform: "translate(-9.6 -9.6) scale(.8)", opacity: op }, g);
      ICONS[d.key].forEach(dd => el("path", { d: dd }, ig));
      return ig;
    };
    mk("TK4R7-ic", 1);
    const lit = mk("TK4R7-ic TK4R7-ic--lit", 0);
    return { g, lit: [ring, lit] };
  });

  const needle = el("g", {});
  el("line", { x1: C, y1: C - 150, x2: C, y2: C - 186, class: "TK4R7-needle-line" }, needle);
  el("polygon", { points: `${C - 5},${C - 186} ${C + 5},${C - 186} ${C},${C - 206}`, class: "TK4R7-needle" }, needle);

  const ro = el("text", { x: C, y: 506, "text-anchor": "middle", class: "TK4R7-readout" }); ro.textContent = "000";
  const roL = el("text", { x: C, y: 532, "text-anchor": "middle", class: "TK4R7-readout-label" }); roL.textContent = "quality %";

  /* ---------------- 4. Initial state ---------------- */
  gsap.registerPlugin(ScrollTrigger);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  gsap.set(needle, { rotation: A0, svgOrigin: `${C} ${C}` });
  gsap.set(orbit, { svgOrigin: `${C} ${C}` });
  gsap.set(badges.map(b => b.g), { transformOrigin: "50% 50%" });

  const intro = core.querySelector(".TK4R7-slide--intro");
  const steps = [...core.querySelectorAll(".TK4R7-slide--step")];
  const outro = core.querySelector(".TK4R7-slide--outro");
  const lines = s => s.querySelectorAll(".TK4R7-ln");
  const bar = s => s.querySelector(".TK4R7-bar");
  gsap.set([...steps, outro], { autoAlpha: 0 });
  gsap.set(intro, { autoAlpha: 1 });

  const arcs = stage.querySelectorAll(".TK4R7-d-arc");
  const decoLines = stage.querySelectorAll(".TK4R7-d-line, .TK4R7-d-dots");
  const shapes = [...stage.querySelectorAll("#TK4R7-near > *")];
  const pulses = stage.querySelectorAll(".TK4R7-d-dot, .TK4R7-d-ring");
  gsap.set(arcs, { svgOrigin: "500 500" });
  gsap.set(shapes, { transformOrigin: "50% 50%" });

  /* ---------------- 5. Opening: the instrument assembles when the section scrolls into view ---------------- */
  const load = gsap.timeline({ paused: true, defaults: { ease: "power3.inOut" } });
  if (reduce) {
    tracks.forEach(t => t.style.strokeDashoffset = 0);
  } else {
    load.from(orbit, { opacity: 0, scale: .94, duration: 1.4, ease: "power2.out" }, 0)
        .from(inner, { opacity: 0, scale: .8, svgOrigin: `${C} ${C}`, duration: 1.2, ease: "power3.out" }, .1)
        .to(tracks, { strokeDashoffset: 0, duration: 1.1, stagger: .12 }, .15)
        .from(ticks, { opacity: 0, duration: .4, stagger: { each: .015, ease: "power1.in" }, ease: "power1.out" }, .35)
        .from(badges.map(b => b.g), { scale: 0, opacity: 0, duration: .7, stagger: .1, ease: "back.out(1.6)" }, .7)
        .from(needle, { opacity: 0, duration: .5, ease: "power2.out" }, .8)
        .to(needle, { rotation: A0 + 28, duration: .55, ease: "power2.out" }, 1.0)
        .to(needle, { rotation: A0, duration: .8, ease: "elastic.out(1,.55)" }, 1.55)
        .from(lines(intro), { yPercent: 110, duration: .9, stagger: .1, ease: "power4.out" }, .9)
        .from(bar(intro), { scaleX: 0, duration: .8, ease: "power3.out" }, 1.1)
        .from(arcs, { opacity: 0, rotation: -25, duration: 2.2, stagger: .2, ease: "power3.out" }, 0)
        .from(decoLines, { opacity: 0, duration: 1.4, stagger: .1, ease: "power2.out" }, .3)
        .from(shapes, { opacity: 0, scale: 0, duration: .8, stagger: { each: .07, from: "random" }, ease: "back.out(1.8)" }, .6);
  }
  ScrollTrigger.create({ trigger: stage, start: "top 75%", once: true, onEnter: () => load.play() });

  /* ---------------- 6. Scroll story ---------------- */
  const counter = { v: 0 };
  const paint = () => { ro.textContent = String(Math.round(counter.v)).padStart(3, "0"); };

  const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
  tl.to({}, { duration: 1.2 });
  DATA.forEach((d, i) => {
    const go = "go" + i, end = A0 + (i + 1) * SEG - GAP / 2;
    tl.addLabel(go)
      .to(segs[i],       { strokeDashoffset: 0, duration: 1.1, ease: "power3.inOut" }, go)
      .to(needle,        { rotation: end, duration: 1.1, ease: "power3.inOut" }, go)
      .to(counter,       { v: (i + 1) * 25, duration: 1.1, ease: "power3.inOut", onUpdate: paint }, go)
      .to(litTicks[i],   { opacity: 1, duration: .25, stagger: { each: .08, ease: "power2.in" }, ease: "power1.out" }, go)
      .to(badges[i].lit, { opacity: 1, duration: .4, ease: "power2.out" }, go + "+=.8");
    if (i > 0) tl.to(segs[i - 1], { opacity: .4, duration: .8 }, go);
    tl.to({}, { duration: 1.9 });
  });
  tl.addLabel("fin")
    .to(segs, { opacity: 1, duration: .8 }, "fin")
    .to(inner, { attr: { r: 180 }, duration: .9, ease: "power3.inOut" }, "fin")
    .to({}, { duration: 1.2 });

  // slow drift of the outer orbit and parallax of the decorative layers across the whole story
  tl.to(orbit, { rotation: 90, duration: tl.duration(), ease: "sine.inOut" }, 0)
    .to("#TK4R7-far",  { y: 140, duration: tl.duration(), ease: "sine.inOut" }, 0)
    .to("#TK4R7-near", { y: -280, duration: tl.duration(), ease: "sine.inOut" }, 0)
    .to(arcs[0], { rotation: -140, duration: tl.duration(), ease: "sine.inOut" }, 0)
    .to(shapes, { rotation: i => (i % 2 ? 1 : -1) * 180, duration: tl.duration(), ease: "sine.inOut" }, 0);

  /* ---------------- 7. Text state machine ---------------- */
  const states = [intro, ...steps, outro];
  let cur = 0, swap = null;
  function show(n) {
    if (n === cur) return;
    if (load.isActive()) load.progress(1);
    if (swap) swap.progress(1).kill();
    const from = states[cur], to = states[n], dir = n > cur ? 1 : -1;
    cur = n;
    if (!reduce) gsap.fromTo(pulses, { scale: 1 }, { scale: 2.3, duration: .5, ease: "power2.out", yoyo: true, repeat: 1, stagger: .06, overwrite: "auto" });
    swap = gsap.timeline()
      .to(lines(from), { yPercent: -110 * dir, duration: .32, stagger: .04, ease: "power3.in" })
      .to(bar(from), { scaleX: 0, duration: .28, ease: "power3.in" }, 0)
      .set(from, { autoAlpha: 0 })
      .set(to, { autoAlpha: 1 })
      .fromTo(lines(to), { yPercent: 110 * dir }, { yPercent: 0, duration: .7, stagger: .07, ease: "power4.out" })
      .fromTo(bar(to), { scaleX: 0 }, { scaleX: 1, duration: .6, ease: "power3.out" }, "<+=.12");
  }
  function stateAt(t) {
    if (t >= tl.labels.fin + .2) return 5;
    let n = 0;
    DATA.forEach((d, i) => { if (t >= tl.labels["go" + i] + .45) n = i + 1; });
    return n;
  }

  /* ---------------- 8. Scroll trigger ---------------- */
  ScrollTrigger.create({
    trigger: stage, start: "top top", end: "+=820%", pin: true,
    animation: tl, scrub: .5,
    onUpdate: self => show(stateAt(self.progress * tl.duration()))
  });

  /* gentle idle float so the field breathes while you read */
  if (!reduce) {
    shapes.forEach((s, i) => {
      const spin = s.matches(".TK4R7-d-plus, .TK4R7-d-sq, .TK4R7-d-hatch");
      gsap.to(s, {
        y: `+=${(i % 2 ? 1 : -1) * (18 + (i % 3) * 10)}`,
        x: `+=${(i % 3 - 1) * 16 + (i % 2 ? 8 : -8)}`,
        duration: 2.6 + (i % 4) * .7, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.6 + i * .12
      });
      if (spin) gsap.to(s, { scale: 1.25, duration: 2.2 + (i % 3) * .6, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.6 + i * .1 });
    });
    gsap.to(arcs[1], { rotation: 70, duration: 12, ease: "sine.inOut", yoyo: true, repeat: -1 });
  }
});
