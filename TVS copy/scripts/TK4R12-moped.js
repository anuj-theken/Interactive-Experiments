// scripts/TK4R12-moped.js — TK4R12 · "Designing" Srinivasan's moped (story V3.3)
// One sticky stage. Scroll progress through the wrapper picks a beat; each beat is a declarative state.
// Every change is a CSS transition (wipe, stretch, crossfade, card slide), so nothing is scrubbed —
// a beat lands, and the copy line fades out and back in.

document.addEventListener("DOMContentLoaded", function () {
  const wrapper = document.getElementById("TK4R12-wrapper");
  const stage = document.getElementById("TK4R12-stage");
  if (!wrapper || !stage) return;

  gsap.registerPlugin(ScrollTrigger);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const box = document.getElementById("TK4R12-box");
  const drawing = document.getElementById("TK4R12-drawing");
  const copyEl = document.getElementById("TK4R12-copy");
  const ticksEl = document.getElementById("TK4R12-ticks");
  const revEl = document.getElementById("TK4R12-rev");
  const statusEl = document.getElementById("TK4R12-status");
  const alertEl = document.getElementById("TK4R12-alert");
  const layers = [...stage.querySelectorAll(".TK4R12-layer")];
  const cards = [...stage.querySelectorAll(".TK4R12-card")];
  const groups = { a: "TK4R12-a", b: "TK4R12-b", fam: "TK4R12-fam" };
  Object.keys(groups).forEach(k => groups[k] = document.getElementById(groups[k]));

  /* ---------------- 1. Beats ----------------
     layer: which frame shows · long: frame stretched · on: annotation groups · status: title-block status
     cards: comparison cards showing · black: the black-background beat */
  const TVS50 = "The TVS 50 launched in 1980 and became a staple of rural India, even a wedding gift.";
  const BEATS = [
    { layer: "bp", on: [], status: "CONCEPT",
      copy: "What Srinivasan had in mind was a two-wheeler that could carry two parents and a child, and was capable of hauling heavy loads." },
    { layer: "bp", on: ["a"], status: "CONCEPT",
      copy: "It required a complete change in the design mindset behind a moped." },
    { layer: "bp", on: ["a"], status: "NOT FEASIBLE", alert: true,
      copy: "Engineers told him that it was impossible," },
    { layer: "bp", long: true, on: ["b"], status: "IN DEVELOPMENT",
      copy: "but Srinivasan was determined to make it work." },
    { layer: "bp", long: true, on: ["fam"], status: "IN DEVELOPMENT",
      copy: "He bought 200 acres in Hosur and invested four years of Sundaram Clayton’s cash flow into his project." },
    { layer: "hosur",
      copy: "Srinivasan began to set up the plant in 1976. It could make 60,000 vehicles a year, when the total sales of mopeds across India were only 40,000 per annum." },
    { layer: "hosur", black: true,
      copy: "The factory walls went up one day in 1979, the same day Srinivasan died. He didn’t get to see his vision become reality." },
    { layer: "venu",
      copy: "Srinivasan’s son Venu became managing director of Sundaram Clayton." },
    // the finished design on paper, then the real thing — the copy holds while the frame changes
    { layer: "bp", long: true, on: [], status: "IN PRODUCTION", copy: TVS50 },
    { layer: "moped", copy: TVS50 },
    // comparisons: the design stays as the base; the motorcycles arrive as cards, and stay
    { layer: "bp", long: true, on: [], status: "IN PRODUCTION", cards: ["ax100"],
      copy: "In 1982, TVS partnered with Suzuki on motorcycles, and the AX100 delivered 45 km/L." },
    { layer: "bp", long: true, on: [], status: "IN PRODUCTION", cards: ["ax100", "cd100"],
      copy: "But Hero Honda’s four-stroke CD 100 arrived three years later with 70–80 km/L and upended the market." }
  ];
  const N = BEATS.length;
  const BEAT_VH = 85;                       // scroll length per beat
  wrapper.style.height = `calc(${N * BEAT_VH}vh + 100vh)`;
  ticksEl.innerHTML = BEATS.map(() => "<span></span>").join("");
  const ticks = [...ticksEl.children];

  /* ---------------- 2. Apply a beat ---------------- */
  let cur = -1, copyTween = null;
  function setCopy(text) {
    if (copyEl.dataset.text === text) return;
    copyEl.dataset.text = text;
    if (copyTween) copyTween.kill();
    if (reduce) { copyEl.textContent = text; return; }
    copyTween = gsap.timeline()
      .to(copyEl, { opacity: 0, y: -8, duration: .3, ease: "power1.in" })   // copyEl is the inner span
      .add(() => { copyEl.textContent = text; })
      .fromTo(copyEl, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .55, ease: "power2.out" });
  }

  function goTo(i) {
    if (i === cur) return;
    cur = i;
    const b = BEATS[i];
    layers.forEach(l => l.classList.toggle("is-on", l.dataset.layer === b.layer));
    stage.classList.toggle("is-black", !!b.black);

    if (b.layer === "bp") {
      drawing.classList.add("is-drawn");
      drawing.classList.toggle("is-long", !!b.long);
      Object.entries(groups).forEach(([k, g]) => g.classList.toggle("is-on", (b.on || []).includes(k)));
      revEl.textContent = b.long ? "B · TWO ADULTS + CHILD" : "A · ONE RIDER";
      statusEl.textContent = b.status;
      statusEl.classList.toggle("is-alert", !!b.alert);
      alertEl.classList.toggle("is-on", !!b.alert);
    }

    const showCards = b.cards || [];
    box.classList.toggle("is-compare", showCards.length > 0);
    cards.forEach(c => {
      const on = showCards.includes(c.dataset.card);
      c.classList.toggle("is-on", on);
      c.querySelectorAll("[data-w]").forEach(bar => bar.style.width = on ? bar.dataset.w + "%" : "0");
    });

    ticks.forEach((t, j) => t.classList.toggle("is-on", j <= i));
    setCopy(b.copy);
  }

  /* ---------------- 3. Scroll → beat ---------------- */
  // refreshPriority -1: measured after the pinned sections above have added their pin spacing
  ScrollTrigger.create({
    trigger: wrapper, start: "top top", end: "bottom bottom", refreshPriority: -1,
    onUpdate: self => goTo(Math.min(N - 1, Math.floor(self.progress * N)))
  });
  // the first drawing waits until the stage is actually on screen
  ScrollTrigger.create({
    trigger: wrapper, start: "top 65%", once: true, refreshPriority: -1,
    onEnter: () => goTo(Math.max(cur, 0))
  });

  copyEl.textContent = copyEl.dataset.text = BEATS[0].copy;
});
