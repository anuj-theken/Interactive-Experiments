document.addEventListener("DOMContentLoaded", () => {
  // Register ScrollTrigger with GSAP
  gsap.registerPlugin(ScrollTrigger);

  // Timeline scoped strictly to the prefixed container element
  const scrollyTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".QW4K-scrolly-container",
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
    },
  });

  // Crossfade execution
  scrollyTimeline
    .to("#img1", { opacity: 0, duration: 1 })
    .to("#img2", { opacity: 1, duration: 1 }, "<");
});
