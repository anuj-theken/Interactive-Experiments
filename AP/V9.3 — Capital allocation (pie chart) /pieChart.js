document.addEventListener('DOMContentLoaded', function () {
    const CREAM   = '#F9F3E6';
    const RED     = '#E84C31';
    const BLUE    = '#C1D1DF';
    const PURPLE  = '#8A7C92';

    const sourceColors = [RED, BLUE];
    const appColors    = [RED, BLUE, PURPLE];

    const getOption = (title, data, colorPalette) => ({
        title: {
            text: title,
            left: 'center',
            textStyle: { fontSize: 14, color: CREAM }
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c}%',
            backgroundColor: '#2a1a30',
            borderColor: PURPLE,
            textStyle: { color: CREAM }
        },
        legend: {
            bottom: '0',
            left: 'center',
            itemWidth: 10,
            itemHeight: 10,
            textStyle: { color: CREAM }
        },
        series: [
            {
                name: title,
                type: 'pie',
                radius: '65%',
                center: ['50%', '50%'],
                data: data,
                color: colorPalette,
                label: {
                    show: true,
                    position: 'outside',
                    formatter: '{d}%',
                    color: CREAM
                },
                labelLine: {
                    lineStyle: { color: PURPLE }
                },
                itemStyle: {
                    borderWidth: 2,
                    borderColor: '#170D1D'
                }
            }
        ]
    });

    const charts = [
        { id: 'source1', title: 'Sources of Capital',      colors: sourceColors, data: [{ value: 75, name: 'Cash flow from operating activities' }, { value: 25, name: 'Other' }] },
        { id: 'app1',    title: 'Application of Capital',  colors: appColors,    data: [{ value: 31, name: 'Dividend' }, { value: 35, name: 'Net Capex' }, { value: 34, name: 'Other' }] },
        { id: 'source2', title: 'Sources of Capital',      colors: sourceColors, data: [{ value: 94, name: 'Cash flow from operating activities' }, { value: 6,  name: 'Other' }] },
        { id: 'app2',    title: 'Application of Capital',  colors: appColors,    data: [{ value: 31, name: 'Dividend' }, { value: 35, name: 'Net Capex' }, { value: 34, name: 'Other' }] },
        { id: 'source3', title: 'Sources of Capital',      colors: sourceColors, data: [{ value: 83, name: 'Cash flow from operating activities' }, { value: 17, name: 'Other' }] },
        { id: 'app3',    title: 'Application of Capital',  colors: appColors,    data: [{ value: 46, name: 'Dividend' }, { value: 32, name: 'Net Capex' }, { value: 22, name: 'Other' }] }
    ];

    const instances = charts.map(c => {
        const chart = echarts.init(document.getElementById(c.id), null, { backgroundColor: 'transparent' });
        chart.setOption(getOption(c.title, c.data, c.colors));
        return chart;
    });

    window.addEventListener('resize', () => instances.forEach(i => i.resize()));
});
