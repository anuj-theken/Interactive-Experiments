const chartDom = document.getElementById('main');
const myChart = echarts.init(chartDom, 'dark');

// Mapping categories to base filming durations
const filmStats = {
    'Movie-Epic': { days: 110, color: '#ff3e3e' },
    'Movie-Standard': { days: 55, color: '#ff7675' },
    'Movie-Indie': { days: 25, color: '#fab1a0' },
    'Show': { days: 15, color: '#00fbff' },
    'Ad': { days: 3, color: '#ffcc00' }
};

const rawData = [
    // Original entries
    { name: "The Rock", year: 1996, cat: 'Movie-Epic' },
    { name: "Con Air", year: 1997, cat: 'Movie-Epic' },
    { name: "Face/Off", year: 1997, cat: 'Movie-Epic' },
    { name: "Leaving Las Vegas", year: 1995, cat: 'Movie-Indie' },
    { name: "National Treasure", year: 2004, cat: 'Movie-Epic' },
    { name: "Ghost Rider", year: 2007, cat: 'Movie-Epic' },
    { name: "Pig", year: 2021, cat: 'Movie-Indie' },
    { name: "Mandy", year: 2018, cat: 'Movie-Indie' },
    { name: "Dream Scenario", year: 2023, cat: 'Movie-Standard' },
    { name: "Sankyo Ad", year: 2005, cat: 'Ad' },
    { name: "History of Swear Words", year: 2021, cat: 'Show' },
    { name: "Spider-Noir", year: 2025, cat: 'Show' },
    { name: "Longlegs", year: 2024, cat: 'Movie-Standard' },
    { name: "The Surfer", year: 2025, cat: 'Movie-Standard' },
    { name: "Madden", year: 2026, cat: 'Movie-Epic' },

    // Additional movies
    { name: "Raising Arizona", year: 1987, cat: 'Movie-Indie' },
    { name: "Moonstruck", year: 1987, cat: 'Movie-Standard' },
    { name: "Vampire's Kiss", year: 1988, cat: 'Movie-Indie' },
    { name: "Wild at Heart", year: 1990, cat: 'Movie-Indie' },
    { name: "Honeymoon in Vegas", year: 1992, cat: 'Movie-Standard' },
    { name: "Red Rock West", year: 1993, cat: 'Movie-Indie' },
    { name: "Guarding Tess", year: 1994, cat: 'Movie-Standard' },
    { name: "It Could Happen to You", year: 1994, cat: 'Movie-Standard' },
    { name: "Kiss of Death", year: 1995, cat: 'Movie-Standard' },
    { name: "The Family Man", year: 2000, cat: 'Movie-Standard' },
    { name: "Adaptation", year: 2002, cat: 'Movie-Indie' },
    { name: "Matchstick Men", year: 2003, cat: 'Movie-Standard' },
    { name: "Lord of War", year: 2005, cat: 'Movie-Standard' },
    { name: "The Wicker Man", year: 2006, cat: 'Movie-Standard' },
    { name: "National Treasure: Book of Secrets", year: 2007, cat: 'Movie-Epic' },
    { name: "Knowing", year: 2009, cat: 'Movie-Epic' },
    { name: "Kick-Ass", year: 2010, cat: 'Movie-Standard' },
    { name: "Drive Angry", year: 2011, cat: 'Movie-Epic' },
    { name: "Ghost Rider: Spirit of Vengeance", year: 2012, cat: 'Movie-Epic' },
    { name: "Joe", year: 2013, cat: 'Movie-Indie' },
    { name: "Mom and Dad", year: 2017, cat: 'Movie-Indie' },
    { name: "Spider-Man: Into the Spider-Verse", year: 2018, cat: 'Movie-Epic' },
    { name: "Color Out of Space", year: 2019, cat: 'Movie-Indie' },
    { name: "Willy's Wonderland", year: 2021, cat: 'Movie-Standard' },
    { name: "The Unbearable Weight of Massive Talent", year: 2022, cat: 'Movie-Standard' },
    { name: "Renfield", year: 2023, cat: 'Movie-Standard' },
    { name: "Arcadian", year: 2024, cat: 'Movie-Standard' },

    // Additional shows/ads
    { name: "Saturday Night Live", year: 1992, cat: 'Show' },
    { name: "Saturday Night Live", year: 2024, cat: 'Show' },
    { name: "Pachinko Ad", year: 2002, cat: 'Ad' },
    { name: "Montblanc Ad", year: 2009, cat: 'Ad' }
];

// Group by year to calculate vertical positions
const yearGroups = {};
rawData.forEach(item => {
    if (!yearGroups[item.year]) yearGroups[item.year] = [];
    yearGroups[item.year].push(item);
});

// Create separate series for each category (needed for legend)
const seriesData = {
    'Movie-Epic': [],
    'Movie-Standard': [],
    'Movie-Indie': [],
    'Show': [],
    'Ad': []
};

rawData.forEach(item => {
    const stats = filmStats[item.cat];
    const itemsInYear = yearGroups[item.year];
    const indexInYear = itemsInYear.indexOf(item);
    const numItems = itemsInYear.length;

    // Spread vertically based on number of items in that year
    const spread = 5;
    const yValue = ((indexInYear / Math.max(numItems - 1, 1)) - 0.5) * spread * Math.sqrt(numItems);

    // Add random jitter for natural beeswarm look
    const jitter = (Math.random() - 0.5) * 5;

    seriesData[item.cat].push({
        name: item.name,
        value: [item.year, yValue + jitter, stats.days]
    });
});

const option = {
  grid: {
  top: '15%',
  bottom: '12%',
  left: '15%',      // Increase from 10% to add more left margin
  right: '15%',     // Increase from 10% to add more right margin
  height: '80%',    // Add this to limit vertical height
  width: '60%'      // Add this to limit horizontal width
},
    title: {
        text: 'The Age of Nicolas Cage',
        subtext: 'A distribution of all the public appearances made by him in pop culture.',
        left: 'center',
        top: '5%'
    },
    legend: {
        data: [
            { name: 'Movie-Epic', icon: 'circle' },
            { name: 'Movie-Standard', icon: 'circle' },
            { name: 'Movie-Indie', icon: 'circle' },
            { name: 'Show', icon: 'circle' },
            { name: 'Ad', icon: 'circle' }
        ],
        // top: '10%',
        bottom: '0%',
        left: 'center',
        textStyle: {
            color: '#999'
        }
    },
    tooltip: {
        formatter: (p) => `<b>${p.data.name}</b><br/>Year: ${p.value[0]}<br/>Filming: ~${p.value[2]} days`
    },
    grid: {
        top: '15%',
        bottom: '12%',
        left: '10%',
        right: '10%'
    },
    xAxis: {
        type: 'value',
        min: 1985,
        max: 2027,
        splitLine: { show: true, lineStyle: { color: '#333' } },
        axisLabel: { color: '#999' }
    },
    yAxis: {
        type: 'value',
        show: false,
        min: -100,
        max: 100
    },
    series: Object.keys(filmStats).map(cat => ({
        name: cat,
        type: 'scatter',
        symbolSize: 8,
        data: seriesData[cat],
        itemStyle: {
            color: filmStats[cat].color,
            shadowBlur: 10,
            shadowColor: filmStats[cat].color
        },
        emphasis: {
            scale: 1.5,
            label: {
                show: true,
                formatter: '{b}',
                position: 'top',
                color: '#f6f6f6'
            }
        }
    }))
};

myChart.setOption(option);
window.onresize = () => myChart.resize();
