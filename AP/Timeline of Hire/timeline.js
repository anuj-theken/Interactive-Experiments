const founderData = [
    { year: 1952, name: "Jairam Mangesh Nadkarni", desc: "Best polymer scientist of his time, joined as chief scientist and set up Asian Paints' R&D lab" },
    { year: 1958, name: "D. Madhukar", desc: "Executive assistant to Choksey, became an executive director, arguably the most senior position a non-family member could hold at the time" },
    { year: 1959, name: "K. Rajagopalachari", desc: "Remained with the company until his death in 2005, was the crucial go-between linking the founding families and senior professionals" },
    { year: 1960, name: "CV Abraham", desc: "Originally from Bangalore, spent 32 years with Asian Paints" },
    { year: 1962, name: "Bipin Jhaveri", desc: "Choksey's nephew, was both a chartered accountant and company secretary, became CFO" }
];

const chartDom = document.getElementById('timeline-chart');
const myChart = echarts.init(chartDom);
const infoCard = document.getElementById('info-card');

function render() {
    const isMobile = window.innerWidth <= 768;
    const years = Array.from({ length: 16 }, (_, i) => 1950 + i );

    // --- SERIES SEPARATION ---
    let seriesData = [];

    if (isMobile) {
        // MOBILE VERSION: Continuous Vertical Track

        seriesData = [
        {
            // GREY TRACK: Continuous vertical pillar
            type: 'pictorialBar',
            symbol: 'rect',
            // '100%' height fills the entire year category slot exactly
            symbolSize: [20, '150%'],
            // Remove the vertical % offset to let it fill the bottom slot
            symbolOffset: [10, 0],
            itemStyle: { color: '#F9F3E6' },
            silent: true,
            data: years.map(() => 1),
            z: 1
        },
        {
            // BLACK DASHES: Scaled segments
            type: 'pictorialBar',
            symbol: 'rect',
            symbolSize: [6, 55],
            symbolOffset: [-20, 0],
            itemStyle: { color: '#C1D1DF' },
            data: years.map(() => 1),
            z: 2
        },
        {
            // FOUNDER SQUARES (Locked to Track)
            type: 'pictorialBar',
            symbol: 'rect',
            symbolSize: [20, 20],
            symbolOffset: [10, 0], // Must match Grey Track horizontal offset
            itemStyle: {
                color: '#E84C31',
                shadowBlur: 5,
                shadowColor: 'rgba(232,76,49,1)'
            },
            z: 5,
            data: years.map((y) => {
                const f = founderData.find(d => d.year === y);
                return f ? { value: 1, founderInfo: f } : null;
            })
        }
    ];
    } else {
        // WEB VERSION: Original Segmented Horizontal Bar
        seriesData = [
            {
                type: 'pictorialBar',
                symbol: 'rect',

                symbolSize: ['135%', 6],
                symbolOffset: [0, -25],
                itemStyle: { color: '#C1D1DF', borderRadius: '4px' },
                data: years.map(() => 10)
            },
            {
                type: 'bar',
                itemStyle: { color: '#F9F3E6' },
                barWidth: '102%',
                barHeight: '85%',
                silent: true,
                data: years.map(() => 1.3)
            },
            {
                type: 'scatter',
                symbol: 'Rect', // Change from 'roundRect' to 'rect'
                symbolSize: [25, 20],
                symbolOffset: [0, -2.4],
                itemStyle: {
                    color: '#E84C31',
                    shadowBlur: 15,
                    shadowColor: 'rgba(232,76,49,1)',
                    // Control the exact radius here (e.g., 2px for a subtle curve)
                    borderRadius: 20,
                },
                data: years.map((y, idx) => {
                    const f = founderData.find(d => d.year === y);
                    return f ? { value: [idx, 0.8], founderInfo: f } : null;
                })
            }
        ];
    }

    const option = {

        grid: isMobile ?
            { left: '50%', right: '25%', top: 20, bottom: 10 } :
            { top: 60, bottom: 10, left: 0, right: 0 },
        xAxis: isMobile ? { show: false } : {
            type: 'category',
            data: years,
            position: 'top',
            axisLine: { show: false },
            axisTick: { show: false },axisLabel: {
                show: true, // Explicitly show labels
                margin: 30,
                fontSize: 12,
                color: '#F9F3E6',
                formatter: function (value) {
            // Only return the label if the year is a multiple of 5
            return value % 5 === 0 ? value : '';
        }

            }
        },
        yAxis: isMobile ? {

            type: 'category',
            data: years,
            inverse: true,
            boundaryGap: false,
            axisLine: { show: false },
            axisTick: { show: false },

            axisLabel: { fontSize: 12, color: '#F9F3E6', margin: 40, fontWeight: 'bold',

            formatter: function (value) {
            // Only return the label if the year is a multiple of 5
            return value % 5 === 0 ? value : ''; } }
        } : { show: false, min: 0, max: 5, inverse: true },
        series: seriesData
    };

    myChart.setOption(option, true); // 'true' forces a full redraw to clear old styles
}

// Global Show Function to fix the disappear bug
function showFounder(params) {
    const info = params.data.founderInfo;
    const isMobile = window.innerWidth <= 768;

    document.getElementById('founder-name').innerHTML = `<small>${info.year}</small><br>${info.name}`;
    document.getElementById('founder-desc').innerText = info.desc;

    infoCard.style.display = 'block';

    if (!isMobile) {
        const pixelPos = myChart.convertToPixel({gridIndex: 0}, params.value);
        infoCard.style.left = `${pixelPos[0] - 110}px`;
        infoCard.style.opacity = '1';
    } else {
        infoCard.style.opacity = '1';
    }
}

myChart.on('click', (params) => { if (params.data?.founderInfo) showFounder(params); });
myChart.on('mouseover', (params) => { if (window.innerWidth > 768 && params.data?.founderInfo) showFounder(params); });

// Close card if clicking background
myChart.getZr().on('click', (params) => { if (!params.target) infoCard.style.display = 'none'; });

render();
window.onresize = () => { myChart.resize(); render(); };
