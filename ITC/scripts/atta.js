// scripts/atta.js — QW4K3

document.addEventListener("DOMContentLoaded", function () {

  function getColor(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function hexToRgba(hex, alpha) {
    var h = hex.replace('#', '');
    var r = parseInt(h.substring(0, 2), 16);
    var g = parseInt(h.substring(2, 4), 16);
    var b = parseInt(h.substring(4, 6), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
  }

  var steps = [
    { share: 75, radius: 60, cap: "Small market" },
    { share: 28, radius: 88, cap: "Medium sized market" },
    { share: 45, radius: 120, cap: "Large market" }
  ];
  var currentStep = -1;

  var chartDom = document.getElementById('QW4K3-chart');
  if (!chartDom) return;
  var chart = echarts.init(chartDom);

  function pieData(share) {
    return [
      { value: share, name: 'Aashirvaad', itemStyle: { color: getColor('--color-primary') } },
      { value: 100 - share, name: 'Rest of branded market', itemStyle: { color: getColor('--color-muted') } }
    ];
  }

  // a ring traces the pie's own radius (which already grows with market size)
  // and is labelled with that step's market-size caption, so the market's
  // growth reads even without following the narrative text
  function buildGraphics(step) {
    var cx = chart.getWidth() / 2;
    var cy = chart.getHeight() / 2;
    var ringColor = hexToRgba(getColor('--color-text'), 0.25);
    var labelColor = hexToRgba(getColor('--color-secondary'), 0.55);
    return [
      {
        type: 'circle',
        shape: { cx: cx, cy: cy, r: step.radius },
        style: { fill: 'transparent', stroke: ringColor, lineWidth: 1.5 },
        silent: true
      },
      {
        type: 'text',
        x: cx,
        y: Math.max(10, cy - step.radius - 14),
        style: {
          text: step.cap,
          fill: labelColor,
          fontFamily: 'Archivo',
          fontSize: 12,
          fontWeight: 600,
          align: 'center',
          verticalAlign: 'bottom'
        },
        silent: true
      }
    ];
  }

  function baseOption(step) {
    return {
      animationDuration: 700,
      animationEasing: 'cubicInOut',
      tooltip: { trigger: 'item', formatter: function (p) { return p.name + ': ' + p.value + '%'; } },
      graphic: buildGraphics(step),
      series: [{
        type: 'pie',
        radius: [0, step.radius],
        center: ['50%', '50%'],
        avoidLabelOverlap: true,
        label: {
          show: true,
          formatter: function (p) { return p.name === 'Aashirvaad' ? p.value + '%' : ''; },
          fontFamily: 'Reckless', fontSize: 30, fontWeight: 500, color: getColor('--color-text')
        },
        labelLine: { show: false },
        data: pieData(step.share)
      }]
    };
  }

  var panels = document.querySelectorAll('.QW4K3-panel');

  function goTo(i) {
    if (i === currentStep) return;
    currentStep = i;
    chart.setOption(baseOption(steps[i]), true);
    panels.forEach(function (p, k) {
      gsap.to(p, { opacity: k === i ? 1 : 0, y: k === i ? 0 : 10, duration: 0.5, ease: 'power2.out' });
    });
  }

  gsap.set(panels[0], { opacity: 1, y: 0 });
  goTo(0);

  ScrollTrigger.create({
    trigger: '#QW4K3-driver',
    start: 'top top',
    end: 'bottom bottom',
    pin: '#QW4K3-pin',
    onUpdate: function (self) {
      var i = Math.min(steps.length - 1, Math.floor(self.progress * steps.length));
      goTo(i);
    }
  });

  window.addEventListener('resize', function () {
    chart.resize();
    chart.setOption({ graphic: buildGraphics(steps[currentStep]) });
  });
});
