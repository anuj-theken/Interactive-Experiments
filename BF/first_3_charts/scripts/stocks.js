(function() {
  const years = ['2007','2008','2009','2010','2011','2012','2013','2014','2015','2016','2017','2018','2019','2020','2021','2022','2023','2024','2025'];
  const bajajAutoData = [100,41.97,157.93,228.98,302.82,394.56,379.13,487.24,486.57,603.02,724.60,566.08,720.46,948.29,873.04,970.28,2008.05,2335.98,2598.13];
  const bajajHindustanData = [100,30.43,108.48,44.15,18.87,12.87,6.77,10.49,9.28,7.95,7.87,4.43,3.50,3.63,9.28,8.26,17.13,15.31,9.07];
  const nifty50Data = [100,55.96,95.03,107.17,101.20,117.47,118.53,171.46,147.22,166.64,214.65,210.82,232.84,265.40,337.52,343.79,422.89,457.59,492.86];

  // Steps define:
  // revealUntil: How much of the line to show
  // markerAt: Where the circle sits
  const steps = [
    { revealUntil: 1,  markerAt: 0 },  // 2007
    { revealUntil: 1,  markerAt: 0 },  // 2007
    { revealUntil: 13, markerAt: 12 }, // 2019
    { revealUntil: 16, markerAt: 15 }, // 2022
    { revealUntil: 19, markerAt: 16 }  // 2023 Marker, but reveal till 2025 (Index 19)
  ];

  const wrapper = document.querySelector('.scroll-wrapper');
  const blocks = Array.from(document.querySelectorAll('.text-block'));
  const chartDom = document.getElementById('chart-container');
  const myChart = echarts.init(chartDom);

  let currentStep = -1;

  function setBlockStyle(el, visible, direction) {
    if (!el) return;
    el.style.opacity = visible ? '1' : '0';
    const ty = visible ? 0 : (direction === 'down' ? -20 : 20);
    el.style.transform = `translateY(${ty}px)`;
    el.style.pointerEvents = visible ? 'auto' : 'none';
  }

  function updateChart(stepIdx) {
    const step = steps[stepIdx];
    const revealCount = step.revealUntil;
    const markerIndex = step.markerAt;

    const createMarker = (val, color) => ({
      symbol: 'circle',
      symbolSize: 10,
      itemStyle: { color: color, borderWidth: 0 },
      data: [{ coord: [years[markerIndex], val] }]
    });

    myChart.setOption({
      series: [
        {
          data: bajajAutoData.slice(0, revealCount),
          markPoint: createMarker(bajajAutoData[markerIndex], '#0057B8')
        },
        {
          data: bajajHindustanData.slice(0, revealCount),
          markPoint: createMarker(bajajHindustanData[markerIndex], '#0F2A5C')
        },
        {
          data: nifty50Data.slice(0, revealCount)
        }
      ]
    });
  }

  window.addEventListener('scroll', () => {
    const rect = wrapper.getBoundingClientRect();
    const scrollFraction = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));

    let stepIdx = Math.floor(scrollFraction * steps.length);
    if (stepIdx >= steps.length) stepIdx = steps.length - 1;

    if (stepIdx !== currentStep) {
      const direction = stepIdx > currentStep ? 'down' : 'up';
      if (currentStep !== -1) setBlockStyle(blocks[currentStep], false, direction);
      currentStep = stepIdx;
      setBlockStyle(blocks[currentStep], true, direction);
      updateChart(currentStep);
    }
  });

  // Initial Chart setup
  myChart.setOption({
    grid: {
    left: '3%',    // Margin from the left of the container
    right: '4%',   // Margin from the right
    bottom: '3%',  // Margin from the bottom
    top: '10%',    // Margin from the top
    containLabel: true // THIS is the magic line that prevents cutting off
  }, backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    xAxis: { type:'category', boundaryGap:false, data: years },
    yAxis: { type:'value', min: 0, max: 3000},
    series: [
      { name:'Bajaj Auto', type:'line', smooth:0.3, lineStyle:{color:'#0057B8',width:3}, symbol:'none', data: [bajajAutoData[0]] },
      { name:'Bajaj Hindustan', type:'line', smooth:0.3, lineStyle:{color:'#0F2A5C',width:2.5}, symbol:'none', data: [bajajHindustanData[0]] },
      { name:'Nifty 50', type:'line', smooth:0.3, lineStyle:{type:'dashed',color:'#C2D9C2',width:1.8}, symbol:'none', data: [nifty50Data[0]] }
    ]
  });

  window.addEventListener('resize', () => myChart.resize());
})();
