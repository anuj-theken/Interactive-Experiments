// scripts/TK4R10-capex.js — TK4R10
// Restored to match the original capex.html prototype's own visualization
// verbatim (dual-axis combo: revenue bars + capex-ratio line + FY27
// dashed/dotted projection), per explicit user request — a deliberate
// exception to the site's one-axis / design-token color rules for this
// module only.

document.addEventListener("DOMContentLoaded", function () {
  // 1. Data — verbatim from capex.html
  const years = [
    "FY11", "FY12", "FY13", "FY14", "FY15", "FY16", "FY17",
    "FY18", "FY19", "FY20", "FY21", "FY22", "FY23", "FY24",
    "FY25", "FY26", "FY27"
  ];

  const revenueData = [
    37325, 48894, 62990, 81809, 94648, 108646, 117966,
    123104, 146463, 156949, 164177, 191754, 225458, 240893,
    255324, 267021,
    null // FY27: no revenue bar — only the capex-ratio projection is shown
  ];

  const ratioHistorical = [
    0.0, 2.6, 2.8, 2.7, 1.3, 0.2, 0.0,
    -0.1, 0.0, 0.2, 0.1, 0.0, -0.2, -0.2,
    0.7, 0.5, null
  ];

  const ratioDottedProjection = [
    null, null, null, null, null, null, null,
    null, null, null, null, null, null, null,
    null, 0.5, 2.0
  ];

  // Revenue is stored in Rs crore; displayed in Rs lakh crore (1 lakh crore = 100,000 crore).
  const REVENUE_SERIES = "Revenue (Rs lakh crore)";
  const RATIO_SERIES = "Capex Ratio (%)";
  const PROJECTION_SERIES = "FY27 Target Projection";
  const BAR_COLOR = "#6366f1";
  const LINE_COLOR = "#d97706";

  const numberFormatter = function (val) {
    if (val === null || val === undefined) return "N/A";
    return "Rs " + (val / 100000).toFixed(2) + " lakh crore";
  };

  const percentFormatter = function (val) {
    if (val === null || val === undefined) return "N/A";
    return val.toFixed(1) + "%";
  };

  // 2. DOM references
  const chartDom = document.getElementById("TK4R10-chart");
  const legendDom = document.getElementById("TK4R10-legend");
  if (!chartDom || typeof echarts === "undefined") return;
  // HTML legend (instead of ECharts' built-in one) so the two ratio series
  // read as a solid line and a dotted line rather than filled squares.
  if (legendDom) {
    legendDom.innerHTML =
      '<span class="TK4R10-legend-item"><span class="TK4R10-legend-bar"></span>' + REVENUE_SERIES + "</span>" +
      '<span class="TK4R10-legend-item"><span class="TK4R10-legend-line"></span>' + RATIO_SERIES + "</span>" +
      '<span class="TK4R10-legend-item"><span class="TK4R10-legend-line TK4R10-legend-line--dotted"></span>' + PROJECTION_SERIES + "</span>";
  }

  // 3. Library init
  const chart = echarts.init(chartDom);

  function getOption() {
    const textColor = "#475569";
    const gridBorderColor = "#f1f5f9";

    return {
      animationDuration: 800,
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
          shadowStyle: { color: "rgba(0, 0, 0, 0.02)" }
        },
        backgroundColor: "rgba(255, 255, 255, 0.98)",
        borderColor: "#e2e8f0",
        borderWidth: 1,
        textStyle: { color: "#0f172a", fontSize: 12 },
        padding: [10, 14],
        extraCssText: "box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08); border-radius: 8px;",
        formatter: function (params) {
          let header = '<div style="font-weight:700;border-bottom:1px solid #f1f5f9;padding-bottom:4px;margin-bottom:6px;">' +
            params[0].axisValue + (params[0].axisValue === "FY27" ? " (Forecast)" : "") + "</div>";
          let content = "";
          const seenSeries = new Set();

          params.forEach(function (param) {
            let value = param.value;
            if (typeof value === "object" && value !== null) value = value.value;
            if (value === null || value === undefined) return;

            let seriesLabel = param.seriesName;
            if (param.seriesName !== REVENUE_SERIES) seriesLabel = "Capex Ratio";
            if (seenSeries.has(seriesLabel)) return;
            seenSeries.add(seriesLabel);

            const isRevenue = param.seriesName === REVENUE_SERIES;
            const formattedVal = isRevenue ? numberFormatter(value) : percentFormatter(value);
            const dotColor = isRevenue ? BAR_COLOR : LINE_COLOR;

            content += '<div style="display:flex;align-items:center;justify-content:space-between;gap:16px;padding:2px 0;">' +
              '<span style="display:flex;align-items:center;gap:6px;">' +
              '<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:' + dotColor + ';"></span>' +
              '<span style="font-size:12px;color:#64748b;">' + seriesLabel + ':</span></span>' +
              '<span style="font-weight:600;font-size:12px;">' + formattedVal + "</span></div>";
          });
          return header + content;
        }
      },
      grid: { left: "2%", right: "2%", bottom: "4%", top: "8%", containLabel: true },
      xAxis: [
        {
          type: "category",
          data: years,
          axisPointer: { type: "shadow" },
          axisLine: { lineStyle: { color: "#cbd5e1" } },
          axisTick: { alignWithLabel: true },
          axisLabel: {
            color: textColor,
            fontSize: 11,
            margin: 12,
            formatter: function (value) { return value === "FY27" ? "{forecast|FY27*}" : value; },
            rich: { forecast: { color: "#d97706", fontWeight: "bold" } }
          }
        }
      ],
      yAxis: [
        {
          type: "value",
          name: REVENUE_SERIES,
          nameTextStyle: { color: textColor, fontSize: 11, align: "left", padding: [0, 0, 0, -24] },
          position: "left",
          splitLine: { lineStyle: { color: gridBorderColor, type: "dashed" } },
          axisLabel: {
            color: textColor,
            fontSize: 11,
            formatter: function (value) { return value === 0 ? "0" : (value / 100000).toFixed(1); }
          }
        },
        {
          type: "value",
          name: RATIO_SERIES,
          nameTextStyle: { color: textColor, fontSize: 11, padding: [0, 10, 0, 0] },
          position: "right",
          min: -1.0,
          max: 6.0,
          splitLine: { show: false },
          axisLabel: { color: textColor, fontSize: 11, formatter: "{value}%" }
        }
      ],
      series: [
        {
          name: REVENUE_SERIES,
          type: "bar",
          yAxisIndex: 0,
          barMaxWidth: 36,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#6366f1" },
              { offset: 1, color: "#4f46e5" }
            ]),
            borderRadius: [4, 4, 0, 0]
          },
          emphasis: { itemStyle: { color: "#4338ca" } },
          data: revenueData
        },
        {
          name: RATIO_SERIES,
          type: "line",
          yAxisIndex: 1,
          smooth: false,
          symbol: "circle",
          symbolSize: 7,
          itemStyle: { color: "#d97706", borderWidth: 0 },
          lineStyle: { width: 3, color: "#d97706", type: "solid" },
          data: ratioHistorical
        },
        {
          name: PROJECTION_SERIES,
          type: "line",
          yAxisIndex: 1,
          smooth: false,
          connectNulls: true,
          symbol: "circle",
          symbolSize: 8,
          itemStyle: { color: "#d97706", borderWidth: 0 },
          lineStyle: { width: 3, color: "#d97706", type: "dotted" },
          data: ratioDottedProjection
        }
      ]
    };
  }

  chart.setOption(getOption());
  window.addEventListener("resize", function () { chart.resize(); });
});
