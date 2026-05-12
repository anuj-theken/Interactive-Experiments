gsap.registerPlugin(ScrollTrigger);

const setupScrollSection = () => {
    const circle = document.querySelector('#bgCircle');

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: "#bajaj-section-container",
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            pin: ".visual-viewport",
            anticipatePin: 1
        }
    });

    // GROW THE CIRCLE
    tl.to(circle, {
        scale: 10,       // Fixed: Massive scale
        ease: "power4.in", // Fixed: Fast finish for "explosion" effect
        duration: 10
    }, 0);

    // TEXT SEQUENCE (Your preferred timing)
    gsap.set("#t1", { opacity: 1 });

    tl.to("#t1", { opacity: 0, duration: 1 }, 3)
      .to("#t2", { opacity: 1, duration: 1 }, 3.8)
      .to("#t2", { opacity: 0, duration: 1 }, 7)
      .to("#t3", { opacity: 1, duration: 1 }, 7.8);

    // OPTIONAL: Fade the whole circle away at the very end
    tl.to(circle, { opacity: 0, duration: 1 }, 10);
};

window.addEventListener('load', setupScrollSection);
