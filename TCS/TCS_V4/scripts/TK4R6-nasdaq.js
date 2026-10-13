// scripts/TK4R6-nasdaq.js — TCS revenue vs NASDAQ.
// Chart restored to the original marketcap_nasdaq.html prototype's single
// combo chart (colors, fonts), now plotting cumulative % growth since 1991
// for both series on one shared % axis, with TCS in blue and NASDAQ in amber. Data —
// TK4R6_YEARS / TK4R6_TCS_GROWTH / TK4R6_NASDAQ_GROWTH — comes from
// TK4R6-nasdaq_data.js, loaded before this file.

document.addEventListener("DOMContentLoaded", function () {
  const chartDom = document.getElementById("TK4R6-chart");
  if (!chartDom || typeof echarts === "undefined") return;

  const myChart = echarts.init(chartDom);
  // marker borders match the chart frame, which uses the site background
  const BG = getComputedStyle(document.documentElement).getPropertyValue("--color-bg").trim() || "#f3efe9";

  const measureCtx = document.createElement("canvas").getContext("2d");
  function axisLabelWidth() {
    measureCtx.font = "11px 'Plus Jakarta Sans'";
    return Math.ceil(measureCtx.measureText((3500).toLocaleString("en-IN") + "%").width);
  }

  function getChartOption(cutoffIndex) {
    const visibleTCS = TK4R6_TCS_GROWTH.map((val, idx) => (idx <= cutoffIndex ? val : null));
    const visibleNASDAQ = TK4R6_NASDAQ_GROWTH.map((val, idx) => (idx <= cutoffIndex ? val : null));
    // phones: the 2000–2002 band is too narrow for the full note
    const isNarrow = chartDom.clientWidth < 560;

    return {
      animationDuration: 800,
      animationEasing: "cubicOut",
      backgroundColor: "transparent",
      grid: { top: "15%", left: isNarrow ? 14 : "2%", right: isNarrow ? 14 : "2%", bottom: "10%", containLabel: true },
      tooltip: {
        trigger: "axis",
        backgroundColor: "#12192c",
        borderColor: "#12192c",
        textStyle: { color: "#ffffff", fontFamily: "Plus Jakarta Sans", fontSize: 12 },
        formatter: function (params) {
          if (!params || !params.length) return "";
          const year = params[0].name;
          let html = '<div style="font-weight:bold; margin-bottom:4px; font-family:Lora;">Year ' + year + "</div>";
          params.forEach(function (p) {
            if (p.value !== null && p.value !== undefined) {
              const v = Number(p.value);
              const formatted = (v > 0 ? "+" : "") + v.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "%";
              html += '<div style="color:' + p.color + '; font-size:11px;">' +
                p.seriesName + ": <b>" + formatted + "</b></div>";
            }
          });
          return html;
        }
      },
      xAxis: {
        type: "category",
        data: TK4R6_YEARS,
        boundaryGap: false,
        axisLine: { lineStyle: { color: "#94a3b8", width: 1.5 } },
        axisTick: { show: false },
        axisLabel: { color: "#475569", fontFamily: "Plus Jakarta Sans", fontSize: 11, fontWeight: "600" }
      },
      yAxis: {
        // One shared % axis. Fixed to the full dataset's range (not just
        // what's currently revealed) so the axis never shifts as more of the
        // lines draw in while scrolling.
        type: "value",
        name: "Growth (%)",
        min: 0,
        max: 3500,
        interval: 500,
        // shift the name left by the widest tick label (+ ECharts' 8px label
        // margin) so it starts flush with the axis label column
        nameTextStyle: { color: "#475569", fontFamily: "Plus Jakarta Sans", fontWeight: "bold", fontSize: 11, align: "left", padding: [0, 0, 0, -(axisLabelWidth() + 8)] },
        position: "left",
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { type: "dashed", color: "rgba(148, 163, 184, 0.25)" } },
        axisLabel: {
          color: "#475569",
          fontFamily: "Plus Jakarta Sans",
          fontSize: 11,
          formatter: function (val) { return val.toLocaleString("en-IN") + "%"; }
        }
      },
      series: [
        {
          name: "TCS revenue",
          type: "line",
          smooth: 0.35,
          symbol: "circle",
          symbolSize: 8,
          itemStyle: { color: "#2563eb", borderWidth: 2, borderColor: BG },
          lineStyle: { width: 3.5, color: "#2563eb" },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(37, 99, 235, 0.22)" },
              { offset: 1, color: "rgba(37, 99, 235, 0.02)" }
            ])
          },
          data: visibleTCS
        },
        {
          name: "NASDAQ Composite",
          type: "line",
          smooth: 0.35,
          symbol: "diamond",
          symbolSize: 8,
          itemStyle: { color: "#edd13e", borderWidth: 2, borderColor: "#ffffff" },
          lineStyle: { width: 2.5, color: "#edd13e", type: "dashed" },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(237, 209, 62, 0.20)" },
              { offset: 1, color: "rgba(237, 209, 62, 0.01)" }
            ])
          },
          data: visibleNASDAQ,
          markLine: {
            symbol: "none",
            silent: true,
            lineStyle: { color: "#ff6900", width: 1, type: "dashed" },
            label: { show: false },
            data: cutoffIndex >= 8 ? [{ xAxis: "2000" }] : []
          },
          markArea: {
            silent: true,
            itemStyle: { color: "#ff6900", opacity: 0.08 },
            label: {
              show: true,
              // top of the band: NASDAQ's negative years fill the bottom
              position: "insideTop",
              distance: 8,
              color: "#ff6900",
              fontFamily: "Plus Jakarta Sans",
              fontSize: isNarrow ? 9 : 11,
              lineHeight: isNarrow ? 12 : 15,
              formatter: isNarrow ? "Dot-com\nbust" : "Dot-com bubble bursts"
            },
            data: cutoffIndex >= 8 ? [[{ xAxis: "2000" }, { xAxis: "2002" }]] : []
          }
        }
      ]
    };
  }

  myChart.setOption(getChartOption(3));

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);

  const steps = document.querySelectorAll(".TK4R6-narrative-step");
  const statusDom = document.getElementById("TK4R6-status");

  steps.forEach(function (step) {
    const cutoffIndex = parseInt(step.getAttribute("data-cutoff"), 10);
    const statusMsg = step.getAttribute("data-status");

    ScrollTrigger.create({
      trigger: step,
      start: "top 60%",
      end: "bottom 40%",
      onEnter: function () { activateStep(step, cutoffIndex, statusMsg); },
      onEnterBack: function () { activateStep(step, cutoffIndex, statusMsg); }
    });
  });

  function activateStep(activeStep, cutoffIndex, statusMsg) {
    steps.forEach(function (s) { s.classList.remove("is-active"); });
    activeStep.classList.add("is-active");
    myChart.setOption(getChartOption(cutoffIndex));
    if (statusDom && statusMsg) statusDom.textContent = statusMsg;
  }

  window.addEventListener("resize", function () {
    myChart.resize();
  });

  // axis labels are measured at init; re-measure once the web fonts land so
  // containLabel doesn't clip them
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { myChart.resize(); });
  }
});
