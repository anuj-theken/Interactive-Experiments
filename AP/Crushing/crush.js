document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('ap-viz-canvas');
    const ctx = canvas.getContext('2d');

    let particles = [];
    const blueCount = 20;
    const totalRedAvailable = 150;
    const clusterRadius = 250;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor(color, startVisible = false) {
            this.color = color;
            this.radius = Math.random() * 4 + 4;
            this.opacity = startVisible ? 0.5 : 0;
            this.isActive = startVisible;

            this.x = canvas.width / 2 + (Math.random() - 0.5) * 200;
            this.y = canvas.height / 2 + (Math.random() - 0.5) * 200;

            this.vx = (Math.random() - 0.5) * 1.5;
            this.vy = (Math.random() - 0.5) * 1.5;
        }

        fade(targetOpacity) {
            gsap.to(this, {
                opacity: targetOpacity,
                duration: 0.3,
                ease: "power2.inOut"
            });
        }

        update() {
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const dx = this.x - centerX;
            const dy = this.y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            this.vx += (Math.random() - 0.5) * 0.1;
            this.vy += (Math.random() - 0.5) * 0.1;

            if (distance > clusterRadius) {
                const angle = Math.atan2(dy, dx);
                this.vx -= Math.cos(angle) * 0.15;
                this.vy -= Math.sin(angle) * 0.15;
            }

            const limit = 0.3;
            const currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (currentSpeed > limit) {
                this.vx = (this.vx / currentSpeed) * limit;
                this.vy = (this.vy / currentSpeed) * limit;
            }

            this.x += this.vx;
            this.y += this.vy;
        }

        draw() {
            if (this.opacity <= 0) return;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color.replace('ALPHA', this.opacity);
            ctx.fill();
        }
    }

    // Initialize Particles
    for (let i = 0; i < blueCount; i++) {
        particles.push(new Particle('rgba(74, 144, 226, ALPHA)', true));
    }

    let redParticles = [];
    for (let i = 0; i < totalRedAvailable; i++) {
        const p = new Particle('rgba(255, 71, 87, ALPHA)', false);
        redParticles.push(p);
        particles.push(p);
    }

    gsap.ticker.add(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
    });

    // ScrollTrigger Integration
    ScrollTrigger.create({
        trigger: ".ap-viz-wrapper",
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
            const p = self.progress;

            let targetRedCount = 0;
            let activePair = 0;

            // Define 3 explicit scroll triggers corresponding to the 3 pairs of boxes
            if (p >= 0.80) {
                targetRedCount = totalRedAvailable;
                activePair = 3;
            } else if (p >= 0.45) {
                targetRedCount = Math.floor(totalRedAvailable * 0.66);
                activePair = 2;
            } else if (p >= 0.15) {
                targetRedCount = Math.floor(totalRedAvailable * 0.33);
                activePair = 1;
            }

            // 1. Manage Red Particles
            redParticles.forEach((rp, i) => {
                const shouldBeVisible = i < targetRedCount;
                if (shouldBeVisible && !rp.isActive) {
                    rp.isActive = true;
                    rp.fade(0.5);
                } else if (!shouldBeVisible && rp.isActive) {
                    rp.isActive = false;
                    rp.fade(0);
                }
            });

            // 2. Manage Floating Boxes
            [1, 2, 3].forEach(pairIndex => {
                const boxes = document.querySelectorAll(`.ap-box[data-pair="${pairIndex}"]`);
                const shouldBeVisible = pairIndex <= activePair;

                boxes.forEach(box => {
                    const isVisible = box.classList.contains('visible');

                    if (shouldBeVisible && !isVisible) {
                        box.classList.add('visible');

                        // Handle mobile translation cleanly (-50% center offset)
                        const isMobile = window.innerWidth <= 768;
                        const targetTransform = isMobile ? "translateX(-50%) translateY(0)" : "translateY(0)";

                        gsap.to(box, {
                            autoAlpha: 1, // handles visibility and opacity
                            transform: targetTransform,
                            duration: 0.5,
                            ease: "power2.out"
                        });

                    } else if (!shouldBeVisible && isVisible) {
                        box.classList.remove('visible');

                        const isMobile = window.innerWidth <= 768;
                        const targetTransform = isMobile ? "translateX(-50%) translateY(20px)" : "translateY(20px)";

                        gsap.to(box, {
                            autoAlpha: 0,
                            transform: targetTransform,
                            duration: 0.3,
                            ease: "power2.in"
                        });
                    }
                });
            });
        }
    });
});
