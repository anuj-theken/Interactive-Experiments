document.addEventListener('DOMContentLoaded', function () {

    const getOption = (title, data, colorPalette) => ({
        title: {
            text: title,
            left: 'center',
            textStyle: { fontSize: 14, color: '#444' }
        },
        tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
        legend: { bottom: '0', left: 'center', itemWidth: 10, itemHeight: 10 },
        series: [
            {
                name: title,
                type: 'pie',
                radius: '65%', // FILLED STYLE
                center: ['50%', '50%'],
                data: data,
                color: colorPalette,
                label: {
                    show: true,
                    position: 'outside',
                    formatter: '{d}%'
                },
                itemStyle: {
                    borderWidth: 1,
                    borderColor: '#fff'
                }
            }
        ]
    });

    const sourceColors = ['#2f4554', '#61a0a8'];
    const appColors = ['#c23531', '#2f4554', '#d48265'];
    
    // Data Mapping
    const charts = [
        { id: 'source1', title: 'Sources of Capital', colors: sourceColors, data: [{value: 75, name: 'Cash flow from operating activities'}, {value: 25, name: 'Other'}] },
        { id: 'app1',    title: 'Application of Capital', colors: appColors,    data: [{value: 31, name: 'Dividend'}, {value: 35, name: 'Net Capex'}, {value: 34, name: 'Other'}] },

        { id: 'source2', title: 'Sources of Capital', colors: sourceColors, data: [{value: 94, name: 'Cash flow from operating activities'}, {value: 6, name: 'Other'}] },
        { id: 'app2',    title: 'Application of Capital', colors: appColors,    data: [{value: 31, name: 'Dividend'}, {value: 35, name: 'Net Capex'}, {value: 34, name: 'Other'}] },

        { id: 'source3', title: 'Sources of Capital', colors: sourceColors, data: [{value: 83, name: 'Cash flow from operating activities'}, {value: 17, name: 'Other'}] },
        { id: 'app3',    title: 'Application of Capital', colors: appColors,    data: [{value: 46, name: 'Dividend'}, {value: 32, name: 'Net Capex'}, {value: 22, name: 'Other'}] }
    ];

    // Initialize all
    const instances = charts.map(c => {
        const chart = echarts.init(document.getElementById(c.id));
        chart.setOption(getOption(c.title, c.data, c.colors));
        return chart;
    });

    window.addEventListener('resize', () => instances.forEach(i => i.resize()));
});
