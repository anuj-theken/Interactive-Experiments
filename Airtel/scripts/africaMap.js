const chartDom = document.getElementById("africa-map");
const myChart = echarts.init(chartDom);

// Helper function to dynamically grab the CSS variable colors
const getCSSVar = (varName) =>
  getComputedStyle(document.documentElement).getPropertyValue(varName).trim();

// Map your countries dynamically using your updated CSS variables
const airtelCountryColors = {
  Niger: getCSSVar("--land-active-2nd"),
  Nigeria: getCSSVar("--land-active-2nd"),
  Zambia: getCSSVar("--land-active-1st"),
  Malawi: getCSSVar("--land-active-1st"),
  "Democratic Republic of the Congo": getCSSVar("--land-inactive-color"),
  Kenya: getCSSVar("--land-active-2nd"),
  Chad: getCSSVar("--land-active-2nd"),
  Tanzania: getCSSVar("--land-active-1st"),
  Uganda: getCSSVar("--land-active-2nd"),
  Madagascar: getCSSVar("--land-active-2nd"),
  Rwanda: getCSSVar("--land-active-2nd"),
  "Republic of the Congo": getCSSVar("--land-active-1st"),
  Gabon: getCSSVar("--land-active-1st"),
  Seychelles: getCSSVar("--land-active-1st"),
};

fetch(
  "https://raw.githubusercontent.com/apache/echarts-website/asf-site/examples/data/asset/geo/world.json",
)
  .then((response) => response.json())
  .then((worldJson) => {
    echarts.registerMap("world", worldJson);
    const isMobile = window.innerWidth <= 768;
    const option = {
      backgroundColor: getCSSVar("--water-bg-color"),

      tooltip: {
        show: true,
        trigger: "item",
        backgroundColor: "rgba(43, 36, 32, 0.95)",
        borderWidth: 0,
        padding: [8, 12],
        textStyle: {
          color: "#ffffff",
          fontFamily: "Archivo, sans-serif",
          fontSize: 13,
          fontWeight: "500",
        },
        formatter: function (params) {
          return params.name;
        },
      },

      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        containLabel: false,
      },
      xAxis: {
        type: "value",
        min: 0,
        max: 100,
        interval: 10,
        show: true,
        axisLabel: { show: false },
        axisTick: { show: false },
        axisLine: { show: false },
        splitLine: {
          show: true,
          lineStyle: { color: "rgba(164, 137, 114, 0.15)", width: 1 },
        },
        zlevel: 1,
      },
      yAxis: {
        type: "value",
        min: 0,
        max: 100,
        interval: 10,
        show: true,
        axisLabel: { show: false },
        axisTick: { show: false },
        axisLine: { show: false },
        splitLine: {
          show: true,
          lineStyle: { color: "rgba(164, 137, 114, 0.15)", width: 1 },
        },
        zlevel: 1,
      },

      geo: {
        map: "world",
        roam: false,
        zoom: isMobile ? 5 : 3.8,
        center: [16, -2],
        zlevel: 2,
        label: {
          show: true,
          position: "inside",
          color: getCSSVar("--text-main-color"),
          fontFamily: "Archivo, sans-serif",
          fontWeight: "bold",
          fontSize: 10,
          // UPDATED: Added Chad, Gabon, Tanzania, and remaining missing regions to map dictionary
          formatter: function (params) {
            const labelMap = {
              Niger: "Niger",
              Nigeria: "Nigeria",
              Zambia: "Zambia",
              Malawi: "Malawi",
              Kenya: "Kenya",
              Chad: "Chad",
              Gabon: "Gabon",
              Tanzania: "Tanzania",
              Uganda: "Uganda",
              Madagascar: "Madagascar",
              Rwanda: "Rwanda",
              "Republic of the Congo": "Congo",
              "Democratic Republic of the Congo": "DRC",
            };
            return labelMap[params.name] || "";
          },
        },
        itemStyle: {
          areaColor: getCSSVar("--land-inactive-color"),
          borderColor: getCSSVar("--land-border-color"),
          borderWidth: 1.2,
        },
        regions: Object.keys(airtelCountryColors).map((countryName) => ({
          name: countryName,
          itemStyle: {
            areaColor: airtelCountryColors[countryName],
          },
        })),
        emphasis: {
          focus: "none",
          label: {
            show: true,
            color: getCSSVar("--text-main-color"),
          },
          itemStyle: {
            areaColor: function (params) {
              return (
                airtelCountryColors[params.name] ||
                getCSSVar("--land-inactive-color")
              );
            },
          },
        },
      },
      series: [
        {
          type: "map",
          map: "world",
          geoIndex: 0,
          data: Object.keys(airtelCountryColors).map((name) => ({
            name: name,
            value: 1,
          })),
        },
      ],
    };

    myChart.setOption(option);
  })
  .catch((error) =>
    console.error("Error setting up data asset dependencies:", error),
  );

window.addEventListener("resize", () => {
  myChart.resize();
});
