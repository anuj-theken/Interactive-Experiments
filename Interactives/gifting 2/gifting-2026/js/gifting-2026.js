import "./vendor-qadh9zQP.js";
import "./bookmark-BffW8ula.js";
import "./collections-fanned-carousel-C9Y-wuVt.js";
import "./config-DBYw5SRk.js";
import { t as loadData } from "./data-DekMyr86.js";
import { g as trackNavHeight, i as initDraftsPill } from "./ui-CSHVKqjF.js";
import { t as initAnswers } from "./answers-CKDa_ZBT.js";
import { n as syncPicks } from "./picks-BkUKK73f.js";
import { n as initPhilosophies } from "./philosophies-veSXO3JT.js";
import { n as syncKeeps } from "./keeps-UoUJVwJN.js";
import { t as initBelief } from "./belief-BlbubVtm.js";
import { t as initMine } from "./mine-dIwpg_1c.js";
import { t as initRecommendations } from "./recommendations-C-miu17v.js";
import { t as initSection } from "./section-DJ9pQcND.js";
import { t as initKept } from "./kept-BtEDmnmY.js";
import { t as initIndexNav } from "./index-nav-wy5BdgH1.js";
import { t as initPaperInputs } from "./paper-inputs-Zd6hK1Vc.js";
import { t as mountView } from "./views-Bp4cGEhG.js";
//#region src/assets/scripts/entries/gifting-2026.js
mountView();
var PAPER_INPUTS = true;
var pages = {
	landing: null,
	philosophies: initPhilosophies,
	belief: initBelief,
	mine: initMine,
	recommendations: initRecommendations,
	section: initSection,
	kept: initKept
};
var page = document.body.dataset.gifting;
if (page in pages) {
	trackNavHeight();
	initDraftsPill();
	initAnswers();
	document.addEventListener("gifting:signed-in", syncPicks);
	document.addEventListener("gifting:signed-in", syncKeeps);
	if (pages[page]) pages[page](loadData);
	initIndexNav();
	initPaperInputs(PAPER_INPUTS);
}
//#endregion
