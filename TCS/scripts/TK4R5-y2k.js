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
  const fixHandsCrtEl = document.getElementById("TK4R5-fix-hands-crt");
  const fixHandsScreenEl = document.getElementById("TK4R5-fix-hands-screen");

  // 3. THREE.JS SCENE SETUP
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(BG);

  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(0, 0, 14);

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

  // Placement matches the reference composition (five devices): x/y centers
  // and relative sizes were measured as fractions of the reference canvas,
  // then mapped onto this scene's world space. Positions are the model's
  // BASE (loadDevice lifts each model up by half its own height from y).
  // These three (willBug: true) are "the devices that broke".
  loadDevice("3dModels/crt_computer_monitor.glb", -5.62, -2.16, 0.5, true, {
    initialDate: "15.08.1998", targetSize: 4.3, refSize: 1.9,
    screenOffset: { x: 0, y: 0.2295, z: 0.98 }, screenSize: { w: 1.36, h: 1.02 }
  });
  loadDevice("3dModels/simple_computer_placeholder.glb", 0.15, -4.17, -0.8, false, {
    initialDate: "10.11.1998", targetSize: 3.6, refSize: 1.9,
    screenOffset: { x: 0.03, y: 0.362, z: 0.78 }, screenSize: { w: 1.0, h: 0.88 }
  });
  loadDevice("3dModels/retro_screen.glb", 4.47, -0.185, 0.6, true, {
    initialDate: "15.08.1998", targetSize: 3.2, refSize: 1.7, rotationY: 270,
    screenOffset: { x: -0.04, y: 0.334, z: 0.85 }, screenSize: { w: 1.12, h: 0.84 }
  });
  loadDevice("3dModels/retro_80s_phone.glb", 7.94, 0.975, -0.4, false, {
    initialDate: "22.03.1999", targetSize: 3.42, refSize: 1.7, rotationY: 90, dateFontSize: 70,
    screenOffset: { x: 0.06, y: 0.10, z: 0.16 }, screenSize: { w: 0.28, h: 0.16 }
  });
  loadDevice("3dModels/retro_arcade_game_controller.glb", 5.93, -4.81, 0.2, true, {
    initialDate: "10.11.1998", targetSize: 2.98, refSize: 1.9,
    screenOffset: { x: 0.013, y: 0.0126, z: 0.10 }, screenSize: { w: 0.75, h: 0.60 }
  });

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
  // Full scrollytelling arc, driven by scroll progress (0 -> 1, scrubbed
  // both directions):
  //   1. Header (constant) + subheader "...TCS saved the day"
  //   2. Subheader swaps to "...gonna break" as screens glitch
  //   3. Subheader swaps BACK as the repair-hands overlay appears
  //   4. Subheader swaps to "It saved the world..." as screens end up fixed
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

  const SUB_A = "When the world was crashing, TCS saved the day";
  const SUB_B = "As the time came close, the 4 digit filed was gonna break";
  const SUB_C = "It saved the world from a huge crash";

  const B1 = 0.24; // A -> B
  const B2 = 0.50; // B -> A
  const B3 = 0.76; // A -> C
  const DIP = 0.025; // width of the brief fade-to-0 right at a boundary

  function fadeWindow(progress, inEnd, holdEnd, outEnd) {
    if (progress < inEnd) return inEnd > 0 ? progress / inEnd : 1;
    if (progress < holdEnd) return 1;
    if (progress < outEnd) return 1 - (progress - holdEnd) / (outEnd - holdEnd);
    return 0;
  }

  function updateStoryState(progress) {
    let subText;
    if (progress < B1) subText = SUB_A;
    else if (progress < B2) subText = SUB_B;
    else if (progress < B3) subText = SUB_A;
    else subText = SUB_C;
    if (subheaderEl.textContent !== subText) subheaderEl.textContent = subText;

    let dipOpacity = 1;
    for (const b of [B1, B2, B3]) {
      const dist = Math.abs(progress - b);
      if (dist < DIP) {
        dipOpacity = Math.min(dipOpacity, dist / DIP);
      }
    }
    subheaderEl.style.opacity = dipOpacity;

    const HANDS_SHOW_AT = 0.40; // well after screens turn critical at B1
    let handsOpacity;
    if (progress < HANDS_SHOW_AT) {
      handsOpacity = 0;
    } else {
      handsOpacity = fadeWindow(progress, HANDS_SHOW_AT, 0.68, 0.76);
    }
    fixHandsCrtEl.style.opacity = handsOpacity;
    fixHandsScreenEl.style.opacity = handsOpacity;

    if (progress < B1) {
      // Phase 1: dates scrolling up to 31.12.99 — 2-digit year, matching
      // the Y2K four-digit-field problem itself
      const p = progress / B1;
      const year = 1998 + Math.floor(p * 1.99);
      const day = String(1 + Math.floor(p * 30)).padStart(2, "0");
      const month = String(1 + Math.floor(p * 11)).padStart(2, "0");
      const yearShort = String(year).slice(-2);
      const dateStr = `${day}.${month}.${yearShort}`;

      devices.forEach(d => d.screenTex.update(dateStr, false));
    } else if (progress < 0.60) {
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
  }

  animate();

  // 9. RESIZE HANDLER
  window.addEventListener("resize", () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
});
