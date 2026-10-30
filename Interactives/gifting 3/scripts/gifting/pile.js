// The footer's gift pile: flat wrapped boxes with real 2D physics (Matter.js, vendored in scripts/vendor/).
// They drop in when the footer comes into view, land differently every time, get bounced when you come back,
// shove aside when the pointer sweeps through, and can be dragged and thrown. A plain click calls onClick.
// They live in bins beside the footer's centre column (invisible walls), so they never cover its text or logo.
const MATTER_URL = new URL('../vendor/matter.min.js', import.meta.url).href;
let loading = null;
function loadMatter() {
  if (window.Matter) return Promise.resolve(window.Matter);
  return loading || (loading = new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = MATTER_URL; s.onload = () => res(window.Matter); s.onerror = rej;
    document.head.appendChild(s);
  }));
}

const INK = '#1A1208';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const isDark = (h) => { const [r, g, b] = [1, 3, 5].map((k) => parseInt(h.slice(k, k + 2), 16)); return 0.299 * r + 0.587 * g + 0.114 * b < 150; };

// one flat box: the paper, a ribbon cross, a bow on top
function boxSVG(w, h, col, round) {
  const rib = isDark(col) ? '#F7F2F2' : '#C8423A', rw = Math.max(5, Math.min(w, h) * .16), cx = w / 2, by = h * (w > h * 1.3 ? .5 : .38), bw = Math.min(w * .32, 22);
  return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true">
    <rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="${round ? Math.min(w, h) * .3 : 3}" fill="${col}" stroke="${INK}" stroke-width="2"/>
    <rect x="${cx - rw / 2}" y="1" width="${rw}" height="${h - 2}" fill="${rib}" stroke="${INK}" stroke-width="1.3"/>
    <rect x="1" y="${by - rw / 2}" width="${w - 2}" height="${rw}" fill="${rib}" stroke="${INK}" stroke-width="1.3"/>
    <path d="M${cx},1 c${-bw},${-bw * .9} ${-bw * 1.2},${bw * .2} 0,0 z M${cx},1 c${bw},${-bw * .9} ${bw * 1.2},${bw * .2} 0,0 z" fill="${rib}" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>
    <circle cx="${cx}" cy="1" r="${Math.max(2.5, bw * .18)}" fill="${rib}" stroke="${INK}" stroke-width="1.3"/></svg>`;
}

let current = null;
export function destroyPile() { if (current) current.destroy(); current = null; }

// boxes: [{ w, h, col, round, title }]; zones: [[x0, x1], ...] in the host's coordinates
export async function mountPile(host, { zones, boxes, onClick }) {
  destroyPile();
  host.innerHTML = '';
  if (!zones.length || !boxes.length) return;
  const M = await loadMatter();
  const { Engine, Bodies, Body, Composite, Constraint, Sleeping } = M;
  const W = host.clientWidth, H = host.clientHeight, T = 80;
  const engine = Engine.create({ gravity: { x: 0, y: 1.15 }, enableSleeping: true });
  const statics = [Bodies.rectangle(W / 2, H + T / 2, W + 400, T, { isStatic: true, friction: .9 })];
  zones.forEach(([x0, x1]) => {
    statics.push(Bodies.rectangle(x0 - T / 2, H - H * 1.5, T, H * 3, { isStatic: true }));
    statics.push(Bodies.rectangle(x1 + T / 2, H - H * 1.5, T, H * 3, { isStatic: true }));
  });
  Composite.add(engine.world, statics);

  const items = boxes.map((b, i) => {
    const el = document.createElement('div');
    el.className = 'pbox'; el.style.width = b.w + 'px'; el.style.height = b.h + 'px';
    if (b.title) { el.title = b.title; el.setAttribute('aria-label', b.title); }
    el.innerHTML = boxSVG(b.w, b.h, b.col, b.round);
    el.style.transform = 'translate(-999px,-999px)';
    host.appendChild(el);
    return { el, spec: b, zone: zones[i % zones.length], body: null };
  });

  let dropped = false, visible = false, raf = 0, last = 0, prev = null, grab = null;
  const rand = (a, b) => a + Math.random() * (b - a);
  function drop() {
    dropped = true;
    items.forEach((it, i) => {
      const [x0, x1] = it.zone, w = it.spec.w, h = it.spec.h;
      const x = rand(x0 + w / 2 + 2, Math.max(x0 + w / 2 + 3, x1 - w / 2 - 2));
      it.body = Bodies.rectangle(x, -rand(40, 260) - i * 26, w, h, {
        angle: rand(-.6, .6), restitution: rand(.15, .4), friction: .55, frictionAir: .012, density: .0012,
        chamfer: { radius: it.spec.round ? Math.min(w, h) * .3 : 3 }
      });
      Body.setAngularVelocity(it.body, rand(-.08, .08));
      Composite.add(engine.world, it.body);
    });
  }
  // coming back: every box gets its own random kick, so no two returns look the same
  function kick() {
    items.forEach((it) => {
      if (!it.body) return;
      Sleeping.set(it.body, false);
      Body.setVelocity(it.body, { x: rand(-3.5, 3.5), y: -rand(5, 12) });
      Body.setAngularVelocity(it.body, rand(-.25, .25));
    });
  }
  function frame(t) {
    raf = 0;
    const dt = Math.min(32, last ? t - last : 16.7); last = t;
    Engine.update(engine, dt);
    let awake = false;
    items.forEach((it) => {
      const b = it.body; if (!b) return;
      if (!b.isSleeping) awake = true;
      it.el.style.transform = `translate(${(b.position.x - it.spec.w / 2).toFixed(1)}px,${(b.position.y - it.spec.h / 2).toFixed(1)}px) rotate(${b.angle.toFixed(3)}rad)`;
    });
    if (visible || awake || grab) raf = requestAnimationFrame(frame); else last = 0;
  }
  const run = () => { if (!raf) raf = requestAnimationFrame(frame); };

  const io = new IntersectionObserver((es) => es.forEach((e) => {
    visible = e.isIntersecting;
    if (!visible) return;
    if (!dropped) drop(); else kick();
    run();
  }), { threshold: .35 });
  io.observe(host);

  // the pointer sweeping through shoves boxes the way it's moving
  const at = (e) => { const r = host.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  function onMove(e) {
    const p = at(e);
    if (grab) { grab.c.pointA = p; grab.moved += Math.abs(e.movementX || 0) + Math.abs(e.movementY || 0); run(); return; }
    if (e.pointerType !== 'mouse' || p.y < -40 || p.y > H + 20 || p.x < -20 || p.x > W + 20) { prev = null; return; }
    if (prev) {
      const dx = p.x - prev.x, dy = p.y - prev.y;
      items.forEach((it) => {
        const b = it.body; if (!b) return;
        const ddx = b.position.x - p.x, ddy = b.position.y - p.y, reach = Math.max(it.spec.w, it.spec.h) * .6 + 18;
        if (ddx * ddx + ddy * ddy > reach * reach) return;
        Sleeping.set(b, false);
        Body.applyForce(b, p, { x: dx * .00042 * b.mass, y: (dy * .00042 - .0016) * b.mass });
      });
      run();
    }
    prev = p;
  }
  // drag and throw; a click without moving is a click
  function onDown(e) {
    const it = items.find((x) => x.el === e.currentTarget); if (!it || !it.body) return;
    e.preventDefault();
    const p = at(e);
    Sleeping.set(it.body, false);
    const c = Constraint.create({ pointA: p, bodyB: it.body, pointB: { x: p.x - it.body.position.x, y: p.y - it.body.position.y }, stiffness: .12, damping: .08 });
    Composite.add(engine.world, c);
    grab = { c, it, moved: 0 };
    it.el.setPointerCapture && it.el.setPointerCapture(e.pointerId);
    it.el.classList.add('held');
    run();
  }
  function onUp() {
    if (!grab) return;
    Composite.remove(engine.world, grab.c);
    grab.it.el.classList.remove('held');
    if (grab.moved < 6 && onClick) onClick(grab.it.spec);
    grab = null;
  }
  items.forEach((it) => it.el.addEventListener('pointerdown', onDown));
  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('pointerup', onUp);
  window.addEventListener('pointercancel', onUp);

  current = {
    destroy() {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      Composite.clear(engine.world, false); Engine.clear(engine);
      host.innerHTML = '';
    }
  };
}
