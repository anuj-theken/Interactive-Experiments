gsap.registerPlugin(ScrollTrigger);

// Create the main timeline tied to the scroll
const mainTl = gsap.timeline({
    scrollTrigger: {
        trigger: ".scrolly-container-collage",
        start: "top top",      // When top of container hits top of viewport
        end: "bottom bottom",  // When bottom of container hits bottom of viewport
        scrub: 1,              // Smoothly links scroll position to animation progress
        pin: "#main-stage-collage", // Keeps the stage fixed while scrolling
    }
});

// Animation Steps
mainTl
    // Step 1 to 2
    .to(["#text1-collage", "#bike1-collage"], { opacity: 0, y: 50, duration: 1 })
    .to(["#text2-collage", "#bike2-collage", "#signal-collage"], { opacity: 1, y: 0, duration: 1 }, "<")
    .to({}, {duration: 0.5}) // Pause

    // Step 2 to 3
    .to(["#text2-collage", "#bike2-collage"], { opacity: 0, y: 50, duration: 1 })
    .to(["#text3-collage", "#bike3-collage", "#bike4-collage"], { opacity: 1, y: 0, duration: 1 }, "<")
    .to({}, {duration: 0.5})

    // Step 3 to 4
    .to(["#text3-collage", "#bike3-collage", "#bike4-collage"], { opacity: 0, y: 50, duration: 1 })
    .to(["#text4-collage", "#bike5-collage"], { opacity: 1, y: 0, duration: 1 }, "<")
    .to({}, {duration: 0.5})

    // Step 4 to 5 (Final Step)
    .to(["#text4-collage", "#bike5-collage"], { opacity: 0, y: 50, duration: 1 })
    .to(["#text6-collage", "#bike6-collage", "#bike7-collage"], { opacity: 1, y: 0, duration: 1 }, "<")
    .to({}, {duration: 1});
