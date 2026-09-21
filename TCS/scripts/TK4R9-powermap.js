// scripts/TK4R9-powermap.js
// Power & conflict network graph — Tata Trusts / Tata Sons / TCS leadership.
// Requires scripts/TK4R9-powermap_data.js to be loaded first (TK4R9_NODES, TK4R9_EDGES, …).

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  const section = document.querySelector(".TK4R9-chart-section");
  if (!section) return;

  const svg = document.getElementById("TK4R9-map");
  const stage = document.getElementById("TK4R9-stage");
  const tip = document.getElementById("TK4R9-tip");
  const legendDom = document.getElementById("TK4R9-legend");
  if (!svg || !stage || !tip) return;

  const NS = "http://www.w3.org/2000/svg";

  // Token-driven color resolution — every mark paints with var(--token), so it always
  // tracks styles/globals.css and dark/light updates without touching this file.
  const STATUS_COLOR_VAR = {
    good: "var(--status-good)",
    critical: "var(--status-critical)",
    warning: "var(--status-warning)",
    muted: "var(--color-muted)",
    "cat-1": "var(--cat-1)",
    "cat-2": "var(--cat-2)",
    "cat-3": "var(--cat-3)"
  };
  const STATUS = {};
  Object.keys(TK4R9_STATUS_META).forEach(function (key) {
    const meta = TK4R9_STATUS_META[key];
    STATUS[key] = { c: STATUS_COLOR_VAR[meta.token], label: meta.label, dashed: !!meta.dashed };
  });
  const TIER_COLOR = { 1: "var(--cat-1)", 2: "var(--cat-2)", 3: "var(--cat-3)" };
  const AVFILL = TIER_COLOR;
  const PIVOT_FILL = "var(--color-secondary)";

  const byId = Object.fromEntries(TK4R9_NODES.map(function (n) { return [n.id, n]; }));
  const adj = {};
  TK4R9_NODES.forEach(function (n) { adj[n.id] = new Set(); });
  TK4R9_EDGES.forEach(function (e) { adj[e.s].add(e.t); adj[e.t].add(e.s); });

  const mq = window.matchMedia("(max-width: 1023px)");
  let mode = "desktop";
  function detectMode() { return mq.matches ? "mobile" : "desktop"; }
  function P(n) { return mode === "mobile" ? n.pos.m : n.pos.d; }

  // Font sizes derive from the --type-legend token (the design system's role for
  // diagram/chip-scale labels), scaled by the same ratios the original hand-tuned
  // sizes implied against a 14px base — never a bare magic-number px value.
  const RATIO = {
    tierTab: 0.786, tierName: 0.857, hubMulti: 0.786, hubSingle: 0.929,
    avatarPivot: 1.214, avatarShort: 1.0, avatarLong: 0.786,
    namePivot: 1.036, nameNormal: 0.893, sub: 0.786, elabel: 0.75
  };
  function baseLegendPx() {
    const v = getComputedStyle(document.documentElement).getPropertyValue("--type-legend").trim();
    return parseFloat(v) || 14;
  }
  function fsz(ratio) {
    const base = baseLegendPx() * ratio;
    return mode === "mobile" ? +(base * 1.4).toFixed(1) : +base.toFixed(1);
  }

  function el(tag, attrs, children) {
    const e = document.createElementNS(NS, tag);
    if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (children) children.forEach(function (c) { e.appendChild(c); });
    return e;
  }

  const defs = el("defs");
  [["succ", "TK4R9-mk-succ"], ["ctrl", "TK4R9-mk-ctrl"], ["asc", "TK4R9-mk-asc"]].forEach(function (pair) {
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
    return { d: "M" + sx + "," + sy + " Q" + cx + "," + cy + " " + ex + "," + ey, sx: sx, sy: sy, ex: ex, ey: ey, cx: cx, cy: cy, straight: false };
  }
  function pointAt(g, t) {
    if (g.straight) return [g.sx + (g.ex - g.sx) * t, g.sy + (g.ey - g.sy) * t];
    const mt = 1 - t;
    return [mt * mt * g.sx + 2 * mt * t * g.cx + t * t * g.ex, mt * mt * g.sy + 2 * mt * t * g.cy + t * t * g.ey];
  }
  function pad(b, p) { return { x: b.x - p, y: b.y - p, w: b.width + 2 * p, h: b.height + 2 * p }; }

  let CONTENT = null;
  function setView() {
    svg.setAttribute("viewBox", CONTENT.x + " " + CONTENT.y + " " + CONTENT.w + " " + CONTENT.h);
    svg.style.aspectRatio = mode === "mobile" ? (CONTENT.w + " / " + CONTENT.h) : "";
  }

  function makeNode(n) {
    const p = P(n);
    const g = el("g", { class: "TK4R9-node", tabindex: "0", "data-id": n.id, role: "button", "aria-label": n.name + ", " + n.role });
    g.appendChild(el("circle", { class: "TK4R9-hit", cx: p.x, cy: p.y, r: p.r + 16 }));
    if (n.kind === "hub") {
      const side = p.r * 1.7;
      g.appendChild(el("rect", { class: "TK4R9-focus-ring", x: p.x - side / 2 - 5, y: p.y - side / 2 - 5, width: side + 10, height: side + 10, rx: 12 }));
      g.appendChild(el("rect", { x: p.x - side / 2, y: p.y - side / 2, width: side, height: side, rx: 11, fill: TIER_COLOR[n.tier], stroke: "var(--color-surface)", "stroke-width": "3" }));
      n.label.forEach(function (line, i) {
        const dy = (i - (n.label.length - 1) / 2) * 13;
        const t = el("text", { class: "TK4R9-hub-txt", x: p.x, y: p.y + dy, "font-size": fsz(n.label.length > 1 ? RATIO.hubMulti : RATIO.hubSingle) });
        t.appendChild(document.createTextNode(line)); g.appendChild(t);
      });
    } else {
      const isPivot = n.kind === "pivot", ringC = STATUS[n.status].c;
      g.appendChild(el("circle", { class: "TK4R9-focus-ring", cx: p.x, cy: p.y, r: p.r + 6 }));
      g.appendChild(el("circle", { cx: p.x, cy: p.y, r: p.r, fill: "none", stroke: ringC, "stroke-width": isPivot ? 5 : 3.2, "stroke-dasharray": STATUS[n.status].dashed ? "4 4" : "none" }));
      if (isPivot) g.appendChild(el("circle", { cx: p.x, cy: p.y, r: p.r + 4, fill: "none", stroke: ringC, "stroke-width": "1.4", opacity: ".35" }));
      g.appendChild(el("circle", { cx: p.x, cy: p.y, r: p.r - 4, fill: isPivot ? PIVOT_FILL : AVFILL[n.tier] }));
      const avRatio = isPivot ? RATIO.avatarPivot : (n.initials.length > 2 ? RATIO.avatarLong : RATIO.avatarShort);
      const t = el("text", { class: "TK4R9-avatar-txt", x: p.x, y: p.y + 1, "font-size": fsz(avRatio) });
      t.appendChild(document.createTextNode(n.initials)); g.appendChild(t);
      if (n.status === "red") {
        const bx = p.x + p.r * .72, by = p.y - p.r * .72;
        const bg = el("g", { class: "TK4R9-removed-badge" });
        bg.appendChild(el("circle", { cx: bx, cy: by, r: 8, stroke: "var(--color-surface)", "stroke-width": "2" }));
        bg.appendChild(el("path", { d: "M" + (bx - 3) + "," + (by - 3) + " L" + (bx + 3) + "," + (by + 3) + " M" + (bx + 3) + "," + (by - 3) + " L" + (bx - 3) + "," + (by + 3) }));
        g.appendChild(bg);
      }
      const nameOff = isPivot ? 26 : 17;
      const nameY = p.y + p.r + nameOff;
      const nm = el("text", { class: "TK4R9-n-name", x: p.x, y: nameY, "font-size": fsz(isPivot ? RATIO.namePivot : RATIO.nameNormal) });
      nm.appendChild(document.createTextNode(n.name)); g.appendChild(nm);
      const sub = el("text", { class: "TK4R9-n-sub", x: p.x, y: nameY + (isPivot ? 17 : 15), "font-size": fsz(RATIO.sub) });
      sub.appendChild(document.createTextNode(TK4R9_SHORT_T[n.id] || n.tenure)); g.appendChild(sub);
    }
    return g;
  }

  function tipHTML(n) {
    const st = STATUS[n.status || n.statusTag];
    const avC = n.kind === "hub" ? TIER_COLOR[n.tier] : (n.kind === "pivot" ? PIVOT_FILL : AVFILL[n.tier]);
    const ringStyle = n.kind === "hub" ? ("border-color:" + TIER_COLOR[n.tier]) : ("border-color:" + st.c + (st.dashed ? ";border-style:dashed" : ""));
    const tierTag = n.tierLabel || (TK4R9_TIER[n.tier].tab.replace("TIER ", "Tier ") + " · " + TK4R9_TIER[n.tier].name);
    const initials = n.kind === "hub" ? n.name.split(" ").map(function (w) { return w[0]; }).join("").slice(0, 3) : n.initials;
    let statusRow = "";
    if (n.kind !== "hub") {
      statusRow = '<div class="TK4R9-tip-row"><span class="TK4R9-tip-k">Status</span><span class="TK4R9-tip-v"><span class="TK4R9-status-pill"><span class="TK4R9-status-dot" style="background:' + st.c + '"></span>' + st.label + "</span></span></div>";
    }
    return (
      '<div class="TK4R9-tip-top">' +
        '<div class="TK4R9-tip-av" style="background:' + avC + ";" + ringStyle + '">' + initials + "</div>" +
        '<div class="TK4R9-tip-hd"><div class="TK4R9-tip-name">' + n.name + "</div></div>" +
        '<span class="TK4R9-tip-tier">' + tierTag + "</span>" +
      "</div>" +
      '<div class="TK4R9-tip-meta">' +
        '<div class="TK4R9-tip-row"><span class="TK4R9-tip-k">Role</span><span class="TK4R9-tip-v">' + n.role + "</span></div>" +
        '<div class="TK4R9-tip-row"><span class="TK4R9-tip-k">' + (n.kind === "hub" ? "About" : "Tenure") + '</span><span class="TK4R9-tip-v">' + n.tenure + "</span></div>" +
        statusRow +
      "</div>" +
      (n.note ? ('<div class="TK4R9-tip-note" style="border-left-color:' + st.c + '">' + n.note + "</div>") : "")
    );
  }

  let nodeLayer = null, edgeLayer = null, labelLayer = null;

  function highlight(id) {
    svg.classList.add("is-dimmed");
    const keep = new Set([id].concat(Array.from(adj[id])));
    nodeLayer.querySelectorAll(".TK4R9-node").forEach(function (g) { g.classList.toggle("is-hl", keep.has(g.dataset.id)); });
    edgeLayer.querySelectorAll(".TK4R9-edge").forEach(function (p) { p.classList.toggle("is-hl", p.dataset.s === id || p.dataset.t === id); });
    labelLayer.querySelectorAll(".TK4R9-elabel-group").forEach(function (g) { g.classList.toggle("is-hl", g.dataset.s === id || g.dataset.t === id); });
  }
  function clearHighlight() {
    svg.classList.remove("is-dimmed");
    svg.querySelectorAll(".is-hl").forEach(function (e) { e.classList.remove("is-hl"); });
  }
  function placeTip(clientX, clientY) {
    const vw = window.innerWidth, vh = window.innerHeight;
    const tw = tip.offsetWidth, th = tip.offsetHeight;
    let x = clientX + 16, y = clientY + 16;
    if (x + tw > vw - 8) x = clientX - tw - 16;
    if (y + th > vh - 8) y = vh - th - 8;
    if (x < 8) x = 8; if (y < 8) y = 8;
    tip.style.left = x + "px"; tip.style.top = y + "px";
  }
  function showTip(n) { tip.innerHTML = tipHTML(n); tip.classList.add("is-shown"); tip.setAttribute("aria-hidden", "false"); }
  function hideTip() { tip.classList.remove("is-shown"); tip.setAttribute("aria-hidden", "true"); }

  function attachNodeEvents() {
    nodeLayer.querySelectorAll(".TK4R9-node").forEach(function (g) {
      const n = byId[g.dataset.id];
      g.addEventListener("mouseenter", function (e) { highlight(n.id); showTip(n); placeTip(e.clientX, e.clientY); });
      g.addEventListener("mousemove", function (e) { placeTip(e.clientX, e.clientY); });
      g.addEventListener("mouseleave", function () { clearHighlight(); hideTip(); });
      g.addEventListener("focus", function () { highlight(n.id); showTip(n); const rc = g.getBoundingClientRect(); placeTip(rc.left + rc.width / 2, rc.top + rc.height / 2); });
      g.addEventListener("blur", function () { clearHighlight(); hideTip(); });
      g.addEventListener("click", function (e) { highlight(n.id); showTip(n); placeTip(e.clientX, e.clientY); e.stopPropagation(); });
      g.addEventListener("keydown", function (e) { if (e.key === "Escape") { clearHighlight(); hideTip(); g.blur(); } });
    });
  }

  function build() {
    clearHighlight(); hideTip();
    while (content.firstChild) content.removeChild(content.firstChild);

    const BANDS = mode === "mobile" ? TK4R9_BANDS_M : TK4R9_BANDS_D;
    const bandW = mode === "mobile" ? 470 : 1172;
    const bandX = mode === "mobile" ? 14 : 24;

    const bandLayer = el("g");
    BANDS.forEach(function (b) {
      const g = el("g", { class: "TK4R9-tier-" + b.t });
      g.appendChild(el("rect", { class: "TK4R9-band TK4R9-band-" + b.t, x: bandX, y: b.y, width: bandW, height: b.h, rx: 14 }));
      g.appendChild(el("text", { class: "TK4R9-tier-tab", x: bandX + 20, y: b.y + 24, "font-size": fsz(RATIO.tierTab) }, [document.createTextNode(TK4R9_TIER[b.t].tab)]));
      const nm = el("text", { class: "TK4R9-tier-name", x: bandX + 20, y: b.y + 42, "font-size": fsz(RATIO.tierName) });
      nm.appendChild(document.createTextNode(TK4R9_TIER[b.t].name));
      const rl = el("tspan", { dx: "8" });
      rl.appendChild(document.createTextNode("· " + TK4R9_TIER[b.t].role));
      nm.appendChild(rl); g.appendChild(nm); bandLayer.appendChild(g);
    });
    content.appendChild(bandLayer);

    edgeLayer = el("g"); labelLayer = el("g");
    TK4R9_EDGES.forEach(function (e) {
      const g = edgeGeom(e);
      const cls = "TK4R9-edge TK4R9-e-" + e.type + (e.dotted ? " is-dotted" : "");
      const path = el("path", { class: cls, d: g.d, "marker-end": "url(#TK4R9-arw-" + e.type + ")" });
      path.dataset.s = e.s; path.dataset.t = e.t; edgeLayer.appendChild(path);
      if (e.label) {
        const t = e.labelT ? (mode === "mobile" ? e.labelT.m : e.labelT.d) : .5;
        const pt = pointAt(g, t), lx = pt[0], ly = pt[1];
        const lg = el("g", { class: "TK4R9-elabel-group" }); lg.dataset.s = e.s; lg.dataset.t = e.t;
        const fs = fsz(RATIO.elabel);
        const w = e.label.length * (fs * .58) + 12;
        lg.appendChild(el("rect", { class: "TK4R9-elabel-bg", x: lx - w / 2, y: ly - 9, width: w, height: 18, rx: 9 }));
        const tx = el("text", { class: "TK4R9-elabel", x: lx, y: ly + 3.5, "text-anchor": "middle", "font-size": fs });
        tx.appendChild(document.createTextNode(e.label)); lg.appendChild(tx); labelLayer.appendChild(lg);
      }
    });
    content.appendChild(edgeLayer);
    content.appendChild(labelLayer);

    nodeLayer = el("g");
    TK4R9_NODES.forEach(function (n) { nodeLayer.appendChild(makeNode(n)); });
    content.appendChild(nodeLayer);

    CONTENT = pad(content.getBBox(), mode === "mobile" ? 20 : 26);
    setView();
    attachNodeEvents();
  }

  function setMode(next) {
    if (next === mode && CONTENT) return;
    mode = next;
    build();
  }

  window.addEventListener("resize", function () {
    const next = detectMode();
    if (next !== mode) setMode(next);
  });
  window.addEventListener("orientationchange", function () {
    setTimeout(function () {
      const next = detectMode();
      if (next !== mode) setMode(next);
    }, 200);
  });

  svg.addEventListener("click", function (e) {
    if (e.target === svg || (e.target.tagName === "rect" && e.target.classList.contains("TK4R9-band"))) { clearHighlight(); hideTip(); }
  });

  // ── Header legend chips: tiers + connection types ──
  function buildLegend() {
    if (!legendDom) return;
    legendDom.innerHTML = "";

    const tierGroup = document.createElement("div");
    tierGroup.className = "TK4R9-legend-group";
    tierGroup.innerHTML = "<h3>Tiers</h3>";
    const tierList = document.createElement("ul");
    [1, 2, 3].forEach(function (t) {
      const li = document.createElement("li");
      li.className = "TK4R9-legend-item";
      li.style.color = TIER_COLOR[t];
      li.innerHTML = '<span class="TK4R9-legend-dot"></span><span style="color:var(--color-text)">' + TK4R9_TIER[t].name + "</span>";
      tierList.appendChild(li);
    });
    tierGroup.appendChild(tierList);

    const edgeGroup = document.createElement("div");
    edgeGroup.className = "TK4R9-legend-group";
    edgeGroup.innerHTML = "<h3>Connections</h3>";
    const edgeList = document.createElement("ul");
    [
      { cls: "", label: "Succession", color: "var(--cat-4)" },
      { cls: "is-dashed", label: "Ownership / control stake", color: "var(--cat-5)" },
      { cls: "", label: "Chandrasekaran's ascent", color: "var(--cat-6)" }
    ].forEach(function (row) {
      const li = document.createElement("li");
      li.className = "TK4R9-legend-item";
      li.style.color = row.color;
      li.innerHTML = '<span class="TK4R9-legend-dash' + (row.cls ? " " + row.cls : "") + '"></span><span style="color:var(--color-text)">' + row.label + "</span>";
      edgeList.appendChild(li);
    });
    edgeGroup.appendChild(edgeList);

    legendDom.appendChild(tierGroup);
    legendDom.appendChild(edgeGroup);
  }
  buildLegend();

  mode = detectMode();
  build();
});
