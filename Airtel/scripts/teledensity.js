document.addEventListener("DOMContentLoaded", function () {
  const moduleContainer = document.querySelector(
    ".QW4K8-telecom-timeline-module",
  );
  if (!moduleContainer) return;

  const chartDom = moduleContainer.querySelector(".QW4K8-map-container-el");
  const stickyWrapper = moduleContainer.querySelector(
    ".QW4K8-map-sticky-wrapper",
  );
  const myChart = echarts.init(chartDom);

  const timelineDatasets = {
    2003: [
      { name: "Andaman & Nicobar Islands", value: 9.88 },
      { name: "Andhra Pradesh", value: 6.89 },
      { name: "Telangana", value: 6.89 },
      { name: "Assam", value: 1.96 },
      { name: "Bihar", value: 1.61 },
      { name: "Chhattisgarh", value: 1.41 },
      { name: "Delhi", value: 38.32 },
      { name: "Gujarat", value: 9.27 },
      { name: "Dadra & Nagar Haveli", value: 9.27 },
      { name: "Daman & Diu", value: 9.27 },
      { name: "Dadra and Nagar Haveli and Daman and Diu", value: 9.27 },
      { name: "Haryana", value: 7.26 },
      { name: "Himachal Pradesh", value: 9.42 },
      { name: "Jammu & Kashmir", value: 2.76 },
      { name: "Jammu and Kashmir", value: 2.76 },
      { name: "Jharkhand", value: 1.62 },
      { name: "Karnataka", value: 8.5 },
      { name: "Kerala", value: 13.14 },
      { name: "Lakshadweep", value: 13.14 },
      { name: "Madhya Pradesh", value: 3.66 },
      { name: "Maharashtra", value: 11.25 },
      { name: "Goa", value: 11.25 },
      { name: "Arunachal Pradesh", value: 2.85 },
      { name: "Manipur", value: 2.85 },
      { name: "Meghalaya", value: 2.85 },
      { name: "Mizoram", value: 2.85 },
      { name: "Nagaland", value: 2.85 },
      { name: "Tripura", value: 2.85 },
      { name: "Odisha", value: 2.71 },
      { name: "Orissa", value: 2.71 },
      { name: "Punjab", value: 14.67 },
      { name: "Chandigarh", value: 14.67 },
      { name: "Rajasthan", value: 4.04 },
      { name: "Tamil Nadu", value: 9.93 },
      { name: "Puducherry", value: 9.93 },
      { name: "Pondicherry", value: 9.93 },
      { name: "Uttar Pradesh", value: 2.62 },
      { name: "Uttarakhand", value: 4.1 },
      { name: "West Bengal", value: 4.5 },
      { name: "Sikkim", value: 4.5 },
    ],
    2013: [
      { name: "Andhra Pradesh", value: 77.19 },
      { name: "Telangana", value: 77.19 },
      { name: "Assam", value: 46.51 },
      { name: "Bihar", value: 45.72 },
      { name: "Delhi", value: 221.64 },
      { name: "Gujarat", value: 87.23 },
      { name: "Dadra & Nagar Haveli", value: 87.23 },
      { name: "Daman & Diu", value: 87.23 },
      { name: "Dadra and Nagar Haveli and Daman and Diu", value: 87.23 },
      { name: "Haryana", value: 76.44 },
      { name: "Himachal Pradesh", value: 105.39 },
      { name: "Jammu & Kashmir", value: 58.57 },
      { name: "Jammu and Kashmir", value: 58.57 },
      { name: "Karnataka", value: 91.24 },
      { name: "Kerala", value: 96.09 },
      { name: "Lakshadweep", value: 96.09 },
      { name: "Madhya Pradesh", value: 53.55 },
      { name: "Maharashtra", value: 88.56 },
      { name: "Goa", value: 88.56 },
      { name: "Arunachal Pradesh", value: 67.78 },
      { name: "Manipur", value: 67.78 },
      { name: "Meghalaya", value: 67.78 },
      { name: "Mizoram", value: 67.78 },
      { name: "Nagaland", value: 67.78 },
      { name: "Tripura", value: 67.78 },
      { name: "Odisha", value: 60.21 },
      { name: "Orissa", value: 60.21 },
      { name: "Punjab", value: 102.99 },
      { name: "Chandigarh", value: 102.99 },
      { name: "Rajasthan", value: 70.85 },
      { name: "Tamil Nadu", value: 108.17 },
      { name: "Puducherry", value: 108.17 },
      { name: "Pondicherry", value: 108.17 },
      { name: "Uttar Pradesh", value: 56.83 },
      { name: "West Bengal", value: 69.43 },
      { name: "Sikkim", value: 69.43 },
    ],
    2025: [
      { name: "Andhra Pradesh", value: 94.53 },
      { name: "Telangana", value: 94.53 },
      { name: "Assam", value: 73.79 },
      { name: "Bihar", value: 57.23 },
      { name: "Delhi", value: 275.79 },
      { name: "Gujarat", value: 90.55 },
      { name: "Dadra & Nagar Haveli", value: 90.55 },
      { name: "Daman & Diu", value: 90.55 },
      { name: "Dadra and Nagar Haveli and Daman and Diu", value: 90.55 },
      { name: "Haryana", value: 87.38 },
      { name: "Himachal Pradesh", value: 120.37 },
      { name: "Jammu & Kashmir", value: 90.13 },
      { name: "Jammu and Kashmir", value: 90.13 },
      { name: "Karnataka", value: 105.62 },
      { name: "Kerala", value: 119.49 },
      { name: "Lakshadweep", value: 119.49 },
      { name: "Madhya Pradesh", value: 69.35 },
      { name: "Maharashtra", value: 100.81 },
      { name: "Goa", value: 100.81 },
      { name: "Arunachal Pradesh", value: 80.92 },
      { name: "Manipur", value: 80.92 },
      { name: "Meghalaya", value: 80.92 },
      { name: "Mizoram", value: 80.92 },
      { name: "Nagaland", value: 80.92 },
      { name: "Tripura", value: 80.92 },
      { name: "Odisha", value: 80.0 },
      { name: "Orissa", value: 80.0 },
      { name: "Punjab", value: 111.79 },
      { name: "Chandigarh", value: 111.79 },
      { name: "Rajasthan", value: 79.83 },
      { name: "Tamil Nadu", value: 102.27 },
      { name: "Puducherry", value: 102.27 },
      { name: "Pondicherry", value: 102.27 },
      { name: "Uttar Pradesh", value: 66.6 },
      { name: "West Bengal", value: 80.71 },
      { name: "Sikkim", value: 80.71 },
    ],
  };

  const geoJsonUrl =
    "https://gist.githubusercontent.com/jbrobst/56c13bbbf9d97d187fea01ca62ea5112/raw/e388c4cae20aa53cb5090210a42ebb9b765c0a36/india_states.geojson";

  myChart.showLoading();

  fetch(geoJsonUrl)
    .then((response) => response.json())
    .then((geoJson) => {
      myChart.hideLoading();

      geoJson.features.forEach((feature) => {
        if (feature.properties.ST_NM) {
          feature.properties.name = feature.properties.ST_NM;
        }
      });

      echarts.registerMap("IndiaMapQW4K8", geoJson);

      const isMobileView = window.innerWidth <= 800;

      const option = {
        backgroundColor: "transparent",
        animationDurationUpdate: 1000,
        animationEasingUpdate: "cubicInOut",
        tooltip: {
          trigger: "item",
          backgroundColor: "#ffffff",
          borderWidth: 0,
          textStyle: { fontFamily: "Archivo", color: "#000000" },
          extraCssText:
            "box-shadow: 0 4px 12px rgba(0,0,0,0.08); border-radius: 4px;",
          formatter: function (params) {
            if (params.value !== undefined && !isNaN(params.value)) {
              return `<strong>${params.name}</strong><br/>Teledensity: <b>${params.value}%</b>`;
            }
            return `<strong>${params.name}</strong><br/>Data Not Available`;
          },
        },
        visualMap: {
          type: "continuous",
          min: 0,
          max: 150,
          outOfRange: { color: ["#5091E6"] },
          show: false,
          inRange: {
            color: [
              "#B42529", // Deep Red (far right)
              "#D33338", // Bright Red
              "#F4EED1", // Light Cream / Yellow-beige
              "#A8BC7B", // Light Olive Green
              "#6B8A31", // Dark Olive Green (far left)
            ],
          },
        },
        series: [
          {
            name: "Telecom Density Map",
            type: "map",
            map: "IndiaMapQW4K8",
            /* DYNAMIC ADJUSTMENT FIX:
              If mobile viewport, centers map geometric anchor perfectly on-screen.
              Otherwise keeps desktop offset allocation frame setup.
            */
            layoutCenter: isMobileView ? ["50%", "50%"] : ["65%", "50%"],
            layoutSize: isMobileView ? "100%" : "85%",
            aspectScale: 0.85,
            roam: false,
            label: { show: false },
            itemStyle: {
              borderColor: "#FAF8F2",
              areaColor: "#D5D8DC",
              borderWidth: 1.2,
            },
            emphasis: { itemStyle: { areaColor: "#2C3E50" } },
            data: timelineDatasets["2003"],
          },
        ],
      };

      myChart.setOption(option);
      initScrollEffects();
      setupMobileClickListeners();
    })
    .catch((error) => {
      myChart.hideLoading();
      console.error("Layout engine error loaded:", error);
    });

  function initScrollEffects() {
    ScrollTrigger.getAll().forEach((t) => {
      if (t.trigger && moduleContainer.contains(t.trigger)) {
        t.kill();
      }
    });

    const years = ["2003", "2013", "2025"];
    const isMobile = window.innerWidth <= 800;

    if (isMobile) {
      stickyWrapper.classList.remove("QW4K8-is-fixed", "QW4K8-is-bottom");
      updateActiveTimelineYear("2025");
    } else {
      ScrollTrigger.create({
        trigger: moduleContainer,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          if (self.isActive) {
            stickyWrapper.classList.add("QW4K8-is-fixed");
            stickyWrapper.classList.remove("QW4K8-is-bottom");
          } else if (self.progress === 1) {
            stickyWrapper.classList.remove("QW4K8-is-fixed");
            stickyWrapper.classList.add("QW4K8-is-bottom");
          } else {
            stickyWrapper.classList.remove("QW4K8-is-fixed", "QW4K8-is-bottom");
          }
        },
      });

      years.forEach((year) => {
        ScrollTrigger.create({
          trigger: moduleContainer.querySelector(
            `[data-qw4k8-section="${year}"]`,
          ),
          start: "top 45%",
          end: "bottom 45%",
          onToggle: (self) => {
            if (self.isActive) {
              updateActiveTimelineYear(year);
            }
          },
        });
      });
    }
  }

  function setupMobileClickListeners() {
    const years = ["2003", "2013", "2025"];
    years.forEach((year) => {
      const element = moduleContainer.querySelector(
        `[data-qw4k8-year="${year}"]`,
      );
      if (element) {
        element.addEventListener("click", () => {
          if (window.innerWidth <= 800) {
            updateActiveTimelineYear(year);
          }
        });
      }
    });
  }

  function isMobile() {
    return window.innerWidth <= 768;
  }

  function updateActiveTimelineYear(activeYear) {
    const years = ["2003", "2013", "2025"];
    const activeIdx = years.indexOf(activeYear);
    const isMobile = window.innerWidth <= 800;

    myChart.setOption({
      series: [{ data: timelineDatasets[activeYear] }],
    });

    years.forEach((year, idx) => {
      const element = moduleContainer.querySelector(
        `[data-qw4k8-year="${year}"]`,
      );
      if (!element) return;
      element.classList.remove("QW4K8-active", "QW4K8-revealed");

      if (year === activeYear) {
        element.classList.add("QW4K8-active");
      } else if (idx < activeIdx) {
        if (!isMobile) {
          element.classList.add("QW4K8-revealed");
        }
      } else {
        element.style.opacity = isMobile ? "0.35" : "0";
      }
    });
  }

  window.addEventListener("resize", () => {
    if (myChart) {
      const isMobileView = window.innerWidth <= 800;

      // Update map sizing parameters dynamically on runtime screen shifts
      myChart.setOption({
        series: [
          {
            layoutCenter: isMobileView ? ["50%", "50%"] : ["65%", "50%"],
            layoutSize: isMobileView ? "100%" : "85%",
          },
        ],
      });
      myChart.resize();
    }
    initScrollEffects();
  });
});
