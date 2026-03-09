const scroller = scrollama();
const visual = document.querySelector("#visual-element");

function init() {
    scroller
        .setup({
            step: "#scrolly article .step",
            offset: 0.5,
            progress: true,
        })
        .onStepEnter((response) => {
            // Add 'is-active' class to fade in the text
            response.element.classList.add("is-active");

            // Monstro-style "Pop" animation using GSAP
            gsap.to(visual, {
                scale: 1.2,
                duration: 0.6,
                ease: "back.out(1.7)", // This provides that signature bouncy feel
                backgroundColor: response.index % 2 === 0 ? "#ff4d00" : "#0055ff"
            });
        })
        .onStepExit((response) => {
            response.element.classList.remove("is-active");
            gsap.to(visual, { scale: 1, duration: 0.3 });
        })
        .onStepProgress((response) => {
    const progress = response.progress;
    const stepIndex = response.index;

    // 1. Center Square Rotation (Normal speed)
    gsap.set(visual, { rotation: progress * 180 });

    // 2. Parallax Orbs (Different speeds and directions)
    // Orb 1 moves slowly upwards (multiplier 100)
    gsap.to(".orb-1", {
        y: progress * -100,
        duration: 0.1,
        overwrite: 'auto'
    });

    // Orb 2 moves faster downwards (multiplier 250)
    gsap.to(".orb-2", {
        y: progress * 250,
        scale: 1 + progress, // It also grows!
        duration: 0.1,
        overwrite: 'auto'
    });

    // Ring 1 rotates in the opposite direction
    gsap.to(".ring-1", {
        rotation: progress * -360,
        duration: 0.1,
        overwrite: 'auto'
    });

    // Update text
    visual.innerText = Math.round(progress * 100) + "%";
});
}

// Ensure the scroller resizes correctly
window.addEventListener("resize", scroller.resize);

init();
