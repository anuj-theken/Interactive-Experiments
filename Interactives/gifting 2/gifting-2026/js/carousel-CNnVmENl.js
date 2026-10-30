import { c as qsa, t as arrow } from "./ui-CSHVKqjF.js";
//#region src/assets/scripts/gifting-2026/carousel.js
var carouselNav = (n) => `<div class="gifting-2026-carousel-nav" data-carousel-nav>
  <span class="gifting-2026-carousel-nav__count" aria-live="polite"><b>1</b> / ${n}</span>
  <button type="button" class="animated-arrow" data-carousel-step="-1" aria-label="Previous card">${arrow("left")}</button>
  <button type="button" class="animated-arrow" data-carousel-step="1" aria-label="Next card">${arrow()}</button>
</div>`;
var scrollerOf = (row) => row.scrollWidth > row.clientWidth + 1 ? row : row.parentElement;
function current(row) {
	const scroller = scrollerOf(row);
	const mid = scroller.getBoundingClientRect().left + scroller.clientWidth / 2;
	const cards = Array.from(row.children);
	let best = 0;
	let dist = Infinity;
	cards.forEach((c, i) => {
		const r = c.getBoundingClientRect();
		const d = Math.abs(r.left + r.width / 2 - mid);
		if (d < dist) {
			dist = d;
			best = i;
		}
	});
	return best;
}
function sync(nav, row) {
	const i = current(row);
	const n = row.children.length;
	nav.querySelector("b").textContent = i + 1;
	nav.querySelector("[data-carousel-step=\"-1\"]").disabled = i === 0;
	nav.querySelector("[data-carousel-step=\"1\"]").disabled = i === n - 1;
}
function bindCarousels(root) {
	const pair = (el) => {
		const section = el.closest("section");
		return section ? [section.querySelector("[data-carousel-nav]"), section.querySelector("[data-carousel]")] : [];
	};
	root.addEventListener("click", (e) => {
		const step = e.target.closest("[data-carousel-step]");
		if (!step) return;
		const [nav, row] = pair(step);
		if (!row) return;
		row.children[Math.min(row.children.length - 1, Math.max(0, current(row) + Number(step.dataset.carouselStep)))].scrollIntoView({
			behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
			block: "nearest",
			inline: "center"
		});
		setTimeout(() => sync(nav, row), 350);
	});
	let frame;
	root.addEventListener("scroll", (e) => {
		const row = e.target.closest && (e.target.matches("[data-carousel]") ? e.target : e.target.querySelector(":scope > [data-carousel]"));
		if (!row) return;
		cancelAnimationFrame(frame);
		frame = requestAnimationFrame(() => {
			const [nav] = pair(row);
			if (nav) sync(nav, row);
		});
	}, true);
	const syncAll = () => qsa("[data-carousel-nav]", root).forEach((nav) => {
		const [, row] = pair(nav);
		if (row) sync(nav, row);
	});
	syncAll();
	document.addEventListener("gifting:dealt", syncAll);
}
//#endregion
export { carouselNav as n, bindCarousels as t };
