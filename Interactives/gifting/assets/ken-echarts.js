// The Ken — ECharts tokens & defaults that mirror ken-chart.css.
// Load after echarts; exposes window.KEN.
(function () {
  const C = {
    bg: '#F7F2F2', rule: '#DCCFCF', grid: '#E0D4D4', outline: '#C4AAAA',
    ink: '#1A1208', text: '#5C4A4A', textSoft: '#4A3535', body: '#3A2E20', na: '#9A8E7A',
    onFill: 'rgba(255,255,255,0.92)',
    palette: ['#C8423A', '#4A7A5A', '#4A9E9A', '#3D3D3D', '#7A9E4A', '#A89880', '#D4A8A0']
  };
  const F = {
    body: "'GT America', Arial, sans-serif",
    bold: "'GT America Bold', Arial, sans-serif"
  };

  // Tooltip: blush card, rule border, soft shadow. Use KEN.tt() helpers for the HTML body.
  const tooltip = {
    backgroundColor: C.bg,
    borderColor: C.rule,
    borderWidth: 1,
    padding: [12, 14],
    textStyle: { fontFamily: F.body, fontSize: 13, color: C.body },
    extraCssText: 'border-radius:3px;box-shadow:0 4px 20px rgba(0,0,0,0.10);line-height:1.6;max-width:260px;white-space:normal;'
  };

  const tt = {
    name: s => `<div style="font-family:${F.bold};font-weight:bold;font-size:18px;color:${C.ink};line-height:1.2;margin-bottom:8px;">${s}</div>`,
    line: (label, value) => `<div>${label}: <b style="font-weight:700;color:${C.ink}">${value}</b></div>`,
    meta: s => `<div style="color:${C.text}">${s}</div>`,
    rule: s => `<div style="margin-top:6px;border-top:1px solid #E0D8C8;padding-top:6px;">${s}</div>`
  };

  // Axis label / name styles
  const axisLabel = { fontFamily: F.body, fontSize: 13, color: C.text };
  const axisLabelBold = { fontFamily: F.bold, fontWeight: 'bold', fontSize: 14, color: C.text };
  const axisName = { fontFamily: F.bold, fontWeight: 'bold', fontSize: 11, color: C.text };
  const gridLine = { lineStyle: { color: C.grid, width: 0.8 } };

  // Init once web fonts are ready so canvas text uses GT America
  function init(el) {
    const chart = echarts.init(el, null, { renderer: 'canvas' });
    window.addEventListener('resize', () => chart.resize());
    return chart;
  }
  function whenFontsReady(fn) {
    if (!document.fonts) return fn();
    Promise.all([
      document.fonts.load(`300 12px ${F.body}`),
      document.fonts.load(`bold 12px ${F.bold}`)
    ]).catch(() => {}).then(fn);
  }

  window.KEN = { C, F, tooltip, tt, axisLabel, axisLabelBold, axisName, gridLine, init, whenFontsReady };
})();
