// scripts/TK4R10-busservice.js — TK4R10 · The TVS bus service (illustration scrolly)
// The stage is CSS-sticky; scroll progress through the wrapper decides how many beats are in.
// Beat 0 = the bus (drives in from the right with exhaust smoke), beats 1–4 = the practices. Each reveal is a CSS transition, so nothing is scrubbed.

document.addEventListener("DOMContentLoaded", function () {
  const wrapper = document.getElementById("TK4R10-wrapper");
  if (!wrapper) return;

  gsap.registerPlugin(ScrollTrigger);
  const bus = wrapper.querySelector(".TK4R10-bus");
  const beats = [bus, ...wrapper.querySelectorAll(".TK4R10-item")];

  // exhaust puffs at the rear of the bus: a trail while it drives in, a bigger cough as it brakes.
  // d = delay (s), dx/dy = drift (px), s = end scale, dur = lifetime (s)
  const PUFFS = [
    { d: 0.00, dx: 150, dy: -30, s: 2.0 },
    { d: 0.18, dx: 170, dy: -45, s: 2.3 },
    { d: 0.36, dx: 160, dy: -35, s: 2.2 },
    { d: 0.54, dx: 150, dy: -55, s: 2.4 },
    { d: 0.72, dx: 130, dy: -40, s: 2.3 },
    { d: 0.92, dx: 110, dy: -60, s: 2.5 },
    { d: 1.12, dx: 80,  dy: -55, s: 2.4 },
    { d: 1.40, dx: 40,  dy: -90, s: 3.0, dur: 2.2 },
    { d: 1.48, dx: 70,  dy: -60, s: 2.8, dur: 2.0 },
    { d: 1.58, dx: 10,  dy: -120, s: 3.4, dur: 2.4 },
    { d: 1.70, dx: 55,  dy: -100, s: 3.0, dur: 2.2 }
  ];
  if (bus) {
    const smoke = document.createElement("span");
    smoke.className = "TK4R10-smoke";
    smoke.setAttribute("aria-hidden", "true");
    PUFFS.forEach(p => {
      const puff = document.createElement("span");
      puff.className = "TK4R10-puff";
      puff.style.cssText = `--d:${p.d}s;--dx:${p.dx}px;--dy:${p.dy}px;--s:${p.s};--dur:${p.dur || 1.4}s`;
      smoke.appendChild(puff);
    });
    bus.appendChild(smoke);
  }

  // progress at which each beat comes in: the bus on its own first, then one practice at a time,
  // with a short hold at the end before the stage un-sticks
  const AT = [0, 0.26, 0.42, 0.58, 0.74];

  let shown = -1;
  function show(n) {
    if (n === shown) return;
    shown = n;
    beats.forEach((el, i) => el.classList.toggle("is-in", i <= n));
  }

  ScrollTrigger.create({
    trigger: wrapper,
    start: "top 60%",          // the bus arrives as the section comes up
    end: "bottom bottom",      // the stage un-sticks here
    onUpdate: self => {
      let n = -1;
      AT.forEach((t, i) => { if (self.progress >= t) n = i; });
      show(n);
    },
    onLeaveBack: () => show(-1)
  });
});
