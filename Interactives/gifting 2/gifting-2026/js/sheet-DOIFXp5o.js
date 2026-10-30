import { n as Modal } from "./vendor-qadh9zQP.js";
//#region src/assets/scripts/gifting-2026/sheet.js
var modal;
var body;
function ensure() {
	if (modal) return;
	const el = document.createElement("div");
	el.className = "modal fade nudge-modal nudge-modal--card-back";
	el.id = "gifting-card-back";
	el.tabIndex = -1;
	el.setAttribute("aria-labelledby", "gifting-card-back-title");
	el.setAttribute("aria-hidden", "true");
	el.innerHTML = `<div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M1 1l10 10M11 1L1 11" stroke="#321F1F" stroke-width="1.5"/></svg>
      </button>
      <div class="nudge-modal__body"></div>
    </div>
  </div>`;
	document.body.appendChild(el);
	body = el.querySelector(".nudge-modal__body");
	modal = new Modal(el);
	bindSwipe(el.querySelector(".modal-content"));
}
function bindSwipe(surface) {
	let x0 = null;
	let y0 = 0;
	surface.addEventListener("touchstart", (e) => {
		x0 = e.touches.length === 1 ? e.touches[0].clientX : null;
		y0 = e.touches.length === 1 ? e.touches[0].clientY : 0;
	}, { passive: true });
	surface.addEventListener("touchend", (e) => {
		if (x0 === null) return;
		const dx = e.changedTouches[0].clientX - x0;
		const dy = e.changedTouches[0].clientY - y0;
		x0 = null;
		if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
		if (e.target.closest("input, textarea")) return;
		const [prev, next] = body.querySelectorAll("[data-go]");
		const go = dx > 0 ? prev : next;
		if (go) go.click();
	});
}
function openSheet(html, onRender) {
	ensure();
	body.innerHTML = html;
	if (onRender) onRender(body);
	modal.show();
}
//#endregion
export { openSheet as t };
