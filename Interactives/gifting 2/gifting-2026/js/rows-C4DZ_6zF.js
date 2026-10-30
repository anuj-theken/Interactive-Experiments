//#region src/assets/scripts/gifting-2026/rows.js
var SECTION_QUESTIONS = {
	q02: "for",
	q06: "moment",
	q09: "people",
	q16: "secret",
	q20: "cost"
};
var LANDED = "landed";
var place = (list, item) => list.indexOf(item) + 1;
var vote = (on) => ({ vote: on ? 1 : 0 });
var thought = (value) => ({ thought: String(value ?? "").trim() });
function beliefRow(data, id, on) {
	const b = data.beliefById[id];
	if (!b) return null;
	const p = data.philosophies;
	return {
		type: "philosophy",
		cat_id: place(p.sections, data.sectionById[b.section]),
		card_id: place(p.beliefs.filter((x) => x.section === b.section), b),
		...vote(on)
	};
}
function tagRow(data, id, field) {
	const t = data.tagById[id];
	if (!t) return null;
	const r = data.recommendations;
	return {
		type: "recommendation",
		cat_id: place(r.kinds, data.kindById[t.kind]),
		card_id: place(r.tags.filter((x) => x.kind === t.kind), t),
		...field
	};
}
function thoughtRow(type, cat, value) {
	return {
		type,
		cat_id: cat,
		card_id: 0,
		...thought(value)
	};
}
function toRow(data, key, value) {
	const [kind, id] = key.split(":");
	if (kind === "plus") return beliefRow(data, id, value);
	if (kind === "keep") return tagRow(data, id, vote(value));
	if (kind === "how") return tagRow(data, id, thought(value));
	if (kind === "landed") return tagRow(data, id, thought(value ? LANDED : ""));
	if (kind === "missed") {
		const k = data.kindById[id];
		return k ? thoughtRow("recommendation", place(data.recommendations.kinds, k), value) : null;
	}
	const section = data.sectionById[SECTION_QUESTIONS[key]];
	if (!section) return null;
	const answer = key === "q20" ? String(value).replace(/\D/g, "") : value;
	return thoughtRow("philosophy", place(data.philosophies.sections, section), answer);
}
function signInRows(data, { picks, keeps, drafts }) {
	return [
		...picks.map((id) => beliefRow(data, id, 1)),
		...keeps.map((id) => tagRow(data, id, vote(1))),
		...Object.entries(drafts).filter(([key]) => !/^(plus|keep):/.test(key)).map(([key, d]) => toRow(data, key, d.value))
	].filter(Boolean);
}
function fromRows(data, rows, { first = [], max }) {
	const p = data.philosophies;
	const r = data.recommendations;
	const picks = [];
	const keeps = [];
	const landed = [];
	rows.forEach((row) => {
		if (!Number(row.card_id)) return;
		if (row.type === "philosophy") {
			const s = p.sections[row.cat_id - 1];
			const b = s && p.beliefs.filter((x) => x.section === s.id)[row.card_id - 1];
			if (b && Number(row.vote)) picks.push(b.id);
		} else if (row.type === "recommendation") {
			const k = r.kinds[row.cat_id - 1];
			const t = k && r.tags.filter((x) => x.kind === k.id)[row.card_id - 1];
			if (t && Number(row.vote)) keeps.push(t.id);
			if (t && row.thought) landed.push(t.id);
		}
	});
	return {
		picks: [...new Set([...first.filter((id) => picks.includes(id)), ...picks])].slice(0, max),
		keeps: [...new Set(keeps)],
		landed
	};
}
//#endregion
export { signInRows as n, toRow as r, fromRows as t };
