const chartDom = document.getElementById('chart-main');
const myChart = echarts.init(chartDom);

const option = {
    title: {
        text: 'Operating Margin % by Brand',
        subtext: 'Stacked Column Analysis (FY14 - FY25)',
        left: 'center',
        top: '20'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: function (params) {
            let res = `<b>${params[0].name}</b><br/>`;
            params.forEach(item => {
                // Show the value with a % sign on hover
                res += `${item.marker} ${item.seriesName}: <b>${item.value[item.seriesIndex + 1]}%</b><br/>`;
            });
            return res;
        }
    },
    legend: {
        top: '12%',
        data: ['Asian Paints', 'Berger Paints', 'Kansai Nerolac', 'Akzo Nobel India', 'Indigo paints', 'JSW Paints']
    },
    grid: {
        left: '5%',
        right: '5%',
        bottom: '10%',
        top: '20%',
        containLabel: true
    },
    dataset: {
        source: [
            ['Year', 'Asian Paints', 'Berger Paints', 'Kansai Nerolac', 'Akzo Nobel India', 'Indigo paints', 'JSW Paints'],
            ['FY14', 16, 12, 12, 8, 5, 0],
            ['FY15', 16, 12, 13, 11, -8, 0],
            ['FY16', 19, 15, 16, 10, -5, 0],
            ['FY17', 20, 16, 18, 13, -1, 0],
            ['FY18', 19, 16, 17, 11, 6, 0],
            ['FY19', 20, 15, 14, 12, 10, 33],
            ['FY20', 21, 17, 15, 14, 15, -16],
            ['FY21', 22, 17, 17, 14, 17, -6],
            ['FY22', 17, 15, 10, 14, 15, -2],
            ['FY23', 18, 14, 11, 14, 17, 3],
            ['FY24', 21, 17, 13, 16, 19, -2],
            ['FY25', 18, 16, 12, 16, 18, 0]
        ]
    },
    xAxis: {
        type: 'category',
        axisTick: { show: false }
    },
    yAxis: {
        type: 'value',
        name: 'Margin %',
        axisLabel: { formatter: '{value}%' }
    },
    series: [
        { type: 'bar', stack: 'total', emphasis: { focus: 'series' } },
        { type: 'bar', stack: 'total', emphasis: { focus: 'series' } },
        { type: 'bar', stack: 'total', emphasis: { focus: 'series' } },
        { type: 'bar', stack: 'total', emphasis: { focus: 'series' } },
        { type: 'bar', stack: 'total', emphasis: { focus: 'series' } },
        { type: 'bar', stack: 'total', emphasis: { focus: 'series' } }
    ]
};

myChart.setOption(option);

// Handle window resize
window.addEventListener('resize', () => {
    myChart.resize();
});
