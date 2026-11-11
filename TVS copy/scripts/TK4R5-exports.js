// scripts/TK4R5-exports.js — TK4R5 · TVS two-wheeler volume with exports, FY14–FY26 (story V11)
// Light island (TK4R-theme-light): every colour is a CSS token, so it follows the section's theme.
// Card-chart pattern shared with TK4R3–6: legend hover focuses a series, mark hover focuses a year
// (others dim to 30%), one tooltip per year, keyboard focus mirrors hover.

document.addEventListener("DOMContentLoaded", function () {
  const svg = document.getElementById("TK4R5-chart");
  const plot = document.getElementById("TK4R5-plot");
  const tip = document.getElementById("TK4R5-tip");
  const legend = document.getElementById("TK4R5-legend");
  const unit = document.getElementById("TK4R5-unit");
  if (!svg) return;

  // 1. Data
  const years   = ["FY14", "FY15", "FY16", "FY17", "FY18", "FY19", "FY20", "FY21", "FY22", "FY23", "FY24", "FY25", "FY26"];
  const exports = [315019, 413964, 453800, 364112, 491960, 622019, 678841, 764039, 1090139, 915018, 887774, 1090900, 1426550];
  const total   = [2067592, 2514785, 2663166, 2869517, 3384799, 3773608, 3103340, 2936580, 3147949, 3512954, 4044824, 4610125, 5670074];
  const share   = [15, 16, 17, 13, 15, 16, 22, 26, 35, 26, 22, 24, 25];
  const mil = v => (v / 1e6).toFixed(2);

  const NS = "http://www.w3.org/2000/svg";
  const el = (tag, attrs, text) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;
    return n;
  };

  let cols = [];

  // 2. Render — stacked to absolute volume: total sets each bar's height, exports sit on the baseline.
  // Inside the crimson block: export share. Just above it, in crimson: export volume. Above the bar: total.
  function render() {
    const W = plot.clientWidth;
    const mobile = W < 560;
    const ml = mobile ? 26 : 40, mr = 4;
    const top = 26, bH = mobile ? 260 : 300;
    const H = top + bH + 30;
    unit.textContent = mobile ? "Units, m · exports: share inside, volume above" : "Units, million · exports: share inside, volume above";

    const step = (W - ml - mr) / years.length;
    const cx = i => ml + step * (i + .5);
    const bw = step * (mobile ? .7 : .62);
    const by = v => top + bH - v / 6e6 * bH;
    const GAP = 2;                              // card shows through between the two segments

    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.setAttribute("height", H);
    svg.innerHTML = "";

    [0, 1, 2, 3, 4, 5, 6].forEach(t =>
      svg.append(el("text", { x: ml - 10, y: by(t * 1e6) + 3.5, "text-anchor": "end", class: "TK4R5-tick" }, t)));

    cols = years.map((y, i) => {
      const g = el("g", { "data-col": i });
      const x = cx(i) - bw / 2, ex = by(exports[i]), segH = by(0) - ex;
      const show = !mobile || i % 2 === 0;      // phones label every other year, matching the axis
      g.append(
        el("rect", { x, y: by(total[i]), width: bw, height: Math.max(0, ex - GAP - by(total[i])), class: "TK4R5-domestic", "data-series": "domestic" }),
        el("rect", { x, y: ex, width: bw, height: segH, class: "TK4R5-exports", "data-series": "exports" })
      );
      // share inside the crimson block when it fits
      if (segH >= 14) {
        const v = el("text", { x: cx(i), y: ex + segH / 2 + 4, "text-anchor": "middle", class: "TK4R5-v TK4R5-exports-v", "data-series": "exports" }, share[i]);
        v.append(el("tspan", { "font-size": ".75em" }, "%"));
        g.append(v);
      }
      if (show) {
        // export volume, crimson, sitting in the domestic block just above the crimson one
        g.append(el("text", { x: cx(i), y: ex - GAP - 6, "text-anchor": "middle", class: "TK4R5-ann TK4R5-ann--red", "data-series": "exports" }, mil(exports[i])));
        g.append(el("text", { x: cx(i), y: by(total[i]) - 8, "text-anchor": "middle", class: "TK4R5-ann TK4R5-ann--muted" }, mil(total[i])));
        g.append(el("text", { x: cx(i), y: by(0) + 20, "text-anchor": "middle", class: "TK4R5-xlabel" }, y));
      }
      svg.append(g);
      return g;
    });

    svg.append(el("line", { x1: ml, x2: W - mr, y1: by(0) + .5, y2: by(0) + .5, stroke: "var(--color-text)", "stroke-width": 1 }));

    // hit areas: the full column, focusable for keyboard users
    years.forEach((y, i) => svg.append(el("rect", {
      x: cx(i) - step / 2, y: top - 22, width: step, height: bH + 22, class: "TK4R5-hit", "data-i": i, tabindex: 0,
      "aria-label": `${y}: total ${mil(total[i])} million; exports ${mil(exports[i])} million, ${share[i]}%`
    })));
  }

  // 3. Focus — legend hover focuses a series, mark hover focuses a year
  function setSeries(key) {
    legend.classList.toggle("is-focus", !!key);
    legend.querySelectorAll("li").forEach(l => l.classList.toggle("is-on", l.dataset.key === key));
    svg.querySelectorAll("[data-series]").forEach(n => n.classList.toggle("is-dim", !!key && n.dataset.series !== key));
  }
  const setYear = i => cols.forEach((c, j) => c.classList.toggle("is-dim", i != null && j !== i));
  legend.addEventListener("pointerover", e => { const li = e.target.closest("li"); if (li) setSeries(li.dataset.key); });
  legend.addEventListener("pointerleave", () => setSeries(null));

  // 4. Tooltip
  function showTip(html, x, y) {
    tip.innerHTML = html;
    const pr = plot.getBoundingClientRect(), tw = tip.offsetWidth, th = tip.offsetHeight;
    let left = x - pr.left + 16;
    if (left + tw > pr.width) left = x - pr.left - tw - 16;
    tip.style.left = Math.max(0, left) + "px";
    tip.style.top = Math.max(0, Math.min(y - pr.top - th / 2, pr.height - th)) + "px";
    tip.classList.add("is-show");
  }
  const tipFor = i => `<div class="TK4R5-tip-h">${years[i]}</div>
    <div class="TK4R5-tip-row"><span>Exports</span><b>${share[i]}<small>% · ${mil(exports[i])}m</small></b></div>
    <div class="TK4R5-tip-row"><span>Domestic</span><b>${100 - share[i]}<small>% · ${mil(total[i] - exports[i])}m</small></b></div>
    <div class="TK4R5-tip-row"><span>Total</span><b>${mil(total[i])}<small>m units</small></b></div>`;
  function clear() { setYear(null); tip.classList.remove("is-show"); }

  svg.addEventListener("pointermove", e => {
    const hit = e.target.closest(".TK4R5-hit");
    if (!hit) return clear();
    setYear(+hit.dataset.i);
    showTip(tipFor(+hit.dataset.i), e.clientX, e.clientY);
  });
  svg.addEventListener("pointerleave", clear);
  svg.addEventListener("focusin", e => {
    const hit = e.target.closest(".TK4R5-hit");
    if (!hit) return;
    const r = cols[+hit.dataset.i].querySelector(".TK4R5-exports").getBoundingClientRect();
    setYear(+hit.dataset.i);
    showTip(tipFor(+hit.dataset.i), r.right, r.top);
  });
  svg.addEventListener("focusout", clear);

  let lastW = 0;
  new ResizeObserver(() => {
    if (plot.clientWidth === lastW) return;
    lastW = plot.clientWidth;
    render();
  }).observe(plot);
});
