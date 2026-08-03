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

    // Column order: [FY23 Rev, FY23 Profit, spacer, FY24 Rev, FY24 Profit, spacer,
    //                FY25 Rev, FY25 Profit, spacer, FY26 Rev, FY26 Profit]
    // FY25/FY26 figures are unchanged from before — only FY23/FY24 columns were added.
    const columnTotals = [69481, 24750, 0, 69446, 26316, 0, 73467, 26531, 0, 80868, 26768];

    // FY23/FY24 source data (market.png) reports Hotels as its own segment,
    // but Inter-Segment Revenue and Other Adjustments are folded together
    // with the legacy FY25/FY26 "Others / Inter-segment Adjustments" bucket
    // into one combined "Others" series (matches the original FY25/FY26 model).
    const categories = ['Cigarettes', 'Other FMCG', 'Agri Business', 'Paper & Packaging', 'Hotels', 'Others'];
    const shortNames = {
        'Cigarettes': 'Cigarettes',
        'Other FMCG': 'Other FMCG',
        'Agri Business': 'Agri Business',
        'Paper & Packaging': 'Paper & Packaging',
        'Hotels': 'Hotels',
        'Others': 'Others / Adj.'
    };

    // Bar look/colors are the chart's own data-encoding (cigarettes highlighted
    // amber, other segments in neutral greys, net adjustments in red) and are
    // kept exactly as authored in the source prototype — not tokenized.
    const seriesStyle = {
        'Cigarettes':          { color: '#d97706', borderColor: '#b45309' },
        'Other FMCG':          { color: '#fafaf9', borderColor: '#e4e4e7' },
        'Agri Business':       { color: '#e7e5e4', borderColor: '#d4d4d8' },
        'Paper & Packaging':   { color: '#d6d3d1', borderColor: '#d4d4d8' },
        'Hotels':              { color: '#c9c2b8', borderColor: '#a89f92' },
        'Others':              { color: '#dc2626', borderColor: '#b91c1c' }
    };

    const seriesData = {
        'Cigarettes':          [28207, 17927, 0, 30597, 19089, 0, 32631, 20025, 0, 37100, 21051],
        'Other FMCG':          [19123, 1374, 0, 20967, 1779, 0, 21982, 1580, 0, 24210, 1803],
        'Agri Business':       [18172, 1328, 0, 15792, 1254, 0, 19754, 1478, 0, 20296, 1496],
        'Paper & Packaging':   [9081, 2294, 0, 8344, 1378, 0, 8423, 911, 0, 8766, 797],
        'Hotels':              [2585, 542, 0, 2990, 754, 0, 0, 0, 0, 0, 0],
        // Inter-Segment Revenue (FY23/24) + Other Adjustments (FY23/24) + legacy Others/Inter-segment Adjustments (FY25/26)
        'Others':              [-7687, 1285, 0, -9243, 2062, 0, -9323, 2537, 0, -9504, 1621]
    };

    function buildOption() {
        const mobile = isMobile();

        const series = categories.map(function (cat) {
            const style = seriesStyle[cat];
            const isFirst = cat === 'Cigarettes';
            // the last series drawn in each column type (revenue vs profit)
            // caps the stack — gets the rounded top and bold white label
            const isCapping = cat === 'Others';

            return {
                name: cat,
                type: 'bar',
                stack: 'Total',
                barWidth: isFirst ? (mobile ? '80%' : '70%') : undefined,
                itemStyle: {
                    color: style.color,
                    borderColor: style.borderColor,
                    borderWidth: 1,
                    borderRadius: 0
                },
                label: {
                    show: !mobile,
                    position: 'inside',
                    textStyle: {
                        color: isFirst || isCapping ? '#ffffff' : getColor('--color-muted'),
                        fontSize: isFirst ? (mobile ? 11 : 12) : 10,
                        fontWeight: isFirst || isCapping ? 'bold' : '600'
                    },
                    formatter: function (params) {
                        const total = columnTotals[params.dataIndex];
                        const minAbs = isFirst ? 0 : (isCapping ? 1200 : 2000);
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
                            html += item.marker + ' ' + item.seriesName + ': <b>Rs. ' + item.value.toLocaleString() + ' cr</b><br/>';
                            total += item.value;
                        }
                    });
                    html += '<hr style="margin:5px 0;border:0;border-top:1px solid #e2e8f0;"/>';
                    html += 'Gross Total: <b>Rs. ' + total.toLocaleString() + ' cr</b>';
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
                // full qualifiers ("Gross Revenue"/"Segment Profit") fit
                // fine at desktop's per-category width, but at mobile's much
                // narrower slots they're what forced the rotation/collision
                // above — shortened to just the metric name there instead
                data: mobile ? [
                    'FY23\nRevenue',
                    'FY23\nProfit',
                    '',
                    'FY24\nRevenue',
                    'FY24\nProfit',
                    '',
                    'FY25\nRevenue',
                    'FY25\nProfit',
                    '',
                    'FY26\nRevenue',
                    'FY26\nProfit'
                ] : [
                    'FY23\nGross Revenue',
                    'FY23\nSegment Profit',
                    '',
                    'FY24\nGross Revenue',
                    'FY24\nSegment Profit',
                    '',
                    'FY25\nGross Revenue',
                    'FY25\nSegment Profit',
                    '',
                    'FY26\nGross Revenue',
                    'FY26\nSegment Profit'
                ],
                axisTick: {
                    alignWithLabel: true,
                    interval: function (index) { return index !== 2 && index !== 5 && index !== 8; }
                },
                axisLabel: {
                    color: getColor('--color-text'),
                    fontSize: mobile ? 10 : 12,
                    fontWeight: '600',
                    lineHeight: 14,
                    // default interval:'auto' hides labels it judges as
                    // colliding, but its collision check doesn't know the
                    // 3 empty spacer categories are blank — the labels it
                    // keeps end up an inconsistent, unpredictable mix (e.g.
                    // "Segment Profit" surviving for one FY, "Gross Revenue"
                    // for the next). interval:0 forces every real label to
                    // show; rotating on mobile keeps the narrower two-line
                    // labels from overlapping in that tighter slot width.
                    interval: 0,
                    rotate: mobile ? 45 : 0
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
