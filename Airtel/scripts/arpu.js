document.addEventListener("DOMContentLoaded", function () {
  const chartDom = document.getElementById("arpu-chart");
  const myChart = echarts.init(chartDom);

  let lastHoveredIndex = null;

  // Provided Data
  const data = [
    { year: "FY03", arpu: 1100 },
    { year: "FY04", arpu: 935 },
    { year: "FY05", arpu: 654 },
    { year: "FY06", arpu: 471 },
    { year: "FY07", arpu: 406 },
    { year: "FY08", arpu: 358 },
    { year: "FY09", arpu: 305 },
    { year: "FY10", arpu: 220 },
    { year: "FY11", arpu: 194 },
    { year: "FY12", arpu: 184 },
    { year: "FY13", arpu: 185 },
    { year: "FY14", arpu: 196 },
    { year: "FY15", arpu: 198 },
    { year: "FY16", arpu: 192 },
    { year: "FY17", arpu: 172 },
    { year: "FY18", arpu: 105 },
    { year: "FY19", arpu: 104 },
    { year: "FY20", arpu: 138 },
    { year: "FY21", arpu: 153 },
    { year: "FY22", arpu: 178 },
    { year: "FY23", arpu: 193 },
    { year: "FY24", arpu: 209 },
    { year: "FY25", arpu: 245 },
    { year: "FY26", arpu: 257 },
  ];

  const xData = data.map((item) => item.year);
  const yData = data.map((item) => item.arpu);

  function isMobile() {
    return window.innerWidth <= 1023;
  }

  function getSeriesOption(hoveredIndex = null) {
    const mobileMode = isMobile();

    return [
      {
        name: "ARPU",
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
        barWidth: "75%", // Adjusted from 85% to comfortably fit the new side margins
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
      formatter: "{b}: <b>{c}</b>",
    },
    grid: {
      left: "3%", // Relaxed internal padding slightly (from 1%) for yAxis label separation
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
        fontSize: isMobile() ? 18 : 10,
        fontWeight: "600",
        fontFamily: "Archivo, Sans-serif",
        margin: 15,
        interval: 4,
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
        formatter: "₹{value}",
        fontSize: isMobile() ? 18 : 10,
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
