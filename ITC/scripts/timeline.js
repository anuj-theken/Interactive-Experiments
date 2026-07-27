// scripts/timeline.js — QW4K8

document.addEventListener("DOMContentLoaded", () => {
  function getColor(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  const primaryColor = getColor('--color-primary');
  const bgColor = getColor('--color-bg');
  const mutedColor = getColor('--color-muted');
  const textColor = getColor('--color-text');

  const data = [
    {
      date: "1910",
      title: "Imperial Beginnings",
      desc: "Imperial Tobacco Company of India incorporated on 24 August 1910",
    },
    {
      date: "1925",
      title: "First Step Beyond Tobacco",
      desc: "Packaging and printing business established",
    },
    {
      date: "1969",
      title: "An Indian at the Helm",
      desc: "Ajit Haksar becomes the first Indian chairman",
    },
    {
      date: "1970",
      title: "Imperial to Indian",
      desc: "Company name changed to India Tobacco Company",
    },
    {
      date: "1974",
      title: "Down to Initials",
      desc: "Company name changed to I.T.C. Limited",
    },
    {
      date: "1975",
      title: "Checking In",
      desc: "Entered the hotel business, acquiring a hotel in Chennai",
    },
    {
      date: "1979",
      title: "Paperboards Business",
      desc: "Incorporated ITC Bhadrachalam Paperboards",
    },
    {
      date: "1983",
      title: "Haksar’s Successor",
      desc: "Jagdish Narain Sapru, Haksar’s brother-in-law, is appointed as chairman",
    },
    {
      date: "1990",
      title: "Farm to Port",
      desc: "Agribusiness division established for the export of agri-commodities",
    },
    {
      date: "1991",
      title: "Sapru’s Successor",
      desc: "Krishen Lal Chugh appointed as chairman",
    },
    {
      date: "1995",
      title: "Dispute with BAT",
      desc: "BAT alleges financial irregularities and Chugh resigns 20 months before the end of his tenure",
    },
    {
      date: "1996",
      title: "Crisis Inheritance",
      desc: "YC Deveshwar appointed as chairman. Enforcement Directorate arrests former chairman over alleged foreign-exchange violations at ITC’s Singapore trading arm",
    },
    {
      date: "2000",
      title: "Tech for the Farmers",
      desc: "e-Choupal initiative launches",
    },
    {
      date: "2001",
      title: "Drop the Dots",
      desc: "I.T.C. Limited renamed ITC Limited",
    },
    {
      date: "2012",
      title: "Consumer Goods",
      desc: "FMCG business crosses Rs 5,000 crore in revenue in 2012 and turns profitable in 2013",
    },
    {
      date: "2019",
      title: "New Custodian",
      desc: "Deveshwar passes away, and Sanjiv Puri is appointed as chairman",
    },
    {
      date: "2025",
      title: "Checking Out",
      desc: "Demerger of hotel business effective 1 January 2025",
    }
  ];

  function forceWordWrap(text, maxCharsPerLine) {
    const words = text.split(" ");
    let lines = [];
    let currentLine = "";
    words.forEach((word) => {
      if (currentLine.length + word.length > maxCharsPerLine) {
        lines.push(currentLine.trim());
        currentLine = word + " ";
      } else {
        currentLine += word + " ";
      }
    });
    lines.push(currentLine.trim());
    return lines.join("\n");
  }

  // 1. MOBILE INITIALIZATION
  const mobileList = document.getElementById("QW4K8-mobile-list");
  if (mobileList) {
    mobileList.innerHTML = "";
    data.forEach((item) => {
      const div = document.createElement("div");
      div.className = "QW4K8-timeline-item";
      div.innerHTML = `
                <div class="QW4K8-m-date">${item.date}</div>
                <div class="QW4K8-m-title">${item.title}</div>
                <div class="QW4K8-m-desc">${item.desc}</div>
            `;
      mobileList.appendChild(div);
    });
  }

  // 2. DESKTOP (ECHARTS) INITIALIZATION
  const chartDom = document.getElementById("QW4K8-main-chart");
  if (chartDom) {
    const myChart = echarts.init(chartDom);
    const horizontalSpacing = 320;

    const option = {
      silent: true,
      grid: { left: 100, right: 250, top: 0, bottom: 0 }, // FIX: Expanded right grid pad inside ECharts workspace
      xAxis: {
        type: "value",
        show: false,
        min: 0,
        // FIX: Generates an artificial terminal margin beyond the index of the final entry block
        max: (data.length - 1) * horizontalSpacing + 150,
      },
      yAxis: {
        type: "value",
        show: false,
        min: 0,
        max: 100,
      },
      series: [
        {
          type: "line",
          data: data.map((_, i) => [i * horizontalSpacing, 80]),
          lineStyle: { color: primaryColor, width: 4 },
          symbol: "circle",
          symbolSize: 20,
          showSymbol: true,
          itemStyle: {
            color: primaryColor,
            borderWidth: 4,
            borderColor: bgColor,
          },
          label: {
            show: true,
            position: "bottom",
            offset: [0, 30],
            align: "left",
            formatter: (p) => {
              const item = data[p.dataIndex];
              const wrappedDesc = forceWordWrap(item.desc, 35);
              return `{d|${item.date}}\n{t|${item.title}}\n{desc|${wrappedDesc}}`;
            },
            rich: {
              d: {
                color: mutedColor,
                fontWeight: "bold",
                fontSize: 14,
                padding: [0, 0, 8, 0],
              },
              t: {
                color: primaryColor,
                fontWeight: "bold",
                fontSize: 18,
                padding: [0, 0, 12, 0],
              },
              desc: { color: mutedColor, fontSize: 14, lineHeight: 22 },
            },
          },
        },
      ],
    };

    myChart.setOption(option);

    window.addEventListener("resize", () => {
      myChart.resize();
    });
  }
});
