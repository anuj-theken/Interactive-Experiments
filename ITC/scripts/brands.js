// scripts/brands.js — QW4K4

document.addEventListener("DOMContentLoaded", function () {

    gsap.registerPlugin(ScrollTrigger);

    let chart;

    const segments = {
        biscuits: {
            color: "#ba7029",
            companies: [
                { name: "Britannia", share: "31%", color: "#ba7029", desc: "Maintains clear market leadership through extensive product variants and premium brand positioning." },
                { name: "Parle", share: "29%", color: "#d9a770", desc: "Drives substantial volumes by dominating the mass-market glucose biscuit domain with unparalleled value options." },
                { name: "ITC Sunfeast & Others", share: "40%", color: "#a5a5a5", desc: "Encompasses highly disruptive segments led by Sunfeast, redefining modern cookies and cream-filled segments." }
            ],
            footer: "Sources & Dates: 2023 Industry Structure - Statista Market Insights",
            chartData: [
                { name: "Britannia", value: 31 },
                { name: "Parle", value: 29 },
                { name: "Others (inc. ITC)", value: 40 }
            ],
            colors: ["#ba7029", "#d9a770", "#a5a5a5"]
        },
        snacks: {
            color: "#a62b2b",
            companies: [
                { name: "Frito-Lay (PepsiCo)", share: "~50%", color: "#a62b2b", desc: "Longstanding sector leader dominating western potato chip configurations and extensive retail trade footprints." },
                { name: "Haldiram's", share: "~25%", color: "#e67e7e", desc: "Maintains an unshakeable fortress in traditional Indian ethnic snacks and namkeens across demographic lines." },
                { name: "Bingo! (ITC)", share: "~16%", color: "#611212", desc: "Shook the segment landscape within 9 months of operations using alternative product structures like Mad Angles." },
                { name: "Others", share: "9%", color: "#a5a5a5", desc: "Local regional players adapting price-point strategies to challenge pan-Indian supply networks." }
            ],
            footer: "Sources & Dates: 2007 Market Share (Within 9 months of launch) - MarkHub24",
            chartData: [
                { name: "Frito-Lay", value: 50 },
                { name: "Haldiram's", value: 25 },
                { name: "ITC Bingo!", value: 16 },
                { name: "Others", value: 9 }
            ],
            colors: ["#a62b2b", "#e67e7e", "#611212", "#a5a5a5"]
        },
        noodles: {
            color: "#16527d",
            companies: [
                { name: "Nestlé Maggi", share: "66%", color: "#16527d", desc: "Secured resilient top-of-mind dominance post-recovery, driving sector preferences through its signature masala profile." },
                { name: "ITC Yippee!", share: "22%", color: "#549bc7", desc: "Solidified structural duopoly tier via long non-sticky round blocks and innovative multi-veggie offerings." },
                { name: "Others", share: "12%", color: "#a5a5a5", desc: "Alternative instant consumer variants including instant cup noodles and health-oriented multi-grain items." }
            ],
            footer: "Sources & Dates: 2026 Category Pulse Review - Multibagg.ai",
            chartData: [
                { name: "Nestlé Maggi", value: 66 },
                { name: "ITC Yippee!", value: 22 },
                { name: "Others", value: 12 }
            ],
            colors: ["#16527d", "#549bc7", "#a5a5a5"]
        }
    };

    function renderChart(dataKey) {
        const data = segments[dataKey];
        const chartDom = document.getElementById("QW4K4-dynamicFMCGChart");
        if (!chartDom) return;

        if (chart) { chart.dispose(); }
        chart = echarts.init(chartDom);

        const isMobile = window.innerWidth <= 768;

        const option = {
            animationDuration: 550,
            tooltip: {
                trigger: "item",
                formatter: "{b}: {c}%",
                backgroundColor: "rgba(0,0,0,0.85)",
                textStyle: { color: "#fff", fontFamily: "Archivo" },
                borderWidth: 0
            },
            series: [{
                type: "pie",
                radius: isMobile ? ["0%", "80%"] : ["0%", "95%"],
                center: ["50%", "50%"],
                avoidLabelOverlap: true,
                itemStyle: {
                    borderRadius: 0,
                    borderColor: getComputedStyle(document.documentElement).getPropertyValue('--color-bg').trim(),
                    borderWidth: 2
                },
                label: {
                    show: true,
                    position: 'inside',
                    formatter: '{b}\n{c}%',
                    fontFamily: "Archivo",
                    fontWeight: "700",
                    fontSize: isMobile ? 11 : 13,
                    color: "#ffffff",
                    textShadowBlur: 4,
                    textShadowColor: "rgba(0,0,0,0.4)"
                },
                labelLine: {
                    show: false
                },
                data: data.chartData.map((item, idx) => ({
                    name: item.name,
                    value: item.value,
                    itemStyle: { color: data.colors[idx] }
                }))
            }]
        };
        chart.setOption(option);
    }

    function updateHUD(key) {
        const data = segments[key];
        const gridContainer = document.getElementById("QW4K4-main-grid-workspace");

        // Clean up old company entries safely
        const existingBlocks = gridContainer.querySelectorAll('.QW4K4-company-row');
        existingBlocks.forEach(block => block.remove());

        // Build structural columns
        data.companies.forEach((company, index) => {
            const rowBlock = document.createElement("div");
            rowBlock.className = "QW4K4-company-row";
            rowBlock.style.borderColor = company.color;

            rowBlock.style.gridColumn = (index % 2 === 0) ? "1" : "2";
            rowBlock.style.gridRow = Math.floor(index / 2) + 1;

            const nameSpan = document.createElement("span");
            nameSpan.className = "QW4K4-company-name";
            nameSpan.style.color = company.color;
            nameSpan.textContent = company.name;

            const shareDiv = document.createElement("div");
            shareDiv.className = "QW4K4-market-share-val";
            shareDiv.style.color = company.color;
            shareDiv.textContent = company.share;

            const descDiv = document.createElement("div");
            descDiv.className = "QW4K4-company-desc";
            descDiv.textContent = company.desc;

            rowBlock.appendChild(nameSpan);
            rowBlock.appendChild(shareDiv);
            rowBlock.appendChild(descDiv);

            gridContainer.insertBefore(rowBlock, gridContainer.querySelector('.QW4K4-chart-side'));
        });

        // Adjust the absolute height span of the pie chart column to seamlessly center vertically
        const totalRows = Math.ceil(data.companies.length / 2);
        gridContainer.querySelector('.QW4K4-chart-side').style.gridRow = `1 / span ${totalRows}`;

        // Footer assignment
        document.getElementById("QW4K4-dynamic-footer").textContent = data.footer;

        // Nav Tab highlights
        document.querySelectorAll(".QW4K4-category-tab").forEach(tab => {
            tab.className = "QW4K4-category-tab";
        });
        document.getElementById(`QW4K4-tab-${key}`).classList.add(`QW4K4-active-${key}`);

        // Transition Chart Rendering
        renderChart(key);
    }

    function initScrollTriggers() {
        // Pin the HUD for exactly the scroll range this module's own steps span —
        // GSAP's native pin (not a hand-rolled position:fixed) so it automatically
        // un-pins at the boundary instead of sticking over whatever comes after it.
        ScrollTrigger.create({
            trigger: '.QW4K4-scroll-container',
            start: 'top top',
            end: 'bottom bottom',
            pin: '.QW4K4-viewport-container'
        });

        const targetKeys = ["biscuits", "snacks", "noodles"];

        targetKeys.forEach(key => {
            ScrollTrigger.create({
                trigger: `#QW4K4-step-${key}`,
                start: "top center",
                end: "bottom center",
                onEnter: () => updateHUD(key),
                onEnterBack: () => updateHUD(key)
            });
        });
    }

    updateHUD("biscuits");
    initScrollTriggers();

    let resizeDebounce;
    window.addEventListener("resize", () => {
        clearTimeout(resizeDebounce);
        resizeDebounce = setTimeout(() => {
            if (chart) {
                chart.resize();
                const activeTab = document.querySelector(".QW4K4-category-tab[class*='QW4K4-active-']");
                if (activeTab) {
                    const key = activeTab.id.replace("QW4K4-tab-", "");
                    renderChart(key);
                }
            }
        }, 150);
    });

});
