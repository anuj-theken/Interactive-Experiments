document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const blocks = gsap.utils.toArray(".QW4K9-scrolly-block");

  // PINNING TRIGGER: Universally locks image canvas layer in viewport space
  ScrollTrigger.create({
    trigger: ".QW4K9-scrolly-container",
    start: "top top",
    end: "bottom bottom",
    pin: ".QW4K9-scrolly-visual-wrapper",
    pinSpacing: false,
  });

  // CONTENT TRIGGER: Drives layout progression crossfades
  const scrollyTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".QW4K9-scrolly-container",
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
    },
  });

  // Base state setups: Reveal first text card immediately
  gsap.set(blocks[0], { opacity: 1 });
  gsap.set([blocks[1], blocks[2]], { opacity: 0 });

  // Initialize all three baseline target variants simultaneously to full opacity
  gsap.set(["#img1", "#img1-ipad", "#img1-mob"], { opacity: 1 });
  gsap.set(
    ["#img2", "#img3", "#img2-ipad", "#img3-ipad", "#img2-mob", "#img3-mob"],
    { opacity: 0 },
  );

  // Crossfade step triggers across the scroll runway length
  scrollyTimeline
    /* --- TRANSITION 1: Slide 1 out, Slide 2 in --- */
    // Keeps state 1 locked down for a longer period before performing the blend
    .to({}, { duration: 1.5 })

    .to(blocks[0], { opacity: 0, duration: 1 })
    .to(blocks[1], { opacity: 1, duration: 1 }, "<")

    // Crossfade Image 2 variants in simultaneously
    .to(["#img2", "#img2-ipad", "#img2-mob"], { opacity: 1, duration: 1 }, "<")
    .to(
      ["#img1", "#img1-ipad", "#img1-mob"],
      { opacity: 0, duration: 0.8 },
      "<+=0.2",
    )

    /* --- TRANSITION 2: Slide 2 out, Slide 3 in --- */
    .to({}, { duration: 0.5 })
    .to(blocks[1], { opacity: 0, duration: 1 })
    .to(blocks[2], { opacity: 1, duration: 1 }, "<")

    // Crossfade Image 3 variants in simultaneously
    .to(["#img3", "#img3-ipad", "#img3-mob"], { opacity: 1, duration: 1 }, "<")
    .to(
      ["#img2", "#img2-ipad", "#img2-mob"],
      { opacity: 0, duration: 0.8 },
      "<+=0.2",
    )

    /* --- HOLD SPACE AT THE END --- */
    .to({}, { duration: 1.5 });
});
