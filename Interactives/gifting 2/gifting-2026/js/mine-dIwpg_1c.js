import { t as store } from "./store-CK1waRpq.js";
import { a as pageUrl, c as qsa, h as toast, o as params, p as showError, r as esc, s as qs, t as arrow } from "./ui-CSHVKqjF.js";
import { n as carouselNav } from "./carousel-CNnVmENl.js";
import { i as formatCredit, n as beliefUrl, s as quote } from "./templates-C-GvKuvd.js";
import { t as philosophyImage } from "./share-image-DXwhYUft.js";
//#region src/assets/scripts/gifting-2026/mine.js
var WORDS = [
	"no",
	"one",
	"two",
	"three"
];
var reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var andList = (xs) => xs.length > 1 ? `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}` : xs.join("");
var SHARE_ICON = "<svg width=\"14\" height=\"14\" viewBox=\"0 0 14 14\" fill=\"none\" aria-hidden=\"true\"><path d=\"M7 1v8M3.5 4.5L7 1l3.5 3.5M2 8v4.5h10V8\" stroke=\"currentColor\" stroke-width=\"1.4\"/></svg>";
var countOf = (b) => b.opposing ? {
	count: `${b.readers} vs ${b.opposing.readers}`,
	unit: "readers"
} : {
	count: String(b.readers),
	unit: `${b.readers === 1 ? "reader" : "readers"}${b.trend ? " since 2024" : ""}`
};
var headlineOf = (b) => b.opposing ? `“${b.headline}” or “${b.opposing.headline}”` : `“${b.headline}”`;
function handCard(data, b, rare) {
	const s = data.sectionById[b.section];
	const title = b.opposing ? `<span>“${esc(b.headline)}”</span><span class="md-blockquote-article__or">or</span><span>“${esc(b.opposing.headline)}”</span>` : `“${esc(b.headline)}”`;
	const count = b.opposing ? `<span class="md-blockquote-article__stamp">${b.readers}</span>vs<span class="md-blockquote-article__stamp">${b.opposing.readers}</span>` : `<span class="md-blockquote-article__stamp">${b.readers}</span>${esc(countOf(b).unit)}`;
	return `<article class="md-blockquote-article md-blockquote-article--belief md-blockquote-article--${s.key}" data-hand-card>
  ${rare ? "<span class=\"live-poll-ticker live-poll-ticker--stamp\">The rare one</span>" : ""}
  <div class="byline-container"><p class="author-byline">${esc(s.number)} · ${esc(s.name)}</p></div>
  <div class="article-text-container">
    <h2 class="large-title-l">${title}</h2>
    <p class="blockquote-source">${esc(formatCredit(b.credit))}</p>
  </div>
  <div class="actions-container"><span class="md-blockquote-article__count">${count}</span></div>
  <a href="${beliefUrl(b.id)}" class="article-link">Open: ${esc(b.headline)}</a>
</article>`;
}
var shortQuote = (b) => [...b.quotes || []].sort((x, y) => x.text.length - y.text.length)[0];
function bindDeck(hand) {
	const cards = qsa("[data-hand-card]", hand);
	const n = cards.length;
	const count = qs(".gifting-2026-carousel-nav__count b", hand);
	let front = 0;
	const place = (skip) => cards.forEach((card, i) => {
		if (card !== skip) card.dataset.pos = (i - front + n) % n;
	});
	const go = (step) => {
		const leaving = cards[front];
		front = (front + step + n) % n;
		if (count) count.textContent = front + 1;
		if (step > 0 && !reduced()) {
			leaving.classList.add("is-leaving");
			place(leaving);
			setTimeout(() => {
				leaving.classList.remove("is-leaving");
				place();
			}, 280);
		} else place();
	};
	place();
	if (n < 2) return;
	hand.addEventListener("click", (e) => {
		const step = e.target.closest("[data-carousel-step]");
		if (step) go(Number(step.dataset.carouselStep));
	});
	const deck = qs("[data-hand]", hand);
	let start = null;
	deck.addEventListener("touchstart", (e) => {
		start = {
			x: e.touches[0].clientX,
			y: e.touches[0].clientY
		};
	}, { passive: true });
	deck.addEventListener("touchend", (e) => {
		if (!start) return;
		const dx = e.changedTouches[0].clientX - start.x;
		const dy = e.changedTouches[0].clientY - start.y;
		start = null;
		if (Math.abs(dx) >= 40 && Math.abs(dx) >= Math.abs(dy) * 1.3) go(dx < 0 ? 1 : -1);
	});
}
async function shareLink(text) {
	const url = window.location.href;
	if (navigator.share) try {
		await navigator.share({
			title: document.title,
			text,
			url
		});
		return;
	} catch (e) {
		if (e.name === "AbortError") return;
	}
	try {
		await navigator.clipboard.writeText(url);
		toast("Link copied");
	} catch (e) {
		toast("Copy the address from your browser bar to share it");
	}
}
function download(blob, name) {
	const a = document.createElement("a");
	a.href = URL.createObjectURL(blob);
	a.download = name;
	document.body.appendChild(a);
	a.click();
	a.remove();
	setTimeout(() => URL.revokeObjectURL(a.href), 1e3);
}
async function initMine(loadData) {
	const host = qs("#gifting-mine-card");
	let data;
	try {
		data = await loadData();
	} catch (err) {
		showError(host, err);
		return;
	}
	const ids = (params().get("b") || "").split(",").filter((id) => data.beliefById[id]).slice(0, 3);
	const beliefs = ids.map((id) => data.beliefById[id]);
	if (!beliefs.length) {
		host.innerHTML = `<h1 class="gifting-2026-mine__title">No beliefs picked yet.</h1><div class="gifting-2026-mine__actions"><a class="btn btn-secondary gifting-2026-mine__primary animated-arrow" href="${pageUrl("philosophies")}">Pick your three ${arrow()}</a></div>`;
		return;
	}
	const user = store.user();
	const own = [...store.picks()].sort().join() === [...ids].sort().join();
	const by = (params().get("by") || "").slice(0, 1).toUpperCase();
	const whose = by ? `${by}.’s` : "A reader’s";
	const total = data.philosophies.beliefs.length;
	const word = WORDS[beliefs.length];
	const title = own ? "Your gifting philosophy" : `${whose} gifting philosophy`;
	const sub = own ? `In ${word} beliefs, from the ${total} that readers sent The Ken.` : `${by ? `${by}.` : "A reader"} picked these from ${total} beliefs readers sent The Ken. What are yours?`;
	const counts = beliefs.map((b) => b.readers);
	const rare = beliefs.length > 1 && Math.min(...counts) * 3 <= Math.max(...counts) ? counts.indexOf(Math.min(...counts)) : -1;
	const shareText = own ? `My gifting philosophy, in ${word} beliefs, from The Ken’s Gifting 2026. What’s yours?` : `A gifting philosophy from The Ken’s Gifting 2026. What’s yours?`;
	const whatsapp = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${window.location.href}`)}`;
	const canShare = typeof navigator.share === "function";
	document.title = `${whose} gifting philosophy · Gifting 2026 | The Ken`;
	host.innerHTML = `<section class="gifting-2026-hand" aria-labelledby="gifting-hand-title">
      <p class="gifting-2026-hand__eyebrow">The Ken · Gifting 2026</p>
      <h1 class="gifting-2026-hand__title" id="gifting-hand-title">${esc(title)}</h1>
      <p class="gifting-2026-hand__sub">${esc(sub)}</p>
      <div class="gifting-2026-hand__cards" data-hand>${beliefs.map((b, i) => handCard(data, b, i === rare)).join("")}</div>
      ${beliefs.length > 1 ? carouselNav(beliefs.length) : ""}
      <p class="gifting-2026-hand__sum">Held by ${andList(counts.map((c) => `<b>${c}</b>`))} readers</p>
    </section>
    <div class="gifting-2026-mine__actions">${own ? `<button type="button" class="btn btn-secondary gifting-2026-mine__primary" data-share>${SHARE_ICON}${canShare ? "Share" : "Copy link"}</button>
      <a class="btn btn-secondary" href="${whatsapp}" target="_blank" rel="noopener">WhatsApp</a>
      <button type="button" class="btn btn-secondary" data-image>Save as image</button>` : `<a class="btn btn-secondary gifting-2026-mine__primary animated-arrow" href="${pageUrl("philosophies")}">Pick your own three ${arrow()}</a>
      <button type="button" class="btn btn-secondary" data-share>${SHARE_ICON}Share this</button>`}
    </div>
    ${own ? `<p class="gifting-2026-mine__more"><a href="${pageUrl("philosophies")}">Change your three</a>${user ? "" : " · <button type=\"button\" data-save>Save it with your email</button>"}</p>` : ""}
    <section class="gifting-2026-mine__closer" aria-labelledby="gifting-closer-title">
      <h2 class="gifting-2026-mine__closer-title" id="gifting-closer-title">In other readers’ words</h2>
      <ol class="gifting-2026-mine__list">${beliefs.map((b) => {
		const s = data.sectionById[b.section];
		const q = shortQuote(b);
		return `<li>
        <p class="gifting-2026-mine__section">${esc(s.number)} · ${esc(s.name)}</p>
        <a class="gifting-2026-mine__belief" href="${beliefUrl(b.id)}">${esc(headlineOf(b))}</a>
        ${q ? quote(q) : ""}
      </li>`;
	}).join("")}</ol>
    </section>`;
	const hand = qs(".gifting-2026-hand", host);
	bindDeck(hand);
	requestAnimationFrame(() => requestAnimationFrame(() => qs("[data-hand]", hand).classList.add("is-dealt")));
	document.addEventListener("gifting:signed-in", () => initMine(loadData), { once: true });
	qs("[data-share]", host).addEventListener("click", () => shareLink(shareText));
	const save = qs("[data-save]", host);
	if (save) save.addEventListener("click", () => {
		document.dispatchEvent(new CustomEvent("gifting:open-answers", { detail: { reason: "Save your gifting philosophy" } }));
	});
	const imageBtn = qs("[data-image]", host);
	if (!imageBtn) return;
	const css = getComputedStyle(hand);
	const v = (name) => css.getPropertyValue(name).trim();
	const image = philosophyImage({
		eyebrow: "The Ken · Gifting 2026",
		title: by ? `${by}.’s gifting philosophy` : "My gifting philosophy",
		footer: "Pick your own three in The Ken’s Gifting 2026",
		colors: {
			table: v("--hand-table"),
			light: v("--hand-light"),
			lightMuted: v("--hand-light-muted"),
			ink: v("--hand-ink"),
			muted: v("--hand-muted"),
			primary: v("--hand-primary")
		},
		cards: beliefs.map((b, i) => ({
			label: data.sectionById[b.section].name,
			headline: headlineOf(b),
			...countOf(b),
			paper: getComputedStyle(qsa("[data-hand-card]", hand)[i]).getPropertyValue("--hand-paper").trim(),
			rare: i === rare
		}))
	});
	image.catch(() => {});
	imageBtn.addEventListener("click", async () => {
		imageBtn.disabled = true;
		try {
			const blob = await image;
			const name = "my-gifting-philosophy.png";
			const file = new File([blob], name, { type: "image/png" });
			if (navigator.canShare && navigator.canShare({ files: [file] })) try {
				await navigator.share({
					files: [file],
					text: shareText
				});
			} catch (e) {
				if (e.name !== "AbortError") download(blob, name);
			}
			else download(blob, name);
		} catch (e) {
			toast("Couldn’t make the image. A screenshot works too.");
		} finally {
			imageBtn.disabled = false;
		}
	});
}
//#endregion
export { initMine as t };
