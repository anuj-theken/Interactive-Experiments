import { n as Modal } from "./vendor-qadh9zQP.js";
import { t as wp } from "./config-DBYw5SRk.js";
import { t as loadData } from "./data-DekMyr86.js";
import { n as signInRows, t as fromRows } from "./rows-C4DZ_6zF.js";
import { a as signOut, c as verifyCode, i as requestLink, n as isEmail, r as requestCode, s as submitAnswers, t as getAnswers } from "./api-GNIUBNwO.js";
import { t as store } from "./store-CK1waRpq.js";
import { c as qsa, h as toast, r as esc, s as qs } from "./ui-CSHVKqjF.js";
//#region src/assets/scripts/gifting-2026/answers.js
var modal;
var root;
var email = "";
var reason = "";
var CLOSE_ICON = "<svg width=\"12\" height=\"12\" viewBox=\"0 0 12 12\" aria-hidden=\"true\"><path d=\"M1 1l10 10M11 1L1 11\" stroke=\"#321F1F\" stroke-width=\"1.5\"/></svg>";
function ensure() {
	if (modal) return;
	root = document.createElement("div");
	root.className = "modal signup-otp-modal login-signup-otp-modal login-signup-otp-modal-3-0 free-trial-signup-modal login-signup-otp-modal--gifting";
	root.id = "gifting-answers";
	root.tabIndex = -1;
	root.setAttribute("aria-labelledby", "gifting-answers-title");
	root.setAttribute("aria-hidden", "true");
	root.innerHTML = `<div class="modal-dialog modal-dialog-centered"><div class="modal-content animate-bottom">
    <div class="modal-header">
      <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">${CLOSE_ICON}</button>
      <div class="modal-header-text">
        <p class="login-signup-otp-modal__eyebrow"><span data-eyebrow></span><span data-eyebrow-count></span></p>
        <h1 class="title" id="gifting-answers-title"></h1>
      </div>
    </div>
    <div class="modal-body" data-stage></div>
  </div></div>`;
	document.body.appendChild(root);
	modal = new Modal(root);
	root.addEventListener("shown.bs.modal", () => qs("input:not([type=hidden])", root)?.focus());
}
function header(eyebrow, count, title) {
	qs("[data-eyebrow]", root).textContent = eyebrow;
	const countEl = qs("[data-eyebrow-count]", root);
	countEl.textContent = count;
	countEl.classList.toggle("is-email", String(count).includes("@"));
	qs("#gifting-answers-title", root).textContent = title;
}
var kindLabel = (k) => k === "text" ? "words" : k === "number" ? "number" : "tap";
function stageList() {
	const drafts = store.drafts();
	const keys = Object.keys(drafts).sort((a, b) => drafts[a].ts - drafts[b].ts);
	const words = keys.filter((k) => drafts[k].kind === "text").length;
	header("Waiting in this browser", keys.length, reason || (keys.length ? "Send these to The Ken?" : "Nothing waiting yet"));
	const body = qs("[data-stage]", root);
	body.className = "modal-body first-stage";
	body.innerHTML = `<p class="login-otp-form-prompt">${keys.length ? "Nothing leaves your browser until you confirm your email. It’s one free Ken account with no password: we send you a 6-digit code." : "Answer anything on the page and it will wait here. You can also sign in now, and your answers will save as you go."}</p>
    ${keys.length ? `<ul class="login-signup-otp-modal__drafts">${keys.map((k) => {
		const d = drafts[k];
		const showValue = d.kind !== "tap" || d.value !== 1;
		const value = String(d.value);
		return `<li><span class="login-signup-otp-modal__kind${d.kind === "text" ? " is-words" : ""}">${kindLabel(d.kind)}</span>
        <span>${esc(d.label)}${showValue ? `<small>“${esc(value.slice(0, 90))}${value.length > 90 ? "…" : ""}”</small>` : ""}</span>
        <button type="button" data-remove="${esc(k)}" aria-label="Remove this answer">×</button></li>`;
	}).join("")}</ul>` : ""}
    <form class="login-otp-form-group" id="gifting-answers-email-form" novalidate>
      <div class="form-group">
        <label class="visually-hidden" for="gifting-answers-email">Email address</label>
        <input type="email" class="form-control login-signup-otp-email" id="gifting-answers-email" autocomplete="email" spellcheck="false" placeholder="Enter your email address" value="${esc(email)}" />
        <button type="submit" class="btn btn-primary passwordless-login-form-continue-btn">Send me a code</button>
      </div>
      <p class="login-signup-otp-modal__error" role="alert" data-error></p>
    </form>
    <p class="login-signup-otp-modal__fine">${keys.length ? `${words} with words go to the editor; ${keys.length - words} taps or numbers count once you confirm. ` : ""}Already a Ken subscriber? Use that email and it links to your account.</p>`;
	qsa("[data-remove]", body).forEach((btn) => btn.addEventListener("click", () => {
		store.removeDraft(btn.dataset.remove);
		stageList();
	}));
	qs("#gifting-answers-email-form", body).addEventListener("submit", async (e) => {
		e.preventDefault();
		const input = qs("#gifting-answers-email", body);
		const btn = qs("button[type=submit]", body);
		const err = qs("[data-error]", body);
		const v = input.value.trim();
		if (!isEmail(v)) {
			err.textContent = "That email doesn’t look right. Check it and try again.";
			input.focus();
			return;
		}
		btn.disabled = true;
		btn.textContent = "Sending…";
		const res = await requestCode(v);
		btn.disabled = false;
		btn.textContent = "Send me a code";
		if (!res.ok) {
			err.textContent = res.error;
			return;
		}
		email = v;
		stageCode();
	});
}
function stageCode() {
	const n = Object.keys(store.drafts()).length;
	header("Step 2 of 2", n ? `${n} waiting` : "", "Enter the code we sent you");
	const body = qs("[data-stage]", root);
	body.className = "modal-body second-stage";
	body.innerHTML = `<p class="login-otp-form-prompt">We sent a 6-digit code to <span class="entered-email">${esc(email)}</span>. Keep this tab open: your answers are here, not on our server.</p>
    <div class="form-floating modal-passwordless-verify-form modal-passwordless-verify-form-3-0">
      <form class="digit-group" id="gifting-answers-code-form" autocomplete="off" novalidate>
        <div class="otp-inputs" role="group" aria-label="6-digit code">
          ${[
		1,
		2,
		3,
		4,
		5,
		6
	].map((i) => `<input type="text" inputmode="numeric" pattern="[0-9]*" ${i === 1 ? "autocomplete=\"one-time-code\"" : "maxlength=\"1\" autocomplete=\"off\""} class="digit-input form-control" aria-label="Digit ${i}" />`).join("")}
        </div>
        <p class="login-signup-otp-modal__error" role="alert" data-error></p>
        <div class="login-signup-otp-modal__links">
          <button type="button" data-resend>Resend code</button>
          ${wp ? "" : "<button type=\"button\" data-link>Use a link instead</button>"}
          <button type="button" data-change>Change email</button>
        </div>
        <fieldset class="login-signup-otp-modal__choices">
          <legend>If we publish anything you wrote, credit it as</legend>
          <label><input type="radio" name="gifting-credit" value="initials" checked /> Initials and city</label>
          <label><input type="radio" name="gifting-credit" value="age" /> “A reader” and your age band</label>
          <label><input type="radio" name="gifting-credit" value="count-only" /> Don’t publish my words, just count them</label>
        </fieldset>
        <fieldset class="login-signup-otp-modal__choices">
          <legend>Permissions</legend>
          <label><input type="checkbox" name="gifting-publish" checked /> The Ken may publish my words, lightly edited</label>
          <label><input type="checkbox" name="gifting-newsletter" /> Also send me First Principles, the free newsletter</label>
        </fieldset>
        <button type="submit" class="btn btn-primary modal-login-signup-otp-form-submit-btn">Confirm${n ? ` and send ${n}` : ""}</button>
        <p class="login-signup-otp-modal__fine">We use your email to confirm it’s you and to tell you if your words are published. You can see, change or delete your answers at any time.</p>
        <p class="gifting-2026-placeholder">Consent notice: DPDP Act wording to come from legal</p>
      </form>
    </div>`;
	const digits = qsa(".digit-input", body);
	digits.forEach((input, i) => {
		input.addEventListener("input", () => {
			const typed = input.value.replace(/\D/g, "");
			if (i === 0 && typed.length > 1) {
				digits.forEach((d, j) => {
					d.value = typed[j] || "";
				});
				digits[Math.min(typed.length, 6) - 1].focus();
				return;
			}
			input.value = typed.slice(-1);
			if (input.value && digits[i + 1]) digits[i + 1].focus();
		});
		input.addEventListener("keydown", (e) => {
			if (e.key === "Backspace" && !input.value && digits[i - 1]) digits[i - 1].focus();
		});
		input.addEventListener("paste", (e) => {
			const text = (e.clipboardData || window.clipboardData).getData("text").replace(/\D/g, "").slice(0, 6);
			if (!text) return;
			e.preventDefault();
			digits.forEach((d, j) => {
				d.value = text[j] || "";
			});
			digits[Math.min(text.length, 5)].focus();
		});
	});
	setTimeout(() => digits[0].focus(), 50);
	const err = qs("[data-error]", body);
	qs("[data-resend]", body).addEventListener("click", async (e) => {
		const btn = e.currentTarget;
		btn.disabled = true;
		const res = await requestCode(email);
		btn.disabled = false;
		err.textContent = res.ok ? "" : res.error;
		if (res.ok) toast("New code sent");
	});
	qs("[data-link]", body)?.addEventListener("click", async () => {
		if ((await requestLink(email)).ok) toast("Link sent. Your answers wait unseen on our server for 24 hours, then are deleted.");
	});
	qs("[data-change]", body).addEventListener("click", stageList);
	qs("#gifting-answers-code-form", body).addEventListener("submit", async (e) => {
		e.preventDefault();
		const code = digits.map((d) => d.value).join("");
		if (code.length < 6) {
			err.textContent = "Enter all 6 digits.";
			return;
		}
		const btn = qs("button[type=submit]", body);
		btn.disabled = true;
		const prefs = {
			credit: qs("input[name=gifting-credit]:checked", body).value,
			publish: qs("input[name=gifting-publish]", body).checked,
			newsletter: qs("input[name=gifting-newsletter]", body).checked
		};
		const waiting = {
			drafts: store.drafts(),
			picks: store.picks(),
			keeps: store.keeps(),
			landed: store.landed()
		};
		const rows = signInRows(await loadData(), waiting);
		const send = (logoutOthers) => verifyCode(email, code, {
			prefs,
			rows,
			logoutOthers
		});
		const res = await send(false);
		if (res.session_limit) {
			stageSessions(res, send, (ok) => finish(ok, prefs, waiting, rows));
			return;
		}
		if (!res.ok) {
			btn.disabled = false;
			err.textContent = res.error;
			digits.forEach((d) => {
				d.value = "";
			});
			digits[0].focus();
			return;
		}
		finish(res, prefs, waiting, rows);
	});
}
async function finish(res, prefs, waiting, rows) {
	const sent = await submitAnswers({
		email,
		prefs,
		rows,
		...waiting
	});
	store.clearDrafts();
	store.signIn(email, prefs);
	stageDone(sent);
	pull(waiting.picks);
}
function stageSessions(res, send, done) {
	header("One more step", email, "You’re signed in on two other devices");
	const body = qs("[data-stage]", root);
	body.className = "modal-body second-stage";
	body.innerHTML = `<p class="login-otp-form-prompt">A Ken account can be signed in on two devices at a time. Sign the others out to continue here; your answers are still waiting in this browser.</p>
    <div class="login-signup-otp-modal__sessions">${res.sessions || ""}</div>
    <p class="login-signup-otp-modal__error" role="alert" data-error></p>
    <button type="button" class="btn btn-primary passwordless-login-form-continue-btn" data-logout-others style="width:100%">Sign out other devices and continue</button>
    <div class="login-signup-otp-modal__links"><button type="button" data-cancel>Not now</button></div>`;
	const err = qs("[data-error]", body);
	qs("[data-cancel]", body).addEventListener("click", () => modal.hide());
	qs("[data-logout-others]", body).addEventListener("click", async (e) => {
		const btn = e.currentTarget;
		btn.disabled = true;
		const again = await send(true);
		if (!again.ok) {
			btn.disabled = false;
			err.textContent = again.error;
			return;
		}
		done(again);
	});
}
async function pull(first = []) {
	if (!wp || !store.user()) return;
	const [data, res] = await Promise.all([loadData(), getAnswers()]);
	if (!res.ok || !Array.isArray(res.rows)) return;
	store.setLists(fromRows(data, res.rows, {
		first,
		max: 3
	}));
	document.dispatchEvent(new CustomEvent("gifting:signed-in"));
}
function stageDone(sent) {
	header("Done", email, sent.words + sent.counted ? "Sent, in one go." : "You’re signed in.");
	const body = qs("[data-stage]", root);
	body.className = "modal-body third-stage";
	body.innerHTML = `${sent.words + sent.counted ? `<div class="login-signup-otp-modal__done">
      <b>${sent.words}</b><span>${sent.words === 1 ? "answer in words is" : "answers in words are"} with the editor. We’ll email you if one is published.</span>
      <b>${sent.counted}</b><span>${sent.counted === 1 ? "tap or number is" : "taps and numbers are"} now counted on the page.</span>
    </div>` : ""}
    <p class="login-otp-form-prompt">From here on, anything you answer on either half of the guide saves as you go. Your +1s and kept gifts are linked to your account. If you change an answer, the newest one counts.</p>
    <button type="button" class="btn btn-primary passwordless-login-form-continue-btn" data-bs-dismiss="modal" style="margin-top:14px;width:100%">Keep exploring</button>`;
}
function stageSignedIn() {
	header("Signed in", store.user(), "Your answers save as you go.");
	const body = qs("[data-stage]", root);
	body.className = "modal-body third-stage";
	body.innerHTML = `<p class="login-otp-form-prompt">Words go to the editor; taps count straight away. We’ll email you if anything you wrote is published.</p>
    <div class="login-signup-otp-modal__links"><button type="button" data-signout>Sign out of this browser</button></div>`;
	qs("[data-signout]", body).addEventListener("click", async (e) => {
		const btn = e.currentTarget;
		btn.disabled = true;
		const res = await signOut();
		if (!res.ok) {
			btn.disabled = false;
			toast(res.error);
			return;
		}
		store.signOut();
		if (wp && !res.nonces) {
			window.location.reload();
			return;
		}
		modal.hide();
		toast("Signed out of this browser");
	});
}
function openAnswers(why) {
	ensure();
	reason = why || "";
	if (store.user()) stageSignedIn();
	else stageList();
	modal.show();
}
function initAnswers() {
	document.addEventListener("gifting:open-answers", (e) => openAnswers(e.detail && e.detail.reason));
	pull();
	if (wp) return;
	qs("nav.navbar .nav-signin button")?.addEventListener("click", (e) => {
		e.preventDefault();
		openAnswers();
	});
}
//#endregion
export { initAnswers as t };
