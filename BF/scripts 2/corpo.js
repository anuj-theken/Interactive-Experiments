gsap.registerPlugin(ScrollTrigger);

// ── Layout: set section + narrative height so sticky has room to pin ──────
function setLayout() {
  //
  // const chart     = document.getElementById('master-chart');
  //   const container = document.querySelector('.sticky-chart');
  //
  //   const naturalWidth = chart.scrollWidth;
  //   const availWidth   = container.clientWidth;
  //
  //   if (window.innerWidth < 800 && naturalWidth > availWidth) {
  //     const scale = availWidth / naturalWidth;
  //     chart.style.transform       = `scale(${scale})`;
  //     chart.style.transformOrigin = 'top center';
  //     // Collapse the dead whitespace transform leaves behind
  //     chart.style.marginBottom = `-${chart.scrollHeight * (1 - scale)}px`;
  //   } else {
  //     chart.style.transform    = '';
  //     chart.style.marginBottom = '';
  //   }
    ScrollTrigger.refresh();
}

// ── Draw connector lines ──────────────────────────────────────────────────
function connect() {
    const svg   = document.getElementById('svg-layer');
    const chart = document.getElementById('master-chart');
    const cRect = chart.getBoundingClientRect();
  const scale = cRect.width / chart.offsetWidth;

    svg.setAttribute('viewBox', `0 0 ${chart.offsetWidth} ${chart.offsetHeight}`);
    svg.innerHTML = '';

    function getPt(id) {
        const el = document.querySelector(id + ' > .box');
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
            x:  (r.left - cRect.left) / scale + (r.width  / scale) / 2,
            yT: (r.top  - cRect.top)  / scale,
            yB: (r.top  - cRect.top + r.height) / scale
        };
    }

    function draw(from, to, isDemerger = false) {
        const p1 = getPt(from); const p2 = getPt(to);
        if (!p1 || !p2) return;
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        if (isDemerger) path.classList.add('demerger');
        const midY = p1.yB + 25;
        path.setAttribute('d', `M ${p1.x} ${p1.yB} L ${p1.x} ${midY} L ${p2.x} ${midY} L ${p2.x} ${p2.yT}`);
        path.setAttribute('data-from', from);
        path.setAttribute('data-to', to);
        svg.appendChild(path);
    }

    draw('#n-promoters', '#n-bhil');
    draw('#n-bhil', '#n-auto',    true);
    draw('#n-bhil', '#n-finserv', true);
    draw('#n-bhil', '#n-msl');
    draw('#n-bhil', '#n-elec');
    draw('#n-bhil', '#n-mukand');
    draw('#n-auto',    '#n-auto-bv');
    draw('#n-finserv', '#n-finance');
    draw('#n-finserv', '#n-finserv-ins');
    draw('#n-finserv', '#n-finserv-amc');
    draw('#n-finance', '#n-housing');
    draw('#n-finance', '#n-securities');
    draw('#n-elec',    '#n-bajel');
    draw('#n-elec',    '#n-indef');
    draw('#n-skb-main','#n-sugar');
    draw('#n-skb-main','#n-consumer');
    draw('#n-skb-main','#n-energy');
}

// ── Highlight logic ───────────────────────────────────────────────────────
function highlight(targets) {
    const allNodes = document.querySelectorAll('.node');
    const allPaths = document.querySelectorAll('path');
    const border   = document.getElementById('skb-border');

    if (targets === 'all') {
        allNodes.forEach(n => { n.classList.remove('dimmed'); n.classList.add('active'); });
        allPaths.forEach(p => p.classList.remove('dimmed'));
        border.classList.remove('dimmed');
        return;
    }

    const ids = targets.split(',').map(s => s.trim());
    allNodes.forEach(n => {
        if (ids.includes('#' + n.id)) {
            n.classList.remove('dimmed'); n.classList.add('active');
        } else {
            n.classList.add('dimmed'); n.classList.remove('active');
        }
    });
    allPaths.forEach(p => {
        const from = p.getAttribute('data-from');
        const to   = p.getAttribute('data-to');
        (ids.includes(to) && ids.includes(from))
            ? p.classList.remove('dimmed')
            : p.classList.add('dimmed');
    });
    const skbActive = ids.some(id => ['#n-skb-main','#n-sugar','#n-consumer','#n-energy'].includes(id));
    skbActive ? border.classList.remove('dimmed') : border.classList.add('dimmed');
}

// ── Boot ──────────────────────────────────────────────────────────────────
window.addEventListener('load', () => {
    setLayout();
    setTimeout(connect, 300);

    // Fade header + legend out when scrolling past the section
    const header = document.querySelector('.header-overlay');
    const legend = document.querySelector('.legend-overlay');
    const editorNote = document.querySelector('.editor-note');
    const section = document.querySelector('.chart-container');

    ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        onEnter: () => {
            [header, legend, editorNote].forEach(el => {
                if (el) el.style.cssText += 'opacity:1; transition: opacity 0.4s ease; pointer-events:auto;';
            });
        },
        onLeave: () => {
            [header, legend, editorNote].forEach(el => {
                if (el) el.style.cssText += 'opacity:0; transition: opacity 0.4s ease; pointer-events:none;';
            });
        },
        onEnterBack: () => {
            [header, legend, editorNote].forEach(el => {
                if (el) el.style.cssText += 'opacity:1; transition: opacity 0.4s ease; pointer-events:auto;';
            });
        },
        onLeaveBack: () => {
            [header, legend, editorNote].forEach(el => {
                if (el) el.style.cssText += 'opacity:0; transition: opacity 0.4s ease; pointer-events:none;';
            });
        }
    });

    // Gracefully hide broken step images
    document.querySelectorAll('.step-img').forEach(img => {
        img.addEventListener('error', () => { img.style.display = 'none'; });
        if (!img.getAttribute('src') || img.getAttribute('src') === '#') img.style.display = 'none';
    });

    // ScrollTrigger per step
    document.querySelectorAll('.step').forEach(step => {
        const targets = step.dataset.target;
        ScrollTrigger.create({
            trigger: step,
            start: "top center",
            end:   "bottom center",
            onToggle: self => {
                if (self.isActive) {
                    highlight(targets);
                } else if (self.direction === -1) {
                    highlight('all');
                }
            }
        });
    });

    // --- Mobile Fixed Logic ---
if (window.innerWidth <= 800) {
    const vizContainer = document.querySelector('.sticky-chart');
    const mainSection = document.querySelector('.gsap-section'); // Or your specific wrapper

    ScrollTrigger.create({
        trigger: mainSection,
        start: 'top 40%', // When the top of the section enters the bottom of the viewport
        end: 'bottom 90%',   // When the bottom of the section leaves the top of the viewport
        onEnter: () => {
            gsap.to(vizContainer, { opacity: 1, duration: 0.4, autoAlpha: 1 });
        },
        onLeave: () => {
            gsap.to(vizContainer, { opacity: 0, duration: 0.4, autoAlpha: 0 });
        },
        onEnterBack: () => {
            gsap.to(vizContainer, { opacity: 1, duration: 0.4, autoAlpha: 1 });
        },
        onLeaveBack: () => {
            gsap.to(vizContainer, { opacity: 0, duration: 0.4, autoAlpha: 0 });
        }
    });
}
});

window.addEventListener('resize', () => { setLayout(); connect(); });
