//#region src/assets/scripts/components/actions/bookmark.js
jQuery(document).on("click", function(event) {
	if (jQuery(event.target).closest(".bookmark-icon-container").length > 0) {
		const bookmarkIcon = jQuery(event.target).closest(".bookmark-icon-container");
		if (bookmarkIcon.hasClass("bookmarked") ? true : false) {
			bookmarkIcon.removeClass("bookmarked");
			bookmarkIcon.removeClass("checked");
			bookmarkIcon.removeClass("added");
		} else {
			bookmarkIcon.addClass("bookmarked");
			bookmarkIcon.addClass("checked");
			const timeout = setTimeout(() => {
				bookmarkIcon.removeClass("checked");
				clearTimeout(timeout);
				bookmarkIcon.addClass("added");
			}, 2e3);
		}
	}
});
//#endregion
