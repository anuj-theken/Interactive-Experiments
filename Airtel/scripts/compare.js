(function () {
  let chart;

  const chartData = {
    past: [1.4, 0.57, 0],
    current: [11.4, 1.6, 1.6],
  };

  const labelMapping = {
    Airtel_P: " 1.4 ",
    Airtel_C: " 11.4 ",
    MTN_P: " 0.57",
    MTN_C: " 1.6 ",
    Zain_P: "NA",
    Zain_C: " 1.6 ",
  };

  function getStateOptions(isMobile) {
    const showLabel = !isMobile;

    return {
      past: [
        {
          name: "Airtel_P",
          value: chartData.past[0],
          itemStyle: { color: "#A62B2B", borderRadius: [3, 3, 0, 0] },
          label: {
            show: showLabel,
            position: "top",
            formatter: " 1.4 ",
            fontFamily: "Playfair Display",
            fontSize: 15,
            color: "#A62B2B",
            offset: [0, -8],
          },
        },
        {
          name: "Airtel_C",
          value: 0,
          itemStyle: { color: "#A62B2B", borderRadius: [3, 3, 0, 0] },
          label: { show: false },
        },
        { name: "space1", value: 0, itemStyle: { color: "transparent" } },
        {
          name: "MTN_P",
          value: chartData.past[1],
          itemStyle: { color: "#BA7029", borderRadius: [3, 3, 0, 0] },
          label: {
            show: showLabel,
            position: "top",
            formatter: " 57k Cr",
            fontFamily: "Playfair Display",
            fontSize: 15,
            color: "#BA7029",
            offset: [0, -8],
          },
        },
        {
          name: "MTN_C",
          value: 0,
          itemStyle: { color: "#BA7029", borderRadius: [3, 3, 0, 0] },
          label: { show: false },
        },
        { name: "space2", value: 0, itemStyle: { color: "transparent" } },
        {
          name: "Zain_P",
          value: chartData.past[2],
          itemStyle: { color: "#16527D", borderRadius: [3, 3, 0, 0] },
          label: { show: false },
        },
        {
          name: "Zain_C",
          value: 0,
          itemStyle: { color: "#16527D", borderRadius: [3, 3, 0, 0] },
          label: { show: false },
        },
      ],
      current: [
        {
          name: "Airtel_P",
          value: chartData.past[0],
          itemStyle: { color: "#A62B2B", borderRadius: [3, 3, 0, 0] },
          label: {
            show: showLabel,
            position: "top",
            formatter: " 1.4 ",
            fontFamily: "Playfair Display",
            fontSize: 15,
            color: "#A62B2B",
            offset: [0, -8],
          },
        },
        {
          name: "Airtel_C",
          value: chartData.current[0],
          itemStyle: { color: "#A62B2B", borderRadius: [3, 3, 0, 0] },
          label: {
            show: showLabel,
            position: "top",
            formatter: "11.4 ",
            fontFamily: "Playfair Display",
            fontSize: 15,
            color: "#A62B2B",
            offset: [0, -8],
          },
        },
        { name: "space1", value: 0, itemStyle: { color: "transparent" } },
        {
          name: "MTN_P",
          value: chartData.past[1],
          itemStyle: { color: "#BA7029", borderRadius: [3, 3, 0, 0] },
          label: {
            show: showLabel,
            position: "top",
            formatter: " 0.57",
            fontFamily: "Playfair Display",
            fontSize: 15,
            color: "#BA7029",
            offset: [0, -8],
          },
        },
        {
          name: "MTN_C",
          value: chartData.current[1],
          itemStyle: { color: "#BA7029", borderRadius: [3, 3, 0, 0] },
          label: {
            show: showLabel,
            position: "top",
            formatter: " 1.6 ",
            fontFamily: "Playfair Display",
            fontSize: 15,
            color: "#BA7029",
            offset: [0, -8],
          },
        },
        { name: "space2", value: 0, itemStyle: { color: "transparent" } },
        {
          name: "Zain_P",
          value: chartData.past[2],
          itemStyle: { color: "#16527D", borderRadius: [3, 3, 0, 0] },
          label: { show: false },
        },
        {
          name: "Zain_C",
          value: chartData.current[2],
          itemStyle: { color: "#16527D", borderRadius: [3, 3, 0, 0] },
          label: {
            show: showLabel,
            position: "top",
            formatter: " 1.6 ",
            fontFamily: "Playfair Display",
            fontSize: 15,
            color: "#16527D",
            offset: [0, -8],
          },
        },
      ],
    };
  }

  let currentAnimationState = "past";

  function initChart() {
    const chartDom = document.getElementById("QW4K7-marketCapChart");
    if (!chartDom) return;
    chart = echarts.init(chartDom);

    const isMobile = window.innerWidth <= 768;
    const activeOptions = getStateOptions(isMobile);

    const option = {
      // Speeds up updating transition frames when ScrollTrigger fires
      animationDurationUpdate: 300,
      tooltip: {
        trigger: "item",
        triggerOn: isMobile ? "click" : "mousemove",
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        borderWidth: 0,
        textStyle: { color: "#FAF4EE", fontFamily: "Inter", fontSize: 13 },
        formatter: function (params) {
          if (params.name.includes("space") || params.value === 0) return null;
          return `${labelMapping[params.name] || params.value}`;
        },
      },
      grid: {
        top: isMobile ? "5%" : "15%",
        left: "4%", // Increased slightly to prevent left clipping
        right: "4%",
        bottom: "4%",
        containLabel: true, // Forces layout computations to respect axis label bounding boxes
      },
      xAxis: {
        type: "category",
        data: [
          "Airtel_P",
          "Airtel_C",
          "space1",
          "MTN_P",
          "MTN_C",
          "space2",
          "Zain_P",
          "Zain_C",
        ],
        show: false,
      },
      yAxis: {
        type: "value",
        axisLine: {
          show: !isMobile,
          lineStyle: { color: "#000000", width: 2 },
        },
        axisTick: { show: !isMobile },
        axisLabel: {
          show: !isMobile,
          fontFamily: "Inter",
          fontSize: 12,
          color: "#666666",
          formatter: function (value) {
            return "₹ " + (value > 0 ? value + " Lakh Cr" : value);
          },
        },
        splitLine: { lineStyle: { color: "#DCE1E5", width: 1.5 } },
        max: 12,
        interval: 4,
      },
      series: [
        {
          name: "Market Cap Balance Grid",
          type: "bar",
          barWidth: isMobile ? "50%" : "42px",
          barGap: isMobile ? "10%" : "20%",
          data:
            currentAnimationState === "current"
              ? activeOptions.current
              : activeOptions.past,
        },
      ],
    };

    chart.setOption(option);
  }

  function createScrollAnimations() {
    if (typeof ScrollTrigger === "undefined") return;

    ScrollTrigger.create({
      trigger: ".QW4K7-scroll-track",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const trackElement = document.querySelector(".QW4K7-scroll-track");
        const isMobile = window.innerWidth <= 768;
        const activeOptions = getStateOptions(isMobile);

        if (self.progress >= 0.5) {
          currentAnimationState = "current";
          if (chart)
            chart.setOption({ series: [{ data: activeOptions.current }] });
          if (trackElement) trackElement.classList.add("QW4K7-state-active");

          document.getElementById("QW4K7-airtel-past").style.opacity = "0.3";
          document.getElementById("QW4K7-mtn-past").style.opacity = "0.3";
          document.getElementById("QW4K7-zain-past").style.opacity = "0.3";

          const yearPast = document.getElementById("QW4K7-year-past");
          if (yearPast) yearPast.style.opacity = "0.3";

          const currentElements =
            document.querySelectorAll(".QW4K7-val-current");
          currentElements.forEach((el) => {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
          });

          const yearCurrent = document.getElementById("QW4K7-year-current");
          if (yearCurrent) {
            yearCurrent.style.opacity = "1";
            yearCurrent.style.transform = "translateY(0)";
          }

          const naBox = document.getElementById("QW4K7-na-box");
          if (naBox) {
            naBox.style.opacity = "0";
            naBox.style.transform = "translateX(-50%) scale(0.6)";
          }
        } else {
          currentAnimationState = "past";
          if (chart)
            chart.setOption({ series: [{ data: activeOptions.past }] });
          if (trackElement) trackElement.classList.remove("QW4K7-state-active");

          document.getElementById("QW4K7-airtel-past").style.opacity = "1";
          document.getElementById("QW4K7-mtn-past").style.opacity = "1";
          document.getElementById("QW4K7-zain-past").style.opacity = "1";

          const yearPast = document.getElementById("QW4K7-year-past");
          if (yearPast) yearPast.style.opacity = "1";

          const currentElements =
            document.querySelectorAll(".QW4K7-val-current");
          currentElements.forEach((el) => {
            el.style.opacity = "0";
            el.style.transform = "translateY(15px)";
          });

          const yearCurrent = document.getElementById("QW4K7-year-current");
          if (yearCurrent) {
            yearCurrent.style.opacity = "0";
            yearCurrent.style.transform = "translateY(15px)";
          }

          const naBox = document.getElementById("QW4K7-na-box");
          if (naBox) {
            naBox.style.opacity = "1";
            naBox.style.transform = "translateX(-50%) scale(1)";
          }
        }
      },
    });
  }

  window.addEventListener("DOMContentLoaded", () => {
    initChart();
    createScrollAnimations();

    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        initChart();
        if (chart) chart.resize();
      }, 0);
    });
  });
})();
