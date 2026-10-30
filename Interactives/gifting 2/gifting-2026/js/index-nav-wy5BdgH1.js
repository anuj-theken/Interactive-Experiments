//#region src/assets/scripts/gifting-2026/index-nav.js
var PICK = "[data-index-pick]";
function initIndexNav() {
	const pick = document.querySelector(PICK);
	if (!pick) return;
	const trigger = pick.querySelector("[data-index-trigger]");
	const label = pick.querySelector("[data-index-trigger-label]");
	const list = pick.querySelector("#gifting-index-links");
	const links = () => Array.from(list.querySelectorAll("a"));
	const open = (on, focusBack) => {
		pick.classList.toggle("is-open", on);
		trigger.setAttribute("aria-expanded", on ? "true" : "false");
		if (on) (list.querySelector("a.is-current") || links()[0])?.focus({ preventScroll: true });
		else if (focusBack) trigger.focus({ preventScroll: true });
	};
	const syncLabel = () => {
		const current = list.querySelector("a.is-current") || links()[0];
		if (current) label.textContent = current.lastChild.textContent.trim();
	};
	new MutationObserver(syncLabel).observe(list, {
		subtree: true,
		childList: true,
		attributes: true,
		attributeFilter: ["class"]
	});
	syncLabel();
	trigger.addEventListener("click", () => open(!pick.classList.contains("is-open")));
	list.addEventListener("click", (e) => {
		if (e.target.closest("a")) open(false);
	});
	document.addEventListener("click", (e) => {
		if (pick.classList.contains("is-open") && !pick.contains(e.target)) open(false);
	});
	pick.addEventListener("keydown", (e) => {
		if (!pick.classList.contains("is-open")) return;
		const all = links();
		const i = all.indexOf(document.activeElement);
		if (e.key === "Escape") {
			e.preventDefault();
			open(false, true);
		} else if (e.key === "ArrowDown") {
			e.preventDefault();
			all[Math.min(all.length - 1, i + 1)].focus();
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			all[Math.max(0, i - 1)].focus();
		}
	});
}
//#endregion
export { initIndexNav as t };
