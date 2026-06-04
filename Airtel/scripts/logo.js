/**
 * Isolated Timeline Module Data Matrix.
 * Elements use the custom namespaced data-QW4K-id selector mapping properties.
 */
const layouts = {
  state1: [
    { id: "bsnl", top: "2%", left: "42%", bg: "#fdfaf2" },
    { id: "airtel", top: "15%", left: "80%", bg: "#fdfaf2" },
    { id: "idea", top: "20%", left: "5%", bg: "#fdfaf2" },
    { id: "jt_mobile", top: "34%", left: "45%", bg: "#dcd5c5" },
    { id: "modi_telstra", top: "42%", left: "78%", bg: "#dcd5c5" },
    { id: "rpg", top: "45%", left: "12%", bg: "#dcd5c5" },
    { id: "fascel", top: "60%", left: "44%", bg: "#dcd5c5" },
    { id: "koshika", top: "68%", left: "10%", bg: "#dcd5c5" },
    { id: "bpl", top: "70%", left: "78%", bg: "#dcd5c5" },
    { id: "sterling", top: "85%", left: "45%", bg: "#dcd5c5" },
    { id: "usha_martin", top: "88%", left: "14%", bg: "#dcd5c5" },
  ],
  state2: [
    { id: "bsnl", top: "5%", left: "42%", bg: "#fdfaf2" },
    { id: "airtel", top: "25%", left: "82%", bg: "#fdfaf2" },
    { id: "idea", top: "30%", left: "2%", bg: "#fdfaf2" },
    { id: "hutch", top: "44%", left: "43%", bg: "#dcd5c5" },
    { id: "tata", top: "68%", left: "78%", bg: "#dcd5c5" },
    { id: "spice", top: "82%", left: "38%", bg: "#dcd5c5" },
  ],
  state3: [
    { id: "bsnl", top: "2%", left: "44%", bg: "#fdfaf2" },
    { id: "airtel", top: "15%", left: "82%", bg: "#fdfaf2" },
    { id: "idea", top: "18%", left: "2%", bg: "#fdfaf2" },
    { id: "vodafone", top: "38%", left: "44%", bg: "#fdfaf2" },
    { id: "telenor", top: "46%", left: "5%", bg: "#dcd5c5" },
    { id: "mts", top: "48%", left: "80%", bg: "#dcd5c5" },
    { id: "videocon", top: "66%", left: "45%", bg: "#dcd5c5" },
    { id: "stel", top: "72%", left: "8%", bg: "#dcd5c5" },
    { id: "loop", top: "74%", left: "82%", bg: "#dcd5c5" },
    { id: "etisalat", top: "88%", left: "44%", bg: "#dcd5c5" },
  ],
  state4: [
    { id: "bsnl", top: "5%", left: "45%", bg: "#fdfaf2" },
    { id: "airtel", top: "25%", left: "82%", bg: "#fdfaf2" },
    { id: "idea", top: "30%", left: "5%", bg: "#dcd5c5" },
    { id: "vodafone", top: "58%", left: "44%", bg: "#dcd5c5" },
    { id: "jio", top: "75%", left: "78%", bg: "#fdfaf2" },
  ],
  state5: [
    { id: "bsnl", top: "10%", left: "45%", bg: "#fdfaf2" },
    { id: "airtel", top: "30%", left: "80%", bg: "#fdfaf2" },
    { id: "vi", top: "55%", left: "44%", bg: "#fdfaf2" },
    { id: "jio", top: "78%", left: "75%", bg: "#fdfaf2" },
  ],
};

let activeElements = new Set();

function transitionToState(stateKey) {
  const nextConfig = layouts[stateKey];
  const nextIds = new Set(nextConfig.map((node) => node.id));

  // 1. Terminate Outgoing Exits
  activeElements.forEach((id) => {
    if (!nextIds.has(id)) {
      const element = document.querySelector(`[data-QW4K-id="${id}"]`);
      if (element) {
        gsap.to(element, {
          opacity: 0,
          scale: 0.5,
          duration: 0.4,
          ease: "power2.in",
          onComplete: () => {
            element.style.display = "none";
          },
        });
      }
    }
  });

  // 2. Compute Entry Animations Using Predefined Layout Parameters
  nextConfig.forEach((node) => {
    const element = document.querySelector(`[data-QW4K-id="${node.id}"]`);
    if (element) {
      const isNew =
        element.style.display === "none" || !activeElements.has(node.id);

      if (isNew) {
        gsap.set(element, {
          display: "flex",
          top: node.top,
          left: node.left,
          backgroundColor: node.bg,
          opacity: 0,
          scale: 0.5,
        });

        gsap.to(element, {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.2)",
        });
      } else {
        gsap.to(element, {
          top: node.top,
          left: node.left,
          backgroundColor: node.bg,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "power2.out",
        });
      }
    }
  });

  activeElements = nextIds;
}

// Global Document Entry Initialization Loop
window.addEventListener("load", () => {
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    /*
     * FIX: Prevent ScrollTrigger from auto-firing triggers on init based on
     * current scroll position. This stops all 5 states from bulk-triggering
     * when the page loads already scrolled past the module.
     */
    ScrollTrigger.config({
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
    });

    // Bootstrap visual layer — state1 always shown as the starting canvas
    transitionToState("state1");

    // Apply namespaced ScrollTrigger targets anchored within the view bounds
    const triggerIds = [
      "#QW4K-trigger1",
      "#QW4K-trigger2",
      "#QW4K-trigger3",
      "#QW4K-trigger4",
      "#QW4K-trigger5",
    ];

    triggerIds.forEach((triggerId, index) => {
      ScrollTrigger.create({
        trigger: triggerId,
        scroller: "body",
        start: "top 25%" /* Section top crosses 65% down the viewport → fire */,
        end: "bottom 35%" /* Section bottom clears 35% up the viewport → done */,
        onEnter: () => transitionToState(`state${index + 1}`),
        onEnterBack: () => transitionToState(`state${index + 1}`),
      });
    });

    /*
     * FIX: Defer refresh to next animation frame so all layout measurements
     * are stable before ScrollTrigger calculates trigger positions.
     */
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  } else {
    console.error(
      "GSAP engine dependencies or ScrollTrigger plugins are missing from parent runtime scope layers.",
    );
  }
});
