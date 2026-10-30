// Sign in and send, inside whichever pop-up hosts it (the checkout, "Your three", or the header's Sign in).
// Steps: what's waiting + email → 6-digit code + how to credit you → (sign other devices out) → sent.
// Same flow and server calls as the 2026 build's answers.js, drawn in this site's style.
import { wp } from './config.js';
import { loadData } from './data.js';
import { signInRows, fromRows } from './rows.js';
import { signOut, verifyCode, requestLink, isEmail, requestCode, submitAnswers, getAnswers } from './api.js';
import { store } from './store.js';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
let email = '';
let toast = () => {};
export function configureSignIn(opts) { if (opts.toast) toast = opts.toast; }

const kindLabel = (k) => (k === 'text' ? 'words' : k === 'number' ? 'number' : 'tap');
const waiting = () => {
  const drafts = store.drafts();
  return { drafts, keys: Object.keys(drafts).sort((a, b) => drafts[a].ts - drafts[b].ts) };
};
// what will be sent: drafts plus the +1s and kept gifts, which are lists rather than drafts
export function waitingCount() {
  const { keys } = waiting();
  return new Set([...keys, ...store.picks().map((id) => `plus:${id}`), ...store.keeps().map((id) => `keep:${id}`)]).size;
}

export function renderSignIn(host, opts = {}) {
  if (!host) return;
  if (store.user()) stageSignedIn(host); else stageEmail(host, opts);
}

function stageEmail(host, { title } = {}) {
  const { drafts, keys } = waiting();
  const n = waitingCount();
  const words = keys.filter((k) => drafts[k].kind === 'text').length;
  host.className = 'send';
  host.innerHTML = `<div class="send-head"><span class="label">Step 1 of 2 · ${n ? `${n} waiting in this browser` : 'Nothing waiting yet'}</span>
      <h4>${esc(title || (n ? 'Send these to The Ken' : 'Sign in to save as you go'))}</h4></div>
    <p class="send-p">${n ? 'Nothing leaves your browser until you confirm your email. One free Ken account, no password: we send you a 6-digit code.' : 'Answer anything and it waits here. Or sign in now, and your answers save as you go.'}</p>
    ${keys.length ? `<details class="send-list"><summary>See what’s waiting (${keys.length} ${keys.length === 1 ? 'answer' : 'answers'}${words ? `, ${words} in words` : ''})</summary><ul>${keys.map((k) => {
      const d = drafts[k], v = String(d.value), show = d.kind !== 'tap' || d.value !== 1;
      return `<li><span class="kind ${d.kind === 'text' ? 'w' : ''}">${kindLabel(d.kind)}</span><span>${esc(d.label)}${show ? `<small>“${esc(v.slice(0, 90))}${v.length > 90 ? '…' : ''}”</small>` : ''}</span><button type="button" data-remove="${esc(k)}" aria-label="Remove this answer">×</button></li>`;
    }).join('')}</ul></details>` : ''}
    <form class="send-row" novalidate><label class="vh" for="send-email">Email address</label>
      <input type="email" id="send-email" autocomplete="email" spellcheck="false" placeholder="you@example.com" value="${esc(email)}">
      <button type="submit" class="pill red">Send me a code</button></form>
    <p class="send-err" role="alert" data-error></p>
    <p class="send-fine">Already a Ken subscriber? Use that email and it links to your account.</p>`;
  host.querySelectorAll('[data-remove]').forEach((b) => b.addEventListener('click', () => { store.removeDraft(b.dataset.remove); stageEmail(host, { title }); }));
  host.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = host.querySelector('#send-email'), btn = host.querySelector('button[type=submit]'), err = host.querySelector('[data-error]');
    const v = input.value.trim();
    if (!isEmail(v)) { err.textContent = 'That email doesn’t look right. Check it and try again.'; input.focus(); return; }
    btn.disabled = true; btn.textContent = 'Sending…';
    const res = await requestCode(v);
    btn.disabled = false; btn.textContent = 'Send me a code';
    if (!res.ok) { err.textContent = res.error; return; }
    email = v;
    stageCode(host, { title });
  });
}

function stageCode(host, opts) {
  const n = waitingCount();
  host.className = 'send';
  host.innerHTML = `<div class="send-head"><span class="label">Step 2 of 2 · code sent to ${esc(email)}</span><h4>Enter the 6-digit code</h4></div>
    <p class="send-p">Keep this tab open: your answers are here, not on our server yet.${wp ? '' : ' <span class="ph">Preview: the code is 000000</span>'}</p>
    <form novalidate autocomplete="off">
      <div class="otp" role="group" aria-label="6-digit code">${[1, 2, 3, 4, 5, 6].map((i) => `<input type="text" inputmode="numeric" pattern="[0-9]*" ${i === 1 ? 'autocomplete="one-time-code"' : 'maxlength="1" autocomplete="off"'} aria-label="Digit ${i}">`).join('')}</div>
      <p class="send-err" role="alert" data-error></p>
      <div class="send-links"><button type="button" data-resend>Resend code</button>${wp ? '' : '<button type="button" data-link>Use a link instead</button>'}<button type="button" data-change>Change email</button></div>
      <fieldset class="send-choices"><legend>If we publish anything you wrote, credit it as</legend>
        <label><input type="radio" name="gk-credit" value="initials" checked> Initials and city</label>
        <label><input type="radio" name="gk-credit" value="age"> “A reader” and your age band</label>
        <label><input type="radio" name="gk-credit" value="count-only"> Don’t publish my words, just count them</label></fieldset>
      <fieldset class="send-choices"><legend>Permissions</legend>
        <label><input type="checkbox" name="gk-publish" checked> The Ken may publish my words, lightly edited</label>
        <label><input type="checkbox" name="gk-newsletter"> Also send me First Principles, the free newsletter</label></fieldset>
      <button type="submit" class="pill red send-go">Confirm${n ? ` and send ${n}` : ''}</button>
      <p class="send-fine">We use your email to confirm it’s you and to tell you if your words are published. You can see, change or delete your answers at any time.</p>
      <p class="send-fine"><span class="ph">Consent notice: DPDP Act wording to come from legal</span></p>
    </form>`;
  const digits = [...host.querySelectorAll('.otp input')], err = host.querySelector('[data-error]');
  digits.forEach((input, i) => {
    input.addEventListener('input', () => {
      const typed = input.value.replace(/\D/g, '');
      if (i === 0 && typed.length > 1) { digits.forEach((d, j) => { d.value = typed[j] || ''; }); digits[Math.min(typed.length, 6) - 1].focus(); return; }
      input.value = typed.slice(-1);
      if (input.value && digits[i + 1]) digits[i + 1].focus();
    });
    input.addEventListener('keydown', (e) => { if (e.key === 'Backspace' && !input.value && digits[i - 1]) digits[i - 1].focus(); });
    input.addEventListener('paste', (e) => {
      const text = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').slice(0, 6);
      if (!text) return;
      e.preventDefault();
      digits.forEach((d, j) => { d.value = text[j] || ''; });
      digits[Math.min(text.length, 5)].focus();
    });
  });
  setTimeout(() => digits[0].focus({ preventScroll: true }), 50);
  host.querySelector('[data-resend]').addEventListener('click', async (e) => {
    const b = e.currentTarget; b.disabled = true;
    const res = await requestCode(email);
    b.disabled = false; err.textContent = res.ok ? '' : res.error;
    if (res.ok) toast('New code sent');
  });
  host.querySelector('[data-link]')?.addEventListener('click', async () => {
    if ((await requestLink(email)).ok) toast('Link sent. Your answers wait unseen on our server for 24 hours, then are deleted.');
  });
  host.querySelector('[data-change]').addEventListener('click', () => stageEmail(host, opts));
  host.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const code = digits.map((d) => d.value).join('');
    if (code.length < 6) { err.textContent = 'Enter all 6 digits.'; return; }
    const btn = host.querySelector('.send-go'); btn.disabled = true;
    const prefs = {
      credit: host.querySelector('input[name=gk-credit]:checked').value,
      publish: host.querySelector('input[name=gk-publish]').checked,
      newsletter: host.querySelector('input[name=gk-newsletter]').checked
    };
    const held = { drafts: store.drafts(), picks: store.picks(), keeps: store.keeps(), landed: store.landed() };
    const rows = signInRows(await loadData(), held);
    const send = (logoutOthers) => verifyCode(email, code, { prefs, rows, logoutOthers });
    const res = await send(false);
    if (res.session_limit) { stageSessions(host, res, send, (ok) => finish(host, ok, prefs, held, rows)); return; }
    if (!res.ok) { btn.disabled = false; err.textContent = res.error; digits.forEach((d) => { d.value = ''; }); digits[0].focus(); return; }
    finish(host, res, prefs, held, rows);
  });
}

async function finish(host, res, prefs, held, rows) {
  const sent = await submitAnswers({ email, prefs, rows, ...held });
  store.clearDrafts();
  store.signIn(email, prefs);
  stageDone(host, sent);
  pull(held.picks);
}

function stageSessions(host, res, send, done) {
  host.className = 'send';
  host.innerHTML = `<div class="send-head"><span class="label">One more step · ${esc(email)}</span><h4>You’re signed in on two other devices</h4></div>
    <p class="send-p">A Ken account can be signed in on two devices at a time. Sign the others out to continue here; your answers are still waiting in this browser.</p>
    <div class="send-sessions">${res.sessions || ''}</div><p class="send-err" role="alert" data-error></p>
    <button type="button" class="pill red send-go" data-logout-others>Sign out other devices and continue</button>
    <div class="send-links"><button type="button" data-cancel>Not now</button></div>`;
  const err = host.querySelector('[data-error]');
  host.querySelector('[data-cancel]').addEventListener('click', () => stageEmail(host));
  host.querySelector('[data-logout-others]').addEventListener('click', async (e) => {
    const b = e.currentTarget; b.disabled = true;
    const again = await send(true);
    if (!again.ok) { b.disabled = false; err.textContent = again.error; return; }
    done(again);
  });
}

function stageDone(host, sent) {
  const any = sent.words + sent.counted;
  host.className = 'send done';
  host.innerHTML = `<div class="send-head"><span class="label">Done · ${esc(email)}</span><h4>${any ? 'Sent, in one go.' : 'You’re signed in.'}</h4></div>
    ${any ? `<div class="send-done"><b>${sent.words}</b><span>${sent.words === 1 ? 'answer in words is' : 'answers in words are'} with the editor. We’ll email you if one is published.</span>
      <b>${sent.counted}</b><span>${sent.counted === 1 ? 'tap or number is' : 'taps and numbers are'} now counted.</span></div>` : ''}
    <p class="send-p">From here on, anything you answer on either half of the guide saves as you go. If you change an answer, the newest one counts.</p>`;
}

function stageSignedIn(host) {
  host.className = 'send done';
  host.innerHTML = `<div class="send-head"><span class="label">Signed in · ${esc(store.user())}</span><h4>Your answers save as you go</h4></div>
    <p class="send-p">Words go to the editor; taps count straight away. We’ll email you if anything you wrote is published.</p>
    <div class="send-links"><button type="button" data-signout>Sign out of this browser</button></div>`;
  host.querySelector('[data-signout]').addEventListener('click', async (e) => {
    const b = e.currentTarget; b.disabled = true;
    const res = await signOut();
    if (!res.ok) { b.disabled = false; toast(res.error); return; }
    store.signOut();
    if (wp && !res.nonces) { window.location.reload(); return; }
    toast('Signed out of this browser');
    stageEmail(host);
  });
}

// After signing in, bring back the +1s, kept gifts and given gifts saved to the account
export async function pull(first = []) {
  if (!wp || !store.user()) return;
  const [data, res] = await Promise.all([loadData(), getAnswers()]);
  if (!res.ok || !Array.isArray(res.rows)) return;
  store.setLists(fromRows(data, res.rows, { first, max: 3 }));
  document.dispatchEvent(new CustomEvent('gifting:signed-in'));
}
