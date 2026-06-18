document.addEventListener("DOMContentLoaded", function () {
  var QW4K6_domTarget = document.getElementById("QW4K6-chart-container");

  if (!QW4K6_domTarget) {
    console.error("Error: QW4K6-chart-container element not found in DOM.");
    return;
  }

  if (typeof echarts === "undefined") {
    console.error("Error: ECharts library failed to load or is missing.");
    QW4K6_domTarget.innerHTML =
      '<p style="color:red; text-align:center; padding-top:100px;">' +
      "Failed to load ECharts library resource. Please ensure you are connected to the internet.</p>";
    return;
  }

  // Measure the exact pixel width of the chart container element
  var containerWidth = QW4K6_domTarget.clientWidth || window.innerWidth;
  var isMobile = containerWidth < 480;

  // Calculate a strict physical pixel width restriction (Container Width minus padding margins)
  var dynamicTextWidth = containerWidth - 40;

  var QW4K6_myChart = echarts.init(QW4K6_domTarget);

  var QW4K6_option = {
    color: ["#b22b27", "#d1544c", "#e49a8f", "#f1e6cc", "#c9d1a3", "#7e9c4c"],
    title: {
      text: "Subscriber growth over the years",
      subtext:
        "The growth in number of subscribers across all telecom operators. (in millions)",
      left: "0%",
      top: "0%",
      textStyle: {
        color: "#423329",
        fontWeight: "normal",
        fontSize: isMobile ? 22 : 36,
        fontFamily: "Reckless, serif",
        width: dynamicTextWidth, // Must be an absolute pixel number for ECharts to execute wrapping
        overflow: "break", // Triggers auto-wrap once text hits the absolute pixel threshold
      },
      subtextStyle: {
        color: "#938e8e",
        fontWeight: "normal",
        fontSize: isMobile ? 14 : 18,
        fontFamily: "Archivo, sans-serif",
        lineHeight: 20,
        width: dynamicTextWidth, // Absolute pixel fallback applied here as well
        overflow: "break",
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: function (params) {
        var relVal = params[0].name;
        var total = 0;
        for (var i = 0; i < params.length; i++) {
          if (params[i].value !== "-" && params[i].value !== undefined) {
            relVal +=
              "<br/>" +
              params[i].marker +
              params[i].seriesName +
              ": <b>" +
              params[i].value +
              "m</b>";
            total += parseFloat(params[i].value);
          }
        }
        relVal +=
          '<br/><hr style="border-top:1px dashed #ccc;"/>Total: <b>' +
          total.toFixed(1) +
          "</b>";
        return relVal;
      },
    },
    legend: {
      data: ["Airtel", "Vodafone", "Idea/Spice", "BSNL", "Tata", "Jio"],
      left: "0%",
      // Gives extra breathing space vertically to clear the multiline wrapped header layout
      top: isMobile ? "145px" : "75px",
      orient: "horizontal",
      icon: "rect",
      itemWidth: 18,
      itemHeight: 12,
      textStyle: {
        color: "#55443a",
        fontSize: 12,
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "5%",
      // Ensures the bar chart begins safely below wrapped mobile titles and legends
      top: isMobile ? "210px" : "130px",
      containLabel: true,
    },
    xAxis: {
      type: "value",
      position: "bottom",
      axisLine: {
        show: true,
        lineStyle: { color: "#666" },
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: "#e0d5cb",
        },
      },
      axisLabel: {
        formatter: "{value}m",
        textStyle: { color: "#444" },
      },
    },
    yAxis: {
      type: "category",
      inverse: true,
      axisLine: {
        show: true,
        lineStyle: { color: "#666" },
      },
      axisTick: { show: false },
      axisLabel: {
        formatter: function (value) {
          var parts = value.split(" ");
          var quarter = parts[0];
          var year = parts[1];

          if (quarter === "Q1" && year) {
            var shortYear = year.substring(2, 4);
            return "{fy|FY" + shortYear + "} " + quarter;
          }
          return quarter;
        },
        textStyle: {
          color: "#333",
          fontSize: 12,
        },
        rich: {
          fy: {
            color: "#999999",
            fontSize: 12,
            fontWeight: "normal",
          },
        },
      },
      data: [
        "Q1 2015",
        "Q2 2015",
        "Q3 2015",
        "Q4 2015",
        "Q1 2016",
        "Q2 2016",
        "Q3 2016",
        "Q4 2016",
        "Q1 2017",
        "Q2 2017",
        "Q3 2017",
      ],
    },
    series: [
      {
        name: "Airtel",
        type: "bar",
        stack: "total",
        barWidth: "75%",
        emphasis: { focus: "series" },
        data: [
          229.4, 234.1, 238.7, 246.9, 254.9, 259.5, 263.7, 269.7, 277.5, 284.5,
          285.9,
        ],
      },
      {
        name: "Vodafone",
        type: "bar",
        stack: "total",
        emphasis: { focus: "series" },
        data: [
          183.9, 185.5, 188.3, 193.7, 198.0, 199.5, 200.8, 204.8, 209.2, 212.1,
          207.6,
        ],
      },
      {
        name: "Idea/Spice",
        type: "bar",
        stack: "total",
        emphasis: { focus: "series" },
        data: [
          157.8, 162.1, 166.6, 171.9, 175.1, 176.2, 178.8, 190.5, 195.4, 196.3,
          190.2,
        ],
      },
      {
        name: "BSNL",
        type: "bar",
        stack: "total",
        emphasis: { focus: "series" },
        data: [
          93.6, 93.3, 95.3, 97.6, 101.1, 103.7, 107.7, 110.5, 114.7, 117.4,
          118.6,
        ],
      },
      {
        name: "Tata",
        type: "bar",
        stack: "total",
        emphasis: { focus: "series" },
        data: [
          68.0, 63.3, 63.7, 62.4, 61.8, 61.1, 58.8, 54.7, 50.7, 45.5, 46.8,
        ],
      },
      {
        name: "Jio",
        type: "bar",
        stack: "total",
        emphasis: { focus: "series" },
        data: ["-", "-", "-", "-", "-", "-", "-", 72.2, 108.7, 123.4, 138.6],
      },
    ],
  };

  QW4K6_myChart.setOption(QW4K6_option);

  window.addEventListener("resize", function () {
    // Re-evaluate parent layout dimensions during active resize operations
    var currentContainerWidth = QW4K6_domTarget.clientWidth;
    var mobileMode = currentContainerWidth < 480;
    var updatedTextWidth = currentContainerWidth - 40;

    QW4K6_myChart.setOption({
      title: {
        textStyle: {
          fontSize: mobileMode ? 22 : 36,
          width: updatedTextWidth,
        },
        subtextStyle: {
          fontSize: mobileMode ? 14 : 18,
          width: updatedTextWidth,
        },
      },
      legend: { top: mobileMode ? "145px" : "75px" },
      grid: { top: mobileMode ? "210px" : "130px" },
    });

    QW4K6_myChart.resize();
  });
});
