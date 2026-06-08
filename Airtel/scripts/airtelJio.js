let icons = [],
  jioIdx = [],
  airtelIdx = [];

function buildGrid() {
  const grid = document.getElementById("QW4K-icon-grid");
  const container = document.getElementById("QW4K-screen");

  if (!container || !grid) return;

  const vw = container.clientWidth;
  const vh = container.clientHeight;

  const isMobile = vw < 768;
  const size = isMobile ? 32 : 50;
  const gap = isMobile ? 10 : 18;
  const pad = isMobile ? 24 : 40;

  const step = size + gap;
  const cols = Math.max(1, Math.floor((vw - pad * 2 + gap) / step));
  const rows = Math.max(1, Math.floor((vh - pad * 2 + gap) / step));
  const total = cols * rows;

  grid.innerHTML = "";
  icons = [];

  grid.style.padding = `${pad}px`;
  grid.style.gap = `${gap}px`;
  grid.style.gridTemplateColumns = `repeat(${cols}, ${size}px)`;
  grid.style.gridTemplateRows = `repeat(${rows}, ${size}px)`;

  const ns = "http://www.w3.org/2000/svg";
  for (let i = 0; i < total; i++) {
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 50 50");
    svg.classList.add("QW4K-icon-svg");

    const h = document.createElementNS(ns, "path");
    h.setAttribute(
      "d",
      "M25 21.875C30.1777 21.875 34.375 17.6777 34.375 12.5C34.375 7.32234 30.1777 3.125 25 3.125C19.8223 3.125 15.625 7.32234 15.625 12.5C15.625 17.6777 19.8223 21.875 25 21.875Z",
    );
    h.classList.add("QW4K-ip");

    const b = document.createElementNS(ns, "path");
    b.setAttribute(
      "d",
      "M43.75 37.5C43.75 32.3222 39.5528 28.125 34.375 28.125H15.625C10.4473 28.125 6.25 32.3222 6.25 37.5V46.875H43.75V37.5Z",
    );
    b.classList.add("QW4K-ib");

    svg.appendChild(h);
    svg.appendChild(b);
    grid.appendChild(svg);
    icons.push(svg);
  }

  const sh = Array.from({ length: total }, (_, i) => i).sort(
    () => Math.random() - 0.5,
  );
  const split = Math.round(total * 0.51);
  jioIdx = sh.slice(0, split);
  airtelIdx = sh.slice(split);
}

let masterTl;
const blueP = { v: 0 },
  redP = { v: 0 },
  ovlP = { v: 0 };

function setBlues(f) {
  const n = Math.round(jioIdx.length * f);
  jioIdx.forEach((idx, i) => {
    if (icons[idx]) icons[idx].classList.toggle("QW4K-blue", i < n);
  });
}
function setReds(f) {
  const n = Math.round(airtelIdx.length * f);
  airtelIdx.forEach((idx, i) => {
    if (icons[idx]) icons[idx].classList.toggle("QW4K-red", i < n);
  });
}
function setOvl(f) {
  const overlay = document.getElementById("QW4K-overlay");
  if (overlay) overlay.style.background = `rgba(0,0,0,${f * 0.55})`;
}

function buildMasterTimeline() {
  if (masterTl) masterTl.kill();

  const jioTt = document.getElementById("QW4K-jiotooltip");
  const airtelTt = document.getElementById("QW4K-airtelltooltip");
  const gr = document.getElementById("QW4K-gr");

  if (!jioTt || !airtelTt || !gr) return;

  masterTl = gsap.timeline({ paused: true });

  gsap.set([jioTt, airtelTt], { opacity: 0, visibility: "hidden", y: 300 });
  gsap.set(gr, { opacity: 0, visibility: "hidden", y: 400 });

  if (document.querySelector("#QW4K-abar"))
    gsap.set(["#QW4K-abar", "#QW4K-jbar"], { width: "0%" });
  if (document.querySelector(".QW4K-circ.QW4K-ca"))
    gsap.set([".QW4K-circ.QW4K-ca", ".QW4K-circ.QW4K-cj"], { scale: 0 });
  if (document.querySelector(".QW4K-ann.QW4K-a-ann"))
    gsap.set([".QW4K-ann.QW4K-a-ann", ".QW4K-ann.QW4K-j-ann"], { opacity: 0 });

  // TRIGGER 1: Jio Info Drop + Fill Grid
  masterTl
    .to(
      jioTt,
      {
        visibility: "visible",
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      },
      0.0,
    )
    .to(
      blueP,
      { v: 1, duration: 0.7, ease: "none", onUpdate: () => setBlues(blueP.v) },
      0.0,
    )
    .to(jioTt, { opacity: 0, y: -300, duration: 0.3, ease: "power2.in" }, 0.7)
    .set(jioTt, { visibility: "hidden" }, 1.0);

  // TRIGGER 2: Airtel Info Drop + Fill Remaining Grid
  masterTl
    .to(
      airtelTt,
      {
        visibility: "visible",
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      },
      1.1,
    )
    .to(
      redP,
      { v: 1, duration: 0.7, ease: "none", onUpdate: () => setReds(redP.v) },
      1.1,
    )
    .to(
      airtelTt,
      { opacity: 0, y: -300, duration: 0.3, ease: "power2.in" },
      1.8,
    )
    .set(airtelTt, { visibility: "hidden" }, 2.1);

  // TRIGGER 3: Combined Analytics Board
  masterTl
    .to(ovlP, { v: 1, duration: 0.3, onUpdate: () => setOvl(ovlP.v) }, 2.2)
    .to(
      gr,
      {
        visibility: "visible",
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
      },
      2.2,
    );

  if (document.querySelector("#QW4K-abar")) {
    masterTl
      .to(
        "#QW4K-abar",
        { width: "100%", duration: 0.5, ease: "power3.out" },
        2.5,
      )
      .to(
        "#QW4K-jbar",
        { width: "83.2%", duration: 0.5, ease: "power3.out" },
        2.6,
      );
  }

  if (document.querySelector(".QW4K-circ.QW4K-ca")) {
    masterTl
      .to(
        ".QW4K-circ.QW4K-ca",
        { scale: 1, duration: 0.5, ease: "back.out(1.7)" },
        2.5,
      )
      .to(
        ".QW4K-circ.QW4K-cj",
        { scale: 1, duration: 0.5, ease: "back.out(1.7)" },
        2.6,
      );
  }

  if (document.querySelector(".QW4K-ann.QW4K-a-ann")) {
    masterTl.to(
      [".QW4K-ann.QW4K-a-ann", ".QW4K-ann.QW4K-j-ann"],
      { opacity: 1, duration: 0.3, stagger: 0.1 },
      2.8,
    );
  }

  masterTl.to({}, { duration: 0.6 });
}

// SETUP SCROLLTRIGGER PIN BINDINGS (Handles bidirectional down and up sticking)
function setupScrollPin() {
  gsap.registerPlugin(ScrollTrigger);

  const isMobile = window.innerWidth < 768;

  ScrollTrigger.create({
    trigger: ".QW4K-animation-section-wrapper",
    start: isMobile ? "top top" : "top top",
    // INCREASED VALUES: Desktop goes from 2000 to 3500, Mobile goes from 1500 to 2500
    end: isMobile ? "+=2500" : "+=3500",
    pin: true,
    scrub: true, // This tightly syncs scroll speed to timeline speed
    pinSpacing: true,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      if (masterTl) masterTl.progress(self.progress);
    },
  });
}

function initializeModule() {
  buildGrid();
  buildMasterTimeline();
  setupScrollPin();
}

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", initializeModule);
} else {
  initializeModule();
}

window.addEventListener("resize", () => {
  buildGrid();
  buildMasterTimeline();
  ScrollTrigger.refresh();
});
