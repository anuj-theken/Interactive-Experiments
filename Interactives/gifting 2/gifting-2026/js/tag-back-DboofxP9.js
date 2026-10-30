import { t as store } from "./store-CK1waRpq.js";
import { d as saveAnswer, r as esc, t as arrow } from "./ui-CSHVKqjF.js";
import { n as beliefUrl, o as kindUrl, s as quote } from "./templates-C-GvKuvd.js";
import { t as openSheet } from "./sheet-DOIFXp5o.js";
import { n as syncKeeps, r as toggleKeep } from "./keeps-UoUJVwJN.js";
//#region src/assets/scripts/gifting-2026/tag-back.js
var BAND = {
	0: "free",
	1: "₹",
	2: "₹₹",
	3: "₹₹₹",
	4: "₹₹₹₹"
};
var bandLabel = (p) => p.min === p.max ? BAND[p.max] : `${BAND[p.min]}–${BAND[p.max]}`;
function openTag(data, id, siblings) {
	const t = data.tagById[id];
	if (!t) return;
	store.markSeen(id);
	const k = data.kindById[t.kind];
	const list = siblings && siblings.length ? siblings : data.recommendations.tags.filter((x) => x.kind === t.kind && !x.pageOnly).map((x) => x.id);
	const i = Math.max(0, list.indexOf(id));
	const prev = list[(i - 1 + list.length) % list.length];
	const next = list[(i + 1) % list.length];
	const belief = t.belief && data.beliefById[t.belief];
	const landed = store.landed().includes(id);
	const makers = t.makers.length ? t.makers.map((m) => esc(m)).join(", ") : "<span class=\"gifting-2026-placeholder\">Makers to come</span>";
	openSheet(`<div class="nudge-modal__label"><span>${esc(k.name)}</span>
    <span><button type="button" data-go="${esc(prev)}" aria-label="Previous gift">‹</button>${i + 1} / ${list.length}<button type="button" data-go="${esc(next)}" aria-label="Next gift">›</button></span></div>
  <div class="nudge-modal__thing">
    <h2 class="large-title-l" id="gifting-card-back-title">${esc(t.itWas)}</h2>
    <span><b>${bandLabel(t.price)}</b>came up ${t.mentions}× since 2024</span>
  </div>
  ${quote({
		text: t.reason,
		credit: t.credit
	}, { lead: true })}
  ${t.quotes.map((q) => quote(q)).join("")}
  <div class="gifting-2026-chart"><div class="gifting-2026-chart__pair">
    <span>Where to get a good one: ${makers}</span>
    <span>Readers gave it to: ${esc(t.givenTo.slice(0, 3).join(", ")) || "anyone"}</span>
  </div></div>
  ${belief ? `<div class="nudge-modal__links"><span>The belief behind it</span><a class="nudge-modal__belief-link" href="${beliefUrl(belief.id)}">“${esc(belief.headline)}”</a></div>` : ""}
  <div class="nudge-modal__actions">
    <button type="button" class="btn btn-secondary" data-keep-button="${esc(id)}" aria-pressed="false">Keep</button>
    <button type="button" class="btn btn-secondary" data-landed aria-pressed="${landed}">${landed ? "You gave this" : "I gave this, it landed"}</button>
    <a class="btn btn-secondary animated-arrow" href="${kindUrl(t.kind, t.slug)}">All of ${esc(k.name)} ${arrow()}</a>
  </div>
  <form class="signup-nudge__form signup-nudge__form--question signup-nudge__form--compact" data-how ${landed ? "" : "hidden"} novalidate style="margin-top:14px">
    <div class="signup-nudge__email-group">
      <label class="visually-hidden" for="gifting-how">Who was it for, and how did it go?</label>
      <input class="signup-nudge__email-input" id="gifting-how" type="text" autocomplete="off" placeholder="Who was it for, and how did it go? One line." />
      <button class="signup-nudge__signup-btn" type="submit">Send</button>
    </div>
  </form>`, (body) => {
		body.querySelectorAll("[data-go]").forEach((btn) => btn.addEventListener("click", () => openTag(data, btn.dataset.go, list)));
		body.querySelector("[data-keep-button]").addEventListener("click", () => toggleKeep(id));
		body.querySelector("[data-landed]").addEventListener("click", (e) => {
			const on = !store.landed().includes(id);
			if (on) {
				store.markLanded(id);
				saveAnswer(`landed:${id}`, `It landed: ${t.itWas}`, 1, "tap");
			} else store.unmarkLanded(id);
			e.currentTarget.textContent = on ? "You gave this" : "I gave this, it landed";
			e.currentTarget.setAttribute("aria-pressed", String(on));
			const form = body.querySelector("[data-how]");
			const field = form.querySelector("input, textarea");
			form.hidden = !on;
			if (on) field.focus();
			else field.value = "";
		});
		body.querySelector("[data-how]").addEventListener("submit", (e) => {
			e.preventDefault();
			const input = e.currentTarget.querySelector("input, textarea");
			const v = input.value.trim();
			if (!v) return;
			store.removeDraft(`landed:${id}`);
			saveAnswer(`how:${id}`, `How it went: ${t.itWas}`, v, "text");
			input.value = "";
		});
		syncKeeps();
	});
}
//#endregion
export { openTag as t };
