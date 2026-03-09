const DATA_INPUT = {
    "charts": [
        {
            "id": "chart-land",
            "title": "Industrial land cost per acre (in Rs cr)",
            "years": ["2021", "2023", "2025"],
            "mins": [3.5, 2.3, 1],
            "maxs": [5, 3, 2],
            "xMin": 0, "xMax": 5, "step": 1,
            "labels": [["3.5", "5"], ["2.3", "3"], ["1", "2"]]
        },
        {
            "id": "chart-lease",
            "title": "Industrial lease rent per sq ft per month (in Rs)",
            "years": ["2021", "2023", "2025"],
            "mins": [55, 40, 25],
            "maxs": [60, 48, 35],
            "xMin": 15, "xMax": 60, "step": 10,
            "labels": [["55", "60"], ["40", "48"], ["25", "35"]]
        },
        {
            "id": "chart-pay",
            "title": "Average monthly pay for workers (in Rs)",
            "years": ["2021", "2023", "2025"],
            "mins": [13000, 10000, 7000],
            "maxs": [15000, 11000, 9000],
            "xMin": 5000, "xMax": 15000, "step": 2000,
            "labels": [["13,000", "15,000"], ["10,000", "11,000"], ["7,000", "9,000"]]
        }
    ]
};

function renderCharts() {
    const wrapper = document.getElementById('charts-wrapper');

    DATA_INPUT.charts.forEach((config, count) => {
        const section = document.createElement('div');
        section.className = 'chart-section';
        const title = document.createElement('div');
        title.className = 'chart-title';
        title.innerText = config.title;
        const chartDiv = document.createElement('div');
        chartDiv.id = config.id;
        chartDiv.className = 'chart-container';
        chartDiv.style.height = '300px'; // Ensure container has height

        section.appendChild(title);
        section.appendChild(chartDiv);
        wrapper.appendChild(section);

        const myChart = echarts.init(chartDiv);
        const barWidths = config.mins.map((min, i) => config.maxs[i] - min);

        const option = {
            animationDuration: 1500,
            animationDelay: 1500 * count,
            grid: { top: 40, bottom: 40, left: 80, right: 80 },
            tooltip: {
                trigger: 'item',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderWidth: 1,
                borderColor: '#5D2FC1',
                formatter: (params) => {
                    if (params.seriesName === 'Offset') return null; // Don't show for invisible part
                    const idx = params.dataIndex;
                    const diff = (config.maxs[idx] - config.mins[idx]).toFixed(2).replace(/\.00$/, '');
                    return `
                        <div style="font-weight: bold; color: #333;">${config.years[idx]}</div>
                        <div style="color: #5D2FC1; font-size: 16px; font-weight: bold;">Range: ${diff}</div>
                        <div style="color: #666; font-size: 12px;">(${config.mins[idx]} to ${config.maxs[idx]})</div>
                    `;
                }
            },
            xAxis: {
                type: 'value',
                min: config.xMin,
                max: config.xMax,
                splitLine: { lineStyle: { color: '#eee', type: 'dashed' } },
                axisLabel: { color: '#999' },
                axisLine: { show: false }
            },
            yAxis: {
                type: 'category',
                data: config.years,
                inverse: true,
                axisLine: { show: true, lineStyle: { color: '#333', width: 2 } },
                axisTick: { show: false },
                axisLabel: { fontWeight: 'bold', fontSize: 14, margin: 20 }
            },
            series: [
                {
                    name: 'Offset',
                    type: 'bar',
                    stack: 'total',
                    silent: true,
                    itemStyle: { color: 'transparent' },
                    emphasis: { disabled: true }, // Offset bar never changes
                    blur: { itemStyle: {  } }, // Remains invisible on blur
                    data: config.mins
                },
                {
                    name: 'Range',
                    type: 'bar',
                    stack: 'total',
                    itemStyle: {
                        color: '#5D2FC1',
                        borderRadius: 4
                    },
                    emphasis: {
                        focus: 'self' // Highlights hovered bar, blurs others
                    },
                    blur: {
                        itemStyle: {
                            color: 'rgba(255, 255, 255, 0)', // Hollow look
                            // borderType: 'dashed',
                            borderWidth: 2,
                            borderColor: '#5D2FC1',
                            opacity: 0.2//<== this where you change opacity
                        },
                        label: { show: false } // Hide labels of blurred bars
                    },
                    label: {
                        show: true,
                        position: 'left',
                        distance: 10,
                        formatter: (p) => `{min|${config.labels[p.dataIndex][0]}}`,
                        rich: {
                            min: { color: '#000', fontWeight: 'bold', fontSize: 14 }
                        }
                    },
                    data: barWidths
                },
                {
                    name: 'InvisibleRange', // Used specifically for the Right Label
                    type: 'bar',
                    stack: 'total',
                    // itemStyle: { color: 'transparent' },
                    emphasis: { focus: 'self' },
                    // blur: { label: { show: false } },
                    label: {
                        show: true,
                        position: 'right',
                        distance: 10,
                        formatter: (p) => `{max|${config.labels[p.dataIndex][1]}}`,
                        rich: {
                            max: { color: '#000', fontWeight: 'bold', fontSize: 14 }
                        }
                    },
                    data: new Array(config.years.length).fill(0.0001) // Tiny value to anchor label
                }
            ]
        };

        myChart.setOption(option);
        window.addEventListener('resize', () => myChart.resize());
    });
}

window.onload = renderCharts;
