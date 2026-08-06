// scripts/hotels.js — QW4K12

document.addEventListener("DOMContentLoaded", function () {
    const chartDom = document.getElementById('QW4K12-pie-chart');
    const legendDom = document.getElementById('QW4K12-legend');
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);

    function getColor(name) {
        return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    }

    // Portfolio mix (Owned vs Managed) — independent of the 5 brand
    // logos floating around the donut, which are static context callouts.
    const categories = [
        { key: 'Owned', label: 'Owned', value: 45 },
        { key: 'Managed', label: 'Managed', value: 55 }
    ];

    function palette() {
        return [getColor('--color-primary'), getColor('--color-secondary')];
    }

    function buildOption() {
        const colors = palette();
        return {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'item',
                formatter: '{b}: <strong>{c}%</strong>'
            },
            legend: { data: categories.map(function (c) { return c.key; }), show: false },
            series: [{
                name: 'Portfolio Mix',
                type: 'pie',
                radius: ['38%', '58%'],
                center: ['50%', '52%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 0,
                    borderWidth: 0,
                    shadowBlur: 14,
                    shadowColor: 'rgba(0, 0, 0, 0.35)',
                    shadowOffsetY: 4
                },
                label: {
                    show: true,
                    position: 'inside',
                    formatter: '{c}%',
                    fontFamily: 'Archivo',
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: '#fff'
                },
                emphasis: {
                    label: { show: true, fontSize: 16 }
                },
                color: colors,
                data: categories.map(function (c) { return { value: c.value, name: c.key }; })
            }]
        };
    }

    const legendItemEls = {};

    function buildLegend() {
        if (!legendDom) return;
        legendDom.innerHTML = '';
        const colors = palette();

        categories.forEach(function (cat, idx) {
            const item = document.createElement('div');
            item.className = 'QW4K12-legend-item';

            const swatch = document.createElement('div');
            swatch.className = 'QW4K12-legend-color';
            swatch.style.backgroundColor = colors[idx];

            const text = document.createElement('div');
            text.className = 'QW4K12-legend-text';
            text.innerHTML = '<span>' + cat.label + ' - <span class="QW4K12-legend-value">' + cat.value + '%</span></span>';

            item.appendChild(swatch);
            item.appendChild(text);
            item.addEventListener('click', function () {
                myChart.dispatchAction({ type: 'legendToggleSelect', name: cat.key });
            });

            legendDom.appendChild(item);
            legendItemEls[cat.key] = item;
        });
    }

    myChart.on('legendselectchanged', function (params) {
        categories.forEach(function (cat) {
            const el = legendItemEls[cat.key];
            if (el) el.classList.toggle('is-inactive', !params.selected[cat.key]);
        });
    });

    buildLegend();
    myChart.setOption(buildOption());

    window.addEventListener('resize', function () {
        myChart.resize();
    });
});
