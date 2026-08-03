// scripts/shareholding.js

document.addEventListener("DOMContentLoaded", function () {
    // 1. DOM reference
    const chartDom = document.getElementById('QW4K1-main-chart');
    const legendDom = document.getElementById('QW4K1-legend');
    if (!chartDom) return;

    // 2. Library init
    const myChart = echarts.init(chartDom);

    // 3. Data configuration
    const timeline = ["1950", "1954", "1970", "1974", "1976", "1985", "1993", "2001", "2005", "2010", "2011", "2020", "2023", "2024", "2025", "2026"];

    const fullFormMap = {
        'Foreign Institutional Investors (FIIs)': 'Foreign Institutional Investors (FIIs)',
        'Domestic Institutional Investors (Government Backed)': 'Domestic Institutional Investors (DIIs - Government Backed)',
        'Public': 'Public Shareholders'
    };

    const rawData = {
        'Foreign Institutional Investors (FIIs)': {
            total: [43, 43, 41, 40, 41, 40, 40, 38, 37, 36, 35, 34, 40, 36, 34, 32],
            breakdown: {
                'Tobacco Manufacturers (India) Ltd (BAT)': [24, 24, 20, 20, 20, 20, 20, 18, 18, 18, 18, 18, 18, 14, 14, 14],
                'Myddleton Investment Co. Ltd (BAT)': [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
                'Rothmans International Enterprises (BAT)': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                'GQG Partners Emerging Markets Equity Fund': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 1],
                'Goldman Sachs Trust II - GS GQG': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2],
                'Government of Singapore': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
                'Other Balancing Foreign Institutional Investors': [13, 13, 15, 14, 15, 13, 13, 14, 12, 11, 10, 10, 13, 13, 11, 10]
            }
        },
        'Domestic Institutional Investors (Government Backed)': {
            total: [0, 0.04, 0.09, 10.04, 19.04, 28.04, 34.04, 38.04, 35.04, 34.04, 37.04, 36.04, 42.04, 45.04, 47.04, 49.04],
            breakdown: {
                'Central / State Government Holdings': [0, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04],
                'Life Insurance Corporation of India': [0, 0, 0.05, 5, 10, 12, 14, 15, 15, 15, 15, 15, 15, 15, 16, 16],
                'Specified Undertaking of the Unit Trust of India (SUUTI)': [0, 0, 0, 2, 4, 6, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
                'General Insurance Corporation of India': [0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
                'The New India Assurance Company Ltd': [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                'The Oriental Insurance Company Ltd': [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                'SBI Mutual Funds': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3],
                'ICICI Prudential Mutual Funds': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 0, 0],
                'Parag Parikh Mutual Funds': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0],
                'NPS Trust (Pension Funds)': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0],
                'Nippon Life India Trustee MFs': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
                'Parag Parikh Flexi Cap MF': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
                'SBI Nifty 50 ETF': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
                'UTI Mutual Funds': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
                'HDFC Mutual Funds': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
                'Mirae Asset Mutual Funds': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
                'Balancing Figure (Other DIIs)': [0, 0, 0, 2, 2, 6, 8, 12, 9, 8, 10, 10, 4, 5, 18, 22]
            }
        },
        'Public': {
            total: [57, 56.96, 58.91, 49.96, 39.96, 31.96, 25.96, 23.96, 27.96, 29.96, 27.96, 29.96, 17.96, 18.96, 18.96, 18.96],
            breakdown: {
                'Retail Public': [7, 15, 21, 32, 33, 31, 21, 11, 16, 18, 19, 15, 15, 15, 15, 16],
                'Non-Institutional & Other Public Corporates': [50, 41.96, 37.91, 17.96, 6.96, 0.96, 4.96, 12.96, 11.96, 11.96, 8.96, 14.96, 2.96, 3.96, 3.96, 2.96]
            }
        }
    };

    const categories = [
        'Foreign Institutional Investors (FIIs)',
        'Domestic Institutional Investors (Government Backed)',
        'Public'
    ];
    const shortNames = {
        'Foreign Institutional Investors (FIIs)': 'FIIs',
        'Domestic Institutional Investors (Government Backed)': 'DIIs (Govt)',
        'Public': 'Public'
    };

    function isMobile() {
        return window.innerWidth <= 768;
    }

    function getDesignSystemColors() {
        const rootStyle = getComputedStyle(document.documentElement);
        return [
            rootStyle.getPropertyValue('--color-primary').trim(),
            rootStyle.getPropertyValue('--color-secondary').trim(),
            rootStyle.getPropertyValue('--color-accent').trim()
        ];
    }

    function tooltipPosition(point, params, dom, rect, size) {
        let x = point[0] - size.contentSize[0] / 2;
        x = Math.max(10, Math.min(x, size.viewSize[0] - size.contentSize[0] - 10));
        const y = size.viewSize[1] - size.contentSize[1] - 10;
        return [x, Math.max(10, y)];
    }

    function tooltipFormatter(param, desktop) {
        const dataIndex = param.dataIndex;
        const timePeriod = param.name;
        const catName = param.seriesName;
        const catTotal = param.value;
        const catColor = param.color;

        if (catTotal === 0) return '';

        const fullTitle = fullFormMap[catName] || catName;

        const headerSize = desktop ? '14px' : '13px';
        const catSize = desktop ? '14px' : '13px';
        const labelSize = desktop ? '12px' : '0.95em';
        const listSize = desktop ? '12.5px' : '0.9em';
        const listMaxWidth = desktop ? '340px' : '220px';
        const dotSize = desktop ? '10px' : '8px';
        // caps the WHOLE tooltip's width on mobile (not just the <ul>) so a
        // long unbroken category name can't force the box wider than the
        // screen — every line inside inherits the wrap from this container
        const outerMaxWidth = desktop ? '360px' : '240px';

        let tooltipHtml = `
            <div style="max-width: ${outerMaxWidth}; white-space: normal; overflow-wrap: break-word;">
            <div style="font-weight: bold; margin-bottom: 6px; border-bottom: 1px solid #ddd; padding-bottom: 3px; font-size: ${headerSize};">
                Period: ${timePeriod}
            </div>
            <div style="margin-bottom: 6px; font-size: ${catSize};">
                <span style="display:inline-block;margin-right:5px;border-radius:10px;width:${dotSize};height:${dotSize};background-color:${catColor};"></span>
                <strong style="color:${catColor}">${fullTitle}: ${catTotal.toFixed(2)}%</strong>
            </div>
            <div style="margin-top: 3px; color:#666; font-size: ${labelSize}; padding-left: 4px;">Active Entities:</div>
            <ul style="margin: 3px 0 0 0; padding-left: 16px; font-size: ${listSize}; color: #444; max-width: ${listMaxWidth}; white-space: normal; overflow-wrap: break-word; line-height: 1.4em;">
        `;

        const subcats = rawData[catName].breakdown;
        let holdsData = false;

        for (const [subcatName, values] of Object.entries(subcats)) {
            const val = values[dataIndex];
            if (val > 0) {
                tooltipHtml += `<li style="margin-bottom: 2px;">${subcatName}</li>`;
                holdsData = true;
            }
        }

        if (!holdsData) {
            tooltipHtml += `<li style="list-style-type: none; padding-left:0;">No specific constituent sub-entities</li>`;
        }

        tooltipHtml += `</ul></div>`;
        return tooltipHtml;
    }

    function buildOption() {
        const mobile = isMobile();
        const desktop = window.innerWidth > 1023;
        const colors = getDesignSystemColors();

        const series = categories.map((cat, idx) => {
            return {
                name: cat,
                type: 'bar',
                stack: 'total',
                emphasis: { focus: 'series' },
                itemStyle: { color: colors[idx] },
                barWidth: '75%',
                barGap: '5%',
                label: {
                    show: !mobile,
                    position: 'inside',
                    formatter: function (params) {
                        return params.value > 3 ? params.value.toFixed(0) + '%' : '';
                    },
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 'bold'
                },
                data: rawData[cat].total
            };
        });

        const tooltipConfig = {
            trigger: 'item',
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            borderWidth: 1,
            borderColor: '#ccc',
            textStyle: { color: '#333', fontSize: desktop ? 14 : 11 },
            shadowBlur: 8,
            shadowColor: 'rgba(0,0,0,0.1)',
            confine: true,
            formatter: function (param) {
                return tooltipFormatter(param, desktop);
            }
        };
        // Desktop: follow the cursor (default echarts behavior, kept inside the chart via confine).
        // iPad/mobile: hover isn't a real gesture there, so pin the tooltip to the chart's bottom edge to avoid clipping.
        if (!desktop) {
            tooltipConfig.position = tooltipPosition;
        }

        return {
            tooltip: tooltipConfig,
            legend: {
                data: categories,
                show: false
            },
            grid: {
                left: '2%',
                right: '2%',
                bottom: mobile ? '18%' : '5%',
                top: '5%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: timeline,
                axisLabel: {
                    rotate: mobile ? 90 : 45,
                    interval: 0,
                    fontSize: 12,
                    color: '#333',
                    fontWeight: '500'
                },
                axisTick: { alignWithLabel: true }
            },
            yAxis: {
                type: 'value',
                min: 0,
                max: 100,
                axisLabel: { formatter: '{value}%', fontSize: 12 }
            },
            series: series
        };
    }

    // 4. Custom HTML legend — lives in the chart header, toggles series via echarts' hidden legend model
    const legendItemEls = {};

    function buildLegend() {
        if (!legendDom) return;
        legendDom.innerHTML = '';

        categories.forEach(function (cat) {
            const item = document.createElement('div');
            item.className = 'QW4K1-legend-item';

            const dot = document.createElement('span');
            dot.className = 'QW4K1-legend-dot';
            const colors = getDesignSystemColors();
            dot.style.backgroundColor = colors[categories.indexOf(cat)];

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

    // 5. Render
    buildLegend();
    myChart.setOption(buildOption());

    // 6. Layout updates
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
