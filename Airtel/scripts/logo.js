const layouts = {
  // Instance 1: Max width/height spread to maximize spacing
  state1: [
    { id: "idea", top: "0%", left: "0%", bg: "#fdfaf2" },
    { id: "bsnl", top: "-10%", left: "49%", bg: "#fdfaf2" },
    { id: "airtel", top: "0%", left: "100%", bg: "#fdfaf2" },
    { id: "rpg", top: "30%", left: "5%", bg: "#dcd5c5" },
    { id: "jt_mobile", top: "28%", left: "49%", bg: "#dcd5c5" },
    { id: "modi_telstra", top: "30%", left: "95%", bg: "#dcd5c5" },
    { id: "koshika", top: "65%", left: "0%", bg: "#dcd5c5" },
    { id: "fascel", top: "63%", left: "49%", bg: "#dcd5c5" },
    { id: "bpl", top: "65%", left: "100%", bg: "#dcd5c5" },
    { id: "usha_martin", top: "100%", left: "5%", bg: "#dcd5c5" },
    { id: "sterling", top: "100%", left: "49%", bg: "#dcd5c5" },
  ],
  state2: [
    { id: "bsnl", top: "2%", left: "38%", bg: "#fdfaf2" },
    { id: "airtel", top: "21%", left: "84%", bg: "#fdfaf2" },
    { id: "idea", top: "28%", left: "0%", bg: "#fdfaf2" },
    { id: "hutch", top: "45%", left: "38%", bg: "#dcd5c5" },
    { id: "tata", top: "74%", left: "84%", bg: "#dcd5c5" },
    { id: "spice", top: "88%", left: "35%", bg: "#dcd5c5" },
  ],
  // Instance 3: Maximized perimeter separation
  state3: [
    { id: "bsnl", top: "0%", left: "38%", bg: "#fdfaf2" },
    { id: "airtel", top: "5%", left: "100%", bg: "#fdfaf2" },
    { id: "idea", top: "5%", left: "0%", bg: "#fdfaf2" },
    { id: "vodafone", top: "36%", left: "38%", bg: "#fdfaf2" },
    { id: "telenor", top: "50%", left: "0%", bg: "#dcd5c5" },
    { id: "mts", top: "52%", left: "100%", bg: "#dcd5c5" },
    { id: "videocon", top: "69%", left: "63%", bg: "#dcd5c5" },
    { id: "stel", top: "95%", left: "0%", bg: "#dcd5c5" },
    { id: "loop", top: "95%", left: "100%", bg: "#dcd5c5" },
    { id: "etisalat", top: "100%", left: "38%", bg: "#dcd5c5" },
  ],
  state4: [
    { id: "bsnl", top: "2%", left: "38%", bg: "#fdfaf2" },
    { id: "airtel", top: "21%", left: "84%", bg: "#fdfaf2" },
    { id: "idea", top: "28%", left: "0%", bg: "#dcd5c5" },
    { id: "vodafone", top: "59%", left: "38%", bg: "#dcd5c5" },
    { id: "jio", top: "82%", left: "78%", bg: "#fdfaf2" },
  ],
  state5: [
    { id: "bsnl", top: "6%", left: "38%", bg: "#fdfaf2" },
    { id: "airtel", top: "28%", left: "84%", bg: "#fdfaf2" },
    { id: "vi", top: "59%", left: "38%", bg: "#fdfaf2" },
    { id: "jio", top: "84%", left: "76%", bg: "#fdfaf2" },
  ],
};

let activeElements = new Set();

function transitionToState(stateKey) {
  const nextConfig = layouts[stateKey];
  if (!nextConfig) return;
  const nextIds = new Set(nextConfig.map((node) => node.id));

  // 1. Terminate Outgoing Exits
  activeElements.forEach((id) => {
    if (!nextIds.has(id)) {
      const element = document.querySelector(`[data-QW4K-id="${id}"]`);
      if (element) {
        gsap.to(element, {
          opacity: 0,
          scale: 0.5,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            element.style.display = "none";
          },
        });
      }
    }
  });

  // 2. Compute Entry/Movement Animations
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
          duration: 0.35,
          ease: "power2.out",
        });
      } else {
        gsap.to(element, {
          top: node.top,
          left: node.left,
          backgroundColor: node.bg,
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: "power2.out",
        });
      }
    }
  });

  activeElements = nextIds;

  // 3. Handle active classes
  const stateIndex = parseInt(stateKey.replace("state", "")) - 1;
  document.querySelectorAll(".QW4K-timeline-section").forEach((section, i) => {
    if (i === stateIndex) {
      section.classList.add("is-active-mobile");
    } else {
      section.classList.remove("is-active-mobile");
    }
  });

  // 4. Handle final paragraph container text injection
  const summaryContainer = document.getElementById("QW4K-summary-text");
  if (summaryContainer) {
    if (stateKey === "state5") {
      summaryContainer.innerHTML =
        "Airtel - 1995, Jio - 2016. Vi - 2007 and BSNL - 2000 are the only surviving players in the industry.";
      gsap.to(summaryContainer, {
        opacity: 1,
        duration: 0.25,
        ease: "power1.out",
      });
    } else {
      gsap.to(summaryContainer, {
        opacity: 0,
        duration: 0.2,
        ease: "power1.in",
        onComplete: () => {
          summaryContainer.innerHTML = "";
        },
      });
    }
  }
}

window.addEventListener("load", () => {
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.config({
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
    });

    const isMobile = window.innerWidth < 1024;
    const container = document.getElementById("QW4K-timeline-module");
    const sectionWrapper =
      document.querySelector(".QW4K-timeline-section-wrapper") || container;

    transitionToState("state1");

    if (isMobile) {
      const mobileTrackHeightValue = 140;
      const totalScrollDistance = 5 * mobileTrackHeightValue;

      if (container) {
        document
          .querySelectorAll(".QW4K-virtual-mobile-track-holder")
          .forEach((el) => el.remove());

        const trackHolder = document.createElement("div");
        trackHolder.className = "QW4K-virtual-mobile-track-holder";
        trackHolder.style.position = "absolute";
        trackHolder.style.top = `${sectionWrapper.offsetTop}px`;
        trackHolder.style.left = "0";
        trackHolder.style.width = "100%";
        trackHolder.style.height = `${totalScrollDistance}vh`;
        trackHolder.style.pointerEvents = "none";

        document.body.appendChild(trackHolder);

        ScrollTrigger.create({
          trigger: trackHolder,
          start: "top top",
          end: "bottom bottom",
          pin: container,
          pinSpacing: true,
          invalidateOnRefresh: true,
        });

        for (let i = 1; i <= 5; i++) {
          const dummyTrack = document.createElement("div");
          dummyTrack.className = "QW4K-virtual-mobile-track";
          dummyTrack.style.height = `${mobileTrackHeightValue}vh`;
          dummyTrack.style.position = "relative";
          dummyTrack.style.pointerEvents = "none";
          trackHolder.appendChild(dummyTrack);

          ScrollTrigger.create({
            trigger: dummyTrack,
            scroller: "body",
            start: "top 60%",
            end: "bottom 40%",
            onEnter: () => transitionToState(`state${i}`),
            onEnterBack: () => transitionToState(`state${i}`),
          });
        }
      }
    } else {
      if (container && sectionWrapper) {
        ScrollTrigger.create({
          trigger: sectionWrapper,
          start: "top top",
          end: "bottom bottom",
          pin: container,
          pinSpacing: false,
        });

        const totalStates = 5;
        for (let i = 0; i < totalStates; i++) {
          ScrollTrigger.create({
            trigger: sectionWrapper,
            start: `top+=${(i / totalStates) * 100}% top`,
            end: `top+=${((i + 1) / totalStates) * 100}% top`,
            onEnter: () => transitionToState(`state${i + 1}`),
            onEnterBack: () => transitionToState(`state${i + 1}`),
          });
        }
      }
    }

    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  } else {
    console.error(
      "GSAP engine dependencies or ScrollTrigger plugins are missing from parent runtime scope layers.",
    );
  }
});
