// scripts/TK4R3-marketshare.js — TK4R3 · Two-wheeler market share, FY23–FY27 (Q1) (story V0)
// Card-chart pattern shared with TK4R4–6: legend hover and mark hover focus a series (others dim to 30%),
// one tooltip per mark, keyboard focus mirrors hover, values on every mark that fits.

document.addEventListener("DOMContentLoaded", function () {
  const $ = id => document.getElementById(id);
  const cols = $("TK4R3-cols"), tip = $("TK4R3-tip"), plot = $("TK4R3-plot"), legend = $("TK4R3-legend");
  if (!cols) return;

  // 1. Data
  const periods = ["FY23", "FY24", "FY25", "FY26", "FY27 (Q1)"];
  // Stack order, baseline up — TVS sits on the baseline so its change reads cleanly.
  // TVS in Royal blue; rivals recede as muted blue-greys (mixes of --color-muted into the card),
  // ordered by size — the biggest share is the lightest, stepping darker as shares shrink.
  // The lightest rival is capped at a mid tone so saturated TVS blue stays the focus.
  // Others closes the ramp as the darkest step — a deep steel blue (a group, not a company).
  // No red anywhere in this chart.
  const MUTED = pct => `color-mix(in srgb, var(--color-muted) ${pct}%, var(--color-surface))`;
  const ON_DARK = "var(--color-cream)", ON_LIGHT = "var(--color-bg-dark)";   // label ink
  const series = [
    { key: "tvs",    name: "TVS",           values: [15, 17, 18, 19, 19], fill: "var(--color-royal)", ink: ON_DARK },
    { key: "hero",   name: "Hero",          values: [32, 31, 30, 28, 27], fill: MUTED(70),            ink: ON_LIGHT },
    { key: "honda",  name: "Honda",         values: [24, 24, 27, 25, 25], fill: MUTED(54),            ink: ON_DARK },
    { key: "bajaj",  name: "Bajaj Auto",    values: [10, 12, 12, 11, 11], fill: MUTED(40),            ink: ON_DARK },
    { key: "re",     name: "Royal Enfield", values: [4, 5, 5, 5, 5],      fill: MUTED(28),            ink: ON_DARK },
    { key: "others", name: "Others",        values: [14, 11, 8, 13, 13],  fill: "color-mix(in srgb, var(--color-accent) 40%, var(--color-surface))", ink: ON_DARK }
  ];

  // 2. Legend — top of stack first, so it reads in the same order as the bars
  legend.innerHTML = [...series].reverse().map(s =>
    `<li${s.key === "tvs" ? ' class="is-tvs"' : ""} data-key="${s.key}"><span class="TK4R3-sw" style="background:${s.fill}"></span>${s.name}</li>`
  ).join("");

  // 3. Axes
  $("TK4R3-yaxis").innerHTML = [0, 25, 50, 75, 100].map(t => `<span style="bottom:${t}%">${t}%</span>`).join("");
  $("TK4R3-xaxis").innerHTML = periods.map(p => `<div class="TK4R3-xlabel">${p}</div>`).join("");

  // 4. Columns — every segment carries its value
  cols.innerHTML = periods.map((p, i) => `
    <div class="TK4R3-col" data-i="${i}">
      ${series.map(s => `
        <div class="TK4R3-seg TK4R3-seg--${s.key}" data-series="${s.key}" tabindex="0" aria-label="${s.name}, ${p}: ${s.values[i]}%"
             style="flex:${s.values[i]} 1 0;background:${s.fill}">
          <span class="TK4R3-v" style="color:${s.ink}">${s.values[i]}<small>%</small></span>
        </div>`).join("")}
    </div>`).join("");
  // thin marks get a smaller label; only slivers drop it
  const fit = () => cols.querySelectorAll(".TK4R3-seg").forEach(s => {
    s.classList.toggle("is-tight", s.offsetHeight < 15);
    s.classList.toggle("is-tiny", s.offsetHeight < 9);
  });
  fit();
  new ResizeObserver(fit).observe(cols);

  // 5. Focus one series across every bar and in the legend; null clears it
  function setSeries(key) {
    legend.classList.toggle("is-focus", !!key);
    legend.querySelectorAll("li").forEach(l => l.classList.toggle("is-on", l.dataset.key === key));
    cols.querySelectorAll("[data-series]").forEach(el => el.classList.toggle("is-dim", !!key && el.dataset.series !== key));
  }
  legend.addEventListener("pointerover", e => { const li = e.target.closest("li"); if (li) setSeries(li.dataset.key); });
  legend.addEventListener("pointerleave", () => setSeries(null));

  // 6. Tooltip
  function showTip(html, x, y) {
    tip.innerHTML = html;
    const pr = plot.getBoundingClientRect(), tw = tip.offsetWidth, th = tip.offsetHeight;
    let left = x - pr.left + 16;
    if (left + tw > pr.width) left = x - pr.left - tw - 16;
    tip.style.left = Math.max(0, left) + "px";
    tip.style.top = Math.max(0, Math.min(y - pr.top - th / 2, pr.height - th)) + "px";
    tip.classList.add("is-show");
  }
  const tipFor = seg => {
    const i = +seg.parentNode.dataset.i, s = series.find(s => s.key === seg.dataset.series);
    return `<div class="TK4R3-tip-h">${periods[i]}</div>
      <div class="TK4R3-tip-row"><span>${s.name}</span><b>${s.values[i]}<small>%</small></b></div>`;
  };
  function clear() { setSeries(null); tip.classList.remove("is-show"); }

  cols.addEventListener("pointermove", e => {
    const seg = e.target.closest(".TK4R3-seg");
    if (!seg) return clear();
    setSeries(seg.dataset.series);
    showTip(tipFor(seg), e.clientX, e.clientY);
  });
  cols.addEventListener("pointerleave", clear);
  cols.addEventListener("focusin", e => {
    const seg = e.target.closest(".TK4R3-seg");
    if (!seg) return;
    const r = seg.getBoundingClientRect();
    setSeries(seg.dataset.series);
    showTip(tipFor(seg), r.right, r.top + r.height / 2);
  });
  cols.addEventListener("focusout", clear);
});
