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

  // Helper function to format numbers with commas (e.g., 20,444)
  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function isMobile() {
    return window.innerWidth <= 1023;
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
              // Formats the value over the bar with commas
              formatter: function (params) {
                return formatNumber(params.value);
              },
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
        fontSize: 18,
      },
      // Ensures the tooltip matches the comma formatting style
      formatter: function (params) {
        return (
          params[0].name + ": <b>" + formatNumber(params[0].value) + "</b>"
        );
      },
    },
    grid: {
      left: isMobile() ? "3%" : "5%",
      right: isMobile() ? "3%" : "3%",
      bottom: isMobile() ? "10%" : "8%", // Marginally increased to give the two-line X-axis breathing room
      top: isMobile() ? "12%" : "20%",
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
        fontSize: isMobile() ? 18 : 10,
        fontWeight: "600",
        fontFamily: "Archivo, Sans-serif",
        margin: 15,
        interval: 0,
        rotate: 0,
        // Uses ECharts rich text styling to target the FY label line separately
        formatter: function (value) {
          const parts = value.split(" ");
          const month = parts[0];
          const year = parts[1].slice(-2);
          const mobileMode = isMobile();

          if (mobileMode) {
            // On mobile, only display the FY label on March (the start of your data's FY cycle)
            // returning an empty string for other quarters prevents overcrowding.
            return month === "Mar" ? "FY" + year : "";
          } else {
            // Original Desktop Layout
            if (month === "Mar") return "Q1\n{light|FY" + year + "}";
            if (month === "Jun") return "Q2";
            if (month === "Sep") return "Q3";
            if (month === "Dec") return "Q4";
          }
          return value;
        },
        rich: {
          light: {
            color: "#A0A0A0", // Lighter grey for fiscal years
            fontSize: 10,
            fontWeight: "normal",
            lineHeight: 16,
          },
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
        fontSize: isMobile() ? 18 : 10,
        // Formats Y-axis labels with commas (e.g., ₹20,000)
        formatter: function (value) {
          return "₹" + formatNumber(value);
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
      xAxis: {
        // Force the font size and formatter updates on resize
        axisLabel: {
          fontSize: mobileState ? 12 : 32,
        },
      },
      yAxis: {
        axisLabel: {
          fontSize: mobileState ? 12 : 32,
        },
      },
      series: getSeriesOption(mobileState ? null : lastHoveredIndex),
    });

    myChart.resize();
  });
});
