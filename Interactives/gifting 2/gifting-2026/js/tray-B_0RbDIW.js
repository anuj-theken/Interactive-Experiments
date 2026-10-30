import { t as store } from "./store-CK1waRpq.js";
import { r as esc, s as qs, t as arrow } from "./ui-CSHVKqjF.js";
import { r as togglePick, t as mineUrl } from "./picks-BkUKK73f.js";
//#region src/assets/scripts/gifting-2026/tray.js
function initTray(data) {
	let tray = qs(".story-side-nav-pill--slots");
	if (!tray) {
		tray = document.createElement("div");
		tray.className = "story-side-nav-pill story-side-nav-pill--slots";
		tray.setAttribute("role", "region");
		tray.setAttribute("aria-label", "Your three");
		document.body.appendChild(tray);
	}
	const render = (e) => {
		const picks = store.picks();
		tray.hidden = picks.length === 0;
		const slots = Array.from({ length: 3 }, (_, i) => {
			const b = data.beliefById[picks[i]];
			if (!b) return "<div class=\"story-side-nav-pill__slot\"></div>";
			return `<div class="story-side-nav-pill__slot is-filled">“${esc(b.headline.length > 56 ? `${b.headline.slice(0, 56)}…` : b.headline)}”<button type="button" class="story-side-nav-pill__drop" data-drop="${esc(b.id)}" aria-label="Drop this belief from your three">×</button></div>`;
		}).join("");
		const cta = picks.length === 3 ? `<a class="story-side-nav-pill__cta is-ready${e && e.detail && e.detail.justFull ? " is-new" : ""} animated-arrow" href="${mineUrl(picks)}">See mine ${arrow()}</a>` : `<span class="story-side-nav-pill__cta">${3 - picks.length} to go</span>`;
		tray.innerHTML = `<span class="story-side-nav-pill__label">Your three</span>${slots}${cta}`;
	};
	tray.addEventListener("click", (e) => {
		const drop = e.target.closest("[data-drop]");
		if (drop) togglePick(data, drop.dataset.drop);
	});
	render();
	document.addEventListener("gifting:picks", render);
}
//#endregion
export { initTray as t };
