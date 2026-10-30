import { a as pageUrl, r as esc, u as rnd } from "./ui-CSHVKqjF.js";
import { t as double_quotes_opening_grey_default } from "./icons-CTj37_tn.js";
//#region src/assets/scripts/gifting-2026/templates.js
var BOOKMARK = (label, on) => `<span class="bookmark-icon-container${on ? " bookmarked added" : ""}" role="button" tabindex="0" aria-pressed="${on ? "true" : "false"}" aria-label="${esc(label)}">
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <g opacity="0.2"><path d="M16 2H4V18L10 14L16 18V2Z" stroke="black" stroke-width="1.5" /></g>
    <g class="bookmark-plus-icon"><path d="M0 2.99951L6 2.99951" stroke="#f33" stroke-width="1.5" /><path d="M3 0L3 6" stroke="#f33" stroke-width="1.5" /></g>
    <g class="bookmark-check-icon"><path d="M0.900024 2.58582L3.72845 5.41424" stroke="white" stroke-width="1.5" /><path d="M7.10004 1L2.8574 5.24264" stroke="white" stroke-width="1.5" /></g>
  </svg>
</span>`;
var PLUS_ONE = (on) => `<span class="bookmark-icon-container bookmark-icon-container--plus-one${on ? " bookmarked added" : ""}" role="button" tabindex="0" aria-pressed="${on ? "true" : "false"}" aria-label="+1, I believe this too"><span aria-hidden="true">+1</span></span>`;
var beliefUrl = (id) => pageUrl("belief", `id=${encodeURIComponent(id)}`);
var kindUrl = (id, hi) => pageUrl("section", `kind=${encodeURIComponent(id)}${hi ? `&hi=${encodeURIComponent(hi)}` : ""}`);
var sizeFor = (n) => n >= 100 ? "lg" : n >= 25 ? "md" : "sm";
var totalReaders = (b) => b.readers + (b.opposing ? b.opposing.readers : 0);
function beliefCard(data, b, { picked = false, match = false, size, label, inSection = false } = {}) {
	const s = data.sectionById[b.section];
	const total = totalReaders(b);
	let title;
	let credit;
	let count;
	let stamp = label;
	if (b.opposing) {
		title = `<span>“${esc(b.headline)}”</span><span class="md-blockquote-article__or">or</span><span>“${esc(b.opposing.headline)}”</span>`;
		credit = `${esc(formatCredit(b.credit))}; or ${esc(formatCredit(b.opposing.credit))}`;
		count = `<span class="md-blockquote-article__stamp">${b.readers}</span>vs<span class="md-blockquote-article__stamp">${b.opposing.readers}</span>`;
		stamp = stamp || "Readers disagree";
	} else {
		title = `“${esc(b.headline)}”`;
		credit = esc(formatCredit(b.credit));
		count = `<span class="md-blockquote-article__stamp">${b.readers}</span>${b.readers === 1 ? "reader" : "readers"}${b.trend ? " since 2024" : ""}`;
		if (b.readers === 1) stamp = stamp || "One of one";
	}
	if (match) stamp = "Sounds like you";
	const classes = [
		"md-blockquote-article",
		"md-blockquote-article--belief",
		`md-blockquote-article--${s.key}`,
		`md-blockquote-article--${size || sizeFor(total)}`
	];
	if (picked) classes.push("is-picked");
	if (match) classes.push("is-match");
	return `<article class="${classes.join(" ")}" style="--tilt:${(rnd() * 5 - 2.5).toFixed(1)}deg;--deal-delay:${(rnd() * .35).toFixed(2)}s" data-belief="${esc(b.id)}">
  ${stamp ? `<span class="live-poll-ticker live-poll-ticker--stamp">${esc(stamp)}</span>` : ""}
  ${inSection ? "" : `<div class="byline-container"><p class="author-byline">${esc(s.name)}</p></div>`}
  <div class="article-text-container">
    <h3 class="large-title-l">${title}</h3>
    <p class="blockquote-source">${credit}</p>
  </div>
  <div class="actions-container">
    <span class="md-blockquote-article__count">${count}</span>
    ${PLUS_ONE(picked)}
  </div>
  <a href="${beliefUrl(b.id)}" class="article-link">Open: ${esc(b.headline)}</a>
</article>`;
}
var BAND_WORDS = {
	1: "under about ₹3,000",
	2: "₹3,000–12,000",
	3: "₹12,000–35,000",
	4: "up to about ₹50,000"
};
function price(p) {
	if (p.max === 0) return "<span class=\"lg-highlighted-excerpt-article__price\">Free</span>";
	const on = Math.min(4, Math.max(1, p.max));
	return `<span class="lg-highlighted-excerpt-article__price"><span class="visually-hidden">Price ${BAND_WORDS[on]}</span><span aria-hidden="true">${"₹".repeat(on)}<i>${"₹".repeat(4 - on)}</i></span></span>`;
}
var KIND_ICONS = {
	"buy-it-once": new URL("data:image/webp;base64,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", "" + import.meta.url).href,
	"the-body": new URL("data:image/webp;base64,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", "" + import.meta.url).href,
	"in-the-room": new URL("data:image/webp;base64,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", "" + import.meta.url).href,
	pets: new URL("data:image/webp;base64,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", "" + import.meta.url).href,
	"the-answer-is-less": new URL("" + new URL("../assets/gulak-BYZE5zit.webp", import.meta.url).href, "" + import.meta.url).href
};
var PAPERS = [
	"green",
	"teal",
	"plum"
];
var AGE = /^(\d+–\d+|over \d+)$/i;
var labelAge = (p) => AGE.test(p) ? `aged\u00a0${p.toLowerCase().replace("–", "⁠–⁠")}` : p;
function creditParts(credit) {
	const [who, ...rest] = String(credit).split(",").map((s) => s.trim());
	const initial = (who.replace(/[^A-Za-z]/g, "")[0] || "R").toUpperCase();
	const detail = rest.map(labelAge).join(", ");
	return {
		initial,
		detail: detail ? detail[0].toUpperCase() + detail.slice(1) : who
	};
}
function formatCredit(credit) {
	const parts = String(credit).split(",").map((s) => s.trim());
	if (/^[A-Z]{1,3}\.$|^[A-Z]\.[A-Z.]*$/.test(parts[0]) && parts[1] && !AGE.test(parts[1])) parts.splice(0, 2, `${parts[0]}, ${parts[1]}`);
	return parts.map(labelAge).join(", ");
}
var givenTo = (t) => {
	const first = t.givenTo.find((g) => g !== "anyone");
	return first ? `for ${first}` : "for anyone";
};
function giftTag(data, t, { kept = false, forThem = false, paper, inKind = false } = {}) {
	const k = data.kindById[t.kind];
	const reason = t.editorsPick ? esc(t.reason) : `“${esc(t.reason)}”`;
	const classes = [
		"lg-highlighted-excerpt-article",
		"lg-highlighted-excerpt-article--gift-tag",
		"lg-highlighted-excerpt-article--label",
		`lg-highlighted-excerpt-article--paper-${PAPERS[(parseInt(k.number, 10) - 1) % PAPERS.length]}`
	];
	if (t.editorsPick) classes.push("is-editors-pick");
	if (forThem) classes.push("is-for-them");
	const stamp = forThem ? "For them" : t.editorsPick ? "Editor’s pick" : "";
	const style = `--tilt:${(rnd() * 7 - 3.5).toFixed(1)}deg;--deal-delay:${(rnd() * .35).toFixed(2)}s${paper ? `;--tag-paper:${paper}` : ""}`;
	const c = creditParts(t.credit);
	const icon = KIND_ICONS[t.kind];
	return `<article class="${classes.join(" ")}" style="${style}" data-tag="${esc(t.id)}">
  ${stamp ? `<span class="live-poll-ticker live-poll-ticker--stamp">${esc(stamp)}</span>` : ""}
  <span class="lg-highlighted-excerpt-article__string" aria-hidden="true"></span>
  <div class="lg-highlighted-excerpt-article__body">
    <span class="lg-highlighted-excerpt-article__hole" aria-hidden="true"></span>
    ${inKind ? "" : `<div class="lg-highlighted-excerpt-article__kind">
      <span class="lg-highlighted-excerpt-article__mark${icon ? " has-icon" : ""}">${icon ? `<img src="${icon}" alt="" width="30" height="30" loading="lazy" />` : k.number}</span>
      <span>${esc(k.name)}</span>
    </div>
    <hr class="lg-highlighted-excerpt-article__rule" />`}
    <div class="article-text-container">
      <h3 class="large-title-l">${reason}</h3>
      <p class="blockquote-source"><span class="lg-highlighted-excerpt-article__initial" aria-hidden="true">${c.initial}</span>${esc(c.detail)}</p>
    </div>
    <div class="lg-highlighted-excerpt-article__stub">
      <p class="article-strap highlighted-strap"><span class="lg-highlighted-excerpt-article__was"><span class="lg-highlighted-excerpt-article__pill">${esc(givenTo(t))}</span></span><span>${esc(t.itWas)}</span></p>
      <div class="actions-container">
        <p class="gifted-often-container">${price(t.price)}<span class="gifted-often-container__rule" aria-hidden="true"></span><span>came up <b>${t.mentions}×</b></span></p>
        ${BOOKMARK("Keep this gift", kept)}
      </div>
    </div>
  </div>
  <a href="${kindUrl(t.kind, t.slug)}" class="article-link">Open: ${esc(t.itWas)}</a>
</article>`;
}
function quote(q, { lead = false } = {}) {
	return `<div class="blockquote-text-container${lead ? " is-lead" : ""}">
  <div class="blockquote-decorator"><img src="${double_quotes_opening_grey_default}" alt="" /></div>
  <div><p class="article-strap">${esc(q.text)}</p><p class="blockquote-source">${esc(formatCredit(q.credit))}</p></div>
</div>`;
}
function chart(data, b) {
	if (b.trend) {
		const years = Object.entries(b.trend);
		const max = Math.max(...years.map(([, v]) => v));
		return `<div class="gifting-2026-chart">
  <div class="gifting-2026-chart__caption">Share of each year’s answers that said this</div>
  <div class="gifting-2026-chart__years">${years.map(([y, v]) => `<div style="height:${Math.round(v / max * 48)}px"><b>${v}%</b><span>’${y.slice(2)}</span></div>`).join("")}</div>
</div>`;
	}
	const bars = (rows, caption, valueOf, labelOf) => {
		const max = Math.max(...rows.map(valueOf));
		return `<div class="gifting-2026-chart">
  <div class="gifting-2026-chart__caption">${caption}</div>
  <div class="gifting-2026-chart__bars">${rows.map((r) => `<span>${esc(r.label)}</span><i style="width:${Math.max(2, Math.round(valueOf(r) / max * 100))}%"></i><b>${esc(labelOf(r))}</b>`).join("")}</div>
</div>`;
	};
	if (b.chart === "feeling") return bars(data.charts.feeling, "The feeling readers most want a gift to create (2026)", (r) => r.count, (r) => r.count);
	if (b.chart === "occasions") return bars(data.charts.occasions, "Occasions that drive readers’ gifting (2026)", (r) => r.count, (r) => r.count);
	if (b.chart === "recipientShare") {
		const width = {
			"25%+": 30,
			"10–25%": 17,
			"1–5%": 3
		};
		return bars(data.charts.recipientShare, "Share of yearly gifting each group gets (most common answer, 2026)", (r) => width[r.share] || 1, (r) => r.share);
	}
	if (b.chart === "budget") {
		const { give, get, year } = data.charts.budget;
		return `<div class="gifting-2026-chart"><div class="gifting-2026-chart__pair"><b>₹${give.toLocaleString("en-IN")}</b><span>to give</span><b>₹${get.toLocaleString("en-IN")}</b><span>to get (medians, ${year})</span></div></div>`;
	}
	if (b.opposing) return `<div class="gifting-2026-chart"><div class="gifting-2026-chart__pair"><b>${b.readers}</b><span>say yes</span><b>${b.opposing.readers}</b><span>say never</span></div></div>`;
	return "";
}
//#endregion
export { giftTag as a, totalReaders as c, formatCredit as i, beliefUrl as n, kindUrl as o, chart as r, quote as s, beliefCard as t };
