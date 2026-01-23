// 1. Initialize the chart
const chartDom = document.getElementById('chart-container');
const myChart = echarts.init(chartDom);

// 2. Data Definitions
const datasets = {
    '2024': {
        data: [[10.0, 8.04], [8.07, 6.95], [13.0, 7.58], [9.05, 8.81], [11.0, 8.33], [14.0, 7.66]],
        color: '#409eff'
    },
    '2025': {
        data: [[5.0, 4.2], [7.5, 9.1], [12.0, 11.5], [15.0, 14.2], [2.0, 3.1], [8.0, 12.0]],
        color: '#67c23a'
    }
};

// 3. Initial Configuration
const option = {
    title: { text: 'Scatterplot Toggle', left: 'center' },
    tooltip: { trigger: 'item' },
    xAxis: { scale: true },
    yAxis: { scale: true },
    series: [{
        type: 'scatter',
        symbolSize: 20,
        data: datasets['2024'].data,
        itemStyle: { color: datasets['2024'].color }
    }]
};

myChart.setOption(option);

// 4. Update Function
function updateChart(year) {
    // Update Chart Data and Color
    myChart.setOption({
        series: [{
            data: datasets[year].data,
            itemStyle: { color: datasets[year].color }
        }]
    });

    // Toggle Button UI
    document.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`btn-${year}`).classList.add('active');
}

// Ensure responsiveness
window.addEventListener('resize', () => myChart.resize());
