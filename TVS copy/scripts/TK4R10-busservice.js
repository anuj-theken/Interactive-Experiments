// scripts/TK4R10-busservice.js — TK4R10 · The TVS bus service (illustration scrolly)
// The stage is CSS-sticky; scroll progress through the wrapper decides how many beats are in.
// Beat 0 = the bus, beats 1–4 = the practices. Each reveal is a CSS transition, so nothing is scrubbed.

document.addEventListener("DOMContentLoaded", function () {
  const wrapper = document.getElementById("TK4R10-wrapper");
  if (!wrapper) return;

  gsap.registerPlugin(ScrollTrigger);
  const beats = [wrapper.querySelector(".TK4R10-bus"), ...wrapper.querySelectorAll(".TK4R10-item")];

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
