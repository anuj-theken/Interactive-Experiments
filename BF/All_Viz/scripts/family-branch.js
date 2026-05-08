(function() {
    gsap.registerPlugin(ScrollTrigger);

    const P = {
        g1: '#b08d57', g2: '#c5a367', g3d: '#4a7c5f',
        g3l: '#76a88d', g4d: '#c45e45', g4l: '#d4826a', g5: '#e8a98c'
    };

    const rawData = [{
        id: 'g1',
        name: 'Bachhraj Bajaj\n(Patriarch)',
        itemStyle: { color: P.g1 },
        children: [{
            id: 'g2',
            name: 'Jamnalal &\nJanaki Devi',
            itemStyle: { color: P.g2 },
            children: [
                {
                    id: 'g3_ram',
                    name: 'Ramkrishna &\nSavitriben',
                    itemStyle: { color: P.g3d },
                    children: [
                        { id: 'shekhar', name: 'Shekhar Bajaj', value: 20, itemStyle: { color: P.g3l } },
                        { id: 'madhur', name: 'Madhur Bajaj', value: 20, itemStyle: { color: P.g3l } },
                        { id: 'niraj', name: 'Niraj Bajaj', value: 20, itemStyle: { color: P.g3l } }
                    ]
                },
                {
                    id: 'g3_kamal',
                    name: 'Kamalnayan &\nRupaben',
                    itemStyle: { color: P.g4d },
                    children: [
                        {
                            id: 'rahul',
                            name: 'Rahul Bajaj',
                            itemStyle: { color: P.g4l },
                            children: [
                                { id: 'rajiv', name: 'Rajiv Bajaj', value: 15, itemStyle: { color: P.g5 } },
                                { id: 'sanjiv', name: 'Sanjiv Bajaj', value: 15, itemStyle: { color: P.g5 } },
                                { id: 'sunaina', name: 'Sunaina Kejriwal', value: 15, itemStyle: { color: P.g5 } }
                            ]
                        },
                        {
                            id: 'shishir',
                            name: 'Shishir Bajaj',
                            itemStyle: { color: P.g4l },
                            children: [
                                { id: 'kushagra', name: 'Kushagra Bajaj', value: 15, itemStyle: { color: P.g5 } }
                            ]
                        }
                    ]
                }
            ]
        }]
    }];

    const chartDom = document.getElementById('bajaj-chart-FT');
    if (!chartDom) return;
    const chart = echarts.init(chartDom);

    function renderChart(data) {
    const option = {
        animationDurationUpdate: 800,
        series: [{
            type: 'sunburst',
            data: data,
            radius: ['0%', '90%'],
            // Levels: Removing borders from the inner rings to stop the "white outline" look
            levels: [
                {},
                { r0: '0%', r: '15%', itemStyle: { borderWidth: 0 } },
                { r0: '15%', r: '30%', itemStyle: { borderWidth: 0 } },
                { r0: '30%', r: '50%', itemStyle: { borderWidth: 1, borderColor: '#fff' } },
                { r0: '50%', r: '75%', itemStyle: { borderWidth: 1, borderColor: '#fff' } },
                { r0: '75%', r: '92%', itemStyle: { borderWidth: 1, borderColor: '#fff' } }
            ],
            label: {
                rotate: 'tangential',
                fontSize: 10,
                color: '#000', // Ensures text stays white
                textBorderWidth: 0, // THIS REMOVES THE WHITE "GLOW" AROUND TEXT
                overflow: 'breakAll',
                align: 'center'
            },
            itemStyle: {
                borderWidth: 1,
                borderColor: '#fff'
            }
        }]
    };
    chart.setOption(option);
}

    function applyOpacity(nodes, targetIds) {
        if (targetIds.length === 0) return JSON.parse(JSON.stringify(nodes));

        // Simple logic to set opacity based on target match
        function process(node) {
            const newNode = { ...node };
            const isMatch = targetIds.includes(node.id);
            newNode.itemStyle = { ...node.itemStyle, opacity: isMatch ? 1 : 0.1 };
            if (node.children) newNode.children = node.children.map(process);
            return newNode;
        }
        return nodes.map(process);
    }

    // SCROLL TRIGGERS
    const groupA = ['shekhar', 'madhur', 'niraj', 'rahul'];
    const groupB = ['shishir', 'kushagra'];

    // Initial View
    renderChart(rawData);

    // Trigger for Allies
    ScrollTrigger.create({
        trigger: "#trigger-allies-FT",
        start: "top+=100 80%",
        onEnter: () => {
            renderChart(applyOpacity(rawData, groupA));
            document.getElementById('text-allies-FT').classList.add('active');
        },
        onLeaveBack: () => {
            renderChart(rawData);
            document.getElementById('text-allies-FT').classList.remove('active');
        }
    });

    // Trigger for Shishir
    ScrollTrigger.create({
        trigger: "#trigger-shishir-FT",
        start: "80%",
        onEnter: () => {
            renderChart(applyOpacity(rawData, groupB));
            document.getElementById('text-shishir-FT').classList.add('active');
        },
        onLeaveBack: () => {
            renderChart(applyOpacity(rawData, groupA));
            document.getElementById('text-shishir-FT').classList.remove('active');
        }
    });

    window.addEventListener("resize", () => chart.resize());
})();
