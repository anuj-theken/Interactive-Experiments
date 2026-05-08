
    const data = [
        { date: '1905', title: 'Industrial Roots', desc: 'Bachhraj Bajaj establishes a cotton ginning factory in Wardha, Maharashtra.' },
        { date: '1906', title: 'Bachhraj Passes Away', desc: 'Jamnalal Bajaj inherits his adopted grandfather Bachraj’s business empire at the age of 17.' },
        { date: '1915', title: 'Bombay Expansion', desc: 'Jamnalal Bajaj opens an office in Bombay and registers the business as Bachhraj Jamnalal.' },
        { date: '1926', title: 'Day One', desc: 'Jamnalal formally establishes the Bajaj Group.' },
        { date: '1945', title: 'Bachhraj Trading Pvt. Ltd.', desc: 'Incorporated as a trading entity.' },
        { date: '1960', title: 'IPO', desc: 'Bachhraj Trading Pvt. Ltd. is rechristened Bajaj Auto and becomes a public company.' },
        { date: '1987', title: 'Captive Financing', desc: 'Bajaj Auto Finance Ltd. is incorporated and offers credit primarily to Bajaj’s customers.' },
        { date: '2001', title: 'Insurance JVs', desc: 'Bajaj Allianz Life Insurance and Bajaj Allianz General Insurance are announced.' },
        { date: '2007', title: 'Financial Focus', desc: 'Bajaj Finserv Ltd. forms in April via a demerger from Bajaj Auto Limited.' },
        { date: '2009', title: 'Family Schism', desc: 'Shishir and Kushagra separate from the Group, taking the sugar, power, and consumer care businesses.' },
        { date: '2015', title: 'No Cost EMI Marketplace', desc: 'Bajaj Mall launches.' },
        { date: '2018', title: 'Competing with Policybazaar', desc: 'Bajaj Markets launches.' },
        { date: '2018', title: 'Business Empire', desc: 'Bajaj Group becomes the fourth largest Indian business group by market capitalisation.' },
        { date: '2019', title: 'Easy Trading', desc: 'Bajaj Broking launches.' },
        { date: '2020', title: 'Death of a Mentor', desc: 'Nanoo Pamnani passes away.' },
        { date: '2022', title: 'End of an Era', desc: 'Rahul Bajaj passes away.' },
        { date: '2024', title: 'Another IPO', desc: 'Bajaj Housing Finance goes public on 16 September.' },
        { date: '2025', title: 'Musical Chairs', desc: 'Rajeev Jain is succeeded by Anup Saha as MD, but Saha steps down and Jain returns.' },
        { date: '2026', title: 'Upward and Onward', desc: 'Bajaj Finance’s assets under management crosses Rs 5 lakh crore in FY26.' }
    ];

    function forceWordWrap(text, maxCharsPerLine) {
        const words = text.split(' ');
        let lines = [];
        let currentLine = '';
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

    const mobileList = document.getElementById('mobile-list');
    data.forEach(item => {
        const div = document.createElement('div');
        div.className = 'timeline-item';
        div.innerHTML = `<div class="m-date">${item.date}</div><div class="m-title">${item.title}</div><div class="m-desc">${item.desc}</div>`;
        mobileList.appendChild(div);
    });

    const chartDom = document.getElementById('main');
    const myChart = echarts.init(chartDom);

    const horizontalSpacing = 280; // Reduced from 380 for tighter layout

    const option = {
        silent: true,
        grid: { left: 60, right: 60, top: 0, bottom: 0 },
        xAxis: { type: 'value', show: false, min: 0, max: (data.length - 1) * horizontalSpacing },
        yAxis: { type: 'value', show: false, min: 0, max: 100 },
        series: [{
            type: 'line',
            data: data.map((_, i) => [i * horizontalSpacing, 75]),
            lineStyle: { color: '#0F5FBF', width: 4 },
            symbol: 'circle',
            symbolSize: 18,
            itemStyle: { color: '#0F5FBF', borderWidth: 4, borderColor: '#F5F2E8' },
            label: {
                show: true,
                position: 'bottom',
                offset: [-9, 10],
                align: 'left',
                formatter: (p) => {
                    const item = data[p.dataIndex];
                    const wrappedDesc = forceWordWrap(item.desc, 32); // Slightly narrower wrap for tighter spacing
                    return `{d|${item.date}}\n{t|${item.title}}\n{desc|${wrappedDesc}}`;
                },
                rich: {
                    d: { color: '#999', fontWeight: 'bold', fontSize: 14, align: 'left', padding: [0,0,8,0], fontFamily: 'Reckless' },
                    t: { color: '#0F5FBF', fontWeight: 'bold', fontSize: 18, align: 'left', padding: [0,0,12,0], fontFamily: 'Reckless' },
                    desc: { color: '#666', fontSize: 14, lineHeight: 22, align: 'left', fontFamily: 'Archivo' }
                }
            }
        }]
    };
    myChart.setOption(option);
