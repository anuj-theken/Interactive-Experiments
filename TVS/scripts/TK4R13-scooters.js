// scripts/TK4R13-scooters.js — TK4R13 · Scooters and motorcycles of the 1990s (story V6.1)
// One sticky stage. A procedural 3D bike (Three.js, toon-shaded with ink edges so it reads as print)
// stands on a horizontal timeline spine. Scroll progress → a continuous position t along the entries
// (with a dwell on each). t drives everything: the track slides left, the bike turns 360° per entry,
// swaps between scooter and motorcycle at the half-turn, and the entry cards fade in beside it.
// Entry content lives in the HTML (.TK4R13-item); data-type / data-maker on each item drive the model.

document.addEventListener("DOMContentLoaded", function () {
  const wrapper = document.getElementById("TK4R13-wrapper");
  const stage = document.getElementById("TK4R13-stage");
  if (!wrapper || !stage) return;

  gsap.registerPlugin(ScrollTrigger);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const canvas = document.getElementById("TK4R13-canvas");
  const track = document.getElementById("TK4R13-track");
  const masthead = stage.querySelector(".TK4R13-masthead");
  const counterEl = document.getElementById("TK4R13-counter-now");
  const items = [...track.querySelectorAll(".TK4R13-item")];
  const cards = items.map(it => it.querySelector(".TK4R13-card"));
  const bodies = items.map(it => it.querySelector(".TK4R13-body"));
  const N = items.length;
  // data-color / data-seat: the bike's own paint and seat, matched by eye to its photo
  // data-model picks the 3D body (scooter / motorcycle / underbone); it defaults to data-type
  const ENTRIES = items.map(it => ({ type: it.dataset.type, model: it.dataset.model || it.dataset.type, maker: it.dataset.maker, color: it.dataset.color, seat: it.dataset.seat }));

  /* ---------------- 1. Tokens — read from the stage so a theme island is respected ---------------- */
  const css = getComputedStyle(stage);
  const tok = name => css.getPropertyValue(name).trim();
  const COL = {
    tvs:   tok("--cat-2"),          // Crimson — TVS
    jv:    tok("--cat-1"),          // Royal — the TVS-Suzuki joint venture
    rival: tok("--color-grey"),     // Grey — everyone else
    ink:   tok("--color-text"),     // Deep Navy — seats, frames, ink edges
    metal: tok("--color-grey"),
    tyre:  tok("--color-black"),
    lamp:  tok("--color-cream"),
    tail:  tok("--color-mustard")
  };

  /* ---------------- 2. Scroll length ---------------- */
  const ENTRY_VH = 95;
  wrapper.style.height = `calc(${N * ENTRY_VH}vh + 100vh)`;
  document.getElementById("TK4R13-counter-total").textContent = String(N).padStart(2, "0");

  /* ---------------- 3. Layout (px) → CSS variables + 3D framing ---------------- */
  const L = { W: 0, H: 0, anchorX: 0, spineY: 0, S: 0, bikeW: 0, stacked: false };

  function layout() {
    const W = stage.clientWidth, H = stage.clientHeight;
    const stacked = W <= 768 || W / H < 0.9;
    stage.classList.toggle("is-stacked", stacked);
    const mast = masthead.getBoundingClientRect(), st = stage.getBoundingClientRect();
    const mastBottom = mast.bottom - st.top;
    let anchorX, spineY, S, cardW, cardDx, bikeW, cardTop = null, cardBottom = null, availH;

    if (!stacked) {
      anchorX = W * 0.29;
      cardW = Math.min(520, W * 0.38);
      cardDx = W * 0.56 - anchorX;
      S = W * 0.62;
      spineY = Math.min(H * 0.8, H - 96);
      cardBottom = H - spineY + 40;
      // the card column clears the counter (top right), not the title (top left)
      const counter = stage.querySelector(".TK4R13-counter").getBoundingClientRect();
      availH = spineY - 40 - (counter.bottom - st.top + 20);
      bikeW = Math.min(W * 0.34, (spineY - mastBottom - 24) * 1.35, 560);
    } else {
      anchorX = W / 2;
      S = W;
      cardW = Math.min(W - 32, 520);
      cardDx = -cardW / 2;
      const zone = Math.max(150, Math.min(H * 0.3, 320));
      spineY = mastBottom + zone;
      cardTop = spineY + 60;
      availH = H - cardTop - 16;
      bikeW = Math.min(W * 0.62, zone * 1.35);
    }

    stage.style.setProperty("--TK4R13-spine-y", spineY + "px");
    stage.style.setProperty("--TK4R13-anchor-x", anchorX + "px");
    stage.style.setProperty("--TK4R13-card-w", cardW + "px");
    stage.style.setProperty("--TK4R13-card-dx", cardDx + "px");
    stage.style.setProperty("--TK4R13-card-top", cardTop === null ? "auto" : cardTop + "px");
    stage.style.setProperty("--TK4R13-card-bottom", cardBottom === null ? "auto" : cardBottom + "px");
    // photo takes whatever height the longest caption leaves over
    const bodyH = Math.max(...bodies.map(b => b.offsetHeight));
    const photoH = Math.max(80, Math.min(cardW / 1.5, availH - bodyH));
    stage.style.setProperty("--TK4R13-photo-h", photoH + "px");
    items.forEach((it, i) => { it.style.left = i * S + "px"; });

    Object.assign(L, { W, H, anchorX, spineY, S, bikeW, stacked });
    if (three) three.frame();
    draw(true);
  }

  /* ---------------- 4. The 3D bike ---------------- */
  let three = null;
  try {
    if (typeof THREE !== "undefined" && canvas) three = buildThree();
  } catch (e) { three = null; }
  if (!three) stage.classList.add("is-no3d");

  function buildThree() {
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x8899aa, 0.55));
    const sun = new THREE.DirectionalLight(0xffffff, 0.75);
    sun.position.set(2.5, 4, 3.5);
    scene.add(sun);

    // four-step toon ramp: flat, poster-like shading
    const ramp = new THREE.DataTexture(new Uint8Array([96, 160, 215, 255]), 4, 1, THREE.LuminanceFormat);
    ramp.minFilter = ramp.magFilter = THREE.NearestFilter;
    ramp.generateMipmaps = false;
    ramp.needsUpdate = true;
    const toon = hex => new THREE.MeshToonMaterial({ color: new THREE.Color(hex), gradientMap: ramp });
    const bodyMat = toon(COL.tvs);           // shared by all models, recoloured per entry
    const seatMat = toon(COL.ink);
    const M = {
      body: bodyMat,
      ink: toon(COL.ink),
      metal: toon(COL.metal),
      tyre: toon(COL.tyre),
      lamp: new THREE.MeshBasicMaterial({ color: new THREE.Color(COL.lamp) }),
      tail: toon(COL.tail),
      edge: new THREE.LineBasicMaterial({ color: new THREE.Color(COL.ink), transparent: true, opacity: 0.85 })
    };

    /* helpers */
    const V = (x, y, z = 0) => new THREE.Vector3(x, y, z);
    const UP = V(0, 1, 0);
    function add(group, geo, mat, ink = true) {
      const m = new THREE.Mesh(geo, mat);
      group.add(m);
      if (ink) m.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo, 32), M.edge));
      return m;
    }
    function shape(pts) {
      const s = new THREE.Shape();
      s.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) {
        const p = pts[i];
        if (p.length === 4) s.quadraticCurveTo(p[0], p[1], p[2], p[3]);
        else s.lineTo(p[0], p[1]);
      }
      s.closePath();
      return s;
    }
    // smooth shading across bevels and curves, hard edges kept where faces meet at > angle
    function creaseNormals(geo, angleDeg) {
      if (geo.index) geo = geo.toNonIndexed();
      const pos = geo.attributes.position, n = pos.count, cos = Math.cos((angleDeg * Math.PI) / 180);
      const fN = new Float32Array(n * 3);
      const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
      for (let i = 0; i < n; i += 3) {
        a.fromBufferAttribute(pos, i); b.fromBufferAttribute(pos, i + 1); c.fromBufferAttribute(pos, i + 2);
        c.sub(b); a.sub(b); c.cross(a).normalize();
        for (let k = 0; k < 3; k++) { fN[(i + k) * 3] = c.x; fN[(i + k) * 3 + 1] = c.y; fN[(i + k) * 3 + 2] = c.z; }
      }
      const key = i => Math.round(pos.getX(i) * 1e4) + "," + Math.round(pos.getY(i) * 1e4) + "," + Math.round(pos.getZ(i) * 1e4);
      const groups = new Map();
      for (let i = 0; i < n; i++) { const k = key(i); if (!groups.has(k)) groups.set(k, []); groups.get(k).push(i); }
      const out = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        let x = 0, y = 0, z = 0;
        for (const j of groups.get(key(i))) {
          const d = fN[i * 3] * fN[j * 3] + fN[i * 3 + 1] * fN[j * 3 + 1] + fN[i * 3 + 2] * fN[j * 3 + 2];
          if (d >= cos) { x += fN[j * 3]; y += fN[j * 3 + 1]; z += fN[j * 3 + 2]; }
        }
        const l = Math.hypot(x, y, z) || 1;
        out[i * 3] = x / l; out[i * 3 + 1] = y / l; out[i * 3 + 2] = z / l;
      }
      geo.setAttribute("normal", new THREE.BufferAttribute(out, 3));
      return geo;
    }
    function extrude(s, depth, bevel) {
      const g = new THREE.ExtrudeGeometry(s, {
        depth, curveSegments: 36, bevelEnabled: true,
        bevelThickness: bevel * 1.4, bevelSize: bevel * 1.1, bevelSegments: 6
      });
      g.translate(0, 0, -depth / 2);
      return creaseNormals(g, 50);
    }
    function rrect(w, h, r) {
      const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
      r = Math.min(r, w / 2, h / 2);
      s.moveTo(x + r, y);
      s.lineTo(x + w - r, y); s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
      s.lineTo(x + w, y + h - r); s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
      s.lineTo(x + r, y + h); s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
      s.lineTo(x, y + r); s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
      return s;
    }
    function arcShape(cx, cy, r0, r1, a0, a1) {
      const s = new THREE.Shape();
      s.absarc(cx, cy, r1, a0, a1, false);
      s.absarc(cx, cy, r0, a1, a0, true);
      s.closePath();
      return s;
    }
    function rod(group, a, b, r, mat, ink = false) {
      const len = a.distanceTo(b);
      const m = add(group, new THREE.CylinderGeometry(r, r, len, 18), mat, ink);
      m.position.copy(a).add(b).multiplyScalar(0.5);
      m.quaternion.setFromUnitVectors(UP, b.clone().sub(a).normalize());
      return m;
    }
    function zCyl(group, r, len, mat, x, y, z = 0, ink = true) {
      const m = add(group, new THREE.CylinderGeometry(r, r, len, 40), mat, ink);
      m.rotation.x = Math.PI / 2;
      m.position.set(x, y, z);
      return m;
    }
    function xCyl(group, r, len, mat, x, y, z = 0, ink = true) {
      const m = add(group, new THREE.CylinderGeometry(r, r, len, 40), mat, ink);
      m.rotation.z = Math.PI / 2;
      m.position.set(x, y, z);
      return m;
    }
    // rounded box: a rounded rectangle extruded with a soft bevel
    function box(group, w, h, d, mat, x, y, z = 0, ink = true) {
      const bev = Math.min(w, h, d) * 0.16;
      const m = add(group, extrude(rrect(w - 2 * bev, h - 2 * bev, Math.min(w, h) * 0.18), Math.max(0.002, d - 2 * bev * 1.4), bev), mat, ink);
      m.position.set(x, y, z);
      return m;
    }
    function tube(group, pts, r, mat) {
      const curve = new THREE.CatmullRomCurve3(pts.map(p => V(p[0], p[1], p[2] || 0)));
      return add(group, new THREE.TubeGeometry(curve, 96, r, 16, false), mat, false);
    }
    function wheel(Ro, tubeR, spoked) {
      const w = new THREE.Group();
      add(w, new THREE.TorusGeometry(Ro - tubeR, tubeR, 20, 72), M.tyre, false);
      const rimR = Ro - tubeR * 1.9;
      add(w, new THREE.TorusGeometry(rimR, 0.012, 8, 72), M.metal, false);
      zCyl(w, 0.05, 0.13, M.metal, 0, 0, 0, false);
      zCyl(w, 0.09, 0.07, M.metal, 0, 0, 0.02);
      if (spoked) {
        for (let i = 0; i < 16; i++) {
          const a = (i / 16) * Math.PI * 2, z = i % 2 ? 0.035 : -0.035;
          rod(w, V(Math.cos(a) * 0.05, Math.sin(a) * 0.05, z), V(Math.cos(a + 0.5) * rimR, Math.sin(a + 0.5) * rimR, 0), 0.004, M.metal);
        }
      } else {
        zCyl(w, rimR, 0.035, M.metal, 0, 0, 0);
        for (let i = 0; i < 5; i++) {
          const a = (i / 5) * Math.PI * 2;
          const hole = zCyl(w, 0.035, 0.04, M.ink, Math.cos(a) * rimR * 0.58, Math.sin(a) * rimR * 0.58, 0, false);
          hole.scale.set(1, 1, 1);
        }
      }
      return w;
    }
    function shadow(len, wid) {
      const c = document.createElement("canvas");
      c.width = c.height = 128;
      const g = c.getContext("2d");
      const grad = g.createRadialGradient(64, 64, 4, 64, 64, 64);
      grad.addColorStop(0, "rgba(2,48,72,0.42)");
      grad.addColorStop(1, "rgba(2,48,72,0)");
      g.fillStyle = grad;
      g.fillRect(0, 0, 128, 128);
      const m = new THREE.Mesh(new THREE.PlaneGeometry(len, wid),
        new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }));
      m.rotation.x = -Math.PI / 2;
      m.position.y = 0.003;
      return m;
    }
    const D = Math.PI / 180;

    /* ── Scooter: low step-through, small wheels, rear cowl over the engine ── */
    function buildScooter() {
      const g = new THREE.Group(), wheels = [];
      const Ro = 0.3, FX = 0.62, RX = -0.58;
      [FX, RX].forEach(x => { const w = wheel(Ro, 0.075, false); w.position.set(x, Ro, 0); g.add(w); wheels.push(w); });

      // rear cowl: wraps the rear wheel, carries the seat
      const cowl = new THREE.Shape();
      cowl.moveTo(-0.12, 0.24);
      cowl.lineTo(-0.12, 0.5);
      cowl.quadraticCurveTo(-0.13, 0.64, -0.26, 0.64);
      cowl.lineTo(-0.8, 0.66);
      cowl.quadraticCurveTo(-1.0, 0.66, -0.96, 0.46);
      cowl.absarc(RX, Ro, 0.36, 160 * D, 30 * D, true);
      cowl.lineTo(-0.2, 0.3);
      cowl.closePath();
      add(g, extrude(cowl, 0.34, 0.04), M.body);

      box(g, 0.56, 0.05, 0.3, M.ink, 0.13, 0.26);                                    // floorboard
      add(g, extrude(shape([[0.32, 0.24], [0.5, 0.24], [0.63, 0.5, 0.59, 0.97], [0.49, 0.99], [0.45, 0.56, 0.32, 0.24]]), 0.42, 0.035), M.body); // leg shield
      box(g, 0.03, 0.14, 0.16, M.ink, 0.6, 0.62);                                    // horn grille
      add(g, extrude(arcShape(FX, Ro, 0.33, 0.37, 15 * D, 165 * D), 0.14, 0.015), M.body); // front fender

      [-0.07, 0.07].forEach(z => rod(g, V(FX, Ro, z), V(0.545, 0.86, z), 0.02, M.metal));
      rod(g, V(0.54, 0.86), V(0.52, 1.04), 0.03, M.ink);
      add(g, extrude(shape([[0.4, 1.0], [0.62, 1.0], [0.66, 1.08], [0.44, 1.12]]), 0.26, 0.03), M.body); // handlebar cover
      xCyl(g, 0.055, 0.04, M.lamp, 0.675, 1.045, 0, false);                          // headlamp
      zCyl(g, 0.016, 0.62, M.metal, 0.5, 1.1, 0, false);                              // handlebar
      [-0.27, 0.27].forEach(z => {
        zCyl(g, 0.026, 0.11, M.ink, 0.5, 1.1, z);
        rod(g, V(0.5, 1.1, z * 0.75), V(0.48, 1.18, z * 0.9), 0.008, M.metal);
        const mirror = xCyl(g, 0.04, 0.015, M.ink, 0.48, 1.2, z * 0.9);
        mirror.rotation.y = 0.2;
      });

      add(g, extrude(shape([[-0.24, 0.65], [-0.84, 0.65], [-0.9, 0.66, -0.86, 0.72], [-0.3, 0.76], [-0.2, 0.76, -0.24, 0.65]]), 0.3, 0.035), seatMat); // seat
      box(g, 0.24, 0.02, 0.28, M.metal, -0.88, 0.73, 0, false);                      // rear rack
      [-0.12, 0.12].forEach(z => rod(g, V(-0.98, 0.73, z), V(-0.88, 0.62, z), 0.01, M.metal));
      box(g, 0.04, 0.06, 0.18, M.tail, -0.985, 0.56);                                 // tail lamp
      box(g, 0.32, 0.16, 0.14, M.ink, -0.42, 0.25, -0.05);                            // engine case
      xCyl(g, 0.055, 0.34, M.metal, -0.62, 0.2, 0.17);                                // muffler

      g.add(shadow(2.3, 0.9));
      return { group: g, wheels };
    }

    /* ── Motorcycle: commuter single, tank between the knees, spoked wheels, chrome exhaust ── */
    function buildMotorcycle() {
      const g = new THREE.Group(), wheels = [];
      const Ro = 0.38, FX = 0.8, RX = -0.7;
      [FX, RX].forEach(x => { const w = wheel(Ro, 0.055, true); w.position.set(x, Ro, 0); g.add(w); wheels.push(w); });

      tube(g, [[0.56, 0.98], [0.36, 0.62], [0.2, 0.34], [-0.12, 0.3], [-0.18, 0.52], [-0.42, 0.8], [-0.8, 0.82]], 0.028, M.ink); // frame
      tube(g, [[0.56, 0.98], [0.3, 0.9], [0.02, 0.84]], 0.024, M.ink);

      add(g, extrude(shape([[0.02, 0.82], [0.47, 0.88], [0.54, 1.0, 0.4, 1.04], [0.18, 1.09, 0.02, 0.98]]), 0.22, 0.06), M.body); // tank
      add(g, extrude(shape([[0.04, 0.86], [-0.64, 0.84], [-0.74, 0.85, -0.7, 0.91], [-0.12, 0.95], [0.03, 0.97, 0.04, 0.86]]), 0.24, 0.03), seatMat); // seat
      add(g, extrude(shape([[-0.06, 0.6], [-0.4, 0.64], [-0.42, 0.84], [-0.04, 0.84]]), 0.26, 0.02), M.body); // side panel
      add(g, extrude(shape([[-0.4, 0.8], [-0.92, 0.85], [-0.96, 0.79], [-0.42, 0.7]]), 0.2, 0.02), M.body);    // tail
      box(g, 0.04, 0.05, 0.14, M.tail, -0.97, 0.8);
      add(g, extrude(arcShape(RX, Ro, 0.43, 0.46, 40 * D, 150 * D), 0.14, 0.012), M.metal); // rear fender
      add(g, extrude(arcShape(FX, Ro, 0.42, 0.45, 30 * D, 150 * D), 0.12, 0.012), M.metal); // front fender

      // engine: crankcase, finned barrel
      zCyl(g, 0.14, 0.26, M.metal, 0.02, 0.36);
      const barrel = new THREE.Group();
      box(barrel, 0.17, 0.24, 0.17, M.metal, 0, 0);
      for (let i = 0; i < 5; i++) box(barrel, 0.24, 0.014, 0.22, M.metal, 0, -0.09 + i * 0.045, 0, false);
      barrel.position.set(0.16, 0.54, 0);
      barrel.rotation.z = -0.35;
      g.add(barrel);

      tube(g, [[0.22, 0.46, 0.1], [0.2, 0.28, 0.14], [0.0, 0.2, 0.16], [-0.4, 0.24, 0.17], [-0.62, 0.31, 0.17]], 0.032, M.metal); // exhaust
      rod(g, V(-0.5, 0.27, 0.17), V(-0.9, 0.42, 0.17), 0.055, M.metal, true);       // silencer

      [-0.09, 0.09].forEach(z => rod(g, V(-0.1, 0.36, z), V(RX, Ro, z), 0.022, M.ink));        // swingarm
      [-0.11, 0.11].forEach(z => rod(g, V(-0.62, 0.42, z), V(-0.46, 0.82, z), 0.024, M.metal)); // shocks
      [-0.08, 0.08].forEach(z => rod(g, V(FX, Ro, z), V(0.58, 1.02, z), 0.024, M.metal));       // fork
      box(g, 0.08, 0.04, 0.24, M.ink, 0.585, 1.0);

      xCyl(g, 0.085, 0.09, M.ink, 0.68, 0.98);                                        // headlamp shell
      xCyl(g, 0.07, 0.012, M.lamp, 0.728, 0.98, 0, false);                            // lens
      zCyl(g, 0.016, 0.68, M.metal, 0.54, 1.12, 0, false);                            // handlebar
      [-0.3, 0.3].forEach(z => {
        zCyl(g, 0.026, 0.11, M.ink, 0.54, 1.12, z);
        rod(g, V(0.54, 1.12, z * 0.7), V(0.52, 1.2, z * 0.85), 0.008, M.metal);
        const mirror = xCyl(g, 0.04, 0.015, M.ink, 0.52, 1.22, z * 0.85);
        mirror.rotation.y = 0.2;
      });
      [-0.08, 0.08].forEach(z => rod(g, V(0.58, 1.02, z), V(0.55, 1.12, z * 1.2), 0.014, M.metal));
      [-0.18, 0.18].forEach(z => zCyl(g, 0.016, 0.12, M.ink, -0.1, 0.36, z, false)); // footpegs

      g.add(shadow(2.5, 0.9));
      return { group: g, wheels };
    }

    /* ── Underbone (Suzuki Shogun): motorcycle wheels and engine, but a step-through frame,
          a scooter-like front fairing and leg shield, and no fuel tank between the knees ── */
    function buildUnderbone() {
      const g = new THREE.Group(), wheels = [];
      const Ro = 0.34, FX = 0.74, RX = -0.66;
      [FX, RX].forEach(x => { const w = wheel(Ro, 0.05, true); w.position.set(x, Ro, 0); g.add(w); wheels.push(w); });

      tube(g, [[0.55, 0.98], [0.42, 0.62], [0.2, 0.42], [-0.08, 0.46], [-0.26, 0.64], [-0.8, 0.78]], 0.026, M.ink); // underbone spine
      add(g, extrude(shape([[0.34, 0.4], [0.46, 0.37], [0.64, 0.6, 0.61, 0.98], [0.5, 1.02], [0.42, 0.7, 0.3, 0.5]]), 0.36, 0.03), M.body); // front fairing / leg shield
      add(g, extrude(shape([[0.42, 0.96], [0.66, 0.94], [0.72, 1.04, 0.66, 1.08], [0.46, 1.12]]), 0.28, 0.03), M.body); // headlamp cowl
      xCyl(g, 0.06, 0.03, M.lamp, 0.715, 1.02, 0, false);                              // headlamp lens
      add(g, extrude(shape([[0.32, 0.46], [0.08, 0.38], [-0.2, 0.5], [-0.2, 0.62], [0.06, 0.52, 0.32, 0.58]]), 0.18, 0.025), M.body); // centre tunnel cover
      add(g, extrude(shape([[-0.18, 0.5], [-0.16, 0.8], [-0.9, 0.86], [-0.99, 0.84, -0.95, 0.76], [-0.62, 0.7], [-0.4, 0.56]]), 0.3, 0.035), M.body); // body under the seat
      add(g, extrude(shape([[-0.1, 0.8], [-0.86, 0.86], [-0.94, 0.88, -0.88, 0.93], [-0.2, 0.92], [-0.08, 0.92, -0.1, 0.8]]), 0.26, 0.03), seatMat); // seat
      box(g, 0.04, 0.05, 0.16, M.tail, -0.96, 0.81);
      [-0.13, 0.13].forEach(z => tube(g, [[-0.5, 0.92, z], [-0.85, 0.93, z * 0.9], [-0.9, 0.9, z * 0.6]], 0.01, M.metal)); // grab rail
      add(g, extrude(arcShape(FX, Ro, 0.39, 0.42, 30 * D, 150 * D), 0.12, 0.012), M.body);  // front fender
      add(g, extrude(arcShape(RX, Ro, 0.39, 0.42, 60 * D, 120 * D), 0.12, 0.012), M.ink);   // rear hugger

      // horizontal engine slung under the step-through gap
      zCyl(g, 0.12, 0.24, M.metal, -0.02, 0.32);
      const barrel = new THREE.Group();
      box(barrel, 0.15, 0.2, 0.15, M.metal, 0, 0);
      for (let i = 0; i < 4; i++) box(barrel, 0.2, 0.012, 0.19, M.metal, 0, -0.07 + i * 0.045, 0, false);
      barrel.position.set(0.15, 0.32, 0);
      barrel.rotation.z = -1.35;
      g.add(barrel);
      tube(g, [[0.24, 0.3, 0.08], [0.1, 0.18, 0.14], [-0.3, 0.2, 0.16], [-0.5, 0.26, 0.16]], 0.028, M.metal); // exhaust
      rod(g, V(-0.42, 0.24, 0.16), V(-0.82, 0.38, 0.16), 0.05, M.metal, true);       // silencer

      [-0.09, 0.09].forEach(z => rod(g, V(-0.1, 0.34, z), V(RX, Ro, z), 0.02, M.ink));          // swingarm
      [-0.11, 0.11].forEach(z => rod(g, V(-0.6, 0.38, z), V(-0.5, 0.76, z), 0.022, M.metal));   // shocks
      [-0.07, 0.07].forEach(z => rod(g, V(FX, Ro, z), V(0.57, 0.96, z), 0.022, M.metal));       // fork
      zCyl(g, 0.016, 0.62, M.metal, 0.52, 1.1, 0, false);                              // handlebar
      [-0.27, 0.27].forEach(z => {
        zCyl(g, 0.026, 0.11, M.ink, 0.52, 1.1, z);
        rod(g, V(0.52, 1.1, z * 0.75), V(0.5, 1.18, z * 0.9), 0.008, M.metal);
        const mirror = xCyl(g, 0.04, 0.015, M.ink, 0.5, 1.2, z * 0.9);
        mirror.rotation.y = 0.2;
      });
      [-0.17, 0.17].forEach(z => zCyl(g, 0.016, 0.1, M.ink, -0.08, 0.3, z, false));  // footpegs

      g.add(shadow(2.4, 0.9));
      return { group: g, wheels };
    }

    const pivot = new THREE.Group();          // yaw happens here
    scene.add(pivot);
    const models = { scooter: buildScooter(), motorcycle: buildMotorcycle(), underbone: buildUnderbone() };
    Object.values(models).forEach(m => pivot.add(m.group));

    // place the ground point (0,0,0) at the anchor on the spine, at the size layout() asked for
    function frame() {
      renderer.setSize(L.W, L.H, false);
      camera.aspect = L.W / L.H;
      const LEN = 2.1;                                     // world units the bike should span
      const d = (LEN * L.H) / (L.bikeW * 2 * Math.tan((camera.fov * D) / 2));
      camera.position.set(0, 0.5 + d * 0.17, d);
      camera.lookAt(0, 0.5, 0);
      camera.updateMatrixWorld();
      camera.updateProjectionMatrix();
      const o = V(0, 0, 0).project(camera);
      const tx = (L.anchorX / L.W) * 2 - 1, ty = 1 - (L.spineY / L.H) * 2;
      camera.projectionMatrix.elements[8] -= tx - o.x;
      camera.projectionMatrix.elements[9] -= ty - o.y;
      camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
    }

    // each entry's paint; falls back to its maker colour if none is set
    const MAKER = { tvs: new THREE.Color(COL.tvs), "tvs-suzuki": new THREE.Color(COL.jv), rival: new THREE.Color(COL.rival) };
    const cSeat = new THREE.Color(COL.ink);
    const PAINT = ENTRIES.map(e => e.color ? new THREE.Color(e.color) : (MAKER[e.maker] || MAKER.rival));
    const SEAT = ENTRIES.map(e => e.seat ? new THREE.Color(e.seat) : cSeat);
    const smooth = x => { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };

    function pose(t, time) {
      const i = Math.min(N - 1, Math.floor(t)), g = t - i;
      const a = ENTRIES[i], b = ENTRIES[Math.min(N - 1, i + 1)];
      // model: shrink the outgoing one away from the half-turn, grow the incoming one back
      let showType = a.model, s = 1;
      if (a.model !== b.model) {
        if (g < 0.5) s = 1 - smooth((g - 0.3) / 0.2);
        else { showType = b.model; s = smooth((g - 0.5) / 0.2); }
      }
      Object.entries(models).forEach(([type, m]) => {
        m.group.visible = type === showType && s > 0.001;
        m.group.scale.setScalar(Math.max(0.001, s));
      });
      const j = Math.min(N - 1, i + 1), mix = smooth((g - 0.4) / 0.2);
      bodyMat.color.lerpColors(PAINT[i], PAINT[j], mix);
      seatMat.color.lerpColors(SEAT[i], SEAT[j], mix);

      const sway = reduce ? 0 : Math.sin(time * 0.0009) * 0.05;
      pivot.rotation.y = -0.62 + t * Math.PI * 2 + sway;
      pivot.position.y = reduce ? 0 : Math.sin(time * 0.0021) * 0.006;
      const spin = -t * Math.PI * 2 * 1.4;
      Object.values(models).forEach(m => m.wheels.forEach(w => { w.rotation.z = spin; }));
      renderer.render(scene, camera);
    }

    return { frame, pose };
  }

  /* ---------------- 5. Draw a frame at position t ---------------- */
  let t = 0, targetT = 0, lastT = -1, active = -1;
  function draw(force) {
    if (!force && Math.abs(t - lastT) < 1e-4 && reduce) return;
    lastT = t;
    track.style.transform = `translate3d(${(L.anchorX - t * L.S).toFixed(2)}px,0,0)`;
    cards.forEach((c, i) => {
      const d = i - t;
      const op = Math.max(0, 1 - Math.abs(d) * (d < 0 ? 3 : 1.6));   // leaving cards clear the bike fast
      c.style.opacity = op.toFixed(3);
      c.style.visibility = op > 0 ? "visible" : "hidden";
      c.style.transform = `translate3d(${(d * 60).toFixed(1)}px,${(Math.abs(d) * 18).toFixed(1)}px,0)`;
    });
    const now = Math.round(t);
    if (now !== active) {
      active = now;
      items.forEach((it, i) => {
        it.classList.toggle("is-active", i === now);
        it.classList.toggle("is-past", i < now);
      });
      counterEl.textContent = String(now + 1).padStart(2, "0");
    }
    stage.classList.toggle("is-moving", t > 0.04);
    if (three) three.pose(t, performance.now());
  }

  /* ---------------- 6. Scroll → t, with a dwell on each entry ---------------- */
  const ease = x => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  function progressToT(p) {
    const x = Math.min(N - 1e-4, Math.max(0, p * N));
    const i = Math.floor(x), f = x - i;
    if (i >= N - 1) return N - 1;
    return i + ease(Math.min(1, Math.max(0, (f - 0.4) / 0.6)));
  }
  // refreshPriority -1: measured after the pinned sections above have added their pin spacing
  ScrollTrigger.create({
    trigger: wrapper,
    start: "top top",
    end: "bottom bottom",
    refreshPriority: -1,
    onUpdate: self => {
      targetT = progressToT(self.progress);
      if (reduce) { t = targetT; draw(); }
      else kick();
    }
  });

  /* ---------------- 7. Render loop — only while the stage is on screen ---------------- */
  let onScreen = false, raf = 0;
  function tick(time) {
    raf = 0;
    if (!onScreen) return;
    t += (targetT - t) * 0.14;
    if (Math.abs(targetT - t) < 0.0005) t = targetT;
    draw(true);
    // keep idling for the sway even when scroll is still
    if (!reduce) raf = requestAnimationFrame(tick);
  }
  function kick() { if (!raf && onScreen) raf = requestAnimationFrame(tick); }
  new IntersectionObserver(entries => {
    onScreen = entries[0].isIntersecting;
    if (onScreen) kick();
  }, { rootMargin: "100px 0px" }).observe(wrapper);

  let resizeTimer = 0;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layout, 120);
  });
  // re-measure once fonts land (caption heights change the photo size)
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
  layout();
});
