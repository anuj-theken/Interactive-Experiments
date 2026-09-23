// scripts/TK4R11-timeline.js — TK4R11

document.addEventListener("DOMContentLoaded", function () {
  // 1. Data
  const data = [
    { date: '1962', title: 'TCS is Born', desc: 'JRD Tata sets up a data-processing division within Tata Sons, which later becomes TCS.' },
    { date: '1969', title: 'Kohli Arrives', desc: 'FC Kohli joins TCS as General Manager.' },
    { date: '1979', title: 'Overseas Expansion', desc: 'TCS becomes the first company to open a sales office abroad and sends Ramadorai to New York as its first resident manager.' },
    { date: '1996', title: 'New Leadership', desc: 'FC Kohli picks S Ramadorai as CEO.' },
    { date: '1997', title: 'Software Factory', desc: 'TCS sets up a software factory in Chennai to solve the Y2K Bug.' },
    { date: '2003', title: 'Revenue Milestone', desc: 'TCS became India’s first billion-dollar software company.' },
    { date: '2004', title: 'Public Debut', desc: 'TCS launches its IPO on the 100th birth anniversary of JRD Tata.' },
    { date: '2006', title: 'Learning Module', desc: 'Ramadorai launches a new training program called Ignite for the non-engineering science graduates.' },
    { date: '2009', title: 'Leadership Transition', desc: 'N Chandrasekaran becomes CEO of TCS.' },
    { date: '2017', title: 'TCS to Tata Sons', desc: 'Chandrasekaran becomes the first non-Parsi chairman of Tata Sons; Rajesh Gopinathan replaces him at TCS.' },
    { date: '2023', title: 'Krithi Takes Over', desc: 'Gopinathan steps down and Krithivasan becomes CEO of TCS.' },
    { date: '2026', title: 'Succession Issue', desc: 'Chandrasekaran decides not to seek reappointment as Tata Sons Chairman, but reverses the decision and receives another five-year term.' }
  ];

  // 2. Tokens — read the design system, never hardcode
  const css          = getComputedStyle(document.documentElement);
  const PRIMARY      = css.getPropertyValue("--color-primary").trim();
  const INK          = css.getPropertyValue("--color-text").trim();
  const MUTED        = css.getPropertyValue("--color-muted").trim();
  const BG           = css.getPropertyValue("--color-bg").trim();
  const FONT_DISPLAY = css.getPropertyValue("--font-display").trim();
  const FONT_BODY    = css.getPropertyValue("--font-body").trim();
  const FONT_MONO    = css.getPropertyValue("--font-mono").trim();

  function px(token) {
    return parseFloat(css.getPropertyValue(token)) || undefined;
  }

  function forceWordWrap(text, maxCharsPerLine) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    words.forEach(function (word) {
      if (currentLine.length + word.length > maxCharsPerLine) {
        lines.push(currentLine.trim());
        currentLine = word + ' ';
      } else {
        currentLine += word + ' ';
      }
    });
    lines.push(currentLine.trim());
    return lines.join('\n');
  }

  // 3. DOM references — always use the module prefix
  const mobileList = document.getElementById('TK4R11-mobile-list');
  const chartDom   = document.getElementById('TK4R11-chart');

  // Mobile vertical list
  if (mobileList) {
    data.forEach(function (item) {
      const div = document.createElement('div');
      div.className = 'TK4R11-timeline-item';
      div.innerHTML =
        '<div class="TK4R11-m-date">' + item.date + '</div>' +
        '<div class="TK4R11-m-title">' + item.title + '</div>' +
        '<div class="TK4R11-m-desc">' + item.desc + '</div>';
      mobileList.appendChild(div);
    });
  }

  if (!chartDom) return;

  // 4. Library init
  const chart = echarts.init(chartDom);
  const horizontalSpacing = 280;

  // 5. Render — every node is directly labeled, so the chart stays silent
  chart.setOption({
    backgroundColor: 'transparent',
    silent: true,
    grid: { left: 80, right: 300, top: 0, bottom: 0 },
    xAxis: { type: 'value', show: false, min: 0, max: (data.length - 1) * horizontalSpacing },
    yAxis: { type: 'value', show: false, min: 0, max: 100 },
    series: [{
      type: 'line',
      data: data.map(function (_, i) { return [i * horizontalSpacing, 75]; }),
      lineStyle: { color: PRIMARY, width: 2 },
      symbol: 'circle',
      symbolSize: 16,
      itemStyle: { color: PRIMARY, borderWidth: 3, borderColor: BG },
      label: {
        show: true,
        position: 'bottom',
        offset: [-8, 12],
        align: 'left',
        formatter: function (p) {
          const item = data[p.dataIndex];
          return '{d|' + item.date + '}\n{t|' + item.title + '}\n{desc|' + forceWordWrap(item.desc, 30) + '}';
        },
        rich: {
          d: {
            color: MUTED,
            fontWeight: '500',
            fontSize: px('--type-legend'),
            align: 'left',
            padding: [0, 0, 6, 0],
            fontFamily: FONT_MONO
          },
          t: {
            color: PRIMARY,
            fontWeight: 'normal',
            fontSize: px('--type-body'),
            align: 'left',
            padding: [0, 0, 10, 0],
            fontFamily: FONT_DISPLAY
          },
          desc: {
            color: INK,
            fontSize: px('--type-legend'),
            lineHeight: 20,
            align: 'left',
            fontFamily: FONT_BODY
          }
        }
      }
    }]
  });

  window.addEventListener('resize', function () {
    chart.resize();
  });
});
