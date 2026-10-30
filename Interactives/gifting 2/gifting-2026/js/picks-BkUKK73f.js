import { t as store } from "./store-CK1waRpq.js";
import { a as pageUrl, c as qsa, d as saveAnswer, f as setBookmark, h as toast, t as arrow } from "./ui-CSHVKqjF.js";
//#region src/assets/scripts/gifting-2026/picks.js
var mineUrl = (picks = store.picks()) => pageUrl("mine", `b=${picks.map(encodeURIComponent).join(",")}${store.initial() ? `&by=${store.initial()}` : ""}`);
function togglePick(data, id) {
	const result = store.togglePick(id);
	if (result === "full") {
		toast("That’s three. Drop one from the tray to add this.");
		return result;
	}
	if (result === "added") {
		const b = data.beliefById[id];
		saveAnswer(`plus:${id}`, `+1 on “${b.headline.slice(0, 60)}${b.headline.length > 60 ? "…" : ""}”`, 1, "tap");
		const n = store.picks().length;
		if (n === 1) toast("1 of 3. Your three +1s become a gifting philosophy you can share.");
		if (n === 3) toast("That’s your three. See them together in the tray.");
	}
	syncPicks({ justFull: result === "added" && store.picks().length === 3 });
	return result;
}
function syncPicks({ justFull = false } = {}) {
	const picks = store.picks();
	qsa("[data-belief]").forEach((card) => {
		const on = picks.includes(card.dataset.belief);
		card.classList.toggle("is-picked", on);
		setBookmark(card.querySelector(".bookmark-icon-container"), on);
	});
	qsa(".gifting-2026-marks i").forEach((mark, i) => mark.classList.toggle("is-used", i < picks.length));
	qsa("[data-pick-button]").forEach((btn) => {
		const on = picks.includes(btn.dataset.pickButton);
		btn.textContent = on ? "You believe this" : "I believe this too";
		btn.classList.toggle("btn-primary", on);
		btn.classList.toggle("btn-secondary", !on);
		btn.setAttribute("aria-pressed", on ? "true" : "false");
	});
	qsa("[data-picks-left]").forEach((el) => {
		if (picks.length === 3) {
			el.innerHTML = `<a class="animated-arrow" href="${mineUrl(picks)}">That’s three. See your gifting philosophy ${arrow()}</a>`;
			return;
		}
		el.textContent = `${3 - picks.length} of 3 left.${store.user() ? "" : " Counts once you confirm your email."}`;
	});
	document.dispatchEvent(new CustomEvent("gifting:picks", { detail: { justFull } }));
}
//#endregion
export { syncPicks as n, togglePick as r, mineUrl as t };
