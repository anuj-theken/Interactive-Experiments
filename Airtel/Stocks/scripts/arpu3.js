document.addEventListener("DOMContentLoaded", function () {
  const chartDom = document.getElementById("QW4K4-arpu-chart");
  const myChart = echarts.init(chartDom);

  let lastHoveredIndex = null;

  // Airtel Quarterly Net Profit Data (in thousands)
  const data = [
    { quarter: "Mar 2018", value: 5750 },
    { quarter: "Jun 2018", value: 7043 },
    { quarter: "Sep 2018", value: 7356 },
    { quarter: "Dec 2018", value: 3201 },
    { quarter: "Mar 2019", value: 1072 },
    { quarter: "Jun 2019", value: 28660 },
    { quarter: "Sep 2019", value: 230449 },
    { quarter: "Dec 2019", value: 10353 },
    { quarter: "Mar 2020", value: 52370 },
    { quarter: "Jun 2020", value: 159331 },
    { quarter: "Sep 2020", value: 7632 },
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

  const validValues = data.map((d) => d.value).filter((v) => v !== null);
  const maxValue = Math.max(...validValues);
  const yAxisMax = Math.ceil((maxValue * 1.15) / 10000) * 10000;

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
                { offset: 0, color: "#D70A0D" },
                { offset: 1, color: "#ae0e2f" },
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
                  position: "top",
                  color: labelColor,
                  fontWeight: fontWeight,
                  fontSize: 10,
                  fontFamily: "Archivo, Sans-serif",
                  formatter: function (params) {
                    const v = params.value;
                    if (v === null) return "";
                    if (v >= 1000) return (v / 1000).toFixed(0) + "K";
                    return String(v);
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
      bottom: "5%",
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
        fontSize: 12,
        fontWeight: "600",
        fontFamily: "Archivo, Sans-serif",
        margin: 15,
        interval: 0,
        rotate: 0,
        formatter: function (value) {
          if (value.startsWith("Mar ")) {
            return "FY" + value.split(" ")[1].slice(-2);
          }
          return "";
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
        formatter: function (value) {
          if (Math.abs(value) >= 1000) {
            return (value / 1000).toFixed(0) + "K";
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
