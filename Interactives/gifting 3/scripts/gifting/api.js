// Talks to the gifting_2026_* AJAX endpoints (includes/functions.php). Ported unchanged from the 2026 build,
// including its fixes; without window.gk26Config it mocks the server (the code is 000000).
import { wp } from './config.js';
import { loadData } from './data.js';
import { toRow } from './rows.js';
var DELAY = 500;
var CODE_TTL = 600 * 1e3;
var MAX_TRIES = 3;
var MAX_CODES_PER_HOUR = 5;
var THROWAWAY = [
	"mailinator.com",
	"guerrillamail.com",
	"10minutemail.com",
	"tempmail.com",
	"yopmail.com",
	"trashmail.com"
];
var OFFLINE = "We couldn’t reach The Ken. Check your connection and try again.";
var wait = (value) => new Promise((resolve) => {
	setTimeout(() => resolve(value), DELAY);
});
var session = {
	requests: [],
	code: null
};
var isEmail = (v) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
async function post(action, fields) {
	try {
		const json = await (await fetch(wp.ajaxUrl, {
			method: "POST",
			credentials: "same-origin",
			body: new URLSearchParams({
				action,
				...fields
			})
		})).json();
		return json && typeof json === "object" ? json : {
			ok: false,
			error: OFFLINE
		};
	} catch (e) {
		return {
			ok: false,
			error: OFFLINE
		};
	}
}
function takeNonces(res) {
	if (!res.nonces) return;
	wp.authNonce = res.nonces.auth;
	wp.answersNonce = res.nonces.answers;
}
function requestCode(email) {
	const now = Date.now();
	if (!isEmail(email)) return wait({
		ok: false,
		error: "That email doesn’t look right. Check it and try again."
	});
	if (THROWAWAY.includes(email.split("@")[1].toLowerCase())) return wait({
		ok: false,
		error: "We can’t send codes to temporary email addresses. Use one you’ll keep."
	});
	if (wp) return post("gifting_2026_request_code_ajax", {
		nonce: wp.authNonce,
		email
	});
	session.requests = session.requests.filter((t) => now - t < 3600 * 1e3);
	if (session.requests.length >= MAX_CODES_PER_HOUR) return wait({
		ok: false,
		error: "That’s five codes in an hour. Try again later, or use a link instead."
	});
	session.requests.push(now);
	session.code = {
		email,
		issued: now,
		tries: 0
	};
	return wait({ ok: true });
}
async function verifyCode(email, code, { prefs = {}, rows = [], logoutOthers = false } = {}) {
	if (wp) {
		const res = await post("gifting_2026_verify_code_ajax", {
			nonce: wp.authNonce,
			email,
			code,
			credit: prefs.credit || "initials",
			publish: prefs.publish ? 1 : 0,
			newsletter: prefs.newsletter ? 1 : 0,
			rows: JSON.stringify(rows),
			...logoutOthers ? { logout_others: 1 } : {}
		});
		if (res.ok) {
			takeNonces(res);
			wp.user = res.email || email;
		}
		return res;
	}
	const c = session.code;
	if (!c || c.email !== email) return wait({
		ok: false,
		error: "Ask for a code first."
	});
	if (Date.now() - c.issued > CODE_TTL) return wait({
		ok: false,
		error: "That code has expired. Ask for a new one.",
		expired: true
	});
	if (c.tries >= MAX_TRIES) return wait({
		ok: false,
		error: "Too many tries. Ask for a new code.",
		expired: true
	});
	if (code !== "000000") {
		c.tries += 1;
		const left = MAX_TRIES - c.tries;
		return wait({
			ok: false,
			error: left ? `That code didn’t match. ${left} ${left === 1 ? "try" : "tries"} left.` : "That code didn’t match. Ask for a new code.",
			expired: !left
		});
	}
	if (email.includes("+devices") && !logoutOthers) return wait({
		ok: false,
		session_limit: true,
		error: "This account is signed in on two other devices.",
		sessions: "<ul><li>Chrome on a Mac · signed in 3 days ago</li><li>Safari on an iPhone · signed in yesterday</li></ul>"
	});
	session.code = null;
	return wait({ ok: true });
}
function requestLink(email) {
	if (!isEmail(email)) return wait({
		ok: false,
		error: "That email doesn’t look right."
	});
	return wait({ ok: true });
}
async function submitAnswers({ drafts, rows = [] }) {
	if (wp) {
		const data = await loadData();
		const words = Object.entries(drafts).filter(([key, d]) => d.kind === "text" && toRow(data, key, d.value)).length;
		return {
			ok: true,
			words,
			counted: rows.length - words
		};
	}
	const list = Object.values(drafts);
	const words = list.filter((d) => d.kind === "text").length;
	return wait({
		ok: true,
		words,
		counted: list.length - words
	});
}
async function submitAnswer({ key, value }) {
	if (!wp) return wait({ ok: true });
	const row = toRow(await loadData(), key, value);
	if (!row) return {
		ok: true,
		skipped: 1
	};
	return post("gifting_2026_save_answers_ajax", {
		nonce: wp.answersNonce,
		rows: JSON.stringify([row])
	});
}
function getAnswers() {
	if (!wp) return wait({
		ok: true,
		rows: []
	});
	return post("gifting_2026_get_answers_ajax", { nonce: wp.answersNonce });
}
async function signOut() {
	if (!wp) return { ok: true };
	const res = await post("gifting_2026_sign_out_ajax", { nonce: wp.authNonce });
	if (res.ok) {
		takeNonces(res);
		wp.user = null;
	}
	return res;
}
export { signOut, verifyCode, requestLink, isEmail, submitAnswer, requestCode, submitAnswers, getAnswers };
