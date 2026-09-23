// scripts/TK4R2-migration.js — TK4R2 = migration

document.addEventListener("DOMContentLoaded", function () {
  const section = document.querySelector(".TK4R2-chart-section");
  if (!section || typeof L === "undefined" || typeof echarts === "undefined") return;

  // Colors restored to the original prototype's own literal hex values
  // (per explicit user direction — this module keeps its original design
  // instead of the shared --cat-* design tokens).
  const SURFACE = "#ffffff";
  const PARSI_COLOR = "#be123c";
  const TB_COLOR = "#1e3a8a";

  function hexToRgba(hex, alpha) {
    const h = hex.replace("#", "");
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  const PARSI_BAND = hexToRgba(PARSI_COLOR, 0.16);
  const TB_BAND = hexToRgba(TB_COLOR, 0.15);

  // 2. Populate the custom HTML legend
  const legendDom = document.getElementById("TK4R2-legend");
  if (legendDom) {
    legendDom.innerHTML = `
      <div class="TK4R2-legend-row"><span class="TK4R2-legend-line" style="border-top-color:${PARSI_COLOR}"></span> Parsi migration</div>
      <div class="TK4R2-legend-row"><span class="TK4R2-legend-line" style="border-top-color:${TB_COLOR}"></span> Tamil Brahmin migration</div>
      <div class="TK4R2-legend-row"><span class="TK4R2-legend-dot"></span> Origin / destination</div>
    `;
  }

  // 3. Leaflet base map — non-interactive, driven entirely by scroll
  const map = L.map("TK4R2-map", {
    zoomControl: false,
    attributionControl: false,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    tap: false,
    touchZoom: false,
    keyboard: false,
  }).setView([22.0, 65.0], 5);

  L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    { maxZoom: 16, attribution: "Tiles &copy; Esri" }
  ).addTo(map);

  L.control.attribution({ prefix: false, position: "bottomright" }).addTo(map);

  const coords = {
    bombay: [18.922, 72.8347],
    bombayDocks: [18.935, 72.84],
    tataMills: [19.0, 72.845],
  };

  function createFactoryIcon(symbol) {
    return L.divIcon({
      className: "TK4R2-factory-icon",
      html: symbol,
      iconSize: [48, 48],
      iconAnchor: [24, 24],
    });
  }

  L.marker(coords.bombay, { icon: createFactoryIcon("🏭") }).addTo(map);
  L.marker(coords.bombayDocks, { icon: createFactoryIcon("⚓") }).addTo(map);
  L.marker(coords.tataMills, { icon: createFactoryIcon("⚙️") }).addTo(map);

  const journeyDefs = {
    parsiOrigin: { coord: [28.9, 50.7], color: PARSI_COLOR, name: "Persia", date: "Fled Persia · 7th–10th c. CE", labelDir: "right", origin: true },
    tbOrigin: { coord: [10.787, 79.1378], color: TB_COLOR, name: "Kaveri Delta, Tamil Nadu", date: "Ancestral heartland", labelDir: "left", origin: true },
    gujarat: { coord: [20.9168, 72.9098], color: PARSI_COLOR, name: "Sanjan, Gujarat", date: "Landfall · c. 8th–10th c. CE", labelDir: "left", progressKey: "parsiPersiaToGujarat" },
    chennai: { coord: [13.0827, 80.2707], color: TB_COLOR, name: "Chennai, Tamil Nadu", date: "Settled · 18th–19th c.", labelDir: "right", progressKey: "tbKaveriToChennai" },
    bengaluru: { coord: [12.9716, 77.5946], color: TB_COLOR, name: "Bengaluru, Karnataka", date: "Settled · 19th–20th c.", labelDir: "left", progressKey: "tbKaveriToBangalore" },
  };

  function createJourneyIcon(def) {
    const dir = def.labelDir || "right";
    return L.divIcon({
      className: "TK4R2-journey-icon",
      html: `<div class="TK4R2-marker-wrap TK4R2-dir-${dir}">
          <div class="TK4R2-mk-dot" style="background:${def.color};box-shadow:0 0 0 2px ${def.color}"></div>
          <div class="TK4R2-mk-label" style="border-color:${def.color};color:${def.color}">${def.name}</div>
        </div>`,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    });
  }

  const journeyMarkers = {};
  Object.entries(journeyDefs).forEach(([key, def]) => {
    journeyMarkers[key] = L.marker(def.coord, { icon: createJourneyIcon(def), interactive: true })
      .addTo(map)
      .bindTooltip(def.date, { direction: "top", offset: [0, -22], className: "TK4R2-mk-tooltip", sticky: false });
  });

  function setMarkerVisible(key, visible) {
    const el = journeyMarkers[key] && journeyMarkers[key].getElement();
    const wrap = el && el.querySelector(".TK4R2-marker-wrap");
    if (wrap) wrap.classList.toggle("is-visible", visible);
  }

  function updateDestinations() {
    Object.entries(journeyDefs).forEach(([key, def]) => {
      if (!def.progressKey) return;
      setMarkerVisible(key, pathProgress[def.progressKey] >= 0.985);
    });
  }

  function toPt(coord) {
    const pt = map.latLngToContainerPoint(coord);
    return [pt.x, pt.y];
  }

  function lerp(a, b, u) {
    return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
  }

  // Centripetal Catmull-Rom spline: smooth, organic curves through every waypoint
  function buildSmoothRoute(latLngArray, samplesPerSegment = 30) {
    if (latLngArray.length < 2) return [];
    const pts = latLngArray.map(toPt);
    const p = [pts[0], ...pts, pts[pts.length - 1]];
    const path = [];
    const dist = (a, b) => Math.max(Math.hypot(b[0] - a[0], b[1] - a[1]), 1e-6);

    for (let i = 1; i < p.length - 2; i++) {
      const p0 = p[i - 1], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2];
      const t0 = 0;
      const t1 = t0 + Math.pow(dist(p0, p1), 0.5);
      const t2 = t1 + Math.pow(dist(p1, p2), 0.5);
      const t3 = t2 + Math.pow(dist(p2, p3), 0.5);

      for (let j = 0; j < samplesPerSegment; j++) {
        const t = t1 + (t2 - t1) * (j / samplesPerSegment);
        const a1 = lerp(p0, p1, (t - t0) / (t1 - t0));
        const a2 = lerp(p1, p2, (t - t1) / (t2 - t1));
        const a3 = lerp(p2, p3, (t - t2) / (t3 - t2));
        const b1 = lerp(a1, a2, (t - t0) / (t2 - t0));
        const b2 = lerp(a2, a3, (t - t1) / (t3 - t1));
        path.push(lerp(b1, b2, (t - t1) / (t2 - t1)));
      }
    }
    path.push(pts[pts.length - 1]);
    return path;
  }

  function slicePath(points, progress) {
    if (progress <= 0) return [];
    const count = Math.max(2, Math.floor(points.length * Math.min(progress, 1.0)));
    return points.slice(0, count);
  }

  let pathProgress = {
    parsiPersiaToGujarat: 0,
    parsiGujaratToBombay: 0,
    tbKaveriToChennai: 0,
    tbKaveriToBangalore: 0,
    tbKaveriToBombay: 0,
  };

  // Curved transport corridor waypoints
  const parsiSeaRoute = [
    [28.9, 50.7], [27.7, 51.9], [27.0, 53.6], [26.8, 55.1], [26.55, 56.35],
    [25.55, 57.4], [24.3, 59.6], [22.9, 63.2], [21.7, 67.6], [20.3, 69.9],
    [20.05, 71.6], [20.9168, 72.9098],
  ];
  const parsiGujaratToBombayRoute = [
    [20.9168, 72.9098], [20.1, 72.55], [19.4, 72.5], [18.922, 72.8347],
  ];
  const tbChennaiRoute = [
    [10.787, 79.1378], [11.39, 79.69], [11.9416, 79.8083], [12.2253, 79.65], [12.68, 79.98], [13.0827, 80.2707],
  ];
  const tbBangaloreRoute = [
    [10.787, 79.1378], [10.7905, 78.7047], [11.6643, 78.146], [12.1211, 78.1582], [12.5266, 78.2141], [12.7409, 77.8253], [12.9716, 77.5946],
  ];
  const tbBombayRoute = [
    [10.787, 79.1378], [11.6643, 78.146], [13.34, 77.1], [15.1394, 76.9214], [15.3647, 75.124],
    [15.8497, 74.4977], [16.705, 74.2433], [17.6805, 74.0183], [18.5204, 73.8567], [18.922, 72.8347],
  ];

  // 4. ECharts render engine — draws the routes over the sticky map
  const chartDom = document.getElementById("TK4R2-echarts-overlay");
  const myChart = echarts.init(chartDom);

  function getChartOption() {
    const p1 = slicePath(buildSmoothRoute(parsiSeaRoute), pathProgress.parsiPersiaToGujarat);
    const p2 = slicePath(buildSmoothRoute(parsiGujaratToBombayRoute), pathProgress.parsiGujaratToBombay);
    const tb1 = slicePath(buildSmoothRoute(tbChennaiRoute), pathProgress.tbKaveriToChennai);
    const tb2 = slicePath(buildSmoothRoute(tbBangaloreRoute), pathProgress.tbKaveriToBangalore);
    const tb3 = slicePath(buildSmoothRoute(tbBombayRoute), pathProgress.tbKaveriToBombay);

    const bandData = [], dashData = [], travelerData = [];

    function addRoute(points, color, band) {
      if (points.length <= 1) return;
      bandData.push({ coords: points, lineStyle: { color: band, width: 15, cap: "round", join: "round", opacity: 1 } });
      dashData.push({ coords: points, lineStyle: { color: color, width: 3, type: [9, 7], cap: "round" } });
      travelerData.push({ value: points[points.length - 1], itemStyle: { color: color, borderColor: SURFACE, borderWidth: 2 } });
    }

    addRoute(p1, PARSI_COLOR, PARSI_BAND);
    addRoute(p2, PARSI_COLOR, PARSI_BAND);
    addRoute(tb1, TB_COLOR, TB_BAND);
    addRoute(tb2, TB_COLOR, TB_BAND);
    addRoute(tb3, TB_COLOR, TB_BAND);

    return {
      xAxis: { show: false, min: 0, max: map.getSize().x },
      yAxis: { show: false, min: 0, max: map.getSize().y, inverse: true },
      grid: { left: 0, top: 0, right: 0, bottom: 0 },
      series: [
        { type: "lines", coordinateSystem: "cartesian2d", polyline: true, silent: true, z: 1, data: bandData },
        { type: "lines", coordinateSystem: "cartesian2d", polyline: true, silent: true, z: 2, data: dashData },
        {
          type: "scatter", coordinateSystem: "cartesian2d", symbol: "circle", symbolSize: 13, z: 10,
          data: travelerData, label: { show: false },
          itemStyle: { borderColor: SURFACE, borderWidth: 2 },
        },
      ],
    };
  }

  function updateChart() {
    myChart.resize();
    myChart.setOption(getChartOption());
    updateDestinations();
  }

  map.on("move zoom", updateChart);
  window.addEventListener("resize", updateChart);

  // 5. GSAP ScrollTrigger — steps the routes in as the reader scrolls
  gsap.registerPlugin(ScrollTrigger);

  function setFactoriesVisible(visible) {
    section.querySelectorAll(".TK4R2-factory-icon").forEach((el, index) => {
      if (visible) {
        setTimeout(() => el.classList.add("is-visible"), index * 150);
      } else {
        el.classList.remove("is-visible");
      }
    });
  }

  gsap.to(pathProgress, {
    parsiPersiaToGujarat: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: "#TK4R2-step1",
      start: "top center",
      end: "bottom center",
      scrub: true,
      onUpdate: updateChart,
      onEnter: () => { map.flyTo([22.0, 65.0], 5, { duration: 1 }); setMarkerVisible("parsiOrigin", true); },
      onEnterBack: () => { map.flyTo([22.0, 65.0], 5, { duration: 1 }); setFactoriesVisible(false); setMarkerVisible("parsiOrigin", true); },
      onLeaveBack: () => setMarkerVisible("parsiOrigin", false),
    },
  });

  gsap.to(pathProgress, {
    parsiGujaratToBombay: 1,
    tbKaveriToChennai: 1,
    tbKaveriToBangalore: 1,
    tbKaveriToBombay: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: "#TK4R2-step2",
      start: "top center",
      end: "bottom center",
      scrub: true,
      onUpdate: updateChart,
      onEnter: () => { map.flyTo([15.5, 77.0], 6, { duration: 1 }); setMarkerVisible("tbOrigin", true); },
      onEnterBack: () => { map.flyTo([15.5, 77.0], 6, { duration: 1 }); setFactoriesVisible(false); setMarkerVisible("tbOrigin", true); },
      onLeaveBack: () => setMarkerVisible("tbOrigin", false),
    },
  });

  ScrollTrigger.create({
    trigger: "#TK4R2-step3",
    start: "top center",
    end: "top center",
    onEnter: () => map.flyTo(coords.bombayDocks, 12, { duration: 1.8 }),
    onEnterBack: () => { map.flyTo(coords.bombayDocks, 12, { duration: 1.8 }); setFactoriesVisible(false); },
  });

  ScrollTrigger.create({
    trigger: "#TK4R2-step3",
    start: "45% center",
    end: "45% center",
    onEnter: () => setFactoriesVisible(true),
    onLeaveBack: () => setFactoriesVisible(false),
  });

  updateChart();
});
