import { t as wp } from "./config-DBYw5SRk.js";
//#region src/assets/scripts/gifting-2026/data.js
var DEFAULT_SOURCE = new URL("" + new URL("../data/gifting-2026.json", import.meta.url).href, "" + import.meta.url).href;
var cache = null;
function loadData() {
	if (cache) return cache;
	const source = document.body.dataset.giftingSource || wp && wp.dataUrl || DEFAULT_SOURCE;
	cache = fetch(source, { credentials: "same-origin" }).then((res) => {
		if (!res.ok) throw new Error(`Gifting data failed to load (${res.status})`);
		return res.json();
	}).then(index);
	return cache;
}
function index(data) {
	const p = data.philosophies;
	const r = data.recommendations;
	data.sectionById = Object.fromEntries(p.sections.map((s) => [s.id, s]));
	data.beliefById = Object.fromEntries(p.beliefs.map((b) => [b.id, b]));
	data.kindById = Object.fromEntries(r.kinds.map((k) => [k.id, k]));
	data.tagById = Object.fromEntries(r.tags.map((t) => [t.id, t]));
	data.tagsForBelief = (id) => r.tags.filter((t) => t.belief === id && !t.pageOnly);
	data.beliefsInSection = (sid) => p.beliefs.filter((b) => b.section === sid);
	return data;
}
//#endregion
export { loadData as t };
