document.addEventListener("DOMContentLoaded", () => {
  const data = [
    {
      date: "1976",
      title: "Entrepreneurial Spirit",
      desc: "19-year-old Sunil Mittal sets up his first factory to make bicycle parts.",
    },
    {
      date: "1980",
      title: "Family Business",
      desc: "Sunil Mittal and his brothers set up Bharti Overseas Trading Company, an import business.",
    },
    {
      date: "1983",
      title: "Forced Pivot",
      desc: "The Indian government bans generator imports; Sunil Mittal discovers push-button phones.",
    },
    {
      date: "1992",
      title: "Mobile Dream",
      desc: "Bharti becomes one of India’s strongest telecom terminal businesses.",
    },
    {
      date: "Feb 2002",
      title: "Public debut",
      desc: "Bharti Airtel has its initial public offering.",
    },
    {
      date: "1 July 2003",
      title: "Phones Everywhere",
      desc: "Reliance launches Monsoon Hungama offer.",
    },
    {
      date: "Mar 2004",
      title: "Better IT?",
      desc: "Bharti Airtel signs an outsourcing deal with IBM.",
    },
    {
      date: "July 2004",
      title: "Counterintuitive Partnership",
      desc: "Bharti signs outsourcing deals with Ericsson, Nokia, and Siemens.",
    },
    {
      date: "Nov 2007",
      title: "Infrastructure Expansion",
      desc: "Indus Towers is established.",
    },
    {
      date: "June 2010",
      title: "Overseas Acquisition",
      desc: "Buys Africa operations of Zain.",
    },
    {
      date: "Feb 2013",
      title: "New Leadership",
      desc: "Gopal Vittal appointed as joint managing director and CEO of Airtel India.",
    },
    {
      date: "Sep 2016",
      title: "New Old Competitor",
      desc: "Reliance Jio launches.",
    },
    {
      date: "July 2019",
      title: "Another IPO",
      desc: "Airtel Africa PLC lists on the London stock exchange.",
    },
    {
      date: "Jan 2026",
      title: "Leadership transition",
      desc: "Shashwat Sharma appointed as managing director and CEO of Airtel India, succeeding Gopal Vittal.",
    },
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
  const mobileList = document.getElementById("QW4K-mobile-list-btl");
  if (mobileList) {
    mobileList.innerHTML = "";
    data.forEach((item) => {
      const div = document.createElement("div");
      div.className = "QW4K-timeline-item-btl";
      div.innerHTML = `
                <div class="QW4K-m-date-btl">${item.date}</div>
                <div class="QW4K-m-title-btl">${item.title}</div>
                <div class="QW4K-m-desc-btl">${item.desc}</div>
            `;
      mobileList.appendChild(div);
    });
  }

  // 2. DESKTOP (ECHARTS) INITIALIZATION
  const chartDom = document.getElementById("QW4K-main-btl");
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
          lineStyle: { color: "#d41616", width: 4 },
          symbol: "circle",
          symbolSize: 20,
          showSymbol: true,
          itemStyle: {
            color: "#d41616",
            borderWidth: 4,
            borderColor: "#F5F2E8",
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
                color: "#999",
                fontWeight: "bold",
                fontSize: 14,
                padding: [0, 0, 8, 0],
              },
              t: {
                color: "#d41616",
                fontWeight: "bold",
                fontSize: 18,
                padding: [0, 0, 12, 0],
              },
              desc: { color: "#444", fontSize: 14, lineHeight: 22 },
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
