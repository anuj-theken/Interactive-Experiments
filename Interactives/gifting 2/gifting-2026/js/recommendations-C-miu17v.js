import { t as store } from "./store-CK1waRpq.js";
import { c as qsa, d as saveAnswer, l as revealInStrip, m as shuffle, n as deal, p as showError, r as esc, s as qs, t as arrow } from "./ui-CSHVKqjF.js";
import { n as carouselNav, t as bindCarousels } from "./carousel-CNnVmENl.js";
import { a as giftTag, o as kindUrl } from "./templates-C-GvKuvd.js";
import { n as pickUnseen, t as initPickNudge } from "./nudge-rqH-csBx.js";
import { n as syncKeeps, t as bindKeepBookmarks } from "./keeps-UoUJVwJN.js";
import { t as initShortlist } from "./shortlist-DzSUOE_v.js";
import { t as openTag } from "./tag-back-DboofxP9.js";
//#region src/assets/scripts/gifting-2026/recommendations.js
var DARK_PAPER = "#201111";
var data;
var forThem = [];
var band = null;
var io;
var order = {};
var inBand = (t) => band === null || t.price.min <= band && band <= t.price.max;
var tagsOf = (k) => data.recommendations.tags.filter((t) => t.kind === k.id && !t.pageOnly && inBand(t));
var shownKinds = () => data.recommendations.kinds.filter((k) => tagsOf(k).length);
function rowHtml(k, paper) {
	const tags = shuffle(tagsOf(k)).slice(0, 5);
	order[k.id] = tags.map((t) => t.id);
	const keeps = store.keeps();
	return `<section class="gifting-2026-kind" id="${k.id}" aria-labelledby="h-${k.id}">
    <div class="container">
      <div class="section-divider">
        <div class="section-heading-container">
          <h2 class="section-heading-title" id="h-${k.id}">${esc(k.name)}</h2>
          <div class="divider-double-line"></div>
        </div>
      </div>
      <div class="gifting-2026-kind__meta">
        <p class="gifting-2026-kind__tagline">${esc(k.tagline)}</p>
        <a class="gifting-2026-kind__more animated-arrow" href="${kindUrl(k.id)}">More on ${esc(k.name)} ${arrow()}</a>
      </div>
    </div>
    <div class="container">${carouselNav(tags.length)}</div>
    <div class="sm-image-article-carousel-section sm-image-article-carousel-section--on-string">
      <div class="sm-image-article-carousel-container" data-carousel>${tags.map((t) => giftTag(data, t, {
		kept: keeps.includes(t.id),
		forThem: forThem.includes(t.id),
		paper,
		inKind: true
	})).join("")}</div>
    </div>
  </section>`;
}
function render() {
	const kinds = shownKinds();
	qs("#gifting-kinds").innerHTML = kinds.filter((k) => !k.setApart).map((k) => rowHtml(k)).join("") || "<p class=\"container gifting-2026-legend\">No gifts at this budget yet.</p>";
	const apart = kinds.filter((k) => k.setApart);
	qs("#gifting-apart").innerHTML = apart.length ? `<section class="nudge-band-container nudge-band-container--section" aria-labelledby="gifting-apart-heading">
      <div class="container"><p class="nudge-band-container__heading" id="gifting-apart-heading">Two more, set apart: one is a person, the other is not buying</p></div>
      ${apart.map((k) => rowHtml(k, DARK_PAPER)).join("")}
    </section>` : "";
	syncKeeps();
	deal();
}
function renderIndex() {
	qs("#gifting-index-links").innerHTML = shownKinds().map((k) => `<a href="#${k.id}"><small>${k.number}</small>${esc(k.name)}</a>`).join("");
	const links = qsa("#gifting-index-links a");
	if (!("IntersectionObserver" in window)) return;
	if (io) io.disconnect();
	io = new IntersectionObserver((entries) => {
		entries.forEach((e) => {
			if (!e.isIntersecting) return;
			links.forEach((a) => a.classList.toggle("is-current", a.getAttribute("href") === `#${e.target.id}`));
			revealInStrip(links.find((a) => a.classList.contains("is-current")));
		});
	}, { rootMargin: "-40% 0px -55% 0px" });
	qsa(".gifting-2026-kind").forEach((s) => io.observe(s));
}
function onBudget(e) {
	const btn = e.target.closest("[data-band]");
	if (!btn) return;
	band = btn.dataset.band === "" ? null : Number(btn.dataset.band);
	qsa("[data-band]").forEach((b) => {
		const on = b === btn;
		b.classList.toggle("is-selected", on);
		b.setAttribute("aria-pressed", on ? "true" : "false");
	});
	render();
	renderIndex();
	const n = shownKinds().reduce((sum, k) => sum + order[k.id].length, 0);
	qs("#gifting-budget-status").textContent = band === null ? "" : `${n} ${n === 1 ? "gift" : "gifts"} in ${shownKinds().length} kinds`;
}
function drawOne() {
	const pool = data.recommendations.tags.filter((t) => !t.pageOnly && inBand(t));
	const t = pickUnseen(pool.length ? pool : data.recommendations.tags.filter((x) => !x.pageOnly), (x) => 1 + x.quotes.length);
	openTag(data, t.id, order[t.kind]);
}
function onHero(e) {
	e.preventDefault();
	const raw = qs("#gifting-who").value.trim();
	if (raw) saveAnswer("hero:recommendations", "Your hardest person to buy for", raw, "text");
	const words = raw.toLowerCase().split(/[^a-z-]+/).filter((w) => w.length > 2);
	forThem = data.recommendations.tags.filter((t) => !t.pageOnly && t.givenTo.some((g) => words.some((w) => g === w || g.startsWith(w) || w.startsWith(g)))).map((t) => t.id);
	render();
	renderIndex();
	qs("#gifting-hero-status").innerHTML = !raw ? "" : forThem.length ? `Marked ${forThem.length} gifts readers gave to someone like that ${arrow("down")}` : `Nobody has written about them yet. Have a look anyway ${arrow("down")}`;
	setTimeout(() => qs("#intro").scrollIntoView({ behavior: "smooth" }), 700);
}
async function initRecommendations(loadData) {
	const host = qs("#gifting-kinds");
	try {
		data = await loadData();
	} catch (err) {
		showError(host, err);
		return;
	}
	render();
	renderIndex();
	initShortlist();
	const page = qs("#gifting-rows");
	bindCarousels(page);
	const keepClick = bindKeepBookmarks(page);
	page.addEventListener("click", (e) => {
		if (keepClick(e)) return;
		const tag = e.target.closest("[data-tag]");
		if (tag && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
			e.preventDefault();
			const t = data.tagById[tag.dataset.tag];
			openTag(data, t.id, order[t.kind]);
		}
	});
	qs("#gifting-hero-form").addEventListener("submit", onHero);
	qs("[data-skip]").addEventListener("click", () => qs("#intro").scrollIntoView({ behavior: "smooth" }));
	qs("[data-budget]").addEventListener("click", onBudget);
	qs("[data-draw]")?.addEventListener("click", drawOne);
	initPickNudge({
		page: "recommendations",
		text: "<b>Not sure where to start?</b>Let us pick a gift for you.",
		sections: ".gifting-2026-kind",
		after: 4,
		onPick: drawOne
	});
}
//#endregion
export { initRecommendations as t };
