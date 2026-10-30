import { t as store } from "./store-CK1waRpq.js";
import { a as pageUrl, d as saveAnswer, n as deal, o as params, p as showError, r as esc, s as qs } from "./ui-CSHVKqjF.js";
import { a as giftTag, t as beliefCard } from "./templates-C-GvKuvd.js";
import { n as syncPicks, r as togglePick } from "./picks-BkUKK73f.js";
import { t as openBelief } from "./belief-back-D33f56YS.js";
import { t as initTray } from "./tray-B_0RbDIW.js";
import { n as syncKeeps, t as bindKeepBookmarks } from "./keeps-UoUJVwJN.js";
import { t as initShortlist } from "./shortlist-DzSUOE_v.js";
import { t as openTag } from "./tag-back-DboofxP9.js";
//#region src/assets/scripts/gifting-2026/section.js
async function initSection(loadData) {
	const host = qs("#gifting-kind");
	let data;
	try {
		data = await loadData();
	} catch (err) {
		showError(host, err);
		return;
	}
	const q = params();
	const k = data.kindById[q.get("kind")];
	if (!k) {
		host.innerHTML = `<p class="gifting-2026-crumb"><a href="${pageUrl("recommendations")}">Recommendations</a></p><p class="gifting-2026-legend">We couldn’t find that kind of gift.</p>`;
		return;
	}
	const tags = data.recommendations.tags.filter((t) => t.kind === k.id);
	const hi = tags.find((t) => t.slug === q.get("hi"));
	const beliefs = [...[...new Set(tags.map((t) => t.belief).filter(Boolean))], ...data.philosophies.beliefs.filter((b) => b.giftKinds.includes(k.id)).map((b) => b.id)].filter((id, i, a) => a.indexOf(id) === i).map((id) => data.beliefById[id]).filter(Boolean);
	const keeps = store.keeps();
	document.title = `${k.name} · Gifting 2026 | The Ken`;
	host.innerHTML = `<div class="gifting-2026-band gifting-2026-band--light">
  <p class="gifting-2026-crumb"><a href="${pageUrl("index")}">Gifting</a> / <a href="${pageUrl("recommendations")}">Recommendations</a> / ${esc(k.name)}</p>
  <header class="gifting-2026-kind-head">
    <div>
      <h1 class="gifting-2026-kind-head__title">${esc(k.name)}</h1>
      <p class="gifting-2026-kind-head__tagline">${esc(k.tagline)}</p>
    </div>
    <div class="gifting-2026-kind-head__side">
      ${k.plannedTotal} kinds of gift in this section<br>
      ${tags.length} with a reader’s story so far<br>
      No brands on the front; makers on the back<br>
      Nothing above about ₹50,000
    </div>
  </header>
  </div>
  <h2 class="visually-hidden">Gifts readers gave</h2>
  <div class="gifting-2026-tags" id="gifting-kind-tags">${tags.map((t) => {
		const html = giftTag(data, t, {
			kept: keeps.includes(t.id),
			inKind: true
		});
		return t === hi ? html.replace("lg-highlighted-excerpt-article--gift-tag", "lg-highlighted-excerpt-article--gift-tag is-highlighted") : html;
	}).join("")}</div>
  <div class="gifting-2026-kind-foot">
    <section aria-labelledby="gifting-kind-beliefs">
      <h2 class="gifting-2026-belief-body__h" id="gifting-kind-beliefs">Beliefs behind these gifts</h2>
      ${beliefs.length ? `<div class="gifting-2026-belief-body__row" id="gifting-kind-beliefs-row">${beliefs.map((b) => beliefCard(data, b, { size: "sm" })).join("")}</div>` : "<p class=\"gifting-2026-belief-body__none\">None mapped yet.</p>"}
    </section>
    <section aria-labelledby="gifting-missed">
      <h2 class="gifting-2026-belief-body__h" id="gifting-missed">Tell us one we’ve missed</h2>
      <form class="signup-nudge__form signup-nudge__form--question" id="gifting-missed-form" novalidate>
        <div class="signup-nudge__email-group">
          <label class="visually-hidden" for="gifting-missed-input">A gift for ${esc(k.name)}</label>
          <input class="signup-nudge__email-input" id="gifting-missed-input" type="text" autocomplete="off" placeholder="The gift, who it was for, and why it worked…" />
          <button class="signup-nudge__signup-btn" type="submit">Send</button>
        </div>
      </form>
      <p class="gifting-2026-legend">One per kind of gift: a new one replaces the one you sent before.</p>
    </section>
  </div>`;
	syncKeeps();
	initTray(data);
	initShortlist();
	syncPicks();
	deal();
	const keepClick = bindKeepBookmarks(host);
	host.addEventListener("click", (e) => {
		if (keepClick(e)) return;
		const card = e.target.closest("[data-belief]");
		if (card) {
			e.preventDefault();
			if (e.target.closest(".bookmark-icon-container")) {
				e.stopPropagation();
				togglePick(data, card.dataset.belief);
			} else openBelief(data, card.dataset.belief);
			return;
		}
		const tag = e.target.closest("[data-tag]");
		if (tag && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
			e.preventDefault();
			openTag(data, tag.dataset.tag, tags.map((t) => t.id));
		}
	});
	host.addEventListener("keydown", (e) => {
		const bookmark = e.target.closest("[data-belief] .bookmark-icon-container");
		if (bookmark && (e.key === "Enter" || e.key === " ")) {
			e.preventDefault();
			e.stopPropagation();
			togglePick(data, bookmark.closest("[data-belief]").dataset.belief);
		}
	});
	qs("#gifting-missed-form").addEventListener("submit", (e) => {
		e.preventDefault();
		const input = qs("#gifting-missed-input");
		const v = input.value.trim();
		if (!v) return;
		saveAnswer(`missed:${k.id}`, `A gift for ${k.name}`, v, "text");
		input.value = "";
	});
	if (hi) setTimeout(() => qs(`[data-tag="${hi.id}"]`)?.scrollIntoView({
		behavior: "smooth",
		block: "center"
	}), 400);
}
//#endregion
export { initSection as t };
