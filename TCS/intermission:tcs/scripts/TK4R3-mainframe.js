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
  const SCREEN_ANCHOR_PCT = { x: 0.2785, y: 0.392 };

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

    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    if (DEBUG_VIEW) {
      camera.position.set(8, 8, 40);
    } else {
      camera.position.set(0, 0, 6);
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
        modelGroup.scale.setScalar(scaleFactor);
        model.rotation.order = "XYZ";
        model.rotation.x = MODEL_ROTATION_X;
        model.rotation.y = MODEL_ROTATION_Y;
        modelGroup.add(model);

        model.traverse((child) => {
          if (child.isMesh) interactiveMeshes.push(child);
        });

        camera.updateMatrixWorld();
        modelGroup.updateMatrixWorld(true);

        const anchorNdc = new THREE.Vector2(
          SCREEN_ANCHOR_PCT.x * 2 - 1,
          -(SCREEN_ANCHOR_PCT.y * 2 - 1)
        );
        raycaster.setFromCamera(anchorNdc, camera);
        const anchorHit = raycaster.intersectObjects(interactiveMeshes)[0];
        if (anchorHit) {
          screenAnchorLocal = modelGroup.worldToLocal(anchorHit.point.clone());
        }

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
      }

      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener("resize", () => {
      const { w: cw, h: ch } = getSize();
      camera.aspect = cw / ch;
      camera.updateProjectionMatrix();
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
