const chartDom = document.getElementById('chart-container');
const myChart = echarts.init(chartDom);

const option = {
    title: {
        text: 'Sources of Capital Analysis',
        subtext: 'Data in Crores',
        left: 'center',
        top: '2%'
    },
    legend: {
        bottom: '2%'
    },
    tooltip: {
        trigger: 'axis',
        showContent: true
    },
    dataset: {
        source: [
            ['Source', 'FY14', 'FY15', 'FY16', 'FY17', 'FY18', 'FY19', 'FY20', 'FY21', 'FY22', 'FY23', 'FY24', 'FY25'],
            ['CFOA', 1402, 1188, 2243, 1527, 2113, 2470, 2632, 3683, 986, 4193, 6104, 4424],
            ['Sale of investments', 463, 278, 205, 357, 362, 733, 118, 272, 207, 446, 240, 421],
            ['Debt raised', 44, 23, 98, 27, 11, 0, 24, 32, 21, 15, 0, 0], // Corrected based on your list
            ['Interest received', 14, 11, 15, 32, 39, 40, 65, 73, 77, 87, 135, 155],
            ['Dividend received', 65, 71, 69, 74, 38, 40, 27, 8, 15, 5, 61, 29],
            ['Other investing items', 0, 0, 0, 0, 259, 0, 0, 0, 0, 0, 168, 0],
            ['Other financing items', 0, 0, 66, 13, 0, 0, 0, 0, 0, 0, 0, 0]
        ]
    },
    xAxis: { type: 'category' },
    yAxis: { gridIndex: 0 },
    grid: { top: '55%', bottom: '12%' },
    series: [
        { type: 'line', smooth: true, seriesLayoutBy: 'row', emphasis: { focus: 'series' } },
        { type: 'line', smooth: true, seriesLayoutBy: 'row', emphasis: { focus: 'series' } },
        { type: 'line', smooth: true, seriesLayoutBy: 'row', emphasis: { focus: 'series' } },
        { type: 'line', smooth: true, seriesLayoutBy: 'row', emphasis: { focus: 'series' } },
        { type: 'line', smooth: true, seriesLayoutBy: 'row', emphasis: { focus: 'series' } },
        { type: 'line', smooth: true, seriesLayoutBy: 'row', emphasis: { focus: 'series' } },
        { type: 'line', smooth: true, seriesLayoutBy: 'row', emphasis: { focus: 'series' } },
        
        {
            type: 'pie',
            id: 'pie',
            radius: '30%',
            center: ['50%', '30%'],
            emphasis: { focus: 'self' },
            label: { formatter: '{b}: {@FY14} ({d}%)' },
            // We encode the first 7 rows (excluding the Total row at index 8)
            encode: {
                itemName: 'Source',
                value: 'FY14',
                tooltip: 'FY14'
            }
        }
    ]
};

myChart.on('updateAxisPointer', function (event) {
    const xAxisInfo = event.axesInfo[0];
    if (xAxisInfo) {
        const dimension = xAxisInfo.value + 1;
        myChart.setOption({
            series: {
                id: 'pie',
                label: { formatter: '{b}: {@[' + dimension + ']} ({d}%)' },
                encode: {
                    value: dimension,
                    tooltip: dimension
                }
            }
        });
    }
});

myChart.setOption(option);
window.onresize = myChart.resize;
