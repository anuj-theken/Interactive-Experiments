// scripts/TK4R16-roads.js — TK4R16 · On India's roads (story V3.2)
// Scrubbed timeline over a sticky stage: the sentence settles in, then each bike's print
// drops onto its pile in the order the sentence names them, and that name turns crimson.

document.addEventListener("DOMContentLoaded", function () {
  const section = document.querySelector(".TK4R16-chart-section");
  if (!section || typeof gsap === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const css = getComputedStyle(section);
  const INK = css.getPropertyValue("--color-text").trim();
  const HOT = css.getPropertyValue("--color-primary").trim();

  const wrapper = document.getElementById("TK4R16-wrapper");
  const text = section.querySelector(".TK4R16-text");
  // Sentence order: Rajdoot, Jawa, Yezdi, Enfield
  const ORDER = ["rajdoot", "jawa", "yezdi", "enfield"];
  const REST = { rajdoot: -4, jawa: 3.5, yezdi: 2.5, enfield: -2 };  // resting tilt, degrees
  // stagger: top prints lean outward, bottom prints lean inward (desktop only; phones use a 2×2 grid)
  const wide = matchMedia("(min-width: 769px)").matches;
  const SHIFT = wide ? { rajdoot: -24, jawa: 24, yezdi: 24, enfield: -24 }
                     : { rajdoot: 0, jawa: 0, yezdi: 0, enfield: 0 };

  const prints = ORDER.map(k => section.querySelector(`.TK4R16-print[data-bike="${k}"]`));
  const names  = ORDER.map(k => section.querySelector(`.TK4R16-name[data-bike="${k}"]`));

  gsap.set(text, { autoAlpha: 0, y: 30 });
  prints.forEach((p, i) => gsap.set(p, {
    autoAlpha: 0, y: "-70vh", x: SHIFT[ORDER[i]], rotation: REST[ORDER[i]] * 4
  }));

  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: wrapper,
      start: "top top",
      end: "bottom bottom",
      scrub: reduce ? true : 0.8
    }
  });

  tl.to(text, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" })
    .to({}, { duration: 0.4 });

  prints.forEach((p, i) => {
    tl.to(p, { autoAlpha: 1, y: 0, rotation: REST[ORDER[i]], duration: 0.9, ease: "power3.out" })
      .fromTo(names[i], { color: INK }, { color: HOT, duration: 0.3 }, "-=0.35")
      .to({}, { duration: 0.45 });
  });

  tl.to({}, { duration: 0.6 });   // hold the finished spread before the section scrolls away
});
