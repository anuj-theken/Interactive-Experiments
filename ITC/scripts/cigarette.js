// scripts/cigarette.js — QW4K11

document.addEventListener("DOMContentLoaded", function () {
    const chartDom = document.getElementById('QW4K11-main-chart');
    const legendDom = document.getElementById('QW4K11-legend');
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);

    function getColor(name) {
        return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    }

    function isMobile() {
        return window.innerWidth <= 768;
    }

    const columnTotals = [73467, 26531, 0, 80868, 26768];

    const categories = ['Cigarettes', 'Other FMCG', 'Agri Business', 'Paper & Packaging', 'Others / Inter-segment Adjustments'];
    const shortNames = {
        'Cigarettes': 'Cigarettes',
        'Other FMCG': 'Other FMCG',
        'Agri Business': 'Agri Business',
        'Paper & Packaging': 'Paper & Packaging',
        'Others / Inter-segment Adjustments': 'Others / Adj.'
    };

    // Bar look/colors are the chart's own data-encoding (cigarettes highlighted
    // amber, other segments in neutral greys, net adjustments in red) and are
    // kept exactly as authored in the source prototype — not tokenized.
    const seriesStyle = {
        'Cigarettes':                          { color: '#d97706', borderColor: '#b45309' },
        'Other FMCG':                          { color: '#fafaf9', borderColor: '#e4e4e7' },
        'Agri Business':                        { color: '#e7e5e4', borderColor: '#d4d4d8' },
        'Paper & Packaging':                    { color: '#d6d3d1', borderColor: '#a1a1aa' },
        'Others / Inter-segment Adjustments':   { color: '#dc2626', borderColor: '#b91c1c' }
    };

    const seriesData = {
        'Cigarettes':                          [32631, 20025, 0, 37100, 21051],
        'Other FMCG':                          [21982, 1580, 0, 24210, 1803],
        'Agri Business':                        [19754, 1478, 0, 20296, 1496],
        'Paper & Packaging':                    [8423, 911, 0, 8766, 797],
        'Others / Inter-segment Adjustments':   [-9323, 2537, 0, -9504, 1621]
    };

    function buildOption() {
        const mobile = isMobile();

        const series = categories.map(function (cat) {
            const style = seriesStyle[cat];
            const isFirst = cat === 'Cigarettes';
            const isLast = cat === 'Others / Inter-segment Adjustments';

            return {
                name: cat,
                type: 'bar',
                stack: 'Total',
                barWidth: isFirst ? (mobile ? '80%' : '70%') : undefined,
                itemStyle: {
                    color: style.color,
                    borderColor: style.borderColor,
                    borderWidth: 1,
                    borderRadius: isLast ? [4, 4, 0, 0] : 0
                },
                label: {
                    show: true,
                    position: 'inside',
                    textStyle: {
                        color: isFirst || isLast ? '#ffffff' : getColor('--color-muted'),
                        fontSize: isFirst ? (mobile ? 11 : 12) : 10,
                        fontWeight: isFirst || isLast ? 'bold' : '600'
                    },
                    formatter: function (params) {
                        const total = columnTotals[params.dataIndex];
                        const minAbs = isFirst ? 0 : (isLast ? 1200 : 2000);
                        if (total === 0 || Math.abs(params.value) < minAbs) return '';
                        const pct = Math.round((params.value / total) * 100);
                        return pct + '%';
                    }
                },
                data: seriesData[cat]
            };
        });

        return {
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                borderWidth: 1,
                borderColor: '#ccc',
                textStyle: { color: '#333', fontSize: mobile ? 11 : 13 },
                formatter: function (params) {
                    const title = params[0].axisValue;
                    if (title === '') return null;
                    let html = '<b>' + title + '</b><br/>';
                    let total = 0;
                    params.forEach(function (item) {
                        if (item.value !== 0) {
                            html += item.marker + ' ' + item.seriesName + ': <b>' + item.value.toLocaleString() + ' cr</b><br/>';
                            total += item.value;
                        }
                    });
                    html += '<hr style="margin:5px 0;border:0;border-top:1px solid #e2e8f0;"/>';
                    html += 'Gross Total: <b>' + total.toLocaleString() + ' cr</b>';
                    return html;
                }
            },
            legend: { data: categories, show: false },
            grid: {
                left: '2%',
                right: '2%',
                bottom: '4%',
                top: mobile ? '8%' : '4%',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                data: [
                    'FY25\nGross Revenue',
                    'FY25\nSegment Profit',
                    '',
                    'FY26\nGross Revenue',
                    'FY26\nSegment Profit'
                ],
                axisTick: {
                    alignWithLabel: true,
                    interval: function (index) { return index !== 2; }
                },
                axisLabel: {
                    color: getColor('--color-text'),
                    fontSize: mobile ? 10 : 12,
                    fontWeight: '600',
                    lineHeight: 14
                }
            }],
            yAxis: [{
                type: 'value',
                axisLabel: { color: getColor('--color-muted') },
                splitLine: { lineStyle: { type: 'dashed', color: '#e0e0e0' } }
            }],
            series: series
        };
    }

    const legendItemEls = {};

    function buildLegend() {
        if (!legendDom) return;
        legendDom.innerHTML = '';

        categories.forEach(function (cat) {
            const item = document.createElement('div');
            item.className = 'QW4K11-legend-item';

            const dot = document.createElement('span');
            dot.className = 'QW4K11-legend-dot';
            dot.style.backgroundColor = seriesStyle[cat].color;

            const label = document.createElement('span');
            label.textContent = shortNames[cat] || cat;

            item.appendChild(dot);
            item.appendChild(label);
            item.addEventListener('click', function () {
                myChart.dispatchAction({ type: 'legendToggleSelect', name: cat });
            });

            legendDom.appendChild(item);
            legendItemEls[cat] = item;
        });
    }

    myChart.on('legendselectchanged', function (params) {
        categories.forEach(function (cat) {
            const el = legendItemEls[cat];
            if (el) el.classList.toggle('is-inactive', !params.selected[cat]);
        });
    });

    buildLegend();
    myChart.setOption(buildOption());

    let resizeTimer = null;
    window.addEventListener('resize', function () {
        myChart.resize();
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            myChart.setOption(buildOption(), true);
            buildLegend();
        }, 150);
    });
});
