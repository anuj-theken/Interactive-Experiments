(function () {
  const years = [
    "2007", // 0
    "2008", // 1
    "2009", // 2
    "2010", // 3 -> Africa
    "2011", // 4
    "2012", // 5
    "2013", // 6 -> New CEO
    "2014", // 7
    "2015", // 8
    "2016", // 9 -> Launching Jio
    "2017", // 10
    "2018", // 11
    "2019", // 12 -> London Stock Exchange
    "2020", // 13
    "2021", // 14
    "2022", // 15
    "2023", // 16
    "2024", // 17
    "2025", // 18
  ];
  const airtel = [
    100, 73.81, 71.53, 74.7, 85.86, 80.04, 74.48, 89.17, 69.56, 83.88, 106.23,
    75.59, 133.39, 149.29, 200.36, 212.56, 324.53, 453.34, 553.38,
  ];

  const nifty50Data = [
    100, 55.96, 95.03, 107.17, 101.2, 117.47, 118.53, 171.46, 147.22, 166.64,
    214.65, 210.82, 232.84, 265.4, 337.52, 343.79, 422.89, 457.59, 492.86,
  ];

  // Steps accurately synchronized with the 5 HTML blocks
  // revealUntil: elements count to slice (index + 1)
  // markerAt: index of the precise target year in the array
  const steps = [
    { revealUntil: 4, markerAt: 3 }, // Block 0: 2010 (Africa)
    { revealUntil: 7, markerAt: 6 }, // Block 1: 2013 (New CEO)
    { revealUntil: 10, markerAt: 9 }, // Block 2: 2016 (Launching Jio)
    { revealUntil: 13, markerAt: 12 }, // Block 3: 2019 (London Stock Exchange)
    { revealUntil: 19, markerAt: 18 }, // Block 4: 2026 Retirement (Renders up to max data year 2025)
  ];

  // Updated selectors to find prefixed elements
  const wrapper = document.querySelector(".QW4K-scroll-wrapper");
  const blocks = Array.from(document.querySelectorAll(".QW4K-text-block"));
  const chartDom = document.getElementById("QW4K-stocks-chart-container");
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
          name: "Bharti Airtel",
          data: airtel.slice(0, revealCount),
          markPoint: createMarker(airtel[markerIndex], "#590b23"),
        },
        {
          name: "Nifty 50",
          data: nifty50Data.slice(0, revealCount),
        },
      ],
    });
  }

  window.addEventListener("scroll", () => {
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
      if (currentStep !== -1)
        setBlockStyle(blocks[currentStep], false, direction);
      currentStep = stepIdx;
      setBlockStyle(blocks[currentStep], true, direction);
      updateChart(currentStep);
    }
  });

  // Initial Chart setup
  myChart.setOption({
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      top: "10%",
      containLabel: true,
    },
    backgroundColor: "transparent",
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", boundaryGap: false, data: years },
    yAxis: { type: "value", min: 0, max: 700 },
    series: [
      {
        name: "Bharti Airtel", // Corrected from Bajaj Auto to match HTML legend
        type: "line",
        smooth: 0.3,
        lineStyle: { color: "#d70a0d", width: 3 },
        symbol: "none",
        data: [airtel[0]],
      },
      {
        name: "Nifty 50",
        type: "line",
        smooth: 0.3,
        lineStyle: { type: "dashed", color: "#590b23", width: 1.8 },
        symbol: "none",
        data: [nifty50Data[0]],
      },
    ],
  });

  window.addEventListener("resize", () => myChart.resize());
})();
