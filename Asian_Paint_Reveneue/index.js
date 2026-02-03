const chartDom = document.getElementById('chart-container');
const myChart = echarts.init(chartDom);

const rawData = [
    ["2014", 12220, "Asian Paints"], ["2015", 13615, "Asian Paints"], ["2016", 14271, "Asian Paints"],
    ["2017", 15062, "Asian Paints"], ["2018", 16825, "Asian Paints"], ["2019", 19240, "Asian Paints"],
    ["2020", 20211, "Asian Paints"], ["2021", 21713, "Asian Paints"], ["2022", 29101, "Asian Paints"],
    ["2023", 34489, "Asian Paints"], ["2024", 35495, "Asian Paints"], ["2025", 33906, "Asian Paints"],

    ["2014", 3732, "Berger Paints"], ["2015", 4170, "Berger Paints"], ["2016", 4223, "Berger Paints"],
    ["2017", 4552, "Berger Paints"], ["2018", 5166, "Berger Paints"], ["2019", 6062, "Berger Paints"],
    ["2020", 6366, "Berger Paints"], ["2021", 6818, "Berger Paints"], ["2022", 8762, "Berger Paints"],
    ["2023", 10568, "Berger Paints"], ["2024", 11199, "Berger Paints"], ["2025", 11545, "Berger Paints"],

    ["2014", 3120, "Kansai Nerolac"], ["2015", 3505, "Kansai Nerolac"], ["2016", 3767, "Kansai Nerolac"],
    ["2017", 4053, "Kansai Nerolac"], ["2018", 4658, "Kansai Nerolac"], ["2019", 5424, "Kansai Nerolac"],
    ["2020", 5280, "Kansai Nerolac"], ["2021", 5074, "Kansai Nerolac"], ["2022", 6369, "Kansai Nerolac"],
    ["2023", 7543, "Kansai Nerolac"], ["2024", 7801, "Kansai Nerolac"], ["2025", 7823, "Kansai Nerolac"],

    ["2014", 2332, "Akzo Nobel"], ["2015", 2442, "Akzo Nobel"], ["2016", 2640, "Akzo Nobel"],
    ["2017", 2572, "Akzo Nobel"], ["2018", 2719, "Akzo Nobel"], ["2019", 2918, "Akzo Nobel"],
    ["2020", 2662, "Akzo Nobel"], ["2021", 2421, "Akzo Nobel"], ["2022", 3149, "Akzo Nobel"],
    ["2023", 3802, "Akzo Nobel"], ["2024", 3962, "Akzo Nobel"], ["2025", 4091, "Akzo Nobel"],

    ["2014", 64, "Indigo Paints"], ["2015", 90, "Indigo Paints"], ["2016", 124, "Indigo Paints"],
    ["2017", 289, "Indigo Paints"], ["2018", 411, "Indigo Paints"], ["2019", 536, "Indigo Paints"],
    ["2020", 625, "Indigo Paints"], ["2021", 723, "Indigo Paints"], ["2022", 906, "Indigo Paints"],
    ["2023", 1073, "Indigo Paints"], ["2024", 1255, "Indigo Paints"], ["2025", 1277, "Indigo Paints"],

    ["2020", 206, "JSW Paints"], ["2021", 431, "JSW Paints"], ["2022", 1060, "JSW Paints"],
    ["2023", 1594, "JSW Paints"], ["2024", 2097, "JSW Paints"], ["2025", 2155, "JSW Paints"],
    ["2023", 275, "JK Cement"], ["2025", 2500, "Birla Opus"]
];

const option = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'line',
            lineStyle: { color: '#999', width: 2, type: 'dashed' }
        },
        formatter: function (params) {
            if (!params || params.length === 0) return '';

            // Extract the year from the first data point
            const year = params[0].data[0];
            let totalRevenue = 0;
            let listHtml = '';

            params.forEach(item => {
                const val = item.data[1];
                const name = item.data[2];
                const color = item.color;
                totalRevenue += val;

                listHtml += `
                    <div style="margin-top: 4px;">
                        <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background-color:${color};margin-right:8px;"></span>
                        ${name}: <b>₹${val.toLocaleString()} Cr</b>
                    </div>
                `;
            });

            return `
                <div style="font-family: sans-serif; padding: 5px;">
                    <div style="border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 5px;">
                        <strong>FY ${year}</strong><br/>
                        <span style="color: #d94e5d;">Total Revenue: <b>₹${totalRevenue.toLocaleString()} Cr</b></span>
                    </div>
                    ${listHtml}
                </div>
            `;
        }
    },
    legend: {
        top: '5%',
        selectedMode: 'multiple' // Allows toggling specific rivers on/off
    },
    singleAxis: {
        top: '15%',
        bottom: '15%',
        type: 'time',
        axisPointer: {
            show: true,
            label: { show: true, formatter: (p) => 'FY ' + new Date(p.value).getFullYear() }
        },
        splitLine: { show: true, lineStyle: { type: 'dashed', opacity: 0.2 } }
    },
    series: [
        {
            type: 'themeRiver',
            emphasis: {
                itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.5)' }
            },
            data: rawData,
            label: { show: false }
        }
    ]
};

myChart.setOption(option);
window.addEventListener('resize', () => myChart.resize());
