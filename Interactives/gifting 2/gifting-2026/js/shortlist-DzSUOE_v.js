import { t as store } from "./store-CK1waRpq.js";
import { a as pageUrl, t as arrow } from "./ui-CSHVKqjF.js";
//#region src/assets/scripts/gifting-2026/shortlist.js
var pill;
var shown = 0;
function dock() {
	if (!pill) return;
	const tray = document.querySelector(".story-side-nav-pill--slots");
	const inTray = !!(tray && !tray.hidden && !pill.hidden);
	if (inTray && pill.parentElement !== tray) tray.appendChild(pill);
	if (!inTray && pill.parentElement !== document.body) document.body.appendChild(pill);
	pill.classList.toggle("is-docked", inTray);
	document.body.classList.toggle("gifting-2026-has-shortlist", !pill.hidden && !inTray);
}
function render() {
	const n = store.keeps().length;
	pill.hidden = n === 0;
	pill.innerHTML = `<span class="story-side-nav-pill__meta">
      <span class="story-side-nav-pill__label"><span class="story-side-nav-pill__your">Your </span>shortlist</span>
      <span class="story-side-nav-pill__count"><b>${n}</b> ${n === 1 ? "gift" : "gifts"}</span>
    </span>
    <span class="story-side-nav-pill__cta">Open ${arrow()}</span>`;
	if (n > shown) {
		const cls = shown === 0 ? "is-arriving" : "is-new";
		pill.classList.remove("is-arriving", "is-new");
		pill.offsetWidth;
		pill.classList.add(cls);
	}
	shown = n;
	dock();
}
function initShortlist() {
	if (!pill) {
		pill = document.createElement("a");
		pill.href = pageUrl("kept");
		pill.className = "story-side-nav-pill story-side-nav-pill--shortlist animated-arrow";
		pill.hidden = true;
		document.body.appendChild(pill);
		pill.addEventListener("animationend", () => pill.classList.remove("is-arriving", "is-new"));
		document.addEventListener("gifting:store", (e) => {
			if (e.detail && e.detail.key === "gk26_keeps") render();
		});
		document.addEventListener("gifting:picks", dock);
		window.addEventListener("storage", render);
	}
	shown = store.keeps().length;
	render();
}
//#endregion
export { initShortlist as t };
