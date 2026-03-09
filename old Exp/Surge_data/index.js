const chartDom = document.getElementById('chart-container');
const myChart = echarts.init(chartDom);

const updateChart = () => {
    const isMobile = window.innerWidth < 600;

    const option = {
        title: [
            {
                text: 'Pulsing through',
                left: 'center',
                top: '0%',
                textStyle: {
                    fontSize: isMobile ? 32 : 56,
                    fontFamily: 'JazminAlt',
                    color: '#000'
                }
            },
            {
                text: 'Daily Rounds has consistently posted solid growth numbers\nFinancials (in Rs cr)',
                left: 'center',
                top: isMobile ? '12%' : '14%',
                textStyle: {
                    fontSize: isMobile ? 14 : 18,
                    fontFamily: 'GTAmerica-Standard',
                    fontWeight: 'normal',
                    lineHeight: isMobile ? 18 : 24,
                    color: '#333'
                }
            }
        ],
        // Tooltip configured to highlight the entire vertical axis (Year)
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow' // Adds a subtle shadow behind the focused year
            }
        },
        legend: {
            data: ['Revenue', 'Profit'],
            top: isMobile ? '25%' : '28%',
            icon: 'rect'
        },
        grid: {
            left: '5%',
            right: '5%',
            bottom: '5%',
            top: isMobile ? '38%' : '40%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['FY 2020', 'FY 2021', 'FY 2022', 'FY 2023', 'FY 2024'],
            axisLine: { lineStyle: { width: 2 } },
            axisTick: { show: false },
            axisLabel: {
                fontFamily: 'GTAmerica-Standard',
                fontWeight: 'bold'
            }
        },
        yAxis: {
            type: 'value',
            interval: 175,
            max: 700,
            splitLine: { lineStyle: { color: '#eef' } }
        },
        series: [
            {
                name: 'Revenue',
                type: 'bar',
                data: [173, 350.59, 434.18, 566.41, 634.6],
                color: '#f9a825',
                label: { show: true, position: 'top', fontWeight: 'bold' },
                // Focus logic: Blurs other years when one is hovered
                emphasis: {
                    focus: 'series',
                    blurScope: 'coordinateSystem'
                }
            },
            {
                name: 'Profit',
                type: 'bar',
                data: [80.7, 178.1, 198.1, 281.5, 332.0],
                color: '#29abe2',
                label: { show: true, position: 'top', fontWeight: 'bold' },
                emphasis: {
                    focus: 'series',
                    blurScope: 'coordinateSystem'
                }
            }
        ]
    };

    myChart.setOption(option);
};

updateChart();
window.addEventListener('resize', () => {
    updateChart();
    myChart.resize();
});
