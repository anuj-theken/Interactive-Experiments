gsap.registerPlugin(ScrollTrigger);

const mainTl = gsap.timeline({
    scrollTrigger: {
        trigger: ".scroll-spacer",
        start: "top top",
        end: "bottom bottom",
        scrub: 1
    }
});

const scrollyContainer = document.querySelector('.scrolly-container-collage');

// 1. Set initial state (Hidden)
// 1. Force the container to be hidden initially
gsap.set(".scrolly-container-collage", { opacity: 0, pointerEvents: "none" });

ScrollTrigger.create({
    trigger: ".scroll-spacer", // Use the spacer!
    start: "top top",       // Starts fading in when the spacer hits the middle
    end: "bottom 90%",    // Fades out when the spacer leaves the middle
    onEnter: () => gsap.to(".scrolly-container-collage", { opacity: 1, pointerEvents: "all", duration: 0.5 }),
    onLeave: () => gsap.to(".scrolly-container-collage", { opacity: 0, pointerEvents: "none", duration: 0.5 }),
    onEnterBack: () => gsap.to(".scrolly-container-collage", { opacity: 1, pointerEvents: "all", duration: 0.5 }),
    onLeaveBack: () => gsap.to(".scrolly-container-collage", { opacity: 0, pointerEvents: "none", duration: 0.5 })
});

// Animation logic: Text drops DOWN (y: 50) and New text arrives at 0
mainTl
    .to(scrollyContainer, { autoAlpha: 1, duration: 0.5 }) // Fades in as you start scrolling the spacer
    .to(["#text1", "#bike1"], { opacity: 0, y: 50, duration: 1 })
    .to(["#text2", "#bike2", "#signal"], { opacity: 1, y: 0, duration: 1 }, "<")
    .to({}, {duration: 0.5})

    .to(["#text2", "#bike2"], { opacity: 0, y: 50, duration: 1 })
    .to(["#text3", "#bike3", "#bike4"], { opacity: 1, y: 0, duration: 1 }, "<")
    .to({}, {duration: 0.5})

    .to(["#text3", "#bike3", "#bike4"], { opacity: 0, y: 50, duration: 1 })
    .to(["#text4", "#bike5"], { opacity: 1, y: 0, duration: 1 }, "<")
    .to({}, {duration: 0.5})

    // .to(["#text4", "#bike4"], { opacity: 0, y: 50, duration: 1 })
    // .to(["#text5", "#bike5"], { opacity: 1, y: 0, duration: 1 }, "<")
    // .to({}, {duration: 0.5})

    .to(["#text4", "#bike5"], { opacity: 0, y: 50, duration: 1 })
    .to(["#text6", "#bike6", "#bike7", "#bike8"], { opacity: 1, y: 0, duration: 1 }, "<")
    .to({}, {duration: 1});
