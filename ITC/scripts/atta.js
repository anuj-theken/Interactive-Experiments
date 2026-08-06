// scripts/atta.js — QW4K3

document.addEventListener("DOMContentLoaded", function () {

  function getColor(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  // reads a px value out of a design-token CSS variable (e.g. --type-body:
  // 18px) so canvas-rendered graphic text can match the DOM type scale
  function getPxVar(name) {
    return parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || 0;
  }

  function hexToRgba(hex, alpha) {
    var h = hex.replace('#', '');
    var r = parseInt(h.substring(0, 2), 16);
    var g = parseInt(h.substring(2, 4), 16);
    var b = parseInt(h.substring(4, 6), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
  }

  // radius spread widened (was 60/88/120) so the growing market size reads
  // more clearly from the circle size alone. marketSize (INR crores, organised
  // segment) is the actual number behind that growth, shown as a secondary
  // value above the ring.
  var steps = [
    { share: 75, radius: 45, marketSize: 3500 },
    { share: 28, radius: 80, marketSize: 15000 },
    { share: 45, radius: 120, marketSize: 20000 }
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

  // a ring traces the pie's own radius, which grows with market size —
  // the ring's size alone (rather than a text caption) is what's meant to
  // carry the "market got bigger" meaning here
  function buildGraphics(step) {
    var cx = chart.getWidth() / 2;
    var cy = chart.getHeight() / 2;
    var ringColor = hexToRgba(getColor('--color-text'), 0.25);
    var marketSizeColor = hexToRgba(getColor('--color-secondary'), 0.55);

    // native pie labels default to 'outside', anchored along the slice's
    // mid-angle — for the widest step that angle sits near 3 o'clock, so
    // clamping it back horizontally could land it inside the ring's own
    // edge (looking "hidden" under the pie). Anchoring it below the ring
    // instead keeps it outside the circle at every step, with no
    // horizontal dependency on frame width.
    var vy = cy + step.radius + 14;

    return [
      {
        type: 'circle',
        shape: { cx: cx, cy: cy, r: step.radius },
        style: { fill: 'transparent', stroke: ringColor, lineWidth: 1.5 },
        silent: true
      },
      {
        // secondary value: the organised segment's total market size,
        // above the ring — same spot the old "Small/Medium/Large market"
        // caption used, now with the actual number behind that growth
        type: 'text',
        x: cx,
        y: Math.max(10, cy - step.radius - 14),
        style: {
          text: 'Market size: Rs.' + step.marketSize.toLocaleString('en-IN') + ' Cr',
          fill: marketSizeColor,
          fontFamily: 'Archivo',
          fontSize: getPxVar('--type-body'),
          fontWeight: 600,
          align: 'center',
          verticalAlign: 'bottom'
        },
        silent: true
      },
      {
        type: 'text',
        x: cx,
        y: vy,
        style: {
          text: step.share + '%',
          fill: getColor('--color-text'),
          fontFamily: 'Reckless',
          fontSize: 30,
          fontWeight: 500,
          align: 'center',
          verticalAlign: 'top'
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
        // value is drawn as its own clamped graphic (see buildGraphics)
        // instead of the native label, so it can sit outside the ring
        // without ever overflowing the chart frame.
        label: { show: false },
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
