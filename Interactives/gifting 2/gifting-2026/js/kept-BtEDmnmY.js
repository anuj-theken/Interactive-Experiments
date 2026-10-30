import { t as store } from "./store-CK1waRpq.js";
import { a as pageUrl, h as toast, n as deal, o as params, p as showError, s as qs, t as arrow } from "./ui-CSHVKqjF.js";
import { a as giftTag } from "./templates-C-GvKuvd.js";
import { n as syncKeeps, t as bindKeepBookmarks } from "./keeps-UoUJVwJN.js";
import { t as openTag } from "./tag-back-DboofxP9.js";
//#region src/assets/scripts/gifting-2026/kept.js
async function initKept(loadData) {
	const host = qs("#gifting-kept");
	let data;
	try {
		data = await loadData();
	} catch (err) {
		showError(host, err);
		return;
	}
	const shared = params().get("k");
	const render = () => {
		const tags = (shared ? shared.split(",") : store.keeps()).map((id) => data.tagById[id]).filter(Boolean);
		host.innerHTML = `<div class="gifting-2026-band gifting-2026-band--light">
    <p class="gifting-2026-crumb"><a href="${pageUrl("index")}">Gifting</a> / <a href="${pageUrl("recommendations")}">Recommendations</a> / ${shared ? "A shared shortlist" : "Kept"}</p>
    <header class="gifting-2026-kind-head">
      <div><h1 class="gifting-2026-kind-head__title">${shared ? "A shortlist someone shared" : "Your shortlist"}</h1>
        <p class="gifting-2026-kind-head__tagline">${tags.length ? `${tags.length} ${tags.length === 1 ? "gift" : "gifts"}${shared ? "" : " kept in this browser"}` : "Nothing kept yet."}</p></div>
      <div class="gifting-2026-kind-head__side">
        <div class="gifting-2026-kind-head__actions">
          ${shared ? `<a class="btn btn-primary animated-arrow" href="${pageUrl("recommendations")}">Start your own ${arrow()}</a>` : tags.length ? `<button type="button" class="btn btn-primary" data-email>Email me my shortlist</button>
          <button type="button" class="btn btn-secondary" data-copy>Copy link</button>` : ""}
        </div>
      </div>
    </header>
    </div>
    ${tags.length ? `<h2 class="visually-hidden">Kept gifts</h2><div class="gifting-2026-tags">${tags.map((t) => giftTag(data, t, { kept: store.keeps().includes(t.id) })).join("")}</div>` : `<p class="gifting-2026-legend">Use the bookmark on any gift tag in <a href="${pageUrl("recommendations")}">Recommendations</a> to keep it here.</p>`}`;
		syncKeeps();
		deal();
		qs("[data-email]", host)?.addEventListener("click", () => {
			const user = store.user();
			if (user) {
				toast(`Shortlist sent to ${user.replace(/^(.).*(@.*)$/, "$1•••$2")}`);
				return;
			}
			document.dispatchEvent(new CustomEvent("gifting:open-answers", { detail: { reason: "Email yourself this shortlist" } }));
		});
		qs("[data-copy]", host)?.addEventListener("click", async () => {
			const url = new URL(pageUrl("kept", `k=${store.keeps().map(encodeURIComponent).join(",")}`), window.location.href).href;
			try {
				await navigator.clipboard.writeText(url);
				toast("Link copied");
			} catch (e) {
				toast(`Copy this link: ${url}`);
			}
		});
	};
	render();
	const keepClick = bindKeepBookmarks(host);
	host.addEventListener("click", (e) => {
		if (keepClick(e)) return;
		const tag = e.target.closest("[data-tag]");
		if (tag && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
			e.preventDefault();
			openTag(data, tag.dataset.tag);
		}
	});
	document.addEventListener("gifting:store", (e) => {
		if (!shared && e.detail.key === "gk26_keeps") render();
	});
}
//#endregion
export { initKept as t };
