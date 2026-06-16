document.addEventListener("DOMContentLoaded", function () {
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

  // Custom static label dictionary for your highlighted regions
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
          show: false, // No floating tooltip box
        },

        grid: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          containLabel: false,
        },
        xAxis: { show: false },
        yAxis: { show: false },

        geo: {
          map: "world",
          roam: false,
          zoom: isMobile ? 5 : 3.8,
          center: [16, -2],
          zlevel: 2,

          // Global default state for base map (unhighlighted countries)
          label: {
            show: false, // Names hidden by default for non-active countries
          },
          itemStyle: {
            areaColor: getCSSVar("--land-inactive-color"),
            borderColor: getCSSVar("--land-border-color"),
            borderWidth: 1.2,
          },

          // Explicitly map properties per region to separate behavior
          regions: worldJson.features.map((feature) => {
            const countryName = feature.properties.name;
            const isActive = airtelCountryColors.hasOwnProperty(countryName);
            const baseColor = isActive
              ? airtelCountryColors[countryName]
              : getCSSVar("--land-inactive-color");
            const borderColor = getCSSVar("--land-border-color");

            return {
              name: countryName,
              // Setup permanent labels only for the highlighted countries
              label: {
                show: isActive,
                position: "inside",
                color: getCSSVar("--text-main-color"),
                fontFamily: "Archivo, sans-serif",
                fontWeight: "bold",
                fontSize: 10,
                formatter: function () {
                  return labelMap[countryName] || countryName;
                },
              },
              itemStyle: {
                areaColor: baseColor,
                borderColor: borderColor,
                borderWidth: 1.2,
              },
              // Lock down emphasis styles so nothing structural transitions on hover
              emphasis: {
                itemStyle: {
                  areaColor: baseColor,
                  borderColor: borderColor,
                  borderWidth: 1.2,
                },
              },
            };
          }),

          // Global hover rules for unhighlighted countries
          emphasis: {
            focus: "none",
            label: {
              show: true, // Forces unhighlighted names to render strictly on hover
              position: "inside",
              color: getCSSVar("--text-main-color"),
              fontFamily: "Archivo, sans-serif",
              fontWeight: "bold",
              fontSize: 11,
              formatter: function (params) {
                const isActive = airtelCountryColors.hasOwnProperty(
                  params.name,
                );
                // If it's already an active country, its own region configuration handles it.
                // If it's inactive, show the clean country name on hover.
                return !isActive
                  ? params.name
                  : labelMap[params.name] || params.name;
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
});
