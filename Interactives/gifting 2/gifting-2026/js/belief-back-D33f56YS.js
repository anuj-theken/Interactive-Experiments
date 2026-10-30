import { t as store } from "./store-CK1waRpq.js";
import { r as esc, t as arrow } from "./ui-CSHVKqjF.js";
import { i as formatCredit, n as beliefUrl, o as kindUrl, r as chart, s as quote } from "./templates-C-GvKuvd.js";
import { t as openSheet } from "./sheet-DOIFXp5o.js";
import { n as syncPicks, r as togglePick } from "./picks-BkUKK73f.js";
//#region src/assets/scripts/gifting-2026/belief-back.js
function openBelief(data, id, siblings) {
	const b = data.beliefById[id];
	if (!b) return;
	store.markSeen(id);
	const s = data.sectionById[b.section];
	const list = siblings && siblings.length ? siblings : data.beliefsInSection(b.section).map((x) => x.id);
	const i = Math.max(0, list.indexOf(id));
	const prev = list[(i - 1 + list.length) % list.length];
	const next = list[(i + 1) % list.length];
	const title = b.opposing ? `“${esc(b.headline)}” <span class="md-blockquote-article__or">or</span> “${esc(b.opposing.headline)}”` : `“${esc(b.headline)}”`;
	const kinds = b.giftKinds.map((k) => data.kindById[k]).filter(Boolean);
	const tags = data.tagsForBelief(id).slice(0, 3);
	const links = kinds.length || tags.length ? `<div class="nudge-modal__links"><span>Gifts for people who believe this</span><div>${kinds.map((k) => `<a class="btn btn-outline" href="${kindUrl(k.id)}">${esc(k.name)}</a>`).join("")}${tags.map((t) => `<a class="btn btn-outline" href="${kindUrl(t.kind, t.slug)}">${esc(t.itWas)}</a>`).join("")}</div></div>` : "";
	openSheet(`<div class="nudge-modal__label"><span>${esc(s.name)}</span>
    <span><button type="button" class="animated-arrow" data-go="${esc(prev)}" aria-label="Previous belief">${arrow("left")}</button>${i + 1} / ${list.length}<button type="button" class="animated-arrow" data-go="${esc(next)}" aria-label="Next belief">${arrow()}</button></span></div>
  <h2 class="large-title-l" id="gifting-card-back-title">${title}</h2>
  <p class="blockquote-source">${esc(formatCredit(b.credit))}${b.opposing ? `; or ${esc(formatCredit(b.opposing.credit))}` : ""}</p>
  ${b.quotes.map((q) => quote(q)).join("")}
  ${chart(data, b)}
  ${links}
  <div class="nudge-modal__actions">
    <button type="button" class="btn btn-secondary" data-pick-button="${esc(id)}" aria-pressed="false">I believe this too</button>
    <a class="btn btn-secondary animated-arrow" href="${beliefUrl(id)}">Go deeper ${arrow()}</a>
    <span class="nudge-modal__hint" data-picks-left>${3 - store.picks().length} of 3 left</span>
  </div>`, (body) => {
		body.querySelectorAll("[data-go]").forEach((btn) => btn.addEventListener("click", () => openBelief(data, btn.dataset.go, list)));
		body.querySelector("[data-pick-button]").addEventListener("click", () => togglePick(data, id));
		syncPicks();
	});
}
//#endregion
export { openBelief as t };
