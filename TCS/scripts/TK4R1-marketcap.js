// scripts/TK4R1-marketcap.js — TK4R1
// Requires scripts/TK4R1-marketcap_data.js loaded first (TK4R1_YEARS, TK4R1_RAW_DATA).

document.addEventListener("DOMContentLoaded", function () {
  const chartDom = document.getElementById("TK4R1-chart");
  const legendDom = document.getElementById("TK4R1-legend");
  if (!chartDom || typeof echarts === "undefined") return;

  // Tokens — read the design system, never hardcode
  const css = getComputedStyle(document.documentElement);
  const INK = css.getPropertyValue("--color-text").trim();
  const MUTED = css.getPropertyValue("--color-muted").trim();
  const GRID = css.getPropertyValue("--color-grid").trim();
  const RULE = css.getPropertyValue("--color-rule").trim();
  const SURFACE = css.getPropertyValue("--color-surface").trim();
  const SIGNAL = css.getPropertyValue("--color-signal").trim();
  const FONT_BODY = css.getPropertyValue("--font-body").trim();
  const FONT_MONO = css.getPropertyValue("--font-mono").trim();

  // All 9 companies from the original marketCap.html — exceeds the 6-slot
  // categorical budget, so (per explicit user request to match the original
  // exactly) this uses that file's own per-company palette instead of the
  // site's --cat-* tokens: TCS as the one vibrant standout, everyone else a
  // muted pastel, so TCS still reads as the story's protagonist among 9 lines.
  const companies = ["TCS", "Infosys", "Wipro", "HCLTech", "Tech Mahindra", "LTIMindtree", "Persistent Systems", "Coforge", "Mphasis"];
  const companyColor = {
    "TCS": "#1d4ed8",
    "Infosys": "#fda4af",
    "Wipro": "#cbd5e1",
    "HCLTech": "#fde047",
    "Tech Mahindra": "#c084fc",
    "LTIMindtree": "#86efac",
    "Persistent Systems": "#f9a8d4",
    "Coforge": "#93c5fd",
    "Mphasis": "#d9f99d",
  };

  const myChart = echarts.init(chartDom);

  const phoneQuery = window.matchMedia("(max-width: 768px)");
  function pinnedTooltipPosition(point, params, dom, rect, size) {
    if (!phoneQuery.matches) return null; // desktop: default follow-the-pointer
    const grid = myChart.getModel().getComponent("grid").coordinateSystem.getRect();
    const x = Math.min(grid.x + 8, size.viewSize[0] - size.contentSize[0] - 4);
    return [Math.max(4, x), grid.y + 4];
  }

  const series = companies.map((comp) => {
    const seriesData = TK4R1_RAW_DATA[comp];
    const firstValidIndex = seriesData.findIndex((val) => val !== null);
    const color = companyColor[comp];
    const isTCS = comp === "TCS";

    const seriesObj = {
      name: comp,
      type: "line",
      smooth: 0.2,
      symbol: "circle",
      symbolSize: 8,
      showSymbol: false,
      z: isTCS ? 10 : 2,
      lineStyle: {
        width: isTCS ? 3 : 2,
        opacity: isTCS ? 1 : 0.85,
      },
      data: seriesData,
      color: color,
    };

    if (firstValidIndex > 0) {
      const startYear = TK4R1_YEARS[firstValidIndex];
      const startVal = seriesData[firstValidIndex];
      seriesObj.markPoint = {
        symbol: "circle",
        symbolSize: 10,
        silent: true,
        itemStyle: {
          color: color,
          borderColor: SURFACE,
          borderWidth: 1.5,
        },
        label: { show: false },
        data: [{ coord: [startYear, startVal] }],
      };
    }

    // Annotations live on the TCS series so they don't imply a second axis.
    // The explanatory text is drawn separately (see drawAnnotations below) as
    // left-side callouts with leader-line arrows, so only the bare markers —
    // dashed lines + shaded band — belong to the series definition here.
    if (isTCS) {
      seriesObj.markLine = {
        symbol: "none",
        silent: true,
        lineStyle: { color: SIGNAL, width: 1, type: "dashed" },
        label: { show: false },
        data: [{ xAxis: "2022" }, { xAxis: "2023" }, { xAxis: "2026" }],
      };

      seriesObj.markArea = {
        silent: true,
        itemStyle: { color: SIGNAL, opacity: 0.08 },
        label: { show: false },
        data: [[{ xAxis: "2024" }, { xAxis: "2025" }]],
      };
    }

    return seriesObj;
  });

  const option = {
    tooltip: {
      trigger: "axis",
      confine: true,
      position: pinnedTooltipPosition,
      backgroundColor: SURFACE,
      borderColor: RULE,
      borderWidth: 1,
      textStyle: { color: INK, fontFamily: FONT_BODY, fontSize: phoneQuery.matches ? 11 : 14, fontWeight: 400 },
      padding: phoneQuery.matches ? [6, 8] : 10,
      valueFormatter: (value) => (value !== null && value !== undefined ? `Rs ${value.toFixed(3)} lakh crore` : "–"),
    },
    grid: { left: "1.5%", right: "3%", bottom: "0%", top: "10%", containLabel: true },
    xAxis: {
      type: "category",
      data: TK4R1_YEARS,
      boundaryGap: false,
      axisLine: { lineStyle: { color: MUTED } },
      axisTick: { alignWithLabel: true },
      axisLabel: { fontFamily: FONT_MONO, fontSize: 11, color: MUTED },
    },
    yAxis: {
      type: "value",
      name: "Rs lakh crore",
      nameTextStyle: { fontFamily: FONT_BODY, color: MUTED },
      splitLine: { lineStyle: { color: GRID, type: "dashed" } },
      axisLabel: { fontFamily: FONT_MONO, fontSize: 11, color: MUTED, formatter: "{value}" },
    },
    legend: { data: companies, show: false },
    series: series,
  };

  myChart.setOption(option);

  function buildCustomLegend() {
    legendDom.innerHTML = "";
    companies.forEach((comp) => {
      const item = document.createElement("div");
      item.className = "TK4R1-legend-item";

      const dot = document.createElement("span");
      dot.className = "TK4R1-legend-dot";
      dot.style.backgroundColor = companyColor[comp];

      const label = document.createElement("span");
      label.innerText = comp;
      if (comp === "TCS") label.style.fontWeight = "600";

      item.appendChild(dot);
      item.appendChild(label);

      item.addEventListener("click", () => {
        myChart.dispatchAction({ type: "legendToggleSelect", name: comp });
      });

      legendDom.appendChild(item);
    });
  }

  buildCustomLegend();

  myChart.on("legendselectchanged", function (params) {
    const items = legendDom.querySelectorAll(".TK4R1-legend-item");
    companies.forEach((comp, idx) => {
      if (items[idx]) items[idx].classList.toggle("is-inactive", !params.selected[comp]);
    });
    // Hiding / showing a company changes where the lines are, so re-fit
    // the annotations around the visible ones.
    drawAnnotations();
  });

  // Annotation callouts: text sits in the empty left side of the chart
  // (pre-2011 values are all near zero), with a flat dashed leader-line
  // arrow pointing at the dashed marker/band for the year it refers to.
  // Keeping the text off to the side — rather than inline against the
  // markers — is what keeps this legible at phone widths, where inline
  // labels used to clip.
  const ANNOTATIONS = [
    { id: "chatgpt-released", text: "ChatGPT released", targetYear: "2022" },
    { id: "claude-released", text: "Claude released", targetYear: "2023" },
    {
      id: "tariff-decline",
      text: "Market capitalisation declined in 2024 and 2025 due to uncertainty over US tariffs, fear of a recession in the US, and a reduction in discretionary spending by US companies",
      targetYear: "2024-2025",
    },
    {
      id: "cowork-decline",
      text: "Claude Cowork automation plugins launched in early 2026, resulting in further decline in Indian IT companies’ market capitalisation",
      targetYear: "2026",
    },
  ];

  const BG = css.getPropertyValue("--color-bg").trim();
  const measureCanvas = document.createElement("canvas");
  const measureCtx = measureCanvas.getContext("2d");

  // Word-wraps `text` to `maxWidth`. The resulting lines are handed to
  // ECharts pre-broken, so the block's height and widest line are exact.
  function wrapLines(text, maxWidth, font) {
    measureCtx.font = font;
    const lines = [];
    let line = "";
    text.split(" ").forEach((word) => {
      const test = line ? line + " " + word : word;
      if (line && measureCtx.measureText(test).width > maxWidth) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    });
    lines.push(line);
    const width = Math.max.apply(null, lines.map((l) => measureCtx.measureText(l).width));
    return { lines: lines, count: lines.length, width: width };
  }

  // Highest point (smallest pixel y) any visible series reaches between
  // pixel columns x1 and x2 — i.e. where the text must stay above. Samples
  // every category in range plus the interpolated values at both edges.
  function dataTopBetween(x1, x2) {
    const selected = myChart.getOption().legend[0].selected || {};
    const idxAt = (x) => myChart.convertFromPixel({ xAxisIndex: 0 }, x);
    const i1 = Math.max(0, Math.floor(idxAt(x1)));
    const i2 = Math.min(TK4R1_YEARS.length - 1, Math.ceil(idxAt(x2)));
    let top = Infinity;
    companies.forEach((comp) => {
      if (selected[comp] === false) return;
      const data = TK4R1_RAW_DATA[comp];
      for (let i = i1; i <= i2; i++) {
        if (data[i] === null || data[i] === undefined) continue;
        top = Math.min(top, myChart.convertToPixel({ yAxisIndex: 0 }, data[i]));
      }
    });
    return top;
  }

  // Lays the notes out top-down in the empty upper-left of the plot. Each
  // note takes the widest width (so the fewest lines) whose box stays clear
  // of every line and of the x-axis; if the stack doesn't fit, the caller
  // retries with a smaller font / tighter gaps.
  function layoutAnnotations(gridRect, cfg) {
    const leftX = gridRect.x + 6;
    const lineHeight = cfg.fontSize + 4;
    const font = `${cfg.fontSize}px ${FONT_BODY}`;
    const floorY = gridRect.y + gridRect.height - 4; // keep off the x-axis
    // Leftmost vertical marker (2022): no note may reach it, leaving room
    // for at least a short arrow, so the dashed markers never cross text.
    const markerX = myChart.convertToPixel({ xAxisIndex: 0 }, "2022");
    const placed = [];
    let cursorY = gridRect.y + gridRect.height * 0.05;

    for (let i = 0; i < ANNOTATIONS.length; i++) {
      const item = ANNOTATIONS[i];
      const lefts = cfg.stagger ? [leftX + cfg.stagger * i, leftX] : [leftX];
      let best = null;
      for (const left of lefts) {
        for (let w = cfg.maxWidth; w >= cfg.minWidth; w -= 10) {
          const wrap = wrapLines(item.text, w, font);
          const h = wrap.count * lineHeight;
          const bottom = cursorY + h;
          if (bottom > floorY) continue;
          if (left + wrap.width + 24 > markerX) continue;
          if (bottom + cfg.clearance > dataTopBetween(left, left + wrap.width)) continue;
          best = { item, left, top: cursorY, lines: wrap.lines, textWidth: wrap.width, height: h };
          break;
        }
        if (best) break;
      }
      if (!best) return null;
      placed.push(best);
      cursorY = best.top + best.height + cfg.rowGap;
    }
    return { placed, lineHeight, font, fontSize: cfg.fontSize };
  }

  function drawAnnotations() {
    const gridRect = myChart.getModel().getComponent("grid").coordinateSystem.getRect();
    const isNarrow = myChart.getWidth() < 560;
    const maxWidth = Math.min(gridRect.width * (isNarrow ? 0.62 : 0.4), 320);

    const configs = isNarrow
      ? [
          { fontSize: 9, rowGap: 16, clearance: 8, minWidth: 90, maxWidth },
          { fontSize: 9, rowGap: 10, clearance: 6, minWidth: 80, maxWidth },
          { fontSize: 8, rowGap: 8, clearance: 4, minWidth: 70, maxWidth },
        ]
      : [
          { fontSize: 11, rowGap: 36, clearance: 12, minWidth: 150, maxWidth, stagger: 125 },
          { fontSize: 11, rowGap: 22, clearance: 10, minWidth: 130, maxWidth },
          { fontSize: 10, rowGap: 14, clearance: 6, minWidth: 110, maxWidth },
        ];

    let layout = null;
    for (const cfg of configs) {
      layout = layoutAnnotations(gridRect, cfg);
      if (layout) break;
    }
    // Last resort (very short charts): the tightest config ignoring overlap,
    // still readable thanks to the background halo on the text.
    if (!layout) {
      layout = layoutAnnotations(gridRect, Object.assign({}, configs[configs.length - 1], { clearance: -1e6 }));
    }
    if (!layout) return;

    const graphics = [];
    layout.placed.forEach((p) => {
      const item = p.item;
      const arrowY = p.top + layout.lineHeight * 0.6;
      const arrowStartX = p.left + p.textWidth + 8;

      // The arrow lands on the dashed marker (or shaded band) at the same
      // height as its own text row, which keeps every leader line flat.
      let targetX;
      if (item.targetYear === "2024-2025") {
        const x1 = myChart.convertToPixel({ xAxisIndex: 0 }, "2024");
        const x2 = myChart.convertToPixel({ xAxisIndex: 0 }, "2025");
        targetX = (x1 + x2) / 2;
      } else {
        targetX = myChart.convertToPixel({ xAxisIndex: 0 }, item.targetYear);
      }

      graphics.push({
        type: "text",
        id: item.id + "-text",
        left: p.left,
        top: p.top,
        silent: true,
        z: 100,
        style: {
          text: p.lines.join("\n"),
          font: layout.font,
          fill: SIGNAL,
          // Background-coloured outline so the text stays legible if it
          // ever sits near a line.
          stroke: BG,
          lineWidth: 3,
          lineHeight: layout.lineHeight,
        },
      });

      if (targetX - arrowStartX < 12) return;

      // A solid background-coloured band under the dashed shaft "cuts" the
      // data lines where the arrow crosses them, so the leader reads cleanly.
      graphics.push({
        type: "line",
        id: item.id + "-halo",
        silent: true,
        z: 99,
        shape: { x1: arrowStartX, y1: arrowY, x2: targetX - 6, y2: arrowY },
        style: { stroke: BG, lineWidth: 5, opacity: 0.9 },
      });

      graphics.push({
        type: "line",
        id: item.id + "-shaft",
        silent: true,
        z: 100,
        shape: { x1: arrowStartX, y1: arrowY, x2: targetX - 6, y2: arrowY },
        style: { stroke: SIGNAL, lineWidth: 1, lineDash: [3, 3] },
      });

      graphics.push({
        type: "polygon",
        id: item.id + "-head",
        silent: true,
        z: 100,
        shape: {
          points: [
            [targetX, arrowY],
            [targetX - 7, arrowY - 3.5],
            [targetX - 7, arrowY + 3.5],
          ],
        },
        style: { fill: SIGNAL },
      });
    });

    // Replace (not merge) the graphic layer so ids from a previous layout
    // that no longer draw — e.g. a skipped arrow — are removed.
    myChart.setOption({ graphic: { elements: graphics } }, { replaceMerge: ["graphic"] });
  }

  drawAnnotations();

  // The layout is measured with canvas measureText, so it must be redone once
  // Archivo has loaded — otherwise (typically on phones, where the web font
  // arrives after DOMContentLoaded) the notes are measured in the narrower
  // fallback font and the leader arrows end up overlapping the real text.
  if (document.fonts) {
    document.fonts.load(`10px ${FONT_BODY}`).then(drawAnnotations, function () {});
    document.fonts.ready.then(drawAnnotations);
    document.fonts.addEventListener("loadingdone", drawAnnotations);
  }

  // Tooltip behaviour. A tap never sends a "pointer left", so on touch
  // screens an ECharts tooltip would otherwise stay up indefinitely and ride
  // along over neighbouring sections. It is dismissed after a few seconds,
  // on scroll, on a tap outside the chart, and once the chart leaves view.
  // On phones the tooltip is also pinned to the plot's top-left corner —
  // the empty, low-value side of this chart — instead of following the
  // finger, so it can never run out of frame.
  (function tameTooltip() {
    const noHover = window.matchMedia("(hover: none)");
    let shown = false;
    let hideTimer = null;
    function hideTip() {
      clearTimeout(hideTimer);
      if (!shown) return;
      shown = false;
      myChart.dispatchAction({ type: "hideTip" });
    }
    myChart.on("showTip", function () {
      shown = true;
      clearTimeout(hideTimer);
      if (noHover.matches) hideTimer = setTimeout(hideTip, 3000);
    });
    myChart.on("hideTip", function () { shown = false; clearTimeout(hideTimer); });
    window.addEventListener("scroll", hideTip, { passive: true });
    document.addEventListener("touchstart", function (e) {
      if (!chartDom.contains(e.target)) hideTip();
    }, { passive: true });
    new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) hideTip();
    }).observe(chartDom);
  })();

  window.addEventListener("resize", () => {
    myChart.resize();
    myChart.setOption({
      tooltip: {
        textStyle: { fontSize: phoneQuery.matches ? 11 : 14 },
        padding: phoneQuery.matches ? [6, 8] : 10,
      },
    });
    drawAnnotations();
  });
});
