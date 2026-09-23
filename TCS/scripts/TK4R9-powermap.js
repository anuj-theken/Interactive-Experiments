// scripts/TK4R9-powermap.js
// Power map — Tata Trusts / Tata Sons / TCS leadership, told as a five-step scrollytelling
// sequence (same sticky-chart + scrolling-cards pattern as TK4R6). Each step highlights a
// set of nodes (everything else fades back) and draws that step's arrows in once, in order.
// Requires scripts/TK4R9-powermap_data.js to be loaded first (TK4R9_NODES, TK4R9_STEPS, …).

// Portraits live next to the scripts folder (../imgs/people/powermap/), resolved from this
// script's own URL so the same file works under /TCS/… and relative (localLinked) paths.
const TK4R9_PHOTO_BASE = new URL("../imgs/people/powermap/", (document.currentScript && document.currentScript.src) || location.href).href;

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  const section = document.querySelector(".TK4R9-chart-section");
  if (!section) return;

  const svg = document.getElementById("TK4R9-map");
  const legendDom = document.getElementById("TK4R9-legend");
  const steps = Array.prototype.slice.call(section.querySelectorAll(".TK4R9-narrative-step"));
  if (!svg) return;

  const NS = "http://www.w3.org/2000/svg";
  const hasGsap = typeof gsap !== "undefined";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Draw timing: each slot of a step's arrows starts STAGGER ms after the previous one.
  const DRAW_MS = 650, STAGGER_MS = 420;

  // Token-driven color resolution — every mark paints with var(--token), so it always
  // tracks styles/globals.css and dark/light updates without touching this file.
  const STATUS_COLOR_VAR = {
    good: "var(--status-good)",
    critical: "var(--status-critical)",
    muted: "var(--color-muted)"
  };
  const STATUS = {};
  Object.keys(TK4R9_STATUS_META).forEach(function (key) {
    const meta = TK4R9_STATUS_META[key];
    STATUS[key] = { c: STATUS_COLOR_VAR[meta.token], label: meta.label, dashed: !!meta.dashed };
  });
  const TIER_COLOR = { 1: "var(--TK4R9-t1)", 2: "var(--TK4R9-t2)", 3: "var(--TK4R9-t3)" };
  const PIVOT_FILL = "var(--color-secondary)";
  const PHOTO_BASE = TK4R9_PHOTO_BASE;

  const byId = Object.fromEntries(TK4R9_NODES.map(function (n) { return [n.id, n]; }));
  function edgeKey(e) { return e.s + ">" + e.t; }

  // Two independent switches:
  //   layout — "wide": map pinned beside a lane of scrolling cards (≥1200px);
  //            "stack": map pinned on top, cards scroll up underneath it.
  //   mode   — which hand-tuned node positions to use: "desktop" (tiers as rows) or
  //            "mobile" (tiers stacked in one tall column, for phones / portrait tablets).
  const wideMq = window.matchMedia("(min-width: 1200px)");
  let layout = null, mode = null;
  function detectLayout() { return wideMq.matches ? "wide" : "stack"; }
  function detectMode() {
    const w = window.innerWidth, h = window.innerHeight;
    return (w < 768 || (!wideMq.matches && h > w)) ? "mobile" : "desktop";
  }
  function P(n) { return mode === "mobile" ? n.pos.m : n.pos.d; }

  // Font sizes derive from the --type-legend token (the design system's role for
  // diagram/chip-scale labels), scaled by the same ratios the original hand-tuned
  // sizes implied against a 14px base — never a bare magic-number px value.
  // NODE_K / TIER_K enlarge the SVG text per layout; OFF_K scales the matching
  // label offsets relative to the original hand-tuned geometry.
  const RATIO = {
    tierTab: 0.786, tierName: 0.857, hubMulti: 0.786, hubSingle: 0.929,
    avatarPivot: 1.214, avatarShort: 1.0, avatarLong: 0.786,
    namePivot: 1.036, nameNormal: 0.893, sub: 0.786, elabel: 0.75
  };
  const NODE_K = { desktop: 1.25, mobile: 1.75 };
  const TIER_K = { desktop: 1.15, mobile: 1.4 };
  const HUB_K = { desktop: 1.15, mobile: 1.1 };
  const BASE_K = { desktop: 1, mobile: 1.4 };
  function OFF_K() { return NODE_K[mode] / BASE_K[mode]; }
  function baseLegendPx() {
    const v = getComputedStyle(document.documentElement).getPropertyValue("--type-legend").trim();
    return parseFloat(v) || 14;
  }
  function fsz(ratio, k) {
    return +(baseLegendPx() * ratio * (k || NODE_K)[mode]).toFixed(1);
  }

  function el(tag, attrs, children) {
    const e = document.createElementNS(NS, tag);
    if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (children) children.forEach(function (c) { e.appendChild(c); });
    return e;
  }

  const defs = el("defs");
  [["succ", "TK4R9-mk-succ"], ["ctrl", "TK4R9-mk-ctrl"], ["asc", "TK4R9-mk-asc"], ["div", "TK4R9-mk-div"]].forEach(function (pair) {
    const id = pair[0], cls = pair[1];
    const m = el("marker", { id: "TK4R9-arw-" + id, class: "TK4R9-mk " + cls, viewBox: "0 0 10 10", refX: "8.5", refY: "5", markerWidth: "7", markerHeight: "7", orient: "auto-start-reverse" });
    m.appendChild(el("path", { d: "M0,0 L10,5 L0,10 z" }));
    defs.appendChild(m);
  });
  svg.appendChild(defs);

  const content = el("g", { id: "TK4R9-content" });
  svg.appendChild(content);

  function edgeGeom(e) {
    const a = P(byId[e.s]), b = P(byId[e.t]);
    const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
    const ux = dx / len, uy = dy / len, sr = a.r + 4, tr = b.r + 8;
    const sx = a.x + ux * sr, sy = a.y + uy * sr, ex = b.x - ux * tr, ey = b.y - uy * tr;
    const curv = e.curv ? (typeof e.curv === "object" ? (mode === "mobile" ? e.curv.m : e.curv.d) : e.curv) : 0;
    if (!curv) return { d: "M" + sx + "," + sy + " L" + ex + "," + ey, sx: sx, sy: sy, ex: ex, ey: ey, cx: (sx + ex) / 2, cy: (sy + ey) / 2, straight: true };
    const mx = (sx + ex) / 2, my = (sy + ey) / 2, nx = -uy, ny = ux, off = curv * len;
    const cx = mx + nx * off, cy = my + ny * off;
    // Re-seat both ends on the node rings in the direction of the control point, so a
    // strongly bent edge leaves/enters its node along the curve instead of cutting
    // through the node's own name label.
    const as = Math.hypot(cx - a.x, cy - a.y) || 1, bs = Math.hypot(cx - b.x, cy - b.y) || 1;
    const qsx = a.x + (cx - a.x) / as * sr, qsy = a.y + (cy - a.y) / as * sr;
    const qex = b.x + (cx - b.x) / bs * tr, qey = b.y + (cy - b.y) / bs * tr;
    return { d: "M" + qsx + "," + qsy + " Q" + cx + "," + cy + " " + qex + "," + qey, sx: qsx, sy: qsy, ex: qex, ey: qey, cx: cx, cy: cy, straight: false };
  }
  // The draw-on mask path runs a little past the edge's end along its final tangent, so
  // the arrowhead (which overhangs the path end) is fully revealed when the draw finishes.
  function maskPathD(g) {
    const tx = g.straight ? g.ex - g.sx : g.ex - g.cx, ty = g.straight ? g.ey - g.sy : g.ey - g.cy;
    const tl = Math.hypot(tx, ty) || 1;
    return g.d + " L" + (g.ex + tx / tl * 10) + "," + (g.ey + ty / tl * 10);
  }
  function pointAt(g, t) {
    if (g.straight) return [g.sx + (g.ex - g.sx) * t, g.sy + (g.ey - g.sy) * t];
    const mt = 1 - t;
    return [mt * mt * g.sx + 2 * mt * t * g.cx + t * t * g.ex, mt * mt * g.sy + 2 * mt * t * g.cy + t * t * g.ey];
  }
  function pad(b, p) { return { x: b.x - p, y: b.y - p, w: b.width + 2 * p, h: b.height + 2 * p }; }

  function makeNode(n) {
    const p = P(n), k = OFF_K();
    const g = el("g", { class: "TK4R9-node", "data-id": n.id });
    if (n.kind === "hub") {
      const side = p.r * 1.7;
      g.appendChild(el("rect", { x: p.x - side / 2, y: p.y - side / 2, width: side, height: side, rx: 11, fill: TIER_COLOR[n.tier], stroke: "var(--color-surface)", "stroke-width": "3" }));
      n.label.forEach(function (line, i) {
        const dy = (i - (n.label.length - 1) / 2) * 13 * Math.min(k, 1.15);
        const t = el("text", { class: "TK4R9-hub-txt", x: p.x, y: p.y + dy, "font-size": fsz(n.label.length > 1 ? RATIO.hubMulti : RATIO.hubSingle, HUB_K) });
        t.appendChild(document.createTextNode(line)); g.appendChild(t);
      });
    } else {
      const isPivot = n.kind === "pivot", ringC = STATUS[n.status].c;
      g.appendChild(el("circle", { cx: p.x, cy: p.y, r: p.r, fill: "none", stroke: ringC, "stroke-width": isPivot ? 5 : 3.2, "stroke-dasharray": STATUS[n.status].dashed ? "4 4" : "none" }));
      if (isPivot) g.appendChild(el("circle", { cx: p.x, cy: p.y, r: p.r + 4, fill: "none", stroke: ringC, "stroke-width": "1.4", opacity: ".35" }));
      g.appendChild(el("circle", { cx: p.x, cy: p.y, r: p.r - 3, fill: isPivot ? PIVOT_FILL : TIER_COLOR[n.tier] }));
      if (n.photo) {
        // Portrait clipped to a circle just inside the status ring
        const clipId = "TK4R9-clip-" + n.id;
        const clip = el("clipPath", { id: clipId });
        clip.appendChild(el("circle", { cx: p.x, cy: p.y, r: p.r - 3 }));
        g.appendChild(clip);
        const ir = p.r - 3;
        const img = el("image", { x: p.x - ir, y: p.y - ir, width: ir * 2, height: ir * 2, "clip-path": "url(#" + clipId + ")", preserveAspectRatio: "xMidYMid slice" });
        img.setAttribute("href", PHOTO_BASE + n.id + ".jpg");
        g.appendChild(img);
      } else {
        const avRatio = isPivot ? RATIO.avatarPivot : (n.initials.length > 2 ? RATIO.avatarLong : RATIO.avatarShort);
        const t = el("text", { class: "TK4R9-avatar-txt", x: p.x, y: p.y + 1, "font-size": fsz(avRatio, BASE_K) });
        t.appendChild(document.createTextNode(n.initials)); g.appendChild(t);
      }
      if (n.status === "red") {
        const bx = p.x + p.r * .72, by = p.y - p.r * .72;
        const bg = el("g", { class: "TK4R9-removed-badge" });
        bg.appendChild(el("circle", { cx: bx, cy: by, r: 8, stroke: "var(--color-surface)", "stroke-width": "2" }));
        bg.appendChild(el("path", { d: "M" + (bx - 3) + "," + (by - 3) + " L" + (bx + 3) + "," + (by + 3) + " M" + (bx + 3) + "," + (by - 3) + " L" + (bx - 3) + "," + (by + 3) }));
        g.appendChild(bg);
      }
      // desktop: name + tenure centred under the node; mobile: to the right, list-style
      const nameFs = fsz(isPivot ? RATIO.namePivot : RATIO.nameNormal), subFs = fsz(RATIO.sub);
      const side = mode === "mobile";
      const lx = side ? p.x + p.r + (isPivot ? 14 : 12) : p.x;
      const nameY = side ? p.y - 2 : p.y + p.r + (isPivot ? 26 : 17) * k;
      const subY = side ? p.y + subFs + 1 : nameY + (isPivot ? 17 : 15) * k;
      const anchor = { "text-anchor": side ? "start" : "middle" };
      const nm = el("text", Object.assign({ class: "TK4R9-n-name", x: lx, y: nameY, "font-size": nameFs }, anchor));
      nm.appendChild(document.createTextNode(n.name)); g.appendChild(nm);
      const sub = el("text", Object.assign({ class: "TK4R9-n-sub", x: lx, y: subY, "font-size": subFs }, anchor));
      sub.appendChild(document.createTextNode(TK4R9_SHORT_T[n.id] || "")); g.appendChild(sub);
    }
    return g;
  }

  // Per-build lookups, filled by build()
  let nodeEls = {}, bandEls = {}, edgeEls = {}, CONTENT = null;

  function build() {
    while (content.firstChild) content.removeChild(content.firstChild);
    nodeEls = {}; bandEls = {}; edgeEls = {};

    const BANDS = mode === "mobile" ? TK4R9_BANDS_M : TK4R9_BANDS_D;
    const bandW = mode === "mobile" ? 470 : 1172;
    const bandX = mode === "mobile" ? 14 : 24;
    const k = OFF_K();

    const maskDefs = el("defs");
    content.appendChild(maskDefs);

    // Paper grain: fractal noise tinted a warm dark brown, cut to each band's rounded shape
    // (feComposite "in" keeps only the noise inside the white SourceGraphic rect).
    const grain = el("filter", { id: "TK4R9-grain", x: "0", y: "0", width: "1", height: "1" });
    grain.appendChild(el("feTurbulence", { type: "fractalNoise", baseFrequency: ".8", numOctaves: "3", stitchTiles: "stitch", result: "noise" }));
    grain.appendChild(el("feColorMatrix", { in: "noise", values: "0 0 0 0 .16  0 0 0 0 .13  0 0 0 0 .09  0 0 0 .5 -.2", result: "tint" }));
    grain.appendChild(el("feComposite", { in: "tint", in2: "SourceGraphic", operator: "in" }));
    maskDefs.appendChild(grain);

    const bandLayer = el("g");
    BANDS.forEach(function (b) {
      const g = el("g", { class: "TK4R9-tier TK4R9-tier-" + b.t });
      const rect = el("rect", { class: "TK4R9-band TK4R9-band-" + b.t, x: bandX, y: b.y, width: bandW, height: b.h, rx: 14 });
      g.appendChild(rect);
      g.appendChild(el("rect", { class: "TK4R9-band-grain", x: bandX, y: b.y, width: bandW, height: b.h, rx: 14, fill: "#fff", filter: "url(#TK4R9-grain)" }));
      const tabY = b.y + 24 * Math.min(k, 1.2);
      // On mobile the tier caption is right-aligned so the hub column's vertical stake
      // lines (down the left edge) never run through it.
      const tabAttrs = mode === "mobile" ? { x: bandX + bandW - 18, "text-anchor": "end" } : { x: bandX + 20 };
      g.appendChild(el("text", Object.assign({ class: "TK4R9-tier-tab", y: tabY, "font-size": fsz(RATIO.tierTab, TIER_K) }, tabAttrs), [document.createTextNode(TK4R9_TIER[b.t].tab)]));
      const nm = el("text", Object.assign({ class: "TK4R9-tier-name", y: tabY + 18 * Math.min(k, 1.2), "font-size": fsz(RATIO.tierName, TIER_K) }, tabAttrs));
      nm.appendChild(document.createTextNode(TK4R9_TIER[b.t].name));
      const rl = el("tspan", { dx: "8" });
      rl.appendChild(document.createTextNode("· " + TK4R9_TIER[b.t].role));
      nm.appendChild(rl); g.appendChild(nm); bandLayer.appendChild(g);
      bandEls[b.t] = { g: g, rect: rect };
    });
    content.appendChild(bandLayer);

    const edgeLayer = el("g"), labelLayer = el("g");
    TK4R9_EDGES.forEach(function (e, i) {
      const g = edgeGeom(e), key = edgeKey(e);
      const maskId = "TK4R9-draw-" + i;
      const mask = el("mask", { id: maskId, maskUnits: "userSpaceOnUse", x: "-2000", y: "-2000", width: "6000", height: "6000" });
      const mp = el("path", { class: "TK4R9-draw", d: maskPathD(g), fill: "none", stroke: "#fff", "stroke-width": "28", pathLength: "1", "stroke-dasharray": "1 1", "stroke-dashoffset": "0" });
      mask.appendChild(mp); maskDefs.appendChild(mask);

      const cls = "TK4R9-edge TK4R9-e-" + e.type + (e.dotted ? " is-dotted" : "") + (e.hidden ? " is-hidden" : "");
      const path = el("path", { class: cls, d: g.d, "marker-end": "url(#TK4R9-arw-" + e.type + ")", mask: "url(#" + maskId + ")" });
      edgeLayer.appendChild(path);

      let lg = null;
      const t = e.labelT ? (mode === "mobile" ? e.labelT.m : e.labelT.d) : .5;
      if (e.label && t !== null) {
        const pt = pointAt(g, t), lx = pt[0], ly = pt[1];
        lg = el("g", { class: "TK4R9-elabel-group" + (e.hidden ? " is-hidden" : "") });
        const fs = fsz(RATIO.elabel);
        const w = e.label.length * (fs * .58) + 12, h = fs + 8;
        lg.appendChild(el("rect", { class: "TK4R9-elabel-bg", x: lx - w / 2, y: ly - h / 2, width: w, height: h, rx: h / 2 }));
        const tx = el("text", { class: "TK4R9-elabel", x: lx, y: ly, "text-anchor": "middle", "dominant-baseline": "central", "font-size": fs });
        tx.appendChild(document.createTextNode(e.label)); lg.appendChild(tx); labelLayer.appendChild(lg);
      }
      edgeEls[key] = { path: path, draw: mp, label: lg };
    });
    content.appendChild(edgeLayer);
    content.appendChild(labelLayer);

    const nodeLayer = el("g");
    TK4R9_NODES.forEach(function (n) {
      const g = makeNode(n);
      nodeLayer.appendChild(g);
      nodeEls[n.id] = g;
    });
    content.appendChild(nodeLayer);

    CONTENT = pad(content.getBBox(), mode === "mobile" ? 20 : 26);
  }

  // ── Camera (narrow screens): frame the bands/nodes a step is about ──
  let vb = null;
  function applyViewBox() { svg.setAttribute("viewBox", vb.x + " " + vb.y + " " + vb.w + " " + vb.h); }
  function viewFor(stepIdx) {
    if (layout === "wide" || stepIdx < 0) return CONTENT;
    const s = TK4R9_STEPS[stepIdx];
    const boxes = [];
    s.view.bands.forEach(function (t) { if (bandEls[t]) boxes.push(bandEls[t].g.getBBox()); });
    s.nodes.concat(s.view.nodes).forEach(function (id) { if (nodeEls[id]) boxes.push(nodeEls[id].getBBox()); });
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    boxes.forEach(function (b) { x0 = Math.min(x0, b.x); y0 = Math.min(y0, b.y); x1 = Math.max(x1, b.x + b.width); y1 = Math.max(y1, b.y + b.height); });
    const p = 14;
    const v = { x: x0 - p, y: y0 - p, w: x1 - x0 + 2 * p, h: y1 - y0 + 2 * p };
    // Grow the frame (around its centre) to the stage's own shape, so the spare room
    // shows the neighbouring, dimmed parts of the map rather than empty stage.
    const box = svg.getBoundingClientRect();
    if (box.width && box.height) {
      const aspect = box.width / box.height;
      if (v.w / v.h > aspect) { const h = v.w / aspect; v.y -= (h - v.h) / 2; v.h = h; }
      else { const w = v.h * aspect; v.x -= (w - v.w) / 2; v.w = w; }
    }
    // …but never past the map's own edges when the map is big enough to fill it
    function clamp(pos, size, lo, span) { return size >= span ? lo + (span - size) / 2 : Math.min(Math.max(pos, lo), lo + span - size); }
    v.x = clamp(v.x, v.w, CONTENT.x, CONTENT.w);
    v.y = clamp(v.y, v.h, CONTENT.y, CONTENT.h);
    return v;
  }
  function moveCamera(stepIdx, animate) {
    const target = viewFor(stepIdx);
    if (hasGsap) gsap.killTweensOf(vb || {});
    if (!vb || !animate || !hasGsap) {
      vb = { x: target.x, y: target.y, w: target.w, h: target.h };
      applyViewBox();
      return;
    }
    gsap.to(vb, { x: target.x, y: target.y, w: target.w, h: target.h, duration: 0.9, ease: "power2.inOut", onUpdate: applyViewBox });
  }

  // ── Step engine ──
  let current = -1;

  function setDraw(edge, offset, delayMs) {
    if (hasGsap) gsap.killTweensOf(edge.draw);
    if (delayMs === undefined || !hasGsap) { edge.draw.setAttribute("stroke-dashoffset", offset); return; }
    edge.draw.setAttribute("stroke-dashoffset", 1);
    gsap.to(edge.draw, { attr: { "stroke-dashoffset": 0 }, duration: DRAW_MS / 1000, delay: delayMs / 1000, ease: "power1.inOut" });
  }

  function applyStep(idx, animate) {
    current = idx;
    animate = animate && !reduceMotion.matches;
    const step = idx >= 0 ? TK4R9_STEPS[idx] : null;

    steps.forEach(function (s, i) { s.classList.toggle("is-active", i === idx); });
    svg.classList.toggle("is-dimmed", !!step);
    if (step) svg.setAttribute("data-tier", step.tier); else svg.removeAttribute("data-tier");

    // Which edges draw in, and when; a node lights up when its first incoming arrow lands.
    const drawDelay = {}, nodeDelay = {};
    if (step) {
      step.draw.forEach(function (slot, si) {
        slot.forEach(function (key) {
          drawDelay[key] = si * STAGGER_MS;
          const target = key.split(">")[1];
          if (step.nodes.indexOf(target) >= 0 && !(target in nodeDelay)) nodeDelay[target] = si * STAGGER_MS + DRAW_MS * 0.8;
        });
      });
    }
    const lit = new Set(step ? Object.keys(drawDelay).concat(step.keep) : []);
    const litNodes = new Set(step ? step.nodes : []);

    Object.keys(nodeEls).forEach(function (id) {
      const g = nodeEls[id], on = litNodes.has(id);
      const wasOn = g.classList.contains("is-hl");
      g.style.transitionDelay = (animate && on && !wasOn && nodeDelay[id]) ? nodeDelay[id] + "ms" : "0ms";
      g.classList.toggle("is-hl", on);
    });

    Object.keys(edgeEls).forEach(function (key) {
      const e = edgeEls[key], on = lit.has(key);
      e.path.classList.toggle("is-hl", on);
      const d = drawDelay[key];
      if (animate && d !== undefined) setDraw(e, 0, d); else setDraw(e, 0);
      if (e.label) {
        e.label.style.transitionDelay = (animate && d !== undefined) ? (d + DRAW_MS * 0.7) + "ms" : "0ms";
        e.label.classList.toggle("is-hl", on);
      }
    });

    moveCamera(idx, animate);
  }

  function activate(idx) {
    if (idx === current) return;
    applyStep(idx, true);
  }

  function relayout() {
    const nextLayout = detectLayout(), nextMode = detectMode();
    if (nextLayout === layout && nextMode === mode) return;
    layout = nextLayout; mode = nextMode;
    section.setAttribute("data-layout", layout);
    build();
    vb = null;
    applyStep(current, false);
  }

  window.addEventListener("resize", relayout);
  window.addEventListener("orientationchange", function () { setTimeout(relayout, 200); });

  // ── Header legend chips: tiers, connection types, status rings ──
  function buildLegend() {
    if (!legendDom) return;
    legendDom.innerHTML = "";
    function group(title, rows, render) {
      const g = document.createElement("div");
      g.className = "TK4R9-legend-group";
      g.innerHTML = "<h3>" + title + "</h3>";
      const ul = document.createElement("ul");
      rows.forEach(function (row) {
        const li = document.createElement("li");
        li.className = "TK4R9-legend-item";
        li.style.color = row.color;
        li.innerHTML = render(row) + '<span style="color:var(--color-text)">' + row.label + "</span>";
        ul.appendChild(li);
      });
      g.appendChild(ul);
      legendDom.appendChild(g);
    }
    // Tiers need no legend — every band is labelled on the map itself; connection types
    // are left to the arrows and the cards.
    group("Status", ["gold", "red", "hist"].map(function (s) { return { label: STATUS[s].label, color: STATUS[s].c, dashed: STATUS[s].dashed }; }),
      function (row) { return '<span class="TK4R9-legend-dot' + (row.dashed ? " is-dashed" : "") + '"></span>'; });
  }
  buildLegend();

  relayout();

  // ── Scroll triggers — one per narrative card, same pattern as TK4R6 ──
  if (!hasGsap || typeof ScrollTrigger === "undefined" || !steps.length) return;
  gsap.registerPlugin(ScrollTrigger);

  steps.forEach(function (step, i) {
    ScrollTrigger.create({
      trigger: step,
      // In the stacked layout the map covers the top of the screen, so a card only
      // counts as "in view" once it reaches the lower, uncovered part of the viewport.
      start: function () { return layout === "wide" ? "top 60%" : "top 88%"; },
      end: function () { return layout === "wide" ? "bottom 40%" : "bottom 70%"; },
      onEnter: function () { activate(i); },
      onEnterBack: function () { activate(i); },
      onLeaveBack: function () { if (i === 0) activate(-1); }
    });
  });
});
