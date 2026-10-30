import { r as __toESM } from "./rolldown-runtime-BTb0hoZ5.js";
import { t as require_throttle } from "./vendor-qadh9zQP.js";
import { t as wp } from "./config-DBYw5SRk.js";
import { t as store } from "./store-CK1waRpq.js";
//#region src/assets/scripts/gifting-2026/ui.js
var import_throttle = /* @__PURE__ */ __toESM(require_throttle());
var esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
var arrow = (dir = "right") => `<svg class="arrow-animated${dir === "right" ? "" : ` arrow-animated--${dir}`}"width="10" height="12" viewBox="0 0 10 12" fill="none" aria-hidden="true"><path d="M5 2L9 6L5 10" stroke="currentColor"/><rect y="5.5" width="9" height="1.125" fill="currentColor"/></svg>`;
var qs = (sel, root = document) => root.querySelector(sel);
var qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
var params = () => new URLSearchParams(window.location.search);
function pageUrl(page, query = "") {
	const base = wp ? wp.baseUrl || "./" : "./";
	if (!wp && !document.body.hasAttribute("data-gifting-views")) return `./${page}.html${query ? `?${query}` : ""}`;
	if (page === "index") return query ? `${base}?${query}` : base;
	return `${base}?view=${page}${query ? `&${query}` : ""}`;
}
var seed = Number(params().get("seed")) || Date.now() % 1e5 || 1;
function rnd() {
	seed = seed * 16807 % 2147483647;
	return (seed - 1) / 2147483646;
}
function shuffle(list) {
	const a = list.slice();
	for (let i = a.length - 1; i > 0; i -= 1) {
		const j = Math.floor(rnd() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}
function trackNavHeight() {
	const nav = qs("nav.navbar");
	if (!nav) return;
	const set = () => document.documentElement.style.setProperty("--gifting-nav-h", `${nav.offsetHeight}px`);
	set();
	if ("ResizeObserver" in window) new ResizeObserver(set).observe(nav);
	window.addEventListener("resize", (0, import_throttle.default)(set, 200));
	window.addEventListener("scroll", (0, import_throttle.default)(set, 300));
}
function setBookmark(el, on) {
	if (!el) return;
	clearTimeout(el._giftingTimer);
	el.setAttribute("aria-pressed", on ? "true" : "false");
	if (!on) {
		el.classList.remove("bookmarked", "checked", "added");
		return;
	}
	if (el.classList.contains("bookmarked")) return;
	el.classList.add("bookmarked", "checked");
	el._giftingTimer = setTimeout(() => {
		el.classList.remove("checked");
		el.classList.add("added");
	}, 2e3);
}
var toastTimer;
function toast(message, link) {
	let el = qs(".toast-link-copied--fixed");
	if (!el) {
		el = document.createElement("div");
		el.className = "toast-link-copied toast-link-copied--fixed";
		el.setAttribute("role", "status");
		document.body.appendChild(el);
	}
	el.textContent = message;
	if (link) {
		const a = document.createElement("a");
		a.href = link.href;
		a.textContent = link.label;
		el.append(" ", a);
	}
	el.classList.add("is-visible");
	clearTimeout(toastTimer);
	toastTimer = setTimeout(() => el.classList.remove("is-visible"), link ? 4500 : 2600);
}
function saveAnswer(key, label, value, kind) {
	const result = store.addDraft(key, label, value, kind);
	if (result === "saved") toast(kind === "text" ? "Saved. It’s with the editor now." : "Counted.");
	else toast(kind === "text" ? "Kept as a draft in this browser. Confirm your email to send it." : "Noted. It counts once you confirm your email.");
	return result;
}
function initDraftsPill() {
	let pill = qs(".story-side-nav-pill--drafts");
	if (!pill) {
		pill = document.createElement("button");
		pill.type = "button";
		pill.className = "story-side-nav-pill story-side-nav-pill--drafts";
		pill.hidden = true;
		document.body.appendChild(pill);
		pill.addEventListener("click", () => document.dispatchEvent(new CustomEvent("gifting:open-answers")));
	}
	const render = () => {
		const user = store.user();
		const n = Object.keys(store.drafts()).length;
		pill.classList.toggle("is-signed-in", !!user);
		if (user) {
			pill.classList.remove("animated-arrow");
			pill.textContent = `Signed in as ${user.replace(/^(.).*(@.*)$/, "$1•••$2")}`;
			pill.hidden = false;
		} else if (n) {
			pill.classList.add("animated-arrow");
			pill.innerHTML = `${n} ${n === 1 ? "answer" : "answers"} waiting ${arrow()}`;
			pill.hidden = false;
		} else pill.hidden = true;
	};
	render();
	document.addEventListener("gifting:store", render);
	window.addEventListener("storage", render);
}
function revealInStrip(link) {
	const strip = link && link.parentElement;
	if (!strip || strip.scrollWidth <= strip.clientWidth) return;
	const left = link.offsetLeft - strip.offsetLeft;
	if (left < strip.scrollLeft || left + link.offsetWidth > strip.scrollLeft + strip.clientWidth - 48) strip.scrollTo({
		left: Math.max(0, left - 16),
		behavior: "smooth"
	});
}
function deal() {
	document.body.classList.remove("gifting-2026-is-dealt");
	requestAnimationFrame(() => requestAnimationFrame(() => {
		document.body.classList.add("gifting-2026-is-dealt");
		document.dispatchEvent(new CustomEvent("gifting:dealt"));
	}));
}
function showError(container, error) {
	console.error(error);
	if (container) container.innerHTML = "<p class=\"gifting-2026-legend\">The guide didn’t load. Refresh the page to try again.</p>";
}
//#endregion
export { pageUrl as a, qsa as c, saveAnswer as d, setBookmark as f, trackNavHeight as g, toast as h, initDraftsPill as i, revealInStrip as l, shuffle as m, deal as n, params as o, showError as p, esc as r, qs as s, arrow as t, rnd as u };
