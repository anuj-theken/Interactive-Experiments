(function() {
    // 1. Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // 2. Color Palette
    const P = {
        g1: '#b08d57',
        g2: '#c5a367',
        g3d: '#4a7c5f',
        g3l: '#76a88d',
        g4d: '#c45e45',
        g4l: '#d4826a',
        g5: '#e8a98c'
    };


    // 3. Complete Data Structure
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
                            name: 'Rahul Bajaj\n(Late Chairman)',
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

    // 4. Initialize Chart
    const chartDom = document.getElementById('bajaj-chart');
    if (!chartDom) return;
    const chart = echarts.init(chartDom, null, {
    devicePixelRatio: 2.5 // Manually set this higher than 1
});

    // 5. Core Render Function
    function renderChart(data) {
    const option = {
        baseOption: { // Wrap your existing config in baseOption
            animationDurationUpdate: 800,
            series: [{
                type: 'sunburst',
                data: data,
                radius: ['0%', '95%'], // Default radius
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
                    fontSize: 18,
                    color: '#000',
                    textBorderWidth: 0,
                    overflow: 'breakAll',
                    align: 'center'
                },
                itemStyle: {
                    borderWidth: 1,
                    borderColor: '#fff'
                }
            }]
        },
        // ADD THIS MEDIA ARRAY
        media: [
            {
                query: { maxWidth: 800 }, // For mobile phones
                option: {
                    series: [{
                        radius: ['0%', '20%'], // Shrinks the actual chart circle
                        label: {
                            fontSize: 12, // Smaller text for small screens
                            minAngle: 10 // Hides labels for tiny slivers to prevent clutter
                        }
                    }]
                }
            }
        ]
    };
    chart.setOption(option);
}

    // 6. Highlight/Opacity Logic
    function applyOpacity(nodes, targetIds) {
        return nodes.map(node => {
            const newNode = { ...node };

            // Check if current node is in highlight list
            let isHighlighted = targetIds.length === 0 || targetIds.includes(node.id);

            // Set opacity based on highlight status
            const opacityValue = isHighlighted ? 1 : 0.1;

            newNode.itemStyle = {
                ...node.itemStyle,
                opacity: opacityValue
            };
            newNode.label = {
                ...node.label,
                opacity: opacityValue
            };

            if (node.children) {
                newNode.children = applyOpacity(node.children, targetIds);
            }
            return newNode;
        });
    }

    // 7. Define Highlight Groups
    // Note: To highlight a branch, you must include the specific IDs used in the data
    const groupA = ['shekhar', 'madhur', 'niraj', 'rahul'];
    const groupB = ['shishir', 'kushagra'];

    // 8. Initial Render (Full Opacity)
    renderChart(rawData);

    // 9. ScrollTrigger Setups
    ScrollTrigger.create({
        trigger: "#trigger-allies",
        start: "top 60%", // Adjust this to trigger sooner or later
        end: "bottom 40%",
        onEnter: () => {
            renderChart(applyOpacity(rawData, groupA));
            document.getElementById('text-allies').classList.add('active');
        },
        onLeaveBack: () => {
            renderChart(rawData); // Reset to full opacity
            document.getElementById('text-allies').classList.remove('active');
        }
    });

if (window.innerWidth <= 800) {
    ScrollTrigger.create({
        trigger: "#trigger-shishir",
        start: "top 70%",
        end: "bottom 40%",
        onEnter: () => {
            renderChart(applyOpacity(rawData, groupB));
            document.getElementById('text-shishir').classList.add('active');
        },
        onLeaveBack: () => {
            renderChart(applyOpacity(rawData, groupA));
            document.getElementById('text-shishir').classList.remove('active');
        }
    });
  }
  else{
    ScrollTrigger.create({
        trigger: "#trigger-shishir",
        start: "top 60%",
        end: "bottom 40%",
        onEnter: () => {
            renderChart(applyOpacity(rawData, groupB));
            document.getElementById('text-shishir').classList.add('active');
        },
        onLeaveBack: () => {
            renderChart(applyOpacity(rawData, groupA));
            document.getElementById('text-shishir').classList.remove('active');
        }
    });
  }

    if (window.innerWidth <= 800) {
      gsap.set('#bajaj-scrolly-root #viz-container', { opacity: 0 });


    ScrollTrigger.create({
        trigger: '#bajaj-scrolly-root .scrolly-container',
        start: 'top 60%',
        end: 'bottom 80%',
        onEnter:     () => gsap.to('#bajaj-scrolly-root #viz-container', { opacity: 0.8, duration: 0.5 }),
        onLeave:     () => gsap.to('#bajaj-scrolly-root #viz-container', { opacity: 0,   duration: 0.5 }),
        onEnterBack: () => gsap.to('#bajaj-scrolly-root #viz-container', { opacity: 0.8, duration: 0.5 }),
        onLeaveBack: () => gsap.to('#bajaj-scrolly-root #viz-container', { opacity: 0,   duration: 0.5 })
    });
}

    // 10. Handle Resize
    window.addEventListener("resize", () => {
    chart.resize();
});

})();
