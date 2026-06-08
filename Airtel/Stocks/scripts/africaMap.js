const chartDom = document.getElementById("africa-map");
const myChart = echarts.init(chartDom);

const airtelCountryColors = {
  Niger: "#fcd4cb",
  Nigeria: "#fcd4cb",
  Zambia: "#8c1d1d",
  Malawi: "#8c1d1d",
  "Democratic Republic of the Congo": "#fbf6f0",
  Kenya: "#fcd4cb",
  Chad: "#fcd4cb",
  Tanzania: "#8c1d1d",
  Uganda: "#fcd4cb",
  Madagascar: "#fcd4cb",
  Rwanda: "#fcd4cb",
  "Republic of the Congo": "#8c1d1d",
  Gabon: "#8c1d1d",
  Seychelles: "#8c1d1d",
};

fetch(
  "https://raw.githubusercontent.com/apache/echarts-website/asf-site/examples/data/asset/geo/world.json",
)
  .then((response) => response.json())
  .then((worldJson) => {
    echarts.registerMap("world", worldJson);
    const isMobile = window.innerWidth <= 768;
    const option = {
      backgroundColor: "#ededed",

      tooltip: {
        show: true,
        trigger: "item",
        backgroundColor: "rgba(23, 23, 23, 0.95)",
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
          lineStyle: { color: "#dbdbdb", width: 1.2 },
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
          lineStyle: { color: "#dbdbdb", width: 1.2 },
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
          color: "#333333",
          fontFamily: "Archivo, sans-serif",
          fontWeight: "bold",
          fontSize: 10,
          formatter: function (params) {
            const labelMap = {
              Niger: "Niger",
              Nigeria: "Nigeria",
              Zambia: "Zambia",
              Malawi: "Malawi",
              Kenya: "Kenya",
              "Democratic Republic of the Congo": "DRC",
            };
            return labelMap[params.name] || "";
          },
        },
        itemStyle: {
          areaColor: "#fbf6f0",
          borderColor: "#c7bdaf",
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
            color: "#333333",
          },
          itemStyle: {
            areaColor: function (params) {
              return airtelCountryColors[params.name] || "#fbf6f0";
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
