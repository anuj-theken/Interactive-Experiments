import { t as loadData } from "./data-DekMyr86.js";
import { t as store } from "./store-CK1waRpq.js";
import { c as qsa, o as params } from "./ui-CSHVKqjF.js";
import { t as budgetVerdict } from "./philosophies-veSXO3JT.js";
//#region src/assets/scripts/gifting-2026/paper-inputs.js
var TAGS = [
	"gifting-who",
	"gifting-missed-input",
	"gifting-how"
];
var UNCREDITED = ["gifting-who"];
var MAX_LINES = 3;
var kindOf = (input) => input.type === "number" ? "sticker" : TAGS.includes(input.id) ? "tag" : "card";
var curl = (s) => s.replace(/(^|[\s([{—–-])"/g, "$1“").replace(/"/g, "”");
function grow(ta) {
	if (!ta.offsetParent) {
		ta.style.height = "";
		return;
	}
	const lh = parseFloat(getComputedStyle(ta).lineHeight) || 28;
	ta.style.height = "auto";
	const h = Math.min(ta.scrollHeight, lh * MAX_LINES);
	ta.style.height = `${h}px`;
	ta.style.overflowY = ta.scrollHeight > lh * MAX_LINES + 1 ? "auto" : "hidden";
}
function toTextarea(input) {
	const ta = document.createElement("textarea");
	Array.from(input.attributes).forEach((a) => {
		if (a.name !== "type" && a.name !== "value") ta.setAttribute(a.name, a.value);
	});
	ta.rows = 1;
	ta.value = input.value;
	ta.addEventListener("keydown", (e) => {
		if (e.key === "Enter" && !e.isComposing) {
			e.preventDefault();
			ta.form.requestSubmit();
		}
	});
	ta.addEventListener("focus", () => grow(ta));
	ta.addEventListener("input", () => {
		const { selectionStart, selectionEnd } = ta;
		const next = curl(ta.value.replace(/\s*\n\s*/g, " "));
		if (next !== ta.value) {
			ta.value = next;
			ta.setSelectionRange(selectionStart, selectionEnd);
		}
		grow(ta);
	});
	input.replaceWith(ta);
	requestAnimationFrame(() => grow(ta));
	return ta;
}
function credit() {
	const initial = store.initial();
	return `— ${initial ? `${initial}.` : "You"}, ${(/* @__PURE__ */ new Date()).getFullYear()}`;
}
function upgrade(form) {
	const input = form.querySelector("input.signup-nudge__email-input");
	if (!input || form.classList.contains("gifting-2026-paper")) return;
	const kind = kindOf(input);
	const group = form.querySelector(".signup-nudge__email-group");
	const button = form.querySelector(".signup-nudge__signup-btn");
	form.classList.add("gifting-2026-paper", `gifting-2026-paper--${kind}`);
	if (kind === "sticker") {
		input.placeholder = "3,000";
		const result = form.parentElement.querySelector(".gifting-2026-ask__result");
		input.addEventListener("input", () => {
			const v = Number(input.value);
			loadData().then((data) => {
				if (result) result.textContent = v ? budgetVerdict(v, data.charts.budget.give) : "";
			});
		});
		return;
	}
	const field = toTextarea(input);
	if (button && button.textContent.trim() === "Add") button.textContent = "Add mine";
	if (!UNCREDITED.includes(field.id)) {
		const by = document.createElement("p");
		by.className = "gifting-2026-paper__credit";
		by.textContent = credit();
		group.insertBefore(by, button);
	}
	const stamp = document.createElement("span");
	stamp.className = "live-poll-ticker live-poll-ticker--stamp gifting-2026-paper__noted";
	stamp.setAttribute("aria-hidden", "true");
	stamp.textContent = "Noted";
	group.appendChild(stamp);
	field.addEventListener("input", () => form.classList.remove("is-noted"));
}
function onSubmit(e) {
	const form = e.target;
	if (!form.classList || !form.classList.contains("gifting-2026-paper") || form.classList.contains("gifting-2026-paper--sticker")) return;
	const field = form.querySelector("textarea");
	if (!field || !field.value.trim()) return;
	form.classList.remove("is-noted");
	requestAnimationFrame(() => {
		form.classList.add("is-noted");
		grow(field);
	});
}
function initPaperInputs(on) {
	const ask = params().get("inputs");
	if (ask === "plain" || !on && ask !== "paper") return;
	document.body.classList.add("gifting-2026-paper-inputs");
	const scan = (root) => qsa("form.signup-nudge__form--question", root).forEach(upgrade);
	scan(document);
	new MutationObserver((records) => records.forEach((r) => r.addedNodes.forEach((n) => {
		const root = n.nodeType === 1 && (n.matches("form") ? n.parentElement : n);
		if (root) scan(root);
	}))).observe(document.body, {
		childList: true,
		subtree: true
	});
	document.addEventListener("submit", onSubmit, true);
}
//#endregion
export { initPaperInputs as t };
