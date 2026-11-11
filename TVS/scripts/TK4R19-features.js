// scripts/TK4R19-features.js — TK4R19 · The Jupiter scooter + other new features (story V10.2, V10.3)
// Scrollytelling, same mechanism as TK4R18: the stage is CSS-sticky, story steps scroll past in the
// right column, and the step crossing the trigger line sets data-beat on the scrolly. CSS does the rest.
//   0     the 2013 Jupiter                       6     the four later models, in a row
//   1–4   one feature callout each               7–10  XL 100 · NTorq · Raider · Jupiter 125
//   5     1 million units; TVS takes No. 3
// Here JS also marks each callout and year node as on (its own beat) or past (an earlier one).

document.addEventListener("DOMContentLoaded", function () {
  const scrolly = document.getElementById("TK4R19-scrolly");
  if (!scrolly) return;

  const steps = [...scrolly.querySelectorAll(".TK4R19-step")];
  const calls = [...scrolly.querySelectorAll(".TK4R19-call")];
  const years = [...scrolly.querySelectorAll(".TK4R19-years li")];
  const J13_LAST = 4;   // the 2013 Jupiter's callouts accumulate over beats 1–4
  const phone = window.matchMedia("(max-width: 768px)");

  let current = -1;
  function setBeat(b) {
    if (b === current) return;
    current = b;
    scrolly.dataset.beat = b;
    steps.forEach((s, i) => s.classList.toggle("is-active", i === b));

    calls.forEach(c => {
      const n = +c.dataset.beat;
      c.classList.toggle("is-on", n === b);
      // earlier Jupiter features stay pinned while the next ones are called out
      c.classList.toggle("is-past", n <= J13_LAST && n < b && b <= J13_LAST);
    });
    years.forEach(li => {
      const n = +li.dataset.beat;
      li.classList.toggle("is-on", n === b);
      li.classList.toggle("is-past", n < b);
    });
  }

  // the active step is the last one whose card has crossed the trigger line
  // (70% down on desktop; 85% on phones, where cards ride in along the bottom)
  const cards = steps.map(s => s.querySelector(".TK4R19-card") || s);
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

  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
});
