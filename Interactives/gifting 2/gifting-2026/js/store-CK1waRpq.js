import { t as wp } from "./config-DBYw5SRk.js";
import { o as submitAnswer } from "./api-GNIUBNwO.js";
//#region src/assets/scripts/gifting-2026/store.js
var KEYS = {
	prefs: "gk26_prefs",
	picks: "gk26_picks",
	keeps: "gk26_keeps",
	landed: "gk26_landed",
	drafts: "gk26_drafts",
	user: "gk26_user",
	seen: "gk26_seen",
	nudged: "gk26_nudged"
};
var memory = {};
function read(key, fallback) {
	try {
		const raw = window.localStorage.getItem(key);
		return raw == null ? fallback : JSON.parse(raw);
	} catch (e) {
		return key in memory ? memory[key] : fallback;
	}
}
function write(key, value) {
	memory[key] = value;
	try {
		window.localStorage.setItem(key, JSON.stringify(value));
	} catch (e) {}
	document.dispatchEvent(new CustomEvent("gifting:store", { detail: { key } }));
}
var store = {
	user: () => wp ? wp.user || null : read(KEYS.user, null),
	initial() {
		const u = this.user();
		return u ? u.trim()[0].toUpperCase() : "";
	},
	picks: () => read(KEYS.picks, []),
	togglePick(id) {
		const picks = this.picks();
		if (picks.includes(id)) {
			write(KEYS.picks, picks.filter((p) => p !== id));
			this.removeDraft(`plus:${id}`);
			if (this.user()) submitAnswer({
				key: `plus:${id}`,
				kind: "tap",
				value: 0
			});
			return "removed";
		}
		if (picks.length >= 3) return "full";
		write(KEYS.picks, [...picks, id]);
		return "added";
	},
	keeps: () => read(KEYS.keeps, []),
	toggleKeep(id) {
		const keeps = this.keeps();
		const on = !keeps.includes(id);
		write(KEYS.keeps, on ? [...keeps, id] : keeps.filter((k) => k !== id));
		if (this.user()) submitAnswer({
			key: `keep:${id}`,
			kind: "tap",
			value: on ? 1 : 0
		});
		return on;
	},
	landed: () => read(KEYS.landed, []),
	markLanded(id) {
		const landed = this.landed();
		if (!landed.includes(id)) write(KEYS.landed, [...landed, id]);
	},
	unmarkLanded(id) {
		write(KEYS.landed, this.landed().filter((l) => l !== id));
		this.removeDraft(`landed:${id}`);
		this.removeDraft(`how:${id}`);
		if (this.user()) submitAnswer({
			key: `landed:${id}`,
			kind: "tap",
			value: 0
		});
	},
	seen: () => read(KEYS.seen, []),
	markSeen(id) {
		const seen = this.seen();
		if (!seen.includes(id)) write(KEYS.seen, [...seen, id]);
	},
	nudged: (page) => read(KEYS.nudged, []).includes(page),
	markNudged(page) {
		const pages = read(KEYS.nudged, []);
		if (!pages.includes(page)) write(KEYS.nudged, [...pages, page]);
	},
	drafts: () => read(KEYS.drafts, {}),
	addDraft(key, label, value, kind) {
		if (this.user()) {
			submitAnswer({
				key,
				label,
				value,
				kind
			});
			return "saved";
		}
		const drafts = this.drafts();
		drafts[key] = {
			label,
			value,
			kind,
			page: document.body.dataset.gifting || "",
			ts: Date.now()
		};
		write(KEYS.drafts, drafts);
		return "draft";
	},
	clearDrafts() {
		write(KEYS.drafts, {});
	},
	prefs: () => read(KEYS.prefs, null),
	signIn(email, prefs) {
		write(KEYS.prefs, prefs);
		write(KEYS.user, email);
		document.dispatchEvent(new CustomEvent("gifting:signed-in"));
	},
	signOut() {
		write(KEYS.user, null);
		document.dispatchEvent(new CustomEvent("gifting:signed-in"));
	},
	setLists({ picks, keeps, landed = [] }) {
		write(KEYS.picks, picks);
		write(KEYS.keeps, keeps);
		write(KEYS.landed, [...new Set([...this.landed(), ...landed])]);
	},
	removeDraft(key) {
		const drafts = this.drafts();
		if (!(key in drafts)) return;
		delete drafts[key];
		write(KEYS.drafts, drafts);
	}
};
//#endregion
export { store as t };
