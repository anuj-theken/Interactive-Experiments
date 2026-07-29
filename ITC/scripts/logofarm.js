// scripts/logofarm.js — QW4K10

// Server (index.html) loads this script from /ITC/scripts/logofarm.js; local
// (index_localLinked.html) loads it via a relative path. Derive the logos
// folder path from how this very script was loaded so both work unmodified.
const QW4K10_LOGO_BASE = (function () {
    const src = document.currentScript && document.currentScript.getAttribute('src');
    return src && src.indexOf('/ITC/') === 0 ? '/ITC/logos/' : 'logos/';
})();

document.addEventListener("DOMContentLoaded", function () {

    const portfolioData = [
        { name: "Aashirvaad", sector: "foods", logo: "AV", size: 75, founded: 2002, category: "Staples & Atta" },
        { name: "Sunfeast", sector: "foods", logo: "SF", size: 70, founded: 2003, category: "Biscuits & Cookies" },
        { name: "Bingo!", sector: "foods", logo: "BN!", size: 68, founded: 2007, category: "Snacks & Chips" },
        { name: "YiPPee!", sector: "foods", logo: "YP!", size: 65, founded: 2010, category: "Instant Noodles" },
        { name: "B Natural", sector: "foods", logo: "BN", size: 62, founded: 2015, category: "Juices & Beverages" },
        { name: "Fabelle", sector: "foods", logo: "FB", size: 62, founded: 2016, category: "Premium Chocolate" },
        { name: "Sunbean", sector: "foods", logo: "SB", size: 58, founded: 2017, category: "Gourmet Coffee" },
        { name: "Master Chef", sector: "foods", logo: "MC", size: 58, founded: 2016, category: "Frozen & Ready Meals" },
        { name: "Candyman", sector: "foods", logo: "CM", size: 55, founded: 2002, category: "Confectionery" },
        { name: "mint-o", sector: "foods", logo: "MO", size: 55, founded: 2001, category: "Mints & Candy" },
        { name: "Sunrise Pure", sector: "foods", logo: "SR", size: 60, founded: 2020, category: "Spices & Masala" },
        { name: "Farmland", sector: "foods", logo: "FL", size: 58, founded: 2016, category: "Fresh & Frozen Produce" },

        { name: "Gold Flake", sector: "tobacco", logo: "GF", size: 70, founded: 1908, category: "Premium Cigarettes" },
        { name: "Classic", sector: "tobacco", logo: "CL", size: 68, founded: 1990, category: "Premium Cigarettes" },
        { name: "Insignia", sector: "tobacco", logo: "IN", size: 64, founded: 2016, category: "Super-Premium Cigarettes" },
        { name: "Wills", sector: "tobacco", logo: "WL", size: 64, founded: 1958, category: "Cigarettes" },
        { name: "Player's", sector: "tobacco", logo: "PL", size: 58, founded: 2005, category: "Cigarettes" },
        { name: "India Kings", sector: "tobacco", logo: "IK", size: 62, founded: 2002, category: "Premium Cigarettes" },
        { name: "American Club", sector: "tobacco", logo: "AC", size: 60, founded: 1997, category: "Cigarettes" },
        { name: "Flake", sector: "tobacco", logo: "FK", size: 56, founded: 1970, category: "Cigarettes" },
        { name: "Silk Cut", sector: "tobacco", logo: "SC", size: 54, founded: 1964, category: "Cigarettes" },
        { name: "Duke", sector: "tobacco", logo: "DK", size: 54, founded: 2000, category: "Cigarettes" },

        { name: "Fiama", sector: "personal", logo: "FM", size: 68, founded: 2007, category: "Bath & Shower" },
        { name: "Vivel", sector: "personal", logo: "VV", size: 66, founded: 2008, category: "Soaps & Skincare" },
        { name: "Engage", sector: "personal", logo: "EG", size: 66, founded: 2013, category: "Deodorants & Fragrance" },
        { name: "Savlon", sector: "personal", logo: "SV", size: 68, founded: 1990, category: "Hygiene & Antiseptic" },
        { name: "Charmis", sector: "personal", logo: "CH", size: 58, founded: 1965, category: "Skincare & Creams" },
        { name: "Dermafique", sector: "personal", logo: "DF", size: 60, founded: 2016, category: "Premium Skincare" },
        { name: "Nimyle", sector: "personal", logo: "NM", size: 56, founded: 2017, category: "Home Cleaning" },
        { name: "Nimwash", sector: "personal", logo: "NW", size: 56, founded: 2020, category: "Fruit & Veg Wash" },
        { name: "EDW Essenza", sector: "personal", logo: "EE", size: 62, founded: 2018, category: "Premium Fragrance" },

        { name: "ITC Hotels", sector: "hotels", logo: "ITC", size: 72, founded: 1975, category: "Luxury Hotels" },
        { name: "Welcomhotel", sector: "hotels", logo: "WH", size: 66, founded: 1984, category: "Upscale Hotels" },
        { name: "Fortune Hotels", sector: "hotels", logo: "FH", size: 62, founded: 1996, category: "Mid-market Hotels" },
        { name: "Mementos", sector: "hotels", logo: "MM", size: 58, founded: 2021, category: "Luxury Resorts" },
        { name: "Storii", sector: "hotels", logo: "ST", size: 58, founded: 2022, category: "Boutique Hotels" },
        { name: "WelcomHeritage", sector: "hotels", logo: "WHg", size: 56, founded: 1997, category: "Heritage Hotels" },

        { name: "Classmate", sector: "others", logo: "CMS", size: 68, founded: 2003, category: "Stationery & Notebooks" },
        { name: "Paperkraft", sector: "others", logo: "PK", size: 64, founded: 2007, category: "Premium Stationery" },
        { name: "Mangaldeep", sector: "others", logo: "MD", size: 62, founded: 1997, category: "Agarbatti & Incense" },
        { name: "Homelite", sector: "others", logo: "HL", size: 55, founded: 2005, category: "Safety Matches" },
        { name: "AIM", sector: "others", logo: "AM", size: 55, founded: 1996, category: "Safety Matches" }
    ];

    // Field-tone palettes per sector: a spread of greens & golds like real farmland
    const fieldPalettes = {
        foods:    ["#4d7c0f", "#3f6212", "#65a30d", "#84cc16", "#a3b18a", "#556b2f", "#6b8e23"],
        tobacco:  ["#a3a337", "#8a8a2a", "#bfa83a", "#9c9a48", "#c2b280", "#7d7d33", "#b5a642"],
        personal: ["#65a30d", "#4d7c0f", "#77b52a", "#3f6212", "#8fbc5a", "#5c8a1e", "#6ea82f"],
        hotels:   ["#ca8a04", "#a16207", "#d4a017", "#b8860b", "#c9a227", "#9a7b0a", "#dbb42c"],
        others:   ["#3f6212", "#2f4f1e", "#4d7c0f", "#365314", "#5a7d2a", "#33691e", "#456a1a"]
    };

    // Squarified treemap: turns brand sizes into gap-free rectangular plots
    function squarify(items, x, y, w, h) {
        const total = items.reduce((s, it) => s + it.size, 0);
        const scale = (w * h) / total;
        const scaled = items.map(it => ({ ...it, area: it.size * scale }));
        const rects = [];

        function worst(row, len) {
            const sum = row.reduce((s, r) => s + r.area, 0);
            const max = Math.max(...row.map(r => r.area));
            const min = Math.min(...row.map(r => r.area));
            return Math.max((len * len * max) / (sum * sum), (sum * sum) / (len * len * min));
        }

        function layoutRow(row, len, horizontal, ox, oy) {
            const sum = row.reduce((s, r) => s + r.area, 0);
            const thick = sum / len;
            let offset = 0;
            row.forEach(r => {
                const cell = r.area / thick;
                if (horizontal) {
                    rects.push({ ...r, x: ox, y: oy + offset, w: thick, h: cell });
                } else {
                    rects.push({ ...r, x: ox + offset, y: oy, w: cell, h: thick });
                }
                offset += cell;
            });
            return thick;
        }

        let cx = x, cy = y, cw = w, ch = h;
        let remaining = scaled.slice();
        let row = [];

        while (remaining.length) {
            const horizontal = cw >= ch;
            const len = horizontal ? ch : cw;
            const candidate = row.concat(remaining[0]);
            if (row.length === 0 || worst(candidate, len) <= worst(row, len)) {
                row = candidate;
                remaining.shift();
                if (remaining.length === 0) layoutRow(row, len, horizontal, cx, cy);
            } else {
                const thick = layoutRow(row, len, horizontal, cx, cy);
                if (horizontal) { cx += thick; cw -= thick; }
                else { cy += thick; ch -= thick; }
                row = [];
            }
        }
        return rects;
    }

    // ---- Tooltip ----
    const tooltipEl = document.getElementById('QW4K10-brand-tooltip');
    function showTooltip(r) {
        const src2x = `${QW4K10_LOGO_BASE}${r.logo}@2x.png`;
        tooltipEl.innerHTML = `
            <div class="QW4K10-tt-logo-wrap" style="display:none">
                <img class="QW4K10-tt-logo" alt="${r.name} logo"
                     onload="this.parentElement.style.display='flex'">
            </div>
            <div class="QW4K10-tt-name">${r.name}</div>
            <div class="QW4K10-tt-row"><span class="QW4K10-tt-label">Founded</span><span class="QW4K10-tt-val">${r.founded || '—'}</span></div>
            <div class="QW4K10-tt-row"><span class="QW4K10-tt-label">Category</span><span class="QW4K10-tt-val">${r.category || '—'}</span></div>`;
        // set src after wiring onload so the wrap reveals only when an image actually loads;
        // try hi-res first, fall back to standard, stay hidden if neither exists
        const ttImg = tooltipEl.querySelector('.QW4K10-tt-logo');
        if (ttImg) {
            ttImg.onerror = () => {
                if (ttImg.src.indexOf('@2x') !== -1) {
                    ttImg.onerror = null;
                    ttImg.src = `${QW4K10_LOGO_BASE}${r.logo}.png`;
                }
            };
            ttImg.src = src2x;
        }
        tooltipEl.style.opacity = '1';
    }
    function moveTooltip(e) {
        const pad = 16;
        let x = e.clientX + pad;
        let y = e.clientY + pad;
        const tw = tooltipEl.offsetWidth;
        const th = tooltipEl.offsetHeight;
        if (x + tw > window.innerWidth - 8)  x = e.clientX - tw - pad;
        if (y + th > window.innerHeight - 8) y = e.clientY - th - pad;
        tooltipEl.style.left = `${x}px`;
        tooltipEl.style.top = `${y}px`;
    }
    function hideTooltip() { tooltipEl.style.opacity = '0'; }

    function buildSector(canvasId, items, palette, animate) {
        const container = document.getElementById(canvasId);
        container.innerHTML = '';
        const W = container.offsetWidth;
        const H = container.offsetHeight;
        if (!W || !H || items.length === 0) return;

        const rects = squarify(items, 0, 0, W, H);

        rects.forEach((r, idx) => {
            const node = document.createElement('div');
            node.className = 'QW4K10-brand-node';
            const baseColor = palette[idx % palette.length];
            node.style.background = baseColor;
            node.style.setProperty('--furrow-angle', `${(idx * 37) % 180}deg`);

            const showLogo = r.w > 40 && r.h > 40;
            // Logo size scales with plot but stays within bounds
            const logoSize = Math.max(20, Math.min(52, Math.min(r.w, r.h) * 0.4));
            const logoImg = showLogo
                ? `<img class="QW4K10-brand-logo" src="${QW4K10_LOGO_BASE}${r.logo}.png"
                        alt="${r.name} logo"
                        style="width:${logoSize}px;height:${logoSize}px"
                        onerror="this.classList.add('QW4K10-logo-missing')">`
                : '';

            node.innerHTML = `<div class="QW4K10-plot-label">${logoImg}<div class="QW4K10-brand-icon">${r.logo}</div></div>`;

            container.appendChild(node);

            gsap.set(node, {
                x: r.x, y: r.y, width: r.w, height: r.h,
                scale: animate ? 0.4 : 1,
                opacity: animate ? 0 : 1,
                transformOrigin: "center center"
            });

            if (animate) {
                gsap.to(node, {
                    scale: 1, opacity: 1,
                    duration: 0.5, delay: idx * 0.025,
                    ease: "power2.out"
                });
            }

            // Highlight this field plot on hover; dim the rest; show tooltip
            node.addEventListener('mouseenter', () => {
                gsap.to(node, {
                    scale: 1.12,
                    zIndex: 40,
                    boxShadow: "0 14px 32px rgba(20,40,5,0.5)",
                    duration: 0.25
                });
                // dim neighbours subtly with a dark overlay feel, not by brightening the target
                container.querySelectorAll('.QW4K10-brand-node').forEach(o => {
                    if (o !== node) gsap.to(o, { filter: "brightness(0.6)", duration: 0.25 });
                });
                showTooltip(r);
            });
            node.addEventListener('mousemove', moveTooltip);
            node.addEventListener('mouseleave', () => {
                container.querySelectorAll('.QW4K10-brand-node').forEach(o => {
                    gsap.to(o, { filter: "brightness(1)", scale: 1, zIndex: 1, boxShadow: "none", duration: 0.25 });
                });
                hideTooltip();
            });
        });
    }

    // Soft drifting clouds — each a cluster of overlapping puffs seen from
    // above, with a matching shadow cluster cast onto the farm below.
    function addClouds(layerEl) {
        layerEl.innerHTML = '';
        const w = layerEl.offsetWidth;
        const h = layerEl.offsetHeight;
        const count = 2 + Math.floor(Math.random() * 2); // 2 or 3 clouds
        for (let i = 0; i < count; i++) {
            const cloud = document.createElement('div');
            cloud.className = 'QW4K10-cloud';
            const scale = 0.7 + Math.random() * 0.9;          // overall cloud size
            const base = 46 * scale;                          // base puff diameter
            const cloudW = base * 2.6;
            const cloudH = base * 2.0;                        // rounder footprint (top view)
            cloud.style.width = `${cloudW}px`;
            cloud.style.height = `${cloudH}px`;
            cloud.style.top = `${Math.random() * (h - cloudH)}px`;
            cloud.style.left = `${Math.random() * (w - cloudW)}px`;

            // Generate a tight cluster of overlapping puffs with randomized
            // positions and sizes; the gooey filter fuses them into one shape.
            const puffCount = 6 + Math.floor(Math.random() * 3);
            const chosen = [];
            for (let k = 0; k < puffCount; k++) {
                // keep centers near the middle so puffs overlap heavily
                const angle = Math.random() * Math.PI * 2;
                const spread = Math.pow(Math.random(), 0.7) * 0.26; // biased toward center
                chosen.push({
                    x: 0.5 + Math.cos(angle) * spread * 1.15,
                    y: 0.5 + Math.sin(angle) * spread,
                    r: 0.75 + Math.random() * 0.6
                });
            }
            // guarantee one big central puff to anchor the mass
            chosen[0] = { x: 0.5, y: 0.5, r: 1.35 };

            const shadowOffX = base * 0.26;
            const shadowOffY = base * 0.32;

            // Shadow group (cast on farm), fused separately
            const shadowGroup = document.createElement('div');
            shadowGroup.className = 'QW4K10-puff-group QW4K10-shadow-group';
            chosen.forEach(p => {
                const shadow = document.createElement('div');
                shadow.className = 'QW4K10-puff-shadow';
                const d = base * p.r;
                shadow.style.width = `${d}px`;
                shadow.style.height = `${d}px`;
                shadow.style.left = `${p.x * cloudW - d / 2 + shadowOffX}px`;
                shadow.style.top = `${p.y * cloudH - d / 2 + shadowOffY}px`;
                shadowGroup.appendChild(shadow);
            });
            cloud.appendChild(shadowGroup);

            // White group on top, fused separately
            const whiteGroup = document.createElement('div');
            whiteGroup.className = 'QW4K10-puff-group QW4K10-white-group';
            chosen.forEach(p => {
                const puff = document.createElement('div');
                puff.className = 'QW4K10-puff';
                const d = base * p.r;
                puff.style.width = `${d}px`;
                puff.style.height = `${d}px`;
                puff.style.left = `${p.x * cloudW - d / 2}px`;
                puff.style.top = `${p.y * cloudH - d / 2}px`;
                whiteGroup.appendChild(puff);
            });
            cloud.appendChild(whiteGroup);

            layerEl.appendChild(cloud);

            // Slow drift, mostly sideways like real clouds
            gsap.to(cloud, {
                x: (Math.random() > 0.5 ? 1 : -1) * (w * 0.3 + Math.random() * w * 0.25),
                y: (Math.random() - 0.5) * h * 0.1,
                duration: 75 + Math.random() * 45,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        }
    }

    const sectors = ["foods", "tobacco", "personal", "hotels", "others"];

    function layoutAll(animate) {
        sectors.forEach(sec => {
            const items = portfolioData.filter(it => it.sector === sec);
            buildSector(`QW4K10-canvas-${sec}`, items, fieldPalettes[sec], animate);
        });
    }

    window.addEventListener('load', () => {
        layoutAll(true);
        addClouds(document.getElementById('QW4K10-cloud-layer'));
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            layoutAll(false);
            addClouds(document.getElementById('QW4K10-cloud-layer'));
        }, 150);
    });

});
