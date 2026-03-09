const chartDom = document.getElementById('chart-container');
const myChart = echarts.init(chartDom, 'dark');

// Updated with your granular data
const years = ['Jan 1999','Aug 1999','Mar 2000','Sep 2000','Mar 2001','Oct 2001','May 2002','Nov 2002','Jun 2003','Jan 2004','Jul 2004','Feb 2005','Sep 2005','Mar 2006','Nov 2006','May 2007','Dec 2007','Jun 2008','Jan 2009','Jul 2009','Feb 2010','Sep 2010','Mar 2011','Oct 2011','May 2012','Dec 2012','Jun 2013','Jan 2014','Aug 2014','Feb 2015','Sep 2015','Apr 2016','Oct 2016','May 2017','Nov 2017','Jun 2018','Dec 2018','Jul 2019','Jan 2020','Aug 2020','Mar 2021','Sep 2021','Apr 2022','Oct 2022','May 2023','Nov 2023','Jun 2024','Jan 2025','Aug 2025','Feb 2026'];

// Indexed to 100 (base = Jan 1999)
const asianPaintsData = [100, 112.29, 142.00, 138.80, 137.71, 147.90, 180.64, 184.43, 214.98, 282.07, 268.86, 303.79, 414.14, 543.86, 582.66, 687.04, 837.46, 973.15, 740.99, 1102.44, 1564.90, 2364.31, 2129.04, 2633.75, 3050.42, 3630.05, 3902.78, 4141.41, 5256.73, 6950.34, 6869.95, 7167.93, 9709.60, 9536.62, 9760.94, 10764.73, 11498.32, 11464.23, 15040.40, 15204.12, 20093.43, 29028.62, 26988.64, 26030.30, 26356.06, 26398.57, 24554.29, 19031.99, 21285.35, 20001.68];

// Indexed to 100 (base = Jan 1999)
const nifty50Data = [100, 147.82, 185.90, 162.78, 146.65, 102.67, 123.14, 106.81, 117.47, 218.46, 172.60, 233.27, 271.19, 353.32, 427.18, 462.21, 670.67, 519.51, 342.02, 496.67, 541.86, 615.12, 621.77, 549.05, 571.04, 663.16, 660.19, 697.26, 853.46, 972.28, 859.35, 866.56, 977.58, 1042.36, 1173.38, 1200.74, 1200.46, 1325.90, 1372.55, 1258.87, 1676.93, 1983.66, 1943.72, 2028.40, 2158.80, 2614.52, 2694.74, 2757.67, 2884.34, 2884.34];

const eventData = [
    { coord: ['Jan 1999', 100], value: '1', desc: '1999: Lorem ipsum dolor sit amet.' },
    { coord: ['Mar 2006', 64.61], value: '2', desc: '2006: Lorem ipsum dolor sit amet.' },
    { coord: ['Mar 2011', 2129], value: '3', desc: '2011: Lorem ipsum dolor sit amet.' },
    { coord: ['Jun 2018', 10764], value: '4', desc: '2018: Lorem ipsum dolor sit amet.' },
    { coord: ['Apr 2022', 26988], value: '5', desc: '2022: Lorem ipsum dolor sit amet.' },
    { coord: ['Jun 2024', 24554], value: '6', desc: '2024: Lorem ipsum dolor sit amet.' }
];

const option = {
    backgroundColor: 'transparent',
    tooltip: {
        trigger: 'axis',
        confine: true,
        backgroundColor: 'rgba(30, 30, 30, 0.95)',
        textStyle: { fontSize: 12 },
        formatter: function (params) {
            let marker = eventData.find(e => e.coord[0] === params[0].name);
            let res = `<div style="font-weight:bold; margin-bottom:4px;">${params[0].name}</div>`;
            params.forEach(item => {
                res += `${item.marker} ${item.seriesName}: ${item.value}<br/>`;
            });
            if (marker) {
                res += `<div style="margin-top:8px; color:#ffcc00; white-space:normal; width:160px;">${marker.desc}</div>`;
            }
            return res;
        }
    },
    legend: {
        data: ['AP IPO', 'Nifty 50'],
        bottom: '0%',
        itemGap: 20,
        textStyle: { fontSize: 11 }
    },
    grid: {
        top: '10%',
        left: '3%',
        right: '5%',
        bottom: '15%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: years,
        axisLabel: { fontSize: 10, interval: 'auto' }
    },
    yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: '#222' } },
        axisLabel: { fontSize: 10 }
    },
    series: [
        {
            name: 'AP IPO',
            type: 'line',
            data: asianPaintsData,
            smooth: true,
            lineStyle: { color: '#ffcc00', width: 2.5 },
            itemStyle: { color: '#ffcc00' },
            markPoint: {
                symbol: 'circle',
                symbolSize: 12,
                data: eventData.map(e => ({ name: e.value, coord: e.coord })),
                label: { show: false }
            }
        },
        {
            name: 'Nifty 50',
            type: 'line',
            data: nifty50Data,
            smooth: true,
            symbol: 'none',
            lineStyle: { type: 'dashed', color: '#e5e5e5', width: 1.5 }
        }
    ]
};

myChart.setOption(option);
window.addEventListener('resize', () => myChart.resize());
