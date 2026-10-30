//#region src/assets/scripts/gifting-2026/share-image.js
var W = 1080;
var H = 1350;
var PAD = 80;
var CARD_W = 800;
var CARD_PAD = 44;
var TILTS = [
	-2.2,
	1.8,
	-1.2
];
var NUDGE = [
	-16,
	20,
	-6
];
var FONTS = [
	"400 64px \"Reckless Medium\"",
	"600 44px \"Reckless Italic\"",
	"700 44px \"Reckless Bold\"",
	"600 22px Archivo",
	"400 24px Archivo"
];
function wrap(ctx, text, width) {
	const lines = [];
	let line = "";
	text.split(/\s+/).forEach((word) => {
		const next = line ? `${line} ${word}` : word;
		if (line && ctx.measureText(next).width > width) {
			lines.push(line);
			line = word;
		} else line = next;
	});
	if (line) lines.push(line);
	return lines;
}
function spaced(ctx, px) {
	if ("letterSpacing" in ctx) ctx.letterSpacing = `${px}px`;
}
async function philosophyImage({ eyebrow, title, cards, footer, colors }) {
	await Promise.all(FONTS.map((f) => document.fonts.load(f)));
	const canvas = document.createElement("canvas");
	canvas.width = W;
	canvas.height = H;
	const ctx = canvas.getContext("2d");
	const titleFont = "400 64px \"Reckless Medium\"";
	ctx.font = titleFont;
	const titleLines = wrap(ctx, title, W - PAD * 2);
	const headerH = 60 + titleLines.length * 72 + 40;
	const footerH = 120;
	let size = 46;
	let layout;
	for (; size >= 28; size -= 2) {
		ctx.font = `600 ${size}px "Reckless Italic"`;
		const lh = Math.round(size * 1.18);
		layout = cards.map((c) => {
			const lines = wrap(ctx, c.headline, CARD_W - CARD_PAD * 2);
			return {
				...c,
				lines,
				lh,
				h: 150 + (lines.length + 1) * lh
			};
		});
		const cardsH = layout.reduce((n, c) => n + c.h, 0) + (layout.length - 1) * 28;
		if (PAD + headerH + cardsH + footerH <= H) break;
	}
	ctx.fillStyle = colors.table;
	ctx.fillRect(0, 0, W, H);
	ctx.textAlign = "center";
	ctx.textBaseline = "alphabetic";
	ctx.fillStyle = colors.primary;
	ctx.font = "600 22px Archivo";
	spaced(ctx, 4);
	ctx.fillText(eyebrow.toUpperCase(), W / 2, PAD + 22);
	spaced(ctx, 0);
	ctx.fillStyle = colors.light;
	ctx.font = titleFont;
	titleLines.forEach((line, i) => ctx.fillText(line, W / 2, PAD + 60 + 56 + i * 72));
	let y = PAD + headerH;
	layout.forEach((c, i) => {
		ctx.save();
		ctx.translate(W / 2 + NUDGE[i % 3], y + c.h / 2);
		ctx.rotate(TILTS[i % 3] * Math.PI / 180);
		const x0 = -CARD_W / 2;
		const y0 = -c.h / 2;
		ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
		ctx.shadowBlur = 48;
		ctx.shadowOffsetY = 22;
		ctx.fillStyle = colors.light;
		ctx.fillRect(x0, y0, CARD_W, c.h);
		ctx.shadowColor = "transparent";
		ctx.fillStyle = c.paper;
		ctx.fillRect(x0, y0, CARD_W, c.h);
		ctx.textAlign = "left";
		let ty = y0 + CARD_PAD + 18;
		ctx.fillStyle = colors.primary;
		ctx.font = "600 20px Archivo";
		spaced(ctx, 3);
		ctx.fillText(c.label.toUpperCase(), x0 + CARD_PAD, ty);
		spaced(ctx, 0);
		ty += 22 + c.lh;
		ctx.fillStyle = colors.ink;
		ctx.font = `600 ${size}px "Reckless Italic"`;
		c.lines.forEach((line) => {
			ctx.fillText(line, x0 + CARD_PAD, ty - c.lh * .25);
			ty += c.lh;
		});
		ty += 30;
		ctx.fillStyle = colors.primary;
		ctx.font = "700 44px \"Reckless Bold\"";
		ctx.fillText(c.count, x0 + CARD_PAD, ty);
		const countW = ctx.measureText(c.count).width;
		ctx.fillStyle = colors.muted;
		ctx.font = "600 20px Archivo";
		spaced(ctx, 2);
		ctx.fillText(c.unit.toUpperCase(), x0 + CARD_PAD + countW + 12, ty);
		spaced(ctx, 0);
		if (c.rare) {
			ctx.translate(x0 + 28, y0 - 6);
			ctx.rotate(-3 * Math.PI / 180);
			ctx.font = "600 20px Archivo";
			spaced(ctx, 2);
			const label = "THE RARE ONE";
			const w = ctx.measureText(label).width + 28;
			ctx.fillStyle = colors.primary;
			ctx.fillRect(0, -18, w, 36);
			ctx.fillStyle = colors.light;
			ctx.fillText(label, 14, 7);
			spaced(ctx, 0);
		}
		ctx.restore();
		y += c.h + 28;
	});
	ctx.textAlign = "center";
	ctx.fillStyle = colors.lightMuted;
	ctx.font = "400 24px Archivo";
	ctx.fillText(footer, W / 2, H - PAD + 10);
	return new Promise((resolve, reject) => {
		canvas.toBlob((blob) => blob ? resolve(blob) : reject(/* @__PURE__ */ new Error("Image failed")), "image/png");
	});
}
//#endregion
export { philosophyImage as t };
