document.addEventListener("DOMContentLoaded", function () {
  const chartDom = document.getElementById("QW4K3-arpu-chart");
  const myChart = echarts.init(chartDom);

  let lastHoveredIndex = null;

  // Updated Quarterly Data Format
  const data = [
    { quarter: "Mar 2010", value: 20444 },
    { quarter: "Jun 2010", value: 16816 },
    { quarter: "Sep 2010", value: 16612 },
    { quarter: "Dec 2010", value: 13033 },
    { quarter: "Mar 2011", value: 14007 },
    { quarter: "Jun 2011", value: 12152 },
    { quarter: "Sep 2011", value: 10270 },
    { quarter: "Dec 2011", value: 10113 },
    { quarter: "Mar 2012", value: 10059 },
    { quarter: "Jun 2012", value: 7622 },
    { quarter: "Sep 2012", value: 7212 },
    { quarter: "Dec 2012", value: 2837 },
    { quarter: "Mar 2013", value: 5086 },
  ];

  // Dynamic max cap logic handles property changes cleanly
  const maxValue = Math.max(...data.map((d) => d.value));
  const yAxisMax = Math.ceil((maxValue * 1.2) / 1000) * 1000;

  const xData = data.map((item) => item.quarter);
  const yData = data.map((item) => item.value);

  function isMobile() {
    return window.innerWidth <= 768;
  }

  function getSeriesOption(hoveredIndex = null) {
    const mobileMode = isMobile();

    return [
      {
        name: "Value",
        type: "bar",
        data: yData.map((val, idx) => {
          if (mobileMode) {
            return {
              value: val,
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
            label: {
              show: true,
              position: "top",
              color: labelColor,
              fontWeight: fontWeight,
              fontSize: 11,
              fontFamily: "Archivo, Sans-serif",
              formatter: "{c}",
            },
          };
        }),
        barWidth: "75%",
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#D70A0D" },
            { offset: 1, color: "#ae0e2f" },
          ]),
        },
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
      formatter: "{b}: <b>{c}</b>",
    },
    grid: {
      left: "3%",
      right: "3%",
      bottom: "5%",
      top: "20%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: xData,
      axisTick: {
        show: false,
      },
      axisLine: {
        lineStyle: {
          color: "#C6C0C0",
        },
      },
      axisLabel: {
        color: "#1D1B1C",
        fontSize: 12,
        fontWeight: "600",
        fontFamily: "Archivo, Sans-serif",
        margin: 15,
        interval: 0, // Tells ECharts to check every single data point
        rotate: 0, // Changed from 35 to 0 since short text looks cleaner horizontally
        formatter: function (value) {
          // Checks if the label is a March quarter, and extracts the last 2 digits of the year
          if (value.startsWith("Mar ")) {
            return "FY" + value.split(" ")[1].slice(-2);
          }
          return ""; // Hides all other quarterly labels
        },
      },
    },
    yAxis: {
      type: "value",
      max: yAxisMax,
      splitLine: {
        lineStyle: {
          type: "dashed",
          color: "#C6C0C0",
        },
      },
      axisLabel: {
        color: "#1D1B1C",
        fontFamily: "Archivo, Sans-serif",
        formatter: "₹{value}",
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
          {
            series: getSeriesOption(currentIndex),
          },
          { lazyUpdate: true },
        );
      }
    }
  });

  window.addEventListener("resize", function () {
    const mobileState = isMobile();

    myChart.setOption({
      tooltip: {
        show: mobileState,
      },
      series: getSeriesOption(mobileState ? null : lastHoveredIndex),
    });

    myChart.resize();
  });
});
