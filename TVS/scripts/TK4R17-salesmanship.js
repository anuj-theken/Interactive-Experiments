// scripts/TK4R17-salesmanship.js — TK4R17 · Doraiswamy's salesmanship + TVS customer service (story V2.3)
// Storybook scrolly. The stage is CSS-sticky. Scroll position through the wrapper picks a beat (0–8);
// each beat is a composition of illustration layers that all share one 2684×1440 canvas, plus a
// text block placed in that picture's empty space. JS writes each layer's opacity + transform and
// toggles the text; CSS transitions the change, so nothing is scrubbed.
//
// Scenes:  the week-long test drive (beats 0–4) · after the sale (5–6) · the war years (7–8)

document.addEventListener("DOMContentLoaded", function () {
  const wrapper = document.getElementById("TK4R17-wrapper");
  if (!wrapper) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const BEATS = 9;

  // ── transforms — always "translate scale rotate" so CSS can interpolate between any two ──
  const T = (x = 0, y = 0, s = 1, r = 0) => `translate(${x}%, ${y}%) scale(${s}) rotate(${r}deg)`;
  const HOME = T();
  // Frame 4's close-up is the same car at 1.2×, offset (−56px, −40px) on the 2684×1440 canvas
  // (fitted against the artwork, IoU 0.997), so one car layer zooms instead of cross-fading two.
  const CAR_ZOOM = T(-56 / 26.84, -40 / 14.4, 1.2);
  // …and on Frame 4 it drives in from the right: same scale and height, starting ~24% further right
  const CAR_ZOOM_FROM_RIGHT = T(-56 / 26.84 + 24, -40 / 14.4, 1.2);
  // the postcard rests a little smaller and to the right, leaving the left third for its text
  const POSTCARD = T(13, 2, 0.82);

  // at:   beat → transform while visible (opacity defaults to 1, or { t, o })
  // pre:  where the layer waits before its first beat     post: where it goes after its last beat
  // mid:  where it waits in a gap between visible beats   delay: entrance delay (s), so layers stack in
  // enter: beat → transform the layer snaps to (while hidden) just before it slides in on that beat
  const LAYERS = {
    car: {
      at: { 0: HOME, 1: HOME, 3: CAR_ZOOM, 4: CAR_ZOOM, 6: HOME },
      // the car only ever travels right → left: in every scene it fades in from the right and
      // leaves to the left (enter on every visible beat, so scrolling back up does the same)
      pre: T(14), mid: T(-6), post: T(-16),
      enter: { 0: T(14), 1: T(14), 3: CAR_ZOOM_FROM_RIGHT, 4: CAR_ZOOM_FROM_RIGHT, 6: T(14) }
    },
    dorai:     { at: { 0: HOME }, pre: T(4), post: T(3), delay: 0.45 },
    handshake: { at: { 1: HOME }, pre: T(0, 4), post: T(0, 3), delay: 0.2 },
    cart:      { at: { 2: HOME }, pre: T(-34), post: T(36), delay: 0.15 },
    customer:  { at: { 3: HOME, 4: HOME }, pre: T(-5), post: T(-3), delay: 0.5 },
    phone:     { at: { 4: HOME }, pre: T(4), post: T(3), delay: 0.1 },
    postcard:  { at: { 5: POSTCARD }, pre: T(13, -18, 0.82, -9), post: T(26, 10, 0.75, 7) },
    mechanic:  { at: { 6: HOME }, pre: T(6), post: T(4), delay: 0.55 },
    parts:     { at: { 7: HOME, 8: { t: T(0, 3, 0.94), o: 0.14 } }, pre: T(0, 8), post: T(0, 3) }
  };

  // ── DOM ──
  const layerEls = {};
  wrapper.querySelectorAll(".TK4R17-layer").forEach(el => { layerEls[el.dataset.layer] = el; });
  const textEls = [...wrapper.querySelectorAll(".TK4R17-text")].map(el => ({
    el,
    beats: el.dataset.beats.split(",").map(Number),
    lines: [...el.querySelectorAll(".TK4R17-line")]
  }));
  const tvs = wrapper.querySelector(".TK4R17-tvs");

  function stateFor(cfg, b) {
    const shown = cfg.at[b];
    if (shown !== undefined) {
      return typeof shown === "string" ? { t: shown, o: 1 } : shown;
    }
    const beats = Object.keys(cfg.at).map(Number);
    const first = Math.min(...beats), last = Math.max(...beats);
    let t = b < first ? cfg.pre : b > last ? cfg.post : (cfg.mid || cfg.pre);
    if (reduceMotion) {
      // no travel: a hidden layer simply waits where it will (or did) appear
      const near = beats.reduce((a, c) => (Math.abs(c - b) < Math.abs(a - b) ? c : a), first);
      const s = cfg.at[near];
      t = typeof s === "string" ? s : s.t;
    }
    return { t, o: 0 };
  }

  let current = -2;
  function show(b) {
    if (b === current) return;
    current = b;

    // illustration layers (b = −1, not reached yet, parks every layer at its `pre`)
    Object.entries(LAYERS).forEach(([key, cfg]) => {
      const el = layerEls[key];
      if (!el) return;
      const s = stateFor(cfg, b);
      const visible = b >= 0 && s.o > 0;
      const wasVisible = el.dataset.on === "1";
      const from = visible && !wasVisible && !reduceMotion && cfg.enter && cfg.enter[b];
      if (from) {
        // jump to the start point with no transition, then let the slide-in below run from there
        el.style.transition = "none";
        el.style.transform = from;
        void el.offsetWidth;
        el.style.transition = "";
      }
      el.style.transitionDelay = visible && !wasVisible && cfg.delay ? `${cfg.delay}s` : "0s";
      el.style.transform = s.t;
      el.style.opacity = b >= 0 ? s.o : 0;
      el.dataset.on = visible ? "1" : "0";
    });

    // story text — a block shows on its beats; within it, each line arrives on its own beat
    textEls.forEach(({ el, beats, lines }) => {
      el.classList.toggle("is-in", beats.includes(b));
      lines.forEach(line => line.classList.toggle("is-in", b >= Number(line.dataset.beat)));
    });

    // "Trust, Value, and Service"
    if (tvs) tvs.classList.toggle("is-on", b >= 8);
  }

  // ── scroll → beat ──
  // Read from the wrapper's LIVE position on every frame rather than ScrollTrigger's cached
  // start/end: sections above (charts, 3D, lazy images, pins) can change height after load, which
  // left cached offsets stale and made beats arrive late or get skipped.
  //   · beat 0 arrives as the wrapper top comes up past 60% of the viewport
  //   · beat k lands when the stage has been stuck for (k − LEAD) × STEP viewports — LEAD makes
  //     each page turn a little before the previous one has been fully scrolled through
  //   · the wrapper is tall enough (CSS 950vh) to hold the last page ≈ 1.3 viewports
  const STEP = 0.9, LEAD = 0.15;
  function beatNow() {
    const vh = window.innerHeight;
    const top = wrapper.getBoundingClientRect().top;
    if (top > vh * 0.6) return -1;               // not reached yet
    const stuck = -top / vh;                     // viewports scrolled since the stage stuck
    let b = 0;
    for (let k = 1; k < BEATS; k++) if (stuck >= (k - LEAD) * STEP) b = k;
    return b;
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; show(beatNow()); });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  show(beatNow());
});
