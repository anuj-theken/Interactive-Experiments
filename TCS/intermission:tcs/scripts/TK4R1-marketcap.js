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

    // Claude-release annotation lives on the TCS series so it doesn't imply a second axis.
    if (isTCS) {
      seriesObj.markLine = {
        symbol: "none",
        silent: true,
        lineStyle: { color: SIGNAL, width: 1, type: "dashed" },
        label: {
          formatter: "Claude released",
          position: "insideEndTop",
          color: SIGNAL,
          fontFamily: FONT_BODY,
          fontSize: 12,
        },
        data: [{ xAxis: "2024" }],
      };
    }

    return seriesObj;
  });

  const option = {
    tooltip: {
      trigger: "axis",
      backgroundColor: SURFACE,
      borderColor: RULE,
      borderWidth: 1,
      textStyle: { color: INK, fontFamily: FONT_BODY, fontSize: 14 },
      valueFormatter: (value) => (value !== null && value !== undefined ? `₹ ${value.toFixed(3)} Trillion` : "–"),
    },
    grid: { left: "0%", right: "3%", bottom: "0%", top: "8%", containLabel: true },
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
      name: "₹ Trillion",
      nameTextStyle: { fontFamily: FONT_BODY, color: MUTED, align: "right" },
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

  window.addEventListener("resize", () => myChart.resize());
});
