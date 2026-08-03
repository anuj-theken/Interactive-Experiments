// scripts/market_cap.js — QW4K5

document.addEventListener("DOMContentLoaded", function () {
    const chartDom = document.getElementById('QW4K5-main-chart');
    if (!chartDom) return;

    var myChart = echarts.init(chartDom);

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

    const lineColor = getColor('--color-primary');

    function isMobile() {
        return window.innerWidth <= 768;
    }

    // Base values in Lakh Crores (originally Trillions)
    const rawData = [
        { year: '2006', value: 0.665 },
        { year: '2007', value: 0.788 },
        { year: '2008', value: 0.647 },
        { year: '2009', value: 0.947 },
        { year: '2010', value: 1.333 },
        { year: '2011', value: 1.554 },
        { year: '2012', value: 2.242 },
        { year: '2013', value: 2.543 },
        { year: '2014', value: 2.932 },
        { year: '2015', value: 2.627 },
        { year: '2016', value: 2.917 },
        { year: '2017', value: 3.196 },
        { year: '2018', value: 3.449 },
        { year: '2019', value: 2.921 },
        { year: '2020', value: 2.571 },
        { year: '2021', value: 2.686 },
        { year: '2022', value: 4.115 },
        { year: '2023', value: 5.770 },
        { year: '2024', value: 6.015 },
        { year: '2025', value: 5.060 },
        { year: '2026', value: 3.551 }
    ];

    const years = rawData.map(item => item.year);
    const values = rawData.map(item => item.value);

    // Helper function to format absolute number using the Indian number system
    function formatIndianCurrency(num) {
        // 1 Lakh Crore = 1,00,00,00,00,000 (11 zeros or value * 10^11)
        // Converting base value to absolute numerical value
        let absoluteVal = Math.round(num * 100000000000).toString();

        let lastThree = absoluteVal.substring(absoluteVal.length - 3);
        let otherBits = absoluteVal.substring(0, absoluteVal.length - 3);
        if (otherBits != '') {
            lastThree = ',' + lastThree;
        }
        let formatted = otherBits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
        return "Rs. " + formatted;
    }

    var option = {
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                let dataIndex = params[0].dataIndex;
                let item = rawData[dataIndex];
                return `<b>Year:</b> ${item.year}<br/>` +
                       `<b>Market Cap:</b> ${formatIndianCurrency(item.value)}`;
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '5%',
            top: '5%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: true,
            data: years,
            axisLabel: {
                fontFamily: 'Archivo',
                color: getColor('--color-muted')
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value}',
                color: getColor('--color-muted')
            },
            splitLine: {
                lineStyle: {
                    type: 'dashed',
                    color: '#e0e0e0'
                }
            }
        },
        series: [
            {
                name: 'Market Cap',
                type: 'line',
                data: values,
                smooth: true,
                symbol: 'circle',
                symbolSize: 8,
                lineStyle: {
                    width: 3,
                    color: lineColor
                },
                itemStyle: {
                    color: lineColor,
                    borderWidth: 2
                },
                label: {
                    show: true,
                    position: 'top',
                    distance: 10,
                    fontWeight: 'bold',
                    fontSize: 10,
                    color: getColor('--color-text'),
                    // 21 years of labels is too cramped on a narrow mobile
                    // chart — thin them out to every 3rd year there, but
                    // keep every label on wider (tablet/desktop) screens
                    formatter: function(params) {
                        if (isMobile() && params.dataIndex % 3 !== 0) return '';
                        return params.value;
                    }
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: hexToRgba(lineColor, 0.2) },
                        { offset: 1, color: hexToRgba(lineColor, 0.0) }
                    ])
                }
            }
        ]
    };

    myChart.setOption(option);

    window.addEventListener('resize', function() {
        myChart.resize();
    });
});
