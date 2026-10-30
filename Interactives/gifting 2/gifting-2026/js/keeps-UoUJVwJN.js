import { t as store } from "./store-CK1waRpq.js";
import { a as pageUrl, c as qsa, f as setBookmark, h as toast } from "./ui-CSHVKqjF.js";
//#region src/assets/scripts/gifting-2026/keeps.js
function toggleKeep(id) {
	const on = store.toggleKeep(id);
	const onKeptPage = document.body.dataset.gifting === "kept";
	toast(on ? "Kept. It’s on your shortlist." : "Removed from your shortlist.", on && !onKeptPage ? {
		href: pageUrl("kept"),
		label: "See it"
	} : void 0);
	syncKeeps();
	return on;
}
function syncKeeps() {
	const keeps = store.keeps();
	qsa("[data-tag]").forEach((tag) => {
		const on = keeps.includes(tag.dataset.tag);
		setBookmark(tag.querySelector(".bookmark-icon-container"), on);
	});
	qsa("[data-keep-button]").forEach((btn) => {
		const on = keeps.includes(btn.dataset.keepButton);
		btn.textContent = on ? "Kept" : "Keep";
		btn.classList.toggle("btn-primary", on);
		btn.classList.toggle("btn-secondary", !on);
		btn.setAttribute("aria-pressed", on ? "true" : "false");
	});
	qsa("[data-kept-count]").forEach((el) => {
		el.textContent = `Shortlist (${keeps.length})`;
		el.classList.toggle("is-filled", keeps.length > 0);
		el.hidden = keeps.length === 0;
	});
}
function bindKeepBookmarks(root) {
	const handle = (e) => {
		const bookmark = e.target.closest(".bookmark-icon-container");
		const tag = e.target.closest("[data-tag]");
		if (!bookmark || !tag) return false;
		e.preventDefault();
		e.stopPropagation();
		toggleKeep(tag.dataset.tag);
		return true;
	};
	root.addEventListener("keydown", (e) => {
		if (e.key === "Enter" || e.key === " ") handle(e);
	});
	return handle;
}
//#endregion
export { syncKeeps as n, toggleKeep as r, bindKeepBookmarks as t };
