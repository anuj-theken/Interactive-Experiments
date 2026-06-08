(function () {
  // Named initialization function to decouple from instant execution flow
  function initTelecomChart() {
    const chartDom = document.getElementById("QW4K5-chart-container");
    if (!chartDom) return false; // Not ready yet

    // Quick structural failsafe to check if ECharts failed to catch element geometry
    if (chartDom.clientWidth === 0 || chartDom.clientHeight === 0) {
      // Elements inside hidden tabs/modals sometimes report 0 width/height initially
      setTimeout(initTelecomChart, 100);
      return true;
    }

    const myChart = echarts.init(chartDom, null, {
      backgroundColor: "#F9F3E6",
    });

    const rawData = [
      ["2011-12-01", 175.7, "Airtel"],
      ["2011-12-01", 147.8, "Vodafone"],
      ["2011-12-01", 106.4, "Idea/Spice"],
      ["2011-12-01", 150.1, "Reliance"],
      ["2011-12-01", 96.8, "BSNL"],
      ["2011-12-01", 83.5, "Tata"],
      ["2011-12-01", 61.6, "Aircel"],
      ["2011-12-01", 0, "Jio"],
      ["2011-12-01", 0, "Uninor"],
      ["2011-12-01", 72.5, "Others"],
      ["2012-03-01", 181.3, "Airtel"],
      ["2012-03-01", 150.5, "Vodafone"],
      ["2012-03-01", 112.7, "Idea/Spice"],
      ["2012-03-01", 153.1, "Reliance"],
      ["2012-03-01", 98.5, "BSNL"],
      ["2012-03-01", 81.8, "Tata"],
      ["2012-03-01", 62.6, "Aircel"],
      ["2012-03-01", 0, "Jio"],
      ["2012-03-01", 0, "Uninor"],
      ["2012-03-01", 79.0, "Others"],
      ["2013-03-01", 188.2, "Airtel"],
      ["2013-03-01", 152.4, "Vodafone"],
      ["2013-03-01", 121.6, "Idea/Spice"],
      ["2013-03-01", 123.0, "Reliance"],
      ["2013-03-01", 101.2, "BSNL"],
      ["2013-03-01", 66.4, "Tata"],
      ["2013-03-01", 0, "Aircel"],
      ["2013-03-01", 0, "Jio"],
      ["2013-03-01", 0, "Uninor"],
      ["2013-03-01", 0, "Others"],
      ["2014-12-01", 217.2, "Airtel"],
      ["2014-12-01", 178.6, "Vodafone"],
      ["2014-12-01", 150.5, "Idea/Spice"],
      ["2014-12-01", 106.2, "Reliance"],
      ["2014-12-01", 80.3, "BSNL"],
      ["2014-12-01", 66.1, "Tata"],
      ["2014-12-01", 78.6, "Aircel"],
      ["2014-12-01", 0, "Jio"],
      ["2014-12-01", 43.6, "Uninor"],
      ["2014-12-01", 0, "Others"],
      ["2015-03-01", 229.4, "Airtel"],
      ["2015-03-01", 183.9, "Vodafone"],
      ["2015-03-01", 157.8, "Idea/Spice"],
      ["2015-03-01", 0, "Reliance"],
      ["2015-03-01", 93.6, "BSNL"],
      ["2015-03-01", 68.0, "Tata"],
      ["2015-03-01", 0, "Aircel"],
      ["2015-03-01", 0, "Jio"],
      ["2015-03-01", 0, "Uninor"],
      ["2015-03-01", 0, "Others"],
      ["2015-06-01", 234.1, "Airtel"],
      ["2015-06-01", 185.5, "Vodafone"],
      ["2015-06-01", 162.1, "Idea/Spice"],
      ["2015-06-01", 0, "Reliance"],
      ["2015-06-01", 93.3, "BSNL"],
      ["2015-06-01", 63.3, "Tata"],
      ["2015-06-01", 0, "Aircel"],
      ["2015-06-01", 0, "Jio"],
      ["2015-06-01", 0, "Uninor"],
      ["2015-06-01", 0, "Others"],
      ["2015-09-01", 238.7, "Airtel"],
      ["2015-09-01", 188.3, "Vodafone"],
      ["2015-09-01", 166.6, "Idea/Spice"],
      ["2015-09-01", 0, "Reliance"],
      ["2015-09-01", 95.3, "BSNL"],
      ["2015-09-01", 63.7, "Tata"],
      ["2015-09-01", 0, "Aircel"],
      ["2015-09-01", 0, "Jio"],
      ["2015-09-01", 0, "Uninor"],
      ["2015-09-01", 0, "Others"],
      ["2015-12-01", 246.9, "Airtel"],
      ["2015-12-01", 193.7, "Vodafone"],
      ["2015-12-01", 171.9, "Idea/Spice"],
      ["2015-12-01", 0, "Reliance"],
      ["2015-12-01", 97.6, "BSNL"],
      ["2015-12-01", 62.4, "Tata"],
      ["2015-12-01", 0, "Aircel"],
      ["2015-12-01", 0, "Jio"],
      ["2015-12-01", 0, "Uninor"],
      ["2015-12-01", 0, "Others"],
      ["2016-03-01", 254.9, "Airtel"],
      ["2016-03-01", 198.0, "Vodafone"],
      ["2016-03-01", 175.1, "Idea/Spice"],
      ["2016-03-01", 0, "Reliance"],
      ["2016-03-01", 101.1, "BSNL"],
      ["2016-03-01", 61.8, "Tata"],
      ["2016-03-01", 0, "Aircel"],
      ["2016-03-01", 16.0, "Jio"],
      ["2016-03-01", 0, "Uninor"],
      ["2016-03-01", 0, "Others"],
      ["2016-06-01", 259.5, "Airtel"],
      ["2016-06-01", 199.5, "Vodafone"],
      ["2016-06-01", 176.2, "Idea/Spice"],
      ["2016-06-01", 0, "Reliance"],
      ["2016-06-01", 103.7, "BSNL"],
      ["2016-06-01", 61.1, "Tata"],
      ["2016-06-01", 0, "Aircel"],
      ["2016-06-01", 0, "Jio"],
      ["2016-06-01", 0, "Uninor"],
      ["2016-06-01", 0, "Others"],
      ["2016-09-01", 263.7, "Airtel"],
      ["2016-09-01", 200.8, "Vodafone"],
      ["2016-09-01", 178.8, "Idea/Spice"],
      ["2016-09-01", 0, "Reliance"],
      ["2016-09-01", 107.7, "BSNL"],
      ["2016-09-01", 58.8, "Tata"],
      ["2016-09-01", 0, "Aircel"],
      ["2016-09-01", 0, "Jio"],
      ["2016-09-01", 0, "Uninor"],
      ["2016-09-01", 0, "Others"],
      ["2016-12-01", 269.7, "Airtel"],
      ["2016-12-01", 204.8, "Vodafone"],
      ["2016-12-01", 190.5, "Idea/Spice"],
      ["2016-12-01", 0, "Reliance"],
      ["2016-12-01", 110.5, "BSNL"],
      ["2016-12-01", 54.7, "Tata"],
      ["2016-12-01", 0, "Aircel"],
      ["2016-12-01", 72.2, "Jio"],
      ["2016-12-01", 0, "Uninor"],
      ["2016-12-01", 0, "Others"],
      ["2017-03-01", 277.5, "Airtel"],
      ["2017-03-01", 209.2, "Vodafone"],
      ["2017-03-01", 195.4, "Idea/Spice"],
      ["2017-03-01", 0, "Reliance"],
      ["2017-03-01", 114.7, "BSNL"],
      ["2017-03-01", 50.7, "Tata"],
      ["2017-03-01", 0, "Aircel"],
      ["2017-03-01", 108.7, "Jio"],
      ["2017-03-01", 0, "Uninor"],
      ["2017-03-01", 0, "Others"],
      ["2017-06-01", 284.5, "Airtel"],
      ["2017-06-01", 212.1, "Vodafone"],
      ["2017-06-01", 196.3, "Idea/Spice"],
      ["2017-06-01", 0, "Reliance"],
      ["2017-06-01", 117.4, "BSNL"],
      ["2017-06-01", 45.5, "Tata"],
      ["2017-06-01", 0, "Aircel"],
      ["2017-06-01", 123.4, "Jio"],
      ["2017-06-01", 0, "Uninor"],
      ["2017-06-01", 0, "Others"],
      ["2017-09-01", 285.9, "Airtel"],
      ["2017-09-01", 207.6, "Vodafone"],
      ["2017-09-01", 190.2, "Idea/Spice"],
      ["2017-09-01", 0, "Reliance"],
      ["2017-09-01", 118.6, "BSNL"],
      ["2017-09-01", 46.8, "Tata"],
      ["2017-09-01", 0, "Aircel"],
      ["2017-09-01", 138.6, "Jio"],
      ["2017-09-01", 0, "Uninor"],
      ["2017-09-01", 0, "Others"],
    ];

    const brandColors = [
      "#C1D1DF",
      "#5F9EA0",
      "#8A7C92",
      "#A3341F",
      "#4A7A9B",
      "#5C5066",
      "#D1A153",
      "#E84C31",
      "#759F6D",
      "#A3B899",
    ];

    const option = {
      backgroundColor: "#F9F3E6",
      color: brandColors,
      title: {
        text: "Wireless Subscribers Market Evolution",
        subtext: "Hover over the chart to see details",
        left: "center",
        top: "2%",
        textStyle: {
          color: "#170D1D",
          fontWeight: "bold",
          fontSize: 30,
          fontFamily: "sans-serif",
        },
        subtextStyle: {
          color: "#8A7C92",
          opacity: 0.8,
          fontSize: 13,
          fontStyle: "italic",
        },
      },
      tooltip: {
        trigger: "axis",
        backgroundColor: "#170D1D",
        borderColor: "#8A7C92",
        borderWidth: 1,
        textStyle: { color: "#F9F3E6", fontFamily: "sans-serif" },
        axisPointer: {
          type: "line",
          lineStyle: { color: "#8A7C92", width: 2, type: "dashed" },
        },
        formatter: function (params) {
          if (!params || params.length === 0) return "";
          let listHtml = "";
          const rawDate = new Date(params[0].data[0]);
          const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          const dateString =
            months[rawDate.getMonth()] + " " + rawDate.getFullYear();

          listHtml += `<div style="font-weight:bold;margin-bottom:6px;border-bottom:1px solid #8A7C92;padding-bottom:4px;color:#F9F3E6;">${dateString}</div>`;

          params.forEach((item) => {
            const val = item.data[1];
            const name = item.data[2];
            const color = item.color;
            if (val > 0) {
              listHtml += `
                <div style="margin-top:5px;display:flex;align-items:center;gap:8px;justify-content:between;">
                  <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${color};flex-shrink:0;"></span>
                  <span style="color:#C1D1DF;min-width:90px;">${name}:</span>
                  <b style="color:#F9F3E6;margin-left:auto;">${val.toFixed(1)} M</b>
                </div>`;
            }
          });
          return `<div style="font-family:sans-serif;padding:6px 4px;">${listHtml}</div>`;
        },
      },
      legend: {
        top: "14%",
        selectedMode: "multiple",
        itemGap: 18,
        textStyle: { fontWeight: "bold", color: "#170D1D" },
        inactiveColor: "#C1D1DF",
      },
      singleAxis: {
        top: "24%",
        bottom: "12%",
        type: "time",
        axisLine: { lineStyle: { color: "#8A7C92" } },
        axisLabel: {
          color: "#170D1D",
          fontWeight: "bold",
          formatter: function (value) {
            const date = new Date(value);
            const months = [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ];
            return months[date.getMonth()] + " " + date.getFullYear();
          },
        },
        axisPointer: {
          show: true,
          label: {
            show: true,
            backgroundColor: "#170D1D",
            color: "#F9F3E6",
            formatter: (p) => {
              const d = new Date(p.value);
              const months = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ];
              return months[d.getMonth()] + " " + d.getFullYear();
            },
          },
        },
        splitLine: {
          show: true,
          lineStyle: { type: "dashed", color: "#8A7C92", opacity: 0.2 },
        },
      },
      series: [
        {
          type: "themeRiver",
          emphasis: {
            itemStyle: { shadowBlur: 12, shadowColor: "rgba(23,13,29,0.4)" },
          },
          data: rawData,
          label: { show: false },
        },
      ],
    };

    myChart.setOption(option);
    window.addEventListener("resize", () => myChart.resize());
    return true;
  }

  // Attempt absolute immediate layout rendering
  if (!initTelecomChart()) {
    // If element is completely missing from current DOM, watch for context attachment
    const observer = new MutationObserver((mutations, obs) => {
      if (document.getElementById("QW4K5-chart-container")) {
        initTelecomChart();
        obs.disconnect(); // Safely teardown observer memory leaks
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
})();
