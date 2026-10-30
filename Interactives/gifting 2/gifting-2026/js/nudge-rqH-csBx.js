import { t as store } from "./store-CK1waRpq.js";
import { c as qsa, t as arrow } from "./ui-CSHVKqjF.js";
//#region src/assets/scripts/gifting-2026/nudge.js
var IDLE_MS = 60 * 1e3;
var ACTIVITY = [
	"scroll",
	"wheel",
	"pointerdown",
	"keydown",
	"touchstart"
];
var engaged = () => Boolean(store.user() || store.picks().length || store.keeps().length || store.seen().length || Object.keys(store.drafts()).length);
function pickUnseen(items, weight = () => 1) {
	const seen = store.seen();
	const fresh = items.filter((x) => !seen.includes(x.id));
	const list = fresh.length ? fresh : items;
	let r = Math.random() * list.reduce((n, x) => n + weight(x), 0);
	return list.find((x) => {
		r -= weight(x);
		return r < 0;
	}) || list[list.length - 1];
}
function initPickNudge({ page, text, sections, after, onPick }) {
	if (store.nudged(page) || engaged()) return;
	let idle = 0;
	let frame;
	let el;
	const reset = () => {
		idle = 0;
		cancelAnimationFrame(frame);
		frame = requestAnimationFrame(() => {
			const mark = qsa(sections)[after];
			if (mark && mark.getBoundingClientRect().top < window.innerHeight / 2) show();
		});
	};
	const tick = () => {
		const typing = document.activeElement && document.activeElement.matches("input, textarea, select");
		if (document.visibilityState !== "visible" || document.body.classList.contains("modal-open") || typing) return;
		idle += 1e3;
		if (idle >= IDLE_MS) show();
	};
	const timer = setInterval(tick, 1e3);
	function stop() {
		clearInterval(timer);
		cancelAnimationFrame(frame);
		ACTIVITY.forEach((type) => window.removeEventListener(type, reset));
		document.removeEventListener("gifting:store", onStore);
	}
	function onStore() {
		if (engaged()) stop();
	}
	const hide = () => {
		if (!el) return;
		const gone = el;
		el = null;
		gone.classList.remove("is-visible");
		setTimeout(() => gone.remove(), 300);
	};
	function show() {
		stop();
		if (engaged()) return;
		store.markNudged(page);
		el = document.createElement("div");
		el.className = "story-side-nav-pill story-side-nav-pill--nudge";
		el.setAttribute("role", "region");
		el.setAttribute("aria-label", "A suggestion");
		el.innerHTML = `<p class="story-side-nav-pill__text">${text}</p>
      <button type="button" class="story-side-nav-pill__cta animated-arrow" data-nudge-pick>Pick one ${arrow()}</button>
      <button type="button" class="story-side-nav-pill__close" data-nudge-close aria-label="Close">
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" stroke-width="1.5"/></svg>
      </button>`;
		document.body.appendChild(el);
		requestAnimationFrame(() => requestAnimationFrame(() => el && el.classList.add("is-visible")));
		el.addEventListener("click", (e) => {
			if (e.target.closest("[data-nudge-pick]")) {
				hide();
				onPick();
			} else if (e.target.closest("[data-nudge-close]")) hide();
		});
		document.addEventListener("gifting:store", hide, { once: true });
	}
	ACTIVITY.forEach((type) => window.addEventListener(type, reset, { passive: true }));
	document.addEventListener("gifting:store", onStore);
}
//#endregion
export { pickUnseen as n, initPickNudge as t };
