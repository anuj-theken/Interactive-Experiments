// scripts/TK4R5-y2k.js — TK4R5: the Y2K bug (3D device scrollytelling)

document.addEventListener("DOMContentLoaded", function () {
  // 1. Colors/fonts — restored verbatim from the original y2k.html prototype
  // (a deliberate, user-requested exception to reading these from the site's
  // design tokens: this module keeps its own archive-terminal palette).
  const BG = "#e8e6df";

  // 2. DOM references — always use the module prefix
  const section = document.querySelector(".TK4R5-y2k-section");
  if (!section) return;

  const container = document.getElementById("TK4R5-webgl");
  const scrollWrapper = section.querySelector(".TK4R5-scroll-wrapper");
  const subheaderEl = document.getElementById("TK4R5-subheader");
  const sideTextEl = document.getElementById("TK4R5-side-text");
  const heroTextEl = document.getElementById("TK4R5-hero-text");
  const sideTextHome = { parent: sideTextEl.parentNode, next: sideTextEl.nextSibling };
  const mobileQuery = window.matchMedia("(max-width: 768px)");
  const fixToolEls = section.querySelectorAll(".TK4R5-fix-tool");

  // 3. THREE.JS SCENE SETUP
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(BG);

  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(0, 0, 14);

  // Desktop frames the whole five-device composition. On mobile only the
  // centre PC fits, so the camera moves in and centres on it, below the text.
  function applyLayout() {
    if (mobileQuery.matches) {
      camera.position.set(0.12, -1.1, 10.5);
      heroTextEl.appendChild(sideTextEl);
    } else {
      camera.position.set(0, 0, 14);
      sideTextHome.parent.insertBefore(sideTextEl, sideTextHome.next);
    }
  }
  applyLayout();

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  container.appendChild(renderer.domElement);

  // Even, shadowless lighting so every object reads at the same brightness
  // regardless of which way it's rotated — a dominant ambient/hemisphere
  // fill instead of one hard directional key light. A flat fake shadow is
  // drawn under each device instead (see loadDevice).
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambientLight);

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xe8e6df, 0.6);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.35);
  dirLight.position.set(5, 10, 12);
  scene.add(dirLight);

  // 4. CANVAS TEXTURES FOR DISPLAY SCREENS
  const devices = [];

  function createScreenTexture(initialText, dateFontSize = 48) {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");

    const texture = new THREE.CanvasTexture(canvas);

    function update(text, bugged = false) {
      // Background
      ctx.fillStyle = bugged ? "#2a0808" : "#141a15";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid lines
      ctx.strokeStyle = bugged ? "rgba(255, 50, 50, 0.2)" : "rgba(100, 255, 150, 0.15)";
      ctx.lineWidth = 2;
      for (let i = 0; i < canvas.height; i += 16) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Archival header text
      ctx.fillStyle = bugged ? "#ff4d4d" : "#00ff66";
      ctx.font = '700 22px "Helvetica Neue", sans-serif';
      ctx.textAlign = "center";
      ctx.fillText("SYS.DATE.LOG", canvas.width / 2, 50);

      // Date display — dateFontSize is per-device so a physically small
      // screen (like the phone's) can use a larger font to stay legible,
      // since the same texture is stretched to fit whatever screen size
      // that device has.
      ctx.font = `700 ${dateFontSize}px "Courier New", monospace`;
      ctx.fillText(text, canvas.width / 2, 140);

      texture.needsUpdate = true;
    }

    update(initialText);
    return { texture, update };
  }

  // 5. RETRO DEVICE GENERATORS (GLB MODELS)
  const interactiveMeshes = [];
  const gltfLoader = new THREE.GLTFLoader();

  // Shared soft-edged rectangle texture for the flat fake shadow drawn under
  // every device — a blurred filled rect rather than a radial-gradient
  // circle, so scaling it to each device's own footprint still reads as a
  // shadow shaped like that device, not a generic round blob.
  const shadowTexture = (function () {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    ctx.filter = "blur(22px)";
    ctx.fillStyle = "rgba(0,0,0,0.38)";
    const pad = 46;
    ctx.fillRect(pad, pad, canvas.width - pad * 2, canvas.height - pad * 2);
    return new THREE.CanvasTexture(canvas);
  })();
  const shadowGeo = new THREE.PlaneGeometry(1, 1);

  // Models are embedded as base64 in 3dModels/modelData.js and loaded via
  // GLTFLoader.parse() rather than GLTFLoader.load(url) — .load() fetches
  // the .glb over the network, which browsers block for local files opened
  // via file://. Decoding embedded base64 needs no fetch at all.
  function base64ToArrayBuffer(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  // Loads a .glb (by its base name, embedded in window.Y2K_MODEL_DATA),
  // normalizes its scale/position to a consistent target size, and overlays
  // the date readout directly onto that model's own screen area.
  function loadDevice(url, x, y, z, willBug, opts = {}) {
    const targetSize = opts.targetSize || 1.9;
    const rotationY = (opts.rotationY || 0) * Math.PI / 180;
    const rotationX = (opts.rotationX || 0) * Math.PI / 180;
    const liftAxis = opts.liftAxis || "y";

    // screenOffset/screenSize were measured against a model scaled to
    // refSize (its targetSize at measurement time). Everything about the
    // model scales linearly with targetSize, so rescale those measured
    // numbers by the same ratio instead of re-measuring per size change.
    const refSize = opts.refSize || targetSize;
    const sizeRatio = targetSize / refSize;
    const rawOffset = opts.screenOffset || { x: 0, y: 0, z: 0.3 };
    const rawSize = opts.screenSize || { w: 1, h: 0.6 };
    const screenOffset = { x: rawOffset.x * sizeRatio, y: rawOffset.y * sizeRatio, z: rawOffset.z * sizeRatio };
    const screenSize = { w: rawSize.w * sizeRatio, h: rawSize.h * sizeRatio };

    const group = new THREE.Group();
    group.position.set(x, y, z);
    scene.add(group);

    // Rotation pivot — `group`'s origin is the model's BASE, so rotating
    // `group` directly would swing each device around its feet instead of
    // spinning in place. `pivot` is recentered to the model's true vertical
    // middle once its height is known (see `lift` below).
    const pivot = new THREE.Group();
    group.add(pivot);

    const screenTex = createScreenTexture(opts.initialDate || "15.08.1998", opts.dateFontSize || 48);

    const deviceObj = { group, pivot, screenTex, willBug };
    devices.push(deviceObj);

    // Flat fake shadow — sits directly behind the model (same footprint,
    // pushed back in z), a sibling of `group` so it stays flat and at the
    // same relative depth as every other device's shadow.
    const centerY = y + targetSize / 2;
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.position.set(x, centerY, z - 0.4);
    shadowMesh.scale.set(0.001, 0.001, 1); // pop-in start, synced with model

    scene.add(shadowMesh);

    // Screen overlay — fitted to this model's actual screen rect, positioned
    // once the model loads and its real scale is known.
    const screenGeo = new THREE.PlaneGeometry(screenSize.w, screenSize.h);
    const screenMat = new THREE.MeshBasicMaterial({ map: screenTex.texture });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.scale.setScalar(0.001); // pop-in start, synced with model
    screenMesh.userData.deviceRef = deviceObj;
    pivot.add(screenMesh);
    interactiveMeshes.push(screenMesh);

    const modelHolder = new THREE.Group();
    pivot.add(modelHolder);

    function onGltfReady(gltf) {
      const model = gltf.scene;

      // Center the model on its own bounding box, then scale by its
      // LONGEST axis (not just height) to a common target — source models
      // come from different authors at wildly different unit scales, and
      // several are modeled lying flat.
      const box = new THREE.Box3().setFromObject(model);
      const size = new THREE.Vector3();
      box.getSize(size);
      const center = new THREE.Vector3();
      box.getCenter(center);
      model.position.sub(center);

      const maxDim = Math.max(size.x, size.y, size.z) || 1;
      const scaleFactor = targetSize / maxDim;
      const lift = (size[liftAxis] * scaleFactor) / 2;

      pivot.position.y = lift;
      shadowMesh.position.y = y + lift;

      const otherAxes = ["x", "y", "z"].filter(a => a !== liftAxis);
      const shadowHeight = size[liftAxis] * scaleFactor;
      const shadowWidth = Math.max(size[otherAxes[0]], size[otherAxes[1]]) * scaleFactor;

      modelHolder.scale.setScalar(0.001); // pop-in start
      modelHolder.rotation.order = "YXZ";
      modelHolder.rotation.y = rotationY;
      modelHolder.rotation.x = rotationX;
      modelHolder.add(model);

      screenMesh.position.set(screenOffset.x, screenOffset.y, screenOffset.z);

      model.traverse((child) => {
        if (child.isMesh) {
          child.userData.deviceRef = deviceObj;
          interactiveMeshes.push(child);
        }
      });

      gsap.to(modelHolder.scale, { x: scaleFactor, y: scaleFactor, z: scaleFactor, duration: 0.9, ease: "back.out(1.6)" });
      gsap.to(screenMesh.scale, { x: 1, y: 1, z: 1, duration: 0.9, ease: "back.out(1.6)" });
      gsap.to(shadowMesh.scale, { x: shadowWidth * 1.2, y: shadowHeight * 1.2, duration: 0.9, ease: "back.out(1.6)" });
    }

    function onGltfError(err) {
      console.error("TK4R5: failed to load model", url, err);
    }

    const key = url.split("/").pop().replace(/\.glb$/, "");
    const base64 = window.Y2K_MODEL_DATA && window.Y2K_MODEL_DATA[key];
    if (!base64) {
      onGltfError(new Error("No embedded model data for key: " + key));
      return deviceObj;
    }
    gltfLoader.parse(base64ToArrayBuffer(base64), "", onGltfReady, onGltfError);

    return deviceObj;
  }

  // Placement matches the reference composition (four devices): x/y centers
  // and relative sizes were measured as fractions of the reference canvas,
  // then mapped onto this scene's world space. Positions are the model's
  // BASE (loadDevice lifts each model up by half its own height from y).
  // The CRT and the centre PC (willBug: true) are "the devices that broke".
  const crtDevice = loadDevice("3dModels/crt_computer_monitor.glb", -5.62, -2.16, 0.5, true, {
    initialDate: "15.08.1998", targetSize: 4.3, refSize: 1.9,
    screenOffset: { x: 0, y: 0.2295, z: 0.98 }, screenSize: { w: 1.36, h: 1.02 }
  });
  const pcDevice = loadDevice("3dModels/simple_computer_placeholder.glb", 0.15, -4.17, -0.8, true, {
    initialDate: "10.11.1998", targetSize: 3.6, refSize: 1.9,
    screenOffset: { x: 0.011, y: 0.362, z: 0.78 }, screenSize: { w: 1.05, h: 0.88 }
  });
  loadDevice("3dModels/retro_screen.glb", 4.47, -0.185, 0.6, false, {
    initialDate: "15.08.1998", targetSize: 3.2, refSize: 1.7, rotationY: 270,
    screenOffset: { x: -0.04, y: 0.334, z: 0.85 }, screenSize: { w: 1.12, h: 0.84 }
  });
  loadDevice("3dModels/retro_80s_phone.glb", 7.94, 0.975, -0.4, false, {
    initialDate: "22.03.1999", targetSize: 3.42, refSize: 1.7, rotationY: 90, dateFontSize: 70,
    screenOffset: { x: 0.06, y: 0.10, z: 0.16 }, screenSize: { w: 0.28, h: 0.16 }
  });

  // Repair-tool illustrations — DOM overlays pinned to a point on a model.
  // `anchor` is in that device's pivot space (the same space as its screen
  // overlay), `imgAnchor` is the matching point on the image as a fraction
  // of its size, and `worldWidth` is the image's width in world units. Each
  // frame the pin is projected to screen space, so the tool rides along with
  // the model's idle wobble and drag tilt and stays on it at any viewport
  // size. The toolbox has no device, so it's pinned in world space and gets
  // the same idle wobble as a device would.
  const toolPins = [
    { // screwdriver tip on the CRT's screen
      el: document.getElementById("TK4R5-fix-screwdriver"), device: crtDevice,
      anchor: new THREE.Vector3(0.55, 0.95, 2.24), imgAnchor: { x: 0.984, y: 0.012 }, worldWidth: 3.6
    },
    { // wrench jaws around the PC's right-hand knob
      el: document.getElementById("TK4R5-fix-wrench"), device: pcDevice,
      anchor: new THREE.Vector3(1.03, -0.43, 1.5), imgAnchor: { x: 0.09, y: 0.15 }, worldWidth: 2.4
    },
    { // toolbox, free-standing at the bottom right
      el: document.getElementById("TK4R5-fix-toolbox"), device: null, wobblePhase: 4,
      anchor: new THREE.Vector3(7.4, -2.5, 0), imgAnchor: { x: 0.5, y: 0.5 }, worldWidth: 3.8
    }
  ];

  const pinPoint = new THREE.Vector3();
  const pinEdge = new THREE.Vector3();

  function updateToolPins(time) {
    const w = container.clientWidth;
    const h = container.clientHeight;

    toolPins.forEach(pin => {
      pinPoint.copy(pin.anchor);
      pinEdge.set(pin.anchor.x + pin.worldWidth, pin.anchor.y, pin.anchor.z);

      let rotX, rotY;
      if (pin.device) {
        pin.device.pivot.localToWorld(pinPoint);
        pin.device.pivot.localToWorld(pinEdge);
        rotX = pin.device.pivot.rotation.x;
        rotY = pin.device.pivot.rotation.y;
      } else {
        rotX = Math.sin(time + pin.wobblePhase) * 0.02;
        rotY = Math.cos(time + pin.wobblePhase) * 0.02;
      }

      pinPoint.project(camera);
      pinEdge.project(camera);

      const x = (pinPoint.x + 1) / 2 * w;
      const y = (1 - pinPoint.y) / 2 * h;
      const widthPx = Math.hypot((pinEdge.x - pinPoint.x) / 2 * w, (pinEdge.y - pinPoint.y) / 2 * h);
      const ax = pin.imgAnchor.x * 100;
      const ay = pin.imgAnchor.y * 100;

      // CSS rotateX runs opposite to three.js rotation.x (y points down)
      pin.el.style.width = `${widthPx}px`;
      pin.el.style.transformOrigin = `${ax}% ${ay}%`;
      pin.el.style.transform =
        `translate(${x}px, ${y}px) translate(${-ax}%, ${-ay}%) ` +
        `perspective(800px) rotateX(${-rotX}rad) rotateY(${rotY}rad)`;
    });
  }

  // 6. INDIVIDUAL OBJECT ROTATION WITH SPRING RETURN
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const MAX_DRAG_ROTATION = 10 * Math.PI / 180; // subtle tilt only, not a free spin

  let activeRotatingDevice = null;
  let previousPointerPosition = { x: 0, y: 0 };

  container.addEventListener("pointerdown", (e) => {
    const rect = container.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(interactiveMeshes);

    if (intersects.length > 0) {
      const hitObj = intersects[0].object;
      activeRotatingDevice = hitObj.userData.deviceRef;
      previousPointerPosition = { x: e.clientX, y: e.clientY };
    }
  });

  window.addEventListener("pointermove", (e) => {
    if (!activeRotatingDevice) return;

    const deltaX = e.clientX - previousPointerPosition.x;
    const deltaY = e.clientY - previousPointerPosition.y;

    const rot = activeRotatingDevice.pivot.rotation;
    rot.y = Math.max(-MAX_DRAG_ROTATION, Math.min(MAX_DRAG_ROTATION, rot.y + deltaX * 0.008));
    rot.x = Math.max(-MAX_DRAG_ROTATION, Math.min(MAX_DRAG_ROTATION, rot.x + deltaY * 0.008));

    previousPointerPosition = { x: e.clientX, y: e.clientY };
  });

  const releaseRotation = () => {
    if (!activeRotatingDevice) return;

    gsap.to(activeRotatingDevice.pivot.rotation, { x: 0, y: 0, z: 0, duration: 0.8, ease: "back.out(1.7)" });
    activeRotatingDevice = null;
  };

  window.addEventListener("pointerup", releaseRotation);
  window.addEventListener("pointerleave", releaseRotation);

  // 7. GSAP SCROLLTRIGGER STORYLINE
  // Three text frames, driven by scroll progress (0 -> 1, scrubbed both
  // directions). Within a frame the paragraphs appear one after the other:
  // the main one under the title first, then the side one (bottom right).
  //   1. Two-digit years (main) -> the "00" rollover (side), screens glitch
  //   2. The misreading's knock-on failures, split across main + side
  //   3. TCS brought in to patch the code; repair tools appear, screens fixed
  gsap.registerPlugin(ScrollTrigger);

  gsap.timeline({
    scrollTrigger: {
      trigger: scrollWrapper,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.5,
      onUpdate: (self) => updateStoryState(self.progress)
    }
  });

  const FRAMES = [
    {
      start: 0,
      main: "To save memory, programmers stored years using two digits instead of four, so 1997 was recorded simply as \u201c97\u201d",
      side: "On 1 January 2000, that field would flip to \u201c00\u201d, and systems worldwide risked interpreting it as 1900 rather than 2000",
      sideAt: 0.15
    },
    {
      start: 0.36,
      main: "This misreading threatened to trigger incorrect date calculations, cascading errors, and broader failures across",
      side: "finance, aviation, government infrastructure, and other systems",
      sideAt: 0.50,
      continues: true // side finishes the main sentence — no gap when stacked
    },
    {
      start: 0.68,
      main: "With too few programmers in the US to fix the bug in time, companies including India\u2019s TCS were brought in to patch the code at scale",
      side: "",
      sideAt: 1
    }
  ];

  const BUG_AT = FRAMES[0].sideAt; // screens break as the "00" paragraph lands
  const TOOLS_AT = 0.74;           // repair tools fade in during frame 3
  const FIXED_AT = 0.82;           // screens resolve once the tools are on
  const DIP = 0.025; // width of the brief fade-to-0 right at a frame boundary
  const FADE = 0.03; // fade-in length for the side paragraph and the tools

  const clamp01 = (v) => Math.max(0, Math.min(1, v));

  function updateStoryState(progress) {
    let i = FRAMES.length - 1;
    while (i > 0 && progress < FRAMES[i].start) i--;
    const frame = FRAMES[i];

    if (subheaderEl.textContent !== frame.main) subheaderEl.textContent = frame.main;
    if (sideTextEl.textContent !== frame.side) sideTextEl.textContent = frame.side;
    sideTextEl.classList.toggle("TK4R5-side-text--continues", !!frame.continues);

    // Dip both paragraphs to 0 around each frame boundary so the swap is hidden
    let dipOpacity = 1;
    for (const f of FRAMES.slice(1)) {
      const dist = Math.abs(progress - f.start);
      if (dist < DIP) dipOpacity = Math.min(dipOpacity, dist / DIP);
    }
    subheaderEl.style.opacity = dipOpacity;
    sideTextEl.style.opacity = clamp01((progress - frame.sideAt) / FADE) * dipOpacity;

    const toolsOpacity = clamp01((progress - TOOLS_AT) / FADE);
    fixToolEls.forEach(el => { el.style.opacity = toolsOpacity; });

    if (progress < BUG_AT) {
      // Phase 1: dates scrolling up to 31.12.99 — 2-digit year, matching
      // the Y2K four-digit-field problem itself
      const p = progress / BUG_AT;
      const year = 1998 + Math.floor(p * 1.99);
      const day = String(1 + Math.floor(p * 30)).padStart(2, "0");
      const month = String(1 + Math.floor(p * 11)).padStart(2, "0");
      const yearShort = String(year).slice(-2);
      const dateStr = `${day}.${month}.${yearShort}`;

      devices.forEach(d => d.screenTex.update(dateStr, false));
    } else if (progress < FIXED_AT) {
      // Phase 2: bug manifestation — the broken devices' 2-digit year field
      // rolls over to "00" (1900); unaffected devices already show 2000
      devices.forEach(d => {
        if (d.willBug) {
          d.screenTex.update("01.01.00", true);
        } else {
          d.screenTex.update("01.01.2000", false);
        }
      });
    } else {
      // Phase 3: fixed — dates resolve to the full 4-digit 2000 and stay
      devices.forEach(d => d.screenTex.update("01.01.2000", false));
    }
  }

  updateStoryState(0);

  // 8. RENDER LOOP
  function animate() {
    requestAnimationFrame(animate);

    const time = Date.now() * 0.001;
    devices.forEach((d, i) => {
      if (d !== activeRotatingDevice) {
        d.pivot.rotation.x = Math.sin(time + i) * 0.02;
        d.pivot.rotation.y = Math.cos(time + i) * 0.02;
      }
    });

    renderer.render(scene, camera);
    updateToolPins(time);
  }

  animate();

  // 9. RESIZE HANDLER
  window.addEventListener("resize", () => {
    applyLayout();
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
});
