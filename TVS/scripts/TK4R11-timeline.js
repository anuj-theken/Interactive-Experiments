// scripts/TK4R11-timeline.js — TK4R11 · The timeline of TVS, 1912–2026
// The original design: desktop is one wide ECharts line (scrolls sideways), phones get a vertical list.
// Colours and fonts are read from the design tokens on the section.

document.addEventListener("DOMContentLoaded", function () {
  const section = document.querySelector(".TK4R11-chart-section");
  if (!section) return;

  // 1. Data
  const data = [
    { date: "1912", title: "The first bus", desc: "TV Sundaram Iyengar wins a bid to operate a bus service" },
    { date: "1919", title: "Sales and service", desc: "Sundaram sets up an automobile sales and service unit in Madurai" },
    { date: "1929", title: "The GM deal", desc: "Sundaram becomes a distributor of General Motors vehicles" },
    { date: "1954", title: "GM exit", desc: "Much of TVS business is built around General Motors dealership, but GM leaves India" },
    { date: "1960", title: "Move into manufacturing", desc: "TVS group sets up four JVs with British companies, including Sundaram Clayton" },
    { date: "1979", title: "Venu takes charge", desc: "TS Srinivasan dies before his moped dream becomes a reality. His son Venu becomes managing director of Sundaram Clayton" },
    { date: "1980", title: "TVS 50", desc: "TVS launches its first consumer product: the TVS 50, a two-seater moped" },
    { date: "1982", title: "The Suzuki marriage", desc: "Sundaram Clayton sets up a JV with Suzuki to make motorcycles" },
    { date: "1990", title: "The lockout", desc: "Venu has to shut the TVS Suzuki factory in Hosur because of violent protests" },
    { date: "1998", title: "Quality accolades", desc: "Sundaram Clayton becomes the first Indian company and the fourth non-Japanese company to win the Deming Prize" },
    { date: "2001", title: "The Suzuki split", desc: "The JV with Suzuki ends after 19 years" },
    { date: "2005", title: "Apache", desc: "TVS launches the Apache to get hold of the 150cc segment" },
    { date: "2008", title: "KNR becomes CEO", desc: "KN Radhakrishnan becomes president and CEO" },
    { date: "2010", title: "Next generation", desc: "Venu’s daughter Lakshmi joins Sundaram Clayton, and his son Sudarshan joins TVS Motor in the next year" },
    { date: "2013", title: "BMW partnership", desc: "TVS enters into a partnership with BMW Motorrad to build motorcycles under 500cc" },
    { date: "2020", title: "International acquisition", desc: "TVS acquires Norton, a British motorcycle brand, for Rs 153 crore" },
    { date: "2020", title: "Move into electric vehicles", desc: "TVS launches an electric scooter under the brand iQube" },
    { date: "2025", title: "Global ranking", desc: "TVS overtakes Yamaha to become the world’s third-largest two-wheeler maker" },
    { date: "2025", title: "Sudarshan gets the top job", desc: "Sudarshan becomes chairman & managing director. Venu also makes him the beneficiary of the trust that controls TVS Motor" },
    { date: "2026", title: "Ownership dispute", desc: "Venu’s wife and daughter argue that Sudarshan’s running TVS Motor does not entitle him to inherit it" }
  ];

  function forceWordWrap(text, maxCharsPerLine) {
    const words = text.split(" ");
    const lines = [];
    let currentLine = "";
    words.forEach(word => {
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

  // 2. Mobile list
  const mobileList = document.getElementById("TK4R11-vlist");
  if (mobileList) {
    mobileList.innerHTML = data.map(item => `
      <div class="TK4R11-item">
        <div class="TK4R11-m-date">${item.date}</div>
        <div class="TK4R11-m-title">${item.title}</div>
        <div class="TK4R11-m-desc">${item.desc}</div>
      </div>`).join("");
  }

  // 3. Desktop (ECharts)
  const chartDom = document.getElementById("TK4R11-chart");
  if (!chartDom) return;
  const cs = getComputedStyle(section), v = n => cs.getPropertyValue(n).trim();
  const RED = v("--color-primary"), GROUND = v("--color-bg"), MUTED = v("--color-muted");
  const FONT = v("--font-body"), DISPLAY = v("--font-display");
  const chart = echarts.init(chartDom);
  const horizontalSpacing = 320;

  chart.setOption({
    silent: true,
    grid: { left: 100, right: 250, top: 0, bottom: 0 },
    xAxis: { type: "value", show: false, min: 0, max: (data.length - 1) * horizontalSpacing + 150 },
    yAxis: { type: "value", show: false, min: 0, max: 100 },
    series: [{
      type: "line",
      data: data.map((_, i) => [i * horizontalSpacing, 80]),
      lineStyle: { color: RED, width: 4 },
      symbol: "circle",
      symbolSize: 20,
      showSymbol: true,
      itemStyle: { color: RED, borderWidth: 4, borderColor: GROUND },
      label: {
        show: true,
        position: "bottom",
        offset: [0, 30],
        align: "left",
        formatter: p => {
          const item = data[p.dataIndex];
          return `{d|${item.date}}\n{t|${item.title}}\n{desc|${forceWordWrap(item.desc, 35)}}`;
        },
        rich: {
          d:    { color: MUTED, fontFamily: FONT, fontWeight: "bold", fontSize: 14, padding: [0, 0, 8, 0] },
          t:    { color: RED, fontFamily: DISPLAY, fontWeight: "bold", fontSize: 18, padding: [0, 0, 12, 0] },
          desc: { color: MUTED, fontFamily: FONT, fontSize: 14, lineHeight: 22 }
        }
      }
    }]
  });

  window.addEventListener("resize", () => chart.resize());
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => chart.resize());
});
