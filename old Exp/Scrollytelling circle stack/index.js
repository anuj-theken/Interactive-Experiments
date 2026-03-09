const chartDom = document.getElementById('chart-container');
const myChart = echarts.init(chartDom);
const scroller = scrollama();

// Data format: [x, y, size, colorIndex, rowID]
const row1_start = [[20, 60, 50, 0, 1], [35, 60, 50, 1, 1], [50, 60, 50, 2, 1]];
const row2_start = [[20, 40, 50, 3, 2], [35, 40, 50, 4, 2], [50, 40, 50, 0, 2]];

// Stacked positions (moved up to y: 95 and y: 92 for a layered look)
const row1_stacked = [[10, 95, 20, 0, 1], [15, 95, 20, 1, 1], [35, 95, 20, 2, 1]];
const row2_stacked = [[45, 95, 20, 3, 2], [60, 95, 20, 4, 2], [75, 95, 20, 0, 2]];

/**
 * Generates the ECharts Configuration Blueprint
 * @param {Array} currentData - The current merged array of circles
 * @param {Boolean} showTimeline - Whether to show the header line/text
 */
function getOption(currentData, showTimeline) {
    return {
        // Hide axes but keep the 0-100 coordinate system
        xAxis: { min: 0, max: 100, show: false },
        yAxis: { min: 0, max: 100, show: false },

        // Permanent visual elements (The Timeline)
        graphic: [
            {
                type: 'group',
                left: '10%',
                top: '5%',
                children: [
                    {
                        type: 'rect',
                        shape: { width: 600, height: 2 },
                        style: {
                            fill: '#ccc',
                            opacity: showTimeline ? 1 : 0
                        },
                        transition: ['style']
                    },
                    {
                        type: 'text',
                        left: 0,
                        top: -25,
                        style: {
                            text: '2020 ———— 2022 ———— 2024 ———— 2026',
                            font: 'bold 14px sans-serif',
                            fill: '#999',
                            opacity: showTimeline ? 1 : 0
                        },
                        transition: ['style']
                    }
                ]
            }
        ],

        // The Circles
        series: [{
            type: 'scatter',
            data: currentData,
            symbolSize: function(val) { return val[2]; },
            itemStyle: {
                color: function(params) {
                    const colors = ['#ff4757', '#2ed573', '#1e90ff', '#ffa502', '#3742fa'];
                    return colors[params.data[3]]; // Use colorIndex
                },
                opacity: 0.8
            },
            // Animation settings for that "Pudding" look
            animationDuration: 1000,
            animationEasingUpdate: 'cubicQuinticInOut',
            animationDelayUpdate: function(idx) {
                return idx * 80; // Staggered movement
            }
        }]
    };
}

// 1. Initial Render: Both rows at the bottom/middle
myChart.setOption(getOption([...row1_start, ...row2_start], false));

// 2. Scroll Logic: Tells the chart what to do when a step is reached
function handleStepEnter(response) {
    let combinedData;
    let showTimeline = false;

    // Toggle active class for CSS styling (fading text in/out)
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        step.classList.toggle('is-active', index === response.index);
    });

    if (response.index === 0) {
        // Step 1: Initial Layout
        combinedData = [...row1_start, ...row2_start];
        showTimeline = false;
    } else if (response.index === 1) {
        // Step 2: Row 1 moves to top, Row 2 stays
        combinedData = [...row1_stacked, ...row2_start];
        showTimeline = true;
    } else if (response.index === 2) {
        // Step 3: Row 1 stays, Row 2 moves to top
        combinedData = [...row1_stacked, ...row2_stacked];
        showTimeline = true;
    }

    // Apply the update
    myChart.setOption(getOption(combinedData, showTimeline));
}

// 3. Setup Scrollama
function init() {
    scroller
        .setup({
            step: '.step',
            offset: 0.5,
            debug: false // Set to true to see the trigger line
        })
        .onStepEnter(handleStepEnter);

    // Handle responsiveness
    window.addEventListener('resize', () => {
        myChart.resize();
        scroller.resize();
    });
}

// Fire it up!
init();
