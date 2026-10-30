import { t as store } from "./store-CK1waRpq.js";
import { c as qsa, d as saveAnswer, l as revealInStrip, m as shuffle, n as deal, p as showError, r as esc, s as qs, t as arrow } from "./ui-CSHVKqjF.js";
import { n as carouselNav, t as bindCarousels } from "./carousel-CNnVmENl.js";
import { c as totalReaders, s as quote, t as beliefCard } from "./templates-C-GvKuvd.js";
import { n as syncPicks, r as togglePick } from "./picks-BkUKK73f.js";
import { t as openBelief } from "./belief-back-D33f56YS.js";
import { t as initTray } from "./tray-B_0RbDIW.js";
import { n as pickUnseen, t as initPickNudge } from "./nudge-rqH-csBx.js";
//#region src/assets/scripts/gifting-2026/philosophies.js
var ASKS = {
	for: {
		q: "In one line: a great gift is one that…",
		src: "159 readers answered this in 2026",
		kind: "text",
		key: "q02"
	},
	moment: {
		q: "What feeling do you most want a gift to create?",
		src: "154 readers answered this in 2026",
		kind: "tap",
		key: "q06"
	},
	people: {
		q: "Who is hardest for you to buy for, and what finally worked?",
		src: "152 readers answered this in 2026",
		kind: "text",
		key: "q09"
	},
	secret: {
		q: "What would you love to get, but never buy yourself? Why not?",
		src: "143 readers answered this in 2026",
		kind: "text",
		key: "q16"
	},
	cost: {
		q: "What would you spend on a close friend or family member?",
		src: "638 readers answered this in 2024 and 2026",
		kind: "number",
		key: "q20"
	}
};
var data;
var matches = [];
var sort = "mixed";
var order = {};
var SORTS = {
	most: {
		sub: "most believed first",
		by: (a, b) => totalReaders(b) - totalReaders(a)
	},
	rare: {
		sub: "rarest first",
		by: (a, b) => totalReaders(a) - totalReaders(b)
	},
	mixed: { sub: "mixed" }
};
function ordered(list) {
	const s = SORTS[sort];
	return s.by ? list.slice().sort(s.by) : shuffle(list);
}
function othersSaid(sid) {
	return shuffle(data.beliefsInSection(sid).flatMap((b) => [...b.quotes, ...b.moreQuotes || []]).filter((q) => q.text.length <= 140)).slice(0, 2);
}
function askHtml(s) {
	const a = ASKS[s.id];
	if (!a) return "";
	const head = `<p class="gifting-2026-ask__q">${esc(a.q)}<small>${esc(a.src)}</small></p>`;
	if (a.kind === "tap") return `<div class="gifting-2026-ask" data-ask="${s.id}">${head}<div class="gifting-2026-ask__chips" role="group" aria-label="${esc(a.q)}">${data.charts.feeling.map((f) => `<button type="button" class="btn btn-secondary" data-feeling="${esc(f.label)}" aria-pressed="false">${esc(f.label)}</button>`).join("")}</div><p class="gifting-2026-ask__result" aria-live="polite"></p></div>`;
	const isNumber = a.kind === "number";
	return `<div class="gifting-2026-ask" data-ask="${s.id}">${head}
    <form class="signup-nudge__form signup-nudge__form--question signup-nudge__form--compact" novalidate>
      <div class="signup-nudge__email-group">
        <label class="visually-hidden" for="ask-${s.id}">${esc(a.q)}</label>
        <input class="signup-nudge__email-input" id="ask-${s.id}" name="answer" ${isNumber ? "type=\"number\" inputmode=\"numeric\" min=\"0\" placeholder=\"₹ 3000\"" : "type=\"text\" placeholder=\"Yours…\" autocomplete=\"off\""} />
        <button class="signup-nudge__signup-btn" type="submit">${isNumber ? "Compare" : "Add"}</button>
      </div>
    </form>
    <p class="gifting-2026-ask__result" aria-live="polite"></p>
    ${isNumber ? "" : "<div class=\"gifting-2026-ask__others\" hidden></div>"}</div>`;
}
function renderSections() {
	qs("#gifting-sections").innerHTML = data.philosophies.sections.map((s) => {
		const n = data.beliefsInSection(s.id).length;
		return `<section class="gifting-2026-section" id="${s.id}" aria-labelledby="h-${s.id}">
      <div class="section-divider">
        <div class="section-heading-container">
          <h2 class="section-heading-title" id="h-${s.id}">${esc(s.name)}</h2>
          <div class="divider-double-line"></div>
        </div>
        <p class="gifting-2026-section__sub">${n} beliefs, <span data-sort-sub></span></p>
      </div>
      ${askHtml(s)}
      ${carouselNav(n)}
      <div class="gifting-2026-wall" data-carousel></div>
    </section>`;
	}).join("");
	renderWalls();
}
function renderWalls() {
	const picks = store.picks();
	data.philosophies.sections.forEach((s) => {
		const section = qs(`#${s.id}`);
		const beliefs = ordered(data.beliefsInSection(s.id));
		order[s.id] = beliefs.map((b) => b.id);
		qs("[data-sort-sub]", section).textContent = SORTS[sort].sub;
		const wall = qs("[data-carousel]", section);
		wall.innerHTML = beliefs.map((b) => beliefCard(data, b, {
			picked: picks.includes(b.id),
			match: matches.includes(b.id),
			inSection: true
		})).join("");
		wall.scrollLeft = 0;
	});
	syncPicks();
	deal();
}
function onSort(e) {
	const btn = e.target.closest("[data-sort-mode]");
	if (!btn) return;
	sort = btn.dataset.sortMode;
	qsa("[data-sort-mode]").forEach((b) => {
		const on = b === btn;
		b.classList.toggle("is-selected", on);
		b.setAttribute("aria-pressed", on ? "true" : "false");
	});
	renderWalls();
}
function drawOne() {
	const b = pickUnseen(data.philosophies.beliefs, (x) => x.quotes.length + (x.moreQuotes || []).length);
	openBelief(data, b.id, order[b.section]);
}
function renderIndex() {
	qs("#gifting-index-links").innerHTML = data.philosophies.sections.map((s) => `<a href="#${s.id}"><small>${s.number}</small>${esc(s.name)}</a>`).join("");
	const links = qsa("#gifting-index-links a");
	if (!("IntersectionObserver" in window)) return;
	const io = new IntersectionObserver((entries) => {
		entries.forEach((e) => {
			if (!e.isIntersecting) return;
			links.forEach((a) => a.classList.toggle("is-current", a.getAttribute("href") === `#${e.target.id}`));
			revealInStrip(links.find((a) => a.classList.contains("is-current")));
		});
	}, { rootMargin: "-40% 0px -55% 0px" });
	qsa(".gifting-2026-section").forEach((s) => io.observe(s));
}
function onHero(e) {
	e.preventDefault();
	const raw = qs("#gifting-mine").value.trim();
	const text = raw.toLowerCase();
	if (raw) saveAnswer("q01", "Your philosophy about gifting", raw, "text");
	matches = data.philosophies.beliefs.filter((b) => b.keywords.some((k) => text.includes(k))).slice(0, 3).map((b) => b.id);
	renderWalls();
	qs("#gifting-hero-status").innerHTML = !raw ? "" : matches.length ? `Noted. Yours sounds like ${matches.length} of theirs, marked below ${arrow("down")}` : `Noted. Nobody has said it quite like that. Have a look ${arrow("down")}`;
	setTimeout(() => qs("#intro").scrollIntoView({ behavior: "smooth" }), 700);
}
function onSectionsClick(e) {
	const bookmark = e.target.closest(".bookmark-icon-container");
	const card = e.target.closest("[data-belief]");
	if (bookmark && card) {
		e.preventDefault();
		e.stopPropagation();
		togglePick(data, card.dataset.belief);
		return;
	}
	const feeling = e.target.closest("[data-feeling]");
	if (feeling) {
		const label = feeling.dataset.feeling;
		const box = feeling.closest(".gifting-2026-ask");
		box.querySelectorAll("[data-feeling]").forEach((b) => {
			b.classList.toggle("is-selected", b === feeling);
			b.setAttribute("aria-pressed", b === feeling ? "true" : "false");
		});
		saveAnswer("q06", "The feeling you want a gift to create", label, "tap");
		const total = data.charts.feeling.reduce((n, f) => n + f.count, 0);
		const mine = data.charts.feeling.find((f) => f.label === label);
		box.querySelector(".gifting-2026-ask__result").textContent = `${Math.round(mine.count / total * 100)}% of readers chose this too`;
		return;
	}
	if (card && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
		e.preventDefault();
		const s = data.beliefById[card.dataset.belief].section;
		openBelief(data, card.dataset.belief, order[s]);
	}
}
function onSectionsKey(e) {
	const bookmark = e.target.closest(".bookmark-icon-container");
	if (bookmark && (e.key === "Enter" || e.key === " ")) {
		e.preventDefault();
		e.stopPropagation();
		togglePick(data, bookmark.closest("[data-belief]").dataset.belief);
	}
}
function budgetVerdict(v, median) {
	return `You’d ${v > median ? "spend more than" : v < median ? "spend less than" : "match"} most readers: their median is ₹${median.toLocaleString("en-IN")}.`;
}
function onAskSubmit(e) {
	const form = e.target.closest(".gifting-2026-ask form");
	if (!form) return;
	e.preventDefault();
	const sid = form.closest("[data-ask]").dataset.ask;
	const a = ASKS[sid];
	const input = form.querySelector("input, textarea");
	const result = form.parentElement.querySelector(".gifting-2026-ask__result");
	if (a.kind === "number") {
		const v = Number(input.value);
		if (!v) {
			result.textContent = "Enter an amount in rupees.";
			return;
		}
		saveAnswer(a.key, "Your budget for a close friend", `₹${v.toLocaleString("en-IN")}`, "number");
		result.textContent = budgetVerdict(v, data.charts.budget.give);
		return;
	}
	const v = input.value.trim();
	if (!v) return;
	saveAnswer(a.key, a.q, v, "text");
	input.value = "";
	const others = othersSaid(sid);
	result.textContent = others.length ? "Noted. Two other readers said:" : "";
	const box = form.parentElement.querySelector(".gifting-2026-ask__others");
	box.innerHTML = others.map((q) => quote(q)).join("");
	box.hidden = !others.length;
}
async function initPhilosophies(loadData) {
	const host = qs("#gifting-sections");
	try {
		data = await loadData();
	} catch (err) {
		showError(host, err);
		return;
	}
	initTray(data);
	renderSections();
	renderIndex();
	qs("#gifting-hero-form").addEventListener("submit", onHero);
	qs("[data-skip]").addEventListener("click", () => qs("#intro").scrollIntoView({ behavior: "smooth" }));
	host.addEventListener("click", onSectionsClick);
	host.addEventListener("keydown", onSectionsKey);
	host.addEventListener("submit", onAskSubmit);
	bindCarousels(host);
	qs("[data-sort]").addEventListener("click", onSort);
	qs("[data-draw]")?.addEventListener("click", drawOne);
	initPickNudge({
		page: "philosophies",
		text: "<b>Not sure what to explore?</b>Let us pick a belief for you.",
		sections: ".gifting-2026-section",
		after: 2,
		onPick: drawOne
	});
}
//#endregion
export { initPhilosophies as n, budgetVerdict as t };
