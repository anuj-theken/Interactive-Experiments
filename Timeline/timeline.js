const data = [
    { date: 'Mid-1930s', title: 'Neptune Trading Agency', desc: 'Champaklal Hiralal Choksey and Suryakant Chandulal Dani establish Neptune Trading Agency to sell paint.' },
    { date: '1942', title: 'Garage Production', desc: 'Chimanlal Nanabhai Choksi and Arvind Ishwarlal Vakil join Choksey and Dani to manufacture their own paint in a garage. They sell "battleship grey" topcoat and "red lead" primer for warships during World War II. The paints are made by mixing primary colours by hand.' },
    { date: '9 Nov 1942', title: 'Asian Paints Formed', desc: 'Another new partner, Jamnadas Vora, joins the venture. Together, they form Asian Paints. Vora is the largest partner.' },
    { date: '1945', title: 'Conversion', desc: 'Asian Oil and Paint Company (India) Limited is converted from a partnership to a company.' },
    { date: '15 Aug 1947', title: 'Independence', desc: 'India shakes off British rule,' },
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
// Function to force word wrap at a specific character count
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

    // Join lines with the newline character ECharts respects
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

// Configure Desktop
const chartDom = document.getElementById('main');
const myChart = echarts.init(chartDom);

const option = {
    silent: true,
    grid: { left: 60, top: 0 },
    xAxis: { type: 'value', show: false, min: 0, max: (data.length - 1) * 350 },
    yAxis: { type: 'value', show: false, min: 0, max: 100 },
    series: [{
        type: 'line',
        data: data.map((_, i) => [i * 350, 50]),
        lineStyle: { color: '#e14a3a', width: 4 },
        symbol: 'circle',
        symbolSize: 18,
        itemStyle: { color: '#e14a3a', borderWidth: 4, borderColor: '#F9F3E6' },
        // --- REPLACE YOUR CURRENT LABEL BLOCK WITH THIS ---
        label: {
            show: true,
            position: 'bottom',
            offset: [-9, 25],
            align: 'left',
            formatter: (p) => {
                const item = data[p.dataIndex];
                // Wrap the text at roughly 35 characters (adjust number to make wider/narrower)
                const wrappedDesc = forceWordWrap(item.desc, 25);
                return `{d|${item.date}}\n{t|${item.title}}\n{desc|${wrappedDesc}}`;
            },
            rich: {
                d: { color: '#999', fontWeight: 'bold', fontSize: 14, align: 'left', padding: [0,0,5,0], fontFamily: 'Reckless' },
                t: { color: '#e14a3a', fontWeight: 'bold', fontSize: 18, align: 'left', padding: [0,0,10,0], fontFamily: 'Reckless' },
                desc: { color: '#666', fontSize: 14, lineHeight: 20, align: 'left', fontFamily: 'Archivo'}
                // Notice: width and overflow are removed from here!
            }
        }
        // ------------------------------------------------
    }]
};
myChart.setOption(option);
