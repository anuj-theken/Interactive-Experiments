window.addEventListener('load', () => {
    const chartDom = document.getElementById('main-chart');
    // Using SVG renderer for smoother vector lines on high-res screens
    const myChart = echarts.init(chartDom, null, { renderer: 'svg' });

    // 1. Generate 365 days of data
    const dataCount = 365;
    const labels = [];
    const values = [];
    let currentVal = 50;

    for (let i = 0; i < dataCount; i++) {
        labels.push(`Day ${i + 1}`);
        // Random walk logic for a natural looking curve
        currentVal += (Math.random() - 0.5) * 5;
        values.push(parseFloat(currentVal.toFixed(2)));
    }

    const option = {
        backgroundColor: 'transparent',
        animation: false, // Essential for scroll-sync
        grid: { top: '10%', bottom: '15%', left: '5%', right: '5%' },
        xAxis: {
            type: 'category',
            data: labels,
            boundaryGap: false,
            axisLine: { lineStyle: { color: '#ccc' } },
            axisLabel: { show: false } // Hide labels to keep it clean
        },
        yAxis: {
            type: 'value',
            splitLine: { lineStyle: { type: 'dashed', color: '#eee' } },
            axisLine: { show: false }
        },
        series: [{
            type: 'line',
            data: [],
            smooth: 0.4,
            showSymbol: false,
            lineStyle: { width: 3, color: '#8ecae6' }, // Light Blue
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: 'rgba(142, 202, 230, 0.4)' },
                    { offset: 1, color: 'rgba(255, 255, 255, 0)' }
                ])
            }
        }]
    };
    myChart.setOption(option);

    const scroller = scrollama();

    scroller.setup({
        step: '.step',
        progress: true,
        offset: 0
    }).onStepProgress((response) => {
        const progress = response.progress;
        const totalSegments = values.length - 1;
        const fractionalIndex = progress * totalSegments;
        const index = Math.floor(fractionalIndex);
        const remainder = fractionalIndex - index;

        let currentData = values.slice(0, index + 1);

        // 2. The Smoothing Secret: Interpolate the final point
        if (index < totalSegments) {
            const startVal = values[index];
            const endVal = values[index + 1];
            const interpolatedPoint = startVal + (endVal - startVal) * remainder;
            currentData.push(interpolatedPoint);
        }

        myChart.setOption({
            series: [{ data: currentData }]
        });
    });

    window.addEventListener('resize', () => {
        myChart.resize();
        scroller.resize();
    });
});
