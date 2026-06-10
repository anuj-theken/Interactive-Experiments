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

  var QW4K6_myChart = echarts.init(QW4K6_domTarget);

  var QW4K6_option = {
    color: ["#2b5c8f", "#a1d0ec", "#4b92c4", "#9c3d63", "#e68ca4", "#adc685"],
    title: [
      {
        text: "Subscriber growth over the years",
        left: "left",
        top: "0%",
        textStyle: {
          color: "#423329",
          fontWeight: "normal",
          // Scaled down font size slightly for better mobile compatibility
          fontSize: window.innerWidth < 480 ? 24 : 36,
          fontFamily: "Reckless, serif",
        },
      },
      {
        text: "The growth in number of subscribers across all telecom operators. (in Millions)",
        left: "left",
        // Absolute positioning works better across screen sizes than percentages
        top: window.innerWidth < 480 ? "40px" : "45px",
        textStyle: {
          color: "#66554b",
          fontWeight: "normal",
          fontSize: 13,
        },
      },
    ],
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
              "M</b>";
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
      // Dynamically pushes legend down if text wraps on small devices
      top: window.innerWidth < 480 ? "85px" : "75px",
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
      // Changed from 22% to an absolute pixel value to guarantee title safety
      top: window.innerWidth < 480 ? "150px" : "130px",
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
        formatter: "{value}M",
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
        textStyle: {
          color: "#333",
          fontSize: 12,
        },
      },
      // FIXED: Added missing 12th label to match the 12 items in your data series
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
        "Q4 2017",
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
          229.4,
          234.1,
          238.7,
          246.9,
          254.9,
          259.5,
          263.7,
          269.7,
          277.5,
          284.5,
          285.9,
          290.0, // Added rough placeholder or ensure data array lengths match yAxis length
        ],
      },
      {
        name: "Vodafone",
        type: "bar",
        stack: "total",
        emphasis: { focus: "series" },
        data: [
          183.9, 185.5, 188.3, 193.7, 198.0, 199.5, 200.8, 204.8, 209.2, 212.1,
          207.6, 205.0,
        ],
      },
      {
        name: "Idea/Spice",
        type: "bar",
        stack: "total",
        emphasis: { focus: "series" },
        data: [
          157.8, 162.1, 166.6, 171.9, 175.1, 176.2, 178.8, 190.5, 195.4, 196.3,
          190.2, 188.0,
        ],
      },
      {
        name: "BSNL",
        type: "bar",
        stack: "total",
        emphasis: { focus: "series" },
        data: [
          93.6, 93.3, 95.3, 97.6, 101.1, 103.7, 107.7, 110.5, 114.7, 117.4,
          118.6, 120.0,
        ],
      },
      {
        name: "Tata",
        type: "bar",
        stack: "total",
        emphasis: { focus: "series" },
        data: [
          68.0, 63.3, 63.7, 62.4, 61.8, 61.1, 58.8, 54.7, 50.7, 45.5, 46.8,
          44.0,
        ],
      },
      {
        name: "Jio",
        type: "bar",
        stack: "total",
        emphasis: { focus: "series" },
        data: [
          "-",
          "-",
          "-",
          "-",
          16.0,
          "-",
          "-",
          72.2,
          108.7,
          123.4,
          138.6,
          150.0,
        ],
      },
    ],
  };

  QW4K6_myChart.setOption(QW4K6_option);

  window.addEventListener("resize", function () {
    QW4K6_myChart.resize();
  });
});
