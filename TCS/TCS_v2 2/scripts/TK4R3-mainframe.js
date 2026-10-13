// scripts/TK4R3-mainframe.js — TK4R3 Burroughs deal / IBM 5110 scene.
// Depends on 3dModels/ibm5110Data.js (window.IBM_5110_DATA, base64 GLTF)
// loading first, and on three.js r128 + GLTFLoader + GSAP + ScrollTrigger
// already present on the page.

document.addEventListener("DOMContentLoaded", function () {
  // Visual design restored to the original mainframe.html prototype's own
  // hardcoded terminal-green/navy palette (a deliberate, user-requested
  // exception for this module — not read from the site's design tokens).
  const BG_DARK = "#001647";

  const container = document.getElementById("TK4R3-webgl-container");
  const terminalDisplayEl = document.getElementById("TK4R3-terminal-display");
  if (!container || !terminalDisplayEl) return;

  // These two must match the .TK4R3-terminal-display CSS left/top exactly —
  // the anchor point on the model's screen is expressed as NDC computed
  // straight from these percentages rather than from a DOM getBoundingClientRect,
  // because this module can sit far below the fold on the combined page: its
  // sticky wrapper still reports a valid width/height at load time, but its
  // on-screen *position* only becomes meaningful once scrolled into its own
  // pin range, so any anchor calc based on that position would be wrong for
  // everyone who hasn't scrolled there yet.
  const SCREEN_ANCHOR_PCT = { x: 0.2517, y: 0.3972 };
  // The CSS terminal box as a fraction of the viewport (width 20.35%,
  // height 25%) — used to find the model screen's edges.
  const SCREEN_BOX_PCT = { w: 0.2035, h: 0.25 };
  // The anchor above was tuned on a 16:10 desktop. Raycasting it against
  // the live viewport lands off the screen on portrait devices, so it's
  // always resolved against a fixed 16:10 reference camera instead.
  const REFERENCE_ASPECT = 1440 / 900;

  // Portrait / narrow layout (phones, iPad portrait): the camera zooms and
  // pans so only the model's left side is in frame — its left edge a small
  // gap from the viewport edge, the rest cropped off to the right — which
  // makes the screen big enough to read. Photos sit below the screen.
  const compactQuery = window.matchMedia("(max-aspect-ratio: 11/10), (max-width: 700px)");

  const MODEL_ROTATION_X = 0;
  const MODEL_ROTATION_Y = (-90 * Math.PI) / 180;
  const DEBUG_VIEW = false;

  function getSize() {
    const rect = container.getBoundingClientRect();
    return { w: rect.width || window.innerWidth, h: rect.height || window.innerHeight };
  }

  (function initIbm5110Scene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(BG_DARK);

    let { w, h } = getSize();

    const DESKTOP_FOV = 45;
    const DESKTOP_CAMERA_Z = 6;
    const COMPACT_FOV = 22;

    const camera = new THREE.PerspectiveCamera(DESKTOP_FOV, w / h, 0.1, 1000);
    if (DEBUG_VIEW) {
      camera.position.set(8, 8, 40);
    } else {
      camera.position.set(0, 0, DESKTOP_CAMERA_Z);
    }
    camera.lookAt(0, 0, 0);

    if (DEBUG_VIEW) {
      scene.add(new THREE.AxesHelper(5));
      scene.add(new THREE.GridHelper(10, 10));
    }

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    scene.add(new THREE.HemisphereLight(0x24407a, 0x001030, 0.6));

    const rimLight = new THREE.DirectionalLight(0x2bf189, 1.1);
    rimLight.position.set(-6, 3, -4);
    scene.add(rimLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 0.6);
    keyLight.position.set(4, 6, 8);
    scene.add(keyLight);

    const modelGroup = new THREE.Group();
    modelGroup.position.x = 0.6;
    scene.add(modelGroup);

    const interactiveMeshes = [];
    const raycaster = new THREE.Raycaster();
    let screenAnchorLocal = null;
    let screenEdgesLocal = null; // left, right, top, bottom points on the model screen
    let modelPointsLocal = []; // sampled vertices, for measuring the model's projected extent
    let finalScale = 1;
    let compact = false;

    const stickyEl = container.parentElement;
    const headerEl = stickyEl.querySelector(".TK4R3-page-header");
    const frameImages = [...stickyEl.querySelectorAll(".TK4R3-frame-image")];
    const COMPACT_IMAGE_BOTTOM = 52; // must match .TK4R3-frame-image bottom in the compact CSS
    frameImages.forEach((img) => {
      if (!img.complete) img.addEventListener("load", () => applyLayout(), { once: true });
    });

    function projectToPx(local, cam, cw, ch, out) {
      out.copy(local).applyMatrix4(modelGroup.matrixWorld).project(cam);
      return { x: (out.x * 0.5 + 0.5) * cw, y: (-out.y * 0.5 + 0.5) * ch };
    }

    // Frames the camera for the current viewport. Desktop keeps the original
    // untouched view; compact zooms/pans it via setViewOffset (a pure 2D
    // crop of the same perspective, so the terminal tracking still works).
    function applyLayout() {
      const { w: cw, h: ch } = getSize();
      compact = compactQuery.matches;
      // Compact uses a narrower, further-back lens covering the same view:
      // flatter perspective, so the base juts out less past the screen and
      // the screen can take more of the viewport width.
      if (!DEBUG_VIEW) {
        const fov = compact ? COMPACT_FOV : DESKTOP_FOV;
        camera.fov = fov;
        camera.position.z =
          DESKTOP_CAMERA_Z * Math.tan(((DESKTOP_FOV / 2) * Math.PI) / 180) / Math.tan(((fov / 2) * Math.PI) / 180);
        camera.updateMatrixWorld();
      }
      camera.aspect = cw / ch;
      camera.clearViewOffset();

      if (!compact || !screenEdgesLocal || !modelPointsLocal.length) {
        terminalDisplayEl.style.width = "";
        terminalDisplayEl.style.height = "";
        terminalDisplayEl.style.fontSize = "";
        frameImages.forEach((img) => {
          img.style.width = "";
          img.style.height = "";
        });
        return;
      }

      // Measure at rest: final scale, no drag tilt.
      const savedScale = modelGroup.scale.x;
      const savedRot = { x: modelGroup.rotation.x, y: modelGroup.rotation.y };
      modelGroup.scale.setScalar(finalScale);
      modelGroup.rotation.set(0, 0, 0);
      modelGroup.updateMatrixWorld(true);
      camera.updateMatrixWorld();

      const tmp = new THREE.Vector3();
      let minX = Infinity, minY = Infinity, maxY = -Infinity;
      for (const p of modelPointsLocal) {
        const s = projectToPx(p, camera, cw, ch, tmp);
        if (s.x < minX) minX = s.x;
        if (s.y < minY) minY = s.y;
        if (s.y > maxY) maxY = s.y;
      }
      const screenRight = projectToPx(screenEdgesLocal.right, camera, cw, ch, tmp).x;
      const screenBottom = projectToPx(screenEdgesLocal.bottom, camera, cw, ch, tmp).y;

      modelGroup.scale.setScalar(savedScale);
      modelGroup.rotation.set(savedRot.x, savedRot.y, 0);

      const gap = Math.max(12, cw * 0.035);
      const headerBottom = headerEl ? headerEl.offsetTop + headerEl.offsetHeight : ch * 0.12;
      const top = headerBottom + ch * 0.04;
      // Screen's right edge near the right side of the viewport, but keep
      // the model short enough to leave room for the photos underneath.
      const zoom = Math.min((cw * 0.94 - gap) / (screenRight - minX), (ch * 0.52) / (maxY - minY));

      const offsetX = minX * zoom - gap;
      const offsetY = minY * zoom - top;
      camera.setViewOffset(cw * zoom, ch * zoom, offsetX, offsetY, cw, ch);

      // Photos: as wide as the viewport allows (up to 640px), bottom-anchored
      // above the footer caption (CSS), and never taller than the space
      // between the screen and the caption — so they may overlap the
      // model's base/keyboard but never the screen text.
      const maxW = Math.min(cw - 32, 640);
      const maxH = ch - COMPACT_IMAGE_BOTTOM - (screenBottom * zoom - offsetY) - 12;
      frameImages.forEach((img) => {
        if (!img.naturalWidth) return;
        const aspect = img.naturalWidth / img.naturalHeight;
        const imgW = Math.max(0, Math.min(maxW, maxH * aspect));
        img.style.width = imgW + "px";
        img.style.height = imgW / aspect + "px";
      });
    }

    function base64ToArrayBuffer(base64) {
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      return bytes.buffer;
    }

    const gltfLoader = new THREE.GLTFLoader();
    gltfLoader.parse(
      base64ToArrayBuffer(window.IBM_5110_DATA),
      "",
      (gltf) => {
        const model = gltf.scene;

        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        box.getSize(size);
        const center = new THREE.Vector3();
        box.getCenter(center);
        model.position.sub(center);

        const targetSize = DEBUG_VIEW ? 4 : 5;
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const scaleFactor = targetSize / maxDim;
        finalScale = scaleFactor;
        modelGroup.scale.setScalar(scaleFactor);
        model.rotation.order = "XYZ";
        model.rotation.x = MODEL_ROTATION_X;
        model.rotation.y = MODEL_ROTATION_Y;
        modelGroup.add(model);

        model.traverse((child) => {
          if (child.isMesh) interactiveMeshes.push(child);
        });

        modelGroup.updateMatrixWorld(true);

        const refCamera = camera.clone();
        refCamera.aspect = REFERENCE_ASPECT;
        refCamera.clearViewOffset();
        refCamera.updateMatrixWorld();

        const hitLocal = (pctX, pctY) => {
          raycaster.setFromCamera(new THREE.Vector2(pctX * 2 - 1, -(pctY * 2 - 1)), refCamera);
          const hit = raycaster.intersectObjects(interactiveMeshes)[0];
          return hit ? modelGroup.worldToLocal(hit.point.clone()) : null;
        };

        const ax = SCREEN_ANCHOR_PCT.x;
        const ay = SCREEN_ANCHOR_PCT.y;
        screenAnchorLocal = hitLocal(ax, ay);
        const edges = {
          left: hitLocal(ax - SCREEN_BOX_PCT.w / 2, ay),
          right: hitLocal(ax + SCREEN_BOX_PCT.w / 2, ay),
          top: hitLocal(ax, ay - SCREEN_BOX_PCT.h / 2),
          bottom: hitLocal(ax, ay + SCREEN_BOX_PCT.h / 2),
        };
        if (edges.left && edges.right && edges.top && edges.bottom) screenEdgesLocal = edges;

        const v = new THREE.Vector3();
        interactiveMeshes.forEach((mesh) => {
          const pos = mesh.geometry && mesh.geometry.attributes.position;
          if (!pos) return;
          const step = Math.max(1, Math.floor(pos.count / 400));
          for (let i = 0; i < pos.count; i += step) {
            v.fromBufferAttribute(pos, i).applyMatrix4(mesh.matrixWorld);
            modelPointsLocal.push(modelGroup.worldToLocal(v.clone()));
          }
        });

        applyLayout();

        gsap.from(modelGroup.scale, {
          x: 0,
          y: 0,
          z: 0,
          duration: 1.1,
          ease: "back.out(1.5)",
        });
      },
      (err) => console.error("Failed to load IBM 5110 model:", err)
    );

    // --- Drag to rotate (subtle tilt only) ---
    const pointer = new THREE.Vector2();
    const MAX_DRAG_ROTATION_Y = (10 * Math.PI) / 180;
    const MAX_DRAG_ROTATION_X = (5 * Math.PI) / 180;

    let dragging = false;
    let previousPointerPosition = { x: 0, y: 0 };

    container.addEventListener("pointerdown", (e) => {
      const { w: cw, h: ch } = getSize();
      const rect = container.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / cw) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / ch) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshes);

      if (intersects.length > 0) {
        dragging = true;
        previousPointerPosition = { x: e.clientX, y: e.clientY };
      }
    });

    window.addEventListener("pointermove", (e) => {
      if (!dragging) return;

      const deltaX = e.clientX - previousPointerPosition.x;
      const deltaY = e.clientY - previousPointerPosition.y;

      modelGroup.rotation.y = Math.max(
        -MAX_DRAG_ROTATION_Y,
        Math.min(MAX_DRAG_ROTATION_Y, modelGroup.rotation.y + deltaX * 0.016)
      );
      modelGroup.rotation.x = Math.max(
        -MAX_DRAG_ROTATION_X,
        Math.min(MAX_DRAG_ROTATION_X, modelGroup.rotation.x + deltaY * 0.016)
      );

      previousPointerPosition = { x: e.clientX, y: e.clientY };
    });

    const releaseDrag = () => {
      if (!dragging) return;
      dragging = false;

      gsap.to(modelGroup.rotation, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
      });
    };

    window.addEventListener("pointerup", releaseDrag);
    window.addEventListener("pointerleave", releaseDrag);

    const projected = new THREE.Vector3();
    const edgeTmp = new THREE.Vector3();
    function animate() {
      requestAnimationFrame(animate);

      if (screenAnchorLocal) {
        const { w: cw, h: ch } = getSize();
        projected.copy(screenAnchorLocal).applyMatrix4(modelGroup.matrixWorld).project(camera);
        const px = (projected.x * 0.5 + 0.5) * cw;
        const py = (-projected.y * 0.5 + 0.5) * ch;
        const rotXdeg = (modelGroup.rotation.x * 180) / Math.PI;
        const rotYdeg = (modelGroup.rotation.y * 180) / Math.PI;
        terminalDisplayEl.style.left = px + "px";
        terminalDisplayEl.style.top = py + "px";
        terminalDisplayEl.style.transform = `translate(-50%, -50%) perspective(1400px) rotateX(${rotXdeg}deg) rotateY(${rotYdeg}deg)`;

        if (compact && screenEdgesLocal) {
          const l = projectToPx(screenEdgesLocal.left, camera, cw, ch, edgeTmp).x;
          const r = projectToPx(screenEdgesLocal.right, camera, cw, ch, edgeTmp).x;
          const t = projectToPx(screenEdgesLocal.top, camera, cw, ch, edgeTmp).y;
          const b = projectToPx(screenEdgesLocal.bottom, camera, cw, ch, edgeTmp).y;
          const boxW = Math.max(0, r - l);
          terminalDisplayEl.style.width = boxW + "px";
          terminalDisplayEl.style.height = Math.max(0, b - t) + "px";
          terminalDisplayEl.style.fontSize = Math.max(11, Math.min(18, boxW / 17)) + "px";
        }
      }

      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener("resize", () => {
      const { w: cw, h: ch } = getSize();
      applyLayout();
      renderer.setSize(cw, ch);
    });
  })();

  gsap.registerPlugin(ScrollTrigger);

  const totalCards = 8;
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".TK4R3-scroll-wrapper",
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
    },
  });

  const imageForCard = {
    0: "#TK4R3-frame-image-0",
    3: "#TK4R3-frame-image-1",
    5: "#TK4R3-frame-image-6",
    7: "#TK4R3-frame-image-7",
  };

  timeline.to("#TK4R3-card-intro", { opacity: 0, duration: 0.6, ease: "power2.in" }, 0);

  for (let i = 0; i < totalCards; i++) {
    const card = `#TK4R3-card-${i}`;
    const image = imageForCard[i];

    timeline.to(card, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
    });
    if (image) timeline.to(image, { opacity: 1, duration: 1, ease: "power2.out" }, "<");

    timeline.to(card, {
      opacity: 1,
      duration: 1.5,
    });

    if (i < totalCards - 1) {
      timeline.to(card, {
        opacity: 0,
        y: -30,
        duration: 1,
        ease: "power2.in",
      });
      if (image) timeline.to(image, { opacity: 0, duration: 1, ease: "power2.in" }, "<");
    }
  }
});
