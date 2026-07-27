// scripts/stocks.js — QW4K6

document.addEventListener("DOMContentLoaded", function () {
  function getColor(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  const itcColor = getColor('--color-primary');
  const niftyColor = getColor('--color-muted');

  const years = [
    "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016",
    "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"
  ];

  const itcData = [
    100, 46.00, 66.67, 59.87, 63.07, 81.75, 92.38, 101.20, 196.05,
    114.60, 97.32, 120.60, 125.54, 124.25, 92.46, 76.88, 76.47, 54.22, 61.40
  ];

  const nifty50Data = [
    100, 55.96, 95.03, 107.17, 101.20, 117.47, 118.53, 171.46, 147.22,
    166.64, 214.65, 210.82, 232.84, 265.40, 337.52, 343.79, 422.89, 457.59, 492.86
  ];

  const steps = [
    { revealUntil: 5, markerAt: 4 },   // 2012
    { revealUntil: 6, markerAt: 5 },   // 2013
    { revealUntil: 10, markerAt: 9 },  // 2017
    { revealUntil: 12, markerAt: 11 }, // 2019
    { revealUntil: 15, markerAt: 14 }, // 2022
    { revealUntil: 18, markerAt: 17 }, // 2025
    { revealUntil: 19, markerAt: 18 }  // 2026
  ];

  const wrapper = document.querySelector(".QW4K6-scroll-wrapper");
  const blocks = Array.from(document.querySelectorAll(".QW4K6-text-block"));
  const chartDom = document.getElementById("QW4K6-main-chart");
  if (!chartDom) return;
  const myChart = echarts.init(chartDom);

  let currentStep = -1;

  function setBlockStyle(el, visible, direction) {
    if (!el) return;
    el.style.opacity = visible ? "1" : "0";
    const ty = visible ? 0 : direction === "down" ? -20 : 20;
    el.style.transform = `translateY(${ty}px)`;
    el.style.pointerEvents = visible ? "auto" : "none";
  }

  function updateChart(stepIdx) {
    const step = steps[stepIdx];
    if (!step) return;

    const revealCount = step.revealUntil;
    const markerIndex = step.markerAt;

    const createMarker = (val, color) => ({
      symbol: "circle",
      symbolSize: 10,
      itemStyle: { color: color, borderWidth: 0 },
      data: [{ coord: [years[markerIndex], val] }],
    });

    myChart.setOption({
      series: [
        {
          name: "ITC",
          data: itcData.slice(0, revealCount),
          markPoint: createMarker(itcData[markerIndex], itcColor),
        },
        {
          name: "Nifty 50",
          data: nifty50Data.slice(0, revealCount),
        },
      ],
    });
  }

  function handleScroll() {
    if (!wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    const scrollFraction = Math.max(
      0,
      Math.min(1, -rect.top / (rect.height - window.innerHeight)),
    );

    let stepIdx = Math.floor(scrollFraction * steps.length);
    if (stepIdx >= steps.length) stepIdx = steps.length - 1;

    if (stepIdx !== currentStep) {
      const direction = stepIdx > currentStep ? "down" : "up";
      if (currentStep !== -1) setBlockStyle(blocks[currentStep], false, direction);
      currentStep = stepIdx;
      setBlockStyle(blocks[currentStep], true, direction);
      updateChart(currentStep);
    }
  }

  // Base layout configuration for the chart
  myChart.setOption({
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
      formatter: function (params) {
        let tooltipText = `<strong>${params[0].name}</strong><br/>`;
        params.forEach((item) => {
          const markerColor = item.seriesName === "ITC" ? itcColor : niftyColor;
          tooltipText += `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${markerColor};"></span>`;
          tooltipText += `${item.seriesName}: <strong>${item.value}</strong><br/>`;
        });
        return tooltipText;
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: years,
    },
    yAxis: {
      type: "value",
      min: 0,
      max: 550,
      splitLine: {
        show: true,
        lineStyle: {
          color: niftyColor,
          width: 1,
          type: "solid",
        },
      },
    },
    series: [
      {
        name: "ITC",
        type: "line",
        smooth: 0.3,
        lineStyle: { color: itcColor, width: 3 },
        itemStyle: { color: itcColor },
        symbol: "none",
        data: [itcData[0]],
      },
      {
        name: "Nifty 50",
        type: "line",
        smooth: 0.3,
        lineStyle: { type: "dashed", color: niftyColor, width: 1.8 },
        itemStyle: { color: niftyColor },
        symbol: "none",
        data: [nifty50Data[0]],
      },
    ],
  });

  // Force initialize Step 0 instantly so it renders before any user interaction
  currentStep = 0;
  setBlockStyle(blocks[0], true, "down");
  updateChart(0);

  // Bind scrolling and resizing handlers
  window.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", () => myChart.resize());
});
