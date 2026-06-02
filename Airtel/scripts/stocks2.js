(function () {
  // Updated data based on your specific years and closing prices
  const years = ["2003", "2004", "2005", "2006", "2007", "2008"];
  const airtel = [11.52, 55.78, 95.48, 147.98, 293.79, 355.76];

  const chartDom = document.getElementById("QW4K2-stocks-chart-container");
  const myChart = echarts.init(chartDom);

  // Simple static configuration without animations
  myChart.setOption({
    animation: false, // Disables all entry animations
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      top: "10%",
      containLabel: true,
    },
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      animation: false,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: years,
    },
    yAxis: {
      type: "value",
      min: 0,
      max: 400,
    },
    series: [
      {
        name: "Bharti Airtel",
        type: "line",
        smooth: false,
        lineStyle: { color: "#d70a0d", width: 3 },
        symbol: "circle",
        symbolSize: 8,
        itemStyle: {
          color: "#590b23",
        },
        data: airtel,
      },
    ],
  });

  window.addEventListener("resize", () => myChart.resize());
})();
