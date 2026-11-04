// scripts/TK4R2-wheel.js — TK4R2 · Wheel timeline, 1946–1961
// After imgs/reference/tire stuff.png: cards ride a dark disc's rim, the tire turns to the right
// of the copy (never under it) and a small ring rides the tire's rim with progress.

document.addEventListener("DOMContentLoaded", function () {
  const section = document.querySelector(".TK4R2-chart-section");
  const stage   = document.getElementById("TK4R2-stage");
  if (!section || !stage) return;

  // Image paths differ between index files — the section carries its own base.
  const IMG_BASE = section.dataset.imgBase || "";

  /* ---------------- 1. Data ----------------
     img: alt text (or placeholder label when there is no src) · src: photo path(s) under imgs/
     null img = text-only beat · "map" = the inline Padi map */
  const STORY = [
    { kicker: "1946", title: "Southern Roadways", img: "Southern Roadways", src: "imgs/TK4R2/TK4R2-01-southern-roadways.jpg",
      body: "Southern Roadways is founded in 1946 to offer passenger bus and cargo services." },
    { kicker: "Late 1940s", title: "Madras Motor Insurance", img: "Madras Motor Insurance", src: "imgs/TK4R2/TK4R2-02-madras-motors.jpg",
      body: "Madras Motor Insurance is set up in the late 1940s." },
    { kicker: "1954", title: "Sundaram Finance", img: "Madras in the 1950s", src: "imgs/TK4R2/TK4R2-03-sundaram-finance.jpg",
      body: "Sundaram Finance is established in 1954 to help transport operators purchase vehicles. It eventually becomes one of the larger NBFCs of India, with more than Rs 62,000 crore under assets under management as of 30 June 2026." },
    { kicker: "1954", title: "General Motors", img: "New York Times report on General Motors and Ford closing their Indian plants", src: "imgs/TK4R2/TK4R2-04-gm.jpg", pos: "center top",
      body: "At the same time, in 1954, General Motors exits India, believing the country does not have a proper industrial base. TVS’s business around being a GM dealership comes to an end after 25 years." },
    { kicker: "1955", statement: "Sundaram dies in 1955.", img: null },
    { title: "Srinivasan", img: "Jawaharlal Nehru at a microscope; officials inspecting railway wheels", src: ["imgs/TK4R2/TK4R2-06a-nehru.jpg", "imgs/TK4R2/TK4R2-06b-rail.jpg"],
      body: "Sundaram’s youngest son, Srinivasan, urges his older brothers to get into manufacturing." },
    { statement: "The TVS group sets up four British-partnered ventures.", light: true, img: null },
    { kicker: "1961", title: "Wheels India", img: "Wheels India", src: "imgs/TK4R2/TK4R2-08-wheels-india.jpg",
      body: "Wheels India is formed with Dunlop in 1961 to make wheels for cars and trucks." },
    { title: "Lucas TVS", img: "Lucas-TVS Genuine Spares sign", src: "imgs/TK4R2/TK4R2-09-lucas-tvs.jpg", pos: "center top",
      body: "Lucas TVS is established with Lucas to make electrical equipment for automobiles." },
    { title: "Brakes India", img: "Brakes India logo", src: "imgs/TK4R2/TK4R2-10-brakes-india.jpg", fit: "contain",
      body: "Brakes India is formed with Lucas Girling to make hydraulic brake systems." },
    { title: "Sundaram Clayton", img: "Clayton Dewandre advertisement", src: "imgs/TK4R2/TK4R2-11-clayton.jpg", fit: "contain",
      body: "Sundaram Clayton is a joint venture with Clayton Dewandre to make brake systems for commercial vehicles. This company later gives the TVS group its first two-wheeler." },
    { kicker: "Padi, Madras", title: "265 acres", img: "map",
      body: "To accommodate these operations, Srinivasan locates 265 acres in Padi, on the outskirts of Madras." }
  ];

  // Placeholder locator map — token colours only
  const MAP_SVG = `<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="320" height="200" fill="var(--map-land)"/>
    <path d="M268 0 C258 50 262 100 252 150 C248 175 250 190 246 200 L320 200 L320 0Z" fill="var(--map-sea)"/>
    <g fill="none" stroke="var(--color-muted)" stroke-width="1.4" opacity=".55">
      <path d="M40 200 L120 120 L200 108 L250 100"/>
      <path d="M0 70 L100 82 L200 108"/>
      <path d="M160 0 L170 60 L200 108 L215 200"/>
    </g>
    <circle cx="200" cy="108" r="5" fill="var(--color-text)"/>
    <text class="TK4R2-map-label" x="210" y="128">Madras</text>
    <circle cx="112" cy="80" r="22" fill="var(--color-primary)" opacity=".18"/>
    <circle cx="112" cy="80" r="6" fill="var(--color-primary)"/>
    <text class="TK4R2-map-label TK4R2-map-label--key" x="90" y="58">Padi</text>
  </svg>`;

  /* ---------------- 2. Build DOM ---------------- */
  const N = STORY.length;
  const pad = n => String(n).padStart(2, "0");
  const orbitEl = document.getElementById("TK4R2-orbit");
  const copyEl  = document.getElementById("TK4R2-copy");
  const shots = [], entries = [];
  function add(tag, cls, html) {
    const el = document.createElement(tag);
    el.className = cls; el.innerHTML = html;
    copyEl.appendChild(el);
    return el;
  }
  STORY.forEach((s, i) => {
    if (s.img) {
      const f = document.createElement("figure");
      f.className = "TK4R2-shot";
      let inner;
      if (s.img === "map") inner = MAP_SVG;
      else if (s.src) {
        // src may be one path or an array (shown side by side); fit: "contain" for logos/ads, pos: object-position
        const srcs = [].concat(s.src);
        const style = s.pos ? ` style="object-position:${s.pos}"` : "";
        inner = srcs.map((u, k) => `<img src="${IMG_BASE}${u}" alt="${k ? "" : s.img}" decoding="async"${style}>`).join("");
      }
      else inner = `<span>${s.img}</span>`;
      const mods = (s.src && [].concat(s.src).length > 1 ? " TK4R2-ph--pair" : "") + (s.fit === "contain" ? " TK4R2-ph--contain" : "");
      f.innerHTML = `<div class="TK4R2-ph${mods}">${inner}</div>`;
      f._i = i;
      orbitEl.appendChild(f); shots.push(f);
    }
    const e = { statement: !!s.statement };
    if (s.kicker) e.yr = add("div", "TK4R2-yr", s.kicker);
    if (s.statement) {
      e.title = add("h2", "TK4R2-statement" + (s.light ? " TK4R2-statement--light" : ""), s.statement);
    } else {
      e.title = add("h2", "TK4R2-title", s.title);
      e.body  = add("p", "TK4R2-body", s.body);
    }
    e.num = add("div", "TK4R2-num", `${pad(i + 1)}<small>/${pad(N)}</small>`);
    e.parts = [e.yr, e.title, e.num, e.body].filter(Boolean);
    entries.push(e);
  });

  /* ---------------- 3. Geometry ---------------- */
  gsap.registerPlugin(ScrollTrigger);
  const disc = document.getElementById("TK4R2-disc");
  const tire = document.getElementById("TK4R2-tire");
  const ring = document.getElementById("TK4R2-ring");
  const hint = document.getElementById("TK4R2-hint");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const MOVE = 1.4;            // seconds for one step
  const EASE = "sine.inOut";
  const RING_SWEEP = 35;       // the ring travels ±35° along the tire rim over the whole sequence

  let geo = {};
  const disp = { p: 0 };
  let idx = 0;

  const hOf = el => el ? el.offsetHeight : 0;
  const lineOf = el => parseFloat(getComputedStyle(el).lineHeight) || el.offsetHeight;

  // Wide screens: hub off the right edge, cards ride the disc's left rim, copy in a column
  // between the card and the tire.
  function layoutWide(W, H) {
    let imgW = Math.min(Math.min(Math.max(H * 0.42, 220), 420) * 1.42, W * 0.36);
    const imgH = Math.round(imgW / 1.42); imgW = Math.round(imgW);
    const imgL = Math.round(W * 0.2), imgTop = Math.round(H * 0.52 - imgH / 2);
    const imgR = imgL + imgW, imgB = imgTop + imgH;
    const colL = imgR + 40, colW = Math.round(Math.min(Math.max(W * 0.2, 260), 380));
    const tireL = colL + colW + 40;                       // the tire never reaches the copy column
    const r = Math.round(H * 0.62);
    const cx = tireL + r, cy = imgTop + imgH / 2;
    const R = cx - (imgL + imgW / 2);
    geo = { mode: "side", cx, cy, R, r, D: R + imgW * 0.25, imgW, imgH, dir: -1,
            stepDeg: imgH * 1.35 / R * 180 / Math.PI };

    const titleL = Math.round(imgL + imgW * 0.5);
    entries.forEach(e => {
      if (e.statement) {
        e.title.style.width = (tireL - 24 - imgL) + "px";
        const top = cy - hOf(e.title) / 2;
        gsap.set(e.title, { left: imgL, top });
        if (e.yr) gsap.set(e.yr, { left: imgL, top: top - hOf(e.yr) - 12 });
      } else {
        e.title.style.width = (tireL - 24 - titleL) + "px";
        e.body.style.width = colW + "px";
        const top = imgTop - lineOf(e.title) * 0.7;      // first line sits above the card, the rest overlaps it
        gsap.set(e.title, { left: titleL, top });
        gsap.set(e.body, { left: colL, top: Math.max(top + hOf(e.title) + 20, imgTop + imgH * 0.35) });
        if (e.yr) gsap.set(e.yr, { left: titleL, top: top - hOf(e.yr) - 10 });
      }
      gsap.set(e.num, { left: imgR + 16 - e.num.offsetWidth, top: imgB - hOf(e.num) * 0.55 });
    });
  }

  // Tall screens: one centred column, the tire rises from the bottom below the copy.
  function layoutTall(W, H) {
    const m = 20, topPad = 96;
    let imgW = Math.min(W - m * 2, 560), imgH, imgTop, bodyTop, maxBody;
    const plain = entries.filter(e => !e.statement);
    for (;;) {
      imgH = Math.round(imgW * 0.7);
      entries.forEach(e => {
        e.title.style.width = (e.statement ? imgW : imgW - 16) + "px";
        if (e.body) e.body.style.width = imgW + "px";
      });
      const yrH = Math.max(...entries.map(e => hOf(e.yr)));
      const lineH = lineOf(plain[0].title);
      const maxTitle = Math.max(...plain.map(e => hOf(e.title)));
      imgTop = topPad + yrH + 8 + Math.max(lineH * 0.7, maxTitle - lineH * 1.3);
      bodyTop = imgTop + imgH + hOf(entries[0].num) * 0.45 + 12;
      maxBody = Math.max(...plain.map(e => hOf(e.body)));
      if (bodyTop + maxBody + H * 0.1 <= H || imgW <= 220) break;
      imgW -= 20;
    }
    const imgL = Math.round((W - imgW) / 2), imgR = imgL + imgW, imgB = imgTop + imgH;
    const icy = imgTop + imgH / 2;
    const r = Math.round(Math.min(W * 0.85, 560));
    const treadTop = Math.max(bodyTop + maxBody + 24, H - r * 0.6);   // the tire stays below the copy
    const cx = W / 2, cy = treadTop + r, R = cy - icy;
    geo = { mode: "top", cx, cy, R, r, D: R + imgH * 0.25, imgW, imgH, dir: 1,
            stepDeg: imgW * 1.15 / R * 180 / Math.PI };

    entries.forEach(e => {
      if (e.statement) {
        const top = icy - hOf(e.title) / 2;
        gsap.set(e.title, { left: imgL, top });
        if (e.yr) gsap.set(e.yr, { left: imgL, top: top - hOf(e.yr) - 10 });
      } else {
        const top = imgTop - lineOf(e.title) * 0.7;
        gsap.set(e.title, { left: imgL + 8, top });
        gsap.set(e.body, { left: imgL, top: bodyTop });
        if (e.yr) gsap.set(e.yr, { left: imgL + 8, top: top - hOf(e.yr) - 8 });
      }
      gsap.set(e.num, { left: imgR + 4 - e.num.offsetWidth, top: imgB - hOf(e.num) * 0.55 });
    });
  }

  function layout() {
    const W = stage.clientWidth, H = stage.clientHeight;
    if (W > 900 && W >= H * 0.9) layoutWide(W, H); else layoutTall(W, H);
    const { cx, cy, r, D, imgW, imgH } = geo;
    gsap.set(tire, { width: 2 * r, height: 2 * r, left: cx - r, top: cy - r });
    gsap.set(disc, { width: 2 * D, height: 2 * D, left: cx - D, top: cy - D });
    shots.forEach(s => gsap.set(s, { width: imgW, height: imgH }));
    render(disp.p);
  }

  /* ---------------- 4. Render ---------------- */
  function render(p) {
    const { cx, cy, R, r, stepDeg, imgW, imgH, dir, mode } = geo;
    // the wheel turns by exactly the angle the cards travel, so they read as attached
    tire.style.transform = `rotate(${p * stepDeg * -dir}deg)`;

    shots.forEach(s => {
      const k = s._i - p, d = Math.abs(k);
      const a = k * stepDeg * dir * Math.PI / 180;
      const px = mode === "side" ? cx - R * Math.cos(a) : cx + R * Math.sin(a);
      const py = mode === "side" ? cy - R * Math.sin(a) : cy - R * Math.cos(a);
      // active card full strength, neighbours dimmed on the disc, the rest gone
      const o = d < 1 ? 1 - d * 0.6 : Math.max(0, 0.4 - (d - 1) * 0.4);
      s.style.transform = `translate3d(${px - imgW / 2}px, ${py - imgH / 2}px, 0)`;
      s.style.opacity = o;
      s.style.zIndex = 100 - Math.round(d * 10);
      s.style.visibility = o <= 0.01 ? "hidden" : "visible";
    });

    // the small ring rides the tire's rim, sweeping with progress
    const t = N > 1 ? p / (N - 1) : 0;
    const phi = (RING_SWEEP - 2 * RING_SWEEP * t) * Math.PI / 180, rr = r * 0.84;  // on the rubber, inside the tread
    const kx = mode === "side" ? cx - rr * Math.cos(phi) : cx - rr * Math.sin(phi);
    const ky = mode === "side" ? cy - rr * Math.sin(phi) : cy - rr * Math.cos(phi);
    ring.style.transform = `translate(${kx - 11}px, ${ky - 11}px)`;
  }

  /* ---------------- 5. Text transitions ---------------- */
  const vis = (e, v) => e.parts.forEach(el => el.style.visibility = v);
  function showText(next, prev) {
    const inE = entries[next], outE = prev != null && prev !== next ? entries[prev] : null;
    if (reduce) {
      entries.forEach(e => vis(e, "hidden"));
      vis(inE, "visible");
      gsap.set(inE.parts, { opacity: 1, y: 0 });
      return;
    }
    if (outE) {
      gsap.to(outE.parts, { opacity: 0, y: -10, duration: .4, ease: "sine.in", stagger: .03, overwrite: true,
        onComplete() { vis(outE, "hidden"); } });
    }
    vis(inE, "visible");
    gsap.fromTo(inE.parts, { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: .8, ease: "sine.out", stagger: .06, delay: outE ? .4 : 0, overwrite: true });
  }

  function goTo(i) {
    const prev = idx;
    idx = i;
    entries.forEach((e, j) => e.parts.forEach(el => el.setAttribute("aria-hidden", j === i ? "false" : "true")));
    showText(i, prev);
    gsap.to(disp, { p: i, duration: reduce ? 0 : MOVE, ease: EASE, overwrite: true, onUpdate: () => render(disp.p) });
    gsap.to(hint, { opacity: i === 0 ? 1 : 0, duration: .6 });
  }

  /* ---------------- 6. Scroll trigger ---------------- */
  ScrollTrigger.create({
    trigger: stage,
    start: "top top",
    end: () => "+=" + (N - 1) * window.innerHeight * 1.2,
    pin: true,
    invalidateOnRefresh: true,
    snap: { snapTo: 1 / (N - 1), duration: { min: .3, max: .7 }, delay: .1, ease: "sine.inOut", inertia: false },
    onUpdate: self => {
      const i = Math.round(self.progress * (N - 1));
      if (i !== idx) goTo(i);
    }
  });

  ScrollTrigger.addEventListener("refreshInit", layout);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
  layout();
  entries.forEach((e, j) => e.parts.forEach(el => el.setAttribute("aria-hidden", j === 0 ? "false" : "true")));
  vis(entries[0], "visible");
  gsap.set(entries.slice(1).flatMap(e => e.parts), { opacity: 0 });
});
