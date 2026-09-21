// scripts/TK4R6-nasdaq.js — TCS revenue vs NASDAQ.
// Chart restored to the original marketcap_nasdaq.html prototype's single
// dual-axis combo chart verbatim (colors, fonts, both y-axes) — a deliberate,
// user-requested exception to the site's "no second axis" chart rule and
// design tokens for this module only. Data — TK4R6_YEARS / TK4R6_TCS_REVENUE /
// TK4R6_NASDAQ — comes from TK4R6-nasdaq_data.js, loaded before this file.

document.addEventListener("DOMContentLoaded", function () {
  const chartDom = document.getElementById("TK4R6-chart");
  if (!chartDom || typeof echarts === "undefined") return;

  const myChart = echarts.init(chartDom);

  function getChartOption(cutoffIndex) {
    const visibleTCS = TK4R6_TCS_REVENUE.map((val, idx) => (idx <= cutoffIndex ? val : null));
    const visibleNASDAQ = TK4R6_NASDAQ.map((val, idx) => (idx <= cutoffIndex ? val : null));

    return {
      animationDuration: 800,
      animationEasing: "cubicOut",
      backgroundColor: "transparent",
      grid: { top: "15%", left: "2%", right: "2%", bottom: "10%", containLabel: true },
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
              const formatted = Number(p.value).toLocaleString("en-IN");
              const prefix = p.seriesName === "TCS Revenue" ? "Rs " : "^";
              const suffix = p.seriesName === "TCS Revenue" ? " M" : " pts";
              html += '<div style="color:' + p.color + '; font-size:11px;">' +
                p.seriesName + ": <b>" + prefix + formatted + suffix + "</b></div>";
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
      yAxis: [
        {
          // Left axis: TCS Revenue. Fixed to the full dataset's range (not
          // just what's currently revealed) so the axis never shifts as more
          // of the line draws in while scrolling.
          type: "value",
          name: "TCS (Rs Million)",
          min: 0,
          max: 55000,
          nameTextStyle: { color: "#b45309", fontFamily: "Plus Jakarta Sans", fontWeight: "bold", fontSize: 11 },
          position: "left",
          axisLine: { show: true, lineStyle: { color: "#edd13e", width: 2 } },
          axisTick: { show: false },
          splitLine: { lineStyle: { type: "dashed", color: "rgba(148, 163, 184, 0.25)" } },
          axisLabel: {
            color: "#854d0e",
            fontFamily: "Plus Jakarta Sans",
            fontSize: 11,
            formatter: function (val) { return val >= 1000 ? (val / 1000).toFixed(0) + "k" : val; }
          }
        },
        {
          // Right axis: NASDAQ Composite. Same fixed-range treatment.
          type: "value",
          name: "NASDAQ Composite",
          min: 0,
          max: 4500,
          nameTextStyle: { color: "#1e40af", fontFamily: "Plus Jakarta Sans", fontWeight: "bold", fontSize: 11 },
          position: "right",
          axisLine: { show: true, lineStyle: { color: "#2563eb", width: 2 } },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: {
            color: "#1e40af",
            fontFamily: "Plus Jakarta Sans",
            fontSize: 11,
            formatter: function (val) { return val.toLocaleString(); }
          }
        }
      ],
      series: [
        {
          name: "TCS Revenue",
          type: "line",
          yAxisIndex: 0,
          smooth: 0.35,
          symbol: "circle",
          symbolSize: 8,
          itemStyle: { color: "#edd13e", borderWidth: 2, borderColor: "#12192c" },
          lineStyle: { width: 3.5, color: "#edd13e" },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(237, 209, 62, 0.28)" },
              { offset: 1, color: "rgba(237, 209, 62, 0.02)" }
            ])
          },
          data: visibleTCS
        },
        {
          name: "NASDAQ Composite",
          type: "line",
          yAxisIndex: 1,
          smooth: 0.35,
          symbol: "diamond",
          symbolSize: 8,
          itemStyle: { color: "#2563eb", borderWidth: 2, borderColor: "#ffffff" },
          lineStyle: { width: 2.5, color: "#2563eb", type: "dashed" },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(37, 99, 235, 0.15)" },
              { offset: 1, color: "rgba(37, 99, 235, 0.01)" }
            ])
          },
          data: visibleNASDAQ
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
});
