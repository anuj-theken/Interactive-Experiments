// Initialize Scrollama
const scroller = scrollama();

// Select elements
const scrolly = document.querySelector("#scrolly");
const sticky = scrolly.querySelector(".sticky-thing");
const article = scrolly.querySelector("article");
const steps = article.querySelectorAll(".step");

// Function to handle step enter
function handleStepEnter(response) {
    // response = { element, direction, index }

    // Update the text in the sticky element
    sticky.querySelector("p").innerText = `Step ${response.index + 1}`;

    // Optional: Change background color based on step
    const colors = ["#ff5733", "#33ff57", "#3357ff", "#f333ff"];
    sticky.style.backgroundColor = colors[response.index];
}

function init() {
    scroller
        .setup({
            step: "#scrolly article .step",
            offset: 0.5, // Trigger when step is at 50% of the viewport
            debug: false // Set to true to see the trigger line
        })
        .onStepEnter(handleStepEnter);

    // Setup resize event for responsiveness
    window.addEventListener("resize", scroller.resize);
}

init();
