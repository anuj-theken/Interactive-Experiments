<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Asian Paints History</title>
    <script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>
    <style>
        :root {
            --ap-red: #E84C31;
            --text-grey: #666;
            --light-grey: #999;
        }
        body { margin: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background: #F9F3E6; }
        .timeline-header {
            padding: 40px 60px 0 60px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .timeline-header-left { display: flex; flex-direction: column; }
        .timeline-header h1 {
            margin: 0; font-size: 32px; font-weight: 800;
            color: #222; letter-spacing: -0.5px; font-family: 'Reckless';
        }
        .timeline-header p {
            color: var(--text-grey); font-size: 18px;
            margin: 10px 0 0 0; font-family: 'Reckless';
        }
        .legend {
            font-size: 14px; color: var(--light-grey);
            display: flex; align-items: center;
            align-self: center; white-space: nowrap;
        }
        .dot {
            display: inline-block; width: 12px; height: 12px;
            background: var(--ap-red); border-radius: 50%; margin-right: 8px;
        }

        .mobile-only { display: none; padding: 20px 40px; }
        .desktop-only { display: block; }

        /* Chart scrolls but hides its own scrollbar */
        .chart-scroll {
            width: 100vw;
            overflow-x: scroll;
            overflow-y: visible;
            padding-top: 20px;
            box-sizing: border-box;
            /* hide the native scrollbar */
            scrollbar-width: none;
            -ms-overflow-style: none;
        }
        .chart-scroll::-webkit-scrollbar { display: none; }

        #main { width: 6000px; height: 420px; display: block; }

        /* Thin dummy bar that shows the styled scrollbar */
        .scrollbar-track {
            width: 100vw;
            overflow-x: scroll;
            overflow-y: hidden;
            box-sizing: border-box;
            padding: 0 60px;
            margin-top: -10px;
        }
        .scrollbar-track-inner {
            width: 6000px;
            height: 1px; /* invisible content, just needs width */
        }
        .scrollbar-track::-webkit-scrollbar { height: 6px; }
        .scrollbar-track::-webkit-scrollbar-thumb {
            background-color: #E84C31;
            border-radius: 10px;
        }
        .scrollbar-track::-webkit-scrollbar-track {
            background: #f1cac2;
        }

        @media (max-width: 768px) {
            .timeline-header {
                padding: 40px 45px 20px;
                flex-direction: column; align-items: center;
                text-align: left; gap: 12px;
            }
            .timeline-header-left, .legend { width: 100%; max-width: 600px; }
            .desktop-only { display: none; }
            .mobile-only { display: block; }
            .vertical-timeline {
                border-left: 2px solid var(--ap-red);
                margin-left: 10px; padding-left: 30px; position: relative;
            }
            .timeline-item { position: relative; margin-bottom: 50px; text-align: left; }
            .timeline-item::before {
                content: ''; position: absolute;
                left: -41px; top: 5px;
                width: 15px; height: 15px;
                background: var(--ap-red);
                border: 3px solid #F9F3E6; border-radius: 50%;
            }
            .m-date { color: var(--light-grey); font-weight: bold; font-size: 14px; font-family: 'Reckless'; }
            .m-title { color: var(--ap-red); font-weight: bold; font-size: 20px; margin: 5px 0; font-family: 'Reckless'; }
            .m-desc {
                color: var(--text-grey); font-size: 15px; line-height: 1.5;
                max-width: 280px; word-wrap: break-word; font-family: 'Archivo';
            }
        }
    </style>
</head>
<body>
    <header class="timeline-header">
        <div class="timeline-header-left">
            <h1>The Evolution of Asian Paints</h1>
            <p>A journey of color and innovation since the 1930s.</p>
        </div>
        <div class="legend"><span class="dot"></span> Milestone Events</div>
    </header>

    <div class="desktop-only">
        <div class="chart-scroll" id="chartScroll">
            <div id="main"></div>
        </div>
        <div class="scrollbar-track" id="scrollbarTrack" style="margin-top: -390px; position: relative; z-index: 10;">
            <div class="scrollbar-track-inner"></div>
        </div>
    </div>

    <div class="mobile-only">
        <div class="vertical-timeline" id="mobile-list"></div>
    </div>

    <script>
        const data = [
            { date: 'Mid-1930s', title: 'Neptune Trading Agency', desc: 'Champaklal Hiralal Choksey and Suryakant Chandulal Dani establish Neptune Trading Agency to sell paint.' },
            { date: '1942', title: 'Garage Production', desc: 'Chimanlal Nanabhai Choksi and Arvind Ishwarlal Vakil join Choksey and Dani to manufacture their own paint in a garage. They sell "battleship grey" topcoat and "red lead" primer for warships during World War II. The paints are made by mixing primary colours by hand.' },
            { date: '9 Nov 1942', title: 'Asian Paints Formed', desc: 'Another new partner, Jamnadas Vora, joins the venture. Together, they form Asian Paints. Vora is the largest partner.' },
            { date: '1945', title: 'Conversion', desc: 'Asian Oil and Paint Company (India) Limited is converted from a partnership to a company.' },
            { date: '15 Aug 1947', title: 'Independence', desc: 'India shakes off British rule.' },
            { date: '1948', title: 'Partner Exit', desc: 'Vora sells his stake.' },
            { date: '1954', title: 'Familiar Branding', desc: 'Gattu the mischievous boy becomes the Asian Paints mascot.' },
            { date: '1961', title: 'Higher Education', desc: 'IIM Calcutta and IIM Ahmedabad are established.' },
            { date: '1967', title: 'Market Leader', desc: 'Asian Paints becomes India\'s largest paints company.' },
            { date: 'Early 1970s', title: 'Mainframe', desc: 'Begins using a mainframe computer in business operations.' },
            { date: '1970s', title: 'MBA Ranks', desc: 'MBAs fill the ranks of Asian Paints; the founders\' scions lead the company.' },
            { date: '1973', title: 'Name Change', desc: 'Company\'s name changed to Asian Paints (India) Limited.' },
            { date: '1980', title: 'Production', desc: 'Taloja and Ankleshwar plants begin production; overseas ventures commence in Fiji and Tonga Islands.' },
            { date: '1982', title: 'IPO', desc: 'Initial public offering.' },
            { date: '31 July 1997', title: 'Founder Passing', desc: 'Champaklal Choksey dies. The founding families split. The Choksey family sells nearly all of their last shares for Rs 128 crore. Those shares would be worth Rs 20,000 crore in 2026.' },
            { date: '2009', title: 'Professional CEO', desc: 'Asian Paints gets its first professional CEO who is not a member of the founding families.' },
            { date: '2012', title: 'Revenue', desc: 'Asian Paints\' revenue crosses Rs 10,000 crore.' },
            { date: '2024', title: 'Birla Opus', desc: 'Birla Opus enters the paint industry.' }
        ];

        function forceWordWrap(text, maxCharsPerLine) {
            const words = text.split(' ');
            let lines = [], currentLine = '';
            words.forEach(word => {
                if (currentLine.length + word.length > maxCharsPerLine) {
                    lines.push(currentLine.trim());
                    currentLine = word + ' ';
                } else {
                    currentLine += word + ' ';
                }
            });
            lines.push(currentLine.trim());
            return lines.join('\n');
        }

        // Populate Mobile
        const mobileList = document.getElementById('mobile-list');
        data.forEach(item => {
            const div = document.createElement('div');
            div.className = 'timeline-item';
            div.innerHTML = `<div class="m-date">${item.date}</div><div class="m-title">${item.title}</div><div class="m-desc">${item.desc}</div>`;
            mobileList.appendChild(div);
        });

        // Configure Desktop Chart
        const chartDom = document.getElementById('main');
        const myChart = echarts.init(chartDom);

        const option = {
            silent: true,
            grid: { left: 60, top: 0, bottom: 0 },
            xAxis: { type: 'value', show: false, min: 0, max: (data.length - 1) * 350 },
            yAxis: { type: 'value', show: false, min: 0, max: 100 },
            series: [{
                type: 'line',
                data: data.map((_, i) => [i * 350, 80]),
                lineStyle: { color: '#e14a3a', width: 4 },
                symbol: 'circle',
                symbolSize: 18,
                itemStyle: { color: '#e14a3a', borderWidth: 4, borderColor: '#F9F3E6' },
                label: {
                    show: true,
                    position: 'bottom',
                    offset: [-9, 25],
                    align: 'left',
                    formatter: (p) => {
                        const item = data[p.dataIndex];
                        const wrappedDesc = forceWordWrap(item.desc, 28);
                        return `{d|${item.date}}\n{t|${item.title}}\n{desc|${wrappedDesc}}`;
                    },
                    rich: {
                        d: { color: '#999', fontWeight: 'bold', fontSize: 14, align: 'left', padding: [0,0,5,0], fontFamily: 'Reckless' },
                        t: { color: '#e14a3a', fontWeight: 'bold', fontSize: 18, align: 'left', padding: [0,0,10,0], fontFamily: 'Reckless' },
                        desc: { color: '#666', fontSize: 14, lineHeight: 20, align: 'left', fontFamily: 'Archivo' }
                    }
                }
            }]
        };
        myChart.setOption(option);

        // Sync scrolling between chart and scrollbar
        const chartScroll = document.getElementById('chartScroll');
        const scrollbarTrack = document.getElementById('scrollbarTrack');
        let syncing = false;
        chartScroll.addEventListener('scroll', () => {
            if (syncing) return;
            syncing = true;
            scrollbarTrack.scrollLeft = chartScroll.scrollLeft;
            syncing = false;
        });
        scrollbarTrack.addEventListener('scroll', () => {
            if (syncing) return;
            syncing = true;
            chartScroll.scrollLeft = scrollbarTrack.scrollLeft;
            syncing = false;
        });
    </script>
</body>
</html>
