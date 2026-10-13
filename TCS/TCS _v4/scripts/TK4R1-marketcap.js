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
      textStyle: { color: INK, fontFamily: FONT_BODY, fontSize: phoneQuery.matches ? 11 : 14 },
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

  const measureCanvas = document.createElement("canvas");
  const measureCtx = measureCanvas.getContext("2d");

  // Wraps `text` the same way the box (width `maxWidth`) would, and returns
  // the widest line actually used — so a short line like "Claude released"
  // reports its own width instead of the full box width, letting the arrow
  // start right after the text rather than after empty space.
  function measureMaxLineWidth(text, maxWidth, font) {
    measureCtx.font = font;
    const words = text.split(" ");
    let line = "";
    let maxLine = 0;
    words.forEach((word) => {
      const test = line ? line + " " + word : word;
      if (line && measureCtx.measureText(test).width > maxWidth) {
        maxLine = Math.max(maxLine, measureCtx.measureText(line).width);
        line = word;
      } else {
        line = test;
      }
    });
    maxLine = Math.max(maxLine, measureCtx.measureText(line).width);
    return maxLine;
  }

  function drawAnnotations() {
    const gridRect = myChart.getModel().getComponent("grid").coordinateSystem.getRect();
    const isNarrow = myChart.getWidth() < 560;

    const leftX = gridRect.x + 6;
    const textWidth = Math.max(Math.min(gridRect.width * 0.34, 250), isNarrow ? 100 : 150);
    const fontSize = isNarrow ? 9 : 11;
    const lineHeight = fontSize + 4;
    const charsPerLine = Math.max(textWidth / (fontSize * 0.52), 8);
    const rowGap = 42;
    const font = `${fontSize}px ${FONT_BODY}`;

    const graphics = [];
    let cursorY = gridRect.y + gridRect.height * 0.06;

    ANNOTATIONS.forEach((item, i) => {
      // Each block starts half a block-width further right than the one
      // above it, so the stack reads as a staircase instead of a flush
      // left column — except on narrow phones, where the chart is too
      // tight for that and staggering right would push the longer blocks
      // into the rising data line, so every row stays flush left instead.
      const thisLeft = isNarrow ? leftX : leftX + (textWidth / 2) * i;
      const textTop = cursorY;
      const estLines = Math.ceil(item.text.length / charsPerLine);
      const blockHeight = estLines * lineHeight;
      cursorY = textTop + blockHeight + rowGap;

      const arrowStartY = textTop + lineHeight * 0.6;
      const actualTextWidth = measureMaxLineWidth(item.text, textWidth, font);
      const arrowStartX = thisLeft + actualTextWidth + 6;

      // The arrow lands on the dashed marker (or shaded band) at the same
      // height as its own text row, rather than at the curve's exact value —
      // that's what keeps every leader line perfectly flat. The marker
      // itself (full-height dashed line / band) is what ties the note to
      // its year, the same way it already does visually.
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
        left: thisLeft,
        top: textTop,
        silent: true,
        z: 100,
        style: {
          text: item.text,
          font: `${fontSize}px ${FONT_BODY}`,
          fill: SIGNAL,
          lineHeight: lineHeight,
          width: textWidth,
          overflow: "break",
        },
      });

      graphics.push({
        type: "line",
        id: item.id + "-shaft",
        silent: true,
        z: 100,
        shape: { x1: arrowStartX, y1: arrowStartY, x2: targetX - 6, y2: arrowStartY },
        style: { stroke: SIGNAL, lineWidth: 1, lineDash: [3, 3] },
      });

      graphics.push({
        type: "polygon",
        id: item.id + "-head",
        silent: true,
        z: 100,
        shape: {
          points: [
            [targetX, arrowStartY],
            [targetX - 7, arrowStartY - 3.5],
            [targetX - 7, arrowStartY + 3.5],
          ],
        },
        style: { fill: SIGNAL },
      });
    });

    myChart.setOption({ graphic: { elements: graphics } }, false);
  }

  drawAnnotations();

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
