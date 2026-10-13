// scripts/TK4R4-globe.js — "Follow the Sun" + "A Global Footprint" (V6.2/V6.3)
// Requires (loaded before this file): three.js r128, CSS2DRenderer, OrbitControls,
// GSAP + ScrollTrigger, and scripts/TK4R4-globe_data.js (TK4R4_LAND_DOTS, TK4R4_officeCountries, TK4R4_CITY_COORDS).

document.addEventListener("DOMContentLoaded", function () {
  // ── 0. Original suntime.html palette — restored verbatim per explicit
  // user request (this module keeps its own design, not the site tokens) ──
  const PRIMARY = "#a8631f"; // accent / rust-gold
  const SIGNAL = "#b5451f";  // active / red

  // Three gradient stops per story beat, verbatim from suntime.html's own timeline.
  const MOOD_DEFAULT = ["#f7f2e8", "#efe7d7", "#e6dcc7"];
  const MOOD_SUNRISE = ["#fbf4e6", "#f2e5cb", "#ead6b3"];
  const MOOD_GLOBAL = ["#f4f2ea", "#e8e7da", "#dde0cd"];

  const root = document.documentElement;
  root.style.setProperty("--TK4R4-mood-1", MOOD_DEFAULT[0]);
  root.style.setProperty("--TK4R4-mood-2", MOOD_DEFAULT[1]);
  root.style.setProperty("--TK4R4-mood-3", MOOD_DEFAULT[2]);

  // ── 1. THREE.JS & CSS2D RENDERER SETUP ────────────────────────────────
  const container = document.getElementById("TK4R4-canvas-container");
  if (!container) return;
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

  // ── Phone layout (same 860px breakpoint as the CSS) ──
  // A portrait phone is far narrower than the globe at the desktop camera
  // distance, so on phones the camera pulls back until the globe fits the
  // screen width, the globe sits centred in the top part of the screen, and
  // the story text is anchored to the bottom (see TK4R4-globe.css). Chosen at
  // load, like the rest of this module's layout.
  const IS_MOBILE = window.matchMedia("(max-width: 860px)").matches;
  const WORLD_GLOBE_R = 2.0 * 0.6; // globeRadius * globeScale, defined below
  const HALF_FOV_TAN = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  // Camera distance at which the globe takes up at most `wFrac` of the view's
  // width and `hFrac` of its height.
  function fitCameraZ(aspect, wFrac, hFrac) {
    return Math.max(WORLD_GLOBE_R / (wFrac * HALF_FOV_TAN * aspect), WORLD_GLOBE_R / (hFrac * HALF_FOV_TAN));
  }
  camera.position.z = IS_MOBILE ? fitCameraZ(camera.aspect, 0.86, 0.42) : 5.2;
  // World y that puts the globe's centre `frac` of the way down the screen.
  function yAtScreenFrac(frac) {
    return camera.position.z * HALF_FOV_TAN * (1 - 2 * frac);
  }

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const labelRenderer = new THREE.CSS2DRenderer();
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.domElement.style.position = "absolute";
  labelRenderer.domElement.style.top = "0px";
  labelRenderer.domElement.style.pointerEvents = "none";
  container.appendChild(labelRenderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(ambientLight);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(5, 5, 4);
  scene.add(dirLight);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = false;
  controls.enabled = false;

  const globeGroup = new THREE.Group();
  scene.add(globeGroup);
  // Set from the story layout (usaGroupPos) further down.
  const globeScale = 0.6;
  globeGroup.scale.setScalar(globeScale);

  // ── 2. GLOBE MODEL — graticule + dotted land ──
  const globeRadius = 2.0;

  function latLongToVector3(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -(radius * Math.sin(phi) * Math.cos(theta)),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  }

  // Graticule — thin meridian/parallel lines, original suntime.html palette.
  const graticuleMat = new THREE.LineBasicMaterial({
    color: new THREE.Color("#c4b9a5"),
    transparent: true,
    opacity: 0.16,
    depthWrite: false,
  });
  (function buildGraticule() {
    const verts = [];
    const R = globeRadius * 1.002;
    const SEG = 96;
    for (let lat = -80; lat <= 80; lat += 20) {
      for (let i = 0; i < SEG; i++) {
        const a = (i / SEG) * 360 - 180;
        const b = ((i + 1) / SEG) * 360 - 180;
        const p1 = latLongToVector3(lat, a, R);
        const p2 = latLongToVector3(lat, b, R);
        verts.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
      }
    }
    for (let lon = -180; lon < 180; lon += 20) {
      for (let i = 0; i < SEG; i++) {
        const a = (i / SEG) * 180 - 90;
        const b = ((i + 1) / SEG) * 180 - 90;
        const p1 = latLongToVector3(a, lon, R);
        const p2 = latLongToVector3(b, lon, R);
        verts.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
    globeGroup.add(new THREE.LineSegments(geo, graticuleMat));
  })();

  const dotPositions = [];
  for (let i = 0; i < TK4R4_LAND_DOTS.length; i += 2) {
    const v = latLongToVector3(TK4R4_LAND_DOTS[i] / 10, TK4R4_LAND_DOTS[i + 1] / 10, globeRadius);
    dotPositions.push(v.x, v.y, v.z);
  }
  const dotsGeo = new THREE.BufferGeometry();
  dotsGeo.setAttribute("position", new THREE.Float32BufferAttribute(dotPositions, 3));

  // Land-dot colour shifts across the three story beats: warm charcoal (night) ->
  // sunrise gold ("follow the sun") -> deep teal (global payoff). Original palette.
  const DOT_NIGHT = new THREE.Color("#463f34");
  const DOT_DAY = new THREE.Color("#b07d1e");
  const DOT_GLOBAL = new THREE.Color("#33685c");

  const dotUniforms = {
    uColor: { value: DOT_NIGHT.clone() },
    uSize: { value: 4.3 },
    uDpr: { value: renderer.getPixelRatio() },
    uFront: { value: 0.95 },
    uBack: { value: 0.13 },
  };
  const dotsMat = new THREE.ShaderMaterial({
    uniforms: dotUniforms,
    transparent: true,
    depthWrite: false,
    vertexShader: `
      uniform float uSize;
      uniform float uDpr;
      varying float vFacing;
      void main() {
        vec3 n = normalize(normalMatrix * normalize(position));
        vFacing = n.z;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = uSize * uDpr * (2.6 / -mv.z);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uFront;
      uniform float uBack;
      varying float vFacing;
      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float circle = smoothstep(0.5, 0.32, length(uv));
        if (circle <= 0.001) discard;
        float facing = smoothstep(-0.18, 0.30, vFacing);
        gl_FragColor = vec4(uColor, mix(uBack, uFront, facing) * circle);
      }
    `,
  });
  const dotsMesh = new THREE.Points(dotsGeo, dotsMat);
  globeGroup.add(dotsMesh);

  // Faint atmosphere rim, tweened per story beat — original palette.
  const atmosGeo = new THREE.SphereGeometry(globeRadius + 0.02, 64, 64);
  const atmosMat = new THREE.MeshBasicMaterial({
    color: 0xcdbb9c,
    transparent: true,
    opacity: 0.05,
    side: THREE.BackSide,
    depthWrite: false,
  });
  globeGroup.add(new THREE.Mesh(atmosGeo, atmosMat));
  const ATMOS_SUNRISE = new THREE.Color(1, 0.68, 0.4);
  const ATMOS_GLOBAL = new THREE.Color(0.22, 0.85, 0.63);

  // ── 3. MARKERS ─────────────────────────────────────────────────────
  function createSurfaceMarker(color, radius = 0.03) {
    const group = new THREE.Group();
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 16, 16),
      new THREE.MeshBasicMaterial({ color: color })
    );
    group.add(core);
    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(radius * 2.2, 20, 20),
      new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0, depthWrite: false })
    );
    group.add(halo);
    const hit = new THREE.Mesh(
      new THREE.SphereGeometry(radius * 3.2, 12, 12),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hit.visible = false;
    group.add(hit);
    group.userData.core = core;
    group.userData.halo = halo;
    group.userData.hit = hit;
    group.userData.baseColor = new THREE.Color(color);
    return group;
  }

  function placeMarkerOnSurface(marker, lat, lon) {
    const pos = latLongToVector3(lat, lon, globeRadius + 0.005);
    marker.position.copy(pos);
    marker.lookAt(pos.clone().multiplyScalar(2));
  }

  function computeGlobeRotation(lat, lon, groupPos, radius, cameraPos, cameraForward) {
    const local = latLongToVector3(lat, lon, 1);
    const C = new THREE.Vector3().subVectors(cameraPos, groupPos);
    const F = cameraForward.clone().normalize();
    const b = C.dot(F);
    const c = C.lengthSq() - radius * radius;
    const disc = Math.max(b * b - c, 0);
    const t = -b - Math.sqrt(disc);
    const target = C.clone().addScaledVector(F, t).divideScalar(radius).normalize();
    const alignQuat = new THREE.Quaternion().setFromUnitVectors(local, target);
    const poleRotated = new THREE.Vector3(0, 1, 0).applyQuaternion(alignQuat);
    const worldUp = new THREE.Vector3(0, 1, 0);
    const desiredUp = worldUp.clone().sub(target.clone().multiplyScalar(worldUp.dot(target))).normalize();
    const currentUp = poleRotated.clone().sub(target.clone().multiplyScalar(poleRotated.dot(target))).normalize();
    const rollQuat = new THREE.Quaternion().setFromUnitVectors(currentUp, desiredUp);
    const finalQuat = rollQuat.multiply(alignQuat);
    const euler = new THREE.Euler().setFromQuaternion(finalQuat, "XYZ");
    return { x: euler.x, y: euler.y, z: euler.z };
  }

  function createCityAnnotation(text, isSignal = false) {
    const div = document.createElement("div");
    div.className = "TK4R4-city-label" + (isSignal ? " TK4R4-signal" : "");
    div.innerHTML = '<span class="TK4R4-dot"></span><span class="TK4R4-label-text">' + text + "</span>";
    return new THREE.CSS2DObject(div);
  }

  const nyMarker = createSurfaceMarker(PRIMARY);
  placeMarkerOnSurface(nyMarker, 40.7128, -74.006);
  const nyLabel = createCityAnnotation("New York, USA");
  nyLabel.position.set(0, 0.1, 0);
  nyMarker.add(nyLabel);
  globeGroup.add(nyMarker);

  const indiaMarker = createSurfaceMarker(SIGNAL);
  placeMarkerOnSurface(indiaMarker, 19.076, 72.8777);
  const indiaLabel = createCityAnnotation("Bombay, India", true);
  indiaLabel.position.set(0, 0.1, 0);
  indiaMarker.add(indiaLabel);
  indiaMarker.scale.set(0, 0, 0);
  globeGroup.add(indiaMarker);

  const sec3Locations = [
    { name: "Arizona", lat: 34.0489, lon: -111.0937 },
    { name: "Florida", lat: 27.6648, lon: -81.5158 },
    { name: "Argentina", lat: -38.4161, lon: -63.6167 },
    { name: "UK", lat: 55.3781, lon: -3.436 },
    { name: "Australia", lat: -25.2744, lon: 133.7751 },
    { name: "Yugoslavia", lat: 44.0165, lon: 21.0059 },
  ];
  const sec3MarkersGroup = new THREE.Group();
  sec3MarkersGroup.scale.set(0, 0, 0);
  globeGroup.add(sec3MarkersGroup);
  const sec3Labels = [];
  const sec3Markers = [];
  sec3Locations.forEach((loc) => {
    const marker = createSurfaceMarker(PRIMARY);
    placeMarkerOnSurface(marker, loc.lat, loc.lon);
    const label = createCityAnnotation(loc.name);
    label.position.set(0, 0.1, 0);
    marker.add(label);
    sec3Labels.push(label);
    sec3Markers.push(marker);
    sec3MarkersGroup.add(marker);
  });

  // ── Office directory (data from TK4R4-globe_data.js) ──────────────
  function createPinLabel(text) {
    const anchor = document.createElement("div");
    anchor.className = "TK4R4-pin-anchor";
    const pill = document.createElement("div");
    pill.className = "TK4R4-pin-label";
    pill.innerHTML = '<span class="TK4R4-pin-dot"></span><span>' + text + "</span>";
    anchor.appendChild(pill);
    const obj = new THREE.CSS2DObject(anchor);
    obj.userData.pill = pill;
    return obj;
  }

  const CITY_DOT_COLOR = PRIMARY;

  const COUNTRY_REGION = {
    India: "asia", Japan: "asia",
    USA: "north-america", Canada: "north-america", Mexico: "north-america",
    Argentina: "south-america", Brazil: "south-america", Chile: "south-america",
    Colombia: "south-america", Ecuador: "south-america", Peru: "south-america",
    Uruguay: "south-america",
    Australia: "oceania", "New Zealand": "oceania",
    Ireland: "europe", Austria: "europe", Belgium: "europe", Denmark: "europe",
    Finland: "europe", France: "europe", Germany: "europe", Hungary: "europe",
    Italy: "europe", Luxembourg: "europe", Netherlands: "europe", Norway: "europe",
    Poland: "europe", Portugal: "europe", Spain: "europe", Sweden: "europe",
    Switzerland: "europe",
  };

  const directoryLocations = [];
  const locById = new Map();
  const perCountry = [];
  let totalOffices = 0;

  TK4R4_officeCountries.forEach((country, ci) => {
    const displayName = country.name.replace(/\s*\(Offices\)\s*/, "").trim();
    const region = COUNTRY_REGION[displayName] || "other";
    const byCity = new Map();
    country.offices.forEach((o) => {
      if (!byCity.has(o.city)) byCity.set(o.city, []);
      byCity.get(o.city).push(o);
      totalOffices++;
    });
    const cities = [];
    byCity.forEach((offices, city) => {
      const coord = TK4R4_CITY_COORDS[country.name + "||" + city] || [country.lat, country.lon];
      const id = "TK4R4-loc-" + ci + "-" + city.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const loc = { id, city, country: displayName, region, lat: coord[0], lon: coord[1], offices, verified: country.verified };
      directoryLocations.push(loc);
      locById.set(id, loc);
      cities.push(loc);
    });
    perCountry.push({ displayName, region, verified: country.verified, cities, officeCount: country.offices.length });
  });

  const cityDotsGroup = new THREE.Group();
  globeGroup.add(cityDotsGroup);
  const pickables = [];
  directoryLocations.forEach((loc) => {
    const dot = createSurfaceMarker(CITY_DOT_COLOR, 0.032);
    placeMarkerOnSurface(dot, loc.lat, loc.lon);
    const label = createPinLabel(loc.city + ", " + loc.country);
    dot.add(label);
    cityDotsGroup.add(dot);
    loc.dot = dot;
    loc.core = dot.userData.core;
    loc.halo = dot.userData.halo;
    loc.baseColor = dot.userData.baseColor;
    loc.pill = label.userData.pill;
    dot.userData.hit.userData.locId = loc.id;
    pickables.push(dot.userData.hit);
  });

  const nyDirectoryDot = directoryLocations.find((l) => l.country === "USA" && l.city === "New York, NY");
  const mumbaiDirectoryDot = directoryLocations.find((l) => l.country === "India" && l.city === "Mumbai");
  if (nyDirectoryDot) nyDirectoryDot.dot.visible = false;

  const sidebarListEl = document.getElementById("TK4R4-sidebar-list");
  const sidebarSubEl = document.getElementById("TK4R4-sidebar-sub");
  const sidebarSearchEl = document.getElementById("TK4R4-sidebar-search");

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  }

  sidebarSubEl.textContent = perCountry.length + " countries · " + totalOffices + " offices";

  (function renderDirectory() {
    let html = "";
    perCountry.forEach((group) => {
      html += '<div class="TK4R4-dir-group" data-region="' + group.region + '">';
      html += '<div class="TK4R4-dir-country"><span>' + escapeHtml(group.displayName) + "</span>"
        + '<span class="TK4R4-dir-count">' + group.officeCount + " office" + (group.officeCount > 1 ? "s" : "") + "</span></div>";
      group.cities.forEach((loc) => {
        const meta = loc.offices.length > 1 ? loc.offices.length + " offices" : "";
        const search = (loc.city + " " + loc.country + " " + loc.offices.map((o) => o.office + " " + o.address).join(" ")).toLowerCase();
        html += '<div class="TK4R4-dir-city" data-loc-id="' + loc.id + '" data-region="' + loc.region + '" data-search="' + escapeHtml(search) + '">';
        html += '<span class="TK4R4-dir-city-country">' + escapeHtml(loc.country) + "</span>";
        html += '<div class="TK4R4-dir-city-head"><span class="TK4R4-dir-city-name">' + escapeHtml(loc.city) + "</span>"
          + (meta ? '<span class="TK4R4-dir-city-meta">' + meta + "</span>" : "") + "</div>";
        html += '<div class="TK4R4-dir-offices">';
        loc.offices.forEach((o) => {
          html += '<div class="TK4R4-dir-office"><span class="TK4R4-dir-office-name">' + escapeHtml(o.office) + "</span>"
            + '<span class="TK4R4-dir-office-addr">' + escapeHtml(o.address) + "</span></div>";
        });
        html += "</div></div>";
      });
      html += "</div>";
    });
    sidebarListEl.innerHTML = html;
    directoryLocations.forEach((loc) => {
      loc.row = sidebarListEl.querySelector('[data-loc-id="' + loc.id + '"]');
    });
  })();

  const ACTIVE_COLOR = new THREE.Color(SIGNAL);
  let hoverId = null;
  let activeId = null;
  let explorationActive = false;

  function applyState(loc) {
    if (!loc) return;
    const isActive = loc.id === activeId;
    const isHover = loc.id === hoverId;
    const emphasize = isActive || isHover;
    const scale = isActive ? 2.0 : isHover ? 1.6 : 1;
    gsap.to(loc.dot.scale, { x: scale, y: scale, z: scale, duration: 0.25, ease: "power3.out", overwrite: true });
    gsap.to(loc.halo.material, { opacity: isActive ? 0.32 : isHover ? 0.2 : 0, duration: 0.25, overwrite: true });
    loc.core.material.color.copy(isActive ? ACTIVE_COLOR : loc.baseColor);
    if (loc.pill) {
      loc.pill.classList.toggle("TK4R4-show", emphasize);
      loc.pill.classList.toggle("TK4R4-active", isActive);
    }
    if (loc.row) {
      loc.row.classList.toggle("TK4R4-is-hover", isHover && !isActive);
      loc.row.classList.toggle("TK4R4-is-active", isActive);
    }
  }

  function setHover(id) {
    if (id === hoverId) return;
    const prev = hoverId;
    hoverId = id;
    applyState(locById.get(prev));
    applyState(locById.get(id));
  }

  // Where a selected row's top edge lands, in px from the top of the list's
  // scrollport. It is one fixed value for every row — the list's top padding
  // (the sticky country header pins below it) plus the TALLEST country header
  // — so the highlighted city always settles in exactly the same spot.
  function rowLandingY() {
    const padTop = parseFloat(getComputedStyle(sidebarListEl).paddingTop) || 0;
    let headerH = 0;
    sidebarListEl.querySelectorAll(".TK4R4-dir-country").forEach((h) => {
      headerH = Math.max(headerH, h.offsetHeight);
    });
    return padTop + headerH + 4;
  }

  function rowOffsetInList(row) {
    const listTop = sidebarListEl.getBoundingClientRect().top + sidebarListEl.clientTop;
    return row.getBoundingClientRect().top - listTop;
  }

  // Scrolls the sidebar list so `row` lands at rowLandingY(). `collapsingRow`
  // is the previously active row: its office list is animating shut, so if it
  // sits above `row` the layout will shift up by that height — subtract it now
  // so we aim at the final spot. Once the 0.4s expand/collapse has finished we
  // re-measure and nudge, so any leftover drift is corrected too.
  let scrollFixTimer = null;
  // Phones: the list is a horizontal strip of cards (CSS), so slide the
  // selected card to the left edge of the strip instead.
  function scrollCardIntoView(row) {
    const padLeft = parseFloat(getComputedStyle(sidebarListEl).paddingLeft) || 0;
    const listLeft = sidebarListEl.getBoundingClientRect().left + sidebarListEl.clientLeft;
    const target = sidebarListEl.scrollLeft + (row.getBoundingClientRect().left - listLeft) - padLeft;
    sidebarListEl.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
  }

  function scrollRowToTop(row, collapsingRow) {
    clearTimeout(scrollFixTimer);
    if (!row.offsetParent) return; // hidden by the search / region filter
    if (IS_MOBILE) return scrollCardIntoView(row);
    const landY = rowLandingY();
    // Enough trailing room that even the last rows in the list can reach the top.
    sidebarListEl.style.paddingBottom = Math.max(40, sidebarListEl.clientHeight - landY) + "px";
    let shift = 0;
    let collapsingOffices = null;
    if (collapsingRow && collapsingRow !== row && collapsingRow.offsetParent &&
        (collapsingRow.compareDocumentPosition(row) & Node.DOCUMENT_POSITION_FOLLOWING)) {
      collapsingOffices = collapsingRow.querySelector(".TK4R4-dir-offices");
      shift = collapsingOffices.offsetHeight;
    }
    // scrollTop + offset is the row's absolute position in the list, so it is
    // valid even while a smooth scroll is mid-flight. (Never correct with a
    // relative scrollBy: Chrome adds it to the in-flight scroll's target.)
    const absTarget = () => Math.max(0, sidebarListEl.scrollTop + rowOffsetInList(row) - landY);
    const target = Math.max(0, absTarget() - shift);
    sidebarListEl.scrollTo({ top: target, behavior: "smooth" });
    // Re-aim only once the row above has actually finished collapsing —
    // measuring earlier would see a half-collapsed layout and "correct" to the
    // wrong spot (transitions can lag well behind timers on a busy page).
    let tries = 0;
    const settle = () => {
      if (collapsingOffices && collapsingOffices.offsetHeight > 0 && ++tries < 20) {
        scrollFixTimer = setTimeout(settle, 150);
        return;
      }
      const settled = absTarget();
      if (Math.abs(settled - target) > 1) sidebarListEl.scrollTo({ top: settled, behavior: "smooth" });
    };
    scrollFixTimer = setTimeout(settle, 450);
  }

  function setActive(id) {
    const prev = activeId;
    activeId = id;
    const prevLoc = prev && prev !== id ? locById.get(prev) : null;
    const loc = locById.get(id);
    // Measure before toggling classes so the collapsing row's height is still intact.
    if (loc && loc.row) scrollRowToTop(loc.row, prevLoc && prevLoc.row);
    if (prevLoc) applyState(prevLoc);
    applyState(loc);
    if (loc) focusOnLocation(loc.lat, loc.lon);
  }

  function shortestDelta(current, target) {
    let delta = (target - current) % (Math.PI * 2);
    if (delta > Math.PI) delta -= Math.PI * 2;
    if (delta < -Math.PI) delta += Math.PI * 2;
    return current + delta;
  }

  function focusOnLocation(lat, lon) {
    if (!controls.enabled) return;
    const camForward = camera.getWorldDirection(new THREE.Vector3());
    const rot = computeGlobeRotation(lat, lon, globeGroup.position, worldGlobeRadius, camera.position, camForward);
    gsap.to(globeGroup.rotation, {
      x: shortestDelta(globeGroup.rotation.x, rot.x),
      y: shortestDelta(globeGroup.rotation.y, rot.y),
      z: shortestDelta(globeGroup.rotation.z, rot.z),
      duration: 1.3,
      ease: "power3.inOut",
    });
  }

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  function pickAt(clientX, clientY) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(pickables, false);
    for (let k = 0; k < hits.length; k++) {
      const wp = hits[k].object.getWorldPosition(new THREE.Vector3());
      const normal = wp.clone().sub(globeGroup.position).normalize();
      const view = camera.position.clone().sub(wp).normalize();
      if (normal.dot(view) > 0.02) return hits[k].object.userData.locId;
    }
    return null;
  }

  // Touch: only the globe itself is draggable. OrbitControls (r128) calls
  // preventDefault on every touchstart/touchmove on the canvas while enabled,
  // which blocked page scrolling across the whole screen on phones. This
  // capture-phase listener on the container runs first: a gesture that starts
  // off the globe never reaches the controls, so the browser scrolls instead.
  function touchIsOnGlobe(touch) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const r = worldGlobeRadius * 1.04;
    return raycaster.ray.distanceSqToPoint(globeGroup.position) <= r * r;
  }
  let touchOffGlobe = false;
  container.addEventListener("touchstart", (e) => {
    if (e.touches.length === 1) touchOffGlobe = explorationActive && !touchIsOnGlobe(e.touches[0]);
    if (touchOffGlobe) e.stopPropagation();
  }, { capture: true, passive: true });
  ["touchmove", "touchend", "touchcancel"].forEach((type) => {
    container.addEventListener(type, (e) => {
      if (touchOffGlobe) e.stopPropagation();
    }, { capture: true, passive: true });
  });

  renderer.domElement.addEventListener("pointermove", (e) => {
    if (!explorationActive) return;
    const id = pickAt(e.clientX, e.clientY);
    container.classList.toggle("TK4R4-dot-hover", !!id);
    setHover(id);
  });

  let downX = 0, downY = 0, downT = 0;
  renderer.domElement.addEventListener("pointerdown", (e) => {
    downX = e.clientX;
    downY = e.clientY;
    downT = Date.now();
  });
  renderer.domElement.addEventListener("pointerup", (e) => {
    if (!explorationActive) return;
    const moved = Math.hypot(e.clientX - downX, e.clientY - downY);
    if (moved > 6 || Date.now() - downT > 500) return;
    const id = pickAt(e.clientX, e.clientY);
    if (id) setActive(id);
  });

  sidebarListEl.addEventListener("click", (e) => {
    const row = e.target.closest(".TK4R4-dir-city");
    if (!row || !explorationActive) return;
    setActive(row.dataset.locId);
  });
  sidebarListEl.addEventListener("mouseover", (e) => {
    const row = e.target.closest(".TK4R4-dir-city");
    setHover(row ? row.dataset.locId : null);
  });
  sidebarListEl.addEventListener("mouseleave", () => setHover(null));

  const sidebarFiltersEl = document.getElementById("TK4R4-sidebar-filters");
  let activeRegion = "all";

  function applySidebarFilter() {
    const q = sidebarSearchEl.value.trim().toLowerCase();
    sidebarListEl.querySelectorAll(".TK4R4-dir-group").forEach((group) => {
      const regionMatch = activeRegion === "all" || group.dataset.region === activeRegion;
      let anyVisible = false;
      group.querySelectorAll(".TK4R4-dir-city").forEach((row) => {
        const match = regionMatch && (!q || row.dataset.search.indexOf(q) >= 0);
        row.classList.toggle("TK4R4-hidden", !match);
        if (match) anyVisible = true;
      });
      group.classList.toggle("TK4R4-hidden", !anyVisible);
    });
  }

  sidebarSearchEl.addEventListener("input", applySidebarFilter);
  sidebarFiltersEl.addEventListener("click", (e) => {
    const chip = e.target.closest(".TK4R4-filter-chip");
    if (!chip) return;
    activeRegion = chip.dataset.region;
    sidebarFiltersEl.querySelectorAll(".TK4R4-filter-chip").forEach((c) => {
      c.classList.toggle("TK4R4-active", c === chip);
    });
    applySidebarFilter();
  });

  const storyLabels = [nyLabel, indiaLabel, ...sec3Labels];
  const exitingMarkers = [
    { group: nyMarker, companionDot: nyDirectoryDot && nyDirectoryDot.dot },
    { group: indiaMarker, companionDot: mumbaiDirectoryDot && mumbaiDirectoryDot.dot },
    { group: sec3MarkersGroup, companionDot: null },
  ];

  function enterExploration() {
    explorationActive = true;
    controls.enabled = true;
    document.body.classList.add("TK4R4-stage-final");
    if (IS_MOBILE) {
      // The canvas now stops above the card strip (CSS), so move the camera
      // back in until the globe fills what's left.
      const aspect = container.clientWidth / Math.max(1, container.clientHeight);
      gsap.to(camera.position, { z: fitCameraZ(aspect, 0.88, 0.8), duration: 0.8, ease: "power2.out", overwrite: true });
    }
    storyLabels.forEach((l) => (l.visible = false));
    exitingMarkers.forEach(({ group, companionDot }) => {
      gsap.killTweensOf(group.scale);
      gsap.to(group.scale, {
        x: 0.001, y: 0.001, z: 0.001, duration: 0.4, ease: "power2.in",
        onComplete: () => {
          group.visible = false;
          if (companionDot) companionDot.visible = true;
        },
      });
    });
  }

  function exitExploration() {
    explorationActive = false;
    controls.enabled = false;
    gsap.killTweensOf(camera.position);
    controls.reset();
    document.body.classList.remove("TK4R4-stage-final");
    container.classList.remove("TK4R4-dot-hover");
    setHover(null);
    setActive(null);
    exitingMarkers.forEach(({ group, companionDot }) => {
      gsap.killTweensOf(group.scale);
      group.visible = true;
      if (companionDot) companionDot.visible = false;
      gsap.fromTo(group.scale, { x: 0.001, y: 0.001, z: 0.001 }, { x: 1, y: 1, z: 1, duration: 0.4, ease: "power2.out" });
    });
    storyLabels.forEach((l) => (l.visible = true));
  }

  const allLabels = [nyLabel, indiaLabel, ...sec3Labels];
  const finalPanel = document.getElementById("TK4R4-box-3");
  function updateLabelOcclusion() {
    if (!controls.enabled) return;
    if (parseFloat(getComputedStyle(finalPanel).opacity) < 0.05) {
      allLabels.forEach((label) => label.element.classList.remove("TK4R4-behind-panel"));
      return;
    }
    const panelRect = finalPanel.getBoundingClientRect();
    if (panelRect.width === 0 || panelRect.height === 0) return;
    allLabels.forEach((label) => {
      if (!label.element.classList.contains("TK4R4-visible")) return;
      const r = label.element.getBoundingClientRect();
      const behind = !(r.right < panelRect.left || r.left > panelRect.right || r.bottom < panelRect.top || r.top > panelRect.bottom);
      label.element.classList.toggle("TK4R4-behind-panel", behind);
    });
  }

  // Desktop: globe beside the text (right for New York, left for Bombay).
  // Phone: globe centred near the top, text below it.
  const usaGroupPos = IS_MOBILE ? { x: 0, y: yAtScreenFrac(0.28), z: 0 } : { x: 1.4, y: 0, z: 0 };
  const indiaGroupPos = IS_MOBILE ? { x: 0, y: yAtScreenFrac(0.28), z: 0 } : { x: -1.4, y: 0, z: 0 };
  // Frame 3 lifts the globe higher so "A Global Footprint" body text sits
  // below it; once that text fades the globe settles back to the explore height.
  const centerGroupPos = IS_MOBILE ? { x: 0, y: yAtScreenFrac(0.24), z: 0 } : { x: 0, y: 0.55, z: 0 };
  // Phone explore view: the globe fills the canvas above the city list.
  const EXPLORE_GLOBE_Y = IS_MOBILE ? 0 : 0.35;
  globeGroup.position.set(usaGroupPos.x, usaGroupPos.y, usaGroupPos.z);
  const initialCameraPos = camera.position.clone();
  const initialCameraForward = new THREE.Vector3(0, 0, -1);
  const worldGlobeRadius = globeRadius * globeScale;

  function forwardToward(groupPos) {
    return new THREE.Vector3(groupPos.x, groupPos.y, groupPos.z).sub(initialCameraPos).normalize();
  }

  const targetRotations = {
    usa: computeGlobeRotation(40.7128, -74.006, usaGroupPos, worldGlobeRadius, initialCameraPos, forwardToward(usaGroupPos)),
    india: computeGlobeRotation(19.076, 72.8777, indiaGroupPos, worldGlobeRadius, initialCameraPos, forwardToward(indiaGroupPos)),
    // On phones the raised globe is off the camera's straight-ahead ray, so aim at it directly.
    center: computeGlobeRotation(10, -45, centerGroupPos, worldGlobeRadius, initialCameraPos, IS_MOBILE ? forwardToward(centerGroupPos) : initialCameraForward),
    // Slow drifts while frames 1 and 2 hold: the globe keeps turning a few
    // degrees toward its next stop instead of sitting still.
    usaDrift: computeGlobeRotation(40.7128, -74.006 + 7, usaGroupPos, worldGlobeRadius, initialCameraPos, forwardToward(usaGroupPos)),
    indiaDrift: computeGlobeRotation(19.076, 72.8777 - 7, indiaGroupPos, worldGlobeRadius, initialCameraPos, forwardToward(indiaGroupPos)),
  };
  const FRAME1_HOLD = 2.6; // timeline units frame 1 stays up (was 1.2)
  const FRAME2_HOLD = 3.4; // timeline units frame 2 stays up after fading in (was 2.2)

  globeGroup.rotation.x = targetRotations.usa.x;
  globeGroup.rotation.y = targetRotations.usa.y;
  globeGroup.rotation.z = targetRotations.usa.z;

  nyLabel.element.classList.add("TK4R4-visible");

  function animateContentIn(boxSelector) {
    const box = document.querySelector(boxSelector);
    if (!box) return;
    const eyebrow = box.querySelector(".TK4R4-eyebrow");
    const words = box.querySelectorAll(".TK4R4-word");
    const para = box.querySelector("p");
    const hint = box.querySelector(".TK4R4-drag-hint");

    gsap.killTweensOf([eyebrow, ...words, para, hint].filter(Boolean));
    const inner = gsap.timeline();
    if (eyebrow) inner.fromTo(eyebrow, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
    if (words.length) inner.fromTo(words, { opacity: 0, y: "70%" }, { opacity: 1, y: "0%", duration: 0.7, ease: "power3.out", stagger: 0.045 }, "<0.1");
    if (para) inner.fromTo(para, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.35");
    if (hint) inner.fromTo(hint, { opacity: 0, y: 10, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(2)" }, "-=0.2");
  }

  // ── 4. GSAP TIMELINE ───────────────────────────────────────────────
  gsap.registerPlugin(ScrollTrigger);

  gsap.set("#TK4R4-box-1", { opacity: 1, y: 0 });
  animateContentIn("#TK4R4-box-1");

  // Exploration mode (fixed office sidebar) is only allowed inside this
  // window of the pinned section's scroll progress. The start is derived
  // from the "box3Gone" label below once the timeline is built; the end
  // stops short of 1 so the sidebar has already faded out before the pin
  // releases and the next module scrolls up underneath it.
  let exploreStart = 0.86;
  const EXPLORE_END = 0.975;

  // Single source of truth for sidebar open/closed. Called from every
  // ScrollTrigger callback AND every animation frame, so it can't get stuck
  // open when a callback is skipped (fast flings, scrollbar drags, a reload
  // that lands past the section, or a refresh that re-measures the pin).
  let tl = null;
  function syncExploration(self) {
    const st = self || (tl && tl.scrollTrigger);
    const p = st ? st.progress : 0;
    const final = !!st && st.isActive && p > exploreStart && p < EXPLORE_END;
    if (final && !explorationActive) enterExploration();
    else if (!final && explorationActive) exitExploration();
  }

  tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".TK4R4-pin-wrapper",
      start: "top top",
      // Stretched from 440% alongside the longer frame holds below, so the
      // scroll distance per unit of timeline stays the same as before.
      end: "+=685%",
      scrub: 1.5,
      pin: true,
      onUpdate: syncExploration,
      onLeave: syncExploration,
      onLeaveBack: syncExploration,
      onRefresh: syncExploration,
    },
  });

  // Hold frame 1 ("The 24/7 Advantage") on screen while the globe drifts slowly.
  tl.to(globeGroup.rotation, { x: targetRotations.usaDrift.x, y: targetRotations.usaDrift.y, z: targetRotations.usaDrift.z, duration: FRAME1_HOLD, ease: "none" })
    .to("#TK4R4-box-1", { opacity: 0, y: -20, duration: 1 })
    .to(nyLabel.element, { opacity: 0, duration: 0.5 }, "<")
    .to(globeGroup.rotation, { x: targetRotations.india.x, y: targetRotations.india.y, z: targetRotations.india.z, duration: 2.5, ease: "sine.inOut" }, "<")
    .to(globeGroup.position, { x: indiaGroupPos.x, y: indiaGroupPos.y, duration: 2.5, ease: "sine.inOut" }, "<")
    .to(dotUniforms.uColor.value, { r: DOT_DAY.r, g: DOT_DAY.g, b: DOT_DAY.b, duration: 2.5, ease: "sine.inOut" }, "<")
    .to(root, { "--TK4R4-mood-1": MOOD_SUNRISE[0], "--TK4R4-mood-2": MOOD_SUNRISE[1], "--TK4R4-mood-3": MOOD_SUNRISE[2], duration: 2.5, ease: "sine.inOut" }, "<")
    .to(ambientLight, { intensity: 1.05, duration: 2.5, ease: "sine.inOut" }, "<")
    .to(ambientLight.color, { r: 1, g: 0.93, b: 0.83, duration: 2.5, ease: "sine.inOut" }, "<")
    .to(dirLight, { intensity: 1.2, duration: 2.5, ease: "sine.inOut" }, "<")
    .to(dirLight.color, { r: 1, g: 0.8, b: 0.52, duration: 2.5, ease: "sine.inOut" }, "<")
    .to(atmosMat.color, { r: ATMOS_SUNRISE.r, g: ATMOS_SUNRISE.g, b: ATMOS_SUNRISE.b, duration: 2.5, ease: "sine.inOut" }, "<")
    .to(atmosMat, { opacity: 0.09, duration: 2.5, ease: "sine.inOut" }, "<")
    .to(indiaMarker.scale, { x: 1, y: 1, z: 1, duration: 1, ease: "back.out(2)" })
    .call(() => indiaLabel.element.classList.add("TK4R4-visible"))
    .to("#TK4R4-box-2", { opacity: 1, y: 0, duration: 1 }, "<0.3")
    .call(() => animateContentIn("#TK4R4-box-2"), null, "<")
    // Hold frame 2 ("Follow the Sun") while the globe drifts slowly; starts as box-2 fades in.
    .to(globeGroup.rotation, { x: targetRotations.indiaDrift.x, y: targetRotations.indiaDrift.y, z: targetRotations.indiaDrift.z, duration: 1 + FRAME2_HOLD, ease: "none" }, "<")
    .to("#TK4R4-box-2", { opacity: 0, y: -20, duration: 1 })
    .call(() => indiaLabel.element.classList.remove("TK4R4-visible"))
    .to(globeGroup.rotation, { x: targetRotations.center.x, y: targetRotations.center.y, z: targetRotations.center.z, duration: 3, ease: "sine.inOut" }, "<")
    .to(globeGroup.position, { x: centerGroupPos.x, y: centerGroupPos.y, duration: 3, ease: "sine.inOut" }, "<")
    .to(root, { "--TK4R4-mood-1": MOOD_GLOBAL[0], "--TK4R4-mood-2": MOOD_GLOBAL[1], "--TK4R4-mood-3": MOOD_GLOBAL[2], duration: 3, ease: "sine.inOut" }, "<")
    .to(ambientLight, { intensity: 1.35, duration: 3, ease: "sine.inOut" }, "<")
    .to(ambientLight.color, { r: 1, g: 1, b: 1, duration: 3, ease: "sine.inOut" }, "<")
    .to(dirLight, { intensity: 1.0, duration: 3, ease: "sine.inOut" }, "<")
    .to(dirLight.color, { r: 1, g: 1, b: 1, duration: 3, ease: "sine.inOut" }, "<")
    .to(atmosMat.color, { r: ATMOS_GLOBAL.r, g: ATMOS_GLOBAL.g, b: ATMOS_GLOBAL.b, duration: 3, ease: "sine.inOut" }, "<")
    .to(atmosMat, { opacity: 0.08, duration: 3, ease: "sine.inOut" }, "<")
    .to(dotUniforms.uColor.value, { r: DOT_GLOBAL.r, g: DOT_GLOBAL.g, b: DOT_GLOBAL.b, duration: 3, ease: "sine.inOut" }, "<")
    .to(sec3MarkersGroup.scale, { x: 1, y: 1, z: 1, duration: 1.2, ease: "back.out(1.7)" }, "-=1")
    .call(() => {
      indiaLabel.element.classList.add("TK4R4-visible");
      sec3Labels.forEach((l) => l.element.classList.add("TK4R4-visible"));
    })
    .to("#TK4R4-box-3", { opacity: 1, y: 0, duration: 1.2 }, "<0.2")
    .call(() => animateContentIn("#TK4R4-box-3"), null, "<")
    .to("#TK4R4-box-3", { opacity: 0, y: -16, duration: 1, ease: "power1.in", pointerEvents: "none" }, "+=1.2") // frame 3 hold (was 0.6)
    .to(globeGroup.position, { y: EXPLORE_GLOBE_Y, duration: 1.6, ease: "sine.inOut" }, "<")
    .addLabel("box3Gone")
    // Padding-only tail: nothing animates here, it just stretches the
    // timeline's total duration so box-3's fade-out above lands at an
    // earlier fraction of scroll progress, leaving real room for
    // exploration mode afterward with box-3 fully gone.
    .to({}, { duration: 4 });

  // Open the sidebar a short margin (0.8 timeline units) after box-3 has fully
  // faded, so it never overlaps any of box-3 — recomputed from the label so
  // it stays correct if the frame holds above are retuned.
  exploreStart = (tl.labels.box3Gone + 0.8) / tl.duration();

  // ── 5. Resize + render loop ────────────────────────────────────────
  let lastRenderW = 0, lastRenderH = 0;
  function syncRendererSize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w === 0 || h === 0) return;
    if (w === lastRenderW && h === lastRenderH) return;
    lastRenderW = w;
    lastRenderH = h;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    labelRenderer.setSize(w, h);
  }
  new ResizeObserver(syncRendererSize).observe(container);

  function animate() {
    requestAnimationFrame(animate);
    syncRendererSize();
    if (mumbaiDirectoryDot && !explorationActive) {
      mumbaiDirectoryDot.dot.visible = indiaMarker.scale.x < 0.5;
    }
    syncExploration();
    if (controls.enabled) {
      controls.target.copy(globeGroup.position);
      controls.update();
    }
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
    updateLabelOcclusion();
  }
  animate();
});
