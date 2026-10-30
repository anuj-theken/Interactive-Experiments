//#region src/assets/scripts/collections/collections-fanned-carousel.js
document.addEventListener("DOMContentLoaded", function() {
	document.querySelectorAll(".collections-fanned-carousel").forEach(function(section) {
		var cards = section.querySelectorAll(".collections-fanned-card");
		var prevBtn = section.querySelector(".collections-fanned-prev");
		var nextBtn = section.querySelector(".collections-fanned-next");
		if (!cards.length || !prevBtn || !nextBtn) return;
		var totalCards = cards.length;
		var centerIndex = 0;
		var positionClasses = [
			"pos-0",
			"pos-1",
			"pos-2",
			"pos-3",
			"pos-4",
			"pos-hidden"
		];
		function getPositionClass(offset) {
			switch (offset) {
				case -2: return "pos-0";
				case -1: return "pos-1";
				case 0: return "pos-2";
				case 1: return "pos-3";
				case 2: return "pos-4";
				default: return "pos-hidden";
			}
		}
		function removeAllPositionClasses(card) {
			for (var j = 0; j < positionClasses.length; j++) card.classList.remove(positionClasses[j]);
		}
		function updatePositions() {
			for (var i = 0; i < totalCards; i++) {
				var offset = i - centerIndex;
				if (offset > Math.floor(totalCards / 2)) offset -= totalCards;
				if (offset < -Math.floor(totalCards / 2)) offset += totalCards;
				removeAllPositionClasses(cards[i]);
				cards[i].classList.add(getPositionClass(offset));
			}
		}
		var isStatic = section.classList.contains("collections-fanned-carousel--static");
		var autoPlayInterval = isStatic ? null : setInterval(function() {
			centerIndex = (centerIndex + 1) % totalCards;
			updatePositions();
		}, 3e3);
		function resetAutoPlay() {
			clearInterval(autoPlayInterval);
			if (isStatic) return;
			autoPlayInterval = setInterval(function() {
				centerIndex = (centerIndex + 1) % totalCards;
				updatePositions();
			}, 3e3);
		}
		prevBtn.addEventListener("click", function() {
			centerIndex = (centerIndex - 1 + totalCards) % totalCards;
			updatePositions();
			resetAutoPlay();
		});
		nextBtn.addEventListener("click", function() {
			centerIndex = (centerIndex + 1) % totalCards;
			updatePositions();
			resetAutoPlay();
		});
		var cardsContainer = section.querySelector(".collections-fanned-cards");
		var touchStartX = 0;
		var touchStartY = 0;
		var isSwiping = false;
		cardsContainer.addEventListener("touchstart", function(e) {
			touchStartX = e.touches[0].clientX;
			touchStartY = e.touches[0].clientY;
			isSwiping = true;
		}, { passive: true });
		cardsContainer.addEventListener("touchend", function(e) {
			if (!isSwiping) return;
			isSwiping = false;
			var touchEndX = e.changedTouches[0].clientX;
			var touchEndY = e.changedTouches[0].clientY;
			var diffX = touchEndX - touchStartX;
			var diffY = touchEndY - touchStartY;
			if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
				if (diffX < 0) centerIndex = (centerIndex + 1) % totalCards;
				else centerIndex = (centerIndex - 1 + totalCards) % totalCards;
				updatePositions();
				resetAutoPlay();
			}
		}, { passive: true });
		updatePositions();
	});
});
//#endregion
