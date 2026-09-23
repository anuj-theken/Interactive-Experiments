// scripts/TK4R7-stocks.js — TK4R7: stock prices rebased to 100 since IPO

document.addEventListener("DOMContentLoaded", function () {
  if (typeof echarts === "undefined" || typeof gsap === "undefined") return;

  gsap.registerPlugin(ScrollTrigger);

  // 1. Tokens — read the design system, never hardcode
  const css = getComputedStyle(document.documentElement);
  const CAT = [1, 2, 3, 4].map((i) => css.getPropertyValue(`--cat-${i}`).trim());
  const INK = css.getPropertyValue("--color-text").trim();
  const MUTED = css.getPropertyValue("--color-muted").trim();
  const RULE = css.getPropertyValue("--color-rule").trim();
  const GRID = css.getPropertyValue("--color-grid").trim();
  const SURFACE = css.getPropertyValue("--color-surface").trim();
  const FONT_BODY = css.getPropertyValue("--font-body").trim() || "Archivo, sans-serif";
  const FONT_MONO = css.getPropertyValue("--font-mono").trim() || "'IBM Plex Mono', monospace";
  const LEGEND_SIZE = css.getPropertyValue("--type-legend").trim() || "14px";

  // 2. Data — series 1..4 assigned in fixed order: TCS, Infosys, Wipro, HCLTech
  const fullYears = [
    "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015",
    "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"
  ];

  // Cumulative index, base 100 in 2006
  const dataTCS = [100, 154, 107, 64, 187, 302, 299, 362, 613, 700, 686, 651, 926, 1217, 1300, 1983, 2407, 2239, 2594, 2882, 2265];
  const dataINFY = [100, 159, 106, 95, 182, 234, 208, 216, 292, 345, 384, 313, 399, 542, 576, 943, 1347, 1216, 1352, 1578, 1419];
  const dataWIPRO = [100, 117, 82, 45, 128, 146, 140, 141, 201, 216, 205, 167, 224, 272, 234, 413, 567, 399, 480, 638, 507];
  const dataHCLTECH = [100, 106, 81, 41, 126, 180, 164, 261, 562, 699, 694, 665, 826, 847, 1007, 1579, 1977, 2115, 3100, 3524, 3584];

  const maxY = Math.ceil(Math.max(...dataTCS, ...dataINFY, ...dataWIPRO, ...dataHCLTECH) * 1.05);

  const categories = ["TCS", "Infosys (INFY)", "Wipro", "HCLTech"];
  const seriesData = { "TCS": dataTCS, "Infosys (INFY)": dataINFY, "Wipro": dataWIPRO, "HCLTech": dataHCLTECH };

  const steps = [
    { revealUntil: 4, markerIdx: 3, yearLabel: "2009" },
    { revealUntil: 12, markerIdx: 11, yearLabel: "2017" },
    { revealUntil: 18, markerIdx: 17, yearLabel: "2023" },
    { revealUntil: 21, markerIdx: 20, yearLabel: "2026" }
  ];

  // 3. DOM references — always use the module prefix
  const wrapper = document.querySelector(".TK4R7-wrapper");
  const chartDom = document.getElementById("TK4R7-chart");
  const textBlocks = document.querySelectorAll(".TK4R7-text-block");
  const legendDom = document.getElementById("TK4R7-legend");
  const legendItemEls = {};

  if (!wrapper || !chartDom) return;

  // 4. Custom HTML legend — chips built once, toggling drives ECharts via dispatchAction
  function buildLegend() {
    if (!legendDom) return;
    legendDom.innerHTML = "";
    categories.forEach((cat, i) => {
      const item = document.createElement("div");
      item.className = "TK4R7-legend-item";
      item.innerHTML = `<span class="TK4R7-legend-chip" style="background:${CAT[i]}"></span>${cat}`;
      item.addEventListener("click", function () {
        myChart.dispatchAction({ type: "legendToggleSelect", name: cat });
      });
      legendDom.appendChild(item);
      legendItemEls[cat] = item;
    });
  }

  // 5. Library init
  const myChart = echarts.init(chartDom);

  function getMarker(val, year, color) {
    return {
      symbol: "circle",
      symbolSize: 8,
      itemStyle: { color: color, borderColor: SURFACE, borderWidth: 2 },
      label: { show: false },
      data: [{ coord: [year, val] }]
    };
  }

  const baseOption = {
    backgroundColor: "transparent",
    // containLabel ignores endLabels, so reserve fixed room on the right for the longest name
    grid: { left: "3%", right: 92, bottom: "6%", top: "8%", containLabel: true },
    legend: { data: categories, show: false },
    tooltip: {
      trigger: "axis",
      backgroundColor: SURFACE,
      borderWidth: 0,
      textStyle: { color: INK, fontFamily: FONT_BODY, fontSize: 14 },
      formatter: function (params) {
        let body = `<div style="font-family:${FONT_MONO};font-size:11px;margin-bottom:4px;color:${MUTED};">YEAR: ${params[0].name}</div>`;
        params.forEach((item) => {
          body += `<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin:2px 0;">
            <span><span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:${item.color};margin-right:6px;"></span>${item.seriesName}:</span>
            <strong style="font-family:${FONT_MONO};color:${INK};">${item.value.toLocaleString("en-IN")}</strong>
          </div>`;
        });
        return body;
      }
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: fullYears,
      axisLine: { lineStyle: { color: INK, width: 1 } },
      axisTick: { lineStyle: { color: RULE } },
      axisLabel: { color: MUTED, fontFamily: FONT_MONO, fontSize: 11 }
    },
    yAxis: {
      type: "value",
      min: 0,
      max: maxY,
      splitLine: { show: true, lineStyle: { color: GRID, type: "solid", width: 1 } },
      axisLabel: { color: MUTED, fontFamily: FONT_MONO, fontSize: 11 }
    },
    series: categories.map((cat, i) => ({
      name: cat,
      type: "line",
      smooth: 0.2,
      symbol: "none",
      lineStyle: { color: CAT[i], width: 2 },
      itemStyle: { color: CAT[i] },
      endLabel: {
        show: true,
        formatter: "{a}",
        color: INK,
        fontFamily: FONT_BODY,
        fontSize: 11
      },
      data: [seriesData[cat][0]]
    }))
  };

  myChart.setOption(baseOption);
  buildLegend();

  myChart.on("legendselectchanged", function (params) {
    categories.forEach((cat) => {
      if (legendItemEls[cat]) legendItemEls[cat].classList.toggle("is-inactive", !params.selected[cat]);
    });
  });

  // 6. Render / animation logic
  let currentStep = -1;

  function updateChartStep(stepIdx) {
    const step = steps[stepIdx];
    if (!step) return;
    const count = step.revealUntil;
    const mIdx = step.markerIdx;
    const year = fullYears[mIdx];

    myChart.setOption({
      series: categories.map((cat, i) => ({
        name: cat,
        data: seriesData[cat].slice(0, count),
        markPoint: getMarker(seriesData[cat][mIdx], year, CAT[i])
      }))
    });
  }

  function setActiveBlock(nextStep) {
    if (nextStep === currentStep) return;
    textBlocks.forEach((block) => {
      const blockStep = parseInt(block.getAttribute("data-step"), 10);
      block.classList.toggle("is-active", blockStep === nextStep);
    });
    updateChartStep(nextStep);
    currentStep = nextStep;
  }

  // 7. Scroll trigger
  ScrollTrigger.create({
    trigger: ".TK4R7-wrapper",
    start: "top top",
    end: "+=3500",
    pin: ".TK4R7-sticky-container",
    scrub: 0.5,
    onUpdate: (self) => {
      let stepIdx = Math.floor(self.progress * steps.length);
      if (stepIdx >= steps.length) stepIdx = steps.length - 1;
      setActiveBlock(stepIdx);
    }
  });

  setActiveBlock(0);

  window.addEventListener("resize", function () {
    myChart.resize();
  });
});
