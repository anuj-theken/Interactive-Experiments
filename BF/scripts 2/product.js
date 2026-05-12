gsap.registerPlugin(ScrollTrigger);

const TOTAL = 6;
const wrapper = document.getElementById('scene-wrapper');
let lastActive = -1;

function els(cat) {
  return {
    box:   document.querySelector(`.box-placeholder[data-cat="${cat}"]`),
    img:   document.querySelector(`.spread-img[data-cat="${cat}"]`),
    title: document.querySelector(`.spread-title[data-cat="${cat}"]`),
    items: document.querySelectorAll(`.scatter-item[data-cat="${cat}"]`),
  };
}

function toInactive(cat) {
  const e = els(cat);
  if (!e.box) return;
  gsap.killTweensOf([e.box, e.img, e.title, ...e.items]);
  gsap.to(e.box,   { opacity: 1, duration: 0.4, overwrite: true });
  gsap.to(e.img,   { opacity: 0, duration: 0.3, overwrite: true });
  gsap.to(e.title, { opacity: 0, y: -10, duration: 0.3, overwrite: true });
  gsap.to(e.items, { opacity: 0, y: -10, duration: 0.2, overwrite: true });
}

function toActive(cat) {
  const e = els(cat);
  if (!e.box) return;
  const isMobile = window.innerWidth <= 800;

  gsap.killTweensOf([e.box, e.img, e.title, ...e.items]);

  // Main Image
  gsap.to(e.box, { opacity: 0, duration: 0.4 });
  gsap.to(e.img, { opacity: 1, duration: 0.5 });

  // Title: Ensuring it animates from top to bottom
  gsap.fromTo(e.title,
    { opacity: 0, y: -15 },
    { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", overwrite: true }
  );

  // Items: Top to Bottom Stagger
  e.items.forEach((item, i) => {
    // On mobile, we use a fixed vertical gap for each item
    const mobileOffset = isMobile ? (i * 28) : 0;

    gsap.fromTo(item,
      { opacity: 0, y: -20 + mobileOffset },
      {
        opacity: 1,
        y: mobileOffset,
        duration: 0.4,
        delay: 0.1 + (i * 0.05),
        ease: "power2.out",
        overwrite: true
      }
    );
  });
}

function toPast(cat) {
  const e = els(cat);
  if (!e.box) return;
  const isMobile = window.innerWidth <= 800;

  gsap.killTweensOf([e.box, e.img, e.title, ...e.items]);

  // On mobile, we hide the text completely to prevent stacking/overlaps
  gsap.to(e.img, { opacity: 0.1, duration: 0.5 });
  gsap.to(e.title, { opacity: isMobile ? 0 : 0.1, duration: 0.4 });
  gsap.to(e.items, { opacity: 0, duration: 0.3 });
}

ScrollTrigger.create({
  trigger: wrapper,
  start: 'top top',
  end: 'bottom bottom',
  onUpdate: (self) => {
    const p = self.progress;
    const seg = 1 / TOTAL;
    const newActive = p < 0.01 ? -1 : Math.min(Math.floor(p / seg), TOTAL - 1);

    if (newActive !== lastActive) {
      lastActive = newActive;
      for (let i = 1; i <= TOTAL; i++) {
        const idx = i - 1;
        if (newActive === -1) toInactive(i);
        else if (idx < newActive) toPast(i);
        else if (idx === newActive) toActive(i);
        else toInactive(i);
      }
    }
  }
});

// Intro for center header
gsap.from('#center-header', {
  y: 30, opacity: 0, duration: 1.2, ease: 'power3.out',
  scrollTrigger: { trigger: '#finance-section', start: 'top 80%' }
});

window.addEventListener('resize', () => ScrollTrigger.refresh());
