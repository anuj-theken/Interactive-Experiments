/* ==========================================================================
   CHARTS — one ECharts instance per panel, all re-renderable. renderAll(data)
   is called once at load and again on every filter change; every builder
   fully replaces its option (setOption(..., true)) rather than assuming a
   fresh instance, so filtering never leaves stale series behind.

   Circles are reserved for marks that genuinely need point placement on two
   continuous axes — chart 4's popularity/frustration scatter is the only
   one. Everything else uses its plainest form: ranked bars (1, 6, 8),
   stacked bars (5, 7c), or a true color-coded heatmap for category x
   category/emotion/age matrices (3, 7b). Color = the category's DOMINANT
   EMOTION (the existing validated 3-hue red/yellow/blue set — see
   data.quad[].dominant) wherever emotion identity matters, since a 14-way
   categorical palette fails the accessibility all-pairs check (dataviz
   skill). Chart 4 keeps its own quadrant coloring — that chart's whole
   point is quadrant membership.
   ========================================================================== */
window.Charts = (function () {
  const C = {
    // data-mark palette stays exactly as-is — this is the emotion vocabulary
    // the copy explicitly calls out ("red / yellow / blue"), independent of
    // the page's own warm-cream / boxy chrome restyle below.
    blue: '#2a78d6', orange: '#eb6834', aqua: '#1baf7a', yellow: '#eda100',
    magenta: '#e87ba4', green: '#008300', violet: '#4a3aa7', red: '#e34948',
    ink: '#201a12', inkSec: '#5c5140', muted: '#978a72', otherGray: '#cabb9c',
    grid: '#ece0c7', baseline: '#d9cbac', surface: '#fdf8ee',
    seq: ['#fbe9cd', '#f6d5a3', '#f0ba74', '#e99c49', '#df7f2e', '#b25f1e', '#7d4114']
  };
  const EMO_COLOR = { Frustrating: C.red, Procrastinate: C.yellow, Repetitive: C.blue };

  const baseTextStyle = { fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif' };
  const axisLabelStyle = { color: C.inkSec, fontSize: 12 };
  const axisLineStyle = { lineStyle: { color: C.baseline } };
  const splitLineStyle = { lineStyle: { color: C.grid, width: 1, type: 'solid' } };

  function tooltipBase(extra) {
    return Object.assign({
      backgroundColor: '#ffffff', borderColor: C.ink, borderWidth: 1.5,
      textStyle: { color: C.ink, fontSize: 13 },
      extraCssText: 'border-radius:6px; padding:10px 12px;'
    }, extra || {});
  }

  function fmt(n) { return n.toLocaleString('en-IN'); }
  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
  function truncateWords(text, maxWords) {
    const words = text.split(/\s+/);
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '…';
  }

  const instances = {}; // id -> echarts instance
  let DATA = null;      // current aggregated data — click handlers read this, never a stale closure

  function chart(id) {
    if (instances[id]) return instances[id];
    const el = document.getElementById(id);
    const inst = echarts.init(el, null, { renderer: 'svg' });
    instances[id] = inst;
    return inst;
  }

  function onClick(inst, handler) {
    inst.off('click');
    inst.on('click', handler);
  }

  function emit(dimension, value) {
    if (window.SidebarUI) window.SidebarUI.onElementClick(dimension, value, DATA);
  }

  function domByCat() {
    const map = {};
    (DATA.quad || []).forEach(q => { map[q.cat] = q.dominant; });
    return map;
  }

  /* ============================= CHART 1 — demand: ranked bar, colored by dominant feeling ============================= */
  function buildChart1() {
    const inst = chart('chart1');
    const data = DATA.demand.slice().reverse();
    const dom = domByCat();

    inst.setOption({
      textStyle: baseTextStyle,
      grid: { left: 150, right: 60, top: 10, bottom: 10, containLabel: true },
      tooltip: tooltipBase({ trigger: 'item', formatter: p => `<b>${p.name}</b><br/>${fmt(p.value)} people picked this<br/><span style="color:${C.muted}">Mostly tagged ${dom[p.name] || '—'}</span>` }),
      xAxis: { type: 'value', axisLabel: axisLabelStyle, axisLine: { show: false }, splitLine: splitLineStyle, axisTick: { show: false } },
      yAxis: { type: 'category', data: data.map(d => d.cat), axisLabel: axisLabelStyle, axisLine: axisLineStyle, axisTick: { show: false } },
      series: [{
        type: 'bar', barMaxWidth: 18,
        data: data.map(d => ({ name: d.cat, value: d.count, itemStyle: { color: EMO_COLOR[dom[d.cat]] || C.blue, borderRadius: [0, 4, 4, 0] } })),
        label: { show: true, position: 'right', color: C.inkSec, fontSize: 12, formatter: p => fmt(p.value) },
        animationDuration: 900, animationEasing: 'cubicOut'
      }]
    });
    onClick(inst, p => { if (p.componentType === 'series') emit('category', p.name); });
  }

  /* ============================= CHART 2 — emotion donut ============================= */
  function buildChart2() {
    const inst = chart('chart2');
    const order = ['Frustrating', 'Procrastinate', 'Repetitive'];
    const total = order.reduce((s, k) => s + DATA.emotionOverall[k], 0);
    inst.setOption({
      textStyle: baseTextStyle,
      tooltip: tooltipBase({ trigger: 'item', formatter: p => `<b>${p.name}</b><br/>${fmt(p.value)} tags (${p.percent}%)` }),
      legend: { bottom: 0, itemWidth: 12, itemHeight: 12, icon: 'circle', textStyle: { color: C.inkSec, fontSize: 13 } },
      series: [{
        type: 'pie', radius: ['46%', '72%'], center: ['50%', '44%'], avoidLabelOverlap: true,
        itemStyle: { borderColor: C.surface, borderWidth: 3 },
        label: { show: true, formatter: p => `${p.name}\n${fmt(p.value)}`, color: C.inkSec, fontSize: 12.5, lineHeight: 16 },
        labelLine: { lineStyle: { color: C.baseline } },
        data: order.map(k => ({ name: k, value: DATA.emotionOverall[k], itemStyle: { color: EMO_COLOR[k] } })),
        animationDuration: 900
      }],
      graphic: [
        { type: 'text', left: 'center', top: '38%', style: { text: fmt(total), fontSize: 30, fontWeight: 700, fill: C.ink, textAlign: 'center' } },
        { type: 'text', left: 'center', top: '46%', style: { text: 'pain points tagged', fontSize: 12.5, fill: C.muted, textAlign: 'center' } }
      ]
    });
    onClick(inst, p => { if (p.componentType === 'series') emit('emotion', p.name); });
  }

  /* ============================= CHART 3 — emotion x category heatmap ============================= */
  function buildChart3() {
    const inst = chart('chart3');
    const cats = DATA.demand.map(d => d.cat).slice().reverse();
    const emotions = ['Frustrating', 'Procrastinate', 'Repetitive'];
    let maxV = 0;
    cats.forEach(cat => emotions.forEach(emo => { maxV = Math.max(maxV, DATA.heatmap[cat][emo]); }));

    const points = [];
    cats.forEach((cat, yi) => emotions.forEach((emo, xi) => {
      points.push({ cat, emo, xi, yi, v: DATA.heatmap[cat][emo] });
    }));

    inst.setOption({
      textStyle: baseTextStyle,
      tooltip: tooltipBase({ formatter: p => `<b>${p.value[3]}</b><br/>${p.value[4]}: ${fmt(p.value[2])}` }),
      grid: { left: 150, right: 24, top: 40, bottom: 20, containLabel: false },
      xAxis: { type: 'category', data: emotions, position: 'top', splitArea: { show: true }, axisLabel: Object.assign({}, axisLabelStyle, { fontWeight: 600 }), axisLine: { show: false }, axisTick: { show: false } },
      yAxis: { type: 'category', data: cats, splitArea: { show: true }, axisLabel: axisLabelStyle, axisLine: { show: false }, axisTick: { show: false } },
      visualMap: { show: false, min: 0, max: maxV, dimension: 2, inRange: { color: C.seq } },
      series: [{
        type: 'heatmap',
        data: points.map(p => [p.xi, p.yi, p.v, p.cat, p.emo]),
        itemStyle: { borderColor: C.surface, borderWidth: 3, borderRadius: 4 },
        label: {
          show: true, formatter: p => fmt(p.value[2]), fontSize: 11.5, fontWeight: 600,
          color: p => p.value[2] / (maxV || 1) > 0.55 ? '#ffffff' : C.ink
        },
        emphasis: { itemStyle: { borderColor: C.ink, borderWidth: 2 } },
        animationDuration: 700
      }]
    }, true);
    onClick(inst, p => {
      if (p.componentType !== 'series') return;
      emit('category', p.value[3]);
    });
  }

  /* ============================= CHART 4 — 2x2 quadrant (already circles) ============================= */
  const LABEL_OFFSET = {
    'Pets': [0, -14], 'Beauty & self-care': [0, 16], 'Weddings': [-10, -12], 'Kids & school': [16, 14],
    'Going out': [0, 16], 'Travel & holidays': [-4, -14], 'Food & eating out': [4, 18], 'Health & medical': [-6, 18],
    'Getting around': [34, -8], 'Learning & hobbies': [0, -14], 'Shopping & deals': [0, -14],
    'Fitness & wellness': [0, 16], 'Groceries': [0, -14], 'Money & investing': [0, -14]
  };
  function buildChart4() {
    const inst = chart('chart4');
    const pts = DATA.quad;
    if (!pts.length) { inst.clear(); return; }
    const avgX = pts.reduce((s, p) => s + p.picked, 0) / pts.length;
    const avgY = 50;
    const QUADRANTS = [
      { key: 'TR', name: 'Popular & painful', color: C.orange, test: p => p.picked >= avgX && p.frustShare >= avgY },
      { key: 'TL', name: 'Niche but painful', color: C.aqua, test: p => p.picked < avgX && p.frustShare >= avgY },
      { key: 'BR', name: 'Popular, less painful', color: C.blue, test: p => p.picked >= avgX && p.frustShare < avgY },
      { key: 'BL', name: 'Niche & mild', color: C.otherGray, test: p => p.picked < avgX && p.frustShare < avgY }
    ];
    const series = QUADRANTS.map(q => ({
      name: q.name, type: 'scatter', symbolSize: 16,
      itemStyle: { color: q.color, borderColor: C.surface, borderWidth: 2 },
      data: pts.filter(q.test).map(p => ({
        name: p.cat, value: [p.picked, p.frustShare], itemStyle: { color: q.color, borderColor: C.surface, borderWidth: 2 },
        label: { show: true, formatter: p.cat, position: LABEL_OFFSET[p.cat] || [0, -14], color: C.ink, fontSize: 10.5, fontWeight: 600 }
      })),
      labelLayout: { hideOverlap: false },
      markLine: q.key === 'TR' ? { symbol: 'none', silent: true, lineStyle: { color: C.baseline, type: 'dashed', width: 1 }, label: { show: false }, data: [{ xAxis: avgX }, { yAxis: avgY }] } : undefined,
      emphasis: { itemStyle: { borderColor: C.ink, borderWidth: 2.5 } },
      animationDuration: 900
    }));

    inst.setOption({
      textStyle: baseTextStyle,
      tooltip: tooltipBase({ formatter: p => `<b>${p.data.name}</b><br/>Picked by ${fmt(p.data.value[0])} people<br/>${p.data.value[1]}% tagged Frustrating<br/><span style="color:${C.muted}">${p.seriesName}</span>` }),
      legend: { bottom: 0, itemWidth: 10, itemHeight: 10, icon: 'circle', textStyle: { color: C.inkSec, fontSize: 11.5 }, data: QUADRANTS.map(q => q.name) },
      grid: { left: 60, right: 60, top: 30, bottom: 70, containLabel: true },
      xAxis: { type: 'value', name: 'Times picked (popularity) →', nameLocation: 'middle', nameGap: 32, nameTextStyle: { color: C.inkSec, fontSize: 12.5 }, axisLabel: axisLabelStyle, axisLine: { show: false }, splitLine: splitLineStyle, axisTick: { show: false } },
      yAxis: { type: 'value', name: '% tagged Frustrating →', nameLocation: 'middle', nameGap: 46, nameTextStyle: { color: C.inkSec, fontSize: 12.5 }, axisLabel: { formatter: '{value}%', color: C.inkSec, fontSize: 12 }, axisLine: { show: false }, splitLine: splitLineStyle, axisTick: { show: false }, min: 0, max: 85 },
      series
    }, true);
    onClick(inst, p => { if (p.componentType === 'series') emit('category', p.data.name); });
  }

  /* ============================= CHART 5 — top words, stacked bar by category ============================= */
  function buildChart5() {
    const inst = chart('chart5');
    const rows = DATA.wordStack.slice().reverse();
    const stackCats = DATA.wordStackCats;
    const palette = { [stackCats[0]]: C.blue, [stackCats[1]]: C.orange, [stackCats[2]]: C.aqua, [stackCats[3]]: C.yellow, 'Other': C.otherGray };

    const series = stackCats.map(cat => ({
      name: cat, type: 'bar', stack: 'words', barMaxWidth: 16, itemStyle: { color: palette[cat] || C.otherGray },
      data: rows.map(r => r[cat]), animationDuration: 900
    }));
    // invisible zero-height segment stacked on top, just to carry the total-value label past the bar's end
    series.push({
      name: 'total', type: 'bar', stack: 'words', barMaxWidth: 16, itemStyle: { color: 'transparent' },
      data: rows.map(() => 0),
      label: { show: true, position: 'right', color: C.inkSec, fontSize: 12, formatter: p => fmt(rows[p.dataIndex].total) },
      tooltip: { show: false }, silent: true
    });

    inst.setOption({
      textStyle: baseTextStyle,
      grid: { left: 90, right: 60, top: 10, bottom: 40, containLabel: true },
      tooltip: tooltipBase({
        trigger: 'axis', axisPointer: { type: 'shadow' },
        formatter: params => {
          const idx = params[0].dataIndex, r = rows[idx];
          let html = `<b>"${r.word}"</b> — ${fmt(r.total)} mentions total<br/>`;
          stackCats.forEach(cat => { html += `${cat}: ${fmt(r[cat])}<br/>`; });
          return html;
        }
      }),
      legend: { bottom: 0, itemWidth: 10, itemHeight: 10, icon: 'circle', textStyle: { color: C.inkSec, fontSize: 11 }, data: stackCats },
      xAxis: { type: 'value', axisLabel: axisLabelStyle, axisLine: { show: false }, splitLine: splitLineStyle, axisTick: { show: false } },
      yAxis: { type: 'category', data: rows.map(r => r.word), axisLabel: axisLabelStyle, axisLine: axisLineStyle, axisTick: { show: false } },
      series
    }, true);
    onClick(inst, p => { if (p.seriesName && stackCats.indexOf(p.seriesName) !== -1) emit('category', p.seriesName); });
  }

  /* ============================= CHART 6 — coping systems ============================= */
  function buildChart6() {
    const inst = chart('chart6');
    const entries = Object.entries(DATA.systems).sort((a, b) => b[1] - a[1]).reverse();
    inst.setOption({
      textStyle: baseTextStyle,
      grid: { left: 130, right: 60, top: 10, bottom: 10, containLabel: true },
      tooltip: tooltipBase({ formatter: p => `<b>${p.name}</b><br/>${fmt(p.value)} mentions` }),
      xAxis: { type: 'value', axisLabel: axisLabelStyle, axisLine: { show: false }, splitLine: splitLineStyle, axisTick: { show: false } },
      yAxis: { type: 'category', data: entries.map(e => e[0]), axisLabel: axisLabelStyle, axisLine: axisLineStyle, axisTick: { show: false } },
      series: [{
        type: 'bar', barMaxWidth: 20,
        data: entries.map(e => ({ value: e[1], name: e[0], itemStyle: { color: e[0] === 'Nothing at all' ? C.red : C.blue, borderRadius: [0, 4, 4, 0] } })),
        label: { show: true, position: 'right', color: C.inkSec, fontSize: 12, formatter: p => fmt(p.value) },
        animationDuration: 900
      }]
    }, true);
    onClick(inst, p => { if (p.componentType === 'series') emit('system', p.name); });
  }

  /* ============================= CHART 7a — age histogram ============================= */
  function buildChart7a() {
    const inst = chart('chart7a');
    const bins = Object.entries(DATA.ageBins);
    inst.setOption({
      textStyle: baseTextStyle,
      title: { text: 'Age distribution', left: 0, top: 0, textStyle: { fontSize: 13.5, color: C.ink, fontWeight: 600 } },
      grid: { left: 44, right: 20, top: 46, bottom: 30, containLabel: true },
      tooltip: tooltipBase({ formatter: p => `<b>${p.name}</b><br/>${fmt(p.value)} respondents` }),
      xAxis: { type: 'category', data: bins.map(b => b[0]), axisLabel: axisLabelStyle, axisLine: axisLineStyle, axisTick: { show: false } },
      yAxis: { type: 'value', axisLabel: axisLabelStyle, axisLine: { show: false }, splitLine: splitLineStyle, axisTick: { show: false } },
      series: [{
        type: 'bar', data: bins.map(b => b[1]), barMaxWidth: 40,
        itemStyle: { color: C.blue, borderRadius: [4, 4, 0, 0] },
        label: { show: true, position: 'top', color: C.inkSec, fontSize: 12 },
        animationDuration: 900
      }]
    }, true);
    onClick(inst, p => { if (p.componentType === 'series') emit('ageBin', p.name); });
  }

  /* ============================= CHART 7c — age x emotion ============================= */
  function buildChart7c() {
    const inst = chart('chart7c');
    const bins = Object.keys(DATA.ageBins);
    const order = ['Frustrating', 'Procrastinate', 'Repetitive'];
    inst.setOption({
      textStyle: baseTextStyle,
      title: { text: 'Emotion mix by age', left: 0, top: 0, textStyle: { fontSize: 13.5, color: C.ink, fontWeight: 600 } },
      grid: { left: 44, right: 16, top: 46, bottom: 56, containLabel: true },
      tooltip: tooltipBase({ trigger: 'axis', axisPointer: { type: 'shadow' } }),
      legend: { bottom: 0, itemWidth: 10, itemHeight: 10, icon: 'circle', textStyle: { color: C.inkSec, fontSize: 11 } },
      xAxis: { type: 'category', data: bins, axisLabel: axisLabelStyle, axisLine: axisLineStyle, axisTick: { show: false } },
      yAxis: { type: 'value', axisLabel: axisLabelStyle, axisLine: { show: false }, splitLine: splitLineStyle, axisTick: { show: false } },
      series: order.map(emo => ({
        name: emo, type: 'bar', barMaxWidth: 16, itemStyle: { color: EMO_COLOR[emo], borderRadius: [3, 3, 0, 0] },
        data: bins.map(b => DATA.ageEmotionMatrix[b][emo]), animationDuration: 900
      }))
    }, true);
    onClick(inst, p => { if (p.componentType === 'series') emit('emotion', p.seriesName); });
  }

  /* ============================= CHART 7b — top categories by age → heatmap ============================= */
  function buildChart7b() {
    const inst = chart('chart7b');
    const bins = Object.keys(DATA.ageBins);
    const cats = DATA.ageCatCats;
    let maxV = 0;
    const points = [];
    cats.forEach((cat, yi) => bins.forEach((bin, xi) => {
      const v = DATA.ageCatMatrix[bin][cat] || 0;
      maxV = Math.max(maxV, v);
      points.push({ cat, bin, xi, yi, v });
    }));

    inst.setOption({
      textStyle: baseTextStyle,
      title: { text: 'Top categories by age', left: 0, top: 0, textStyle: { fontSize: 13.5, color: C.ink, fontWeight: 600 } },
      grid: { left: 110, right: 16, top: 46, bottom: 20, containLabel: false },
      tooltip: tooltipBase({ formatter: p => `<b>${p.value[3]}</b> · ${bins[p.value[0]]}<br/>${fmt(p.value[2])} tags` }),
      xAxis: { type: 'category', data: bins, splitArea: { show: true }, axisLabel: axisLabelStyle, axisLine: { show: false }, axisTick: { show: false } },
      yAxis: { type: 'category', data: cats, splitArea: { show: true }, axisLabel: axisLabelStyle, axisLine: { show: false }, axisTick: { show: false } },
      visualMap: { show: false, min: 0, max: maxV, dimension: 2, inRange: { color: C.seq } },
      series: [{
        type: 'heatmap',
        data: points.map(p => [p.xi, p.yi, p.v, p.cat]),
        itemStyle: { borderColor: C.surface, borderWidth: 2, borderRadius: 3 },
        emphasis: { itemStyle: { borderColor: C.ink, borderWidth: 2 } },
        animationDuration: 700
      }]
    }, true);
    onClick(inst, p => { if (p.componentType === 'series') emit('category', p.value[3]); });
  }

  /* ============================= CHART 8 — geography ============================= */
  function buildChart8() {
    const inst = chart('chart8');
    const data = DATA.cities.slice().reverse();
    inst.setOption({
      textStyle: baseTextStyle,
      grid: { left: 110, right: 60, top: 10, bottom: 10, containLabel: true },
      tooltip: tooltipBase({ formatter: p => `<b>${p.name}</b><br/>${fmt(p.value)} respondents` }),
      xAxis: { type: 'value', axisLabel: axisLabelStyle, axisLine: { show: false }, splitLine: splitLineStyle, axisTick: { show: false } },
      yAxis: { type: 'category', data: data.map(d => d[0]), axisLabel: axisLabelStyle, axisLine: axisLineStyle, axisTick: { show: false } },
      series: [{
        type: 'bar', data: data.map(d => d[1]), barMaxWidth: 16,
        itemStyle: { color: C.blue, borderRadius: [0, 4, 4, 0] },
        label: { show: true, position: 'right', color: C.inkSec, fontSize: 12, formatter: p => fmt(p.value) },
        animationDuration: 900
      }]
    }, true);
    onClick(inst, p => { if (p.componentType === 'series') emit('city', p.name); });
  }

  /* ============================= CHART 9 — story length: shortest / average / longest ============================= */
  function buildChart9() {
    const inst = chart('chart9');
    const emotions = ['Frustrating', 'Procrastinate', 'Repetitive'].filter(e => DATA.storyExtremes[e]);
    const metrics = [{ key: 'Shortest', color: C.seq[1] }, { key: 'Average', color: C.seq[3] }, { key: 'Longest', color: C.seq[5] }];

    const series = metrics.map(m => ({
      name: m.key, type: 'bar', barMaxWidth: 30, itemStyle: { color: m.color, borderRadius: [4, 4, 0, 0] },
      label: { show: true, position: 'top', color: C.inkSec, fontSize: 11.5, fontWeight: 600 },
      data: emotions.map(emo => {
        const ex = DATA.storyExtremes[emo];
        const value = m.key === 'Average' ? ex.avg : (m.key === 'Shortest' ? ex.shortest.words : ex.longest.words);
        return { value, emotion: emo, metric: m.key };
      }),
      animationDuration: 900
    }));

    inst.setOption({
      textStyle: baseTextStyle,
      grid: { left: 50, right: 30, top: 40, bottom: 56, containLabel: true },
      tooltip: tooltipBase({
        trigger: 'item',
        extraCssText: 'box-shadow:0 6px 20px rgba(11,11,11,0.10); border-radius:8px; padding:12px 14px; max-width:320px; white-space:normal; line-height:1.5;',
        formatter: p => {
          const emo = p.data.emotion, ex = DATA.storyExtremes[emo];
          if (p.data.metric === 'Average') return `<b>${emo} · Average</b><br/>${ex.avg} words per story, across ${fmt(ex.n)} stories`;
          const detail = p.data.metric === 'Shortest' ? ex.shortest : ex.longest;
          const quoteText = p.data.metric === 'Longest' ? truncateWords(detail.text, 55) : detail.text;
          return `<b>${emo} · ${p.data.metric}</b> — ${detail.words} words<br/>
            <span style="color:${C.muted}; font-size:11.5px;">from a ${detail.cat} story</span><br/>
            <span style="font-style:italic; color:${C.ink};">"${escapeHtml(quoteText)}"</span>`;
        }
      }),
      legend: { bottom: 0, itemWidth: 10, itemHeight: 10, icon: 'circle', textStyle: { color: C.inkSec, fontSize: 11.5 } },
      xAxis: { type: 'category', data: emotions, axisLabel: Object.assign({}, axisLabelStyle, { fontWeight: 600 }), axisLine: axisLineStyle, axisTick: { show: false } },
      yAxis: { type: 'value', name: 'words', nameLocation: 'end', nameGap: 16, nameTextStyle: { color: C.muted, fontSize: 11 }, axisLabel: axisLabelStyle, axisLine: { show: false }, splitLine: splitLineStyle, axisTick: { show: false } },
      series
    }, true);
    onClick(inst, p => { if (p.componentType === 'series') emit('emotion', p.data.emotion); });
  }

  function renderAll(data) {
    DATA = data;
    buildChart1(); buildChart2(); buildChart3(); buildChart4(); buildChart5();
    buildChart6(); buildChart7a(); buildChart7c(); buildChart7b(); buildChart8(); buildChart9();
  }

  function resize() { Object.values(instances).forEach(c => c && c.resize()); }

  return { renderAll, resize, C, EMO_COLOR, fmt, instances };
})();
