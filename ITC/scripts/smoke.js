// scripts/smoke.js — QW4K7

document.addEventListener("DOMContentLoaded", function () {
    const chartDom = document.getElementById('QW4K7-main-chart');
    const legendDom = document.getElementById('QW4K7-custom-legend');
    if (!chartDom || !legendDom) return;

    const myChart = echarts.init(chartDom);
    const myLegend = echarts.init(legendDom);

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

    const textColor = getColor('--color-text');
    const mutedColor = getColor('--color-muted');
    const bgColor = getColor('--color-bg');
    // ITC's own revenue line — gold, matching the "ITC's own metric is primary-colored"
    // convention already used for the stock-price line in stocks.js.
    const revenueColor = getColor('--color-primary');

    // Data Streams
    const allTimelineYears = ['FY2016', 'FY2017', 'FY2018', 'FY2019', 'FY2020', 'FY2021', 'FY2024', 'FY2025'];
    const grossRevenue8Points = [34063, 35878, 36500, 38100, 41200, 43400, 56000, 59500];
    const taxIncidencePercent = [0.50, 0.515, 0.53, 0.53, 0.53, 0.53, 0.65, 0.70];
    const staticLabels = ['50%', '51.5%', '-', '53%', '-', '53%', '65%', '70%'];

    const absoluteTaxTotal = grossRevenue8Points.map((rev, idx) => Math.round(rev * taxIncidencePercent[idx]));
    const filterData = absoluteTaxTotal.map((t, idx) => (staticLabels[idx] === '-') ? '-' : Math.round(t * 0.25));
    const bodyData = absoluteTaxTotal.map((t, idx) => (staticLabels[idx] === '-') ? '-' : Math.round(t * 0.70));
    const tipData = absoluteTaxTotal.map((t, idx) => (staticLabels[idx] === '-') ? '-' : Math.round(t * 0.05));

    // Updated requested custom legend names
    const sharedLegendData = ['Reveneue through Ciggeretes', 'Tax on Ciggeretes %'];

    // Main Chart Setup Options
    const mainOption = {
        backgroundColor: 'transparent',
        legend: {
            show: false,
            data: ['Cigarette Filter', 'Cigarette Body', 'Burning Tip', 'ITC Gross Segment Revenue']
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'none' },
            backgroundColor: bgColor,
            borderColor: mutedColor,
            borderWidth: 1,
            padding: 12,
            textStyle: { color: textColor },
            formatter: function (params) {
                const idx = params[0].dataIndex;
                let tooltipContent = `
                    <div style="font-size: 13.5px; max-width: 340px; white-space: normal; line-height: 1.5;">
                        <strong style="color: ${textColor}; font-size: 14.5px;">${allTimelineYears[idx]} Performance Overview</strong><br/>
                        <span style="color: ${revenueColor}; font-weight: bold; display: block; margin-top: 4px;">
                            ITC Segment Gross Revenue: ₹${grossRevenue8Points[idx].toLocaleString('en-IN')} Cr
                        </span>
                        <span style="color: #e11d48; font-weight: bold; display: block; margin-bottom: 6px;">
                            Total Taxes Collected: ₹${absoluteTaxTotal[idx].toLocaleString('en-IN')} Cr
                        </span>
                `;

                const isBarHover = params.some(p => p.seriesIndex === 0 || p.seriesIndex === 1 || p.seriesIndex === 2);
                if (isBarHover && staticLabels[idx] !== '-') {
                    const percentageBreakdowns = [
                        `• Statutory Base GST / Pre-GST Duty: 26.0%<br/>• Transitional Cess Layer Configuration: 20.0%<br/>• Regulatory Excise Duties & Levies: 4.0%`,
                        `• Statutory Base GST Rate: 28.0%<br/>• Compensation Cess + Ad-Valorem Layer: 19.5%<br/>• Basic Excise Duty & NCCD Share: 4.0%`,
                        ``,
                        `• Statutory Base GST Rate: 28.0%<br/>• Upgraded Protection Compensation Cess: 21.0%<br/>• Basic Excise Duty & NCCD Share: 4.0%`,
                        ``,
                        `• Statutory Base GST Rate: 28.0%<br/>• Central Budgetary Compensation Cess: 21.0%<br/>• National Calamity Contingent Duty (NCCD): 4.0%`,
                        `• Statutory Base GST Rate (GST 2.0 update): 40.0%<br/>• Transitional Component Cess Spread: 20.0%<br/>• Standard Regulatory Excise Margin: 5.0%`,
                        `• Statutory Base GST Rate: 40.0%<br/>• Modern RSP-Based Additional Excise Duty: 30.0%<br/>• (Compensation Cess completely eliminated)`
                    ];

                    tooltipContent += `
                        <div style="margin-top: 8px; border-top: 1px dashed ${mutedColor}; padding-top: 6px;">
                            <strong style="color: ${mutedColor}; font-size: 12.5px; display: block; margin-bottom: 4px;">Rate Breakdown (Effective Burden: ${staticLabels[idx]})</strong>
                            <div style="background-color: ${hexToRgba(mutedColor, 0.08)}; border-left: 3px solid ${mutedColor}; padding: 6px 8px; font-family: monospace; font-size: 12px; color: ${mutedColor}; line-height: 1.6;">
                                ${percentageBreakdowns[idx]}
                            </div>
                        </div>
                    `;
                }
                tooltipContent += `</div>`;
                return tooltipContent;
            }
        },
        grid: { left: '4%', right: '4%', bottom: '5%', top: '8%', containLabel: true },
        xAxis: {
            type: 'category',
            data: allTimelineYears,
            axisLabel: { color: mutedColor, fontSize: 12, margin: 12 },
            axisLine: { lineStyle: { color: mutedColor } },
            axisTick: { show: true, alignWithLabel: true }
        },
        yAxis: [
            {
                type: 'value',
                name: '',
                axisLabel: { color: mutedColor, formatter: '₹{value}' },
                splitLine: { lineStyle: { color: hexToRgba(mutedColor, 0.15), type: 'solid' } },
                min: 0,
                max: 65000
            },
            {
                type: 'value',
                name: '',
                axisLabel: { color: mutedColor, formatter: '₹{value}' },
                splitLine: { show: false },
                min: 0,
                max: 65000
            }
        ],
        series: [
            {
                name: 'Cigarette Filter',
                type: 'bar',
                stack: 'cigarette',
                barWidth: 22,
                data: filterData,
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                        { offset: 0, color: '#d97706' },
                        { offset: 0.2, color: '#fbbf24' },
                        { offset: 0.8, color: '#fbbf24' },
                        { offset: 1, color: '#b45309' }
                    ]),
                    borderRadius: [0, 0, 2, 2]
                }
            },
            {
                name: 'Cigarette Body',
                type: 'bar',
                stack: 'cigarette',
                data: bodyData,
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                        { offset: 0, color: '#e2e8f0' },
                        { offset: 0.2, color: '#ffffff' },
                        { offset: 0.8, color: '#ffffff' },
                        { offset: 1, color: '#cbd5e1' }
                    ]),
                    borderColor: '#e2e8f0',
                    borderWidth: 1
                }
            },
            {
                name: 'Burning Tip',
                type: 'bar',
                stack: 'cigarette',
                data: tipData,
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#94a3b8' },
                        { offset: 0.4, color: '#f43f5e' },
                        { offset: 1, color: '#f97316' }
                    ]),
                    borderRadius: [2, 2, 0, 0],
                    shadowBlur: 8,
                    shadowColor: '#f43f5e'
                },
                label: {
                    show: true,
                    position: 'top',
                    distance: 8,
                    color: mutedColor,
                    fontSize: 11,
                    fontWeight: 'bold',
                    formatter: function(params) {
                        return staticLabels[params.dataIndex] === '-' ? '' : staticLabels[params.dataIndex];
                    }
                }
            },
            {
                name: 'ITC Gross Segment Revenue',
                type: 'line',
                yAxisIndex: 1,
                data: grossRevenue8Points,
                showSymbol: true,
                symbol: 'circle',
                symbolSize: 10,
                smooth: true,
                lineStyle: { color: revenueColor, width: 3 },
                itemStyle: { color: revenueColor, borderColor: bgColor, borderWidth: 2 }
            }
        ],
        graphic: []
    };

    // Fully independent chart configuration to display matching headers legend layout cleanly
    const legendOption = {
        grid: { left: 0, right: 0, top: 0, bottom: 0 },
        xAxis: { type: 'category', show: false },
        yAxis: { type: 'value', show: false },
        legend: {
            show: true,
            data: sharedLegendData,
            right: '0%',
            top: 'center',
            textStyle: { color: mutedColor, fontSize: 13 }
        },
        series: [
            { name: 'Reveneue through Ciggeretes', type: 'line', color: revenueColor, itemStyle: { color: revenueColor } },
            { name: 'Tax on Ciggeretes %', type: 'bar', color: '#fbbf24', itemStyle: { color: '#fbbf24' } }
        ]
    };

    myChart.setOption(mainOption);
    myLegend.setOption(legendOption);

    // Bind interacting toggle filters securely between separate DOM nodes
    myLegend.on('legendselectchanged', function(params) {
        const isTaxActive = params.selected['Tax on Ciggeretes %'];
        myChart.setOption({
            legend: {
                selected: {
                    'Cigarette Filter': isTaxActive,
                    'Cigarette Body': isTaxActive,
                    'Burning Tip': isTaxActive,
                    'ITC Gross Segment Revenue': params.selected['Reveneue through Ciggeretes']
                }
            }
        });
    });

    // Particle Smoke Engine Elements
    let smokeParticles = [];
    let animationFrameId = null;
    let activeEmitterX = null;
    let activeEmitterY = null;

    function updateSmoke() {
        if (activeEmitterX !== null && Math.random() < 0.35) {
            smokeParticles.push({
                x: activeEmitterX + (Math.random() * 4 - 2),
                y: activeEmitterY,
                radius: 4 + Math.random() * 4,
                opacity: 0.28 + Math.random() * 0.08,
                vx: (Math.random() * 0.4 - 0.2),
                vy: -(0.9 + Math.random() * 0.7)
            });
        }

        smokeParticles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.radius += 0.35; // Expands faster for a blurry look
            p.opacity -= 0.0005;
            p.vx += (Math.random() * 0.1 - 0.05);
        });

        smokeParticles = smokeParticles.filter(p => p.opacity > 0 && p.radius < 55);

        const graphicElements = smokeParticles.map((p, index) => ({
            id: 'smoke_p_' + index,
            type: 'circle',
            shape: { cx: p.x, cy: p.y, r: p.radius },
            style: {
                fill: 'rgba(203, 213, 225, ' + Math.max(0, p.opacity) + ')',
                shadowBlur: 35, // High blur factor
                shadowColor: 'rgba(148, 163, 184, ' + Math.max(0, p.opacity * 2) + ')'
            },
            silent: true
        }));

        myChart.setOption({ graphic: graphicElements }, { replaceMerge: ['graphic'] });
        animationFrameId = requestAnimationFrame(updateSmoke);
    }

    // Hover hooks to reliably locate positions based on robust index keys instead of names
    myChart.on('mouseover', function (params) {
        if (params.componentType === 'series' && params.seriesIndex !== 3 && staticLabels[params.dataIndex] !== '-') {
            const coord = myChart.convertToPixel({ seriesIndex: 2 }, [params.dataIndex, absoluteTaxTotal[params.dataIndex]]);
            if(coord && !isNaN(coord[0]) && !isNaN(coord[1])) {
                activeEmitterX = coord[0];
                activeEmitterY = coord[1] + 2; // Shifted Y-axis down right into the glowing tip center

                if (!animationFrameId) {
                    updateSmoke();
                }
            }
        }
    });

    myChart.on('mouseout', function () {
        activeEmitterX = null;
        activeEmitterY = null;
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
        smokeParticles = [];
        myChart.setOption({ graphic: [] }, { replaceMerge: ['graphic'] });
    });

    window.addEventListener('resize', function() {
        myChart.resize();
        myLegend.resize();
    });
});
