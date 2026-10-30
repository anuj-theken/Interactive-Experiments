import { a as pageUrl, d as saveAnswer, o as params, p as showError, r as esc, s as qs, t as arrow } from "./ui-CSHVKqjF.js";
import { a as giftTag, i as formatCredit, o as kindUrl, r as chart, s as quote, t as beliefCard } from "./templates-C-GvKuvd.js";
import { n as syncPicks, r as togglePick } from "./picks-BkUKK73f.js";
import { t as openBelief } from "./belief-back-D33f56YS.js";
import { t as initTray } from "./tray-B_0RbDIW.js";
import { n as syncKeeps, t as bindKeepBookmarks } from "./keeps-UoUJVwJN.js";
import { t as initShortlist } from "./shortlist-DzSUOE_v.js";
//#region src/assets/scripts/gifting-2026/belief.js
function render(data, b) {
	const s = data.sectionById[b.section];
	const seen = /* @__PURE__ */ new Set();
	const words = [...b.quotes, ...b.moreQuotes || []].filter((q) => {
		const k = q.text.toLowerCase().replace(/[^a-z]/g, "").slice(0, 30);
		if (seen.has(k)) return false;
		seen.add(k);
		return true;
	});
	const tags = data.tagsForBelief(b.id);
	const kinds = b.giftKinds.map((k) => data.kindById[k]).filter(Boolean);
	const more = data.beliefsInSection(b.section).filter((x) => x.id !== b.id).slice(0, 4);
	const count = b.opposing ? `${b.readers} vs ${b.opposing.readers}` : b.readers;
	document.title = `“${b.headline.slice(0, 60)}${b.headline.length > 60 ? "…" : ""}” · Gifting 2026 | The Ken`;
	return `<div class="gifting-2026-band gifting-2026-band--dark">
  <p class="gifting-2026-crumb"><a href="${pageUrl("index")}">Gifting</a> / <a href="${pageUrl("philosophies")}">Philosophies</a> / ${esc(s.name)}</p>
  <header class="gifting-2026-belief-head">
    <div>
      <h1 class="gifting-2026-belief-head__quote">“${esc(b.headline)}”</h1>
      <p class="blockquote-source">${esc(formatCredit(b.credit))}</p>
    </div>
    <div class="gifting-2026-belief-head__side">
      <span class="gifting-2026-stamp">${count}</span>
      readers believe some version of this.
      ${chart(data, b)}
      <button type="button" class="btn btn-secondary" data-pick-button="${esc(b.id)}" aria-pressed="false">I believe this too</button>
      <p class="blockquote-source" data-picks-left></p>
    </div>
  </header>
  </div>
  <div class="gifting-2026-belief-body">
    <section aria-labelledby="gifting-words">
      <h2 class="gifting-2026-belief-body__h" id="gifting-words">In their words</h2>
      ${words.map((q) => quote(q)).join("")}
      <form class="signup-nudge__form signup-nudge__form--question" id="gifting-belief-form" novalidate>
        <div class="signup-nudge__email-group">
          <label class="visually-hidden" for="gifting-belief-input">Your version of this belief</label>
          <input class="signup-nudge__email-input" id="gifting-belief-input" type="text" autocomplete="off" placeholder="Believe some version of this? Say it your way…" />
          <button class="signup-nudge__signup-btn" type="submit">Send</button>
        </div>
      </form>
    </section>
    <aside class="gifting-2026-belief-body__side">
      <h2 class="gifting-2026-belief-body__h">Gifts for people who believe this</h2>
      ${tags.length ? `<div class="gifting-2026-belief-body__row">${tags.map((t) => giftTag(data, t)).join("")}</div>` : ""}
      ${kinds.length ? `<div class="gifting-2026-belief-body__row">${kinds.map((k) => `<a class="btn btn-outline animated-arrow" href="${kindUrl(k.id)}">${esc(k.name)} ${arrow()}</a>`).join("")}</div>` : ""}
      ${!tags.length && !kinds.length ? "<p class=\"gifting-2026-belief-body__none\">No gift section maps to this belief. That’s deliberate.</p>" : ""}
      <h2 class="gifting-2026-belief-body__h">More from ${esc(s.name)}</h2>
      <div class="gifting-2026-belief-body__row" id="gifting-more">${more.map((x) => beliefCard(data, x, { size: "sm" })).join("")}</div>
    </aside>
  </div>`;
}
async function initBelief(loadData) {
	const host = qs("#gifting-belief");
	let data;
	try {
		data = await loadData();
	} catch (err) {
		showError(host, err);
		return;
	}
	const b = data.beliefById[params().get("id")];
	if (!b) {
		host.innerHTML = `<p class="gifting-2026-crumb"><a href="${pageUrl("philosophies")}">Philosophies</a></p><p class="gifting-2026-legend">We couldn’t find that belief. It may have moved.</p>`;
		return;
	}
	host.innerHTML = render(data, b);
	initTray(data);
	initShortlist();
	syncPicks();
	syncKeeps();
	const keepClick = bindKeepBookmarks(host);
	host.addEventListener("click", (e) => {
		if (keepClick(e)) return;
		const pick = e.target.closest("[data-pick-button]");
		if (pick) {
			togglePick(data, pick.dataset.pickButton);
			return;
		}
		const card = e.target.closest("#gifting-more [data-belief]");
		if (!card) return;
		if (e.target.closest(".bookmark-icon-container")) {
			e.preventDefault();
			e.stopPropagation();
			togglePick(data, card.dataset.belief);
			return;
		}
		if (!e.metaKey && !e.ctrlKey && !e.shiftKey) {
			e.preventDefault();
			openBelief(data, card.dataset.belief);
		}
	});
	qs("#gifting-belief-form").addEventListener("submit", (e) => {
		e.preventDefault();
		const input = qs("#gifting-belief-input");
		const v = input.value.trim();
		if (!v) return;
		saveAnswer(`belief:${b.id}`, `Your version of “${b.headline.slice(0, 40)}…”`, v, "text");
		input.value = "";
	});
}
//#endregion
export { initBelief as t };
