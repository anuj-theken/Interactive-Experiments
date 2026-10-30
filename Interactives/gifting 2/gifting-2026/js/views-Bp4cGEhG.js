//#region src/assets/scripts/gifting-2026/views.js
function mountView() {
	const slot = document.querySelector("[data-gifting-view-slot]");
	if (!slot) return;
	const name = new URLSearchParams(window.location.search).get("view") || "landing";
	const view = document.querySelector(`template[data-view="${CSS.escape(name)}"]`) || document.querySelector("template[data-view=\"landing\"]");
	slot.replaceWith(view.content.cloneNode(true));
	document.body.dataset.gifting = view.dataset.view;
	if (view.dataset.title) document.title = view.dataset.title;
	const description = document.querySelector("meta[name=\"description\"]");
	if (description && view.dataset.description) description.content = view.dataset.description;
}
//#endregion
export { mountView as t };
