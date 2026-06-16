document.addEventListener("DOMContentLoaded", function () {
  const chartDom = document.getElementById("QW4K4-arpu-chart");
  const myChart = echarts.init(chartDom);

  let lastHoveredIndex = null;

  // Airtel Quarterly Net Profit Data
  const data = [
    { quarter: "Mar 2018", value: 829 },
    { quarter: "Jun 2018", value: 973 },
    { quarter: "Sep 2018", value: 1188 },
    { quarter: "Dec 2018", value: 862 },
    { quarter: "Mar 2019", value: 1072 },
    { quarter: "Jun 2019", value: -28660 },
    { quarter: "Sep 2019", value: -230449 },
    { quarter: "Dec 2019", value: -10353 },
    { quarter: "Mar 2020", value: -52370 },
    { quarter: "Jun 2020", value: -159331 },
    { quarter: "Sep 2020", value: -7632 },
    { quarter: "Dec 2020", value: 8536 },
    { quarter: "Mar 2021", value: 7592 },
    { quarter: "Jun 2021", value: 2835 },
    { quarter: "Sep 2021", value: 11340 },
    { quarter: "Dec 2021", value: 8295 },
    { quarter: "Mar 2022", value: 20078 },
    { quarter: "Jun 2022", value: 16069 },
    { quarter: "Sep 2022", value: 21452 },
    { quarter: "Dec 2022", value: 15882 },
    { quarter: "Mar 2023", value: 30056 },
    { quarter: "Jun 2023", value: 16125 },
    { quarter: "Sep 2023", value: 13407 },
    { quarter: "Dec 2023", value: 24422 },
    { quarter: "Mar 2024", value: 20716 },
    { quarter: "Jun 2024", value: 41599 },
    { quarter: "Sep 2024", value: 35932 },
    { quarter: "Dec 2024", value: 147812 },
    { quarter: "Mar 2025", value: 110218 },
  ];

  const xData = data.map((item) => item.quarter);
  const yData = data.map((item) => item.value);

  function isMobile() {
    return window.innerWidth <= 768;
  }

  function getSeriesOption(hoveredIndex = null) {
    const mobileMode = isMobile();

    return [
      {
        name: "Net Profit",
        type: "bar",
        data: yData.map((val, idx) => {
          const isNull = val === null;
          const barColor = isNull
            ? "transparent"
            : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: val >= 0 ? "#D70A0D" : "#ae0e2f" },
                { offset: 1, color: val >= 0 ? "#ae0e2f" : "#D70A0D" },
              ]);

          if (mobileMode) {
            return {
              value: val,
              itemStyle: { color: barColor },
              label: { show: false },
            };
          }

          let labelColor = "#C6C0C0";
          let fontWeight = "normal";

          if (hoveredIndex !== null) {
            if (idx >= hoveredIndex - 2 && idx <= hoveredIndex + 2) {
              labelColor = "#1D1B1C";
              fontWeight = "bold";
            }
          }

          return {
            value: val,
            itemStyle: { color: barColor },
            label: isNull
              ? { show: false }
              : {
                  show: true,
                  position: val >= 0 ? "top" : "bottom",
                  color: labelColor,
                  fontWeight: fontWeight,
                  fontSize: 10,
                  fontFamily: "Archivo, Sans-serif",
                  formatter: function (params) {
                    const v = params.value;
                    if (v === null) return "";
                    // Approximates thousands to whole numbers (e.g., 20.7K becomes 21K)
                    if (Math.abs(v) >= 1000) return (v / 1000).toFixed(0) + "K";
                    return v.toFixed(0);
                  },
                },
          };
        }),
        barWidth: "70%",
        emphasis: {
          disabled: !mobileMode,
        },
      },
    ];
  }

  const option = {
    animation: false,
    tooltip: {
      show: isMobile(),
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      backgroundColor: "#1D1B1C",
      textStyle: {
        color: "#F5EFE7",
        fontFamily: "Archivo, Sans-serif",
      },
      formatter: function (params) {
        const p = params[0];
        if (p.value === null) return "";
        return p.name + ": <b>" + p.value.toLocaleString() + "</b>";
      },
    },
    grid: {
      left: "3%",
      right: "3%",
      bottom: "8%",
      top: "20%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: xData,
      axisTick: { show: false },
      axisLine: {
        lineStyle: { color: "#C6C0C0" },
      },
      axisLabel: {
        color: "#1D1B1C",
        fontSize: 11,
        fontWeight: "600",
        fontFamily: "Archivo, Sans-serif",
        margin: 15,
        interval: 0,
        rotate: 0,
        formatter: function (value) {
          const parts = value.split(" ");
          const month = parts[0];
          const year = parts[1].slice(-2);
          const mobileMode = isMobile(); // Check view state dynamically

          let quarter = "";
          if (month === "Jun") quarter = "Q1";
          else if (month === "Sep") quarter = "Q2";
          else if (month === "Dec") quarter = "Q3";
          else if (month === "Mar") quarter = "Q4";

          // --- Mobile Specific Formatting ---
          if (mobileMode) {
            // Show the Fiscal Year label only at the start of the cycle (Q1)
            // This prevents overlapping and keeps the mobile timeline clean
            if (quarter === "Q1") {
              return "FY" + year;
            }
            return ""; // Hide individual quarters on mobile
          }

          // --- Desktop Formatting (Kept original behavior) ---
          if (quarter === "Q1") {
            return quarter + "\n{fy|FY" + year + "}";
          }

          return quarter;
        },
        rich: {
          fy: {
            color: "#9E9A9A",
            fontSize: 10,
            fontWeight: "normal",
            lineHeight: 14,
          },
        },
      },
    },
    yAxis: {
      type: "value",
      splitLine: {
        lineStyle: {
          type: "dashed",
          color: "#C6C0C0",
        },
      },
      axisLabel: {
        color: "#1D1B1C",
        fontFamily: "Archivo, Sans-serif",
        formatter: function (value) {
          if (Math.abs(value) >= 1000) {
            return "₹" + (value / 1000).toFixed(0) + "K"; // Also rounded y-axis labels to whole numbers
          }
          return value;
        },
      },
    },
    series: getSeriesOption(isMobile() ? null : data.length - 1),
  };

  myChart.setOption(option);
  if (!isMobile()) {
    lastHoveredIndex = data.length - 1;
  }

  myChart.on("mouseover", function (params) {
    if (isMobile()) return;
    if (params.componentType === "series") {
      const currentIndex = params.dataIndex;
      if (currentIndex !== lastHoveredIndex) {
        lastHoveredIndex = currentIndex;
        myChart.setOption(
          { series: getSeriesOption(currentIndex) },
          { lazyUpdate: true },
        );
      }
    }
  });

  window.addEventListener("resize", function () {
    const mobileState = isMobile();
    myChart.setOption({
      tooltip: { show: mobileState },
      series: getSeriesOption(mobileState ? null : lastHoveredIndex),
    });
    myChart.resize();
  });
});
