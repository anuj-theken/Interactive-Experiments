// scripts/atta.js — QW4K3

document.addEventListener("DOMContentLoaded", function () {

  function getColor(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  var steps = [
    { share: 75, radius: 60, cap: "Branded segment ≈ ₹3,500 cr" },
    { share: 28, radius: 88, cap: "Branded market — larger, fragmented" },
    { share: 45, radius: 120, cap: "Branded category — mature, large" }
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

  function baseOption(step) {
    return {
      animationDuration: 700,
      animationEasing: 'cubicInOut',
      tooltip: { trigger: 'item', formatter: function (p) { return p.name + ': ' + p.value + '%'; } },
      series: [{
        type: 'pie',
        radius: [0, step.radius],
        center: ['50%', '50%'],
        avoidLabelOverlap: true,
        label: {
          show: true,
          formatter: function (p) { return p.name === 'Aashirvaad' ? p.value + '%' : ''; },
          fontSize: 20, fontWeight: 500, color: getColor('--color-text')
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

  window.addEventListener('resize', function () { chart.resize(); });
});
