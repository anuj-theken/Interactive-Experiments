(function () {
  let chart;

  const chartData = {
    past: [1.4, 0.57, 0],
    current: [11.4, 1.6, 1.6],
  };

  const labelMapping = {
    Airtel_P: "₹1.4 Lakh Cr",
    Airtel_C: "₹11.4 Lakh Cr",
    MTN_P: "₹0.57 Lakh Cr",
    MTN_C: "₹1.6 Lakh Cr",
    Zain_P: "NA",
    Zain_C: "₹1.6 Lakh Cr",
  };

  function getStateOptions(isMobile) {
    return {
      past: [
        {
          name: "Airtel_P",
          value: chartData.past[0],
          itemStyle: { color: "#A62B2B", borderRadius: [3, 3, 0, 0] },
          label: {
            show: true,
            position: "top",
            formatter: isMobile ? "₹1.4 Lakh Cr" : " 1.4 ",
            fontFamily: "Archivo",
            fontSize: isMobile ? 10 : 18,
            color: "#A62B2B",
            offset: [0, -3],
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
            show: true,
            position: "top",
            formatter: isMobile ? "₹0.57 Lakh Cr" : " 0.57 ",
            fontFamily: "Archivo",
            fontSize: isMobile ? 10 : 18,
            color: "#BA7029",
            offset: [0, -3],
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
            show: true,
            position: "top",
            formatter: isMobile ? "₹1.4 Lakh Cr" : " 1.4 ",
            fontFamily: "Archivo",
            fontSize: isMobile ? 10 : 18,
            color: "#A62B2B",
            offset: [0, -3],
          },
        },
        {
          name: "Airtel_C",
          value: chartData.current[0],
          itemStyle: { color: "#A62B2B", borderRadius: [3, 3, 0, 0] },
          label: {
            show: true,
            position: "top",
            formatter: isMobile ? "₹11.4 Lakh Cr" : "11.4 ",
            fontFamily: "Archivo",
            fontSize: isMobile ? 10 : 18,
            color: "#A62B2B",
            offset: [0, -3],
          },
        },
        { name: "space1", value: 0, itemStyle: { color: "transparent" } },
        {
          name: "MTN_P",
          value: chartData.past[1],
          itemStyle: { color: "#BA7029", borderRadius: [3, 3, 0, 0] },
          label: {
            show: true,
            position: "top",
            formatter: isMobile ? "₹0.57 Lakh Cr" : " 0.57",
            fontFamily: "Archivo",
            fontSize: isMobile ? 10 : 18,
            color: "#BA7029",
            offset: [0, -3],
          },
        },
        {
          name: "MTN_C",
          value: chartData.current[1],
          itemStyle: { color: "#BA7029", borderRadius: [3, 3, 0, 0] },
          label: {
            show: true,
            position: "top",
            formatter: isMobile ? "₹1.6 Lakh Cr" : " 1.6 ",
            fontFamily: "Archivo",
            fontSize: isMobile ? 10 : 18,
            color: "#BA7029",
            offset: [0, -3],
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
            show: true,
            position: "top",
            formatter: isMobile ? "₹1.6 Lakh Cr" : " 1.6 ",
            fontFamily: "Archivo",
            fontSize: isMobile ? 10 : 18,
            color: "#16527D",
            offset: [0, -3],
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
      animationDurationUpdate: 450,
      tooltip: {
        trigger: "item",
        triggerOn: isMobile ? "click" : "mousemove",
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        borderWidth: 0,
        textStyle: { color: "#FAF4EE", fontFamily: "Inter", fontSize: 24 },
        formatter: function (params) {
          if (params.name.includes("space") || params.value === 0) return null;
          return `${labelMapping[params.name] || params.value}`;
        },
      },
      grid: {
        top: isMobile ? "18%" : "15%",
        left: isMobile ? "0%" : "4%",
        right: isMobile ? "0%" : "4%",
        bottom: "4%",
        containLabel: true,
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
          fontSize: isMobile ? 12 : 18,
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
          barWidth: isMobile ? "32px" : "42px",
          barGap: isMobile ? "4px" : "20%",
          itemStyle: {
            fontFamily: "Archivo",
            fontSize: isMobile ? 12 : 16,
          },
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

        const pastElements = document.querySelectorAll(".QW4K7-val-group-past");
        const currentElements = document.querySelectorAll(
          ".QW4K7-val-group-current",
        );

        if (self.progress >= 0.5) {
          if (currentAnimationState !== "current") {
            currentAnimationState = "current";
            if (chart)
              chart.setOption({ series: [{ data: activeOptions.current }] });
            if (trackElement) trackElement.classList.add("QW4K7-state-active");
          }

          // Dim baseline elements according to reference style
          pastElements.forEach((el) => {
            el.style.opacity = "0.2";
          });
          currentElements.forEach((el) => {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
          });

          const naBox = document.getElementById("QW4K7-na-box");
          if (naBox) {
            naBox.style.opacity = "0";
            naBox.style.transform = "translateX(-50%) scale(0.6)";
          }
        } else {
          if (currentAnimationState !== "past") {
            currentAnimationState = "past";
            if (chart)
              chart.setOption({ series: [{ data: activeOptions.past }] });
            if (trackElement)
              trackElement.classList.remove("QW4K7-state-active");
          }

          pastElements.forEach((el) => {
            el.style.opacity = "1";
          });
          currentElements.forEach((el) => {
            el.style.opacity = "0";
            el.style.transform = isMobile
              ? "translateY(4px)"
              : "translateY(15px)";
          });

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
