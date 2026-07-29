// scripts/comparison.js — QW4K4 (replaces the old brands.js module)

document.addEventListener("DOMContentLoaded", function () {
    const driver = document.getElementById('QW4K4-driver');
    if (!driver) return;

    function getColor(name) {
        return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    }

    function hexToRgba(hex, alpha) {
        const h = hex.replace('#', '');
        const r = parseInt(h.substring(0, 2), 16);
        const g = parseInt(h.substring(2, 4), 16);
        const b = parseInt(h.substring(4, 6), 16);
        return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
    }

    function isMobile() {
        return window.innerWidth <= 1023;
    }

    const labelConfig = {
        show: true,
        position: 'inside',
        formatter: function (params) {
            return params.value > 0 ? params.seriesName + '\n' + params.value + '%' : '';
        },
        color: '#ffffff',
        fontSize: 9,
        fontWeight: 'bold'
    };

    const gridConfig = { left: '4%', right: '6%', bottom: '5%', top: '10%', containLabel: true };

    function axisTextStyle() {
        return { color: getColor('--color-muted'), fontSize: 10, fontWeight: 500 };
    }

    // Each chart definition: ITC's own brand always keyed to --color-primary so the
    // "our brand" thread reads consistently across all three comparisons; competitors
    // pull the remaining design-system tokens instead of the source's hardcoded hexes.
    const chartDefs = [
        {
            id: 'QW4K4-chart1',
            legendId: 'QW4K4-legend1',
            categories: ['2003', '2021', '2023'],
            series: [
                { name: 'Britannia & Parle', data: [80, 0, 0], colorVar: '--color-muted' },
                { name: 'Sunfeast', data: [0, 7.3, 0], colorVar: '--color-primary' },
                { name: 'Britannia', data: [0, 0, 31], colorVar: '--color-secondary' },
                { name: 'Parle', data: [0, 0, 29], colorVar: '--color-accent' }
            ]
        },
        {
            id: 'QW4K4-chart2',
            legendId: 'QW4K4-legend2',
            categories: ['2007'],
            series: [
                { name: 'Bingo! (ITC)', data: [16], colorVar: '--color-primary' },
                { name: 'Frito-Lay (PepsiCo)', data: [50], colorVar: '--color-secondary' },
                { name: "Haldiram's", data: [25], colorVar: '--color-accent' }
            ]
        },
        {
            id: 'QW4K4-chart3',
            legendId: 'QW4K4-legend3',
            categories: ['2016', '2026'],
            series: [
                { name: 'Yippee (Min)', data: [30, 22], colorVar: '--color-primary' },
                { name: 'Yippee (Max)', data: [10, 0], colorVar: '--color-primary-alpha' },
                { name: 'Nestlé Maggi', data: [50, 66], colorVar: '--color-secondary' }
            ]
        }
    ];

    function seriesColor(colorVar) {
        if (colorVar === '--color-primary-alpha') return hexToRgba(getColor('--color-primary'), 0.45);
        if (colorVar === '--color-other') return '#d1d5db';
        return getColor(colorVar);
    }

    // Every chart's real series rarely add up to 100% on their own (older
    // periods pre-date some competitors, minor players are left out) — an
    // "Other" segment fills the remainder so every bar reads as a full 100%.
    function seriesWithOther(def) {
        const totals = new Array(def.categories.length).fill(0);
        def.series.forEach(function (s) {
            s.data.forEach(function (v, i) { totals[i] += v; });
        });
        const otherData = totals.map(function (t) {
            return Math.max(0, Math.round((100 - t) * 100) / 100);
        });
        return def.series.concat([{ name: 'Other', data: otherData, colorVar: '--color-other' }]);
    }

    const charts = chartDefs.map(function (def) {
        const dom = document.getElementById(def.id);
        return { def: def, chart: dom ? echarts.init(dom) : null, legendDom: document.getElementById(def.legendId) };
    });

    function buildOption(def) {
        const allSeries = seriesWithOther(def);
        const series = allSeries.map(function (s) {
            return {
                name: s.name,
                type: 'bar',
                stack: 'total',
                label: labelConfig,
                itemStyle: { color: seriesColor(s.colorVar) },
                data: s.data
            };
        });

        return {
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
            legend: { data: allSeries.map(function (s) { return s.name; }), show: false },
            grid: gridConfig,
            xAxis: {
                type: 'category', data: def.categories,
                axisLine: { lineStyle: { color: 'rgba(0,0,0,0.15)' } },
                axisLabel: { textStyle: axisTextStyle() }
            },
            yAxis: {
                type: 'value', min: 0, max: 100,
                axisLabel: { formatter: '{value}%', textStyle: axisTextStyle() },
                splitLine: { lineStyle: { color: 'rgba(0,0,0,0.06)' } }
            },
            series: series
        };
    }

    const legendItemEls = {};

    function buildLegend(entry) {
        if (!entry.legendDom) return;
        entry.legendDom.innerHTML = '';
        legendItemEls[entry.def.id] = {};

        seriesWithOther(entry.def).forEach(function (s) {
            const item = document.createElement('div');
            item.className = 'QW4K4-legend-item';

            const dot = document.createElement('span');
            dot.className = 'QW4K4-legend-dot';
            dot.style.backgroundColor = seriesColor(s.colorVar);

            const label = document.createElement('span');
            label.textContent = s.name;

            item.appendChild(dot);
            item.appendChild(label);
            item.addEventListener('click', function () {
                entry.chart.dispatchAction({ type: 'legendToggleSelect', name: s.name });
            });

            entry.legendDom.appendChild(item);
            legendItemEls[entry.def.id][s.name] = item;
        });
    }

    charts.forEach(function (entry) {
        if (!entry.chart) return;
        entry.chart.setOption(buildOption(entry.def));
        buildLegend(entry);

        entry.chart.on('legendselectchanged', function (params) {
            const els = legendItemEls[entry.def.id];
            seriesWithOther(entry.def).forEach(function (s) {
                const el = els[s.name];
                if (el) el.classList.toggle('is-inactive', !params.selected[s.name]);
            });
        });
    });

    window.addEventListener('resize', function () {
        charts.forEach(function (entry) { if (entry.chart) entry.chart.resize(); });
    });

    // ---- Scroll-driven step highlighting (chart wraps + narrative cards) ----
    const wraps = [
        document.getElementById('QW4K4-chart1-wrap'),
        document.getElementById('QW4K4-chart2-wrap'),
        document.getElementById('QW4K4-chart3-wrap')
    ];
    const cards = document.querySelectorAll('.QW4K4-narrative-card');
    let currentStep = -1;

    function goTo(i) {
        if (i === currentStep) return;
        currentStep = i;
        const mobile = isMobile();

        wraps.forEach(function (wrap, k) {
            if (!wrap) return;
            const active = k === i;
            gsap.to(wrap, {
                opacity: active ? 1 : (mobile ? 0 : 0.15),
                scale: active ? 1.01 : 1,
                duration: 0.3
            });
        });

        cards.forEach(function (card) {
            const active = Number(card.getAttribute('data-step')) === i;
            gsap.to(card, { opacity: active ? 1 : 0, duration: 0.3 });
        });
    }

    gsap.set(wraps.filter(Boolean), { opacity: isMobile() ? 0 : 0.15 });
    goTo(0);

    ScrollTrigger.create({
        trigger: '#QW4K4-driver',
        start: 'top top',
        end: 'bottom bottom',
        pin: '#QW4K4-pin',
        onUpdate: function (self) {
            const i = Math.min(chartDefs.length - 1, Math.floor(self.progress * chartDefs.length));
            goTo(i);
        }
    });
});
