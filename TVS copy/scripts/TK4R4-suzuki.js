// scripts/TK4R4-suzuki.js — TK4R4 · TVS-Suzuki profit after tax, 1994–2001 (story V8)
// Card-chart pattern shared with TK4R3–6: legend hover focuses a series, mark hover focuses a year
// (others dim to 30%), one tooltip per year, keyboard focus mirrors hover.

document.addEventListener("DOMContentLoaded", function () {
  const svg = document.getElementById("TK4R4-chart");
  const plot = document.getElementById("TK4R4-plot");
  const tip = document.getElementById("TK4R4-tip");
  const legend = document.getElementById("TK4R4-legend");
  if (!svg) return;

  // 1. Data
  const years  = [1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001];
  const pat    = [18, 33, 35, 55, 69, 82, 87, 63];
  const growth = [null, 83, 6, 57, 25, 19, 6, -28];

  const NS = "http://www.w3.org/2000/svg";
  const el = (tag, attrs, text) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;
    return n;
  };
  const tone = g => g == null ? "" : g < 0 ? "down" : "up";
  const fmt = g => (g > 0 ? "+" : g < 0 ? "−" : "") + Math.abs(g) + "%";

  // Rises are green, deeper the bigger the rise: the biggest is the full base green, smaller rises
  // are mixed toward Cream — capped at 38% so the lightest still reads as green, not pale.
  const maxUp = Math.max(...growth.filter(g => g > 0));
  const upFill = g => `color-mix(in srgb, var(--cat-6), var(--color-cream) ${Math.round(38 * (1 - g / maxUp))}%)`;

  let cols = [];

  // 2. Render — bars with PAT inside; a dotted growth line joins the bar tops, each joint labelled
  function render() {
    const W = plot.clientWidth;
    const mobile = W < 560;
    const ml = mobile ? 30 : 44, mr = 6;
    const top = 26, bH = mobile ? 260 : 300;
    const H = top + bH + 30;

    const step = (W - ml - mr) / years.length;
    const cx = i => ml + step * (i + .5);
    const bw = step * (mobile ? .62 : .54);
    const by = v => top + bH - v / 100 * bH;

    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.setAttribute("height", H);
    svg.innerHTML = "";

    [0, 25, 50, 75, 100].forEach(t =>
      svg.append(el("text", { x: ml - 10, y: by(t) + 3.5, "text-anchor": "end", class: "TK4R4-tick" }, t)));

    // one group per year — bar, value, year label, dot, growth label — so a year focuses as a unit
    cols = pat.map((v, i) => {
      const g = el("g", { "data-col": i });
      g.append(
        el("rect", { x: cx(i) - bw / 2, y: by(v), width: bw, height: by(0) - by(v), class: "TK4R4-bar", "data-series": "pat" }),
        el("text", { x: cx(i), y: by(v) + 20, "text-anchor": "middle", class: "TK4R4-v TK4R4-bar-v", "data-series": "pat" }, v),
        el("text", { x: cx(i), y: by(0) + 21, "text-anchor": "middle", class: "TK4R4-xlabel" }, years[i])
      );
      svg.append(g);
      return g;
    });

    // baseline only, 1px ink
    svg.append(el("line", { x1: ml, x2: W - mr, y1: by(0) + .5, y2: by(0) + .5, stroke: "var(--color-text)", "stroke-width": 1 }));

    // growth line along the bar tops: green for a rise, the one hot Vermilion segment for the fall
    pat.forEach((v, i) => {
      if (i === 0) return;
      svg.append(el("line", {
        x1: cx(i - 1), y1: by(pat[i - 1]), x2: cx(i), y2: by(v), "data-series": "growth", class: "TK4R4-gline",
        stroke: growth[i] < 0 ? "var(--color-signal)" : "var(--cat-6)", "stroke-width": 2.5,
        "stroke-dasharray": "0.1 6", "stroke-linecap": "round"
      }));
    });

    // dots + growth labels join their year's group
    pat.forEach((v, i) => {
      const g = growth[i], t = tone(g);
      const dot = el("circle", { cx: cx(i), cy: by(v), r: 4.5, "data-series": "growth", class: "TK4R4-dot" + (t ? " TK4R4-dot--" + t : "") });
      if (g > 0) dot.style.fill = upFill(g);
      cols[i].append(dot);
      if (g == null) return;
      const lbl = el("text", { x: cx(i), y: by(v) - 14, "text-anchor": "middle", "data-series": "growth",
        class: "TK4R4-ann" + (t === "down" ? " TK4R4-ann--down" : "") }, fmt(g));
      if (g > 0) lbl.style.fill = upFill(g);
      cols[i].append(lbl);
    });

    // hit areas: the full column, larger than the bar, focusable for keyboard users
    pat.forEach((v, i) => svg.append(el("rect", {
      x: cx(i) - step / 2, y: top - 20, width: step, height: bH + 20, class: "TK4R4-hit", "data-i": i, tabindex: 0,
      "aria-label": `${years[i]}: profit after tax Rs ${v} crore` + (growth[i] == null ? "" : `, ${fmt(growth[i])} on the year before`)
    })));
  }

  // 3. Focus — legend hover focuses a series, mark hover focuses a year
  function setSeries(key) {
    legend.classList.toggle("is-focus", !!key);
    legend.querySelectorAll("li").forEach(l => l.classList.toggle("is-on", l.dataset.key === key));
    svg.querySelectorAll("[data-series]").forEach(n => n.classList.toggle("is-dim", !!key && n.dataset.series !== key));
  }
  function setYear(i) {
    cols.forEach((c, j) => c.classList.toggle("is-dim", i != null && j !== i));
    svg.querySelectorAll(".TK4R4-gline").forEach(n => n.classList.toggle("is-dim", i != null));
  }
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
  const tipFor = i => {
    const g = growth[i];
    return `<div class="TK4R4-tip-h">${years[i]}</div>
      <div class="TK4R4-tip-row"><span>Profit after tax</span><b>Rs ${pat[i]}<small> cr</small></b></div>` +
      (g == null ? "" : `<div class="TK4R4-tip-row"><span>Year-on-year</span><b style="color:${g > 0 ? upFill(g) : "var(--color-signal)"}">${fmt(g)}</b></div>`);
  };
  function clear() { setYear(null); tip.classList.remove("is-show"); }

  svg.addEventListener("pointermove", e => {
    const hit = e.target.closest(".TK4R4-hit");
    if (!hit) return clear();
    setYear(+hit.dataset.i);
    showTip(tipFor(+hit.dataset.i), e.clientX, e.clientY);
  });
  svg.addEventListener("pointerleave", clear);
  svg.addEventListener("focusin", e => {
    const hit = e.target.closest(".TK4R4-hit");
    if (!hit) return;
    const r = cols[+hit.dataset.i].querySelector(".TK4R4-bar").getBoundingClientRect();
    setYear(+hit.dataset.i);
    showTip(tipFor(+hit.dataset.i), r.right, r.top + r.height / 2);
  });
  svg.addEventListener("focusout", clear);

  let lastW = 0;
  new ResizeObserver(() => {
    if (plot.clientWidth === lastW) return;
    lastW = plot.clientWidth;
    render();
  }).observe(plot);
});
